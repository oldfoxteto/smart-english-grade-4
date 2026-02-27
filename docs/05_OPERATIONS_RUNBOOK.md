# LISAN Operations Runbook

## 1) Environments

- `dev`
  - local development and feature validation
  - compose file: `docker-compose.dev.yml`
  - env template: `backend/.env.dev.example`
- `staging`
  - pre-production QA and release candidate validation
  - compose file: `docker-compose.staging.yml`
  - env template: `backend/.env.staging.example`
- `prod`
  - production traffic
  - compose file: `docker-compose.prod.yml`
  - env template: `backend/.env.prod.example`

Use Secret Manager for sensitive variables in staging/prod. Do not store real secrets in repo.

## 2) CI/CD Flow

GitHub workflow: `.github/workflows/ci-cd.yml`

- On PR/push:
  - backend tests with PostgreSQL service
  - frontend build
- On push:
  - build and push backend docker image to GHCR
- On `staging` branch:
  - auto deploy to staging host over SSH
- On `main` branch:
  - auto deploy to production host over SSH

Required repository secrets:

- `STAGING_SSH_HOST`, `STAGING_SSH_USER`, `STAGING_SSH_KEY`
- `PROD_SSH_HOST`, `PROD_SSH_USER`, `PROD_SSH_KEY`

## 3) DB Backups

### Automated

GitHub workflow: `.github/workflows/db-backup.yml`

- schedule: every 6 hours
- uses `npm run db:backup`
- uploads compressed SQL backup artifact

Required secret:

- `PROD_DATABASE_URL`

### Manual backup

```bash
cd backend
export DATABASE_URL="postgresql://..."
npm run db:backup
```

Output is written to `backend/backups/`.

## 4) Restore Plan

### Restore from backup file

```bash
cd backend
export DATABASE_URL="postgresql://..."
export DB_RESTORE_FILE="./backups/lisan-backup-YYYY-MM-DDTHH-mm-ss.sql.gz"
npm run db:restore
```

### Production restore checklist

1. Announce maintenance window.
2. Stop write traffic to backend.
3. Take final pre-restore backup.
4. Restore target backup using `npm run db:restore`.
5. Run smoke checks:
   - `GET /health`
   - auth login/register
   - placement + learning-path
6. Re-enable traffic.
7. Monitor error rate/latency dashboards for 30 minutes.

### Recovery objectives

- `RPO`: up to 6 hours (backup interval)
- `RTO`: 30-60 minutes depending on DB size and infra
