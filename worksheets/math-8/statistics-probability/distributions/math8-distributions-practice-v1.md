---
title: Distributions & Circle Graphs
topic: distributions
strand: statistics-probability
---
## Core

### Which graph fits best: bar graph, histogram, circle graph or line graph? a) the home province of Banff visitors b) the masses of newborn calves on an Alberta ranch c) how one family splits its budget d) Stampede attendance each year from 2015 to 2025
(lines 3)
=> a) bar graph (categories) (DI1) b) histogram (measured data) (DI1)
=> c) circle graph (parts of one whole) (DI4) d) line graph (change over time) (DI4)
=> d) targets the "a circle graph can show change over time" mix-up: years are not parts of one whole.

### The double bar graph shows Stampede attendance on four days (thousands of people). a) On which day was 2024 higher than 2025? b) Find the total for the four days in 2025.
@viz didouble cats="Fri;Sat;Sun;Mon" data="140,90,100,80" data2="150,85,110,95" label="2024" label2="2025" ymax=160 ystep=20 ylabel="thousands" values=1
(lines 2)
=> a) Saturday: 90 thousand in 2024, 85 thousand in 2025. (DI1)
=> b) 150 + 85 + 110 + 95 = 440 thousand people.

### Sixteen students time their homework (minutes): 5, 12, 18, 20, 22, 25, 28, 30, 31, 35, 38, 40, 44, 47, 52, 58. Make a frequency table with intervals 0–14, 15–29, 30–44, 45–59. Draw the histogram.
@viz dihist data="0–14:2;15–29:5;30–44:6;45–59:3" ymax=7 empty=1 xlabel="homework (minutes)"
(work 3)
=> 0–14: 5, 12 → 2. 15–29: 18, 20, 22, 25, 28 → 5. (DI1)
=> 30–44: 30, 31, 35, 38, 40, 44 → 6. 45–59: 47, 52, 58 → 3.
=> Check: 2 + 5 + 6 + 3 = 16. Draw 4 bars that touch.

### Sam drew this graph of Edmonton commute times. What did he do wrong?
@viz bar data="0–9:1;10–19:6;20–29:9;30–39:3" ystep=1 xlabel="minutes" ylabel="frequency"
(lines 2)
=> Time is measured, so the intervals have no gaps between them. The bars of a histogram must touch. (DI1)
=> Targets the "a histogram is a bar graph with gaps" mix-up.

### Mia puts 20 quiz scores into one interval, 50–99. Why is this a poor histogram?
@viz dihist data="50–99:20" width=160 xlabel="score"
(lines 2)
=> One bar shows no shape at all. Smaller equal intervals, like 50–59, 60–69 …, show where the scores bunch up. (DI1)

### Name each shape.
@viz dirow shapes="symmetric|bimodal|right" labels="A: [[symmetric]]|B: [[bimodal]]|C: [[skewed right]]"
(lines 1)
=> A: symmetric (one peak). B: bimodal (two peaks). C: skewed right (tail to the right). (DI2)

### Noor says, "The tallest bars are on the left, so this graph is skewed left." Is she right? Explain.
@viz dishape shape=right label="Ski lift wait times"
(lines 2)
=> No. The skew is named for the tail. The long tail goes to the right, so it is skewed right. (DI2)
=> Targets the "skewed right means the bump is on the right" mix-up.

### Two random samples of Edmonton adults give their commute (minutes). Describe the shape of each. How are they alike?
@viz dotplot2 data="10,15,15,20,20,20,25,25,30" data2="10,15,20,20,20,25,25,30,45" min=5 max=50 step=5 label="Sample A" label2="Sample B" xlabel="commute (minutes)"
(lines 3)
=> A: symmetric, one peak at 20 minutes. (DI2)
=> B: one peak at 20, with one long commute (45) making a short tail to the right: a little skewed right.
=> Alike: both peak at 20 minutes, and most commutes are 15 to 25 minutes.

### Mean, median or mode? a) the favourite activity of Banff visitors b) the heights of Grade 8 students (symmetric) c) family incomes in Calgary (skewed right)
(lines 2)
=> a) mode: the answers are words. b) mean: the data is symmetric. c) median: the high incomes pull the mean up. (DI3)

### Wait times at a walk-in clinic (minutes): 10, 12, 15, 15, 18, 20, 50. Find the mean, median and mode. Which is the best "typical wait"?
@viz dotplot data="10,12,15,15,18,20,50" min=10 max=50 step=5 xlabel="wait (minutes)"
(work 3)
=> Mean: 140 ÷ 7 = 20 minutes. Median: 15 minutes (the 4th value). Mode: 15 minutes. (DI3)
=> Best: the median, 15 minutes. The 50 pulls the mean up. Five of the seven waits are below 20.
=> Targets the "the mean is always the best average" mix-up.

### A survey asks 400 Stampede visitors where they live. Find each angle and each count.
| Home | Percent | Angle | Visitors |
|---|---|---|---|
| Calgary | 55% | ___ | ___ |
| Rest of Alberta | 20% | ___ | ___ |
| Rest of Canada | 15% | ___ | ___ |
| Other countries | 10% | ___ | ___ |
@viz dipie data="Calgary:55;Rest of Alberta:20;Rest of Canada:15;Other countries:10" show=none title="Where Stampede visitors live (400 people)"
(work 3)
=> Calgary: 0.55 × 360° = 198°, 0.55 × 400 = 220. Rest of Alberta: 72°, 80. (DI4)
=> Rest of Canada: 54°, 60. Other countries: 36°, 40.
=> Check: 198 + 72 + 54 + 36 = 360°. 220 + 80 + 60 + 40 = 400.

### 240 students pick a favourite winter sport. The Skiing sector has an angle of 54°. How many students chose skiing?
@viz dipie data="Hockey:40;Skiing:15;Skating:30;Other:15" labels="Hockey:;Skiing:54°;Skating:;Other:" arc="Skiing" title="Favourite winter sport (240 students)"
(lines 2)
=> 54 ÷ 360 = 0.15 = 15%. (DI4)
=> 0.15 × 240 = 36 students.

## Challenge

### Sixteen Banff visitors give their ages: 8, 12, 15, 22, 24, 25, 27, 28, 31, 33, 34, 36, 38, 45, 52, 67. The histogram uses intervals of 20. Draw a new histogram with intervals of 10. What does it show that the first one hides?
@viz dihist data="0–19:3;20–39:10;40–59:2;60–79:1" values=1 xlabel="age (years)" title="Intervals of 20"
@viz dihist data="0–9:1;10–19:2;20–29:5;30–39:5;40–49:1;50–59:1;60–69:1" ymax=6 empty=1 xlabel="age (years)" title="Intervals of 10"
(work 3)
=> 0–9: 1. 10–19: 2. 20–29: 5. 30–39: 5. 40–49: 1. 50–59: 1. 60–69: 1. Total 16. (DI1)
=> Both are skewed right. The new one shows the ages spread evenly over 20–39, and a long thin tail to 67.

### Predict the shape and give a reason. a) ages of people living in a seniors' home b) the last digit of 500 phone numbers c) heights of everyone at a Grade 1 class picnic with parents
(lines 3)
=> a) Skewed left: most are old, with a few younger people in a tail to the left. (DI2)
=> b) Uniform: each digit 0–9 is about equally likely.
=> c) Bimodal: one peak for the children, one for the adults.

### Without calculating, which is bigger here: the mean or the median? Explain.
@viz dihist data="0–4:9;5–9:7;10–14:4;15–19:2;20–24:1;25–29:1" xlabel="wait (minutes)" title="Lift wait times"
(lines 2)
=> The mean. The data is skewed right. The few long waits in the tail pull the mean up, but the median barely moves. (DI2, DI3)

### Six people work at a small Alberta shop. Their salaries (thousands of dollars) are 40, 42, 45, 45, 48, 200. The owner says, "Our typical salary is $70 000." Is that fair?
@viz numstrip rows="40,42,45,45,48,200" labels="In order" hot="1:6"
(lines 3)
=> Mean: 420 ÷ 6 = 70. Median: (45 + 45) ÷ 2 = 45. (DI3)
=> Not fair. Five of the six earn $48 000 or less. The one big salary pulls the mean up. The median, $45 000, is typical.

### Write 5 whole numbers with a mean bigger than the median. Name the shape your data makes.
(lines 2)
=> Answers vary. Example: 1, 2, 3, 4, 20. Mean 30 ÷ 5 = 6. Median 3. (DI3)
=> One big value makes a tail to the right: skewed right.

### 60 students name their favourite season: winter 12, spring 9, summer 30, fall 9. Find each percent and angle. Label the circle graph.
@viz dipie data="Winter:20;Spring:15;Summer:50;Fall:15" labels="Winter:[[72°]];Spring:[[54°]];Summer:[[180°]];Fall:[[54°]]" title="Favourite season (60 students)"
(work 3)
=> Winter: 12 ÷ 60 = 20%, 72°. Spring: 9 ÷ 60 = 15%, 54°. (DI4)
=> Summer: 30 ÷ 60 = 50%, 180°. Fall: 15%, 54°. Check: 360°.

### A family's energy bill is $2400 a year. Find the cost of space heating and of water heating.
@viz dipie data="Space heating:60;Water heating:20;Appliances:15;Lighting:5" show=deg title="Home energy use"
(lines 3)
=> Space heating: 216 ÷ 360 = 0.6 = 60%. 0.6 × $2400 = $1440. (DI4)
=> Water heating: 72 ÷ 360 = 0.2 = 20%. 0.2 × $2400 = $480.
