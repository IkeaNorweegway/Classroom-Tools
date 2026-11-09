# Walks across the whole town and reports the frame rate, the slowest frame, and how many sections were built and freed.
#   godot --path godot/story-engine --resolution 1366x768 -s res://tests/perf_walk.gd -- debug=1 auto=right
extends SceneTree

func _initialize() -> void:
	OS.low_processor_usage_mode = false
	DisplayServer.window_set_vsync_mode(DisplayServer.VSYNC_DISABLED)
	change_scene_to_file("res://main.tscn")
	await create_timer(3.0).timeout
	var T = root.get_node("Town")
	var route: Array = [["neighbourhoods", Vector2i(38, 27), [Vector2i(38, 27)]]]
	if T.maps.has("town"):   # the old single-map town
		route = [["town", Vector2i(43, 47), [Vector2i(38, 40), Vector2i(38, 12), Vector2i(4, 12), Vector2i(4, 25), Vector2i(74, 25), Vector2i(74, 47), Vector2i(10, 47)]]]
	else:   # through three areas: up the Avenue to Downtown, east along Main Street to Shopping and back
		route = [["neighbourhoods", Vector2i(38, 27), [Vector2i(29, 27), Vector2i(29, 0)]],
			["downtown", null, [Vector2i(29, 23), Vector2i(4, 23), Vector2i(59, 23)]],
			["shopping", null, [Vector2i(30, 22), Vector2i(31, 40), Vector2i(31, 23), Vector2i(0, 23)]]]
	var w = T.world
	var frames := 0
	var worst := 0.0
	var t0 := Time.get_ticks_usec()
	var last := t0
	var max_sections := 0
	for leg in route:
		if leg[1] != null:
			T.go(leg[0], leg[1].x, leg[1].y, "down")
			await create_timer(1.0).timeout
		last = Time.get_ticks_usec()
		for s in leg[2]:
			w.walk_to(s)
			var guard := 0
			while (not w.path.is_empty() or w.me.t < 1.0) and guard < 20000:
				await process_frame
				var now := Time.get_ticks_usec()
				var ft := (now - last) / 1000.0
				if ft > 25.0 and OS.get_cmdline_user_args().has("slow"):
					print("  slow frame %.1f ms on %s at %s, sections %d, built %d" % [ft, w.map.id, w.me.tile, w.sections.size(), w.stats.built])
				worst = maxf(worst, ft)
				last = now
				frames += 1
				guard += 1
				max_sections = maxi(max_sections, w.sections.size())
		await create_timer(1.2).timeout   # the fade into the next area (not counted as walking)
		last = Time.get_ticks_usec()
	var secs := (Time.get_ticks_usec() - t0) / 1e6
	print("PERF-WALK: %.0f fps average over %.0f s, slowest frame %.1f ms, sections built %d, freed %d, most loaded at once %d of %d, draw calls %d, primitives %d, now on %s at %s, cars on screen %d" % [
		frames / secs, secs, worst, w.stats.built, w.stats.freed, max_sections, ((w.map.w + 7) / 8) * ((w.map.h + 7) / 8),
		Performance.get_monitor(Performance.RENDER_TOTAL_DRAW_CALLS_IN_FRAME), Performance.get_monitor(Performance.RENDER_TOTAL_PRIMITIVES_IN_FRAME), w.map.id, w.me.tile, w.cars.filter(func(c): return c.node != null).size()])
	quit()
