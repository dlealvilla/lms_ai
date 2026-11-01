# Folio polish — before / after

Display font swap: **Instrument Serif → Newsreader** (Google Fonts, `opsz` + `wght` 500–600). Chosen over Fraunces and Source Serif 4 for the best pairing with Inter: wider, flatter, slightly heavier editorial face without condensed proportions. Large headings use ~0.01em letter-spacing so they don’t feel cramped.

Brand never shows “Folio”; product lockup is **WildMind / AI for Education**. Teacher avatar initials **SS**.

## Paths

| What | Path |
|------|------|
| After shots (repo) | `docs/screenshots/folio/*.png` |
| After shots (workspace) | `/workspace/github-polish/lms-folio-shots/*.png` |
| Before polish | `/workspace/github-polish/lms-folio-shots/before-polish/*.png` |
| Checklist | `docs/screenshots/folio/CHECKLIST.md` + `checklist.json` |
| PR | https://github.com/dlealvilla/wildmind-ai-for-education/pull/16 |

## Checklist

Local e2e: **28/28 PASS** (`scripts/folio-e2e.mjs`, Vite `:5173`, API `:3001`, Postgres `:54329`, `/api/chat` stubbed).

## Per-screen before → after

### Landing
- **Before:** Tall/thin Instrument Serif headline; sparse left column.
- **After:** Newsreader ~560 weight, wider stance, `tracking-[0.01em]`; same WildMind lockup + Student/Teacher CTAs; warm `#FAFAF8` paper.

### Login (desktop + mobile)
- **Before:** Basic form, Instrument accents.
- **After:** Newsreader title, folio inputs/buttons, Inter body; mobile 390px layout intact.

### Teacher dashboard (desktop + mobile)
- **Before:** Sparse shelf, empty lower half, DS initials risk, Instrument greeting.
- **After:** Newsreader “Good afternoon, Sarah”; course cards with Next Up + spines; Needs Marking / Upcoming / Recent queues fill dead space; **SS** avatar; mobile header + drawer rail (`folio-mobile-only`).

### Teacher course / student detail / marking
- **Before:** Flatter lists, less hierarchy.
- **After:** Folio cards, section labels, Newsreader titles, sticky chrome; marking view keeps essay + notes layout.

### Student dashboard / course
- **Before:** Thin shelf, little “what’s next”.
- **After:** Next-up emphasis, nest-safe course links, Newsreader headings, Inter meta; mobile drawer.

### Assessment editor (desktop + mobile)
- **Before:** Cramped canvas, Instrument doc title, less sticky chrome; mobile notes awkward.
- **After:** ~65–75ch canvas; sticky lucide toolbar; margin-notes sheet (`#FFF9E6`); Newsreader doc H1; desktop notes always on (`folio-desktop-only`); mobile Notes FAB + sheet (`folio-mobile-only`); toast on insert; skeletons on chat load.

### Admin dashboard
- **Before:** Dense admin chrome.
- **After:** Folio buttons/inputs, Newsreader page title, Users/Courses tabs unchanged functionally.

## Design tokens touched
- Paper `#FAFAF8`, surface `#FFF`, ink `#111`, sticky note `#FFF9E6`
- Spacing 4/8 rhythm; folio-btn / folio-input / folio-card
- `--font-serif: Newsreader`; `--font-sans: Inter`
- Responsive helpers: `.folio-mobile-only` / `.folio-desktop-only` (media `!important`, avoids Tailwind `lg:` misses on FAB/rail)

## Bugs found / fixed this pass
1. Mobile Notes FAB intercepting desktop clicks despite `lg:hidden` → switched AssessmentWorkspace (+ LibraryShell drawer/overlay) to explicit `folio-mobile-only` / `folio-desktop-only` media helpers.
2. Display face too tall/condensed (Instrument Serif) → **Newsreader**.

## Owner needs
- Review PR #16 screenshots + Newsreader choice; merge when satisfied (not merged by this bot).
- Optional: decide whether to keep `scripts/start-folio-pg.mjs` as a documented local helper.
