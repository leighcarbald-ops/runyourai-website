/**
 * RunYourAI retention eligibility audit (READ ONLY).
 * This module intentionally performs SELECT queries only.
 * Not a deployed Worker and contains no scheduled trigger.
 *
 * Use separate D1 bindings for support and visibility audit databases.
 * The report contains aggregate counts only, never personal data.
 */
export const RETENTION_DAYS = Object.freeze({
  conversations: 30,
  resolvedTickets: 90,
  knowledgeGaps: 90,
  visibilityAudits: 90,
});

export async function previewSupportRetention(db) {
  if (!db?.prepare) throw new TypeError("Support D1 binding required");
  const [conversations, tickets, gaps] = await Promise.all([
    db.prepare(`
      SELECT COUNT(*) AS eligible
      FROM conversations c
      WHERE c.updated_at < datetime('now', '-30 days')
        AND c.status = 'CLOSED'
        AND NOT EXISTS (
          SELECT 1 FROM tickets t
          WHERE t.conversation_id = c.id
            AND t.tenant_id = c.tenant_id
            AND (t.status NOT IN ('RESOLVED', 'CLOSED')
              OR t.updated_at >= datetime('now', '-90 days'))
        )
        AND NOT EXISTS (
          SELECT 1 FROM schedule_requests s
          WHERE s.conversation_id = c.id
            AND s.tenant_id = c.tenant_id
            AND (s.status NOT IN ('CANCELLED', 'CLOSED')
              OR s.updated_at >= datetime('now', '-90 days'))
        )
    `).first(),
    db.prepare(`
      SELECT COUNT(*) AS eligible
      FROM tickets t
      WHERE t.status IN ('RESOLVED', 'CLOSED')
        AND t.updated_at < datetime('now', '-90 days')
        AND NOT EXISTS (
          SELECT 1 FROM schedule_requests s
          WHERE s.ticket_id = t.id AND s.tenant_id = t.tenant_id
            AND (s.status NOT IN ('CANCELLED', 'CLOSED')
              OR s.updated_at >= datetime('now', '-90 days'))
        )
    `).first(),
    db.prepare(`
      SELECT COUNT(*) AS eligible
      FROM knowledge_gaps
      WHERE status IN ('RESOLVED', 'IGNORED')
        AND last_seen_at < datetime('now', '-90 days')
    `).first(),
  ]);
  return {
    mode: "DRY_RUN_ONLY",
    conversationCandidates: Number(conversations?.eligible || 0),
    resolvedTicketCandidates: Number(tickets?.eligible || 0),
    knowledgeGapCandidates: Number(gaps?.eligible || 0),
    warnings: [
      "Counts are not deletion authorization.",
      "Foreign-key cascades, notifications, legal holds, and tenant policies require further review.",
      "Open or escalated conversations and unresolved tickets are excluded.",
    ],
  };
}

export async function previewVisibilityRetention(db) {
  if (!db?.prepare) throw new TypeError("Visibility D1 binding required");
  const result = await db.prepare(`
    SELECT COUNT(*) AS eligible FROM audits a
    WHERE a.updated_at < datetime('now', '-90 days')
      AND a.status NOT IN ('draft', 'review_needed', 'processing')
      AND a.paid_at IS NULL
      AND a.customer_email IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM reports r
        WHERE r.audit_id = a.id AND r.status NOT IN ('approved')
      )
  `).first();
  return {
    mode: "DRY_RUN_ONLY",
    auditCandidates: Number(result?.eligible || 0),
    warnings: [
      "Do not delete paid reports, active reviews, customer records, or legally retained records.",
      "Verify audit lifecycle statuses and retention obligations before implementing deletion.",
    ],
  };
}
