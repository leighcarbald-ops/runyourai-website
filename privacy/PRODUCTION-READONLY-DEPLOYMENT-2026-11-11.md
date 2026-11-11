# Production read-only retention monitor deployment — 2026-11-11

## Owner authorization
Owner explicitly approved the full production deployment **in read-only mode**, including reviewed support D1 migration and daily schedule. Owner explicitly prohibited deletion.

## Completed
1. Captured production support D1 Time Travel bookmark and completed SQL export before schema migration.
2. Applied `privacy/migrations/001-retention-support-staging.sql` DDL to the production support D1 database. Created `retention_tenant_policies`, `retention_legal_holds`, and `idx_retention_holds_lookup`. Existing customer rows were not altered.
3. Created standalone Worker `runyourai-retention-monitor` from the PR's `cascade-preview.mjs` and `retention-monitor.mjs` sources, combined into one Worker module for upload. The existing customer-support and visibility Workers were not redeployed.
4. Configured `SUPPORT_DB` and `VISIBILITY_DB` bindings to production D1 databases, with `RETENTION_DELETE_ENABLED` set to literal `false`.
5. Configured daily cron `0 8 * * *` (**08:00 UTC**).
6. Verified settings, binding IDs, cron schedule, existence of migration tables, zero enabled tenant policies, and zero foreign-key violations.
7. Ran both exact read-only candidate SQL queries directly against production D1; both returned successfully with **0 eligible candidates**.

## Safety
- No deletion executor exists in the deployed Worker.
- No DELETE, UPDATE, or INSERT SQL is executed by the monitor.
- Scheduled handler fails closed unless `RETENTION_DELETE_ENABLED === 'false'`.
- No tenant has opted into automatic retention cleanup.
- Monitor logs aggregate counts only.
- No customer record was deleted or changed by this deployment.

## Verification limitation
The daily cron trigger has been created and the Worker upload succeeded, but **an actual scheduled invocation and its runtime logs have not yet been observed**. Cloudflare cron propagation and first execution remain to be verified. Direct production D1 query execution confirms schema compatibility, not the full Worker scheduled runtime.

## Follow-up
- Verify first scheduled invocation and inspect aggregate logs / exceptions.
- Configure operational failure alerting.
- Review tenant-specific opt-in and visibility audit retention governance before any deletion work.
- Do not enable deletion without separate explicit approval.
