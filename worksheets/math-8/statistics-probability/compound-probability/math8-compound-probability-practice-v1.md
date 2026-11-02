---
title: Independent & Dependent Events
topic: compound-probability
strand: statistics-probability
---
## Core

### Flip a coin and spin this spinner. a) Fill in the tree. b) Write the sample space in set notation. c) How many outcomes are there?
@viz tree first="H,T" second="R,B,G" outcomes=blank
@viz spin sections="red;blue;green" size=100
(lines 2)
=> a) H: R, B, G. T: R, B, G. (CP1)
=> b) S = {HR, HB, HG, TR, TB, TG}
=> c) 2 × 3 = 6 outcomes.

### A food truck sells 4 kinds of tacos and 3 drinks. Nia says there are 4 + 3 = 7 combos. Is she right?
(lines 2)
=> No. Each taco goes with all 3 drinks. (CP1)
=> 4 × 3 = 12 combos. Targets the "add the outcomes" mix-up.

### Roll two dice. a) How many outcomes are in the table? b) Find P(a double), like (3,3).
@viz cpsum op=pair hot="1,1;2,2;3,3;4,4;5,5;6,6" rowlabel="1st die" collabel="2nd die"
(lines 2)
=> a) 6 × 6 = 36 outcomes. (CP1)
=> b) 6 doubles are shaded. P = {6/36} = {1/6} ≈ 0.17 ≈ 17%.

### Independent or dependent? Explain each. a) Spin a spinner twice. b) Draw two cards and keep the first one out. c) Roll a die, then flip a coin. d) Pick two students from a class list for a team.
(lines 4)
=> a) Independent. The spinner doesn't change. (CP3)
=> b) Dependent. One card is gone, so the second draw has different chances.
=> c) Independent. The coin doesn't care about the die.
=> d) Dependent. The first student can't be picked again.

### Flip a coin and roll a die. Find P(tails and 3). Show it with the area model. Check by counting.
@viz area a=1/2 b=1/6 alabel="1/2 tails" blabel="1/6" note1="columns: the die" note2="rows: the coin" result="1/2 × 1/6 = [[1/12]]"
(lines 2)
=> Independent. {1/2} × {1/6} = {1/12}. (CP2)
=> Check: only T3 matches, 1 of 12 outcomes. {1/12} ≈ 0.083 ≈ 8.3%.

### This spinner has 4 equal parts. Mo spins it twice. Find P(blue, then blue) as a fraction, a decimal and a percent.
@viz spin sections="red;blue;yellow;green" size=110
(lines 2)
=> Independent. {1/4} × {1/4} = {1/16}. (CP2)
=> 1 ÷ 16 = 0.0625 = 6.25%.

### Jay says, "P(heads and 5) = {1/2} + {1/6} = {2/3}." Explain his mistake. Find the right answer.
@viz outcomes rows="H,T" cols="1,2,3,4,5,6" highlight="H5" rowlabel="coin" collabel="die"
(lines 2)
=> For "and", multiply. Only H5 matches, 1 of 12 outcomes. (CP2)
=> {1/2} × {1/6} = {1/12}. Targets the "add instead of multiply" mix-up.

### A bag has 2 red and 3 blue counters. Ana draws one, puts it back, and draws again. Find P(blue, blue).
@viz bag counters="red:2;blue:3" out="blue" outlabel="put it back"
(lines 2)
=> With replacement, so independent. P(blue) = {3/5} each time. (CP2)
=> {3/5} × {3/5} = {9/25} = 0.36 = 36%.

### Use the same bag. This time Ana keeps the first counter out. a) Fill in the second fractions. b) Find P(blue, blue).
@viz cptree first="R,B" p1="2/5,3/5" second="R,B|R,B" p2="[[1/4]],[[3/4]]|[[2/4]],[[2/4]]" outcomes=show
(lines 3)
=> a) After R: R {1/4}, B {3/4}. After B: R {2/4}, B {2/4}. (CP3)
=> b) Dependent. {3/5} × {2/4} = {6/20} = {3/10} = 0.3 = 30%.
=> The second fraction is not {3/5}: one blue is out. Targets the "same chances without replacement" mix-up.

### Kim has rolled a die 10 times with no 6. She says, "A 6 is due next." Is she right?
@viz dice values="2,5,1,3,4,?" labels="8th;9th;10th;…;…;11th" size=30
(lines 2)
=> No. The rolls are independent. The die has no memory. (CP2)
=> P(6) is still {1/6} on the next roll. Targets the "it's due" mix-up (gambler's fallacy).

### A drawer has 3 black and 2 white socks. Leo pulls out two socks in the dark. Find P(two white).
@viz cpdraw before="black:3;white:2" take="white" beforelabel="1st: 2 white of 5" afterlabel="2nd: ? white of ?"
(lines 2)
=> Dependent: Leo keeps the first sock. (CP4)
=> {2/5} × {1/4} = {2/20} = {1/10} = 0.1 = 10%.

### The forecast for Edmonton: 30% chance of rain on Saturday and 20% on Sunday. Treat the days as independent. Find P(rain both days).
@viz area a=1/5 b=3/10 alabel="0.2 Sun" blabel="0.3 Sat" note1="columns: Saturday" note2="rows: Sunday" result="0.3 × 0.2 = [[0.06]]"
(lines 2)
=> The problem says independent, so multiply. (CP4)
=> 0.3 × 0.2 = 0.06 = 6%.

## Challenge

### Flip three coins. a) How many outcomes? b) Find P(exactly two heads).
@viz cptree first="H,T" second="H,T" third="H,T" outcomes=blank
(lines 2)
=> a) 2 × 2 × 2 = 8. (CP2)
=> b) HHT, HTH, THH: 3 outcomes. P = {3/8} = 0.375 = 37.5%.

### Roll two dice and add. a) Find P(sum of 8). b) Find P(sum less than 5).
@viz cpsum blank=1 rowlabel="red die" collabel="blue die"
(lines 2)
=> a) (2,6), (3,5), (4,4), (5,3), (6,2): 5 cells. P = {5/36} ≈ 13.9%. (CP4)
=> b) Sums 2, 3, 4: 1 + 2 + 3 = 6 cells. P = {6/36} = {1/6} ≈ 16.7%.

### Six names are in a hat: 4 from Grade 8 and 2 from Grade 7. The coach draws a captain, then an assistant. Find P(both from Grade 7) and P(both from Grade 8).
(lines 3)
=> Dependent. P(both Gr 7) = {2/6} × {1/5} = {2/30} = {1/15} ≈ 6.7%. (CP3)
=> P(both Gr 8) = {4/6} × {3/5} = {12/30} = {2/5} = 40%.

### A hockey coach has 4 forwards, 2 defence and 1 goalie. She draws two names for a shootout. Find P(a forward first, then a defence player).
@viz people n=7 cols=7 groups="1-4:forward;5-6:defence;7:goalie" title="7 players"
(lines 2)
=> Dependent. {4/7} × {2/6} = {8/42} = {4/21} ≈ 0.19 ≈ 19%. (CP4)
=> The second fraction has 6 on the bottom: one name is out.

### Flip a coin and spin this spinner. a) Find P(heads and red). b) Sam adds: {1/2} + {3/4}. Why can't his answer be right?
@viz spin sections="red:3;blue:1" guides=1 size=120
(lines 3)
=> a) Independent. {1/2} × {3/4} = {3/8} = 37.5%. (CP2)
=> b) {1/2} + {3/4} = {5/4}, more than 1. A probability can't be more than 1. Targets the "add instead of multiply" mix-up.

### A Stampede ring toss: P(ring a bottle) = 0.2 on each throw. The throws are independent. You throw twice. Find P(win both) and P(miss both).
@viz cptree first="win,miss" p1="0.2,0.8" second="win,miss" p2="0.2,0.8" outcomes=none
(lines 2)
=> P(win both) = 0.2 × 0.2 = 0.04 = 4%. (CP4)
=> P(miss both) = 0.8 × 0.8 = 0.64 = 64%.

### Four cards: 2 hearts and 2 spades. You pick two. Is two hearts more likely with replacement or without? Show both.
@viz flips kind=card items="♥,♥,♠,♠"
(lines 3)
=> With replacement: {2/4} × {2/4} = {1/4} = 25%. (CP3)
=> Without: {2/4} × {1/3} = {2/12} = {1/6} ≈ 16.7%. With replacement is more likely: no heart is used up.
