---
title: The Pythagorean Theorem
topic: pythagorean
strand: measurement-geometry
---
## Core

### Label the legs and the hypotenuse. Then write the Pythagorean theorem for the triangle using its letters.
@viz righttri a="p" b="r" c="q" aval=4 bval=6 names="Q,R,P"
Legs: [[p and r]]  Hypotenuse: [[q]]  Equation: [[p² + r² = q²]]

### Find the area of the missing square.
@viz righttri a="" b="" c="" aval=5 bval=12 squares=1 areas="25;144;[[169]]"
(lines 1)
=> 25 + 144 = 169

### Find the hypotenuse.
a) legs 6 and 8: c = [[10]]
b) legs 5 and 12: c = [[13]]
c) legs 7 and 24: c = [[25]]
d) legs 3 and 5 (one decimal): c = [[√34 ≈ 5.8]]

### Find the missing leg.
a) c = 10, a = 8: b = [[6]]
b) c = 25, b = 15: a = [[20]]
c) c = 12, a = 7 (one decimal): b = [[√95 ≈ 9.7]]

### Is it a right triangle? Show the check.
a) 9, 40, 41 → [[81 + 1600 = 1681 = 41² → yes]]
b) 6, 7, 9 → [[36 + 49 = 85 ≠ 81 → no]]

### A ladder is 8 m long. Its foot is 2 m from a wall. How high up the wall does it reach? Round to one decimal place.
@viz righttri a="[[?]]" b="2 m" c="8 m" aval=7.7 bval=2 alabel="wall" blabel="ground" clabel="ladder"
(work 3)
=> a² = 64 − 4 = 60, a = √60 ≈ 7.7 m

### A rectangular garden is 12 m by 5 m. A path goes straight across from corner to corner. How long is the path?
(work 3)
=> √(144 + 25) = √169 = 13 m

## Challenge

### Ari says a triangle with sides 5, 6 and 7 is a right triangle because "5 + 6 > 7." Explain why that does not prove it. Do the right check.
(work 3)
=> "5 + 6 > 7" only shows a triangle can be made. Right-triangle check: 25 + 36 = 61 ≠ 49. It is not a right triangle.

### Mia found the missing leg like this: c = 15, b = 9, so a² = 15² + 9² = 306, a ≈ 17.5. Find her mistake. How could she have caught it?
(work 3)
=> She added instead of subtracting. a² = 225 − 81 = 144, a = 12. A leg must be shorter than the hypotenuse; 17.5 > 15 is impossible.

### A TV is advertised as "a 50-inch TV" (the diagonal). The screen is 40 inches wide. How tall is it?
@viz righttri a="[[30 in]]" b="40 in" c="50 in" aval=30 bval=40
(work 3)
=> √(2500 − 1600) = √900 = 30 inches

### A carpenter checks a corner: 6 ft along one wall, 8 ft along the other, and 10.3 ft on the diagonal. Is the corner square? If not, what should the diagonal be?
(work 3)
=> For a square corner: √(36 + 64) = 10 ft. 10.3 ft means the corner is not square (a bit too wide).

### Find the length of the dashed line from A to B on the grid. Each square is 1 unit.
@viz coord xmin=0 xmax=8 ymin=0 ymax=6 points="1,1:A;7,5:B" line=1 dashed=1
(work 3)
=> Across 6, up 4. √(36 + 16) = √52 ≈ 7.2 units

### Make a new Pythagorean triple from 3, 4, 5 and one from 5, 12, 13. Prove each one works.
(work 3)
=> Example: 9, 12, 15 (81 + 144 = 225) and 10, 24, 26 (100 + 576 = 676).
