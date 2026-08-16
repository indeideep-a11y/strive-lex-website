#!/usr/bin/env bash
# Strive Lex — one-command deploy
# Usage: GH_TOKEN=<fine-grained PAT> ./deploy.sh
#
# Requires a fine-grained GitHub PAT scoped to ONLY the strive-lex-website repo,
# with Repository permissions > Contents > Read and write. Nothing else.
set -euo pipefail

if [ -z "${GH_TOKEN:-}" ]; then
  echo "Set GH_TOKEN first: export GH_TOKEN=github_pat_..."
  exit 1
fi

SRC="/sessions/sweet-nifty-pascal/mnt/outputs/strive-lex"
REPO_DIR="/tmp/strive-lex-repo"
REMOTE="https://${GH_TOKEN}@github.com/indeideep-a11y/strive-lex-website.git"

if [ ! -d "$REPO_DIR/.git" ]; then
  git clone "$REMOTE" "$REPO_DIR"
fi

cd "$REPO_DIR"
git remote set-url origin "$REMOTE"
git fetch origin main
git checkout main
git reset --hard origin/main

rsync -a --exclude '.git' "$SRC"/ "$REPO_DIR"/

git add -A
if git diff --cached --quiet; then
  echo "Nothing to deploy — working tree matches source."
  exit 0
fi

git commit -m "Deploy: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push origin main
echo "Deployed."
