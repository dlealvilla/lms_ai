# Folio click-through checklist (local)

Generated from `scripts/folio-e2e.mjs` against Vite `:5173` + local API `:3001` + embedded Postgres `:54329`.
`/api/chat` stubbed at the network layer with `{ response }` shape matching `src/lib/ai`.

## Result: 27/27 PASS

- Landing page loads
- Landing → Teacher Login
- Quick login Dr. Smith fills email
- Teacher mock login → dashboard
- Teacher dashboard greeting visible
- Teacher open COMP101 course
- Teacher course Assessments tab
- Teacher open student detail
- Teacher marking view
- Teacher logout control present/clickable
- Student mock login → dashboard
- Student open COMP101
- Assessment editor clean (no error notes)
- Student assessment editor loads
- AI tutor sticky note (stubbed /api/chat)
- Insert ¶ into document
- Editor toolbar B / I / U / H1 / H2
- Submit Assessment button visible
- Submit Assessment opens confirmation (cancelled)
- Admin mock login → dashboard
- Admin Users / Courses tabs
- + New assessment button clickable

## Branding checks (manual on screenshots)

- Sidebar / header show **WildMind** + **AI for Education** (never "Folio")
- Teacher avatar initials **SS** for Dr. Sarah Smith
- Assessment editor: one AI-highlighted insert + sensible margin notes, no empty-response leftovers
