---
title: Proportional Reasoning
topic: proportional-reasoning
strand: number
---
## Core

### Jen has 21 shells. Ty has 7 shells. a) Jen has how many times as many shells as Ty? b) What fraction of Jen's shells does Ty have?
@viz prtimes rows="Ty:1;Jen:3" value="7" down="× [[3]]" up="× [[1/3]]"
(lines 2)
=> a) 21 ÷ 7 = 3. Jen has 3 times as many. (PR1)
=> b) 7 ÷ 21 = {7/21} = {1/3}. Ty has {1/3} as many as Jen.

### Max says 20 is 15 times as many as 5, because 20 − 5 = 15. Look at the blocks. Fix his mistake.
@viz prtimes rows="Five:1;Twenty:4" value="5" total="5;20"
(lines 2)
=> 15 is how many MORE (subtracting). 20 ÷ 5 = 4, so 20 is 4 times as many as 5. (PR1)
=> Targets the Grade 7 "add or subtract instead of multiply" mix-up.

### A farm has 8 ha of barley and 20 ha of canola. Compare them both ways.
@viz prtimes rows="Barley:1;Canola:2.5" value="8 ha" total="8 ha;20 ha" down="× [[2.5]]" up="× [[0.4]]"
(lines 2)
=> Canola compared to barley: 20 ÷ 8 = 2.5. There is 2.5 times as much canola. (PR1)
=> Barley compared to canola: 8 ÷ 20 = 0.4 = {2/5}. The barley is 0.4 times the canola.

### Ali saved $40. Bea saved 0.75 times as much. How much did Bea save?
(lines 1)
=> 0.75 × 40 = 30. Bea saved $30. (PR1)
=> Check: 0.75 is less than 1, so Bea saved less than Ali. ✓

### Find k for each ratio. a) 4 : 10 b) 10 : 4 c) 6 : 9
@viz prk top="4" bottom="10" k="× [[2.5]]"
(lines 2)
=> a) k = 10 ÷ 4 = 2.5 (PR2)
=> b) k = 4 ÷ 10 = 0.4
=> c) k = 9 ÷ 6 = 1.5

### Kim says that for tea : milk = 6 : 3, the constant of proportionality is k = 2. Is she right?
@viz prk top="6,12" bottom="3,6" toplabel="tea (cups)" bottomlabel="milk (cups)" k="× [[0.5]]"
(lines 2)
=> No. k = second term ÷ first term = 3 ÷ 6 = 0.5. Milk = 0.5 × tea. (PR2)
=> Check: 0.5 × 12 = 6 ✓. Targets "k is always the bigger number ÷ the smaller".

### Which ratios have the same k as 3 : 4.5? 4 : 6, 5 : 8, 8 : 12
@viz prk top="3,4,5,8" bottom="4.5,6,8,12" k="× ?"
(lines 2)
=> 3 : 4.5 has k = 4.5 ÷ 3 = 1.5. (PR2)
=> 4 : 6: k = 1.5 ✓. 5 : 8: k = 1.6 ✗. 8 : 12: k = 1.5 ✓.
=> 4 : 6 and 8 : 12 have the same k. 5 : 8 does not.

### Lee pays $36.25 for 25 L of gas. a) Find the unit rate. b) What do 60 L cost?
(work 2)
=> a) k = 36.25 ÷ 25 = 1.45. The unit rate is $1.45 per litre. (PR2)
=> b) b = k × a = 1.45 × 60 = 87. 60 L cost $87.00. (PR3)

### k = 0.6. Fill in the ratio table.
@viz prk top="5,10,15,2" bottom="[[3]],[[6]],[[9]],[[1.2]]" toplabel="first (a)" bottomlabel="second (b)" k="× 0.6"
(lines 1)
=> b = 0.6 × a: 0.6 × 5 = 3, 0.6 × 10 = 6, 0.6 × 15 = 9, 0.6 × 2 = 1.2. (PR3)

### A map has the scale 1 cm : 5 km. A lake is 45 km long. Omar says it is 45 × 5 = 225 cm on the map. Is he right?
@viz dnl top="0 cm,1 cm,[[9 cm]]" bottom="0 km,5 km,45 km" toplabel="map" bottomlabel="real"
(lines 2)
=> No. 45 km is the second term, so divide by k: 45 ÷ 5 = 9 cm. (PR3)
=> Check: 5 × 9 = 45 ✓. Targets "multiply by k even when you know the second term".

### Soup for 4 people uses 6 cups of broth. Mo says 10 people need 12 cups, because 6 more people need 6 more cups. Find the right amount.
@viz prk top="4,10" bottom="6,[[15]]" toplabel="people" bottomlabel="broth (cups)" k="× [[1.5]]" one=1
(lines 2)
=> k = 6 ÷ 4 = 1.5 cups for each person. b = 1.5 × 10 = 15 cups. (PR3)
=> Mo added. Adding does not keep k the same: 12 ÷ 10 = 1.2. Targets the Grade 7 "add the same number" mix-up.

### 4 workers paint a fence in 6 h. a) How long do 8 workers take? b) How long do 3 workers take?
@viz prwork cases="4,6;8,3" rowlabel="workers" collabel="h" labels="4 × 6 = 24;8 × [[3]] = 24"
(work 2)
=> Inverse proportion: workers × hours = 4 × 6 = 24 worker-hours. (PR4)
=> a) 24 ÷ 8 = 3 h. b) 24 ÷ 3 = 8 h.
=> Targets "more workers, more hours": doubling the workers halves the time.

## Challenge

### Ella earns the same pay for every hour. She earns $32 in 2 h and $64 in 4 h. a) Find k. b) What does she earn in 7.5 h? c) Why does the line go through (0, 0)?
@viz coord xmin=0 xmax=8 ymin=0 ymax=140 xstep=1 ystep=20 yevery=40 xlabel="time (h)" ylabel="pay ($)" points="0,0;2,32;4,64" line=1
(work 2)
=> a) k = 32 ÷ 2 = 16. She earns $16 per hour. On the graph, the slope is 16. (PR4)
=> b) 16 × 7.5 = $120.
=> c) 0 h of work earns $0. Direct proportion always goes through (0, 0).

### Is this table direct, inverse or neither? Explain.
| x | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| y | 5 | 7 | 9 | 11 |
@viz coord xmin=0 xmax=5 ymin=0 ymax=12 xstep=1 ystep=1 yevery=2 xlabel="x" ylabel="y" points="1,5;2,7;3,9;4,11" line=1
(lines 3)
=> Neither. y ÷ x: 5, 3.5, 3, 2.75 (not the same, so not direct). (PR4)
=> x × y: 5, 14, 27, 44 (not the same, so not inverse).
=> The points make a straight line, but it does not go through (0, 0). It would cross the y-axis at 3.

### Edmonton to Red Deer is about 150 km. Fill in the table. Is speed and time direct or inverse?
| Speed (km/h) | 100 | 75 | 60 | 50 |
|---|---|---|---|---|
| Time (h) | ___ | ___ | ___ | ___ |
@viz curve xmin=0 xmax=110 ymin=0 ymax=4 xstep=10 ystep=0.5 xevery=20 yevery=1 xlabel="speed (km/h)" ylabel="time (h)" path="50,3;60,2.5;75,2;100,1.5" smooth=1 points="50,3;60,2.5;75,2;100,1.5"
(lines 2)
=> speed × time = 150. Times: 1.5 h, 2 h, 2.5 h, 3 h. (PR4)
=> Inverse: faster speed, less time. k = 150.

### Pretend $1 Canadian buys 0.6 euros. (This rate is made up.) a) Change $250 Canadian to euros. b) A shirt costs 42 euros. What is that in Canadian dollars?
(work 2)
=> a) b = 0.6 × 250 = 150 euros. (PR3)
=> b) a = b ÷ k = 42 ÷ 0.6 = 70. That is $70 Canadian.

### Pia has 2.5 times as many cards as Tom. Together they have 49 cards. How many does each have?
@viz prtimes rows="Tom:1;Pia:2.5" total="?;?"
(work 2)
=> Tom is 1 block. Pia is 2.5 blocks. That is 3.5 blocks in all. (PR1)
=> 49 ÷ 3.5 = 14. Tom has 14. Pia has 2.5 × 14 = 35. Check: 14 + 35 = 49 ✓.

### For the ratio a : b, k = 0.8. a) Find k for b : a. b) If a = 15, find b.
(lines 2)
=> a) Going back undoes × 0.8: 1 ÷ 0.8 = 1.25. (PR2)
=> b) b = 0.8 × 15 = 12. Check with part a: 1.25 × 12 = 15 ✓.

### 3 L of paint covers 30 m². A room has 4 walls. Each wall is 3 m by 2.5 m. The room needs 2 coats. Paint comes in 4 L cans. How many cans should Raj buy?
(work 3)
=> k = 30 ÷ 3 = 10 m² per litre. (PR3)
=> One wall: 3 × 2.5 = 7.5 m². Four walls: 30 m². Two coats: 60 m².
=> Paint: 60 ÷ 10 = 6 L. 6 L needs 2 cans of 4 L (8 L).

### A $90 gift is shared equally. Jay says more friends means each person pays more. Use a table for 3, 6 and 9 friends to show he is wrong.
(lines 3)
=> 3 friends: $30 each. 6 friends: $15 each. 9 friends: $10 each. (PR4)
=> friends × cost each = 90 every time. This is inverse: more friends, smaller share.
