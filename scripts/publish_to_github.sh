#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   scripts/publish_to_github.sh <github_repo_url> [branch]
# Example:
#   scripts/publish_to_github.sh git@github.com:YOUR_USER/hamburger.git work

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: $0 <github_repo_url> [branch]"
  exit 1
fi

REPO_URL="$1"
BRANCH="${2:-$(git branch --show-current)}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: run this script inside a git repository."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "$REPO_URL"
else
  git remote set-url origin "$REPO_URL"
fi

echo "Pushing branch '$BRANCH' to '$REPO_URL'..."
git push -u origin "$BRANCH"

echo "Done. Your updates are now on GitHub for branch '$BRANCH'."
