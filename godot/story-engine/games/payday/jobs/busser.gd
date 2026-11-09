# The Lantern Diner (busser, wage + tips): Turn the tables. Parties of 2 or 4 wait at the door; the host seats a party at a
# set table that is big enough. When a party leaves, the table is dirty: clear it into your tub (it holds 2 tables of dishes),
# empty the tub at the dish pit, and set the table again with setups from the server station (one setup a seat).
# Walking up to a table where people are still eating costs a point: it rushes them. A party that waits too long leaves.
# Every party that eats tips its server, and servers tip out the busser: that is the "tips" in this job's pay.
extends "res://games/payday/jobs/job.gd"

const TABLES := {
	"t1": {"tile": Vector2i(2, 3), "seats": 2, "stand": Vector2i(2, 4)}, "t2": {"tile": Vector2i(2, 6), "seats": 2, "stand": Vector2i(2, 5)},
	"t3": {"tile": Vector2i(5, 3), "seats": 4, "stand": Vector2i(5, 4)}, "t4": {"tile": Vector2i(5, 6), "seats": 4, "stand": Vector2i(5, 5)},
	"t5": {"tile": Vector2i(8, 3), "seats": 4, "stand": Vector2i(8, 4)}, "t6": {"tile": Vector2i(8, 6), "seats": 2, "stand": Vector2i(8, 5)}}
const QUEUE := [Vector2i(7, 7), Vector2i(8, 7), Vector2i(9, 7), Vector2i(10, 7), Vector2i(5, 7), Vector2i(4, 7)]
const SPILLS := [Vector2i(4, 4), Vector2i(7, 5), Vector2i(3, 5)]
const TUB := 2
const SETUPS := 8


func _init() -> void:
	id = "busser"
	name = "Table turn"
	place = "The Lantern Diner · dining room"
	pay = "tips"
	start = Vector2i(10, 4)
	boss_at = Vector2i(11, 7)
	hour = 17
	react = {"great": "You flew around this place! Table six never looked so clean.", "ok": "Not bad! The tables got done.", "poor": "Rough night. People were waiting at the door."}
	th = {"gentle": [0.8, 0.72, 0.62, 0.5], "real": [0.78, 0.68, 0.62, 0.5]}
	controls = ["A dirty table (plate bubble): walk up and clear it into your tub. Empty the tub at the dish pit.",
		"Set a clear table with setups from the server station: a 4-top needs 4. Parties at the door need a table their size.",
		"Never clear a table while people are still eating. Space or a tap works at any station."]
	tips = {"rush": "Wait for the plate bubble. Walking up to a table that is still eating rushes the guests.",
		"door": "Watch the party sizes at the door: turn a table that fits the next party first.",
		"tub": "Empty the tub on the way past the dish pit, before it is full.",
		"spill": "Mop a spill right away. Someone slips every few seconds it stays."}
	var props := [
		{"k": "sink", "x": 10, "y": 2, "w": 2, "id": "pit", "label": "Dish pit", "solid": true},
		{"k": "counter", "x": 11, "y": 4, "h": 2, "id": "station", "label": "Server station", "color": "#7a4a2c", "solid": true},
		{"k": "host", "x": 10, "y": 6, "solid": true}, {"k": "mop", "x": 1, "y": 7, "id": "mop", "label": "Mop", "solid": true},
		{"k": "tag", "x": 10, "y": 2, "w": 2, "title": "DISH PIT"}, {"k": "tag", "x": 11, "y": 4, "h": 2, "title": "SETUPS"},
		{"k": "vending", "x": 1, "y": 2, "solid": true}, {"k": "plant", "x": 11, "y": 7, "solid": false}, {"k": "mat", "x": 6, "y": 7}]
	for tid in TABLES:
		var tb: Dictionary = TABLES[tid]
		props.append({"k": "table", "x": tb.tile.x, "y": tb.tile.y, "id": tid, "label": "Table %s (%d seats)" % [tid.substr(1), tb.seats], "solid": true})
		for s in _seats(tid):
			props.append({"k": "chair", "x": s.x, "y": s.y, "solid": false})
	room_map = {"name": place, "w": 13, "h": 9, "room": {"floor": "wood", "wall": "#f1e1cf", "exit": 6, "windows": [3, 7]}, "props": props}
	stations = {"pit": {"stand": Vector2i(10, 3), "tile": Vector2i(10, 2)}, "station": {"stand": Vector2i(10, 4), "tile": Vector2i(11, 4)},
		"mop": {"stand": Vector2i(1, 6), "tile": Vector2i(1, 7)}}
	for tid in TABLES:
		stations[tid] = {"stand": TABLES[tid].stand, "tile": TABLES[tid].tile}


## Where the guests sit round a table (chairs): 2-tops left and right; 4-tops also above.
func _seats(tid: String) -> Array:
	var t: Vector2i = TABLES[tid].tile
	var out := [t + Vector2i(-1, 0), t + Vector2i(1, 0)]
	if int(TABLES[tid].seats) == 4:
		out += [t + Vector2i(0, -1), t + Vector2i(0, 1)]
	return out


func twists() -> Array:
	return [
		{"name": "First shift", "line": "A quiet Tuesday. Ms. Pereira shows you the tub, the dish pit and the setups.", "rate": 0.75, "four": 0.3},
		{"name": "Dinner service", "line": "A normal dinner. Keep the tables turning.", "four": 0.45},
		{"name": "Lunch rush", "line": "Lunch crowd: people eat fast and go back to work.", "eat": 0.7, "four": 0.4},
		{"name": "Spilled drinks", "line": "Somebody always knocks over a drink. Mop spills before anyone slips.", "four": 0.45, "spill": true},
		{"name": "Short-staffed", "line": "The other busser called in sick. Two tables are dirty already.", "rate": 1.15, "four": 0.45, "dirty": 3},
		{"name": "Big parties", "line": "Families tonight: lots of parties of four.", "four": 0.7},
		{"name": "Exam week", "line": "Exam week: a short shift.", "four": 0.45, "len": 90.0},
		{"name": "Holiday parties", "line": "Holiday parties: the door is busy all night.", "rate": 1.35, "four": 0.6}]


func setup(st: Dictionary) -> void:
	st.tub = 0
	st.setups = SETUPS
	st.tables = {}
	st.next = 1.0
	st.spill = null
	st.spill_at = 0.0
	st.next_spill = 15.0
	st.groups = 0
	var start_states := ["eat", "eat", "eat", "dirty", "dirty", "set"]
	if int(tw(st, "dirty", 0)) == 3:
		start_states = ["eat", "eat", "dirty", "dirty", "dirty", "set"]
	start_states = shuffled(st, start_states)
	var i := 0
	for tid in TABLES:
		var s: String = start_states[i]
		st.tables[tid] = {"s": s, "until": 3.0 + rnd(st) * 12.0, "g": 0}
		if s == "eat":
			st.tables[tid].g = _new_group(st, int(TABLES[tid].seats), "eat", tid)
		elif s == "dirty":
			st.demand = int(st.demand) + 1
		i += 1


func _new_group(st: Dictionary, size: int, state: String, tid := "") -> int:
	st.groups = int(st.groups) + 1
	var g := int(st.groups)
	var c := add_cust(st, {"state": state, "size": size, "g": g, "table": tid, "pat0": 32.0 if not st.real else 24.0})
	c.pat = c.pat0
	if state == "eat":
		c.x = TABLES[tid].tile.x - 1
		c.y = TABLES[tid].tile.y
	return g


func _eat_time(st: Dictionary) -> float:
	return (12.0 + rnd(st) * 8.0) * (1.0 if not st.real else 0.85) * float(tw(st, "eat", 1.0))


func tick(st: Dictionary, dt: float) -> void:
	st.next = float(st.next) - dt * busy(st) * float(tw(st, "rate", 1.0))
	if st.next <= 0.0:
		st.next = (5.6 if not st.real else 4.7) * (0.75 + 0.5 * rnd(st))
		var size := 4 if rnd(st) < float(tw(st, "four", 0.45)) else 2
		st.demand = int(st.demand) + 1
		if custs(st, "wait").size() >= QUEUE.size():
			lose(st, QUEUE[-1], "door", "The line at the door was out onto the street. A party went somewhere else.")
		else:
			_new_group(st, size, "wait")
	# eating → dirty
	for tid in TABLES:
		var t: Dictionary = st.tables[tid]
		if t.s == "eat":
			t.until = float(t.until) - dt
			if t.until <= 0.0:
				t.s = "dirty"
				st.demand = int(st.demand) + 1
				for c in st.cust.duplicate():
					if c.state == "eat" and c.table == tid:
						drop(st, c)
				var tip := irand(st, 3, 7) * 50
				st.money = int(st.money) + tip
				pop(st, TABLES[tid].tile, "+%s tip-out" % cash(tip), true)
	# waiting parties: patience, then the host seats the first that fits
	var waiting := custs(st, "wait")
	for c in waiting:
		c.pat = float(c.pat) - dt
		c.ring = float(c.pat) / float(c.pat0)
		c.bub = "t:%d" % int(c.size)
		if c.pat <= 0.0:
			drop(st, c)
			lose(st, Vector2i(c.x, c.y), "door", "A party of %d waited too long at the door and left." % int(c.size))
	waiting = custs(st, "wait")
	for c in waiting:
		var best_t := ""
		for tid in TABLES:
			if st.tables[tid].s == "set" and int(TABLES[tid].seats) >= int(c.size):
				if best_t == "" or int(TABLES[tid].seats) < int(TABLES[best_t].seats):
					best_t = tid
		if best_t != "":
			_seat(st, c, best_t)
			break
	line_up(custs(st, "wait"), QUEUE)
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
				st.next_spill = 14.0 + rnd(st) * 8.0
			elif st.spill_at >= (9.0 if not st.real else 7.0):
				lose(st, st.spill, "spill", "A guest slipped on the spill. They're okay, but the night is over for them.")
				st.spill_at = 0.0


func _seat(st: Dictionary, c: Dictionary, tid: String) -> void:
	var t: Dictionary = st.tables[tid]
	t.s = "eat"
	t.until = _eat_time(st)
	c.state = "eat"
	c.table = tid
	c.bub = ""
	c.ring = -1.0
	var seats := _seats(tid)
	c.x = seats[0].x
	c.y = seats[0].y
	for k in range(1, int(c.size)):   # the rest of the party comes in from the door
		var m := add_cust(st, {"state": "eat", "table": tid, "g": c.g, "size": c.size})
		m.x = seats[k].x
		m.y = seats[k].y
	win(st, TABLES[tid].tile, "+1", "The host seats a party of %d at table %s." % [int(c.size), tid.substr(1)])


func on_at(st: Dictionary, sid: String) -> void:
	st.at = sid
	if sid == "pit":
		if int(st.tub) > 0:
			st.msg = "Tub emptied at the dish pit."
			st.tub = 0
		return
	if sid == "station":
		if int(st.setups) < SETUPS:
			st.setups = SETUPS
			st.msg = "You take an armful of setups: %d." % SETUPS
		return
	if sid == "mop":
		st.carry = "" if st.carry == "mop" else "mop"
		st.msg = "You have the mop. Walk over the spill." if st.carry == "mop" else "Mop back in the corner."
		return
	if not TABLES.has(sid):
		return
	var t: Dictionary = st.tables[sid]
	var at: Vector2i = TABLES[sid].tile
	match str(t.s):
		"eat":
			if float(st.t) - float(t.get("rushed", -9.0)) > 2.0:   # a second press right away doesn't cost again
				t.rushed = float(st.t)
				oops(st, at, "rush", "They're still eating! Wait for the plate bubble.")
		"dirty":
			if int(st.tub) >= TUB:
				st.msg = "Your tub is full. Empty it at the dish pit first."
				return
			st.tub = int(st.tub) + 1
			t.s = "bare"
			win(st, at, "+1", "Table %s cleared. Now set it." % sid.substr(1))
		"bare":
			var need := int(TABLES[sid].seats)
			if int(st.setups) < need:
				st.msg = "You need %d setups for this table and have %d. Get more at the server station." % [need, int(st.setups)]
				return
			st.setups = int(st.setups) - need
			t.s = "set"
			st.msg = "Table %s is set for %d." % [sid.substr(1), need]


func card(st: Dictionary) -> Dictionary:
	var sid := str(st.at)
	if TABLES.has(sid):
		var t: Dictionary = st.tables[sid]
		var word: String = {"eat": "people are eating", "dirty": "dirty: clear it", "bare": "clear: set it", "set": "set and ready for a party"}[t.s]
		return {"title": "Table %s · %d seats" % [sid.substr(1), int(TABLES[sid].seats)], "lines": ["Now: %s." % word, "Tub: %d of %d   ·   Setups: %d" % [int(st.tub), TUB, int(st.setups)]], "opts": []}
	if sid == "pit":
		return {"title": "Dish pit", "lines": ["Tub: %d of %d." % [int(st.tub), TUB]], "opts": []}
	if sid == "station":
		return {"title": "Server station", "lines": ["Setups in your arms: %d of %d." % [int(st.setups), SETUPS]], "opts": []}
	return {}


func _door_sizes(st: Dictionary) -> Array:
	return custs(st, "wait").map(func(c): return int(c.size))


func best(st: Dictionary) -> Dictionary:
	if st.spill != null and st.carry == "mop":
		return {"go": "@%d,%d" % [st.spill.x, st.spill.y]}
	if st.spill != null and float(st.spill_at) < 5.0:
		return {"go": "mop"}
	var sizes := _door_sizes(st)
	var want := int(sizes[0]) if sizes.size() else 0
	# a table that is clear and would fit the next party: set it
	var bare := ""
	var dirty := ""
	for tid in TABLES:
		var s: String = st.tables[tid].s
		var fits: bool = int(TABLES[tid].seats) >= want
		if s == "bare" and (bare == "" or (fits and int(TABLES[bare].seats) < want)):
			bare = tid
		if s == "dirty" and (dirty == "" or (fits and int(TABLES[dirty].seats) < want)):
			dirty = tid
	var set_ready := TABLES.keys().filter(func(tid): return st.tables[tid].s == "set" and int(TABLES[tid].seats) >= want).size()
	if bare != "" and (set_ready == 0 or dirty == ""):
		if int(st.setups) >= int(TABLES[bare].seats):
			return {"go": bare, "think": 0.7}
		return {"go": "station", "think": 0.7}
	if dirty != "":
		if int(st.tub) >= TUB:
			return {"go": "pit", "think": 0.7}
		return {"go": dirty, "think": 0.7}
	if bare != "":
		return {"go": bare if int(st.setups) >= int(TABLES[bare].seats) else "station", "think": 0.7}
	if int(st.tub) > 0:
		return {"go": "pit", "think": 0.7}
	if int(st.setups) < SETUPS:
		return {"go": "station", "think": 0.7}
	return {}


func marks(st: Dictionary) -> Array:
	var out := []
	for tid in TABLES:
		var s: String = st.tables[tid].s
		var b: String = {"dirty": "dish", "set": "set"}.get(s, "")
		if b != "":
			out.append({"x": TABLES[tid].tile.x, "y": TABLES[tid].tile.y, "bub": b})
	if st.spill != null:
		out.append({"x": st.spill.x, "y": st.spill.y, "bub": "drop", "ring": 1.0 - float(st.spill_at) / (7.0 if st.real else 9.0), "floor": true})
	return out


func pending(st: Dictionary) -> int:
	var n := custs(st, "wait").size() + (1 if st.spill != null else 0)
	for tid in TABLES:
		if st.tables[tid].s == "dirty":
			n += 1
	return n


func tally(st: Dictionary) -> Array:
	var sizes := _door_sizes(st).map(func(n): return str(n))
	return [["At the door", ", ".join(sizes) if sizes.size() else "nobody"], ["Tub / setups", "%d/%d · %d" % [int(st.tub), TUB, int(st.setups)]], ["Tip-out", cash_w(st.money)]]


func earn_line(st: Dictionary) -> String:
	return "Servers tipped you out %s tonight. Tips change every shift (busy nights pay more), so plan with your wage and treat tips as extra." % cash(st.money)
