# Walkable version of the city mock-up: you walk the block with a follow camera. Test scene only.
# Run:  godot --path godot/story-engine -s res://mockups/play.gd
# Keys: arrows / WASD walk, Shift jog, mouse wheel or +/- zoom, M music on/off, V draw only the sections near you, Esc quit. Sound: city_audio.gd.
extends "res://mockups/street_3d.gd"

const SPEED := 3.2
const R := 0.16                      # how wide you are, in tiles

var me: MeshInstance3D
var cam: Camera3D
var zoom := 0.62                     # 0 = close, 1 = wide
var walk_t := 0.0
var audio: Node3D
var last_step := 0
var hint: Label
var hint_box: PanelContainer
var blocks: Array[Rect2] = []      # solid boxes, map x/z
var posts: Array[Vector3] = []     # solid circles: x, z, radius


# ── Solid things. Each drawing helper from the mock-up also leaves its footprint here. ──
func _rect(x: float, z: float, w: float, d: float) -> void:
	blocks.append(Rect2(x, z, w, d))


func _post(x: float, z: float, r: float) -> void:
	posts.append(Vector3(x, z, r))


func _street_tree(p: Vector3, k: int) -> void:
	super._street_tree(p, k)
	_rect(p.x - 0.34, p.z - 0.34, 0.68, 0.68)


func _lamp(p: Vector3, out: Vector3) -> void:
	super._lamp(p, out)
	_post(p.x, p.z, 0.12)


func _signal(p: Vector3, dir: Vector3) -> void:
	super._signal(p, dir)
	_post(p.x, p.z, 0.14)


func _hydrant(p: Vector3) -> void:
	super._hydrant(p)
	_post(p.x, p.z, 0.2)


func _bin(p: Vector3) -> void:
	super._bin(p)
	_post(p.x, p.z, 0.25)


func _bike_rack(p: Vector3) -> void:
	super._bike_rack(p)
	_rect(p.x - 0.1, p.z - 0.4, 1.1, 0.95)


func _bench(p: Vector3, yaw: float) -> void:
	super._bench(p, yaw)
	if absf(sin(yaw)) < 0.5:
		_rect(p.x - 0.62, p.z - 0.28, 1.24, 0.56)
	else:
		_rect(p.x - 0.28, p.z - 0.62, 0.56, 1.24)


func _bus_shelter(p: Vector3) -> void:
	super._bus_shelter(p)
	_rect(p.x, p.z + 1.25, 2.4, 0.25)            # back panel; you can stand under the roof
	_rect(p.x + 2.3, p.z + 0.4, 0.15, 0.9)        # map panel
	_post(p.x - 0.27, p.z + 0.13, 0.1)           # bus stop flag


func _car(p: Vector3, col: Color, yaw: float) -> void:
	super._car(p, col, yaw)
	if absf(sin(yaw)) < 0.5:
		_rect(p.x - 0.9, p.z - 0.42, 1.8, 0.84)
	else:
		_rect(p.x - 0.42, p.z - 0.9, 0.84, 1.8)


func _person(look: Dictionary, at: Vector3, yaw: float, sit := false) -> MeshInstance3D:
	var n := super._person(look, at, yaw, sit)
	if at.distance_to(Vector3(10.5, at.y, 11.0)) > 0.05:   # everyone but you
		_post(at.x, at.z, 0.16)
	return n


func player_pos() -> Variant:
	return me.position if me else null


func _building(b: Dictionary) -> void:
	super._building(b)
	match b.style:
		"warehouse":   # loading dock in front of the roll-up doors
			_rect(float(b.x) + 2.6, float(b.y + b.h), 5.2, 0.9)
		"grocery":     # produce stands on the sidewalk (this building faces west)
			for k in 2:
				var sx := 0.2 + k * (float(b.h) - 1.6)
				_rect(float(b.x + b.w) - float(b.w) - 0.8, float(b.y) + sx, 0.65, 1.2)


func _park() -> void:
	super._park()
	var y := 0.17
	for seg in [[0.4, 18.4, 5.2, 18.75], [7.4, 18.4, 13.6, 18.75], [15.6, 18.4, 16.6, 18.75], [16.25, 19.6, 16.6, 27.6]]:
		_rect(seg[0], seg[1], seg[2] - seg[0], seg[3] - seg[1])        # hedges
	for t in park_trees():
		_post(t[0], t[1], 0.35)                                       # tree trunks
	for k in 2:                                                       # flower beds
		_rect(1.0 + k * 7.6 + (2.0 if k == 1 else 0.0), 19.3, 3.2, 0.8)
	var pg := Vector3(13.2, y, 24.0)                                  # playground: slide, ladder end, swing posts
	_rect(pg.x - 1.35, pg.z - 1.25, 1.0, 1.0)
	_rect(pg.x - 0.4, pg.z - 1.1, 1.3, 0.6)
	_post(pg.x + 0.33, pg.z + 0.63, 0.1)
	_post(pg.x + 1.63, pg.z + 0.63, 0.1)


func _garden() -> void:
	super._garden()
	for r in 3:
		for c in 2:
			_rect(33.0 + c * 3.4, 19.2 + r * 2.6, 2.6, 1.4)          # raised beds
	_rect(37.6, 26.2, 1.6, 1.2)                                       # shed
	_rect(32.3, 18.15, 2.6, 0.15)                                     # fence, with a gate gap at x 35–36
	_rect(36.0, 18.15, 4.0, 0.15)


func _patio() -> void:
	super._patio()
	_rect(4.15, 10.05, 6.4 - 4.15, 0.3)                               # planter rail, door gap at x 6.4–7.6
	_rect(7.6, 10.05, 9.85 - 7.6, 0.3)
	_rect(4.4, 9.35, 1.2, 0.8)                                        # tables with their chairs
	_rect(8.25, 9.35, 1.2, 0.8)
	_post(4.2, 10.4, 0.08)                                            # light poles
	_post(9.8, 10.4, 0.08)
	_rect(5.92, 10.36, 0.42, 0.1)                                     # chalkboard, against the planters
	# street-side bollards and plaza planters, drawn inline in _street_furniture
	for z in [18.7, 19.5, 20.3]:
		_post(23.75, z, 0.1)
	for i in 2:
		_rect(28.6 + i * 1.9, 18.6, 1.0, 1.0)


func _ready() -> void:
	animate = true
	super._ready()
	blocks.append_array(solids)
	posts.append_array(solid_posts)
	for w in walkers:   # people who walk aren't fixed posts
		posts = posts.filter(func(q): return Vector2(q.x - w.orig.x, q.y - w.orig.z).length() > 0.05)
	OS.low_processor_usage_mode = false
	for c in get_children():
		if c is Camera3D:
			cam = c
		elif c is MeshInstance3D and c.position.distance_to(Vector3(10.5, c.position.y, 11.0)) < 0.05:
			me = c
	for b in m.buildings:
		blocks.append(Rect2(float(b.x), float(b.y), float(b.w), float(b.h)))
	# the pond (an oval of the rim) is solid too
	_play_hud()
	idlers = idlers.filter(func(i): return i[0] != me)
	audio = load("res://mockups/city_audio.gd").new()
	audio.city = self
	add_child(audio)
	_place_camera(1.0)


func _play_hud() -> void:
	# Swap the bottom hint for the play keys, and add a box that names the door you're next to.
	for c in get_children():
		if c is CanvasLayer:
			for p in c.get_children():
				if p is PanelContainer and p.position.y > 500:
					(p.get_child(0) as Label).text = "Arrows / WASD  walk      Shift  jog      Wheel  zoom      M  music      V  sections      Esc  quit"
			hint_box = PanelContainer.new()
			var sb := StyleBoxFlat.new()
			sb.bg_color = Color("#1e2622", 0.9)
			sb.set_corner_radius_all(18)
			sb.content_margin_left = 18; sb.content_margin_right = 18; sb.content_margin_top = 7; sb.content_margin_bottom = 7
			hint_box.add_theme_stylebox_override("panel", sb)
			hint = Label.new()
			hint.add_theme_font_override("font", font)
			hint.add_theme_font_size_override("font_size", 18)
			hint.add_theme_color_override("font_color", Color("#f5d27a"))
			hint_box.add_child(hint)
			hint_box.visible = false
			c.add_child(hint_box)


func _free(p: Vector3) -> bool:
	if p.x < R or p.z < R or p.x > float(m.w) - R or p.z > float(m.h) - R:
		return false
	var r := Rect2(p.x - R, p.z - R, R * 2, R * 2)
	for b in blocks:
		if b.intersects(r):
			return false
	for q in posts:
		if Vector2(p.x, p.z).distance_to(Vector2(q.x, q.y)) < q.z + R:
			return false
	if dynamic_blocked(p, R) and not dynamic_blocked(me.position, R):   # cars and walkers (never trap you if one reaches you)
		return false
	var pd := Vector2((p.x - 6.5) / (2.5 + R), (p.z - 23.2) / (1.85 + R))   # pond rim
	if pd.length() < 1.0:
		return false
	return true


func _process(dt: float) -> void:
	super._process(dt)
	if me == null:
		return
	var v := Vector2(Input.get_axis("ui_left", "ui_right"), Input.get_axis("ui_up", "ui_down"))
	if Input.is_physical_key_pressed(KEY_A): v.x -= 1
	if Input.is_physical_key_pressed(KEY_D): v.x += 1
	if Input.is_physical_key_pressed(KEY_W): v.y -= 1
	if Input.is_physical_key_pressed(KEY_S): v.y += 1
	if v.length() > 0.01:
		v = v.normalized() * SPEED * (1.7 if Input.is_key_pressed(KEY_SHIFT) else 1.0) * dt
		var p := me.position
		var nx := p + Vector3(v.x, 0, 0)
		if _free(nx): p = nx
		var nz := p + Vector3(0, 0, v.y)
		if _free(nz): p = nz
		me.position = Vector3(p.x, 0.14, p.z)
		me.rotation.y = lerp_angle(me.rotation.y, atan2(v.x, v.y), minf(1.0, dt * 12.0))
		walk_t += dt * 11.0
		if int(walk_t / PI) != last_step:   # a footstep at each bob
			last_step = int(walk_t / PI)
			audio.step()
		me.position.y = 0.14 + absf(sin(walk_t)) * 0.06
	else:
		me.position.y = lerpf(me.position.y, 0.14, minf(1.0, dt * 10.0))
	_place_camera(dt)
	_door_hint()


func _place_camera(dt: float) -> void:
	var off := Vector3(-3.0, 7.5, 7.0).lerp(Vector3(-8.0, 22.0, 21.0), zoom)
	var target := Vector3(me.position.x, 0.6, me.position.z) if me else Vector3(17.5, 0, 15)
	var want := target + off
	cam.position = cam.position.lerp(want, minf(1.0, dt * 4.0))
	cam.look_at(cam.position - off)


func _door_hint() -> void:
	if hint_box == null:
		return
	var best := ""
	for b in m.buildings:
		if not b.has("sign"):
			continue
		var d: Vector2
		if b.get("face", "s") == "w":
			d = Vector2(float(b.x) - 0.5, float(b.y) + float(b.h) / 2.0)
		else:
			d = Vector2(float(b.door) + 0.5, float(b.y) + float(b.h) + 0.5)
		if Vector2(me.position.x, me.position.z).distance_to(d) < 1.6:
			best = b.sign
	hint_box.visible = best != ""
	if best != "":
		hint.text = "%s  ·  door" % best
		hint_box.position = Vector2(533 - hint_box.get_combined_minimum_size().x / 2.0, 520)


func _unhandled_input(ev: InputEvent) -> void:
	if ev is InputEventKey and ev.pressed and not ev.echo and ev.keycode == KEY_V:
		cull_tight = not cull_tight
		cull_t = 0.0
	if ev is InputEventMouseButton and ev.pressed:
		if ev.button_index == MOUSE_BUTTON_WHEEL_UP: zoom = clampf(zoom - 0.08, 0.0, 1.0)
		elif ev.button_index == MOUSE_BUTTON_WHEEL_DOWN: zoom = clampf(zoom + 0.08, 0.0, 1.0)
	elif ev is InputEventKey and ev.pressed:
		if ev.keycode == KEY_ESCAPE: get_tree().quit()
		elif ev.keycode == KEY_M: audio.toggle_music()
		elif ev.keycode in [KEY_EQUAL, KEY_KP_ADD]: zoom = clampf(zoom - 0.1, 0.0, 1.0)
		elif ev.keycode in [KEY_MINUS, KEY_KP_SUBTRACT]: zoom = clampf(zoom + 0.1, 0.0, 1.0)
