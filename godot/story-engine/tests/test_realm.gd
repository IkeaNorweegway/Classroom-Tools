# Realm Chapter 1, without a window: the typed-fraction checker, every quest answer against the design, the question tables
# (one right option each; no wrong option gives the right value), the Balance spots on many seeds, and the charge rule.
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

	print("REALM %d checks (%d spot draws), %d problems" % [checks, n_spots, fails.size()])
	for f in fails:
		print("  ✗ ", f)
	quit(1 if fails.size() else 0)
