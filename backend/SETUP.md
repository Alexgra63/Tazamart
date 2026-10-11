# Vegelo backend: secure Apps Script setup

`backend/Code.gs` replaces the current Google Apps Script web app. It does the following:

- **Public:** GET returns the **product catalogue only**. No orders and no customer data.
- **Public:** `addOrder`. The server sets the order ID and recalculates the total from catalogue prices. `lookupOrder` needs **both the order ID and the phone number**, and returns the order without the address and with the phone masked.
- **Admin only:** `listOrders`, `getPaymentProof`, `updateOrderStatus`, and adding, editing or deleting products. Each of these needs a **signed session token**.
- **Login:** `login` checks the password against `ADMIN_PASSWORD_SHA256` stored in **Script Properties**. On success it returns an HMAC-SHA256 signed token that expires after **8 hours**. After **5 failed logins within 15 minutes**, all logins are locked for 15 minutes (CacheService). Every attempt also waits about 0.7 seconds.
- **Payment proofs** go to a private Drive folder and are only returned to an admin. Product images go to a folder whose files are viewable by link.

Nothing secret lives in the frontend. The frontend never sees the password hash or the signing secret.

> ⚠️ Until you finish **step 7**, the site keeps using the old script. The new frontend code only switches on when `VITE_BACKEND_AUTH=true` is set in Vercel.

---

## 1. Back up the current script and data
1. Open the Google Sheet behind the store. **File → Make a copy** gives you a backup.
2. In the Sheet, go to **Extensions → Apps Script**. Copy all of the old `Code.gs` into a text file somewhere safe.

## 2. Prepare the sheets
The new script uses two tabs, and it creates them automatically if they're missing:

| Tab | Columns (row 1, exact names) |
|---|---|
| `Products` | `id, name, price, image, category, unit, description` |
| `Orders` | `id, orderDate, status, name, phone, address, items, total, paymentMethod, paymentProofFileId` |

If your existing tabs use other names or columns, copy the data into tabs with exactly these headers, or rename them to match. In `Orders`, `items` holds JSON text.

## 3. Paste the new script
1. In the Apps Script editor, open `Code.gs`, select everything and paste the contents of `backend/Code.gs` from this repo.
2. Click **Save**.
3. If the script is **not** bound to the sheet (you created it at script.google.com), add a `SPREADSHEET_ID` property in step 4. The ID is the long part of the sheet URL between `/d/` and `/edit`.

## 4. Set Script Properties (the secrets)
Go to **Project Settings** (gear icon) → **Script Properties** → **Add script property**:

| Property | Value |
|---|---|
| `ADMIN_PASSWORD_SHA256` | The SHA-256 hex of your admin password. To make one on your own computer: `printf '%s' 'YOUR-PASSWORD' \| sha256sum`. Never type the plain password into the script. |
| `SESSION_SECRET` | A long random string. Easiest way: in the editor, choose the function **`generateSessionSecret`** and click **Run**. It sets the property for you. |
| `SPREADSHEET_ID` | *(only if the script isn't bound to the sheet)* |
| `IMAGE_FOLDER_ID` / `PROOF_FOLDER_ID` | *(optional)* Drive folder IDs. If you leave them out, folders are created automatically the first time they're needed. |

The first time you run a function, Google asks for permissions (Sheets, Drive). Approve them with the store owner's account.

## 5. Deploy as a web app
1. **Deploy → Manage deployments**. Select the existing web app deployment, click **Edit (pencil)**, set **Version: New version**, then **Deploy**.
   - Editing the existing deployment keeps the **same `/exec` URL**, so nothing else needs to change.
   - If you choose **New deployment** instead, you get a new URL. Put it into Vercel as `VITE_GAS_API_URL`.
2. Settings: **Execute as: Me**, **Who has access: Anyone**. "Anyone" is needed so customers can load products and place orders without a Google account. The admin actions are protected by the token, not by Google login.

## 6. Make the Google Sheet private
The web app runs **as you**, so it can read and write the sheet even when nobody else has access. Lock the sheet down:
1. Open the Sheet → **Share** (top right).
2. Under **General access**, change "Anyone with the link" to **Restricted**.
3. Under **People with access**, remove everyone except the owner, unless someone really needs it.
4. Do the same for the Drive folders "Vegelo payment proofs" (must be **Restricted**) and the old image folder if there is one.
   - Product images are shared individually by link, so the catalogue still displays.
5. Optional: **File → Settings**. Also check that nothing under **File → Share → Publish to web** is published. If it is, **Stop publishing**.

## 7. Switch the frontend to the secure backend
In **Vercel → vegelo → Settings → Environment Variables** (Production and Preview):

| Var | Value |
|---|---|
| `VITE_BACKEND_AUTH` | `true` |
| `VITE_GAS_API_URL` | *(only if the `/exec` URL changed)* |
| `VITE_ENABLE_ADMIN` | `true` (already set) |

Then **redeploy** (Deployments → ⋯ → Redeploy).

## 8. Test
1. Open the site and confirm products load.
2. Open the `/exec` URL in a browser. You should see `{"ok":true,"products":[…]}` and **no `orders`**.
3. Place a test order. It should appear in the `Orders` tab with an ID like `ORD-…-ABC123`.
4. Under **My orders → Track**, enter the order ID and phone number. You should see its status.
5. Go to `/admin666`, sign in, and confirm the orders list, status changes, payment proof, and adding, editing or deleting a product all work.
6. Enter a wrong password 5 times. Logins should lock for 15 minutes.

## Rollback
Deploy → Manage deployments → Edit → pick the **previous version** → Deploy. Then set `VITE_BACKEND_AUTH` back to `false` (or remove it) in Vercel and redeploy.

## Notes and limits
- Apps Script can't see the caller's IP, so the lockout is **global**: someone guessing passwords can keep the real admin locked out for up to 15 minutes at a time. That's preferable to letting them guess without limit.
- To sign every admin out at once, change `SESSION_SECRET`.
- The old passwords that used to be in the frontend code should be considered leaked. Don't reuse them.
