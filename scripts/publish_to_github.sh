#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   scripts/publish_to_github.sh <github_repo_url> [branch] [token]
# Example:
#   scripts/publish_to_github.sh git@github.com:YOUR_USER/hamburger.git work
#   scripts/publish_to_github.sh https://github.com/YOUR_USER/hamburger work "$GITHUB_TOKEN"
# Also accepts pasted GitHub blob/tree URLs and normalizes them to repo URLs.

if [[ $# -lt 1 || $# -gt 3 ]]; then
  echo "Usage: $0 <github_repo_url> [branch] [token]"
  exit 1
fi

RAW_URL="$1"
BRANCH="${2:-$(git branch --show-current)}"
TOKEN="${3:-${GITHUB_TOKEN:-}}"

normalize_repo_url() {
  local url="$1"

  # Trim surrounding angle brackets and spaces from pasted snippets.
  url="${url#<}"
  url="${url%>}"
  url="$(echo "$url" | xargs)"

  # Convert GitHub blob/tree URLs to base repo URL.
  if [[ "$url" =~ ^https://github\.com/([^/]+)/([^/]+)/(blob|tree)/.+$ ]]; then
    url="https://github.com/${BASH_REMATCH[1]}/${BASH_REMATCH[2]}.git"
  fi

  # Ensure .git suffix for https GitHub remotes.
  if [[ "$url" =~ ^https://github\.com/[^/]+/[^/]+$ ]] && [[ ! "$url" =~ \.git$ ]]; then
    url="${url}.git"
  fi

  echo "$url"
}

build_auth_url() {
  local url="$1"
  local token="$2"

  if [[ -z "$token" ]]; then
    echo "$url"
    return
  fi

  if [[ "$url" =~ ^https://github\.com/(.+)$ ]]; then
    echo "https://x-access-token:${token}@github.com/${BASH_REMATCH[1]}"
  else
    echo "$url"
  fi
}

REPO_URL="$(normalize_repo_url "$RAW_URL")"
PUSH_URL="$(build_auth_url "$REPO_URL" "$TOKEN")"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: run this script inside a git repository."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "$REPO_URL"
else
  git remote set-url origin "$REPO_URL"
fi

echo "Pushing branch '$BRANCH' to '${REPO_URL}'..."
if [[ -n "$TOKEN" ]]; then
  git push "$PUSH_URL" "$BRANCH"
  git fetch origin "$BRANCH" >/dev/null 2>&1 || true
  git branch --set-upstream-to="origin/$BRANCH" "$BRANCH" >/dev/null 2>&1 || true
else
  git push -u origin "$BRANCH"
fi

echo "Done. Your updates are now on GitHub for branch '$BRANCH'."
