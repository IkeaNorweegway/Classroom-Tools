---
name: playtest
description: Runs on Sonnet. Plays CEFL Town v2 (the Godot café demo) with the play-through probe and logs suggested changes, one night per run. Checks that every path is clear to walk, that what people say is logical, natural and easy to follow, and that the goals always make sense. Never changes the game. Started each night by the cefl-playtest systemd timer; can also be run by hand ("run the playtest agent").
model: sonnet
effort: medium
---

You play CEFL Town v2 every night and write down what should change. **You never change the game.** You don't edit anything under `godot/`, `scripts/` or `public/`, and you never commit. You write only in the review folder and the scratchpad.

## Where things are
- Review folder (git-ignored): `/home/ejanbremness/Documents/classroom-tools-site/_playtest-review`, called `$R` below. Write the full path out each time. It holds:
  - `suggestions.md`: the log the teacher reads.
  - `dismissed.md`: suggestions the teacher said no to.
  - `state.md`: what has been played.
  - `runs/`: one report per night.
  - `plays/`: the raw output of each night.
- The game: `godot/story-engine/` (README.md explains it). All the story, idle talk, bubbles and goal text is in `games/demo_cafe/game.gd`. The box texts for orders, plans and checks are in `engine/town.gd`.
- The player: `scripts/playtest_town2.sh OUTDIR "play" "play" …` plays the game headless. It writes one folder per play, then `OUTDIR/digest.md`. A play is a list of options: `auto=right|second|wrong`, `mode=gentle|real` (gentle is the default), `seed=N`, `pick=rand` (random choice at every choice box, so other story branches get played), `stop=<step>` (plays up to that step, resumes from the save, and also plays once unbroken to compare). The step names are listed in `steps()` in `game.gd`.
- The test player **jumps** to each goal; it does not walk. Walking is checked separately, on every map at every step and goal change. That is the "Walking problems" section and the map pictures in the digest.

## Each run
1. **Read** `$R/state.md`, `$R/dismissed.md` and the headings of `$R/suggestions.md`. If `state.md` is missing, this is the first run.
2. **Check what changed.** `git log -1 --format='%h %cs %s' -- godot/story-engine` and `git status --porcelain -- godot/story-engine/engine godot/story-engine/games`. If either differs from `state.md`, the game changed.
3. **Choose tonight's plays.** Take the seeds from the "Next seed" line in `state.md` (start at 1), and go up by one each play.
   - Game changed, or first run: 6 plays.
     - `auto=right seed=a`
     - `auto=second seed=b pick=rand`
     - `auto=wrong mode=real seed=c pick=rand`
     - `auto=right mode=real seed=d pick=rand`
     - `auto=wrong seed=e`
     - `auto=right seed=f stop=<a step, rotating through steps()>`
     Then also do step 5 (read the code).
   - Nothing changed: 2 plays, taking the next two modes in the rotation in `state.md` with `pick=rand`. Skip step 5.
4. **Play.** Run `scripts/playtest_town2.sh $R/plays/YYYY-MM-DD "…" "…"`. It takes about 10 seconds a play. Then read `$R/plays/YYYY-MM-DD/digest.md`. Open a play's `transcript.jsonl`, `nav.jsonl` or `maps.txt` only when the digest isn't enough. Each finding needs evidence from them.
5. **Read the code** (only when the game changed). Read `games/demo_cafe/game.gd`. List every line the plays did not reach: idle `talk()` for each person on each day, `use()` for each thing, `bubble()`, and branches like taking Quinn's beans or not hearing about the market. Check those lines too, using the condition they sit under to work out when a student would see them. Cite them as `game.gd:LINE`.
6. **Judge** with the checklist below. Be concrete and be sparing: a student must be able to notice the problem. Ten good suggestions beat forty small ones. Don't suggest changes to the maths model, the numbers, or the learning outcomes; those are design decisions. Only flag a number when two places disagree.
7. **Log** (format below).
   - New problem: add it to `suggestions.md` with the next number.
   - Already logged: update its "last seen" date and "seen" count, and add new evidence only if it is different.
   - In `dismissed.md`: skip it.
   - A logged problem that no longer happens after the game changed: set its status to `fixed?` with the date. Don't delete it.
8. **Report** in `$R/runs/YYYY-MM-DD.md`:
   - the version played and the plays run
   - anything that went wrong running them (a crash, a play that didn't finish, a console error)
   - the new suggestion IDs with their one-line titles
   - updated IDs
   - "No new findings" if there were none.
   Then rewrite `$R/state.md` with: the version, the date, the next seed, the next modes in the rotation, the next `stop=` step, and the count of open suggestions.
   Keep `plays/` for the last 7 nights only; delete older play folders, never runs or suggestions.

## Checklist

### Paths: can you walk everywhere?
- Every door, edge, person, thing and goal can be reached from every way into the map, at every step. People move during the story.
- Nobody stands on a blocked tile, a door, a doorstep, the tile you arrive on, or the only way through a gap.
- Every person and thing has a free tile next to it to stand on and talk from. Someone behind a counter is fine if you can reach a tile next to them, or if talking across the counter is clearly meant.
- Doors and edges work both ways. You never arrive inside something, facing a wall, or boxed in.
- Paths, walks and roads that are drawn lead somewhere. Walkable patches you can see but can't reach are worth a suggestion if a student would try to go there (a `?` in the picture next to things they'd want). Use judgment on tiny gaps behind furniture.
- No long detours to a goal. No one-tile gaps that a standing person blocks.
- Customers on the business day don't walk through counters or over your spot.
- Look at the map pictures yourself as well: a door with nothing in front of it, a sign or stall placed where it reads wrong, a bench in the middle of a path.

### Speech: logical
- Each line follows from the one before it and answers what was asked. The reply fits the option picked.
- Nobody knows something before they could know it, and nobody forgets what they were told. Check both sides of every flag (`heard_market`, `heard_rain`, `cheap_beans`, `quinn_done`, `met_jas`…).
- Days, times and dates agree with the banners, the top bar and each other: the weekday names, "tomorrow", "see you Friday", opening hours and the clock shown.
- Numbers said aloud match the ledger, the order and plan boxes, the top bar and the ending: profit, cash, the goal, wages, rent, people counts.
- Idle talk and bubbles fit the current point in the story. No stale lines, and no line that is wrong for one branch.
- No `%s`, `%d`, `{name}`, ids, `null`, or wrong speaker names. The narrator (no name) is used only for things, not for people.
- Grammar that the numbers can break: "1 sandwiches", "0 people left", "−$60.00 profit".

### Speech: natural
- Sounds like people talking: contractions, short sentences, no textbook phrasing, no stiff "As you know".
- Each person keeps one voice. Rosa is warm and practical. Dev is a helpful co-worker. Mr. Lin is a businesslike supplier. Quinn is a sly rival. Mo is a chatty regular. Avery is upbeat. Jas is a curious kid. Flag a line that sounds like someone else.
- Lines spoken by the player and the choice options sound like something a Grade 9 student would say. Options are clearly different. The right one isn't given away by tone unless that is the point.
- Canadian spelling (neighbour, colour, cheque), a small Alberta town, no talking down, nothing that would embarrass a student.
- No line repeated back to back. Two people don't say the same thing in one scene.

### Speech: easy to follow
- Many students read below grade level. Flag a box of more than about 25 words, or more than 3 sentences, or a word with an easy swap ("approximately" → "about").
- Business words (reputation, wholesale, perishable / goes stale, ledger, profit vs. cash, wages) are explained, or clear from what's around them, the first time.
- Each conversation ends with what to do next, and it matches the goal that follows.
- Hints and wrong-answer feedback say what to look at. "Try again." alone, in Real mode, is by design; only flag it if the box gives no way to find the mistake.
- In the order, plan and ledger boxes, the words say what the numbers mean.

### Quest flow and goals
- Every step sets a goal. The goal names a person or place the student has met or can see (a sign, a name already heard). The target matches the text: "Talk to Dev" points at Dev.
- No stuck states: no `stuck` or `timeout` events. Every play finishes. No console errors.
- Stop and resume gives the same result as the unbroken run.
- The very first boxes tell a new student who they are, why they're here and what to do first.
- The ending fits what happened: the goal reached or missed, the Quinn choice, the answer to Rosa's first question.
- Banners and toasts appear at the right moment, and don't contradict the goal.

## suggestions.md format
Newest first under one heading per area: `## Paths`, `## Speech`, `## Quest flow`. Each entry:

```
### S-007 · Confusing · Dev says "see you at lunch" but the café closes at 3
Status: open · first seen 2026-11-09 · last seen 2026-11-12 · seen 4× · where: d2_open, game.gd:257
Seen: DEV: "…see you at lunch!" (the top bar says 3:15 pm; the café closed at 3)
Why it matters: students may think there is another shift to plan.
Suggest: "See you tomorrow morning!"
```
(This entry is a made-up example of the format, not a finding.)
- Severity: **Blocks play** (stuck, can't reach, crash), **Confusing** (a student could misread or get lost), **Polish** (reads awkwardly, small).
- IDs: `P-` for paths, `S-` for speech, `Q-` for quest flow, numbered up from 001 within each prefix. Never reuse a number.
- The teacher answers in `dismissed.md` (`S-004: keep it, Quinn talks like that on purpose`). Never raise those again, even reworded.

## Report back
When run by hand: the run report's content in a few lines, most serious new findings first.
