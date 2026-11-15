# Realm Chapter 1, without a window: the typed-fraction checker, every quest answer against the design, the question tables
# (one right option each; no wrong option gives the right value), the Balance spots on many seeds, the charge rule (5 for the cellar),
# the cross-cancel feed, every second-look variant and its named errors, the second-look lock, and old saves.
# Chapter 2 (_chapter2): every answer against its design (worked with exact fractions), the questions, every named error and
# power-card trap, the pattern boards, every second-look variant, the Growth spots on many seeds, the six-pip charge, the lock,
# the report labels and filter, the chapter picker, and a Chapter 2 save.
#   godot --headless --path godot/story-engine -s res://tests/test_realm.gd
extends SceneTree

const Frac = preload("res://engine/core/frac.gd")
const Ch1 = preload("res://games/realm/ch1.gd")
const Ch2 = preload("res://games/realm/ch2.gd")

var fails := []
var checks := 0


func ok(cond: bool, what: String) -> void:
	checks += 1
	if not cond:
		fails.append(what)


func _initialize() -> void:
	# 1. Every quest answer is what the design says.
	var want := {"well": [Ch1.well(), "25/4"], "ledger": [Ch1.ledger_net(), "-5/12"], "snap": [Ch1.snap(), "-3"], "back": [Ch1.snap_back(), "2"],
		"harvest": [Ch1.harvest(), "6"], "harvest2": [Ch1.harvest2(), "4"], "recipe": [Ch1.recipe(), "-1/2"], "melt": [Ch1.recipe_melt(), "11/4"],
		"rune": [Ch1.rune_fix(), "5/6"], "rune2": [Ch1.rune_fix2(), "11/12"], "false": [Ch1.rune_false(), "2/5"]}
	for k in want:
		ok(Frac.eq(want[k][0], Frac.parse(want[k][1])), "answer %s is %s, design says %s" % [k, Frac.text(want[k][0]), want[k][1]])
	ok(Ch1.sorted(Ch1.lesson_items()) == Ch1.lesson_order(), "lesson order")
	ok(Ch1.sorted(Ch1.ledger_items()) == Ch1.ledger_order(), "ledger order")
	ok(Frac.lt(Ch1.rune_false(), Frac.parse("1/2")) and Frac.lt(Frac.parse("1/2"), Ch1.rune_fix()), "2/5 < 1/2 < 5/6")

	# 2. The typed-answer checker: every accepted form, and the wrong ones.
	var right := [
		["6.25", "25/4"], ["25/4", "25/4"], ["6 1/4", "25/4"], ["6.25 °C", "25/4"], ["+6.25", "25/4"], ["6.250", "25/4"], ["6,25", "25/4"],
		["-5/12", "-5/12"], ["−5/12", "-5/12"], ["−5⁄12", "-5/12"], ["5/-12", "-5/12"], ["-(5/12)", "-5/12"], ["(-5)/12", "-5/12"], [" - 5 / 12 ", "-5/12"],
		["-3", "-3"], ["−3 °C", "-3"], ["-3.0", "-3"], ["-6/2", "-3"], ["2", "2"], ["+2", "2"], ["4/2", "2"],
		["6", "6"], ["6 families", "6"], ["48/8", "6"], ["4", "4"], ["-1/2", "-1/2"], ["-0.5", "-1/2"], ["−.5", "-1/2"], ["1/-2", "-1/2"], ["-2/4", "-1/2"],
		["5/6", "5/6"], ["10/12", "5/6"], ["11/12", "11/12"], ["-4.75", "-19/4"], ["-4 3/4", "-19/4"], ["-19/4", "-19/4"], ["3/(-4)", "-3/4"],
	]
	for r in right:
		var c := Frac.check(r[0], r[1])
		ok(c.ok, "\"%s\" should be right for %s" % r)
	for r in [["-10/24", "-5/12"], ["50/8", "25/4"], ["6 2/8", "25/4"], ["-2/4", "-1/2"], ["10/12", "5/6"]]:
		ok(not Frac.check(r[0], r[1]).simplest, "\"%s\" is right but not in simplest form" % r[0])
	for r in [["-5/12", "-5/12"], ["6.25", "25/4"], ["-3", "-3"]]:
		ok(Frac.check(r[0], r[1]).simplest, "\"%s\" counts as simplest" % r[0])
	var wrong := [["31.25", "25/4"], ["-6.25", "25/4"], ["5/12", "-5/12"], ["-14/12", "-5/12"], ["3", "-3"], ["-8/3", "-3"], ["-2", "2"],
		["3/32", "6"], ["1/9", "4"], ["11/4", "-1/2"], ["2/5", "5/6"], ["2/6", "5/6"], ["3/7", "11/12"], ["3/12", "11/12"], ["6 1/3", "25/4"]]
	for r in wrong:
		var c := Frac.check(r[0], r[1])
		ok(not c.ok and not c.empty and not c.close, "\"%s\" should be wrong for %s" % r)
	for r in [["0.83", "5/6"], ["0.833", "5/6"], ["0.92", "11/12"], ["-0.42", "-5/12"]]:
		var c := Frac.check(r[0], r[1])
		ok(c.close and not c.ok, "\"%s\" should be 'close: give a fraction' for %s" % r)
	ok(not Frac.check("0.8", "5/6").close, "0.8 is too far from 5/6 to be close")
	ok(not Frac.check("6.2", "25/4").close, "a terminating answer is never 'close'")
	for e in ["", "abc", "1/0", "5//6", "1 1/0", "1 5/4", "12345678901234/2"]:
		ok(Frac.check(e, "1/2").empty, "\"%s\" should not read as a number" % e)

	# 3. The question tables: one right option; no wrong option's value is the right answer.
	for q in [Ch1.ASK_LESSON, Ch1.ASK_THAW, Ch1.ASK_SNAP_WHY, Ch1.ASK_HARVEST, Ch1.ASK_RUNE_PREDICT, Ch1.ASK_RUNE_EXPLAIN]:
		var n := 0
		for o in q.opts:
			if o[1]:
				n += 1
			else:
				ok(str(o[2]) != "", "every wrong option explains itself: " + str(o[0]))
		ok(n == 1, "exactly one right option: " + q.text)
	for v in Ch1.WRONG_VALUES.thaw:
		ok(not Frac.eq(Frac.parse(v), Ch1.well()), "thaw wrong option %s isn't the answer" % v)
	for v in Ch1.WRONG_VALUES.snap_why:
		ok(not Frac.eq(Frac.parse(v), Ch1.snap_back()), "snap-why wrong option %s isn't the answer" % v)
	for v in Ch1.WRONG_VALUES.rune:
		ok(not Frac.eq(Frac.parse(v), Ch1.rune_fix()), "rune wrong option %s isn't the answer" % v)
	ok(Ch1.RECIPE_ORDER.size() == 4 and not Ch1.RECIPE_ORDER.has("decoy"), "recipe order")

	# 4. Balance spots on many seeds: target − now, quarter degrees, the right kind of change, judged wrong answers.
	var n_spots := 0
	for sid in Ch1.SPOTS:
		for seed in 300:
			var nums := Ch1.spot_numbers(sid, seed % 7, seed)
			n_spots += 1
			ok(Frac.eq(nums.answer, Frac.sub(nums.target, nums.current)), "%s: change = target − now" % sid)
			ok(4 % int(nums.answer[1]) == 0, "%s: answers in quarters" % sid)
			var freeze: bool = Ch1.SPOTS[sid].kind == "freeze"
			ok((Frac.to_float(nums.answer) < 0) == freeze, "%s: a freeze chills, a thaw warms" % sid)
			ok(Frac.to_float(nums.current) > 0 if freeze else Frac.to_float(nums.current) < 0, "%s: starts on the other side of zero" % sid)
			for d in [[1, 4], [-1, 4], [3, 1]]:
				var w := Frac.add(nums.answer, d)
				if not Frac.eq(w, nums.answer):
					ok(Ch1.spot_judge(Ch1.SPOTS[sid].kind, nums.answer, w) != "", "%s: wrong values get a line" % sid)
			ok(Frac.check(Frac.dec_text(nums.answer), nums.answer).ok, "%s: the shown decimal reads back" % sid)

	# 5. The charge: first tries on the five quest checks, plus spot pips, never above 5.
	var S := {"answers": {}, "rn": {"spot_pips": 0}}
	ok(Ch1.pips(S) == 0, "no answers, no pips")
	for k in Ch1.PIP_KEYS:
		S.answers[k] = {"tier": "first"}
	ok(Ch1.pips(S) == 5, "five first tries, five pips")
	S.rn.spot_pips = 3
	ok(Ch1.pips(S) == 5, "never above 5")
	S.answers.rn2_well.tier = "second"
	S.answers.rn3_snap.tier = "later"
	S.rn.spot_pips = 1
	ok(Ch1.pips(S) == 4, "3 first tries + 1 spot = 4")
	ok(Ch1.CELLAR_PIPS == 5, "the cellar needs all five pips")

	# 6. The cross-cancel feed (§6.3 Check 3): 4/9 × 6/5 = 8/15; Pell's two-tops cancel gives 2/15.
	ok(Frac.eq(Ch1.cancel(), Frac.parse("8/15")), "feed is 8/15")
	ok(Frac.eq(Ch1.cancel_pell(), Frac.parse("2/15")), "Pell's cancel is 2/15")
	for r in ["8/15", "24/45", "16/30", "0 8/15"]:
		ok(Frac.check(r, "8/15").ok, "\"%s\" is right for 8/15" % r)
	for r in ["24/45", "16/30"]:
		ok(not Frac.check(r, "8/15").simplest, "\"%s\" gets the simplest-form nudge" % r)
	ok(Frac.check("8/15", "8/15").simplest, "8/15 is simplest")
	var c215 := Frac.check("2/15", "8/15")
	ok(not c215.ok and not c215.empty and not c215.close, "2/15 is wrong for 8/15")
	ok(Frac.eq(c215.value, Frac.parse("2/15")), "2/15 reads as the trap value (the named error matches it)")
	for r in ["-8/15", "0.53", "6/45", "1/3"]:
		ok(not Frac.check(r, "8/15").ok, "\"%s\" is not 8/15" % r)
	var nc := 0
	for o in Ch1.ASK_CANCEL.opts:
		nc += 1 if o[1] else 0
		if not o[1]:
			ok(str(o[2]) != "", "cancel: wrong option explains itself")
	ok(nc == 1, "cancel: exactly one right option")
	for v in Ch1.WRONG_VALUES.cancel:
		ok(not Frac.eq(Frac.parse(v), Ch1.cancel()), "cancel wrong value %s isn't the answer" % v)
	ok(Ch1.CODES[2][2].has("rn3_cancel_why") and Ch1.CODES[2][2].has("rn3_cancel"), "the feed is on the RN3 report row")
	ok(not Ch1.PIP_KEYS.has("rn3_cancel"), "the feed is not a pip check")

	# 7. Second looks (§8.1): every variant answer and its named-error values, from the design's table.
	var table := {
		"rn2_well": {"A": "13/4", "B": "-23/4", "C": "15/4"},
		"rn2_ledger": {"A": "5/12", "B": "-3/20", "C": "-7/24"},
		"rn3_snap": {"A": "-2", "B": "-3", "C": "-3"},
		"rn4_harvest": {"A": "10", "B": "8", "C": "3"},
		"rn5_recipe": {"A": "-1/3", "B": "-1/4", "C": "-2/3"}}
	var errs := {   # each variant's named error(s), worked by hand
		"rn2_well": {"A": ["-3.25", "19.75"], "B": ["5.75", "25.25"], "C": ["-3.75", "16.55"]},
		"rn2_ledger": {"A": ["1/3", "-5/12"], "B": ["-1/7", "3/20"], "C": ["2/21", "7/24"]},
		"rn3_snap": {"A": ["2", "-3/2"], "B": ["3", "-5/2"], "C": ["3", "-8/3"]},
		"rn4_harvest": {"A": ["5/72"], "B": ["2/25"], "C": ["27/16"]},
		"rn5_recipe": {"A": ["10/9"], "B": ["91/36"], "C": ["28/9"]}}
	for k in table:
		for v in Ch1.VARIANTS:
			var a := Ch1.look_answer(k, v)
			ok(Frac.eq(a, Frac.parse(table[k][v])), "%s %s is %s, design says %s" % [k, v, Frac.text(a), table[k][v]])
			ok(Frac.check(Frac.text(a).replace("−", "-"), a).ok, "%s %s: the answer reads back" % [k, v])
			var c := Ch1.look_check(k, v)
			for f in ["say", "prompt", "hint", "why"]:
				ok(c.has(f) and str(c[f]) != "", "%s %s has %s" % [k, v, f])
			var tr := Ch1.look_traps(k, v)
			ok(tr.size() == errs[k][v].size(), "%s %s: %d named errors" % [k, v, errs[k][v].size()])
			for i in tr.size():
				ok(Frac.eq(Frac.parse(str(tr[i][0])), Frac.parse(errs[k][v][i])), "%s %s: named error %s is %s" % [k, v, tr[i][0], errs[k][v][i]])
				ok(not Frac.eq(Frac.parse(str(tr[i][0])), a), "%s %s: named error %s isn't the answer" % [k, v, tr[i][0]])
				var cw := Frac.check(str(tr[i][0]), a)
				ok(not cw.ok and not cw.empty and not cw.close, "%s %s: %s is judged wrong" % [k, v, tr[i][0]])
				ok(str(tr[i][1]) != "", "%s %s: named error has feedback" % [k, v])
			if k == "rn4_harvest":
				ok(Frac.lt(Frac.parse(str(tr[0][0])), Ch1.look_cart(v)) and Frac.lt(Ch1.look_cart(v), a), "%s %s: the error is below the cart, the answer above" % [k, v])
			if c.has("ask"):
				var n_right := 0
				for o in c.ask.opts:
					if o[1]:
						n_right += 1
						ok(o[0].begins_with("No") == (v == "B"), "well %s: thaw answer (B stays frozen)" % v)
					else:
						ok(str(o[2]) != "", "well %s: wrong thaw option explains itself" % v)
				ok(n_right == 1, "well %s: one right thaw option" % v)
			if c.has("bar"):
				ok(Frac.eq(Frac.make(int(c.bar[1]), int(c.bar[0])), Ch1.look_cart(v)), "harvest %s: the bar shows the cart" % v)
	ok(Frac.to_float(Ch1.look_answer("rn2_well", "B")) < 0 and Frac.to_float(Ch1.look_answer("rn2_well", "A")) > 0 and Frac.to_float(Ch1.look_answer("rn2_well", "C")) > 0, "well: only B stays frozen")
	ok(Ch1.look_check("rn2_well", "A").has("ask") and Ch1.look_check("rn2_well", "B").has("ask"), "every well variant asks: thaw?")
	for v in Ch1.VARIANTS:
		ok(Frac.eq(Ch1.look_melt(v), Frac.parse({"A": "10/9", "B": "91/36", "C": "28/9"}[v])), "recipe %s melting value" % v)

	# 8. Second looks: the pips, the cap, the lock (a gold ring or a later date opens it, not before).
	var D1 := "2026-11-09"
	var D2 := "2026-11-10"
	var L := {"answers": {}, "rn": {"spot_pips": 0, "rings_right": 0, "looks": {}}, "flags": {}}
	for k in Ch1.PIP_KEYS:
		L.answers[k] = {"tier": "later"}
	L.answers.rn2_well.tier = "first"
	ok(Ch1.pips(L) == 1, "one first try, one pip")
	ok(not Ch1.look_open(L, "rn2_ledger", D1), "no second looks before the sigil")
	L.flags.sigil = true
	ok(not Ch1.look_open(L, "rn2_well", D1), "no second look for a pip already won")
	for k in ["rn2_ledger", "rn3_snap", "rn4_harvest", "rn5_recipe"]:
		ok(Ch1.look_open(L, k, D1), "%s open after the sigil" % k)
	ok(Ch1.look_variant(L, "rn2_ledger") == "A", "first look is variant A")
	Ch1.look_result(L, "rn2_ledger", "A", "later", D1)
	ok(not Ch1.look_open(L, "rn2_ledger", D1), "a miss locks the giver the same day")
	ok(Ch1.look_variant(L, "rn2_ledger") == "B", "next look is variant B")
	ok(Ch1.pips(L) == 1, "a miss adds no pip")
	L.rn.rings_right = 1
	ok(Ch1.look_open(L, "rn2_ledger", D1), "one more gold ring opens it")
	Ch1.look_result(L, "rn2_ledger", "B", "second", D1)
	ok(not Ch1.look_open(L, "rn2_ledger", D1), "right on the second try still locks")
	ok(Ch1.look_open(L, "rn2_ledger", D2), "a later date opens it")
	ok(not Ch1.look_open(L, "rn2_ledger", "2026-11-08"), "an earlier date doesn't")
	ok(Ch1.look_variant(L, "rn2_ledger") == "C", "third look is variant C")
	Ch1.look_result(L, "rn2_ledger", "C", "first", D2)
	ok(Ch1.look_passed(L, "rn2_ledger") and not Ch1.look_open(L, "rn2_ledger", "2026-12-01"), "passed: the ? clears for good")
	ok(Ch1.pips(L) == 2 and Ch1.look_pips(L) == 1, "a second look right first time recharges one pip")
	ok(L.answers.rn2_ledger.tier == "later", "the first-try record is unchanged")
	ok(Ch1.look_text(L, "rn2_ledger").ends_with("recharged on a second look (variant C, try 1)"), "report: " + Ch1.look_text(L, "rn2_ledger"))
	Ch1.look_result(L, "rn3_snap", "A", "later", D1)
	Ch1.look_result(L, "rn3_snap", "B", "later", D2)
	Ch1.look_result(L, "rn3_snap", "C", "later", "2026-11-11")
	ok(Ch1.look_variant(L, "rn3_snap") == "A", "after C, back to A")
	for k in ["rn3_snap", "rn4_harvest", "rn5_recipe"]:
		Ch1.look_result(L, k, Ch1.look_variant(L, k), "first", D2)
	ok(Ch1.pips(L) == 5 and Ch1.look_pips(L) == 4, "1 first try + 4 second looks = 5: the cellar opens")
	L.rn.spot_pips = 2
	ok(Ch1.pips(L) == 5, "never above 5, with rings and second looks")
	L.rn.spot_pips = 0
	L.rn.looks.rn5_recipe.passed = ""
	ok(Ch1.pips(L) == 4 and Ch1.pips(L) < Ch1.CELLAR_PIPS, "4 pips: the cellar stays shut")

	# 9. Old saves (before second looks and the feed): no looks, no rings_right; everything reads with defaults.
	var O := {"answers": {"rn2_well": {"tier": "second"}, "rn3_snap": {"tier": "first"}}, "rn": {"gate_wait": -1, "rune_stage": 1, "rune_losses": 0,
		"spot_visits": {}, "spot_pips": 1, "spot_first": 1, "spots_used": {}}, "flags": {"sigil": true}}
	ok(Ch1.pips(O) == 2 and Ch1.look_pips(O) == 0, "old save: 1 first try + 1 ring")
	ok(Ch1.look_open(O, "rn2_well", D1) and not Ch1.look_open(O, "rn3_snap", D1), "old save: a missed pip gets a second look")
	ok(Ch1.look_variant(O, "rn2_well") == "A" and Ch1.look_text(O, "rn2_well") == "", "old save: no looks yet")
	Ch1.look_result(O, "rn2_well", "A", "first", D1)
	ok(Ch1.pips(O) == 3, "old save: a second look adds to it")
	var G = load("res://games/realm/game.gd").new()
	var O2 := {"answers": {"rn2_well": {"tier": "later", "label": "RN2 · The frozen well: −12.5 + 18.75"}}, "rn": {"gate_wait": -1, "rune_stage": 1, "rune_losses": 0,
		"spot_visits": {}, "spot_pips": 0, "spot_first": 0, "spots_used": {}, "rune_result": "first attempt"}, "flags": {"sigil": true, "rune_broken": true}, "inv": {}}
	ok(G.validate(O2), "old save still validates")
	var rep: Array = G.report(O2)
	ok(rep.size() == 3 and str(rep[2].rows).contains("none yet"), "old save: the report builds")
	ok(G.bubble("marta", O2) == "q_gold" and G.bubble("abel", O2) == "", "old save: a gold ? over Marta only")
	ok(G.summary(O2).pips == 0, "old save: summary builds")

	var n_grow := _chapter2()
	print("REALM %d checks (%d spot draws, %d Growth draws), %d problems" % [checks, n_spots, n_grow, fails.size()])
	for f in fails:
		print("  ✗ ", f)
	quit(1 if fails.size() else 0)


func _fq(v: String) -> Array:
	return Frac.parse(v)


## Chapter 2 (math9-realm-ch2-design-v1.md). Returns the number of Growth spot draws.
func _chapter2() -> int:
	# 1. Every answer is the design's.
	var want := {"seeds": [Ch2.seeds(), "64"], "turn": [Ch2.turn(), "-32"], "brackets": [Ch2.brackets(), "-16"], "day0": [Ch2.day0(), "1"],
		"other": [Ch2.other_moss(), "1"], "cure value": [Ch2.cure_value(), "512"], "far bed": [Ch2.bed_value(), "72"], "pots": [Ch2.pots(), "27"],
		"nook": [Ch2.nook(), "1"], "nest value": [Ch2.nest_value(), "6561"], "jar": [Ch2.jar(), "36"], "pell's jar": [Ch2.jar_pell(), "18"],
		"small bed": [Ch2.small_bed(), "4/9"], "boulder": [Ch2.boulder(), "1/8"], "weight": [Ch2.weight(), "12"], "negbase": [Ch2.negbase(), "-1/8"],
		"route2": [Ch2.route2(), "1"], "sum 49": [Ch2.sum_bed()[0], "49"], "sum 25": [Ch2.sum_bed()[1], "25"], "sum 144": [Ch2.sum_bed()[2], "144"],
		"fix 3^0": [Ch2.fixes().pe2_rune_fix, "1"], "fix 3^-2": [Ch2.fixes().pe7_rune_fix, "1/9"], "fix 4^0": [Ch2.fixes().pe2_rune_fix2, "1"],
		"fix 4^-2": [Ch2.fixes().pe7_rune_fix2, "1/16"], "2^-3 = 1/2^3": [Ch2.pw(2, -3), "1/8"], "(-2)^4": [Ch2.pw(-2, 4), "16"]}
	for k in want:
		ok(Frac.eq(want[k][0], _fq(want[k][1])), "ch2 %s is %s, design says %s" % [k, Frac.text(want[k][0]), want[k][1]])
		ok(Frac.check(Frac.text(want[k][0]).replace("−", "-"), want[k][0]).ok, "ch2 %s: the answer reads back" % k)
	ok(Ch2.cure_exp() == 9 and Ch2.moths_exp() == 3 and Ch2.nook_exp() == 0 and Ch2.nest_exp() == 8, "ch2 exponents 9, 3, 0, 8")
	ok(Ch2.pair() == [6, 8] and Ch2.same() == [12, 12] and Ch2.crate() == [8, 3], "ch2 pair 3⁶ 3⁸, same 2¹², crate 8x³")
	ok(Frac.eq(Ch2.pw(2, Ch2.cure_exp()), Ch2.cure_value()) and Frac.eq(Ch2.pw(3, Ch2.moths_exp()), Ch2.pots()) and Frac.eq(Ch2.pw(3, Ch2.nest_exp()), Ch2.nest_value()), "ch2 card powers match their values")
	ok(Frac.lt(_fq("500"), Ch2.cure_value()), "ch2 512 is enough for 500 spots")
	ok(Frac.lt(Ch2.weight(), _fq("15")), "ch2 12 stone is under the horse's 15")
	ok(Frac.eq(Frac.sub(Ch2.jar(), Ch2.jar_pell()), _fq("18")), "ch2 Pell is 18 seeds short")
	for c in [Ch2.CARD_CURE, Ch2.CARD_MOTHS, Ch2.CARD_NOOK, Ch2.CARD_NEST, Ch2.CARD_PAIR[0], Ch2.CARD_PAIR[1], Ch2.CARD_ROUTE2]:
		ok(Frac.eq(Ch2.pw(int(c.base), int(c.answer)), {"2": Ch2.cure_value(), "3": Ch2.pw(3, int(c.answer))}[str(c.base)]), "ch2 card %s" % c.expr)
	ok(Ch2.CARD_CURE.answer == Ch2.cure_exp() and Ch2.CARD_MOTHS.answer == Ch2.moths_exp() and Ch2.CARD_NOOK.answer == Ch2.nook_exp() and Ch2.CARD_NEST.answer == Ch2.nest_exp(), "ch2 the cards hold the computed exponents")
	ok(Ch2.CARD_PAIR[0].answer == Ch2.pair()[0] and Ch2.CARD_PAIR[1].answer == Ch2.pair()[1] and Ch2.CARD_CRATE.coef == Ch2.crate()[0] and Ch2.CARD_CRATE.answer == Ch2.crate()[1], "ch2 pair and crate cards")

	# 2. Named errors: never the answer, always judged wrong (not close), each with its line.
	var ans_of := {"pe1_seeds": Ch2.seeds(), "pe1_turn": Ch2.turn(), "pe1_brackets": Ch2.brackets(), "pe2_day0": Ch2.day0(), "pe4_pots": Ch2.pots(),
		"pe4_equal": Ch2.nook(), "pe6_jar": Ch2.jar(), "pe6_quot": Ch2.small_bed(), "pe7_boulder": Ch2.boulder(), "pe7_negbase": Ch2.negbase()}
	for k in Ch2.TRAPS:
		ok(ans_of.has(k), "ch2 traps %s belong to a check" % k)
		for t in Ch2.TRAPS[k]:
			var c := Frac.check(str(t[0]), ans_of[k])
			ok(not c.ok and not c.empty and not c.close, "ch2 %s: named error %s is judged wrong" % [k, t[0]])
			ok(str(t[1]) != "", "ch2 %s: named error %s has a line" % [k, t[0]])
	ok(Frac.eq(_fq(Ch2.TRAPS.pe1_brackets[0][0]), Ch2.pw(-2, 4)), "ch2 −2⁴ trap is (−2)⁴")
	ok(Frac.eq(_fq(Ch2.TRAPS.pe7_negbase[0][0]), Frac.neg(Ch2.negbase())), "ch2 (−2)⁻³ trap is the positive ⅛")
	# 3. Power cards: every named wrong exponent is wrong and gives its own line; the answer gives none.
	for c in [Ch2.CARD_CURE, Ch2.CARD_MOTHS, Ch2.CARD_NEST, Ch2.CARD_CRATE]:
		var coef := int(c.get("coef", 0))
		ok(Ch2.card_right(c, int(c.answer), coef) and Ch2.card_line(c, int(c.answer), coef) == "", "ch2 card %s: the answer is right" % c.expr)
		ok(not Ch2.card_right(c, int(c.answer) + 1, coef), "ch2 card %s: one more is wrong" % c.expr)
		for t in c.traps:
			ok(int(t[0]) != int(c.answer) and not Ch2.card_right(c, int(t[0]), coef), "ch2 card %s: %d is wrong" % [c.expr, t[0]])
			ok(Ch2.card_line(c, int(t[0]), coef) == str(t[1]), "ch2 card %s: %d gives its own line" % [c.expr, t[0]])
		for t in c.get("coef_traps", []):
			ok(not Ch2.card_right(c, int(c.answer), int(t[0])) and Ch2.card_line(c, int(c.answer), int(t[0])) == str(t[1]), "ch2 card %s: %d in front gives its line" % [c.expr, t[0]])
	ok(Ch2.CARD_CURE.traps[0][0] == 6 * 3 and Ch2.CARD_MOTHS.traps[0][0] == 7 + 4 and Ch2.CARD_MOTHS.traps[1][0] == 7 * 4 and Ch2.CARD_NEST.traps[0][0] == 2 + 4 and Ch2.CARD_NEST.traps[1][0] == 4 * 4, "ch2 card traps are the wrong rules")
	ok(Ch2.CARD_CRATE.coef_traps[0][0] == 2 and Ch2.CARD_CRATE.coef_traps[1][0] == 2 * 3, "ch2 crate: 2 (unraised) and 6 (2 × 3) in front")
	ok(Ch2.card_text(Ch2.CARD_CRATE) == "8x³" and Ch2.card_text(Ch2.CARD_CURE) == "2⁹", "ch2 card text")
	ok(Ch2.sup(-12) == "⁻¹²" and Ch2.pow_text("3", -2) == "3⁻²", "ch2 raised exponents")

	# 4. Questions: one right option; every wrong option's value is not the answer.
	for q in [Ch2.ASK_LESSON, Ch2.ASK_TALLY_WHY, Ch2.ASK_CURE_ENOUGH, Ch2.ASK_BASES, Ch2.ASK_MOTHS_WHY, Ch2.ASK_SAME, Ch2.ASK_JAR, Ch2.ASK_SUM,
			Ch2.ASK_BOULDER, Ch2.ASK_NEGBASE, Ch2.ASK_RUNE_PREDICT, Ch2.ASK_RUNE_EXPLAIN]:
		var n := 0
		for o in q.opts:
			n += 1 if o[1] else 0
		ok(n == 1, "ch2 exactly one right option: " + q.text)
	for q in [Ch2.ASK_LESSON, Ch2.ASK_TALLY_WHY, Ch2.ASK_CURE_ENOUGH, Ch2.ASK_BASES, Ch2.ASK_MOTHS_WHY, Ch2.ASK_SAME, Ch2.ASK_JAR, Ch2.ASK_SUM,
			Ch2.ASK_BOULDER, Ch2.ASK_NEGBASE, Ch2.ASK_RUNE_PREDICT, Ch2.ASK_RUNE_EXPLAIN]:
		for o in q.opts:
			if not o[1]:
				ok(str(o[2]) != "", "ch2 every wrong option explains itself: " + str(o[0]))
	var wv := {"lesson": Ch2.pw(2, 5), "tally_why": Ch2.day0(), "enough": Ch2.cure_value(), "bases": Ch2.bed_value(), "jar": Ch2.jar(),
		"sum": Ch2.sum_bed()[0], "boulder": Ch2.boulder(), "negbase": Ch2.negbase(), "rune": Ch2.pw(3, 0)}
	for k in Ch2.WRONG_VALUES:
		for v in Ch2.WRONG_VALUES[k]:
			ok(not Frac.eq(_fq(v), wv[k]), "ch2 %s wrong option value %s isn't the answer" % [k, v])
	ok(Frac.eq(_fq("7776"), Ch2.pw(6, 5)) and Frac.eq(_fq("46656"), Ch2.pw(6, 6)), "ch2 Pell's 6⁵ and 6⁶")

	# 5. The pattern boards: each row is the one above ÷ base; the stone's false lines are not the true ones.
	for bd in [[Ch2.TALLY_ROWS, 3], [Ch2.BOARD_ROWS, 2], [Ch2.RUNE_ROWS, 3]]:
		var rows: Array = bd[0]
		for i in range(1, rows.size()):
			ok(Frac.eq(_fq(rows[i][1]), Frac.div(_fq(rows[i - 1][1]), [bd[1], 1])), "ch2 board row %s is the row above ÷ %d" % [rows[i][0], bd[1]])
	ok(Frac.eq(_fq(Ch2.TALLY_ROWS[0][1]), Ch2.pw(3, 4)) and Frac.eq(_fq(Ch2.BOARD_ROWS[0][1]), Ch2.pw(2, 3)) and Frac.eq(_fq(Ch2.RUNE_ROWS[0][1]), Ch2.pw(3, 3)), "ch2 boards start at 3⁴, 2³, 3³")
	for i in 3:
		ok(Frac.eq(_fq(Ch2.RUNE_ROWS[3 + i][1]), Ch2.ladder()[i]) and Frac.eq(Ch2.ladder()[i], Ch2.pw(3, -i)), "ch2 ladder rung %d" % i)
		ok(not Frac.eq(Ch2.rune_false()[i], Ch2.ladder()[i]), "ch2 the stone's line %d is false" % i)
		ok(Frac.eq(_fq(Ch2.RUNE_STONE[3 + i]), Ch2.rune_false()[i]), "ch2 the stone column shows the false line %d" % i)
	ok(Ch2.RUNE_STONE.size() == Ch2.RUNE_ROWS.size(), "ch2 one stone line per rung")
	for k in Ch2.FIX_TRAPS:
		ok(Ch2.FIX_WHY.has(k), "ch2 rune fix %s has a why line" % k)
		for t in Ch2.FIX_TRAPS[k]:
			var cw := Frac.check(str(t[0]), Ch2.fixes()[k])
			ok(not cw.ok and not cw.empty and not cw.close and str(t[1]) != "", "ch2 rune fix %s: %s judged wrong with its line" % [k, t[0]])
	ok(Frac.eq(_fq(Ch2.FIX_TRAPS.pe7_rune_fix[0][0]), Ch2.rune_false()[2]) and Frac.eq(_fq(Ch2.FIX_TRAPS.pe7_rune_fix[2][0]), Ch2.pw(3, -1)), "ch2 rune fix traps: the stone's −9 and 3⁻¹")
	ok(Frac.eq(_fq(Ch2.FIX_TRAPS.pe7_rune_fix2[1][0]), Frac.neg(Ch2.pw(4, -2))), "ch2 rune fix trap: −1/16")
	ok(Frac.eq(_fq(Ch2.TRAPS.pe6_quot[2][0]), _fq("2/3")) and Frac.check("4/6", Ch2.small_bed()).value == _fq("2/3"), "ch2 (⅔)² trap: the side ⅔, also typed 4/6")
	for q in ["lesson2", "tally", "cure", "moths", "nests", "jar", "boulder"]:
		ok(str(Ch2.PRAISE.get(q, "")) != "", "ch2 praise for %s" % q)
	for k in Ch2.PIP_KEYS:
		ok(Ch2.HINT.has(Ch2.LOOK_QUEST[k]) and Ch2.WHY.has(Ch2.LOOK_QUEST[k]), "ch2 second look %s has its quest's hint and why" % k)
	ok(Frac.eq(Ch2.fixes().pe2_rune_fix, Ch2.ladder()[0]) and Frac.eq(Ch2.fixes().pe7_rune_fix, Ch2.ladder()[2]), "ch2 the fixes are the ladder's 1 and 1/9")

	# 6. Second looks: every variant answer and named error, from the design's table (§8.1, with the script's fix to Cure C).
	var table := {"pe2_day0": {"A": "5", "B": "6", "C": "2"}, "pe3_cure": {"A": "6", "B": "10", "C": "3"}, "pe4_moths": {"A": "3", "B": "2", "C": "0"},
		"pe5_nest": {"A": "10", "B": "6", "C": "9"}, "pe6_jar": {"A": "100", "B": "216", "C": "144"}, "pe7_boulder": {"A": "1/9", "B": "1/16", "C": "1/1000"}}
	var vals := {"pe3_cure": {"A": "729", "B": "1024", "C": "125"}, "pe4_moths": {"A": "8", "B": "25", "C": "1"}}
	var errs := {"pe2_day0": {"A": ["4", "8"], "B": ["0", "60"], "C": ["0", "9"]}, "pe3_cure": {"A": ["8"], "B": ["25"], "C": ["2"]},
		"pe4_moths": {"A": ["15"], "B": ["10"], "C": ["10"]}, "pe5_nest": {"A": ["7"], "B": ["5"], "C": ["6"]},
		"pe6_jar": {"A": ["50", "20"], "B": ["24", "18"], "C": ["36", "24"]}, "pe7_boulder": {"A": ["-9", "-6", "9"], "B": ["-16", "-8", "16"], "C": ["-1000", "-30", "1000"]}}
	for k in table:
		ok(Ch2.LOOK_GIVER.has(k) and Ch2.LOOK_NAME.has(k) and Ch2.PIP_KEYS.has(k), "ch2 %s has a giver, a name and a pip" % k)
		for v in Ch2.VARIANTS:
			ok(Ch2.LOOK_PROMPT.has(k + v) and str(Ch2.LOOK_PROMPT[k + v]) != "", "ch2 %s %s has a prompt" % [k, v])
			var tr := Ch2.look_traps(k, v)
			ok(tr.size() == errs[k][v].size(), "ch2 %s %s: %d named errors" % [k, v, errs[k][v].size()])
			if Ch2.LOOK_CARD.has(k):
				var c := Ch2.look_card(k, v)
				ok(int(c.answer) == int(table[k][v]), "ch2 %s %s is %s, design says %s" % [k, v, c.answer, table[k][v]])
				if vals.has(k):
					ok(Frac.eq(Ch2.look_answer(k, v), _fq(vals[k][v])), "ch2 %s %s value %s" % [k, v, vals[k][v]])
				for i in tr.size():
					ok(int(tr[i][0]) == int(errs[k][v][i]) and int(tr[i][0]) != int(c.answer), "ch2 %s %s: named error %s" % [k, v, errs[k][v][i]])
					var card := {"expr": c.expr, "base": c.base, "answer": c.answer, "traps": tr}
					ok(not Ch2.card_right(card, int(tr[i][0])) and Ch2.card_line(card, int(tr[i][0])) == str(tr[i][1]) and str(tr[i][1]) != "", "ch2 %s %s: %s judged wrong with its line" % [k, v, tr[i][0]])
			else:
				var a := Ch2.look_answer(k, v)
				ok(Frac.eq(a, _fq(table[k][v])), "ch2 %s %s is %s, design says %s" % [k, v, Frac.text(a), table[k][v]])
				for i in tr.size():
					ok(Frac.eq(_fq(str(tr[i][0])), _fq(errs[k][v][i])), "ch2 %s %s: named error %s is %s" % [k, v, tr[i][0], errs[k][v][i]])
					var cw := Frac.check(str(tr[i][0]), a)
					ok(not cw.ok and not cw.empty and not cw.close and str(tr[i][1]) != "", "ch2 %s %s: %s judged wrong with its line" % [k, v, tr[i][0]])
	ok(Frac.check("0.001", Ch2.look_answer("pe7_boulder", "C")).ok, "ch2 boulder C: 0.001 accepted")
	ok(Ch2.look_traps("pe3_cure", "C").size() == 1, "ch2 cure C: one line for the answer 2 (script's fix)")

	# 7. Growth spots on many seeds: the answer reaches the target exactly; one less and one more are too little and too far.
	var n_draws := 0
	for sid in Ch2.SPOTS:
		for seed in 300:
			var nums := Ch2.spot_numbers(sid, seed % 5, seed)
			n_draws += 1
			var b: int = nums.b
			var a: int = nums.answer
			ok(Ch2.BASES.has(b), "%s: base from 2, 3, 4, 5, 10" % sid)
			ok(a != 0, "%s: never a nought cast" % sid)
			ok(Frac.eq(Ch2.spot_after(nums, a), Ch2.pw(b, int(nums.n))), "%s: the answer reaches the target" % sid)
			for x in [Ch2.pw(b, int(nums.m)), Ch2.pw(b, int(nums.n))]:
				ok(Frac.lt(x, _fq("1000")) and Frac.lt(_fq("1/1000"), x), "%s: sizes under 1000 and above 1/1000" % sid)
			ok(Ch2.spot_judge(nums, a) == "" and Ch2.spot_side(nums, a) == 0, "%s: the answer is right" % sid)
			var sg := 1 if a > 0 else -1
			var less := a - sg
			if less != 0:
				ok(Ch2.spot_side(nums, less) == -1, "%s: one less is too little" % sid)
				ok(Ch2.spot_judge(nums, less).contains("Try again"), "%s: too little says so (%s)" % [sid, Ch2.spot_judge(nums, less)])
			else:
				ok(Ch2.spot_judge(nums, 0).contains("nought"), "%s: 0 changes nothing" % sid)
			ok(Ch2.spot_side(nums, a + sg) == 1, "%s: one more is too far" % sid)
			ok(Ch2.spot_judge(nums, a + sg).contains("Too far"), "%s: too far says so" % sid)
			ok(Ch2.spot_judge(nums, -a).contains("other way"), "%s: the wrong sign says so" % sid)
			ok(Ch2.spot_prompt(nums).ends_with("Cast %d to the…?" % b), "%s: prompt names the base" % sid)
			ok(Ch2.spot_reveal(nums).contains(Ch2.num(a)), "%s: the reveal gives the answer" % sid)
			match str(nums.kind):
				"reach":
					ok(int(nums.m) == 0 and a > 0, "%s: reach grows from 1" % sid)
				"shrink":
					ok(int(nums.m) == 0 and a < 0, "%s: shrink goes below 1" % sid)
				"up":
					ok(a > 0 and int(nums.m) >= 1, "%s: top up grows" % sid)
				"down":
					ok(a < 0 and int(nums.n) >= 1, "%s: back down shrinks" % sid)
			ok(Ch2.SPOTS[sid].kind == {"reach": "reach", "shrink": "shrink", "up": "topup", "down": "topup"}[str(nums.kind)], "%s: the spot's kind" % sid)
	var fv := Ch2.first_vine()
	ok(fv.answer == 5 and Frac.eq(Ch2.spot_after(fv, 5), _fq("32")) and Ch2.spot_prompt(fv).contains("doubles") and Ch2.spot_prompt(fv).contains("32 hands"), "ch2 the first vine: 1 hand doubling to 32, 2⁵")
	ok(Ch2.spot_judge(fv, 4) == "The vine stops short at 16 hands. Try again.", "ch2 first vine: 2⁴ stops short at 16 hands")
	var up := {"kind": "up", "b": 2, "m": 3, "n": 8, "answer": 5}
	ok(Ch2.spot_prompt(up) == "The vine has grown 2³ hands. It needs 2⁸. Cast 2 to the…?", "ch2 top up prompt")
	var dn := {"kind": "down", "b": 3, "m": 5, "n": 2, "answer": -3}
	ok(Frac.eq(Ch2.spot_after(dn, -3), Ch2.pw(3, 2)), "ch2 back down: 3⁵ to 3² is 3⁻³")
	ok(Ch2.spot_judge(dn, -2) == "The vine is still too long, at 27 hands. Try again." and Ch2.spot_judge(dn, -4) == "The vine shrivels to almost nothing. Too far.", "ch2 back down: too long at 3³ = 27, too far")
	var sh := {"kind": "shrink", "b": 3, "m": 0, "n": -2, "answer": -2}
	ok(Ch2.spot_prompt(sh).begins_with("The gap is 1⁄9 of your height") and Ch2.spot_judge(sh, -1).contains("1⁄3"), "ch2 shrink: ⅑, and 3⁻¹ leaves you 1⁄3")

	# 8. The charge: six pips, from first tries, Growth spots and second looks, never above six.
	var S := {"answers": {}, "flags": {}, "pe": {"spot_pips": 0, "rings_right": 0, "looks": {}}}
	ok(Ch2.pips(S) == 0 and Ch2.PIPS == 6 and Ch2.PIP_KEYS.size() == 6, "ch2 six pips, none yet")
	for k in Ch2.PIP_KEYS:
		S.answers[k] = {"tier": "first"}
	ok(Ch2.pips(S) == 6 and Ch2.pip_text(6) == "●●●●●●", "ch2 six first tries, six pips")
	S.pe.spot_pips = 2
	ok(Ch2.pips(S) == 6, "ch2 never above six")
	S.answers.pe2_day0.tier = "second"
	S.answers.pe7_boulder.tier = "later"
	S.pe.spot_pips = 1
	ok(Ch2.pips(S) == 5 and Ch2.pip_text(5) == "●●●●●○", "ch2 4 first tries + 1 spot = 5")
	ok(not Ch2.look_open(S, "pe2_day0", "2026-11-14"), "ch2 no second looks before Growth")
	S.flags.sigil2 = true
	ok(Ch2.look_open(S, "pe2_day0", "2026-11-14") and not Ch2.look_open(S, "pe3_cure", "2026-11-14"), "ch2 a missed pip opens a look")
	Ch2.look_result(S, "pe2_day0", "A", "later", "2026-11-14")
	ok(not Ch2.look_open(S, "pe2_day0", "2026-11-14") and Ch2.look_variant(S, "pe2_day0") == "B", "ch2 a miss locks; next is B")
	S.pe.rings_right = 1
	ok(Ch2.look_open(S, "pe2_day0", "2026-11-14"), "ch2 a Growth spot opens it")
	Ch2.look_result(S, "pe2_day0", "B", "first", "2026-11-14")
	ok(Ch2.look_passed(S, "pe2_day0") and Ch2.look_pips(S) == 1 and Ch2.pips(S) == 6, "ch2 right first time: a pip back")
	ok(S.answers.pe2_day0.tier == "second", "ch2 the first-try record is unchanged")

	# 9. The report: a label for every key, by PE code; pe4_equal under PE2 and PE4; the filter; a Chapter 2 save.
	for c in Ch2.CODES:
		for k in c[2]:
			ok(Ch2.LABEL.has(k), "ch2 %s has a report label" % k)
	ok(Ch2.CODES[1][2].has("pe4_equal") and Ch2.CODES[3][2].has("pe4_equal"), "ch2 3⁴ ÷ 3⁴ is under PE2 and PE4")
	ok(Ch2.label("pe3_cure") == "PE3 · 2⁶ × 2³ as one power" and Ch2.label("rune2_predict") == "Predicted the next line", "ch2 labels")
	var G = load("res://games/realm/game.gd").new()
	var C2 := {"answers": {"pe3_cure": {"tier": "first", "label": Ch2.label("pe3_cure")}, "pe4_equal": {"tier": "second", "label": Ch2.label("pe4_equal")},
		"rn2_well": {"tier": "first", "label": "RN2 · The frozen well: −12.5 + 18.75"}, "rune2_predict": {"tier": "first", "label": "x"},
		"pe2_rune_fix": {"tier": "first", "label": "x"}, "pe7_rune_fix": {"tier": "later", "label": "x"}},
		"typed": {"pe1_pell": {"prompt": "p", "text": "t"}, "rn1_pell": {"prompt": "p", "text": "t"}}, "log": [{"day": 1, "text": "ch1"}, {"day": 1, "text": "ch2"}],
		"rn": {"gate_wait": -1, "rune_stage": 1, "rune_losses": 0, "spot_visits": {}, "spot_pips": 0, "spot_first": 0, "spots_used": {}},
		"pe": {"gate_wait": -1, "rune_stage": 3, "rune_losses": 1, "spot_visits": {}, "spot_pips": 0, "spot_first": 0, "spots_used": {"growth_hedge": 2},
			"rings_right": 0, "looks": {}, "balance_used": {"spot_gate": 1}, "log_from": 1}, "chapter": 2,
		"flags": {"ch2": true, "sigil2": true, "at_vault": true}, "inv": {}, "seed": 3}
	ok(G.validate(C2), "ch2 save validates")
	var C3 := C2.duplicate(true)
	C3.erase("pe")
	ok(not G.validate(C3), "ch2 save without S.pe does not validate")
	ok(G.report_keep(C2, "answer", "pe3_cure") and not G.report_keep(C2, "answer", "rn2_well"), "ch2 report: Chapter 2's answers only")
	ok(not G.report_keep(C2, "log", 0) and G.report_keep(C2, "log", 1), "ch2 report: Chapter 2's log lines only")
	ok(not G.report_keep(C2, "typed", "pe1_pell") and not G.report_keep(C2, "typed", "rn1_pell"), "ch2 report: typed answers in the game's own rows")
	var rep: Array = G.report(C2)
	var txt := JSON.stringify(rep)
	ok(txt.contains("PE3 Product of powers") and txt.contains("PE2 The zero exponent") and txt.contains("Growth charge: 1 of 6") and txt.contains("−2⁴ and (−2)⁴, for Pell")
		and txt.contains("3⁰ and 3⁻²") and txt.contains("Not yet (1 flares so far)") and txt.contains("the tower-yard gate ×1") and txt.contains("The hedge gap ×2"), "ch2 report rows: " + txt.substr(0, 200))
	ok(not txt.contains("rn2_well") and not txt.contains("frozen well"), "ch2 report leaves Chapter 1 out")
	var C1 := {"answers": {"rn2_well": {"tier": "first", "label": "x"}}, "flags": {}, "log": [{"day": 1, "text": "a"}]}
	ok(G.report_keep(C1, "answer", "rn2_well") and G.report_keep(C1, "log", 0) and G.report_keep(C1, "typed", "rn1_pell"), "ch1 report keeps everything of Chapter 1")
	ok(G.summary(C2).chapter == 2, "ch2 summary builds")
	ok(G.hud(C2)[0].label == "Chapter 2" and G.hud(C2)[2].value == Ch2.pip_text(Ch2.pips(C2)), "ch2 hud")
	ok(G.bubble("bram", C2) == "" and G.where("bram", C2) == null, "ch2 Bram not on the map before the boulder")
	# the title: Chapter 2 once Chapter 1 is done; with no save, a choice of where to start
	var t0: Array = G.title_buttons(null, [])
	ok(t0.size() == 2 and t0[1][1] == "game:ch2new", "title with no save offers Chapter 2")
	var g1 := {"done": true, "S": {"flags": {}}}
	ok(G.title_buttons(g1, [["Continue", "continue", true], ["New game", "new"]])[1][1] == "game:ch2", "title after Chapter 1 offers Chapter 2")
	var g2 := {"done": false, "S": {"flags": {}}}
	ok(G.title_buttons(g2, [["Continue", "continue", true], ["New game", "new"]]).size() == 2, "title mid Chapter 1: Continue and New game only")
	ok(G.title_buttons({"done": false, "S": {"chapter": 2, "flags": {}}}, [1, 2]) == [1, 2], "title in Chapter 2: unchanged")
	ok(G.title_pick("ch2", g1) == g1 and int(g1.S.want_ch) == 2, "title pick: go on with the same save")
	return n_draws
