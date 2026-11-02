---
title: Distributions & Circle Graphs
topic: distributions
strand: statistics-probability
---
<!-- Gate: one ticket per cluster. Every question maps to a specific LO (DI1–DI3: outcome 8ST1.1; DI4: outcome 8ST1.2). -->

## Section 1: Bar graphs and histograms
Target: I can show a distribution with a bar graph, a double bar graph or a histogram. (DI1)
### Twelve students run 1 km (minutes): 4, 5, 5, 6, 6, 6, 7, 7, 8, 9, 10, 11. Make a frequency table with intervals 4–5, 6–7, 8–9, 10–11. Draw the histogram.
@viz dihist data="4–5:3;6–7:5;8–9:2;10–11:2" ymax=6 empty=1 xlabel="time (minutes)"
(work 2)
=> 4–5: 3. 6–7: 5. 8–9: 2. 10–11: 2. Total 12. Bars touch.
### Would you show the heights of the Flames players with a bar graph or a histogram? Explain how you know.
(lines 2)
=> A histogram. Height is measured, so group it in equal intervals. The bars touch because there are no gaps between heights.

## Section 2: Shapes of distributions
Target: I can describe the shape of a distribution. I can compare the shapes of two samples. (DI2)
### Name each shape.
@viz dirow shapes="uniform|bimodal" labels="A: [[uniform]]|B: [[bimodal]]"
(lines 1)
=> A: uniform. B: bimodal.
### Ava says this graph is skewed right because its peak is on the right. Is she right? Explain how you know.
@viz dishape shape=left label="Scores on an easy quiz"
(lines 2)
=> No. The skew is named for the tail. The long tail goes to the left, so it is skewed left.

## Section 3: Choosing mean, median or mode
Target: I can choose the mean, median or mode for a set of data. I can explain my choice using the shape. (DI3)
### Five people wait for a bus (minutes): 2, 3, 3, 4, 18. Find the mean and the median.
@viz dotplot data="2,3,3,4,18" min=0 max=20 step=2 xlabel="wait (minutes)"
(lines 2)
=> Mean: 30 ÷ 5 = 6 minutes. Median: 3 minutes.
### Which average best shows the favourite Oilers player in a class?
(lines 1)
=> The mode. Names are not numbers, so there is no mean or median.
### Which is the better "typical wait" in the first question: the mean or the median? Explain how you know.
(lines 2)
=> The median, 3 minutes. The data is skewed right. The 18 pulls the mean up to 6, which is more than four of the five waits.

## Section 4: Circle graphs
Target: I can draw a circle graph from a table. I can use a circle graph to solve problems. (DI4)
### Find the angle for 35% of a circle graph.
(lines 1)
=> 0.35 × 360° = 126°
### 300 students were asked how they get to school. How many take the bus?
@viz dipie data="Bus:20;Car:35;Walk:30;Bike:15" labels="Bus:72°;Car:;Walk:;Bike:" arc="Bus" title="How 300 students get to school"
(lines 2)
=> 72 ÷ 360 = 0.2 = 20%. 0.2 × 300 = 60 students.
### Can a circle graph show Calgary's population each year from 2015 to 2025? Explain how you know.
(lines 2)
=> No. A circle graph shows parts of one whole at one time. The years are not parts of a whole. A line graph shows change over time.
