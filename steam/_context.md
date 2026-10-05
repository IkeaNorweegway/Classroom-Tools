# STEAM, Grades 5–9 — Course Context
*Read alongside `_meta-context.md`, `research/steam-progression-research.md` (coding, robotics, spatial reasoning, engineering design cycle), and `research/design-thinking-graphic-web-research.md` (sketching, graphic design, web design/UX, design-thinking process — the evidence base for the Art & Media Strand below).*

---

## Course Overview

**Grades:** 5–9, one year plan per grade, same course shell across all five years
**Schedule:** 2-hour session every 3 days
**Year length:** 24 weeks

**Session count assumption (state this before using the plans):** "Every 3 days" is read here as roughly 1.6–1.7 sessions per week on a 5-day school week, which gives **~40 sessions per year, 2 hours each, ~80 instructional hours per grade.** If the actual rotation (e.g., a lettered-day timetable) produces a different count, the unit weightings below scale proportionally — the ratio between units matters more than the absolute session count. Flag this to me if the real number is meaningfully different (e.g., under 32 or over 48 sessions) and the per-grade plans should be re-paced.

**Audience:** Students and teachers. This is a supplementary program, not a mandated Alberta strand — see the Alberta angle in the research file. Materials should still be print/deliver-ready for any teacher picking up the sequence.

---

## Evidence Foundation

Every structural decision in this course traces to `research/steam-progression-research.md`. Read it for the full "why." The short version, restated as course rules:

1. **Concrete before abstract, faded one step per grade band** — not skipped, not held onto too long.
2. **All five strands run every unit, every year** — coding, robotics, spatial/construction, art/design, and the engineering design cycle are never taught as separate terms.
3. **The design cycle recurs with escalating constraints**, not as a one-off unit.
4. **At least one open-ended task per unit**, even in Grade 5 — guided-build only produces instruction-followers.
5. **Every unit ends with a share-and-reflect step** — the artifact is not the finish line, explaining it is. Capstone units (Unit 4) end with a produced video, not just a live demo — see Art & Media Strand below.
6. **Never show a single finished example before students attempt their own design.** A worked example is fine for coding/robotics logic, but for anything visual/creative (a layout, a logo, a mockup) one example measurably narrows what students generate (design fixation) — show several deliberately different examples, or withhold the example until after a first independent attempt.
7. **Require multiple concepts before refinement.** "Sketch one idea, get feedback, revise it" produces weaker, less confident designers than "generate 3+ distinct concepts, then get feedback on all of them before choosing one to develop." This applies to any visual/design deliverable — a logo, a poster layout, a webpage wireframe, even a robot attachment's form factor.

**On the name "STEAM":** this is not STEM with robots bolted on. The A is a required strand with its own dedicated tasks, not a paint job applied to robotics builds. See the Art & Media Strand section below — every unit needs at least one task that does not involve a robot at all.

---

## Equipment Map

*Revised 2026-09 to match the teacher-dictated Grade 5–9 unit plans.* This redesign is less a single continuous hardware ladder than three parallel threads running at different paces: a **circuits/robotics thread** (Dash → littleBits → micro:bit/Spike Prime → soldering+motor → REV), a **narrative/game-coding thread** (Scratch, recurring non-adjacent grades), and a **digital fabrication thread** (Tinkercad/3D printing, recurring most grades). A grade's "primary platform" is still new each year; what changed is that not every platform returns in a later grade the way the original ladder assumed — see the flags in Open Items below (Sphero dropped entirely, REV narrowed to one light unit).

| Platform | Native coding mode | Strongest use | Primary grade | Returns in |
|---|---|---|---|---|
| **Dash (Wonder Workshop)** | Blockly app, very tangible | First exposure to sequence/loop/conditional; low floor for reluctant starters | Grade 5 | — (retired after Grade 5; concepts carry forward) |
| **littleBits** | Bitsnap modules + littleBits app (visual logic, no text code) | Concrete, hands-on computational thinking and circuits — sequence/conditional logic built in physical hardware (sensors, simple actuators), optionally shaped into a game or a simple instrument | Grade 6 (intro, Unit 1) | — (one-year exposure; circuit/sensor concepts carry forward into micro:bit and Spike Prime sensor work) |
| **micro:bit** | MakeCode blocks → MakeCode Python | Physical computing, sensors (accelerometer, light, radio), wearables/inventions | Grade 5 (intro: button/LED), Grade 7 (thermodynamic sensor box: light + temperature) | — (two light, non-adjacent touches in this redesign, not a continuous thread) |
| **Scratch** | Block coding, event-based | Narrative and game logic — branching, events/broadcasts, scene/state changes; the sequence's dedicated narrative-coding thread, run separately from the robotics ladder | Grade 5 (capstone: branching story) | Grade 7 (Unit 3: choose-your-own-adventure story/game), Grade 8 (Unit 2: platform game) |
| **LEGO Spike Prime** | Word Blocks → Python | Build + code integration; motors, multiple sensors, mechanical design | Grade 7 (intro, Word Blocks) | Grade 8, as the capstone platform (sensors, mazes, student-designed challenges) — does not continue into Grade 9 in this redesign |
| **Soldering & basic circuits (5V-class DC motor)** | N/A — physical/electrical skill | First time students wire and power a mechanism themselves (not a pre-built robot motor), paired with mechanical-advantage/simple-machine content | Grade 8 (Unit 3) | — |
| **REV DUO (confirmed 2026-09 — competition-grade FTC hardware: Control Hub/Driver Hub, NEO brushless motors, SPARK MAX controllers, Smart Robot Servo)** | FTC SDK — **Java** (OnBot Java / Android Studio) or Blockly-for-Java | Competition-grade construction, structural rigor, real mechanical constraints; REV publishes its own ready-to-teach classroom curriculum (semester-long, 50+ hrs) worth drawing the Unit 2 tutorial from | Grade 9 (Unit 2, tutorial-based intro) | — (a single, lighter-touch unit in this redesign — no longer a two-year intro-then-capstone arc, and it no longer appears in Grade 8 at all; see Open Items) |
| **Wood shop / hand & power tools** | N/A | Larger-scale, tool-intensive builds requiring real shop access and supervision — a CO2 dragster carved in the wood shop, and a ~1m-tall trebuchet | Grade 7 (capstone: CO2 cars) | Grade 9 (capstone: trebuchet, at greater scale and with more independent tool use) |
| **Basic maker/construction materials** (cardboard, simple mechanisms, craft/recycled materials, hand tools) | N/A — physical only | Spatial reasoning, mechanism literacy (gears, levers, linkages, load-bearing structures) *before* motorizing or powering them — anchored this redesign by bridges (Grade 6), gliders (Grade 6 capstone), a class-wide Rube Goldberg apparatus (Grade 8), and the trebuchet (Grade 9 capstone) | Every grade, every unit | Every grade |
| **3D printers (MakerBot Sketch)**, paired with a CAD tool (assumed: Tinkercad — free, browser-based, the standard classroom pairing for this printer; confirm if something else is set up) | Not coding — digital design/fabrication | Turns the Build Challenge / Capstone design cycle into a real design-print-test-redesign loop instead of a one-shot craft build | Grade 6 (intro: a printed bag tag, paired with a portfolio/website/slideshow deliverable), Grade 8 (pegboard-mounted Rube Goldberg components), Grade 9 (electrified miniatures: enclosures, mounts) | Every grade from 6 onward except Grade 7 in this redesign |
| **Java or Python (general-purpose) — language decision not yet finalized** | Java or Python, via tutorials (both built out in full — see Grade 9's file) | Text-code fundamentals taught on their own terms — a simple game (tic-tac-toe or Minesweeper) — before being applied to REV DUO's hardware API in Unit 2. Choosing **Java** means Grade 9 runs one consistent language all year (matching REV DUO's own native environment); choosing **Python** means Unit 2 opens with a real, explicitly-named language-transfer moment instead | Grade 9 (Unit 1, precedes the REV intro) | — |

**Reading the table as three threads instead of one ladder:** Dash → littleBits → micro:bit/Spike Prime blocks → soldering+motor circuits → REV tutorial carries the concrete-to-abstract *hardware* fade. Scratch (Grade 5 → 7 → 8) carries the narrative-coding fade independently. Tinkercad/3D printing (Grade 6 → 8 → 9) carries the digital-fabrication fade independently. No single grade should jump more than one rung on any *one* thread, but the threads no longer have to advance in lockstep with each other the way the original single-ladder design assumed.

---

## Art & Media Strand

The equipment map above is a coding/robotics ladder because that's what needs platform sequencing across five years. Art doesn't need new hardware to fade in the same way — it needs a standing requirement that keeps it from being displaced by whichever robot is newest, plus its own concrete-to-abstract fade for sketching, graphic design, and web design/UX specifically. This section covers four rules; the evidence for all of them is in `research/design-thinking-graphic-web-research.md`.

**1. Every unit needs at least one dedicated non-robot art/design task.** Not aesthetics applied to a robot build (a nicer paint job on the Dash attachment doesn't count) — a task where the deliverable is a drawing, a physical model, a diagram, a storyboard, or another visual/design artifact that stands on its own, produced with no robot involved. This sits alongside the "at least one open-ended task per unit" rule (Cross-Cutting Rules, below) — the two can be the same task but don't have to be. Concrete anchors for this task by unit:
   - **Unit 1 (Foundations):** a sketch/diagram task — e.g., students draw and label the program flow they're about to build, or sketch the object/character a robot behavior represents, before touching a device.
   - **Unit 2 (Sensors & Response):** a visual model of the environment the robot responds to — a labeled map, diagram, or scale drawing of the obstacle course/test environment, made before the live test.
   - **Unit 3 (Build Challenge):** the design-review artifact (sketch + material list, already required) counts, but should be treated as a real drawn/rendered plan, not a rough note — this is the unit where drafting skill is most directly on display.
   - **Unit 4 (Capstone):** the video itself (see rule 2) is the primary art/media deliverable for this unit — storyboarding and shooting/narrating it is design work, not paperwork tacked onto the end.

**2. Every grade's Unit 4 (Capstone) ends with a produced video, not a live-only demo.** Video documentation — storyboard, planning, filming or screen-capturing the build/program in action, and narrating the design decisions and iteration history — replaces (or, where a live audience is also available, supplements) the verbal-only share-and-reflect used in Units 1–3. This is deliberate scope: Units 1–3 stay lighter-touch (live demo, verbal reflection) so the video doesn't become routine busywork; it's reserved for the moment in the unit cycle where there's a real design story worth documenting. Video complexity should fade the same way coding mode does — a Grade 5 video can be a simple phone/tablet recording with a spoken narration; by Grade 9, students should be handling their own shot planning, editing, and narration with minimal scaffolding. This detail (equipment, software, exact expectations per grade) still needs to be built into each grade's Unit 4 section — flagged in Open Items below.

**3. Sketching, graphic design, and web design/UX each fade their own concrete-to-abstract scaffold, the same shape as the coding-abstraction ladder in the Equipment Map.** These three run *inside* the same engineering-design-cycle units already scheduled (as the "define the problem visually" and "communicate the solution" steps), not as a separate bolt-on unit. Web design/UX has the thinnest age-specific evidence of the three — keep Grade 9 ambitions there modest (usable and accessible, not polished) rather than building it out to match the coding/robotics strand's depth.

| Grade band | Sketching | Graphic design | Web design / UX |
|---|---|---|---|
| **5–6** | Daily/weekly rough sketching as externalization, not graded for artistic quality — observational drawing (draw the mechanism you built, draw your robot's planned path) paired with explicit technique (proportion checks, redrawing from a second angle) | Physical-first: paper collage/cut-paper layout exercises teaching grid, hierarchy, contrast before any software; vocabulary named explicitly, same as CT vocabulary | Paper-prototype only: sketch a screen/app idea on paper, walk a peer through it, peer "clicks" by pointing — the concept of a user flow before any digital tool exists |
| **7–8** | Sketching becomes the default "propose a solution" step for every unit, including non-visual ones (sketch a code's logic flow, sketch a sensor layout) | Simple software introduced, but grid/hierarchy/contrast taught on paper first, then transferred to software; first structured peer critique step | Low-fidelity digital wireframing tool; first explicit "who is this for and what do they need" user-need framing exercise before building |
| **9** | Professional-style communication: annotated concept sketches presented to justify a design decision, not just generate one | Independent application of design principles to a real deliverable, with a rubric naming grid, hierarchy, contrast, and type as criteria | A real, simple website/app-mockup applying basic accessibility/user-centered principles (contrast for readability, clear navigation) — usable and accessible is the bar, not professional-grade |

**4. Structured critique is a scheduled step, not an optional add-on.** A peer-critique protocol with specific prompts ("what is this trying to do," "where does it succeed," "where would a first-time user get confused") — not open-ended "what do you think" — should recur for every graphic/web design task from Grade 7 onward, and can be introduced more lightly in Grades 5–6. This is what actually drives iteration quality; see Cross-Cutting Rules for the multiple-concepts and no-single-example rules that pair with it.

**Digital fabrication note — this changes pacing, not just materials:** A print job takes anywhere from 30 minutes to several hours depending on the part. No unit can plan a "design it, print it, test it" loop inside a single 2-hour session. Every unit that uses the printer needs at least one session's worth of buffer between "design finalized" and "part in hand" — plan print queues to run overnight or between sessions, and give students a non-printing task (documentation, the next design iteration on paper, another part of the build) to do while a print is running rather than having them wait on it. With one (or a small number of) MakerBot Sketch units and a full class needing parts, queuing is the real constraint — stagger print submissions across the unit rather than expecting everyone's part on the same day.

---

## Unit Archetype (same shape, every grade, every year)

Each grade's year is four units of ~10 sessions (~20 hours, ~6 weeks) each. The unit *shape* stays constant so students recognize the pattern by Grade 7 and can run it with less scaffolding — what changes year to year is the platform, the constraint complexity, and how much of the process the student initiates independently.

| Unit | Focus | Constraint level | Coding mode | Ends with |
|---|---|---|---|---|
| **1. Foundations** | Re-establish/introduce this year's primary platform; name the CT vocabulary explicitly (sequence, loop, conditional, variable, debug) even if it was used last year | Low — single clear goal, materials given | Most concrete mode available for the grade | A working artifact + share-and-reflect |
| **2. Sensors & Response** | Programming against the physical world — line-following, obstacle response, light/sound/motion triggers | Medium — a stated environment the robot must respond to | Same as Unit 1, pushed slightly further | A robot/program that reacts correctly to a live test the class runs together |
| **3. Build Challenge** | Construction- and spatial-reasoning-heavy; mechanism literacy (gears, levers, linkages) tied to the platform's actuators | Medium-high — competing constraints (e.g., speed vs. stability, weight limit) | Coding is present but secondary to the mechanical design | A design review — peers critique against the stated constraints before final build |
| **4. Capstone Design Challenge** | Open-ended brief, multiple valid solutions, full design cycle run with minimal prompting | High — real external constraint (budget, material limit, or a rubric modeled on the HS target) | The most abstract mode this grade has reached | Public share-out + documented iteration history, captured as a produced video |

This table is the *shape*; the grade files below fill in the platform, the specific brief, and the LOs.

---

## Grade-by-Grade Summary

*Revised 2026-09 to match the teacher-dictated unit plans — note this is no longer a single continuous robotics-competition arc culminating in Grade 9 (see the REV note in Open Items).*

| Grade | Primary platform | Coding mode reached | Construction focus | Capstone shape |
|---|---|---|---|---|
| [Grade 5](grade-5/_context.md) | Dash + micro:bit (intro) | Blockly (Dash), MakeCode blocks (micro:bit), Scratch (capstone) | Simple mechanisms: levers, wheels; low-tech water filter | Scratch branching story, produced video, real audience |
| [Grade 6](grade-6/_context.md) | littleBits (intro) + 3D printing/Tinkercad | littleBits visual logic, Tinkercad | Bridges & structures (load-bearing spans, budget-constrained) | Balsa/paper glider build — research + presentation |
| [Grade 7](grade-7/_context.md) | LEGO Spike Prime (intro) + micro:bit (thermodynamics) | Spike Prime Word Blocks, Scratch (Unit 3 choose-your-own-adventure) | Insulated/light-control micro:bit box; wood-shop construction begins | CO2 dragster build + timed race, wood shop |
| [Grade 8](grade-8/_context.md) | 3D printing/pegboard (Rube Goldberg) + Spike Prime (capstone) | Scratch (Unit 2 platform game), soldering + basic 5V motor circuits | Class-wide collaborative Rube Goldberg apparatus (must mesh with neighboring groups' builds); mechanical advantage with a powered motor | Spike Prime sensor-maze challenge, student-designed for peers |
| [Grade 9](grade-9/_context.md) | Java or Python — decision pending (Unit 1) + REV DUO (Unit 2, tutorial intro) | Java or Python, then REV's FTC SDK/Blockly-for-Java either way | Electrified-miniature dioramas (Tinkercad/3D print/lights/sensors/simple motion); ~1m wood-shop trebuchet | Trebuchet capstone — mechanical advantage, prototyping, tool skills, process-photo video |

---

## Cross-Cutting Rules for Anyone Building Lessons/Units From This Plan

- **Never let a unit become "coding week" then "building week."** Every unit session should touch both, even if the ratio shifts (Unit 3 leans construction-heavy, but the platform's code should still run something by the end of the unit).
- **Not everything needs to be done on a robot.** Every unit needs its dedicated non-robot art/design task (see Art & Media Strand, above) — check for it explicitly before finalizing a unit; it's easy to let robotics crowd it out.
- **Name the CT vocabulary out loud at first use each year**, even if it's a repeat from a prior grade. Bers's finding that naming beats incidental exposure applies at every grade, not just the youngest.
- **At least one task per unit has more than one correct answer.** If a unit's session plan is 100% "follow these build steps," add or swap in an open task before finalizing it.
- **The share-and-reflect step is not optional and is not "if there's time."** Build it into the session count for the last day of every unit. For Unit 4 (Capstone), this includes video production time — see Art & Media Strand.
- **Escalate one constraint dimension at a time.** Don't introduce a budget limit and a new platform and a new sensor type in the same unit — pick the one escalation this unit is teaching.
- **For any visual/design deliverable, require 3+ concepts before refinement and never lead with a single finished example.** Both are named explicitly in Evidence Foundation (rules 6–7) because they're easy to skip under time pressure — showing one polished exemplar and asking for "one good idea" feels efficient but produces measurably narrower, weaker student work than the research supports.
- **Structured critique is scheduled, not optional, for graphic/web design tasks from Grade 7 onward** (lighter-touch in 5–6). Use specific prompts, not open-ended "what do you think" — see Art & Media Strand, rule 4.

---

## Open Items

- Rubric design for the open-ended build/capstone tasks is not yet built — flagged in the research file as a separate need. Build this before the Grade 5 Unit 4 capstone is delivered.
- ~~The Art & Media Strand and Capstone video requirement are new — none of the 5 grade-year files have been revised to reflect them yet.~~ **Done.** All 5 grade files (5–9) now name the per-unit art/design task, the sketching/graphic-design/web-design content for that grade band, and the Unit 4 video spec.
- Video equipment/software is not yet confirmed (tablets already on hand for the coding apps may suffice for recording, but editing tool — if any — is unconfirmed). Confirm before Grade 8–9 sessions run, where student-led editing is assumed.
- **Graphic design and wireframing/web-building tools are named as open choices inside the Grade 7, 8, and 9 files** (a free graphic design tool, a low-fidelity wireframing tool for Grade 7, a simple website-builder for Grades 8–9) — confirm what's actually available/licensed before those specific sessions are run; paper-first activities in every grade don't depend on this.
- **A structured peer-critique protocol (specific prompts, timing, norms) hasn't been drafted yet.** The research supports having *a* protocol from Grade 7 onward; the actual prompts/format for this workspace still need to be written — flagged in `research/design-thinking-graphic-web-research.md`'s open questions.
- Graphic design and web design software/tools for Grades 7–9 are not yet chosen (paper-first is specified for Grades 5–6, so this only blocks the 7–9 unit builds) — confirm what's free/available before writing those sections.
- Rubric design for graphic/web/interface design work is a separate, uncovered gap from the build/robotics rubric gap above — both are needed before assessment materials for this course are built.
- **Confirm the CAD tool paired with MakerBot Sketch.** Plans below assume Tinkercad (the standard free classroom pairing) — correct this if the school has set up a different design tool.
- Safety/tool-use procedures for hand tools in the construction strand (Grade 5+) are not yet written — needed before Unit 3 of any grade is delivered to students.
- **3D printer capacity is not yet known** (how many MakerBot Sketch units, typical print time for a class-sized part). The grade plans below assume queuing/staggering is needed; confirm actual capacity so Grade 7–9 Build Challenge/Capstone units can be paced against a real number of parts-per-week rather than an assumption — this now matters more than before, since Grade 6, 8, and 9 all print (Grade 8's Rube Goldberg in particular has every group printing pegboard-mounted parts in the same window).

### New flags from the 2026-09 Grade 6–9 redesign

- **Sphero no longer appears anywhere in the Grade 5–9 sequence.** It was the Grade 6 primary / Grade 7 text-transition / Grade 8 fast-prototyping platform in the original ladder; none of the newly dictated units for any grade use it. Confirm this is an intentional drop (equipment sits unused going forward) rather than an oversight, before finalizing purchasing/inventory plans.
- **REV's role has narrowed sharply.** Originally a two-year arc — Grade 8 intro, Grade 9 capstone, the platform the whole sequence's "HS-readiness" framing was built around. In the redesign it's a single tutorial-based introduction in Grade 9 Unit 2, confirmed as genuine competition-grade FTC hardware (REV DUO — Control Hub/Driver Hub, NEO motors, SPARK MAX, Smart Robot Servo; coded in Java/Blockly-for-Java via the FTC SDK, not Python). Grade 9's capstone is now a non-robot trebuchet build, not a REV project. Confirm this lighter, later REV exposure is the intended level of depth — it changes what "HS-readiness" means for this sequence (mechanical-advantage/tool-skills readiness now carries at least as much weight as robotics-competition readiness).
- **Soldering is new to the sequence** (Grade 8 Unit 3, wiring a 5V-class DC motor) with no existing safety protocol. Needs a written soldering safety procedure (ventilation, iron handling, burn safety, adult supervision ratio) before that unit is delivered — a distinct, more serious item than the general hand-tool safety gap above.
- **Wood shop access is new to the sequence** (Grade 7's CO2 dragster capstone, Grade 9's ~1m trebuchet capstone). Confirm shop access, tool training, and supervision ratios before either capstone is delivered — this is a step up in risk from the "safety scissors" hand-tool assumption the rest of the sequence uses.
- **littleBits (Grade 6 Unit 1) is new to the equipment map.** Confirm kit size/inventory and whether it supports the optional game-or-instrument physical build direction before that unit is built out in detail.
- **Grade 8 Unit 1's Rube Goldberg apparatus is structurally different from every other unit in the sequence: it's one shared class build, not independent per-group builds.** Every other unit's constraint set is internal to a group; here, each group's apparatus must physically interface with its neighbors', which means groups can't finalize their own design in isolation — hand-off points (height, timing, trigger mechanism) need to be agreed and locked before groups build to them. This needs a coordination protocol (a shared spec for hand-off points, and a session sequence that gets neighboring groups agreeing on interfaces early) that no other unit's design-review step currently covers — flag for whoever builds out Grade 8 Unit 1 in full.
