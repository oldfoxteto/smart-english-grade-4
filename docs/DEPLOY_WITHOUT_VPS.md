# Deploy Without VPS (Vercel + Render)

## 1) Deploy Backend on Render

1. Open Render dashboard -> **New +** -> **Blueprint**.
2. Connect this GitHub repo and select branch `main`.
3. Render will read `render.yaml` and create service `smart-english-api`.
4. In service **Environment** set:
   - `OPENAI_API_KEY` = your OpenAI key
   - `CLIENT_URLS` = your Vercel frontend URL (later after frontend deploy)
5. Deploy and copy backend URL, for example:
   - `https://smart-english-api.onrender.com`

## 2) Deploy Frontend on Vercel

1. Open Vercel -> **Add New Project** -> import this repo.
2. Framework: **Vite** (auto-detected).
3. Set Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variable:
   - `VITE_API_BASE_URL=https://smart-english-api.onrender.com/api/v1`
5. Deploy.

## 3) Final CORS Fix

After Vercel URL is created:

1. Go back to Render service settings.
2. Update `CLIENT_URLS` with your exact Vercel domain, for example:
   - `https://smart-english-grade-4.vercel.app`
3. Redeploy Render once.

## 4) Verify

1. Open frontend URL.
2. Register/login.
3. Test:
   - `/onboarding`
   - `/lessons`
   - `/ai-tutor`
   - `/analytics-dashboard` (admin only)

## Notes

- Free Render may sleep after inactivity; first request can be slow.
- SQLite in this API is fine for demo, not for production scale.
