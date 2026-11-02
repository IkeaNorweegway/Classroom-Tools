---
title: Polynomials
topic: polynomials
strand: algebra
---
<!-- Gate: progressive blanking confirmed. Section 1 mostly filled in. Section 4 mostly blanks.
     Refutation-first on: "x² means 2x" (PO1, not in the course list; added because 8A1 asks students to read
     a power as repeated multiplication). "The degree is the number of terms" (PO2). "3x² + 2x = 5x³" (PO3).
     "Reorder and drop the sign" (PO3, not in the course list; added because 8A1 asks for descending and
     ascending order). "(3x + 2) − (x − 5) = 2x − 3" (PO4).
     Section order: a single term first (coefficient × power of x), because every later idea is built from
     terms (PO1). Then whole polynomials: is it one, how many terms, what degree (PO2). Then like terms and
     order, which needs the idea of degree: like terms have the same variable and the same degree (PO3).
     Last, adding and subtracting, which is collecting like terms after the brackets come off (PO4).
     Outcome 8A1. Degree up to 3. Algebra tiles for degree ≤ 2. Add and subtract only: no multiplying or
     factoring (Grade 9). -->

## Pre-Knowledge Check
1. Simplify 3x + 5x.
2. Simplify 4x + 2 − x + 3.
3. Find 2 × 2 × 2. Write it as a power.
4. Find −5 + 2 and −3 − (−4).
5. Find 3n + 2 when n = 4.
6. What is the opposite of −7? What is the opposite of 2x?

## Section 1: Terms, coefficients and powers
Learning target: I can write a term as a coefficient times a power of x.

### Vocabulary
- variable :: a letter that stands for a number :: x
- power :: a base with an exponent. It means repeated multiplication. :: x³ = x · x · x
- base :: the number or letter being multiplied :: in x³, the base is x
- exponent :: how many times the base is a factor :: in x³, the exponent is 3
- term :: a number, a variable, or a product of them :: 3x², −5x, 7
- coefficient :: the number that multiplies the variable part :: in 3x², the coefficient is 3
- constant :: a term with no variable :: 7

#### A power is repeated multiplication
The dot · means "times." We use it so × does not look like x.
x² means x · x. Picture a square with sides of length x. Its area is x · x = x².
@viz potiles rows="x2 | x;x;+1" labels="x² tile;x tiles, 1 tile" caption="Algebra tiles: the big green square is x². A tall tile is x. A small square is 1."
x³ means x · x · x. Picture a cube with edges of length x. Its volume is x³.
@viz solid kind=box l="x" w="x" h="x" lv=2 wv=2 hv=2 size=150 caption="A cube with edges x has volume x · x · x = x³."

#### The parts of a term
A **term** like 3x² has a **coefficient** and a **power** of x.
@viz poterm c="3" v="x" e="2" clabel="coefficient" vlabel="variable (the base)" elabel="exponent" expand="3x² = 3 · x · x"
3x² is three x² tiles.
@viz potiles rows="3x2" notes="3x²"

::: key Term = coefficient × power of x
3x² = 3 · x · x. −4x³ = −4 · x · x · x. 5x = 5 · x.
The exponent counts the x's. The coefficient counts how many of that power.
:::

::: misconception
WRONG: "x² means 2x."
WHY: x² is x times x. 2x is x plus x. Try x = 5. x² = 5 · 5 = 25. But 2x = 5 + 5 = 10.
@viz potiles rows="x2 | 2x" labels="x²;2x" notes="a square, x by x;two thin tiles"
RIGHT: x² = x · x. 2x = x + x. They are different terms.
:::

::: example Worked Example 1 — Term to factors
Write 4x³ as a product of factors.
@viz poterm c="4" v="x" e="3" clabel="4 of them" elabel="3 factors of x" expand="4x³ = 4 · x · x · x"
Step 1: The coefficient is 4. It is one factor.
Step 2: The exponent is 3. So x is a factor 3 times.
Step 3: 4x³ = 4 · x · x · x.
:::

::: example Worked Example 2 — Factors to a term
Write −2 · x · x as a term.
@viz potiles rows="-2x2" notes="−2 · x · x = −2x²"
Step 1: The number factor is −2. That is the coefficient.
Step 2: Count the x's. There are 2. So the power is x².
Step 3: −2 · x · x = −2x².
:::
::: explain
In Worked Example 2, why is the exponent 2 and not 1?
(lines 2)
=> x is a factor two times: x · x. The exponent counts the factors of x.
:::

#### Hidden 1s and conventional form
Some numbers are not written. We still know they are there.
| Long form | Write it as | Why |
|---|---|---|
| 1x | x | A coefficient of 1 is not written. |
| −1x² | −x² | The − sign is enough. The coefficient is −1. |
| x¹ | x | An exponent of 1 is not written. |
| 5x⁰ | 5 | x⁰ = 1, so 5x⁰ = 5 · 1 = 5. |
@viz poterm c="" v="x" e="2" vlabel="coefficient 1 is hidden" elabel="exponent" expand="x² = 1 · x · x"
@viz potiles rows="-x2 | x" labels="−x²;x" notes="coefficient −1;coefficient 1, exponent 1"

::: example Worked Example 3 — Find the coefficient and exponent
Fill in the table.
| Term | Coefficient | Exponent |
|---|---|---|
| 6x² | 6 | 2 |
| −x³ | −1 | [[3]] |
| x | [[1]] | [[1]] |
| −8 | −8 | 0 (−8 = −8x⁰) |
@viz poterm c="−" v="x" e="3" clabel="coefficient −1" elabel="exponent [[3]]"
:::

::: try
1. Write 5x² as a product of factors. [[5 · x · x]]
2. Write 7 · x · x · x as a term. [[7x³]]
3. Name the coefficient and the exponent of −3x.
@viz potiles rows="-3x" notes="−3x"
[[Coefficient −3. Exponent 1.]]
4. Write 1x¹ in conventional form. [[x]]
5. Mia says x³ = 3x. Is she right? Try x = 2. [[No. x³ = 2 · 2 · 2 = 8. 3x = 3 · 2 = 6.]]
:::
::: retrieval
1. Simplify 6x − 2x.
=> 4x
2. Find (−3) × (−4).
=> 12
3. Find 4² and 2⁴.
=> 16 and 16
4. Find 5x + 1 when x = 3.
=> 16
5. ★ Stretch: Find 2x³ when x = −1.
=> 2 · (−1) · (−1) · (−1) = 2 · (−1) = −2
:::

## Section 2: Naming polynomials
Learning target: I can tell if an expression is a polynomial. I can name it by its terms and degree.

### Vocabulary
- monomial :: one term :: 4x², −7, x
- binomial :: two terms joined by + or − :: x³ + 1
- trinomial :: three terms :: 2x² − 3x + 5
- polynomial :: one term or a sum of terms. Each exponent is a counting number. :: x³ − 2x² + x − 4
- degree of a term :: its exponent. A constant has degree 0. :: 5x³ has degree 3
- degree of a polynomial :: the highest degree of its terms :: x² + 6x³ − 1 has degree 3

#### What is a polynomial?
A **polynomial** is one term or a sum of terms. Each exponent on x is a counting number: 1, 2, 3, … . A constant, like 5, is allowed too.
These are **not** polynomials. x is in a denominator, under a root, or has a negative exponent.
@viz posort bins="Polynomial:3x² + 1,x³ − x,7,−2x;Not a polynomial:1/x,√x + 2,x⁻¹,4/x²" title="Sort the expressions"
{1/x} is the same as x⁻¹. The exponent −1 is not a counting number. So {1/x} is not a polynomial.

#### Count the terms
Terms are split by + and − signs. The sign goes with the term after it.
@viz posort bins="Monomial (1 term):4x²,−7,x;Binomial (2 terms):x³ + 1,5x − 2;Trinomial (3 terms):x² + 2x + 3,4 − x + x³"
x² + 2x + 3 is a trinomial. Here it is in tiles.
@viz potiles rows="x2;2x;+3" notes="1 term + 1 term + 1 term"

#### Name by degree
The degree of a term is its exponent. The degree of a polynomial is the highest one.
| Degree | Name | Example |
|---|---|---|
| 0 | constant | 7 |
| 1 | linear | 2x + 5 |
| 2 | quadratic | x² − 3x + 1 |
| 3 | cubic | 4x³ + x |
| n | degree n | x⁵ − 1 has degree 5 |
@viz poterm c="6" v="x" e="3" elabel="exponent 3" note="degree of the term: 3"

::: misconception
WRONG: "The degree is the number of terms. x³ + 1 has degree 2."
WHY: Degree is about exponents, not about counting terms. Look at the exponents in x³ + 1. They are 3 and 0. The highest is 3.
@viz posort bins="Number of terms:x³,+1;Exponents:3,0" totals="2 terms: binomial;highest 3: degree 3"
RIGHT: x³ + 1 has two terms (a binomial). Its degree is 3 (cubic).
:::

::: example Worked Example 1 — Name a polynomial two ways
Name 4x³ − 2x + 1.
@viz posort bins="4x³:degree 3;−2x:degree 1;+1:degree 0"
Step 1: Count the terms: 4x³, −2x and +1. Three terms: a trinomial.
Step 2: Find each degree: 3, 1 and 0. The highest is 3.
Step 3: It is a cubic trinomial of degree 3.
:::

::: example Worked Example 2 — Is it a polynomial?
Is 3x² + {2/x} a polynomial? Explain.
@viz posort bins="3x²:exponent 2 ✓;2/x:2x⁻¹ ✗"
Step 1: Check each term. 3x² has exponent 2. That is a counting number.
Step 2: {2/x} = 2x⁻¹. The exponent −1 is not a counting number.
Step 3: So 3x² + {2/x} is [[not a polynomial]].
:::
::: explain
Why is the constant 9 a polynomial? Use the idea of x⁰.
(lines 2)
=> 9 = 9x⁰, and x⁰ = 1. A constant is a monomial of degree 0.
:::

::: example Worked Example 3 — Conventional form, then name it
Write 1x² + 0x − 5x⁰ in conventional form. Then name it.
@viz potiles rows="x2;-5" notes="x² − 5"
Step 1: 1x² is written x². 0x is 0, so it drops out. 5x⁰ = 5.
Step 2: The polynomial is [[x² − 5]].
Step 3: Two terms, highest exponent 2: a [[quadratic binomial]].
:::

::: try
1. Name x² + 4x − 1 by its number of terms. [[trinomial]]
2. Give the degree of 7x − 3x³ + 2. [[3 (cubic)]]
3. Give the degree of the constant −6. [[0]]
4. Is √x + 1 a polynomial? Explain. [[No. √x is not x with a counting-number exponent.]]
5. Name the polynomial the tiles show. Give its degree.
@viz potiles rows="2x2;-x"
[[2x² − x: a binomial of degree 2 (quadratic).]]
6. Raj counts 4 terms in 5x² + x + x³ + 2. He says the degree is 4. Fix his thinking. [[It has 4 terms, but the degree is the highest exponent: 3.]]
:::
::: retrieval
1. Write 3 · x · x · x as a term.
=> 3x³
2. Name the coefficient of −x².
=> −1
3. Simplify 2x + 7x − x.
=> 8x
4. Find −2 − 6.
=> −8
5. ★ Stretch: Write a cubic binomial with a coefficient of −1.
=> One answer: −x³ + 4
:::

## Section 3: Like terms and order
Learning target: I can find like terms, combine them, and write a polynomial in order.

### Vocabulary
- like terms :: terms with the same variable and the same exponent :: 3x² and −x²
- unlike terms :: terms with a different exponent (or no variable) :: 3x² and 3x
- descending order :: highest degree first. This is the usual way. :: x³ + 2x² − x + 4
- ascending order :: lowest degree first :: 4 − x + 2x² + x³
- simplify :: combine all the like terms :: 2x² + 3x² = 5x²

#### Like terms are the same kind of tile
Like terms have the same variable AND the same exponent. They are tiles of the same shape.
@viz potiles rows="3x2;-x2 | 3x;-2x | +4;-1" labels="x² terms;x terms;constants"
Unlike terms are different shapes. 3x² and 3x are not like terms. 3x and 3 are not like terms.
To combine like terms, add the coefficients. Keep the power the same.
@viz potiles rows="3x2;-x2 | x2;x2;x2!;-x2!" labels="3x² − x²;Zero pair" notes=";= 2x²"

::: misconception
WRONG: "3x² + 2x = 5x³."
WHY: 3x² and 2x are different shapes of tile. They don't combine into one kind. Adding never changes an exponent. Check with x = 2: 3x² + 2x = 12 + 4 = 16. But 5x³ = 5 · 8 = 40.
@viz potiles rows="3x2;2x" notes="3 squares and 2 thin tiles"
RIGHT: Only like terms combine: same variable AND same power. 3x² + 2x stays 3x² + 2x.
:::

::: example Worked Example 1 — Sort, then combine
Simplify 2x² + 3x − x² + 4 − 5x.
@viz posort bins="x² terms:2x²,−x²;x terms:3x,−5x;constants:+4" totals="x²;−2x;+4"
Step 1: Sort into like terms. Keep each sign with its term.
Step 2: 2x² − x² = x². 3x − 5x = −2x. The constant is 4.
Step 3: The answer is x² − 2x + 4.
@viz potiles rows="2x2;-x2;3x;-5x;+4 | x2;x2!;-x2!;3x!;-3x!;-2x;+4" labels="Start;Zero pairs" notes=";x² − 2x + 4"
:::
::: explain
In Worked Example 1, why can we cross out x² and −x²?
(lines 2)
=> x² + (−x²) = 0. They are a zero pair. Taking away 0 does not change the value.
:::

#### Descending and ascending order
**Descending order** starts with the highest degree. This is conventional form.
**Ascending order** starts with the lowest degree.
Move each term with the sign in front of it.
@viz flow steps="5 − 3x + x²|Find degrees: 0, 1, 2|Descending: x² − 3x + 5|Ascending: 5 − 3x + x²"

::: misconception
WRONG: "5 − 3x + x² in descending order is x² + 3x + 5."
WHY: The − belongs to 3x. The term is −3x. When it moves, its sign moves too.
@viz posort bins="degree 2:+x²;degree 1:−3x;degree 0:+5" totals="first;second;third"
RIGHT: x² − 3x + 5.
:::

::: example Worked Example 2 — Simplify and write in order
Simplify 4 + 2x³ − 6x + x³ − 1. Write it in descending order.
@viz postack heads="x³;x;1" rows="2x³;−6x;+4 | +x³;;−1" op="+" result="[[3x³]];[[−6x]];[[+3]]"
Step 1: Like terms: 2x³ + x³ = [[3x³]]. 4 − 1 = [[3]]. The x term is −6x.
Step 2: Descending order: [[3x³ − 6x + 3]].
Step 3: Ascending order: [[3 − 6x + 3x³]].
:::

::: try
1. Circle the like terms: 4x², 4x, −x², 4.
@viz potiles rows="4x2 | 4x | -x2 | +4" labels="A;B;C;D"
[[4x² and −x² (A and C).]]
2. Simplify 6x² − 2x² + x. [[4x² + x]]
3. Simplify 3x + 5 − 7x − 8. [[−4x − 3]]
4. Write 2x − 7 + x³ in descending order. [[x³ + 2x − 7]]
5. Write −x² + 6 − 4x in ascending order. [[6 − 4x − x²]]
6. Leo says 4x³ − x³ = 4. Fix his mistake. [[4x³ − x³ = 3x³. Subtract the coefficients: 4 − 1 = 3. Keep x³.]]
:::
::: retrieval
1. Name 2x² − 9 by its terms and its degree.
=> binomial, degree 2 (quadratic)
2. Write −x · x · x as a term.
=> −x³
3. Is {3/x} a polynomial?
=> No. {3/x} = 3x⁻¹. The exponent is negative.
4. Find the opposite of −4x.
=> 4x
5. ★ Stretch: Simplify x³ − 2x² + 4x² − x³ + 1. What is its degree now?
=> The x³ terms are a zero pair. 2x² + 1 has degree 2.
:::

## Section 4: Adding and subtracting
Learning target: I can add and subtract polynomials by combining like terms.

### Vocabulary
- sum :: the answer when you add :: (x + 1) + (x + 2) = 2x + 3
- difference :: the answer when you subtract :: (5x + 1) − (2x) = 3x + 1
- opposite :: the same terms with every sign flipped :: the opposite of x² − 3x + 2 is −x² + 3x − 2
- perimeter :: the distance around a shape :: add all the side lengths

#### Adding polynomials
To add, remove the brackets. Then combine like terms.
@viz potiles rows="2x2;x;-3 | x2;-2x;+1 | 3x2;x!;-x!;-x;+1!;-1!;-2" labels="2x² + x − 3;+ (x² − 2x + 1);Combine" notes=";;= [[3x² − x − 2]]"
You can also line up like terms in columns.
@viz postack heads="x²;x;1" rows="2x²;+x;−3 | +x²;−2x;+1" op="+" result="[[3x²]];[[−x]];[[−2]]"

::: example Worked Example 1 — Perimeter
A rectangle is 2x + 1 long and x + 3 wide. Find its perimeter.
@viz polygon pts="0,0;5,0;5,2.6;0,2.6" sides="2x + 1;x + 3;2x + 1;x + 3" unit=32
Step 1: Add all four sides: (2x + 1) + (x + 3) + (2x + 1) + (x + 3).
Step 2: x terms: 2x + x + 2x + x = [[6x]].
Step 3: Constants: 1 + 3 + 1 + 3 = [[8]].
Step 4: The perimeter is [[6x + 8]].
:::

#### Subtracting means adding the opposite
To subtract a polynomial, add its **opposite**. Flip the sign of EVERY term in the brackets.
(3x + 2) − (x − 5) = (3x + 2) + (−x + 5).
@viz potiles rows="x;-5 | -x;+5" labels="x − 5;Its opposite" notes=";every tile flips"
@viz potiles rows="3x;+2;-x;+5 | 2x;x!;-x!;+7" labels="3x + 2 − x + 5;Zero pair" notes=";= [[2x + 7]]"

::: misconception
WRONG: "(3x + 2) − (x − 5) = 2x − 3."
WHY: The − in front of the brackets was used on x only. The −5 must flip too. It becomes +5.
@viz postack heads="x;1" rows="3x;+2 | +(−x);+(+5)" op="+" result="[[2x]];[[+7]]"
RIGHT: Subtract every term: 3x + 2 − x + 5 = 2x + 7.
:::

::: example Worked Example 2 — Subtract with x² terms
Simplify (4x² − 3x + 1) − (x² + 2x − 6).
@viz flow steps="(4x² − 3x + 1) − (x² + 2x − 6)|Flip every sign: + (−x² − 2x + 6)|4x² − 3x + 1 − x² − 2x + 6|Combine like terms"
Step 1: Add the opposite: 4x² − 3x + 1 [[− x² − 2x + 6]].
Step 2: x²: 4x² − x² = [[3x²]]. x: −3x − 2x = [[−5x]]. Constants: 1 + 6 = [[7]].
Step 3: The difference is [[3x² − 5x + 7]].
:::
::: explain
In Worked Example 2, why does −6 become +6?
(lines 2)
=> Subtracting −6 is the same as adding its opposite, +6. Every term in the second bracket flips.
:::

::: example Worked Example 3 — Garden plots
The Kaur family has two garden plots. One has area x² + 3x. The other has area 2x² + x. Find the total area. Then find Plot B − Plot A.
@viz potiles rows="x2;3x | 2x2;x" labels="Plot A;Plot B" notes="x² + 3x;2x² + x"
Step 1: Total: (x² + 3x) + (2x² + x) = [[3x² + 4x]].
Step 2: Difference: (2x² + x) − (x² + 3x) = 2x² + x − x² − 3x = [[x² − 2x]].
Step 3: Check with x = 5. Plot A = [[40]]. Plot B = [[55]]. 55 − 40 = 15, and 5² − 2(5) = [[15]]. ✓
:::

::: try
1. Add (x² + 4x) + (3x² − x). [[4x² + 3x]]
2. Add (2x − 7) + (−5x + 3). [[−3x − 4]]
3. Write the opposite of 2x² − x + 4. [[−2x² + x − 4]]
4. Subtract (5x + 1) − (2x − 3).
@viz potiles rows="5x;+1 | -2x;+3" labels="5x + 1;Opposite of 2x − 3"
[[5x + 1 − 2x + 3 = 3x + 4]]
5. Subtract (x³ + 2x) − (4x³ − x + 2). [[x³ + 2x − 4x³ + x − 2 = −3x³ + 3x − 2]]
6. A triangle has sides x², 2x + 1 and x² + 3. Find the perimeter.
@viz polygon pts="0,0;5,0;2,2.8" sides="x² + 3;2x + 1;x²" unit=34
[[x² + (2x + 1) + (x² + 3) = 2x² + 2x + 4]]
:::
::: retrieval
1. Name x³ − 8 by its terms and degree.
=> binomial, degree 3 (cubic)
2. Simplify 5x² − x + 2x² + 4x.
=> 7x² + 3x
3. Write 3 − x² + 2x in descending order.
=> −x² + 2x + 3
4. Write 2 · x · x as a term.
=> 2x²
5. ★ Stretch: What polynomial added to 2x² − x makes 5x² + 4x − 1?
=> (5x² + 4x − 1) − (2x² − x) = 5x² + 4x − 1 − 2x² + x = 3x² + 5x − 1
:::

## Unit Synthesis
1. Write −5x³ as a product of factors. Name its coefficient and degree.
@viz poterm c="−5" v="x" e="3"
=> −5 · x · x · x. Coefficient −5. Degree 3.
2. Is 4x² − {1/x} + 2 a polynomial? Explain.
=> No. {1/x} = x⁻¹. The exponent −1 is not a counting number.
3. Simplify 3x² + 5 − x + x² − 7. Write it in descending order. Name it.
@viz potiles rows="3x2;+5;-x;x2;-7"
=> 4x² − x − 2. A quadratic trinomial (degree 2).
4. Simplify (2x² + 3x − 4) − (x² − x − 4).
=> 2x² + 3x − 4 − x² + x + 4 = x² + 4x
5. A square tile pattern: Figure x has x² + 2x tiles. Figure x of a second pattern has x² + 1 tiles. How many more tiles does the first pattern have? Check with x = 3.
=> (x² + 2x) − (x² + 1) = 2x − 1. Check: 15 − 10 = 5 and 2(3) − 1 = 5. ✓
6. Ella says 2x² + 3x = 5x³. Explain her mistake.
=> 2x² and 3x are not like terms (different exponents). They can't combine. Adding never changes an exponent.
7. Look back at the Pre-Knowledge Check. What would you change now?
=> Answers vary.

## Concept Reference
::: key Terms and powers
A power is repeated multiplication: x³ = x · x · x.
A term is a coefficient times a power of x: 3x² = 3 · x · x.
Conventional form: x not 1x, x not x¹, 5 not 5x⁰, −x² not −1x².
:::
@viz poterm c="3" v="x" e="2" clabel="coefficient" vlabel="variable" elabel="exponent" expand="3x² = 3 · x · x"

::: key Naming polynomials
A polynomial is a sum of terms. Each exponent is a counting number. A constant is allowed.
Not polynomials: {1/x}, √x, x⁻¹.
By terms: monomial (1), binomial (2), trinomial (3).
By degree (the highest exponent): constant (0), linear (1), quadratic (2), cubic (3), degree n.
:::
@viz posort bins="Monomial:4x²,−7;Binomial:x³ + 1;Trinomial:x² + 2x + 3"

::: key Like terms and order
Like terms: same variable AND same exponent. Add their coefficients. Keep the power.
Descending order: highest degree first (conventional). Ascending: lowest first.
Each sign moves with its term.
:::
@viz potiles rows="3x2;-x2 | 3x;-2x | +4;-1" labels="like;like;like"

::: key Adding and subtracting
Add: drop the brackets and combine like terms.
Subtract: add the opposite. Flip EVERY sign in the second bracket.
:::
@viz postack heads="x²;x;1" rows="4x²;−3x;+1 | −x²;−2x;+6" op="+" result="3x²;−5x;+7"

| Mistake | Fix |
|---|---|
| x² = 2x | x² = x · x. 2x = x + x. |
| Degree = number of terms | Degree = highest exponent. x³ + 1 has degree 3. |
| 3x² + 2x = 5x³ | Only like terms combine. It stays 3x² + 2x. |
| 5 − 3x + x² → x² + 3x + 5 | Move the sign with the term: x² − 3x + 5. |
| (3x + 2) − (x − 5) = 2x − 3 | Flip every sign: 3x + 2 − x + 5 = 2x + 7. |
