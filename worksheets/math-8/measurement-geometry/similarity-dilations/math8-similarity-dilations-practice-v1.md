---
title: Similarity & Dilations
topic: similarity-dilations
strand: measurement-geometry
---
## Core

### Are these rectangles similar? Show how you know.
@viz polygon pts="0,0;4,0;4,3;0,3" sides="4 cm;3 cm;;" pts2="0,0;8,0;8,6;0,6" sides2="8 cm;6 cm;;" unit=18
(lines 2)
=> Long sides: 8 ÷ 4 = 2. Short sides: 6 ÷ 3 = 2. (SD1)
=> Same multiplier, and all the angles are 90°. So they are similar.

### Jo says these triangles are not similar because one is bigger. Is she right?
@viz polygon pts="0,0;3,0;1.5,2" angles="53°;53°;74°" pts2="0,0;6,0;3,4" angles2="53°;53°;74°" unit=22
(lines 2)
=> No. The angles match, and every side is doubled. Similar shapes can be different sizes. (SD1)
=> Targets the "similar means the same size" mix-up.

### Which pairs are ALWAYS similar? Two circles. Two rectangles. Two squares. Two triangles.
(lines 2)
=> Two circles and two squares. (SD1)
=> Two rectangles or two triangles can have different shapes, like a long thin rectangle and a square-ish one.

### Find the scale factor. Is the copy an enlargement or a reduction?
@viz polygon pts="0,0;5,0;5,2;0,2" sides="5 cm;2 cm;;" cap="Original" pts2="0,0;15,0;15,6;0,6" sides2="15 cm;6 cm;;" cap2="Copy" unit=10
(lines 2)
=> k = copy ÷ original = 15 ÷ 5 = 3. Check: 6 ÷ 2 = 3. (SD2)
=> k > 1, so it is an enlargement.

### A 12 cm side is copied as 3 cm. Find k. Is it an enlargement or a reduction?
(lines 2)
=> k = 3 ÷ 12 = 0.25. (SD2)
=> k is between 0 and 1, so it is a reduction.

### △DEF ~ △ABC with k = 1.5. Find DE and BC.
@viz polygon pts="0,0;4,0;1,5.2" names="A,B,C" sides="4 cm;BC = ?;" arcs="1,2,3" pts2="0,0;6,0;1.5,7.8" names2="D,E,F" sides2="DE = ?;9 cm;" arcs2="1,2,3" unit=14
(lines 3)
=> DE matches AB: DE = 4 × 1.5 = 6 cm. (SD2)
=> EF matches BC: BC = 9 ÷ 1.5 = 6 cm.

### Are these rectangles similar? Use the scale factor.
@viz polygon pts="0,0;6,0;6,4;0,4" sides="6 m;4 m;;" pts2="0,0;9,0;9,5;0,5" sides2="9 m;5 m;;" unit=14
(lines 2)
=> Long sides: 9 ÷ 6 = 1.5. Short sides: 5 ÷ 4 = 1.25. (SD2)
=> The two values differ, so they are not similar.

### Ben says the big square has twice the area of the small one. Find both areas. Is he right?
@viz squares shapes="3x3;6x6" labels="side 3 cm;side 6 cm"
(lines 3)
=> Small: 3 × 3 = 9 cm². Big: 6 × 6 = 36 cm². (SD3)
=> 36 ÷ 9 = 4. The area is 4 times as big, not 2 times: k² = 2² = 4.
=> Targets the "double the sides, double the area" mix-up.

### The map scale is 1 cm : 7 km. How far apart are the two towns?
@viz sdmap a="Red Deer" b="Sylvan Lake" len=3.5 angle=15 dist="3.5 cm" scale="1 cm : 7 km" bar="0;7 km;14 km;21 km"
(lines 2)
=> Real distance = 3.5 × 7 = 24.5 km. (SD3)

### Dilate △ABC about (0, 0) with k = 2. Write the image coordinates and draw the image.
@viz sddilate pts="2,1;4,1;2,3" k=2 names="A,B,C" image=key rays=1
(lines 2)
=> A′(4, 2), B′(8, 2), C′(4, 6). Multiply both coordinates by 2. (SD4)
=> Each image point is on the dashed line from (0, 0) through its original point.

### Kai dilates (3, 2) about (0, 0) with k = 3. He gets (6, 5). Fix his mistake.
(lines 2)
=> He added 3 to each coordinate. Multiply instead: (3 × 3, 2 × 3) = (9, 6). (SD4)
=> Targets the "add the scale factor to each coordinate" mix-up.

### Dilate P(4, 6) and Q(10, 2) about (0, 0) with k = 0.5.
(lines 2)
=> P′(2, 3) and Q′(5, 1). Multiply both coordinates by 0.5. (SD4)

## Challenge

### A garage is 7 m by 5.5 m. Draw it on a blueprint with scale 1 cm : 0.5 m. How big is the drawing? What is the real floor area?
@viz polygon pts="0,0;7,0;7,5.5;0,5.5" sides="7 m;5.5 m;;" cap="Real garage" unit=18
(lines 3)
=> Drawing: 7 ÷ 0.5 = 14 cm and 5.5 ÷ 0.5 = 11 cm. So 14 cm by 11 cm. (SD3)
=> Real area: 7 × 5.5 = 38.5 m².

### A triangle has area 12 cm². It is enlarged with k = 2.5. Find the new area.
(lines 2)
=> New area = 12 × 2.5² = 12 × 6.25 = 75 cm². (SD3)
=> Not 12 × 2.5 = 30: area grows by k², not k.

### Rectangle ABCD is dilated about (0, 0). Find k. Then compare the areas.
@viz sddilate pts="2,1;4,1;4,2;2,2" k=1.5 names="A,B,C,D" image=show rays=1 cell=40
(lines 3)
=> A(2, 1) → A′(3, 1.5): k = 3 ÷ 2 = 1.5 and 1.5 ÷ 1 = 1.5. Check C(4, 2) → C′(6, 3): also 1.5. (SD4)
=> Areas: 2 × 1 = 2 units² and 3 × 1.5 = 4.5 units². 4.5 ÷ 2 = 2.25 = 1.5².

### A photo is 12 cm by 8 cm. Can it be enlarged to fill a 30 cm by 24 cm frame exactly, and stay similar?
(lines 3)
=> 30 ÷ 12 = 2.5, but 24 ÷ 8 = 3. Different multipliers, so no. (SD2)
=> The biggest similar copy that fits uses k = 2.5: 30 cm by 20 cm.

### A model of the Calgary Tower is 95.5 cm tall. The real tower is about 191 m tall. Find the scale as 1 : ___.
(lines 3)
=> Same units: 191 m = 19 100 cm. (SD3)
=> 19 100 ÷ 95.5 = 200. The scale is 1 : 200 (k = 0.005).

### A′(9, 6) and B′(4.5, 0) are images after a dilation about (0, 0) with k = 3. Find A and B.
@viz coord xmin=0 xmax=10 ymin=0 ymax=7 points="9,6:A′;4.5,0:B′"
(lines 2)
=> Undo the dilation: divide both coordinates by 3. (SD4)
=> A(3, 2) and B(1.5, 0).

### A park is 3 cm by 2 cm on a map. The scale is 1 cm : 2 km. Ella says the real area is 6 × 2 = 12 km². Find the real area.
@viz polygon pts="0,0;3,0;3,2;0,2" sides="3 cm;2 cm;;" cap="Park on the map" unit=30
(lines 3)
=> Real sides: 3 × 2 = 6 km and 2 × 2 = 4 km. Real area: 6 × 4 = 24 km². (SD3)
=> Ella scaled the area by k instead of k². Targets the "double the sides, double the area" mix-up.

### The triangles are similar. Find k, x and y.
@viz polygon pts="0,0;7,0;2.36,1.86" sides="7;5;3" arcs="1,2,3" pts2="0,0;10.5,0;3.54,2.78" sides2="y;7.5;x" arcs2="1,2,3" unit=18
(lines 3)
=> Match by arcs. The 5 side matches 7.5: k = 7.5 ÷ 5 = 1.5. (SD2)
=> x = 3 × 1.5 = 4.5. y = 7 × 1.5 = 10.5.
