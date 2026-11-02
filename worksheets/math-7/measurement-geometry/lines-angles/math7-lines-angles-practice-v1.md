---
title: Lines, Angles & Congruence
topic: lines-angles
strand: measurement-geometry
---
## Core

### Name each object. Use the right word and letters.
@viz lines items="ray:F,G;line:H,J;segment:K,L"
(lines 2)
=> Ray FG: F is the endpoint, so it goes first. (LA1)
=> Line HJ (or line JH): it has two arrowheads, so no ends. Segment KL (or LK): two endpoints.
=> Targets the "a ray goes both ways" mix-up: the ray has only one arrowhead.

### Give three names for this angle.
@viz lines items="angle:J,K,L,70" notitle=1
(lines 1)
=> ∠JKL, ∠LKJ and ∠K. The vertex K goes in the middle. (LA1)

### Which shapes are polygons? Say why.
@viz polygon pts="0,0;4,0;4,3;0,3" cap="Shape A" pts2="0,0;4,0;4,3;1,3;1,1.5" open2=1 cap2="Shape B" unit=24
(lines 2)
=> Shape A is a polygon. It is closed, and its 4 sides meet only at their ends. (LA1)
=> Shape B is not a polygon. It is not closed: it has a gap.

### This is a window pane. Write two parallel pairs and one perpendicular pair with symbols.
@viz polygon pts="0,0;4,0;4,5;0,5" names="W,X,Y,Z" right="1,2,3,4" par="1,2,1,2" unit=26
(lines 2)
=> WX ∥ ZY (one arrowhead each). WZ ∥ XY (two arrowheads each). (LA2)
=> Any two sides that meet at a small square, like WX ⊥ XY.

### Kai says AB ∥ DC because they look parallel. Is he right?
@viz polygon pts="0,0;6,0;6,2.8;0,3.1" names="A,B,C,D" right="1,2" sides=";2.8 cm;;3.1 cm" unit=28
(lines 2)
=> No. There are no arrowheads. The gap is 3.1 cm on one end and 2.8 cm on the other. (LA2)
=> The lines get closer, so they will meet. Targets the "lines that look parallel are parallel" mix-up.

### Two lines cross. Find the other three angles.
@viz angles kind=intersect a=35 labels="35°;[[145°]];[[35°]];[[145°]]"
(lines 2)
=> The angle beside 35° on a line: 180° − 35° = 145°. (LA3)
=> The angle opposite 35° is 35°. The angle opposite 145° is 145°.

### Ava says ∠3 = 120° because opposite angles add to 180°. Fix her mistake.
@viz angles kind=intersect a=60 labels="60°;2;3;4" highlight="1,3"
(lines 2)
=> ∠3 is opposite the 60° angle, so ∠3 = 60°. Opposite angles are equal. (LA3)
=> ∠2 and ∠4 sit beside 60° on a line. They are 120°. Targets the "opposite angles add to 180°" mix-up.

### Two avenues are parallel: m ∥ n. A diagonal road t crosses them. Find ∠6, ∠1 and ∠5.
@viz angles kind=transversal a=65 labels="1;65°;3;4;5;6;7;8" highlight="2,6" names="m,n,t"
(lines 3)
=> ∠6 corresponds to ∠2. The avenues are parallel, so ∠6 = 65°. (LA3)
=> ∠1 is beside ∠2 on line m: 180° − 65° = 115°.
=> ∠5 corresponds to ∠1, so ∠5 = 115°.

### Are the rails m and n parallel? Use ∠2 and ∠6.
@viz angles kind=transversal a=70 parallel=0 marks=0 labels="1;70°;3;4;5;65°;7;8" highlight="2,6" names="m,n,t"
(lines 2)
=> No. ∠2 and ∠6 are corresponding angles, but 70° ≠ 65°. (LA3)
=> Corresponding angles are equal only when lines are parallel. Targets the "corresponding angles are always equal" mix-up.

### △ABC ≅ △DEF. Write the three pairs of matching sides and the three pairs of matching angles.
(lines 3)
=> Sides: AB ≅ DE, BC ≅ EF, CA ≅ FD. (LA4)
=> Angles: ∠A ≅ ∠D, ∠B ≅ ∠E, ∠C ≅ ∠F.

### Two quilt pieces are congruent: ABCD ≅ PQRS. Find QR, SP, ∠P and ∠S.
@viz polygon pts="0,0;6,0;6,4;3,4" names="A,B,C,D" sides="6 cm;4 cm;3 cm;5 cm" angles="53°;;;127°" right="2,3" pts2="0,0;-6,0;-6,4;-3,4" names2="P,Q,R,S" sides2=";[[4 cm]];;[[5 cm]]" angles2="[[53°]];;;[[127°]]" right2="2,3" unit=22
(lines 2)
=> QR matches BC: 4 cm. SP matches DA: 5 cm. (LA4)
=> ∠P matches ∠A: 53°. ∠S matches ∠D: 127°.

### Omar writes △ABC ≅ △XYZ. Use the marks to fix his statement.
@viz polygon pts="0,0;5,0;2,3" names="A,B,C" ticks="1,2,3" arcs="1,2,3" pts2="0,0;5,0;3,3" names2="Z,Y,X" ticks2="1,3,2" arcs2="2,1,3" unit=24
(lines 2)
=> Match by arcs: A (one arc) ↔ Y, B (two arcs) ↔ Z, C (three arcs) ↔ X. (LA4)
=> △ABC ≅ △YZX. Targets the "letter order doesn't matter" mix-up.

## Challenge

### Points A, B and C sit on one line, in that order. Is ray AB the same as ray AC? Is ray BA the same as ray BC?
(lines 3)
=> Ray AB and ray AC are the same. Both start at A and go toward B and C. (LA1)
=> Ray BA and ray BC are not the same. Both start at B, but they go opposite ways.

### Two lines cross. One angle is 3 times the angle beside it. Find all four angles.
@viz angles kind=intersect a=45 labels="x;3x;;"
(lines 3)
=> Angles beside each other on a line add to 180°: x + 3x = 180. (LA3)
=> 4x = 180, so x = 45. The angles are 45°, 135°, 45° and 135°.

### m ∥ n. ∠1 = (2x + 10)° and ∠5 = 70°. Find x.
@viz angles kind=transversal a=110 labels="(2x + 10)°;2;3;4;70°;6;7;8" names="m,n,t"
(lines 3)
=> ∠1 and ∠5 are corresponding, and m ∥ n. So 2x + 10 = 70. (LA3)
=> 2x = 60, so x = 30. Check: 2(30) + 10 = 70.

### A diagonal road crosses three avenues. It makes 58° with the first avenue, 58° with the second and 61° with the third (all top right). Which avenues are parallel?
(lines 3)
=> The first and second avenues are parallel: their corresponding angles are both 58°. (LA3)
=> The third is not parallel to them: 61° ≠ 58°.

### All the trusses on a roof are congruent: △ABC ≅ △DEF. AB = 8 m, BC = 5 m and the perimeter of △ABC is 18 m. Find DF.
(lines 3)
=> CA = 18 − 8 − 5 = 5 m. (LA4)
=> DF matches CA, so DF = 5 m.

### Write the congruence statement. Start with △CAB.
@viz polygon pts="0,0;4,0;1,3" names="A,B,C" ticks="1,2,3" arcs="1,2,3" pts2="0,3;4,3;1,0" names2="K,L,M" ticks2="1,2,3" arcs2="1,2,3" unit=24
(lines 2)
=> Arcs and ticks match A ↔ K, B ↔ L and C ↔ M. (LA4)
=> △CAB ≅ △MKL. Keep the same match, in the new order.

### Zoe says the two squares are congruent because all their angles are 90°. Is she right?
@viz polygon pts="0,0;3,0;3,3;0,3" sides="3 cm;;;" right="1,2,3,4" pts2="0,0;4,0;4,4;0,4" sides2="4 cm;;;" right2="1,2,3,4" unit=22
(lines 2)
=> No. Congruent shapes need equal sides AND equal angles. (LA4)
=> The sides are 3 cm and 4 cm. Same shape, different size.
