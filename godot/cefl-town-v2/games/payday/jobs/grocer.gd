# Valley Market (grocery clerk, wage): Till rush. Shoppers take things off three shelves, then line up at the till.
# Ring them up: card payments are one tap; cash needs the right change, and cash totals round to the nearest 5¢
# (Canada has no pennies: ends in 1–2 round down, 3–4 up to 5, 6–7 down to 5, 8–9 up). Gentle shows the rounded total and
# the change due; Real shows the till total and the bill, and you work out the rest. Shelves run low: take the right crate
# from the back room and stock them, or shoppers leave without buying. Spills (shift 6): get the mop and walk over the spill.
extends "res://games/payday/jobs/job.gd"

const DENOMS := [2000, 1000, 500, 200, 100, 25, 10, 5]
const AISLES := {"produce": "Produce", "dairy": "Dairy", "cans": "Canned goods"}
const QUEUE := [Vector2i(2, 5), Vector2i(3, 5), Vector2i(4, 5), Vector2i(4, 6), Vector2i(5, 6), Vector2i(3, 6)]
const SPILLS := [Vector2i(6, 4), Vector2i(8, 5), Vector2i(10, 4), Vector2i(7, 6)]
const CAP := 4


func _init() -> void:
	id = "grocer"
	name = "Till rush"
	place = "Valley Market · shop floor"
	pay = "wage"
	start = Vector2i(4, 3)
	boss_at = Vector2i(1, 6)
	hour = 16
	react = {"great": "Look at that! Customers are smiling. Very good.", "ok": "Good, steady work. Thank you.", "poor": "Hmm. The line got long today, and some change was wrong."}
	th = {"gentle": [0.8, 0.72, 0.55, 0.4], "real": [0.78, 0.68, 0.55, 0.4]}
	controls = ["Walk to the till and ring up the person at the front. Cash needs the right change.",
		"When a shelf runs low, take the matching crate from the back room and stock it.",
		"Space or a tap works at any station. Number keys press the buttons on the work card."]
	tips = {"change": "Count change up from the total: coins first to the next dollar, then bills.",
		"round": "Cash totals round to 5¢: 1–2 round down, 3–4 up to 5, 6–7 down to 5, 8–9 up.",
		"line": "Watch the line. When it grows, stay at the till and let a shelf wait.",
		"empty": "A shelf at 1 is about to run out. Stock it before it hits 0.",
		"crate": "Match the crate to the shelf: the sign over each shelf says what goes there.",
		"spill": "Mop a spill right away. Someone slips every few seconds it stays."}
	room_map = {"name": place, "w": 13, "h": 9, "room": {"floor": "tile", "wall": "#eef0e0", "exit": 6, "windows": [3, 9]},
		"props": [
			{"k": "counter", "x": 1, "y": 4, "w": 3, "color": "#6f8f62", "solid": true},
			{"k": "register", "x": 2, "y": 4, "id": "till", "label": "Till", "solid": true},
			{"k": "produce", "x": 5, "y": 2, "solid": true}, {"k": "produce", "x": 6, "y": 2, "id": "produce", "label": "Produce", "solid": true},
			{"k": "shelf", "x": 7, "y": 2, "w": 2, "id": "dairy", "label": "Dairy", "color": "#dfe6ea", "solid": true},
			{"k": "shelf", "x": 9, "y": 2, "w": 2, "id": "cans", "label": "Canned goods", "solid": true},
			{"k": "crate", "x": 11, "y": 4, "solid": true}, {"k": "crate", "x": 11, "y": 5, "id": "stock", "label": "Back room", "solid": true},
			{"k": "mop", "x": 11, "y": 7, "id": "mop", "label": "Mop", "solid": true},
			{"k": "tag", "x": 2, "y": 4, "title": "TILL"}, {"k": "tag", "x": 5, "y": 2, "w": 2, "title": "PRODUCE"},
			{"k": "tag", "x": 7, "y": 2, "w": 2, "title": "DAIRY"}, {"k": "tag", "x": 9, "y": 2, "w": 2, "title": "CANS"},
			{"k": "tag", "x": 11, "y": 4, "h": 2, "title": "STOCK"},
			{"k": "plant", "x": 1, "y": 7, "solid": true}, {"k": "mat", "x": 6, "y": 7}]}
	stations = {"till": {"stand": Vector2i(2, 3), "tile": Vector2i(2, 4)}, "produce": {"stand": Vector2i(5, 3), "tile": Vector2i(5, 2)},
		"dairy": {"stand": Vector2i(7, 3), "tile": Vector2i(7, 2)}, "cans": {"stand": Vector2i(9, 3), "tile": Vector2i(9, 2)},
		"stock": {"stand": Vector2i(10, 4), "tile": Vector2i(11, 4)}, "mop": {"stand": Vector2i(10, 7), "tile": Vector2i(11, 7)}}


func twists() -> Array:
	return [
		{"name": "First shift", "line": "Mr. Huang shows you the till. Most people pay by card today.", "cash": 0.25, "rate": 0.75},
		{"name": "Cash day", "line": "The card machine keeps freezing, so most people pay cash.", "cash": 0.75},
		{"name": "Coupon day", "line": "A quiet day. Some shoppers bring $1 or $2 coupons: take them off before you count change.", "cash": 0.6, "coupon": 0.45, "rate": 0.8},
		{"name": "Truck day", "line": "The truck came late. Shelves empty fast, so keep an eye on the stock.", "cash": 0.45, "take": 2},
		{"name": "Big bills", "line": "Mr. Huang is watching the till today. Some people pay with $50 bills.", "cash": 0.6, "big": true},
		{"name": "Clean-up in aisle 2", "line": "Spills today. Grab the mop and walk over a spill before someone slips.", "cash": 0.5, "spill": true},
		{"name": "Exam week", "line": "Exam week: a short shift. The rush still comes.", "cash": 0.5, "len": 90.0},
		{"name": "Holiday rush", "line": "The holiday rush. The line never stops.", "cash": 0.5, "rate": 1.4}]


func setup(st: Dictionary) -> void:
	st.stock = {"produce": CAP, "dairy": CAP, "cans": CAP}
	st.low = {}
	st.next = 1.5
	st.tray = []
	st.spill = null
	st.spill_at = 0.0
	st.next_spill = 18.0
	st.sales = 0


func round5(c: int) -> int:
	return roundi(float(c) / 5.0) * 5


func tick(st: Dictionary, dt: float) -> void:
	var real: bool = st.real
	st.next = float(st.next) - dt * busy(st) * float(tw(st, "rate", 1.0))
	if st.next <= 0.0:
		st.next = (5.4 if real else 6.4) * (0.75 + 0.5 * rnd(st))
		var line := custs(st, "line").size()
		var aisle: String = pick(st, AISLES.keys())
		var c := add_cust(st, {"state": "shop", "aisle": aisle, "wait": 4.5 + rnd(st) * 4.0, "pat0": 12.0 if not real else 9.0})
		c.x = int(stations[aisle].stand.x) + irand(st, 0, 1)
		c.y = 3 + irand(st, 0, 1)
		st.demand = int(st.demand) + 1
		if line >= QUEUE.size():
			drop(st, c)
			lose(st, QUEUE[-1], "line", "The line was too long. A shopper put the basket down and left.")
	for c in st.cust.duplicate():
		match str(c.state):
			"shop":
				c.wait = float(c.wait) - dt
				if c.wait <= 0.0:
					var n := int(st.stock[c.aisle])
					if n <= 0:
						c.state = "empty"
						c.pat = float(c.pat0)
						c.bub = "box"
					else:
						_take(st, c)
			"empty":
				c.pat = float(c.pat) - dt
				c.ring = float(c.pat) / float(c.pat0)
				if int(st.stock[c.aisle]) > 0:
					c.bub = ""
					c.ring = -1.0
					_take(st, c)
				elif c.pat <= 0.0:
					drop(st, c)
					lose(st, Vector2i(c.x, c.y), "empty", "%s was empty, so a shopper left without buying." % AISLES[c.aisle])
			"line":
				var head: bool = _line(st).find(c) == 0
				c.pat = float(c.pat) - dt * (0.5 if head and st.at == "till" else 1.0)
				c.ring = float(c.pat) / float(c.pat0)
				if c.pat <= 0.0:
					if head:
						st.tray = []
					drop(st, c)
					lose(st, Vector2i(c.x, c.y), "line", "Someone waited too long in line and left.")
	line_up(_line(st), QUEUE)
	# spills
	if tw(st, "spill", false):
		if st.spill == null:
			st.next_spill = float(st.next_spill) - dt
			if st.next_spill <= 0.0:
				st.spill = pick(st, SPILLS)
				st.spill_at = 0.0
				st.demand = int(st.demand) + 1
		else:
			st.spill_at = float(st.spill_at) + dt
			if st.carry == "mop" and st.me == st.spill:
				win(st, st.spill, "+1", "Mopped. Nobody slipped.")
				st.spill = null
				st.next_spill = 16.0 + rnd(st) * 8.0
			elif st.spill_at >= (9.0 if not real else 7.0):
				lose(st, st.spill, "spill", "Someone slipped on the spill. They're okay, but they went home.")
				st.spill_at = 0.0


func _take(st: Dictionary, c: Dictionary) -> void:
	var a: String = c.aisle
	st.stock[a] = maxi(0, int(st.stock[a]) - int(tw(st, "take", 1)))
	if int(st.stock[a]) <= 1 and not st.low.has(a):
		st.low[a] = true
		st.demand = int(st.demand) + 1
	c.state = "line"
	c.pat0 = 38.0 if not st.real else 30.0
	c.pat = c.pat0
	var raw := irand(st, 300, 4800)
	var cash_pay := rnd(st) < float(tw(st, "cash", 0.5))
	c.pay = "cash" if cash_pay else "card"
	c.raw = raw
	c.coupon = (100 if rnd(st) < 0.5 else 200) if cash_pay and rnd(st) < float(tw(st, "coupon", 0.0)) else 0
	var due := round5(raw - int(c.coupon))
	if not st.real and cash_pay:   # Gentle: whole quarters, so the change is friendlier
		due = roundi(float(raw - int(c.coupon)) / 25.0) * 25
		c.raw = due + int(c.coupon)
	c.due = due
	var bills := []
	for b in [500, 1000, 2000, 5000]:
		if b > due and (b < 5000 or due >= 2000 or bool(tw(st, "big", false))):
			bills.append(b)
	c.paid = bills[0]
	if bills.size() > 1 and rnd(st) >= 0.6:
		c.paid = bills[1]
	if tw(st, "big", false) and due > 1000 and rnd(st) < 0.6:
		c.paid = 5000
	c.bub = "cash" if cash_pay else "card"


func _line(st: Dictionary) -> Array:
	return custs(st, "line")


func _head(st: Dictionary) -> Variant:
	var l := _line(st)
	return l[0] if l.size() else null


func on_at(st: Dictionary, sid: String) -> void:
	st.at = sid
	if AISLES.has(sid) and str(st.carry).begins_with("crate:"):
		var a: String = str(st.carry).substr(6)
		var at: Vector2i = stations[sid].tile
		if a != sid:
			oops(st, at, "crate", "That's the %s crate. This shelf is %s." % [AISLES[a].to_lower(), AISLES[sid].to_lower()])
			return
		var was := int(st.stock[sid])
		st.stock[sid] = CAP
		st.carry = ""
		if st.low.has(sid):
			st.low.erase(sid)
			win(st, at, "+1", "%s is stocked." % AISLES[sid])
		else:
			st.msg = "%s is full again (it had %d)." % [AISLES[sid], was]
		return
	if sid == "mop":
		st.carry = "" if st.carry == "mop" else "mop"
		st.msg = "You have the mop. Walk over the spill." if st.carry == "mop" else "Mop back in the corner."


func card(st: Dictionary) -> Dictionary:
	match str(st.at):
		"till":
			var c = _head(st)
			if c == null:
				return {"title": "Till", "lines": ["Nobody in line right now."], "opts": []}
			if c.pay == "card":
				return {"title": "Till · paying by card", "lines": ["Total: %s" % cash(c.raw)], "opts": [{"t": "Card approved: next!", "a": "card"}], "cols": 1}
			var given := 0
			for d in st.tray:
				given += int(d)
			var L := []
			if st.real:
				L.append("Till total: %s%s" % [cash(c.raw), ("   ·   Coupon: −%s" % cash(c.coupon)) if int(c.coupon) else ""])
				L.append("They hand you %s." % cash_w(c.paid))
			else:
				L.append("Cash total: %s%s   ·   Paid: %s" % [cash(c.due), (" (after a %s coupon)" % cash(c.coupon)) if int(c.coupon) else "", cash_w(c.paid)])
				L.append("Change due: %s" % cash(int(c.paid) - int(c.due)))
			L.append("Your change so far: %s" % (cash(given) if st.tray.size() else "nothing yet"))
			var opts := []
			for d in DENOMS:
				opts.append({"t": cash_w(d) if d >= 100 else "%d¢" % d, "a": "d%d" % d})
			opts.append({"t": "Start over", "a": "clear"})
			opts.append({"t": "Give change", "a": "give", "k": "primary"})
			return {"title": "Till · paying cash", "lines": L, "opts": opts, "cols": 5}
		"stock":
			return {"title": "Back room", "lines": ["Take a crate to the shelf that needs it."] + (["You're holding the %s crate." % AISLES[str(st.carry).substr(6)].to_lower()] if str(st.carry).begins_with("crate:") else []),
				"opts": [{"t": "Produce crate", "a": "crate:produce"}, {"t": "Dairy crate", "a": "crate:dairy"}, {"t": "Canned goods crate", "a": "crate:cans"}], "cols": 3}
		"produce", "dairy", "cans":
			var n := int(st.stock[st.at])
			return {"title": AISLES[st.at], "lines": ["%d of %d left on the shelf." % [n, CAP]] + ([] if n > 1 else ["Get the %s crate from the back room." % AISLES[st.at].to_lower()]), "opts": []}
	return {}


func act(st: Dictionary, a: String) -> void:
	if a.begins_with("crate:"):
		if st.at == "stock":
			st.carry = a
			st.msg = "Got the %s crate. Take it to its shelf." % AISLES[a.substr(6)].to_lower()
		return
	if st.at != "till":
		return
	var c = _head(st)
	if c == null:
		return
	var at: Vector2i = stations.till.tile
	if a == "card" and c.pay == "card":
		_sold(st, c, at, "Card payment done.")
		return
	if c.pay != "cash":
		return
	if a.begins_with("d"):
		if st.tray.size() < 14:
			st.tray.append(int(a.substr(1)))
		return
	if a == "clear":
		st.tray = []
		return
	if a == "give" and st.tray.size():
		var given := 0
		for d in st.tray:
			given += int(d)
		var want := int(c.paid) - int(c.due)
		if given == want:
			_sold(st, c, at, "Right change. Next!")
		else:
			var raw_change := int(c.paid) - (int(c.raw) - int(c.coupon))
			var why := "round" if st.real and given == raw_change and raw_change != want else "change"
			oops(st, at, why, "The change was %s, and you gave %s.%s" % [cash(want), cash(given), " Cash totals round to 5¢." if why == "round" else ""])
			st.tray = []
			c.state = "done"
			drop(st, c)


func _sold(st: Dictionary, c: Dictionary, at: Vector2i, msg: String) -> void:
	st.sales = int(st.sales) + int(c.due)
	st.tray = []
	drop(st, c)
	win(st, at, "+1", msg)


func best(st: Dictionary) -> Dictionary:
	if st.spill != null and st.carry == "mop":
		return {"go": "@%d,%d" % [st.spill.x, st.spill.y]}
	if str(st.carry).begins_with("crate:"):
		return {"go": str(st.carry).substr(6)}
	var c = _head(st)
	var line := _line(st).size()
	var low := ""
	var waiting := false
	for a in AISLES:
		if int(st.stock[a]) <= 0 and custs(st, "empty").any(func(x): return x.aisle == a):
			low = a
			waiting = true
		elif low == "" and int(st.stock[a]) <= 1:
			low = a
	if st.at == "till" and c != null and not (waiting and line <= 1):
		return {"go": "till", "a": _till_move(st, c), "think": 0.5 if st.tray.size() else 1.4}
	if waiting:
		return _get_crate(st, low)
	if st.spill != null:
		return {"go": "mop"}
	if c != null:
		return {"go": "till", "a": _till_move(st, c) if st.at == "till" else "", "think": 1.4}
	if low != "":
		return _get_crate(st, low)
	for a in AISLES:
		if int(st.stock[a]) <= 2:
			return _get_crate(st, a)
	return {"go": "till"} if st.me != stations.till.stand else {}


func _get_crate(st: Dictionary, a: String) -> Dictionary:
	return {"go": "stock", "a": "crate:" + a if st.at == "stock" else "", "think": 0.7}


func _till_move(st: Dictionary, c: Dictionary) -> String:
	if c.pay == "card":
		return "card"
	var given := 0
	for d in st.tray:
		given += int(d)
	var want := int(c.paid) - int(c.due)
	if given == want:
		return "give"
	if given > want:
		return "clear"
	for d in DENOMS:
		if d <= want - given:
			return "d%d" % d
	return "clear"


func actions(st: Dictionary) -> Array:
	var cd := card(st)
	return cd.get("opts", []).map(func(o): return o.a)


func marks(st: Dictionary) -> Array:
	var out := []
	for a in AISLES:
		var n := int(st.stock[a])
		if n <= 1:
			out.append({"x": stations[a].tile.x, "y": stations[a].tile.y, "bub": "box", "ring": float(n) / float(CAP)})
	if st.spill != null:
		out.append({"x": st.spill.x, "y": st.spill.y, "bub": "drop", "ring": 1.0 - float(st.spill_at) / (7.0 if st.real else 9.0), "floor": true})
	return out


func pending(st: Dictionary) -> int:
	return st.cust.size() + st.low.size() + (1 if st.spill != null else 0)


func tally(st: Dictionary) -> Array:
	return [["In line", str(_line(st).size())], ["Rung up", str(st.good)], ["Sales", cash_w(st.sales)]]


func earn_line(st: Dictionary) -> String:
	return "You rang up %s today. On a wage, your pay is your hours times your hourly rate, however much the store sells." % cash(st.sales)
