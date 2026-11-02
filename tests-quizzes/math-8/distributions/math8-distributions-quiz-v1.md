---
title: Distributions & Circle Graphs
topic: distributions
strand: statistics-probability
---
<!-- Gate: outcome map complete. LOs covered: DI1 (outcome 8ST1.1: bar graphs, double bar graphs and
     histograms with equal intervals; effect of interval size), DI2 (outcome 8ST1.1: shape words; compare
     two samples), DI3 (outcome 8ST1.1: choose and justify mean, median or mode from the shape).
     Every item maps to a specific LO. Marks: 23.
     Given at the start of Lesson 4, before circle graphs (DI4). Calculators allowed.
     Park visitor numbers are made up for practice. -->

### [DI1 · 2] Bar graph or histogram? a) the favourite Stampede ride of each student b) the time each student spent at the Stampede (hours)
(lines 2)
=> a) bar graph: categories (1 mark).
=> b) histogram: time is measured (1 mark).

### [DI1 · 3] The double bar graph shows visitors to two national parks (thousands). a) Which park had more visitors in summer, and by how many? b) In which season are the two parks closest?
@viz didouble cats="Winter;Spring;Summer;Fall" data="60,80,200,100" data2="30,40,120,50" label="Banff" label2="Jasper" ymax=200 ystep=40 ylabel="thousands" values=1
(lines 3)
=> a) Banff (1 mark), by 200 − 120 = 80 thousand visitors (1 mark).
=> b) Winter: 60 − 30 = 30 thousand (1 mark).

### [DI1 · 3] Calgary's highs for 15 days in July (°C): 18, 20, 21, 22, 23, 23, 24, 24, 25, 26, 27, 28, 29, 31, 32. Make a frequency table with intervals 15–19, 20–24, 25–29, 30–34. Draw the histogram.
@viz dihist data="15–19:1;20–24:7;25–29:5;30–34:2" ymax=8 empty=1 xlabel="daily high (°C)"
(work 3)
=> 15–19: 1. 20–24: 7. 25–29: 5. 30–34: 2 (2 marks: all four correct; 1 mark for three).
=> Histogram with touching bars of the right heights (1 mark).

### [DI1 · 2] The same 20 hockey player ages are shown two ways. Which histogram shows the shape better? Why?
@viz dihist data="20–29:15;30–39:5" values=1 width=200 title="A: intervals of 10" xlabel="age"
@viz dihist data="20–24:7;25–29:8;30–34:3;35–39:2" values=1 title="B: intervals of 5" xlabel="age"
(lines 2)
=> B (1 mark). With more, smaller intervals you can see the peak in the 20s and the tail of older players (1 mark).

### [DI2 · 3] Name each shape.
@viz dirow shapes="left|symmetric|bimodal" labels="A: ___|B: ___|C: ___"
(lines 1)
=> A: skewed left. B: symmetric. C: bimodal (1 mark each).

### [DI2 · 2] Ken says, "The peak is on the left, so this graph is skewed left." Is he right? Explain.
@viz dishape shape=right label="Lift wait times"
(lines 2)
=> No (1 mark). The skew is named for the tail. The tail goes to the right, so it is skewed right (1 mark).

### [DI2 · 2] Two random samples of Grade 8 students give their hours of sleep. Describe the shapes and how they compare.
@viz dotplot2 data="6,7,7,8,8,8,9,9,10" data2="6,7,7,8,8,8,8,9,9,10" min=5 max=11 label="Sample A" label2="Sample B" xlabel="hours of sleep"
(lines 2)
=> Both are symmetric with one peak at 8 hours (1 mark).
=> The shapes are close, so a typical student sleeps about 8 hours (1 mark).

### [DI3 · 3] Seven people wait for food at the Stampede (minutes): 4, 5, 5, 6, 7, 8, 21. Find the mean, median and mode.
@viz dotplot data="4,5,5,6,7,8,21" min=4 max=22 step=2 xlabel="wait (minutes)"
(lines 3)
=> Mean: 56 ÷ 7 = 8 minutes (1 mark).
=> Median: 6 minutes (1 mark). Mode: 5 minutes (1 mark).

### [DI3 · 2] Explain your thinking: which is the best "typical wait" in the question above, and why?
(lines 3)
=> The median, 6 minutes (1 mark).
=> The data is skewed right. The 21-minute wait pulls the mean up to 8, more than five of the seven waits (1 mark).

### [DI3 · 1] Which average would you use for the favourite Stampede ride of a class?
(lines 1)
=> The mode: rides are categories, not numbers (1 mark).
