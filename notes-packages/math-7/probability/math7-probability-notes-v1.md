---
title: Probability
topic: probability
strand: statistics-probability
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "A probability can be 3 (or 120%)" (PB1). "It either happens or it doesn't,
     so it's 50-50" (PB2). "After 5 heads, tails is due" (PB3). "If P = 1/2, 10 flips give exactly
     5 heads" (PB4).
     Section order: outcomes, events and the 0-to-1 likelihood line come first (PB1), because a
     probability is a count of favourable outcomes against all outcomes. Then the sample space and
     theoretical probability in four forms (PB2): the number theory predicts. Then experiments and
     simulations (PB3): the number the class actually gets. Last, theory and experiment side by side,
     pooled data, and decisions (fair games, forecasts, choosing a bag) (PB4).
     Outcomes 7PR1.1 (PB1) and 7PR1.2 (PB2–PB4). One experiment at a time: no two-event (compound)
     probability (Grade 8). Bags are drawn with replacement. -->

## Pre-Knowledge Check
1. Write {1/2} as a decimal and as a percent.
2. Simplify {6/10}.
3. Write 0.25 as a fraction and as a percent.
4. Find 1 − 0.4.
5. Find {1/4} of 40.
6. How many more students picked red than blue?
@viz bar data="red:7;blue:4;green:5" ymax=8 ystep=1 title="Favourite colour" ylabel="students"

## Section 1: Outcomes, events and likelihood
Learning target: I can list the outcomes. I can say how likely an event is, from impossible to certain.

### Vocabulary
- experiment :: something you do where the result is up to chance :: flip a coin, roll a die
- outcome :: one possible result :: rolling a 4
- event :: the outcome or outcomes you are looking for :: roll an even number
- favourable outcome :: an outcome that matches the event :: for "even": 2, 4 and 6
- simple event :: an event with just one result :: roll a 5
- equally likely :: outcomes with the same chance :: each face of a fair die
- probability :: a number from 0 to 1. It tells how likely an event is. :: P(heads) = {1/2}
- impossible :: it can never happen. Probability 0. :: roll a 7 on a die
- certain :: it will happen for sure. Probability 1. :: roll a number less than 7

#### Outcomes and events
Roll a die. It can land on 1, 2, 3, 4, 5 or 6. Each one is an **outcome**.
@viz dice label="Roll a die: 6 outcomes" caption="A fair die has 6 faces. Each face has the same chance."
An **event** is what you are looking for. "Roll an even number" is an event.
The outcomes that match the event are **favourable**.

::: example Worked Example 1 — Favourable outcomes
Event: roll a number greater than 4.
@viz dice hot="5,6" labels="no;no;no;no;yes;yes" label="Greater than 4? Shade the yes faces."
Step 1: List all the outcomes: 1, 2, 3, 4, 5, 6.
Step 2: Which ones match? 5 and 6. They are the favourable outcomes.
Step 3: There are [[2]] favourable outcomes out of 6.
:::

#### From impossible to certain
A **probability** is a number from 0 to 1.
@viz numberline min=0 max=1 step=0.25 ticklabels="0:0;0.25:unlikely;0.5:even chance;0.75:likely;1:1" ends="impossible,certain" width=560 caption="Every probability sits somewhere on this line."

::: key How likely?
Probability is a number from **0 to 1**.
0 means **impossible**. 1 means **certain**.
{1/2} means an **even chance**. It is as likely as not.
Closer to 1 means more likely.
:::

::: example Worked Example 2 — Place events on the line
Kai has a bag of 5 red counters. He draws one without looking.
@viz bag counters="red:5" label="5 red counters"
@viz numberline min=0 max=1 step=0.5 ticklabels="0:impossible;0.5:even chance;1:certain" points="0:draw blue;1:draw red" keypoints="0.5:heads" width=520
Step 1: Draw a red counter. Every counter is red. It is **certain**: probability 1.
Step 2: Draw a blue counter. There are no blue ones. It is **impossible**: probability 0.
Step 3: Flip a coin and get heads. Heads and tails have the same chance. It is an [[even chance]]: probability {1/2}.
:::

#### Not always equally likely
A fair coin lands heads or tails with the same chance. Not every experiment is like that.
@viz spin sections="red:2;blue:1;yellow:1" size=130 caption="Red takes up more space. The arrow lands on red more often."
@viz bag counters="red:4;blue:1" caption="There are more red counters. Red is more likely than blue."
A bent coin may land heads more often than tails. Then heads and tails are not equally likely.

::: example Worked Example 3 — More likely or less likely?
Mia spins this spinner at a Calgary Stampede booth.
@viz spin sections="red:2;blue:1;yellow:1" size=150
Step 1: Red covers half the spinner. Blue covers a quarter.
Step 2: So red is **more likely** than blue.
Step 3: Blue and yellow are the same size. They are [[equally likely]].
Step 4: Yellow is [[less likely]] than red.
:::

::: misconception
WRONG: "The chance of rain is 120%! It will surely rain." Or: "The probability is 3."
WHY: A probability compares the favourable outcomes to all the outcomes. The favourable ones can never be more than all of them.
@viz numberline min=0 max=1.5 step=0.25 ticklabels="0:0;0.5:0.5;1:1;1.5:1.5" highlight="0,1" points="1.25:no probability here" width=480 caption="Probabilities live on the thick part, from 0 to 1."
RIGHT: A probability is from 0 to 1. As a percent, it is from 0% to 100%. Certain is 1, or 100%.
:::
::: explain
In Worked Example 2, why is drawing a red counter certain?
(lines 2)
=> Every counter in the bag is red. Any counter Kai draws will be red.
:::

::: try
1. A spinner has 4 equal parts. List the outcomes. [[red, blue, green, yellow]]
@viz spin sections="red;blue;green;yellow" size=120
2. Event: roll an odd number. List the favourable outcomes. [[1, 3 and 5]]
3. How likely is it? a) Roll a 0 on a die. b) The sun rises tomorrow. c) Roll a 1. [[a) impossible. b) certain. c) unlikely.]]
4. A bag has 2 red and 6 blue counters. Which colour is more likely? [[Blue. There are more blue counters.]]
@viz bag counters="red:2;blue:6"
5. Leo says P(win) = 1.5. Is he right? [[No. A probability is never more than 1.]]
:::
::: retrieval
1. Write {3/4} as a decimal and a percent.
=> 0.75 and 75%
2. Simplify {6/8}.
=> {3/4}
3. Find the mean of 4, 6 and 8.
=> 18 ÷ 3 = 6
4. Find 20% of 50.
=> 10
5. ★ Stretch: A bag has 3 red counters and some blue ones. Blue is more likely than red. What is the fewest blue counters it can have?
=> 4. With 3 blue, red and blue are equally likely.
:::

## Section 2: Theoretical probability
Learning target: I can list the sample space. I can find a probability as a ratio, fraction, decimal and percent.

### Vocabulary
- sample space :: the list of all the possible outcomes :: coin: {H, T}
- theoretical probability :: favourable outcomes ÷ all outcomes, when they are equally likely :: P(heads) = {1/2}
- P(event) :: a short way to write "the probability of the event" :: P(roll a 6) = {1/6}

#### The sample space
List every outcome once, inside curly brackets. This list is the **sample space**.
@viz flips items="H,T" label="Coin: {H, T}"
@viz dice label="Die: {1, 2, 3, 4, 5, 6}"
@viz spin sections="red;blue;green;yellow" size=120 label="Spinner: {red, blue, green, yellow}"

::: key Theoretical probability
When all the outcomes are equally likely:
**P(event) = favourable outcomes ÷ all outcomes**
Write it four ways. Ratio 3:6 (favourable to all). Fraction {3/6} = {1/2}. Decimal 0.5. Percent 50%.
All the probabilities in a sample space **add to 1**.
:::

::: example Worked Example 1 — Four ways
A bag has 4 red counters and 1 blue counter. Find P(red).
@viz bag counters="red:4;blue:1" out="?" outlabel="draw one"
Step 1: Count all the counters: 4 + 1 = 5. Each counter is equally likely.
Step 2: Count the favourable ones (red): 4.
Step 3: Ratio: 4:5. Fraction: {4/5}.
Step 4: Decimal: 4 ÷ 5 = [[0.8]]. Percent: [[80%]].
@viz percentbar percent=80 top="0%,[[80%]],100%" bottom="0,4,5" toplabel="percent" bottomlabel="counters" width=480
:::

::: example Worked Example 2 — Roll a 6
Find P(roll a 6) on a fair die.
@viz dice hot="6" label="The favourable outcome is shaded."
Step 1: The sample space is {1, 2, 3, 4, 5, 6}. That is 6 outcomes.
Step 2: Only one face is a 6. It is a **simple event**.
Step 3: P(roll a 6) = [[{1/6}]].
Step 4: 1 ÷ 6 = 0.1666… It keeps going. P ≈ [[0.17]], or about [[17%]].
:::

::: misconception
WRONG: "Rolling a 6 either happens or it doesn't. So P(6) = {1/2}."
WHY: "Happens" and "doesn't happen" are not equally likely. Only one face is a 6. Five faces are not.
@viz dice hot="6" labels="not 6;not 6;not 6;not 6;not 6;6" caption="One face is a 6. Five faces are not."
RIGHT: Count the equally likely outcomes. P(roll a 6) = {1/6}, not {1/2}.
:::

::: example Worked Example 3 — Unequal parts
Find P(red) on Mia's Stampede spinner.
@viz spin sections="red:2;blue:1;yellow:1" guides=1 size=150 label="Split red into equal pieces."
Step 1: The parts are not the same size. Split the spinner into equal pieces.
Step 2: Now there are 4 equal pieces. Red covers [[2]] of them.
Step 3: P(red) = {2/4} = [[{1/2}]] = [[0.5]] = [[50%]].
:::

#### All the probabilities add to 1
::: example Worked Example 4 — Every colour
A bag has 3 red, 2 blue and 5 yellow counters. Find the probability of each colour.
@viz bag counters="red:3;blue:2;yellow:5" label="10 counters in all"

| Colour | Fraction | Decimal | Percent |
|---|---|---|---|
| red | {3/10} | 0.3 | 30% |
| blue | [[{2/10} = {1/5}]] | [[0.2]] | [[20%]] |
| yellow | [[{5/10} = {1/2}]] | [[0.5]] | [[50%]] |
| all | {10/10} = 1 | [[1]] | [[100%]] |

Step 1: Add the decimals: 0.3 + 0.2 + 0.5 = 1. They add to 1.
Step 2: P(not red) = 1 − 0.3 = [[0.7]].
Step 3: Check: blue and yellow make [[7]] of the 10 counters.
:::

#### Cards
Ten cards are numbered 1 to 10. They are mixed and face down. Each card is equally likely.
@viz flips kind=card items="1,2,3,4,5,6,7,8,9,10" label="10 cards: 10 equally likely outcomes"
P(an even card) = {5/10} = {1/2}. The even cards are 2, 4, 6, 8 and 10.
::: explain
In Worked Example 3, why do we split red into 2 pieces first?
(lines 2)
=> Favourable ÷ all works only for equally likely outcomes. Equal pieces are equally likely. Red is 2 of the 4 pieces.
:::

::: try
1. A spinner has 3 equal parts: A, B and C. Write the sample space. [[{A, B, C}]]
2. Find P(roll an even number). Write it as a fraction, a decimal and a percent. [[{3/6} = {1/2} = 0.5 = 50%]]
3. Ten cards are numbered 1 to 10. Find P(a multiple of 3). [[3, 6 and 9 match. {3/10} = 0.3 = 30%]]
@viz flips kind=card items="1,2,3,4,5,6,7,8,9,10"
4. A bag has 1 red and 3 blue counters. Find P(red) and P(blue). Do they add to 1? [[P(red) = {1/4} = 25%. P(blue) = {3/4} = 75%. 25% + 75% = 100%, so yes.]]
@viz bag counters="red:1;blue:3"
5. Zoe says P(roll a 1) = {1/2}: "it happens or it doesn't." Fix her mistake. [[A die has 6 equally likely outcomes. Only one is a 1. P(roll a 1) = {1/6}.]]
6. ★ Stretch: P(snow) = 0.35. Find P(no snow) as a percent. [[1 − 0.35 = 0.65 = 65%]]
:::
::: retrieval
1. Impossible, even chance or certain: draw red from a bag of only blue counters?
=> impossible
2. Can a probability be 1.2? Why?
=> No. A probability is from 0 to 1.
3. Write {2/5} as a percent.
=> 40%
4. Find the median of 7, 2, 9, 4, 5.
=> In order: 2, 4, 5, 7, 9. The median is 5.
5. ★ Stretch: A spinner has 8 equal parts. P(green) = {3/8}. How many parts are green? Find P(not green).
=> 3 parts are green. P(not green) = {5/8}.
:::

## Section 3: Experimental probability
Learning target: I can do an experiment. I can find the experimental probability from my results.

### Vocabulary
- trial :: doing the experiment one time :: one flip of a coin
- experimental probability :: times the event happened ÷ number of trials :: 12 heads in 20 flips: {12/20}
- with replacement :: put the counter back before the next draw :: the bag is the same every time
- simulation :: using a coin, die or spinner to act out a real situation :: a coin for a 50-50 guess

#### Doing an experiment
Theory tells what *should* happen. An experiment shows what *does* happen.
Noor flips a coin 20 times. Each flip is one **trial**.
@viz bar data="Heads:12;Tails:8" ymax=14 ystep=2 values=1 title="20 flips of a coin" ylabel="times" caption="Heads came up 12 times in 20 trials."
Experimental P(heads) = {12/20} = 0.6 = 60%.

::: key Experimental probability
**Experimental P(event) = times it happened ÷ number of trials**
Write it as a fraction, decimal or percent, like theoretical probability.
:::

::: example Worked Example 1 — Spinner results
Ava spins a spinner with 4 equal parts. She spins it 40 times.
@viz spin sections="red;blue;yellow;green" size=120
@viz bar data="red:12;blue:9;yellow:11;green:8" ymax=14 ystep=2 values=1 title="40 spins" ylabel="times"
Step 1: Red came up 12 times in 40 trials.
Step 2: Experimental P(red) = {12/40} = [[{3/10}]] = [[0.3]] = [[30%]].
Step 3: Theoretical P(red) = {1/4} = 25%. The results are close, but not the same.
:::

::: example Worked Example 2 — Draw and put back
Sam's bag has 3 red and 1 blue counter. He draws one and writes the colour. Then he puts it back.
@viz bag counters="red:3;blue:1" out="red" outlabel="put it back"
He does this 50 times.

| Colour | red | blue | all |
|---|---|---|---|
| Times | 36 | 14 | 50 |

Step 1: He puts it back each time. So the bag is the same for every draw.
Step 2: Experimental P(red) = {36/50} = [[0.72]] = [[72%]].
Step 3: Theoretical P(red) = {3/4} = [[75%]]. The experiment is close to the theory.
:::

::: misconception
WRONG: "Leo got heads 5 times in a row. Tails is due next!"
WHY: A coin does not remember past flips. Every flip is a new trial.
@viz flips items="H,H,H,H,H,?" under="1st;2nd;3rd;4th;5th;6th" label="6th flip: still a 1/2 chance of tails"
RIGHT: Trials don't affect each other. P(tails) is still {1/2} on the 6th flip.
:::

#### Simulations
Some things are hard to do many times. Act them out with a coin, die or spinner. This is a **simulation**.
@viz flow steps="Pick a tool with the same chances|Match each outcome|Do many trials|Find the probability" width=600

::: example Worked Example 3 — A 50-50 guess
Noor guesses on a 10-question true-or-false quiz. Each guess is a 50-50 chance.
She simulates it with a coin. Heads = right. Tails = wrong.
@viz flips items="H,T,T,H,H,T,H,H,T,H" under="1;2;3;4;5;6;7;8;9;10" hot="1,4,5,7,8,10" label="Heads (shaded) = a right answer"
Step 1: A coin has 2 equally likely outcomes, like a 50-50 guess.
Step 2: The coin landed heads [[6]] times in 10 flips.
Step 3: Experimental P(right) = {6/10} = [[0.6]] = [[60%]].
:::

::: example Worked Example 4 — Six prizes at the Stampede
A booth gives one of 6 plush toys. Each toy is equally likely. Raj wants to know how often he gets a horse.
@viz dice hot="1" labels="horse;bear;moose;goose;bison;fox" label="One face for each toy"
Raj rolls a die 60 times. A 1 (horse) comes up 12 times.
Step 1: Why a die? It has [[6]] equally likely outcomes, like the 6 toys.
Step 2: Experimental P(horse) = {12/60} = [[{1/5}]] = [[0.2]] = [[20%]].
Step 3: Theoretical P(horse) = {1/6}. That is about [[17%]].
:::
::: explain
In Worked Example 2, why does Sam put the counter back each time?
(lines 2)
=> So the bag has 3 red and 1 blue for every draw. Then every trial has the same chances.
:::

::: try
1. Kai flips a coin 30 times. He gets 18 heads. Find the experimental P(heads). [[{18/30} = {3/5} = 0.6 = 60%]]
2. Mia rolls a die 50 times. Find the experimental P(roll a 4) as a percent. [[{10/50} = {1/5} = 0.2 = 20%]]
@viz bar data="1:7;2:9;3:8;4:10;5:9;6:7" ymax=12 ystep=2 title="Mia's 50 rolls" ylabel="times"
3. Omar flipped 4 tails in a row. He says heads is due. Is he right? [[No. The coin has no memory. P(heads) is still {1/2}.]]
@viz flips items="T,T,T,T,?" under="1st;2nd;3rd;4th;5th"
4. A spinner has 3 equal parts. How could you simulate it with a die? [[1 or 2 is the first part. 3 or 4 is the second. 5 or 6 is the third. Each part has {2/6} = {1/3}.]]
5. ★ Stretch: Zoe draws a counter and puts it back, 40 times. She gets red 10 times. About what fraction of the bag is red? [[{10/40} = {1/4}. About {1/4} of the counters are red.]]
:::
::: retrieval
1. Find P(roll a number less than 3) on a die.
=> 1 and 2 match. {2/6} = {1/3}
2. A bag has 2 red and 8 blue counters. Find P(blue) as a percent.
=> {8/10} = 80%
3. P(rain) = 0.4. Find P(no rain).
=> 1 − 0.4 = 0.6
4. Find 15% of 60.
=> 10% is 6 and 5% is 3. 6 + 3 = 9.
5. ★ Stretch: A spinner has red, blue and green parts. P(red) = 0.25 and P(blue) = 0.5. Find P(green).
=> 1 − 0.25 − 0.5 = 0.25
:::

## Section 4: Comparing and deciding
Learning target: I can predict results from theory. I can compare results to theory. I can use probability to decide.

### Vocabulary
- predict :: say what you expect before you do it :: 50 flips: about 25 heads
- pool :: put everyone's data together :: 5 groups × 20 flips = 100 flips
- fair game :: every player has the same probability of winning :: Ava wins on 1–3. Sam wins on 4–6.

#### Predict from theory
Theory helps you predict. Multiply the probability by the number of trials.
@viz percentbar percent=50 top="0%,50%,100%" bottom="0,[[25]],50" toplabel="P(heads)" bottomlabel="flips" width=480 caption="Half of 50 flips: about how many heads?"

::: example Worked Example 1 — Predict
Lily will roll a die 120 times. Predict how many 3s she will get.
@viz dice hot="3" label="Event: roll a 3"
Step 1: P(roll a 3) = [[{1/6}]].
Step 2: Predict: {1/6} × 120 = 120 ÷ 6 = [[20]].
Step 3: She should get [[about 20]] threes. It may not be exactly 20.
:::

#### A few trials or many?
A few trials can give results far from the theory. Many trials get close to it.
@viz trials data="10:0.7;20:0.6;50:0.56;100:0.47;200:0.52;500:0.49" theory=0.5 theorylabel="theory: 0.5" xlabel="number of flips so far" ylabel="P(heads)" caption="Kai's flips. The more flips, the closer to 0.5."

::: misconception
WRONG: "P(heads) = {1/2}. So 10 flips will give exactly 5 heads."
WHY: Each flip is up to chance. Results vary. Ten flips can give 7 heads, or 3.
@viz flips items="H,T,H,H,H,T,H,H,T,H" hot="1,3,4,5,7,8,10" label="10 flips: 7 heads"
RIGHT: Theory tells *about* what to expect. Over many trials, results get close to the theory.
:::

::: example Worked Example 2 — Pool the class data
Five groups each flip a coin 20 times.
@viz bar data="G1:13;G2:8;G3:11;G4:9;G5:12" ymax=14 ystep=2 values=1 title="Heads in 20 flips" ylabel="heads"

| Group | 1 | 2 | 3 | 4 | 5 | All |
|---|---|---|---|---|---|---|
| Heads | 13 | 8 | 11 | 9 | 12 | [[53]] |
| Flips | 20 | 20 | 20 | 20 | 20 | [[100]] |
| Experimental P | 0.65 | 0.4 | [[0.55]] | [[0.45]] | [[0.6]] | [[0.53]] |

Step 1: The groups go from 0.4 to 0.65. A few trials can be far apart.
Step 2: Pool the data: [[53]] heads in [[100]] flips. That is [[0.53]].
Step 3: The pooled result is [[closer to 0.5]] than most groups.
:::

#### Is the game fair?
In a **fair game**, every player has the same chance to win.

::: example Worked Example 3 — A fair game?
Ava and Sam play a dice game. Ava wins on a 1 or 2. Sam wins on 3, 4, 5 or 6.
@viz dice labels="Ava;Ava;Sam;Sam;Sam;Sam" hot="1,2" label="Who wins on each roll?"
Step 1: P(Ava wins) = {2/6} = [[{1/3}]]. P(Sam wins) = [[{4/6} = {2/3}]].
Step 2: The chances are not the same. The game is [[not fair]].
Step 3: Fix it: Ava wins on 1, 2 or 3. Sam wins on [[4, 5 or 6]].
Step 4: Now each player has P = [[{3/6} = {1/2}]].
:::

::: example Worked Example 4 — Which bag?
You win a prize if you draw red. Pick a bag.
@viz bag counters="red:3;blue:2" label="Bag A"
@viz bag counters="red:5;blue:5" label="Bag B"
Step 1: Bag A: P(red) = {3/5} = [[60%]].
Step 2: Bag B: P(red) = {5/10} = [[50%]].
Step 3: Pick Bag [[A]]. It has fewer red counters, but a bigger chance of red.
:::

::: example Worked Example 5 — A weather forecast
The forecast for Calgary says a 70% chance of rain.
@viz percentbar percent=70 top="0%,70%,100%" bottom="0,0.7,1" toplabel="percent" bottomlabel="decimal" width=480
Step 1: P(rain) = 70% = 0.7. Rain is likely, but not certain.
Step 2: P(no rain) = 100% − 70% = [[30%]].
Step 3: Should Tess bring a raincoat to the parade? [[Yes. Rain is more likely than no rain.]]
Step 4: It stayed dry. Was the forecast wrong? [[No. A 30% chance can happen. 70% is not 100%.]]
:::
::: explain
In Worked Example 2, why is the pooled result closer to 0.5 than most groups?
(lines 2)
=> It uses 100 flips, not 20. More trials usually give a result closer to the theory.
:::

::: try
1. Predict the number of heads in 80 flips. [[{1/2} × 80 = about 40 heads]]
2. A spinner has 4 equal parts. One is red. Predict the number of reds in 200 spins. [[{1/4} × 200 = about 50 reds]]
@viz spin sections="red;blue;yellow;green" size=120
3. Ben flips a coin 10 times. He gets 3 heads. He says the coin is broken. Is he right? [[Not likely. 10 flips is only a few trials. Results vary. He should do many more flips.]]
4. Mia wins on red. Kai wins on blue or green. Is the game fair? [[No. P(Mia wins) = {1/3}. P(Kai wins) = {2/3}.]]
@viz spin sections="red;blue;green" size=120 label="3 equal parts"
5. Edmonton has a 20% chance of snow today. Is snow likely? Find P(no snow). [[No, snow is unlikely. P(no snow) = 80%.]]
6. ★ Stretch: Bag B has 5 red and 5 blue. Add red counters until it beats Bag A (60%). How many? [[Add 3. Then 8 of 13 are red, about 62%. Adding 2 gives 7 of 12, about 58%. That is not enough.]]
:::
::: retrieval
1. A spinner has 5 equal parts. 2 are red. Write P(red) four ways.
=> 2:5, {2/5}, 0.4, 40%
2. Sam got red 9 times in 30 spins. Find the experimental P(red).
=> {9/30} = {3/10} = 0.3 = 30%
3. You roll three 6s in a row. Is a 6 less likely on the next roll?
=> No. P(6) is still {1/6}. Each roll is new.
4. Find the mean of 13, 8, 11, 9 and 12.
=> 53 ÷ 5 = 10.6
5. ★ Stretch: You roll a die 90 times. Predict how many 5s or 6s you get.
=> P = {2/6} = {1/3}. {1/3} × 90 = about 30 times.
:::

## Unit Synthesis
1. A Stampede booth has a spinner with 8 equal parts. Yellow wins a big prize. Green wins a small prize. Blue wins nothing. Find each probability as a fraction and a percent. Do they add to 1?
@viz spin sections="yellow;green;blue;green;blue;green;blue;blue" size=190
=> P(big prize) = {1/8} = 12.5%. P(small prize) = {3/8} = 37.5%. P(nothing) = {4/8} = {1/2} = 50%.
=> 12.5% + 37.5% + 50% = 100%. Yes, they add to 1.
2. 400 people play in one day. Predict the number of big prizes.
=> {1/8} × 400 = 400 ÷ 8 = about 50 big prizes.
3. Tess spins 40 times. She gets yellow 3 times, green 17 times and blue 20 times. Find each experimental probability. Compare them to the theory.
@viz bar data="yellow:3;green:17;blue:20" ymax=20 ystep=5 values=1 title="Tess's 40 spins" ylabel="times"
=> Yellow: {3/40} = 7.5%. Green: {17/40} = 42.5%. Blue: {20/40} = 50%.
=> Blue matches the theory. Yellow is lower and green is higher. 40 spins is only a few trials, so results vary.
4. Tess loses 5 spins in a row. She says her next spin is sure to win. Is she right?
=> No. Each spin is new. P(win a prize) is still {4/8} = {1/2}.
5. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Outcomes, events and likelihood
An **outcome** is one possible result. An **event** is the outcomes you are looking for.
**Favourable** outcomes match the event. Probability goes from 0 (**impossible**) to 1 (**certain**).
Bigger parts or more counters make an outcome **more likely**.
:::
@viz numberline min=0 max=1 step=0.25 ticklabels="0:0;0.25:unlikely;0.5:even chance;0.75:likely;1:1" ends="impossible,certain" width=520

::: key Theoretical probability
**Sample space:** the list of all outcomes. Coin: {H, T}. Die: {1, 2, 3, 4, 5, 6}.
**P(event) = favourable ÷ all**, for equally likely outcomes.
Four ways: 1:4, {1/4}, 0.25, 25%. All the probabilities in a sample space add to 1.
:::
@viz bag counters="red:3;blue:2;yellow:5" label="P(red) = 3/10 = 0.3 = 30%"

::: key Experimental probability
**Experimental P = times it happened ÷ number of trials.**
Draw with replacement: put it back. A **simulation** uses a coin, die or spinner to act it out.
Trials don't affect each other. A coin has no memory.
:::
@viz flips items="H,H,H,H,H,?" label="Next flip: P(tails) is still 1/2"

::: key Comparing and deciding
**Predict:** probability × number of trials. 120 rolls: about {1/6} × 120 = 20 threes.
A few trials can be far from the theory. Many trials (or pooled data) get close.
A **fair game** gives every player the same chance.
:::
@viz trials data="10:0.7;20:0.6;50:0.56;100:0.47;200:0.52;500:0.49" theory=0.5 theorylabel="theory: 0.5" xlabel="number of flips" height=120

| Mistake | Fix |
|---|---|
| A probability can be 3, or 120% | A probability is from 0 to 1 (0% to 100%). |
| It happens or it doesn't, so it's 50-50 | Count the equally likely outcomes. P(roll a 6) = {1/6}. |
| After 5 heads, tails is due | Each flip is new. The coin has no memory. |
| P = {1/2}, so 10 flips give exactly 5 heads | Results vary. They get close to theory over many trials. |
