#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   scripts/publish_to_github.sh <github_repo_url> [branch]
# Example:
#   scripts/publish_to_github.sh git@github.com:YOUR_USER/hamburger.git work
# Also accepts pasted GitHub blob/tree URLs and normalizes them to repo URLs.

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: $0 <github_repo_url> [branch]"
  exit 1
fi

RAW_URL="$1"
BRANCH="${2:-$(git branch --show-current)}"

normalize_repo_url() {
  local url="$1"

  # Trim surrounding angle brackets from pasted markdown/CLI snippets.
  url="${url#<}"
  url="${url%>}"

  # Convert GitHub blob/tree URLs to base repo URL.
  # e.g. https://github.com/org/repo/blob/main/file -> https://github.com/org/repo.git
  if [[ "$url" =~ ^https://github\.com/([^/]+)/([^/]+)/(blob|tree)/.+$ ]]; then
    url="https://github.com/${BASH_REMATCH[1]}/${BASH_REMATCH[2]}.git"
  fi

  # Ensure .git suffix for https GitHub remotes.
  if [[ "$url" =~ ^https://github\.com/[^/]+/[^/]+$ ]] && [[ ! "$url" =~ \.git$ ]]; then
    url="${url}.git"
  fi

  echo "$url"
}

REPO_URL="$(normalize_repo_url "$RAW_URL")"

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
