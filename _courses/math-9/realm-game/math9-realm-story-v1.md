# The Measure of the Realm — Story Bible v1
*Math 9 fantasy quest game. Story and chapter plan only, no game yet. Written 2026-11-08.*

**What this is:** the story for a year-long Math 9 game. A student-made apprentice learns magic from a council of wizards, sorcerers and witches, earns powers by solving maths problems for the people of the realm, and saves the realm from a mage who sells shortcuts instead of understanding.

**Format decided:** whole year, all 11 Math 9 topics, one chapter per topic. A 3D walkable world built on the Godot engine of CEFL Town v2 (`godot/cefl-town-v2/`, rules in `_games-context.md`). The student creates the hero.

**Read with:** `_courses/math-9/_context.md` (depth ceilings, misconceptions, sequence) and `_games-context.md` (build, design and test rules).

---

## 1. The world

**Everhold** is an old realm of farms, river cities, mountain holds and wind-cut badlands. Its landscapes are fantasy versions of Alberta: prairie with chinook winds, a river city of locks and canals, the Rockies, and badlands full of giant bones.

**The Measure.** Everything in Everhold rests on a hidden structure: the lengths of bridges, the flow of rivers, the arcs of towers, the turn of harvests. Mages see it as faint gold lines and numbers in the air. Magic is shaping the Measure, and you can only shape what you understand. **Magic here is mathematics.**

**The Wardens of the Measure.** An old order of wizards, sorcerers and witches. A Warden takes one apprentice at a time and teaches them face to face, by question more than by answer. Ranks: **Novice → Adept → Warden.** The Wardens' saying: *"A spell you cannot explain is a spell that will fail you."*

**The Unweaving.** The Measure is fraying. Bridges drop, floodwalls give way, harvests fail, and the star-charts no longer line up. People say the realm is dying of old age.

**The villain: Morvane the Hollow.** Once the most gifted Warden of his age, and Orrin's own apprentice. He grew tired of slow understanding and invented **hollow spells**: rules that *look* right and work some of the time, with no understanding behind them. He teaches them free to anyone who wants power fast. His followers, **the Hollow** (grey-cloaked, faceless, made more of habit than flesh), carve **false runes** into bridges, gates, maps and prophecies. Anything built on a false rune fails, sooner or later.

**The heart of the story.** Morvane is power without understanding. The hero is power *through* understanding. The hero never beats a false rune by force. They predict what it will do, show why it is wrong, and the rune cracks. (In class terms, each false rune is a Math 9 misconception, and breaking it is a refutation.)

---

## 2. The hero

The student names the apprentice and picks their look and pronouns. The story calls them **"the apprentice"** or by name.

**Background:** a farm kid from **Brindle Ford**, a village in Emberdale. Good with their hands, not known for book learning. On the night of the prologue, the gorge bridge falls, and the apprentice is the only person in the village who sees the gold lines of the Measure snap.

**Their arc:** from "I'm not a maths person, I just guess" to someone who asks *why* before they act. The hero earns power by helping people, and the last choice of the game is about whether understanding can be taught even to Morvane.

---

## 3. The mentors

| Mentor | Kind | Where | Teaches | Personality and voice |
|---|---|---|---|---|
| **Archmage Orrin Vael** | Wizard; the hero's own master | Travels with the hero (Acts I–II); a voice after | Ties the strands together | Old, patient, dry humour. Answers a question with a better question. "Good. Now tell me *why* it worked." |
| **Hesper Marrow** | Hedge-witch of Emberdale | Her cottage above Brindle Ford | Number (Ch 1–3) | Warm and practical; keeps hens and the balance of warm and cold. "Fractions are just fair shares. Nobody likes an unfair share." |
| **Taddeus Quill** | Sorcerer, Keeper of the Great Scales | The Scale-Hall of Riverholm | Algebra (Ch 4–6) | Precise, fussy about neat work, secretly kind. "Whatever you do to one side, you do to the other. *Always.*" |
| **Ilsabet Thorne** | Sorceress, the Ringwarden | The Observatory of Greystone | Shape & Space (Ch 7–9) | Stern, few words, measures everything twice. "Show me. Then I'll believe you." |
| **Old Wenna Ashgrove** | Seer of the Bonelands | A hut built inside a giant ribcage | Statistics & Probability (Ch 10–11) | Riddling, sceptical; the only seer who doesn't trust prophecy. "The bones don't tell the future, child. They tell what *usually* happens." |

Each mentor has one line they say when the hero gets something right on the first try, and one gentle line for a wrong answer that points at the idea, never the answer.

**Other recurring people:**
- **Pell**, the apprentice's younger cousin. Tags along in Emberdale, gets into trouble, asks the questions a student would ask.
- **Captain Roan Ashby**, of the river watch. Starts out sure maths is "wizard stuff"; by Act IV asks the hero to teach the watch.
- **Sefa**, a Hollow who doubts. Appears in each act; the hero's choices decide whether Sefa leaves the Hollow (pays off in the finale).

---

## 4. How every chapter works

Each chapter is one Math 9 topic. It opens after the class starts that topic and can be played across the unit.

1. **The lesson.** A short scene with the mentor that matches the class notes. The mentor works one example, then asks the apprentice to explain one step (the notes' self-explanation prompt, told as the mentor's question).
2. **Help quests (3–4).** People of the region with real problems the skill solves. Each quest maps to one notes section (code given below). The maths must matter to the problem: take the maths out and the quest makes no sense.
3. **The false rune (the chapter trial).** A Hollow has carved a misconception into something that matters. The hero is shown the rune and asked to **predict** what will happen, then **test** it, then **explain** why it fails. Breaking it finishes the chapter. Losing is possible (the bridge drops, the gate stays shut); the hero tries again with a hint from the mentor.
4. **The sigil (the power).** The hero earns a sigil: a spell that **opens new paths in the world**. Sigils are charged by helping people; first-try answers charge them fully.
5. **Old sigils come back.** Later regions have gates and puzzles that need earlier sigils, so earlier topics keep returning (spaced, mixed practice inside the story).

**Rank:** Novice through Act II, **Adept** after Act III, **Warden** at the end.

---

## 5. Prologue: "The Night the Bridge Fell"

Harvest night in Brindle Ford. The village crosses the gorge bridge to the market at Highstead. The apprentice sees gold lines flicker along the cables, then snap. The bridge falls (no one dies; Pell is left dangling on the far side and is pulled up by rope).

An old traveller in a grey-blue coat was watching: **Orrin Vael**. He asks the apprentice what they saw. They describe the lines. Orrin goes quiet, then: "Then you can learn. Few can." He takes them to Hesper Marrow to begin.

Orrin keeps one thing from the apprentice: he saw a strange carving on the broken bridge cable.

**Teaches nothing yet.** It sets up: the Measure, the gold lines, the bridge (solved in Chapter 3), Orrin, Pell, and the hint of a carving.

---

## 6. Act I — Emberdale (Number): "The Spark"

**Region:** rolling prairie, canola-yellow fields, grain towers, a gorge with a river at the bottom. Chinook arches in the western sky. Village: **Brindle Ford**. Market town: **Highstead**. Mentor: **Hesper Marrow**.

### Chapter 1 — Rational numbers · Sigil: **Balance**
*Warm or chill anything by an exact amount, above or below zero.*
**Codes:** RN1–RN5.

- **Lesson:** Hesper's hens and her "warm-and-cold jar": numbers above and below zero, fractions and decimals of a degree, on a number line drawn in frost on her window.
- **Help quests:**
  - **The frozen well** (RN2): the well is at −12.5 °C; the coming chinook will raise it by 18.75 °C. Will it thaw? By how much?
  - **The miller's ledger** (RN2, RN3): the miller owes and is owed in quarters and thirds of a silver; sort the debts and find what he really has.
  - **Sharing the harvest** (RN4): ¾ of a cart of grain shared among families each taking ⅛ of a cart. How many families? (Dividing by a fraction gives more, not less.)
  - **The frost recipe** (RN5): Hesper's frost-ward recipe is a chain of operations with negatives; get the order right or the ward melts.
- **False rune:** carved on the **grain-share stone** at Highstead: *½ + ⅓ = 2⁄5*. Families are being shorted. The hero predicts whether two shares add to more or less than ½ (they must be more, so 2⁄5 can't be right), tests with a pie of grain, and fixes the stone.
- **Sigil opens:** iced-over streams to cross (freeze) and frozen doors (thaw).

### Chapter 2 — Powers & exponents · Sigil: **Growth**
*Make things double, triple or shrink by powers.*
**Codes:** PE1–PE7.

- **Lesson:** Hesper plants one spell-seed that splits in two every night. Repeated multiplication as a power; the laws as shortcuts *you can explain*.
- **Help quests:**
  - **The blight cure** (PE1, PE3): a cure-moss doubles each day; how many patches after 6 days? After 3 more?
  - **The boulder on the road** (PE7): shrink a boulder to 2⁻³ of its size. Is that bigger or smaller? (1⁄8; a negative exponent is a reciprocal, not a negative.)
  - **Hollow-moths** (PE4, PE5): moths spread by powers of 3; compare two swarms with quotient and power-of-a-power laws.
  - **Pell's spell jar** (PE6): (2 × 3)² seeds against 2 × 3²; Pell guesses they're the same.
- **False rune:** on the **seed vault** door: *3⁰ = 0* and *a negative exponent makes a negative*. The vault holds next year's seed and won't open. The hero uses the division pattern (3³ ÷ 3³) to show 3⁰ = 1 and opens it.
- **Sigil opens:** shrink to fit through small gaps; grow vines to climb.

### Chapter 3 — Square roots & the Pythagorean theorem · Sigil: **Bridgecraft**
*Span any gap with a beam or rope of exact length.*
**Codes:** SR1–SR4.

- **Lesson:** Hesper lays out square stones: area 49 means a side of 7. Some areas (like 20) have no whole-number side, and the side is an irrational number between two whole numbers.
- **Help quests:**
  - **The tower rescue** (SR3): a ladder for a window 12 m up, with the foot 5 m out.
  - **Rope for the ferry** (SR2): a square raft of area 50 m²; estimate the side to a tenth.
  - **The goat pen** (SR1, SR4): two square pens, one 0.36 km² and one 9⁄16 of a field-square; what are their sides? (0.6 and ¾)
- **False rune (the Act I trial):** the **gorge bridge** from the prologue. Its cables were cut using *√(a + b) = √a + √b*: the span needed √(9² + 12²) = 15 m, but the rune made it 9 + 12 = 21 m of slack cable, so the bridge sagged and fell. The hero predicts the right length, shows √(81 + 144) ≠ √81 + √144, and rebuilds the bridge with Bridgecraft.
- **Sigil opens:** bridges across gaps anywhere a right triangle can be found.

**Act I ending:** Under the bridge, Orrin shows the apprentice the carving he saw: a false rune. "Someone is doing this on purpose." He names Morvane, says only that Morvane "was a student once", and they leave for Riverholm. Pell stays behind with Hesper (and becomes her apprentice).

---

## 7. Act II — Riverholm (Algebra): "The Rising Water"

**Region:** a city built where three rivers meet; canals, lock gates, water-wheels, the giant bronze **Great Scales** that balance the river's flow. Spring flood season. Mentor: **Taddeus Quill**. Needs: **Balance** (negative rates), **Bridgecraft** (canal crossings).

### Chapter 4 — Linear relations · Sigil: **Pathsight**
*See a steady change as a glowing line, and see where it goes next.*
**Codes:** LR1–LR4.

- **Lesson:** Taddeus shows the flood gauge: the same pattern as a table, a graph, an equation and in words (the Rule of Four).
- **Help quests:**
  - **When does the water reach the market?** (LR2, LR3): the river is 1.2 m and rising 0.15 m an hour; the market floods at 2.4 m.
  - **Two ferries** (LR4): one charges 2 coppers a crossing; the other 5 coppers to board plus 1 a crossing. Direct versus partial variation; which is cheaper for how many crossings?
  - **The lock-keeper's table** (LR1): find the pattern and the rule from a table of water levels.
  - **The draining cistern** (LR2): a negative rate of change; where does the line hit zero?
- **False rune:** on the **flood-gauge tower**: *the slope is where the line starts*. The watch reads the starting level as the rate and thinks they have days, not hours. The hero shows slope as rise over run and saves the warning.
- **Sigil opens:** see hidden paths (moving platforms, tides) and predict where they'll be.

### Chapter 5 — Linear equations & inequalities · Sigils: **the Scales** and **Wards**
*The Scales unlock by balancing. Wards raise walls that hold any amount in a safe range.*
**Codes:** LE1–LE5.

- **Lesson:** at the Great Scales. Taddeus: "Whatever you do to one side, you do to the other."
- **Help quests:**
  - **The sealed lock gates** (LE1, LE2): a gate opens only to the value that balances 3(x − 2) + 4 = 19.
  - **The lost cargo** (LE3, LE5): a merchant's crate weighs ⅔ of its label plus 4 kg, and the scale reads 22 kg.
  - **Safe barge loads** (LE4): a barge sinks above 600 kg; the boatman weighs 80 kg and each sack 40 kg. How many sacks? Shown on a number line as a Ward.
  - **The floodwall** (LE4): keep the water level below a mark; dividing by a negative flips the inequality.
- **False rune:** on the **floodgate seal**: *divide by a negative, flip the sign* used on an *equation*. The seal gives the wrong key. The hero shows flipping is only for inequalities. Second puzzle: two doors marked "unsolvable". One is 2(x + 3) = 2x + 6 (an identity: every key opens it); the other is x + 5 = x + 2 (a contradiction: no key ever will). The Hollow left a guard behind the second.
- **Sigil opens:** Scales open locked doors; Wards hold back water and Hollow so the hero can pass.

### Chapter 6 — Polynomials · Sigil: **Shaping**
*Build and resize things with tiles of area.*
**Codes:** PO1–PO6.

- **Lesson:** Taddeus's tile table: x-tiles, x²-tiles and unit tiles; like terms as tiles of the same shape.
- **Help quests:**
  - **The flooded gardens** (PO2, PO3): put back garden plots by combining like terms.
  - **What washed away** (PO4): the plot was 3x² + 5x + 2; what's left is x² + 2x; how much was lost?
  - **Widen the market square** (PO5): a square stall area of side x is made 3 longer on one side: x(x + 3).
  - **The new dock** (PO6): (x + 2)(x + 4) with the area model.
- **False rune:** a Hollow architect's plan for the new floodwall: *(x + 2)(x + 4) = x² + 8*. The middle rectangles are missing, so the wall has holes. The hero draws the area model, finds the 6x, and the wall holds.
- **Sigil opens:** raise platforms and walls of a chosen size.

**Act II ending (the midpoint): "The Fall of the Scales."** Morvane comes to Riverholm in person: calm, persuasive, kind-sounding. He offers the apprentice his shortcuts ("Why spend years on *why*?"). The apprentice refuses. Morvane carves a false rune into the Great Scales and the river rises. **Orrin holds the floodgates with his own Measure while the apprentice and Taddeus re-balance the Scales.** The city is saved. Orrin is swept away and lost. From now on he is a **voice and a memory**: when the hero is stuck, the hint button is Orrin asking a question. Taddeus gives the apprentice Orrin's staff, cracked.

---

## 8. Act III — Greystone Peaks (Shape & Space): "The Reforging"

**Region:** mountain holds of stone-masons, cliff stairs, glacier lakes, a domed **Observatory** with a ring of standing stones. Mentor: **Ilsabet Thorne**, who says she will teach the apprentice only "if you can show me, not tell me." Needs: **Shaping** (area), **Pathsight** (ratios and rates), **Bridgecraft** (right triangles, SR3), **Balance** (RN4–RN5).

### Chapter 7 — Circle geometry · Sigil: **Ringcraft**
*Draw rune circles, find their centres, and send light along tangents.*
**Codes:** CG1–CG4.

- **Lesson:** Ilsabet's stone circle: centre, radius, chord, arc, and what changes when a chord passes through the centre.
- **Help quests:**
  - **The shattered ward-circle** (CG2): only part of the old circle is left; find its lost centre from two chords' perpendicular bisectors.
  - **The beacon** (CG4): aim a light that just grazes the round tower wall; the beam meets the radius at 90°.
  - **The star-gate** (CG3): an inscribed angle on the dome is half the central angle on the same arc.
  - **The masons' words** (CG1): sort a jumbled order of chord, diameter, radius, arc for a new apprentice mason.
- **False rune:** on the **Observatory dome**: *every inscribed angle is 90°*. The star-sights are all wrong. The hero shows only angles that stand on a diameter are 90°, and the stars line up again.
- **Sigil opens:** circular doors and seals; light beams to wake ancient mechanisms.

### Chapter 8 — Surface area & volume · Sigil: **Alchemy**
*Forge vessels, then fill or coat them exactly.*
**Codes:** ME1–ME5.

- **Lesson:** Ilsabet's forge: the outside (coat it, surface area) versus the inside (fill it, volume).
- **Help quests:**
  - **Armour for the stone guardian** (ME2): the plate needed to cover a cylinder-and-prism golem.
  - **The potion order** (ME3, ME4): how many cone flasks does one cylinder cauldron fill?
  - **The supply barrel** (ME3): two barrels; which holds more grain for winter?
  - **The tower roof** (ME5): a composite of a cylinder and a cone; how much slate?
- **False rune:** in the **alchemist's recipe book**: *a cone holds twice its cylinder*. Potions overflow and burn the lab. The hero pours: three cones fill one cylinder of the same base and height.
- **Sigil opens:** forge keys, vessels and plates to the size a puzzle needs.

### Chapter 9 — Similarity & scale · Sigil: **Farsight**
*Measure what you can't reach, from shadows, mirrors and maps.*
**Codes:** SI1–SI4.

- **Lesson:** Ilsabet's maps. Similar means same shape, different size; scale factor; AA, SSS and SAS.
- **Help quests:**
  - **The Wyrm Spire** (SI3, SI4): how tall is the spire? The apprentice's staff and its shadow against the spire's shadow.
  - **The pass map** (SI4): a scale of 1 : 50 000; how far to the next hold?
  - **The model hall** (SI2): build a scale model for the masons that fits on a table.
  - **Ration rates** (SI1): a proportion problem with the hold's stores.
- **False rune:** a Hollow-carved map: *similar means identical*. The army of the hold marches using a map drawn at the wrong size and walks into a cliff. The hero shows the shapes match but the sizes don't, finds the scale factor and turns the army in time.
- **Sigil opens:** see and measure far-off things; read hidden scale maps.

**Act III ending: "The Staff."** Ilsabet helps the apprentice reforge Orrin's cracked staff with all nine sigils. The apprentice is raised to **Adept**. A captured Hollow (Sefa, if the hero spared them in Act II) says Morvane has gone to the Bonelands to "prove the Unweaving is fate" and turn the whole realm to his side.

---

## 9. Act IV — The Bonelands (Statistics & Probability): "The False Prophecy"

**Region:** badlands of striped hills and hoodoos, the bones of ancient wyrms half out of the ground, an oracle-town called **Ossary**. People here gamble on fate-dice and follow prophecy. Mentor: **Old Wenna Ashgrove**. Needs: **Pathsight** (lines, LR3), **Balance** (RN2–RN3).

### Chapter 10 — Scatter plots & correlation · Sigil: **Augury**
*Read patterns in signs and records, and know how far to trust them.*
**Codes:** ST1–ST4.

- **Lesson:** Wenna lays out bones by size and age on the sand: a scatter plot. Patterns going up, going down, or none.
- **Help quests:**
  - **Ember-fall and failed crops** (ST2): is there a relationship? Positive, negative or none?
  - **The next river height** (ST3, ST4): draw a line of best fit by eye and predict inside (interpolate) and outside (extrapolate) the data. How far out can you trust it?
  - **Which cure worked?** (ST1, ST2): healers' records; choose the right graph for the data.
- **False rune: Morvane's Prophecy.** Morvane shows the town a chart: *villages that use more magic have more collapses, so magic causes the Unweaving*. He tells people to give up the Wardens and take his shortcuts instead. The correlation is real. The cause isn't: the Hollow carve their runes where there's most magic. The hero gathers the rune records, shows a third thing explains both, and the town stops listening to Morvane.
- **Sigil opens:** read clues and tracks; reveal hidden data on objects.

### Chapter 11 — Probability · Sigil: **Fateweaving**
*Weigh chances honestly: what usually happens, not what will.*
**Codes:** PR1–PR4.

- **Lesson:** Wenna's fate-bones: outcomes, sample spaces and tree diagrams.
- **Help quests:**
  - **The gambler** (PR1, PR3): a coin has come up tails five times; the gambler is betting everything that heads is "due".
  - **Drawing lots for the watch** (PR4): 10 straws, 3 short, drawn without putting them back; the chance two scouts in a row draw short.
  - **The harvest fair** (PR2): design a fair game with two spinners; list the sample space.
  - **Two gates** (PR3): pass a wind-gate and a rock-gate that are independent; chance of both.
- **False rune:** **Morvane's fate-dice** and his saying *five tails means heads is due*. He's been winning the townsfolk's land in bets. The hero shows each toss forgets the last, then finds the dice are loaded (experimental results far from theory over many throws).
- **Sigil opens:** see the chance on every choice; calm wild magic.

**Act IV ending:** Ossary turns against Morvane. Wenna names where he has gone: the **Spire of the Measure**, the centre of the realm, where the Measure is strongest. If his last false rune is carved there, it fails everywhere.

---

## 10. Finale — The Spire of the Measure

A tower of four floors, one per region, built from the materials of all four (frost-stone, river-bronze, mountain granite, bone). **Each floor mixes skills from every strand** (interleaved review before the final exam): a door that needs Bridgecraft *and* the Scales; a floor that floods unless you combine Pathsight and Wards; a dome that turns only by Ringcraft with Farsight.

**At the top:** Morvane has carved the **Great Hollow Rune**, every false rune of the journey braided together. He fights with arguments, not fireballs: each false rune is cast at the hero and they must take it apart, one at a time, with their reasons.

**The last moment:** Orrin's voice asks one last "why?", and this time the apprentice answers without help. The Great Hollow Rune cracks. Morvane, powerless, asks how the apprentice did it.

**The choice** (the engine remembers it):
- **Seal him** in the Measure, where he can do no harm.
- **Offer to teach him**, slowly, the way Orrin taught you. (If Sefa left the Hollow, Sefa speaks for this.)

**Epilogue:** the Measure is whole. The apprentice is named a **Warden**. The last scene changes with the choice and with who was helped: the gorge bridge rebuilt, Pell's first spell, Riverholm's new Scales with Orrin's name on them. Then a new Novice knocks on the door, and the apprentice asks them *why*.

---

## 11. Reuse map (which old sigils each region needs)

| Region | Its own sigils | Needs from earlier | Ties to course codes |
|---|---|---|---|
| Emberdale | Balance, Growth, Bridgecraft | — | RN, PE, SR |
| Riverholm | Pathsight, Scales, Wards, Shaping | Balance (negative rates), Bridgecraft (canal crossings) | RN2–RN3 in LR and LE |
| Greystone Peaks | Ringcraft, Alchemy, Farsight | Shaping (area), Pathsight (ratios), Bridgecraft (right triangles), Balance (rational answers) | SR3, RN4–RN5 (as listed in the S&S notes) |
| Bonelands | Augury, Fateweaving | Pathsight (line of best fit), Balance (fractions of chance) | LR3, RN2–RN3 (as listed in the S&P notes) |
| The Spire | — | All of them, mixed | Final review |

---

## 12. Notes for the 3D build (later)

- **Engine:** CEFL Town v2 (`godot/cefl-town-v2/`). These carry over as they are: tile-by-tile walking, areas joined by edges and gates, `T.say`, `T.choose`, `T.ask` (first-try recording), `T.goal`, `T.box` (custom panels with a test-player `solve`), memory (`T.remember`, `T.knows`, `T.trust`) for Sefa and the final choice, the soft gate (start a chapter now or explore first), and `?debug=1`.
- **New work:** fantasy art in `art3d.gd` (stone cottages, grain towers, canal locks, cliff stairs, hoodoos, bones), terrain that isn't a street grid, and a **sigil system** (a sigil marks a tile or object as passable or usable).
- **One region = one or more 60 × 45 areas**, with a gate arch (a stone arch with the region's name) like the town's.
- **Each false rune is a `T.box` panel:** predict → test → explain, with the misconception as one tempting option. It can be lost.
- **Model apart from the page** (rule 5): each chapter's checks run in headless Godot bots.
- **Save:** per chapter, so a class can play the chapter for the unit they're in.

---

## 13. Open points

- **Strand order:** the story assumes Number → Algebra → Shape & Space → Statistics. If the class teaches strands in another order, each act needs a short opening recap so it stands alone, and the reuse gates need a fallback (for example, a mentor lends the missing sigil for one puzzle).
- **The midpoint loss:** Orrin is lost, not killed on screen. Leave it open whether he comes back in the epilogue (a teacher may prefer a gentler ending).
- **Inequalities share Chapter 5 with equations,** as the notes do (LE4). If that chapter runs long in play, Wards could become a short side chapter.
- **Length:** 11 chapters of 3–4 quests each is a large build. Build Chapter 1 first as the pilot, then a chapter per batch.
- **Originality check:** names, places and plot are original; only the archetypes (old mentor, fallen student, lost master, quest across a realm) are shared with Lord of the Rings and Star Wars.

**Next step:** design Chapter 1 (Rational numbers) in full: quest numbers and answers, the false-rune panel, the Balance sigil's paths, and the first area of Emberdale.
