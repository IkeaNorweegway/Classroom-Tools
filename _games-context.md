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
| `cefl/cefl7-income-tax-game-v2.html` (*Payday*, CEFL Town mission) | 7-IT | Walk a top-down town. 4 chapters, 2 paycheques each: plan the jar at home, work a shift, build the stub at the bank or check the boss's stub and sign or dispute it, deposit. 10–15 minutes a chapter. Between lessons: 10 paid help requests from townspeople, Town Mail, Pat's stall. | `cefl-town-7-income-tax-v1` + shared `cefl-town-profile-v1` | `?debug=1` (`window.CEFLTownDebug`); model block runs in Node |
| `cefl/cefl7-income-tax-game-v1.html` | 7-IT | The first, panel-based Payday. Kept for old links; the site links v2. | `cefl7-payday-v1` | `?debug=1` |

The v1 file of each game is kept so old links work. Nothing links to them.

---

## CEFL Town (all CEFL missions)

**One shared town for every CEFL unit in Grades 7–9** (decided 2026-10-17). Each unit is a **mission** in the same top-down town, in the style of early Pokémon or the original Zelda. The student walks between buildings, townspeople give the tasks, and the student does or checks real work. Every mission is a **companion** to its project: one chapter after each of Steps 1–4, and each chapter ends by sending the student to do that step for real. Never let the game do the project's work for the student. Built so far: Grade 7 Income and Tax (*Payday*). Planned missions for the other 14 units are in `_status.md`.

**Exception to build rule 1.** A CEFL mission is not one HTML file. Fifteen copies of an engine and a map could not be kept in sync, so CEFL Town shares its files:

| File | What it holds |
|---|---|
| `public/vendor/kenney-rpg-urban/` | Kenney *RPG Urban Pack* 1.0 (CC0): `tilemap_packed.png` (27 × 18 tiles of 16 px) and `License.txt`. All town, character and furniture art. |
| `public/materials/cefl/town/art.js` | Draws tiles; builds characters by recolouring the pack's 6 bases (skin, hair, shirt, trousers) and adding job outfits (apron, hi-vis, hard hat and more) |
| `town/world.js` | The town map (78 × 58): 11 named districts (College Hill, Main Street, Town Square, Market Lane, Riverside and others), the river with three bridges, paths to every door, landmarks (fountain, sports field, community garden, Riverside Park), 6 street signs, 26 buildings in six styles and many sizes; small rooms (9 × 7) whose key person or thing stands on a rug; the base townspeople. No DOM. |
| `town/engine.js` | Movement, camera (rooms zoom in to fill the view), doors, dialogue, quests, panels, HUD, Bag, Menu, the **Town Map** (M key: districts, buildings, you, your goal), district-name banners, saves, avatar editor, tutorial, report, the test hook; **between lessons**: the soft gate, help requests and news, Town Mail, the wallet, Pat's stall, the closet, home decorations, the calculate verb (`api.calc`), the save code |
| `town/town.css` | Shared styles (CEFL ochre) |
| `town/missions/<grade>-<unit>.js` | One mission: its model (no DOM), chapters, panels, items, report |
| `cefl[G]-[unit]-game-v[N].html` | A thin entry page the site links: `<div id="town" data-mission="…">` and the script tags |

**The character** is the student's own avatar (style, skin tone, hair, shirt and first name only), saved in `cefl-town-profile-v1` and shared by every mission on that browser. Money missions use "future you" situations. Avery, Dev and Rosa are townspeople. The town remembers you: finishing a mission adds its outfit to the closet and a page to the **My Plan wall** at home. This mirrors the course's My Plan portfolio.

**The work verbs** a mission mixes:
1. **Calculate at a counter:** typed amounts, checked to ±2¢. A wrong try gets a hint in Gentle; the answer shows after 2 tries in Real or 3 in Gentle.
2. **Sign or dispute:** a townsperson's document with one possible root mistake. The student taps the wrong line and disputes it, or signs. Signing a wrong document costs something in the model. Flagging a line that only follows from the mistake gets "look earlier". Gentle warns once before a wrong signature.
3. **Inspect a scene:** tap the hotspots (planned for 7 Experiences safety and 9 Labour Market résumés).
4. **Interview:** visit townspeople to fill an item (Payday's Deduction Map).
5. **Run it:** time passes on a calendar strip while the model runs.

**Between lessons** (added 2026-10-18). CEFL meets every third day, so the town stays open between chapters:
- **The soft gate.** After a chapter the break panel offers **Start Chapter N** or **Not yet: help around town**. "Not yet" saves `G.gate`; the quest line says which Step the next chapter waits for and walks to someone who needs help. The chapter starts from the Menu or by talking to the mission's `guide`. A reload while gated stays in free roam. It is an honour system, not a lock.
- **Help requests** (`helpers`). Once a chapter is done, townspeople have the same problem in their own lives and pay a little to have it solved. A gold round **$** bubble marks them (the quest marker is square). Each request can be done once a day and gets new numbers each time (seed = id + count). The student may say "Not right now", or **Leave it for now** before checking; leaving after checking is not offered, so shown answers cannot be farmed.
- **News** (`gossip`). Short story lines that open by chapter, one per talk, before a request. A white round **…** bubble marks them. They tell the mission's side story; they never give away the next chapter.
- **Town Mail** (`mail`). At most one letter a day (local date), from a chapter already done. An unread letter waits; letters never pile up, and there are no streaks. The **📬 Mail** button in the HUD opens it.
- **The pay rule.** Right on the first try: full pay. By the second try: half. After that, or when the answer was shown, or a wrong document was signed: thanks only. Pay is $5–$12 a task.
- **The wallet** is in the profile (`P.wallet`), shared by every mission, and **never touches a mission's model**, so helping cannot change who wins. It buys things at **Pat's market stall** (Town Square): six home decorations, drawn in the home room in every mission, and four outfits for the **closet** (at home; it also holds mission outfits). Home cells are fixed (see `placeDecor`): the side columns and top row of the home room are its only walkways, so a mission must not put solid things there.
- **Take your town home** (Menu). The profile and every `cefl-town-*-v1` save become one code (gzip + base64 + checksum, about 1,600 characters) to copy into a doc or email, or a `.txt` file. Loading checks each part's shape, shows what the code holds, and asks before it replaces this browser's game.
- **Report.** The engine adds a **Between lessons** table: each task, who it was for, first try or not, and pay.

**A side story told by the townspeople** (added 2026-10-18, Payday first). The user asked for townspeople to bring the mission's problem in slowly, through clues, so the student ends up the hero. The pattern:
- **A hunch before the skill.** In Chapter 1 someone says something is off (Payday: Mo, "I feel like my boss gave me the wrong amount of money on my cheque"). The student cannot check it yet, so the hunch goes into a **Case notes** item in the Bag.
- **Proof once the skill is taught.** Each later chapter brings a clue the student checks with that chapter's skill: Mo's stub after the first typed stub (Ch 2), a friend's stub with a *different* mistake (Ch 3), and short clues dropped by the people the chapter already visits (Jas, Grandpa, Nurse Kaur). The source (Milo, who made Pay-O-Matic) appears once the pattern is visible.
- **The hero beat is work.** At Town Hall the student names the mistake on every stub in their notes (`case` panel), then fixes the cause (`fix` panel: Pay-O-Matic's six settings are the six mistake kinds). A last scene thanks them by name (the "{name} Rule") and gives a medal for the Bag.
- **Rules:** the story beats are chapter steps, so every student meets them; news lines fill in around them and never get ahead. The story never touches the model, so it cannot change who wins, and the hero beat happens whether or not the goal is reached. Story tasks use `api.calc({ noPay: true })` (no pay wording, no "Leave it for now") and record their answers like any question. Townspeople's idle lines follow the story's stage. A scene that moves people (Mo in the bank, the Town Hall crowd) is a flag in the mission state that `people(S)` reads; the step sets it at its start, so it is safe to run again.
- **Every future mission** gets a side story of the same shape: a hunch in Chapter 1, one clue per chapter checked with that chapter's skill, a source, and a hero beat that is the unit's skill applied in public.

**Adding a mission:**
- Write `town/missions/<slug>.js`, calling `CEFLTown.mission({ id, title, iCan, chapters, init, validate, chapterSteps, people, doorOpen, talk, hud, items, report, … })`.
- Each chapter is a list of steps. The save holds (chapter, step), so a step must be safe to run again from its start. Guard model changes, as Payday's bank step does with "never pay twice".
- A step awaits `api.quest(text, id)` (resolves when the student talks to that person or object, or enters `door:<building>`), then `api.say` / `api.ask` / `api.choose` / `api.panel`.
- Add the thin entry page and one line to the `games` map in `src/data/cefl.ts`.
- **Between lessons:** give `guide` (the person who starts a chapter during the gate), `helpers(S, api)` → `[{ id, who, after, pay, label, ask, run(api, seed) → 'first' | 'second' | 'later' | null }]` (3–4 per chapter, the person's own version of what the chapter taught), `gossip(S, api)` → `[{ id, who, after, lines }]` (2–3 lines a chapter for the mission's side story), and `mail(S, seed, lastDone, api)` → `{ label, from, pay, run(api) }`. `after` is the chapter index that must be done (−1 = from the start). Put their generators in a `HELP START … HELP END` model block (no DOM) on fresh seeds, never on the run. Use `api.calc` for typed amounts.
- Use the existing buildings. New ones go into `world.js` for every mission, with a path from the door to a walk. Keep every doorstep clear (the map builder skips decor on paths and doorsteps) and rerun the navigation test.

**Testing a mission** (scripts from the Payday build are described in `_status.md`):
- **Node:** run the model block (careful player always wins; gross-pay, do-nothing and too-cautious players never do; answer tables clean).
- **Scripted player in headless Chrome:** drives `CEFLTownDebug` through every situation, job and mode, and a wrong-first run.
- **Navigation test:** BFS from the spawn point to every door and every person in every room; door in and out; tap-walk; quest auto-walk; idle frames = 0.
- **Resume and profile:** `?debug=1&save=1` keeps saving on for reload and profile carry-over tests. Plain `?debug=1` keeps saves in memory only, so the save code can be tested without touching the browser.
- **Between lessons:** `CEFLTownDebug.setDayShift(n)` moves the calendar; `openHelps()`, `runHelp(id)`, `checkMail()`, `readMail()`, `buy(id)`, `encodeSave()` / `decodeSave()` / `applyImport()` drive the rest. Check the pay rule for right, wrong-then-right and wrong answers on every request, and home-room reachability with everything bought, family home and the goal placed.
- **Serve over HTTP:** `python3 -m http.server` in `public/`. Under `file://` the recolouring cannot read the sheet's pixels.
- **Headless walking:** in headless Chrome, animation frames barely advance with virtual time. Use `CEFLTownDebug.tickNow()` to finish a walk, rather than waiting on frames.

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
9. **Cheap motion.** Animate `transform` and `opacity`, not `width`, `height`, or `box-shadow`: a bar is full size and slides inside a clipped track, and a glow is a ring that fades. In a frame loop, write a style or attribute only when its value changes (Seed to Seed's `setAttr`), since rewriting the same value still makes the browser lay out and repaint. Decorative loops (rays, sway) stop while the clock is stopped. School Chromebooks are slow, so a fast laptop proves nothing.

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
