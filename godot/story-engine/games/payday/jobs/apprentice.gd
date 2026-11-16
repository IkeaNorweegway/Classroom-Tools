# Bright Spark Electric (apprentice electrician, wage): Wire it right. Joe's work orders come in: an outlet or a light in a room.
# For each: take the right device from the van (an outlet near water, in a kitchen or bathroom, must be a GFCI outlet: the
# electrical code), switch off that room's breaker at the panel, test for power at the box, then wire it: black to brass,
# white to silver, bare copper to green. Switch the breaker back on to test it: done. Touching a wire on a live circuit is a
# shock (−2, and the wiring starts over). Turning power on to a half-wired box costs a point. Shift 6: two panel labels are
# swapped, so only the tester tells you the truth. An order nobody gets to in time goes to another apprentice.
extends "res://games/payday/jobs/job.gd"

const ROOMS := {"kitchen": ["Kitchen", Vector2i(4, 2)], "bath": ["Bathroom", Vector2i(7, 2)], "bed": ["Bedroom", Vector2i(9, 2)], "living": ["Living room", Vector2i(11, 2)]}
const DEVICES := {"outlet": "Outlet", "gfci": "GFCI outlet", "light": "Light fixture"}
const SCREW := {"black": "brass", "white": "silver", "bare": "green"}
const WIRE_NAME := {"black": "Black wire", "white": "White wire", "bare": "Bare copper"}


func _init() -> void:
	id = "apprentice"
	name = "Wire it right"
	place = "Bright Spark Electric · job site"
	pay = "wage"
	start = Vector2i(6, 5)
	boss_at = Vector2i(1, 7)
	hour = 8
	react = {"great": "Safe and right, every circuit. You’ll make journeyman yet.", "ok": "Good. Nobody got hurt.", "poor": "Wires on the wrong screws. And the breaker! Safety first, always."}
	th = {"gentle": [0.8, 0.7, 0.65, 0.5], "real": [0.78, 0.66, 0.65, 0.5]}
	controls = ["Read the work order, then take the right device from the van. Near water (kitchen, bathroom): GFCI outlet.",
		"Breaker OFF at the panel, test for power at the box, then black→brass, white→silver, bare copper→green.",
		"Switch the breaker back on to test your work. Never touch a wire on a live circuit."]
	tips = {"shock": "Always switch the breaker off and test for power before you touch a wire.",
		"screw": "Black to brass, white to silver, bare copper to green.", "gfci": "Outlets near water (kitchens, bathrooms) must be GFCI outlets.",
		"device": "A light job needs a light fixture; an outlet job needs an outlet.", "power": "Finish all three wires before you turn the power back on.",
		"late": "Work orders wait about a minute: start the oldest one first."}
	var props := [
		{"k": "breaker", "x": 1, "y": 2, "id": "panel", "label": "Breaker panel", "solid": true},
		{"k": "toolbox", "x": 11, "y": 7, "id": "van", "label": "The van (parts)", "solid": true},
		{"k": "tag", "x": 1, "y": 2, "title": "PANEL", "color": "#5d6370"}, {"k": "tag", "x": 11, "y": 7, "title": "PARTS", "color": "#8a2f28"},
		{"k": "ladder", "x": 5, "y": 6, "solid": true}, {"k": "cone", "x": 3, "y": 7}, {"k": "crate", "x": 8, "y": 7, "solid": true}, {"k": "mat", "x": 6, "y": 7}]
	for r in ROOMS:
		var t: Vector2i = ROOMS[r][1]
		props.append({"k": "jbox", "x": t.x, "y": t.y, "id": r, "label": ROOMS[r][0], "solid": true})
		props.append({"k": "tag", "x": t.x, "y": t.y, "title": ROOMS[r][0].to_upper(), "color": "#3d3833"})
	room_map = {"name": place, "w": 13, "h": 9, "room": {"floor": "wood", "wall": "#e9e2d6", "exit": 6, "windows": [6]}, "props": props}
	stations = {"panel": {"stand": Vector2i(1, 3), "tile": Vector2i(1, 2)}, "van": {"stand": Vector2i(10, 7), "tile": Vector2i(11, 7)}}
	for r in ROOMS:
		stations[r] = {"stand": ROOMS[r][1] + Vector2i(0, 1), "tile": ROOMS[r][1]}


func twists() -> Array:
	return [
		{"name": "First shift", "line": "Joe shows you the panel, the van and the boxes. Regular outlets and lights only.", "rate": 0.7, "wet": false},
		{"name": "Kitchens and baths", "line": "Joe: \"Near water, an outlet must be a GFCI. It cuts the power if something goes wrong.\""},
		{"name": "Cold snap", "line": "Two days off the job site for the cold. A short shift.", "len": 90.0},
		{"name": "Lighting day", "line": "Lots of new light fixtures today.", "light": 0.6},
		{"name": "Inspector visit", "line": "The inspector checks your work today. A wrong device costs double.", "strict": true},
		{"name": "Swapped labels", "line": "Somebody labelled this panel wrong. Test for power before you touch anything.", "swap": true},
		{"name": "Holiday week", "line": "One day off for the holiday. A short shift.", "len": 90.0},
		{"name": "Big job", "line": "A whole house to finish. Work orders keep coming.", "rate": 1.15}]


func setup(st: Dictionary) -> void:
	st.next = 1.0
	st.power = {"kitchen": true, "bath": true, "bed": true, "living": true}
	st.orders = []
	st.no = 1
	st.held = ""
	st.done_n = 0


## The panel switch with this label really controls…  (Shift 6 swaps the kitchen and bathroom switches.)
func _circuit(st: Dictionary, label: String) -> String:
	if tw(st, "swap", false):
		if label == "kitchen":
			return "bath"
		if label == "bath":
			return "kitchen"
	return label


func _switch_for(st: Dictionary, room: String) -> String:
	for lab in ROOMS:
		if _circuit(st, lab) == room:
			return lab
	return room


func _need(o: Dictionary) -> String:
	if o.kind == "light":
		return "light"
	return "gfci" if o.room in ["kitchen", "bath"] else "outlet"


func tick(st: Dictionary, dt: float) -> void:
	st.next = float(st.next) - dt * busy(st) * float(tw(st, "rate", 1.0))
	if st.next <= 0.0:
		st.next = (14.0 if not st.real else 14.5) * (0.75 + 0.5 * rnd(st))
		var free := ROOMS.keys().filter(func(r): return not st.orders.any(func(o): return o.room == r))
		if free.size():
			var wet := bool(tw(st, "wet", true))
			var rooms: Array = free if wet else free.filter(func(r): return not r in ["kitchen", "bath"] or true)
			var room: String = pick(st, rooms)
			var kind := "light" if rnd(st) < float(tw(st, "light", 0.3)) or (not wet and room in ["kitchen", "bath"]) else "outlet"
			st.orders.append({"n": int(st.no), "room": room, "kind": kind, "dev": "", "wired": 0, "tested": false, "left": 70.0 if not st.real else 68.0})
			st.no = int(st.no) + 1
			st.demand = int(st.demand) + 1
	for o in st.orders.duplicate():
		o.left = float(o.left) - dt
		if float(o.left) <= 0.0:
			st.orders.erase(o)
			lose(st, ROOMS[o.room][1], "late", "Joe gave the %s %s to another apprentice. It waited too long." % [ROOMS[o.room][0].to_lower(), "light" if o.kind == "light" else "outlet"])


func _order_at(st: Dictionary, room: String) -> Variant:
	for o in st.orders:
		if o.room == room:
			return o
	return null


func on_at(st: Dictionary, sid: String) -> void:
	st.at = sid
	var o = _order_at(st, sid)
	if o != null and st.held != "" and o.dev == "":
		o.dev = st.held
		st.held = ""
		st.msg = "%s at the %s box. Breaker off and test before you touch a wire." % [DEVICES[o.dev], ROOMS[sid][0].to_lower()]


func card(st: Dictionary) -> Dictionary:
	var sid := str(st.at)
	if sid == "van":
		return {"title": "The van · parts", "lines": ["Open orders: " + _orders_text(st), "In your hands: " + (DEVICES[st.held] if st.held != "" else "nothing")],
			"opts": [{"t": "Outlet", "a": "dev:outlet"}, {"t": "GFCI outlet", "a": "dev:gfci"}, {"t": "Light fixture", "a": "dev:light"}], "cols": 3}
	if sid == "panel":
		var opts := []
		for r in ROOMS:
			var on: bool = st.power[_circuit(st, r)]
			opts.append({"t": "%s: %s → turn %s" % [ROOMS[r][0], "ON" if on else "OFF", "off" if on else "on"], "a": "brk:" + r})
		return {"title": "Breaker panel", "lines": ["Open orders: " + _orders_text(st)], "opts": opts, "cols": 2}
	if ROOMS.has(sid):
		var o = _order_at(st, sid)
		if o == null:
			return {"title": ROOMS[sid][0], "lines": ["No work order here right now."], "opts": []}
		var job := "%s %s" % [ROOMS[sid][0], "light" if o.kind == "light" else "outlet"]
		if o.dev == "":
			return {"title": "Work order: " + job, "lines": ["Bring a device from the van." if st.held == "" else "You're holding: %s." % DEVICES[st.held]], "opts": []}
		if int(o.wired) >= 3:
			return {"title": "Work order: " + job, "lines": ["%s wired. Switch the breaker back on to test it." % DEVICES[o.dev]], "opts": []}
		var order: Array = o.get("seq", ["black", "white", "bare"])
		var w: String = order[int(o.wired)]
		var L := ["Installing: %s." % DEVICES[o.dev], "Next: %s." % WIRE_NAME[w]]
		if o.has("test"):
			L.append("Tester: " + str(o.test))
		var opts := [{"t": "Test for power", "a": "test"}]
		for s in ["brass", "silver", "green"]:
			opts.append({"t": "%s → %s screw" % [WIRE_NAME[w], s], "a": "screw:" + s})
		return {"title": "Work order: " + job, "lines": L, "opts": opts, "cols": 2}
	return {}


func _orders_text(st: Dictionary) -> String:
	if st.orders.is_empty():
		return "none"
	var parts := []
	for o in st.orders:
		parts.append("%s %s" % [ROOMS[o.room][0], "light" if o.kind == "light" else "outlet"])
	return ", ".join(parts)


func act(st: Dictionary, a: String) -> void:
	var sid := str(st.at)
	if sid == "van" and a.begins_with("dev:"):
		st.held = a.substr(4)
		st.msg = "You take a %s." % DEVICES[st.held].to_lower()
		return
	if sid == "panel" and a.begins_with("brk:"):
		var lab := a.substr(4)
		var c := _circuit(st, lab)
		st.power[c] = not st.power[c]
		if st.power[c]:
			var o = _order_at(st, c)
			if o != null and o.dev != "":
				if int(o.wired) >= 3:
					st.orders.erase(o)
					var right := _need(o)
					if o.dev != right:
						oops(st, ROOMS[c][1], "gfci" if right == "gfci" or o.dev == "gfci" else "device", "The %s works, but it's the wrong device: it needed a %s." % [DEVICES[o.dev].to_lower(), DEVICES[right].to_lower()], 2 if tw(st, "strict", false) else 1)
					else:
						st.done_n = int(st.done_n) + 1
						win(st, ROOMS[c][1], "+1", "Power on... the %s works. Job done." % ("light" if o.kind == "light" else "outlet"))
				elif int(o.wired) > 0:
					o.wired = 0
					oops(st, ROOMS[c][1], "power", "You turned the power on to a half-wired box. Sparks! Start the wiring over.")
		st.msg = st.msg if st.power[c] else "%s breaker off." % ROOMS[lab][0]
		return
	if ROOMS.has(sid):
		var o = _order_at(st, sid)
		if o == null or o.dev == "" or int(o.wired) >= 3:
			return
		if not o.has("seq"):
			o.seq = shuffled(st, ["black", "white", "bare"])
		if a == "test":
			o.test = "LIVE! The power is on." if st.power[sid] else "No power. Safe to work."
			st.msg = str(o.test)
			return
		if a.begins_with("screw:"):
			var at: Vector2i = ROOMS[sid][1]
			if st.power[sid]:
				o.wired = 0
				o.erase("test")
				oops(st, at, "shock", "ZAP! That circuit was live. Breaker off and test first, every time.", 2)
				return
			var w: String = o.seq[int(o.wired)]
			if SCREW[w] != a.substr(6):
				oops(st, at, "screw", "%s goes on the %s screw. Take it off and try again." % [WIRE_NAME[w], SCREW[w]])
				return
			o.wired = int(o.wired) + 1
			st.msg = "Tight." if int(o.wired) < 3 else "All three wires on. Switch the breaker back on to test it."


func best(st: Dictionary) -> Dictionary:
	if st.orders.is_empty():
		return {}
	var oldest: Dictionary = st.orders[0]
	for o in st.orders:
		if o.dev != "" and int(o.wired) >= 3:
			return {"go": "panel", "a": "brk:" + _switch_for(st, o.room) if st.at == "panel" else "", "think": 0.9}
	# work on an order that has its device
	for o in st.orders:
		if o.dev != "":
			if st.power[o.room]:
				return {"go": "panel", "a": "brk:" + _switch_for(st, o.room) if st.at == "panel" else "", "think": 0.9}
			if st.at != o.room:
				return {"go": o.room}
			if not o.has("seq"):
				return {"go": o.room, "a": "test", "think": 0.6}
			if not o.has("test") and (st.real or tw(st, "swap", false)):
				return {"go": o.room, "a": "test", "think": 0.6}
			var w: String = o.seq[int(o.wired)]
			return {"go": o.room, "a": "screw:" + SCREW[w], "think": 0.9}
	# bring the right device to the oldest order without one
	for o in st.orders:
		if o.dev == "":
			if st.held == _need(o):
				return {"go": o.room}
			return {"go": "van", "a": "dev:" + _need(o) if st.at == "van" else "", "think": 1.2}
	return {}


func actions(st: Dictionary) -> Array:
	return card(st).get("opts", []).map(func(o): return o.a)


func marks(st: Dictionary) -> Array:
	var out := []
	for o in st.orders:
		var b := "done" if int(o.wired) >= 3 else ("bolt" if st.power[o.room] else "wrench")
		out.append({"x": ROOMS[o.room][1].x, "y": ROOMS[o.room][1].y, "bub": b, "ring": float(o.left) / (70.0 if not st.real else 68.0)})
	return out


func pending(st: Dictionary) -> int:
	return st.orders.size()


func tally(st: Dictionary) -> Array:
	var off := ROOMS.keys().filter(func(r): return not st.power[_circuit(st, r)]).map(func(r): return ROOMS[r][0])
	return [["Orders", str(st.orders.size())], ["Holding", DEVICES[st.held] if st.held != "" else "—"], ["Power off", ", ".join(off) if off.size() else "none"]]


func earn_line(st: Dictionary) -> String:
	return "%d jobs done safely. Apprentices earn a wage for every hour on the site, and it rises as you learn the trade." % int(st.done_n)
