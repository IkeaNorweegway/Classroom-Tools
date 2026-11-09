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
const WRONG_VALUES := {"thaw": ["-6.25", "31.25"], "snap_why": ["-2"], "rune": ["2/5", "2/6", "1/2"]}


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
const CELLAR_PIPS := 4

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


## The charge: quest checks right on the first try, plus spots solved on the first try, up to 5.
static func pips(S: Dictionary) -> int:
	var n := 0
	for k in PIP_KEYS:
		if S.answers.has(k) and S.answers[k].tier == "first":
			n += 1
	return mini(5, n + int(S.rn.get("spot_pips", 0)))


static func pip_text(n: int) -> String:
	return "●".repeat(n) + "○".repeat(5 - n)


# ── The report: first tries by notes section ──
const CODES := [
	["RN1", "What is a rational number?", ["rn1_lesson", "rn1_order", "rn1_ledger"]],
	["RN2", "Add and subtract", ["rn2_well", "rn2_thaw", "rn2_ledger", "rn2_rune_fix", "rn2_rune_fix2"]],
	["RN3", "Multiply", ["rn3_snap", "rn3_back", "rn3_why"]],
	["RN4", "Divide", ["rn4_predict", "rn4_harvest", "rn4_second"]],
	["RN5", "Order of operations", ["rn5_order", "rn5_recipe"]],
]
