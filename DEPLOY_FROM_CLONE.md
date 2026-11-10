# Deploying your own copy of WildMind AI for Education

This guide is for running your own instance from a fork or clone of
[`dlealvilla/wildmind-ai-for-education`](https://github.com/dlealvilla/wildmind-ai-for-education).
For the general Vercel walkthrough see [DEPLOYMENT.md](DEPLOYMENT.md).

## Step 1: Fork or clone the repository

Fork the repository on GitHub (see GitHub's guide to
[forking a repository](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/fork-a-repo)),
or clone it and push it to a new repository of your own
([creating a new repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)):

```bash
git clone https://github.com/dlealvilla/wildmind-ai-for-education.git
cd wildmind-ai-for-education

# Point the clone at your own (empty) GitHub repository
git remote set-url origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Step 2: Create a Postgres database

The API uses Prisma with PostgreSQL. Any Postgres works; a
[Neon](https://neon.com/docs) pooled connection string is what the
project is tested with. Create the schema and demo data from your machine:

```bash
cp .env.example .env    # then fill in DATABASE_URL
npm install
npx prisma db push
npm run db:seed
```

## Step 3: Import the repository into Vercel

Follow Vercel's [Getting started](https://vercel.com/docs/getting-started-with-vercel)
guide and select your repository. `vercel.json` already sets the build:

- Framework Preset: **Vite**
- Build Command: `npx prisma generate && npm run build`
- Output Directory: `dist`

## Step 4: Set environment variables

In the Vercel project, add these
([managing environment variables](https://vercel.com/docs/environment-variables)):

| Name | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string (pooled) |
| `TOKEN_SECRET` | yes | Long random string used to sign login sessions (HMAC-SHA256). Deployed builds refuse to sign or accept sessions without it. Changing it signs everyone out. |
| `GEMINI_API_KEY` | for AI chat | Server-only Gemini key ([get an API key](https://ai.google.dev/gemini-api/docs/api-key)). Never use a `VITE_` prefix. |
| `CRON_SECRET` | recommended | Shared secret for `/api/cron/auto-close-assessments` (`x-cron-secret` header) |
| `BLOB_READ_WRITE_TOKEN` | for PDF upload | Vercel Blob token used by teacher PDF uploads |

Generate a `TOKEN_SECRET` with, for example:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Redeploy after adding or changing variables.

## Step 5: Deploy from the CLI (optional)

```bash
npm install -g vercel
vercel login
vercel          # preview deployment
vercel --prod   # production deployment
```

See the [Vercel CLI docs](https://vercel.com/docs/cli) for details.

## Troubleshooting

- **Vercel can't see your repository:** see [VERCEL_TROUBLESHOOTING.md](VERCEL_TROUBLESHOOTING.md).
- **Build fails:** read the build logs for the deployment in Vercel, and run `npm run build` locally.
- **AI chat errors:** see [TROUBLESHOOTING_AI.md](TROUBLESHOOTING_AI.md) and [VERIFY_API_KEY.md](VERIFY_API_KEY.md).
- **Everyone was signed out:** expected after changing `TOKEN_SECRET`; sign in again.
