# Character rig

`character.sifz` already exists and is wired correctly — the full pipeline
(`scripts/make_explainer_video.py`) has been tested end-to-end against it:
narration → Rhubarb cues → waypoints injected into `mouth_switch` → Synfig
render → ffmpeg composite, with the mouth visibly changing shape in sync
with the audio.

It's a **placeholder**: a plain circle head, two dot eyes, and nine simple
oval mouth shapes. Good enough to prove the automation works; not a finished
character design.

## Improving the art (optional, manual, in Synfig Studio)

Open `character.sifz` in Synfig Studio and replace the circle/ellipse
layers with real artwork — a body, a distinct head shape, whatever style
you want. This is the one genuinely manual step in the whole pipeline,
since drawing isn't scriptable.

**The one thing not to break:** the `mouth_switch` layer must stay a
Switch-type layer with that exact `desc`, and its children must keep the
exact `desc` codes Rhubarb uses:

| Code | Shape |
|---|---|
| `A` | closed mouth (M, B, P) |
| `B` | slightly open (consonants) |
| `C` | open (E, EH) |
| `D` | wide open (A) |
| `E` | rounded, mid-open (O) |
| `F` | puckered (OO, W, Q) |
| `G` | teeth on lip (F, V) |
| `H` | wide, tongue visible (L) |
| `X` | idle/rest (silence) |

You can redraw what's *inside* each shape layer freely (make them look like
an actual mouth instead of an oval) as long as the layer names and the
switch structure stay the same — the pipeline script matches purely on
those names.

## Regenerating the placeholder

`scripts/build_character_rig.py` is the generator that produced the current
`character.sifz`. Edit the shapes/colors/`MOUTH_SHAPES` dict in it and
re-run (`python3 scripts/build_character_rig.py` from the project root) to
regenerate — useful for quick tweaks without opening the GUI at all, though
it only produces simple vector-geometry art, not illustration.

## Checking the rig after any manual edit

```bash
python3 "scripts/make_explainer_video.py" --inspect videos/character/character.sifz
```

Confirms the `mouth_switch` layer and its `layer_name` parameter are still
present and named correctly before running a full video through it.
