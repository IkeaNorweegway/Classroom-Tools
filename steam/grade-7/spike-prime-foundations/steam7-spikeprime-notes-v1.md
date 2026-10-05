# Spike Prime: Foundations & Computational Thinking — Notes
STEAM · Grade 7 · Unit 1

**Name:** _________________________ **Date:** _____________

**How to use this page:** Read each concept, then answer the Check Yourself questions without looking back. New vocabulary appears in 📌 boxes the first time it's used.

---

## Before We Start

*No notes, no right or wrong answers. Write your honest first thoughts.*

It's been a whole year since you programmed a robot (Grade 6 was littleBits, 3D printing, bridges, and gliders — no robot). Do you think you're starting from scratch with coding, or do you already know more than you think? Write what you think — we'll come back to this.

_______________________________________________

_______________________________________________

What's one thing you remember about sequence, loop, conditional, or variable from littleBits, Scratch, or Dash — from any grade, any tool?

_______________________________________________

<!-- Teacher note: Do NOT correct at this stage. Students return to this page at the Unit Synthesis. -->

---

## Vocabulary

| Term | Definition in your own words | One example |
|---|---|---|
| Sequence | | |
| Loop | | |
| Conditional | | |
| Variable | | |
| Transfer | | |
| Word Blocks | | |
| Debug | | |

*Fill this in as each word comes up — not all at once before we start.*

---

## Concept 1: Same Ideas, New Tool

**I can:** name a CT concept I already know, and recognize it again inside Spike Prime's Word Blocks.

You already know **sequence**, **loop**, and **conditional** — you used them in littleBits circuits, in Scratch, maybe in Dash back in Grade 5. This unit doesn't teach those ideas for the first time. It teaches you to recognize the *same idea* wearing a *different costume*.

Spike Prime's loop block is the same concept as littleBits' pulse bit and Scratch's repeat block — same idea, new tool. When you build a program in **Word Blocks**, don't ask "what is this new thing?" Ask "have I done this exact kind of thinking before, just somewhere else?"

> 📌 **New word: transfer**
> Carrying an idea you learned in one tool into a completely different tool. It's a stronger kind of learning than just repeating the same thing in the same tool, because it proves you understood the *idea*, not just the button.

> **Example:**
> ```
> Dash (Grade 5):    repeat 4 times: drive forward, turn
> Spike Prime (now): repeat 4 [ move forward ; turn right ]
> Same idea, new blocks — that's transfer.
> ```

**Check yourself (no peeking):**
1. Name one CT concept you're bringing into this unit from a non-robot tool, and name that tool.

   _______________________________________________

2. What does "transfer" mean, and why is it a stronger kind of learning than repeating something in the same tool?

   _______________________________________________

---

## Concept 2: Sequence & Loop in Spike Prime

**I can:** build a sequenced program for my driving base, then rebuild a repeating part of it as a loop.

A **sequence** is instructions carried out in order, one after another — Spike Prime does exactly what the blocks say, nothing more, nothing skipped. If part of your program repeats (drive forward, turn, drive forward, turn), a **loop** lets you say "do this ___ times" instead of stacking the same blocks over and over.

> **Example:**
> ```
> repeat 4 times:
>     drive forward
>     turn right
> ```
> Same result as stacking "drive forward, turn right" four times in a row — the loop just says it once.

**Common Misconception:** "I'm basically starting over — I don't really know robots yet."

**Why this fails:** You're not starting over on the *thinking*. Sequence, loop, and conditional are concepts, not robot-specific skills — you already used every one of them in a non-robot tool. What's actually new here is the *modality*: applying ideas you already know to a build-and-code platform for the first time in a year. That's a real gap (the build side), but it isn't the same as not knowing the concepts.

**What's actually true:** Say it out loud each time it comes up: "this is the same idea as ___, just in a new tool." The robot is new. The thinking underneath it is not.

**Check yourself (no peeking):**
1. What's the difference between a sequence and a loop, in your own words?

   _______________________________________________

2. Why is it inaccurate to say you're "starting over" this unit, even though you haven't touched a robot in a year?

   _______________________________________________

---

## Concept 3: Conditionals — Responding to a Sensor

**I can:** explain what a conditional does with a sensor reading, and use one to make my robot respond to its environment.

A **conditional** tells Spike Prime: "if ___ is true, then do ___ — otherwise, do something else." The robot isn't deciding anything on its own — a sensor (color or distance) reports a number, and a conditional block a person wrote decides what the robot does with that number.

This is the same relationship you saw with Dash's distance sensor in Grade 5, or a littleBits sensor bit triggering an actuator in Grade 6 — sensor reports, conditional decides, robot acts. Unit 2 this year goes much deeper into sensors with micro:bit; this is your first taste on Spike Prime.

> **Example:**
> ```
> if distance sensor < 10:
>     stop and beep
> else:
>     keep driving
> ```

**Check yourself (no peeking):**
1. In your own words, what job does the sensor do, and what job does the conditional do? Why are they two separate jobs?

   _______________________________________________

2. If your robot's conditional isn't working the way you expect, is the sensor more likely broken, or is the conditional more likely written wrong? How would you check?

   _______________________________________________

---

## Concept 4: Variables — Controlling and Predicting Behavior

**I can:** use a variable to control speed or distance, and predict what will happen before I test it.

A **variable** is a labeled value your program can store and reuse — instead of typing "speed: 30" into five different blocks, you set a variable called `speed` once, and every block that uses it follows along. Change the variable, and every block using it changes too.

> **Example:**
> ```
> set speed to 30
> drive forward using speed
> ...
> set speed to 60
> drive forward using speed   (same block, now faster)
> ```

**Predict, then test:** Before you change your robot's speed variable, write down what you predict will happen to how it drives.

_______________________________________________

What actually happened?

_______________________________________________

**Check yourself (no peeking):**
1. Why is using a variable better than typing the same number into several separate blocks?

   _______________________________________________

2. Name one robot behavior (besides speed) that a variable could control.

   _______________________________________________

---

## Unit Synthesis

*Complete from memory — notes closed.*

In one or two sentences each:

**Transfer (why this isn't "starting over"):**

_______________________________________________

**Sequence and loop in Spike Prime:**

_______________________________________________

**Conditional and sensor:**

_______________________________________________

**Variable:**

_______________________________________________

---

Now open "Before We Start" and read what you wrote about whether you're starting from scratch.

Was your first idea right? What would you tell your past self?

_______________________________________________

_______________________________________________
