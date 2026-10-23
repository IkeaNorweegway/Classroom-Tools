# Project Status
*Last updated: 2026-10-23*

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
- **CEFL 7–9:** review the proposed units, local outcome codes, misconceptions and depth ceilings in `_courses/cefl/_context.md`. Real-world figures in CEFL materials are dated and must be re-checked: minimum wage, tax, CPP and EI rates each January; tuition (U of A 2026–27, Portage College apprenticeship) each year; ALIS wages (2023 survey) when a new survey is published; Alberta's job market forecast (2023–2033 edition used) and youth employment rules. Book audiences early (each teacher guide lists its own: Grade 6–8 classes, Career Café, Money Fair, counsellor and family panels, volunteer interviewers, pitch panel, tax clinic). Grade 8–9 also use: 2026 tax brackets, TFSA $7,000 and RRSP $33,810 limits, the student-loan rules (federal interest-free, Alberta at prime), the 35% criminal interest rate and $14 payday cap, and representation data from 2018–2019.
- **CEFL 9 Post-Secondary workbook, Moment 1:** says $82.91 × 120 = $9,949.29; it is $9,949.20 (the .29 comes from the unrounded payment). The $4,873.22 comparison has the same issue. The workbook is not fixed; the 9-PS game accepts both answers.
- **Lily Lab:** written as one mounted card per group. A multi-bloom stem per group would allow one per student.
- **STEAM:** Grade 9 Unit 1 language (Java or Python, both built). Soldering safety protocol, wood-shop access, littleBits inventory, and the Rube Goldberg cross-group protocol are open in `steam/_context.md`.
- **Slow reveal graphs:** decide whether to build a generic recording sheet for daily warm-up use.
- **Materials suite:** `_meta-context.md` lists a PPTX deck per unit. Class slides now exist as web decks (`slides/`, first one 2026-10-19), not PPTX. Decide whether web decks replace the PPTX line in the suite.
- **Social 9 Urbanization notes answer key:** the notes say "Canada experienced a ___ boom" (answer: population), but the key's prompt is "a population ___" with the answer "boom". The class slides use "population". Fix the key.

- **Social 7 (2026-10-19):** all five units need a teacher read-through, especially the sensitive content (the Indian Act, treaties, scrip, Red River and 1885, the head tax, Komagata Maru, the 1907 riots, P.C. 1911-1324) and the misconceptions, importance scores, week allocations, unit order, local outcome codes and inquiry options in `_courses/grade-7-social/_context.md`, which are this workspace's additions. The Grade 5–6 "comes from" lines in the parent guides are best guesses. Workbook and test quotes marked "sample" were written for the questions; the 1900s poster slogans are real. Facts worth a second look before printing: Red River population (~12,000), Komagata Maru admissions (about two dozen), Victoria Crosses (about 70), CPR land grant (25 million acres), House of Commons seats (343). The boundary "maps" are schematic blocks; real maps could be built with `scripts/build_social_maps.py`.

### Not yet checked or finished
- **Prereq practice, one page per unit (2026-10-18):** every unit in Grade 6 Science (6), Science 7 (5), Math 9 (11), Social 8 (4) and Social 9 (7) has `*-prereq-practice-v1.html` in `public/materials/` (Math 9 in `math-9/practice/`), listed under "Get ready" on its unit page and linked from its parent guide. Shared engine and one question bank per course in `public/materials/prereq-practice/`. Science 6 and Social 8/9 have 251 new written questions, from each unit's parent-guide "comesFrom" and "assumed" lists; Math 9 keeps the generators from its old site page (moved unchanged, so saved progress carries over); Science 7's were replaced with Grade 6-level questions (below). The old `/<course>/practice` pages now redirect to the course index. Fixed while moving: three Math 9 textbook questions showed the wrong answer (−13.95 for −13.75, −0.96 for −1.2, 9.9 for 8.1). Tested in headless Chrome: all 33 pages played, print from the viewer, phone width. Needs a teacher read-through of the new Science 6 and Social questions.
- **Science 7 prereq questions rewritten (2026-10-18):** the old bank (generators moved from the old site page) tested Grade 7 content: consumer levels, cell parts, rock types, Earth's layers, load types, heat vs. temperature. It is now 94 written questions, 26 skills, all Grade 6 ideas at the simpler end, taken from each unit's "assumed" list in `src/content/parent-guides/science7/`. Saved skill progress from the old questions no longer shows (different skill names). Needs a teacher read-through.
- **Science prereq practice diagrams (2026-10-18):** every Grade 6 Science (100 questions) and Science 7 (now 94 written questions) prereq question now shows a simple diagram under it, drawn by `public/materials/prereq-practice/sci-visuals.js`; colours are `v-*` classes in `practice.css`. Diagrams picture the situation (thermometer reading, food chain, highlighted cell part) and hide the answer with a `?`. Checked every diagram in headless Chrome, plus phone width and the printed sheet. Not done: teacher read-through; the printed 10-question sheet now runs to two pages of questions (plus the key) instead of one.
- **Teaching visuals in notes (2026-10-15):** 171 new diagrams across all five Science 7 notes packages (78) and all eleven Math 9 notes packages (93), mirrored into each notes answer key with the blank labels filled in. Sources are in `notes-packages/_visuals/`; `scripts/add_notes_visuals.py` inserts them. Checked in headless Chrome and with the SVG audit (no new violations). Not done: the markdown sources have no `[SVG: …]` placeholders yet, the old HTML copies beside the Math 9 markdown in `notes-packages/math-9/` were not updated, and nothing has been printed on the school copier.
- **Social 8/9 notes visuals (2026-10-17):** 39 diagrams across all 11 Social notes packages, at least one per section that lacked one (Grade 8: 9, filling sections with no visual; Grade 9: 30, where there were none). Six are real maps built from Natural Earth (public domain) by `scripts/build_social_maps.py` into `notes-packages/_visuals/_maps/` and pulled in with `<mapbase>`: displaced persons from Europe to Canada, WWII campaigns with a Hong Kong inset, the 1931 Dominions, NATO/Korea/Suez/NORAD, postwar immigration sources, and Canada's regions. Same pipeline as Science/Math (`scripts/add_notes_visuals.py`, now idempotent). The raw map data in `scripts/data/natural-earth/` (3 MB) is not needed to insert visuals, only to rebuild maps. Checked in headless Chrome. Not done: teacher read-through, copier print test (maps use light fills), markdown placeholders. Source issues spotted, not fixed: Government S2 says "six steps" but lists seven; Citizenship S3 says the amending formula lets "the federal government make additions" and the notwithstanding clause is provincial only (the diagram uses the accurate versions).
- **Site fonts:** every student notes package and workbook, and their answer keys (201 files), now use Atkinson Hyperlegible Next and Fraunces with warm-neutral contrast, as in the Forces pilot. Not yet converted: teacher notes and guides, tests, quizzes, exit tickets, and home practice sheets (`scripts/apply_site_fonts.py` handles them). Not yet printed on a school photocopier.
- **Math 9 practice tests (2026-10-23):** every Math 9 unit now has a 50-mark, 60-minute practice test and answer key on its unit page (Practice Test under extras, key under keys), one code per notes section (PE, SR, LR, LE, PO, CG, ME, SI, ST, PR, RN). Sources in `tests-quizzes/math-9/<unit>/` (`.gitignore` lets `*-practice-test-*` in, except the Rational Numbers v2 practice test). Hand-built HTML in `public/materials/math-9/tests/<unit>/`; the keys were converted from the markdown, so edit both. Checked in headless Chrome; they print to 7–9 pages. Statistics data sets are made-up samples. Needs a teacher read-through.
- **Math 9 short unit tests, teacher only (2026-10-23):** a 30-mark, 40-minute unit test and key for all 11 units: v2, except Rational Numbers v5 (v2–v4 already existed). HTML and key markdown in `tests-quizzes/math-9/<unit>/` (git-ignored, never committed); PDFs in Drive, Classroom Tools — Teacher Materials › Grade 9 › Mathematics. No item repeats a practice test item. Each prints to 4 pages. Needs a teacher read-through and a timing check in class.
- **HTML never opened in a browser:** photosynthesis sim, Science 7 notes answer keys v2, Math 9 Rational Numbers test and question bank, slow reveal projector page and worksheet.
- **Plant Hunt PDFs** in `public/materials/` may be stale against their HTML (the icon-flowchart revision). Re-render and compare.
- **Photosynthesis sim:** no recording sheet or teacher notes. Grade 6 would need a cut-down version.
- **Plant Hunt:** no answer key.
- **Slow reveal trial:** not on the site.
- **Social 9:** 7 units are published with no course context in `_courses/`. Local-only markdown sources were reconstructed from the HTML on 2026-10-16 (see below); the repo still has none.
- **ASCII-to-SVG conversion** is unfinished: `notes-packages/_ascii-to-svg-status.md` still lists 16 files as pending or in progress.
- **STEAM research summaries:** the STEAM progression summary and the design-thinking, graphic and web design summary that the STEAM contexts lean on have never been written. The contexts now mark both as planned.
- **Reconstructed markdown sources (2026-10-16, local only):** not committed, listed in `.git/info/exclude` on the Linux machine. 56 files rebuilt from published HTML that had no source: Social 9 notes, notes keys, workbooks, workbook keys and teacher guides (34); Social 8 teacher guides (4); Grade 6 teacher notes (5) and workbook keys (5); Science 7 teacher guides at their current v2/v3 (5); the Science 7 Ecosystems assessment key; the Math 9 Rational Numbers practice test and key. Text matches the HTML (word-level check, 92–100%; the gaps are labels such as "Core" becoming ★). Not done: no render script reads these formats, so the HTML is still edited separately; nobody has read them through. The Science 7 teacher guide v1 markdown files are superseded by the new v2/v3. The Math 9 teacher notes v1 markdown is still current: v2 changed only the layout.
- **Grade 6 Science EF and FR versions** have no markdown source by design (see HTML-first materials in `CLAUDE.md`).
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
- **Motion pass on the five Plants v2 games and sims (2026-10-17):** gauges, meters, and the coverage bar now slide with `transform`; the hint glow fades a ring with `opacity` instead of animating `box-shadow`; the scene drawings write a value only when it changes; the light rays (and Seed to Seed's sway) stop while the clock is stopped. Fixes a bug: the meter bars in both sims were inline spans, so they never showed (numbers only); they now fill. Models unchanged. Tested in headless Chrome with the CPU slowed 6×: paused, all three real-time pages went from a repaint every frame to none; running, Flower Lab paint fell about 60%, the others a little. No console errors; gauges, meters, and the glow checked by screenshot at 1340 and 600 px. Untested: school Chromebooks, touch, students.
- Not built: FR or EF adaptations of the core materials.

### Math 8 (site ✓, 2026-10-22)

Twelve topics in four strands, from the 2016 Alberta Grade 8 outcomes (N1–N7, PR1–PR2, SS1–SS6, SP1–SP2). Course context: `_courses/math-8/_context.md` (local codes, depth ceilings, misconceptions, reading-level and picture rules). Pages at `/math8/` (student, parent and teacher views), same shape as Math 9; data in `src/data/math8.ts`.

| Strand | Topics |
|---|---|
| Number | Squares & Square Roots · Percents · Ratios & Rates · Fractions (× ÷) · Integers (× ÷) |
| Algebra | Linear Relations · Linear Equations |
| Measurement & Geometry | Pythagorean Theorem · Surface Area & Volume · 3-D Views & Transformations |
| Statistics & Probability | Data Displays · Probability |

- Per topic: guided notes + key, concept reference, Core ★ and Challenge ★★ worksheets + keys, exit tickets, mid-unit quiz (answers in the markdown only), teacher notes, two home sheets + keys, prereq practice. Plus one interleaved workbook + key per strand. 188 HTML files in `public/materials/math-8/`.
- Written for a lower reading level (F&P P–Q, short sentences, math words kept) with diagrams throughout: every notes section has at least two, and most worksheet and workbook questions have one. Diagrams are generated by `scripts/Math8Viz.pm` (~30 types, `dg-*` classes, blanks shown as dashed boxes on the student copy).
- Renderer: `perl scripts/render_math8.pl` (one markdown source → student copy and key), then `stack_fractions.py` on `public/materials/math-8` (run with the uv Python). Home sheets: `render_home_practice.pl` with `course: math8`. Prereq questions: `prereq-practice/math8-bank.js` (generated; every generator self-checked 300 times in headless Chrome).
- Checked: a full Astro build of the site (portable Node in a scratch copy: 1112 pages, no missing files) and screenshots of the notes, keys, worksheets, workbooks, teacher notes, practice pages and site pages in headless Chrome. The home turntable now shrinks its tiles a little when there are more than 8 courses.
- Not done: teacher read-through of all content (data marked "sample" is made up for teaching; the Edmonton temperatures are rounded averages; Saskatchewan PST 6% and Ontario HST 13% should be checked before printing); classroom trial; copier print test; unit tests, inquiry projects, posters, class slides (Math 9 has some of these). Grade 8 has no PAT, so there is no PAT prep page.

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

### Grade 7 Social (site ✓, 2026-10-19)

Five units from the Grade 7 column of the June 2026 draft 7–9 curriculum. Course context: `_courses/grade-7-social/_context.md`. Pages at `/social7/` (student, parent and teacher views), same shape as Social 8.

| Unit | Notes + AK | Workbook + AK | Exits | Quiz + key | Test (local) | Teacher guide | Home ×2 + keys | Prereq |
|---|---|---|---|---|---|---|---|---|
| Building the Canadian State | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Creating Canada's Government | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Building Canada's Economy | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Immigration After Confederation | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Armed Forces and Sovereignty | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- Markdown sources in the type folders (`grade-7-social/`); teacher guides in `lesson-plans/grade-7-social/`. HTML made by `scripts/render_social.pl` (notes, workbooks, keys, teacher guides), `render_assessments.pl` (exits, quizzes) and `render_home_practice.pl` (home sheets). Unlike Social 8 and 9, source and HTML match, so edit the markdown and re-render.
- Six diagrams per notes package (one per section), all `dg-*` classes, tikz tags, no inline styles. Maps are simplified block diagrams, not to scale.

### Grade 8 Social (site ✓)

Four units (Political Systems, Economic Systems, Ideologies, Civic Engagement): notes, notes AK, workbook, workbook AK, and teacher guide on the site. Exit tickets and unit tests exist as markdown and are not published.

### Grade 9 Social (site ✓, HTML only in the repo)

Seven units: notes, notes AK, workbook, workbook AK, teacher guide. See Open items.

**Class slides (site):** Urbanization and the Growth of Industry has a 13-slide deck (`slides/grade-9-social/urbanization-industry/soc9-urbanization-industry-slides-v1/`, rendered to `public/materials/soc9-urbanization-industry-slides-v1.html`), linked on the unit page under "Class slides". It follows the notes section by section, with fill-in slides for every blank and click-to-reveal answers. Every slide was screenshotted in headless Chrome. Not yet tried on a classroom projector or with students. Rules and template for the next deck: `slides/_context.md`, `templates/slides-template/`.

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

### CEFL 7–9 (site ✓)

Project-based course: 1 hour every 3 days, ~40 sessions a year, 5 units per grade. Each unit has a mini-workbook (teaching moments), a project brief, and a teacher guide. Spec in `_courses/cefl/_context.md`; evidence in `research/project-based-learning-research.md` and `research/financial-career-education-research.md`. Renderer: `scripts/render_cefl.py`; all renders in `public/materials/cefl/` (60 files).

**All three grades are built** (15 units × workbook, answer key, project, teacher guide) and on the site at `/cefl/` (grade pages, unit pages, teacher hub, parent overview, viewer). Project rubrics use the report-card scale (single-point, Has yet to meet / Meets / Beyond). All renders checked in headless Chrome: projects print one section per page with no spillover. Not yet tried with students.

| Unit | Grade 7 project | Grade 8 project | Grade 9 project |
|---|---|---|---|
| Careers and the Labour Market | Career Pathway Map | Future-Proof Me | Get Hired |
| Post-Secondary Pathways | Two Roads | My High School Map | Pathway Pitch |
| Experiences and Employment | Experience Plan | Open Doors | Pitch It |
| Income and Tax | First Paycheque | Job Offer Showdown | Tax Clinic |
| Money, Interest, and Credit | Saving for Something Real | Grow It | Debt Detective |

**CEFL Town (games), Phase 1 built 2026-10-17:** one shared top-down town game for every CEFL unit, with one mission per unit (design in `_games-context.md` → CEFL Town). Built: the engine, the town, Kenney's *RPG Urban Pack* (CC0, `public/vendor/kenney-rpg-urban/`), and mission 1, **Payday** (Grade 7 Income and Tax, `public/materials/cefl/cefl7-income-tax-game-v2.html`). It is on the unit page and in the teacher guide. The first Payday (v1, panels) is kept unlinked. The other 14 missions were built on 2026-10-18 (below).
- *Payday* model: v1's model copied unchanged (2026 Pay Card; future-you situations at 17, 19 and 24; three jobs each; goals $1,100, $2,200 and $2,000; win = the jar is full after paycheque 8 and the bank is not overdrawn). New in v2: the boss's stubs for paycheques 5–7 are signed or disputed. One of paycheques 5 and 6 has a payroll mistake, and paycheque 7 has one 3 runs in 5. The mistake is one of: hours short by 4, one $1,000 sale left out of commission, CPP taken under 18, CPP without the $135 exemption, EI at 2.63%, or a tax row two up. Each is worth at least $5. A signed mistake costs that money.
- Simplifications: as v1 (income tax is the Pay Card estimate; CPP starts the paycheque after the 18th birthday; bills per two weeks; no overtime, so no day over 8 h and no week over 44 h; cash tips not on the stub; EI and CPP benefits as stories; $45 bounce fee; a Chapter 1 overdraft covered once), plus: a boss's mistake is one root line.
- Tested (Node + headless Chrome, served over HTTP):
  - **v1 model checks on the mission's copy:** a careful player always wins and gross-pay, do-nothing and too-cautious players never do; the answer tables are clean; the extra-hours answer holds in all 4,500 runs.
  - **Sign-off:** 55,464 planted mistakes checked; every one is worth at least $5 (largest $110.91). A careful planner who signs everything without checking still wins 1,799 of 1,800 runs in Gentle and loses 297 of 1,800 in Real.
  - **Scripted players through every flow:** all 9 situation × job pairs (Gentle), Real mode, gross-pay, cautious, do-nothing, sign-everything and wrong-first players. Results as designed, and no page errors.
  - **Navigation (the 78 × 58 map, rebuilt the same day with districts, paths, landmarks and smaller rooms):** all 26 doors, all 22 people (rooms and town) and all 6 street signs are reachable from the spawn point; doors go in and out; locked doors explain themselves; tap-walk works; the quest line auto-walks to the target and starts the talk; 0 frames while idle (rule 9).
  - **Saving:** resume after reload works, and the profile carries over to a second mission.
  - **Screens:** checked at 1340, 1000 and 600 px.
- **Between lessons (2026-10-18):** the user asked for a way to keep playing between lessons. Built into the shared engine, with Payday as the first content: a soft gate after each chapter ("Not yet: help around town"); 10 paid help requests from townspeople, opening by chapter (gross pay for job offers, filling in a stub over and under 18, explain-a-deduction questions, Pay-O-Matic stubs to sign or dispute); news lines that tell the Pay-O-Matic side story (17 lines); Town Mail once a day; a wallet in the profile that never touches the model; Pat's market stall in Town Square (6 home decorations, 4 outfits) and a closet at home; **Take your town home**, a save code (about 1,600 characters) or file to carry the game between computers; a Between lessons table in the report. Design and hooks in `_games-context.md` → CEFL Town → Between lessons.
  - Tested: Node, on the help model (20,000 gross tasks, 8,000 stubs, 12,000 Pay-O-Matic stubs: every mistake one root line worth $7.44–$74.12, one stub in four correct; every Town Mail test stub has one wrong deduction; every question has one right answer). **The pay model is unchanged:** the model and sign-off blocks are byte-identical, and 17 scripted players (9 situation × job pairs, Real, gross, cautious, do-nothing, sign-everything, two wrong-first) give identical results on the old and new code. Scripted between-lessons player in 3 situations (48 checks each): gate, quest line, bubbles, the pay rule, a new day, mail (one a day, never piling up), shop, closet, home reachability with everything bought, save code round trip (and a changed code refused), import, and starting the chapter from Ms. Okafor. Every request × right / wrong-then-right / wrong in Gentle and Real; every mail kind; leave-for-now keeps the same numbers; signing a stub with a mistake pays nothing. A real reload with saving on resumes in free roam with the wallet and the day's helps kept. Navigation: all doors, room people and the 6 town people (Pat included) reachable; idle frames 0. Screens at 1340 and 600 px.
  - Not tested: copying the save code on a real Chromebook and pasting it into a Google Doc and back (the code is plain base64, and line breaks are ignored on load); whether students use the gate as meant; prices (about one week of helping buys everything).
- **The Pay-O-Matic mystery (2026-10-18):** the user asked for more story, with townspeople bringing in the problem slowly so the student ends up the hero. Payday now has a side story in the main quest: Mo's hunch at the bank (Ch 1, Case notes start), Mo's stub to fill in (Ch 2; Pay-O-Matic was tested on his crew; Milo made it), a friend's stub with a different mistake, clues from Jas, Grandpa and Nurse Kaur, and meeting Milo (Ch 3), then proving every mistake at Town Hall, fixing Pay-O-Matic's six settings with Milo, and a thank-you scene that names the town's new rule after the student (Ch 4). New: Milo (townsperson), Case notes and Town Hero medal (Bag), story-stage idle lines for 10 townspeople, the news lines rewritten around the story (20), a mystery line in the report. Engine: `calc` takes `noPay`. Model, sign-off and help blocks unchanged (byte-identical).
  - Tested: Node, on the story stubs (each one root mistake worth at least $5, none on a $50 tie; every mistake a player can meet at paycheque 5 or 6 has a Town Hall answer and a setting); the help-model test still passes. Headless Chrome: 14 scripted players (all 9 situation × job pairs, Real, wrong-first in Gentle and Real, sign-everything) finish with every story beat and 12 Case notes entries, no errors; the between-lessons player passes 48 of 48; everyone in the bank, library and Town Hall scenes is reachable; the new panels at 1340 and 600 px.
  - Not tested: how the extra dialogue changes chapter length (about 2–4 minutes more a chapter, by line count), the reading level of the new lines, students. Saves from before this change resume at the wrong step (steps were inserted); nothing is published yet, so no student has one.
- **Job games (2026-10-18):** the user asked for a one-minute game for each job, where doing well earns more hours or a raise and skipping or doing poorly does the opposite. They chose: the effect lands on the *next* paycheque (seen when planning); a mix of action and light money math; salary jobs build toward a raise at a review, with warnings; and an extra shift between lessons for wallet pay. Built: the engine verb `api.minigame` (intro with Start or Skip, 3-2-1, a 60-second timer bar, pause on a hidden tab or the ❚❚ button, a result card; its own frames only while playing) and nine games in `town/missions/7-income-tax-jobs.js`: Till rush (make change, 5¢ cash rounding; Real hides the change due), Table turn, Gear match (shows the 2% commission), Sort the belt (arrow keys), Repair desk (pick the ticket, take off the old part, put on the new one, hand the bike back; the user's design), Best plan (the cheapest phone plan that covers it), Front desk (book the asked-for slot, never double-book), Wire it right (breaker off, black→brass, white→silver, bare→green, breaker on), Will it fit? (wall width and budget; 6% commission). In the model (`perfOf`): a great shift adds hours to the next paycheque (Avery +2, Dev and Rosa +4), and a poor or skipped one takes half that away (−1 or −2). Three merit is a raise (+$0.50 an hour, or +$1,000 a year on a salary), a poor or skipped shift takes one merit back, and two warnings without a great shift wipe it. Rates never go down. The boss reacts in their own voice and says what happens next. The plan and timesheet show the change, the HUD shows Merit (●●○), and the report has a Shifts table. Between lessons: "Cover an extra shift" from your own boss, once a day: $8 for great, $4 for steady, nothing for rough; "Leave it for now" on the intro keeps it open.
  - Tested: Node, on the game models (500 seeds × 9 games × 2 modes): a careful bot reaches great in 94–100% (bike shop in Real is the lowest at 94%), a sloppy bot mostly reaches ok, and a random tapper and an idle player are always poor; the thresholds came from those runs. Node, on the pay model (300 seeds × 9 jobs × Gentle and Real × extra hours or not × 6 shift patterns): the careful planner always wins, even with every shift poor or skipped (tightest: Avery at Northside Sports, $23 to spare; the full −2/−4 cut failed there, so the cut was halved); the gross-pay and do-nothing planners never win. Known and kept: a too-cautious saver as Rosa the apprentice wins if every shift is great. With every shift ok there are no extra hours and no raises (v1's model exactly). Every sign-off mistake is still worth at least $5 with bonus and cut hours. Headless Chrome: the 17 scripted players give the same results as before with every shift ok; 54 more runs (9 pairs × great, poor, skip, mixed, a bot playing the real page, and Real with poor) end with no errors and every careful planner winning; the between-lessons player passes 54 of 54 (6 new: the extra shift's pay rule, leave-it-open, and it never touches the run); a reload with saving on after the game goes straight to the timesheet, so a shift is never played twice; a hidden tab pauses the game, no time passes while paused, and the game asks for no frames once it ends; arrow keys sort parcels. Screens of all nine at 1340 and 600 px.
  - Not tested: how hard the games feel to real students on Chromebook trackpads (the bots' pace is a guess: about 2 seconds to think and 0.6 seconds a tap); whether 60 seconds × 8 shifts (about 10 minutes over 4 chapters) is too long; emoji on school Chromebooks; screen readers in the games (targets are buttons with labels, and the score and messages are live regions, but the moving belt and the bike picture are not described as they change).
- **Motion pass (2026-10-18):** the user asked how to make Payday feel more alive. We first looked at Unreal and other connectors and chose code in the existing engine, because an Unreal build cannot run on students' Chromebooks or on Netlify. They chose all three groups. Design and rules are in `_games-context.md` → CEFL Town → Motion. Built on branch `cefl-town-animation`, on top of the uncommitted job-games work.
  - **Town life (engine):**
    - people turn to you when you talk;
    - one person on screen glances around every few seconds;
    - Avery, Dev, Rosa, Mo and Jas wander up to 2 tiles (never on doors, doorsteps, your tile or your path; never your goal, someone with a $ request, or anyone within 2 tiles of you);
    - your walk goes around someone who steps in;
    - the speaker hops, new bubbles pop in, and doors open for a moment.
  - **Effects kit `api.fx` (engine):** fly, rise, count, stamp, pop, bump, fill, confetti, banner and face. The engine uses it for:
    - chapter title cards;
    - Bag items flying in;
    - the wallet counting;
    - `calc`'s result popping in;
    - job-game stamps.
  - **Payday:**
    - a payday card and the cheque from the boss;
    - the net counting down from the gross (Chapter 1, and on a checked stub, with each deduction nudging in turn);
    - a signature or a DISPUTED stamp;
    - bills into a goal jar that fills;
    - the Town Hall room turning to you;
    - Proved and Fixed stamps;
    - the hero scene: medal, confetti and "The {name} Rule" card. One new line, "Thank you, everyone! Now go check your pay stubs.", keeps the crowd there for it.
  - **Fixed along the way:**
    - talking to someone already set which way they face, but nothing drew it, so people never turned;
    - an arrow key during a walk-then-talk left the talk pending, to fire on a later step.
  - **Tested** (headless Chrome, served over HTTP):
    - **Model and players:** the model, sign-off, help and story blocks are byte-identical, and the job games file is untouched. The 17 scripted players give exactly the results from before the pass, with no page errors. The between-lessons player passes 54 of 54.
    - **Navigation:** all 26 doors and 17 people are reachable, and idle frames are 0.
    - **Motion test** (26 checks, with and without reduced motion):
      - facing and the hop;
      - 400 seeded life ticks: wanderers stay in their box, never stop on a door or on you, Pat never moves, and the goal and people next to you stay put;
      - $-request people stay put;
      - a blocked walk goes around and arrives;
      - an arrow key cancels a pending talk;
      - the door pause (none under reduced motion);
      - every fx verb's end state, and a click ending all effects.
    - **Idle frames with town life on:** 1 frame in 8 seconds (0 with reduced motion).
    - **Payday checks:**
      - a wrong stub check makes no motion, and a right one nudges 3 deductions and counts the net;
      - no stamp or signature before the choice (both branches);
      - the jar total and fill end on the real jar;
      - inside Town Hall, the councillor, Avery, Mo and Milo face you when you speak up;
      - the hero card, confetti and medal.
    - **Full runs** (3) log 4 chapter cards, 8 payday cards, the hero card, stamps and, between lessons, 10 "+$" floats.
    - **Screenshots** at 1340 px (town with a chapter card, stub, signed, disputed, deposit, job-game result, help pay, case, fix, hero) and 600 px (deposit, reduced motion).
  - **Not tested:**
    - real animation pace and smoothness (headless frames barely move), and how it runs on a school Chromebook (use Chrome's CPU throttling, then a real one);
    - whether wandering ever annoys a student trying to tap someone;
    - whether the title cards and confetti feel like too much over a full chapter;
    - emoji (✉️ 💵 🗺️ 🏅) on school Chromebooks;
    - screen readers with the title cards.
- Not tested: real walking pace (headless Chrome barely advances animation frames), whether a chapter really takes 10–15 minutes, touch on Chromebooks, students, the reading level, and sound (off by default, never tested).
- **The other 14 missions (2026-10-18):** the user asked to "build out CEFL Town for all grades and topics". Built on branch `cefl-town-animation`, uncommitted, on top of the motion pass. Each mission has 4 chapters (one after each project step), work from its unit's workbook and brief, a side story with a hero beat, 7–9 help requests, news lines, Town Mail, one one-minute game, a goal, an outfit for the closet and a My Plan page. The list (titles, guides, stories, games, goals) is in `_games-context.md` → CEFL Town → The 15 missions. New shared files: `town/kit.js` (work verbs) and `town/games.js` (three game templates). Engine changes are small: `bagTip` for the tutorial's Bag line, and `calc` fields take `fmt`. New outfits in `art.js` and new `ck-*` / `gk-*` styles in `town.css`. Payday's files are unchanged. All 15 games are on their unit pages (`src/data/cefl.ts`), and `astro build` passes.
  - Tested, for each new mission (Node + headless Chrome, served over HTTP):
    - **The model against the workbook:** for example, 8-IT tax on $70,000 (federal $8,242.73, total $12,197.21); 9-IT Jamie's return ($1,056.72 / $98.48 / refund $244.80) and Priya's case (refund $185.78, or $395.78 with a $1,500 RRSP); 9-MM avalanche 17 months / $509.31, snowball 17 / $566.43, minimums only 46 / $1,712.29, Sam's card 185 months / $1,613.90; 9-PS loan payment $82.91. Win rules checked in Node where the goal is a model outcome (7-MM, 8-MM, 9-EX).
    - **Help generators** on hundreds of seeds (every task solvable, one right answer, Town Mail reaches every kind).
    - **Games:** a careful bot reaches great in at least 90% of runs; random and idle bots are always poor.
    - **A generic scripted player:** right, second-try, wrong (with wrong answers to every question), Real mode, and poor games. Every run finishes all 4 chapters with no page errors, and the goal is won or lost as designed.
    - **Between lessons:** the gate, the pay rule (first try, second try, shown), mail, and every request after the mission. No failures.
    - **Navigation** in every scene: everyone reachable, nobody on a blocked tile, idle frames 0.
    - **Screens:** new panels at 1340 and 390–600 px.
    - Payday re-run on the changed engine: careful players win, the gross-pay player loses, no errors.
  - Fixed along the way: answer ranges that made some quiz choices tie; people or objects placed where they could not be reached or blocked a walkway; a help request given to the mission's guide (the gate takes over the talk, so it could never be done); 7-MM debts larger than income; 8-LM's worker renamed Greta (8-EX's workbook has a Lena); a 9-IT clue whose numbers did not change the refund (Jas now earns $26,000, so the tuition credit adds $420).
  - **Samples are labelled as samples** in each mission's footer and panels (client cases, prices, venture costs, 9-MM's 9.5% line of credit). Real figures carry the same dates as the workbooks (2026 tax brackets and credits, TFSA and RRSP limits, the $14 payday cap) and must be re-checked each January.
  - **Teacher guides (2026-10-19):** all 14 guides now have a Game row in "At a glance" and a "The <title> game (CEFL Town)" section before the sample products, written in the same format as Payday's. The section covers the chapter table (play after Session N, what happens in town, the next project step), when to play, saving, controls, the side story, the goal, Gentle and Real, between lessons, the report, and simplifications. The 9-PS section notes the workbook's $9,949.29 slip. Payday's guide no longer says students who switch devices start over; it points to the save code. Rendered with `render_cefl.py` and `apply_site_fonts.py`. `stack_fractions.py` was not used on 8-PS, because it stacks "-1/-2" and "PE 20–30/K&E" in older text. Not done: a teacher read-through; chapter times are not given because none have been measured.
  - **Shared-helper cleanup (2026-10-18, a separate code-audit session):**
    - `kit.js` now holds the helpers every kit mission copied: `K.fmt`, `K.fmtW`, `K.step`, `K.gossip(list, api)`, `K.gameGrade(r)`, `K.payTiers(pay)`, `K.TIER_WORD` and `K.planLine(api)`. The 14 kit missions call them. Their MODEL and HELP blocks keep their own RNG and pickN, so Node can still run them alone.
    - `engine.js`: `profileAdd('plan')` now keeps one page per mission. Before, a replayed finale added a duplicate My Plan wall page, in Payday too.
    - `town.css`: the unused `.gk-q` rule is removed. Payday's mission files are untouched.
    - Tested by that session: on all 14 missions the generic player's output is byte-identical before and after (3 configurations, 42 runs), and `gtest.js` passes. Payday's player matches the old code.
    - Spot-checked afterwards in this session: 9-MM, 9-IT and 7-LM (right, wrong + gate + poor games), plus navigation and the 9-MM game bots. No errors or failures.
  - Not tested: students; real devices (Chromebook trackpads, touch, emoji); real animation pace; chapter length; the reading level of the new dialogue; screen readers in the new panels and games; saves from one mission version to the next (nothing is published).

### PhysEd 5–6 and 7–9

Course and unit contexts only (7 units each). No lesson plans, rubrics, exits, or worksheets built.
