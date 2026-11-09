# Home & Hearth (furniture sales, 6% commission): Right fit, right budget. Customers come in with a room
# size (width × depth in cm) and a budget. Recommend the best sofa that fits both: it must slide in with
# at least 20 cm clearance on each side and 80 cm in front. The best sale is the highest-priced sofa that
# still fits and meets their budget — not the cheapest, not the one that's over budget. In Real mode,
# customers also need a coffee table: leave at least 45 cm between the sofa front and the table.
extends "res://games/payday/jobs/job.gd"

# Sofas: name, width, depth (cm), price (cents), seats
const SOFAS := [
	{"name": "Studio 2", "w": 150, "d": 80, "price": 59900, "seats": 2},
	{"name": "Comfort 3", "w": 205, "d": 88, "price": 89900, "seats": 3},
	{"name": "Landmark 3", "w": 215, "d": 92, "price": 119900, "seats": 3},
	{"name": "Haven 2", "w": 158, "d": 85, "price": 109900, "seats": 2},
	{"name": "Haven 3", "w": 218, "d": 90, "price": 149900, "seats": 3},
	{"name": "Corner Suite", "w": 280, "d": 160, "price": 199900, "seats": 5},
	{"name": "Gallery 3", "w": 225, "d": 95, "price": 179900, "seats": 3},
	{"name": "Loft 2", "w": 145, "d": 78, "price": 79900, "seats": 2}]
# Coffee tables: name, width, depth, price
const TABLES := [
	{"name": "Birch Round", "w": 80, "d": 80, "price": 24900},
	{"name": "Oak Rectangle", "w": 120, "d": 60, "price": 34900},
	{"name": "Marble Oval", "w": 130, "d": 70, "price": 54900},
	{"name": "Glass Top", "w": 110, "d": 55, "price": 44900}]
const SIDE_CLEAR := 20  # cm clearance each side
const FRONT_CLEAR := 80  # cm clearance in front of sofa
const TABLE_GAP := 45   # cm gap between sofa front edge and table front edge

const WAIT_Q := [Vector2i(4, 6), Vector2i(6, 6), Vector2i(4, 7), Vector2i(6, 7), Vector2i(2, 6), Vector2i(8, 6)]


func _init() -> void:
	id = "furniture"
	name = "Right fit"
	place = "Home & Hearth · showroom"
	pay = "commission"
	pct = 0.06
	start = Vector2i(5, 5)
	boss_at = Vector2i(1, 7)
	hour = 10
	react = {"great": "Customers left with the right sofa. Commission earned.", "ok": "Some good matches. Room to improve.", "poor": "Wrong sizes, over budget. Returned sales cost us."}
	th = {"gentle": [0.8, 0.7, 0.62, 0.45], "real": [0.78, 0.68, 0.6, 0.45]}
	controls = ["Customers tell you their room size (width × depth) and budget.",
		"Find the best sofa: it must fit with 20 cm clearance each side, 80 cm in front, and stay within budget.",
		"The best sale is the highest-priced sofa that still fits — not the cheapest, not the one that's over."]
	tips = {"fit": "Width: sofa must be ≤ room width − 40 cm (20 cm each side). Depth: sofa ≤ room depth − 80 cm.",
		"best": "Pick the highest-priced sofa within budget that fits. Selling cheap when better fits costs commission.",
		"over": "Over-budget or too-big sofas get returned. That costs you the sale.",
		"table": "Coffee table: leave 45 cm gap between the sofa front and the table front edge.",
		"seats": "If the customer says how many people they need to seat, make sure the sofa has enough seats."}
	room_map = {"name": place, "w": 13, "h": 9, "room": {"floor": "wood", "wall": "#ede8e0", "exit": 6, "windows": [2, 8]},
		"props": [
			{"k": "display", "x": 1, "y": 2, "w": 3, "solid": true}, {"k": "display", "x": 5, "y": 2, "w": 3, "solid": true},
			{"k": "display", "x": 9, "y": 2, "w": 3, "solid": true},
			{"k": "counter", "x": 4, "y": 5, "w": 5, "id": "counter", "label": "Consultation desk", "color": "#8a7060", "solid": true},
			{"k": "register", "x": 10, "y": 5, "id": "till", "label": "Till", "solid": true},
			{"k": "shelf", "x": 1, "y": 5, "id": "catalog", "label": "Catalogue", "color": "#8a7060", "solid": true},
			{"k": "plant", "x": 12, "y": 2, "solid": true},
			{"k": "tag", "x": 4, "y": 5, "w": 5, "title": "CONSULTATION"},
			{"k": "tag", "x": 10, "y": 5, "title": "TILL"},
			{"k": "mat", "x": 6, "y": 7}]}
	stations = {
		"counter": {"stand": Vector2i(6, 6), "tile": Vector2i(6, 5)},
		"till": {"stand": Vector2i(10, 6), "tile": Vector2i(10, 5)}}


func twists() -> Array:
	return [
		{"name": "First shift", "line": "Ms. Leclair shows you the floor. Customers ask for sofas today.", "rate": 0.65, "seats": false},
		{"name": "A normal day", "line": "Weekend traffic. Some customers want to seat a crowd.", "seats": true},
		{"name": "January clearance", "line": "January clearance: smaller budgets, everyone wants a deal.", "rate": 0.9, "budget_cap": 109900},
		{"name": "Condo buyers", "line": "Lots of condo buyers: smaller rooms. Measure carefully.", "small_rooms": true},
		{"name": "The full living room", "line": "Customers want a sofa and a coffee table. Leave that 45 cm gap.", "tables": true},
		{"name": "Moving season", "line": "Moving season: everyone buying at once. Keep the desk moving.", "rate": 1.2, "seats": true},
		{"name": "Luxury weekend", "line": "High-end customers this weekend: larger budgets, want the best.", "luxury": true},
		{"name": "Back to school", "line": "Students furnishing apartments: tight budgets, small rooms.", "rate": 1.1, "small_rooms": true, "budget_cap": 119900}]


func setup(st: Dictionary) -> void:
	st.next = 1.0
	st.sales = 0


func _cust_room(st: Dictionary) -> Dictionary:
	var small: bool = tw(st, "small_rooms", false)
	var luxury: bool = tw(st, "luxury", false)
	var budget_cap: int = int(tw(st, "budget_cap", 199900))
	var rw := irand(st, 240 if small else 260, 320 if small else 400)
	var rd := irand(st, 220 if small else 250, 350)
	var budget: int
	if luxury:
		budget = irand(st, 149900, 199900)
	else:
		budget = irand(st, 59900, mini(budget_cap, 179900))
	var seats: int = 0
	if tw(st, "seats", false):
		seats = irand(st, 2, 3)
		if seats == 3:
			budget = maxi(budget, 89900)  # ensure at least one 3-seat sofa is in budget
	return {"rw": rw, "rd": rd, "budget": budget, "seats": seats}


func _fits(sofa: Dictionary, rw: int, rd: int) -> bool:
	return int(sofa.w) <= rw - SIDE_CLEAR * 2 and int(sofa.d) <= rd - FRONT_CLEAR


func _best_sofa(st: Dictionary, c: Dictionary) -> int:
	var best := -1
	var best_price := -1
	for i in SOFAS.size():
		var s: Dictionary = SOFAS[i]
		if not _fits(s, int(c.rw), int(c.rd)):
			continue
		if int(s.price) > int(c.budget):
			continue
		if tw(st, "seats", false) and int(c.seats) > 0 and int(s.seats) < int(c.seats):
			continue
		if int(s.price) > best_price:
			best_price = int(s.price)
			best = i
	return best


func _table_fits(table: Dictionary, sofa: Dictionary, rd: int) -> bool:
	# After sofa, remaining depth = rd - sofa.d; need TABLE_GAP + table.d within that
	return rd - int(sofa.d) >= TABLE_GAP + int(table.d)


func tick(st: Dictionary, dt: float) -> void:
	st.next = float(st.next) - dt * busy(st) * float(tw(st, "rate", 1.0))
	if st.next <= 0.0:
		st.next = (10.0 if not st.real else 8.5) * (0.75 + 0.5 * rnd(st))
		st.demand = int(st.demand) + 1
		if custs(st, "browse").size() < WAIT_Q.size():
			var room := _cust_room(st)
			var c := add_cust(st, {"state": "browse", "pat0": 42.0 if not st.real else 34.0,
				"rw": room.rw, "rd": room.rd, "budget": room.budget, "seats": room.seats, "step": "sofa", "sofa_i": -1})
			c.pat = c.pat0
			c.bub = "q"
		else:
			lose(st, WAIT_Q[-1], "wait", "The floor was too busy. A customer gave up and left.")
	for c in st.cust.duplicate():
		if c.state in ["browse", "pay"]:
			var head: bool = c.state == "browse" and custs(st, "browse").find(c) == 0 and st.at == "counter"
			c.pat = float(c.pat) - dt * (0.35 if head else 0.9)
			c.ring = float(c.pat) / float(c.pat0)
			if c.pat <= 0.0:
				drop(st, c)
				lose(st, WAIT_Q[0], "wait", "A customer waited too long and walked out.")
	line_up(custs(st, "browse"), WAIT_Q)
	line_up(custs(st, "pay"), [Vector2i(10, 7), Vector2i(9, 7), Vector2i(11, 7)])


func _sofa_opts(st: Dictionary, c: Dictionary) -> Array:
	var opts := []
	var seen_prices := {}
	for i in SOFAS.size():
		var s: Dictionary = SOFAS[i]
		var fits: bool = _fits(s, int(c.rw), int(c.rd))
		var in_budget: bool = int(s.price) <= int(c.budget)
		var seats_ok: bool = not tw(st, "seats", false) or int(c.seats) == 0 or int(s.seats) >= int(c.seats)
		if seen_prices.has(int(s.price)):
			continue
		seen_prices[int(s.price)] = true
		var note := ""
		if not fits: note = " (too wide/deep)"
		elif not in_budget: note = " (over budget)"
		elif not seats_ok: note = " (too few seats)"
		opts.append({"t": "%s %d×%d cm · %s%s" % [s.name, int(s.w), int(s.d), cash_w(s.price), note], "a": "sofa:%d" % i})
	# Shuffle by id so order varies (the best answer isn't always the same position)
	var k: int = int(c.id) % opts.size()
	return opts.slice(k) + opts.slice(0, k)


func _table_opts(c: Dictionary) -> Array:
	var sofa: Dictionary = SOFAS[int(c.sofa_i)]
	var opts := []
	for i in TABLES.size():
		var tbl: Dictionary = TABLES[i]
		var gap_ok: bool = _table_fits(tbl, sofa, int(c.rd))
		var note: String = "" if gap_ok else " (gap too tight)"
		opts.append({"t": "%s %d cm depth · %s%s" % [tbl.name, int(tbl.d), cash_w(tbl.price), note], "a": "table:%d" % i})
	return opts


func card(st: Dictionary) -> Dictionary:
	var sid := str(st.at)
	if sid == "counter":
		var q := custs(st, "browse")
		if q.is_empty():
			return {"title": "Consultation desk", "lines": ["No customers at the desk."], "opts": []}
		var c: Dictionary = q[0]
		if c.step == "sofa":
			var seats_line: String = "" if int(c.seats) == 0 else " — seats at least %d" % int(c.seats)
			var L := ["Room: %d × %d cm. Budget: %s%s." % [int(c.rw), int(c.rd), cash_w(c.budget), seats_line],
				"Width limit: %d cm. Depth limit: %d cm." % [int(c.rw) - SIDE_CLEAR * 2, int(c.rd) - FRONT_CLEAR]]
			return {"title": "Consultation desk · sofas", "lines": L, "opts": _sofa_opts(st, c), "cols": 2}
		if c.step == "table":
			var sofa: Dictionary = SOFAS[int(c.sofa_i)]
			var space: int = int(c.rd) - int(sofa.d)
			var L := ["Sofa: %s (%d cm deep). Room depth left: %d cm." % [sofa.name, int(sofa.d), space],
				"Leave %d cm gap. Table depth must be ≤ %d cm." % [TABLE_GAP, space - TABLE_GAP]]
			return {"title": "Consultation desk · coffee tables", "lines": L, "opts": _table_opts(c), "cols": 2}
	if sid == "till":
		var q := custs(st, "pay")
		if q.is_empty():
			return {"title": "Till", "lines": ["Nobody waiting to pay."], "opts": []}
		var c: Dictionary = q[0]
		return {"title": "Till", "lines": [str(c.what), "Commission: 6%% of %s" % cash(c.base)],
			"opts": [{"t": "Ring it up", "a": "ring", "k": "primary"}], "cols": 1}
	return {}


func act(st: Dictionary, a: String) -> void:
	var sid := str(st.at)
	if sid == "counter":
		var q := custs(st, "browse")
		if q.is_empty(): return
		var c: Dictionary = q[0]
		var at: Vector2i = stations.counter.tile
		if a.begins_with("sofa:") and c.step == "sofa":
			var i := int(a.substr(5))
			var s: Dictionary = SOFAS[i]
			if not _fits(s, int(c.rw), int(c.rd)):
				drop(st, c)
				oops(st, at, "fit", "That sofa doesn't fit: %d cm wide in a %d cm room (need %d cm clearance each side)." % [int(s.w), int(c.rw), SIDE_CLEAR])
				return
			if int(s.price) > int(c.budget):
				drop(st, c)
				oops(st, at, "over", "That sofa is %s over their budget of %s." % [cash(int(s.price) - int(c.budget)), cash_w(c.budget)])
				return
			if tw(st, "seats", false) and int(c.seats) > 0 and int(s.seats) < int(c.seats):
				drop(st, c)
				oops(st, at, "seats", "Only %d seats — they needed at least %d." % [int(s.seats), int(c.seats)])
				return
			# Must recommend the best sofa (highest-priced that fits + budget + seats)
			var best_i := _best_sofa(st, c)
			if best_i >= 0 and best_i != i and int(SOFAS[best_i].price) > int(s.price):
				drop(st, c)
				oops(st, at, "best", "There's a better fit: the %s (%s) fits and is within their budget." % [SOFAS[best_i].name, cash_w(SOFAS[best_i].price)])
				return
			c.sofa_i = i
			if tw(st, "tables", false):
				c.step = "table"
				st.msg = "Great choice! Now find them a coffee table that fits in the remaining space."
				return
			c.state = "pay"
			c.what = "%s sofa: %s" % [s.name, cash_w(s.price)]
			c.base = int(s.price)
			c.pat = c.pat0
			c.bub = "cash"
			return
		if a.begins_with("table:") and c.step == "table":
			var i := int(a.substr(6))
			var tbl: Dictionary = TABLES[i]
			var sofa: Dictionary = SOFAS[int(c.sofa_i)]
			if not _table_fits(tbl, sofa, int(c.rd)):
				drop(st, c)
				oops(st, at, "table", "That table doesn't leave %d cm gap: sofa is %d cm deep, table is %d cm deep, room is %d cm." % [TABLE_GAP, int(sofa.d), int(tbl.d), int(c.rd)])
				return
			c.state = "pay"
			c.what = "%s sofa + %s table: %s" % [sofa.name, tbl.name, cash_w(int(sofa.price) + int(tbl.price))]
			c.base = int(sofa.price) + int(tbl.price)
			c.pat = c.pat0
			c.bub = "cash"
			return
	if sid == "till" and a == "ring":
		var q := custs(st, "pay")
		if q.is_empty(): return
		var c: Dictionary = q[0]
		var com := roundi(float(c.base) * pct)
		st.sales = int(st.sales) + int(c.base)
		st.money = int(st.money) + com
		drop(st, c)
		win(st, stations.till.tile, "+%s (6%%)" % cash(com), "Sold! Your 6%% commission: %s." % cash(com))


func best(st: Dictionary) -> Dictionary:
	var pay_q := custs(st, "pay")
	var browse_q := custs(st, "browse")
	if pay_q.size() >= 2 or (pay_q.size() > 0 and browse_q.is_empty()):
		return {"go": "till", "a": "ring" if st.at == "till" else "", "think": 0.8}
	if browse_q.size() > 0:
		if st.at != "counter":
			return {"go": "counter"}
		var c: Dictionary = browse_q[0]
		if c.step == "sofa":
			var best_i := _best_sofa(st, c)
			if best_i >= 0:
				return {"go": "counter", "a": "sofa:%d" % best_i, "think": 2.4}
			return {}  # no valid sofa; let the customer time out rather than pick wrong
		if c.step == "table":
			var sofa: Dictionary = SOFAS[int(c.sofa_i)]
			for i in TABLES.size():
				if _table_fits(TABLES[i], sofa, int(c.rd)):
					return {"go": "counter", "a": "table:%d" % i, "think": 2.0}
			return {"go": "counter", "a": "table:0", "think": 2.0}
	if pay_q.size() > 0:
		return {"go": "till", "a": "ring" if st.at == "till" else "", "think": 0.8}
	return {}


func actions(st: Dictionary) -> Array:
	return card(st).get("opts", []).map(func(o): return o.a)


func pending(st: Dictionary) -> int:
	return st.cust.size()


func tally(st: Dictionary) -> Array:
	return [["Browsing", str(custs(st, "browse").size())], ["At till", str(custs(st, "pay").size())], ["Sold", cash(st.sales)], ["Commission", cash(st.money)]]


func earn_line(st: Dictionary) -> String:
	return "You sold %s in furniture. Your 6%% commission: %s. Commission jobs pay more when you match the right product to the right customer." % [cash(st.sales), cash(maxi(0, int(st.money)))]
