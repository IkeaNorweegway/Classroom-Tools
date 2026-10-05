# STEAM — Grade 8 Year Plan
*Read alongside `steam/_context.md` (equipment map, unit archetype, evidence base — revised 2026-09), `research/steam-progression-research.md`, and `research/design-thinking-graphic-web-research.md` (Grade 8 is still in that file's 7–8 band). Assumes Grade 7's CT transfer across a platform gap, micro:bit sensor data logging and redesign, branching-program planning/playtesting, and wood-shop tool use under a fixed-material constraint.*

---

## Year at a Glance — revised 2026-09

**~40 sessions, 2 hrs each, ~80 hours, 24 weeks.** Centerpiece: a **class-wide collaborative Rube Goldberg build** (Unit 1), 3D-printed and pegboard-mounted. Also: Scratch's third appearance (Unit 2, a platform game), the sequence's first real electrical work — soldering and a powered motor (Unit 3) — and a Spike Prime capstone with student-designed challenges (Unit 4).

| Unit | Weeks | Sessions | Platform / focus | Constraint level | Capstone shape |
|---|---|---|---|---|---|
| 1. Rube Goldberg: Class Chain Reaction | 1–6 | ~10 | 3D printing/Tinkercad, pegboard mounting, class-wide coordination | Medium–high (must interface with neighboring apparatuses) | Live class-wide chain-reaction run |
| 2. Platform Game (Scratch) | 7–12 | ~10 | Scratch — gravity, collision, scoring | Medium | Peer playtest + share |
| 3. Mechanical Advantage & Powered Motor | 13–18 | ~10 | Simple machines + soldering + 5V-class DC motor circuit | Medium–high | Design review + live test |
| 4. Capstone: Spike Prime Challenge Maze | 19–24 | ~10 | Spike Prime + sensors; student-designed peer challenges | High | Peer challenge exchange, public share-out, video |

---

## Unit 1 — Rube Goldberg: Class Chain Reaction

**Goal:** A class-wide collaborative engineering project — every group designs and builds one apparatus (a stage in a chain reaction), 3D-printing mounting components to attach to a shared pegboard, and every apparatus must reliably trigger the next group's apparatus. This is structurally unlike every other unit in the sequence: no group's design can be finalized in isolation, because their apparatus's output has to reliably trigger a neighboring apparatus's input.

**Core engineering ideas:** simple-machine review (lever, pulley, inclined plane, wheel-axle, wedge, screw) as the building blocks of each stage; energy/motion transfer between stages (what form is being handed off — a rolling ball, a falling weight, a pushed lever, a released spring); reliability and tolerance (a chain reaction is only as reliable as its weakest link — "it worked once" isn't the bar).

**Coordination protocol (see course-level flag):** Before any group finalizes a design, the class agrees on shared hand-off specifications with immediate neighbors — what form the trigger takes (a ball arriving at a specific height/speed, a lever pushed a specific distance) — negotiated and sketched jointly with the neighboring group before either group commits to a final build. This negotiation is itself a design-communication task, not an administrative step to rush through.

**Constraint (introduced explicitly):** Each apparatus must (a) use at least two distinct simple machines, (b) mount to the shared pegboard using at least one 3D-printed custom bracket designed to the pegboard's actual hole spacing — a real measurement-to-fit requirement, and (c) reliably trigger its downstream neighbor across multiple consecutive test runs.

**Activities:**
- Simple-machine review/tests (which machines change force direction, which trade force for distance)
- Negotiate hand-off specs with neighboring groups before finalizing a design
- Sketch two or more apparatus concepts using at least two simple machines, before building
- Prototype and test the apparatus in isolation first — does it reliably do its own job
- Design and print a custom pegboard-mounting bracket to spec; test the fit
- Full class integration test(s): apparatuses run in sequence; troubleshoot hand-off failures as a class, not just within a group
- At least one documented redesign after an integration-test failure — the group whose apparatus failed to trigger (or receive a trigger) diagnoses whether the problem is their apparatus, their neighbor's, or the interface spec itself

**Design review step:** The neighbor-negotiation sketch functions as this unit's design review — but unlike every prior review in the sequence, it's a genuine two-way negotiation between groups with a real stake in each other's success, not a one-directional critique.

**Design & Media:** The hand-off spec sketches (jointly authored with neighboring groups) and each group's own apparatus concept sketches are this unit's dedicated non-robot art/design task — legibility matters more here than in any prior unit, since a neighboring group has to build correctly against a spec they didn't originate.

**Culminating artifact:** A full, reliable class-wide chain reaction from first apparatus to last, run live in front of the class (and ideally another audience), plus each group's printed mounting bracket and a short reflection on one hand-off problem that came up and how it was resolved.

**Learning outcomes:**
- Students can identify and use at least two simple machines in a single mechanism and explain the force/motion trade-off each provides.
- Students can design a 3D-printed part to a real physical measurement constraint (pegboard hole spacing) and verify the fit.
- Students can negotiate and build to a specification co-authored with another group, and diagnose which side of an interface failure is responsible when a hand-off doesn't work.
- Students can distinguish a mechanism that "worked once" from one that is reliably repeatable, and explain why reliability matters in a chained system.

**Misconception to watch:** Groups often optimize their own apparatus in isolation and treat the hand-off as someone else's problem — a systems-thinking gap unique to this unit's shared-build structure (no other unit in the sequence has this failure mode, since every other unit's constraint is internal to one group). Name this directly at the start: an apparatus is not "done" when it works alone, only when it reliably triggers its neighbor's.

---

## Unit 2 — Platform Game (Scratch)

**Goal:** Scratch's third appearance (after Grade 5's branching story and Grade 7's CYOA), now applied to a platform game — introducing game-specific logic (simulated gravity, collision detection, scoring/win-lose states) that a narrative-only CYOA doesn't require.

**CT vocabulary:** Builds on Grade 7's variables-for-state concept, adding simulated physics (a gravity variable applied continuously), collision detection (checking whether two sprites are touching and responding), and game-state tracking (score, lives, win/lose) — a more systems-like use of variables than either prior Scratch unit.

**Activities:**
- Build a simple gravity simulation first (a sprite that falls and stops on a "ground" sprite) as a guided starting technique before open design
- Add player-controlled movement and jumping, combining input, a gravity variable, and a collision check against the ground
- Design at least one level with obstacles/collectibles requiring collision detection and a scoring or lives system
- Structured peer playtest (continuing Grade 7's pattern): a partner plays the level and reports where they got stuck, where a collision felt wrong, and whether the difficulty felt fair

**Constraint (introduced explicitly):** The game must have a defined win condition and a defined lose condition, and must handle at least one collision type correctly and consistently — a bug where a jump sometimes doesn't register is a debugging target, not an acceptable quirk.

**Design & Media:** Students sketch their level layout on paper (platform placement, obstacle placement, where difficulty increases) before building — echoing Grade 7's flowchart-before-code pattern, now applied to spatial level design. First game-specific application of the "3+ concepts" rule: sketch two or three level-layout ideas before choosing one to build in full.

**Culminating artifact:** A working platform game level with player movement, gravity, at least one collision-based mechanic, and a defined win/lose state, playtested by a peer with at least one documented fix made from feedback.

**Learning outcomes:**
- Students can implement a simple simulated-physics behavior (gravity) using a continuously updated variable.
- Students can implement and debug collision detection between sprites.
- Students can design a level with an intentional difficulty progression, planned on paper before building.
- Students can conduct a structured playtest and make a specific, justified change based on the feedback.

**Misconception to watch:** Students often think a game improves simply by adding more elements (more enemies, more effects) rather than through deliberate difficulty pacing or fixing what's actually broken — the same "more stuff" misconception flagged in Grade 5's Scratch capstone, recurring in a new context. The playtest step exists specifically to redirect attention to what's actually not working.

---

## Unit 3 — Mechanical Advantage & Powered Motor

**Goal:** The first unit in the sequence combining simple-machine mechanical advantage with a real powered, soldered circuit (a 5V-class DC motor) — students build a mechanism, then add real electrical power and control to it, rather than working with a kit's pre-wired motor as in earlier Spike Prime work.

**New skill:** Soldering (see the course-level safety flag — a written protocol is required before this unit runs) and basic circuit-building: powering a small DC motor from a battery pack, using a switch, and, if time allows, simple speed control kept age-appropriate.

**Core engineering ideas:** mechanical advantage — how a lever, gear, or pulley changes the force or speed a motor's output can achieve (a small motor can lift a heavier load through gearing/leverage, at the cost of speed) — directly extending Grade 6 Unit 3's structural-load reasoning into a powered context for the first time.

**Constraint (introduced explicitly):** The motor is fixed (a stated small 5V-class motor, not swappable), and the mechanism must use mechanical advantage (gearing, a lever, or a pulley system) to achieve a stated task the bare motor couldn't do alone — e.g., lift a load heavier than the motor could lift directly, or move something a specified minimum distance against resistance.

**Activities:**
- Soldering safety training and guided practice (a simple, low-stakes first joint before wiring anything functional)
- Build and test a basic motor circuit (battery, switch, motor) before attaching any mechanism
- Test the bare motor's lifting/pulling capability — a baseline measurement — before adding mechanical advantage
- Design and build a mechanism (gear train, lever, or pulley system) that lets the same motor accomplish the stated task it couldn't do alone
- Test, measure, and redesign at least once based on results

**Design review step:** Peer review before final build — reviewers predict whether the proposed gear ratio or lever arrangement will actually achieve the stated task, given the baseline motor measurement, before the build is finalized — echoing the "predict before testing" pattern from Grade 6 Unit 3 and Grade 7 Unit 2, now with a real quantitative baseline to reason from.

**Design & Media:** Students diagram their mechanism (labeled: motor, mechanism type, expected force/speed trade-off) — this unit's dedicated non-screen design task, since the unit itself is hands-on physical/electrical rather than screen-based.

**Culminating artifact:** A working motorized mechanism (soldered circuit + mechanical-advantage build) that accomplishes the stated task, with baseline (motor-alone) and final measurements showing the improvement, plus the labeled diagram.

**Learning outcomes:**
- Students can safely solder a basic circuit joint and build a working motor circuit (battery, switch, motor).
- Students can measure a baseline capability and use it to reason about how much mechanical advantage is needed.
- Students can design and build a gear, lever, or pulley mechanism that measurably extends what a fixed motor can accomplish.
- Students can predict whether a proposed mechanical-advantage ratio will meet a stated task, and revise it based on test results.

**Misconception to watch:** Students often think "a bigger/stronger motor" is always the answer to "the mechanism can't do the task," rather than recognizing the same motor can accomplish more through mechanical advantage — the fixed-motor constraint exists specifically to force this reasoning, since swapping in a stronger motor isn't an option.

---

## Unit 4 — Capstone: Spike Prime Challenge Maze

**Goal:** A return to Spike Prime (last used in Grade 7 Unit 1) as the year's capstone — students build a sensor-based maze/obstacle challenge and a Spike Prime program to solve it, then flip the structure: each group also designs a challenge for another group to solve, echoing the original Grade 6 capstone's peer-specification pattern (write a challenge precise enough for someone else to build and solve against).

**Brief:** "Design and program a Spike Prime robot that can navigate a maze or obstacle challenge using at least two sensors. Then design your own maze/challenge, with a written specification, for another group to solve using their own robot." This is a double design cycle in one capstone: solving a challenge, and authoring one.

**Constraint (introduced explicitly — the year's highest):** The student-authored challenge must be solvable using sensors reasonably available on Spike Prime, must be clearly specified in writing/diagram so another group can build the physical maze from the spec, and must have been test-solved by the authoring group's own robot before being handed off.

**Activities:**
- Review/extend Spike Prime sensor use from Grade 7 Unit 1 (color, distance, plus at least one more sensor type)
- Build and program a robot to solve a teacher-provided practice maze first, as a shared baseline
- Design a maze/challenge as a group: sketch the layout, decide what sensor logic a solver would need, write a clear specification
- Test-solve your own challenge with your own robot before handing off the spec
- Exchange challenges with another group; build/set up the received challenge from its written spec; program a robot to solve it
- Both groups reflect on whether the spec communicated clearly and whether the solving approach differed from what the author expected

**Design & Media:** The written challenge specification (with diagram) is this unit's dedicated non-robot-build art/design task and the year's final applied test of the "legible enough for a stranger to build against" standard first introduced in Grade 6's own capstone — treat it with the same seriousness as a graphic-design deliverable.

**Video (capstone share-and-reflect):** Students storyboard and film a 90-second-to-2-minute video covering both halves of the capstone — solving the practice/exchanged challenge, and their own challenge design — with more independent editing expectation than Grade 7 (basic trimming/sequencing, if tools allow).

**Culminating artifact + share-out:** A working robot solution to an exchanged peer challenge, the group's own authored (and pre-tested) challenge, and a public share-out where both the solving and authoring sides of the work are presented.

**Learning outcomes:**
- Students can program a multi-sensor Spike Prime solution to a maze/obstacle challenge.
- Students can author a clear, buildable specification for a challenge, and validate it by solving it themselves before handing it off.
- Students can identify where a peer-authored specification was ambiguous after attempting to build/solve against it, and distinguish that from a problem with their own robot's program.

**Misconception to watch:** Students designing a challenge often underestimate how much implicit knowledge they're assuming a stranger has — the same ambiguity misconception flagged in the original Grade 6 capstone. The required self-test-before-handoff step catches the most obvious version of this, but some ambiguity typically survives to the exchange; treat that as expected data for the reflection step, not a design failure.

---

## Materials Needed

- MakerBot Sketch + Tinkercad accounts (carried forward), with heavy queue demand this year — every Unit 1 group prints a custom bracket, so build extra queue buffer into Unit 1's pacing
- A shared pegboard (or several, depending on class size) sized for the whole class's Rube Goldberg apparatuses, plus general chain-reaction materials (ramps, dominoes, string, simple levers/pulleys, marbles/balls)
- Devices with browser access to Scratch (Unit 2)
- Soldering irons, solder, basic circuit components (battery packs, switches, small 5V-class DC motors, wire), ventilation and burn-safety equipment (**a written soldering safety protocol is required before Unit 3 — flagged at course level**)
- Gear/pulley/lever mechanism materials for Unit 3 (reuse or extend Grade 6's original gear/pulley kit if still on hand)
- LEGO Spike Prime kits (carried from Grade 7) + tablets/computers with the Spike Prime app, plus maze/obstacle-course building materials for Unit 4
- Sketchbooks/blank paper for all four units' sketch/diagram/spec tasks
- A phone or tablet with a camera for Unit 4's video

## Sets Up for Grade 9

Students should leave Grade 8 able to design a physical part to a real measurement constraint and verify its fit, negotiate and build to a specification co-authored with peers (not just critiqued by them), reason about mechanical advantage with a real quantitative baseline, safely solder a basic working circuit, and both solve and author a peer-facing technical challenge. They should also have completed one large-scale collaborative project where individual success depended on a shared system working (Rube Goldberg) — a systems-thinking experience the rest of the sequence doesn't otherwise provide. Grade 9 assumes all of this and moves to independent, self-initiated project work: general-purpose text-code fundamentals (Java or Python — the choice is still open, see Grade 9's Unit 1), a first taste of genuine competition-grade robotics hardware (REV DUO, which runs on Java regardless of which language Unit 1 uses), an electronics-plus-fabrication unit (electrified miniatures), and a large-scale independent tool-skills capstone (the trebuchet).
