---
title: Tables and Graphs
course: math7
topic: functions
strand: algebra
skill: telling if a relation is a function, and graphing a function from a table
time: about 15 minutes
notes: math7/view/notes/functions/math7-functions-notes-v1
sections: s1, s2
---
<!-- Gate: One skill: reading a relation (function or not) and graphing a function from a table, dots or a line.
     Worked example first, then fading support: Q1–3 have hints, Q4–6 on their own.
     Maps to: FN1, FN2. Fits one printed page. -->

::: tip
**For the adult:** A function gives each input exactly ONE output. Two inputs may share an output. To graph, put the input across and the output up. Counts (tickets, people) get dots. Time and amounts (minutes, litres) get a line.
:::

::: example
**Bowling costs $6 a game. Make a table and graph it.**
@viz coord xmin=0 xmax=4 ymin=0 ymax=24 ystep=6 points="0,0;1,6;2,12;3,18" xlabel="games" ylabel="cost ($)" width=220 cell=22
Step 1: Multiply each number of games by 6: 0, 6, 12, 18. Write the pairs: (0, 0), (1, 6), (2, 12), (3, 18).
Step 2: Plot each pair: games across, cost up. You can't bowl half a game, so leave the dots apart.
:::

## Your turn

**1.** Is it a function? a) (1, 5), (2, 7), (3, 9) b) (4, 1), (4, 2) ___ *(Does any input have two outputs?)*

**2.** Dots or a line: the number of tickets sold and the money collected? ___ *(Can you sell half a ticket?)*

**3.** Is this a function? ___ *(Two inputs may share an output.)*
@viz mapping in="1,2,3" out="3,5" arrows="1>3;2>3;3>5"
**4.** A bus ride costs $3. Fill in the outputs.
@viz machine in="1;2;4" rule="× 3" out="[[3]];[[6]];[[12]]" inlabel="rides" outlabel="cost ($)"
**5.** A trough gets 20 L of water each minute. It starts empty. Find the water after 0, 1, 2 and 3 minutes. Graph it. Dots or a line? ___
@viz coord xmin=0 xmax=4 ymin=0 ymax=60 ystep=20 keypoints="0,0;1,20;2,40;3,60" line=1 xlabel="minutes" ylabel="water (L)" width=220 cell=22
**6.** You buy gas. The cost depends on the litres. Which is the input? Which is the output? ___

::: check
I can tell if a relation is a function and graph it from a table. ☐ Yes ☐ Almost ☐ Not yet
:::
