---
title: Volume
topic: volume
strand: measurement-geometry
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "The base of a prism is the face it sits on" (VO1). "Volume is in square units" (VO2).
     "Use the triangle's height as the prism's height" and "Using the diameter as the radius" (VO3).
     "Mixing cm and m in one calculation" (VO4, added: the draft's "same units for all dimensions").
     Section order: naming solids and finding their bases first (VO1), because V = Bh needs the right B.
     Then a box filled with unit cubes, layer by layer (VO2): one layer is l × w, the number of layers is h.
     That layer picture becomes V = B × h for every prism and cylinder (VO3), with B from Grade 6 triangle
     area and topic 9 circle area. Last, V = B × h run backwards: h = V ÷ B and B = V ÷ h, with units
     matched first (VO4). Outcome 7M2. π ≈ 3.14, one decimal place. No surface area, pyramids, cones,
     spheres or composite solids. -->

## Pre-Knowledge Check
1. Find 4 × 3 × 5.
2. A rectangle is 6 cm long and 4 cm wide. Find its area. Give the units.
3. A triangle has a base of 8 cm and a height of 5 cm. Find its area.
4. A circle has a radius of 3 cm. Find its area. Use π ≈ 3.14.
5. Find 600 ÷ 20.
6. How many centimetres are in 1 m?

## Section 1: Prisms and cylinders
Learning target: I can name a prism by its base. I can find the bases and the lateral faces in any position.

### Vocabulary
- face :: a flat side of a 3-D object :: a box has 6 faces
- prism :: a 3-D object with two matching, parallel bases. The other faces are rectangles. :: a cereal box, a Toblerone-style box
- base :: one of the two matching faces at opposite ends of a prism or cylinder :: the two triangle ends of a Toblerone-style box
- lateral face :: a face of a prism that is not a base. It is a rectangle. :: the 4 sides of a juice box
- congruent :: the same size and the same shape :: the two ends of a prism
- cylinder :: a 3-D object with two matching, parallel circle bases and one curved surface :: a grain bin, a hockey puck
- curved surface :: the side of a cylinder. It bends around. :: the label part of a soup can

#### What is a prism?
Cut a triangle out of card. Slide it straight back. Do not turn it. The space it sweeps through is a prism.
@viz solid kind=tri along=z bv=4 thv=3 lv=5 slices=4 blabel="base" both=1 caption="Slide a triangle straight back. It makes a triangular prism. Every slice matches the base."
A **prism** has two **bases**. They are congruent and parallel. All the other faces are **lateral faces**. On a prism, every lateral face is a rectangle.
@viz solid kind=box lv=6 wv=3 hv=4 blabel="base" both=1 lateral="lateral face" caption="A box has 2 bases (shaded) and 4 lateral faces."

#### Name a prism by its base

| Base shape | Name of the prism | Example |
|---|---|---|
| triangle | triangular prism | a Toblerone-style box, a tent |
| rectangle | rectangular prism | a cereal box, a juice box |
| pentagon (5 sides) | pentagonal prism | a gift box |
| hexagon (6 sides) | hexagonal prism | a pencil |

@viz solid kind=ngon n=5 sv=2 hv=3 blabel="base" lateral="lateral face" size=150 caption="A pentagonal prism. Its bases are pentagons."
@viz solid kind=ngon n=6 sv=1 hv=9 along=x blabel="base" both=1 size=220 caption="A pencil is a hexagonal prism lying down."

#### Cylinders
A **cylinder** is like a prism with circle bases. Its side is one **curved surface**.
@viz solid kind=cyl rv=3 hv=4 blabel="base" both=1 lateral="curved surface" fill=cold size=140 caption="A grain bin is a cylinder. It stands on one base."
@viz solid kind=cyl lying=1 rv=0.8 hv=1.2 blabel="base" both=1 fill=sun ground=1 size=150 caption="A round hay bale lies on its curved surface. Its bases are the circle ends."

::: key Prisms and cylinders
A prism has 2 bases that match and are parallel. The other faces are rectangles.
Name a prism by the shape of its base.
A cylinder has 2 circle bases and 1 curved surface.
To find the bases, look for 2 faces that match at opposite ends.
:::

::: misconception
WRONG: "The base is the face it sits on."
WHY: A Toblerone-style box can lie on a rectangle face. Its bases are still the two triangles. They match, and they are at opposite ends.
@viz solid kind=tri bv=4 thv=3.5 lv=9 blabel="base" both=1 ground=1 groundlabel="It sits on a rectangle. That is a lateral face." size=220
RIGHT: The bases are the 2 faces that match at opposite ends. Turning the prism does not change them.
:::

::: example Worked Example 1 — A tent
A tent has two triangle ends. Its other faces are rectangles. Name the prism. Find its bases.
@viz solid kind=tri along=z bv=2 thv=1.5 lv=3 blabel="[[base]]" lateral="lateral face" fill=plant size=170
Step 1: Find 2 faces that match at opposite ends. They are triangles.
Step 2: Those triangles are the bases. A prism is named for its base.
Step 3: The tent is a [[triangular prism]]. It has 3 lateral faces. The floor is one of them!
:::

::: example Worked Example 2 — One box, three ways
A juice box has 6 faces. All 6 are rectangles. Which faces are the bases?
@viz solid kind=box lv=5 wv=3 hv=7 blabel="base" both=1 size=120 caption="Top and bottom"
@viz solid kind=box lv=5 wv=3 hv=7 base=front blabel="base" size=120 caption="Front and back"
@viz solid kind=box lv=5 wv=3 hv=7 base=side blabel="base" both=1 size=120 caption="Left and right"
Step 1: Pick any 2 opposite faces. They match, so they can be the bases.
Step 2: The other 4 faces are the lateral faces.
Step 3: Any pair works. It is still a [[rectangular prism]].
:::

::: example Worked Example 3 — A hockey puck
A hockey puck is a cylinder. Find its bases. What is its side called?
@viz solid kind=cyl rv=3.8 hv=2.5 blabel="base" lateral="[[curved surface]]" ghost=0 size=170
Step 1: The two flat circles match. They are at opposite ends. They are the [[bases]].
Step 2: The side bends around. It is the curved surface.
:::
::: explain
In Worked Example 1, the tent sits on a rectangle. Why is that rectangle not a base?
(lines 2)
=> The bases are the 2 faces that match at opposite ends. The floor has no matching face across from it. The two triangles match, so they are the bases.
:::

::: try
1. Name this prism. How many lateral faces does it have?
@viz solid kind=ngon n=6 sv=1.5 hv=3 blabel="base" both=1 size=130
[[A hexagonal prism. It has 6 lateral faces.]]
2. A juice box stands up. Name a pair of bases. Count the lateral faces. [[The top and the bottom (any 2 opposite faces work). It has 4 lateral faces.]]
3. Sam says this doorstop is a rectangular prism. It sits on a rectangle. Is he right?
@viz solid kind=tri right=1 bv=5 thv=3 lv=7 ground=1 shade=0 size=170
[[No. The 2 matching ends are triangles. It is a triangular prism.]]
4. How many bases does a cylinder have? What shape are they? [[2 bases. They are circles.]]
5. Is a soup can a prism? Say why. [[No. A prism's lateral faces are rectangles. A can has a curved surface. It is a cylinder.]]
:::
::: retrieval
1. Find the area of a rectangle 7 cm by 3 cm.
=> 21 cm²
2. A triangle has a base of 6 m and a height of 4 m. Find its area.
=> ½ × 6 × 4 = 12 m²
3. Find the area of a circle with a radius of 2 cm.
=> 3.14 × 2 × 2 = 12.56 cm²
4. Find 2³.
=> 8
5. ★ Stretch: A prism has 7 faces in all. Name the prism.
=> 2 faces are bases. 7 − 2 = 5 lateral faces. The base has 5 sides: a pentagonal prism.
:::

## Section 2: Volume by layers
Learning target: I can find the volume of a box by counting layers of cubes. I can give volume in cubic units.

### Vocabulary
- volume :: the space inside a 3-D object. We count it in cubes. :: a box that holds 24 cubes
- cubic centimetre (cm³) :: a cube 1 cm long on each edge. It is a unit of volume. :: about the size of a sugar cube
- cubic metre (m³) :: a cube 1 m long on each edge :: a big box you could sit in
- layer :: one flat level of cubes that covers the bottom :: 4 rows of 3 cubes
- millilitre (mL), litre (L) :: units for liquids. 1 cm³ holds 1 mL. 1000 mL = 1 L. :: a 1 L milk carton

#### Fill a box with cubes
@viz cube n=1 label="1 cm³" caption="A centimetre cube. Its volume is 1 cubic centimetre: 1 cm³."
Kai fills a box with centimetre cubes.
1. He covers the bottom with one layer. That is 4 rows of 3 cubes: 12 cubes.
2. He puts a second layer on top. Now there are 2 × 12 = 24 cubes.
@viz layers l=4 w=3 h=2 llabel="one layer: 4 × 3 = 12" blabel="2 layers: 12 × 2 = 24" caption="2 layers of 12 cubes make 24 cubes."
The box holds 24 cubes. Its **volume** is 24 cm³.

::: key Volume of a box
Volume = (cubes in one layer) × (number of layers).
One layer covers the bottom: l × w cubes.
The number of layers is the height, h.
So **V = l × w × h**. Volume is in cubic units: cm³ or m³.
:::

::: misconception
WRONG: "The box's volume is 24 cm²."
WHY: cm² counts flat squares. A square has no thickness. Volume counts cubes. A cube has length, width and height.
@viz sqside n=1 side="1 cm" labels="1 cm²: a flat square" cell=44 caption="A square unit"
@viz cube n=1 label="1 cm³: a cube" caption="A cubic unit"
RIGHT: Volume is in cubic units: 24 cm³. The little 3 means three lengths multiplied: l, w and h.
:::

::: example Worked Example 1 — A box of cubes
Mia packs centimetre cubes in a box. It is 5 cm long, 3 cm wide and 4 cm tall.
@viz layers l=5 w=3 h=4 llabel="one layer: [[15]] cubes" blabel="[[4]] layers"
Step 1: One layer is 5 × 3 = [[15]] cubes.
Step 2: There are 4 layers. [[15 × 4 = 60]] cubes.
Step 3: The volume is [[60 cm³]].
:::

::: example Worked Example 2 — A juice box
A juice box is 6 cm long, 4 cm wide and 10 cm tall. Find its volume.
@viz solid kind=box l="6 cm" w="4 cm" h="10 cm" lv=6 wv=4 hv=10 slices=10 size=170 caption="10 layers, each 6 × 4"
Step 1: One layer: 6 × 4 = [[24]] cubes.
Step 2: 10 layers: [[24 × 10 = 240]].
Step 3: V = [[240 cm³]].
Step 4: 1 cm³ holds 1 mL. So the box holds up to [[240 mL]] of juice.
:::

#### Any face can be the bottom layer
Turn a box on its side. The layers now go a new way. The volume stays the same.

::: example Worked Example 3 — A cereal box
A cereal box is 20 cm wide, 7 cm deep and 30 cm tall. Find its volume two ways.
@viz solid kind=box l="20 cm" w="7 cm" h="30 cm" lv=20 wv=7 hv=30 blabel="B" size=150 caption="Layers on the bottom"
@viz solid kind=box l="20 cm" w="7 cm" h="30 cm" lv=20 wv=7 hv=30 base=front blabel="B" size=150 caption="Layers on the front"
Step 1: Bottom first. One layer is 20 × 7 = [[140]] cubes. 30 layers: [[140 × 30 = 4200]] cm³.
Step 2: Front first. One layer is 20 × 30 = [[600]] cubes. 7 layers: [[600 × 7 = 4200]] cm³.
Step 3: Both ways give the same volume.
:::
::: explain
Why is the number of layers the same as the height?
(lines 2)
=> Each layer is one cube tall, so 1 cm tall. A box 4 cm tall holds 4 layers.
:::

#### Volume and litres
1 cm³ holds 1 mL of water. Think of a cube 10 cm on each edge. It holds 10 × 10 × 10 = 1000 cm³. That is 1000 mL, or 1 litre.
@viz solid kind=box l="10 cm" w="10 cm" h="10 cm" lv=10 wv=10 hv=10 fill=water size=120 caption="A 10 cm cube holds 1 litre."

::: try
1. Find the volume.
@viz layers l=3 w=2 h=3 llabel="one layer: [[6]] cubes" blabel="[[3]] layers"
[[One layer: 3 × 2 = 6 cubes. 3 layers: 6 × 3 = 18 cm³.]]
2. A fish tank is 50 cm long, 25 cm wide and 30 cm tall. Find its volume. How many litres is that?
@viz solid kind=box l="50 cm" w="25 cm" h="30 cm" lv=50 wv=25 hv=30 fill=water size=150
[[50 × 25 = 1250. 1250 × 30 = 37 500 cm³. That is 37.5 L.]]
3. Leo has a box 2 cm by 3 cm by 4 cm. He says its volume is 24 cm². Fix his mistake. [[The number is right. The unit is wrong. The volume is 24 cm³.]]
4. A shed is 5 m long, 2 m wide and 3 m tall. Find its volume. [[5 × 2 × 3 = 30 m³.]]
5. How many centimetre cubes would fill a 1 L carton? [[1000. 1 L = 1000 mL = 1000 cm³.]]
:::
::: retrieval
1. Name a prism with triangle bases.
=> a triangular prism
2. How many lateral faces does a rectangular prism have?
=> 4
3. Find 3.14 × 5 × 5.
=> 78.5
4. Find 12 × 25.
=> 300
5. ★ Stretch: A box holds 36 cubes in one layer. It holds 180 cubes in all. How many layers?
=> 180 ÷ 36 = 5 layers
:::

## Section 3: Volume = base area × height
Learning target: I can find the volume of any prism or cylinder. I use V = B × h.

### Vocabulary
- base area (B) :: the area of one base :: a 3 cm by 4 cm base has B = 12 cm²
- height of a prism (h) :: the distance from one base to the other :: the length of a Toblerone-style box
- height of a triangle :: the distance from the triangle's bottom side straight up to its top. It is used to find B. :: the 1.5 m tip of a tent
- V = Bh :: volume = base area × height :: works for every prism and every cylinder

#### Stack the base
For a box, one layer covers the base. Its area is B = l × w. There are h layers. So V = B × h.
The same idea works for any prism. Think of thin slices, each a copy of the base. Stack them up to the height.
@viz solid kind=box lv=4 wv=3 hv=5 slices=5 blabel="B" h="h" size=130 caption="A box: B = l × w. Stack h layers."
@viz solid kind=tri along=z bv=4 thv=3 lv=5 slices=5 blabel="B" l="h" size=150 caption="A triangular prism: stack copies of the triangle."
@viz solid kind=cyl rv=2 hv=4 slices=4 blabel="B" h="h" size=130 caption="A cylinder: stack copies of the circle, like coins."

::: key Volume of a prism or cylinder
**V = B × h**, also written **V = Bh**.
B is the area of one base. h is the distance between the two bases.
Rectangle base: **B = l × w**.
Triangle base: **B = ½ × b × (height of the triangle)**.
Circle base: **B = π × r × r ≈ 3.14 × r × r**.
:::

::: example Worked Example 1 — A Toblerone-style box
The triangle end has a base of 4 cm and a height of 3.5 cm. The box is 20 cm long. Find its volume.
@viz solid kind=tri b="4 cm" th="3.5 cm" l="20 cm" bv=4 thv=3.5 lv=6 blabel="B" size=230
Step 1: The bases are the triangles. B = ½ × 4 × 3.5 = [[7]] cm².
Step 2: The prism's h is the length between the triangles: 20 cm.
Step 3: V = B × h = [[7 × 20 = 140]]. V = [[140 cm³]].
:::

::: example Worked Example 2 — A barn roof
The attic of a barn is a triangular prism. The triangle is 8 m across and 3 m high. The barn is 12 m long.
@viz solid kind=tri along=z b="8 m" th="3 m" l="12 m" bv=8 thv=3 lv=12 blabel="B" fill=earth size=200
Step 1: B = ½ × 8 × 3 = [[12 m²]].
Step 2: h is the distance between the triangles: h = [[12 m]].
Step 3: V = B × h = [[12 × 12 = 144]]. The attic holds [[144 m³]].
:::

::: misconception
WRONG: "The tent is 1.5 m tall. So h = 1.5 m. V = 1.5 × 1.5 = 2.25 m³."
WHY: There are two heights. 1.5 m is the triangle's height. It goes inside B. The prism's h is the distance between the two triangles. That is 3 m.
@viz solid kind=tri along=z b="2 m" th="1.5 m" l="h = 3 m" bv=2 thv=1.5 lv=3 blabel="B" fill=plant size=210
RIGHT: B = ½ × 2 × 1.5 = 1.5 m². V = B × h = 1.5 × 3 = 4.5 m³.
:::

::: example Worked Example 3 — A hockey puck
A hockey puck has a radius of 3.8 cm. It is 2.5 cm thick. Find its volume.
@viz solid kind=cyl r="r = 3.8 cm" h="h = 2.5 cm" rv=3.8 hv=2.5 blabel="B" size=150
Step 1: The base is a circle. First find r × r: 3.8 × 3.8 = [[14.44]].
Step 2: B ≈ 3.14 × [[14.44]] = [[45.3416]] cm².
Step 3: V = B × h ≈ [[45.3416 × 2.5 = 113.354]].
Step 4: Round to one decimal place. V ≈ [[113.4 cm³]].
:::

::: example Worked Example 4 — A grain bin
A grain bin is 6 m across. It is 5 m tall. Find its volume.
@viz solid kind=cyl r="d = 6 m" h="h = 5 m" rv=3 hv=5 diameter=1 blabel="B" fill=cold size=150
Step 1: Circle area needs the radius. r = 6 ÷ 2 = [[3 m]].
Step 2: B ≈ 3.14 × [[3 × 3]] = [[28.26]] m².
Step 3: V = B × h ≈ [[28.26 × 5 = 141.3]]. V ≈ [[141.3 m³]].
:::

::: misconception
WRONG: "The bin is 6 m across. So B ≈ 3.14 × 6 × 6."
WHY: 6 m is the diameter. The area of a circle uses the radius. Using the diameter makes B 4 times too big.
@viz circle show=rd rlabel="r = 3 m" dlabel="d = 6 m" fill=cold size=56
RIGHT: Halve the diameter first: r = 3 m. B ≈ 3.14 × 3 × 3 = 28.26 m².
:::
::: explain
In Worked Example 1, why do we multiply B by 20 and not by 3.5?
(lines 2)
=> 20 cm is the distance between the two bases. 3.5 cm is the triangle's height. We already used it to find B.
:::

::: try
1. Find the volume.
@viz solid kind=tri along=z b="6 cm" th="4 cm" l="10 cm" bv=6 thv=4 lv=10 blabel="B" size=170
[[B = ½ × 6 × 4 = 12 cm². V = 12 × 10 = 120 cm³.]]
2. A soup can has a radius of 4 cm and a height of 10 cm. Find its volume.
@viz solid kind=cyl r="r = 4 cm" h="h = 10 cm" rv=4 hv=10 blabel="B" size=130
[[B ≈ 3.14 × 4 × 4 = 50.24 cm². V ≈ 50.24 × 10 = 502.4 cm³.]]
3. A round hay bale lies on its side. It is 1.6 m across and 1.2 m long. Find its volume.
@viz solid kind=cyl lying=1 r="d = 1.6 m" h="h = 1.2 m" rv=0.8 hv=1.2 diameter=1 fill=sun ground=1 size=140
[[r = 0.8 m. B ≈ 3.14 × 0.8 × 0.8 = 2.0096 m². V ≈ 2.0096 × 1.2 = 2.41152. About 2.4 m³.]]
4. A box has a base area of 35 cm². It is 8 cm tall. Find its volume. [[V = 35 × 8 = 280 cm³.]]
5. A cylinder is 10 cm across and 2 cm tall. Ava finds V ≈ 3.14 × 10 × 10 × 2. Fix her mistake. [[Use the radius, 5 cm. B ≈ 3.14 × 5 × 5 = 78.5 cm². V ≈ 78.5 × 2 = 157 cm³.]]
:::
::: retrieval
1. Name the bases of a hockey puck.
=> the two flat circles
2. Find the volume of a box 3 cm by 4 cm by 5 cm.
=> 60 cm³
3. Is volume in cm² or in cm³?
=> cm³
4. Find 25% of 60.
=> 15
5. ★ Stretch: Two cans are the same height. Can B has double the radius of can A. How many times as much does B hold?
=> 4 times. B uses r × r, and 2 × 2 = 4.
:::

## Section 4: Finding a missing measure
Learning target: I can find the base area or the height from the volume. I can change units so they match first.

### Vocabulary
- missing measure :: the length or area you need to find :: h = ?
- undo :: use the opposite operation. Division undoes multiplication. :: 6 × 4 = 24, so 24 ÷ 4 = 6
- same units :: every length in cm, or every length in m :: 50 cm = 0.5 m
- metre and centimetre :: 1 m = 100 cm :: 1.5 m = 150 cm

#### Undo the multiplication
V = B × h is a multiplication fact, like 24 = 6 × 4.
Know V and B? Divide to find the height: **h = V ÷ B**.
Know V and h? Divide to find the base area: **B = V ÷ h**.
@viz solid kind=box lv=4 wv=3 hv=5 slices=5 blabel="B" h="h = ?" size=130 caption="Each layer has volume B. V ÷ B counts the layers."
@viz solid kind=cyl rv=2 hv=3 slices=3 blabel="B = ?" h="h" fill=cold size=130 caption="Know V and h? V ÷ h gives one layer: B."

::: key Find a missing measure
**h = V ÷ B** (volume ÷ base area)
**B = V ÷ h** (volume ÷ height)
Change every length to the same unit first.
Check: multiply B × h. Do you get V?
:::

::: example Worked Example 1 — A lunch cooler
A cooler holds 24 000 cm³. The inside of its bottom is 40 cm by 30 cm. How deep is it inside?
@viz solid kind=box l="40 cm" w="30 cm" h="h = ?" lv=40 wv=30 hv=20 blabel="B" size=180
Step 1: B = 40 × 30 = [[1200 cm²]].
Step 2: h = V ÷ B = [[24 000 ÷ 1200 = 20]].
Step 3: The cooler is [[20 cm]] deep inside.
Step 4: Check: B × h = [[1200 × 20 = 24 000]].
:::

::: example Worked Example 2 — A swimming pool
A pool holds 300 m³ of water. The water is 1.5 m deep. Find the area of the bottom.
@viz solid kind=box h="1.5 m" lv=20 wv=10 hv=1.5 blabel="B = ?" fill=water size=200
Step 1: The water is a box. Its height is the depth: h = 1.5 m.
Step 2: B = V ÷ h = [[300 ÷ 1.5 = 200]].
Step 3: The bottom has an area of [[200 m²]].
Step 4: The pool is 20 m long. Its width is [[200 ÷ 20 = 10 m]].
:::

::: example Worked Example 3 — A round hay bale
The end of a round bale has an area of 2 m². The bale has a volume of 3 m³. How long is it from end to end?
@viz solid kind=cyl lying=1 h="h = ?" rv=0.8 hv=1.5 blabel="B" both=1 fill=sun ground=1 size=150
Step 1: The bases are the circle ends. B = 2 m².
Step 2: h = V ÷ B = [[3 ÷ 2 = 1.5]].
Step 3: The bale is [[1.5 m]] long.
:::

#### Same units first

::: misconception
WRONG: "A sandbox is 2 m long, 150 cm wide and 30 cm deep. V = 2 × 150 × 30 = 9000."
WHY: The units do not match. The 2 is in metres. The 150 and the 30 are in centimetres.
@viz solid kind=box l="2 m" w="150 cm" h="30 cm" lv=200 wv=150 hv=30 fill=earth size=170
RIGHT: Change to metres first. 150 cm = 1.5 m and 30 cm = 0.3 m. V = 2 × 1.5 × 0.3 = 0.9 m³.
:::

::: example Worked Example 4 — A water trough
A trough is a box. It is 2 m long and 50 cm wide. It holds 0.6 m³ of water. How deep is it?
@viz solid kind=box l="2 m" w="50 cm" h="h = ?" lv=2 wv=0.5 hv=0.6 blabel="B" fill=water size=180
Step 1: Same units first. 50 cm = [[0.5 m]].
Step 2: B = [[2 × 0.5 = 1 m²]].
Step 3: h = V ÷ B = [[0.6 ÷ 1 = 0.6]].
Step 4: The trough is [[0.6 m]] deep. That is [[60 cm]].
:::
::: explain
In Worked Example 4, why do we change 50 cm to metres first?
(lines 2)
=> The volume is in m³, so every length must be in m. 2 × 50 would mix metres and centimetres.
:::

::: try
1. A box has a volume of 72 cm³. Its base area is 12 cm². Find its height.
@viz solid kind=box lv=7 wv=3 hv=6 blabel="B = 12 cm²" h="h = ?" size=150
[[h = V ÷ B = 72 ÷ 12 = 6 cm.]]
2. A grain bin holds 141.3 m³. Its base area is 28.26 m². How tall is it?
@viz solid kind=cyl rv=3 hv=5 blabel="B" h="h = ?" fill=cold size=130
[[h = 141.3 ÷ 28.26 = 5 m.]]
3. A Toblerone-style box holds 140 cm³. It is 20 cm long. Find the area of its triangle end. [[B = V ÷ h = 140 ÷ 20 = 7 cm².]]
4. A juice box holds 250 cm³. Its bottom is 5 cm by 5 cm. How tall is it? [[B = 5 × 5 = 25 cm². h = 250 ÷ 25 = 10 cm.]]
5. A sandbox is 3 m long, 120 cm wide and 25 cm deep. Find its volume in m³. [[Change to m: 1.2 m and 0.25 m. V = 3 × 1.2 × 0.25 = 0.9 m³.]]
6. ★ Stretch: A can holds 1 L (1000 cm³). Its base area is 78.5 cm². About how tall is it? [[h = 1000 ÷ 78.5 ≈ 12.7 cm.]]
:::
::: retrieval
1. A triangular prism has B = 9 cm² and h = 6 cm. Find its volume.
=> 9 × 6 = 54 cm³
2. A cylinder has r = 2 m and h = 3 m. Find its volume.
=> B ≈ 3.14 × 2 × 2 = 12.56 m². V ≈ 12.56 × 3 = 37.68, about 37.7 m³.
3. Name a prism with hexagon bases.
=> a hexagonal prism
4. Change 250 cm to metres.
=> 2.5 m
5. Solve 4x = 36.
=> x = 9
6. ★ Stretch: Box A is 10 cm by 10 cm by 10 cm. Box B has the same volume. Its bottom is 20 cm by 10 cm. How tall is box B?
=> V = 1000 cm³. B = 200 cm². h = 1000 ÷ 200 = 5 cm.
:::

## Unit Synthesis
1. A grain bin is 8 m across and 6 m tall. a) Name its bases. b) Find the base area. c) Find its volume.
@viz solid kind=cyl r="d = 8 m" h="h = 6 m" rv=4 hv=6 diameter=1 blabel="B" fill=cold size=130
=> a) The two circles, top and bottom.
=> b) r = 4 m. B ≈ 3.14 × 4 × 4 = 50.24 m².
=> c) V ≈ 50.24 × 6 = 301.44, about 301.4 m³.
2. Why does V = B × h work for a box? Use layers of cubes to explain.
@viz layers l=4 w=3 h=3 llabel="one layer = B" blabel="h layers"
=> One layer covers the base, so it holds B cubes. There are h layers. So V = B × h.
3. A tent's triangle end is 2.4 m wide and 1.5 m high. The tent is 2.5 m long. Find its volume. Which number is the triangle's height?
=> B = ½ × 2.4 × 1.5 = 1.8 m². V = 1.8 × 2.5 = 4.5 m³. The triangle's height is 1.5 m. It goes inside B.
4. A box holds 1.2 m³. It is 2 m long and 60 cm wide. How tall is it?
=> 60 cm = 0.6 m. B = 2 × 0.6 = 1.2 m². h = 1.2 ÷ 1.2 = 1 m.
5. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Prisms and cylinders
A prism has 2 matching, parallel bases. Its lateral faces are rectangles. Name it by its base.
A cylinder has 2 circle bases and 1 curved surface.
The bases match at opposite ends. They do not have to be on the bottom.
:::
@viz solid kind=tri bv=4 thv=3.5 lv=9 blabel="base" both=1 ground=1 size=200

::: key Volume by layers
Volume counts cubes. 1 cm³ is a cube 1 cm on each edge.
A box: one layer is l × w cubes. There are h layers. **V = l × w × h**.
Units: cm³ or m³. 1 cm³ holds 1 mL. 1000 cm³ = 1 L.
:::
@viz layers l=4 w=3 h=2 llabel="one layer: 4 × 3 = 12" blabel="2 layers: 24 cm³"

::: key Volume = base area × height
**V = B × h** for every prism and cylinder. h is the distance between the bases.
Rectangle: B = l × w. Triangle: B = ½ × b × (height of the triangle). Circle: B ≈ 3.14 × r × r.
:::
@viz solid kind=cyl rv=2 hv=4 slices=4 blabel="B" h="h" size=120

::: key Finding a missing measure
**h = V ÷ B** and **B = V ÷ h**. Change all lengths to the same unit first. Check: B × h = V.
:::

| Mistake | Fix |
|---|---|
| The base is the face it sits on | The bases are the 2 matching faces at opposite ends. |
| Volume in cm² | Volume counts cubes: cm³ or m³. |
| Using the triangle's height as the prism's h | The triangle's height goes inside B. h is the distance between the bases. |
| Using the diameter in B = 3.14 × r × r | Halve the diameter first. |
| Mixing cm and m | Change every length to the same unit first. |
