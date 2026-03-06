# SQLite -> PostgreSQL Migration Plan

## Goal

Move production API data from file-based SQLite (`server/data.db`) to managed PostgreSQL with zero feature regression.

## Current State

- Runtime API (`server/`) uses SQLite for auth, progress, analytics, safety consent, and lesson progress.
- This is acceptable for demo, but not durable/scalable for production workloads.

## Phase 1: Schema and Data Layer (Low Risk)

1. Introduce a DB adapter interface (`db.get/db.all/db.run`) with SQLite and PostgreSQL implementations.
2. Port existing SQLite tables to PostgreSQL DDL.
3. Add migration scripts with idempotent versioning.
4. Add integration tests that run against PostgreSQL in CI.

Exit criteria:
- All existing API routes pass tests with PostgreSQL adapter.
- No route behavior change for frontend consumers.

## Phase 2: Dual-Write + Verification

1. Keep SQLite as primary read path temporarily.
2. Enable dual-write to PostgreSQL for mutable endpoints.
3. Add background verifier to compare record counts and sample payload parity.
4. Add ops metrics for dual-write failures.

Exit criteria:
- Data parity validated for users/progress/analytics/safety/lesson progress.
- Dual-write error rate below agreed threshold.

## Phase 3: Read Cutover

1. Switch read path to PostgreSQL behind feature flag.
2. Keep SQLite write fallback disabled by default.
3. Run smoke tests and user journey tests.

Exit criteria:
- Production smoke passes for 48 hours.
- No critical regressions in auth, ai-tutor, progress, analytics.

## Phase 4: Decommission SQLite

1. Remove SQLite runtime dependency from production service.
2. Keep one-time export archive and rollback runbook.
3. Update docs and onboarding.

Exit criteria:
- SQLite removed from production runtime.
- Rollback and restore documented and validated.

## Rollback Plan

1. Toggle feature flag back to SQLite read path.
2. Keep PostgreSQL writes on (for forward data capture) unless corruption is detected.
3. Re-run parity checks before next cutover attempt.
