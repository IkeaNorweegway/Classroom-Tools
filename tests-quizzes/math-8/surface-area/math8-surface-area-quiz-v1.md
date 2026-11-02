---
title: Surface Area
topic: surface-area
strand: measurement-geometry
---
<!-- Gate: outcome map complete. LOs covered: SA1 (outcome 8M2: polyhedrons vs. non-polyhedrons; predict a solid
     from its net; match net faces to faces; cube-net examples and non-examples), SA2 (outcome 8M2: surface area of
     rectangular and triangular prisms and square-based pyramids from given slant heights, in square units).
     Every item maps to a specific LO. Marks: 22. π not needed.
     Given at the start of Lesson 3, before cylinders (SA3). Calculators allowed. -->

### [SA1 · 2] Circle the polyhedrons: cube, cone, square-based pyramid, sphere, triangular prism. Why is a cone not a polyhedron?
(lines 2)
=> Cube, square-based pyramid, triangular prism (1 mark).
=> A cone has a curved surface. A polyhedron has only flat polygon faces (1 mark).

### [SA1 · 2] Name the solid this net folds into. How many faces does it have?
@viz sapnet bv=4 sv=5 size=180
(lines 1)
=> A square-based pyramid (1 mark). 5 faces (1 mark).

### [SA1 · 2] Which pattern folds into a cube: A or B?
@viz sacube cells="1,0;0,1;1,1;2,1;3,1;2,2" label="A"
@viz sacube cells="1,0;2,0;0,1;1,1;2,1;1,2" label="B"
(lines 1)
=> A folds into a cube (1 mark). B does not: it has a 2 by 2 square, so two squares overlap (1 mark).

### [SA1 · 2] This net folds into a cube. Which face is across from A? Which face is across from E?
@viz sacube cells="0,1;1,1;2,1;3,1;2,0;2,2" letters="A,B,C,D,E,F" unit=30
(lines 1)
=> C is across from A (1 mark). F is across from E (1 mark).

### [SA2 · 3] A box is 8 cm long, 5 cm wide and 4 cm tall. Find its surface area.
@viz solid kind=box l="8 cm" w="5 cm" h="4 cm" lv=8 wv=5 hv=4 size=150
(lines 3)
=> Faces: 8 × 4 = 32, 5 × 4 = 20, 8 × 5 = 40 (1 mark).
=> Two of each: 2 × (32 + 20 + 40) = 184 (1 mark). SA = 184 cm² (1 mark, with units).

### [SA2 · 3] A Toblerone-style box has triangle ends with sides of 6 cm and a height of 5.2 cm. It is 10 cm long. Find its SA.
@viz satnet av=6 bv=6 cv=6 lv=10 lb="6 cm" l="10 cm" th="5.2 cm" size=240
(lines 3)
=> Triangles: 2 × ½ × 6 × 5.2 = 31.2 cm² (1 mark).
=> Rectangles: 3 × 6 × 10 = 180 cm² (1 mark).
=> SA = 31.2 + 180 = 211.2 cm² (1 mark).

### [SA2 · 3] A square-based pyramid has a base 8 cm on each side. Its height is 3 cm. Its slant height is 5 cm. Find its SA.
@viz sasolid kind=pyr b="8 cm" s="s = 5 cm" h="h = 3 cm" bv=8 hv=4.5 slant=1 height=1 size=220
(lines 3)
=> Base: 8 × 8 = 64 cm² (1 mark).
=> Each triangle uses the slant height: ½ × 8 × 5 = 20 cm². Four: 80 cm² (1 mark).
=> SA = 64 + 80 = 144 cm² (1 mark). Using h = 3 cm (SA = 112 cm²) earns the base mark only.

### [SA2 · 2] A gazebo has a pyramid roof. The base is 6 m by 6 m. The slant height is 5 m. How much area do the shingles cover?
(lines 2)
=> Only the 4 triangles, no base (1 mark).
=> 4 × ½ × 6 × 5 = 60 m² (1 mark).

### [SA2 · 3] Explain your thinking. Leo says a cube 2 cm on each edge has a surface area of 8 cm². Is he right? Explain, and find the correct SA.
(lines 3)
=> No. 2 × 2 × 2 = 8 is the volume, 8 cm³ (1 mark).
=> SA covers the outside: 6 faces of 2 × 2 = 4 cm² (1 mark). SA = 24 cm² (1 mark).
