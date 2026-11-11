# Recovery and deployment runbook — not authorized for production deletion

## Current state
The scheduled monitor uses the cascade-aware, read-only queries. It has not been deployed, bound to D1, or scheduled. No production migrations have been applied. `RETENTION_DELETE_ENABLED` must equal the literal string `false`; any other value fails closed.

## Before a production rollout
1. Review the Worker source repositories and confirm runtime schema matches staging; the marketing-site repository is not necessarily the Worker deployment source.
2. Run schema checks and foreign-key integrity checks on staging. Never copy customer data into test databases.
3. Verify per-tenant policies default disabled and holds override any eligibility.
4. Test real D1 recovery from a staging-only backup/export or time-travel bookmark, **not just an in-memory SQLite transaction rollback**.
5. Verify downstream effects on messages, notification outbox, appointments, report storage, audit findings, provider events and legal holds.
6. Implement audit-only metrics with strict access controls, no identifiers in logs, and alerting for failures.
7. Review privacy text and obtain explicit authorization before publishing.
8. Obtain separate explicit authorization before any production schema migration, Worker deployment, cron trigger, or destructive deletion.

## Recovery rehearsal plan
- Record staging database IDs and capture a D1 time-travel bookmark for each.
- Export or back up staging schema and synthetic fixtures through Cloudflare's supported D1 mechanisms.
- Make a deliberate, reversible change **only to synthetic staging rows**.
- Restore staging to the recorded bookmark or import the backup into a **new isolated database**.
- Validate row counts, `PRAGMA foreign_key_check`, indexes, and expected fixtures.
- Log actual restore duration, API result, and any limitations.
- Do not use production time travel or restoration as a test.

## Remaining limitations
- Tenant policies currently cover support conversations and ticket thresholds, not all data classes.
- Visibility audits have no tenant-level policy; paid/identified reports and provider events are conservatively protected.
- No deletion executor, batching, concurrency guards, or production backup rehearsal is implemented.
- A successful GitHub Actions run is not evidence of a production Cloudflare Worker deployment.
