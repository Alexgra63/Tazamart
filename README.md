# Tazamart

Taza sabzi from the Islamabad mandi. A React 19, Vite 6 and Tailwind CSS v4 storefront backed by a Google Apps Script / Sheets API.

## Run locally
1. `npm install`
2. Optionally create `.env.local` (see below)
3. `npm run dev`, then open http://localhost:3000
4. `npm run build` writes a production build to `dist/`

## Environment variables
| Var | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Gemini key (optional) |
| `VITE_ENABLE_ADMIN` | `true` to enable the admin portal at `/admin666` |
| `VITE_BACKEND_AUTH` | `true` to use the secure backend. The admin login works only in this mode. |
| `VITE_GAS_API_URL` | Apps Script `/exec` URL |
| `VITE_PAYMENT_NUMBER` / `VITE_PAYMENT_TITLE` | Easypaisa/JazzCash number and account title shown at checkout |

See [SECURITY.md](SECURITY.md) for the admin and backend caveats.

## Design system
Design tokens (colors, fonts, radii, shadows) live in `index.css` under `@theme`. Reusable primitives are in `components/ui/`.
