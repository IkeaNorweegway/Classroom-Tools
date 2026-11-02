---
title: The Shape of Data
course: math8
topic: distributions
strand: statistics-probability
skill: naming the shape of a distribution and choosing mean, median or mode
time: about 15 minutes
notes: math8/view/notes/distributions/math8-distributions-notes-v1
sections: s2, s3
---
<!-- Gate: One skill: name the shape of a distribution, then use it to pick the best average.
     Worked example first, then fading support: Q1–4 have hints, Q5–7 on their own. Maps to: DI2, DI3.
     Fits one printed page. -->

::: tip
**For the adult:** Look at the outline of the bars. Count the peaks. Then look for a long, low **tail**. The tail names the shape: a tail to the right is **skewed right**. A long tail pulls the mean toward it. So for skewed data the **median** (middle value) is the better "typical" value. If the two halves match (**symmetric**), the mean is fine.
:::

::: example
**Kids time their wait at a rink snack bar. Name the shape. Which average is best?**
@viz dihist data="0–4:8;5–9:6;10–14:3;15–19:2;20–24:1" xlabel="wait (minutes)" values=1 width=300
Step 1: One peak, on the left. Most waits are short.
Step 2: A few long waits make a tail to the right. The shape is skewed right.
Step 3: The tail pulls the mean up. Use the median.
:::

## Your turn

**1.** Name each shape. *(Count the peaks. Then look for a tail.)*
@viz dirow shapes="symmetric|left|bimodal" labels="A: [[symmetric]]|B: [[skewed left]]|C: [[bimodal]]" w=120
**2.** Leo says, "The tallest bar is on the right, so it is skewed right." Is he right? ___ *(Which way does the tail point?)*

**3.** Find the mean, median and mode of 2, 3, 3, 4, 8. ___ *(Put them in order first.)*

**4.** Bus waits (minutes): 3, 4, 4, 5, 6, 26. Find the mean and the median. Which is the better typical wait? ___ *(Mean: add, then divide by 6.)*
@viz dotplot data="3,4,4,5,6,26" min=0 max=28 step=2 xlabel="wait (minutes)" width=300
**5.** Mean, median or mode? a) favourite hockey team b) heights of Grade 8 students (symmetric) c) house prices in Calgary (skewed right) ___

**6.** A histogram is skewed left. Which is bigger, the mean or the median? ___

**7.** A family skate has kids and parents. Predict the shape of everyone's heights. ___

::: check
I can name the shape of data and pick the best average. ☐ Yes ☐ Almost ☐ Not yet
:::
