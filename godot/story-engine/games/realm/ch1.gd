# The Measure of the Realm, Chapter 1 ("The Spark", Rational numbers, RN1–RN5): the numbers, questions and rules. No nodes.
# Every answer is computed here with exact fractions (engine/core/frac.gd), and tests/test_realm.gd checks each one against the
# design (math9-realm-ch1-design-v1.md) and checks that no option marked wrong gives the right value.
extends RefCounted

const Frac = preload("res://engine/core/frac.gd")

static func F(s: String) -> Array:
	return Frac.parse(s)


# ── The quests' numbers ──
static func well() -> Array: return Frac.add(F("-12.5"), F("18.75"))                                          # 25/4 = 6.25 °C
static func ledger_items() -> Array: return ["1/2", "2/3", "-3/4", "-5/6"]
static func ledger_order() -> Array: return ["-5/6", "-3/4", "1/2", "2/3"]
static func ledger_net() -> Array: return Frac.sub(Frac.sub(Frac.add(F("1/2"), F("2/3")), F("3/4")), F("5/6"))  # −5/12
static func snap() -> Array: return Frac.mul(F("-2/3"), F("4 1/2"))                                           # −3
static func snap_back() -> Array: return Frac.mul(F("-2/3"), F("-3"))                                         # 2
static func cancel() -> Array: return Frac.mul(F("4/9"), F("6/5"))                                            # 8/15 (the feed)
static func cancel_pell() -> Array: return Frac.mul(F("2/9"), F("3/5"))                                       # 2/15: two tops cancelled
static func harvest() -> Array: return Frac.div(F("3/4"), F("1/8"))                                           # 6
static func harvest2() -> Array: return Frac.div(F("2/3"), F("1/6"))                                          # 4
static func recipe() -> Array:                                                                                 # −1/2
	return Frac.add(Frac.mul(Frac.pow_i(Frac.add(F("-1/3"), F("1")), 2), F("-9/4")), F("1/2"))
static func recipe_melt() -> Array:   # squaring after multiplying: (2/3 × −9/4)² + 1/2 = 11/4
	return Frac.add(Frac.pow_i(Frac.mul(Frac.add(F("-1/3"), F("1")), F("-9/4")), 2), F("1/2"))
static func rune_fix() -> Array: return Frac.add(F("1/2"), F("1/3"))                                          # 5/6
static func rune_fix2() -> Array: return Frac.add(F("2/3"), F("1/4"))                                         # 11/12
static func rune_false() -> Array: return F("2/5")      # the rune: tops added, bottoms added
static func lesson_items() -> Array: return ["-1", "-1/3", "0", "1/2", "-3/4", "5/6"]
static func lesson_order() -> Array: return ["-1", "-3/4", "-1/3", "0", "1/2", "5/6"]


## Least to greatest, as the panel and the tests sort them.
static func sorted(items: Array) -> Array:
	var out := items.duplicate()
	out.sort_custom(func(a, b): return Frac.lt(F(a), F(b)))
	return out


# ── The questions (T.ask): [text, right?, feedback]. Wrong options come from the course's misconception list. ──
const ASK_LESSON := {"text": "Which is greater, −1/4 or −3/4? Pick the best explanation.", "opts": [
	["−1/4 is to the right of −3/4 on the line, closer to zero, so it's greater.", true, "Fair shares and true numbers. On the cold side, closer to zero is warmer, and warmer is greater."],
	["−3/4 is greater because 3/4 is greater than 1/4.", false, "That's true for 3/4 and 1/4. On the cold side, more means colder. Look where each one sits."],
	["They're equal because both are negative quarters.", false, "They're different points. Count the quarters from zero."],
	["You can't compare negatives without decimals.", false, "You can. A common denominator or the number line does it."]]}

const ASK_THAW := {"text": "So will the well thaw tonight?", "opts": [
	["Yes. 6.25 °C is above 0, so the ice melts.", true, ""],
	["No. It started negative, so it stays negative.", false, "The chinook adds more warmth than the cold it started with. Where does it land compared with 0?"],
	["Yes, and it'll read 31.25 °C.", false, "That adds the two sizes. The water started below zero: start at −12.5 and move up."]]}

const ASK_SNAP_WHY := {"text": "Why is a negative times a negative positive here?", "opts": [
	["Going back in time on a falling temperature means it was higher, so the change is positive.", true, ""],
	["Two negatives always cancel, so it doesn't matter which way you go.", false, "The sign matters: it tells you which way the temperature moved. What does going back 3 hours on a falling temperature mean?"],
	["It should be −2, because it's been getting colder.", false, "It has been getting colder going forward. Three hours ago, before that cold, was it warmer or colder?"]]}

const ASK_CANCEL := {"text": "Is Pell's cancelling allowed?", "opts": [
	["No. He cancelled two tops. You can only cancel a top with a bottom, like the 6 and the 9.", true, ""],
	["Yes, any two numbers that share a factor can be cancelled.", false, "Cancelling divides the top and the bottom of the answer by the same number. Cancelling two tops divides the top twice."],
	["No, you can never cancel before you multiply.", false, "You can; it's a shortcut. It just has to be a top with a bottom."]]}

const ASK_HARVEST := {"text": "Will 3/4 ÷ 1/8 be bigger or smaller than 3/4?", "opts": [
	["Bigger. 1/8 is less than 1, so more than 3/4 of those pieces fit.", true, ""],
	["Smaller, because dividing always makes things smaller.", false, "Dividing by a number less than 1 asks how many small pieces fit. Small pieces: lots of them fit."],
	["The same, because dividing by a fraction cancels out.", false, "Try a picture: how many eighths fit in 3/4 of a cart?"]]}

const ASK_RUNE_PREDICT := {"text": "Before you touch it: is 1/2 + 1/3 more or less than 1/2?", "opts": [
	["More, because you're adding a positive amount to 1/2. And 2/5 is less than 1/2, so the stone must be wrong.", true, "Good. Now test it."],
	["Less, because thirds are smaller than halves.", false, "Thirds are smaller pieces, but you're still adding one. Adding a positive amount makes the total bigger."],
	["Exactly 1/2, because 1/3 is too small to count.", false, "A third of a cart is a lot of grain for a family. It counts."],
	["You can't tell without working it out.", false, "You can. Adding any positive amount to 1/2 gives more than 1/2."]]}

const ASK_RUNE_EXPLAIN := {"text": "So what is wrong with the rune? Pick the best explanation.", "opts": [
	["Halves and thirds are different-sized pieces. Rename both as sixths: 3/6 + 2/6 = 5/6.", true, ""],
	["Add the tops and add the bottoms: 1 + 1 over 2 + 3.", false, "That's what the rune does. Check it: is 2/5 more than 1/2?"],
	["Multiply the bottoms and add the tops: 2/6.", false, "Close to the method, but the tops have to be renamed too."],
	["The stone is close enough; 2/5 is nearly 1/2.", false, "Every family loses nearly half a cart. Is that close enough?"]]}

## The value each wrong option would give (the tests check none of them is the right one).
const WRONG_VALUES := {"thaw": ["-6.25", "31.25"], "snap_why": ["-2"], "cancel": ["2/15"], "rune": ["2/5", "2/6", "1/2"]}


# ── The frost recipe: four step cards and a decoy ──
const RECIPE_CARDS := [
	["bracket", "Brackets: −1/3 + 1 = 2/3"],
	["square", "Exponent: (2/3)² = 4/9"],
	["multiply", "Multiply: 4/9 × (−9/4) = −1"],
	["add", "Add: −1 + 1/2 = −1/2"],
	["decoy", "Multiply 2/3 by −9/4 first"],
]
const RECIPE_ORDER := ["bracket", "square", "multiply", "add"]


# ── The Balance sigil ──
## Quest checks whose first try charges the sigil (one pip each).
const PIP_KEYS := ["rn2_well", "rn2_ledger", "rn3_snap", "rn4_harvest", "rn5_recipe"]
const CELLAR_PIPS := 5

const SPOTS := {
	"spot_pond": {"kind": "freeze", "flag": "sigil_pond", "what": "the mill pond", "area": "brindle",
		"target_text": "ice that holds you", "done": "The pond freezes clear and hard. You can walk across it now: a shortcut to the fold."},
	"spot_wheel": {"kind": "thaw", "flag": "sigil_wheel", "what": "the mill wheel", "area": "brindle",
		"target_text": "the wheel turns freely", "done": "The ice on the wheel cracks and slides off. The wheel creaks, then turns."},
	"spot_gate": {"kind": "thaw", "flag": "sigil_gate", "what": "the tower-yard gate", "area": "highstead",
		"target_text": "the hinges free", "done": "Frost steams off the hinges and the gate swings open."},
	"spot_cellar": {"kind": "thaw", "flag": "sigil_cellar", "what": "Hesper's root cellar door", "area": "brindle",
		"target_text": "the old frost lets go", "done": "The old frost lets go with a sigh, and the cellar door creaks open."},
}


## A spot's numbers for one visit (fresh numbers each visit): { current, target, answer } as [n, d], in quarters of a degree.
static func spot_numbers(id: String, visit: int, seed: int) -> Dictionary:
	var rng := RandomNumberGenerator.new()
	rng.seed = hash("%s:%d:%d" % [id, visit, seed])
	var cur: Array
	var tgt: Array
	if SPOTS[id].kind == "freeze":
		cur = Frac.make(rng.randi_range(6, 36), 4)       # 1.5 to 9 °C
		tgt = Frac.make(-rng.randi_range(2, 12), 4)      # −0.5 to −3 °C
	else:
		cur = Frac.make(-rng.randi_range(6, 40), 4)      # −1.5 to −10 °C
		tgt = Frac.make(rng.randi_range(2, 16), 4)       # 0.5 to 4 °C
	return {"current": cur, "target": tgt, "answer": Frac.sub(tgt, cur)}


## Feedback for a wrong change typed at a spot: too little, too much, or the wrong way.
static func spot_judge(kind: String, answer: Array, v: Array) -> String:
	var a := Frac.to_float(answer)
	var x := Frac.to_float(v)
	if (a < 0) != (x < 0) or x == 0.0:
		return "That goes the wrong way: the target is %s than now." % ("colder" if a < 0 else "warmer")
	if absf(x) < absf(a):
		return "Too little. The ice cracks under you, and you splash back to the bank." if kind == "freeze" else "Too little. It's still frozen solid."
	return "Too far. It freezes to the bottom, and the fish are in trouble." if kind == "freeze" else "Too far. It steams and hisses. Gentler!"


## The charge: quest checks right on the first try, plus spots solved on the first try, plus second looks passed, up to 5.
static func pips(S: Dictionary) -> int:
	return mini(5, first_pips(S) + int(S.rn.get("spot_pips", 0)) + look_pips(S))


static func first_pips(S: Dictionary) -> int:
	var n := 0
	for k in PIP_KEYS:
		if S.answers.has(k) and S.answers[k].tier == "first":
			n += 1
	return n


static func pip_text(n: int) -> String:
	return "●".repeat(n) + "○".repeat(5 - n)


# ── The report: first tries by notes section ──
const CODES := [
	["RN1", "What is a rational number?", ["rn1_lesson", "rn1_order", "rn1_ledger"]],
	["RN2", "Add and subtract", ["rn2_well", "rn2_thaw", "rn2_ledger", "rn2_rune_fix", "rn2_rune_fix2"]],
	["RN3", "Multiply", ["rn3_snap", "rn3_back", "rn3_why", "rn3_cancel_why", "rn3_cancel"]],
	["RN4", "Divide", ["rn4_predict", "rn4_harvest", "rn4_second"]],
	["RN5", "Order of operations", ["rn5_order", "rn5_recipe"]],
]


# ── Second looks (design §8.1): a missed pip check again with fresh numbers, after the sigil ──
# S.rn.looks = { pip key: { "tries": [{ v, tier, date }], "passed": "" | variant, "lock_rings": int, "lock_date": "" | date } }.
# The first-try record in S.answers is never changed. A miss locks that giver until one more gold ring is solved (S.rn.rings_right
# goes up) or a later real date. Old saves have neither key: every read uses .get() defaults.
const LOOK_GIVER := {"rn2_well": "marta", "rn2_ledger": "abel", "rn3_snap": "rowan", "rn4_harvest": "odile", "rn5_recipe": "hesper"}
const LOOK_NAME := {"rn2_well": "The frozen well", "rn2_ledger": "The miller's ledger", "rn3_snap": "The cold snap", "rn4_harvest": "Sharing the harvest", "rn5_recipe": "The frost recipe"}
const LOOK_CODE := {"rn2_well": "RN2", "rn2_ledger": "RN2", "rn3_snap": "RN3", "rn4_harvest": "RN4", "rn5_recipe": "RN5"}
const VARIANTS := ["A", "B", "C"]


## A variant's exact answer, worked from its numbers (tests/test_realm.gd checks each against the design's table).
static func look_answer(key: String, v: String) -> Array:
	match key + v:
		"rn2_wellA": return Frac.add(F("-8.25"), F("11.5"))                                                     # 13/4 = 3.25
		"rn2_wellB": return Frac.add(F("-15.5"), F("9.75"))                                                     # −23/4 = −5.75
		"rn2_wellC": return Frac.add(F("-6.4"), F("10.15"))                                                     # 15/4 = 3.75
		"rn2_ledgerA": return Frac.sub(Frac.sub(Frac.add(F("3/4"), F("5/6")), F("2/3")), F("1/2"))              # 5/12
		"rn2_ledgerB": return Frac.sub(Frac.sub(Frac.add(F("2/5"), F("1/2")), F("3/4")), F("3/10"))             # −3/20
		"rn2_ledgerC": return Frac.add(Frac.sub(Frac.sub(F("5/8"), F("1/3")), F("3/4")), F("1/6"))              # −7/24
		"rn3_snapA": return Frac.mul(F("-3/4"), F("2 2/3"))                                                     # −2
		"rn3_snapB": return Frac.mul(F("-5/6"), F("3 3/5"))                                                     # −3
		"rn3_snapC": return Frac.mul(F("-4/9"), F("6 3/4"))                                                     # −3
		"rn4_harvestA": return Frac.div(F("5/6"), F("1/12"))                                                    # 10
		"rn4_harvestB": return Frac.div(F("4/5"), F("1/10"))                                                    # 8
		"rn4_harvestC": return Frac.div(F("2 1/4"), F("3/4"))                                                   # 3
		"rn5_recipeA": return Frac.add(Frac.mul(Frac.pow_i(Frac.add(F("-1/2"), F("2")), 2), F("-4/9")), F("2/3"))   # −1/3
		"rn5_recipeB": return Frac.add(Frac.mul(Frac.pow_i(Frac.add(F("1/4"), F("-1")), 2), F("-16/9")), F("3/4"))  # −1/4
		"rn5_recipeC": return Frac.add(Frac.mul(Frac.pow_i(Frac.add(F("-2/5"), F("1")), 2), F("-25/9")), F("1/3"))  # −2/3
	return []


## The value each variant's named error gives: [value, feedback]. The first one is what auto=wrong types.
static func look_traps(key: String, v: String) -> Array:
	match key + v:
		# sign of the larger size; adding the sizes
		"rn2_wellA": return [["-3.25", "Check the sign: is the warm-up bigger than the cold? Keep the sign of the larger size."], ["19.75", "That adds the two sizes. The water starts below zero."]]
		"rn2_wellB": return [["5.75", "Check the sign: the cold is bigger than the warm-up, so keep its sign, −."], ["25.25", "That adds the two sizes. The water starts below zero."]]
		"rn2_wellC": return [["-3.75", "Check the sign: is the warm-up bigger than the cold? Keep the sign of the larger size."], ["16.55", "That adds the two sizes. The water starts below zero."]]
		# adding tops and adding bottoms; the sign
		"rn2_ledgerA": return [[Frac.text(look_tops_bottoms("A")), "That adds the tops and adds the bottoms. Rename every share in twelfths first."], ["-5/12", "Check the sign: does more come in, or go out?"]]
		"rn2_ledgerB": return [[Frac.text(look_tops_bottoms("B")), "That adds the tops and adds the bottoms. Rename every share in twentieths first."], ["3/20", "Check the sign: does more come in, or go out?"]]
		"rn2_ledgerC": return [[Frac.text(look_tops_bottoms("C")), "That adds the tops and adds the bottoms. Rename every share in twenty-fourths first."], ["7/24", "Check the sign: does more come in, or go out?"]]
		# forgetting the negative; using only the whole part of the mixed number
		"rn3_snapA": return [["2", "It's dropping: the change is negative."], ["-3/2", "2 2/3 is 8/3, not 2."]]
		"rn3_snapB": return [["3", "It's dropping: the change is negative."], ["-5/2", "3 3/5 is 18/5, not 3."]]
		"rn3_snapC": return [["3", "It's dropping: the change is negative."], ["-8/3", "6 3/4 is 27/4, not 6."]]
		# multiplying instead of dividing (an answer below the cart amount: "dividing makes it smaller")
		"rn4_harvestA": return [["5/72", "That multiplies by 1/12. Dividing by 1/12 asks how many twelfths fit."]]
		"rn4_harvestB": return [["2/25", "That multiplies by 1/10. Dividing by 1/10 asks how many tenths fit."]]
		"rn4_harvestC": return [["27/16", "That multiplies by 3/4. Dividing by 3/4 asks how many 3/4 shares fit."]]
		# squaring after multiplying (the melting branch)
		"rn5_recipeA", "rn5_recipeB", "rn5_recipeC": return [[Frac.text(look_melt(v)), "You squared after multiplying. BEDMAS: exponents before multiplication."]]
	return []


## The ledger's add-tops-and-bottoms value (signed tops over the sum of the bottoms).
static func look_tops_bottoms(v: String) -> Array:
	match v:
		"A": return Frac.make(3 + 5 - 2 - 1, 4 + 6 + 3 + 2)       # 5/15 = 1/3
		"B": return Frac.make(2 + 1 - 3 - 3, 5 + 2 + 4 + 10)      # −3/21 = −1/7
		_: return Frac.make(5 - 1 - 3 + 1, 8 + 3 + 4 + 6)         # 2/21


## The recipe's melting value: squaring after multiplying.
static func look_melt(v: String) -> Array:
	match v:
		"A": return Frac.add(Frac.pow_i(Frac.mul(Frac.add(F("-1/2"), F("2")), F("-4/9")), 2), F("2/3"))     # 10/9
		"B": return Frac.add(Frac.pow_i(Frac.mul(Frac.add(F("1/4"), F("-1")), F("-16/9")), 2), F("3/4"))    # 91/36
		_: return Frac.add(Frac.pow_i(Frac.mul(Frac.add(F("-2/5"), F("1")), F("-25/9")), 2), F("1/3"))      # 28/9


## The harvest's cart amount: an answer below it is "dividing makes it smaller".
static func look_cart(v: String) -> Array:
	return F({"A": "5/6", "B": "4/5", "C": "2 1/4"}[v])


## A variant's words: { say: [lines], prompt, hint, why, unit?, as_dec?, ask? (the well: will it thaw?), bar? [den, filled, label] }.
static func look_check(key: String, v: String) -> Dictionary:
	var hint_mul := "Hesper: \"Write %s as an improper fraction. Then count the negatives.\""
	var hint_bedmas := "Hesper: \"Brackets, then the exponent, then multiply, then add. Do one at a time.\""
	var hint_ledger := "Hesper: \"Rename every share in %s first. Then count what comes in and what goes out.\""
	match key + v:
		"rn2_wellA": return {"say": ["The horse trough froze too. It's at −8.25 °C.", "The chinook will raise it by 11.5 °C. What will it read?"],
			"prompt": "The trough is at [b]−8.25 °C[/b]. The chinook raises it by [b]11.5 °C[/b]. What will it read?", "unit": "°C", "as_dec": true,
			"hint": "Hesper: \"Start at −8.25 on the line and move 11.5 to the warm side. Where do you cross zero?\"",
			"why": "−8.25 + 11.5: the signs differ, so subtract the sizes (11.5 − 8.25 = 3.25) and keep the sign of the larger, +.",
			"ask": {"text": "So will the trough thaw?", "opts": [["Yes. 3.25 °C is above 0, so the ice melts.", true, ""],
				["No. It started negative, so it stays negative.", false, "The chinook adds more warmth than the cold it started with. Where does it land compared with 0?"],
				["Yes, and it'll read 19.75 °C.", false, "That adds the two sizes. Start at −8.25 and move up."]]}}
		"rn2_wellB": return {"say": ["My rain barrel's frozen hard, at −15.5 °C.", "The chinook will raise it by 9.75 °C. What will it read?"],
			"prompt": "The rain barrel is at [b]−15.5 °C[/b]. The chinook raises it by [b]9.75 °C[/b]. What will it read?", "unit": "°C", "as_dec": true,
			"hint": "Hesper: \"Start at −15.5 on the line and move 9.75 to the warm side. Do you reach zero?\"",
			"why": "−15.5 + 9.75: the signs differ, so subtract the sizes (15.5 − 9.75 = 5.75) and keep the sign of the larger, −.",
			"ask": {"text": "So will the rain barrel thaw?", "opts": [["No. −5.75 °C is still below 0, so it stays frozen.", true, ""],
				["Yes. It'll read 5.75 °C.", false, "Check the sign: the cold is bigger than the warm-up, so keep the sign of the cold, −."],
				["Yes, and it'll read 25.25 °C.", false, "That adds the two sizes. Start at −15.5 and move up."]]}}
		"rn2_wellC": return {"say": ["The wash tub froze in the night. It's at −6.4 °C.", "The chinook will raise it by 10.15 °C. What will it read?"],
			"prompt": "The wash tub is at [b]−6.4 °C[/b]. The chinook raises it by [b]10.15 °C[/b]. What will it read?", "unit": "°C", "as_dec": true,
			"hint": "Hesper: \"Start at −6.4 on the line and move 10.15 to the warm side. Where do you cross zero?\"",
			"why": "−6.4 + 10.15: the signs differ, so subtract the sizes (10.15 − 6.4 = 3.75) and keep the sign of the larger, +.",
			"ask": {"text": "So will the wash tub thaw?", "opts": [["Yes. 3.75 °C is above 0, so the ice melts.", true, ""],
				["No. It started negative, so it stays negative.", false, "The chinook adds more warmth than the cold it started with. Where does it land compared with 0?"],
				["Yes, and it'll read 16.55 °C.", false, "That adds the two sizes. Start at −6.4 and move up."]]}}
		"rn2_ledgerA": return {"say": ["Next month's ledger, in silvers. Owed to me: 3/4 and 5/6.", "I owe 2/3 and 1/2. What do I really have?"],
			"prompt": "[b]3/4 + 5/6 − 2/3 − 1/2[/b] = ? (in silvers)", "hint": hint_ledger % "twelfths", "why": "In twelfths: +9 + 10 − 8 − 6 = 5, so 5/12."}
		"rn2_ledgerB": return {"say": ["Next month's ledger, in silvers. Owed to me: 2/5 and 1/2.", "I owe 3/4 and 3/10. What do I really have?"],
			"prompt": "[b]2/5 + 1/2 − 3/4 − 3/10[/b] = ? (in silvers)", "hint": hint_ledger % "twentieths", "why": "In twentieths: +8 + 10 − 15 − 6 = −3, so −3/20."}
		"rn2_ledgerC": return {"say": ["Next month's ledger, in silvers. Owed to me: 5/8 and 1/6.", "I owe 1/3 and 3/4. What do I really have?"],
			"prompt": "[b]5/8 − 1/3 − 3/4 + 1/6[/b] = ? (in silvers)", "hint": hint_ledger % "twenty-fourths", "why": "In twenty-fourths: +15 − 8 − 18 + 4 = −7, so −7/24."}
		"rn3_snapA": return {"say": ["Another front tonight. It's 0 °C now.", "It'll drop 3/4 of a degree every hour, for 2 2/3 hours. What's the change?"],
			"prompt": "The change in temperature = [b](−3/4) × 2 2/3[/b] = ? °C", "unit": "°C", "hint": hint_mul % "2 2/3",
			"why": "(−3/4) × (8/3) = −24/12 = −2. One negative factor gives a negative product."}
		"rn3_snapB": return {"say": ["Another front tonight. It's 0 °C now.", "It'll drop 5/6 of a degree every hour, for 3 3/5 hours. What's the change?"],
			"prompt": "The change in temperature = [b](−5/6) × 3 3/5[/b] = ? °C", "unit": "°C", "hint": hint_mul % "3 3/5",
			"why": "(−5/6) × (18/5) = −90/30 = −3. One negative factor gives a negative product."}
		"rn3_snapC": return {"say": ["Another front tonight. It's 0 °C now.", "It'll drop 4/9 of a degree every hour, for 6 3/4 hours. What's the change?"],
			"prompt": "The change in temperature = [b](−4/9) × 6 3/4[/b] = ? °C", "unit": "°C", "hint": hint_mul % "6 3/4",
			"why": "(−4/9) × (27/4) = −108/36 = −3. One negative factor gives a negative product."}
		"rn4_harvestA": return {"say": ["The mill loft has 5/6 of a cart of grain.", "Shares of 1/12 of a cart. How many families get one?"],
			"prompt": "[b]5/6 ÷ 1/12[/b] = ? families", "hint": "Hesper: \"How many twelfths fit in 5/6? Dividing by 1/12 is multiplying by 12.\"",
			"why": "5/6 = 10/12, and ten 1/12 shares fit in it.", "bar": [12, 10, "The cart, in twelfths: 5/6 of it is full."]}
		"rn4_harvestB": return {"say": ["The chapel store has 4/5 of a cart of grain.", "Shares of 1/10 of a cart. How many families get one?"],
			"prompt": "[b]4/5 ÷ 1/10[/b] = ? families", "hint": "Hesper: \"How many tenths fit in 4/5? Dividing by 1/10 is multiplying by 10.\"",
			"why": "4/5 = 8/10, and eight 1/10 shares fit in it.", "bar": [10, 8, "The cart, in tenths: 4/5 of it is full."]}
		"rn4_harvestC": return {"say": ["The tithe barn has 2 1/4 carts of grain.", "Big shares this time: 3/4 of a cart each. How many families get one?"],
			"prompt": "[b]2 1/4 ÷ 3/4[/b] = ? families", "hint": "Hesper: \"Write 2 1/4 as 9/4. Dividing by 3/4 is multiplying by 4/3.\"",
			"why": "2 1/4 = 9/4, and 9/4 × 4/3 = 3: three 3/4 shares fit in it."}
		"rn5_recipeA": return {"say": ["A new ward, for the woodshed. Its strength is (−1/2 + 2)² × (−4/9) + 2/3 degrees.", "Negative, and it holds."],
			"prompt": "The ward's strength: [b](−1/2 + 2)² × (−4/9) + 2/3[/b] = ? °C", "unit": "°C", "hint": hint_bedmas,
			"why": "B: 3/2. E: 9/4. M: 9/4 × (−4/9) = −1. A: −1 + 2/3 = −1/3."}
		"rn5_recipeB": return {"say": ["A new ward, for the goat pen. Its strength is (1/4 − 1)² × (−16/9) + 3/4 degrees.", "Negative, and it holds."],
			"prompt": "The ward's strength: [b](1/4 − 1)² × (−16/9) + 3/4[/b] = ? °C", "unit": "°C", "hint": hint_bedmas,
			"why": "B: −3/4. E: 9/16. M: 9/16 × (−16/9) = −1. A: −1 + 3/4 = −1/4."}
		"rn5_recipeC": return {"say": ["A new ward, for the dovecote. Its strength is (−2/5 + 1)² × (−25/9) + 1/3 degrees.", "Negative, and it holds."],
			"prompt": "The ward's strength: [b](−2/5 + 1)² × (−25/9) + 1/3[/b] = ? °C", "unit": "°C", "hint": hint_bedmas,
			"why": "B: 3/5. E: 9/25. M: 9/25 × (−25/9) = −1. A: −1 + 1/3 = −2/3."}
	return {}


static func _looks(S: Dictionary) -> Dictionary:
	return S.rn.get("looks", {})


## The quest's first try missed its pip (the giver can offer a second look).
static func look_missed(S: Dictionary, key: String) -> bool:
	return S.answers.has(key) and str(S.answers[key].tier) != "first"


static func look_passed(S: Dictionary, key: String) -> bool:
	return str(_looks(S).get(key, {}).get("passed", "")) != ""


## The next variant for this giver: A, then B, then C, then back to A.
static func look_variant(S: Dictionary, key: String) -> String:
	return VARIANTS[(_looks(S).get(key, {}).get("tries", []) as Array).size() % 3]


## Is a second look open with this giver today? Needs the sigil, a missed first try not yet recharged, and no lock: a miss locks
## until one more gold ring is solved (right at any try) or a later date. today: "YYYY-MM-DD".
static func look_open(S: Dictionary, key: String, today: String) -> bool:
	if not S.flags.get("sigil", false) or not look_missed(S, key) or look_passed(S, key):
		return false
	var L: Dictionary = _looks(S).get(key, {})
	if str(L.get("lock_date", "")) == "":
		return true
	return int(S.rn.get("rings_right", 0)) > int(L.get("lock_rings", 0)) or today > str(L.lock_date)


## Store a second look's result (tier from T.frac). Right on the first try recharges a pip; anything else locks the giver.
static func look_result(S: Dictionary, key: String, v: String, tier: String, today: String) -> void:
	if not S.rn.has("looks"):
		S.rn.looks = {}
	if not S.rn.looks.has(key):
		S.rn.looks[key] = {"tries": [], "passed": "", "lock_rings": 0, "lock_date": ""}
	var L: Dictionary = S.rn.looks[key]
	L.tries.append({"v": v, "tier": tier, "date": today})
	if tier == "first":
		L.passed = v
		L.lock_date = ""
	else:
		L.lock_rings = int(S.rn.get("rings_right", 0))
		L.lock_date = today


## Pips recharged on second looks (one per giver, at most).
static func look_pips(S: Dictionary) -> int:
	var n := 0
	for k in PIP_KEYS:
		if look_missed(S, k) and look_passed(S, k):
			n += 1
	return n


## The report's words for one giver's second looks, e.g. "variant A: shown the answer; recharged on a second look (variant B, try 1)".
static func look_text(S: Dictionary, key: String) -> String:
	var word := {"second": "right on the second try", "later": "not right on the first try"}
	var bits := []
	for t in _looks(S).get(key, {}).get("tries", []):
		bits.append("recharged on a second look (variant %s, try 1)" % t.v if str(t.tier) == "first" else "variant %s: %s" % [t.v, word.get(str(t.tier), str(t.tier))])
	return "; ".join(bits)
