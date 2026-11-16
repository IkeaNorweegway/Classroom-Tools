# Riverbend Clinic (office coordinator, salary): Front desk. Three jobs at once:
#  · The phone rings: book the caller into the time they ask for on the week's calendar. Never double-book; when the first
#    choice is full, use their second choice. A call not answered in time goes to voicemail. (Shift 6: one caller describes an
#    emergency: the only right answer is to tell them to call 911.)
#  · Patients check in at the window: find them on today's list. Some came on the wrong day, and some names look alike.
#  · A checked-in patient waits until their chart is in the doctor's tray: take it from the file cabinet (you can carry 3).
extends "res://games/payday/jobs/job.gd"

const DAYS := ["Mon", "Tue", "Wed", "Thu", "Fri"]
const DAY_NAMES := ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const NAMES := [["Priya Shah", "Priya Shaw"], ["Daniel Lee", "Danielle Lee"], ["Maria Lopez", "Mario Lopez"], ["Tom Nguyen", "Tam Nguyen"],
	["Aisha Bello", "Aisha Bell"], ["Ben Clarke", "Ben Clark"], ["Grace Kim", "Grace King"], ["Omar Haddad", "Omar Hadad"],
	["Lucy Martin", "Lucie Martin"], ["Sam Okoro", "Sam Okafor"], ["Ella Brown", "Ellie Brown"], ["Jon Wong", "John Wong"]]
const WINDOW_Q := [Vector2i(3, 5), Vector2i(4, 6), Vector2i(3, 6), Vector2i(5, 6), Vector2i(2, 6)]
const SEATS := [Vector2i(8, 6), Vector2i(9, 6), Vector2i(10, 6), Vector2i(8, 7), Vector2i(10, 7), Vector2i(11, 7)]
const CARRY := 3


func _init() -> void:
	id = "office"
	name = "Front desk"
	place = "Riverbend Clinic · front office"
	pay = "salary"
	start = Vector2i(5, 4)
	boss_at = Vector2i(1, 7)
	hour = 9
	react = {"great": "Not one mistake in the calendar. Wonderful.", "ok": "The schedule held together. Thank you.", "poor": "Two patients showed up for the same time. That can’t happen."}
	th = {"gentle": [0.8, 0.7, 0.65, 0.5], "real": [0.78, 0.66, 0.65, 0.5]}
	controls = ["Phone ringing? Answer it and book the time the caller asks for. A slot with × is taken: never double-book.",
		"At the window, find the patient on today's list before you check them in. Watch for look-alike names.",
		"Then take their chart from the file cabinet to the doctor's tray, so the doctor can call them in."]
	tips = {"double": "A slot marked × is taken. Use the caller's second choice.", "slot": "Book exactly the day and time the caller asked for.",
		"missed": "Answer the phone quickly: after a few rings it goes to voicemail.", "list": "Read the whole name on today's list: Shah and Shaw are different people.",
		"chart": "Match the chart to the name you checked in.", "wait": "Get charts to the tray: patients can't see the doctor without one.",
		"urgent": "Chest pain or trouble breathing is an emergency: tell them to call 911 now."}
	room_map = {"name": place, "w": 13, "h": 9, "room": {"floor": "tile", "wall": "#e8f0f2", "exit": 6, "windows": [9]},
		"props": [
			{"k": "counter", "x": 2, "y": 4, "w": 3, "id": "window", "label": "Check-in window", "color": "#8a63c8", "solid": true},
			{"k": "desk", "x": 6, "y": 2, "id": "phone", "label": "Phone", "solid": true},
			{"k": "shelf", "x": 1, "y": 2, "w": 2, "id": "files", "label": "File cabinet", "color": "#9aa0a6", "solid": true},
			{"k": "counter", "x": 11, "y": 3, "id": "tray", "label": "Doctor's tray", "color": "#2e9a9a", "solid": true},
			{"k": "printer", "x": 9, "y": 2, "solid": true}, {"k": "board", "x": 4, "y": 2, "w": 1, "solid": true},
			{"k": "tag", "x": 2, "y": 4, "w": 3, "title": "CHECK-IN"}, {"k": "tag", "x": 6, "y": 2, "title": "PHONE"},
			{"k": "tag", "x": 1, "y": 2, "w": 2, "title": "CHARTS"}, {"k": "tag", "x": 11, "y": 3, "title": "DOCTOR", "color": "#1f6b6b"},
			{"k": "chair", "x": 8, "y": 6}, {"k": "chair", "x": 9, "y": 6}, {"k": "chair", "x": 10, "y": 6}, {"k": "chair", "x": 8, "y": 7},
			{"k": "chair", "x": 10, "y": 7}, {"k": "chair", "x": 11, "y": 7}, {"k": "plant", "x": 11, "y": 5, "solid": true}, {"k": "mat", "x": 6, "y": 7}]}
	stations = {"window": {"stand": Vector2i(3, 3), "tile": Vector2i(3, 4)}, "phone": {"stand": Vector2i(6, 3), "tile": Vector2i(6, 2)},
		"files": {"stand": Vector2i(2, 3), "tile": Vector2i(1, 2)}, "tray": {"stand": Vector2i(10, 3), "tile": Vector2i(11, 3)}}


func twists() -> Array:
	return [
		{"name": "First shift", "line": "Ms. Ahmed shows you the phone, the window and the charts. A quiet morning.", "rate": 0.7, "calls": 0.5},
		{"name": "A normal day", "line": "Phones, patients and charts. Keep the calendar clean.", "calls": 0.5},
		{"name": "Flu clinic", "line": "Flu shots today: lots of patients at the window.", "calls": 0.35, "rate": 1.0},
		{"name": "Busy phones", "line": "Everyone wants an appointment this week. The phone keeps ringing.", "calls": 0.7},
		{"name": "Second choices", "line": "The week is filling up. Callers give a second choice in case the first is full.", "calls": 0.55, "full": 0.6},
		{"name": "An urgent call", "line": "Most calls are bookings. If a caller describes an emergency, they need 911, not an appointment.", "calls": 0.5, "urgent": true},
		{"name": "Look-alike names", "line": "Lots of similar names today. Read today's list carefully.", "calls": 0.45, "alike": 0.6},
		{"name": "After the long weekend", "line": "Monday after a long weekend: everyone needs the clinic.", "calls": 0.5, "rate": 1.05}]


func setup(st: Dictionary) -> void:
	st.next = 1.0
	st.slots = _times(st).size()
	st.cal = []
	for d in 5:
		var row := []
		for t in int(st.slots):
			row.append(rnd(st) < 0.35)
		st.cal.append(row)
	st.ring = null
	st.ring_next = 4.0
	st.charts = []
	st.today = []      # names booked today (the check-in list)
	st.urgent_done = false
	st.booked = 0


func _new_week(st: Dictionary) -> void:
	for d in 5:
		for t in int(st.slots):
			st.cal[d][t] = rnd(st) < 0.35
	st.msg = "That week is full. The calendar turns to next week."


func _times(st: Dictionary) -> Array:
	return ["9:00", "11:00", "2:00", "4:00"] if st.real else ["morning", "afternoon"]


func _free(st: Dictionary) -> Array:
	var out := []
	for d in 5:
		for t in int(st.slots):
			if not st.cal[d][t]:
				out.append([d, t])
	return out


func _slot_name(st: Dictionary, d: int, t: int) -> String:
	return "%s %s" % [DAY_NAMES[d], ("at " + _times(st)[t]) if st.real else _times(st)[t]]


func tick(st: Dictionary, dt: float) -> void:
	# patients arrive at the window
	st.next = float(st.next) - dt * busy(st) * float(tw(st, "rate", 1.0)) * (1.0 - float(tw(st, "calls", 0.5)) * 0.5)
	if st.next <= 0.0:
		st.next = (9.0 if not st.real else 7.8) * (0.75 + 0.5 * rnd(st))
		st.demand = int(st.demand) + 1
		var pair: Array = pick(st, NAMES)
		var wrong_day := rnd(st) < (0.25 if st.real else 0.15)
		var alike := rnd(st) < float(tw(st, "alike", 0.25 if st.real else 0.1))
		# today's list holds this patient (or, for a look-alike, the other name); a wrong-day patient isn't on it
		var listed: String = pair[1] if alike else pair[0]
		if not wrong_day:
			st.today.append(pair[0])
		elif alike:
			st.today.append(listed)
		if st.today.size() > 7:
			st.today.pop_front()
		if custs(st, "window").size() >= WINDOW_Q.size():
			lose(st, WINDOW_Q[-1], "wait", "The waiting line was out the door. A patient left.")
		else:
			var c := add_cust(st, {"state": "window", "who": pair[0], "booked": not wrong_day, "time": "%d:%s0" % [irand(st, 9, 15) % 12 + 1, ["0", "3"][irand(st, 0, 1)]],
				"pat0": 36.0 if not st.real else 28.0})
			c.pat = c.pat0
			c.bub = "q"
	# the phone
	if st.ring == null:
		st.ring_next = float(st.ring_next) - dt * busy(st) * float(tw(st, "rate", 1.0))
		if st.ring_next <= 0.0:
			st.ring_next = (13.0 if not st.real else 11.0) * (1.6 - float(tw(st, "calls", 0.5))) * (0.75 + 0.5 * rnd(st))
			st.demand = int(st.demand) + 1
			if tw(st, "urgent", false) and not st.urgent_done and float(st.t) > 30.0:
				st.urgent_done = true
				st.ring = {"urgent": true, "left": 14.0, "talk": false}
			else:
				if _free(st).size() < 3:   # the week is full: a new week opens
					_new_week(st)
				var free := _free(st)
				var want: Array = pick(st, free)
				var first = null
				if rnd(st) < float(tw(st, "full", 0.3 if st.real else 0.15)):
					var full := []
					for d in 5:
						for t in int(st.slots):
							if st.cal[d][t]:
								full.append([d, t])
					if full.size():
						first = pick(st, full)
				st.ring = {"urgent": false, "want": want, "first": first, "left": 14.0 if not st.real else 11.0, "talk": false}
	else:
		if not st.ring.talk:
			st.ring.left = float(st.ring.left) - dt
			if float(st.ring.left) <= 0.0:
				st.ring = null
				lose(st, stations.phone.tile, "missed", "The phone went to voicemail. That caller will try another clinic.")
	# patients in the waiting room need their chart in the tray
	for c in st.cust.duplicate():
		if c.state in ["window", "seat"]:
			var head: bool = c.state == "window" and st.at == "window" and custs(st, "window").find(c) == 0
			c.pat = float(c.pat) - dt * (0.5 if head else 1.0)
			c.ring = float(c.pat) / float(c.pat0)
			if c.pat <= 0.0:
				drop(st, c)
				lose(st, Vector2i(c.x, c.y), "wait", "A patient waited too long and left without seeing the doctor.")
	line_up(custs(st, "window"), WINDOW_Q)
	line_up(custs(st, "seat"), SEATS)


func on_at(st: Dictionary, sid: String) -> void:
	st.at = sid
	if sid == "phone" and st.ring != null:
		st.ring.talk = true
	if sid == "tray" and st.charts.size():
		for name_ in st.charts.duplicate():
			var hit = null
			for c in custs(st, "seat"):
				if c.who == name_:
					hit = c
			st.charts.erase(name_)
			if hit != null:
				drop(st, hit)
				win(st, stations.tray.tile, "+1", "%s's chart is in the tray. The doctor calls them in." % name_)
			else:
				oops(st, stations.tray.tile, "chart", "Nobody named %s is waiting. Wrong chart." % name_)


func card(st: Dictionary) -> Dictionary:
	var sid := str(st.at)
	if sid == "phone":
		if st.ring == null:
			return {"title": "Phone", "lines": ["Quiet. For now."], "opts": []}
		var r: Dictionary = st.ring
		if r.urgent:
			return {"title": "Phone · a caller", "lines": ["\"My dad has chest pain and he can't catch his breath. Can he come in today?\""],
				"opts": [{"t": "Book the first free slot", "a": "urgent:book"}, {"t": "Tell them to call 911 now", "a": "urgent:911"}, {"t": "Put them on hold", "a": "urgent:hold"}], "cols": 1}
		var L := []
		if r.first != null:
			L.append("\"Can I come in %s? Or if that's full, %s.\"" % [_slot_name(st, r.first[0], r.first[1]), _slot_name(st, r.want[0], r.want[1])])
		else:
			L.append("\"Can I come in %s?\"" % _slot_name(st, r.want[0], r.want[1]))
		L.append("The week (× = taken):")
		var opts := []
		for t in int(st.slots):
			for d in 5:
				var lab := "%s %s" % [DAYS[d], _times(st)[t].substr(0, 4) if not st.real else _times(st)[t]]
				opts.append({"t": lab + (" ×" if st.cal[d][t] else ""), "a": "book:%d:%d" % [d, t]})
		return {"title": "Phone · booking", "lines": L, "opts": opts, "cols": 5}
	if sid == "window":
		var q := custs(st, "window")
		if q.is_empty():
			return {"title": "Check-in window", "lines": ["Nobody waiting."], "opts": []}
		var c: Dictionary = q[0]
		var shown: Array = st.today.slice(maxi(0, st.today.size() - 6))
		return {"title": "Check-in window", "lines": ["\"Hi, I'm %s. I have an appointment today.\"" % c.who, "Today's list: " + (", ".join(shown) if not shown.is_empty() else "nobody else (all checked in)")],
			"opts": [{"t": "Check them in", "a": "in"}, {"t": "Not on today's list", "a": "out"}], "cols": 2}
	if sid == "files":
		var waiting := custs(st, "seat").map(func(c): return c.who)
		var names := []
		for c in custs(st, "seat"):
			if not c.who in st.charts:
				names.append(c.who)
		var opts := []
		var pool := []
		for nm in names:
			pool.append(nm)
			for pair in NAMES:
				if pair[0] == nm:
					pool.append(pair[1])
		var k := int(st.t) % maxi(1, pool.size())
		for i in pool.size():
			var nm: String = pool[(i + k) % pool.size()]
			opts.append({"t": nm, "a": "chart:" + nm})
		return {"title": "File cabinet", "lines": ["Waiting for a chart: %s" % (", ".join(names) if names.size() else "nobody"), "In your hands: %d of %d." % [st.charts.size(), CARRY]],
			"opts": opts.slice(0, 8), "cols": 2}
	if sid == "tray":
		return {"title": "Doctor's tray", "lines": ["Put charts here for the doctor."], "opts": []}
	return {}


func act(st: Dictionary, a: String) -> void:
	var sid := str(st.at)
	if sid == "phone" and st.ring != null:
		var r: Dictionary = st.ring
		var at: Vector2i = stations.phone.tile
		if a.begins_with("urgent:") and r.urgent:
			st.ring = null
			if a == "urgent:911":
				win(st, at, "+1", "Right call. Chest pain and trouble breathing need 911, right now.")
			else:
				oops(st, at, "urgent", "That was an emergency. The only right answer: call 911 now.", 2)
			return
		if a.begins_with("book:") and not r.urgent:
			var v := a.split(":")
			var d := int(v[1])
			var t := int(v[2])
			if st.cal[d][t]:
				oops(st, at, "double", "Double-booked! %s was already taken." % _slot_name(st, d, t))
				return
			st.ring = null
			if d != int(r.want[0]) or t != int(r.want[1]):
				oops(st, at, "slot", "That's not the time they asked for. They'll show up on the wrong day.")
				st.cal[d][t] = true
				return
			st.cal[d][t] = true
			st.booked = int(st.booked) + 1
			win(st, at, "+1", "Booked: %s." % _slot_name(st, d, t))
			if _free(st).size() < 4:   # a new week
				_new_week(st)
		return
	if sid == "window":
		var q := custs(st, "window")
		if q.is_empty():
			return
		var c: Dictionary = q[0]
		var at: Vector2i = stations.window.tile
		var on_list: bool = c.who in st.today
		if a == "in":
			if on_list:
				st.today.erase(c.who)
				c.state = "seat"
				c.pat = c.pat0 + 10.0
				c.bub = "t:chart"
				st.msg = "%s is checked in. Their chart goes to the doctor's tray." % c.who
			else:
				drop(st, c)
				oops(st, at, "list", "%s isn't on today's list. Now there's a mix-up with the doctor's day." % c.who)
		elif a == "out":
			drop(st, c)
			if on_list:
				oops(st, at, "list", "%s was on today's list! They leave upset." % c.who)
			else:
				win(st, at, "+1", "You find their real appointment and rebook them. Good catch.")
		return
	if sid == "files" and a.begins_with("chart:"):
		if st.charts.size() >= CARRY:
			st.msg = "Your hands are full. Take these to the tray."
			return
		var nm := a.substr(6)
		if not nm in st.charts:
			st.charts.append(nm)
			st.msg = "Chart: %s." % nm


func best(st: Dictionary) -> Dictionary:
	if st.ring != null and (st.ring.talk or float(st.ring.left) < 9.0 or custs(st, "window").is_empty()):
		if st.at != "phone" or not st.ring.talk:
			return {"go": "phone", "think": 0.3}
		var r: Dictionary = st.ring
		if r.urgent:
			return {"go": "phone", "a": "urgent:911", "think": 1.5}
		return {"go": "phone", "a": "book:%d:%d" % [int(r.want[0]), int(r.want[1])], "think": 2.2}
	if st.charts.size():
		var seated := custs(st, "seat").map(func(c): return c.who)
		var need := 0
		for c in custs(st, "seat"):
			if not c.who in st.charts:
				need += 1
		if need == 0 or st.charts.size() >= CARRY or st.at != "files":
			return {"go": "tray", "think": 0.3}
	var q := custs(st, "window")
	var seat := custs(st, "seat")
	var urgent_seat: bool = seat.any(func(c): return float(c.pat) < 16.0 and not c.who in st.charts)
	if q.size() and not urgent_seat:
		var c: Dictionary = q[0]
		return {"go": "window", "a": ("in" if c.who in st.today else "out") if st.at == "window" else "", "think": 1.8}
	for c in seat:
		if not c.who in st.charts:
			return {"go": "files", "a": "chart:" + c.who if st.at == "files" else "", "think": 1.0}
	if q.size():
		var c: Dictionary = q[0]
		return {"go": "window", "a": ("in" if c.who in st.today else "out") if st.at == "window" else "", "think": 1.8}
	if st.ring != null:
		return {"go": "phone", "think": 0.3}
	return {}


func actions(st: Dictionary) -> Array:
	return card(st).get("opts", []).map(func(o): return o.a)


func marks(st: Dictionary) -> Array:
	var out := []
	if st.ring != null and not st.ring.talk:
		out.append({"x": 6, "y": 2, "bub": "phone", "ring": float(st.ring.left) / (14.0 if not st.real else 11.0)})
	return out


func pending(st: Dictionary) -> int:
	return st.cust.size() + (1 if st.ring != null else 0)


func tally(st: Dictionary) -> Array:
	return [["Window", str(custs(st, "window").size())], ["Need a chart", str(custs(st, "seat").size())], ["Charts", "%d/%d" % [st.charts.size(), CARRY]]]


func earn_line(st: Dictionary) -> String:
	return "%d appointments booked and %d patients seen. On a salary, your pay is the same every payday; careful work counts at your review." % [int(st.booked), int(st.good) - int(st.booked)]
