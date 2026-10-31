---
title: Probability
topic: probability
strand: statistics-probability
---
## Core

### Event: roll an even number on a die. a) List all the outcomes. b) List the favourable outcomes.
@viz dice size=30
(lines 2)
=> a) 1, 2, 3, 4, 5, 6. (PB1)
=> b) 2, 4 and 6 are even. They are the favourable outcomes.

### Impossible, unlikely, even chance, likely or certain? a) Draw red from a bag of only red counters. b) Flip a coin and get tails. c) Roll a 7 on a die. d) Spin blue on a spinner that is {3/4} blue.
@viz numberline min=0 max=1 step=0.25 ticklabels="0:0;0.25:unlikely;0.5:even chance;0.75:likely;1:1" ends="impossible,certain" width=480
(lines 2)
=> a) certain (1) b) even chance ({1/2}) (PB1)
=> c) impossible (0) d) likely ({3/4})

### Raj says, "The chance of rain tomorrow is 130%." Fix his mistake.
(lines 2)
=> A probability is from 0 to 1, or 0% to 100%. It can't be 130%. (PB1)
=> If rain is certain, the chance is 100%. Targets the "probability can be more than 1" mix-up.

### A bag has 2 red, 3 blue and 5 yellow counters. Find P(blue) as a ratio, a fraction, a decimal and a percent.
@viz bag counters="red:2;blue:3;yellow:5" label="10 counters"
(lines 2)
=> All counters: 2 + 3 + 5 = 10. Blue: 3. (PB2)
=> Ratio 3:10 (blue to all). Fraction {3/10}. Decimal 3 ÷ 10 = 0.3. Percent 30%.

### Lily says, "P(roll a 5) = {1/2}. You roll a 5 or you don't." Is she right?
@viz dice hot="5" size=30
(lines 2)
=> No. A die has 6 equally likely outcomes. Only one of them is a 5. (PB2)
=> P(roll a 5) = {1/6}. Targets the "it happens or it doesn't, so it's 50-50" mix-up.

### Find P(green) and P(red) on this spinner. Write each as a fraction and a percent.
@viz spin sections="green:3;red:1" guides=1 size=140 label="The dashed lines make equal pieces."
(lines 2)
=> There are 4 equal pieces. Green covers 3. Red covers 1. (PB2)
=> P(green) = {3/4} = 75%. P(red) = {1/4} = 25%.

### Use the bag in Question 4. a) Find P(red) and P(yellow) as decimals. b) Show that P(red), P(blue) and P(yellow) add to 1. c) Find P(not yellow).
(lines 3)
=> a) P(red) = {2/10} = 0.2. P(yellow) = {5/10} = 0.5. (PB2)
=> b) 0.2 + 0.3 + 0.5 = 1.
=> c) P(not yellow) = 1 − 0.5 = 0.5. (Red and blue are 5 of the 10 counters.)

### Ava spins a spinner with 4 equal parts 60 times. Find the experimental P(red). Compare it to the theoretical P(red).
@viz bar data="red:18;blue:12;yellow:16;green:14" ymax=20 ystep=5 values=1 title="60 spins" ylabel="times" height=130
(lines 3)
=> Experimental P(red) = {18/60} = {3/10} = 0.3 = 30%. (PB3)
=> Theoretical P(red) = {1/4} = 0.25 = 25%.
=> The experiment is a bit higher than the theory. That is normal: results vary.

### Tess rolls a die 8 times. She gets no 6s. She says, "My next roll is sure to be a 6." Is she right?
@viz dice values="3,1,5,2,4,1,2,5,?" size=26
(lines 2)
=> No. The die has no memory. Each roll is a new trial. (PB3)
=> P(roll a 6) is still {1/6} on the next roll. Targets the "it's due" mix-up.

### This spinner is spun 80 times. a) Predict the number of reds. b) Noor says she will get exactly 20 reds. Is she right?
@viz spin sections="red;blue;yellow;green" size=120
(lines 3)
=> a) P(red) = {1/4}. {1/4} × 80 = 80 ÷ 4 = 20. Predict about 20 reds. (PB4)
=> b) No. Results vary. She will get about 20 reds, maybe 17 or 23.
=> Targets the "exactly matches the theory" mix-up.

### Ben and Zoe play a dice game. Ben wins on 1, 2, 3 or 4. Zoe wins on 5 or 6. Is the game fair? If not, fix it.
@viz dice labels="Ben;Ben;Ben;Ben;Zoe;Zoe" size=30
(lines 3)
=> P(Ben wins) = {4/6} = {2/3}. P(Zoe wins) = {2/6} = {1/3}. (PB4)
=> The chances are not the same. The game is not fair.
=> Fix: Ben wins on 1, 2 or 3. Zoe wins on 4, 5 or 6. Each has {3/6} = {1/2}.

### The forecast for Calgary says a 60% chance of rain. a) Find P(no rain). b) Should Omar bring a raincoat? c) It stayed dry. Was the forecast wrong?
@viz percentbar percent=60 top="0%,60%,100%" toplabel="rain" width=420
(lines 3)
=> a) P(no rain) = 100% − 60% = 40%. (PB4)
=> b) Yes. Rain is more likely than no rain.
=> c) No. 60% is likely, not certain. A 40% chance happens often.

## Challenge

### A bag has 12 counters. P(red) = {1/4} and P(blue) = {1/3}. The rest are yellow. How many of each colour? Find P(yellow).
(lines 3)
=> Red: {1/4} × 12 = 3. Blue: {1/3} × 12 = 4. (PB2)
=> Yellow: 12 − 3 − 4 = 5. P(yellow) = {5/12}.
=> Check: {3/12} + {4/12} + {5/12} = {12/12} = 1.

### Design a bag with P(red) = 0.5, P(blue) = 0.3 and P(green) = 0.2. Use as few counters as you can.
(lines 2)
=> 0.5 = {5/10}, 0.3 = {3/10}, 0.2 = {2/10}. (PB2)
=> 5 red, 3 blue and 2 green: 10 counters. They add to 1.

### Kai picks one of 3 Oilers games to watch, at random. He uses a die to simulate it. a) How can a die stand for 3 equal choices? b) In 30 rolls, game A came up 12 times. Find the experimental P(A). Compare it to the theory.
@viz dice labels="A;A;B;B;C;C" size=30
(lines 3)
=> a) Rolls 1 or 2 = game A. 3 or 4 = game B. 5 or 6 = game C. Each has {2/6} = {1/3}. (PB3)
=> b) Experimental P(A) = {12/30} = 0.4 = 40%.
=> Theoretical P(A) = {1/3} ≈ 33%. The results differ. 30 rolls is not very many.

### Zoe flips a coin 10 times and gets 8 heads. She says the coin is unfair. Then she flips it 500 times in all. Use the graph. Is the coin fair?
@viz trials data="10:0.8;50:0.6;100:0.55;500:0.508" theory=0.5 theorylabel="theory: 0.5" xlabel="flips so far" ylabel="P(heads)" height=120 width=380
(lines 3)
=> 10 flips is only a few trials. Results can be far from {1/2}. (PB4)
=> After 500 flips, P(heads) = 0.508, or about 51%. That is very close to 0.5.
=> The coin is likely fair. Targets the "a few trials must match the theory" mix-up.

### Four groups each spin a 4-part spinner 25 times. Find each group's experimental P(red). Then pool the data. Which result is best? Why?
@viz bar data="Group 1:9;Group 2:4;Group 3:7;Group 4:5" ymax=10 ystep=2 values=1 title="Reds in 25 spins" ylabel="reds" height=120
(lines 3)
=> Groups: {9/25} = 0.36, {4/25} = 0.16, {7/25} = 0.28, {5/25} = 0.2. (PB4)
=> Pooled: 9 + 4 + 7 + 5 = 25 reds in 100 spins = 0.25.
=> The pooled result is best. It has the most trials. It matches the theory, {1/4}.

### Ava wins on red. Sam wins on blue. Is the game fair? If not, change who wins on yellow to make it fair.
@viz spin sections="red:2;blue:1;yellow:1" size=130
(lines 3)
=> Split red into 2 equal pieces: 4 equal pieces in all. (PB4)
=> P(Ava) = {2/4} = {1/2}. P(Sam) = {1/4}. Not fair. Yellow wins for nobody.
=> Fix: Sam wins on blue or yellow. Then P(Sam) = {2/4} = {1/2}. Now it is fair.

### Win a prize if you draw red. Omar says, "Pick Bag A. It has more red counters." Is he right?
@viz bag counters="red:6;blue:14" label="Bag A" cols=5
@viz bag counters="red:2;blue:3" label="Bag B"
(lines 3)
=> Bag A: P(red) = {6/20} = 0.3 = 30%. Bag B: P(red) = {2/5} = 0.4 = 40%. (PB4)
=> Omar is wrong. Bag B gives a bigger chance of red.
=> Compare the probabilities, not the counts.
