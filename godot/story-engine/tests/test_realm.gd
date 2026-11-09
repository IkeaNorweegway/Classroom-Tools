# Realm Chapter 1, without a window: the typed-fraction checker, every quest answer against the design, the question tables
# (one right option each; no wrong option gives the right value), the Balance spots on many seeds, the charge rule (5 for the cellar),
# the cross-cancel feed, every second-look variant and its named errors, the second-look lock, and old saves.
#   godot --headless --path godot/story-engine -s res://tests/test_realm.gd
extends SceneTree

const Frac = preload("res://engine/core/frac.gd")
const Ch1 = preload("res://games/realm/ch1.gd")

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

	print("REALM %d checks (%d spot draws), %d problems" % [checks, n_spots, fails.size()])
	for f in fails:
		print("  ✗ ", f)
	quit(1 if fails.size() else 0)
