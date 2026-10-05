# Statistics and Data Analysis — Challenge Worksheet Answer Key ★★
Grade 9 Mathematics · Teacher Copy — Not for Students

*Cover the answer. Try the question. Then check.*

**Format note:** Conceptual setup shown. Full response provided for explanatory questions. Calculations shown in full.

---

**1.** Error analysis

**(a) "Line passes through 5 of 8 points — good fit":**

> **Why this is wrong:** A line of best fit is a model of the *overall trend*, not a line that touches individual points. Data points have measurement noise — a line that weaves through many individual points may capture that noise rather than the trend. A good fit minimizes the total distance from ALL points (roughly equal numbers above and below), not the count of points it literally touches. A line that touches 5 points while ignoring the trend of the other 3 is a worse model than one that touches 0 points but captures the direction perfectly.

**(b) "Slope 3.2 means positive correlation":**

> **Incomplete.** The slope being positive tells you the *direction* (positive), but correlation description also requires **strength**. A slope of 3.2 could come from a tightly clustered strong correlation or from a loosely scattered weak correlation — the slope alone doesn't distinguish these. You need to describe both direction AND strength (e.g., "strong positive" or "weak positive").

**(c) "r = 0.98 proves causation":**

> **Wrong.** Correlation, even near-perfect correlation (r = 0.98), does not establish causation. A counter-example: shoe size in children is positively correlated (r ≈ 0.95) with reading ability — but shoe size doesn't cause reading ability. Both are caused by age. High correlation only shows that two things change together; it says nothing about WHY.

---

**2.** Two lines of best fit

**(a) Equations:**

> Line A: through (2,50) and (8,80). m=(80−50)/(8−2)=30/6=**5**. b=50−5(2)=**40**. **Equation: y=5x+40**
>
> Line B: through (0,40) and (10,90). m=(90−40)/(10−0)=50/10=**5**. b=**40**. **Equation: y=5x+40**
>
> **Both equations are identical.** The students chose different points but ended up with the same line.

**(b) At x=5:**

> Both: y=5(5)+40=**65**. Both give the same prediction.

**(c) Data point (5,65):**

> Distance from both lines = |65−65|=**0**. The point (5,65) lies exactly on both lines.

**(d) Why both can be "acceptable":**

> Drawing a line of best fit by inspection involves judgment — two people can draw slightly different lines through the same data and both be "acceptable" if each has roughly equal points above and below, follows the trend, and captures the general direction. In this case, their choices led to the same line by coincidence. In general, there is a range of "acceptable" lines for any scatter plot, though some are better models than others.

---

**3.** Full data analysis — Edmonton schools

**(a)-(b) Scatter plot and line of best fit:**

> Homework (20–90 min) vs. exam average (58–88%).
> Clear positive trend. Sample calculation using (20,58) and (90,88):
> m=(88−58)/(90−20)=30/70≈**0.43**. b=58−0.43(20)≈**49.4**.
> **Equation: y ≈ 0.43x + 49.4** *(student lines will vary — accept any reasonable fit)*

**(c) Correlation:**

> **Strong positive correlation** — exam scores consistently increase with homework time, points cluster closely along the line.

**(d) Predict at 55 min:**

> y≈0.43(55)+49.4≈23.7+49.4≈**73%**
> **Interpolation** (55 is within the 20–90 minute range). Reasonably reliable.

**(e) Predict at 100 min — extrapolation:**

> y≈0.43(100)+49.4≈**92.4%**
> **Extrapolation** — beyond the data range. One reason for unreliability: excessive homework may cause stress, sleep deprivation, or burnout, reducing performance. The linear trend may not continue indefinitely. Also, exam scores have a ceiling of 100%.

**(f) Causation?**

> No — this is an observational study, not a controlled experiment. Possible confounders: **school resources** (better-resourced schools have both more homework and better exam results), **teacher quality**, **student motivation**, **family support**, or **socioeconomic status**. The study can show association, not causation.

---

**4.** Confounders

**(a) Countries with more doctors → longer life expectancy:**

> Confounder: **wealth/GDP per capita**.
> Richer countries can afford both more doctors AND better nutrition, sanitation, and healthcare access — all of which independently increase life expectancy. The relationship between doctors and longevity may be partly indirect.

**(b) More books → higher reading scores:**

> Confounder: **parental education level** (or socioeconomic status).
> Educated parents tend to buy more books AND to read with their children, model literacy habits, and provide more language-rich environments — all of which drive reading ability directly.

**(c) Shoe size ↔ reading ability in children:**

> Confounder: **age**.
> Older children have both larger feet AND more developed reading skills. Age causes both independently — the apparent correlation between shoe size and reading disappears if you look only within a single age group.

---

**5.** Extrapolation limitations — tree height h = 0.8a + 2

**(a) Age 50:** h = 0.8(50)+2 = **42 m**

**(b) Age 100:** h = 0.8(100)+2 = **82 m**

**(c) Age 200:** h = 0.8(200)+2 = **162 m**

**(d) When does the model break down?**

> The tallest trees on Earth reach about 100–115 m. The model predicts 82 m at age 100 (approaching real limits) and clearly breaks down beyond that. Tree growth is not linear — it slows as the tree matures, following a logistic (S-curve) pattern. The linear model was only validated for young trees (5–30 years) and should not be extended to old-growth.

**(e) Height at age 0 (y-intercept):**

> h = 2 m at planting. Most seeds start near ground level — 2 m at "age 0" may represent size at planting of a seedling, not a seed. The model doesn't capture very early germination. This is another reason the model has a limited domain of validity.

---

**6.** Outlier — hybrid sports car

**(a) Effect on line of best fit:**

> The outlier (large engine, high efficiency) sits far above the trend (which shows larger engines = worse efficiency). It would pull the right end of the line upward, **weakening the apparent negative correlation** and reducing the slope magnitude.

**(b) Case for removing:**

> Remove if the outlier represents a categorically different type of car (hybrid technology makes it fundamentally different from the conventional cars in the sample). If the purpose is to model conventional cars, including a hybrid contaminates the model. An outlier due to category mismatch should be removed or analyzed separately.

**(c) Case for keeping:**

> Keep if the purpose is to represent the full market (including hybrids). Removing it hides real variation and makes the model less representative. The outlier is a valid data point — it just belongs to a different sub-population.

**(d) Decision:**

> **Keep it, but note its nature.** Report the main trend for conventional cars and flag the hybrid separately. A responsible analysis explains the outlier rather than erasing it. If the study specifically targets conventional vehicles, separate analyses are appropriate.

---

**7.** Reverse reasoning — y = −5x + 120, domain 4 ≤ x ≤ 18

**(a) Type of correlation:**

> **Negative correlation** (slope = −5)

**(b) Real-world context:**

> Weekly hours of TV watching (x) and physical fitness score (y). As TV time increases, fitness decreases. Or: hours of idle sitting vs. stamina score, etc. *(Accept any contextually sensible negative relationship.)*

**(c) Prediction at x=10:**

> y = −5(10)+120 = **70**. **Interpolation** (10 is within 4–18). Reliable.

**(d) When does y=0?**

> 0 = −5x+120 → x = **24 hours/week** of TV.
> In context: the model predicts a fitness score of 0 at 24 hours per week. This represents "zero fitness" — at extreme sedentary behaviour the model breaks down (fitness can't go below 0, and 24 h/week of TV, while plausible, is outside the observed domain).
