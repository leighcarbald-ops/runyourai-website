import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { previewSupportRetention, previewVisibilityRetention } from './retention-preview.mjs';
import monitor from './retention-monitor.mjs';

function dbAdapter(db) {
  return { prepare(sql) { return { first: async () => db.prepare(sql).get() }; } };
}

function supportFixture() {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    PRAGMA foreign_keys=ON;
    CREATE TABLE conversations (id TEXT PRIMARY KEY, tenant_id TEXT, status TEXT, updated_at TEXT);
    CREATE TABLE tickets (id TEXT PRIMARY KEY, tenant_id TEXT, conversation_id TEXT, status TEXT, updated_at TEXT);
    CREATE TABLE schedule_requests (id TEXT PRIMARY KEY, tenant_id TEXT, conversation_id TEXT, ticket_id TEXT, status TEXT, updated_at TEXT);
    CREATE TABLE knowledge_gaps (id TEXT PRIMARY KEY, status TEXT, last_seen_at TEXT);
  `);
  const old = '2025-01-01 00:00:00';
  const fresh = '2099-01-01 00:00:00';
  for (const [id, tenant, status] of [
    ['safe', 'a', 'CLOSED'], ['open', 'a', 'OPEN'],
    ['escalated', 'a', 'ESCALATED'], ['active-ticket', 'a', 'CLOSED'],
    ['recent-ticket', 'a', 'CLOSED'], ['active-schedule', 'a', 'CLOSED'],
    ['other-tenant-ticket', 'a', 'CLOSED'],
  ]) db.prepare('INSERT INTO conversations VALUES(?,?,?,?)').run(id, tenant, status, old);
  for (const [id, tenant, conversation, status, date] of [
    ['t1','a','active-ticket','OPEN',old],
    ['t2','a','recent-ticket','RESOLVED',fresh],
    ['t3','b','other-tenant-ticket','OPEN',old],
    ['t4','a','safe','CLOSED',old],
  ]) db.prepare('INSERT INTO tickets VALUES(?,?,?,?,?)').run(id,tenant,conversation,status,date);
  db.prepare('INSERT INTO schedule_requests VALUES(?,?,?,?,?,?)').run('s1','a','active-schedule',null,'REQUESTED',old);
  db.prepare('INSERT INTO knowledge_gaps VALUES(?,?,?)').run('g1','RESOLVED',old);
  db.prepare('INSERT INTO knowledge_gaps VALUES(?,?,?)').run('g2','OPEN',old);
  db.prepare('INSERT INTO knowledge_gaps VALUES(?,?,?)').run('g3','IGNORED',fresh);
  return db;
}

function visibilityFixture() {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE audits (id TEXT PRIMARY KEY, status TEXT, updated_at TEXT, paid_at TEXT, customer_email TEXT);
    CREATE TABLE reports (id TEXT PRIMARY KEY, audit_id TEXT, status TEXT);
  `);
  const old = '2025-01-01 00:00:00';
  const fresh = '2099-01-01 00:00:00';
  for (const row of [
    ['safe','report_ready',old,null,null],
    ['paid','report_ready',old,old,null],
    ['customer','report_ready',old,null,'customer@example.com'],
    ['active','review_needed',old,null,null],
    ['recent','report_ready',fresh,null,null],
    ['unapproved','report_ready',old,null,null],
  ]) db.prepare('INSERT INTO audits VALUES(?,?,?,?,?)').run(...row);
  db.prepare('INSERT INTO reports VALUES(?,?,?)').run('r1','unapproved','draft');
  return db;
}

test('SQLite integration: protects active conversations, tenant isolation, scheduling and recent tickets', async () => {
  const db = supportFixture();
  try {
    const result = await previewSupportRetention(dbAdapter(db));
    assert.equal(result.conversationCandidates, 2); // safe and other-tenant-ticket
    assert.equal(result.resolvedTicketCandidates, 1); // t4
    assert.equal(result.knowledgeGapCandidates, 1);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM conversations').get().n, 7);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM tickets').get().n, 4);
  } finally { db.close(); }
});

test('SQLite integration: excludes paid, customer, active and unapproved audits', async () => {
  const db = visibilityFixture();
  try {
    const result = await previewVisibilityRetention(dbAdapter(db));
    assert.equal(result.auditCandidates, 1);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM audits').get().n, 6);
  } finally { db.close(); }
});

test('scheduled monitor rejects unsafe flags and missing bindings', async () => {
  await assert.rejects(monitor.scheduled({}, { RETENTION_DELETE_ENABLED: 'true' }, { waitUntil() {} }), /interlock/);
  await assert.rejects(monitor.scheduled({}, { RETENTION_DELETE_ENABLED: 'false' }, { waitUntil() {} }), /bindings/);
});

test('scheduled monitor produces aggregate preview without mutation', async () => {
  const support = supportFixture();
  const visibility = visibilityFixture();
  const tasks = [];
  const originalLog = console.log;
  const logs = [];
  console.log = message => logs.push(JSON.parse(message));
  try {
    await monitor.scheduled({}, {
      RETENTION_DELETE_ENABLED: 'false',
      SUPPORT_DB: dbAdapter(support),
      VISIBILITY_DB: dbAdapter(visibility),
    }, { waitUntil(p) { tasks.push(p); } });
    await Promise.all(tasks);
    assert.equal(logs.length, 1);
    assert.equal(logs[0].support.conversationCandidates, 2);
    assert.equal(logs[0].visibility.auditCandidates, 1);
    assert.ok(!JSON.stringify(logs).includes('customer@example.com'));
    assert.equal(support.prepare('SELECT COUNT(*) AS n FROM conversations').get().n, 7);
  } finally { console.log = originalLog; support.close(); visibility.close(); }
});
