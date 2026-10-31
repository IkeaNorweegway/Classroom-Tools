---
title: Probability
topic: probability
strand: statistics-probability
---
<!-- Gate: one ticket per cluster. Every question maps to a specific LO (PB1: outcome 7PR1.1; PB2–PB4: outcome 7PR1.2). -->

## Section 1: Outcomes, events and likelihood
Target: I can list the outcomes. I can say how likely an event is, from impossible to certain. (PB1)
### A bag has 4 red and 2 blue counters. Which colour is more likely to be drawn?
@viz bag counters="red:4;blue:2"
(lines 1)
=> Red. There are more red counters than blue ones.
### Impossible, unlikely, even chance, likely or certain? a) Roll a number less than 7. b) Roll a 6.
@viz numberline min=0 max=1 step=0.25 ticklabels="0:0;0.25:unlikely;0.5:even chance;0.75:likely;1:1" ends="impossible,certain" width=460
(lines 1)
=> a) certain b) unlikely
### Mia says P(score a goal) = 2. Explain how you know she is wrong.
(lines 2)
=> A probability is from 0 to 1. The favourable outcomes can't be more than all the outcomes. So it can't be 2.

## Section 2: Theoretical probability
Target: I can list the sample space. I can find a probability as a ratio, fraction, decimal and percent. (PB2)
### A bag has 1 red and 4 blue counters. Find P(blue) as a ratio, a fraction, a decimal and a percent.
@viz bag counters="red:1;blue:4"
(lines 2)
=> 4:5 (blue to all), {4/5}, 0.8, 80%
### Find P(roll a number greater than 2) on a die.
@viz dice size=30
(lines 1)
=> 3, 4, 5 and 6 match. {4/6} = {2/3}
### A spinner has 4 equal parts. One is red. Sam says P(red) = {1/2}, because "it's red or it's not." Explain how you know he is wrong.
@viz spin sections="red;blue;yellow;green" size=120
(lines 2)
=> There are 4 equally likely parts. Only 1 is red. P(red) = {1/4}, not {1/2}.

## Section 3: Experimental probability
Target: I can do an experiment. I can find the experimental probability from my results. (PB3)
### Leo spins a spinner 50 times. Red comes up 15 times. Find the experimental P(red) as a decimal and a percent.
@viz bar data="red:15;blue:13;yellow:10;green:12" ymax=16 ystep=4 values=1 title="50 spins" ylabel="times" height=110
(lines 1)
=> {15/50} = 0.3 = 30%
### Noor flips heads 3 times in a row. What is P(heads) on the next flip? Explain how you know.
@viz flips items="H,H,H,?" under="1st;2nd;3rd;next"
(lines 2)
=> {1/2}. The coin has no memory. Each flip is a new trial, so the chances stay the same.

## Section 4: Comparing and deciding
Target: I can predict results from theory. I can compare results to theory. I can use probability to decide. (PB4)
### Predict the number of 6s in 300 rolls of a die.
(lines 1)
=> {1/6} × 300 = 300 ÷ 6 = about 50
### Zoe wins on red or blue. Omar wins on green or yellow. Is the game fair?
@viz spin sections="red;blue;green;yellow" size=120
(lines 1)
=> Yes. Each player has {2/4} = {1/2}.
### Ben flips a coin 10 times. He gets 8 heads. He says the coin is unfair. Is he right? Explain how you know.
(lines 2)
=> Not for sure. 10 flips is only a few trials, and results vary a lot. He should flip many more times. If it stays near {1/2}, the coin is fair.
