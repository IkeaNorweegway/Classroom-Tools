---
title: Surface Area
topic: surface-area
strand: measurement-geometry
---
<!-- Gate: one ticket per cluster. Every question maps to a specific LO (SA1–SA4, all outcome 8M2). -->

## Section 1: Polyhedrons and nets
Target: I can tell a polyhedron from other solids. I can match a net to the solid it folds into. (SA1)
### Name the solid this net folds into.
@viz satnet av=4 bv=4 cv=4 lv=7 size=200
(lines 1)
=> A triangular prism: 2 triangle bases and 3 rectangles.
### Will this pattern fold into a cube?
@viz sacube cells="0,0;1,0;2,0;3,0;0,1;3,1"
(lines 1)
=> No.
### Explain how you know your answer to the cube pattern is right.
(lines 2)
=> The row of 4 wraps into a loop. The two squares under the ends both fold to the bottom, so they overlap. The top has no square.

## Section 2: Surface area of prisms and pyramids
Target: I can find the surface area of a prism or pyramid. I add the areas of all its faces. (SA2)
### A box is 6 cm by 4 cm by 3 cm. Write the area in each face. Find its SA.
@viz net type=box lv=6 wv=4 hv=3 n1="[[18]]" n2="[[18]]" n3="[[12]]" n4="[[12]]" n5="[[24]]" n6="[[24]]"
(lines 2)
=> Faces: 6 × 3 = 18, 4 × 3 = 12, 6 × 4 = 24, two of each.
=> SA = 2 × (18 + 12 + 24) = 108 cm².
### A square-based pyramid has a base of 4 cm. Its slant height is 6 cm. Find its SA.
@viz sasolid kind=pyr b="4 cm" s="s = 6 cm" bv=4 hv=5.6 slant=1 size=140
(lines 2)
=> Base: 16 cm². Triangles: 4 × ½ × 4 × 6 = 48 cm². SA = 64 cm².
### Your box answer is in cm², not cm³. Explain how you know.
(lines 2)
=> SA covers the outside with flat squares, so it is in square units. Volume counts cubes inside, in cm³.

## Section 3: Surface area of cylinders
Target: I can draw the net of a cylinder. I can find the surface area of a cylinder. (SA3)
### A can has a radius of 2 cm and a height of 10 cm. Find its SA.
@viz net type=cyl rv=2 hv=10 r="2 cm" h="10 cm" c="length = ___"
(lines 3)
=> Circles: 2 × 3.14 × 2 × 2 = 25.12 cm². Rectangle: 2 × 3.14 × 2 = 12.56 cm long. 12.56 × 10 = 125.6 cm².
=> SA = 25.12 + 125.6 = 150.72, about 150.7 cm².
### How long is the rectangle in the net? Explain how you know.
(lines 2)
=> 12.56 cm, the circumference. The rectangle wraps once around the circle base. It is not the diameter (4 cm).

## Section 4: Orthographic and isometric drawings
Target: I can draw the top, front and side views of a cube building. I can make an isometric drawing. I can choose the best model. (SA4)
### Draw the top, front and right side views.
@viz blocks heights="1,1;2,0" views=blank
(work 3)
=> Top: back row 2 squares, front row 1 on the left. Front: columns 2 and 1 tall. Right side: front 2 tall, back 1 tall.
### A company needs to cut out cardboard to make a box. Which 2-D model should it use? Explain how you know.
(lines 2)
=> A net. It shows every face laid flat. Cut it out and fold it into the box.
