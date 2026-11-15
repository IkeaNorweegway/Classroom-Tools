# Cutscene stills: Brindle Ford bridge fall (first slice)

**Goal:** prove the Blender stills technique end to end with one in-game cutscene image. The user's manual chain (exaggerated rigged model, one animation frame, Freestyle outer lines, compositor pixelation, Aseprite cleanup) becomes a repeatable repo pipeline. This slice is cutscene stills only; portraits, promo and 8-direction turnarounds come later.

**Branch:** create `handoff/cutscene-stills` from the current Realm work. Do not commit, push or delete anything.

## Settled decisions

- **Target:** cutscene stills first.
- **Source:** the user's external `.blend`, passed as `BLEND`. The binary is not committed; the repo owns the look, set manifest, outputs and engine path.
- **Composition:** hero plus Emberdale set. Hero is seen from behind / as a silhouette, so the customizable skin/hair/clothes cannot clash.
- **Look:** 320 x 136 master (2.35:1, matches the cutscene letterbox), 24-colour woodblock palette, Freestyle ink, render at 6x and box-downsample, palette snap.
- **In-game:** full-screen static panel under the letterbox; tap / Enter / Space advances; Esc skips; no zoom.
- **Beat:** the prologue bridge fall in `godot/story-engine/games/realm/game.gd:287-302`. Preserve every student-facing word.

## Assumptions and open questions

- The `.blend` opens in background Blender 5.1 and contains the rigged hero plus a looping walk action. The manifest names the armature object, action and frame.
- The set is staged from the existing GLBs in `godot/story-engine/assets/realm/emberdale/`, not a new Blender set.
- Lighting is dusk/night (the story says harvest night; the 3D game currently simplifies it to daylight). If daylight is wanted, only manifest lights/world change.
- Pell is not rendered in this slice; the caption carries her. Adding her is a later optional extension.
- If the armature/action names differ, the renderer must stop and list the available actions; do not guess.

## Files

Create:

- `art/realm2/palette-cutscene.gpl` - 24 colours (existing 12 plus 12 tones).
- `scripts/blender/stills/bridge_fall.json` - shot manifest.
- `scripts/blender/still_render.py` - open the `.blend`, stage the set, render, pixelate, palette-snap, export.
- `scripts/blender/render_still.sh` - one-command wrapper that finds Blender the way `scripts/aseprite/sprites_from_blender.sh` does.
- `art/realm2/cutscenes/bridge_fall/master_320x136.png`
- `art/realm2/cutscenes/bridge_fall/game_1280x544.png`
- `art/realm2/cutscenes/bridge_fall/promo_1920x816.png`
- `godot/story-engine/assets/realm2/cutscenes/bridge_fall.png` - the 320 x 136 master used by the game.
- `godot/story-engine/tests/test_cutscene_still.gd` - or extend `test_chamber.gd`; prefer extending `test_chamber.gd` because it already exercises `engine/cutscene.gd`.

Edit:

- `godot/story-engine/engine/cutscene.gd` - add the `still` shot.
- `godot/story-engine/games/realm/game.gd` - wrap the bridge-drop beat in a scene with the still.
- `_games-context.md` - document the pipeline under the Realm v2 art section.
- `scripts/_context.md` - list the new script and manifest.

Do not edit:

- `scripts/blender/realm_people.py`, `kit.py`, `people_sheet.py`, any `.glb` or `pack.json`.
- `scripts/aseprite/*`, the sprite loader, `test_aseprite.gd`.
- Any other teaching text, answer key or student-facing wording.
- The `.blend` on disk. Open it read-only in memory; never save it.

## Tasks

### 1. Cutscene palette

Create `art/realm2/palette-cutscene.gpl`. Keep the 12 colours from `art/realm2/palette.gpl` and add these 12:

| Role | Hex |
|---|---|
| ink deepest | `171512` |
| brown dark | `43362c` |
| blue dark | `17293f` |
| slate dark | `45595c` |
| red dark | `7c2c36` |
| green dark | `2e4f40` |
| skin light | `f0cdb2` |
| paper light | `f6ecd9` |
| blue light | `4a6a8e` |
| teal light | `8fb9bf` |
| gold light | `f0dc96` |
| warm grey light | `cfc4ad` |

Use this palette only for cutscene stills. Sprites stay on the 12-colour palette. Do not add dithering in this slice; if banding is unacceptable, add ordered dithering between palette colours as a later step, still palette-compliant.

### 2. Shot manifest

`scripts/blender/stills/bridge_fall.json` holds everything that changes per shot. The renderer must not hard-code positions.

```json
{
  "name": "bridge_fall",
  "out": "art/realm2/cutscenes/bridge_fall",
  "game_copy": "godot/story-engine/assets/realm2/cutscenes/bridge_fall.png",
  "master": [320, 136],
  "render_scale": 6,
  "character": {
    "object": "Hero",
    "height": 1.15,
    "at": [0, -0.8, 0],
    "yaw": 180,
    "action": "walk",
    "frame": 7
  },
  "camera": {
    "at": [0, -9.0, -4.0],
    "look": [0, 0.4, -2.2],
    "lens": 35
  },
  "world": "#1b2430",
  "lights": [
    {"type": "area", "at": [-4, 2, -1], "energy": 450, "color": "#ffd9a0", "size": 4},
    {"type": "area", "at": [4, 6, 0], "energy": 300, "color": "#8fb9bf", "size": 5},
    {"type": "area", "at": [0, -6, 2], "energy": 80, "color": "#4a6a8e", "size": 6}
  ],
  "set": [
    {"model": "t_gorge_edge", "at": [-4, 0, -4], "yaw": 0, "repeat": [1, 3, 4]},
    {"model": "t_gorge_edge", "at": [4, 0, -4], "yaw": 180, "repeat": [1, 3, 4]},
    {"model": "t_gorge_floor", "at": [0, 0, -8], "yaw": 0, "repeat": [3, 4, 0]},
    {"model": "t_water", "at": [0, 0, -8.1], "yaw": 0, "repeat": [3, 4, 0]},
    {"model": "t_waterfall", "at": [0, 5, -4], "yaw": 0},
    {"model": "bridge_broken", "at": [-2.6, 0, 0], "yaw": 90},
    {"model": "bridge_broken", "at": [2.6, 0, 0], "yaw": -90},
    {"model": "rock_a", "at": [3.5, 1.5, -8]},
    {"model": "rock_b", "at": [-3.0, 2.0, -8]},
    {"model": "tree_cottonwood", "at": [-6, -1, 0]},
    {"model": "tree_aspen", "at": [6, -2, 0]}
  ]
}
```

Coordinates are Blender coordinates (x right, y north, z up). Models face -Y. `repeat` is `[count, dx, dy]`. The values above are a starting diorama, not a final composition: frame it with `look`, keep the hero and broken bridge inside the visible 2.35:1 band, and keep the lower centre clear for captions.

### 3. Renderer

`scripts/blender/still_render.py`:

1. Parse `shot=NAME`, read `scripts/blender/stills/NAME.json`.
2. Require `BLEND`; call `bpy.ops.wm.open_mainfile(filepath=BLEND)`. Never save.
3. Find the armature named by `character.object`; if it is absent, print every armature and action name and exit nonzero. Select the action, mute other NLA tracks, set the frame.
4. Scale the character so its world bounding-box height is `character.height`; put its feet at z=0; apply `at` and `yaw`.
5. Import each `set` model from `godot/story-engine/assets/realm/emberdale/<model>.glb` with `bpy.ops.import_scene.gltf`, apply `at`, `yaw`, optional `repeat`.
6. Replace any existing camera/lights with the manifest camera (perspective, lens) and lights. Set the world colour.
7. Use the current EEVEE engine identifier (read the enum; do not hard-code `BLENDER_EEVEE_NEXT`). Standard view transform, no AgX/Filmic, 16 samples, film opaque.
8. Enable Freestyle on the view layer. One line set: silhouette + border + crease. Ink `#2b2821`, thickness 6 px at the 6x render size.
9. Render `320*6 x 136*6 = 1920 x 816` to a temporary PNG.
10. Downsample by 6x6 box filter with numpy, snap every pixel to the nearest `palette-cutscene.gpl` colour in OKLab, force full alpha.
11. Write `master_320x136.png`, `game_1280x544.png` (4x nearest), `promo_1920x816.png` (6x nearest), and copy the master to `game_copy`.
12. Print output sizes, colour count, and a nonzero exit if any pixel is off-palette or has alpha other than 255.

Do not use the user's compositor node tree. The external `.blend` may change; the script owns the look. The user's Freestyle + pixelation + palette snap is recreated deterministically.

### 4. Wrapper

`scripts/blender/render_still.sh`:

```sh
#!/usr/bin/env bash
# Render one cutscene still: scripts/blender/render_still.sh bridge_fall
# Needs BLEND=/path/to/hero.blend. Finds Blender like scripts/aseprite/sprites_from_blender.sh.
set -euo pipefail
```

It should pass `shot="$1"` to `still_render.py` and fail clearly if `BLEND` is unset.

**Gate:** do not start the Godot work until the master PNG reads correctly at 320 x 136: the hero silhouette is legible, the broken bridge and gap are clear, and palette snap has not flattened the figure. Iterate the manifest, not the engine.

### 5. Godot `still` shot

In `engine/cutscene.gd`:

- Add `var still_rect: TextureRect`.
- In `_shot`, add `elif s.has("still"): await _still(s)`.
- `_still` loads the texture, creates a `TextureRect`, sets `texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST`, `expand_mode = TextureRect.EXPAND_IGNORE_SIZE`, `stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED`, `mouse_filter = MOUSE_FILTER_IGNORE`.
- Compute the largest integer scale that fits the viewport: `k = max(1, int(min(vp.x / tex.get_width(), vp.y / tex.get_height())))`. Size the rect to `tex size * k`, centre it.
- Add it to `T.ui.fx_layer` and `move_child(still_rect, 0)` so the letterbox bars, caption and skip button draw over it.
- Fade alpha 0 to 1 over 0.35 s; instantly at full alpha when `T.reduce_motion`.
- `await _hold(float(s.get("secs", 3.0)), true)` so a tap advances. On skip or after the hold, fade out, `queue_free`, set `still_rect = null`.
- In `_free_ui`, free `still_rect` if a scene is skipped before the still finishes.
- Do not add zoom; integer scaling only.

### 6. Prologue wiring

In `game.gd`, leave the lantern and Pell lines as `T.say`. Replace only the bridge-drop beat with a scene:

```gdscript
await T.scene("bridge_falls", [
    {"still": "res://assets/realm2/cutscenes/bridge_fall.png", "secs": 3.0},
    {"do": func(): T.set_flag("bridge_fell", true)},
    {"do": func(): T.rebuild_maps()},
    {"do": func(): T.ui.confetti(30)},
    {"say": "The bridge drops into the gorge with a roar of wood and rope. Pell is clinging to the far edge!"},
])
```

Keep the exact text of that line and every other line. The `do` shots run even when the scene is skipped, so the flag, map rebuild and confetti behaviour are unchanged. The next `T.say("vil1", ...)` and the rest of the prologue stay as they are.

### 7. Tests

Extend `tests/test_chamber.gd` after the existing skip test:

- Play `{still: "res://assets/realm2/cutscenes/bridge_fall.png", "secs": 5.0}` with `T.auto = ""`.
- Assert the still rect exists, has a texture, and is a child of `T.ui.fx_layer`.
- Skip and assert the scene ends and `still_rect` is null.
- Assert the asset loads (a null texture must fail the test), so a missing import is caught.
- Add an optional `out=DIR` argument: after a few frames, save the viewport as `DIR/cutscene_still.png` for visual review.

Also run the existing `test_aseprite.gd`; it must stay PASS because sprites and the 12-colour palette are untouched.

### 8. Docs

- `_games-context.md`: under the Realm v2 art/sprite notes, add a "Cutscene stills (Blender)" subsection: the external `.blend` requirement, the command, the 24-colour palette, the 320 x 136 master, the integer in-game scaling and the `{ still }` shot.
- `scripts/_context.md`: add `stills/` and `still_render.py`.
- Do not change `_status.md` or the review board until the slice is accepted.

## Validation ("Done means")

Run in order and record the output in the handoff:

1. Palette file has 24 entries and every colour is unique:
   `python3 -I -c "..."` or a simple `grep -c` on the GPL.
2. Render:
   `BLEND=/absolute/path/to/hero.blend scripts/blender/render_still.sh bridge_fall`
   It exits 0 and writes the master, 4x and 6x PNGs plus the Godot copy.
3. Image checks (script in the renderer or a small Python check):
   - master is 320 x 136;
   - game copy is byte-identical to the master;
   - 4x is 1280 x 544 and 6x is 1920 x 816;
   - every pixel is one of the 24 palette colours;
   - alpha is 255 everywhere;
   - the 4x and 6x images are exact nearest-neighbour upscales of the master.
4. `godot --headless --path godot/story-engine --import`
5. `godot --headless --path godot/story-engine -s res://tests/test_chamber.gd -- game=lab debug=1 auto=right hold=puzzle` prints all checks passed.
6. `godot --headless --path godot/story-engine -s res://tests/test_aseprite.gd` still prints PASS.
7. Visual check: open `art/realm2/cutscenes/bridge_fall/master_320x136.png` and the 4x image. The hero reads as a backlit silhouette at the near lip; the broken bridge and gap are legible; the gorge/waterfall frame the shot; no stray Freestyle lines or palette banding that loses the figure. If it fails, adjust only the manifest (camera, set, lights), re-render and re-check.
8. Play the prologue with `scene=bridge_falls` (or the test screenshot) and confirm the panel appears under the bars, the text is unchanged, tap/Enter advances, Esc skips, and the flag/map/confetti still happen.
9. `git status --short` shows only the files listed above.

## Risks and mitigations

- **External source is not reproducible elsewhere.** The master PNG and manifest are committed, so the game and review still work; re-rendering requires the user's `.blend`. Document `BLEND` clearly and fail with a useful message.
- **Rig/action names differ.** List available armatures and actions and stop; never guess.
- **Scale mismatch between the exaggerated hero and the Emberdale set.** The manifest `height` is authoritative; measure the bounding box after import.
- **Freestyle/EEVEE API differences in Blender 5.1.** Read enum identifiers and property names at runtime; do not copy identifiers from older versions.
- **Palette snap loses the silhouette against the gorge.** Use the warm rim light and the ink outline; check contrast at 320 px. If needed, raise the key/rim energy or lighten the background, not the palette.
- **Letterbox covers the image.** The still is 2.35:1, matching the 12% bars; at 1366 x 768 a 4x still is 1280 x 544 and fits inside the 584 px opening. Keep the hero and action out of the outer 10% anyway.
- **Student-facing text changes.** Only wrap the existing line in a scene; diff the prologue before and after to confirm the words are identical.

## Out of scope (later slices)

- Dialogue portraits and the hero look-variant problem.
- Promo / key art layouts and 16:9 crops.
- 8-direction sprite sheets from the 45-degree turntable.
- Aseprite cleanup layers for eyes.
- The 2D sideview pivot and any world/camera changes.
- Replacing the 3D people pack or the Emberdale models.
