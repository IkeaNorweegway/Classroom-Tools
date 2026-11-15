# Realm voxel character: build template

The measured build of the hand-made hero in `Hero-pixel.blend` (the `VoxelRig` model, read 2026-11-14), and the rules
every other Realm character follows. The builder is `scripts/blender/realm_voxel_people.py`; the pack it writes is
`godot/story-engine/assets/realm/voxpeople/`.

## 1. The idea

A character is a **front-view pixel drawing, two voxels deep**. The front layer carries the front drawing and the back
layer carries the back drawing. It is cut into ten rigid blocks that swing on eleven bones. Nothing bends: a joint is
two blocks meeting on a grid line.

| | |
|---|---|
| Voxel | a 40 mm cube (0.04 game units; 1 unit = 1 map tile) |
| Hero's grid | 14 columns × 27 rows × 2 layers → 0.56 wide, 1.08 tall, 0.08 deep |
| Facing | +z in Godot (−Y in Blender), standing on y = 0, centred on the origin, placed at scale 1 |
| Colour | one flat colour per voxel, stored as vertex colour (`Color`, face corner); no textures, no materials |
| Faces | outside faces only, plus the two faces where blocks on different bones meet (so a bent joint stays closed) |

## 2. The grid

Columns are counted from the body's centre line: **x = −7 … 6**. The character's own left is **+x** (it appears on
the right when you look at the front). Rows are counted up from the ground: **y = 0 … 26**.

| Block | Bone | Columns (x) | Rows (y) | Size |
|---|---|---|---|---|
| Right shin / left shin | `shin_R` / `shin_L` | −4…−1 / 0…3 | 0–4 | 4 × 5 |
| Right thigh / left thigh | `thigh_R` / `thigh_L` | −4…−1 / 0…3 | 5–9 | 4 × 5 |
| Torso | `spine` | −4…3 | 10–18 | 8 × 9 |
| Right upper arm / left | `arm_R` / `arm_L` | −7…−5 / 4…6 | 11–18 | 3 × 8 |
| Right forearm / left | `fore_R` / `fore_L` | −7…−5 / 4…6 | 6–10 | 3 × 5 (row 6 is the hand) |
| Head | `head` | −5…5 | 19–26 | 11 × 8, corners stepped |

Head rows from the neck up (first and last column): 19: −4…4 · 20, 21, 22: −5…5 · 23: −5…4 · 24, 25: −4…4 · 26: −3…3.
The head is 11 wide on an 8-wide body, so it sits half a cell to the character's left of the body's centre line. Row 23
is one cell short on the character's left. Both are kept as built.

**Front drawing** (seen from the front; `.` is empty):

```
row    x: -7 … 6
 26    ....AAAAAAA...      A hair      #d0a773
 25    ...AAAAAAAAA..      B skin      #f5ddc5
 24    ...AAAAAAAAA..      C eye       #2b2622
 23    ..AAABBABBAA..      E mouth, pouch #9a6a5a
 22    ..BBCCBBBCCBB.      F yoke      #8697b8
 21    ..BBCCBBBCCBB.      G stud      #f2c84b
 20    ..BBBBBBBBBBB.      H tunic     #97c5e5
 19    ...BBBEEEBBB..      I belt      #4b3a2c
 18    FFFFFFFFFFFFFF      J buckle    #c99a2e
 17    FFFGGFFFFGGFFF      K cuff      #6e5038
 16    FFFGGFFFFGGFFF      L hem       #7787a2
 15    HHHHHHHHHHHHHH      M boots     #a08b7a
 14    HHHHHHHHHHHHHH
 13    HHHHHHHHHHHHHH
 12    HHHHHHHHEEEHHH
 11    HHHHHHHHEEEHHH
 10    HHHIIIJJIIIHHH
  9    HHHHHHHHHHHHHH
  8    HHHHHHHHHHHHHH
  7    KKKHHHHHHHHKKK
  6    BBBHHHHHHHHBBB
  5    ...HHHHHHHH...
  4    ...LLLLLLLL...
  3    ...MMMMMMMM...
 2–0   ...MMMMMMMM...
```

- **Eyes:** 2 × 2, at x = −3, −2 and x = 2, 3, rows 21–22. **Mouth:** x = −1…1, row 19.
- **Studs (G):** each is a gold diamond drawn across its 2 × 2 cells, not four full cells.
- **Back drawing:** hair fills rows 23–26, then x = −4…4 on row 22 and x = −3…3 on row 21; a collar in the yoke colour
  at x = −2…2 on row 19; yoke rows 16–18; plain tunic below; belt, cuffs, hands, hem and boots as on the front. No
  eyes, mouth, studs, buckle or pouch.

## 3. The rig

Eleven bones, named as in `VoxelRig`. Each block is bound 100% to its one bone. Positions in metres, x toward the
character's left, y up:

| Bone | Parent | Pivot (head of the bone) | Points to |
|---|---|---|---|
| `hips` | — | (0, 0.40) | up |
| `spine` | `hips` | (0, 0.40) | the neck (0, 0.76) |
| `head` | `spine` | (0, 0.76) | the crown (0, 1.08) |
| `arm_L` / `arm_R` | `spine` | (±0.22, 0.70) | the elbow (±0.22, 0.44) |
| `fore_L` / `fore_R` | its arm | (±0.22, 0.44) | the hand (±0.22, 0.24) |
| `thigh_L` / `thigh_R` | `hips` | (±0.08, 0.40) | the knee (±0.08, 0.20) |
| `shin_L` / `shin_R` | its thigh | (±0.08, 0.20) | the ground (±0.08, 0) |

For any proportions: hip, knee, elbow and neck pivots sit **on the grid line between the two blocks**; the shoulder
pivot is 1½ rows below the top of the arm, at the middle of the arm's width; leg pivots are at the middle of each leg.

## 4. Clips

24 frames a second; every clip loops. Angles are degrees about the x axis unless marked; negative swings a hanging
limb forward.

**walk** (the hand-keyed cycle; 20 frames, keys at 1, 6, 11, 16, 21):

| Frame | head | arm_L | fore_L | arm_R | fore_R | thigh_L | shin_L | thigh_R | shin_R |
|---|---|---|---|---|---|---|---|---|---|
| 1 and 21 | 4 | −30 | −25 | 30 | −15 | 35 | −10 | −35 | 50 |
| 6 and 16 | 0 | 0 | −10 | 0 | −10 | 0 | 15 | 0 | 15 |
| 11 | 4 | 30 | −15 | −30 | −25 | −35 | 50 | 35 | −10 |

| Clip | Frames | What happens |
|---|---|---|
| idle | 1–49 | arms 3° out from the body, the spine leans back 1.5° and returns, the head looks left then right |
| talk | 1–41 | the free forearm lifts and beats; the head nods |
| cast | 1–19 | both arms straight out in front, a small pulse; one foot forward |
| cheer | 1–13 | both arms up (150° sideways), a 0.06 hop |

Robes and dresses use 0.55 of the leg swing. A character who **holds** something keeps that arm still in every clip
and talks, casts and cheers with the other. The Hollow floats: idle, walk and cast only.

## 5. Changing the proportions

A character is the hero's layout with different row counts; the voxel stays 0.04 and the head stays 11 × 8.

| Build | shin | thigh | torso | arm | forearm | body width | Rows | Used by |
|---|---|---|---|---|---|---|---|---|
| Hero (standard) | 5 | 5 | 9 | 8 | 5 | 8 | 27 | apprentice, hero, hero_m, abel*, rowan, odile, gale, taddeus, roan |
| Shorter | 5 | 5 | 8 | 8 | 5 | 8 | 26 | hero_f, marta, sefa |
| Short legs | 4 | 5 | 9 | 8 | 5 | 8 | 26 | hesper |
| Tall | 5 | 6 | 10 | 8 | 5 | 8 | 29 | orrin, hollow, morvane |
| Tall, standard torso | 5 | 6 | 9 | 8 | 5 | 8 | 28 | ilsabet |
| Old and small | 4 | 4 | 8 | 7 | 5 | 8 | 24 | wenna |
| Child | 4 | 3 | 7 | 6 | 4 | 8 | 22 | pell |

\* Abel's body is 10 wide (heavy-set); his arms move out one column each side. Bram (standard rows) is 12 wide, the broadest. Animals are solid voxel bodies on the `quad_rig` (body, head, four legs, tail); the cart `horse` is 42 voxels high at the ears, with 4 × 4 legs and clips idle and walk only.

## 6. Extra layers

Most of a character lives in the two layers. Pieces that must stand out sit **one layer out**:

- **In front (d = −1):** beards over the chest, hat brims and peaks, braids, a pouch or satchel, a held slate or ledger.
- **Behind (d = 2):** cloaks and capes, a bun, long hair down the back, a hood.
- **Beside:** a staff is one voxel thick, one column outside the holding hand, bound to `spine` so it stays upright.
- **Wider hems:** a robe's bottom rows may be one column wider each side, but only below the hand row.

## 7. Rules for a new character

1. Start from the hero's layout (section 2) and pick a build (section 5).
2. Keep the face: 2 × 2 eyes, 3-wide mouth, same cells. On dark skin the outer column of each eye is off-white so the
   eyes read. Dark hair leaves x = −3 and x = 3 out of the fringe so hair and eyes do not run together.
3. Use four to seven colours, plus skin and hair. One strong colour per person so they read at game size.
4. Give each person **one thing to know them by from the back and the front**: a hat, a cloak, a tool.
5. Draw the back: hair, cloak, belt. No face, no front details.
6. A hat's brim is row neck + 5; the fringe (neck + 4) and the eyes stay clear.
7. Glowing parts go in their own mesh named `*_glow` (Orrin's `Staff_glow`, Morvane's `Rune_glow`).
8. Build, then look at the picture sheet and the Godot line-up (section 9) before using it.

## 8. The tinted and chosen heroes

- `hero`: white slot meshes the game colours from a look: `Skin`, `Hair_<style>`, `Top`, `Legs`, `Boots`, `Cloak`;
  `Fixed` (eyes, mouth, belt, pouch) and `Glasses` are never tinted.
- `hero_f`, `hero_m`: `Skin`, `Hair_<style>`, `Fixed`, `Glasses`, and earned clothes in their own colours:
  `Wtop_farm / novice / adept / warden`, `What_novice / emberdale / riverholm / greystone / bonelands / warden`,
  `Wshoes_work`.
- Hair styles: short, long, bun, curly, shaved, braids. On these three models hair is an overlay standing 5 mm proud
  of a bald head, and every style fits inside every pointed hat.

## 9. Build and check

```
flatpak run org.blender.Blender -b --python scripts/blender/realm_voxel_people.py -- [only=orrin,pell]
flatpak run org.blender.Blender -b --python scripts/blender/voxel_sheet.py -- dir=/abs/out [only=…]
godot --headless --path godot/story-engine --import
godot --headless --path godot/story-engine -s res://tests/test_voxpeople.gd
godot --path godot/story-engine --resolution 1366x768 -s res://tests/test_voxpeople.gd -- out=/abs/dir
```

To add a character, write one function in `realm_voxel_people.py` under `@model(name, "person", note)`: call
`person(name, skin, build)`, paint clothes with `F.box(x0, y0, x1, y1, colour, d)` and the helpers (`robe`,
`trousers`, `sleeves`, `mantle`, `hair`, `beard`, `hat_pointed`, `staff`, `glasses`), and end with
`F.finish(lg=…, hold=…)`.

## 10. What was tidied from the hand-built model

The rebuilt reference model is `apprentice`. It matches the hand-built one cell for cell on the front, with these
changes:

- The mesh sat 15.7 mm to the character's right of the rig; it is now centred.
- Bone pivots were 16–67 mm off the block seams (shoulder 107 mm below the arm's top, elbow 67 mm above the seam,
  knee 27 mm above); they now sit on the seams, with the shoulder 60 mm below the arm's top.
- Inside faces between cells of the same block are left out (about 9 000 triangles down to 312).
- Each eye is a full 2 × 2 (two eye cells had been pushed in and one was pure black).
- The back layer still carried an older front drawing on its sides, and the back was missing the belt and had a
  stray yoke-coloured patch on the left forearm; the back is now a clean back drawing with the belt.
