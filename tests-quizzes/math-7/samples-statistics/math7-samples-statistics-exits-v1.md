---
title: Samples & Statistics
topic: samples-statistics
strand: statistics-probability
---
<!-- Gate: one ticket per cluster. Every question maps to a specific LO (ST1–ST2: outcome 7ST1.1; ST3–ST4: outcome 7ST1.2). -->

## Section 1: Populations, samples and census
Target: I can name the population for a question. I can say when to use a census or a sample. (ST1)
### "How many hours do Grade 7 students in Lethbridge sleep?" Name the population.
(lines 1)
=> All Grade 7 students in Lethbridge.
### Is the length of a walleye discrete or continuous data?
(lines 1)
=> Continuous. Length is measured, and any value in between can happen.
### Mr. Lee wants the favourite lunch of his 24 students. Should he use a census or a sample? Explain how you know.
@viz people n=24 cols=12 label="Mr. Lee's class: 24 students"
(lines 2)
=> A census. The class is small, so it is quick and easy to ask all 24 students.

## Section 2: Fair samples and random sampling
Target: I can tell if a sample is fair. I can pick a sample at random two ways. (ST2)
### A list has 50 names. You want a sample of 10. Find the jump. Start at 3 and list the picks.
@viz people n=50 cols=10 numbers=1 label="Start at 3."
(lines 2)
=> Jump: 50 ÷ 10 = 5. Picks: 3, 8, 13, 18, 23, 28, 33, 38, 43, 48.
### Sam wants to know how many hours Grade 7 students play video games. He asks the 8 kids in his gaming club. Is his sample representative? Explain how you know.
(lines 2)
=> No. Gaming club kids likely play more than most students. Other students get no chance. It is biased. A random sample would fix it.

## Section 3: Mean, median, mode and range
Target: I can find the mean, median, mode and range of a set of data. (ST3)
### Find the mean, median, mode and range of 6, 2, 9, 4, 4.
@viz numstrip rows="6,2,9,4,4 | ___,___,___,___,___" labels="As given;In order"
(lines 3)
=> Mean: 6 + 2 + 9 + 4 + 4 = 25. 25 ÷ 5 = 5.
=> In order: 2, 4, 4, 6, 9. Median: 4. Mode: 4. Range: 9 − 2 = 7.
### Leo says the median is 9, because 9 is in the middle of the list. Explain how you know he is wrong.
(lines 2)
=> The list was not in order. In order, it is 2, 4, 4, 6, 9. The middle value is 4.

## Section 4: Comparing samples and drawing conclusions
Target: I can compare two samples. I can use them to say something about the whole population. (ST4)
### Two random samples of Grade 7 students give their number of pets. Find the mean of each sample.
@viz dotplot2 data="0,1,1,2,2,2,3,5" data2="0,1,1,1,2,2,3,4" min=0 max=6 label="Sample A (8 students)" label2="Sample B (8 students)" xlabel="number of pets"
(lines 2)
=> A: 0 + 1 + 1 + 2 + 2 + 2 + 3 + 5 = 16. 16 ÷ 8 = 2 pets.
=> B: 0 + 1 + 1 + 1 + 2 + 2 + 3 + 4 = 14. 14 ÷ 8 = 1.75 pets.
### Write a conclusion about all Grade 7 students.
(lines 1)
=> A Grade 7 student has about 2 pets (between 1.75 and 2). It is an estimate.
### The two means are different. Does that mean one sample is wrong? Explain how you know.
(lines 2)
=> No. Each sample has different students in it. Two samples from the same population are a bit different. Both give an estimate.
