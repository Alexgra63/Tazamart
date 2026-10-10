# Security notes

## Admin portal
- The hidden "tap the logo 5 times" unlock and the hardcoded admin passwords have been **removed** from the client.
- Admin is now **off by default**. To enable it on a deployment, set these environment variables (Vercel → Settings → Environment Variables) and redeploy:
  - `VITE_ENABLE_ADMIN=true`
  - `VITE_ADMIN_PASSWORD_SHA256=<sha256 hex of your password>`. Generate it with `printf '%s' 'your-password' | sha256sum`.
- Open `/?admin` to reach the login screen.

## Known limitations (follow-up required)
1. **This is still a client-side gate.** The SHA-256 hash ships in the JS bundle. It hides the plaintext password but can be brute-forced offline, so use a long random password.
2. **The Google Apps Script backend (`GAS_API_URL` in `App.tsx`) accepts `add`/`edit`/`delete`/`updateOrderStatus` POSTs without authentication**, and its GET returns all orders, including customer names, phones and addresses. Anyone who reads the bundle can call it directly. A real fix needs changes in the Apps Script project, which is not in this repo:
   - require a secret token or a signed admin session on write actions and on the orders listing;
   - return only the product catalogue to unauthenticated GET requests;
   - better still, move admin to a server-side auth provider (e.g. Supabase Auth or a Vercel function holding the secret).
3. The old passwords (`VegeloAdmin2025!` / `TazaAdmin2025!`) are in git history and the public deployed bundle. **Treat them as compromised** and don't reuse them.
