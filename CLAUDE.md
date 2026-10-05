# Classroom Tools Workspace
*April 2026 | Active project*

## Hey — read this first

This is the map for the classroom tools project. Every conversation in this folder starts here.

**Before starting any task:** Read `_status.md` — it shows current project state, what's built, and what's next.

**The project:** Building and refining classroom-ready materials — Workbooks, tests and quizzes, notes packages, and thinking prompts — grounded in evidence on assessment and delivery. Two streams of work: making things, and knowing why they work.

**Also read:** `_meta-context.md` — the evidence base, materials suite, lesson architecture, unit architecture, importance scale, and build protocol that governs everything built in this workspace.

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
| Thinking prompt | *(no template)* | "Prompt requires showing reasoning, not recalling a fact." |

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
| `research/` | Evidence on assessment and delivery | Read, summarise, or apply research on what makes assessment and delivery effective |
| `templates/` | Reusable blank structures | Start any new artifact from the relevant template — structure is pre-built, just fill content |

Each folder has its own `_context.md` — read it before working in that area.

Materials are organized inside type folders by subject and unit:
`[type]/grade-6-science/[unit]/filename.md`

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
| "Build a notes package / teacher notes" | `notes-packages/_context.md` → unit `_context.md` in `_courses/` | `research/`, `templates/` |
| "Build a lesson plan / sub plan" | `lesson-plans/_context.md` → unit `_context.md` in `_courses/` | `research/`, `templates/` |
| "Improve the thinking prompts" | `prompts/_context.md` | everything else |
| "Research assessment / delivery" | `research/_context.md` | `worksheets/`, `tests-quizzes/` |
| "Make a template" | `templates/_context.md` | everything else |
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
| A PhysEd 5–6 material | `pew56-[unit]-[type]-v[N].md` | `pew56-invasion-games-exits-v1.md` |
| A PhysEd 7–9 material | `pew79-[unit]-[type]-v[N].md` | `pew79-fitness-program-template-v1.md` |
| A thinking prompt | `[topic]-prompt-v[N].md` | `metacognition-prompt-v2.md` |
| A research summary | `[topic]-research.md` | `formative-assessment-research.md` |
| A template | `[type]-template.md` | `worksheet-template.md` |

The `[N]` version number means you never overwrite — bump it when you revise significantly.

Files go in: `[type-folder]/[subject]/[unit]/filename.md`
Example: `notes-packages/grade-6-science/forces/sci6-forces-teachernotes-v1.md`

---

## What I always know about this project
- **Audience:** Students and teachers, Alberta curriculum context
- **Design standard:** Every artifact should be clean enough to print and hand out as-is
- **Research lens:** Assessment for learning, not just of learning — formative first, summative as confirmation
- **Evidence standard:** Before finalising any artifact, check it against `templates/evidence-design-principles.md` — every material built here must embed at least one Tier 1 strategy and pass the five-item checklist at the bottom of that file
- **Two hard rules:**
  1. Every test or quiz item must map to a specific learning outcome
  2. Every thinking prompt must ask students to show reasoning, not just recall a fact
