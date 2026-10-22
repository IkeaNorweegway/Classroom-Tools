---
title: Measurement and Geometry
strand: measurement-geometry
rubric:
  - Pythagorean theorem: find a hypotenuse or a leg, test for a right triangle
  - Nets: match and draw nets of prisms and cylinders
  - Surface area of prisms and cylinders
  - Volume of prisms and cylinders
  - Views of objects made of cubes
  - Transformations on a grid and congruence
---
<!-- Gate: interleaving confirmed. No part headers. ★/★★ per cluster: Pythagorean (PY), nets (SV1), surface area (SV2–3), volume (SV4),
     views (VT1–2), transformations (VT3–4) — each 3+ times. Bloom's: 2 recall, the rest apply / analyze / evaluate. Visuals on 13 of 20 questions.
     Contexts from the notes: ladder, TV diagonal, carpenter's 3-4-5, cereal box, tent, soup can, hay bale, grain bin, triangle ABC on a grid. -->

## core | PY2 — Pythagorean Theorem, Section 2
A TV screen is 36 cm tall and 48 cm wide. How long is the diagonal?
@viz righttri a="36 cm" b="48 cm" c="?" aval=36 bval=48
(work 2)
=> √(1296 + 2304) = √3600 = 60 cm

## core | SV1 — Surface Area and Volume, Section 1
Which object does this net make? How many faces does it have?
@viz net type=tri b="" th="" s="" l="" bv=5 thv=4 lv=7
(lines 1)
=> A triangular prism. 5 faces (2 triangles, 3 rectangles).

## core | VT1 — Views and Transformations, Section 1
Draw the top, front and right side views.
@viz blocks heights="1,2;1,1" views=key

## core | SV4 — Surface Area and Volume, Section 4
Find the volume of the cereal box: 25 cm × 8 cm × 30 cm.
@viz prism l="25 cm" w="8 cm" h="30 cm" lv=25 wv=8 hv=30
(work 1)
=> 25 × 8 × 30 = 6000 cm³

## core | VT3 — Views and Transformations, Section 3
Triangle A(1, 1), B(4, 1), C(1, 3). Give the image after a translation 3 left and 4 down.
@viz transform shape="1,1;4,1;1,3" move="translate -3,-4" names="A,B,C" image=key
(lines 1)
=> A′(−2, −3), B′(1, −3), C′(−2, −1)

## core | PY3 — Pythagorean Theorem, Section 3
A 6.5 m ladder leans against a wall. Its foot is 2.5 m from the wall. How high does it reach?
@viz righttri a="?" b="2.5 m" c="6.5 m" aval=6 bval=2.5 alabel="wall" blabel="ground" clabel="ladder"
(work 2)
=> √(42.25 − 6.25) = √36 = 6 m

## core | SV2 — Surface Area and Volume, Section 2
Find the surface area of a box 10 cm × 6 cm × 4 cm.
(work 3)
=> 2(60) + 2(40) + 2(24) = 120 + 80 + 48 = 248 cm²

## core | SV3 — Surface Area and Volume, Section 3
A soup can has r = 4 cm and h = 11 cm. How big is the label (the side only)? Use π ≈ 3.14.
@viz cylinder r="4 cm" h="11 cm" rv=4 hv=11
(work 2)
=> 2 × 3.14 × 4 × 11 = 276.32 cm²

## CHECKIN

## ext | PY1 + PY4 — Pythagorean Theorem, Sections 1 and 4
Kara says a triangle with sides 5, 7 and 9 is a right triangle, "because a² + b² = c² works for all triangles." Explain her mistake. Test the triangle.
(lines 3)
=> The theorem only works for right triangles. Test: 25 + 49 = 74 ≠ 81, so it is not a right triangle.
::: teacher
label: Misconception target
The theorem used on any triangle.
:::

## ext | SV1 — Surface Area and Volume, Section 1
Ben drew the net of a can with r = 3 cm. He made the rectangle 6 cm long. What is wrong? How long should it be?
@viz net type=cyl r="3 cm" h="" rv=3 hv=5 c="6 cm ?"
(lines 3)
=> 6 cm is the diameter. The rectangle wraps around, so its length is the circumference: 2 × 3.14 × 3 ≈ 18.8 cm.
::: teacher
label: Misconception target
Cylinder rectangle = diameter.
:::

## ext | VT1 — Views and Transformations, Section 1
Jen drew the front view of this object as one column 4 squares tall. Is she right? Explain.
@viz blocks heights="1;3" views=none
(lines 3)
=> No. The 1-cube stack is behind the 3-cube stack, so from the front you see only 3 squares (one column, 3 tall). She added the hidden cube.
::: teacher
label: Misconception target
Counting hidden cubes in a view.
:::

## ext | SV2 + SV4 — Surface Area and Volume
Leah says "surface area and volume are the same thing for a box." Use the cereal box (25 × 8 × 30) to show they are different. Include units.
(lines 4)
=> SA = 2(200) + 2(750) + 2(240) = 2380 cm² (wrapping). V = 6000 cm³ (filling). Different numbers and different units.
::: teacher
label: Misconception target
SA vs volume. Also check for "6 × one face."
:::

## ext | PY3 — Pythagorean Theorem, Section 3
Omar found the missing leg of a right triangle with hypotenuse 13 and leg 5 like this: 13² + 5² = 194, √194 ≈ 13.9. What did he do wrong? How could he have caught it?
(lines 3)
=> He added instead of subtracting. Correct: √(169 − 25) = √144 = 12. A leg must be shorter than the hypotenuse; 13.9 > 13.
::: teacher
label: Misconception target
Adding squares to find a leg.
:::

## ext | VT4 — Views and Transformations, Section 4
After a reflection in the x-axis and then a translation 2 left, the image is P′(−1, −3). Find P. Is the image congruent to the original? Explain.
(lines 3)
=> Undo the translation: (1, −3). Undo the reflection: P(1, 3). Yes: reflections and translations keep every length and angle.
::: teacher
label: Misconception target
"Flipped shapes are not congruent."
:::

## ext | SV4 — Surface Area and Volume, Section 4
A grain bin is 9 m across and 6 m tall. A farmer says turning a box-shaped bin on its side would hold more. First find the cylinder's volume. Then explain whether turning a box changes its volume.
@viz cylinder r="9 m" h="6 m" rv=4.5 hv=6 diameter=1
(work 3)
=> r = 4.5. V = 3.14 × 20.25 × 6 ≈ 381.5 m³. Turning a box does not change its volume: l × w × h is the same in any order.
::: teacher
label: Misconception target
"Turning changes volume."
:::

## stretch | PY2 + SV2 — Pythagorean and Surface Area
A tent is a triangular prism. Its triangle has base 3 m and height 2 m. The tent is 4 m long. Find the slant side, then the surface area (with a floor).
@viz triprism b="3 m" th="2 m" s="?" l="4 m" bv=3 thv=2 lv=4
(work 4)
=> Slant = √(1.5² + 2²) = √6.25 = 2.5 m. SA = 2(½ × 3 × 2) + 3 × 4 + 2(2.5 × 4) = 6 + 12 + 20 = 38 m².

## stretch | SV3 + SV4 — Surface Area and Volume
Two cans hold about the same amount. Can A: r = 4 cm, h = 10 cm. Can B: r = 5 cm, h = 6.4 cm. Which uses less metal?
(work 4)
=> Volumes: A = 3.14 × 16 × 10 = 502.4; B = 3.14 × 25 × 6.4 = 502.4. SA: A = 100.48 + 251.2 = 351.68; B = 157 + 200.96 = 357.96. Can A uses a little less metal.

## stretch | VT3 + PY2 — Transformations and Pythagorean
Point A(1, 2) is rotated 180° about the origin to A′. How far apart are A and A′? (Hint: draw the right triangle between them.)
@viz coord xmin=-3 xmax=3 ymin=-3 ymax=3 points="1,2:A" keypoints="-1,-2:A′"
(work 3)
=> A′(−1, −2). Across 2, down 4. Distance = √(4 + 16) = √20 ≈ 4.5 units.
