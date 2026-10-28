# Simulations and Trainers
## Design and Build Context
*Covers every browser simulation (`*-sim-*`) and trainer (`*-trainer-*`): what each one is, how it is built and tested, and the evidence behind it.*

**Read with:**
- the unit `_context.md` (outcomes, misconceptions, depth ceiling). For STEAM, that is `steam/grade-[N]/_context.md`.
- `_site-context.md` (colours, routing).
- `_games-context.md`. Several of its rules apply here too, and this file names them rather than copying them.
- `research/simulations-research.md`, the evidence behind the design rules below.

---

## Sim, trainer or game?

| Kind | What it is | Can the student fail? | Rules |
|---|---|---|---|
| **Game** | A goal to reach, with a model behind it | Yes | `_games-context.md` |
| **Simulation** | A model the student changes and watches, with tasks beside free play | No: a wrong prediction is evidence, not a loss | This file |
| **Trainer** | Checked steps that follow a notes package or journal in order, then free play | A step's check can fail, and the student retries | This file |

If a build has a win and a loss, it is a game, even if it is called a lab.

---

## What's built

All are HTML only, with no markdown source: the HTML is the source. The v1 file of each sim is kept so old links work. The site links only the newest.

### Simulations

| File | Course · unit | Outcomes | What the student does | Model and simplifications | Save key | Test hook |
|---|---|---|---|---|---|---|
| `public/materials/sci7-photosynthesis-sim-v2.html` (*Plant Lab*) | Science 7 · Plants for Food and Fibre | 7-2-02, 7-2-03 | Changes the surroundings and the plant's parts, then reads glucose and plant health. 5 predict-then-test missions (soil, roots, phloem, sealed jar, white leaves). One wilting alert per run. | Glucose = the scarcest of (light captured, water at leaves, CO₂) × leaf share | `plantlab-v2` (finished missions, tour seen). Reads `plantlab-missions-v1` once. | `?debug=1` |
| `public/materials/sci7-flower-reproduction-sim-v2.html` (*Flower Lab*) | Science 7 · Plants for Food and Fibre | 7-2-04 | Changes the flower's parts and surroundings, runs a season, and reads where the chain from pollen to seed broke. 5 missions (petals, anthers, style, no bees, disease). One alert when the chain breaks while the flower is open. | Pollen reaching the ovary = pollen carried × pollen source × stigma × style | `flowerlab-v2`. Reads `flowerlab-missions-v1` once. | `?debug=1` |
| `public/materials/math-9/practice/math9-fraction-sim-v2.html` | Math 9 · Number: Rational numbers | Topic only (Math 9 has no local codes) | 3 tabs: equivalent fractions (bar model, with an "add to top and bottom" mode that shows the mistake), simplifying, and cross-cancelling (÷ needs a flip first). | Positive fractions only. The sign is handled in the notes. | `math9-fraction-tour-v2` (tour seen only) | None |
| `public/materials/math-9/practice/math9-pythagorean-sim-v1.html` | Math 9 · Number: Square roots, Section 3 | Topic only | 3 tabs: squares on the sides (with an angle slider from 30° to 150°), why it works (rearrangement), and scale it. Scale it gives specific feedback on 7 named errors. `#why` or `#scale` opens a tab. | Legs 1–12 | `math9-pythagorean-tour-v1` (tour seen only) | None |

Both Math sims use the same task panel. Each tab runs **Worked example → Try this → Explain it in your notes**, with **Watch out** boxes where a mistake is common.

### Trainers

| File | Course · unit | Follows | What the student does | Simplifications | Save key | Test hook |
|---|---|---|---|---|---|---|
| `public/materials/steam5-dash-trainer-v1.html` | STEAM 5 · Unit 1 Dash Bot | Notes Parts 1–3, Journal Parts A–D | Drags or taps blocks (drive, turn, beep, light, repeat, if/else) to drive a robot on a grid. 14 checked steps and 1 Extra, then free play. | The sensor is a count of empty squares. The blocks are simpler than the Blockly app's. Notes Part 4 (micro:bit) is not covered. | `steam5-dash-trainer-v1` | None |
| `public/materials/steam6-littlebits-trainer-v1.html` | STEAM 6 · Unit 1 littleBits | Notes Parts 1–4, Journal Steps 1–5 | Drags or taps bits into one chain and watches the signal travel. 12 checked steps and 1 Extra, then free play. | One straight chain. The light sensor passes the signal when the room is dark. A backwards bit stops the signal. The bit list comes from the notes, not the school's kits. | `steam6-littlebits-trainer-v1` | None |
| `public/materials/steam9-python-trainer-v1.html` | STEAM 9 · Unit 1 Python | Notes Concepts 1–4, Journal Part D | Writes and runs Python in the browser. 18 checked steps and 1 Extended, then an unchecked workshop for the game (Journal Parts A–G) and a playground. | Skulpt runs a subset of Python. There is no Java version (the Grade 9 language decision is still open). | `steam9-python-trainer-v1` | None |

Every trainer step names the page of the notes or journal it matches (its `paper` field) and gives hints after a failed check. The trainers share one layout: a step list, the task, and the workspace.

**What was and was not tested** for each one is in `_status.md` (search for the file name). None has been tried by students, on a touch screen, or on school devices.

---

## Build rules

1. **Shared with games.** `_games-context.md` build rules 1 (one HTML file), 2 (no CDN; a vendored library is pinned, with its licence), 8 (site fit) and 9 (cheap motion) apply as written. The Python Trainer is the one vendored case: Skulpt in `public/vendor/skulpt/` (MIT).
2. **Name and place.**
   - Sims are named `[subject]-[topic]-sim-v[N].html` and trainers `[subject]-[unit]-trainer-v[N].html`.
   - Science and STEAM files go in `public/materials/`. Math 9 files go in `public/materials/math-9/practice/`.
   - A significant rework is a new version file. The old file stays.
3. **Header comment.** Put it at the top of the `<style>` block or the first `<script>`. It gives:
   - the course, unit and outcome codes;
   - what the student does, in two lines;
   - the model in one line;
   - for a trainer, the notes and journal parts it follows.
   
   The Science 7 sims are the model to copy.
4. **Model apart from page.** The model goes in its own part of the script with no DOM calls (games build rule 5).
5. **Test hook.** `?debug=1` puts the model on `window` and turns saving off (games build rule 6). Every new build needs one. The Math sims and the trainers do not have it yet.
6. **Save only what helps a student come back.** That means finished missions, finished steps, and whether the tour was seen. Use a versioned key, check its shape on load, and start fresh if it does not fit. When a new version should keep progress, read the old key once (Plant Lab does this).

---

## Design rules

### Learning
1. **Named outcomes.** Every sim and trainer lists its outcomes in the header comment and shows an "I can" line under the title. The Science 7 sims do this. Math 9 sims name the topic and section of the notes instead of codes.
2. **A true model, with its limits named.** What the sim shows must be true at the unit's depth ceiling. Name every simplification in the header comment and in the table above. If a student could carry a simplification away as a misconception, say so on screen. The littleBits Trainer's single chain is an example.
3. **Guided, never free play alone.** Every sim gives tasks (missions, or a task panel) beside free play. Every trainer runs checked steps before its free play. Open exploration with no task teaches less than guided exploration (Alfieri et al. 2011; de Jong & van Joolingen 1998).
4. **Predict, then test.** A mission locks in the student's prediction before the run. When the evidence does not match, it asks what the student assumed. Predicting first is what makes a demonstration teach (Crouch et al. 2004).
5. **Change one thing at a time.** Tasks ask the student to change one setting and compare. Left alone, students change several at once and can't read the result (de Jong & van Joolingen 1998).
6. **Let the mistake fail on screen.** Take the misconceptions from the unit list and let the student try them. Examples:
   - the Fraction Simulator's "add to top and bottom" mode;
   - the Pythagorean angle slider;
   - the Pythagorean Simulator's feedback on named errors such as c² instead of c, or adding instead of subtracting.
7. **Back to paper.** Every task names where the student writes or explains:
   - in Science, the written prompt on each mission;
   - in Math, "Explain it in your notes";
   - in the trainers, each step's `paper` reference.
   
   Producing from memory happens here. The on-screen choices are recognition.
8. **Worked example first in Math.** Each Math tab opens with a worked example before "Try this".
9. **Trainers supplement the kit.** A trainer prepares students for the real robot, bits or editor. It never replaces time on them. Say what it leaves out (Dash: micro:bit; littleBits: the school's actual bits).

### Play
10. **The interface must be obvious.** If a student has to work out how to use the sim, they stop thinking about the science (Adams et al. 2008). Put icons on controls and use the unit's vocabulary. Detail sits behind a tap (games design rule 6).
11. **Tutorial on the real controls** (games design rule 7). It runs once on the first visit, can be skipped and replayed, and never blocks the controls. The Math sims have one tour per tab.
12. **At most one "What would help?" alert per run.** Use the games answer-table rule (games design rule 5): a choice is right only if it fixes the problem, and wrong only if it changes almost nothing.

### Access
13. Games design rules 12–15 apply as written: 44 px buttons and visible focus, 600 px wide, reduced motion, and never colour alone.

---

## Evidence check

`templates/evidence-design-principles.md` applies. How a sim or trainer meets its checklist:

| Checklist item | In a sim or trainer |
|---|---|
| Produce from memory | The written prompts only (rule 7). The choices are recognition. |
| Explain or justify | Mission write prompts; "Explain it in your notes"; "what did you assume?" after a wrong prediction |
| Prior content mixed in | Plant Lab joins plant systems and photosynthesis. The Pythagorean Simulator uses squares, square roots and similar triangles. The trainers reuse vocabulary from earlier grades (sequence, loop, conditional, debug). |
| Formative signal | Prediction results, step checks, the trainers' progress bar. **Gap:** no sim or trainer has a report to show a teacher (games design rule 4). |
| Worked example before practice | The tutorial; Math's Worked example box; the notes package each trainer follows |

---

## Test routine

Use the games test routine (`_games-context.md`):
- headless Chrome only, with scripted players;
- the same results when the model is meant to be unchanged;
- answer tables for alerts;
- every flow by click;
- screenshots at 1340, 1000 and 600 px;
- a list of what was not tested.

Also:
- **Trainers:** run every step's check with a right solution, a wrong one, and an empty one.
- **Math sims:** run many random problems through each tab's feedback and check that every named error gets its own message. The Pythagorean build ran 400.

---

## Adding one to the site

| Course | Where the link goes |
|---|---|
| Science 7 | `src/data/science7.ts` (`type: 'interactive'`) and the doc list in `src/pages/science7/view/[unit]/[doc].astro` |
| Math 9 | `src/data/math9.ts` (`path: 'practice/…'`) |
| STEAM | `trainer(…)` in `src/data/steam.ts` and the doc list in `src/pages/steam/view/[grade]/[doc].astro` |

Then add a row to the tables above and an entry to `_status.md` (what it does, what was tested, what was not). Push to `master` and check the Actions run.

---

## Known gaps

- The Math sims and all three trainers have no `?debug=1` hook and no "I can" line on screen. No sim or trainer has a teacher report.
- Plant Lab has no recording sheet or teacher notes. Grade 6 would need a cut-down version.
- The littleBits Trainer's bit list has not been matched to the school's kits.
- The Dash Trainer does not cover Notes Part 4 (micro:bit).
- The Python Trainer has no Java version, and the vendored Skulpt version was not recorded.
- None has been tried by students, on touch screens, or on school devices.
