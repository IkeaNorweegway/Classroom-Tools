# CellPoint (sales associate, wage + 4% commission): Best plan. Customers at the plan desk say how much data they use and how
# much they call: sell the cheapest plan that covers both. Too small, and they come back angry; bigger than they need, and they
# cancel next month, so the commission is taken back. Shoppers at the accessory wall want a case for their phone: match the
# model. Everyone pays at the till. Commission on a plan is 4% of its first year; on a case, 4% of the price.
# Shift 5 adds a phone on a 24-month payment plan: tell them the monthly bill (plan + phone ÷ 24).
extends "res://games/payday/jobs/job.gd"

const GB := [2, 4, 6, 10, 15, 25, 50]
const PRICE := [2500, 3000, 3500, 4500, 5500, 6500, 8000]
const CALLS := 1000
const PHONES := ["Pixelle 8", "Pixelle 8 Pro", "Fold Z2", "Fold Z3", "Nova S", "Nova S Max", "Pear 15", "Pear 15 mini"]
const CASE_PRICE := 3500
const DESK_Q := [Vector2i(3, 5), Vector2i(4, 6), Vector2i(3, 6), Vector2i(5, 6), Vector2i(2, 6)]
const ACC_SPOTS := [Vector2i(9, 3), Vector2i(8, 3)]
const PAY_Q := [Vector2i(10, 7), Vector2i(9, 7), Vector2i(8, 7), Vector2i(11, 7)]


func _init() -> void:
	id = "phones"
	name = "Best plan"
	place = "CellPoint · store"
	pay = "commission"
	pct = 0.04
	start = Vector2i(5, 4)
	boss_at = Vector2i(1, 7)
	hour = 13
	react = {"great": "Happy customers! They’ll come back and bring their friends.", "ok": "Good numbers. Keep it up.", "poor": "Customers left on the wrong plans. That costs us."}
	th = {"gentle": [0.8, 0.7, 0.72, 0.5], "real": [0.78, 0.66, 0.72, 0.5]}
	controls = ["At the plan desk: sell the cheapest plan that covers the data AND the calling the customer needs.",
		"At the accessory wall: find the case made for their phone model.",
		"Ring everyone up at the till. Your commission is 4%. Oversold plans get cancelled, and the commission comes back off."]
	tips = {"small": "Check both numbers: enough data, and unlimited calling if they call a lot.",
		"upsell": "The cheapest plan that covers them is the right one. A bigger plan gets cancelled next month.",
		"case": "Match the case to the exact model: a Pro or a mini is a different size.",
		"monthly": "Monthly bill = plan + phone price ÷ 24.", "wait": "Keep the desk moving: plan customers give up if nobody helps."}
	room_map = {"name": place, "w": 13, "h": 9, "room": {"floor": "wood", "wall": "#e6eef0", "exit": 6, "windows": [6]},
		"props": [
			{"k": "desk", "x": 2, "y": 4, "w": 3, "id": "desk", "label": "Plan desk", "solid": true},
			{"k": "display", "x": 5, "y": 2, "w": 3, "solid": true}, {"k": "display", "x": 6, "y": 5, "w": 2, "solid": true},
			{"k": "shelf", "x": 10, "y": 2, "w": 2, "id": "acc", "label": "Accessory wall", "color": "#1f5f6b", "solid": true},
			{"k": "counter", "x": 10, "y": 6, "w": 2, "color": "#1f5f6b", "solid": true}, {"k": "register", "x": 11, "y": 6, "id": "till", "label": "Till", "solid": true},
			{"k": "tag", "x": 2, "y": 4, "w": 3, "title": "PLANS", "color": "#1f5f6b"}, {"k": "tag", "x": 10, "y": 2, "w": 2, "title": "CASES"},
			{"k": "tag", "x": 10, "y": 6, "w": 2, "title": "TILL"}, {"k": "plant", "x": 1, "y": 2, "solid": true}, {"k": "mat", "x": 6, "y": 7}]}
	stations = {"desk": {"stand": Vector2i(3, 3), "tile": Vector2i(3, 4)}, "acc": {"stand": Vector2i(10, 3), "tile": Vector2i(10, 2)},
		"till": {"stand": Vector2i(11, 5), "tile": Vector2i(11, 6)}}


func twists() -> Array:
	return [
		{"name": "First shift", "line": "Mr. Singh shows you the plan desk. Only plan customers today.", "rate": 0.7, "acc": 0.0},
		{"name": "A normal day", "line": "Plans at the desk, cases at the wall.", "acc": 0.35},
		{"name": "January", "line": "January is slow for sales. Every customer counts.", "acc": 0.35, "rate": 0.8},
		{"name": "Callers", "line": "Lots of people who call a lot: check whether they need unlimited calling.", "acc": 0.3, "calls": 0.6},
		{"name": "New phones", "line": "The new phones are out. Some customers pay for a phone over 24 months.", "acc": 0.3, "finance": 0.5},
		{"name": "Push the big plans", "line": "Mr. Singh wants big plans sold today. Customers still need the right plan.", "acc": 0.3, "push": true},
		{"name": "Holiday shopping", "line": "Holiday shopping: the store is packed.", "acc": 0.4, "rate": 1.1},
		{"name": "Back to school", "line": "Back-to-school week: students need plans and cases.", "acc": 0.45, "rate": 1.0}]


func setup(st: Dictionary) -> void:
	st.next = 1.0
	st.sales = 0
	st.chargebacks = []


func _plan(i: int, calls: bool) -> Dictionary:
	return {"i": i, "gb": GB[i], "calls": calls, "price": PRICE[i] + (CALLS if calls else 0)}


func tick(st: Dictionary, dt: float) -> void:
	st.next = float(st.next) - dt * busy(st) * float(tw(st, "rate", 1.0))
	if st.next <= 0.0:
		st.next = (8.6 if not st.real else 8.2) * (0.75 + 0.5 * rnd(st))
		st.demand = int(st.demand) + 1
		if rnd(st) < float(tw(st, "acc", 0.35)) and custs(st, "acc").size() < ACC_SPOTS.size():
			var c := add_cust(st, {"state": "acc", "phone": irand(st, 0, PHONES.size() - 1), "pat0": 38.0 if not st.real else 30.0})
			c.pat = c.pat0
			c.bub = "q"
		elif custs(st, "desk").size() < DESK_Q.size():
			var i := irand(st, 1, 5)
			var calls := rnd(st) < float(tw(st, "calls", 0.3 if st.real else 0.0))
			var c := add_cust(st, {"state": "desk", "gb": irand(st, GB[i - 1] + 1, GB[i]), "calls": calls, "right": i, "step": "plan",
				"phone": irand(st, 0, PHONES.size() - 1) if rnd(st) < float(tw(st, "finance", 0.0)) else -1, "pat0": 42.0 if not st.real else 34.0})
			c.pat = c.pat0
			c.bub = "q"
		else:
			lose(st, DESK_Q[-1], "wait", "The store was packed. A customer gave up and left.")
	for c in st.cust.duplicate():
		if c.state in ["desk", "acc", "pay"]:
			var head: bool = (c.state == "desk" and st.at == "desk" and custs(st, "desk").find(c) == 0)
			c.pat = float(c.pat) - dt * (0.5 if head else 1.0)
			c.ring = float(c.pat) / float(c.pat0)
			if c.pat <= 0.0:
				drop(st, c)
				lose(st, Vector2i(c.x, c.y), "wait", "A customer waited too long and walked out.")
	line_up(custs(st, "desk"), DESK_Q)
	line_up(custs(st, "acc"), ACC_SPOTS)
	line_up(custs(st, "pay"), PAY_Q)
	for cb in st.chargebacks.duplicate():
		if float(st.t) >= float(cb.at) or float(st.t) + dt >= float(st.len):
			st.chargebacks.erase(cb)
			st.money = int(st.money) - int(cb.com)
			oops(st, stations.desk.tile, cb.why, cb.msg)


func _need_text(c: Dictionary) -> String:
	var t := "\"I use about %d GB a month" % int(c.gb)
	t += ", and I call my family a lot.\"" if c.calls else ". I barely make calls.\""
	return t


func _options(st: Dictionary, c: Dictionary) -> Array:
	var i := int(c.right)
	var calls: bool = c.calls
	var right := _plan(i, calls)
	right.kind = "right"
	var small := _plan(i, false) if calls and (int(c.id) % 2 == 0) else _plan(i - 1, calls)
	small.kind = "small"
	var big := _plan(mini(GB.size() - 1, i + 1 + int(c.id) % 2), calls or (st.real and int(c.id) % 3 == 0))
	big.kind = "big"
	var out := [right, small, big]
	if st.real:
		var big2 := _plan(mini(GB.size() - 1, i + 2), true)
		big2.kind = "big"
		if big2.price != big.price:
			out.append(big2)
	var k := int(c.id) % out.size()
	return out.slice(k) + out.slice(0, k)


func card(st: Dictionary) -> Dictionary:
	var sid := str(st.at)
	if sid == "desk":
		var q := custs(st, "desk")
		if q.is_empty():
			return {"title": "Plan desk", "lines": ["Nobody at the desk."], "opts": []}
		var c: Dictionary = q[0]
		if c.step == "bill":
			var plan: Dictionary = c.plan
			var ph := 96000
			var right: int = int(plan.price) + ph / 24
			var choices := [right, int(plan.price), int(plan.price) + ph / 12]
			var opts := []
			for k in 3:
				var v: int = choices[(k + int(c.id)) % 3]
				opts.append({"t": "%s a month" % cash(v), "a": "bill:%d" % v})
			return {"title": "Plan desk · the monthly bill", "lines": ["Plan: %s a month. Phone: the %s, %s over 24 months." % [cash_w(plan.price), PHONES[int(c.phone)], cash_w(ph)], "What will their monthly bill be?"], "opts": opts, "cols": 3}
		var opts := []
		for o in _options(st, c):
			var label := "%d GB%s · %s/mo" % [int(o.gb), " + unlimited calls" if o.calls else "", cash_w(o.price)]
			if tw(st, "push", false) and o.kind == "big":
				label += " · Boss's pick"
			opts.append({"t": label, "a": "plan:%d:%d" % [int(o.i), 1 if o.calls else 0]})
		return {"title": "Plan desk", "lines": [_need_text(c), "Plans: data a month, calling, and the monthly price."], "opts": opts, "cols": 2}
	if sid == "acc":
		var q := custs(st, "acc")
		if q.is_empty():
			return {"title": "Accessory wall", "lines": ["Nobody looking for a case."], "opts": []}
		var c: Dictionary = q[0]
		var p := int(c.phone)
		var near := [p, p ^ 1, (p + 2) % PHONES.size(), (p + 4) % PHONES.size()]   # the twin model (Pro / mini) is the trap
		var opts := []
		var k := int(c.id) % near.size()
		for i in near.size():
			var m: int = near[(i + k) % near.size()]
			opts.append({"t": "Case for the %s · %s" % [PHONES[m], cash_w(CASE_PRICE)], "a": "case:%d" % m})
		return {"title": "Accessory wall", "lines": ["\"I need a case for my %s.\"" % PHONES[p]], "opts": opts, "cols": 2}
	if sid == "till":
		var q := custs(st, "pay")
		if q.is_empty():
			return {"title": "Till", "lines": ["Nobody waiting to pay."], "opts": []}
		var c: Dictionary = q[0]
		return {"title": "Till", "lines": [str(c.what), "Commission: 4%% of %s" % cash(c.base)], "opts": [{"t": "Ring it up", "a": "ring", "k": "primary"}], "cols": 1}
	return {}


func act(st: Dictionary, a: String) -> void:
	var sid := str(st.at)
	if sid == "desk":
		var q := custs(st, "desk")
		if q.is_empty():
			return
		var c: Dictionary = q[0]
		var at: Vector2i = stations.desk.tile
		if a.begins_with("plan:") and c.step == "plan":
			var v := a.split(":")
			var o := _plan(int(v[1]), v[2] == "1")
			var right := _plan(int(c.right), c.calls)
			c.plan = o
			if o.gb < int(c.gb) or (c.calls and not o.calls):
				drop(st, c)
				oops(st, at, "small", "Too small: they ran out of %s in a week. They're back, and they're not happy." % ("data" if o.gb < int(c.gb) else "calling minutes"))
				return
			if int(o.price) > int(right.price):
				c.oversold = true
			if int(c.phone) >= 0:
				c.step = "bill"
				return
			_to_till(st, c)
			return
		if a.begins_with("bill:") and c.step == "bill":
			var v := int(a.substr(5))
			if v != int(c.plan.price) + 96000 / 24:
				drop(st, c)
				oops(st, at, "monthly", "That's not their bill: plan %s + phone %s = %s a month." % [cash_w(c.plan.price), cash(96000 / 24), cash(int(c.plan.price) + 96000 / 24)])
				return
			_to_till(st, c)
		return
	if sid == "acc" and a.begins_with("case:"):
		var q := custs(st, "acc")
		if q.is_empty():
			return
		var c: Dictionary = q[0]
		if int(a.substr(5)) != int(c.phone):
			drop(st, c)
			oops(st, stations.acc.tile, "case", "That case doesn't fit a %s. They put it back and leave." % PHONES[int(c.phone)])
			return
		c.state = "pay"
		c.what = "Case for the %s: %s" % [PHONES[int(c.phone)], cash_w(CASE_PRICE)]
		c.base = CASE_PRICE
		c.pat = c.pat0
		c.bub = "cash"
		return
	if sid == "till" and a == "ring":
		var q := custs(st, "pay")
		if q.is_empty():
			return
		var c: Dictionary = q[0]
		var com := roundi(float(c.base) * pct)
		st.sales = int(st.sales) + int(c.base)
		st.money = int(st.money) + com
		drop(st, c)
		if c.get("oversold", false):
			pop(st, stations.till.tile, "+%s (4%%)" % cash(com), true)
			st.chargebacks.append({"at": float(st.t) + 14.0 + rnd(st) * 8.0, "com": com, "why": "upsell",
				"msg": "A customer cancelled: the plan was bigger than they needed. Your %s commission is taken back." % cash(com)})
			st.msg = "Sold... a bigger plan than they need."
		else:
			win(st, stations.till.tile, "+%s (4%%)" % cash(com), "Sold! Your 4%% commission: %s." % cash(com))


func _to_till(st: Dictionary, c: Dictionary) -> void:
	c.state = "pay"
	c.what = "%d GB plan%s: %s a month × 12 months" % [int(c.plan.gb), " + calls" if c.plan.calls else "", cash_w(c.plan.price)]
	c.base = int(c.plan.price) * 12
	c.pat = c.pat0
	c.bub = "cash"


func best(st: Dictionary) -> Dictionary:
	var pay_n := custs(st, "pay").size()
	var desk := custs(st, "desk")
	var acc := custs(st, "acc")
	var urgent_acc: bool = acc.size() > 0 and float(acc[0].pat) < 14.0
	if pay_n >= 2 or (pay_n > 0 and float(custs(st, "pay")[0].pat) < 12.0) or (pay_n > 0 and desk.is_empty() and acc.is_empty()):
		return {"go": "till", "a": "ring" if st.at == "till" else "", "think": 0.8}
	if acc.size() and (desk.is_empty() or urgent_acc):
		return {"go": "acc", "a": ("case:%d" % int(acc[0].phone)) if st.at == "acc" else "", "think": 1.6}
	if desk.size():
		var c: Dictionary = desk[0]
		if st.at != "desk":
			return {"go": "desk"}
		if c.step == "bill":
			return {"go": "desk", "a": "bill:%d" % (int(c.plan.price) + 96000 / 24), "think": 2.2}
		return {"go": "desk", "a": "plan:%d:%d" % [int(c.right), 1 if c.calls else 0], "think": 2.4}
	if pay_n > 0:
		return {"go": "till", "a": "ring" if st.at == "till" else "", "think": 0.8}
	return {}


func actions(st: Dictionary) -> Array:
	return card(st).get("opts", []).map(func(o): return o.a)


func pending(st: Dictionary) -> int:
	return st.cust.size() + st.chargebacks.size()


func tally(st: Dictionary) -> Array:
	return [["Waiting", str(custs(st, "desk").size() + custs(st, "acc").size())], ["To pay", str(custs(st, "pay").size())], ["Commission", cash(st.money)]]


func earn_line(st: Dictionary) -> String:
	return "You sold %s in plans and cases. Your 4%% commission: %s, on top of your hourly wage. In a slow month, commission drops." % [cash(st.sales), cash(maxi(0, int(st.money)))]
