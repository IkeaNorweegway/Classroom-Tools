---
title: Independent & Dependent Events
topic: compound-probability
strand: statistics-probability
subtitle: 4 lessons + quiz · Outcome 8PR1 · Codes CP1–CP4
---
## Overview
::: overview
**Big idea:** every probability in this unit is counted from a model of the sample space. For two events, each result of the first pairs with every result of the second, so the outcomes multiply (coin and die: 2 × 6 = 12), and a list, a table, a tree or set notation all show the same S. When the first result does not change the chances of the second (coins, dice, spinners, draws with replacement), the events are independent and P(A and B) = P(A) × P(B): the area model shows "both" as the overlap, which is smaller than either part, never the sum. When the first result does change the second (draws without replacement), the events are dependent: the same tree is used, but the second-stage fractions are what is left after the first draw. Problems then begin with one question: does the first result change the second chance?
**Sequence:** S in set notation, compound events, the coin-and-die tree, table and list, counting by multiplying, lunch combos, probability by counting favourable outcomes (CP1) → independence, with replacement, the multiplication rule with an area model checked by counting, spinning twice, three coins with a three-stage tree, the gambler's fallacy (CP2) → keep it out, second fractions change, two reds without replacement (30% vs. 36% with), captains from a hat, two cards, the independent-or-dependent table (CP3) → the four-step routine, a Stampede midway game, sums of two dice, the sock drawer, weather on two days, a shootout lineup (CP4).
**Materials:** coins, standard dice (two colours per pair if possible), paper clips and pencils for spinners, opaque bags or cups with coloured counters (3 red, 2 blue per pair), a hat with name cards, a deck of cards or cards numbered 1–5, socks or coloured cubes for the sock drawer, grid paper for area models, calculators. Optional: a spreadsheet (RANDBETWEEN) or an online dice roller to run 1000 trials and compare with the calculated probability.
**Depth ceiling:** two events, and three only for independent events with a tree (three coins). Without replacement means one item is kept out between two draws. Probabilities are written as a fraction in simplest form, a decimal (to 2–3 places) and a percent (to one decimal place when needed). No mutually exclusive events, "or" rules, complements as a rule, or Venn diagrams (Grade 9). Experimental probability appears only as a check on a simulation.
**Reading level:** student pages are written at about Grade 3–4 (F&P N–P). The math words (sample space, set notation, S, compound event, tree diagram, outcome table, independent events, with replacement, P(A and B), area model, dependent events, without replacement, model, favourable outcome) are the learning; each has a picture beside it.
**Notation:** S = {H, T} with curly brackets; compound outcomes are written H3 or, for names, A,B. "And" means both happen. The notes write P(red, red) for "red, then red". Students multiply along each path of a tree and write the product at the end of the branch; the products of all branches add to 1, which is the check.
:::

| Watch for | What to do |
|---|---|
| "A coin and a die give 2 + 6 = 8 outcomes" | Build the outcome table: heads alone makes a full row of 6. Count the cells: 12. Then link to the tree's 12 ends. |
| Listing the same outcome twice or missing one | Use a system: hold the first event fixed and run through every result of the second. Count the list against the multiplication. |
| "P(A and B) = P(A) + P(B)" | Ask "should needing both be more or less likely than one?" ½ + ⅙ = ⅔ is more likely than heads alone. Shade the area model: both is the overlap. |
| "After 3 heads, tails is due" | Run it: each pair flips until they get 3 heads in a row, then records the next flip. Pool the class results; tails is about half. The coin has no memory. |
| Treating with replacement as dependent | Ask "is the bag the same as before?" If yes, the chances are the same: independent. |
| "Without replacement, the second pick has the same chances" | Do it with a real bag: draw a red, keep it out, count what is left (2 red of 4). Write the new fraction on the tree. |
| Changing only the denominator when the same colour is drawn | After a red, both the reds and the total go down by 1: 3/5 then 2/4. After a blue, only the total goes down: 3/4 for red. |
| Not simplifying, or simplifying only after converting | Simplify the product: 6/20 = 3/10 = 0.3 = 30%. Accept unsimplified fractions on exits, not on the quiz's final answer. |
| "Weather on two days is always independent" | Ask "does a snowy Monday make a snowy Tuesday more likely?" Multiply only when the problem says to treat them as independent. |
| Counting 6 + 6 = 12 outcomes for two dice | Draw the 6 × 6 sum table; 36 cells. Sum of 7 is 6 cells, not 1. |

## Lessons
### Lesson 1 — Sample spaces (60 min)
DO: Pre-knowledge check (5 min). Q1 one-event probability (Grade 7), Q2 fraction → decimal → percent, Q3 multiplying fractions (needed in Lesson 2), Q4 simplifying, Q5 P(blue) from a bag, Q6 listing outcomes of a spinner.
SHOW: A coin and a die. "If I flip and roll at the same time, what could happen?" Collect answers on the board until students see they need a system.
SAY: "The sample space S is every outcome, listed once, inside curly brackets. For two events, each result of the first pairs with every result of the second. So we multiply."
CUE: Worked Example 1 (coin and die: tree, table, set notation, 12 outcomes).
WATCH: "2 + 6 = 8 outcomes." Misconception box: heads alone makes 6.
CUE: Worked Example 2 (lunch combos: 3 × 2 = 6), Worked Example 3 (P(heads and even) = 3/12 = 1/4).
DO: Your turn, retrieval, exit ticket Section 1.

### Lesson 2 — Independent events (60 min)
DO: Warm-up interleaved: S for two coins; 2/3 × 3/4; 3/12 as a percent; outcomes for a die and a 4-part spinner.
SHOW: The bag with 3 red and 2 blue. Draw, show, put it back. "Is the bag the same for the next draw?"
SAY: "If the first result doesn't change the chances of the second, the events are independent. For 'and', multiply: P(A and B) = P(A) × P(B)."
CUE: Worked Example 1 (heads and 6: ½ × ⅙ = 1/12 on the area model, checked by the table).
WATCH: "P(A and B) = P(A) + P(B)." Misconception box: adding makes "both" more likely, which can't be.
CUE: Worked Example 2 (spin a 2/3-red spinner twice: 4/9; the tree with four products), Worked Example 3 (with replacement: 9/25 = 36%).
CUE: Worked Example 4 (three coins: the three-stage tree, 8 outcomes, 1/8).
WATCH: "Tails is due." Misconception box, then the class streak experiment if time allows.
DO: Your turn, retrieval, exit ticket Section 2.

### Lesson 3 — Dependent events (60 min)
DO: Warm-up interleaved: P(6, then 6); 3/5 × 3/5; S for a coin and a 3-part spinner; 9/25 as a percent.
SHOW: The same bag. Draw a red and keep it out. "What's in the bag now?"
SAY: "If the first result changes the chances of the second, the events are dependent. Use the same tree, but the second fractions use what is left."
CUE: Worked Example 1 (two reds without replacement: 3/5 × 2/4 = 3/10; compare 36% with replacement).
WATCH: "The second pick has the same chances." Misconception box: cpdraw before and after.
CUE: Worked Example 2 (captains from a hat: 12 outcomes, 2 favourable, 1/6), Worked Example 3 (two even cards: 2/5 × 1/4 = 1/10).
DO: The independent-or-dependent table as a whole-class sort; students give the "why" for each.
DO: Your turn, retrieval, exit ticket Section 3. Quiz next class.

### Lesson 4 — Probability problems (60 min)
DO: Mid-unit quiz (25 min) first (CP1–CP3). Then the lesson.
SHOW: The four-step flow: independent or dependent → model → multiply or count → fraction, decimal, percent.
CUE: Worked Example 1 (Stampede wheel and die: 1/24 ≈ 4.2%), Worked Example 2 (sum of 7 from the 36-cell table: 1/6), Worked Example 3 (sock drawer: 4/6 × 3/5 = 2/5).
CUE: Worked Example 4 (snow on Monday and Tuesday, treated as independent: 0.4 × 0.5 = 0.2).
WATCH: "Weather on two days is always independent." Misconception box.
CUE: Worked Example 5 (shootout: 3/5 × 2/4 = 3/10).
DO: Core worksheet; Challenge for early finishers. Exit ticket Section 4. Unit synthesis (Stampede tokens with and without replacement) as review.

## Assessment
::: box Mid-unit quiz (23 marks)
CP1 (Q1–3), CP2 (Q4–7), CP3 (Q8–10). Given at the start of Lesson 4, after Sections 1–3 and before mixed problems (CP4). Calculators allowed. Q1 a): the tree needs all 6 branch ends. Q2: "no" alone earns 1 mark; full marks need 5 × 4 = 20. Q4: accept 2/12 for the fraction mark; the decimal and percent marks need 0.17 and 17% (or 16.7%). Q7: naming "multiply, not add" earns the first mark. Q9: 2/6 × 2/6 (with replacement) earns no marks for the product. Q10 is the explain-your-thinking item: full marks say one blue is kept out and give 1 blue of 5 left.
:::
::: box Worksheets and exits
Core (★) covers CP1–CP4 with a diagram on most questions: a coin-and-spinner tree with set notation, the 4 + 3 taco-combo error, doubles on two dice, an independent-or-dependent sort, tails and 3 with an area model checked by counting, a 4-part spinner twice, the adding error, a bag with replacement and then without, a 6-is-due claim, the sock drawer, and rain on two days. Challenge (★★) adds exactly two heads from three coins, sums of 8 and sums less than 5, Grade 7 and Grade 8 names from a hat, forward-then-defence from a shootout list, a coin and a 3/4-red spinner with the sum error, a ring toss with P = 0.2 twice (win both, miss both), and two hearts with and without replacement. Each misconception has at least one targeted question; the key names it. Exit tickets: one per section, each ending with an "explain how you know" item.
:::
::: box Home practice
Two parent-friendly sheets: "Independent events" (Sections 1 and 2) and "Dependent events" (Sections 3 and 4). Each has a worked example, 6 questions and a separate answer sheet.
:::

## Data and contexts used
- The Stampede midway wheel, the token booth and the ring toss (P = 0.2) are made up; real midway odds are not published per game.
- The Calgary snow forecast (40% Monday, 50% Tuesday) and the Edmonton rain forecast (30% Saturday, 20% Sunday) are made-up forecasts. Treating two days as independent is a simplification the problems state outright; real weather on consecutive days is correlated.
- Lunch combos, the café, the food truck, the sock drawer, the hockey shootout lists and all names in hats are made up.
- Every coin, die and spinner is assumed fair; that assumption is the model, and a class simulation shows results close to, not equal to, the calculated probability.

## Connections
- **Grade 7 Probability:** single-event probability, experimental vs. theoretical probability, and the gambler's fallacy return here.
- **Rational Numbers (topic 1):** multiplying and simplifying fractions; converting fractions to decimals and percents.
- **Grade 7 Percents:** every answer is also written as a percent.
- **Distributions & Circle Graphs (topic 11):** the 36-cell sum table gives a symmetric distribution of sums, peaked at 7.
- **Grade 9:** mutually exclusive events, "or" probabilities and Venn diagrams.
