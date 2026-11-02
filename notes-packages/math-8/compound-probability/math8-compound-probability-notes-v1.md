---
title: Independent & Dependent Events
topic: compound-probability
strand: statistics-probability
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "A coin and a die give 2 + 6 = 8 outcomes" (CP1). "P(A and B) = P(A) + P(B)"
     and "After 3 heads, tails is due" (gambler's fallacy, from Grade 7) (CP2). "Without replacement,
     the second pick has the same chances" (CP3). "Any two days of weather are independent" (CP4).
     Section order: sample spaces first (CP1), because every probability here is counted from a model
     of the sample space: list, table, tree, set notation. Then independent events (CP2): the
     multiplication rule, shown with an area model and checked by counting. Then dependent events
     (CP3): the same tree, but the second-stage fractions change. Last, mixed problems (CP4), where
     students first decide independent or dependent, then model and solve.
     Outcome 8PR1. Two events (three only for independent events, with a tree). No mutually exclusive
     events or Venn diagrams (Grade 9). -->

## Pre-Knowledge Check
1. Find P(roll a 4) on a fair die.
2. Write {3/8} as a decimal and a percent.
3. Multiply: {2/3} × {3/4}.
4. Simplify {6/36}.
5. A bag has 2 red and 3 blue counters. Find P(blue).
@viz bag counters="red:2;blue:3"
6. List the outcomes of this spinner.
@viz spin sections="red;blue;green" size=110

## Section 1: Sample spaces
Learning target: I can show the sample space of one or two events. I can use a list, a table, a tree diagram and set notation.

### Vocabulary
- sample space :: every possible outcome, listed once :: coin: S = {H, T}
- set notation :: the outcomes inside curly brackets, named S :: S = {1, 2, 3, 4, 5, 6}
- compound event :: two or more events that happen together or one after the other :: flip a coin and roll a die
- tree diagram :: a picture with one set of branches for each event :: coin, then die
- outcome table :: a grid with one event across the top and one down the side :: two dice

#### One event
The **sample space** is the list of every outcome. We call it **S**.
Write it in **set notation**: inside curly brackets, with commas.
@viz flips items="H,T" label="Coin: S = {H, T}"
@viz dice size=30 label="Die: S = {1, 2, 3, 4, 5, 6}"

#### Two events: a compound event
Flip a coin **and** roll a die. That is a **compound event**.
Each outcome has two parts: a coin result and a die result.
H3 means heads on the coin and 3 on the die.

::: example Worked Example 1 — A coin and a die, three ways
Kai flips a coin and rolls a die. Show the sample space.
Step 1: Tree diagram. Two branches for the coin. Six for the die on each.
@viz tree first="H,T" second="1,2,3,4,5,6"
Step 2: Outcome table. The coin goes down the side. The die goes across.
@viz outcomes rows="H,T" cols="1,2,3,4,5,6" rowlabel="coin" collabel="die"
Step 3: Set notation. S = {H1, H2, H3, H4, H5, H6, T1, T2, T3, T4, T5, T6}.
Step 4: Count. 2 coin results × 6 die results = [[12]] outcomes.
:::

::: key Count the outcomes
For two events, **multiply** the number of outcomes of each.
Coin and die: 2 × 6 = 12. Two dice: 6 × 6 = 36.
Every model shows the same sample space. Pick the one that fits.
:::

::: misconception
WRONG: "A coin has 2 outcomes and a die has 6. So there are 2 + 6 = 8 outcomes."
WHY: Each coin result pairs with **every** die result. Heads goes with all 6 numbers. So does tails.
@viz outcomes rows="H,T" cols="1,2,3,4,5,6" highlight="H1;H2;H3;H4;H5;H6" caption="Heads alone makes 6 outcomes. Tails makes 6 more."
RIGHT: Multiply: 2 × 6 = 12 outcomes.
:::

::: example Worked Example 2 — Lunch combos
The school canteen sells ham (H), turkey (T) or veggie (V) wraps. Each comes with milk (M) or juice (J). How many combos are there?
@viz cptree first="H,T,V" second="M,J" title="Wrap, then drink"
Step 1: 3 wraps. Each wrap has 2 drinks.
Step 2: 3 × 2 = [[6]] combos.
Step 3: S = {HM, HJ, TM, TJ, VM, VJ}.
:::

#### Probability from the sample space
When every outcome is equally likely, count:
**P(event) = favourable outcomes ÷ all outcomes**.

::: example Worked Example 3 — Heads and an even number
Use Kai's coin and die. Find P(heads and an even number).
@viz outcomes rows="H,T" cols="1,2,3,4,5,6" highlight="H2;H4;H6" rowlabel="coin" collabel="die"
Step 1: The favourable outcomes are H2, H4 and H6. That is 3 outcomes.
Step 2: There are 12 outcomes in all.
Step 3: P = {3/12} = [[{1/4}]] = 0.25 = 25%.
:::

::: explain
Why does the tree in Worked Example 1 have 12 ends, not 8?
(lines 2)
=> Each of the 2 coin branches splits into 6 die branches. 2 × 6 = 12 ends, one for each outcome.
:::

::: try
1. Write the sample space of this spinner in set notation. [[S = {red, blue, green, yellow}]]
@viz spin sections="red;blue;green;yellow" size=110
2. Spin the spinner and flip a coin. How many outcomes are there? [[4 × 2 = 8]]
3. Fill in the tree for flipping two coins. List S. [[S = {HH, HT, TH, TT}]]
@viz tree first="H,T" second="H,T" outcomes=blank
4. Use the table in Worked Example 3. Find P(tails and a 5). [[{1/12}]]
5. Ava says a die and a 4-part spinner give 10 outcomes. Fix her mistake. [[Multiply: 6 × 4 = 24 outcomes.]]
:::
::: retrieval
1. Write {3/12} in simplest form.
=> {1/4}
2. Write {1/4} as a decimal and a percent.
=> 0.25 and 25%
3. Multiply: {1/2} × {1/3}.
=> {1/6}
4. A spinner has 5 equal parts. Find P(one part).
=> {1/5} = 0.2 = 20%
5. ★ Stretch: A pizza place has 4 crusts, 3 sauces and 5 toppings. You pick one of each. How many pizzas?
=> 4 × 3 × 5 = 60 pizzas
:::

## Section 2: Independent events
Learning target: I can tell when two events are independent. I can find P(A and B) by multiplying.

### Vocabulary
- independent events :: the result of one does not change the chances of the other :: flip a coin, then roll a die
- with replacement :: put the item back before the next draw :: draw a counter, put it back, draw again
- P(A and B) :: the probability that A and B both happen :: P(heads and 6)
- area model :: a square split into rows and columns to show P(A) × P(B) :: {1/2} × {1/6}

#### What makes events independent?
The coin does not know what the die did. The die does not know what the coin did.
These events are **independent**.
Spinning a spinner twice is independent too.
So is drawing a counter **with replacement**: put it back before the next draw.
@viz bag counters="red:3;blue:2" out="red" outlabel="put it back" caption="With replacement, the bag is the same for every draw."

::: key Independent events
If A and B are independent:
**P(A and B) = P(A) × P(B)**
"And" means both happen. For "and", **multiply**.
:::

::: example Worked Example 1 — Heads and a 6
Find P(heads and 6) when you flip a coin and roll a die.
Step 1: P(heads) = {1/2}. P(6) = {1/6}.
Step 2: Multiply: {1/2} × {1/6} = {1/12}.
@viz area a=1/2 b=1/6 alabel="1/2 heads" blabel="1/6" note1="columns: the die (6)" note2="rows: the coin (2)" result="1/2 × 1/6 = 1/12" result2="1 square of 12"
Step 3: Check by counting. Only H6 matches, out of 12 outcomes.
@viz outcomes rows="H,T" cols="1,2,3,4,5,6" highlight="H6" rowlabel="coin" collabel="die"
Step 4: P(heads and 6) = {1/12} ≈ [[0.083]] ≈ 8.3%.
:::

::: misconception
WRONG: "P(heads and 6) = {1/2} + {1/6} = {4/6}."
WHY: Adding makes the chance bigger. Needing **both** to happen should make it smaller. Only 1 of the 12 outcomes is H6.
@viz area a=1/2 b=1/6 alabel="1/2" blabel="1/6" note1="both happen: the overlap" note2="only 1 square of 12" result="1/2 × 1/6 = 1/12"
RIGHT: For "and", multiply: {1/2} × {1/6} = {1/12}.
:::

::: example Worked Example 2 — Spin twice
Mia spins this spinner two times. Find P(red, then red).
@viz spin sections="red:2;blue:1" guides=1 size=130 label="P(red) = 2/3"
Step 1: The spins are independent. P(red) = {2/3} each time.
Step 2: Multiply: {2/3} × {2/3} = [[{4/9}]].
@viz cptree first="R,B" p1="2/3,1/3" second="R,B" p2="2/3,1/3" hot="RR" probs="[[4/9]];2/9;2/9;1/9"
Step 3: The tree shows the same thing. Multiply along the RR branches.
Step 4: As a decimal, 4 ÷ 9 ≈ [[0.44]], or about [[44%]].
:::

::: example Worked Example 3 — With replacement
A bag has 3 red and 2 blue counters. Ben draws one, puts it back, then draws again. Find P(red, red).
@viz bag counters="red:3;blue:2" out="red" outlabel="put it back"
Step 1: He puts it back. The bag is the same, so the draws are independent.
Step 2: P(red) = {3/5} on each draw.
Step 3: P(red, red) = {3/5} × {3/5} = [[{9/25}]].
@viz area a=3/5 b=3/5 alabel="3/5" blabel="3/5" note1="columns: 1st draw" note2="rows: 2nd draw" result="3/5 × 3/5 = [[9/25]]"
Step 4: Decimal: 9 ÷ 25 = [[0.36]]. Percent: [[36%]].
:::

#### Three independent events
A tree can show three events. Each path through the tree is one outcome.
::: example Worked Example 4 — Three coins
Flip three coins. Find P(three heads).
@viz cptree first="H,T" p1="1/2,1/2" second="H,T" p2="1/2,1/2" third="H,T" p3="1/2,1/2" hot="HHH"
Step 1: The tree has 2 × 2 × 2 = [[8]] outcomes.
Step 2: Only HHH is three heads. P = {1/8}.
Step 3: Check: {1/2} × {1/2} × {1/2} = [[{1/8}]] = 0.125 = 12.5%.
:::

::: misconception
WRONG: "I flipped heads 3 times in a row. Tails is due next."
WHY: Each flip is independent. The coin has no memory of the last flips.
@viz flips items="H,H,H,?" under="1st;2nd;3rd;4th" label="4th flip: P(tails) is still 1/2"
RIGHT: P(tails) is {1/2} on every flip, no matter what came before.
:::

::: explain
In Worked Example 3, why does putting the counter back make the draws independent?
(lines 2)
=> The bag has the same 3 red and 2 blue counters for the second draw. So the first draw can't change the second chance.
:::

::: try
1. Flip a coin and spin a 4-part spinner. Find P(tails and red). [[{1/2} × {1/4} = {1/8}]]
@viz spin sections="red;blue;green;yellow" size=100
2. Roll a die twice. Find P(6, then 6). [[{1/6} × {1/6} = {1/36}]]
3. A bag has 1 red and 3 blue. Draw, put it back, draw again. Find P(blue, blue). [[{3/4} × {3/4} = {9/16} = 0.5625 ≈ 56%]]
@viz bag counters="red:1;blue:3"
4. Leo says P(heads and 1) = {1/2} + {1/6}. Fix it. [[Multiply: {1/2} × {1/6} = {1/12}.]]
5. Flip three coins. Find P(three tails). [[{1/8} = 12.5%]]
:::
::: retrieval
1. A coin and a 3-part spinner. How many outcomes?
=> 2 × 3 = 6
2. Write S for flipping two coins.
=> S = {HH, HT, TH, TT}
3. Write {9/25} as a decimal and a percent.
=> 0.36 and 36%
4. Find {2/5} × {1/4} in simplest form.
=> {2/20} = {1/10}
5. ★ Stretch: Roll two dice. Find P(both even).
=> {3/6} × {3/6} = {1/2} × {1/2} = {1/4}
:::

## Section 3: Dependent events
Learning target: I can tell when two events are dependent. I can find the probability by modelling the sample space.

### Vocabulary
- dependent events :: the result of the first changes the chances of the second :: draw two counters and keep the first one out
- without replacement :: do not put the item back :: pick two names from a hat

#### Keep it out
Now Ben draws a counter and **keeps it out**. There is one fewer counter in the bag.
@viz cpdraw before="red:3;blue:2" take="red" beforelabel="5 counters: 3 red" afterlabel="4 left: 2 red"
The second draw has different chances. The events are **dependent**.

::: key Dependent events
For two dependent events, multiply along the branches of a tree.
The **second** fractions change. They use what is left after the first draw.
Without replacement: the bottom number goes down by 1.
Same kind of item? Then the top number goes down by 1 too.
:::

::: example Worked Example 1 — Two reds, no putting back
A bag has 3 red and 2 blue counters. Ben draws two without replacement. Find P(red, red).
Step 1: 1st draw: P(red) = {3/5}.
Step 2: Ben keeps the red out. Now 2 red of 4 are left. P(red) = {2/4}.
Step 3: Multiply along the RR branches: {3/5} × {2/4} = {6/20} = [[{3/10}]].
@viz cptree first="R,B" p1="3/5,2/5" second="R,B|R,B" p2="2/4,2/4|3/4,1/4" hot="RR" probs="6/20;6/20;6/20;2/20"
Step 4: Check: the four branch products add to {20/20} = 1.
Step 5: P(red, red) = [[0.3]] = [[30%]]. With replacement it was 36%.
:::

::: misconception
WRONG: "Without replacement, P(red, red) = {3/5} × {3/5}."
WHY: The first red stays out. The bag now has only 4 counters, and only 2 are red.
@viz cpdraw before="red:3;blue:2" take="red" beforelabel="1st: 3 red of 5" afterlabel="2nd: 2 red of 4"
RIGHT: P(red, red) = {3/5} × {2/4} = {6/20} = {3/10}.
:::

::: example Worked Example 2 — Team captains from a hat
Four names go in a hat: Ava (A), Ben (B), Kai (K) and Mia (M). The coach draws a captain. Then she draws an assistant from the 3 names left. Find P(Ava and Ben are the two picked).
@viz hat names="Ava,Ben,Kai,Mia" title="4 names"
Step 1: List the sample space with a tree. Each first name has 3 names left.
@viz cptree first="A,B,K,M" second="B,K,M|A,K,M|A,B,M|A,B,K" sep="," hot="A,B;B,A"
Step 2: There are 4 × 3 = [[12]] outcomes.
Step 3: Ava and Ben are both picked in A,B and in B,A. That is [[2]] outcomes.
Step 4: P = {2/12} = [[{1/6}]] ≈ 0.17 ≈ 17%.
:::

::: example Worked Example 3 — Two cards
Five cards are numbered 1 to 5. Tess picks two without putting the first back. Find P(both even).
@viz flips kind=card items="1,2,3,4,5" hot="2,4" label="2 even cards of 5"
Step 1: 1st card: 2 even of 5. P = {2/5}.
Step 2: One even card is gone. 1 even of 4 is left. P = [[{1/4}]].
Step 3: P(both even) = {2/5} × {1/4} = [[{2/20}]] = [[{1/10}]].
Step 4: Decimal [[0.1]]. Percent [[10%]].
:::

#### Independent or dependent?
Ask: **does the first result change the chances for the second?**

| Situation | Independent or dependent? | Why |
|---|---|---|
| Roll a die, then flip a coin | independent | the coin doesn't care about the die |
| Draw a counter, put it back, draw again | [[independent]] | the bag is the same |
| Pick two names from a hat, no putting back | [[dependent]] | one name is gone |
| Spin a spinner twice | [[independent]] | the spinner doesn't change |
| Pick two cards and keep the first | [[dependent]] | one fewer card |
@viz cpdraw before="red:2;blue:2" take="blue" beforelabel="1st: 2 blue of 4" afterlabel="2nd: [[1]] blue of [[3]]"

::: explain
Look at Worked Example 1. The R branch uses {2/4}. Why does the B branch use {3/4}?
(lines 2)
=> After a red, 2 red of 4 are left. After a blue, all 3 red are still there, out of 4.
:::

::: try
1. A bag has 4 red and 1 blue. Draw two, no putting back. Find P(red, red). [[{4/5} × {3/4} = {12/20} = {3/5}]]
@viz bag counters="red:4;blue:1"
2. Fill in the second fractions. [[After R: R 3/4, B 1/4. After B: R 4/4, B 0/4.]]
@viz cptree first="R,B" p1="4/5,1/5" second="R,B|R,B" p2="[[3/4]],[[1/4]]|[[4/4]],[[0/4]]" outcomes=none
3. Independent or dependent? a) Two spins. b) Two names from a hat, no putting back. [[a) independent b) dependent]]
4. Sam says the second draw in Question 1 is still {4/5}. Explain his mistake. [[One red is out. Only 3 red of 4 are left.]]
:::
::: retrieval
1. A coin and a die. How many outcomes?
=> 12
2. Find P(heads and 6).
=> {1/2} × {1/6} = {1/12}
3. Spin a 3-part spinner twice. Independent or dependent?
=> Independent. The spinner doesn't change.
4. Simplify {6/20}.
=> {3/10}
5. ★ Stretch: A bag has 2 red and 2 blue. Draw two, no putting back. Find P(two blues).
=> {2/4} × {1/3} = {2/12} = {1/6}
:::

## Section 4: Probability problems
Learning target: I can decide if events are independent or dependent. I can model and solve problems with two events.

### Vocabulary
- model :: a list, table, tree or area model of the sample space :: a tree for two draws
- favourable outcome :: an outcome that matches the event :: sum of 7: (1, 6), (2, 5) …

@viz flow steps="Independent or dependent?|Model the sample space|Multiply along branches, or count|Fraction, decimal, percent" width=620

::: example Worked Example 1 — A Stampede midway game
At a Stampede booth, you spin a 4-part wheel. Then you roll a die. You win a prize for "star" and a 6.
@viz spin sections="star;blank;blank;blank" size=120
Step 1: The spin does not change the die. The events are [[independent]].
Step 2: P(star) = {1/4}. P(6) = {1/6}.
Step 3: P(win) = {1/4} × {1/6} = [[{1/24}]].
@viz area a=1/4 b=1/6 alabel="1/4 star" blabel="1/6" note1="columns: the die" note2="rows: the wheel" result="1/4 × 1/6 = [[1/24]]"
Step 4: 1 ÷ 24 ≈ [[0.042]] ≈ [[4.2%]].
:::

::: example Worked Example 2 — Sums of two dice
Roll two dice and add. Find P(a sum of 7).
@viz cpsum hot="7" rowlabel="red die" collabel="blue die"
Step 1: The table shows all 6 × 6 = [[36]] outcomes.
Step 2: Six cells have a sum of 7.
Step 3: P(sum of 7) = {6/36} = [[{1/6}]] ≈ [[0.17]] ≈ [[17%]].
:::

::: example Worked Example 3 — The sock drawer
A drawer has 4 black (K) and 2 white (W) socks. In the dark, Leo pulls out two socks. Find P(two black).
@viz cpdraw before="black:4;white:2" take="black" beforelabel="1st: 4 black of 6" afterlabel="2nd: [[3]] black of [[5]]"
Step 1: Leo keeps the first sock. The events are [[dependent]].
Step 2: P(black, black) = {4/6} × [[{3/5}]] = [[{12/30}]] = [[{2/5}]].
@viz cptree first="K,W" p1="4/6,2/6" second="K,W|K,W" p2="[[3/5]],[[2/5]]|[[4/5]],[[1/5]]" hot="KK" probs="[[12/30]];[[8/30]];[[8/30]];[[2/30]]"
Step 3: Check: 12 + 8 + 8 + 2 = 30. The products add to 1.
Step 4: P(two black) = [[0.4]] = [[40%]].
:::

::: example Worked Example 4 — Weather two days in a row
The forecast for Calgary says: 40% chance of snow on Monday and 50% on Tuesday. Treat the days as independent. Find P(snow both days).
@viz percentbar percent=40 top="0%,40%,100%" bottom="0,0.4,1" toplabel="Monday" bottomlabel="decimal" width=440
Step 1: The question says to treat them as [[independent]].
Step 2: P(both) = 0.4 × 0.5 = [[0.2]] = [[20%]].
@viz area a=1/2 b=2/5 alabel="0.5 Tue" blabel="0.4 Mon" note1="columns: Monday" note2="rows: Tuesday" result="0.4 × 0.5 = [[0.2]]"
:::

::: misconception
WRONG: "Weather on two days is always independent. Just multiply."
WHY: Real weather is often linked. A snowy Monday can make a snowy Tuesday more likely. Then the days are dependent.
@viz cptree first="snow,dry" p1="0.4,0.6" second="snow,dry" outcomes=none title="Tuesday depends on Monday?"
RIGHT: Multiply the two chances only when the days are independent. Use that only when the problem says so.
:::

::: example Worked Example 5 — The hockey lineup
A coach has 3 forwards and 2 defence players for a shootout. She draws two names at random for the first two shooters. Find P(both forwards).
@viz people n=5 cols=5 groups="1-3:forward;4-5:defence" title="5 players"
Step 1: No name goes back in. The events are [[dependent]].
Step 2: P(forward, forward) = {3/5} × [[{2/4}]] = [[{6/20}]] = [[{3/10}]].
Step 3: [[0.3]] = [[30%]].
:::

::: explain
In Worked Example 3, why does the K branch use {3/5}, not {4/6}?
(lines 2)
=> Leo kept one black sock. 5 socks are left, and only 3 are black.
:::

::: try
1. Flip a coin and spin this spinner. Find P(heads and blue). [[Independent. {1/2} × {1/3} = {1/6} ≈ 17%]]
@viz spin sections="red;blue;green" size=100
2. Roll two dice. Use the table in Worked Example 2. Find P(sum of 12). [[{1/36} ≈ 2.8%]]
3. A hat has 2 boys' and 3 girls' names. Draw two. Find P(two girls). [[Dependent. {3/5} × {2/4} = {6/20} = {3/10} = 30%]]
@viz hat names="Raj,Leo,Ava,Mia,Zoe" title="5 names"
4. Raj says the coach in Worked Example 5 has a {3/5} × {3/5} chance. Is he right? [[No. One forward is out. {3/5} × {2/4} = {3/10}.]]
:::
::: retrieval
1. Write S for flipping a coin and spinning a 3-part spinner (A, B, C).
=> S = {HA, HB, HC, TA, TB, TC}
2. Find P(red, red) on a spinner that is {1/4} red, spun twice.
=> {1/4} × {1/4} = {1/16}
3. A bag has 2 red and 3 blue. Draw two, no putting back. Find P(red, blue).
=> {2/5} × {3/4} = {6/20} = {3/10}
4. Write {1/24} as a percent, to one decimal place.
=> about 4.2%
5. ★ Stretch: Roll two dice. Find P(sum of 10 or more).
=> 3 + 2 + 1 = 6 cells. {6/36} = {1/6}
:::

## Unit Synthesis
1. At a Stampede booth, a bag holds 2 gold and 6 silver tokens. You draw one token, then a second. Draw a tree for two draws **with** replacement. Find P(gold, gold).
@viz bag counters="yellow:2;white:6" letters=0 label="2 gold, 6 silver"
=> Independent. {2/8} × {2/8} = {1/4} × {1/4} = {1/16} = 0.0625 ≈ 6.3%.
2. Now the booth keeps the first token out. Find P(gold, gold).
=> Dependent. {2/8} × {1/7} = {2/56} = {1/28} ≈ 0.036 ≈ 3.6%.
3. Which way gives you the better chance of two golds? Explain.
=> With replacement: {1/16} is more than {1/28}. Keeping a gold out leaves fewer golds.
4. Explain the difference between independent and dependent events in your own words.
=> Independent: the first result doesn't change the second chance. Dependent: it does, like drawing without putting back.
5. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Sample spaces
**S** lists every outcome once. Coin: S = {H, T}. Coin and die: S = {H1, H2, …, T6}.
Show it with a list, a table or a tree. Count by multiplying: 2 × 6 = 12.
:::
@viz tree first="H,T" second="1,2,3"

::: key Independent events
The first result doesn't change the second chance. Coins, dice, spinners, draws **with replacement**.
**P(A and B) = P(A) × P(B).** Heads and 6: {1/2} × {1/6} = {1/12}.
:::
@viz area a=1/2 b=1/6 result="1/2 × 1/6 = 1/12"

::: key Dependent events
The first result changes the second. Draws **without replacement**.
Multiply along the tree. The second fractions use what is left.
3 red, 2 blue: P(red, red) = {3/5} × {2/4} = {3/10}.
:::
@viz cptree first="R,B" p1="3/5,2/5" second="R,B|R,B" p2="2/4,2/4|3/4,1/4" probs="6/20;6/20;6/20;2/20"

::: key Solving problems
1. Independent or dependent? 2. Model it: list, table, tree or area. 3. Multiply or count. 4. Write a fraction, decimal and percent.
:::

| Mistake | Fix |
|---|---|
| Coin and die: 2 + 6 = 8 outcomes | Multiply: 2 × 6 = 12. |
| P(A and B) = P(A) + P(B) | For "and", multiply: {1/2} × {1/6} = {1/12}. |
| After 3 heads, tails is due | Each flip is independent. P(tails) is still {1/2}. |
| Without replacement, the chances stay the same | One fewer item. The second fraction changes: {3/5}, then {2/4}. |
| Weather days are always independent | Multiply only when the problem says they are independent. |
