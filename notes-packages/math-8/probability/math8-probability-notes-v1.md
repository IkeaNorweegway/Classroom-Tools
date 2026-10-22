---
title: Probability
topic: probability
strand: statistics-probability
---
<!-- Gate: progressive blanking confirmed. Refutation-first on: "after 5 heads, tails is due" (PB2), "P(A and B) = P(A) + P(B)" (PB3),
     "theoretical probability says exactly what will happen" (PB4).
     Section order: one event (PB1) → two events with trees and tables (PB2) → the multiply rule (PB3) → testing with experiments (PB4).
     Codes PB1–PB4. Outcome SP2. Independent events only. -->

## Pre-Knowledge Check
1. You flip a coin. What is the chance of heads? How do you know?
2. You roll a die. Is rolling a 6 harder than rolling a 1? Why?
3. A coin landed on heads 5 times in a row. What do you think the next flip will be?

## Section 1: Outcomes and probability
Learning target: I can list the outcomes of an event and write its probability as a fraction, a decimal and a percent.

### Vocabulary
- outcome :: one possible result :: rolling a 4
- sample space :: the list of all possible outcomes :: {1, 2, 3, 4, 5, 6}
- event :: the outcome (or outcomes) you are interested in :: rolling an even number
- favourable outcome :: an outcome that makes the event happen :: 2, 4 or 6 for "even"
- probability :: how likely an event is, from 0 (impossible) to 1 (certain) :: P(heads) = {1/2}

::: key Probability of an event
P(event) = {number of favourable outcomes/number of possible outcomes}
:::

@viz numberline min=0 max=1 step=0.25 every=1 ticklabels="0:0;0.5:½;1:1" points="0:impossible;0.5:even chance;1:certain" caption="Probability goes from 0 (impossible) to 1 (certain)."

::: example Worked Example 1 — Rolling a die
Sample space: {1, 2, 3, 4, 5, 6}. There are [[6]] outcomes.
P(rolling a 4) = {[[1]]/6}
P(rolling an even number) = {[[3]]/6} = {1/2} = [[0.5]] = [[50%]]
P(rolling a 7) = [[0]] (impossible)
:::

::: example Worked Example 2 — A spinner
@viz spinner sections="red,blue,blue,green"
The spinner has 4 equal parts.
P(blue) = {[[2]]/4} = {1/2} = [[50%]]
P(red) = {1/4} = [[0.25]] = [[25%]]
:::

::: explain
Why is P(blue) bigger than P(red) on this spinner?
(lines 2)
=> Blue covers 2 of the 4 equal parts, but red covers only 1.
:::

::: try
A bag has 3 red, 5 blue and 2 yellow marbles. You pick one without looking.
a) How many outcomes in all? [[10]]
b) P(blue) = [[{5/10} = {1/2} = 50%]]
c) P(not red) = [[{7/10} = 70%]]
d) P(green) = [[0]]
:::

::: retrieval
1. What is the sample space for flipping a coin?
=> {heads, tails}
2. Find P(rolling a number less than 3) on a die.
=> 2/6 = 1/3 (about 33%)
3. A spinner has 5 equal parts: 2 are green. Write P(green) as a fraction, decimal and percent.
=> 2/5 = 0.4 = 40%
4. What does a probability of 0 mean? Of 1?
=> 0: it can't happen. 1: it will certainly happen.
5. ★ Stretch: Design a spinner where P(red) = 75%. Draw it.
(work 2)
=> 4 equal parts with 3 red (or any spinner where red covers 3/4).
:::

## Section 2: Two events — trees and tables
Learning target: I can list all the outcomes of two independent events with a tree diagram or a table.

### Vocabulary
- independent events :: one event does not change the chances of the other :: flipping a coin and rolling a die
- tree diagram :: branches show every outcome, step by step :: H → 1, 2, 3…
- outcome table :: rows for one event, columns for the other :: coin × die

Flip a coin AND roll a die. Show every outcome.

::: example Worked Example 3 — Tree diagram
@viz tree first="H,T" second="1,2,3,4,5,6"
Each coin outcome has [[6]] branches. Total outcomes = 2 × 6 = [[12]].
:::

::: example Worked Example 4 — Table
@viz outcomes rows="H,T" cols="1,2,3,4,5,6" highlight="H6" rowlabel="coin" collabel="die"
P(heads and a 6) = {[[1]]/[[12]]}
P(tails and an even number) = {[[3]]/12} = {1/4}
:::

::: explain
How can you find the number of outcomes without drawing the whole tree?
(lines 2)
=> Multiply the number of outcomes for each event: 2 × 6 = 12.
:::

::: misconception
WRONG: "The coin landed on heads 5 times in a row, so tails is due next."
WHY: Each flip is independent. The coin has no memory of the last flips.
RIGHT: P(tails) is still {1/2} on every flip, no matter what came before.
:::

::: try
Spin the spinner (red, blue, green — equal parts) and flip a coin.
a) Draw a tree diagram.
@viz tree first="Red,Blue,Green" second="H,T" outcomes=blank
b) How many outcomes? [[6]]
c) P(blue and heads) = [[{1/6}]]
d) P(not red and tails) = [[{2/6} = {1/3}]]
:::

::: retrieval
1. What are independent events? Give an example.
=> Events where one does not change the chances of the other, like rolling two dice.
2. How many outcomes when you flip two coins? List them.
=> 4: HH, HT, TH, TT
3. Two dice are rolled. How many outcomes are there?
=> 6 × 6 = 36
4. Ana rolled five 1s in a row. She says a 1 is now "less likely." Explain why she is wrong.
=> Each roll is independent. P(1) is still 1/6 every time.
5. ★ Stretch: Flip two coins. P(at least one head)?
=> HH, HT, TH: 3/4
:::

## Section 3: The multiply rule
Learning target: I can use P(A and B) = P(A) × P(B) for independent events, and check it with a table.

### Vocabulary
- P(A and B) :: the chance that A happens AND B happens :: heads and a 6
- multiply rule :: for independent events, multiply the probabilities :: {1/2} × {1/6} = {1/12}

::: key The multiply rule (independent events)
P(A and B) = P(A) × P(B)
:::

::: example Worked Example 5 — Heads and a 6
P(heads) = {1/2}. P(6) = {1/6}.
P(heads and 6) = {1/2} × {1/6} = [[{1/12}]]
Check with the table in Section 2: 1 cell out of 12 ✓
@viz area a=1/2 b=1/6 result="1/2 × 1/6 = [[1/12]]" note1="columns: rolls of the die" note2="rows: the coin"
:::

::: misconception
WRONG: "P(heads and 6) = {1/2} + {1/6} = {4/6}."
WHY: "And" means both must happen. That is harder than either one alone, so the answer must be SMALLER. Adding can even give more than 1 — impossible.
RIGHT: Multiply: {1/2} × {1/6} = {1/12}. The table shows 1 cell out of 12.
:::

::: explain
Why must P(A and B) be smaller than P(A) and smaller than P(B)?
(lines 2)
=> Both things have to happen. You only get the "and" outcome some of the times A happens, so it is less likely than A alone.
:::

::: example Worked Example 6 — Two spins
A spinner is {1/4} red. You spin it twice. P(red, then red) = {1/4} × {1/4} = [[{1/16}]]
As a percent: 1 ÷ 16 = 0.0625 = [[6.25%]]
:::

::: example Worked Example 7 — Weather and a game
The forecast for Saturday in Red Deer says 30% chance of rain. A hockey team has a 60% chance of winning. These are independent.
P(rain and a win) = 0.3 × 0.6 = [[0.18]] = [[18%]]
:::

::: try
a) Roll a die and flip a coin. P(an odd number and tails) = [[{3/6} × {1/2} = {3/12} = {1/4}]]
b) Roll two dice. P(both 6) = [[{1/36}]]
c) A spinner is {1/3} green. P(green, green) on two spins = [[{1/9}]]
:::

::: retrieval
1. Write the multiply rule.
=> P(A and B) = P(A) × P(B) for independent events.
2. Find P(heads and heads) for two coins.
=> 1/2 × 1/2 = 1/4
3. Jay says P(a 3 on a die and heads) = 1/6 + 1/2 = 2/3. Explain his mistake.
=> For "and," multiply: 1/6 × 1/2 = 1/12. Adding gives too big an answer.
4. Check your answer to Question 2 with a list of outcomes.
=> HH, HT, TH, TT: HH is 1 out of 4 ✓
5. ★ Stretch: A basketball player makes 80% of free throws. What is the chance she makes 2 in a row (if each shot is independent)?
=> 0.8 × 0.8 = 0.64 = 64%
:::

## Section 4: Testing probability
Learning target: I can compare experiment results with theoretical probability, and explain why they can be different.

### Vocabulary
- theoretical probability :: what should happen, worked out from the outcomes :: P(heads) = {1/2}
- experimental probability :: what did happen in an experiment :: 7 heads in 10 flips = {7/10}
- trial :: one try of an experiment :: one flip

::: misconception
WRONG: "P(heads) = {1/2}, so 10 flips will give exactly 5 heads."
WHY: Theoretical probability tells what happens over MANY trials. A small number of trials can vary a lot.
RIGHT: In 10 flips you might get 3, 5 or 7 heads. With 1000 flips, the results get closer to {1/2}.
:::

::: example Worked Example 8 — A class experiment
Each group flips a coin and rolls a die. They count "heads and a 6." Theory says {1/12} ≈ 8%.
@viz bar data="12 trials:2;60 trials:7;240 trials:19" values=1 ymin=0 ymax=25 ystep=5 ylabel="heads and 6" title="Times we got heads and a 6"
12 trials: {2/12} ≈ [[17%]]
60 trials: {7/60} ≈ [[12%]]
240 trials: {19/240} ≈ [[8%]]
With more trials, the results get closer to the [[theoretical]] probability.
:::

::: explain
Why were the 12-trial results so far from 8%?
(lines 2)
=> With only 12 trials, one or two lucky rolls changes the percent a lot. Small samples vary.
:::

::: try
A spinner has 4 equal parts: 1 red, 3 blue. Spin it 20 times.
a) Theoretical P(red) = [[{1/4} = 25%]]
b) How many reds do you expect in 20 spins? [[5]]
c) Mia got 8 reds in 20 spins. Does that mean the spinner is broken? Explain. [[Not necessarily — 20 is a small number of trials. Try many more spins.]]
:::

::: retrieval
1. What is the difference between theoretical and experimental probability?
=> Theoretical: what should happen. Experimental: what did happen.
2. A die was rolled 30 times. A 6 came up 8 times. What is the experimental P(6)? The theoretical P(6)?
=> 8/30 ≈ 27%; 1/6 ≈ 17%
3. How can you make experimental results closer to theoretical?
=> Do many more trials.
4. Verify P(two heads) = 1/4 a different way than the multiply rule.
=> List the outcomes (HH, HT, TH, TT) or draw a tree: 1 of 4.
5. ★ Stretch: About how many times would you expect "heads and a 6" in 600 trials? Explain.
=> 1/12 of 600 = 50 times (it will not be exactly 50).
:::

## Unit Synthesis
1. Find P(rolling an even number and flipping heads) two ways: with a table and with the multiply rule.
(work 4)
=> Table: 3 of 12 cells. Rule: 1/2 × 1/2 = 1/4. Same.
2. Explain why a coin is never "due" for tails.
=> Flips are independent. The coin has no memory; every flip is 1/2.
3. Why might an experiment not match the theoretical probability?
=> Chance: small numbers of trials vary. Many trials get closer to the theory.
4. Look back at your first page. What would you change now?
=> Answers vary.

## Concept Reference
::: key One event
P(event) = favourable ÷ possible. 0 = impossible, 1 = certain. Write as a fraction, decimal or percent.
:::
@viz spinner sections="red,blue,blue,green"

::: key Two independent events
List outcomes with a tree or a table. Total outcomes = outcomes of A × outcomes of B (coin and die: 2 × 6 = 12).
P(A and B) = P(A) × P(B). Heads and 6: {1/2} × {1/6} = {1/12}.
:::
@viz outcomes rows="H,T" cols="1,2,3,4,5,6" highlight="H6"

::: key Theory vs experiment
Theory: what should happen over many trials. Experiments: what did happen. More trials → closer to theory.
:::

| Mistake | Fix |
|---|---|
| "Tails is due" | Independent: every flip is {1/2} |
| P(A and B) = P(A) + P(B) | Multiply: the answer gets smaller |
| Theory says exactly what will happen | Only over many trials |
