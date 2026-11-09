# Screenshots of the student avatar screens: the picker, Pat's stall, the closet, and you in town dressed up.
#   godot --path godot/story-engine --resolution 1366x768 -s res://tests/shot_wardrobe.gd -- game=payday debug=1 auto=right quit=0 out=/abs/dir
extends SceneTree

var T


func _find(n: Node):
	if n.has_method("refresh_look") and "P" in n:
		return n
	for c in n.get_children():
		var f = _find(c)
		if f:
			return f
	return null


func snap(dir: String, nm: String) -> void:
	await create_timer(1.2).timeout
	await process_frame
	await process_frame
	root.get_texture().get_image().save_png(dir.path_join(nm + ".png"))
	print("shot ", nm)


func _initialize() -> void:
	OS.low_processor_usage_mode = false
	var args := {}
	for a in OS.get_cmdline_user_args():
		var kv := a.split("=", true, 1)
		args[kv[0]] = kv[1] if kv.size() > 1 else "1"
	var dir: String = args.get("out", "/tmp")
	change_scene_to_file("res://main.tscn")
	await create_timer(6.0).timeout
	T = _find(root)
	T.auto = ""                       # stop the test player so the panels stay open
	while T.ui.open > 0:              # let anything the test player had open close
		T._ui_done.emit(true)
		await create_timer(0.3).timeout
	T.P.wallet = 5500
	T.P.owned = ["hoodie", "cap"]
	T.P.student.body = args.get("body", "student_f")
	T.D.talk("vendor", T)
	await create_timer(0.5).timeout
	while T.cur == null or str(T.cur.get("kind", "")) != "stall":   # click through Pat's lines
		if T.cur != null and str(T.cur.get("kind", "")) == "say":
			T.cur.solve.call("right")
		await create_timer(0.3).timeout
	await snap(dir, "2_stall")
	T._ui_done.emit(true)
	await create_timer(0.5).timeout
	T.P.owned = ["hoodie", "cap", "runners", "backpack", "headphones"]
	T.D.use("closet", T)
	await snap(dir, "3_closet")
	T._ui_done.emit(true)
	await create_timer(0.5).timeout
	T.P.student.wear = {"top": "hoodie", "hat": "cap", "shoes": "runners", "extra": ["backpack"]}
	T.refresh_look()
	await snap(dir, "4_town")
	T._avatar_pick()
	await snap(dir, "1_picker")
	quit()
