# Security notes

## Admin portal
- The admin login is at `/admin666`. It only appears when `VITE_ENABLE_ADMIN=true` **and** `VITE_BACKEND_AUTH=true`.
- **The password is checked only on the server** by the Apps Script backend (`backend/Code.gs`), against `ADMIN_PASSWORD_SHA256` in Script Properties. No password or password hash ships in the frontend bundle.
- A successful login returns an HMAC-signed session token that expires after 8 hours. It is kept in `sessionStorage` and sent with every admin request.
- The server locks all logins for 15 minutes after 5 failed attempts within 15 minutes. The browser also adds its own per-browser lockout and delay on top of that.
- To sign every admin out at once, rotate `SESSION_SECRET` in Script Properties.

## Backend
See `backend/SETUP.md`. The public GET returns only the catalogue. Orders, payment proofs and all writes need an admin token. Customers can look up their own order with the order ID plus their phone number.

## History
- The old hardcoded passwords (`VegeloAdmin2025!` / `TazaAdmin2025!`) are still in git history. Treat them as compromised.
- The old Apps Script deployment (`AKfycbyt…`) accepted unauthenticated writes. Archive or disable it under Apps Script → Deploy → Manage deployments.
