# STEAM — Grade 6 Year Plan
*Read alongside `steam/_context.md` (equipment map, unit archetype, evidence base — revised 2026-09), the STEAM progression research summary (planned, not yet written), and the design-thinking, graphic and web design research summary (planned, not yet written) (Grade 6 is still in that file's 5–6 band, deepening). Assumes Grade 5's vocabulary (sequence, loop, conditional, sensor, input, output, debug), one design-cycle pass repeated across three contexts, practice sketching multiple concepts before choosing one, and one produced video for a real audience.*

---

## Year at a Glance — revised 2026-09

**~40 sessions, 2 hrs each, ~80 hours, 24 weeks.** Four units, ~10 sessions / ~20 hours each. Primary platform: **littleBits** (Unit 1 only). Units 2–4 deliberately step outside a single robotics platform — this year is built around circuits, digital fabrication, structural engineering, and flight, not a robot ladder.

| Unit | Weeks | Sessions | Platform / focus | Constraint level | Capstone shape |
|---|---|---|---|---|---|
| 1. littleBits: Circuits, Algorithms & Sensors | 1–6 | ~10 | littleBits Bitsnap modules + app | Low–medium | Live demo + share |
| 2. 3D-Printed Bag Tag & Digital Portfolio | 7–12 | ~10 | Tinkercad + MakerBot Sketch; portfolio (website/slideshow) | Medium | Design review + published portfolio entry |
| 3. Bridges & Structures | 13–18 | ~10 | Craft/construction materials, load-bearing structures | Medium–high (budget + load) | Design review + load test |
| 4. Capstone: Glider / Airplane Build | 19–24 | ~10 | Paper + balsa wood, aerodynamics, research | High | Public share-out, presentation, produced video |

**A note on platform continuity:** the course-level equipment map treats micro:bit as deepening every year from Grade 5. This redesign doesn't touch micro:bit at all in Grade 6 — it returns in Grade 7's thermodynamics unit after a one-year gap. See the flag under Materials Needed and Sets Up for Grade 7; Grade 7's plan re-establishes micro:bit's basics briefly rather than assuming last year's fluency, since there isn't a "last year" for this tool this time.

---

## Unit 1 — littleBits: Circuits, Algorithms & Sensors

**Goal:** Establish littleBits as a concrete, snap-together circuit-building tool for computational thinking — Grade 5's vocabulary (sequence, loop, conditional, sensor, input, output, debug) reinforced in a new, more physically literal context. A wire becomes a visible sequence; a sensor bit becomes a visible input; this is a genuinely different modality from Dash/Scratch's on-screen blocks, and that difference is the point.

**CT vocabulary:** Reinforce sequence, loop (via a pulse/oscillator bit), conditional (via a sensor-triggered bit — light, sound, or button), input, output, and debug by name in this new context. Add **circuit** and **signal/power flow** as new terms.

**Activities:**
- Build a simple circuit: power → input (button/sensor) → output (LED/buzzer/motor) — sequence made physical
- Use a pulse/blink bit to create a repeating behavior, naming it explicitly as the same idea as a loop block
- Use a light or sound sensor bit to trigger a different output depending on a condition — a direct physical echo of the conditional concept
- Combine three or more bits into a chain producing a multi-step behavior, and explain the sequence out loud
- **Physical build fork (student or group choice):** a simple game (e.g., a reaction-time or trivia buzzer using button + sound + light bits) **or** a simple instrument (a light- or motion-triggered sound maker). Present both as equally valid — this is a genuine choice, not a default with an alternate.

**Trainer:** `public/materials/steam6-littlebits-trainer-v1.html` is an on-screen bench for practice alongside the notes — students drag bits (power, wire, button, light sensor, sound sensor, pulse, LED, buzzer, motor) into one chain and watch the signal travel along it. Its 12 checked steps follow Notes Parts 1–4 and Journal Steps 1–5 and send students back to paper and to the real bits. It is a simplified model, not a replacement for the kit: one straight chain only, the light sensor passes the signal when the room is dark, a backwards bit stops the signal, and the bit list is taken from the notes, not from the school's inventory (still an open item).

**Construction/spatial tie-in:** Mounting bits onto a simple housing/enclosure (cardboard or similar) requires basic spatial planning — where a sensor needs a clear "view," where the battery/wiring needs to sit without blocking anything.

**Design & Media:** Before building, students sketch a simple circuit diagram (a labeled block-and-arrow convention, not real schematic symbols) showing power → input → output and predicting what will happen — a first, concrete attempt at diagramming something invisible (signal flow), a harder abstraction than a maze map. This is the unit's dedicated non-robot art/design task. For the game/instrument fork, students sketch two different housing concepts before building either.

**Culminating artifact:** A working littleBits circuit (game or instrument) including at least one input, one conditional/sensor response, and one repeating (loop) behavior, demonstrated live with a verbal walkthrough of what each bit does and why it's there.

**Learning outcomes:**
- Students can build a circuit that sequences power through an input to an output and explain the signal path.
- Students can use a sensor bit to create a conditional response and explain, in their own words, what condition triggers it.
- Students can use a bit that produces a repeating behavior and describe why it functions like a loop from a program.
- Students can diagram a simple circuit before building it and predict what it will do.

**Misconception to watch:** Students may think littleBits isn't "real coding" because there's no screen, text, or blocks. Correct this directly: the sequence/loop/conditional logic from Dash and Scratch is the same logic, expressed as physical electrical connections instead of on-screen blocks. This is a valuable, explicit cross-modality transfer moment — CT is about the logic, not the tool.

---

## Unit 2 — 3D-Printed Bag Tag & Digital Portfolio

**Goal:** First hands-on 3D printing in the sequence (per the equipment map, Grade 6 is the intro grade), paired with starting a running digital portfolio — students design something small and personal as a low-stakes first CAD project, then document it as their first portfolio entry.

**New skill:** CAD in Tinkercad — basic shapes, extrude, combine/subtract (a hole for a keyring loop), the text tool (personalize with initials or a name), resize.

**Activities:**
- Guided Tinkercad tutorial: build a simple bag tag (a basic shape + a hole + personalized text)
- Extend the guided design with a genuine choice beyond the tutorial (own shape, icon, or pattern) — a first real design decision inside a structured template, appropriate scaffolding for a first CAD unit
- Submit for print; while prints queue (prints take hours — see the course-level pacing note), work on the portfolio piece in parallel rather than waiting
- Build a first portfolio entry — a website page, a slideshow, or both (tool choice flagged as an open item) — documenting the project: what was designed, why, a photo of the printed result, and one thing they'd change
- Apply grid/hierarchy/contrast (named explicitly, continuing the Art & Media Strand thread) to the portfolio page's layout — Grade 6's first paper-to-digital graphic-design transfer, earlier than the course-level table's 7–8 band suggests, because a portfolio page is a natural, low-stakes vehicle for it; keep it light and guided

**Design & Media:** Before opening Tinkercad, students sketch two different bag tag concepts (shape, icon/pattern, text placement) and choose the stronger one — the "concepts before refinement" rule's second application this year. Before building the portfolio page, students sketch a simple layout wireframe on paper (photo placement, text placement) — paper-first, matching the course-level Art & Media Strand's 5–6-band guidance for web/UX (paper-prototype only).

**Culminating artifact:** A printed, personalized bag tag, plus a portfolio entry (website and/or slideshow) documenting the design-print process with a photo of the result and a short reflection.

**Learning outcomes:**
- Students can design a simple functional object in Tinkercad (shape + modification + personalization) and submit it for printing.
- Students can describe any gap between their digital design and the printed result.
- Students can build a simple layout, paper-first then digital, applying grid/hierarchy/contrast vocabulary.
- Students can document a design process as a portfolio artifact.

**Misconception to watch:** Students often assume "if it looks right on screen, it will print correctly" — a first encounter with the CAD-to-physical gap (thin walls, unsupported overhangs, a hole too small for a keyring). Let a design flaw show up in the print rather than pre-correcting every design, matching the "let the test reveal the problem" pattern from Grade 5's slow coaster.

---

## Unit 3 — Bridges & Structures

**Goal:** This year's Build Challenge unit: mechanism/structural literacy, load-bearing engineering under a budget constraint, and a first explicit encounter with structural failure as data rather than as a mistake to avoid.

**Core engineering ideas (taught just deep enough to use):** how shape (a triangle vs. an unbraced square/rectangle) resists deformation under load; how a beam or truss distributes weight; the difference between failing by bending, buckling, or simply being unsupported — introduced through quick hands-on tests (a flat paper strip spanning a gap vs. a folded/corrugated one; a braced triangle vs. an unbraced square) before students design anything.

**Constraint (introduced explicitly):** A fixed materials budget (a set number of craft sticks/straws, a limited amount of tape) and a stated span the bridge must cross, tested by adding weight incrementally until failure or a target load is reached — a genuine budget-and-load competing-constraint pair, in the same shape as Grade 5's competing time constraint but with a structural-engineering flavor that sets up Grade 8–9's later load work.

**Activities:** Material/shape tests before designing (triangle vs. square bracing; single-layer vs. folded beam); design and build a bridge spanning the fixed distance within budget; test with incremental weight, recording the load at failure or success; redesign at least once based on results.

**Design & Media:** Sketch two or more distinct bridge/truss concepts before choosing one, labeled with a prediction of where load will concentrate — continuing the "predict before testing" pattern. The design-review artifact (sketch + material list) is treated as a real drawn plan, as in Grade 5's coaster and filter cross-section. Before final build, pairs present their plan to another pair, who predict where the structure will fail first and compare that prediction to the actual test result — the year's second application of this predict-then-compare peer step (after Unit 1's game/instrument, more loosely).

**Culminating artifact:** A bridge tested to a stated load or until failure, a design review, and a short reflection on what changed between sketch and built/tested version, and what any failure point revealed.

**Learning outcomes:**
- Students can explain how shape (e.g., triangulation) affects a structure's ability to resist load, using the vocabulary of forces, not just "it's stronger."
- Students can design and build a structure within a stated materials budget that spans a fixed distance.
- Students can predict a likely failure point before testing and compare it to the actual result.
- Students can complete a full design cycle including redesign based on load-test data.

**Misconception to watch:** Students often believe "more material = stronger," rather than understanding that shape/geometry matters more than raw material quantity — the budget constraint exists specifically to force this realization, since unlimited material would let students brute-force strength without engaging the geometry. A related misconception: assuming a structure that "looks sturdy" will hold weight — let the incremental load test surface a wrong prediction rather than pre-correcting it.

---

## Unit 4 — Capstone: Glider / Airplane Build

**Goal:** Fully open-ended capstone using paper and balsa wood — full design cycle, research, presentation, and a produced video. First time flight/aerodynamics enters the sequence.

**Core science ideas:** the four forces of flight (lift, weight, thrust, drag) at an age-appropriate level; how wing shape/area and weight distribution affect glide distance and stability — introduced through quick hands-on tests (a flat sheet of paper vs. a folded-wing glider; nose-heavy vs. balanced) before students design their own.

**Research component (before designing):** Students research and note one real fact connecting to flight — a real aircraft/glider design principle, a historical aviation milestone, or how one of the four forces is engineered in a real plane. This grounds the build in real content before design choices are made, matching Grade 5 Unit 3's "container before engine" pattern.

**Brief:** "Design, build, and test a glider or paper-and-balsa airplane that maximizes [a stated target — distance, flight time, or straightness/stability], within a stated materials and size budget." Students choose paper, balsa, or a hybrid — the year's most open material choice yet.

**Activities:**
- Force-of-flight demonstrations before designing
- Research task, shared briefly with the class before designing
- Sketch three or more distinct design concepts (wing shape, tail design, weight placement) before choosing one — the year's clearest application of the "3+ concepts" rule, since flight performance is sensitive to small design choices
- Build and test-fly; log distance/time/stability for each test
- Redesign at least once based on flight-test data (weight, wing shape/angle, tail)
- Peer design review before the final test round: reviewers predict the design's biggest weakness (too nose-heavy, too much drag, unstable), continuing Unit 3's predict-then-compare pattern

**Design & Media:** The concept-sketch step above is this unit's dedicated non-robot art/design task. Students also prepare a short research presentation (poster, slides, or spoken with a visual aid) connecting their researched fact to their own design choices — explicit design-decision justification, a lighter-weight version of Grade 9's later "annotated concept sketches presented to justify a decision."

**Video (capstone share-and-reflect):** Students storyboard their share-out (research fact, design concepts, what the flight tests showed, what changed) in 4–6 boxes before filming. The video is a short (60–90 second) phone/tablet recording, with students taking a bit more control of filming and narration than Grade 5's version, narrating the design story and one specific redesign made from test data.

**Culminating artifact + share-out:** A flight-tested glider/plane with logged data across at least one redesign, a short research-based presentation, the produced video, and a live share-out — a class flight competition or demo is a natural fit — plus a short reflection.

**Learning outcomes:**
- Students can explain, using the vocabulary of the four forces of flight, why a specific design choice affects glide performance.
- Students can research and cite one real fact about flight/aviation and connect it explicitly to a decision in their own design.
- Students can generate three or more distinct design concepts before choosing one, and identify the reasoning behind their final choice.
- Students can complete a full design cycle including at least one redesign driven by flight-test data.
- Students can present their design process and decisions, including research, to an audience.

**Misconception to watch:** Students often think "bigger wings always mean better flight" or that weight is simply good or bad, without reasoning about the lift/weight balance — let a too-heavy or too-light first design fail the flight test rather than pre-correcting it. A second misconception: assuming a paper plane's fold pattern is decorative rather than functionally tied to the forces at work — the research task exists partly to counter this.

---

## Materials Needed

- littleBits kits (class set — confirm exact kit/bit inventory) for Unit 1
- Basic enclosure/housing materials (cardboard, tape) for the Unit 1 game/instrument build
- Tinkercad accounts + MakerBot Sketch print access, with queue time built into Unit 2's pacing
- Bag-tag hardware: keyring loops/split rings for the finished printed tags
- Portfolio tool: a website builder or slideshow tool (**confirm which is available/licensed — flagged in the course-level Open Items**)
- Bridge/structure materials: craft sticks, straws, cardboard, string, tape, and a materials-budget tracking system (points/tokens)
- Calibrated weights or a simple standardized load-testing setup (washers, small weighted cups) for Unit 3's incremental load test
- Glider/plane materials: assorted paper, balsa wood sheets/sticks, glue, basic cutting tools, a consistent flight-test space (gym or hallway), and a tape measure/stopwatch for logging
- Sketchbooks/blank paper for all four units' sketch/diagram tasks
- A phone or tablet with a camera for the Unit 4 video

**3D printer (MakerBot Sketch):** hands-on this grade for the first time (Unit 2) — light, guided use; heavier independent use follows in Grade 8–9.

**Note — micro:bit gap:** this redesign doesn't touch micro:bit in Grade 6 at all, unlike the original ladder's every-year deepening. It returns in Grade 7's thermodynamics unit after a one-year gap — Grade 7's plan re-establishes basics briefly rather than assuming continued fluency.

---

## Sets Up for Grade 7

Students should leave Grade 6 comfortable naming circuit-level input/output/conditional/loop concepts in a non-screen context (littleBits), fluent with a first real CAD-to-print pass (Tinkercad → MakerBot Sketch), practiced in load-bearing structural reasoning (triangulation, budget-constrained building, predicting failure points before testing), and having researched and presented on a real-world science connection (flight) tied explicitly to their own design choices. They should have generated multiple concepts before choosing at least three times this year (Units 1, 2, and 4), taken a first paper-to-digital step in graphic design (the portfolio layout), and made and narrated one video with more independent camera/narration control than Grade 5's. Grade 7 assumes all of this and reintroduces micro:bit (after this year's gap) inside a new thermodynamics context, plus a return to a coding-and-build platform (Spike Prime) after this year's non-platform circuits/print/structures/flight sequence.
