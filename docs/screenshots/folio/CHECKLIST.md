# Folio click-through checklist (local)

Generated from `scripts/folio-e2e.mjs` against Vite `:5173` + local API `:3001` + embedded Postgres `:54329`.
`/api/chat` stubbed at the network layer with `{ response }` shape matching `src/lib/ai`.

## Result: 28/28 PASS

- [PASS] Landing page loads
- [PASS] Landing → Teacher Login
- [PASS] Quick login Dr. Smith fills email
- [PASS] Teacher mock login → dashboard
- [PASS] Teacher dashboard greeting visible
- [PASS] Teacher dashboard queue panels
- [PASS] Teacher open COMP101 course
- [PASS] Teacher course Assessments tab
- [PASS] Teacher open student detail
- [PASS] Teacher marking view
- [PASS] Teacher logout control present/clickable
- [PASS] Student mock login → dashboard
- [PASS] Student open COMP101
- [PASS] Assessment editor clean (no error notes)
- [PASS] Student assessment editor loads
- [PASS] AI tutor sticky note (stubbed /api/chat)
- [PASS] Insert ¶ into document
- [PASS] Editor toolbar B
- [PASS] Editor toolbar I
- [PASS] Editor toolbar U
- [PASS] Editor toolbar H1
- [PASS] Editor toolbar H2
- [PASS] Submit Assessment button visible
- [PASS] Submit Assessment opens confirmation (cancelled)
- [PASS] Admin mock login → dashboard
- [PASS] Admin Users tab
- [PASS] Admin Courses tab
- [PASS] + New assessment button clickable

## Branding checks (manual on screenshots)

- Sidebar / header show **WildMind** + **AI for Education** (never "Folio")
- Teacher avatar initials **SS** for Dr. Sarah Smith
- Assessment editor: one AI-highlighted insert + sensible margin notes, no empty-response leftovers
- Display serif: **Newsreader** (opsz + weight 500–600) with Inter UI; headings use slight positive letter-spacing
