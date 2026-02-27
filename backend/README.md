# LISAN Backend MVP

Node.js backend for:
- Auth (register/login/refresh/logout/me)
- Placement test (fetch/submit)
- Learning path generation (based on CEFR + goal)
- Gamification (status/award)
- Subscriptions (plans/me/subscribe)
- AI tutor stub endpoint
 - Analytics events + admin analytics dashboard APIs

## 1) Setup

```bash
cd backend
cp .env.example .env
npm install
```

Update `.env` with your PostgreSQL connection.

For RBAC and admin access:
- set `ADMIN_EMAILS=admin@example.com,second-admin@example.com`
- users in this list are auto-assigned `admin` role on register/login

## 2) Database (local)

```bash
npm run db:migrate
npm run db:seed
```

These commands run via Node + `pg` and do not require local `psql` installation.

## 3) Run

```bash
npm run dev
```

Health check:
- `GET http://localhost:4000/health`

API base URL:
- `http://localhost:4000/api/v1`

## 4) Docker Compose

From project root:

```bash
docker compose up -d db
```

Then run migrations and seed:

```bash
cd backend
npm run db:migrate
npm run db:seed
npm run dev
```

Or run both services:

```bash
docker compose up -d
```

## 5) API Contract

- `contracts/openapi.yaml`

## 6) Implemented Endpoints

Auth:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Placement/Learning:
- `GET /api/v1/placement/tests/:languageCode`
- `POST /api/v1/placement/submit`
- `GET /api/v1/learning-path?languageCode=en&goalType=work`

Gamification:
- `GET /api/v1/gamification/status`
- `POST /api/v1/gamification/award`

Subscriptions:
- `GET /api/v1/subscriptions/plans`
- `GET /api/v1/subscriptions/me`
- `POST /api/v1/subscriptions/subscribe`

AI:
- `POST /api/v1/ai/tutor/reply`

Lessons:
- `GET /api/v1/lessons/:lessonId/content`

## 7) Tests

```bash
npm test
```

## 8) Environment Profiles

Templates:
- `.env.dev.example`
- `.env.staging.example`
- `.env.prod.example`

Use matching compose files at repo root:
- `docker-compose.dev.yml`
- `docker-compose.staging.yml`
- `docker-compose.prod.yml`

## 9) Secrets Management (Production)

Use secret manager injection instead of local `.env` secrets:

- `SECRET_MANAGER_PROVIDER=env` (default)
  - provide `APP_SECRETS_JSON` or `APP_SECRETS_FILE` with secret key/values
- `SECRET_MANAGER_PROVIDER=gcp`
  - provide:
    - `GCP_SECRET_MAPPINGS` JSON map (env key -> secret version resource)
    - `GCP_ACCESS_TOKEN` bearer token

Example `APP_SECRETS_JSON`:

```json
{
  "JWT_SECRET": "rotated-secret",
  "JWT_REFRESH_SECRET": "rotated-refresh-secret",
  "GOOGLE_AI_STUDIO_API_KEY": "...",
  "ERROR_MONITOR_WEBHOOK_URL": "https://example.ingest.endpoint"
}
```

GCP Secret Manager mapping example:

```bash
SECRET_MANAGER_PROVIDER=gcp
GCP_SECRET_MAPPINGS={"JWT_SECRET":"projects/PROJECT_ID/secrets/JWT_SECRET/versions/latest","JWT_REFRESH_SECRET":"projects/PROJECT_ID/secrets/JWT_REFRESH_SECRET/versions/latest","GOOGLE_AI_STUDIO_API_KEY":"projects/PROJECT_ID/secrets/GOOGLE_AI_STUDIO_API_KEY/versions/latest","ERROR_MONITOR_WEBHOOK_URL":"projects/PROJECT_ID/secrets/ERROR_MONITOR_WEBHOOK_URL/versions/latest"}
GCP_ACCESS_TOKEN=<short-lived-access-token>
```

For providers:
- Sentry: set `ERROR_MONITOR_WEBHOOK_URL` to your relay/webhook ingress endpoint.
- Datadog: set `ERROR_MONITOR_WEBHOOK_URL` to your Logs HTTP intake webhook/forwarder URL.

## 10) Database Backup and Restore

Create backup:

```bash
npm run db:backup
```

Restore backup:

```bash
DB_RESTORE_FILE=./backups/<file>.sql.gz npm run db:restore
```

Backup scripts:
- `scripts/backup-db.js`
- `scripts/restore-db.js`

## 11) Content QA (Pedagogical + Linguistic)

```bash
npm run content:qa
```

Quality policy and checklist:
- `../docs/06_CONTENT_QA_AR.md`
