/**
 * Tazamart backend (Google Apps Script web app), hardened version.
 *
 * Deploy as: Web app · Execute as "Me" · Who has access "Anyone".
 * See backend/SETUP.md for the full setup guide.
 *
 * Script Properties (Project Settings → Script Properties). NEVER put these in the frontend:
 *   ADMIN_PASSWORD_SHA256  hex SHA-256 of the admin password
 *   SESSION_SECRET         long random string used to sign admin session tokens (HMAC-SHA256)
 *   SPREADSHEET_ID         (optional) ID of the Google Sheet; defaults to the bound spreadsheet
 *   IMAGE_FOLDER_ID        (optional) Drive folder for product images (made link-viewable)
 *   PROOF_FOLDER_ID        (optional) Drive folder for payment proofs (kept private)
 *
 * API (all POST bodies are JSON sent as text/plain so the browser skips a CORS preflight):
 *   GET                                  → { ok, products }                (public catalogue only)
 *   POST {action:'addOrder', order}      → { ok, orderId }                 (public)
 *   POST {action:'lookupOrder', orderId, phone} → { ok, order }            (public; must match both)
 *   POST {action:'login', password}      → { ok, token, expiresAt }        (rate-limited)
 *   POST {action:'listOrders', token}    → { ok, orders }                  (admin)
 *   POST {action:'getPaymentProof', token, orderId} → { ok, dataUrl }      (admin)
 *   POST {action:'updateOrderStatus', token, orderId, status}              (admin)
 *   POST {action:'add'|'edit', token, product}                              (admin)
 *   POST {action:'delete', token, id}                                       (admin)
 */

var SESSION_TTL_SECONDS = 60 * 60 * 8;    // 8 hours
var MAX_FAILS = 5;                         // failed logins before lockout
var FAIL_WINDOW_SECONDS = 15 * 60;         // window for counting failures
var LOCK_SECONDS = 15 * 60;                // lockout duration
var ORDER_STATUSES = ['Pending', 'Packed', 'Delivered'];
var MAX_ORDER_ITEMS = 100;

var PRODUCT_HEADERS = ['id', 'name', 'price', 'image', 'category', 'unit', 'description'];
var ORDER_HEADERS = ['id', 'orderDate', 'status', 'name', 'phone', 'address', 'items', 'total', 'paymentMethod', 'paymentProofFileId'];

/* ------------------------------------------------------------------ entry points */

function doGet(e) {
  try {
    return json_({ ok: true, products: readProducts_() });
  } catch (err) {
    return json_({ ok: false, error: 'server_error' });
  }
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'bad_json' });
  }
  var action = String(body.action || '');
  try {
    switch (action) {
      // ---- public
      case 'addOrder':        return json_(addOrder_(body.order));
      case 'lookupOrder':     return json_(lookupOrder_(body.orderId, body.phone));
      case 'login':           return json_(login_(body.password));
      // ---- admin only
      case 'listOrders':        requireAdmin_(body.token); return json_({ ok: true, orders: listOrders_() });
      case 'getPaymentProof':   requireAdmin_(body.token); return json_(getPaymentProof_(body.orderId));
      case 'updateOrderStatus': requireAdmin_(body.token); return json_(updateOrderStatus_(body.orderId, body.status));
      case 'add':               requireAdmin_(body.token); return json_(upsertProduct_(body.product, false));
      case 'edit':              requireAdmin_(body.token); return json_(upsertProduct_(body.product, true));
      case 'delete':            requireAdmin_(body.token); return json_(deleteProduct_(body.id));
      case 'verifySession':     requireAdmin_(body.token); return json_({ ok: true });
      default:                  return json_({ ok: false, error: 'unknown_action' });
    }
  } catch (err) {
    if (err && err.code === 'unauthorized') return json_({ ok: false, error: 'unauthorized' });
    if (err && err.code === 'bad_request') return json_({ ok: false, error: 'bad_request', message: err.message });
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  }
}

/* ------------------------------------------------------------------ auth */

function props_() { return PropertiesService.getScriptProperties(); }

function login_(password) {
  var cache = CacheService.getScriptCache();
  if (cache.get('login_locked')) return { ok: false, error: 'locked', retryAfterSeconds: LOCK_SECONDS };

  // Constant delay to slow down guessing.
  Utilities.sleep(700);

  var expected = String(props_().getProperty('ADMIN_PASSWORD_SHA256') || '').toLowerCase();
  if (!expected || !props_().getProperty('SESSION_SECRET')) return { ok: false, error: 'not_configured' };

  if (typeof password !== 'string' || password.length > 200 || !safeEqual_(sha256Hex_(password), expected)) {
    var lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      var fails = Number(cache.get('login_fails') || 0) + 1;
      cache.put('login_fails', String(fails), FAIL_WINDOW_SECONDS);
      if (fails >= MAX_FAILS) {
        cache.put('login_locked', '1', LOCK_SECONDS);
        cache.remove('login_fails');
      }
    } finally { lock.releaseLock(); }
    return { ok: false, error: 'invalid_credentials' };
  }

  cache.remove('login_fails');
  var exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return { ok: true, token: signToken_({ sub: 'admin', exp: exp, n: Utilities.getUuid() }), expiresAt: exp * 1000 };
}

function signToken_(payload) {
  var body = b64url_(Utilities.newBlob(JSON.stringify(payload)).getBytes());
  return body + '.' + hmac_(body);
}

function hmac_(data) {
  var secret = props_().getProperty('SESSION_SECRET');
  return b64url_(Utilities.computeHmacSha256Signature(data, secret));
}

function requireAdmin_(token) {
  var err = { code: 'unauthorized' };
  if (typeof token !== 'string' || token.indexOf('.') < 0 || !props_().getProperty('SESSION_SECRET')) throw err;
  var parts = token.split('.');
  if (parts.length !== 2 || !safeEqual_(hmac_(parts[0]), parts[1])) throw err;
  var payload;
  try { payload = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString()); } catch (e) { throw err; }
  if (!payload || payload.sub !== 'admin' || !(payload.exp > Date.now() / 1000)) throw err;
  return payload;
}

function sha256Hex_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)
    .map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

function b64url_(bytes) { return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, ''); }

function safeEqual_(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  var r = 0;
  for (var i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/* ------------------------------------------------------------------ sheets */

function ss_() {
  var id = props_().getProperty('SPREADSHEET_ID');
  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
}

function sheet_(name, headers) {
  var ss = ss_();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function rows_(sh) {
  var values = sh.getDataRange().getValues();
  var headers = values.shift() || [];
  return values.map(function (row, i) {
    var o = { _row: i + 2 };
    headers.forEach(function (h, j) { o[h] = row[j]; });
    return o;
  });
}

function writeRow_(sh, headers, obj, rowIndex) {
  var row = headers.map(function (h) { return obj[h] === undefined ? '' : obj[h]; });
  if (rowIndex) sh.getRange(rowIndex, 1, 1, headers.length).setValues([row]);
  else sh.appendRow(row);
}

/* ------------------------------------------------------------------ products */

function readProducts_() {
  return rows_(sheet_('Products', PRODUCT_HEADERS)).filter(function (p) { return p.id !== ''; }).map(function (p) {
    return {
      id: p.id, name: String(p.name), price: Number(p.price), image: String(p.image),
      category: String(p.category), unit: String(p.unit), description: String(p.description || '')
    };
  });
}

function upsertProduct_(p, isEdit) {
  if (!p || !p.name) throw { code: 'bad_request', message: 'product.name required' };
  var sh = sheet_('Products', PRODUCT_HEADERS);
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var existing = rows_(sh).filter(function (r) { return String(r.id) === String(p.id); })[0];
    var image = existing ? existing.image : '';
    var data = p.imageBase64 || (String(p.image || '').indexOf('data:') === 0 ? p.image : null);
    if (data) image = saveImage_(data, 'IMAGE_FOLDER_ID', 'Tazamart product images', true, 'product-' + p.id);
    else if (p.image && String(p.image).indexOf('http') === 0) image = p.image;
    var row = {
      id: String(p.id || Date.now()), name: clip_(p.name, 120), price: Number(p.price) || 0, image: image,
      category: clip_(p.category, 40), unit: clip_(p.unit, 20), description: clip_(p.description, 1000)
    };
    writeRow_(sh, PRODUCT_HEADERS, row, isEdit && existing ? existing._row : (existing ? existing._row : null));
    return { ok: true, id: row.id };
  } finally { lock.releaseLock(); }
}

function deleteProduct_(id) {
  var sh = sheet_('Products', PRODUCT_HEADERS);
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var r = rows_(sh).filter(function (x) { return String(x.id) === String(id); })[0];
    if (r) sh.deleteRow(r._row);
    return { ok: true };
  } finally { lock.releaseLock(); }
}

/* ------------------------------------------------------------------ orders */

function addOrder_(o) {
  if (!o || !o.customer || !Array.isArray(o.items) || !o.items.length || o.items.length > MAX_ORDER_ITEMS)
    throw { code: 'bad_request', message: 'invalid order' };
  var c = o.customer;
  if (!c.name || !c.phone || !c.address) throw { code: 'bad_request', message: 'customer details required' };

  // Recompute the total from the server-side catalogue so clients can't change prices.
  var catalogue = {};
  readProducts_().forEach(function (p) { catalogue[String(p.id)] = p; });
  var items = o.items.map(function (it) {
    var p = catalogue[String(it.id)];
    var qty = Math.max(0, Math.min(1000, Number(it.quantity) || 0));
    return p ? { id: p.id, name: p.name, price: p.price, unit: p.unit, quantity: qty }
             : { id: it.id, name: clip_(it.name, 120), price: Number(it.price) || 0, unit: clip_(it.unit, 20), quantity: qty, unverified: true };
  }).filter(function (it) { return it.quantity > 0; });
  var total = items.reduce(function (s, it) { return s + it.price * it.quantity; }, 0);

  var orderId = 'ORD-' + Date.now() + '-' + Utilities.getUuid().slice(0, 6).toUpperCase();
  var proofId = '';
  var proof = o.paymentProofBase64 || o.paymentProof;
  if (proof && String(proof).indexOf('data:') === 0) {
    proofId = saveImage_(proof, 'PROOF_FOLDER_ID', 'Tazamart payment proofs', false, orderId, true);
  }
  var sh = sheet_('Orders', ORDER_HEADERS);
  writeRow_(sh, ORDER_HEADERS, {
    id: orderId, orderDate: new Date(), status: 'Pending',
    name: clip_(c.name, 100), phone: clip_(c.phone, 30), address: clip_(c.address, 300),
    items: JSON.stringify(items), total: total,
    paymentMethod: o.paymentMethod === 'JazzCash' ? 'JazzCash' : 'Easypaisa',
    paymentProofFileId: proofId
  });
  return { ok: true, orderId: orderId, total: total };
}

function orderFromRow_(r, includePii) {
  var o = {
    id: String(r.id), orderDate: r.orderDate, status: String(r.status), total: Number(r.total),
    paymentMethod: String(r.paymentMethod), items: safeParse_(r.items, []),
    hasPaymentProof: !!r.paymentProofFileId
  };
  o.customer = includePii
    ? { name: String(r.name), phone: String(r.phone), address: String(r.address) }
    : { name: String(r.name).split(' ')[0], phone: maskPhone_(r.phone), address: '' };
  return o;
}

function listOrders_() {
  return rows_(sheet_('Orders', ORDER_HEADERS)).filter(function (r) { return r.id; })
    .map(function (r) { return orderFromRow_(r, true); });
}

function lookupOrder_(orderId, phone) {
  Utilities.sleep(300); // slow down enumeration
  if (!orderId || !phone) return { ok: false, error: 'not_found' };
  var want = normPhone_(phone);
  var r = rows_(sheet_('Orders', ORDER_HEADERS)).filter(function (x) {
    return String(x.id) === String(orderId) && normPhone_(x.phone) === want;
  })[0];
  return r ? { ok: true, order: orderFromRow_(r, false) } : { ok: false, error: 'not_found' };
}

function updateOrderStatus_(orderId, status) {
  if (ORDER_STATUSES.indexOf(status) < 0) throw { code: 'bad_request', message: 'invalid status' };
  var sh = sheet_('Orders', ORDER_HEADERS);
  var r = rows_(sh).filter(function (x) { return String(x.id) === String(orderId); })[0];
  if (!r) return { ok: false, error: 'not_found' };
  sh.getRange(r._row, ORDER_HEADERS.indexOf('status') + 1).setValue(status);
  return { ok: true };
}

function getPaymentProof_(orderId) {
  var r = rows_(sheet_('Orders', ORDER_HEADERS)).filter(function (x) { return String(x.id) === String(orderId); })[0];
  if (!r || !r.paymentProofFileId) return { ok: false, error: 'not_found' };
  var blob = DriveApp.getFileById(String(r.paymentProofFileId)).getBlob();
  return { ok: true, dataUrl: 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes()) };
}

/* ------------------------------------------------------------------ drive */

function folder_(propKey, defaultName) {
  var id = props_().getProperty(propKey);
  if (id) return DriveApp.getFolderById(id);
  var f = DriveApp.createFolder(defaultName);
  props_().setProperty(propKey, f.getId());
  return f;
}

/** Saves a data: URL. Public images return a viewable URL; private files return the file id. */
function saveImage_(dataUrl, folderKey, folderName, makePublic, name, returnId) {
  var m = /^data:(image\/(png|jpe?g|webp|gif));base64,(.+)$/.exec(String(dataUrl));
  if (!m) throw { code: 'bad_request', message: 'unsupported image' };
  var bytes = Utilities.base64Decode(m[3]);
  if (bytes.length > 5 * 1024 * 1024) throw { code: 'bad_request', message: 'image too large' };
  var file = folder_(folderKey, folderName).createFile(Utilities.newBlob(bytes, m[1], name));
  if (makePublic) file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return returnId ? file.getId() : 'https://lh3.googleusercontent.com/d/' + file.getId();
}

/* ------------------------------------------------------------------ utils */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function clip_(v, n) { return String(v == null ? '' : v).slice(0, n); }
function safeParse_(s, d) { try { return JSON.parse(s); } catch (e) { return d; } }
function normPhone_(p) { return String(p || '').replace(/\D/g, '').replace(/^92/, '0'); }
function maskPhone_(p) { var d = String(p || ''); return d.length > 4 ? d.slice(0, 4) + '****' + d.slice(-2) : '****'; }

/** Run once from the editor to create a random SESSION_SECRET. */
function generateSessionSecret() {
  var s = Utilities.getUuid() + Utilities.getUuid() + Utilities.getUuid();
  props_().setProperty('SESSION_SECRET', s.replace(/-/g, ''));
  Logger.log('SESSION_SECRET set (' + s.length + ' chars).');
}
