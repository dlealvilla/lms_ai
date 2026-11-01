# Roadmap — WildMind AI for Education

Honest status relative to what ships on `main` today. Items move here from ideas / open issues; nothing here is a commitment to dates.

## Now (good first / near-term)

- **Tests** — Vitest (or similar) for paste-block and AI-insertion marks; wire `npm test`. See issue #5 and `docs/good-first-issues.md`.
- **Server-only Gemini** — stop preferring `VITE_GEMINI_API_KEY` and stop logging key metadata in `/api/chat`.
- **Shared TipTap mark** — extract duplicated `AIInserted` mark from `EditorPane` and `SubmissionModal`.
- **Create course / assessment APIs** — teacher (or admin) POST create; seed is the only way to add courses today. See issue #9.
- **Per-assessment AI settings** — enable/disable tutor and insertions; optional system prompt. See issue #7.

## Next

- **Live attempt analytics** — Domain Knowledge / AI Usage composites from real `AssessmentAttempt.state` (chat, insertions, document), not fixtures. Preview UI exists on theme/dev branches; not on `main`. See issue #6.
- **Bookshelf theme** — open-book assessment + shelf course home (PR / `theme/bookshelf`). Optional visual layer; core LMS behaviour stays the same.
- **Signed auth** — replace unsigned base64 mock tokens (`api/lib/auth.ts`) with proper JWT (or similar) using `TOKEN_SECRET`.
- **Public demo polish** — CSS/`@config` fixes, Neon retry, health check (see `polish/public-demo`).

## Later

- Real identity provider (beyond mock email login).
- Richer teacher tooling (bulk mark, export, rubric).
- Multi-tenant admin create flows beyond read-only overview.
- Hardening paste/clipboard edge cases across browsers.

## Not planned (for this repo)

- Commercial packaging or employer-specific deployments in-repo.
- Shipping undocumented branch features as if they were on `main`.
