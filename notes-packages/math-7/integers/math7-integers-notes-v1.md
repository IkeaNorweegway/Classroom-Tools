---
title: Integers
topic: integers
strand: number
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "two negatives make a positive" for adding.
     That is −3 + (−4) = 7 (IN1, again in IN3).
     "Adding always makes it bigger" (IN1). "Subtracting always makes it smaller" (IN2).
     "The answer takes the sign of the bigger number" for × (IN3). "Dividing always makes it smaller" (IN4).
     Section order: adding with chips and jumps (IN1). Then subtracting, because a − b = a + (−b) needs adding (IN2).
     Then multiplying as groups (repeated adding) and the pattern (IN3). Then dividing as the undo of × (IN4).
     Outcomes 7N2.1 (IN1, IN2) and 7N2.2 (IN3, IN4). -->

## Pre-Knowledge Check
1. Which is colder: −7 °C or −2 °C? How do you know?
2. What is the opposite of −6?
3. Find |−9|.
4. Put −4, 3, 0 and −1 on a number line.
5. Find 6 × 7 and 56 ÷ 8.
6. It is 4 °C. The temperature drops 6 degrees. What is it now?

## Section 1: Adding integers
Learning target: I can add integers with chips, a number line and a rule.

### Vocabulary
- integer :: a whole number, its opposite, or zero :: …, −2, −1, 0, 1, 2, …
- chip :: a counter. Yellow is +1. Red is −1. :: 3 red chips show −3
- zero pair :: one + chip and one − chip. Together they make 0. :: (+1) + (−1) = 0
- sum :: the answer when you add :: The sum of −3 and 5 is 2.

We will use two tools: **chips** and **jumps** on a number line.
A yellow chip is +1. A red chip is −1.
One yellow and one red make a **zero pair**. Together they are worth 0.
@viz counters pos=1 neg=1 pairs=1 caption="A zero pair: +1 and −1 make 0."

Adding means **put the chips together**.
Then take out the zero pairs. What is left is the answer.

::: example Worked Example 1 — A cold night
At 9 pm it is −3 °C. By midnight it drops 4 more degrees.
Write it: −3 + (−4)
Step 1: Show 3 red chips. Add 4 more red chips.
@viz counters neg=7 result="−3 + (−4) = −7" caption="All red. No zero pairs."
Step 2: Count the chips. 7 red chips make −7.
On a number line: start at −3. Jump 4 to the left.
@viz numberline min=-8 max=2 points="-3:start" jumps="-3>-7" jumplabels="+(−4)" ends="colder,warmer"
So −3 + (−4) = −7. It is −7 °C at midnight.
:::
::: misconception
WRONG: "Two negatives make a positive. So −3 + (−4) = 7."
WHY: That rule is for × and ÷. Adding red chips gives you more red chips.
@viz numberline min=-8 max=2 jumps="0>-3>-7" jumplabels="−3,−4" caption="Two steps to the left. You end up further left."
RIGHT: −3 + (−4) = −7. Adding two negatives makes a bigger negative.
:::
::: example Worked Example 2 — Different signs: −5 + 3
Step 1: Show 5 red chips and 3 yellow chips.
Step 2: Circle the zero pairs. There are 3.
@viz counters pos=3 neg=5 pairs=3 result="−5 + 3 = [[−2]]"
Step 3: The zero pairs are worth 0. Two red chips are left.
On a number line: start at −5. Jump 3 to the right.
@viz numberline min=-6 max=2 points="-5:start" jumps="-5>-2" jumplabels="+3"
So −5 + 3 = [[−2]].
:::
::: explain
In Worked Example 2, why can we ignore the circled chips?
(lines 2)
=> Each circled pair is +1 and −1. That is 0, and adding 0 changes nothing.
:::
::: example Worked Example 3 — A bank deposit
Sam's bank balance is −$20. That means he owes $20.
He puts in (deposits) $50. What is his balance now?
Write it: −20 + 50
@viz vjumps min=-30 max=40 step=10 prefix="$" zero="" jumps="-20>30" jumplabels="+$50" above="has money" below="owes money" points="-20:before: −$20;30:after: [[$30]]" height=200
Start at −20. Go up 50. You pass 0 and stop at [[30]].
His balance is not negative any more.
:::

#### The rule for adding
Chips always work. With big numbers, a rule is faster.
::: key Adding integers
**Same signs:** add the sizes. Keep the sign.
−8 + (−6) = −14 · 8 + 6 = 14
**Different signs:** subtract the sizes (big − small).
Keep the sign of the number further from 0.
−12 + 15 = 3 · 12 + (−15) = −3
:::
@viz numberline min=-14 max=6 step=1 every=2 points="-12:start" jumps="-12>3" jumplabels="+15" caption="A chinook in Calgary: −12 °C, then 15 degrees warmer. That is 3 °C."

::: misconception
WRONG: "Adding always makes a number bigger."
WHY: Adding a negative moves you left. Left is smaller.
@viz numberline min=0 max=7 points="5:start" jumps="5>2" jumplabels="+(−3)"
RIGHT: 5 + (−3) = 2. The answer 2 is less than 5.
:::
::: try
1. Write the addition for these chips. Then find the sum.
@viz counters pos=2 neg=6 pairs=2
[[−6 + 2]] = [[−4]]
2. Find each sum.
a) 6 + (−2) = [[4]]
b) −4 + (−5) = [[−9]]
c) −8 + 3 = [[−5]]
d) −7 + 7 = [[0]]
e) −15 + 20 = [[5]]
:::
::: retrieval
1. Which is greater: −9 or −4?
=> −4. It is further right on the number line.
2. Find |−11| + |4|.
=> 11 + 4 = 15
3. Find −6 + (−6).
=> −12. Same signs: add 6 + 6 and keep the negative sign.
4. Kai says −2 + (−5) = 7. Fix his mistake.
=> −2 + (−5) = −7. "Two negatives make a positive" is for ×, not +.
5. ★ Stretch: Find two integers with a sum of −3. One must be positive.
=> One answer: 2 + (−5) = −3. Many answers work.
:::

## Section 2: Subtracting integers
Learning target: I can subtract integers with chips, a number line and a rule.

### Vocabulary
- difference :: the answer when you subtract :: The difference 5 − 8 is −3.
- negative sign :: a − that is part of a number. It means "less than 0". :: −3 (negative three)
- minus sign :: a − between two numbers. It means "subtract". :: 5 − 3 (five minus three)

#### The − sign has two jobs
A **negative sign** tells you a place. −3 is 3 left of 0.
A **minus sign** tells you to subtract. It is an action.
@viz numberline min=-5 max=6 points="-3:−3 is a place" jumps="5>2" jumplabels="− 3 is a move" caption="Same symbol, two jobs."

| Write it | Say it |
|---|---|
| 5 − 3 | five **minus** three |
| −5 | **negative** five |
| 5 − (−3) | five **minus negative** three |
| −5 − (−3) | [[negative five minus negative three]] |

#### Subtract means take away
To subtract, take chips away.
::: example Worked Example 1 — −6 − (−2)
Step 1: Show −6 with 6 red chips.
Step 2: Take away 2 red chips.
@viz chips neg=6 xneg=2 result="−6 − (−2) = [[−4]]"
Step 3: Four red chips are left. So −6 − (−2) = [[−4]].
:::
::: example Worked Example 2 — 2 − (−3)
Step 1: Show 2 with 2 yellow chips.
@viz chips pos=2 title="Take away 3 red chips? There are none!"
Step 2: Add 3 zero pairs. They are worth 0, so the value is still 2.
Step 3: Now take away 3 red chips.
@viz chips pos=2 add=3 xneg=3 result="2 − (−3) = [[5]]"
Step 4: Count what is left: [[5]] yellow chips. So 2 − (−3) = [[5]].
:::
::: explain
In Worked Example 2, why can we add zero pairs?
(lines 2)
=> A zero pair is worth 0. Adding 0 does not change the value, but it gives us red chips to take away.
:::
::: example Worked Example 3 — −2 − 3
Step 1: Show −2 with 2 red chips. There are no yellow chips to take.
Step 2: Add [[3]] zero pairs. Then take away 3 yellow chips.
@viz chips neg=2 add=3 xpos=3 result="−2 − 3 = [[−5]]"
Step 3: Five red chips are left. So −2 − 3 = [[−5]].
:::

#### Subtracting is adding the opposite
Look at Worked Examples 2 and 3 again.
2 − (−3) = 5, and 2 + 3 = 5.
−2 − 3 = −5, and −2 + (−3) = [[−5]].
@viz numberline min=-1 max=6 points="2:start" jumps="2>5" jumplabels="+3" caption="2 − (−3) lands in the same place as 2 + 3."

::: key a − b = a + (−b)
To subtract, add the opposite.
@viz flow steps="Keep the first number|Change − to +|Use the opposite of the second|Add"
7 − (−4) = 7 + 4 = 11
−3 − 6 = −3 + (−6) = −9
:::
::: misconception
WRONG: "Subtracting always makes a number smaller."
WHY: Taking away a negative takes away something below 0. What is left goes up.
@viz numberline min=-1 max=6 points="2:start" jumps="2>5" jumplabels="− (−3)"
RIGHT: 2 − (−3) = 2 + 3 = 5. The answer 5 is bigger than 2.
:::
::: example Worked Example 4 — A chinook in Calgary
At 7 am it was −15 °C. At 3 pm it was 9 °C. How much warmer did it get?
To find a change, do **end − start**.
Step 1: Write it: 9 − (−15)
Step 2: Add the opposite: 9 + [[15]] = [[24]]
@viz vjumps min=-20 max=15 step=5 unit=" °C" zero="0 °C" jumps="-15>9" jumplabels="[[+24]] °C" points="9:3 pm: 9 °C;-15:7 am: −15 °C"
Step 3: Check on the picture. From −15 up to 0 is 15. From 0 up to 9 is 9. 15 + 9 = 24. ✓
It got [[24]] degrees warmer.
:::
::: try
1. Use chips. Draw them. Then find the difference.
a) −5 − (−1) = [[−4]]
(work 2)
b) 1 − 4 = [[−3]]
(work 2)
2. Write each one as adding the opposite. Then find the answer.
a) 6 − (−4) = [[6 + 4 = 10]]
b) −3 − 5 = [[−3 + (−5) = −8]]
c) −8 − (−8) = [[−8 + 8 = 0]]
d) −1 − (−6) = [[−1 + 6 = 5]]
3. A mall parking lot is on floor −3. Mia rides the elevator to floor 8. How many floors up did she go?
@viz vjumps min=-4 max=10 step=1 every=2 zero="ground" jumps="-3>8" points="-3:parking: −3;8:floor 8" height=200
[[8 − (−3) = 11 floors]]
:::
::: retrieval
1. Find −9 + 4.
=> −5. Different signs: 9 − 4 = 5. −9 is further from 0, so the answer is negative.
2. Find 3 − 10.
=> 3 + (−10) = −7
3. Read it out loud: −4 − (−2). Then find it.
=> "Negative four minus negative two." −4 + 2 = −2.
4. Noor says 5 − (−5) = 0. Is she right? Explain.
=> No. 5 − (−5) = 5 + 5 = 10. Taking away a negative makes it bigger.
5. ★ Stretch: The answer to a subtraction is −6. Write two different subtractions with that answer.
=> Some answers: −2 − 4 = −6, 1 − 7 = −6, −10 − (−4) = −6.
:::

## Section 3: Multiplying integers
Learning target: I can multiply integers and find the sign of a product.

### Vocabulary
- product :: the answer when you multiply :: The product of 3 and −2 is −6.
- factor :: a number you multiply :: In 3 × (−2), the factors are 3 and −2.

#### Ways to write ×
All of these mean "3 times −2".
| Times sign | Dot | Brackets | Two brackets |
|---|---|---|---|
| 3 × (−2) | 3 · (−2) | 3(−2) | (3)(−2) |
A negative sign alone means "times −1": −5 = −1(5).

#### Groups of chips
3 × (−2) means **3 groups of −2**.
@viz counters groups=3 each=-2 result="3 × (−2) = [[−6]]"
On a number line: 3 jumps of −2, starting at 0.
@viz numberline min=-8 max=2 jumps="0>-2>-4>-6" jumplabels="−2,−2,−2" caption="Three jumps of −2 land on −6."

::: example Worked Example 1 — An overnight drop
In Red Deer, the temperature drops 3 °C each hour for 4 hours. What is the total change?
Step 1: 4 groups of −3. Write it: 4 × (−3)
@viz numberline min=-14 max=2 step=1 every=2 jumps="0>-3>-6>-9>-12" jumplabels="−3,−3,−3,−3" ends="colder,warmer"
Step 2: 4 × (−3) = [[−12]]
The total change is [[−12]] °C. Negative means colder.
:::
::: explain
Why is the change −3 each hour, not 3?
(lines 2)
=> The temperature goes down. Down is a negative change.
:::

#### What about a negative first factor? Use a pattern.
The first factor goes down by 1 each row. Watch the product.
| Multiply | Product |
|---|---|
| 3 × (−2) | −6 |
| 2 × (−2) | −4 |
| 1 × (−2) | [[−2]] |
| 0 × (−2) | [[0]] |
| (−1) × (−2) | [[2]] |
| (−2) × (−2) | [[4]] |
| (−3) × (−2) | [[6]] |
Each product goes **up by 2**. The pattern keeps going past 0.
@viz coord xmin=-3 xmax=3 ymin=-6 ymax=6 ystep=1 yevery=2 points="3,-6;2,-4" keypoints="1,-2;0,0;-1,2;-2,4;-3,6" xlabel="first factor" ylabel="product" caption="Plot the rest of the table. Each dot is 2 higher."

Chips show it too. (−3) × (−2) means **take away** 3 groups of −2.
Start with zero pairs, so there is something to take away.
@viz counters groups=-3 each=-2 result="(−3) × (−2) = [[6]]"
Six yellow chips are left. So (−3) × (−2) = [[6]].

::: key Signs for ×
| Signs | Product |
|---|---|
| (+) × (+) | positive |
| (−) × (−) | [[positive]] |
| (+) × (−) | [[negative]] |
| (−) × (+) | [[negative]] |
Same signs → positive. Different signs → negative.
:::
::: misconception
WRONG: "The answer takes the sign of the bigger number. So (−2) × 6 is positive."
WHY: That idea is for adding. For ×, size does not decide the sign.
@viz counters groups=6 each=-2 result="6 groups of −2 = −12"
RIGHT: (−2) × 6 = −12. One negative factor makes the product negative.
:::
::: misconception
WRONG: "(−3)(−4) = 12. So −3 + (−4) must be positive too."
WHY: Two negatives make a positive only for × and ÷.
@viz numberline min=-8 max=2 jumps="0>-3>-7" jumplabels="−3,−4" caption="Adding: −3 + (−4) lands on −7."
RIGHT: −3 + (−4) = −7 (adding). (−3)(−4) = 12 (multiplying).
:::

#### Three or more factors: count the negatives
Each negative factor flips the sign.
| Negatives | Example | Sign |
|---|---|---|
| 1 | (−2)(3)(1) = −6 | − |
| 2 | (−2)(−3)(1) = 6 | + |
| 3 | (−2)(−3)(−1) = [[−6]] | [[−]] |
| 4 | (−2)(−3)(−1)(−1) = [[6]] | [[+]] |
@viz flow steps="Count the negatives|Even: + Odd: −|Multiply the sizes|Write the sign and size"

::: example Worked Example 2 — Three factors
Find (−2)(3)(−5).
Step 1: Count the negatives: [[2]]. That is even, so the sign is [[+]].
Step 2: Multiply the sizes: 2 × 3 × 5 = [[30]].
Answer: [[30]]
:::
::: example Worked Example 3 — Many ways to make −12
Here are two pictures of −12.
@viz counters groups=4 each=-3 result="4 groups of −3"
@viz counters groups=2 each=-6 result="2 groups of −6"
Each one is 12 red chips. So 4(−3) = 2(−6) = −12.
More ways: (−3)([[4]]) = (−1)([[12]]) = (−2)(−2)([[−3]]) = −12
:::
::: explain
Why is (−1)(−2)(−6) negative?
(lines 2)
=> It has 3 negative factors. 3 is odd, so the product is negative: −12.
:::
::: try
a) 5 × (−4) = [[−20]]
b) (−6)(−3) = [[18]]
c) −7 · 8 = [[−56]]
d) −1(9) = [[−9]]
e) (−2)(−2)(−2) = [[−8]]
f) Is (−1)(−1)(−1)(−1)(−1) positive or negative? [[Negative. 5 negatives is odd.]]
g) Write −18 three ways as a product. [[Some answers: (−3)(6), (2)(−9), (−1)(−2)(−9)]]
:::
::: retrieval
1. Find −4 + 9.
=> 5
2. Find −4 − 9.
=> −4 + (−9) = −13
3. Find (−4)(9) and (−4)(−9).
=> −36 and 36
4. Leo says (−5)(−2) is negative, "because both numbers are negative." Fix his mistake.
=> Two negatives is even. The product is positive: (−5)(−2) = 10.
5. ★ Stretch: Find 2 × (−5), 1 × (−5) and 0 × (−5). Keep the pattern going. Show that (−2) × (−5) = 10.
=> −10, −5, 0, 5, 10. Each product goes up by 5.
:::

## Section 4: Dividing integers and problems
Learning target: I can divide integers, check my answer and solve problems.

### Vocabulary
- quotient :: the answer when you divide :: In −12 ÷ 3 = −4, the quotient is −4.
- related multiplication :: the × fact that checks a ÷ fact :: −12 ÷ 3 = −4 because 3 × (−4) = −12
- estimate :: a close answer with friendly numbers :: −98 ÷ 2 is about −100 ÷ 2 = −50

Division undoes multiplication.
To find −12 ÷ 3, ask: 3 times what is −12?

::: example Worked Example 1 — Sharing a debt
Leo, Mia and Sam owe $12 for pizza. They share it equally.
Write it: −12 ÷ 3
Step 1: Put 12 red chips into 3 equal groups.
@viz counters groups=3 each=-4 result="−12 ÷ 3 = [[−4]]"
Step 2: Each group has [[4]] red chips.
Step 3: Check with the related multiplication: 3 × [[(−4)]] = −12 ✓
So −12 ÷ 3 = [[−4]]. Each person owes [[$4]].
:::
::: example Worked Example 2 — How many groups? −12 ÷ (−3)
Ask: how many jumps of −3 make −12?
@viz numberline min=-14 max=2 jumps="0>-3>-6>-9>-12" jumplabels="−3,−3,−3,−3"
Count the jumps: [[4]].
Check: [[4]] × (−3) = −12 ✓
So −12 ÷ (−3) = [[4]].
:::
::: explain
How does a multiplication fact help you divide?
(lines 2)
=> Division undoes ×. If 4 × (−3) = −12, then −12 ÷ (−3) = 4.
:::
::: key Signs for ÷ (the same as ×)
Same signs → [[positive]]. Different signs → [[negative]].
−20 ÷ 5 = [[−4]]
−20 ÷ (−5) = [[4]]
20 ÷ (−5) = [[−4]]
:::
::: misconception
WRONG: "Dividing always makes a number smaller."
WHY: Dividing by a negative flips the sign.
@viz numberline min=-14 max=6 step=1 every=2 points="-12:start: −12;4:answer: 4" caption="−12 ÷ (−3) = 4. The answer is bigger than −12."
RIGHT: −12 ÷ (−3) = 4. And 4 > −12.
:::

#### Is my answer reasonable?
Estimate first. Use friendly numbers.
Then check the sign. Then solve.
@viz flow steps="Draw it|Write the math|Estimate|Solve|Check"

::: example Worked Example 3 — A hike in the Rockies
A hiker starts at 2280 m. She hikes down 720 m in 3 hours. She goes down the same amount each hour.
How much does her elevation change each hour?
@viz vjumps min=1400 max=2400 step=100 every=200 unit=" m" jumps="2280>1560" jumplabels="−720 m" points="2280:start: 2280 m;1560:after 3 hours" height=220
Step 1: The change is down, so it is negative. Write it: [[−720 ÷ 3]]
Step 2: Estimate: −750 ÷ 3 = [[−250]]
Step 3: Solve: 72 ÷ 3 = 24, so −720 ÷ 3 = [[−240]].
Step 4: Is −240 close to −250? [[Yes]]. Is it negative? [[Yes]]. ✓
Her elevation changes by [[−240]] m each hour.
:::
::: example Worked Example 4 — Two steps
At 6 pm it is 6 °C. At 11 pm it is −14 °C. It drops the same amount each hour.
What is the change each hour?
@viz vjumps min=-16 max=8 step=2 every=4 unit=" °C" zero="0 °C" jumps="6>-14" jumplabels="5 hours" points="6:6 pm: 6 °C;-14:11 pm: −14 °C" height=220
Step 1: Find the change. End − start: −14 − 6 = [[−20]]
Step 2: How many hours? 6 pm to 11 pm is [[5]] hours.
Step 3: Share the change: [[−20 ÷ 5 = −4]]
Step 4: Check: [[5 × (−4) = −20 ✓]]
It drops [[4]] °C each hour. The change is [[−4]] °C per hour.
:::
::: explain
In Worked Example 4, why do we subtract before we divide?
(lines 2)
=> We need the total change first. Then we share it over the 5 hours.
:::
::: try
a) −35 ÷ 5 = [[−7]]
b) 42 ÷ (−6) = [[−7]]
c) −63 ÷ (−9) = [[7]]
d) 0 ÷ (−4) = [[0]]
e) −84 ÷ 4 = [[−21]]. Estimate first: −80 ÷ 4 = [[−20]].
f) Raj says −48 ÷ 6 = 8. Check with a multiplication. Is he right? [[No. 6 × 8 = 48, not −48. The answer is −8.]]
g) Zoe's bank balance went from $0 to −$56 in 7 days. It changed the same each day. Find the change per day. [[−56 ÷ 7 = −8. It went down $8 a day.]]
:::
::: retrieval
1. Find −7 + (−8).
=> −15
2. Find −7 − (−8).
=> −7 + 8 = 1
3. Find (−7)(−8).
=> 56
4. Find −56 ÷ (−8). Write the related multiplication.
=> 7, because 7 × (−8) = −56.
5. ★ Stretch: Find the missing number: [?] ÷ (−4) = 6.
=> −24, because 6 × (−4) = −24.
:::

## Unit Synthesis
1. Use the numbers −6 and 2. Find −6 + 2, −6 − 2, −6 × 2 and −6 ÷ 2.
=> −4, −8, −12, −3.
2. Find (−4)(−5) and −4 + (−5). "Two negatives make a positive" works for only one of them. Which one? Why?
=> (−4)(−5) = 20: two negative factors make a positive product. −4 + (−5) = −9: adding two negatives moves further left.
3. Overnight, the temperature in Lethbridge went from 2 °C to −10 °C. Then a chinook warmed it 18 degrees.
a) What was the overnight change?
b) What was the temperature after the chinook?
@viz vjumps min=-12 max=12 step=2 every=4 unit=" °C" zero="0 °C" jumps="2>-10" jumplabels="overnight" points="2:evening: 2 °C;-10:morning: −10 °C" keypoints="8:after the chinook: 8 °C" height=200
=> a) −10 − 2 = −12. It dropped 12 degrees.
=> b) −10 + 18 = 8 °C.
4. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Adding
Chips: put them together. Take out zero pairs.
Same signs: add the sizes, keep the sign. −3 + (−4) = −7
Different signs: subtract the sizes. Keep the sign of the number further from 0. −5 + 3 = −2
:::
@viz counters pos=3 neg=5 pairs=3 result="−5 + 3 = −2"

::: key Subtracting
The − sign has two jobs: negative (a place) and minus (subtract).
Subtract means take away. Add zero pairs if you need more chips.
a − b = a + (−b).
2 − (−3) = 2 + 3 = 5
−2 − 3 = −2 + (−3) = −5
To find a change: end − start.
:::
@viz chips pos=2 add=3 xneg=3 result="2 − (−3) = 5"

::: key Multiplying and dividing
Same signs → positive. Different signs → negative.
Three or more factors: count the negatives. Even → +. Odd → −.
3 × (−2) = 3(−2) = (3)(−2) = −6
(−3)(−2) = 6 · (−1)(−2)(−3) = −6
Divide with the related multiplication. −12 ÷ 3 = −4, because 3 × (−4) = −12.
Estimate first. Check the sign.
:::
@viz counters groups=3 each=-4 result="3 groups of −4 = −12, so −12 ÷ 3 = −4"

| Mistake | Fix |
|---|---|
| −3 + (−4) = 7 | Adding two negatives: −7. "Two negatives make a positive" is for × and ÷. |
| Adding always makes it bigger | 5 + (−3) = 2. Adding a negative moves left. |
| Subtracting always makes it smaller | 2 − (−3) = 5. Taking away a negative moves right. |
| (−2) × 6 is positive (6 is bigger) | Count the negatives: one → negative. −12. |
| Dividing always makes it smaller | −12 ÷ (−3) = 4, and 4 > −12. |
