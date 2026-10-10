import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { createStore } from './store.js';

function send(res, status, body) {
  if (status === 204) {
    res.writeHead(204);
    return res.end();
  }
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function createServer(store, log = () => {}) {
  return http.createServer((req, res) => {
    log(`${req.method} ${req.url}`);
    const url = new URL(req.url, 'http://localhost');

    if (url.pathname === '/notes' && req.method === 'GET') {
      return send(res, 200, store.all());
    }
    if (url.pathname === '/notes' && req.method === 'POST') {
      let raw = '';
      req.on('data', (chunk) => (raw += chunk));
      req.on('end', () => {
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          return send(res, 400, { error: 'invalid JSON' });
        }
        if (data === null || typeof data !== 'object' || typeof data.text !== 'string' || data.text.trim() === '') {
          return send(res, 400, { error: 'text is required' });
        }
        send(res, 201, store.add(data.text.trim()));
      });
      return;
    }
    const match = url.pathname.match(/^\/notes\/(\d+)$/);
    if (match && req.method === 'DELETE') {
      return store.remove(Number(match[1]))
        ? send(res, 204)
        : send(res, 404, { error: 'no such note' });
    }
    send(res, 404, { error: 'not found' });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT) || 3000;
  createServer(createStore('notes.json'), console.log).listen(port, '127.0.0.1', () => {
    console.log(`Notes server on http://127.0.0.1:${port}`);
  });
}
