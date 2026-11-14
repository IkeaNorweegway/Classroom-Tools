# Play-through probe: plays the game with the test player and writes down what a student would see and where they could walk.
# It only reads the game (Town, its world and its boxes); it never changes a game or engine file.
#
#   godot --headless --path godot/story-engine res://tests/playtest/probe.tscn -- debug=1 auto=right seed=7 out=/abs/dir [pick=rand] [mode=real]
#
# pick=rand chooses a random option at every choice (seeded by seed=), so nights cover other story branches; the pick is logged.
# Writes to out=: transcript.jsonl (every box, goal, banner and toast, in order), nav.jsonl (walkability of every map at every
# step and goal change), maps.txt (an ASCII picture of each map at each step), summary.json.
# Used by scripts/playtest_town2.sh and the playtest agent (.claude/agents/playtest.md).
extends Node

const MapData = preload("res://engine/world/map_data.gd")
const Money = preload("res://engine/core/money.gd")
const DIRS := [Vector2i(-1, 0), Vector2i(1, 0), Vector2i(0, -1), Vector2i(0, 1)]
const STUCK_FRAMES := 4000
const MAX_FRAMES := 400000

var out_dir := ""
var args := {}
var tx: FileAccess
var nav: FileAccess
var pics: FileAccess
var rng := RandomNumberGenerator.new()
var frame := 0
var idle := 0
var last_box = null
var last_box_sig := ""
var last_goal := ""
var last_step := -1
var last_map := ""
var seen_fx := {}
var stuck_events := 0
var boxes := 0
var problems := 0
var picks := []


func _ready() -> void:
	for a in OS.get_cmdline_user_args():
		var kv: PackedStringArray = str(a).trim_prefix("--").split("=", true, 1)
		args[kv[0]] = kv[1] if kv.size() > 1 else "1"
	out_dir = args.get("out", "user://playtest")
	DirAccess.make_dir_recursive_absolute(out_dir)
	tx = FileAccess.open(out_dir.path_join("transcript.jsonl"), FileAccess.WRITE)
	nav = FileAccess.open(out_dir.path_join("nav.jsonl"), FileAccess.WRITE)
	pics = FileAccess.open(out_dir.path_join("maps.txt"), FileAccess.WRITE)
	rng.seed = int(args.get("seed", "1")) * 7919 + 13
	add_child(preload("res://main.tscn").instantiate())


func _process(_dt: float) -> void:
	frame += 1
	if Town.D == null or Town.G.is_empty() or Town.world == null or Town.world.map == null:
		return
	_watch_step()
	_watch_map()
	_watch_goal()
	_watch_box()
	_watch_fx()
	_watch_stuck()
	if frame > MAX_FRAMES:
		_event({"kind": "timeout", "note": "Gave up after %d frames without finishing." % frame})
		get_tree().quit()


func _exit_tree() -> void:
	if tx == null:
		return
	var s := {"frames": frame, "boxes": boxes, "nav_problems": problems, "stuck_events": stuck_events, "picks": picks,
		"finished": Town.finished, "step_index": int(Town.G.get("si", -1)), "steps": Town.D.steps() if Town.D else [],
		"args": args}
	if Town.D != null and Town.D.has_method("summary") and not Town.G.is_empty():
		s.merge(Town.D.summary(Town.S))
	var f := FileAccess.open(out_dir.path_join("summary.json"), FileAccess.WRITE)
	f.store_string(JSON.stringify(s, "  "))
	tx.close()
	nav.close()
	pics.close()


# ── What happens, in order ──
func _where() -> Dictionary:
	var steps: Array = Town.D.steps()
	var si := int(Town.G.si)
	return {"step": steps[si] if si < steps.size() else "(end)", "day": int(Town.S.day), "time": Money.clock(Town.S.min),
		"map": Town.world.map.id, "me": [Town.world.me.tile.x, Town.world.me.tile.y]}


func _event(e: Dictionary) -> void:
	e.merge(_where())
	tx.store_line(JSON.stringify(e))
	tx.flush()


func _watch_step() -> void:
	var si := int(Town.G.si)
	if si == last_step:
		return
	last_step = si
	_event({"kind": "step", "flags": Town.S.flags.duplicate(), "cash": int(Town.S.cash)})
	_check_all_maps("step")


func _watch_map() -> void:
	var id: String = Town.world.map.id
	if id == last_map:
		return
	last_map = id
	_event({"kind": "map", "name": Town.world.map.name})
	var me: Vector2i = Town.world.me.tile
	var m: MapData = Town.world.map
	var bad := []
	if m.blocked(me.x, me.y) and not m.links.has(me):
		bad.append("You arrive on a blocked tile.")
	var free := 0
	for d in DIRS:
		var q: Vector2i = me + d
		if not Town.world.blocked(q) or _is_link(m, q):
			free += 1
	if free == 0:
		bad.append("You arrive with no free tile next to you.")
	if bad.size():
		problems += bad.size()
		nav.store_line(JSON.stringify({"when": "arrive", "where": _where(), "problems": bad}))
		nav.flush()


func _watch_goal() -> void:
	var g := "%s|%s" % [Town.goal_text, Town.goal_target]
	if g == last_goal:
		return
	last_goal = g
	_event({"kind": "goal", "text": Town.goal_text, "target": Town.goal_target, "hud": Town.ui.hud_goal.text if Town.ui.hud_goal else ""})
	if Town.goal_target != "":
		_check_all_maps("goal")


func _watch_box() -> void:
	var c = Town.cur
	if c == null:
		last_box = null
		return
	var sig := ""
	var e := {"kind": c.kind}
	if c.kind in ["say", "choose"]:
		e.speaker = Town.ui.say_name.text if Town.ui.say_name.visible else "(narrator)"
		e.text = Town.ui.say_text.get_parsed_text()
		var opts := []
		for b in Town.ui.say_actions.get_children():
			if b is Button and not b.is_queued_for_deletion() and b.text != "Next":
				opts.append(b.text)
		if opts.size():
			e.options = opts
		sig = JSON.stringify(e)
	else:
		e.lines = _panel_text()
		sig = JSON.stringify(e)
	if c != last_box:
		last_box = c
		last_box_sig = sig
		boxes += 1
		if c.kind == "choose":
			_maybe_pick(c, e)
		_event(e)
	elif sig != last_box_sig:   # the same box changed (feedback after a check, a hint)
		last_box_sig = sig
		e.kind = c.kind + "-update"
		_event(e)


## pick=rand: choose a random option at every choice instead of the test player's usual one.
func _maybe_pick(c: Dictionary, e: Dictionary) -> void:
	if args.get("pick", "") != "rand":
		return
	var n: int = e.get("options", []).size()
	if n == 0:
		return
	var k := rng.randi_range(0, n - 1)
	picks.append({"step": _where().step, "text": e.get("text", ""), "picked": k})
	e.picked = k
	c.solve = func(_h): Town.ui.choice_made.emit(k)


func _panel_text() -> Array:
	var out := []
	var layer: Control = Town.ui.modal_layer
	var n := layer.get_child_count()
	if n == 0:
		return out
	_collect(layer.get_child(n - 1), out)
	return out


func _collect(n: Node, out: Array) -> void:
	if n is CanvasItem and not n.visible:
		return
	if n.is_queued_for_deletion():
		return
	if n is RichTextLabel:
		var t: String = n.get_parsed_text().strip_edges()
		if t != "":
			out.append(t)
	elif n is Label:
		if n.text.strip_edges() != "":
			out.append(n.text.strip_edges())
	elif n is Button:
		if n.text != "":
			out.append("[button] " + n.text + (" (disabled)" if n.disabled else ""))
	elif n is LineEdit:
		out.append("[field] " + n.text)
	elif n is TextEdit:
		out.append("[text box] " + n.text)
	for ch in n.get_children():
		_collect(ch, out)


func _watch_fx() -> void:
	for c in Town.ui.fx_layer.get_children():
		if c.is_queued_for_deletion():
			continue
		var lines := []
		_collect(c, lines)
		var key := str(c.get_instance_id())
		var t := " / ".join(lines)
		if t == "" or seen_fx.get(key, "") == t:
			continue
		seen_fx[key] = t
		_event({"kind": "banner" if c.name.begins_with("Banner") else "screen-text", "text": t})


func _watch_stuck() -> void:
	var waiting: bool = Town.cur == null and Town.goal_target == "" and not Town.running_day and not Town.busy_talk and not Town.finished
	idle = idle + 1 if waiting else 0
	if idle == STUCK_FRAMES:
		stuck_events += 1
		_event({"kind": "stuck", "note": "No box open and no goal for %d frames." % STUCK_FRAMES, "goal_text": Town.goal_text})


# ── Can you walk everywhere? ──
func _is_link(m: MapData, p: Vector2i) -> bool:
	return m.links.has(p) or (not m.outdoor and p == Vector2i(m.exit_x, m.h - 1))


## Where people stand on map id right now: tile → person id.
func _people_on(id: String) -> Dictionary:
	var out := {}
	for pid in Town.people_def:
		var w = Town.D.where(pid, Town.S)
		if w != null and w.map == id:
			out[Vector2i(int(w.x), int(w.y))] = pid
	return out


## Tiles you arrive on when you come into map id: [[tile, from]].
func _entries(id: String) -> Array:
	var m: MapData = Town.maps[id]
	var out := []
	if not m.outdoor:
		out.append([m.arrive, "coming in the door"])
	if id == Town.D.start_map:
		out.append([Vector2i(Town.D.start_at.x, Town.D.start_at.y), "starting the game"])
	for other in Town.maps:
		var om: MapData = Town.maps[other]
		for p in om.links:
			var l: Dictionary = om.links[p]
			if l.to == id and l.at != null:
				out.append([l.at, "arriving from " + other])
		if not om.outdoor and m.outside_door(other) != null:
			out.append([m.outside_door(other).at, "coming out of " + other])
	return out


func _free(m: MapData, ppl: Dictionary, p: Vector2i) -> bool:
	return not m.blocked(p.x, p.y) and not ppl.has(p)


## BFS like the walking code: 4 directions; doors, edges and the room exit can be stepped on but move you elsewhere.
func _bfs(m: MapData, ppl: Dictionary, from: Vector2i) -> Dictionary:
	var dist := {from: 0}
	var q := [from]
	while q.size():
		var p: Vector2i = q.pop_front()
		if p != from and _is_link(m, p):
			continue
		for d in DIRS:
			var n: Vector2i = p + d
			if dist.has(n):
				continue
			if _free(m, ppl, n) or (_is_link(m, n) and not ppl.has(n)):
				dist[n] = dist[p] + 1
				q.append(n)
	return dist


func _check_all_maps(why: String) -> void:
	for id in Town.maps:
		_check_map(id, why)


func _check_map(id: String, why: String) -> void:
	var m: MapData = Town.maps[id]
	var ppl := _people_on(id)
	var bad := []
	var marks := {}
	# people standing where they shouldn't
	var doorsteps := {}
	for p in m.links:
		if m.links[p].at == null:
			doorsteps[p + Vector2i(0, 1)] = "doorstep of " + str(m.links[p].to)
	for e in _entries(id):
		doorsteps[e[0]] = "arrival tile (" + e[1] + ")"
	if not m.outdoor:
		doorsteps[Vector2i(m.exit_x, m.h - 2)] = "inside the room's door"
	for t in ppl:
		var pid: String = ppl[t]
		if m.blocked(t.x, t.y):
			bad.append("%s stands on a blocked tile %s." % [pid, t])
			marks[t] = "!"
		if _is_link(m, t):
			bad.append("%s stands on a door or edge %s." % [pid, t])
			marks[t] = "!"
		if doorsteps.has(t):
			bad.append("%s stands on the %s %s." % [pid, doorsteps[t], t])
			marks[t] = "!"
	# from every way in, what can you reach?
	var entries := _entries(id)
	var reach := {}
	var per_entry := []
	for e in entries:
		var at: Vector2i = e[0]
		if not _free(m, ppl, at) and not _is_link(m, at):
			bad.append("Arrival tile %s (%s) is blocked%s." % [at, e[1], " by " + ppl[at] if ppl.has(at) else ""])
			marks[at] = "!"
			continue
		var d := _bfs(m, ppl, at)
		per_entry.append([e, d])
		for k in d:
			reach[k] = true
	var no_people := {}
	for e in entries:
		if _free(m, {}, e[0]):
			for k in _bfs(m, {}, e[0]):
				no_people[k] = true
	# doors, edges, exit
	var exits := []
	for p in m.links:
		exits.append([p, "door/edge to " + str(m.links[p].to)])
	if not m.outdoor:
		exits.append([Vector2i(m.exit_x, m.h - 1), "room exit"])
	# a far bank may be reached only from the next area (test_nav.gd's rule): an entry cut off from the first entry's side by
	# arriving from another area is a far bank. It is not checked against the near side's exits, and exits found only there are not
	# held against the near side's entries.
	var far := []
	var near_reach := {}
	for pe in per_entry:
		var cut: bool = per_entry.size() > 0 and not per_entry[0][1].has(pe[0][0]) and str(pe[0][1]).begins_with("arriving from")
		if cut:
			far.append(pe)
		else:
			for k in pe[1]:
				near_reach[k] = true
	for x in exits:
		var far_only := not near_reach.has(x[0])
		for pe in per_entry:
			if pe in far:
				continue
			if far_only and far.size() > 0:
				continue
			if not pe[1].has(x[0]):
				bad.append("Can't reach the %s %s when %s." % [x[1], x[0], pe[0][1]])
				marks[x[0]] = "!"
	# people and things: a free tile next to them that you can reach
	var targets := []
	for t in ppl:
		targets.append(["person:" + ppl[t], [t]])
	for k in m.things:
		var th: Dictionary = m.things[k]
		var tiles := []
		for y in range(th.y, th.y + th.h):
			for x in range(th.x, th.x + th.w):
				tiles.append(Vector2i(x, y))
		targets.append(["thing:" + k, tiles])
	var target_report := {}
	for tg in targets:
		var best := -1
		var straight := 0
		for t in tg[1]:
			for d in DIRS:
				var s: Vector2i = t + d
				if reach.has(s) and not _is_link(m, s) and not (s in tg[1]):
					for pe in per_entry:
						if pe[1].has(s) and (best < 0 or pe[1][s] < best):
							best = pe[1][s]
							straight = absi(s.x - pe[0][0].x) + absi(s.y - pe[0][0].y)
		target_report[tg[0]] = best
		if best < 0:
			bad.append("No reachable tile to stand on next to %s %s." % [tg[0], tg[1][0]])
			marks[tg[1][0]] = "!"
		elif best > straight * 2 + 4:
			bad.append("Long detour to %s: %d steps for %d in a straight line." % [tg[0], best, straight])
	# the goal, if it is on this map
	if Town.goal_target != "":
		var place = Town._target_place(Town.goal_target)
		if place == null:
			if id == Town.world.map.id:
				bad.append("The goal %s points at nothing." % Town.goal_target)
		elif place.map == id and target_report.has(Town.goal_target) and target_report[Town.goal_target] < 0:
			bad.append("The goal %s can't be reached." % Town.goal_target)
	# walkable ground you can see but can't get to
	var stranded := []
	var stranded_path := []
	var cut_by_people := []
	var gated := _gated_tiles(id, entries, ppl, reach)
	var gated_by := {}
	for y in m.h:
		for x in m.w:
			var p := Vector2i(x, y)
			if not _free(m, ppl, p) or reach.has(p):
				continue
			if gated.has(p):
				gated_by[gated[p]] = int(gated_by.get(gated[p], 0)) + 1
				marks[p] = "g"
				continue
			if no_people.has(p):
				cut_by_people.append(p)
			elif m.kind_at(x, y) in ["walk", "path", "plaza", "road"]:
				stranded_path.append(p)
			else:
				stranded.append(p)
			marks[p] = "?"
	if cut_by_people.size():
		bad.append("People cut off %d tiles, e.g. %s." % [cut_by_people.size(), cut_by_people[0]])
	if stranded_path.size():
		bad.append("%d path/walk/road tiles can't be reached, e.g. %s." % [stranded_path.size(), stranded_path[0]])
	if stranded.size():
		bad.append("%d open tiles can't be reached (pockets), e.g. %s." % [stranded.size(), stranded[0]])
	# business-day customers
	if Town.D.get("shop_layout") != null and Town.D.shop_layout.get("map", "") == id:
		bad.append_array(_walker_check(m, ppl, marks))
	# one-tile gaps a standing person would block
	var narrow := []
	for y in range(1, m.h - 1):
		for x in range(1, m.w - 1):
			var p := Vector2i(x, y)
			if not _free(m, {}, p):
				continue
			var lr: bool = _free(m, {}, p + Vector2i(-1, 0)) and _free(m, {}, p + Vector2i(1, 0)) and m.blocked(x, y - 1) and m.blocked(x, y + 1)
			var ud: bool = _free(m, {}, p + Vector2i(0, -1)) and _free(m, {}, p + Vector2i(0, 1)) and m.blocked(x - 1, y) and m.blocked(x + 1, y)
			if lr or ud:
				narrow.append([x, y])
	problems += bad.size()
	nav.store_line(JSON.stringify({"when": why, "where": _where(), "map": id, "goal": Town.goal_target, "problems": bad,
		"gated": gated_by, "people": _people_list(ppl), "targets": target_report, "narrow_gaps": narrow, "entries": entries.map(func(e): return [e[0].x, e[0].y, e[1]])}))
	nav.flush()
	if why == "step":
		_picture(m, ppl, marks)


## Tiles you can't reach only because a story flag hasn't been set yet (a sigil-frozen gate). A game that lists nav_flags()
## names the flags that open ways; for each one not set in this save, rebuild the map with only that flag on and see what you
## could then reach. Those tiles are expected (not problems) until the flag is set; once it is set, nothing is excused.
## Returns tile -> flag. A game without maps_for / nav_flags (CEFL Town) gets {}.
func _gated_tiles(id: String, entries: Array, ppl: Dictionary, reach: Dictionary) -> Dictionary:
	var out := {}
	if not Town.D.has_method("maps_for") or not Town.D.has_method("nav_flags"):
		return out
	for flag in Town.D.nav_flags():
		if Town.S.flags.get(flag, false):
			continue
		var S2: Dictionary = Town.S.duplicate(true)
		S2.flags[flag] = true
		var defs: Dictionary = Town.D.maps_for(S2)
		if not defs.has(id):
			continue
		var m2 := MapData.new(id, defs[id])
		for e in entries:
			var at: Vector2i = e[0]
			if not _free(m2, ppl, at) and not _is_link(m2, at):
				continue
			for k in _bfs(m2, ppl, at):
				if not reach.has(k) and not out.has(k):
					out[k] = flag
	return out


func _walker_check(m: MapData, ppl: Dictionary, marks: Dictionary) -> Array:
	var L: Dictionary = Town.D.shop_layout
	var E := Vector2i(m.exit_x, m.h - 1)
	var C := Vector2i(L.counter[0], L.counter[1])
	var B := Vector2i(L.board[0], L.board[1])
	var Y := Vector2i(L.you[0], L.you[1])
	var routes := {"served": [E, Vector2i(E.x, C.y), C, Vector2i(E.x, C.y), E], "price": [E, Vector2i(E.x, B.y), B, Vector2i(E.x, B.y), E],
		"line": [E, Vector2i(E.x, E.y - 2), E]}
	var bad := []
	for r in routes:
		var pts: Array = routes[r]
		for i in range(1, pts.size()):
			var a: Vector2i = pts[i - 1]
			var b: Vector2i = pts[i]
			if a.x != b.x and a.y != b.y:
				bad.append("Customer route '%s' cuts diagonally from %s to %s." % [r, a, b])
			var steps := maxi(absi(b.x - a.x), absi(b.y - a.y))
			for s in range(steps + 1):
				var p := Vector2i(a.x + signi(b.x - a.x) * s, a.y + signi(b.y - a.y) * s) if (a.x == b.x or a.y == b.y) else a
				if m.blocked(p.x, p.y) and not _is_link(m, p):
					bad.append("Customer route '%s' walks through a blocked tile %s." % [r, p])
					marks[p] = "!"
				if p == Y:
					bad.append("Customer route '%s' walks through your spot %s." % [r, p])
	return bad


func _people_list(ppl: Dictionary) -> Array:
	var out := []
	for t in ppl:
		out.append([ppl[t], t.x, t.y])
	return out


## # wall/solid  ~ water  . open  : path/walk/plaza  = road  + door  > edge  E room exit  @ you  T thing
## first letter of a person (capital)  ? open but unreachable  ! a problem here
func _picture(m: MapData, ppl: Dictionary, marks: Dictionary) -> void:
	var w := _where()
	pics.store_line("== %s · step %s · day %d %s ==" % [m.id, w.step, w.day, w.time])
	for y in m.h:
		var row := ""
		for x in m.w:
			var p := Vector2i(x, y)
			var ch := "."
			var k := m.kind_at(x, y)
			if k == "water":
				ch = "~"
			elif m.blocked(x, y):
				ch = "#"
			elif k in ["path", "walk", "plaza"]:
				ch = ":"
			elif k == "road":
				ch = "="
			if m.thing_at(x, y) != "":
				ch = "T"
			if m.links.has(p):
				ch = "+" if m.links[p].at == null else ">"
			if not m.outdoor and p == Vector2i(m.exit_x, m.h - 1):
				ch = "E"
			if ppl.has(p):
				ch = str(ppl[p]).substr(0, 1).to_upper()
			if m.id == Town.world.map.id and p == Town.world.me.tile:
				ch = "@"
			if marks.has(p):
				ch = marks[p]
			row += ch
		pics.store_line(row)
	pics.store_line("")
	pics.flush()
