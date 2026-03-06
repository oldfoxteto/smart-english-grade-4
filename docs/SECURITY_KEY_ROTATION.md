# Security Key Rotation Runbook

## Scope

- Render API key
- Vercel token
- OpenAI API key

## Status (March 6, 2026)

1. Vercel token:
   - Old token revoked.
   - Action required: create a new token in Vercel dashboard and store it in your secure vault.

2. Render API key:
   - Action required (manual in dashboard): create new API key, update automation references, then revoke old key.

3. OpenAI API key:
   - Runtime key in Render is currently set to empty (fallback mode).
   - Action required (manual in OpenAI dashboard): create new key and revoke old exposed key.

## Rotation Steps (Manual)

1. Create new key/token.
2. Update deployment environments and CI secrets.
3. Deploy and run `npm run smoke:prod`.
4. Revoke old key/token immediately.
5. Record rotation date and owner.

## Validation Checklist

- `npm run smoke:prod` passes.
- Login + AI Tutor text message works.
- CORS check from frontend to API passes.
- No old tokens remain active in account settings.
