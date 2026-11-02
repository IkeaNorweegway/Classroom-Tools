---
title: Linear Functions
topic: linear-functions
strand: algebra
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "Slope is run over rise" (LF1). "A horizontal line has no slope / undefined slope" (LF2).
     "In y = mx + b, b is the slope" (LF3). "The x-intercept is where x = 0" (LF4, not in the course list; added
     because students swap the two intercepts as soon as both appear).
     Section order: slope as steepness, rise over run and the formula first (LF1), because every later idea uses m.
     Then the four kinds of slope, parallel and perpendicular slopes, and linear vs non-linear graphs (LF2),
     since the sign of m and "same slope" are needed to read y = mx + b. Then y = mx + b: what m and b do,
     writing the equation from a graph, graphing from an equation or a slope and a point (LF3).
     Last, intercepts as ordered pairs, horizontal and vertical lines, and rate of change in context (LF4),
     which needs slope (LF1–LF2) and b (LF3). Outcome 8F1. Builds on Grade 7 functions (input/output,
     discrete vs continuous, domain and range). No function notation f(x) (Grade 9). Integer points in the slope formula.
     Perpendicular slopes: compare only, no proof. -->

## Pre-Knowledge Check
1. Start at (0, 0). Go 3 right and 2 down. Write the point.
2. Find −6 ÷ 2.
3. Write {4/6} in lowest terms.
4. Find 2x + 1 when x = 3.
5. Is (1, 4), (2, 4), (3, 4) a function?
6. The table goes x: 0, 1, 2, 3 and y: 5, 8, 11, 14. How much is added to y each time?

## Section 1: Slope
Learning target: I can find the slope of a line as rise over run.

### Vocabulary
- slope :: how steep a line is, and which way it goes :: a slope of 2 is steeper than a slope of {1/2}
- rise :: how far up (or down) you go between two points :: from y = 2 to y = 5 is a rise of 3
- run :: how far across you go between two points :: from x = 1 to x = 3 is a run of 2
- steepness :: how fast a line climbs as you move right :: an expert ski run is steeper than a bunny hill

#### Steep or gentle?
Picture two ski runs at Lake Louise. Which one is steeper?
@viz lfhill kind=hill rv=1 runv=5 rise="100 m" run="500 m" title="Bunny hill" rv2=3 runv2=4 rise2="300 m" run2="400 m" title2="Expert run"
The bunny hill drops 100 m over 500 m across. The expert run drops 300 m over 400 m across.
Steepness compares the **rise** to the **run**. That comparison is the **slope**.

::: key Slope
**slope = {rise/run}**. Rise is up or down. Run is across.
Bunny hill: {100/500} = {1/5}. Expert run: {300/400} = {3/4}.
{3/4} is bigger than {1/5}. A bigger slope means a steeper line.
:::

#### Slope on a grid
Pick two points on a line. Count across to the second point. That is the run. Then count up. That is the rise.
@viz lfslope pts="1,2;3,5" names="A;B" rise="3" run="2" xmin=-1 xmax=6 ymin=-1 ymax=7 caption="Across 2, then up 3. Slope = 3/2."
From A to B, the run is 2 and the rise is 3. The slope is {3/2}.

#### The slope formula
Counting works on a grid. Subtracting works for any two points.
The points are (x₁, y₁) and (x₂, y₂). The little 1 and 2 just name the first and second point.

::: key Slope formula
**m = {y₂ − y₁/x₂ − x₁}**. The letter **m** stands for slope.
Top: change in y (the rise). Bottom: change in x (the run).
:::
@viz lfslope pts="1,1;4,7" coords=1 rise="7 − 1 = 6" run="4 − 1 = 3" xmin=-1 xmax=6 ymin=-1 ymax=8 caption="The rise is the change in y. The run is the change in x."

::: example Worked Example 1 — Slope from two points
Find the slope through (1, 1) and (4, 7).
@viz lfslope pts="1,1;4,7" names="P;Q" rise="6" run="3" xmin=0 xmax=5 ymin=0 ymax=8
Step 1: Rise = 7 − 1 = 6.
Step 2: Run = 4 − 1 = 3.
Step 3: m = {6/3} = [[2]].
Check: Count on the grid. From P, go across 3 and up 6. You land on Q.
:::

::: example Worked Example 2 — A wheelchair ramp
A ramp at a school in Red Deer rises 1 m. It runs 12 m across. Find its slope.
@viz lfhill kind=ramp rv=1 runv=12 rise="rise 1 m" run="run 12 m" title="Wheelchair ramp"
Step 1: Slope = {rise/run}.
Step 2: Slope = {1/12}.
Step 3: The ramp climbs 1 m for every [[12]] m across. That is gentle enough for a wheelchair.
:::

::: example Worked Example 3 — Points on both sides of 0
Find the slope through (−2, 1) and (2, 3).
@viz lfslope pts="-2,1;2,3" coords=1 rise="2" run="4" xmin=-4 xmax=4 ymin=-1 ymax=5
Step 1: Rise = 3 − 1 = 2.
Step 2: Run = 2 − (−2) = 4.
Step 3: m = {2/4} = [[{1/2}]].
:::
::: explain
Leo used (2, 3) as the first point. He got {1 − 3/−2 − 2}. Is his slope the same? Why?
(lines 2)
=> Yes. {−2/−4} = {1/2}. Both the top and the bottom change sign, so the slope stays the same.
:::

::: misconception
WRONG: "Slope is run over rise. From A to B the slope is {2/3}."
WHY: The run is across (2). The rise is up (3). The rise goes on top.
@viz lfslope pts="1,2;3,5" names="A;B" rise="3" run="2" xmin=0 xmax=5 ymin=0 ymax=6 caption="Up 3 for every 2 across."
RIGHT: Slope = {rise/run} = {3/2}. Think "up over across." A steep line has a big rise, so a big slope.
:::

::: try
1. Find the slope through (0, 1) and (2, 7). [[m = {7 − 1/2 − 0} = {6/2} = 3]]
2. Find the slope through (−1, 2) and (3, 4). [[m = {4 − 2/3 − (−1)} = {2/4} = {1/2}]]
3. Count the rise and run. Find the slope.
@viz lfslope pts="0,1;3,3" rise="[[2]]" run="[[3]]" xmin=-1 xmax=5 ymin=-1 ymax=5
[[m = {2/3}]]
4. Hill A has slope {1/4}. Hill B has slope {2/3}. Which is steeper? [[Hill B. {2/3} is bigger than {1/4}.]]
5. Mia says the slope through (1, 1) and (5, 3) is 2. Fix her mistake. [[She did run over rise: {4/2}. Rise 2, run 4, so m = {2/4} = {1/2}.]]
:::
::: retrieval
1. Solve 3x − 4 = 11.
=> 3x = 15, so x = 5.
2. Find −8 ÷ (−2).
=> 4
3. Is (2, 5), (2, 7) a function?
=> No. The input 2 has two outputs.
4. Simplify {9/12}.
=> {3/4}
5. ★ Stretch: Find two points on a line with slope {3/4}. Use whole numbers.
=> Answers vary. (0, 0) and (4, 3) work: rise 3, run 4.
:::

## Section 2: Kinds of slope
Learning target: I can tell if a slope is positive, negative, zero or undefined. I can compare parallel and perpendicular slopes.

### Vocabulary
- positive slope :: the line goes up to the right :: a ski lift going up the hill
- negative slope :: the line goes down to the right :: skiing down the hill
- zero slope :: a flat, horizontal line. The rise is 0. :: a flat parking lot
- undefined slope :: a vertical line. The run is 0. :: an elevator shaft
- parallel lines :: lines that never meet. They have the same slope. :: train tracks
- perpendicular lines :: lines that meet at a right angle :: the corner of a page
- negative reciprocal :: flip a fraction and change its sign :: the negative reciprocal of {2/3} is −{3/2}
- linear :: the graph is a straight line :: y goes up by 2 each time
- non-linear :: the graph is not a straight line :: a curve

#### Four kinds of slope
Read every line from left to right, like reading a page.
@viz lfkinds titles="up: positive;down: negative;flat: zero;straight up: undefined"


::: example Worked Example 1 — A negative slope
Find the slope through (0, 4) and (2, 0).
@viz lfslope pts="0,4;2,0" names="P;Q" rise="−4" run="2" xmin=-1 xmax=4 ymin=-1 ymax=5
Step 1: Rise = 0 − 4 = −4. The line goes down, so the rise is negative.
Step 2: Run = 2 − 0 = 2.
Step 3: m = {−4/2} = [[−2]]. It is negative. The line goes down to the right.
:::

::: example Worked Example 2 — Flat and straight up
Find the slope of each line.
@viz lfgraph lines="0,3;x=-2" labels="A;B" lpos="0.92;0.92" points="1,3;4,3;-2,1;-2,4" xmin=-4 xmax=5 ymin=-1 ymax=5
Line A: (1, 3) and (4, 3). m = {3 − 3/4 − 1} = {0/3} = [[0]].
Line B: (−2, 1) and (−2, 4). m = {4 − 1/−2 − (−2)} = {3/0}.
You can't divide by 0. What times 0 makes 3? No number works. So the slope of B is [[undefined]].
:::
::: explain
Why can't a vertical line have a slope? Use the run in your answer.
(lines 2)
=> The run is 0. Slope = rise ÷ run, and you can't divide by 0. So the slope is undefined.
:::

::: misconception
WRONG: "A flat line has no slope. Its slope is undefined."
WHY: A flat line has a rise of 0. {0/3} = 0. Zero divided by a number is 0.
@viz lfslope pts="1,2;4,2" rise="0" run="3" xmin=0 xmax=5 ymin=0 ymax=4 caption="Rise 0, run 3."
RIGHT: Flat (horizontal): slope **0**. Straight up (vertical): slope **undefined**. Only a run of 0 breaks the division.
:::

#### Parallel and perpendicular lines
**Parallel** lines have the **same slope**. They rise the same amount for every step across.
@viz lfgraph lines="2,1;2,-3" labels="y = 2x + 1;y = 2x − 3" lpos="0.97;0.97" xmin=-4 xmax=4 ymin=-5 ymax=5 cell=22 caption="Both have slope 2. They never meet."
**Perpendicular** lines meet at a right angle. Their slopes are **negative reciprocals**. Flip the fraction and change the sign.
@viz lfgraph lines="2,0;-1/2,0" labels="slope 2;slope −1/2" lpos="0.95;0.06" xmin=-4 xmax=4 ymin=-4 ymax=4 cell=24 caption="2 and −1/2: flip 2/1 to 1/2, change the sign."

::: example Worked Example 3 — Compare the slopes
Line P has slope {2/3}. Line Q has slope {2/3}. Line R has slope −{3/2}.
Step 1: P and Q have the same slope. They are [[parallel]].
Step 2: Flip {2/3} to {3/2}. Change the sign: −{3/2}. That is R's slope.
Step 3: So R is [[perpendicular]] to P.
:::

#### Linear or non-linear?
A **linear** graph is a straight line. In its table, y changes by the same amount each step.
| x | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| y (A) | 1 | 3 | 5 | 7 |
| y (B) | 0 | 1 | 4 | 9 |

A goes up 2 each time. It is linear. B goes up 1, then 3, then 5. It is non-linear.
@viz lfgraph lines="2,1" labels="A" lpos="0.8" points="0,1;1,3;2,5;3,7" xmin=0 xmax=4 ymin=0 ymax=10 cell=24 caption="A: a straight line."
@viz curve xmin=0 xmax=4 ymin=0 ymax=10 path="0,0;1,1;2,4;3,9" smooth=1 points="0,0;1,1;2,4;3,9" width=200 caption="B: a curve."

::: try
1. Positive, negative, zero or undefined? A line through (1, 5) and (3, 1). [[m = {1 − 5/3 − 1} = {−4/2} = −2. Negative.]]
2. Positive, negative, zero or undefined? A line through (4, −1) and (4, 6). [[The run is 0. Undefined.]]
3. Find the slope of the flat line.
@viz lfgraph lines="0,-2" points="-3,-2;2,-2" xmin=-4 xmax=4 ymin=-4 ymax=2 cell=22
[[Rise 0, run 5. m = {0/5} = 0.]]
4. A line has slope 4. Find the slope of a parallel line and a perpendicular line. [[Parallel: 4. Perpendicular: −{1/4}.]]
5. x: 0, 1, 2, 3. y: 2, 4, 8, 16. Linear or non-linear? [[Non-linear. y goes up 2, then 4, then 8. Not the same each time.]]
:::
::: retrieval
1. Find the slope through (2, 1) and (6, 3).
=> m = {2/4} = {1/2}
2. Which is steeper: slope 3 or slope {1/3}?
=> Slope 3.
3. Solve {x/2} + 1 = 6.
=> {x/2} = 5, so x = 10.
4. Find the domain of (1, 3), (2, 5), (4, 9).
=> 1, 2 and 4.
5. ★ Stretch: Can two different lines both have undefined slope? Are they parallel?
=> Yes. x = 1 and x = 4 are both vertical. They never meet, so they are parallel.
:::

## Section 3: y = mx + b
Learning target: I can find m and b in y = mx + b. I can write and graph the equation of a line.

### Vocabulary
- y-intercept :: where the line crosses the y-axis. Its x is 0. :: y = 2x + 1 crosses at (0, 1)
- b :: the y-value of the y-intercept :: in y = 2x + 1, b = 1
- m :: the slope :: in y = 2x + 1, m = 2
- slope-intercept form :: an equation written y = mx + b :: y = −3x + 4

#### Where do m and b come from?
Make a table for y = 2x + 1.
| x | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| y | 1 | 3 | 5 | 7 |

Each step right, y goes up 2. That is the slope, m = 2.
At x = 0, y = 1. The line crosses the y-axis at (0, 1). So b = 1.
@viz lfgraph lines="2,1" labels="y = 2x + 1" lpos="0.82" points="0,1;1,3;2,5;3,7" steps="0,1,1,3;1,3,2,5" rise="2;" run="1;" xmin=-2 xmax=4 ymin=-2 ymax=8 cell=30

::: key y = mx + b
**m** is the slope. **b** is the y-intercept: the line crosses the y-axis at (0, b).
:::

#### Change b: the line slides
@viz lfgraph lines="1,3;1,0;1,-2" labels="b = 3;b = 0;b = −2" lpos="0.9;0.9;0.9" xmin=-4 xmax=4 ymin=-4 ymax=6 cell=22 caption="Same slope, 1. The lines are parallel. b moves the line up or down."
#### Change m: the line turns
@viz lfgraph lines="3,1;1,1;1/3,1;-1,1" labels="m = 3;m = 1;m = 1/3;m = −1" lpos="0.78;0.92;0.92;0.1" xmin=-4 xmax=4 ymin=-4 ymax=6 cell=22 caption="Same b, 1. Bigger m is steeper. Negative m goes down."

::: example Worked Example 1 — Equation from a graph
Write the equation of the line.
@viz lfgraph lines="2,-1" points="0,-1;2,3:(2, 3)" steps="0,-1,2,3" rise="4" run="2" xmin=-2 xmax=4 ymin=-3 ymax=5 cell=30
Step 1: The line crosses the y-axis at (0, −1). So b = −1.
Step 2: From (0, −1) to (2, 3): rise 4, run 2. m = {4/2} = 2.
Step 3: y = [[2x − 1]].
:::

::: example Worked Example 2 — Graph from an equation
Graph y = −{1/2}x + 3.
@viz lfgraph lines="-1/2,3" points="0,3" keypoints="2,2;4,1" steps="0,3,2,2" rise="−1" run="2" xmin=-1 xmax=7 ymin=-1 ymax=5 cell=30
Step 1: Plot b first: (0, 3).
Step 2: m = −{1/2}. Go right 2, down 1. Plot [[(2, 2)]]. Repeat: (4, 1).
Step 3: Draw a line through the points. Extend it across the grid.
:::

::: example Worked Example 3 — Graph from a slope and one point
A line has slope 3. It goes through (1, 2). Graph it and write its equation.
@viz lfgraph lines="3,-1" points="1,2:(1, 2);2,5;0,-1" steps="1,2,2,5" rise="3" run="1" xmin=-2 xmax=4 ymin=-3 ymax=7 cell=30
Step 1: Plot (1, 2).
Step 2: Right 1, up 3: (2, 5). Left 1, down 3: (0, −1).
Step 3: The line crosses the y-axis at (0, −1). So y = [[3x − 1]].
Check: Put x = 1 into your equation. You should get y = 2.
:::
::: explain
Two lines have the same b but different m. Where do they meet? How do you know?
(lines 2)
=> At (0, b) on the y-axis. Both lines cross the y-axis at the same point.
:::

::: misconception
WRONG: "In y = 4x + 2, the slope is 2."
WHY: The 2 is where the line starts on the y-axis. The 4 is next to x. It tells how much y grows each step.
@viz lfgraph lines="4,2" points="0,2:(0, 2);1,6" steps="0,2,1,6" rise="4" run="1" xmin=-2 xmax=3 ymin=-3 ymax=8 cell=24 caption="Up 4 for every 1 across. Crosses at (0, 2)."
RIGHT: m is the number times x: m = 4. b is the number on its own: b = 2.
:::

::: try
1. Find m and b. y = −3x + 5. [[m = −3, b = 5]]
2. Find m and b. y = x − 4. [[m = 1, b = −4]]
3. Write the equation of the line.
@viz lfgraph lines="1/2,1" points="0,1;2,2" xmin=-3 xmax=5 ymin=-2 ymax=4 cell=24
[[b = 1. Rise 1, run 2, so m = {1/2}. y = {1/2}x + 1.]]
4. Graph y = −2x + 4. Name two points.
@viz lfgraph keylines="-2,4" keypoints="0,4;1,2;2,0" xmin=-2 xmax=4 ymin=-2 ymax=6 cell=24
[[(0, 4), (1, 2), (2, 0). Start at 4, then right 1, down 2.]]
5. A line has slope −1 and goes through (2, 3). Write its equation. [[Left 2, up 2 lands on (0, 5). y = −x + 5.]]
:::
::: retrieval
1. A line goes through (0, 0) and (3, −6). Find its slope.
=> m = {−6/3} = −2
2. What is the slope of a vertical line?
=> Undefined.
3. Line A has slope 5. Line B is perpendicular. Find B's slope.
=> −{1/5}
4. Find 3(x − 2) when x = −1.
=> 3(−3) = −9
5. ★ Stretch: A line is parallel to y = 3x − 2. It crosses the y-axis at (0, 4). Write its equation.
=> y = 3x + 4. Same slope, new b.
:::

## Section 4: Intercepts, rate of change and special lines
Learning target: I can find intercepts and graph flat and vertical lines. I can explain slope and b in a real situation.

### Vocabulary
- x-intercept :: where the line crosses the x-axis. Its y is 0. :: (2, 0)
- y-intercept :: where the line crosses the y-axis. Its x is 0. :: (0, −4)
- horizontal line :: a flat line. Every point has the same y. :: y = 3
- vertical line :: a straight-up line. Every point has the same x. :: x = −2
- rate of change :: how much the output changes for each 1 of the input :: $15 per hour
- initial value :: the output when the input is 0 :: a $4 starting fee

#### Two intercepts
Write each intercept as an ordered pair.
@viz lfgraph lines="2,-4" labels="y = 2x − 4" lpos="0.85" points="0,-4:[[(0, −4)]];2,0:[[(2, 0)]]" xmin=-3 xmax=5 ymin=-6 ymax=4 cell=24 caption="It crosses the y-axis once and the x-axis once."
y-intercept: put x = 0. y = 2(0) − 4 = [[−4]]. The point is [[(0, −4)]].
x-intercept: put y = 0. 0 = 2x − 4. So 2x = 4 and x = [[2]]. The point is [[(2, 0)]].
A line that is not flat crosses the x-axis exactly once.

::: misconception
WRONG: "The x-intercept is where x = 0."
WHY: At x = 0 you are ON the y-axis. That point is the y-intercept.
@viz lfgraph lines="-1,3" points="0,3:(0, 3);3,0:(3, 0)" labels="y = −x + 3" lpos="0.8" xmin=-2 xmax=5 ymin=-2 ymax=5 cell=24 caption="(0, 3) is on the y-axis. (3, 0) is on the x-axis."
RIGHT: The x-intercept sits on the x-axis, so **y = 0**. The y-intercept sits on the y-axis, so **x = 0**.
:::

#### Flat and straight-up lines
@viz lfgraph lines="0,3;x=-2" labels="y = 3;x = −2" lpos="0.9;0.9" points="1,3;4,3;-2,-1;-2,1" xmin=-4 xmax=5 ymin=-3 ymax=5 cell=24 caption="On y = 3, every y is 3. On x = −2, every x is −2."
A **horizontal** line has equation **y = b**. Its slope is 0, so y = 0x + b = b.
A **vertical** line has equation **x = a**. Its slope is undefined, so it has no y = mx + b form.
y = 3 never meets the x-axis. It has no x-intercept.

::: example Worked Example 1 — Equations of special lines
Write the equation of each line.
@viz lfgraph lines="0,-1;x=4" labels="A;B" lpos="0.05;0.92" xmin=-2 xmax=6 ymin=-3 ymax=4 cell=24
Line A is flat. Every point has y = −1. Equation: [[y = −1]].
Line B is straight up. Every point has x = 4. Equation: [[x = 4]].
:::

#### Rate of change
In a real situation, the slope is a **rate of change**. b is the **initial value**: the output at the start.

::: example Worked Example 2 — Edmonton to Red Deer
A car leaves Edmonton for Red Deer, about 150 km away. It drives 100 km each hour.
@viz lfgraph lines="seg:0,0,1.5,150" points="0,0;1,100;1.5,150:Red Deer" steps="0,0,1,100" rise="100 km" run="1 h" xmin=0 xmax=2 xstep=0.5 ymin=0 ymax=160 ystep=20 yevery=40 xlabel="hours" ylabel="distance (km)" cell=36
Step 1: The slope is {100/1} = 100. The rate of change is [[100 km per hour]].
Step 2: b = 0. At the start, the car has gone [[0 km]].
Step 3: Equation: d = [[100t]]. Domain: 0 to 1.5 hours. Range: 0 to [[150 km]].
:::

::: example Worked Example 3 — A taxi fare
A Calgary taxi charges $4 to start and $2 for each kilometre.
@viz lfgraph lines="seg:0,4,10,24" points="0,4:(0, 4);5,14" steps="0,4,5,14" rise="$10" run="5 km" xmin=0 xmax=10 ymin=0 ymax=24 ystep=2 yevery=4 xlabel="km" ylabel="cost ($)" cell=22
Step 1: The slope is {10/5} = [[2]]. Each km adds [[$2]].
Step 2: b = 4. That is the [[$4 starting fee]], the cost before you move.
Step 3: Equation: C = [[2d + 4]]. A 7 km ride costs [[2(7) + 4 = $18]].
:::

::: example Worked Example 4 — Draining a tank
A 60 L water tank drains 5 L each minute.
@viz lfgraph lines="seg:0,60,12,0" points="0,60:(0, 60);12,0:(12, 0)" xmin=0 xmax=14 xstep=1 xevery=2 ymin=0 ymax=70 ystep=10 xlabel="minutes" ylabel="water (L)" cell=20
Step 1: The water goes down, so the slope is [[−5]] L per minute.
Step 2: The y-intercept (0, 60) means [[the tank starts with 60 L]].
Step 3: The x-intercept (12, 0) means [[the tank is empty after 12 minutes]].
:::
::: explain
A babysitter earns $15 an hour. Why does the graph of pay start at (0, 0), not at (0, 15)?
(lines 2)
=> With 0 hours worked, the pay is $0. So b = 0. The 15 is the slope: $15 more each hour.
:::

::: try
1. Find both intercepts of y = 3x − 6. [[y-intercept: (0, −6). x-intercept: 0 = 3x − 6, x = 2, so (2, 0).]]
2. Write the equation of a horizontal line through (5, −2). [[y = −2]]
3. Write the equation of a vertical line through (5, −2). [[x = 5]]
4. A phone plan costs $30 a month plus $10 for each GB of data. Write the equation. What do m and b mean? [[C = 10g + 30. m = 10: $10 more for each GB. b = 30: $30 with no data used.]]
5. The Calgary Tower elevator rises about 3 m each second. Find the slope. Find the height after 20 s. [[m = 3 m per second. h = 3t. After 20 s: 3 × 20 = 60 m.]]
6. Make up a situation with slope −5 and b = 40. Give a domain and a range. [[Answers vary. A $40 gift card. You spend $5 a day. Domain: 0 to 8 days. Range: $0 to $40.]]
:::
::: retrieval
1. Find the slope through (−1, 4) and (3, −4).
=> m = {−8/4} = −2
2. Write the equation: slope {1/2}, y-intercept (0, −3).
=> y = {1/2}x − 3
3. Are y = 2x + 1 and y = −{1/2}x + 1 parallel or perpendicular?
=> Perpendicular. 2 and −{1/2} are negative reciprocals.
4. Is y = x² linear?
=> No. Its graph is a curve.
5. ★ Stretch: Can a line that is not flat have two x-intercepts? Explain.
=> No. A straight line that is not flat crosses the x-axis only once.
:::

## Unit Synthesis
1. Ava earns $12 an hour babysitting. She also gets a $6 bus pass for each job.
a) Write an equation for her pay for one job. b) Find m and b. Say what each means. c) Graph it for 0 to 5 hours.
@viz lfgraph keylines="seg:0,6,5,66" keypoints="0,6;5,66" xmin=0 xmax=5 ymin=0 ymax=70 ystep=10 xlabel="hours" ylabel="pay ($)" cell=24
=> a) P = 12h + 6.
=> b) m = 12: $12 more for each hour. b = 6: the $6 bus pass, paid even for 0 hours.
=> c) Start at (0, 6). Up $12 for each hour. End at (5, 66).
2. A ski run at Lake Louise drops 240 m over 600 m across. Find its slope. Is it steeper than a run with slope −{1/2}?
@viz lfhill kind=hill rv=2 runv=5 rise="240 m" run="600 m"
=> Going down, m = −{240/600} = −{2/5}. Compare steepness by size: {2/5} = 0.4 and {1/2} = 0.5. The −{1/2} run is steeper.
3. A line goes through (0, 2). It is parallel to y = −3x + 7. Write its equation. Then find its x-intercept.
=> y = −3x + 2. 0 = −3x + 2, so x = {2/3}. The x-intercept is ({2/3}, 0).
4. Noah says y = 5 has an undefined slope. Explain his mistake.
=> y = 5 is a flat line. Its rise is 0, so its slope is 0. Vertical lines like x = 5 have undefined slope.
5. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Slope
**m = {rise/run} = {y₂ − y₁/x₂ − x₁}**. Up over across.
Bigger number (ignoring the sign) = steeper.
:::
@viz lfslope pts="1,1;3,4" rise="3" run="2" xmin=0 xmax=5 ymin=0 ymax=5 cell=22 caption="Across 2, up 3: m = 3/2."

::: key Kinds of slope
Up to the right: positive. Down to the right: negative.
Flat: 0 (rise is 0). Straight up: undefined (run is 0).
Parallel: same slope. Perpendicular: negative reciprocals, like {2/3} and −{3/2}.
:::
@viz lfgraph lines="2,0;-1/2,0;0,3;x=-3" labels="m = 2;m = −1/2;m = 0;undefined" lpos="0.82;0.12;0.9;0.9" xmin=-4 xmax=4 ymin=-4 ymax=4 cell=22

::: key y = mx + b
m is the slope. b is the y-intercept (0, b).
Graph: plot (0, b), then step with m. Write: read b, then count rise over run.
:::
@viz lfgraph lines="2,-1" labels="y = 2x − 1" lpos="0.85" points="0,-1:(0, −1);1,1" steps="0,-1,1,1" rise="2" run="1" xmin=-2 xmax=4 ymin=-3 ymax=5 cell=22

::: key Intercepts, special lines and rate of change
x-intercept: set y = 0, point (x, 0). y-intercept: set x = 0, point (0, b).
Horizontal: y = b. Vertical: x = a.
In a story: m is the rate (per hour, per km). b is the starting amount.
:::
@viz lfgraph lines="seg:0,4,10,24" labels="taxi: C = 2d + 4" lpos="0.6" points="0,4" xmin=0 xmax=10 ymin=0 ymax=24 ystep=4 xlabel="km" ylabel="cost ($)" cell=20

| Mistake | Fix |
|---|---|
| Slope is run over rise | Rise on top: up over across. |
| A flat line has undefined slope | Flat: 0. Vertical: undefined. |
| In y = mx + b, b is the slope | m (next to x) is the slope. b is the y-intercept. |
| The x-intercept is where x = 0 | On the x-axis, y = 0. |
| Forgetting the sign | Down to the right means a negative slope. |
| Stopping the line at the points | A line goes across the whole grid. Use arrows. |
