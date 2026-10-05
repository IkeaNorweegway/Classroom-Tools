# REV Robotics (Intro) — Notes — Python-Path Version
STEAM · Grade 9 · Unit 2

**Name:** _________________________ **Date:** _____________

<!-- Teacher note: use THIS version if Python was chosen for Unit 1 instead of Java. Unlike the default version of this unit, this one treats the Java syntax as genuinely new — Unit 1's Python doesn't carry over word-for-word, only the underlying logic does. If Java was chosen for Unit 1, use `steam9-rev-notes-v1.md` instead, not this file. -->

---

## Before We Start

*No notes, no right or wrong answers. Write your honest first thoughts.*

REV DUO is real competition-grade robotics hardware — the same kind used in actual FTC competitions — and it's programmed in Java, a different language from the Python you used in Unit 1. Do you think that means starting over from scratch, or does some of what you learned in Unit 1 still count? Write what you think. We'll come back to this.

_______________________________________________

_______________________________________________

What do you already know how to do from Unit 1 (in Python) that you think might still be useful here, even in a different language?

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
| Syntax (vs. logic) | | |

*Fill this in as each word comes up — not all at once before we start.*

---

## Concept 1: What Changes, What Doesn't

**I can:** explain exactly what carries over from Unit 1's Python and what genuinely doesn't.

REV DUO is programmed through the **FTC SDK**, in **Java** — a different language from the Python you used in Unit 1. That's a real change, not a small one, and this unit doesn't pretend otherwise. But it isn't a fresh start either. Two different things are true at once:

- The **computational thinking underneath** — sequence, loop, conditional, variable, function — is **_____________** (the same / different) as what you already know. A loop is still a loop. A conditional is still "if this is true, do this."
- The **syntax** — how you write a loop, a conditional, a function — is **_____________** (the same / different), because Java has its own rules (type declarations, semicolons, curly braces, and a class/main-method structure every program needs).

> **Example:**
> ```
> // Unit 1 logic (Python): "if lives is 0 or less, end game"
> // This unit: same logic, new syntax
> if (lives <= 0) {
>     System.out.println("Game over");
> }
> ```

> **MISCONCEPTION:** "This is a different language, so everything I learned in Unit 1 is useless here — I'm basically starting over."
>
> Why this fails: the *logic* you built in Unit 1 — knowing what a loop is for, when to use a conditional, how to break a program into reusable pieces — is exactly the thinking you need here too. What you actually have to relearn is much narrower than "everything": it's the notation, plus a new set of hardware-specific objects (motors, sensors, servos) to call into.
>
> **Correct understanding:** Treat this unit as a *translation* exercise, not a *relearning* exercise. If you already know what you want a program to do (because you reasoned it out in Python-shaped thinking), the job here is finding the Java way to say it — not figuring out the idea from zero.

**Check yourself (no peeking):**
1. What stays the same between Unit 1 and this unit, even though the language changed?

   _______________________________________________

2. What's genuinely new here (there's more than one thing)?

   _______________________________________________

---

## Concept 2: A Quick Python-to-Java Translation Guide

**I can:** rewrite a simple piece of Python logic in Java syntax.

Here's the same four ideas, side by side, so you can see the logic hasn't moved even though the notation has:

| Idea | In Python (Unit 1) | In Java (this unit) |
|---|---|---|
| A variable | `lives = 3` | `int lives = 3;` |
| A conditional | `if lives <= 0:` (then indent) | `if (lives <= 0) {` (then a closing `}`) |
| A loop | `for i in range(5):` (then indent) | `for (int i = 0; i < 5; i++) {` (then a closing `}`) |
| A function/method | `def checkWin():` (then indent) | `void checkWin() {` (then a closing `}`) |

Notice what's different: Java wants you to declare a variable's **type** (`int`, meaning a whole number), end statements with a **semicolon**, and mark a block of code with **curly braces `{ }`** instead of indentation alone. Python never made you do any of that.

**Check yourself (no peeking):**
1. Pick one row from the table above. In your own words, what's the same about the idea, and what's different about how you write it?

   _______________________________________________

---

## Concept 3: The Hardware Map and Motor Objects

**I can:** explain what a hardware map is and how a motor object is used to move a robot.

Before your program can control anything, it needs a **hardware map** — a list that connects the names you use in code (like `leftMotor`) to the physical ports the hardware is actually plugged into on the Control Hub. Once a motor is mapped, you control it through a **motor object** — calling methods on it (like setting its power or direction) instead of writing raw electrical instructions yourself. This is new *hardware* vocabulary, on top of the new *language* syntax from Concept 2 — two separate things to learn, not one.

If Blockly-for-Java is used first, it can help separate these two challenges: it lets you see the shape of the new hardware API (what objects and methods exist) without also having to type correct Java syntax at the same time. Use it as a stepping stone, not a permanent home.

> **Example:**
> ```
> DcMotor leftMotor = hardwareMap.get(DcMotor.class, "leftMotor");
> leftMotor.setPower(0.75);
> ```

**Check yourself (no peeking):**
1. What job does the hardware map do?

   _______________________________________________

2. Name the two different things you're learning in this unit (hint: one is about a language, one is about hardware).

   _______________________________________________

---

## Concept 4: Servos and Sensors — Conditional Behavior on Real Hardware

**I can:** use at least one sensor to create a conditional behavior on REV hardware, written in Java.

A **servo object** moves to a specific position when told to — useful for something like an arm or a claw. A **sensor object** reports a value back into your program, exactly like the conditionals you already understand from Unit 1 (and from Dash, back in Grade 5): the sensor doesn't decide anything, it just reports a number, and a conditional you write decides what the robot does with that number. The *idea* is identical to a Python conditional checking a game variable — only the syntax you write it in has changed.

> **Example:**
> ```
> if (distanceSensor.getDistance(DistanceUnit.CM) < 10) {
>     leftMotor.setPower(0);
>     rightMotor.setPower(0);
> } else {
>     leftMotor.setPower(0.5);
> }
> ```

**Connection:** In Unit 1, you wrote a conditional using data your program already had (like a game board's state), in Python. Here, the "data" comes from a real sensor reading the physical world, and you write the check in Java. What do you think has to be true about how you write the conditional to account for a sensor reading being slightly noisy or imprecise, compared to a game board value that's always exact?

_______________________________________________

**Check yourself (no peeking):**
1. What's the difference between a servo object and a sensor object?

   _______________________________________________

2. Describe one conditional robot behavior you could build using a sensor on REV hardware, and say which part of writing it would rely on Unit 1 thinking versus this unit's new Java syntax.

   _______________________________________________

---

## Unit Synthesis

*Complete from memory — notes closed.*

In one or two sentences each:

**What's the same as Unit 1 (the logic):**

_______________________________________________

**What's new (the Java syntax):**

_______________________________________________

**What's new (the hardware API):**

_______________________________________________

**Sensors and conditional robot behavior:**

_______________________________________________

---

Now open "Before We Start" and read what you wrote about whether a different language means starting over.

Was your first idea right? What would you tell your past self?

_______________________________________________

_______________________________________________
