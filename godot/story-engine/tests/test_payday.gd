# Payday's model, no window:  godot --headless --path godot/story-engine -s res://tests/test_payday.gd [-- dump=FILE]
# Bots: a careful planner always reaches the goal (with every shift ok, poor or great); doing nothing never does; planning
# from gross pay never does at 19 or 24 and seldom at 17 (Avery pays only EI). A bot that keeps half its spare money is reported. The Pay Card matches its formula; every mistake is worth $5.
# dump=FILE writes the same grid of runs as tests/payday/v1_ref.cjs, so tests/payday/compare.sh can check every cent against v1.
extends SceneTree

const M = preload("res://games/payday/model.gd")

var fails := 0


func _init() -> void:
	var args := {}
	for a in OS.get_cmdline_user_args():
		var kv := a.split("=", true, 1)
		args[kv[0]] = kv[1] if kv.size() > 1 else "1"
	if args.has("dump"):
		var f := FileAccess.open(args.dump, FileAccess.WRITE)
		f.store_string(JSON.stringify(_grid()))
		f.close()
		quit(0)
		return
	_units()
	_bots("careful, every shift ok", _careful, "ok", "always")
	_bots("careful, every shift poor", _careful, "poor", "always")
	_bots("careful, every shift great", _careful, "great", "always")
	_check(_bots("plans from gross pay", _gross, "ok", "", ["dev", "rosa"]) < 0.05, "plans from gross pay should seldom win")
	_bots("does nothing", func(_s, _p): return 0, "ok", "never")
	_bots("keeps half the spare in the bank", _timid, "ok", "")
	print("FAILS: %d" % fails)
	quit(1 if fails else 0)


func _check(ok: bool, what: String) -> void:
	if not ok:
		fails += 1
		print("FAIL: ", what)


func _units() -> void:
	for row in M.PAY_CARD:
		_check(absi(M.tax_formula(row[0]) - int(row[1])) <= 1, "Pay Card row $%d: formula %d, card %d" % [row[0], M.tax_formula(row[0]), row[1]])
	_check(M.row_of(64999) == 600 and M.row_of(65000) == 700 and M.row_of(250000) == 2200, "row_of")
	_check(M.cpp_of(30000, 17) == 0 and M.cpp_of(30000, 18) == M.jr(16500 * 0.0595), "cpp_of")
	for wk in M.WORKERS:
		for jk in M.WORKERS[wk].jobs:
			for seed in range(1, 41):
				var s := M.new_run(wk, jk, seed)
				for p in range(1, M.PERIODS + 1):
					for k in M.error_kinds(s, p):
						var pr := M.stub_as_printed(s, p, k)
						_check(int(M.stub_as_printed(s, p, "").net) - int(pr.net) >= 500 and pr.root != "", "%s/%s seed %d p%d %s worth $5" % [wk, jk, seed, p, k])
					M.payday(s, 0, false)
	for id in M.STORY_STUBS:
		var t := M.story_stub(id)
		_check(int(t.right.net) - int(t.printed.net) >= 500, "story stub %s is worth $5" % id)


func _careful(s: Dictionary, p: int) -> int:
	return M.careful_jar(s, p)


func _gross(s: Dictionary, p: int) -> int:   # plans with the job's gross pay, as if nothing came off
	var j: Dictionary = M.JOBS[s.job]
	var sc := M.schedule_of(s, p)
	var g := M.gross_from(j, sc.hours, sc.rate, sc.sales, sc.yearly) + int(sc.tips)
	return maxi(0, (int(s.bank) + g - M.bills_of(s.worker)) / 2500 * 2500)


func _timid(s: Dictionary, p: int) -> int:
	return maxi(0, M.careful_jar(s, p) / 2 / 2500 * 2500)


## Every worker, job and seed (1–200, Gentle and Real, with and without the extra hours). Mistakes are always caught.
## want: "always", "never" or "" (just report). never_for: workers who must never win. Returns the share of wins.
func _bots(label: String, plan: Callable, tier: String, want: String, never_for := []) -> float:
	var n := 0
	var wins := 0
	var why := {}
	var by := {}
	for wk in M.WORKERS:
		for jk in M.WORKERS[wk].jobs:
			for seed in range(1, 201):
				var s := M.new_run(wk, jk, seed)
				s.extra = seed % 2 == 0
				for p in range(1, M.PERIODS + 1):
					if p == 3:
						M.start_chapter(s, 2)
					M.payday(s, plan.call(s, p), seed % 3 == 0)
					s.shifts[str(p)] = tier
					if M.outcome(s).get("why", "") == "strikes":
						break
				var o := M.outcome(s)
				n += 1
				if o.get("win", false):
					wins += 1
					by[wk] = int(by.get(wk, 0)) + 1
				else:
					why[o.get("why", "?")] = int(why.get(o.get("why", "?"), 0)) + 1
	print("%-36s wins %d of %d %s, wins by worker %s" % [label, wins, n, why, by])
	if want == "always":
		_check(wins == n, label + " should always win")
	if want == "never":
		_check(wins == 0, label + " should never win")
	for wk in never_for:
		_check(not by.has(wk), "%s should never win as %s" % [label, wk])
	return float(wins) / n


## The grid that tests/payday/v1_ref.cjs runs on v1.
func _grid() -> Dictionary:
	var TIERS := ["great", "ok", "poor", "skip", "great", "great", "ok", "poor"]
	var out := {"runs": [], "story": {}, "card": []}
	for row in M.PAY_CARD:
		out.card.append(M.tax_formula(row[0]))
	for wk in M.WORKERS:
		for jk in M.WORKERS[wk].jobs:
			for seed in range(1, 61):
				var s := M.new_run(wk, "", seed * 101)
				M.set_job(s, jk)
				s.extra = seed % 2 == 0
				var plan := M.error_plan(seed * 101)
				var real := seed % 3 == 0
				var rec := {"wk": wk, "jk": jk, "seed": seed, "steps": []}
				for p in range(1, 9):
					if p == 3:
						M.start_chapter(s, 2)
					if seed % 4:
						s.shifts[str(p - 1)] = TIERS[(seed + p) % 8]
					else:
						s.shifts.erase(str(p - 1))
					var sp: int = int(s.bank) + M.safe_take_home(s, p) - M.bills_of(wk)
					var jar := 30000 if seed % 5 == 0 else maxi(0, int(floor(sp / 2500.0)) * 2500)
					var kind := M.error_kind_for(s, p, plan)
					var pr = M.stub_as_printed(s, p, kind) if kind != "" else null
					var right := M.stub_as_printed(s, p, "")
					var short: int = int(right.net) - int(pr.net) if kind != "" and (seed + p) % 3 == 0 else 0
					var l := M.payday(s, jar, real, short)
					rec.steps.append({"p": p, "safe": M.safe_take_home(s, mini(8, p + 1)), "sched": M.schedule_of(s, mini(8, p + 1)).hours, "kind": kind,
						"printed": int(pr.net) if pr != null else 0, "gross": l.stub.gross, "ei": l.stub.ei, "cpp": l.stub.cpp, "tax": l.stub.tax, "net": l.stub.net,
						"tips": l.tips, "bank": l.bank, "jar": s.jar, "bounced": l.bounced, "help": M.help_topic(s)})
				rec.out = M.outcome(s)
				rec.strikes = s.strikes
				rec.covered = s.covered
				out.runs.append(rec)
	for id in ["mo", "avery", "dev", "nurse"]:
		var t := M.story_stub(id)
		out.story[id] = {"right": t.right.net, "printed": t.printed.net, "root": t.printed.root}
	return out
