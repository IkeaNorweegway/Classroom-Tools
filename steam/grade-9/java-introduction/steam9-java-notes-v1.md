# Java Introduction — Notes
STEAM · Grade 9 · Unit 1

**Name:** _________________________ **Date:** _____________

---

## Before We Start

*No notes, no right or wrong answers. Write your honest first thoughts.*

If you write a program and it runs — no red error text, no crash — does that mean it's correct? Write what you think. We'll come back to this.

_______________________________________________

_______________________________________________

You've coded in blocks or in simpler languages before. What do you expect to be different about typing real code in Java?

_______________________________________________

<!-- Teacher note: Do NOT correct at this stage. Students return to this page at the Unit Synthesis. -->

---

## Vocabulary

| Term | Definition in your own words | One example |
|---|---|---|
| Class | | |
| Main method | | |
| Variable | | |
| Conditional | | |
| Loop | | |
| Method | | |
| 2D array | | |
| Compile-time error | | |
| Runtime error | | |
| Logic error | | |
| Debug | | |

*Fill this in as each word comes up — not all at once before we start.*

---

## Concept 1: Every Java Program Needs a Class and a Main Method

**I can:** recognize the class-and-main-method structure every Java program needs, without needing to fully explain how it works yet.

In Scratch, Spike Prime, or micro:bit blocks, a program was just a stack of blocks — nothing to set up first. Java is different: before a single instruction can run, the whole program has to sit inside a **_____________**, and that class has to contain a **_____________ method** — the exact spot where the program starts running.

This is a **syntax requirement of the language**, not a new computational-thinking idea. You've already used sequence, loop, and conditional logic since Grade 5 — the class/main wrapper doesn't change any of that logic, it's just the box Java insists that logic lives inside. Accept it as required scaffolding for now. You don't need to fully unpack *why* Java is built this way to use it correctly.

**Check yourself (no peeking):**
1. What two things does every Java program need before any instruction can run?

   _______________________________________________

2. Is the class/main-method structure a new piece of computational thinking, or something else? What?

   _______________________________________________

---

## Concept 2: Variables, Loops, and Conditionals — Same Logic, New Syntax

**I can:** write a variable, a loop, and a conditional in correct Java syntax.

The logic itself isn't new. A **variable** still stores a value that can change. A **loop** (`for` or `while`) still repeats instructions instead of writing them out over and over. A **conditional** (`if` / `else if` / `else`) still branches — "if this is true, do this; otherwise, do that." What's new is that Java is strict about *how* you write these: variables need a declared type, lines end in a semicolon, and blocks of code are wrapped in curly braces `{ }`. Java's compiler checks this structure before your program ever runs.

> **Example:**
> ```
> int movesLeft = 9;
> for (int row = 0; row < 3; row++) {
>     if (board[row][0] == board[row][1] && board[row][1] == board[row][2]) {
>         System.out.println("Row " + row + " is a win!");
>     }
> }
> ```

**Check yourself (no peeking):**
1. Name one CT idea (sequence, loop, conditional, variable) that is exactly the same in Java as it was in a block language you've used. What's different about how you write it?

   _______________________________________________

---

## Concept 3: Methods — Java's Version of a Function

**I can:** explain what a method is and why breaking a program into methods is useful.

A **method** is a named, reusable block of code that does one job — Java's version of what you may have called a "function" or a custom block before. Instead of writing the same win-check logic three times in your game, you write it once as a method and *call* it whenever you need it. This also makes a program easier to read and to debug: if something's wrong with how a win is detected, you know exactly which method to look inside.

> **Example:**
> ```
> boolean checkWin(char[][] board, char player) {
>     return board[0][0] == player && board[0][1] == player && board[0][2] == player;
> }
> ```

**Connection:** Think of a task in your game (checking for a win, printing the board, resetting the game) that happens more than once. Why would that be a good candidate for its own method?

_______________________________________________

**Check yourself (no peeking):**
1. What is a method, in your own words?

   _______________________________________________

2. Why does splitting a program into methods make debugging easier?

   _______________________________________________

---

## Concept 4: Three Kinds of Errors

**I can:** distinguish a compile-time error, a runtime error, and a logic error, and know what debugging each one looks like.

Java surfaces problems in three different ways, and telling them apart matters:

- A **compile-time error** is caught by Java's compiler *before the program ever runs* — a missing semicolon, a missing brace, a type mismatch. You can't even start the program until this is fixed. Blocks and simpler languages you've used didn't really have this category — a block just wouldn't snap into place, or a simpler language would only fail once it actually ran.
- A **runtime error** happens *while the program is running* — it starts fine, then crashes partway through (for example, trying to access a cell in your 2D array that doesn't exist).
- A **logic error** is the sneakiest: the program compiles, runs, and finishes without crashing — but it gives the **wrong answer**. A Tic-Tac-Toe that never detects a real win, or a Minesweeper that reveals the wrong tiles, is a logic error in action.

> **Example:**
> ```
> // Compiles and runs with no crash — but the logic is wrong:
> if (board[0] == board[1]) {
>     System.out.println("Player wins!");   // forgot to also check board[2]!
> }
> ```

> **MISCONCEPTION:** "My program ran without crashing, so it must be correct."
>
> Why this fails: running without error only tells you the program didn't hit a compile-time or runtime error. It says nothing about whether the program actually does what it's supposed to. A Tic-Tac-Toe game that runs perfectly smoothly, lets both players play forever, and never once announces a winner has zero errors and is still completely broken.
>
> **Correct understanding:** "Runs without crashing" and "produces the correct result" are two separate questions. You have to specifically test for correctness — build test cases that check the actual output against what should happen — not just watch for red error text.

**Check yourself (no peeking):**
1. Which of the three error types is caught before the program ever runs?

   _______________________________________________

2. Give an example of a logic error that would NOT show up as a crash or a compiler warning.

   _______________________________________________

---

## Unit Synthesis

*Complete from memory — notes closed.*

In one or two sentences each:

**Class and main method:**

_______________________________________________

**Variables, loops, conditionals in Java:**

_______________________________________________

**Methods:**

_______________________________________________

**Compile-time, runtime, and logic errors:**

_______________________________________________

---

Now open "Before We Start" and read what you wrote about whether a program that runs without error is automatically correct.

Was your first idea right? What would you tell your past self?

_______________________________________________

_______________________________________________
