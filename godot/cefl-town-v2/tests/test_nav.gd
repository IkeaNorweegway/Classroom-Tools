# Navigation test (no window): from where you start, can you walk to every door, every person and every thing,
# and out of every room again? Also checks that nobody stands on a blocked tile and nothing blocks a doorstep.
#   godot --headless --path godot/cefl-town-v2 -s res://tests/test_nav.gd -- game=town|demo
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
	var defs: Dictionary = D.maps()
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
		if oid == D.start_map:
			reach = r
		_check_area(om, r, people, D, maps)
		checked += om.links.size() + om.things.size()
	var uniq := {}
	for f in fails:
		uniq[f] = true
	fails = uniq.keys()
	print("NAV %s: %d checks, %d reachable tiles from the start, %d problems" % [which, checked, reach.size(), fails.size()])
	for f in fails:
		print("  ✗ ", f)
	quit(1 if fails.size() else 0)


func _check_area(start: MapData, reach: Dictionary, people: Dictionary, D, maps: Dictionary) -> void:
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
