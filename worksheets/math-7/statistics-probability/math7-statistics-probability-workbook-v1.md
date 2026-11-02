---
title: Statistics & Probability
strand: statistics-probability
rubric:
  - Samples and statistics: population, census or sample, fair random samples, mean, median, mode and range, comparing samples and drawing conclusions
  - Probability: outcomes and likelihood from 0 to 1, theoretical probability four ways, experimental probability, comparing results and deciding
---
<!-- Gate: interleaving confirmed. No part headers. ★/★★ per topic: samples & statistics (ST), probability (PB) —
     every section code at least once outside the stretch questions, Core first, Extended after the check-in,
     then two mixed stretch questions.
     Contexts from the notes: walleye in a lake, Ridge School's Grade 7s, the census-or-sample flow, friends sitting
     together, the systematic count-on, the name hat, levelling towers, number strips, stacked dot plots, the 0-to-1
     line, bags of counters put back, unequal spinners, number cards, pooled coin flips.
     Every Statistics & Probability misconception in _courses/math-7/_context.md has a Misconception target box. -->

## core | ST1 — Samples & Statistics, Section 1
Leo wants the mean length of the walleye in Lac La Biche. He says, "A census is always better. Let's catch every fish."
@viz flow steps="How big is the population?|Can you reach everyone?|Small and easy: census|Too big or hard: sample" width=600
a) Name the population.
b) Census or sample? (i) the heights of the 12 players on the volleyball team (ii) the lengths of the walleye in the lake
c) Is Leo right? Explain.
d) Is fish length discrete or continuous?
(lines 4)
=> a) All the walleye in Lac La Biche.
=> b) (i) Census. There are only 12 players. You can measure them all. (ii) Sample. The lake has too many fish to catch.
=> c) No. Catching every fish costs too much and takes too long. A fair sample gives a good estimate.
=> d) Continuous. Length is measured. It can be any number, like 41.5 cm.
::: teacher
label: Misconception target
"A census is always better." Ask: how long would it take to catch every fish? What happens to the fish? A census fits only a small group you can reach.
:::

## core | PB1 — Probability, Section 1
A: draw red from a bag of only red counters. B: roll a 7 on a die. C: flip a coin and get heads.
@viz numberline min=0 max=1 step=0.25 ticklabels="0:0;0.25:unlikely;0.5:even chance;0.75:likely;1:1" ends="impossible,certain" keypoints="0:B;0.5:C;1:A" width=520
@viz spin sections="red:1;blue:3" guides=1 size=130
a) Mark A, B and C on the line.
b) Tess says P(blue) is 3. "Three parts are blue." Fix her mistake.
(lines 3)
=> a) B is at 0. It is impossible. C is at {1/2}, even chance. A is at 1. It is certain.
=> b) 3 of the 4 equal parts are blue. P(blue) = {3/4} = 0.75. A probability is from 0 to 1. The 3 is a count, not a probability.
::: teacher
label: Misconception target
"A probability can be 3 (or 120%)." Point to the 0-to-1 line. Ask: where would 3 go? There is no room past certain. Probability = favourable ÷ all, so it can never be more than 1.
:::

## core | ST3 — Samples & Statistics, Section 3
Kai counts his push-ups for 7 days.
Kai says, "The median is 15. It is in the middle." He says the mode and range are both 20. "20 is the biggest."
@viz numstrip rows="12,20,6,15,12,10,14 | [[6]],[[10]],[[12]],[[12]],[[14]],[[15]],[[20]]" labels="As given;In order" notes=";median = [[12]]" hot="1:4" ring="2:4"
a) Put the numbers in order. Find the median.
b) Find the mode.
c) Find the range.
d) Fix Kai's mistakes.
(lines 4)
=> a) 6, 10, 12, 12, 14, 15, 20. The middle (4th) number is 12. The median is 12.
=> b) 12 comes up twice. The mode is 12.
=> c) 20 − 6 = 14. The range is 14.
=> d) Kai did not put the numbers in order first. The mode is the number that comes up most often. The range is biggest − smallest.
::: teacher
label: Misconception target
Two targets. "The median is the middle number in the list as given": cross off from both ends of the *ordered* strip. "The mode (or range) is the biggest number": say the words out loud. Mode = most often. Range = biggest − smallest.
:::

## core | PB2 — Probability, Section 2
The 8 cards are mixed. You draw one without looking.
Sam says P(greater than 6) = {1/2}. "It is greater than 6 or it isn't."
@viz flips kind=card items="1,2,3,4,5,6,7,8" label="8 cards: 8 equally likely outcomes"
a) List the sample space.
b) List the favourable outcomes.
c) Write P(greater than 6) as a ratio, a fraction, a decimal and a percent.
d) Is Sam right?
(lines 4)
=> a) {1, 2, 3, 4, 5, 6, 7, 8}.
=> b) 7 and 8.
=> c) Ratio 2:8. Fraction {2/8} = {1/4}. Decimal 0.25. Percent 25%.
=> d) No. Only 2 of the 8 cards are greater than 6. Count the equally likely outcomes. Two results does not mean 50-50.
::: teacher
label: Misconception target
"It either happens or it doesn't, so it's 50-50." Ask: is "greater than 6" one card or six cards? Count the cards on each side: 2 yes, 6 no.
:::

## core | ST2 — Samples & Statistics, Section 2
Omar wants to know how long Grade 7s sleep. There are 60 Grade 7s. He asks the 5 friends at his lunch table.
@viz people n=30 cols=15 groups="1-5:hot" pick="1,2,3,4,5" label="Omar's friends sit together. Nobody else is picked."
@viz people n=60 cols=20 numbers=1 pick="4" label="Start at 4. Then count on by the jump."
a) Is his sample fair? Explain.
b) Omar wants a systematic random sample of 10 from the list of 60. What jump should he use?
c) He starts at 4. List his picks.
(lines 4)
=> a) No. His friends are alike. They may go to bed at the same time. The other students get no chance.
=> b) 60 ÷ 10 = 6. He picks every 6th name.
=> c) 4, 10, 16, 22, 28, 34, 40, 46, 52, 58. That is 10 names.
::: teacher
label: Misconception target
"Ask your friends — that's a fair sample." Ask: did every Grade 7 have a chance to be picked? A random method gives everyone the same chance.
:::

## core | PB3 — Probability, Section 3
Noor draws a counter, writes the colour, and puts it back. She does this 40 times.
@viz bag counters="red:1;blue:3" out="red" outlabel="put it back"
@viz bar data="red:8;blue:32" ymax=35 ystep=5 values=1 title="Noor's 40 draws" ylabel="times"
a) Find the experimental P(red) as a fraction and a percent.
b) Find the theoretical P(red). Compare.
c) Noor just drew blue 6 times in a row. She says, "Red is due next." Is she right?
(lines 4)
=> a) {8/40} = {1/5} = 20%.
=> b) 1 of 4 counters is red. P(red) = {1/4} = 25%. 20% is close to 25%. It is a bit less.
=> c) No. She puts the counter back. The bag is the same every time: 1 red, 3 blue. P(red) is still {1/4}. Each draw is new.
::: teacher
label: Misconception target
"After 5 heads, tails is due." Here it is "red is due." Ask: does the bag know what came out before? Nothing in the bag changed, so the chance did not change.
:::

## core | ST4 — Samples & Statistics, Section 4
Two random samples of 8 Grade 7s at Ridge School. Each student gives the minutes they walk to school.
Leo says, "Sample A shows the mean for all Ridge Grade 7s is exactly 12 minutes."
@viz dotplot2 data="6,8,10,10,12,14,14,22" data2="6,10,10,12,14,14,18,20" min=4 max=24 step=2 label="Sample A (8 students)" label2="Sample B (8 students)" marks="mean:[[12]]" marks2="mean:[[13]]" xlabel="minutes to walk to school"
a) Find the mean of each sample.
b) Why are the means different?
c) Is Leo right? Explain.
d) Put the samples together. Find the mean of all 16.
(lines 5)
=> a) A: 6 + 8 + 10 + 10 + 12 + 14 + 14 + 22 = 96. 96 ÷ 8 = 12 min. B: 6 + 10 + 10 + 12 + 14 + 14 + 18 + 20 = 104. 104 ÷ 8 = 13 min.
=> b) Each sample has different students. Samples always vary a little.
=> c) No. A sample gives an estimate, not the exact answer. The mean for all Grade 7s is probably about 12 or 13 minutes.
=> d) 96 + 104 = 200. 200 ÷ 16 = 12.5 min. A bigger sample gives a better estimate.
::: teacher
label: Misconception target
"A sample tells us the exact answer for everyone." The two samples disagree, so neither can be exact. Use the words "about" and "estimate" in every conclusion.
:::

## CHECKIN

## ext | PB4 — Probability, Section 4
Ben says, "P(heads) = {1/2}. So 10 flips give exactly 5 heads." Six groups each flip a coin 10 times.
@viz bar data="G1:6;G2:3;G3:5;G4:7;G5:4;G6:5" ymax=8 ystep=1 values=1 title="Heads in 10 flips" ylabel="heads"
a) How many groups got exactly 5 heads?
b) Pool the data. Find the experimental P(heads) for all 60 flips.
c) Is Ben right? Explain.
d) Predict the number of heads in 200 flips.
(lines 5)
=> a) 2 groups (G3 and G6).
=> b) 6 + 3 + 5 + 7 + 4 + 5 = 30 heads. P(heads) = {30/60} = {1/2} = 0.5.
=> c) No. Results vary from group to group. Over many trials they get close to {1/2}. The pooled 60 flips hit 0.5.
=> d) {1/2} × 200 = about 100 heads. Not exactly 100.
::: teacher
label: Misconception target
"If P = ½, 10 flips give exactly 5 heads." Four of six groups did not get 5. Theory predicts *about*. Pooling more trials brings the result closer.
:::

## ext | ST3 — Samples & Statistics, Section 3
Four friends count the books they read this summer.
@viz levelling data="3,6,2,5" labels="Ava;Sam;Mia;Raj" meanline=1 meanlabel="mean = [[4]]" beforelabel="Books read" cell=12
a) Find the mean.
b) Tess joins. Now the mean of all 5 friends is 6. How many books did Tess read?
c) Find the median of all 5.
d) The median was 4. Which changed more, the mean or the median? Why?
(lines 5)
=> a) 3 + 6 + 2 + 5 = 16. 16 ÷ 4 = 4 books.
=> b) 5 friends × 6 = 30 books in all. 30 − 16 = 14. Tess read 14 books.
=> c) In order: 2, 3, 5, 6, 14. The median is 5.
=> d) The mean went up 2 (4 to 6). The median went up 1 (4 to 5). One big value pulls the mean more.

## ext | PB1 — Probability, Section 1
Roll a fair die. A: roll less than 3. B: roll an odd number. C: roll less than 7.
@viz dice label="A fair die: 6 equally likely outcomes"
a) List the favourable outcomes for A, B and C.
b) Which is more likely, A or B? Explain.
c) Which event is certain? Write its probability.
d) Write a die event with a probability of 0.
(lines 4)
=> a) A: 1, 2. B: 1, 3, 5. C: 1, 2, 3, 4, 5, 6.
=> b) B. It has 3 favourable outcomes. A has only 2. P(A) = {2/6} and P(B) = {3/6}.
=> c) C. Every face is less than 7. P(C) = {6/6} = 1.
=> d) Sample answer: roll an 8. No face shows 8, so P = 0.

## ext | ST2 — Samples & Statistics, Section 2
Question: how long do the 120 Grade 7s at Ridge School play outside each day? Pick 10 students.
Plan A: ask the 10 kids in the outdoor club. Plan B: draw 10 names from a hat. Plan C: number the list, pick a random start, count on.
@viz hat names="Ava,Sam,Noor,Leo,Mia,Raj,Kai,Zoe" out="Tess;Ben;[[ ]]" label="all 120 names" outlabel="draw 10 names"
a) Name the population.
b) Which plans are fair? Explain each.
c) Plan C: what jump gives 10 names? Start at 7. List the picks.
(lines 5)
=> a) All 120 Grade 7s at Ridge School.
=> b) A is biased. The outdoor club likes to play outside, so the answer would be too high. B is fair: simple random. Every name has the same chance. C is fair: systematic random.
=> c) 120 ÷ 10 = 12. Picks: 7, 19, 31, 43, 55, 67, 79, 91, 103, 115.

## ext | PB2 — Probability, Section 2
The spinner has 8 equal pieces.
@viz spin sections="red:3;blue:2;yellow:1;green:2" guides=1 size=160
a) Fill in the table.

| colour | red | blue | yellow | green |
|---|---|---|---|---|
| fraction | {[[3]]/8} | {[[2]]/8} | {[[1]]/8} | {[[2]]/8} |
| decimal | [[0.375]] | [[0.25]] | [[0.125]] | [[0.25]] |
| percent | [[37.5%]] | [[25%]] | [[12.5%]] | [[25%]] |

b) Show that the probabilities add to 1.
c) Find P(not red).
d) Which two colours are equally likely?
e) Predict the number of reds in 80 spins.
(lines 5)
=> a) Red {3/8} = 0.375 = 37.5%. Blue {2/8} = 0.25 = 25%. Yellow {1/8} = 0.125 = 12.5%. Green {2/8} = 0.25 = 25%.
=> b) {3/8} + {2/8} + {1/8} + {2/8} = {8/8} = 1. Or 37.5% + 25% + 12.5% + 25% = 100%.
=> c) 1 − {3/8} = {5/8} = 0.625 = 62.5%.
=> d) Blue and green. Each has 2 pieces.
=> e) {3/8} × 80 = 30. About 30 reds.

## stretch | ST3 + PB3 — Statistics and Experiments
Mia rolls a die 10 times. She says the die is unfair. "I got too many 6s."
@viz dice values="3,6,1,6,2,5,6,4,6,1" hot="6" size=30 label="Mia's 10 rolls"
a) Find the mean, median, mode and range of her rolls.
b) Find the experimental P(6) as a decimal and a percent.
c) Find the theoretical P(6). Compare.
d) Is the die unfair? How could Mia find out?
(lines 6)
=> a) Sum: 40. Mean: 40 ÷ 10 = 4. In order: 1, 1, 2, 3, 4, 5, 6, 6, 6, 6. Median: (4 + 5) ÷ 2 = 4.5. Mode: 6. Range: 6 − 1 = 5.
=> b) 4 sixes in 10 rolls. {4/10} = 0.4 = 40%.
=> c) {1/6} ≈ 0.17, about 17%. 40% is much higher.
=> d) We can't tell yet. 10 rolls is too few. Roll it many times, like 300. A fair die gives about 50 sixes in 300 rolls.

## stretch | ST2 + PB2 — Samples and Chance
Ridge School has 120 Grade 7s. 30 of them ride the bus.
@viz people n=40 cols=10 groups="1-10:cold" label="1 in 4 Grade 7s ride the bus (blue)"
a) One name is drawn from a hat. Find P(bus rider) as a fraction, a decimal and a percent.
b) Kai draws a random sample of 20 names. Predict the number of bus riders.
c) His sample has 7 bus riders. Is his sample wrong? Explain.
d) How could he get a closer estimate?
(lines 5)
=> a) {30/120} = {1/4} = 0.25 = 25%.
=> b) {1/4} × 20 = 5. About 5 bus riders.
=> c) No. Random samples vary. 7 is close to 5. The sample gives an estimate, not the exact answer.
=> d) Use a bigger random sample, or pool several samples.
