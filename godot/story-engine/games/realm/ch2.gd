# The Measure of the Realm, Chapter 2 ("The Blight", Powers and exponents, PE1–PE7): the numbers, questions and rules. No nodes.
# Every answer is computed here with exact fractions (engine/core/frac.gd; pw() takes negative exponents too), and
# tests/test_realm.gd checks each one against the design (math9-realm-ch2-design-v1.md) and that no wrong option or named
# error gives the right value. Words are from the design and the script (math9-realm-ch2-script-v1.md), verbatim.
# A power card is { expr, base, answer (int exponent), coef? (int in front), traps: [[exponent, line]], coef_traps? }.
extends RefCounted

const Frac = preload("res://engine/core/frac.gd")

const SUP := {"0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻"}


static func F(s: String) -> Array:
	return Frac.parse(s)


## b to the k as an exact fraction, for any integer k (2⁻³ = 1/8).
static func pw(b: int, k: int) -> Array:
	var r := Frac.pow_i([b, 1], absi(k))
	return Frac.div([1, 1], r) if k < 0 else r


## An exponent as raised digits: sup(-3) → "⁻³".
static func sup(k: int) -> String:
	var out := ""
	for ch in str(k):
		out += SUP.get(ch, ch)
	return out


## A power as text: pow_text("3", -2) → "3⁻²".
static func pow_text(base: String, k: int) -> String:
	return base + sup(k)


## A signed whole number with the true minus sign.
static func num(k: int) -> String:
	return str(k).replace("-", "−")


# ── The lesson (PE1) ──
static func seeds() -> Array: return pw(2, 6)                                   # 64
static func turn() -> Array: return pw(-2, 5)                                   # −32
static func brackets() -> Array: return Frac.neg(pw(2, 4))                      # −2⁴ = −16
const SEED_NIGHTS := [[1, "Night 1: 2."], [2, "Night 2: 2 × 2 = 4."], [3, "Night 3: 2 × 2 × 2 = 8."]]

# ── The quests ──
static func day0() -> Array: return pw(3, 0)                                    # 1
static func other_moss() -> Array: return pw(5, 0)                              # 1
const TALLY_ROWS := [["Day 4", "81"], ["Day 3", "27"], ["Day 2", "9", true], ["Day 1", "3", true]]   # [label, value, blank?]
static func cure_exp() -> int: return 6 + 3                                     # 2⁶ × 2³ = 2⁹
static func cure_value() -> Array: return Frac.mul(pw(2, 6), pw(2, 3))          # 512
static func bed_value() -> Array: return Frac.mul(pw(2, 3), pw(3, 2))           # 72
static func moths_exp() -> int: return 7 - 4                                    # 3³
static func pots() -> Array: return Frac.div(pw(3, 7), pw(3, 4))                # 27
static func nook_exp() -> int: return 4 - 4                                     # 3⁰
static func nook() -> Array: return Frac.div(pw(3, 4), pw(3, 4))                # 1
static func nest_exp() -> int: return 2 * 4                                     # (3²)⁴ = 3⁸
static func nest_value() -> Array: return pw(pw(3, 2)[0], 4)                    # 6561
static func pair() -> Array: return [2 + 4, 2 * 4]                              # 3⁶ and 3⁸
static func same() -> Array: return [3 * 4, 4 * 3]                              # (2³)⁴ and (2⁴)³: both 2¹²
static func jar() -> Array: return Frac.pow_i(Frac.mul(F("2"), F("3")), 2)       # 36
static func jar_pell() -> Array: return Frac.mul(F("2"), pw(3, 2))              # 18
static func crate() -> Array: return [int(pw(2, 3)[0]), 3]                      # (2x)³ = 8x³
static func small_bed() -> Array: return Frac.pow_i(F("2/3"), 2)                # 4/9
static func sum_bed() -> Array: return [Frac.pow_i(F("7"), 2), Frac.add(pw(3, 2), pw(4, 2)), Frac.mul(pw(3, 2), pw(4, 2))]   # 49, 25, 144
const BOARD_ROWS := [["2³", "8"], ["2²", "4"], ["2¹", "2"], ["2⁰", "1", true], ["2⁻¹", "1/2", true], ["2⁻²", "1/4", true]]
static func boulder() -> Array: return pw(2, -3)                                # 1/8
static func weight() -> Array: return Frac.mul(F("96"), pw(2, -3))              # 12
static func negbase() -> Array: return pw(-2, -3)                               # −1/8
static func negzero() -> Array: return Frac.pow_i(F("-15"), 0)                  # 1
# Frac.pow_i does nothing for a negative exponent (it returns 1), so the flip is 1 over the positive power: 1 ÷ (1/3)² = 9
static func flip() -> Array: return Frac.div([1, 1], Frac.pow_i(F("1/3"), 2))     # 9

# ── The vault rune ──
const RUNE_ROWS := [["3³", "27"], ["3²", "9"], ["3¹", "3"], ["3⁰", "1", true, "3 ÷ 3 ="], ["3⁻¹", "1/3", true, "1 ÷ 3 ="], ["3⁻²", "1/9", true, "⅓ ÷ 3 ="]]
const RUNE_STONE := ["27", "9", "3", "0", "−3", "−9"]   # the stone's lines, top to bottom (the last three are false)
static func rune_false() -> Array: return [F("0"), F("-3"), F("-9")]
static func ladder() -> Array: return [Frac.div(pw(3, 1), [3, 1]), Frac.div(pw(3, 0), [3, 1]), Frac.div(pw(3, -1), [3, 1])]   # 1, 1/3, 1/9
static func route2() -> Array: return Frac.div(pw(3, 3), pw(3, 3))              # 1, exponent 3 − 3 = 0
static func fixes() -> Dictionary: return {"pe2_rune_fix": pw(3, 0), "pe7_rune_fix": pw(3, -2), "pe2_rune_fix2": pw(4, 0), "pe7_rune_fix2": pw(4, -2)}


# ── Named errors (value, line). The first one is what auto=wrong types. ──
const TRAPS := {
	"pe1_seeds": [["12", "That's 2 × 6. Double six times."]],
	"pe1_turn": [["32", "Pair the negatives off. Five of them leaves one without a partner."], ["-10", "That's −2 × 5. Multiply five −2s."]],
	"pe1_brackets": [["16", "That's (−2)⁴. Without brackets the base is only the 2: work out 2⁴ first, then put the minus sign on."]],
	"pe2_day0": [["0", "No moss on day 0 means nothing to triple, and the field would still be bare.\nEach row back divides by 3. What is 3 ÷ 3?"], ["3", "That's day 1. One more row back."]],
	"pe2_other": [["0", "Day 1 is 5. What do you divide by to go back a day?"], ["5", "That's day 1. One more day back."]],
	"pe2_negzero": [["-1", "The brackets make the base −15. One step back from −15 is (−15) ÷ (−15), and that is positive."], ["0", "(−15)¹ is −15. To go back one step, divide by the base: (−15) ÷ (−15)."],
		["-15", "That's (−15)¹. One more step back."]],
	"pe7_flip": [["1/9", "That's (⅓)². The minus flips it: 1 over 1⁄9."], ["-1/9", "A negative exponent isn't a negative number. Flip ⅓, then square."], ["-9", "The size is right. The minus means flip, not below zero."],
		["3", "That's the flip. Now square it."], ["6", "That's 3 × 2. Flip ⅓ to 3, then multiply 3 by itself."]],
	"pe4_pots": [["9", "That's 3 × 3. 3³ is three 3s multiplied."]],
	"pe4_equal": [["0", "No pots for 81 moths? A number divided by itself is 1. That's 3⁰ again, from Odile's board."]],
	"pe6_jar": [["18", "That's Pell's jar, 2 × 3². The bed is 6 by 6."], ["12", "That's 6 × 2. Squaring means 6 × 6."]],
	"pe6_quot": [["4/3", "You squared the top only."], ["2/9", "You squared the bottom only."], ["2/3", "That's the side, not the square. Multiply ⅔ by ⅔."]],
	"pe7_boulder": [["-8", "A negative exponent isn't a negative number. Keep halving past 1."], ["8", "That's 2³. The minus sends it underneath: 1 over 2³."],
		["-1/8", "The base is positive, so nothing here is below zero."], ["-6", "That's 2 × (−3). Halve three times from 1."]],
	"pe7_negbase": [["1/8", "(−2)³ is −8, and 1 over −8 is negative. The sign comes from the base."]],
}

# ── Power cards ──
const CARD_CURE := {"expr": "2⁶ × 2³ =", "base": "2", "answer": 9, "traps": [[18, "You multiplied the exponents. Count the 2s: six of them, then three more."],
	[3, "That's one stretch of days. Put the two together."], [6, "That's one stretch of days. Put the two together."]]}
const CARD_MOTHS := {"expr": "3⁷ ÷ 3⁴ =", "base": "3", "answer": 3, "traps": [[11, "You added. That's for multiplying powers. Each pot takes away four 3s."],
	[28, "You multiplied the exponents. Cancel instead: four 3s from seven."]]}
const CARD_NOOK := {"expr": "3⁴ ÷ 3⁴ =", "base": "3", "answer": 0, "traps": []}
const CARD_NEST := {"expr": "(3²)⁴ =", "base": "3", "answer": 8, "traps": [[6, "You added. Write it out: 3² × 3² × 3² × 3². How many 3s?"], [16, "You raised 2 to the 4. Four lots of two 3s is 4 × 2 = 8 threes."]]}
const CARD_PAIR := [{"expr": "3² × 3⁴ =", "base": "3", "answer": 6, "traps": []}, {"expr": "(3²)⁴ =", "base": "3", "answer": 8, "traps": []}]
const PAIR_SWAPPED := "Look at what joins them. Two powers multiplied: add. A power raised to a power: multiply."
const CARD_CRATE := {"expr": "(2x)³ =", "base": "x", "answer": 3, "coef": 8, "traps": [],
	"coef_traps": [[2, "The exponent belongs to the 2 as well. (2x)(2x)(2x)."], [6, "2³ is 2 × 2 × 2, not 2 × 3."]]}
const CARD_ROUTE2 := {"expr": "3³ ÷ 3³ =", "base": "3", "answer": 0, "traps": []}


## A card's named error for what was typed, or "" (right, or no line for it). coef: the number typed in front (cards with one).
static func card_line(card: Dictionary, exp: int, coef := 0) -> String:
	if card.has("coef") and coef != int(card.coef):
		for t in card.get("coef_traps", []):
			if int(t[0]) == coef:
				return str(t[1])
		return ""
	if exp == int(card.answer):
		return ""
	for t in card.traps:
		if int(t[0]) == exp:
			return str(t[1])
	return ""


static func card_right(card: Dictionary, exp: int, coef := 0) -> bool:
	return exp == int(card.answer) and (not card.has("coef") or coef == int(card.coef))


## The card's power as text, e.g. "2⁹" or "8x³".
static func card_text(card: Dictionary) -> String:
	return (str(card.coef) if card.has("coef") else "") + pow_text(str(card.base), int(card.answer))


# ── The questions (T.ask): [text, right?, feedback]. ──
const ASK_LESSON := {"text": "Why is 2⁵ equal to 32 and not 10?", "opts": [
	["The exponent counts how many 2s are multiplied: 2 × 2 × 2 × 2 × 2 = 32.", true, ""],
	["2⁵ means 2 × 5, and that's 10.", false, "2 × 5 is five 2s added. The seeds double. Count the nights: 2, 4, 8, 16, 32."],
	["2⁵ means 5 × 5 = 25.", false, "That's 5². The base is the number that repeats, and here it's 2."],
	["It's 2 × 2 × 2 × 2 × 2 × 2 = 64: one 2 for the seed and five for the nights.", false, "The exponent 5 means exactly five 2s. The first seed is the 1 you start with."]]}

const ASK_TALLY_WHY := {"text": "Why do both mosses come to 1 on day 0, whatever they multiply by?", "opts": [
	["Each day back divides by the base. Day 1 is the base itself, and the base divided by itself is 1.", true, ""],
	["Because zero days means zero moss.", false, "Then day 1 would be 3 × 0. Is it?"],
	["Because a number with exponent 0 stays as it is, so 3⁰ = 3.", false, "That's day 1, 3¹."],
	["It's just a rule the Wardens agreed on.", false, "A spell you cannot explain will fail you. Walk down the board."]]}

const ASK_CURE_ENOUGH := {"text": "Is that enough for 500 spots?", "opts": [
	["Yes, 512 is more than 500, just.", true, ""],
	["No, 2⁹ is only 18.", false, "18 is 2 × 9. 2⁹ is nine 2s multiplied: you just worked it out."],
	["Yes, there'll be thousands.", false, "Enough, yes, but check the size. 2⁹ is 512, only 12 to spare."]]}

const ASK_BASES := {"text": "Is Pell right?", "opts": [
	["No. The bases are different, so there isn't one pile of the same factor to count. It's 8 × 9 = 72.", true, ""],
	["Yes: multiply the bases and add the exponents.", false, "6⁵ is 7776. Count the bed: 8 rows of 9."],
	["No, it's 6⁶: multiply the bases and multiply the exponents.", false, "Still one base where there are two. Work out each power first."]]}

const ASK_MOTHS_WHY := {"text": "Why do you subtract the exponents when you divide?", "opts": [
	["Each 3 underneath cancels one 3 on top. Seven 3s with four cancelled leaves three.", true, ""],
	["Because dividing is the opposite of multiplying, so you do the opposite to the base.", false, "The base stays 3 all the way through. Look at what happens to the count of 3s."],
	["Because 7 ÷ 4 can't be done, so you subtract instead.", false, "The exponents are never divided. Write the 3s out and cross them off."]]}

const ASK_SAME := {"text": "Which plan grows more?", "opts": [
	["The same. (2³)⁴ and (2⁴)³ are both twelve doublings, 2¹².", true, ""],
	["Three times a day for four days, because there are more days.", false, "Count the doublings in each plan. Three a day for four days is how many?"],
	["Four times a day for three days, because the bigger exponent is inside the brackets.", false, "Count the doublings in each plan. Four a day for three days is how many?"]]}

const ASK_JAR := {"text": "Will it. {name}, before he plants one: is (2 × 3)² the same as 2 × 3²?", "opts": [
	["No. In (2 × 3)² the square covers the 2 and the 3. In 2 × 3² only the 3 is squared.", true, ""],
	["Yes, the brackets don't change a multiplication.", false, "They change what the exponent reaches. Work out each one: 6² and 2 × 9."],
	["Yes, both are 2 × 3 × 2.", false, "An exponent of 2 means multiplied by itself, not times 2. Work out 6² and 2 × 9."]]}

const ASK_SUM := {"text": "Is Pell right this time?", "opts": [
	["No. (3 + 4)² = 7² = 49, but 3² + 4² = 25. Exponents spread over × and ÷, not + and −.", true, ""],
	["Yes, the exponent goes to each number in the brackets.", false, "That works for × and ÷. Try it here: 7² against 9 + 16."],
	["No, it's 3² × 4² = 144.", false, "That would be (3 × 4)². The bed has 3 + 4 = 7 pots on a side."]]}

const ASK_BOULDER := {"text": "Before you cast it. What will 2⁻³ do to the boulder?", "opts": [
	["Shrink it to ⅛ of its size. 2⁻³ is 1 over 2³, a small positive fraction.", true, ""],
	["Make it −8 times its size: the negative exponent makes a negative.", false, "Is there such a thing as minus a boulder? Go down the board: 8, 4, 2, 1, and keep halving."],
	["Make it 8 times bigger.", false, "That's 2³. Which way does the board go when the exponent goes down?"],
	["Make it −6 times its size, 2 × −3.", false, "An exponent isn't a multiplier. Go down the board from 2¹, halving."]]}

const ASK_NEGBASE := {"text": "Good. Now a better question. Can a negative exponent ever give a negative number?", "opts": [
	["Only when the base is negative and the exponent is odd, like (−2)⁻³.", true, ""],
	["Never.", false, "Try a negative base. What is (−2)³, and what is 1 over that?"],
	["Always.", false, "You just made ⅛ from 2⁻³. Was that negative?"]]}

const ASK_RUNE_PREDICT := {"text": "Before you touch it. Read down the true lines: 27, 9, 3. What comes next?", "opts": [
	["1. Each line is the one above divided by 3, and 3 ÷ 3 is 1. The stone's 0 breaks the pattern.", true, ""],
	["0, because the exponent is 0.", false, "Read the values, not the exponents. 27, 9, 3: what is done each time?"],
	["0, because the numbers are shrinking away to nothing.", false, "They shrink, but by dividing. Does dividing 3 by 3 give nothing?"],
	["You can't tell: a zero exponent has no meaning.", false, "The pattern gives it one. 27, 9, 3: what is done each time?"]]}

const ASK_RUNE_EXPLAIN := {"text": "Say what is wrong with the stone.", "opts": [
	["Each step down divides by 3, so 3⁰ = 1, then ⅓, then 1⁄9: small positive fractions, never zero or negative.", true, ""],
	["An exponent of 0 means multiplying by nothing, so 0. A negative exponent means a negative number.", false, "That's what the rune says. Check it on the ladder: is 3 ÷ 3 nought?"],
	["3⁰ = 1, but a negative exponent flips the sign, so 3⁻¹ = −3.", false, "The first half is right. Keep dividing by 3 from 1. Do you ever go below zero?"],
	["3⁰ = 3, because with no exponent the base is left as it is.", false, "That's 3¹. One more rung down."]]}

## The value each wrong option stands for (the tests check none is the right answer).
const WRONG_VALUES := {"lesson": ["10", "25", "64"], "tally_why": ["0", "3"], "enough": ["18"], "bases": ["7776", "46656"],
	"jar": ["18"], "sum": ["25", "144"], "boulder": ["-8", "8", "-6"], "negbase": ["1/8"], "rune": ["0", "-3", "-9", "3"]}


# ── Hints and why lines (one per quest, from the design) ──
const HINT_LESSON := "Hesper: \"Write it out the long way first. How many of them are you multiplying?\""
const HINT := {
	"tally": "Hesper: \"Go down the board one row at a time. What do you do to 27 to get the row below?\"",
	"cure": "Hesper: \"Write 2⁶ as six 2s and 2³ as three 2s, side by side. How many 2s are there?\"",
	"moths": "Hesper: \"Write seven 3s over four 3s. Cross them off in pairs, one from the top and one from the bottom.\"",
	"nests": "Hesper: \"(3²)⁴ means 3² written four times and multiplied. Count the 3s.\"",
	"jar": "Hesper: \"Draw the bed. How many pots along one side? Then how many rows?\"",
	"boulder": "Hesper: \"Go down the board from 2¹. What do you do at every step? Do it three more times after 1.\""}
const WHY := {
	"tally": "81, 27, 9, 3: each row is the one above divided by 3. 3 ÷ 3 = 1, so 3⁰ = 1.",
	"cure": "2⁶ × 2³ = (2×2×2×2×2×2) × (2×2×2) = nine 2s = 2⁹ = 512.",
	"moths": "(3×3×3×3×3×3×3) ÷ (3×3×3×3): four pairs cancel and 3×3×3 is left. 3³ = 27.",
	"nests": "(3²)⁴ = 3² × 3² × 3² × 3² = eight 3s = 3⁸ (6561 times bigger).",
	"jar": "(2 × 3)² = (2 × 3) × (2 × 3) = 2² × 3² = 4 × 9 = 36.",
	"boulder": "2¹ = 2, 2⁰ = 1, 2⁻¹ = ½, 2⁻² = ¼, 2⁻³ = ⅛. So 2⁻³ = 1⁄2³."}


## Hesper's praise after the first one, by quest (script, "Added after the first build").
const PRAISE := {"lesson2": "Base, exponent, brackets. You read all three.", "tally": "You walked down the board to day 0. That's the zero exponent.",
	"cure": "Same base, so you counted the factors together. That's the product law.", "moths": "You cancelled, and counted what was left. That's the quotient law.",
	"nests": "Lots of lots, so you multiplied the exponents. Good.", "jar": "You gave the exponent to everything in the brackets. Pell, take note.",
	"boulder": "Past 1 and still halving. That's a negative exponent."}
const WHY_LESSON := {"pe1_seeds": "2⁶ = 2 × 2 × 2 × 2 × 2 × 2 = 64.", "pe1_turn": "(−2)⁵ = (−2) × (−2) × (−2) × (−2) × (−2) = −32: four pair off, one is left.",
	"pe1_brackets": "−2⁴ = −(2 × 2 × 2 × 2) = −16."}
## The rune's four fixes: named errors, the hint and the why line.
const L_STONE := "That's what the rune says. Go down the ladder: what is the line above, divided by the base?"
const L_EXP1 := "That's the exponent 1. One more rung down."
const L_SIZE := "The size is right. Dividing a positive number never takes it below zero."
const L_EXPM1 := "That's the exponent −1. One more rung down."
const FIX_TRAPS := {"pe2_rune_fix": [["0", L_STONE], ["3", L_EXP1]], "pe7_rune_fix": [["-9", L_STONE], ["-1/9", L_SIZE], ["1/3", L_EXPM1]],
	"pe2_rune_fix2": [["0", L_STONE], ["4", L_EXP1]], "pe7_rune_fix2": [["-16", L_STONE], ["-1/16", L_SIZE], ["1/4", L_EXPM1]]}
const FIX_HINT := "Start from the base to the 1 and divide by the base once for each step down."
const FIX_WHY := {"pe2_rune_fix": "Each step down divides by the base: 3, 1, ⅓, 1⁄9.", "pe7_rune_fix": "Each step down divides by the base: 3, 1, ⅓, 1⁄9.",
	"pe2_rune_fix2": "Each step down divides by the base: 4, 1, ¼, 1⁄16.", "pe7_rune_fix2": "Each step down divides by the base: 4, 1, ¼, 1⁄16."}
## The quest each second look belongs to (its hint and why line are the quest's).
const LOOK_QUEST := {"pe2_day0": "tally", "pe3_cure": "cure", "pe4_moths": "moths", "pe5_nest": "nests", "pe6_jar": "jar", "pe7_boulder": "boulder"}


# ── The Growth sigil ──
## Quest checks whose first try charges Growth (one pip each): six, one per quest (teacher, 2026-11-14).
const PIP_KEYS := ["pe2_day0", "pe3_cure", "pe4_moths", "pe5_nest", "pe6_jar", "pe7_boulder"]
const PIPS := 6
const BASES := [2, 3, 4, 5, 10]

const SPOTS := {
	"growth_ledge": {"kind": "reach", "flag": "growth_ledge", "what": "The pond ledge", "area": "brindle"},
	"growth_hedge": {"kind": "shrink", "flag": "growth_hedge", "what": "The hedge gap", "area": "brindle"},
	"growth_vault": {"kind": "topup", "flag": "growth_vault", "what": "The vault vine", "area": "highstead"},
	"growth_window": {"kind": "reach", "flag": "growth_window", "what": "Orrin's window", "area": "brindle"},
}


## The largest exponent for a base with the power still under 1000.
static func max_exp(b: int) -> int:
	var k := 0
	while int(pw(b, k + 1)[0]) < 1000:
		k += 1
	return k


## A Growth spot's numbers for one visit: { kind: reach | shrink | up | down, b, m (start exponent), n (target exponent), answer }.
## Reach starts at 1 (m = 0); shrink targets 1 over b to the n; top up goes from b to the m to b to the n, up or back down.
static func spot_numbers(id: String, visit: int, seed: int) -> Dictionary:
	var rng := RandomNumberGenerator.new()
	rng.seed = hash("%s:%d:%d" % [id, visit, seed])
	var b: int = BASES[rng.randi_range(0, BASES.size() - 1)]
	var top := max_exp(b)
	var kind: String = SPOTS[id].kind
	var out := {"kind": kind, "b": b, "m": 0, "n": 0, "answer": 0}
	match kind:
		"reach":
			out.kind = "reach"
			out.n = rng.randi_range(2, top)
		"shrink":
			out.kind = "shrink"
			out.n = -rng.randi_range(2, top)
		_:
			var up := rng.randi() % 2 == 0
			var lo := rng.randi_range(1, top - 1)
			var hi := rng.randi_range(lo + 1, top)
			out.kind = "up" if up else "down"
			out.m = lo if up else hi
			out.n = hi if up else lo
	out.answer = int(out.n) - int(out.m)
	return out


## The first use at the pond ledge (the vine step): fixed numbers, 1 hand doubling to 32 hands.
static func first_vine() -> Dictionary:
	return {"kind": "reach", "b": 2, "m": 0, "n": 5, "answer": 5}


## Where things end up after casting b to the k: the size as an exact fraction (hands, or your height for a shrink).
static func spot_after(nums: Dictionary, k: int) -> Array:
	return pw(int(nums.b), int(nums.m) + k)


## The panel's words for a spot (design §8, script "Growth spots: panel text").
static func spot_prompt(nums: Dictionary) -> String:
	var b: int = nums.b
	match str(nums.kind):
		"reach":
			var grows := "doubles" if b == 2 else ("triples" if b == 3 else "grows %d times" % b)
			return "The vine is 1 hand tall and %s with each pulse. The ledge is %s hands up. Cast %d to the…?" % [grows, Frac.text(pw(b, nums.n)), b]
		"shrink":
			return "The gap is 1⁄%s of your height. Your charm works in %ds. Cast %d to the…?" % [Frac.text(pw(b, -int(nums.n))), b, b]
		"up":
			return "The vine has grown %s hands. It needs %s. Cast %d to the…?" % [pow_text(str(b), nums.m), pow_text(str(b), nums.n), b]
	return "The vine has overgrown to %s hands. The gap needs %s. Cast %d to the…?" % [pow_text(str(b), nums.m), pow_text(str(b), nums.n), b]


## The line for a wrong exponent at a spot: too little, too much, nought, or the wrong way. "" for the right one.
static func spot_judge(nums: Dictionary, k: int) -> String:
	var a: int = nums.answer
	if k == a:
		return ""
	if k == 0:
		return "To the nought changes nothing. The vine stays as it is."
	if (k > 0) != (a > 0):
		return "That goes the other way. Positive grows, negative shrinks."
	var little := absi(k) < absi(a)
	match str(nums.kind):
		"reach", "up":
			return ("The vine stops short at %s hands. Try again." % Frac.text(spot_after(nums, k))) if little else "The vine shoots past the ledge and flops over. Too far."
		"shrink":
			return ("Still too big to fit: you are 1⁄%s of your height. Try again." % Frac.text(pw(int(nums.b), -k))) if little else "You are the size of a beetle. Too far."
		"down":
			return ("The vine is still too long, at %s hands. Try again." % Frac.text(spot_after(nums, k))) if little else "The vine shrivels to almost nothing. Too far."
	return ""


## Too little (−1), right (0) or too far (+1) for a typed exponent of the right sign.
static func spot_side(nums: Dictionary, k: int) -> int:
	var a: int = nums.answer
	if k == a:
		return 0
	return -1 if absi(k) < absi(a) else 1


static func spot_reveal(nums: Dictionary) -> String:
	return "Hesper's voice: \"%d to the %s. Count the steps next time.\"" % [int(nums.b), num(int(nums.answer))]


## The charge: pip checks right on the first try, Growth spots right on the first try, second looks passed; up to six.
static func pips(S: Dictionary) -> int:
	return mini(PIPS, first_pips(S) + int(_pe(S).get("spot_pips", 0)) + look_pips(S))


static func first_pips(S: Dictionary) -> int:
	var n := 0
	for k in PIP_KEYS:
		if S.answers.has(k) and S.answers[k].tier == "first":
			n += 1
	return n


static func pip_text(n: int) -> String:
	return "●".repeat(n) + "○".repeat(PIPS - n)


static func _pe(S: Dictionary) -> Dictionary:
	return S.get("pe", {})


# ── The report: first tries by notes section ──
const CODES := [
	["PE1", "What is a power?", ["pe1_lesson", "pe1_seeds", "pe1_turn", "pe1_brackets"]],
	["PE2", "The zero exponent", ["pe2_day0", "pe2_other", "pe2_why", "pe2_negzero", "pe4_equal", "pe2_rune_fix", "pe2_rune_fix2"]],
	["PE3", "Product of powers", ["pe3_cure", "pe3_value", "pe3_bases"]],
	["PE4", "Quotient of powers", ["pe4_moths", "pe4_pots", "pe4_equal", "pe4_why"]],
	["PE5", "Power of a power", ["pe5_nest", "pe5_pair", "pe5_same"]],
	["PE6", "Power of a product and quotient", ["pe6_predict", "pe6_jar", "pe6_coef", "pe6_quot", "pe6_sum"]],
	["PE7", "Negative exponents", ["pe7_predict", "pe7_boulder", "pe7_weight", "pe7_negbase", "pe7_flip", "pe7_rune_fix", "pe7_rune_fix2"]],
]
## The report's row labels (script, "Report labels"); a check is recorded as "PEn · <label>".
const LABEL := {"pe1_lesson": "Why 2⁵ is 32", "pe1_seeds": "2⁶", "pe1_turn": "(−2)⁵", "pe1_brackets": "−2⁴", "pe2_day0": "3⁰ on the tally", "pe2_other": "5⁰",
	"pe2_why": "Why a zero exponent gives 1", "pe2_negzero": "(−15)⁰", "pe3_cure": "2⁶ × 2³ as one power", "pe3_value": "2⁹ as a number", "pe3_bases": "Different bases",
	"pe4_moths": "3⁷ ÷ 3⁴ as one power", "pe4_pots": "3³ as a number", "pe4_equal": "3⁴ ÷ 3⁴", "pe4_why": "Why exponents subtract",
	"pe5_nest": "(3²)⁴ as one power", "pe5_pair": "3² × 3⁴ beside (3²)⁴", "pe5_same": "(2³)⁴ and (2⁴)³", "pe6_predict": "(2 × 3)² or 2 × 3²",
	"pe6_jar": "(2 × 3)²", "pe6_coef": "(2x)³", "pe6_quot": "(⅔)²", "pe6_sum": "(3 + 4)²", "pe7_predict": "What 2⁻³ does", "pe7_boulder": "2⁻³",
	"pe7_weight": "96 × ⅛", "pe7_negbase": "(−2)⁻³", "pe7_flip": "(⅓)⁻²",
	# the rune's four fixes: the script labels them in pairs ("3⁰ and 3⁻²", "4⁰ and 4⁻²"); each pair's two keys share its label
	"pe2_rune_fix": "3⁰ and 3⁻²", "pe7_rune_fix": "3⁰ and 3⁻²", "pe2_rune_fix2": "4⁰ and 4⁻²", "pe7_rune_fix2": "4⁰ and 4⁻²",
	"rune2_predict": "Predicted the next line", "rune2_explain": "Explained the stone"}
const TYPED_LABEL := {"pe1_pell": "−2⁴ and (−2)⁴, for Pell", "rune2_why": "Why 3⁰ is 1, for Gale"}


static func code_of(key: String) -> String:
	for c in CODES:
		if c[2].has(key):
			return c[0]
	return ""


static func label(key: String) -> String:
	var c := code_of(key)
	return ("%s · %s" % [c, LABEL[key]]) if c != "" else str(LABEL.get(key, key))


## Every key Chapter 2 records (the report shows only these while Chapter 2 is in play).
static func keys() -> Dictionary:
	var out := {}
	for k in LABEL:
		out[k] = true
	for k in TYPED_LABEL:
		out[k] = true
	return out


# ── Second looks (design §8.1): a missed pip check again with the next variant, after the sigil ──
# S.pe.looks = { pip key: { tries: [{ v, tier, date }], passed, lock_rings, lock_date } }, as Chapter 1's S.rn.looks.
const LOOK_GIVER := {"pe2_day0": "odile", "pe3_cure": "rowan", "pe4_moths": "abel", "pe5_nest": "marta", "pe6_jar": "pell", "pe7_boulder": "bram"}
const LOOK_NAME := {"pe2_day0": "The moss tally", "pe3_cure": "The blight cure", "pe4_moths": "Hollow-moths at the mill", "pe5_nest": "The nests in the well-house",
	"pe6_jar": "Pell's spell jar", "pe7_boulder": "The boulder on the road"}
const LOOK_CARD := {"pe3_cure": true, "pe4_moths": true, "pe5_nest": true}   # the others are typed values
const VARIANTS := ["A", "B", "C"]
const LOOK_PROMPT := {
	"pe2_day0A": "A moss that grows 4 times a day. Day 0 and day 1 together: 4⁰ + 4¹ patches?",
	"pe2_day0B": "Six pots, each with a 10-times moss on its day 0. 6 × 10⁰ patches?",
	"pe2_day0C": "Two beds on day 0: a 7-times moss and a 2-times moss. 7⁰ + 2⁰ patches?",
	"pe3_cureA": "3⁴ × 3² as one power of 3.", "pe3_cureB": "2⁵ × 2⁵ as one power of 2.", "pe3_cureC": "5² × 5 as one power of 5.",
	"pe4_mothsA": "2⁹ moths, 2⁶ to a pot. Pots, as a power of 2?", "pe4_mothsB": "5⁶ moths, 5⁴ to a pot. Pots, as a power of 5?",
	"pe4_mothsC": "3⁵ moths, 3⁵ to a pot. Pots, as a power of 3?",
	"pe5_nestA": "A swarm that grows 2² times a night, for 5 nights: (2²)⁵ as one power.", "pe5_nestB": "5³ times a night, for 2 nights: (5³)² as one power.",
	"pe5_nestC": "3³ times a night, for 3 nights: (3³)³ as one power.",
	"pe6_jarA": "A square bed, each side 2 trays of 5 pots. (2 × 5)² pots?", "pe6_jarB": "A cube of crates, 3 stacks of 2 along each edge. (3 × 2)³ crates?",
	"pe6_jarC": "A square bed, each side 4 trays of 3 pots. (4 × 3)² pots?",
	"pe7_boulderA": "A charm tag reads 3⁻². What fraction of its size?", "pe7_boulderB": "A tag reads 4⁻². What fraction?", "pe7_boulderC": "A tag reads 10⁻³. What fraction?"}
const L_ZERO := "A moss on day 0 isn't nothing. What is any base to the exponent 0?"
const L_ASBASE := "That's day 1. Day 0 is one row further back."
const L_CURE_MUL := "You multiplied the exponents. Count the factors side by side."
const L_CURE_BARE := "A bare 5 is 5¹, one more 5. Count them all."
const L_MOTHS_ADD := "You added. That's for multiplying. Each pot takes factors away."
const L_NEST_ADD := "You added. Write the inside power out as many times as the outside exponent says."
const L_JAR_LAST := "The exponent covers both numbers in the brackets."
const L_JAR_MUL := "That's multiplying by the exponent. Multiply the bracket by itself."
const L_NEG := "A negative exponent isn't a negative number."
const L_BTIMES := "That's the base times the exponent. Divide by the base, that many times, from 1."
const L_POS := "The minus sends it underneath: 1 over the power."


## A card variant's base and the exponent factors: { base, expr, answer }.
static func look_card(key: String, v: String) -> Dictionary:
	match key + v:
		"pe3_cureA": return {"base": "3", "expr": "3⁴ × 3² =", "answer": 4 + 2}
		"pe3_cureB": return {"base": "2", "expr": "2⁵ × 2⁵ =", "answer": 5 + 5}
		"pe3_cureC": return {"base": "5", "expr": "5² × 5 =", "answer": 2 + 1}
		"pe4_mothsA": return {"base": "2", "expr": "2⁹ ÷ 2⁶ =", "answer": 9 - 6}
		"pe4_mothsB": return {"base": "5", "expr": "5⁶ ÷ 5⁴ =", "answer": 6 - 4}
		"pe4_mothsC": return {"base": "3", "expr": "3⁵ ÷ 3⁵ =", "answer": 5 - 5}
		"pe5_nestA": return {"base": "2", "expr": "(2²)⁵ =", "answer": 2 * 5}
		"pe5_nestB": return {"base": "5", "expr": "(5³)² =", "answer": 3 * 2}
		"pe5_nestC": return {"base": "3", "expr": "(3³)³ =", "answer": 3 * 3}
	return {}


## A value variant's exact answer (or a card variant's value, b to its exponent).
static func look_answer(key: String, v: String) -> Array:
	match key + v:
		"pe2_day0A": return Frac.add(pw(4, 0), pw(4, 1))                         # 5
		"pe2_day0B": return Frac.mul(F("6"), pw(10, 0))                          # 6
		"pe2_day0C": return Frac.add(pw(7, 0), pw(2, 0))                         # 2
		"pe6_jarA": return Frac.pow_i(Frac.mul(F("2"), F("5")), 2)              # 100
		"pe6_jarB": return Frac.pow_i(Frac.mul(F("3"), F("2")), 3)              # 216
		"pe6_jarC": return Frac.pow_i(Frac.mul(F("4"), F("3")), 2)              # 144
		"pe7_boulderA": return pw(3, -2)                                        # 1/9
		"pe7_boulderB": return pw(4, -2)                                        # 1/16
		"pe7_boulderC": return pw(10, -3)                                       # 1/1000
	var c := look_card(key, v)
	return pw(int(c.base), int(c.answer)) if not c.is_empty() else []


## A variant's named errors: [[value or exponent, line]], worked from its numbers. The first is what auto=wrong types.
static func look_traps(key: String, v: String) -> Array:
	match key + v:
		"pe2_day0A": return [[Frac.text(Frac.add(F("0"), pw(4, 1))), L_ZERO], [Frac.text(Frac.add(pw(4, 1), pw(4, 1))), L_ASBASE]]   # 4, 8
		"pe2_day0B": return [[Frac.text(Frac.mul(F("6"), F("0"))), L_ZERO], [Frac.text(Frac.mul(F("6"), F("10"))), L_ASBASE]]          # 0, 60
		"pe2_day0C": return [[Frac.text(Frac.add(F("0"), F("0"))), L_ZERO], [Frac.text(Frac.add(F("7"), F("2"))), L_ASBASE]]           # 0, 9
		"pe3_cureA": return [[4 * 2, L_CURE_MUL]]
		"pe3_cureB": return [[5 * 5, L_CURE_MUL]]
		"pe3_cureC": return [[2 * 1, L_CURE_BARE]]   # 2 × 1 (multiplied) and 2 + 0 (the bare 5 as 5⁰) both give 2: one line (script)
		"pe4_mothsA": return [[9 + 6, L_MOTHS_ADD]]
		"pe4_mothsB": return [[6 + 4, L_MOTHS_ADD]]
		"pe4_mothsC": return [[5 + 5, L_MOTHS_ADD]]
		"pe5_nestA": return [[2 + 5, L_NEST_ADD]]
		"pe5_nestB": return [[3 + 2, L_NEST_ADD]]
		"pe5_nestC": return [[3 + 3, L_NEST_ADD]]
		"pe6_jarA": return [[Frac.text(Frac.mul(F("2"), pw(5, 2))), L_JAR_LAST], [Frac.text(Frac.mul(F("10"), F("2"))), L_JAR_MUL]]     # 50, 20
		"pe6_jarB": return [[Frac.text(Frac.mul(F("3"), pw(2, 3))), L_JAR_LAST], [Frac.text(Frac.mul(F("6"), F("3"))), L_JAR_MUL]]      # 24, 18
		"pe6_jarC": return [[Frac.text(Frac.mul(F("4"), pw(3, 2))), L_JAR_LAST], [Frac.text(Frac.mul(F("12"), F("2"))), L_JAR_MUL]]     # 36, 24
		"pe7_boulderA": return [[Frac.text(Frac.neg(pw(3, 2))), L_NEG], [Frac.text([3 * -2, 1]), L_BTIMES], [Frac.text(pw(3, 2)), L_POS]]     # −9, −6, 9
		"pe7_boulderB": return [[Frac.text(Frac.neg(pw(4, 2))), L_NEG], [Frac.text([4 * -2, 1]), L_BTIMES], [Frac.text(pw(4, 2)), L_POS]]     # −16, −8, 16
		"pe7_boulderC": return [[Frac.text(Frac.neg(pw(10, 3))), L_NEG], [Frac.text([10 * -3, 1]), L_BTIMES], [Frac.text(pw(10, 3)), L_POS]]  # −1000, −30, 1000
	return []


static func _looks(S: Dictionary) -> Dictionary:
	return _pe(S).get("looks", {})


static func look_missed(S: Dictionary, key: String) -> bool:
	return S.answers.has(key) and str(S.answers[key].tier) != "first"


static func look_passed(S: Dictionary, key: String) -> bool:
	return str(_looks(S).get(key, {}).get("passed", "")) != ""


static func look_variant(S: Dictionary, key: String) -> String:
	return VARIANTS[(_looks(S).get(key, {}).get("tries", []) as Array).size() % 3]


## Open after the Growth sigil for a missed pip; a miss locks the giver until one more Growth spot is solved or a later date.
static func look_open(S: Dictionary, key: String, today: String) -> bool:
	if not S.flags.get("sigil2", false) or not look_missed(S, key) or look_passed(S, key):
		return false
	var L: Dictionary = _looks(S).get(key, {})
	if str(L.get("lock_date", "")) == "":
		return true
	return int(_pe(S).get("rings_right", 0)) > int(L.get("lock_rings", 0)) or today > str(L.lock_date)


static func look_result(S: Dictionary, key: String, v: String, tier: String, today: String) -> void:
	if not S.pe.has("looks"):
		S.pe.looks = {}
	if not S.pe.looks.has(key):
		S.pe.looks[key] = {"tries": [], "passed": "", "lock_rings": 0, "lock_date": ""}
	var L: Dictionary = S.pe.looks[key]
	L.tries.append({"v": v, "tier": tier, "date": today})
	if tier == "first":
		L.passed = v
		L.lock_date = ""
	else:
		L.lock_rings = int(S.pe.get("rings_right", 0))
		L.lock_date = today


static func look_pips(S: Dictionary) -> int:
	var n := 0
	for k in PIP_KEYS:
		if look_missed(S, k) and look_passed(S, k):
			n += 1
	return n


static func look_text(S: Dictionary, key: String) -> String:
	var word := {"second": "right on the second try", "third": "right on the third try", "later": "not right on the first try"}
	var bits := []
	for t in _looks(S).get(key, {}).get("tries", []):
		bits.append("recharged on a second look (variant %s, try 1)" % t.v if str(t.tier) == "first" else "variant %s: %s" % [t.v, word.get(str(t.tier), str(t.tier))])
	return "; ".join(bits)
