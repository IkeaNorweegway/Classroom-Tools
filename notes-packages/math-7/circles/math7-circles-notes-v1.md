---
title: Circles
topic: circles
strand: measurement-geometry
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "The radius and the diameter are the same" (CI1). "Use the radius in C = πd" (CI2,
     added: the same halving/doubling slip from the other side). "Use the diameter in A = πr²" (CI3).
     "Circumference is in square units" and "Double the radius, double the area" (CI4).
     Section order: the parts of a circle and d = 2r first (CI1), because every formula needs the radius or the
     diameter and the right one of the two. Then circumference (CI2): measuring real circles gives C ÷ d ≈ 3.14,
     so π arrives as a measured number before it is a symbol. Then area (CI3), which needs "half the circumference"
     from CI2 for the base of the rearranged slices. Last, mixed problems (CI4), where students choose edge or
     inside and the units. Outcome 7M1. π ≈ 3.14 throughout. Finding r from an area is a ★ stretch only
     (perfect squares). No arcs or sectors beyond the area derivation. -->

## Pre-Knowledge Check
1. Find half of 18.
2. Find 3.14 × 10.
3. A square has sides of 5 cm. Find its area. Give the units.
4. A rectangle is 8 cm long and 3 cm wide. Find its perimeter.
5. A parallelogram has a base of 6 cm and a height of 4 cm. Find its area.
6. Round 23.864 to one decimal place.

## Section 1: Parts of a circle
Learning target: I can name the parts of a circle. I can draw a circle with a compass.

### Vocabulary
- circle :: all the points that are the same distance from one point, the centre :: the edge of a hula hoop
- centre :: the point in the middle of a circle :: point O
- radius (r) :: a segment from the centre to the circle. Two or more are called radii. :: a spoke on a bike wheel
- diameter (d) :: a segment across the circle, through the centre. It is two radii long. :: d = 2r
- circumference (C) :: the distance around a circle :: the crust of a pizza
- compass :: a tool for drawing circles :: open it to the radius

#### Same distance from the centre
Look at a bike wheel. Every spoke goes from the hub to the rim. All the spokes are the same length. That makes the wheel round.
@viz circle show=r rlabel="r" spokes=8 size=66 caption="Every radius of a circle is the same length."
A **circle** is all the points that are the same distance from the **centre**. That distance is the **radius**.
A **diameter** goes all the way across, through the centre. It is two radii, end to end.
@viz circle show=rd rlabel="radius r" dlabel="diameter d" clabel="circumference C" centre="O" caption="The parts of a circle."

::: key Radius and diameter
**d = 2 × r** The diameter is 2 radii.
**r = d ÷ 2** The radius is half the diameter.
The radius sets the size of a circle. A bigger radius makes a bigger circle.
:::

::: misconception
WRONG: "The radius and the diameter are the same."
WHY: The radius goes from the centre to the edge. The diameter goes all the way across. Fold a paper circle in half. The fold is a diameter. It is two radii long.
@viz circle show=rd rlabel="r = 4 cm" dlabel="d = 8 cm" size=60
RIGHT: The diameter is two radii: d = 2r.
:::

::: example Worked Example 1 — A face-off circle
A face-off circle on a hockey rink has a radius of 4.5 m. Find the diameter.
@viz circle show=rd rlabel="r = 4.5 m" dlabel="d = [[9 m]]" fill=cold size=64
Step 1: The diameter is two radii. d = 2 × r.
Step 2: d = 2 × 4.5 = [[9]].
Step 3: The diameter is [[9 m]].
:::

::: example Worked Example 2 — A pizza
Mia's pizza has a diameter of 30 cm. Find the radius.
@viz circle show=rd rlabel="r = [[15 cm]]" dlabel="d = 30 cm" fill=sun size=64
Step 1: The radius is half the diameter. r = d ÷ 2.
Step 2: r = 30 ÷ 2 = [[15]].
Step 3: The radius is [[15 cm]].
:::
::: explain
In Worked Example 2, why do we divide by 2?
(lines 2)
=> The diameter is made of two radii. So one radius is half of it.
:::

#### Draw a circle with a compass
1. Open the compass. Use a ruler to set the gap to the radius.
2. Put the sharp point on the centre. Hold it still.
3. Turn the pencil all the way around.
@viz compass r=3 rlabel="3 cm" caption="Drawing a circle with a radius of 3 cm."
You can also use GeoGebra. Pick the tool "Circle with Centre and Radius". Click a point. Type the radius.

::: example Worked Example 3 — Draw a circle 8 cm across
Sam wants a circle with a diameter of 8 cm. How wide should he open the compass?
@viz compass r=4 rlabel="[[4 cm]]"
Step 1: A compass is set to the radius, not the diameter.
Step 2: r = 8 ÷ 2 = [[4]]. Open the compass to [[4 cm]].
Step 3: Put the point on the centre. Turn all the way around.
Step 4: Check: measure across the circle, through the centre. Is it 8 cm?
:::

::: example Worked Example 4 — Which circle is bigger?
Ben draws a circle with a radius of 2 cm. Tess draws a circle with a diameter of 5 cm.
@viz circle show=r rlabel="r = 2 cm" size=40 title="Ben" size2=50 show2=d dlabel2="d = 5 cm" title2="Tess"
Step 1: Compare the same thing. Change Tess's diameter to a radius.
Step 2: Tess: r = 5 ÷ 2 = 2.5 cm. Ben: r = 2 cm.
Step 3: 2.5 cm is more than 2 cm. So [[Tess's]] circle is bigger.
:::

::: try
1. A circle has a radius of 6 cm. Find the diameter. [[d = 2 × 6 = 12 cm]]
2. A bike wheel has a diameter of 66 cm. Find the radius. [[r = 66 ÷ 2 = 33 cm]]
3. Name the two labelled segments. What is point O called?
@viz circle show=rd rlabel="[[radius]]" dlabel="[[diameter]]" centre="O" size=66
[[Point O is the centre.]]
4. Is the line across this circle a diameter? Say why.
@viz circle show=none chord=1 size=56
[[No. It does not go through the centre.]]
5. Kai has two circles. One has r = 5 cm. One has d = 10 cm. He says they are the same size. Is he right? [[Yes. d = 10 cm means r = 10 ÷ 2 = 5 cm.]]
6. Zoe wants a circle 6 cm across. How wide should she open her compass? [[3 cm. The compass uses the radius: 6 ÷ 2 = 3.]]
:::
::: retrieval
1. Find 2 × 7.5.
=> 15
2. Find 3.14 × 10.
=> 31.4
3. Find 6².
=> 36
4. Name the vertex of ∠ABC.
=> B
5. ★ Stretch: Circle A has a radius of 2.5 cm. Circle B's diameter is 3 times circle A's diameter. Find circle B's radius.
=> A's diameter is 5 cm. B's diameter is 15 cm. B's radius is 7.5 cm.
:::

## Section 2: Circumference and π
Learning target: I can find the circumference from the diameter or the radius. I can find the diameter from the circumference.

### Vocabulary
- circumference (C) :: the distance around a circle. It is a length, like cm or m. :: the rim of a bike wheel
- pi (π) :: the number of diameters that fit around any circle. π ≈ 3.14 :: C ÷ d = π
- ≈ :: means "is about equal to" :: π ≈ 3.14
- formula :: a rule written with letters :: C = πd

#### Measure real circles
1. Wrap a string around a lid. Mark where the string meets itself.
2. Lay the string on a ruler. That length is the circumference, C.
3. Measure the diameter, d, across the middle.
4. Find C ÷ d with a calculator.

| Object | C (cm) | d (cm) | C ÷ d |
|---|---|---|---|
| Hockey puck | 24.0 | 7.6 | 3.16 |
| Jar lid | 22.0 | 7.0 | 3.14 |
| Paper plate | 72.0 | 23.0 | 3.13 |
| Bike wheel | 207 | 66 | 3.14 |
| Hula hoop | 240 | 76 | 3.16 |

@viz bar data="Puck:3.16;Lid:3.14;Plate:3.13;Wheel:3.14;Hoop:3.16" values=1 ymin=0 ymax=4 ystep=1 title="C ÷ d for five circles" ylabel="C ÷ d" caption="Small or big, every circle gives a bit more than 3."
C ÷ d is always about the same number. It is a bit more than 3. This number is called **pi**. Its symbol is **π**. π ≈ 3.14.
Our strings and rulers are not perfect. That is why the table is not always exactly 3.14.

#### Roll a wheel
Put a mark on a wheel. Roll it along the floor for one full turn.
@viz wheel dlabel="d" caption="One turn rolls out 3 diameters and a bit more. That is π diameters."
@viz coord xmin=0 xmax=80 ymin=0 ymax=250 xstep=10 ystep=50 points="7,22;23,72;66,207;76,240" line=1 xlabel="diameter d (cm)" ylabel="circumference C (cm)" width=360 caption="The points from the table make a straight line. C is always about 3.14 times d."

::: key Circumference
**C = π × d**, written **C = πd**. Use π ≈ 3.14.
Know the radius? Double it first. Or use **C = 2 × π × r**.
Know C? Find the diameter: **d = C ÷ π**.
Estimate first: C is a bit more than 3 × d.
:::

::: example Worked Example 1 — A hockey puck
A hockey puck has a diameter of 7.6 cm. Find its circumference.
@viz circle show=d dlabel="d = 7.6 cm" clabel="C = [[23.9 cm]]" size=56
Step 1: Estimate. 3 × 7.6 = 22.8. So C is a bit more than 22.8 cm.
Step 2: C = πd ≈ 3.14 × 7.6 = [[23.864]].
Step 3: Round to one decimal place. C ≈ [[23.9 cm]].
:::

::: example Worked Example 2 — One turn of a bike wheel
A bike wheel has a radius of 33 cm. How far does it roll in one turn?
@viz wheel dlabel="d = [[66 cm]]" clabel="one turn = [[207.2 cm]]"
Step 1: One turn rolls out the circumference.
Step 2: Double the radius: d = 2 × 33 = [[66]] cm.
Step 3: C ≈ 3.14 × [[66]] = [[207.24]]. The wheel rolls about [[207.2 cm]].
Step 4: Or use C = 2πr: 2 × 3.14 × 33. You get the same answer.
:::

::: misconception
WRONG: "The radius is 33 cm, so C ≈ 3.14 × 33."
WHY: C = πd uses the diameter. 3.14 × 33 = 103.62. That only goes half way around!
@viz circle show=rd rlabel="r = 33 cm" dlabel="d = 66 cm" size=56
RIGHT: Double the radius first: d = 66 cm. Then C ≈ 3.14 × 66 ≈ 207.2 cm.
:::
::: explain
Why does C = 2πr give the same answer as C = πd?
(lines 2)
=> 2 × r is the diameter. So 2 × π × r is the same as π × d.
:::

::: example Worked Example 3 — A poplar tree
Noor wraps a tape around a poplar tree. The circumference is 157 cm. Find the diameter.
@viz circle show=d dlabel="d = [[50 cm]]" clabel="C = 157 cm" fill=plant size=56
Step 1: C = π × d. So d = C ÷ π.
Step 2: d ≈ 157 ÷ 3.14 = [[50]].
Step 3: The tree is about [[50 cm]] across.
Check: multiply your answer by 3.14. Do you get 157?
:::

::: try
1. A jar lid has a diameter of 9 cm. Find C. [[C ≈ 3.14 × 9 = 28.26. About 28.3 cm.]]
2. A hula hoop has a radius of 40 cm. Find C.
@viz circle show=r rlabel="r = 40 cm" size=50
[[d = 80 cm. C ≈ 3.14 × 80 = 251.2 cm.]]
3. A round table has a circumference of 314 cm. Find its diameter. [[d ≈ 314 ÷ 3.14 = 100 cm.]]
4. A circle has a radius of 3 cm. Leo says C ≈ 3.14 × 3. Fix his mistake. [[C = πd needs the diameter. d = 6 cm. C ≈ 3.14 × 6 = 18.84, about 18.8 cm.]]
5. A wheel has a diameter of 50 cm. Is C closer to 100 cm, 150 cm or 200 cm? [[150 cm. 3 × 50 = 150, and a bit more. (C ≈ 157 cm.)]]
:::
::: retrieval
1. A circle has a diameter of 14 cm. Find the radius.
=> 7 cm
2. Find 3.14 × 2.5.
=> 7.85
3. Find 10².
=> 100
4. Find 25% of 80.
=> 20
5. ★ Stretch: A circle has a circumference of 31.4 cm. Find its radius.
=> d = 31.4 ÷ 3.14 = 10 cm. So r = 5 cm.
:::

## Section 3: Area of a circle
Learning target: I can explain where A = πr² comes from. I can find the area of a circle from its radius or diameter.

### Vocabulary
- area :: the space inside a shape. It is in square units. :: cm², m²
- sector :: a slice of a circle, like a slice of pizza :: 1 of 8 slices
- r² :: "r squared" means r × r :: 5² = 5 × 5 = 25
- parallelogram :: a shape with 4 sides and 2 pairs of parallel sides. Area = base × height. :: a rectangle pushed over

#### How many r-squares fit?
Draw a square on the radius. Its area is r × r, or r².
@viz circle show=r rsq=1 rlabel="r" rsqlabel="r²" size=60 caption="Four of these squares would cover the whole circle and more."
The circle covers about 3 and a bit of these squares. That number is π again!

#### Cut and rearrange
1. Cut a paper circle into 8 equal slices. Each slice is a **sector**.
2. Lay the slices in a row: tip up, tip down, tip up.
3. The shape looks like a bumpy parallelogram.
@viz circlearea sectors=8 hlabel="r" blabel="half of C" caption="8 slices make a bumpy parallelogram."
4. Cut more slices. The bumps get flatter. The shape gets closer to a rectangle.
@viz circlearea sectors=16 hlabel="r" blabel="half of C" caption="16 slices. Half the crust is on top. Half is on the bottom."

::: key Area of a circle
The height of the shape is the radius: **r**.
The base is half the circumference. Half of 2 × π × r is **π × r**.
Area = base × height = π × r × r.
So **A = πr²**. Use π ≈ 3.14. Area is in square units, like cm² or m².
:::

::: example Worked Example 1 — Slices of a circle with r = 10 cm
@viz circlearea sectors=12 hlabel="10 cm" blabel="half of C = [[31.4 cm]]"
Step 1: The height of the shape is the radius: 10 cm.
Step 2: C ≈ 3.14 × 20 = 62.8 cm. Half of C is [[31.4 cm]].
Step 3: A = base × height ≈ [[31.4]] × 10 = [[314]] cm².
Step 4: Check with the rule: A = 3.14 × 10 × 10. Is it the same?
:::

::: example Worked Example 2 — A face-off circle
A face-off circle has a radius of 4.5 m. Find its area.
@viz circle show=r rlabel="r = 4.5 m" title="A = [[63.6 m²]]" fill=cold size=60
Step 1: Estimate. 4.5 × 4.5 is about 20. 3 × 20 = 60. So A is a bit more than 60 m².
Step 2: r² = 4.5 × 4.5 = [[20.25]].
Step 3: A ≈ 3.14 × [[20.25]] = [[63.585]].
Step 4: Round to one decimal place. A ≈ [[63.6 m²]].
:::

::: misconception
WRONG: "The pizza is 30 cm across, so A ≈ 3.14 × 30 × 30."
WHY: A = πr² uses the radius. 3.14 × 30 × 30 = 2826 cm². That is 4 times too big!
@viz circle show=rd rlabel="r = 15 cm" dlabel="d = 30 cm" fill=sun size=60
RIGHT: Halve the diameter first: r = 15 cm. A ≈ 3.14 × 15 × 15 = 706.5 cm².
:::

::: example Worked Example 3 — A round hay bale
The end of a round hay bale is a circle. It is 1.8 m across. Find its area.
@viz circle show=d dlabel="d = 1.8 m" fill=sun size=56 caption="The end of a round bale"
Step 1: Area needs the radius. r = 1.8 ÷ 2 = [[0.9 m]].
Step 2: r² = [[0.9 × 0.9 = 0.81]].
Step 3: A ≈ 3.14 × [[0.81]] = [[2.5434]].
Step 4: Round to one decimal place. A ≈ [[2.5 m²]].
:::
::: explain
In the cut-up circle, why is the height of the shape the radius?
(lines 2)
=> Each slice goes from the centre to the edge. Standing up, a slice is one radius tall.
:::

::: try
1. A circle has a radius of 3 cm. Find its area.
@viz circle show=r rlabel="r = 3 cm" size=40
[[A ≈ 3.14 × 3 × 3 = 28.26. About 28.3 cm².]]
2. A plate has a diameter of 20 cm. Find its area. [[r = 10 cm. A ≈ 3.14 × 10 × 10 = 314 cm².]]
3. Find the area of this circle.
@viz circle show=d dlabel="d = 12 m" size=50
[[r = 6 m. A ≈ 3.14 × 36 = 113.04. About 113.0 m².]]
4. A circle has a diameter of 8 cm. Omar says A ≈ 3.14 × 8 × 8. Fix his mistake. [[Use the radius, 4 cm. A ≈ 3.14 × 4 × 4 = 50.24. About 50.2 cm².]]
5. A circle has a radius of 5 cm. Is its area closer to 25 cm², 75 cm² or 150 cm²? [[75 cm². 3 × 25 = 75, and a bit more. (A ≈ 78.5 cm².)]]
:::
::: retrieval
1. Find C for a circle with a diameter of 10 cm.
=> C ≈ 3.14 × 10 = 31.4 cm
2. A circle has a radius of 2.5 m. Find its diameter.
=> 5 m
3. Find 1.2 × 1.2.
=> 1.44
4. Solve 3x + 4 = 19.
=> 3x = 15, so x = 5.
5. Find 7².
=> 49
6. ★ Stretch: A circle has an area of 314 cm². Find its radius.
=> r² = 314 ÷ 3.14 = 100. r = 10 cm, because 10 × 10 = 100.
:::

## Section 4: Circle problems
Learning target: I can choose circumference or area to solve a problem. I can use the right units.

### Vocabulary
- square units :: units for area, like cm² and m². They count squares. :: 706.5 cm²
- semicircle :: half of a circle :: the curved end of a running track
- hectare (ha) :: a square 100 m by 100 m. 1 ha = 10 000 m². :: farm fields are measured in hectares
- centre pivot :: a long water pipe on wheels. It turns around a centre and waters a circle. :: canola fields in southern Alberta

#### Edge or inside?
The circumference is the edge. It is a length, in cm or m.
The area is the inside. It is in square units, cm² or m².
@viz circle show=d dlabel="d = 30 cm" clabel="crust: C" alabel="cheese: A" fill=sun size=66 caption="The crust is the circumference. The cheese is the area."

| The question asks about … | Use | Units |
|---|---|---|
| a fence, an edge, a crust, a rim, one turn of a wheel | C = πd | cm, m |
| grass, paint, cheese, a cover, the space inside | A = πr² | cm², m² |

::: misconception
WRONG: "The pizza's circumference is 94.2 cm²."
WHY: Circumference is a length. You could lay a string around the crust. A string has no square units.
@viz circle show=d dlabel="d = 30 cm" clabel="C ≈ 94.2 cm" fill=sun size=56
RIGHT: Circumference is in cm or m. Area is in cm² or m².
:::

#### Steps for a circle problem
@viz flow steps="Read and draw|r or d?|Edge or inside?|Estimate|Solve|Check the units"

::: example Worked Example 1 — A centre-pivot field
A pivot arm is 400 m long. It turns around a centre. It waters a circle of canola. Find the area it waters.
@viz circle show=r rlabel="r = 400 m" box=1 boxlabel="field: 800 m by 800 m" fill=plant size=66 caption="A centre pivot waters a circle inside a square field."
Step 1: The arm is the radius: r = 400 m. The water covers the inside. Find the area.
Step 2: r² = 400 × 400 = [[160 000]].
Step 3: A ≈ 3.14 × [[160 000]] = [[502 400 m²]].
Step 4: In hectares: [[502 400 ÷ 10 000 = 50.24 ha]].
:::

::: example Worked Example 2 — The pivot's wheels
The far end of the arm rides on wheels. How far do they go in one full turn?
@viz circle show=r rlabel="r = 400 m" clabel="one turn = [[2512 m]]" fill=plant size=56
Step 1: One turn goes around the edge. Find the [[circumference]].
Step 2: d = 2 × 400 = [[800 m]].
Step 3: C ≈ 3.14 × [[800]] = [[2512 m]].
:::
::: explain
In Worked Example 1 we found the area. In Worked Example 2 we found the circumference. How did you know which one?
(lines 2)
=> The water covers the inside of the circle: area. The wheels go around the edge: circumference.
:::

::: example Worked Example 3 — The curved end of a running track
The curved end of a running track is a semicircle. Its diameter is 73 m. How long is the curve?
@viz circle half=1 show=d dlabel="d = 73 m" clabel="curve = [[114.6 m]]" fill=earth size=70
Step 1: The curve is half of a whole circle's circumference.
Step 2: C ≈ 3.14 × 73 = [[229.22]] m.
Step 3: Half of that: [[229.22 ÷ 2 = 114.61]]. The curve is about [[114.6 m]].
:::

#### Double the radius
A square with side 2 holds 4 small squares. Double the side to 4. Now it holds 16. That is 4 times as many.
@viz squares shapes="2x2;4x4" labels="side 2: 4 squares;side 4: 16 squares" caption="Double the side: 4 times the area."
Area of a circle uses r × r. So the same thing happens.

::: misconception
WRONG: "Double the radius, double the area."
WHY: A = π × r × r. Both r's double. 2 × 2 = 4.
@viz circle show=r rlabel="r = 2 m" title="A ≈ 12.56 m²" size=36 size2=72 show2=r rlabel2="r = 4 m" title2="A ≈ 50.24 m²"
RIGHT: Double the radius, and the area is 4 times as big. 12.56 × 4 = 50.24.
:::

::: example Worked Example 4 — A bigger garden
Lily has a round garden with a radius of 3 m. She doubles the radius. How many times bigger is the area?
@viz circle show=r rlabel="r = 3 m" title="A ≈ [[28.26 m²]]" fill=plant size=33 size2=66 show2=r rlabel2="r = 6 m" title2="A ≈ [[113.04 m²]]" fill2=plant
Step 1: Small garden: A ≈ 3.14 × 3 × 3 = [[28.26 m²]].
Step 2: Big garden: A ≈ 3.14 × 6 × 6 = [[113.04 m²]].
Step 3: Big area ÷ small area: [[113.04 ÷ 28.26 = 4]]. The area is [[4 times]] as big.
:::

::: try
1. A tire has a diameter of 70 cm. How far does it roll in one turn?
@viz wheel dlabel="70 cm" clabel="one turn"
[[One turn is the circumference. C ≈ 3.14 × 70 = 219.8 cm.]]
2. The centre circle at a hockey rink has a radius of 4.5 m. A painter paints the line around it. How long is the line? [[Edge: circumference. d = 9 m. C ≈ 3.14 × 9 = 28.26. About 28.3 m.]]
3. A round tablecloth has a diameter of 2 m. Find its area. Give the units. [[r = 1 m. A ≈ 3.14 × 1 × 1 = 3.14 m².]]
4. Zoe says a circle's circumference is 31.4 cm². Fix her mistake. [[Circumference is a length. It is 31.4 cm, not cm².]]
5. Circle A has r = 5 cm. Circle B has r = 10 cm. Raj says B has twice the area. Is he right? [[No. A ≈ 78.5 cm². B ≈ 314 cm². B is 4 times as big.]]
6. ★ Stretch: A circle has an area of 28.26 m². Find its radius. [[r² = 28.26 ÷ 3.14 = 9. r = 3 m, because 3 × 3 = 9.]]
:::
::: retrieval
1. Find the diameter of a circle with r = 8 cm.
=> 16 cm
2. Find C for a circle with d = 20 m.
=> C ≈ 3.14 × 20 = 62.8 m
3. Find A for a circle with r = 2 cm.
=> A ≈ 3.14 × 2 × 2 = 12.56 cm²
4. Find 5% of 200.
=> 10
5. Find −4 × 6.
=> −24
6. ★ Stretch: A circle has C = 31.4 cm. A square has sides of 8 cm. Which covers more?
=> Circle: d = 10 cm, r = 5 cm, A ≈ 78.5 cm². Square: 8 × 8 = 64 cm². The circle covers more.
:::

## Unit Synthesis
1. The end of a round hay bale is 1.6 m across.
a) Find the circumference of the end. b) Find the area of the end. c) Net wrap goes around the bale once. Which answer tells its length?
@viz circle show=d dlabel="d = 1.6 m" fill=sun size=50
=> a) C ≈ 3.14 × 1.6 = 5.024. About 5.0 m.
=> b) r = 0.8 m. r² = 0.64. A ≈ 3.14 × 0.64 = 2.0096. About 2.0 m².
=> c) The circumference. The wrap goes around the edge.
2. Use the cut-up circle to explain where A = πr² comes from.
@viz circlearea sectors=12 hlabel="r" blabel="half of C"
=> The slices make a shape close to a parallelogram. Its height is r. Its base is half of C, which is πr. Area = πr × r = πr².
3. A pivot arm is 200 m long. Find the area it waters.
=> r² = 200 × 200 = 40 000. A ≈ 3.14 × 40 000 = 125 600 m² (12.56 ha).
4. A circle has C = 62.8 cm. Leo says its radius is 20 cm. Check his answer.
=> d ≈ 62.8 ÷ 3.14 = 20 cm. That is the diameter. The radius is 10 cm.
5. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Parts of a circle
Every point on a circle is the same distance from the centre.
Radius r: centre to edge. Diameter d: across, through the centre. **d = 2r** and **r = d ÷ 2**.
To draw a circle, open the compass to the radius.
:::
@viz circle show=rd rlabel="radius r" dlabel="diameter d" clabel="circumference C" centre="O" size=60

::: key Circumference and π
C ÷ d is the same for every circle: **π ≈ 3.14**.
**C = πd** or **C = 2πr**. To find d from C: **d = C ÷ 3.14**.
:::
@viz wheel dlabel="d"

::: key Area of a circle
Cut a circle into slices. Make a parallelogram: height r, base half of C (πr).
**A = πr²** = 3.14 × r × r. Use the radius. Square units: cm², m².
:::
@viz circlearea sectors=12 hlabel="r" blabel="half of C = πr"

::: key Circle problems
Edge (fence, crust, one turn): C, in cm or m. Inside (grass, cheese, water): A, in cm² or m².
Double the radius: C doubles, but A is 4 times as big.
Round to one decimal place. Check with an estimate: C is about 3 × d. A is about 3 × r².
:::

| Mistake | Fix |
|---|---|
| The radius and the diameter are the same | The diameter is two radii: d = 2r. |
| Setting the compass to the diameter | A compass is set to the radius. |
| Using r in C = πd | C = πd needs d. Double r first, or use C = 2πr. |
| Using d in A = πr² | Area uses r. Halve d first. |
| Circumference in cm² | C is a length: cm or m. Area is cm² or m². |
| Double the radius, double the area | The area is 4 times as big: (2r)² = 4r². |
