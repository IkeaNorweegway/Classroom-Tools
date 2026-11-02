---
title: Samples & Statistics
topic: samples-statistics
strand: statistics-probability
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "A census is always better" (ST1). "Ask your friends — that's a fair sample" (ST2).
     "The median is the middle number in the list as given" and "The mode (or the range) is the biggest
     number" (ST3). "A sample tells us the exact answer for everyone" (ST4).
     Section order: the question and its population come first (ST1), because you cannot judge a sample
     until you know who it stands for. Then how to pick a fair sample at random (ST2): only a
     representative sample is worth summing up. Then the four statistics on one sample (ST3). Last, two
     samples of the same population side by side, and what we can and cannot say about everyone (ST4).
     Discrete vs continuous data sits in ST1, with the kinds of data a question collects.
     Outcomes 7ST1.1 (ST1, ST2) and 7ST1.2 (ST3, ST4). Dot plots and tables only: no histograms,
     circle graphs or distribution shape (Grade 8). Outliers only as "one big value pulls the mean" (★★). -->

## Pre-Knowledge Check
1. Find 12 + 15 + 9 + 14 + 10.
2. Find 60 ÷ 5.
3. Put these in order from least to greatest: 18, 7, 25, 12, 30.
4. What number is halfway between 20 and 30?
5. Find 45 − 10.
6. How many students in this dot plot have 2 pets?
@viz dotplot data="0,0,1,1,1,2,2,3" min=0 max=4 xlabel="number of pets"

## Section 1: Populations, samples and census
Learning target: I can name the population for a question. I can say when to use a census or a sample.

### Vocabulary
- statistical question :: a question with answers that vary. You need data from many people or things. :: How long do Grade 7 students sleep?
- data :: facts or numbers we collect :: 8, 9, 7, 9 hours of sleep
- population :: everyone or everything the question is about :: all Grade 7 students at our school
- census :: data from the whole population :: ask all 24 students in the class
- sample :: data from part of the population :: ask 30 of the 120 Grade 7 students
- discrete data :: data you count. Only some values can happen, like whole numbers. :: goals, pets, brothers and sisters
- continuous data :: data you measure. Any value in between can happen. :: height, time, mass, temperature

#### Statistical questions
"How tall is Sam?" has one answer. Measure Sam once.
"How tall are Grade 7 students?" has many answers. Heights **vary**. That is a **statistical question**.
@viz flow steps="Ask a question|Name the population|Census or sample?|Collect the data" caption="The steps of a data project."

#### The population
The **population** is everyone or everything the question is about. Say who, where and when.
@viz people n=40 cols=20 title="Population: all 40 Grade 7 students at Ridge School" caption="Every person in the question is in the population."

::: example Worked Example 1 — Name the population
Question: "How many minutes do Grade 7 students at Ridge School read each night?"
@viz people n=40 cols=20 groups="1-40:cold" label="who? Grade 7 students · where? Ridge School · when? this year"
Step 1: Who is the question about? Grade 7 students.
Step 2: Where? At Ridge School.
Step 3: The population is [[all Grade 7 students at Ridge School]].
:::

#### Census or sample?
A **census** asks the whole population. A **sample** asks part of it.
@viz people n=24 cols=12 pick="1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24" label="Census: ask all 24 students in the class" caption="A census: every person is picked."
@viz people n=40 cols=10 pick="2,7,13,18,24,29,35,38" label="Sample: ask 8 of the 40 students" caption="A sample: only the dark people are asked."

Use a sample when a census is:
- **too costly.** Asking every Albertan costs a lot of money.
- **too slow.** Counting every car on the QE2 highway takes too long.
- **too hard.** You cannot catch every fish in Lac La Biche.

::: key Census or sample
A **census** collects data from the whole population.
A **sample** collects data from part of the population.
Small population, easy to ask? Use a census.
Too costly, too slow or too hard? Use a sample.
:::

::: misconception
WRONG: "A census is always better. Let's measure every fish in Lac La Biche."
WHY: The lake has many thousands of fish. Catching all of them would take years. It would also harm the fish.
@viz dotplot data="38,42,44,46,46,48,50,52" min=36 max=54 step=2 title="A sample: 8 walleye from the lake" xlabel="length (cm)" caption="8 fish give a good estimate. No need to catch them all."
RIGHT: A census is not always possible. A good sample gives a close answer for less time and money.
:::

::: example Worked Example 2 — Census or sample?
Pick a census or a sample. Say why.
@viz flow steps="How big is the population?|Can you reach everyone?|Small and easy: census|Too big or hard: sample" width=600
Step 1: Favourite lunch of the 24 students in Mr. Lee's class. Small and easy to ask: a **census**.
Step 2: Lengths of walleye in Lac La Biche. Too many fish to catch: a **sample**.
Step 3: Cars on the QE2 highway in one day. Too many to count by hand: a [[sample]].
:::

#### What kind of data?
Data you **count** is **discrete**. You can have 2 pets or 3 pets. You cannot have 2.6 pets.
Data you **measure** is **continuous**. A height can be 152 cm, 152.4 cm or 152.45 cm.

::: example Worked Example 3 — Discrete or continuous?
@viz dotplot data="1,2,2,3,3,3,4,5" min=0 max=6 title="Goals in 8 games" xlabel="goals (count them)" caption="Goals are counted. Only whole numbers can happen."
@viz numberline min=150 max=156 step=1 points="151.5:Ava;153.2:Sam;154.8:Noor" width=420 caption="Heights are measured. Any number in between can happen."
Step 1: Goals in a hockey game: you count them. **Discrete.**
Step 2: Height of a student: you measure it. **Continuous.**
Step 3: Time on the school bus: you measure it. [[Continuous.]]
:::
::: explain
In Worked Example 2, why is a census fine for Mr. Lee's class but not for the lake?
(lines 2)
=> The class is small, so it is quick to ask all 24 students. The lake has too many fish to catch them all.
:::

::: try
1. Question: "How many hours do Edmonton Grade 7 students sleep?" Name the population. [[All Grade 7 students in Edmonton.]]
2. Is "What time does our school start?" a statistical question? [[No. It has one answer.]]
3. Census or sample: the number of pets of the 26 students in your class? [[Census. The class is small.]]
4. Census or sample: the favourite snack of every Albertan? Say why. [[Sample. A census would cost too much and take too long.]]
@viz people n=30 cols=15 pick="3,9,14,22,28" label="Millions of Albertans: ask a sample"
5. Discrete or continuous? a) siblings b) mass of a bag c) noon temperature [[a) discrete b) continuous c) continuous]]
:::
::: retrieval
1. Find 20 + 35 + 15.
=> 70
2. Find 70 ÷ 5.
=> 14
3. Put in order: 4.5, 4.05, 4.4.
=> 4.05, 4.4, 4.5
4. Find 25% of 80.
=> 20
5. ★ Stretch: A school has 120 Grade 7 students. A sample has 30 of them. What percent is that?
=> 30 ÷ 120 = 0.25 = 25%
:::

## Section 2: Fair samples and random sampling
Learning target: I can tell if a sample is fair. I can pick a sample at random two ways.

### Vocabulary
- representative sample :: a sample that is like the population. It has the same mix of people. :: 1 in 4 play hockey in the school, and 1 in 4 in the sample
- biased sample :: a sample that is not like the population. Some groups are left out. :: asking only the hockey team about sports
- random sample :: a sample where everyone has the same chance to be picked :: drawing names from a hat
- simple random sampling :: pick each person by chance, like names in a hat or a random number generator :: draw 10 names from all 120
- systematic random sampling :: start at a random spot on a list. Then pick every 5th (or every nth) person. :: 3rd, 8th, 13th, 18th …

#### Fair or not fair?
A sample should look like the population. Then it is **representative**.
At Ridge School, 10 of the 40 students play hockey (blue). That is 1 in 4.
@viz people n=40 cols=10 groups="1-10:cold" label="Population: 10 of 40 play hockey (blue)"
@viz people n=40 cols=10 groups="1-10:cold" pick="1,2,3,4,5,6,7,8" label="Biased: all 8 come from the hockey team" caption="Raj asks 8 hockey players. All 8 of them play hockey."
@viz people n=40 cols=10 groups="1-10:cold" pick="3,8,14,19,22,27,31,36" label="Random: 2 of the 8 play hockey" caption="A random sample: 2 of 8 is 1 in 4, like the population."

::: misconception
WRONG: "I'll ask my friends. That's a fair sample."
WHY: Friends are often alike. They may like the same games and the same food. Other students get no chance.
@viz people n=30 cols=15 groups="1-5:hot" pick="1,2,3,4,5" label="Your 5 friends sit together. Nobody else is picked."
RIGHT: Use a random sample. Everyone gets the same chance to be picked.
:::

::: example Worked Example 1 — Is it fair?
Question: "What is the favourite sport of Grade 7 students at Ridge School?"
Raj asks the 10 players on the hockey team.
Step 1: Who is in the population? [[All Grade 7 students at Ridge School.]]
Step 2: Who is in the sample? Only hockey players. They will likely say hockey.
Step 3: The sample is [[biased]]. It is not like the population.
Step 4: Fix it: pick 10 students [[at random]] from all the Grade 7 students.
@viz people n=40 cols=10 groups="1-10:cold" pick="1,2,3,4,5,6,7,8,9,10" label="Raj's sample: only hockey players"
:::

#### Two ways to pick at random
**Simple random sampling:** every person has the same chance each time. Use names in a hat or a random number generator.
@viz hat names="Ava,Sam,Noor,Leo,Mia,Raj,Kai,Zoe" out="Leo;Zoe;Omar" label="all 120 names" outlabel="the sample" caption="Mix the names well. Draw without looking."

**Systematic random sampling:** start at a random spot on the list. Then pick every 5th (or every 10th) name.
@viz flow steps="Number the list|Pick a random start|Count on by the same jump|Stop at the end of the list" width=560

::: example Worked Example 2 — Names in a hat
Ms. Roy has 120 Grade 7 names. She wants a sample of 10.
@viz hat names="Ben,Lily,Tess,Ava,Sam,Noor,Mia,Kai" out="Ava;Kai;[[ ]]" label="120 names" outlabel="draw 10 names"
Step 1: Write every name on a slip. Put all 120 slips in a hat.
Step 2: Mix them well. Draw one slip without looking.
Step 3: Keep drawing until she has [[10]] names.
Step 4: Every student had [[the same chance]] to be picked.
:::

::: example Worked Example 3 — Every 5th student
A class list has 30 students. Leo wants a sample of 6. He rolls a die to pick the start. He rolls a 3.
@viz people n=30 cols=15 numbers=1 pick="3,8,13,18,23,28" label="Start at 3. Then every 5th: +5, +5, +5 …"
Step 1: The jump is 30 ÷ 6 = [[5]]. Pick every 5th student.
Step 2: Start at number 3.
Step 3: Count on by 5: 3, 8, 13, 18, 23, 28.
Step 4: That is [[6]] students, spread all through the list.
:::

::: example Worked Example 4 — Fish in Lac La Biche
Kai wants the mean length of walleye in the lake. He sets one net by the dock. Small fish swim there.
@viz flow steps="Question: mean length|Population: all walleye in the lake|Sample: one net by the dock|Fair or biased?" width=600
Step 1: Fish by the dock are [[smaller]] than most fish in the lake.
Step 2: So his sample is [[biased]].
Step 3: Fix it: set nets at [[random spots all over the lake]].
:::
::: explain
In Worked Example 3, why does Leo roll a die to pick the start?
(lines 2)
=> So the start is random. Then every student has the same chance to be picked. If he always starts at 1, it is not random.
:::

::: try
1. Zoe wants to know Grade 7 bedtimes. She asks her 5 best friends. Is this fair? Say why. [[No. Her friends may have the same bedtimes. Use a random sample.]]
2. Omar asks people at West Edmonton Mall at noon on a Tuesday about their jobs. Who is left out? [[People at work, at school or out of town. The sample is biased.]]
3. A list has 40 names. Pick every 4th name. Start at 2. Write the first 5 picks. [[2, 6, 10, 14, 18]]
@viz people n=40 cols=10 numbers=1 pick="2,6,10,14,18" label="Start at 2. Every 4th name."
4. A list has 60 names. You want 10. What jump do you use? [[60 ÷ 10 = 6. Every 6th name.]]
5. Name one way to pick a simple random sample. [[Names in a hat, or a random number generator.]]
:::
::: retrieval
1. A census or a sample: every car on the QE2 highway today?
=> A sample. There are too many cars.
2. Discrete or continuous: the number of goals in a game?
=> discrete
3. Name the population: "How do Grade 7 students in Calgary get to school?"
=> all Grade 7 students in Calgary
4. Find 100 ÷ 4.
=> 25
5. ★ Stretch: A list has 200 names. You want a sample of 25. You start at 7. What are the 2nd and 3rd picks?
=> The jump is 200 ÷ 25 = 8. The picks are 7, 15, 23. So 15 and 23.
:::

## Section 3: Mean, median, mode and range
Learning target: I can find the mean, median, mode and range of data.

### Vocabulary
- statistic :: one number that tells about a set of data :: the mean, 12 °C
- mean :: add all the values. Divide by how many there are. The fair share. :: 2, 5, 3, 6 → 16 ÷ 4 = 4
- median :: the middle value when the data is in order :: 7, 9, 12, 15, 18 → 12
- mode :: the value that comes up most often :: 3, 5, 5, 8 → 5
- range :: biggest value − smallest value. It tells how spread out the data is. :: 3, 5, 5, 8 → 8 − 3 = 5

#### The mean is a fair share
Kai's team scored 2, 5, 3 and 6 goals in 4 games. Stack the goals as cubes. Move cubes until every tower is the same.
@viz levelling data="2,5,3,6" labels="Game 1;Game 2;Game 3;Game 4" after=1 meanlabel="mean = 4" beforelabel="Goals in each game" afterlabel="Even them out" caption="16 goals shared by 4 games is 4 goals each."
The total is 2 + 5 + 3 + 6 = 16. Share 16 among 4 games: 16 ÷ 4 = 4.
The **mean** is 4 goals a game.

::: key The four statistics
**Mean:** add the values, then divide by how many: sum ÷ count.
**Median:** put the values in order. Find the middle one. Two in the middle? Find their mean.
**Mode:** the value that comes up most often. There can be no mode, or more than one.
**Range:** biggest − smallest. It is a spread, not a middle.
:::

::: example Worked Example 1 — Mean of Edmonton highs
Edmonton had highs of 12, 15, 9, 14 and 10 °C. Find the mean.
@viz levelling data="12,15,9,14,10" labels="Mon;Tue;Wed;Thu;Fri" cell=9 beforelabel="Daily high (°C)"
Step 1: Add: 12 + 15 + 9 + 14 + 10 = [[60]].
Step 2: Count the values: there are [[5]].
Step 3: Divide: 60 ÷ 5 = [[12]]. The mean high is [[12 °C]].
:::

::: example Worked Example 2 — Median bus ride
Seven students time their bus rides in minutes: 18, 7, 25, 12, 30, 9, 15. Find the median.
@viz numstrip rows="18,7,25,12,30,9,15 | 7,9,12,[[15]],18,25,30" labels="As given;In order" notes=";median = [[15]]" ring="2:4"
Step 1: Put them in order: 7, 9, 12, [[15]], 18, 25, 30.
Step 2: There are 7 values. The middle one is the 4th.
Step 3: The median is [[15 minutes]].
:::

::: misconception
WRONG: "The middle of 18, 7, 25, 12, 30, 9, 15 is 12. So the median is 12."
WHY: 12 is in the middle of the list as given. The list was not in order.
@viz numstrip rows="18,7,25,12,30,9,15 | 7,9,12,15,18,25,30" labels="Not in order;In order" notes="12 is not the median;median = 15" hot="1:4" ring="2:4"
RIGHT: Put the numbers in order first. Then find the middle: 15.
:::

::: example Worked Example 3 — Two in the middle
The Oilers scored 3, 5, 2, 6, 2 and 4 goals in 6 games. Find the median.
@viz numstrip rows="3,5,2,6,2,4 | 2,2,[[3]],[[4]],5,6" labels="As given;In order" notes=";median = [[3.5]]" ring="2:3,4"
Step 1: In order: 2, 2, [[3, 4]], 5, 6.
Step 2: There are 6 values. The middle two are [[3 and 4]].
Step 3: Find their mean: [[(3 + 4) ÷ 2 = 3.5]]. The median is [[3.5 goals]].
:::

::: example Worked Example 4 — All four
Eight students read for 20, 30, 15, 30, 45, 20, 30 and 10 minutes. Find the mean, median, mode and range.
@viz numstrip rows="10,15,20,20,30,30,30,45" labels="In order" hot="1:5,6,7" ring="1:4,5"
@viz dotplot data="20,30,15,30,45,20,30,10" min=10 max=45 step=5 xlabel="minutes of reading"
Step 1: Mean: the sum is [[200]]. [[200 ÷ 8 = 25]] minutes.
Step 2: Median: in order, the middle two are [[20 and 30]]. [[(20 + 30) ÷ 2 = 25]] minutes.
Step 3: Mode: [[30]] comes up 3 times (shaded). The mode is [[30]] minutes.
Step 4: Range: biggest − smallest = [[45 − 10 = 35]] minutes.
:::

::: misconception
WRONG: "The biggest number is 45. So the mode is 45." Or: "The range is 45."
WHY: The mode is the most common value, not the biggest. The range is a gap: biggest − smallest.
@viz numberline min=10 max=45 step=5 jumps="10>45" jumplabels="range = 45 − 10 = 35" points="30:mode (3 times)" width=440
RIGHT: Mode = 30 (it comes up 3 times). Range = 45 − 10 = 35.
:::

#### No mode, or two modes
@viz numstrip rows="2,3,3,5,5,7 | 1,2,4,6" labels="Two modes;No mode" hot="1:2,3,4,5" notes="modes: 3 and 5;each value once"
In 2, 3, 3, 5, 5, 7, both 3 and 5 come up twice. There are two modes: 3 and 5.
In 1, 2, 4, 6, no value repeats. There is no mode.
*Careful:* in Functions, "range" meant all the outputs. In data, the range is biggest − smallest.
::: explain
In Worked Example 3, why do we find the mean of 3 and 4?
(lines 2)
=> There are 6 values, so there is no single middle one. The median is halfway between the two middle values.
:::

::: try
1. Find the mean of 4, 8, 6 and 2.
@viz levelling data="4,8,6,2" labels="A;B;C;D" cell=12
[[4 + 8 + 6 + 2 = 20. 20 ÷ 4 = 5.]]
2. Find the median of 9, 3, 7, 5, 1.
@viz numstrip rows="9,3,7,5,1 | [[1]],[[3]],[[5]],[[7]],[[9]]" labels="As given;In order"
[[In order: 1, 3, 5, 7, 9. The median is 5.]]
3. Find the median of 10, 4, 8, 6. [[In order: 4, 6, 8, 10. (6 + 8) ÷ 2 = 7.]]
4. Find the mode and range of 3, 7, 3, 9, 5, 3. [[Mode = 3 (3 times). Range = 9 − 3 = 6.]]
5. Mia says the mode of 2, 4, 4, 9 is 9. Fix her mistake. [[9 is the biggest, not the most common. 4 comes up twice. The mode is 4.]]
6. ★ Stretch: Find 5 numbers with a mean of 6 and a median of 5. [[Answers vary. Example: 2, 4, 5, 9, 10. The sum is 30, and 30 ÷ 5 = 6.]]
:::
::: retrieval
1. Census or sample: every fish in Lac La Biche?
=> A sample. There are too many fish to catch.
2. A list has 20 names. Start at 2. Pick every 4th. Write the picks.
=> 2, 6, 10, 14, 18
3. Discrete or continuous: the mass of a backpack?
=> continuous
4. Find (3.5 + 4.5) ÷ 2.
=> 4
5. ★ Stretch: The mean of 3 numbers is 10. Two of them are 8 and 9. Find the third.
=> The sum is 3 × 10 = 30. 30 − 8 − 9 = 13.
:::

## Section 4: Comparing samples and drawing conclusions
Learning target: I can compare two samples. I can use them to say something about the whole population.

### Vocabulary
- estimate :: a close guess based on data :: about 3 to 4 hours
- compare :: look at two sets of data to see what is the same and what is different :: Class A mean 3, Class B mean 3.6
- conclusion :: what the data tells us about the population :: Most Grade 7 students have 2 to 5 hours.

#### Two samples, one population
A sample gives an **estimate** for the population. A second sample gives a slightly different estimate. Different people get picked.

::: example Worked Example 1 — Screen time
Two random samples come from Grade 7 at Ridge School. Each student gives hours of screen time on a school night.
@viz dotplot2 data="1,2,2,3,3,3,3,4,4,5" data2="2,2,3,3,3,4,4,4,5,6" min=0 max=7 label="Sample A (10 students)" label2="Sample B (10 students)" marks="mean:[[3]]" marks2="mean:[[3.6]]" xlabel="hours of screen time"

| | Sample A | Sample B |
|---|---|---|
| Mean | 30 ÷ 10 = [[3]] | 36 ÷ 10 = [[3.6]] |
| Median | 3 | [[3.5]] |
| Mode | [[3]] | 3 and 4 |
| Range | 5 − 1 = [[4]] | [[6 − 2 = 4]] |

Step 1: The means are close: [[3 and 3.6]] hours. The ranges are both [[4]].
Step 2: Conclusion: a Ridge School Grade 7 student gets about [[3 to 4 hours]] of screen time.
Step 3: The samples differ because [[different students were picked]].
:::

::: misconception
WRONG: "Sample A's mean is 3. So every Grade 7 student watches exactly 3 hours."
WHY: A sample is only part of the population. Sample B, from the same school, gave 3.6.
@viz dotplot2 data="1,2,2,3,3,3,3,4,4,5" data2="2,2,3,3,3,4,4,4,5,6" min=0 max=7 label="Sample A" label2="Sample B" marks="mean:3" marks2="mean:3.6"
RIGHT: A sample gives an estimate. Say "about 3 to 4 hours", not "exactly 3".
:::

::: example Worked Example 2 — Walleye in Lac La Biche
Kai sets nets at random spots on two days. He measures the walleye he catches (cm).
@viz dotplot2 data="38,42,45,45,50" data2="36,40,44,46,49" min=34 max=52 step=2 label="Monday" label2="Tuesday" xlabel="length (cm)"
Monday: 38, 42, 45, 45, 50. Tuesday: 36, 40, 44, 46, 49.
Step 1: Monday mean: 220 ÷ 5 = [[44]] cm. Tuesday mean: 215 ÷ 5 = [[43]] cm.
Step 2: Monday median: [[45]] cm. Tuesday median: [[44]] cm.
Step 3: Monday range: [[50 − 38 = 12]] cm. Tuesday range: [[49 − 36 = 13]] cm.
Step 4: Conclusion: walleye in the lake are about [[43 to 45 cm]] long. The two days agree closely.
:::

#### Put the samples together
More data usually gives a better estimate. Join Sample A and Sample B from Worked Example 1.
@viz people n=20 cols=20 groups="1-10:cold;11-20:sun" label="Sample A (blue) + Sample B (yellow) = 20 students"
The sum is 30 + 36 = 66 hours. There are 20 students. 66 ÷ 20 = 3.3 hours.

::: example Worked Example 3 — Which conclusion is fair?
Two samples of school bus riders. Ride times (minutes): Monday mean 15, Thursday mean 16.
@viz dotplot2 data="8,10,12,15,20,25" data2="9,14,16,17,18,22" min=6 max=26 step=2 label="Monday" label2="Thursday" marks="mean:15" marks2="mean:16" xlabel="minutes on the bus"
Which conclusions are fair?
a) "Every ride takes exactly 15 minutes." [[Not fair. Rides go from 8 to 25 minutes.]]
b) "A typical ride is about 15 or 16 minutes." [[Fair. Both means are close to that.]]
c) "Thursday's sample is wrong, because it is not 15." [[Not fair. Two samples are a bit different. Both are fine.]]
:::
::: explain
In Worked Example 2, Monday and Tuesday give different means. Why is that fine?
(lines 2)
=> Each day Kai caught different fish. A sample is only part of the lake, so each one gives a slightly different estimate.
:::

::: try
1. Two samples of Banff hot springs visitors give minutes in the pool. Sample A: 30, 45, 60, 45, 70. Sample B: 40, 50, 55, 35, 60. Find each mean. [[A: 250 ÷ 5 = 50 minutes. B: 240 ÷ 5 = 48 minutes.]]
@viz dotplot2 data="30,45,60,45,70" data2="40,50,55,35,60" min=30 max=70 step=5 label="Sample A" label2="Sample B" xlabel="minutes in the pool"
2. Find each median in Question 1. [[A: 30, 45, 45, 60, 70 → 45. B: 35, 40, 50, 55, 60 → 50.]]
3. Write a conclusion about all visitors. [[A visitor stays in the pool about 45 to 50 minutes.]]
4. Sam says, "Sample B's mean is 48. So the mean for all visitors is exactly 48." Fix his mistake. [[A sample gives an estimate. The mean for all visitors is about 48 to 50 minutes. It may not be exactly 48.]]
5. ★ Stretch: Put Samples A and B together. Find the mean of all 10 visitors. [[(250 + 240) ÷ 10 = 490 ÷ 10 = 49 minutes.]]
:::
::: retrieval
1. Find the mean, median, mode and range of 5, 8, 8, 3, 6.
=> Mean 30 ÷ 5 = 6. In order: 3, 5, 6, 8, 8. Median 6. Mode 8. Range 8 − 3 = 5.
2. Is asking only your friends a fair sample? Why?
=> No. Friends are alike. A random sample gives everyone the same chance.
3. A list has 50 names. You want 10. What jump do you use for a systematic sample?
=> 50 ÷ 10 = 5. Every 5th name.
4. Discrete or continuous: minutes on the bus?
=> continuous
5. ★ Stretch: The mean of 4 test scores is 7. A 5th score of 12 is added. Find the new mean.
=> The old sum is 4 × 7 = 28. The new sum is 28 + 12 = 40. 40 ÷ 5 = 8.
:::

## Unit Synthesis
1. Noor asks: "How long do Lakeview School Grade 7 students read each night?" Name the population. Should she use a census or a sample?
=> The population is all Grade 7 students at Lakeview School. There are 90 students. A sample is quicker. (A census is also possible: the school is not too big.)
2. Noor has a list of 90 students. She wants 10. Describe a systematic random sample.
@viz people n=30 cols=15 numbers=1 pick="4,13,22" label="Start at a random spot. Then every 9th name."
=> The jump is 90 ÷ 10 = 9. Pick a random start from 1 to 9, like 4. Then pick 4, 13, 22, 31, 40, 49, 58, 67, 76, 85.
3. Her sample: 20, 35, 15, 30, 40, 20, 25, 20, 45, 30. Find the mean, median, mode and range.
@viz dotplot data="20,35,15,30,40,20,25,20,45,30" min=15 max=45 step=5 xlabel="minutes of reading"
=> Mean: 280 ÷ 10 = 28 minutes.
=> In order: 15, 20, 20, 20, 25, 30, 30, 35, 40, 45. Median: (25 + 30) ÷ 2 = 27.5 minutes.
=> Mode: 20 minutes (3 times). Range: 45 − 15 = 30 minutes.
4. Leo takes a second sample. His mean is 31 minutes. Write a conclusion for the whole school.
=> A Grade 7 student at Lakeview School reads about 28 to 31 minutes a night. It is an estimate. Each sample is a bit different.
5. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Populations, samples and census
A **statistical question** has answers that vary.
The **population** is everyone or everything the question is about: who, where, when.
A **census** asks everyone. A **sample** asks part. Use a sample when a census is too costly, too slow or too hard.
**Discrete** data is counted (goals, pets). **Continuous** data is measured (height, time).
:::
@viz people n=40 cols=20 pick="2,7,13,18,24,29,35,38" label="Population: all 40. Sample: the 8 dark ones."

::: key Fair samples
A **representative** sample is like the population. A **biased** sample leaves groups out.
**Simple random:** names in a hat, or a random number generator.
**Systematic random:** a random start, then every nth name. Jump = population ÷ sample size.
:::
@viz people n=30 cols=10 numbers=1 pick="3,8,13,18,23,28" label="Start at 3, then every 5th."

::: key Mean, median, mode and range
**Mean** = sum ÷ count (the fair share). **Median** = the middle value, in order first.
**Mode** = most often (none, one, or more). **Range** = biggest − smallest.
:::
@viz levelling data="2,5,3,6" labels="2;5;3;6" after=1 meanlabel="mean = 4" cell=13
@viz numstrip rows="7,9,12,15,18,25,30" labels="In order" ring="1:4" notes="median = 15"

::: key Comparing samples
Find the same statistics for each sample. Compare them.
A sample gives an **estimate**. Two samples will be a bit different.
Say "about …" in a conclusion, not "exactly".
:::

| Mistake | Fix |
|---|---|
| A census is always better | A census can cost too much or take too long. A good sample is close. |
| Asking your friends is fair | Friends are alike. Pick at random. |
| The median is the middle of the list as given | Put the numbers in order first. |
| The mode (or range) is the biggest number | Mode = most often. Range = biggest − smallest. |
| A sample gives the exact answer for everyone | A sample gives an estimate. Another sample will differ a bit. |
