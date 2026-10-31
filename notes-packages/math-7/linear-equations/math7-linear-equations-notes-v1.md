---
title: Linear Equations
topic: linear-equations
strand: algebra
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "2x + 3x = 5x²" / "3x + 2 = 5x" and "2(x + 3) = 2x + 3" (LE1).
     "Do it to one side only" (LE2). "Move a term across and keep its sign" (LE3).
     "If x works in my last line, it is right" (LE4, not in the course list; added because the draft
     asks students to verify in the original and in equivalent equations).
     Section order: tiles, like terms, zero pairs and the distributive property first (LE1), because every
     equation later is simplified before it is solved. Then the balance: doing the same thing to both sides
     makes equivalent equations, and one- and two-step equations with integer answers (LE2). Then x on both
     sides, which needs both earlier sections: simplify, remove an x-term from both sides, then finish as in
     LE2 (LE3). Last, verifying in the original and in an equivalent equation, and word problems that become
     x-on-both-sides equations (LE4). Outcome 7A2. Integers only: no fraction coefficients, no inequalities. -->

## Pre-Knowledge Check
1. Find 3 × n + 2 when n = 4.
2. Solve n + 7 = 12.
3. Solve 4 × n = 20.
4. Find −3 + 8 and −2 − 5.
5. Find 2 × (5 + 3) two ways.
6. A balance has 6 blocks on each side. You add 2 blocks to the left side. What must you do to keep it level?

## Section 1: Simplifying expressions
Learning target: I can combine like terms and use the distributive property.

### Vocabulary
- variable :: a letter that stands for a number :: x in 3x + 2
- term :: one part of an expression, split by + or − :: 3x + 2 has the terms 3x and 2
- coefficient :: the number in front of the variable :: in 3x, the coefficient is 3
- constant :: a term with no variable :: in 3x + 2, the constant is 2
- expression :: terms joined by + or −, with no = sign :: 3x + 2
- like terms :: terms with the same variable part :: 2x and 5x are like terms. 2x and 5 are not.
- zero pair :: two opposite tiles that add to 0 :: x + (−x) = 0 and 1 + (−1) = 0
- distributive property :: multiply EVERY term in the brackets :: 2(x + 3) = 2x + 6

#### Algebra tiles
A tall tile is **x**. A small square tile is **1**. Red tiles are negative.
@viz tiles terms="x;-x;+1;-1" caption="The tiles x, −x, +1 and −1."
3x + 2 is three x tiles and two 1 tiles.
@viz tiles terms="3x;+2" label="3x + 2"

#### Like terms
Like terms have the same variable part. Add like terms by adding the coefficients.
2x + 3x is 2 tall tiles and 3 tall tiles. That is 5 tall tiles.
@viz tiles terms="2x;3x" label="2x + 3x = 5x"
x-terms and numbers are not like terms. They stay apart.
@viz tiles terms="3x;+2" label="3x + 2 stays 3x + 2"

::: key Like terms
Add or subtract the coefficients. Keep the variable part the same.
4x + 2x = 6x. 7x − 3x = 4x. 5 + 2 = 7.
An x-term and a number do not combine: 4x + 2 stays 4x + 2.
:::

::: misconception
WRONG: "2x + 3x = 5x²" and "3x + 2 = 5x."
WHY: 2x + 3x is 5 tiles that are all x. Adding does not make x². And 3x + 2 has two kinds of tiles. You can't count them as one kind.
@viz tiles terms="2x;3x" label="5 x tiles: 5x, not 5x²"
@viz tiles terms="3x;+2" label="3 x tiles and 2 small tiles"
RIGHT: 2x + 3x = 5x. 3x + 2 stays 3x + 2.
:::

#### Zero pairs
A tile and its opposite make a **zero pair**. A zero pair adds to 0. You can take it away.
@viz tilerows rows="x!;-x! = 0 | +1!;-1! = 0" labels="x + (−x);1 + (−1)"

::: example Worked Example 1 — Zero pairs
Simplify 3x + 4 − x − 6.
@viz tilerows rows="3x;+4;-x;-6 | 2x;x!;-x!;+4!;-4!;-2" labels="Start;Zero pairs" notes=";2x − 2"
Step 1: Group like terms: 3x − x and 4 − 6.
Step 2: One x and one −x make a zero pair. 3x − x = 2x.
Step 3: Four + tiles and four − tiles make zero pairs. 4 − 6 = −2.
Step 4: The answer is 2x − 2.
:::
::: explain
In Worked Example 1, why can we take away the crossed-out tiles?
(lines 2)
=> Each crossed-out pair adds to 0. Taking away 0 does not change the expression.
:::

#### The distributive property
2(x + 3) means 2 groups of (x + 3).
@viz tilerows rows="x;+3 | x;+3" labels="Group 1;Group 2" notes="x + 3;x + 3"
Count all the tiles. There are 2 x tiles and 6 small tiles. So 2(x + 3) = 2x + 6.
Multiply BOTH terms by 2. 2 × x = 2x. 2 × 3 = 6.

::: misconception
WRONG: "2(x + 3) = 2x + 3."
WHY: The 2 multiplied only the x. Look at the 2 groups. Each group has 3 small tiles.
@viz tiles terms="2x;+3" label="2x + 3 is missing 3 small tiles"
RIGHT: Multiply BOTH terms in the brackets. 2(x + 3) = 2x + 6.
:::

::: example Worked Example 2 — A negative number in front
Simplify −3(x − 2).
@viz tilerows rows="x;-2 | x;-2 | x;-2 | -3x;+6" labels="Group 1;Group 2;Group 3;Opposite" notes=";;3(x − 2) = 3x − 6;−3(x − 2) = −3x + 6"
Step 1: 3(x − 2) is 3 groups of (x − 2). That is 3x − 6.
Step 2: The − sign makes the opposite. Flip every tile: −3x + 6.
Step 3: Check with the integer rules. −3 × x = −3x. −3 × (−2) = +6.
So −3(x − 2) = −3x + 6.
:::
::: explain
In Worked Example 2, why is the 6 positive?
(lines 2)
=> −3 × (−2) is a negative times a negative. That gives a positive: +6.
:::

::: example Worked Example 3 — Simplify one side of an equation
Simplify the left side: 2(x + 4) + 3x = 18.
@viz tilerows rows="x;+4 | x;+4 | 3x" labels="2(x + 4);;+ 3x" notes=";;[[5x + 8]]"
Step 1: Distribute: 2(x + 4) = 2x + 8.
Step 2: Add the like terms: 2x + 3x = [[5x]].
Step 3: The equation is now 5x + 8 = 18.
:::

::: try
1. Simplify 4x + 5x. [[9x]]
2. Simplify 6x − 2x + 3. [[4x + 3]]
3. Simplify 5 + 2x − 7 + x.
@viz tiles terms="+5;2x;-7;x"
[[3x − 2]]
4. Simplify 3(x + 5). [[3x + 15]]
5. Simplify −2(x + 4). [[−2x − 8]]
6. Zoe says 4x + 3 = 7x. Is she right? [[No. 4x and 3 are not like terms. It stays 4x + 3.]]
:::
::: retrieval
1. Find −6 + 2.
=> −4
2. Find (−4) × (−5).
=> 20
3. Find −18 ÷ 3.
=> −6
4. Find 2 + 3 × 4.
=> 2 + 12 = 14
5. ★ Stretch: Simplify 4(x − 3) − 2(x − 5).
=> 4x − 12 − 2x + 10 = 2x − 2
:::

## Section 2: Keeping the balance
Learning target: I can do the same thing to both sides to solve an equation.

### Vocabulary
- equation :: two expressions that are equal, with an = sign :: 2x + 3 = 11
- solution :: the value of x that makes the equation true :: x = 4 makes 2x + 3 = 11 true
- solve :: find the solution :: 2x + 3 = 11, so x = 4
- equivalent equations :: equations with the same solution :: 2x + 3 = 11 and 2x = 8
- inverse operation :: the operation that undoes another :: − 3 undoes + 3. ÷ 2 undoes × 2.

#### An equation is a balance
An equation is like a balance. Both sides weigh the same.
@viz balance left="2x;+3" right="+11" caption="Each bag holds x blocks. Two bags and 3 blocks balance 11 blocks."
Take 3 blocks off BOTH sides. It stays level.
@viz balance left="2x" right="+8" caption="Two bags balance 8 blocks."

::: key Keeping the balance
Do the same thing to both sides.
Add or subtract the same number, or the same x-term.
Multiply or divide both sides by the same number (not 0).
The new equation is an **equivalent equation**. It has the same solution.
:::

::: misconception
WRONG: "Do it to one side only. 2x + 3 = 11, so 2x = 11."
WHY: The left side lost 3 blocks. The right side did not. Now the right side is heavier.
@viz balance left="2x" right="+11" text="2x = 11 is not level" caption="3 blocks came off the left only."
RIGHT: Take 3 from both sides. 2x + 3 − 3 = 11 − 3, so 2x = 8.
:::

::: example Worked Example 1 — Two steps on the balance
Solve 2x + 3 = 11.
@viz flow steps="2x + 3 = 11|− 3 on both sides|2x = 8|÷ 2 on both sides|x = [[4]]"
Step 1: Subtract 3 from both sides. That is the inverse operation of + 3. Now 2x = 8.
Step 2: Divide both sides by 2. Each bag holds x = [[4]].
Step 3: Check: 2([[4]]) + 3 = 8 + 3 = 11. ✓
:::
::: explain
In Worked Example 1, why do we subtract 3 before we divide by 2?
(lines 2)
=> The 3 blocks are not in the bags. Take them off first. Then the bags are alone on one side.
:::

::: example Worked Example 2 — Adding to both sides
Solve x − 5 = 3.
@viz tilerows rows="x;-5 = +3 | x;-5!;+5! = +3;+5" labels="Start;Add 5" notes=";x = [[8]]"
Step 1: The −5 is five red tiles. Add 5 to both sides.
Step 2: The left side has 5 zero pairs. They make 0. Only x is left.
Step 3: The right side is 3 + 5 = [[8]]. So x = [[8]].
:::

::: example Worked Example 3 — A negative solution
Solve 3x + 7 = 1.
@viz tilerows rows="3x;+7 = +1 | 3x;+7!;-7! = +1!;-1!;-6" labels="Start;Add −7" notes=";3x = [[−6]]"
Step 1: Subtract 7 from both sides. That is the same as adding −7.
Step 2: The left side is 3x. The right side is 1 − 7 = [[−6]].
Step 3: Divide both sides by 3: x = −6 ÷ 3 = [[−2]].
Step 4: Check: 3([[−2]]) + 7 = −6 + 7 = 1. ✓
:::

::: example Worked Example 4 — Dividing by a negative
Solve −4x = 12.
@viz tiles left="-4x" right="+12"
Step 1: −4x means −4 × x. Divide both sides by −4.
Step 2: x = 12 ÷ (−4) = [[−3]].
Step 3: Check: −4 × ([[−3]]) = 12. ✓
:::

::: example Worked Example 5 — Simplify first
Solve 2(x + 4) = 14.
@viz balance left="x;+4;x;+4" right="+14" text="2(x + 4) = 14" caption="2 groups of (x + 4) balance 14 blocks."
Step 1: Distribute: 2x + 8 = 14.
Step 2: Subtract 8 from both sides: 2x = [[6]].
Step 3: Divide both sides by 2: x = [[3]].
:::

#### Is it an equivalent equation?
Start with 2x + 3 = 11. Did we do the same thing to both sides?
| New equation | What happened | Equivalent? |
|---|---|---|
| 2x = 8 | − 3 on both sides | Yes |
| 2x + 5 = 13 | + 2 on both sides | Yes |
| 4x + 6 = 22 | × 2 on both sides | [[Yes]] |
| 3x + 3 = x + 11 | + x on both sides | [[Yes]] |
| 2x = 14 | + 3 on the right only | [[No]] |
@viz balance left="3x;+3" right="x;+11" caption="Add one x-bag to both sides. It still balances."

::: try
1. Solve x + 9 = 4. [[x = −5]]
@viz balance left="x;+9" right="+4"
2. Solve 4x − 3 = 17. [[4x = 20, so x = 5]]
3. Solve −2x + 1 = 9. [[−2x = 8, so x = −4]]
4. Solve 3(x − 2) = 12. [[3x − 6 = 12. 3x = 18. x = 6.]]
5. Is 5x − 4 = 16 equivalent to 5x = 20? [[Yes. Add 4 to both sides.]]
6. Mia solves x + 6 = 2. She writes x = 8. Fix her mistake.
@viz tiles left="x;+6" right="+2"
[[She added 6. Subtract 6 from both sides: x = 2 − 6 = −4.]]
:::
::: retrieval
1. Simplify 5x − 2 + x.
=> 6x − 2
2. Simplify 4(x − 2).
=> 4x − 8
3. Find −7 − (−3).
=> −7 + 3 = −4
4. Find 4² + 1.
=> 16 + 1 = 17
5. ★ Stretch: Write an equation with 2x in it. Its solution must be x = −3.
=> Answers vary. For example, 2x + 1 = −5.
:::

## Section 3: Solving with x on both sides
Learning target: I can solve an equation with x on both sides.

### Vocabulary
- opposite of a term :: the same term with the other sign :: the opposite of 3x is −3x
- x on both sides :: an equation with an x-term on the left and the right :: 5x + 2 = 3x + 10

#### Take x-bags off both sides
5x + 2 = 3x + 10 has bags on both sides.
@viz balance left="5x;+2" right="3x;+10"
Take 3 bags off both sides. It still balances. Now x is on one side only.
@viz balance left="2x;+2" right="+10" caption="Now it is a two-step equation, like Section 2."

::: key Solving with x on both sides
1. Simplify each side.
2. Get the x-terms on one side. Add or subtract an x-term on both sides.
3. Get the numbers on the other side.
4. Divide both sides by the coefficient.
5. Check in the original equation.
:::
@viz flow steps="Simplify each side|x-terms to one side|Numbers to the other side|Divide|Check" width=680

::: misconception
WRONG: "Move 2x across and keep its sign: 4x + 2x + 1 = 7."
WHY: Start with 4x + 1 = 2x + 7. The 2x left the right side. So 2x must come off the left side too. The term leaves one side as its opposite: −2x.
@viz tilerows rows="4x;+1 = 2x;+7 | 2x;2x!;+1 = 2x!;+7" labels="Start;− 2x" notes=";2x + 1 = 7"
RIGHT: 4x − 2x + 1 = 2x − 2x + 7. So 2x + 1 = 7, 2x = 6 and x = 3. Check: 4(3) + 1 = 13 and 2(3) + 7 = 13. ✓
:::

::: example Worked Example 1 — x on both sides
Solve 5x + 2 = 3x + 10.
@viz flow steps="5x + 2 = 3x + 10|− 3x: 2x + 2 = 10|− 2: 2x = [[8]]|÷ 2: x = [[4]]"
Step 1: Subtract 3x from both sides: 2x + 2 = 10.
Step 2: Subtract 2 from both sides: 2x = [[8]].
Step 3: Divide both sides by 2: x = [[4]].
Step 4: Check: 5([[4]]) + 2 = [[22]]. 3([[4]]) + 10 = [[22]]. ✓
:::
::: explain
In Worked Example 1, why do we subtract 3x and not 5x?
(lines 2)
=> 3x is the smaller x-term. Taking it away leaves 2x, which is positive. Subtracting 5x also works, but it leaves −2x.
:::

::: example Worked Example 2 — Brackets first
Solve 4(x − 1) = 2x + 6.
@viz balance left="x;-1;x;-1;x;-1;x;-1" right="2x;+6" text="4(x − 1) = 2x + 6" caption="4 groups of (x − 1) on the left."
Step 1: Distribute: 4x − 4 = 2x + 6.
Step 2: Subtract 2x from both sides: [[2x − 4 = 6]].
Step 3: Add 4 to both sides: 2x = [[10]].
Step 4: Divide both sides by 2: x = [[5]].
:::

::: example Worked Example 3 — A negative solution
Solve 2x + 9 = 5x + 15.
@viz balance left="2x;+9" right="5x;+15"
Step 1: Subtract 2x from both sides: 9 = 3x + 15.
Step 2: Subtract 15 from both sides: [[−6]] = 3x.
Step 3: Divide both sides by 3: x = [[−2]].
Step 4: Check: 2([[−2]]) + 9 = [[5]]. 5([[−2]]) + 15 = [[5]]. ✓
:::

::: example Worked Example 4 — A negative x-term
Solve 7 − 2x = x + 1.
@viz tilerows rows="+7;-2x = x;+1 | +7;-2x!;+2x! = x;2x;+1" labels="Start;Add 2x" notes=";7 = 3x + 1"
Step 1: Add 2x to both sides. The −2x and +2x make zero pairs.
Step 2: Now 7 = 3x + 1. Subtract 1 from both sides: [[6 = 3x]].
Step 3: Divide both sides by 3: x = [[2]].
:::
::: explain
In Worked Example 4, why did we ADD 2x?
(lines 2)
=> The left side had −2x. Adding 2x makes a zero pair, so the x-term is gone from the left.
:::

::: try
1. Solve 6x + 1 = 4x + 9. [[2x + 1 = 9. 2x = 8. x = 4.]]
@viz balance left="6x;+1" right="4x;+9"
2. Solve 3x − 5 = x + 7. [[2x − 5 = 7. 2x = 12. x = 6.]]
3. Solve 2x + 10 = 5x + 1. [[10 = 3x + 1. 9 = 3x. x = 3.]]
4. Solve 3(x + 2) = x − 4. [[3x + 6 = x − 4. 2x = −10. x = −5.]]
5. Solve 5 − x = 2x + 11. [[5 = 3x + 11. −6 = 3x. x = −2.]]
6. Raj solves 6x + 2 = 4x + 8. He writes 10x + 2 = 8. Fix his mistake.
@viz tilerows rows="6x;+2 = 4x;+8"
[[He kept the sign of 4x. Subtract 4x from both sides: 2x + 2 = 8. 2x = 6. x = 3.]]
:::
::: retrieval
1. Simplify −2(x − 5).
=> −2x + 10
2. Solve 3x + 4 = −8.
=> 3x = −12, so x = −4
3. Find 30% of 60.
=> 10% is 6. 30% is 18.
4. Find 2³.
=> 2 × 2 × 2 = 8
5. ★ Stretch: Solve 2(x + 3) + x = 5x − 4.
=> 3x + 6 = 5x − 4. 10 = 2x. x = 5.
:::

## Section 4: Checking solutions and word problems
Learning target: I can check a solution and use equations to solve problems.

### Vocabulary
- substitute :: put a number in place of the variable :: x = 4 in 3x + 2 gives 3(4) + 2
- verify :: check that a solution makes the equation true :: 5(4) + 2 = 22 and 3(4) + 10 = 22
- let x = :: say what the variable stands for :: let x = the number of GB

#### Verify a solution
Substitute the solution into the original equation. Work out each side. They must be equal.
Is x = 4 the solution of 5x + 2 = 3x + 10?
@viz balance left="5x;+2" right="3x;+10" text="Left [[22]], right [[22]]" caption="Put 4 blocks in every bag. Count each side."
Left: 5(4) + 2 = [[22]]. Right: 3(4) + 10 = [[22]]. They match. ✓
You can also check any equivalent equation. 2x + 2 = 10 gives 2(4) + 2 = [[10]]. ✓

::: key Verify
1. Substitute the solution into the ORIGINAL equation.
2. Work out the left side. Work out the right side.
3. Equal? It is the solution. Not equal? Look for a mistake.
Checking each equivalent equation shows WHERE a mistake is.
:::

::: misconception
WRONG: "x works in my last equation, so it must be right."
WHY: Leo solved 3(x + 2) = 2x + 9. His first step was 3x + 2 = 2x + 9. Then x = 7.
x = 7 works in 3x + 2 = 2x + 9. Both sides are 23. But check the original: 3(7 + 2) = 27 and 2(7) + 9 = 23.
@viz flow steps="3(x + 2) = 2x + 9 ✗|3x + 2 = 2x + 9 ✓|x = 7 ✓"
RIGHT: The mistake is in the first step. 3(x + 2) = 3x + 6. Then 3x + 6 = 2x + 9, so x = 3. Check: 3(3 + 2) = 15 and 2(3) + 9 = 15. ✓
:::

#### Solving word problems
@viz flow steps="Let x = …|Write each side|Make an equation|Solve|Verify and answer in words" width=680

::: example Worked Example 1 — Two phone plans
Plan A costs $20 a month plus $5 for each GB of data. Plan B costs $35 a month plus $2 for each GB. When do they cost the same?
@viz balance left="5x;+20" right="2x;+35" text="5x + 20 = 2x + 35" caption="Each bag is one GB."
Step 1: Let x = the number of GB.
Step 2: Plan A: 20 + 5x. Plan B: 35 + 2x.
Step 3: The plans cost the same: 20 + 5x = 35 + 2x.
Step 4: Subtract 2x from both sides: [[20 + 3x = 35]]. Subtract 20: 3x = [[15]]. So x = [[5]].
Step 5: Verify: 20 + 5([[5]]) = [[45]]. 35 + 2([[5]]) = [[45]]. ✓
Both plans cost [[$45]] for [[5]] GB.
| GB | 3 | 4 | 5 | 6 |
|---|---|---|---|---|
| Plan A ($) | 35 | 40 | [[45]] | 50 |
| Plan B ($) | 41 | 43 | [[45]] | 47 |
:::

::: example Worked Example 2 — Two ski hills
Sunpeak costs a $120 card plus $25 a day. Pine Ridge costs $55 a day. After how many days do they cost the same?
@viz flow steps="Let x = days|Sunpeak: 120 + 25x|Pine Ridge: 55x|120 + 25x = 55x"
Step 1: Subtract 25x from both sides: 120 = [[30x]].
Step 2: Divide both sides by 30: x = [[4]].
Step 3: Verify: 120 + 25([[4]]) = [[220]]. 55([[4]]) = [[220]]. ✓
They cost the same after [[4 days]]. After that, Sunpeak is cheaper.
:::

::: example Worked Example 3 — Saving money
Ava has $50 and saves $10 a week. Sam has $20 and saves $16 a week. When will they have the same amount?
@viz dnl top="0,1,2,3,4,5" bottom="$50,$60,$70,$80,$90,[[$100]]" toplabel="weeks" bottomlabel="Ava"
@viz dnl top="0,1,2,3,4,5" bottom="$20,$36,$52,$68,$84,[[$100]]" toplabel="weeks" bottomlabel="Sam"
Step 1: Let x = the number of weeks. 50 + 10x = 20 + 16x.
Step 2: Subtract 10x: [[50 = 20 + 6x]]. Subtract 20: [[30 = 6x]].
Step 3: x = [[5]]. They will each have [[$100]] after [[5]] weeks.
:::

::: example Worked Example 4 — Same perimeter
A square has sides of x + 1. A triangle has three sides of x + 3 and the same perimeter. Find x.
@viz polygon pts="0,0;3,0;3,3;0,3" sides="x + 1;x + 1;x + 1;x + 1" ticks="1,1,1,1" pts2="0,0;3.4,0;1.7,2.9" sides2="x + 3;x + 3;x + 3" ticks2="2,2,2" unit=34
Step 1: Square: 4(x + 1). Triangle: 3(x + 3).
Step 2: 4(x + 1) = 3(x + 3). Distribute: [[4x + 4 = 3x + 9]].
Step 3: Subtract 3x and subtract 4: x = [[5]].
Step 4: Verify: the square's side is [[6]], so its perimeter is [[24]]. The triangle's side is [[8]], so its perimeter is [[24]]. ✓
:::
::: explain
Why do we verify in the original equation and not only the last one?
(lines 2)
=> A mistake in an early step would carry on. The last line could work even if the answer is wrong.
:::

::: try
1. Verify that x = −2 is the solution of 3x + 7 = 1. [[3(−2) + 7 = −6 + 7 = 1. ✓]]
2. Is x = 3 the solution of 4x − 5 = 2x + 3? [[Left: 7. Right: 9. No. (The solution is x = 4.)]]
3. A bus ride costs $3. A rider card costs $40 a month, then $1 a ride. When do they cost the same?
@viz balance left="3x" right="x;+40" caption="Each bag is one ride."
[[3x = 40 + x. 2x = 40. x = 20 rides. Both cost $60.]]
4. A rectangle is x + 4 long and x wide. Its perimeter is 28. Find x.
@viz polygon pts="0,0;5,0;5,2.6;0,2.6" sides="x + 4;x;x + 4;x" unit=32
[[2(x + 4) + 2x = 28. 4x + 8 = 28. 4x = 20. x = 5. Check: 9 + 5 + 9 + 5 = 28. ✓]]
5. At 6 a.m. Calgary is −13 °C and warms 3 °C each hour. Edmonton is −5 °C and warms 1 °C each hour. When are they the same?
@viz thermo min=-20 max=10 step=5 values="-13,-5" labels="Calgary;Edmonton"
[[−13 + 3x = −5 + x. 2x = 8. x = 4 hours (10 a.m.). Both are −1 °C.]]
:::
::: retrieval
1. Simplify 3x − 5 + 2x + 1.
=> 5x − 4
2. Solve 2x − 7 = 5x + 2.
=> −7 = 3x + 2. −9 = 3x. x = −3.
3. Find the GST (5%) on $60.
=> 10% is $6. Half of that is $3.
4. Find −24 ÷ (−6).
=> 4
5. ★ Stretch: Three integers in a row add to −12. Find them.
=> x + (x + 1) + (x + 2) = −12. 3x + 3 = −12. 3x = −15. x = −5. They are −5, −4 and −3.
:::

## Unit Synthesis
1. Simplify 3(x − 2) + 4x − 1.
@viz tilerows rows="x;-2 | x;-2 | x;-2 | 4x;-1" labels="3(x − 2);;;+ 4x − 1"
=> 3x − 6 + 4x − 1 = 7x − 7
2. Solve 6x − 4 = 2x + 8. Verify your answer.
=> 4x − 4 = 8. 4x = 12. x = 3.
=> Verify: 6(3) − 4 = 14 and 2(3) + 8 = 14. ✓
3. Solve 2(x + 5) = 4x + 14. Verify in the original and in one equivalent equation.
=> 2x + 10 = 4x + 14. 10 = 2x + 14. −4 = 2x. x = −2.
=> Original: 2(−2 + 5) = 6 and 4(−2) + 14 = 6. ✓ Equivalent: 2(−2) + 10 = 6 and 4(−2) + 14 = 6. ✓
4. Stream A costs $12 a month plus $3 a movie. Stream B costs $24 a month plus $1 a movie. When do they cost the same?
@viz balance left="3x;+12" right="x;+24"
=> 12 + 3x = 24 + x. 2x + 12 = 24. 2x = 12. x = 6 movies.
=> Verify: 12 + 18 = 30 and 24 + 6 = 30. Both cost $30.
5. Kai says 3x + 4 = 7x. Explain his mistake.
=> 3x and 4 are not like terms. They can't be added. 3x + 4 stays 3x + 4.
6. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Simplifying
Like terms: add the coefficients. 2x + 3x = 5x. An x-term and a number stay apart.
Zero pairs: x + (−x) = 0 and 1 + (−1) = 0.
Distributive property: multiply EVERY term in the brackets. 2(x + 3) = 2x + 6. −3(x − 2) = −3x + 6.
:::
@viz tilerows rows="x;+3 | x;+3" labels="2(x + 3)" notes=";= 2x + 6"

::: key Keeping the balance
Do the same thing to both sides. Add or subtract the same number or x-term. Divide both sides by the same number.
Each new equation is equivalent. It has the same solution.
:::
@viz balance left="2x;+3" right="+11"

::: key x on both sides
Simplify each side. Get the x-terms on one side. Get the numbers on the other side. Divide.
A term leaves a side as its opposite: subtract 3x from BOTH sides.
:::
@viz flow steps="5x + 2 = 3x + 10|2x + 2 = 10|2x = 8|x = 4"

::: key Verify and word problems
Substitute into the ORIGINAL equation. Both sides must be equal.
Word problems: let x = …, write each side, make an equation. Then solve, verify and answer in words.
:::
@viz balance left="5x;+20" right="2x;+35" text="Plan A = Plan B"

| Mistake | Fix |
|---|---|
| 2x + 3x = 5x² | Add the coefficients only: 5x. |
| 3x + 2 = 5x | x-terms and numbers don't combine. |
| 2(x + 3) = 2x + 3 | Multiply both terms: 2x + 6. |
| Doing something to one side only | Do the same thing to both sides. |
| 5x + 2 = 3x + 10 → 8x + 2 = 10 | Subtract 3x from both sides: 2x + 2 = 10. |
| Checking only the last line | Check in the original equation. |
