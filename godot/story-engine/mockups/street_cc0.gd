# Mock-up C: the café corner built from CC0 art packs (KayKit, Quaternius, Poly Haven) instead of
# art drawn in code. A look test only: not part of any game, and the packs stay out of git.
# Render (Forward+, real GPU window; 2732x1536 is the 2x version):
#   godot --path godot/story-engine --rendering-method forward_plus --resolution 1366x768 \
#     -s res://mockups/shot.gd -- which=cc0 out=/abs/path.png
# user args: cam=top → straight-down layout check; grid=1 → tile labels
extends Node3D

const KK_CITY := "res://mockups/cc0/kk-City-Builder-Bits/addons/kaykit_city_builder_bits/Assets/gltf/"
const KK_REST := "res://mockups/cc0/kk-Restaurant-Bits/addons/kaykit_restaurant_bits/Assets/gltf/"
const KK_FURN := "res://mockups/cc0/kk-Furniture-Bits/addons/kaykit_furniture_bits/Assets/gltf/"
const QT := "res://mockups/cc0/qt/"
const SKY := "res://mockups/cc0/sky/kloofendal_48d_partly_cloudy_puresky.hdr"

# One KayKit city tile is 2 units; at 3.5 m a unit a storey is about 3 m. The scene is in metres.
const CITY := 3.5
const T := 2.0 * CITY          # tile size in metres
const REST := 0.7              # KayKit restaurant/furniture: table 1.0 → 0.7 m
const PERSON := 0.38           # Quaternius people: 4.84 → 1.85 m (a touch chunky, to read at game distance)
const G := 0.1 * CITY          # top of a pavement tile

var args := {}

func _ready() -> void:
	for a in OS.get_cmdline_user_args():
		var kv := a.split("=", true, 1)
		args[kv[0]] = kv[1] if kv.size() > 1 else "1"
	_environment()
	_ground()
	_layout()
	_camera()

# ---------- helpers ----------
func put(path: String, pos: Vector3, rot_deg := 0.0, s := 1.0) -> Node3D:
	var n: Node3D = load(path).instantiate()
	n.position = pos
	n.rotation_degrees.y = rot_deg
	n.scale = Vector3.ONE * s
	add_child(n)
	return n

func city(name: String, i: float, j: float, rot := 0.0) -> Node3D:
	return put(KK_CITY + name + ".gltf", Vector3(i * T, 0, j * T), rot, CITY)

func label(text: String, pos: Vector3) -> void:
	var l := Label3D.new()
	l.text = text
	l.font_size = 400
	l.pixel_size = 0.01
	l.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	l.position = pos
	l.modulate = Color.RED
	add_child(l)

# ---------- scene ----------
func _environment() -> void:
	var vp := get_viewport()
	vp.msaa_3d = Viewport.MSAA_8X
	vp.screen_space_aa = Viewport.SCREEN_SPACE_AA_SMAA
	RenderingServer.directional_shadow_atlas_set_size(8192, true)
	RenderingServer.directional_soft_shadow_filter_set_quality(RenderingServer.SHADOW_QUALITY_SOFT_ULTRA)
	RenderingServer.environment_set_ssao_quality(RenderingServer.ENV_SSAO_QUALITY_ULTRA, true, 0.5, 2, 50, 300)

	var env := Environment.new()
	var sky_mat := PanoramaSkyMaterial.new()
	sky_mat.panorama = load(SKY)
	sky_mat.energy_multiplier = 1.0
	var sky := Sky.new()
	sky.sky_material = sky_mat
	env.background_mode = Environment.BG_SKY
	env.sky = sky
	env.ambient_light_source = Environment.AMBIENT_SOURCE_SKY
	env.ambient_light_energy = float(args.get("amb", "0.9"))
	env.reflected_light_source = Environment.REFLECTION_SOURCE_SKY
	env.tonemap_mode = Environment.TONE_MAPPER_AGX
	env.tonemap_exposure = float(args.get("exp", "1.0"))
	env.ssao_enabled = true
	env.ssao_radius = 1.4
	env.ssao_intensity = 1.6
	env.ssao_power = 1.4
	env.ssil_enabled = true
	env.ssil_radius = 4.0
	env.ssil_intensity = 0.7
	env.glow_enabled = true
	env.glow_intensity = 0.35
	env.glow_bloom = 0.04
	env.glow_hdr_threshold = 1.1
	env.fog_enabled = true
	env.fog_light_color = Color("#dbe6ee")
	env.fog_density = 0.0035
	env.fog_aerial_perspective = 0.2
	env.fog_sky_affect = 0.0
	env.adjustment_enabled = true
	env.adjustment_saturation = float(args.get("sat", "1.04"))
	env.adjustment_brightness = 1.02
	env.adjustment_contrast = 1.03
	var we := WorldEnvironment.new()
	we.environment = env
	var ca := CameraAttributesPractical.new()
	ca.dof_blur_far_enabled = true
	ca.dof_blur_far_distance = 45
	ca.dof_blur_far_transition = 40
	ca.dof_blur_amount = 0.06
	we.camera_attributes = ca
	add_child(we)

	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(float(args.get("sunx", "-34")), float(args.get("suny", "-58")), 0)
	sun.light_color = Color("#ffe9cc")
	sun.light_energy = float(args.get("sun", "1.7"))
	sun.light_angular_distance = 1.4
	sun.shadow_enabled = true
	sun.shadow_blur = 1.3
	sun.directional_shadow_mode = DirectionalLight3D.SHADOW_PARALLEL_4_SPLITS
	sun.directional_shadow_max_distance = 140
	sun.directional_shadow_blend_splits = true
	add_child(sun)

func _ground() -> void:
	var g := MeshInstance3D.new()
	var pm := PlaneMesh.new()
	pm.size = Vector2(600, 600)
	g.mesh = pm
	var m := StandardMaterial3D.new()
	m.albedo_color = Color("#a3bd7e")
	m.roughness = 1.0
	g.material_override = m
	g.position.y = -0.05
	add_child(g)

func mat(c: String, rough := 0.85) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = Color(c)
	m.roughness = rough
	return m

func box(size: Vector3, pos: Vector3, c: String) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = size
	mi.mesh = bm
	mi.material_override = mat(c)
	mi.position = pos
	add_child(mi)
	return mi

# A patio umbrella: low-poly like the packs (8 sides).
func parasol(pos: Vector3, c: String) -> void:
	var pole := MeshInstance3D.new()
	var pm := CylinderMesh.new()
	pm.top_radius = 0.035; pm.bottom_radius = 0.035; pm.height = 2.3; pm.radial_segments = 8
	pole.mesh = pm
	pole.material_override = mat("#eae4d8")
	pole.position = pos + Vector3(0, 1.15, 0)
	add_child(pole)
	var top := MeshInstance3D.new()
	var cm := CylinderMesh.new()
	cm.top_radius = 0.06; cm.bottom_radius = 1.45; cm.height = 0.45; cm.radial_segments = 8
	top.mesh = cm
	top.material_override = mat(c)
	top.position = pos + Vector3(0, 2.35, 0)
	add_child(top)

# Quaternius person, posed on one frame of an animation.
func person(file: String, pos: Vector3, rot: float, anim: String, t := 0.3, s := PERSON) -> Node3D:
	var n := put(QT + "FBX__" + file + ".fbx", pos, rot, s)
	var ap: AnimationPlayer = n.find_children("*", "AnimationPlayer", true, false)[0]
	for a in ap.get_animation_list():
		if a.ends_with("_" + anim) or a.ends_with("|" + anim):
			ap.play(a)
			ap.seek(t * ap.current_animation_length, true)
			ap.speed_scale = 0.0
			break
	return n

func tree(file: String, pos: Vector3, rot := 0.0, s := 1.6) -> void:
	put(QT + "nature/ess/" + file + ".fbx", pos, rot, s)

# Quaternius flower clumps ship untextured; give them their own texture.
func flower(file: String, tex: String, pos: Vector3, rot := 0.0, s := 0.6) -> void:
	var n := put(QT + "nature/fantasy/" + file + ".fbx", pos, rot, s)
	var m := StandardMaterial3D.new()
	m.albedo_texture = load(QT + "nature/fantasy/" + tex + ".png")
	m.roughness = 0.9
	for mi in n.find_children("*", "MeshInstance3D", true, false):
		(mi as MeshInstance3D).material_override = m

func shop_sign(text: String, pos: Vector3) -> void:
	box(Vector3(3.3, 0.62, 0.1), pos, "#f6efe1")
	box(Vector3(3.45, 0.74, 0.06), pos + Vector3(0, 0, -0.05), "#3f6f68")
	var l := Label3D.new()
	l.text = text
	l.font = load("res://fonts/atkinson.woff2")
	l.font_size = 140
	l.pixel_size = 0.0032
	l.modulate = Color("#2f5a55")
	l.shaded = true
	l.position = pos + Vector3(0, -0.01, 0.06)
	add_child(l)

func _layout() -> void:
	var R := 90.0   # road pieces run along z; turn them to run along x
	var back := ["building_H", "building_G", "building_D", "building_C", "building_G", "building_H", "building_D"]
	for k in back.size():
		city(back[k], k - 4, -1)
	# Main Street: the café (building_A, teal shopfront) at x = 0.
	var row := ["building_C", "building_E", "building_F", "building_B", "building_A", "building_E", "building_F"]
	for k in row.size():
		city(row[k], k - 4, 0)
	# Road with a crosswalk at the café, and a cross street on the right.
	for i in range(-4, 3):
		city("road_straight_crossing" if i == 0 else "road_straight", i, 2, R)
	for j in range(-2, 6):
		city("road_junction" if j == 2 else "road_straight", 3, j)
	city("building_C", 4, 0)
	city("building_B", 4, -1)
	city("building_E", 5, 0)

	# Plaza in front of the shops: warm paving, raised to pavement height, with planting beds.
	var z0 := T * 0.5
	box(Vector3(T * 7, G, T), Vector3(-T * 0.5, G * 0.5, T), "#ddd3c1")
	box(Vector3(T * 2, G, T), Vector3(T * 4.5, G * 0.5, T), "#ddd3c1")
	for x in [-24.0, -12.0, 9.5, 19.5]:
		box(Vector3(5.0, 0.3, 2.0), Vector3(x, G + 0.15, z0 + 5.2), "#9cba76")
		box(Vector3(5.2, 0.24, 2.2), Vector3(x, G + 0.06, z0 + 5.2), "#c9bba3")
	# Park across the street.
	box(Vector3(T * 7, 0.1, T * 1.6), Vector3(-T * 0.5, 0.0, T * 3.3), "#a5c182")

	var cx := 0.0
	var front := 0.8 * CITY        # café front wall
	shop_sign("Rosa's Café", Vector3(cx + 0.15, 3.55, front + 0.12))

	var tz := z0 + 1.9
	var tables := [Vector3(cx - 2.8, G, tz), Vector3(cx + 0.3, G, tz + 0.5), Vector3(cx + 3.4, G, tz - 0.1)]
	var umb := ["#f4e9d4", "#d3e3d8", "#f4e9d4"]
	for k in tables.size():
		var p: Vector3 = tables[k]
		put(KK_REST + "table_round_A_small.gltf", p, 25 * k, REST)
		put(KK_REST + "chair_A.gltf", p + Vector3(-0.8, 0, 0.05), -90, REST)
		put(KK_REST + "chair_A.gltf", p + Vector3(0.8, 0, -0.05), 90, REST)
		parasol(p, umb[k])
		# coffee on the table: small plates and cups
		for side in [-1, 1]:
			put(KK_REST + "plate_small.gltf", p + Vector3(side * 0.22, 0.7, side * 0.04), 0, 0.28)
			put(KK_REST + "jar_C_small.gltf", p + Vector3(side * 0.22, 0.73, side * 0.04), 0, 0.17)
	person("Female_Casual", tables[0] + Vector3(-0.75, 0.0, 0.05), -90, "Sitting", 0.5)
	person("Male_Shirt", tables[0] + Vector3(0.75, 0.0, -0.05), 90, "Sitting", 0.5)
	person("Female_Dress", tables[2] + Vector3(0.75, 0.0, -0.05), 90, "Sitting", 0.5)
	person("Male_Casual", Vector3(cx - 4.6, G, front + 1.2), 120, "Idle", 0.2)
	person("Female_TankTop", Vector3(cx - 3.7, G, front + 1.6), -110, "Idle", 0.6)
	person("Male_LongSleeve", Vector3(-9.0, G, z0 + 3.6), 90, "Walk", 0.25)
	person("Female_Alternative", Vector3(-8.0, G, z0 + 4.0), 90, "Walk", 0.75)
	person("Male_Shirt", Vector3(cx + 1.4, G, z0 + 6.9), 200, "Idle", 0.4)
	put(KK_REST + "menu.gltf", Vector3(cx - 1.5, G, front + 0.8), 15, 1.3)

	for x in [-5.2, 5.4]:
		put(KK_CITY + "bush.gltf", Vector3(cx + x, G, z0 + 1.5), 0, CITY * 0.75)
	var bed_trees := [[-24.0, "Tree1"], [-12.0, "Tree3"], [9.5, "Tree1"], [19.5, "Tree3"]]
	for bt in bed_trees:
		tree(bt[1], Vector3(bt[0], G + 0.3, z0 + 5.2), bt[0] * 7, 0.95)
		tree("Bush2", Vector3(bt[0] + 1.6, G + 0.3, z0 + 5.3), bt[0] * 3, 0.55)
		put(KK_CITY + "bench.gltf", Vector3(bt[0] - 0.2, G, z0 + 3.7), 180, CITY)
	for bt in bed_trees:
		for f in 22:
			var fx: float = bt[0] - 2.2 + fmod(f * 1.37, 4.4)
			var fz: float = z0 + 4.45 + fmod(f * 0.61, 1.5)
			var kind := f % 4
			flower("Flower" + ["", "2", "3", ""][kind], ["Flower", "Flower2", "Flower3", "Flower4"][kind], Vector3(fx, G + 0.3, fz), f * 40.0, 0.42 if kind != 2 else 0.5)
	for x in [-18.0, -6.0, 14.5, 23.0]:
		put(KK_CITY + "streetlight.gltf", Vector3(x, G, z0 + 7.2), 90, CITY)
	put(KK_CITY + "firehydrant.gltf", Vector3(7.0, G, z0 + 6.9), 0, CITY)
	put(KK_CITY + "trash_A.gltf", Vector3(-6.8, G, z0 + 6.9), 0, CITY)

	put(KK_CITY + "car_sedan.gltf", Vector3(-13, 0, 2 * T + 1.6), -90, CITY)
	put(KK_CITY + "car_hatchback.gltf", Vector3(-7.5, 0, 2 * T - 1.6), 90, CITY)
	put(KK_CITY + "car_stationwagon.gltf", Vector3(16, 0, 2 * T + 1.6), -90, CITY)

	var pz := 3 * T
	var trees := [["Tree4", -19, pz + 3, 0.8], ["Tree1", -8, pz + 0.5, 1.0], ["Tree3", 0.5, pz + 2.5, 1.05],
		["Tree2", 8, pz + 1, 0.85], ["Tree1", 16, pz + 0.5, 1.0], ["Tree4", 23, pz + 6, 0.8],
		["Tree3", -13, pz + 7, 1.0], ["Tree2", 4, pz + 8, 0.9], ["Tree1", -26, pz + 1, 1.0]]
	for t in trees:
		tree(t[0], Vector3(t[1], 0, t[2]), t[1] * 13, t[3])
	var bushes := [[-15, pz - 2.0, "Bush1"], [-3, pz - 2.2, "Bush3"], [4.5, pz - 1.8, "Bush2"], [12, pz - 2.2, "Bush1"], [20, pz - 1.9, "Bush3"]]
	for b in bushes:
		tree(b[2], Vector3(b[0], 0, b[1]), b[0] * 31, 0.6)
	for g in 70:
		var gx := fmod(g * 7.31, 52.0) - 27.0
		var gz := pz - 3.0 + fmod(g * 3.17, 9.0)
		tree("Grass" + str(1 + g % 3), Vector3(gx, 0.05, gz), g * 47.0, 1.3)
	for x in range(-36, 46, 7):
		tree("Tree" + str(1 + (abs(x) / 7) % 4), Vector3(x, 0, -2.4 * T), x * 11, 1.0 if (abs(x) / 7) % 4 != 3 else 0.8)
	for z in [-6.0, 4.0, 22.0, 30.0]:
		tree("Tree1", Vector3(4 * T + 1, 0, z + T), z * 5, 1.0)
	if args.has("grid"):
		label("café", Vector3(cx, 12, 3))

func _camera() -> void:
	var cam := Camera3D.new()
	add_child(cam)
	if args.get("cam", "") == "top":
		cam.position = Vector3(0, 90, T)
		cam.rotation_degrees = Vector3(-90, 0, 0)
		cam.fov = 60
	else:
		cam.position = Vector3(float(args.get("cx", "12")), float(args.get("cy", "11")), float(args.get("cz", "19.5")))
		cam.look_at(Vector3(float(args.get("lx", "-0.5")), float(args.get("ly", "1.6")), float(args.get("lz", "4.2"))))
		cam.fov = float(args.get("fov", "36"))
	cam.near = 0.3
	cam.far = 500
	cam.current = true
