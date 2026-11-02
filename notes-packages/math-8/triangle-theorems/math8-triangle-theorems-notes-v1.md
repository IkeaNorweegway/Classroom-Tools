---
title: Triangle Theorems
topic: triangle-theorems
strand: measurement-geometry
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "A bigger triangle has a bigger angle sum" (TT1, extra: common slip).
     "Any three lengths make a triangle" (TT2). "c is whatever side is labelled c" (TT3).
     "For a leg, add the squares" (TT4).
     Section order: the angle sum first (TT1), because it reuses the Grade 7 straight-line fact (180°)
     and introduces the word "theorem" with the friendliest proof (tear and line up). Then the
     triangle inequality (TT2): still any triangle, now about sides, and it sets up "the longest side".
     Then the Pythagorean theorem and its converse (TT3), which only works for right triangles and
     names the longest side (the hypotenuse). Last, problems that find a missing side (TT4): hypotenuse
     or leg, answers to one decimal place, with the square roots from topic 2. Outcome 8G2.
     No trigonometry. No exterior-angle theorem, no alternate angles. -->

## Pre-Knowledge Check
1. Two angles sit side by side on a straight line. One is 110°. Find the other.
2. Find 180 − 35 − 60.
3. Find 7² and 12².
4. Find √81.
5. Solve x + x = 140.
6. Which is greater: 3 + 4 or 8?

## Section 1: Angles in a triangle
Learning target: I can find a missing angle in a triangle. I can name the theorem I used.

### Vocabulary
- theorem :: a fact that is proved from facts we already know :: the angle sum theorem
- angle sum :: the total of the three angles in a triangle :: 50° + 60° + 70° = 180°
- isosceles triangle :: a triangle with at least two equal sides :: a roof truss with two equal rafters
- base angles :: the two angles across from the equal sides of an isosceles triangle :: both 70°
- equilateral triangle :: a triangle with three equal sides :: a yield sign
- right triangle :: a triangle with one 90° angle :: the corner of a ramp

#### Tear off the corners
1. Cut out any paper triangle. Colour its three corners.
2. Tear off the three corners.
3. Line them up, point to point, along a ruler.
@viz tttear angles="50,60,70" labels="a;b;c" sum="a + b + c = 180°" caption="The three corners fill a straight line."
The corners always fill a straight line. In Grade 7 you learned a straight line is 180°.
So the three angles always add to 180°. That is a **theorem**: a fact proved from facts we know.

::: key Angle sum theorem
In every triangle, the three angles add to 180°.
**Isosceles:** the two base angles are equal. They sit across from the equal sides.
**Equilateral:** all three angles are 60°, since 180° ÷ 3 = 60°.
:::
@viz polygon pts="0,0;5,0;2.5,2.98" ticks="0,1,1" arcs="1,1,0" angles="50°;50°;80°" pts2="0,0;4,0;2,3.46" ticks2="1,1,1" arcs2="1,1,1" angles2="60°;60°;60°" unit=26 cap="Isosceles" cap2="Equilateral" caption="Ticks show equal sides. Arcs show equal angles."

::: misconception
WRONG: "A bigger triangle has more degrees."
WHY: Both triangles have the same three angles. The big one just has longer sides.
@viz polygon pts="0,0;4,0;2.69,2.26" angles="40°;60°;80°" pts2="0,0;6.4,0;4.30,3.62" angles2="40°;60°;80°" unit=30
RIGHT: Every triangle has an angle sum of 180°. Size does not matter.
:::

::: example Worked Example 1 — Find the missing angle
@viz polygon pts="0,0;6,0;4.62,5.14" names="A,B,C" angles="48°;75°;x" unit=24
Step 1: The angle sum theorem says the angles add to 180°.
Step 2: Add the two you know: 48° + 75° = 123°.
Step 3: Subtract: x = 180° − 123° = [[57°]].
Check: 48° + 75° + 57° = 180°. ✓
:::

::: example Worked Example 2 — An isosceles roof truss
The two rafters are equal. The top angle is 40°. Find the base angles.
@viz polygon pts="0,0;4,0;2,5.5" names="P,Q,R" ticks="0,1,1" arcs="1,1,0" angles="x;x;40°" unit=22
Step 1: The truss is isosceles. So the base angles are equal. Call each one x.
Step 2: The angle sum is 180°. So x + x + 40° = 180°.
Step 3: 2x = 140°. So x = [[70°]].
:::
::: explain
In Worked Example 2, why did both base angles get the same letter?
(lines 2)
=> The triangle is isosceles. The angles across from the equal sides are equal.
:::

::: example Worked Example 3 — Base angle given
An isosceles triangle has a base angle of 35°. Find the other two angles.
@viz polygon pts="0,0;4,0;2,1.4" names="D,E,F" ticks="0,1,1" arcs="1,1,0" angles="35°;y;z" unit=44
Step 1: The base angles are equal. So y = 35°.
Step 2: The top angle is z = 180° − 35° − 35° = [[110°]].
Reason: isosceles base angles are equal, and the angle sum is 180°.
:::

::: example Worked Example 4 — A ramp
A ramp is a right triangle. The angle at the bottom is 34°. Find the angle at the top.
@viz polygon pts="0,0;5,0;5,3.37" names="G,H,K" right="2" angles="34°;;t" unit=28
Step 1: The small square shows a 90° angle at H.
Step 2: t = 180° − 90° − 34° = [[56°]].
Reason: the angle sum theorem.
:::

::: try
1. Find the missing angle.
@viz polygon pts="0,0;6,0;3.73,2.91" angles="38°;52°;w" unit=24
[[w = 180° − 38° − 52° = 90°. It is a right triangle.]]
2. An isosceles triangle has a top angle of 80°. Find each base angle. [[(180° − 80°) ÷ 2 = 50°]]
3. An isosceles triangle has a base angle of 65°. Find the top angle.
@viz polygon pts="0,0;5,0;2.5,5.36" ticks="0,1,1" arcs="1,1,0" angles="65°;;m" unit=20
[[The other base angle is 65°. m = 180° − 130° = 50°.]]
4. Can a triangle have angles of 100° and 90°? Explain. [[No. 100° + 90° = 190°. That is more than 180° already.]]
5. Why is every angle of an equilateral triangle 60°? [[All three angles are equal. 180° ÷ 3 = 60°.]]
:::
::: retrieval
1. Two angles sit side by side on a line. One is 125°. Find the other.
=> 180° − 125° = 55°
2. Find √49.
=> 7
3. Solve 2x + 30 = 180.
=> 2x = 150, so x = 75.
4. Write 0.75 as a fraction.
=> {3/4}
5. ★ Stretch: A triangle's angles are x, 2x and 3x. Find x.
=> 6x = 180, so x = 30. The angles are 30°, 60° and 90°.
:::

## Section 2: The triangle inequality
Learning target: I can tell if three lengths make a triangle. I can find the range for a missing side.

### Vocabulary
- triangle inequality :: any two sides of a triangle add to MORE than the third side :: 3 + 4 > 6
- inequality :: a statement with >, < or ≠ :: 7 > 6
- longest side :: the biggest of the three lengths. Test it first. :: 6 in 3, 4, 6
- range :: all the values between a smallest and a largest value :: 5 < x < 13

#### Three straws
Cut straws into lengths. Join two of them to the ends of the third.
@viz ttstraws a=3 b=4 c=6 la="3 cm" lb="4 cm" lc="6 cm" unit=34 caption="3 + 4 = 7. That is more than 6. They meet."
@viz ttstraws a=2 b=3 c=7 la="2 cm" lb="3 cm" lc="7 cm" unit=34 caption="2 + 3 = 5. That is less than 7. There is a gap."
@viz ttstraws a=3 b=4 c=7 la="3 cm" lb="4 cm" lc="7 cm" unit=34 caption="3 + 4 = 7 exactly. The straws lie flat. No triangle."
The two short straws must reach each other above the long one.
They can only do that if together they are LONGER than the long one.

::: key Triangle inequality theorem
For sides a, b and c: a + b > c. Also a + c > b and b + c > a.
**Shortcut:** add the two shorter sides. The sum must be greater than the longest side.
Equal is not enough. Equal means the sides lie flat.
:::

::: misconception
WRONG: "Any three lengths make a triangle."
WHY: Try 2 cm, 3 cm and 8 cm. The short straws can't reach each other.
@viz ttstraws a=2 b=3 c=8 la="2 cm" lb="3 cm" lc="8 cm" unit=30
RIGHT: The two shorter sides must add to more than the longest side. 2 + 3 = 5, and 5 < 8.
:::

::: example Worked Example 1 — Do they make a triangle?
Can 5 cm, 7 cm and 10 cm make a triangle?
@viz ttstraws a=5 b=7 c=10 la="5 cm" lb="7 cm" lc="10 cm" show=key unit=18
Step 1: The longest side is 10 cm.
Step 2: Add the two shorter sides: 5 + 7 = 12.
Step 3: 12 > 10. So [[yes, they make a triangle]].
:::

::: example Worked Example 2 — Exactly equal
Can 4 m, 5 m and 9 m boards make a triangle?
@viz ttstraws a=4 b=5 c=9 la="4 m" lb="5 m" lc="9 m" show=key unit=18
Step 1: The longest side is 9 m.
Step 2: 4 + 5 = [[9]].
Step 3: 9 is not greater than 9. The boards lie flat. So [[no triangle]].
:::
::: explain
Why do you only need to test the two shorter sides against the longest?
(lines 2)
=> The longest side plus any other side is always more than the third side. Only the longest side can fail.
:::

::: example Worked Example 3 — Range for a missing side
A triangle has sides 4 cm and 9 cm. What lengths could the third side x be?
@viz ttrange min=0 max=15 lo=5 hi=13 show=key label="[[5]]  <  x  <  [[13]]"
Step 1: Longest case: x is the longest side. It must be less than 4 + 9 = 13.
Step 2: Shortest case: 9 is the longest. So 4 + x > 9. x must be more than 9 − 4 = [[5]].
Step 3: Put the two cases together: [[5 < x < 13]].
:::

::: example Worked Example 4 — How far is the rink?
Home to school is 1.2 km. School to the rink is 0.8 km. Can the rink be 2.5 km from home?
@viz polygon pts="0,0;5,0;3.4,1.6" names="H,R,S" sides="?;0.8 km;1.2 km" unit=30
Step 1: Going through the school is 1.2 + 0.8 = [[2.0]] km.
Step 2: The straight path is never longer than the path through the school.
Step 3: Compare 2.5 km with that path. So [[no, it can't be 2.5 km]].
:::

::: try
1. Can 6 cm, 6 cm and 11 cm make a triangle? [[Yes. 6 + 6 = 12, and 12 > 11.]]
2. Can these straws make a triangle?
@viz ttstraws a=2 b=4 c=7 la="2 cm" lb="4 cm" lc="7 cm" show=key unit=18
[[No. 2 + 4 = 6, and 6 < 7. There is a gap.]]
3. Two sides are 5 m and 8 m. Find the range for the third side.
@viz ttrange min=0 max=15 lo=3 hi=13 show=key label="[[3]]  <  x  <  [[13]]"
[[8 − 5 = 3 and 8 + 5 = 13. So 3 < x < 13.]]
4. Leo says 3, 4 and 7 make a very flat triangle. Is he right? [[No. 3 + 4 = 7 exactly. The sides lie flat on a line.]]
5. Two sides are 10 cm and 10 cm. Can the third side be 20 cm? [[No. 10 + 10 = 20, not more than 20.]]
:::
::: retrieval
1. An isosceles triangle has a top angle of 30°. Find each base angle.
=> (180° − 30°) ÷ 2 = 75°
2. A triangle has angles 70° and 45°. Find the third.
=> 180° − 115° = 65°
3. Find 3² + 4².
=> 9 + 16 = 25
4. Is −3 < −5 true?
=> No. −3 is to the right of −5, so −3 > −5.
5. ★ Stretch: The sides are 3, 5 and x. x is a whole number. List every possible x.
=> 5 − 3 < x < 5 + 3, so 2 < x < 8. x = 3, 4, 5, 6 or 7.
:::

## Section 3: The Pythagorean theorem
Learning target: I can use a² + b² = c². I can test if a triangle is a right triangle.

### Vocabulary
- legs :: the two sides that make the right angle :: a and b
- hypotenuse :: the side across from the right angle. It is the longest side. :: c
- Pythagorean theorem :: in a right triangle, a² + b² = c² :: 3² + 4² = 5²
- converse :: the theorem turned around: if a² + b² = c², the triangle is right :: 6, 8, 10 is right
- Pythagorean triple :: three whole numbers that fit a² + b² = c² :: 3, 4, 5

#### Squares on the sides
Draw a square on each side of a right triangle. Count the unit squares.
@viz righttri aval=3 bval=4 squares=1 areas="9;16;25" caption="9 + 16 = 25. The two small squares fill the big one."
@viz squares shapes="3x3;4x4;5x5" labels="3² = 9;4² = 16;5² = [[25]]" caption="Count the unit squares in each."
The square on the hypotenuse has the same area as the other two together.
This works for every right triangle. It only works for right triangles.

::: key Pythagorean theorem
Legs a and b, hypotenuse c: a² + b² = c².
The hypotenuse c is across from the right angle. It is the longest side.
**Converse:** let c be the longest side. If a² + b² = c², the triangle is right.
:::
@viz righttri a="a (leg)" b="b (leg)" c="c (hypotenuse)" aval=3 bval=4 hyp=1 caption="c is always across from the square corner."

::: misconception
WRONG: "c is whatever side is labelled c."
WHY: Here the hypotenuse is labelled a. Raj wrote 3² + 5² = 4². That gives 34 = 16. False!
@viz polygon pts="0,0;4,0;0,3" right="1" sides="c = 4;a = 5;b = 3" unit=34
RIGHT: Find the right angle first. The side across from it is the hypotenuse. 3² + 4² = 5².
:::

::: example Worked Example 1 — Is it a right triangle?
A triangle has sides 6 cm, 8 cm and 10 cm. Is it a right triangle?
@viz polygon pts="0,0;8,0;8,6" sides="8 cm;6 cm;10 cm" unit=20
Step 1: The longest side is 10 cm. Make it c.
Step 2: a² + b² = 6² + 8² = 36 + 64 = [[100]].
Step 3: c² = 10² = [[100]]. They match. So [[it is a right triangle]].
:::

::: example Worked Example 2 — Not a right triangle
A triangle has sides 7 m, 8 m and 11 m. Is it a right triangle?
@viz polygon pts="0,0;11,0;4.82,5.08" sides="11 m;8 m;7 m" unit=17
Step 1: The longest side is 11 m.
Step 2: 7² + 8² = 49 + 64 = [[113]].
Step 3: 11² = [[121]]. The two sides [[don't match]]. So it is [[not a right triangle]].
:::
::: explain
Why must c be the longest side when you test a triangle?
(lines 2)
=> c is the hypotenuse. The hypotenuse is always the longest side of a right triangle.
:::

::: example Worked Example 3 — The 3-4-5 rope
Builders tie 12 equal sections on a rope. They stretch it into a 3-4-5 triangle.
@viz polygon pts="0,0;4,0;4,3" right="2" sides="4 sections;3 sections;5 sections" unit=34
Step 1: Test: 3² + 4² = 9 + 16 = [[25]].
Step 2: 5² = 25. They match.
Step 3: By the converse, the corner between the 3 and the 4 is [[90°]]. Builders use this to square a corner.
:::

::: example Worked Example 4 — Pythagorean triples
Is 5, 12, 13 a Pythagorean triple?
@viz righttri aval=5 bval=12 squares=1 areas="25;144;169"
Step 1: 5² + 12² = 25 + 144 = [[169]].
Step 2: 13² = [[169]]. So yes, it is a triple.
Step 3: Double every number: 10, 24, 26. That is also a triple. 100 + 576 = 676 = 26².
:::

::: try
1. Name the hypotenuse.
@viz righttri a="PQ" b="QR" c="PR" aval=5 bval=6 names="Q,P,R"
[[PR. It is across from the right angle at Q.]]
2. Is 9, 12, 15 a right triangle? [[81 + 144 = 225 = 15². Yes.]]
3. Is 4, 5, 6 a right triangle? [[16 + 25 = 41. 6² = 36. 41 ≠ 36, so no.]]
4. Find the missing area.
@viz righttri aval=6 bval=8 squares=1 areas="36;64;[[100]]"
[[36 + 64 = 100]]
5. Mia tests 5, 13, 12 as 5² + 13² = 12². What went wrong? [[13 is the longest side, so 13 is c. 5² + 12² = 13² works.]]
:::
::: retrieval
1. Can 3 cm, 3 cm and 7 cm make a triangle?
=> No. 3 + 3 = 6, and 6 < 7.
2. An equilateral triangle has angles of ___ each.
=> 60°
3. Find √144.
=> 12
4. Find √50 to one decimal place.
=> 7.1 (7² = 49, so just over 7)
5. ★ Stretch: Is 8, 15, 17 a triple? Is 16, 30, 34?
=> 64 + 225 = 289 = 17². Yes. 16, 30, 34 is double it, so yes.
:::

## Section 4: Right-triangle problems
Learning target: I can find a missing side of a right triangle. I can solve problems with it.

### Vocabulary
- missing hypotenuse :: add the squares, then take the square root :: c² = a² + b²
- missing leg :: subtract the squares, then take the square root :: a² = c² − b²
- one decimal place :: round to the nearest tenth :: 5.809… → 5.8
- guy-wire :: a cable from a tall tower to the ground. It holds the tower steady. :: a radio tower's wire

#### Add or subtract?
Find the side you need. Is it the hypotenuse or a leg?
@viz righttri a="5" b="12" c="[[?]]" aval=5 bval=12 hyp=1 caption="Missing hypotenuse: add. c² = 25 + 144."
@viz righttri a="[[?]]" b="12" c="13" aval=5 bval=12 hyp=1 caption="Missing leg: subtract. a² = 169 − 144."

::: key Find a missing side
1. Draw and label. Mark the right angle. The side across from it is c.
2. Missing c: c² = a² + b². Missing leg: a² = c² − b².
3. Take the square root. Use a calculator if it is not a perfect square.
4. Round to one decimal place. Check: c must be the longest side.
:::

::: misconception
WRONG: "For a leg, add the squares."
WHY: A 5 m ladder stands 3 m from a wall. Sam adds: √(25 + 9) ≈ 5.8 m. But the wall can't be taller than the ladder!
@viz ttscene kind=ladder w=3 h=4 a="h" b="3 m" c="5 m"
RIGHT: For a leg, subtract: h² = 5² − 3² = 25 − 9 = 16. So h = √16 = 4 m.
:::

::: example Worked Example 1 — A ladder against a wall
A 6.0 m ladder leans on a wall. Its foot is 1.5 m from the wall. How high does it reach?
@viz ttscene kind=ladder w=1.5 h=5.81 a="h" b="1.5 m" c="6.0 m"
Step 1: The ladder is across from the right angle. So c = 6.0. The height h is a [[leg]].
Step 2: h² = 6.0² − 1.5² = 36 − 2.25 = [[33.75]].
Step 3: h = √33.75 = 5.809… ≈ [[5.8 m]].
Check: a leg must be shorter than the ladder. Is yours?
:::

::: example Worked Example 2 — A soccer field
A soccer field is 100 m long and 64 m wide. How long is the diagonal?
@viz ttscene kind=field w=100 h=64 a="64 m" b="100 m" c="d"
Step 1: The diagonal is across from the corner. It is the [[hypotenuse]].
Step 2: d² = 100² + 64² = 10 000 + 4096 = [[14 096]].
Step 3: d = √14 096 = 118.72… ≈ [[118.7 m]].
:::
::: explain
In Worked Example 2, why did you add the squares? In Worked Example 1, why did you subtract?
(lines 3)
=> The field's diagonal is the hypotenuse, so add. The ladder's height is a leg, so subtract from c².
:::

::: example Worked Example 3 — A guy-wire
A guy-wire runs from the top of a 30 m tower. It is fixed to the ground 16 m from the base.
@viz ttscene kind=wire w=16 h=30 a="30 m" b="16 m" c="w"
Step 1: The wire is the [[hypotenuse]].
Step 2: w² = 30² + 16² = 900 + 256 = [[1156]].
Step 3: w = √1156 = [[34 m]]. It is exact: 16, 30, 34 is a Pythagorean triple.
:::

::: example Worked Example 4 — A TV screen
A TV's size is its diagonal. A screen is 48 inches wide and 27 inches tall.
@viz ttscene kind=tv w=48 h=27 a="27 in" b="48 in" c="d"
Step 1: d² = 48² + 27² = 2304 + 729 = [[3033]].
Step 2: d = √3033 = 55.07… ≈ [[55.1 in]].
Step 3: The store calls it a [[55-inch]] TV.
:::

::: try
1. A park is 120 m by 90 m. How long is the shortcut across it?
@viz ttscene kind=park w=120 h=90 a="90 m" b="120 m" c="[[?]]"
[[c² = 14 400 + 8100 = 22 500. c = √22 500 = 150 m.]]
2. In question 1, how much shorter is the shortcut than going around the edge? [[120 + 90 = 210 m. 210 − 150 = 60 m shorter.]]
3. A ramp is 6.0 m along the slope. It covers 5.8 m along the ground. How high is it?
@viz ttscene kind=ramp w=5.8 h=1.54 a="h" b="5.8 m" c="6.0 m"
[[h² = 36 − 33.64 = 2.36. h = √2.36 ≈ 1.5 m.]]
4. Find the missing leg. Round to one decimal place.
@viz righttri a="[[?]]" b="7 cm" c="10 cm" aval=7.14 bval=7 hyp=1
[[a² = 100 − 49 = 51. a = √51 ≈ 7.1 cm.]]
5. Jun finds a leg of 12.4 cm. The hypotenuse is 11 cm. How does he know he is wrong? [[A leg can't be longer than the hypotenuse. He added instead of subtracting.]]
:::
::: retrieval
1. Is 8, 15, 17 a right triangle?
=> 64 + 225 = 289 = 17². Yes.
2. Two sides are 6 cm and 10 cm. Find the range for the third side.
=> 10 − 6 < x < 10 + 6, so 4 < x < 16.
3. A right triangle has an angle of 28°. Find the third angle.
=> 180° − 90° − 28° = 62°
4. Find √20 to one decimal place.
=> 4.5 (4.47…)
5. ★ Stretch: A square has a side of 1 m. Find its diagonal to one decimal place.
=> d² = 1 + 1 = 2. d = √2 ≈ 1.4 m.
:::

## Unit Synthesis
1. A triangle garden bed has sides 3 m, 4 m and 5 m.
a) Do the boards make a triangle? b) Is it a right triangle? c) The angle across from the 3 m side is 37°. Find the other two angles.
@viz polygon pts="0,0;4,0;4,3" right="2" sides="4 m;3 m;5 m" angles="37°;;" unit=34
=> a) 3 + 4 = 7, and 7 > 5. Yes. (TT2)
=> b) 9 + 16 = 25 = 5². Yes, by the converse. (TT3)
=> c) The right angle is 90°. The third angle is 180° − 90° − 37° = 53°. (TT1)
2. A quarter-section of farmland is about 800 m by 800 m. How long is its diagonal?
@viz ttscene kind=field w=800 h=800 a="800 m" b="800 m" c="d"
=> d² = 640 000 + 640 000 = 1 280 000. d = √1 280 000 ≈ 1131.4 m. (TT4)
3. Two sides of a triangle are 7 cm and 12 cm. Can the third side be 4 cm? Can it be 18 cm?
=> 12 − 7 < x < 12 + 7, so 5 < x < 19. 4 cm: no. 18 cm: yes. (TT2)
4. An isosceles triangle has a top angle of 90°. Find each base angle.
=> (180° − 90°) ÷ 2 = 45° each. (TT1)
5. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Angles in a triangle
The angles of every triangle add to 180°. Tear the corners off: they fill a straight line.
Isosceles: the base angles (across from the equal sides) are equal. Equilateral: all 60°.
:::
@viz tttear angles="50,60,70" labels="50°;60°;70°" sum="50° + 60° + 70° = 180°"

::: key The triangle inequality
Two shorter sides must add to MORE than the longest side. Equal lies flat.
Sides p and q, with p longer. The third side x: p − q < x < p + q.
:::
@viz ttstraws a=3 b=4 c=6 la="3" lb="4" lc="6" noverdict=1 unit=20

::: key The Pythagorean theorem
Right triangle: a² + b² = c². The hypotenuse c is across from the right angle.
Converse: if a² + b² = c², the triangle is right. Triples: 3-4-5, 5-12-13, 8-15-17, 6-8-10.
:::
@viz righttri aval=3 bval=4 squares=1 areas="9;16;25"

::: key Right-triangle problems
Missing hypotenuse: c² = a² + b². Missing leg: a² = c² − b². Then take the square root.
Round to one decimal place. Check that c is still the longest side.
:::
@viz ttscene kind=ladder w=1.5 h=5.81 a="leg" b="leg" c="hypotenuse"

| Mistake | Fix |
|---|---|
| A bigger triangle has a bigger angle sum | Every triangle: 180°. |
| Any three lengths make a triangle | The two shorter sides must add to more than the longest. |
| Equal sums still make a flat triangle | 3 + 4 = 7 lies flat: no triangle. |
| c is whatever side is labelled c | c is across from the right angle: the longest side. |
| For a leg, add the squares | For a leg, subtract: a² = c² − b². |
| Rounding too early | Keep the calculator value. Round only at the end. |
