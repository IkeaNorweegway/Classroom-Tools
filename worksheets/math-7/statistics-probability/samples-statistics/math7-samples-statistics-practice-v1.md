---
title: Samples & Statistics
topic: samples-statistics
strand: statistics-probability
---
## Core

### "How long do Grade 7 students in Red Deer spend on homework each night?" a) Name the population. b) Is this a statistical question?
@viz people n=40 cols=20 groups="1-40:cold" label="Grade 7 students in Red Deer"
(lines 2)
=> a) All Grade 7 students in Red Deer. (ST1)
=> b) Yes. The answers vary from student to student.

### Census or sample? a) The heights of the 25 runners on the school track team. b) The mass of every bag of flour made at a mill this year. c) The favourite Flames player of every person in Calgary.
@viz people n=25 cols=13 pick="1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25" label="25 runners: easy to ask them all"
(lines 3)
=> a) Census. The team is small, so measure all 25. (ST1)
=> b) Sample. There are too many bags to weigh them all.
=> c) Sample. Asking over a million people would cost too much and take too long.

### Ava says, "A census is always better. Let's time every car on the QE2 highway this year." Is she right?
(lines 2)
=> No. There are far too many cars. A census would be too slow and cost too much. (ST1)
=> Time a sample of cars at random times. Targets the "a census is always better" mix-up.

### Discrete or continuous? a) number of brothers and sisters b) time to run 100 m c) goals the Flames score in a game d) temperature in Banff at noon
@viz dotplot data="0,1,1,1,2,2,3" min=0 max=4 title="Brothers and sisters" xlabel="counted: only whole numbers"
(lines 2)
=> a) discrete (counted) b) continuous (measured) (ST1)
=> c) discrete (counted) d) continuous (measured)

### Ben wants the favourite music of Grade 7 students. He asks his 6 friends at lunch. Is his sample fair? How could he fix it?
@viz people n=30 cols=15 groups="1-6:hot" pick="1,2,3,4,5,6" label="Ben's 6 friends: nobody else gets a chance"
(lines 3)
=> No. His friends are likely to like the same music. The sample is biased. (ST2)
=> Fix: pick students at random from all the Grade 7 students, so everyone has the same chance.
=> Targets the "ask your friends" mix-up.

### A class list has 48 students. Noor wants a sample of 8. What jump should she use? She starts at 4. List her picks.
@viz people n=48 cols=16 numbers=1 label="Start at 4."
(lines 2)
=> Jump: 48 ÷ 8 = 6. Pick every 6th student. (ST2)
=> 4, 10, 16, 22, 28, 34, 40, 46. That is 8 students.

### Describe how to pick a simple random sample of 15 from the 150 Grade 7 students at a school.
@viz hat names="Ava,Sam,Noor,Leo,Mia" label="150 names"
(lines 3)
=> Write each name on a slip. Put all 150 slips in a hat and mix them. (ST2)
=> Draw 15 slips without looking.
=> Or: number the students 1 to 150 and use a random number generator to pick 15 numbers.

### The daily highs in Calgary for 5 days were 8, 12, 15, 9 and 11 °C. Find the mean.
@viz levelling data="8,12,15,9,11" labels="Mon;Tue;Wed;Thu;Fri" cell=9
(lines 2)
=> Sum: 8 + 12 + 15 + 9 + 11 = 55. (ST3)
=> Mean: 55 ÷ 5 = 11 °C.

### Bus rides take 14, 6, 22, 10 and 18 minutes. Kai says the median is 22, because it is in the middle. Fix his mistake.
@viz numstrip rows="14,6,22,10,18 | [[6]],[[10]],[[14]],[[18]],[[22]]" labels="As given;In order"
(lines 2)
=> Put the numbers in order first: 6, 10, 14, 18, 22. (ST3)
=> The middle value is 14. The median is 14 minutes. Targets the "middle of the list as given" mix-up.

### The Oilers scored 3, 5, 2, 3, 6, 1, 3 and 1 goals in 8 games. Find the mean, median, mode and range. Zoe says the mode is 6, because 6 is the biggest. Is she right?
@viz dotplot data="3,5,2,3,6,1,3,1" min=0 max=7 xlabel="goals in a game"
(lines 4)
=> Mean: 3 + 5 + 2 + 3 + 6 + 1 + 3 + 1 = 24. 24 ÷ 8 = 3 goals. (ST3)
=> Median: in order 1, 1, 2, 3, 3, 3, 5, 6. The middle two are 3 and 3. (3 + 3) ÷ 2 = 3 goals.
=> Mode: 3 (it comes up 3 times). Range: 6 − 1 = 5 goals.
=> Zoe is wrong. The mode is the most common value, not the biggest. Targets the "mode is the biggest number" mix-up.

### Two random samples of Grade 7 students give minutes of reading a night. Find each mean. Mia says, "The mean for all Grade 7 students is exactly 24." Fix her mistake.
@viz dotplot2 data="15,20,25,30,30" data2="20,25,25,30,35" min=10 max=40 step=5 label="Sample A" label2="Sample B" xlabel="minutes of reading"
(lines 3)
=> Sample A: 15 + 20 + 25 + 30 + 30 = 120. 120 ÷ 5 = 24 minutes. (ST4)
=> Sample B: 20 + 25 + 25 + 30 + 35 = 135. 135 ÷ 5 = 27 minutes.
=> A sample gives an estimate. The mean for all Grade 7 students is about 24 to 27 minutes. Targets the "a sample gives the exact answer" mix-up.

## Challenge

### A school has three Grade 7 classes of 30. Omar numbers all 90 students. He picks a random start from 1 to 10, then every 10th student. Lily picks the first 9 names on Mr. Lee's class list. Whose sample is better? Why?
(lines 3)
=> Omar's. It is random, and it picks from all three classes. (ST2)
=> Lily's sample leaves out two classes. Students in the other classes get no chance, so it is biased.

### Five numbers have a mean of 6. Four of them are 4, 7, 5 and 9. Find the fifth number.
(lines 2)
=> The sum is 5 × 6 = 30. (ST3)
=> 4 + 7 + 5 + 9 = 25. The fifth number is 30 − 25 = 5.

### Make a set of 6 numbers with a mode of 4, a median of 5 and a range of 6.
@viz numstrip rows="[[2]],[[4]],[[4]],[[6]],[[7]],[[8]]" labels="In order"
(lines 2)
=> Answers vary. Example: 2, 4, 4, 6, 7, 8. (ST3)
=> Mode 4 (twice). Median (4 + 6) ÷ 2 = 5. Range 8 − 2 = 6.

### Six students give their hours of screen time: 2, 3, 3, 4, 3 and 15. Find the mean and the median. Which one better describes a typical student? Why?
@viz dotplot data="2,3,3,4,3,15" min=0 max=16 step=1 highlight="15" xlabel="hours of screen time"
(lines 3)
=> Mean: 2 + 3 + 3 + 4 + 3 + 15 = 30. 30 ÷ 6 = 5 hours. (ST3, ST4)
=> Median: in order 2, 3, 3, 3, 4, 15. (3 + 3) ÷ 2 = 3 hours.
=> The median. Five of the six students have 4 hours or less. The one big value, 15, pulls the mean up.

### Two random samples of Calgary Grade 7 students give bus ride times. Find the mean and median of each. Then put the samples together and find the mean of all 16.
@viz dotplot2 data="10,12,14,16,18,20,22,32" data2="8,12,14,16,16,20,24,26" min=8 max=32 step=2 label="Sample A (8 students)" label2="Sample B (8 students)" xlabel="minutes on the bus"
(lines 4)
=> A: sum 144. Mean 144 ÷ 8 = 18 minutes. Median (16 + 18) ÷ 2 = 17 minutes. (ST3, ST4)
=> B: sum 136. Mean 136 ÷ 8 = 17 minutes. Median (16 + 16) ÷ 2 = 16 minutes.
=> Together: (144 + 136) ÷ 16 = 280 ÷ 16 = 17.5 minutes.
=> Conclusion: a typical ride is about 16 to 18 minutes.

### Raj catches 5 walleye by the dock. Their mean length is 32 cm. Tess catches 20 walleye with nets at random spots. Their mean length is 43 cm. Whose estimate for the whole lake do you trust more? Why?
(lines 3)
=> Tess's. Her sample is random and bigger. (ST2, ST4)
=> Raj's fish all come from one spot where small fish swim, so his sample is biased.

### A list has 120 names. Kai wants 12 names, so he picks every 10th name. Why must his random start be a number from 1 to 10? What goes wrong if he starts at 15?
@viz people n=40 cols=20 numbers=1 pick="15,25,35" label="Start at 15: names 1 to 14 never get a chance"
(lines 3)
=> Starting at 15 gives 15, 25, …, 115. That is only 11 names. (ST2)
=> Names 1 to 14 can never be picked, so not everyone has the same chance.
=> A start from 1 to 10 gives exactly 12 names, and every name could be picked.
