/**
 * Cascade-aware READ ONLY preview against the reviewed support schema.
 * Fail closed: requires explicit tenant policy, no holds, no pending
 * notifications, no unresolved tickets or appointments.
 * Does not authorize deletion or execute writes.
 */
export async function previewCascadeSafeConversations(db) {
  if (!db?.prepare) throw new TypeError('D1 binding required');
  const row = await db.prepare(`
    SELECT COUNT(*) AS candidates,
      COALESCE(SUM((SELECT COUNT(*) FROM messages m WHERE m.conversation_id=c.id AND m.tenant_id=c.tenant_id)),0) AS linked_messages,
      COALESCE(SUM((SELECT COUNT(*) FROM tickets t WHERE t.conversation_id=c.id AND t.tenant_id=c.tenant_id)),0) AS linked_tickets,
      COALESCE(SUM((SELECT COUNT(*) FROM schedule_requests s WHERE s.conversation_id=c.id AND s.tenant_id=c.tenant_id)),0) AS linked_appointments,
      COALESCE(SUM((SELECT COUNT(*) FROM notification_outbox n JOIN tickets t ON n.ticket_id=t.id AND n.tenant_id=t.tenant_id WHERE t.conversation_id=c.id AND t.tenant_id=c.tenant_id)),0) AS linked_notifications
    FROM conversations c
    JOIN retention_tenant_policies p ON p.tenant_id=c.tenant_id AND p.enabled=1
    WHERE c.status='CLOSED'
      AND c.updated_at < datetime('now', '-' || p.conversation_days || ' days')
      AND NOT EXISTS (
        SELECT 1 FROM retention_legal_holds h
        WHERE h.tenant_id=c.tenant_id AND h.released_at IS NULL
          AND ((h.record_type='tenant' AND h.record_id=c.tenant_id)
            OR (h.record_type='conversation' AND h.record_id=c.id))
      )
      AND NOT EXISTS (
        SELECT 1 FROM tickets t WHERE t.conversation_id=c.id AND t.tenant_id=c.tenant_id
          AND (t.status NOT IN ('RESOLVED','CLOSED')
            OR t.updated_at >= datetime('now', '-' || p.ticket_days || ' days')
            OR EXISTS (SELECT 1 FROM retention_legal_holds h
              WHERE h.tenant_id=c.tenant_id AND h.record_type='ticket'
                AND h.record_id=t.id AND h.released_at IS NULL)
            OR EXISTS (SELECT 1 FROM notification_outbox n
              WHERE n.ticket_id=t.id AND n.tenant_id=t.tenant_id
                AND n.status NOT IN ('SENT','CANCELLED')))
      )
      AND NOT EXISTS (
        SELECT 1 FROM schedule_requests s
        WHERE s.conversation_id=c.id AND s.tenant_id=c.tenant_id
          AND (s.status NOT IN ('CANCELLED','CLOSED')
            OR s.updated_at >= datetime('now', '-' || p.ticket_days || ' days'))
      )
  `).first();
  return {
    mode: 'DRY_RUN_ONLY',
    candidates: Number(row?.candidates || 0),
    cascade: {
      messages: Number(row?.linked_messages || 0),
      tickets: Number(row?.linked_tickets || 0),
      appointments: Number(row?.linked_appointments || 0),
      notifications: Number(row?.linked_notifications || 0),
    },
    deletionEnabled: false,
  };
}

/** Conservative visibility preview: any report or provider event blocks cleanup. */
export async function previewCascadeSafeAudits(db) {
  if (!db?.prepare) throw new TypeError('D1 binding required');
  const row = await db.prepare(`
    SELECT COUNT(*) AS candidates,
      COALESCE(SUM((SELECT COUNT(*) FROM audit_findings f WHERE f.audit_id=a.id)),0) AS linked_findings
    FROM audits a
    WHERE a.updated_at < datetime('now', '-90 days')
      AND a.status NOT IN ('draft','review_needed','processing')
      AND a.paid_at IS NULL AND a.customer_email IS NULL
      AND NOT EXISTS (SELECT 1 FROM reports r WHERE r.audit_id=a.id)
      AND NOT EXISTS (SELECT 1 FROM provider_events e WHERE e.audit_id=a.id)
  `).first();
  return {
    mode: 'DRY_RUN_ONLY',
    candidates: Number(row?.candidates || 0),
    cascade: { findings: Number(row?.linked_findings || 0) },
    deletionEnabled: false,
  };
}
