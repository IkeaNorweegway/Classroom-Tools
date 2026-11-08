# CEFL Town v2 — Godot engine

The engine for CEFL Town games that are bigger than the v1 town: a business sim (orders, prices, staff, a business day you watch play out) and a world with more story (several maps, people who move with the day, choices people remember, a Journal). Built in Godot 4.7.2 from text files only; no art files (everything is drawn in code, low-poly 3D with flat-shaded faces).

Two games run on it:
- **CEFL Town** (`games/cefl_town/`, the default): the v1 town rebuilt in 3D, tile for tile (78 × 58, 26 buildings with rooms, the 13 base townspeople, signs, districts, the Town Map). No mission yet; Payday moves in next.
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
| `engine/world3d/world3d.gd` | The map on screen: walking tile by tile (keys, or tap to walk with `AStarGrid2D`), doors and edge links, people, the gold goal marker and the edge arrow, the follow camera (mouse wheel zooms), sections built and freed as you walk, see-through buildings, customers walking during a business day. |
| `engine/ui/town_map.gd` | The Town Map (M, or Map in the top bar): the outdoor map from above, buildings, districts, you and your goal. |
| `engine/ui/ui.gd` | Theme (CEFL ochre, Atkinson Hyperlegible Next), top bar, dialogue box with portraits, panels, title cards, toasts, confetti. |
| `engine/town.gd` | The runtime (autoload `Town`): the game API, story steps, goals across maps, saves, shop screens, Bag, Journal, Menu, report, title and character screens, the test player. The API is listed at the top of the file. |
| `games/demo_cafe/model.gd` | The demo's numbers (no nodes). |
| `games/demo_cafe/game.gd` | The demo: maps, people and where they are each day, story steps, free talk, report. |
| `games/cefl_town/town_v1.gd` | The v1 town (`public/materials/cefl/town/world.js`) ported: same buildings, paths, river, decor and fixed tree scatter; 9 × 7 rooms; the base townspeople with v2 looks. |
| `games/cefl_town/game.gd` | CEFL Town: a welcome, then free roam. Greetings for everyone, signs to read. |
| `tests/test_model.gd` | Bots play the demo model on 400 seeds. |
| `tests/test_nav.gd` | From the start: every door, doorstep, thing and person can be reached, and every room has a way out (`-- game=town` or `game=demo`). |
| `tests/perf_walk.gd` | Walks across the whole town in a window and reports frames per second, the slowest frame, and sections built and freed. |
| `tests/shot.gd` | Runs the game and saves a screenshot (`go=map,x,y[,zoom]` puts you anywhere once the steps are done). |
| `main.gd` | Picks the game: `game=town` (default) or `game=demo`. |

## Making a new game

Copy `games/demo_cafe/` to `games/<name>/`, change `main.gd` to point at it, and add an export preset (or change the existing one's `export_path`). A game script gives `maps()`, `people()`, `where(id, S)`, `steps()` (method names run in order; each must be safe to run again from its start, so guard model changes with a flag), `talk(id, T)`, `use(id, T)`, `bubble(id, S)`, `items()`, `hud(S)`, `report(S)`, and for a shop game `shop_cfg`, `shop_layout`, `bot_order(S)`, `bot_plan(S)`. A step reads like a script:

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
godot --headless --path godot/cefl-town-v2 -s res://tests/test_nav.gd -- game=town      # can you walk everywhere?
godot --path godot/cefl-town-v2 --resolution 1366x768 -s res://tests/perf_walk.gd -- debug=1 auto=right   # frame rate on a walk across town
scripts/playtest_town2.sh OUTDIR "auto=right seed=7" "auto=wrong seed=3 pick=rand"  # play-through probe: transcript, walking check on every map, OUTDIR/digest.md
```

The play-through probe (`tests/playtest/probe.gd`, options at its top) only reads the game. The nightly `playtest` agent uses it (`.claude/agents/playtest.md`).

Test options (also work on the web page as `?debug=1&…`): `auto=right|second|wrong`, `mode=real`, `seed=N`, `trace=1` (prints each step, goal and box), `stop=<step>` (save and quit there), `resume=1` (continue from the save), `save=1` (keep saves; otherwise debug saves stay in memory), `hold=<box kind>&hold_n=N` (stop the test player at that box, for screenshots), `anim=1` (play the business-day animation during a test), `fast=1` (skip it), `reduce=1` (reduced motion), `life=1` (town life on in debug).

## Exporting to the site

`scripts/export_town2.sh` runs the model tests, then exports the Web preset to `public/materials/cefl/town2/` (single-threaded build, so GitHub Pages needs no special headers). Needs Godot 4.7.2 at `~/.local/bin/godot` and its web export templates in `~/.local/share/godot/export_templates/4.7.2.stable/`.

The `.wasm` file (about 39 MB, 10 MB compressed) is the Godot engine and does not change between exports at the same Godot version, so git stores it once. The game itself is the `.pck` (about 170 KB).
