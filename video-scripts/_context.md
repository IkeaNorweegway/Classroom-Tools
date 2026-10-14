# Explanation Video Scripts — Design Context
*3Blue1Brown-style — narration-led, animation-first, no avatar*

**Pedagogical framework:** `_meta-context.md` governs how to think. This file governs how to build explanation video scripts specifically. Read both before starting any build.

---

## ⛔ Pre-Build Gate — confirm all six before writing the first beat

| # | Constraint | What failure looks like |
|---|---|---|
| 1 | **Script type declared** — concept explainer or worked-example walkthrough; the two patterns below are different | Writing beats before deciding which arc the video follows |
| 2 | **No avatar** — narration-only voiceover over animated visuals; no character, no talking head, no live-classroom cue language | A SAY/SHOW/CUE beat written as if a teacher or character is on screen |
| 3 | **Color/object legend declared up front** — every recurring object or quantity gets exactly one color for the whole script | A quantity that changes color between beats, or two different things sharing a color |
| 4 | **Redundancy check** — on-screen text is a label or equation, never a transcript of the narration line | ON-SCREEN TEXT column repeating NARRATE word-for-word |
| 5 | **Segmenting confirmed** — every beat is one idea, one transform, with a stated HOLD point | A beat with two simultaneous transformations, or no hold point before the next change |
| 6 | **LO mapping** — the script maps to a specific learning outcome | A script with no stated LO from the unit `_context.md` |

State this before writing: *"Script type: [concept explainer / worked example]. Color legend: [object → color, for every recurring object]. Beats: [N]. LO: [code]. On-screen text is not a transcript of narration."*

Start from `templates/video-script-template.md` — copy it, then fill in content. Never build from a blank file.

---

## What This Script Is (and Isn't)

A video script is the **narration + visual plan for a short, pre-recorded, animation-led explanation** — no instructor on screen, voiceover only, visuals doing the explanatory work. It is scripted for **Manim** (the Python animation library), not for a live lesson and not for the existing avatar pipeline in this workspace.

| Artifact | Format | Primary function |
|---|---|---|
| **Video script** (this type) | Pre-recorded, narration + Manim animation, no avatar | Visual-first explanation or worked-example walkthrough, built once, watched any number of times |
| **Teacher notes package** (`notes-packages/`) | Live instruction, SHOW/SAY/CUE | A real teacher in the room, adjusting in real time, cueing students to write |
| **STEAM capstone video** (`_courses/steam/`) | Student-produced | Students document *their own* design process — a different use case entirely; don't confuse the two naming-wise |
| **Avatar explainer pipeline** (`scripts/_context.md`, `videos/character/`) | Lip-synced character over slides/screen-recording | A separate, already-built pipeline this video type does **not** use — do not route a 3B1B-style script through `scripts/make_explainer_video.py` |
| **Three Act Math video** (`research/three-act-math-research.md`) | A short clip or photo used to launch a lesson's Act 1 | A hook *pattern* borrowed into the concept-explainer arc below — not a full video of this type |

A video script that could be read as a transcript of a live lecture is a bad video script. The visual should be doing real conceptual work — if you removed the animation and kept only the narration, the explanation should fall apart, not just lose some decoration.

---

## The Two Script Patterns

Every script is one of these two. Declare which one before writing — the arc, pacing, and pause structure differ.

### Pattern A: Concept Explainer

Builds intuition for a single idea, grounded in a concrete case before generalizing.

1. **Cold open — the visual puzzle.** A specific, concrete, slightly perplexing case, shown visually in the first 10–20 seconds, before any formal explanation. This borrows the Act 1 information-gap mechanism from `research/three-act-math-research.md`, compressed from a whole lesson into a single short hook. No numbers-dump, no "today we will learn" — show the thing that makes the viewer want the explanation.
2. **Segmented beats building intuition.** Each beat advances one idea with one animated transform. The object/color introduced in the cold open carries through — don't introduce new notation for the general case; let the specific example *become* the general one.
3. **Generalize.** The abstract rule is stated only after the concrete case has done the work — narration should make the move from "in this case..." to "and that's true in general because..." explicit.
4. **Recap, holding the key visual.** End on the single image that captures the idea, held long enough to be the thing a viewer remembers.

**Runtime target:** ≈4–10 minutes.

### Pattern B: Worked-Example Walkthrough

Walks through solving a specific problem, fading guidance as it goes.

1. **State the problem visually** — show the starting state (the equation, the diagram, the setup) before narrating anything.
2. **Step through with fading support** — first step fully worked and narrated (I do); by the second or third step, insert a scripted pause beat inviting the viewer to predict or pause the video before the reveal (self-explanation prompt — see `research/explanation-video-research.md` §5). Don't add a prediction prompt on the very first step; there's no prior-knowledge basis yet for the viewer to generate from.
3. **Resolve and connect back** — after each step resolves, a brief beat connecting it to the concept behind the procedure (not just "and that's the answer").
4. **Recap the full sequence visually** — a compressed replay or a single frame showing all steps at once, so the whole procedure is visible in one image at the end.

**Runtime target:** ≈3–6 minutes.

---

## Manim Scene-Beat Format

Every beat is written in four columns. This is the structural unit of the whole script — see `templates/video-script-template.md` for the exact table.

| Column | What it contains |
|---|---|
| **NARRATE** | The voiceover line for this beat. Explains *why*, not just what's visible — if the line could be deleted and the beat would still make sense from the visual alone, the narration isn't earning its place. |
| **ANIMATE** | The Manim scene beat: which mobjects are involved, what transform happens to them (create, transform, fade, shift, scale — described conceptually, not as literal code), and their color per the declared legend. |
| **ON-SCREEN TEXT** | Label or equation only, if any. Never a transcript of NARRATE. |
| **HOLD** | The segmenting pause — how long the frame stays static after the transform completes, before the next beat's transform begins. Every beat needs one, even if it's brief. |

A beat with an empty HOLD column is incomplete — segmenting isn't an editing decision made after the script is written, it's a scripting decision made beat by beat.

---

## Color and Object Legend

Declared once, at the top of the script, before any beats are written. One row per recurring object or quantity; the color is fixed for the entire video.

**Rule:** if a quantity has no dedicated color, its first appearance assigns one — don't improvise mid-script. If two different quantities would naturally compete for the same intuitive color (e.g., two different "x" variables), resolve it in the legend, not beat-by-beat.

This is the single most load-bearing design choice in a no-avatar format: with no gesture or live emphasis available, consistent color is the main channel carrying "this is the same thing you saw before" across beats. See `research/explanation-video-research.md` §3.

---

## Redundancy and the On-Screen Text Rule

The most common failure in amateur explainer-video scripts: the ON-SCREEN TEXT column repeats the NARRATE column almost word-for-word, because the writer typed the full sentence onto the slide and then read it aloud. This is the redundancy effect (`research/explanation-video-research.md` §2) — it is measurably worse than either narration or on-screen text alone, not neutral.

**Applied rule:** ON-SCREEN TEXT holds only what the viewer needs to *reference* — a label, a short equation, a key term — never a sentence. If a sentence worth of meaning needs to be conveyed, it goes in NARRATE, not on screen.

---

## Segmenting and the HOLD Point

A video has no built-in pause the way a page or a live lesson does — the pacing is entirely imposed by the editor. Without a deliberate hold point at the end of each beat, a fast transformation can finish before the viewer has processed the previous state, and there's no way to catch up short of rewinding.

**Applied rule:** every beat states a HOLD duration. A beat that moves directly into the next transform with no hold is not segmented — see `research/explanation-video-research.md` §1 for why this specific principle matters more for video than for the print or live-instruction formats already documented elsewhere in this workspace.

---

## File naming

`[subject]-[unit]-video-[topic-slug]-v[N].md`

Example: `sci6-forces-video-newtons-first-law-v1.md`
Example: `math9-rational-numbers-video-dividing-fractions-v1.md`

---

## Evidence Base

- `research/explanation-video-research.md` — the primary evidence base for this artifact type: segmenting, modality/redundancy/coherence re-applied to video, signaling in a no-avatar format, concrete-before-abstract sequencing, self-explanation pauses
- `research/three-act-math-research.md` — the information-gap/perplexity hook pattern used in the concept-explainer cold open
- `research/lesson-structure-research.md` — worked-example fading (Sweller, 1988), underlying the worked-example walkthrough pattern
- `research/math-notebook-workbook-design-research.md` — the self-explanation effect (Fiorella & Mayer, 2016), underlying the scripted pause beat
- `research/print-material-design-research.md` — dual coding and contiguity, underlying the on-screen text/visual placement rules

---

## Build Checklist

Before submitting any video script as complete:

- [ ] Script type declared: concept explainer or worked-example walkthrough
- [ ] No avatar, no live-classroom cue language anywhere in the script
- [ ] Color/object legend declared at the top, before any beats
- [ ] Every beat: NARRATE + ANIMATE + ON-SCREEN TEXT (if any) + HOLD, all four considered even where a column is empty
- [ ] ON-SCREEN TEXT never repeats NARRATE word-for-word
- [ ] Every beat has a stated HOLD point
- [ ] Concept explainer: opens on a concrete visual case before generalizing; the hook's object/color carries into the general case
- [ ] Worked-example walkthrough: first step fully worked with no prediction prompt; prediction/pause beat introduced from the second step onward
- [ ] Script maps to a specific learning outcome from the unit `_context.md`
- [ ] Runtime target stated and plausible for the beat count (concept explainer ≈4–10 min; worked example ≈3–6 min)
- [ ] Checked against `templates/evidence-design-principles.md`'s five-item checklist
- [ ] Rendering target: run `python3 scripts/render_video_script.py --script <this file>` (the Manim pipeline documented in `scripts/_context.md`) — not the avatar pipeline in the same file (`make_explainer_video.py`), which is a separate, unrelated video type
