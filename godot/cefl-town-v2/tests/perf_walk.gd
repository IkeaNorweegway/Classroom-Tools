# Walks across the whole town and reports the frame rate, the slowest frame, and how many sections were built and freed.
#   godot --path godot/cefl-town-v2 --resolution 1366x768 -s res://tests/perf_walk.gd -- debug=1 auto=right
extends SceneTree

func _initialize() -> void:
	OS.low_processor_usage_mode = false
	DisplayServer.window_set_vsync_mode(DisplayServer.VSYNC_DISABLED)
	change_scene_to_file("res://main.tscn")
	await create_timer(3.0).timeout
	var T = root.get_node("Town")
	T.go("town", 43, 47, "down")
	await create_timer(1.0).timeout
	var w = T.world
	var stops := [Vector2i(38, 40), Vector2i(38, 12), Vector2i(4, 12), Vector2i(4, 25), Vector2i(74, 25), Vector2i(74, 47), Vector2i(10, 47)]
	var frames := 0
	var worst := 0.0
	var t0 := Time.get_ticks_usec()
	var last := t0
	var max_sections := 0
	for s in stops:
		w.walk_to(s)
		var guard := 0
		while (not w.path.is_empty() or w.me.t < 1.0) and guard < 20000:
			await process_frame
			var now := Time.get_ticks_usec()
			var ft := (now - last) / 1000.0
			if ft > 25.0 and OS.get_cmdline_user_args().has("slow"):
				print("  slow frame %.1f ms at %s, sections %d, built %d" % [ft, w.me.tile, w.sections.size(), w.stats.built])
			worst = maxf(worst, ft)
			last = now
			frames += 1
			guard += 1
			max_sections = maxi(max_sections, w.sections.size())
	var secs := (Time.get_ticks_usec() - t0) / 1e6
	print("PERF-WALK: %.0f fps average over %.0f s, slowest frame %.1f ms, sections built %d, freed %d, most loaded at once %d of %d, draw calls %d, primitives %d, now at %s" % [
		frames / secs, secs, worst, w.stats.built, w.stats.freed, max_sections, ((T.maps.town.w + 7) / 8) * ((T.maps.town.h + 7) / 8),
		Performance.get_monitor(Performance.RENDER_TOTAL_DRAW_CALLS_IN_FRAME), Performance.get_monitor(Performance.RENDER_TOTAL_PRIMITIVES_IN_FRAME), w.me.tile])
	quit()
