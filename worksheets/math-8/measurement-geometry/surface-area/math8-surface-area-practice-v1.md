---
title: Surface Area
topic: surface-area
strand: measurement-geometry
---
## Core

### Sort these solids. Which are polyhedrons? A cereal box, a soup can, a square-based pyramid, a basketball, a Toblerone-style box, an ice-cream cone.
(lines 2)
=> Polyhedrons: the cereal box, the pyramid and the Toblerone-style box. All their faces are flat polygons. (SA1)
=> Not polyhedrons: the soup can (cylinder), the basketball (sphere) and the cone. Each has a curved surface.

### Name the solid this net folds into. How many faces does it have?
@viz sapnet bv=5 wv=3 sv=4 s2v=4.5 size=220
(lines 2)
=> 1 rectangle and 4 triangles. The triangles meet at an apex. (SA1)
=> It is a rectangle-based pyramid with 5 faces.

### Will each pattern fold into a cube? Fold it in your head.
@viz sacube cells="0,0;1,0;1,1;2,1;3,1;3,2" label="Pattern A"
@viz sacube cells="0,0;1,0;2,0;3,0;1,1;2,1" label="Pattern B"
(lines 2)
=> A: yes. Folded up, every square lands on a different face. No two overlap. (SA1)
=> B: no. It has a 2 by 2 square, so two squares overlap. Targets the "any 6 squares make a cube net" mix-up.

### This net folds into a cube. Which face is across from Q? Which is across from P?
@viz sacube cells="0,0;0,1;1,1;2,1;3,1;3,2" letters="P,Q,R,S,T,U" unit=30
(lines 2)
=> Q, R, S and T wrap around in a loop. Q is across from S (two steps away). (SA1)
=> P folds to the top and U folds to the bottom. P is across from U.

### A cereal box is 20 cm wide, 7 cm deep and 30 cm tall. Find its surface area.
@viz solid kind=box l="20 cm" w="7 cm" h="30 cm" lv=20 wv=7 hv=30 size=150
(lines 3)
=> Front and back: 20 × 30 = 600 cm² each. Sides: 7 × 30 = 210 cm² each. Top and bottom: 20 × 7 = 140 cm² each. (SA2)
=> SA = 2 × (600 + 210 + 140) = 2 × 950 = 1900 cm².

### A box is 5 cm by 4 cm by 2 cm. Leo says its surface area is 40 cm². Fix his mistake.
@viz net type=box lv=5 wv=4 hv=2 n1="[[10]]" n2="[[10]]" n3="[[8]]" n4="[[8]]" n5="[[20]]" n6="[[20]]"
(lines 3)
=> 5 × 4 × 2 = 40 is the volume, 40 cm³. Volume fills the box. (SA2)
=> SA covers it: 2 × (20 + 10 + 8) = 76 cm². Targets the "surface area and volume are the same" mix-up.

### A doorstop is a triangular prism. Its ends are right triangles with sides 6 cm, 8 cm and 10 cm. It is 5 cm long. Find its SA.
@viz satnet av=6 bv=8 cv=10 lv=5 la="6 cm" lb="8 cm" lc="10 cm" l="5 cm" size=280
(lines 3)
=> Two triangles: 2 × ½ × 8 × 6 = 48 cm². (SA2)
=> Rectangles: 6 × 5 = 30, 8 × 5 = 40 and 10 × 5 = 50. Together 120 cm².
=> SA = 48 + 120 = 168 cm².

### A square-based pyramid has a base 10 cm on each side. Its height is 12 cm. Its slant height is 13 cm. Find its SA.
@viz sasolid kind=pyr b="10 cm" s="s = 13 cm" h="h = 12 cm" bv=10 hv=12 slant=1 height=1 size=170
(lines 3)
=> Base: 10 × 10 = 100 cm². Each triangle: ½ × 10 × 13 = 65 cm². (SA2)
=> SA = 100 + 4 × 65 = 360 cm².
=> Use the slant height, 13 cm. It lies on the face. (Using 12 cm gives 340 cm², too small.)

### A soup can has a radius of 5 cm and a height of 12 cm. Find its SA.
@viz net type=cyl rv=5 hv=12 r="5 cm" h="12 cm" c="length = 2 × 3.14 × 5"
(lines 3)
=> Two circles: 2 × 3.14 × 5 × 5 = 157 cm². (SA3)
=> The rectangle: 2 × 3.14 × 5 = 31.4 cm long. 31.4 × 12 = 376.8 cm².
=> SA = 157 + 376.8 = 533.8 cm².

### A can is 7 cm across and 11 cm tall. Sam cuts its label 7 cm long and 11 cm tall. Fix his mistake. Find the label's area.
@viz saunroll rv=3.5 hv=11 r="d = 7 cm" h="11 cm" c="length = ?" inside="label" diameter=1 size=280
(lines 3)
=> The label wraps around the can. Its length is the circumference, not the diameter. (SA3)
=> Length = 3.14 × 7 = 21.98 cm. Area = 21.98 × 11 = 241.78, about 241.8 cm².
=> Targets the "rectangle as long as the diameter" mix-up.

### Draw the top, front and right side views of this building.
@viz blocks heights="2,1,1;1,0,0" views=blank
(work 4)
=> Top: back row 3 squares, front row 1 square on the left. (SA4)
=> Front: columns 2, 1, 1 tall. Right side: front 1 tall, back 2 tall.

### Jo looks at this building from the front. She sees 3 squares. She says it has 3 cubes. Is she right?
@viz blocks heights="1,2;0,1" views=show
(lines 2)
=> No. It has 4 cubes. The front cube on the right hides a cube behind it. (SA4)
=> A view shows only the cubes you can see. Targets the "a view shows the hidden cubes" mix-up.

## Challenge

### A tent's triangle ends have a base of 3 m, slanted sides of 2.5 m and a height of 2 m. The tent is 4 m long. How much fabric does it need with no floor? With a floor?
@viz satnet av=2.5 bv=3 cv=2.5 lv=4 la="2.5 m" lb="3 m" lc="2.5 m" l="4 m" th="2 m" size=260
(lines 3)
=> Ends: 2 × ½ × 3 × 2 = 6 m². Sloped sides: 2 × 2.5 × 4 = 20 m². (SA2)
=> No floor: 6 + 20 = 26 m². With a floor (3 × 4 = 12 m²): 38 m².

### A shed is 4 m long, 3 m wide and 2.5 m tall. Paint covers the 4 outside walls. The door, 1 m by 2 m, is not painted. One can of paint covers 10 m². How many cans are needed?
(lines 3)
=> Walls: 2 × (4 × 2.5) + 2 × (3 × 2.5) = 20 + 15 = 35 m². (SA2)
=> Minus the door: 35 − 2 = 33 m². 33 ÷ 10 = 3.3, so buy 4 cans.

### A gazebo roof is a square-based pyramid. The base is 5 m by 5 m. The slant height is 4 m. Shingles cost $12 per m². Find the cost.
@viz sasolid kind=pyr b="5 m" s="s = 4 m" bv=5 hv=3 slant=1 fill=earth size=160
(lines 3)
=> Roof only, no base: 4 × ½ × 5 × 4 = 40 m². (SA2)
=> Cost: 40 × $12 = $480.

### A pyramid has a rectangle base 10 cm by 8 cm. The slant height is 5 cm on the 10 cm edges and 5.8 cm on the 8 cm edges. Find its SA.
@viz sapnet bv=10 wv=8 sv=5 s2v=5.8 b="10 cm" w="8 cm" s="5 cm" s2="5.8 cm" size=250
(lines 3)
=> Base: 10 × 8 = 80 cm². Triangles on the 10 cm edges: 2 × ½ × 10 × 5 = 50 cm². (SA2)
=> Triangles on the 8 cm edges: 2 × ½ × 8 × 5.8 = 46.4 cm². SA = 80 + 50 + 46.4 = 176.4 cm².

### Box A is a cube 10 cm on each edge. Box B is 20 cm by 5 cm by 10 cm. Both hold 1000 cm³. Do they need the same amount of cardboard?
(lines 3)
=> No. Same volume, different SA. Cube: 6 × 100 = 600 cm². (SA2)
=> Box B: 2 × (100 + 50 + 200) = 700 cm². B needs 100 cm² more. Targets the SA–volume mix-up.

### A grain bin is 10 m across and 8 m tall. It has a flat roof. The floor is concrete and is not covered. How much steel covers the sides and the roof?
@viz solid kind=cyl r="d = 10 m" h="h = 8 m" rv=5 hv=8 diameter=1 fill=cold size=130
(lines 3)
=> Sides: 3.14 × 10 × 8 = 251.2 m². Roof: 3.14 × 5 × 5 = 78.5 m². (SA3)
=> Steel: 251.2 + 78.5 = 329.7 m².

### A can's label is a rectangle 31.4 cm long and 8 cm tall. Find the can's radius. Then find the can's total SA.
(lines 3)
=> 31.4 is the circumference. d = 31.4 ÷ 3.14 = 10 cm, so r = 5 cm. (SA3)
=> Circles: 2 × 3.14 × 25 = 157 cm². Label: 31.4 × 8 = 251.2 cm². SA = 408.2 cm².

### Build this building from its views. How many cubes? Then say which 2-D model a builder needs for exact plans, and why.
@viz blocks heights="1,2,1;0,1,0" object=key views=show
(lines 3)
=> Back row 1, 2, 1 and one cube in front of the middle: 5 cubes. (SA4)
=> An orthographic drawing. Each view is flat and shows exact sizes.
