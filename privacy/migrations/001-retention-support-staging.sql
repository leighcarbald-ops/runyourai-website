-- STAGING ONLY. Do not apply to production without reviewed migration.
-- Disabled by default; never enables automatic deletion.
CREATE TABLE IF NOT EXISTS retention_tenant_policies (
 tenant_id TEXT PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
 enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)),
 conversation_days INTEGER NOT NULL DEFAULT 30 CHECK(conversation_days BETWEEN 30 AND 3650),
 ticket_days INTEGER NOT NULL DEFAULT 90 CHECK(ticket_days BETWEEN 90 AND 3650),
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS retention_legal_holds (
 id TEXT PRIMARY KEY,
 tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
 record_type TEXT NOT NULL CHECK(record_type IN ('conversation','ticket','tenant')),
 record_id TEXT NOT NULL,
 reason TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 released_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_retention_holds_lookup
 ON retention_legal_holds(tenant_id,record_type,record_id,released_at);
