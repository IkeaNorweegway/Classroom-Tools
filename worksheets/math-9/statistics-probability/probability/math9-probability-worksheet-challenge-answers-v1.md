# Probability — Challenge Worksheet Answer Key ★★
Grade 9 Mathematics · Teacher Copy — Not for Students

*Cover the answer. Try the question. Then check.*

**Format note:** Setup and decision step shown. Final answer listed. Full execution left to student to verify.

---

**1.** Error analysis

**(a) "Tails 10 times — heads is overdue":**

> **Error named: The Gambler's Fallacy.**
>
> **Correct reasoning:** A fair coin has no memory. Each flip is a completely independent event. P(heads) = 1/2 on every flip, regardless of what happened before. The coin does not "owe" any outcome.

**(b) P(both red) without replacement, treated as with replacement:**

> **Error:** Used the same denominator (10) for both draws — didn't account for "without replacement." After drawing one red, only 9 marbles remain and only 4 reds.
>
> **Setup:** P(both red) = (5/10) × (4/9)
>
> **Final answer: P(both red) = 20/90 = 2/9**

**(c) "P(A or B) = P(A) × P(B)":**

> **Error:** Used the multiplication rule (for AND) instead of the addition rule (for OR). Multiplication applies when BOTH events must happen. OR requires addition.
>
> **Correct formula:** For mutually exclusive events (can't happen at same time):
> **P(A or B) = P(A) + P(B)**

---

**2.** Dependent events — class of 15 (8 boys, 7 girls), 3 chosen without replacement

**(a) P(all three girls):**

> **Setup:** (7/15) × (6/14) × (5/13) = 210/2730
>
> **Final answer: 210/2730 = 1/13**

**(b) P(first two boys, third girl):**

> **Setup:** (8/15) × (7/14) × (7/13)
> After 2 boys drawn: 8 boys→6 boys, but 7 girls unchanged, 13 total.
> Wait: 15-2=13 remain, still 7 girls. P(G|2 boys)=7/13.
>
> **Final answer: (8/15)(7/14)(7/13) = 392/2730 = 28/195**

**(c) P(at least one girl):**

> **Setup:** P(all boys) = (8/15)(7/14)(6/13) = 336/2730 = 8/65
>
> P(at least one girl) = 1 − 8/65 = **57/65**

---

**3.** Two dice — sum table

**(a) Completed sum table:**

| + | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| 2 | 3 | 4 | **5** | **6** | **7** | **8** |
| 3 | 4 | **5** | **6** | **7** | **8** | **9** |
| 4 | **5** | **6** | **7** | **8** | **9** | **10** |
| 5 | **6** | **7** | **8** | **9** | **10** | **11** |
| 6 | **7** | **8** | **9** | **10** | **11** | **12** |

**(b) P(sum is prime) — primes: {2,3,5,7,11}:**

> Sum=2: 1 way | Sum=3: 2 ways | Sum=5: 4 ways | Sum=7: 6 ways | Sum=11: 2 ways
> Total = **15** outcomes | **P = 15/36 = 5/12**

**(c) P(sum divisible by 4):**

> Sum=4: (1,3),(2,2),(3,1)=3 | Sum=8: (2,6),(3,5),(4,4),(5,3),(6,2)=5 | Sum=12: (6,6)=1
> Total = **9** | **P = 9/36 = 1/4**

**(d) P(at least one 6):**

> **Setup:** P(no 6 on either die) = (5/6)(5/6) = 25/36
>
> P(at least one 6) = 1 − 25/36 = **11/36**

---

**4.** Experimental vs. theoretical — 200 coin flips, 112 heads

**(a)** Experimental P(heads) = 112/200 = **0.56**

**(b)** Theoretical P(heads) = **0.5**

**(c) Not "wrong" — expected due to chance:**

> Experimental probability naturally varies from theoretical, especially with a relatively small sample. With 10,000 flips, the experimental probability would converge much closer to 0.5 (Law of Large Numbers) — because the influence of any short-term run diminishes as the sample grows.

**(d) Conclusion of bias not justified:**

> A difference of 12/200 (0.56 vs 0.5) falls within normal random variation. Claiming a coin is biased would require a proper statistical test (like a chi-squared test) and typically thousands more trials. 200 flips with 112 heads is plausible even for a perfectly fair coin.

---

**5.** Locker combination — 3 digits from 0–9

**(a)** Total combinations: 10 × 10 × 10 = **1000**

**(b) P(all three digits the same):**

> Combinations: {000,111,222,...,999} = **10**
> P = 10/1000 = **1/100**

**(c) P(first digit is 0):**

> First digit = 0: 1 × 10 × 10 = 100 combinations
> P = 100/1000 = **1/10**

**(d) P(combination > 499) — first digit must be 5,6,7,8, or 9:**

> 5 × 10 × 10 = 500 combinations
> P = 500/1000 = **1/2**

---

**6.** Cultural event — 12 cards (4 seasons × 3 each), 2 drawn without replacement

**(a) P(both summer):**

> **Setup:** (3/12) × (2/11) = 6/132
>
> **= 1/22**

**(b) P(both same season):**

> Each season contributes (3/12)(2/11) = 1/22.
> 4 seasons × 1/22 = **4/22 = 2/11**

**(c) P(different seasons):**

> 1 − 2/11 = **9/11**

---

**7.** "At least one" strategy — 3 defective, 7 working (10 total)

**(a) P(no defective bulbs):**

> **Setup:** (7/10)(6/9)(5/8) = 210/720
>
> **= 7/24**

**(b) P(at least one defective):**

> 1 − 7/24 = **17/24 ≈ 0.708**

**(c) P(exactly three defective):**

> (3/10)(2/9)(1/8) = 6/720 = **1/120 ≈ 0.008**
>
> This is one component of P(at least one). P(exactly 1)+P(exactly 2)+P(exactly 3) should equal 17/24. The fact that P(exactly 3)=1/120 is small confirms it's an uncommon outcome, consistent with 17/24 being the overall "at least one" probability.

---

**8.** Design a problem — model answer

*(Accept any valid Alberta-context problem requiring dependent multiplication with two or more steps.)*

> **Problem:** An Edson community centre holds a raffle with 8 tickets: 5 winning and 3 losing. Two tickets are drawn without replacement. What is the probability that both are winning tickets?
>
> **Sample space:** 8 tickets total; draw 1 from 8, then draw 1 from remaining 7.
>
> **Solution:**
> P(winning draw 1) = 5/8
> After one winning ticket removed: 4 winning remain, 7 total.
> P(winning draw 2 | winning draw 1) = 4/7
>
> P(both winning) = (5/8)(4/7) = 20/56 = **5/14 ≈ 0.357**
