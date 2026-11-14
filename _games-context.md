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
| `cefl/town2/cefl-town-game-v2.html` (*CEFL Town* in 3D, Godot; `?game=demo` opens the engine demo, *Rosa's Corner Café*, 9-EX1; `?game=payday` is Payday on v2 with live shifts) | 7–9 (missions to come) | The v1 town in 3D to walk around: every building and room, the base townspeople, signs, district banners, the Town Map. The café demo: 3 business days (order stock, set prices and staff, open, work out the profit). Sample numbers. Not linked on the site yet. | browser storage (`user://cefl-town2-*.json`) | `?debug=1` (options in `godot/story-engine/README.md`); model bots, `test_nav.gd` and `perf_walk.gd` in Godot |

The v1 file of each game is kept so old links work. Nothing links to them.

**In build (Chapter 1 playable):** *The Measure of the Realm*, a year-long Math 9 fantasy quest (all 11 topics, one chapter each) on the story engine (`godot/story-engine/`, shared with CEFL Town). Story: `_courses/math-9/realm-game/math9-realm-story-v1.md`; Chapter 1 design (the pilot): `math9-realm-ch1-design-v1.md` in the same folder. Art: the Emberdale Blender pack (below, under the v2 engine); **Chapter 1 is built and plays end to end** (`games/realm/`: `game.gd`, `ch1.gd`, `maps.gd`, `panels.gd`; run with `-- game=realm`; `tests/test_realm.gd` and `tests/test_nav.gd` pass). It stays in the 3D angled view (decided 2026-11-14; the side-view and sprite trials are set aside) and draws its people from the voxel people pack. Open work is on the task board, `_realm-review/board.md`.

---

## Story engine (Godot; was "CEFL Town v2 engine")

The Godot project `godot/story-engine/` is shared: the CEFL games (CEFL Town, Payday, the café demo) and the Math 9 Realm game run on it, each in its own `games/` folder. **CEFL Town v2** below means the CEFL game and its web build (`public/materials/cefl/town2/`); **Realm** means the Math 9 game; **the story engine** means the shared code (`engine/`).


Started 2026-11-08 for games bigger than the v1 town: a **business sim** (orders, prices, staff shifts, a business day the student watches) and a **bigger world and story** (several maps joined by doors and edges, people who are in different places on different days, choices that people remember, a Journal that shows it). The user chose Godot to run the game, and an engine plus demo first. The 15 v1 missions are untouched.

**3D (decided 2026-11-08).** The user picked the low-poly 3D look (flat-shaded faces, angled camera) over 2D, with no real-time shadows, and asked for the whole v1 map and game to move into it: the town first, then Payday, then the other 14 missions a grade per batch. Separate 9 × 7 rooms as in v1; v1 stays live and v2 stays unlinked until a mission is finished and tested. **The town (revised the same day):** the user wanted the whole map as detailed as the street mock-up and more of it, with load transitions allowed. So the town is now **five areas of 60 × 45** (Downtown in the middle; College Campus north, School Grounds west, Shopping District east, Neighbourhoods south), with realistic streets, moving traffic and walkers on screen only, and every v1 building and person keeping its name in the area its street suggests (the Bank on Main Street, Home on River Walk, the shops on Market Lane). Guides that give v1 directions may need a small edit. At each crossing a big arch names the next area, and the first 12 tiles of the next area are drawn past the edge, so a crossing feels continuous. Rules for the 3D world (`engine/world3d/`):
- Walking stays tile by tile, so doors, talking, tap-to-walk, goals and the test player work exactly as before; the world has the same interface as the old 2D one.
- Areas line up: Main Street on rows 18–25 and the Avenue on columns 26–33 in every area they pass through, so an edge link lands you on the same street. Nothing stands within 3 tiles of an edge (people arrive there). Only streets that leave the area at both ends get moving traffic; a dead end gets parked cars.
- Build an area with `games/cefl_town/area_kit.gd` (streets, `crossings()`, `building()`, `furnish_ew/ns`, `park_ew/ns`, `traffic()`, `walker()`, `edge()`, `gate()`); an id must not be both an area and a building.
- A town map is built in 8 × 8-tile sections: a section is built when the camera comes near (one a frame) and freed when far away. Moving things animate only on screen. No real-time shadows.
- Every material and sign shader is drawn once at load (`_prewarm`), so nothing stalls the first time it appears.
- The camera looks from nearly due south (the town's paths run N–S and E–W). A building between the camera and you fades to see-through; anyone behind something shows as a soft gold x-ray shape.
- A new building style or prop goes in `art3d.gd` and must size itself to any footprint. Check new places with `tests/shot.gd -- go=map,x,y`, then `test_nav.gd` and `perf_walk.gd`. Project, file map, game API and test options: `godot/story-engine/README.md`.

**Exceptions to the build rules below** (decided 2026-11-08):
- Not one HTML file and not hand-written HTML: the source is a Godot 4.7.2 project in `godot/story-engine/` (GDScript, text only), exported by `scripts/export_town2.sh` to `public/materials/cefl/town2/` (`.html`, `.js`, `.wasm`, `.pck`). Edit the GDScript, never the export.
- The Godot web runtime is the library (rule 2): served from our own folder, version pinned (4.7.2), single-threaded so GitHub Pages needs no special headers. First load is about 10 MB compressed (v1 town: about 1 MB). The `.wasm` is the same for every export at one Godot version, so git keeps one copy; a game's own data is the `.pck` (about 170 KB for the demo).
- The model still sits apart from the page (rule 5), in `engine/core/` and each game's `model.gd`, and is tested by bots in headless Godot (`tests/test_model.gd`) instead of Node.
- Rule 13 (600 px): the layout narrows to 640 logical pixels and then scales a little; panels scroll inside themselves, never sideways.

**What carries over from v1:** the soft gate idea, the pay rule, `story` versus help tasks, the side-story shape (a hunch, clues, a hero beat), the motion rules, and the test-hook habit. Not yet in v2: the save code, the shared profile with v1. Port them when a v2 mission needs them (Payday's batch 2 needs help requests, news, mail and the wallet).

**Engine pieces a v2 game uses:** `T.say`, `T.choose` (best option marked for the test player), `T.goal` (person, thing or map; the gold arrow and an edge arrow route across maps), `T.calc` (typed amount, ±2¢, 3 tries Gentle with hints, 2 Real), `T.typed`, `T.panel`, `T.shop_order` / `T.shop_plan` / `T.shop_run` / `T.ledger_table`, memory (`T.remember`, `T.knows`, `T.trust`), `T.log_line` (the report's "What I decided"), `T.banner` / `T.toast` / `T.confetti`. A step must be safe to run again from its start: guard model changes with a flag, as the demo does (`ordered_N`, `closed_N`).

**Engine pieces added for Payday (2026-11-08):** `T.ask(who, q, key, label)` (a v1-style question: shuffled options, a wrong pick shows its feedback and the student tries again, the first pick is recorded as first / second / later); `T.box(kind, title, build(p, done), solve(how))` (a game's own panel; `solve` is the test player's next move and is called until the panel is done, so every custom panel can be played by `auto=right|second|wrong`); step names with an argument (`"plan:3"`); `bag(S)` (Bag items that open a view); `my_look(S, look)` (the job outfit); `log_unit`; `nav_states()` for the navigation test. A panel can't open the Bag, so any panel that needs the Pay Card shows it in a fold-out.

**Payday on v2** (`games/payday/`, `?game=payday`, batch 1 of 2, 2026-11-08). It extends the CEFL Town game, so it keeps the five areas and the townspeople, and adds the nine bosses in their shops, Mom, Milo, the job board (Job Centre), the kitchen table and the fridge (Home). The model is v1's MODEL, SIGN-OFF and STORY blocks ported to GDScript; `tests/payday/compare.sh` runs v1's JavaScript in Node and the port in Godot on 540 runs and finds no difference to the cent. Chapters are steps (`chapter:N` takes a snapshot for Real-mode replay; `gate:N` is the soft gate: Start now, or look around town until Ms. Okafor starts it). In Real mode two bounces end the chapter; after a second loss, "Switch to Gentle and replay" comes first. Mo now works in the Industrial Yard (Shopping District) and Jas stands on Market Lane until the shoe store closes. **Batch 2b** (2026-11-09, another session; commit 748eb7b): help requests, news, Town Mail and the wallet, with a plan-wall `use()` case. Its commit message has the detail; check what is left of the home letter, the goal item, the My Plan wall page and the closet outfit before building them.

**The student avatar and Pat's stall (2026-11-09).** The user asked for a male and a female student made in Blender, with clothes bought with side-job money. Decided: the student **picks a body only** (no colour pickers; the preview is the real 3D model), clothes are **bought at Pat's market stall** (Downtown) and **changed at the closet at home** (a wardrobe at home 3,1), prices **2–5 help jobs** each ($15–$40).
- **Models:** `scripts/blender/town_people.py` builds `assets/town/people/student_m.glb` and `student_f.glb` on the Realm hero's rig and clips. Every piece is its own mesh and `Pack.dress` shows the right ones from the look's `wear` and `outfit`: `Wtop_*` (tee hoodie jersey jeanjacket puffer), `What_*` (cap toque bucket), `Wshoes_*` (basic hightops boots runners), `Wextra_*` (backpack headphones sunglasses, any mix), `Work_*` (Payday's apron vest cap hivis suit hardhat; apron, vest and cap take the job's colour), `Locks_full` / `Locks_hat`. A job hat hides your own hat; the blazer replaces your top.
- **Code:** `games/cefl_town/wardrobe.gd` (bodies, the 13 items and prices, the stall and closet panels with the test player's moves, `earn`, `buy_item`); the town game gives `avatar_bodies`, `base_look(P)`, `body_of`, `avatar_look`, `set_body`, `profile_hud(P)`; the engine's `_avatar_pick()` replaces the colour screen when a game has `avatar_bodies` (Realm keeps its own); `engine/ui/model_view.gd` is the turning 3D preview.
- **Wallet:** in the profile (`P.wallet`, `P.owned`, `P.student { body, wear }`), shared by every mission, never in a mission's model. Payday's `_earn` adds to it as well as to its own `pd.wallet` (the report's "earned"); an older Payday save moves its earnings in once (`on_begin`). The HUD shows **Wallet** instead of "Earned".
- **Tested:** `tests/test_wardrobe.gd` (490 checks: every item and job outfit on both bodies, the wallet rules, prices), `test_nav` town and payday, the town and Payday test players; `tests/shot_wardrobe.gd` takes pictures of the picker, the stall, the closet and you in town.

**Live shifts (batch 2a, 2026-11-09).** The user asked for job games like the café demo: more creative, realistic and intensive. Decided: played **in 3D on the job's own work floor** (a 13 × 9 room), **about 2 minutes** (90 s on short weeks), with **a new twist every paycheque** taken from the job's paycheque notes. They replace v1's one-minute panels; the result still feeds `perf_of` unchanged (great / ok / poor / skip).
- **Engine:** `engine/live_shift.gd` (`T.live_shift(job, o)`). Customers are drawn people that walk in from the door and stand where the model puts them, with a bubble (what they want) and a **patience ring** round it. You walk the floor as usual; Space or a tap at a station opens its **work card**, docked at the bottom; the clock keeps running. Gentle: the clock runs at half speed while a card with buttons is open, and a gold arrow shows the most urgent station; Real: neither (shift 1 keeps the arrow in both). Number keys press card buttons; Esc/P, any panel, or leaving the tab pauses. The room exit is closed during a shift. Floating words show each point ("+1", "+$2.40 (2%)", "oops"). The top bar shows the clock (4 hours in 2 minutes), the job's tally and what just happened.
- **Card lines never wrap** (a wrapping label in the docked card never settles its layout in Godot 4.7 and freezes the game): keep each line short and split long text into more lines.
- **Each job** (`games/payday/jobs/<job>.gd`, extends `job.gd`, no nodes): floor, stations with standing tiles, eight twists, model (`setup`, `tick`, `on_at`, `card`, `act`), the careful worker's next move (`best`), `pending` (work under way at the bell), `earn_line` (the pay type at work today: wage, tip-out, commission and its claw-back, salary), "next time" tips by mistake kind, and v1's boss reactions. The intro card names the twist, the controls and what each result means for the next paycheque; the end card gives the stamp, the counts, the earn line and the top tip; then the boss reacts (v1's lines).
- **Scoring:** quality = right ÷ (right + mistakes + lost) and coverage = right ÷ (work that came in − work still under way); great and ok need both over the job's thresholds.
- **The nine jobs:** Valley Market (till: card or cash, change, cash totals round to 5¢; shelves and crates; spills) · Lantern Diner (party sizes at the door, clear into a 2-table tub, dish pit, setups a seat each, tip-out per party; rushing diners costs) · Northside Sports (try-on benches, stockroom boxes, 2 in your arms, till; the Pro model comes back as a return and the 2% commission with it; January 25% off; helmets by head size) · Prairie Parcel (postal-code first letter → West / Prairies / Central / East cart, real cities; dolly over 23 kg; belt overflow; smudged labels to the problem shelf) · Spoke & Chain (symptom → repair ticket, quote = (part + labour) × 1.05, stands, rack, pick-ups; rush fees) · CellPoint (cheapest plan that covers data and calls; too small comes back, too big is cancelled with the 4% commission; cases by exact model; 24-month phone bill) · Riverbend Clinic (booking calendar, no double-booking, second choices, check-in against today's list with look-alike names and wrong days, charts to the doctor's tray, one 911 call) · Bright Spark (GFCI near water, breaker off, test for power, black→brass, white→silver, bare→green, power on to test; swapped panel labels) · Home & Hearth (wall, budget and door; read the tags; order total = sofa + $79 delivery, Real + 5% GST; 6% commission, returns claw it back).
- **Tested** (`tests/test_jobs.gd`, 24 seeds a twist): a careful bot reaches great ≥ 90% on every twist in both modes, a steady bot (60% slower) gets poor ≤ 25%, idle and random tapping never reach ok, and every station's standing tile is reachable. The test player plays every shift through the bots, so all nine jobs finish all 49 steps (Gentle right, Real wrong). `shift=play` drives the real floor for screenshots. **Not tested:** real students' speed (the steady bot is a guess), touch on the docked card, Chromebooks with people walking in a room, screen readers.

**The demo's model** (`games/demo_cafe/model.gd`): walk-ins = traffic × (0.6 + reputation/125) × the day's event × noise; each wants one product and walks out if the price is above what customers expect (buy chance (ref/price)^2.5), if it is sold out, or if the line is full (12 an hour per person on shift). Profit = sales − stock bought today − wages − rent. Perishables are thrown out at closing. Simplifications: one product per customer, no change in what people want during the week except the day's event, cheap beans change only reputation. Goal: $450 over three days with reputation 50 or more. Bots on 400 seeds: the careful plan wins every time; no Dev, cheap beans, prices 40% up or 25% down, the same order every day, a huge order and doing nothing never win. "What would help most?" offers the fix for the biggest loss and only fixes for losses under a quarter of it (design rule 5); after two wrong tries Dev gives the answer.

**Nightly play-through (2026-11-08):** the `playtest` agent plays the demo every night with `tests/playtest/probe.tscn` (reads what is shown and checks walking on every map at every step; the test player itself jumps, never walks) via `scripts/playtest_town2.sh` and `scripts/playtest_digest.py`, and logs suggestions in `_playtest-review/suggestions.md` (git-ignored). It never changes the game. A new v2 game is covered once `main.gd` points at it; its `shop_layout` and `where()` are read the same way.

**Tested 2026-11-08:** model bots; the whole game by the test player (right, second-try and wrong, Gentle and Real, several seeds, all 14 steps); save, stop and resume gives the same result as an unbroken run; web build in headless Chrome at 1340×840 and 600×420 (title, character, town, tap to walk, number keys for choices, order, plan, business day, ledger and profit check, Journal, report). **Not tested:** the report download in a real browser, touch screens, school Chromebooks (frame rate and the 10 MB load), screen readers (Godot draws to a canvas, so the page has no text for one: a known limit of this engine), students.

---

**Blender model packs (added 2026-11-09, first used by Realm).** For games that need more art than `art3d.gd` should hold. Each pack is a Python script run by Blender (installed as a Flatpak): `scripts/blender/realm_pack.py` builds every model as a `.glb` in `godot/story-engine/assets/<game>/<pack>/` with a `pack.json` (kind, footprint, height, triangles, a note). Shapes and the palette are in `scripts/blender/kit.py`; the look is the town's (flat-shaded, one colour per face, no textures). Units: 1 = 1 tile, footprint centred on the origin, door facing +z. In Godot, `engine/world3d/pack.gd` places a model and gives it the town's materials (`Pack.place`, `Pack.part` for moving parts, `Pack.tint`). Mesh names say what a part is: `*_glow` is unlit, `*_water` is see-through, and `Wheel`, `*_Crown` and `Rune_glow` are parts a game moves or recolours. Turning: `yaw 90` turns a model's +z face to +x.
- Build: `flatpak run org.blender.Blender -b --python scripts/blender/realm_pack.py -- [only=a,b]`, then `godot --headless --path godot/story-engine --import`.
- Check by eye: `scripts/blender/contact_sheet.py -- dir=…` (one picture per model); `tests/pack_preview.gd -- out=…` (a small village in the town's light and camera); `scripts/blender/showcase.py` opens every model in a Blender window.
- Live Blender (added 2026-11-09, for rigging and animation checks): the `blender` MCP server (`mcp-for-blender` 2.2.7, telemetry off, Claude Code local scope) talks to the add-on in Flatpak Blender 5.1 (`~/.var/app/org.blender.Blender/config/blender/5.1/scripts/addons/blender_mcp.py`, localhost:9876). Open Blender with the add-on's server running (sidebar tab "MCP for Blender") before using it. Use it to look and test; the pack scripts stay the source, so copy what works back into them. Don't use its asset downloads or AI model generators.
- Agent: `.claude/agents/blender-models.md` adds or fixes models in an existing pack from a list the main session writes (Sonnet; Opus for rig work).
- Colour: kit colours are sRGB bytes and glTF stores them linear. The material's `vertex_color_is_srgb` switch does nothing in the Compatibility renderer (batch 1 relied on it, and every pack model drew far too dark), so `pack.gd` turns each mesh's colours back to sRGB once when it loads and uses the town's materials unchanged. Pack grass and the town's grass now match to the pixel. Don't add a second conversion.
- Change the script, not the `.glb`: the files are rebuilt from it. The town's export leaves out `assets/realm/` (about 1.4 MB for Emberdale); Realm's own export will include it.
- **Emberdale pack** (113 models): 39 terrain tiles of one sketch cell (grass, stubble, canola, the footpaths below, river, bank, ford, gorge walls and corners, gorge floor, waterfall, far bank, the weathered cobblestone market square (three variants mixed per cell), three clean brick paving tiles for sidewalks, and the forest floor, clearing and path pieces); the footpaths are ten winding dirt variants plus two rounded-turn tiles, all the same width and edge geometry so any order joins (maps pick one per cell by a mixed hash and yaw the corners); 15 buildings (Hesper's cottage, three village houses, the mill with a turning wheel, the barn, a grain elevator, the well, the Highstead gate arch, the grain-share rune stone, the sheep fold, the root cellar, a market stall, the broken bridge, a wizard's tower with glowing windows, runes and a floating crystal); 59 props (fences, walls, hay, sacks, barrels, carts, trees — aspen, autumn aspen, cottonwood, spruce, elm, maple, birch, willow and orchard — bushes — wild rose, hedge, blossom, berry and a large shrub — rocks, signpost, lantern, scarecrow, hen coop, the sigil spot, a sheep and a hen, and the forest set). The sheep and hen here are static; the animated ones are in the people pack.
- **People pack** (batch 2, 2026-11-09, `scripts/blender/realm_people.py` → `assets/realm/people/`, 15 rigged models): the **hero** (white slot meshes the game tints from the player's look: `Skin`, `Hair_<style>`, `Top`, `Legs`, `Boots`, `Cloak`, plus `Glasses`, shown only if asked; `Fixed` keeps its colours); the Chapter 1 cast **Orrin, Hesper, Pell, Marta, Abel, Rowan, Odile, Gale, Sefa**; a **Hollow** (empty dark hood, glides with no feet); and **sheep, lamb, hen, dog**. People are about 1.05 tall (Pell 0.85), face +z and are placed at scale 1. Clips (all loop): people `idle walk talk cast cheer`; the Hollow `idle walk cast`; sheep and lamb `graze`, hen `peck`, dog `sit`. The hero takes the town's look keys (`skin`, `hair`, `hair_style` 0–5 = short long bun curly shaved braids, `shirt`, `pants`, `glasses`) plus `boots` and `cloak` colours, so the character screen works unchanged.
  - Rigging: `kit.Rig` builds the armature; `Part.bone(name)` binds what's drawn next to one bone (rigid, low-poly). Poses are written in the world's axes, not each bone's (signs in the `Rig` docstring); every clip keys every bone, so no clip keeps a pose left over from another.
  - In Godot: `Pack.person(pack, name, look, xray)` places, dresses and starts idle; `Pack.play(n, clip, speed)` blends to a clip. In the town engine, a look with `"model": "realm/people/hero"` makes a `PersonNode` use the rigged model (walk while moving at the step speed, `action` while standing, x-ray kept); any other look keeps the code-drawn person.
  - Check: `tests/test_people.gd` (every model, clip, loop and the hero's dressing; `-- out=DIR` saves a line-up in the town's light) and `scripts/blender/people_sheet.py -- dir=…` (a picture of each clip).
- **Voxel people pack** (2026-11-14, `scripts/blender/realm_voxel_people.py` → `assets/realm/voxpeople/`, 24 rigged models): the same cast rebuilt on the hand-made voxel hero in `Hero-pixel.blend` (a front-view pixel drawing two 0.04 voxels deep, ten rigid blocks on eleven bones, the hand-keyed 20-frame walk). The measured template and the rules for a new character are in `templates/realm-voxel-character-template.md`. Models: `apprentice` (the reference hero, rebuilt cell for cell), `hero`, `hero_f`, `hero_m` (same slot and wardrobe mesh names as the people pack, so `Pack.person` and `Pack.dress` work unchanged), the Chapter 1 cast (orrin, hesper, pell, marta, abel, rowan, odile, gale, sefa, hollow), the later mentors and villain (taddeus, ilsabet, wenna, roan, morvane with `Rune_glow`), and sheep, lamb, hen, dog and the cat familiar. Same clip names as the people pack. **The game uses this pack** (since 2026-11-14: `game.gd` and `maps.gd` name `realm/voxpeople`; the first pack, `realm/people`, stays for the cutscene stills and the lab). The figures stay two voxels deep, as hand-built (decided 2026-11-14), so they are thin when seen side-on. Check: `tests/test_voxpeople.gd` (`-- out=DIR` for a line-up) and `scripts/blender/voxel_sheet.py -- dir=…` (front, back, game angle and two clips per model).
  - **Not done:** faces are simple (eyes, nose, mouth; no expressions); no clips for sitting on benches, carrying or kneeling; the Hollow-moths and the Act II–IV cast come with their chapters.

**Realm v2 trials (parked 2026-11-14).** The Aseprite sprite pipeline, Blender cutscene stills and video, ElevenLabs music, LDtk levels and Dialogic dialogue were tried for Realm v2 and are parked on branch `realm2-trials` (docs, scripts and tests there). Not on `realm`: Realm Chapter 1 is 3D on the story engine with the old textbox. Generated music and video are git-ignored, local only.

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
