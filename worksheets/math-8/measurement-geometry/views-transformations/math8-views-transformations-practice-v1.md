---
title: 3-D Views and Transformations
topic: views-transformations
strand: measurement-geometry
---
## Core

### Draw the top, front and right side views.
@viz blocks heights="2,2;1,0" views=key

### Draw the top, front and right side views.
@viz blocks heights="1,3,1;1,1,0" views=key

### This object is turned a half turn (180°). Draw its new front view.
@viz blocks heights="3,2,1" views=none
(work 2)
=> The front view is reversed: columns 1, 2, 3 from left to right.

### Give the coordinates of the image after each move. Start with A(2, 1), B(5, 1), C(2, 3).
@viz transform shape="2,1;5,1;2,3" move="translate 0,0" names="A,B,C" image=none
a) Translate 6 left and 1 down: [[A′(−4, 0), B′(−1, 0), C′(−4, 2)]]
b) Reflect in the x-axis: [[A′(2, −1), B′(5, −1), C′(2, −3)]]
c) Rotate 180° about (0, 0): [[A′(−2, −1), B′(−5, −1), C′(−2, −3)]]

### Draw the image of the triangle after a reflection in the y-axis. Label it P′Q′R′.
@viz transform shape="1,2;4,2;4,5" move="reflect y" names="P,Q,R" image=key mirror=y
(lines 1)
=> P′(−1, 2), Q′(−4, 2), R′(−4, 5)

### Use the rule (x, y) → (−y, x) to rotate each point 90° counterclockwise.
a) (3, 1) → [[(−1, 3)]]
b) (−2, 4) → [[(−4, −2)]]
c) (0, −5) → [[(5, 0)]]

## Challenge

### Ali drew the side view of this object as one column 5 squares tall. Explain his mistake. Draw the correct side view.
@viz blocks heights="2;3" views=none
(work 3)
=> He added the hidden cubes (2 + 3). From the side you see the outline only: two columns, heights 3 (front) and 2 (back).

### Build an object (or draw it on dot paper) that matches these views. Use as few cubes as you can.
@viz blocks heights="1,2;0,1" views=show object=key
(work 4)
=> Back row: 1 then 2; front row: empty then 1. 4 cubes. (The picture shows one answer; the views are what students work from.)

### A shape is reflected in the x-axis, then translated 3 right. The image point is D′(1, −4). Where was D? Show how you worked backwards.
(work 3)
=> Undo the translation: (1 − 3, −4) = (−2, −4). Undo the reflection: (−2, 4). D was (−2, 4).

### Mo says, "When I rotate a triangle, it becomes a different triangle, so it is not congruent." Is Mo right? Use side lengths to explain.
(work 3)
=> No. A rotation turns the triangle without stretching it. Every side keeps its length and every angle stays the same, so the image is congruent.

### Find one single move that does the same as "reflect in the y-axis, then reflect in the x-axis." Test it on (3, 2).
(work 3)
=> (3, 2) → (−3, 2) → (−3, −2). A 180° rotation about the origin does the same: (x, y) → (−x, −y).
