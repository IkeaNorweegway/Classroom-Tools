# Project Status
*Last updated: 2026-11-03*

Current state only, one line per item. Keep it under 130 lines: put session detail in the commit message, and move finished build or test logs to `_status-archive.md`. The archive's **2026-11-01 snapshot** has the full detail behind every line here: test logs, file lists, and the exact facts to check before printing.

---

## Workspace

- **One repo**, sources and site together (GitHub: `IkeaNorweegway/Classroom-Tools`, **public**). Windows copy at `D:\Classroom tools`, Linux copy at `~/Documents/classroom-tools-site`.
- **Site:** Astro + Tailwind, published to https://ikeanorweegway.github.io/Classroom-Tools/ by GitHub Actions on every push to `master`. Design rules: `_site-context.md`.
- **Where files go:** markdown sources in the type folders (`notes-packages/`, `worksheets/`, `tests-quizzes/`, `lesson-plans/`, `steam/`). HTML and PDF renders only in `public/materials/`.
- **Games:** `_games-context.md`. **Sims and trainers:** `_sims-context.md` (evidence in `research/simulations-research.md`).
- **Never committed** (`.gitignore`): `legislation/`, school admin files, third-party reference PDFs, unreleased tests. Students can read this repo.
- **Windows machine:** no Node, Python, Perl or LaTeX on the PATH; headless Edge hangs, headless **Chrome** works (`--headless=new --dump-dom` or `--screenshot`). The Linux machine can build the site and run the render scripts.

---

## In progress

- **Math 8 rebuilt on the June 2026 draft** (on `master` since 2026-11-01): 12 new topics with the full suite, 4 strand workbooks (v2), new `_courses/math-8/_context.md`. The 2016 context is kept as `_context-2016.md`, and the old 2016 materials are kept, unlinked (including the 2016 practice tests and unit tests, which have no draft version yet). Waiting for the teacher read-through. Facts to confirm: Alberta minimum wage, licence ages, Calaway Park height limits (Inequalities); guiding questions are written from the outcome stems; made-up data is listed in each teacher notes file.
- **Math 8 (draft) tests:** Number strand and Algebra & Functions strand done (Rational Numbers, Square Roots & Irrational Numbers, Proportional Reasoning; Polynomials, Solving Equations, Inequalities, Linear Functions): a 40-mark, 60-minute practice test + key on each topic page, and a 30-mark, 40-minute teacher-only unit test + key (HTML and PDF beside the source, git-ignored; upload the PDFs to Drive, Teacher Materials › Grade 8 › Mathematics, Tests and Answer Keys). Source format: top of `scripts/render_math8.pl` (unit tests render only when named, and only if git-ignored). Next: Geometry & Measurement, then Statistics & Probability. Made-up data is listed in each source's comment.
- **Math 7** (on `master` since 2026-11-01): built, waiting for the teacher read-through.
- **Social 9 trainers** (narrow format, `scripts/drill/`, new shared `soc.js`): all three batches done 2026-11-03: Urbanization, Independence, WWII, Post-War, Modern Economy, Government, Evolving Citizenship (`soc9-<unit>-trainer-v1.html`). Site page not yet built or checked (no Node on Windows). Tested: model and UI checks pass in headless Chrome, plus layout at 1366, 1000 and 1280×600; screenshots checked. Not tested: students, touch screens, Chromebooks. Teacher check: facts beyond the notes (Alberta 1916 vote, McKinney 1917, Macphail 1921, Wilson 1930, Quebec 1940 and 1980, the Veterans Charter, the Meech Lake year 1987). The Citizenship trainer leaves out the amending formula (the notes misstate it). Residential schools and the Sixties Scoop are left on paper on purpose.

---


### Merged from master (2026-10-29 to 30; details in those commit messages)
- **Site search:** nav search button (`/` opens it) and search boxes on the home page and `/parents`; finds units, notes section titles, vocabulary, sims, games and practice.
- **Math 9 narrow trainers** replace the broad Algebra sim and trainers, one per topic, in `scripts/drill/`; missed question types come back more often.
- **Math 9 PAT prep:** a PAT Word Problems trainer and a PAT Questions trainer (47 released items, 2013/2015/2019) with a picture for every word problem. Teacher read of the shortened stems still to do.
- **Science 7:** a concept trainer for every unit.

## Open items

### Needs a teacher decision or a source check
- **Student / parent / teacher views:** read the student and parent copy, especially the grade-to-grade progressions (best guesses for earlier grades).
- **Science 7 notes keys v2:** approximate figures marked "confirm"; magnitude-7 energy wording; snow as both live and dead load.
- **Math 9:** circle geometry Core Q6 and Challenge Q3 have no valid solution (flagged in the keys, not fixed). Rational Numbers uses local codes RN1–RN5.
- **Math 9 inquiry projects:** read-through and classroom trial; confirm the transit fares and sample prices; download weather data and NHL standings before running.
- **CEFL 7–9:** review the units, codes, misconceptions and depth ceilings in `_courses/cefl/_context.md`. Re-check dated figures each January (wages, tax, CPP, EI, TFSA/RRSP, payday cap) and tuition each year. Book audiences early.
- **CEFL 9 Post-Secondary workbook, Moment 1:** $9,949.29 should be $9,949.20 (same slip in the $4,873.22 comparison). Not fixed; the game accepts both.
- **Lily Lab:** one card per group; a multi-bloom stem would allow one per student.
- **STEAM:** Grade 9 Unit 1 language; soldering, wood shop, littleBits inventory and Rube Goldberg protocol (open in `steam/_context.md`).
- **Slow reveal graphs:** build a generic daily recording sheet or not.
- **Materials suite:** decide whether web decks (`slides/`) replace the PPTX line in `_meta-context.md`.
- **Home sheet notes links:** skim the `sections:` matches (122 sheets). Math 9 "Can You Trust the Data?" has no matching notes section.
- **Notes answer-key links:** decide whether students should see key links this easily (77 notes packages).
- **Social 9 Urbanization notes key:** the prompt is "a population ___" but the notes blank is "a ___ boom". Fix the key.
- **Social 7:** read all five units, especially the sensitive content and this workspace's additions in the course context. Check the facts listed in the snapshot before printing.
- **Grade 5 ELA:** read every original story, passage and poem; check the facts listed in the snapshot (regions, chinook, recess, First Nations names with the FNMI lead); check OL1–2 codes against the PDF; the regions map edges and icons.
- **Math 7:** teacher read-through; check the guiding questions against the draft wording; all data is made up or rounded (each teacher notes file lists it).
- **Math 8 (2016 version):** check Saskatchewan PST 6% and Ontario HST 13% before printing.

### Not yet checked or finished
- **Needs a teacher read-through:** prereq practice questions (Science 6, Science 7 rewrite, Social 8/9), Math 8 and Math 9 practice and unit tests, Social 8/9 notes visuals.
- **Science 7 Plants unit test v2** (teacher-only, git-ignored, in `tests-quizzes/grade-7-science/plants-food-fibre/`): split into a Sections 1–4 test (/40) and a Plant Uses test for Sections 5–6 (/22), one key file (`-test-v2-key.md`). Rendered to `../test-renders` for the Drive folder. v1 stays on the site. Needs a read-through; aspen-clone and beaver-girdling contexts are new.
- **Social 8/9 notes sources:** Government S2 says "six steps" but lists seven; Citizenship S3 misstates the amending formula and the notwithstanding clause.
- **Science prereq diagrams:** the printed 10-question sheet now runs to two pages.
- **Notes visuals (Science 7, Math 9, Social 8/9):** markdown sources have no `[SVG: …]` placeholders; old Math 9 HTML copies in `notes-packages/math-9/` not updated; no copier print test.
- **Site fonts:** not yet on teacher notes and guides, tests, quizzes, exits, home sheets (`scripts/apply_site_fonts.py`).
- **Multiple-choice letters:** Square Roots and Rational Numbers practice tests not rebalanced.
- **Never opened in a browser:** photosynthesis sim v1, Science 7 notes keys v2, Math 9 Rational Numbers test and bank, slow reveal page and worksheet.
- **Plant Hunt:** PDFs may be stale against the HTML; no answer key.
- **Photosynthesis sim:** no recording sheet or teacher notes; Grade 6 needs a cut-down version.
- **Slow reveal trial:** not on the site.
- **Social 9:** no course context in `_courses/`.
- **ASCII-to-SVG conversion:** 16 files pending (`notes-packages/_ascii-to-svg-status.md`).
- **STEAM research summaries** (progression; design thinking, graphic and web design): never written.
- **Reconstructed sources** (56 files, Linux only, in `.git/info/exclude`): no render script reads them, nobody has read them through.
- **Grade 6 unit pages** (`src/content/units/*.md`): rewrite as hook → explore → can do → real-world link.
- **Games, sims and trainers:** none tried with students, on touch screens or on school Chromebooks.

---

## Build status

✓ = built · — = not started · "site" = HTML published in `public/materials/`

| Course | State | Notes |
|---|---|---|
| Grade 6 Science | site ✓ | 6 units + year review: notes, workbook, teacher notes, workbook key (EN, EF, FR). Forces exits, project brief, sub plan |
| Grade 7 Science | site ✓ | 5 units, full suite (notes + key v2, workbook + key, exits, quiz, test, teacher guide). Plants extras: Plant Hunt, Lily Lab, organizers, 3 games and 2 sims (v2). The site workbook HTML is newer than its v2 markdown, so don't re-render it. No FR/EF |
| Math 7 | site ✓ (draft) | 12 topics, June 2026 draft. Per topic: notes + key, concept sheet, Core/Challenge + keys, exits, quiz, teacher notes, 2 home sheets, prereq practice. 4 strand workbooks + keys. Renders with `render_math8.pl` |
| Math 8 | site ✓ (draft rebuild; 2016 files unlinked) | Draft: 12 topics (Rational Numbers … Independent & Dependent Events), same suite as Math 7, 4 strand workbooks v2. New diagram types in `scripts/vizext/<slug>.pl`. 2016: full suite, practice tests, unit tests (teacher only, Drive), workbooks v1, kept unlinked |
| Math 9 | site ✓ | 11 topics: notes + key, teacher notes, concept sheet, Core/Challenge + keys, poster, exits, 4 strand workbooks, practice tests, unit tests (Drive), 4 inquiry projects. Sims: Fraction v2, Pythagorean, Linear Relations, Equations and Polynomials trainers. No quizzes |
| Grade 5 ELA | site ✓ | 6 genre units (170 lessons), editions A/B/C, regions map. Render with `render_ela5.pl` |
| Grade 7 Social | site ✓ | 5 units, full suite. Source and HTML match, so edit the markdown and re-render |
| Grade 8 Social | site ✓ | 4 units: notes + key, workbook + key, teacher guide. Exits and tests in markdown only |
| Grade 9 Social | site ✓ | 7 units, HTML only in the repo. Urbanization has a 13-slide class deck |
| STEAM 5–9 | site ✓ | Notes + design journal per unit. Python (G9), Dash (G5) and littleBits (G6) trainers. No quizzes, exits, guides or keys |
| CEFL 7–9 | site ✓ | 15 units × workbook, key, project, teacher guide. CEFL Town: 15 missions, one per unit |
| eSports | partial | Context, 9-week plan, season workbook and club materials. No domain worksheets, exits, rubrics |
| PhysEd 5–6, 7–9 | context only | 7 units each; nothing built |

### Next up
- Teacher read-through of Math 7 and Math 8 (merged to `master` 2026-11-01).
- Math 8 (draft): practice tests and unit tests for Geometry & Measurement, then Statistics & Probability (Number and Algebra & Functions are done).
- Math 9 answer keys follow `research/answer-key-design-research.md` (full solutions for Core, partial for Challenge, faded in workbooks).
