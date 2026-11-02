---
title: Solving Equations
topic: solving-equations
strand: algebra
---
<!-- Gate: progressive blanking confirmed. Section 1 is mostly filled in. Section 4 is mostly blanks.
     Refutation-first on these. "Multiply only the fraction term by the LCD" (SE1). It comes back in SE3.
     "2(x + 3) = 2x + 3" with negative and fraction factors (SE2). It recurs from Grade 7.
     "Do it to one side only" (SE3). It recurs from Grade 7.
     "x = 8 is the answer" with no words or units (SE4).
     Section order: clearing fractions and decimals comes first (SE1). It turns later equations into Grade 7 ones.
     Brackets come next (SE2). They add a choice: distribute, or undo the factor first.
     Variables on both sides need both (SE3). Problems come last (SE4).
     Outcome 8A2. One variable. No inequalities. -->

## Pre-Knowledge Check
1. Solve 3x − 4 = 11.
2. Solve 5x + 2 = 2x + 14.
3. Simplify −3(x − 4).
4. Find the lowest common denominator of {1/4} and {1/6}.
5. Find 0.4 × 10 and 1.25 × 100.
6. Find 6 × {2/3}.

## Section 1: Clearing fractions and decimals
Learning target: I can clear fractions and decimals from an equation.

### Vocabulary
- rational coefficient :: a fraction or decimal in front of the variable :: in {1/2}x + 3 = 5, the coefficient is {1/2}
- equivalent equations :: equations with the same solution :: {1/2}x + 3 = 5 and x + 6 = 10
- multiple of an equation :: both sides multiplied by the same number :: 2 × ({1/2}x + 3) = 2 × 5
- LCD :: lowest common denominator: the smallest number every denominator goes into :: the LCD of {1/2} and {1/3} is 6
- clear the fractions :: multiply every term by the LCD so no fractions are left :: × 2 turns {1/2}x + 3 = 5 into x + 6 = 10

#### Double the balance
Look at the balance. The small bag holds half of x. It is {1/2}x.
@viz balance left="x/2;+3" right="+5" text="½x + 3 = 5" caption="Half a bag and 3 blocks balance 5 blocks."
Now double BOTH sides. Two half bags make one whole bag. The 3 blocks become 6. The 5 blocks become 10.
@viz balance left="x;+6" right="+10" text="x + 6 = 10" caption="Twice as much on each side. It still balances."
The new equation has no fraction. It is an equivalent equation. Both have the solution x = 4.

::: key Multiply both sides
Multiply or divide both sides by the same number (not 0). The new equation is **equivalent**. It has the same solution.
Any multiple of an equation is equivalent.
To clear fractions, multiply EVERY term on both sides by the LCD.
To clear decimals, multiply EVERY term by 10 (one decimal place) or 100 (two places).
:::

::: example Worked Example 1 — One fraction
Solve {1/2}x + 3 = 5.
@viz semult top="{1/2}x;+ 3;=;5" by="× 2" bottom="x;+ 6;=;10"
Step 1: The denominator is 2. Multiply every term by 2.
Step 2: 2 × {1/2}x = x. 2 × 3 = 6. 2 × 5 = 10. Now x + 6 = 10.
Step 3: Subtract 6 from both sides: x = 4.
Step 4: Check in the original: {1/2}(4) + 3 = 2 + 3 = 5. ✓
:::

::: misconception
WRONG: "Multiply only the fraction term by the LCD. {1/2}x + 3 = 5 becomes x + 3 = 5, so x = 2."
WHY: The 3 and the 5 were not doubled. Only one part of the balance changed. Check x = 2: {1/2}(2) + 3 = 4, not 5.
@viz semult top="{1/2}x;+ 3;=;5" by="× 2" bottom="x;+ 3;=;5" miss="2,4"
RIGHT: Multiply EVERY term on both sides. x + 6 = 10, so x = 4.
:::

::: example Worked Example 2 — Two denominators
Solve {1/2}x + {1/3} = 2.
@viz semult top="{1/2}x;+ {1/3};=;2" by="× 6" bottom="3x;+ 2;=;12"
Step 1: The denominators are 2 and 3. The LCD is 6.
Step 2: Multiply every term by 6. 6 × {1/2}x = 3x. 6 × {1/3} = 2. 6 × 2 = 12.
Step 3: Now 3x + 2 = 12. Subtract 2: 3x = 10.
Step 4: Divide by 3: x = {10/3}. A fraction answer is fine.
Step 5: Check: {1/2} × {10/3} = {5/3}. {5/3} + {1/3} = {6/3} = 2. ✓
:::
::: explain
In Worked Example 2, why does 6 clear both fractions?
(lines 2)
=> 6 is a multiple of 2 and of 3. So 6 × {1/2} and 6 × {1/3} are both whole numbers (3 and 2).
:::

#### A fraction of x
{1/3}x = 4 means one third of x is 4. Draw x as a bar in 3 equal parts.
@viz sebar parts=3 shade=1 value="4" rest="4" whole="x" note="x = 3 × 4 = 12"
Multiply both sides by 3: x = 12.

::: example Worked Example 3 — Decimals
Solve 0.4x + 1.2 = 2.
@viz semult top="0.4x;+ 1.2;=;2" by="× 10" bottom="4x;+ 12;=;20"
Step 1: Each decimal has one place. Multiply every term by 10.
Step 2: 4x + 12 = 20. Subtract 12: 4x = 8.
Step 3: Divide by 4: x = 2.
Step 4: Check: 0.4(2) + 1.2 = 0.8 + 1.2 = 2. ✓
:::

::: example Worked Example 4 — Two decimal places
Solve 0.25x − 1.5 = 0.75.
@viz semult top="0.25x;− 1.5;=;0.75" by="× 100" bottom="25x;− [[150]];=;75"
Step 1: 0.25 and 0.75 have two places. Multiply every term by 100.
Step 2: 25x − [[150]] = 75. Add 150: 25x = 225.
Step 3: Divide by 25: x = [[9]].
Step 4: Check: 0.25(9) − 1.5 = 2.25 − 1.5 = 0.75. ✓
:::

#### Is it equivalent?
Start with {1/2}x + 3 = 5. Was the same thing done to every term on both sides?
| New equation | What happened | Equivalent? |
|---|---|---|
| x + 6 = 10 | × 2 on every term | Yes |
| 2x + 12 = 20 | × 4 on every term | Yes |
| {1/2}x = 2 | − 3 on both sides | Yes |
| x + 3 = 5 | × 2 on the x-term only | [[No]] |
@viz flow steps="½x + 3 = 5|× 2: x + 6 = 10|× 2 again: 2x + 12 = 20|all have x = 4"

::: try
1. Solve {1/3}x + 2 = 5. [[× 3: x + 6 = 15. x = 9.]]
@viz semult top="{1/3}x;+ 2;=;5" by="× 3" bottom="x;+ [[6]];=;[[15]]"
2. Solve {x/4} − 1 = 2. [[× 4: x − 4 = 8. x = 12.]]
3. Solve {2/5}x = 6. [[× 5: 2x = 30. x = 15.]]
@viz sebar parts=5 shade=2 value="3" whole="x" note="x = [[15]]"
4. Solve 0.3x + 0.6 = 2.4. [[× 10: 3x + 6 = 24. 3x = 18. x = 6.]]
5. Solve {1/2}x − {1/4} = 1. [[× 4: 2x − 1 = 4. 2x = 5. x = {5/2}.]]
6. Ben solves {x/5} + 2 = 4. He writes x + 2 = 20. Fix his mistake. [[He did not multiply the 2 by 5. x + 10 = 20, so x = 10.]]
:::
::: retrieval
1. Solve 4x − 7 = 2x + 5.
=> 2x − 7 = 5. 2x = 12. x = 6.
2. Find −{1/2} + {1/3}.
=> −{3/6} + {2/6} = −{1/6}
3. Simplify (3x + 2) − (x − 5).
=> 3x + 2 − x + 5 = 2x + 7
4. Find {2/3} of 18.
=> 18 ÷ 3 = 6. 6 × 2 = 12.
5. ★ Stretch: Solve {x/2} + {x/3} = 5.
=> × 6: 3x + 2x = 30. 5x = 30. x = 6.
:::

## Section 2: Brackets
Learning target: I can solve equations with brackets, even with negative or fraction factors.

### Vocabulary
- distributive property :: multiply EVERY term in the brackets :: 3(x + 2) = 3x + 6
- factor :: the number in front of the brackets :: in −2(x − 3), the factor is −2
- expand :: write without brackets :: −2(x − 3) expands to −2x + 6

#### Every term gets the factor
3(x + 2) is 3 groups of (x + 2). That is 3x + 6.
@viz tilerows rows="x;+2 | x;+2 | x;+2" labels="Group 1;Group 2;Group 3" notes=";;3x + 6"
A negative factor works the same way. Use the sign rules for each term.
@viz sedist factor="−2" terms="x;− 3" result="−2x;+ 6"
−2 × x = −2x. −2 × (−3) = +6. So −2(x − 3) = −2x + 6.
A fraction factor works the same way too.
@viz sedist factor="{1/2}" terms="x;+ 8" result="{1/2}x;+ 4"

::: misconception
WRONG: "{1/2}(x + 8) = {1/2}x + 8." Only x got the factor.
WHY: Half of (x + 8) is half of x AND half of 8. Look at the tiles for 2(x + 3): each group has 3 small tiles.
@viz tilerows rows="x;+3 | x;+3" labels="Group 1;Group 2" notes=";6 small tiles, not 3"
RIGHT: Multiply EVERY term. {1/2}(x + 8) = {1/2}x + 4.
:::

::: key Two ways with brackets
Way 1: distribute, then solve.
Way 2: undo the factor first. Divide both sides by the factor, or multiply by its denominator.
Both ways give the same answer. Pick the one with nicer numbers.
:::

::: example Worked Example 1 — A negative factor
Solve −2(x − 3) = 10.
@viz sedist factor="−2" terms="x;− 3" result="−2x;+ 6"
Way 1: Distribute: −2x + 6 = 10. Subtract 6: −2x = 4. Divide by −2: x = −2.
Way 2: Divide both sides by −2: x − 3 = −5. Add 3: x = −2.
Check: −2(−2 − 3) = −2(−5) = 10. ✓
:::
::: explain
In Worked Example 1, why can we divide both sides by −2 first?
(lines 2)
=> −2(x − 3) ÷ (−2) is x − 3. Dividing both sides by the same non-zero number keeps the balance.
:::

::: example Worked Example 2 — A fraction factor
Solve {1/3}(x + 6) = 4.
@viz sebar parts=3 shade=1 value="4" rest="4" whole="x + 6" note="x + 6 = [[12]]"
Step 1: One third of (x + 6) is 4. So all of x + 6 is 3 × 4.
Step 2: Multiply both sides by 3: x + 6 = [[12]].
Step 3: Subtract 6: x = 6.
Step 4: Check: {1/3}(6 + 6) = {1/3}(12) = 4. ✓
:::

::: example Worked Example 3 — A decimal factor
Solve 0.5(x − 4) = 3.5.
@viz sedist factor="0.5" terms="x;− 4" result="0.5x;− [[2]]"
Step 1: Distribute: 0.5x − [[2]] = 3.5.
Step 2: Add 2: 0.5x = [[5.5]].
Step 3: Divide by 0.5 (or multiply by 2): x = [[11]].
Step 4: Check: 0.5(11 − 4) = 0.5(7) = 3.5. ✓
:::

::: example Worked Example 4 — Two brackets
Solve 3(x − 1) − 2(x + 4) = 1.
@viz sedist factor="−2" terms="x;+ 4" result="−2x;[[− 8]]"
Step 1: 3(x − 1) = 3x − 3. The second factor is −2: −2(x + 4) = −2x − 8.
Step 2: 3x − 3 − 2x − 8 = 1. Like terms: [[x − 11]] = 1.
Step 3: Add 11: x = [[12]].
Step 4: Check: 3(11) − 2(16) = 33 − 32 = 1. ✓
:::

::: example Worked Example 5 — A fraction answer
Solve 4(x + 2) = 3.
@viz flow steps="4(x + 2) = 3|4x + 8 = 3|4x = [[−5]]|x = [[−5/4]]"
Step 1: Distribute: 4x + 8 = 3.
Step 2: Subtract 8: 4x = [[−5]].
Step 3: Divide by 4: x = [[−{5/4}]], or −1.25.
Step 4: Check: 4(−1.25 + 2) = 4(0.75) = 3. ✓
:::

::: try
1. Solve 5(x − 2) = 15. [[x − 2 = 3. x = 5.]]
2. Solve −3(x + 4) = 6. [[÷ −3: x + 4 = −2. x = −6.]]
@viz sedist factor="−3" terms="x;+ 4" result="[[−3x]];[[− 12]]"
3. Solve {1/2}(x − 6) = 5. [[× 2: x − 6 = 10. x = 16.]]
@viz sebar parts=2 shade=1 value="5" whole="x − 6"
4. Solve 0.2(x + 5) = 3. [[× 5: x + 5 = 15. x = 10.]]
5. Solve 6(x − 1) = 9. [[6x − 6 = 9. 6x = 15. x = {5/2} = 2.5.]]
6. Kim writes −4(x − 2) = −4x − 8. Fix her mistake. [[−4 × (−2) = +8. So −4x + 8.]]
:::
::: retrieval
1. Solve {1/4}x + 3 = 5.
=> × 4: x + 12 = 20. x = 8.
2. Solve 0.6x = 4.2.
=> × 10: 6x = 42. x = 7.
3. Find {3/4} − {5/6}.
=> {9/12} − {10/12} = −{1/12}
4. Solve 2x + 9 = 5x + 3.
=> 9 = 3x + 3. 6 = 3x. x = 2.
5. ★ Stretch: Solve {2/3}(x − 3) = 4.
=> × 3: 2(x − 3) = 12. x − 3 = 6. x = 9.
:::

## Section 3: Variables on both sides
Learning target: I can solve equations with x on both sides.

### Vocabulary
- variables on both sides :: an x-term on the left and on the right :: 1.5x + 2 = 0.5x + 6
- collect the x-terms :: get every x-term on one side :: subtract 0.5x from both sides

#### The same steps as Grade 7
In Grade 7 you solved 5x + 2 = 3x + 10. You took 3x off both sides.
@viz balance left="5x;+2" right="3x;+10"
Now the numbers can be fractions or decimals. Clear them first. Then solve like Grade 7.
@viz flow steps="Clear fractions or decimals|Expand brackets|x-terms to one side|Numbers to the other|Divide|Check" width=680

::: example Worked Example 1 — Decimals on both sides
Solve 1.5x + 2 = 0.5x + 6.
@viz semult top="1.5x;+ 2;=;0.5x;+ 6" by="× 10" bottom="15x;+ 20;=;5x;+ 60"
Way 1: Subtract 0.5x from both sides: x + 2 = 6. So x = 4.
Way 2: Multiply every term by 10: 15x + 20 = 5x + 60. Subtract 5x: 10x + 20 = 60. 10x = 40. x = 4.
Check: 1.5(4) + 2 = [[8]]. 0.5(4) + 6 = [[8]]. ✓
:::

::: misconception
WRONG: "Do it to one side only. 0.8x + 3 = 0.3x + 5 becomes 0.5x + 3 = 0.3x + 5."
WHY: 0.3x came off the left side only. The right side still has 0.3x. The balance tips.
@viz flow steps="0.8x + 3 = 0.3x + 5|− 0.3x on the LEFT only ✗|0.5x + 3 = 0.3x + 5"
RIGHT: Subtract 0.3x from BOTH sides: 0.5x + 3 = 5. 0.5x = 2. x = 4. Check: 3.2 + 3 = 6.2 and 1.2 + 5 = 6.2. ✓
:::

::: example Worked Example 2 — Fractions on both sides
Solve {1/2}x + 1 = {1/3}x + 2.
@viz semult top="{1/2}x;+ 1;=;{1/3}x;+ 2" by="× 6" bottom="3x;+ [[6]];=;2x;+ [[12]]"
Step 1: The LCD of 2 and 3 is 6. Multiply every term on BOTH sides by 6.
Step 2: 3x + [[6]] = 2x + [[12]].
Step 3: Subtract 2x: x + 6 = 12. So x = [[6]].
Step 4: Check: {1/2}(6) + 1 = [[4]]. {1/3}(6) + 2 = [[4]]. ✓
@viz balance left="3x;+6" right="2x;+12"
:::

::: misconception
WRONG: "{1/2}x + 1 = {1/3}x + 2. × 6 on the left gives 3x + 6 = {1/3}x + 2."
WHY: Only the left side was multiplied. The right side must be multiplied by 6 too.
@viz semult top="{1/2}x;+ 1;=;{1/3}x;+ 2" by="× 6" bottom="3x;+ 6;=;{1/3}x;+ 2" miss="4,5"
RIGHT: Every term on both sides: 3x + 6 = 2x + 12.
:::

::: example Worked Example 3 — A negative fraction answer
Solve 3x − 2 = 7x + 1.
@viz balance left="3x;-2" right="7x;+1"
Step 1: Subtract 3x from both sides: −2 = [[4x + 1]].
Step 2: Subtract 1: [[−3]] = 4x.
Step 3: Divide by 4: x = [[−{3/4}]].
Step 4: Check: 3(−{3/4}) − 2 = −{9/4} − {8/4} = −{17/4}. 7(−{3/4}) + 1 = −{21/4} + {4/4} = −{17/4}. ✓
:::
::: explain
In Worked Example 3, why do we subtract 3x and not 7x?
(lines 2)
=> 3x is the smaller x-term. Taking it away leaves 4x, which is positive. Subtracting 7x also works, but it leaves −4x.
:::

::: example Worked Example 4 — Brackets and decimals
Solve 0.4(x + 5) = 0.2x + 3.
@viz sedist factor="0.4" terms="x;+ 5" result="[[0.4x]];[[+ 2]]"
Step 1: Distribute: [[0.4x + 2]] = 0.2x + 3.
Step 2: Subtract 0.2x: [[0.2x + 2 = 3]].
Step 3: Subtract 2: 0.2x = [[1]]. Divide by 0.2: x = [[5]].
Step 4: Check: 0.4(10) = [[4]]. 0.2(5) + 3 = [[4]]. ✓
:::

::: try
1. Solve 2.5x + 1 = 0.5x + 9. [[2x + 1 = 9. 2x = 8. x = 4.]]
2. Solve {1/4}x + 2 = {1/2}x − 1. [[× 4: x + 8 = 2x − 4. 12 = x.]]
@viz semult top="{1/4}x;+ 2;=;{1/2}x;− 1" by="× 4" bottom="[[x]];+ [[8]];=;[[2x]];− [[4]]"
3. Solve 5x + 3 = 2x + 4. [[3x + 3 = 4. 3x = 1. x = {1/3}.]]
4. Solve 0.3(x − 2) = 0.1x + 1. [[0.3x − 0.6 = 0.1x + 1. 0.2x = 1.6. x = 8.]]
5. Solve 2(x − 1) = −3(x + 4). [[2x − 2 = −3x − 12. 5x = −10. x = −2.]]
6. Noor solves 0.8x + 3 = 0.3x + 5. Her first step is 1.1x + 3 = 5. Fix her mistake.
@viz flow steps="0.8x + 3 = 0.3x + 5|1.1x + 3 = 5 ✗|?"
[[She added 0.3x. Subtract 0.3x from both sides: 0.5x + 3 = 5. 0.5x = 2. x = 4.]]
:::
::: retrieval
1. Solve {1/3}(x − 6) = 2.
=> × 3: x − 6 = 6. x = 12.
2. Solve 0.5x − 1.5 = 2.
=> × 10: 5x − 15 = 20. 5x = 35. x = 7.
3. Write {3/8} as a decimal.
=> 3 ÷ 8 = 0.375
4. Add (2x² + 3x) + (x² − 5x).
=> 3x² − 2x
5. ★ Stretch: Solve {x + 1/2} = {x − 2/3}.
=> × 6: 3(x + 1) = 2(x − 2). 3x + 3 = 2x − 4. x = −7.
=> Check: {−6/2} = −3 and {−9/3} = −3. ✓
:::

## Section 4: Equation problems
Learning target: I can solve a problem with an equation and check it.

### Vocabulary
- let x = :: say what the variable stands for :: let x = the number of kilometres
- rate :: a cost or amount for each one :: $1.75 per km
- verify :: check that the answer makes the equation and the story true :: 3.50 + 1.75(8) = 17.50

#### From story to equation
@viz flow steps="Let x = …|Write each side|Make an equation|Clear fractions or decimals|Solve|Verify and answer in words" width=680

::: example Worked Example 1 — A taxi fare
A taxi costs $3.50 to start plus $1.75 per km. Jen's fare is $17.50. How far did she ride?
@viz receipt title="Taxi fare" items="Start fee:$3.50;x km at $1.75 per km:1.75x;Fare:$17.50"
Step 1: Let x = the number of km. The equation is 3.50 + 1.75x = 17.50.
Step 2: Multiply every term by 100: [[350]] + 175x = [[1750]].
Step 3: Subtract 350: 175x = [[1400]]. Divide by 175: x = [[8]].
Step 4: Verify: 1.75 × 8 = [[14.00]]. 3.50 + 14.00 = 17.50. ✓
Jen rode [[8 km]].
:::

::: example Worked Example 2 — Two gym plans
FitNow costs $40 to join plus $22.50 a month. PowerGym costs $30.50 a month and nothing to join. When do they cost the same?
| Months | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| FitNow ($) | 40 | 62.50 | 85 | 107.50 | 130 | [[152.50]] |
| PowerGym ($) | 0 | 30.50 | 61 | 91.50 | 122 | [[152.50]] |
@viz flow steps="Let x = months|FitNow: 40 + 22.5x|PowerGym: 30.5x|40 + 22.5x = 30.5x"
Step 1: Let x = the number of months. 40 + 22.5x = 30.5x.
Step 2: Subtract 22.5x from both sides: 40 = [[8x]].
Step 3: Divide by 8: x = [[5]].
Step 4: Verify: 40 + 22.5(5) = [[152.50]]. 30.5(5) = [[152.50]]. ✓
They cost the same after [[5 months]]. After that, [[FitNow]] is cheaper.
:::

::: example Worked Example 3 — Temperature
The formula F = 1.8C + 32 changes °C to °F. A spring day in Lethbridge is 50 °F. What is that in °C?
@viz thermo min=0 max=60 step=10 values="50" labels="Lethbridge (°F)"
Step 1: Put in F = 50: [[50 = 1.8C + 32]].
Step 2: Subtract 32: [[18]] = 1.8C.
Step 3: Divide by 1.8: C = [[10]].
Step 4: Verify: 1.8(10) + 32 = 18 + 32 = 50. ✓ It is [[10 °C]].
:::

::: example Worked Example 4 — A recipe
Sam makes {3/4} of a bannock recipe. He uses 1{1/2} cups of flour. How much flour is in the full recipe?
@viz sebar parts=4 shade=3 value="[[{1/2}]]" whole="x cups (full recipe)" note="{3/4}x = 1{1/2}"
Step 1: Let x = cups in the full recipe. {3/4}x = {3/2}.
Step 2: Multiply every term by 4: 3x = [[6]].
Step 3: x = [[2]]. The full recipe uses [[2 cups]].
Step 4: Verify: {3/4} × 2 = {6/4} = 1{1/2}. ✓
:::

::: example Worked Example 5 — Sharing a cost
Four friends share the cost of pizza and a $6 delivery fee. Each pays $8.25. What did the pizza cost?
@viz tape parts="4:each $8.25" values="8.25" total="x + 6"
Step 1: Let x = the pizza cost. [[{1/4}(x + 6) = 8.25]].
Step 2: Multiply both sides by 4: x + 6 = [[33]].
Step 3: Subtract 6: x = [[27]]. The pizza cost [[$27]].
Step 4: Verify: (27 + 6) ÷ 4 = [[8.25]]. ✓
:::

::: example Worked Example 6 — Perimeter
A triangle has sides {x/2}, {x/2} + 1 and x. Its perimeter is 13 cm. Find each side.
@viz polygon pts="0,0;6,0;2.25,2.9" sides="x;x/2 + 1;x/2" unit=34
Step 1: {x/2} + {x/2} + 1 + x = 13. Like terms: [[2x + 1]] = 13.
Step 2: 2x = [[12]]. x = [[6]].
Step 3: The sides are [[3 cm]], [[4 cm]] and [[6 cm]].
Step 4: Verify: 3 + 4 + 6 = 13. ✓
:::

::: misconception
WRONG: "x = 6. Done."
WHY: Ava saves $20 a week. She wants $120. How many weeks? 20x = 120 gives x = 6. But "x = 6" answers the equation, not the story. A wrong equation can still give a neat x.
@viz flow steps="x = 6|Check in the story|Ava saves for 6 weeks"
RIGHT: Put the answer back in the story. Then answer in words with units: "Ava saves for 6 weeks."
:::
::: explain
Why do we check the answer in the story and not only in the equation?
(lines 2)
=> The equation might be wrong. The story shows if the answer really works.
:::

::: try
1. Plan A costs $20 a month plus $2.50 per GB. Plan B costs $32 a month plus $1 per GB. When do they cost the same?
@viz balance left="x;x;x/2;+20" right="x;+32" text="20 + 2.5x = 32 + x" caption="Each whole bag is one GB."
[[20 + 2.5x = 32 + x. 1.5x = 12. x = 8 GB. Both cost $40.]]
2. A taxi costs $3.50 plus $1.75 per km. The fare is $24.50. How far was the ride? [[1.75x = 21. x = 12 km.]]
3. Use F = 1.8C + 32. A cold Calgary morning is −4 °F. What is it in °C? [[−4 = 1.8C + 32. −36 = 1.8C. C = −20 °C.]]
4. A rectangle is 1.5x long and x wide. Its perimeter is 25 m. Find its length and width.
@viz polygon pts="0,0;6,0;6,4;0,4" sides="1.5x;x;;" unit=30
[[2(1.5x) + 2x = 25. 5x = 25. x = 5. Width 5 m, length 7.5 m.]]
5. Three friends share a cabin bill and a $15 cleaning fee. Each pays $105. What was the cabin bill? [[{1/3}(x + 15) = 105. x + 15 = 315. x = $300.]]
:::
::: retrieval
1. Solve {1/2}x + 4 = 9.
=> × 2: x + 8 = 18. x = 10.
2. Solve −2(x + 1) = 8.
=> x + 1 = −4. x = −5.
3. Solve 0.6x + 1 = 0.2x + 3.
=> 0.4x = 2. x = 5.
4. Find the GST (5%) on $40.
=> 0.05 × 40 = $2
5. ★ Stretch: Two numbers add to 20. One is {2/3} of the other. Find them.
=> x + {2/3}x = 20. × 3: 3x + 2x = 60. x = 12. The numbers are 12 and 8.
:::

## Unit Synthesis
1. Solve {2/3}x − 1 = 5. Verify.
@viz semult top="{2/3}x;− 1;=;5" by="× 3" bottom="2x;− 3;=;15"
=> × 3: 2x − 3 = 15. 2x = 18. x = 9.
=> Verify: {2/3}(9) − 1 = 6 − 1 = 5. ✓
2. Solve −3(x − 2) = 2x + 1.
=> −3x + 6 = 2x + 1. 5 = 5x. x = 1.
=> Verify: −3(−1) = 3 and 2(1) + 1 = 3. ✓
3. Solve 0.2x + 1.4 = 0.5x − 0.1.
=> × 10: 2x + 14 = 5x − 1. 15 = 3x. x = 5.
=> Verify: 1 + 1.4 = 2.4 and 2.5 − 0.1 = 2.4. ✓
4. A taxi costs $3.50 plus $1.75 per km. A second company charges $2 per km and nothing to start. When do they cost the same?
=> 3.50 + 1.75x = 2x. 3.50 = 0.25x. x = 14 km. Both cost $28.
5. Ali says {1/4}x + 2 = 3 becomes x + 2 = 12. Explain his mistake.
=> He multiplied only the fraction term and the 3 by 4. The 2 must become 8: x + 8 = 12, so x = 4.
6. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Clearing fractions and decimals
Multiply EVERY term on both sides by the same number. The new equation is equivalent.
Fractions: use the LCD. {1/2}x + {1/3} = 2 → × 6 → 3x + 2 = 12.
Decimals: × 10 for one place, × 100 for two. 0.4x + 1.2 = 2 → 4x + 12 = 20.
:::
@viz semult top="{1/2}x;+ 3;=;5" by="× 2" bottom="x;+ 6;=;10"

::: key Brackets
Multiply EVERY term in the brackets by the factor. Watch the signs.
−2(x − 3) = −2x + 6. {1/2}(x + 8) = {1/2}x + 4.
Or undo the factor: {1/3}(x + 6) = 4 → x + 6 = 12.
:::
@viz sedist factor="−2" terms="x;− 3" result="−2x;+ 6"

::: key Variables on both sides
Clear fractions or decimals. Expand. Get the x-terms on one side by doing the same to BOTH sides. Divide.
Answers can be fractions, decimals or negative: x = −{3/4} is fine.
:::
@viz balance left="3x;+6" right="2x;+12" text="3x + 6 = 2x + 12"

::: key Problems
Let x = … Write the equation. Clear, solve, verify in the story. Answer in words with units.
:::
@viz flow steps="Let x = …|Equation|Solve|Verify|Answer in words"

| Mistake | Fix |
|---|---|
| {1/2}x + 3 = 5 → x + 3 = 5 | × 2 on every term: x + 6 = 10. |
| {1/2}(x + 8) = {1/2}x + 8 | Every term in the brackets: {1/2}x + 4. |
| −2(x − 3) = −2x − 6 | −2 × (−3) = +6. |
| Taking 0.3x off one side only | Do the same to both sides. |
| Stopping at x = 8 | Check in the story. Answer in words. |
