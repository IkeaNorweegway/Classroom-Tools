---
title: Surface Area and Volume
topic: surface-area-volume
strand: measurement-geometry
---
<!-- Gate: progressive blanking confirmed. Refutation-first on: "the rectangle in a cylinder's net is as long as the diameter" (SV1),
     "SA of a rectangular prism = 6 × one face" (SV2), "surface area and volume measure the same thing" (SV2, SV4),
     "turning the box changes its volume" (SV4).
     Section order: nets (SV1, the bridge from 3-D to flat) → SA of prisms (SV2) → SA of cylinders (SV3) → volume (SV4).
     Codes SV1–SV4. Outcomes SS2, SS3, SS4. Uses π ≈ 3.14. -->

## Pre-Knowledge Check
1. What is the area of a rectangle 5 cm by 3 cm? Of a triangle with base 6 cm and height 4 cm?
2. What is the difference between wrapping a box and filling a box?
3. What is the area of a circle with radius 2 cm? (Area = π × r × r)

## Section 1: Nets
Learning target: I can draw and recognize nets of rectangular prisms, triangular prisms and cylinders.

### Vocabulary
- net :: a flat shape that folds up into a 3-D object :: a cereal box cut open and laid flat
- face :: a flat surface of a 3-D object :: a box has 6 faces
- prism :: a 3-D object with two matching ends (bases) joined by rectangles :: a box, a tent
- base :: the matching end shapes of a prism or cylinder :: the triangles of a tent

Cut open a cereal box and lay it flat. You get a **net**.

@viz prism l="length" w="width" h="height" lv=6 wv=3 hv=5 caption="A rectangular prism has 6 rectangular faces."
@viz net type=box l="l" w="w" h="h" lv=6 wv=3 hv=5 n1="front" n2="back" n3="side" n4="side" n5="top" n6="bottom" caption="Its net: 4 faces in a row, with the top and bottom attached."

A rectangular prism has [[6]] faces. They come in [[3]] matching pairs.

::: example Worked Example 1 — A tent: a triangular prism
@viz triprism b="base" th="height" s="slant" l="length" bv=6 thv=4 lv=8
@viz net type=tri b="base" th="h" s="slant" l="length" bv=6 thv=4 lv=8
A triangular prism has [[2]] triangles (the bases) and [[3]] rectangles.
:::

::: explain
Why does a triangular prism have exactly 3 rectangles?
(lines 2)
=> The triangle has 3 sides. Each side of the triangle is joined to a rectangle that runs the length of the prism.
:::

::: misconception
WRONG: "In the net of a cylinder, the rectangle is as long as the diameter of the circle."
WHY: The rectangle wraps all the way around the circle. Its length is the distance around: the circumference.
RIGHT: Rectangle length = circumference = π × d (about 3.14 times the diameter).
@viz net type=cyl r="r" h="h" rv=2 hv=4 c="length = [[circumference = πd]]"
:::

::: try
Which object does each net make?
@viz net type=box l="" w="" h="" lv=4 wv=4 hv=4
a) [[a cube]]
@viz net type=cyl r="" h="" rv=1.5 hv=5
b) [[a cylinder]]
c) How many faces does a triangular prism have? [[5]]
:::

::: retrieval
1. Sketch a net of a rectangular prism.
(work 3)
=> Six rectangles: four in a row, one on top and one below.
2. How many triangles and how many rectangles are in the net of a triangular prism?
=> 2 triangles and 3 rectangles.
3. A can has a diameter of 8 cm. How long is the rectangle in its net?
=> π × 8 ≈ 25.1 cm
4. Leo says a cylinder's net is "two circles and a square." When could that be true? Is it usually true?
=> Only if the height equals the circumference. Usually it is a rectangle.
5. ★ Stretch: Can these six squares fold into a cube: a row of 4, with one square above the first and one below the last? Explain.
=> Yes. The row of 4 wraps around; the other two fold up as the top and bottom on opposite ends.
:::

## Section 2: Surface area of prisms
Learning target: I can find the surface area of a rectangular prism and a triangular prism.

### Vocabulary
- surface area (SA) :: the total area of all the faces; the "wrapping" :: measured in cm² or m²
- square units :: units for area :: cm², m²

**Surface area** = the area of every face added up. Use the net.

::: example Worked Example 2 — A cereal box: 20 cm × 6 cm × 30 cm
@viz prism l="20 cm" w="6 cm" h="30 cm" lv=20 wv=6 hv=30
| Pair of faces | One face | Two faces |
|---|---|---|
| front and back | 20 × 30 = [[600]] | [[1200]] |
| top and bottom | 20 × 6 = [[120]] | [[240]] |
| two sides | 6 × 30 = [[180]] | [[360]] |
| **Total SA** | | [[1800 cm²]] |
:::

::: misconception
WRONG: "A box has 6 faces, so SA = 6 × the area of the front."
WHY: Only a cube has 6 equal faces. The cereal box's faces are three different sizes.
RIGHT: Find the three pairs and add them: 2(lw) + 2(lh) + 2(wh).
:::

::: key Rectangular prism
SA = 2lw + 2lh + 2wh (three pairs of rectangles)
:::

::: explain
Why do we multiply each face by 2?
(lines 2)
=> Every face of a rectangular prism has a matching face on the opposite side.
:::

::: example Worked Example 3 — A tent (triangular prism)
Triangle: base 6 m, height 4 m, slant sides 5 m. Tent length 8 m.
@viz triprism b="6 m" th="4 m" s="5 m" l="8 m" bv=6 thv=4 lv=8
2 triangles: 2 × ({1/2} × 6 × 4) = [[24]] m²
Bottom rectangle: 6 × 8 = [[48]] m²
2 slanted rectangles: 2 × (5 × 8) = [[80]] m²
SA = 24 + 48 + 80 = [[152]] m²
:::

::: explain
Why don't we use the 4 m height for the slanted rectangles?
(lines 2)
=> The slanted rectangles are 5 m wide (the slant side). The 4 m height is inside the triangle, not along a face.
:::

::: connection
The slant side of a tent can be found with the Pythagorean theorem. Half the base is 3 m and the height is 4 m. What is the slant side?
=> √(3² + 4²) = √25 = 5 m
:::

::: try
a) Find the SA of a box 10 cm × 4 cm × 5 cm.
(work 3)
=> 2(40) + 2(50) + 2(20) = 80 + 100 + 40 = 220 cm²
b) Find the SA of a cube with sides of 3 cm.
(work 2)
=> 6 × 9 = 54 cm² (all faces match)
:::

::: retrieval
1. What does surface area measure? What units does it use?
=> The total area of all the faces (the outside covering). Square units, like cm².
2. Find the SA of a box 5 cm × 2 cm × 3 cm.
=> 2(10) + 2(15) + 2(6) = 62 cm²
3. A triangular prism has triangles with base 4 cm and height 3 cm, slant sides 3.6 cm, and length 10 cm. Find its SA.
=> Triangles 2 × 6 = 12; base rectangle 40; slanted 2 × 36 = 72. SA = 124 cm²
4. Why is "6 × the front" wrong for a cereal box?
=> The faces are different sizes; only a cube has 6 equal faces.
5. ★ Stretch: How much wrapping paper covers a 30 cm × 20 cm × 10 cm gift, if you need 10% extra for overlap?
=> SA = 2(600) + 2(300) + 2(200) = 2200 cm². With 10% extra: 2420 cm².
:::

## Section 3: Surface area of cylinders
Learning target: I can find the surface area of a cylinder.

### Vocabulary
- radius (r) :: centre of a circle to its edge :: half the diameter
- circumference (C) :: the distance around a circle :: C = 2πr = πd
- π (pi) :: about 3.14 :: C ÷ d for every circle

A cylinder's net is **2 circles** and **1 rectangle**.

@viz net type=cyl r="r" h="h" rv=2 hv=4 c="2πr"

::: key Cylinder
SA = 2 circles + rectangle
SA = [[2πr²]] + [[2πr × h]]
:::

::: example Worked Example 4 — A soup can: r = 4 cm, h = 10 cm
@viz cylinder r="4 cm" h="10 cm" rv=4 hv=10
2 circles: 2 × 3.14 × 4 × 4 = [[100.48]] cm²
Rectangle: circumference × height = 2 × 3.14 × 4 × 10 = [[251.2]] cm²
SA = 100.48 + 251.2 = [[351.68]] cm² ≈ 351.7 cm²
:::

::: explain
Why is the rectangle's length 2πr?
(lines 2)
=> The rectangle wraps once around the circle, so its length is the circumference, 2πr.
:::

::: example Worked Example 5 — A round hay bale: diameter 1.6 m, length 1.2 m
Radius = 1.6 ÷ 2 = [[0.8]] m
2 circles: 2 × 3.14 × 0.8² = [[4.02]] m²
Rectangle: 3.14 × 1.6 × 1.2 = [[6.03]] m²
SA ≈ [[10.05]] m² (the plastic wrap needed)
@viz cylinder r="1.6 m" h="1.2 m" rv=0.8 hv=1.2 diameter=1
:::

::: try
a) Find the SA of a cylinder with r = 3 cm and h = 5 cm.
(work 3)
=> 2(3.14)(9) + 2(3.14)(3)(5) = 56.52 + 94.2 = 150.72 cm²
b) A label covers only the side of a can (no top or bottom). The can has d = 7 cm and h = 11 cm. How big is the label?
(work 2)
=> 3.14 × 7 × 11 = 241.78 cm²
:::

::: retrieval
1. Name the three parts of a cylinder's net.
=> Two circles and one rectangle.
2. A cylinder has r = 2 cm and h = 6 cm. Find its SA.
=> 2(3.14)(4) + 2(3.14)(2)(6) = 25.12 + 75.36 = 100.48 cm²
3. Why do we use the radius, not the diameter, in πr²?
=> The area of a circle is π × r × r. Using d would give 4 times too much.
4. A paper towel tube is open at both ends. What part of the SA formula do you leave out?
=> The two circles. Only the rectangle (2πrh) counts.
5. ★ Stretch: Which needs more metal: a can with r = 5, h = 5, or a can with r = 3, h = 12? Show your work.
=> First: 2(3.14)(25) + 2(3.14)(5)(5) = 157 + 157 = 314. Second: 2(3.14)(9) + 2(3.14)(3)(12) = 56.52 + 226.08 = 282.6. The first needs more.
:::

## Section 4: Volume of prisms and cylinders
Learning target: I can find the volume of a prism or a cylinder with V = area of base × height.

### Vocabulary
- volume :: the space inside a 3-D object; the "filling" :: measured in cm³ or m³
- cubic units :: units for volume :: cm³, m³
- area of the base (A) :: the area of the end shape :: a rectangle, triangle or circle

::: misconception
WRONG: "Surface area and volume measure the same thing."
WHY: Surface area is the wrapping (flat, square units). Volume is the filling (space, cubic units). A box can have a big SA and a small volume.
RIGHT: SA → cm². Volume → cm³.
:::

Stack layers of the base. Each layer has the same area. The number of layers is the height.

@viz blocks heights="3,3,3;3,3,3" views=none front=0 caption="3 layers of 6 cubes: 6 × 3 = 18 cubes."

::: key Volume of any prism or cylinder
V = area of the base × height
Rectangular prism: V = l × w × h
Triangular prism: V = ({1/2} × b × h of triangle) × length
Cylinder: V = π × r² × h
:::

::: example Worked Example 6 — Cereal box: 20 cm × 6 cm × 30 cm
V = 20 × 6 × 30 = [[3600]] cm³
:::

::: example Worked Example 7 — The tent: triangle b = 6 m, h = 4 m, length 8 m
Area of base: {1/2} × 6 × 4 = [[12]] m²
V = 12 × 8 = [[96]] m³
:::

::: example Worked Example 8 — A grain bin: r = 5 m, h = 6 m
@viz cylinder r="5 m" h="6 m" rv=5 hv=6
Area of base: 3.14 × 5 × 5 = [[78.5]] m²
V = 78.5 × 6 = [[471]] m³
:::

::: explain
Why does V = area of base × height work for all three shapes?
(lines 2)
=> Each one is a stack of identical layers the shape of its base. Area of one layer × number of layers (the height) = total volume.
:::

::: misconception
WRONG: "If you lay the box on its side, its volume changes."
WHY: The same space is inside. Only the way you look at it changes.
RIGHT: 20 × 6 × 30 = 6 × 30 × 20 = 3600 cm³ in any position.
@viz prism l="30 cm" w="6 cm" h="20 cm" lv=30 wv=6 hv=20
:::

::: try
a) Find the volume of a box 8 cm × 5 cm × 4 cm. [[160 cm³]]
b) Find the volume of a triangular prism: triangle base 10 cm, triangle height 6 cm, length 15 cm. [[450 cm³]]
c) Find the volume of a can with r = 3 cm and h = 10 cm. [[282.6 cm³]]
:::

::: retrieval
1. Write the volume formula that works for every prism and cylinder.
=> V = area of base × height
2. Find the volume of a cube with 4 cm sides.
=> 64 cm³
3. Find the volume of a cylinder with d = 10 cm and h = 8 cm.
=> r = 5. 3.14 × 25 × 8 = 628 cm³
4. Explain why turning a box on its side does not change its volume.
=> The same space is inside. Multiplying the same three numbers in a different order gives the same answer.
5. ★ Stretch: A box is 10 cm × 10 cm × 10 cm. Is it possible to have a box with the same volume but a bigger surface area? Give an example.
=> Yes. 20 × 10 × 5 also has V = 1000 cm³, but SA = 2(200) + 2(100) + 2(50) = 700 cm² vs 600 cm² for the cube.
:::

## Unit Synthesis
1. Explain the difference between surface area and volume. Use a box as an example.
=> SA is the wrapping (area of all faces, cm²). Volume is the filling (space inside, cm³).
2. Draw the net of a cylinder. Label the length of the rectangle and explain why.
(work 3)
=> Two circles and a rectangle whose length is the circumference 2πr.
3. Why does V = area of base × height work for prisms and cylinders?
=> They are stacks of identical layers.
4. Look back at your first page. What would you change now?
=> Answers vary.

## Concept Reference
::: key Nets
Rectangular prism: 6 rectangles (3 pairs). Triangular prism: 2 triangles + 3 rectangles. Cylinder: 2 circles + 1 rectangle whose length is the circumference.
:::
@viz net type=cyl r="r" h="h" rv=2 hv=4 c="2πr"

::: key Surface area (cm², m²) = add the area of every face
Rectangular prism: SA = 2lw + 2lh + 2wh
Triangular prism: SA = 2 triangles + 3 rectangles
Cylinder: SA = 2πr² + 2πrh
:::

::: key Volume (cm³, m³) = area of base × height
Rectangular prism: V = lwh · Triangular prism: V = ({1/2}bh) × length · Cylinder: V = πr²h
Turning an object does not change its volume.
:::

| Mistake | Fix |
|---|---|
| SA = 6 × one face | Only for a cube. Use 3 pairs. |
| Cylinder rectangle length = diameter | Length = circumference = πd |
| Mixing up SA and volume | SA wraps (cm²); volume fills (cm³) |
| Using d instead of r in πr² | Halve the diameter first |
