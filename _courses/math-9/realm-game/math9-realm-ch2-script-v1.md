# The Measure of the Realm — Chapter 2 Script v1
## "The Blight" · the lines, step by step
*Written 2026-11-14 for the build (board T-029). Goes with `math9-realm-ch2-design-v1.md`: the design has every check, answer, option, named error, hint and "why" line; this file has the story lines around them, in step order. Where both give a line, they match. Speaker `""` is the narrator. `{name}`, `{they}`, `{them}`, `{their}` as in Chapter 1. A `/` between quoted lines means a new box.*

**T-028 answers (teacher, 2026-11-14):** six pips; Sefa's choice stays; starting at Chapter 2 is fine as designed (recap and a lent Balance sigil, no "old chores"); one letter check only; the painting in Orrin's tower stays.

**One fix to the design's §8.1:** in the Cure variant C (5² × 5), the two named errors both give the exponent 2. Use one line for it (see Second looks below).

---

## 0. Starting at Chapter 2 with no Chapter 1 save (`ch2_recap`)

After the hero is made:
- `""`: "Brindle Ford, late in the harvest. You are {name}, apprentice to the hedge-witch Hesper Marrow."
- hesper: "Three lines, since you slept through the first part. The old magic is coming undone: bridges, wells, the grain-share stone." / "You can see the gold lines of it, and you mended that stone with true fractions. Orrin Vael, a Warden, is watching you." / "I've lent you the Balance sigil until you earn your own. Now, up. Something is wrong in the north field."
- Journal: "Hesper lent me the Balance sigil. Balance freezes and thaws by adding and taking away."

Then `ch2_open` as below.

## 1. Opening (`ch2_open`)

- `""`: "A few weeks after the grain-share stone. The mornings have turned sharp."
- pell: "{name}! {name}, come and look! The stubble in the north field's gone grey. All of it. Overnight!" / "And there are moths on the grain sacks. Grey ones. They don't fly off when you wave at them."
- `""`: "Hesper walks out to the field edge and snaps off a stalk. It crumbles like ash."
- hesper: "Blight." / "It spreads the way everything living spreads: not a bit more each day, but so many **times** more."
- pell: "Can you stop it?"
- hesper: "I have one answer. Cure-moss. It eats blight, and it spreads the same way the blight does." / "And we will need clean seed from the Highstead vault before the snow." / "One thing at a time. First you learn how growing is counted."
- Goal: "Go to Hesper's cottage. She has something on the windowsill."
- Journal: "Blight in the north field and grey moths in the barn. Hesper says it spreads by multiplying."

## 2. The lesson (`lesson2`)

- hesper: "One spell-seed, in one pot. It splits in two every night. Watch."
- (worked example box, as design §5, then:) hesper: "After five nights: 2 × 2 × 2 × 2 × 2. Too long to write, so we write 2⁵." / "The 2 is the **base**, the thing that repeats. The 5 is the **exponent**: how many 2s." / "2⁵ is 32 seeds."
- pell: "2⁵. Two fives. Ten."
- hesper: "{name}? Is he right?" → `pe1_lesson`
- hesper: "One more night on the sill. How many seeds after six nights?" → `pe1_seeds`
- hesper: "Now the hen-house. My turnabout charm airs it: warm to cold and back, twice as strong each turn." / "Every turn multiplies by −2. Start from 1: −2, then 4, then −8, then 16."
- pell: "Five turns… 32. The negatives cancel."
- hesper: "Do they all? {name}, what is (−2)⁵?" → `pe1_turn`
- `""`: "Pell chalks four turns on the hen-house door: −2⁴. \"Sixteen,\" he says."
- hesper: "Read what he wrote, not what he meant. As Pell wrote it, with no brackets, what is −2⁴?" → `pe1_brackets`
- pell: "But I meant the other one!"
- hesper: "Then write the other one. {name}, tell him the difference." → `pe1_pell` (typed)
- hesper: "Good. Base, exponent, and mind your brackets. That's the whole of counting growth." / "Odile is at the common barn with a tally board she can't finish. Start there, when your notes are ready."
- Journal: "A power: the base repeats, the exponent counts how many. 2⁵ = 32. (−2)⁴ = 16 but −2⁴ = −16."

## 3. Gates

Chapter 1's gate, with these section names: 2 "The zero exponent", 3 "Product of powers", 4 "Quotient of powers", 5 "Power of a power", 6 "Power of a product and quotient", 7 "Negative exponents". Hesper's waiting line and the "I've done the notes" choice are Chapter 1's words unchanged.

## 4. The moss tally (`tally`)

- Goal: "Find Reeve Odile at the tally board outside the common barn."
- odile: "{name}. Good. Hesper's cure-moss on the common field triples every day, and the village wants it written down." / "I have day 4 and day 3. Eighty-one patches, then twenty-seven. I need the rest, back to the day she planted it."
- pell: "Day 0? Nought days, nought moss. Write a zero."
- odile: "That's what I'd have put. But Hesper planted *something*."
- (board: Day 2, Day 1) odile: "Nine, then three. And each one a third of the row above. Go on. Day 0." → `pe2_day0`
- odile: "Rowan's pasture gets a different moss. It grows five times a day. How much on its day 0?" → `pe2_other`
- odile: "The same again. Why?" → `pe2_why`
- Payoff. `""`: "Odile chalks in the last row: 1 patch, H. Marrow." / odile: "One patch. And in four days it's eighty-one. I'd like my hens to do that."
- Asking Hesper afterwards (once, optional): hesper: "Nought to the nought? Nothing can't triple. Zero isn't a base I'd plant."
- Journal: "Any base to the exponent 0 is 1. Each day back divides by the base, and the base ÷ itself is 1."

## 5. The blight cure (`cure`)

- Goal: "Rowan Tull is at the fold's pasture. The blight has reached the grass."
- rowan: "About five hundred grey spots, near as I can count. The lambs won't touch the grass." / "I put down one patch of Hesper's moss. It doubles every day, and it's had six days." / "Hesper says the frost comes in three more. Will there be enough patches by then?"
- pell: "Six days, then three more. Two to the… eighteen? Six times three."
- rowan: "Eighteen what?"
- `""`: "Write the six days and the three days as one power of 2." → `pe3_cure`
- rowan: "And in plain patches?" → `pe3_value`, then the meaning `T.ask`: "Is that enough for 500 spots?"
- rowan: "Just. I'll take just." / "One more. My far bed has 2³ rows, with 3² patches in each row."
- pell: "2³ × 3². Same trick: 6⁵!"
- → `pe3_bases` ("Is Pell right?")
- Payoff. `""`: "Three days on, green moss has spread over the grey. Rowan opens the fold gate." / rowan: "Five hundred and twelve. I counted. Go on, girls, eat." / `""`: "The lambs go back on the grass."
- Journal: "Same base, multiplying: add the exponents. 2⁶ × 2³ = 2⁹. Different bases: work each power out."

## 6. Hollow-moths at the mill (`moths`)

- Goal: "Abel Crane wants you in the mill loft. Bring Hesper's moth-smoke."
- abel: "Up here. Mind the third step." / "Look at them. Grey as ash and they don't mind the light. They weren't here before that grey-cloak came through."
- hesper (her voice, as Chapter 1's off-map line): "I counted them by threes. The loft holds 3⁷ moths. One pot of my smoke clears 3⁴."
- abel: "So how many pots do I light?"
- pell: "Seven divided by four doesn't even go. So… three to the eleven?"
- → `pe4_moths`, then abel: "And in pots a miller can count?" → `pe4_pots`
- abel: "The grain nook's smaller. Hesper made it 3⁴ moths in there." → `pe4_equal` (card, then value: "How many pots is that?")
- abel: "Subtracting, for a dividing sum. Why does that work?" → `pe4_why`
- Payoff. `""`: "Twenty-seven smoke pots, lit along the loft beams. The moths pour out of the window in a long grey ribbon." / abel: "Good riddance. Though I'd like to know where they're going."
- Journal: "Same base, dividing: subtract the exponents. 3⁷ ÷ 3⁴ = 3³. And 3⁴ ÷ 3⁴ = 3⁰ = 1."

## 7. The nests in the well-house (`nests`)

- Goal: "Marta Fenn says the moths from the mill are in her well-house roof."
- marta: "{name}! They've nested. Up there, in the roof, grey lumps like wet paper." / "I can't light smoke by the well for four nights. The water's being drawn for the whole village."
- hesper (her voice): "I watched one nest. They hatch twice a night, and each hatching triples them. So the swarm grows 3² times every night."
- marta: "Four nights of that. How many times bigger?"
- pell: "Three squared, four times over. Two and four… 3⁶."
- → `pe5_nest`
- `""`: "Abel has sent his slate over with two sums on it: 3² × 3⁴, two swarms multiplied, and (3²)⁴, one swarm for four nights." → `pe5_pair`
- hesper (her voice): "A thought for the moss. I can feed it to double three times a day for four days, or four times a day for three days. Which grows more?" → `pe5_same`
- Payoff. `""`: "You tell Marta: 3⁸. Six thousand five hundred and sixty-one times bigger." / marta: "Six thousand times? Then we don't wait." / `""`: "She and Pell carry the well bucket out, and the roof is smoked that evening."
- Journal: "A power of a power: multiply the exponents. (3²)⁴ = 3⁸. Not the same as 3² × 3⁴ = 3⁶."

## 8. Pell's spell jar (`jar`)

- Goal: "Pell is at Hesper's seed bed with a jar, looking pleased."
- pell: "Done! Hesper wanted the square bed filled for the winter herbs. Each side is 2 trays of 3 pots." / "So I fetched 2 × 3² seeds. Bed's full. Well. It will be."
- hesper: "Will it. {name}, before he plants one: is (2 × 3)² the same as 2 × 3²?" → `pe6_predict`
- hesper: "Then how many pots are in the bed?" → `pe6_jar`
- `""`: "Pell counts his jar twice. Eighteen. He is 18 seeds short."
- hesper: "My seed crates are cubes, 2x hands along each edge, where x is the pot size. The volume?" → `pe6_coef`
- hesper: "The small bed by the door is square too, ⅔ of a pace on each side. What fraction of a square pace is that?" → `pe6_quot`
- pell: "Fine. A new bed, then. 3 + 4 pots on a side. That's 3² + 4² pots."
- → `pe6_sum` ("Is Pell right this time?")
- Payoff. pell: "Forty-nine. Not twenty-five." / hesper: "Go and fetch the other eighteen for the first bed before you plan a second." / `""`: "Pell goes, counting on his fingers."
- Journal: "An exponent on brackets goes to every factor: (2 × 3)² = 2² × 3². It does not spread over + or −."

## 9. The boulder on the road (`boulder`)

- hesper: "The beds are ready and the seed isn't. Take the Low Road to Highstead and ask Gale Harrow for vault seed." / "There's been a rock-fall on the road, I hear. Take this." / `""`: "She ties a tag to your wrist. On it, in her small hand: 2⁻³."
- Goal: "Take the Low Road toward Highstead."
- (at the boulder) `""`: "A boulder taller than you are sits square across the Low Road. A loaded seed cart waits behind a patient horse. Orrin Vael is sitting on the boulder."
- bram: "Bram Ostler, carter. Seed for the Ford, if I could get it there. Came down from the gorge edge in the night." / "What's that on your wrist? Minus three? You'll make it *minus* a boulder? What's that, a hole?"
- orrin: "Before you cast it. What will 2⁻³ do to the boulder?" → `pe7_predict`
- orrin: "Show the carter. Start from what he knows." → the board (pattern panel)
- → `pe7_boulder`
- bram: "It weighs ninety-six stone if it weighs a pound. What's an eighth of that?" → `pe7_weight`
- bram: "Twelve stone. Old Bess can drag fifteen."
- orrin: "Good. Now a better question. Can a negative exponent ever give a negative number?" → `pe7_negbase` (ask, then value: "Then what is (−2)⁻³?")
- Payoff. `""`: "You cast the charm. The boulder folds in on itself, halving, halving, halving, to the size of a hay bale." / `""`: "Bram's horse drags it onto the verge. The cart rolls through." / bram: "A hole, I said. Shows what I know. Good day to you, apprentice." / orrin: "I'm for Highstead too. Walk with me."
- Journal: "A negative exponent is 1 over the power: 2⁻³ = 1⁄2³ = ⅛. Small and positive, not negative."

## 10. The seed vault (`vault`)

- Goal: "Go on to Highstead. Gale Harrow keeps the seed vault in the grain-tower yard."
- If the tower-yard gate is still frozen: `""`: "The gate to the tower yard is frozen shut. There's a gold ring in front of it." (the Balance spot, then go on.)
- gale: "Hesper's apprentice. And a Warden. You'll want seed, and I can't give you any." / "The vault has a weighing lock. Every season the dial steps down one, and I put its value on the pan in seed-weights." / "The stone says nought. So I put nothing on the pan, and the door won't move." / "Next season it says minus three. How do I weigh out minus three?"
- `""`: "Grey lines crawl over the last three lines of the stone. At the yard fence, a figure in a grey cloak is watching."
- orrin: "Before you touch it. Read down the true lines: 27, 9, 3. What comes next?" → `rune2_predict`
- Stage 2 lines. orrin: "Now test it. One rung at a time, and watch the pan." / (after the three rungs) orrin: "Another way to the same place. What is 3³ ÷ 3³?" / orrin: "And by the quotient law, what is its exponent?" / `""`: "With one weight on the pan, the lock tips a hair."
- Stage 3. orrin: "Say what is wrong with the stone." → `rune2_explain` / gale: "I'll want it in plain words for the vault book. Why is 3⁰ equal to 1 and not 0?" → `rune2_why` (typed) / orrin: "Now cut the true lines." → fix 1 / `""`: "The outer stone settles. Inside the arch there is a second stone, in fours: 4⁰ = 0 · 4⁻² = −16." → fix 2
- Flare. `""`: "The grey lines thicken. The pan swings empty and the stone goes cold under your hand." / orrin: "What do you do to get from one line to the next?"
- After a second loss. hesper (her voice): "Slowly, with me. 27, 9, 3: each is the one above divided by 3. Then 1. Then ⅓. Then 1⁄9." / `""`: "The lines come right under your hand as she says them."
- Breaking. `""`: "The carving cracks with a gold flash and cuts itself again: 1, ⅓, 1⁄9." / `""`: "Gale sets one weight on the pan. The door swings in on racks of seed sacks." / gale: "One. All this for one." / orrin: "It usually is."
- The chips. `""`: "Orrin picks a chip of stone from under the dial and holds it beside the one from the grain-share stone." / orrin: "Same hand." / `""`: "He says no more, and puts both in his coat."
- Sefa (`T.choose`, remembered as `sefa_ch2`: `call`, `chip`, `go`). `""`: "The figure at the fence has not run. They are looking at the open door." Options: **Call out: "Wait. Did you carve this?"** · **Hold up a chip of the stone and say nothing** · **Let them go.**
  - call: `""`: "The figure stops for one breath, half turned. Then the grey cloak is gone between the towers."
  - chip: `""`: "The figure looks at the chip in your hand for a long moment. Then the grey cloak is gone between the towers."
  - go: `""`: "You watch the grey cloak go, between the towers and out of sight."
- gale: "Take two sacks. Tell Hesper the vault owes her."
- Journal: "The vault stone said 3⁰ = 0 and 3⁻¹ = −3. True lines: 1, ⅓, 1⁄9. Each step down divides by 3." If `call` or `chip`: "The grey-cloak saw me see them."

## 11. The Growth sigil (`sigil2`)

- Goal: "Carry the vault seed home to Hesper's seed bed."
- hesper: "Vault seed. Put the first one in yourself. Go on."
- `""`: "You press the seed into the pot. Green-gold light runs up your arm and settles on the back of your other hand."
- Banner: "The Growth sigil" · under it: "Make things double, triple or shrink by powers."
- hesper: "Growth. Name a base and an exponent, and a living thing will follow it. Up for growing, below nought for shrinking." / "Nought changes nothing, as you know better than the vault stone did." / "There are green-gold stars where it's wanted. Mind you count before you cast."
- Journal: "I have the Growth sigil. At a green-gold star: choose the exponent. Positive grows, negative shrinks, 0 changes nothing."
- Charge line (as Chapter 1's, with Growth and the star places): "Your Growth is charged %s. There are green-gold stars by the fold hedge and in the tower yard at Highstead, if you want the practice."

## 12. First use and the cat (`vine`)

- `""`: "The next morning."
- pell: "{name}! There's a cat crying on the ledge over the mill pond. It's been there all night. Nobody can reach it."
- Goal: "Cross the mill pond and reach the ledge on the far side."
- (pond: the Balance spot as built.) At the ledge star, first time, fixed numbers: "The vine is 1 hand tall and doubles with each pulse. The ledge is 32 hands up. Cast 2 to the…?" (5)
- `""`: "The vine climbs the rock, doubling and doubling, and curls over the ledge." / `""`: "Before you can set a foot on it, a small black cat with gold eyes walks down the vine by itself and sits on your boots."
- pell: "It likes you. You have to name it. Those are the rules."
- Name box: "Name the cat" (default "Soot").
- `""`: "{cat} follows you home, as if this had always been the plan."
- Journal: "A cat came down my first vine. {cat} follows me now."

## 13. Chapter end (`chapter_end2`)

- hesper: "The field is green, the loft is clear, and there's seed in the ground. Not a bad month's work, {name}."
- orrin: "Two stones, one hand. And whoever carves them wants us to see the gorge." / "The top of the bank above the vault looks over the broken bridge. When you can grow a vine that high, look."
- hesper: "That's for another day. Tonight, soup."
- `""`: "End of Chapter 2: The Blight." Then the report.

---

## Growth spots: panel text

Seeded per spot and visit; `{b}` base, numbers from the spot's seed (design §8).
- **Reach:** "The vine is 1 hand tall and grows {b} times with each pulse. The ledge is {target} hands up. Cast {b} to the…?" (for base 2: "and doubles with each pulse"; base 3: "and triples with each pulse")
- **Shrink:** "The gap is 1⁄{target} of your height. Your charm works in {b}s. Cast {b} to the…?"
- **Top up (grow):** "The vine has grown {b}^m hands. It needs {b}^n. Cast {b} to the…?" (powers drawn with raised exponents)
- **Top up (back down):** "The vine has overgrown to {b}^m hands. The gap needs {b}^n. Cast {b} to the…?"
- Too little (grow): "The vine stops short at {value} hands. Try again." Too much (grow): "The vine shoots past the ledge and flops over. Too far."
- Too little (shrink): "Still too big to fit: you are 1⁄{value} of your height. Try again." Too much (shrink): "You are the size of a beetle. Too far."
- Exponent 0 typed: "To the nought changes nothing. The vine stays as it is."
- Wrong sign: "That goes the other way. Positive grows, negative shrinks."
- After 3 wrong tries: "Hesper's voice: \"{b} to the {answer}. Count the steps next time.\"" and the spot works.
- Spot labels: "The pond ledge", "The hedge gap", "The vault vine", "Orrin's window".
- Hedge gap, first time through: `""`: "You come out by the Low Road, the size of yourself again, with a leaf in your hair."
- Vault vine top: `""`: "From the top of the bank you can see the far end of the broken bridge, and gold lines still moving on its cables."
- Orrin's window without six pips: `""`: "A green-gold star, faint, high on the tower's west wall. Your Growth isn't charged enough to reach it."
- Orrin's window (the secret): `""`: "The vine carries you to the window ledge. The door below is locked, but the shutter is open." / `""`: "A desk. Two chips of carved stone, side by side on a cloth." / `""`: "And a small painting of a young apprentice in Warden's grey, hung with its face turned to the wall." (`T.remember` on Orrin: `orrin_painting`.) Journal: "In Orrin's tower: the two rune chips, and a painting turned to the wall."

## Second looks: prompts

The giver's Chapter 1 second-look opener is reused ("One more like the other day?" pattern). Prompts by variant; answers and named-error values are in the design §8.1.

| Key | A | B | C |
|---|---|---|---|
| `pe2_day0` (Odile, value) | "A moss that grows 4 times a day. Day 0 and day 1 together: 4⁰ + 4¹ patches?" | "Six pots, each with a 10-times moss on its day 0. 6 × 10⁰ patches?" | "Two beds on day 0: a 7-times moss and a 2-times moss. 7⁰ + 2⁰ patches?" |
| `pe3_cure` (Rowan, card) | "3⁴ × 3² as one power of 3." | "2⁵ × 2⁵ as one power of 2." | "5² × 5 as one power of 5." |
| `pe4_moths` (Abel, card) | "2⁹ moths, 2⁶ to a pot. Pots, as a power of 2?" | "5⁶ moths, 5⁴ to a pot. Pots, as a power of 5?" | "3⁵ moths, 3⁵ to a pot. Pots, as a power of 3?" |
| `pe5_nest` (Marta, card) | "A swarm that grows 2² times a night, for 5 nights: (2²)⁵ as one power." | "5³ times a night, for 2 nights: (5³)² as one power." | "3³ times a night, for 3 nights: (3³)³ as one power." |
| `pe6_jar` (Pell, value) | "A square bed, each side 2 trays of 5 pots. (2 × 5)² pots?" | "A cube of crates, 3 stacks of 2 along each edge. (3 × 2)³ crates?" | "A square bed, each side 4 trays of 3 pots. (4 × 3)² pots?" |
| `pe7_boulder` (Bram, value) | "A charm tag reads 3⁻². What fraction of its size?" | "A tag reads 4⁻². What fraction?" | "A tag reads 10⁻³. What fraction?" |

Named-error lines for the variants (one per kind, used for every variant of that quest):
- Tally, zero exponent taken as 0: "A moss on day 0 isn't nothing. What is any base to the exponent 0?" · taken as the base: "That's day 1. Day 0 is one row further back."
- Cure, exponents multiplied: "You multiplied the exponents. Count the factors side by side." · variant C answer 2 (one line for both ways of getting it): "A bare 5 is 5¹, one more 5. Count them all."
- Moths, exponents added: "You added. That's for multiplying. Each pot takes factors away."
- Nests, exponents added: "You added. Write the inside power out as many times as the outside exponent says."
- Jar, only the last factor raised: "The exponent covers both numbers in the brackets." · the exponent used as a multiplier: "That's multiplying by the exponent. Multiply the bracket by itself."
- Boulder, negative: "A negative exponent isn't a negative number." · base times exponent: "That's the base times the exponent. Divide by the base, that many times, from 1." · the positive power: "The minus sends it underneath: 1 over the power."

Bram is not in Brindle Ford after the boulder: he stands by his cart outside the common barn from `boulder_done` on, for his second look.

## Report labels

Row labels by key (the report shows these, never raw keys):
`pe1_lesson` "Why 2⁵ is 32" · `pe1_seeds` "2⁶" · `pe1_turn` "(−2)⁵" · `pe1_brackets` "−2⁴" · `pe2_day0` "3⁰ on the tally" · `pe2_other` "5⁰" · `pe2_why` "Why a zero exponent gives 1" · `pe3_cure` "2⁶ × 2³ as one power" · `pe3_value` "2⁹ as a number" · `pe3_bases` "Different bases" · `pe4_moths` "3⁷ ÷ 3⁴ as one power" · `pe4_pots` "3³ as a number" · `pe4_equal` "3⁴ ÷ 3⁴" (listed under PE2 and PE4) · `pe4_why` "Why exponents subtract" · `pe5_nest` "(3²)⁴ as one power" · `pe5_pair` "3² × 3⁴ beside (3²)⁴" · `pe5_same` "(2³)⁴ and (2⁴)³" · `pe6_predict` "(2 × 3)² or 2 × 3²" · `pe6_jar` "(2 × 3)²" · `pe6_coef` "(2x)³" · `pe6_quot` "(⅔)²" · `pe6_sum` "(3 + 4)²" · `pe7_predict` "What 2⁻³ does" · `pe7_boulder` "2⁻³" · `pe7_weight` "96 × ⅛" · `pe7_negbase` "(−2)⁻³" · rune rows: "Predicted the next line", "Explained the stone", "3⁰ and 3⁻²", "4⁰ and 4⁻²".
"In my own words" rows: "−2⁴ and (−2)⁴, for Pell" · "Why 3⁰ is 1, for Gale".
Charge row: "Growth charge: n of 6".

---

## Added after the first build (2026-11-14)

### Feedback on wrong options the design left bare

| Key | Wrong option | Feedback |
|---|---|---|
| "enough for 500?" (after `pe3_value`) | "No, 2⁹ is only 18" | "18 is 2 × 9. 2⁹ is nine 2s multiplied: you just worked it out." |
| | "Yes, there'll be thousands" | "Enough, yes, but check the size. 2⁹ is 512, only 12 to spare." |
| `pe4_why` | "…you do the opposite to the base" | "The base stays 3 all the way through. Look at what happens to the count of 3s." |
| | "Because 7 ÷ 4 can't be done…" | "The exponents are never divided. Write the 3s out and cross them off." |
| `pe5_same` | "Three times a day for four days, because there are more days" | "Count the doublings in each plan. Three a day for four days is how many?" |
| | "Four times a day for three days…" | "Count the doublings in each plan. Four a day for three days is how many?" |
| `pe6_predict` | "Yes, the brackets don't change a multiplication" | "They change what the exponent reaches. Work out each one: 6² and 2 × 9." |
| | "Yes, both are 2 × 3 × 2" | "An exponent of 2 means multiplied by itself, not times 2. Work out 6² and 2 × 9." |
| `pe6_sum` | "Yes, the exponent goes to each number in the brackets" | "That works for × and ÷. Try it here: 7² against 9 + 16." |
| | "No, it's 3² × 4² = 144" | "That would be (3 × 4)². The bed has 3 + 4 = 7 pots on a side." |
| `pe7_predict` | "Make it −8 times its size…" | "Is there such a thing as minus a boulder? Go down the board: 8, 4, 2, 1, and keep halving." |
| | "Make it 8 times bigger" | "That's 2³. Which way does the board go when the exponent goes down?" |
| | "Make it −6 times its size, 2 × −3" | "An exponent isn't a multiplier. Go down the board from 2¹, halving." |
| `pe7_negbase` (ask) | "Never" | "Try a negative base. What is (−2)³, and what is 1 over that?" |
| | "Always" | "You just made ⅛ from 2⁻³. Was that negative?" |
| `rune2_predict` | "0, because the exponent is 0" | "Read the values, not the exponents. 27, 9, 3: what is done each time?" |
| | "0, because the numbers are shrinking away to nothing" | "They shrink, but by dividing. Does dividing 3 by 3 give nothing?" |
| | "You can't tell: a zero exponent has no meaning." | "The pattern gives it one. 27, 9, 3: what is done each time?" |

### Hesper's praise by quest (after the first praise, as Chapter 1)

- Lesson: "Base, exponent, brackets. You read all three."
- Tally: "You walked down the board to day 0. That's the zero exponent."
- Cure: "Same base, so you counted the factors together. That's the product law."
- Moths: "You cancelled, and counted what was left. That's the quotient law."
- Nests: "Lots of lots, so you multiplied the exponents. Good."
- Jar: "You gave the exponent to everything in the brackets. Pell, take note."
- Boulder: "Past 1 and still halving. That's a negative exponent."

Where the quest giver is not Hesper, it is her voice, as in Chapter 1.

### Growth spots, a top-up that goes back down

- Not enough: "The vine is still too long, at {value} hands. Try again."
- Too much: "The vine shrivels to almost nothing. Too far."

### The rune's fixes

- Typing the stone's own value (0, −9, 0, −16): "That's what the rune says. Go down the ladder: what is the line above, divided by the base?"
- 3⁰ or 4⁰ given as the base (3 or 4): "That's the exponent 1. One more rung down."
- 3⁻² as −1⁄9, or 4⁻² as −1⁄16: "The size is right. Dividing a positive number never takes it below zero."
- 3⁻² as ⅓, or 4⁻² as ¼: "That's the exponent −1. One more rung down."
- Hint (Gentle), all four: "Start from the base to the 1 and divide by the base once for each step down."
- Why, after the last try: "Each step down divides by the base: 3, 1, ⅓, 1⁄9." (fours: "4, 1, ¼, 1⁄16.")

### Second looks and the lesson

- Second looks use their quest's hint. The why line after the last try is "The answer is {answer}." followed by the quest's why line.
- The lesson's why line (after the last try on `pe1_seeds`): "2⁶ = 2 × 2 × 2 × 2 × 2 × 2 = 64." On `pe1_turn`: "(−2)⁵ = −2 × −2 × −2 × −2 × −2 = −32: four pair off, one is left." On `pe1_brackets`: "−2⁴ = −(2 × 2 × 2 × 2) = −16."

### Fixes

- `pe6_quot`: the named error is the value **⅔** (also typed as 4⁄6), not "4⁄6 = doubling". Line: "That's the side, not the square. Multiply ⅔ by ⅔."
- The extra Highstead farmer `fam2` is renamed **Tobin**, so there is one Bram.
- The chips: the apprentice already carries the grain-share chip from Chapter 1, so the lines are: `""`: "Orrin picks a chip of stone from under the dial and holds it beside the chip from the grain-share stone." / orrin: "Same hand." / `""`: "He says no more, and hands the new chip to you. \"Keep them together.\"" The apprentice keeps it (Bag: "A chip of the vault stone", about: "Cut by the same hand as the grain-share rune, Orrin says. He told you to keep them together."). These replace the chip lines in section 10.
- Orrin's window: since the apprentice holds both chips, the desk line is "A desk. Two charcoal rubbings of carved stone, side by side: the grain-share rune and the vault rune." and the Journal line is "In Orrin's tower: rubbings of the two runes, and a painting turned to the wall." These replace the lines under Growth spots.
- Chapter end goal: "Walk home to Hesper's cottage."
- Panel wording from the build is confirmed: the titles, the kickers ("Quest · PE3"), "Odile's board, newest first.", "Pots for the nook:", "Day 0, which is 3⁰ = ?", "2⁹ = ? patches", "Type a whole number in each box, like 5 or -3.", the three title buttons, the Growth pip line, and the single rune-fix report labels.
- The "enough for 500?" question and the ask half of `pe7_negbase` stay unrecorded.
- Not built, left for later: moth specks in the loft before the smoke.

---

## Wording pass after the manager's check (2026-11-15, board T-036)

These replace the earlier wording wherever it appears.

- **`pe2_other` (R-010, R-014):** the second moss is no longer Rowan's, and the student gets a pattern to read. Odile: "The mill yard gets a different moss. It grows five times a day." / "Abel's slate says Day 2: 25 · Day 1: 5. What goes on day 0?" Panel prompt: "Day 2: 25 · Day 1: 5 · Day 0, which is 5⁰ = ?" Named error 0: "Day 1 is 5. What do you divide by to go back a day?" Named error 5: "That's day 1. One more day back."
- **`pe2_why` question text (R-010):** "Why do both mosses come to 1 on day 0, whatever they multiply by?" The options and feedback are unchanged.
- **`pe1_turn` why line (R-012):** "(−2)⁵ = (−2) × (−2) × (−2) × (−2) × (−2) = −32: four pair off, one is left."
- **`pe5_nest` named error 16 (R-015):** "You raised 2 to the 4. Four lots of two 3s is 4 × 2 = 8 threes."
- **`pe6_coef` (R-015):** "My seed crates are cubes, 2x hands along each edge, where x is the width of one pot. The volume?"
- **`pe7_negbase` right option (R-015):** "Only when the base is negative and the exponent is odd, like (−2)⁻³." The wrong options and the follow-up value are unchanged.
- **`pe5_same` (R-013):** the two plans stay in Hesper's line before the panel; the question text is only "Which plan grows more?"
- **`pe6_sum` (R-013):** the question text is only "Is Pell right this time?"; right option: "No. (3 + 4)² = 7² = 49, but 3² + 4² = 25. Exponents spread over × and ÷, not + and −."
- **`rune2_explain` right option (R-013):** "Each step down divides by 3, so 3⁰ = 1, then ⅓, then 1⁄9: small positive fractions, never zero or negative."
- Any narrator box over about 25 words is split at a sentence break, no words changed.
- Not changed: the right option is often the longest in a question (R-013). The options are shuffled and the wrong ones are full sentences; left for a later pass.

## After the walked play (2026-11-15, board T-033)

These replace the earlier wording wherever it appears.

- **Boulder arrival** (Orrin stands beside the boulder; two boxes): `""`: "A boulder taller than you are sits square across the Low Road." / `""`: "A loaded seed cart waits behind a patient horse. Orrin Vael stands beside the rock, looking up at the gorge edge."
- **The mill is one room, not a loft.** Goal: "Abel Crane wants you at the mill. Bring Hesper's moth-smoke." Abel: "In here. Mind the step." Hesper's voice: "I counted them by threes. The mill holds 3⁷ moths. One pot of my smoke clears 3⁴." Payoff: `""`: "You light the pots three at a time until all twenty-seven have burned." / `""`: "The moths pour out of the window in a long grey ribbon." Abel's lines are unchanged. Anywhere else a line says "loft", it says "mill".
- **Hints for the jar's later checks.** `pe6_coef`: "Write (2x) three times and multiply. How many 2s? How many x's?" Why: "(2x)³ = 2x × 2x × 2x = 2 × 2 × 2 × x × x × x = 8x³." `pe6_quot`: "Squaring means times itself. Multiply ⅔ by ⅔: tops together, bottoms together." Why: "(⅔)² = ⅔ × ⅔ = 4⁄9." `pe6_sum` and `pe6_predict` keep the jar's hint.
- **Shrunk boulder:** the payoff says "to the size of a hay bale", so the verge rock is drawn about hay-bale size (roughly 1 tile wide, waist high).
- **Report, "What I decided" rows:** not changed. The rows are quest summaries, labelled "Part N" by the engine; naming them needs an engine change (board T-043).

## Two new checks and the report reminder (2026-11-15, board T-037 and T-040, teacher's choice)

**`pe2_negzero` (PE2, `T.frac`, report label "(−15)⁰").** In the moss tally, straight after `pe2_why` and before the payoff. Not a pip.
- pell: "What about Hesper's turnabout seeds? Base minus fifteen, exponent nought. That has to be minus one."
- odile: "Don't look at me. {name}?"
- Panel prompt: "(−15)⁰ = ?" Answer: **1**.
- Named error −1: "The brackets make the base −15. One step back from −15 is (−15) ÷ (−15), and that is positive."
- Named error 0: "(−15)¹ is −15. To go back one step, divide by the base: (−15) ÷ (−15)."
- Named error −15: "That's (−15)¹. One more step back."
- Hint: the tally's hint. Why: "(−15)¹ = −15. One step back divides by −15: (−15) ÷ (−15) = 1. Any base but 0 gives 1."
- After it, pell: "One again. Even for a minus."

**`pe7_flip` (PE7, `T.frac`, report label "(⅓)⁻²").** In the boulder quest, after the typed value of `pe7_negbase` and before the payoff. Not a pip.
- bram: "While you're at it. Hesper shrank my seed sacks for the road, to a third and a third again."
- bram: "The tag to undo it says (⅓)⁻². How many times bigger will they get?"
- pell: "A third, and a minus. So, minus a ninth?"
- Panel prompt: "(⅓)⁻² = ?" Answer: **9**.
- Named error 1/9: "That's (⅓)². The minus flips it: 1 over 1⁄9."
- Named error −1/9: "A negative exponent isn't a negative number. Flip ⅓, then square."
- Named error −9: "The size is right. The minus means flip, not below zero."
- Named error 3: "That's the flip. Now square it."
- Named error 6: "That's 3 × 2. Flip ⅓ to 3, then multiply 3 by itself."
- Hint: "Hesper: \"A negative exponent means 1 over. What is 1 over ⅓? Then square it.\"" Why: "(⅓)⁻² = 1 ÷ (⅓)² = 1 ÷ 1⁄9 = 9. Or flip first: 3² = 9."
- After it. `""`: "The sacks swell back to full size on the cart bed." / bram: "Nine times. That's my seed back."

**Report reminder (T-040).** The report stays one chapter at a time.
- Title, "Go on to Chapter 2": before Chapter 2 starts, one box with two buttons. Text: "From here your report shows Chapter 2 only. If your teacher wants your Chapter 1 report, download it first." Buttons: "Go on to Chapter 2" · "Back".
- Journal, once Chapter 1 is finished: "Chapter 1 is done. Download your report before you go on to Chapter 2."

**The cat (long box split, words changed slightly):** `""`: "Before you can set a foot on it, a small black cat with gold eyes walks down the vine by itself." / `""`: "It sits on your boots."
