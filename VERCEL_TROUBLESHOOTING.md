# Why Vercel can't find your repository

If your fork or copy of `wildmind-ai-for-education` doesn't show up when you
import a project in Vercel, it's almost always one of these.

## Common reasons

### 1. The repository is private
Vercel needs permission to read private repositories through the Vercel GitHub App.

### 2. The Vercel GitHub App isn't installed or authorized for that repository
The app may be installed only for selected repositories.

### 3. Repository name or owner mismatch
GitHub names are exact: check you're looking under the right account or
organization, and that the name matches (for example `wildmind-ai-for-education`).

## How to fix

### Option A: Check the Vercel ↔ GitHub connection (recommended)

Follow Vercel's guide [Deploying GitHub projects with Vercel](https://vercel.com/docs/git/vercel-for-github),
in particular the sections on connecting your GitHub account and choosing which
repositories the Vercel app can access. Grant access to your repository, then try
importing again.

### Option B: Check the GitHub App's repository access

In GitHub, open your repository's **Settings → GitHub Apps** (or your account's
**Settings → Applications → Installed GitHub Apps**), find **Vercel**, choose
**Configure**, and make sure the repository is included. GitHub documents this in
[Reviewing and modifying installed GitHub Apps](https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps).

### Option C: Deploy with the Vercel CLI

If the import screen still doesn't list the repository, you can deploy from your
local clone with the [Vercel CLI](https://vercel.com/docs/cli) (`vercel`, then
`vercel --prod`) and connect Git later.

See [DEPLOY_FROM_CLONE.md](DEPLOY_FROM_CLONE.md) for the full setup, including
the environment variables the app needs.
