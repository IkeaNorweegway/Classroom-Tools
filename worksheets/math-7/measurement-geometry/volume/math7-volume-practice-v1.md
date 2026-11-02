---
title: Volume
topic: volume
strand: measurement-geometry
---
## Core

### Name this prism. How many lateral faces does it have?
@viz solid kind=ngon n=5 sv=2 hv=3 blabel="base" both=1 size=140
(lines 1)
=> The bases are pentagons, so it is a pentagonal prism. (VO1)
=> It has 5 lateral faces, one for each side of the pentagon.

### Zoe says the bases of this box are the rectangle it sits on and the rectangle across from it. Is she right?
@viz solid kind=tri bv=4 thv=3.5 lv=9 ground=1 shade=0 size=200
(lines 2)
=> No. The two faces that match at opposite ends are the triangles. They are the bases. (VO1)
=> It is a triangular prism lying on a lateral face. Targets the "base is the face it sits on" mix-up.

### A round hay bale lies in a field. Name the solid. Where are its bases?
@viz solid kind=cyl lying=1 rv=0.8 hv=1.2 ground=1 shade=0 size=140
(lines 2)
=> It is a cylinder. (VO1)
=> Its bases are the two circle ends. It lies on its curved surface.

### Find the volume of this box of centimetre cubes.
@viz layers l=4 w=2 h=3 llabel="one layer: [[8]] cubes" blabel="[[3]] layers"
(lines 2)
=> One layer: 4 × 2 = 8 cubes. (VO2)
=> 3 layers: 8 × 3 = 24 cubes. V = 24 cm³.

### A cereal box is 25 cm wide, 8 cm deep and 30 cm tall. Find its volume.
@viz solid kind=box l="25 cm" w="8 cm" h="30 cm" lv=25 wv=8 hv=30 size=150
(lines 2)
=> One layer: 25 × 8 = 200 cm³. (VO2)
=> 30 layers: 200 × 30 = 6000 cm³.

### Raj says a box 5 cm by 4 cm by 3 cm has a volume of 60 cm². Fix his mistake.
(lines 2)
=> 5 × 4 × 3 = 60 is right. The unit is wrong. (VO2)
=> Volume counts cubes, so it is 60 cm³. Targets the "volume is in square units" mix-up.

### A doorstop is a triangular prism. Find its volume.
@viz solid kind=tri right=1 b="8 cm" th="3 cm" l="5 cm" bv=8 thv=3 lv=5 blabel="B" size=180
(lines 3)
=> The bases are the right triangles. B = ½ × 8 × 3 = 12 cm². (VO3)
=> h is the distance between the triangles: 5 cm.
=> V = B × h = 12 × 5 = 60 cm³.

### A tent's triangle end is 2.4 m wide and 1.6 m high. The tent is 3 m long. Noor says V = B × 1.6. Fix her mistake.
@viz solid kind=tri along=z b="2.4 m" th="1.6 m" l="3 m" bv=2.4 thv=1.6 lv=3 blabel="B" fill=plant size=200
(lines 3)
=> 1.6 m is the triangle's height. It goes inside B: B = ½ × 2.4 × 1.6 = 1.92 m². (VO3)
=> The prism's h is the distance between the triangles: 3 m. V = 1.92 × 3 = 5.76 m³.
=> Targets the "triangle's height as the prism's height" mix-up. (Noor's way gives 3.072 m³.)

### A grain bin is 8 m across and 5 m tall. Kai finds B ≈ 3.14 × 8 × 8. Fix his mistake. Then find the volume.
@viz solid kind=cyl r="d = 8 m" h="h = 5 m" rv=4 hv=5 diameter=1 blabel="B" fill=cold size=130
(lines 3)
=> 8 m is the diameter. Halve it: r = 4 m. (VO3)
=> B ≈ 3.14 × 4 × 4 = 50.24 m². V ≈ 50.24 × 5 = 251.2 m³.
=> Targets the "diameter as the radius" mix-up. (Kai's way gives 1004.8 m³, 4 times too big.)

### A cooler holds 36 000 cm³. The inside of its bottom is 60 cm by 30 cm. How deep is it inside?
@viz solid kind=box l="60 cm" w="30 cm" h="h = ?" lv=60 wv=30 hv=20 blabel="B" size=180
(lines 2)
=> B = 60 × 30 = 1800 cm². (VO4)
=> h = V ÷ B = 36 000 ÷ 1800 = 20 cm. Check: 1800 × 20 = 36 000.

### A pool holds 450 m³ of water. The water is 1.8 m deep. Find the area of the pool's bottom.
(lines 2)
=> B = V ÷ h = 450 ÷ 1.8 = 250 m². (VO4)
=> Check: 250 × 1.8 = 450.

### A sandbox is 2.5 m long, 160 cm wide and 20 cm deep. Find its volume in m³.
(lines 3)
=> Same units first: 160 cm = 1.6 m and 20 cm = 0.2 m. (VO4)
=> V = 2.5 × 1.6 × 0.2 = 0.8 m³.
=> Targets mixing units. (2.5 × 160 × 20 = 8000 is not in any one unit.)

## Challenge

### A box holds 1 L. Its bottom is 10 cm by 8 cm. How tall is it?
(lines 3)
=> 1 L = 1000 mL = 1000 cm³. (VO2, VO4)
=> B = 10 × 8 = 80 cm². h = 1000 ÷ 80 = 12.5 cm.

### A fish tank is 60 cm long, 30 cm wide and 40 cm tall. How many litres does it hold when full? How many litres fill it to 30 cm deep?
@viz solid kind=box l="60 cm" w="30 cm" h="40 cm" lv=60 wv=30 hv=40 slices=4 fill=water size=160
(lines 3)
=> Full: 60 × 30 × 40 = 72 000 cm³ = 72 L. (VO2)
=> To 30 cm: 60 × 30 × 30 = 54 000 cm³ = 54 L.

### A stack of 10 hockey pucks is 25 cm tall. Each puck has a radius of 3.8 cm. Find the volume of the stack.
@viz solid kind=cyl r="r = 3.8 cm" h="h = 25 cm" rv=3.8 hv=25 slices=10 size=150
(lines 3)
=> B ≈ 3.14 × 3.8 × 3.8 = 3.14 × 14.44 = 45.3416 cm². (VO3)
=> V ≈ 45.3416 × 25 = 1133.54, about 1133.5 cm³. (That is 10 pucks of about 113.4 cm³.)

### Can A has a radius of 3 cm. Can B has a radius of 6 cm. Both are 10 cm tall. Ben says B holds twice as much. Is he right?
(lines 3)
=> A: B ≈ 3.14 × 3 × 3 = 28.26 cm². V ≈ 282.6 cm³. (VO3)
=> B: B ≈ 3.14 × 6 × 6 = 113.04 cm². V ≈ 1130.4 cm³.
=> 1130.4 ÷ 282.6 = 4. No: double the radius gives 4 times the volume.

### A triangular prism has a volume of 90 cm³. Its triangle has a base of 6 cm and a height of 5 cm. How long is the prism?
@viz solid kind=tri b="6 cm" th="5 cm" l="h = ?" bv=6 thv=5 lv=6 blabel="B" size=200
(lines 3)
=> B = ½ × 6 × 5 = 15 cm². (VO3, VO4)
=> h = V ÷ B = 90 ÷ 15 = 6 cm.

### A grain bin is 8 m across. It holds 301.44 m³. How tall is it?
@viz solid kind=cyl r="d = 8 m" h="h = ?" rv=4 hv=6 diameter=1 blabel="B" fill=cold size=130
(lines 3)
=> r = 4 m. B ≈ 3.14 × 4 × 4 = 50.24 m². (VO3, VO4)
=> h = 301.44 ÷ 50.24 = 6 m.

### A crate is 2 m long, 50 cm wide and 40 cm tall. Find its volume in m³. Then find it in cm³. How many cm³ make 1 m³?
(lines 4)
=> In m: 2 × 0.5 × 0.4 = 0.4 m³. (VO2, VO4)
=> In cm: 200 × 50 × 40 = 400 000 cm³.
=> 0.4 m³ = 400 000 cm³, so 1 m³ = 1 000 000 cm³. A 1 m cube is 100 × 100 × 100 centimetre cubes.
