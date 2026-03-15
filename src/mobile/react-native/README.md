# Mobile Preview Status

This React Native folder is officially treated as `Phase 2 / Preview`.

Current status:
- The production-ready experience is the web app.
- Mobile screens are kept for future continuation and design reference.
- Several screens still depend on preview-only services and simulated flows.
- Live AI voice on mobile is not production-ready yet.

Rules for the current phase:
- Do not market the mobile app as a finished feature.
- Do not treat Firebase/Firestore mobile flows as the source of truth for the web product.
- Keep preview banners visible in mobile screens until a dedicated mobile backend path is completed.

What must happen before mobile becomes active again:
1. Finalize the web data model and API contracts.
2. Replace preview-only mobile data sources with supported production APIs.
3. Complete mobile audio, auth, and lesson sync flows.
4. Add mobile-specific testing and release hardening.
