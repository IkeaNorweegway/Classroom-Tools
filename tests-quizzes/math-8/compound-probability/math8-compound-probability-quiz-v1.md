---
title: Independent & Dependent Events
topic: compound-probability
strand: statistics-probability
---
<!-- Gate: outcome map complete. LOs covered: CP1 (outcome 8PR1: sample spaces as lists, tables, trees and
     set notation; counting outcomes of compound events), CP2 (outcome 8PR1: independent events;
     P(A and B) = P(A) × P(B); area model; three events with a tree), CP3 (outcome 8PR1: dependent events;
     without replacement; trees with changed fractions). Every item maps to a specific LO. Marks: 23.
     Given after Section 3, before mixed problems (CP4). Calculators allowed. -->

### [CP1 · 3] Flip a coin and spin this 3-part spinner. a) Draw a tree. b) Write the sample space in set notation. c) How many outcomes?
@viz spin sections="A;B;C" size=100
(work 4)
=> a) H branches to A, B, C. T branches to A, B, C (1 mark).
=> b) S = {HA, HB, HC, TA, TB, TC} (1 mark).
=> c) 2 × 3 = 6 (1 mark).

### [CP1 · 2] A café has 5 soups and 4 kinds of bread. Ryan says there are 9 lunch combos. Is he right? Explain.
(lines 2)
=> No (1 mark). Each soup goes with all 4 breads: 5 × 4 = 20 combos (1 mark).

### [CP1 · 2] Roll two dice. Use the table. Find P(sum of 9).
@viz cpsum rowlabel="red die" collabel="blue die"
(lines 1)
=> (3,6), (4,5), (5,4), (6,3): 4 cells (1 mark).
=> {4/36} = {1/9} (1 mark).

### [CP2 · 3] Flip a coin and roll a die. Find P(heads and a number greater than 4). Write it as a fraction, a decimal and a percent.
@viz area a=1/2 b=2/6 alabel="1/2" blabel="2/6" note1="columns: the die" note2="rows: the coin"
(lines 2)
=> {1/2} × {2/6} = {2/12} = {1/6} (1 mark).
=> ≈ 0.17 (1 mark) ≈ 17% (1 mark).

### [CP2 · 2] Spin a spinner that is {1/3} green two times. Find P(green, green).
(lines 1)
=> Independent (1 mark). {1/3} × {1/3} = {1/9} (1 mark).

### [CP2 · 2] Flip three coins. Find P(three heads). Show it with a tree or by multiplying.
(work 4)
=> 8 outcomes, only HHH (1 mark).
=> {1/2} × {1/2} × {1/2} = {1/8} = 12.5% (1 mark).

### [CP2 · 2] Ella says P(tails and 2) = {1/2} + {1/6}. Explain why she is wrong and fix it.
(lines 2)
=> For "and", multiply, not add (1 mark).
=> {1/2} × {1/6} = {1/12} (1 mark).

### [CP3 · 2] Independent or dependent? a) Draw a counter, put it back, draw again. b) Pick two players from a team list.
(lines 2)
=> a) Independent: the bag is the same (1 mark).
=> b) Dependent: the first player can't be picked again (1 mark).

### [CP3 · 3] A bag has 4 red and 2 blue counters. Draw two without replacement. Find P(blue, blue).
@viz cpdraw before="red:4;blue:2" take="blue" beforelabel="1st draw" afterlabel="2nd draw"
(lines 2)
=> 1st: {2/6}. 2nd: {1/5} (1 mark).
=> {2/6} × {1/5} = {2/30} (1 mark) = {1/15} (1 mark).

### [CP3 · 2] Explain your thinking: in the last question, why is the second fraction not {2/6}?
(lines 2)
=> One blue counter is kept out (1 mark). 5 counters are left and only 1 is blue (1 mark).
