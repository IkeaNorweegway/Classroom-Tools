extends SceneTree
var n := 0
func _initialize() -> void:
	change_scene_to_file("res://main.tscn")
	for i in 40:
		await create_timer(1.0).timeout
		var Tn = root.get_node("Town")
		var L = Tn.live
		print("HB %d live=%s t=%s at=%s card=%s open=%d" % [i, L.active, str(L.st.get("t", -1)).substr(0, 5), L.st.get("at", ""), L.card_root.visible if is_instance_valid(L.card_root) else "-", Tn.ui.open])
	quit()
