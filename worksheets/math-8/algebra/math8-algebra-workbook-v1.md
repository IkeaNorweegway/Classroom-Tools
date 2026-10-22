---
title: Algebra
strand: algebra
rubric:
  - Patterns: turn a pattern into a table and describe it in words
  - Relations: write an equation, find missing values, graph and read a relation
  - One- and two-step equations: solve and verify
  - Equations with brackets: solve two ways
  - Word problems: write an equation, solve it, answer in words
---
<!-- Gate: interleaving confirmed. No part headers. ★/★★ per cluster: patterns/tables (LR1–2), graphs (LR3–4), one- and two-step equations (LE1–2),
     brackets (LE3), word problems (LE4) — each 3+ times. Bloom's: 1 recall, the rest apply / analyze / evaluate. Visuals on 8 of 18 questions.
     Contexts from the notes: banquet tables, Calgary taxi, candle, phone plans, Stampede rides, canoe rental. -->

## core | LR1 — Linear Relations, Section 1
Banquet tables are pushed together in a row. Draw Figure 4. Then fill in the table.
@viz pattern start=2 add=2 figures=3
| Tables | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Seats | 4 | 6 | 8 | [[10]] | [[12]] |
(work 2)

## core | LE1 — Linear Equations, Section 1
Write the equation the balance shows. Solve it.
@viz balance left="4x" right="+20"
(lines 2)
=> 4x = 20. Divide both sides by 4: x = 5.

## core | LR2 — Linear Relations, Section 2
A Calgary taxi costs $4 plus $3 per km. Write an equation. Find the cost of a 6 km ride.
(lines 2)
=> c = 3k + 4. c = 3(6) + 4 = $22.

## core | LE2 — Linear Equations, Section 2
Solve and verify: 5x − 7 = 18
(work 2)
=> 5x = 25, x = 5. Check: 5(5) − 7 = 18 ✓

## core | LR3 — Linear Relations, Section 3
Graph y = 2x + 3 for x = 0 to 5.
@viz coord xmin=0 xmax=6 ymin=0 ymax=14 ystep=2 keypoints="0,3;1,5;2,7;3,9;4,11;5,13"
(lines 1)
=> (0, 3), (1, 5), (2, 7), (3, 9), (4, 11), (5, 13). The points are in a straight line.

## core | LE3 — Linear Equations, Section 3
Expand, then solve: 3(x + 5) = 27
(work 2)
=> 3x + 15 = 27, 3x = 12, x = 4.

## core | LR4 — Linear Relations, Section 4
Look at the graph of a candle burning.
@viz coord xmin=0 xmax=8 ymin=0 ymax=28 ystep=4 xlabel="hours" ylabel="height (cm)" points="0,24;1,21;2,18;3,15;4,12;5,9;6,6;7,3;8,0" line=1
a) Increasing or decreasing?
b) Starting height?
c) Change each hour?
d) When does it burn out?
(lines 2)
=> a) decreasing b) 24 cm c) −3 cm each hour d) after 8 hours

## core | LE4 — Linear Equations, Section 4
At the Stampede, Jordan pays $18 to get in and $3 for each ride. He spends $42. Write an equation and find the number of rides. Answer in words.
(work 3)
=> 3r + 18 = 42, 3r = 24, r = 8. Jordan went on 8 rides.

## CHECKIN

## ext | LR2 — Linear Relations, Section 2
Ivy says the equation for this table is y = x + 4, "because it goes up by 4." Test her equation. Write the right one.
| x | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| y | 7 | 11 | 15 | 19 |
(lines 3)
=> Test x = 2: 2 + 4 = 6, not 11. Up by 4 means 4x. Figure 0 = 3. y = 4x + 3. Check: 4(4) + 3 = 19 ✓
::: teacher
label: Misconception target
"Goes up by 4" → y = x + 4.
:::

## ext | LE1 — Linear Equations, Section 1
Liam solved 6x = 30 by subtracting 6 from both sides. He got x = 24. Explain his mistake. Solve it correctly and verify.
(lines 3)
=> 6x means 6 times x, so divide by 6: x = 5. Check: 6 × 5 = 30 ✓. (6 × 24 = 144.)
::: teacher
label: Misconception target
3x = 12 → subtract 3.
:::

## ext | LR3 — Linear Relations, Section 3
Emma graphs the number of hockey players and the number of jerseys needed, and joins the points with a line. Kofi graphs hours of driving and distance, and also joins the points. Who should join the points? Explain.
(lines 3)
=> Kofi. Time and distance can be any value in between. You can't have 2½ players, so Emma should plot dots only.
::: teacher
label: Misconception target
Connecting dots for counted data.
:::

## ext | LE2 — Linear Equations, Section 2
Find the first mistake. Then solve correctly.
2x + 8 = 20 → x + 8 = 10 → x = 2
(lines 3)
=> Line 2: she divided only 2x by 2. Subtract 8 first: 2x = 12, x = 6.
::: teacher
label: Misconception target
Undoing in reading order (divide first).
:::

## ext | LE3 — Linear Equations, Section 3
Max says 4(x − 2) = 4x − 2. Draw a picture or use numbers (try x = 5) to show he is wrong. Then solve 4(x − 2) = 12.
(work 3)
=> x = 5: 4(5 − 2) = 12 but 4(5) − 2 = 18. 4(x − 2) = 4x − 8. Solve: x − 2 = 3, x = 5.
::: teacher
label: Misconception target
Distributing to the first term only.
:::

## ext | LR4 + LE4 — Linear Relations and Equations
Phone Plan A: $20 a month plus $5 per GB. Plan B: $10 per GB, no monthly fee.
@viz coord xmin=0 xmax=6 ymin=0 ymax=60 ystep=10 xlabel="GB" ylabel="cost ($)" keypoints="0,20:A;2,30;4,40;6,50;0,0:B;2,20;4,40;6,60"
a) Write an equation for each plan.
b) Graph both plans.
c) Solve 5g + 20 = 10g to find when they cost the same.
(work 4)
=> a) A: c = 5g + 20; B: c = 10g. c) 20 = 5g, g = 4. Both cost $40 at 4 GB.

## ext | LE4 — Linear Equations, Section 4
Five friends share the cost of a pizza order equally. Each also pays $2 for a drink. Each person pays $9. Write an equation using p for the pizza cost. Solve it.
(work 3)
=> p/5 + 2 = 9, p/5 = 7, p = $35.

## stretch | LR2 + LE2 — Relations and Equations
The pattern t = 3n + 5 has a figure with 65 tiles. Which figure is it? Explain how solving an equation answers the question.
(work 3)
=> 3n + 5 = 65, 3n = 60, n = 20. Figure 20. Knowing the tiles (y) and finding the figure (x) means working backwards — solving an equation.

## stretch | LE3 + LR1 — Equations and Patterns
A rectangle has a length of (x + 4) cm and a width of 3 cm. Its area is 27 cm². Write an equation and find x. What is the length?
@viz squares shapes="6x3" labels="length = x + 4, width = 3" cell=16
(work 3)
=> 3(x + 4) = 27, x + 4 = 9, x = 5. Length = 9 cm.

## stretch | LR4 + LE4 — Relations and Equations
A pool holds 1500 L. It drains 75 L every minute. Write an equation for the water left. When will 600 L be left? When will it be empty?
(work 4)
=> w = 1500 − 75t. 1500 − 75t = 600 → 75t = 900 → t = 12 minutes. Empty: 75t = 1500 → t = 20 minutes.
