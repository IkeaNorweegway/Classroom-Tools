---
title: Triangle Theorems
topic: triangle-theorems
strand: measurement-geometry
---
## Core

### Find the missing angle x. Name the theorem you used.
@viz polygon pts="0,0;5,0;1.94,3.65" names="A,B,C" angles="62°;50°;x" unit=28
(lines 2)
=> x = 180° − 62° − 50° = 68°. (TT1)
=> Reason: the angle sum theorem. The angles of a triangle add to 180°.

### This roof truss is isosceles. The top angle is 54°. Find each base angle.
@viz polygon pts="0,0;5,0;2.5,4.91" ticks="0,1,1" arcs="1,1,0" angles="b;b;54°" unit=24
(lines 2)
=> The base angles are equal: b + b + 54° = 180°. (TT1)
=> 2b = 126°, so b = 63°.

### A ramp is a right triangle. One angle is 41°. Find the third angle.
@viz polygon pts="0,0;5,0;5,4.35" right="2" angles="41°;;t" unit=28
(lines 1)
=> t = 180° − 90° − 41° = 49°. (TT1)

### Can straws of 4 cm, 6 cm and 9 cm make a triangle?
@viz ttstraws a=4 b=6 c=9 la="4 cm" lb="6 cm" lc="9 cm" show=key unit=20
(lines 2)
=> The longest is 9 cm. 4 + 6 = 10, and 10 > 9. (TT2)
=> Yes, they make a triangle.

### Ava says 3 cm, 5 cm and 9 cm make a triangle. "Any three lengths work." Is she right?
@viz ttstraws a=3 b=5 c=9 la="3 cm" lb="5 cm" lc="9 cm" show=key unit=20
(lines 2)
=> No. 3 + 5 = 8, and 8 < 9. The short sides can't reach each other. (TT2)
=> Targets the "any three lengths make a triangle" mix-up.

### Two sides of a triangle are 7 cm and 11 cm. Find the range for the third side x.
@viz ttrange min=0 max=20 lo=4 hi=18 show=key label="[[4]]  <  x  <  [[18]]"
(lines 2)
=> Largest: x < 7 + 11 = 18. Smallest: x > 11 − 7 = 4. (TT2)
=> So 4 < x < 18.

### Ken labelled this right triangle x, y and z. Write the Pythagorean theorem with his letters.
@viz polygon pts="0,0;8,0;8,6" right="2" sides="x = 8;z = 6;y = 10" unit=20
(lines 2)
=> The right angle is between x and z. So y is the hypotenuse. (TT3)
=> x² + z² = y². Check: 64 + 36 = 100. ✓ Targets the "c is whatever side is labelled c" mix-up.

### Is a triangle with sides 9, 40 and 41 a right triangle?
(lines 2)
=> The longest side is 41. 9² + 40² = 81 + 1600 = 1681. (TT3)
=> 41² = 1681. They match, so yes. It is a right triangle.

### Is a triangle with sides 6 m, 7 m and 9 m a right triangle?
(lines 2)
=> 6² + 7² = 36 + 49 = 85. 9² = 81. (TT3)
=> 85 ≠ 81, so no.

### Find the hypotenuse.
@viz righttri a="9 cm" b="12 cm" c="c" aval=9 bval=12 hyp=1
(lines 3)
=> c² = 9² + 12² = 81 + 144 = 225. (TT4)
=> c = √225 = 15 cm.

### Find the missing leg. Round to one decimal place.
@viz righttri a="a" b="10 cm" c="15 cm" aval=11.18 bval=10 hyp=1
(lines 3)
=> 15 cm is the hypotenuse, so subtract: a² = 15² − 10² = 225 − 100 = 125. (TT4)
=> a = √125 = 11.18… ≈ 11.2 cm.
=> Targets the "for a leg, add the squares" mix-up. Adding gives 18.0 cm: longer than the hypotenuse.

### A 4.0 m ladder leans on a wall. Its foot is 1.2 m from the wall. How high does it reach?
@viz ttscene kind=ladder w=1.2 h=3.82 a="h" b="1.2 m" c="4.0 m"
(lines 3)
=> The ladder is the hypotenuse. h is a leg, so subtract. (TT4)
=> h² = 4.0² − 1.2² = 16 − 1.44 = 14.56.
=> h = √14.56 = 3.81… ≈ 3.8 m.

## Challenge

### The angles of a triangle are x, x + 20° and 2x. Find all three angles.
(lines 3)
=> x + x + 20 + 2x = 180, so 4x + 20 = 180. (TT1)
=> 4x = 160, so x = 40. The angles are 40°, 60° and 80°.

### An isosceles triangle has a 100° angle. Find the other two angles. Explain.
(lines 3)
=> The 100° angle must be the top angle. Two 100° base angles would make 200°. (TT1)
=> Base angles: (180° − 100°) ÷ 2 = 40° each.

### Two sides are 5 cm and 8 cm. The third side is a whole number of centimetres. How many triangles are possible?
@viz ttrange min=0 max=14 lo=3 hi=13 show=key label="[[3]]  <  x  <  [[13]]"
(lines 3)
=> 8 − 5 < x < 8 + 5, so 3 < x < 13. (TT2)
=> x = 4, 5, 6, 7, 8, 9, 10, 11 or 12. That is 9 triangles.

### A deck builder measures 1.8 m and 2.4 m along two sides from a corner. The diagonal is 3.0 m. Is the corner square?
@viz polygon pts="0,0;2.4,0;0,1.8" sides="2.4 m;3.0 m;1.8 m" unit=60
(lines 3)
=> 1.8² + 2.4² = 3.24 + 5.76 = 9.00. (TT3)
=> 3.0² = 9.00. They match. By the converse, the corner is 90°.

### A 25 m guy-wire is fixed to the ground 7 m from the base of a tower. How high up the tower is it attached?
@viz ttscene kind=wire w=7 h=24 a="h" b="7 m" c="25 m"
(lines 3)
=> The wire is the hypotenuse. Subtract: h² = 625 − 49 = 576. (TT4)
=> h = √576 = 24 m.

### A "65-inch" TV has a 65-inch diagonal. The screen is 57 inches wide. How tall is it?
@viz ttscene kind=tv w=57 h=31.24 a="h" b="57 in" c="65 in"
(lines 3)
=> h² = 65² − 57² = 4225 − 3249 = 976. (TT4)
=> h = √976 = 31.24… ≈ 31.2 in.

### A school field in Red Deer is 80 m by 50 m. How much shorter is the diagonal shortcut than walking along two edges?
@viz ttscene kind=park w=80 h=50 a="50 m" b="80 m" c="d"
(lines 3)
=> d² = 80² + 50² = 6400 + 2500 = 8900. d = √8900 = 94.33… m. (TT4)
=> The edges: 80 + 50 = 130 m. 130 − 94.33 = 35.66…, so about 35.7 m shorter.

### Two sides of a right triangle are 6 cm and 8 cm. Find BOTH possible lengths of the third side.
(lines 4)
=> If 6 and 8 are the legs: c² = 36 + 64 = 100, so c = 10 cm. (TT4)
=> If 8 is the hypotenuse: a² = 64 − 36 = 28, so a = √28 ≈ 5.3 cm.
