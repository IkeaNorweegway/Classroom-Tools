# Project Status
*Last updated: 2026-09-11*

---

## 2026-10-05 — Grade 7 Plants: Plant Lab photosynthesis simulation

New `public/materials/sci7-photosynthesis-sim-v1.html` — a single-file interactive simulation (no libraries). LOs 7-2-02, 7-2-03. Wired into the Grade 7 site under Activities with an "Interactive" badge.
- **Controls:** light, soil water, CO₂, soil minerals (sliders); roots whole/half/almost none, xylem open/blocked, phloem open/blocked, leaves 0–6, chlorophyll dark/pale/none.
- **Model:** glucose per day = the scarcest of (light × chlorophyll, soil water × root function × xylem, CO₂) × leaves/6. The plant uses 25 a day to stay alive; the rest goes to stored sugar and growth. Minerals change growth speed only, never glucose. Roots need sugar from the phloem; without it root energy falls and water uptake drops (matches the notes Section 2 Stretch question).
- **Feedback:** icon plant map with moving water/CO₂/glucose/oxygen, meters with the limiting ingredient tagged, a "What is holding the plant back?" box, and a change log that states what each change did to glucose and why (including "no change, because X is still the limit").
- **Missions tab:** 5 predict-then-test missions (soil is not food, roots eaten, bark stripped/phloem, sealed jar/limiting factor, white leaves), each with a follow-up goal and a notebook reasoning prompt. Completion saved in the browser.
- **Parts tab:** job / needs / gives / try-it card for each part; clicking a part on the plant opens its card.

**Flower Lab (same day):** `public/materials/sci7-flower-reproduction-sim-v1.html`, same layout and engine. LO 7-2-04. One season = 20 days (bud → open → petals fall → seeds ripen).
- **Controls:** bees, wind, other flowers nearby; petals, sepals, anthers, pollen type (sticky / light and dusty), stigma, style, ovules 0–6; runners on/off, seed dispersal, next year normal / new disease.
- **Model:** pollen reaching the ovary = pollen carried (bees × petals for sticky pollen, wind for dusty pollen) × pollen source (own anthers or neighbours) × stigma × style. Ovules fertilize at that rate while the flower is open, then ripen into seeds. Cross-pollinated share = "other flowers" setting. Runners give up to 3 clones. Under a new disease clones all die, self-pollinated seeds mostly die, cross-pollinated seeds do best.
- **Missions:** petals are not decoration, no anthers and no neighbours, pollination vs fertilization (blocked style), a year with no bees (runners), a new disease (variation). Parts tab covers petals, sepals, stamen, stigma, style, ovary/ovules, pollination, runners.

**Open (both sims):** not opened in a browser (headless Edge hung again); only a syntax check of each script passed. No recording sheet or teacher notes built. Grade 6 would need a cut-down photosynthesis version (xylem, phloem, stomata and chloroplasts are out of scope there).

---

## 2026-10-02 — Science 7 notes answer keys rebuilt as v2 (all blanks covered)

The v1 notes answer keys skipped the vocabulary tables, many table cells and single blanks, some Stretch answers, and the whole Unit Synthesis page. All five units now have `sci7-[unit]-notes-answers-v2.md` (in `notes-packages/grade-7-science/[unit]/`) and `public/materials/sci7-[unit]-notes-answers-v2.html`. Each key follows the notes in order: Vocabulary (model definition + example) → Guided Notes (every blank) → Retrieval Check → Unit Synthesis. v1 files kept. The two Science 7 site pages (`src/pages/science7/materials/[unit].astro`, `view/[unit]/[doc].astro`) now point at v2.

**Errors in v1 fixed in v2:** Ecosystems S2 Q2 (wolf is a secondary consumer, not tertiary); Heat S3 Stretch (bridge expands 1.8 m, not 0.18 m).

**Open — need a teacher decision or a source check:**
- Ecosystems S4 "Alberta biodiversity highlights" (plant, vertebrate, and at-risk species counts) and Plants S5 "over ___ billion dollars" are not in the unit contexts. The key gives approximate figures marked "confirm".
- Planet Earth S3 "approximately ___ major plates": v2 says 7 (v1 said 15).
- Planet Earth S4: the notes say magnitude 7 releases 10× the energy of magnitude 6 (strictly 10× shaking, ~32× energy). Key matches the notes and annotates it.
- Structures S2: the student notes call snow both a live load and a "dead load that accumulates". Key marks live load; the notes wording is unchanged.
- HTML not checked in a browser; not committed or pushed. No Python or Node on this machine — the render script was PowerShell.

---

## 2026-10-01 — Math 9 Rational Numbers: unit test + question bank

In `tests-quizzes/math-9/rational-numbers/` (each as `.md` + `.html`):
- `math9-rational-numbers-test-v1` — /50, 60 min, no calculator. Part A 8 MC, Part B 10 short answer (interleaved, not in section order), Part C chinook extended response (4 parts), Part D claim evaluation. Ends with a "When you get this test back" marks-by-target table and reflection. Outcome map, distractor diagnosis, mark schemes and rubrics in the teacher pages.
- `math9-rational-numbers-question-bank-v1` — 60 items, 12 per target (6 ★ Core, 6 ★★ Extended), IDs like RN3-07, full key, plus ready-made sets: 3 warm-ups, a retake that mirrors the test's Part B/C/D, and a re-teach set per target.

- `math9-rational-numbers-test-v2` (2026-10-02, `.md` + `.html`) — shortened to 80% of the questions: 16 instead of 20, /44, 50 min. Cut v1 Q2, Q3, Q4 (MC) and Q10 (short answer); Part A is now one MC per target. Sign forms of a fraction are no longer tested directly. v1 kept unchanged. The bank's "Retake, Part B" set mirrors v1; for a v2 retake leave out RN2-02.

- **On the site as "Practice Test" (2026-10-02):** v1 split into `public/materials/math-9/tests/rational-numbers/math9-rational-numbers-practice-test-v1.html` (student pages) and `…-practice-test-answers-v1.html` (outcome map + key), listed on the Math 9 Number page under Rational Numbers and its answer keys. Because v1 and its key are now public to students, use v3 as the real test.
- `math9-rational-numbers-test-v3` (2026-10-02, `.md` + `.html`) — the real test. Same 16-question, /44, 50-min structure as v2 with every number changed and a new Q15 context (cold front in Grande Prairie). No item overlaps the practice test or the question bank. v2 is superseded (it shares all its questions with the public practice test).

**LO codes:** Math 9 has no official outcome codes in the course context, so both files use local codes RN1–RN5 (the five learning targets from the notes package). Swap in curriculum codes if wanted.

**Open:** HTML not checked visually and no PDF (headless Edge hung again). Fractions in the HTML are stacked by a small inline script; with JS off they fall back to a/b. Not copied to `public/materials/` or wired into the site. No quiz for this topic yet.

---

## 2026-10-01 — Slow reveal graphs: research + first trial (Math 9 Statistics)

- `research/slow-reveal-graphs-research.md` — routine (Laib), practitioner accounts, design implications. Format-specific evidence is thin; mechanisms (information gap, prediction, reflection) are already in the framework.
- Trial in `worksheets/math-9/statistics-probability/statistics/`:
  - `math9-statistics-slowreveal-v1.html` — projector page, 7 reveals, arrow keys/click. Canada census population 1951–2011 as a scatter plot; 1996 and 2021 held back for interpolation/extrapolation; line of best fit followed back to 1901 gives a negative population.
  - `math9-statistics-slowreveal-worksheet-v1.html` + `.md` — reveal log (write before each reveal), unlabelled graph students label and draw on, Q1–6 + ★ + reflection. Teacher run sheet and key are at the bottom of the `.md` only.

**Open:** not yet rendered or checked visually (headless Edge crashed on this machine), no PDF, not copied to `public/materials/` or wired into the site. Not yet decided: generic reusable recording sheet for daily warm-up use.

---

## 2026-09-28 — Grade 7 Plants: Lily Lab (dissect, press, mount on archival paper)

In-class lab for Teacher Guide Lesson 8 (flower structure). LO 7-2-04 primary; Q8 interleaves 7-2-03 (photosynthesis), ★ interleaves 7-2-05 (selective breeding). User choices: groups of 3–4, books/weights press over multiple days, all three versions.
- `public/materials/sci7-lily-dissection-lab-v1.html` (+ `.pdf`), 7 pages: timeline + predict ("who is the lily for?") + safety (pollen stains, cat toxicity, teacher-only blade) + materials + 4 role cards (p1); From-memory part→job table revisited after the lab + "Lily Trick" (sepals look like petals: outer vs inner tepal ring) + labelled lily model SVG (p2); finished-tray model SVG + 9-step outside-in procedure incl. tape pollen sample and teacher-cut ovary slice (p3); record table + pollen/stigma/ovary observation boxes + Q1–3 (p4); archival press-stack SVG + build steps + Q4–5 + Day 2/4 blotter-swap log (p5); mounting steps + layout plan + herbarium specimen-label fields + Q6–7 (p6); wrap-up Q8–9 + ★ + self-rating (p7).
- `sci7-lily-dissection-lab-ipp-v1.html` (+ `.pdf`), 5 pages, EF spec: 4-part picture word bank, pull/lay/count routine with count boxes, circle-its, picture press steps, draw-a-line part→job match, simple label card, pollinator misconception revisit, self-rating. Drops sub-parts (anther/filament/stigma/style/ovary).
- `sci7-lily-dissection-lab-teachernotes-v1.html` (+ `.pdf`), 5 pages: at-a-glance, shopping list for 8 groups, safety, run of show, lily-pressing troubleshooting, formative signals, full answer keys for both versions.
- Wired into the Grade 7 site (Activities: Lab + Accessible; Answer Keys: teacher notes).

**Open decision flagged in teacher notes:** written as one mounted card per group (one lily = only 3 sepals/3 petals). A multi-bloom stem per group would allow one card per student.
**Accuracy note:** on *Lilium* all 6 tepals carry a nectar groove, so the groove is not used to tell sepals from petals — ring position and width are.

---

## 2026-09-28 — Grade 7 Plants: outdoor Plant Hunt activity

New `public/materials/sci7-plant-hunt-outdoor-v1.html` (+ `.pdf`), 6 Letter pages: field rules + short photosynthesis note + icon flowchart (p1); word bank + worked-model dandelion sketch + sketch checklist + predict-before-you-go (p2); one full page each for tree / bush / grass with a large drawing box (pre-printed ground line), system word bank, and 2 reasoning questions (p3–5); back-inside compare table + "tree mass from soil" misconception prompt + reflection (p6). LOs 7-2-02, 7-2-03. Wired into the Grade 7 site under a new **Activities** section. No answer key built yet.

**IPP version:** `sci7-plant-hunt-outdoor-ipp-v1.html` (+ `.pdf`), 7 pages, EF easy-read spec (adult read-aloud note, 70/30 support strip, 5-word picture word bank, 3-step draw/label/green+sun routine, circle-it answers with a "How do you know?" line, sort-it table, self-rating). Drops xylem/phloem and arrows. Listed beside the original with an "Accessible" badge.

**Icon-flowchart revision (pushed, 8c5940b):** Replaced the drawn dandelion model on both sheets with an icon-card plant map. Replaced the chloroplast box diagram in `sci7-plants-food-fibre-notes-v1.html` Section 3 with the icon photosynthesis flowchart (blanks: water/CO₂ source, pigment, missing gas); added a flowchart row to the notes answer key; updated the notes .md to match. **Open:** the two Plant Hunt PDFs in `public/materials/` are stale (locked by the editor when re-rendering) and are not committed. Re-render and commit them.

---

## What was completed in the current session (2026-09-11)

### STEAM Grades 6–9 — Full redesign from teacher dictation

User dictated new four-unit year plans for Grades 6–9 (Grade 5 reviewed and confirmed unchanged — it already matched: Dash Bot → Slow Coaster → Water Filter → Capstone: Scratch Story). Rewrote `grade-6/_context.md` through `grade-9/_context.md` at full detail (goals, CT/science vocabulary, activities, constraints, Design & Media tasks, culminating artifacts, learning outcomes, misconceptions per unit — matching Grade 5's depth), plus updated the course-level `_context.md` (Equipment Map, Grade-by-Grade Summary, Open Items).

**New year plans:**
- **Grade 6:** 1. littleBits (circuits/CT/sensors, game-or-instrument fork) → 2. 3D-printed bag tag + digital portfolio (Tinkercad/MakerBot Sketch intro) → 3. Bridges & Structures (load-bearing, budget-constrained — chosen via AskUserQuestion after user asked for Unit 3 suggestions) → 4. Capstone: Glider/Airplane (paper + balsa, research + presentation + video)
- **Grade 7:** 1. Spike Prime foundations (CT transfer after Grade 6's robot-free year) → 2. micro:bit Thermodynamics Box (insulation or light-control challenge, reintroduces micro:bit after a one-year gap) → 3. Choose Your Own Adventure (Scratch, branching/state) → 4. Capstone: CO2 Dragster (first wood-shop unit, timed race)
- **Grade 8:** 1. Rube Goldberg class chain reaction (3D-printed pegboard mounts; uniquely a shared class-wide build where groups must interface with neighbors — flagged as needing its own coordination protocol) → 2. Platform Game (Scratch, gravity/collision) → 3. Mechanical Advantage & Powered Motor (soldering + 5V DC motor, new skill) → 4. Capstone: Spike Prime Challenge Maze (student-authored peer challenges)
- **Grade 9:** 1. **Java** Introduction (tutorials + Tic-Tac-Toe/Minesweeper, deliberately decoupled from robot hardware — switched from an initial Python draft per user request, since it makes Grade 9 one consistent language all year) → 2. REV Robotics intro (tutorial-based; confirmed via user-supplied link as **REV DUO** — competition-grade FTC hardware, coded in Java/Blockly-for-Java) → 3. Electrified Miniatures (Tinkercad/3D print + lights/sensors/simple motion diorama) → 4. Capstone: Trebuchet (~1m, wood shop, prototype-then-scale, one-minute process video)

**Significant equipment-map changes from the original ladder (all flagged in course-level Open Items for user confirmation):**
- **Sphero dropped entirely** — no longer appears anywhere in Grades 5–9.
- **REV narrowed** from a two-year Grade 8 intro / Grade 9 capstone arc to a single Grade 9 Unit 2 tutorial; Grade 9's capstone is now the non-robot trebuchet. Confirmed REV product is **REV DUO** (revrobotics.com/duo) via user-supplied link.
- **New platforms/skills added:** littleBits (Grade 6), soldering + powered DC motor circuits (Grade 8), wood shop (Grade 7 and 9 capstones).
- **Scratch confirmed as a recurring narrative/game-coding thread** (Grade 5, 7, 8) — resolves an old open item questioning whether Grade 5's Scratch capstone was a one-year departure.

**New open items added to the course-level context:** soldering safety protocol (needed before Grade 8 Unit 3), wood-shop access/safety/supervision (Grade 7 and 9 capstones), littleBits inventory/kit scope, and the Rube Goldberg cross-group coordination protocol.

**Folder consolidation (same session, user request):** moved all STEAM material out of the type-folder structure into one self-contained `steam/` folder at the workspace root — course context, all 5 grades' year plans, and Grade 5's existing notes/design-journal files (previously split across `_courses/steam/`, `notes-packages/steam-grade-5/`, and `worksheets/steam-grade-5/`). New layout: `steam/_context.md`, `steam/grade-[5–9]/_context.md`, and each unit's notes + design journal together in `steam/grade-[N]/[unit]/`. Updated internal cross-references in all 5 grade files and added an exception note + two table rows to the root `CLAUDE.md` so future sessions know STEAM doesn't follow the standard type-folder routing. One harmless empty leftover: `_courses/steam/` (a bare directory, no files) couldn't be removed because it's this session's pinned working directory — safe to delete manually later.

**Materials build completed (same session):** notes package + design journal for all 16 units across Grades 6–9 (32 files), built via 4 parallel background agents (one per grade), matching Grade 5's established simplified-notes + design-journal format exactly. Spot-checked Grade 8's Rube Goldberg journal (the structurally hardest case — cross-group hand-off negotiation, isolation vs. multi-run integration testing, failure-side diagnosis) and it held up. Full file list, all under `steam/grade-[N]/[unit]/`:
- **Grade 6:** `littlebits-circuits/`, `bag-tag-portfolio/`, `bridges-structures/`, `glider-capstone/`
- **Grade 7:** `spike-prime-foundations/`, `thermodynamics-box/`, `choose-your-own-adventure/`, `co2-dragster-capstone/`
- **Grade 8:** `rube-goldberg/`, `platform-game/`, `mechanical-advantage-motor/`, `challenge-maze-capstone/`
- **Grade 9:** `java-introduction/`, `rev-robotics-intro/`, `electrified-miniatures/`, `trebuchet-capstone/`

Each folder has a `steam[N]-[shortname]-notes-v1.md` and `steam[N]-[shortname]-workbook-v1.md`. Not built: quizzes/tests/exit tickets/teacher guides/answer keys/HTML renders for any grade — scope was explicitly notes + design journal only, per user confirmation.

**Follow-up in same session: Grade 9 Unit 1 language decision reopened.** User doesn't want to commit to Java yet, so Unit 1 is now built out as a genuine either/or (Java or Python), not a settled choice:
- `steam/grade-9/_context.md` Unit 1 rewritten with parallel "Option A: Java" / "Option B: Python" sections (goal, vocab, activities, LOs, misconception each); Unit 2's "Coding environment note" now branches on which was chosen (same-language extension if Java, an explicit language-transfer moment if Python); Year at a Glance, Materials Needed, and the HS hand-off section all hedged to match.
- Course-level `steam/_context.md` equipment map row and Grade-by-Grade Summary updated to show the decision as open.
- Grade 8's "Sets Up for Grade 9" line updated to not assume Java.
- New files: `steam/grade-9/python-introduction/steam9-python-notes-v1.md` and `steam9-python-workbook-v1.md` — full parallel build to the existing Java unit (indentation-as-structure instead of class/main-method, syntax/runtime/logic error trio instead of compile-time/runtime/logic, `def` functions instead of methods).
- **Follow-up in same session: Python-path Unit 2 materials built too ("build in case").** Added `steam9-rev-notes-python-path-v1.md` and `steam9-rev-workbook-python-path-v1.md` alongside the existing Java-path files in `steam/grade-9/rev-robotics-intro/`. The Python-path version treats the Java syntax as genuinely new (not just new hardware) — includes a Python-to-Java translation guide/table, a translation-practice journal step, and a misconception reframed around "different language means starting over" rather than "hardware needs a different language." Updated the teacher-note comments in the original Java-path files to point to these new files instead of saying a Python version wasn't built. `steam/grade-9/_context.md`'s Unit 2 section now names both file pairs explicitly. Both language paths for the full Grade 9 Unit 1 → Unit 2 sequence are now fully built regardless of which way the language decision goes.

---

## What was completed in the previous session (2026-09-04)

### STEAM Grade 5 — Year plan revised, Units 1–4 fully built (notes + design journal)

User supplied four custom units for Grade 5, replacing the previous Foundations/Sensors/Build Challenge/Dash Helper sequence in `_courses/steam/grade-5/_context.md`:

1. **Dash Bot: Algorithms & Sensors** — CT vocab (sequence, loop, conditional, sensor, input, output, debug) + light micro:bit touch, live obstacle-course test
2. **The Slow Coaster** — non-robot, non-screen mechanical build; competing constraint (keep moving, but slowly); first explicit naming of the engineering design cycle
3. **Scratch Story** — new platform (not on the course-level equipment map), narrative + character/backdrop design + block coding combined
4. **Capstone: Water Filter** — non-robot capstone; ecology/research + layered filtration + water-clarity testing + redesign; central safety misconception (clear ≠ safe) framed explicitly; produced video required per course-wide capstone rule

**Pacing decision:** each unit is ~20h (~10 sessions) as before, but only ~15h is scripted core content — the remaining ~5h is named as deliberate teacher buffer, not additional scripted material. Documented in the Year at a Glance table.

**Materials format — deliberately adapted from the standard science-unit templates**, per explicit user instruction:
- **Notes package:** simplified — brain dump, vocab table, 2–4 light concept blocks (one quick check each, not a full 5-question retrieval check per section), one misconception callout per unit, short synthesis. Does not follow `notes-packages/_context.md`'s full section structure.
- **Workbook → design journal:** replaces interleaved-practice questions entirely. Follows each unit's actual project arc: define the problem → sketch 2–3 concepts → design review/peer share → build/test iteration log → mid-project check-in → reflection → self-assessment against that unit's LOs. Does not follow `worksheets/workbooks-context.md`'s interleaving/Core-Extended structure.

**Files built** (`.md` only — no HTML/PDF render yet):
- `_courses/steam/grade-5/_context.md` — full rewrite, new 4-unit plan
- `notes-packages/steam-grade-5/[unit]/steam5-[unit]-notes-v1.md` × 4
- `worksheets/steam-grade-5/[unit]/steam5-[unit]-workbook-v1.md` × 4

**Open items flagged to user, not yet resolved:**
- Unit 1's micro:bit touch is a judgment call to preserve Grade 6 continuity (Grade 6's plan assumes micro:bit was already introduced) — user's original unit list didn't mention micro:bit; confirm this addition is wanted.
- Scratch (now Unit 4, the capstone) is not on the course-level equipment map (`_courses/steam/_context.md`) — flagged as a one-year departure; if Scratch should recur in later grades, that needs a course-level decision.
- No answer keys, HTML renders, or PPTX built yet — user's request was specifically notes + workbook (design journal); full Materials Suite was explicitly declined in favor of a lighter, project-appropriate set.
- Grades 6–9 STEAM year plans are untouched — only Grade 5 was revised this session.

**Follow-up in same session: Scratch Story swapped to be the Grade 5 capstone (was Water Filter).** Unit order is now 1. Dash Bot, 2. Slow Coaster, 3. Water Filter, 4. Capstone: Scratch Story. Changes made:
- Renamed folders: `notes-packages/steam-grade-5/water-filter-capstone` → `water-filter`; `.../scratch-story` → `scratch-story-capstone` (and matching folders under `worksheets/`)
- Water Filter (now Unit 3): dropped the produced-video requirement, replaced with a peer design review step (matches the Build Challenge archetype shape) — no longer capstone-framed
- Scratch Story (now Unit 4, capstone): added the produced-video requirement, a required branch point (non-linear story structure — the year's highest constraint), and a real-audience-beyond-the-classroom requirement; notes and design journal both updated (new "Branch" vocab term, new Concept 4, new video storyboard step, updated self-assessment)
- `_courses/steam/grade-5/_context.md` fully reflects the new order (Year at a Glance table, unit sections, Materials Needed labels, Sets Up for Grade 6)

---

## What this project is

A classroom tools workspace for Alberta curriculum materials. Two repos:
- **Content/source files:** `/home/ejanbremness/Documents/Classroom tools/` — markdown workbooks, notes, worksheets, lesson plans, research
- **Published site:** `/home/ejanbremness/Documents/classroom-tools-site/` — Astro static site with HTML materials in `public/materials/`

The site is at: https://ikeanorweegway.github.io/science-6-materials/ (GitHub Pages)

---

## What was completed in the current session (2026-06-11)

### Science 7 — Full build from scratch (Alberta 2007 PoS)

Built a complete set of materials for all five Grade 7 Science units. All files located under their respective type folders at `[type]/grade-7-science/[unit]/`.

**Course context:**
- `_courses/grade-7-science/_context.md` — 5 units, importance scale, SM threading, LOs with knowledge clusters, misconception inventory, inquiry options, depth ceilings, file naming

**Unit contexts** (`_courses/grade-7-science/[unit]/_context.md`) — 5 files:
- `interactions-ecosystems/`, `plants-food-fibre/`, `heat-temperature/`, `structures-forces/`, `planet-earth/`

**Notes packages** (`notes-packages/grade-7-science/[unit]/`) — 5 files, 6 sections each with pre-knowledge check, vocab tables, guided fill-in notes, retrieval checks, unit synthesis, refutation-first misconception handling

**Workbooks** (`worksheets/grade-7-science/[unit]/`) — 5 files, 5–7 parts each, interleaved scrambled retrieval, ★ synthesis challenge

**Exit tickets** (`tests-quizzes/grade-7-science/[unit]/`) — 5 files, 6 cut-apart slips each, one per knowledge cluster, 3 questions per slip

**Quizzes** (`tests-quizzes/grade-7-science/[unit]/`) — 5 files, /30 marks, cover first 3 clusters, outcome map table

**Unit tests** (`tests-quizzes/grade-7-science/[unit]/`) — 5 files, /60 marks, all LOs, extended response with rubric, outcome map table

**Teacher guides** (`lesson-plans/grade-7-science/[unit]/`) — 5 files, SHOW/SAY/CUE lesson sequences, misconception management table, lab notes, differentiation

**Answer keys** — 15 files total:
- Notes answer keys: `[unit]/sci7-[unit]-notes-answers-v1.md` × 5 (`notes-packages/grade-7-science/[unit]/`)
- Assessment answer keys (exits + quiz + test): `sci7-[unit]-assessment-answers-v1.md` × 5 (`tests-quizzes/grade-7-science/[unit]/`)
- Workbook answer keys: `sci7-[unit]-workbook-answers-v1.md` × 5 (`worksheets/grade-7-science/[unit]/`)

---

## Science 7 build status

| Unit | Tier | Notes | Notes AK | Workbook | Workbook AK | Exits | Quiz | Test | Teacher Guide |
|---|---|---|---|---|---|---|---|---|---|
| Interactions & Ecosystems | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Plants for Food & Fibre | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Heat and Temperature | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Structures and Forces | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Planet Earth | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Still to build for Science 7:**
- HTML render versions (site deployment)
- FR / EF adaptations (if needed)
- Course page on classroom-tools-site

---

## What was completed in the previous session (2026-06-02, session 2)

### Math 9 — Full build from scratch

Built a complete set of student-facing materials for all 11 Math 9 Alberta curriculum topics.

**Course context:**
- `_courses/math-9/_context.md` — depth ceilings, misconception inventory, recommended sequence, design notes

**Notes packages** (`notes-packages/math-9/`) — 11 total (9 new + 2 pre-existing):

| Topic | File | New? |
|---|---|---|
| Rational Numbers | `rational-numbers/math9-rational-numbers-notes-v1.md` | ✓ |
| Square Roots | `square-roots/math9-square-roots-notes-v1.md` | ✓ |
| Powers & Exponents | `powers-exponents/math9-powers-notes-v1.md` | pre-existing |
| Linear Relations | `linear-relations/math9-linear-relations-notes-v1.md` | ✓ |
| Linear Equations & Inequalities | `linear-equations/math9-linear-equations-notes-v1.md` | ✓ |
| Polynomials | `polynomials/math9-polynomials-notes-v1.md` | pre-existing |
| Circle Geometry | `circle-geometry/math9-circle-geometry-notes-v1.md` | ✓ |
| Surface Area & Volume | `measurement/math9-measurement-notes-v1.md` | ✓ |
| Similarity & Scale | `similarity/math9-similarity-notes-v1.md` | ✓ |
| Statistics | `statistics/math9-statistics-notes-v1.md` | ✓ |
| Probability | `probability/math9-probability-notes-v1.md` | ✓ |

**Strand workbooks** (`worksheets/math-9/`) — 4 new, one per curriculum strand, cross-topic interleaved:

| Strand | File | Topics covered |
|---|---|---|
| Number | `number/math9-number-workbook-v1.md` | Rational numbers + Powers + Square roots |
| Algebra | `algebra/math9-algebra-workbook-v1.md` | Linear relations + Equations/inequalities + Polynomials |
| Measurement & Geometry | `measurement-geometry/math9-measurement-geometry-workbook-v1.md` | Circle geometry + SA&V + Similarity |
| Statistics & Probability | `statistics-probability/math9-statistics-probability-workbook-v1.md` | Scatter plots + Probability |

**Topic worksheets and concept pages** (`worksheets/math-9/[strand]/[topic]/`) — 33 new files across all 11 topics:

| Type | Count | Format |
|---|---|---|
| Concept one-pagers (`*-concepts-v1.md`) | 11 | Key vocab + formulas + 2–3 worked examples + common mistakes |
| Core worksheets (`*-worksheet-core-v1.md`) | 11 | ~10 ★ questions, scaffolded |
| Challenge worksheets (`*-worksheet-challenge-v1.md`) | 11 | ~8 ★★ questions, error analysis, explanation, transfer |

---

## What was completed in session 1 of 2026-06-02 (Math 9 full build)

### Math 9 — Full build from scratch

Built a complete set of student-facing materials for all 11 Math 9 Alberta curriculum topics. (Full details below in Math 9 build status.)

---

## What was completed in session 2 of 2026-06-02 (Math 9 answer keys)

### Math 9 — Answer keys for all materials (37 files)

**Research conducted first:** Two research sessions established the evidence base for answer key format — findings filed in `research/answer-key-design-research.md`. Key findings: worked solutions beat answers-only (expertise reversal effect, Sweller; Kapur's productive failure; foresight bias). Challenge AKs use partial solutions to maintain productive struggle.

**Answer keys built:**

| Type | Files | Format |
|---|---|---|
| Notes package AKs | 11 | Table: blank/prompt → answer + annotation |
| Core worksheet AKs (★) | 11 | Full worked solutions, annotated at decision points |
| Challenge worksheet AKs (★★) | 11 | Partial: setup + decision step shown; final answer only |
| Strand workbook AKs | 4 | Faded structure (full → partial → answer-only toward end) |

**Files location:** Answer keys sit alongside their source files (same folder, `*-answers-v1.md`)

**Issues flagged:** Several angle-expression problems in circle geometry worksheets (Q6 core, Q3 challenge) contain inconsistent expressions with no valid solution. Notes flagged in AKs for teacher awareness.

---

## What was completed in the last session (2026-05-19)

### Task 7 ✓ FULLY COMPLETE
- Added FR section to `src/pages/materials/index.astro` (commit `af57e85`)
- Created dedicated `/materials/fr` page (`src/pages/materials/fr.astro`)
- Added "Français" nav tab (standalone bordered style, desktop + mobile) to `Nav.astro`
- Pushed all commits to GitHub Pages (commits `af57e85`, `155d263`, `b92510a`)
- FR tab is now live on the site

### Task 4 (in progress) — Markdown source files
**Completed so far:**

Notes answer keys (6/6 done):
- `notes-packages/grade-6-science/matter/sci6-matter-notes-answers-v1.md`
- `notes-packages/grade-6-science/forces/sci6-forces-notes-answers-v1.md`
- `notes-packages/grade-6-science/living-systems/sci6-living-systems-notes-answers-v1.md`
- `notes-packages/grade-6-science/climate/sci6-climate-notes-answers-v1.md`
- `notes-packages/grade-6-science/energy-resources/sci6-energy-resources-notes-answers-v1.md`
- `notes-packages/grade-6-science/space/sci6-space-notes-answers-v1.md`

Standard workbook answer keys (2/7 done):
- `worksheets/grade-6-science/matter/sci6-matter-workbook-answers-v1.md`
- `worksheets/grade-6-science/forces/sci6-forces-workbook-answers-v1.md`

**Still to do in Task 4:**
- Standard workbook answer keys: living-systems, climate, energy-resources, space, year-review (5 remaining)
- EF workbook answer keys: all 7
- EF notes: all 6 (year EF notes `.md` already exists)
- EF workbooks: all 7
- Teacher notes: matter, living-systems, climate, energy-resources, space (5 remaining — forces already exists)
- Forces standard workbook `.md` (missed in original build)
- FR notes: all 7
- FR workbooks: all 7

**Total remaining in Task 4:** ~39 files

---

## Priority task queue — Grade 6 Science site

### TASK 4 — Create `.md` source files for all HTML-only materials
**Status:** In progress (~39 files remaining — see above)

### TASK 5 — Format materials on each unit page
**What:** Add a "Materials" panel to each `/units/[unit]` page linking all available materials grouped by type (Notes, Workbooks, Easy Read, Answer Keys) with badge labels and "Open ↗" links.
**Files to edit:**
- `src/pages/units/[unit].astro` — add materials panel below lesson list
**Design:** Match card style already used in `src/pages/materials/index.astro` — border-l-4 unit colour, badges, "Open ↗" button.

### TASK 6 — Humanize the "What you will learn" unit pages
**What:** Each unit page renders a `.md` file from `src/content/units/`. Currently structured like spec documents (learning outcomes, guiding questions). Need to read like something a student or parent would actually want to read.
**Goal per page:** Opening hook → what students will explore → what they'll be able to do → one real-world connection.
**Scope:** All 6 unit `.md` files.

---

## Math 9 build status

### Notes packages and answer keys

| Topic | Notes | Notes AK | Workbook | Core WS | Core WS AK | Challenge WS | Challenge WS AK |
|---|---|---|---|---|---|---|---|
| Rational Numbers | ✓ | ✓ | ✓ (strand) | ✓ | ✓ | ✓ | ✓ |
| Square Roots | ✓ | ✓ | ✓ (strand) | ✓ | ✓ | ✓ | ✓ |
| Powers & Exponents | ✓ | ✓ | ✓ (strand) | ✓ | ✓ | ✓ | ✓ |
| Linear Relations | ✓ | ✓ | ✓ (strand) | ✓ | ✓ | ✓ | ✓ |
| Linear Equations & Inequalities | ✓ | ✓ | ✓ (strand) | ✓ | ✓ | ✓ | ✓ |
| Polynomials | ✓ | ✓ | ✓ (strand) | ✓ | ✓ | ✓ | ✓ |
| Circle Geometry | ✓ | ✓ | ✓ (strand) | ✓ | ✓ | ✓ | ✓ |
| Surface Area & Volume | ✓ | ✓ | ✓ (strand) | ✓ | ✓ | ✓ | ✓ |
| Similarity & Scale | ✓ | ✓ | ✓ (strand) | ✓ | ✓ | ✓ | ✓ |
| Statistics | ✓ | ✓ | ✓ (strand) | ✓ | ✓ | ✓ | ✓ |
| Probability | ✓ | ✓ | ✓ (strand) | ✓ | ✓ | ✓ | ✓ |

*(Strand) = covered in the strand-level workbook, not a standalone topic workbook*

### Strand workbook answer keys

| Strand | Workbook | Workbook AK |
|---|---|---|
| Number | ✓ | ✓ |
| Algebra | ✓ | ✓ |
| Measurement & Geometry | ✓ | ✓ |
| Statistics & Probability | ✓ | ✓ |

**Answer key design follows research on formative learning:**
- Notes AKs: table format (blank/prompt → answer + annotation). Full solutions.
- Core worksheet AKs (★): full worked solutions, annotated at decision points, "Cover first" instruction.
- Challenge worksheet AKs (★★): partial solutions — setup + decision step shown; final answer listed; execution left to student. Model paragraphs for explanation questions.
- Strand workbook AKs: faded structure — full solutions early, progressively less scaffolding toward end.
- Source: `research/answer-key-design-research.md`

### Math 9 still to build

| Material | Status |
|---|---|
| HTML render versions — all materials | ✓ — 98 HTML files rendered (notes, worksheets, concepts, workbooks, exits, all AKs) |
| Exit tickets (per topic, per section) | ✓ — 11 files, 52 total slips, answer keys included |
| Quizzes (per topic) | — not started |
| Unit tests | Rational Numbers topic test ✓ (2026-10-01); other topics and strand tests not started |
| Question banks | Rational Numbers ✓ (2026-10-01); other topics not started |
| Course page on classroom-tools-site | — not started |

---

## Grade 6 Science build status

| Unit | Notes (EN) | Notes (EF) | Notes (FR) | Workbook (EN) | Workbook (EF) | Workbook (FR) | Teacher Notes | Workbook AK | EF Workbook AK |
|---|---|---|---|---|---|---|---|---|---|
| Matter | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Forces | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Living Systems | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Climate | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Energy Resources | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Space | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Year Review | ✓ (year) | ✓ (year) | ✓ (year) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

✓ = built and deployed | — = not started

**Note:** `.md` source files for most HTML-only materials are still missing (see Task 4 above). The HTML files on the site are complete.

---

## PhysEd build status

### Grades 5–6
| Unit | Lesson Plans | Rubrics | Exits | Worksheets |
|---|---|---|---|---|
| Invasion Games | — | — | — | — |
| Net/Wall Games | — | — | — | — |
| Target Games | — | — | — | — |
| Striking/Fielding | — | — | — | — |
| Dance | — | — | — | — |
| Gymnastics | — | — | — | — |
| Fitness | — | — | — | — |

### Grades 7–9
| Unit | Lesson Plans | Rubrics | Exits | Worksheets |
|---|---|---|---|---|
| Invasion Games | — | — | — | — |
| Net/Wall Games | — | — | — | — |
| Target Games | — | — | — | — |
| Striking/Fielding | — | — | — | — |
| Dance | — | — | — | — |
| Gymnastics | — | — | — | — |
| Fitness | — | — | — | — |

---

## eSports build status

See `_courses/eSports/_context.md` for full course design.

| Material | Status |
|---|---|
| Course context (`_courses/eSports/_context.md`) | ✓ |
| Research files (SEM, esports, NASEF, Alberta strategy) | ✓ |
| Unit plan — 9 weeks, once/week, tournament + showcase (`lesson-plans/esports/esports-unit-plan-9week-v1.md`) | ✓ |
| Season workbook — 30 questions, all domains (`worksheets/esports/esports-season-workbook-v1.md`) | ✓ |
| Club Charter template (`worksheets/esports/esports-club-charter-template-v1.md`) | ✓ |
| Tilt scenario cards — 7 cards, Week 5 (`worksheets/esports/esports-tilt-scenario-cards-v1.md`) | ✓ |
| Pre-match report sheet — Weeks 7–9 (`worksheets/esports/esports-prematch-report-v1.md`) | ✓ |
| Role rotation schedule — 4/5/6-person variants (`worksheets/esports/esports-role-rotation-schedule-v1.md`) | ✓ |
| Domain Sorting Survey (NASEF — external, free at NASEF.org) | reference only |
| Domain worksheets (one per domain — Content, Entrepreneur, Strategist, Organizer) | — not started |
| Exit tickets (weekly or per-domain block) | — not started |
| Showcase presentation templates | — not started |
| Season reflection portfolio | — not started |
| Assessment rubrics | — not started |
