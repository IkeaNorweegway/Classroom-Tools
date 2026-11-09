# Spoke & Chain Bikes (service writer, salary): Repair desk. A rider describes the problem at the front desk: pick the repair
# ticket that matches, then quote the price (part + labour, plus 5% GST in Alberta). Carry the bike to a free repair stand; the
# mechanics fix it. Move finished bikes to the pick-up rack, and hand each one back when its rider returns. A wrong ticket means
# the problem is still there at pick-up; a wrong quote means an argument at the desk. Both cost a point. You carry one bike.
extends "res://games/payday/jobs/job.gd"

const REPAIRS := {
	"flat": ["Flat tire", "The back tire keeps going soft, even after I pump it up.", "Inner tube", 900, 1500],
	"chain": ["Rusty chain", "It grinds when I pedal, and the chain looks orange.", "Chain", 3500, 2000],
	"wheel": ["Bent wheel", "The front wheel wobbles side to side and rubs the brake.", "Spokes", 600, 3000],
	"brakes": ["Worn brake pads", "It takes forever to stop, and the brakes squeal.", "Brake pads", 1800, 1500],
	"seat": ["Loose seat", "My seat slides down while I ride.", "Seat bolt", 400, 1000],
	"gears": ["Gear tune-up", "The chain jumps between gears when I climb a hill.", "Gear cable", 800, 2500]}
const QUEUE := [Vector2i(3, 6), Vector2i(4, 6), Vector2i(4, 7), Vector2i(5, 7), Vector2i(2, 7)]
const STANDS := {"s1": Vector2i(8, 3), "s2": Vector2i(10, 3)}
const RACK_MAX := 3


func _init() -> void:
	id = "bikeshop"
	name = "Repair desk"
	place = "Spoke & Chain Bikes · shop"
	pay = "salary"
	start = Vector2i(3, 4)
	boss_at = Vector2i(1, 7)
	hour = 10
	react = {"great": "Every bike rolled out right. Nice wrenching!", "ok": "Decent day at the desk.", "poor": "Riders came back with the same problems. Not great."}
	th = {"gentle": [0.8, 0.7, 0.6, 0.45], "real": [0.78, 0.66, 0.6, 0.45]}
	controls = ["At the desk: listen to the rider, pick the matching repair ticket, then quote part + labour + 5% GST.",
		"Carry the bike to a free repair stand. When it shows a check mark, move it to the pick-up rack.",
		"Riders come back to the desk for their bikes: hand them over. You carry one bike at a time."]
	tips = {"ticket": "Match the ticket to what the rider says: grinding and orange means chain; soft tire means flat.",
		"quote": "Quote = (part + labour) × 1.05. GST is 5% of the whole bill, labour too.",
		"wait": "Serve the desk between trips: riders give up if nobody comes.", "rack": "Clear the pick-up rack: finished bikes need room."}
	var props := [
		{"k": "counter", "x": 2, "y": 5, "w": 3, "color": "#3f7f9a", "solid": true}, {"k": "register", "x": 3, "y": 5, "id": "desk", "label": "Front desk", "solid": true},
		{"k": "bike", "x": 8, "y": 3, "id": "s1", "label": "Repair stand 1", "solid": true}, {"k": "bike", "x": 10, "y": 3, "id": "s2", "label": "Repair stand 2", "color": "#e2574c", "solid": true},
		{"k": "bike_rack", "x": 11, "y": 6, "id": "rack", "label": "Pick-up rack", "solid": true},
		{"k": "shelf", "x": 5, "y": 2, "w": 2, "color": "#5d6370", "solid": true}, {"k": "toolbox", "x": 9, "y": 2, "solid": true},
		{"k": "tag", "x": 3, "y": 5, "title": "SERVICE DESK"}, {"k": "tag", "x": 8, "y": 3, "title": "STAND 1"}, {"k": "tag", "x": 10, "y": 3, "title": "STAND 2"},
		{"k": "tag", "x": 11, "y": 6, "title": "PICK-UP"}, {"k": "tag", "x": 5, "y": 2, "w": 2, "title": "PARTS"},
		{"k": "plant", "x": 1, "y": 2, "solid": true}, {"k": "mat", "x": 6, "y": 7}]
	room_map = {"name": place, "w": 13, "h": 9, "room": {"floor": "concrete", "wall": "#e2e8ea", "exit": 6, "windows": [3]}, "props": props}
	stations = {"desk": {"stand": Vector2i(3, 4), "tile": Vector2i(3, 5)}, "s1": {"stand": Vector2i(8, 4), "tile": Vector2i(8, 3)},
		"s2": {"stand": Vector2i(10, 4), "tile": Vector2i(10, 3)}, "rack": {"stand": Vector2i(10, 6), "tile": Vector2i(11, 6)}}


func twists() -> Array:
	return [
		{"name": "First shift", "line": "Bea shows you the desk, the stands and the rack. A slow Monday.", "rate": 0.7},
		{"name": "Tuesday", "line": "A normal day at the desk."},
		{"name": "Saturday rush", "line": "Sunny Saturday: everyone's bike broke at once.", "rate": 1.2},
		{"name": "New price list", "line": "Labour went up $5 on every job today. The price list on the card is new.", "labour": 500},
		{"name": "Rush jobs", "line": "Some riders pay a $10 rush fee. Put it in the quote (GST too).", "rush": 0.4},
		{"name": "Club ride", "line": "The cycling club rides tomorrow. Bikes keep coming in.", "rate": 1.15},
		{"name": "Commuters", "line": "Commuters need their bikes back fast. They wait less.", "pat": 0.8},
		{"name": "Spring tune-ups", "line": "Spring tune-up season: the busiest day of the year.", "rate": 1.3}]


func setup(st: Dictionary) -> void:
	st.next = 1.0
	st.bikes = {}      # ticket number → { c (customer id), problem, ticket, quote_ok, at: "desk" | "s1" | "s2" | "rack" | "carry", until, done }
	st.stand = {"s1": 0, "s2": 0}
	st.rack = []
	st.held = 0
	st.nt = 11
	st.fixed = 0


func tick(st: Dictionary, dt: float) -> void:
	st.next = float(st.next) - dt * busy(st) * float(tw(st, "rate", 1.0))
	if st.next <= 0.0:
		st.next = (13.0 if not st.real else 11.0) * (0.75 + 0.5 * rnd(st))
		st.demand = int(st.demand) + 1
		if _desk_q(st).size() >= QUEUE.size():
			lose(st, QUEUE[-1], "wait", "The line was out the door. A rider took their bike somewhere else.")
		else:
			var keys := REPAIRS.keys()
			var c := add_cust(st, {"state": "new", "problem": keys[irand(st, 0, keys.size() - 1)], "step": "ticket", "rush": rnd(st) < float(tw(st, "rush", 0.0)),
				"pat0": (40.0 if not st.real else 32.0) * float(tw(st, "pat", 1.0))})
			c.pat = c.pat0
			c.bub = "bike"
	# repairs
	for s in STANDS:
		var tn := int(st.stand[s])
		if tn and not st.bikes[tn].done:
			st.bikes[tn].until = float(st.bikes[tn].until) - dt
			if float(st.bikes[tn].until) <= 0.0:
				st.bikes[tn].done = true
				pop(st, STANDS[s], "fixed", true)
	# riders come back once their bike is on the rack
	for tn in st.rack:
		var b: Dictionary = st.bikes[tn]
		if not b.get("called", false):
			b.wait = float(b.get("wait", 3.0 + rnd(st) * 4.0)) - dt
			if float(b.wait) <= 0.0:
				b.called = true
				var c := add_cust(st, {"state": "pickup", "tn": tn, "pat0": (40.0 if not st.real else 32.0) * float(tw(st, "pat", 1.0))})
				c.pat = c.pat0
				c.bub = "t:#%d" % tn
	for c in _desk_q(st):
		c.pat = float(c.pat) - dt * (0.5 if st.at == "desk" and _desk_q(st).find(c) == 0 else 1.0)
		c.ring = float(c.pat) / float(c.pat0)
		if c.pat <= 0.0:
			drop(st, c)
			if c.state == "pickup":
				c.pat = 0
				st.bikes[c.tn].called = false
				st.bikes[c.tn].wait = 6.0
				oops(st, Vector2i(c.x, c.y), "wait", "A rider waited too long for their bike and left angry. They'll be back.")
			else:
				lose(st, Vector2i(c.x, c.y), "wait", "A rider waited too long at the desk and left.")
	line_up(_desk_q(st), QUEUE)


func _desk_q(st: Dictionary) -> Array:
	return st.cust.filter(func(c): return c.state in ["new", "pickup"])


func card(st: Dictionary) -> Dictionary:
	var sid := str(st.at)
	if sid == "desk":
		var q := _desk_q(st)
		var waiting: int = st.bikes.keys().filter(func(tn): return st.bikes[tn].at == "desk").size()
		var note := "Bikes waiting at the desk for a stand: %d." % waiting if waiting else ""
		var grab := [{"t": "Take a waiting bike (%d)" % waiting, "a": "grab"}] if waiting and int(st.held) == 0 else []
		if q.is_empty():
			return {"title": "Front desk", "lines": ["Nobody at the desk."] + ([note] if note != "" else []), "opts": grab, "cols": 1}
		var c: Dictionary = q[0]
		if c.state == "pickup":
			var b: Dictionary = st.bikes[c.tn]
			return {"title": "Front desk · pick-up, ticket #%d" % int(c.tn), "lines": ["\"I'm here for my bike.\"", "Ticket: %s · quoted %s" % [REPAIRS[b.ticket][0], cash(b.quote)]],
				"opts": [{"t": "Hand over the bike", "a": "hand", "k": "primary"}] + grab, "cols": 2 if grab.size() else 1}
		if c.step == "ticket":
			var opts := []
			var keys := [c.problem]
			var others := REPAIRS.keys().filter(func(k): return k != c.problem)
			var k0 := int(c.id) % others.size()
			for i in (3 if st.real else 2):
				keys.append(others[(k0 + i) % others.size()])
			var off := int(c.id) % keys.size()
			for i in keys.size():
				var k: String = keys[(i + off) % keys.size()]
				opts.append({"t": REPAIRS[k][0], "a": "ticket:" + k})
			return {"title": "Front desk · new repair", "lines": ["\"%s\"" % REPAIRS[c.problem][1]] + (["Rush: they'll pay the $10 rush fee."] if c.rush else []), "opts": opts + grab, "cols": 2}
		var t: String = c.ticket
		var r: Array = REPAIRS[t]
		var pr := _price_for(st, c, t)
		var L := ["Ticket: %s. %s %s + labour %s%s." % [r[0], r[2], cash_w(pr.part), cash_w(pr.lab), (" + rush %s" % cash_w(pr.rush)) if pr.rush else ""]]
		if not st.real:
			L.append("Subtotal: %s. Add 5%% GST." % cash(pr.part + pr.lab + pr.rush))
		else:
			L.append("Quote the total with 5% GST.")
		var right: int = pr.total
		var no_gst: int = pr.part + pr.lab + pr.rush
		var gst_part: int = roundi(float(pr.part) * 1.05) + pr.lab + pr.rush
		var no_lab: int = roundi(float(pr.part + pr.rush) * 1.05)
		var choices := [right, no_gst, no_lab if st.real else gst_part]
		if choices[2] == right or choices[2] == no_gst:
			choices[2] = right + 500
		var opts := []
		var off2 := int(c.id) % 3
		for i in 3:
			var v: int = choices[(i + off2) % 3]
			opts.append({"t": "Quote %s" % cash(v), "a": "quote:%d" % v})
		return {"title": "Front desk · quote", "lines": L, "opts": opts + grab, "cols": 3}
	if STANDS.has(sid):
		var tn := int(st.stand[sid])
		if tn == 0:
			return {"title": "Repair stand %s" % sid.substr(1), "lines": ["Free. Bring a bike from the desk." if int(st.held) == 0 else "Free."], "opts": []}
		var b: Dictionary = st.bikes[tn]
		return {"title": "Repair stand %s · ticket #%d" % [sid.substr(1), tn], "lines": [("Fixed! Take it to the pick-up rack." if b.done else "The mechanic is working on it: %s." % REPAIRS[b.ticket][0].to_lower())], "opts": []}
	if sid == "rack":
		return {"title": "Pick-up rack", "lines": ["Bikes ready: %d of %d." % [st.rack.size(), RACK_MAX]], "opts": []}
	return {}


func _price_for(st: Dictionary, c: Dictionary, t: String) -> Dictionary:
	var r: Array = REPAIRS[t]
	var part := int(r[3])
	var lab := int(r[4]) + int(tw(st, "labour", 0))
	var rush := 1000 if c.rush else 0
	return {"part": part, "lab": lab, "rush": rush, "total": roundi(float(part + lab + rush) * 1.05)}


func act(st: Dictionary, a: String) -> void:
	if st.at != "desk":
		return
	if a == "grab":
		if int(st.held) == 0:
			_grab_desk_bike(st)
		return
	var q := _desk_q(st)
	if q.is_empty():
		return
	var c: Dictionary = q[0]
	var at: Vector2i = stations.desk.tile
	if a == "hand" and c.state == "pickup":
		var tn := int(c.tn)
		var b: Dictionary = st.bikes[tn]
		st.rack.erase(tn)
		b.at = "gone"
		drop(st, c)
		if b.ticket != b.problem:
			oops(st, at, "ticket", "\"It's still %s!\" The ticket said %s. The shop fixes it for free." % [REPAIRS[b.problem][1].substr(0, 1).to_lower() + REPAIRS[b.problem][1].substr(1).trim_suffix("."), REPAIRS[b.ticket][0].to_lower()])
		elif not b.quote_ok:
			oops(st, at, "quote", "\"That's not what you told me!\" The quote was wrong, so the shop takes the loss.")
		else:
			st.fixed = int(st.fixed) + 1
			win(st, at, "+1", "Ticket #%d: fixed, paid, and pedalling away." % tn)
		return
	if c.state != "new":
		return
	if a.begins_with("ticket:") and c.step == "ticket":
		c.ticket = a.substr(7)
		c.step = "quote"
		return
	if a.begins_with("quote:") and c.step == "quote":
		var v := int(a.substr(6))
		var tn := int(st.nt)
		st.nt = tn + 1
		var right: int = _price_for(st, c, c.ticket).total
		st.bikes[tn] = {"c": c.id, "problem": c.problem, "ticket": c.ticket, "quote": v, "quote_ok": v == right, "at": "desk", "until": 0.0, "done": false}
		drop(st, c)
		st.msg = "Ticket #%d written. \"Thanks! I'll be back for it.\" Take the bike to a stand." % tn


func on_at(st: Dictionary, sid: String) -> void:
	st.at = sid
	var held := int(st.held)
	if sid == "desk" and held == 0:
		return
	if STANDS.has(sid):
		var tn := int(st.stand[sid])
		if held != 0 and tn == 0:
			st.stand[sid] = held
			st.bikes[held].at = sid
			st.bikes[held].until = (11.0 + rnd(st) * 6.0) * (1.0 if not st.real else 1.1)
			st.held = 0
			st.msg = "Bike #%d is on stand %s. The mechanic gets to work." % [held, sid.substr(1)]
		elif held == 0 and tn != 0 and st.bikes[tn].done:
			st.held = tn
			st.stand[sid] = 0
			st.bikes[tn].at = "carry"
			st.msg = "You have bike #%d. Take it to the pick-up rack." % tn
		return
	if sid == "rack" and held != 0 and st.bikes[held].done:
		if st.rack.size() >= RACK_MAX:
			st.msg = "The rack is full. Hand some bikes back first."
			return
		st.rack.append(held)
		st.bikes[held].at = "rack"
		st.held = 0
		st.msg = "Bike #%d is on the rack. Its rider will come for it." % held


## Pick up a bike waiting at the desk (when you walk up with empty hands and nobody is in line, or press Space again).
func _grab_desk_bike(st: Dictionary) -> bool:
	for tn in st.bikes:
		if st.bikes[tn].at == "desk":
			st.held = tn
			st.bikes[tn].at = "carry"
			st.msg = "You have bike #%d. Take it to a free stand." % tn
			return true
	return false


func best(st: Dictionary) -> Dictionary:
	var held := int(st.held)
	if held != 0:
		if st.bikes[held].done:
			return {"go": "rack", "think": 0.4}
		for s in STANDS:
			if int(st.stand[s]) == 0:
				return {"go": s, "think": 0.4}
		return {}
	# finished bike on a stand, and room on the rack
	for s in STANDS:
		var tn := int(st.stand[s])
		if tn and st.bikes[tn].done and st.rack.size() < RACK_MAX:
			return {"go": s, "think": 0.4}
	var q := _desk_q(st)
	var free_stand: bool = STANDS.keys().any(func(s): return int(st.stand[s]) == 0)
	var desk_bike: bool = st.bikes.keys().any(func(tn): return st.bikes[tn].at == "desk")
	if q.size():
		var c: Dictionary = q[0]
		if not (desk_bike and free_stand and float(c.pat) > 18.0):
			if st.at != "desk":
				return {"go": "desk"}
			if c.state == "pickup":
				return {"go": "desk", "a": "hand", "think": 0.8}
			if c.step == "ticket":
				return {"go": "desk", "a": "ticket:" + str(c.problem), "think": 1.8}
			return {"go": "desk", "a": "quote:%d" % _price_for(st, c, c.ticket).total, "think": 2.0}
	if desk_bike and free_stand:
		return {"go": "desk", "a": "grab", "think": 0.3}
	return {}


func actions(st: Dictionary) -> Array:
	return card(st).get("opts", []).map(func(o): return o.a)


func marks(st: Dictionary) -> Array:
	var out := []
	for s in STANDS:
		var tn := int(st.stand[s])
		if tn:
			out.append({"x": STANDS[s].x, "y": STANDS[s].y, "bub": "done" if st.bikes[tn].done else "wrench"})
	var waiting: int = st.bikes.keys().filter(func(tn): return st.bikes[tn].at == "desk").size()
	if waiting:
		out.append({"x": 2, "y": 5, "bub": "t:%d" % waiting if waiting > 1 else "bike"})
	if st.rack.size():
		out.append({"x": 11, "y": 6, "bub": "t:%d" % st.rack.size()})
	return out


func pending(st: Dictionary) -> int:
	var n := _desk_q(st).filter(func(c): return c.state == "new").size()
	for tn in st.bikes:
		if st.bikes[tn].at != "gone":
			n += 1
	return n


func tally(st: Dictionary) -> Array:
	var waiting: int = st.bikes.keys().filter(func(tn): return st.bikes[tn].at == "desk").size()
	return [["At the desk", str(_desk_q(st).size())], ["Bikes to place", str(waiting)], ["Holding", ("#%d" % int(st.held)) if int(st.held) else "—"], ["Fixed", str(st.fixed)]]


func earn_line(st: Dictionary) -> String:
	return "%d bikes fixed and handed back. On a salary your pay is the same every payday, busy or slow; great work counts at your review." % int(st.fixed)
