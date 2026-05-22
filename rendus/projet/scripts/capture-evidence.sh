#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/screenshots/terminal"
WEBAPP="$ROOT/webapp"
mkdir -p "$OUT"

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

DOCKER_IMAGE="${DOCKER_IMAGE:-romainmlt/devops-cv-webapp:latest}"
REDIS_HOST="${REDIS_HOST:-127.0.0.1}"
REDIS_PORT="${REDIS_PORT:-6379}"

echo "==> Redis"
if command -v docker &>/dev/null; then
  docker start redis-test 2>/dev/null || docker run -d --name redis-test -p "${REDIS_PORT}:6379" redis:7-alpine
  sleep 1
fi

echo "==> Tests"
cd "$WEBAPP"
REDIS_HOST="$REDIS_HOST" REDIS_PORT="$REDIS_PORT" npm test 2>&1 | tee "$OUT/npm-test.txt"

echo "==> Serveur temporaire"
REDIS_HOST="$REDIS_HOST" REDIS_PORT="$REDIS_PORT" node src/index.js &
PID=$!
sleep 2

curl -s "http://localhost:3000/health" | tee "$OUT/health.json"
echo "" | tee -a "$OUT/health.json"
curl -s "http://localhost:3000/api/stats" | tee "$OUT/stats.json"
echo "" | tee -a "$OUT/stats.json"
curl -s -o "$OUT/cv-home.html" "http://localhost:3000/"
curl -s "http://localhost:3000/user" -X POST -H 'Content-Type: application/json' \
  -d '{"username":"demo","firstname":"Romain","lastname":"Martin"}' | tee "$OUT/user-create.json"
echo "" | tee -a "$OUT/user-create.json"

kill "$PID" 2>/dev/null || true

echo "==> Docker"
if command -v docker &>/dev/null; then
  docker build -t "$DOCKER_IMAGE" "$WEBAPP" 2>&1 | tee "$OUT/docker-build.txt"
  docker images "$(echo "$DOCKER_IMAGE" | cut -d: -f1)" 2>&1 | tee "$OUT/docker-images.txt"
fi

if command -v kubectl &>/dev/null; then
  kubectl apply --dry-run=client -f "$ROOT/image/" 2>&1 | tee "$OUT/kubectl-dry-run.txt"
else
  echo "kubectl non installé — dry-run non exécuté" | tee "$OUT/kubectl-dry-run.txt"
fi

echo "Captures enregistrées dans $OUT"
