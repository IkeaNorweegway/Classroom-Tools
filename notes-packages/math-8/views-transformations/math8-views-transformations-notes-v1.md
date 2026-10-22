---
title: 3-D Views and Transformations
topic: views-transformations
strand: measurement-geometry
---
<!-- Gate: progressive blanking confirmed. Refutation-first on: "the side view shows the hidden cubes" (VT1),
     "a reflected or rotated shape is not congruent" (VT4).
     Section order: views of an object (VT1) → building from views and turning the object (VT2) → moving shapes on a grid (VT3) → congruence and combined moves (VT4).
     Codes VT1–VT4. Outcomes SS5, SS6. Rotations: quarter turns about the origin; the notes say which way. -->

## Pre-Knowledge Check
1. Look at your desk from above. Draw what you see.
2. Slide, flip, turn: which one makes a mirror image?
3. What are the coordinates of a point 3 right and 2 up from (0, 0)?

## Section 1: Top, front and side views
Learning target: I can draw the top, front and side views of an object made of cubes.

### Vocabulary
- view :: what an object looks like from one direction :: the view from the front
- top view :: looking straight down from above :: like a map
- front view :: looking straight at the front :: what you see from the "front" arrow
- side view :: looking straight at the right side :: we use the right side
- isometric drawing :: a 3-D drawing on dot paper; corners show three faces :: the cube drawings in these notes

@viz blocks heights="1,1,1;2,1,0" views=show caption="An object made of 6 cubes, and its three views."

Each view is **flat**. It shows only the outline you see from that direction. Count the squares in each view: Top [[5]], Front [[3 columns: 2, 1, 1]], Right side [[2 columns]].

::: misconception
WRONG: "The side view shows all the cubes, even the ones hidden in the back."
WHY: A view is what you see from one place. Cubes behind other cubes are hidden in that view.
RIGHT: A view shows the outline only: how tall each column looks from that direction, not how many cubes are behind it.
:::

::: example Worked Example 1 — Draw the views
@viz blocks heights="2,1;1,0" views=key
Top: count the columns that have at least one cube. [[3 squares]]
Front: the tallest stack in each column from left to right. [[2, 1]]
Right side: the tallest stack in each row, front to back. [[1, 2]]
:::

::: explain
In the front view, why do we use the tallest stack in each column?
(lines 2)
=> From the front, a tall stack hides the shorter stacks behind it. You only see the tallest one in each column.
:::

::: try
Draw the top, front and right side views on the grids.
@viz blocks heights="3,1,1;1,1,0" views=key
:::

::: retrieval
1. What does a top view show?
=> What the object looks like from directly above: which spots have at least one cube.
2. An object is one stack of 4 cubes. Draw its front view.
(work 2)
=> One column, 4 squares tall.
3. Jo's side view shows 5 squares in a column for a stack that is 3 tall with 2 cubes behind it. What did Jo do wrong?
=> She counted hidden cubes. The side view shows the outline only: 3 tall.
4. Two different objects can have the same front view. Is that true? Give an example.
=> True. A single row of 3 cubes and an L made of 4 cubes (one behind) both look like 3 squares from the front.
5. ★ Stretch: How many views do you need to be sure what an object looks like? Why?
=> Usually at least three (top, front, side), because one view hides the depth.
:::

## Section 2: Building from views and turning objects
Learning target: I can build an object from its views, and draw the views after a quarter turn.

### Vocabulary
- rotate :: turn :: a quarter turn is 90°
- quarter turn :: 90° :: one corner of a square
- clockwise / counterclockwise :: the way clock hands turn / the other way :: ↻ / ↺

#### Build from views
Use the top view as a floor plan. Then use the front and side views to decide how tall each stack is.

::: example Worked Example 2 — Build from views
Top view: an L of 3 squares. Front view: columns 2, 1. Side view: columns 1, 2.
Step 1: Put one cube on each square of the top view.
Step 2: The front view says the left column is [[2]] tall.
Step 3: The side view says the back row is [[2]] tall. So the back-left stack has 2 cubes.
@viz blocks heights="2,1;1,0" views=show
:::

::: explain
Why do you need both the front and the side view to decide which stack is tall?
(lines 2)
=> The front view tells which column is tall, and the side view tells which row. Together they show the exact stack.
:::

#### Turn the object
Turn this object a quarter turn **clockwise** (looking down from the top). The old right end swings around to become the new front.

::: example Worked Example 3 — A quarter turn
Before:
@viz blocks heights="2,1,1" views=show
After a quarter turn clockwise:
@viz blocks heights="2;1;1" views=key
The new front view is [[one column, 2 squares tall]]. The new side view is [[3 columns: 1, 1, 2]].
:::

::: try
An object has front view 3, 1 and side view 3 (one row). Draw its views after a half turn (180°).
(work 3)
=> After 180° the front view is reversed: 1, 3. The side view is still one column 3 tall. The top view is reversed left to right.
:::

::: retrieval
1. Which view is like a floor plan?
=> The top view.
2. A row of cubes: heights 1, 2, 3 from left to right (front view). What is the front view after a half turn?
=> 3, 2, 1
3. Can you build an object from its top view only? Why or why not?
=> No. The top view does not show how tall each stack is.
4. After a quarter turn, which old view becomes the new front?
=> One of the side views. For a clockwise turn seen from above, the old right side becomes the new front.
5. ★ Stretch: Find the fewest cubes that fit a top view of 4 squares in a row, a front view of 1, 3, 1, 2, and a side view of one column 3 tall.
=> 1 + 3 + 1 + 2 = 7 cubes (one row, no hidden cubes).
:::

## Section 3: Transformations on a grid
Learning target: I can translate, reflect and rotate a shape on a coordinate grid, and give the new coordinates.

### Vocabulary
- transformation :: a move of a shape :: slide, flip, turn
- translation (slide) :: every point moves the same distance and direction :: 4 left, 2 up
- reflection (flip) :: a mirror image over a line :: reflect in the x-axis
- rotation (turn) :: a turn about a point :: 90° counterclockwise about (0, 0)
- image :: the shape after the move; its points get a ′ (prime) :: A → A′

#### Translation
@viz transform shape="1,1;4,1;1,3" move="translate -5,2" names="A,B,C" caption="Triangle ABC slides 5 left and 2 up."
A(1, 1) → A′(−4, 3). Every x goes down by [[5]]. Every y goes up by [[2]].
B(4, 1) → B′([[−1]], [[3]])  C(1, 3) → C′([[−4]], [[5]])

#### Reflection in the x-axis
@viz transform shape="1,1;4,1;1,3" move="reflect x" names="A,B,C" mirror=x caption="The x-axis is the mirror."
A(1, 1) → A′(1, −1). The x stays the same. The y becomes its [[opposite]].
C(1, 3) → C′([[1]], [[−3]])

#### Rotation: 90° counterclockwise about (0, 0)
@viz transform shape="1,1;4,1;1,3" move="rotate 90" names="A,B,C" caption="A quarter turn counterclockwise about the origin."
A(1, 1) → A′(−1, 1)  B(4, 1) → B′(−1, 4)  C(1, 3) → C′([[−3]], [[1]])
Rule: (x, y) → ([[−y]], [[x]])

::: key Coordinate rules
Translate (a right, b up): (x, y) → (x + a, y + b)
Reflect in the x-axis: (x, y) → (x, −y) · Reflect in the y-axis: (x, y) → (−x, y)
Rotate 90° counterclockwise: (x, y) → (−y, x) · Rotate 180°: (x, y) → (−x, −y)
:::

::: explain
Check the 90° rule with point B(4, 1). Does the picture agree?
(lines 2)
=> (−y, x) = (−1, 4). In the picture B′ is at (−1, 4). ✓
:::

::: try
Triangle P(2, 1), Q(5, 1), R(2, 4).
a) Translate 3 down: P′[[(2, −2)]] Q′[[(5, −2)]] R′[[(2, 1)]]
b) Reflect in the y-axis: P′[[(−2, 1)]] Q′[[(−5, 1)]] R′[[(−2, 4)]]
c) Rotate 180° about (0, 0): P′[[(−2, −1)]] Q′[[(−5, −1)]] R′[[(−2, −4)]]
@viz transform shape="2,1;5,1;2,4" move="rotate 180" names="P,Q,R" image=key
:::

::: retrieval
1. A(3, 2) is translated 4 left and 1 up. Where is A′?
=> (−1, 3)
2. B(−2, 5) is reflected in the x-axis. Where is B′?
=> (−2, −5)
3. C(4, 0) is rotated 180° about the origin. Where is C′?
=> (−4, 0)
4. What stays the same in a reflection in the y-axis? What changes?
=> The y-coordinate stays the same. The x-coordinate becomes its opposite.
5. ★ Stretch: D(2, 3) is rotated 90° counterclockwise and then 90° counterclockwise again. Where does it end up? What single move does the same thing?
=> (2, 3) → (−3, 2) → (−2, −3). Same as a 180° rotation.
:::

## Section 4: Congruence and combined moves
Learning target: I can do two transformations in a row, find the original from the image, and explain why the image is congruent.

### Vocabulary
- congruent :: the same size and the same shape :: ≅
- combined transformation :: two or more moves in a row :: reflect, then translate

::: misconception
WRONG: "A flipped or turned shape is a different shape, so it is not congruent."
WHY: Slides, flips and turns never stretch or shrink a shape. Every side and angle stays the same.
RIGHT: The image of a translation, reflection or rotation is always congruent to the original.
:::

::: example Worked Example 4 — Two moves
Triangle A(1, 1), B(4, 1), C(1, 3). Reflect in the y-axis, then translate 2 down.
Reflect: A(−1, 1), B(−4, 1), C(−1, 3)
Translate 2 down: A′(−1, [[−1]]), B′(−4, [[−1]]), C′(−1, [[1]])
@viz transform shape="1,1;4,1;1,3" move="reflect y then translate 0,-2" names="A,B,C"
Side AB is 3 units long before. A′B′ is [[3]] units long after. The triangles are [[congruent]].
:::

::: explain
How can you check that the two triangles are congruent?
(lines 2)
=> Compare matching sides (and angles). AB = A′B′ = 3, AC = A′C′ = 2, and both have a right angle at A.
:::

::: example Worked Example 5 — Work backwards
After a translation 3 right and 1 up, the image is P′(2, 4). Where was P?
Undo the move: 3 left and 1 down.
P = (2 − 3, 4 − 1) = ([[−1]], [[3]])
:::

::: explain
Why do we do the opposite move to find the original?
(lines 2)
=> The original moved to the image. Going back the other way undoes the move.
:::

::: try
a) Triangle D(1, 2), E(3, 2), F(3, 5). Translate 4 left, then reflect in the x-axis. Give D′, E′, F′.
(work 2)
=> After translate: (−3, 2), (−1, 2), (−1, 5). After reflect: D′(−3, −2), E′(−1, −2), F′(−1, −5).
b) An image point is Q′(−5, 2) after a reflection in the y-axis. Where was Q?
=> (5, 2)
:::

::: retrieval
1. What does congruent mean?
=> Same size and same shape.
2. Are the images of translations, reflections and rotations always congruent? Why?
=> Yes. They move the shape without changing any lengths or angles.
3. A(2, −1): rotate 180°, then translate 1 right. Where is A′?
=> (−2, 1) then (−1, 1).
4. After a reflection in the x-axis, B′ is (4, −6). Where was B?
=> (4, 6)
5. ★ Stretch: A shape is reflected in the x-axis and then in the y-axis. Which single transformation does the same thing?
=> A rotation of 180° about the origin: (x, y) → (x, −y) → (−x, −y).
:::

## Unit Synthesis
1. Draw an object of 5 cubes and its top, front and side views.
(work 4)
=> Answers vary.
2. Describe a translation, a reflection and a rotation in your own words. Give the coordinate rule for each.
=> Slide: add to x and y. Flip in x-axis: (x, −y). Turn 180°: (−x, −y). (Other correct rules accepted.)
3. Explain why the image of a slide, flip or turn is congruent to the original.
=> Nothing gets stretched or shrunk: side lengths and angles stay the same.
4. Look back at your first page. What would you change now?
=> Answers vary.

## Concept Reference
::: key Views
Top = floor plan. Front = tallest stack in each column. Right side = tallest stack in each row (front on the left). Views show outlines, not hidden cubes.
:::
@viz blocks heights="1,1,1;2,1,0" views=show

::: key Transformations
Translation (slide): (x, y) → (x + a, y + b)
Reflection in x-axis: (x, −y) · in y-axis: (−x, y)
Rotation 90° counterclockwise: (−y, x) · 180°: (−x, −y) · 90° clockwise: (y, −x)
To find the original, undo the moves in reverse order.
:::
@viz transform shape="1,1;4,1;1,3" move="translate -5,2" names="A,B,C"

::: key Congruent
Same size and shape. Slides, flips and turns always make congruent images.
:::

| Mistake | Fix |
|---|---|
| Side view shows hidden cubes | Outline only: the tallest stack in each row |
| Reflect in x-axis changes x | x stays; y changes sign |
| Flipped shape is "not congruent" | Same sides and angles: congruent |
