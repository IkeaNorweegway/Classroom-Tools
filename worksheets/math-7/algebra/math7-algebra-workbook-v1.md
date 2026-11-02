---
title: Algebra & Functions
strand: algebra
rubric:
  - Linear equations: like terms, the distributive property, the balance, x on both sides, checking solutions and word problems
  - Functions: inputs and outputs, mapping diagrams, graphs from tables, dots or a line, domain and range in words, real-world limits, the vertical line test
---
<!-- Gate: interleaving confirmed. No part headers. ★/★★ per topic: linear equations (LE), functions (FN) —
     every section code at least once outside the stretch questions, Core first, Extended after the check-in,
     then two mixed stretch questions.
     Contexts from the notes: algebra tiles and zero pairs, the bag-and-block balance, bus rides at $3, the
     water trough (here a grain bin), the vertical line test graphs, a flat line hitting twice, same-perimeter shapes.
     Every Algebra & Functions misconception in _courses/math-7/_context.md has a Misconception target box. -->

## core | LE1 — Linear Equations, Section 1
Noor writes 3x + 4x = 7x². She also writes 5x + 3 = 8x.
a) Simplify 3x + 4x. Use the tiles.
b) Simplify 5x + 3.
c) Simplify 4x + 3 − x + 2.
@viz tiles terms="3x;4x" label="3x + 4x"
@viz tiles terms="5x;+3" label="5x + 3"
(lines 3)
=> a) 3x + 4x = 7x. There are 7 x tiles. Like terms add the count only.
=> b) 5x + 3 stays 5x + 3. An x tile and a small tile are not like terms.
=> c) x-terms: 4x − x = 3x. Numbers: 3 + 2 = 5. The answer is 3x + 5.
::: teacher
label: Misconception target
"2x + 3x = 5x²" or "3x + 2 = 5x." Have the student count the tiles. Seven x tiles is 7x, not a square. Tall and small tiles never join.
:::

## core | FN1 — Functions, Section 1
Look at the two mapping diagrams.
Sam says every relation is a function. Leo says A is not a function. "Two arrows go to 5."
@viz mapping in="1,2,3" out="5,9" arrows="1>5;2>5;3>9" caption="Relation A"
@viz mapping in="1,2,3" out="4,6,8" arrows="1>4;2>6;2>8;3>8" caption="Relation B"
a) Is A a function? Explain.
b) Is B a function? Explain.
c) Who is right, Sam or Leo?
(lines 3)
=> a) Yes. Each input has exactly one arrow. Two inputs may share the output 5.
=> b) No. The input 2 has two outputs, 6 and 8.
=> c) Neither. B shows that not every relation is a function. A shows that two inputs can share an output.
::: teacher
label: Misconception target
Two targets. "Every relation is a function": point to the input 2 in B. "Two inputs can't have the same output": in A, count the arrows leaving each input, not the arrows arriving.
:::

## core | LE2 — Linear Equations, Section 2
Each bag holds x blocks. Solve 2x + 5 = 13.
Ben takes 5 blocks off the left side only. He writes 2x = 13.
@viz balance left="2x;+5" right="+13" caption="Each bag holds x blocks."
a) Is the balance still level after Ben's step? Explain.
b) Solve 2x + 5 = 13. Show each step.
c) Check your answer.
(lines 3)
=> a) No. The left lost 5 blocks. The right did not. The balance tips.
=> b) Subtract 5 from both sides: 2x = 8. Divide both sides by 2: x = 4.
=> c) 2(4) + 5 = 8 + 5 = 13 ✓.
::: teacher
label: Misconception target
"Do it to one side only." Ask: what happens to a real balance if you take blocks off one pan?
:::

## core | FN2 — Functions, Section 2
A swim at the Banff hot springs costs $5 a person.
a) Fill in the table.
b) Mia graphs the table. She joins the dots. Is she right? Explain.

| people | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| cost ($) | 0 | [[5]] | [[10]] | [[15]] | [[20]] |

@viz coord xmin=0 xmax=5 ymin=0 ymax=25 ystep=5 points="0,0;1,5;2,10;3,15;4,20" line=1 xlabel="people" ylabel="cost ($)" width=300 caption="Mia's graph"
(lines 3)
=> a) 0, 5, 10, 15, 20. Each person adds $5.
=> b) No. People are counted. You can't have 2.5 people. Show dots only. The function is discrete.
::: teacher
label: Misconception target
"Always connect the dots." Ask: what point is half way between 2 and 3 people? Does it make sense?
:::

## core | LE1 — Linear Equations, Section 1
Zoe simplifies 2(x + 5) + 3x. She writes 2x + 5 + 3x = 5x + 5.
a) Look at the groups. Find her mistake.
b) Simplify 2(x + 5) + 3x.
c) Simplify −2(x − 3).
@viz tilerows rows="x;+5 | x;+5 | 3x" labels="Group 1;Group 2;+ 3x" notes=";;[[5x + 10]]"
(lines 3)
=> a) She multiplied only the x by 2. The 5 must be multiplied by 2 too. There are two groups of 5 small tiles.
=> b) 2x + 10 + 3x = 5x + 10.
=> c) −2 × x = −2x and −2 × (−3) = 6. The answer is −2x + 6.
::: teacher
label: Misconception target
"2(x + 3) = 2x + 3." Have the student count the small tiles in both groups. Draw arrows from the 2 to EACH term in the bracket.
:::

## core | FN3 — Functions, Section 3
A bus ride costs $3. The pairs (rides, cost) are (1, 3), (2, 6), (3, 9), (4, 12).
Raj says the domain is 3, 6, 9, 12.
@viz mapping in="1,2,3,4" out="3,6,9,12" arrows="1>3;2>6;3>9;4>12" inlabel="rides" outlabel="cost ($)"
a) Is Raj right? Explain.
b) Write the domain and the range.
(lines 3)
=> a) No. Raj gave the outputs. Those are the range. The domain is the inputs.
=> b) Domain: 1, 2, 3, 4 (rides). Range: 3, 6, 9, 12 (dollars).
::: teacher
label: Misconception target
"Domain and range are the same thing" or swapped. Domain = inputs (x, the left oval). Range = outputs (y, the right oval). A memory hook: D comes before R, and x comes before y.
:::

## core | LE3 — Linear Equations, Section 3
Omar solves 5x + 2 = 2x + 11. He moves 2x across and keeps its sign.
He writes 7x + 2 = 11.
@viz tilerows rows="5x;+2 = 2x;+11 | 3x;2x!;+2 = 2x!;+11" labels="Start;− 2x" notes=";[[3x + 2 = 11]]"
a) Subtract 2x from both sides. What is left?
b) Solve. Check your answer.
(lines 3)
=> a) 5x − 2x = 3x. 2x − 2x = 0. So 3x + 2 = 11.
=> b) Subtract 2: 3x = 9. Divide by 3: x = 3. Check: 5(3) + 2 = 17 and 2(3) + 11 = 17 ✓.
=> Omar's way gives 7x = 9. That has no whole-number answer. That is a clue something went wrong.
::: teacher
label: Misconception target
"Move a term across and keep its sign." Cross the 2x tiles out on BOTH sides. The term leaves the right and the left loses 2x.
:::

## CHECKIN

## ext | FN4 — Functions, Section 4
Use the vertical line test.
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 path="1,1;3,2;6,4;3,6;1,7" smooth=0 vline=3 keyhits="3,2;3,6" width=220 caption="Graph A"
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 path="0,7;2,3;4,2;6,4;8,6" vline=2 keyhits="2,3" width=220 caption="Graph B"
@viz coord xmin=0 xmax=5 ymin=0 ymax=6 points="1,2;2,5;3,5;4,1" width=200 caption="Graph C"
a) Which graphs are functions? Explain.
b) Kai draws a flat line at 5 on Graph C. It hits two dots. He says C is not a function. Is he right?
(lines 4)
=> a) B and C are functions. Every vertical line hits them once. A is not: the dashed line at 3 hits it twice, at 2 and at 6.
=> b) No. The test uses vertical lines. A flat line hits (2, 5) and (3, 5). Two inputs share the output 5. That is allowed.
::: teacher
label: Misconception target
A second look at "Two inputs can't have the same output." A flat line checks shared outputs, which are fine. Only a vertical line checks the rule.
:::

## ext | LE4 — Linear Equations, Section 4
At the Calgary Stampede, Kai pays $20 to get in and $3 a ride. Noor pays $8 to get in and $5 a ride.
@viz balance left="3x;+20" right="5x;+8" caption="Each bag is one ride."
a) Let x = the number of rides. Write an equation for when they pay the same.
b) Solve it. Verify your answer.
c) Who pays less for 10 rides?
(lines 5)
=> a) 3x + 20 = 5x + 8.
=> b) Subtract 3x: 20 = 2x + 8. Subtract 8: 12 = 2x. Divide by 2: x = 6.
=> Verify: 3(6) + 20 = 38 and 5(6) + 8 = 38 ✓. After 6 rides, each pays $38.
=> c) Kai: 3(10) + 20 = $50. Noor: 5(10) + 8 = $58. Kai pays less.

## ext | FN1 — Functions, Section 1
The machine's rule is × 2 − 1.
a) Fill in the outputs.
b) Is it a function? Explain.
c) The output is 15. Write an equation. Find the input.
@viz machine in="1;2;3;4" rule="× 2 − 1" out="[[1]];[[3]];[[5]];[[7]]" inlabel="input" outlabel="output"
(lines 4)
=> a) 1, 3, 5, 7.
=> b) Yes. Each input gives exactly one output. The machine does the same thing every time.
=> c) 2x − 1 = 15. Add 1: 2x = 16. Divide by 2: x = 8. Check: 2(8) − 1 = 15 ✓.

## ext | LE3 — Linear Equations, Section 3
Solve 2(x − 5) = 5x + 2.
a) Simplify the left side first.
b) Solve.
c) Verify in the original equation. Then verify in 2x − 10 = 5x + 2.
@viz balance left="x;-5;x;-5" right="5x;+2" text="2(x − 5) = 5x + 2" caption="2 groups of (x − 5) on the left."
(lines 5)
=> a) 2(x − 5) = 2x − 10.
=> b) Subtract 2x: −10 = 3x + 2. Subtract 2: −12 = 3x. Divide by 3: x = −4.
=> c) Original: 2(−4 − 5) = 2(−9) = −18 and 5(−4) + 2 = −18 ✓.
=> Equivalent: 2(−4) − 10 = −18 and 5(−4) + 2 = −18 ✓.

## ext | FN2 — Functions, Section 2
An auger puts 10 t of wheat into a grain bin each hour. The bin starts empty. It holds 60 t.
a) Fill in the table. Graph it.
b) Dots or a line? Why?
c) Write the domain and range in words.
d) Why does the domain stop at 6?

| hours | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| wheat (t) | 0 | [[10]] | [[20]] | [[30]] |

@viz coord xmin=0 xmax=7 ymin=0 ymax=70 ystep=10 keypoints="0,0;6,60" line=1 xlabel="hours" ylabel="wheat (t)" width=300
(lines 4)
=> a) 0, 10, 20, 30. The graph is a line from (0, 0) to (6, 60).
=> b) A line. Time and wheat can be any amount, like 2.5 hours and 25 t. It is continuous.
=> c) Domain: any number of hours from 0 to 6. Range: any amount of wheat from 0 t to 60 t.
=> d) At 6 hours the bin holds 60 t. It is full.

## stretch | LE4 + FN3 — Equations and Graphs
Candle A is 20 cm tall. It burns 2 cm each hour. Candle B is 14 cm tall. It burns 1 cm each hour.
@viz curve xmin=0 xmax=14 ymin=0 ymax=20 ystep=2 xevery=2 path="0,20;10,0 | 0,14;14,0" smooth=0 points="1,18:A;2,12:B" keyhits="6,8" xlabel="hours" ylabel="height (cm)" width=320
a) Write each height after x hours.
b) Solve an equation. When are they the same height?
c) Find that point on the graph.
d) Write the domain of Candle A in words.
(lines 5)
=> a) A: 20 − 2x. B: 14 − x.
=> b) 20 − 2x = 14 − x. Add 2x: 20 = 14 + x. Subtract 14: x = 6. After 6 hours both are 8 cm.
=> c) The lines cross at (6, 8).
=> d) Any number of hours from 0 to 10. At 10 hours Candle A is gone.

## stretch | LE1 + FN1 — Expressions and Functions
The rectangle is x + 2 long and x wide (cm).
@viz polygon pts="0,0;4,0;4,2.5;0,2.5" sides="x + 2;x;x + 2;x" unit=32
a) Write the perimeter. Simplify it.
b) Fill in the table.
c) Is perimeter a function of x? Explain.
d) The perimeter is 36 cm. Find x.

| x (cm) | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| perimeter (cm) | [[8]] | [[12]] | [[16]] | [[20]] |

(lines 5)
=> a) (x + 2) + x + (x + 2) + x = 4x + 4.
=> b) 8, 12, 16, 20.
=> c) Yes. Each width gives exactly one perimeter.
=> d) 4x + 4 = 36. Subtract 4: 4x = 32. Divide by 4: x = 8. The rectangle is 10 cm by 8 cm. Check: 10 + 8 + 10 + 8 = 36 ✓.
