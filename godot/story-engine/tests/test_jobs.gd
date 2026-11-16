# Payday's live shifts: bots play every job, every shift twist (paycheques 1–8), Gentle and Real.
# Passes when a careful bot reaches great at least 90% of the time on every twist, and an idle or random-tapping bot never
# reaches ok, and a steady bot gets poor at most a quarter of the time. A steady bot (careful, 60% slower: a real student) should mostly reach great or ok, and a sloppy bot (slower,
# about one move in five at random) lands in the middle; both are reported so the middle of the scale can be read.
#   godot --headless --path godot/story-engine -s res://tests/test_jobs.gd -- [job=grocer] [n=40] [v=1]
extends SceneTree

const JOBS := ["grocer", "busser", "sports", "warehouse", "bikeshop", "phones", "office", "apprentice", "furniture"]


func _init() -> void:
	var args := {}
	for a in OS.get_cmdline_user_args():
		var kv := a.split("=", true, 1)
		args[kv[0]] = kv[1] if kv.size() > 1 else "1"
	var only: String = args.get("job", "")
	var n := int(args.get("n", "40"))
	var fails := 0
	for jk in JOBS:
		if only != "" and jk != only:
			continue
		var path := "res://games/payday/jobs/%s.gd" % jk
		if not ResourceLoader.exists(path):
			print("%-10s (not built yet)" % jk)
			continue
		var J = load(path).new()
		var lay := _layout(J)
		if lay != "":
			print("%-10s LAYOUT %s" % [jk, lay])
			fails += 1
		for real in [false, true]:
			var line := "%-10s %-6s" % [jk, "real" if real else "gentle"]
			for p in range(1, 9):
				var c := {"great": 0, "ok": 0, "poor": 0}
				var sl := {"great": 0, "ok": 0, "poor": 0}
				var sd := {"great": 0, "ok": 0, "poor": 0}
				var worst_other := "poor"
				var q := 0.0
				var cv := 0.0
				for s in n:
					var st: Dictionary = J.play(1000 + s, real, p, "careful")
					c[J.tier(st)] += 1
					q += J.quality(st)
					cv += J.coverage(st)
					var st2: Dictionary = J.play(2000 + s, real, p, "sloppy")
					sl[J.tier(st2)] += 1
					sd[J.tier(J.play(4000 + s, real, p, "steady"))] += 1
					if s < maxi(6, n / 4):
						for k in ["idle", "random"]:
							var t: String = J.tier(J.play(3000 + s, real, p, k))
							if t != "poor":
								worst_other = t + "(" + k + ")"
				var ok: bool = c.great >= ceili(n * 0.9) and worst_other == "poor" and sd.poor <= floori(n * 0.25)
				if not ok:
					fails += 1
				line += "  p%d %s%3d%%" % [p, " " if ok else "!", roundi(100.0 * c.great / n)]
				if args.has("v"):
					print("   %s p%d careful g/o/p %d/%d/%d q=%.2f cov=%.2f · steady %d/%d/%d · sloppy %d/%d/%d · others %s" % [jk, p, c.great, c.ok, c.poor, q / n, cv / n, sd.great, sd.ok, sd.poor, sl.great, sl.ok, sl.poor, worst_other])
			print(line)
	print("JOBS-RESULT fails=%d" % fails)
	quit(1 if fails else 0)


## The work floor: every station's standing tile is open, next to the station, and reachable from the start.
func _layout(J) -> String:
	var MapData = load("res://engine/world/map_data.gd")
	var m = MapData.new("shift_" + J.id, J.room_map)
	var seen := {J.start: true}
	var q: Array = [J.start]
	if m.blocked(J.start.x, J.start.y):
		return "start tile is blocked"
	if m.blocked(J.boss_at.x, J.boss_at.y):
		return "boss stands on a blocked tile"
	while q.size():
		var t: Vector2i = q.pop_front()
		for d in [Vector2i(1, 0), Vector2i(-1, 0), Vector2i(0, 1), Vector2i(0, -1)]:
			var n: Vector2i = t + d
			if not seen.has(n) and not m.blocked(n.x, n.y) and n != J.boss_at:
				seen[n] = true
				q.append(n)
	for sid in J.stations:
		var st: Dictionary = J.stations[sid]
		var sd: Vector2i = st.stand
		if not seen.has(sd):
			return "%s: standing tile %s can't be reached" % [sid, sd]
		var th = m.things.get(sid)
		if th == null:
			return "%s: no thing with that id on the map" % sid
		var near := false
		for y in range(int(th.y), int(th.y) + int(th.h)):
			for x in range(int(th.x), int(th.x) + int(th.w)):
				if absi(x - sd.x) + absi(y - sd.y) <= 1:
					near = true
		if not near:
			return "%s: standing tile %s is not next to it" % [sid, sd]
	return ""
