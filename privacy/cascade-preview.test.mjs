import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { previewCascadeSafeConversations, previewCascadeSafeAudits } from './cascade-preview.mjs';

const adapter = db => ({ prepare: sql => ({ first: async () => db.prepare(sql).get() }) });
const old = '2025-01-01 00:00:00';

test('support: tenant opt-in, legal holds, and open ticket protect conversations', async () => {
 const d = new DatabaseSync(':memory:');
 try {
  d.exec(`
   CREATE TABLE conversations(id TEXT,tenant_id TEXT,status TEXT,updated_at TEXT);
   CREATE TABLE messages(id TEXT,tenant_id TEXT,conversation_id TEXT);
   CREATE TABLE tickets(id TEXT,tenant_id TEXT,conversation_id TEXT,status TEXT,updated_at TEXT);
   CREATE TABLE schedule_requests(id TEXT,tenant_id TEXT,conversation_id TEXT,status TEXT,updated_at TEXT);
   CREATE TABLE notification_outbox(id TEXT,tenant_id TEXT,ticket_id TEXT,status TEXT);
   CREATE TABLE retention_tenant_policies(tenant_id TEXT,enabled INTEGER,conversation_days INTEGER,ticket_days INTEGER);
   CREATE TABLE retention_legal_holds(id TEXT,tenant_id TEXT,record_type TEXT,record_id TEXT,released_at TEXT);
   INSERT INTO retention_tenant_policies VALUES('a',1,30,90),('b',0,30,90);
   INSERT INTO conversations VALUES
    ('safe','a','CLOSED','2025-01-01'),('held','a','CLOSED','2025-01-01'),
    ('open','a','OPEN','2025-01-01'),('ticket','a','CLOSED','2025-01-01'),
    ('disabled','b','CLOSED','2025-01-01');
   INSERT INTO retention_legal_holds VALUES('hold','a','conversation','held',NULL);
   INSERT INTO tickets VALUES('t','a','ticket','OPEN','2025-01-01');
   INSERT INTO messages VALUES('m','a','safe');
  `);
  let r=await previewCascadeSafeConversations(adapter(d));
  assert.equal(r.candidates,1);assert.equal(r.cascade.messages,1);
  assert.equal(r.deletionEnabled,false);
  d.exec("UPDATE retention_legal_holds SET released_at='2025-01-02';");
  r=await previewCascadeSafeConversations(adapter(d));
  assert.equal(r.candidates,2);
  d.exec("INSERT INTO retention_legal_holds VALUES('tenant-hold','a','tenant','a',NULL);");
  r=await previewCascadeSafeConversations(adapter(d));
  assert.equal(r.candidates,0);
 } finally { d.close(); }
});

test('support: pending notifications and appointments prevent cascading deletion', async () => {
 const d = new DatabaseSync(':memory:');
 try {
  d.exec(`
   CREATE TABLE conversations(id TEXT,tenant_id TEXT,status TEXT,updated_at TEXT);
   CREATE TABLE messages(id TEXT,tenant_id TEXT,conversation_id TEXT);
   CREATE TABLE tickets(id TEXT,tenant_id TEXT,conversation_id TEXT,status TEXT,updated_at TEXT);
   CREATE TABLE schedule_requests(id TEXT,tenant_id TEXT,conversation_id TEXT,status TEXT,updated_at TEXT);
   CREATE TABLE notification_outbox(id TEXT,tenant_id TEXT,ticket_id TEXT,status TEXT);
   CREATE TABLE retention_tenant_policies(tenant_id TEXT,enabled INTEGER,conversation_days INTEGER,ticket_days INTEGER);
   CREATE TABLE retention_legal_holds(id TEXT,tenant_id TEXT,record_type TEXT,record_id TEXT,released_at TEXT);
   INSERT INTO retention_tenant_policies VALUES('a',1,30,90);
   INSERT INTO conversations VALUES('c','a','CLOSED','2025-01-01');
   INSERT INTO tickets VALUES('t','a','c','RESOLVED','2025-01-01');
   INSERT INTO notification_outbox VALUES('n','a','t','PENDING');
  `);
  assert.equal((await previewCascadeSafeConversations(adapter(d))).candidates,0);
  d.exec("UPDATE notification_outbox SET status='SENT';");
  assert.equal((await previewCascadeSafeConversations(adapter(d))).candidates,1);
  d.exec("INSERT INTO schedule_requests VALUES('s','a','c','REQUESTED','2025-01-01');");
  assert.equal((await previewCascadeSafeConversations(adapter(d))).candidates,0);
 } finally {d.close();}
});

test('audit: reports and provider events protect audit traceability', async () => {
 const d=new DatabaseSync(':memory:');
 try {
  d.exec(`
   CREATE TABLE audits(id TEXT,status TEXT,updated_at TEXT,paid_at TEXT,customer_email TEXT);
   CREATE TABLE audit_findings(id TEXT,audit_id TEXT);
   CREATE TABLE reports(id TEXT,audit_id TEXT);
   CREATE TABLE provider_events(id TEXT,audit_id TEXT);
   INSERT INTO audits VALUES('safe','report_ready','2025-01-01',NULL,NULL),
    ('report','report_ready','2025-01-01',NULL,NULL),
    ('event','report_ready','2025-01-01',NULL,NULL),
    ('paid','report_ready','2025-01-01','2025-01-01',NULL);
   INSERT INTO audit_findings VALUES('f','safe');
   INSERT INTO reports VALUES('r','report');
   INSERT INTO provider_events VALUES('e','event');
  `);
  const r=await previewCascadeSafeAudits(adapter(d));
  assert.equal(r.candidates,1);assert.equal(r.cascade.findings,1);
  assert.equal(r.deletionEnabled,false);
 }finally{d.close();}
});
