# Good first issues

Small, well-scoped work found in the current `main` codebase. Paste any item into a GitHub issue as-is (or link this file). Existing open issues that already match are noted.

---

## 1. Add automated tests for paste-block and AI insertion marks

**Related:** [#5](https://github.com/dlealvilla/wildmind-ai-for-education/issues/5)

### Context
The assessment editor blocks paste/drop for integrity and marks AI-inserted text with a TipTap mark (`aiInserted` / `data-insertion-id`). There is **no** `test` script in `package.json` and no unit coverage — regressions only show up in a manual demo.

### Files
- `src/components/Editor/EditorPane.tsx` — paste/drop handlers and `AIInserted` mark
- `src/components/Chat/ChatPane.tsx` — “Insert into document”
- `src/types/assessment.ts` — `InsertionEvent`
- `package.json` — scripts today: `dev`, `build`, `lint` (no `test`)

### Acceptance criteria
- [ ] `npm test` runs in CI-friendly mode and passes without a browser login
- [ ] Paste/drop prevention has at least one test
- [ ] AI insertion mark behaviour is asserted against the TipTap extension or a thin wrapper
- [ ] Short note in README or CONTRIBUTING on how to run tests

---

## 2. Prefer server-only `GEMINI_API_KEY` and stop logging key metadata

### Context
`/api/chat` currently resolves `process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY` and `console.log`s whether each key is present plus `keyLength`. A `VITE_`-prefixed secret can leak into the browser bundle if mis-set. Logging key metadata is unnecessary in production logs.

### Files
- `api/chat.ts`
- `.env.example`
- Any setup docs that still tell people to set `VITE_GEMINI_API_KEY`

### Acceptance criteria
- [ ] `/api/chat` reads only `GEMINI_API_KEY`
- [ ] No `console.log` of key presence / length
- [ ] Clear 5xx / user-facing error when the key is missing (mock fallback behaviour documented if kept)
- [ ] `.env.example` and README match

---

## 3. Extract shared `AIInserted` TipTap mark

### Context
The same TipTap `Mark.create({ name: 'aiInserted', … })` definition (and matching `.ai-inserted-text` CSS) is copy-pasted in `EditorPane` and `SubmissionModal`. Drift between the two will break teacher review of marked inserts.

### Files
- `src/components/Editor/EditorPane.tsx`
- `src/components/SubmissionModal/SubmissionModal.tsx`
- New shared module e.g. `src/components/Editor/aiInsertedMark.ts` (or similar)

### Acceptance criteria
- [ ] Single shared mark (+ shared CSS class definition or stylesheet)
- [ ] Both editor and submission modal import the shared mark
- [ ] Visual mark (amber underline / background) still appears for seeded / inserted text
- [ ] No behaviour change to insert tracking (`InsertionEvent`)

---

## 4. Fix document title still saying “LMS Writing Prototype”

### Context
`index.html` historically used `<title>LMS Writing Prototype</title>`. The product name is **WildMind AI for Education**. (This launch branch may already flip the title — verify on `main` if not.)

### Files
- `index.html`
- Optionally `src/pages/Landing.tsx` branding strings (“Wildmind” vs “WildMind”)

### Acceptance criteria
- [ ] Browser tab title is `WildMind AI for Education` (or includes that name)
- [ ] No user-visible “LMS Writing Prototype” string in the default shell

---

## 5. Per-assessment AI tutor settings

**Related:** [#7](https://github.com/dlealvilla/wildmind-ai-for-education/issues/7)

### Context
Every open assessment gets the same Gemini chat panel. The `Assessment` model has title, description, due date, PDF brief, and status — but **no** per-assessment flags for AI behaviour. Teachers cannot turn AI off for a closed-book style task without a code change.

### Files
- `prisma/schema.prisma` — `model Assessment`
- `src/components/AssessmentWorkspace/AssessmentWorkspace.tsx`, `src/components/Chat/ChatPane.tsx`
- `api/chat.ts`
- `api/teacher/[[...path]].ts` — `PATCH /assessments/:assessmentId`

### Acceptance criteria
- [ ] Schema fields e.g. `aiTutorEnabled`, `aiInsertionsEnabled`, optional `aiSystemPrompt` + migration/seed still works
- [ ] Student UI respects enable/disable
- [ ] `/api/chat` enforces server-side when AI is disabled for that assessment
- [ ] Teacher can toggle settings via existing PATCH (or small UI) and see them persist

---

## 6. Add create-course and create-assessment teacher APIs

**Related:** [#9](https://github.com/dlealvilla/wildmind-ai-for-education/issues/9)

### Context
On `main`, the teacher API is mostly `GET` + `PATCH` (status, mark). Courses and assessments come from `prisma/seed.ts`. There is no authenticated create path for a teacher to add a course or assessment.

### Files
- `api/teacher/[[...path]].ts`
- `prisma/schema.prisma` — `Course`, `Assessment`, `CourseTeacher`
- `prisma/seed.ts`
- Teacher UI: `src/pages/teacher/TeacherHome.tsx`, `TeacherCourse.tsx` (wire a minimal create dialog once APIs exist)

### Acceptance criteria
- [ ] Authenticated teacher can `POST` a course (scoped by `tenantId`) and see it after refresh
- [ ] Authenticated teacher can `POST` an assessment under a course they teach
- [ ] Validation errors (empty title, etc.) surface cleanly
- [ ] Seed path still works for the public demo

---

## 7. Compute attempt analytics from real attempt state (not fixtures)

**Related:** [#6](https://github.com/dlealvilla/wildmind-ai-for-education/issues/6)

### Context
Attempt analytics UI / fixtures live on theme/dev branches, not on `main`. Real attempts already store TipTap document JSON, chat history, and AI insertion events in `AssessmentAttempt.state`. Teacher marks (`mark` 0–100) are separate manual scores.

### Files
- `AssessmentAttempt.state` persistence: `api/student/[[...path]].ts`, `prisma/schema.prisma`
- `src/types/assessment.ts` — `ChatMessage`, `InsertionEvent`
- Theme/dev mock shape (for contract reference): `mockAnalyticsData.ts` on those branches
- New API e.g. `GET /api/teacher/.../analytics`

### Acceptance criteria
- [ ] Pure scorer maps attempt `state` → documented analytics JSON (heuristics first)
- [ ] API returns that JSON for a seeded attempt — not Alice/Bob/Charlie fixtures
- [ ] Empty / missing attempts return a clear empty state
- [ ] Unit tests for the pure scorer
- [ ] Short design note (what the scores are / are not)

---

## 8. Replace unsigned mock tokens with signed JWT (or equivalent)

### Context
`api/lib/auth.ts` builds “JWT-like” tokens with plain base64 JSON — explicitly “NOT secure for production”. `TOKEN_SECRET` exists in `.env.example` but is not used to sign/verify on current `main`.

### Files
- `api/lib/auth.ts`
- `api/auth/mock-login.ts`
- Call sites of `verifyMockToken` / `createMockToken`

### Acceptance criteria
- [ ] Tokens are signed with `TOKEN_SECRET` (HMAC JWT or similar)
- [ ] Verification rejects tampered / unsigned payloads
- [ ] Local demo login still works with `.env` secret set
- [ ] Production fails closed if `TOKEN_SECRET` is missing (or documents the rule clearly)
