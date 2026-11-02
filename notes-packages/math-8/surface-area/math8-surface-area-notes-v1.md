---
title: Surface Area
topic: surface-area
strand: measurement-geometry
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "Any 6 squares joined make a cube net" (SA1). "Surface area and volume measure
     the same thing" (SA2, plus "use the pyramid's height, not the slant height"). "A cylinder's net
     rectangle is as long as the diameter" (SA3). "A side view shows the hidden cubes" (SA4).
     Section order: name the solids and unfold them into nets first (SA1), because surface area is the
     area of a net. Then add the faces of prisms and pyramids (SA2), using Grade 7 rectangle and triangle
     area. Then the cylinder, whose curved surface unrolls into a rectangle as long as the circumference
     (SA3, uses Grade 7 circles). Last, two more 2-D models of a solid: orthographic views and isometric
     drawings, and when to use each model (SA4). Outcome 8M2. π ≈ 3.14, one decimal place. Right shapes
     only. No composite objects (Grade 9). Slant heights are always given. -->

## Pre-Knowledge Check
1. A rectangle is 8 cm long and 5 cm wide. Find its area. Give the units.
2. A triangle has a base of 6 cm and a height of 4 cm. Find its area.
3. A circle has a radius of 5 cm. Find its area. Use π ≈ 3.14.
4. A circle has a diameter of 10 cm. Find its circumference.
5. A box is 4 cm by 3 cm by 2 cm. Find its volume.
6. A prism has two triangle bases. Name the prism.

## Section 1: Polyhedrons and nets
Learning target: I can tell a polyhedron from other solids. I can match a net to the solid it folds into.

### Vocabulary
- polyhedron :: a 3-D object whose faces are all flat polygons :: a box, a pyramid
- face :: a flat side of a 3-D object :: a cube has 6 faces
- edge :: a line where two faces meet :: a cube has 12 edges
- vertex (vertices) :: a corner where edges meet :: a cube has 8 vertices
- pyramid :: a polyhedron with one polygon base. Its other faces are triangles that meet at one point. :: the roof of a gazebo
- apex :: the point at the top of a pyramid or a cone :: the tip of a tent pole
- net :: a flat pattern that folds up into a 3-D object :: a cereal box cut open and laid flat

#### Flat faces or curved?
A **polyhedron** has only flat faces. Every face is a polygon. Prisms and pyramids are polyhedrons.
@viz solid kind=box lv=5 wv=3 hv=3 shade=0 size=120 caption="A rectangular prism: 6 flat faces"
@viz solid kind=tri bv=4 thv=3.5 lv=7 shade=0 size=150 caption="A triangular prism: 5 flat faces"
@viz sasolid kind=pyr bv=4 hv=4 size=120 caption="A square-based pyramid: 5 flat faces"
A cylinder, a cone and a sphere each have a curved surface. They are **not** polyhedrons.
@viz solid kind=cyl rv=2 hv=3 shade=0 size=100 caption="Cylinder: curved"
@viz sasolid kind=cone bv=2 hv=4 size=100 caption="Cone: curved"
@viz sasolid kind=sphere size=100 caption="Sphere: curved"

#### Pyramids
A **pyramid** has one base. Its other faces are triangles. The triangles meet at one point, the **apex**. A pyramid is named by its base.
@viz sasolid kind=pyr bv=5 hv=4 blabel="base" fill=sun size=150 caption="A square-based pyramid. 4 triangles meet at the apex."
@viz sasolid kind=tripyr bv=5 wv=4 hv=4 size=150 caption="A triangular pyramid. Every face is a triangle."

| Solid | Faces | Edges | Vertices |
|---|---|---|---|
| cube | 6 | 12 | 8 |
| triangular prism | 5 | 9 | 6 |
| square-based pyramid | 5 | 8 | 5 |
| triangular pyramid | [[4]] | [[6]] | [[4]] |

#### Nets
Cut a box along some edges. Lay it flat. The flat pattern is a **net**. Fold the net back up and you get the box.
@viz solid kind=box lv=6 wv=3 hv=4 size=130 caption="A box"
@viz net type=box lv=6 wv=3 hv=4 n1="front" n2="back" n3="side" n4="side" n5="top" n6="bottom" caption="One net of the box. Each face of the net is a face of the box."
A solid can have many nets. Cut different edges and you get a different net.

::: key Polyhedrons and nets
A polyhedron has only flat polygon faces: prisms and pyramids.
A cylinder, cone or sphere has a curved surface. It is not a polyhedron.
A net folds into a solid. Each face of the net is one face of the solid.
A solid can have more than one net.
:::

::: example Worked Example 1 — What does it fold into?
Look at the net. Name the solid it folds into.
@viz sapnet bv=4 sv=4 n1="base" size=200
Step 1: Count the faces. There is 1 square and 4 triangles.
Step 2: The triangles fold up. They meet at one point, the apex.
Step 3: One square base and triangles: it is a [[square-based pyramid]].
:::

::: example Worked Example 2 — Match the faces
This net folds into a Toblerone-style box. Match each face of the net to the box.
@viz satnet av=4 bv=4 cv=4 lv=12 n1="side" n2="bottom" n3="side" n4="end" n5="end" size=240
@viz solid kind=tri bv=4 thv=3.5 lv=9 blabel="end" both=1 ground=1 size=200
Step 1: The two triangles are the ends. They are the bases.
Step 2: The middle rectangle is the bottom. The two other rectangles fold up to make the sides.
Step 3: The net has 2 + 3 = [[5]] faces. The box has 5 faces too. They match.
:::

#### Is it a cube net?
A cube has 6 square faces. So a cube net has 6 squares. But not every set of 6 squares works!

::: misconception
WRONG: "Any 6 squares joined edge to edge make a cube net."
WHY: Some patterns overlap when you fold them. Fold this one. The two shaded squares both land on top. Then one face has no square.
@viz sacube cells="0,1;1,1;2,1;3,1;0,0;3,0" hot="5,6" label="Not a net: the shaded squares overlap"
RIGHT: Test it. Fold it in your head, or cut it out and fold it. Every square must land on a different face.
:::

::: example Worked Example 3 — Net or not?
Which patterns fold into a cube?
@viz sacube cells="1,0;0,1;1,1;2,1;3,1;1,2" label="A cross: a net"
@viz sacube cells="0,0;1,0;2,0;2,1;3,1;4,1" label="A staircase: a net"
@viz sacube cells="0,0;1,0;2,0;0,1;1,1;2,1" label="A 2 by 3 block: [[not a net]]"
@viz sacube cells="0,0;1,0;2,0;3,0;4,0;2,1" label="5 in a row: [[not a net]]"
Step 1: The cross folds into a cube. The row of 4 wraps around. The other two are the top and the bottom.
Step 2: The staircase works too. Fold it in your head.
Step 3: The 2 by 3 block has a square of 4. A cube net never has a 2 by 2 square.
Step 4: 5 in a row wraps more than once. The first and fifth squares overlap.
:::

::: example Worked Example 4 — Opposite faces
This cube net is folded up. Which face is across from A?
@viz sacube cells="0,1;1,1;2,1;3,1;1,0;1,2" letters="A,B,C,D,E,F" unit=32
Step 1: A, B, C and D wrap around in a loop.
Step 2: In a loop of 4, opposite faces are two steps apart. A is across from [[C]].
Step 3: E and F fold to the top and the bottom. So E is across from F.
:::
::: explain
Why does a net have as many faces as its solid?
(lines 2)
=> Each face of the net folds into one face of the solid. No face is missing and none overlap.
:::

::: try
1. Is it a polyhedron? Say why.
@viz sasolid kind=cone bv=2 hv=4 size=90
[[No. A cone has a curved surface. A polyhedron has only flat faces.]]
2. Name the solid this net folds into.
@viz satnet av=5 bv=5 cv=5 lv=8 size=220
[[A triangular prism. It has 2 triangles and 3 rectangles.]]
3. Will this pattern fold into a cube?
@viz sacube cells="0,0;0,1;1,1;2,1;3,1;3,2"
[[Yes. The row of 4 wraps around. One square goes on top and one on the bottom.]]
4. Will this pattern fold into a cube?
@viz sacube cells="0,0;1,0;0,1;1,1;2,1;3,1"
[[No. It has a 2 by 2 square. Two squares would overlap.]]
5. How many faces does a hexagonal prism have? [[8: 2 hexagon bases and 6 rectangles.]]
:::
::: retrieval
1. Find the area of a rectangle 9 cm by 4 cm.
=> 36 cm²
2. A triangle has a base of 10 m and a height of 3 m. Find its area.
=> ½ × 10 × 3 = 15 m²
3. Find 3.14 × 6.
=> 18.84
4. Find the volume of a box 5 cm by 2 cm by 3 cm.
=> 30 cm³
5. ★ Stretch: A pyramid has 7 faces. What shape is its base?
=> 1 face is the base. 6 are triangles, one on each side of the base. So the base is a hexagon.
:::

## Section 2: Surface area of prisms and pyramids
Learning target: I can find the surface area of a prism or pyramid. I add the areas of all its faces.

### Vocabulary
- surface area (SA) :: the total area of all the faces of a 3-D object :: the paper to wrap a box
- square units :: units for area: cm², m² :: 1 cm² is a square 1 cm on each side
- lateral face :: a face that is not a base :: the 4 triangles of a pyramid
- slant height (s) :: the height of a triangle face of a pyramid, from the base edge up to the apex :: the 5 cm dashed line on a pyramid's face
- height of a pyramid (h) :: the distance from the apex straight down to the centre of the base :: the pole inside a tent

#### Covering, not filling
In Grade 7, you found volume. **Volume** fills a solid with cubes. **Surface area** covers its outside with squares.
@viz layers l=3 w=2 h=1 llabel="volume: 6 cubes fill it" blabel="6 cm³"
@viz net type=box lv=3 wv=2 hv=1 n1="3" n2="3" n3="2" n4="2" n5="6" n6="6" caption="Unfold the box. Count the squares that cover it: 3 + 3 + 2 + 2 + 6 + 6 = 22 cm²."
Surface area is the area of the net. Find the area of each face. Add them all.

::: misconception
WRONG: "Surface area and volume are the same. This box has SA = 6."
WHY: Volume counts the cubes inside: 6 cm³. Surface area counts the squares that cover the outside. They measure different things, in different units.
@viz sqside n=1 side="1 cm" labels="1 cm²" cell=40 caption="Covering: square units (cm²)"
@viz cube n=1 label="1 cm³" caption="Filling: cubic units (cm³)"
RIGHT: SA = 22 cm². Volume = 6 cm³. Wrapping paper is surface area. Sand inside is volume.
:::

::: key Surface area
**SA = the sum of the areas of all the faces.**
It is in square units: cm² or m².
Draw the net. Write the area inside each face. Add.
Rectangle: A = l × w. Triangle: A = ½ × b × h.
A box has 3 pairs of matching faces. So SA = 2 × (front + top + side).
:::

::: example Worked Example 1 — Wrap a gift
A gift box is 30 cm long, 20 cm wide and 10 cm tall. How much paper covers it with no overlap?
@viz solid kind=box l="30 cm" w="20 cm" h="10 cm" lv=30 wv=20 hv=10 size=170
@viz net type=box lv=30 wv=20 hv=10 n1="300" n2="300" n3="200" n4="200" n5="[[600]]" n6="[[600]]"
Step 1: Front and back: 30 × 10 = 300 cm² each.
Step 2: The two sides: 20 × 10 = 200 cm² each.
Step 3: Top and bottom: 30 × 20 = [[600]] cm² each.
Step 4: SA = 300 + 300 + 200 + 200 + 600 + 600 = [[2200 cm²]].
:::

::: example Worked Example 2 — A Toblerone-style box
Each triangle end has sides of 4 cm and a height of 3.5 cm. The box is 20 cm long.
@viz satnet av=4 bv=4 cv=4 lv=9 lb="4 cm" l="20 cm" th="3.5 cm" n1="80" n2="80" n3="80" n4="7" n5="[[7]]" size=300
Step 1: Each triangle: ½ × 4 × 3.5 = 7 cm². Two triangles: [[14]] cm².
Step 2: Each rectangle: 4 × 20 = 80 cm². Three rectangles: [[240]] cm².
Step 3: SA = 14 + 240 = [[254 cm²]].
:::

#### Pyramids use the slant height
Each triangle face of a pyramid has its own height. It runs up the middle of the face to the apex. It is the **slant height**, s.
@viz sasolid kind=pyr b="6 cm" s="s = 5 cm" bv=6 hv=4 slant=1 size=170 caption="The slant height lies on a face."
@viz sasolid kind=pyr b="6 cm" h="h = 4 cm" bv=6 hv=4 height=1 size=170 caption="The height is inside the pyramid."

::: example Worked Example 3 — A square-based pyramid
A pyramid has a square base 6 cm on each side. Its slant height is 5 cm. Find its SA.
@viz sapnet bv=6 sv=5 b="6 cm" s="5 cm" n1="36" n2="15" n3="15" n4="[[15]]" n5="[[15]]" size=240
Step 1: The base: 6 × 6 = 36 cm².
Step 2: Each triangle: ½ × 6 × 5 = 15 cm². Four triangles: [[60]] cm².
Step 3: SA = 36 + 60 = [[96 cm²]].
:::

::: misconception
WRONG: "The pyramid is 4 cm tall. Each triangle is ½ × 6 × 4 = 12 cm²."
WHY: The 4 cm height is inside the pyramid. It is not on any face. A triangle face needs its own height: the slant height.
@viz sasolid kind=pyr b="6 cm" s="s = 5 cm" h="h = 4 cm" bv=6 hv=4 slant=1 height=1 size=180
RIGHT: Use s = 5 cm. Each triangle is ½ × 6 × 5 = 15 cm². The slant height is always longer than the height.
:::

::: example Worked Example 4 — A gazebo roof
A gazebo has a pyramid roof. Its base is 4 m by 4 m. The slant height is 3 m. Shingles cover the 4 triangles only.
@viz sasolid kind=pyr b="4 m" s="s = 3 m" bv=4 hv=2.2 slant=1 fill=earth size=170
Step 1: There is no base to cover. The roof is open underneath.
Step 2: Each triangle: ½ × 4 × 3 = [[6]] m².
Step 3: Four triangles: [[4 × 6 = 24]]. The roof needs [[24 m²]] of shingles.
:::

::: example Worked Example 5 — A rectangle-based pyramid
The base is 8 cm by 6 cm. The slant height is 5 cm on the 8 cm edges. It is 5.7 cm on the 6 cm edges.
@viz sapnet bv=8 wv=6 sv=5 s2v=5.7 b="8 cm" w="6 cm" s="5 cm" s2="5.7 cm" n1="48" n2="20" n4="20" n3="[[17.1]]" n5="[[17.1]]" size=260
Step 1: The base: 8 × 6 = 48 cm².
Step 2: Two triangles on the 8 cm edges: 2 × ½ × 8 × 5 = 40 cm².
Step 3: Two triangles on the 6 cm edges: 2 × ½ × 6 × 5.7 = [[34.2]] cm².
Step 4: SA = 48 + 40 + 34.2 = [[122.2 cm²]].
:::
::: explain
Why do we use the slant height, not the height, for a triangle face?
(lines 2)
=> The area of a triangle uses a height that lies on that triangle. The slant height is on the face. The height is inside the pyramid.
:::

::: try
1. Find the SA of a cube 5 cm on each edge.
@viz net type=box lv=5 wv=5 hv=5 n1="[[25]]" n2="[[25]]" n3="[[25]]" n4="[[25]]" n5="[[25]]" n6="[[25]]"
[[Each face is 5 × 5 = 25 cm². 6 faces: 6 × 25 = 150 cm².]]
2. A tent is a triangular prism. Each end has a base of 2.4 m and a height of 1.6 m. Its slanted sides are 2 m. It is 3 m long. Find the fabric, with the floor.
@viz satnet av=2 bv=2.4 cv=2 lv=3 la="2 m" lb="2.4 m" lc="2 m" l="3 m" th="1.6 m" size=260
[[Ends: 2 × ½ × 2.4 × 1.6 = 3.84 m². Sides: 2 × 2 × 3 = 12 m². Floor: 2.4 × 3 = 7.2 m². SA = 23.04 m².]]
3. A pyramid has a square base 10 cm on each side. Its slant height is 12 cm. Find its SA.
@viz sasolid kind=pyr b="10 cm" s="s = 12 cm" bv=10 hv=11 slant=1 size=150
[[Base: 100 cm². Triangles: 4 × ½ × 10 × 12 = 240 cm². SA = 340 cm².]]
4. A box is 2 cm by 3 cm by 4 cm. Ben says its SA is 24 cm². Fix his mistake. [[24 is the volume, in cm³. SA = 2 × (6 + 8 + 12) = 52 cm².]]
5. A shed is 3 m long, 2 m wide and 2 m tall. Paint covers the 4 walls only. How much area is painted? [[2 × (3 × 2) + 2 × (2 × 2) = 12 + 8 = 20 m².]]
:::
::: retrieval
1. Is a cylinder a polyhedron?
=> No. It has a curved surface.
2. How many faces does a square-based pyramid have?
=> 5: 1 square and 4 triangles
3. Find the area of a circle with a radius of 3 cm.
=> 3.14 × 3 × 3 = 28.26 cm²
4. Find the circumference of a circle with a diameter of 4 cm.
=> 3.14 × 4 = 12.56 cm
5. ★ Stretch: A cube has an SA of 54 cm². How long is each edge?
=> 54 ÷ 6 = 9 cm² per face. 3 × 3 = 9, so each edge is 3 cm.
:::

## Section 3: Surface area of cylinders
Learning target: I can draw the net of a cylinder. I can find the surface area of a cylinder.

### Vocabulary
- cylinder :: a solid with two matching circle bases and one curved surface :: a soup can
- curved surface :: the side of a cylinder. It unrolls into a rectangle. :: the label of a can
- circumference (C) :: the distance around a circle. C = π × d = 2 × π × r. :: the length of a can's label
- radius (r) and diameter (d) :: r goes from the centre to the edge. d goes across: d = 2r. :: r = 4 cm, d = 8 cm

#### Unroll the label
Peel the label off a soup can. Lay it flat. It is a rectangle.
The rectangle's height is the can's height. The label wrapped once around the can. So its length is the **circumference**.
@viz saunroll rv=4 hv=10 r="r = 4 cm" h="h = 10 cm" c="length = circumference" inside="label" size=320
The net of a cylinder is two circles and one rectangle.
@viz net type=cyl rv=2 hv=4 r="r" h="h" c="length = 2 × π × r"

::: key Surface area of a cylinder
Two circles: 2 × π × r × r.
The rectangle: (2 × π × r) × h. Its length is the circumference.
**SA = 2πr² + 2πrh**. Use π ≈ 3.14.
No top? Leave out a circle. Only the side? Use the rectangle only.
:::

::: example Worked Example 1 — A soup can
A soup can has a radius of 4 cm and a height of 10 cm. Find its SA.
@viz net type=cyl rv=4 hv=10 r="4 cm" h="10 cm" c="2 × 3.14 × 4 = 25.12 cm"
Step 1: One circle: 3.14 × 4 × 4 = 50.24 cm². Two circles: 100.48 cm².
Step 2: The rectangle is 25.12 cm long. Its area is 25.12 × 10 = [[251.2]] cm².
Step 3: SA = 100.48 + 251.2 = [[351.68]]. SA ≈ [[351.7 cm²]].
:::

::: misconception
WRONG: "A can is 8 cm across. So the label is 8 cm long."
WHY: The label goes all the way around the can. That is the circumference, not the diameter. It is a bit more than 3 diameters.
@viz wheel dlabel="d = 8 cm" clabel="around = 3.14 × 8" seglabel="8 cm" bitlabel="a bit more" size=30
RIGHT: The length is π × d ≈ 3.14 × 8 = 25.12 cm.
:::

::: example Worked Example 2 — A grain bin's sides
A grain bin is 6 m across and 5 m tall. Paint covers its curved side only. How much area is painted?
@viz solid kind=cyl r="d = 6 m" h="h = 5 m" rv=3 hv=5 diameter=1 fill=cold size=140
@viz net type=cyl rv=3 hv=5 h="5 m" c="length = [[18.84 m]]"
Step 1: Only the side: use the rectangle. Skip the circles.
Step 2: The length is the circumference: 3.14 × 6 = [[18.84]] m.
Step 3: Area = 18.84 × 5 = [[94.2 m²]].
:::

::: example Worked Example 3 — A hockey puck
A hockey puck has a radius of 3.8 cm. It is 2.5 cm thick. Find its SA.
@viz solid kind=cyl r="r = 3.8 cm" h="h = 2.5 cm" rv=3.8 hv=2.5 size=160
Step 1: Two circles: 2 × 3.14 × 3.8 × 3.8 = [[90.6832]] cm².
Step 2: The side: 2 × 3.14 × 3.8 × 2.5 = [[59.66]] cm².
Step 3: SA = [[90.6832 + 59.66 = 150.3432]]. SA ≈ [[150.3 cm²]].
:::
::: explain
Why is the rectangle in a cylinder's net as long as the circumference?
(lines 2)
=> The rectangle wraps once around the circle base. Its long edge meets the edge of the circle all the way around.
:::

::: try
1. A juice can has a radius of 3 cm and a height of 12 cm. Find its SA.
@viz net type=cyl rv=3 hv=12 r="3 cm" h="12 cm" c="length = [[18.84 cm]]"
[[Circles: 2 × 3.14 × 9 = 56.52. Side: 18.84 × 12 = 226.08. SA = 282.6 cm².]]
2. A round hay bale is 1.6 m across and 1.2 m long. Plastic wraps its curved side only. How much plastic?
@viz solid kind=cyl lying=1 r="d = 1.6 m" h="1.2 m" rv=0.8 hv=1.2 diameter=1 fill=sun ground=1 size=140
[[Length = 3.14 × 1.6 = 5.024 m. Area = 5.024 × 1.2 = 6.0288. About 6.0 m².]]
3. A paper towel tube is 4 cm across and 28 cm long. It has no ends. Find its area. [[3.14 × 4 × 28 = 351.68. About 351.7 cm².]]
4. Mo draws a can's net. The can is 10 cm across. He makes the rectangle 10 cm long. Fix his mistake. [[The length is the circumference: 3.14 × 10 = 31.4 cm.]]
5. A drum has a radius of 20 cm and a height of 30 cm. It has no top. Find its SA. [[One circle: 3.14 × 400 = 1256. Side: 2 × 3.14 × 20 × 30 = 3768. SA = 5024 cm².]]
:::
::: retrieval
1. Find the SA of a box 4 cm by 2 cm by 1 cm.
=> 2 × (8 + 4 + 2) = 28 cm²
2. A pyramid's square base is 4 m on each side. Its slant height is 5 m. Find the area of one triangle face.
=> ½ × 4 × 5 = 10 m²
3. Which solid has 2 triangles and 3 rectangles in its net?
=> a triangular prism
4. Is SA in cm² or cm³?
=> cm²
5. ★ Stretch: Can A has radius 2 cm. Can B has radius 4 cm. Both are 10 cm tall. Is B's side twice as big?
=> Yes. A: 2 × 3.14 × 2 × 10 = 125.6. B: 2 × 3.14 × 4 × 10 = 251.2. Double.
:::

## Section 4: Orthographic and isometric drawings
Learning target: I can draw the top, front and side views of a cube building. I can make an isometric drawing. I can choose the best model.

### Vocabulary
- view :: what you see from one side, looking straight at it :: the front view
- orthographic drawing :: separate flat views of an object: top, front and right side :: plans for a shed
- isometric drawing :: a drawing on triangle dot paper that shows the top, front and side together :: a picture of a cube building
- isometric dot paper :: paper with dots in a triangle pattern :: lines go up, and slant left and right
- 2-D model :: a flat drawing of a 3-D object: a net, views, or an isometric drawing :: a box's net

#### Three views
Stand in front of a cube building. Look straight at it. You see the **front view**. Look down from above for the **top view**. Look from the right for the **right side view**.
@viz blocks heights="1,1,1;2,1,0" views=show caption="Each view is a flat grid. It shows the squares you see from that side."
An **orthographic drawing** is the three views drawn apart. Each view is flat. It shows exact sizes.

#### Isometric drawings
An **isometric drawing** shows three sides at once. Draw it on **isometric dot paper**. Up-and-down edges stay straight up. The other edges slant left or right along the dots.
@viz blocks heights="2,1;1,0" front=1 caption="An isometric drawing. You see the top, the front and the right side."
@viz dotgrid iso=1 cols=6 rows=5 caption="Isometric dot paper. Join the dots to draw."

::: key Three 2-D models
**Net:** a flat pattern that folds up. Use it to make an object or to find its SA.
**Orthographic drawing:** separate top, front and right views. Use it for exact plans.
**Isometric drawing:** one picture of 3 sides at once. Use it to show what the object looks like.
:::

::: example Worked Example 1 — Draw the views
Draw the top, front and right side views of this building.
@viz blocks heights="1,2,1;1,0,0" views=key
Step 1: Top: look down. Count the squares you see in each row. The back row has [[3]]. The front row has [[1]].
Step 2: Front: look straight at it. The tallest stack in each column shows: [[1, 2, 1]].
Step 3: Right side: the back row is [[2]] tall. The front row is [[1]] tall.
:::

::: misconception
WRONG: "The front view shows 3 squares. So the building has 3 cubes."
WHY: A view shows only the cubes you can see. Cubes behind other cubes are hidden.
@viz blocks heights="1,1;2,1" views=show
RIGHT: Look at all the views together. This building has 5 cubes. The front view hides the 2 cubes in the back row. A side view hides cubes too.
:::

::: example Worked Example 2 — Build it from the views
Build the building from its views. How many cubes does it use?
@viz blocks heights="2,1;1,0" object=key views=show
Step 1: The top view shows the floor plan. It has [[3]] squares.
Step 2: The front view shows a stack [[2]] tall on the left.
Step 3: The right side view shows the back row is 2 tall. So the tall stack is in the [[back-left]] corner.
Step 4: The building has [[2 + 1 + 1 = 4]] cubes.
:::

::: example Worked Example 3 — Which model?
Pick the best 2-D model for each task.
@viz net type=box lv=4 wv=2 hv=3 caption="Net"
@viz blocks heights="1,1;2,0" views=show front=0 caption="Views and isometric"
Step 1: A company cuts cardboard to make a box. They need a [[net]].
Step 2: A builder needs exact sizes for each wall of a shed. They need an [[orthographic drawing]].
Step 3: A poster shows what a new skate park ramp looks like. Use an [[isometric drawing]].
:::
::: explain
Why can't one view tell you how many cubes a building has?
(lines 2)
=> A view shows only the cubes you can see from that side. Cubes behind or under others are hidden. You need all the views.
:::

::: try
1. Draw the top, front and right side views.
@viz blocks heights="1,1,2;1,0,0" views=blank
[[Top: back row 3, front row 1 (left). Front: 1, 1, 2. Right side: front 1, back 2.]]
2. Copy this building onto isometric dot paper.
@viz blocks heights="1,1;1,0"
@viz dotgrid iso=1 cols=5 rows=4
[[An L of 3 cubes, one layer tall. Vertical edges straight up, other edges along the slanted dots.]]
3. Build it from the views. How many cubes?
@viz blocks heights="1,1,1;1,2,1" object=key views=show
[[7 cubes: back row 1, 1, 1 and front row 1, 2, 1.]]
4. Pia's front view shows 4 squares. She says the building has 4 cubes. Is she sure? [[No. Cubes can hide behind others. She needs the top and side views too.]]
5. Which model would you use to find the SA of a box? Say why. [[A net. It shows every face flat, so you can find each area and add.]]
:::
::: retrieval
1. A cylinder has r = 2 cm and h = 5 cm. Find its SA.
=> Circles: 2 × 3.14 × 4 = 25.12. Side: 2 × 3.14 × 2 × 5 = 62.8. SA = 87.92, about 87.9 cm².
2. A square-based pyramid has a base of 8 cm. Its slant height is 6 cm. Find its SA.
=> 64 + 4 × ½ × 8 × 6 = 64 + 96 = 160 cm²
3. Do 6 squares in a 2 by 3 block make a cube net?
=> No. They overlap when folded.
4. How long is the rectangle in the net of a can 6 cm across?
=> 3.14 × 6 = 18.84 cm
5. ★ Stretch: A building's top view has 4 squares. Its front view is 1 square tall. How many cubes?
=> 4. Every stack is 1 tall, so there is one cube on each square of the top view.
:::

## Unit Synthesis
1. A box is 10 cm by 6 cm by 4 cm. a) Draw a net and write the area in each face. b) Find its SA. c) Find its volume. Which one tells you the wrapping paper?
@viz net type=box lv=10 wv=6 hv=4 caption="Write the area in each face."
=> a) Front and back 40, sides 24, top and bottom 60.
=> b) SA = 2 × (40 + 24 + 60) = 248 cm².
=> c) V = 10 × 6 × 4 = 240 cm³. The SA tells you the paper.
2. A square-based pyramid has a base of 6 m. Its slant height is 4 m. Find its SA.
@viz sasolid kind=pyr b="6 m" s="s = 4 m" bv=6 hv=2.6 slant=1 size=150
=> Base: 36 m². Triangles: 4 × ½ × 6 × 4 = 48 m². SA = 84 m².
3. A can has a diameter of 8 cm and a height of 11 cm. Find its SA.
=> r = 4. Circles: 2 × 3.14 × 16 = 100.48. Side: 3.14 × 8 × 11 = 276.32. SA = 376.8 cm².
4. Draw the top, front and right views of this building. How many cubes does it have?
@viz blocks heights="2,2;1,0" views=blank
=> Top: back row 2, front row 1 (left). Front: 2, 2. Right side: front 1, back 2. It has 5 cubes.
5. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Polyhedrons and nets
A polyhedron has only flat polygon faces: prisms and pyramids. Cylinders, cones and spheres are not polyhedrons.
A pyramid has one base and triangle faces that meet at the apex.
A net folds into a solid. A cube net has 6 squares, but test it: some patterns overlap.
:::
@viz sacube cells="1,0;0,1;1,1;2,1;3,1;1,2" label="A cube net"
@viz sacube cells="0,0;1,0;2,0;0,1;1,1;2,1" label="Not a cube net"

::: key Surface area of prisms and pyramids
SA = the sum of the areas of all the faces, in cm² or m². Draw the net and add the faces.
Box: SA = 2 × (front + top + side). Pyramid: base + the triangles, each ½ × b × s.
Use the slant height s, not the height.
:::
@viz sapnet bv=6 sv=5 b="6 cm" s="5 cm" n1="36" n2="15" n3="15" n4="15" n5="15" size=200

::: key Surface area of cylinders
The net is 2 circles and a rectangle as long as the circumference.
**SA = 2πr² + 2πrh**, with π ≈ 3.14.
:::
@viz saunroll rv=4 hv=10 r="r" h="h" c="2 × π × r" inside="2 × π × r × h" size=280

::: key Orthographic and isometric drawings
Orthographic: separate top, front and right side views. Isometric: one picture on dot paper.
Choose a net to make it or find SA. Use views for exact plans. Use isometric to show the look.
:::
@viz blocks heights="1,1,1;2,1,0" views=show

| Mistake | Fix |
|---|---|
| Any 6 joined squares make a cube net | Fold it. Some patterns overlap. A 2 by 2 square never works. |
| SA and volume are the same | SA covers (cm²). Volume fills (cm³). |
| Using the pyramid's height for a triangle face | Use the slant height. It lies on the face. |
| The cylinder's rectangle is as long as the diameter | It wraps around: length = 3.14 × d. |
| A view shows every cube | Cubes can hide. Use all three views. |
