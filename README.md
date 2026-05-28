# Woliba Registration Flow (Vite + React + TypeScript)

Multi-step registration SPA for the Woliba wellness platform coding challenge. Built with **Vite**, **React**, **React Router**, **Redux Toolkit**, and **TypeScript**.

## Features
- **8-step flow**: company verification → user details → OTP → profile → interests → pillars → processing → welcome
- **Stateful step guards** with React Router + Redux
- **API integration** (Axios) with consistent error normalization
- **Responsive UI** aligned with the provided Figma designs

## Quickstart

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Scripts
- **dev**: `npm run dev`
- **lint**: `npm run lint`
- **build**: `npm run build`
- **preview**: `npm run preview`

## Project structure

```txt
src/
├── api/              # API endpoint functions
├── assets/           # Images, icons, loader video
├── components/       # Reusable UI (Input, Button, OtpInput, Layout, etc.)
├── pages/            # One page per step
├── redux/            # Store, slice, typed hooks
├── routes/           # Routes + protected route guard
├── services/         # Axios client
├── styles/           # Global CSS + variables
└── utils/            # Constants + validation + API helpers
```

## Environment variables

This project uses Vite env vars (must be prefixed with `VITE_`). See `.env.example`.

- **`VITE_API_BASE_URL`**: Axios base URL. Default is **`/v1`** (recommended). Keeping `/v1` enables proxying in both dev + Vercel production.
- **`VITE_API_PROXY_TARGET`**: Dev-only proxy target used by Vite (`vite.config.js`).
- **`VITE_API_ORIGIN`**: Used for `Origin`/`Referer` headers on some endpoints.
## API proxying (avoids CORS)

The app calls the API via same-origin **`/v1/*`**, then proxies/rewrites to the real Woliba API host.

- **Local dev**: Vite proxy in `vite.config.js`
- **Production (Vercel)**: rewrite rules in `vercel.json`

## Test credentials

**Assignment PDF credentials (may not exist on dev API):**
- Company name: `Woliba`
- Password: `Woliba@123!`

**Known working dev credentials (from API doc sample):**
- Company: `Alpine Intel`
- Password: `AlpineWellness`

## Deployment

### Deploy to Vercel (recommended)

1. Push this repository to GitHub.
2. In Vercel, click **Add New → Project** and import the repo.
3. Configure:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
4. Ensure `vercel.json` is present (it handles):
   - **API rewrite**: `/v1/:path*` → `https://dev.api.woliba.io/v1/:path*`
   - **SPA fallback**: `/(.*)` → `/index.html`
5. (Optional) Add env vars in Vercel Project Settings → Environment Variables.
6. Deploy.

### Notes for SPA routing

This is a client-side routed SPA (React Router). Without the SPA fallback rewrite, deep links like `/verify-otp` would 404 on refresh. `vercel.json` already includes the needed rewrite.

## Integrated endpoints

- `POST /verify-by-company-name-and-password`
- `POST /save-user-details-and-send-otp`
- `POST /verify-otp-for-user-registration`
- `POST /send-otp-for-user-registration`
- `GET /viewWellnessInterest`
- `GET /get-wellbeing-pillars/{language_id}`
- `POST /user-registration`
