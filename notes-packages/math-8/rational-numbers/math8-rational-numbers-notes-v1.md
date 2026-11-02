---
title: Rational Numbers
topic: rational-numbers
strand: number
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "integers aren't rational" / "fractions aren't rational" (RN1). "0.333… is 0.3" (RN2).
     "No number between 0.5 and 0.6" (RN2). "−1/2 + 1/3 = 0/5" (RN3). Also: doing + before × (RN4).
     Section order: kinds of numbers first (RN1), so students know what a rational number is.
     Then decimals and the number line (RN2), because comparing needs one form and a picture.
     Then the four operations (RN3), which reuse the number line and Grade 7 sign rules.
     Then order of operations and estimating (RN4), which put all four operations together. Outcome 8N1.1. -->

## Pre-Knowledge Check
1. Which is colder: −6 °C or −2 °C? How do you know?
2. Write {3/4} as a decimal.
3. Find −5 + 8 and −5 − 3.
4. Find (−4) × 3 and (−12) ÷ (−4).
5. Find {1/2} + {1/3}.
6. Put −1.5 and {1/2} on a number line.

## Section 1: Kinds of numbers
Learning target: I can sort numbers into natural numbers, integers and rational numbers.

### Vocabulary
- natural numbers :: the counting numbers 1, 2, 3, 4 and so on :: 1, 7, 250
- integers :: the natural numbers, their opposites, and 0 :: −3, 0, 12
- rational number :: any number you can write as a fraction {a/b}, where a and b are integers and b is not 0 :: {2/3}, −0.75, 5
- terminating decimal :: a decimal that ends :: 0.25, −1.8

#### Three families of numbers
You count with **natural numbers**: 1, 2, 3, 4, …
@viz numberline min=0 max=8 points="1:;2:;3:;4:;5:;6:;7:;8:" caption="Natural numbers: the dots you count with. They start at 1."

Add 0 and the negatives. Now you have the **integers**.
@viz numberline min=-5 max=5 points="-5:;-4:;-3:;-2:;-1:;0:;1:;2:;3:;4:;5:" caption="Integers: every whole step, left and right of 0."

Fractions and decimals fill the gaps between the integers.
A **rational number** is any number you can write as {a/b}.
The top and the bottom are integers. The bottom is not 0.
@viz numberline min=-2 max=2 step=0.25 every=1 points="-1.5:−3/2;-0.75:−0.75;0.5:1/2;1.25:5/4" caption="Rational numbers live in the gaps too."

Each family fits inside the next one, like boxes in boxes.
@viz rnsets nat="1;7;250" int="0;−3;−40" rat="½;−0.75;5¼" caption="Natural numbers sit inside the integers. The integers sit inside the rational numbers."

::: key Why "rational"?
The word **ratio** is inside **rational**.
A rational number is a ratio of two integers: {a/b}.
The bottom can't be 0. You can't share something into 0 groups.
:::

::: example Worked Example 1 — Write each number as a fraction
Show that each number is rational.
a) 5 = {5/1}
b) −3 = {−3/1}
c) 0 = {0/1}
d) 0.75 = {75/100} = {3/4}
e) −2.5 = −{25/10} = [[−{5/2}]]
f) 1{1/4} = [[{5/4}]]
@viz numberline min=-3 max=6 step=0.25 every=1 points="0:0/1;0.75:3/4;5:5/1" keypoints="-2.5:−5/2;1.25:5/4"
:::

::: misconception
WRONG: "Integers aren't rational numbers. Only fractions are."
WHY: A rational number is any number you *can* write as {a/b}. Every integer can be written over 1.
@viz rnsets nat="5 = 5/1" int="−3 = −3/1;0 = 0/1" rat="2/3" hot=int
RIGHT: Every integer is rational. 5 = {5/1}, −3 = {−3/1}, 0 = {0/1}.
:::
::: misconception
WRONG: "Fractions aren't rational numbers. Only integers are."
WHY: {2/3} is already in the form {a/b}. The top and bottom are integers.
@viz bars bars="2/3" labels="2/3 is a ratio: 2 out of 3" unit=260
RIGHT: Fractions, mixed numbers and terminating decimals are all rational.
:::

::: example Worked Example 2 — Sort the numbers
Sort: 12, −7, {3/8}, 0, −1.2, 4
Step 1: Natural numbers: 12, 4
Step 2: Integers: 12, 4, −7, 0
Step 3: Rational numbers: all six of them.
@viz rnsets nat="12;4" int="−7;0" rat="3/8;−1.2"
:::
::: explain
Why is 4 in all three boxes?
(lines 2)
=> 4 is a counting number. It is also a whole number with no fraction part, so it is an integer. And 4 = {4/1}, so it is rational.
:::

::: example Worked Example 3 — Temperatures in Jasper
Here are four low temperatures in Jasper.
They are −8 °C, −3.5 °C, 1 °C and −0.5 °C.
@viz thermo min=-10 max=5 step=5 values="-8,-3.5,1,-0.5" labels="−8;−3.5;1;−0.5"
Which ones are integers? −8 and 1.
Are all of them rational? Yes. For example, −3.5 = [[−{7/2}]].
:::

::: try
1. Write each number as {a/b}.
a) 9 = [[{9/1}]]
b) −0.6 = [[−{3/5}]]
c) 2{1/3} = [[{7/3}]]
2. Is the statement true or false?
a) −6 is a natural number. [[false]]
b) −6 is a rational number. [[true]]
c) Every natural number is an integer. [[true]]
3. Put 9, −6 and −0.6 in the smallest box each one fits.
@viz rnsets nat="[[9]]" int="[[−6]]" rat="[[−0.6]]"
:::
::: retrieval
1. Which is colder: −4.5 °C or −4 °C?
=> −4.5 °C. It is further left (lower) than −4.
2. Write −1.25 as a fraction.
=> −{125/100} = −{5/4}
3. Find −7 + 10.
=> 3
4. Is 0 a natural number? Is it an integer? Is it rational?
=> Not natural (counting starts at 1). It is an integer. It is rational: 0 = {0/1}.
5. ★ Stretch: Why can't the bottom of {a/b} be 0?
=> {6/0} would mean 6 ÷ 0. No number times 0 gives 6, so there is no answer.
:::

## Section 2: Repeating decimals and the number line
Learning target: I can use bar notation and order rational numbers.

### Vocabulary
- repeating decimal :: a decimal where a digit or group of digits repeats forever :: 0.333…, 0.1818…
- bar notation :: a bar over the digits that repeat :: 0.{bar:3} means 0.333…
- between :: bigger than one number and smaller than the other :: 0.55 is between 0.5 and 0.6

#### Divide the top by the bottom
A fraction bar means divide. {3/8} means 3 ÷ 8.
Some divisions **end**. Others **repeat** forever.
@viz rndiv a=3 b=8 result="3/8 = 0.375 (it ends)" title="3 ÷ 8"

@viz rndiv a=1 b=3 steps=4 result="1/3 = 0.333… = 0.{bar:3}" title="1 ÷ 3"
Look at the remainders. 1 comes back again and again.
So the digit 3 repeats forever.

::: key Bar notation
Put a bar over the digits that repeat.
0.333… = 0.{bar:3} · 0.1818… = 0.{bar:18} · 0.8333… = 0.8{bar:3}
The bar covers **only** the repeating part.
:::

::: example Worked Example 1 — 2 ÷ 11
Step 1: Divide. Write each digit and remainder.
@viz rndiv a=2 b=11 steps=4 result="2/11 = 0.1818…"
Step 2: The remainder 2 comes back. So 1 and 8 repeat.
Step 3: Write it with a bar: {2/11} = [[0.{bar:18}]]
:::
::: example Worked Example 2 — 5 ÷ 6
@viz rndiv a=5 b=6 steps=3 result="5/6 = 0.8333…"
The 8 happens once. Then the 3 repeats.
So {5/6} = [[0.8{bar:3}]]. The bar goes over the 3 only.
:::

::: misconception
WRONG: "0.333… is the same as 0.3."
WHY: 0.3 is {3/10}. It stops. 1 ÷ 3 never stops: the 3s go on forever.
@viz numberline min=0.29 max=0.34 step=0.01 every=0.01 points="0.3:0.3;0.3333:1/3" caption="1/3 is a little to the right of 0.3."
RIGHT: {1/3} = 0.{bar:3}. That is a bit more than 0.3.
:::

#### Which fractions repeat?
Divide and see. Write the fraction in simplest form first.
| Fraction | Decimal | Ends or repeats? |
|---|---|---|
| {1/4} | 0.25 | ends |
| {1/5} | 0.2 | ends |
| {1/3} | 0.{bar:3} | repeats |
| {1/6} | 0.1{bar:6} | repeats |
| {1/8} | 0.125 | [[ends]] |
| {1/9} | [[0.{bar:1}]] | [[repeats]] |
Pattern: if the bottom is built only from 2s and 5s, the decimal ends.
Any other factor on the bottom makes it repeat.
@viz rndiv a=1 b=7 steps=6 result="1/7 = 0.142857 142857 …"

::: explain
Why must 1 ÷ 7 repeat within 6 digits?
(lines 2)
=> The only remainders you can get are 1 to 6. After 6 steps, one of them must come back. Then the digits repeat.
:::

#### Rational numbers on the number line
Change each number to a decimal. Then place it.
@viz numberline min=-1 max=1 step=0.1 every=0.5 points="-0.6667:−2/3;-0.5:−0.5;0.3333:1/3;0.8333:5/6" caption="−2/3 = −0.{bar:6} is a bit past −0.6."

::: example Worked Example 3 — Order the numbers
Order from least to greatest: −{2/3}, −0.6, {1/6}, 0.1, −{7/11}
Step 1: Decimals: −0.{bar:6}, −0.6, 0.1{bar:6}, 0.1, [[−0.{bar:63}]]
Step 2: Call them A to E, in the order given. Place them on the line.
@viz numberline min=-0.7 max=0.2 step=0.05 every=0.1 width=600 keypoints="-0.6667:A;-0.6364:E;-0.6:B;0.1:D;0.1667:C"
Step 3: Read left to right: [[−{2/3}, −{7/11}, −0.6, 0.1, {1/6}]]
:::

#### Always a number in between
Zoom in between 0.5 and 0.6. There are hundredths in there!
@viz numberline min=0.5 max=0.6 step=0.01 every=0.05 points="0.55:0.55;0.51:0.51" caption="Zoom in: 0.51, 0.52, … 0.59 are all between."

::: misconception
WRONG: "There's no number between 0.5 and 0.6."
WHY: Add a digit. 0.50 and 0.60 have 0.51, 0.52, … in between. Then 0.501, 0.502 …
@viz numberline min=0.5 max=0.51 step=0.001 every=0.01 points="0.501:0.501;0.505:0.505"
RIGHT: Between any two rational numbers there are endless more.
:::
::: example Worked Example 4 — A number between −{3/4} and −{2/3}
Step 1: Decimals: −0.75 and [[−0.{bar:6}]]
Step 2: Pick a number in the middle, like −0.7.
@viz numberline min=-0.8 max=-0.6 step=0.01 every=0.05 points="-0.75:−3/4;-0.6667:−2/3" keypoints="-0.7:−0.7"
Step 3: Check: −0.75 < −0.7 < −0.67. So −0.7 = [[−{7/10}]] works.
:::
::: try
1. Write each with bar notation.
a) {4/9} = [[0.{bar:4}]]
b) {7/11} = [[0.{bar:63}]]
c) −{1/6} = [[−0.1{bar:6}]]
2. Will it end or repeat? a) {3/20} [[ends]] b) {2/15} [[repeats]]
3. Write < or >. a) −{1/3} [[<]] −0.3 b) 0.{bar:6} [[>]] 0.66
4. Find a number between −1.2 and −1.1. [[−1.15]]
@viz numberline min=-1.3 max=-1 step=0.05 every=0.1 keypoints="-1.15:−1.15"
:::
::: retrieval
1. Is −0.4 rational? Write it as {a/b}.
=> Yes. −0.4 = −{4/10} = −{2/5}.
2. Write {2/3} as a decimal with a bar.
=> 0.{bar:6}
3. Find −2.5 + 4.
=> 1.5
4. Put 5, −2 and {1/2} in the smallest box each fits: natural, integer, or rational.
=> 5 natural, −2 integer, {1/2} rational.
5. ★ Stretch: Find three numbers between {1/3} and {1/2}.
=> One answer: 0.4, 0.45, 0.49. Any decimal from 0.34 to 0.49 works.
:::

## Section 3: Operations with rational numbers
Learning target: I can add, subtract, multiply and divide positive and negative fractions and decimals.

### Vocabulary
- common denominator :: the same bottom number for two fractions :: {1/2} = {3/6} and {1/3} = {2/6}
- reciprocal :: the fraction flipped over :: the reciprocal of −{3/4} is −{4/3}
- sign rules :: same signs give a positive answer; different signs give a negative answer :: (−2)(−3) = 6

#### Adding and subtracting
The Grade 7 rules still work. Now the numbers can be fractions and decimals.
@viz numberline min=-3 max=2 step=0.5 every=1 points="-2.5:start;1.5:end" jumps="-2.5>1.5" jumplabels="+4" caption="−2.5 + 4 = 1.5. Jump 4 to the right."

Fractions need a **common denominator** first.
Then add the tops. Keep the bottom.

::: example Worked Example 1 — −{1/2} + {1/3}
Step 1: Common denominator 6. −{1/2} = −{3/6} and {1/3} = {2/6}.
Step 2: Think of chips. Each chip is one sixth.
@viz chips pos=2 neg=3 pairs=2 title="Each chip = 1/6" result="−3/6 + 2/6 = [[−1/6]]"
Step 3: Two zero pairs cancel. One negative sixth is left: [[−{1/6}]].
@viz numberline min=-1 max=1 step=0.1666667 every=2 ticklabels="-1:−1;-0.5:−3/6;0:0;0.5:3/6;1:1" points="-0.5:start" jumps="-0.5>-0.1666667" jumplabels="+2/6"
:::
::: misconception
WRONG: "−{1/2} + {1/3} = {0/5}. Add the tops and add the bottoms."
WHY: Halves and thirds are different sizes. You can't add the bottoms.
@viz bars bars="1/2;1/3" labels="1/2 (negative);1/3" unit=240
RIGHT: Common denominator first: −{3/6} + {2/6} = −{1/6}.
:::
::: example Worked Example 2 — Subtract by adding the opposite
A Calgary morning is 2.5 °C. The temperature drops 6.8 °C. What is it now?
@viz vjumps min=-6 max=4 step=1 every=2 unit=" °C" jumps="2.5>-4.3" jumplabels="−6.8" points="2.5:7 a.m.;-4.3:noon" height=230
2.5 − 6.8 = 2.5 + (−6.8) = [[−4.3]] °C
:::

#### Multiplying and dividing
Work out the size first. Then use the **sign rules** from Grade 7.
::: key Sign rules for × and ÷
Same signs → positive. (−) × (−) = (+)
Different signs → negative. (−) × (+) = (−)
:::
@viz counters groups=3 each=-2 result="3 × (−2) = −6"

::: example Worked Example 3 — −{2/3} × {3/4}
Step 1: Size: {2/3} × {3/4}. Use the area model.
@viz area a=2/3 b=3/4 result="2/3 × 3/4 = 6/12 = 1/2"
Step 2: Signs: one negative. The answer is negative.
Step 3: −{2/3} × {3/4} = [[−{1/2}]]
:::
::: example Worked Example 4 — A stock drops
A stock drops $0.35 each day for 4 days. What is the total change?
@viz numberline min=-1.6 max=0 step=0.1 every=0.4 points="0:start" jumps="0>-0.35>-0.7>-1.05>-1.4" jumplabels="−0.35,−0.35,−0.35,−0.35"
4 × (−0.35) = [[−1.40]]. The stock is down $[[1.40]].
:::
::: example Worked Example 5 — Divide: −{3/4} ÷ {1/2}
Step 1: Size: how many halves fit in {3/4}?
@viz groups total=3/4 piece=1/2 count="3/4 ÷ 1/2 = 1 1/2"
Step 2: Or multiply by the reciprocal: −{3/4} × 2 = −{6/4}.
Step 3: Different signs, so negative: [[−{3/2}]] = −1.5
:::
::: explain
Why is (−7.5) ÷ (−2.5) positive?
(lines 2)
=> Both numbers are negative. Same signs give a positive answer. (−7.5) ÷ (−2.5) = 3, and 3 × (−2.5) = −7.5 checks.
:::
::: try
a) −{3/4} + {1/4} = [[−{1/2}]]
b) −1.2 − 3.5 = [[−4.7]]
c) {1/3} − {5/6} = [[−{1/2}]]
d) (−1.5) × (−4) = [[6]]
e) {2/5} × (−{5/8}) = [[−{1/4}]]
f) −4.8 ÷ 0.6 = [[−8]]
g) Leo's balance is −$12.50. He deposits $20. New balance: [[$7.50]]
@viz vjumps min=-15 max=10 step=5 prefix="$" zero="" jumps="-12.5>7.5" jumplabels="+20" points="-12.5:before" height=200
:::
::: retrieval
1. Write {5/9} with bar notation.
=> 0.{bar:5}
2. Order: −0.3, −{1/3}, −0.33
=> −{1/3}, −0.33, −0.3 (−{1/3} = −0.333… is furthest left)
3. Is −8 rational? Show it.
=> Yes. −8 = {−8/1}.
4. Find −{1/4} − {1/2}.
=> −{1/4} − {2/4} = −{3/4}
5. ★ Stretch: The product of two numbers is −{1/2}. One number is {3/4}. What is the other?
=> −{1/2} ÷ {3/4} = −{1/2} × {4/3} = −{2/3}
:::

## Section 4: Order of operations and estimating
Learning target: I can use the order of operations and estimate to check.

### Vocabulary
- order of operations :: the order to do the steps: brackets, powers, × and ÷, then + and − :: 2 + 3 × 4 = 14
- estimate :: a quick answer with friendly numbers :: −4.87 × 2.1 ≈ −5 × 2 = −10
- reasonable :: close to the estimate, with the right sign :: −10.2 is reasonable for −4.87 × 2.1

The order of operations is the same as in Grade 7.
Now the numbers can be negative fractions and decimals.
@viz flow steps="Brackets ( )|Powers, like (−0.5)²|× and ÷, left to right|+ and −, left to right"

::: example Worked Example 1 — −3 + 6 × (−0.5)
Step 1: Multiply first: 6 × (−0.5) = [[−3]]
Step 2: Then add: −3 + (−3) = [[−6]]
@viz numberline min=-7 max=1 step=1 points="-3:start" jumps="-3>-6" jumplabels="−3"
:::
::: misconception
WRONG: "−3 + 6 × (−0.5) = 3 × (−0.5) = −1.5. I worked left to right."
WHY: × comes before +. Left to right is only for steps of the same level.
@viz flow steps="−3 + 6 × (−0.5)|−3 + (−3)|−6" width=420
RIGHT: Multiply first, then add. The answer is −6.
:::
::: example Worked Example 2 — Brackets first
({1/2} − {3/4}) × (−8)
Step 1: Brackets: {1/2} − {3/4} = {2/4} − {3/4} = [[−{1/4}]]
Step 2: Multiply: −{1/4} × (−8) = [[2]]. Same signs, so positive.
@viz numberline min=-8 max=0 step=1 every=2 points="0:0" jumps="0>-2>-4>-6>-8" jumplabels="−2,−2,−2,−2" caption="Split −8 into 4 equal parts."
:::

#### Estimate first
Round to friendly numbers. Find the sign. Then do the real work.
If the answer is far from the estimate, check again.
@viz numberline min=-5.5 max=-4.5 step=0.05 every=0.5 points="-4.87:−4.87" caption="−4.87 is close to −5."

::: example Worked Example 3 — Estimate, then calculate
−4.87 × 2.1
Estimate: −5 × 2 = [[−10]]
Calculator: −4.87 × 2.1 = [[−10.227]]
Is it reasonable? [[Yes. It is close to −10 and negative.]]
@viz numberline min=-12 max=0 step=1 every=2 points="-10:estimate" keypoints="-10.227:answer"
:::
::: example Worked Example 4 — The mean temperature
Three days in Lethbridge had highs of −3.5 °C, 2.1 °C and −6.4 °C. Find the mean.
@viz thermo min=-10 max=5 step=5 values="-3.5,2.1,-6.4" labels="Mon;Tue;Wed"
Estimate: (−4 + 2 − 6) ÷ 3 = −8 ÷ 3 ≈ [[−2.7]]
Brackets: −3.5 + 2.1 + (−6.4) = [[−7.8]]
Divide: −7.8 ÷ 3 = [[−2.6]]. The mean is [[−2.6 °C]].
:::
::: example Worked Example 5 — A stock over a week
A stock starts at $12.40. It drops $0.85 a day for 3 days. Then it rises $1.10.
12.40 + 3 × (−0.85) + 1.10
@viz line data="Start:12.4;Day 1:11.55;Day 2:10.7;Day 3:9.85" ymin=9 ymax=13 ystep=0.5 title="Stock price ($)" caption="Day 4: up $1.10. Where will the line go?"
Estimate: 12 + 3 × (−1) + 1 = [[10]]
Multiply: 3 × (−0.85) = [[−2.55]]
Add left to right: 12.40 − 2.55 + 1.10 = [[$10.95]]
:::
::: explain
In Worked Example 5, how does the estimate help you trust $10.95?
(lines 2)
=> The estimate is $10. $10.95 is close to it. A big gap would mean a mistake.
:::
::: example Worked Example 6 — A recipe
A recipe needs {3/4} cup of oil. Ana makes 2{1/2} batches.
@viz area a=3/4 b=1/2 result="the half batch: 3/4 × 1/2 = [[3/8]] cup"
Estimate: about 1 cup × 2{1/2} ≈ 2{1/2} cups. A bit less, since {3/4} < 1.
Calculate: {3/4} × {5/2} = [[{15/8}]] = [[1{7/8}]] cups.
:::
::: try
a) −2.5 + 3 × (−1.2) = [[−6.1]]
b) (−{2/3}) × 6 − 4 = [[−8]]
c) (−0.5)² = [[0.25]]
d) 10 ÷ (−{1/2}) + 3 = [[−17]]
e) Estimate 19.6 ÷ (−3.9): [[20 ÷ (−4) = −5]]
f) A diver is at −12.6 m. She rises 4.2 m twice. Where is she? [[−4.2 m]]
@viz vjumps min=-14 max=0 step=2 every=2 unit=" m" zero="sea level" water=1 jumps="-12.6>-8.4>-4.2" jumplabels="+4.2;+4.2" points="-12.6:start" height=220
:::
::: retrieval
1. Is 0.{bar:3} rational? Write it as a fraction.
=> Yes. 0.{bar:3} = {1/3}.
2. Find a number between −{1/2} and −{2/5}.
=> One answer: −0.45. (−0.5 < −0.45 < −0.4)
3. Find −{1/2} + {1/3}.
=> −{1/6}
4. Find (−2.4) ÷ (−0.6).
=> 4. Same signs, so positive.
5. ★ Stretch: Add brackets to 2 − 5 × 0.4 + 1. Make the answer −5.
=> 2 − 5 × (0.4 + 1) = 2 − 5 × 1.4 = 2 − 7 = −5.
:::

## Unit Synthesis
1. Sort into the smallest box: 15, −{4/5}, −9, 0.{bar:7}. Write each one as {a/b}.
@viz rnsets nat="[[15]]" int="[[−9]]" rat="[[−4/5]];[[7/9]]"
=> 15 natural ({15/1}). −9 integer ({−9/1}). −{4/5} and 0.{bar:7} = {7/9} rational.
2. Order from least to greatest: −{5/6}, −0.8, {2/9}, 0.2. Then find a number between the two negatives.
@viz numberline min=-1 max=0.4 step=0.1 every=0.2 width=600 keypoints="-0.8333:−5/6;-0.8:−0.8;0.2:0.2;0.2222:2/9"
=> −{5/6} = −0.8{bar:3}, {2/9} = 0.{bar:2}. Order: −{5/6}, −0.8, 0.2, {2/9}. Between: −0.81.
3. Estimate, then find: (−1.8 + 0.6) × (−{1/4}).
=> Estimate (−2 + 1) × (−{1/4}) = {1/4}. Exact: −1.2 × (−0.25) = 0.3.
4. Look back at your first page. What would you change now?
=> Answers vary.

## Concept Reference
::: key Kinds of numbers
Natural numbers: 1, 2, 3, … Integers: …, −2, −1, 0, 1, 2, …
Rational: any {a/b} with integers a and b, b ≠ 0. Every integer is rational: 5 = {5/1}.
:::
@viz rnsets nat="1;2;17" int="0;−3;−40" rat="½;−0.75;0.{bar:3}"

::: key Repeating decimals
Divide the top by the bottom. If a remainder comes back, the digits repeat.
{1/3} = 0.{bar:3} · {2/11} = 0.{bar:18} · {5/6} = 0.8{bar:3}
Bottom made only of 2s and 5s (simplest form): the decimal ends.
:::
@viz rndiv a=2 b=11 steps=3 result="2/11 = 0.1818… = 0.{bar:18}"

::: key Number line
Change to decimals. Further left is smaller. Between any two numbers there are endless more.
:::
@viz numberline min=0.5 max=0.6 step=0.01 every=0.05 points="0.55:0.55"

::: key Operations
+ and −: common denominator first. Subtracting = adding the opposite.
× and ÷: same signs → positive, different signs → negative.
Order: brackets, powers, × ÷ (left to right), + − (left to right). Estimate first.
:::
@viz flow steps="Estimate|Brackets|Powers|× ÷|+ −|Check"

| Mistake | Fix |
|---|---|
| Integers aren't rational | 5 = {5/1}. Every integer is rational. |
| 0.333… = 0.3 | {1/3} = 0.{bar:3}, a bit more than 0.3. |
| No number between 0.5 and 0.6 | 0.55, 0.51, 0.501 … endless numbers. |
| −{1/2} + {1/3} = {0/5} | −{3/6} + {2/6} = −{1/6}. |
| −3 + 6 × (−0.5) = −1.5 | × first: −3 + (−3) = −6. |
