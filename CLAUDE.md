# Classroom Tools Workspace
*Active project*

## Hey — read this first

This is the map for the classroom tools project. Every conversation in this folder starts here.

**Before starting any task:** Read `_status.md` — it shows current project state, what's built, and what's next.

**The project:** Building and refining classroom-ready materials — Workbooks, tests and quizzes, notes packages, and thinking prompts — grounded in evidence on assessment and delivery. Two streams of work: making things, and knowing why they work.

**Also read:** `_meta-context.md` — the operating principles, binding design rules, materials suite, lesson architecture, unit architecture, and importance scale that govern everything built in this workspace.

**Read on demand:** `_pedagogy-reference.md` — activity menus, scaffolding types, peer structures, feedback design, UDL, and math-specific design. Open it when designing a lesson, a task type, or a scaffold.

---

## Build Protocol

### Clarifying questions
Triggered whenever a request uses build / make / create / write / design. Only ask what is genuinely missing from the request — do not ask about things already established in context. Keep questions short and direct. Maximum 4 at once.

### Artifact compliance check
Before writing the first line of any artifact: (1) copy the relevant template from `templates/`, (2) read the artifact context file, (3) state the gate constraint below. This applies even in trust mode.

| Artifact | Template | Gate constraint to state before writing |
|---|---|---|
| Workbook | `templates/workbook-template.md` | "Interleaving confirmed. No part headers. ★/★★ per concept: [clusters]. Context from notes: [examples]." — full gate in `worksheets/workbooks-context.md` |
| Notes package | `templates/notes-package-template.md` | "Progressive blanking confirmed. Refutation-first on: [misconceptions]. Section order: [sequence + reason]." — full gate in `notes-packages/_context.md` |
| Quiz | `templates/quiz-template.md` | "Outcome map complete. LOs covered: [codes]. Every item maps to a specific LO." — full gate in `tests-quizzes/_context.md` |
| Unit test | `templates/test-template.md` | "Outcome map complete. All LOs covered: [codes]. Extended response rubric included." — full gate in `tests-quizzes/_context.md` |
| Exit tickets | `templates/exit-ticket-template.md` | "One ticket per cluster. Every question maps to a specific LO." |
| Home practice sheet (parent pages) | `templates/home-practice-template.md` | "One skill: [skill]. Worked example first, then fading support. Maps to: [prerequisite or core skill]. Fits one printed page." |
| Thinking prompt | *(no template)* | "Prompt requires showing reasoning, not recalling a fact." |
| Math 9 inquiry project (brief + journal + teacher guide) | `templates/inquiry-project-template.md` | "Options: [3, equal difficulty]. Driving questions launched in strand Lesson 1. Mini-lessons: [A, B]. Critique cycle: Period 4. Teams 4–5, roles: [ ]. Audience per option: [ ]. Rubric K/U/S → [local codes]. Depth ceilings respected: [ ]. Real data with source and date: [ ]." — rules in `_courses/math-9/_context.md` (Inquiry Projects) |
| CEFL mini-workbook / project brief | *(no template — format in `_courses/cefl/_context.md`)* | "Moments: [list], each with visual, worked example, 2–3 practice, extra practice. Data + dates: [list]. Cross-curricular tags: [≤1 per moment]. DQ: [ ]. Teams 4–5, roles: [ ]. Milestones → sessions: [ ]. Audience: [ ]. Rubric K/U/S → [LO code]." — full spec in `_courses/cefl/_context.md` |
| Game | *(no template)* | "Outcomes: [codes]. Model: [one line]. Real-time or turn-based. Test hook included." — full rules in `_games-context.md` |
| Simulation / trainer | *(no template)* | "Outcomes: [codes]. Model and simplifications: [one line]. Tasks beside free play: [missions / steps]. Predict-then-test or checked steps. Back to paper: [where]. Test hook included. Full window, no scrolling at 1366×768; written material in popups; dark 3Blue1Brown look." — full rules in `_sims-context.md` |
| Grade 5 ELA unit material (anchor notes, reader, notebook, word work, fluency, exits, cold reads, rubric, teacher guide) | *(no template — format at the top of `scripts/render_ela5.pl`)* | "Genre: [ ]. Anchor topic: [ ]. SRSD strategy: [ ]. Mentor text for each craft move: [ ]. Writing about reading every lesson. Editions A/B/C share texts and question numbers. Codes: [TF/OL/VO/CO/WR/CV]. Passages original or public-domain retold." — full rules in `_courses/grade-5-ela/_context.md` |
| Slide deck | `templates/slides-template/` (folder) | "Follows notes order: [sections]. Blanks 2–3 per slide, answers from the key. Key words from vocab tables: [terms]. Visual on every slide: [one line per slide]." — full rules in `slides/_context.md` |

### Trust mode
Activated when the user says **"i trust you."** Resets at the start of each new conversation.

When active:
- State *Trust mode active.* at the top of the build
- Proceed through all materials without asking for confirmation at each step
- Flag decisions that are genuinely ambiguous and would require rework to fix — do not silently guess on these
- Trust mode applies to the current build task, not all future requests in the session

---

## Folder structure

### Type folders — materials live here

| Folder | What it's for | Go here when you want to... |
|---|---|---|
| `worksheets/` | Practice and application tasks, workbooks, project briefs | Build or revise a worksheet, workbook, or inquiry project for a specific concept or grade |
| `tests-quizzes/` | Formative and summative assessments, exit tickets | Write a quiz, design a test, build a question bank, write exit tickets |
| `notes-packages/` | Student notes, teacher notes | Create guided notes and teacher reference packages |
| `lesson-plans/` | Lesson-by-lesson teaching plans, sub plans | Build a full lesson plan or a substitute teacher package |
| `prompts/` | Thinking and writing prompts | Write or refine prompts that get students to articulate their reasoning |
| `slides/` | Class slide decks (a folder of slide files per deck) | Build or revise slides that walk a class through a notes package |
| `research/` | Evidence on assessment and delivery | Read, summarise, or apply research on what makes assessment and delivery effective |
| `templates/` | Reusable blank structures | Start any new artifact from the relevant template — structure is pre-built, just fill content |
| `scripts/` | Render scripts (markdown → HTML, posters) | Re-render a workbook or poster. Read `scripts/_context.md` first |
| `src/`, `public/` | The Astro site and its published files | Change a page, the nav, or what the site links to. Read `_site-context.md` first |
| `public/materials/*-game-*.html` | Browser games. HTML only, no markdown source | Build or revise a game. Read `_games-context.md` first |
| `public/materials/*-sim-*.html`, `*-trainer-*.html` | Simulations and trainers. HTML only, no markdown source | Build or revise a sim or trainer. Read `_sims-context.md` first (catalogue, rules, evidence in `research/simulations-research.md`) |
| `public/materials/*-prereq-practice-v1.html`, `prereq-practice/` | Prereq practice, one page per unit. HTML only; questions in `prereq-practice/<prefix>-bank.js` | Add or fix a practice question: edit the course's bank. Format: top of `prereq-practice/practice.js` |

Each folder has its own `_context.md` — read it before working in that area.

Materials are organized inside type folders by subject and unit:
`[type]/grade-6-science/[unit]/filename.md`

**Sources vs. renders:** the type folders hold markdown sources. HTML and PDF renders live only in `public/materials/`. Do not keep a second copy of a render beside its source (print-only posters are the exception).

**HTML-first materials** have no markdown source on purpose: games, sims and trainers; prereq practice pages and their question banks; the Science 7 Plants organizers, Lily Lab and Plant Hunt (layout-first printables); and the Grade 6 EF and FR versions (the English markdown is their source). Edit the HTML directly.

**Reconstructed sources (local only):** 56 markdown files dated 2026-10-16 were rebuilt from published HTML that had none (Social 9, Social 8 teacher guides, Grade 6 teacher notes and workbook keys, Science 7 teacher guides v2/v3, and others). They exist only on the Linux machine and are never committed: `.git/info/exclude` lists them. Each opens with a comment naming its HTML. No render script reads them, so the HTML is still the file to edit.

**This repo is public.** Students can read anything committed. `.gitignore` keeps `legislation/`, school admin files, third-party reference PDFs, and unreleased tests out. Before committing a new test or anything with names in it, check it is covered.

**Exception — STEAM (Grades 5–9):** this course is self-contained under `steam/` instead of split across the type folders above. Course context, grade-year plans, notes packages, and design-journal workbooks all live together there (`steam/_context.md`, `steam/grade-5/_context.md` … `steam/grade-9/_context.md`, with each unit's notes + workbook in the matching `steam/grade-[N]/[unit]/` folder). Don't look for STEAM material in `worksheets/`, `notes-packages/`, or `_courses/` — it isn't there.

**Extended design contexts (read these for their artifact type):**
- `worksheets/workbooks-context.md` — full design spec for unit workbooks (interleaving, UDL, Core/Extended questions, visuals, metacognition)
- `notes-packages/_context.md` — full design spec for notes packages (section ordering, fill-in philosophy, misconception handling, scope discipline, HTML render)

### Course and unit contexts — read these for scope, outcomes, misconceptions

| File | What it contains |
|---|---|
| `_courses/grade-6-science/_context.md` | Full course overview: all units, LOs, CS embedding, SM threading, inquiry options |
| `_courses/grade-6-science/forces/_context.md` | Forces unit: LOs, knowledge clusters, misconceptions, scope boundary |
| `_courses/grade-6-science/living-systems/_context.md` | Living Systems unit: LOs, knowledge clusters, scope boundary, misconceptions |
| `_courses/grade-7-science/_context.md` | Science 7 (Alberta 2007 PoS): 5 units, LOs, misconception inventory, depth ceilings |
| `_courses/grade-7-science/[unit]/_context.md` | Unit-level contexts: interactions-ecosystems, plants-food-fibre, heat-temperature, structures-forces, planet-earth |
| `_courses/math-7/_context.md` | Math 7 on the **June 2026 draft** curriculum: 12 topics in 4 strands, local codes PN/IN/SC/FD/RP/LE/FN/LA/CI/VO/ST/PB, depth ceilings, misconceptions, reading level (F&P N–P) and picture rules (3+ diagrams per notes section), materials map. Renders with `scripts/render_math8.pl` (it handles both grades) |
| `_courses/math-8/_context.md` | Math 8: 12 topics (2016 Grade 8 outcomes), local codes SQ/PC/RR/FR/IN/LR/LE/PY/SV/VT/DD/PB, depth ceilings, misconceptions, reading-level and picture rules, materials map. Render with `scripts/render_math8.pl` |
| `_courses/grade-5-ela/_context.md` | Grade 5 ELA (Alberta ELAL K–6, 2023): six genre units, 60-min block, editions A/B/C, local codes TF/OL/VO/CO/WR/CV, error patterns, F&P and Words Their Way use. Does **not** use the math/science formats. Evidence: `research/literacy-reading-writing-research.md`. Render with `scripts/render_ela5.pl` |
| `_courses/math-9/_context.md` | Math 9: 11 topics, depth ceilings, misconception inventory, recommended sequence |
| `_courses/grade-7-social/_context.md` | Social 7 (draft 7–9 curriculum): 5 units, verbatim K/U/S, local codes SB/CG/BE/IM/AF, misconceptions, sensitive-content notes. Materials render with `scripts/render_social.pl` |
| `_courses/grade-8-social/_context.md` | Social 8 (draft 7–9 curriculum): 4 units, outcomes, misconceptions |
| `_courses/cefl/_context.md` | CEFL 7–9 (draft 2026 curriculum): project-based; 5 units × 3 grades, unit rhythm, mini-workbook and project specs, local outcome codes |
| `_courses/esports/_context.md` | eSports club course design: domains, 9-week season, source PDFs |
| `_courses/phys-ed-56/_context.md` | PEW Grades 5–6: organizing ideas, KUSP framework, activity categories, misconceptions |
| `_courses/phys-ed-56/[unit]/_context.md` | Unit-level contexts: invasion-games, net-wall, target, striking-fielding, dance, gymnastics, fitness |
| `_courses/phys-ed-79/_context.md` | PEW Grades 7–9: organizing ideas, KUSP framework, activity categories, misconceptions |
| `_courses/phys-ed-79/[unit]/_context.md` | Unit-level contexts: invasion-games, net-wall, target, striking-fielding, dance, gymnastics, fitness |
| `steam/_context.md` | STEAM Grades 5–9 course overview: equipment map, unit archetype, Art & Media Strand, Open Items — see the exception note above, this course lives outside the type-folder structure |
| `steam/grade-[5–9]/_context.md` | Per-grade STEAM year plan: 4 units each with goals, vocabulary, activities, constraints, LOs, misconceptions |

---

## How to tell me what to do (routing)

| When you say... | I'll read | I'll skip |
|---|---|---|
| "Make a worksheet" | `worksheets/_context.md` → unit `_context.md` in `_courses/` | `research/`, `tests-quizzes/` |
| "Build a workbook" | `worksheets/workbooks-context.md` → unit `_context.md` in `_courses/` → lesson notes | `research/`, `tests-quizzes/` |
| "Write a quiz / test / exits" | `tests-quizzes/_context.md` → unit `_context.md` in `_courses/` | `research/`, `worksheets/` |
| "Build a notes package / teacher notes" | `notes-packages/_context.md` → unit `_context.md` in `_courses/` | `research/`, `tests-quizzes/` |
| "Build a lesson plan / sub plan" | `lesson-plans/_context.md` → unit `_context.md` in `_courses/` | `research/`, `tests-quizzes/` |
| "Improve the thinking prompts" | `prompts/_context.md` | everything else |
| "Research assessment / delivery" | `research/_context.md` | `worksheets/`, `tests-quizzes/` |
| "Make a template" | `templates/_context.md` | everything else |
| "Change the site / add it to the site" | `_site-context.md` | type-folder contexts |
| "Write a parent page / home practice sheet" | `_site-context.md` (Course data and the three views) → `templates/home-practice-template.md` → unit `_context.md` in `_courses/` (and `_courses/math-9/math9-prereqs.md` for Math 9) | `research/`, `tests-quizzes/` |
| "Render / re-render" | `scripts/_context.md` | everything else |
| "Build / revise a game" | `_games-context.md` → unit `_context.md` in `_courses/` | type-folder contexts, `templates/` |
| "Build / revise a sim or trainer" | `_sims-context.md` → `research/simulations-research.md` → unit `_context.md` in `_courses/` (or `steam/grade-[N]/`) | type-folder contexts, `templates/` |
| "Build a CEFL workbook / project / teacher guide" | `_courses/cefl/_context.md` → `research/project-based-learning-research.md` → `research/financial-career-education-research.md` | `templates/`, `tests-quizzes/` — CEFL uses its own mini-workbook and project formats |
| "Build / revise a Math 7 [notes / worksheet / workbook / exits / quiz / teacher notes]" | `_courses/math-7/_context.md` → the type-folder context → the source format at the top of `scripts/render_math8.pl` (diagram types in `scripts/Math8Viz.pm`) | `research/` |
| "Build / revise a Math 8 [notes / worksheet / workbook / exits / quiz / teacher notes]" | `_courses/math-8/_context.md` → the type-folder context → the source format at the top of `scripts/render_math8.pl` (diagram types in `scripts/Math8Viz.pm`) | `research/` |
| "Build / revise a Grade 5 ELA [unit / notebook / reader / anything]" | `_courses/grade-5-ela/_context.md` → `research/literacy-reading-writing-research.md` → the source format at the top of `scripts/render_ela5.pl` | `templates/`, `worksheets/workbooks-context.md`, `notes-packages/_context.md` — ELA uses its own formats |
| "Build / revise slides" | `slides/_context.md` → the unit's notes package and notes answer key → unit `_context.md` in `_courses/` | `research/`, `tests-quizzes/` |
| "Start a [type] build" | Copy relevant template from `templates/` first, then read artifact context | everything else |
| "Build/revise a STEAM [unit/grade] [notes/design journal/plan]" | `steam/_context.md` → `steam/grade-[N]/_context.md` | `templates/`, `worksheets/`, `notes-packages/`, `_courses/` — STEAM doesn't use the standard templates (see `steam/grade-5/` for the established simplified-notes + design-journal format) |

---

## How to name files

| What you're creating | Name it like this | Example |
|---|---|---|
| A worksheet or workbook | `[subject]-[unit]-[type]-v[N].md` | `sci6-forces-workbook-v1.md` |
| A test or quiz or exits | `[subject]-[unit]-[type]-v[N].md` | `sci6-forces-exits-v1.md` |
| A notes package | `[subject]-[unit]-notes-[grade]-v[N].md` | `sci6-living-systems-notes-gr6-v1.md` |
| A teacher notes / sub plan | `[subject]-[unit]-[type]-v[N].md` | `sci6-forces-teachernotes-v1.md` |
| A CEFL 7–9 material | `cefl[G]-[unit]-[type]-v[N].md` | `cefl7-income-tax-workbook-v1.md` |
| A Math 7 material | `math7-[topic]-[type]-v[N].md` (same pattern as Math 8) | `math7-circles-notes-v1.md` |
| A Math 8 material | `math8-[topic]-[type]-v[N].md` (practice sheets: `-practice-`, one source for Core and Challenge) | `math8-pythagorean-notes-v1.md` |
| A Grade 5 ELA material | `ela5-[unit]-[type]-v[N].md`; editions add `-scaffolded` or `-ef` before `-v[N]` | `ela5-tall-tales-notebook-scaffolded-v1.md` |
| A PhysEd 5–6 material | `pew56-[unit]-[type]-v[N].md` | `pew56-invasion-games-exits-v1.md` |
| A PhysEd 7–9 material | `pew79-[unit]-[type]-v[N].md` | `pew79-fitness-program-template-v1.md` |
| A thinking prompt | `[topic]-prompt-v[N].md` | `metacognition-prompt-v2.md` |
| A game | `[subject]-[topic]-game-v[N].html` (in `public/materials/`) | `sci7-seed-to-seed-game-v2.html` |
| A slide deck | folder `[subject]-[unit]-slides-v[N]/` (in `slides/[subject]/[unit]/`) | `soc9-urbanization-industry-slides-v1/` |
| A research summary | `[topic]-research.md` | `formative-assessment-research.md` |
| A template | `[type]-template.md` | `worksheet-template.md` |

The `[N]` version number means you never overwrite — bump it when you revise significantly.

Files go in: `[type-folder]/[subject]/[unit]/filename.md`
Example: `notes-packages/grade-6-science/forces/sci6-forces-teachernotes-v1.md`

---

## What I always know about this project
- **Audience:** Students, teachers and parents, Alberta curriculum context. The site has a student, a parent and (except STEAM) a teacher view of every unit
- **Design standard:** Every artifact should be clean enough to print and hand out as-is
- **Research lens:** Assessment for learning, not just of learning — formative first, summative as confirmation
- **Evidence standard:** Before finalising any artifact, check it against `templates/evidence-design-principles.md` — every material built here must embed at least one Tier 1 strategy and pass at least 3 of the 5 checklist items at the bottom of that file (all 5 for Tier 1 units)
- **Two hard rules:**
  1. Every test or quiz item must map to a specific learning outcome
  2. Every thinking prompt must ask students to show reasoning, not just recall a fact
