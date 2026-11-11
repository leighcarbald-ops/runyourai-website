# Retention rollout — NOT ENABLED

This branch contains a **read-only eligibility preview**, not an automated deletion system. No production Worker imports it. There is no cron trigger or DELETE statement.

## Proposed policy (subject to review)
- Chat conversations: 30 days after closure; unresolved and escalated cases protected.
- Resolved tickets: 90 days after closure, including linked scheduling dependencies.
- Knowledge gaps: 90 days after resolution/ignore; raw message references need additional review.
- Leads and appointments: proposed 90 days, but requires independent lifecycle rules.
- Visibility audits: proposed 90 days, but paid, customer-associated, and in-progress records protected.
- Operational logs: proposed 30 days, subject to security and legal exceptions.
- Accounting and transaction records: legally required retention.

## Safe implementation sequence
1. Inspect all D1 foreign keys and triggers; inventory each dependent table, including notification outbox, contacts, messages, reports, and provider events. Identify the precise cascade behavior.
2. Introduce per-tenant policy settings and legal-hold flags with schema migrations, staging fixtures, and rollback plan.
3. Implement aggregate-only dry-run reports; require matching staging tests for candidate selection and cascade effects.
4. Add an isolated Cloudflare scheduled Worker with read-only mode as default. Use explicit `RETENTION_DELETE_ENABLED=false` and avoid enabling it in this branch.
5. Add durable quotas for public visibility scans, independent of CORS/Origin; test concurrency and abuse.
6. Document deletion-request and export procedures and update the public privacy policy **only when actual processing matches the wording**.
7. After D1 backup/recovery rehearsal, obtain separate owner approval to enable production deletion.

## Verification
Run `node --test privacy/retention-preview.test.mjs` (Node 22+).
Tests cover query shape, active-case exclusions, read-only behavior, missing bindings, and error propagation. They are **unit tests**, not integration tests against D1.
Production read-only SQL smoke checks on November 11, 2026 returned 0 eligible closed conversations and 0 eligible visibility audits.

## Important limitations
The initial preview does not prove that all retention dependencies are safe. No personal records, paid reports, open cases, or related rows may be deleted based solely on these counts. This repository contains the marketing site; production Worker source and deployment ownership must be established before integration. Never point an experimental cron at production D1.
