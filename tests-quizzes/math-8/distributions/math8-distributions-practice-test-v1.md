---
title: Distributions & Circle Graphs
topic: distributions
strand: statistics-probability
test: practice
marks: 40
time: 60 minutes
calculator: Calculator allowed
---
<!-- Gate: outcome map complete. LOs covered: DI1, DI2, DI3 (outcome 8ST1.1), DI4 (outcome 8ST1.2). Every item maps to a specific LO.
     Extended response rubric included (Q20). Marks: DI1 10 · DI2 10 · DI3 10 · DI4 10 = 40.
     Posted for students. No item repeats the quiz, the exits, the notes examples or the unit test (math8-distributions-test-v1).
     Multiple-choice answers: B D C A A C B D (two of each letter).
     Made-up data: the pumpkin masses, the library loans, the hockey goals, the phone-game minutes, the lunch clubs,
     Liam's day, the Medicine Hat bus rides, Jun's and Ty's quiz scores. -->

## Part A — Choose the Answer
Circle the best answer. 1 mark each.

### [DI1 · 1] Which data should go in a histogram?
- A) the favourite pizza topping of each student
- B) the mass of each pumpkin at a fair (kg)
- C) the eye colour of each student
- D) the month each student was born
=> **B.** Mass is measured, so it is grouped into equal intervals.
=> Common mistakes: A, C and D are categories. They go in a bar graph.

### [DI1 · 1] Why do the bars of a histogram touch?
- A) to save space on the page
- B) because the data are categories
- C) because each bar is one person
- D) because the intervals cover all the numbers with no gaps
=> **D.** Measured data can be any number, so one interval runs right into the next.
=> Common mistakes: B is backwards: categories get gaps. C: each bar is a count of many people.

### [DI2 · 1] Which shape has no peak?
- A) symmetric
- B) bimodal
- C) uniform
- D) skewed right
=> **C.** In a uniform shape, the bars are all about the same height.
=> Common mistakes: A has one peak in the middle. B has two peaks. D has a peak and a tail.

### [DI2 · 1] At a child's birthday party, most people are 8 or 9 years old. A few parents are 35 to 45. What shape do the ages make?
- A) skewed right
- B) skewed left
- C) symmetric
- D) uniform
=> **A.** The peak is at the low ages. The few older parents make a long tail to the right.
=> Common mistakes: B names the side of the peak, not the tail. C and D ignore the long tail.

### [DI3 · 1] A data set is skewed right. Which is true?
- A) The mean is bigger than the median.
- B) The mean equals the median.
- C) The mean is smaller than the median.
- D) The mode is the biggest number.
=> **A.** The long tail of big numbers pulls the mean up, to the right of the median.
=> Common mistakes: B is true for a symmetric shape. C is true for a skewed-left shape.

### [DI3 · 1] What is the median of 7, 3, 9, 3, 8?
- A) 3
- B) 6
- C) 7
- D) 9
=> **C.** In order: 3, 3, 7, 8, 9. The middle number is 7.
=> Common mistakes: A is the mode. B is the mean. D is the middle number before sorting.

### [DI4 · 1] A sector of a circle graph is 108°. What percent of the whole is it?
- A) 10.8%
- B) 30%
- C) 108%
- D) 0.3%
=> **B.** 108 ÷ 360 = 0.3 = 30%.
=> Common mistakes: A moves the decimal in 108. C reads degrees as a percent. D forgets to multiply by 100.

### [DI4 · 1] Which data fits a circle graph?
- A) Calgary's temperature each month
- B) the height of each student in a class
- C) the number of goals in each game
- D) how one family spends its money each month
=> **D.** The spending is parts of one whole: the family's money for one month.
=> Common mistakes: A is change over time (a line graph). B is measured data (a histogram). C is a count for each game (a bar graph).

## Part B — Show Your Work
Show your steps.

### [DI1 · 3] The masses of 14 pumpkins at a county fair (kg): 3, 4, 6, 7, 7, 8, 9, 11, 12, 12, 13, 14, 17, 19. Make a frequency table with intervals 0–4, 5–9, 10–14, 15–19. Draw the histogram.
@viz dihist data="0–4:2;5–9:5;10–14:5;15–19:2" ymax=6 empty=1 xlabel="mass (kg)"
(work 3)
=> 0–4: 2. 5–9: 5. 10–14: 5. 15–19: 2. Total 14 (2 marks: all four correct; 1 mark for three).
=> Histogram with touching bars of the right heights (1 mark).

### [DI1 · 3] The double bar graph shows books borrowed from a school library. a) In which months did Grade 7 borrow more than Grade 8? b) In which month is the difference biggest? By how much? c) Why does this graph have gaps between the bars?
@viz didouble cats="Sep;Oct;Nov;Dec" data="40,55,35,20" data2="30,45,50,25" label="Grade 8" label2="Grade 7" ymax=60 ystep=10 ylabel="books" values=1
(lines 3)
=> a) November and December (1 mark).
=> b) November: 50 − 35 = 15 books (1 mark).
=> c) The months are separate categories, not intervals of measured data (1 mark).

### [DI2 · 3] a) Sketch a histogram that is skewed left. b) Label the peak and the tail. c) Give one real set of data that could have this shape.
@viz dotgrid cols=12 rows=6
(work 3)
=> a) Tall bars on the right, getting shorter to the left (1 mark).
=> b) The peak is labelled on the right and the long tail on the left (1 mark).
=> c) Any data where most values are high and a few are low: scores on an easy test, the age people retire, the life of a light bulb that rarely breaks early (1 mark).

### [DI2 · 3] The dot plots show the goals two minor hockey teams scored in their games. a) Describe the shape for the Hawks. b) Describe the shape for the Eagles. c) Which team usually scores more? Explain using the shapes.
@viz dotplot2 data="1,2,2,3,3,3,4,4,5" data2="0,0,1,1,1,2,2,4,6" min=0 max=6 label="Hawks" label2="Eagles" xlabel="goals in a game"
(lines 3)
=> a) Hawks: symmetric, one peak at 3 goals (1 mark).
=> b) Eagles: skewed right. The peak is at 1 goal and the tail goes right to 6 (1 mark).
=> c) The Hawks. Their data is centred at 3 goals. Most of the Eagles' games are at 2 goals or fewer (1 mark).

### [DI3 · 3] Nine students give the minutes they played a phone game yesterday: 0, 10, 15, 15, 20, 25, 30, 35, 120. a) Find the mean and the median. b) Which better shows a typical student? Explain.
@viz dotplot data="0,10,15,15,20,25,30,35,120" min=0 max=120 step=10 xlabel="minutes"
(lines 3)
=> a) Mean: 270 ÷ 9 = 30 minutes (1 mark). Median: the 5th number, 20 minutes (1 mark).
=> b) The median. The data is skewed right. The 120 pulls the mean up to 30 (1 mark).

### [DI4 · 3] 40 students pick a lunch-time club: chess 6, art 10, coding 16, choir 8. Find the percent and the angle for each club. Draw the circle graph.
(work 4)
=> Percents: chess 15%, art 25%, coding 40%, choir 20% (1 mark).
=> Angles: chess 54°, art 90°, coding 144°, choir 72°. They add to 360° (1 mark).
=> Circle graph with four sectors of the right sizes, each labelled (1 mark).

### [DI4 · 3] The circle graph shows how Liam spends a 24-hour day. a) How many hours does he sleep? b) What percent of his day is school? c) How many more minutes does he spend on screens than on sports?
@viz dipie data="Sleep:9;School:6;Sports:2;Screens:3;Other:4" labels="Sleep:135°;School:90°;Sports:30°;Screens:45°;Other:60°" title="Liam's day (24 hours)"
(lines 3)
=> a) 135 ÷ 360 = 0.375. 0.375 × 24 = 9 hours (1 mark).
=> b) 90 ÷ 360 = 0.25 = 25% (1 mark).
=> c) 45° − 30° = 15°. 15 ÷ 360 × 24 = 1 hour = 60 minutes (1 mark).

## Part C — Put It Together
Twenty students at a Medicine Hat school time their bus ride to school (minutes):
5, 8, 10, 11, 12, 12, 14, 15, 16, 18, 20, 22, 24, 25, 28, 31, 33, 36, 44, 58.

### [DI1 · 2] (a) Make a frequency table with intervals 0–9, 10–19, 20–29, 30–39, 40–49, 50–59. Draw the histogram.
@viz dihist data="0–9:2;10–19:8;20–29:5;30–39:3;40–49:1;50–59:1" ymax=8 empty=1 xlabel="bus ride (minutes)"
(work 2)
=> 0–9: 2. 10–19: 8. 20–29: 5. 30–39: 3. 40–49: 1. 50–59: 1 (1 mark).
=> Histogram with touching bars of the right heights (1 mark).

### [DI2 · 2] (b) Describe the shape of the histogram. Where are the peak and the tail?
(lines 2)
=> Skewed right (1 mark).
=> The peak is at 10–19 minutes. The long tail goes right, to the 58-minute ride (1 mark).

### [DI3 · 2] (c) The mean is 22.1 minutes. Find the median. Which better shows a typical ride? Explain using the shape.
(lines 2)
=> Median: the 10th and 11th numbers are 18 and 20, so the median is 19 minutes (1 mark).
=> The median. The data is skewed right, so the long rides pull the mean up (1 mark).

### [DI4 · 2] (d) The school puts the six intervals in a circle graph. What angle does 10–19 get? Which interval has a 54° sector?
(lines 2)
=> 10–19: 8 ÷ 20 = 40%. 0.4 × 360° = 144° (1 mark).
=> 54 ÷ 360 = 15%. 15% of 20 = 3 students: the 30–39 interval (1 mark).

## Part D — Explain Your Thinking

### [DI3 · 3] Ella says, "The mean is always the best average, because it uses every number." Use Jun's and Ty's quiz scores to show when she is right and when she is wrong.
@viz dotplot2 data="6,7,7,8,8,8,9,9,10" data2="2,9,9,9,10,10,10,10,10" min=0 max=10 label="Jun" label2="Ty" xlabel="quiz score (out of 10)"
(lines 5)
=> Model answer: Jun's scores are symmetric. His mean is 72 ÷ 9 = 8 and his median is 8, so the mean works well. Ty's scores are skewed left. His mean is 79 ÷ 9 ≈ 8.8, which is lower than 8 of his 9 scores, because the one score of 2 pulls it down. His median, 10, is more typical. So Ella is right for symmetric data but wrong for skewed data. For skewed data, use the median.
::: teacher label: Marking guide
| Level | Marks | What it looks like |
|---|---|---|
| Full | 3 | Finds Jun's mean and median (both 8) and Ty's mean (≈ 8.8) and median (10); says the mean works for symmetric data; explains that the 2 pulls Ty's mean down, so the median is better for skewed data |
| Partial | 2 | Finds the averages and says Ella is wrong for Ty, but does not link it to the shape or the low score |
| Partial | 1 | Says the mean is not always best with a reason, but no use of the two data sets, or finds the averages for one student only |
| Not shown | 0 | Agrees with Ella |
:::
