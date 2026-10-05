# Choose Your Own Adventure — Notes
STEAM · Grade 7 · Unit 3

**Name:** _________________________ **Date:** _____________

**How to use this page:** Read each concept, then answer the Check Yourself questions without looking back. New vocabulary appears in 📌 boxes the first time it's used.

---

## Before We Start

*No notes, no right or wrong answers. Write your honest first thoughts.*

Have you ever played a choose-your-own-adventure book or game where you picked differently, but ended up somewhere that felt basically the same anyway? What happened?

_______________________________________________

_______________________________________________

Do you think "more choices" automatically makes a story or game better? Write what you think — we'll come back to this.

_______________________________________________

<!-- Teacher note: Do NOT correct at this stage. Students return to this page at the Unit Synthesis. -->

---

## Vocabulary

| Term | Definition in your own words | One example |
|---|---|---|
| Branch | | |
| Branching structure | | |
| State | | |
| Variable (as memory) | | |
| Flowchart | | |
| Dead end | | |
| Playtest | | |

*Fill this in as each word comes up — not all at once before we start.*

---

## Concept 1: Branching — More Than One Path

**I can:** explain what a branch is, and why a CYOA needs more than one.

Back in Grade 5's Scratch capstone, your story needed *one* branch point — a single moment where the story split. In this unit, branching isn't a single moment. It's the whole structure.

> 📌 **New word: branch**
> A moment where a choice splits the story into more than one possible path.

Every choice point creates a branch, and branches can lead to more branches, building a tree of possible paths.

> 📌 **New word: branching structure**
> The whole tree of branches and paths in your story — not just one split.

This makes planning much harder than a single-branch story: you can't just "figure it out as you build." A structure this complex needs to be mapped *before* you open Scratch — which is exactly what your flowchart step is for.

> 📌 **New word: flowchart**
> A diagram, drawn on paper, that maps every path and choice before you write any code.

> **Example:**
> ```
> when this choice is clicked
> if <picked "help the stranger"> then
>     go to scene [Ally Found]
> else
>     go to scene [Alone in the Woods]
> ```

**Check yourself (no peeking):**
1. How is this unit's branching different from the single branch point in a Grade 5 Scratch story?

   _______________________________________________

2. Why does a complex branching structure need to be planned on paper before coding, more than a simple sequence would?

   _______________________________________________

---

## Concept 2: Variables as Memory — Tracking State

**I can:** explain how a variable can remember a choice and affect a later scene, not just track a number.

You've used variables before to store a number — a robot's speed, a score. This unit gives a variable a new job: tracking state.

> 📌 **New word: state**
> A variable that remembers a choice a player made earlier, so that choice can affect a *later*, separate scene.

For example: a variable called `trust` might start at 0. If a player chooses to help a character early on, `trust` becomes 1. Ten scenes later, a conditional checks `trust` — and the character reacts differently depending on what happened earlier, without the player needing to see the variable at all.

> **Example:**
> ```
> when green flag clicked
> set [trust] to 0
> ...
> if <trust = 1> then
>     say "I remember what you did."
> ```

**Connection:** Think of a video game or show where an earlier decision clearly changed something much later. What do you think was "remembered" behind the scenes to make that happen?

_______________________________________________

**Check yourself (no peeking):**
1. What's the difference between using a variable to store a robot's speed and using a variable to track state in a CYOA?

   _______________________________________________

2. Why does the variable need to be checked later by a conditional for the "memory" to actually matter to the player?

   _______________________________________________

---

## Concept 3: Real Choices vs. Choices That Don't Matter

**I can:** explain why a branch that leads to the same outcome as another branch isn't a real choice.

**Common Misconception:** "More branches automatically makes my CYOA better."

**Why this fails:** A story can have ten branch points where every single one leads to the same ending. That's more choices *on paper* — but nothing the player does actually changes anything. A player who plays through twice, choosing differently each time, and ends up in the same place both times will feel like their choices didn't matter, even if the flowchart looks impressively complex.

**What's actually true:** A choice only counts as real if it leads somewhere genuinely different — a different scene, a different ending, or (through a state variable) a different reaction much later. This unit requires at least one earlier choice to affect a later outcome, specifically to force this to be true.

> 📌 **New word: playtest**
> Having someone else play through your story, so you can find out whether it actually works the way you planned.

The playtest step exists to catch it if a branch turns out not to matter.

**Check yourself (no peeking):**
1. What makes a branch a "real" choice instead of just an illusion of choice?

   _______________________________________________

2. How would a playtester notice if your branches don't actually matter?

   _______________________________________________

---

## Concept 4: The Structural Constraint — No Dead Ends, No Infinite Loops

**I can:** explain this unit's constraint and why it's a different kind of constraint than a budget or material limit.

Every earlier unit's constraint has been about materials or a target number — a budget, a time limit, a temperature range. This unit's constraint is different: it's a rule about the *structure itself*.

> 📌 **New word: dead end**
> A path that stops with nothing happening — no ending, no next choice. Every path in your story must avoid this.

Every path must reach a real, distinct ending. No path can dead-end, and no path can loop forever with no way out.

**Check yourself (no peeking):**
1. Why is "no dead ends, no infinite loops" a structural constraint rather than a materials or budget constraint?

   _______________________________________________

2. If you tested a path and it looped back to the same scene forever, what would you need to change?

   _______________________________________________

---

## Unit Synthesis

*Complete from memory — notes closed.*

In one or two sentences each:

**Branching structure (this unit vs. Grade 5's single branch):**

_______________________________________________

**Variables as memory / state:**

_______________________________________________

**Real choices vs. choices that don't matter:**

_______________________________________________

**The structural constraint (no dead ends, no infinite loops):**

_______________________________________________

---

Now open "Before We Start" and read what you wrote about whether more choices automatically makes a story better.

Was your first idea right? What would you tell your past self?

_______________________________________________

_______________________________________________
