# Runs the game and saves a screenshot after a few seconds. Takes the game's own options too.
#   godot --path godot/story-engine --resolution 1366x768 -s res://tests/shot.gd -- debug=1 auto=right hold=… wait=4 out=/abs/path.png
extends SceneTree

func _initialize() -> void:
	OS.low_processor_usage_mode = false
	var args := {}
	for a in OS.get_cmdline_user_args():
		var kv := a.split("=", true, 1)
		args[kv[0]] = kv[1] if kv.size() > 1 else "1"
	change_scene_to_file("res://main.tscn")
	await create_timer(float(args.get("wait", "4"))).timeout
	await process_frame   # frame_post_draw does not always fire on a Wayland window
	await process_frame
	root.get_texture().get_image().save_png(args.get("out", "/tmp/shot.png"))
	quit()
