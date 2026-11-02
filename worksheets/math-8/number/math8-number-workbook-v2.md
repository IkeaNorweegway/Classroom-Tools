---
title: Number
strand: number
rubric:
  - Rational numbers: kinds of numbers, repeating decimals, the number line, operations, order of operations and estimating
  - Square roots and irrational numbers: perfect squares, ± roots, estimating roots, exact and approximate values, the real numbers
  - Proportional reasoning: times as many, the constant of proportionality k, missing quantities, direct and inverse proportion
---
<!-- Gate: interleaving confirmed. No part headers. ★/★★ per topic: rational numbers (RN1–4), square roots and
     irrational numbers (SR1–4), proportional reasoning (PR1–4) — every section code at least once outside the stretch,
     Core first, Extended after the check-in, then two mixed stretch questions.
     Contexts from the notes: number rings, long division for 1/3, chip mats in sixths, square tile gardens,
     benchmark square roots, times-as-many bars, ratio tables with × k, worker arrays, gas at $1.45/L.
     Every Number misconception in _courses/math-8/_context.md has a Misconception target box. -->

## core | RN1 — Rational Numbers, Section 1
Jo says −4 is not a rational number. "It is not a fraction."
1. Sort these numbers into the rings: 7, 0, −4, {3/5}, −2.5, {12/3}.
2. Is Jo right? Explain.
@viz rnsets nat="[[7]];[[12/3 = 4]]" int="[[0]];[[−4]]" rat="[[3/5]];[[−2.5]]"
(lines 2)
=> 1. Natural: 7 and {12/3} (= 4). Integers: 0 and −4. Rational: {3/5} and −2.5.
=> 2. No. −4 = {−4/1}. Every integer is also a rational number. The rings sit inside each other.
::: teacher
label: Misconception target
"Integers aren't rational" / "fractions aren't rational, only integers are." Have the student write each integer as a fraction over 1.
:::

## core | SR1 — Square Roots, Section 1
Leo says √36 = 18. "The root is half."
1. Use the square. Find the side.
2. Which are perfect squares: 49, 50, 0.25, {4/9}?
@viz sqside n=6 side="?" cell=18 labels="Area = 36 tiles;Side = [[6]]"
(lines 3)
=> 1. √36 = 6, because 6 × 6 = 36. Leo is wrong: 18 × 18 = 324.
=> 2. 49 = 7². 0.25 = 0.5². {4/9} = ({2/3})². 50 is not a perfect square (7² = 49, 8² = 64).
::: teacher
label: Misconception target
"√ of a number is half of it." Ask: what number times itself makes 36? Check with the side of the square.
:::

## core | PR1 — Proportional Reasoning, Section 1
Kai runs 2 km. Mia runs 2.5 times as far as Kai.
1. How far does Mia run?
2. Kai's distance is how many times Mia's?
@viz prtimes rows="Kai:1;Mia:2.5" value="2 km" total="2 km;[[5 km]]" down="× 2.5" up="× [[0.4]]"
(lines 2)
=> 1. 2.5 × 2 = 5 km.
=> 2. 2 ÷ 5 = 0.4. Kai runs 0.4 times (or {2/5} of) Mia's distance.

## core | RN2 — Rational Numbers, Section 2
Sam says {1/3} = 0.3.
1. Finish the division. Write {1/3} with a bar.
2. Is Sam right? Explain.
3. Ava says there is no number between 0.5 and 0.6. Name two.
@viz rndiv a=1 b=3 steps=3 blank=1 result="1/3 = [[0.333…]]"
@viz numberline min=0.5 max=0.6 step=0.01 every=0.05 keypoints="0.51:0.51;0.55:0.55"
(lines 3)
=> 1. The remainder is always 1. The 3s never end: {1/3} = 0.{bar:3}.
=> 2. No. 0.3 = {3/10}. That is a little less than {1/3}.
=> 3. Any two, like 0.51 and 0.55. There are endless numbers between: 0.501, 0.5001, …
::: teacher
label: Misconception target
Two targets. "0.333… is 0.3": point to the remainder that keeps coming back. "There's no number between 0.5 and 0.6": write them as 0.50 and 0.60 and count the hundredths between.
:::

## core | SR2 — Square Roots, Section 2
Jo is checking square roots.
1. Find √25.
2. Solve x² = 25. Mark the answers on the line.
3. Jo says √−9 = −3. Square −3 to check.
@viz numberline min=-6 max=6 keypoints="-5:x = −5;5:x = 5"
(lines 3)
=> 1. √25 = 5. The √ sign means the positive (principal) root.
=> 2. x = 5 or x = −5. We write x = ±5. Both are 5 steps from 0.
=> 3. (−3) × (−3) = 9, not −9. No real number squared gives −9. √−9 has no real answer.
::: teacher
label: Misconception target
Two targets. "√25 = ±5": the radical gives only 5; the *equation* x² = 25 has two answers. "√−9 = −3": have the student square −3 and look at the sign.
:::

## core | PR2 — Proportional Reasoning, Section 2
A sports drink uses 4 scoops of powder for 10 cups of water.
Leo says, "k is always big ÷ small. So k is 2.5 both ways."
1. Fill in the table. Find k for water = k × powder.
2. Find k for powder = k × water.
3. Is Leo right?
@viz prk top="4,8,12" bottom="10,[[20]],30" toplabel="powder (scoops)" bottomlabel="water (cups)" k="× [[2.5]]"
(lines 3)
=> 1. 8 scoops: 20 cups. k = 10 ÷ 4 = 2.5.
=> 2. k = 4 ÷ 10 = 0.4.
=> 3. No. k depends on the order. Powder to water gives 2.5. Water to powder gives 0.4.
::: teacher
label: Misconception target
"k is always the bigger number divided by the smaller." Ask: which quantity is multiplied by k to get the other?
:::

## CHECKIN

## ext | RN3 — Rational Numbers, Section 3
Kai writes −{2/3} + {1/2} = {−1/5}. He added the tops and the bottoms.
1. Use the chips. Find the right answer.
2. Find (−1.5) × (−0.4).
3. Find −{3/4} ÷ {1/2}.
@viz chips pos=3 neg=4 pairs=3 title="Each chip = 1/6" result="−4/6 + 3/6 = [[−1/6]]"
(lines 4)
=> 1. Common denominator 6: −{4/6} + {3/6} = −{1/6}.
=> 2. 1.5 × 0.4 = 0.6. Two negatives: positive. Answer 0.6.
=> 3. −{3/4} × {2/1} = −{6/4} = −{3/2} (−1.5).
::: teacher
label: Misconception target
"−1/2 + 1/3 = 0/5" (adding tops and bottoms). Ask: are the chips the same size? Only same-size parts can be counted together.
:::

## ext | SR3 — Square Roots, Section 3
Ana says √60 ≈ 30. Ben says √60 ≈ 7.5, "halfway between 7 and 8."
1. Is Ana right? Check by squaring.
2. Use the lines. Is √60 closer to 7 or to 8?
3. Estimate √60 to one decimal. Check by squaring.
@viz srbench lo=7 hi=8 n=60 keydot=1 est="√60 ≈ [[7.7]]"
(lines 4)
=> 1. No. 30² = 900. Ana took half.
=> 2. 7² = 49 and 8² = 64. 60 is closer to 64. So √60 is closer to 8.
=> 3. √60 ≈ 7.7. 7.7² = 59.29 and 7.8² = 60.84. 7.7 is closer. Ben's 7.5 is too low (7.5² = 56.25).
::: teacher
label: Misconception target
"√50 ≈ 25" or "≈ 7.5 halfway." Have the student find where 60 sits between 49 and 64 on the top line, then drop down.
:::

## ext | PR3 — Proportional Reasoning, Section 3
6 L of paint covers 45 m² of wall.
1. Find k. Then fill in the table.
2. How much paint covers 120 m²?
@viz prk top="6,10,[[16]]" bottom="45,[[75]],120" toplabel="paint (L)" bottomlabel="wall (m²)" k="× [[7.5]]"
(lines 3)
=> 1. k = 45 ÷ 6 = 7.5 m² for each litre. 10 L: 7.5 × 10 = 75 m².
=> 2. a = b ÷ k = 120 ÷ 7.5 = 16 L. Check: 7.5 × 16 = 120 ✓.

## ext | RN4 — Rational Numbers, Section 4
Mia finds −3 + 4 × (−0.5)². She adds −3 + 4 first and gets 0.25.
1. Fill in the steps.
2. Estimate (−4.9) × 2.1 + 7.8. Then find it.
@viz flow steps="−3 + 4 × (−0.5)²|−3 + 4 × [[0.25]]|−3 + [[1]]|[[−2]]"
(lines 4)
=> 1. Power first: (−0.5)² = 0.25. Then 4 × 0.25 = 1. Then −3 + 1 = −2.
=> 2. Estimate: (−5) × 2 + 8 = −2. Exact: −10.29 + 7.8 = −2.49. Close to −2, so it is reasonable.

## ext | SR4 — Irrational Numbers, Section 4
Tess says π = 3.14 and √2 = 1.41 exactly.
1. Find 1.41². Is it 2?
2. Sort into the boxes: √2, 3.14, π, √49, 0.{bar:6}, −√3.
@viz srreal nat="[[√49]]" int="−4" rat="[[3.14]];[[0.{bar:6}]]" irr="[[√2]];[[π]];[[−√3]]" caption="−4 is done for you."
(lines 3)
=> 1. 1.41² = 1.9881. Not 2. So 1.41 is only close to √2.
=> 2. Natural: √49 = 7. Rational: 3.14 and 0.{bar:6} = {2/3}. Irrational: √2, π, −√3.
=> 3.14 and 1.41 are approximate. π and √2 are exact; their decimals never end or repeat.
::: teacher
label: Misconception target
"π = 3.14 exactly" / "1.41 is √2." Squaring 1.41 shows the gap. 3.14 is a rational number, so it cannot be π.
:::

## ext | PR4 — Proportional Reasoning, Section 4
3 painters take 8 h to paint a fence. Leo says 6 painters take 16 h.
1. Fill in the arrays. Is Leo right?
2. How long do 4 painters take?
3. Is this direct or inverse proportion?
@viz prwork cases="3,8;6,4" rowlabel="painters" collabel="h" labels="3 × 8 = 24;6 × [[4]] = 24"
(lines 4)
=> 1. No. The job is 24 painter-hours. 6 painters take 24 ÷ 6 = 4 h.
=> 2. 24 ÷ 4 = 6 h.
=> 3. Inverse. More painters, less time. a × b = 24 stays the same.
::: teacher
label: Misconception target
"More workers, more days." Ask: does the fence get bigger when more people help? The squares in the arrays stay at 24.
:::

## stretch | PR2 + RN4 — Proportional Reasoning and Estimating
Gas costs $1.45 for each litre. Sam buys 32.5 L.
1. Estimate the cost first.
2. Find the cost. Round to the cent.
3. Is cost proportional to litres? Give k.
@viz prk top="1,10,32.5" bottom="$1.45,[[$14.50]],[[$47.13]]" toplabel="gas (L)" bottomlabel="cost ($)" k="× 1.45" one=1
(lines 4)
=> 1. About 1.5 × 30 = $45 (or 1.5 × 32 = $48).
=> 2. 1.45 × 32.5 = 47.125 ≈ $47.13. Close to the estimate.
=> 3. Yes. Cost = 1.45 × litres. k = 1.45 dollars per litre.

## stretch | SR3 + SR4 + RN2 — Roots, Irrationals and the Number Line
A square garden has an area of 30 m².
1. Find the side to one decimal.
2. About how much fence goes around it?
3. Order from least to greatest: 5.4, √30, 5.{bar:4}, {11/2}.
@viz sqside n=5.48 grid=0 side="s" fill=plant fence=1 cell=20 labels="Area = 30 m²;Fence = ?"
(lines 5)
=> 1. 5² = 25 and 6² = 36. 30 is a bit closer to 25. √30 ≈ 5.5 (calculator: 5.477…).
=> 2. 4 × 5.48 ≈ 21.9 m. About 22 m of fence.
=> 3. 5.4 < 5.{bar:4} < √30 < {11/2}. (5.4, 5.444…, 5.477…, 5.5)
