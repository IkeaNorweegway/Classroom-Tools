# STEAM — Grade 5 Year Plan
*Read alongside `steam/_context.md` (equipment map, unit archetype, evidence base), the STEAM progression research summary (planned, not yet written), and the design-thinking, graphic and web design research summary (planned, not yet written) (sketching/graphic design/web design progression — Grade 5 sits in that file's 5–6 band).*

---

## Year at a Glance — revised 2026-09

**~40 sessions, 2 hrs each, ~80 hours, 24 weeks.** Four units, ~10 sessions / ~20 hours each. Of each unit's ~20 hours, **~15 hours is scripted core instruction** (mapped session-by-session below); **the remaining ~5 hours is deliberate teacher buffer** — extra practice, a slower redesign cycle, a local guest/field connection, catch-up after an assembly or snow day. The buffer is not empty time to fill with more content; it is what keeps the 15-hour core from collapsing the first time a session runs long.

Primary platform: **Dash** (Unit 1 only this year). Units 2–4 deliberately step outside the robotics-ladder platforms — see the note below.

| Unit | Weeks | Sessions | Platform / mode | Constraint level | Capstone shape |
|---|---|---|---|---|---|
| 1. Dash Bot — Algorithms & Sensors | 1–6 | ~10 (15h core + 5h buffer) | Dash (Blockly app) + light micro:bit touch | Low–medium | Live class test |
| 2. The Slow Coaster | 7–12 | ~10 (15h core + 5h buffer) | Craft/construction only — no robot, no screen | Medium–high (competing constraints) | Design review + timed test |
| 3. Water Filter | 13–18 | ~10 (15h core + 5h buffer) | Low-tech physical build + simple water testing | Medium–high (budget + testing protocol) | Design review + tested redesign |
| 4. Capstone: Scratch Story | 19–24 | ~10 (15h core + 5h buffer) | Scratch (block coding, screen-based) | High | Public share-out, produced video |

**A note on platform continuity:** The course-level equipment map (`steam/_context.md`) treats Dash → micro:bit → Sphero → Spike Prime → REV as the coding-abstraction ladder running underneath every grade, and names micro:bit as a light Grade 5 introduction that Grade 6 then deepens. This year's four units — chosen for their specific content (mechanical build, water ecology, narrative coding) rather than to advance the platform ladder — only touch that ladder directly in Unit 1. To keep Grade 6 from opening on a platform students have never seen, **Unit 1 keeps a light micro:bit touch (button + LED display, ~1 session) folded in alongside Dash**, matching the original plan's scope. Unit 4 introduces **Scratch**, which is not on the course-level equipment map at all — it is a deliberate, screen-based, narrative-first coding environment chosen as this year's capstone, not a replacement for the robotics ladder. **Flag for the course owner:** confirm this is an intentional one-year departure from the ladder (fine — the four units below are strong on their own terms) rather than an oversight; if Scratch should also appear in later grades, that needs a decision at the course-context level, not just here.

---

## Unit 1 — Dash Bot: Algorithms & Sensors

**Goal:** Establish Dash and the CT vocabulary that recurs every year after this, then move from "the robot does what I told it" to "the robot responds to what it senses" — this unit folds the old Foundations + Sensors & Response pair into one 15-hour core.

**CT vocabulary introduced explicitly:** sequence, loop, conditional ("if this, then that"), sensor, input, output, debug. Name each term the first time it's used in an activity — don't let it stay implicit in the app's block shapes.

**Activities:**
- Navigate a taped-floor maze using only sequenced Blockly commands
- Repeat a shape/pattern using a loop instead of repeated blocks
- Make Dash respond differently depending on a simple condition (distance to an object, a sound cue)
- Program Dash to react to its built-in obstacle/proximity sensing
- Light micro:bit touch (parallel, not yet integrated with Dash): simple button/LED display projects — micro:bit's own first exposure, kept to ~1 session so Grade 6 can deepen it without re-teaching from zero

**Trainer:** `public/materials/steam5-dash-trainer-v1.html` is an on-screen Dash for practice alongside the notes — students drag blocks (drive, turn, beep, light, repeat, if/else) into a program that drives a robot on a grid. Its 14 checked steps follow Notes Parts 1–3 and Journal Parts A–D and send students back to paper at each one; a free-play step lets them build their own course. It does not cover Notes Part 4 (micro:bit), and it does not replace time on the real robots: its blocks and its sensor (a count of empty squares) are simpler than the Blockly app's.

**Construction/spatial tie-in:** One session on how Dash's wheels/gearing let it turn (a first, very light mechanism observation, not a build) — sets up the mechanism vocabulary Unit 2 builds on. Later in the unit, build a simple physical obstacle course (blocks, cardboard, tape) that requires spatial planning: where will Dash's sensor "see" an obstacle, and how much clearance does it need?

**Design & Media:** Before touching Dash, students sketch two different maze-path ideas on paper and pick the stronger one to build (a first, light exposure to "generate options before committing"). Before the live obstacle-course test, students draw a simple labeled map of the course, showing obstacles and Dash's needed clearance — this is the unit's dedicated non-robot art/design task. Neither is graded for artistic quality; both are planning tools.

**Culminating artifact:** Dash successfully completes a live run of the class-built obstacle course, responding to at least one sensed condition (not purely pre-programmed navigation), plus a short verbal explanation of what each block does and why it's there (the share-and-reflect step).

**Learning outcomes:**
- Students can sequence a set of instructions to complete a defined task.
- Students can identify where a loop would make a sequence more efficient and use one.
- Students can explain, in their own words, what a conditional statement is doing in a program they wrote.
- Students can distinguish a pre-planned (sequenced) response from a sensed (conditional) response, and predict, before testing, whether Dash's sensor will detect a given obstacle placement.
- Students can operate micro:bit's basic input (button) and output (LED display) independently.

**Misconception to watch:** Younger students frequently believe the robot "knows" or "decides" what to do. Correct this directly — everything Dash does traces to a specific instruction the student wrote. This is foundational for every later grade's debugging work.

---

## Unit 2 — The Slow Coaster: Mechanical Build, Planning & Sketching

**Goal:** First deliberate construction/mechanism unit, and the year's clean non-robot, non-screen unit. Students design and build a marble run with an inverted goal from a typical coaster: **make the marble take as long as possible to finish, without ever fully stopping.** Speed control — not speed — is the design target.

**Why "slow," not "fast":** A fast-coaster brief rewards a straight, steep drop and stops being interesting once gravity does the work. A slow-coaster brief forces students to think about *removing* energy on purpose — friction, redirection, obstacles — which is a richer and less obvious engineering problem for this age, and it is where the unit's key misconception lives.

**Engineering design cycle, named explicitly for the first time this year:** define → brainstorm → build → test → redesign → share.

**Core science/engineering ideas (taught just deep enough to use, not as a standalone lecture):** potential energy at the top of a ramp converts to motion (kinetic energy) as the marble descends; friction and collisions remove energy from the system, which is what slows the marble down; steeper sections speed the marble up, tighter turns and rougher or narrower channels slow it down. These ideas are introduced through short, hands-on material tests (a ramp with a smooth surface vs. a rough one; a straight run vs. one with turns) before students design anything — a taste-first sequence, not a lecture-first one.

**Constraint (introduced explicitly):** A fixed footprint and height limit, plus a minimum time target the marble must reach without stopping (e.g., "moving continuously for at least 20 seconds, without the class needing to nudge it"). This is a **competing constraint** — the marble must keep moving *and* move as slowly as possible — and it is meant to be discovered through testing, not explained in advance.

**Activities:** Quick material/friction tests before any building (compare surfaces, ramp angles, turn types); design and build the coaster in stages, testing and redesigning against the time target as sections are added; a structured design review before the final build.

**Design & Media:** Each pair sketches at least two genuinely different coaster concepts — not one — before choosing which to build. This unit's design-review artifact (sketch + material list) is treated as a **real drawn/rendered plan**, not a rough note — this is the unit where drafting skill is most directly on display, per the course-level Art & Media Strand. Don't show a single finished example coaster before students sketch their own concepts; if an example helps at all, show two or three visibly different ones. Before final builds, pairs present their design plan to another pair, who ask one clarifying question and flag one risk — the year's second peer design-critique step.

**Culminating artifact:** A working slow-coaster, timed with a stopwatch on a live run, plus the design review and a short reflection on what changed between the sketch and the built version.

**Learning outcomes:**
- Students can identify how ramp angle, surface friction, and turns each affect a marble's speed, and explain why using the language of energy (not just "it goes slower").
- Students can build a mechanism that meets a stated, competing time constraint (keeps moving, moves slowly).
- Students can complete one full pass of the design cycle — define, brainstorm, build, test, redesign — on a real object, and describe at least one specific change they made between test and redesign.

**Misconception to watch:** Students commonly believe the marble slows down on its own because it "runs out of energy," as if energy loss just happens rather than being something the design controls. Refute this directly with a contrast: a smooth, straight, low-friction run vs. a rough, turning one built with the same starting height — same starting energy, very different outcomes. The slowing is a *design choice* (friction, redirection), not an inevitability. A second, related misconception: "steeper is always better" — steeper increases speed at that section, which usually works against this unit's goal; let a too-steep first attempt fail the time test before correcting it.

---

## Unit 3 — Water Filter: Ecology, Testing & Iteration

**Goal:** This year's Build Challenge-shaped unit: real science content (water/ecology), a design-build-test-redesign cycle driven by data rather than a stopwatch, and a formal peer design review before the final build. No robot, no screen for the build itself — the design cycle and the evidence students collect are what's being assessed, not a platform.

**Brief:** "Design and build a low-tech water filter that removes visible particles from cloudy water, using only the materials on the supply list. Test your filter's output, compare it to your prediction, and redesign at least once based on what you find." (Adapt the exact cloudy-water mixture to what's on hand — sand/soil in water is a reliable, safe default.)

**Non-negotiable safety framing — teach before any building begins:** *Filtering water for clarity does not make it safe to drink.* This must be stated explicitly, more than once, and tested water is never tasted or drunk under any circumstance. This is the unit's central misconception (see below) and a real safety rule, not just a content point.

**Research component (before designing):** Students find and note one real fact about why water filtration matters — a local watershed, a filtration method used in water treatment, or a place in the world where clean water access is a real challenge. One simple source is enough at this age (a provided age-appropriate article/video, or a short teacher-led case). This is the unit's "container before engine" step: students should understand *why this matters* before they start layering sand and gravel.

**Activities:**
- Research mini-task (above), shared briefly as a class before designing
- Predict, then test: before building, students predict what a single material (e.g., sand alone) will do to cloudy water, then test it — a small productive-failure moment that sets up why *layering* materials works better than any one material alone
- Design and build a multi-layer filter (candidates: gravel, sand, cotton/cloth, charcoal, coffee filter — confirm actual supply list) inside a constrained container (e.g., a cut plastic bottle) within a materials budget
- Test filter output against a simple, consistent clarity measure (e.g., pour through and compare to a printed clarity chart, or time how long it takes for water to become visibly clear pouring past a printed line)
- Redesign at least once based on test results and re-test
- Log every test in an iteration table: what changed → what happened → what I'll try next

**Constraint (introduced explicitly):** A fixed materials budget/list (a maximum number of layers or a "points" cost per material) and a required testing protocol (every version must be tested the same way, so results are comparable).

**Design & Media:** Students draw a labeled cross-section diagram of their filter design, showing each layer and, in their own words, what job that layer is doing — this is the unit's dedicated non-robot art/design task, and it doubles as a planning tool before building. Before the final build, pairs present their design plan (cross-section sketch + material list) to another pair, who ask one clarifying question and flag one risk — the unit's design review, matching the Build Challenge archetype.

**Culminating artifact:** A working filter, at least one documented redesign with test data, and the labeled diagram — shared with the class through the design review and a live demonstration of the tested (and re-tested) filter, plus a short spoken reflection on what the data showed and what changed.

**Learning outcomes:**
- Students can explain, using their research, why water filtration matters beyond "so it looks clean."
- Students can design and build a physical filter that layers multiple materials for a stated purpose, and explain what each layer is for.
- Students can run a simple, consistent water-clarity test and record the result as data, not just an impression.
- Students can complete a full design cycle including at least one redesign driven by test data, and describe specifically what the data told them to change.
- Students can state, unprompted, why clear water is not the same as safe water.

**Misconception to watch (the central one this unit is built around):** *"Filtered water is safe to drink"* / *"clear water is clean water."* Refute this directly and early, before any building: show (or describe) that clarity only removes visible particles — it says nothing about invisible contaminants like bacteria, which is exactly why real water treatment uses more than one method (filtration plus disinfection) and why students never taste their test water. Anchor the correct idea with the vivid contrast: perfectly clear water can still be unsafe; the filter is solving one problem (clarity), not "making water safe."

---

## Unit 4 — Capstone: Scratch Story (Code, Character & Art)

**Goal:** The year's open-ended capstone — full design cycle, minimal guided steps, and the course-wide capstone video requirement. This is also the year's fullest integration of the Art & Media Strand: character design, narrative structure, and code are built as one deliverable, not layered on top of each other. It closes the year by showing students that the same CT vocabulary that drove a robot and a mechanical build also drives a story — coding and creative writing are not separate skill sets.

**Platform:** Scratch (free, browser-based block coding). New CT vocabulary beyond sequence/loop/conditional: **event** ("when this happens, do this"), **broadcast/message** (one sprite signals another, e.g. to change scenes).

**This is the first fully open brief of the sequence** — theme, genre, and characters are entirely student-chosen, with no teacher-assigned starting idea. Resist supplying a single correct story; different groups producing very different stories from the same brief is the goal, not a problem to correct.

**Constraint (introduced explicitly — the year's highest constraint level):** Every story must include **at least one moment where the story branches on a choice** (a simple "which of two paths" decision using an event), not just a single fixed sequence of scenes — a first, age-appropriate taste of non-linear structure. Stories must also be shared with a **real audience beyond the classroom** (another class, a family/school screening) — the external audience is the year's "real constraint," the same role a budget or material limit plays in other grades' capstones.

**Activities:**
- Brainstorm three different story ideas with a simple arc (beginning/problem/solution/end) before choosing one
- Storyboard the chosen story in 4–6 drawn boxes on paper before opening Scratch, including the branch point and both paths
- Design characters and backdrops on paper first — silhouette/shape sketches, not digital — before building them as sprites
- Build the story in Scratch: sequenced dialogue (speech bubbles), scene changes via broadcast, character movement/events, and the required branch point
- Test the story with a partner and fix at least one thing that didn't work as planned (a first, gentle debugging encounter in a narrative context)

**Design & Media:** Students generate three story concepts and at least two visibly different looks for their main character before committing to either (the "3+ concepts before refinement" rule, applied to both narrative and visual design in the same unit). **Never show a single finished example Scratch story before students storyboard their own** — show two or three visibly different finished stories if an example is needed at all, so students don't anchor on one plot or one art style. Light-touch peer share of the storyboard (not the finished code) happens before building: a partner reads the storyboard and answers "what do you think happens next?" — if their guess doesn't match the intended story, that's useful information before any code is written.

**Video (capstone share-and-reflect):** Students storyboard their share-out in 4–5 drawn boxes (their story idea, the character/backdrop design choices, the branch point, what changed during testing, the final story) before filming. The video is a short (60–90 second) phone/tablet recording — an adult can still operate the camera at this grade — in which the student narrates what their story does and why they made the design choices they did, including at least one change made between the storyboard and the finished version. This is the Grade 5 version of the course-wide capstone video requirement; a live demo/play-through with the class or the external audience can run alongside it if there's time, but the video is the required artifact.

**Culminating artifact + share-out:** A working, multi-scene interactive Scratch story with a branch point and original character/backdrop art, the produced video, and a screening for a real audience beyond the classroom — plus a short reflection (what changed between the storyboard and the finished version, what they'd try with one more iteration). This is the share-and-reflect step and should not be cut for time.

**Learning outcomes:**
- Students can independently run a full design cycle on an open-ended brief with a stated real-world constraint (the branch point and the external audience).
- Students can sequence a program using events and broadcasts, including a branch point, to tell a story in a controlled but non-linear order.
- Students can explain a specific design decision behind their character or scene appearance (not just describe what it looks like).
- Students can identify and fix at least one thing in their program that didn't run the way they intended.
- Students can describe, in their own words, how the vocabulary from Units 1–3 (sequence, loop, conditional, design cycle) shows up in a Scratch story as well as in a robot program or a physical build.
- Students can explain design decisions and iterations to an audience outside the classroom, not just complete the build.

**Misconception to watch:** Students often treat coding and creative/artistic work as unrelated — "coding is the math part, art is the fun part." Name this directly and counter it with the vocabulary connection above: the same sequence/loop/conditional structure that moved Dash through a maze and controlled the coaster's design cycle is what moves this story from scene to scene. A second, narrower misconception worth watching: some students think a good story just needs "more stuff happening" — more sprites, more effects — rather than a clear beginning/problem/solution arc; the storyboard step exists specifically to catch this before it's built into code.

---

## Materials Needed

- Dash robots (class set or shared rotation) + tablets/devices running the Blockly app (Unit 1)
- micro:bit boards (class set), USB cables or Bluetooth pairing setup (Unit 1, light touch)
- Marble-run/coaster materials: cardboard, foam pipe insulation or track material, tape, dowels, cups/funnels, marbles, stopwatch (Unit 2)
- Craft/recycled construction materials generally: cardboard, dowels, wheels/axles, tape, elastic bands, simple fasteners
- Basic hand tools appropriate for this age (safety scissors, hole punches — **flagged open item:** hand-tool safety procedures not yet written, needed before Unit 2)
- Floor tape or floor markers for Unit 1's maze/obstacle course layout
- Water filter supplies: clear cups/cut bottles, gravel, sand, cotton balls/cloth, coffee filters, activated charcoal (confirm supplier), a consistent cloudy-water source (soil/sand in water), a printed clarity comparison chart or timer for the test protocol (Unit 3)
- Devices with browser access to Scratch (Unit 4) — confirm accounts/offline-editor needs before the unit starts
- Blank paper/sketchbooks for the weekly sketch/diagram/storyboard tasks across all four units (not a workbook — loose paper is fine at this age, though the project workbook below also carries dedicated sketch pages)
- A phone or tablet with a camera for the Unit 4 video (teacher- or parent-operated; no editing software needed this grade), plus a plan for the external-audience screening (another class, a family/school session)

**3D printer (MakerBot Sketch):** not used hands-on by students this grade — reserved for Grade 6, per the concrete-before-abstract sequencing this whole plan is built on.

---

## Sets Up for Grade 6

Students should leave Grade 5 fluent in the words *sequence, loop, conditional, sensor, input, output, debug*; comfortable with one full design-cycle pass repeated across three different contexts (mechanical, ecological/testing, and digital/narrative); and able to name at least one specific redesign they made based on test evidence, not just "it worked better." They should have practiced generating multiple concepts (sketch or story) before choosing one at least three times this year (Units 1, 2, and 4), used micro:bit's basic input/output at least once, and made and narrated one short video for a real audience beyond the classroom. Grade 6 assumes this vocabulary and these habits are already established and reuses them without re-teaching from zero.

**Flag for Grade 6 planning:** Grade 6's existing plan opens by *deepening* micro:bit (not introducing it) and treats Sphero as new. That still holds — Unit 1's light micro:bit touch above is enough for Grade 6 to build on. Grade 6's plan does not currently assume Scratch, the slow-coaster mechanism vocabulary, or the water-testing/research skills from this revised Grade 5 sequence — none of these break anything in Grade 6 as written, but if Grade 6 is ever revised, it could deliberately call back to any of the three (e.g., a Scratch-to-Sphero-JavaScript bridge, or reusing the iteration-table format from Unit 3) rather than starting cold.
