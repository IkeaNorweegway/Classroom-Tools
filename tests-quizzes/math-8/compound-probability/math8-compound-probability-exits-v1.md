---
title: Independent & Dependent Events
topic: compound-probability
strand: statistics-probability
---
<!-- Gate: one ticket per cluster. Every question maps to a specific LO (CP1–CP4, all outcome 8PR1). -->

## Section 1: Sample spaces
Target: I can show the sample space of one or two events. I can use a list, a table, a tree diagram and set notation. (CP1)
### Spin this spinner and flip a coin. Write the sample space in set notation.
@viz spin sections="red;blue" size=90
(lines 1)
=> S = {RH, RT, BH, BT}
### How many outcomes are there when you roll a die and spin a 5-part spinner?
(lines 1)
=> 6 × 5 = 30
### Explain how you know a coin and a die do not give 8 outcomes.
(lines 2)
=> Each coin result pairs with all 6 die results. 2 × 6 = 12, not 2 + 6.

## Section 2: Independent events
Target: I can tell when two events are independent. I can find P(A and B) by multiplying. (CP2)
### Flip a coin and roll a die. Find P(heads and an odd number).
@viz area a=1/2 b=3/6 alabel="1/2" blabel="3/6 odd" note1="columns: the die" note2="rows: the coin" result="1/2 × 3/6 = [[3/12]]"
(lines 1)
=> {1/2} × {3/6} = {3/12} = {1/4} = 25%
### A bag has 1 red and 4 blue counters. Draw, put it back, draw again. Find P(red, red).
@viz bag counters="red:1;blue:4" out="red" outlabel="put it back"
(lines 1)
=> {1/5} × {1/5} = {1/25} = 0.04 = 4%
### You flip 4 tails in a row. Explain how you know P(heads) on the next flip.
(lines 2)
=> The flips are independent. The coin has no memory. P(heads) is still {1/2}.

## Section 3: Dependent events
Target: I can tell when two events are dependent. I can find the probability by modelling the sample space. (CP3)
### A bag has 3 red and 1 blue counter. Draw two without replacement. Fill in the second fractions.
@viz cptree first="R,B" p1="3/4,1/4" second="R,B|R,B" p2="[[2/3]],[[1/3]]|[[3/3]],[[0/3]]" outcomes=show
(lines 1)
=> After R: R {2/3}, B {1/3}. After B: R {3/3}, B {0/3}.
### Find P(red, red) for the same bag.
(lines 1)
=> {3/4} × {2/3} = {6/12} = {1/2} = 50%
### Explain how you know the second draw is not {3/4} again.
(lines 2)
=> One red is kept out. Only 3 counters are left, and 2 are red. So it's {2/3}.

## Section 4: Probability problems
Target: I can decide if events are independent or dependent. I can model and solve problems with two events. (CP4)
### Five names are in a hat: 2 girls and 3 boys. Two names are drawn for team captains. Find P(two girls).
@viz hat names="Ava,Zoe,Raj,Leo,Sam" title="5 names"
(lines 1)
=> Dependent. {2/5} × {1/4} = {2/20} = {1/10} = 10%
### Roll two dice. Find P(sum of 4).
@viz cpsum hot="4"
(lines 1)
=> (1,3), (2,2), (3,1): {3/36} = {1/12} ≈ 8.3%
### Explain how you know whether the captain draw is independent or dependent.
(lines 2)
=> Dependent. The first name is not put back, so the second draw has one fewer name.
