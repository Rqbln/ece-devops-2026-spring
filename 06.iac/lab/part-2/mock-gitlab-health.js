#!/usr/bin/env node
/**
 * Mock GitLab health endpoints for testing Ansible healthchecks on ARM Mac
 * (when Vagrant/VM is not available). Run: node mock-gitlab-health.js
 */
const http = require('http');
const port = 8080;

const routes = {
  '/-/health': () => 'GitLab OK',
  '/-/liveness': () => JSON.stringify({ status: 'ok' }),
  '/-/readiness': () => JSON.stringify({
    status: 'ok',
    master_check: { status: 'ok' },
    checks: {
      redis: { status: process.env.GITLAB_REDIS_DOWN ? 'fail' : 'ok' },
      db: { status: 'ok' },
      cache: { status: 'ok' }
    }
  })
};

const server = http.createServer((req, res) => {
  const handler = routes[req.url.split('?')[0]] || (() => null);
  const body = handler();
  if (body === null) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  res.setHeader('Content-Type', req.url.includes('readiness') || req.url.includes('liveness') ? 'application/json' : 'text/plain');
  res.writeHead(200);
  res.end(body);
});

server.listen(port, () => console.log(`Mock GitLab health server on http://127.0.0.1:${port}`));
