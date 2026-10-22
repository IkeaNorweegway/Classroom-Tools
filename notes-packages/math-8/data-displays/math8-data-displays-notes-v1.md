---
title: Data Displays
topic: data-displays
strand: statistics-probability
---
<!-- Gate: progressive blanking confirmed. Refutation-first on: "a circle graph can show change over time" (DD1),
     "the taller bar is always a lot bigger" (DD3), "a picture twice as tall shows twice as much" (DD3).
     Section order: what each graph shows (DD1) → choosing a graph (DD2) → how graphs mislead (DD3) → checking conclusions (DD4).
     Codes DD1–DD4. Outcome SP1. Data marked "sample" is made up for teaching; Edmonton temperatures are rounded long-term averages. -->

## Pre-Knowledge Check
1. Name all the kinds of graphs you know.
2. Have you ever seen a graph in an ad or on the news that seemed unfair? What was it?
3. What is a good graph for showing how tall you have grown each year?

## Section 1: Four kinds of graphs
Learning target: I can say what a bar graph, line graph, circle graph and pictograph each show best.

### Vocabulary
- bar graph :: bars compare amounts in different groups :: favourite sports in a class
- line graph :: points joined by lines show change over time :: temperature each month
- circle graph :: slices show parts of one whole, in percents :: how a budget is spent
- pictograph :: pictures show amounts; a key says what one picture is worth :: one ● = 10 cans
- scale :: the numbers along an axis :: 0, 5, 10, 15

#### Bar graph — compare groups
@viz bar data="Hockey:9;Soccer:6;Basketball:5;Volleyball:4" values=1 ymin=0 ymax=10 ystep=2 ylabel="students" title="Favourite sport (sample class data)"
The most popular sport is [[hockey]]. A bar graph is good for [[comparing]] groups.

#### Line graph — change over time
@viz line data="Jan:-10;Mar:-4;May:11;Jul:18;Sep:11;Nov:-5" ymin=-12 ymax=20 ystep=4 ylabel="°C" title="Edmonton: average temperature (about)"
The temperature goes [[up]] from January to July, then [[down]]. A line graph shows [[change over time]].

#### Circle graph — parts of one whole
@viz pie data="Rent:40;Food:25;Transport:15;Fun:10;Savings:10" title="A monthly budget (sample)"
All the slices add up to [[100%]]. A circle graph shows [[parts of a whole]].

#### Pictograph — pictures stand for amounts
@viz picto data="Mon:3;Tue:4.5;Wed:2;Thu:5" per="10 cans" title="Cans collected for the food bank (sample)"
On Tuesday, the class collected [[45]] cans. Half a picture means [[5]] cans.

::: misconception
WRONG: "A circle graph is good for showing how something changes over time."
WHY: A circle graph shows how ONE whole is split up at ONE time. It has no time axis.
RIGHT: Use a line graph for change over time. Use a circle graph for parts of a whole.
:::

::: explain
Why do the slices of a circle graph have to add up to 100%?
(lines 2)
=> The circle is the whole thing (100%). Each slice is a part of it, so all the parts together make the whole.
:::

::: try
Match each graph to its job.
| Graph | Best job |
|---|---|
| bar graph | [[compare groups]] |
| line graph | [[show change over time]] |
| circle graph | [[show parts of a whole]] |
| pictograph | [[compare groups with pictures and a key]] |
:::

::: retrieval
1. Which graph shows parts of a whole?
=> A circle graph.
2. Which graph is best for your height each year?
=> A line graph (change over time).
3. In a pictograph, one ● = 4 people. How many people do ●●● and half a ● stand for?
=> 14
4. Sam wants to show how his savings grew each month for a year. He picks a circle graph. Is that a good choice? Why?
=> No. A circle graph shows parts of one whole. Savings over time needs a line graph.
5. ★ Stretch: The budget graph shows 25% for food. If the budget is $2000 a month, how much is food?
=> 25% of $2000 = $500
:::

## Section 2: Choosing a graph
Learning target: I can choose the best graph for a set of data and explain my choice.

### Vocabulary
- strength :: what a graph shows well :: a bar graph makes comparing easy
- limitation :: what a graph does not show well :: a pictograph can't show exact values
- data set :: a group of collected information :: the number of cans each day

The same data can go on different graphs. Each one shows it in a different way.

::: example Worked Example 1 — One data set, two graphs
Students' favourite fruit (sample): apple 8, banana 6, grapes 4, orange 2. Total [[20]].
@viz bar data="Apple:8;Banana:6;Grapes:4;Orange:2" values=1 ymin=0 ymax=10 ystep=2 ylabel="students"
@viz pie data="Apple:40;Banana:30;Grapes:20;Orange:10"
The bar graph shows the exact [[number]] in each group.
The circle graph shows each group as a [[percent]] of the class.
Apple: 8 out of 20 = [[40%]]
:::

::: explain
Which graph would you use to tell the principal "most students like apples or bananas"? Why?
(lines 2)
=> The circle graph: it shows that apple and banana together make 70% of the whole class.
:::

::: key Strengths and limitations
| Graph | Strength | Limitation |
|---|---|---|
| bar | easy to compare groups; shows exact amounts | doesn't show parts of a whole well |
| line | shows trends and changes over time | only for data that changes in order (time) |
| circle | shows each part of a whole | hard to compare small slices; no exact counts unless labelled |
| pictograph | eye-catching; easy to read | hard to show exact values with part pictures |
:::

::: try
Which graph would you choose? Explain.
a) Daily high temperatures in Calgary for two weeks: [[line graph — change over time]]
b) How Alberta's land is used (farm, forest, cities, other): [[circle graph — parts of a whole]]
c) The number of medals won by five countries: [[bar graph (or pictograph) — compare groups]]
:::

::: retrieval
1. Give one strength and one limitation of a pictograph.
=> Strength: easy to read and eye-catching. Limitation: hard to show exact values.
2. Why is a line graph a poor choice for favourite colours?
=> Colours are groups, not times in order. The line between points means nothing.
3. A class has 25 students. 10 walk to school. What percent of the circle graph is "walk"?
=> 40%
4. You want to compare the exact number of goals scored by 6 players. Which graph?
=> A bar graph.
5. ★ Stretch: Could you make a circle graph of the monthly temperatures in Edmonton? Why or why not?
=> No. The temperatures are not parts of one whole, and some are negative.
:::

## Section 3: Misleading graphs
Learning target: I can explain how the way a graph is drawn can make data look different from what it is.

### Vocabulary
- misleading :: gives the wrong idea, even if the numbers are true :: a graph that makes a small gap look huge
- broken axis :: an axis that does not start at 0 :: the y-axis starts at 45
- interval :: the gap between numbers on an axis :: 0, 10, 20 has an interval of 10

::: misconception
WRONG: "The taller bar is always a lot bigger."
WHY: Look where the y-axis starts. If it starts at 45, not 0, a small difference looks huge.
RIGHT: Read the numbers, not just the heights.
:::

::: example Worked Example 2 — Same data, two pictures
Wins in a season (sample): Team A 52, Team B 48.
@viz bar data="Team A:52;Team B:48" ymin=45 ymax=53 break=1 title="Graph 1"
@viz bar data="Team A:52;Team B:48" ymin=0 ymax=60 ystep=10 title="Graph 2"
In Graph 1, Team A's bar looks about [[2]] times as tall as Team B's.
In Graph 2, the bars look almost the [[same]].
The real difference is only [[4]] wins. Graph [[1]] is misleading because its axis starts at 45.
:::

::: explain
Why might a team's fan club want to use Graph 1?
(lines 2)
=> It makes their team look much better than the other team, even though the difference is small.
:::

::: misconception
WRONG: "If a picture is twice as tall, it shows twice as much."
WHY: When a picture is made twice as tall AND twice as wide, its area is 4 times as big. It looks like 4 times as much.
RIGHT: Use pictures of the same size, and repeat them. Or use bars of the same width.
@viz picto data="2015:1;2025:2" mode=scaled caption="Sales doubled, but the right circle looks about 4 times bigger."
:::

#### Other tricks to watch for
- Uneven intervals on an axis (0, 10, 20, 50, 100)
- Bars of different widths
- Missing labels or no scale
- Only showing part of the data (a few months, not the whole year)

::: try
@viz line data="2019:120;2020:121;2021:122;2022:124;2023:125" ymin=119 ymax=126 ystep=1 title="Bus riders (thousands) — sample"
a) What does the graph seem to show? [[Riders are shooting up quickly.]]
b) How many riders were added from 2019 to 2023? [[5 thousand, about 4%]]
c) Why is this graph misleading? [[The y-axis starts at 119, so a small change looks steep.]]
:::

::: retrieval
1. What is a broken axis? Why can it mislead?
=> An axis that doesn't start at 0. Small differences look big.
2. A poster shows a bag of chips twice as tall and twice as wide to show "twice the chips." What is wrong?
=> The picture's area is 4 times as big, so it looks like 4 times as many chips.
3. A graph's axis goes 0, 5, 10, 50, 100. What is the problem?
=> The intervals are not equal, so the bars or line are out of proportion.
4. Name two other ways a graph can mislead.
=> Different bar widths; missing labels; showing only part of the data.
5. ★ Stretch: Redraw the bus-rider data so it is fair. What axis would you use?
=> Start the y-axis at 0 (0 to 130 by 10s). The line looks nearly flat, which matches the small change.
:::

## Section 4: Checking conclusions
Learning target: I can tell if a conclusion matches the data, and explain what is wrong if it doesn't.

### Vocabulary
- conclusion :: a statement someone makes from the data :: "Hockey is the most popular sport in our class."
- trend :: the general direction of the data :: going up over time
- evidence :: the data that supports a statement :: hockey has the tallest bar

::: example Worked Example 3 — Check the conclusion
@viz line data="Jan:3;Feb:4;Mar:4;Apr:8;May:5;Jun:6" ymin=0 ymax=10 ystep=2 ylabel="books" title="Books read by Ava (sample)"
Conclusion: "Ava reads more every month."
Check: from March to April it went [[up]], but from April to May it went [[down]].
The conclusion is [[not correct]]. A better one: "Ava read the most books in [[April]]."
:::

::: explain
How do you check if a conclusion matches a graph?
(lines 2)
=> Look at the actual numbers on the graph and test the statement against each one.
:::

::: example Worked Example 4 — Part of the data
A news story says: "Edmonton temperatures are rising fast!" It shows only January to July.
@viz line data="Jan:-10;Mar:-4;May:11;Jul:18" ymin=-12 ymax=20 ystep=4 ylabel="°C"
Why is this misleading? It only shows [[winter to summer]]. Of course it gets warmer. The full year goes back [[down]] in the fall.
:::

::: try
@viz bar data="Grade 6:30;Grade 7:45;Grade 8:40;Grade 9:35" values=1 ymin=0 ymax=50 ystep=10 ylabel="students" title="Students in the run club (sample)"
Is each conclusion correct? Write yes or no and why.
a) "Grade 7 has the most runners." [[Yes — 45 is the biggest bar.]]
b) "More students join each year as they get older." [[No — it goes down after Grade 7.]]
c) "Grade 8 has twice as many runners as Grade 6." [[No — 40 is not double 30.]]
:::

::: retrieval
1. What is a conclusion?
=> A statement someone makes based on the data.
2. A graph shows sales went up in 3 of 5 months. Someone says, "Sales went up every month." Is that right?
=> No. Sales only went up in 3 of the 5 months.
3. Why is it a problem to show only part of the data?
=> The part you show might have a different pattern from the whole data.
4. A circle graph shows 30% chose pizza. Someone says "Most students chose pizza." Is that right?
=> No. 30% is less than half; "most" means more than 50%.
5. ★ Stretch: Write one conclusion that IS supported by the run-club graph and one that is NOT.
=> Supported: "Grade 9 has 5 more runners than Grade 6." Not supported: "Grade 9 runners are faster."
:::

## Unit Synthesis
1. For each graph type (bar, line, circle, pictograph), write one job it does well.
=> Bar: compare groups. Line: change over time. Circle: parts of a whole. Pictograph: compare with pictures.
2. Draw a small example of a misleading graph. Explain the trick.
(work 4)
=> Answers vary, e.g. a bar graph whose axis starts at 90.
3. How can you check whether a conclusion matches the data?
=> Read the real numbers and test the statement against them.
4. Look back at your first page. What would you change now?
=> Answers vary.

## Concept Reference
::: key Which graph?
**Bar** → compare groups. **Line** → change over time. **Circle** → parts of a whole (adds to 100%). **Pictograph** → compare with pictures (check the key).
:::
@viz bar data="Hockey:9;Soccer:6;Basketball:5" ymin=0 ymax=10 ystep=2 title="Bar graph"
@viz pie data="Rent:40;Food:25;Transport:15;Fun:10;Savings:10" title="Circle graph"

::: key How graphs mislead
- y-axis that doesn't start at 0 (broken axis)
- uneven intervals on an axis
- bars of different widths
- pictures made taller AND wider (area grows 4 times)
- missing labels, or only part of the data
:::
@viz bar data="Team A:52;Team B:48" ymin=45 ymax=53 break=1 title="Starts at 45: misleading"

::: key Checking conclusions
Test the statement against the actual numbers. Watch for words like "always," "every," "most" and "twice."
:::

| Mistake | Fix |
|---|---|
| Circle graph for change over time | Line graph |
| Taller bar = much bigger | Check where the axis starts |
| Twice as tall picture = twice as much | Area grows 4 times; repeat pictures instead |
