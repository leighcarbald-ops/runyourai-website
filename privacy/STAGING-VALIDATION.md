# Cloudflare D1 staging validation — 2026-11-11

## Isolation
Created two new databases, not bound to any production Worker:
- `runyourai-retention-support-staging` — `7788e5bd-44eb-4e76-8122-51e54bd5c865`
- `runyourai-retention-audit-staging` — `37f34624-a10e-4804-b54c-d75ab2c0cf98`

Recreated **39** support schema objects and **13** visibility schema objects from production `sqlite_master` DDL. No customer data was copied. Inserted only fictional fixture rows.

## Real Cloudflare D1 results
- Support fixture: 1 eligible closed/expired conversation; open conversation and conversation with unresolved ticket excluded.
- Audit fixture: 1 eligible unpaid/unassociated expired audit; paid audit excluded.
- `PRAGMA foreign_key_check`: 0 violations in each staging database.
- Existing GitHub Actions unit and SQLite integration tests passed before this live D1 staging validation.

## Critical cascade review
The full staging schema reveals:
- Deleting a conversation **cascades** to messages, tickets, and schedule requests.
- Deleting a ticket **cascades** to notification_outbox and schedule_requests.
- Deleting an audit **cascades** to audit_findings and reports.
- Deleting an audit **sets provider_events.audit_id to NULL**, reducing audit traceability.
- Deleting a message/ticket **sets knowledge_gaps.sample_message_id/ticket_id to NULL**.

**Do not implement destructive cleanup from the initial eligibility counts alone.** Before activation, candidate selection must account for:
1. all downstream cascade rows and active notification outbox state;
2. pending customer inquiries, unresolved escalations and legal holds;
3. contractual paid reports, report storage objects, provider event traceability;
4. per-tenant policy and account/customer retention exemptions;
5. scheduled appointment timing and status;
6. bounded transactions, idempotence, backup and rollback tests.

## Current boundary
No production Worker was updated. No production data was copied, modified, or deleted. No cron was installed. The staged databases contain synthetic fixtures only. The separate scheduled monitor in this PR remains fail-closed and read-only.
