/**
 * Build-time configuration (Vite env vars, set them in Vercel → Project → Settings → Environment Variables).
 *
 * VITE_ENABLE_ADMIN           "true" to expose the admin portal at ADMIN_PATH. Default: disabled.
 * VITE_BACKEND_AUTH           "true" to use the secure Apps Script backend. Admin login works ONLY in this mode.
 * VITE_PAYMENT_NUMBER         Easypaisa / JazzCash number shown at checkout.
 * VITE_PAYMENT_TITLE          Account title shown at checkout.
 *
 * The admin password is verified only by the backend (backend/Code.gs). No password or hash ships in the bundle.
 */
const env = import.meta.env;

export const ADMIN_PATH = '/admin666';

export const config = {
    adminEnabled: env.VITE_ENABLE_ADMIN === 'true',
    paymentNumber: env.VITE_PAYMENT_NUMBER || '0300-1234567',
    paymentTitle: env.VITE_PAYMENT_TITLE || 'Tazamart',
    brand: 'Tazamart',
};

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
