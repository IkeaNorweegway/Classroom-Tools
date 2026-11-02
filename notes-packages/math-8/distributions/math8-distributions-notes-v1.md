---
title: Distributions & Circle Graphs
topic: distributions
strand: statistics-probability
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "A histogram is a bar graph with gaps" (DI1). "Skewed right means the bump is
     on the right" (DI2). "The mean is always the best average" (DI3). "A circle graph can show change
     over time" (DI4).
     Section order: first the graphs that show a distribution (DI1), because you cannot see a shape
     until the data is graphed. Then the shape words (DI2). Then the shape decides the best average
     (DI3): it needs both the shape words and the Grade 7 mean, median and mode. Circle graphs come
     last (DI4): they show categories as parts of one whole, a different job from shape.
     Outcomes 8ST1.1 (DI1–DI3) and 8ST1.2 (DI4). No box plots, quartiles or IQR (Grade 9).
     Data note: the hockey roster, wait times, house prices and survey counts are made up but realistic.
     Household energy shares are rounded from Natural Resources Canada averages. -->

## Pre-Knowledge Check
1. Find the mean of 4, 6, 8 and 10.
2. Find the median of 3, 9, 4, 7, 5.
3. Find the mode of 2, 5, 5, 6, 9.
4. Find 25% of 360.
5. A full turn is 360°. What fraction of a full turn is 90°?
6. How many students walk to school?
@viz bar data="Walk:6;Bus:9;Car:5" ystep=1 ylabel="students" title="How we get to school"

## Section 1: Bar graphs and histograms
Learning target: I can show a distribution with a bar graph, a double bar graph or a histogram.

### Vocabulary
- distribution :: how often each value or group of values comes up in a set of data :: 12 walk, 20 bus, 8 car, 4 bike
- frequency :: how many times a value or interval comes up :: 6 commutes took 10–19 minutes
- bar graph :: a graph with a bar for each category or value. The bars have gaps. :: how students get to school
- double bar graph :: a bar graph with two bars for each category, to compare two sets of data :: Grade 7 and Grade 8 side by side
- interval :: a group of values, like 10–19. All intervals in one graph are the same size. :: 0–9, 10–19, 20–29
- histogram :: a graph of intervals of measured data. The bars touch. :: commute times in 10-minute intervals

#### What is a distribution?
A **distribution** shows how often each value comes up. That count is the **frequency**.
A Grade 8 class tells how they get to school.
@viz bar data="Walk:12;Bus:20;Car:8;Bike:4" ymax=24 ystep=4 ylabel="students" xlabel="way to school" title="Grade 8: how we get to school" values=1 caption="Each bar is one category. The bars have gaps."

::: key Which graph?
**Bar graph:** categories (walk, bus) or counted values (0, 1, 2 goals). Bars have gaps.
**Double bar graph:** two sets of data, same categories. Two bars side by side.
**Histogram:** measured data (time, height, age) in equal intervals. Bars touch.
:::

::: example Worked Example 1 — Read a bar graph
Use the Grade 8 bar graph above.
@viz bar data="Walk:12;Bus:20;Car:8;Bike:4" ystep=2 ylabel="students" highlight="Bus" caption="The tallest bar is the most common way."
Step 1: Find the tallest bar. **Bus**, with 20 students.
Step 2: Add all the bars: 12 + 20 + 8 + 4 = **44** students.
Step 3: How many more take the bus than walk? 20 − 12 = [[8]] students.
:::

::: example Worked Example 2 — Compare with a double bar graph
The Grade 7 class answers the same question.
@viz didouble cats="Walk;Bus;Car;Bike" data="12,20,8,4" data2="10,15,14,5" label="Grade 8" label2="Grade 7" ylabel="students" values=1 title="How we get to school"
Step 1: Each category has two bars. The key at the top tells which bar is which.
Step 2: Car: Grade 7 has 14. Grade 8 has 8. The gap is 14 − 8 = **6**.
Step 3: Bus: 20 − 15 = **5**. Walk: 12 − 10 = **2**. Bike: 5 − 4 = **1**.
Step 4: The biggest difference is in [[Car]].
:::

#### Histograms for measured data
Time, height and age are measured. Any value in between can happen.
So we group the data into equal **intervals**. The bars of a **histogram** touch. No values fall in a gap.

::: example Worked Example 3 — Make a histogram
Twenty Edmonton adults time their drive to work (minutes).
8, 12, 15, 18, 22, 25, 25, 28, 30, 14,
19, 27, 33, 36, 21, 24, 41, 17, 26, 29
Step 1: Pick equal intervals: 0–9, 10–19, 20–29, 30–39, 40–49.
Step 2: Tally each interval in a frequency table.

| Minutes | 0–9 | 10–19 | 20–29 | 30–39 | 40–49 |
|---|---|---|---|---|---|
| Frequency | 1 | 6 | 9 | 3 | 1 |

Step 3: Check the total: 1 + 6 + 9 + 3 + 1 = **20**. ✓
Step 4: Draw one bar per interval. The bars touch.
@viz dihist data="0–9:1;10–19:6;20–29:9;30–39:3;40–49:1" xlabel="drive to work (minutes)" title="Edmonton commute times" values=1
Step 5: The most common interval is [[20–29]] minutes.
:::

::: misconception
WRONG: "A histogram is a bar graph with gaps."
WHY: A gap would mean no values there. But 19.5 minutes is a real time. Measured data has no gaps between intervals.
@viz bar data="Walk:12;Bus:20;Car:8;Bike:4" ystep=4 ylabel="students" title="Bar graph: categories" caption="Categories: gaps between bars."
@viz dihist data="0–9:1;10–19:6;20–29:9;30–39:3;40–49:1" xlabel="minutes" title="Histogram: intervals" caption="Intervals of time: the bars touch."
RIGHT: Histogram bars touch. Bar graph bars have gaps.
:::

#### Interval size changes the picture
The same data can look different with a different interval size.

::: example Worked Example 4 — Hockey player ages
A hockey team lists the ages of its 20 players.
20, 21, 22, 22, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 29, 30, 31, 33, 35, 36
@viz dihist data="20–29:15;30–39:5" xlabel="age (years)" title="Intervals of 10" values=1 width=240 caption="Only 2 bars. Most players are in their 20s. Little else shows."
@viz dihist data="20–24:7;25–29:8;30–34:3;35–39:2" xlabel="age (years)" title="Intervals of 5" values=1 caption="4 bars. Now we see the peak in the 20s and fewer older players."
Step 1: Intervals of 10: 15 players are 20–29. 5 players are 30–39.
Step 2: Intervals of 5: 7 + 8 = 15. 3 + 2 = 5. The totals match.
Step 3: Which graph shows more detail? The one with intervals of [[5]].
:::
::: explain
In Worked Example 3, why do the bars of the histogram touch?
(lines 2)
=> Time is measured, so any value between intervals can happen. There is no gap between 19 and 20 minutes, so there is no gap between the bars.
:::

::: try
1. Bar graph or histogram? a) favourite Oilers player b) heights of Grade 8 students c) number of pets [[a) bar graph b) histogram c) bar graph (counted values)]]
2. Make a frequency table for these ages: 11, 13, 15, 16, 16, 18, 21, 23.

| Age | 10–14 | 15–19 | 20–24 |
|---|---|---|---|
| Frequency | [[2]] | [[4]] | [[2]] |

3. Draw the histogram for Question 2.
@viz dihist data="10–14:2;15–19:4;20–24:2" ymax=5 empty=1 xlabel="age (years)"
4. Leo uses intervals 0–9, 10–14 and 15–29. What is wrong? [[The intervals are not the same size. Use 0–9, 10–19, 20–29.]]
5. ★ Stretch: In Worked Example 2, what fraction of the Grade 7 class takes the bus? [[Grade 7 has 10 + 15 + 14 + 5 = 44 students. 15 out of 44 is {15/44}.]]
:::
::: retrieval
1. Find the mean of 12, 15, 9 and 20.
=> 56 ÷ 4 = 14
2. Find the median of 8, 3, 11, 6, 9.
=> In order: 3, 6, 8, 9, 11. Median 8.
3. Find 40% of 50.
=> 20
4. Discrete or continuous: the time to run 100 m?
=> continuous
5. ★ Stretch: Find the range of 2.5, 7, 4.25 and 9.
=> 9 − 2.5 = 6.5
:::

## Section 2: Shapes of distributions
Learning target: I can describe the shape of a distribution. I can compare the shapes of two samples.

### Vocabulary
- peak :: a high point in a graph. It shows a mode. :: the tallest bar
- unimodal :: one peak :: most hockey players are about 25
- bimodal :: two peaks :: heights at a family skate: kids and adults
- symmetric :: the left half and the right half match, like a mirror :: Calgary daily highs in July
- uniform :: all the bars are about the same height. No peak. :: rolling a fair die many times
- tail :: the long, low end of a graph :: a few very long waits
- skewed right :: the peak is on the left. The long tail goes to the right. :: wait times for a ski lift
- skewed left :: the peak is on the right. The long tail goes to the left. :: scores on an easy quiz

#### Five shapes
Look at the outline of the bars. Count the peaks. Look for a tail.
@viz dirow shapes="symmetric|right|left" labels="symmetric (one peak)|skewed right|skewed left" tail=1
@viz dirow shapes="uniform|bimodal" labels="uniform (no peak)|bimodal (two peaks)"

::: key Name a shape
1. Count the peaks. One peak: **unimodal**. Two peaks: **bimodal**. Flat: **uniform**.
2. Fold it in your mind. Do the halves match? Then it is **symmetric**.
3. Is there a long tail? The tail names the skew. Tail to the right: **skewed right**. Tail to the left: **skewed left**.
:::

::: example Worked Example 1 — Calgary in July
The histogram shows Calgary's daily high for the 31 days of July.
@viz dihist data="14–17:2;18–21:7;22–25:13;26–29:7;30–33:2" xlabel="daily high (°C)" title="Calgary highs, July" values=1
Step 1: Count the peaks: one peak at 22–25 °C. Unimodal.
Step 2: The two sides match: 2 and 2, then 7 and 7.
Step 3: The shape is **symmetric**.
:::

::: example Worked Example 2 — Waiting for the ski lift
Skiers at Sunshine Village time their wait for the lift (minutes).
@viz dihist data="0–4:9;5–9:7;10–14:4;15–19:2;20–24:1;25–29:1" xlabel="wait (minutes)" title="Lift wait times" values=1
Step 1: The peak is on the left: most waits are short.
Step 2: A few long waits make a long, low tail.
Step 3: The tail points to the [[right]]. The shape is [[skewed right]].
:::

::: misconception
WRONG: "The bump is on the left. So the data is skewed left."
WHY: The skew is named for the tail, not the bump. The tail is where the few unusual values are.
@viz dishape shape=right tail=1 label="bump on the left, tail to the right: skewed right"
RIGHT: Follow the tail. Long tail to the right: skewed right.
:::

::: example Worked Example 3 — More shapes
@viz dihist data="50–59:1;60–69:2;70–79:4;80–89:9;90–99:8" xlabel="quiz score (%)" title="Scores on an easy quiz" width=300 height=120
@viz dihist data="100–119:2;120–139:7;140–159:3;160–179:8;180–199:2" xlabel="height (cm)" title="Heights at a family skate" width=300 height=120
@viz bar data="1:10;2:9;3:11;4:10;5:10;6:10" ystep=2 xlabel="number rolled" ylabel="frequency" title="A die rolled 60 times" height=120
Step 1: Quiz scores: the tail goes to the left. [[Skewed left.]]
Step 2: Family skate: two peaks, one for kids and one for adults. [[Bimodal.]]
Step 3: The die: all bars are about 10. [[Uniform.]]
:::

#### Compare two samples
Two random samples from the same population should have a similar shape.

::: example Worked Example 4 — Hours of sleep
Two random samples of 10 Grade 8 students give their hours of sleep.
@viz dotplot2 data="7,8,8,9,9,9,9,10,10,11" data2="7,8,8,8,9,9,9,10,10,11" min=6 max=12 label="Sample A" label2="Sample B" xlabel="hours of sleep"
Step 1: Shape of A: one peak at 9 h, the sides match. [[Symmetric]].
Step 2: Shape of B: [[symmetric]] too, with its middle near [[9]] h.
Step 3: Both samples say a typical student sleeps about [[9 hours]].
:::
::: explain
Two samples of the same population are not exactly the same. Why should their shapes still be close?
(lines 2)
=> Both samples are picked at random from the same group. Each one is like the population, so each one has about the same shape.
:::

::: try
1. Name each shape.
@viz dirow shapes="1 2 3 5 8 6|5 6 5 5 6 5|8 6 3 2 1 1" labels="A: [[skewed left]]|B: [[uniform]]|C: [[skewed right]]"
2. Wait times at a doctor's office: most are short, a few are very long. Predict the shape. [[Skewed right: a long tail of long waits.]]
3. Ava says, "The tallest bar is on the right, so it is skewed right." Fix her mistake. [[The tail names the skew. If the peak is on the right, the tail goes left. It is skewed left.]]
4. A histogram has two tall bars with a dip between them. Name the shape. [[Bimodal.]]
5. ★ Stretch: Picture a Grade 2 class party with parents. Sketch a histogram of everyone's ages. Name the shape. [[Two peaks: kids about 7, parents about 35–45. Bimodal.]]
:::
::: retrieval
1. Do histogram bars touch? Why?
=> Yes. The data is measured, so there is no gap between intervals.
2. Make a frequency table, intervals 0–4 and 5–9: 1, 3, 3, 6, 8.
=> 0–4: 3. 5–9: 2.
3. Find the median of 10, 4, 8, 6.
=> In order: 4, 6, 8, 10. (6 + 8) ÷ 2 = 7.
4. Find 15% of 200.
=> 30
5. ★ Stretch: A histogram uses intervals 20–24, 25–29, 30–34. What is the interval size?
=> 5
:::

## Section 3: Choosing mean, median or mode
Learning target: I can choose the mean, median or mode for a set of data. I can explain my choice using the shape.

### Vocabulary
- measure of central tendency :: one number for the middle or typical value: mean, median or mode :: median wait = 4.5 min
- outlier :: a value far from the rest of the data :: one house at $1 500 000 on a street of $350 000 houses
- typical value :: a value that is like most of the data :: most waits are about 4 or 5 minutes

#### The tail pulls the mean
The mean uses every value. One big value pulls it toward the tail.
The median is the middle value. It barely moves.
@viz dirow shapes="right|symmetric|left" labels="skewed right: mean > median|symmetric: mean = median|skewed left: mean < median" marks=1 tail=1 w=170

::: key Pick the average from the shape
**Symmetric:** the mean and median are about the same. Use the **mean**.
**Skewed (a long tail):** the tail pulls the mean. Use the **median**.
**Categories (bus, car, walk):** you can't add words. Use the **mode**.
:::

::: example Worked Example 1 — House prices
Five houses sold on one street in a small Alberta town (thousands of dollars).
310, 340, 350, 365, 1500
@viz numstrip rows="310,340,350,365,1500" labels="In order" ring="1:3" hot="1:5" notes="median = 350"
Step 1: Mean: 310 + 340 + 350 + 365 + 1500 = 2865. 2865 ÷ 5 = **573**.
Step 2: Median: the middle value is **350**.
Step 3: Four of the five houses cost less than 573. The mean is not typical.
Step 4: The data is skewed right. Use the [[median]]: $350 000.
:::

::: misconception
WRONG: "The mean is always the best average. A typical house costs $573 000."
WHY: One big price pulled the mean up. Four of five houses cost much less than the mean.
@viz numberline min=300 max=1500 step=100 every=2 points="350:median;573:mean;1500:big price" width=520 caption="The one big price drags the mean to the right."
RIGHT: In skewed data the median is more typical: $350 000.
:::

::: example Worked Example 2 — Wait times
Eight people wait for a Calgary C-Train (minutes): 2, 3, 3, 4, 5, 6, 8, 25.
@viz dotplot data="2,3,3,4,5,6,8,25" min=0 max=26 step=2 xlabel="wait (minutes)" marks="mean:7"
Step 1: Mean: the sum is 56. 56 ÷ 8 = **7** minutes.
Step 2: Median: the middle two are 4 and 5. (4 + 5) ÷ 2 = [[4.5]] minutes.
Step 3: Mode: [[3]] minutes.
Step 4: The 25 makes a tail to the right. The mean is bigger than the median.
Step 5: Best average: the [[median]].
:::

::: example Worked Example 3 — Symmetric data
Eight July days in Calgary had highs of 21, 22, 23, 24, 24, 25, 26, 27 °C.
@viz dotplot data="21,22,23,24,24,25,26,27" min=20 max=28 xlabel="daily high (°C)"
Step 1: Mean: the sum is 192. 192 ÷ 8 = [[24]] °C.
Step 2: Median: (24 + 24) ÷ 2 = [[24]] °C.
Step 3: The data is symmetric. The mean and median match. Use the [[mean]].
:::

::: example Worked Example 4 — Categories
How 44 Grade 8 students get to school: walk 12, bus 20, car 8, bike 4.
@viz bar data="Walk:12;Bus:20;Car:8;Bike:4" ystep=4 ylabel="students" highlight="Bus"
Step 1: Can you find the mean of "bus" and "walk"? [[No. They are words, not numbers.]]
Step 2: The most common answer is [[bus]]. Use the [[mode]].
:::
::: explain
In Worked Example 2, why is the median a better "typical wait" than the mean?
(lines 2)
=> One long wait of 25 minutes pulls the mean up to 7. Six of the eight waits are shorter than 7. The median, 4.5, is closer to most waits.
:::

::: try
1. Mean, median or mode? a) favourite pizza topping b) Calgary July highs (symmetric) c) house prices in Banff [[a) mode b) mean c) median]]
2. Wait times (minutes): 12, 14, 15, 15, 16, 48. Find the mean and median. Which is more typical? [[Mean = 120 ÷ 6 = 20. Median = (15 + 15) ÷ 2 = 15. The median: the 48 pulls the mean up.]]
@viz dotplot data="12,14,15,15,16,48" min=10 max=50 step=5 xlabel="wait (minutes)"
3. A histogram is skewed left. Which is bigger, the mean or the median? [[The median. The tail on the left pulls the mean down.]]
@viz dishape shape=left tail=1 width=220
4. Quiz scores: 3, 7, 8, 9, 9, 10, 10, 10. Find the mean, median and mode. [[Mean = 66 ÷ 8 = 8.25. Median = (9 + 9) ÷ 2 = 9. Mode = 10.]]
5. ★ Stretch: Kai says, "The mean is always in the middle of the data." Use Question 2 to show he is wrong. [[The mean is 20. Five of the six waits are below 20. The mean is pulled toward the tail, not in the middle.]]
:::
::: retrieval
1. Name the shape: most waits are short, a few are very long.
=> skewed right
2. Bar graph or histogram: heights of trees in a park?
=> histogram (measured data)
3. A histogram has two peaks. Name the shape.
=> bimodal
4. Find 30% of 360.
=> 108
5. ★ Stretch: The mean of 4 numbers is 10. Three of them are 6, 8 and 9. Find the fourth.
=> The sum is 40. 40 − 6 − 8 − 9 = 17.
:::

## Section 4: Circle graphs
Learning target: I can draw a circle graph from a table. I can use a circle graph to solve problems.

### Vocabulary
- circle graph :: a circle cut into sectors. Each sector is a part of one whole. :: how 240 students get to school
- sector :: a slice of a circle graph, like a slice of pizza :: the Bus slice
- central angle :: the angle of a sector at the centre of the circle :: 144° for Bus
- whole :: everything in the graph: 100% and 360° :: all 240 students

#### Parts of one whole
A **circle graph** shows how one whole is split into parts. The whole circle is 100%. It is also 360°.
@viz dipie data="Bus:50;Walk:25;Car:25" show=both title="Half, a quarter, a quarter" caption="50% is half the circle: 180°. 25% is a quarter: 90°."

::: key Circle graph rules
**Angle** = percent × 360°.  **Percent** = angle ÷ 360°.
**Count** = percent × total.  **Percent** = count ÷ total.
Check: the percents add to 100%. The angles add to 360°.
:::

::: example Worked Example 1 — Percent to degrees
A survey of 240 students: how do you get to school?

| Way | Percent | Angle |
|---|---|---|
| Bus | 40% | 0.40 × 360° = 144° |
| Car | 30% | 0.30 × 360° = [[108°]] |
| Walk | 25% | 0.25 × 360° = [[90°]] |
| Bike | 5% | 0.05 × 360° = [[18°]] |
| Total | 100% | [[360°]] |

@viz dipie data="Bus:40;Car:30;Walk:25;Bike:5" labels="Bus:144°;Car:[[108°]];Walk:[[90°]];Bike:[[18°]]" title="How 240 students get to school" arc="Bus"
Step 1: Multiply each percent by 360°.
Step 2: Check: the angles add to [[360°]].
Step 3: Draw a radius. Use a protractor to mark 144° for Bus. Start the next sector where it ends.
:::

@viz flow steps="Find each percent|Multiply by 360°|Draw a circle and a radius|Measure each angle|Label each sector" width=620

::: example Worked Example 2 — Counts to degrees
Banff asks 200 visitors where they live.

| Home | Visitors | Percent | Angle |
|---|---|---|---|
| Alberta | 90 | 90 ÷ 200 = 45% | 0.45 × 360° = 162° |
| Other Canada | 60 | [[30%]] | [[108°]] |
| USA | 30 | [[15%]] | [[54°]] |
| Overseas | 20 | [[10%]] | [[36°]] |

@viz dipie data="Alberta:45;Other Canada:30;USA:15;Overseas:10" labels="Alberta:162°;Other Canada:[[108°]];USA:[[54°]];Overseas:[[36°]]" title="Where Banff visitors live (200 people)"
Step 1: Percent = visitors ÷ 200.
Step 2: Angle = percent × 360°.
Step 3: Check: the four angles add to [[360°]].
:::

::: example Worked Example 3 — Solve a problem
An Alberta family spends $2000 a year on home energy.
@viz dipie data="Space heating:60;Water heating:20;Appliances:15;Lighting:5" title="Home energy use" show=pct
Step 1: Water heating is 20%. 0.20 × $2000 = [[$400]].
Step 2: Space heating is 60%. 0.60 × $2000 = [[$1200]].
Step 3: The space heating angle: 0.60 × 360° = [[216°]].
:::

::: example Worked Example 4 — From an angle to a count
240 students pick a favourite Stampede event. The Rodeo sector has an angle of 90°.
@viz dipie data="Rodeo:25;Midway rides:40;Chuckwagons:20;Food:15" labels="Rodeo:90°;Midway rides:?;Chuckwagons:?;Food:?" arc="Rodeo" title="Favourite Stampede event (240 students)"
Step 1: Percent = 90° ÷ 360° = [[25%]].
Step 2: Count = percent × 240 = [[60]] students.
:::

::: misconception
WRONG: "Use a circle graph to show Calgary's July high from 2021 to 2025."
WHY: A circle graph shows parts of one whole at one time. Five years of highs are not parts of a whole. They do not add to anything.
@viz line data="2021:27;2022:24;2023:25;2024:26;2025:24" ymin=20 ymax=28 ystep=2 break=1 ylabel="°C" xlabel="year" title="July high each year (example data)" caption="Change over time: use a line graph."
RIGHT: Use a line graph for change over time. Use a circle graph for parts of one whole.
:::
::: explain
In Worked Example 1, why do we multiply by 360 and not by 100?
(lines 2)
=> The whole circle is 360°. Each sector gets the same part of 360° as its part of 100%.
:::

::: try
1. Find the angle for 30%. [[0.30 × 360° = 108°]]
2. A sector is 72°. What percent is it? [[72 ÷ 360 = 0.2 = 20%]]
3. 15% of 240 students bike. How many is that? [[0.15 × 240 = 36 students]]
4. Find the angles. Then label the circle graph.

| Sport | Percent | Angle |
|---|---|---|
| Hockey | 50% | [[180°]] |
| Soccer | 25% | [[90°]] |
| Basketball | 15% | [[54°]] |
| Other | 10% | [[36°]] |

@viz dipie data="Hockey:50;Soccer:25;Basketball:15;Other:10" labels="Hockey:[[180°]];Soccer:[[90°]];Basketball:[[54°]];Other:[[36°]]" title="Favourite sport to watch"
5. Circle graph or line graph? a) Stampede attendance each year from 2015 to 2025 b) how one family spends its budget [[a) line graph (change over time) b) circle graph (parts of one whole)]]
6. ★ Stretch: A circle graph of 180 people has a 40° sector. How many people is that? [[40 ÷ 360 = {1/9}. {1/9} × 180 = 20 people.]]
:::
::: retrieval
1. Wait times are skewed right. Which average is best?
=> the median
2. Name the shape: all the bars are about the same height.
=> uniform
3. Do bar graph bars touch?
=> No. Bar graphs have gaps. Histogram bars touch.
4. Find the mean and median of 2, 4, 4, 5, 15.
=> Mean 30 ÷ 5 = 6. Median 4.
5. ★ Stretch: The angles of a circle graph are 150°, 90°, 75° and x. Find x.
=> 360 − 150 − 90 − 75 = 45°
:::

## Unit Synthesis
Twenty Grade 8 students time their trip to school (minutes).
3, 5, 5, 6, 8, 8, 9, 10, 10, 12, 12, 14, 15, 18, 20, 22, 25, 30, 35, 43
1. Make a frequency table with intervals 0–9, 10–19, 20–29, 30–39, 40–49. Draw the histogram.
@viz dihist data="0–9:7;10–19:7;20–29:3;30–39:2;40–49:1" ymax=8 empty=1 xlabel="trip to school (minutes)"
=> 0–9: 7. 10–19: 7. 20–29: 3. 30–39: 2. 40–49: 1. Total 20.
2. Describe the shape.
=> Skewed right. Most trips are short. A few long trips make a tail to the right.
3. Find the mean and the median. Which is the better typical trip? Why?
=> Mean: the sum is 310. 310 ÷ 20 = 15.5 minutes. Median: (12 + 12) ÷ 2 = 12 minutes.
=> The median. The data is skewed right, so the long trips pull the mean up.
4. How the 20 students travel: bus 8, car 6, walk 5, bike 1. Find the percent and the angle for each. Draw a circle graph.
@viz dipie data="Bus:40;Car:30;Walk:25;Bike:5" show=none title="How the 20 students travel"
=> Bus: 40%, 144°. Car: 30%, 108°. Walk: 25%, 90°. Bike: 5%, 18°. Total 360°.
5. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Graphs that show a distribution
**Bar graph:** categories or counted values. Bars have gaps.
**Double bar graph:** two sets, same categories, bars side by side.
**Histogram:** measured data in equal intervals. Bars touch. A new interval size can change the look.
:::
@viz dihist data="0–9:1;10–19:6;20–29:9;30–39:3;40–49:1" xlabel="minutes" width=260

::: key Shapes
Count the peaks: **unimodal** (one), **bimodal** (two), **uniform** (flat).
**Symmetric:** the halves match. **Skewed right:** tail to the right. **Skewed left:** tail to the left.
The tail names the skew.
:::
@viz dishape shape=right tail=1 marks=1 label="skewed right: mean > median" width=220
@viz dishape shape=left tail=1 marks=1 label="skewed left: mean < median" width=220

::: key Which average?
**Symmetric:** mean (it matches the median). **Skewed:** median. **Categories:** mode.
:::

::: key Circle graphs
Angle = percent × 360°. Percent = angle ÷ 360°. Count = percent × total.
Percents add to 100%. Angles add to 360°. Parts of one whole, at one time.
:::
@viz dipie data="Bus:40;Car:30;Walk:25;Bike:5" show=both r=80

| Mistake | Fix |
|---|---|
| A histogram has gaps | Histogram bars touch. The intervals are continuous. |
| Skewed right means the bump is on the right | The tail names the skew. Skewed right: long tail to the right. |
| The mean is always the best average | In skewed data the median is more typical. |
| A circle graph can show change over time | It shows parts of one whole at one time. Use a line graph for time. |
