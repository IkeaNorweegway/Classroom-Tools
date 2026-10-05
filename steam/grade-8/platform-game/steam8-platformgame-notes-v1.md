# Platform Game (Scratch) — Notes
STEAM · Grade 8 · Unit 2

**Name:** _________________________ **Date:** _____________

**How to use this page:** Read each concept, then answer the Check Yourself questions without looking back. New vocabulary appears in 📌 boxes the first time it's used.

---

## Before We Start

*No notes, no right or wrong answers. Write your honest first thoughts.*

Do you think a game gets more fun mainly by adding more stuff to it (more enemies, more effects, more levels), or by something else? Write what you think — we'll come back to this.

_______________________________________________

_______________________________________________

Think of a game you've played where the difficulty felt fair, and one where it felt unfair. What was actually different between them?

_______________________________________________

<!-- Teacher note: Do NOT correct at this stage. Students return to this page at the Unit Synthesis. -->

---

## Vocabulary

| Term | Definition in your own words | One example |
|---|---|---|
| Gravity variable | | |
| Collision detection | | |
| Game state | | |
| Win condition | | |
| Lose condition | | |
| Score/lives | | |
| Difficulty progression | | |
| Playtest | | |
| Iteration | | |

---

## Concept 1: Simulated Gravity

**I can:** explain how a continuously updated variable makes a sprite behave like it's falling.

Real gravity isn't in Scratch — you have to fake it.

> 📌 **New word: gravity variable**
> A number that keeps getting subtracted from (or added to) your sprite's vertical position, over and over, every frame, so the sprite appears to accelerate downward.

The sprite only stops falling because a collision check against a "ground" sprite tells it to stop — the falling doesn't stop on its own.

This is the same idea you've used before with variables tracking state (Grade 7), but now the variable is being updated *continuously*, forever, unless something else interrupts it — a more systems-like use of a variable than tracking a single score or a single choice.

> **Example:**
> ```
> when green flag clicked
> set [gravity] to -2
> forever
>     change y by (gravity)
>     if <touching [ground]?> then
>         set [gravity] to 0
> ```

**Check yourself (no peeking):**
1. What makes a sprite look like it's falling, specifically?

   _______________________________________________

2. What has to happen for the sprite to stop falling?

   _______________________________________________

---

## Concept 2: Collision Detection

**I can:** implement and debug a collision check between two sprites so it works consistently, not just sometimes.

> 📌 **New word: collision detection**
> Checking whether two sprites are touching, and responding when they are — landing on a platform, hitting an obstacle, collecting an item. A collision check that only works *most* of the time (a jump that sometimes doesn't register) is a bug to fix, not a quirk to accept — inconsistent collision handling is exactly the kind of thing a real playtester will find immediately.

> **Example:**
> ```
> forever
>     if <touching [spike]?> then
>         change [lives] by -1
>         go to x: (start x) y: (start y)
> ```

**Check yourself (no peeking):**
1. What are the two parts of "collision detection" — checking, and then what?

   _______________________________________________

2. If a jump sometimes doesn't register, is that acceptable in this unit's game? Why or why not?

   _______________________________________________

---

## Concept 3: Win, Lose, and Game State

**I can:** build a game with a defined win condition and a defined lose condition that the program actually tracks.

> 📌 **New word: game state**
> Everything the program is keeping track of behind the scenes right now — score, lives, whether the player has won or lost.

> 📌 **New word: win condition / lose condition**
> Specific, checkable rules ("score reaches 10" or "lives reach 0") — not a vague sense that the game is "over." Every platform game in this unit needs both, defined clearly enough that the program itself can detect them.

> **Example:**
> ```
> forever
>     if <score = 10> then
>         broadcast [you win]
>     if <lives = 0> then
>         broadcast [game over]
> ```

**Check yourself (no peeking):**
1. What's the difference between "game state" and a single variable like score?

   _______________________________________________

2. Write one possible win condition and one possible lose condition for a game you're imagining.

   _______________________________________________

---

## Concept 4: What Actually Makes a Game Better

**I can:** use playtest feedback to make a specific, justified fix instead of just adding more content.

> **MISCONCEPTION:** "My game will be better if I just add more enemies, more effects, more levels."
>
> Why this fails: more content doesn't fix a jump that doesn't register, or a difficulty spike that comes out of nowhere. A player who gets stuck on a broken collision on level 1 will never even see your extra content on level 3. Adding more is often *easier* than fixing what's actually broken, which is exactly why it's tempting — but it doesn't address the real problem.
>
> **Correct understanding:** A game improves through **deliberate difficulty pacing** (obstacles get harder in a planned order) and fixing what a real playtester actually reports as broken — not through volume.

> 📌 **New word: playtest**
> A structured test where a partner plays your level and reports specifically where they got stuck, where a collision felt wrong, and whether the difficulty felt fair. Tells you what to fix — guessing doesn't.

**Check yourself (no peeking):**
1. Why doesn't adding more enemies or effects fix a broken jump?

   _______________________________________________

2. What three things does a structured playtest ask a partner to report?

   _______________________________________________

---

## Unit Synthesis

*Complete from memory — notes closed.*

**Simulated gravity:**

_______________________________________________

**Collision detection:**

_______________________________________________

**Win/lose conditions and game state:**

_______________________________________________

**What actually makes a game better:**

_______________________________________________

---

Now open "Before We Start" and read what you wrote about whether more stuff makes a game more fun.

Was your first idea right? What would you tell your past self?

_______________________________________________

_______________________________________________
