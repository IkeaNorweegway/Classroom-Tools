# STEAM — Grade 9 Year Plan
*Read alongside `steam/_context.md` (equipment map, unit archetype, evidence base — revised 2026-09; REV DUO confirmed as competition-grade FTC hardware coded in Java/Blockly-for-Java), and `research/design-thinking-graphic-web-research.md` (Grade 9 is that file's HS-readiness band). Assumes Grade 8's measurement-constrained fabrication, soldering, mechanical-advantage reasoning with a quantitative baseline, and one large-scale collaborative systems project (Rube Goldberg).*

---

## Year at a Glance — revised 2026-09

**~40 sessions, 2 hrs each, ~80 hours, 24 weeks.** **This capstone year no longer culminates in a REV-based robotics capstone**, unlike the original course-wide ladder. Unit 1 opens the year with a general-purpose text language; REV DUO gets a single tutorial-based introduction in Unit 2; the capstone is a large-scale mechanical-advantage build (a trebuchet) in the wood shop. HS-readiness here is framed across text-code fluency, one authentic exposure to competition-grade robotics hardware, digital fabrication plus electronics integration, and independent tool-skills project management — not a single robotics-competition throughline. See the course-level Open Items for the flag this raises for HS planning.

**Language decision — not yet finalized (flagged 2026-09).** Unit 1 is built out in full for **both Java and Python** below; pick one before the year runs (or run different sections with different languages, if that fits the school's setup — the unit works either way). This matters beyond Unit 1 alone, because Unit 2's REV DUO hardware natively runs on **Java** (via the FTC SDK — OnBot Java, Android Studio, or Blockly-for-Java): if **Java** is chosen for Unit 1, Grade 9 runs one consistent language all year; if **Python** is chosen, Unit 2 reintroduces a genuine language-transfer moment (Python → Java) — both versions of Unit 2's framing are written below so either choice is covered. Materials for both language options exist as full notes + design journal packages (`steam/grade-9/java-introduction/` and `steam/grade-9/python-introduction/`).

| Unit | Weeks | Sessions | Platform / focus | Constraint level | Capstone shape |
|---|---|---|---|---|---|
| 1. Language Introduction — Java **or** Python (decision pending) | 1–6 | ~10 | Text-code fundamentals via tutorials; a simple game (Tic-Tac-Toe/Minesweeper) | Low | Working game + share |
| 2. REV Robotics (Intro) | 7–12 | ~10 | REV DUO hardware, FTC SDK (Java/Blockly-for-Java), tutorial-based | Medium | Guided build/program demo |
| 3. Electrified Miniatures | 13–18 | ~10 | Tinkercad + 3D printing + lights/sensors/simple motion | Medium–high | Design review + live demo |
| 4. Capstone: Trebuchet | 19–24 | ~10 | Wood shop, mechanical advantage, large-scale build | High | Public share-out, launch test, process-photo video |

---

## Unit 1 — Language Introduction (Java or Python — decision pending)

**Goal (both options):** Establish a general-purpose text-coding foundation, deliberately decoupled from any robot — students learn syntax, logic, and program structure through tutorials and a self-contained project (a simple game) before Unit 2 applies text code to real hardware (REV DUO). Teaching this on its own terms first, rather than folding it into the robot unit, is the point regardless of which language is chosen.

### Option A: Java

**Why this option:** REV DUO's native environment is Java/Blockly-for-Java, so opening the year in Java means Grade 9 runs one consistent language all year instead of a mid-year switch — the language transfer moment in Unit 2 becomes "same language, new API" rather than "new language."

**CT vocabulary consolidated in Java syntax:** sequence, loop (`for`/`while`), conditional (`if`/`else if`/`else`), variable, and — new this year — methods (Java's version of a function), plus a basic data structure appropriate to the chosen game (a 2D array for a Tic-Tac-Toe or Minesweeper grid). Also new and worth naming explicitly: Java's **class-and-main-method structure** — unlike Python or any block language students have used, every Java program has to be wrapped in a class with a `main` method before anything else runs. Name this as a syntax requirement of the language, not a CT concept in itself, so students don't mistake boilerplate for new logic.

**Activities:**
- Work through structured Java tutorials covering core syntax (variables, conditionals, loops, methods, basic input/output, and the class/main-method structure every program needs)
- Build toward a simple, complete game chosen from Tic-Tac-Toe, Minesweeper, or an equivalent small game of comparable scope — a console/text-based version is a reasonable scope for the time budget; a graphical version is a stretch option for students who finish early
- Debug a provided broken version of a small program before writing one from scratch — a deliberate debugging exercise, reusing the "debug" vocabulary established since Grade 5. Java's compiler catches many errors (type mismatches, missing semicolons/braces) before the program even runs — name this as a new category, distinct from a runtime error or a logic error, since Python and block languages didn't surface it the same way
- Share/demo the finished game with a partner, who plays it and reports any bug or confusing behavior

**Culminating artifact:** A working, playable Java game (console-based at minimum) with correct win/lose or end-state detection, demonstrated live and debugged based on a peer's play session.

**Learning outcomes:**
- Students can write a Java program using variables, conditionals, loops, and at least one method, inside the required class/main-method structure.
- Students can plan a program's logic on paper before writing code, and build code that matches the plan.
- Students can distinguish a compile-time error, a runtime error, and a logic error, and debug each appropriately.
- Students can build a complete, working small program from tutorials plus independent extension, not just complete guided exercises.

**Misconception to watch:** Students often believe a program that runs without crashing is therefore correct. Distinguish "runs without error" from "produces the right result" explicitly (a Tic-Tac-Toe that never detects a win still "runs"). Build at least one test case into the demo step that specifically checks correctness, not just execution. A second, Java-specific misconception: students coming from blocks or a simpler language may treat the class/main-method wrapper as something they should understand deeply right away — frame it as a fixed piece of scaffolding to accept for now, not a concept to fully unpack in Unit 1.

### Option B: Python

**Why this option:** Python's syntax overhead is lower (no compile step, no required class/main wrapper, no explicit type declarations), so students reach a working program faster and spend more of the unit on logic rather than boilerplate. The trade-off lands in Unit 2: REV DUO's native environment is Java, so this path requires a real language-transfer moment mid-year rather than a same-language extension.

**CT vocabulary consolidated in Python syntax:** sequence, loop (`for`/`while`), conditional (`if`/`elif`/`else`), variable, and — new this year — functions (`def`), plus a basic data structure appropriate to the chosen game (a list, or a list of lists, for a Tic-Tac-Toe or Minesweeper grid; a dictionary if useful for tracking state).

**Activities:**
- Work through structured Python tutorials covering core syntax (variables, conditionals, loops, functions, basic input/output)
- Build toward a simple, complete game chosen from Tic-Tac-Toe, Minesweeper, or an equivalent small game of comparable scope — a console/text-based version is a reasonable scope for the time budget; a graphical version is a stretch option for students who finish early
- Debug a provided broken version of a small program before writing one from scratch — a deliberate debugging exercise, reusing the "debug" vocabulary established since Grade 5. Python has no separate compile step, so most errors only surface when that exact line runs — distinguish a syntax error (Python catches this before running at all, even without a full compiler), a runtime error/exception (the line runs and fails), and a logic error (the program runs fine but gives the wrong answer)
- Share/demo the finished game with a partner, who plays it and reports any bug or confusing behavior

**Culminating artifact:** A working, playable Python game (console-based at minimum) with correct win/lose or end-state detection, demonstrated live and debugged based on a peer's play session.

**Learning outcomes:**
- Students can write a Python program using variables, conditionals, loops, and at least one function.
- Students can plan a program's logic on paper before writing code, and build code that matches the plan.
- Students can distinguish a syntax error, a runtime error, and a logic error, and debug each appropriately.
- Students can build a complete, working small program from tutorials plus independent extension, not just complete guided exercises.

**Misconception to watch:** Students often believe a program that runs without crashing is therefore correct. Distinguish "runs without error" from "produces the right result" explicitly (a Tic-Tac-Toe that never detects a win still "runs"). Build at least one test case into the demo step that specifically checks correctness, not just execution. A second misconception worth watching for this path specifically: because Python is forgiving about types and structure, students can get a program "working" through trial and error without a clear mental model of why — the paper flowchart step (below) exists partly to catch this before it hardens into a habit.

**Trainer (Python path only):** `public/materials/steam9-python-trainer-v1.html` is the tutorial sequence and coding environment for this option — a browser editor and console (no install, no accounts) whose steps follow the notes' Concepts 1–4 and the journal's Part D debugging exercise, then give a workshop space for the game. It sends students back to the paper notes and journal at each stage and does not replace them. Its Python engine (Skulpt) covers everything this unit needs but is not full Python: no file access and no third-party libraries, and syntax-error wording is reworded by the trainer to match real Python.

### Shared across both options

**Design & Media:** Before coding, students sketch/flowchart their game's logic (e.g., Tic-Tac-Toe's win-check logic, or Minesweeper's reveal/flag behavior) on paper — continuing the "plan the logic before coding it" habit established in Grade 7's CYOA flowchart, now applied to a general program rather than a branching story.

---

## Unit 2 — REV Robotics (Intro)

**Goal:** A tutorial-based first introduction to REV DUO — genuine competition-grade FTC hardware (Control Hub/Driver Hub, NEO brushless motors, SPARK MAX motor controllers, Smart Robot Servo). This is a lighter, single-unit exposure compared to the original ladder's two-year REV arc; the goal is authentic familiarity with competition-grade hardware, not mastery.

**Coding environment note (resolved 2026-09):** REV DUO's native environment is the FTC SDK, programmed in **Java** (via OnBot Java or Android Studio) or **Blockly-for-Java**. How this unit opens depends on the still-pending Unit 1 language decision:
- **If Java was chosen for Unit 1:** this unit is **not** a language jump — it's the same language applied to new hardware and a new API. Name this explicitly to students as good news, not a new hurdle: "the Java you already know is the same Java here — what's new is REV's specific hardware API: how you talk to a motor or a sensor through code."
- **If Python was chosen for Unit 1:** this unit **is** a genuine language-transfer moment — the CT logic (sequence, loop, conditional, variable, function) carries over completely, but the syntax changes from Python to Java. Name this transition explicitly and directly, the same way Grade 7 named the transfer when reintroducing micro:bit vocabulary in a new context: "the logic is identical to what you built in Python; what's different is how you write it down."

Either way, if Blockly-for-Java is used first, frame it as a scaffold for learning the shape of the new hardware API (what objects and methods exist — a motor object, a sensor object, a hardware map), not as a return to block-based thinking about logic itself — the CT logic doesn't change; only the vocabulary of available objects (and, if coming from Python, the syntax) does.

**Materials note:** both versions of this unit's notes + design journal are already built — use `steam9-rev-notes-v1.md` / `steam9-rev-workbook-v1.md` if Java was chosen for Unit 1, or the `-python-path-v1` versions in the same folder if Python was chosen (they add a Python-to-Java translation guide and reframe the misconception around "different language means starting over" rather than "hardware means a different language").

**Activities:**
- Work through REV's own published classroom curriculum/tutorial materials — REV DUO ships with a ready-to-teach course; draw this unit's structure from that resource rather than building one from scratch
- Guided build of a basic REV DUO drivetrain/chassis following the tutorial
- Program basic movement using the FTC SDK's hardware objects (motors, servos) — via Blockly-for-Java first if the tutorial supports it, transitioning to written Java as time/comfort allows; frame the blocks step as learning the new hardware API's shape, not as re-learning logic already established in Unit 1
- Use at least one sensor (REV's own, or a paired micro:bit/Spike Prime sensor if the classroom setup is configured that way) to add a simple conditional behavior
- Guided demo: drive a short course or complete a simple stated task, live

**Design & Media:** Students diagram their chassis build (labeled: drivetrain, motor placement, sensor placement) before or during the guided build — a lighter design task than other units this year, appropriate to the tutorial-paced nature of this unit.

**Culminating artifact:** A working REV DUO drivetrain, programmed (via Blockly-for-Java and/or Java) to complete a simple guided task using at least one sensor-based conditional, demonstrated live.

**Learning outcomes:**
- Students can assemble a guided build using competition-grade REV hardware and verify it functions correctly.
- Students can identify the same CT logic (sequence, loop, conditional) they used in Unit 1 within REV's Java/Blockly environment, and name what's actually new in this unit (the hardware API, and — if coming from Python — the language syntax) versus what's unchanged (the underlying logic).
- Students can use at least one sensor to create a simple conditional robot behavior on REV hardware.

**Misconception to watch:** Students may assume competition-grade hardware requires an entirely new *kind* of logic than what they already know from Unit 1. Correct this directly and immediately: the CT logic is unchanged regardless of which Unit 1 language was chosen; what's new is the hardware-specific API (motors, sensors, servos) they're calling into, and — only if Python was chosen for Unit 1 — the syntax it's written in.

---

## Unit 3 — Electrified Miniatures

**Goal:** Combine this year's fabrication skills (Tinkercad/3D printing, carried since Grade 6) with real electronics (lights, sensors, simple motion) inside a designed physical scene — a diorama-style miniature that tells a visual story through both its design and its engineered behavior. This is the sequence's most complete Art & Media + circuits + fabrication integration, echoing Grade 5's "coding and creative work are the same skill set" theme at a much more capable level.

**Core content:** basic LED circuits, simple sensor-triggered behavior (a light or motion/proximity trigger turning on a scene's lighting), and simple mechanical motion (a hinge, lever, or simple cam mechanism for an opening lid/door or comparable small movement) — deliberately combining three domains (fabrication, electronics, simple mechanism) that have mostly been taught separately until now.

**Brief:** "Design and build a small scene or moment — a diorama-scale model — using 3D-printed and/or craft elements, that includes at least one light, at least one sensor-triggered behavior, and (optional stretch) one simple mechanical motion." Theme is entirely student-chosen — a genuine open creative brief, similar in spirit to Grade 5's Scratch capstone but physical/electronic rather than screen-based.

**Constraint (introduced explicitly):** The scene must be built at a stated maximum footprint/scale (useful for staging a class display), must include a working sensor-triggered light behavior (not just an always-on light), and must be finished (painted/detailed) to a presentation standard — the first unit where finish quality is an explicit, named requirement rather than implicit.

**Activities:**
- Sketch three or more distinct scene concepts (composition, lighting moment, what's happening) before choosing one — the "3+ concepts" rule at its most creative-open point this year
- Design and print structural/architectural elements in Tinkercad; combine with craft materials as appropriate
- Build and test the lighting circuit and sensor trigger in isolation before integrating into the final scene — the same "test the sub-system before integrating" pattern used in Grade 8's motor-mechanism unit
- If attempting the motion stretch goal: prototype the simple mechanism (hinge/cam) separately before building it into the finished scene
- Structured peer design review of the scene concept sketch, evaluating composition/storytelling alongside technical feasibility — the first design-review protocol in the sequence to assess artistic and technical criteria together
- Final assembly, finishing/detailing, and integration test of the complete scene

**Design & Media:** The concept sketches and the finished scene itself are this unit's central Art & Media deliverable, treated with the seriousness of a professional-style concept presentation, matching the course-level Art & Media Strand's Grade 9 expectation ("annotated concept sketches presented to justify a design decision, not just generate one").

**Culminating artifact:** A finished, presentation-quality electrified miniature scene with a working sensor-triggered light behavior (and optionally simple motion), presented with the concept sketches and a short explanation of the design decisions behind the scene's composition and engineering.

**Learning outcomes:**
- Students can design and fabricate structural/architectural elements to scale for a physical scene.
- Students can build a working sensor-triggered lighting circuit and integrate it into a finished physical build.
- Students can (stretch) design a simple mechanical motion and integrate it into a scene.
- Students can present and justify both the artistic and technical decisions behind a finished piece.

**Misconception to watch:** Students often treat the "art" and "engineering" parts of a build as sequential and separable — build the technical part, then decorate it — rather than integrated from the start. A scene designed this way often has an awkwardly bolted-on light or a mechanism that doesn't fit the composition. Name this directly, echoing Grade 5's original "coding is the math part, art is the fun part" misconception at a more sophisticated level: sensor placement and light choice are compositional decisions, not just technical ones.

---

## Unit 4 — Capstone: Trebuchet

**Goal:** The sequence's final capstone — a large-scale (~1 meter tall) trebuchet build, the biggest single physical object students will have built in the program, focused on mechanical advantage, prototyping at scale, and independent tool-skills project management, in the wood shop.

**Core engineering ideas:** mechanical advantage via lever-arm ratio (the long-arm/short-arm ratio determines the force/speed trade-off, directly extending Grade 8 Unit 3's motor-and-mechanism reasoning to a much larger, counterweight-powered scale); energy transfer from a counterweight's potential energy into a projectile's kinetic energy (echoing Grade 5 Unit 2's energy vocabulary at a far larger scale — a deliberate full-circle callback); structural bracing at scale (a full-size frame has real load and stability demands well beyond anything in Grades 5–8's tabletop builds).

**Brief:** "Design, prototype, and build a trebuchet standing approximately one meter tall, that reliably launches a stated projectile a measurable distance. Prototype at small scale before committing to the full build." The small-scale prototyping requirement is explicit and non-negotiable — this is the first unit in the sequence where prototyping-before-full-build is a named, required phase rather than an implicit good habit, appropriate to the scale and material cost of the final build.

**Constraint (introduced explicitly — the sequence's largest-scale constraint):** A stated maximum height (~1m), a stated projectile type/weight, and a required small-scale prototype phase before full-scale construction begins — students must show working proof-of-concept at small scale, with measured results, before wood-shop time is committed to the full build.

**Activities:**
- Research/review lever-arm mechanical advantage and trebuchet design variants (traditional counterweight, hinged/sliding counterweight) before designing
- Sketch three or more distinct design concepts (arm ratio, counterweight approach, frame design) before choosing one
- Build and test a small-scale prototype (tabletop size); measure launch distance and log results across at least one prototype redesign
- Once the prototype is validated, plan and build the full ~1m frame in the wood shop, applying the validated arm ratio/design at scale
- Test the full-scale build; log launch distance/consistency; make at least one full-scale adjustment based on test data
- Final launch/demo event as the live public share-out

**Design review step:** A formal peer design review of the prototype results and the full-scale build plan before wood-shop construction begins — reviewers specifically assess whether the prototype's validated ratio/approach will actually scale up safely and effectively, a genuine engineering judgment call since scaling up a working small mechanism isn't guaranteed to work identically at ten times the size.

**Design & Media:** The prototype-to-full-scale design documentation (sketches, prototype test data, the scaling decision and its reasoning) is this unit's Art & Media deliverable and its documented-iteration-history requirement combined — matching the "complete iteration history" standard the sequence has been building toward since Grade 8's Rube Goldberg reflection.

**Video (capstone share-and-reflect — non-negotiable, per the brief):** Students take process photos at every major stage (prototype build, prototype test, full-scale construction stages, full-scale test, launch event) as they go — this cannot be reconstructed after the fact. The final video is a one-minute short assembled from these photos (plus any video clips), narrating the design process: the concepts considered, what the prototype showed, what changed at full scale, and the final result. Full student ownership of planning, shooting, and assembling the short, with minimal scaffolding — the closest the sequence gets to a genuine portfolio piece.

**Culminating artifact + share-out:** A completed ~1m trebuchet, tested and launched publicly, the prototype-to-full-scale documentation, and the one-minute process video — presented together as the program's final capstone.

**Learning outcomes:**
- Students can apply lever-arm mechanical advantage reasoning to design a launching mechanism, and explain the force/speed trade-off of their chosen arm ratio.
- Students can validate a design at small scale before committing to a full-scale build, and can identify when a scaled-up design needs adjustment rather than a direct size increase.
- Students can safely use wood-shop tools to construct a large-scale structural build independently, applying tool skills built since Grade 7.
- Students can document a complete design process (photos + iteration data) and assemble it into a short, narrated process video without significant teacher direction.

**Misconception to watch:** Students often assume a mechanism validated at small scale will behave identically when built larger — a "just make it bigger" assumption. Real trebuchet scaling involves non-linear effects (weight, material stiffness, and stress all scale differently with size) that a naive scale-up misses. Let the full-scale build's actual performance, if it underperforms the naive prediction, be the evidence for this, rather than pre-teaching the scaling problem in the abstract — consistent with the sequence's established pattern of letting a test reveal a misconception rather than lecturing it away in advance.

---

## Materials Needed

- **Unit 1 language environment — pending the Java/Python decision:** either a Java setup (a browser-based/hosted online compiler for a lighter footprint, or a locally installed JDK + simple IDE such as VS Code or BlueJ; Java needs more setup than Python, since it requires a JDK and a compilation step) or a Python setup (browser-based, e.g. an online REPL/notebook, or installed locally — lighter setup either way) + tutorial curriculum matching whichever is chosen
- REV DUO hardware (class set, confirmed competition-grade FTC kit) + Control Hub/Driver Hub setup, REV's own published classroom curriculum materials for Unit 2
- Tinkercad accounts + MakerBot Sketch print access (carried forward) for Unit 3's structural elements
- LED/lighting components, basic sensors (light/motion/proximity), simple mechanism hardware (small hinges, basic cam materials) for Unit 3 — confirm whether soldering (from Grade 8) is reused here or simpler connector-based wiring is more appropriate at diorama scale
- Wood-shop access, tools, and larger stock materials (dimensional lumber or equivalent) for the ~1m trebuchet frame, plus a counterweight and projectile appropriate to a safe launch distance/area (**confirm shop access, supervision ratios, and a safe outdoor/gym launch space before Unit 4**)
- Measuring/logging tools for launch-distance data (tape measure or marked launch field, stopwatch if timing is also tracked)
- Sketchbooks/blank paper for all four units' sketch/diagram/documentation tasks
- A phone or tablet with a camera for Units 1 (demo), 3 (presentation photos), and 4's required process-photo video

## What This Sequence Hands Off to High School

A student completing this redesigned sequence arrives at high school having: named and used core CT vocabulary across screen-based, circuit-based, and robot-based tools every year since Grade 5; written general-purpose text code (Java or Python, per whichever is chosen for Unit 1) and then applied text-code thinking to a real hardware API (REV DUO, in Java) in Unit 2 — either one consistent language all year, or one deliberate, explicitly-named language transfer partway through, depending on the Unit 1 decision; built physical mechanisms from simple levers through a full-scale, human-scale trebuchet; run the engineering design cycle at least once every year with escalating constraints, including one large-scale prototype-then-build cycle; and completed at least one genuinely collaborative systems project (Grade 8's Rube Goldberg) where individual success depended on a shared system working, not just their own component. Alongside that, they have sketched multiple concepts before refining one every year since Grade 5, used a structured peer-critique or peer-negotiation protocol since Grade 7 (including, uniquely, a co-authored specification in Grade 8), transferred design work from paper to physical builds and, where units called for it, digital tools, and produced a capstone video independently.

**This sequence's HS-readiness framing has shifted from the original ladder's single robotics-competition throughline:** it now hands off strength across a year's text-code fluency, tool-skills/fabrication independence, and one authentic (if brief) exposure to competition-grade FTC hardware, rather than a full two-year REV arc — flagged at the course level for whoever plans HS-level continuation, since a student ready for an HS CTS/CTF *design/fabrication* pathway is not automatically as deep into FTC-specific competition robotics as the original plan assumed. **The Unit 1 language choice (Java vs. Python) is also still open** — resolve it before the year runs; Unit 2's opening framing depends on it (see Unit 2's Coding environment note).
