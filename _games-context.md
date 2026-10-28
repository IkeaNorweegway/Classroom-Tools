# Games
## Design and Build Context
*Governs every browser game in this workspace: what one must do, how it is built, and how it is tested.*

**Covers:** games only. A game has a goal, and the student can fail to reach it. Simulations (`*-sim-*`) and trainers (`*-trainer-*`) are covered by `_sims-context.md`, which names the rules here that it shares.

**Read with:** the unit `_context.md` in `_courses/` (outcomes, misconceptions, depth ceiling) and `_site-context.md` (colours, routing).

---

## Games built so far

All are in `public/materials/`. They have no markdown source: the HTML file is the source.

| Game | Outcomes | Play | Save key (`localStorage`) | Test hook |
|---|---|---|---|---|
| `sci7-seed-to-seed-game-v2.html` | 7-2-02 to 7-2-05 | Real time. Grow one strawberry on glucose, then choose an offspring. 5 generations, about 12 minutes each. | `sci7-seed-to-seed-v2` (whole game) | `?debug=1` |
| `sci7-flower-field-game-v2.html` | 7-2-04 | Turn-based. Set flower parts and surroundings, grow a season, read where offspring were lost. Four levels with stars, 7 to 10 seasons each. | `flowerfield-v2` (stars, answers, level in progress) | `?debug=1` |
| `sci7-clone-field-game-v2.html` | 7-2-04 | Same shell as Flower Field, with runners, tubers, and cuttings. | `clonefield-v2` (same) | `?debug=1` |
| `cefl/cefl7-income-tax-game-v2.html` (*Payday*, CEFL Town mission) | 7-IT | Walk a top-down town. 4 chapters, 2 paycheques each: plan the jar at home, work a shift (a one-minute game for the job: great earns hours and raises, poor or skipped loses hours), build the stub at the bank or check the boss's stub and sign or dispute it, deposit. 10–15 minutes a chapter. Between lessons: 10 paid help requests from townspeople, an extra shift, Town Mail, Pat's stall. | `cefl-town-7-income-tax-v1` + shared `cefl-town-profile-v1` | `?debug=1` (`window.CEFLTownDebug`); model block runs in Node |
| `cefl/cefl[G]-[unit]-game-v1.html` (the other 14 CEFL Town missions, listed under CEFL Town) | 7–9, one LO each | Same town and structure as Payday: 4 chapters, one after each project step, each mixing kit verbs, a side story with a hero beat, one one-minute game, and a goal (usually the Step 7 audience: at least 3 of 4 first-try answers). Between lessons: 7–9 paid help requests, Town Mail, the stall. | `cefl-town-<grade>-<unit>-v1` + shared `cefl-town-profile-v1` | `?debug=1`; model and help blocks run in Node |
| `cefl/cefl7-income-tax-game-v1.html` | 7-IT | The first, panel-based Payday. Kept for old links; the site links v2. | `cefl7-payday-v1` | `?debug=1` |

The v1 file of each game is kept so old links work. Nothing links to them.

---

## CEFL Town (all CEFL missions)

**One shared town for every CEFL unit in Grades 7–9** (decided 2026-10-17). Each unit is a **mission** in the same top-down town, in the style of early Pokémon or the original Zelda. The student walks between buildings, townspeople give the tasks, and the student does or checks real work. Every mission is a **companion** to its project: one chapter after each of Steps 1–4, and each chapter ends by sending the student to do that step for real. Never let the game do the project's work for the student. All 15 missions are built (2026-10-18): *Payday* first, then the other 14 on the kit (table below).

**Exception to build rule 1.** A CEFL mission is not one HTML file. Fifteen copies of an engine and a map could not be kept in sync, so CEFL Town shares its files:

| File | What it holds |
|---|---|
| `public/vendor/kenney-rpg-urban/` | Kenney *RPG Urban Pack* 1.0 (CC0): `tilemap_packed.png` (27 × 18 tiles of 16 px) and `License.txt`. All town, character and furniture art. |
| `public/materials/cefl/town/art.js` | Draws tiles; builds characters by recolouring the pack's 6 bases (skin, hair, shirt, trousers) and adding job outfits (apron, hi-vis, hard hat and more) |
| `town/world.js` | The town map (78 × 58): 11 named districts (College Hill, Main Street, Town Square, Market Lane, Riverside and others), the river with three bridges, paths to every door, landmarks (fountain, sports field, community garden, Riverside Park), 6 street signs, 26 buildings in six styles and many sizes; small rooms (9 × 7) whose key person or thing stands on a rug; the base townspeople. No DOM. |
| `town/engine.js` | Movement, camera (rooms zoom in to fill the view), doors, dialogue, quests, panels, HUD, Bag, Menu, the **Town Map** (M key: districts, buildings, you, your goal), district-name banners, saves, avatar editor, tutorial, report, the test hook; **between lessons**: the soft gate, help requests and news, Town Mail, the wallet, Pat's stall, the closet, home decorations, the calculate verb (`api.calc`), the save code; **motion**: town life and the effects (`api.fx`) |
| `town/town.css` | Shared styles (CEFL ochre) |
| `town/missions/<grade>-<unit>.js` | One mission: its model (no DOM), chapters, panels, items, report |
| `town/kit.js` | **The kit** (`CEFLTown.kit`): shared work verbs for the missions after Payday, built only on the public `api` (see The kit, below) |
| `town/games.js` | Three one-minute game templates for `api.minigame` (`CEFLTown.gameKit`: `sortRush`, `spotRush`, `quickPick`). Model block `GAMEKIT MODEL START … END` (no DOM), then the views. |
| `town/missions/7-income-tax-jobs.js` | Payday's nine job games (`CEFLTown.jobGames`), one per job. Model block `JOBGAMES MODEL START … END` (no DOM), then the view. Loaded before the mission. |
| `cefl[G]-[unit]-game-v[N].html` | A thin entry page the site links: `<div id="town" data-mission="…">` and the script tags |

**The character** is the student's own avatar (style, skin tone, hair, shirt and first name only), saved in `cefl-town-profile-v1` and shared by every mission on that browser. Money missions use "future you" situations. Avery, Dev and Rosa are townspeople. The town remembers you: finishing a mission adds its outfit to the closet and a page to the **My Plan wall** at home (one page per mission: replaying the finale replaces it). This mirrors the course's My Plan portfolio.

**The work verbs** a mission mixes:
1. **Calculate at a counter:** typed amounts, checked to ±2¢. A wrong try gets a hint in Gentle; the answer shows after 2 tries in Real or 3 in Gentle.
2. **Sign or dispute:** a townsperson's document with one possible root mistake. The student taps the wrong line and disputes it, or signs. Signing a wrong document costs something in the model. Flagging a line that only follows from the mistake gets "look earlier". Gentle warns once before a wrong signature.
3. **Inspect a scene:** tap the hotspots (`K.inspect`; 7 Experiences safety, the scam flyers and fake accounts in the side stories).
4. **Interview:** visit townspeople to fill an item (Payday's Deduction Map).
5. **Run it:** time passes on a calendar strip while the model runs.
6. **Play the shift** (`api.minigame`, added 2026-10-18 for Payday): a one-minute game of the job itself. Intro with **Start** or **Skip**, 3-2-1, a timer bar, the result card. The game's own frames run only while it plays; it pauses when the tab hides. A game is `make(seed, mode)`, `update(st, dt)`, `act(st, a)`, `best(st)`, `actions(st)`, `tier(st)` in a model block, and `render(st)` → HTML whose targets carry `data-act` (optional `frame`, `key`, `scoreText`, `stats`). The model bumps `st.ver` when the picture changes, says what happened in `st.msg`, and queues points in `st.pops`. Results: great / ok / poor / skip. **Set thresholds with bots in Node:** a careful bot reaches great, and an idle or random-tapping player never reaches ok. **The effect goes on the next turn,** where the student sees it while planning, and must be tuned so a careful planner still wins with every game poor (Payday: perfOf; the cut is half the bonus). "ok" must leave the model as it was. The mission stores the result before it reacts, so a reload never replays a game. As a help request (`leave: true`), great / ok / poor map to the pay rule's first / second / later.

**The kit** (`town/kit.js`, added 2026-10-18 for the other 14 missions). Each verb is a panel that resolves `'first'` | `'second'` | `'later'` (or `null` when a help request is left for now), so it plugs straight into the pay rule and `api.record`. Options shared by all: `story` (a chapter task: no pay wording, cannot be left), `leave` (a help request), `key` / `label` / `ch` (record the first try in the report), `ref` / `refLabel` (a fold-out reference). Tries: 2 in Real, 3 in Gentle, with a hint after a wrong try in Gentle.

| Verb | What the student does |
|---|---|
| `K.typed` | Writes reasoning; saved in `S.typed[id]`, shown in the report |
| `K.check` | Signs or disputes a document with at most one root mistake (`o.out = { result, misses }`) |
| `K.proof` / `K.fix` | Names each mistake in a set; sets a broken thing's settings right |
| `K.sort` | Sorts items into 2–4 bins |
| `K.inspect` | Taps every problem in a scene (`spots` with `bad` or `fine`) |
| `K.pick` | Picks one option card and gives a reason and a trade-off (`S.typed[id] = { pick, reason, tradeoff }`) |
| `K.order` | Puts items in order (graded with `answer`; without it, saved as a ranking) |
| `K.chips`, `K.timeline` | Chooses tags; places events on a timeline |
| `K.hero` | The hero scene: lines, medal to the Bag, confetti, the "{name} …" card, thanks |
| `K.notes`, `K.table`, `K.wrote`, `K.doc`, `K.askGrade` | Helpers for Bag items, reports, documents and grading an `api.ask` |
| `K.fmt`, `K.fmtW`, `K.step`, `K.gossip`, `K.gameGrade`, `K.payTiers`, `K.TIER_WORD`, `K.planLine` | Mission plumbing (added 2026-10-18, when the audit took these out of every mission): money in cents (`fmtW` drops ".00"), a chapter step, news lines with `{name}` filled in, a help-request game's result as a pay grade, the game's pay lines, a game result's word in the report, and the My Plan wall's talk line. Use them; do not copy them into a mission. |

**Test hook:** every kit panel puts `solve(how)` on its data (`how` = `right` | `second` | `wrong`), so one generic scripted player can finish any mission. A mission's own custom panel must do the same.

**Game templates** (`town/games.js`): `sortRush` (sort falling cards into bins), `spotRush` (tap the bad cards, leave the fine ones), `quickPick` (a stream of quick multiple-choice rounds from `make(r, real)`). A mission's config lives in `GAME_CFGS` inside its model block, so the Node bots can tune it. A wrong pick costs 2 with only 2 bins, and tapping a fine card costs 2, so random tapping never reaches ok.

**The 15 missions:**

| Mission | Title | Guide | Side story | Game | Goal |
|---|---|---|---|---|---|
| 7-labour-market | Career Day: Find Your Path | Ms. Okafor | Coach Max's "One True Career" quiz | Job shadow (sortRush) | Career Café: 4 of 5 stickers |
| 7-post-secondary | Two Roads: Pathways Night | Ms. Haddad | Tyler and Mo | Campus Fair (sortRush) | Pathways Night: the family takes your advice (3 of 4) |
| 7-experiences | The Garden Crew | Mr. Osei | The empty garden, Mr. Pruitt, Kai | Safety sweep (spotRush) | The Grade 6 class signs up (3 of 4) |
| 7-income-tax | Payday | Ms. Okafor | The Pay-O-Matic mystery | Nine job games (`7-income-tax-jobs.js`) | Model outcome |
| 7-money-management | Saving Up: Every Dollar Has a Job | Sam | SnackBox's free trial | Smart Shopper (sortRush) | Model: the goal jar after month 6, no debt |
| 8-labour-market | Future-Proof: Robots at the Warehouse | Ms. Okafor | Greta, Bo and Chip Tanner | Robot or human? (sortRush) | Future Day (3 of 4) |
| 8-post-secondary | The Course Map: Keep Your Doors Open | Ms. Haddad | Marcus's missing prerequisites | Prereq Quiz (quickPick) | Plan conference (3 of 4) |
| 8-experiences | Open Doors: Who Gets to Picture It? | Mr. Osei | Mia, Priya, Nurse Malik, Ms. Cardinal | Mindset Flip (quickPick) | Campaign launch (3 of 4) |
| 8-income-tax | Job Offer Showdown: The Bracket Myth | Ms. Okafor | TaxZapper and Zane; Sam is the job seeker | Bracket Blitz (quickPick) | Tax Forum: Sam takes your advice (3 of 4) |
| 8-money-management | Grow It: The Sure Thing Fund | Sam | Mr. Vance's Sure Thing Fund | Interest Sprint (quickPick) | Model: both goals reached on time |
| 9-labour-market | Get Hired: The Copy-Paste Résumés | Ms. Okafor | ResumeRocket and Rocket Rick | Résumé Rush (spotRush) | Mock interview: the job offer (3 of 4) |
| 9-post-secondary | Pathway Pitch: The Easy Loan | Ms. Haddad | Kira, Ms. Sterling, EZ Tuition | Pay for School (sortRush) | The family panel (3 of 4) |
| 9-experiences | Pitch It: Theo's Rules | Mr. Osei | Theo's notebook of "rules" | Stall Rush (quickPick) | Model: two market days reach the profit target |
| 9-income-tax | Tax Clinic: The Instant Refund | Ms. Fournier | A CRA gift-card scam; QuickRefund and Mr. Lark | Report It? (sortRush) | Tax Clinic Night (3 of 4) |
| 9-money-management | Debt Detective: The 15-Minute Loan | Ms. Delgado | Rosa's payday loans; Mr. Quill's fast-cash fee | Score It (sortRush) | Grade 8 Debt Talk (3 of 4) |

"3 of 4" means at least 3 of 4 first-try answers. Each mission's header comment gives its model, its sources and its side story in full.

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

**Motion** (added 2026-10-18; the user asked how to make Payday feel more alive). Two engine parts, both in code. We chose not to use Unreal or other connectors for in-game animation: they cannot reach students' devices.
- **Town life.** People turn to face you when you talk to them. Once every 1.4–3.2 seconds, one person on screen glances a new way. A few take a step (`wander: N` in `world.js`: Avery, Dev, Rosa, Mo, Jas; never Pat) within N tiles of their spot. Nobody moves who is your quest target, has a **$** request, or is within 2 tiles of you. People with news (**…**) may wander, and the bubble moves with them. A wanderer never stops on a door or a doorstep, or on your tile or path. A walk that someone steps into goes around them. An arrow key drops a pending walk-then-talk. The speaker hops 2 px when a line opens. A new bubble pops in. A town door shows open for 140 ms before the fade. Frames run only while someone is mid-step (rule 9). Reduced motion keeps the glances and stops the wandering, the hop and the door pause. All of it is off under `?debug=1` unless `&life=1`, so the scripted players stay exact.
- **Effects** (`api.fx`, DOM over the game, transform and opacity only):

  | Verb | What it does |
  |---|---|
  | `fly(from, to, { icon, n })` | Tokens arc from one place to another. A place is a person id, `'you'`, an element or a selector. `api.give(name, icon, from)` uses it to send every Bag item into the Bag. |
  | `rise(at, text)` | Words float up, such as "+$8.00" over whoever paid. |
  | `count(el, from, to)` | A number ticks to its new value. The final value is in `aria-label` throughout. |
  | `stamp(el, text, tone, low)` | A rubber stamp lands and stays. |
  | `pop(el, delay)` | New content pops in. |
  | `bump(el, delay)` | Something already on screen nudges, and never hides. |
  | `fill(el, from, to, 'x' or 'y')` | A full-size bar or jar scales to a new level. |
  | `confetti(n)` | A shower over the town. |
  | `banner(kicker, title)` | A title card, read out through `role="status"`. |
  | `face(ids or 'all', toward)` | People turn toward you or toward someone. |

  The engine uses them on its own in several places. Every chapter opens with a title card (after the tutorial). The wallet counts up or down with help pay and purchases. `calc`'s result card pops in. A job game's result gets a Great / Steady / Rough / Skipped stamp.
- **Rules for every effect:**
  - An effect plays only after an answer is checked or a choice is made, so motion never gives an answer away.
  - It never blocks input, and no step waits on it.
  - It carries no meaning alone: the words and numbers are already on the page.
  - A click, Enter, Space or Escape finishes every running effect.
  - Blocking-size effects last about 600 ms or less. Confetti and title cards run longer, but nothing waits for them.
  - Reduced motion shows each end state at once.
- **Payday uses them** for:
  - the payday card;
  - the cheque from the boss to the Bag;
  - the Chapter 1 net pay counting down from the gross;
  - once a typed stub is all checked, each deduction nudging in turn while the net counts down;
  - the signature on a signed stub, and a red DISPUTED stamp on a disputed one;
  - bills flying into the goal jar as it fills;
  - the Town Hall room turning to you;
  - Proved stamps (only on stubs the student named), and the Fixed stamp and test run on Pay-O-Matic;
  - the hero scene: the medal flying to the Bag, confetti, and "The {name} Rule" card, while the crowd stays for one closing line.
- **Every future mission** uses `api.fx` at its own big moments, with the same rules.

**Adding a mission:**
- Write `town/missions/<slug>.js`, calling `CEFLTown.mission({ id, title, iCan, chapters, init, validate, chapterSteps, people, doorOpen, talk, hud, items, report, … })`.
- Each chapter is a list of steps. The save holds (chapter, step), so a step must be safe to run again from its start. Guard model changes, as Payday's bank step does with "never pay twice".
- A step awaits `api.quest(text, id)` (resolves when the student talks to that person or object, or enters `door:<building>`), then `api.say` / `api.ask` / `api.choose` / `api.panel`.
- Add the thin entry page and one line to the `games` map in `src/data/cefl.ts`.
- **Between lessons:** give `guide` (the person who starts a chapter during the gate), `helpers(S, api)` → `[{ id, who, after, pay, label, ask, run(api, seed) → 'first' | 'second' | 'later' | null }]` (3–4 per chapter, the person's own version of what the chapter taught), `gossip(S, api)` → `[{ id, who, after, lines }]` (2–3 lines a chapter for the mission's side story), and `mail(S, seed, lastDone, api)` → `{ label, from, pay, run(api) }`. `after` is the chapter index that must be done (−1 = from the start). Put their generators in a `HELP START … HELP END` model block (no DOM) on fresh seeds, never on the run. Use `api.calc` for typed amounts.
- Put the model in a `MODEL START … MODEL END` block (no DOM, including `GAME_CFGS`), so Node can check it against the workbook's numbers.
- **Start from the newest kit mission** (any Grade 9 one), not from Payday. Payday came before the kit and has its own panels; copying it brings back code the kit already has. After `var T = window.CEFLTown, K = T.kit, esc = T.esc;` write `var fmt = K.fmt, fmtW = K.fmtW, step = K.step;`; a help-request game returns `K.gameGrade(r)` with `tierText: help ? K.payTiers(PAY) : { … }`; `gossip` is `K.gossip(GOSSIP, api)`; the home wall's line is `myplan: K.planLine(api)`. The one copy kept on purpose: the model and help blocks each carry their own `RNG` and `pickN`, so Node can run a block alone.
- Every number comes from the unit's workbook or brief. Label samples as samples, in the `foot` line and wherever the student sees them.
- **A help request never belongs to the mission's `guide`:** during the gate, talking to the guide starts the next chapter, so the request is never reached.
- **Placing people:** a crowd in a room stands along row 3 and leaves row 4 open. Nobody stands on a blocked tile (a counter, a building), and a placed object never blocks a walkway. The navigation test flags all three.
- `bagTip` sets the tutorial's Bag line. `api.calc` fields take `fmt` for answers that are not dollars (answers are in hundredths: `567` with a percent `fmt` shows 5.67%).
- Use the existing buildings. New ones go into `world.js` for every mission, with a path from the door to a walk. Keep every doorstep clear (the map builder skips decor on paths and doorsteps) and rerun the navigation test.

**Testing a mission** (scripts from the Payday build are described in `_status.md`):
- **Node:** run the model block (careful player always wins; gross-pay, do-nothing and too-cautious players never do; answer tables clean). For the kit missions, also run the help block on many seeds, and the game bots on `GAME_CFGS` (a careful bot reaches great at least 90% of the time; random and idle bots always get poor).
- **Generic scripted player** (kit missions): finishes any mission through the panels' `solve(how)`, with `how=right|second|wrong`, `ask=wrong`, `mode=real`, `shift=…` for games, `gate=1` for the between-lessons checks (pay rule, mail, every request after the mission), and `stop=<panel>` for screenshots.
- **Scripted player in headless Chrome:** drives `CEFLTownDebug` through every situation, job and mode, and a wrong-first run.
- **Navigation test:** BFS from the spawn point to every door and every person in every room; door in and out; tap-walk; quest auto-walk; idle frames = 0.
- **Resume and profile:** `?debug=1&save=1` keeps saving on for reload and profile carry-over tests. Plain `?debug=1` keeps saves in memory only, so the save code can be tested without touching the browser.
- **Job games:** `CEFLTownDebug.game()` is the open game (`start()`, `act(a)`, `tick(ms)`, `finish(tier)`, `done()`, `skip()`, `pause(on)`, `st`). Headless frames barely move, so tests drive time with `tick`. The scripted player takes `shift=great|ok|poor|skip|play` (a list cycles by paycheque; `play` clicks `best()` in the page). Every shift `ok` must give the old results exactly.
- **Between lessons:** `CEFLTownDebug.setDayShift(n)` moves the calendar; `openHelps()`, `runHelp(id)`, `checkMail()`, `readMail()`, `buy(id)`, `encodeSave()` / `decodeSave()` / `applyImport()` drive the rest. Check the pay rule for right, wrong-then-right and wrong answers on every request, and home-room reachability with everything bought, family home and the goal placed.
- **Serve over HTTP:** `python3 -m http.server` in `public/`. Under `file://` the recolouring cannot read the sheet's pixels.
- **Headless walking:** in headless Chrome, animation frames barely advance with virtual time. Use `CEFLTownDebug.tickNow()` to finish a walk (and any wanderer's step), rather than waiting on frames.
- **Motion:** open with `?debug=1&life=1`. `CEFLTownDebug.life(rnd)` makes one town-life change; pass a seeded random for a repeatable run. `walk()`, `facing()`, `hop()`, `doorOpen()` and `fx()` (running effects) show the state. Check with and without Chrome's `--force-prefers-reduced-motion`. The player's clicks are synthetic (no pointerdown), so effects from earlier panels can still be running in a screenshot. End them with `api.fx.skip()` on each click, as a real click does. Check that no effect starts before a check or a choice: use `getAnimations({ subtree: true })` on the panel before and after.

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
