---
title: Triangle Theorems
topic: triangle-theorems
strand: measurement-geometry
---
<!-- Gate: one ticket per cluster. Every question maps to a specific LO (TT1–TT4, outcome 8G2). -->

## Section 1: Angles in a triangle
Target: I can find a missing angle in a triangle. I can name the theorem I used. (TT1)
### This triangle is isosceles. Find x.
@viz polygon pts="0,0;4,0;2,6.16" ticks="0,1,1" arcs="1,1,0" angles="72°;;x" unit=20
(lines 2)
=> The other base angle is 72°. x = 180° − 72° − 72° = 36°.
### Can a triangle have two right angles? Explain how you know.
(lines 2)
=> No. 90° + 90° = 180°. That leaves 0° for the third angle.

## Section 2: The triangle inequality
Target: I can tell if three lengths make a triangle. I can find the range for a missing side. (TT2)
### Can 5 cm, 6 cm and 12 cm make a triangle?
@viz ttstraws a=5 b=6 c=12 la="5 cm" lb="6 cm" lc="12 cm" show=key unit=16
(lines 1)
=> No. 5 + 6 = 11, and 11 < 12.
### Two sides are 6 m and 10 m. Find the range for the third side.
(lines 1)
=> 10 − 6 < x < 10 + 6, so 4 < x < 16.
### Pat says sticks of 4 cm, 4 cm and 8 cm make a triangle. Explain how you know he is wrong.
(lines 2)
=> 4 + 4 = 8. That is not more than 8. The sticks lie flat, so there is no triangle.

## Section 3: The Pythagorean theorem
Target: I can use a² + b² = c². I can test if a triangle is a right triangle. (TT3)
### Name the hypotenuse.
@viz righttri a="JK" b="KL" c="JL" aval=4 bval=6 names="K,J,L"
(lines 1)
=> JL. It is across from the right angle at K.
### Is a triangle with sides 10, 24 and 26 a right triangle? Explain how you know.
(lines 2)
=> 10² + 24² = 100 + 576 = 676. 26² = 676. They match, so yes (the converse).

## Section 4: Right-triangle problems
Target: I can find a missing side of a right triangle. I can solve problems with it. (TT4)
### A 5.0 m ladder has its foot 1.4 m from a wall. How high does it reach?
@viz ttscene kind=ladder w=1.4 h=4.8 a="h" b="1.4 m" c="5.0 m"
(lines 2)
=> h² = 25 − 1.96 = 23.04. h = √23.04 = 4.8 m.
### Did you add or subtract the squares? Explain how you know.
(lines 2)
=> Subtract. The ladder is the hypotenuse, and the height is a leg.
