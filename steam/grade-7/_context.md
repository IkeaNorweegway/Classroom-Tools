# STEAM — Grade 7 Year Plan
*Read alongside `steam/_context.md` (equipment map, unit archetype, evidence base — revised 2026-09), `research/steam-progression-research.md`, and `research/design-thinking-graphic-web-research.md` (Grade 7 moves into that file's 7–8 band: software tools introduced paper-first, first formal critique protocol). Assumes Grade 6's circuit-level CT vocabulary (littleBits), a first CAD/3D-print pass, load-bearing structural reasoning, and one research-based presentation — but not a robot platform, since Grade 6 didn't use one.*

---

## Year at a Glance — revised 2026-09

**~40 sessions, 2 hrs each, ~80 hours, 24 weeks.** Primary platforms: **LEGO Spike Prime** (Unit 1 intro), **micro:bit** (Unit 2, reintroduced after Grade 6's gap, now with a thermodynamics lens), **Scratch** (Unit 3, its second appearance), and **wood shop** (Unit 4 capstone — new to the sequence).

| Unit | Weeks | Sessions | Platform / focus | Constraint level | Capstone shape |
|---|---|---|---|---|---|
| 1. Spike Prime: Foundations & Computational Thinking | 1–6 | ~10 | Spike Prime Word Blocks | Low | Working artifact + share |
| 2. micro:bit Thermodynamics Box | 7–12 | ~10 | micro:bit temperature/light sensors | Medium | Live class test |
| 3. Choose Your Own Adventure (Scratch) | 13–18 | ~10 | Scratch, branching logic | Medium–high (branching structure) | Peer playtest + share |
| 4. Capstone: CO2 Dragster | 19–24 | ~10 | Wood shop, aerodynamics, propulsion | High | Timed race, public share-out, video |

**A note on continuity:** because Grade 6 didn't use a robot platform at all (littleBits, 3D printing, bridges, and flight instead), Unit 1 below re-establishes robot-specific CT application after a full year's gap — it treats the CT vocabulary (sequence, loop, conditional, variable) as already known from non-robot contexts (Dash, Scratch, littleBits), and its job is cross-modality transfer to a build+code platform, not fresh teaching.

---

## Unit 1 — Spike Prime: Foundations & Computational Thinking

**Goal:** Establish Spike Prime as this year's build-and-code platform, explicitly transferring CT vocabulary already known from non-robot tools (littleBits' circuits, Scratch's blocks, Dash's Blockly) into a build+code context after a one-year robot gap.

**CT vocabulary:** sequence, loop, conditional, variable — explicitly re-named in Spike Prime's Word Blocks the first time each appears ("this loop block is the same idea as littleBits' pulse bit and Scratch's repeat block — same concept, new tool"). This deliberate cross-modality naming (circuit → screen block → robot block) is a stronger transfer move than a same-modality repeat, and is unique to this year's sequencing.

**Activities:** A guided first build (a basic driving base); program sequenced movement, then a loop-based repeated path, then a simple conditional response using a built-in sensor (color or distance) before Unit 2 goes deeper on sensors.

**Design & Media:** Students sketch their planned driving path/behavior before programming it — a lighter version of the established "sketch before build" habit, applied here to a program rather than a physical object, since the build itself is guided and isn't yet where design choice lives.

**Culminating artifact:** A working Spike Prime driving base programmed with at least one loop and one conditional.

**Learning outcomes:**
- Students can assemble a guided Spike Prime build and verify it functions correctly.
- Students can transfer the sequence/loop/conditional vocabulary from a non-robot tool to a build-and-code robot platform.
- Students can use a variable to control a robot behavior (speed, distance) and predict the effect of changing it before testing.

**Misconception to watch:** After a year away from robotics, students may treat this as "starting over" rather than recognizing the CT concepts as already familiar in a new modality. Name the transfer explicitly and often in this unit specifically, because of the one-year robot gap.

---

## Unit 2 — micro:bit Thermodynamics Box

**Goal:** Reintroduce micro:bit (after Grade 6's gap) inside a genuine science context — thermal insulation and/or light control — pairing physical computing with a real heat/light unit rather than teaching micro:bit skills in isolation.

**Core science ideas:** heat transfer (conduction, convection, radiation) at an age-appropriate level; what makes a material a good insulator (air pockets, material type) versus a poor one; for the light-control branch, how opacity/reflectivity/gaps affect how much light enters an enclosed space — introduced through quick comparative tests (two small boxes, different insulating materials, temperature change over time) before students design their own box.

**Brief (two variants — teacher or student choice, or split the class):**
- **(A) Insulation challenge:** design a box that keeps a micro:bit-monitored space as close to a stable/cool temperature as possible despite an external heat source, using the temperature sensor to log readings over time.
- **(B) Light challenge:** design a box that admits a stated target amount of light — a specific narrow range, not fully dark or fully open — into an enclosed space, using the light sensor to measure and tune the result.

Both variants share the same underlying skill (build an enclosure to hit a sensor-measured target), so a mixed-choice class still shares a common design-review vocabulary.

**Constraint (introduced explicitly):** A materials budget for insulation/shielding materials, plus a required data-logging protocol (readings at consistent intervals, so results are comparable across redesigns) — directly reuses Grade 5 Unit 3's iteration-table pattern (what changed → what happened → what I'll try next), now applied to a new science domain.

**Activities:** Quick comparative material tests before designing; reintroduce micro:bit basics briefly (a year has passed) before extending into the temperature/light sensor specifically; design and build the enclosure; log sensor data over a stated test period; redesign at least once based on the data and re-test. Design review: peers examine the data log and predict whether a proposed redesign will actually improve the result, before the retest happens.

**Design & Media:** Students draw a labeled cross-section of their box showing each material layer and its purpose — echoing Grade 5 Unit 3's filter cross-section, now applied to heat/light instead of water. This is the unit's dedicated non-robot art/design task.

**Culminating artifact:** A tested enclosure with logged sensor data across at least one redesign, the labeled cross-section diagram, and a short explanation of what the data showed and what specifically was changed.

**Learning outcomes:**
- Students can explain how a chosen material or design feature affects heat transfer or light transmission, using correct vocabulary.
- Students can use micro:bit's temperature or light sensor to log data over time and interpret the resulting trend.
- Students can complete a full design cycle including a data-driven redesign, and explain specifically what the data told them to change.

**Misconception to watch:** Students often think "thicker automatically means better insulation" without accounting for material type or air gaps, or (light variant) that "more material always blocks more light" without accounting for gaps/reflectivity. Let a data-contradicted prediction surface this rather than pre-correcting it, consistent with this sequence's established "test reveals the misconception" pattern.

---

## Unit 3 — Choose Your Own Adventure (Scratch)

**Goal:** Scratch's second appearance in the sequence (after Grade 5's capstone story), now applied to a choose-your-own-adventure story or game — deepens the branching/event logic Grade 5 only lightly introduced. Where Grade 5 required a single branch point, branching *is* this unit's core mechanic.

**CT vocabulary:** Builds directly on Grade 5's event/broadcast vocabulary. Introduces multiple, nested branches, and the idea of tracking state — a variable that remembers a choice made earlier and affects a later scene — a genuinely new CT concept (a variable used for narrative memory, not just a numeric setting).

**Activities:**
- Map the branching structure on paper first — a flowchart/tree diagram showing every path, choice point, and ending — before opening Scratch. This is a real information-design task: legibility matters because the group has to build against their own diagram.
- Build the CYOA in Scratch: multiple branch points, at least one instance of an early choice affecting a later scene (via a variable), and a defined set of endings.
- **Format choice:** a narrative story or a simple game (student/group choice) — both use the same branching-logic core skill.
- Structured peer playtest: a partner plays through the CYOA and reports which path they took and whether any branch felt broken or dead-ended — the sequence's first true playtest (distinct from a design-review sketch-check), because a branching program can only really be verified by someone else navigating it.

**Constraint (introduced explicitly — a new kind of constraint for the sequence):** Every path must reach a real, distinct ending — no dead ends, no path that silently loops forever — and the structure must include at least one instance of an earlier choice affecting a later outcome. This is a structural constraint on the branching itself, not a materials/budget constraint.

**Design & Media:** The branching flowchart is this unit's dedicated non-robot art/design task, treated as a real, legible diagram since the playtester has to navigate the actual program against it. First formal structured peer critique of the sequence applied to a coding artifact specifically — using prompts like "which path did you take," "where did it feel like nothing changed based on your choice," and "did any ending feel unearned."

**Culminating artifact:** A working, multi-branch Scratch CYOA with at least one earlier-choice-affects-later-outcome mechanic, playtested by a peer, with a short reflection on what the playtest revealed.

**Learning outcomes:**
- Students can plan a branching structure as a diagram before coding it, and build code that matches the diagram.
- Students can use a variable to carry state across scenes, not just as a numeric setting.
- Students can conduct and respond to a structured playtest, identifying at least one specific fix made because of a peer's playthrough.

**Misconception to watch:** Students often build branches that all lead to functionally the same outcome — more choices without the choices actually mattering. The "earlier choice affects later outcome" requirement and the playtest step both exist specifically to catch this.

---

## Unit 4 — Capstone: CO2 Dragster

**Goal:** The year's capstone — a wood-shop-built, CO2-cartridge-powered dragster raced on a track, combining tool skills (the sequence's first real wood-shop unit), aerodynamics/physics content, and a competitive live test.

**Core science ideas:** Newton's laws as applied to propulsion (the cartridge's rapid gas release pushes the car forward — action/reaction); friction and aerodynamic drag working against speed; weight's effect on acceleration versus the fixed propulsion force available — introduced through prediction/discussion (e.g., predict whether a heavier or lighter car, same propulsion, accelerates faster) rather than lecture-first.

**Brief:** "Design and shape a wood dragster body from a blank, mount it on the provided axle/wheel/CO2-cartridge hardware, and finish it to minimize weight and drag, to complete a straight track in the shortest time." (Confirm the exact kit/hardware — standard CO2 dragster kits supply the blank, wheels, axles, and cartridge mount; the shaping and finishing is the student design space.)

**Constraint (introduced explicitly):** A fixed wood blank size and hardware, mirroring real CO2-dragster competition rules — the design space is entirely in shaping, weight distribution, and surface finish, a genuinely different kind of constraint (subtractive shaping within a fixed starting block) than anything earlier in the sequence.

**Activities:**
- Prediction/discussion of propulsion and drag before shaping
- Sketch two or three body-shape concepts (side profile and cross-section) before committing to one — the sequence's first wood-shop application of the "concepts before refinement" rule
- Wood-shop safety training and guided tool use (this is the sequence's first wood-shop unit — see the course-level flag on shop safety/supervision)
- Shape, sand, and finish the body to the sketched design
- Weigh and balance-check before final assembly
- Time trials on a straight track; log times; if time allows, one adjustment and a retest
- Final race day: single-elimination or fastest-time competition, run as the live class test

**Design & Media:** The profile/cross-section sketches are this unit's dedicated non-robot art/design task, drawn to scale against the fixed wood-blank size — a real technical-sketching requirement, since the subtractive shaping process has to match the plan closely and can't easily be undone.

**Video (capstone share-and-reflect):** Students take photos at each build stage (shaping, sanding, finishing, weighing, first test) as they go — non-negotiable, since the video can't be assembled from memory afterward. The video (60–90 seconds, similar scope to Grade 6's) is assembled from these photos plus race-day footage into a short design-process narration: the shape chosen and why, the physics prediction, and what the race result showed.

**Culminating artifact + share-out:** A raced, timed dragster; the process-photo video; and a live share-out at the race event itself — the race is this year's natural public share-and-reflect moment.

**Learning outcomes:**
- Students can explain how weight and shape affect a propelled vehicle's speed, using the vocabulary of force, friction, and drag.
- Students can safely use wood-shop tools to shape a design to a sketched plan.
- Students can generate multiple design concepts, sketched to scale against a fixed constraint, before committing to one.
- Students can document a multi-stage physical build process through photos and assemble them into a short narrated video.

**Misconception to watch:** Students often assume "lighter is always faster," without accounting for the fact that the propulsion force is fixed regardless of weight (so within reason, drag/friction matter as much as weight for this setup) — or the reverse, assuming shape doesn't matter as much as weight. Let the time-trial data settle this rather than asserting the "right" answer in advance.

---

## Materials Needed

- LEGO Spike Prime kits + tablets/computers with the Spike Prime app (Unit 1)
- micro:bit boards (carried from Grade 5, reintroduced after Grade 6's gap) with temperature and light sensor use; insulation/shielding materials budget (foam, foil, cardboard, fabric scraps) for Unit 2
- Devices with browser access to Scratch (Unit 3) — confirm accounts/offline-editor needs
- CO2 dragster kits: wood blanks, wheels/axles, CO2 cartridges and launch/track hardware, sandpaper/finishing supplies, a straight race track with a timing method (confirm supplier/existing inventory)
- Wood-shop access, tools, and safety equipment appropriate for this age (**flagged at course level — confirm shop access, tool training, and supervision ratios before this unit runs**)
- Sketchbooks/blank paper for all four units' sketch/diagram tasks
- A phone or tablet with a camera for Unit 4's process photos and video

## Sets Up for Grade 8

Students should leave Grade 7 able to transfer CT vocabulary from a non-robot tool into a build-and-code platform after a gap, use a physical-computing sensor (micro:bit) to log data and drive a redesign, plan and verify a branching program against a diagram, conduct and respond to a structured peer playtest, and safely use wood-shop tools to shape a design to a sketched plan under a fixed-material constraint. They should also have practiced the "concepts before refinement" rule in a subtractive/physical context for the first time (dragster shaping), not just an additive one. Grade 8 assumes all of this and adds real electrical work (soldering, a powered motor) and a class-wide collaborative build (Rube Goldberg) where no single group's design stands alone.
