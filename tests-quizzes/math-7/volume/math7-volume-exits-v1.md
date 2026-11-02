---
title: Volume
topic: volume
strand: measurement-geometry
---
<!-- Gate: one ticket per cluster. Every question maps to a specific LO (VO1–VO4, all outcome 7M2). -->

## Section 1: Prisms and cylinders
Target: I can name a prism by its base. I can find the bases and the lateral faces in any position. (VO1)
### Name this prism. How many lateral faces does it have?
@viz solid kind=tri along=y bv=5 thv=4 lv=6 shade=0 size=140
(lines 1)
=> A triangular prism (it stands on a triangle base). It has 3 lateral faces.
### A round hay bale lies on its side. Which faces are its bases? Explain how you know.
@viz solid kind=cyl lying=1 rv=0.8 hv=1.2 ground=1 shade=0 size=130
(lines 2)
=> The two circle ends. They match and they are at opposite ends. The bale sits on its curved surface, which is not a base.

## Section 2: Volume by layers
Target: I can find the volume of a box by counting layers of cubes. I can give volume in cubic units. (VO2)
### Find the volume.
@viz layers l=5 w=2 h=3 llabel="one layer: ___ cubes" blabel="___ layers"
(lines 1)
=> One layer: 5 × 2 = 10 cubes. 3 layers: 10 × 3 = 30 cm³.
### A box is 8 m long, 5 m wide and 2 m tall. Find its volume.
(lines 1)
=> 8 × 5 × 2 = 80 m³.
### Is your answer in m² or m³? Explain how you know.
(lines 2)
=> m³. Volume counts cubes. We multiplied three lengths: length, width and height.

## Section 3: Volume = base area × height
Target: I can find the volume of any prism or cylinder. I use V = B × h. (VO3)
### Find the volume.
@viz solid kind=tri b="10 cm" th="6 cm" l="12 cm" bv=10 thv=6 lv=10 blabel="B" size=200
(lines 2)
=> B = ½ × 10 × 6 = 30 cm². V = 30 × 12 = 360 cm³.
### A can is 10 cm across and 4 cm tall. Find its volume.
@viz solid kind=cyl r="d = 10 cm" h="h = 4 cm" rv=5 hv=4 diameter=1 blabel="B" size=120
(lines 2)
=> r = 5 cm. B ≈ 3.14 × 5 × 5 = 78.5 cm². V ≈ 78.5 × 4 = 314 cm³.
### The first prism shows 6 cm and 12 cm. Which one is h in V = B × h? Explain how you know.
(lines 2)
=> 12 cm. h is the distance between the two triangle bases. 6 cm is the triangle's height. It goes inside B.

## Section 4: Finding a missing measure
Target: I can find the base area or the height from the volume. I can change units so they match first. (VO4)
### A box holds 96 cm³. Its base area is 16 cm². How tall is it?
@viz solid kind=box lv=7 wv=3 hv=5 blabel="B = 16 cm²" h="h = ?" size=150
(lines 1)
=> h = V ÷ B = 96 ÷ 16 = 6 cm.
### A planter box holds 2 m³ of soil. The soil is 50 cm deep. Find the area of the bottom.
(lines 2)
=> 50 cm = 0.5 m. B = V ÷ h = 2 ÷ 0.5 = 4 m².
### Why did you change 50 cm to metres first? Explain how you know.
(lines 2)
=> The volume is in m³. All lengths must be in the same unit, metres. 2 ÷ 50 would mix units and give a wrong answer.
