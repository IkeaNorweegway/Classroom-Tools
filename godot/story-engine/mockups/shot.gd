# Art mock-ups: opens one test scene, saves a screenshot, quits. Not part of any game.
#   godot --path godot/story-engine --resolution 1366x768 -s res://mockups/shot.gd -- out=/abs/path.png
extends SceneTree

func _initialize() -> void:
	OS.low_processor_usage_mode = false   # the project sleeps between frames; screenshots need frames
	var args := {}
	for a in OS.get_cmdline_user_args():
		var kv := a.split("=", true, 1)
		args[kv[0]] = kv[1] if kv.size() > 1 else "1"
	var which: String = args.get("which", "3d")
	var scene: Node = load("res://mockups/street_%s.gd" % which).new()
	root.add_child(scene)
	for i in 8:
		await process_frame
	await RenderingServer.frame_post_draw
	var img := root.get_texture().get_image()
	img.save_png(args.get("out", "/tmp/shot.png"))
	quit()
