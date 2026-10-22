---
title: Multiplying and Dividing Integers
topic: integers
strand: number
---
<!-- Gate: progressive blanking confirmed. Refutation-first on: "two negatives make a positive, so −3 + (−4) = 7" (IN2),
     "the answer takes the sign of the bigger number" (IN2).
     Section order: × with models (IN1) → sign rules from patterns (IN2) → ÷ as the inverse (IN3) → order of operations and problems (IN4).
     Codes IN1–IN4. Outcome N7. -->

## Pre-Knowledge Check
1. What is −3 + (−4)? What is −3 + 4?
2. The temperature is −5 °C. It drops 3 degrees. What is it now?
3. What do you think (−2) × 3 is? Why?

## Section 1: Multiplying with models
Learning target: I can show the product of two integers with counters or a number line.

### Vocabulary
- integer :: a whole number, its opposite, or zero :: …, −2, −1, 0, 1, 2, …
- zero pair :: one positive and one negative counter; together they make 0 :: (+1) + (−1) = 0
- product :: the answer to a multiplication :: the product of 3 and −2 is −6

Yellow counters are **positive** (+1). Red counters are **negative** (−1).

@viz counters pos=3 neg=3 pairs=3 caption="Each yellow + red pair is a zero pair: together they are worth 0."

#### Positive × negative: groups
3 × (−2) means **3 groups of −2**.

@viz counters groups=3 each=-2 result="3 × (−2) = [[−6]]"

The same thing on a number line: 3 jumps of −2, starting at 0.

@viz numberline min=-8 max=2 jumps="0>-2>-4>-6" jumplabels="−2,−2,−2" caption="3 jumps of −2 land on −6."

::: example Worked Example 1 — A temperature drop
In Edmonton, the temperature drops 4 °C every hour for 3 hours. What is the total change?
3 × (−4) = [[−12]]
The temperature changes by [[−12]] °C. It is 12 degrees colder.
@viz numberline min=-14 max=2 step=1 every=2 jumps="0>-4>-8>-12" jumplabels="−4,−4,−4" ends="colder,warmer"
:::

::: explain
Why do we multiply 3 × (−4) and not 3 × 4?
(lines 2)
=> The change each hour is a drop, so it is negative (−4). Three hours means three groups of −4.
:::

#### Negative × positive or negative: take away groups
(−3) × 2 means **take away 3 groups of +2**. Start with zero pairs so there is something to take away.

::: example Worked Example 2 — (−3) × 2
Start with 6 zero pairs (worth 0).
Take away 3 groups of +2 (6 yellow counters).
@viz counters groups=-3 each=2 result="(−3) × 2 = [[−6]]"
What is left? 6 red counters. (−3) × 2 = [[−6]]
:::

::: example Worked Example 3 — (−3) × (−2)
Start with 6 zero pairs.
Take away 3 groups of −2 (6 red counters).
@viz counters groups=-3 each=-2 result="(−3) × (−2) = [[+6]]"
What is left? 6 yellow counters. (−3) × (−2) = [[+6]]
:::

::: explain
Why did we start with zero pairs in Worked Examples 2 and 3?
(lines 2)
=> We needed counters to take away, but we did not want to change the value. Zero pairs add counters but are worth 0.
:::

::: try
Use counters or a number line. Draw your model.
a) 4 × (−3) = [[−12]]
(work 2)
b) (−2) × 5 = [[−10]]
(work 2)
c) (−2) × (−4) = [[8]]
(work 2)
:::

::: retrieval
1. What does 2 × (−5) mean in words?
=> 2 groups of −5.
2. Draw a number line for 4 × (−2).
@viz numberline min=-10 max=2
=> Four jumps of −2 from 0: lands on −8.
3. What is a zero pair? Why is it useful?
=> One + and one − counter, worth 0. You can add zero pairs without changing the value, so you have counters to take away.
4. A diver goes down 3 m every second for 5 seconds. Write a multiplication and find the change in depth.
=> 5 × (−3) = −15. The diver is 15 m lower.
5. ★ Stretch: Use counters to explain why (−4) × (−1) is positive.
=> Start with 4 zero pairs. Take away 4 groups of −1 (4 red). 4 yellow are left: +4.
:::

## Section 2: Sign rules
Learning target: I can use a pattern to explain the sign rules for multiplying integers.

### Vocabulary
- sign :: positive (+) or negative (−) :: the sign of −6 is negative
- pattern :: something that repeats in a predictable way :: 6, 4, 2, 0, −2…

#### Find the pattern
The first number goes down by 1 each time. Watch what happens to the answer.
| Multiplication | Answer |
|---|---|
| 3 × (−2) | −6 |
| 2 × (−2) | −4 |
| 1 × (−2) | [[−2]] |
| 0 × (−2) | [[0]] |
| (−1) × (−2) | [[2]] |
| (−2) × (−2) | [[4]] |
Each answer goes **up by 2**. So the pattern keeps going past zero into the [[positive]] numbers.

@viz coord xmin=-3 xmax=3 ymin=-6 ymax=6 ystep=1 yevery=2 points="3,-6;2,-4;1,-2;0,0;-1,2;-2,4;-3,6" xlabel="first number" ylabel="answer" caption="The pattern keeps going up by 2 past zero."

::: key Sign rules for × (and ÷)
| Signs | Answer |
|---|---|
| (+) × (+) | [[positive]] |
| (−) × (−) | [[positive]] |
| (+) × (−) | [[negative]] |
| (−) × (+) | [[negative]] |
**Count the negatives.** An even number of negatives → positive. An odd number → negative.
:::

::: misconception
WRONG: "Two negatives make a positive, so −3 + (−4) = 7."
WHY: That rule is for multiplying and dividing. For adding, two negatives make a bigger negative.
RIGHT: −3 + (−4) = −7 (adding). (−3) × (−4) = +12 (multiplying).
@viz numberline min=-8 max=2 jumps="0>-3>-7" jumplabels="−3,−4" caption="Adding: −3 then −4 more lands on −7."
:::

::: misconception
WRONG: "The answer takes the sign of the bigger number, so (−2) × 6 is positive."
WHY: That idea comes from adding integers. When you multiply, the size of the numbers does not decide the sign.
RIGHT: Count the negative signs. (−2) × 6 = −12 (one negative). (−2) × (−6) = +12 (two negatives).
:::

::: example Worked Example 4 — Three numbers
(−2) × 3 × (−5)
Count the negatives: [[2]] (even) → the answer is [[positive]].
Multiply the sizes: 2 × 3 × 5 = 30
Answer: [[+30]]
:::

::: explain
Why does an even number of negatives give a positive answer?
(lines 2)
=> Every pair of negatives multiplies to a positive, so if all the negatives pair up, nothing negative is left.
:::

::: try
a) (−7) × 6 = [[−42]]
b) (−8) × (−3) = [[24]]
c) 9 × (−4) = [[−36]]
d) (−1) × (−1) × (−1) = [[−1]]
e) (−2) × (−2) × (−2) × (−2) = [[16]]
:::

::: retrieval
1. What is the sign of (−4) × (−9)? Why?
=> Positive. Two negatives (even).
2. Find (−5) × 7.
=> −35
3. Kai says −5 + (−5) = 10 "because two negatives make a positive." Fix his work.
=> −5 + (−5) = −10. The sign rule is only for × and ÷.
4. Find (−3) × 2 × (−1) × (−4).
=> Three negatives → negative. 3 × 2 × 1 × 4 = 24. Answer −24.
5. ★ Stretch: Continue the pattern 3 × (−4), 2 × (−4), 1 × (−4), … to show that (−2) × (−4) = 8.
=> −12, −8, −4, 0, 4, 8. Each step adds 4, so (−1) × (−4) = 4 and (−2) × (−4) = 8.
:::

## Section 3: Dividing integers
Learning target: I can divide integers and use the sign rules for division.

### Vocabulary
- quotient :: the answer to a division :: (−12) ÷ 3 = −4, the quotient is −4
- inverse :: an operation that undoes another :: ÷ undoes ×
- dividend / divisor :: the number being divided / the number you divide by :: in −12 ÷ 3, −12 is the dividend

Division undoes multiplication. If 3 × (−4) = −12, then (−12) ÷ 3 = [[−4]].

::: example Worked Example 5 — Sharing: (−12) ÷ 3
A debt of $12 is shared by 3 friends. How much does each owe?
Split 12 red counters into 3 equal groups.
@viz counters groups=3 each=-4 result="(−12) ÷ 3 = [[−4]]"
Each friend owes $4: (−12) ÷ 3 = [[−4]]
:::

::: example Worked Example 6 — How many groups: (−12) ÷ (−3)
How many groups of −3 make −12?
@viz numberline min=-14 max=2 step=1 every=2 jumps="0>-3>-6>-9>-12" jumplabels="−3,−3,−3,−3"
[[4]] groups of −3 make −12. So (−12) ÷ (−3) = [[4]]
:::

::: explain
Check Worked Example 6 with multiplication. What do you multiply?
(lines 2)
=> 4 × (−3) = −12. ✓ The quotient times the divisor gives the dividend.
:::

::: key Sign rules for ÷
Same as ×. Same signs → [[positive]]. Different signs → [[negative]].
(+) ÷ (+) = + · (−) ÷ (−) = + · (+) ÷ (−) = − · (−) ÷ (+) = −
:::

::: try
a) (−20) ÷ 5 = [[−4]]
b) (−36) ÷ (−9) = [[4]]
c) 48 ÷ (−6) = [[−8]]
d) (−75) ÷ 15 = [[−5]] (use a calculator if you need to)
e) The temperature fell 18 °C in 6 hours. What was the change per hour? [[(−18) ÷ 6 = −3 °C per hour]]
:::

::: retrieval
1. Find (−56) ÷ 8.
=> −7
2. Find (−45) ÷ (−5).
=> 9
3. Write the multiplication that checks (−42) ÷ 6 = −7.
=> (−7) × 6 = −42
4. A stock lost $96 over 12 days. What was the average change per day?
=> (−96) ÷ 12 = −8. It lost $8 per day.
5. ★ Stretch: Use the multiplication 4 × (−5) = −20 to write two division facts.
=> (−20) ÷ 4 = −5 and (−20) ÷ (−5) = 4.
:::

## Section 4: Order of operations and problems
Learning target: I can use the order of operations with integers and solve integer problems.

### Vocabulary
- order of operations :: Brackets, Exponents, Divide and Multiply (left to right), Add and Subtract (left to right) :: BEDMAS
- mean :: add the values, then divide by how many there are :: the mean of −2, 0, 5 is 1

@viz flow steps="Brackets|Exponents|× and ÷ (left to right)|+ and − (left to right)"

::: example Worked Example 7 — Use the order
(−3) × 4 + (−10) ÷ 2
Step 1: × and ÷ first. (−3) × 4 = [[−12]] and (−10) ÷ 2 = [[−5]]
Step 2: Add. −12 + (−5) = [[−17]]
:::

::: explain
Why can't we start with 4 + (−10)?
(lines 2)
=> Multiplication and division come before addition, so we must do (−3) × 4 and (−10) ÷ 2 first.
:::

::: example Worked Example 8 — Mean temperature
Lake Louise had these low temperatures over 5 days: −8 °C, −12 °C, −5 °C, 0 °C, −10 °C.
Add: −8 + (−12) + (−5) + 0 + (−10) = [[−35]]
Divide by 5: (−35) ÷ 5 = [[−7]]
The mean low was [[−7]] °C.
@viz numberline min=-14 max=2 step=1 every=2 points="-12:Tue;-10:Fri;-8:Mon;-5:Wed;0:Thu" keypoints="-7:mean" ends="colder,warmer"
:::

::: explain
Why is the mean negative?
(lines 2)
=> Most of the temperatures were below zero, so their total is negative, and a negative divided by a positive is negative.
:::

::: try
a) 5 + (−2) × 3 = [[−1]]
b) (−4 − 2) × (−3) = [[18]]
c) (−24) ÷ (−6) − 7 = [[−3]]
d) A Calgary chinook raised the temperature from −18 °C to 6 °C in 4 hours. What was the mean change per hour?
(work 2)
=> Change = 6 − (−18) = 24. 24 ÷ 4 = +6 °C per hour.
:::

::: retrieval
1. Find 10 − 3 × (−2).
=> 10 − (−6) = 16
2. Find [(−5) + (−3)] ÷ 2.
=> (−8) ÷ 2 = −4
3. Find the mean of −6, 4, −10 and 0.
=> (−12) ÷ 4 = −3
4. Lee did 2 + (−3) × 4 as (−1) × 4 = −4. What went wrong?
=> He added first. Multiply first: (−3) × 4 = −12, then 2 + (−12) = −10.
5. ★ Stretch: Use four of the integers −3, 2, −5 and 4 with any operations and brackets to make 26.
=> One answer: (−3) × (−5) × 2 − 4 = 30 − 4 = 26. Other answers are possible; check each with the order of operations.
:::

## Unit Synthesis
1. Use counters to show 3 × (−4) and (−3) × (−4). Explain the difference.
(work 3)
=> 3 groups of −4 = −12. Take away 3 groups of −4 from 12 zero pairs leaves +12.
2. Explain the sign rules for × and ÷ in your own words.
=> Count the negative signs. Even → positive. Odd → negative.
3. Explain why "two negatives make a positive" is not true for −2 + (−3).
=> For adding, you move further below zero: −5. The rule only works for × and ÷.
4. Look back at your first page. What would you change now?
=> Answers vary.

## Concept Reference
::: key Multiplying with models
3 × (−2) = 3 groups of −2 = −6. (−3) × (−2): start with zero pairs and take away 3 groups of −2 → +6.
:::
@viz counters groups=3 each=-2 result="3 × (−2) = −6"

::: key Sign rules (× and ÷)
Same signs → positive. Different signs → negative. Many numbers: count the negatives (even → +, odd → −).
(−3) × (−4) = 12 · (−20) ÷ 5 = −4 · (−36) ÷ (−9) = 4
:::

::: key Order of operations
Brackets → Exponents → × and ÷ (left to right) → + and − (left to right).
(−3) × 4 + (−10) ÷ 2 = −12 + (−5) = −17
:::

| Mistake | Fix |
|---|---|
| −3 + (−4) = 7 | Adding: −7. The sign rule is only for × and ÷. |
| The sign comes from the bigger number | Count the negative signs. |
| 2 + (−3) × 4 = −4 | Multiply first: 2 + (−12) = −10 |
