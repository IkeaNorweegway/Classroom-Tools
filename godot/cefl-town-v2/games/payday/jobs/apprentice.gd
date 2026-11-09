# Bright Spark Electric (apprentice, wage): Safe first. Job tickets come in on the board; each one names
# a circuit and a job type. Go to the breaker panel and switch that circuit OFF. Then go to the tool kit
# and pick up the right tools for the job type. Then bring the work to the bench and sign off. Never touch
# a live circuit: that is a safety violation. In Real mode, test with the voltage meter first.
extends "res://games/payday/jobs/job.gd"

const CIRCUITS := ["Circuit 1", "Circuit 2", "Circuit 3", "Circuit 4", "Circuit 5", "Circuit 6"]
const JOB_TYPES := ["outlet", "switch", "light fixture", "conduit run"]
const TOOL_KITS := ["Outlet kit", "Switch kit", "Fixture kit", "Conduit kit"]
const BOARD_MAX := 5
const BOARD_Q := [Vector2i(2, 2), Vector2i(3, 2), Vector2i(4, 2), Vector2i(5, 2), Vector2i(6, 2)]


func _init() -> void:
	id = "apprentice"
	name = "Safe first"
	place = "Bright Spark Electric · workshop"
	pay = "wage"
	start = Vector2i(5, 5)
	boss_at = Vector2i(1, 2)
	hour = 7
	react = {"great": "Safe and steady. That's how electricians last.", "ok": "Got through it. Watch the safety steps.", "poor": "Live circuit. That's how people get hurt."}
	th = {"gentle": [0.8, 0.7, 0.6, 0.45], "real": [0.78, 0.68, 0.55, 0.4]}
	controls = ["Pick up a job from the board. It tells you the circuit and the job type.",
		"Go to the breaker panel and switch that circuit OFF. Then go to the tool kit and pick the right tools.",
		"Bring the work to the bench and sign off. Never touch a live circuit."]
	tips = {"live": "Always turn the breaker off before going to the bench. A live circuit is a safety violation.",
		"tools": "Match the tool kit to the job type: outlet, switch, fixture, or conduit.",
		"meter": "In Real mode, test with the meter before touching: a mislabeled breaker still shows live.",
		"board": "Pick up the next job from the board before the tickets pile up.",
		"mislabel": "If the meter shows live after you flipped the breaker, try the adjacent one."}
	room_map = {"name": place, "w": 13, "h": 9, "room": {"floor": "concrete", "wall": "#d8d4cc", "exit": 6, "windows": [4, 8]},
		"props": [
			{"k": "board", "x": 1, "y": 2, "w": 6, "id": "jobboard", "label": "Job board", "solid": true},
			{"k": "breaker", "x": 10, "y": 2, "w": 2, "id": "panel", "label": "Breaker panel", "solid": true},
			{"k": "counter", "x": 7, "y": 5, "w": 4, "id": "bench", "label": "Work bench", "color": "#8a7a60", "solid": true},
			{"k": "toolbox", "x": 1, "y": 5, "id": "tools", "label": "Tool kit", "solid": true},
			{"k": "ladder", "x": 1, "y": 7, "solid": true},
			{"k": "jbox", "x": 11, "y": 7, "solid": true},
			{"k": "tag", "x": 1, "y": 2, "w": 6, "title": "JOBS"},
			{"k": "tag", "x": 10, "y": 2, "w": 2, "title": "BREAKERS"},
			{"k": "tag", "x": 7, "y": 5, "w": 4, "title": "WORK BENCH"},
			{"k": "cone", "x": 11, "y": 5}]}
	stations = {
		"board": {"stand": Vector2i(3, 3), "tile": Vector2i(3, 2)},
		"panel": {"stand": Vector2i(10, 3), "tile": Vector2i(10, 2)},
		"bench": {"stand": Vector2i(9, 6), "tile": Vector2i(9, 5)},
		"tools": {"stand": Vector2i(2, 6), "tile": Vector2i(1, 5)}}


func twists() -> Array:
	return [
		{"name": "First shift", "line": "Mike shows you the board, the panel, and the bench. Simple jobs today.", "rate": 0.6},
		{"name": "A normal day", "line": "Four circuits on the panel. Read the board, kill the right one.", "circuits": 4},
		{"name": "Busy morning", "line": "The board fills fast today. Keep the jobs moving.", "rate": 1.2, "circuits": 4},
		{"name": "Worn labels", "line": "Some breaker labels are faded. The meter confirms which is which.", "circuits": 5, "worn": 0.3},
		{"name": "Big reno", "line": "A full commercial reno: six circuits, all in use.", "rate": 1.1, "circuits": 6},
		{"name": "Apprentice alone", "line": "Mike is at another site. Work carefully — no one to catch mistakes.", "circuits": 5, "rate": 0.9},
		{"name": "Inspection day", "line": "The inspector is here: sign off on every job before the next one.", "circuits": 4, "inspect": true},
		{"name": "Mislabeled panel", "line": "A new tenant relabeled the panel wrong. Test with the meter.", "circuits": 5, "mislabel": 0.4}]


func setup(st: Dictionary) -> void:
	st.jobs = []
	st.held = null
	st.off = -1       # which circuit is currently off (-1 = all live)
	st.tested = false # has the player tested the circuit (Real mode)
	st.kit = -1       # which tool kit is loaded (-1 = none)
	st.done = 0
	st.next = 1.0


func _new_job(st: Dictionary) -> void:
	var nc: int = int(tw(st, "circuits", 4))
	var c := irand(st, 0, nc - 1)
	var worn: bool = st.real and rnd(st) < float(tw(st, "worn", 0.0))
	var mislabel: bool = st.real and rnd(st) < float(tw(st, "mislabel", 0.0))
	# If mislabeled, the displayed circuit is off-by-one; true circuit is different
	var true_c := c
	if mislabel:
		true_c = (c + 1) % nc
	st.jobs.append({"c": c, "true_c": true_c, "type": pick(st, JOB_TYPES), "worn": worn, "mislabel": mislabel})
	st.demand = int(st.demand) + 1


func tick(st: Dictionary, dt: float) -> void:
	st.next = float(st.next) - dt * busy(st) * float(tw(st, "rate", 1.0))
	if st.next <= 0.0:
		st.next = (11.0 if not st.real else 13.5) * (0.75 + 0.5 * rnd(st))
		if st.jobs.size() >= BOARD_MAX:
			st.jobs.pop_front()
			lose(st, BOARD_Q[-1], "board", "The job board was full. A ticket was lost.")
		_new_job(st)


func _circuit_label(j: Dictionary) -> String:
	if j.worn:
		return "Circuit ? (label worn — use the meter)"
	return CIRCUITS[int(j.c)]


func on_at(st: Dictionary, sid: String) -> void:
	st.at = sid
	if st.held == null:
		return
	var j: Dictionary = st.held
	if sid == "bench":
		if int(st.off) != int(j.true_c):
			oops(st, stations.bench.tile, "live", "Circuit %s is still live! You must turn it off at the panel first. Safety violation." % CIRCUITS[int(j.c)], 2)
			st.held = null
	elif sid == "tools":
		# Picking up a tool kit: set it and immediately validate (commit the choice)
		pass  # tools selected via card/act, not on_at


func card(st: Dictionary) -> Dictionary:
	var sid := str(st.at)
	if sid == "board":
		if st.held != null:
			return {"title": "Job board", "lines": ["Your hands are full. Finish the current job first."], "opts": []}
		if st.jobs.is_empty():
			return {"title": "Job board", "lines": ["No jobs right now."], "opts": []}
		var j: Dictionary = st.jobs[0]
		return {"title": "Job board · next ticket", "lines": [
			"Job: %s" % j.type,
			"Circuit: %s" % _circuit_label(j),
			"Steps: turn off the breaker, grab the right tools, then sign off at the bench."],
			"opts": [{"t": "Pick up this job", "a": "pickup", "k": "primary"}], "cols": 1}
	if sid == "panel":
		var opts := []
		var nc: int = int(tw(st, "circuits", 4))
		for i in nc:
			var label: String = "Turn OFF: %s" % CIRCUITS[i] if i != int(st.off) else "%s is OFF" % CIRCUITS[i]
			opts.append({"t": label, "a": "breaker:%d" % i})
		if st.real and st.held != null:
			opts.append({"t": "Test circuit with meter", "a": "meter"})
		var held_name: String = "none" if st.held == null else ("%s — %s" % [_circuit_label(st.held), st.held.type])
		return {"title": "Breaker panel", "lines": ["Current job: %s" % held_name, "Circuit OFF: %s" % (CIRCUITS[int(st.off)] if int(st.off) >= 0 else "none")], "opts": opts, "cols": 2}
	if sid == "tools":
		if st.held == null:
			return {"title": "Tool kit", "lines": ["Pick up a job from the board first."], "opts": []}
		var j: Dictionary = st.held
		var opts := []
		for i in TOOL_KITS.size():
			opts.append({"t": TOOL_KITS[i], "a": "kit:%d" % i})
		return {"title": "Tool kit", "lines": ["Job: %s. Pick the right kit." % j.type,
			"Kit loaded: %s" % (TOOL_KITS[int(st.kit)] if int(st.kit) >= 0 else "none")], "opts": opts, "cols": 2}
	if sid == "bench":
		if st.held == null:
			return {"title": "Work bench", "lines": ["No job in hand. Pick one up from the board first."], "opts": []}
		var j: Dictionary = st.held
		var right_kit: int = JOB_TYPES.find(j.type)
		var safe: bool = int(st.off) == int(j.true_c) and (not st.real or st.tested) and int(st.kit) == right_kit
		if not safe:
			var issues := []
			if int(st.off) != int(j.true_c): issues.append("circuit is LIVE")
			elif st.real and not st.tested: issues.append("not tested")
			if int(st.kit) != right_kit: issues.append("wrong tool kit")
			return {"title": "Work bench", "lines": ["Job: %s — %s" % [_circuit_label(j), j.type], "⚠ Not ready: %s." % ", ".join(issues)], "opts": []}
		return {"title": "Work bench", "lines": ["Job: %s — %s" % [_circuit_label(j), j.type], "Circuit is off, tools ready."],
			"opts": [{"t": "Do the work and sign off", "a": "signoff", "k": "primary"}], "cols": 1}
	return {}


func act(st: Dictionary, a: String) -> void:
	if a == "pickup" and st.at == "board" and st.held == null and not st.jobs.is_empty():
		st.held = st.jobs.pop_front()
		st.off = -1
		st.tested = false
		st.kit = -1
		st.msg = "Job: %s, %s. Turn off the breaker, grab the right tools, then sign off." % [_circuit_label(st.held), st.held.type]
		return
	if a.begins_with("breaker:") and st.at == "panel":
		var i := int(a.substr(8))
		st.off = i if i != int(st.off) else -1
		st.tested = false
		st.msg = "%s is now OFF." % CIRCUITS[i] if i == int(st.off) else "Back on. All circuits live."
		return
	if a == "meter" and st.at == "panel" and st.real and st.held != null:
		if int(st.off) == int(st.held.true_c):
			st.tested = true
			st.msg = "Meter reads: circuit is dead. Safe to work."
		else:
			st.tested = false
			st.msg = "Meter reads: circuit is still live. The breaker may be mislabeled."
		return
	if a.begins_with("kit:") and st.at == "tools" and st.held != null:
		var i := int(a.substr(4))
		var j: Dictionary = st.held
		var right: int = JOB_TYPES.find(j.type)
		if i != right:
			oops(st, stations.tools.tile, "tools", "Wrong kit: a %s needs the %s, not the %s." % [j.type, TOOL_KITS[right], TOOL_KITS[i]])
			st.held = null
			return
		st.kit = i
		st.msg = "Got it. %s loaded." % TOOL_KITS[i]
		return
	if a == "signoff" and st.at == "bench" and st.held != null:
		var j: Dictionary = st.held
		var right_kit: int = JOB_TYPES.find(j.type)
		var right_off: bool = int(st.off) == int(j.true_c)
		var meter_ok: bool = not st.real or st.tested
		var kit_ok: bool = int(st.kit) == right_kit
		if not right_off:
			oops(st, stations.bench.tile, "live", "You touched a live circuit! That is a safety violation.", 2)
			st.held = null
			return
		if not meter_ok:
			oops(st, stations.bench.tile, "meter", "You didn't test with the meter. The foreman flagged it.")
			st.held = null
			return
		if not kit_ok:
			oops(st, stations.bench.tile, "tools", "Wrong tool kit for a %s job." % j.type)
			st.held = null
			return
		st.done = int(st.done) + 1
		st.held = null
		win(st, stations.bench.tile, "+1", "Job done: %s, %s. Signed off." % [CIRCUITS[int(j.true_c)], j.type])


func best(st: Dictionary) -> Dictionary:
	if st.held == null:
		if st.jobs.is_empty():
			return {} if st.me == stations.board.stand else {"go": "board"}
		return {"go": "board", "a": "pickup" if st.at == "board" else "", "think": 0.6}
	var j: Dictionary = st.held
	var right_off: bool = int(st.off) == int(j.true_c)
	var meter_ok: bool = not st.real or st.tested
	var kit_ok: bool = int(st.kit) == JOB_TYPES.find(j.type)
	if not right_off or not meter_ok:
		if st.at != "panel":
			return {"go": "panel"}
		if not right_off:
			return {"go": "panel", "a": "breaker:%d" % int(j.true_c), "think": 1.6}
		if st.real and not st.tested:
			return {"go": "panel", "a": "meter", "think": 1.4}
	if not kit_ok:
		if st.at != "tools":
			return {"go": "tools"}
		return {"go": "tools", "a": "kit:%d" % JOB_TYPES.find(j.type), "think": 1.4}
	return {"go": "bench", "a": "signoff" if st.at == "bench" else "", "think": 1.8}


func actions(st: Dictionary) -> Array:
	return card(st).get("opts", []).map(func(o): return o.a)


func marks(st: Dictionary) -> Array:
	var out := []
	for i in st.jobs.size():
		out.append({"x": BOARD_Q[mini(i, BOARD_Q.size() - 1)].x, "y": BOARD_Q[mini(i, BOARD_Q.size() - 1)].y, "bub": "parcel", "ring": -1.0 if i > 0 else 1.0 - float(st.jobs.size()) / float(BOARD_MAX)})
	return out


func pending(st: Dictionary) -> int:
	return st.jobs.size() + (1 if st.held != null else 0)


func tally(st: Dictionary) -> Array:
	var off_name: String = CIRCUITS[int(st.off)] if int(st.off) >= 0 else "none"
	var kit_name: String = TOOL_KITS[int(st.kit)] if int(st.kit) >= 0 else "none"
	var held_str: String = st.held.type if st.held != null else "—"
	return [["On the board", str(st.jobs.size())], ["Current job", held_str], ["Breaker off", off_name], ["Tools", kit_name], ["Done", str(st.done)]]


func earn_line(st: Dictionary) -> String:
	return "You completed %d jobs safely. Apprentices earn an hourly wage while learning on the job — your safety record and speed determine what you're offered next." % int(st.done)
