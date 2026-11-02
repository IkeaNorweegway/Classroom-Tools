---
title: Functions
topic: functions
strand: algebra
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "Every relation is a function" and "Two inputs can't have the same output" (FN1).
     "Always connect the dots" (FN2). "Domain and range are the same thing" / swapped (FN3).
     "A flat line that hits twice means not a function" (FN4, not in the course list; added because students
     who learn the vertical line test often swap it for a horizontal one, which is the FN1 shared-output mix-up again).
     Section order: input, output and the one-output rule first, with a function machine, pairs, tables and
     mapping diagrams (FN1), because every later idea is about inputs and outputs. Then graphing from a table and
     the dots-or-a-line choice (FN2), since domain and range are read from graphs. Then domain and range in words
     from pairs, tables, graphs and situations (FN3). Last, real-world limits on domain and range and the vertical
     line test (FN4), which needs graphs (FN2), the one-output rule (FN1) and domain (FN3). Outcome 7F1.
     No f(x) notation, no set-builder notation, no slope. -->

## Pre-Knowledge Check
1. Find 6 × n when n = 4.
2. Continue the pattern: 5, 10, 15, ___, ___.
3. Look at the point (4, 2). Which number tells you how far to go across?
4. An input of 1 gives 4. An input of 2 gives 5. An input of 3 gives 6. What is the rule?
5. Is 2.5 between 2 and 3?
6. Find 3n + 1 when n = 5.

## Section 1: Relations and functions
Learning target: I can tell if a relation is a function.

### Vocabulary
- input :: the number that goes in :: the number of games you bowl
- output :: the number that comes out :: the cost of the games
- ordered pair :: an input and its output, written (input, output) :: (2, 12) means 2 games cost $12
- relation :: any set of inputs paired with outputs :: (1, 6), (2, 12), (2, 15)
- function :: a relation where each input has exactly ONE output :: each number of games has one cost
- independent variable :: another name for the input :: the number of games
- dependent variable :: another name for the output. It depends on the input. :: the cost
- mapping diagram :: arrows from each input to its output :: 1 → 6

#### The function machine
A **function machine** follows a rule. An input goes in. One output comes out.
@viz machine in="2" rule="× 6" out="12" inlabel="games" outlabel="cost ($)"
Bowling costs $6 a game. Put in 2 games. The machine does 2 × 6. Out comes $12.
@viz machine in="1;2;3" rule="× 6" out="6;12;18" inlabel="games" outlabel="cost ($)" caption="Each input gives one output."

#### Four ways to show a relation
The bowling costs can be shown four ways.
A table:

| Games (input) | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Cost in $ (output) | 6 | 12 | 18 | 24 |

Ordered pairs: (1, 6), (2, 12), (3, 18), (4, 24). The input is always first.
A mapping diagram:
@viz mapping in="1,2,3,4" out="6,12,18,24" arrows="1>6;2>12;3>18;4>24" inlabel="games" outlabel="cost ($)"
A graph:
@viz coord xmin=0 xmax=5 ymin=0 ymax=30 ystep=6 points="1,6;2,12;3,18;4,24" xlabel="games" ylabel="cost ($)" width=300

::: key Function
A **function** gives each input exactly ONE output.
To check: look at each input. Does it have only one arrow?
The input is the **independent variable**. The output is the **dependent variable**. The output depends on the input.
:::

::: misconception
WRONG: "Every relation is a function."
WHY: Look at the input 2. It has two arrows. 2 goes to 5 and to 6. One input has two outputs.
@viz mapping in="1,2,3" out="4,5,6,7" arrows="1>4;2>5;2>6;3>7" caption="The input 2 has two arrows."
RIGHT: A relation is a function only if each input has ONE output. This relation is not a function.
:::

::: misconception
WRONG: "Two inputs can't have the same output in a function."
WHY: (1, 5) and (2, 5) share the output 5. But each input still has only one arrow.
@viz mapping in="1,2,3" out="5,8" arrows="1>5;2>5;3>8" caption="Two arrows go to 5. That is allowed."
RIGHT: Two inputs CAN share an output. This relation is still a function.
:::

::: example Worked Example 1 — Is it a function?
Is (1, 3), (2, 5), (3, 7), (4, 9) a function?
@viz mapping in="1,2,3,4" out="3,5,7,9" arrows="1>3;2>5;3>7;4>9"
Step 1: Draw a mapping diagram. Inputs go on the left. Outputs go on the right.
Step 2: Check each input. Each input has one arrow.
Step 3: So it [[is]] a function.
:::

::: example Worked Example 2 — Birthday months
Ava and Sam have May birthdays. Noor has July. Leo has March.
@viz mapping in="Ava,Sam,Noor,Leo" out="March,May,July" arrows="Ava>May;Sam>May;Noor>July;Leo>March" inlabel="name" outlabel="month"
Step 1: Name → month. Each name has one arrow. It is a function. Ava and Sam share May. That is allowed.
@viz mapping in="March,May,July" out="Ava,Sam,Noor,Leo" arrows="March>Leo;May>Ava;May>Sam;July>Noor" inlabel="month" outlabel="name"
Step 2: Flip it. Month → name. May has two arrows. It is [[not a function]].
:::
::: explain
Look at Worked Example 2. Why is name → month a function? Why is month → name not?
(lines 2)
=> Each person has one birthday month. But May goes to two people, so one input has two outputs.
:::

::: example Worked Example 3 — Bus rides
A bus ride in Edmonton costs $3. The number of rides is the input.
@viz machine in="1;2;5" rule="× 3" out="3;6;[[15]]" inlabel="rides" outlabel="cost ($)"
Step 1: The input is the number of rides. It is the independent variable.
Step 2: The output is the cost. It depends on the rides. It is the dependent variable.
Step 3: 5 rides cost 5 × 3 = [[15]] dollars.
:::

::: try
1. Is (2, 4), (3, 6), (2, 8) a function? [[No. The input 2 has two outputs: 4 and 8.]]
2. Is (1, 7), (2, 7), (3, 7) a function?
@viz mapping in="1,2,3" out="7" arrows="1>7;2>7;3>7"
[[Yes. Each input has one output. They can all share 7.]]
3. Bowling costs $6 a game. Name the input and the output. [[Input: the number of games. Output: the cost.]]
4. The rule is + 5. Find the outputs.
@viz machine in="4;10" rule="+ 5" out="[[9]];[[15]]"
5. Kai says (5, 1), (6, 1) is not a function. Is he right? [[No. Two inputs can share the output 1. Each input has one output.]]
:::
::: retrieval
1. Solve 3x + 4 = 19.
=> 3x = 15, so x = 5.
2. Find −4 × 6.
=> −24
3. Find 25% of 80.
=> 20
4. Simplify 2(x + 3) + x.
=> 2x + 6 + x = 3x + 6
5. ★ Stretch: Write three ordered pairs that are NOT a function.
=> Answers vary. Use one input twice, like (1, 2), (1, 3), (2, 4).
:::

## Section 2: Graphing a function from a table
Learning target: I can graph a function from a table. I can choose dots or a line.

### Vocabulary
- table of values :: a table of inputs and their outputs :: games 1, 2, 3 and cost 6, 12, 18
- graph :: the ordered pairs drawn as points on a grid :: (2, 12) is 2 across and 12 up
- discrete :: only some inputs make sense, like whole numbers. Draw dots only. :: games, tickets, people
- continuous :: every input in between makes sense too. Join the points with a line. :: time, distance, litres of water

#### How to graph a function
@viz flow steps="Make a table|Write the pairs|Plot: input across, output up|Dots or a line?"
The input goes across, on the x-axis. The output goes up, on the y-axis.

::: key Dots or a line?
Ask: can the input be a part, like 2.5?
No (games, tickets, people, riders): the function is **discrete**. Draw dots only.
Yes (time, distance, litres, GB of data): the function is **continuous**. Join the dots with a line.
:::
@viz coord xmin=0 xmax=4 ymin=0 ymax=4 points="1,1;2,2;3,3" width=150 caption="Discrete: dots only."
@viz coord xmin=0 xmax=4 ymin=0 ymax=4 points="0,0;4,4" line=1 width=150 caption="Continuous: a line."

::: example Worked Example 1 — Bowling (discrete)
Bowling costs $6 a game. Make a table for 0 to 5 games. Graph it.

| Games | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Cost ($) | 0 | 6 | 12 | 18 | [[24]] | [[30]] |

@viz coord xmin=0 xmax=6 ymin=0 ymax=36 ystep=6 points="0,0;1,6;2,12;3,18" keypoints="4,24;5,30" xlabel="games" ylabel="cost ($)"
Step 1: Multiply each input by 6 to fill the table.
Step 2: Plot each pair. (2, 12) is 2 across and 12 up.
Step 3: Can you bowl 2.5 games? No. So the graph is [[discrete]]. Do not join the dots.
:::
::: explain
In Worked Example 1, why do we leave the dots apart?
(lines 2)
=> You can't bowl part of a game. Only whole numbers of games make sense.
:::

::: example Worked Example 2 — Filling a water trough (continuous)
A hose fills a trough on a farm. It adds 20 L each minute. The trough starts empty.

| Minutes | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Water (L) | 0 | 20 | 40 | [[60]] | [[80]] |

@viz coord xmin=0 xmax=5 ymin=0 ymax=100 ystep=20 points="0,0;1,20;2,40" keypoints="3,60;4,80" line=1 xlabel="minutes" ylabel="water (L)"
Step 1: Add 20 L for each minute.
Step 2: Plot the pairs.
Step 3: Can the hose run for 1.5 minutes? Yes. That gives 30 L. So the graph is [[continuous]]. Join the dots with a line.
:::

::: misconception
WRONG: "Always connect the dots."
WHY: A bus fare is $3. The line says 2.5 riders paid $7.50. Nobody is half a rider.
@viz coord xmin=0 xmax=5 ymin=0 ymax=15 ystep=3 points="0,0;1,3;2,6;3,9;4,12" line=1 xlabel="riders" ylabel="fare ($)" width=300 caption="Wrong: a line for riders."
RIGHT: Riders are counted. The graph is discrete. Draw dots only.
@viz coord xmin=0 xmax=5 ymin=0 ymax=15 ystep=3 points="0,0;1,3;2,6;3,9;4,12" xlabel="riders" ylabel="fare ($)" width=300 caption="Right: dots for riders."
:::

::: example Worked Example 3 — The drive to Banff
A car leaves Edmonton with 50 L of gas. It uses 10 L each hour.

| Hours | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Gas (L) | 50 | 40 | [[30]] | [[20]] | [[10]] |

@viz coord xmin=0 xmax=5 ymin=0 ymax=50 ystep=10 points="0,50;1,40" keypoints="2,30;3,20;4,10" line=1 xlabel="hours" ylabel="gas (L)"
Step 1: Take away 10 L for each hour.
Step 2: Plot the pairs. The graph goes down.
Step 3: Time can be any amount, like 1.5 hours. It is [[continuous]]. Draw a line.
:::

::: try
1. A movie ticket costs $8. Fill in the table.

| Tickets | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Cost ($) | [[8]] | [[16]] | [[24]] | [[32]] |

Dots or a line? [[Dots. You can't buy part of a ticket.]]
2. A candle is 12 cm tall. It burns 2 cm each hour. Fill in the table. Then graph it.

| Hours | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Height (cm) | [[12]] | [[10]] | [[8]] | [[6]] |

@viz coord xmin=0 xmax=6 ymin=0 ymax=12 ystep=2 keypoints="0,12;1,10;2,8;3,6" line=1 xlabel="hours" ylabel="height (cm)" width=300
Dots or a line? [[A line. Time can be any amount.]]
3. A phone plan costs $20 a month plus $5 a GB. Find the cost for 0, 1, 2 and 3 GB. [[$20, $25, $30, $35]] Dots or a line? [[A line. You can use 1.5 GB.]]
4. To plot (3, 18), go [[3]] across and [[18]] up.
:::
::: retrieval
1. Is (1, 4), (2, 4), (3, 4) a function?
=> Yes. Each input has one output.
2. A bus ride costs $3. Name the input and the output.
=> Input: the number of rides. Output: the cost.
3. Solve 2x − 5 = 11.
=> 2x = 16, so x = 8.
4. Find −3 + (−7).
=> −10
5. ★ Stretch: A pool has 10 cm of water. It rises 5 cm each hour. Make a table for 0 to 3 hours. Dots or a line?
=> 10, 15, 20, 25 cm. A line: time can be any amount.
:::

## Section 3: Domain and range
Learning target: I can describe the domain and range of a function in words.

### Vocabulary
- domain :: all the possible inputs :: games: 0, 1, 2, 3, 4 or 5
- range :: all the possible outputs :: cost: $0, $6, $12, $18, $24 or $30

In data, the range means biggest − smallest. In functions, the **range** means all the outputs.

#### Domain and range on a mapping diagram
@viz mapping in="1,2,3,4" out="6,12,18,24" arrows="1>6;2>12;3>18;4>24" inlabel="domain" outlabel="range" caption="The left oval is the domain. The right oval is the range."
The **domain** is every input. The **range** is every output.

#### Say it in words
Discrete: list them, or say "whole numbers from 0 to 5."
@viz numberline min=0 max=6 points="0;1;2;3;4;5" width=320 caption="Whole numbers from 0 to 5: dots only."
Continuous: say "any number from 0 to 4."
@viz numberline min=0 max=6 highlight="0,4" points="0;4" width=320 caption="Any number from 0 to 4: every point on the thick part."

::: misconception
WRONG: "Domain and range are the same thing." Or: "The domain is the outputs."
WHY: In (2, 12), 2 is the input. 12 is the output. They are not the same.
@viz mapping in="2,3" out="12,18" arrows="2>12;3>18" inlabel="domain: inputs" outlabel="range: outputs"
RIGHT: Domain = all the inputs (across, x). Range = all the outputs (up, y). D comes before R, like input comes before output.
:::

::: example Worked Example 1 — From ordered pairs
Find the domain and range of (1, 6), (2, 12), (3, 18), (4, 24).
@viz mapping in="1,2,3,4" out="6,12,18,24" arrows="1>6;2>12;3>18;4>24" inlabel="domain" outlabel="range"
Step 1: The inputs are the first numbers. Domain: [[1, 2, 3 and 4]].
Step 2: The outputs are the second numbers. Range: [[6, 12, 18 and 24]].
:::

::: example Worked Example 2 — From a graph (continuous)
The trough graph runs from 0 to 5 minutes. The water goes from 0 to 100 L.
@viz coord xmin=0 xmax=6 ymin=0 ymax=120 ystep=20 points="0,0;5,100" line=1 xlabel="minutes" ylabel="water (L)"
Step 1: Look across. The line starts at 0 and ends at 5.
Step 2: Domain: any time from [[0 to 5 minutes]].
Step 3: Look up. The line starts at 0 L and ends at 100 L.
Step 4: Range: any amount from [[0 to 100 L]].
:::
::: explain
Look at Worked Example 2. Why do we say "any amount from 0 to 100 L"? Why not list the numbers?
(lines 2)
=> The water is continuous. Every amount between 0 and 100 L happens. You can't list them all.
:::

::: example Worked Example 3 — A spring day in Calgary
The graph shows the temperature from 6 a.m. (0 hours) to 6 p.m. (12 hours).
@viz curve xmin=0 xmax=12 ymin=0 ymax=16 ystep=2 xevery=2 path="0,2;2,5;4,9;6,13;8,15;10,13;12,9" points="0,2:lowest;8,15:highest" xlabel="hours after 6 a.m." ylabel="temperature (°C)"
Step 1: Domain: any time from [[0 to 12 hours]] after 6 a.m. That is 6 a.m. to 6 p.m.
Step 2: Find the lowest and highest points. The lowest is [[2 °C]]. The highest is [[15 °C]].
Step 3: Range: any temperature from [[2 °C to 15 °C]].
:::

::: example Worked Example 4 — From a table (phone data)
A plan costs $20 plus $5 a GB. You can use up to 4 GB.

| Data (GB) | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Cost ($) | 20 | 25 | 30 | 35 | 40 |

@viz coord xmin=0 xmax=5 ymin=0 ymax=40 ystep=5 yevery=10 points="0,20;1,25;2,30;3,35;4,40" line=1 xlabel="data (GB)" ylabel="cost ($)" width=300
Step 1: GB can be a part, like 2.5. It is [[continuous]].
Step 2: Domain: any amount from [[0 to 4 GB]].
Step 3: Range: any cost from [[$20 to $40]].
:::

::: try
1. Find the domain and range of (0, 3), (1, 5), (2, 7). Domain: [[0, 1 and 2]]. Range: [[3, 5 and 7]].
2. Find the domain and range.
@viz mapping in="2,4,6" out="1,3" arrows="2>1;4>3;6>3"
[[Domain: 2, 4 and 6. Range: 1 and 3.]]
3. A candle burns from 12 cm to 0 cm in 6 hours. Find the domain and range.
@viz coord xmin=0 xmax=7 ymin=0 ymax=12 ystep=2 points="0,12;6,0" line=1 xlabel="hours" ylabel="height (cm)" width=300
[[Domain: any time from 0 to 6 hours. Range: any height from 0 to 12 cm.]]
4. Bowling: 0 to 5 games at $6 a game. Domain: [[whole numbers from 0 to 5]]. Range: [[$0, $6, $12, $18, $24 and $30]].
5. Mia says the domain of (1, 10), (2, 20) is 10 and 20. Fix her mistake. [[10 and 20 are outputs. They are the range. The domain is 1 and 2.]]
:::
::: retrieval
1. Dots or a line: the number of tickets sold?
=> Dots. Tickets are counted, so it is discrete.
2. Is (3, 1), (3, 2) a function?
=> No. The input 3 has two outputs.
3. A ride costs $4. Make a table for 0 to 3 rides.
=> 0, 4, 8 and 12 dollars.
4. Solve 4x = 2x + 10.
=> 2x = 10, so x = 5.
5. ★ Stretch: The range of a function is only the number 7. Draw a mapping diagram for it.
=> Answers vary. Every input has an arrow to 7, like 1 → 7, 2 → 7, 3 → 7.
:::

## Section 4: Real-world limits and the vertical line test
Learning target: I can find limits on the domain and range. I can use the vertical line test.

### Vocabulary
- limit :: a real reason some inputs or outputs can't happen :: a bus seats 40, so riders stop at 40
- vertical line :: a line that goes straight up and down :: the dashed line in the picture
- vertical line test :: if a vertical line hits a graph more than once, it is NOT a function :: a circle fails the test

#### Limits come from the real world
- Time and people can't be negative.
- A trough holds only 120 L.
- A bus seats 40 people.
- A pool pass is good for up to 20 visits.
@viz people n=40 cols=10 title="The bus seats 40" caption="The domain stops at 40 riders."

::: example Worked Example 1 — The bus seats 40
Each rider pays $3. The input is the number of riders.
@viz machine in="0;40" rule="× 3" out="[[0]];[[120]]" inlabel="riders" outlabel="fare ($)"
Step 1: Riders are counted. They are whole numbers. They can't be negative.
Step 2: The bus seats 40. Domain: whole numbers from [[0 to 40]].
Step 3: The most fare is 40 × 3 = [[120]] dollars.
Step 4: Range: [[0, 3, 6, 9 and so on, up to $120]].
:::

::: example Worked Example 2 — The trough holds 120 L
The hose adds 20 L each minute. The trough starts empty.
@viz coord xmin=0 xmax=8 ymin=0 ymax=140 ystep=20 points="0,0" keypoints="6,120" line=1 xlabel="minutes" ylabel="water (L)"
Step 1: When is it full? 120 ÷ 20 = [[6]] minutes.
Step 2: Time can't be negative. Domain: any time from [[0 to 6 minutes]].
Step 3: Range: any amount from [[0 to 120 L]].
:::

::: example Worked Example 3 — A pool pass
A pool pass is good for 20 visits. The input is the visits used. The output is the visits left.

| Visits used | 0 | 1 | 2 | … | 20 |
|---|---|---|---|---|---|
| Visits left | 20 | 19 | [[18]] | … | [[0]] |

@viz coord xmin=0 xmax=20 ymin=0 ymax=20 xevery=5 yevery=5 points="0,20;1,19;2,18;3,17;4,16;5,15;6,14;7,13;8,12;9,11;10,10;11,9;12,8;13,7;14,6;15,5;16,4;17,3;18,2;19,1;20,0" xlabel="visits used" ylabel="visits left"
Step 1: Visits are counted. It is [[discrete]].
Step 2: Domain: [[whole numbers from 0 to 20]].
Step 3: Range: [[whole numbers from 0 to 20]].
:::

#### The vertical line test
Slide a vertical line across the graph. Does it ever hit the graph twice?
If yes, one input has two outputs. The graph is NOT a function.
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 circle="4,4,3" vline=3 hits="3,6.83;3,1.17" width=240 caption="A circle: the dashed line hits twice. Not a function."
@viz curve xmin=0 xmax=12 ymin=0 ymax=16 ystep=2 xevery=2 path="0,2;2,5;4,9;6,13;8,15;10,13;12,9" vline=4 hits="4,9" width=300 caption="The temperature graph: every vertical line hits once. A function."

::: example Worked Example 4 — Which graphs are functions?
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 path="5.5,1;3,2;1.5,3;1,4;1.5,5;3,6;5.5,7" vline=3 keyhits="3,2;3,6" width=240 caption="Graph A"
Graph A: The dashed line hits it [[twice]]. It is [[not a function]].
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 path="0,1;2,4;4,6;6,4;8,1" vline=2 keyhits="2,4" width=240 caption="Graph B"
Graph B: Every vertical line hits it [[once]]. It is [[a function]].
@viz coord xmin=0 xmax=5 ymin=0 ymax=6 points="1,2;2,3;2,5;4,4" vline=2 width=200 caption="Graph C"
Graph C: The input 2 has [[two dots]]. It is [[not a function]].
:::
::: explain
Why does a vertical line check for a function?
(lines 2)
=> A vertical line is one input. If it hits twice, that input has two outputs.
:::

::: misconception
WRONG: "A flat line hits Graph B twice. So it is not a function."
WHY: A flat line finds two inputs with the same output. That is allowed in a function.
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 path="0,1;2,4;4,6;6,4;8,1" hline=4 hits="2,4;6,4" width=240 caption="2 and 6 share the output 4."
RIGHT: Use a VERTICAL line. It checks one input at a time.
:::

::: try
1. A van seats 8. Each rider pays $2. Domain: [[whole numbers from 0 to 8]]. Range: [[0, 2, 4 and so on, up to $16]].
@viz people n=8 cols=8 title="The van seats 8"
2. A gas tank holds 50 L. It fills at 10 L a minute from empty. Domain: [[any time from 0 to 5 minutes]]. Range: [[any amount from 0 to 50 L]].
3. Is this graph a function?
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 path="1,1;2,3;4,4;2,5;1,7" smooth=0 width=220
[[No. A vertical line at 2 hits it twice.]]
4. Is this graph a function?
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 path="0,6;2,2;4,5;6,3;8,7" width=220
[[Yes. Every vertical line hits it once.]]
5. Leo says the trough's domain starts at −2 minutes. Fix his mistake. [[Time starts at 0. It can't be negative. The domain is any time from 0 to 6 minutes.]]
:::
::: retrieval
1. Find the domain and range of (2, 5), (4, 5), (6, 9).
=> Domain: 2, 4 and 6. Range: 5 and 9.
2. Dots or a line: litres of gas in a tank over time?
=> A line. Time and litres can be any amount.
3. Is (1, 2), (2, 2), (3, 2) a function?
=> Yes. Each input has one output.
4. Find 15% of 60.
=> 10% is 6 and 5% is 3. So 9.
5. ★ Stretch: Sketch a graph that passes the vertical line test. Two inputs must share an output.
=> Answers vary. A hill shape works: the inputs 2 and 6 both give 4.
:::

## Unit Synthesis
1. A car leaves Edmonton for Banff with 50 L of gas. It uses 10 L each hour. The drive takes 4 hours.
a) Make a table. b) Graph it. Dots or a line? c) Find the domain and range in words.
@viz coord xmin=0 xmax=5 ymin=0 ymax=50 ystep=10 keypoints="0,50;1,40;2,30;3,20;4,10" line=1 xlabel="hours" ylabel="gas (L)"
=> a) Hours 0, 1, 2, 3, 4. Gas 50, 40, 30, 20, 10 L.
=> b) A line. Time can be any amount.
=> c) Domain: any time from 0 to 4 hours. Range: any amount from 10 to 50 L.
2. The bowling alley lets you bowl up to 4 games at $6 a game. Find the domain and range.
=> Domain: whole numbers from 0 to 4. Range: $0, $6, $12, $18 and $24.
3. Is this relation a function? Explain how you know.
@viz mapping in="1,2,3" out="4,6,8" arrows="1>4;2>6;3>6;3>8"
=> No. The input 3 has two outputs, 6 and 8. (2 and 3 sharing 6 is fine.)
4. Raj says the domain of the trough is 0 to 120. Explain his mistake.
=> 0 to 120 L is the water, the output. That is the range. The domain is the time: 0 to 6 minutes.
5. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Relations and functions
A relation pairs inputs with outputs: (input, output).
A function gives each input exactly ONE output. Two inputs may share an output.
Input = independent variable. Output = dependent variable.
:::
@viz mapping in="1,2,3" out="5,8" arrows="1>5;2>5;3>8" caption="A function: each input has one arrow."

::: key Graphing from a table
Input across (x). Output up (y).
Counts (games, tickets, people): discrete, dots only.
Time, distance, litres, GB: continuous, a line.
:::
@viz coord xmin=0 xmax=5 ymin=0 ymax=100 ystep=20 points="0,0;1,20;2,40;3,60;4,80" line=1 xlabel="minutes" ylabel="water (L)" width=300

::: key Domain and range
Domain = all the inputs. Range = all the outputs.
Say them in words. Counts: "whole numbers from 0 to 5." Amounts: "any number from 0 to 4."
:::
@viz numberline min=0 max=6 highlight="0,4" points="0;4" width=300 caption="Any number from 0 to 4."

::: key Limits and the vertical line test
Real life sets limits: no negative time or people, a full tank, a full bus.
Vertical line test: does a vertical line hit the graph twice? Then it is NOT a function.
:::
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 circle="4,4,3" vline=3 hits="3,6.83;3,1.17" width=200 caption="Hits twice: not a function."

| Mistake | Fix |
|---|---|
| Every relation is a function | Check for an input with two outputs. |
| (1, 5) and (2, 5) can't be a function | Two inputs may share an output. |
| Always connect the dots | Counts stay as dots. Time and amounts get a line. |
| Mixing up domain and range | Domain = inputs (x). Range = outputs (y). |
| A flat line hits twice, so not a function | Use a vertical line, not a flat one. |
| Negative time or people in the domain | Time and people start at 0. |
