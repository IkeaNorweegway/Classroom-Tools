# Python Introduction — Notes
STEAM · Grade 9 · Unit 1

**Name:** _________________________ **Date:** _____________

---

## Before We Start

*No notes, no right or wrong answers. Write your honest first thoughts.*

If you write a program and it runs — no red error text, no crash — does that mean it's correct? Write what you think. We'll come back to this.

_______________________________________________

_______________________________________________

You've coded in blocks or in simpler tools before. What do you expect to be different about typing real code in Python?

_______________________________________________

<!-- Teacher note: Do NOT correct at this stage. Students return to this page at the Unit Synthesis. -->

---

## Vocabulary

| Term | Definition in your own words | One example |
|---|---|---|
| Indentation | | |
| Variable | | |
| Conditional | | |
| Loop | | |
| Function | | |
| List | | |
| Syntax error | | |
| Runtime error (exception) | | |
| Logic error | | |
| Debug | | |

*Fill this in as each word comes up — not all at once before we start.*

---

## Concept 1: Python Uses Indentation to Show Structure

**I can:** recognize why indentation matters in Python, and use it correctly.

In Scratch, Spike Prime, or micro:bit blocks, one block physically snapped inside another to show it belonged there. Python has no blocks to snap and no curly braces like some other text languages — instead, **_____________** (spacing at the start of a line) is what shows Python which lines belong inside a loop, a conditional, or a function. Get the indentation wrong, and Python either won't run your program at all, or — worse — will run it with the wrong lines grouped together.

This is a **syntax requirement of the language**, not a new computational-thinking idea. You've already used sequence, loop, and conditional logic since Grade 5 — indentation doesn't change any of that logic, it's just how Python expects you to show it on the page.

**Check yourself (no peeking):**
1. What does indentation do in a Python program?

   _______________________________________________

2. Is indentation a new piece of computational thinking, or something else? What?

   _______________________________________________

---

## Concept 2: Variables, Loops, and Conditionals — Same Logic, New Syntax

**I can:** write a variable, a loop, and a conditional in correct Python syntax.

The logic itself isn't new. A **variable** still stores a value that can change — and in Python you don't have to declare what type of value it will hold before you use it. A **loop** (`for` or `while`) still repeats instructions instead of writing them out over and over. A **conditional** (`if` / `elif` / `else`) still branches — "if this is true, do this; otherwise, do that." What's different from a block language is just the notation: you type the keyword, end the line with a colon `:`, and indent the lines that belong inside.

> **Example:**
> ```
> moves_left = 9
> for row in range(3):
>     if board[row][0] == board[row][1] == board[row][2]:
>         print("Row", row, "is a win!")
> ```

**Check yourself (no peeking):**
1. Name one CT idea (sequence, loop, conditional, variable) that is exactly the same in Python as it was in a block language you've used. What's different about how you write it?

   _______________________________________________

---

## Concept 3: Functions — Reusable Named Blocks

**I can:** explain what a function is and why breaking a program into functions is useful.

A **function** (defined with `def`) is a named, reusable block of code that does one job — the same idea as a custom block you may have built before, now written as text. Instead of writing the same win-check logic three times in your game, you write it once as a function and *call* it whenever you need it. This also makes a program easier to read and to debug: if something's wrong with how a win is detected, you know exactly which function to look inside.

> **Example:**
> ```
> def check_win(board, player):
>     return board[0][0] == player and board[0][1] == player and board[0][2] == player
> ```

**Connection:** Think of a task in your game (checking for a win, printing the board, resetting the game) that happens more than once. Why would that be a good candidate for its own function?

_______________________________________________

**Check yourself (no peeking):**
1. What is a function, in your own words?

   _______________________________________________

2. Why does splitting a program into functions make debugging easier?

   _______________________________________________

---

## Concept 4: Three Kinds of Errors

**I can:** distinguish a syntax error, a runtime error, and a logic error, and know what debugging each one looks like.

Python surfaces problems in three different ways, and telling them apart matters:

- A **syntax error** means Python can't even understand what you typed — a missing colon, bad indentation, a typo in a keyword. Python catches this before running a single line, even though there's no separate compile step the way there is in some other languages.
- A **runtime error** (Python calls these **exceptions**) happens *while the program is running* — it starts fine, then crashes partway through (for example, trying to access an item in a list that doesn't exist).
- A **logic error** is the sneakiest: the program runs from start to finish without crashing — but it gives the **wrong answer**. A Tic-Tac-Toe that never detects a real win, or a Minesweeper that reveals the wrong tiles, is a logic error in action.

> **Example:**
> ```
> # Runs with no crash — but the logic is wrong:
> if board[0] == board[1]:
>     print("Player wins!")   # forgot to also check board[2]!
> ```

> **MISCONCEPTION:** "My program ran without crashing, so it must be correct."
>
> Why this fails: running without error only tells you the program didn't hit a syntax error or a runtime exception. It says nothing about whether the program actually does what it's supposed to. A Tic-Tac-Toe game that runs perfectly smoothly, lets both players play forever, and never once announces a winner has zero errors and is still completely broken.
>
> **Correct understanding:** "Runs without crashing" and "produces the correct result" are two separate questions. You have to specifically test for correctness — build test cases that check the actual output against what should happen — not just watch for red error text. This matters even more in Python than in some other languages, because Python won't catch a type mismatch or a structural mistake for you the way a stricter, compiled language would — more of the checking is on you.

**Check yourself (no peeking):**
1. Which of the three error types is caught before the program ever starts running?

   _______________________________________________

2. Give an example of a logic error that would NOT show up as a crash.

   _______________________________________________

---

## Unit Synthesis

*Complete from memory — notes closed.*

In one or two sentences each:

**Indentation:**

_______________________________________________

**Variables, loops, conditionals in Python:**

_______________________________________________

**Functions:**

_______________________________________________

**Syntax, runtime, and logic errors:**

_______________________________________________

---

Now open "Before We Start" and read what you wrote about whether a program that runs without error is automatically correct.

Was your first idea right? What would you tell your past self?

_______________________________________________

_______________________________________________
