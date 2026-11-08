# Model check, no window: godot --headless --path godot/cefl-town-v2 -s res://tests/test_model.gd
# Bots play the demo café's three days on 400 seeds. A careful player must always win;
# the shortcuts (cheap beans, no staff, same order every day, huge order, big price moves, doing nothing) must not.
extends SceneTree

const Story = preload("res://engine/core/story.gd")
const Sim = preload("res://engine/core/shop_sim.gd")
const Money = preload("res://engine/core/money.gd")
const M = preload("res://games/demo_cafe/model.gd")

var fails := 0


func _init() -> void:
	_unit_tests()
	_bots("careful", _careful, 100, 100)
	_bots("careful, no Dev", _no_dev, 0, 5)
	_bots("careful + cheap beans", _cheap, 0, 0)
	_bots("careful, prices +40%", _high, 0, 20)
	_bots("careful, prices −25%", _low, 0, 0)
	_bots("same order every day", _same, 0, 0)
	_bots("huge order", _huge, 0, 0)
	_bots("do nothing", _nothing, 0, 0)
	print("FAILS: %d" % fails)
	quit(1 if fails else 0)


func _check(ok: bool, what: String) -> void:
	if not ok:
		fails += 1
		print("FAIL: ", what)


func _unit_tests() -> void:
	_check(Money.fmt(123456) == "$1,234.56", "fmt 1234.56: " + Money.fmt(123456))
	_check(Money.fmt(-5) == "−$0.05", "fmt negative")
	_check(Money.fmt_w(6000) == "$60", "fmt_w")
	_check(Money.parse("$1,234.5") == 123450, "parse")
	_check(Money.parse("abc") == null, "parse junk")
	_check(Money.clock(450) == "7:30 am" and Money.clock(780) == "1:00 pm", "clock")
	var S := Story.new_state(7)
	_check(Story.validate(S), "new state valid")
	_check(Story.validate(JSON.parse_string(JSON.stringify(S))), "state survives JSON")
	Story.remember(S, "lin", "You stayed loyal.", 2)
	_check(Story.knows(S, "lin", "You stayed loyal.") and Story.trust(S, "lin") == 2, "memory")
	S.cash = 1000
	S.shop = Sim.init(M.CFG)
	_check(not Sim.order(M.CFG, S, {"sandwich": 1}).ok, "order over cash refused")
	_check(Sim.order(M.CFG, S, {"coffee": 1}).ok and S.cash == 200 and S.shop.stock.coffee == 20, "order")
	# the same seed and day always give the same day; a JSON round trip (ints become floats) changes nothing
	var a := Sim.simulate(M.CFG, S, M.EVENTS[0])
	var S2: Dictionary = JSON.parse_string(JSON.stringify(S))
	var b := Sim.simulate(M.CFG, S2, M.EVENTS[0])
	_check(a.profit == b.profit and a.served == b.served, "deterministic after JSON")
	_check(a.profit == a.sales - a.bought - a.wages - a.rent, "profit identity")


func _careful(S: Dictionary, d: int) -> Dictionary:
	var ev: Dictionary = M.EVENTS[d]
	var m := float(ev.traffic) * (0.6 + float(S.shop.rep) / 125.0)
	var want := {}
	for k in M.CFG.products:
		want[k] = 0.0
	for i in M.CFG.traffic.size():
		var ws := 0.0
		for k in M.CFG.products:
			ws += M.CFG.products[k].mix[i]
		for k in M.CFG.products:
			want[k] += M.CFG.traffic[i] * m * M.CFG.products[k].mix[i] / ws
	var dev := ["morning", "afternoon"] if d == 1 else (["morning"] if d == 0 else [])
	var packs := {}
	for k in M.CFG.products:
		var need: float = want[k] * (0.95 if dev.size() else 0.8) - float(S.shop.stock[k])
		packs[k] = maxi(0, roundi(need / float(M.CFG.products[k].pack_size)))
	return {"packs": packs, "dev": dev}


func _no_dev(S, d):
	var p := _careful(S, d)
	p.dev = []
	return p


func _cheap(S, d):
	var p := _careful(S, d)
	p.cheap = d >= 1
	return p


func _high(S, d):
	var p := _careful(S, d)
	p.price = {"coffee": 425, "muffin": 500, "sandwich": 1050}
	return p


func _low(S, d):
	var p := _careful(S, d)
	p.price = {"coffee": 225, "muffin": 275, "sandwich": 550}
	return p


func _same(_S, _d):
	return {"packs": {"coffee": 3, "muffin": 3, "sandwich": 3}, "dev": []}


func _huge(_S, _d):
	return {"packs": {"coffee": 6, "muffin": 6, "sandwich": 6}, "dev": ["morning"]}


func _nothing(_S, _d):
	return {"packs": {}, "dev": []}


func _play(seed: int, pol: Callable) -> Dictionary:
	var S := Story.new_state(seed)
	S.cash = M.START_CASH
	S.shop = Sim.init(M.CFG)
	for d in 3:
		S.day = d + 1
		var p: Dictionary = pol.call(S, d)
		if p.get("cheap", false):
			S.shop.grade.coffee = "cheap"
		for k in p.get("price", {}):
			S.shop.price[k] = p.price[k]
		S.shop.shifts.dev = p.get("dev", [])
		Sim.order(M.CFG, S, p.packs)
		var r := Sim.simulate(M.CFG, S, M.EVENTS[d])
		Sim.apply(S, r)
	return {"profit": Sim.total_profit(S), "S": S}


## Runs 400 seeds; the win rate must fall between lo and hi percent.
func _bots(name: String, pol: Callable, lo: int, hi: int) -> void:
	var wins := 0
	var tot := 0
	var worst := 1 << 30
	var rep := 0
	for s in range(1, 401):
		var r := _play(s, pol)
		tot += r.profit
		worst = mini(worst, r.profit)
		rep += int(r.S.shop.rep)
		if M.ending(r.S, r.profit) == "thriving":
			wins += 1
	var pct := wins * 100 / 400
	print("%-24s avg %10s  worst %10s  rep %5.1f  win %3d%%" % [name, Money.fmt(tot / 400), Money.fmt(worst), rep / 400.0, pct])
	_check(pct >= lo and pct <= hi, "%s win rate %d%% outside %d–%d%%" % [name, pct, lo, hi])
