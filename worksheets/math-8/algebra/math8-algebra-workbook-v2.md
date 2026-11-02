---
title: Algebra & Functions
strand: algebra
rubric:
  - Polynomials: terms, coefficients and exponents, naming by terms and degree, like terms and order, adding and subtracting
  - Solving equations: clearing fractions and decimals, brackets, variables on both sides, equation problems
  - Inequalities: strict and non-strict, graphs on a number line, checking solutions, real-world inequalities
  - Linear functions: slope as rise over run, kinds of slope, y = mx + b, intercepts, rate of change and special lines
---
<!-- Gate: interleaving confirmed. No part headers. ★/★★ per topic: polynomials (PO1–4), solving equations (SE1–4),
     inequalities (IQ1–4), linear functions (LF1–4) — every section code once outside the stretch, Core (sections 1–2)
     first, Extended (sections 3–4) after the check-in, then two mixed stretch questions.
     Contexts from the notes: term arrows, algebra tiles and like-term bins, column sums, × LCD arrows with a red ✗,
     bracket arrows, the bunny hill and ski runs, rise/run steps, flat and straight-up lines, open and closed dots,
     posted limit signs, receipts for a two-plan problem, a draining bin with its intercepts.
     Every Algebra & Functions misconception in _courses/math-8/_context.md has a Misconception target box. -->

## core | PO1 — Polynomials, Section 1
Look at the term −5x³.
@viz poterm c="−5" v="x" e="3" clabel="coefficient [[−5]]" vlabel="variable [[x]]" elabel="exponent [[3]]"
a) Name the coefficient, the variable and the exponent.
b) Write −5x³ as a product of factors.
c) Write 7 · x · x as one term.
d) What is the coefficient of −x²?
(lines 4)
=> a) Coefficient −5. Variable x. Exponent 3.
=> b) −5x³ = −5 · x · x · x. The exponent 3 means 3 factors of x.
=> c) Two factors of x make x². So 7 · x · x = 7x².
=> d) −1. The 1 is hidden: −x² = −1 · x · x.

## core | SE1 — Solving Equations, Section 1
Ivy solves {2/5}x + 1 = 3. She multiplies by 5. She writes 2x + 1 = 15.
@viz semult top="{2/5}x;+ 1;=;3" by="× 5" bottom="2x;+ 1;=;15" miss="2" title="Ivy's step"
a) Which term did Ivy skip?
b) Clear the fraction the right way. Then solve. Check.
c) Solve 0.3x + 1.2 = 2.7. Multiply every term by 10 first.
@viz semult top="0.3x;+ 1.2;=;2.7" by="× 10" bottom="[[3x]];+ [[12]];=;[[27]]"
(lines 5)
=> a) She skipped the + 1. Every term must be multiplied by 5.
=> b) 5 × {2/5}x = 2x. 5 × 1 = 5. 5 × 3 = 15. So 2x + 5 = 15.
=> Subtract 5: 2x = 10. Divide by 2: x = 5.
=> Check: {2/5}(5) + 1 = 2 + 1 = 3 ✓.
=> c) × 10: 3x + 12 = 27. Subtract 12: 3x = 15. Divide by 3: x = 5.
=> Check: 0.3(5) + 1.2 = 1.5 + 1.2 = 2.7 ✓.
::: teacher
label: Misconception target
"Multiply only the fraction term by the LCD." Have the student draw one arrow from × 5 to every term, on both sides. Count the arrows: four terms, four arrows.
:::

## core | IQ1 — Inequalities, Section 1
Sam says 3 is a solution of x < 3. "It's the boundary, so it counts."
@viz iqline value=3 dir=left closed=0 min=-2 max=6 label="x < 3" marks="1:test 1;3:test 3"
a) Is 3 < 3 true or false? Is 3 ≤ 3 true or false?
b) Is Sam right? Use the dot to explain.
c) Strict or non-strict? x < 3, x ≥ −1, 5 > y, n ≤ 7.
d) Write in symbols: "t is at least 4."
(lines 4)
=> a) 3 < 3 is false. 3 is not less than itself. 3 ≤ 3 is true. ≤ means less than OR equal to.
=> b) No. The open dot means 3 is left out. 1 works: 1 < 3. Even 2.9 works. 3 does not.
=> c) x < 3: strict. x ≥ −1: non-strict. 5 > y: strict. n ≤ 7: non-strict.
=> d) t ≥ 4. "At least 4" includes 4.
::: teacher
label: Misconception target
"x < 3 includes 3." Have the student substitute 3: is 3 < 3 true? Then compare with 3 ≤ 3. The line under ≤ is the "or equal" part. Open dot = left out, closed dot = included.
:::

## core | LF1 — Linear Functions, Section 1
The bunny hill at Lake Louise rises 200 m over a run of 500 m.
Ty says the slope is {500/200} = {5/2}.
@viz lfhill kind=hill rv=2 runv=5 rise="rise 200 m" run="run 500 m" slope="slope = [[2/5]]" title="Bunny hill"
a) Is Ty right? Explain.
b) Find the slope of the hill.
c) Count the rise and the run from A to B. Find the slope of AB.
@viz lfslope pts="1,1;5,4" names="A;B" coords=1 rise="[[3]]" run="[[4]]" xmin=0 xmax=6 ymin=0 ymax=5
d) Check your slope with the formula.
(lines 4)
=> a) No. Ty did run over rise. Slope is rise ÷ run: up over across.
=> b) Slope = {200/500} = {2/5}.
=> c) Across 4, up 3. Slope = {3/4}.
=> d) m = {4 − 1/5 − 1} = {3/4} ✓.
::: teacher
label: Misconception target
"Slope is run over rise." Ask: a steeper hill has a bigger rise. Should its slope be bigger or smaller? Rise on top makes steeper hills bigger. Say it as "up over across."
:::

## core | PO2 — Polynomials, Section 2
Eli says 5 − x³ has degree 2. "It has two terms."
@viz posort bins="Number of terms:5,−x³;Exponents:0,3" totals="[[2 terms: binomial]];[[highest 3: degree 3]]"
a) Is Eli right? Name 5 − x³ by terms and by degree.
b) Name 2x² + x − 7 two ways.
c) Name −8x two ways.
d) Name 9 two ways.
e) Is {3/x} + 1 a polynomial? Explain.
(lines 5)
=> a) No. The degree is the highest exponent, 3. Two terms makes it a binomial. So 5 − x³ is a cubic binomial.
=> b) Three terms: trinomial. Highest exponent 2: quadratic. A quadratic trinomial.
=> c) One term: monomial. Exponent 1: linear. A linear monomial.
=> d) One term: monomial. 9 = 9x⁰, degree 0: constant. A constant monomial.
=> e) No. {3/x} = 3x⁻¹. A polynomial has no negative exponents.
::: teacher
label: Misconception target
"The degree is the number of terms." Keep the two counts apart: count the terms for the first name, find the biggest exponent for the second. x³ + 1 has two terms and degree 3.
:::

## core | SE2 — Solving Equations, Section 2
Solve −4(x − 2) = 6.
@viz sedist factor="−4" terms="x;− 2" result="[[−4x]];[[+ 8]]"
a) Expand −4(x − 2). Use the arrows.
b) Solve. The answer may be a fraction.
c) Check your answer.
(lines 4)
=> a) −4 × x = −4x. −4 × (−2) = +8. So −4x + 8.
=> b) −4x + 8 = 6. Subtract 8: −4x = −2. Divide by −4: x = {1/2}.
=> c) −4({1/2} − 2) = −4(−{3/2}) = 6 ✓.

## core | IQ2 — Inequalities, Section 2
Ben graphs x > −2. He draws the ray to the left.
@viz iqline value=-2 dir=left closed=0 min=-6 max=4 label="x > −2" caption="Ben's graph"
a) Test 0 and −4 in x > −2. Which one does Ben's ray cover?
b) Draw the right graph of x > −2.
@viz iqline value=-2 dir=right closed=0 blank=1 min=-6 max=4 label="x > −2" caption="Your graph"
c) Write the inequality for this graph.
@viz iqline value=1.5 dir=left closed=1 min=-2 max=4 step=0.5 every=1 label="[[x ≤ 1.5]]"
(lines 4)
=> a) 0 > −2 is true. −4 > −2 is false. Ben's ray covers −4, a wrong number. It misses 0, a right one.
=> b) Open dot at −2. The ray goes right. Greater is to the right.
=> c) Closed dot at 1.5, ray left: x ≤ 1.5.
::: teacher
label: Misconception target
"x > 2 points left" (here x > −2). The arrow in the sign is not the ray. Test one number on each side. The ray goes where the test is true. Greater is to the right.
:::

## core | LF2 — Linear Functions, Section 2
Jay says line A has no slope. "It's flat."
@viz lfgraph lines="0,2;x=3" labels="A;B" lpos="0.06;0.62" points="1,2:(1, 2);5,2:(5, 2);3,1:(3, 1);3,4:(3, 4)" xmin=-2 xmax=6 ymin=-1 ymax=5 cell=28
a) Find the slope of line A. Use its two points. Is Jay right?
b) Find the slope of line B. Use its two points.
c) Name each slope: positive, negative, zero or undefined.
@viz lfkinds lines="-2,0;1/2,0;0,1;x=1" titles="[[negative]];[[positive]];[[zero]];[[undefined]]"
d) A line has slope {2/3}. What slope does a parallel line have? A perpendicular line?
(lines 5)
=> a) Rise 2 − 2 = 0. Run 5 − 1 = 4. Slope = {0/4} = 0. Jay is wrong. A flat line has slope 0.
=> b) Rise 4 − 1 = 3. Run 3 − 3 = 0. {3/0} can't be done. The slope is undefined.
=> c) Negative, positive, zero, undefined.
=> d) Parallel: {2/3}, the same slope. Perpendicular: −{3/2}. Flip it and change the sign.
::: teacher
label: Misconception target
"A horizontal line has no slope / undefined slope." Have the student write rise ÷ run for each line. 0 ÷ 4 = 0 is a number. 3 ÷ 0 has no answer. Flat is zero. Straight up is undefined.
:::

## CHECKIN

## ext | PO3 — Polynomials, Section 3
Mo writes 3x² + 2x = 5x³.
@viz potiles rows="3x2;2x" notes="3 squares and 2 thin tiles"
a) Use the tiles. Explain why Mo is wrong.
b) Sort the like terms. Simplify 2x + 3x² − 6 − x² + 4x + 1.
@viz posort bins="x² terms:3x²,−x²;x terms:2x,4x;numbers:−6,+1" totals="[[2x²]];[[6x]];[[−5]]"
c) Write your answer in descending order. Then in ascending order.
d) Check with x = 1.
(lines 5)
=> a) 3x² and 2x are not like terms. Squares and thin tiles do not match. 3x² + 2x is already simplified.
=> b) x²: 3x² − x² = 2x². x: 2x + 4x = 6x. Numbers: −6 + 1 = −5.
=> c) Descending: 2x² + 6x − 5. Ascending: −5 + 6x + 2x².
=> d) Start: 2 + 3 − 6 − 1 + 4 + 1 = 3. Answer: 2 + 6 − 5 = 3 ✓.
::: teacher
label: Misconception target
"3x² + 2x = 5x³." Like terms need the same variable AND the same power. Test with x = 2: 3(4) + 2(2) = 16, but 5(8) = 40.
:::

## ext | SE3 — Solving Equations, Section 3
Solve {1/3}x + 4 = {1/2}x + 1.
@viz semult top="{1/3}x;+ 4;=;{1/2}x;+ 1" by="× 6" bottom="[[2x]];+ [[24]];=;[[3x]];+ [[6]]"
a) Multiply every term by 6.
b) Solve. Check in the first equation.
c) Solve 1.2x + 1 = 0.4x + 3. Check.
(lines 6)
=> a) 2x + 24 = 3x + 6.
=> b) Subtract 2x: 24 = x + 6. Subtract 6: x = 18.
=> Check: {1/3}(18) + 4 = 10. {1/2}(18) + 1 = 10 ✓.
=> c) × 10: 12x + 10 = 4x + 30. Subtract 4x: 8x + 10 = 30. Subtract 10: 8x = 20. x = 2.5.
=> Check: 1.2(2.5) + 1 = 4. 0.4(2.5) + 3 = 4 ✓.

## ext | IQ3 — Inequalities, Section 3
Test values in 3x − 4 ≥ 5.
@viz iqline value=3 dir=right closed=1 blank=1 min=-2 max=7 label="3x − 4 ≥ 5" marks="-1:−1;2:2;3:3;4.5:4.5"
a) Test −1, 2, 3 and 4.5. Which are solutions?
b) Lee says 3 is not a solution. "It's the boundary." Is he right?
c) Draw the dot and the ray.
(lines 5)
=> a) −1: 3(−1) − 4 = −7. −7 ≥ 5 is false.
=> 2: 3(2) − 4 = 2. 2 ≥ 5 is false.
=> 3: 3(3) − 4 = 5. 5 ≥ 5 is true.
=> 4.5: 3(4.5) − 4 = 9.5. 9.5 ≥ 5 is true. Solutions: 3 and 4.5.
=> b) No. ≥ includes "equal to". 5 ≥ 5 is true.
=> c) Closed dot at 3. Ray to the right. The graph shows x ≥ 3.

## ext | LF3 — Linear Functions, Section 3
Zara says y = 3x − 2 has slope −2.
a) Find m and b. Is Zara right?
b) Graph y = 3x − 2. Start at b. Use the slope.
@viz lfgraph keylines="3,-2" keypoints="0,-2;1,1;2,4" xmin=-2 xmax=4 ymin=-4 ymax=6 cell=22
c) Write the equation of this line.
@viz lfgraph lines="-1/2,4" points="0,4;4,2" steps="0,4,4,2" rise="[[−2]]" run="[[4]]" xmin=-1 xmax=9 ymin=-1 ymax=6 cell=22
(lines 5)
=> a) m = 3 and b = −2. Zara is wrong. −2 is where the line crosses the y-axis, (0, −2).
=> b) Plot (0, −2). Go right 1 and up 3 to (1, 1), then (2, 4). Join them.
=> c) b = 4: it crosses at (0, 4). Slope = {−2/4} = −{1/2}. y = −{1/2}x + 4.
::: teacher
label: Misconception target
"In y = mx + b, b is the slope." m multiplies x; it tells how fast y changes. b stands alone; it is y when x = 0. Have the student substitute x = 0 and see that y = b.
:::

## ext | PO4 — Polynomials, Section 4
Erin subtracts (4x² + 3x − 2) − (x² − 5x + 6). She gets 3x² − 2x + 4.
@viz postack heads="x²;x;1" rows="4x²;+3x;−2 | −x²;[[+5x]];[[−6]]" op="+" result="[[3x²]];[[+8x]];[[−8]]" title="Add the opposite"
a) Find Erin's mistake.
b) Subtract. Use the columns.
c) Check both answers with x = 1.
d) Add (2x² − x + 3) + (x² + 4x − 7).
(lines 6)
=> a) She only flipped the sign of x². Every term in the second bracket must flip.
=> b) 4x² + 3x − 2 − x² + 5x − 6 = 3x² + 8x − 8.
=> c) Start: (4 + 3 − 2) − (1 − 5 + 6) = 5 − 2 = 3. Right answer: 3 + 8 − 8 = 3 ✓. Erin: 3 − 2 + 4 = 5 ✗.
=> d) 3x² + 3x − 4.
::: teacher
label: Misconception target
"(3x + 2) − (x − 5) = 2x − 3." Subtracting means adding the opposite of EVERY term. Have the student rewrite the bracket with every sign flipped before combining.
:::

## ext | SE4 — Solving Equations, Section 4
Two bike shops in Canmore rent by the hour.
@viz receipt title="Shop A" items="Base fee:$12.00;x hours at $3.50:3.50x;Total:[[12 + 3.50x]]"
@viz receipt title="Shop B" items="Base fee:$30.00;x hours at $1.25:1.25x;Total:[[30 + 1.25x]]"
a) Let x = the hours. Write the cost at each shop.
b) Write an equation for equal cost. Solve it.
c) Verify your answer.
d) Which shop is cheaper for 10 hours? Answer in words.
(lines 6)
=> a) Shop A: 12 + 3.50x. Shop B: 30 + 1.25x.
=> b) 12 + 3.5x = 30 + 1.25x. × 100: 1200 + 350x = 3000 + 125x. Subtract 125x: 1200 + 225x = 3000. Subtract 1200: 225x = 1800. x = 8.
=> c) A: 12 + 3.5(8) = $40. B: 30 + 1.25(8) = $40 ✓.
=> d) A: 12 + 35 = $47. B: 30 + 12.50 = $42.50. Shop B is cheaper for 10 hours.

## ext | IQ4 — Inequalities, Section 4
A small bridge has a load sign. A minivan has 7 seats.
@viz iqsign kind=limit top="BRIDGE" value="5 t" unit="MAXIMUM LOAD"
a) Let w = the mass in tonnes. Write an inequality for the bridge.
b) A truck is 4.2 t. It carries 0.9 t of hay. Is it safe? Test it.
c) Let p = the people in the van. Write an inequality. Graph it.
@viz iqline value=7 dir=left closed=1 whole=1 nodot=1 blank=dir min=0 max=8 label="[[p ≤ 7]]"
d) Why does the van graph use dots, not a ray?
(lines 5)
=> a) w ≤ 5. "Maximum" means at most, so 5 t is allowed.
=> b) 4.2 + 0.9 = 5.1. 5.1 ≤ 5 is false. It is not safe.
=> c) p ≤ 7. Dots at 0, 1, 2, … 7. (With a driver, p is 1 to 7.)
=> d) People are counted. You can't have 6.5 people. Only whole numbers work.

## ext | LF4 — Linear Functions, Section 4
A grain bin holds 40 t of wheat. An auger empties it at a steady rate.
@viz lfgraph lines="seg:0,40,8,0" points="0,40:[[(0, 40)]];8,0:[[(8, 0)]]" xmin=0 xmax=10 ymin=0 ymax=45 ystep=5 yevery=10 xlabel="hours" ylabel="wheat (t)" cell=22
a) Write both intercepts as ordered pairs. What does each one mean?
b) Find the rate of change. Include units.
c) Write the equation of the line.
d) The empty bin sits from hour 8 to hour 10. Write the equation of that part. What is its slope?
(lines 6)
=> a) y-intercept (0, 40): the bin starts with 40 t. x-intercept (8, 0): it is empty after 8 hours.
=> b) m = {0 − 40/8 − 0} = −5. The bin loses 5 t each hour.
=> c) y = −5x + 40.
=> d) y = 0. It is a horizontal line, so its slope is 0.

## stretch | LF3 + SE3 + IQ3 — Lines, Equations and Inequalities
Tank A has 3 L of water. It fills at 2 L each minute. Tank B has 9 L. It drains at 1 L each minute.
@viz lfgraph lines="2,3;-1,9" labels="A;B" lpos="0.85;0.85" keypoints="2,7" xmin=0 xmax=6 ymin=0 ymax=16 ystep=2 yevery=2 xlabel="minutes" ylabel="water (L)" cell=22
a) Write y = mx + b for each tank. What do m and b mean?
b) Solve an equation. When do the tanks hold the same amount?
c) When does Tank A hold more? Write an inequality in t. Test t = 1 and t = 3.
@viz iqline value=2 dir=right closed=0 blank=1 min=0 max=6 label="[[t > 2]]"
(lines 6)
=> a) A: y = 2x + 3. B: y = −x + 9. m is the rate (L per minute). b is the start amount (L).
=> b) 2x + 3 = −x + 9. Add x: 3x + 3 = 9. Subtract 3: 3x = 6. x = 2. Both hold 7 L after 2 minutes.
=> c) t > 2. t = 1: A 5 L, B 8 L ✗. t = 3: A 9 L, B 6 L ✓. Open dot at 2: at 2 they are equal, not more.

## stretch | PO4 + SE1 + IQ4 — Polynomials, Equations and Limits
The sides of a triangle are x + 4, 2x − 1 and {1/2}x + 3 (cm).
@viz polygon pts="0,0;6,0;2.3,2.9" sides="x + 4;2x − 1;x/2 + 3" unit=34
a) Write the perimeter. Simplify it. Name it by terms and degree.
b) The perimeter is 20 cm. Find x. Find each side.
c) The perimeter must be at most 27 cm. Write an inequality. Is x = 6 allowed? Is x = 7?
(lines 6)
=> a) x + 2x + {1/2}x = {7/2}x. 4 − 1 + 3 = 6. P = {7/2}x + 6. A linear binomial.
=> b) {7/2}x + 6 = 20. × 2: 7x + 12 = 40. 7x = 28. x = 4. Sides: 8 cm, 7 cm, 5 cm. Check: 8 + 7 + 5 = 20 ✓.
=> c) {7/2}x + 6 ≤ 27. x = 6: 21 + 6 = 27. 27 ≤ 27 ✓, allowed. x = 7: 24.5 + 6 = 30.5 ✗, too long.
