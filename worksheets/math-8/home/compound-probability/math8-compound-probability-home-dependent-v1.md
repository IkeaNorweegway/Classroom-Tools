---
title: Dependent Events
course: math8
topic: compound-probability
strand: statistics-probability
skill: the probability of two dependent events (without replacement)
time: about 15 minutes
notes: math8/view/notes/compound-probability/math8-compound-probability-notes-v1
sections: s3, s4
---
<!-- Gate: One skill: dependent events: multiply along the tree, with second fractions that use what is left.
     Worked example first, then fading support: Q1–3 have hints, Q4–6 on their own. Maps to: CP3, CP4.
     Fits one printed page. -->

::: tip
**For the adult:** Events are **dependent** when the first result changes the chances of the second. This happens when you draw **without replacement** (you keep the first item out). Multiply the two chances, but the second one uses what is left: one fewer item in all, and one fewer of the kind you took.
:::

::: example
**A bag has 3 red and 2 blue counters. Ava draws two and keeps the first out. Find P(blue, blue).**
@viz cpdraw before="red:3;blue:2" take="blue" beforelabel="1st: 2 blue of 5" afterlabel="2nd: 1 blue of 4"
Step 1: 1st draw: P(blue) = 2/5.
Step 2: One blue is out. 1 blue of 4 is left. P(blue) = 1/4.
Step 3: P(blue, blue) = 2/5 × 1/4 = 2/20 = 1/10 = 10%.
:::

## Your turn

**1.** Independent or dependent? a) Spin a spinner twice. b) Pick two names from a hat, no putting back. ___ *(Does the first result change the second?)*

**2.** A bag has 4 red and 1 blue. Ben draws a red and keeps it out. Find P(red) for his second draw. ___ *(Count what is left.)*

**3.** A bag has 2 red and 2 blue. Draw two, no putting back. Fill in the second fractions. Then find P(red, red). ___ *(After a red, 1 red of 3 is left.)*
@viz cptree first="R,B" p1="2/4,2/4" second="R,B|R,B" p2="[[1/3]],[[2/3]]|[[2/3]],[[1/3]]" outcomes=none
**4.** A drawer has 3 black and 2 white socks. Leo pulls out two in the dark. Find P(two white). ___

**5.** Five cards are numbered 1 to 5. Tess picks two, no putting back. Find P(both odd) as a percent. ___
@viz flips kind=card items="1,2,3,4,5" hot="1,3,5"
**6.** Sam says P(two black) in Q4 is 3/5 × 3/5. Fix his mistake. ___

::: check
I can find the probability of two dependent events. ☐ Yes ☐ Almost ☐ Not yet
:::
