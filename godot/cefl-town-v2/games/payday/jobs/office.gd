# Riverbend Clinic (receptionist, salary): Book it right. Patients arrive at the desk. Each one needs a
# checkup, a vaccine, or a consult. Dr. Chen handles all three; Nurse Patel does checkups and vaccines
# only. Each shift has 4 emergency slots (⚡) — 2 per provider — kept for urgent walk-in patients. Routine
# patients go in regular slots; urgent patients go in emergency slots if one is available. On a salary,
# your pay is fixed; wrong bookings and wasted emergency slots affect the clinic's reputation.
extends "res://games/payday/jobs/job.gd"

const EMERG_MAX := 2  # emergency slots per provider
const WAIT_Q := [Vector2i(4, 6), Vector2i(6, 6), Vector2i(4, 7), Vector2i(6, 7), Vector2i(2, 6), Vector2i(8, 6)]
const APPT_LABEL := {"checkup": "a checkup", "vaccine": "a vaccine", "consult": "a consult with the doctor"}


func _init() -> void:
	id = "office"
	name = "Book it right"
	place = "Riverbend Clinic · reception"
	pay = "salary"
	start = Vector2i(5, 5)
	boss_at = Vector2i(1, 7)
	hour = 9
	react = {"great": "Perfect bookings all shift. Patients left happy.", "ok": "Mostly smooth. A few wrong slots.", "poor": "Wrong providers, wasted emergency slots. We got complaints."}
	th = {"gentle": [0.8, 0.7, 0.6, 0.45], "real": [0.78, 0.68, 0.6, 0.45]}
	controls = ["At the desk: read the patient's type and urgency.",
		"Consults → Dr. Chen · regular. Checkups and vaccines → Nurse Patel · regular.",
		"Urgent patients (marked !) → emergency ⚡ slot. When Nurse Patel is away, all patients go to Dr. Chen."]
	tips = {"provider": "Routine checkups and vaccines go to Nurse Patel. Consults go to Dr. Chen.",
		"emerg": "Emergency ⚡ slots are for urgent walk-in patients — not routine bookings.",
		"urgent": "Urgent patients need emergency ⚡ slots while they're available. After that, any slot works.",
		"wait": "Patients give up if nobody helps them. Keep the desk moving.",
		"np_out": "When Nurse Patel is away, all routine patients go to Dr. Chen instead."}
	room_map = {"name": place, "w": 13, "h": 9, "room": {"floor": "tile", "wall": "#e8f0ee", "exit": 6, "windows": [3, 7]},
		"props": [
			{"k": "shelf", "x": 1, "y": 2, "w": 2, "id": "chairs_a", "label": "Waiting", "color": "#a0b8b0", "solid": true},
			{"k": "shelf", "x": 4, "y": 2, "w": 2, "id": "chairs_b", "label": "Waiting", "color": "#a0b8b0", "solid": true},
			{"k": "board", "x": 10, "y": 2, "w": 2, "id": "schedule", "label": "Schedule board", "solid": true},
			{"k": "counter", "x": 4, "y": 4, "w": 7, "id": "desk", "label": "Reception desk", "color": "#7a9e96", "solid": true},
			{"k": "register", "x": 10, "y": 4, "id": "phone", "label": "Phone", "solid": true},
			{"k": "shelf", "x": 1, "y": 5, "id": "filing", "label": "Files", "color": "#6b7f7a", "solid": true},
			{"k": "plant", "x": 12, "y": 2, "solid": true},
			{"k": "tag", "x": 4, "y": 4, "w": 7, "title": "RECEPTION"},
			{"k": "tag", "x": 10, "y": 2, "w": 2, "title": "SCHEDULE", "color": "#2f6b60"},
			{"k": "cone", "x": 11, "y": 7}]}
	stations = {"desk": {"stand": Vector2i(6, 5), "tile": Vector2i(6, 4)}}


func twists() -> Array:
	return [
		{"name": "First shift", "line": "Dr. Osei shows you the desk. Light morning — mostly checkups.", "rate": 0.6, "consult_rate": 0.0, "urgent_rate": 0.05},
		{"name": "A normal day", "line": "Routine morning. Mix of checkups, vaccines, and consults.", "consult_rate": 0.25},
		{"name": "Flu season", "line": "Flu season: lots of vaccine and checkup requests.", "rate": 1.1, "vaccine_rate": 0.55, "consult_rate": 0.1},
		{"name": "Referral wave", "line": "Several patients referred from other clinics — they all need consults.", "consult_rate": 0.6},
		{"name": "Walk-in morning", "line": "Walk-in patients keep arriving. Watch how you use those emergency slots.", "urgent_rate": 0.35},
		{"name": "One provider down", "line": "Nurse Patel called in sick. Dr. Chen is covering everything today.", "np_out": true, "rate": 0.8},
		{"name": "Busy Friday", "line": "Busy Friday morning. Keep the desk moving.", "rate": 1.2, "consult_rate": 0.3},
		{"name": "Back to school", "line": "Families booking back-to-school checkups and vaccines.", "rate": 1.15, "vaccine_rate": 0.5}]


func setup(st: Dictionary) -> void:
	st.emerg = {"dr": EMERG_MAX, "np": EMERG_MAX}
	st.booked = 0
	st.next = 1.0


func tick(st: Dictionary, dt: float) -> void:
	st.next = float(st.next) - dt * busy(st) * float(tw(st, "rate", 1.0))
	if st.next <= 0.0:
		st.next = (9.5 if not st.real else 8.0) * (0.75 + 0.5 * rnd(st))
		st.demand = int(st.demand) + 1
		var consult_r := float(tw(st, "consult_rate", 0.25 if st.real else 0.2))
		var vaccine_r := float(tw(st, "vaccine_rate", 0.3))
		var t: String
		if rnd(st) < consult_r:
			t = "consult"
		elif rnd(st) < vaccine_r:
			t = "vaccine"
		else:
			t = "checkup"
		var urgent: bool = rnd(st) < float(tw(st, "urgent_rate", 0.1))
		if custs(st, "wait").size() < WAIT_Q.size():
			var c := add_cust(st, {"state": "wait", "appt": t, "urgent": urgent, "pat0": 42.0 if not st.real else 34.0})
			c.pat = c.pat0
			c.bub = "!" if urgent else "q"
		else:
			lose(st, WAIT_Q[-1], "wait", "The waiting room was full. A patient left without an appointment.")
	for c in st.cust.duplicate():
		var head: bool = c.state == "wait" and custs(st, "wait").find(c) == 0 and st.at == "desk"
		c.pat = float(c.pat) - dt * (0.35 if head else 0.85)
		c.ring = float(c.pat) / float(c.pat0)
		if c.pat <= 0.0:
			drop(st, c)
			lose(st, WAIT_Q[0], "wait", "A patient waited too long and left.")
	line_up(custs(st, "wait"), WAIT_Q)


func card(st: Dictionary) -> Dictionary:
	if str(st.at) != "desk":
		return {}
	var q := custs(st, "wait")
	if q.is_empty():
		return {"title": "Reception desk", "lines": ["No patients waiting."], "opts": []}
	var c: Dictionary = q[0]
	var urgent_note: String = " — URGENT" if c.urgent else ""
	var np_out: bool = tw(st, "np_out", false)
	var L := ["Patient needs: %s%s." % [APPT_LABEL.get(c.appt, c.appt), urgent_note],
		"Emergency ⚡ slots left: Dr. Chen %d · %s" % [int(st.emerg.dr), ("away" if np_out else "Nurse Patel %d" % int(st.emerg.np))]]
	# Four options: provider × slot_type. Exactly one is correct per patient.
	# Correct: consult→dr·reg, routine→np·reg (or dr·reg if np_out), urgent→matching·emerg
	var opts := [
		{"t": "Dr. Chen · regular", "a": "book:dr:reg"},
		{"t": "Dr. Chen · emergency ⚡ (%d left)" % int(st.emerg.dr), "a": "book:dr:emerg"},
		{"t": "Nurse Patel · regular%s" % (" (away)" if np_out else ""), "a": "book:np:reg"},
		{"t": "Nurse Patel · emergency ⚡ (%d left)%s" % [int(st.emerg.np), " (away)" if np_out else ""], "a": "book:np:emerg"}]
	return {"title": "Reception desk", "lines": L, "opts": opts, "cols": 2}


func _correct(st: Dictionary, c: Dictionary) -> String:
	# Returns the one correct "provider:slot" key for this patient.
	var np_out: bool = tw(st, "np_out", false)
	if c.urgent:
		# Urgent → emergency slot. Provider: consult needs dr, routine needs np (or dr if np_out)
		var prov: String = "dr" if (c.appt == "consult" or np_out) else "np"
		if int(st.emerg.get(prov, 0)) > 0:
			return "%s:emerg" % prov
		# Emergency slots exhausted — fall back to regular (still the best we can do)
		return "%s:reg" % prov
	# Routine: consult→dr, checkup/vaccine→np (or dr if np_out)
	var prov: String = "dr" if (c.appt == "consult" or np_out) else "np"
	return "%s:reg" % prov


func act(st: Dictionary, a: String) -> void:
	if str(st.at) != "desk" or not a.begins_with("book:"):
		return
	var q := custs(st, "wait")
	if q.is_empty():
		return
	var c: Dictionary = q[0]
	var at: Vector2i = stations.desk.tile
	var v := a.split(":")
	var provider: String = v[1]  # "dr" or "np"
	var slot: String = v[2]      # "reg" or "emerg"
	var np_out: bool = tw(st, "np_out", false)
	var key: String = "%s:%s" % [provider, slot]
	var correct: String = _correct(st, c)
	# Check emergency slot capacity before accepting
	if slot == "emerg" and int(st.emerg.get(provider, 0)) <= 0:
		drop(st, c)
		oops(st, at, "emerg", "No emergency ⚡ slots left for %s." % ("Dr. Chen" if provider == "dr" else "Nurse Patel"))
		return
	if key != correct:
		drop(st, c)
		var msg: String
		if np_out and provider == "np":
			msg = "Nurse Patel is away today. Book Dr. Chen."
		elif c.appt == "consult" and provider == "np":
			msg = "Nurse Patel doesn't handle medical consults. Book Dr. Chen · regular."
		elif not c.urgent and slot == "emerg":
			msg = "That ⚡ slot is for urgent walk-ins. Routine patients go in regular slots."
		elif c.urgent and slot == "reg" and int(st.emerg.get(correct.split(":")[0], 0)) > 0:
			msg = "Urgent patient — book them in an emergency ⚡ slot while one is available."
		elif c.appt != "consult" and provider == "dr" and not np_out:
			msg = "Routine %s patients go to Nurse Patel · regular." % c.appt
		else:
			msg = "Wrong slot for this patient."
		oops(st, at, "wrong", msg)
		return
	if slot == "emerg":
		st.emerg[provider] = int(st.emerg.get(provider, 0)) - 1
	st.booked = int(st.booked) + 1
	drop(st, c)
	var pname: String = "Dr. Chen" if provider == "dr" else "Nurse Patel"
	var sname: String = "regular" if slot == "reg" else "emergency ⚡"
	win(st, at, "+1", "Booked: %s, %s slot with %s." % [c.appt, sname, pname])


func best(st: Dictionary) -> Dictionary:
	var q := custs(st, "wait")
	if q.is_empty():
		return {} if st.me == stations.desk.stand else {"go": "desk"}
	if st.at != "desk":
		return {"go": "desk"}
	var c: Dictionary = q[0]
	var correct := _correct(st, c)
	return {"go": "desk", "a": "book:%s" % correct, "think": 1.8}


func actions(st: Dictionary) -> Array:
	return card(st).get("opts", []).map(func(o): return o.a)


func pending(st: Dictionary) -> int:
	return st.cust.size()


func tally(st: Dictionary) -> Array:
	return [["Waiting", str(custs(st, "wait").size())], ["Booked", str(st.booked)],
		["Dr. Chen ⚡", str(st.emerg.dr)], ["Nurse Patel ⚡", str(st.emerg.np)]]


func earn_line(st: Dictionary) -> String:
	return "You booked %d appointments. A salaried position pays the same every month — your performance shows up at review time and in the clinic's reputation." % int(st.booked)
