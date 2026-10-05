# Dash Bot: Algorithms & Sensors — Notes
STEAM · Grade 5 · Unit 1

**Name:** _________________________ **Date:** _____________

**How to use this page:** Read one part at a time. Answer in your own words. When you see a 📌 box, that's a new word — read it before you keep going.

---

## Before We Start

*There are no wrong answers here. Just write what you really think.*

1. Have you ever told someone exactly what to do, and they did exactly that — even though it wasn't what you meant? What happened?

_______________________________________________

2. Do you think Dash "knows" what to do? Or is something else making it move? Write your guess. We'll check later.

_______________________________________________

<!-- Teacher note: Do NOT correct at this stage. Students return to this page at the Unit Wrap-Up. -->

---

## New Words in This Unit

Fill this in as you meet each word. Use your own words.

| Word | What it means (in your own words) | My example |
|---|---|---|
| Sequence | | |
| Loop | | |
| Conditional | | |
| Sensor | | |
| Input | | |
| Output | | |
| Debug | | |

---

## Part 1: Sequence & Loop

**Goal:** Put steps in order. Use a loop instead of repeating the same blocks.

Dash follows instructions one at a time, in the order you place them. It does exactly what the blocks say — nothing more, nothing less.

> 📌 **New word: sequence**
> A list of steps done in order. Step 1, then step 2, then step 3.

Sometimes a pattern repeats, like: turn, drive, turn, drive, turn, drive. Instead of stacking the same blocks over and over, you can use a loop.

> 📌 **New word: loop**
> A block that says "do this ___ times." It does the same job with fewer blocks.

> **Example:**
> ```
> drive forward
> turn right
> drive forward
> turn right
> drive forward
> turn right
> ```
> Written as a loop instead:
> ```
> repeat 3 times:
>     drive forward
>     turn right
> ```

**Check yourself** (don't look back at the page):
1. What's the difference between a sequence and a loop?

   _______________________________________________

2. Why would you use a loop instead of repeating blocks?

   _______________________________________________

---

## Part 2: Conditionals — "If This, Then That"

**Goal:** Explain what a conditional is doing in a program.

> 📌 **New word: conditional**
> A block that says: "IF something is true, THEN do this. If not, do something else."

Dash doesn't decide anything on its own. A person wrote the conditional. That person decided what counts as "true" and what Dash should do about it.

> **Example:**
> ```
> if distance sensor < 10 cm:
>     stop and beep
> else:
>     keep driving
> ```

**Common mistake:** "Dash sees the wall, so it decides to turn."

**Why that's wrong:** Dash doesn't know a wall is there. A sensor sends a number to the program. A conditional block — written by a person — decides what to do with that number. Change the conditional, and Dash reacts differently to the same wall.

**What's actually true:** Dash turns because someone wrote a block that says "if the distance sensor reads less than ___, turn." Everything Dash does comes from an instruction someone wrote.

**Check yourself:**
1. In your own words, what does a conditional do?

   _______________________________________________

2. You want Dash to make a sound only when something is very close. What do you need to change in the conditional?

   _______________________________________________

---

## Part 3: Sensors — Input and Output

**Goal:** Explain how Dash's sensor leads to a decision. Predict what it will detect.

> 📌 **New word: input**
> Information going INTO the program. Example: a sensor reading, a button press, a sound.

> 📌 **New word: output**
> Something the program sends OUT. Example: Dash moving, a light, a sound.

> 📌 **New word: sensor**
> A part that reports a number or signal. It does not decide anything by itself.

What Dash does with a sensor's number is decided by the conditional blocks in the program — same idea as Part 2, now using something Dash can actually detect.

**Think about it:** Has a machine ever seemed to "notice" you — like an automatic door or a motion light? What sensor and what conditional do you think are really doing that job?

_______________________________________________

**Check yourself:**
1. Name one input and one output in a Dash program you built.

   _______________________________________________

2. Dash's distance sensor is aimed too high to catch a short obstacle. What will happen when Dash gets close to it? Why?

   _______________________________________________

---

## Part 4: micro:bit — First Look

**Goal:** Use micro:bit's button (input) and LED display (output) on your own.

micro:bit is a different device than Dash. It uses the same ideas:

- Pressing the button = an **input**
- The LEDs lighting up = an **output**

We'll come back to micro:bit in Grade 6.

**Check yourself:**
1. On micro:bit, is pressing the button an input or an output? What about the LEDs lighting up?

   _______________________________________________

---

## Unit Wrap-Up

*Close this page. Answer from memory.*

**Sequence and loop:**

_______________________________________________

**Conditional:**

_______________________________________________

**Sensor, input, output:**

_______________________________________________

---

Now go back to "Before We Start." Read what you wrote about whether Dash "knows" what to do.

Were you right? What would you tell your past self about how Dash really works?

_______________________________________________

_______________________________________________
