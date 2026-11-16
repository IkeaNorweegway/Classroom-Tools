# Opens the walkable city mock-up in a window. Test scene only.
#   godot --path godot/story-engine -s res://mockups/play.gd
extends SceneTree

func _initialize() -> void:
	root.add_child(load("res://mockups/play_city.gd").new())
