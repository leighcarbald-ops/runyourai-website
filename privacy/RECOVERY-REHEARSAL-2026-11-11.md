# Cloudflare D1 recovery rehearsal — 2026-11-11

## Scope
Executed a real Cloudflare D1 Time Travel recovery rehearsal against **synthetic staging databases only**:
- Support staging: `7788e5bd-44eb-4e76-8122-51e54bd5c865`
- Visibility staging: `37f34624-a10e-4804-b54c-d75ab2c0cf98`

No production database was exported, changed, or restored. No production Worker or cron was deployed.

## Steps performed
1. Captured each staging database's current D1 Time Travel bookmark.
2. Requested a full SQL export for each staging database. Both export jobs reported `status=complete`. Signed download URLs were returned but the exported SQL was **not downloaded or re-imported**.
3. Verified baseline synthetic fixture counts.
4. Inserted one synthetic `fixture-recovery-probe` record into each staging database.
5. Called Cloudflare's D1 Time Travel restore endpoint using the recorded bookmarks. Both calls reported success.
6. Queried the restored databases to verify original row counts, absence of the probes, and `PRAGMA foreign_key_check`.

## Results
| Check | Support staging | Visibility staging |
| --- | --- | --- |
| SQL export API | Complete | Complete |
| Time Travel restore API | Success | Success |
| Probe row after restore | 0 | 0 |
| Baseline row counts | 3 conversations, 1 ticket, 1 legal hold, 1 tenant policy | 2 audits |
| Foreign-key violations | 0 | 0 |

## Important limitations
- The tested recovery path was **D1 Time Travel**, not SQL dump import.
- Export completion does not prove the exported SQL can be downloaded and imported.
- This rehearsal used small synthetic fixtures and did not measure recovery time or validate high-volume behavior.
- Production backups, retention locks, restore windows, recovery objectives, legal holds, and audit trail requirements still need explicit operational review.
- Deletion remains disabled; this rehearsal is not authorization to enable production cleanup.
