---
title: Linear Functions
topic: linear-functions
strand: algebra
---
## Core

### Count the rise and the run. Find the slope.
@viz lfslope pts="1,1;4,3" rise="[[2]]" run="[[3]]" xmin=0 xmax=6 ymin=0 ymax=5
(lines 1)
=> Run: across from x = 1 to x = 4 is 3. Rise: up from y = 1 to y = 3 is 2. (LF1)
=> m = {rise/run} = {2/3}.

### Find the slope through (−3, 4) and (1, −4). Is it positive or negative?
(work 3)
=> m = {−4 − 4/1 − (−3)} = {−8/4} = −2. (LF1, LF2)
=> Negative. The line goes down to the right.

### Two ski runs at Sunshine Village are shown. Find each slope. Which run is steeper?
@viz lfhill kind=hill rv=1 runv=4 rise="200 m" run="800 m" title="Run A" rv2=2 runv2=4 rise2="300 m" run2="600 m" title2="Run B"
(lines 2)
=> Run A: {200/800} = {1/4}. Run B: {300/600} = {1/2}. (LF1)
=> {1/2} is bigger than {1/4}, so Run B is steeper.

### Jay says the slope of this line is {1/3}. Is he right? Explain.
@viz lfslope pts="0,0;2,6" names="A;B" rise="6" run="2" xmin=-1 xmax=4 ymin=-1 ymax=7
(lines 2)
=> No. He did run over rise. Rise 6 over run 2: m = {6/2} = 3. (LF1)
=> Targets the "slope is run over rise" mix-up.

### Write positive, negative, zero or undefined under each graph.
@viz lfkinds lines="0,-1;2,0;x=-1;-1/2,1" titles="[[zero]];[[positive]];[[undefined]];[[negative]]"
=> 1st: flat, zero. 2nd: up to the right, positive. 3rd: vertical, undefined. 4th: down to the right, negative. (LF2)

### Find the slope of each line. Explain how you know.
@viz lfgraph lines="0,4;x=-1" labels="A;B" lpos="0.93;0.93" points="1,4;3,4;-1,-2;-1,2" xmin=-3 xmax=5 ymin=-3 ymax=6
(lines 3)
=> A: (1, 4) and (3, 4). m = {4 − 4/3 − 1} = {0/2} = 0. A flat line has slope 0. (LF2)
=> B: (−1, −2) and (−1, 2). m = {4/0}. The run is 0. You can't divide by 0, so the slope is undefined.
=> Targets the "horizontal = undefined" mix-up.

### Which lines are parallel? Which are perpendicular?
Line 1: y = 3x + 1
Line 2: y = 3x − 5
Line 3: y = −{1/3}x + 2
(lines 2)
=> y = 3x + 1 and y = 3x − 5 are parallel: both have slope 3. (LF2)
=> y = −{1/3}x + 2 is perpendicular to both. Flip 3 to {1/3} and change the sign: −{1/3}.

### Find m and b for each line.
a) y = 5x − 2
b) y = −x + 7
c) y = 2 + 3x
(lines 3)
=> a) m = 5, b = −2. (LF3)
=> b) m = −1 (−x is −1x), b = 7.
=> c) m = 3, b = 2. The slope is the number times x, even when it comes second. Targets the "b is the slope" mix-up.

### Write the equation of the line.
@viz lfgraph lines="-1,2" points="0,2;3,-1" xmin=-2 xmax=5 ymin=-3 ymax=5
(lines 2)
=> The line crosses the y-axis at (0, 2), so b = 2. (LF3)
=> From (0, 2) to (3, −1): rise −3, run 3. m = {−3/3} = −1. So y = −x + 2.

### Graph y = {2/3}x − 1. Mark the y-intercept.
@viz lfgraph keylines="2/3,-1" keypoints="0,-1;3,1;-3,-3" xmin=-4 xmax=5 ymin=-4 ymax=4
=> Plot b first: (0, −1). (LF3)
=> m = {2/3}: right 3, up 2 to (3, 1). Left 3, down 2 to (−3, −3). Draw the line across the grid.

### Find the x-intercept and the y-intercept of y = −2x + 6. Write each as an ordered pair.
@viz lfgraph keylines="-2,6" keypoints="0,6;3,0" xmin=-2 xmax=5 ymin=-2 ymax=8
(work 3)
=> y-intercept: x = 0, so y = −2(0) + 6 = 6. The point is (0, 6). (LF4)
=> x-intercept: y = 0, so 0 = −2x + 6. 2x = 6 and x = 3. The point is (3, 0).

### A taxi in Edmonton charges $5 to start and $3 for each km.
a) Write the equation. b) What do m and b mean? c) Find the cost of a 6 km ride.
@viz lfgraph lines="seg:0,5,8,29" points="0,5" xmin=0 xmax=8 ymin=0 ymax=30 ystep=5 xlabel="km" ylabel="cost ($)"
(lines 3)
=> a) C = 3d + 5. (LF4)
=> b) m = 3: each km adds $3. b = 5: the $5 starting fee, paid before the taxi moves.
=> c) C = 3(6) + 5 = 18 + 5 = $23.

## Challenge

### Is each table linear or non-linear? Explain.
| x | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| y (A) | 10 | 7 | 4 | 1 |
| y (B) | 1 | 2 | 4 | 8 |

(lines 2)
=> A: linear. y goes down 3 each step, so m = −3. (LF2)
=> B: non-linear. y goes up 1, then 2, then 4. The change is not the same.

### A line has slope −{2/3}. It goes through (3, 1). Graph it. Write its equation.
@viz lfgraph keylines="-2/3,3" keypoints="3,1;0,3;6,-1" xmin=-2 xmax=7 ymin=-3 ymax=5
(lines 2)
=> From (3, 1), go left 3 and up 2 to (0, 3). So b = 3. (LF3)
=> y = −{2/3}x + 3. Check: −{2/3}(3) + 3 = −2 + 3 = 1. ✓

### Write the equation of the line through (−2, 1) and (2, 7).
(work 4)
=> m = {7 − 1/2 − (−2)} = {6/4} = {3/2}. (LF1, LF3)
=> Use (2, 7): 7 = {3/2}(2) + b, so 7 = 3 + b and b = 4. y = {3/2}x + 4.

### A rain barrel holds 90 L of water. It drains at 15 L each minute.
a) Write the equation. b) Find both intercepts. Say what each means. c) Give the domain and range.
@viz lfgraph keylines="seg:0,90,6,0" keypoints="0,90;6,0" xmin=0 xmax=8 ymin=0 ymax=100 ystep=10 yevery=20 xlabel="minutes" ylabel="water (L)"
(lines 4)
=> a) V = −15t + 90. (LF4)
=> b) (0, 90): 90 L at the start. (6, 0): 0 = −15t + 90 gives t = 6, so empty after 6 minutes.
=> c) Domain: 0 to 6 minutes. Range: 0 to 90 L.

### Write the equation of a line perpendicular to y = {2/5}x + 1 that crosses the y-axis at (0, −3).
(lines 2)
=> Flip {2/5} to {5/2} and change the sign: m = −{5/2}. (LF2, LF3)
=> b = −3, so y = −{5/2}x − 3.

### Phone plan A costs $30 a month plus $10 per GB. Plan B costs $10 a month plus $20 per GB.
a) Write both equations. b) When do they cost the same? c) Which is cheaper for 3 GB?
@viz lfgraph lines="10,30;20,10" labels="A;B" lpos="0.9;0.9" xmin=0 xmax=4 ymin=0 ymax=90 ystep=10 yevery=20 xlabel="GB" ylabel="cost ($)"
(lines 3)
=> a) A: C = 10g + 30. B: C = 20g + 10. (LF4)
=> b) 10g + 30 = 20g + 10, so 20 = 10g and g = 2. Both cost $50 at 2 GB.
=> c) A: 10(3) + 30 = $60. B: 20(3) + 10 = $70. Plan A is cheaper.

### Make up a real situation with slope 20 and b = 50. Explain what m and b mean. Give a sensible domain and range.
(lines 3)
=> Answers vary. A savings account starts with $50. You add $20 each week. (LF4)
=> m = 20: $20 more each week. b = 50: the $50 at the start. Domain: 0 to 10 weeks. Range: $50 to $250.

### Ana says y = −3 has an undefined slope and no y-intercept. Find her two mistakes.
(lines 3)
=> y = −3 is a flat line. Its rise is 0, so its slope is 0, not undefined. (LF2, LF4)
=> It crosses the y-axis at (0, −3). It has no x-intercept instead. Targets the "horizontal = undefined" mix-up.
