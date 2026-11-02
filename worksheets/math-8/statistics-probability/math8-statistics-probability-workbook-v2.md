---
title: Statistics & Probability
strand: statistics-probability
rubric:
  - Distributions and circle graphs: bar graphs and histograms, interval size, shapes of distributions, choosing mean, median or mode, circle graphs
  - Independent and dependent events: sample spaces, independent events, dependent events (without replacement), probability problems
---
<!-- Gate: interleaving confirmed. No part headers. ★/★★ per topic: distributions and circle graphs (DI1–4),
     independent and dependent events (CP1–4) — every section code at least once outside the stretch,
     Core first, Extended after the check-in, then two mixed stretch questions.
     Contexts from the notes: histograms whose bars touch, tails that point the way of the skew, one big value that
     drags the mean, sector angle = percent × 360°, spinners and coins in a tree, bags drawn without replacement,
     two-dice sum tables.
     Every Statistics & Probability misconception in _courses/math-8/_context.md has a Misconception target box. -->

## core | DI1 — Bar Graphs and Histograms, Section 1
Ben measures 24 sunflower seedlings. He draws the graph with gaps between the bars.
1. Why should the bars of this histogram touch?
2. How many seedlings are 10 cm or taller?
3. Which graph fits "favourite fruit"? Why?
@viz dihist data="0–5:2;5–10:5;10–15:9;15–20:6;20–25:2" edges="0,5,10,15,20,25" xlabel="height (cm)" ylabel="seedlings" title="Sunflower seedling heights" values=1
(lines 3)
=> 1. Height is continuous. A seedling can be 9.9 cm or 10.1 cm. The intervals meet with no space, so the bars touch.
=> 2. 9 + 6 + 2 = 17 seedlings.
=> 3. A bar graph. Fruits are categories, not intervals. The bars have gaps.
::: teacher
label: Misconception target
"A histogram is a bar graph with gaps." Ask: what height sits in the gap between 5 and 10? There is no gap in the numbers, so there is none in the bars.
:::

## core | CP1 — Sample Spaces, Section 1
Ava spins this spinner. Then she flips a coin.
1. Finish the tree.
2. Write the sample space in set notation.
3. How many outcomes? Find P(blue, heads).
@viz spin sections="red;blue;green" size=110
@viz tree first="R,B,G" second="H,T" outcomes=blank
(lines 3)
=> 1. Each colour has two branches, H and T. Outcomes: RH, RT, BH, BT, GH, GT.
=> 2. S = {RH, RT, BH, BT, GH, GT}.
=> 3. 3 × 2 = 6 outcomes. BH is 1 of them: P(blue, heads) = {1/6}.

## core | DI2 — Shapes of Distributions, Section 2
30 people eat lunch at a seniors' centre. Sam says, "The bump is on the right. It is skewed right."
1. Which way does the tail point?
2. Name the shape. Is Sam right?
3. Will the mean be more or less than the median?
@viz dihist data="60–64:2;65–69:3;70–74:5;75–79:9;80–84:11" xlabel="age (years)" ylabel="people" title="Ages at a seniors' lunch" values=1
(lines 3)
=> 1. The tail points left, toward the younger ages.
=> 2. Skewed left. Sam is wrong. The tail names the skew, not the bump.
=> 3. Less. The few younger people pull the mean to the left. Mean < median.
::: teacher
label: Misconception target
"Skewed right means the bump is on the right." Have the student trace the long, low side with a finger. The skew is named for where the finger points.
:::

## core | CP2 — Independent Events, Section 2
Leo spins a four-colour spinner. Then he rolls a die.
He says P(red and 5) = {1/4} + {1/6} = {5/12}.
1. How many outcomes are in the table?
2. Find P(red and 5).
3. Is Leo right? Explain.
@viz outcomes rows="R,B,G,Y" cols="1,2,3,4,5,6" highlight="R5" rowlabel="spinner" collabel="die"
(lines 3)
=> 1. 4 × 6 = 24 outcomes.
=> 2. Only R5 works. P(red and 5) = {1/4} × {1/6} = {1/24}.
=> 3. No. {5/12} = {10/24}, that is 10 cells. "And" means both happen. That must be less likely than red alone ({1/4}). For "and", multiply.
::: teacher
label: Misconception target
"P(A and B) = P(A) + P(B)." Point to the single shaded cell: 1 of 24. Then ask if "red and 5" can be more likely than "red".
:::

## core | DI4 — Circle Graphs, Section 4
40 Grade 8 students name their favourite after-school activity.
Sports 18, Gaming 10, Music 8, Art 4.
1. Find each percent.
2. Find each sector angle. Check that they add to 360°.
3. Mia wants to show sports sign-ups each year from 2022 to 2025. Should she use a circle graph?
@viz dipie data="Sports:18;Gaming:10;Music:8;Art:4" labels="Sports:[[162°]];Gaming:[[90°]];Music:[[72°]];Art:[[36°]]" arc="Sports" title="Favourite after-school activity" total="40 students"
(lines 4)
=> 1. Sports {18/40} = 45%. Gaming {10/40} = 25%. Music {8/40} = 20%. Art {4/40} = 10%.
=> 2. 0.45 × 360° = 162°. 0.25 × 360° = 90°. 0.20 × 360° = 72°. 0.10 × 360° = 36°. 162 + 90 + 72 + 36 = 360° ✓.
=> 3. No. A circle graph shows parts of one whole at one time. Change over time needs a line graph.
::: teacher
label: Misconception target
"A circle graph can show change over time." Ask: what is the whole circle in Mia's graph? Four years is not one whole.
:::

## core | CP3 — Dependent Events, Section 3
A bag has 4 red and 2 blue counters. Jo takes two, without putting the first back.
Jo says P(blue, then blue) = {2/6} × {2/6}.
1. Fill in the bag after a blue is drawn.
2. Find P(blue, then blue).
3. Is Jo right? Are the draws independent?
@viz cpdraw before="red:4;blue:2" take="blue" beforelabel="1st: 2 blue of 6" afterlabel="2nd: [[1]] blue of [[5]]"
(lines 3)
=> 1. 1 blue and 4 red are left: 5 counters.
=> 2. {2/6} × {1/5} = {2/30} = {1/15}.
=> 3. No. The first draw changes the bag. The second pick is 1 blue of 5, not 2 of 6. The draws are dependent.
::: teacher
label: Misconception target
"Without replacement, the second pick has the same chances." Have the student count the counters left after the first draw: both the top and bottom numbers drop.
:::

## CHECKIN

## ext | DI3 — Choosing Mean, Median or Mode, Section 3
Six friends get a weekly allowance: $10, $12, $12, $15, $16, $85.
Ava says the typical allowance is $25.
1. Find the mean, median and mode.
2. Which one did Ava use?
3. Which best shows a typical allowance? Why?
@viz numstrip rows="10,12,12,15,16,85" labels="Allowances in order" hot="1:6"
(lines 4)
=> 1. Mean: 150 ÷ 6 = $25. Median: (12 + 15) ÷ 2 = $13.50. Mode: $12.
=> 2. The mean.
=> 3. The median, $13.50. The data is skewed right. The one $85 drags the mean up. Five of six friends get less than $25.
::: teacher
label: Misconception target
"The mean is always the best average." Ask how many friends actually get $25 or more. One big value moves the mean but not the median.
:::

## ext | CP4 — Probability Problems, Section 4
Kai rolls a red die and a blue die. He adds the numbers.
1. Shade the sums of 8. Find P(sum 8) as a fraction and a percent.
2. Find P(sum 10 or more).
3. Kai says a sum of 7 and a sum of 12 are just as likely. Is he right?
@viz cpsum rowlabel="red die" collabel="blue die"
(lines 4)
=> 1. 8 shows up 5 times: 2+6, 3+5, 4+4, 5+3, 6+2. P = {5/36} ≈ 0.139 ≈ 13.9%.
=> 2. Sum 10: 3 cells. Sum 11: 2. Sum 12: 1. That is 6 of 36: {6/36} = {1/6}.
=> 3. No. 7 shows 6 times ({6/36} = {1/6}). 12 shows once ({1/36}). A sum of 7 is six times as likely.

## ext | DI1 — Interval Size, Section 1
16 runners' 5 km times, in minutes:
21, 23, 24, 26, 27, 27, 28, 29, 31, 32, 33, 34, 36, 38, 41, 44.
1. Draw the histogram with intervals of 5.
2. What does it show that the intervals of 10 hide?
@viz dihist data="20–29:8;30–39:6;40–49:2" xlabel="time (minutes)" ylabel="runners" title="Intervals of 10" values=1 width=240
@viz dihist data="20–24:3;25–29:5;30–34:4;35–39:2;40–44:2" ymax=6 empty=1 xlabel="time (minutes)" ylabel="runners" title="Intervals of 5"
(lines 4)
=> 1. 20–24: 3. 25–29: 5. 30–34: 4. 35–39: 2. 40–44: 2. Total 16 ✓.
=> 2. The peak is at 25–29 minutes. After 30 the bars get shorter: a tail to the right. The wide bars hide where the peak is.

## ext | CP3 — Dependent Events, Section 3
A box has 3 chocolate (C) and 7 oat (O) granola bars. Raj takes two without looking. He eats the first.
1. Fill in the tree.
2. Find P(both chocolate).
3. Find P(one of each).
4. With replacement, P(C, C) = {3/10} × {3/10}. Is that more or less than your answer to 2?
@viz cptree first="C,O" p1="3/10,7/10" second="C,O|C,O" p2="[[2/9]],[[7/9]]|[[3/9]],[[6/9]]" hot="CC" probs="[[6/90]];[[21/90]];[[21/90]];[[42/90]]"
(lines 4)
=> 1. After C: {2/9} C, {7/9} O. After O: {3/9} C, {6/9} O.
=> 2. {3/10} × {2/9} = {6/90} = {1/15} (about 0.067).
=> 3. CO + OC = {21/90} + {21/90} = {42/90} = {7/15}.
=> 4. With replacement: {9/100} = 0.09. That is more. Without replacement, fewer chocolate bars are left for the second pick.
=> Check: 6 + 21 + 21 + 42 = 90 ✓.

## stretch | DI4 + CP2 — Circle Graphs and Independent Events
This spinner is a circle graph. Red is 180°. Blue and yellow are 90° each.
1. Write each colour as a percent and a probability.
2. Spin two times. Fill in the P column. Find P(red, then blue).
3. Find P(same colour both times).
@viz spin sections="red:2;blue:1;yellow:1" size=120
@viz cptree first="R,B,Y" p1="1/2,1/4,1/4" second="R,B,Y" probs="[[1/4]];[[1/8]];[[1/8]];[[1/8]];[[1/16]];[[1/16]];[[1/8]];[[1/16]];[[1/16]]"
(lines 4)
=> 1. Red: {180/360} = 50% = {1/2}. Blue: {90/360} = 25% = {1/4}. Yellow: 25% = {1/4}.
=> 2. {1/2} × {1/4} = {1/8} = 12.5%. The spins are independent, so multiply.
=> 3. RR + BB + YY = {1/4} + {1/16} + {1/16} = {6/16} = {3/8} = 37.5%.

## stretch | DI1 + DI3 + CP2 — Graphs, Averages and Probability
24 Grade 7 and 24 Grade 8 students say how many siblings they have.
1. Find the mode and median for each grade.
2. Which grade tends to have more siblings? Use the medians.
3. Pick one student from each grade at random. Find P(both have 0 siblings).
@viz didouble cats="0;1;2;3;4" data="4,9,6,3,2" data2="3,8,7,4,2" label="Grade 7" label2="Grade 8" xlabel="siblings" ylabel="students" values=1 ymax=10 ystep=2
(lines 5)
=> 1. Grade 7: mode 1. The 12th and 13th values are both 1, so the median is 1. Grade 8: mode 1. The 12th and 13th values are both 2, so the median is 2.
=> 2. Grade 8 (median 2 against 1). The means agree: Grade 7 is {38/24} ≈ 1.6, Grade 8 is {42/24} = 1.75.
=> 3. {4/24} × {3/24} = {12/576} = {1/48}. The picks are independent, so multiply.
