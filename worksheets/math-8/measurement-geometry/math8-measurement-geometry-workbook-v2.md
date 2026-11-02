---
title: Geometry & Measurement
strand: measurement-geometry
rubric:
  - Similarity and dilations: similar shapes, the scale factor k, area grows by k², scale drawings and maps, dilations about (0, 0)
  - Triangle theorems: the angle sum, isosceles triangles, the triangle inequality, the Pythagorean theorem and its converse, right-triangle problems
  - Surface area: polyhedrons and cube nets, surface area of prisms and pyramids, cylinders (π ≈ 3.14), orthographic views
---
<!-- Gate: interleaving confirmed. No part headers. ★/★★ per topic: similarity and dilations (SD1–4), triangle
     theorems (TT1–4), surface area (SA1–4) — every section code at least once outside the stretch, Core first,
     Extended after the check-in, then two mixed stretch questions.
     Contexts from the notes: zoomed photos, torn triangle corners, straws, cube nets folded, gift-box nets,
     the ladder on a wall, a can and its label, dilations with rays from (0, 0), block buildings, trail maps,
     square-based pyramids with slant height.
     Every Geometry & Measurement misconception in _courses/math-8/_context.md has a Misconception target box. -->

## core | SD1 — Similarity & Dilations, Section 1
A photo is 4 cm by 3 cm. Ben says, "Similar shapes must be the same size."
1. Divide matching sides. Is copy B similar to the photo?
2. Is copy C similar to the photo?
3. Is Ben right? Explain.
@viz polygon pts="0,0;4,0;4,3;0,3" sides="4 cm;3 cm;;" cap="Photo" pts2="0,0;8,0;8,6;0,6" sides2="8 cm;6 cm;;" cap2="Copy B" unit=18
@viz polygon pts="0,0;8,0;8,3;0,3" sides="8 cm;3 cm;;" cap="Copy C" unit=18
(lines 3)
=> 1. 8 ÷ 4 = 2 and 6 ÷ 3 = 2. Both sides grow by 2. B is similar.
=> 2. 8 ÷ 4 = 2 but 3 ÷ 3 = 1. Only the length grew. C is not similar. It is stretched.
=> 3. No. Similar means the same shape. B is bigger, but it is still similar.
::: teacher
label: Misconception target
"Similar means the same size." Ask: is B the same shape? Similar shapes can differ in size by a scale factor; same size *and* shape is congruent.
:::

## core | TT1 — Triangle Theorems, Section 1
A triangle has angles of 48° and 67°.
1. Find the third angle x.
2. The second triangle is isosceles. The top angle is 36°. Find y.
@viz tttear angles="48,67,65" labels="48°;67°;x" sum="48° + 67° + x = 180°" line=1
@viz polygon pts="0,0;4,0;2,6.16" ticks="0,1,1" arcs="1,1,0" angles="y;y;36°" unit=22
(lines 3)
=> 1. 48 + 67 = 115. x = 180 − 115 = 65°.
=> 2. The two base angles are equal. 180 − 36 = 144. y = 144 ÷ 2 = 72°.
=> Check: 72 + 72 + 36 = 180 ✓.

## core | SA1 — Surface Area, Section 1
Leo says, "Any 6 squares joined together make a cube net."
1. Fold each pattern in your head. Which one makes a cube?
2. In pattern B, which two squares land on the same face?
3. Is Leo right?
@viz sacube cells="0,0;1,0;1,1;2,1;2,2;3,2" label="Pattern A"
@viz sacube cells="1,0;1,1;1,2;1,3;0,0;0,3" letters="A,B,C,D,E,F" label="Pattern B"
(lines 3)
=> 1. Pattern A (the staircase) folds into a cube.
=> 2. A, B, C and D wrap around in a loop. E and F both fold onto the left face. They overlap.
=> 3. No. Both patterns have 6 squares, but only A is a net. Test by folding.
::: teacher
label: Misconception target
"Any 6 squares joined make a cube net." Have the student cut out pattern B and fold it. The 4-square column becomes a loop; E and F collide.
:::

## core | SD2 — Similarity & Dilations, Section 2
A logo is 5 cm by 3 cm. It is enlarged with a scale factor of k = 2.5.
1. Find the new sides.
2. A 15 cm by 9 cm poster is shrunk. The new length is 6 cm. Find k and the new width.
3. Is the poster copy an enlargement or a reduction?
@viz polygon pts="0,0;5,0;5,3;0,3" sides="5 cm;3 cm;;" cap="Logo" pts2="0,0;12.5,0;12.5,7.5;0,7.5" sides2="[[12.5 cm]];[[7.5 cm]];;" cap2="Enlarged, k = 2.5" unit=12
(lines 3)
=> 1. 5 × 2.5 = 12.5 cm. 3 × 2.5 = 7.5 cm.
=> 2. k = new ÷ old = 6 ÷ 15 = 0.4. Width: 9 × 0.4 = 3.6 cm.
=> 3. A reduction, because k = 0.4 is less than 1.

## core | TT2 — Triangle Theorems, Section 2
Mia has straws of 4 cm, 5 cm and 10 cm. She says, "Any three straws make a triangle."
1. Add the two shorter straws. Do they meet?
2. Which of these make a triangle: 6, 6, 11 or 3, 5, 8?
3. Two sides are 6 cm and 9 cm. What lengths can the third side be?
@viz ttstraws a=4 b=5 c=10 la="4 cm" lb="5 cm" lc="10 cm" show=key unit=20
@viz ttrange min=0 max=16 lo=3 hi=15 show=key label="[[3]]  <  x  <  [[15]]"
(lines 4)
=> 1. 4 + 5 = 9. That is less than 10. There is a gap. No triangle.
=> 2. 6 + 6 = 12 > 11: a triangle. 3 + 5 = 8 exactly: the straws lie flat. No triangle.
=> 3. More than 9 − 6 = 3 and less than 9 + 6 = 15. So 3 cm < x < 15 cm.
::: teacher
label: Misconception target
"Any three lengths make a triangle." Ask the student to build 4, 5, 10 with straws or a ruler drawing. The two short sides must add to *more than* the longest.
:::

## core | SA2 — Surface Area, Section 2
A gift box is 4 cm by 3 cm by 2 cm. Ana finds 4 × 3 × 2 = 24. She says, "The surface area is 24 cm²."
1. Write the area of each face in the net.
2. Find the surface area.
3. What did Ana find? Use the right units.
@viz solid kind=box l="4 cm" w="3 cm" h="2 cm" lv=4 wv=3 hv=2 size=130
@viz net type=box lv=4 wv=3 hv=2 n1="[[8]]" n2="[[8]]" n3="[[6]]" n4="[[6]]" n5="[[12]]" n6="[[12]]"
(lines 3)
=> 1. Front and back: 4 × 2 = 8. Two sides: 3 × 2 = 6. Top and bottom: 4 × 3 = 12.
=> 2. 8 + 8 + 6 + 6 + 12 + 12 = 52 cm².
=> 3. Ana found the volume: 24 cm³. Volume fills the box. Surface area covers it.
::: teacher
label: Misconception target
"Surface area and volume measure the same thing." Ask: how much wrapping paper (cm²)? How many 1 cm cubes fit inside (cm³)? 52 and 24 answer different questions.
:::

## core | TT3 — Triangle Theorems, Section 3
Kai labels this right triangle. He writes 10² + 6² = 8². He says, "136 ≠ 64. So it is not a right triangle."
1. Which side is the hypotenuse? How do you know?
2. Check with a² + b² = c².
3. Use the converse. Is 9, 12, 15 a right triangle? Is 7, 9, 12?
@viz polygon pts="0,0;8,0;8,6" right="2" sides="c = 8;b = 6;a = 10" unit=20
(lines 4)
=> 1. The 10 side. It is across from the right angle. It is the longest side.
=> 2. 8² + 6² = 64 + 36 = 100 = 10² ✓. It is a right triangle.
=> 3. 9² + 12² = 81 + 144 = 225 = 15². Yes. 7² + 9² = 49 + 81 = 130. 12² = 144. No.
::: teacher
label: Misconception target
"c is whatever side is labelled c." Have the student find the right-angle mark first, then the side across from it. c is always the longest side.
:::

## CHECKIN

## ext | SD3 — Similarity & Dilations, Section 3
A garden is 3 m by 2 m. Ben makes each side 3 times as long. He says, "The area triples too."
1. Find the new sides.
2. Find both areas.
3. How many times as big is the new area? Is Ben right?
@viz squares shapes="3x2;9x6" labels="3 × 2 = 6 m²;9 × 6 = [[54]] m²"
(lines 3)
=> 1. 3 × 3 = 9 m and 2 × 3 = 6 m.
=> 2. Old: 3 × 2 = 6 m². New: 9 × 6 = 54 m².
=> 3. 54 ÷ 6 = 9 times. Ben is wrong. The area grows by k² = 3² = 9.
::: teacher
label: Misconception target
"Double (or triple) the sides, double (or triple) the area." Have the student count how many old gardens fit in the new one: 3 across and 3 down make 9.
:::

## ext | SA3 — Surface Area, Section 3
A can has a diameter of 8 cm and a height of 12 cm. Jo says, "The label is 8 cm long."
1. Find the length of the label. Use π ≈ 3.14.
2. Find the area of the label.
3. Find the surface area of the whole can.
@viz saunroll rv=4 hv=12 r="d = 8 cm" h="h = 12 cm" c="length = ?" inside="label" diameter=1 size=300
(lines 4)
=> 1. The label wraps around. Length = circumference = 3.14 × 8 = 25.12 cm.
=> 2. 25.12 × 12 = 301.44 cm².
=> 3. r = 4. One circle: 3.14 × 4 × 4 = 50.24 cm². Two circles: 100.48 cm².
=> Total: 301.44 + 100.48 = 401.92 cm².
::: teacher
label: Misconception target
"The net's rectangle is as long as the diameter." Wrap a strip of paper around a real can, then lay it flat. It is just over 3 diameters long.
:::

## ext | TT4 — Triangle Theorems, Section 4
A 5.0 m ladder leans on a wall. Its foot is 1.4 m from the wall. Leo adds: 5² + 1.4² = 26.96, so h ≈ 5.2 m.
1. Which side is the hypotenuse?
2. Find h to one decimal.
3. Why can Leo's answer not be right?
@viz ttscene kind=ladder w=1.4 h=4.8 a="h" b="1.4 m" c="5.0 m"
(lines 4)
=> 1. The ladder (5.0 m). It is across from the right angle at the ground.
=> 2. h is a leg, so subtract: h² = 5.0² − 1.4² = 25 − 1.96 = 23.04. h = √23.04 = 4.8 m.
=> 3. 5.2 m is longer than the ladder. A leg is always shorter than the hypotenuse.
::: teacher
label: Misconception target
"For a leg, add the squares." Ask: which side is longest? If the answer is longer than the hypotenuse, the student added when they should subtract: a² = c² − b².
:::

## ext | SD4 — Similarity & Dilations, Section 4
Triangle ABC has A(1, 1), B(3, 1) and C(1, 3). Kai dilates it by k = 2. He adds 2 and gets A′(3, 3).
1. Find A′, B′ and C′. Draw the image.
2. Kai's B′ is (5, 3). How long is his A′B′? How long is AB? Did his triangle grow?
3. Dilate P(6, 4) by k = {1/2}.
@viz sddilate pts="1,1;3,1;1,3" k=2 names="A,B,C" image=key rays=1
(lines 4)
=> 1. Multiply each coordinate by 2: A′(2, 2), B′(6, 2), C′(2, 6).
=> 2. From (3, 3) to (5, 3) is 2 units. AB is also 2 units. Adding slid the triangle. It did not grow.
=> 3. P′(3, 2). Each coordinate is halved.
::: teacher
label: Misconception target
"Add the scale factor to each coordinate." Have the student draw the ray from (0, 0) through A. A′ must sit on that ray, twice as far out.
:::

## ext | SA4 — Surface Area, Section 4
Here is a building made of cubes.
1. How many cubes are in it?
2. Draw the top, front and right side views.
3. Sam says, "The front view has 5 squares, so there are 5 cubes." Is he right?
@viz blocks heights="1,2,2;1,1,0" views=key front=1
(lines 4)
=> 1. Back row: 1 + 2 + 2 = 5. Front row: 1 + 1 = 2. Total: 7 cubes.
=> 2. Top: 3 squares in the back row, 2 in the front row. Front: columns 1, 2, 2 tall. Right side: front row 1 tall, back row 2 tall.
=> 3. No. A view shows only the cubes you can see. Cubes behind others are hidden.

## stretch | SD3 + TT4 — Scale Drawings and Right Triangles
A hiking map has a scale of 1 cm : 2 km. The trail goes 3.6 cm east, then 4.8 cm north.
1. Find the real length of each part.
2. Find the straight-line distance back to the start.
3. How long is that line on the map? Check it with the scale.
@viz righttri a="4.8 cm" b="3.6 cm" c="?" aval=4.8 bval=3.6 hyp=1
(lines 5)
=> 1. 3.6 × 2 = 7.2 km east. 4.8 × 2 = 9.6 km north.
=> 2. d² = 7.2² + 9.6² = 51.84 + 92.16 = 144. d = √144 = 12 km.
=> 3. On the map: 3.6² + 4.8² = 12.96 + 23.04 = 36, so 6 cm. Check: 6 × 2 = 12 km ✓.

## stretch | TT4 + SA2 — Pyramids and the Pythagorean Theorem
A square-based pyramid has a base edge of 16 cm and a height of 6 cm.
1. Find the slant height s. (Hint: half the base edge is one leg.)
2. Find the surface area.
@viz sasolid kind=pyr b="16 cm" h="h = 6 cm" s="s = ?" bv=16 hv=6 slant=1 height=1 size=180
(lines 5)
=> 1. The legs are 6 cm and 16 ÷ 2 = 8 cm. s² = 6² + 8² = 36 + 64 = 100. s = 10 cm.
=> 2. Base: 16 × 16 = 256 cm². One triangle: {1/2} × 16 × 10 = 80 cm². Four triangles: 320 cm².
=> Total: 256 + 320 = 576 cm².
