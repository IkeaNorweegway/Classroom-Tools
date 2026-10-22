---
title: The Pythagorean Theorem
topic: pythagorean
strand: measurement-geometry
---
<!-- Gate: progressive blanking confirmed. Refutation-first on: "a² + b² = c² works for any triangle" (PY1, PY4), "c is any side" (PY2),
     "to find a leg, add the squares" (PY3).
     Section order: the squares picture (PY1) → hypotenuse (PY2) → leg (PY3) → test and problems (PY4).
     Codes PY1–PY4. Outcome SS1. Needs Squares and Square Roots. -->

## Pre-Knowledge Check
1. Draw a right angle. How do you know it is a right angle?
2. What is 6²? What is √49?
3. A ladder leans against a wall. Which is longer: the ladder, or the height it reaches on the wall? Why?

## Section 1: The squares on a right triangle
Learning target: I can show that the two smaller squares on a right triangle add up to the biggest square.

### Vocabulary
- right triangle :: a triangle with one 90° angle :: the corner of a page
- legs :: the two sides that make the right angle :: a and b
- hypotenuse :: the longest side, across from the right angle :: c
- Pythagorean theorem :: in a right triangle, a² + b² = c² :: 3² + 4² = 5²

Draw a square on each side of a right triangle with sides 3, 4 and 5. Count the area of each square.

@viz righttri a="3" b="4" c="5" aval=3 bval=4 squares=1 areas="9;16;[[25]]" caption="The yellow and blue squares together have the same area as the green square."

Area on side 3: 3² = [[9]]
Area on side 4: 4² = [[16]]
Area on side 5: 5² = [[25]]
9 + 16 = [[25]]. The two small squares add up to the [[big]] square.

::: key The Pythagorean theorem
In a **right** triangle with legs a and b and hypotenuse c:
a² + b² = [[c²]]
:::

@viz righttri a="a (leg)" b="b (leg)" c="c (hypotenuse)" aval=3 bval=4 caption="The hypotenuse is always across from the right angle."

::: misconception
WRONG: "a² + b² = c² works for every triangle."
WHY: Try a triangle with sides 4, 5 and 6 (no right angle). 4² + 5² = 16 + 25 = 41, but 6² = 36. They don't match.
RIGHT: The theorem only works for **right** triangles.
:::

::: example Worked Example 1 — Check the squares
A right triangle has legs 6 and 8, and hypotenuse 10.
6² + 8² = [[36]] + [[64]] = [[100]]
10² = [[100]] ✓ The theorem works.
@viz righttri a="6" b="8" c="10" aval=6 bval=8 squares=1 areas="36;64;100"
:::

::: explain
Which side is the hypotenuse, and how can you tell?
(lines 2)
=> The side across from the right angle. It is also the longest side (10).
:::

::: try
Label the legs and the hypotenuse on each triangle.
@viz righttri a="[[leg]]" b="[[leg]]" c="[[hypotenuse]]" aval=5 bval=3
@viz righttri a="[[leg]]" b="[[leg]]" c="[[hypotenuse]]" aval=2 bval=6
:::

::: retrieval
1. Write the Pythagorean theorem. What do a, b and c stand for?
=> a² + b² = c². a and b are the legs; c is the hypotenuse.
2. Which side of a right triangle is always the longest?
=> The hypotenuse.
3. The squares on the legs of a right triangle have areas 25 and 144. What is the area of the square on the hypotenuse?
=> 169
4. Nia says the theorem works for a 5, 6, 7 triangle. Check it.
=> 25 + 36 = 61, but 49 ≠ 61. It is not a right triangle, so it doesn't work.
5. ★ Stretch: The square on the hypotenuse has area 100. One leg's square has area 64. What is the area of the other leg's square? How long is that leg?
=> 100 − 64 = 36. The leg is √36 = 6.
:::

## Section 2: Finding the hypotenuse
Learning target: I can find the hypotenuse when I know the two legs.

### Vocabulary
- diagonal :: a line from one corner to the opposite corner :: the diagonal of a soccer field
- approximate :: close but not exact; round it :: √50 ≈ 7.1

::: misconception
WRONG: "The side labelled c is always the hypotenuse" or "the hypotenuse is the side at the bottom."
WHY: Letters and positions change from picture to picture.
RIGHT: Find the right angle first. The side across from it is the hypotenuse. It is always the longest side.
:::

@viz flow steps="Square both legs|Add|Take the square root|Check: c is the longest"

::: example Worked Example 2 — A TV screen
A TV is 48 cm tall and 64 cm wide. TVs are measured on the diagonal. How long is the diagonal?
@viz righttri a="48 cm" b="64 cm" c="[[80 cm]]" aval=48 bval=64 clabel="diagonal"
c² = 48² + 64²
c² = [[2304]] + [[4096]] = [[6400]]
c = √6400 = [[80]] cm
:::

::: explain
Why do we take the square root at the end?
(lines 2)
=> We found c², the area of the big square. The side length c is the square root of that area.
:::

::: example Worked Example 3 — A soccer field
A soccer field is 100 m long and 60 m wide. How far is it from one corner to the opposite corner?
c² = 100² + 60² = 10 000 + [[3600]] = [[13 600]]
c = √13 600 ≈ [[116.6]] m
@viz righttri a="60 m" b="100 m" c="[[≈ 116.6 m]]" aval=60 bval=100
Check: 116.6 is longer than 100 ✓
:::

::: try
Find the hypotenuse. Round to one decimal place if needed.
a) legs 5 and 12: c = [[13]]
b) legs 9 and 12: c = [[15]]
c) legs 4 and 7: c = [[√65 ≈ 8.1]]
d) legs 10 m and 10 m: c = [[√200 ≈ 14.1 m]]
:::

::: retrieval
1. Find the hypotenuse: legs 8 and 15.
=> √(64 + 225) = √289 = 17
2. A phone screen is 6 cm by 13 cm. Find the diagonal to one decimal place.
=> √(36 + 169) = √205 ≈ 14.3 cm
3. Why must the hypotenuse be longer than each leg?
=> c² = a² + b² is bigger than a² and bigger than b², so c is bigger than a and b.
4. Ray found c = 7 for legs 3 and 4. What mistake did he make?
=> He added the legs (3 + 4) instead of their squares. c = √(9 + 16) = 5.
5. ★ Stretch: A baseball diamond is a square with sides of about 27.4 m. How far is it from home plate to second base?
=> √(27.4² + 27.4²) = √1501.5 ≈ 38.7 m
:::

## Section 3: Finding a leg
Learning target: I can find a leg when I know the hypotenuse and the other leg.

### Vocabulary
- leg :: one of the two sides that make the right angle :: a or b
- subtract :: take away :: c² − b²

If you know c, **subtract** to find a missing leg: a² = c² − b².

::: misconception
WRONG: "To find a missing leg, add the squares, like before."
WHY: Adding gives a number bigger than c². But a leg must be **shorter** than the hypotenuse.
RIGHT: Subtract: a² = c² − b². Then check: the leg is shorter than c.
:::

::: example Worked Example 4 — A ladder against a wall
A 5 m ladder leans against a wall. Its foot is 3 m from the wall. How high up the wall does it reach?
@viz righttri a="[[4 m]]" b="3 m" c="5 m" aval=4 bval=3 alabel="wall" blabel="ground" clabel="ladder"
The ladder is the hypotenuse (across from the right angle).
a² = 5² − 3² = 25 − [[9]] = [[16]]
a = √16 = [[4]] m
Check: 4 m is shorter than the 5 m ladder ✓
:::

::: explain
How did you know the ladder is the hypotenuse?
(lines 2)
=> The wall and the ground make the right angle. The ladder is across from it.
:::

::: example Worked Example 5 — A ramp
A ramp is 10 m long. It rises 1.5 m. How far along the ground does it go?
b² = 10² − 1.5² = 100 − [[2.25]] = [[97.75]]
b = √97.75 ≈ [[9.9]] m
@viz righttri a="1.5 m" b="[[≈ 9.9 m]]" c="10 m" aval=1.5 bval=9.9
:::

::: try
Find the missing leg. Round to one decimal place if needed.
a) c = 13, b = 5: a = [[12]]
b) c = 10, a = 6: b = [[8]]
c) c = 9, b = 4: a = [[√65 ≈ 8.1]]
:::

::: retrieval
1. Find the missing leg: hypotenuse 17, leg 8.
=> √(289 − 64) = √225 = 15
2. A 6 m ladder reaches 5 m up a wall. How far is its foot from the wall?
=> √(36 − 25) = √11 ≈ 3.3 m
3. Kai found a leg of 20 when the hypotenuse was 16 and the other leg 12. How do you know he is wrong right away?
=> A leg can't be longer than the hypotenuse. He added instead of subtracting. Correct: √(256 − 144) = √112 ≈ 10.6.
4. When do you add the squares, and when do you subtract?
=> Add to find the hypotenuse. Subtract to find a leg.
5. ★ Stretch: A kite string is 50 m long. The kite is 30 m straight above a point on the ground. How far is the person holding the string from that point?
=> √(2500 − 900) = √1600 = 40 m
:::

## Section 4: Right-triangle test and problems
Learning target: I can use the theorem to check whether a triangle is a right triangle, and to solve problems.

### Vocabulary
- Pythagorean triple :: three whole numbers that fit a² + b² = c² :: 3, 4, 5 · 5, 12, 13 · 8, 15, 17
- converse :: working backwards: if the squares add up, it is a right triangle :: 6, 8, 10 → right triangle

#### Is it a right triangle?
Square the two shorter sides and add. Compare with the square of the longest side.

::: example Worked Example 6 — Test two triangles
Triangle A: 6, 8, 10 → 6² + 8² = [[100]] and 10² = [[100]] → [[right triangle]]
Triangle B: 5, 6, 8 → 5² + 6² = [[61]] and 8² = [[64]] → [[not a right triangle]]
@viz flow steps="Square the 2 short sides|Add them|Square the longest side|Equal? Right triangle!"
:::

::: explain
Why do we compare with the **longest** side?
(lines 2)
=> In a right triangle, the hypotenuse is the longest side. It is the only side that can be c.
:::

::: example Worked Example 7 — The carpenter's 3-4-5 check
A carpenter building a deck wants a perfect corner. She measures 3 m along one board and 4 m along the other. If the corner is square, the diagonal will be exactly [[5]] m.
@viz righttri a="3 m" b="4 m" c="[[5 m]]" aval=3 bval=4
3, 4, 5 is a Pythagorean [[triple]]. So is 6, 8, 10 (double it).
:::

::: explain
Why does doubling 3, 4, 5 give another triple?
(lines 2)
=> 6² + 8² = 36 + 64 = 100 = 10². Doubling each side makes each square 4 times bigger, so they still add up.
:::

::: try
a) Is 9, 12, 15 a right triangle? Show the check. [[81 + 144 = 225 = 15² → yes]]
b) Is 7, 8, 11 a right triangle? Show the check. [[49 + 64 = 113 ≠ 121 → no]]
c) Write a Pythagorean triple that starts with 10. [[10, 24, 26 (double 5, 12, 13)]]
:::

::: retrieval
1. Is 8, 15, 17 a right triangle?
=> 64 + 225 = 289 = 17². Yes.
2. Is 4, 6, 7 a right triangle?
=> 16 + 36 = 52 ≠ 49. No.
3. A deck corner measures 3 m and 4 m along the boards, and 5.2 m on the diagonal. Is the corner square? Why?
=> No. For a square corner the diagonal must be exactly 5 m.
4. Name two Pythagorean triples.
=> 3, 4, 5 and 5, 12, 13 (also 6, 8, 10; 8, 15, 17)
5. ★ Stretch: A 13 m wire holds up a pole. It is attached 12 m up the pole. How far from the base of the pole is it fixed to the ground?
=> √(169 − 144) = √25 = 5 m
:::

## Unit Synthesis
1. Draw a right triangle with squares on each side. Explain the Pythagorean theorem with your picture.
(work 4)
=> The areas of the two squares on the legs add up to the area of the square on the hypotenuse.
2. Explain when you add squares and when you subtract.
=> Add to find the hypotenuse; subtract to find a leg.
3. How can you tell if a triangle is a right triangle without a protractor?
=> Check if the squares of the two short sides add up to the square of the longest side.
4. Look back at your first page. What would you change now?
=> Answers vary.

## Concept Reference
::: key The theorem
In a **right** triangle: a² + b² = c². c is the hypotenuse: across from the right angle and always the longest side.
:::
@viz righttri a="3" b="4" c="5" aval=3 bval=4 squares=1 areas="9;16;25"

::: key Find the hypotenuse
c² = a² + b², then c = √. Legs 48 and 64: c = √(2304 + 4096) = √6400 = 80.
:::

::: key Find a leg
a² = c² − b², then a = √. Ladder 5 m, foot 3 m: a = √(25 − 9) = 4 m. Check: the leg is shorter than c.
:::

::: key Is it a right triangle?
Square the two short sides and add. Equal to the square of the longest side? Right triangle.
Triples: 3, 4, 5 · 5, 12, 13 · 6, 8, 10 · 8, 15, 17
:::

| Mistake | Fix |
|---|---|
| Works for any triangle | Right triangles only |
| c is "the side labelled c" | c is across from the right angle (longest) |
| Adding to find a leg | Subtract: a² = c² − b² |
| c = a + b | Add the squares, then take the square root |
