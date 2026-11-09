# Mock-up A: a calm city block in low-poly 3D (flat-shaded faces, angled camera, soft real shadows).
# Its own 40×28 map (1 tile = 1 unit), with the demo's four story places. Test scene only.
#   user args: cam=close  → a close shot of Rosa's patio
extends Node3D

const Game = preload("res://games/demo_cafe/game.gd")

# Late-afternoon city palette: soft, a little dusty, nothing pure.
const C := {
	"road": Color("#595c66"), "road_lt": Color("#6a6d75"), "line": Color("#e6dcc4"), "bike": Color("#7f9a86"),
	"walk": Color("#c4c0b6"), "walk_jt": Color("#b3afa4"), "curb": Color("#9c988e"),
	"grass": Color("#8ba56b"), "grass_dk": Color("#7a965f"), "hedge": Color("#5f8355"),
	"leaf": Color("#6f9a5c"), "leaf2": Color("#88a865"), "leaf_au": Color("#c99a5e"), "leaf_dk": Color("#557a4e"),
	"trunk": Color("#6b5040"), "wood": Color("#a07650"), "wood_dk": Color("#6e5038"),
	"metal": Color("#3b4044"), "metal_lt": Color("#8c9298"), "concrete": Color("#bdb6aa"),
	"glass": Color("#5d7891"), "glass_hi": Color("#8faabd"), "frame": Color("#f1e8d8"),
	"water": Color("#79aab3"), "water_hi": Color("#9cc3c6"), "stone": Color("#cfc6b5"),
	"path": Color("#d9c7a3"), "sand": Color("#e2d2ac"), "soil": Color("#7a5a44"),
}

var mat: StandardMaterial3D
var gmat: StandardMaterial3D
var st: SurfaceTool
var st_main: SurfaceTool
var st_glow: SurfaceTool
var font: Font
var m: Dictionary
var xf := Transform3D.IDENTITY
var tris := 0
var close := false
## Detail: how many faces round things get (tree tops, bushes, poles, umbrellas, people). 1.0 = the first mock-up.
var detail := 2.8
## Motion. The walkable version turns it on; screenshots stay still.
var animate := false
var clock := 0.0
var trees_m := []        # [node, phase]
var swings := []         # [node, phase, amp]
var ducks := []          # [node, angle, speed, rx, rz]
var jets := []           # [node, phase]
var ripples := []        # [node, phase]
var curtains := []       # [node, phase]
var movers := []         # moving cars: {node, lane, s, v}
var walkers := []        # {node, pts, i, dir, speed, loop, dog, orig, phase}
var idlers := []         # [node, phase, sit, yaw]
var lit := {"main_green": [], "main_red": [], "fifth_green": [], "fifth_red": []}
var light_phase := 0     # 0 Main St green, 1 all red, 2 5th Ave green, 3 all red
var phase_t := 0.0
const PHASES := [14.0, 2.5, 10.0, 2.5]
var solids: Array[Rect2] = []          # things you can't walk through (the walkable version reads these)
var solid_posts: Array[Vector3] = []   # round ones: x, z, radius
var wmat: StandardMaterial3D           # see-through water
var lmat: StandardMaterial3D           # lit traffic lamps
var pond_c := Vector3(6.5, 0, 23.2)
var pond_w := 0.24
var _part_keep := []
## Driving lanes. s runs from "from" to "to"; "stop" is where a car waits at a red light.
const LANES := {
	"e": {"axis": "x", "dir": 1.0, "fixed": 14.55, "yaw": 0.0, "from": -16.0, "to": 56.0, "stop": 15.0, "road": "main"},
	"w": {"axis": "x", "dir": -1.0, "fixed": 13.45, "yaw": PI, "from": 56.0, "to": -16.0, "stop": 25.0, "road": "main"},
	"n": {"axis": "z", "dir": -1.0, "fixed": 20.5, "yaw": PI / 2.0, "from": 46.0, "to": -22.0, "stop": 18.9, "road": "fifth"},
	"s": {"axis": "z", "dir": 1.0, "fixed": 19.4, "yaw": -PI / 2.0, "from": -22.0, "to": 46.0, "stop": 8.7, "road": "fifth"},
}
## Moving traffic: lane, where along it, colour.
const MOVING_CARS := [["w", 6.0, "#d6d0c4"], ["e", 27.0, "#7e8fa6"], ["n", 6.0, "#c7a06e"], ["s", 24.0, "#a9a39b"],
	["e", -4.0, "#b9a7c9"], ["w", 42.0, "#9fb7a8"], ["n", 32.0, "#c9a98d"], ["s", -8.0, "#a9b4c2"], ["e", 46.0, "#c4b9a0"]]
## Everyone (you included) is this size.
const PERSON_SCALE := 0.9


# ── The city block. Same idea as the game's map format: fill rects, buildings, props. ──
func city_map() -> Dictionary:
	return {
		"name": "Main Street & 5th Avenue", "w": 40, "h": 28, "base": "road",
		"fill": [
			["walk", 0, 9, 18, 3], ["walk", 22, 9, 18, 3],      # north sidewalk: shopfront zone, walking lane, trees
			["road", 0, 12, 40, 4], ["road", 18, 0, 4, 28],     # Main Street and 5th Avenue
			["walk", 0, 16, 18, 2], ["walk", 22, 16, 18, 2],
			["walk", 17, 0, 1, 9], ["walk", 22, 0, 1, 9], ["walk", 17, 18, 1, 10], ["walk", 22, 18, 2, 10],
			["park", 0, 18, 17, 10], ["garden", 32, 18, 8, 10], ["plaza", 24, 18, 8, 10],
		],
		"buildings": [
			{"id": "bakery", "x": 0, "y": 2, "w": 4, "h": 7, "door": 1, "sign": "Bakery", "style": "bakery"},
			{"id": "cafe", "x": 4, "y": 2, "w": 6, "h": 7, "door": 7, "to": "cafe", "sign": "Rosa's Café", "style": "cafe"},
			{"id": "quickbean", "x": 10, "y": 2, "w": 4, "h": 7, "door": 12, "sign": "Quick Bean", "style": "quickbean"},
			{"id": "house", "x": 14, "y": 2, "w": 3, "h": 7, "door": 15, "sign": "Home", "style": "rowhouse"},
			{"id": "warehouse", "x": 23, "y": 2, "w": 8, "h": 7, "door": 24, "to": "warehouse", "sign": "Lin's Wholesale", "style": "warehouse"},
			{"id": "office", "x": 31, "y": 2, "w": 5, "h": 7, "door": 33, "sign": "Prairie Tower", "style": "office"},
			{"id": "apartments", "x": 36, "y": 2, "w": 4, "h": 7, "door": 37, "style": "apartments"},
			{"id": "grocery", "x": 24, "y": 18, "w": 4, "h": 4, "door": 20, "face": "w", "sign": "Grocery", "style": "grocery"},
			{"id": "library", "x": 24, "y": 22, "w": 7, "h": 6, "door": 25, "face": "w", "sign": "Library", "style": "library"},
		],
		"props": [],   # street furniture is laid out in _street_furniture() with a steady rhythm
	}


func _ready() -> void:
	close = "cam=close" in OS.get_cmdline_user_args()
	font = load("res://fonts/atkinson.woff2")
	m = city_map()
	mat = StandardMaterial3D.new()
	mat.vertex_color_use_as_albedo = true
	mat.vertex_color_is_srgb = true
	mat.roughness = 1.0
	mat.metallic_specular = 0.0
	gmat = StandardMaterial3D.new()
	gmat.vertex_color_use_as_albedo = true
	gmat.vertex_color_is_srgb = true
	gmat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	wmat = StandardMaterial3D.new()
	wmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	wmat.albedo_color = Color(0.78, 0.9, 0.93, 0.55)
	wmat.vertex_color_use_as_albedo = true
	wmat.vertex_color_is_srgb = true
	wmat.roughness = 0.4
	lmat = gmat.duplicate()
	st_main = SurfaceTool.new()
	st_main.begin(Mesh.PRIMITIVE_TRIANGLES)
	st_glow = SurfaceTool.new()
	st_glow.begin(Mesh.PRIMITIVE_TRIANGLES)
	st = st_main
	_ground()
	_background()
	for b in m.buildings:
		_building(b)
	_street_furniture()
	_park()
	_garden()
	_patio()
	_traffic()
	_commit_sections()
	_set_signals()
	_people()
	_name_tags()
	_goal(Vector3(24.5, 2.4, 10.0))
	_light_and_camera()
	_hud()
	print("TRIANGLES: ", tris)


func _commit(s: SurfaceTool, mt: Material, shadows: bool) -> void:
	var mesh := s.commit()
	if mesh.get_surface_count() == 0:
		return
	tris += mesh.surface_get_array_len(0) / 3
	var mi := MeshInstance3D.new()
	mi.mesh = mesh
	mi.material_override = mt
	if not shadows:
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(mi)


# ── Flat-shaded triangle helpers (all go through xf, so a building can be built facing +z and turned) ──
func tri(a: Vector3, b: Vector3, c: Vector3, col: Color, out := Vector3.ZERO) -> void:
	a = xf * a; b = xf * b; c = xf * c
	out = xf.basis * out
	var n := (b - a).cross(c - a)
	if n.length_squared() < 1e-12:
		return
	n = n.normalized()
	if out != Vector3.ZERO and n.dot(out) < 0.0:
		var t := b
		b = c
		c = t
		n = -n
	if st == st_main or st == st_glow:   # the still town: file it under its section
		_file_tri(a, b, c, col, n, st == st_glow, 0)
		return
	st.set_color(col)
	st.set_normal(n)
	st.add_vertex(a)
	st.add_vertex(c)
	st.add_vertex(b)


## A triangle wider than a section (a long road) is cut into four, again and again, so every piece lands
## in the section it is really in. Same colour and slope, so it looks the same.
func _file_tri(a: Vector3, b: Vector3, c: Vector3, col: Color, n: Vector3, glow: bool, depth: int) -> void:
	var lo := Vector2(minf(a.x, minf(b.x, c.x)), minf(a.z, minf(b.z, c.z)))
	var hi := Vector2(maxf(a.x, maxf(b.x, c.x)), maxf(a.z, maxf(b.z, c.z)))
	if (hi.x - lo.x > SECTION * 0.5 or hi.y - lo.y > SECTION * 0.5) and depth < 8:
		var ab := (a + b) / 2.0; var bc := (b + c) / 2.0; var ca := (c + a) / 2.0
		_file_tri(a, ab, ca, col, n, glow, depth + 1)
		_file_tri(ab, b, bc, col, n, glow, depth + 1)
		_file_tri(ca, bc, c, col, n, glow, depth + 1)
		_file_tri(ab, bc, ca, col, n, glow, depth + 1)
		return
	var to := _section_st((a + b + c) / 3.0, glow)
	to.set_color(col)
	to.set_normal(n)
	to.add_vertex(a)
	to.add_vertex(c)
	to.add_vertex(b)


# ── Sections: the still town is cut into SECTION × SECTION-tile squares, one mesh each, so only the squares
# the camera can see are drawn. Moving pieces (trees, swings, people, cars) are checked one by one. ──
const SECTION := 8.0
const SHADOWS := false          # real-time shadows cost the most on a Chromebook; off
var sections := {}              # Vector2i → [main SurfaceTool, glow SurfaceTool]
var section_nodes := {}         # Vector2i → [MeshInstance3D]
var cull_t := 0.0
var cull_tight := false         # V: draw only the sections right round you, to see the sections at work
var cull_label: Label

func _section_st(at: Vector3, glow: bool) -> SurfaceTool:
	var k := Vector2i(int(floor(at.x / SECTION)), int(floor(at.z / SECTION)))
	if not sections.has(k):
		var a := SurfaceTool.new(); a.begin(Mesh.PRIMITIVE_TRIANGLES)
		var g := SurfaceTool.new(); g.begin(Mesh.PRIMITIVE_TRIANGLES)
		sections[k] = [a, g]
	return sections[k][1 if glow else 0]


func _commit_sections() -> void:
	for k in sections:
		var list := []
		for pair in [[sections[k][0], mat], [sections[k][1], gmat]]:
			var arr: Array = pair[0].commit_to_arrays()
			if arr[Mesh.ARRAY_VERTEX] == null or (arr[Mesh.ARRAY_VERTEX] as PackedVector3Array).is_empty():
				continue
			var mesh := ArrayMesh.new()
			mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arr)
			tris += (arr[Mesh.ARRAY_VERTEX] as PackedVector3Array).size() / 3
			var mi := MeshInstance3D.new()
			mi.mesh = mesh
			mi.material_override = pair[1]
			mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
			mi.name = "section_%d_%d" % [k.x, k.y]
			add_child(mi)
			list.append(mi)
		section_nodes[k] = list
	sections.clear()


## The part of the ground the camera sees (plus a margin, since tall things south of it still reach up into view).
func _view_ground() -> Rect2:
	var cam := get_viewport().get_camera_3d()
	if cam == null:
		return Rect2(-1000, -1000, 2000, 2000)
	var size := get_viewport().get_visible_rect().size
	var lo := Vector2(INF, INF); var hi := -lo
	for c in [Vector2.ZERO, Vector2(size.x, 0), Vector2(0, size.y), size]:
		var o := cam.project_ray_origin(c)
		var d := cam.project_ray_normal(c)
		var t := 200.0 if d.y > -0.05 else -o.y / d.y   # rays above the horizon: far away
		var g := o + d * minf(t, 200.0)
		lo = lo.min(Vector2(g.x, g.z)); hi = hi.max(Vector2(g.x, g.z))
	return Rect2(lo, hi - lo).grow_individual(3.0, 3.0, 3.0, 8.0)


## Show only the sections and pieces in view. Hidden pieces skip their animation too.
func _cull() -> void:
	var r := _view_ground()
	if cull_tight:
		var c := r.get_center()
		var me = player_pos()
		if me != null:
			c = Vector2(me.x, me.z)
		r = Rect2(c - Vector2(SECTION, SECTION) * 0.75, Vector2(SECTION, SECTION) * 1.5)
	var on := 0
	for k in section_nodes:
		var vis := r.intersects(Rect2(Vector2(k) * SECTION, Vector2(SECTION, SECTION)))
		for mi in section_nodes[k]:
			mi.visible = vis
		if vis:
			on += 1
	var pieces := 0; var pieces_on := 0
	for c in get_children():
		if c is GeometryInstance3D and not c.name.begins_with("section_"):   # meshes, signs, name tags
			pieces += 1
			c.visible = r.has_point(Vector2(c.position.x, c.position.z))
			if c.visible:
				pieces_on += 1
	if cull_label:
		cull_label.text = "Sections %d / %d  ·  Pieces %d / %d  ·  %d fps" % [
			on, section_nodes.size(), pieces_on, pieces, Engine.get_frames_per_second()]


func quad(a: Vector3, b: Vector3, c: Vector3, d: Vector3, col: Color, out := Vector3.ZERO) -> void:
	tri(a, b, c, col, out)
	tri(a, c, d, col, out)


func box(p: Vector3, s: Vector3, col: Color, top := Color(0, 0, 0, 0)) -> void:
	var x0 := p.x; var x1 := p.x + s.x; var y0 := p.y; var y1 := p.y + s.y; var z0 := p.z; var z1 := p.z + s.z
	var tc := col if top.a == 0.0 else top
	quad(Vector3(x0, y1, z0), Vector3(x1, y1, z0), Vector3(x1, y1, z1), Vector3(x0, y1, z1), tc, Vector3.UP)
	quad(Vector3(x0, y0, z1), Vector3(x1, y0, z1), Vector3(x1, y1, z1), Vector3(x0, y1, z1), col, Vector3.BACK)
	quad(Vector3(x0, y0, z0), Vector3(x1, y0, z0), Vector3(x1, y1, z0), Vector3(x0, y1, z0), col, Vector3.FORWARD)
	quad(Vector3(x1, y0, z0), Vector3(x1, y0, z1), Vector3(x1, y1, z1), Vector3(x1, y1, z0), col, Vector3.RIGHT)
	quad(Vector3(x0, y0, z0), Vector3(x0, y0, z1), Vector3(x0, y1, z1), Vector3(x0, y1, z0), col, Vector3.LEFT)


## Flat quad on the ground (y up).
func flat(x0: float, z0: float, x1: float, z1: float, y: float, col: Color) -> void:
	quad(Vector3(x0, y, z0), Vector3(x1, y, z0), Vector3(x1, y, z1), Vector3(x0, y, z1), col, Vector3.UP)


## A jittered low-poly blob (bush, tree crown). seg around, rings up.
func blob(c: Vector3, r: Vector3, col: Color, seed_: int, seg := 7, rings := 4, jit := 0.18) -> void:
	seg = maxi(seg, roundi(seg * detail)); rings = maxi(rings, roundi(rings * detail)); jit /= detail   # more faces, gentler bumps
	var pts := []
	for i in rings + 1:
		var row := []
		var v := PI * i / rings
		for j in seg:
			var u := TAU * (j + 0.5 * (i % 2)) / seg
			var k := 1.0 + jit * (_h(seed_, i * 31 + j) - 0.5) * 2.0
			if i == 0 or i == rings:
				k = 1.0
			row.append(c + Vector3(cos(u) * sin(v) * r.x * k, cos(v) * r.y, sin(u) * sin(v) * r.z * k))
		pts.append(row)
	for i in rings:
		for j in seg:
			var j2 := (j + 1) % seg
			var a: Vector3 = pts[i][j]; var b: Vector3 = pts[i][j2]; var d: Vector3 = pts[i + 1][j]; var e: Vector3 = pts[i + 1][j2]
			var mid := (a + b + d + e) / 4.0
			var shade := 0.05 * (_h(seed_, 900 + i * 13 + j) - 0.5)
			var cc := col.lightened(shade) if shade > 0 else col.darkened(-shade)
			tri(a, b, d, cc, mid - c)
			tri(b, e, d, cc, mid - c)


func cone(base: Vector3, r: float, h: float, col: Color, seg := 7, bottom := true) -> void:
	if seg > 4: seg = roundi(seg * detail)   # 4-sided cones are roofs: keep them square
	var top := base + Vector3(0, h, 0)
	for j in seg:
		var a := base + Vector3(cos(TAU * j / seg) * r, 0, sin(TAU * j / seg) * r)
		var b := base + Vector3(cos(TAU * (j + 1) / seg) * r, 0, sin(TAU * (j + 1) / seg) * r)
		tri(a, b, top, col, (a + b) / 2.0 - base + Vector3(0, r * 0.3, 0))
		if bottom:
			tri(a, b, base, col.darkened(0.25), Vector3.DOWN)


func cyl(base: Vector3, r: float, h: float, col: Color, seg := 6, r_top := -1.0, top := true) -> void:
	seg = roundi(seg * detail)
	var rt := r if r_top < 0 else r_top
	for j in seg:
		var u0 := TAU * j / seg; var u1 := TAU * (j + 1) / seg
		var a := base + Vector3(cos(u0) * r, 0, sin(u0) * r); var b := base + Vector3(cos(u1) * r, 0, sin(u1) * r)
		var c := base + Vector3(cos(u1) * rt, h, sin(u1) * rt); var d := base + Vector3(cos(u0) * rt, h, sin(u0) * rt)
		quad(a, b, c, d, col, (a + b) / 2.0 - base)
		if top:
			tri(d, c, base + Vector3(0, h, 0), col.lightened(0.05), Vector3.UP)


## Flat disc / ring on the ground.
func disc(c: Vector3, r: float, col: Color, seg := 12, r_in := 0.0) -> void:
	seg = roundi(seg * detail)
	for j in seg:
		var u0 := TAU * j / seg; var u1 := TAU * (j + 1) / seg
		var a := c + Vector3(cos(u0) * r, 0, sin(u0) * r); var b := c + Vector3(cos(u1) * r, 0, sin(u1) * r)
		if r_in <= 0.0:
			tri(c, a, b, col, Vector3.UP)
		else:
			quad(a, b, c + Vector3(cos(u1) * r_in, 0, sin(u1) * r_in), c + Vector3(cos(u0) * r_in, 0, sin(u0) * r_in), col, Vector3.UP)


## A flat strip along a polyline (paths).
func strip(pts: Array, w: float, y: float, col: Color) -> void:
	for i in pts.size() - 1:
		var a: Vector3 = pts[i]; var b: Vector3 = pts[i + 1]
		var side := (b - a).cross(Vector3.UP).normalized() * w * 0.5
		quad(Vector3(a.x, y, a.z) - side, Vector3(b.x, y, b.z) - side, Vector3(b.x, y, b.z) + side, Vector3(a.x, y, a.z) + side, col, Vector3.UP)
		disc(Vector3(b.x, y, b.z), w * 0.5, col, 8)


func _h(a: int, b: int) -> float:
	return float(("%d:%d" % [a, b]).hash() & 0xffff) / 65535.0


func glow_on() -> void:
	if _part_keep.is_empty(): st = st_glow


func glow_off() -> void:
	if _part_keep.is_empty(): st = st_main


## A separate piece that can move: build it around (0, 0, 0), then part_end() places it.
func part_begin() -> void:
	_part_keep.append([st, xf])
	st = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	xf = Transform3D.IDENTITY


func part_end(at: Vector3, m: Material = null, shadows := true) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	mi.mesh = st.commit()
	if mi.mesh and mi.mesh.get_surface_count() > 0:
		tris += mi.mesh.surface_get_array_len(0) / 3
	mi.material_override = m if m else mat
	if not shadows:
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	mi.position = at
	add_child(mi)
	var k: Array = _part_keep.pop_back()
	st = k[0]
	xf = k[1]
	return mi


func solid(x: float, z: float, w: float, d: float) -> void:
	solids.append(Rect2(x, z, w, d))


func solid_post(x: float, z: float, r: float) -> void:
	solid_posts.append(Vector3(x, z, r))


# ── Ground: asphalt everywhere, raised sidewalks with curbs and paving joints, markings ──
func _ground() -> void:
	flat(-30, -30, 70, 60, 0.0, C.road)
	for f in m.fill:
		var fx := float(f[1]); var fz := float(f[2]); var fw := float(f[3]); var fh := float(f[4])
		match f[0]:
			"walk":
				_walk(fx, fz, fw, fh)
			"park":
				box(Vector3(fx, 0, fz), Vector3(fw, 0.14, fh), C.curb, C.walk)
				box(Vector3(fx + 0.35, 0.14, fz + 0.35), Vector3(fw - 0.7, 0.03, fh - 0.7), C.grass_dk, C.grass)
			"garden":
				box(Vector3(fx, 0, fz), Vector3(fw, 0.14, fh), C.curb, C.walk)
			"plaza":
				box(Vector3(fx, 0, fz), Vector3(fw, 0.14, fh), C.curb, C.walk.lightened(0.03))
	# Sidewalks run on past the map edges, with more of the city beyond.
	for side in [[-30.0, 0.0], [40.0, 70.0]]:
		_walk(side[0], 9, side[1] - side[0], 3)
		_walk(side[0], 16, side[1] - side[0], 2)
	_walk(17, -30, 1, 30); _walk(22, -30, 1, 30); _walk(17, 28, 1, 30); _walk(22, 28, 2, 30)
	# Lane markings: dashed centre line, bike lane on the south side, stop bars, crosswalks.
	for x in range(-30, 70, 2):
		if x >= 17 and x < 22: continue
		flat(x + 0.2, 13.96, x + 1.2, 14.04, 0.01, C.line)
	for x in range(-30, 70):
		if x >= 18 and x < 22: continue
		flat(x, 15.08, x + 1, 15.14, 0.01, C.line)
		flat(x, 15.14, x + 1, 15.95, 0.008, C.bike)
	for z in range(-30, 58, 2):
		if z >= 9 and z < 18: continue
		flat(19.96, z + 0.2, 20.04, z + 1.2, 0.01, C.line)
	for i in 7:   # crosswalks: across Main St (west and east legs) and across 5th Ave (north and south legs)
		var o := 12.2 + i * 0.55
		flat(16.1, o, 17.9, o + 0.32, 0.01, C.line)
		flat(22.1, o, 23.9, o + 0.32, 0.01, C.line)
		var p := 18.2 + i * 0.55
		flat(p, 9.8, p + 0.32, 11.8, 0.01, C.line)
		flat(p, 16.2, p + 0.32, 17.8, 0.01, C.line)
	flat(15.8, 12.1, 15.95, 13.95, 0.01, C.line)   # stop bars
	flat(24.05, 14.05, 24.2, 15.9, 0.01, C.line)


func _roof_bits(x0: float, z0: float, w: float, d: float, y: float, k: int) -> void:
	box(Vector3(x0 + w * 0.15, y, z0 + d * 0.55), Vector3(0.55, 0.25, 0.55), Color("#9aa0a4"))   # roof hatch
	cyl(Vector3(x0 + w * 0.75, y, z0 + d * 0.3), 0.08, 0.45, C.metal_lt, 5)   # vent pipe
	box(Vector3(x0 + w * 0.5, y, z0 + d * 0.15), Vector3(w * 0.35, 0.12, d * 0.2), Color("#a9b6bd"), C.glass_hi)   # skylight


func _walk(fx: float, fz: float, fw: float, fh: float) -> void:
	box(Vector3(fx, 0, fz), Vector3(fw, 0.14, fh), C.curb, C.walk)
	for x in range(int(ceil(fx)), int(fx + fw)):
		flat(x - 0.015, fz + 0.02, x + 0.015, fz + fh - 0.02, 0.142, C.walk_jt)
	if fh > 2.5:
		for z in range(int(ceil(fz)) + 1, int(fz + fh)):
			flat(fx + 0.02, z - 0.015, fx + fw - 0.02, z + 0.015, 0.142, C.walk_jt)


# ── The city beyond the map: hazy blocks with window bands, taller behind ──
func _background() -> void:
	var blocks := []
	for i in 14:   # north, behind the alley
		blocks.append([-26.0 + i * 5.6, -14.0 + _h(i, 1) * 3.0, 5.0, 9.0, 5.0 + _h(i, 2) * 13.0])
	for i in 5:    # west and east of the map, both sides of Main St
		blocks.append([-27.0 + i * 5.2, 1.0, 4.6, 7.5, 3.0 + _h(i, 5) * 6.0])
		blocks.append([41.0 + i * 5.4, 1.0, 4.8, 7.5, 4.0 + _h(i, 6) * 8.0])
		blocks.append([-27.0 + i * 5.2, 19.0, 4.6, 7.0, 2.5 + _h(i, 7) * 3.0])
		blocks.append([41.0 + i * 5.4, 19.0, 4.8, 7.0, 3.0 + _h(i, 8) * 4.0])
	for i in 9:   # south of the park and the library
		blocks.append([-20.0 + i * 6.5, 31.0 + _h(i, 9) * 2.0, 5.2, 7.0, 2.0 + _h(i, 10) * 3.0])
	var cols := [Color("#b9a99a"), Color("#a7adb3"), Color("#c3b49c"), Color("#9eaab0"), Color("#b59a8a"), Color("#c8c0b2")]
	blocks = blocks.filter(func(b): return not (b[0] < 22.5 and b[0] + b[2] > 17.5))   # 5th Ave runs on into the haze
	for i in blocks.size():
		var b: Array = blocks[i]
		var col: Color = cols[i % cols.size()]
		var bx: float = b[0]; var bz: float = b[1]; var bw: float = b[2]; var bd: float = b[3]; var bh: float = b[4]
		box(Vector3(bx, 0, bz), Vector3(bw, bh, bd), col, col.lightened(0.08))
		box(Vector3(bx - 0.06, bh - 0.25, bz - 0.06), Vector3(bw + 0.12, 0.25, bd + 0.12), col.darkened(0.12))
		var band := col.darkened(0.32)
		var y := 1.0
		while y < bh - 0.8:
			quad(Vector3(bx + 0.3, y, bz + bd + 0.01), Vector3(bx + bw - 0.3, y, bz + bd + 0.01), Vector3(bx + bw - 0.3, y + 0.5, bz + bd + 0.01), Vector3(bx + 0.3, y + 0.5, bz + bd + 0.01), band, Vector3.BACK)
			quad(Vector3(bx - 0.01, y, bz + 0.3), Vector3(bx - 0.01, y, bz + bd - 0.3), Vector3(bx - 0.01, y + 0.5, bz + bd - 0.3), Vector3(bx - 0.01, y + 0.5, bz + 0.3), band, Vector3.LEFT)
			y += 1.3
		if bh > 10.0:
			box(Vector3(bx + 1.0, bh, bz + 2.0), Vector3(1.6, 0.9, 2.0), col.darkened(0.08))


# ── Buildings: each built facing +z in its own frame, then turned into place ──
func _building(b: Dictionary) -> void:
	var W: float; var D: float
	if b.get("face", "s") == "w":
		W = float(b.h); D = float(b.w)
		xf = Transform3D(Basis(Vector3.UP, -PI / 2.0), Vector3(float(b.x + b.w), 0, float(b.y)))
	else:
		W = float(b.w); D = float(b.h)
		xf = Transform3D(Basis.IDENTITY, Vector3(float(b.x), 0, float(b.y)))
	var door := float(b.get("door", 0)) - (float(b.y) if b.get("face", "s") == "w" else float(b.x))
	call("_b_" + str(b.style), W, D, door + 0.5, b)
	xf = Transform3D.IDENTITY


## Shell: plinth, walls, cornice and parapet.
func _shell(W: float, D: float, H: float, wall: Color, trim: Color, roof: Color) -> void:
	box(Vector3(0, 0, 0), Vector3(W, 0.3, D), wall.darkened(0.25))
	box(Vector3(0.04, 0.3, 0.04), Vector3(W - 0.08, H - 0.3, D - 0.08), wall)
	box(Vector3(-0.06, H - 0.22, -0.06), Vector3(W + 0.12, 0.22, D + 0.12), trim)
	box(Vector3(0.15, H - 0.02, 0.15), Vector3(W - 0.3, 0.03, D - 0.3), roof)
	box(Vector3(-0.06, H, -0.06), Vector3(W + 0.12, 0.2, 0.14), trim.darkened(0.06))
	box(Vector3(-0.06, H, D - 0.08), Vector3(W + 0.12, 0.2, 0.14), trim.darkened(0.06))
	box(Vector3(-0.06, H, 0.08), Vector3(0.14, 0.2, D - 0.16), trim.darkened(0.06))
	box(Vector3(W - 0.08, H, 0.08), Vector3(0.14, 0.2, D - 0.16), trim.darkened(0.06))


## A window on the front face (z = zf), centred at cx; frame, glass with a soft reflection, sill.
func win(cx: float, y: float, w: float, h: float, zf: float, frame: Color, glass := C.glass, sill := true) -> void:
	quad(Vector3(cx - w / 2 - 0.06, y - 0.06, zf + 0.01), Vector3(cx + w / 2 + 0.06, y - 0.06, zf + 0.01), Vector3(cx + w / 2 + 0.06, y + h + 0.06, zf + 0.01), Vector3(cx - w / 2 - 0.06, y + h + 0.06, zf + 0.01), frame, Vector3.BACK)
	quad(Vector3(cx - w / 2, y, zf + 0.02), Vector3(cx + w / 2, y, zf + 0.02), Vector3(cx + w / 2, y + h, zf + 0.02), Vector3(cx - w / 2, y + h, zf + 0.02), glass, Vector3.BACK)
	tri(Vector3(cx - w / 2, y + h * 0.45, zf + 0.025), Vector3(cx - w / 2, y + h, zf + 0.025), Vector3(cx - w / 2 + w * 0.45, y + h, zf + 0.025), glass.lerp(C.glass_hi, 0.6), Vector3.BACK)
	if sill:
		box(Vector3(cx - w / 2 - 0.09, y - 0.1, zf), Vector3(w + 0.18, 0.06, 0.09), frame.darkened(0.08))


## A window on the left side face (x = xs).
func win_side(cz: float, y: float, w: float, h: float, xs: float, frame: Color, glass := C.glass) -> void:
	quad(Vector3(xs - 0.01, y - 0.06, cz - w / 2 - 0.06), Vector3(xs - 0.01, y - 0.06, cz + w / 2 + 0.06), Vector3(xs - 0.01, y + h + 0.06, cz + w / 2 + 0.06), Vector3(xs - 0.01, y + h + 0.06, cz - w / 2 - 0.06), frame, Vector3.LEFT)
	quad(Vector3(xs - 0.02, y, cz - w / 2), Vector3(xs - 0.02, y, cz + w / 2), Vector3(xs - 0.02, y + h, cz + w / 2), Vector3(xs - 0.02, y + h, cz - w / 2), glass, Vector3.LEFT)


func door_at(cx: float, zf: float, col: Color, w := 0.62, h := 1.25, frame := C.frame) -> void:
	box(Vector3(cx - w / 2 - 0.07, 0.3, zf - 0.02), Vector3(w + 0.14, h + 0.08, 0.06), frame)
	box(Vector3(cx - w / 2, 0.3, zf), Vector3(w, h, 0.07), col)
	quad(Vector3(cx - w / 2 + 0.1, 0.3 + h * 0.5, zf + 0.075), Vector3(cx + w / 2 - 0.1, 0.3 + h * 0.5, zf + 0.075), Vector3(cx + w / 2 - 0.1, 0.3 + h - 0.1, zf + 0.075), Vector3(cx - w / 2 + 0.1, 0.3 + h - 0.1, zf + 0.075), C.glass, Vector3.BACK)
	box(Vector3(cx + w / 2 - 0.13, 0.3 + h * 0.45, zf + 0.07), Vector3(0.05, 0.05, 0.05), Color("#d9b860"))


## Striped awning across [x0, x1] on the front, at height y, reaching out by depth.
func awning(x0: float, x1: float, y: float, zf: float, col: Color, depth := 0.7, stripes := true) -> void:
	var n := int((x1 - x0) / 0.33)
	for i in n:
		var c := col if (i % 2 == 0 or not stripes) else Color("#efe6d4")
		var ax := x0 + (x1 - x0) * i / n; var bx := x0 + (x1 - x0) * (i + 1) / n
		quad(Vector3(ax, y, zf), Vector3(bx, y, zf), Vector3(bx, y - 0.32, zf + depth), Vector3(ax, y - 0.32, zf + depth), c, Vector3(0, 1, 1))
		quad(Vector3(ax, y - 0.32, zf + depth), Vector3(bx, y - 0.32, zf + depth), Vector3(bx, y - 0.48, zf + depth), Vector3(ax, y - 0.48, zf + depth), c.darkened(0.1), Vector3.BACK)
	tri(Vector3(x0, y, zf), Vector3(x0, y - 0.32, zf + depth), Vector3(x0, y - 0.48, zf + depth), col.darkened(0.15), Vector3.LEFT)


## Sign board with text, flat on the facade.
func sign_board(cx: float, y: float, w: float, h: float, zf: float, bg: Color, text: String, fg := Color("#f5ecd8"), fs := 64) -> void:
	box(Vector3(cx - w / 2, y, zf), Vector3(w, h, 0.07), bg)
	box(Vector3(cx - w / 2 - 0.03, y - 0.03, zf - 0.01), Vector3(w + 0.06, h + 0.06, 0.06), bg.darkened(0.3))
	var l := Label3D.new()
	l.text = text
	l.font = font
	l.font_size = fs
	l.pixel_size = 0.0042
	l.modulate = fg
	l.outline_size = 0
	l.shaded = false
	l.double_sided = false
	l.transform = xf * Transform3D(Basis.IDENTITY, Vector3(cx, y + h / 2, zf + 0.08))
	add_child(l)


## Rooftop bits.
func ac_unit(p: Vector3) -> void:
	box(p, Vector3(0.7, 0.45, 0.55), C.metal_lt, C.metal_lt.lightened(0.1))
	cyl(p + Vector3(0.35, 0.45, 0.28), 0.18, 0.02, C.metal, 8)


# ── Building styles ──
func _b_bakery(W: float, D: float, door: float, b: Dictionary) -> void:
	var wall := Color("#e6cdbd"); var trim := Color("#f3ead9"); var H := 4.4
	_shell(W, D, H, wall, trim, Color("#9b8f86"))
	box(Vector3(0.04, 0.3, D - 0.06), Vector3(W - 0.08, 1.6, 0.04), Color("#8e5f58"))   # painted shopfront
	win(2.6, 0.55, 1.9, 1.05, D - 0.02, Color("#f3ead9"))
	door_at(door, D - 0.02, Color("#8e5f58"))
	awning(0.15, W - 0.15, 2.15, D, Color("#c38f8a"), 0.6)
	sign_board(W / 2, 2.3, 2.2, 0.42, D, Color("#f3ead9"), "Bakery", Color("#7a4a44"), 60)
	for f in 2:
		for i in 2:
			var cx := 1.0 + i * 2.0
			win(cx, 2.95 + f * 0.0, 0.8, 0.95, D, trim)
	# flower boxes on the upper windows
	for i in 2:
		box(Vector3(0.55 + i * 2.0, 2.78, D), Vector3(0.9, 0.16, 0.18), C.wood_dk)
		for j in 3:
			blob(Vector3(0.7 + i * 2.0 + j * 0.3, 2.98, D + 0.09), Vector3(0.12, 0.1, 0.1), [Color("#d98a8a"), C.leaf2, Color("#e8c86a")][j], j + i * 3, 5, 2, 0.1)
	for i in 2:   # side windows (the bakery is on the corner of the block)
		win_side(2.0 + i * 2.5, 2.9, 0.9, 0.95, 0.04, trim)
		win_side(2.0 + i * 2.5, 0.8, 0.9, 1.0, 0.04, trim)
	# rooftop: chimney and a small garden
	box(Vector3(0.5, H, 1.0), Vector3(0.5, 0.8, 0.5), Color("#a5685a"))
	for i in 3:
		box(Vector3(1.4 + i * 0.8, H, 3.0), Vector3(0.6, 0.3, 1.2), C.wood)
		blob(Vector3(1.7 + i * 0.8, H + 0.38, 3.6), Vector3(0.28, 0.18, 0.5), C.leaf2, i + 40, 6, 2, 0.2)


func _b_cafe(W: float, D: float, door: float, b: Dictionary) -> void:
	var wall := Color("#b8725c"); var trim := Color("#efe3cf"); var H := 3.6
	_shell(W, D, H, wall, trim, Color("#8f857c"))
	# brick courses
	for y in [0.75, 1.2, 2.6, 3.0]:
		quad(Vector3(0.04, y, D - 0.035), Vector3(W - 0.04, y, D - 0.035), Vector3(W - 0.04, y + 0.03, D - 0.035), Vector3(0.04, y + 0.03, D - 0.035), wall.darkened(0.1), Vector3.BACK)
	var wood := Color("#3f4f44")
	box(Vector3(0.04, 0.3, D - 0.04), Vector3(W - 0.08, 1.75, 0.03), wood)   # shopfront panel, dark green
	for cx in [1.35, 4.65]:
		win(cx, 0.6, 1.9, 1.25, D - 0.01, Color("#d8c9a6"), Color("#6b5a49"), false)   # warm interior glass
	door_at(door, D - 0.01, Color("#2f3b33"), 0.7, 1.4, Color("#d8c9a6"))
	awning(0.12, W - 0.12, 2.45, D, Color("#b25c47"), 0.45)
	sign_board(W / 2, 2.55, 3.2, 0.5, D, Color("#33433a"), "Rosa's Café", Color("#f3e3c0"), 72)
	for i in 3:   # upper floor windows with shutters
		var cx := 1.0 + i * 2.0
		win(cx, 2.68, 0.7, 0.62, D, trim)
	# lanterns either side of the door
	glow_on()
	box(Vector3(door - 0.62, 1.4, D + 0.06), Vector3(0.12, 0.16, 0.1), Color("#ffd99a"))
	box(Vector3(door + 0.5, 1.4, D + 0.06), Vector3(0.12, 0.16, 0.1), Color("#ffd99a"))
	glow_off()
	ac_unit(Vector3(1.0, H, 1.5)); ac_unit(Vector3(3.4, H, 2.0))
	_roof_bits(0.0, 0.0, W, D, H, 1)
	box(Vector3(4.6, H, 0.8), Vector3(0.5, 0.9, 0.5), Color("#9d5f4d"))


func _b_quickbean(W: float, D: float, door: float, b: Dictionary) -> void:
	var wall := Color("#8a9cad"); var trim := Color("#e9edf0"); var H := 3.2
	_shell(W, D, H, wall, trim, Color("#7a8189"))
	# full-height glass storefront with thin mullions
	quad(Vector3(0.2, 0.3, D + 0.01), Vector3(W - 0.2, 0.3, D + 0.01), Vector3(W - 0.2, 2.15, D + 0.01), Vector3(0.2, 2.15, D + 0.01), C.glass.lightened(0.05), Vector3.BACK)
	for i in 5:
		box(Vector3(0.18 + i * (W - 0.4) / 4.0, 0.3, D), Vector3(0.05, 1.85, 0.05), trim)
	box(Vector3(0.18, 1.6, D), Vector3(W - 0.36, 0.04, 0.05), trim)
	tri(Vector3(0.3, 1.2, D + 0.02), Vector3(0.3, 2.1, D + 0.02), Vector3(1.4, 2.1, D + 0.02), C.glass_hi, Vector3.BACK)
	door_at(door, D + 0.01, Color("#2f3e5c"), 0.62, 1.3, trim)
	# flat blue canopy and sign band
	box(Vector3(0.0, 2.2, D - 0.02), Vector3(W, 0.12, 0.75), Color("#4f7ba3"), Color("#5a87ae"))
	sign_board(W / 2, 2.45, 2.7, 0.48, D, Color("#4f7ba3"), "Quick Bean", Color("#f4f6f8"), 68)
	ac_unit(Vector3(0.8, H, 2.0)); ac_unit(Vector3(2.2, H, 3.5))
	box(Vector3(0.5, H, 4.6), Vector3(2.8, 0.06, 1.6), Color("#6f7a84"), Color("#5b6b78"))   # solar panels
	for i in 4:
		box(Vector3(0.6 + i * 0.7, H + 0.06, 4.7), Vector3(0.6, 0.12, 1.4), Color("#3f5870"), Color("#4d6a86"))


func _b_rowhouse(W: float, D: float, door: float, b: Dictionary) -> void:
	var wall := Color("#a3b294"); var trim := Color("#f2ede2"); var H := 4.6
	_shell(W, D, H, wall, trim, Color("#7f8a80"))
	# stoop: three steps up to the door, with a little railing
	for i in 3:
		box(Vector3(door - 0.55, 0.0, D + 0.75 - i * 0.25), Vector3(1.1, 0.12 + i * 0.1, 0.25), C.stone.darkened(0.05 * i))
	door_at(door, D, Color("#6c4a5e"), 0.62, 1.3, trim)
	box(Vector3(door - 0.4, 1.68, D), Vector3(0.8, 0.12, 0.06), trim)   # transom
	box(Vector3(door + 0.62, 0.0, D + 0.1), Vector3(0.3, 0.35, 0.5), C.wood_dk)
	blob(Vector3(door + 0.77, 0.5, D + 0.35), Vector3(0.2, 0.2, 0.2), C.leaf2, 7, 6, 3, 0.2)
	win(2.25, 0.75, 0.75, 1.0, D, trim)
	# bay window on the second floor
	box(Vector3(0.45, 2.0, D), Vector3(2.1, 1.3, 0.35), trim.darkened(0.04), trim)
	for i in 3:
		win(0.8 + i * 0.7, 2.2, 0.5, 0.9, D + 0.35, trim, C.glass, false)
	for i in 2:
		win(0.85 + i * 1.3, 3.55, 0.6, 0.75, D, trim)
	# small house number plaque
	box(Vector3(door - 0.15, 1.85, D), Vector3(0.3, 0.16, 0.04), Color("#2f3a33"))
	box(Vector3(0.6, H, 1.5), Vector3(0.45, 0.7, 0.45), Color("#9b8a7e"))
	_roof_bits(0.0, 0.0, W, D, H, 3)


func _b_warehouse(W: float, D: float, door: float, b: Dictionary) -> void:
	var H := 4.0
	var brick := Color("#9e6d58"); var tin := Color("#b8b2a6"); var trim := Color("#d9d3c7")
	box(Vector3(0, 0, 0), Vector3(W, 0.3, D), Color("#8c857a"))
	box(Vector3(0.04, 0.3, 0.04), Vector3(W - 0.08, 1.2, D - 0.08), brick)
	box(Vector3(0.06, 1.5, 0.06), Vector3(W - 0.12, H - 1.5, D - 0.12), tin)
	# corrugated ribs
	var x := 0.2
	while x < W - 0.1:
		quad(Vector3(x, 1.5, D - 0.055), Vector3(x + 0.07, 1.5, D - 0.055), Vector3(x + 0.07, H, D - 0.055), Vector3(x, H, D - 0.055), tin.darkened(0.08), Vector3.BACK)
		x += 0.28
	var z := 0.3
	while z < D - 0.1:
		quad(Vector3(0.055, 1.5, z), Vector3(0.055, 1.5, z + 0.07), Vector3(0.055, H, z + 0.07), Vector3(0.055, H, z), tin.darkened(0.08), Vector3.LEFT)
		z += 0.28
	box(Vector3(-0.04, 1.45, -0.04), Vector3(W + 0.08, 0.1, D + 0.08), trim)
	# sawtooth roof: three teeth, glazing facing north
	for i in 3:
		var x0 := W * i / 3.0; var x1 := W * (i + 1) / 3.0
		for j in 3:
			var z0 := 0.06 + (D - 0.12) * j / 3.0; var z1 := 0.06 + (D - 0.12) * (j + 1) / 3.0
			var top := H + 0.9
			quad(Vector3(x0 + 0.06, H, z1), Vector3(x1 - 0.06, H, z1), Vector3(x1 - 0.06, top, z0), Vector3(x0 + 0.06, top, z0), Color("#8d8f93") if j != 1 else Color("#868a8f"), Vector3(0, 1, 1))
			quad(Vector3(x0 + 0.06, H, z0), Vector3(x1 - 0.06, H, z0), Vector3(x1 - 0.06, top, z0), Vector3(x0 + 0.06, top, z0), C.glass, Vector3.FORWARD)
			tri(Vector3(x0 + 0.06, H, z0), Vector3(x0 + 0.06, H, z1), Vector3(x0 + 0.06, top, z0), tin.darkened(0.05), Vector3.LEFT)
			tri(Vector3(x1 - 0.06, H, z0), Vector3(x1 - 0.06, H, z1), Vector3(x1 - 0.06, top, z0), tin.darkened(0.05), Vector3.RIGHT)
	# high strip windows
	for i in 7:
		win(0.9 + i * 1.05, 2.6, 0.7, 0.55, D - 0.06, trim, C.glass, false)
	for i in 5:
		win_side(0.8 + i * 1.3, 2.6, 0.75, 0.55, 0.06, trim)
	# loading dock: raised concrete platform, two roll-up doors, bumpers
	box(Vector3(2.6, 0, D), Vector3(5.2, 0.55, 0.85), C.concrete, C.concrete.lightened(0.05))
	for k in 2:
		var dx := 3.0 + k * 2.5
		box(Vector3(dx - 0.1, 0.55, D - 0.05), Vector3(2.0, 1.75, 0.07), Color("#6f7378"))
		var y := 0.6
		while y < 2.25:
			box(Vector3(dx - 0.02, y, D), Vector3(1.84, 0.1, 0.05), Color("#c9ccc8") if k == 0 else Color("#a9b5ad"))
			y += 0.14
		box(Vector3(dx + 0.15, 0.1, D + 0.85), Vector3(0.22, 0.4, 0.1), Color("#2e2e30"))
		box(Vector3(dx + 1.45, 0.1, D + 0.85), Vector3(0.22, 0.4, 0.1), Color("#2e2e30"))
		box(Vector3(dx - 0.1, 0.55, D + 0.8), Vector3(2.0, 0.03, 0.05), Color("#d9b44a"))
	# pallets with boxes
	for k in 3:
		var px := 2.75 + k * 0.85 + (1.8 if k == 2 else 0.0)
		box(Vector3(px, 0.55, D + 0.12), Vector3(0.7, 0.1, 0.6), C.wood)
		box(Vector3(px + 0.05, 0.65, D + 0.17), Vector3(0.6, 0.32, 0.5), Color("#c8a77a"))
		if k != 1:
			box(Vector3(px + 0.1, 0.97, D + 0.22), Vector3(0.45, 0.28, 0.4), Color("#bf9c6e"))
	# office door and the big sign
	door_at(door, D - 0.06, Color("#3f5d70"), 0.62, 1.3, trim)
	box(Vector3(door - 0.55, 1.62, D - 0.06), Vector3(1.1, 0.06, 0.45), C.metal)
	sign_board(W / 2 + 0.4, 3.0, 4.6, 0.62, D - 0.06, Color("#2f4350"), "Lin's Wholesale", Color("#f2e6c8"), 84)


func _b_office(W: float, D: float, door: float, b: Dictionary) -> void:
	var H := 12.6; var fh := 1.3
	var frame := Color("#d3d8dc"); var glass := Color("#6f8ba2"); var span := Color("#a9b6c0")
	box(Vector3(0, 0, 0), Vector3(W, 0.3, D), Color("#8f969c"))
	box(Vector3(0.05, 0.3, 0.05), Vector3(W - 0.1, H - 0.3, D - 0.1), glass)
	var y := 2.0
	while y < H - 0.3:   # floor bands, front and side
		box(Vector3(0.0, y, D - 0.08), Vector3(W, 0.22, 0.1), span)
		box(Vector3(0.0, y, 0.05), Vector3(0.08, 0.22, D - 0.1), span)
		y += fh
	for i in 6:   # mullions
		box(Vector3(i * (W - 0.06) / 5.0, 0.3, D - 0.06), Vector3(0.06, H - 0.3, 0.08), frame)
	for i in 6:
		box(Vector3(0.0, 0.3, 0.05 + i * (D - 0.16) / 5.0), Vector3(0.06, H - 0.3, 0.06), frame)
	# soft diagonal sky reflections on the glass
	for k in 3:
		var y0 := 3.0 + k * 3.2
		tri(Vector3(0.1, y0, D - 0.03), Vector3(0.1, y0 + 2.2, D - 0.03), Vector3(2.2, y0 + 2.2, D - 0.03), glass.lerp(C.glass_hi, 0.45), Vector3.BACK)
	box(Vector3(-0.08, H - 0.1, -0.08), Vector3(W + 0.16, 0.3, D + 0.16), frame)
	# lobby: tall glass, canopy, dark entry
	box(Vector3(0.4, 0.3, D - 0.04), Vector3(W - 0.8, 1.6, 0.03), Color("#4d6477"))
	door_at(door, D, Color("#33404b"), 0.9, 1.4, frame)
	box(Vector3(door - 1.1, 1.85, D - 0.05), Vector3(2.2, 0.1, 0.9), frame)
	sign_board(door, 2.0, 2.4, 0.36, D - 0.06, Color("#3b4954"), "Prairie Tower", Color("#e8edf0"), 52)
	# rooftop penthouse and mast
	box(Vector3(1.0, H + 0.2, 1.5), Vector3(2.6, 1.0, 3.0), span.darkened(0.1))
	cyl(Vector3(3.8, H + 0.2, 1.0), 0.04, 2.0, C.metal, 4)


func _b_apartments(W: float, D: float, door: float, b: Dictionary) -> void:
	var wall := Color("#c8a17d"); var trim := Color("#efe5d4"); var H := 7.4; var fh := 1.4
	_shell(W, D, H, wall, trim, Color("#8e8579"))
	door_at(door, D, Color("#55604f"), 0.7, 1.35, trim)
	box(Vector3(door - 0.6, 1.78, D - 0.02), Vector3(1.2, 0.08, 0.6), C.metal)
	win(2.9, 0.75, 1.0, 0.95, D, trim)
	for f in 4:
		var y := 1.0 + fh * (f + 1)
		for i in 2:
			var cx := 1.0 + i * 2.0
			win(cx, y + 0.15, 0.6, 0.95, D, trim)
			# balcony: slab, glass-free railing, a plant
			box(Vector3(cx - 0.65, y, D - 0.02), Vector3(1.3, 0.08, 0.5), trim.darkened(0.08))
			box(Vector3(cx - 0.65, y + 0.08, D + 0.43), Vector3(1.3, 0.04, 0.04), C.metal)
			box(Vector3(cx - 0.65, y + 0.42, D + 0.43), Vector3(1.3, 0.04, 0.05), C.metal)
			for k in 5:
				box(Vector3(cx - 0.63 + k * 0.31, y + 0.08, D + 0.44), Vector3(0.02, 0.36, 0.02), C.metal)
			if (f + i) % 2 == 0:
				blob(Vector3(cx + 0.4, y + 0.3, D + 0.2), Vector3(0.16, 0.2, 0.14), C.leaf2, f * 7 + i, 5, 3, 0.2)
	for f in 5:
		for i in 3:
			win_side(1.2 + i * 2.2, 1.2 + f * fh, 0.6, 0.85, 0.04, trim)
	# water tower on legs
	var wc := Vector3(2.0, H + 0.2, 3.5)
	for d in [Vector3(-0.5, 0, -0.5), Vector3(0.5, 0, -0.5), Vector3(-0.5, 0, 0.5), Vector3(0.5, 0, 0.5)]:
		box(wc + d - Vector3(0.04, 0, 0.04), Vector3(0.08, 0.8, 0.08), C.wood_dk)
	cyl(wc + Vector3(0, 0.8, 0), 0.75, 1.1, Color("#a0765a"), 9)
	for k in 3:
		cyl(wc + Vector3(0, 0.95 + k * 0.33, 0), 0.77, 0.04, C.metal, 9, -1.0, false)
	cone(wc + Vector3(0, 1.9, 0), 0.85, 0.55, Color("#6e5a4c"), 9, false)


func _b_grocery(W: float, D: float, door: float, b: Dictionary) -> void:
	var wall := Color("#d8c49c"); var trim := Color("#f1e9d8"); var H := 3.0
	_shell(W, D, H, wall, trim, Color("#91897d"))
	box(Vector3(0.04, 0.3, D - 0.04), Vector3(W - 0.08, 1.55, 0.03), Color("#4f6b52"))
	win(W - 0.85, 0.55, 1.2, 1.15, D - 0.01, trim)
	win(0.75, 0.55, 1.0, 1.15, D - 0.01, trim)
	door_at(door, D - 0.01, Color("#3e5640"), 0.66, 1.3, trim)
	awning(0.1, W - 0.1, 2.2, D, Color("#6f8f62"), 0.75)
	sign_board(W / 2, 2.35, 2.4, 0.44, D, Color("#f1e9d8"), "Grocery", Color("#3e5640"), 62)
	# produce stand on the sidewalk: tilted crates of fruit
	for k in 2:
		var sx := 0.2 + k * (W - 1.6)
		box(Vector3(sx, 0, D + 0.15), Vector3(1.2, 0.55, 0.6), C.wood)
		var fr: Array = [[Color("#c9675a"), Color("#d9a24e"), Color("#9bb35c")], [Color("#e0c45a"), Color("#a7c46a"), Color("#b5584f")]][k]
		for j in 3:
			box(Vector3(sx + 0.05 + j * 0.38, 0.55, D + 0.2), Vector3(0.34, 0.1, 0.5), C.wood_dk)
			for q in 3:
				blob(Vector3(sx + 0.13 + j * 0.38 + (q % 2) * 0.12, 0.7, D + 0.3 + q * 0.12), Vector3(0.08, 0.07, 0.08), fr[j], k * 9 + j * 3 + q, 5, 2, 0.1)
	ac_unit(Vector3(1.4, H, 1.0))


func _b_library(W: float, D: float, door: float, b: Dictionary) -> void:
	var stone := Color("#cbc2b1"); var trim := Color("#e2dacb"); var H := 4.2
	_shell(W, D - 1.0, H, stone, trim, Color("#9a9286"))
	var zf := D - 1.0
	# portico: steps, columns, entablature, pediment
	for i in 3:
		box(Vector3(0.6, 0, zf + 1.0 + 0.3 * (2 - i) - 0.6), Vector3(W - 1.2, 0.1 * (i + 1), 0.3 * (3 - i)), stone.darkened(0.04 * i))
	for i in 6:
		var cx := 0.9 + i * (W - 1.8) / 5.0
		cyl(Vector3(cx, 0.3, zf + 0.7), 0.16, 2.8, trim, 8, 0.14)
		box(Vector3(cx - 0.22, 3.08, zf + 0.48), Vector3(0.44, 0.12, 0.44), trim)
	box(Vector3(0.5, 3.2, zf - 0.02), Vector3(W - 1.0, 0.5, 1.0), trim, trim.lightened(0.03))
	var pz := zf + 0.98
	quad(Vector3(0.5, 3.7, zf), Vector3(W - 0.5, 3.7, zf), Vector3(W / 2 + 0.01, 4.5, zf), Vector3(W / 2 - 0.01, 4.5, zf), trim.darkened(0.03), Vector3.UP)
	tri(Vector3(0.5, 3.7, pz), Vector3(W - 0.5, 3.7, pz), Vector3(W / 2, 4.5, pz), trim, Vector3.BACK)
	quad(Vector3(0.5, 3.7, pz), Vector3(W / 2, 4.5, pz), Vector3(W / 2, 4.5, zf), Vector3(0.5, 3.7, zf), Color("#9a8f80"), Vector3(-1, 1.2, 0))
	quad(Vector3(W - 0.5, 3.7, pz), Vector3(W / 2, 4.5, pz), Vector3(W / 2, 4.5, zf), Vector3(W - 0.5, 3.7, zf), Color("#8f8576"), Vector3(1, 1.2, 0))
	sign_board(W / 2, 3.25, 2.2, 0.4, zf + 1.0, trim, "Library", Color("#55504a"), 60)
	for i in 4:
		var cx := 1.25 + i * (W - 2.5) / 3.0
		if absf(cx - door) < 0.6: continue
		win(cx, 0.8, 0.6, 1.6, zf, trim, C.glass, false)
	door_at(door, zf, Color("#6e4d36"), 0.8, 1.6, trim)
	for i in 4:   # tall windows on the side that faces the park street
		var cz := 1.0 + i * 1.3
		quad(Vector3(W + 0.01, 0.75, cz - 0.38), Vector3(W + 0.01, 0.75, cz + 0.38), Vector3(W + 0.01, 3.2, cz + 0.38), Vector3(W + 0.01, 3.2, cz - 0.38), trim, Vector3.RIGHT)
		quad(Vector3(W + 0.02, 0.85, cz - 0.28), Vector3(W + 0.02, 0.85, cz + 0.28), Vector3(W + 0.02, 3.1, cz + 0.28), Vector3(W + 0.02, 3.1, cz - 0.28), C.glass, Vector3.RIGHT)
		quad(Vector3(W + 0.025, 1.9, cz - 0.28), Vector3(W + 0.025, 1.9, cz + 0.28), Vector3(W + 0.025, 1.98, cz + 0.28), Vector3(W + 0.025, 1.98, cz - 0.28), trim, Vector3.RIGHT)
	for y in [0.3, 3.5]:
		quad(Vector3(W + 0.015, y, 0.05), Vector3(W + 0.015, y, zf), Vector3(W + 0.015, y + 0.12, zf), Vector3(W + 0.015, y + 0.12, 0.05), trim.darkened(0.05), Vector3.RIGHT)
	box(Vector3(W * 0.3, H, zf * 0.3), Vector3(W * 0.4, 0.5, zf * 0.4), trim.darkened(0.05), C.glass_hi)   # reading-room skylight
	ac_unit(Vector3(1.0, H, 1.0)); ac_unit(Vector3(W - 1.8, H, 1.2))


# ── Street furniture with a steady rhythm: trees in planters every 3 tiles, lamps every 6 ──
func _street_furniture() -> void:
	var doors := [1, 7, 12, 15, 24, 33, 37]
	for x in range(-27, 68, 6):   # a street tree every 6 tiles
		if x >= 16 and x <= 23: continue
		_street_tree(Vector3(x + 0.5, 0.14, 11.62), x)
		if not (x >= 0 and x < 17):
			_street_tree(Vector3(x + 0.5, 0.14, 16.38), x + 500)
	for x in range(-25, 68, 6):
		if x >= 15 and x <= 24: continue
		_lamp(Vector3(x + 0.5, 0.14, 11.75), Vector3.BACK)
		_lamp(Vector3(x + 0.5, 0.14, 16.25), Vector3.FORWARD)
	# traffic lights on the four corners
	_signal(Vector3(17.4, 0.14, 11.6), Vector3(1, 0, 0))
	_signal(Vector3(22.6, 0.14, 16.4), Vector3(-1, 0, 0))
	_signal(Vector3(22.6, 0.14, 11.6), Vector3(0, 0, 1))
	_signal(Vector3(17.4, 0.14, 16.4), Vector3(0, 0, -1))
	# hydrants, bins, bike racks, bollards
	_hydrant(Vector3(10.7, 0.14, 11.75)); _hydrant(Vector3(28.6, 0.14, 16.25))
	_bin(Vector3(13.6, 0.14, 11.7)); _bin(Vector3(2.7, 0.14, 11.7)); _bin(Vector3(26.5, 0.14, 11.7)); _bin(Vector3(15.5, 0.14, 16.3))
	_bike_rack(Vector3(35.0, 0.14, 11.3)); _bike_rack(Vector3(23.3, 0.14, 23.0))
	for z in [18.7, 19.5, 20.3]:
		cyl(Vector3(23.75, 0.14, z), 0.07, 0.5, C.metal, 6)
	_bus_shelter(Vector3(30.0, 0.14, 16.15))
	# planters and benches on the plaza in front of the library
	for i in 2:
		box(Vector3(28.6 + i * 1.9, 0.14, 18.6), Vector3(1.0, 0.4, 1.0), C.concrete)
		blob(Vector3(29.1 + i * 1.9, 0.75, 19.1), Vector3(0.45, 0.35, 0.45), C.leaf_dk, 60 + i, 7, 3, 0.15)
	_bench(Vector3(31.45, 0.14, 21.0), -PI / 2.0)   # along the edge of the square, facing in
	# parked cars along the north curb; moving traffic in the lanes
	var cars := [[2.0, 12.55, 0.0, "#9fb0bf"], [11.6, 12.55, 0.0, "#c9b28d"], [30.5, 12.55, 0.0, "#8e9e88"], [38.0, 12.55, 0.0, "#b5837a"],
		[6.0, 13.45, PI, "#d6d0c4"], [27.0, 14.55, 0.0, "#7e8fa6"], [20.5, 6.0, PI / 2.0, "#c7a06e"], [19.4, 24.0, -PI / 2.0, "#a9a39b"]]
	for c in cars:
		if c[1] == 12.55:
			_car(Vector3(c[0], 0, c[1]), Color(c[3]), c[2])
	for c in MOVING_CARS:
		_moving_car(c[0], c[1], Color(c[2]))
	_truck(Vector3(26.0, 0, 12.6), 0.0, "lin")
	_truck(Vector3(34.4, 0, 12.6), 0.0, "produce")


func _street_tree(p: Vector3, k: int) -> void:
	box(p + Vector3(-0.34, 0, -0.34), Vector3(0.68, 0.22, 0.68), C.concrete, C.soil)
	part_begin()   # trunk and crown sway together
	cyl(Vector3(0, 0.22, 0), 0.07, 1.0, C.trunk, 5, 0.05)
	var col: Color = C.leaf if k % 4 != 1 else C.leaf2
	blob(Vector3(0, 1.55, 0), Vector3(0.7, 0.62, 0.7), col, k, 7, 4, 0.16)
	blob(Vector3(0.18, 1.95, 0.08), Vector3(0.45, 0.4, 0.45), col.lightened(0.05), k + 7, 6, 3, 0.15)
	trees_m.append([part_end(p), k * 0.37])


func _lamp(p: Vector3, out: Vector3) -> void:
	cyl(p, 0.08, 0.2, C.metal, 6)
	cyl(p, 0.04, 2.5, C.metal, 5)
	var arm := p + Vector3(0, 2.5, 0) + out * 0.35
	box(Vector3(minf(p.x, arm.x) - 0.03, p.y + 2.46, minf(p.z, arm.z) - 0.03), Vector3(absf(arm.x - p.x) + 0.06, 0.05, absf(arm.z - p.z) + 0.06), C.metal)
	cyl(arm + Vector3(0, -0.12, 0), 0.22, 0.12, C.metal, 8, 0.1)
	glow_on()
	cyl(arm + Vector3(0, -0.17, 0), 0.16, 0.05, Color("#ffe2a8"), 8)
	glow_off()


func _signal(p: Vector3, dir: Vector3) -> void:
	cyl(p, 0.06, 3.0, C.metal, 6)
	var end := p + dir * 1.8
	var a := Vector3(minf(p.x, end.x) - 0.04, p.y + 2.9, minf(p.z, end.z) - 0.04)
	box(a, Vector3(absf(end.x - p.x) + 0.08, 0.07, absf(end.z - p.z) + 0.08), C.metal)
	var hpos := p + dir * 1.5 + Vector3(0, 2.25, 0)
	box(hpos - Vector3(0.13, 0, 0.13), Vector3(0.26, 0.65, 0.26), Color("#33383c"))
	var face := Vector3(-1, 0, 0) if dir.z != 0 else Vector3(0, 0, 1 if dir.x > 0 else -1)
	var road := "fifth" if dir.x != 0 else "main"   # arms over 5th Ave control 5th Ave traffic
	var dim := [Color("#4a3a38"), Color("#5a4e3a"), Color("#3c4a40")]
	for i in 3:
		var c := hpos + Vector3(0, 0.52 - i * 0.2, 0) + face * 0.135
		box(c - Vector3(0.06, 0.06, 0.06), Vector3(0.12, 0.12, 0.12), dim[i])
		if i == 1: continue
		part_begin()
		box(Vector3(-0.065, -0.065, -0.065), Vector3(0.13, 0.13, 0.13), Color("#e0705f") if i == 0 else Color("#8fd6a4"))
		lit[road + ("_red" if i == 0 else "_green")].append(part_end(c, lmat, false))
	box(p + Vector3(-0.1, 1.0, -0.1), Vector3(0.2, 0.25, 0.2), Color("#f0e8d0"))   # push-button box


func _set_signals() -> void:
	for n in lit.main_green: n.visible = light_phase == 0
	for n in lit.main_red: n.visible = light_phase != 0
	for n in lit.fifth_green: n.visible = light_phase == 2
	for n in lit.fifth_red: n.visible = light_phase != 2


func green(road: String) -> bool:
	return light_phase == (0 if road == "main" else 2)


func _hydrant(p: Vector3) -> void:
	cyl(p, 0.13, 0.42, Color("#b8574a"), 7)
	cyl(p + Vector3(0, 0.42, 0), 0.1, 0.1, Color("#c96a5b"), 7)
	box(p + Vector3(-0.2, 0.22, -0.05), Vector3(0.4, 0.08, 0.1), Color("#a24c40"))


func _bin(p: Vector3) -> void:
	cyl(p, 0.2, 0.6, Color("#4f6656"), 8, 0.22)
	cyl(p + Vector3(0, 0.6, 0), 0.24, 0.06, Color("#3f5246"), 8)


func _bike_rack(p: Vector3) -> void:
	for i in 3:
		var x := p.x + i * 0.45
		box(Vector3(x, p.y, p.z), Vector3(0.04, 0.5, 0.04), C.metal_lt)
		box(Vector3(x, p.y, p.z + 0.45), Vector3(0.04, 0.5, 0.04), C.metal_lt)
		box(Vector3(x, p.y + 0.48, p.z), Vector3(0.04, 0.04, 0.49), C.metal_lt)
	# one parked bike
	var bx := p.x + 0.25
	cyl(Vector3(bx, p.y + 0.28, p.z - 0.1), 0.26, 0.04, Color("#2c3134"), 10, -1.0, true)


func _bench(p: Vector3, yaw: float) -> void:
	var keep := xf
	xf = Transform3D(Basis(Vector3.UP, yaw), p)
	box(Vector3(-0.6, 0.28, -0.2), Vector3(1.2, 0.07, 0.4), C.wood)
	box(Vector3(-0.6, 0.4, -0.24), Vector3(1.2, 0.3, 0.06), C.wood.darkened(0.08))
	box(Vector3(-0.52, 0, -0.15), Vector3(0.06, 0.28, 0.3), C.metal)
	box(Vector3(0.46, 0, -0.15), Vector3(0.06, 0.28, 0.3), C.metal)
	xf = keep


func _bus_shelter(p: Vector3) -> void:
	var w := 2.4
	box(Vector3(p.x, p.y, p.z + 0.1), Vector3(w, 0.06, 1.4), C.concrete)
	for x in [p.x + 0.05, p.x + w - 0.1]:
		box(Vector3(x, p.y, p.z + 1.3), Vector3(0.06, 2.1, 0.06), C.metal)
	box(Vector3(p.x + 0.05, p.y, p.z + 1.42), Vector3(w - 0.1, 1.9, 0.04), Color("#b9c8cc"))   # back panel (frosted)
	box(Vector3(p.x - 0.05, p.y + 2.1, p.z + 0.3), Vector3(w + 0.1, 0.08, 1.3), Color("#5a6a70"), Color("#6c7c82"))
	box(Vector3(p.x + 0.3, p.y + 0.42, p.z + 1.05), Vector3(1.6, 0.06, 0.32), C.wood)
	glow_on()
	box(Vector3(p.x + w - 0.08, p.y + 0.5, p.z + 0.45), Vector3(0.05, 1.2, 0.8), Color("#efe0c0"))   # lit map panel
	glow_off()
	box(Vector3(p.x - 0.3, p.y, p.z + 0.1), Vector3(0.06, 2.4, 0.06), C.metal)
	box(Vector3(p.x - 0.5, p.y + 2.0, p.z + 0.08), Vector3(0.45, 0.45, 0.04), Color("#4f7ba3"))   # bus stop flag


## A side profile (x along the car, y up; convex, listed in order) pushed out across z, with bevelled edges.
func extrude(prof: Array, half_w: float, bevel: float, col: Color, cap: Color) -> void:
	var n := prof.size()
	var cen := Vector2.ZERO
	for q in prof: cen += q
	cen /= n
	var inner := []
	for q in prof:
		var v: Vector2 = q
		inner.append(v + (cen - v).normalized() * bevel)
	var zo := half_w - bevel
	for k in n:
		var a: Vector2 = prof[k]; var b: Vector2 = prof[(k + 1) % n]
		var ia: Vector2 = inner[k]; var ib: Vector2 = inner[(k + 1) % n]
		var e := b - a
		var o2 := Vector2(e.y, -e.x).normalized()
		if o2.dot((a + b) / 2.0 - cen) < 0: o2 = -o2
		var o := Vector3(o2.x, o2.y, 0)
		quad(Vector3(a.x, a.y, -zo), Vector3(b.x, b.y, -zo), Vector3(b.x, b.y, zo), Vector3(a.x, a.y, zo), col, o)
		for sgn in [-1.0, 1.0]:
			quad(Vector3(a.x, a.y, zo * sgn), Vector3(b.x, b.y, zo * sgn), Vector3(ib.x, ib.y, half_w * sgn), Vector3(ia.x, ia.y, half_w * sgn), col, o + Vector3(0, 0, sgn))
			tri(Vector3(cen.x, cen.y, half_w * sgn), Vector3(ia.x, ia.y, half_w * sgn), Vector3(ib.x, ib.y, half_w * sgn), cap, Vector3(0, 0, sgn))


## A wheel: tyre, hubcap and hub, its axle along z. Built so its closed face looks outward on either side.
func _wheel(c: Vector3, side: float, r := 0.17, w := 0.14) -> void:
	var keep := xf
	xf = xf * Transform3D(Basis(Vector3.RIGHT, PI / 2.0 * side), c)
	# local +y now points out of the car's side
	cyl(Vector3(0, -w / 2.0, 0), r, w, Color("#26282b"), 10)
	cyl(Vector3(0, 0.0, 0), r * 0.6, w / 2.0 + 0.005, Color("#b9bcbf"), 8)
	cyl(Vector3(0, 0.005, 0), r * 0.24, w / 2.0 + 0.005, Color("#7d8185"), 6)
	for k in 5:   # wheel nuts
		var a := TAU * k / 5.0
		box(Vector3(cos(a) * r * 0.38 - 0.01, w / 2.0 + 0.004, sin(a) * r * 0.38 - 0.01), Vector3(0.02, 0.012, 0.02), Color("#55595d"))
	xf = keep


## Cars come in three shapes (sedan, hatchback, small van), picked from where they are parked.
func _car(p: Vector3, col: Color, yaw: float) -> void:
	_car_body(p, col, yaw)


func _moving_car(lane: String, at: float, col: Color) -> void:
	var L: Dictionary = LANES[lane]
	part_begin()
	_car_body(Vector3.ZERO, col, 0.0, int(absf(at * 7.0)) % 3)
	var node := part_end(Vector3.ZERO)
	node.rotation.y = L.yaw
	var mv := {"node": node, "lane": lane, "s": (at - float(L.from)) * float(L.dir), "v": 2.4}
	movers.append(mv)
	_place_mover(mv)


func _place_mover(mv: Dictionary) -> void:
	var L: Dictionary = LANES[mv.lane]
	var along: float = float(L.from) + float(mv.s) * float(L.dir)
	mv.node.position = Vector3(along, 0, L.fixed) if L.axis == "x" else Vector3(L.fixed, 0, along)


func _car_body(p: Vector3, col: Color, yaw: float, kind_ := -1) -> void:
	var keep := xf
	xf = Transform3D(Basis(Vector3.UP, yaw), p)
	var kind := int(absf(p.x * 7.0 + p.z * 3.0)) % 3 if kind_ < 0 else kind_
	var dk := col.darkened(0.3)
	var glass := Color("#3f4b57"); var glass_hi := Color("#6f8396")
	var trim := Color("#2c2f33"); var chrome := Color("#c9ccce")
	var hw := 0.38
	# body: rounded nose, hood, boot (front is +x)
	var body := [Vector2(-0.88, 0.2), Vector2(0.86, 0.2), Vector2(0.9, 0.3), Vector2(0.86, 0.44), Vector2(0.45, 0.52), Vector2(-0.6, 0.53), Vector2(-0.86, 0.48), Vector2(-0.9, 0.34)]
	if kind == 1:   # hatchback: short, upright tail
		body = [Vector2(-0.74, 0.2), Vector2(0.84, 0.2), Vector2(0.88, 0.3), Vector2(0.84, 0.44), Vector2(0.45, 0.52), Vector2(-0.7, 0.54), Vector2(-0.78, 0.36)]
	elif kind == 2:   # small van: tall box with a short nose
		body = [Vector2(-0.9, 0.2), Vector2(0.88, 0.2), Vector2(0.92, 0.32), Vector2(0.86, 0.5), Vector2(0.55, 0.58), Vector2(-0.9, 0.6)]
	extrude(body, hw, 0.05, col, col.darkened(0.06))
	# cabin: glass house with a body-coloured roof
	var cab := [Vector2(-0.5, 0.52), Vector2(0.45, 0.52), Vector2(0.2, 0.82), Vector2(-0.38, 0.82)]
	if kind == 1:
		cab = [Vector2(-0.7, 0.53), Vector2(0.45, 0.52), Vector2(0.18, 0.82), Vector2(-0.64, 0.82)]
	elif kind == 2:
		cab = [Vector2(-0.88, 0.59), Vector2(0.55, 0.58), Vector2(0.3, 0.95), Vector2(-0.86, 0.96)]
	extrude(cab, hw - 0.05, 0.03, glass, glass)
	var rt: float = cab[2].y
	var roof := [Vector2(cab[3].x - 0.01, rt - 0.02), Vector2(cab[2].x + 0.01, rt - 0.02), Vector2(cab[2].x - 0.02, rt + 0.04), Vector2(cab[3].x + 0.02, rt + 0.04)]
	extrude(roof, hw - 0.04, 0.02, col.lightened(0.05), col)
	# pillars between the side windows, a highlight on the windscreen
	var mid: float = (cab[0].x + cab[1].x) / 2.0 - 0.05
	for sgn in [-1.0, 1.0]:
		var z: float = (hw - 0.05) * sgn + 0.005 * sgn
		quad(Vector3(mid - 0.03, cab[0].y, z), Vector3(mid + 0.03, cab[0].y, z), Vector3(mid + 0.03, rt, z), Vector3(mid - 0.03, rt, z), col, Vector3(0, 0, sgn))
		if kind == 2:
			quad(Vector3(-0.45, cab[0].y, z), Vector3(-0.39, cab[0].y, z), Vector3(-0.39, rt, z), Vector3(-0.45, rt, z), col, Vector3(0, 0, sgn))
		# door seams and handles
		var zs: float = hw * sgn + 0.004 * sgn
		for sx in [mid, cab[0].x + 0.05]:
			quad(Vector3(sx - 0.008, 0.24, zs), Vector3(sx + 0.008, 0.24, zs), Vector3(sx + 0.008, 0.5, zs), Vector3(sx - 0.008, 0.5, zs), dk, Vector3(0, 0, sgn))
		for hx in [mid + 0.12, mid - 0.2]:
			quad(Vector3(hx - 0.04, 0.44, zs), Vector3(hx + 0.04, 0.44, zs), Vector3(hx + 0.04, 0.46, zs), Vector3(hx - 0.04, 0.46, zs), chrome, Vector3(0, 0, sgn))
		# mirror
		box(Vector3(cab[1].x - 0.1, 0.52, (hw - 0.02) * sgn - (0.06 if sgn < 0 else 0.0)), Vector3(0.08, 0.06, 0.06), dk)
		# dark wheel arches
		for wx in [-0.55, 0.55]:
			var zz: float = hw * sgn + 0.002 * sgn
			var arch := []
			for k in 7:
				var a := PI * k / 6.0
				arch.append(Vector3(wx + cos(a) * 0.22, 0.2 + sin(a) * 0.2, zz))
			for k in 6:
				quad(arch[k], arch[k + 1], Vector3(arch[k + 1].x, 0.2, zz), Vector3(arch[k].x, 0.2, zz), trim, Vector3(0, 0, sgn))
	var wsx: float = (cab[1].x + cab[2].x) / 2.0
	var wsy: float = (cab[1].y + cab[2].y) / 2.0
	quad(Vector3(wsx - 0.04, wsy - 0.05, -0.15), Vector3(wsx + 0.03, wsy - 0.1, -0.05), Vector3(wsx + 0.03, wsy - 0.1, 0.0), Vector3(wsx - 0.04, wsy - 0.05, -0.1), glass_hi, Vector3(1, 1, 0))
	# wheels
	for wx in [-0.55, 0.55]:
		_wheel(Vector3(wx, 0.17, -hw + 0.03), -1.0)
		_wheel(Vector3(wx, 0.17, hw - 0.03), 1.0)
	# bumpers, grille, plates
	var fx: float = body[2].x
	var bx: float = body[body.size() - 1].x if kind != 2 else -0.9
	box(Vector3(fx - 0.06, 0.18, -hw + 0.02), Vector3(0.1, 0.1, hw * 2 - 0.04), trim)
	box(Vector3(bx - 0.04, 0.18, -hw + 0.02), Vector3(0.1, 0.1, hw * 2 - 0.04), trim)
	box(Vector3(fx - 0.03, 0.29, -0.16), Vector3(0.04, 0.08, 0.32), trim)
	box(Vector3(fx + 0.01, 0.2, -0.08), Vector3(0.02, 0.06, 0.16), Color("#f2efe4"))
	box(Vector3(bx - 0.05, 0.3, -0.08), Vector3(0.02, 0.06, 0.16), Color("#f2efe4"))
	# lights glow softly
	glow_on()
	for z in [-0.3, 0.2]:
		box(Vector3(fx - 0.04, 0.33, z), Vector3(0.04, 0.06, 0.1), Color("#fff3d6"))
		box(Vector3(bx - 0.03, 0.36, z), Vector3(0.04, 0.06, 0.1), Color("#c85a4e"))
	glow_off()
	xf = keep


## A big box truck: cab with a sloped windscreen, mirrors, grille and steps; a ribbed cargo box with a
## roll-up back door and the company's name on both sides; tandem rear wheels and mud flaps. Front is +x.
func _truck(p: Vector3, yaw := 0.0, style := "lin") -> void:
	var keep := xf
	xf = Transform3D(Basis(Vector3.UP, yaw), p)
	var body := Color("#e8e2d6"); var cab := Color("#2f4350"); var stripe := Color("#2f4350"); var name_ := "Lin's Wholesale"
	if style == "produce":
		body = Color("#eef0ea"); cab = Color("#5d7f52"); stripe = Color("#8fb36b"); name_ = "Prairie Produce"
	var dark := Color("#26282b"); var trim := Color("#3a3e42"); var glass := Color("#3f4b57"); var chrome := Color("#c9ccce")
	var hw := 0.46
	# chassis, fuel tank, steps
	box(Vector3(-1.75, 0.22, -0.3), Vector3(3.3, 0.13, 0.6), dark)
	var tk := xf
	xf = xf * Transform3D(Basis(Vector3.BACK, PI / 2.0), Vector3(0.3, 0.33, -0.36))
	cyl(Vector3(0, -0.28, 0), 0.11, 0.56, chrome.darkened(0.15), 10)
	xf = tk
	box(Vector3(0.75, 0.2, hw - 0.02), Vector3(0.3, 0.05, 0.1), trim)
	box(Vector3(0.75, 0.2, -hw - 0.08), Vector3(0.3, 0.05, 0.1), trim)
	# cargo box with ribs, rails and a roll-up back door
	box(Vector3(-1.72, 0.36, -hw), Vector3(2.27, 1.42, hw * 2), body, body.lightened(0.04))
	var x := -1.6
	while x < 0.5:
		for sgn in [-1.0, 1.0]:
			box(Vector3(x, 0.38, hw * sgn - (0.012 if sgn < 0 else 0.0)), Vector3(0.025, 1.38, 0.012), body.darkened(0.08))
		x += 0.3
	for sgn in [-1.0, 1.0]:
		var zz: float = hw * sgn - (0.02 if sgn < 0 else 0.0)
		box(Vector3(-1.72, 0.36, zz), Vector3(2.27, 0.06, 0.02), trim)                  # bottom rail
		box(Vector3(-1.72, 1.72, zz), Vector3(2.27, 0.06, 0.02), body.darkened(0.12))   # top rail
		box(Vector3(-1.72, 0.95, zz), Vector3(2.27, 0.16, 0.02), stripe)                 # company stripe
		for k in 6:   # reflector tape
			box(Vector3(-1.6 + k * 0.38, 0.44, zz), Vector3(0.18, 0.04, 0.02), Color("#c85a4e") if k % 2 else Color("#f2efe4"))
	box(Vector3(-1.74, 0.4, -hw + 0.06), Vector3(0.03, 1.3, hw * 2 - 0.12), body.darkened(0.06))   # back door
	var y := 0.48
	while y < 1.66:
		box(Vector3(-1.755, y, -hw + 0.08), Vector3(0.02, 0.015, hw * 2 - 0.16), body.darkened(0.16))
		y += 0.1
	box(Vector3(-1.77, 0.5, -0.06), Vector3(0.03, 0.05, 0.12), chrome)   # handle
	box(Vector3(-1.77, 0.38, -0.12), Vector3(0.02, 0.07, 0.24), Color("#f2efe4"))   # plate
	if style == "produce":   # fridge unit on the front of the box
		box(Vector3(0.55, 1.22, -0.3), Vector3(0.16, 0.5, 0.6), Color("#d8dcd6"))
		for k in 4:
			box(Vector3(0.71, 1.28 + k * 0.1, -0.24), Vector3(0.01, 0.04, 0.48), trim)
	# cab: lower body, glass house, roof with an air deflector
	extrude([Vector2(0.6, 0.34), Vector2(1.55, 0.34), Vector2(1.58, 0.5), Vector2(1.55, 0.95), Vector2(0.6, 0.95)], hw - 0.02, 0.04, cab, cab.darkened(0.08))
	extrude([Vector2(0.62, 0.94), Vector2(1.52, 0.94), Vector2(1.38, 1.36), Vector2(0.64, 1.36)], hw - 0.06, 0.03, glass, glass)
	extrude([Vector2(0.62, 1.34), Vector2(1.4, 1.34), Vector2(1.36, 1.42), Vector2(0.64, 1.42)], hw - 0.04, 0.02, cab.lightened(0.06), cab)
	extrude([Vector2(0.66, 1.42), Vector2(1.2, 1.42), Vector2(0.72, 1.7), Vector2(0.66, 1.7)], hw - 0.08, 0.03, cab, cab.darkened(0.06))
	for sgn in [-1.0, 1.0]:
		var zg: float = (hw - 0.06) * sgn + 0.006 * sgn
		quad(Vector3(1.0, 0.94, zg), Vector3(1.06, 0.94, zg), Vector3(1.06, 1.36, zg), Vector3(1.0, 1.36, zg), cab, Vector3(0, 0, sgn))   # B pillar
		var zc: float = (hw - 0.02) * sgn + 0.005 * sgn
		quad(Vector3(1.02, 0.36, zc), Vector3(1.035, 0.36, zc), Vector3(1.035, 0.94, zc), Vector3(1.02, 0.94, zc), cab.darkened(0.3), Vector3(0, 0, sgn))   # door seam
		quad(Vector3(0.85, 0.8, zc), Vector3(0.95, 0.8, zc), Vector3(0.95, 0.83, zc), Vector3(0.85, 0.83, zc), chrome, Vector3(0, 0, sgn))   # handle
		# mirror on an arm
		var zm: float = (hw + 0.06) * sgn
		box(Vector3(1.42, 1.08, minf(zm, hw * sgn)), Vector3(0.03, 0.03, 0.08), trim)
		box(Vector3(1.4, 0.95, zm - 0.02), Vector3(0.05, 0.28, 0.06), dark)
	box(Vector3(1.55, 0.42, -0.3), Vector3(0.05, 0.4, 0.6), trim)          # grille
	for k in 5:
		box(Vector3(1.6, 0.46 + k * 0.07, -0.28), Vector3(0.01, 0.02, 0.56), chrome.darkened(0.2))
	box(Vector3(1.55, 0.22, -hw + 0.02), Vector3(0.1, 0.14, hw * 2 - 0.04), chrome.darkened(0.25))   # bumper
	box(Vector3(-1.8, 0.24, -hw + 0.04), Vector3(0.08, 0.1, hw * 2 - 0.08), dark)   # rear bumper
	glow_on()
	for z in [-0.36, 0.24]:
		box(Vector3(1.58, 0.56, z), Vector3(0.03, 0.08, 0.12), Color("#fff3d6"))
		box(Vector3(-1.76, 0.5, z), Vector3(0.03, 0.08, 0.12), Color("#c85a4e"))
	for k in 3:   # roof marker lights
		box(Vector3(1.38, 1.42, -0.12 + k * 0.1), Vector3(0.04, 0.03, 0.04), Color("#f2b35c"))
	glow_off()
	# wheels: one front pair, tandem rear pairs, mud flaps
	for wx in [1.18, -0.82, -1.28]:
		_wheel(Vector3(wx, 0.22, -hw + 0.04), -1.0, 0.22, 0.16)
		_wheel(Vector3(wx, 0.22, hw - 0.04), 1.0, 0.22, 0.16)
	for sgn in [-1.0, 1.0]:
		box(Vector3(-1.56, 0.06, hw * sgn - (0.12 if sgn > 0 else 0.0)), Vector3(0.02, 0.26, 0.12), dark)
	xf = keep
	# the company name on both sides of the box
	for sgn in [-1.0, 1.0]:
		var l := Label3D.new()
		l.text = name_
		l.font = font
		l.font_size = 56
		l.pixel_size = 0.0042
		l.modulate = stripe.darkened(0.2) if style == "lin" else Color("#4c6d42")
		l.outline_size = 0
		l.shaded = true
		var local := Vector3(-0.58, 1.38, (hw + 0.012) * sgn)
		l.position = Transform3D(Basis(Vector3.UP, yaw), p) * local
		l.rotation.y = yaw + (0.0 if sgn > 0 else PI)
		add_child(l)
	var ext := Vector2(3.45, 1.2)
	if absf(sin(yaw)) > 0.5: ext = Vector2(1.2, 3.45)
	solid(p.x - ext.x / 2.0 - 0.05, p.z - ext.y / 2.0, ext.x, ext.y)


## Park trees: every second one of the first layout, so the park feels open.
func park_trees() -> Array:
	var all := [[1.5, 21.0], [1.3, 25.6], [3.0, 27.0], [10.8, 26.9], [11.2, 20.5], [15.4, 21.6], [15.5, 27.0], [9.8, 27.2], [1.8, 23.3], [4.0, 20.2]]
	var out := []
	for i in range(0, all.size(), 2):
		out.append(all[i])
	return out


# ── Park: lawn, hedges, a pond with a fountain, paths, benches, playground, trees ──
func _park() -> void:
	var y := 0.17
	# hedges around the edge, with gaps for the entrances
	for seg in [[0.4, 18.4, 5.2, 18.75], [7.4, 18.4, 13.6, 18.75], [15.6, 18.4, 16.6, 18.75], [16.25, 19.6, 16.6, 27.6]]:
		box(Vector3(seg[0], y, seg[1]), Vector3(seg[2] - seg[0], 0.45, seg[3] - seg[1]), C.hedge, C.hedge.lightened(0.08))
	# paths: one in from the corner by the crosswalk, one from Main St, a loop round the pond
	var pc := Vector3(6.5, 0, 23.2)
	var loop := []
	for i in 17:
		var a := TAU * i / 16.0
		loop.append(pc + Vector3(cos(a) * 3.6, 0, sin(a) * 2.9))
	var edge := C.stone.darkened(0.1)   # stone edging under each path
	strip(loop, 1.04, y + 0.003, edge)
	strip([Vector3(6.3, 0, 18.3), Vector3(6.4, 0, 20.3)], 1.24, y + 0.0035, edge)
	strip([Vector3(16.6, 0, 18.4), Vector3(13.0, 0, 20.4), Vector3(9.9, 0, 22.0)], 1.14, y + 0.004, edge)
	strip([Vector3(14.5, 0, 18.3), Vector3(14.6, 0, 19.6)], 1.14, y + 0.0035, edge)
	strip(loop, 0.9, y + 0.005, C.path)
	strip([Vector3(6.3, 0, 18.3), Vector3(6.4, 0, 20.3)], 1.1, y + 0.006, C.path)
	strip([Vector3(16.6, 0, 18.4), Vector3(13.0, 0, 20.4), Vector3(9.9, 0, 22.0)], 1.0, y + 0.007, C.path)
	strip([Vector3(14.5, 0, 18.3), Vector3(14.6, 0, 19.6)], 1.0, y + 0.006, C.path)
	# pond: stone rim, water, lily pads, a small fountain
	var seg := 16
	for j in seg:
		var u0 := TAU * j / seg; var u1 := TAU * (j + 1) / seg
		var ri := 2.2; var ro := 2.5; var ry := 1.55; var roy := 1.85
		var a := pc + Vector3(cos(u0) * ro, y + 0.12, sin(u0) * roy); var bb := pc + Vector3(cos(u1) * ro, y + 0.12, sin(u1) * roy)
		var c := pc + Vector3(cos(u1) * ri, y + 0.12, sin(u1) * ry); var d := pc + Vector3(cos(u0) * ri, y + 0.12, sin(u0) * ry)
		quad(a, bb, c, d, C.stone, Vector3.UP)
		quad(a, bb, bb - Vector3(0, 0.12, 0), a - Vector3(0, 0.12, 0), C.stone.darkened(0.12), Vector3(cos(u0), 0, sin(u0)))
		tri(pc + Vector3(0, y + 0.07, 0), Vector3(c.x, y + 0.07, c.z), Vector3(d.x, y + 0.07, d.z), C.water if j % 4 else C.water.lightened(0.04), Vector3.UP)
		quad(c, d, Vector3(d.x, y + 0.07, d.z), Vector3(c.x, y + 0.07, c.z), C.stone.darkened(0.2), pc - (c + d) / 2.0)
	for k in 5:
		var lp := pc + Vector3(-1.4 + k * 0.6, y + 0.08, 0.6 + 0.3 * sin(k * 2.0))
		disc(lp, 0.14, C.leaf2, 6)
	pond_c = pc
	pond_w = y + 0.07
	_fountain(pc, y + 0.07)
	for k in 3:
		ducks.append([_duck(k), TAU * k / 3.0 + 0.4, (0.13 if k != 1 else -0.1), 1.55 + k * 0.12, 1.08 + k * 0.06])
	_move_ducks(0.0)
	for k in 5:   # rocks round the pond
		var a := 0.5 + k * 1.27
		var rp := pc + Vector3(cos(a) * 2.78, y, sin(a) * 2.12)
		blob(rp + Vector3(0, 0.08, 0), Vector3(0.22, 0.14, 0.18), C.stone.darkened(0.18 + 0.05 * (k % 2)), 700 + k, 6, 3, 0.25)
		solid_post(rp.x, rp.z, 0.2)
	# benches facing the pond
	_bench(pc + Vector3(1.9, y, -3.5), 0.0)   # beside the entrance path, not on it
	_bench(pc + Vector3(-1.6, y, 3.55), PI)
	_bench(pc + Vector3(1.6, y, 3.55), PI)
	# playground: sand pit, slide, swings
	var pg := Vector3(13.2, y, 24.0)
	box(pg + Vector3(-1.8, 0, -1.6), Vector3(3.6, 0.03, 3.2), Color("#c9b48c"), C.sand)
	box(pg + Vector3(-1.3, 0.03, -1.2), Vector3(0.9, 1.0, 0.9), Color("#d79a6a"), Color("#c7875a"))   # slide tower
	for d in [Vector3(-1.3, 0, -1.2), Vector3(-0.46, 0, -1.2), Vector3(-1.3, 0, -0.36), Vector3(-0.46, 0, -0.36)]:
		box(pg + d, Vector3(0.06, 1.7, 0.06), Color("#5f7f9a"))
	var rf := pg + Vector3(-0.85, 1.7, -0.75)
	cone(rf, 0.68, 0.45, Color("#c47b6a"), 4, false)
	quad(pg + Vector3(-0.4, 1.03, -1.1), pg + Vector3(-0.4, 1.03, -0.5), pg + Vector3(0.9, 0.06, -0.5), pg + Vector3(0.9, 0.06, -1.1), Color("#e0b85c"), Vector3(1, 1, 0))
	for x in [0.3, 1.6]:   # swing frame
		box(pg + Vector3(x, 0, 0.6), Vector3(0.07, 1.6, 0.07), Color("#5f7f9a"))
	box(pg + Vector3(0.3, 1.6, 0.6), Vector3(1.37, 0.07, 0.07), Color("#5f7f9a"))
	for x in [0.65, 1.25]:   # each swing hangs from the top bar and sways
		part_begin()
		box(Vector3(-0.09, -1.15, -0.01), Vector3(0.02, 1.15, 0.02), C.metal)
		box(Vector3(0.09, -1.15, -0.01), Vector3(0.02, 1.15, 0.02), C.metal)
		box(Vector3(-0.11, -1.18, -0.1), Vector3(0.24, 0.04, 0.2), Color("#c47b6a"))
		swings.append([part_end(pg + Vector3(x + 0.09, 1.6, 0.63)), x * 3.0, 0.32 if x < 1.0 else 0.18])
	# flower beds along the Main St edge
	for k in 2:
		var fb := Vector3(1.0 + k * 7.6 + (2.0 if k == 1 else 0.0), y, 19.3)
		box(fb, Vector3(3.2, 0.12, 0.8), C.soil.darkened(0.1), C.soil)
		for q in 8:
			blob(fb + Vector3(0.2 + q * 0.4, 0.2, 0.4 + 0.15 * sin(q)), Vector3(0.13, 0.11, 0.13), [Color("#d9a0a8"), Color("#e8d08a"), Color("#c9a6d0"), Color("#f0e6d6")][q % 4], q + k * 10, 5, 2, 0.1)
	# trees: a ring of round shade trees and a few conifers, kept off the paths
	var trees := park_trees()
	for i in trees.size():
		var t: Array = trees[i]
		var tp := Vector3(t[0], y, t[1])
		part_begin()
		var keep_tp := tp
		tp = Vector3.ZERO
		if i % 3 == 2:
			cyl(tp, 0.1, 0.4, C.trunk, 5)
			for k in 3:
				cone(tp + Vector3(0, 0.35 + k * 0.6, 0), 0.85 - k * 0.22, 1.1, C.leaf_dk.darkened(0.05 * k), 7)
		else:
			cyl(tp, 0.12, 1.1, C.trunk, 5, 0.08)
			var col: Color = [C.leaf_au, C.leaf2][i % 3]
			blob(tp + Vector3(0, 1.75, 0), Vector3(1.05, 0.9, 1.05), col, i + 200, 8, 4, 0.14)
			blob(tp + Vector3(0.3, 2.35, -0.2), Vector3(0.6, 0.5, 0.6), col.lightened(0.05), i + 300, 7, 3, 0.14)
		trees_m.append([part_end(keep_tp), i * 1.3])
	_picnic(Vector3(14.3, y, 21.7))
	_picnic(Vector3(1.7, y, 25.3))
	for b in [[8.9, 18.98], [15.9, 22.6], [15.9, 25.6], [0.55, 22.4]]:   # bushes inside the hedges
		blob(Vector3(b[0], y + 0.25, b[1]), Vector3(0.34, 0.28, 0.3), C.hedge.lightened(0.06), int(b[0] * 10), 7, 3, 0.18)
		solid_post(b[0], b[1], 0.3)
	_drinking_fountain(Vector3(11.3, y, 22.7))
	_park_sign(Vector3(7.95, y, 18.95))
	_tufts(y)
	# a lamp at each entrance
	_lamp(Vector3(5.5, y, 18.9), Vector3.BACK)
	_lamp(Vector3(15.3, y, 18.9), Vector3.BACK)


## A tiered stone fountain: plinth, lower bowl, column with collars, upper bowl and finial. The water
## (top jet, two falling curtains, droplets, ripples) is made of separate pieces so it can move.
func _fountain(pc: Vector3, w: float) -> void:
	var sn := C.stone
	cyl(pc + Vector3(0, w - 0.02, 0), 0.66, 0.14, sn.darkened(0.1), 14)
	cyl(pc + Vector3(0, w + 0.12, 0), 0.44, 0.16, sn, 12, 0.36)
	cyl(pc + Vector3(0, w + 0.28, 0), 0.3, 0.2, sn.lightened(0.03), 14, 0.86, false)    # lower bowl
	disc(pc + Vector3(0, w + 0.45, 0), 0.82, C.water, 16)
	disc(pc + Vector3(0, w + 0.48, 0), 0.9, sn.lightened(0.06), 16, 0.8)                 # rim
	cyl(pc + Vector3(0, w + 0.45, 0), 0.9, 0.03, sn.lightened(0.06), 16, -1.0, false)
	cyl(pc + Vector3(0, w + 0.46, 0), 0.09, 0.66, sn, 10)
	for k in 2:
		cyl(pc + Vector3(0, w + 0.62 + k * 0.26, 0), 0.13, 0.05, sn.darkened(0.06), 10)
	cyl(pc + Vector3(0, w + 1.1, 0), 0.1, 0.12, sn.lightened(0.03), 12, 0.44, false)     # upper bowl
	disc(pc + Vector3(0, w + 1.2, 0), 0.41, C.water, 12)
	disc(pc + Vector3(0, w + 1.22, 0), 0.46, sn.lightened(0.06), 12, 0.4)
	blob(pc + Vector3(0, w + 1.3, 0), Vector3(0.07, 0.07, 0.07), sn, 5, 6, 3, 0.0)
	# moving water
	part_begin()
	cone(Vector3.ZERO, 0.05, 0.38, C.water_hi.lightened(0.15), 6, false)
	jets.append([part_end(pc + Vector3(0, w + 1.34, 0), wmat, false), 0.0])
	part_begin()
	cyl(Vector3(0, -0.72, 0), 0.5, 0.72, C.water_hi.lightened(0.1), 16, 0.45, false)
	curtains.append([part_end(pc + Vector3(0, w + 1.2, 0), wmat, false), 0.0])
	curtains[-1][0].transparency = 0.6
	part_begin()
	cyl(Vector3(0, -0.46, 0), 0.97, 0.46, C.water_hi.lightened(0.1), 18, 0.9, false)
	curtains.append([part_end(pc + Vector3(0, w + 0.46, 0), wmat, false), 1.7])
	curtains[-1][0].transparency = 0.6
	for k in 3:
		part_begin()
		disc(Vector3.ZERO, 1.0, C.water_hi.lightened(0.2), 22, 0.95)
		ripples.append([part_end(pc + Vector3(0, w + 0.006, 0), wmat, false), k / 3.0])
	for ring in [[0.45, w + 1.2], [0.9, w + 0.46]]:
		var pt := CPUParticles3D.new()
		var sm := SphereMesh.new()
		sm.radius = 0.022; sm.height = 0.044; sm.radial_segments = 6; sm.rings = 3
		sm.material = wmat
		pt.mesh = sm
		pt.amount = 36
		pt.lifetime = 0.5
		pt.emission_shape = CPUParticles3D.EMISSION_SHAPE_RING
		pt.emission_ring_axis = Vector3.UP
		pt.emission_ring_radius = ring[0] + 0.03
		pt.emission_ring_inner_radius = ring[0]
		pt.emission_ring_height = 0.0
		pt.direction = Vector3.UP
		pt.spread = 60.0
		pt.initial_velocity_min = 0.2
		pt.initial_velocity_max = 0.5
		pt.position = pc + Vector3(0, ring[1], 0)
		add_child(pt)


func _duck(k: int) -> MeshInstance3D:
	part_begin()
	var body := Color("#f2efe6") if k != 1 else Color("#9a7a5a")
	blob(Vector3(0, 0.07, 0), Vector3(0.1, 0.065, 0.15), body, 40 + k, 7, 4, 0.0)
	blob(Vector3(0, 0.1, -0.12), Vector3(0.05, 0.04, 0.05), body.darkened(0.08), 50 + k, 5, 3, 0.0)   # tail
	blob(Vector3(0, 0.18, 0.1), Vector3(0.055, 0.055, 0.055), Color("#4f7d5a") if k != 1 else body.darkened(0.1), 60 + k, 6, 3, 0.0)
	box(Vector3(-0.02, 0.165, 0.15), Vector3(0.04, 0.02, 0.06), Color("#e0a23c"))
	for sx in [-0.03, 0.025]:
		box(Vector3(sx, 0.195, 0.135), Vector3(0.012, 0.014, 0.012), Color("#1e1e1e"))
	return part_end(pond_c + Vector3(0, pond_w, 0), null, false)


func _move_ducks(dt: float) -> void:
	for d in ducks:
		d[1] += d[2] * dt
		var a: float = d[1]
		var pos := pond_c + Vector3(cos(a) * d[3], pond_w + 0.01 * sin(clock * 3.0 + a * 5.0), sin(a) * d[4])
		var tan := Vector3(-sin(a) * d[3], 0, cos(a) * d[4]) * signf(d[2])
		d[0].position = pos
		d[0].rotation.y = atan2(tan.x, tan.z)


func _picnic(p: Vector3) -> void:
	box(p + Vector3(-0.6, 0.5, -0.3), Vector3(1.2, 0.05, 0.6), C.wood)
	for sz in [-0.5, 0.42]:
		box(p + Vector3(-0.6, 0.3, sz), Vector3(1.2, 0.04, 0.2), C.wood.darkened(0.06))
	for sx in [-0.45, 0.4]:
		box(p + Vector3(sx, 0, -0.5), Vector3(0.05, 0.5, 0.05), C.wood_dk)
		box(p + Vector3(sx, 0, 0.55), Vector3(0.05, 0.5, 0.05), C.wood_dk)
		box(p + Vector3(sx, 0.28, -0.5), Vector3(0.05, 0.03, 1.1), C.wood_dk)
	solid(p.x - 0.65, p.z - 0.6, 1.3, 1.25)


func _drinking_fountain(p: Vector3) -> void:
	cyl(p, 0.1, 0.75, C.metal_lt.darkened(0.1), 8)
	cyl(p + Vector3(0, 0.75, 0), 0.16, 0.06, C.metal_lt, 10)
	cyl(p + Vector3(0.05, 0.81, 0), 0.015, 0.06, C.metal, 5)
	solid_post(p.x, p.z, 0.18)


func _park_sign(p: Vector3) -> void:
	for sx in [-0.5, 0.5]:
		box(p + Vector3(sx - 0.04, 0, -0.04), Vector3(0.08, 0.9, 0.08), C.wood_dk)
	box(p + Vector3(-0.62, 0.55, -0.05), Vector3(1.24, 0.4, 0.06), C.wood)
	var l := Label3D.new()
	l.text = "Prairie Park"
	l.font = font
	l.font_size = 48
	l.pixel_size = 0.0038
	l.modulate = Color("#f5ecd8")
	l.outline_size = 10
	l.outline_modulate = Color("#5b4030")
	l.position = p + Vector3(0, 0.75, 0.02)
	l.shaded = false
	add_child(l)
	solid(p.x - 0.6, p.z - 0.1, 1.2, 0.2)


## Little clumps of long grass on the lawn, kept off paths, the pond and the playground.
func _tufts(y: float) -> void:
	var placed := 0
	var k := 0
	while placed < 60 and k < 600:
		k += 1
		var x := 0.6 + _h(k, 81) * 15.2
		var z := 19.0 + _h(k, 82) * 8.5
		var e := Vector2((x - pond_c.x) / 3.6, (z - pond_c.z) / 2.9).length()
		if e > 0.8 and e < 1.22: continue          # the loop path
		if e < 0.8: continue                       # pond and its rim
		if x > 11.2 and x < 15.2 and z > 22.2 and z < 25.8: continue   # playground
		if absf(x - 6.35) < 0.8 and z < 20.6: continue                 # entrance path
		if z < 20.4 and ((x > 0.9 and x < 4.3) or (x > 10.5 and x < 13.9)): continue   # flower beds
		var tp := Vector3(x, y, z)
		for b in 3:
			var a := TAU * b / 3.0 + _h(k, b)
			var base := tp + Vector3(cos(a) * 0.05, 0, sin(a) * 0.05)
			var tip := base + Vector3(cos(a) * 0.06, 0.16 + 0.06 * _h(k, b + 5), sin(a) * 0.06)
			var side := Vector3(-sin(a), 0, cos(a)) * 0.025
			tri(base - side, base + side, tip, C.grass_dk.darkened(0.05 * b), Vector3(cos(a), 0.3, sin(a)))
		placed += 1


# ── Community garden: raised beds, a shed, a low fence ──
func _garden() -> void:
	var y := 0.14
	box(Vector3(32.3, y, 18.3), Vector3(7.4, 0.02, 9.4), C.soil.lightened(0.15), Color("#b9a27e"))
	for r in 3:
		for c in 2:
			var bp := Vector3(33.0 + c * 3.4, y, 19.2 + r * 2.6)
			box(bp, Vector3(2.6, 0.35, 1.4), C.wood, C.soil)
			for q in 5:
				var col: Color = [C.leaf2, C.leaf, Color("#a9b85e"), C.leaf_dk][(q + r + c) % 4]
				blob(bp + Vector3(0.3 + q * 0.5, 0.5, 0.7), Vector3(0.2, 0.16, 0.25), col, r * 20 + c * 7 + q, 5, 2, 0.15)
	box(Vector3(37.6, y, 26.2), Vector3(1.6, 1.4, 1.2), Color("#a3b294"))
	quad(Vector3(37.5, y + 1.4, 26.1), Vector3(39.3, y + 1.4, 26.1), Vector3(39.3, y + 1.9, 26.8), Vector3(37.5, y + 1.9, 26.8), Color("#8a6d5a"), Vector3(0, 1, -1))
	quad(Vector3(37.5, y + 1.4, 27.5), Vector3(39.3, y + 1.4, 27.5), Vector3(39.3, y + 1.9, 26.8), Vector3(37.5, y + 1.9, 26.8), Color("#8a6d5a"), Vector3(0, 1, 1))
	for x in range(32, 40):
		if x == 35: continue   # gate gap
		box(Vector3(x + 0.45, y, 18.2), Vector3(0.06, 0.6, 0.06), C.wood_dk)
	box(Vector3(32.4, y + 0.45, 18.21), Vector3(2.5, 0.05, 0.04), C.wood_dk)
	box(Vector3(36.0, y + 0.45, 18.21), Vector3(3.9, 0.05, 0.04), C.wood_dk)


# ── Rosa's patio: tables with umbrellas, planter rail, string lights ──
func _patio() -> void:
	var y := 0.14
	var z0 := 9.05; var z1 := 10.35
	# planter boxes along the front edge, leaving the door (x 7) open
	for seg in [[4.15, 6.4], [7.6, 9.85]]:
		box(Vector3(seg[0], y, z1 - 0.3), Vector3(seg[1] - seg[0], 0.35, 0.3), C.wood_dk, C.soil)
		var n := int((seg[1] - seg[0]) / 0.35)
		for q in n:
			blob(Vector3(seg[0] + 0.18 + q * 0.35, y + 0.45, z1 - 0.15), Vector3(0.18, 0.15, 0.13), C.leaf2 if q % 3 else Color("#d9a0a8"), q + int(seg[0] * 10), 5, 2, 0.15)
	for t in [[5.0, 9.75, "#efe3cf"], [8.85, 9.75, "#b25c47"]]:
		var tp := Vector3(t[0], y, t[1])
		cyl(tp, 0.04, 0.55, C.metal, 5)
		cyl(tp + Vector3(0, 0.55, 0), 0.3, 0.04, Color("#e9e0cf"), 8)
		for s in [-1.0, 1.0]:
			box(tp + Vector3(s * 0.45 - 0.13, 0, -0.13), Vector3(0.26, 0.3, 0.26), C.wood_dk)
			box(tp + Vector3(s * 0.45 - 0.13 + (0.2 if s > 0 else 0.0), 0.3, -0.13), Vector3(0.06, 0.35, 0.26), C.wood_dk)
		cyl(tp + Vector3(0, 0.55, 0), 0.025, 1.45, C.wood_dk, 4)
		cone(tp + Vector3(0, 1.75, 0), 0.68, 0.3, Color(t[2]), 8, true)
	# string lights from the awning to two poles at the curb side
	glow_off()
	var poles := [Vector3(4.2, y, 10.4), Vector3(9.8, y, 10.4)]
	for pp in poles:
		cyl(pp, 0.03, 2.3, C.metal, 4)
	_string_lights(Vector3(4.2, 2.42, 10.4), Vector3(9.8, 2.42, 10.4), 0.25)
	_string_lights(Vector3(4.3, 2.05, 9.6), Vector3(4.2, 2.42, 10.4), 0.05)
	_string_lights(Vector3(9.7, 2.05, 9.6), Vector3(9.8, 2.42, 10.4), 0.05)
	# A-frame chalkboard by the door
	box(Vector3(5.95, y, 10.38), Vector3(0.36, 0.6, 0.05), Color("#3a3f3a"))
	box(Vector3(6.0, y + 0.15, 10.43), Vector3(0.26, 0.36, 0.01), Color("#cfd6cf"))


func _string_lights(a: Vector3, b: Vector3, sag: float) -> void:
	var n := 12
	var prev := a
	for i in range(1, n + 1):
		var t := float(i) / n
		var p := a.lerp(b, t) - Vector3(0, sag * 4.0 * t * (1.0 - t), 0)
		quad(prev, p, p + Vector3(0, 0.02, 0), prev + Vector3(0, 0.02, 0), Color("#2b2622"), Vector3.BACK)
		if i < n:
			glow_on()
			box(p - Vector3(0.04, 0.09, 0.04), Vector3(0.08, 0.08, 0.08), Color("#ffe0a0"))
			glow_off()
		prev = p


func _traffic() -> void:
	pass


# ── People: low-poly figures in each person's own colours ──
func _person(look: Dictionary, at: Vector3, yaw: float, sit := false) -> MeshInstance3D:
	const SK := ["#f6d5b8", "#e8b98f", "#c98d5f", "#a86b42", "#7a4a2c", "#5a3520"]
	const HR := ["#2b1d14", "#5a3a22", "#a0622c", "#d9a548", "#8a8580", "#c0392b", "#1d2a4a"]
	const SH := ["#d9675c", "#e6a64a", "#4f8fc8", "#5aaa7c", "#8a6cc0", "#f4f1ea", "#3a414a", "#de7ea6"]
	const PA := ["#2f3e5c", "#4a4a52", "#7a5a3a", "#2e5e4e", "#1f1f24"]
	var p := SurfaceTool.new()
	var keep := st
	var keep_xf := xf
	xf = Transform3D.IDENTITY
	st = p
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var o := Vector3.ZERO
	var pants := Color(PA[int(look.get("pants", 0))]); var shirt := Color(SH[int(look.get("shirt", 0))])
	var skin := Color(SK[int(look.get("skin", 0))]); var hair := Color(HR[int(look.get("hair", 0))])
	if sit:
		box(Vector3(-0.16, 0.22, -0.02), Vector3(0.32, 0.12, 0.3), pants)
		box(Vector3(-0.16, 0.0, 0.2), Vector3(0.12, 0.25, 0.1), pants)
		box(Vector3(0.04, 0.0, 0.2), Vector3(0.12, 0.25, 0.1), pants)
		o = Vector3(0, -0.02, 0)
	else:
		cyl(o + Vector3(-0.09, 0, 0), 0.07, 0.3, pants, 5)
		cyl(o + Vector3(0.09, 0, 0), 0.07, 0.3, pants, 5)
	cyl(o + Vector3(0, 0.28, 0), 0.2, 0.36, shirt, 7, 0.15)
	if look.get("outfit", "") == "apron":
		box(Vector3(-0.13, 0.25, 0.12), Vector3(0.26, 0.33, 0.06), Color(look.get("apron", "#2f3a33")))
	blob(o + Vector3(0, 0.84, 0), Vector3(0.2, 0.21, 0.2), skin, 3, 7, 4, 0.04)
	blob(o + Vector3(0, 0.92, -0.03), Vector3(0.215, 0.16, 0.21), hair, 4, 7, 3, 0.05)
	if look.get("outfit", "") == "cap":
		cyl(o + Vector3(0, 0.95, 0), 0.215, 0.1, Color(look.get("cap", "#e2574c")), 7)
		box(Vector3(-0.12, 0.95, 0.12), Vector3(0.24, 0.03, 0.18), Color(look.get("cap", "#e2574c")))
	box(Vector3(-0.09, 0.85, 0.185), Vector3(0.04, 0.05, 0.02), Color("#2b2622"))
	box(Vector3(0.05, 0.85, 0.185), Vector3(0.04, 0.05, 0.02), Color("#2b2622"))
	var mi := MeshInstance3D.new()
	mi.mesh = st.commit()
	tris += mi.mesh.surface_get_array_len(0) / 3
	mi.material_override = mat
	mi.position = at + (Vector3(0, 0.09, 0) if sit else Vector3.ZERO)   # seated people sit on the chair at this size
	mi.rotation.y = yaw
	mi.scale = Vector3.ONE * PERSON_SCALE
	add_child(mi)
	st = keep
	xf = keep_xf
	idlers.append([mi, _h(int(at.x * 10), int(at.z * 10)) * TAU, sit, yaw])
	return mi


func _people() -> void:
	var ppl: Dictionary = Game.new().people()
	var w := 0.14
	_person(ppl.rosa.look, Vector3(7.0, w, 9.55), 0.2)
	_person(ppl.quinn.look, Vector3(13.2, w, 9.5), -0.3)
	_person(ppl.lin.look, Vector3(23.6, w, 9.5), 0.1)
	_person(ppl.avery.look, Vector3(22.8, w, 20.6), -1.3)
	_person(ppl.jas.look, Vector3(13.6, 0.17, 25.0), 0.8)
	_person(ppl.mo.look, Vector3(4.55, w + 0.06, 9.6), 1.4, true)
	_person({"skin": 1, "hair": 2, "shirt": 5, "pants": 0}, Vector3(10.5, w, 11.0), -0.6)   # you
	# townsfolk
	_person({"skin": 4, "hair": 0, "shirt": 3, "pants": 1}, Vector3(30.6, w, 17.36), 3.1, true)
	_person({"skin": 0, "hair": 3, "shirt": 7, "pants": 0}, Vector3(33.0, w, 17.75), -0.4)
	_person({"skin": 2, "hair": 1, "shirt": 1, "pants": 3}, Vector3(9.15, w + 0.06, 9.55), -1.4, true)
	_person({"skin": 3, "hair": 0, "shirt": 4, "pants": 4}, Vector3(3.3, 0.17, 20.0), 0.5)
	_person({"skin": 5, "hair": 6, "shirt": 2, "pants": 0}, Vector3(34.0, 0.16, 21.3), 2.2)
	var w3 := _person({"skin": 1, "hair": 4, "shirt": 6, "pants": 2}, Vector3(18.6, 0.02, 17.0), -1.6)
	var w2 := _person({"skin": 2, "hair": 5, "shirt": 0, "pants": 1}, Vector3(2.6, w, 9.45), 0.2)
	_person({"skin": 0, "hair": 1, "shirt": 3, "pants": 2}, Vector3(5.6, 0.17, 26.6), 2.8, true)
	var w1 := _person({"skin": 4, "hair": 2, "shirt": 7, "pants": 0}, Vector3(31.7, w, 9.45), 0.3)
	var w4 := _person({"skin": 1, "hair": 0, "shirt": 1, "pants": 1}, Vector3(10.0, 0.17, 21.6), 0.9)
	var dog := _dog(Vector3(10.8, 0.17, 22.0), 0.9)
	# walkers: along the sidewalks, and one with the dog round the pond
	var loop := []
	for i in 24:
		var a := -TAU * i / 24.0
		loop.append(Vector3(pond_c.x + cos(a) * 3.6, 0.17, pond_c.z + sin(a) * 2.9))
	_walker(w1, [Vector3(22.8, w, 10.75), Vector3(39.3, w, 10.75)], false, 1.0, null, Vector3(31.7, w, 9.45))
	_walker(w2, [Vector3(0.5, w, 10.75), Vector3(16.6, w, 10.75)], false, 0.9, null, Vector3(2.6, w, 9.45))
	_walker(w3, [Vector3(0.6, w, 17.1), Vector3(16.6, w, 17.1)], false, 1.1, null, Vector3(18.6, 0.02, 17.0))
	_walker(w4, loop, true, 0.8, dog, Vector3(10.0, 0.17, 21.6))


## Story places get a game-style name tag that always faces the camera, so students can find them.
func _name_tags() -> void:
	var tags := {"cafe": Vector3(7.0, 4.3, 9.4), "quickbean": Vector3(12.0, 3.9, 9.4), "warehouse": Vector3(27.0, 5.6, 9.4), "house": Vector3(15.5, 5.3, 9.4)}
	for b in m.buildings:
		if not tags.has(b.id):
			continue
		var l := Label3D.new()
		l.text = b.sign
		l.font = font
		l.font_size = 64
		l.pixel_size = 0.0098
		l.modulate = Color("#fff6e0")
		l.outline_size = 22
		l.outline_modulate = Color("#2b2622")
		l.billboard = BaseMaterial3D.BILLBOARD_ENABLED
		l.no_depth_test = true
		l.shaded = false
		l.position = tags[b.id]
		add_child(l)


func _dog(at: Vector3, yaw: float) -> MeshInstance3D:
	var keep := xf
	var keep_st := st
	st = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	xf = Transform3D(Basis(Vector3.UP, yaw), Vector3.ZERO)
	var fur := Color("#b98a5a")
	box(Vector3(-0.1, 0.12, -0.2), Vector3(0.2, 0.16, 0.42), fur)
	box(Vector3(-0.08, 0.22, 0.18), Vector3(0.16, 0.16, 0.16), fur.lightened(0.05))
	box(Vector3(-0.03, 0.22, 0.32), Vector3(0.06, 0.06, 0.06), Color("#2b2622"))
	for d in [Vector3(-0.09, 0, -0.18), Vector3(0.04, 0, -0.18), Vector3(-0.09, 0, 0.12), Vector3(0.04, 0, 0.12)]:
		box(d, Vector3(0.05, 0.12, 0.05), fur.darkened(0.2))
	box(Vector3(-0.02, 0.24, -0.3), Vector3(0.04, 0.04, 0.12), fur)
	var mi := MeshInstance3D.new()
	mi.mesh = st.commit()
	tris += mi.mesh.surface_get_array_len(0) / 3
	mi.material_override = mat
	mi.scale = Vector3.ONE * 1.3
	mi.position = at
	add_child(mi)
	st = keep_st
	xf = keep
	return mi


func _goal(at: Vector3) -> void:
	var g := SurfaceTool.new()
	var keep := st
	st = g
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var top := Vector3(0, 0.35, 0); var bot := Vector3(0, -0.35, 0)
	for j in 4:
		var a := Vector3(cos(TAU * j / 4) * 0.22, 0, sin(TAU * j / 4) * 0.22)
		var b := Vector3(cos(TAU * (j + 1) / 4) * 0.22, 0, sin(TAU * (j + 1) / 4) * 0.22)
		tri(a, b, top, Color("#f0b83a"), (a + b) / 2 + Vector3(0, 0.1, 0))
		tri(a, b, bot, Color("#c98f22"), (a + b) / 2 - Vector3(0, 0.1, 0))
	var mi := MeshInstance3D.new()
	mi.mesh = st.commit()
	var gm := mat.duplicate()
	gm.emission_enabled = true
	gm.emission = Color("#f0b83a")
	gm.emission_energy_multiplier = 0.35
	mi.material_override = gm
	mi.position = at
	mi.rotation.y = 0.4
	add_child(mi)
	st = keep


func _light_and_camera() -> void:
	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-42, -38, 0)
	sun.light_color = Color("#ffe6c6")
	sun.light_energy = 0.82
	sun.shadow_enabled = SHADOWS
	sun.shadow_opacity = 0.72
	sun.shadow_blur = 1.5
	sun.shadow_bias = 0.08
	sun.shadow_normal_bias = 1.5
	sun.directional_shadow_max_distance = 60.0
	sun.directional_shadow_mode = DirectionalLight3D.SHADOW_PARALLEL_2_SPLITS
	add_child(sun)
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color("#d2ccd0")
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color("#9a97c6")
	env.ambient_light_energy = 0.44
	env.tonemap_mode = Environment.TONE_MAPPER_LINEAR
	env.fog_enabled = true
	env.fog_mode = Environment.FOG_MODE_DEPTH
	env.fog_light_color = Color("#d2ccd0")
	env.fog_density = 1.0
	env.fog_depth_begin = 52.0
	env.fog_depth_end = 105.0
	env.fog_depth_curve = 1.0
	var we := WorldEnvironment.new()
	we.environment = env
	add_child(we)
	var cam := Camera3D.new()
	cam.fov = 30.0
	cam.near = 1.0
	cam.far = 200.0
	add_child(cam)
	var look_at_pt := Vector3(17.5, 0, 15.0)
	var off := Vector3(-10.0, 29.0, 30.0)
	if close:
		look_at_pt = Vector3(7.2, 0.8, 10.2)
		off = Vector3(-3.0, 7.5, 7.0)
	if "cam=car" in OS.get_cmdline_user_args():   # a close look at the parked cars
		look_at_pt = Vector3(11.6, 0.3, 12.8)
		off = Vector3(-2.2, 3.2, 4.2)
	for arg in OS.get_cmdline_user_args():   # carat=x,z: a low close look at any spot
		if arg.begins_with("carat="):
			var v := arg.substr(6).split(",")
			look_at_pt = Vector3(float(v[0]), 0.3, float(v[1]))
			off = Vector3(-1.6, 1.4, 3.2) * (float(v[2]) if v.size() > 2 else 1.0)
	cam.position = look_at_pt + off
	cam.look_at(look_at_pt)
	cam.current = true


# ── Interface sketch: dark rounded pills like the trailer's, in the CEFL font ──
func _hud() -> void:
	var cl := CanvasLayer.new()
	add_child(cl)
	_pill(cl, Vector2(18, 14), "Day 1  ·  8:00 AM", Color("#1e2622"), Color("#fff6e0"), 17)
	_pill(cl, Vector2(455, 14), "$412.50", Color("#1e2622"), Color("#f5d27a"), 22)
	_pill(cl, Vector2(705, 14), "◆  Order today's stock from Mr. Lin", Color("#3a1f1f"), Color("#fff6e0"), 16)
	_pill(cl, Vector2(18, 552), "E  Talk      Bag  B      Journal  J", Color("#1e2622"), Color("#d9d2c0"), 14)
	cull_label = Label.new()
	cull_label.add_theme_font_override("font", font)
	cull_label.add_theme_font_size_override("font_size", 12)
	cull_label.add_theme_color_override("font_color", Color("#2b2622"))
	cull_label.position = Vector2(800, 577)
	cl.add_child(cull_label)


func _pill(cl: CanvasLayer, pos: Vector2, text: String, bg: Color, fg := Color("#fff6e0"), fs := 20) -> void:
	var p := PanelContainer.new()
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color(bg, 0.9)
	sb.set_corner_radius_all(18)
	sb.content_margin_left = 18; sb.content_margin_right = 18; sb.content_margin_top = 7; sb.content_margin_bottom = 7
	p.add_theme_stylebox_override("panel", sb)
	var l := Label.new()
	l.text = text
	l.add_theme_font_override("font", font)
	l.add_theme_font_size_override("font_size", fs)
	l.add_theme_color_override("font_color", fg)
	p.add_child(l)
	cl.add_child(p)
	var sz := p.get_combined_minimum_size()
	p.position = pos if pos.x >= 0 else Vector2(1366 + pos.x - sz.x, pos.y)


# ── Motion ──
func _walker(n: MeshInstance3D, pts: Array, loop: bool, speed: float, dog: Node3D, orig: Vector3) -> void:
	for k in idlers.size():
		if idlers[k][0] == n:
			idlers.remove_at(k)
			break
	var start := 0
	var best := 1e9
	for k in pts.size():
		var d: float = (pts[k] as Vector3).distance_to(n.position)
		if d < best: best = d; start = k
	n.position = pts[start]
	walkers.append({"node": n, "pts": pts, "i": start, "dir": 1, "speed": speed, "loop": loop, "dog": dog, "orig": orig, "phase": orig.x})


## Where you are, for cars and walkers to wait for you (the walkable version gives it).
func player_pos() -> Variant:
	return null


func _process(dt: float) -> void:
	cull_t -= dt
	if cull_t <= 0.0:
		cull_t = 0.15
		_cull()
	if not animate:
		return
	clock += dt
	var t := clock
	# traffic lights
	phase_t += dt
	if phase_t > PHASES[light_phase]:
		phase_t = 0.0
		light_phase = (light_phase + 1) % 4
		_set_signals()
	for tr in trees_m:   # a gentle breeze
		var n: Node3D = tr[0]
		if not n.visible: continue
		n.rotation.x = 0.018 * sin(t * 0.8 + tr[1]) + 0.008 * sin(t * 2.1 + tr[1] * 2.0)
		n.rotation.z = 0.014 * sin(t * 0.65 + tr[1] * 1.7)
	for sw in swings:
		if not sw[0].visible: continue
		sw[0].rotation.x = sw[2] * sin(t * 2.2 + sw[1])
	for j in jets:
		if not j[0].visible: continue
		j[0].scale = Vector3(1.0, 1.0 + 0.18 * sin(t * 7.0) + 0.08 * sin(t * 13.0), 1.0)
	for c in curtains:
		if not c[0].visible: continue
		var f := 1.0 + 0.015 * sin(t * 9.0 + c[1])
		c[0].scale = Vector3(f, 1.0, f)
		c[0].transparency = 0.6 + 0.1 * sin(t * 5.0 + c[1])
	for r in ripples:
		if not r[0].visible: continue
		var q := fmod(t * 0.35 + r[1], 1.0)
		var sc := lerpf(0.95, 2.1, q)
		r[0].scale = Vector3(sc, 1.0, sc * 0.72)
		r[0].transparency = lerpf(0.35, 1.0, q)
	_move_ducks(dt)
	for idl in idlers:   # breathing, and a slow look around for people standing
		var n: Node3D = idl[0]
		if not n.visible: continue
		n.scale = Vector3(PERSON_SCALE, PERSON_SCALE * (1.0 + 0.012 * sin(t * 2.3 + idl[1])), PERSON_SCALE)
		if not idl[2]:
			n.rotation.y = idl[3] + 0.25 * sin(t * 0.25 + idl[1]) * (1.0 if sin(t * 0.11 + idl[1]) > 0.3 else 0.0)
	_walk_people(dt)
	_drive(dt)


func _walk_people(dt: float) -> void:
	var me = player_pos()
	for w in walkers:
		var n: Node3D = w.node
		var pts: Array = w.pts
		var nxt: int = w.i + w.dir
		if nxt >= pts.size() or nxt < 0:
			if w.loop: nxt = (w.i + w.dir + pts.size()) % pts.size()
			else:
				w.dir = -w.dir
				nxt = w.i + w.dir
		var target: Vector3 = pts[nxt]
		var flat := Vector3(target.x - n.position.x, 0, target.z - n.position.z)
		var step: float = w.speed * dt
		var heading := flat.normalized()
		var wait := false
		if me != null:
			var to_me := Vector3(me.x - n.position.x, 0, me.z - n.position.z)
			if to_me.length() < 0.75 and to_me.dot(heading) > 0.0: wait = true   # let you pass
		if not wait:
			if flat.length() <= step:
				n.position = Vector3(target.x, target.y, target.z)
				w.i = nxt
			else:
				n.position += heading * step
			w.phase += dt * 9.0
		n.position.y = target.y + absf(sin(w.phase)) * 0.035
		if flat.length() > 0.01:
			n.rotation.y = lerp_angle(n.rotation.y, atan2(heading.x, heading.z), minf(1.0, dt * 8.0))
		n.rotation.z = 0.04 * sin(w.phase)   # a little sway with each step
		if w.dog:
			var d: Node3D = w.dog
			var behind := n.position - heading * 0.55 + Vector3(heading.z, 0, -heading.x) * 0.3
			d.position = d.position.lerp(Vector3(behind.x, target.y, behind.z), minf(1.0, dt * 3.0))
			d.rotation.y = n.rotation.y
			d.position.y = target.y + absf(sin(w.phase * 1.6)) * 0.03


## Cars keep to their lane, keep a gap, stop at red lights and for you, and loop round out of sight.
func _drive(dt: float) -> void:
	var me = player_pos()
	for mv in movers:
		var L: Dictionary = LANES[mv.lane]
		var total := absf(float(L.to) - float(L.from))
		var want := 2.8
		# the car ahead in this lane
		for o in movers:
			if o == mv or o.lane != mv.lane: continue
			var gap: float = fposmod(float(o.s) - float(mv.s), total)
			if gap < 4.5:
				want = minf(want, maxf(0.0, gap - 2.4) * 1.1)
		# red light
		var stop_s := (float(L.stop) - float(L.from)) * float(L.dir)
		var to_stop: float = stop_s - float(mv.s)
		if not green(L.road) and to_stop > -0.05 and to_stop < 7.0:
			want = minf(want, maxf(0.0, to_stop) * 0.9)
		# you, standing in the road ahead
		if me != null:
			var along: float = (me.x if L.axis == "x" else me.z)
			var lateral: float = absf((me.z if L.axis == "x" else me.x) - float(L.fixed))
			var ahead: float = (along - (float(L.from) + float(mv.s) * float(L.dir))) * float(L.dir)
			if lateral < 0.9 and ahead > 0.0 and ahead < 4.0:
				want = minf(want, maxf(0.0, ahead - 1.4))
		var rate := 2.2 if want > mv.v else 5.0
		mv.v = move_toward(mv.v, want, rate * dt)
		mv.s = fposmod(float(mv.s) + mv.v * dt, total)
		_place_mover(mv)
		mv.node.position.y = 0.004 * sin(clock * 11.0 + float(mv.s)) * minf(1.0, mv.v)   # a little road hum


## True if a moving car or a walker is at p (radius r). For the walkable version.
func dynamic_blocked(p: Vector3, r: float) -> bool:
	for mv in movers:
		var c: Vector3 = mv.node.position
		var ax: bool = LANES[mv.lane].axis == "x"
		var hx := 0.95 if ax else 0.45
		var hz := 0.45 if ax else 0.95
		if absf(p.x - c.x) < hx + r and absf(p.z - c.z) < hz + r: return true
	for w in walkers:
		var c: Vector3 = w.node.position
		if Vector2(p.x - c.x, p.z - c.z).length() < 0.16 + r: return true
	return false
