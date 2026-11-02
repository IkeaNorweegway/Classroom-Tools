---
title: Functions
topic: functions
strand: algebra
---
## Core

### Is each relation a function? Write yes or no. Say why.
a) (1, 4), (2, 6), (3, 8)
b) (2, 5), (2, 7), (4, 9)
c) (1, 3), (2, 3), (3, 3)
(lines 3)
=> a) Yes. Each input has one output. (FN1)
=> b) No. The input 2 has two outputs, 5 and 7. Targets the "every relation is a function" mix-up.
=> c) Yes. Each input has one output. They all share 3, and that is allowed. Targets the "two inputs can't share an output" mix-up.

### Is this relation a function? Explain how you know.
@viz mapping in="1,2,3,4" out="2,5,7" arrows="1>2;2>5;3>5;4>7"
(lines 2)
=> Yes. Each input has exactly one arrow. (FN1)
=> The inputs 2 and 3 share the output 5. That is allowed. Targets the "two inputs can't share an output" mix-up.

### A movie ticket costs $4. Fill in the outputs. Then name the independent and dependent variables.
@viz machine in="1;3;5" rule="× 4" out="[[4]];[[12]];[[20]]" inlabel="tickets" outlabel="cost ($)"
(lines 2)
=> Outputs: 1 × 4 = 4, 3 × 4 = 12, 5 × 4 = 20 dollars. (FN1)
=> Independent variable (input): the number of tickets. Dependent variable (output): the cost.

### Mia and Zoe are in homeroom 7A. Ben is in 7B.
a) Is name → homeroom a function?
b) Is homeroom → name a function?
@viz mapping in="Mia,Ben,Zoe" out="7A,7B" arrows="Mia>7A;Ben>7B;Zoe>7A" inlabel="name" outlabel="homeroom"
(lines 2)
=> a) Yes. Each student has one homeroom. Mia and Zoe share 7A, which is allowed. (FN1)
=> b) No. The input 7A has two outputs, Mia and Zoe.

### Bowling costs $6 a game. Fill in the table. Graph it. Dots or a line?
| Games | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Cost ($) | [[0]] | [[6]] | [[12]] | [[18]] | [[24]] |

@viz coord xmin=0 xmax=5 ymin=0 ymax=30 ystep=6 keypoints="0,0;1,6;2,12;3,18;4,24" xlabel="games" ylabel="cost ($)" width=300
(lines 1)
=> Multiply each number of games by 6: 0, 6, 12, 18, 24. (FN2)
=> Plot (0, 0), (1, 6), (2, 12), (3, 18), (4, 24). Dots only: you can't bowl part of a game. It is discrete.

### A hose fills a trough with 25 L each minute. It starts empty. Fill in the table. Graph it. Dots or a line?
| Minutes | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Water (L) | [[0]] | [[25]] | [[50]] | [[75]] | [[100]] |

@viz coord xmin=0 xmax=5 ymin=0 ymax=100 ystep=25 keypoints="0,0;1,25;2,50;3,75;4,100" line=1 xlabel="minutes" ylabel="water (L)" width=300
(lines 1)
=> Add 25 L each minute: 0, 25, 50, 75, 100. (FN2)
=> A line. Time can be any amount, like 2.5 minutes (62.5 L). It is continuous.

### Ben graphs the cost of movie tickets at $8 each. He joins the dots.
a) Is he right? Explain.
b) Dots or a line? Tickets → cost. Minutes biked → km. Bus riders → fare. GB used → cost.
@viz coord xmin=0 xmax=5 ymin=0 ymax=40 ystep=8 points="0,0;1,8;2,16;3,24;4,32" line=1 xlabel="tickets" ylabel="cost ($)" width=300
(lines 3)
=> a) No. You can't buy 2.5 tickets. Tickets are counted, so the graph is discrete: dots only. (FN2) Targets the "always connect the dots" mix-up.
=> b) Tickets: dots. Minutes biked: a line. Bus riders: dots. GB used: a line.

### Find the domain and range of (2, 9), (4, 9), (6, 13), (8, 17).
(lines 2)
=> Domain (inputs): 2, 4, 6 and 8. (FN3)
=> Range (outputs): 9, 13 and 17. Write 9 only once.

### A car drives from Edmonton to Banff. The graph shows the gas in its tank.
a) Find the domain and range in words.
b) Noor says the domain is 10 to 50. Fix her mistake.
@viz coord xmin=0 xmax=5 ymin=0 ymax=50 ystep=10 points="0,50;4,10" line=1 xlabel="hours" ylabel="gas (L)" width=300
(lines 3)
=> a) Domain: any time from 0 to 4 hours. Range: any amount from 10 to 50 L. (FN3)
=> b) 10 to 50 L are the outputs, so that is the range. The domain is the time, 0 to 4 hours. Targets the "domain and range swapped" mix-up.

### A school bus seats 40. Each rider pays $2 for a field trip.
a) Find the domain and range.
b) Can the domain include 45? Explain.
@viz people n=40 cols=10 title="The bus seats 40"
(lines 3)
=> a) Domain: whole numbers from 0 to 40. Range: 0, 2, 4, 6 and so on, up to $80 (40 × 2). (FN4)
=> b) No. Only 40 people fit on the bus.

### Use the vertical line test. Which graphs are functions?
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 circle="4,4,3" width=200 caption="A"
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 path="0,2;2,6;4,5;6,3;8,4" width=200 caption="B"
@viz coord xmin=0 xmax=5 ymin=0 ymax=6 points="1,1;2,4;3,2;3,5" width=200 caption="C"
(lines 3)
=> A: Not a function. A vertical line through the middle hits the circle twice. (FN4)
=> B: A function. Every vertical line hits it once.
=> C: Not a function. The input 3 has two dots, (3, 2) and (3, 5).

### A phone plan costs $20 a month plus $5 a GB. You can use up to 6 GB.
a) Find the domain and range.
b) Leo says the domain starts at −1 GB. Fix his mistake.
(lines 3)
=> a) Domain: any amount from 0 to 6 GB. Range: any cost from $20 to $50 (20 + 6 × 5). (FN4)
=> b) You can't use a negative amount of data. The domain starts at 0 GB.

## Challenge

### Find the rule. Then find the output for 10.
| Input | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Output | 5 | 8 | 11 | 14 |

@viz machine in="1;2;3" rule="[[× 3 + 2]]" out="5;8;11"
(lines 2)
=> Each output goes up by 3. 1 × 3 + 2 = 5 and 2 × 3 + 2 = 8. The rule is × 3, then + 2. (FN1)
=> Input 10: 10 × 3 + 2 = 32.

### Is (1, 4), (2, 4), (3, 6) a function? Now swap each pair to make (4, 1), (4, 2), (6, 3). Is the new relation a function?
@viz mapping in="1,2,3" out="4,6" arrows="1>4;2>4;3>6"
(lines 3)
=> The first relation is a function. Each input has one output; 1 and 2 share 4. (FN1)
=> The swapped relation is not a function. The input 4 has two outputs, 1 and 2.

### A car starts the 4-hour drive to Banff with a full 50 L tank. It uses 8 L each hour.
a) Make a table for 0 to 4 hours.
b) Find the domain and range.
c) Why does the domain stop at 4 hours?
@viz coord xmin=0 xmax=5 ymin=0 ymax=50 ystep=10 keypoints="0,50;4,18" line=1 xlabel="hours" ylabel="gas (L)" width=300
(lines 4)
=> a) 50, 42, 34, 26, 18 L. (FN2)
=> b) Domain: any time from 0 to 4 hours. Range: any amount from 18 to 50 L. (FN4)
=> c) The trip ends at 4 hours. (The tank would not be empty until 50 ÷ 8 = 6.25 hours.)

### The graph shows a winter day in Edmonton, from 6 a.m. (0 hours) to 6 p.m. (12 hours).
a) Find the domain and range.
b) At what time was it warmest?
@viz curve xmin=0 xmax=12 ymin=-6 ymax=4 ystep=2 xevery=2 path="0,-6;2,-5;4,-2;6,1;8,3;10,1;12,-2" xlabel="hours after 6 a.m." ylabel="°C" width=380
(lines 3)
=> a) Domain: any time from 0 to 12 hours after 6 a.m. Range: any temperature from −6 °C to 3 °C. (FN3)
=> b) The highest point is at 8 hours after 6 a.m. That is 2 p.m.

### Zoe draws a flat line across this graph. It hits the graph twice. She says it is not a function. Is she right? Explain.
@viz curve xmin=0 xmax=8 ymin=0 ymax=8 path="0,1;2,4;4,6;6,4;8,1" hline=4 width=220
(lines 3)
=> No. A flat line shows two inputs with the same output (2 and 6 both give 4). That is allowed. (FN4)
=> Use a vertical line. Every vertical line hits the graph once, so it is a function. Targets the flat-line mix-up.

### Make up a real situation with this domain and range. Domain: whole numbers from 0 to 10. Range: 0, 5, 10 and so on, up to 50.
(lines 3)
=> Answers vary. Example: tickets cost $5 each, and you can buy up to 10. (FN4)
=> The input is counted (discrete), it stops at 10, and 10 × 5 = 50.

### A trough holds 100 L. A leak lets out 5 L each minute.
a) Make a table for 0 to 4 minutes. Dots or a line?
b) When is it empty? Find the domain and range.
@viz coord xmin=0 xmax=24 ymin=0 ymax=100 xstep=2 ystep=10 xevery=4 yevery=20 keypoints="0,100;20,0" line=1 xlabel="minutes" ylabel="water (L)" width=360
(lines 4)
=> a) 100, 95, 90, 85, 80 L. A line: time can be any amount. (FN2)
=> b) 100 ÷ 5 = 20 minutes. Domain: any time from 0 to 20 minutes. Range: any amount from 0 to 100 L. (FN4)
