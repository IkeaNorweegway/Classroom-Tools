# Home & Hearth (furniture sales, wage + 6% commission): Will it fit? A customer on the floor tells you the wall the sofa goes
# on and their budget. Walk to the sofas to read their tags, and show them one that fits the wall and the budget (any that
# fits is right). Over budget: they walk out. Too wide: it comes back after delivery, and so does the commission. Then write
# up the order at the desk: sofa + $79 delivery (Real adds 5% GST on the whole bill). Your commission is 6% of the sofa price.
# Shift 3: a 20% January sale. Shift 4: the sofa must also go through their door (its depth must be less than the door width).
extends "res://games/payday/jobs/job.gd"

const SOFAS := {"s1": {"tile": Vector2i(1, 2), "stand": Vector2i(2, 3), "color": "#6b7fa6"}, "s2": {"tile": Vector2i(4, 2), "stand": Vector2i(5, 3), "color": "#a0622c"},
	"s3": {"tile": Vector2i(7, 2), "stand": Vector2i(8, 3), "color": "#5aa86c"}, "s4": {"tile": Vector2i(9, 4), "stand": Vector2i(10, 5), "color": "#8a63c8"}}
const NAMES := ["Cloud sofa", "Prairie loveseat", "Maple sofa", "Comfy-Max couch", "Riverside sofa", "Snuggle sectional", "Classic three-seater", "Lake House sofa"]
const SPOTS := {"c1": Vector2i(3, 6), "c2": Vector2i(7, 6)}
const DESK_Q := [Vector2i(11, 7), Vector2i(10, 7), Vector2i(9, 7)]
const DELIVERY := 7900


func _init() -> void:
	id = "furniture"
	name = "Will it fit?"
	place = "Home & Hearth · showroom"
	pay = "commission"
	pct = 0.06
	start = Vector2i(6, 4)
	boss_at = Vector2i(1, 7)
	hour = 11
	react = {"great": "Every couch fit! You have a good eye, dear.", "ok": "Nice work, dear.", "poor": "Oh dear. Couches came back today."}
	th = {"gentle": [0.8, 0.7, 0.65, 0.5], "real": [0.78, 0.66, 0.65, 0.5]}
	controls = ["Talk to a customer on the floor: how wide is their wall, and what is their budget?",
		"Walk to the sofas and read the tags. Show the customer one that fits the wall and the budget.",
		"Write up the order at the desk: sofa + $79 delivery. Your commission is 6% of the sofa price."]
	tips = {"wide": "Compare the sofa's width to the wall: it has to be narrower.", "budget": "Check the price against the budget before you show it.",
		"door": "The sofa's depth has to be less than the door width, or it won't get in.", "total": "Total = sofa + $79 delivery (Real: then add 5% GST).",
		"wait": "Talk to new customers quickly: they look around for a while, then leave."}
	var props := [
		{"k": "desk", "x": 11, "y": 6, "id": "desk", "label": "Order desk", "solid": true}, {"k": "tag", "x": 11, "y": 6, "title": "ORDERS"},
		{"k": "rug", "x": 2, "y": 5, "w": 3, "h": 2, "color": "#c4553f"}, {"k": "rug", "x": 6, "y": 5, "w": 3, "h": 2, "color": "#4f7ba3"},
		{"k": "plant", "x": 11, "y": 2, "solid": true}, {"k": "mat", "x": 6, "y": 7}]
	for sid in SOFAS:
		var t: Vector2i = SOFAS[sid].tile
		props.append({"k": "sofa", "x": t.x, "y": t.y, "w": 2, "id": sid, "label": "Sofa", "color": SOFAS[sid].color, "solid": true})
		props.append({"k": "tag", "x": t.x, "y": t.y, "w": 2, "title": "SOFA " + sid.substr(1), "color": "#6e5038"})
	room_map = {"name": place, "w": 13, "h": 9, "room": {"floor": "wood", "wall": "#efe6d6", "exit": 6, "windows": [6, 10]}, "props": props,
		"spots": {"c1": {"x": SPOTS.c1.x, "y": SPOTS.c1.y, "label": "Customer"}, "c2": {"x": SPOTS.c2.x, "y": SPOTS.c2.y, "label": "Customer"}}}
	stations = {"desk": {"stand": Vector2i(11, 5), "tile": Vector2i(11, 6)}, "c1": {"stand": Vector2i(4, 6), "tile": SPOTS.c1}, "c2": {"stand": Vector2i(6, 6), "tile": SPOTS.c2}}
	for sid in SOFAS:
		stations[sid] = {"stand": SOFAS[sid].stand, "tile": SOFAS[sid].tile}


func twists() -> Array:
	return [
		{"name": "First shift", "line": "Mrs. Novak shows you the tags and the order desk. A quiet morning.", "rate": 0.7},
		{"name": "A normal day", "line": "Find each family a sofa that fits."},
		{"name": "January sale", "line": "January is slow, so every sofa is 20% off. Compare the SALE price to the budget.", "sale": true, "rate": 0.85},
		{"name": "Narrow doors", "line": "Older houses today: the sofa has to fit through the door too (depth less than the door width).", "door": true},
		{"name": "Tight budgets", "line": "Budgets are tight this week. Read the prices carefully.", "tight": true},
		{"name": "Push the big one", "line": "Mrs. Novak's nephew says to show everyone the sectional. Customers still need what fits.", "push": true},
		{"name": "Holiday shopping", "line": "Holiday shopping: families want a new sofa before the guests arrive.", "rate": 1.05},
		{"name": "Moving season", "line": "Moving season: lots of new apartments, lots of narrow walls.", "rate": 1.05, "narrow": true}]


func setup(st: Dictionary) -> void:
	st.next = 1.0
	st.sales = 0
	st.returns = []
	st.spot = {"c1": 0, "c2": 0}
	st.floor_ = {}
	var names := shuffled(st, NAMES)
	var widths := shuffled(st, [152, 188, 211, 236])
	var i := 0
	for sid in SOFAS:
		var w: int = widths[i]
		var base := 4900 + w * 400 + irand(st, 0, 3) * 10000
		st.floor_[sid] = {"name": names[i], "w": w, "d": irand(st, 78, 98), "price": base - base % 1000 - 100}
		i += 1


func _price(st: Dictionary, sid: String) -> int:
	var p := int(st.floor_[sid].price)
	return p * 4 / 5 if tw(st, "sale", false) else p


func _fits(st: Dictionary, c: Dictionary, sid: String) -> String:
	var s: Dictionary = st.floor_[sid]
	if int(s.w) > int(c.wall):
		return "wide"
	if c.door > 0 and int(s.d) >= int(c.door):
		return "door"
	if _price(st, sid) > int(c.budget):
		return "budget"
	return ""


func _new_customer(st: Dictionary) -> Dictionary:
	# pick a target sofa, then a wall and budget it fits (others may fit too)
	var keys := SOFAS.keys()
	var target: String = pick(st, keys)
	var s: Dictionary = st.floor_[target]
	var wall := int(s.w) + irand(st, 2, 30 if not tw(st, "narrow", false) else 12)
	var budget := _price(st, target) + (irand(st, 1, 4) * 2500 if not tw(st, "tight", false) else irand(st, 0, 1) * 1000 + 100)
	budget = budget - budget % 500
	if budget < _price(st, target):
		budget += 500
	var door := 0
	if tw(st, "door", false):
		door = int(s.d) + irand(st, 2, 6)
	return {"wall": wall, "budget": budget, "door": door}


func tick(st: Dictionary, dt: float) -> void:
	st.next = float(st.next) - dt * busy(st) * float(tw(st, "rate", 1.0))
	if st.next <= 0.0:
		st.next = (14.0 if not st.real else 14.0) * (0.75 + 0.5 * rnd(st))
		st.demand = int(st.demand) + 1
		var free := ""
		for sp in SPOTS:
			if int(st.spot[sp]) == 0:
				free = sp
				break
		if free == "":
			lose(st, SPOTS.c2, "wait", "The showroom was busy, and a customer left before anyone helped them.")
		else:
			var need := _new_customer(st)
			var c := add_cust(st, {"state": "floor", "spot": free, "asked": false, "wall": need.wall, "budget": need.budget, "door": need.door, "pat0": 48.0 if not st.real else 44.0})
			c.pat = c.pat0
			c.x = SPOTS[free].x
			c.y = SPOTS[free].y
			c.bub = "q"
			st.spot[free] = int(c.id)
	for c in st.cust.duplicate():
		if c.state in ["floor", "desk"]:
			c.pat = float(c.pat) - dt
			c.ring = float(c.pat) / float(c.pat0)
			if c.pat <= 0.0:
				_free_spot(st, c)
				drop(st, c)
				lose(st, Vector2i(c.x, c.y), "wait", "A customer waited too long and left.")
	line_up(custs(st, "desk"), DESK_Q)
	for r in st.returns.duplicate():
		if float(st.t) >= float(r.at) or float(st.t) + dt >= float(st.len):
			st.returns.erase(r)
			st.money = int(st.money) - int(r.com)
			st.sales = int(st.sales) - int(r.price)
			oops(st, stations.desk.tile, r.why, r.msg)


func _free_spot(st: Dictionary, c: Dictionary) -> void:
	if c.has("spot") and int(st.spot.get(c.spot, 0)) == int(c.id):
		st.spot[c.spot] = 0


func _need_text(c: Dictionary) -> String:
	var t := "\"Our wall is %d cm wide, and we can spend %s.\"" % [int(c.wall), cash_w(c.budget)]
	if int(c.door) > 0:
		t = "\"Wall: %d cm. Budget: %s. Our door is only %d cm wide.\"" % [int(c.wall), cash_w(c.budget), int(c.door)]
	return t


func _spot_cust(st: Dictionary, sp: String) -> Variant:
	for c in st.cust:
		if int(c.id) == int(st.spot[sp]):
			return c
	return null


func on_at(st: Dictionary, sid: String) -> void:
	st.at = sid
	if SPOTS.has(sid):
		var c = _spot_cust(st, sid)
		if c != null and not c.asked:
			c.asked = true
			c.bub = "sofa"
			c.pat = maxf(float(c.pat), float(c.pat0) * 0.8)
			st.msg = _need_text(c)


func card(st: Dictionary) -> Dictionary:
	var sid := str(st.at)
	if SPOTS.has(sid):
		var c = _spot_cust(st, sid)
		if c == null:
			return {"title": "Showroom floor", "lines": ["Nobody here right now."], "opts": []}
		return {"title": "A customer", "lines": [_need_text(c), "Find a sofa that fits, then show it to them from its tag."], "opts": []}
	if SOFAS.has(sid):
		var s: Dictionary = st.floor_[sid]
		var price_line := "Price: %s" % cash(s.price)
		if tw(st, "sale", false):
			price_line = "Price: %s   ·   SALE 20%% off: %s" % [cash(s.price), cash(_price(st, sid))]
		var L := ["%s   ·   %d cm wide   ·   %d cm deep" % [s.name, int(s.w), int(s.d)], price_line]
		if tw(st, "push", false) and sid == "s4":
			L.append("Mrs. Novak's nephew: \"Show everyone this one!\"")
		var opts := []
		for sp in SPOTS:
			var c = _spot_cust(st, sp)
			if c != null and c.asked:
				opts.append({"t": "Show it to the customer by rug %s (%d cm wall, %s)" % [sp.substr(1), int(c.wall), cash_w(c.budget)], "a": "show:%s:%s" % [sp, sid]})
		if opts.is_empty():
			L.append("Talk to a customer first.")
		return {"title": "Sofa %s · the tag" % sid.substr(1), "lines": L, "opts": opts, "cols": 1}
	if sid == "desk":
		var q := custs(st, "desk")
		if q.is_empty():
			return {"title": "Order desk", "lines": ["No orders to write up."], "opts": []}
		var c: Dictionary = q[0]
		var p: int = int(c.price)
		var right := _total(st, p)
		var choices := [right, p, (p + DELIVERY) if st.real else p + DELIVERY * 2]
		if choices[2] == right:
			choices[2] = right + 1000
		var opts := []
		for k in 3:
			var v: int = choices[(k + int(c.id)) % 3]
			opts.append({"t": "Total %s" % cash(v), "a": "total:%d" % v})
		var L := ["%s: %s + delivery %s%s" % [c.sofa, cash(p), cash_w(DELIVERY), " + 5% GST" if st.real else ""], "What's the total on the order?"]
		return {"title": "Order desk", "lines": L, "opts": opts, "cols": 3}
	return {}


func _total(st: Dictionary, p: int) -> int:
	return roundi(float(p + DELIVERY) * 1.05) if st.real else p + DELIVERY


func act(st: Dictionary, a: String) -> void:
	if a.begins_with("show:") and SOFAS.has(str(st.at)):
		var v := a.split(":")
		var c = _spot_cust(st, v[1])
		if c == null or not c.asked:
			return
		var sid: String = v[2]
		var why := _fits(st, c, sid)
		var at: Vector2i = SOFAS[sid].tile
		if why == "budget":
			_free_spot(st, c)
			drop(st, c)
			oops(st, at, "budget", "%s is over their budget of %s. They walk out." % [cash(_price(st, sid)), cash_w(c.budget)])
			return
		_free_spot(st, c)
		c.state = "desk"
		c.sofa = st.floor_[sid].name
		c.price = _price(st, sid)
		c.bad = why
		c.pat = c.pat0
		c.bub = "cash"
		st.msg = "\"We'll take it!\" They head to the order desk."
		return
	if a.begins_with("total:") and st.at == "desk":
		var q := custs(st, "desk")
		if q.is_empty():
			return
		var c: Dictionary = q[0]
		var p := int(c.price)
		var at: Vector2i = stations.desk.tile
		drop(st, c)
		if int(a.substr(6)) != _total(st, p):
			oops(st, at, "total", "The order total was wrong: it should be %s. Mrs. Novak fixes it, and the customer is not impressed." % cash(_total(st, p)))
			return
		var com := roundi(float(p) * pct)
		st.sales = int(st.sales) + p
		st.money = int(st.money) + com
		if str(c.bad) != "":
			pop(st, at, "+%s (6%%)" % cash(com), true)
			st.returns.append({"at": float(st.t) + 14.0 + rnd(st) * 8.0, "com": com, "price": p, "why": "wide" if c.bad == "wide" else "door",
				"msg": "Delivery called: the %s %s. It's coming back, and so is your %s commission." % [c.sofa, "is wider than the wall" if c.bad == "wide" else "won't fit through the door", cash(com)]})
			st.msg = "Order written up."
		else:
			win(st, at, "+%s (6%%)" % cash(com), "Sold! Your 6%% commission: %s." % cash(com))


func best(st: Dictionary) -> Dictionary:
	var dq := custs(st, "desk")
	if dq.size() and (dq.size() >= 2 or float(dq[0].pat) < 14.0):
		return _desk(st)
	# show a sofa to a customer who has told you what they need
	for sp in SPOTS:
		var c = _spot_cust(st, sp)
		if c != null and c.asked:
			var best_s := ""
			for sid in SOFAS:
				if _fits(st, c, sid) == "" and (best_s == "" or dist(st.me, SOFAS[sid].stand) < dist(st.me, SOFAS[best_s].stand)):
					best_s = sid
			if best_s != "":
				return {"go": best_s, "a": "show:%s:%s" % [sp, best_s] if st.at == best_s else "", "think": 1.8}
	for sp in SPOTS:
		var c = _spot_cust(st, sp)
		if c != null and not c.asked:
			return {"go": sp, "think": 1.0}
	if dq.size():
		return _desk(st)
	return {}


func _desk(st: Dictionary) -> Dictionary:
	var c: Dictionary = custs(st, "desk")[0]
	return {"go": "desk", "a": "total:%d" % _total(st, int(c.price)) if st.at == "desk" else "", "think": 2.0}


func actions(st: Dictionary) -> Array:
	return card(st).get("opts", []).map(func(o): return o.a)


func marks(st: Dictionary) -> Array:
	return []


func pending(st: Dictionary) -> int:
	return st.cust.size() + st.returns.size()


func tally(st: Dictionary) -> Array:
	return [["Customers", str(custs(st, "floor").size() + custs(st, "desk").size())], ["Sold", cash_w(maxi(0, int(st.sales)))], ["Commission", cash(maxi(0, int(st.money)))]]


func earn_line(st: Dictionary) -> String:
	return "You sold %s in furniture. Your 6%% commission: %s, on top of your hourly wage. Returns take commission back." % [cash(maxi(0, int(st.sales))), cash(maxi(0, int(st.money)))]
