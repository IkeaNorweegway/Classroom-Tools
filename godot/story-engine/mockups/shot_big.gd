# Like shot.gd, but renders off-screen, so the image can be bigger than the monitor.
#   godot --path godot/story-engine --rendering-method forward_plus -s res://mockups/shot_big.gd -- which=cc0 w=2732 h=1536 out=/abs/path.png
extends SceneTree

func _initialize() -> void:
	OS.low_processor_usage_mode = false
	var args := {}
	for a in OS.get_cmdline_user_args():
		var kv := a.split("=", true, 1)
		args[kv[0]] = kv[1] if kv.size() > 1 else "1"
	var vp := SubViewport.new()
	vp.size = Vector2i(int(args.get("w", "2732")), int(args.get("h", "1536")))
	vp.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	root.add_child(vp)
	vp.add_child(load("res://mockups/street_%s.gd" % args.get("which", "cc0")).new())
	for i in 10:
		await process_frame
	await RenderingServer.frame_post_draw
	vp.get_texture().get_image().save_png(args.get("out", "/tmp/shot.png"))
	quit()
