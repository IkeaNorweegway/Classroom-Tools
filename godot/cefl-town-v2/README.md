# CEFL Town v2 — Godot engine

The engine for CEFL Town games that are bigger than the v1 town: a business sim (orders, prices, staff, a business day you watch play out) and a world with more story (several maps, people who move with the day, choices people remember, a Journal). Built in Godot 4.7.2 from text files only; no art files (everything is drawn in code, flat illustrated style).

The first game on it is a demo, **Rosa's Corner Café** (`games/demo_cafe/`, CEFL 9-EX1, sample numbers). It is not linked from the site yet.

## Files

| File | What it holds |
|---|---|
| `engine/core/story.gd` | The game state `S` (a plain Dictionary, saved as JSON): clock, flags, what each person remembers, story log, bag, first-try records, typed answers. No nodes. |
| `engine/core/shop_sim.gd` | The shop model: orders, prices, staff shifts, one business day, the ledger. No nodes. The model in one line is at the top of the file. |
| `engine/core/money.gd` | Money in cents, typed-money parsing, clock text. |
| `engine/world/art.gd` | All drawing: ground, rooms, buildings, props, people (recoloured from a look), portraits, bubbles, product icons. |
| `engine/world/map_data.gd` | A map built from a game's dictionary (format at the top of the file). |
| `engine/world/world.gd` | The map on screen: walking (keys, or tap to walk with `AStarGrid2D`), doors and edge links, people, the goal arrow, the camera, customers walking during a business day. |
| `engine/ui/ui.gd` | Theme (CEFL ochre, Atkinson Hyperlegible Next), top bar, dialogue box with portraits, panels, title cards, toasts, confetti. |
| `engine/town.gd` | The runtime (autoload `Town`): the game API, story steps, goals across maps, saves, shop screens, Bag, Journal, Menu, report, title and character screens, the test player. The API is listed at the top of the file. |
| `games/demo_cafe/model.gd` | The demo's numbers (no nodes). |
| `games/demo_cafe/game.gd` | The demo: maps, people and where they are each day, story steps, free talk, report. |
| `tests/test_model.gd` | Bots play the demo model on 400 seeds. |
| `main.gd` | Picks the game to start. |

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
godot --headless --path godot/cefl-town-v2 -- debug=1 auto=right quit=1 seed=7   # plays the whole game, prints AUTO-RESULT
```

Test options (also work on the web page as `?debug=1&…`): `auto=right|second|wrong`, `mode=real`, `seed=N`, `trace=1` (prints each step, goal and box), `stop=<step>` (save and quit there), `resume=1` (continue from the save), `save=1` (keep saves; otherwise debug saves stay in memory), `hold=<box kind>&hold_n=N` (stop the test player at that box, for screenshots), `anim=1` (play the business-day animation during a test), `fast=1` (skip it), `reduce=1` (reduced motion), `life=1` (town life on in debug).

## Exporting to the site

`scripts/export_town2.sh` runs the model tests, then exports the Web preset to `public/materials/cefl/town2/` (single-threaded build, so GitHub Pages needs no special headers). Needs Godot 4.7.2 at `~/.local/bin/godot` and its web export templates in `~/.local/share/godot/export_templates/4.7.2.stable/`.

The `.wasm` file (about 39 MB, 10 MB compressed) is the Godot engine and does not change between exports at the same Godot version, so git stores it once. The game itself is the `.pck` (about 170 KB).
