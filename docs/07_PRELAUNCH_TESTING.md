# Pre-launch Testing Pack

## 1) E2E Tests

Command:

```bash
cd backend
npm run test:e2e
```

Covers full user journey:
- register/login
- placement test + submit
- learning path retrieval
- lesson body retrieval
- AI tutor safety response
- gamification
- subscriptions

## 2) Security Tests

Command:

```bash
cd backend
npm run test:security
```

Covers:
- auth required checks
- RBAC enforcement for admin endpoints
- refresh token misuse/revocation
- input validation rejection
- AI abuse protection behavior

## 3) Load/Performance Test

Command:

```bash
cd backend
npm run test:load
```

Environment variables:
- `LOAD_TEST_BASE_URL` (default: `http://localhost:4000`)
- `LOAD_TEST_PATH` (default: `/health`)
- `LOAD_TEST_METHOD` (default: `GET`)
- `LOAD_TEST_REQUESTS` (default: `200`)
- `LOAD_TEST_CONCURRENCY` (default: `20`)

Output includes:
- success rate
- requests per second
- avg/p50/p95/p99 latency

## 4) Full Prelaunch Suite

```bash
cd backend
npm run test:prelaunch
```

## 5) Release Gate Recommendation

- `test:e2e`: must pass
- `test:security`: must pass
- `test:load`: p95 latency and success rate within target SLO
