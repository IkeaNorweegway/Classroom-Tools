# Blender cutscene video: the bridge fall

**Goal:** replace the Realm prologue's in-game still with a Blender-rendered video clip that has its own camera move and more detail than the game. The clip plays under the existing letterbox bars and dialogue. This supersedes the still-only plan for the prologue; the `{ still }` shot stays in the engine for future stills.

**Branch:** continue on `handoff/cutscene-stills`. Do not commit, push, stash or revert anything. The tree is dirty from earlier slices; only touch the files below.

## Decisions

- **Format:** Ogg Theora, played by Godot's `VideoStreamPlayer`. 1280 x 544 (2.35:1, the letterbox band), 24 fps, 8 s, no audio. Linear filtering in game. No palette snap: the clip may be richer than the 320 x 136 pixel still.
- **Content:** a slow camera move over the broken bridge and Pell on the far edge. The drop happens in the dialogue; the visual is the aftermath. A falling-deck animation is out of scope for this slice; the renderer keeps an optional `bridge` block for a later pass.
- **Source:** the user's external rigged `.blend`. `BLEND` names it, Blender opens it read-only, and it is never saved. The manifest owns the camera keys, character pose, Pell and set.
- **Names:** keep `scripts/blender/still_render.py` and `scripts/blender/render_still.sh`; the script renders a video when the manifest has a `video` block, otherwise a still. Document the dual mode.
- **The user's composition is authoritative.** The top-level `character`, `camera`, `lights` and `set` in `scripts/blender/stills/bridge_fall.json` are hand-tuned. Do not overwrite them.

## Current state (do not redo)

These are already in the working tree and pass the plumbing test:

- `engine/cutscene.gd`: `{ video: ... }` shot, `VideoStreamPlayer`, black backing, fills the 12% band, linear filter, freed on end/skip; `_fade` moves above the clip. `{ still }` remains.
- `games/realm/game.gd`: the `bridge_fall` scene runs the three `do` steps, the video, the existing line, then the fade.
- `tests/test_chamber.gd`: video block (loads, plays, is in `fx_layer`, backing, fills the band, screenshot `out=DIR/cutscene_video.png`, frees on skip). It passes 36/36 with a temporary 480 x 204 preview Ogg.
- `scripts/blender/still_render.py`: video branch (camera-key lerp, fixed character/Pell pose, optional hinged bridge, per-frame render, ffmpeg Ogg Theora, poster, copy, preview overrides).
- `scripts/blender/stills/bridge_fall.json`: `video` block with the user's camera start, a pull-back end, `character {idle,12}`, `pell {people/pell, [2.6,0.3,0.4], cheer, 12}`, no `bridge`.
- `godot/story-engine/assets/realm2/cutscenes/bridge_fall.ogv` is a **480 x 204 stand-in preview**, not the deliverable. `bridge_fall.png` is a stale still the prologue no longer uses.

## Tasks

1. **Finalise the video block** in `scripts/blender/stills/bridge_fall.json`; keep the top-level composition.
   ```json
   "video": {
     "size": [1280, 544],
     "fps": 24,
     "seconds": 8.0,
     "out": "bridge_fall.ogv",
     "game_copy": "godot/story-engine/assets/realm2/cutscenes/bridge_fall.ogv",
     "poster": "poster_1280x544.png",
     "camera": [
       {"t": 0.0, "at": [-6.0, -5.5, 1.6], "look": [0.3, 0.2, -0.6], "lens": 30},
       {"t": 8.0, "at": [-7.5, -8.5, 2.4], "look": [0.4, 0.3, -1.0], "lens": 28}
     ],
     "character": {"action": "idle", "frame": 12},
     "pell": {"model": "people/pell", "at": [2.6, 0.3, 0.4], "yaw": 0, "action": "cheer", "frame": 12},
     "ink_px": 2
   }
   ```
   The start matches the user's still camera; the end pulls back to reveal the gap and Pell. If the real hero or Pell is out of frame, change only these keys.

2. **Finish the renderer video branch** in `scripts/blender/still_render.py`.
   - Camera keys: smoothstep lerp of `at`, `look`, `lens`; `bpy.context.view_layer.update()` before each render.
   - Character/Pell: one fixed scene frame (12) so both actions evaluate; do not advance the scene frame per render.
   - Optional `bridge` block: hinged planks; leave the code but ship this clip without it.
   - Per-frame PNGs in a temp dir; `ffmpeg -y -framerate <fps> -i frame_%04d.png -c:v libtheora -q:v 8 -an <out.ogv>`.
   - Poster: last frame when there is no bridge block; size-derived name if `poster` is absent.
   - Copy to `game_copy`; skip when source and destination are the same file.
   - Preview overrides: `fps=`, `seconds=`, `size=WxH`, `keep_frames=1`, `noencode=1`, `out=`, `video_copy=`.
   - Flush stdout/stderr before `os._exit(0)`. Never save the `.blend`.
   - Print the action/frame, Pell, size/fps/seconds/frames and output paths.

3. **Verify the engine shot** in `engine/cutscene.gd`.
   - Player at index 1, full-screen black backing at index 0, bars/captions above.
   - `expand = true`, `loop = false`, `TEXTURE_FILTER_LINEAR`, position/size = the 12% band.
   - Wait while playing; stop on skip; `_clear_video()` in `_free_ui()`; `_fade` index is 2 when a still or video exists.
   - Missing asset: warn and hold, never crash.

4. **Keep the prologue wiring** in `games/realm/game.gd`. The `do` steps stay separate so they run on auto-skip. The user-visible line must remain byte-identical: "The bridge drops into the gorge with a roar of wood and rope. Pell is clinging to the far edge!"

5. **Finish the tests** in `tests/test_chamber.gd`.
   - The video block is present; keep the 0.8 s wait before `out=DIR` so the first decoded frame is captured, not the black backing.
   - Add a headless guard (already present) so `out=` does not fail in CI.
   - `tests/test_aseprite.gd` must still print PASS.

6. **Docs.**
   - `_games-context.md`: rename the "Cutscene stills" subsection to "Cutscene stills and video (Blender)"; document `BLEND`, the 1280 x 544 Ogg, no palette snap, the `{ video }` shot, the still mode, the poster and the preview overrides.
   - `scripts/_context.md`: mention the video mode.

7. **Render and review.**
   - `BLEND=/abs/hero.blend scripts/blender/render_still.sh bridge_fall` at the manifest size (1280 x 544, 24 fps, 8 s).
   - Inspect the poster, first/mid/last frames, and the game at 1366 x 768. The 480 x 204 preview was only a plumbing test; the final must be 1280 x 544 and sharp.
   - Iterate only the manifest if the composition fails.

8. **Clean the stand-ins.** After the real render, remove the preview `bridge_fall.ogv`/`.uid` and the stale `bridge_fall.png`/`.import` if the prologue no longer uses the still. Leave the user's other dirty files alone.

9. **Report** in the handoff: the `BLEND` path (or "not provided"), camera keys, video size/fps/length, the hero/Pell positions and measured sizes, how the clip reads at 1366 x 768, and any remaining blocker.

## Validation

- `ffprobe` on the Ogg: `theora`, 1280 x 544, 24 fps, ~8 s.
- `godot --headless --path godot/story-engine --import`.
- `godot --headless --path godot/story-engine -s res://tests/test_chamber.gd -- game=lab debug=1 auto=right hold=puzzle` → all checks passed.
- `godot --headless --path godot/story-engine -s res://tests/test_aseprite.gd` → PASS.
- `godot --headless --path godot/story-engine -- game=realm debug=1 auto=right stop=meet_hesper quit=1` → `STOPPED-AT meet_hesper`, exit 0 (the video scene auto-skips its `do` steps and does not hang).
- `godot --path godot/story-engine --resolution 1366x768 -s res://tests/test_chamber.gd -- game=lab debug=1 auto=right hold=puzzle out=/abs/dir` → `cutscene_video.png` shows the clip filling the band, bars/captions above, no live world showing.
- `git status --short` shows only the intended files; no preview Ogg, no stale still.

## Risks and blockers

- **The external `.blend` is not on this machine.** The preview with the stand-in hero proves the pipeline, but the real clip cannot be rendered until the user supplies `BLEND`. Do not ship the stand-in Ogg.
- **Action names differ.** `idle`/`cheer` may not exist in the user's `.blend`. The renderer lists actions and NLA tracks and stops; change the manifest, never guess.
- **Layering.** The video sits at index 1, the backing at 0, the bars/captions above; the end-of-scene fade must be at index 2 so it covers the clip but not the bars.
- **Aspect.** The clip is 2.35:1 and the 1366 x 768 opening is 2.34:1; `expand = true` stretches by under 1%, which is acceptable for video. Do not use nearest filtering here.
- **Runtime.** 192 frames at 1280 x 544 with EEVEE + Freestyle takes minutes. Use the preview overrides for plumbing; do not judge the look from a 480 x 204 preview.
- **The still pipeline is separate.** The 24-colour palette and 320 x 136 still are not used by this clip; do not reintroduce the palette snap.

## Out of scope

- Bridge physics/falling-deck animation, Pell rescue animation, audio, portraits, promo layouts, web export preset changes.
- Replacing the in-game 3D people or Emberdale set.
