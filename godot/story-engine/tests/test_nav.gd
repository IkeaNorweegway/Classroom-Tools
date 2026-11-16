# Navigation test (no window): from where you start, can you walk to every door, every person and every thing,
# and out of every room again? Also checks that nobody stands on a blocked tile and nothing blocks a doorstep.
# Realm also checks Chapter 2's ways (_realm_ch2): the boulder leaves no way round until it shrinks, the hedge gap opens a
# shortcut, the vault yard is walkable shut and open, and every Growth spot can be reached unsolved and solved.
#   godot --headless --path godot/story-engine -s res://tests/test_nav.gd -- game=town|demo
extends SceneTree

const MapData = preload("res://engine/world/map_data.gd")
const GAMES := {"town": "res://games/cefl_town/game.gd", "demo": "res://games/demo_cafe/game.gd", "payday": "res://games/payday/game.gd"}

var fails := []


func _initialize() -> void:
	var which := "town"
	for a in OS.get_cmdline_user_args():
		if a.begins_with("game="):
			which = a.substr(5)
	var D = load(GAMES[which]).new()
	# a game whose maps change with the story (maps_for) is checked on the maps of every state it lists, plus every flag at once
	# Where the maps change with the story, each state's people are checked on that state's maps, and everyone on the maps with
	# every flag on; a game with fixed maps checks everyone on them (people_states null = every state).
	var map_sets := [D.maps()]
	var people_states := [null]
	if D.has_method("maps_for"):
		var all_flags := {}
		people_states = [[{"day": 1, "flags": {}, "mem": {}, "shop": null, "days": [], "cash": 0}]]
		for SS in D.nav_states():
			map_sets.append(D.maps_for(SS))
			people_states.append([SS])
			all_flags.merge(SS.flags, true)
		if D.has_method("nav_flags"):
			for k in D.nav_flags():
				all_flags[k] = true
		map_sets.append(D.maps_for({"flags": all_flags}))
		people_states.append(null)
	for mi in map_sets.size():
		_check_maps(D, map_sets[mi], which + ("" if mi == 0 else " (state %d)" % mi), people_states[mi])
	var uniq := {}
	for f in fails:
		uniq[f] = true
	fails = uniq.keys()
	print("NAV %s: %d map sets, %d problems" % [which, map_sets.size(), fails.size()])
	for f in fails:
		print("  ✗ ", f)
	quit(1 if fails.size() else 0)


func _check_maps(D, defs: Dictionary, which: String, pstates = null) -> void:
	var maps := {}
	for id in defs:
		maps[id] = MapData.new(id, defs[id])
	var people: Dictionary = D.people()
	var checked := 0
	var reach := {}
	# every outdoor area: walk from where you arrive (the start, or the first edge link into it)
	for oid in maps:
		var om: MapData = maps[oid]
		if not om.outdoor:
			continue
		var from: Vector2i = D.start_at if oid == D.start_map else Vector2i(-1, -1)
		if from.x < 0:
			for mid in maps:
				for p in maps[mid].links:
					var l: Dictionary = maps[mid].links[p]
					if l.to == oid and l.at != null:
						from = l.at
						checked += 1
						if om.blocked(from.x, from.y):
							fails.append("%s: arriving from %s at %s, the tile is blocked" % [oid, mid, from])
		if from.x < 0:
			fails.append("%s: no way in" % oid)
			continue
		var r := _bfs(om, from, people, D)
		# and from every edge you can arrive by (a far bank may be reached only from the next area)
		for mid in maps:
			for p in maps[mid].links:
				var l: Dictionary = maps[mid].links[p]
				if l.to == oid and l.at != null and not r.has(l.at) and not om.blocked(l.at.x, l.at.y):
					r.merge(_bfs(om, l.at, people, D))
		if oid == D.start_map:
			reach = r
		_check_area(om, r, people, D, maps, pstates)
		checked += om.links.size() + om.things.size()
	print("NAV %s: %d checks, %d reachable tiles from the start" % [which, checked, reach.size()])


func _check_area(start: MapData, reach: Dictionary, people: Dictionary, D, maps: Dictionary, pstates = null) -> void:
	var checked := 0
	# every door (and the doorstep in front of it) on the start map
	for p in start.links:
		var l: Dictionary = start.links[p]
		checked += 1
		if not _near(reach, p):
			fails.append("%s: can't reach the door to %s at %s" % [start.id, l.to, p])
		var step_y: int = p.y - 1 if l.get("face", "s") == "n" else p.y + 1
		if l.at == null and start.blocked(p.x, step_y):
			fails.append("%s: the doorstep below %s's door is blocked" % [start.id, l.to])
	# every thing with an id
	for k in start.things:
		var t: Dictionary = start.things[k]
		checked += 1
		var ok := false
		for y in range(t.y, t.y + t.h):
			for x in range(t.x, t.x + t.w):
				if _near(reach, Vector2i(x, y)) or reach.has(Vector2i(x, y)):
					ok = true
		if not ok:
			fails.append("%s: can't reach %s" % [start.id, k])
	# every person, on whatever map they stand
	var S := {"day": 1, "flags": {}, "mem": {}, "shop": null, "days": [], "cash": 0}
	var states := [S]
	if D.has_method("nav_states"):   # a game whose people move with the story lists the states worth checking
		states += D.nav_states()
	if pstates != null:
		states = pstates
	var placed := []
	var seen := {}
	for SS in states:
		for pid in people:
			var w = D.where(pid, SS)
			if w != null and not seen.has("%s %s %s %s" % [pid, w.map, w.x, w.y]):
				seen["%s %s %s %s" % [pid, w.map, w.x, w.y]] = true
				placed.append([pid, w])
	for pw in placed:
		var pid: String = pw[0]
		var w = pw[1]
		checked += 1
		var m: MapData = maps[w.map]
		var at := Vector2i(int(w.x), int(w.y))
		if m.blocked(at.x, at.y):
			fails.append("%s stands on a blocked tile on %s at %s" % [pid, w.map, at])
		if w.map == start.id:
			if not _near(reach, at):
				fails.append("can't reach %s on %s" % [pid, w.map])
		elif maps[w.map].outdoor:
			continue
		else:
			var r2 := _bfs(m, m.arrive, people, D, w.map)
			if not _near(r2, at):
				fails.append("can't reach %s inside %s" % [pid, w.map])
	# every room: from where you come in, the way out is open, and its things are in reach
	for id in maps:
		var m: MapData = maps[id]
		if m.outdoor:
			continue
		checked += 1
		var r3 := _bfs(m, m.arrive, people, D, id)
		if not r3.has(Vector2i(m.exit_x, m.h - 2)):
			fails.append("%s: no way back to the exit" % id)
		for k in m.things:
			var t: Dictionary = m.things[k]
			if not _near(r3, Vector2i(t.x, t.y)):
				fails.append("%s: can't reach %s" % [id, k])
		if start.outside_door(id) == null and id != D.start_map:
			var any := false
			for mid in maps:
				if maps[mid].outdoor and maps[mid].outside_door(id) != null:
					any = true
			if not any:
				fails.append("%s: no door leads here" % id)


func _blocked_by_person(m: MapData, p: Vector2i, people: Dictionary, D, map_id: String) -> bool:
	var S := {"day": 1, "flags": {}, "mem": {}, "shop": null, "days": [], "cash": 0}
	for pid in people:
		var w = D.where(pid, S)
		if w != null and w.map == map_id and Vector2i(int(w.x), int(w.y)) == p:
			return true
	return false


func _bfs(m: MapData, from: Vector2i, people: Dictionary, D, map_id := "") -> Dictionary:
	if map_id == "":
		map_id = m.id
	var seen := {from: true}
	var q := [from]
	while not q.is_empty():
		var p: Vector2i = q.pop_front()
		for d in [Vector2i(1, 0), Vector2i(-1, 0), Vector2i(0, 1), Vector2i(0, -1)]:
			var n: Vector2i = p + d
			if seen.has(n) or m.blocked(n.x, n.y) or _blocked_by_person(m, n, people, D, map_id):
				continue
			seen[n] = true
			q.append(n)
	return seen


func _near(reach: Dictionary, p: Vector2i) -> bool:
	for d in [Vector2i(1, 0), Vector2i(-1, 0), Vector2i(0, 1), Vector2i(0, -1)]:
		if reach.has(p + d):
			return true
	return false


## Realm Chapter 2: walk Highstead from the Low Road (its arrival from Brindle Ford) and Brindle Ford from the start.
func _realm_ch2(D) -> void:
	var after1 := {"bridge_fell": true, "met_orrin": true, "met_hesper": true, "rune_broken": true, "rune_over": true, "sigil": true, "sigil_wheel": true,
		"wheel_scene": true, "lambs_in": true, "ch2": true}
	var mk := func(extra: Dictionary) -> Dictionary:
		var f: Dictionary = after1.duplicate()
		f.merge(extra, true)
		var defs: Dictionary = D.maps_for({"flags": f})
		return {"brindle": MapData.new("brindle", defs.brindle), "highstead": MapData.new("highstead", defs.highstead), "flags": f}
	var people: Dictionary = D.people()
	var road := Vector2i(18, 44)      # where the Low Road comes into Highstead
	var market := Vector2i(32, 24)
	# the boulder: no way round while it is there; Bram and Orrin reachable beside it; open once it has shrunk
	var m: Dictionary = mk.call({"boulder_here": true, "quest": "boulder"})
	var r := _bfs(m.highstead, road, people, D)
	if r.has(market) or r.has(Vector2i(18, 29)):
		fails.append("ch2: with the boulder in place there is a way round it into Highstead")
	if not m.highstead.blocked(18, 32) or not m.highstead.blocked(19, 33):
		fails.append("ch2: the boulder does not block the road")
	for pid in ["bram", "orrin"]:
		var w = D.where(pid, {"flags": m.flags})
		if w == null or not _near(r, Vector2i(w.x, w.y)):
			fails.append("ch2: can't reach %s at the boulder" % pid)
	m = mk.call({"boulder_here": true, "boulder_done": true})
	r = _bfs(m.highstead, road, people, D)
	if not r.has(market):
		fails.append("ch2: after the boulder shrinks the road into Highstead is still shut")
	# the vault yard: shut and open, the gate thawed; Gale, Orrin and the vault vine star reachable; the door blocks
	for open in [false, true]:
		m = mk.call({"boulder_here": true, "boulder_done": true, "at_vault": true, "sigil_gate": true, "rune2_broken": open, "sigil2": open})
		r = _bfs(m.highstead, road, people, D)
		for pid in ["gale", "orrin"]:
			var w = D.where(pid, {"flags": m.flags})
			if w != null and w.map == "highstead" and not _near(r, Vector2i(w.x, w.y)):
				fails.append("ch2: can't reach %s at the vault (%s)" % [pid, "open" if open else "shut"])
		for x in range(41, 46):
			if not m.highstead.blocked(x, 8):
				fails.append("ch2: the vault door doesn't stand at (%d, 8)" % x)
		if open and not (_near(r, Vector2i(46, 8)) or r.has(Vector2i(46, 8))):
			fails.append("ch2: can't reach the vault vine star")
		if not r.has(Vector2i(40, 6)) or not r.has(Vector2i(41, 7)):
			fails.append("ch2: the strip under the hay stack (40–41, 6–7) is sealed off")
	# the hedge gap: shut, the gap tiles block; open, they are walkable and a shorter way from the fold to the Low Road
	var lens := []
	for solved in [false, true]:
		m = mk.call({"sigil2": true, "growth_hedge": solved, "growth_ledge": solved, "growth_window": solved, "_pips_full": true})
		var b: MapData = m.brindle
		for y in [7, 8]:
			if b.blocked(16, y) == solved:
				fails.append("ch2: the hedge gap at (16, %d) is %s with growth_hedge %s" % [y, "shut" if solved else "open", solved])
		r = _bfs(b, D.start_at, people, D)
		for sp in [["growth_ledge", Vector2i(8, 16)], ["growth_hedge", Vector2i(14, 7)], ["growth_window", Vector2i(40, 15)]]:
			if not (r.has(sp[1]) or _near(r, sp[1])):
				fails.append("ch2: can't reach %s (%s)" % [sp[0], "solved" if solved else "unsolved"])
		lens.append(_dist(b, Vector2i(14, 8), Vector2i(18, 2), people, D))
	if not (lens[1] < lens[0]):
		fails.append("ch2: the hedge gap is no shortcut (%s steps shut, %s open)" % lens)
	# the pond ledge: reachable with the pond frozen or not; the seed bed, the tally board and Bram at the barn
	for frozen in [false, true]:
		m = mk.call({"sigil2": true, "sigil_pond": frozen, "boulder_done": true, "quest": "jar"})
		r = _bfs(m.brindle, D.start_at, people, D)
		for pid in ["odile", "bram", "pell", "hesper"]:
			var w = D.where(pid, {"flags": m.flags})
			if w != null and w.map == "brindle" and not _near(r, Vector2i(w.x, w.y)):
				fails.append("ch2: can't reach %s in Brindle Ford" % pid)
			if w != null and w.map == "brindle" and m.brindle.blocked(w.x, w.y):
				fails.append("ch2: %s stands on a blocked tile" % pid)
	print("NAV realm ch2: boulder %s/%s, hedge shortcut %s → %s steps" % ["shut", "open", lens[0], lens[1]])


## Steps from a to b (−1: no way).
func _dist(m: MapData, a: Vector2i, b: Vector2i, people: Dictionary, D) -> int:
	var seen := {a: 0}
	var q := [a]
	while not q.is_empty():
		var p: Vector2i = q.pop_front()
		if p == b:
			return seen[p]
		for d in [Vector2i(1, 0), Vector2i(-1, 0), Vector2i(0, 1), Vector2i(0, -1)]:
			var n: Vector2i = p + d
			if seen.has(n) or m.blocked(n.x, n.y) or _blocked_by_person(m, n, people, D, m.id):
				continue
			seen[n] = seen[p] + 1
			q.append(n)
	return 1 << 20
