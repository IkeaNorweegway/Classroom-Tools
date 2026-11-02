---
title: Functions
topic: functions
strand: algebra
---
<!-- Gate: one ticket per cluster. Every question maps to a specific LO (FN1–FN4: all 7F1). -->

## Section 1: Relations and functions
Target: I can tell if a relation is a function. (FN1)
### Is this relation a function?
@viz mapping in="1,2,3" out="4,6,8" arrows="1>4;2>6;2>8;3>8"
(lines 1)
=> No. The input 2 has two outputs, 6 and 8.
### A bus ride costs $5. Find the output for 3 rides. Name the dependent variable.
@viz machine in="3" rule="× 5" out="[[15]]" inlabel="rides" outlabel="cost ($)"
(lines 1)
=> 3 × 5 = $15. The dependent variable is the cost. It depends on the rides.
### Is (2, 6), (4, 6) a function? Explain how you know.
(lines 2)
=> Yes. Each input has one output. Two inputs can share the output 6.

## Section 2: Graphing a function from a table
Target: I can graph a function from a table. I can choose dots or a line. (FN2)
### A bus ride costs $3. Fill in the table. Graph it.
| Rides | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Cost ($) | [[0]] | [[3]] | [[6]] | [[9]] |

@viz coord xmin=0 xmax=4 ymin=0 ymax=12 ystep=3 keypoints="0,0;1,3;2,6;3,9" xlabel="rides" ylabel="cost ($)" width=260
=> 0, 3, 6, 9. Plot (0, 0), (1, 3), (2, 6), (3, 9) as dots.
### Should you join the dots on this graph? Explain how you know.
(lines 2)
=> No. You can't take part of a ride. Rides are counted, so the graph is discrete.

## Section 3: Domain and range
Target: I can describe the domain and range of a function in words. (FN3)
### Find the domain and range of (1, 4), (3, 4), (5, 8).
(lines 1)
=> Domain: 1, 3 and 5. Range: 4 and 8.
### Find the domain and range of the trough graph.
@viz coord xmin=0 xmax=5 ymin=0 ymax=100 ystep=20 points="0,0;4,80" line=1 xlabel="minutes" ylabel="water (L)" width=280
(lines 1)
=> Domain: any time from 0 to 4 minutes. Range: any amount from 0 to 80 L.
### Kai says the range of the trough graph is 0 to 4. Explain how you know he is wrong.
(lines 2)
=> 0 to 4 is the time, the input. That is the domain. The range is the water: 0 to 80 L.

## Section 4: Real-world limits and the vertical line test
Target: I can find limits on the domain and range. I can use the vertical line test. (FN4)
### A van seats 12. Each rider pays $2. Find the domain and range.
@viz people n=12 cols=12 title="The van seats 12"
(lines 2)
=> Domain: whole numbers from 0 to 12. Range: 0, 2, 4 and so on, up to $24.
### Is this graph a function? Explain how you know.
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 path="6,1;3,2;2,4;3,6;6,7" vline=3 width=200
(lines 2)
=> No. The dashed vertical line hits the graph twice, at (3, 2) and (3, 6). One input has two outputs.
