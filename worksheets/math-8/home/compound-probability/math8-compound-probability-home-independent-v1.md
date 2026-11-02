---
title: Independent Events
course: math8
topic: compound-probability
strand: statistics-probability
skill: sample spaces and the probability of independent events
time: about 15 minutes
notes: math8/view/notes/compound-probability/math8-compound-probability-notes-v1
sections: s1, s2
---
<!-- Gate: One skill: P(A and B) = P(A) × P(B) for independent events, checked by counting the sample space.
     Worked example first, then fading support: Q1–4 have hints, Q5–6 on their own. Maps to: CP1, CP2.
     Fits one printed page. -->

::: tip
**For the adult:** Two events are **independent** when the first result does not change the chances of the second, like a coin and a die. To count all outcomes, multiply: 2 × 6 = 12. For "A **and** B", multiply the two probabilities. Never add them: needing both to happen makes the chance smaller.
:::

::: example
**Flip a coin and spin a spinner with 3 equal parts: red, blue, green. Find P(heads and blue).**
@viz cptree first="H,T" second="R,B,G" hot="HB"
Step 1: Count the outcomes: 2 × 3 = 6.
Step 2: Only HB is heads and blue. P = 1/6.
Step 3: Check by multiplying: 1/2 × 1/3 = 1/6.
:::

## Your turn

**1.** Flip two coins. Fill in the outcomes. Write S. *(S = {…, …, …, …})*
@viz tree first="H,T" second="H,T" outcomes=blank
**2.** A café has 4 soups and 3 breads. How many soup-and-bread combos? ___ *(Multiply.)*

**3.** Flip a coin and roll a die. Find P(tails and 5). ___ *(1/2 × 1/6. Check in the table.)*
@viz outcomes rows="H,T" cols="1,2,3,4,5,6" rowlabel="coin" collabel="die"
**4.** This spinner has 4 equal parts. Spin it twice. Find P(blue, then blue). ___ *(1/4 × 1/4.)*
@viz spin sections="blue;red;green;yellow" size=80
**5.** A bag has 2 red and 3 blue counters. Draw one, put it back, draw again. Find P(red, red) as a fraction and a percent. ___

**6.** Mo says P(heads and 4) = 1/2 + 1/6. Is he right? ___

::: check
I can find the probability of two independent events. ☐ Yes ☐ Almost ☐ Not yet
:::
