---
title: Linear Relations
topic: linear-relations
strand: algebra
---
<!-- Gate: progressive blanking confirmed. Refutation-first on: "adding 2 each time means y = x + 2" (LR2), "connect the dots on every graph" (LR3).
     Section order: pattern → table (LR1) → equation and ordered pairs (LR2) → graph (LR3) → reading a relation in words (LR4).
     Every relation appears in at least three of: picture, table, equation, graph, words (Rule of Four).
     Codes LR1–LR4. Outcome PR1. -->

## Pre-Knowledge Check
1. Draw the next figure: □ □□ □□□
2. What does the point (3, 5) mean on a grid?
3. A taxi costs $4 plus $2 for every kilometre. What does a 3 km ride cost?

## Section 1: Patterns to tables
Learning target: I can turn a growing pattern into a table of values and describe how it grows.

### Vocabulary
- pattern :: something that grows or repeats in a predictable way :: 4, 6, 8, 10, …
- term number (figure number) :: the position in the pattern :: Figure 3 is term number 3
- table of values :: a table that shows two quantities that go together :: figure number and number of seats
- relation :: a rule that connects two quantities :: seats = 2 × tables + 2

For a school banquet, square tables are pushed together in a row. Each table has 1 seat on each side. There is 1 seat at each end.

@viz pattern start=2 add=2 figures=4 last="?" note="grey = the 2 end seats · blue = 2 seats for each table" caption="Figure n has 2 end seats plus 2 seats for each table."

| Number of tables (n) | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Number of seats (s) | 4 | 6 | [[8]] | [[10]] | [[12]] |

The number of seats goes up by [[2]] each time. With 0 tables, there would be [[2]] seats (just the ends).

::: key Describe the pattern in words
"It **starts at** ___ and **goes up by** ___ each time."
Seats: it starts at [[2]] (for 0 tables) and goes up by [[2]] for each table.
:::

::: example Worked Example 1 — Another pattern
@viz pattern start=1 add=3 figures=3
| Figure (n) | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Tiles (t) | 4 | 7 | [[10]] | [[13]] |
It goes up by [[3]] each time. Figure 0 would have [[1]] tile.
:::

::: explain
How can you find "Figure 0" when there is no picture of it?
(lines 2)
=> Go backwards in the table: subtract the amount it goes up by. 4 − 3 = 1.
:::

::: try
@viz pattern start=3 add=1 figures=3
a) Fill in the table.
| Figure (n) | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Squares (s) | [[4]] | [[5]] | [[6]] | [[7]] | [[8]] |
b) Describe the pattern in words: [[starts at 3 and goes up by 1]]
:::

::: retrieval
1. A pattern goes 5, 9, 13, 17. How much does it go up by each time?
=> 4
2. What would "Figure 0" be for 5, 9, 13, 17?
=> 1
3. Make a table for 1 to 4 tables of banquet seats.
=> 4, 6, 8, 10
4. A pattern starts at 10 and goes down by 2 each time. Write the first four terms.
=> 10, 8, 6, 4 (or 8, 6, 4, 2 if 10 is figure 0)
5. ★ Stretch: How many seats would 20 tables have? Explain without listing all 20.
=> 2 seats per table × 20 = 40, plus 2 end seats = 42.
:::

## Section 2: Equations and ordered pairs
Learning target: I can write an equation for a pattern and find a missing value in an ordered pair.

### Vocabulary
- variable :: a letter that stands for a number that can change :: n, s, x, y
- equation :: a math sentence with an equal sign :: s = 2n + 2
- ordered pair :: two numbers in brackets (x, y) that go together :: (3, 8) means 3 tables, 8 seats
- substitute :: put a number in place of a letter :: n = 5 → s = 2(5) + 2 = 12

The banquet table pattern: **go up by 2** means **multiply n by 2**. **Start at 2** means **add 2**.

::: key From table to equation
s = [[2]]n + [[2]]
"Go up by" → the number in front of n. "Starts at" (figure 0) → the number added.
:::

::: misconception
WRONG: "It goes up by 2, so the equation is s = n + 2."
WHY: Test it. n = 3 gives 3 + 2 = 5. The table says 8 seats.
RIGHT: Going up by 2 for every table means 2 × n. s = 2n + 2. Check: 2(3) + 2 = 8 ✓
:::

::: example Worked Example 2 — Check an equation with the table
Tiles pattern: 4, 7, 10, 13. Equation: t = 3n + 1
n = 1: 3(1) + 1 = [[4]] ✓
n = 4: 3(4) + 1 = [[13]] ✓
:::

::: explain
Why do we test the equation with more than one row of the table?
(lines 2)
=> An equation that works for one row might be wrong for others. Checking two rows catches mistakes.
:::

::: example Worked Example 3 — A taxi in Calgary
A taxi costs $4 to start, plus $2 for every km. Equation: c = 2k + 4
Find the missing value in each ordered pair (k, c).
(5, ?): c = 2(5) + 4 = [[14]] → (5, [[14]])
(?, 20): 20 = 2k + 4 → 2k = 16 → k = [[8]] → ([[8]], 20)
@viz flow steps="k km|× 2|+ 4|c dollars"
:::

::: explain
In (?, 20), why did we work backwards?
(lines 2)
=> We knew the cost, not the distance. Undo + 4, then undo × 2 to find k.
:::

::: try
a) y = 3x − 1. Make a table for x = 0, 1, 2, 3.
| x | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| y | [[−1]] | [[2]] | [[5]] | [[8]] |
b) For y = 3x − 1, find the missing value: (6, [[17]]) and ([[4]], 11)
c) Write an equation for the pattern 5, 8, 11, 14, … (Figure 1 is 5.) [[t = 3n + 2]]
:::

::: retrieval
1. Write an equation for the table: x 1 2 3 4, y 7 9 11 13.
=> y = 2x + 5
2. Ella wrote y = x + 2 for the table x 1 2 3, y 3 5 7. Check her equation. Is she right?
=> No. x = 2 gives 4, not 5. The right equation is y = 2x + 1.
3. For c = 2k + 4, find c when k = 12.
=> 28
4. For y = 5x + 3, which ordered pair is on the relation: (2, 13) or (3, 13)?
=> (2, 13): 5(2) + 3 = 13
5. ★ Stretch: A pattern goes down by 4 each time: 20, 16, 12, 8 (Figure 1 is 20). Write an equation.
=> t = −4n + 24 (or t = 24 − 4n)
:::

## Section 3: Graphing a relation
Learning target: I can graph a relation from a table or an equation.

### Vocabulary
- x-axis :: the line across the bottom of a graph :: shows the number of tables
- y-axis :: the line up the side :: shows the number of seats
- discrete data :: data you can count; only whole-number points make sense :: tables, tickets, people
- linear :: the points lie on a straight line :: s = 2n + 2

Each column of the table becomes an ordered pair. Plot each one.

| Tables (n) | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Seats (s) | 4 | 6 | 8 | 10 | 12 |

@viz coord xmin=0 xmax=6 ymin=0 ymax=14 ystep=2 xlabel="tables" ylabel="seats" points="1,4;2,6;3,8;4,10;5,12" caption="Banquet seats. The points line up: the relation is linear."

The points make a [[straight line]], so the relation is [[linear]].

::: misconception
WRONG: "Always connect the dots with a line."
WHY: You cannot have 2½ tables. A line would show seats for 2½ tables, which does not make sense.
RIGHT: For things you count (tables, tickets, people), plot dots only. This is called discrete data.
:::

::: example Worked Example 4 — Graph from an equation
Graph y = 3x − 1 for x = 0 to 4.
Step 1: Make a table. y values: −1, 2, 5, [[8]], [[11]]
Step 2: Plot (0, −1), (1, 2), (2, 5), (3, 8), (4, 11).
@viz coord xmin=0 xmax=5 ymin=-2 ymax=12 ystep=1 yevery=2 points="0,-1;1,2;2,5" keypoints="3,8;4,11"
Step 3: Check that the points line up.
:::

::: explain
Why make a table before you graph?
(lines 2)
=> The table gives the ordered pairs. Each pair is one point to plot.
:::

::: try
Graph c = 2k + 4 (the taxi) for k = 0 to 5 km. Should you connect the points? Why?
@viz coord xmin=0 xmax=6 ymin=0 ymax=16 ystep=2 xlabel="km" ylabel="cost ($)" keypoints="0,4;1,6;2,8;3,10;4,12;5,14"
(lines 2)
=> Points: (0, 4), (1, 6), (2, 8), (3, 10), (4, 12), (5, 14). You may connect them, because a taxi can drive part of a kilometre (in this unit, either answer with a good reason is fine).
:::

::: retrieval
1. Write the ordered pairs from the table: x 0 1 2, y 3 5 7.
=> (0, 3), (1, 5), (2, 7)
2. Do the points (1, 2), (2, 4), (3, 7) make a linear relation? How do you know?
=> No. From 2 to 4 is +2 but from 4 to 7 is +3, so they don't line up.
3. You graph the number of tickets sold and the money raised. Should you connect the dots?
=> No. You can't sell part of a ticket. Plot dots only.
4. On a graph of s = 2n + 2, what point is on the y-axis?
=> (0, 2)
5. ★ Stretch: Two patterns: A is y = 2x + 1 and B is y = 3x + 1. Which graph is steeper? Why?
=> B, because y goes up by 3 for each step instead of 2.
:::

## Section 4: Reading a relation
Learning target: I can describe a relation from its graph, and use it to predict.

### Vocabulary
- increasing :: the y-values go up as x goes up :: the more tables, the more seats
- decreasing :: the y-values go down as x goes up :: a candle gets shorter as it burns
- rate of change :: how much y changes when x goes up by 1 :: +2 seats per table
- starting value :: the y-value when x = 0 :: 2 seats

A 20 cm candle burns 2 cm every hour.

@viz coord xmin=0 xmax=10 ymin=0 ymax=22 ystep=2 yevery=4 xlabel="hours" ylabel="height (cm)" points="0,20;1,18;2,16;3,14;4,12;5,10;6,8;7,6;8,4;9,2;10,0" line=1 caption="The candle gets 2 cm shorter every hour."

::: key Describe a graph in words
The graph is [[decreasing]].
It starts at [[20]] cm.
It goes down by [[2]] cm every hour.
It reaches 0 after [[10]] hours.
Equation: h = 20 − 2t
:::

::: example Worked Example 5 — Compare two relations
Two phone plans:
Plan A: $20 a month plus $5 for each GB of data. c = 5g + 20
Plan B: $10 a month for each GB of data. c = 10g
| GB (g) | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Plan A | 20 | 25 | 30 | [[35]] | [[40]] | [[45]] |
| Plan B | 0 | 10 | 20 | [[30]] | [[40]] | [[50]] |
@viz coord xmin=0 xmax=6 ymin=0 ymax=60 ystep=10 xlabel="GB" ylabel="cost ($)" points="0,20:A;1,25;2,30;3,35;4,40;5,45" caption="Plan A (plotted). Plot Plan B on the same grid."
They cost the same at [[4]] GB. For more than 4 GB, Plan [[A]] is cheaper.
:::

::: explain
Why is Plan B cheaper for small amounts of data, but Plan A cheaper for large amounts?
(lines 2)
=> Plan B has no starting cost but goes up faster ($10 per GB). Plan A starts at $20 but only goes up $5 per GB, so it catches up and passes Plan B after 4 GB.
:::

::: try
@viz coord xmin=0 xmax=6 ymin=0 ymax=30 ystep=5 xlabel="weeks" ylabel="savings ($)" points="0,5;1,9;2,13;3,17;4,21;5,25"
a) Is the relation increasing or decreasing? [[increasing]]
b) What is the starting value? [[$5]]
c) How much does it change each week? [[+$4]]
d) Write an equation: [[s = 4w + 5]]
e) Predict the savings after 10 weeks: [[$45]]
:::

::: retrieval
1. A graph starts at 50 and goes down by 5 each step. Is it increasing or decreasing? Write an equation.
=> Decreasing. y = 50 − 5x
2. What does the starting value mean on the candle graph?
=> The candle is 20 cm tall before it burns.
3. Use h = 20 − 2t. How tall is the candle after 6 hours?
=> 8 cm
4. Describe the relation y = 3x + 1 in words.
=> It starts at 1 and goes up by 3 each time.
5. ★ Stretch: A pool has 900 L of water. It drains 60 L every minute. When is it empty? Write an equation and explain.
=> w = 900 − 60t. It is empty when 60t = 900, so t = 15 minutes.
:::

## Unit Synthesis
1. Show one relation four ways: a pattern picture, a table, an equation and a graph.
(work 4)
=> Answers vary. Example: 3, 5, 7, 9 → y = 2x + 1, points (1, 3), (2, 5), (3, 7), (4, 9).
2. How do "starts at" and "goes up by" show up in an equation?
=> "Goes up by" is the number multiplied by x. "Starts at" (when x = 0) is the number added.
3. When should you connect the points on a graph? When shouldn't you?
=> Connect when in-between values make sense (time, distance). Don't connect when you count whole things (tables, tickets).
4. Look back at your first page. What would you change now?
=> Answers vary.

## Concept Reference
::: key Pattern → table → equation → graph
Seats around tables: starts at 2, goes up by 2. s = 2n + 2.
"Goes up by" → number times n. "Starts at" (n = 0) → number added. Check with two rows of the table.
:::
@viz pattern start=2 add=2 figures=3

| n | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| s | 4 | 6 | 8 | 10 |

@viz coord xmin=0 xmax=5 ymin=0 ymax=12 ystep=2 xlabel="tables" ylabel="seats" points="1,4;2,6;3,8;4,10"

::: key Ordered pairs
(x, y) = (3, 8) means x = 3, y = 8. To find a missing value, substitute. To find a missing x, work backwards.
:::

::: key Reading a graph
Increasing or decreasing? Starting value (x = 0)? Goes up/down by how much each step?
Dots only for things you count. A line when in-between values make sense.
:::

| Mistake | Fix |
|---|---|
| Up by 2 → y = x + 2 | Up by 2 → y = 2x + (start). Check with the table. |
| Connecting dots for counted things | No 2½ tables: dots only. |
| Starting value = first number in the table | Starting value is when x = 0. Work backwards. |
