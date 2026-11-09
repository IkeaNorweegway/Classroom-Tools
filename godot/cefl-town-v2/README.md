# CEFL Town v2 — Godot engine

The engine for CEFL Town games that are bigger than the v1 town: a business sim (orders, prices, staff, a business day you watch play out) and a world with more story (several maps, people who move with the day, choices people remember, a Journal). Built in Godot 4.7.2 from text files only; no art files (everything is drawn in code, low-poly 3D with flat-shaded faces).

Three games run on it:
- **CEFL Town** (`games/cefl_town/`, the default): five areas of 60 × 45 tiles, laid out like a plus sign: **Downtown** in the middle, **College Campus** north, **School Grounds** west, **Shopping District** east, **Neighbourhoods** south. Realistic streets (sidewalks, parking lane, two traffic lanes, bike lane), crossings with lights, moving traffic that stops at red lights and for you, people strolling, parked cars, patios, a duck pond. All 26 v1 buildings and 13 townspeople keep their names; every building has its 9 × 7 room. Walking off the end of a street fades into the next area; a big arch at each crossing names the area ahead, and the first 12 tiles of the next area show past the edge. With no mission: walk around and meet people.
- **Payday** (`games/payday/`, CEFL 7-IT, `game=payday`): the first v1 mission on the five-area town. It extends the CEFL Town game, so the maps and people are the same. The pay model is v1's, checked cent for cent against the v1 JavaScript. All four chapters, the soft gate between them, the Pay-O-Matic mystery and the report, and a **live shift** at every paycheque: about two minutes on the job's own 3D work floor, with a new twist each paycheque (nine jobs). Not yet: help requests, news, Town Mail and the wallet.
- **Rosa's Corner Café** (`games/demo_cafe/`, CEFL 9-EX1, sample numbers): the engine demo. Open it with `game=demo` (`?game=demo` on the web).

Neither is linked from the site yet.

**3D and Chromebooks.** No real-time shadows. A town map is cut into 8 × 8-tile sections: a section is built when the camera comes near it (one a frame) and freed when it is far away, so only about a third of the town exists at once. Trees, fountains and people animate only while on screen. Every material is drawn once at the start so none stalls a frame later. A building between the camera and you fades to see-through, and people behind anything show as a soft gold shape (x-ray stencil).

## Files

| File | What it holds |
|---|---|
| `engine/core/story.gd` | The game state `S` (a plain Dictionary, saved as JSON): clock, flags, what each person remembers, story log, bag, first-try records, typed answers. No nodes. |
| `engine/core/shop_sim.gd` | The shop model: orders, prices, staff shifts, one business day, the ledger. No nodes. The model in one line is at the top of the file. |
| `engine/core/money.gd` | Money in cents, typed-money parsing, clock text. |
| `engine/world/art.gd` | 2D drawing still used by the interface: portraits, speech bubbles, product icons, the colour swatches on the character screen. |
| `engine/world/map_data.gd` | A map built from a game's dictionary (format at the top of the file). A map can give its ground as rect fills or as a whole grid (`ground`), plus `draws` (fountain, bridge, field) and `districts`. |
| `engine/world3d/art3d.gd` | All 3D drawing: ground tiles with curbs and markings, six building styles that size themselves to any footprint (civic, campus, glass, shop, industry, house), every prop, rooms, people (built once per look). |
| `engine/world3d/world3d.gd` | The map on screen: walking tile by tile (keys, or tap to walk with `AStarGrid2D`), doors and edge links, people, the gold goal marker and the edge arrow, the follow camera (mouse wheel zooms), sections built and freed as you walk, the start of each neighbouring area shown past its edge, see-through buildings, traffic and traffic lights, strollers, ducks, customers walking during a business day. A map can carry `traffic` and `walkers` (format above `_setup_life`). |
| `engine/live_shift.gd` | A live shift: a job model running in real time on its own work floor. Customers walk in and stand where the model says, with a patience ring; you walk to a station (Space or tap) and a work card docks at the bottom while the clock keeps running (Gentle: half speed while a card with buttons is open, and a gold arrow at the most urgent station). Number keys press card buttons; Esc/P or any panel pauses. Test player: `auto=` finishes a shift with the model's bots; `shift=play` walks the real floor (`ts=4` speeds time, `park=<s>` stops at the first station for screenshots). |
| `engine/ui/town_map.gd` | The Town Map (M, or Map in the top bar): the outdoor map from above, buildings, districts, you and your goal. |
| `engine/ui/ui.gd` | Theme (CEFL ochre, Atkinson Hyperlegible Next), top bar, dialogue box with portraits, panels, title cards, toasts, confetti. |
| `engine/town.gd` | The runtime (autoload `Town`): the game API, story steps, goals across maps, saves, shop screens, Bag, Journal, Menu, report, title and character screens, the test player. The API is listed at the top of the file. |
| `games/demo_cafe/model.gd` | The demo's numbers (no nodes). |
| `games/demo_cafe/game.gd` | The demo: maps, people and where they are each day, story steps, free talk, report. |
| `games/cefl_town/area_kit.gd` | Builds one area: streets and crossings (lanes, lights, stop lines), buildings (`face: "n"` fronts the street above), street furniture, parked cars, traffic, walkers, edge links and the gate arch. Main Street (rows 18–25) and the Avenue (columns 26–33) line up across areas. |
| `games/cefl_town/areas.gd` | The five areas, each a short plan written with the kit. |
| `games/cefl_town/town_v1.gd` | What carries over from v1: the 26 buildings, their room furniture, the base townspeople with v2 looks. |
| `games/payday/model.gd` | Payday's pay model (no nodes): Pay Card, EI, CPP, the workers and jobs, a run of 8 paycheques, the boss's mistakes, the mystery's clue stubs, the careful planner the bots use. A run is a plain Dictionary. |
| `games/payday/text.gd` | Payday's words from v1: situations, the nine bosses (voice, room, outfit), the questions with their misconception-based wrong choices, "What would help?", Sam's puns. |
| `games/payday/panels.gd` | Payday's panels on `T.box`: typed stub lines, sign or dispute, pick-the-right-option cards (Town Hall proof, Pay-O-Matic's settings), the payday plan, two weeks of shifts, the first stub, the deposit, the job board, the tax dial. Every one has a test-player move. |
| `games/payday/jobs/job.gd` | The shared part of Payday's nine live shifts (no nodes): customers and patience, scoring (quality = right ÷ everything; coverage = right ÷ work that came in, less what was still under way at the bell), the busy curve, and the bots (careful, steady, sloppy, random, idle) that walk the floor at real speed. |
| `games/payday/jobs/<job>.gd` | One job each: its work floor, stations, eight shift twists, model, work cards and test-player moves. grocer (till, change and 5¢ rounding, shelves), busser (tables, tub, setups, tip-out), sports (benches, stockroom, 2% commission, Pro-model returns), warehouse (postal-code zones, dolly), bikeshop (tickets, quotes with GST, stands, rack), phones (cheapest plan that covers, cases, 4% commission), office (booking calendar, check-in list, charts, an emergency call), apprentice (GFCI, breakers, test before touching, wiring), furniture (wall, budget and door, order totals, 6% commission). |
| `games/payday/game.gd` | Payday: where people stand at each stage, the 49 steps in four chapters, the soft gate, Real-mode replay, idle talk, the Bag (Pay Card, Project Checker, stubs, Deduction Map, Case notes…), the report. |
| `games/cefl_town/game.gd` | CEFL Town: where everyone stands, a welcome, then free roam. Greetings for everyone, signs to read. |
| `tests/test_model.gd` | Bots play the demo model on 400 seeds. |
| `tests/test_payday.gd` | Payday's model: the Pay Card matches its formula, every boss mistake is worth $5, and bots on 1,800 runs (a careful planner always wins, even with every shift poor; doing nothing never does; planning from gross pay never does at 19 or 24). `-- dump=FILE` writes the grid that `tests/payday/compare.sh` checks against v1 (`tests/payday/v1_ref.cjs` runs v1's own model in Node). |
| `tests/test_jobs.gd` | The nine live shifts: bots on every twist, Gentle and Real (`-- job=grocer n=40 v=1`). Passes when a careful bot gets great at least 90% of the time, a steady (slower) bot gets poor at most a quarter of the time, idle and random players never reach ok, and every station on every floor can be reached. |
| `tests/test_nav.gd` | From the start: every door, doorstep, thing and person can be reached, and every room has a way out (`-- game=town`, `demo` or `payday`). A game whose people move with the story lists the states to check in `nav_states()`. |
| `tests/perf_walk.gd` | Walks across the whole town in a window and reports frames per second, the slowest frame, and sections built and freed. |
| `tests/shot.gd` | Runs the game and saves a screenshot (`go=map,x,y[,zoom]` puts you anywhere once the steps are done). |
| `main.gd` | Picks the game: `game=town` (default) or `game=demo`. |

## Making a new game

A CEFL mission extends `games/cefl_town/game.gd` (as Payday does) so it keeps the town; a game with its own maps copies `games/demo_cafe/`. Copy `games/demo_cafe/` to `games/<name>/`, change `main.gd` to point at it, and add an export preset (or change the existing one's `export_path`). A game script gives `maps()`, `people()`, `where(id, S)`, `steps()` (method names run in order; each must be safe to run again from its start, so guard model changes with a flag), `talk(id, T)`, `use(id, T)`, `bubble(id, S)`, `items()`, `hud(S)`, `report(S)`, and for a shop game `shop_cfg`, `shop_layout`, `bot_order(S)`, `bot_plan(S)`. Optional: `bag(S)` (Bag items with a view), `my_look(S, look)` (a job outfit), `log_unit` ("Paycheque" instead of "Day"), `nav_states()`. A step name may carry an argument: `"plan:3"` calls `plan(T, "3")`. Besides `T.say`, `T.choose`, `T.goal`, `T.calc` and `T.typed`, a step can use `T.ask` (a question with feedback, recorded) and `T.box` (the game's own panel, with a test-player move). A step reads like a script:

```gdscript
func d1_order(T) -> void:
	await T.goal("Order today's stock from Mr. Lin.", "person:lin")
	await T.say("lin", "Morning! What can I get you?")
	await T.shop_order("Lin's Wholesale", "Rosa's notes: …")
```

## Testing (no window needed)

```sh
godot --headless --path godot/cefl-town-v2 -s res://tests/test_model.gd          # model bots
godot --headless --path godot/cefl-town-v2 -- game=demo debug=1 auto=right quit=1 seed=7   # plays the café demo, prints AUTO-RESULT
godot --headless --path godot/cefl-town-v2 -s res://tests/test_payday.gd                 # Payday's model bots
godot/cefl-town-v2/tests/payday/compare.sh                                              # Payday's model against v1, cent for cent (needs node)
godot --headless --path godot/cefl-town-v2 -- game=payday debug=1 auto=second quit=1 seed=21   # plays all four chapters of Payday
godot --headless --path godot/cefl-town-v2 -s res://tests/test_jobs.gd                    # Payday's nine live shifts: bots and floor layouts
godot --path godot/cefl-town-v2 --resolution 1366x768 -s res://tests/shot.gd -- game=payday debug=1 auto=right shift=play shift_only=grocer:2 park=28 wait=42 out=/abs/shot.png   # one live shift on screen
godot --headless --path godot/cefl-town-v2 -s res://tests/test_nav.gd -- game=town      # can you walk everywhere?
godot --path godot/cefl-town-v2 --resolution 1366x768 -s res://tests/perf_walk.gd -- debug=1 auto=right   # frame rate on a walk across town
scripts/playtest_town2.sh OUTDIR "auto=right seed=7" "auto=wrong seed=3 pick=rand"  # play-through probe: transcript, walking check on every map, OUTDIR/digest.md
```

The play-through probe (`tests/playtest/probe.gd`, options at its top) only reads the game. The nightly `playtest` agent uses it (`.claude/agents/playtest.md`).

Test options (also work on the web page as `?debug=1&…`): `shift=great|ok|poor|skip` (a list cycles by paycheque) or `shift=play` for Payday's shifts, `shift_only=job:p[:n]` (straight into n shifts of one job), `auto=right|second|wrong`, `mode=real`, `seed=N`, `trace=1` (prints each step, goal and box), `stop=<step>` (save and quit there), `resume=1` (continue from the save), `save=1` (keep saves; otherwise debug saves stay in memory), `hold=<box kind>&hold_n=N` (stop the test player at that box, for screenshots), `anim=1` (play the business-day animation during a test), `fast=1` (skip it), `reduce=1` (reduced motion), `life=1` (town life on in debug).

## Exporting to the site

`scripts/export_town2.sh` runs the model tests, then exports the Web preset to `public/materials/cefl/town2/` (single-threaded build, so GitHub Pages needs no special headers). Needs Godot 4.7.2 at `~/.local/bin/godot` and its web export templates in `~/.local/share/godot/export_templates/4.7.2.stable/`.

The `.wasm` file (about 39 MB, 10 MB compressed) is the Godot engine and does not change between exports at the same Godot version, so git stores it once. The game itself is the `.pck` (about 170 KB).
