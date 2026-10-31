---
title: Squares & Cubes
topic: squares-cubes
strand: number
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "5² = 10" (SC1). "√16 = 8" (SC2). "2³ = 6" and "∛27 = 9" (SC3).
     "Area and perimeter are the same thing" (SC4), plus "volume of a cube = edge × 3" (SC4, the 2³ = 6 slip again).
     Section order: perfect squares as square pictures (SC1). Then square roots, because a root undoes the square
     and reads the side off the same picture (SC2). Then cubes and cube roots, the same idea one dimension up (SC3).
     Then problems that use all four: perimeter and area of squares, volume of cubes (SC4).
     Outcomes 7N3.1 (SC1, SC2, SC4) and 7N3.2 (SC3, SC4). Natural numbers only: squares to 144, cubes to 125. -->

## Pre-Knowledge Check
1. Find 7 × 7 and 9 × 9.
2. Find 2 × 2 × 2.
3. A rectangle is 5 cm long and 3 cm wide. Find its area.
4. Find the perimeter of the same rectangle.
5. List all the factor pairs of 12.
6. A box is 3 cubes long, 2 cubes wide and 2 cubes high. How many cubes fill it?

## Section 1: Perfect squares
Learning target: I can show a perfect square as a picture and write it as a power.

### Vocabulary
- perfect square :: a number of tiles that makes a square :: 9 tiles make a 3 by 3 square
- squared :: times itself :: 4 squared = 4 × 4 = 16
- power :: a short way to write the same factor times itself :: 4² is a power
- base :: the number you multiply :: in 4², the base is 4
- exponent :: the small raised number. It tells how many bases to multiply. :: in 4², the exponent is 2

Take some square tiles. Can you make a square with 9 tiles?
Yes. Make 3 rows of 3.
@viz squares shapes="1x1;2x2;3x3;4x4" labels="1 × 1 = 1;2 × 2 = 4;3 × 3 = 9;4 × 4 = 16" caption="Each picture is a square. Count the tiles."
The numbers 1, 4, 9 and 16 are **perfect squares**.
Each one is a whole number times itself.

Some numbers make rectangles but never a square.
@viz squares shapes="2x6;3x4" labels="2 × 6 = 12;3 × 4 = 12" caption="12 tiles. The sides are never equal. 12 is not a perfect square."

#### Writing a power
A square that is 5 tiles on each side has 5 × 5 tiles.
We write 5 × 5 as **5²**. We say "five squared."
@viz sqside n=5 side="5" labels="5 × 5 = 5²;= 25 tiles" caption="The side is 5. The area is 25 tiles."
::: key Squaring a number
To **square** a number, multiply it by itself.
In **5²**, the **base** is 5. The **exponent** is 2.
5² = 5 × 5 = 25
The exponent 2 means "two 5s multiplied." It does not mean "times 2."
:::

::: example Worked Example 1 — A Rubik's cube face
One face of a Rubik's cube is a square of stickers. It is 3 stickers on each side.
@viz sqside n=3 side="3" fill=sun cell=30 labels="3 × 3 = 3²;= 9 stickers"
Step 1: Write it as a product: 3 × 3
Step 2: Write it as a power: 3²
Step 3: Find it: 3 × 3 = 9
One face has 9 stickers. So 9 is a perfect square.
:::
::: explain
Why is the base 3 and the exponent 2 in Worked Example 1?
(lines 2)
=> The side has 3 stickers, so 3 is the number we multiply. We multiply two 3s (rows times columns), so the exponent is 2.
:::
::: misconception
WRONG: "5² = 10. The 2 means times 2."
WHY: The 2 is an exponent. It says how many 5s to multiply.
@viz squares shapes="5x2;5x5" labels="5 × 2 = 10 (not a square);5 × 5 = 25" cell=13
RIGHT: 5² = 5 × 5 = 25. A 5 by 5 square has 25 tiles, not 10.
:::

::: example Worked Example 2 — Hay bales near Red Deer
A farmer has 36 square hay bales. Can she make one square layer with all of them?
Step 1: Look for a number times itself that makes 36.
Step 2: Try 5 × 5 = 25. Too small. Try 6 × 6 = 36. Yes!
@viz squares shapes="6x6" labels="6 × 6 = 6² = [[36]]" cell=16
She can make a 6 by 6 layer. So 36 is a perfect square.
:::
::: example Worked Example 3 — Is 20 a perfect square?
Step 1: Try whole numbers. 4 × 4 = 16. 5 × 5 = 25.
@viz squares shapes="4x4;5x5" labels="4² = 16 (too few);5² = 25 (too many)" cell=14
Step 2: 20 is between 16 and 25. No whole number times itself makes 20.
@viz numberline min=15 max=26 points="16:4²;20:20;25:5²" caption="20 sits between two perfect squares."
So 20 is [[not]] a perfect square.
:::

#### The perfect squares to 144
Learn these by heart. You will use them all year.
| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| n² | 1 | 4 | 9 | 16 | 25 | 36 | 49 | [[64]] | [[81]] | 100 | [[121]] | 144 |
@viz squares shapes="1x1;2x2;3x3;4x4;5x5;6x6" labels="1;4;9;16;25;36" cell=11
@viz squares shapes="7x7;8x8;9x9" labels="49;[[64]];[[81]]" cell=9
@viz squares shapes="10x10;11x11;12x12" labels="100;[[121]];144" cell=8 caption="Each square gets one row and one column bigger."

::: try
1. Write as a power. Then find the value.
a) 7 × 7 = [[7²]] = [[49]]
b) 11 × 11 = [[11²]] = [[121]]
2. Name the base and the exponent in 8².
Base: [[8]] Exponent: [[2]]
3. Find 9², 10² and 12².
[[81, 100, 144]]
4. Is 30 a perfect square? Use the pictures to explain.
@viz squares shapes="5x5;6x6" labels="5² = 25;6² = 36" cell=12
[[No. 5² = 25 and 6² = 36. 30 is between them, so no whole number squared makes 30.]]
:::
::: retrieval
1. Find (−4)(−4).
=> 16. Two negatives make a positive product.
2. Find 7 × 7 and 7 + 7. Which one is 7²?
=> 49 and 14. 7² = 7 × 7 = 49.
3. Which of these are perfect squares: 9, 18, 49, 50, 100?
=> 9, 49 and 100.
4. Mia says 6² = 12. Fix her mistake.
=> 6² = 6 × 6 = 36. The 2 means two 6s multiplied, not 6 × 2.
5. ★ Stretch: Find two perfect squares that add to 25.
=> 9 + 16 = 25 (3² + 4²). Also 0 + 25, if you use 0².
:::

## Section 2: Square roots
Learning target: I can find a square root as the side of a square.

### Vocabulary
- square root :: the side of a square with that area. It times itself gives the number. :: the square root of 49 is 7
- √ :: the square root sign :: √49 = 7, because 7 × 7 = 49

A square has an area of 49 tiles. How long is one side?
@viz sqside n=7 side="?" labels="Area = 49 tiles;Side = ?" cell=16
Ask: what number times itself makes 49?
7 × 7 = 49. So the side is 7.
The side is the **square root** of 49. We write **√49 = 7**.

#### Square and square root undo each other
@viz flow steps="Side: 6|Square it: 6 × 6|Area: 36|Square root: √36|Side: 6"
Squaring goes from the side to the area.
The square root goes back from the area to the side.
::: key Square root
√ asks: **what number times itself makes this?**
√36 = 6, because 6 × 6 = 36.
Check a root by squaring it.
:::

::: example Worked Example 1 — 64 hay bales
A farmer has 64 bales. She makes one square layer. How many bales long is each side?
@viz sqside n=8 side="[[8]]" labels="64 bales" cell=14 fill=sun
Step 1: Write it: √64
Step 2: Ask: what times itself makes 64? Try 8 × 8 = [[64]].
Step 3: So √64 = [[8]]. Each side is [[8]] bales long.
:::
::: misconception
WRONG: "√16 = 8, because 8 is half of 16."
WHY: The square root is not half. It is the side of the square.
@viz squares shapes="4x4;8x2" labels="4 × 4 = 16 ✓ a square;8 × 2 = 16 ✗ not a square" cell=14
RIGHT: √16 = 4, because 4 × 4 = 16. Check: 8 × 8 = 64, not 16.
:::
::: example Worked Example 2 — Use factor pairs: √36
Step 1: List the factor pairs of 36: 1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6.
Step 2: Find the pair with two equal factors: [[6 × 6]].
@viz squares shapes="4x9;6x6" labels="4 × 9 (not equal);6 × 6 (equal!)" cell=12
Step 3: So √36 = [[6]].
:::
::: explain
Why do we look for a factor pair with two equal factors?
(lines 2)
=> Equal factors make equal sides. Equal sides make a square. That factor is the side, so it is the square root.
:::

#### The square roots to √144
| Perfect square | 1 | 4 | 9 | 16 | 25 | 36 | 49 | 64 | 81 | 100 | 121 | 144 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Square root | 1 | 2 | 3 | [[4]] | [[5]] | 6 | 7 | [[8]] | [[9]] | [[10]] | [[11]] | [[12]] |
@viz numberline min=0 max=13 points="1:√1;2:√4;3:√9;4:√16;5:√25;6:√36" caption="√1 to √36 on a number line. Each one is a whole number."

::: example Worked Example 3 — Square, then root
Find √(9²).
Step 1: Square first: 9² = 9 × 9 = [[81]].
Step 2: Take the root: √81 = [[9]].
@viz sqside n=9 side="9" labels="9² = [[81]];√81 = [[9]]" cell=11
So √(9²) = [[9]]. The root undoes the square.
:::
::: try
1. Find each square root. Check by squaring.
a) √25 = [[5]] Check: [[5 × 5 = 25]]
b) √100 = [[10]] Check: [[10 × 10 = 100]]
c) √121 = [[11]] Check: [[11 × 11 = 121]]
2. A square has an area of 81 tiles. How long is one side?
@viz sqside n=9 side="?" labels="Area = 81 tiles" cell=10
[[√81 = 9 tiles]]
3. Leo says √4 = 2 and √36 = 18. Which one is wrong? Fix it.
[[√36 = 18 is wrong. 18 × 18 = 324. √36 = 6, because 6 × 6 = 36.]]
4. Find √(12²). [[12. 12² = 144 and √144 = 12.]]
:::
::: retrieval
1. Find 8².
=> 64
2. Name the base and the exponent in 3².
=> Base 3, exponent 2.
3. Find √49 + √9.
=> 7 + 3 = 10
4. Find −6 + √81.
=> −6 + 9 = 3
5. ★ Stretch: Find a perfect square between 50 and 70. What is its square root?
=> 64. √64 = 8.
:::

## Section 3: Perfect cubes and cube roots
Learning target: I can build a perfect cube and find a cube root.

### Vocabulary
- perfect cube :: a number of small cubes that makes one big cube :: 8 small cubes make a 2 by 2 by 2 cube
- cubed :: three of the same number multiplied :: 2 cubed = 2 × 2 × 2 = 8
- edge :: a line where two faces of a cube meet :: a cube has 12 edges, all the same length
- cube root :: the edge of a cube with that many small cubes :: the cube root of 8 is 2
- ∛ :: the cube root sign :: ∛8 = 2, because 2 × 2 × 2 = 8

A square is flat. A cube has length, width and height. All three are the same.
Stack small cubes to make bigger cubes.
@viz cube n=1 label="1 × 1 × 1 = 1"
@viz cube n=2 label="2 × 2 × 2 = 8"
@viz cube n=3 label="3 × 3 × 3 = 27"
The numbers 1, 8 and 27 are **perfect cubes**.

#### Build a cube in layers
Look at one layer of the cube. It is a square: 3 × 3 = 9.
Stack 3 of those layers: 9 × 3 = 27.
@viz layers l=3 w=3 h=3 llabel="one layer: 3 × 3 = 9" blabel="3 layers: 9 × 3 = 27"
::: key Cubing a number
To **cube** a number, multiply three of it together.
**3³** = 3 × 3 × 3 = 27. We say "three cubed."
The base is 3. The exponent is 3.
:::

::: example Worked Example 1 — A whole Rubik's cube
A Rubik's cube looks like it is made of small cubes. Each edge has 3 small cubes.
@viz cube n=3 label="3³ = 3 × 3 × 3 = [[27]]"
Step 1: Write it as a power: 3³
Step 2: Multiply two at a time: 3 × 3 = 9. Then 9 × 3 = [[27]].
It looks like [[27]] small cubes.
A face has 3² = 9 stickers. The whole cube is 3³ = 27 small cubes.
:::
::: misconception
WRONG: "2³ = 6. The 3 means times 3."
WHY: The exponent 3 means three 2s multiplied. 2 × 3 is a flat row.
@viz squares shapes="3x2" labels="2 × 3 = 6: flat, not a cube" cell=22
@viz cube n=2 label="2 × 2 × 2 = 8"
RIGHT: 2³ = 2 × 2 × 2 = 8.
:::

::: example Worked Example 2 — Ice on Whyte in Edmonton
At the Ice on Whyte festival, carvers stack ice blocks. They build a big cube with 4 blocks on each edge.
How many blocks do they use?
@viz layers l=4 w=4 h=4 llabel="one layer: 4 × 4 = [[16]]" blabel="4 layers"
Step 1: Write it: 4³ = 4 × 4 × 4
Step 2: One layer: 4 × 4 = [[16]]. Four layers: 16 × 4 = [[64]].
They use [[64]] blocks.
:::
::: explain
In Worked Example 2, why do we multiply the layer by 4?
(lines 2)
=> The cube is 4 blocks high, so there are 4 layers. Each layer has 16 blocks.
:::

#### Cube roots
A cube is made of 125 small cubes. How many are on each edge?
Ask: what number, times itself three times, makes 125?
5 × 5 × 5 = 125. So the edge is 5.
We write **∛125 = 5**.
@viz cube n=5 label="∛125 = 5: five on each edge"
::: key Cube root
∛ asks: **what number, used three times, multiplies to this?**
∛27 = 3, because 3 × 3 × 3 = 27.
Check a cube root by cubing it.
:::
::: misconception
WRONG: "∛27 = 9, because 27 ÷ 3 = 9."
WHY: The cube root is not a third. It is the edge. 9 is one layer.
@viz layers l=3 w=3 h=3 llabel="9 is one layer" blabel="the edge is 3"
RIGHT: ∛27 = 3, because 3 × 3 × 3 = 27. Check: 9 × 9 × 9 = 729, not 27.
:::

#### The perfect cubes to 125
| n | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| n³ | 1 | 8 | [[27]] | [[64]] | [[125]] |
| ∛ | ∛1 = 1 | ∛8 = 2 | ∛27 = [[3]] | ∛64 = [[4]] | ∛125 = [[5]] |

| Squared (flat) | Cubed (solid) |
|---|---|
| 4² = 4 × 4 = 16 | 4³ = 4 × 4 × 4 = [[64]] |
| √16 = 4 | ∛64 = [[4]] |
@viz cube n=4 label="4³ = [[64]]"

::: try
1. Write as a power. Then find the value.
a) 5 × 5 × 5 = [[5³]] = [[125]]
b) 2 × 2 × 2 = [[2³]] = [[8]]
2. Find each cube root. Check by cubing.
a) ∛8 = [[2]] Check: [[2 × 2 × 2 = 8]]
b) ∛64 = [[4]] Check: [[4 × 4 × 4 = 64]]
3. How many small cubes? Write it as a power.
@viz cube n=2
[[2³ = 8 small cubes]]
4. Zoe says 3³ = 9. Fix her mistake.
[[3³ = 3 × 3 × 3 = 27. Zoe found only one layer: 3 × 3 = 9.]]
:::
::: retrieval
1. Find 6² and √144.
=> 36 and 12
2. Find 1³, 1² and √1.
=> 1, 1 and 1. One times itself is always 1.
3. Which is bigger, 3² or 2³?
=> 3² = 9 and 2³ = 8. So 3² is bigger.
4. Find (−2)(−2)(−2).
=> −8. Three negatives is odd, so negative.
5. ★ Stretch: 64 is a perfect square and a perfect cube. Show both.
=> 8² = 64 (an 8 by 8 square) and 4³ = 64 (a 4 by 4 by 4 cube).
:::

## Section 4: Area, perimeter and volume problems
Learning target: I can find the perimeter and area of a square and the volume of a cube.

### Vocabulary
- perimeter :: the distance around a shape. It is a length. :: a fence around a garden, in m
- area :: the space inside a flat shape. Count the squares. :: the grass inside the fence, in m²
- volume :: the space inside a solid. Count the cubes. :: the ice in a block, in m³
- square unit :: a square that is 1 unit on each side :: 1 cm², 1 m²
- cubic unit :: a cube that is 1 unit on each edge :: 1 cm³, 1 m³

#### Fence or grass?
A square garden is 6 m on each side.
The **fence** goes around the edge. That is the **perimeter**.
The **grass** fills the inside. That is the **area**.
@viz sqside n=6 side="6 m" fence=1 fill=plant labels="Fence (perimeter): 4 × 6 = 24 m;Grass (area): 6 × 6 = 36 m²" cell=20
::: key Squares and cubes
For a square with side s:
**Perimeter** = 4 × s (a length, like m)
**Area** = s × s = s² (square units, like m²)
For a cube with edge e:
**Volume** = e × e × e = e³ (cubic units, like m³)
:::
@viz flow steps="Perimeter: m (a length)|Area: m² (squares)|Volume: m³ (cubes)"

::: misconception
WRONG: "Area and perimeter are the same thing."
WHY: Perimeter is the fence. Area is the grass inside.
@viz sqside n=4 side="4 cm" fence=1 labels="Perimeter = 16 cm;Area = 16 cm²" cell=22
RIGHT: Here both numbers are 16. But one is 16 cm of edge. The other is 16 squares inside. Try a 5 cm square: P = 20 cm, A = 25 cm².
:::

::: example Worked Example 1 — A community garden plot
A square garden plot in Lethbridge has an area of 49 m². How much fence goes around it?
@viz sqside n=7 side="[[7 m]]" fence=1 fill=plant labels="Area = 49 m²;Fence = [[28 m]]" cell=18
Step 1: Find the side. Side = √49 = [[7]] m.
Step 2: Find the perimeter. 4 × [[7]] = [[28]] m.
Step 3: Check the units. A fence is a length, so m. ✓
It needs [[28 m]] of fence.
:::
::: explain
In Worked Example 1, why did we take the square root first?
(lines 2)
=> We knew the area, but the fence needs the side length. The square root of the area gives the side.
:::
::: example Worked Example 2 — A square pen
Raj puts 32 m of fence around a square goat pen. What is the area inside?
@viz sqside n=8 side="[[8 m]]" fence=1 fill=sun labels="Fence = 32 m;Area = [[64 m²]]" cell=15
Step 1: Find the side. 4 sides share 32 m: 32 ÷ 4 = [[8]] m.
Step 2: Find the area. [[8 × 8 = 64]]
Step 3: Units: area counts squares, so [[m²]].
The area is [[64 m²]].
:::

::: example Worked Example 3 — An ice block
A cube-shaped ice block at Ice on Whyte has edges of 2 m. Find its volume.
@viz prism l="2 m" w="2 m" h="2 m" lv=2 wv=2 hv=2
Step 1: Volume of a cube = e³.
Step 2: [[2³ = 2 × 2 × 2 = 8]]
Step 3: Units: volume counts cubes, so [[m³]].
The volume is [[8 m³]].
:::
::: misconception
WRONG: "The volume of a cube with 4 cm edges is 4 × 3 = 12 cm³."
WHY: That is the same slip as 2³ = 6. Volume is edge × edge × edge.
@viz cube n=4 label="4 × 4 × 4 = 64 cubes, not 12"
RIGHT: V = 4³ = 4 × 4 × 4 = 64 cm³.
:::
::: example Worked Example 4 — From volume to edge
A cube-shaped gift box holds 125 cm³. How long is each edge?
@viz cube n=5 label="V = 125 cm³, edge = [[5 cm]]"
Step 1: Edge = ∛125.
Step 2: Ask: what, used three times, makes 125? [[5 × 5 × 5 = 125]]
Step 3: Each edge is [[5 cm]].
:::

#### A plan for any problem
@viz flow steps="Draw it|What is asked: fence, inside or solid?|Square, root, cube or cube root?|Solve|Check the units"

::: try
1. A square sandbox has sides of 3 m. Find its perimeter and its area.
@viz sqside n=3 side="3 m" fence=1 fill=sun labels="Perimeter = [[12 m]];Area = [[9 m²]]" cell=24
2. A square rug has an area of 100 m². How long is one side? [[√100 = 10 m]]
3. A square field has a fence of 44 m. Find the side and the area.
[[44 ÷ 4 = 11 m. Area = 11² = 121 m².]]
4. A cube has edges of 3 cm. Find its volume. [[3³ = 27 cm³]]
5. A cube holds 64 cm³. How long is each edge? [[∛64 = 4 cm]]
6. Sam says, "A 5 m square has a perimeter of 25 m." Is he right?
[[No. 25 is the area (5 × 5 = 25 m²). Perimeter = 4 × 5 = 20 m.]]
:::
::: retrieval
1. Find 11² and √121.
=> 121 and 11
2. Find 5³ and ∛8.
=> 125 and 2
3. Which unit goes with area: m, m² or m³?
=> m². Area counts squares.
4. Find −12 ÷ (−3). Then square the answer.
=> −12 ÷ (−3) = 4. Then 4² = 16.
5. ★ Stretch: Two squares. One has a side of 2 m. The other has a side of 4 m. The side doubled. Did the area double?
=> No. 2² = 4 m² and 4² = 16 m². The area is 4 times as big.
:::

## Unit Synthesis
1. Use the number 4. Find 4², √16, 4³ and ∛64.
=> 16, 4, 64, 4.
2. A Rubik's cube is 3 small cubes on each edge. How many stickers are on one face? How many small cubes does it look like?
@viz cube n=3
=> One face: 3² = 9 stickers. The whole cube: 3³ = 27 small cubes.
3. A square garden has an area of 36 m².
a) How long is one side?
b) How much fence goes around it?
@viz sqside n=6 side="?" fence=1 fill=plant labels="Area = 36 m²" cell=16
=> a) √36 = 6 m.
=> b) 4 × 6 = 24 m of fence.
4. Explain the difference between 3², 3 × 2 and 3³. Use a picture.
=> 3² = 9 (a 3 by 3 square). 3 × 2 = 6 (two rows of 3). 3³ = 27 (a 3 by 3 by 3 cube).
5. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Perfect squares and square roots
A **perfect square** is a whole number times itself. It makes a square picture.
5² = 5 × 5 = 25. Base 5, exponent 2. Not 5 × 2!
√ asks: what times itself makes this? √25 = 5. The root is the side.
:::
@viz sqside n=5 side="5" labels="5² = 25 (area);√25 = 5 (side)" cell=18
| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| n² | 1 | 4 | 9 | 16 | 25 | 36 | 49 | 64 | 81 | 100 | 121 | 144 |

::: key Perfect cubes and cube roots
A **perfect cube** is three of the same whole number multiplied. It makes a cube.
2³ = 2 × 2 × 2 = 8. Not 2 × 3!
∛ asks: what, used three times, makes this? ∛27 = 3. The root is the edge.
:::
@viz cube n=3 label="3³ = 27, ∛27 = 3"
| n | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| n³ | 1 | 8 | 27 | 64 | 125 |

::: key Problems
Square with side s: perimeter = 4 × s (m). Area = s² (m²).
Cube with edge e: volume = e³ (m³).
Know the area? The side is √area. Know the volume? The edge is ∛volume.
:::
@viz sqside n=6 side="6 m" fence=1 fill=plant labels="Fence: 4 × 6 = 24 m;Grass: 6² = 36 m²" cell=16

| Mistake | Fix |
|---|---|
| 5² = 10 | 5² = 5 × 5 = 25. Draw the 5 by 5 square. |
| √16 = 8 | √16 = 4, because 4 × 4 = 16. The root is the side, not half. |
| 2³ = 6 | 2³ = 2 × 2 × 2 = 8. |
| ∛27 = 9 | ∛27 = 3, because 3 × 3 × 3 = 27. 9 is one layer. |
| Area and perimeter are the same | Perimeter is the fence (m). Area is the grass inside (m²). |
