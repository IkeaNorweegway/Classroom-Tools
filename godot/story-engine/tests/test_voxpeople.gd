# Checks the people pack (realm/voxpeople, scripts/blender/realm_voxel_people.py): every model in pack.json loads, has its clips, the clips loop and move the
# skeleton, and the hero shows one hair style and takes the look's colours. With out=DIR it also saves a line-up
# picture in the town's light and camera.
#   godot --headless --path godot/story-engine -s res://tests/test_voxpeople.gd
#   godot --path godot/story-engine --resolution 1366x768 -s res://tests/test_voxpeople.gd -- out=/abs/dir
extends SceneTree

const Pack = preload("res://engine/world3d/pack.gd")
const P := "realm/voxpeople"
var fails := 0


func check(ok: bool, what: String) -> void:
	if not ok:
		fails += 1
		print("FAIL ", what)


func _initialize() -> void:
	var args := {}
	for a in OS.get_cmdline_user_args():
		var kv := a.split("=", true, 1)
		args[kv[0]] = kv[1] if kv.size() > 1 else "1"
	var stage := Node3D.new()
	get_root().add_child(stage)
	var models: Dictionary = Pack.info(P).get("models", {})
	check(models.size() >= 15, "pack.json lists %d models" % models.size())
	var placed := []
	for name in models:
		var m: Dictionary = models[name]
		var n := Pack.person(P, name, {"skin": 3, "hair": 2, "hair_style": 5, "shirt": 1, "pants": 2, "glasses": true})
		stage.add_child(n)
		placed.append(n)
		var ap := Pack.player(n)
		check(ap != null, name + " has an AnimationPlayer")
		if ap == null:
			continue
		for a in m.anims:
			check(ap.has_animation(a), "%s has %s" % [name, a])
			if ap.has_animation(a):
				check(ap.get_animation(a).loop_mode == Animation.LOOP_LINEAR, "%s %s loops" % [name, a])
		var sk: Skeleton3D = n.find_children("*", "Skeleton3D", true, false)[0]
		check(sk != null, name + " has a skeleton")
		# the walk clip must move bones
		ap.play("walk")
		ap.advance(0.0)
		var before := []
		for b in sk.get_bone_count():
			before.append(sk.get_bone_pose_rotation(b))
		ap.advance(0.25)
		var moved := 0
		for b in sk.get_bone_count():
			if not sk.get_bone_pose_rotation(b).is_equal_approx(before[b]):
				moved += 1
		check(moved >= 3, "%s walk moves %d bones" % [name, moved])
	# the hero: one hair style showing, slot colours from the look
	var hero := Pack.person(P, "hero", {"skin": 4, "hair_style": 2, "shirt": "#d9675c", "glasses": false})
	stage.add_child(hero)
	var hair_on := []
	for c in hero.find_children("Hair_*", "MeshInstance3D", true, false):
		if c.visible:
			hair_on.append(String(c.name))
	check(hair_on == ["Hair_bun"], "hero hair shown: %s" % [hair_on])
	var top := hero.find_child("Top", true, false) as MeshInstance3D
	check(top != null and (top.material_override as StandardMaterial3D).albedo_color.is_equal_approx(Color("#d9675c")), "hero top takes the shirt colour")
	check(not (hero.find_child("Glasses", true, false) as MeshInstance3D).visible, "hero glasses hidden")
	hero.free()
	print("voxel people pack: %d models, %s" % [models.size(), "PASS" if fails == 0 else "%d FAIL" % fails])
	if args.has("out"):
		await _lineup(stage, placed, models.keys(), args.out)
	quit(1 if fails else 0)


func _lineup(stage: Node3D, placed: Array, names: Array, out: String) -> void:
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
	var ground := Node3D.new()
	stage.add_child(ground)
	for x in range(-2, 10):
		for z in range(-1, 3):
			Pack.place("realm/emberdale", "t_grass", ground, Vector3(x * 2.0, 0, z * 2.0))
	# people in a row, then a few heroes in different looks, animals in front
	var looks := [{"skin": 0, "hair": 3, "hair_style": 1, "shirt": 4, "pants": 1, "cloak": "#7a2e3a"},
		{"skin": 5, "hair": 0, "hair_style": 3, "shirt": 3, "pants": 0},
		{"skin": 2, "hair": 1, "hair_style": 5, "shirt": 0, "pants": 2, "glasses": true, "cloak": "#4f6b4a"},
		{"skin": 3, "hair": 0, "hair_style": 4, "shirt": 1, "pants": 4}]
	var i := 0
	var j := 0
	for k in placed.size():
		var n: Node3D = placed[k]
		var m: String = names[k]
		if Pack.info(P).models[m].kind == "animal":
			n.position = Vector3(1.0 + j * 1.6, 0.05, 3.2)
			Pack.play(n, ["idle", "walk", "graze", "idle", "peck", "walk", "sit"][j % 7])
			j += 1
		elif m == "hero":
			n.visible = false
		else:
			n.position = Vector3(i * 1.3, 0.05, 0.0)
			Pack.play(n, ["idle", "talk", "walk", "cast", "idle", "cheer"][i % 6])
			i += 1
	for h in looks.size():
		var n := Pack.person(P, "hero", looks[h])
		n.position = Vector3(i * 1.3 + h * 1.3, 0.05, 0.0)
		stage.add_child(n)
		Pack.play(n, ["idle", "walk", "cast", "cheer"][h])
	var cam := Camera3D.new()
	cam.fov = 30.0
	stage.add_child(cam)
	cam.current = true
	var shots := {"lineup": [Vector3(8, 0.6, 1.2), Vector3(-1.2, 16.0, 11.0)],
		"close_left": [Vector3(2.6, 0.6, 1.2), Vector3(-0.6, 9.4, 6.4)],
		"close_right": [Vector3(13.0, 0.6, 1.0), Vector3(-0.6, 9.4, 6.4)]}
	for k in shots:
		cam.look_at_from_position(shots[k][0] + shots[k][1], shots[k][0])
		for f in 20:
			await process_frame
		get_root().get_texture().get_image().save_png("%s/voxpeople_%s.png" % [out, k])
