---
title: Circles
topic: circles
strand: measurement-geometry
---
## Core

### A circle has a radius of 7 cm. Find the diameter.
@viz circle show=r rlabel="r = 7 cm" size=50
(lines 1)
=> The diameter is two radii: d = 2 × 7 = 14 cm. (CI1)

### Ava says the diameter of this circle is 5 cm. Is she right?
@viz circle show=rd rlabel="r = 5 cm" dlabel="d = ?" size=56
(lines 2)
=> No. 5 cm is the radius. The diameter is two radii: d = 2 × 5 = 10 cm. (CI1)
=> Targets the "radius and diameter are the same" mix-up.

### Raj wants a circle with a diameter of 10 cm. How wide should he open his compass? Then list the steps.
@viz compass r=5 rlabel="[[5 cm]]"
(lines 3)
=> The compass is set to the radius: r = 10 ÷ 2 = 5 cm. (CI1)
=> Step 1: Open the compass to 5 cm on a ruler. Step 2: Put the point on the centre. Step 3: Turn the pencil all the way around.

### A jar lid has a diameter of 8 cm. Find its circumference.
@viz circle show=d dlabel="d = 8 cm" clabel="C = [[25.1 cm]]" size=50
(lines 2)
=> Estimate: 3 × 8 = 24, so a bit more than 24 cm. (CI2)
=> C = πd ≈ 3.14 × 8 = 25.12. About 25.1 cm.

### A bike wheel has a radius of 30 cm. How far does it roll in one turn?
@viz wheel dlabel="d = [[60 cm]]" clabel="one turn = [[188.4 cm]]"
(lines 2)
=> One turn is the circumference. Double the radius: d = 60 cm. (CI2)
=> C ≈ 3.14 × 60 = 188.4 cm. (Or C = 2 × 3.14 × 30 = 188.4 cm.)

### Noor wraps a tape around a round post. The circumference is 94.2 cm. Find the diameter.
(lines 2)
=> d = C ÷ π ≈ 94.2 ÷ 3.14 = 30 cm. (CI2)
=> Check: 3.14 × 30 = 94.2.

### Fill in the table. Use π ≈ 3.14.

| Radius r | Diameter d | Circumference C |
|---|---|---|
| 2 cm | [[4 cm]] | [[12.56 cm]] |
| [[5 m]] | 10 m | [[31.4 m]] |
| [[10 cm]] | [[20 cm]] | 62.8 cm |

=> Row 1: d = 2 × 2 = 4 cm. C ≈ 3.14 × 4 = 12.56 cm. (CI1, CI2)
=> Row 2: r = 10 ÷ 2 = 5 m. C ≈ 3.14 × 10 = 31.4 m.
=> Row 3: d ≈ 62.8 ÷ 3.14 = 20 cm. r = 20 ÷ 2 = 10 cm.

### Find the area of this circle.
@viz circle show=r rlabel="r = 6 cm" size=50
(lines 2)
=> r² = 6 × 6 = 36. (CI3)
=> A = πr² ≈ 3.14 × 36 = 113.04. About 113.0 cm².

### A pizza is 40 cm across. Kai says A ≈ 3.14 × 40 × 40 = 5024 cm². Fix his mistake.
@viz circle show=d dlabel="d = 40 cm" fill=sun size=56
(lines 2)
=> Area uses the radius. r = 40 ÷ 2 = 20 cm. (CI3)
=> A ≈ 3.14 × 20 × 20 = 3.14 × 400 = 1256 cm². Targets the "use the diameter in A = πr²" mix-up.

### A circle with a radius of 5 cm is cut into slices. The slices make this shape. Find its height and base. Then find the area.
@viz circlearea sectors=12 hlabel="[[5 cm]]" blabel="[[15.7 cm]]"
(lines 3)
=> The height is the radius: 5 cm. (CI3)
=> The base is half the circumference. C ≈ 3.14 × 10 = 31.4 cm. Half is 15.7 cm.
=> A = base × height ≈ 15.7 × 5 = 78.5 cm². Same as 3.14 × 5 × 5.

### A centre-pivot arm is 300 m long. Find the area of the circle it waters.
@viz circle show=r rlabel="r = 300 m" fill=plant size=56
(lines 2)
=> The arm is the radius. The water covers the inside: area. (CI4)
=> r² = 300 × 300 = 90 000. A ≈ 3.14 × 90 000 = 282 600 m². (That is 28.26 ha.)

### A circle has a radius of 3 cm. Find its circumference and its area. Give the units for each.
@viz circle show=r rlabel="r = 3 cm" size=46
(lines 3)
=> C ≈ 3.14 × 6 = 18.84. About 18.8 cm. It is a length, so cm. (CI4)
=> A ≈ 3.14 × 3 × 3 = 28.26. About 28.3 cm². It is the inside, so cm².
=> Targets the "circumference is in square units" mix-up.

## Challenge

### Each curved end of a running track is a semicircle. The diameter is 70 m. Each straight side is 100 m. How long is one lap?
@viz circle half=1 show=d dlabel="d = 70 m" fill=earth size=60
(lines 3)
=> Two semicircles make one whole circle. C ≈ 3.14 × 70 = 219.8 m. (CI4)
=> One lap = 219.8 + 100 + 100 = 419.8 m.

### A crop circle has a radius of 10 m. A second one has a radius of 20 m. Mia says the second one has twice the area. Is she right?
@viz circle show=r rlabel="r = 10 m" size=35 fill=sun size2=70 show2=r rlabel2="r = 20 m" fill2=sun
(lines 3)
=> Small: A ≈ 3.14 × 10 × 10 = 314 m². Big: A ≈ 3.14 × 20 × 20 = 1256 m². (CI4)
=> 1256 ÷ 314 = 4. No: double the radius makes 4 times the area. Targets the "double the radius, double the area" mix-up.

### A 400 m pivot arm waters a circle in a square field, 800 m by 800 m. How much of the field does not get water?
@viz circle show=r rlabel="r = 400 m" box=1 boxlabel="800 m by 800 m" fill=plant size=60
(lines 3)
=> Square: 800 × 800 = 640 000 m². Circle: A ≈ 3.14 × 400 × 400 = 502 400 m². (CI4)
=> The corners: 640 000 − 502 400 = 137 600 m² get no water.

### A truck tire has a diameter of 70 cm. About how many turns does it make in 1 km? (1 km = 100 000 cm)
(lines 3)
=> One turn: C ≈ 3.14 × 70 = 219.8 cm. (CI2, CI4)
=> 100 000 ÷ 219.8 ≈ 455. About 455 turns.

### A circle has an area of 50.24 cm². Find its radius.
@viz circle show=r rlabel="r = ?" title="A = 50.24 cm²" size=50
(lines 3)
=> A = 3.14 × r². So r² = 50.24 ÷ 3.14 = 16. (CI3)
=> r = 4 cm, because 4 × 4 = 16.

### The end of a round hay bale has a circumference of 5.652 m. Find the diameter. Then find the area of the end.
(lines 3)
=> d ≈ 5.652 ÷ 3.14 = 1.8 m. (CI2, CI3)
=> r = 0.9 m. A ≈ 3.14 × 0.81 = 2.5434. About 2.5 m².

### A circle and a square each have a perimeter of 31.4 cm. Which one covers more area?
(lines 4)
=> Circle: d ≈ 31.4 ÷ 3.14 = 10 cm, so r = 5 cm. A ≈ 3.14 × 25 = 78.5 cm². (CI4)
=> Square: each side is 31.4 ÷ 4 = 7.85 cm. A = 7.85 × 7.85 ≈ 61.6 cm².
=> The circle covers more.
