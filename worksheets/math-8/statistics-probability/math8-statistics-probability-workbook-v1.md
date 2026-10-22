---
title: Statistics and Probability
strand: statistics-probability
rubric:
  - Graphs: what bar, line, circle and pictographs each show best
  - Choosing a graph and explaining the choice
  - Misleading graphs and conclusions the data does not support
  - Probability of one event as a fraction, decimal and percent
  - Two independent events: trees, tables and the multiply rule
  - Experiments versus theory
---
<!-- Gate: interleaving confirmed. No part headers. ★/★★ per cluster: graph types (DD1–2), misleading graphs and conclusions (DD3–4),
     one event (PB1), two events (PB2–3), experiments (PB4) — each 3+ times. Bloom's: 1 recall, the rest apply / analyze / evaluate.
     Visuals on 12 of 18 questions. Contexts from the notes: food-bank cans, team wins, Edmonton temperatures, coin and die, spinners, forecasts. -->

## core | PB1 — Probability, Section 1
Use the spinner. Find each probability as a fraction and a percent.
@viz spinner sections="red,blue,red,yellow"
a) P(red)
b) P(yellow)
c) P(green)
(lines 2)
=> a) 2/4 = 50% b) 1/4 = 25% c) 0 = 0%

## core | DD1 — Data Displays, Section 1
Use the pictograph.
@viz picto data="Mon:2.5;Tue:4;Wed:3" per="10 cans" title="Cans for the food bank (sample)"
How many cans were collected in all?
(lines 1)
=> 25 + 40 + 30 = 95 cans

## core | PB2 — Probability, Section 2
Draw a tree for flipping a coin and spinning a spinner with 3 equal parts (1, 2, 3). How many outcomes?
@viz tree first="H,T" second="1,2,3" outcomes=blank
(lines 1)
=> 6 outcomes: H1, H2, H3, T1, T2, T3

## core | DD2 — Data Displays, Section 2
Which graph would you choose? Explain.
a) The percent of a family budget spent on rent, food and fun.
b) A puppy's mass every week for 10 weeks.
(lines 2)
=> a) Circle graph — parts of a whole. b) Line graph — change over time.

## core | PB3 — Probability, Section 3
Roll a die and flip a coin. Use the multiply rule to find P(a 2 and heads). Then check with the table.
@viz outcomes rows="H,T" cols="1,2,3,4,5,6" highlight="H2"
(lines 2)
=> 1/6 × 1/2 = 1/12. The table has 12 cells and H2 is one of them ✓

## core | DD3 — Data Displays, Section 3
Look at the graph.
@viz bar data="Oilers:51;Flames:47" ymin=45 ymax=52 break=1 title="Wins (sample)"
Why is it misleading? How would you fix it?
(lines 2)
=> The axis starts at 45, so a 4-win gap looks huge. Start the axis at 0.

## core | PB4 — Probability, Section 4
A class rolled a die 60 times. They got a 3 sixteen times. Write the experimental and theoretical P(3).
(lines 2)
=> Experimental: 16/60 ≈ 27%. Theoretical: 1/6 ≈ 17%.

## CHECKIN

## ext | PB2 — Probability, Section 2
Ella flipped heads 6 times in a row. "Tails is due," she says. Is she right? Use the word independent.
(lines 3)
=> No. Flips are independent; the coin has no memory. P(tails) is still 1/2.
::: teacher
label: Misconception target
Gambler's fallacy.
:::

## ext | DD1 — Data Displays, Section 1
Leo made a circle graph to show how Edmonton's temperature changes from month to month. Explain why that is a poor choice and what he should use.
@viz line data="Jan:-10;Mar:-4;May:11;Jul:18;Sep:11;Nov:-5" ymin=-12 ymax=20 ystep=4 ylabel="°C" title="Edmonton temperature (about)"
(lines 3)
=> A circle graph shows parts of one whole at one time. Temperatures change over time (and some are negative). He should use a line graph like this one.
::: teacher
label: Misconception target
Circle graph for change over time.
:::

## ext | PB3 — Probability, Section 3
Sam says P(heads and a 6) = {1/2} + {1/6} = {2/3}. Find his mistake. Give two reasons his answer can't be right.
(lines 4)
=> He added instead of multiplying. 1) "And" must be less likely than each event alone, but 2/3 > 1/2. 2) Only 1 of the 12 outcomes is H6, so P = 1/12.
::: teacher
label: Misconception target
Adding for "and."
:::

## ext | DD3 — Data Displays, Section 3
An ad shows a bag of chips twice as tall and twice as wide to show "twice the chips." Explain why the picture is misleading.
@viz picto data="Old:1;New:2" mode=scaled icon=square
(lines 3)
=> The big picture has 4 times the area of the small one, so it looks like 4 times as many chips, not 2 times.
::: teacher
label: Misconception target
Twice as tall = twice as much.
:::

## ext | PB4 — Probability, Section 4
Theory says P(heads) = {1/2}. Ty flipped a coin 10 times and got 3 heads. He says, "Theory is wrong." Is he right? Explain.
(lines 3)
=> No. Theory tells what happens over many trials. 10 flips is a small sample; results vary. With hundreds of flips the results get close to 1/2.
::: teacher
label: Misconception target
"Theory says exactly what will happen."
:::

## ext | DD4 — Data Displays, Section 4
@viz line data="Week 1:12;Week 2:15;Week 3:14;Week 4:20" ymin=0 ymax=25 ystep=5 ylabel="km" title="Distance biked each week (sample)"
Is each conclusion supported? Explain.
a) "The distance went up every week."
b) "The biggest weekly distance was 20 km."
(lines 3)
=> a) No — it went down from week 2 to week 3. b) Yes — week 4 is 20 km.

## stretch | PB3 + DD2 — Probability and Graphs
The chance of snow in Banff is 70% on Saturday and 40% on Sunday (assume independent). Find the chance of snow on both days and on neither day. Which graph would you use to show the forecast for a whole week?
(work 4)
=> Both: 0.7 × 0.4 = 0.28 = 28%. Neither: 0.3 × 0.6 = 0.18 = 18%. A bar graph (compare days) or a line graph (change over the week).

## stretch | PB4 + DD1 — Experiments and Graphs
A class spins a spinner (1 red part out of 4 equal parts) and records red: 20 spins: 7 red; 100 spins: 28 red; 400 spins: 98 red. Find each experimental P(red) as a percent. Draw a bar graph. What do you notice?
@viz bar data="20 spins:35;100 spins:28;400 spins:24.5" ymin=0 ymax=40 ystep=5 ylabel="% red" values=1
(work 4)
=> 35%, 28%, 24.5%. With more spins the results get closer to the theoretical 25%.

## stretch | PB1 + PB3 — Probability
Design a spinner and a coin game where the chance of winning is {1/6}. Explain how you know.
(work 4)
=> Example: spinner with 3 equal parts; win with blue (1/3) AND heads (1/2). 1/3 × 1/2 = 1/6.
