# REV Robotics (Intro) — Notes
STEAM · Grade 9 · Unit 2

**Name:** _________________________ **Date:** _____________

<!-- Teacher note: this file assumes Java was chosen for Unit 1 (the "same language" framing throughout). If Python was chosen for Unit 1 instead, use `steam9-rev-notes-python-path-v1.md` in this same folder — it treats the Java syntax as genuinely new and includes a Python-to-Java translation guide. -->

---

## Before We Start

*No notes, no right or wrong answers. Write your honest first thoughts.*

REV DUO is real competition-grade robotics hardware — the same kind used in actual FTC competitions. Do you think working with hardware like this means learning a whole new programming language? Write what you think. We'll come back to this.

_______________________________________________

_______________________________________________

What do you already know how to do in Java from Unit 1 that you think might carry over here?

_______________________________________________

<!-- Teacher note: Do NOT correct at this stage. Students return to this page at the Unit Synthesis. -->

---

## Vocabulary

| Term | Definition in your own words | One example |
|---|---|---|
| FTC SDK | | |
| Hardware map | | |
| Motor object | | |
| Servo object | | |
| Sensor object | | |
| Control Hub | | |
| Driver Hub | | |
| Blockly-for-Java | | |

*Fill this in as each word comes up — not all at once before we start.*

---

## Concept 1: Same Language, New Hardware

**I can:** explain what's actually new about this unit and what's carrying over unchanged from Unit 1.

REV DUO is genuine competition-grade FTC hardware — a Control Hub and Driver Hub, real motors and motor controllers, real servos. That can make it *feel* like a completely new subject. It isn't. You program REV DUO through the **FTC SDK**, in the exact same language you already used in Unit 1: **_____________**. The computational thinking underneath — sequence, loop, conditional — hasn't changed either.

What *is* new is the **_____________ API**: a specific set of objects and methods for talking to physical hardware — a motor object you tell to spin, a sensor object you read a value from, a servo object you tell to move to a position.

> **Example:**
> ```
> // Same loop syntax as Unit 1 — new hardware API call inside it:
> for (int i = 0; i < 4; i++) {
>     leftMotor.setPower(0.5);   // NEW: a hardware object method, not board logic
> }
> ```

> **MISCONCEPTION:** "Competition-grade robotics hardware must need a completely different language, or completely different logic, than what I already know."
>
> Why this fails: the language is unchanged — it's still Java — and the CT logic (sequence, loop, conditional) hasn't changed either. What changed is the vocabulary of objects available to call into: a hardware map, a motor object, a servo object, a sensor object. Assuming everything is new means re-learning things you've already mastered instead of noticing what's genuinely different.
>
> **Correct understanding:** This unit is Unit 1's Java applied to a new hardware API, not a fresh start. If you can write a loop and a conditional, you can write one that controls a REV motor — you just need to learn what the motor object is called and what methods it has.

**Check yourself (no peeking):**
1. What stays exactly the same between Unit 1 and this unit?

   _______________________________________________

2. What's actually new in this unit?

   _______________________________________________

---

## Concept 2: The Hardware Map and Motor Objects

**I can:** explain what a hardware map is and how a motor object is used to move a robot.

Before your program can control anything, it needs a **hardware map** — a list that connects the names you use in code (like `leftMotor`) to the physical ports the hardware is actually plugged into on the Control Hub. Once a motor is mapped, you control it through a **motor object** — calling methods on it (like setting its power or direction) instead of writing raw electrical instructions yourself.

If Blockly-for-Java is used first, treat it the same way you'd treat training wheels: it's showing you the *shape* of the new hardware API (what objects and methods exist) so you can recognize them faster once you move to typed Java — it isn't asking you to think about logic differently than you did in Unit 1.

> **Example:**
> ```
> DcMotor leftMotor = hardwareMap.get(DcMotor.class, "leftMotor");
> leftMotor.setPower(0.75);
> ```

**Check yourself (no peeking):**
1. What job does the hardware map do?

   _______________________________________________

---

## Concept 3: Servos and Sensors — Conditional Behavior on Real Hardware

**I can:** use at least one sensor to create a conditional behavior on REV hardware.

A **servo object** moves to a specific position when told to — useful for something like an arm or a claw. A **sensor object** reports a value back into your program, exactly like the conditionals you already understand from Unit 1 (and from Dash, back in Grade 5): the sensor doesn't decide anything, it just reports a number, and a conditional you write decides what the robot does with that number.

> **Example:**
> ```
> if (distanceSensor.getDistance(DistanceUnit.CM) < 10) {
>     leftMotor.setPower(0);
>     rightMotor.setPower(0);
> } else {
>     leftMotor.setPower(0.5);
> }
> ```

**Connection:** In Unit 1, you wrote a conditional using data your program already had (like a game board's state). Here, the "data" comes from a real sensor reading the physical world instead. What do you think has to be true about how you write the conditional to account for a sensor reading being slightly noisy or imprecise, compared to a game board value that's always exact?

_______________________________________________

**Check yourself (no peeking):**
1. What's the difference between a servo object and a sensor object?

   _______________________________________________

2. Describe one conditional robot behavior you could build using a sensor on REV hardware.

   _______________________________________________

---

## Unit Synthesis

*Complete from memory — notes closed.*

In one or two sentences each:

**What's the same as Unit 1:**

_______________________________________________

**What's new in this unit (the hardware API):**

_______________________________________________

**Hardware map and motor objects:**

_______________________________________________

**Sensors and conditional robot behavior:**

_______________________________________________

---

Now open "Before We Start" and read what you wrote about whether competition-grade hardware needs a whole new language.

Was your first idea right? What would you tell your past self?

_______________________________________________

_______________________________________________
