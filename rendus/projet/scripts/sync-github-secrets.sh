#!/usr/bin/env bash
# Pousse les variables de rendus/projet/.env vers les secrets GitHub Actions (nécessite gh auth login)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env"

if ! command -v gh &>/dev/null; then
  echo "Installer GitHub CLI : https://cli.github.com/"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Créer $ENV_FILE depuis .env.example"
  exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

REPO_TARGET="${GITHUB_REPO:-Rqbln/ece-devops-2026-spring}"
repo=$(gh repo view "$REPO_TARGET" --json nameWithOwner -q .nameWithOwner 2>/dev/null) || {
  echo "Dépôt introuvable : $REPO_TARGET (gh auth / droits ?)"
  exit 1
}

echo "Dépôt : $repo"

set_secret() {
  local name=$1
  local value=$2
  if [[ -z "${value:-}" ]]; then
    echo "  skip $name (vide)"
    return
  fi
  echo "  set $name"
  gh secret set "$name" --body "$value" --repo "$repo"
}

set_secret DOCKERHUB_USERNAME "${DOCKERHUB_USERNAME:-}"
set_secret DOCKERHUB_TOKEN "${DOCKERHUB_TOKEN:-}"
set_secret RENDER_SERVICE_ID "${RENDER_SERVICE_ID:-}"
set_secret RENDER_API_KEY "${RENDER_API_KEY:-}"

echo "Terminé. Vérifier : https://github.com/$repo/settings/secrets/actions"
