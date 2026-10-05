# Capstone: Spike Prime Challenge Maze — Notes
STEAM · Grade 8 · Unit 4

**Name:** _________________________ **Date:** _____________

**How to use this page:** Read each concept, then answer the Check Yourself questions without looking back. New vocabulary appears in 📌 boxes the first time it's used.

---

## Before We Start

*No notes, no right or wrong answers. Write your honest first thoughts.*

If you wrote instructions for a stranger to build something, do you think they'd understand exactly what you meant, or would you need to explain more than you expect? Write what you think — we'll come back to this.

_______________________________________________

_______________________________________________

Think back to Spike Prime work from last year. What's one sensor you remember using, and what did it actually measure?

_______________________________________________

<!-- Teacher note: Do NOT correct at this stage. Students return to this page at the Unit Synthesis. -->

---

## Vocabulary

| Term | Definition in your own words | One example |
|---|---|---|
| Sensor | | |
| Calibration | | |
| Specification (spec) | | |
| Ambiguity | | |
| Test-solve | | |
| Iteration | | |

---

## Concept 1: Sensors, Reviewed and Extended

**I can:** name at least three sensor types Spike Prime can use to solve a maze or obstacle challenge.

You used color and distance sensors on Spike Prime in Grade 7. This unit adds at least one more sensor type to your toolkit. Every sensor works the same underlying way: it reports a number or signal, and your program's conditionals decide what to do with it — the robot doesn't "see" the maze, it reacts to whatever a sensor reports.

> **Example:**
> ```
> if distance sensor < 5:
>     stop and turn right
> else:
>     drive forward
> ```

**Check yourself (no peeking):**
1. Name three sensor types you could use to solve a maze, and what each one actually measures.

   _______________________________________________

---

## Concept 2: Programming a Multi-Sensor Solution

**I can:** combine more than one sensor's readings into a working solution.

A maze or obstacle challenge usually needs more than one sensor working together — a distance sensor to avoid a wall while a color sensor tracks a line, for example. Combining sensors is more than just adding a second conditional; you have to decide what happens when both sensors are reporting something at the same time, and which one the program should trust first.

> **Example:**
> ```
> if distance sensor < 5:
>     stop and turn right
> else if color sensor = black:
>     stop driving
> else:
>     drive forward
> ```

**Check yourself (no peeking):**
1. Why might a maze solution need more than one sensor instead of just one?

   _______________________________________________

---

## Concept 3: Writing a Spec a Stranger Can Build From

**I can:** explain what makes a written specification "legible enough for a stranger to build against."

> 📌 **New word: specification (spec)**
> A written and diagrammed description of a challenge, precise enough that a group who has never seen it can build the physical maze and understand what a solving robot needs to do — without asking you anything.

This is the same standard first introduced in your Grade 6 capstone, now applied to a maze instead of a printed part: the person reading it doesn't have access to what's in your head, only what's on the page.

**Check yourself (no peeking):**
1. What makes a spec different from just a rough sketch or a verbal description?

   _______________________________________________

---

## Concept 4: The Ambiguity You Don't Notice You're Assuming

**I can:** identify implicit knowledge I assumed a stranger would already have.

> 📌 **New word: ambiguity**
> A place in your writing where more than one meaning is possible — clear to you, because you already know what you meant, but not necessarily clear to someone reading it cold.

> **MISCONCEPTION:** "I know exactly what I meant, so anyone reading my spec will understand it too."
>
> Why this fails: you already know your own maze — where the walls are, what the sensors will see, what "solved" looks like. A stranger reading your spec has none of that context; they only have the words and diagram in front of them. This is the same ambiguity misconception from the original Grade 6 capstone spec task, showing up again here because it's an easy trap to fall back into, even after you've seen it before.
>
> **Correct understanding:** The gap between "what I meant" and "what I actually wrote down" is usually bigger than the author expects — which is exactly why self-test-solving your own spec before handing it off catches the most obvious ambiguities, but not always all of them. Some ambiguity typically survives to the exchange; that's expected data to reflect on, not proof the design failed.

**Check yourself (no peeking):**
1. Why can't the author of a spec always see its own ambiguity?

   _______________________________________________

2. What step in this unit exists specifically to catch obvious ambiguity before a spec is handed off?

   _______________________________________________

---

## Unit Synthesis

*Complete from memory — notes closed.*

**Sensors:**

_______________________________________________

**Multi-sensor programming:**

_______________________________________________

**Writing a clear spec:**

_______________________________________________

**Ambiguity and implicit knowledge:**

_______________________________________________

---

Now open "Before We Start" and read what you wrote about whether a stranger would understand your instructions exactly as you meant them.

Was your first idea right? What would you tell your past self?

_______________________________________________

_______________________________________________
