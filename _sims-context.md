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
| `public/materials/math-9/practice/math9-fraction-sim-v2.html` | Math 9 · Number: Rational numbers | RN1–RN4 (parts) | 3 tabs: equivalent fractions (bar model, with an "add to top and bottom" mode that shows the mistake), simplifying, and cross-cancelling (÷ needs a flip first). | Positive fractions only. The sign is handled in the notes. | `math9-fraction-tour-v2` (tour seen only) | None |
| `public/materials/math-9/practice/math9-pythagorean-sim-v1.html` | Math 9 · Number: Square roots, Section 3 | SR3 | 3 tabs: squares on the sides (with an angle slider from 30° to 150°), why it works (rearrangement), and scale it. Scale it gives specific feedback on 7 named errors. `#why` or `#scale` opens a tab. | Legs 1–12 | `math9-pythagorean-tour-v1` (tour seen only) | None |
| `public/materials/math-9/practice/math9-linear-relations-sim-v1.html` (**superseded, not linked**: replaced by the Linear Relations Trainer below) | Math 9 · Algebra: Linear relations | LR1–LR4 | 4 tabs:<br>**LR1 Four views:** words, a sideways table, the equation and the graph change together. Tap a column to see it worked out. "Not linear?" shows a curve. A Mystery rule mode asks for m and b from one view; solving it draws the line.<br>**LR2 Slope:** drag P and Q along a line (the slope never changes) or freely. A rise/run triangle is drawn, plus a "make each slope" list (−3, 0, undefined, 1/2, 5, −5).<br>**LR3 y = mx + b:** m and b steppers; the line slides smoothly with the intercepts marked. Graph it: place the two points, then Check.<br>**LR4 Direct or partial:** two phone plans with a texts slider, a ×2 test, and a fee stepper. Sort 8 in a row. `#slope`, `#mxb` or `#vary` opens a tab. | Exact y = mx + b on an integer grid (x −6 to 10, y −6 to 12). Context presets keep y ≥ 0. Named errors: m and b swapped, slope sign, b read at x = 1, a y-value for the slope, rise/run swapped, the x-axis for the y-intercept, "both go up" means direct. | `math9-linear-relations-sim-v1` (tabs seen) | `?debug=1` (`window.SIM`) |

The Fraction and Pythagorean sims use the older light layout: a side task panel where each tab runs **Worked example → Try this → Explain it in your notes**, with **Watch out** boxes. The Linear Relations sim set the current look (see design rules 14–17): the same content opens in the **Task** and **In your notes** popups, and a one-line **Try this** strip stays on screen.

### Trainers

| File | Course · unit | Follows | What the student does | Simplifications | Save key | Test hook |
|---|---|---|---|---|---|---|
| `public/materials/steam5-dash-trainer-v1.html` | STEAM 5 · Unit 1 Dash Bot | Notes Parts 1–3, Journal Parts A–D | Drags or taps blocks (drive, turn, beep, light, repeat, if/else) to drive a robot on a grid. 14 checked steps and 1 Extra, then free play. | The sensor is a count of empty squares. The blocks are simpler than the Blockly app's. Notes Part 4 (micro:bit) is not covered. | `steam5-dash-trainer-v1` | None |
| `public/materials/steam6-littlebits-trainer-v1.html` | STEAM 6 · Unit 1 littleBits | Notes Parts 1–4, Journal Steps 1–5 | Drags or taps bits into one chain and watches the signal travel. 12 checked steps and 1 Extra, then free play. | One straight chain. The light sensor passes the signal when the room is dark. A backwards bit stops the signal. The bit list comes from the notes, not the school's kits. | `steam6-littlebits-trainer-v1` | None |
| `public/materials/steam9-python-trainer-v1.html` | STEAM 9 · Unit 1 Python | Notes Concepts 1–4, Journal Part D | Writes and runs Python in the browser. 18 checked steps and 1 Extended, then an unchecked workshop for the game (Journal Parts A–G) and a playground. | Skulpt runs a subset of Python. There is no Java version (the Grade 9 language decision is still open). | `steam9-python-trainer-v1` | None |

### Math 9 narrow trainers (design rules 19–25)

One page per topic, one narrow skill per tab, 10 items a round. Built from one shared shell (see build rule 7).

| File | Course · unit | Tabs (code · skill · picture) | Named errors | Save key | Test hook |
|---|---|---|---|---|---|
| `public/materials/math-9/practice/math9-linear-relations-trainer-v1.html` | Math 9 · Algebra: Linear relations | **LR1 Table:** write y = mx + b from a table (columns may start past x = 0); change arrows and work-back columns.<br>**LR2 Slope:** slope from two grid points; rise/run triangle and m = rise/run.<br>**LR3 Graph it:** tap two grid points for an equation.<br>**LR3 Equation:** write y = mx + b for a drawn line.<br>**LR4 Direct?:** direct or partial from a graph, table or equation. | m and b swapped, sign of m, run over rise, rise only, b read as the first y in the table, b on the x-axis, sign of b | `math9-linear-relations-trainer-v1` (last tab, best score per tab) | `?debug=1` (`window.DRILL`, `MODEL`) |
| `public/materials/math-9/practice/math9-linear-equations-trainer-v2.html` | Math 9 · Algebra: Linear equations and inequalities | **LE1 Two-step:** solve; a balance and the written steps play out.<br>**LE2 Brackets:** expand; arrows from the outside number and an area model.<br>**LE2 Both sides:** solve on the balance.<br>**LE3 Fractions:** type the equation after × LCD; a × LCD arrow under every term.<br>**LE4 Flip?:** pick < or > after one step; a test point checked in both lines.<br>**LE4 Graph it:** tap the boundary, pick ● or ○ and ← or →. | wrong inverse, dividing one term, not dividing, first term only, sign, adding the x term, an LCD term left out, no flip, flip when adding or dividing by a positive, boundary, dot, side, "3 < x" read backwards | `math9-linear-equations-trainer-v2` | `?debug=1` |
| `public/materials/math-9/practice/math9-polynomials-trainer-v2.html` | Math 9 · Algebra: Polynomials | **PO1 Parts:** degree, number of terms, constant, leading coefficient, a coefficient; term chips with degree badges.<br>**PO2 Like terms**, **PO3 Add**, **PO4 Subtract:** algebra tiles sort by shape, zero pairs fade; the subtracted row flips colour.<br>**PO5 Monomial ×**, **PO6 Binomial ×:** area models. | degree from the first term or the coefficient, terms vs degree, constant sign, leading coefficient from the first-written term, unlike terms combined, red tiles counted positive, minus not applied or applied to the first term only, x · x = x, first term only, middle term dropped or half added | `math9-polynomials-trainer-v2` | `?debug=1` |

LE5 (word problems) has no tab: it needs reading, and these pages keep text to a minimum. The workbook covers it.

### Older Math 9 trainers (superseded, not linked)

| File | Course · unit | Follows | What the student does | Simplifications | Save key | Test hook |
|---|---|---|---|---|---|---|
| `public/materials/math-9/practice/math9-linear-equations-trainer-v1.html` | Math 9 · Algebra: Linear equations and inequalities (LE1–LE5) | Notes Sections 1–5, then Mixed practice | Types each line of working. Every line is checked against the first one (same solution, or same solution set). A balance stays level or tips; for inequalities, a number line where a tap tests a point in the original, and the answer is shaded once solved. 12 steps of 3 problems (Mixed: 5 random). Predict boxes on LE1, LE3 and LE4. Word problems (Lethbridge hot chocolate, plumber, Edmonton catch-up) start with "write the first line", then an interpret question. **Show me** gives the next line and says why. | Linear in one letter, with exact fractions. Named errors: first-term distribution, a negative outside the brackets, LCD on some terms, the wrong inverse operation, dividing only one term, adding the x term instead of subtracting, flip and no-flip, the "or equal" part, the sign. | `math9-linear-equations-trainer-v1` | `?debug=1` (`window.TR`) |
| `public/materials/math-9/practice/math9-polynomials-trainer-v1.html` | Math 9 · Algebra: Polynomials (PO1–PO6) | Notes Sections 1–6, then Mixed practice | Types each answer.<br>**PO1:** names the parts (degree, leading coefficient, constant, type).<br>**PO2–PO4:** algebra tiles group like terms, cancel zero pairs, and flip colour for "Take the opposite".<br>**PO5–PO6:** an area model shows every partial product.<br>Equal but unsimplified answers are not accepted, and any order is accepted with a standard-form tip. | Exact integer arithmetic, degree up to 4 as in the notes (tiles only up to degree 2). Named errors: degree vs coefficient, the number of terms, the first-written term as leading, naming before combining like terms, adding unlike terms, the negative on the first term only, adding instead of subtracting, x·x = 2x, the first term only, the missing middle terms. | `math9-polynomials-trainer-v1` | `?debug=1` (`window.TR`) |

Every STEAM trainer step names the page of the notes or journal it matches (its `paper` field) and gives hints after a failed check. The STEAM trainers share one layout: a step list, the task, and the workspace. The two v1 Math 9 trainers used a full-window shell with a Goal strip and popups; the narrow trainers above replaced them (user request, 2026-10-29).

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
5. **Test hook.** `?debug=1` puts the model on `window` and turns saving off (games build rule 6). It also skips the first-visit popups and tutorial, and turns off tweens, so scripted checks are exact. Every new build needs one. The Fraction and Pythagorean sims and the STEAM trainers do not have it yet.
6. **Save only what helps a student come back.** That means finished missions, finished steps, and whether the tour was seen. Use a versioned key, check its shape on load, and start fresh if it does not fit. When a new version should keep progress, read the old key once (Plant Lab does this).
7. **Narrow trainers are stitched from one shell.** The exception to "the HTML is the source": the Math 9 narrow trainers are built by `scripts/drill/build.sh` from parts in `scripts/drill/`. Edit the parts, never the HTML.
   - Shared by every page: `shell-css.html` (look and layout), `kit.js` (exact fractions, seeded random), `shell.js` (tabs, rounds, checking, feedback, notes link, drawing helpers), `tail.html`.
   - Per page: `top-<p>.html` (title and header comment), `model-<p>.js` (generators and checkers, no DOM), `view-<p>.js` (pictures and the tab list).
   - A fix to the shell rebuilds every page with `sh scripts/drill/build.sh`. Test with `sh scripts/drill/test.sh` (prints failures only).
   - A new topic: copy a `top`, `model` and `view` trio, add its name to `build.sh` and `test.sh`, and write an `extra-<p>.js` with its named-error tests.

---

## Design rules

### Learning
1. **Named outcomes.** Every sim and trainer lists its outcome codes in the header comment and labels each tab or step with its code. Math 9 uses the local codes in `_courses/math-9/_context.md` (RN1–5, PE1–7, SR1–4, LR1–4, LE1–5, PO1–6, CG1–4, ME1–5, SI1–4, ST1–4, PR1–4). The "I can" line opens at the top of the Task popup, which shows automatically on a student's first visit. The Science 7 sims show it under the title.
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

### Layout and look (user request, 2026-10-28)
14. **Full window, nothing to scroll for.** The page fills the browser: a top bar, a one-line strip, and an app area (picture on the left, inputs on the right). Every toggle, input and its feedback stays on screen without scrolling at Chromebook size (1366 × 768, inside the site viewer) and at 1000 × 700. Phones (under 760 px) stack, with controls first. Ways to make it fit:
    - one **Explore / Challenge** switch per tab, so only one set of inputs is up at a time (LR1 Explore / Mystery rule; LR3 Explore / Graph it);
    - sideways tables;
    - a dropdown for long option lists;
    - icon-only top buttons under 1180 px;
    - a compact spacing mode under 700 px of height;
    - a prediction card that collapses to "Your prediction: …" once answered and hides after the first check.
    
    Test it: the scripted run reports the page and side-panel scroll sizes at both sizes, and they must match the window.
15. **Written material is a popup.** The intro, worked example, full Try this list, Watch out, the "I can", hints and In your notes open in a `<dialog>` from buttons in the top bar. Only a one-line **Try this** (sims) or **Goal** (trainers) strip stays on screen, with ‹ ›. Short feedback stays next to the input.
16. **3Blue1Brown look.** A near-black canvas with a bright, high-contrast palette:
    - blue `#58c4dd`, yellow `#f7d96f`, teal `#5cd0b3`, gold `#f0ac5f`, green `#83c167`, red `#fc6255`;
    - text `#f5f7fb` on panels `#0f1520`, and muted text `#a7b4c8` (still above 7:1);
    - every colour has the same job in every build: blue for the main line, P and slope; yellow for the thing you move or predict; green for right, intercepts and the solution; red for wrong and negative; gold and teal for rise and run, and for the tile powers.
    
    Equations are set in a math serif (Cambria Math) with italic letters. Labels on the canvas carry a dark halo so they read over grid lines.
17. **Motion that explains.** Values tween to their new place (a line slides when b changes), new lines draw themselves in, and a balance swings and settles. Rules:
    - Animate transform, opacity, or a value redrawn by `requestAnimationFrame`.
    - Keep the grid in its own layer, so a frame only redraws what moves.
    - Animation never carries meaning alone.
    - Reduced motion and `?debug=1` jump straight to the end.
18. **The viewer.** On the site, a `-sim-` or `-trainer-` page opens in the course viewer without the site nav. It gets a slim Back bar and a **⛶ Full screen** button (Math 9, Science 7 and STEAM viewers).

### Narrow trainer format (Math 9, user request 2026-10-29)
These pages are used **after** the lesson. They do not teach: they give practice on one narrow skill and point back to the notes. Where they differ from rules 3, 4, 8, 11 and 15, these rules win. Evidence: `research/simulations-research.md`, "Narrow practice after instruction".

19. **One narrow skill per tab.** A tab practises one thing (slope from two points, not "slope"; the sign flip, not "inequalities"). A few tabs share a page to save clicks. Tabs follow the notes order and carry the local code (LR2, PO4).
20. **Same format on every tab and page.** A top bar (name, tabs, 📖 notes link), the picture on the left, and one answer area on the right: a short label, the prompt, then answer boxes inside the math (`y = [ ]x + [ ]`), tap choices, or taps on the picture. Then **Check** and 👁 **Show me**, one feedback line, and 10 round dots.
21. **Little to no text.** No intro, tour, Task or Hint popups. The label is two to four words ("Find the slope"). Feedback is ✓ or ✗ plus a cue of six words or fewer. If a skill needs reading (word problems), it stays on paper.
22. **The picture does the explaining.** Each tab has one picture that makes the skill visible: a rise/run triangle, the balance with its written steps, × LCD arrows, a test point checked in both lines, tiles that sort and cancel, an area model. It is drawn for the question, then on a wrong try it shows the part the named error got wrong (a dashed triangle, the y-axis glowing, the missed term in red). Colour keeps one job per page (LR: m gold, b teal, lines blue).
23. **Two tries, then the answer.** First wrong try: ✗, the cue, and the picture hint. Second wrong try, or 👁: the answer fills in grey and the picture plays the full solution. Tap choices get one try. Dots: green on the first try, yellow on the second, red when shown.
24. **Point back to the notes.** The 📖 button opens the notes package at the tab's section, using a text fragment (`#:~:text=Section 2 —`), which jumps to the heading in Chrome. A round under 7 out of 10 shows the same link next to **Again**.
25. **Rounds, not progress bars.** Ten items, generated from the model (no repeats in a row), then a score, **Again**, and the next tab. The best score per tab is saved; 8 or more puts a green dot on the tab.

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
| Math 9 | `src/data/math9.ts`: `extras.unshift({ label, path: 'practice/…', type: 'interactive' })` on the topic, so it is first under Extra help |
| STEAM | `trainer(…)` in `src/data/steam.ts` and the doc list in `src/pages/steam/view/[grade]/[doc].astro` |

Then add a row to the tables above and an entry to `_status.md` (what it does, what was tested, what was not). Push to `master` and check the Actions run.

---

## Known gaps

- **Math 9 plan (2026-10-28, narrowed 2026-10-29):** one narrow trainer page per topic (rules 19–25), built a strand at a time.
  - Algebra is done: Linear Relations, Equations & Inequalities, Polynomials.
  - Still to build, all in the narrow format:
    - Number: Powers & Exponents, Rational Numbers (replacing the Fraction sim), Square Roots (replacing the Pythagorean sim);
    - Measurement & Geometry: Circle Geometry, Surface Area & Volume, Similarity;
    - Statistics & Probability: Statistics, Probability.
- **Narrow trainers:** the graph taps (LR3 Graph it, LE4 Graph it) have no keyboard route yet. The Monomial × answer row wraps onto two lines in the 330 px panel; it still fits without scrolling.
- **Not on the new layout and look yet (rules 14–17):** the Science 7 sims, the STEAM trainers, and the Fraction and Pythagorean sims (the last two are replaced in the Number batch).
- The Fraction and Pythagorean sims and the STEAM trainers have no `?debug=1` hook. No sim or trainer has a teacher report.
- Plant Lab has no recording sheet or teacher notes. Grade 6 would need a cut-down version.
- The littleBits Trainer's bit list has not been matched to the school's kits.
- The Dash Trainer does not cover Notes Part 4 (micro:bit).
- The Python Trainer has no Java version, and the vendored Skulpt version was not recorded.
- None has been tried by students, on touch screens, or on school devices.
