---
title: Inequalities
topic: inequalities
strand: algebra
---
<!-- Gate: progressive blanking confirmed. Section 1 is mostly filled in. Section 4 is mostly blanks.
     Refutation-first on these. "x < 3 includes 3" (IQ1, again in IQ2). "x > 2 points left" (IQ2).
     "At least means less than" (IQ1, again in IQ4). "Reading 3 < x backwards" (IQ1, again in IQ2).
     "One number works, so they all work" (IQ3). "A ray for whole people" (IQ4).
     Section order: the symbols and words come first (IQ1). The number line needs them (IQ2).
     Checking by substitution comes next (IQ3). It tests the graph and the boundary.
     Real situations come last (IQ4). They use all three.
     Outcome 8A3. No solving by inverse operations (Grade 9). Testing values is the method. -->

## Pre-Knowledge Check
1. Which is greater: −5 or −2?
2. Put these in order from least to greatest: 0.5, −1, {1/4}, 2.
3. Find 3x − 2 when x = 4.
4. Find 2x + 5 when x = −3.
5. Is 6 = 2x a true statement when x = 3? When x = 4?
6. Mark 1.5 and −2.5 on a number line.

## Section 1: Strict and non-strict
Learning target: I can read and write inequalities in words and in symbols.

### Vocabulary
- inequality :: a statement that two amounts are not equal: one is greater or less :: x > 3
- solution of an inequality :: any number that makes it true; there are usually many :: 4, 5 and 10.2 are solutions of x > 3
- strict inequality :: uses < or >; the boundary number is NOT included :: x < 3 does not include 3
- non-strict inequality :: uses ≤ or ≥; the boundary number IS included :: x ≤ 3 includes 3
- boundary :: the number where the solutions start or stop :: in x ≥ 16, the boundary is 16

#### One answer or many?
An equation has one answer. x + 2 = 5 only works for x = 3.
Look at the sign on Highway 2. You may drive 110 km/h. You may also drive 100, or 95.5.
@viz iqsign kind=speed value=110 caption="Highway 2: no faster than 110 km/h."
Let s be your speed. Then s ≤ 110. That is an **inequality**. It has many solutions.
@viz iqline value=110 dir=left closed=1 min=80 max=130 step=5 every=10 label="s ≤ 110" caption="Every speed up to and including 110 works."

#### Four symbols
| Symbol | Say it | Other words | Boundary in? |
|---|---|---|---|
| < | is less than | below, under, fewer than | No |
| > | is greater than | above, over, more than | No |
| ≤ | is less than or equal to | at most, no more than | Yes |
| ≥ | is greater than or equal to | at least, no less than | Yes |

::: key Strict or non-strict
< and > are **strict**. The boundary is left out.
≤ and ≥ are **non-strict**. The line under the symbol means "or equal to".
x ≥ 16 means x > 16 **or** x = 16.
The small end of the symbol points at the smaller amount.
:::
@viz numberline min=-6 max=2 step=1 points="-5:−5;-2:−2" ends="smaller,greater" caption="−5 < −2 because −5 is further left."

::: example Worked Example 1 — Words to symbols
Write each one with symbols.
@viz iqsign kind=height value=122 caption="A ride at Calaway Park."
a) You must be at least 122 cm tall. Let h = height. h ≥ 122.
b) Fewer than 30 students fit on the bus. Let n = students. n < 30.
c) The bag holds no more than 23 kg. Let m = mass. m ≤ 23.
d) It is colder than −5 °C. Let t = temperature. t < −5.
@viz thermo min=-15 max=5 step=5 values="-5" labels="−5 °C"
:::

::: misconception
WRONG: "x < 3 includes 3. 3 is right there in it."
WHY: Try it. Is 3 < 3 true? No. 3 is equal to 3, not less. So 3 is not a solution.
@viz iqline value=3 dir=left closed=0 min=-2 max=6 label="x < 3" marks="3:3 < 3 ✗"
RIGHT: x < 3 leaves 3 out. x ≤ 3 lets it in: 3 ≤ 3 is true.
:::

::: misconception
WRONG: "At least 16 means less than 16."
WHY: "Least" sounds like "less". But at least 16 means 16 is the smallest you can be. You can be 16 or older.
@viz numberline min=12 max=20 step=1 points="16:16 ✓;18:18 ✓;14:14 ✗"
RIGHT: at least means ≥. At most means ≤.
:::

::: example Worked Example 2 — Read it both ways
3 < x and x > 3 say the same thing.
@viz flow steps="3 < x|3 is less than x|x is greater than 3|x > 3"
Step 1: Read from left to right: "3 is less than x."
Step 2: Turn it around. If 3 is less than x, then x is greater than 3.
Step 3: Write it with x first: x > 3. The symbol still points at the 3.
In the same way, −1 ≥ y is the same as y ≤ −1.
:::

::: misconception
WRONG: "3 < x means x is less than 3."
WHY: That reads the symbol backwards. Read from left to right: 3 is less than x.
@viz iqline value=3 dir=right closed=0 min=-2 max=8 label="3 < x" marks="5:5 ✓;1:1 ✗"
RIGHT: 3 < x means x > 3. Test 5: is 3 < 5 true? Yes.
:::
::: explain
Why is 7 ≥ 7 true, but 7 > 7 is false?
(lines 2)
=> ≥ means greater than OR equal to. 7 equals 7, so 7 ≥ 7 is true. 7 is not greater than 7, so 7 > 7 is false.
:::

::: example Worked Example 3 — True or false?
| Statement | Think | True or false? |
|---|---|---|
| 5 ≥ 5 | 5 equals 5. ≥ lets equal in. | True |
| 5 > 5 | Equal is not greater. | False |
| −2 < −5 | −2 is right of −5. | False |
| {1/2} ≤ 0.5 | They are equal. | True |
@viz numberline min=-6 max=1 step=1 points="-5:−5;-2:−2"
:::

::: try
1. Write in symbols: x is at most 8. [[x ≤ 8]]
2. Write in symbols: the price p is more than $20. [[p > 20]]
3. Write in words: y ≥ −4. [[y is greater than or equal to −4 (y is at least −4).]]
4. Write 10 > n with n first. [[n < 10]]
@viz iqline value=10 dir=left closed=0 min=5 max=14 label="10 > n"
5. True or false: −3 ≤ −3. −1 > 0. 0.25 < {1/4}. [[True. False. False (they are equal).]]
6. Strict or non-strict: k ≥ 2.5? m < 0? [[k ≥ 2.5 is non-strict. m < 0 is strict.]]
:::
::: retrieval
1. Which is less: −8 or −3?
=> −8 (it is further left).
2. Find 4x − 1 when x = 2.5.
=> 4(2.5) − 1 = 10 − 1 = 9
3. Write {3/5} as a decimal.
=> 0.6
4. Solve 2x + 3 = 11.
=> 2x = 8. x = 4.
5. ★ Stretch: Write an inequality with 0 and 5 as solutions. 6 must not be a solution.
=> Answers vary. For example x ≤ 5 or x < 5.5.
:::

## Section 2: Inequalities on a number line
Learning target: I can graph an inequality and write one from a graph.

### Vocabulary
- open dot :: ○ at the boundary: the boundary is NOT a solution :: x > 2 has an open dot at 2
- closed dot :: ● at the boundary: the boundary IS a solution :: x ≥ 2 has a closed dot at 2
- ray :: a thick line with an arrow: every number that way is a solution :: x > 2: a ray to the right

#### Dot, then direction
Every inequality graph has two parts.
@viz flow steps="Find the boundary|Open or closed dot?|Ray left or right?|Test one number" width=640
Part 1 is the dot. < and > get an open dot ○. ≤ and ≥ get a closed dot ●.
Part 2 is the ray. Greater numbers are to the right. Less numbers are to the left.
@viz iqline value=2 dir=right closed=0 min=-3 max=7 label="x > 2" caption="Open dot: 2 is out. Ray right: bigger than 2."
@viz iqline value=2 dir=right closed=1 min=-3 max=7 label="x ≥ 2" caption="Closed dot: 2 is in."

::: key Graphing an inequality
| Symbol | Dot | Ray |
|---|---|---|
| x > a | open ○ | right |
| x ≥ a | closed ● | right |
| x < a | open ○ | left |
| x ≤ a | closed ● | left |
:::

::: example Worked Example 1 — Graph x ≤ −1
@viz iqline value=-1 dir=left closed=1 min=-6 max=3 label="x ≤ −1" marks="-3:test −3 ✓"
Step 1: The boundary is −1.
Step 2: ≤ lets −1 in. Draw a closed dot.
Step 3: "Less" is to the left. Draw the ray left.
Step 4: Test −3: is −3 ≤ −1? Yes. −3 is on the ray. ✓
:::

::: misconception
WRONG: "x > 2 points left. The symbol > points left."
WHY: The symbol's shape is not a direction. x > 2 means numbers bigger than 2, like 3, 5 and 100. They sit to the right.
@viz iqline value=2 dir=right closed=0 min=-3 max=7 label="x > 2" marks="5:5 ✓;0:0 ✗"
RIGHT: Greater is to the right. Test a number on your ray to be sure.
:::

::: misconception
WRONG: "x < 3 gets a closed dot at 3."
WHY: 3 < 3 is false, so 3 is not a solution. A closed dot would say 3 works.
@viz iqline value=3 dir=left closed=0 min=-2 max=6 label="x < 3" caption="Open dot: 3 is left out."
RIGHT: Strict < and > get an open dot. Only ≤ and ≥ get a closed dot.
:::

::: example Worked Example 2 — The boundary on the right side
Graph 4 > x.
Step 1: Read it with x first: [[x < 4]].
Step 2: The dot at 4 is [[open]], because < is strict.
Step 3: The ray goes [[left]].
@viz iqline value=4 dir=left closed=0 blank=1 min=-1 max=8 label="4 > x"
:::

::: example Worked Example 3 — Fractions and decimals
Graph x ≥ 1.5. The boundary sits halfway between 1 and 2.
@viz iqline value=1.5 dir=right closed=1 min=-2 max=5 step=0.5 every=1 label="x ≥ 1.5"
Graph y < −{1/2}. The boundary is between −1 and 0.
@viz iqline value=-0.5 dir=left closed=0 min=-3 max=2 step=0.5 every=1 label="y < −½"
Test 0 in y < −{1/2}. Is 0 < −{1/2}? [[No]]. So the ray must not cover 0. ✓
:::

::: example Worked Example 4 — Write it from the graph
@viz iqline value=-2 dir=right closed=1 min=-6 max=3 label="?"
Step 1: The boundary is [[−2]].
Step 2: The dot is closed, so the symbol has a line under it.
Step 3: The ray goes right, so x is greater. The inequality is [[x ≥ −2]].
:::
::: explain
A graph has an open dot at 5 and a ray to the left. Why is it x < 5 and not x ≤ 5?
(lines 2)
=> The open dot means 5 is not a solution. ≤ would include 5. So the symbol is strict: x < 5.
:::

::: try
1. Graph x < 1. [[open dot at 1, ray left]]
@viz iqline value=1 dir=left closed=0 blank=1 min=-4 max=5
2. Graph x ≥ −3. [[closed dot at −3, ray right]]
@viz iqline value=-3 dir=right closed=1 blank=1 min=-6 max=3
3. Graph −2 < x. [[x > −2: open dot at −2, ray right]]
@viz iqline value=-2 dir=right closed=0 blank=1 min=-6 max=3
4. Write the inequality. [[x ≤ 2.5]]
@viz iqline value=2.5 dir=left closed=1 min=-1 max=5 step=0.5 every=1
5. Max graphed x > 4 with a ray to the left. Fix it. [[Numbers greater than 4 are to the right. Keep the open dot. Ray right.]]
:::
::: retrieval
1. Write in symbols: n is at least 12.
=> n ≥ 12
2. Is −4 ≥ −4 true?
=> Yes. −4 equals −4.
3. Write −7 < m with m first.
=> m > −7
4. Find {2/3} of 15.
=> 10
5. ★ Stretch: x ≥ 0 and x < 0 are graphed on one line. Which numbers are on neither graph?
=> None. Every number is either less than 0 or at least 0. The open dot of x < 0 and the closed dot of x ≥ 0 meet at 0.
:::

## Section 3: Checking solutions
Learning target: I can check if a number is a solution by putting it in.

### Vocabulary
- substitute :: put a number in for the variable :: x = 4 in 2x + 1 gives 2(4) + 1 = 9
- test value :: a number you try in the inequality :: test 0, the boundary, and one number on each side

#### Put it in and compare
Is x = 4 a solution of 2x + 1 > 7? Put 4 in for x.
@viz flow steps="2x + 1 > 7|2(4) + 1 > 7|9 > 7|True: 4 is a solution"
The left side is 9. 9 is greater than 7. So 4 is a solution.
Now try x = 2. 2(2) + 1 = 5. Is 5 > 7? No. So 2 is not a solution.
@viz iqline value=3 dir=right closed=0 min=-1 max=7 label="2x + 1 > 7" marks="2:2 ✗;4:4 ✓"

::: key Checking a solution
1. Substitute the number for the variable.
2. Work out each side.
3. Ask: is the statement true? True means it is a solution.
Test the boundary too. It decides open or closed.
:::

::: example Worked Example 1 — Test the boundary
Is x = 3 a solution of 2x + 1 ≥ 7? Is it a solution of 2x + 1 > 7?
Step 1: 2(3) + 1 = [[7]].
Step 2: 7 ≥ 7 is true. So 3 is a solution of 2x + 1 ≥ 7.
Step 3: 7 > 7 is [[false]]. So 3 is not a solution of 2x + 1 > 7.
@viz iqline value=3 dir=right closed=1 min=-1 max=7 label="2x + 1 ≥ 7" marks="3:7 ≥ 7 ✓"
:::

::: example Worked Example 2 — Negatives
Is x = −2 a solution of 3 − x < 4?
Step 1: Substitute: 3 − (−2) = 3 + 2 = [[5]].
Step 2: Is 5 < 4? [[No]].
Step 3: So −2 is [[not a solution]].
@viz numberline min=-1 max=7 step=1 points="5:5;4:4" ends="less,greater" caption="5 is to the right of 4, so 5 > 4."
:::

::: example Worked Example 3 — Fractions and decimals
Which are solutions of 4x ≤ 2? Test {1/4}, {1/2} and 0.6.
| x | 4x | Is 4x ≤ 2? |
|---|---|---|
| {1/4} | 1 | Yes |
| {1/2} | [[2]] | [[Yes: 2 ≤ 2]] |
| 0.6 | [[2.4]] | [[No]] |
@viz iqline value=0.5 dir=left closed=1 min=-1 max=2 step=0.25 every=0.5 label="4x ≤ 2" blank=1 marks="0.25:¼;0.5:½;0.6:0.6"
:::

::: misconception
WRONG: "x = 5 works in x + 2 > 4. So every number works."
WHY: One test only tells you about that number. Try 1: 1 + 2 = 3. 3 > 4 is false.
@viz iqline value=2 dir=right closed=0 min=-2 max=7 label="x + 2 > 4" marks="1:1 ✗;5:5 ✓"
RIGHT: Test numbers on both sides of the boundary. Test the boundary itself too.
:::

::: example Worked Example 4 — Does the graph match?
Jo says the graph of 10 > 2x is the one below. Test it.
@viz iqline value=5 dir=left closed=0 min=0 max=9 label="10 > 2x" marks="2:test 2;7:test 7"
Step 1: Test 2 (on the ray): 2(2) = 4. Is 10 > 4? [[Yes]] ✓
Step 2: Test 7 (off the ray): 2(7) = 14. Is 10 > 14? [[No]] ✓
Step 3: Test 5 (the boundary): 2(5) = 10. Is 10 > 10? [[No]], so the dot is [[open]].
The graph matches.
:::
::: explain
Why should you test the boundary as well as one number on the ray?
(lines 2)
=> The boundary test shows if the dot is open or closed. The ray test shows the direction.
:::

::: try
1. Is x = 6 a solution of 3x − 5 > 12? [[3(6) − 5 = 13. 13 > 12. Yes.]]
2. Is x = −1 a solution of 2x + 7 ≥ 5? [[2(−1) + 7 = 5. 5 ≥ 5. Yes.]]
3. Is x = −1 a solution of 2x + 7 > 5? [[5 > 5 is false. No.]]
4. Which are solutions of 0.5x < 3? Test 4, 6 and 7.5. [[4: 2 < 3 yes. 6: 3 < 3 no. 7.5: 3.75 < 3 no.]]
@viz iqline value=6 dir=left closed=0 blank=1 min=0 max=9 marks="4:4;6:6;7.5:7.5"
5. Is y = {1/3} a solution of 6y + 1 ≤ 3? [[6 × {1/3} = 2. 2 + 1 = 3. 3 ≤ 3. Yes.]]
6. Ali says 9 is a solution of 20 − x > 12. Check. [[20 − 9 = 11. 11 > 12 is false. He is wrong.]]
:::
::: retrieval
1. Graph x ≤ 0. Is the dot open or closed?
=> Closed dot at 0, ray left.
2. Write "y is no more than 4.5" in symbols.
=> y ≤ 4.5
3. Find −3x + 2 when x = −4.
=> −3(−4) + 2 = 12 + 2 = 14
4. Solve {1/2}x + 1 = 4.
=> × 2: x + 2 = 8. x = 6.
5. ★ Stretch: Find a fraction that makes 2x > 1 true. It must make 2x > 2 false.
=> Answers vary. For example {3/4}: 2 × {3/4} = 1.5. 1.5 > 1 is true, but 1.5 > 2 is false.
:::

## Section 4: Real-world inequalities
Learning target: I can write an inequality for a real situation and check it.

### Vocabulary
- limit :: the most or the least that is allowed :: a speed limit of 30 km/h
- minimum :: the least allowed: use ≥ :: minimum age 16: a ≥ 16
- maximum :: the most allowed: use ≤ :: maximum load 1000 kg: w ≤ 1000
- whole-number solution :: only whole numbers make sense, so the graph is dots :: people, tickets, buses

#### From a sign to symbols
@viz flow steps="Let x = …|Find the boundary|At least, at most, more, less?|Write the symbol|Test a number" width=660
@viz iqsign kind=speed value=30 top="PLAYGROUND" unit="km/h" caption="A playground zone in Edmonton."
In a playground zone, speed s must be at most 30 km/h. So [[s ≤ 30]].

| Situation | Variable | Inequality |
|---|---|---|
| Drive in Alberta: at least 16 years old | a = age | a ≥ 16 |
| Vote in Canada: 18 or older | a = age | [[a ≥ 18]] |
| Below freezing | t = temperature (°C) | [[t < 0]] |
| Spend no more than $40 | c = cost ($) | [[c ≤ 40]] |
| Minimum wage: $15 an hour or more | w = wage ($/h) | [[w ≥ 15]] |

::: example Worked Example 1 — An elevator
An elevator can carry at most 1000 kg.
@viz iqsign kind=limit top="ELEVATOR" value="1000 kg" unit="MAXIMUM LOAD"
Step 1: Let w = the mass in kilograms.
Step 2: "At most" means ≤. So [[w ≤ 1000]].
Step 3: Is 980 kg safe? [[980 ≤ 1000, yes]]. Is 1050 kg? [[No]].
@viz iqline value=1000 dir=left closed=1 min=900 max=1100 step=25 every=50 label="[[w ≤ 1000]]"
:::

::: example Worked Example 2 — A budget
Movie tickets cost $12 each. Ava can spend no more than $40. How many tickets can she buy?
Step 1: Let n = the number of tickets. The cost is 12n. So [[12n ≤ 40]].
Step 2: Test values.
| n | 12n | 12n ≤ 40? |
|---|---|---|
| 2 | 24 | Yes |
| 3 | [[36]] | [[Yes]] |
| 4 | [[48]] | [[No]] |
Step 3: n is a whole number. She can buy [[0, 1, 2 or 3]] tickets.
@viz iqline value=0 dir=right closed=1 whole=1 blank=dir nodot=1 min=0 max=6 label="n" caption="Whole numbers only: dots, not a ray."
:::

::: misconception
WRONG: "The ride needs riders at least 122 cm tall. So h < 122."
WHY: At least 122 means 122 or taller. A 130 cm rider can ride. A 115 cm rider cannot.
@viz iqsign kind=height value=122
RIGHT: h ≥ 122. Test 130: 130 ≥ 122 is true. ✓
:::

::: misconception
WRONG: "At most 12 people fit in the van. Draw a ray to the left of 12."
WHY: A ray would include 11.5 people and −3 people. People come in whole numbers, from 0 up.
@viz people n=12 cols=6 label="12 seats"
RIGHT: The solutions are the dots 0, 1, 2, … , 12.
@viz iqline value=12 dir=left closed=1 whole=1 nodot=1 min=0 max=12 label="p ≤ 12"
:::

::: example Worked Example 3 — Any number or whole numbers?
| Situation | Inequality | Kind of numbers | Graph |
|---|---|---|---|
| Distance you can walk: under 5 km | d < 5 | [[any number from 0]] | [[a ray]] |
| Students on a trip: more than 20 | s > 20 | [[whole numbers]] | [[dots]] |
| Temperature: above −10 °C | t > −10 | [[any number]] | [[a ray]] |
@viz thermo min=-20 max=10 step=5 values="-10" labels="−10 °C"
:::
::: explain
"More than 20 students" gets dots. "Under 5 km" gets a ray. Why?
(lines 2)
=> Students come in whole numbers, so only 21, 22, 23, … work. A distance can be any number, like 2.75 km.
:::

::: try
1. A bridge sign says the truck must be under 4.2 m tall. Write the inequality. [[h < 4.2]]
2. Kai is at least 13 years old. Write it. Graph it. [[a ≥ 13: closed dot at 13, ray right]]
@viz iqline value=13 dir=right closed=1 blank=1 min=10 max=18
3. Sam earns $16.50 an hour. Does that meet a minimum wage of $15? [[16.50 ≥ 15. Yes.]]
4. Bus tickets cost $3.50. Lin has $20. Write an inequality for n tickets. Test n = 5 and n = 6. [[3.5n ≤ 20. 5: 17.50 ≤ 20 yes. 6: 21 ≤ 20 no. She can buy up to 5.]]
5. A Calgary forecast says the low will be below −8 °C. Is −8 a possible low? Is −11? [[t < −8. −8 is not (−8 < −8 is false). −11 is.]]
@viz thermo min=-15 max=0 step=5 values="-8,-11" labels="−8;−11"
:::
::: retrieval
1. Graph y > −1.
=> Open dot at −1, ray right.
2. Is x = 2.5 a solution of 4x − 3 ≤ 7?
=> 4(2.5) − 3 = 7. 7 ≤ 7. Yes.
3. Write 0 ≥ k with k first.
=> k ≤ 0
4. Solve 0.3x + 1 = 2.5.
=> × 10: 3x + 10 = 25. 3x = 15. x = 5.
5. ★ Stretch: A ride needs riders at least 107 cm and under 137 cm. Is 137 cm allowed? Is 107 cm?
=> 137 is not (137 < 137 is false). 107 is (107 ≥ 107 is true).
:::

## Unit Synthesis
1. Write in symbols: t is no less than −5.
@viz iqline value=-5 dir=right closed=1 min=-8 max=0 label="[[t ≥ −5]]"
=> t ≥ −5
2. Write 8 ≤ x with x first. Then graph it.
=> x ≥ 8. Closed dot at 8, ray right.
3. Is x = −3 a solution of 5 − 2x > 10? Show your test.
=> 5 − 2(−3) = 5 + 6 = 11. 11 > 10. Yes.
4. Highway 2 has a limit of 110 km/h. Write it. Is 112 km/h legal?
=> s ≤ 110. 112 ≤ 110 is false. No.
5. Mia says x < 4 has a closed dot because 4 is in the inequality. Explain her mistake.
=> 4 < 4 is false, so 4 is not a solution. The dot is open.
6. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key The four symbols
< less than · > greater than (strict: boundary out).
≤ at most, no more than · ≥ at least, no less than (non-strict: boundary in).
x ≥ a means x > a or x = a. 3 < x is the same as x > 3.
:::
@viz iqsign kind=speed value=110 caption="s ≤ 110"

::: key On a number line
Open dot ○ for < and >. Closed dot ● for ≤ and ≥.
Ray right for greater. Ray left for less.
:::
@viz iqline value=2 dir=right closed=0 min=-3 max=7 label="x > 2"
@viz iqline value=2 dir=left closed=1 min=-3 max=7 label="x ≤ 2"

::: key Checking a solution
Substitute. Work out each side. True means it is a solution.
Test the boundary, a number on the ray, and a number off the ray.
:::
@viz iqline value=3 dir=right closed=1 min=-1 max=7 label="2x + 1 ≥ 7" marks="3:✓ boundary;1:✗;5:✓"

::: key Real situations
Let x = … At least → ≥. At most, no more than → ≤. Over, more than → >. Under, below → <.
Whole things (people, tickets) → dots. Amounts (km, °C, kg) → a ray.
:::
@viz iqline value=3 dir=left closed=1 whole=1 min=0 max=6 label="n ≤ 3"

| Mistake | Fix |
|---|---|
| x < 3 includes 3 | 3 < 3 is false: open dot. |
| x > 2 points left | Greater is to the right. |
| At least means less | At least means ≥. |
| 3 < x means x < 3 | Read left to right: x > 3. |
| A ray for people | Whole numbers: dots. |
