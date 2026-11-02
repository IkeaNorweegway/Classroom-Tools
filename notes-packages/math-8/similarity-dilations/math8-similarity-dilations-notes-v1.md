---
title: Similarity & Dilations
topic: similarity-dilations
strand: measurement-geometry
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "Similar means the same size" (SD1). "Double the sides, double the area" (SD3).
     "Add the scale factor to each coordinate" (SD4). Extra box in SD2: "Subtract to find the scale factor".
     Section order: what similar means first (SD1), by eye and by matching sides and angles, because every
     later section asks "are these similar?". Then the scale factor as one number that links the sides (SD2):
     find it, apply it, and use it to decide if shapes are similar. Then what the scale factor does to area,
     and scale drawings with maps, blueprints and models (SD3), which reuse k. Last, dilations on a grid
     about (0, 0) (SD4): multiply both coordinates by k, then check similarity with side lengths and rays
     through the centre. Outcomes 8G1.1 (SD1–SD3), 8G1.2 (SD4). No volume scaling. Dilations about the
     origin only. -->

## Pre-Knowledge Check
1. Write the ratio 6 : 9 in lowest terms.
2. Are {2/3} and {8/12} equivalent?
3. Find 2.5 × 4.
4. Find the area of a rectangle 5 cm long and 3 cm wide.
5. Solve 4 × n = 18.
6. Plot the point (3, 2). How far right? How far up?

## Section 1: Similar shapes
Learning target: I can tell if two shapes are similar. I can match their sides and angles.

### Vocabulary
- similar (~) :: same shape, maybe a different size. One is a scale copy of the other. :: △ABC ~ △DEF
- scale copy :: a copy with every length multiplied by the same number :: a phone photo, zoomed in
- corresponding sides :: matching sides of two shapes :: AB and DE
- corresponding angles :: matching angles of two shapes. In similar shapes they are equal. :: ∠A and ∠D
- proportional :: in the same ratio. Every pair of sides has the same multiplier. :: 3 → 6 and 4 → 8 (both × 2)

#### Zoom in on a photo
Zoom in on a photo on a phone. It gets bigger. The shape stays the same.
The bigger photo is **similar** to the small one.
Now stretch the photo only sideways. Faces look wide and flat. That copy is **not similar**.
@viz polygon pts="0,0;3,0;3,2;0,2" cap="Photo" pts2="0,0;6,0;6,4;0,4" cap2="Zoomed in" sides="3 cm;2 cm;;" sides2="6 cm;4 cm;;" unit=22 caption="Every side doubles. Same shape: similar."
@viz polygon pts="0,0;3,0;3,2;0,2" cap="Photo" pts2="0,0;6,0;6,2;0,2" cap2="Stretched" sides="3 cm;2 cm;;" sides2="6 cm;2 cm;;" unit=22 caption="Only the length doubles. Different shape: not similar."

::: key Similar shapes
**Corresponding angles are equal.**
**Corresponding sides are proportional.** Every side is multiplied by the same number.
A similar copy may be turned or flipped. Match the parts by their marks, not by how they sit.
△ABC ~ △DEF means "triangle ABC is similar to triangle DEF". The letter order shows the match.
:::

::: misconception
WRONG: "Similar means the same size."
WHY: These two triangles have the same angles. One is twice as big. They are still similar.
@viz polygon pts="0,0;4,0;0,3" right="1" angles=";37°;53°" sides="4 cm;5 cm;3 cm" pts2="0,0;8,0;0,6" right2="1" angles2=";37°;53°" sides2="8 cm;10 cm;6 cm" unit=20
RIGHT: Similar means the same shape. The size can change. Same shape AND same size is congruent.
:::

::: example Worked Example 1 — Which rectangles are similar?
Compare long side ÷ short side for each rectangle.
@viz polygon pts="0,0;3,0;3,2;0,2" sides="3 m;2 m;;" cap="A" pts2="0,0;6,0;6,4;0,4" sides2="6 m;4 m;;" cap2="B" unit=20
@viz polygon pts="0,0;6,0;6,3;0,3" sides="6 m;3 m;;" cap="C" unit=20
Step 1: A: 3 ÷ 2 = 1.5. The long side is 1.5 times the short side.
Step 2: B: 6 ÷ 4 = 1.5. Same as A.
Step 3: C: 6 ÷ 3 = 2. Not the same.
Step 4: A and B are similar. C is [[not similar]] to them.
:::

::: example Worked Example 2 — Two triangles
Are △ABC and △DEF similar?
@viz polygon pts="0,0;4,0;0,3" names="A,B,C" right="1" sides="4;5;3" arcs="0,1,2" pts2="0,0;8,0;0,6" names2="D,E,F" right2="1" sides2="8;10;6" arcs2="0,1,2" unit=20
Step 1: Match the angles by marks. ∠A and ∠D are right angles. ∠B and ∠E have one arc. ∠C and ∠F have two arcs.
Step 2: Match the sides. AB ↔ DE: 4 → 8. BC ↔ EF: 5 → 10. CA ↔ FD: 3 → 6.
Step 3: Each side is multiplied by 2. The angles are equal.
Step 4: Equal angles and proportional sides. So the triangles are [[similar]].
:::
::: explain
In Worked Example 2, why is matching the angles not enough to stop? What else must you check?
(lines 2)
=> Similar needs both: equal angles AND proportional sides. Here every side is × 2, so it works.
:::

::: example Worked Example 3 — All circles, all squares
@viz circle show=r rlabel="1 cm" size=40 size2=80 show2=r rlabel2="2 cm" title="Circle" title2="Bigger circle"
@viz squares shapes="1x1;2x2;3x3" labels="1 by 1;2 by 2;3 by 3"
Step 1: Every circle is round. Only the size changes. So all circles are similar.
Step 2: Every square has four right angles and four equal sides. So all squares are [[similar]].
Step 3: Rectangles are different. A long thin one is not similar to a square-ish one.
:::

::: example Worked Example 4 — A turned copy
△RST is a turned copy of △ABC. Write a similarity statement.
@viz polygon pts="0,0;4,0;1,3" names="A,B,C" arcs="1,2,3" pts2="0,0;0,6;-4.5,1.5" names2="R,S,T" arcs2="1,2,3" unit=20
Step 1: Match by arcs. One arc: ∠A and ∠R. Two arcs: ∠B and ∠S. Three arcs: ∠C and ∠T.
Step 2: Write the letters in matching order: △ABC ~ [[△RST]].
:::

::: try
1. A rectangle is 4 cm by 2 cm. Another is 8 cm by 4 cm. Are they similar? [[Yes. 4 ÷ 2 = 2 and 8 ÷ 4 = 2.]]
2. Are these rectangles similar?
@viz polygon pts="0,0;5,0;5,2;0,2" sides="5 cm;2 cm;;" pts2="0,0;6,0;6,3;0,3" sides2="6 cm;3 cm;;" unit=20
[[No. 5 ÷ 2 = 2.5, but 6 ÷ 3 = 2.]]
3. Is a small circle similar to a big circle? [[Yes. All circles are similar.]]
4. Leah says two triangles must be the same size to be similar. Is she right? [[No. Similar means same shape. Same size is congruent.]]
:::
::: retrieval
1. Write 12 : 8 in lowest terms.
=> 3 : 2
2. Find 3.6 × 2.
=> 7.2
3. y = 2x. Find y when x = 4.5.
=> 9
4. Solve 3n = 7.5.
=> n = 2.5
5. ★ Stretch: Draw two rectangles that are similar. Draw one that is not similar to them.
=> Answers vary. For example, 2 by 1, 4 by 2, and 4 by 1.
:::

## Section 2: Scale factor
Learning target: I can find a scale factor. I can use it to find a missing side. I can use it to decide if shapes are similar.

### Vocabulary
- original :: the shape you start with :: the photo before you zoom
- image (copy) :: the new shape after scaling :: the zoomed-in photo
- scale factor (k) :: the number each length is multiplied by. k = copy length ÷ original length. :: 6 cm ÷ 2 cm = 3
- enlargement :: a bigger copy. k is more than 1. :: k = 3
- reduction :: a smaller copy. k is between 0 and 1. :: k = 0.5

#### One number does it all
Every side of the copy is the original side times the same number. That number is the **scale factor**, k.
@viz polygon pts="0,0;2,0;2,1;0,1" sides="2 cm;1 cm;;" cap="Original" pts2="0,0;6,0;6,3;0,3" sides2="6 cm;3 cm;;" cap2="Copy" unit=22 caption="6 ÷ 2 = 3 and 3 ÷ 1 = 3. So k = 3."
@viz numberline min=0 max=3 step=0.5 points="0.5:reduction;1:same size;2.5:enlargement" caption="k < 1 shrinks. k = 1 keeps the size. k > 1 enlarges."

::: key Scale factor
**k = copy length ÷ original length.** Use the same units for both.
**k > 1:** enlargement. **k = 1:** same size. **0 < k < 1:** reduction.
To find a copy length: original × k. To find an original length: copy ÷ k.
Shapes are similar if every pair of sides gives the same k. The angles must match too.
:::

::: example Worked Example 1 — Find k
A rectangle is 4 cm by 2 cm. Its copy is 10 cm by 5 cm. Find k.
@viz polygon pts="0,0;4,0;4,2;0,2" sides="4 cm;2 cm;;" pts2="0,0;10,0;10,5;0,5" sides2="10 cm;5 cm;;" unit=14
Step 1: Long sides: k = 10 ÷ 4 = 2.5.
Step 2: Short sides: k = 5 ÷ 2 = [[2.5]].
Step 3: Same k both times. The copy is an [[enlargement]] with k = 2.5.
:::

::: misconception
WRONG: "Subtract to find the scale factor. 6 − 2 = 4, so k = 4."
WHY: Scaling multiplies. Check: 2 × 4 = 8, not 6. And 1 + 4 = 5 is not 3.
@viz polygon pts="0,0;2,0;2,1;0,1" sides="2;1;;" pts2="0,0;6,0;6,3;0,3" sides2="6;3;;" unit=22
RIGHT: Divide: k = 6 ÷ 2 = 3. Check: 1 × 3 = 3. It works for every side.
:::

::: example Worked Example 2 — A reduction
A photo is 15 cm by 10 cm. A small print is 6 cm by 4 cm. Find k.
@viz polygon pts="0,0;15,0;15,10;0,10" sides="15 cm;10 cm;;" cap="Original" pts2="0,0;6,0;6,4;0,4" sides2="6 cm;4 cm;;" cap2="Small print" unit=8
Step 1: k = copy ÷ original = 6 ÷ 15 = [[0.4]].
Step 2: Check the other side: 4 ÷ 10 = [[0.4]].
Step 3: k is between 0 and 1. So it is a [[reduction]].
:::
::: explain
In Worked Example 2, why is k less than 1?
(lines 2)
=> The copy is smaller than the original. Copy ÷ original is a small number ÷ a bigger number.
:::

::: example Worked Example 3 — Find a missing side
△DEF ~ △ABC with k = 3. Find DE and BC.
@viz polygon pts="0,0;2.5,0;0.5,3.46" names="A,B,C" sides="2.5 cm;BC = ?;" arcs="1,2,3" pts2="0,0;7.5,0;1.5,10.39" names2="D,E,F" sides2="DE = [[7.5 cm]];12 cm;" arcs2="1,2,3" unit=11
Step 1: DE matches AB. Copy = original × k: DE = 2.5 × 3 = [[7.5 cm]].
Step 2: EF matches BC. Original = copy ÷ k: BC = 12 ÷ 3 = [[4 cm]].
:::

::: example Worked Example 4 — Similar or not?
@viz polygon pts="0,0;5,0;5,3;0,3" sides="5 cm;3 cm;;" pts2="0,0;10,0;10,7;0,7" sides2="10 cm;7 cm;;" unit=14
Step 1: Long sides: k = 10 ÷ 5 = [[2]].
Step 2: Short sides: k = 7 ÷ 3 ≈ [[2.33]].
Step 3: The two values of k are [[different]]. So the rectangles are [[not similar]].
:::

::: try
1. A triangle has sides 2, 3 and 4. A copy has sides 5, 7.5 and 10. Find k. [[k = 5 ÷ 2 = 2.5. Check: 3 × 2.5 = 7.5 and 4 × 2.5 = 10.]]
2. Is k = 0.75 an enlargement or a reduction? [[A reduction: 0.75 is less than 1.]]
3. A shape is copied with k = 4. One side is 1.5 cm. How long is the copy's side? [[1.5 × 4 = 6 cm]]
4. Find k. Use the same units first.
@viz polygon pts="0,0;5,0;5,2;0,2" sides="50 cm;20 cm;;" cap="Original" pts2="0,0;10,0;10,4;0,4" sides2="1 m;40 cm;;" cap2="Copy" unit=14
[[1 m = 100 cm. k = 100 ÷ 50 = 2. Check: 40 ÷ 20 = 2.]]
5. A copy has k = 1. What do you know about it? [[It is the same size. It is congruent to the original.]]
:::
::: retrieval
1. Are a 6 by 4 rectangle and a 9 by 6 rectangle similar?
=> Yes. 6 ÷ 4 = 1.5 and 9 ÷ 6 = 1.5.
2. △PQR ~ △XYZ. Which angle matches ∠Q?
=> ∠Y
3. Find 12 ÷ 0.4.
=> 30
4. Solve 2.5x = 10.
=> x = 4
5. ★ Stretch: A copy has sides that are 60% of the original. What is k?
=> k = 0.6
:::

## Section 3: Area and scale drawings
Learning target: I can tell how area changes with the scale factor. I can use a scale to find real lengths.

### Vocabulary
- k² :: k × k. Areas of similar shapes grow by k². :: k = 3, so k² = 9
- scale drawing :: a drawing that is similar to a real object :: a map, a blueprint
- scale :: how drawing lengths compare to real lengths :: 1 cm : 2 km
- blueprint :: a scale drawing of a building :: a plan of a garage
- scale model :: a small 3-D copy of a real object :: a model train

#### Count the squares
Double the side of a square. How many small squares fit inside?
@viz squares shapes="1x1;2x2;3x3" labels="k = 1: 1 square;k = 2: [[4]] squares;k = 3: [[9]] squares"
The length goes up by k. The width goes up by k too. So the area goes up by k × k = **k²**.
@viz squares shapes="3x2;6x4" labels="3 × 2 = 6 squares;6 × 4 = [[24]] squares" caption="k = 2. The area is 4 times as big."

::: key Area of similar shapes
**New area = old area × k².**
k = 2 → 4 times the area. k = 3 → 9 times. k = 0.5 → 0.25 times (one quarter).
:::

::: misconception
WRONG: "Double the sides, double the area."
WHY: Count the squares. 3 by 2 has 6 squares. 6 by 4 has 24 squares. That is 4 times, not 2.
@viz polygon pts="0,0;3,0;3,2;0,2" sides="3;2;;" cap="Area 6" pts2="0,0;6,0;6,4;0,4" sides2="6;4;;" cap2="Area 24" unit=18
RIGHT: Double the sides gives 2² = 4 times the area. Length AND width both double.
:::

::: example Worked Example 1 — A bigger garden
A garden is 3 m by 2 m. A new garden is similar with k = 2. Find its area two ways.
@viz polygon pts="0,0;3,0;3,2;0,2" sides="3 m;2 m;;" pts2="0,0;6,0;6,4;0,4" sides2="[[6 m]];[[4 m]];;" unit=18 caption="Old garden (left). New garden (right)."
Step 1: Old area: 3 × 2 = 6 m².
Step 2: New sides: 6 m by 4 m. New area: 6 × 4 = [[24 m²]].
Step 3: Or use k²: 6 × 2² = 6 × 4 = [[24 m²]].
:::

::: example Worked Example 2 — Edmonton's river valley
On a trail map, Hawrelak Park and Rundle Park are 4.5 cm apart. The scale is 1 cm : 2 km.
@viz sdmap a="Hawrelak Park" b="Rundle Park" len=4.5 angle=10 dist="4.5 cm" scale="1 cm : 2 km" bar="0;2 km;4 km;6 km" river=1 title="Trail map"
Step 1: Each map centimetre is 2 km of real distance.
Step 2: Real distance = 4.5 × 2 = [[9 km]].
:::
::: explain
In Worked Example 2, a friend says "4.5 + 2 = 6.5 km". What went wrong?
(lines 2)
=> Each centimetre stands for 2 km, so 4.5 cm is 4.5 groups of 2 km. Multiply, don't add.
:::

::: example Worked Example 3 — A garage blueprint
A blueprint uses 1 cm : 0.5 m. The garage is 12 cm by 8 cm on the drawing.
@viz polygon pts="0,0;12,0;12,8;0,8" sides="12 cm;8 cm;;" cap="Blueprint: 1 cm : 0.5 m" unit=12
Step 1: Real length: 12 × 0.5 = [[6 m]]. Real width: 8 × 0.5 = [[4 m]].
Step 2: Real floor area: 6 × 4 = [[24 m²]].
:::

::: example Worked Example 4 — A model of the Calgary Tower
The Calgary Tower is about 191 m tall. A model uses 1 cm : 5 m.
@viz numberline min=0 max=200 step=50 points="191:real tower 191 m" caption="Every 5 m of tower is 1 cm of model."
Step 1: Model height = real height ÷ 5. So 191 ÷ 5 = [[38.2 cm]].
Step 2: The model is a [[reduction]].
:::

::: example Worked Example 5 — A photo enlargement
A 10 cm by 15 cm photo is enlarged with k = 2. How many times as much paper does it cover?
@viz polygon pts="0,0;10,0;10,15;0,15" sides="10 cm;15 cm;;" pts2="0,0;20,0;20,30;0,30" sides2="[[20 cm]];[[30 cm]];;" unit=5
Step 1: Old area: 10 × 15 = 150 cm². New area: 20 × 30 = [[600 cm²]].
Step 2: 600 ÷ 150 = [[4]]. That is k² = 2² = 4.
:::

::: try
1. A square has area 5 cm². A similar square has k = 3. Find its area. [[5 × 3² = 5 × 9 = 45 cm²]]
2. A Banff park map uses 1 cm : 5 km. A trail is 3.2 cm long on the map. How long is the real trail?
@viz sdmap a="Trailhead" b="Lake" len=3.2 angle=25 dist="3.2 cm" scale="1 cm : 5 km" bar="0;5 km;10 km;15 km"
[[3.2 × 5 = 16 km]]
3. A model train uses 1 : 87. A real rail car is 17.4 m long. How long is the model in centimetres? [[17.4 ÷ 87 = 0.2 m = 20 cm]]
4. Omar says a photo enlarged with k = 3 uses 3 times the paper. Fix his mistake. [[It uses 3² = 9 times the paper. Length and width both triple.]]
:::
::: retrieval
1. Find k: a 4 cm side becomes 1 cm.
=> k = 1 ÷ 4 = 0.25. A reduction.
2. Are all squares similar?
=> Yes. Same angles, and all four sides are equal.
3. △ABC ~ △DEF, k = 2, AB = 3.5 cm. Find DE.
=> 3.5 × 2 = 7 cm
4. Find 0.5².
=> 0.25
5. ★ Stretch: A shape's area became 25 times bigger. What was k?
=> k² = 25, so k = 5.
:::

## Section 4: Dilations on a grid
Learning target: I can dilate a shape about (0, 0). I can check that the image is similar.

### Vocabulary
- dilation :: an enlargement or reduction from a fixed point :: k = 2 about (0, 0)
- centre of dilation :: the fixed point. In Grade 8 it is the origin, (0, 0). :: (0, 0)
- image :: the shape after the dilation :: △A′B′C′
- A′ :: "A prime": the image of point A :: A(1, 2) → A′(2, 4)

#### Multiply both coordinates
A dilation about (0, 0) multiplies **both** coordinates by k.
Each image point sits on a line from (0, 0) through its original point.
@viz sddilate pts="1,1;3,1;1,2" k=2 names="A,B,C" image=show rays=1 caption="Lines from (0, 0) pass through A and A′, B and B′, C and C′."

::: key Dilation about (0, 0)
**(x, y) → (kx, ky).** Multiply both numbers by k.
k > 1: the image is bigger and farther from (0, 0). 0 < k < 1: smaller and closer.
Check: every image side is k times its original side. Lines through (0, 0) join matching vertices.
:::

::: example Worked Example 1 — Enlarge with k = 2
Dilate △ABC about (0, 0) with k = 2. A(1, 1), B(3, 1), C(1, 2).
@viz sddilate pts="1,1;3,1;1,2" k=2 names="A,B,C" image=key rays=1
Step 1: A(1, 1) → (1 × 2, 1 × 2) = A′(2, 2).
Step 2: B(3, 1) → B′([[6]], [[2]]). C(1, 2) → C′([[2]], [[4]]).
Step 3: Plot A′, B′ and C′. Join them.
:::

::: misconception
WRONG: "Add the scale factor to each coordinate. With k = 2, (2, 3) becomes (4, 5)."
WHY: Adding slides the shape. It stays the same size. This is a translation, not a dilation.
@viz sddilate pts="1,1;3,1;1,2" ipts="3,3;5,3;3,4" names="A,B,C" image=show caption="Adding 2 slid the triangle. It did not grow."
RIGHT: Multiply: (2, 3) × 2 = (4, 6). Then every side doubles.
:::

::: example Worked Example 2 — Reduce with k = ½
Dilate rectangle PQRS about (0, 0) with k = 0.5. P(2, 2), Q(6, 2), R(6, 4), S(2, 4).
@viz sddilate pts="2,2;6,2;6,4;2,4" k=0.5 names="P,Q,R,S" image=key rays=1
Step 1: P(2, 2) → P′([[1]], [[1]]).
Step 2: Q → Q′([[3]], [[1]]). R → R′([[3]], [[2]]). S → S′([[1]], [[2]]).
Step 3: The image is [[closer to]] (0, 0) and smaller.
:::
::: explain
In Worked Example 2, why does the image move closer to (0, 0)?
(lines 2)
=> Halving both coordinates halves the distance from (0, 0) to each point.
:::

::: example Worked Example 3 — Check that it is similar
Use the grid from Worked Example 1.
@viz sddilate pts="1,1;3,1;1,2" k=2 names="A,B,C" image=show rays=1 cell=42
Step 1: AB = 3 − 1 = 2 units. A′B′ = 6 − 2 = [[4]] units. That is × 2.
Step 2: AC = 1 unit. A′C′ = [[2]] units. That is × [[2]].
Step 3: ∠A and ∠A′ are both [[right angles]].
Step 4: The sides are proportional and the angles match. So △A′B′C′ ~ △ABC.
:::

::: example Worked Example 4 — Find k from the image
A(2, 1) → A′(6, 3). B(1, 3) → B′(3, 9). Is this a dilation about (0, 0)? Find k.
@viz sddilate pts="2,1;1,3;3,3" k=3 names="A,B,C" image=show rays=1 every=2
Step 1: A: 6 ÷ 2 = [[3]] and 3 ÷ 1 = [[3]].
Step 2: B: 3 ÷ 1 = [[3]] and 9 ÷ 3 = [[3]].
Step 3: Both coordinates have the same multiplier. It is a dilation with k = [[3]].
:::

::: try
1. Dilate D(4, 2) about (0, 0) with k = 3. [[D′(12, 6)]]
2. Dilate E(6, 8) with k = 0.5. [[E′(3, 4)]]
3. Dilate the triangle with k = 3. Write the image coordinates.
@viz sddilate pts="1,0;2,0;1,1" k=3 names="J,K,L" image=key rays=1
[[J′(3, 0), K′(6, 0), L′(3, 3)]]
4. Maya dilates (1, 4) with k = 2 and gets (3, 6). Fix her mistake. [[She added 2. Multiply: (1 × 2, 4 × 2) = (2, 8).]]
5. T(5, 2) → T′(10, 3). Is this a dilation about (0, 0)? [[No. 10 ÷ 5 = 2, but 3 ÷ 2 = 1.5. The multipliers differ.]]
:::
::: retrieval
1. A rectangle's sides are tripled. How many times bigger is its area?
=> 3² = 9 times
2. A map uses 1 cm : 3 km. Two towns are 6 cm apart. Find the real distance.
=> 6 × 3 = 18 km
3. Find k: an 8 m side becomes 2 m.
=> k = 2 ÷ 8 = 0.25
4. Are a 2 by 5 and a 4 by 10 rectangle similar?
=> Yes. Both sides × 2.
5. ★ Stretch: A(3, 3) is dilated about (0, 0). A′ is (1, 1). What is k? Where does B(6, 0) go?
=> k = 1 ÷ 3 = ⅓. B′(2, 0).
:::

## Unit Synthesis
1. A rectangle has corners (0, 0), (2, 0), (2, 1) and (0, 1). It is dilated about (0, 0) with k = 3.
a) Find the image corners. b) Find the area of each rectangle. c) How many times bigger is the area?
@viz sddilate pts="0,0;2,0;2,1;0,1" k=3 image=key rays=1
=> a) (0, 0), (6, 0), (6, 3), (0, 3).
=> b) Original: 2 × 1 = 2 units². Image: 6 × 3 = 18 units².
=> c) 18 ÷ 2 = 9 times. That is k² = 3² = 9.
2. A blueprint uses 1 cm : 2 m. A room is 3.5 cm by 2.5 cm on the drawing. Find the real room size and floor area.
=> 7 m by 5 m. Area: 35 m².
3. Are these triangles similar? Explain.
@viz polygon pts="0,0;4,0;0,2" right="1" sides="4;;2" pts2="0,0;6,0;0,4" right2="1" sides2="6;;4" unit=20
=> No. 6 ÷ 4 = 1.5, but 4 ÷ 2 = 2. The sides are not proportional.
4. Sam says a dilation with k = 2 adds 2 to each coordinate. Write him a short note.
=> Answers vary. A dilation multiplies: (x, y) → (2x, 2y). Adding only slides the shape.
5. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Similar shapes
Same shape, maybe a different size. A similar copy may be turned or flipped.
Corresponding angles are equal. Corresponding sides are proportional.
All circles are similar. All squares are similar. Rectangles are similar when long ÷ short matches.
△ABC ~ △DEF: A ↔ D, B ↔ E, C ↔ F.
:::
@viz polygon pts="0,0;4,0;0,3" names="A,B,C" right="1" sides="4;5;3" arcs="0,1,2" pts2="0,0;8,0;0,6" names2="D,E,F" right2="1" sides2="8;10;6" arcs2="0,1,2" unit=14

::: key Scale factor
k = copy length ÷ original length (same units).
k > 1 enlargement. k = 1 same size. 0 < k < 1 reduction.
Copy = original × k. Original = copy ÷ k.
:::
@viz numberline min=0 max=3 step=0.5 points="0.5:reduction;1:same size;2.5:enlargement"

::: key Area and scale drawings
New area = old area × k². Double the sides → 4 times the area.
Map scale 1 cm : 2 km: real distance = map cm × 2 km.
:::
@viz squares shapes="1x1;2x2;3x3" labels="k = 1: area 1;k = 2: area 4;k = 3: area 9"

::: key Dilations about (0, 0)
(x, y) → (kx, ky). Multiply both coordinates by k.
Lines from (0, 0) join each point to its image. The image is similar to the original.
:::
@viz sddilate pts="1,1;3,1;1,2" k=2 names="A,B,C" image=show rays=1

| Mistake | Fix |
|---|---|
| Similar means the same size | Similar means the same shape. Same size too is congruent. |
| Any two rectangles are similar | Check long ÷ short. It must match. |
| Subtract to find k | Divide: k = copy ÷ original. |
| k = original ÷ copy | Copy goes on top: k = copy ÷ original. |
| Double the sides, double the area | Area grows by k²: double the sides → 4 times the area. |
| Add the map scale | Multiply: 4.5 cm × 2 km = 9 km. |
| Add k to each coordinate | Multiply: (2, 3) × 2 = (4, 6). |
