# GitHub Sync Fix

Your local commits were not appearing on GitHub because this repository had **no `origin` remote configured**.

## What happened

- Commits were created locally on branch `work`.
- There was no remote destination, so nothing could be pushed to GitHub.

## Immediate fix

### Option A (quick)

```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin work
```

### Option B (helper script)

```bash
scripts/publish_to_github.sh <YOUR_GITHUB_REPO_URL> work
# You can also paste a GitHub blob/tree URL; the script normalizes it.
```

## If you want a brand-new GitHub repository

1. Create an empty repo on GitHub (web UI) with no README/license.
2. Copy its URL (SSH or HTTPS).
3. Run:

```bash
scripts/publish_to_github.sh <NEW_REPO_URL> work
```

After this, all existing local commits become visible on GitHub.
