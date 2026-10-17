# Project Status
*Last updated: 2026-10-15*

Current state only. Keep this file short: update the tables and the open list, and put session detail in the commit message. The session log up to 2026-10-05 is in `_status-archive.md`.

---

## Workspace

- **One repo.** Sources and the site live together in `D:\Classroom tools` (GitHub: `IkeaNorweegway/Classroom-Tools`, **public**).
- **Site:** Astro + Tailwind, published at https://ikeanorweegway.github.io/Classroom-Tools/ by GitHub Actions on every push to `master`. Design rules: `_site-context.md`.
- **Where files go:** markdown sources in the type folders (`notes-packages/`, `worksheets/`, `tests-quizzes/`, `lesson-plans/`, `steam/`). HTML and PDF renders only in `public/materials/`.
- **Games:** design, build, and test rules are in `_games-context.md` (games only; simulations and trainers have no context file yet).
- **Never committed** (see `.gitignore`): `legislation/`, school admin files, third-party reference PDFs, and unreleased tests. Students can read this repo.
- **This machine:** no Node, Python, Perl, or LaTeX on the PATH, and headless Edge hangs. The site cannot be built locally, the `.py` render scripts cannot run here, and HTML has to be checked by opening it in a browser by hand. Headless **Chrome** does work (`chrome.exe --headless=new --dump-dom` or `--screenshot`), so a page's JavaScript can be tested and screenshotted that way.

---

## Open items

### Needs a teacher decision or a source check
- **Student / parent / teacher views (2026-10-15):** built for all six courses. Every unit has a student page (fun hook, real-world cards, numbered path), a parent guide (plain summary, grade progression, assumed knowledge, mix-ups, tips, worked examples) and two one-page home practice sheets with keys (76 sheets in all). Teacher hubs show a one-line summary per unit. Needs a teacher read-through: the student and parent copy, and especially the grade-to-grade progressions, which are best guesses for the earlier grades (the 2023 K–6 science and draft 7–9 social curricula) and use the 10C/10-3, Science 10 and Social 10–30 sequences for high school.
- **Science 7 notes answer keys (v2):** Ecosystems S4 Alberta biodiversity counts and Plants S5 "over ___ billion dollars" are approximate and marked "confirm". Planet Earth S3 now says 7 major plates (v1 said 15). Planet Earth S4 notes say magnitude 7 releases 10× the energy of magnitude 6 (strictly 10× shaking, about 32× energy). Structures S2 notes call snow both a live load and a dead load.
- **Math 9 circle geometry worksheets:** Core Q6 and Challenge Q3 have angle expressions with no valid solution. Flagged in the answer keys, not fixed.
- **Math 9 outcome codes:** the Rational Numbers test and bank use local codes RN1–RN5 because the course context has no official codes.
- **Math 9 inquiry projects (2026-10-17):** all four strands need a teacher read-through and a classroom trial. Before printing: confirm the Calgary Transit youth fares ($2.65 / $26.50 book / $92 pass) and the Edmonton Arc youth fares ($3, $66 monthly cap; the city page didn't load) in Algebra; the garden stone ($50/m²) and edging ($5/m) prices are samples. Number Option 3 needs a week of real Calgary or Lethbridge weather data downloaded; Statistics Option 2 needs NHL standings printed (last season's final standings recommended). Rubrics use new local codes (one per notes section: PE, SR, LR, LE, PO, CG, ME, SI, ST, PR, alongside RN). Briefs print to 9 pages, journals to 9–10, teacher guides to 18–19 (each section starts a page). Sources render with `scripts/render_math9_projects.py` (pandoc).
- **CEFL 7–9:** review the proposed units, local outcome codes, misconceptions and depth ceilings in `_courses/cefl/_context.md`. Real-world figures in CEFL materials are dated and must be re-checked: minimum wage, tax, CPP and EI rates each January; tuition (U of A 2026–27, Portage College apprenticeship) each year; ALIS wages (2023 survey) when a new survey is published; Alberta's job market forecast (2023–2033 edition used) and youth employment rules. Book audiences early: Grade 6 class (Income and Tax, Experiences), Career Café (Labour Market), counsellor panel (Post-Secondary).
- **Lily Lab:** written as one mounted card per group. A multi-bloom stem per group would allow one per student.
- **STEAM:** Grade 9 Unit 1 language (Java or Python, both built). Soldering safety protocol, wood-shop access, littleBits inventory, and the Rube Goldberg cross-group protocol are open in `steam/_context.md`.
- **Slow reveal graphs:** decide whether to build a generic recording sheet for daily warm-up use.
- **Materials suite:** `_meta-context.md` lists a PPTX deck per unit. None have been built. Decide whether to keep it in the suite.

### Not yet checked or finished
- **Teaching visuals in notes (2026-10-15):** 171 new diagrams across all five Science 7 notes packages (78) and all eleven Math 9 notes packages (93), mirrored into each notes answer key with the blank labels filled in. Sources are in `notes-packages/_visuals/`; `scripts/add_notes_visuals.py` inserts them. Checked in headless Chrome and with the SVG audit (no new violations). Not done: the markdown sources have no `[SVG: …]` placeholders yet, the old HTML copies beside the Math 9 markdown in `notes-packages/math-9/` were not updated, and nothing has been printed on the school copier.
- **Social 8/9 notes visuals (2026-10-17):** 39 diagrams across all 11 Social notes packages, at least one per section that lacked one (Grade 8: 9, filling sections with no visual; Grade 9: 30, where there were none). Six are real maps built from Natural Earth (public domain) by `scripts/build_social_maps.py` into `notes-packages/_visuals/_maps/` and pulled in with `<mapbase>`: displaced persons from Europe to Canada, WWII campaigns with a Hong Kong inset, the 1931 Dominions, NATO/Korea/Suez/NORAD, postwar immigration sources, and Canada's regions. Same pipeline as Science/Math (`scripts/add_notes_visuals.py`, now idempotent). The raw map data in `scripts/data/natural-earth/` (3 MB) is not needed to insert visuals, only to rebuild maps. Checked in headless Chrome. Not done: teacher read-through, copier print test (maps use light fills), markdown placeholders. Source issues spotted, not fixed: Government S2 says "six steps" but lists seven; Citizenship S3 says the amending formula lets "the federal government make additions" and the notwithstanding clause is provincial only (the diagram uses the accurate versions).
- **Site fonts:** every student notes package and workbook, and their answer keys (201 files), now use Atkinson Hyperlegible Next and Fraunces with warm-neutral contrast, as in the Forces pilot. Not yet converted: teacher notes and guides, tests, quizzes, exit tickets, and home practice sheets (`scripts/apply_site_fonts.py` handles them). Not yet printed on a school photocopier.
- **HTML never opened in a browser:** photosynthesis sim, Science 7 notes answer keys v2, Math 9 Rational Numbers test and question bank, slow reveal projector page and worksheet.
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
- **Seed to Seed v2 (site):** `public/materials/sci7-seed-to-seed-game-v2.html`, linked under Plants → Simulations and Games. v1 is kept and unlinked. A real-time upgrade game (LO 7-2-02 to 7-2-05): one wild strawberry makes glucose by the Plant Lab rule, students spend it on plant parts, then on flowers and runners, and at frost choose one offspring to plant next year. Five year types, Gentle and Real modes, a typed breeder's note, a Report, and a browser save. v2 keeps v1's model and changes the page: icon gauges, a tutorial, moving water, sugar, and bees, and plant alerts (the game stops when trouble starts and asks what would help) in place of the ten-day check-ins. Design detail is in `_games-context.md`. Tested in headless Chrome: scripted players match v1 exactly, and the alerts, tutorial, a five-generation run, a death, and three screen widths were click-tested. Part descriptions now open from the keyboard. Untested: real-time pacing, how often alerts feel right, touch, school devices, students.
- **Flower Field v2 and Clone Field v2 (site):** `sci7-flower-field-game-v2.html` and `sci7-clone-field-game-v2.html`, linked under Plants → Simulations and Games. v1 of each is kept and unlinked. Turn-based field games (LO 7-2-04): students set plant parts and surroundings, grow a season, and read where offspring were lost. v2 keeps each v1 field model and adds a tutorial, Gentle and Real modes, a "What would help?" question when a season goes badly, a typed explanation after each win (the debrief shows once it is saved), a Report, icons on every control, a saved level in progress, and a `?debug=1` hook. Tested in headless Chrome: scripted players match v1 exactly; the answer tables were run against the model from random states and no choice marked wrong beat the right one; the question, hint, win, typed answer, report, save, and tutorial were click-tested; screenshots at 1340, 1000, and 600 px. Untested: how often the questions feel right in class, touch, school devices, students.
- **Photosynthesis sim v2 and Flower Lab sim v2 (site):** `sci7-photosynthesis-sim-v2.html` and `sci7-flower-reproduction-sim-v2.html`, linked under Plants → Simulations and Games. v1 of each is kept and unlinked. Both are free-play labs with predict-then-test missions, and v2 adds the Seed to Seed v2 changes: icons on every control, a five-step tutorial that stops time, one "What would help?" plant alert per run (photosynthesis: wilting leaves; flower: a broken step while the flower is open), saved progress under a v2 key (v1 mission progress carries over), and a `?debug=1` hook. The models are unchanged from v1. Tested in headless Chrome: each alert choice was run against the model (every right choice fixes the step, every wrong one changes nothing), plus the alert flow, the tutorial, and focus on the parts. Untested: real-time pacing, touch, school devices, students, and the alert's wording in class. The sims are outside `_games-context.md`, so the game rules were applied as a guide, not a checklist.
- Not built: FR or EF adaptations of the core materials.

### Math 9 (site ✓)

All 11 topics have notes, notes answer key, teacher notes, concept one-pager, Core and Challenge worksheets with keys, a poster, and exit tickets. Four strand workbooks with keys (Number, Algebra, Measurement & Geometry, Statistics & Probability).

| Material | Status |
|---|---|
| Quizzes | — |
| Unit tests | Rational Numbers only. v1 is public as the practice test, **v4 is the real test** (v3's questions, with Parts C and D scored on a five-row rubric using the report-card scale; /52), v2 and v3 are superseded. |
| Question banks | Rational Numbers only (60 items) |
| Slow reveal graph (Statistics) | Trial built, not on site |
| Inquiry projects | **All four strands (site, 2026-10-17)**: brief (3 options + rubric), project journal and teacher guide per strand. None tried with students yet |

**Fraction Simulator (site):** `public/materials/math-9/practice/math9-fraction-sim-v1.html`, HTML only, no libraries, linked from the Number page under Rational Numbers. Three tabs: equivalent fractions (bar model, with an "add to top and bottom" mode that shows the mistake), simplifying (divide by a common factor and the bar pieces join; optional factor lists), and cross-cancelling (tap a top and a bottom, divide both, prime-factor row, ÷ needs a flip first). Positive fractions only. Logic was tested in headless Chrome with scripted clicks; it has not been tried by students, on a touch screen, or on school devices, and the site build with the new link has not been run.
- **Fraction Simulator v2 (site):** `public/materials/math-9/practice/math9-fraction-sim-v2.html`, linked from the Number page. v1 is kept and unlinked. Same three tabs and model. v2 adds a Tutorial button and a four-step tour for each tab that points at the real controls, runs once per tab on the first visit, and never blocks the controls. Tested in headless Chrome: tour steps, Next, Skip, Escape, replay, and one tour per tab. Untested: how the tour reads to students, touch, and school devices.

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

### CEFL 7–9 (in progress)

Project-based course: 1 hour every 3 days, ~40 sessions a year, 5 units per grade. Each unit has a mini-workbook (teaching moments), a project brief, and a teacher guide. Spec in `_courses/cefl/_context.md`; evidence in `research/project-based-learning-research.md` and `research/financial-career-education-research.md`. Renderer: `scripts/render_cefl.py`; all renders in `public/materials/cefl/`.

**Grade 7 is built:** all five units, rendered and checked in headless Chrome (print PDF; projects print one section per page with no spillover; no sideways scroll at 600 px). On the site at `/cefl/` (student unit pages, teacher hub, parent overview, viewer). Not yet tried with students. Grades 8 and 9: not started.

| Grade 7 unit | Workbook | Workbook AK | Project | Teacher guide | Site |
|---|---|---|---|---|---|
| Careers and the Labour Market | ✓ | ✓ | ✓ Career Pathway Map | ✓ | ✓ |
| Post-Secondary Pathways | ✓ | ✓ | ✓ Two Roads | ✓ | ✓ |
| Experiences and Employment | ✓ | ✓ | ✓ Experience Plan | ✓ | ✓ |
| Income and Tax (pilot) | ✓ | ✓ | ✓ First Paycheque | ✓ | ✓ |
| Money, Interest, and Credit | ✓ | ✓ | ✓ Saving for Something Real | ✓ | ✓ |

### PhysEd 5–6 and 7–9

Course and unit contexts only (7 units each). No lesson plans, rubrics, exits, or worksheets built.
