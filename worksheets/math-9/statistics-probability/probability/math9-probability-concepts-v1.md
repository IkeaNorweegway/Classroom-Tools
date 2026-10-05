# Probability — Concept Summary
Grade 9 Mathematics · Alberta Curriculum

---

## Key Vocabulary

| Term | Meaning | Example |
|---|---|---|
| Sample space | All possible outcomes | {H, T} for a coin flip |
| Event | One or more outcomes of interest | Getting an even number |
| Theoretical probability | Calculated from equally likely outcomes | P(even on a die) = 3/6 = 1/2 |
| Experimental probability | From actual trials | 14 heads in 20 flips = 14/20 = 0.7 |
| Complementary event | All outcomes that are NOT event A | P(not A) = 1 − P(A) |
| Independent events | Outcome of one does not affect the other | Two coin flips |
| Dependent events | Outcome of first changes the probability of the second | Drawing without replacement |

---

## Formulas

**Theoretical probability:** P(A) = (favourable outcomes) / (total outcomes)

**Complement:** P(not A) = 1 − P(A)

**Fundamental Counting Principle:** n₁ × n₂ × n₃ × ... (for sequential events)

**Independent events:** P(A and B) = P(A) × P(B)

**Dependent events:** P(A then B) = P(A) × P(B | A)
where P(B | A) = probability of B given A already happened

---

## Worked Example 1 — Independent events

**Bag: 3 red, 5 blue (8 total). Draw one marble, replace it, draw again.**

> P(red on draw 1) = 3/8
>
> P(blue on draw 2) = 5/8 ← same because replacement restores the bag
>
> P(red then blue) = (3/8) × (5/8) = **15/64**

---

## Worked Example 2 — Dependent events

**Same bag (3 red, 5 blue). Draw WITHOUT replacement.**

> P(red on draw 1) = 3/8
>
> After removing 1 red: 2 red remain, 7 total remain
>
> P(red on draw 2 | red on draw 1) = **2/7**
>
> P(red then red) = (3/8) × (2/7) = **6/56 = 3/28**

---

## Worked Example 3 — Sample space

**Roll two dice. P(sum = 8).**

> Total outcomes = 6 × 6 = **36**
>
> Outcomes summing to 8: (2,6), (3,5), (4,4), (5,3), (6,2) → **5 outcomes**
>
> P(sum = 8) = **5/36**

---

## The Gambler's Fallacy — Do NOT believe this

"Getting tails 5 times in a row means heads is 'due.'"

**Wrong.** Independent events have no memory. P(heads) = 1/2 on every flip, regardless of past results.

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Theoretical P = what will happen | P tells you the long-run tendency, not what must happen |
| Not updating the sample space for dependent events | After each draw without replacement, recalculate the new total and favourable count |
| Gambler's fallacy | Each independent event starts fresh |
| Forgetting to list all outcomes in sample space | Use tree diagram, table, or organized list to be complete |

---

*Self-check: A bag has 4 red and 6 green. Two drawn without replacement. Can you find P(red then green)?*
