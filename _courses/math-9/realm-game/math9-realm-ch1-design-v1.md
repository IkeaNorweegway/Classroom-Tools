# The Measure of the Realm — Chapter 1 Design v1
## "The Spark" · Rational numbers · Sigil: Balance
*Pilot chapter. The design only, no game yet. Written 2026-11-08. Story: `math9-realm-story-v1.md`, §5–6.*

> **Gate (games):** Outcomes: RN1–RN5. Model: a step-based story; every check is an exact rational answer (equivalent forms accepted); the rune breaks only when the prediction, test and fix are right. Turn-based. Test hook included (`?debug=1`, `auto=right|second|wrong`, a `solve` on every panel).

**Read with:** `notes-packages/math-9/rational-numbers/math9-rational-numbers-notes-v1.md` (every quest matches one section), `_courses/math-9/_context.md` (depth ceiling: no complex fractions), `_games-context.md` (story engine rules).

**I can** (under the title): *I can compare, add, subtract, multiply and divide rational numbers, use the order of operations, and explain why my answer makes sense.*

---

## 1. What changed from the story bible

The notes have one section per code. The bible's list had no RN1 or RN3 quest and called the miller's ledger RN3. Chapter 1 now has **one quest per notes section**, plus the lesson:

| Notes section | Code | In the game |
|---|---|---|
| 1 What is a rational number? | RN1 | The lesson (Hesper's frost window); ordering again in the miller's ledger |
| 2 Add and subtract | RN2 | The frozen well; the miller's ledger; the false rune |
| 3 Multiply | RN3 | **The cold snap** (new) |
| 4 Divide | RN4 | Sharing the harvest |
| 5 Order of operations | RN5 | The frost recipe |

The bible's Chapter 1 list is updated to match.

---

## 2. Shape of the chapter

The engine runs steps in order, and the class meets the notes sections in order, so the quests run in notes order with a **soft gate** before each new section (the CEFL Town idea): "Hesper says the next lesson is about multiplying. Learned it in class yet? **Start it now** · **Not yet: look around Brindle Ford**." It is an honour system, not a lock. Talking to Hesper starts the next quest.

```
prologue → make_hero → meet_hesper → lesson            (after notes Section 1)
gate:2 → well → ledger                                  (after Section 2)
gate:3 → cold_snap                                      (after Section 3)
gate:4 → harvest                                        (after Section 4)
gate:5 → recipe → low_road → rune → sigil → mill_wheel → chapter_end   (after Section 5)
```

| Part | Time | Save point |
|---|---|---|
| Prologue + hero + lesson | ~15 min | each step |
| Each quest | 8–10 min | each step |
| Low Road + rune + sigil | ~15 min | each step; the rune saves at each stage |
| **Whole chapter** | **~75 min**, spread across the unit | |

Every step is safe to run again from its start: quest results are guarded by flags (`well_done`, `rune_broken`, …), as in the café demo.

**Modes:** Gentle (3 tries, a hint after each wrong try) and Real (2 tries, no hints). The answer shows after the last try with a one-line *why*, recorded as "later".

**The hint button** in Chapter 1 is **Ask Hesper**. (Orrin's voice takes this job only after Act II.)

---

## 3. People of Chapter 1

| Person | Where | Role |
|---|---|---|
| **Hesper Marrow** | Her cottage on the rise (Brindle Ford, SW) | Mentor; gives the lesson, starts each quest, the recipe |
| **Orrin Vael** | Prologue; then "away at the gorge"; returns at the rune | Asks the rune's "why?" questions |
| **Pell** | Follows you in Brindle Ford | Asks the student-style question in each quest |
| **Marta Fenn**, well-keeper | The village well | The frozen well |
| **Abel Crane**, miller | The mill | The miller's ledger; his wheel is the sigil's first use |
| **Rowan Tull**, shepherd | The fold (NW) | The cold snap |
| **Reeve Odile Marsh** | The common barn | Sharing the harvest |
| **Gale Harrow**, grain-warden | Highstead square, by the stone | The false rune |
| **A grey-cloaked Hollow** (Sefa) | Glimpsed at Highstead | Seen fleeing; never speaks in Act I's first chapter |

**Hesper's lines** (the bible's §3 rule):
- First try right: *"Fair shares and true numbers. That's my apprentice."*
- A wrong answer (points at the idea, never the answer): *"Picture it on the frost line first. Where does it land?"*
- Pell's habit: he says the misconception out loud before the student answers ("Dividing makes things smaller, right?"), so the student meets the wrong idea as Pell's guess and not as their own.

---

## 4. Prologue: "The Night the Bridge Fell" (~5 min, no maths)

1. **Make your apprentice:** name, look (the engine's character screen), and **pronouns** (she / he / they; new on the engine). The story says "the apprentice" or the name.
2. **Harvest night.** Walk with the village toward the gorge bridge (the tutorial: walk, tap to walk, talk; it can be skipped and replayed from the Menu).
3. **The bridge.** Gold lines glow along the cables, flicker, snap. The bridge drops. Pell is left hanging on the far side; the village pulls him up by rope. No one is hurt.
4. **Orrin**, by the broken cable: *"You saw the lines. What did they look like?"* A choice of three answers, all fine (it's a character beat, not a check). *"Then you can learn. Few can."*
5. Orrin walks you to Hesper's cottage. He pockets something from the cable. (The carving pays off at the end of Chapter 3.)

---

## 5. The lesson: Hesper's frost window (RN1)

**Setting:** first frost. Hesper draws a number line in the frost on her window, 0 at the sill mark, warm above and cold below (drawn sideways in the panel so it reads like the notes).

**Worked example** (a `T.box` that animates the points; the step's words carry the meaning):
- She marks −¾ and −¼. *"Which is colder?"* The −¾ mark is further from zero, on the cold side.
- *"Owing a quarter of a silver is better than owing three-quarters. Same with cold: −¼ is warmer, so −¼ > −¾."*
- She writes −¾ three ways: −3⁄4, 3⁄(−4), −(3⁄4). *"One point, three names."*

**Pell's guess:** "−¾ is bigger, 'cause 3 is bigger than 1."

**Self-explanation** (`T.ask`, key `rn1_lesson`; full explanations, shuffled):

| Option | Right? | Feedback on a wrong pick |
|---|---|---|
| "−¼ is to the right of −¾ on the line, closer to zero, so it's greater." | ✓ | — |
| "−¾ is greater because 3⁄4 is greater than 1⁄4." | ✗ (the notes' misconception box) | "That's true for 3⁄4 and 1⁄4. On the cold side, more means colder. Look where each one sits." |
| "They're equal because both are negative quarters." | ✗ | "They're different points. Count the quarters from zero." |
| "You can't compare negatives without decimals." | ✗ | "You can. A common denominator or the number line does it." |

Then a **`T.typed`** (id `rn1_pell`, at least 30 characters): *"Explain to Pell, in your own words, which is greater: −2⁄3 or −3⁄4."* (Notes Section 1, retrieval Q3.) It is kept for the report and not marked.

**Check** (number-line panel, key `rn1_order`): order −1, −1⁄3, 0, 1⁄2, −3⁄4, 5⁄6 on the frost line, least to greatest (the notes' ordering task). Answer: −1, −3⁄4, −1⁄3, 0, 1⁄2, 5⁄6.

---

## 6. The help quests

### 6.1 The frozen well (RN2, decimals) — Marta Fenn
- **Problem:** the well water is at **−12.5 °C** and frozen solid. Hesper says the chinook arch in the west will raise it by **18.75 °C** tonight. Will it thaw, and what will it read?
- **Pell:** "18.75 take away 12.5. Easy." (He has the right size but hasn't thought about the sign.)
- **Check 1** (`T.frac`, key `rn2_well`): −12.5 + 18.75 = **6.25 °C** (accepts 6.25, 25⁄4, 6 1⁄4).
- **Check 2** (`T.ask`): Will it thaw? **Yes, 6.25 °C is above 0.** Wrong options: "No, it's still negative because it started negative"; "Yes, but it'll read 31.25 °C".
- **Hint (Gentle):** "Start at −12.5 on the line and move 18.75 to the warm side. Where do you cross zero?"
- **Why (after the last try):** "−12.5 + 18.75: the signs differ, so subtract the sizes (18.75 − 12.5 = 6.25) and keep the sign of the larger, +."
- **Payoff:** the chinook scene: wind, the frost line on the well melts, Marta draws a bucket.

### 6.2 The miller's ledger (RN1 + RN2) — Abel Crane
- **Problem:** Abel's ledger in silvers. Owed to him: the baker **+½**, the farmer **+⅔**. He owes: the smith **−¾**, Hesper **−⅚**.
- **Check 1** (number-line panel, key `rn1_ledger`): order the four least to greatest (worst debt first): **−⅚, −¾, ½, ⅔**. The trap is −¾ vs −⅚; the panel shows twelfths only as a hint in Gentle.
- **Pell:** "Owing ⅚ isn't as bad as owing ¾, 'cause 5 and 6 are bigger numbers… right?"
- **Check 2** (`T.frac`, key `rn2_ledger`): what does Abel really have? ½ + ⅔ − ¾ − ⅚ = 6⁄12 + 8⁄12 − 9⁄12 − 10⁄12 = **−5⁄12** (he is short 5⁄12 of a silver).
- **Hint:** "Rename every share in twelfths first. Then count what comes in and what goes out."
- **Why:** "In twelfths: +6 + 8 − 9 − 10 = −5, so −5⁄12."
- **Payoff:** Abel pays Hesper what he can; a story line, not money (Realm has no wallet).

### 6.3 The cold snap (RN3) — Rowan Tull *(new)*
- **Problem:** it is **0 °C** at dusk at the fold. A cold front will drop the temperature **⅔ °C every hour** for **4½ hours**. The lambs must go in the barn if it reaches **−3 °C** or colder.
- **Check 1** (`T.frac`, key `rn3_snap`): the change = (−⅔) × 4½ = (−⅔) × (9⁄2) = **−3 °C**. So yes, bring them in.
- **Pell:** "It's been dropping all day. Three hours ago, was it colder or warmer?"
- **Check 2** (`T.frac`, key `rn3_back`): going back 3 hours: (−⅔) × (−3) = **+2**, so it was **2 °C**. Then a `T.ask` for the meaning: "Why is a negative times a negative positive here?" Right: "Going back in time on a falling temperature means it was higher, so the change is positive." Wrong: "Two negatives always cancel, so it doesn't matter"; "It should be −2 because it's been getting colder."
- **Hint:** "Write 4½ as an improper fraction. Then count the negatives."
- **Why:** "(−2⁄3) × (9⁄2) = −18⁄6 = −3. One negative factor gives a negative product."
- **Check 3 · the feed (cross-cancelling, notes Section 3; added 2026-11-09):** in the barn Rowan has **6⁄5 sacks** of oats; the lambs get **4⁄9** of it tonight. Pell works it on the barn wall: *"4 and 6 both go by 2, so cross them out: 2⁄9 × 3⁄5 = 6⁄45 = 2⁄15. Easy."*
  - `T.ask` (key `rn3_cancel_why`): "Is Pell's cancelling allowed?" Right: "**No. He cancelled two tops. You can only cancel a top with a bottom, like the 6 and the 9.**" Wrong: "Yes, any two numbers that share a factor can be cancelled" (Pell's error; feedback: "Cancelling divides the top and the bottom of the answer by the same number. Cancelling two tops divides the top twice."); "No, you can never cancel before you multiply" (feedback: "You can; it's a shortcut. It just has to be a top with a bottom.").
  - `T.frac` (key `rn3_cancel`): the feed = 4⁄9 × 6⁄5 = **8⁄15** of a sack (accepts 24⁄45 with the simplest-form nudge). Typed **2⁄15** gets the named error: "That's Pell's answer: you cancelled two tops (4 and 6). Cancel a top with a bottom: 6 and 9 share 3."
  - **Hint:** "Look for a top and a bottom that share a factor. 6 is on top, 9 is on the bottom."
  - **Why:** "6 and 9 share 3: 4⁄3 × 2⁄5 = 8⁄15. Check: 4 × 6 = 24, 9 × 5 = 45, and 24⁄45 = 8⁄15."
  - Not a pip check (the pip stays on `rn3_snap`); it is on the report under RN3.
- **Payoff:** you and Pell herd the lambs in (a short walk with the flock following), then feed them.

### 6.4 Sharing the harvest (RN4) — Reeve Odile Marsh
- **Problem:** **¾ of a cart** of grain is left in the common barn. Each family's winter share is **⅛ of a cart**. How many families get a share?
- **Pell first:** "Dividing makes it smaller, so it's less than ¾ of a family? That's silly."
- **Predict** (`T.ask`, key `rn4_predict`): will ¾ ÷ ⅛ be bigger or smaller than ¾? Right: "**Bigger.** ⅛ is less than 1, so more than ¾ of those pieces fit." Wrong: "Smaller, because dividing always makes things smaller" (the course misconception).
- **Check 1** (`T.frac`, key `rn4_harvest`): ¾ ÷ ⅛ = ¾ × 8 = **6 families**. Gentle shows the cart as a bar in eighths.
- **Check 2** (`T.frac`, key `rn4_second`): the second barn has **⅔ of a cart**, shares of **⅙**: ⅔ ÷ ⅙ = **4 families**.
- **Hint:** "How many eighths fit in ¾? Dividing by ⅛ is multiplying by 8."
- **Why:** "¾ = 6⁄8, and six ⅛ shares fit in it."

### 6.5 The frost recipe (RN5) — Hesper
- **Problem:** Hesper's frost-ward keeps the hen-house below zero through the chinook. The ward's strength is
  **(−⅓ + 1)² × (−9⁄4) + ½**  °C. Negative: the ward holds. Positive: it melts.
- **Check 1** (step-order panel, key `rn5_order`): put four step cards in order. Right order: **bracket** (−⅓ + 1 = ⅔) → **square** (⅔)² = 4⁄9 → **multiply** 4⁄9 × (−9⁄4) = −1 → **add** −1 + ½ = −½. One decoy card: "multiply ⅔ by −9⁄4 first".
- **Check 2** (`T.frac`, key `rn5_recipe`): **−½ °C**. The ward holds.
- **The melting branch:** if the student squares after multiplying they get (⅔ × −9⁄4)² + ½ = **+11⁄4**, and the ward visibly melts (the hens complain). The feedback names the step: "You squared after multiplying. BEDMAS: exponents before multiplication."
- **Pell:** "Can't you just go left to right?"
- **Hint:** "Brackets, then the exponent, then multiply, then add. Do one at a time."
- **Why:** "B: ⅔. E: 4⁄9. M: 4⁄9 × (−9⁄4) = −1. A: −1 + ½ = −½."
- **Mixed review:** this quest uses every operation from Sections 2–5.

---

## 7. The false rune: the grain-share stone at Highstead (RN2)

**Lead-in (`low_road`):** a Highstead runner comes to Hesper: families coming home from the market say their shares were short. Hesper sends you up the Low Road (the long way round, now the bridge is gone). Orrin meets you at the gate arch.

**Scene:** Highstead square. The grain-share stone says how much each household gets: *"Each household: ½ cart from the north tower + ⅓ cart from the south tower = **2⁄5** cart."* Families queue with short sacks. Faint grey lines crawl over the carving. A grey-cloaked figure slips out of the square (Sefa; you can't follow).

Gale Harrow: *"The stone has always been right. Who are we to argue with the stone?"*

**The panel** (`T.box("rune", …)`, three stages, each saved):

**Stage 1 · Predict** (`T.ask`, key `rune_predict`). Orrin: *"Before you touch it: is ½ + ⅓ more or less than ½?"*
- Right: "**More**, because you're adding a positive amount to ½. And 2⁄5 is less than ½, so the stone must be wrong."
- Wrong: "Less, because thirds are smaller than halves"; "Exactly ½, because ⅓ is too small to count"; "You can't tell without working it out."

**Stage 2 · Test** (a pie panel). A grain pie cut in sixths. The student answers "How many sixths make ½?" (**3**) and "How many make ⅓?" (**2**), and the wedges drop in as each is answered: **5⁄6** of the pie is full. Beside it the stone's 2⁄5 is drawn on the same size pie. The difference is plain to see.

**Stage 3 · Explain and fix.**
- `T.ask` (key `rune_explain`), full explanations:
  - ✓ "Halves and thirds are different-sized pieces. Rename both as sixths: 3⁄6 + 2⁄6 = 5⁄6."
  - ✗ "Add the tops and add the bottoms: 1 + 1 over 2 + 3." (the rune itself; feedback: "That's what the rune does. Check it: is 2⁄5 more than ½?")
  - ✗ "Multiply the bottoms and add the tops: 2⁄6." (feedback: "Close to the method, but the tops have to be renamed too.")
  - ✗ "The stone is close enough; 2⁄5 is nearly ½." (feedback: "Every family loses nearly half a cart. Is that close enough?")
- `T.typed` (id `rune_why`, at least 40 characters): *"Gale wants it in plain words for the families. Why is ½ + ⅓ not 2⁄5?"*
- **Fix 1** (`T.frac`, key `rn2_rune_fix`): the stone's true total: **5⁄6**.
- **Fix 2** (`T.frac`, key `rn2_rune_fix2`, the transfer check): a second carved line, *"Each elder: ⅔ + ¼ = 3⁄7"*. The true total: **11⁄12**.

**Losing.** Two wrong fixes in Real (three in Gentle, after the hints) and the rune **flares**: the grey lines thicken, the families leave with their short sacks, and the panel closes. Orrin asks one question as the hint (*"What kind of pieces are you adding?"*) and the rune starts again from Stage 3. After a second loss, Hesper's worked fix is shown, the result is recorded as "later", and the rune breaks, so no student is stuck.

**Breaking it:** the carving cracks with a gold flash and the stone re-cuts itself to 5⁄6 and 11⁄12. The families' sacks fill. Gale: *"Two hundred years… and it was wrong?"* Orrin quietly asks the apprentice to keep the broken chip.

---

## 8. The Balance sigil

*Warm or chill anything by an exact amount, above or below zero.*

**Earning it (`sigil`):** at Hesper's hearth, after the rune. A short scene (banner, the sigil drawn in gold on the apprentice's hand, confetti) and a line in the Journal.

**Using it.** At a sigil spot (a gold ✶ marker), the panel shows the spot's **current** temperature and the exact **target** (for example "ice that holds you: −1.5 °C"). The student types the **exact change**, target − current (`T.frac`).
- **Example:** the mill pond is at **3.25 °C**; the ice must reach **−1.5 °C**; change = −1.5 − 3.25 = **−4.75** (−19⁄4).
- **Too little:** the ice cracks, and you splash back to the bank (no penalty, try again).
- **Too much:** "The pond freezes to the bottom and the fish are in trouble. Too far." Try again.
- After 3 wrong tries the answer is shown, and the spot works anyway (progress is never locked).
- Numbers are **seeded per spot and visit**, so each spot is fresh RN2 practice. Later chapters ask for Balance spots on purpose (spaced practice).

**Charge** *(teacher decision 2026-11-09: 5 of 5)*. The sigil **always works** once earned. Its **charge** is the number of quests (main check) right on the first try, 0–5, shown as five pips in the Journal and the report. **All 5 pips** open one optional secret: Hesper's iced root cellar (Pell's lost slingshot and a page of Orrin's old notebook, a story hook). A student below 5 earns pips back two ways, up to 5 in all:
1. **Gold rings:** each sigil spot solved on the first try adds one (as before).
2. **Second looks** (§8.1): a fresh-number redo of a missed quest, right on the first try.

### 8.1 Second looks (recharging a missed pip)

**Why:** a missed first try shouldn't lock the secret, but re-entering the same answer teaches nothing. A second look is the same skill with new numbers, after a gap (retrieval with spacing).

- **When it opens:** the morning after the rune (once the sigil is earned). Every quest giver whose pip was missed shows a gold "?" and offers a second look: Marta (well), Abel (ledger), Rowan (snap), Odile (harvest), Hesper (recipe).
- **The task:** the quest's pip check again with the next unused variant below (A, then B, then C, then back to A). Same panel, hint, named errors and *why* line pattern as the original, with the variant's numbers.
- **Right on the first try:** one pip back (a short Pell line and the sigil glows), and that giver's "?" goes away.
- **Wrong:** the *why* line with the variant's numbers, then the giver says "Come back after you've worked a gold ring, or tomorrow." The next second look with that giver opens after **either** one more gold ring is solved (right at any try) **or** a later real day (the save stores the date of the miss). No guess-spamming, and spacing is built in.
- **Never blocks the story:** second looks are optional; the chapter ends without them.
- **Report:** the original first-try result stays as it was (the teacher still sees the first miss). A recharged pip shows as "recharged on a second look (variant B, try 1)".

**Variants (all worked by hand):**

| Quest (pip key) | A | B | C |
|---|---|---|---|
| Well `rn2_well` | Trough at −8.25 °C, chinook +11.5 → **3.25 °C**, thaws | −15.5 °C, chinook +9.75 → **−5.75 °C**, stays frozen (ask: thaw? **No**) | −6.4 °C, chinook +10.15 → **3.75 °C**, thaws |
| Ledger `rn2_ledger` (net) | +¾ + ⅚ − ⅔ − ½ = 9 + 10 − 8 − 6 twelfths = **5⁄12** | +⅖ + ½ − ¾ − 3⁄10 = 8 + 10 − 15 − 6 twentieths = **−3⁄20** | +⅝ − ⅓ − ¾ + ⅙ = 15 − 8 − 18 + 4 twenty-fourths = **−7⁄24** |
| Snap `rn3_snap` | drops ¾ °C an hour for 2⅔ h: (−¾)(8⁄3) = **−2** | drops ⅚ °C an hour for 3⅗ h: (−⅚)(18⁄5) = **−3** | drops 4⁄9 °C an hour for 6¾ h: (−4⁄9)(27⁄4) = **−3** |
| Harvest `rn4_harvest` | ⅚ cart, shares of 1⁄12: **10** | ⅘ cart, shares of 1⁄10: **8** | 2¼ carts, shares of ¾: 9⁄4 × 4⁄3 = **3** |
| Recipe `rn5_recipe` | (−½ + 2)² × (−4⁄9) + ⅔ = 9⁄4 × (−4⁄9) + ⅔ = **−⅓** (melting branch: (−⅔)² + ⅔ = 10⁄9) | (¼ − 1)² × (−16⁄9) + ¾ = 9⁄16 × (−16⁄9) + ¾ = **−¼** (melting: (4⁄3)² + ¾ = 91⁄36) | (−⅖ + 1)² × (−25⁄9) + ⅓ = 9⁄25 × (−25⁄9) + ⅓ = **−⅔** (melting: (−5⁄3)² + ⅓ = 28⁄9) |

Named errors for the variants follow the originals: sign of the larger size (well), bigger denominator means bigger debt and add-tops-and-bottoms (ledger), forgetting the negative (snap: the positive size), "dividing makes it smaller" (harvest: an answer below the cart amount), squaring after multiplying (recipe: the melting value).

**Places Balance opens:**

| Spot | Area | Freeze or thaw | Opens | Later use |
|---|---|---|---|---|
| ✶ The mill pond | Brindle Ford (5, 8) | Freeze | Shortcut from the village to the shepherd's fold | Ch 2 vine-climb on the far side |
| ✶ The mill wheel | Brindle Ford (17, 10) | Thaw | First use (the `mill_wheel` step): the wheel turns, Abel grinds the Highstead grain | Ch 2 hollow-moth quest is at the mill |
| ✶ Hesper's root cellar | Brindle Ford (6, 19) | Thaw (needs 5 pips) | The secret | — |
| ✶ The tower-yard gate | Highstead (19, 5) | Thaw | The grain-tower yard | Ch 2 seed vault is in this yard |

(Coordinates in sketch cells; each cell is 2 × 2 tiles.)

---

## 9. The first area of Emberdale

Two areas of **60 × 45 tiles**, joined at the north edge of Brindle Ford by the **Low Road** and a stone gate arch ("Highstead"), like the town's gates. Far-bank paths also line up, so from Highstead you can walk down to the far end of the broken bridge and look across at the village (a reason to want Chapter 3).

**Key:** `.` grass · `:` canola stubble · `=` road or path · `-` footpath · `~` water · `f` the ford · `v` waterfall · `#` gorge · `,` far bank · `B` broken bridge · `A` gate arch · `H` Hesper's cottage · `c` her root cellar · `V` houses · `M` mill · `w` mill wheel · `W` well · `R` common barn · `S` shepherd's fold · `_` market square · `G` grain-share stone · `T` grain towers · `|` yard fence · `*` sigil spot. One cell = 2 × 2 tiles.

```
BRINDLE FORD
     0         1         2
     012345678901234567890123456789
  0  ........A=..............###,=,
  1  .........=..............###,=,
  2  .........=.::::::::::...###,=,
  3  ..SSSSS..=.::::::::::...###,=,
  4  ..SSSSS--=.::::::::::...###,=,
  5  ..SSSSS..=.::::::::::...###,=,
  6  .........=..............###,=,
  7  .........=..............###,=,
  8  .....*...=.....MMM......###,=,
  9  ...~~~~~.=.....MMM......###,=,
 10  ~~~~~~~~~f~~~~~~w*~~~~~v###,=,
 11  ...~~~~~.=.VV.VV...VV...###,=,
 12  .........=.VV.VV...VV...###,=,
 13  ....====================BBB,=,
 14  ......-......W..........###,,,
 15  ......-....VV.VV..RRR...###,,,
 16  ......-....VV.VV..RRR...###,,,
 17  ......-.................###,,,
 18  ..HHH--.................###,,,
 19  ..HHHc*.................###,,,
 20  ........................###,,,
 21  ........................###,,,
 22  ........................###,,,

HIGHSTEAD
     0         1         2
     012345678901234567890123456789
  0  ..............................
  1  ..............................
  2  ............VVV...TT.TT.TT....
  3  ............VVV...TT.TT.TT....
  4  ..................TT.TT.TT....
  5  .................||*|||||||...
  6  .........=....................
  7  ...VVV...=..________..........
  8  ...VVV...=..________..........
  9  .........=..________..........
 10  .........=..___G____..........
 11  ...VVV...===________=========.
 12  ...VVV...=..________........=.
 13  .........=..________........=.
 14  .........=..________........=.
 15  ~~~~~~~~~f~~~~~~~~~~~~~v....=.
 16  .........=..............###.=.
 17  .........=..............###.=.
 18  .........=..............###.=.
 19  .........=..............###.=.
 20  .........=..............###.=.
 21  .........=..............###.=.
 22  ........A=..............###.=.
```

**Links:**
- Brindle Ford's north edge, cells 8–9 (the Low Road), meets Highstead's south edge, cells 8–9.
- Brindle Ford's far-bank path, cell 28, meets Highstead's road, cell 28.
- The far bank in Brindle Ford is reached only from Highstead.

**Area rules kept:**
- Nothing stands within 3 tiles of an edge; the towers end at tile 53.
- Every door has a clear doorstep onto a road or path.
- Water, the gorge and the broken bridge are blocked.
- The ford and the market square are walkable.
- Hesper's cottage, the mill, the barn and Abel's house open into 9 × 7 rooms, as in the town.
- **Orrin's tower** (added 2026-11-09, not in the sketch above): Brindle Ford tiles x 42–45, y 14–17, on the north bank above the gorge, door at (43, 18) with a short footpath west. Dark until `met_orrin`, then lit with a breathing crystal. Locked in Chapter 1; using the door gives one line that changes with the story (before Orrin, after Orrin, after the rune). Model: `wizard_tower` in the Emberdale pack.

**Looks:** prairie, not a street grid. Gentle rises, with Hesper's cottage on the highest one. Canola stubble in gold rows, a chinook arch in the west sky, the gorge in red-brown striped rock. It is low-poly and flat-shaded like the town, with no real-time shadows.

---

## 10. Report (something to show a teacher)

| Row | From |
|---|---|
| First try by code: RN1 (lesson, ledger order), RN2 (well, ledger net, rune fixes), RN3 (snap, back, cross-cancel), RN4 (predict, harvest, second barn), RN5 (order, recipe) | `Story.record` keys above |
| "In my own words": the explanation to Pell and the rune explanation for Gale | `T.typed` ids `rn1_pell`, `rune_why` |
| The rune: predicted right? broke on the first attempt or after a flare? | rune stages |
| Balance charge (0–5 pips): how many from first tries, gold rings and second looks; sigil spots solved; second looks tried and passed | sigil state |
| Mode (Gentle or Real), time played | engine |

A teacher reading the RN rows sees which notes section each student needs again.

---

## 11. Evidence check (Tier 1 unit: all five)

| Checklist item | Where in Chapter 1 |
|---|---|
| Produce from memory | Every check is a **typed** exact answer (`T.frac`), not a choice; the two typed explanations |
| Explain or justify | The lesson's self-explanation, the cold-snap "why positive?", the harvest prediction, the rune's predict → explain → typed reason |
| Prior content mixed in | The frost recipe mixes all four operations; the rune is RN2 again after RN3–RN5; the Balance spots bring RN2 back in every later chapter |
| Formative signal | The report by RN code; Pell's misconception lines give a wrong pick one line of why |
| Worked example before practice | Hesper's frost-window example before the first check; each quest's *why* line is a worked solution after the last try |

---

## 12. What the build needs (next batch)

**Reuse from the engine** (`godot/story-engine/engine/town.gd`):
- `T.say`, `T.choose`, `T.ask`, `T.typed`, `T.box`, `T.goal`, `T.banner`, `T.confetti`.
- Memory: `T.remember` / `T.knows` (Sefa sightings, the final choice later).
- `Story.record`.
- The soft gate pattern (Payday's `gate:N`).

**Maps:** in the café demo's format (`games/demo_cafe/game.gd` `maps()`); Realm has its own maps, not the town.

**New pieces:**

| Piece | What it does | Test-player move |
|---|---|---|
| `T.frac` (engine) | Typed exact rational answer, modelled on `T.calc`. Accepts `-5/12`, `−5/12`, `1 1/2`, exact decimals; checks with exact fractions (equivalent forms right). Unsimplified is right, with a nudge ("simplest form: −5⁄12"). A rounded decimal for a repeating fraction gets "close: give it as a fraction" and does not count as a try. | right / second / wrong like `calc` |
| Number-line panel (Realm) | Tap points onto a line, or order cards on it | places in order, or one swap wrong |
| Pie panel (Realm) | The rune's sixths pie | answers 3 and 2 |
| Step-order panel (Realm) | Order step cards; the decoy is the misconception | right order, or decoy first |
| Sigil system (engine) | A spot marks tiles or a door as blocked until solved; state in `S.sigils` | solves the spot's `T.frac` |
| Pronouns on the profile (engine) | `P.pron` with `{they}`, `{them}`, `{their}` fills like `{name}` | — |
| Fantasy art (`art3d.gd`) | Stone cottage, well, mill with wheel, grain tower, rune stone, ford, gorge and cliff tiles, stone gate arch, sheep. Each sizes itself to its footprint. | — |
| `games/realm/` | Game script, panels, `main.gd` `game=realm`, its own save key | — |

**Tests** (rule 5, headless Godot):
- A `T.frac` table: every accepted form and every wrong form for each answer above.
- Each quest's answer table: no option marked wrong gives the right value.
- The full chapter by `auto=right|second|wrong`, Gentle and Real, including two rune losses.
- Save, stop and resume at each stage of the rune.
- `test_nav.gd` on both areas, with and without each sigil spot solved.
- The nightly playtest can cover Realm once `main.gd` points at it.

---

## 13. Open points

- **The charge rule** (§8): decided 2026-11-09, 5 of 5 for the secret, pips back from gold rings and second looks (§8.1).
- **Quest numbers are fixed** for the first try (the sigil spots are seeded, and second looks use three hand-checked variants per quest, §8.1). A replayable "Hesper's chores" board with seeded versions of the five quests could follow if students want more practice.
- **Strand-order fallback** (from the bible): if Number isn't taught first, Chapter 1 still stands alone, since it needs no earlier sigil.
- **Pell's slingshot and Orrin's notebook page** (the secret) need a payoff later; the notebook page could be a hint about Morvane in Chapter 3.
