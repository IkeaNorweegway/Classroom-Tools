---
title: Functions
topic: functions
strand: algebra
---
<!-- Gate: outcome map complete. LOs covered: FN1 (outcome 7F1: relations, ordered pairs, mapping diagrams, function or not,
     independent and dependent variables), FN2 (outcome 7F1: graph a function from a table of values; discrete vs. continuous).
     Every item maps to a specific LO. Marks: 22.
     Given at the start of Lesson 3, after relations and graphing, before domain and range (FN3) and limits (FN4). -->

### [FN1 · 2] A bus ride costs $3. Write the ordered pairs from the table. Name the input and the output.
| Rides | 1 | 2 | 3 |
|---|---|---|---|
| Cost ($) | 3 | 6 | 9 |

(lines 2)
=> (1, 3), (2, 6), (3, 9) (1 mark). Input: the number of rides. Output: the cost (1 mark).

### [FN1 · 3] The rule is + 7. Find each output.
@viz machine in="2;5;9" rule="+ 7" out="[[9]];[[12]];[[16]]"
=> 9, 12 and 16. 1 mark each.

### [FN1 · 2] Is this relation a function? Say why.
@viz mapping in="3,4,5" out="6,8,10,12" arrows="3>6;4>8;5>10;5>12"
(lines 2)
=> Not a function (1 mark). The input 5 has two outputs, 10 and 12 (1 mark).

### [FN1 · 2] Is (1, 9), (2, 9), (3, 9) a function? Say why.
(lines 2)
=> Yes (1 mark). Each input has one output; two inputs may share an output (1 mark).

### [FN1 · 2] A trough fills with water. Minutes and litres change. Which is the independent variable? Which is the dependent variable?
(lines 2)
=> Independent: minutes (1 mark). Dependent: litres of water, because the water depends on the time (1 mark).

### [FN2 · 3] A candle is 15 cm tall. It burns 3 cm each hour. Fill in the table.
| Hours | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Height (cm) | 15 | [[12]] | [[9]] | [[6]] |

=> 12, 9 and 6. 1 mark each.

### [FN2 · 3] Graph the candle table. Dots or a line?
@viz coord xmin=0 xmax=5 ymin=0 ymax=15 ystep=3 keypoints="0,15;1,12;2,9;3,6" line=1 xlabel="hours" ylabel="height (cm)" width=300
(lines 1)
=> All four points plotted correctly (2 marks; 1 mark for 2–3 points). A line, because time can be any amount (1 mark).

### [FN2 · 3] Dots or a line? a) people at an Oilers game → ticket money b) km driven to Banff → litres of gas used c) minutes → litres in a trough
(lines 3)
=> a) Dots: people are counted. b) A line: km can be any amount. c) A line: time can be any amount. 1 mark each.

### [FN2 · 2] Raj graphs tickets sold and the money he collects. Should he join the dots? Explain how you know.
@viz coord xmin=0 xmax=5 ymin=0 ymax=20 ystep=4 points="1,4;2,8;3,12;4,16" xlabel="tickets" ylabel="money ($)" width=280
(lines 2)
=> No, leave the dots (1 mark). Tickets are counted: you can't sell part of a ticket, so the graph is discrete (1 mark).
