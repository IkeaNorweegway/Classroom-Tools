---
title: Linear Functions
topic: linear-functions
strand: algebra
---
<!-- Gate: one ticket per cluster. Every question maps to a specific LO (LF1–LF4: all 8F1). -->

## Section 1: Slope
Target: I can find the slope of a line as rise over run. (LF1)
### Count the rise and the run. Find the slope.
@viz lfslope pts="1,2;5,5" rise="[[3]]" run="[[4]]" xmin=0 xmax=6 ymin=0 ymax=6
(lines 1)
=> Run 4, rise 3. m = {3/4}.
### Find the slope through (−1, 3) and (2, 9).
(work 2)
=> m = {9 − 3/2 − (−1)} = {6/3} = 2.
### A ramp rises 2 m over a run of 10 m. Sam says its slope is 5. Explain how you know he is wrong.
(lines 2)
=> He did run over rise. Slope = {rise/run} = {2/10} = {1/5}.

## Section 2: Kinds of slope
Target: I can tell if a slope is positive, negative, zero or undefined. I can compare parallel and perpendicular slopes. (LF2)
### Write positive, negative, zero or undefined under each graph.
@viz lfkinds lines="-2,0;x=2;1/2,0;0,-2" titles="[[negative]];[[undefined]];[[positive]];[[zero]]"
=> Negative, undefined, positive, zero.
### Line A has slope {3/4}. Give the slope of a parallel line and of a perpendicular line.
(lines 1)
=> Parallel: {3/4}. Perpendicular: −{4/3}.
### Is the slope of y = 5 zero or undefined? Explain how you know.
(lines 2)
=> Zero. y = 5 is flat: the rise is 0, and {0/run} = 0. Only a vertical line (run 0) is undefined.

## Section 3: y = mx + b
Target: I can use y = mx + b to find the slope and y-intercept, write an equation and graph it. (LF3)
### Find m and b. y = 6 − 2x
(lines 1)
=> m = −2, b = 6.
### Write the equation of the line.
@viz lfgraph lines="3,-2" points="0,-2;1,1" xmin=-2 xmax=4 ymin=-4 ymax=5
(lines 1)
=> b = −2. Rise 3, run 1, so m = 3. y = 3x − 2.
### Graph y = −x + 3. Explain how you know where to start.
@viz lfgraph keylines="-1,3" keypoints="0,3;1,2;3,0" xmin=-2 xmax=5 ymin=-2 ymax=5
(lines 1)
=> Start at b: (0, 3) on the y-axis. Then right 1, down 1 each step.

## Section 4: Intercepts, rate of change and special lines
Target: I can find intercepts, graph horizontal and vertical lines, and explain slope and b in a real situation. (LF4)
### Find both intercepts of y = 4x − 8. Write them as ordered pairs.
(work 2)
=> y-intercept: (0, −8). x-intercept: 0 = 4x − 8, x = 2, so (2, 0).
### A babysitter earns $15 an hour plus a $5 tip each night. Write the equation. What does the 15 mean?
@viz lfgraph keylines="seg:0,5,4,65" keypoints="0,5" xmin=0 xmax=4 ymin=0 ymax=70 ystep=10 xlabel="hours" ylabel="pay ($)"
(lines 2)
=> P = 15h + 5. The 15 is the slope: $15 more for each hour.
### Write the equations of a horizontal line and a vertical line through (2, −3). Explain how you know.
(lines 2)
=> Horizontal: y = −3. Vertical: x = 2. Every point on the flat line has y = −3; every point on the vertical line has x = 2.
