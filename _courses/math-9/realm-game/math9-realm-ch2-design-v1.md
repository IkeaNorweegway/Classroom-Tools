# The Measure of the Realm — Chapter 2 Design v1
## "The Blight" · Powers and exponents · Sigil: Growth
*Built 2026-11-14 (board T-029); the story lines and later fixes are in `math9-realm-ch2-script-v1.md`. Written 2026-11-14; brought in line with the build 2026-11-15 (board T-041). Story: `math9-realm-story-v1.md`, §6. Same shape as `math9-realm-ch1-design-v1.md`; anything not said here works as in Chapter 1.*

> **Gate (games):** Outcomes: PE1–PE7. Model: a step-based story; every check is an exact value (an integer or a fraction, equivalent forms accepted) or an exact exponent on a given base; the rune breaks only when the prediction, test and fix are right. Turn-based. Test hook included (`?debug=1`, `auto=right|second|wrong`, a `solve` on every panel).

**Read with:** `notes-packages/math-9/powers-exponents/math9-powers-notes-v1.md` (every quest matches one section), `_courses/math-9/_context.md` (depth ceiling: integer exponents only), `_games-context.md` (story engine rules).

**I can** (under the title): *I can write and evaluate powers, use the exponent laws and explain why each one works, and say what a zero or a negative exponent means.*

---

## 1. What changed from the story bible

The notes have seven sections, one per code. The bible's list had four quests, no PE2 quest, and put the boulder (PE7) second. Chapter 2 now has **the lesson plus one quest per notes section, in notes order**:

| Notes section | Code | In the game |
|---|---|---|
| 1 What is a power? | PE1 | The lesson (Hesper's spell-seed and the turnabout charm) |
| 2 The zero exponent | PE2 | **The moss tally** (new); again in the moth-smoke and the rune |
| 3 Product of powers | PE3 | The blight cure |
| 4 Quotient of powers | PE4 | Hollow-moths at the mill |
| 5 Power of a power | PE5 | **The nests in the well-house** (split from the bible's moth quest) |
| 6 Power of a product and quotient | PE6 | Pell's spell jar |
| 7 Negative exponents | PE7 | The boulder on the road (moved to last); the rune |

Other changes:
- **The cat.** The bible has the familiar turn up in Chapter 1. Chapter 1 was built without it, so it arrives here, as the first use of Growth (§8).
- **The rune** keeps both false lines (3⁰ = 0, a negative exponent makes a negative) and is tested on one dividing ladder, 3³ down to 3⁻².
- **New person:** Bram Ostler, a carter (the boulder). Everyone else is the Chapter 1 cast.

The bible's Chapter 2 list and the familiar's line (§2) are updated to match.

---

## 2. Shape of the chapter

Notes order, with the soft gate before each new section, as in Chapter 1.

```
ch2_open → lesson                                        (after notes Section 1)
gate:2 → tally                                           (after Section 2)
gate:3 → cure                                            (after Section 3)
gate:4 → moths                                           (after Section 4)
gate:5 → nests                                           (after Section 5)
gate:6 → jar                                             (after Section 6)
gate:7 → boulder → vault (rune) → sigil → vine → chapter_end   (after Section 7)
```

| Part | Time | Save point |
|---|---|---|
| Opening + lesson | ~10 min | each step |
| Each quest (six) | 7–9 min | each step |
| Boulder to chapter end | ~20 min | each step; the rune saves at each stage |
| **Whole chapter** | **~85 min**, spread across the unit | |

**Modes, tries, the answer after the last try, the "third" tier:** as Chapter 1. **The hint button** is **Ask Hesper**.

**Starting Chapter 2:** it opens when Chapter 1 is finished. A class that starts the game at this unit can start here: Hesper gives a three-line recap, the hero is made on the usual screen, and the Balance sigil is lent (5 pips' worth of nothing: the cellar stays shut). See §13.

---

## 3. People of Chapter 2

| Person | Where | Role |
|---|---|---|
| **Hesper Marrow** | Her cottage and seed bed | Mentor; the lesson, starts each quest |
| **Pell** | Follows you; his own quest at the seed bed | Says the misconception first, as before |
| **Reeve Odile Marsh** | The common barn | The moss tally |
| **Rowan Tull** | The fold's pasture | The blight cure |
| **Abel Crane** | The mill (one room) | Hollow-moths |
| **Marta Fenn** | The well-house | The nests |
| **Bram Ostler**, carter *(new)* | The Low Road, by the boulder | The boulder |
| **Orrin Vael** | The Low Road, then the vault | Asks the boulder's and the rune's "why?" questions |
| **Tobin** | Highstead | The extra Highstead farmer (`fam2`), renamed so there is one Bram |
| **Gale Harrow** | The tower yard, Highstead | The seed vault |
| **Sefa** | The tower-yard fence | Watches the vault open (§7) |
| **The cat** | A ledge above the mill pond | Rescued with the first vine; the student names it |

**Hesper's lines:**
- First try right: *"That's it. And you could tell me why, which is the part that counts."* (After the first time she names the skill, as in Chapter 1.)
- A wrong answer: *"Write it out the long way first. How many of them are you multiplying?"*

**Bram Ostler** (for the voxel pack): a broad man of about fifty, weathered face, short grey beard, flat brown cap, oatmeal shirt with rolled sleeves, dark green waistcoat, mud-brown trousers and boots. Holds a carter's whip (a thin stick). Clips: the usual `idle walk talk cheer`.

---

## 4. Opening: "Grey on the stubble" (~3 min, no maths)

1. Morning, a few weeks after the grain-share stone. Pell runs in: the stubble in the north field has gone grey overnight, and the grain sacks in the barn have grey moths on them.
2. Hesper looks at a grey stalk. *"Blight. It spreads the way everything living spreads: not a bit more each day, but so many **times** more."* She has one answer, cure-moss, which eats blight and spreads the same way.
3. *"And we will need clean seed from the Highstead vault before the snow. One thing at a time. First you learn how growing is counted."*

Sets up: the blight (the Unweaving reaching the harvest), the moths (the Hollow's doing; said at the mill), the vault.

---

## 5. The lesson: the spell-seed (PE1)

**Setting:** Hesper's windowsill. She plants **one** spell-seed. It splits in two every night.

**Worked example** (a `T.box` that grows the row of seeds night by night):
- Night 1: 2. Night 2: 2 × 2 = 4. Night 3: 2 × 2 × 2 = 8.
- *"After five nights: 2 × 2 × 2 × 2 × 2. Too long to write, so we write **2⁵**. The 2 is the **base**, the thing that repeats. The 5 is the **exponent**: how many 2s."* 2⁵ = 32.

**Pell's guess:** "2⁵. Two fives. Ten."

**Self-explanation** (`T.ask`, key `pe1_lesson`; shuffled): *"Why is 2⁵ equal to 32 and not 10?"*

| Option | Right? | Feedback on a wrong pick |
|---|---|---|
| "The exponent counts how many 2s are multiplied: 2 × 2 × 2 × 2 × 2 = 32." | ✓ | — |
| "2⁵ means 2 × 5, and that's 10." | ✗ (the notes' pre-knowledge question) | "2 × 5 is five 2s **added**. The seeds double. Count the nights: 2, 4, 8, 16, 32." |
| "2⁵ means 5 × 5 = 25." | ✗ | "That's 5². The base is the number that repeats, and here it's 2." |
| "It's 2 × 2 × 2 × 2 × 2 × 2 = 64: one 2 for the seed and five for the nights." | ✗ | "The exponent 5 means exactly five 2s. The first seed is the 1 you start with." |

**Check 1** (`T.frac`, key `pe1_seeds`): seeds after 6 nights: 2⁶ = **64**. Named error 12: "That's 2 × 6. Double six times."

**The turnabout charm** (negative bases). Hesper's weather charm, for airing the hen-house, turns warm to cold and back, twice as strong each turn: every turn multiplies by **−2**. From 1: −2, 4, −8, 16.
- **Pell:** "Five turns… 32. The negatives cancel."
- **Check 2** (`T.frac`, key `pe1_turn`): (−2)⁵ = **−32**. Named error 32: "Pair the negatives off. Five of them leaves one without a partner." Named error −10: "That's −2 × 5. Multiply five −2s."
- **Check 3** (`T.frac`, key `pe1_brackets`): Pell chalks four turns as **−2⁴** and says "16". *"As Pell wrote it, with no brackets, what is −2⁴?"* **−16**. Named error 16: "That's (−2)⁴. Without brackets the base is only the 2: work out 2⁴ first, then put the minus sign on."
- **`T.typed`** (id `pe1_pell`, at least 30 characters): *"Explain to Pell, in your own words, why −2⁴ and (−2)⁴ are different."* (Notes Section 1, retrieval Q3.) Kept for the report, not marked.

---

## 6. The help quests

Two input kinds are used below:
- **`T.frac`**: a typed exact value, as in Chapter 1 (whole numbers and fractions).
- **Power card** (new panel, §12): the base is printed and the student types the **exponent** (some cards also have a box for a number in front). It is used when the answer is a single power.

### 6.1 The moss tally (PE2) — Reeve Odile Marsh
- **Problem:** Hesper has started a cure-moss on the common field that **triples every day**. Odile keeps the tally board for the village and must write in how much Hesper planted on day 0. Her board, newest first: **Day 4: 81 · Day 3: 27 · Day 2: __ · Day 1: __ · Day 0: __**.
- **Pell:** "Day 0? Nought days, nought moss. Write a zero."
- **The board** (pattern panel, §12): the student fills Day 2 (**9**) and Day 1 (**3**); each filled row shows "÷ 3" beside it. These two are steps, not recorded checks.
- **Check 1** (`T.frac`, key `pe2_day0`, the pip): Day 0, which is 3⁰: **1**. Named error 0: "No moss on day 0 means nothing to triple, and the field would still be bare. Each row back divides by 3. What is 3 ÷ 3?" Named error 3: "That's day 1. One more row back."
- **Check 2** (`T.frac`, key `pe2_other`): the mill yard gets a different moss that grows **5 times** a day. Abel's slate says **Day 2: 25 · Day 1: 5**. What goes on day 0? 5⁰ = **1**. Named error 0: "Day 1 is 5. What do you divide by to go back a day?" Named error 5: "That's day 1. One more day back." (The slate gives the pattern, so day 0 can be worked out.)
- **Check 3** (`T.ask`, key `pe2_why`): *"Why do both mosses come to 1 on day 0, whatever they multiply by?"* Right: "**Each day back divides by the base. Day 1 is the base itself, and the base divided by itself is 1.**" Wrong: "Because zero days means zero moss" (feedback: "Then day 1 would be 3 × 0. Is it?"); "Because a number with exponent 0 stays as it is, so 3⁰ = 3" (feedback: "That's day 1, 3¹."); "It's just a rule the Wardens agreed on" (feedback: "A spell you cannot explain will fail you. Walk down the board.").
- **Check 4** (`T.frac`, key `pe2_negzero`, added 2026-11-15): Pell says Hesper's turnabout seed, base −15 to the exponent 0, must be −1. (−15)⁰ = **1**. Named errors −1, 0, −15 (script).
- **Hint:** "Go down the board one row at a time. What do you do to 27 to get the row below?"
- **Why:** "81, 27, 9, 3: each row is the one above divided by 3. 3 ÷ 3 = 1, so 3⁰ = 1."
- **Payoff:** Odile writes "1 patch, H. Marrow" and laughs: *"One patch. And in four days it's eighty-one. I'd like my hens to do that."*
- **Left out on purpose:** 0⁰ (the notes call it undefined). Hesper has one line if the student asks her afterwards: "Nothing can't triple. Zero isn't a base I'd plant."

### 6.2 The blight cure (PE3) — Rowan Tull
- **Problem:** the fold's pasture has about **500** blighted spots. Rowan put down one patch of a cure-moss that **doubles every day**. It has grown for **6 days**. Hesper says the frost comes in **3 more**. Will there be enough patches?
- **Pell:** "Six days, then three more. Two to the… eighteen? Six times three."
- **Check 1** (power card, base 2, key `pe3_cure`, the pip): 2⁶ × 2³ as one power: **2⁹**. Named error 18: "You multiplied the exponents. Count the 2s: six of them, then three more." Named error 3 or 6: "That's one stretch of days. Put the two together."
- **Check 2** (`T.frac`, key `pe3_value`): how many patches is that? **512**. Then a `T.ask` for the meaning (not recorded): enough for 500 spots? **Yes, 512 is more than 500, just.** Wrong: "No, 2⁹ is only 18"; "Yes, there'll be thousands".
- **Check 3** (`T.ask`, key `pe3_bases`): Rowan's far bed has **2³ rows** with **3² patches** in each row. Pell: "2³ × 3². Same trick: 6⁵!" *Is he right?* Right: "**No. The bases are different, so there isn't one pile of the same factor to count. It's 8 × 9 = 72.**" Wrong: "Yes: multiply the bases and add the exponents" (feedback: "6⁵ is 7776. Count the bed: 8 rows of 9."); "No, it's 6⁶: multiply the bases and multiply the exponents" (feedback: "Still one base where there are two. Work out each power first.").
- **Hint:** "Write 2⁶ as six 2s and 2³ as three 2s, side by side. How many 2s are there?"
- **Why:** "2⁶ × 2³ = (2×2×2×2×2×2) × (2×2×2) = nine 2s = 2⁹ = 512."
- **Payoff:** green moss spreads over the grey spots as the days tick by; the lambs go back on the grass.

### 6.3 Hollow-moths at the mill (PE4) — Abel Crane
- **Problem:** grey moths are in the mill (one room, no loft). Hesper counts them by threes: the mill holds **3⁷** moths. One pot of her moth-smoke clears **3⁴** moths. How many pots for the mill?
- **Abel:** "They weren't here before that grey-cloak came through."
- **Pell:** "Seven divided by four doesn't even go. So… three to the eleven?"
- **Check 1** (power card, base 3, key `pe4_moths`, the pip): 3⁷ ÷ 3⁴ = **3³**. Named error 11: "You added. That's for multiplying powers. Each pot **takes away** four 3s." Named error 28: "You multiplied the exponents. Cancel instead: four 3s from seven."
- **Check 2** (`T.frac`, key `pe4_pots`): how many pots? **27**. Named error 9: "That's 3 × 3. 3³ is three 3s multiplied."
- **Check 3** (power card, base 3, then `T.frac`; key `pe4_equal`): the grain nook has **3⁴** moths. Pots for the nook: 3⁴ ÷ 3⁴ = **3⁰** = **1** pot. Named error on the value, 0: "No pots for 81 moths? A number divided by itself is 1. That's 3⁰ again, from Odile's board." (PE2 brought back.)
- **Check 4** (`T.ask`, key `pe4_why`): *"Why do you subtract the exponents when you divide?"* Right: "**Each 3 underneath cancels one 3 on top. Seven 3s with four cancelled leaves three.**" Wrong: "Because dividing is the opposite of multiplying, so you do the opposite to the base"; "Because 7 ÷ 4 can't be done, so you subtract instead".
- **Hint:** "Write seven 3s over four 3s. Cross them off in pairs, one from the top and one from the bottom."
- **Why:** "(3×3×3×3×3×3×3) ÷ (3×3×3×3): four pairs cancel and 3×3×3 is left. 3³ = 27."
- **Payoff:** the pots are lit three at a time until all twenty-seven have burned; the moths pour out of the window in a long grey ribbon.

### 6.4 The nests in the well-house (PE5) — Marta Fenn
- **Problem:** the moths that fled the mill have nested in the well-house roof. Hesper watches a nest: the moths hatch twice a night, and each hatching triples them, so the swarm grows **3² times every night**. Marta can't light smoke by the well for **4 nights**. How many times bigger will the swarm be?
- **Pell:** "Three squared, four times over. Two and four… 3⁶."
- **Check 1** (power card, base 3, key `pe5_nest`, the pip): (3²)⁴ = **3⁸**. Named error 6: "You added. Write it out: 3² × 3² × 3² × 3². How many 3s?" Named error 16: "You raised 2 to the 4. Four lots of two 3s is 4 × 2 = 8 threes."
- **Check 2** (two power cards, key `pe5_pair`): Abel's slate has both: **3² × 3⁴** (two swarms multiplied) and **(3²)⁴** (one swarm, four nights). Simplify each: **3⁶** and **3⁸**. Feedback if swapped: "Look at what joins them. Two powers multiplied: add. A power raised to a power: multiply."
- **Check 3** (`T.ask`, key `pe5_same`; Hesper's voice asks it, not Marta): Hesper can feed her moss to double **three times a day for four days**, or **four times a day for three days** (said in her line before the panel). The question is only "Which plan grows more?" Right: "**The same. (2³)⁴ and (2⁴)³ are both twelve doublings, 2¹².**" Wrong: "Three times a day for four days, because there are more days"; "Four times a day for three days, because the bigger exponent is inside the brackets". (Notes Section 5, retrieval Q4.)
- **Hint:** "(3²)⁴ means 3² written four times and multiplied. Count the 3s."
- **Why:** "(3²)⁴ = 3² × 3² × 3² × 3² = eight 3s = 3⁸ (6561 times bigger)."
- **Payoff:** Marta, on hearing "six thousand times": *"Then we don't wait."* She and the apprentice carry the well bucket out and smoke the roof that evening.

### 6.5 Pell's spell jar (PE6) — Pell, at Hesper's seed bed
- **Problem:** Hesper asked Pell to fill a **square** seed bed for the winter herbs. Each side is **2 trays of 3 pots**. Pell fetched **2 × 3²** seeds in his jar and says the bed is full.
- **Predict** (`T.ask`, key `pe6_predict`): *"Is (2 × 3)² the same as 2 × 3²?"* Right: "**No. In (2 × 3)² the square covers the 2 and the 3. In 2 × 3² only the 3 is squared.**" Wrong: "Yes, the brackets don't change a multiplication"; "Yes, both are 2 × 3 × 2".
- **Check 1** (`T.frac`, key `pe6_jar`, the pip): pots in the bed, (2 × 3)²: **36**. Named error 18: "That's Pell's jar, 2 × 3². The bed is 6 by 6." Named error 12: "That's 6 × 2. Squaring means 6 × 6." Then one line: Pell is **18 seeds short**.
- **Check 2** (power card with a number in front, key `pe6_coef`): Hesper's seed crates are cubes, **2x** hands along each edge, where x is the width of one pot. The crate's volume: (2x)³ = **8x³**. Named error 2 in front: "The exponent belongs to the 2 as well. (2x)(2x)(2x)." Named error 6 in front: "2³ is 2 × 2 × 2, not 2 × 3."
- **Check 3** (`T.frac`, key `pe6_quot`): a small square bed is **⅔ of a pace** on each side. What fraction of a square pace does it cover? (⅔)² = **4⁄9**. Named error 4⁄3: "You squared the top only." Named error 2⁄9: "You squared the bottom only." Named error ⅔ (or 4⁄6): "That's the side, not the square. Multiply ⅔ by ⅔."
- **Check 4** (`T.ask`, key `pe6_sum`): Pell, trying again: "A bed with 3 + 4 pots on a side. That's 3² + 4² pots." Right: "**No. (3 + 4)² = 7² = 49, but 3² + 4² = 25. Exponents spread over × and ÷, not + and −.**" Wrong: "Yes, the exponent goes to each number in the brackets"; "No, it's 3² × 4² = 144".
- **Hint:** "Draw the bed. How many pots along one side? Then how many rows?"
- **Why:** "(2 × 3)² = (2 × 3) × (2 × 3) = 2² × 3² = 4 × 9 = 36."
- **Own hints for Checks 2 and 3:** crate: "Write (2x) three times and multiply. How many 2s? How many x's?" (why: "(2x)³ = 2x × 2x × 2x = 2 × 2 × 2 × x × x × x = 8x³."); ⅔ bed: "Squaring means times itself. Multiply ⅔ by ⅔: tops together, bottoms together." (why: "(⅔)² = ⅔ × ⅔ = 4⁄9."). The predict and Check 4 keep the jar's hint.
- **Mixed review:** Check 3 is fraction multiplying (RN3) again.

### 6.6 The boulder on the road (PE7) — Bram Ostler, with Orrin
- **Lead-in (`boulder`):** Hesper sends you to Highstead for the vault seed. On the Low Road a boulder has come down from the gorge edge, and Bram's seed cart can't pass. Orrin stands beside the rock, looking up at the gorge edge. Hesper has given you a shrinking charm, written on a tag: **2⁻³**.
- **Bram:** "Minus three? You'll make it *minus* a boulder? What's that, a hole?"
- **Predict** (`T.ask`, key `pe7_predict`). Orrin: *"Before you cast it. What will 2⁻³ do to the boulder?"* Right: "**Shrink it to ⅛ of its size. 2⁻³ is 1 over 2³, a small positive fraction.**" Wrong: "Make it −8 times its size: the negative exponent makes a negative" (the course misconception); "Make it 8 times bigger"; "Make it −6 times its size, 2 × −3".
- **The board** (pattern panel): 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = **1** (the student fills this: PE2 again), then 2⁻¹ = **½**, 2⁻² = **¼** (steps, each "÷ 2").
- **Check 1** (`T.frac`, key `pe7_boulder`, the pip): 2⁻³ = **⅛**. Named error −8: "A negative exponent isn't a negative number. Keep halving past 1." Named error 8: "That's 2³. The minus sends it underneath: 1 over 2³." Named error −⅛: "The base is positive, so nothing here is below zero." Named error −6: "That's 2 × (−3). Halve three times from 1."
- **Check 2** (`T.frac`, key `pe7_weight`): the boulder weighs **96 stone**. After the charm: 96 × ⅛ = **12 stone**. Bram's horse can drag 15, so the road clears.
- **Check 3** (`T.ask` then `T.frac`, key `pe7_negbase`). Orrin: *"Good. Now a better question. Can a negative exponent ever give a negative number?"* Right: "**Only when the base is negative and the exponent is odd, like (−2)⁻³.**" Wrong: "Never"; "Always". Then: (−2)⁻³ = **−⅛**. Only the typed value is recorded, not the question. Named error ⅛: "(−2)³ is −8, and 1 over −8 is negative. The sign comes from the base."
- **Check 4** (`T.frac`, key `pe7_flip`, added 2026-11-15; notes Section 7's worked example): Hesper shrank Bram's seed sacks to a third and a third again; the tag to undo it says (⅓)⁻². How many times bigger? **9**. Named errors 1⁄9, −1⁄9, −9, 3, 6 (script).
- **Hint:** "Go down the board from 2¹. What do you do at every step? Do it three more times after 1."
- **Why:** "2¹ = 2, 2⁰ = 1, 2⁻¹ = ½, 2⁻² = ¼, 2⁻³ = ⅛. So 2⁻³ = 1⁄2³."
- **Payoff:** the boulder shrinks to the size of a hay bale; Bram's horse drags it off the road. Orrin walks on with you to Highstead.

---

## 7. The false rune: the seed vault door (PE2 + PE7)

**Where:** the grain-tower yard at Highstead, behind the frozen tower-yard gate. The vault door is against the middle grain tower (tiles 41–45, 8). If the gate was not thawed in Chapter 1, thawing it with Balance is the way in (a Balance spot inside the story; RN2 again).

**Scene:** the vault is cut into the bank under the towers. Its door is locked by a **weighing lock**: a dial of powers of 3 and a scale pan. Each season the dial steps down one, and the keeper puts the dial's value in seed-weights on the pan. The stone beside the dial reads, top to bottom:

*3³ = 27 · 3² = 9 · 3¹ = 3 · **3⁰ = 0** · **3⁻¹ = −3** · **3⁻² = −9***

The dial stands at 3⁰. Grey lines crawl over the last three lines. Gale Harrow: *"The stone says nought. So I put nothing on the pan, and the door won't move. Next season it says minus three. How do I weigh out minus three?"* A grey-cloaked figure is at the yard fence, watching.

**The panel** (`T.box("rune2", …)`, three stages, each saved):

**Stage 1 · Predict** (`T.ask`, key `rune2_predict`). Orrin: *"Before you touch it. Read down the true lines: 27, 9, 3. What comes next?"*
- Right: "**1. Each line is the one above divided by 3, and 3 ÷ 3 is 1. The stone's 0 breaks the pattern.**"
- Wrong: "0, because the exponent is 0"; "0, because the numbers are shrinking away to nothing"; "You can't tell: a zero exponent has no meaning."

**Stage 2 · Test** (the dividing ladder: the pattern panel with the scale pan drawn beside it). The student answers each rung, and a weight drops on the pan as each is answered:
- 3 ÷ 3 = ? (**1**: one whole weight)
- 1 ÷ 3 = ? (**⅓**: a third-weight)
- ⅓ ÷ 3 = ? (**1⁄9**: a ninth-weight)
- Then the second route, Orrin: *"Another way to the same place. What is 3³ ÷ 3³?"* (**1**) *"And by the quotient law, what is its exponent?"* (power card: **3⁰**).

Beside the ladder the stone's 0, −3, −9 are shown. The pan with one weight on it tips the lock a hair.

**Stage 3 · Explain and fix.**
- `T.ask` (key `rune2_explain`), full explanations:
  - ✓ "Each step down divides by 3, so 3⁰ = 1, then ⅓, then 1⁄9: small positive fractions, never zero or negative."
  - ✗ "An exponent of 0 means multiplying by nothing, so 0. A negative exponent means a negative number." (the rune itself; feedback: "That's what the rune says. Check it on the ladder: is 3 ÷ 3 nought?")
  - ✗ "3⁰ = 1, but a negative exponent flips the sign, so 3⁻¹ = −3." (feedback: "The first half is right. Keep dividing by 3 from 1. Do you ever go below zero?")
  - ✗ "3⁰ = 3, because with no exponent the base is left as it is." (feedback: "That's 3¹. One more rung down.")
- `T.typed` (id `rune2_why`, at least 40 characters): *"Gale wants it in plain words for the vault book. Why is 3⁰ equal to 1 and not 0?"*
- **Fix 1** (two `T.frac`, keys `pe2_rune_fix` and `pe7_rune_fix`): the stone's true lines: 3⁰ = **1** and 3⁻² = **1⁄9**.
- **Fix 2** (the transfer check; two `T.frac`, keys `pe2_rune_fix2` and `pe7_rune_fix2`): the inner door has a second stone in fours, *"4⁰ = 0 · 4⁻² = −16"*. The true lines: **1** and **1⁄16**.

**Losing:** as Chapter 1. Two wrong fixes in Real (three in Gentle) and the rune **flares**: the grey lines thicken, the pan swings empty, the panel closes. Orrin's one question: *"What do you do to get from one line to the next?"* It starts again from Stage 3. After a second loss Hesper's worked ladder is shown, the result is recorded as "later", and the rune breaks.

**Breaking it:** the carving cracks with a gold flash and re-cuts itself: 1, ⅓, 1⁄9. Gale sets **one** weight on the pan. The door swings in on racks of seed sacks. Gale: *"One. All this for one."* Orrin: *"It usually is."*

**Orrin and the chips:** he picks up a chip from this rune and holds it beside the one from the grain-share stone. *"Same hand."* He says no more, and hands the new chip to the apprentice: *"Keep them together."* (The apprentice already carries the Chapter 1 chip, so now holds both. Item: "A chip of the vault stone". Pays off at the end of Chapter 3.)

**Sefa:** this time the figure at the fence does not run until the door opens. A choice, a character beat and not a check (`T.choose`, remembered as `sefa_ch2`): **Call out: "Wait. Did you carve this?"** · **Hold up the chip and say nothing** · **Let them go.** Whatever is picked, Sefa leaves; if called to, they stop for one breath first. The finale reads this memory with the others (bible §3).

---

## 8. The Growth sigil

*Make things double, triple or shrink by powers.*

**Earning it (`sigil`):** at Hesper's seed bed, after the vault, as the first vault seed is planted. Banner, the sigil drawn in green-gold on the apprentice's other hand, confetti, a line in the Journal.

**Using it.** At a Growth spot (a green-gold ✶ marker) the panel names a **base** and shows where things stand and what is needed. The student types the **exponent** (power card). Positive grows, negative shrinks, and 0 changes nothing. Three kinds, seeded per spot and visit:

| Kind | Example | Answer | Practises |
|---|---|---|---|
| **Reach** | "The vine is 1 hand tall and doubles with each pulse. The ledge is 32 hands up. Cast 2 to the…?" | **5** | PE1 |
| **Shrink** | "The gap is ⅑ of your height. Your charm works in threes. Cast 3 to the…?" | **−2** | PE7 |
| **Top up** | "The vine has grown 2³ hands. It needs 2⁸. Cast 2 to the…?" (or back down: at 3⁵, needs 3², cast 3⁻³) | **5** (or **−3**) | PE3, PE4, PE7 |

- **Too little:** the vine stops short and the panel shows how tall it got (2⁴ = 16 hands). Try again.
- **Too much:** "The vine shoots past the ledge and flops over. Too far." For a shrink: "You are the size of a beetle. Too far." Try again.
- After 3 wrong tries the answer is shown and the spot works anyway.
- Bases come from 2, 3, 4, 5 and 10; targets stay under 1000 (or above 1⁄1000).

**Charge.** As Chapter 1, with **six pips**, one per quest's pip check (`pe2_day0`, `pe3_cure`, `pe4_moths`, `pe5_nest`, `pe6_jar`, `pe7_boulder`) right on the first try. Pips come back from gold rings (a Growth spot solved on the first try) and second looks (§8.1). **All six pips** open the chapter's secret: a vine to the **window ledge of Orrin's tower**. The door stays locked; through the window the apprentice sees his desk, two charcoal rubbings of the runes side by side (the apprentice holds the chips), and a small painting of a young apprentice in Warden's grey with the face turned to the wall. (A story hook for Morvane; one `T.remember` on Orrin.) *(Six pips, not five, needs the teacher's nod: §13.)*

### 8.1 Second looks

Rules as Chapter 1 §8.1 (open the morning after the rune; next unused variant; one pip back if right on the first try; a gap after a miss).

**Variants (all worked by hand):**

| Quest (pip key) | A | B | C |
|---|---|---|---|
| Tally `pe2_day0` | A ×4 moss: patches on day 0 and day 1 together: 4⁰ + 4¹ = **5** | Six pots, each a ×10 moss on its day 0: 6 × 10⁰ = **6** | Two beds on day 0, a ×7 moss and a ×2 moss: 7⁰ + 2⁰ = **2** |
| Cure `pe3_cure` (exponent) | 3⁴ × 3² = **3⁶** (729) | 2⁵ × 2⁵ = **2¹⁰** (1024) | 5² × 5 = **5³** (125) |
| Moths `pe4_moths` (exponent) | 2⁹ ÷ 2⁶ = **2³** (8 pots) | 5⁶ ÷ 5⁴ = **5²** (25 pots) | 3⁵ ÷ 3⁵ = **3⁰** (1 pot) |
| Nests `pe5_nest` (exponent) | (2²)⁵ = **2¹⁰** | (5³)² = **5⁶** | (3³)³ = **3⁹** |
| Jar `pe6_jar` | (2 × 5)² = **100** | (3 × 2)³ = **216** | (4 × 3)² = **144** |
| Boulder `pe7_boulder` | 3⁻² = **1⁄9** | 4⁻² = **1⁄16** | 10⁻³ = **1⁄1000** (0.001 accepted) |

Named errors for the variants follow the originals:
- Tally: a zero exponent taken as 0 (A: 4, B: 0, C: 0) or as the base (A: 8, B: 60, C: 9).
- Cure: exponents multiplied (A: 8, B: 25, C: 2); in C, the bare 5 read as 5⁰ (answer 2).
- Moths: exponents added (A: 15, B: 10, C: 10).
- Nests: exponents added (A: 7, B: 5, C: 6).
- Jar: only the last factor raised (A: 50, B: 24, C: 36); the exponent used as a multiplier (A: 20, B: 18, C: 24).
- Boulder: a negative answer (A: −9, B: −16, C: −1000); base times exponent (A: −6, B: −8, C: −30); the positive power (A: 9, B: 16, C: 1000).

**Places Growth opens:**

| Spot | Area | Kind | Opens | Later use |
|---|---|---|---|---|
| ✶ The pond ledge | Brindle Ford, the far side of the mill pond (reached over the pond ice, Balance) | Reach | First use (the `vine` step): the cat | Ch 3 lookout over the gorge |
| ✶ The hedge gap | Brindle Ford, the hedge between the fold and the north field (the hedge is drawn only in Chapter 2) | Shrink | A shortcut from the fold to the Low Road | — |
| ✶ The vault vine | Highstead, the tower yard | Top up | The top of the bank above the vault: a view of the far end of the broken bridge | Ch 3 starts here |
| ✶ Orrin's window | Brindle Ford, the west wall of his tower (needs 6 pips) | Reach | The secret | — |

**First use (`vine`):** the morning after the sigil. Pell: there is a cat crying on the ledge above the mill pond. Cross the pond (a Balance spot: freeze), grow the vine (Reach, fixed numbers the first time: 1 hand, doubling, 32 hands, **2⁵**), climb. A small black cat with gold eyes walks down the vine on its own and sits on the apprentice's boots. The student names it (the engine's name box). From here the cat follows the apprentice.

**Balance in this chapter (spaced practice):** the tower-yard gate on the way to the vault, the pond crossing before the first vine, and the Chapter 1 spots stay live with fresh numbers.

---

## 9. Places

No new areas: Brindle Ford and Highstead as built. New or changed things:

| Thing | Where | Notes |
|---|---|---|
| Grey blight patches | Brindle Ford: the north field stubble and the fold's pasture | A ground decal or a grey variant of the stubble tile; turns green (moss) when `cure_done` |
| Tally board | Outside the common barn | A prop to talk at with Odile |
| The mill | The mill room (one room; the lines say "mill", not "loft") | Smoke pots after `moths_done`. Not built: moths as drifting grey specks before |
| Well-house roof nests | The well | Grey nest clumps on the roof until `nests_done` |
| Hesper's seed bed | Beside her cottage | A 6 × 6 square of pots (the bed in Pell's quest is drawn as itself) |
| The boulder | The Low Road, just south of the Highstead ford (tiles 18–19, 32–33) | Blocks the road until `boulder_done`; then a hay-bale-sized rock on the verge (about 1 tile wide, waist high). Bram's cart and horse beside it |
| The seed vault | Highstead tower yard, against the middle grain tower (tiles 41–45, 8) | A stone door with the dial and scale pan; open after `rune2_broken` |
| Growth spots | As the table in §8 | Green-gold ✶, a different colour from Balance's gold |
| The cat | Pond ledge, then follows | `realm/voxpeople/cat` (already in the pack) |

**New models:** vault door (dial and pan as their own meshes, so the game can move them), boulder (two sizes), cart and horse (check the Emberdale pack for a cart first), tally board, vine (grows by scaling a `Vine` mesh), smoke pot, moth nest, seed pot. **New person:** Bram Ostler.

**Area rules kept:** as Chapter 1 §9. The boulder must leave no way round until it shrinks, and the hedge gap and vines must pass `test_nav` open and shut.

---

## 10. Report

| Row | From |
|---|---|
| First try by code: PE1 (seeds, turn, brackets), PE2 (day 0, other moss, why, (−15)⁰; the nook's pot), PE3 (cure, value, different bases), PE4 (moths, pots, why), PE5 (nest, pair, same), PE6 (predict, jar, crate, ⅔ bed, sum), PE7 (predict, boulder, weight, negative base, the fraction flip) | `Story.record` keys above |
| "In my own words": −2⁴ and (−2)⁴ for Pell; why 3⁰ is 1 for Gale | `T.typed` ids `pe1_pell`, `rune2_why` |
| The rune: predicted right? broke on the first attempt or after a flare? | rune stages |
| Growth charge (0–6 pips): from first tries, gold rings and second looks; Growth spots solved | sigil state |
| Balance spots solved in this chapter | sigil state |
| Mode (Gentle or Real), time played | engine |

The report covers one chapter at a time: "Go on to Chapter 2" and the Journal tell the student to download the Chapter 1 report first. `pe4_equal` is listed under PE2 as well as PE4, since it is the zero exponent met again. Not recorded: the "enough for 500?" question and the question half of `pe7_negbase`.

---

## 11. Evidence check (Tier 1 unit: all five)

| Checklist item | Where in Chapter 2 |
|---|---|
| Produce from memory | Every value and every exponent is **typed** (`T.frac`, power card); the two typed explanations |
| Explain or justify | The lesson's self-explanation; a "why" question in the tally, the moths and the nests; the predictions in the jar, the boulder and the rune; the rune's typed reason |
| Prior content mixed in | 3⁰ comes back in the moths, the boulder's board and the rune; the pair in the nests mixes PE3 with PE5; fractions (RN3) in the jar and the boulder; Balance spots (RN2); Growth's top-up spots mix PE3, PE4 and PE7 |
| Formative signal | The report by PE code; named errors say which wrong rule was used |
| Worked example before practice | The spell-seed example before the first check; a filled pattern board before 3⁰ and before 2⁻³; each quest's *why* line after the last try |

---

## 12. What the build needs

**Reuse:** everything Chapter 1 uses (`T.frac`, `T.ask`, `T.typed`, `T.box`, the soft gate, second looks, the sigil-spot code, the report). The "third" tier applies to the new panels too.

**New pieces:**

| Piece | What it does | Test-player move |
|---|---|---|
| Power card (Realm panel) | Prints a base (a number, a bracketed negative, or a letter) and takes a typed **integer exponent**; an option adds a typed number in front (for 8x³). Returns the tier and the typed value, so named errors can be matched. Two cards can sit in one panel (`pe5_pair`). | right / second / wrong like `frac` |
| Pattern panel (Realm panel) | A column of powers of one base with some values blank; the student types each blank top to bottom; each filled row shows "÷ base". An option draws the scale pan and drops a weight per row (the rune). Blanks marked as steps are not recorded. | fills every blank, or the named wrong value first |
| Growth spots | A second sigil kind beside Balance: `spot_numbers` and `spot_judge` for Reach, Shrink and Top up; state in flags (`growth_ledge` …) and `S.pe`, as Balance does in `S.rn` | types the exponent |
| Chapters | A second step list (`ch2.gd` for the answers, variants and judges, as `ch1.gd`), a chapter picker on the title once Chapter 1 is done, and a start-here path (§2). The report and the Journal show the chapter in play. | `chapter=2` on the command line |
| Six-pip charge | The pip row drawn for 5 or 6 | — |
| The follower | The cat follows the apprentice after `vine` (the engine has Pell following in Chapter 1) | — |
| Name box for the cat | The engine's typed name, kept in the save | types a name |

**Tests** (headless Godot, added to `test_realm.gd`):
- An answer table for every check above and every second-look variant, worked with exact fractions: no option or named error marked wrong gives the right value.
- The power card: every named wrong exponent for each card is judged wrong and gives its own line.
- Growth spots: for every base and seed, the answer reaches the target exactly, and one less and one more are judged too little and too much.
- The full chapter by `auto=right|second|wrong`, Gentle and Real, including two rune losses, and starting at Chapter 2 with no Chapter 1 save.
- Save, stop and resume at each stage of the rune. (Not in `test_realm`; checked by hand with `rune_stop=` and `resume=1`, board T-038.)
- `test_nav` with the boulder in place and shrunk, the vault shut and open, and each Growth spot solved and unsolved.

---

## 13. Open points

- **Six pips or five** (§8): the charge follows the number of quests, which is six here. If the pip row should stay at five in every chapter, drop `pe2_day0` from the pips (it is met again three times) and keep the rest.
- **Sefa's choice** (§7): the first story choice the game remembers for the finale. Leave it in, or keep Sefa silent and unseen-to until Act II?
- **Starting at Chapter 2** (§2): the lent Balance sigil lets a late-starting class play, but they miss the cellar secret. Fine as it is, or offer Chapter 1's five quests as optional "Hesper's old chores"?
- **Letters:** only one check uses a letter base, (2x)³. The notes' harder items, such as (2x²y³)⁴ ÷ (4x³y)², stay on paper. Add a second letter check (for example (3x²)⁴ = 81x⁸ as a third crate) if the game should cover more of Section 6.
- **0⁰** is left to the notes.
- **The painting in Orrin's tower** hints at Morvane before Orrin names him (end of Chapter 3). Only students with all pips see it. Keep, or hold the hint until Chapter 3?
- **Length:** about 85 minutes against Chapter 1's 75. The nests' third check and the jar's fourth are the first to cut.
