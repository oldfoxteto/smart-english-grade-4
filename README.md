# Smart English Grade 4

Production-oriented web platform to teach English for grade 4 with:
- structured lessons and practice flows,
- AI-assisted tutoring modules,
- backend APIs for auth, learning path, and gamification,
- Firebase/Firestore integration and deployment workflows.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + PostgreSQL
- Infra: Docker, GitHub Actions, Firebase (Firestore + Storage rules)

## Quick Start

```bash
# frontend
npm ci
npm run dev
```

```bash
# backend
cd backend
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

## Quality Commands

```bash
# frontend
npm run lint
npm run type-check
npm run test:run
npm run build
```

```bash
# backend
cd backend
npm test
```

## Deployment Notes

- Main CI/CD workflow: `.github/workflows/ci-cd.yml`
- Database backup workflow: `.github/workflows/db-backup.yml`
- Production/staging deployment jobs require repository secrets (`PROD_*`, `STAGING_*`).

## Environment and Secrets

- Real environment files are not committed.
- Use:
  - `backend/.env.example`
  - `server/.env.example`
  - `src/mobile/react-native/.env.example`
- Keep all tokens/keys in GitHub Secrets and local `.env` only.

## Project Docs

- Product/roadmap docs: `docs/`
- Backend API contract: `backend/contracts/openapi.yaml`
- Ops and testing guides: `docs/05_OPERATIONS_RUNBOOK.md`, `docs/07_PRELAUNCH_TESTING.md`
