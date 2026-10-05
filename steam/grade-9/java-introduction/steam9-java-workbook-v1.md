# Java Introduction — Design Journal
STEAM · Grade 9 · Unit 1

**Name:** _________________________ **Date:** _____________
**About this journal:** This isn't a test. It's where you plan your game's logic on paper, log what happens as you build and debug it, and record what a partner found when they played it.

---

## Part A: Define Your Game

**The brief:** Build a working, playable Java game — console-based at minimum — chosen from Tic-Tac-Toe, Minesweeper, or an equivalent small game of similar scope, with correct win/lose or end-state detection.

Which game are you building?

_______________________________________________

In your own words, what does this game need to correctly detect to count as "working" (a win, a loss, a revealed mine, etc.)?

_______________________________________________

What's one part of this game you expect to be the hardest to get right?

_______________________________________________

---

## Part B: Flowchart the Logic — Before You Write Any Code

*Draw a flowchart of your game's win-check (or reveal/flag) logic. Use boxes for steps and diamonds for decisions. Do this on paper before opening an editor.*

```









```

Walk through your own flowchart with a pencil, pretending to be the computer. Does it correctly handle a full board with no winner (a tie)? Trace it and write what happens:

_______________________________________________

---

## Part C: Tutorial Log

*As you work through the Java tutorials, log anything that trips you up — new syntax, an error message you didn't expect, an idea that finally clicked.*

*Example row shown below — yours starts on the next blank row.*

| Tutorial topic | What was new or confusing | How I sorted it out |
|---|---|---|
| 2D arrays | Kept mixing up `board[row][col]` order — swapped my indices without noticing | Traced through a 3x3 example on paper with each index labeled until the pattern clicked |
| | | |
| | | |
| | | |
| | | |

---

## Part D: Debug the Broken Program

*You'll be given a small program that doesn't work correctly. Find and fix the problem(s) before writing your own game from scratch.*

*Example row shown below — yours starts on the next blank row.*

| Problem found | Type of error (compile-time / runtime / logic) | How I found it | The fix |
|---|---|---|---|
| Program wouldn't compile — "missing semicolon" error on line 12 | Compile-time | Read the line number in the error message and checked the line above it, since Java often points to the line after the real problem | Added the missing semicolon at the end of the variable declaration |
| | | | |
| | | | |
| | | | |

What's one habit from this debugging exercise you plan to use while building your own game?

_______________________________________________

---

## Part E: Build & Test Log

*Log every attempt — including the ones that don't work. A build that crashes is data, not a failure.*

*Example row shown below — yours starts on the next blank row.*

| What I tried | What happened | What I'll change |
|---|---|---|
| Added the win-check method after finishing the board printout | Game compiled and ran, but calling `checkWin()` after every move never printed a winner even on an obvious 3-in-a-row | Print the board array inside `checkWin()` to see what values it's actually comparing, since the logic looks right on paper |
| | | |
| | | |
| | | |
| | | |

**Mid-project check-in:** Pause. Does your flowchart from Part B still match what your code actually does? If not, what changed, and was the flowchart wrong or was the code wrong?

_______________________________________________

---

## Part F: Test for Correctness, Not Just "It Runs"

Write down at least one specific test case that would catch a logic error in your game (not just a crash) — for example, a board state that should trigger a win.

Test case:

_______________________________________________

Result when you ran it:

_______________________________________________

---

## Part G: Partner Playtest

*A partner plays your finished game and reports any bug or confusing behavior — without you helping them.*

What bug or confusing behavior did your partner report?

_______________________________________________

What did you change as a result?

_______________________________________________

---

## Reflection

Where did you get stuck this unit, and what did you actually do about it (not just "I figured it out")?

_______________________________________________

Did your game work correctly because you understood the logic, or because you kept changing things until it stopped crashing? How do you know the difference?

_______________________________________________

Which of the three error types (compile-time, runtime, logic) gave you the most trouble this unit, and why do you think that one is harder to catch?

_______________________________________________

---

## Self-Assessment

| I can... | Got it | Getting there | Not yet |
|---|---|---|---|
| Write a Java program with variables, conditionals, loops, and at least one method, inside the required class/main structure | ☐ | ☐ | ☐ |
| Plan a program's logic on paper (flowchart) before writing code, and build code that matches the plan | ☐ | ☐ | ☐ |
| Tell apart a compile-time error, a runtime error, and a logic error, and debug each one | ☐ | ☐ | ☐ |
| Build a complete, working small program using tutorials plus my own extension, not just guided steps | ☐ | ☐ | ☐ |

One question I still have:

_______________________________________________
