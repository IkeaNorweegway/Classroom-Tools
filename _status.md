# Project Status
*Last updated: 2026-10-06*

Current state only. Keep this file short: update the tables and the open list, and put session detail in the commit message. The session log up to 2026-10-05 is in `_status-archive.md`.

---

## Workspace

- **One repo.** Sources and the site live together in `D:\Classroom tools` (GitHub: `IkeaNorweegway/Classroom-Tools`, **public**).
- **Site:** Astro + Tailwind, published at https://ikeanorweegway.github.io/Classroom-Tools/ by GitHub Actions on every push to `master`. Design rules: `_site-context.md`.
- **Where files go:** markdown sources in the type folders (`notes-packages/`, `worksheets/`, `tests-quizzes/`, `lesson-plans/`, `steam/`). HTML and PDF renders only in `public/materials/`.
- **Never committed** (see `.gitignore`): `legislation/`, school admin files, third-party reference PDFs, and unreleased tests. Students can read this repo.
- **This machine:** no Node, Python, Perl, or LaTeX on the PATH, and headless Edge hangs. The site cannot be built locally, the `.py` render scripts cannot run here, and HTML has to be checked by opening it in a browser by hand. Headless **Chrome** does work (`chrome.exe --headless=new --dump-dom` or `--screenshot`), so a page's JavaScript can be tested and screenshotted that way.

---

## Open items

### Needs a teacher decision or a source check
- **Science 7 notes answer keys (v2):** Ecosystems S4 Alberta biodiversity counts and Plants S5 "over ___ billion dollars" are approximate and marked "confirm". Planet Earth S3 now says 7 major plates (v1 said 15). Planet Earth S4 notes say magnitude 7 releases 10× the energy of magnitude 6 (strictly 10× shaking, about 32× energy). Structures S2 notes call snow both a live load and a dead load.
- **Math 9 circle geometry worksheets:** Core Q6 and Challenge Q3 have angle expressions with no valid solution. Flagged in the answer keys, not fixed.
- **Math 9 outcome codes:** the Rational Numbers test and bank use local codes RN1–RN5 because the course context has no official codes.
- **Lily Lab:** written as one mounted card per group. A multi-bloom stem per group would allow one per student.
- **STEAM:** Grade 9 Unit 1 language (Java or Python, both built). Soldering safety protocol, wood-shop access, littleBits inventory, and the Rube Goldberg cross-group protocol are open in `steam/_context.md`.
- **Slow reveal graphs:** decide whether to build a generic recording sheet for daily warm-up use.
- **Materials suite:** `_meta-context.md` lists a PPTX deck per unit. None have been built. Decide whether to keep it in the suite.

### Not yet checked or finished
- **HTML never opened in a browser:** photosynthesis sim, Flower Field and Clone Field games (`sci7-flower-field-game-v1`, `sci7-clone-field-game-v1`; game rules were play-tested by script, the pages were not; not committed), Science 7 notes answer keys v2, Math 9 Rational Numbers test and question bank, slow reveal projector page and worksheet.
- **Plant Hunt PDFs** in `public/materials/` may be stale against their HTML (the icon-flowchart revision). Re-render and compare.
- **Photosynthesis sim:** no recording sheet or teacher notes. Grade 6 would need a cut-down version.
- **Plant Hunt:** no answer key.
- **Slow reveal trial:** not on the site.
- **Social 9:** 7 units are published (HTML only) with no course context in `_courses/` and no markdown source.
- **Social 8 teacher guides:** HTML only, no markdown source.
- **ASCII-to-SVG conversion** is unfinished: `notes-packages/_ascii-to-svg-status.md` still lists 16 files as pending or in progress.
- **STEAM research summaries:** the STEAM progression summary and the design-thinking, graphic and web design summary that the STEAM contexts lean on have never been written. The contexts now mark both as planned.
- **Grade 6 Science markdown sources** still missing for HTML-only materials: workbook answer keys (5 of 7), all EF notes except the year notes, all EF workbooks and their keys, teacher notes (5 of 6), all FR notes and workbooks.
- **Grade 6 unit pages** (`src/content/units/*.md`) still read like spec documents. Planned rewrite: opening hook → what students explore → what they will be able to do → one real-world connection.

---

## Build status

✓ = built · — = not started · "site" = HTML published in `public/materials/`

### Grade 6 Science (site ✓)

All six units plus the year review have, on the site: notes, workbook, teacher notes, and workbook answer key in EN, with EF and FR versions of notes and workbooks and EF workbook keys. Also built: Forces exit tickets, Forces project brief, Forces sub plan (markdown only). Missing markdown sources are listed under Open items.

### Grade 7 Science (site ✓)

| Unit | Tier | Notes | Notes AK | Workbook | Workbook AK | Exits | Quiz | Test | Teacher Guide |
|---|---|---|---|---|---|---|---|---|---|
| Interactions & Ecosystems | 1 | ✓ | ✓ v2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Plants for Food & Fibre | 1 | ✓ | ✓ v2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Heat and Temperature | 1 | ✓ | ✓ v2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Structures and Forces | 2 | ✓ | ✓ v2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Planet Earth | 2 | ✓ | ✓ v2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- The workbook on the site (`workbook-v1.html`) was rebuilt directly as HTML (commit `01a1b76`, 12 questions plus 3 stretch). It is newer than the `workbook-v2.md` source and does not match it, so the markdown cannot simply be re-rendered.
- **Plants extras (site):** Plant Hunt outdoor activity (+ IPP), Lily Lab (+ IPP + teacher notes), photosynthesis and flower reproduction simulations, organizers (IPP and non-reader versions) for photosynthesis, plant systems, plant cells, and reproduction.
- Not built: FR or EF adaptations of the core materials.

### Math 9 (site ✓)

All 11 topics have notes, notes answer key, teacher notes, concept one-pager, Core and Challenge worksheets with keys, a poster, and exit tickets. Four strand workbooks with keys (Number, Algebra, Measurement & Geometry, Statistics & Probability).

| Material | Status |
|---|---|
| Quizzes | — |
| Unit tests | Rational Numbers only. v1 is public as the practice test, **v3 is the real test**, v2 is superseded. |
| Question banks | Rational Numbers only (60 items) |
| Slow reveal graph (Statistics) | Trial built, not on site |

Answer key design follows `research/answer-key-design-research.md`: full worked solutions for Core, partial solutions for Challenge, faded structure in strand workbooks.

### Grade 8 Social (site ✓)

Four units (Political Systems, Economic Systems, Ideologies, Civic Engagement): notes, notes AK, workbook, workbook AK, and teacher guide on the site. Exit tickets and unit tests exist as markdown and are not published.

### Grade 9 Social (site ✓, HTML only)

Seven units: notes, notes AK, workbook, workbook AK, teacher guide. See Open items.

### STEAM Grades 5–9 (site ✓)

Notes and design journal for every unit: 4 units per grade, plus a Python path for Grade 9 Units 1 and 2. Not built: quizzes, exit tickets, teacher guides, answer keys. Everything lives in `steam/`.

**Grade 9 Python Trainer (site):** `public/materials/steam9-python-trainer-v1.html`, HTML only. An in-browser editor and console (Skulpt, vendored in `public/vendor/skulpt/`) with 18 checked steps plus one Extended step that follow Notes Concepts 1–4 and Journal Part D, then an unchecked workshop for the game (Journal Parts A–G) and a playground. It serves as the unit's "structured tutorials". Checks and UI flow were tested in headless Chrome; it has not been tried by students or on school devices. No Java equivalent.

**Grade 5 Dash Trainer (site):** `public/materials/steam5-dash-trainer-v1.html`, HTML only, no libraries. Students drag or tap blocks (drive, turn, beep, light, repeat, if/else) into a program that drives an on-screen robot on a grid. 14 checked steps plus one Extra step follow Notes Parts 1–3 and Journal Parts A–D, then a free-play step where students build their own course. Notes Part 4 (micro:bit) is not covered. Step logic, checks, drag and tap were tested in headless Chrome with a mouse-style pointer; it has not been tried by students, on a touch screen, or on school devices.

**Grade 6 littleBits Trainer (site):** `public/materials/steam6-littlebits-trainer-v1.html`, HTML only, no libraries. Students drag or tap bits into one chain; a yellow signal shows where power reaches, and buttons under the circuit stand in for pressing the button, darkening the room, and making a noise. 12 checked steps plus one Extra step follow Notes Parts 1–4 and Journal Steps 1–5, then free play. Simplified model (single chain, light sensor passes in the dark, backwards bits stop the signal). The bit list comes from the notes and has not been matched to the school's kits. Tested in headless Chrome with a mouse-style pointer; not tried by students, on a touch screen, or on school devices.

### eSports

| Material | Status |
|---|---|
| Course context, research files | ✓ |
| 9-week unit plan | ✓ |
| Season workbook, club charter, tilt scenario cards, pre-match report, role rotation schedule | ✓ |
| Domain worksheets, exit tickets, showcase templates, reflection portfolio, rubrics | — |

### PhysEd 5–6 and 7–9

Course and unit contexts only (7 units each). No lesson plans, rubrics, exits, or worksheets built.
