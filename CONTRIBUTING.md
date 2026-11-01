# Contributing to WildMind AI for Education

Thanks for wanting to help. WildMind puts the AI tutor **inside** the assignment so teachers can see the prompts and what the AI inserted. Contributions of any size are welcome.

## Getting started

1. Fork the repo and clone your fork.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in:
   - a Postgres connection string (Neon works well)
   - `GEMINI_API_KEY` (server-only; preferred)
   - `TOKEN_SECRET` for anything beyond local throwaway use
4. Set up the database: `npm run db:push` then `npm run db:seed`
5. Run the app: `npm run dev`
6. Before opening a PR, run `npm run lint` and `npm run build`.

There is no `npm test` yet — adding one is a [good first issue](docs/good-first-issues.md).

## Picking something to work on

- Start with [docs/good-first-issues.md](docs/good-first-issues.md) (ready to paste into GitHub).
- Look for issues labelled [good first issue](https://github.com/dlealvilla/wildmind-ai-for-education/labels/good%20first%20issue) or [help wanted](https://github.com/dlealvilla/wildmind-ai-for-education/labels/help%20wanted).
- Comment on the issue before you start so work isn’t duplicated.
- Have an idea that isn’t listed? Open an issue first.

## Pull requests

- Open PRs against `main`, small and focused on one thing.
- Describe what changed and how you tested it; screenshots help for UI changes.
- Keep the README accurate to what ships on `main` — don’t document unmerged branch features as live.
- All changes are reviewed and merged by the maintainer, [@dlealvilla](https://github.com/dlealvilla).

## Security

Please don’t open public issues for security problems; see [SECURITY.md](SECURITY.md).

## Code of conduct

Be kind. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
