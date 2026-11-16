# Northside Sports (sales helper, wage + 2% commission): Gear match. Customers sit on a try-on bench and ask for an item and a
# size. Ask them (walk up to the bench), fetch the right box from the stockroom (you can carry 2), and let them try it on.
# Then ring them up at the till: your commission is 2% of what they pay. The stockroom also has the Pro model: it pays more
# commission, but the customer didn't ask for it, so it comes back as a return and the commission is taken back. A wrong size
# or item comes straight back too. Shift 3: a January sale (25% off at the till). Shift 5: helmets, sized by head (cm).
extends "res://games/payday/jobs/job.gd"

const GEAR := [["Hockey skates", "Skates", 12000, 18000], ["Soccer cleats", "Cleats", 8000, 13000], ["Basketball shoes", "Hoops", 11000, 16000],
	["Running shoes", "Runners", 9500, 15000], ["Ski boots", "Ski boots", 18000, 26000]]
const HELMET := ["Bike helmet", "Helmet", 6000, 9000]
const SIZES_H := [["S", 51, 55], ["M", 55, 59], ["L", 59, 63]]
const BENCHES := {"b1": {"tile": Vector2i(2, 5), "stand": Vector2i(3, 5)}, "b2": {"tile": Vector2i(5, 5), "stand": Vector2i(6, 5)},
	"b3": {"tile": Vector2i(8, 5), "stand": Vector2i(9, 5)}}
const DOOR_Q := [Vector2i(6, 7), Vector2i(7, 7), Vector2i(5, 7), Vector2i(4, 7)]
const PAY_Q := [Vector2i(10, 7), Vector2i(11, 7), Vector2i(9, 7), Vector2i(8, 7)]
const CARRY := 2


func _init() -> void:
	id = "sports"
	name = "Gear match"
	place = "Northside Sports · sales floor"
	pay = "commission"
	pct = 0.02
	start = Vector2i(6, 4)
	boss_at = Vector2i(1, 7)
	hour = 12
	react = {"great": "MVP! That was a championship shift!", "ok": "Solid game. Good effort out there.", "poor": "Tough game. Customers went home with the wrong gear."}
	th = {"gentle": [0.8, 0.7, 0.55, 0.4], "real": [0.78, 0.66, 0.55, 0.4]}
	controls = ["A customer on a bench with a ? bubble wants help: walk up and ask what they need.",
		"Get that box from the stockroom (you can carry 2), then bring it to their bench to try on.",
		"Ring them up at the till for your commission. Sell what they asked for: Pro models come back as returns."]
	tips = {"size": "Read the size on the bench card before you pick the box.", "item": "Match the item: skates, cleats and runners all come in the same sizes.",
		"upsell": "Sell what the customer needs. A Pro model they didn't ask for comes back, and so does the commission.",
		"wait": "Ask a new customer first, then fetch boxes for two at once.", "price": "25% off is a quarter off: take a quarter of the price away.",
		"helmet": "Helmet sizes go by head size: S 51–55 cm, M 55–59 cm, L 59–63 cm."}
	var props := [
		{"k": "shelf", "x": 1, "y": 2, "w": 3, "color": "#e9eef2", "solid": true}, {"k": "shelf", "x": 5, "y": 2, "w": 2, "color": "#2f3a5c", "solid": true},
		{"k": "shelf", "x": 10, "y": 2, "w": 2, "id": "stock", "label": "Stockroom", "color": "#8a6a4a", "solid": true},
		{"k": "counter", "x": 10, "y": 6, "w": 2, "color": "#2f3a5c", "solid": true}, {"k": "register", "x": 11, "y": 6, "id": "till", "label": "Till", "solid": true},
		{"k": "tag", "x": 1, "y": 2, "w": 3, "title": "SHOE WALL"}, {"k": "tag", "x": 5, "y": 2, "w": 2, "title": "HELMETS"},
		{"k": "tag", "x": 10, "y": 2, "w": 2, "title": "STOCKROOM", "color": "#6b4510"}, {"k": "tag", "x": 10, "y": 6, "w": 2, "title": "TILL"},
		{"k": "rug", "x": 2, "y": 4, "w": 8, "h": 2, "color": "#3f6fb0"}, {"k": "plant", "x": 11, "y": 4, "solid": true}, {"k": "mat", "x": 6, "y": 7}]
	for b in BENCHES:
		props.append({"k": "bench", "x": BENCHES[b].tile.x, "y": BENCHES[b].tile.y, "id": b, "label": "Try-on bench", "solid": true, "yaw": 0.0})
	room_map = {"name": place, "w": 13, "h": 9, "room": {"floor": "wood", "wall": "#e6ebee", "exit": 6, "windows": [8]}, "props": props}
	stations = {"stock": {"stand": Vector2i(10, 3), "tile": Vector2i(10, 2)}, "till": {"stand": Vector2i(11, 5), "tile": Vector2i(11, 6)}}
	for b in BENCHES:
		stations[b] = {"stand": BENCHES[b].stand, "tile": BENCHES[b].tile}


func twists() -> Array:
	return [
		{"name": "First shift", "line": "Coach Tam shows you the benches, the stockroom and the till. Only two benches open.", "rate": 0.7, "benches": 2},
		{"name": "Saturday", "line": "A normal Saturday. Customers want gear that fits."},
		{"name": "January sale", "line": "January is slow, so everything is 25% off. Work out the sale price at the till.", "rate": 0.8, "sale": true},
		{"name": "Team order", "line": "A hockey team is shopping: some customers want two items.", "two": 0.3, "rate": 0.85},
		{"name": "Helmet day", "line": "Bike season! Helmets go by head size: S 51–55 cm, M 55–59 cm, L 59–63 cm.", "helmet": 0.5},
		{"name": "Push the Pros", "line": "Coach Tam wants Pro models sold today. Customers still want what they asked for.", "pro": true},
		{"name": "Exam week", "line": "Exam week: a short shift.", "len": 90.0},
		{"name": "Holiday shopping", "line": "Holiday shopping: every bench is full.", "rate": 1.2}]


func setup(st: Dictionary) -> void:
	st.next = 1.0
	st.carry_boxes = []
	st.sales = 0
	st.returns = []
	st.benches = {}
	var n := int(tw(st, "benches", 3))
	var i := 0
	for b in BENCHES:
		st.benches[b] = {"open": i < n, "c": 0}
		i += 1


func _want(st: Dictionary) -> Dictionary:
	if rnd(st) < float(tw(st, "helmet", 0.0)):
		var head := irand(st, 52, 62)
		var sz := "S" if head < 55 else ("M" if head < 59 else "L")
		return {"g": -1, "size": sz, "head": head, "done": false, "boxed": false}
	return {"g": irand(st, 0, GEAR.size() - 1), "size": str(irand(st, 5, 11)), "done": false, "boxed": false}


func _gear(w: Dictionary) -> Array:
	return HELMET if int(w.g) < 0 else GEAR[int(w.g)]


func _want_text(w: Dictionary) -> String:
	if int(w.g) < 0:
		return "a bike helmet. My head is %d cm around" % int(w.head)
	return "%s, size %s" % [_gear(w)[0].to_lower(), w.size]


func tick(st: Dictionary, dt: float) -> void:
	st.next = float(st.next) - dt * busy(st) * float(tw(st, "rate", 1.0))
	if st.next <= 0.0:
		st.next = (11.5 if not st.real else 10.0) * (0.75 + 0.5 * rnd(st))
		var wants := [_want(st)]
		if rnd(st) < float(tw(st, "two", 0.0)):
			wants.append(_want(st))
		st.demand = int(st.demand) + wants.size()
		var c := add_cust(st, {"state": "door", "wants": wants, "pat0": 42.0 if not st.real else 34.0, "asked": false})
		c.pat = c.pat0
		if custs(st, "door").size() > DOOR_Q.size():
			drop(st, c)
			for w in wants:
				lose(st, DOOR_Q[0], "wait", "The store was packed. A customer gave up and left.")
	# sit down on a free bench
	for c in custs(st, "door"):
		for b in BENCHES:
			if st.benches[b].open and int(st.benches[b].c) == 0:
				st.benches[b].c = int(c.id)
				c.state = "bench"
				c.bench = b
				c.x = BENCHES[b].tile.x
				c.y = BENCHES[b].tile.y
				c.pat = c.pat0
				break
	line_up(custs(st, "door"), DOOR_Q)
	line_up(custs(st, "pay"), PAY_Q)
	for c in st.cust.duplicate():
		if c.state in ["door", "bench", "pay"]:
			c.pat = float(c.pat) - dt
			c.ring = float(c.pat) / float(c.pat0)
			c.bub = "q" if c.state == "bench" and not c.asked else ("cash" if c.state == "pay" else ("t:" + _short(c) if c.state == "bench" else ""))
			if c.pat <= 0.0:
				_leave(st, c)
				var left := 0
				for w in c.wants:
					if not w.done:
						left += 1
				for k in left:
					lose(st, Vector2i(c.x, c.y), "wait", "A customer waited too long and walked out.")
	# returns of Pro models, and any still to come when the shift ends
	for r in st.returns.duplicate():
		if float(st.t) >= float(r.at) or float(st.t) + dt >= float(st.len):
			st.returns.erase(r)
			st.sales = int(st.sales) - int(r.price)
			st.money = int(st.money) - int(roundi(float(r.price) * pct))
			oops(st, stations.till.tile, "upsell", "A Pro model came back: they only needed the regular one. Your %s commission is taken back." % cash(roundi(float(r.price) * pct)))


func _short(c: Dictionary) -> String:
	for w in c.wants:
		if not w.done:
			return ("%s %s" % [_gear(w)[1], w.size]) if int(w.g) >= 0 else "Helmet"
	return ""


func _leave(st: Dictionary, c: Dictionary) -> void:
	if c.has("bench") and st.benches.has(c.bench) and int(st.benches[c.bench].c) == int(c.id):
		st.benches[c.bench].c = 0
	drop(st, c)


func _bench_cust(st: Dictionary, b: String) -> Variant:
	var cid := int(st.benches[b].c)
	for c in st.cust:
		if int(c.id) == cid:
			return c
	return null


## The first order you have asked about and not yet brought a box for.
func _open_order(st: Dictionary) -> Variant:
	for c in st.cust:
		if c.state == "bench" and c.asked:
			for i in c.wants.size():
				var w: Dictionary = c.wants[i]
				if not w.done and not w.boxed:
					return [c, i]
	return null


func on_at(st: Dictionary, sid: String) -> void:
	st.at = sid
	if not BENCHES.has(sid):
		return
	var c = _bench_cust(st, sid)
	if c == null:
		return
	if not c.asked:
		c.asked = true
		c.pat = maxf(float(c.pat), float(c.pat0) * 0.8)
		st.msg = "\"I'd like %s, please.\"" % _want_text(c.wants[0]) if c.wants.size() == 1 else "\"We need %s, and %s.\"" % [_want_text(c.wants[0]), _want_text(c.wants[1])]
		return
	# try on what you carry for this customer
	for bx in st.carry_boxes.duplicate():
		if int(bx.c) != int(c.id):
			continue
		st.carry_boxes.erase(bx)
		var w: Dictionary = c.wants[int(bx.i)]
		w.boxed = false
		var at: Vector2i = BENCHES[sid].tile
		if int(bx.g) != int(w.g):
			oops(st, at, "item", "That's not what they asked for. They want %s." % _want_text(w))
		elif str(bx.size) != str(w.size):
			oops(st, at, "helmet" if int(w.g) < 0 else "size", "Wrong size: they need %s. Back to the stockroom." % ("a %s" % w.size if int(w.g) < 0 else "size %s" % w.size))
		else:
			w.done = true
			w.pro = bool(bx.pro)
			w.price = int(_gear(w)[3] if bx.pro else _gear(w)[2])
			st.msg = "It fits! They'll take it to the till." if not bx.pro else "They love the Pro model... it costs more than they planned."
	if c.wants.all(func(x): return x.done):
		_leave_bench(st, c)


func _leave_bench(st: Dictionary, c: Dictionary) -> void:
	if st.benches.has(c.bench):
		st.benches[c.bench].c = 0
	c.state = "pay"
	c.pat = c.pat0


func card(st: Dictionary) -> Dictionary:
	var sid := str(st.at)
	if BENCHES.has(sid):
		var c = _bench_cust(st, sid)
		if c == null:
			return {"title": "Try-on bench", "lines": ["Nobody here right now."], "opts": []}
		var L := []
		for w in c.wants:
			L.append(("✓ " if w.done else "• ") + _want_text(w).substr(0, 1).to_upper() + _want_text(w).substr(1) + ("" if w.done else " (box in hand)" if w.boxed else ""))
		return {"title": "Customer on the bench", "lines": L, "opts": []}
	if sid == "stock":
		var o = _open_order(st)
		var L := ["You're carrying %d of %d boxes." % [st.carry_boxes.size(), CARRY]]
		if o == null:
			L.append("No orders waiting. Ask a customer on a bench first.")
			return {"title": "Stockroom", "lines": L, "opts": []}
		var c: Dictionary = o[0]
		var w: Dictionary = c.wants[int(o[1])]
		L.append("Order: %s." % _want_text(w))
		var opts := []
		for b in _boxes(st, w, int(c.id) * 10 + int(o[1])):
			opts.append({"t": b.label, "a": "box:%d:%d:%d:%s:%d" % [int(c.id), int(o[1]), int(b.g), b.size, 1 if b.pro else 0]})
		return {"title": "Stockroom", "lines": L, "opts": opts, "cols": 2}
	if sid == "till":
		var q := custs(st, "pay")
		if q.is_empty():
			return {"title": "Till", "lines": ["Nobody waiting to pay."], "opts": []}
		var c: Dictionary = q[0]
		var total := 0
		var names := []
		for w in c.wants:
			total += int(w.price)
			names.append("%s %s" % [_gear(w)[1], cash_w(int(w.price))])
		if tw(st, "sale", false):
			var right := total * 3 / 4
			var opts := []
			var seed_ := int(c.id)
			var choices := [right, total - 2500 if total > 5000 else total * 9 / 10, total * 1 / 4]
			for k in 3:
				var v: int = choices[(k + seed_) % 3]
				opts.append({"t": "Charge %s" % cash(v), "a": "sale:%d" % v})
			return {"title": "Till · January sale, 25% off", "lines": [", ".join(names), "Regular total: %s. What do they pay?" % cash(total)], "opts": opts, "cols": 3}
		return {"title": "Till", "lines": [", ".join(names), "Total: %s" % cash(total)], "opts": [{"t": "Ring it up", "a": "ring", "k": "primary"}], "cols": 1}
	return {}


## The boxes on the shelf for one order: the right one, near sizes, the Pro model, and in Real another item.
func _boxes(st: Dictionary, w: Dictionary, seed_: int) -> Array:
	var g := int(w.g)
	var gear := _gear(w)
	var out := [{"g": g, "size": str(w.size), "pro": false}]
	if g < 0:
		for s in SIZES_H:
			if s[0] != w.size:
				out.append({"g": g, "size": s[0], "pro": false})
	else:
		var n := int(w.size)
		out.append({"g": g, "size": str(n + 1 if n < 11 else n - 2), "pro": false})
		out.append({"g": g, "size": str(n - 1 if n > 5 else n + 2), "pro": false})
		if st.real:
			out.append({"g": (g + 1 + seed_ % (GEAR.size() - 1)) % GEAR.size(), "size": str(n), "pro": false})
	out.append({"g": g, "size": str(w.size), "pro": true})
	for b in out:
		var gb: Array = HELMET if int(b.g) < 0 else GEAR[int(b.g)]
		b.label = "%s%s · %s · %s" % [gb[1], " PRO" if b.pro else "", ("size " + b.size) if int(b.g) >= 0 else b.size, cash_w(gb[3] if b.pro else gb[2])]
		if b.pro and tw(st, "pro", false):
			b.label += " · Coach's pick"
	# a steady order from the seed, so the right box is not always first
	var k := seed_ % out.size()
	return out.slice(k) + out.slice(0, k)


func act(st: Dictionary, a: String) -> void:
	if a.begins_with("box:") and st.at == "stock":
		if st.carry_boxes.size() >= CARRY:
			st.msg = "Your arms are full: 2 boxes. Take them out to the benches."
			return
		var v := a.split(":")
		for c in st.cust:
			if int(c.id) == int(v[1]) and c.state == "bench":
				c.wants[int(v[2])].boxed = true
				st.carry_boxes.append({"c": int(v[1]), "i": int(v[2]), "g": int(v[3]), "size": v[4], "pro": v[5] == "1"})
				st.msg = "Box in hand. Take it to the bench."
		return
	if st.at != "till":
		return
	var q := custs(st, "pay")
	if q.is_empty():
		return
	var c: Dictionary = q[0]
	var total := 0
	var pro_price := 0
	for w in c.wants:
		total += int(w.price)
		if w.get("pro", false):
			pro_price += int(w.price)
	var paid := total
	if a.begins_with("sale:"):
		paid = int(a.substr(5))
		if paid != total * 3 / 4:
			oops(st, stations.till.tile, "price", "That's not 25%% off. The sale price was %s." % cash(total * 3 / 4))
			drop(st, c)
			return
	elif a != "ring":
		return
	var com := roundi(float(paid) * pct)
	st.sales = int(st.sales) + paid
	st.money = int(st.money) + com
	drop(st, c)
	var ok_n := 0
	for w in c.wants:
		if not w.get("pro", false):
			ok_n += 1
	if pro_price > 0:
		st.returns.append({"at": float(st.t) + 16.0 + rnd(st) * 8.0, "price": roundi(float(pro_price) * float(paid) / float(total))})
	for k in ok_n:
		win(st, stations.till.tile, "+%s (2%%)" % cash(com), "Sold! Your 2%% commission: %s." % cash(com))
	if ok_n == 0:
		pop(st, stations.till.tile, "+%s (2%%)" % cash(com), true)
		st.msg = "Sold a Pro model. Commission: %s... for now." % cash(com)


func best(st: Dictionary) -> Dictionary:
	# 0) in the stockroom with room in your arms: take the next box too
	var o0 = _open_order(st)
	if st.at == "stock" and o0 != null and st.carry_boxes.size() < CARRY:
		var c0: Dictionary = o0[0]
		var w0: Dictionary = c0.wants[int(o0[1])]
		return {"go": "stock", "a": "box:%d:%d:%d:%s:0" % [int(c0.id), int(o0[1]), int(w0.g), w0.size], "think": 1.3}
	# 1) bring boxes in hand to their benches
	if st.carry_boxes.size():
		for c in st.cust:
			if int(c.id) == int(st.carry_boxes[0].c) and c.state == "bench":
				return {"go": c.bench, "think": 0.6}
		st.carry_boxes.pop_front()
	# 2) ring up anyone at the till when the line is long or nothing else is ready
	var pay_n := custs(st, "pay").size()
	var new_c = null
	for c in custs(st, "bench"):
		if not c.asked and (new_c == null or float(c.pat) < float(new_c.pat)):
			new_c = c
	var o = _open_order(st)
	if pay_n > 0 and (pay_n >= 2 or (new_c == null and o == null) or float(custs(st, "pay")[0].pat) < 10.0):
		return {"go": "till", "a": _till_a(st) if st.at == "till" else "", "think": 1.2}
	if new_c != null and (o == null or float(new_c.pat) < 14.0):
		return {"go": new_c.bench, "think": 0.8}
	if o != null:
		if st.at == "stock":
			var c: Dictionary = o[0]
			var w: Dictionary = c.wants[int(o[1])]
			return {"go": "stock", "a": "box:%d:%d:%d:%s:0" % [int(c.id), int(o[1]), int(w.g), w.size], "think": 1.3}
		return {"go": "stock"}
	if new_c != null:
		return {"go": new_c.bench, "think": 0.8}
	if pay_n > 0:
		return {"go": "till", "a": _till_a(st) if st.at == "till" else "", "think": 1.2}
	return {}


func _till_a(st: Dictionary) -> String:
	if not tw(st, "sale", false):
		return "ring"
	var q := custs(st, "pay")
	if q.is_empty():
		return ""
	var total := 0
	for w in q[0].wants:
		total += int(w.price)
	return "sale:%d" % (total * 3 / 4)


func actions(st: Dictionary) -> Array:
	return card(st).get("opts", []).map(func(o): return o.a)


func pending(st: Dictionary) -> int:
	var n := 0
	for c in st.cust:
		for w in c.wants:
			if c.state == "pay" or not w.done:
				n += 1
	return n


func tally(st: Dictionary) -> Array:
	var waiting := custs(st, "bench").size() + custs(st, "door").size()
	return [["Waiting", str(waiting)], ["Boxes", "%d/%d" % [st.carry_boxes.size(), CARRY]], ["Commission", cash(st.money)]]


func earn_line(st: Dictionary) -> String:
	return "You sold %s today. Your 2%% commission on that is %s, on top of your hourly wage. A slow day means less commission." % [cash(maxi(0, int(st.sales))), cash(maxi(0, int(st.money)))]
