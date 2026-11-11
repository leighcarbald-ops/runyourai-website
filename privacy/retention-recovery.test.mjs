import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';

test('transaction rollback restores cascading conversation children in an isolated fixture', () => {
 const db=new DatabaseSync(':memory:');
 try {
  db.exec(`
   PRAGMA foreign_keys=ON;
   CREATE TABLE conversations(id TEXT PRIMARY KEY);
   CREATE TABLE messages(id TEXT PRIMARY KEY,conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE);
   CREATE TABLE tickets(id TEXT PRIMARY KEY,conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE);
   INSERT INTO conversations VALUES('c');
   INSERT INTO messages VALUES('m','c');
   INSERT INTO tickets VALUES('t','c');
  `);
  db.exec('BEGIN IMMEDIATE; DELETE FROM conversations WHERE id=\'c\';');
  assert.equal(db.prepare('SELECT COUNT(*) n FROM messages').get().n,0);
  db.exec('ROLLBACK;');
  for(const table of ['conversations','messages','tickets']) {
   assert.equal(db.prepare(`SELECT COUNT(*) n FROM ${table}`).get().n,1);
  }
  assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db.close();}
});
