# Lays out a small Brindle Ford from the Emberdale pack (Blender models) with the town's light, sky and camera,
# and saves screenshots. A look check for a pack, not a game.
#   godot --path godot/cefl-town-v2 --resolution 1366x768 -s res://tests/pack_preview.gd -- out=/abs/dir [t=2]
extends SceneTree

const Pack = preload("res://engine/world3d/pack.gd")
const P := "realm/emberdale"
var stage: Node3D
var cam: Camera3D


func _initialize() -> void:
	var args := {}
	for a in OS.get_cmdline_user_args():
		var kv := a.split("=", true, 1)
		args[kv[0]] = kv[1] if kv.size() > 1 else "1"
	var out: String = args.get("out", "/tmp")
	stage = Node3D.new()
	get_root().add_child(stage)
	_world()
	_village()
	await process_frame
	var shots := {
		"wide": [Vector3(13, 0.6, 10), Vector3(-1.6, 22.0, 15.0)],
		"close_ford": [Vector3(9, 0.6, 9), Vector3(-0.6, 9.4, 6.4)],
		"close_gorge": [Vector3(20, 0.6, 7), Vector3(-0.6, 9.4, 6.4)],
		"close_cottage": [Vector3(5, 0.6, 14), Vector3(-0.6, 9.4, 6.4)],
	}
	for k in shots:
		var t: Vector3 = shots[k][0]
		var off: Vector3 = shots[k][1]
		cam.position = t + off
		cam.look_at(t)
		for i in 3:
			await process_frame
		get_root().get_texture().get_image().save_png("%s/pack_%s.png" % [out, k])
	quit()


func _world() -> void:
	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-42, -38, 0)
	sun.light_color = Color("#ffe6c6")
	sun.light_energy = 0.95
	stage.add_child(sun)
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color("#cfd9d4")
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color("#9a97c6")
	env.ambient_light_energy = 0.62
	env.tonemap_mode = Environment.TONE_MAPPER_LINEAR
	var we := WorldEnvironment.new()
	we.environment = env
	stage.add_child(we)
	cam = Camera3D.new()
	cam.fov = 30.0
	cam.far = 200.0
	stage.add_child(cam)
	cam.current = true


## Terrain in 2 x 2 cells: cell (cx, cz) covers tiles 2cx..2cx+2. A model's origin is its footprint's centre.
func tile(name: String, cx: int, cz: int, yaw := 0.0) -> void:
	Pack.place(P, name, stage, Vector3(cx * 2 + 1, 0, cz * 2 + 1), yaw)


func put(name: String, x: float, z: float, yaw := 0.0) -> Node3D:
	return Pack.place(P, name, stage, Vector3(x, 0, z), yaw)


func _village() -> void:
	# 14 x 11 cells (28 x 22 tiles). River along cell row 5, a ford at column 4, the gorge in columns 10-12.
	for cz in 11:
		for cx in 14:
			var n := "t_grass_b" if (cx * 7 + cz * 3) % 5 == 0 else "t_grass"
			if cx >= 10 and cx <= 12:
				n = "t_gorge_floor" if cx == 11 else ("t_gorge_edge")
				var yaw := 0.0
				if cx == 10: yaw = 90.0       # west wall: yaw 90 turns its face (+z) to +x, into the gorge
				if cx == 12: yaw = -90.0      # east wall faces west
				tile(n, cx, cz, yaw)
				continue
			if cx == 13:
				n = "t_far_bank"
			elif cz == 5:
				n = "t_ford" if cx == 4 else "t_water"
			elif cz == 4 and cx != 4:
				tile("t_bank", cx, cz, 0)
				continue
			elif cz == 6 and cx != 4:
				tile("t_bank", cx, cz, 180)
				continue
			elif cx == 4:
				n = "t_path"
			elif cz <= 2 and cx >= 6 and cx <= 9:
				n = "t_stubble"
			elif cz <= 1 and cx <= 2:
				n = "t_canola"
			tile(n, cx, cz)
	tile("t_waterfall", 10, 5, 90)
	# buildings
	put("cottage_hesper", 4, 18)
	put("root_cellar", 7.5, 19)
	put("herb_bed", 4, 21.2)
	put("house_a", 13, 17)
	put("house_b", 17.5, 17)
	put("house_small", 15.5, 21.5)
	put("mill", 15, 6.5)
	put("well", 10.5, 15)
	put("barn", 15, 2.5, 0)
	put("fold", 4, 4, 0)
	put("bridge_broken", 20, 4, -90)
	put("gate_arch", 9, 1)
	put("sigil_spot", 7, 15)
	# props
	for z in [8.0, 10.0]:
		put("fence_rail", 6, z, 90)
	put("hay_stack", 19, 1.5)
	put("cart_grain", 12, 4.0, 0)
	put("sack_pile", 13.5, 9.5)
	put("barrel", 12.5, 9.5)
	put("woodpile", 1.5, 18.5, 90)
	put("lantern_post", 10.2, 17.5)
	put("signpost", 10.2, 13.5)
	put("tree_cottonwood", 1.5, 14.5)
	put("tree_aspen", 22, 16)
	put("tree_aspen_au", 23, 19)
	put("tree_spruce", 1, 21)
	put("bush", 8, 17)
	put("boulder", 23, 13)
	put("hen_coop", 1.5, 21)
	put("hen", 3, 20.6)
	put("scarecrow", 17, 3.5)
	for s in [[3, 3], [5.5, 4.5], [2.5, 5.5], [6, 2.6]]:
		put("sheep", s[0], s[1], randf() * 360)
