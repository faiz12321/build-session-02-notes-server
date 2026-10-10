import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createServer } from './server.js';
import { createStore } from './store.js';

async function withServer(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'notes-'));
  const file = path.join(dir, 'notes.json');
  const server = createServer(createStore(file));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base, file);
  } finally {
    server.close();
  }
}

const post = (base, body) =>
  fetch(`${base}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

test('starts with no notes', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/notes`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), []);
  }));

test('adds a note and lists it', () =>
  withServer(async (base) => {
    const res = await post(base, { text: 'buy milk' });
    assert.equal(res.status, 201);
    assert.deepEqual(await res.json(), { id: 1, text: 'buy milk' });
    const list = await (await fetch(`${base}/notes`)).json();
    assert.equal(list.length, 1);
  }));

test('rejects a note with no text', () =>
  withServer(async (base) => {
    const res = await post(base, { text: '   ' });
    assert.equal(res.status, 400);
    const empty = await post(base, null);
    assert.equal(empty.status, 400);
  }));

test('deletes a note, and 404s for an unknown id', () =>
  withServer(async (base) => {
    await post(base, { text: 'one' });
    assert.equal((await fetch(`${base}/notes/1`, { method: 'DELETE' })).status, 204);
    assert.equal((await fetch(`${base}/notes/1`, { method: 'DELETE' })).status, 404);
  }));

test('notes survive a restart', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'notes-'));
  const file = path.join(dir, 'notes.json');
  createStore(file).add('remember me');
  assert.deepEqual(createStore(file).all(), [{ id: 1, text: 'remember me' }]);
});
