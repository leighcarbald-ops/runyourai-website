import test from 'node:test';
import assert from 'node:assert/strict';
import { RETENTION_DAYS, previewSupportRetention, previewVisibilityRetention } from './retention-preview.mjs';

function mockD1(rows) {
  const sql = [];
  return {
    sql,
    prepare(query) {
      sql.push(query);
      return { async first() {
        const row = rows.shift();
        if (row instanceof Error) throw row;
        return row;
      } };
    },
  };
}

test('policy defaults are explicit', () => {
  assert.deepEqual(RETENTION_DAYS, {
    conversations: 30, resolvedTickets: 90, knowledgeGaps: 90, visibilityAudits: 90,
  });
});

test('missing bindings fail closed', async () => {
  await assert.rejects(previewSupportRetention(null), TypeError);
  await assert.rejects(previewVisibilityRetention({}), TypeError);
});

test('support preview returns counts only, with no identifiers', async () => {
  const db = mockD1([{ eligible: 2 }, { eligible: 1 }, { eligible: 3 }]);
  const result = await previewSupportRetention(db);
  assert.equal(result.mode, 'DRY_RUN_ONLY');
  assert.equal(result.conversationCandidates, 2);
  assert.equal(result.resolvedTicketCandidates, 1);
  assert.equal(result.knowledgeGapCandidates, 3);
  assert.ok(!JSON.stringify(result).includes('customer@example.com'));
  assert.equal(db.sql.length, 3);
  assert.ok(db.sql.every(sql => /^\s*SELECT\b/i.test(sql)));
  assert.ok(db.sql.every(sql => !/\b(?:DELETE|UPDATE|INSERT|DROP|ALTER)\b/i.test(sql)));
});

test('active and escalated conversations are excluded', async () => {
  const db = mockD1([{ eligible: 0 }, { eligible: 0 }, { eligible: 0 }]);
  await previewSupportRetention(db);
  assert.match(db.sql[0], /c\.status\s*=\s*'CLOSED'/);
  assert.match(db.sql[0], /NOT EXISTS\s*\(\s*SELECT 1 FROM tickets/i);
  assert.match(db.sql[0], /NOT EXISTS\s*\(\s*SELECT 1 FROM schedule_requests/i);
  assert.match(db.sql[1], /t\.status IN \('RESOLVED', 'CLOSED'\)/);
});

test('visibility preview excludes paid and identified customer audits', async () => {
  const db = mockD1([{ eligible: 4 }]);
  const result = await previewVisibilityRetention(db);
  assert.equal(result.auditCandidates, 4);
  assert.match(db.sql[0], /a\.paid_at IS NULL/);
  assert.match(db.sql[0], /a\.customer_email IS NULL/);
  assert.match(db.sql[0], /NOT EXISTS/);
});

test('database errors propagate rather than authorizing cleanup', async () => {
  await assert.rejects(previewVisibilityRetention(mockD1([new Error('DB unavailable')])), /DB unavailable/);
});

test('preview does not call destructive D1 operations', async () => {
  let mutations = 0;
  const db = { prepare(sql) {
    assert.match(sql, /^\s*SELECT/i);
    return { first: async () => ({ eligible: 0 }), run: async () => { mutations++; } };
  } };
  await previewSupportRetention(db);
  await previewVisibilityRetention(db);
  assert.equal(mutations, 0);
});
