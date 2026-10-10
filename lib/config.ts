/**
 * Build-time configuration (Vite env vars, set them in Vercel → Project → Settings → Environment Variables).
 *
 * VITE_ENABLE_ADMIN           "true" to expose the admin portal at ADMIN_PATH. Default: disabled.
 * VITE_ADMIN_PASSWORD_SHA256  hex SHA-256 of the admin password. Without it, admin login always fails.
 *                             Generate: `printf '%s' 'your-password' | sha256sum`
 * VITE_PAYMENT_NUMBER         Easypaisa / JazzCash number shown at checkout.
 * VITE_PAYMENT_TITLE          Account title shown at checkout.
 *
 * NOTE: this is a client-side gate only. Anything shipped in the bundle can be read by a determined user,
 * and the Google Apps Script endpoint currently accepts writes without a token. See SECURITY.md.
 */
const env = import.meta.env;

export const ADMIN_PATH = '/admin666';

export const config = {
    adminEnabled: env.VITE_ENABLE_ADMIN === 'true',
    adminPasswordSha256: (env.VITE_ADMIN_PASSWORD_SHA256 || '').trim().toLowerCase(),
    paymentNumber: env.VITE_PAYMENT_NUMBER || '0300-1234567',
    paymentTitle: env.VITE_PAYMENT_TITLE || 'Tazamart',
    brand: 'Tazamart',
};

export async function sha256Hex(input: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
    if (!config.adminEnabled || !config.adminPasswordSha256) return false;
    return (await sha256Hex(password)) === config.adminPasswordSha256;
}

/** localStorage keys were "vegelo_*"; migrate them once to "tazamart_*" so customers keep carts/orders. */
export function migrateStorageKeys() {
    try {
        for (const k of ['products_cache', 'orders', 'favorites', 'profile', 'lang', 'theme', 'pages']) {
            const oldK = `vegelo_${k}`, newK = `tazamart_${k}`;
            const v = localStorage.getItem(oldK);
            if (v !== null && localStorage.getItem(newK) === null) localStorage.setItem(newK, v);
            if (v !== null) localStorage.removeItem(oldK);
        }
    } catch { /* storage unavailable */ }
}

/* ---- Login throttling (per browser) ----
 * After 3 failed attempts, lock out with an exponential delay (30s, 60s, 120s … capped at 15 min).
 * Stored in localStorage so a reload doesn't reset it. Client-side only; see SECURITY.md. */
const LOCK_KEY = 'tazamart_admin_lock';
type LockState = { fails: number; until: number };
const readLock = (): LockState => { try { return JSON.parse(localStorage.getItem(LOCK_KEY) || '') as LockState; } catch { return { fails: 0, until: 0 }; } };
const writeLock = (s: LockState) => { try { localStorage.setItem(LOCK_KEY, JSON.stringify(s)); } catch { /* ignore */ } };

export const lockoutRemainingMs = () => Math.max(0, readLock().until - Date.now());

export function recordFailedLogin(): number {
    const s = readLock();
    const fails = (s.fails || 0) + 1;
    let until = 0;
    if (fails >= 3) until = Date.now() + Math.min(15 * 60_000, 30_000 * 2 ** (fails - 3));
    writeLock({ fails, until });
    return until ? until - Date.now() : 0;
}
export const resetLoginFailures = () => writeLock({ fails: 0, until: 0 });
