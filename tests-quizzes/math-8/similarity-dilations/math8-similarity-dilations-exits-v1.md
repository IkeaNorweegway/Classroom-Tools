---
title: Similarity & Dilations
topic: similarity-dilations
strand: measurement-geometry
---
<!-- Gate: one ticket per cluster. Every question maps to a specific LO (SD1, SD2, SD3: 8G1.1; SD4: 8G1.2). -->

## Section 1: Similar shapes
Target: I can tell if two shapes are similar. I can match their sides and angles. (SD1)
### Are these rectangles similar? Show your work.
@viz polygon pts="0,0;6,0;6,2;0,2" sides="6 cm;2 cm;;" pts2="0,0;9,0;9,3;0,3" sides2="9 cm;3 cm;;" unit=16
(lines 2)
=> 6 ÷ 2 = 3 and 9 ÷ 3 = 3. Long ÷ short matches, so they are similar.
### Two squares have sides 2 cm and 7 cm. Are they similar? Explain how you know.
(lines 2)
=> Yes. All squares are similar: four right angles, and every side is multiplied by the same number (3.5).

## Section 2: Scale factor
Target: I can find a scale factor. I can use it to find a missing side. I can use it to decide if shapes are similar. (SD2)
### Find k. Then find the missing side x.
@viz polygon pts="0,0;4,0;4,3;0,3" sides="4 cm;3 cm;;" cap="Original" pts2="0,0;10,0;10,7.5;0,7.5" sides2="10 cm;x;;" cap2="Copy" unit=12
(lines 2)
=> k = 10 ÷ 4 = 2.5. x = 3 × 2.5 = 7.5 cm.
### A copy has k = 0.8. Is it bigger or smaller than the original? Explain how you know.
(lines 2)
=> Smaller. 0.8 is between 0 and 1, so each side is multiplied by less than 1: a reduction.

## Section 3: Area and scale drawings
Target: I can tell how area changes with the scale factor. I can use a scale to find real lengths. (SD3)
### A map scale is 1 cm : 3 km. Find the real distance.
@viz sdmap a="Canmore" b="Banff" len=6 angle=12 dist="6 cm" scale="1 cm : 3 km" bar="0;3 km;6 km;9 km"
(lines 1)
=> 6 × 3 = 18 km.
### A rug has area 4 m². A similar rug has every side tripled. Find its area. Explain how you know.
(lines 2)
=> 4 × 3² = 4 × 9 = 36 m². Length and width both triple, so the area grows by 3 × 3 = 9.

## Section 4: Dilations on a grid
Target: I can dilate a shape about (0, 0). I can check that the image is similar. (SD4)
### Dilate △ABC about (0, 0) with k = 3. Write A′, B′ and C′.
@viz sddilate pts="1,1;2,1;1,2" k=3 names="A,B,C" image=key rays=1
(lines 1)
=> A′(3, 3), B′(6, 3), C′(3, 6).
### Is △A′B′C′ similar to △ABC? Explain how you know.
(lines 2)
=> Yes. AB = 1 and A′B′ = 3. AC = 1 and A′C′ = 3. Every side is × 3 and the angles match (right angle at A and A′).
