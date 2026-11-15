# Model routing table

Who does what, and on which model and effort. From the 2026-11-03 audit. Delegate without asking. The standing rule and the five-file rule are in `CLAUDE.md` (Model routing).

| Work | Who | Model / effort |
|---|---|---|
| Teaching content: notes, workbooks, questions, keys (the maths), outcome maps, test design, research summaries | Main session | Opus, high for a new unit or test, medium for revisions |
| Designing a game, sim or trainer: the model, missions, named errors, question banks; video scripts | Main session | Opus, high |
| Rendering, Astro pages, `src/data`, nav, links, site build | `render-and-site` | Sonnet, medium |
| Bulk restyles and sweeps: "make all X look like Y", CSS or font rollouts, wiring a component into every viewer, section ids, link fixes; HTML polish on interactives and media pipeline steps once the design or script is set | `sweep` | Sonnet, medium |
| Read-only checks: screenshots, layout at 1366×768, svg-audit, diagram vs text, key vs question, headless playtests | `checker` | Sonnet, low |
| Ongoing diagram polish (Math 7/8 `@viz` types and Math 9 topics, readability and realism), one type or topic per run in its own worktree; fixes wait in `_image-review/pending.md` for "approve TYPE" / "reject TYPE: why" (steps at the bottom of the agent file). Start with `/loop Run the image-polish agent on the next type in _image-review/queue.md` | `image-polish` | Sonnet, medium |
| Nightly CEFL Town v2 play-through: walkable paths, natural and logical speech, quest flow. Logs suggestions only, never changes the game. Runs at 02:00 from the `cefl-playtest` systemd user timer (`scripts/playtest_nightly.sh`); findings in `_playtest-review/suggestions.md`; turn one down with a line in `_playtest-review/dismissed.md` (`S-004: why`) | `playtest` | Sonnet, medium |
| Overseeing the Math 9 Realm game: build vs the chapter design, the Realm tests, the maths (answers, misconceptions, RN coverage), and a task board of done / in progress / next with an owner for each task. Report-only, never changes the game. Run by hand ("run the realm manager"); board in `_realm-review/board.md`, issues in `_realm-review/issues.md`; turn one down in `_realm-review/dismissed.md` (`R-004: why`). The main session hands out its next batch | `realm-manager` | Sonnet, medium |
| Changing the Math 9 Realm game's code and maps once the task is written: board tasks from `_realm-review/board.md`, walking and map fixes, panel and report fixes, wiring a chapter from its finished design. Stops at teaching content (questions, answers, hints, story lines) and reports it back | `realm-builder` | Sonnet, medium; Opus, high for a new panel type or an engine change (override the model when starting it) |
| Adding or fixing people and animals in the Realm voxel pack (`realm/voxpeople`) on the template in `templates/realm-voxel-character-template.md`, once the main session has listed who and how they look | `voxel-people` | Sonnet, medium; Opus, high for a new body type, rig or clips |
| Adding or fixing 3D models in an existing Blender pack (props, buildings, clothes, recolours, cast variants on an existing rig) once the main session has listed them | `blender-models` | Sonnet, medium; Opus, high for new rigs, body bases or clips (override the model when starting it). Choosing what to model stays in the main session |
| Finding things: "where is…", "what's unmerged", file searches | `Explore` | low |
| Quick questions (git, tools, "what is…") | Main session; suggest `/model sonnet` and `/effort low` | Sonnet, low |
| `max` effort, `/code-review ultra` | Only when the user asks | — |
