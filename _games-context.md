# Games
## Design and Build Context
*Governs every browser game in this workspace: what one must do, how it is built, and how it is tested.*

**Covers:** games only. A game has a goal, and the student can fail to reach it. Simulations (`*-sim-*`) and trainers (`*-trainer-*`) are not covered here yet; do not apply these rules to them.

**Read with:** the unit `_context.md` in `_courses/` (outcomes, misconceptions, depth ceiling) and `_site-context.md` (colours, routing).

---

## Games built so far

All are in `public/materials/`. They have no markdown source: the HTML file is the source.

| Game | Outcomes | Play | Save key (`localStorage`) | Test hook |
|---|---|---|---|---|
| `sci7-seed-to-seed-game-v2.html` | 7-2-02 to 7-2-05 | Real time. Grow one strawberry on glucose, then choose an offspring. 5 generations, about 12 minutes each. | `sci7-seed-to-seed-v2` (whole game) | `?debug=1` |
| `sci7-flower-field-game-v2.html` | 7-2-04 | Turn-based. Set flower parts and surroundings, grow a season, read where offspring were lost. Four levels with stars, 7 to 10 seasons each. | `flowerfield-v2` (stars, answers, level in progress) | `?debug=1` |
| `sci7-clone-field-game-v2.html` | 7-2-04 | Same shell as Flower Field, with runners, tubers, and cuttings. | `clonefield-v2` (same) | `?debug=1` |

The v1 file of each game is kept so old links work. Nothing links to them.

**Seed to Seed v2 is the reference build.** Copy its patterns before inventing new ones.

**Known gaps against the rules below:**
- Flower Field and Clone Field v2: Gentle and Real differ only in the hint (a level can be lost in both). The shared shell is the same code in two files, so a change to one must be made in the other.
- All three: the question choices are recognition, so "produce from memory" rests on the typed answers alone.

What was and was not tested for each game is in `_status.md`.

---

## Build rules

1. **One HTML file** in `public/materials/`, hand-written, with its CSS and JavaScript inside it. The three current games use no libraries.
2. **Libraries.** Never load one from an outside server (a CDN). The school filter can block it and an outage breaks the game with nothing changed here. A copy saved in `public/vendor/` is allowed when a game needs physics, sprites, or sound. Pin the version, keep the licence file with it, and name the library and the reason in the header comment. Expect a larger download, updates by hand, and a model that is harder to test by script.
3. **Name:** `[subject]-[topic]-game-v[N].html`. A significant rework is a new version file. The old file stays, and the site links only to the newest.
4. **Header comment** at the top of the `<style>` block: course, unit, outcome codes, how the game plays in two lines, and the model in one line.
5. **Model apart from page.** The rules of the game sit in their own part of the script with no DOM calls, so a scripted player can run a whole game without the page.
6. **Test hook.** `?debug=1` puts the model's functions on `window` and turns saving off.
7. **Save** to `localStorage` under a versioned key, check the shape on load, and fall back to a new game if it does not fit. A new version file gets a new key.
8. **Site fit.** Use the course accent from `_site-context.md`. The game runs inside the site's iframe viewer, so it must not depend on the page height or on being the top window.

---

## Design rules

### Learning
1. **Named outcomes.** Every game maps to outcome codes from the unit context and shows an "I can" line under the title.
2. **A true model.** What wins the game must be what is true in the science, at the unit's depth ceiling. Name every simplification in the header comment and in `_status.md`. If a student can win by doing something scientifically wrong, the model is broken.
3. **Reasoning, not recall.** At least once per round the student explains a choice. Choose-the-explanation prompts offer full explanations, and the wrong ones come from the unit's misconception list. Typed reasoning (Seed to Seed's breeder's note) or a notebook prompt (the Field games) counts.
4. **Something to show a teacher.** A report of results, first-try answers, and anything the student typed.
5. **Never mark a useful choice wrong.** In a "What would help?" question, a choice is right only if it fixes the biggest loss, and wrong only if it changes almost nothing. Choices that help a little are left out. Test the answer table against the model (see the test routine).

### Play
6. **Icons before text.** One short sentence where words are needed. Detail sits behind a tap. Use the unit's vocabulary ("limiting", "xylem") and do not replace it with easier words.
7. **Teach on the real controls.** A short tutorial points at the actual buttons, has the student do one real action, can be skipped, and can be replayed.
8. **When trouble starts, stop and ask.** Show what is going wrong, then ask "What would help?" with real actions as the choices. A wrong pick gets one line of why and another try. The right pick points at the control.
9. **Limit the stops.** Seed to Seed v2: none in the first 3 days, any alert at most every 3 days, the same kind at most every 10, and a kind becomes a one-line note after two first-try answers or four showings. In a turn-based game (the Field games): ask only when the field grew by under 3 points or the same step lost the most twice running, never two seasons in a row, and stop asking about a step after two first-try answers or four showings.
10. **Two difficulties** where the game can be lost: a forgiving mode with hints, and a real mode without them.
11. **Pacing.** State how long one round takes. A round fits inside a class period. A game longer than one period saves itself.

### Access
12. Buttons at least 44 px high, visible keyboard focus, and `aria-live` on feedback text.
13. Usable at 600 px wide with no sideways scrolling.
14. Motion carries meaning (water moving up, a bee reaching a flower). `prefers-reduced-motion` turns it off and the game still makes sense.
15. Never colour alone: pair it with a word, an icon, or a position.

---

## Evidence check

`templates/evidence-design-principles.md` applies to games. How a game meets its checklist:

| Checklist item | In a game |
|---|---|
| Explain or justify | Rule 3: choose-the-explanation prompts and typed reasoning |
| Formative signal | Rules 4 and 8: the report, and alerts that show which idea the student is missing |
| Worked example before practice | Rule 7: the tutorial |
| Prior content mixed in | A game that spans several outcomes (Seed to Seed joins plant systems, photosynthesis, and reproduction) |
| Produce from memory | The typed answers only: the breeder's note in Seed to Seed, the explanation after each win in the Field games. The question choices are recognition. |

---

## Test routine

This machine has no Node. Headless Chrome is the only way to run a page: `chrome.exe --headless=new` with `--dump-dom` or `--screenshot`.

1. **Scripted players.** Copy the game to a temp folder with a test script added before `</body>`, open it with `?debug=1`, and write results into the page for `--dump-dom` to return. Run a sensible player, one that does nothing, and one that does the wrong thing.
2. **Unchanged model.** When a new version is meant to keep the model, run the same players and seeds through both versions. The results must match exactly.
3. **Answer tables.** For a game with "What would help?" questions, start from many random states, apply every offered choice, and run the next season over many seeds. No choice marked wrong may beat the right one.
4. **Every flow by click:** start, tutorial, each alert and prompt, a win, a loss, the end-of-round choice, the report.
5. **Screenshots** at 1340, 1000, and 600 px wide.
6. **Headless quirks.** Virtual time barely advances `requestAnimationFrame`, so step the model from the script. A CSS transition can be caught part-way. A page that has scrolled screenshots with a blank band at the top.
7. **Say what was not tested.** Real-time pacing, touch, school devices, and play by students cannot be checked here. List them in `_status.md` every time.

---

## Adding a game to the site

1. Add the file name (no extension) to the unit's list in the course's `src/pages/[course]/view/.../[doc].astro`.
2. Link it from the unit's materials page with the violet `Game` badge.
3. Update `_status.md`: what it does, what was tested, what was not.
4. Push to `master`. The site build cannot be run locally, so check the Actions run. `gh` is not installed; use `https://api.github.com/repos/IkeaNorweegway/Classroom-Tools/actions/runs`.
