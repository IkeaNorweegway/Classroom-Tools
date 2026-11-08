# CEFL Town v2 — 3D drawing. Low-poly, flat-shaded triangles in vertex colours; no art files.
# 1 tile = 1 unit: map tile (x, y) covers world x..x+1, z..z+1 with y up. Doors face +z (south, toward the camera).
#
# A Builder is one piece of the world: a section of a town map, or a room. Fill it with ground_tiles(), building(),
# prop(), draw_extra() or room_shell(), then finish() turns what was drawn into meshes. Pieces that move (tree crowns,
# fountain water) are kept in `trees`, `jets`, `curtains`, `ripples` for the world to animate while they are on screen.
# person_mesh(look) builds a person (shared, cached by look).
extends Node3D

const MapData = preload("res://engine/world/map_data.gd")

const C := {
	"road": Color("#595c66"), "line": Color("#e6dcc4"), "walk": Color("#c4c0b6"), "walk_jt": Color("#b3afa4"), "curb": Color("#9c988e"),
	"grass": Color("#8ba56b"), "grass_dk": Color("#7a965f"), "lawn": Color("#7fa95e"), "hedge": Color("#5f8355"),
	"leaf": Color("#6f9a5c"), "leaf2": Color("#88a865"), "leaf_au": Color("#c99a5e"), "leaf_dk": Color("#557a4e"),
	"trunk": Color("#6b5040"), "wood": Color("#a07650"), "wood_dk": Color("#6e5038"), "floor_wood": Color("#b98d62"),
	"metal": Color("#3b4044"), "metal_lt": Color("#8c9298"), "concrete": Color("#bdb6aa"),
	"glass": Color("#5d7891"), "glass_hi": Color("#8faabd"), "frame": Color("#f1e8d8"),
	"water": Color("#79aab3"), "water_hi": Color("#9cc3c6"), "stone": Color("#cfc6b5"),
	"path": Color("#d9c7a3"), "plaza": Color("#d6ccb8"), "plaza_jt": Color("#c5baa4"), "sand": Color("#e2d2ac"), "soil": Color("#7a5a44"),
	"brick_red": Color("#b8725c"), "brick_orange": Color("#cf9566"), "tile": Color("#e7dfcf"), "tile_jt": Color("#d6ccb8"),
}
## Ground height per kind (people stand on it).
const HEIGHT := {"road": 0.0, "line": 0.0, "cross_h": 0.0, "cross_v": 0.0, "grass": 0.05, "lawn": 0.05, "path": 0.07,
	"walk": 0.14, "plaza": 0.14, "water": -0.25, "wood": 0.0, "tile": 0.0, "carpet": 0.0, "sand": 0.06}
const PERSON_SCALE := 0.9

static var _mats := {}
static var _person_cache := {}

var st: SurfaceTool
var st_main: SurfaceTool
var st_glow: SurfaceTool
var xf := Transform3D.IDENTITY
var _part_keep := []
var font: Font
## How many faces round things get. The mock-up used 2.8; 1.3 keeps a big town light on a Chromebook.
var detail := 1.3
var trees := []       # [node, phase]
var jets := []        # [node, phase]
var curtains := []    # [node, phase]
var ripples := []     # [node, phase]
var labels := []      # Label3D signs (hidden with the section)
var bldgs := []       # { id, nodes: [MeshInstance3D], labels: [Label3D], box: AABB } — each building is its own piece, so it can fade


static func mats() -> Dictionary:
	if _mats.is_empty():
		var m := StandardMaterial3D.new()
		m.vertex_color_use_as_albedo = true
		m.vertex_color_is_srgb = true
		m.roughness = 1.0
		m.metallic_specular = 0.0
		var g := StandardMaterial3D.new()
		g.vertex_color_use_as_albedo = true
		g.vertex_color_is_srgb = true
		g.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
		var w := StandardMaterial3D.new()
		w.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		w.albedo_color = Color(0.78, 0.9, 0.93, 0.55)
		w.vertex_color_use_as_albedo = true
		w.vertex_color_is_srgb = true
		w.roughness = 0.4
		var mf := m.duplicate()            # a building fading out of your way
		mf.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		mf.albedo_color = Color(1, 1, 1, 0.26)
		mf.depth_draw_mode = BaseMaterial3D.DEPTH_DRAW_ALWAYS
		var gf := g.duplicate()
		gf.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		gf.albedo_color = Color(1, 1, 1, 0.26)
		_mats = {"main": m, "glow": g, "water": w, "main_fade": mf, "glow_fade": gf}
	return _mats


func _init() -> void:
	st_main = SurfaceTool.new()
	st_main.begin(Mesh.PRIMITIVE_TRIANGLES)
	st_glow = SurfaceTool.new()
	st_glow.begin(Mesh.PRIMITIVE_TRIANGLES)
	st = st_main


## Turn everything drawn into meshes (one for solid colours, one for lights).
func finish() -> void:
	for pair in [[st_main, mats().main], [st_glow, mats().glow]]:
		var arr: Array = pair[0].commit_to_arrays()
		if arr[Mesh.ARRAY_VERTEX] == null or (arr[Mesh.ARRAY_VERTEX] as PackedVector3Array).is_empty():
			continue
		var mesh := ArrayMesh.new()
		mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arr)
		var mi := MeshInstance3D.new()
		mi.mesh = mesh
		mi.material_override = pair[1]
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
	st.set_color(col)
	st.set_normal(n)
	st.add_vertex(a)
	st.add_vertex(c)
	st.add_vertex(b)


func quad(a: Vector3, b: Vector3, c: Vector3, d: Vector3, col: Color, out := Vector3.ZERO) -> void:
	tri(a, b, c, col, out)
	tri(a, c, d, col, out)


func box(p: Vector3, s: Vector3, col: Color, top := Color(0, 0, 0, 0), bottom := false) -> void:
	var x0 := p.x; var x1 := p.x + s.x; var y0 := p.y; var y1 := p.y + s.y; var z0 := p.z; var z1 := p.z + s.z
	var tc := col if top.a == 0.0 else top
	quad(Vector3(x0, y1, z0), Vector3(x1, y1, z0), Vector3(x1, y1, z1), Vector3(x0, y1, z1), tc, Vector3.UP)
	quad(Vector3(x0, y0, z1), Vector3(x1, y0, z1), Vector3(x1, y1, z1), Vector3(x0, y1, z1), col, Vector3.BACK)
	quad(Vector3(x0, y0, z0), Vector3(x1, y0, z0), Vector3(x1, y1, z0), Vector3(x0, y1, z0), col, Vector3.FORWARD)
	quad(Vector3(x1, y0, z0), Vector3(x1, y0, z1), Vector3(x1, y1, z1), Vector3(x1, y1, z0), col, Vector3.RIGHT)
	quad(Vector3(x0, y0, z0), Vector3(x0, y0, z1), Vector3(x0, y1, z1), Vector3(x0, y1, z0), col, Vector3.LEFT)
	if bottom:
		quad(Vector3(x0, y0, z0), Vector3(x1, y0, z0), Vector3(x1, y0, z1), Vector3(x0, y0, z1), col.darkened(0.3), Vector3.DOWN)


func flat(x0: float, z0: float, x1: float, z1: float, y: float, col: Color) -> void:
	quad(Vector3(x0, y, z0), Vector3(x1, y, z0), Vector3(x1, y, z1), Vector3(x0, y, z1), col, Vector3.UP)


## A jittered low-poly blob (bush, tree crown, head). seg around, rings up.
func blob(c: Vector3, r: Vector3, col: Color, seed_: int, seg := 7, rings := 4, jit := 0.18) -> void:
	seg = maxi(seg, roundi(seg * detail)); rings = maxi(rings, roundi(rings * detail)); jit /= maxf(detail, 1.0)
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
	seg = maxi(3, roundi(seg * detail))
	var rt := r if r_top < 0 else r_top
	for j in seg:
		var u0 := TAU * j / seg; var u1 := TAU * (j + 1) / seg
		var a := base + Vector3(cos(u0) * r, 0, sin(u0) * r); var b := base + Vector3(cos(u1) * r, 0, sin(u1) * r)
		var c := base + Vector3(cos(u1) * rt, h, sin(u1) * rt); var d := base + Vector3(cos(u0) * rt, h, sin(u0) * rt)
		quad(a, b, c, d, col, (a + b) / 2.0 - base)
		if top:
			tri(d, c, base + Vector3(0, h, 0), col.lightened(0.05), Vector3.UP)


func disc(c: Vector3, r: float, col: Color, seg := 12, r_in := 0.0) -> void:
	seg = maxi(4, roundi(seg * detail))
	for j in seg:
		var u0 := TAU * j / seg; var u1 := TAU * (j + 1) / seg
		var a := c + Vector3(cos(u0) * r, 0, sin(u0) * r); var b := c + Vector3(cos(u1) * r, 0, sin(u1) * r)
		if r_in <= 0.0:
			tri(c, a, b, col, Vector3.UP)
		else:
			quad(a, b, c + Vector3(cos(u1) * r_in, 0, sin(u1) * r_in), c + Vector3(cos(u0) * r_in, 0, sin(u0) * r_in), col, Vector3.UP)


static func _h(a: int, b: int) -> float:
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


func part_end(at: Vector3, m: Material = null) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	mi.mesh = st.commit()
	mi.material_override = m if m else mats().main
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	mi.position = at
	add_child(mi)
	var k: Array = _part_keep.pop_back()
	st = k[0]
	xf = k[1]
	return mi


func label3d(text: String, at: Vector3, size := 48, fg := Color("#f5ecd8"), outline := Color(0, 0, 0, 0), px := 0.004, billboard := false) -> Label3D:
	var l := Label3D.new()
	l.text = text
	l.font = font
	l.font_size = size
	l.pixel_size = px
	l.modulate = fg
	l.outline_size = 0 if outline.a == 0.0 else 10
	l.outline_modulate = outline
	l.shaded = false
	l.double_sided = false
	if billboard:
		l.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	l.transform = xf * Transform3D(Basis.IDENTITY, at)
	add_child(l)
	labels.append(l)
	return l


# ── Ground: one tile at a time; a tile's sides show only where its neighbour is lower (curbs, banks) ──
func ground_tiles(m: MapData, r: Rect2i) -> void:
	for y in range(r.position.y, r.end.y):
		for x in range(r.position.x, r.end.x):
			if x < 0 or y < 0 or x >= m.w or y >= m.h:
				continue
			_tile(m, x, y)


func _hgt(m: MapData, x: int, y: int) -> float:
	if x < 0 or y < 0 or x >= m.w or y >= m.h:
		return HEIGHT.get("grass", 0.05) if m.outdoor else 0.0
	return HEIGHT.get(m.ground[y * m.w + x], 0.05)


func _tile(m: MapData, x: int, y: int) -> void:
	var k: String = m.ground[y * m.w + x]
	var h: float = HEIGHT.get(k, 0.05)
	var x0 := float(x); var z0 := float(y); var x1 := x0 + 1.0; var z1 := z0 + 1.0
	var n := _h(x, y)
	var col: Color
	match k:
		"grass": col = C.grass.lerp(C.grass_dk, 0.5 if n < 0.25 else 0.0).lightened(0.03 if n > 0.85 else 0.0)
		"lawn": col = C.lawn if (x + y) % 2 == 0 else C.lawn.darkened(0.05)
		"walk": col = C.walk
		"plaza": col = C.plaza
		"path": col = C.path.darkened(0.04 * n)
		"water": col = C.water
		"sand": col = C.sand
		"wood": col = C.floor_wood.darkened(0.05 * float(y % 2))
		"tile", "carpet": col = C.tile
		_: col = C.road
	if k == "water":
		flat(x0, z0, x1, z1, -0.12, C.water.lerp(C.water_hi, 0.25 * n))
		flat(x0, z0, x1, z1, h, C.soil)
	else:
		flat(x0, z0, x1, z1, h, col)
	# sides where the neighbour is lower
	var side := C.curb if k in ["walk", "plaza"] else col.darkened(0.25)
	for d in [[0, -1], [0, 1], [-1, 0], [1, 0]]:
		var nh := _hgt(m, x + d[0], y + d[1])
		var top := h if k != "water" else -0.12
		if nh >= top - 0.001:
			continue
		var bot := nh
		match d:
			[0, -1]: quad(Vector3(x0, bot, z0), Vector3(x1, bot, z0), Vector3(x1, top, z0), Vector3(x0, top, z0), side, Vector3.FORWARD)
			[0, 1]: quad(Vector3(x0, bot, z1), Vector3(x1, bot, z1), Vector3(x1, top, z1), Vector3(x0, top, z1), side, Vector3.BACK)
			[-1, 0]: quad(Vector3(x0, bot, z0), Vector3(x0, bot, z1), Vector3(x0, top, z1), Vector3(x0, top, z0), side, Vector3.LEFT)
			[1, 0]: quad(Vector3(x1, bot, z0), Vector3(x1, bot, z1), Vector3(x1, top, z1), Vector3(x1, top, z0), side, Vector3.RIGHT)
	# markings and joints
	match k:
		"walk":
			flat(x0 - 0.012, z0 + 0.02, x0 + 0.012, z1 - 0.02, h + 0.002, C.walk_jt)
		"plaza":
			flat(x0 - 0.01, z0, x0 + 0.01, z1, h + 0.002, C.plaza_jt)
			flat(x0, z0 - 0.01, x1, z0 + 0.01, h + 0.002, C.plaza_jt)
		"tile":
			flat(x0 - 0.01, z0, x0 + 0.01, z1, h + 0.002, C.tile_jt)
			flat(x0, z0 - 0.01, x1, z0 + 0.01, h + 0.002, C.tile_jt)
		"line":
			if x % 2 == 0:
				flat(x0 + 0.15, z0 + 0.46, x1 - 0.15, z0 + 0.54, 0.01, C.line)
		"cross_h":   # stripes across the road, running along z
			for i in 2:
				flat(x0 + 0.12 + i * 0.5, z0 + 0.05, x0 + 0.34 + i * 0.5, z1 - 0.05, 0.01, C.line)
		"cross_v":
			for i in 2:
				flat(x0 + 0.05, z0 + 0.12 + i * 0.5, x1 - 0.05, z0 + 0.34 + i * 0.5, 0.01, C.line)
		"path":
			if n > 0.6:
				blob(Vector3(x0 + 0.2 + 0.6 * _h(x, y + 7), h, z0 + 0.2 + 0.6 * _h(x + 3, y)), Vector3(0.07, 0.03, 0.06), C.stone.darkened(0.15), x * 7 + y, 5, 2, 0.2)
	if m.outdoor and k == "road" and m.road_lines.has(y) and x % 2 == 0:
		flat(x0 + 0.15, z1 - 0.04, x1 - 0.15, z1 + 0.04, 0.01, C.line)
	if k == "grass" and n > 0.93:   # a tuft
		for i in 3:
			var tx := x0 + 0.3 + 0.12 * i; var tz := z0 + 0.4 + 0.1 * float(i % 2)
			tri(Vector3(tx - 0.03, h, tz), Vector3(tx + 0.03, h, tz), Vector3(tx + 0.01, h + 0.16, tz + 0.02), C.grass_dk.darkened(0.1), Vector3.BACK)


# ── Buildings: built facing +z in their own frame from (x, y) of the footprint ──
## b: { x, y, w, h, door (map column), sign, style, brick, floors?, wall?, roof?, awning?, emblem? }
func building(b: Dictionary) -> void:
	var keep_main := st_main; var keep_glow := st_glow
	st_main = SurfaceTool.new(); st_main.begin(Mesh.PRIMITIVE_TRIANGLES)
	st_glow = SurfaceTool.new(); st_glow.begin(Mesh.PRIMITIVE_TRIANGLES)
	st = st_main
	var l0 := labels.size()
	_building_body(b)
	var nodes := []
	var box_ := AABB()
	for pair in [[st_main, mats().main], [st_glow, mats().glow]]:
		var arr: Array = pair[0].commit_to_arrays()
		if arr[Mesh.ARRAY_VERTEX] == null or (arr[Mesh.ARRAY_VERTEX] as PackedVector3Array).is_empty():
			continue
		var mesh := ArrayMesh.new()
		mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arr)
		var mi := MeshInstance3D.new()
		mi.mesh = mesh
		mi.material_override = pair[1]
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		add_child(mi)
		nodes.append(mi)
		box_ = mesh.get_aabb() if nodes.size() == 1 else box_.merge(mesh.get_aabb())
	bldgs.append({"id": b.get("id", ""), "nodes": nodes, "mats": [mats().main, mats().glow].slice(0, nodes.size()), "labels": labels.slice(l0), "box": box_, "faded": false})
	st_main = keep_main; st_glow = keep_glow; st = st_main


func _building_body(b: Dictionary) -> void:
	var W := float(b.w); var D := float(b.h)
	xf = Transform3D(Basis.IDENTITY, Vector3(float(b.x), 0, float(b.y)))
	var door := float(b.get("door", int(b.x) + int(b.w) / 2)) - float(b.x) + 0.5
	var style: String = b.get("style", "shop")
	var H: float = b.get("height", _height(b))
	match style:
		"civic": _b_civic(W, D, H, door, b, false)
		"campus": _b_civic(W, D, H, door, b, true)
		"glass": _b_glass(W, D, H, door, b)
		"industry": _b_industry(W, D, H, door, b)
		"house": _b_house(W, D, H, door, b)
		_: _b_shop(W, D, H, door, b)
	xf = Transform3D.IDENTITY


static func _height(b: Dictionary) -> float:
	var f := float(b.get("floors", 0))
	if f <= 0.0:
		f = clampf(float(b.h) * 0.45, 1.5, 4.0)
	return 0.6 + f * 1.15


func _brick(b: Dictionary) -> Color:
	if b.has("wall"):
		return Color(b.wall)
	return C.brick_orange if b.get("brick", "red") == "orange" else C.brick_red


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


func win(cx: float, y: float, w: float, h: float, zf: float, frame: Color, glass: Color = C.glass, sill := true) -> void:
	quad(Vector3(cx - w / 2 - 0.06, y - 0.06, zf + 0.01), Vector3(cx + w / 2 + 0.06, y - 0.06, zf + 0.01), Vector3(cx + w / 2 + 0.06, y + h + 0.06, zf + 0.01), Vector3(cx - w / 2 - 0.06, y + h + 0.06, zf + 0.01), frame, Vector3.BACK)
	quad(Vector3(cx - w / 2, y, zf + 0.02), Vector3(cx + w / 2, y, zf + 0.02), Vector3(cx + w / 2, y + h, zf + 0.02), Vector3(cx - w / 2, y + h, zf + 0.02), glass, Vector3.BACK)
	tri(Vector3(cx - w / 2, y + h * 0.45, zf + 0.025), Vector3(cx - w / 2, y + h, zf + 0.025), Vector3(cx - w / 2 + w * 0.45, y + h, zf + 0.025), glass.lerp(C.glass_hi, 0.6), Vector3.BACK)
	if sill:
		box(Vector3(cx - w / 2 - 0.09, y - 0.1, zf), Vector3(w + 0.18, 0.06, 0.09), frame.darkened(0.08))


func win_side(cz: float, y: float, w: float, h: float, xs: float, frame: Color, glass: Color = C.glass) -> void:
	quad(Vector3(xs - 0.01, y - 0.06, cz - w / 2 - 0.06), Vector3(xs - 0.01, y - 0.06, cz + w / 2 + 0.06), Vector3(xs - 0.01, y + h + 0.06, cz + w / 2 + 0.06), Vector3(xs - 0.01, y + h + 0.06, cz - w / 2 - 0.06), frame, Vector3.LEFT)
	quad(Vector3(xs - 0.02, y, cz - w / 2), Vector3(xs - 0.02, y, cz + w / 2), Vector3(xs - 0.02, y + h, cz + w / 2), Vector3(xs - 0.02, y + h, cz - w / 2), glass, Vector3.LEFT)


func door_at(cx: float, zf: float, col: Color, w := 0.62, h := 1.25, frame: Color = C.frame) -> void:
	box(Vector3(cx - w / 2 - 0.07, 0.3, zf - 0.02), Vector3(w + 0.14, h + 0.08, 0.06), frame)
	box(Vector3(cx - w / 2, 0.3, zf), Vector3(w, h, 0.07), col)
	quad(Vector3(cx - w / 2 + 0.1, 0.3 + h * 0.5, zf + 0.075), Vector3(cx + w / 2 - 0.1, 0.3 + h * 0.5, zf + 0.075), Vector3(cx + w / 2 - 0.1, 0.3 + h - 0.1, zf + 0.075), Vector3(cx - w / 2 + 0.1, 0.3 + h - 0.1, zf + 0.075), C.glass, Vector3.BACK)
	box(Vector3(cx + w / 2 - 0.13, 0.3 + h * 0.45, zf + 0.07), Vector3(0.05, 0.05, 0.05), Color("#d9b860"))
	box(Vector3(cx - w / 2 - 0.1, 0.0, zf), Vector3(w + 0.2, 0.3, 0.35), C.stone.darkened(0.05))   # doorstep


func awning(x0: float, x1: float, y: float, zf: float, col: Color, depth := 0.7, stripes := true) -> void:
	var n := maxi(1, int((x1 - x0) / 0.33))
	for i in n:
		var c := col if (i % 2 == 0 or not stripes) else Color("#efe6d4")
		var ax := x0 + (x1 - x0) * i / n; var bx := x0 + (x1 - x0) * (i + 1) / n
		quad(Vector3(ax, y, zf), Vector3(bx, y, zf), Vector3(bx, y - 0.32, zf + depth), Vector3(ax, y - 0.32, zf + depth), c, Vector3(0, 1, 1))
		quad(Vector3(ax, y - 0.32, zf + depth), Vector3(bx, y - 0.32, zf + depth), Vector3(bx, y - 0.48, zf + depth), Vector3(ax, y - 0.48, zf + depth), c.darkened(0.1), Vector3.BACK)
	tri(Vector3(x0, y, zf), Vector3(x0, y - 0.32, zf + depth), Vector3(x0, y - 0.48, zf + depth), col.darkened(0.15), Vector3.LEFT)
	tri(Vector3(x1, y, zf), Vector3(x1, y - 0.32, zf + depth), Vector3(x1, y - 0.48, zf + depth), col.darkened(0.15), Vector3.RIGHT)


func sign_board(cx: float, y: float, w: float, h: float, zf: float, bg: Color, text: String, fg := Color("#f5ecd8"), fs := 64) -> void:
	box(Vector3(cx - w / 2, y, zf), Vector3(w, h, 0.07), bg)
	box(Vector3(cx - w / 2 - 0.03, y - 0.03, zf - 0.01), Vector3(w + 0.06, h + 0.06, 0.06), bg.darkened(0.3))
	if text != "":
		var l := label3d(text, Vector3(cx, y + h / 2, zf + 0.08), fs, fg)
		l.pixel_size = 0.0042
		l.width = w / 0.0042 * 0.95
		l.autowrap_mode = TextServer.AUTOWRAP_OFF


func ac_unit(p: Vector3) -> void:
	box(p, Vector3(0.7, 0.45, 0.55), C.metal_lt, C.metal_lt.lightened(0.1))
	cyl(p + Vector3(0.35, 0.45, 0.28), 0.18, 0.02, C.metal, 8)


func _roof_bits(W: float, D: float, H: float, k: int) -> void:
	if W >= 4.0:
		ac_unit(Vector3(W * 0.2, H, D * 0.3))
	if W >= 7.0:
		ac_unit(Vector3(W * 0.62, H, D * 0.22))
	box(Vector3(W * 0.15 + 0.2 * float(k % 3), H, D * 0.6), Vector3(0.55, 0.25, 0.55), Color("#9aa0a4"))   # roof hatch
	cyl(Vector3(W * 0.78, H, D * 0.55), 0.08, 0.45, C.metal_lt, 5)


## Windows across a face, skipping the door and the sign.
func _window_rows(W: float, zf: float, y0: float, H: float, frame: Color, door: float, tall := false, step := 1.6) -> void:
	var n := maxi(1, int((W - 0.6) / step))
	var gap := (W - 0.6) / n
	var y := y0
	var fh := 1.15
	while y + (1.6 if tall else 0.8) < H - 0.35:
		for i in n:
			var cx := 0.3 + gap * (i + 0.5)
			if y < 1.8 and absf(cx - door) < 0.75:
				continue
			win(cx, y, minf(0.7, gap * 0.55), 1.5 if tall else 0.75, zf, frame)
		y += 2.3 if tall else fh


func _emblem(kind: String, cx: float, y: float, zf: float) -> void:
	match kind:
		"clock":   # a round face on the pediment, hands at ten past ten
			var seg := 16
			for j in seg:
				var u0 := TAU * j / seg; var u1 := TAU * (j + 1) / seg
				tri(Vector3(cx, y, zf), Vector3(cx + cos(u0) * 0.42, y + sin(u0) * 0.42, zf), Vector3(cx + cos(u1) * 0.42, y + sin(u1) * 0.42, zf), Color("#f3ead9"), Vector3.BACK)
				tri(Vector3(cx + cos(u0) * 0.42, y + sin(u0) * 0.42, zf - 0.01), Vector3(cx + cos(u0) * 0.48, y + sin(u0) * 0.48, zf - 0.01), Vector3(cx + cos(u1) * 0.48, y + sin(u1) * 0.48, zf - 0.01), Color("#b08a3e"), Vector3.BACK)
			box(Vector3(cx - 0.02, y, zf + 0.005), Vector3(0.04, 0.3, 0.02), Color("#2b2622"))
			box(Vector3(cx - 0.02, y - 0.02, zf + 0.005), Vector3(0.22, 0.04, 0.02), Color("#2b2622"))
		"cross":
			box(Vector3(cx - 0.12, y - 0.35, zf), Vector3(0.24, 0.7, 0.06), Color("#d9534a"))
			box(Vector3(cx - 0.35, y - 0.12, zf), Vector3(0.7, 0.24, 0.06), Color("#d9534a"))
		"coin":
			glow_on()
			box(Vector3(cx - 0.28, y - 0.28, zf), Vector3(0.56, 0.56, 0.05), Color("#e8c25a"))
			glow_off()


## Civic and campus: a stone or brick hall with a portico of columns round the door and a pediment.
func _b_civic(W: float, D: float, H: float, door: float, b: Dictionary, campus: bool) -> void:
	var wall := _brick(b) if campus or b.get("brick", "") == "red" else C.stone
	if not campus and b.get("brick", "") == "orange":
		wall = Color("#d8c3a0")
	var trim := Color("#ece4d4")
	H = maxf(H, 3.6)
	var zf := D - 0.9
	_shell(W, zf, H, wall, trim, Color("#9a9286"))
	_window_rows(W, zf, 0.8, H, trim, door, true, 1.4)
	# portico
	var pw := clampf(W * 0.45, 2.4, 6.0)
	var px0 := clampf(door - pw / 2, 0.3, W - pw - 0.3)
	for i in 3:
		box(Vector3(px0 - 0.2, 0, zf + 0.9 - 0.3 * (i + 1)), Vector3(pw + 0.4, 0.1 * (i + 1), 0.3), C.stone.darkened(0.04 * i))
	var cols := maxi(3, int(pw / 0.9) + 1)
	for i in cols:
		var cx := px0 + 0.25 + i * (pw - 0.5) / (cols - 1)
		if absf(cx - door) < 0.3:
			continue
		cyl(Vector3(cx, 0.3, zf + 0.55), 0.14, 2.5, trim, 7, 0.12)
	var ey := 2.8
	box(Vector3(px0 - 0.1, ey, zf - 0.02), Vector3(pw + 0.2, 0.45, 0.85), trim, trim.lightened(0.03))
	var pz := zf + 0.83
	tri(Vector3(px0 - 0.1, ey + 0.45, pz), Vector3(px0 + pw + 0.1, ey + 0.45, pz), Vector3(px0 + pw / 2, ey + 1.15, pz), trim, Vector3.BACK)
	quad(Vector3(px0 - 0.1, ey + 0.45, pz), Vector3(px0 + pw / 2, ey + 1.15, pz), Vector3(px0 + pw / 2, ey + 1.15, zf), Vector3(px0 - 0.1, ey + 0.45, zf), Color("#9a8f80"), Vector3(-1, 1.2, 0))
	quad(Vector3(px0 + pw + 0.1, ey + 0.45, pz), Vector3(px0 + pw / 2, ey + 1.15, pz), Vector3(px0 + pw / 2, ey + 1.15, zf), Vector3(px0 + pw + 0.1, ey + 0.45, zf), Color("#8f8576"), Vector3(1, 1.2, 0))
	sign_board(px0 + pw / 2, ey + 0.05, minf(pw - 0.2, 3.4), 0.36, pz, trim, b.get("sign", ""), Color("#4a453f"), 52)
	door_at(door, zf, Color("#6e4d36"), 0.85, 1.6, trim)
	if b.has("emblem"):
		_emblem(str(b.emblem), px0 + pw / 2, ey + 0.75, pz + 0.02)
	for i in int(D / 1.6):
		win_side(0.9 + i * 1.6, 1.0, 0.6, 1.4, 0.04, trim)
	if campus:   # a bell tower with a pointed roof
		var tx := W * 0.5 - 0.7
		box(Vector3(tx, H, zf * 0.35), Vector3(1.4, 1.6, 1.4), wall, trim)
		win(tx + 0.7, H + 0.5, 0.5, 0.8, zf * 0.35 + 1.4, trim)
		cone(Vector3(tx + 0.7, H + 1.6, zf * 0.35 + 0.7), 1.05, 1.3, Color("#5f6b74"), 4, false)
	else:
		box(Vector3(W * 0.3, H, zf * 0.3), Vector3(W * 0.4, 0.4, zf * 0.35), trim.darkened(0.05), C.glass_hi)   # skylight
	_roof_bits(W, zf, H, int(W))


## Glass: a curtain wall with floor bands and a lobby canopy.
func _b_glass(W: float, D: float, H: float, door: float, b: Dictionary) -> void:
	var frame := Color("#d3d8dc"); var glass := Color("#6f8ba2"); var span := Color("#a9b6c0")
	H += 0.8
	var base := _brick(b)
	box(Vector3(0, 0, 0), Vector3(W, 0.3, D), Color("#8f969c"))
	box(Vector3(0.05, 0.3, 0.05), Vector3(W - 0.1, H - 0.3, D - 0.1), glass)
	box(Vector3(0.03, 0.3, D - 0.1), Vector3(0.35, H - 0.3, 0.1), base)            # brick end piers
	box(Vector3(W - 0.38, 0.3, D - 0.1), Vector3(0.35, H - 0.3, 0.1), base)
	var y := 1.9
	while y < H - 0.3:
		box(Vector3(0.0, y, D - 0.08), Vector3(W, 0.2, 0.1), span)
		box(Vector3(0.0, y, 0.05), Vector3(0.08, 0.2, D - 0.1), span)
		y += 1.25
	var n := maxi(2, int(W / 1.2))
	for i in n + 1:
		box(Vector3(0.4 + i * (W - 0.86) / n, 0.3, D - 0.06), Vector3(0.06, H - 0.3, 0.08), frame)
	for k in int(H / 3.0):
		var y0 := 2.2 + k * 2.6
		tri(Vector3(0.5, y0, D - 0.03), Vector3(0.5, y0 + 1.8, D - 0.03), Vector3(2.0, y0 + 1.8, D - 0.03), glass.lerp(C.glass_hi, 0.45), Vector3.BACK)
	box(Vector3(-0.08, H - 0.1, -0.08), Vector3(W + 0.16, 0.3, D + 0.16), frame)
	door_at(door, D, Color("#33404b"), 0.9, 1.4, frame)
	box(Vector3(door - 1.1, 1.85, D - 0.05), Vector3(2.2, 0.1, 0.9), frame)
	sign_board(door, 2.05, minf(W - 0.8, 3.6), 0.4, D - 0.06, Color("#3b4954"), b.get("sign", ""), Color("#e8edf0"), 50)
	if b.has("emblem"):
		_emblem(str(b.emblem), door, H - 0.8, D + 0.02)
	box(Vector3(W * 0.25, H + 0.2, D * 0.25), Vector3(W * 0.3, 0.8, D * 0.35), span.darkened(0.1))


## Shop: brick with a painted shopfront, big windows, a striped awning and upper windows.
func _b_shop(W: float, D: float, H: float, door: float, b: Dictionary) -> void:
	var wall := _brick(b); var trim := Color("#efe5d4")
	H = maxf(H, 2.9)
	var hue: float = _h(str(b.get("id", "")).hash(), 3)
	var front := Color(b.get("front", Color.from_hsv(hue, 0.35, 0.38).to_html(false)))
	var aw := Color(b.awning) if b.has("awning") else Color.from_hsv(fmod(hue + 0.08, 1.0), 0.48, 0.72)
	var roof := Color(b.roof) if b.has("roof") else Color("#8f857c")
	_shell(W, D, H, wall, trim, roof)
	box(Vector3(0.04, 0.3, D - 0.04), Vector3(W - 0.08, 1.7, 0.03), front)
	var spaces := []
	if door - 0.5 > 1.1: spaces.append([0.35, door - 0.5])
	if W - (door + 0.5) > 1.1: spaces.append([door + 0.5, W - 0.35])
	for s in spaces:
		win((s[0] + s[1]) / 2.0, 0.6, s[1] - s[0] - 0.25, 1.2, D - 0.01, Color("#d8c9a6"), Color("#6b5a49"), false)
	door_at(door, D - 0.01, front.darkened(0.2), 0.7, 1.4, Color("#d8c9a6"))
	awning(0.12, W - 0.12, 2.4, D, aw, 0.5, b.get("stripes", true))
	sign_board(W / 2, 2.5, minf(W - 0.5, 3.4), 0.46, D, front.darkened(0.15), b.get("sign", ""), Color("#f3e3c0"), 60)
	if H > 3.4:
		_window_rows(W, D, 3.15, H, trim, -10.0, false, 1.4)
	if b.get("lanterns", true):
		glow_on()
		box(Vector3(door - 0.62, 1.4, D + 0.06), Vector3(0.12, 0.16, 0.1), Color("#ffd99a"))
		box(Vector3(door + 0.5, 1.4, D + 0.06), Vector3(0.12, 0.16, 0.1), Color("#ffd99a"))
		glow_off()
	for i in int(D / 1.8):
		win_side(1.0 + i * 1.8, 1.0, 0.6, 0.9, 0.04, trim)
	_roof_bits(W, D, H, int(W * 3.0))


## Industry: brick base, corrugated tin, a sawtooth roof, a roll-up door and a loading dock.
func _b_industry(W: float, D: float, H: float, door: float, b: Dictionary) -> void:
	H = maxf(H, 3.4)
	var brick := _brick(b).darkened(0.08); var tin := Color("#b8b2a6"); var trim := Color("#d9d3c7")
	box(Vector3(0, 0, 0), Vector3(W, 0.3, D), Color("#8c857a"))
	box(Vector3(0.04, 0.3, 0.04), Vector3(W - 0.08, 1.2, D - 0.08), brick)
	box(Vector3(0.06, 1.5, 0.06), Vector3(W - 0.12, H - 1.5, D - 0.12), tin)
	var x := 0.2
	while x < W - 0.1:
		quad(Vector3(x, 1.5, D - 0.055), Vector3(x + 0.07, 1.5, D - 0.055), Vector3(x + 0.07, H, D - 0.055), Vector3(x, H, D - 0.055), tin.darkened(0.08), Vector3.BACK)
		x += 0.32
	box(Vector3(-0.04, 1.45, -0.04), Vector3(W + 0.08, 0.1, D + 0.08), trim)
	var teeth := maxi(1, int(W / 3.0))
	for i in teeth:
		var x0 := W * i / teeth; var x1 := W * (i + 1) / teeth
		var top := H + 0.8
		quad(Vector3(x0 + 0.06, H, D - 0.06), Vector3(x1 - 0.06, H, D - 0.06), Vector3(x1 - 0.06, top, 0.06), Vector3(x0 + 0.06, top, 0.06), Color("#8d8f93"), Vector3(0, 1, 1))
		quad(Vector3(x0 + 0.06, H, 0.06), Vector3(x1 - 0.06, H, 0.06), Vector3(x1 - 0.06, top, 0.06), Vector3(x0 + 0.06, top, 0.06), C.glass, Vector3.FORWARD)
		tri(Vector3(x0 + 0.06, H, 0.06), Vector3(x0 + 0.06, H, D - 0.06), Vector3(x0 + 0.06, top, 0.06), tin.darkened(0.05), Vector3.LEFT)
		tri(Vector3(x1 - 0.06, H, 0.06), Vector3(x1 - 0.06, H, D - 0.06), Vector3(x1 - 0.06, top, 0.06), tin.darkened(0.05), Vector3.RIGHT)
	var n := int((W - 1.0) / 1.1)
	for i in n:
		win(0.9 + i * 1.1, H - 1.2, 0.7, 0.5, D - 0.06, trim, C.glass, false)
	# a roll-up door beside the office door, when there is room
	var rx := door + 1.0 if door + 3.2 < W else door - 3.0
	if rx > 0.2 and W >= 6.0:
		box(Vector3(rx - 0.1, 0.3, D - 0.05), Vector3(2.0, 1.85, 0.07), Color("#6f7378"))
		var yy := 0.35
		while yy < 2.1:
			box(Vector3(rx - 0.02, yy, D), Vector3(1.84, 0.1, 0.05), Color("#c9ccc8"))
			yy += 0.15
		box(Vector3(rx - 0.1, 2.2, D - 0.05), Vector3(2.0, 0.05, 0.05), Color("#d9b44a"))
	door_at(door, D - 0.06, Color("#3f5d70"), 0.62, 1.3, trim)
	box(Vector3(door - 0.55, 1.62, D - 0.06), Vector3(1.1, 0.06, 0.45), C.metal)
	sign_board(W / 2, H - 0.55 if H < 3.9 else 2.75, minf(W - 0.6, 4.4), 0.5, D - 0.06, Color("#2f4350"), b.get("sign", ""), Color("#f2e6c8"), 64)


## House: walls, a pitched roof with a chimney, a porch light and steps.
func _b_house(W: float, D: float, H: float, door: float, b: Dictionary) -> void:
	var wall := Color(b.get("wall", "#e8d5bf" if b.get("brick", "") == "orange" else "#dfc9c0"))
	var trim := Color("#f4efe4")
	var roof := Color(b.get("roof", "#7a4f45" if b.get("brick", "") == "red" else "#6a6f78"))
	H = 2.4
	box(Vector3(0, 0, 0), Vector3(W, 0.3, D), wall.darkened(0.25))
	box(Vector3(0.04, 0.3, 0.04), Vector3(W - 0.08, H - 0.3, D - 0.08), wall)
	# pitched roof, ridge along x
	var rh := minf(1.6, D * 0.45)
	var o := 0.25
	quad(Vector3(-o, H, D + o), Vector3(W + o, H, D + o), Vector3(W + o, H + rh, D / 2), Vector3(-o, H + rh, D / 2), roof, Vector3(0, 1, 1))
	quad(Vector3(-o, H, -o), Vector3(W + o, H, -o), Vector3(W + o, H + rh, D / 2), Vector3(-o, H + rh, D / 2), roof.darkened(0.1), Vector3(0, 1, -1))
	tri(Vector3(0.04, H, 0.04), Vector3(0.04, H, D - 0.04), Vector3(0.04, H + rh - 0.05, D / 2), wall.darkened(0.05), Vector3.LEFT)
	tri(Vector3(W - 0.04, H, 0.04), Vector3(W - 0.04, H, D - 0.04), Vector3(W - 0.04, H + rh - 0.05, D / 2), wall.darkened(0.05), Vector3.RIGHT)
	box(Vector3(W * 0.72, H + rh * 0.4, D * 0.3), Vector3(0.45, rh * 0.9, 0.45), Color("#9b6a5a"))
	door_at(door, D - 0.04, Color("#5d4a6e") if b.get("brick", "") == "orange" else Color("#3f6b5e"), 0.62, 1.3, trim)
	for i in 3:
		box(Vector3(door - 0.5, 0.0, D + 0.6 - i * 0.22), Vector3(1.0, 0.1 + i * 0.08, 0.22), C.stone.darkened(0.04 * i))
	for side in [-1.0, 1.0]:
		var cx: float = door + side * 1.5
		if cx > 0.6 and cx < W - 0.6:
			win(cx, 0.9, 0.8, 0.9, D - 0.04, trim)
			box(Vector3(cx - 0.45, 0.72, D - 0.04), Vector3(0.9, 0.14, 0.18), C.wood_dk)   # flower box
			for j in 3:
				blob(Vector3(cx - 0.3 + j * 0.3, 0.92, D + 0.05), Vector3(0.11, 0.09, 0.09), [Color("#d98a8a"), C.leaf2, Color("#e8c86a")][j], j + int(cx * 7.0), 5, 2, 0.1)
	glow_on()
	box(Vector3(door + 0.42, 1.45, D), Vector3(0.1, 0.16, 0.1), Color("#ffd99a"))
	glow_off()
	for i in int(D / 2.0):
		win_side(1.0 + i * 2.0, 1.0, 0.6, 0.8, 0.04, trim)


# ── Things on the map ──
## p: { k, x, y, w?, h?, ... } in tiles. The thing sits on its footprint, on the ground there.
func prop(p: Dictionary, ground_h := 0.0) -> void:
	var w := float(p.get("w", 1)); var d := float(p.get("h", 1))
	var c := Vector3(float(p.x) + w / 2.0, ground_h, float(p.y) + d / 2.0)
	var k := int(p.x) * 31 + int(p.y) * 17
	match str(p.k):
		"tree": _tree(c, k, int(p.get("v", k)))
		"big_tree": _big_tree(c, k)
		"pine": _pine(c, k)
		"bush":
			blob(c + Vector3(0, 0.28, 0), Vector3(0.42, 0.32, 0.38), C.leaf_dk, k, 7, 3, 0.18)
		"hedge":
			box(c + Vector3(-w / 2 + 0.05, 0, -0.3), Vector3(w - 0.1, 0.55, 0.6), C.hedge, C.hedge.lightened(0.06))
		"flowers":
			for i in 5:
				var fx := c.x - 0.35 + 0.18 * i; var fz := c.z - 0.2 + 0.3 * _h(k, i)
				cyl(Vector3(fx, c.y, fz), 0.015, 0.22, C.leaf_dk, 3)
				blob(Vector3(fx, c.y + 0.25, fz), Vector3(0.07, 0.05, 0.07), [Color("#d98a8a"), Color("#e8c86a"), Color("#c9a6d0"), Color("#f0e6d6")][(i + k) % 4], k + i, 5, 2, 0.1)
		"planter":
			box(c + Vector3(-0.38, 0, -0.38), Vector3(0.76, 0.42, 0.76), C.concrete, C.soil)
			blob(c + Vector3(0, 0.7, 0), Vector3(0.4, 0.32, 0.4), C.leaf2, k, 7, 3, 0.18)
		"plant":
			cyl(c, 0.17, 0.32, Color("#b0684f"), 7, 0.21)
			blob(c + Vector3(0, 0.62, 0), Vector3(0.24, 0.32, 0.24), C.leaf, k, 6, 3, 0.25)
		"lamp": _lamp(c, Vector3.BACK if int(p.get("face", 1)) > 0 else Vector3.FORWARD)
		"bench": _bench(c, float(p.get("yaw", 0.0)))
		"bench_metal": _bench(c, float(p.get("yaw", 0.0)), true)
		"bin": _bin(c)
		"mailbox":
			box(c + Vector3(-0.22, 0, -0.18), Vector3(0.44, 0.75, 0.36), Color("#c0463c"), Color("#d05a4f"))
			box(c + Vector3(-0.15, 0.55, 0.18), Vector3(0.3, 0.05, 0.02), Color("#2b2622"))
		"hydrant": _hydrant(c)
		"cone":
			cone(c, 0.18, 0.55, Color("#e8823a"), 6)
			cyl(c + Vector3(0, 0.22, 0), 0.115, 0.08, Color("#f3efe6"), 6, 0.1, false)
			box(c + Vector3(-0.22, 0, -0.22), Vector3(0.44, 0.04, 0.44), Color("#e8823a"))
		"barrier":
			for sx in [-0.4, 0.36]:
				box(c + Vector3(sx, 0, -0.05), Vector3(0.06, 0.65, 0.1), C.metal)
			for i in 4:
				box(c + Vector3(-0.45 + i * 0.225, 0.4, -0.04), Vector3(0.225, 0.2, 0.08), Color("#e8823a") if i % 2 == 0 else Color("#f3efe6"))
		"fence":
			box(c + Vector3(-0.5, 0.35, -0.04), Vector3(1.0, 0.06, 0.06), C.wood)
			box(c + Vector3(-0.5, 0.6, -0.04), Vector3(1.0, 0.06, 0.06), C.wood)
			box(c + Vector3(-0.05, 0, -0.05), Vector3(0.1, 0.8, 0.1), C.wood_dk)
		"sign", "street_sign": _street_sign(c, str(p.get("title", "")))
		"bus_stop": _bus_stop(c)
		"crate", "box":
			box(c + Vector3(-0.32, 0, -0.3), Vector3(0.64, 0.5, 0.6), Color("#c8a77a"), Color("#d4b68c"))
			box(c + Vector3(-0.32, 0.22, 0.3), Vector3(0.64, 0.06, 0.01), Color("#a8875c"))
		"produce":
			box(c + Vector3(-0.42, 0, -0.32), Vector3(0.84, 0.5, 0.64), C.wood)
			var fr: Color = [Color("#c9675a"), Color("#d9a24e"), Color("#9bb35c"), Color("#e0c45a")][k % 4]
			for q in 6:
				blob(c + Vector3(-0.28 + (q % 3) * 0.28, 0.58, -0.15 + (q / 3) * 0.3), Vector3(0.1, 0.08, 0.1), fr, k + q, 5, 2, 0.1)
		"pallet":
			box(c + Vector3(-0.42, 0, -0.42), Vector3(0.84, 0.12, 0.84), C.wood)
			box(c + Vector3(-0.36, 0.12, -0.36), Vector3(0.72, 0.42, 0.72), Color("#c8a77a"))
		"stall": _stall(c, w, Color(p.get("color", "#4caf7a")))
		"fountain": _fountain(c, ground_h)
		"table":
			box(c + Vector3(-0.42, 0.62, -0.42), Vector3(0.84, 0.06, 0.84), C.wood)
			cyl(c, 0.05, 0.62, C.metal, 5)
		"desk":
			box(c + Vector3(-w / 2 + 0.05, 0.62, -0.38), Vector3(w - 0.1, 0.07, 0.76), C.wood)
			box(c + Vector3(-w / 2 + 0.08, 0, -0.34), Vector3(0.06, 0.62, 0.68), C.wood_dk)
			box(c + Vector3(w / 2 - 0.14, 0, -0.34), Vector3(0.06, 0.62, 0.68), C.wood_dk)
			box(c + Vector3(-0.18, 0.69, -0.2), Vector3(0.36, 0.26, 0.04), Color("#2f3640"))   # a screen
		"chair":
			box(c + Vector3(-0.2, 0.36, -0.2), Vector3(0.4, 0.06, 0.4), C.wood)
			box(c + Vector3(-0.2, 0.42, -0.22), Vector3(0.4, 0.42, 0.05), C.wood_dk)
			for q in [[-0.18, -0.18], [0.14, -0.18], [-0.18, 0.14], [0.14, 0.14]]:
				box(c + Vector3(q[0], 0, q[1]), Vector3(0.04, 0.36, 0.04), C.metal)
		"counter":
			var col := Color(p.get("color", "#9a6b45"))
			box(Vector3(float(p.x) + 0.02, ground_h, float(p.y) + 0.1), Vector3(w - 0.04, 0.95, d - 0.2), col, col.lightened(0.2))
			box(Vector3(float(p.x) - 0.02, ground_h + 0.95, float(p.y) + 0.05), Vector3(w + 0.04, 0.06, d - 0.1), Color("#e9e1d0"))
		"shelf":
			var col2 := Color(p.get("color", "#8a6a4a"))
			box(Vector3(float(p.x) + 0.05, ground_h, float(p.y) + 0.2), Vector3(w - 0.1, 1.7, 0.6), col2)
			for row in 3:
				for i in int(w * 3.0):
					var gx := float(p.x) + 0.15 + i * 0.3
					box(Vector3(gx, ground_h + 0.25 + row * 0.5, float(p.y) + 0.78), Vector3(0.22, 0.28, 0.06), Color.from_hsv(_h(k + row, i), 0.45, 0.8))
		"vending":
			box(c + Vector3(-0.38, 0, -0.3), Vector3(0.76, 1.75, 0.6), Color("#c0463c"), Color("#a83b33"))
			glow_on()
			box(c + Vector3(-0.3, 0.6, 0.31), Vector3(0.45, 1.0, 0.02), Color("#e8eef2"))
			glow_off()
		"fridge":
			box(c + Vector3(-0.38, 0, -0.3), Vector3(0.76, 1.75, 0.6), Color("#e8eef2"))
		"espresso":
			box(c + Vector3(-0.25, 1.01, -0.2), Vector3(0.5, 0.42, 0.36), Color("#b9bcbf"), Color("#8c9298"))
		"register":
			box(c + Vector3(-0.2, 1.01, -0.15), Vector3(0.4, 0.22, 0.3), Color("#2f3640"))
			glow_on()
			box(c + Vector3(-0.12, 1.23, -0.05), Vector3(0.24, 0.12, 0.02), Color("#9fe0b0"))
			glow_off()
		"case":
			box(Vector3(float(p.x) + 0.05, ground_h, float(p.y) + 0.1), Vector3(w - 0.1, 0.95, d - 0.2), Color("#dfe6ea"))
			for i in int(w * 3.0):
				blob(Vector3(float(p.x) + 0.2 + i * 0.3, ground_h + 1.02, float(p.y) + 0.5), Vector3(0.1, 0.06, 0.1), Color("#c98a4a"), k + i, 5, 2, 0.1)
		"board":
			box(c + Vector3(-w / 2 + 0.1, 0.55, -0.1), Vector3(w - 0.2, 1.1, 0.06), Color("#3a3f3a"))
			box(c + Vector3(-w / 2 + 0.05, 0.5, -0.12), Vector3(w - 0.1, 1.2, 0.04), C.wood_dk)
			for side in [-1.0, 1.0]:
				box(c + Vector3(side * (w / 2 - 0.2), 0, -0.05), Vector3(0.05, 0.6, 0.05), C.wood_dk)
		"phone":
			box(c + Vector3(-0.15, 0, -0.1), Vector3(0.3, 1.1, 0.2), C.metal)
			box(c + Vector3(-0.12, 1.1, -0.1), Vector3(0.24, 0.3, 0.2), Color("#c0463c"))
		"sofa", "bed":
			box(c + Vector3(-w / 2 + 0.05, 0, -d / 2 + 0.1), Vector3(w - 0.1, 0.42, d - 0.2), Color(p.get("color", "#6b7fa6")))
			box(c + Vector3(-w / 2 + 0.05, 0.42, -d / 2 + 0.1), Vector3(w - 0.1, 0.4, 0.18), Color(p.get("color", "#6b7fa6")).darkened(0.1))
		"picnic":
			box(c + Vector3(-0.45, 0.5, -0.3), Vector3(0.9, 0.05, 0.6), C.wood)
			for sz in [-0.5, 0.32]:
				box(c + Vector3(-0.45, 0.3, sz), Vector3(0.9, 0.04, 0.18), C.wood.darkened(0.06))
			for sx in [-0.38, 0.33]:
				box(c + Vector3(sx, 0, -0.45), Vector3(0.05, 0.5, 0.05), C.wood_dk)
				box(c + Vector3(sx, 0, 0.4), Vector3(0.05, 0.5, 0.05), C.wood_dk)
		"rug":
			flat(float(p.x) + 0.08, float(p.y) + 0.08, float(p.x) + w - 0.08, float(p.y) + d - 0.08, ground_h + 0.012, Color(p.get("color", "#b85a4a")))
			flat(float(p.x) + 0.18, float(p.y) + 0.18, float(p.x) + w - 0.18, float(p.y) + d - 0.18, ground_h + 0.014, Color(p.get("color", "#b85a4a")).lightened(0.15))
		"mat":
			flat(float(p.x) + 0.12, float(p.y) + 0.2, float(p.x) + w - 0.12, float(p.y) + d - 0.2, ground_h + 0.012, Color("#5a4a3e"))
		"bleachers":
			for i in 3:
				box(Vector3(float(p.x), ground_h + i * 0.25, float(p.y) + 0.6 - i * 0.3), Vector3(w, 0.06, 0.3), C.metal_lt)
				box(Vector3(float(p.x), ground_h, float(p.y) + 0.6 - i * 0.3), Vector3(w, i * 0.25, 0.04), C.metal)
		_:
			box(c + Vector3(-w / 2 + 0.1, 0, -d / 2 + 0.1), Vector3(w - 0.2, 0.6, d - 0.2), Color(p.get("color", "#a08a70")))


func _tree(c: Vector3, k: int, v: int) -> void:
	part_begin()
	cyl(Vector3(0, 0, 0), 0.08, 1.0, C.trunk, 5, 0.06)
	var col: Color = [C.leaf, C.leaf2, C.leaf_dk, C.leaf][posmod(v, 4)]
	blob(Vector3(0, 1.35, 0), Vector3(0.62, 0.55, 0.62), col, k, 7, 4, 0.16)
	blob(Vector3(0.16, 1.72, 0.07), Vector3(0.4, 0.35, 0.4), col.lightened(0.05), k + 7, 6, 3, 0.15)
	trees.append([part_end(c), float(k % 97) * 0.37])


func _big_tree(c: Vector3, k: int) -> void:
	part_begin()
	cyl(Vector3(0, 0, 0), 0.13, 1.2, C.trunk, 5, 0.09)
	var col: Color = C.leaf_au if k % 3 == 0 else C.leaf2
	blob(Vector3(0, 1.8, 0), Vector3(1.0, 0.85, 1.0), col, k, 8, 4, 0.14)
	blob(Vector3(0.3, 2.35, -0.2), Vector3(0.6, 0.5, 0.6), col.lightened(0.05), k + 3, 7, 3, 0.14)
	trees.append([part_end(c), float(k % 97) * 0.41])


func _pine(c: Vector3, k: int) -> void:
	cyl(c, 0.1, 0.4, C.trunk, 5)
	for i in 3:
		cone(c + Vector3(0, 0.35 + i * 0.55, 0), 0.7 - i * 0.18, 1.0, C.leaf_dk.darkened(0.05 * i), 7)


func _lamp(p: Vector3, out: Vector3) -> void:
	cyl(p, 0.08, 0.2, C.metal, 6)
	cyl(p, 0.04, 2.5, C.metal, 5)
	var arm := p + Vector3(0, 2.5, 0) + out * 0.35
	box(Vector3(minf(p.x, arm.x) - 0.03, p.y + 2.46, minf(p.z, arm.z) - 0.03), Vector3(absf(arm.x - p.x) + 0.06, 0.05, absf(arm.z - p.z) + 0.06), C.metal)
	cyl(arm + Vector3(0, -0.12, 0), 0.22, 0.12, C.metal, 8, 0.1)
	glow_on()
	cyl(arm + Vector3(0, -0.17, 0), 0.16, 0.05, Color("#ffe2a8"), 8)
	glow_off()


func _bench(p: Vector3, yaw: float, metal := false) -> void:
	var keep := xf
	xf = xf * Transform3D(Basis(Vector3.UP, yaw), p)
	var wood: Color = C.metal_lt if metal else C.wood
	box(Vector3(-0.45, 0.28, -0.2), Vector3(0.9, 0.07, 0.4), wood)
	box(Vector3(-0.45, 0.4, -0.24), Vector3(0.9, 0.3, 0.06), wood.darkened(0.08))
	box(Vector3(-0.4, 0, -0.15), Vector3(0.06, 0.28, 0.3), C.metal)
	box(Vector3(0.34, 0, -0.15), Vector3(0.06, 0.28, 0.3), C.metal)
	xf = keep


func _bin(p: Vector3) -> void:
	cyl(p, 0.2, 0.6, Color("#4f6656"), 8, 0.22)
	cyl(p + Vector3(0, 0.6, 0), 0.24, 0.06, Color("#3f5246"), 8)


func _hydrant(p: Vector3) -> void:
	cyl(p, 0.13, 0.42, Color("#b8574a"), 7)
	cyl(p + Vector3(0, 0.42, 0), 0.1, 0.1, Color("#c96a5b"), 7)
	box(p + Vector3(-0.2, 0.22, -0.05), Vector3(0.4, 0.08, 0.1), Color("#a24c40"))


func _street_sign(p: Vector3, text: String) -> void:
	cyl(p, 0.04, 1.6, C.metal, 5)
	box(p + Vector3(-0.45, 1.25, -0.03), Vector3(0.9, 0.32, 0.05), Color("#3f6b5e"))
	box(p + Vector3(-0.42, 1.28, 0.02), Vector3(0.84, 0.26, 0.01), Color("#4f8070"))
	if text != "":
		var l := label3d(text, p + Vector3(0, 1.41, 0.035), 40, Color("#f5ecd8"))
		l.pixel_size = 0.0034


func _bus_stop(p: Vector3) -> void:
	box(Vector3(p.x - 0.45, p.y, p.z - 0.4), Vector3(0.9, 0.05, 0.8), C.concrete)
	cyl(p + Vector3(-0.35, 0, -0.3), 0.03, 2.1, C.metal, 4)
	box(p + Vector3(-0.5, 2.1, -0.45), Vector3(1.0, 0.06, 0.8), Color("#5a6a70"))
	box(p + Vector3(-0.42, 0, -0.38), Vector3(0.84, 1.8, 0.03), Color("#b9c8cc"))
	box(p + Vector3(-0.3, 0.4, -0.3), Vector3(0.6, 0.06, 0.3), C.wood)
	box(p + Vector3(0.3, 1.6, -0.43), Vector3(0.35, 0.35, 0.03), Color("#4f7ba3"))


func _stall(c: Vector3, w: float, col: Color) -> void:
	box(c + Vector3(-w / 2 + 0.08, 0, -0.3), Vector3(w - 0.16, 0.8, 0.6), C.wood, C.wood.lightened(0.1))
	for sx in [-w / 2 + 0.1, w / 2 - 0.16]:
		box(c + Vector3(sx, 0, -0.32), Vector3(0.06, 1.9, 0.06), C.wood_dk)
	var n := maxi(2, int(w / 0.3))
	for i in n:
		var ax := c.x - w / 2 + w * i / n; var bx := c.x - w / 2 + w * (i + 1) / n
		var cc := col if i % 2 == 0 else Color("#efe6d4")
		quad(Vector3(ax, 1.9, c.z - 0.5), Vector3(bx, 1.9, c.z - 0.5), Vector3(bx, 1.75, c.z + 0.45), Vector3(ax, 1.75, c.z + 0.45), cc, Vector3(0, 1, 0.3))
	for q in int(w * 3.0):
		blob(Vector3(c.x - w / 2 + 0.25 + q * 0.3, 0.88, c.z), Vector3(0.1, 0.08, 0.1), [Color("#c9675a"), Color("#d9a24e"), Color("#9bb35c")][q % 3], q, 5, 2, 0.1)


func _fountain(pc: Vector3, w: float) -> void:
	var sn: Color = C.stone
	pc.y = 0.0
	cyl(pc + Vector3(0, w - 0.02, 0), 0.66, 0.14, sn.darkened(0.1), 14)
	cyl(pc + Vector3(0, w + 0.12, 0), 0.44, 0.16, sn, 12, 0.36)
	cyl(pc + Vector3(0, w + 0.28, 0), 0.3, 0.2, sn.lightened(0.03), 14, 0.86, false)
	disc(pc + Vector3(0, w + 0.45, 0), 0.82, C.water, 16)
	disc(pc + Vector3(0, w + 0.48, 0), 0.9, sn.lightened(0.06), 16, 0.8)
	cyl(pc + Vector3(0, w + 0.45, 0), 0.9, 0.03, sn.lightened(0.06), 16, -1.0, false)
	cyl(pc + Vector3(0, w + 0.46, 0), 0.09, 0.66, sn, 10)
	cyl(pc + Vector3(0, w + 1.1, 0), 0.1, 0.12, sn.lightened(0.03), 12, 0.44, false)
	disc(pc + Vector3(0, w + 1.2, 0), 0.41, C.water, 12)
	disc(pc + Vector3(0, w + 1.22, 0), 0.46, sn.lightened(0.06), 12, 0.4)
	part_begin()
	cone(Vector3.ZERO, 0.05, 0.38, C.water_hi.lightened(0.15), 6, false)
	jets.append([part_end(pc + Vector3(0, w + 1.34, 0), mats().water), 0.0])
	part_begin()
	cyl(Vector3(0, -0.46, 0), 0.97, 0.46, C.water_hi.lightened(0.1), 18, 0.9, false)
	var cu := part_end(pc + Vector3(0, w + 0.46, 0), mats().water)
	cu.transparency = 0.6
	curtains.append([cu, 1.7])


## Extra drawings a map asks for: { kind, x, y, w?, h? } (v1 "draws": fountain basin, bridge, sports field).
func draw_extra(d: Dictionary) -> void:
	var x := float(d.x); var y := float(d.y); var w := float(d.get("w", 1)); var h := float(d.get("h", 1))
	match str(d.kind):
		"fountain":   # a round basin in a square of water tiles, with the fountain in the middle
			var c := Vector3(x + w / 2.0, 0, y + h / 2.0)
			cyl(c + Vector3(0, -0.12, 0), w / 2.0 - 0.1, 0.42, C.stone, 16, -1.0, false)
			disc(c + Vector3(0, 0.3, 0), w / 2.0 - 0.1, C.stone.lightened(0.05), 16, w / 2.0 - 0.32)
			disc(c + Vector3(0, 0.05, 0), w / 2.0 - 0.3, C.water.lerp(C.water_hi, 0.3), 16)
			_fountain(c, 0.05)
		"bridge":
			var deck := 0.2
			box(Vector3(x - 0.15, -0.1, y - 0.2), Vector3(w + 0.3, deck + 0.1, h + 0.4), C.wood if w <= 2 else C.concrete, C.wood.lightened(0.05) if w <= 2 else C.road)
			for side in [x - 0.15, x + w + 0.05]:
				box(Vector3(side, deck, y - 0.2), Vector3(0.1, 0.55, h + 0.4), C.wood_dk if w <= 2 else C.concrete.darkened(0.1))
				for i in int(h) + 1:
					box(Vector3(side - 0.02, -0.4, y - 0.2 + i * (h + 0.3) / maxf(1.0, h)), Vector3(0.14, 0.4, 0.14), C.wood_dk)
		"field":
			flat(x + 0.5, y + 0.5, x + w - 0.5, y + 0.55, 0.062, C.line)
			flat(x + 0.5, y + h - 0.55, x + w - 0.5, y + h - 0.5, 0.062, C.line)
			flat(x + 0.5, y + 0.5, x + 0.55, y + h - 0.5, 0.062, C.line)
			flat(x + w - 0.55, y + 0.5, x + w - 0.5, y + h - 0.5, 0.062, C.line)
			flat(x + w / 2 - 0.025, y + 0.5, x + w / 2 + 0.025, y + h - 0.5, 0.062, C.line)
			disc(Vector3(x + w / 2, 0.062, y + h / 2), 1.2, C.line, 18, 1.14)
			for gx in [x + 0.55, x + w - 0.55]:   # goals
				var keep := xf
				for gz in [y + h / 2 - 0.8, y + h / 2 + 0.8]:
					cyl(Vector3(gx, 0.05, gz), 0.04, 0.9, Color("#f3efe6"), 5)
				box(Vector3(gx - 0.03, 0.9, y + h / 2 - 0.8), Vector3(0.06, 0.06, 1.6), Color("#f3efe6"))
				xf = keep


# ── Rooms: floor, a back wall with windows, low side and front walls (cut away so the camera sees in) ──
func room_shell(m: MapData) -> void:
	var W := float(m.w); var Hh := float(m.h)
	var wall := m.wall
	var wh := 2.6
	# back wall: rows 0–1 are solid; the wall stands at z = 1.6 with skirting and windows
	box(Vector3(0, 0, 0.0), Vector3(W, wh, 1.6), wall.darkened(0.1), wall.darkened(0.2))
	quad(Vector3(0.6, 0.0, 1.61), Vector3(W - 0.6, 0.0, 1.61), Vector3(W - 0.6, wh, 1.61), Vector3(0.6, wh, 1.61), wall, Vector3.BACK)
	box(Vector3(0.6, 0, 1.6), Vector3(W - 1.2, 0.14, 0.04), wall.darkened(0.3))
	for wx in m.def.get("room", {}).get("windows", [2, int(W) - 3]):
		win(float(wx) + 0.5, 0.95, 0.9, 1.05, 1.6, Color("#f1e8d8"), Color("#9cc3d6"))
	# side walls (low) and the front wall with the exit gap
	box(Vector3(0, 0, 0), Vector3(0.6, 1.2, Hh), wall.darkened(0.15), wall.darkened(0.05))
	box(Vector3(W - 0.6, 0, 0), Vector3(0.6, 1.2, Hh), wall.darkened(0.15), wall.darkened(0.05))
	var ex := float(m.exit_x)
	box(Vector3(0.6, 0, Hh - 0.55), Vector3(ex - 0.6, 0.45, 0.55), wall.darkened(0.15), wall.darkened(0.05))
	box(Vector3(ex + 1.0, 0, Hh - 0.55), Vector3(W - 0.6 - ex - 1.0, 0.45, 0.55), wall.darkened(0.15), wall.darkened(0.05))
	box(Vector3(-2, -0.3, -2), Vector3(W + 4, 0.28, Hh + 4), Color("#3d3833"))   # the dark around the room


# ── People: low-poly figures in each person's own colours. Built once per look, then shared. ──
const SKIN := ["#f6d5b8", "#e8b98f", "#c98d5f", "#a86b42", "#7a4a2c", "#5a3520"]
const HAIR := ["#2b1d14", "#5a3a22", "#a0622c", "#d9a548", "#8a8580", "#c0392b", "#1d2a4a"]
const SHIRT := ["#d9675c", "#e6a64a", "#4f8fc8", "#5aaa7c", "#8a6cc0", "#f4f1ea", "#3a414a", "#de7ea6"]
const PANTS := ["#2f3e5c", "#4a4a52", "#7a5a3a", "#2e5e4e", "#1f1f24"]

static func _col(v, list: Array) -> Color:
	if v is String:
		return Color(v)
	return Color(list[posmod(int(v), list.size())])


static func person_mesh(look: Dictionary) -> ArrayMesh:
	var key := JSON.stringify(look)
	if _person_cache.has(key):
		return _person_cache[key]
	var b = load("res://engine/world3d/art3d.gd").new()
	b.detail = 1.0
	var skin := _col(look.get("skin", 0), SKIN); var hair := _col(look.get("hair", 0), HAIR)
	var shirt := _col(look.get("shirt", 2), SHIRT); var pants := _col(look.get("pants", 0), PANTS)
	var outfit: String = look.get("outfit", "")
	var style := int(look.get("hair_style", 0))
	b.cyl(Vector3(-0.09, 0, 0), 0.07, 0.3, pants, 5)
	b.cyl(Vector3(0.09, 0, 0), 0.07, 0.3, pants, 5)
	b.box(Vector3(-0.15, 0, -0.05), Vector3(0.12, 0.06, 0.16), Color("#2b2622"))
	b.box(Vector3(0.03, 0, -0.05), Vector3(0.12, 0.06, 0.16), Color("#2b2622"))
	b.cyl(Vector3(0, 0.28, 0), 0.2, 0.36, shirt, 7, 0.15)
	for sx in [-0.24, 0.2]:   # arms
		b.box(Vector3(sx, 0.34, -0.05), Vector3(0.06, 0.28, 0.1), shirt.darkened(0.06))
		b.box(Vector3(sx, 0.28, -0.04), Vector3(0.06, 0.07, 0.08), skin)
	match outfit:
		"apron":
			b.box(Vector3(-0.13, 0.25, 0.12), Vector3(0.26, 0.33, 0.06), Color(look.get("apron", "#2f3a33")))
		"vest", "hivis":
			var vc := Color("#e8d23a") if outfit == "hivis" else Color(look.get("vest", "#4a5a6a"))
			b.box(Vector3(-0.17, 0.32, 0.1), Vector3(0.1, 0.3, 0.06), vc)
			b.box(Vector3(0.07, 0.32, 0.1), Vector3(0.1, 0.3, 0.06), vc)
			if outfit == "hivis":
				b.box(Vector3(-0.18, 0.42, 0.13), Vector3(0.36, 0.04, 0.02), Color("#d9dde0"))
		"scrubs":
			b.box(Vector3(-0.06, 0.5, 0.15), Vector3(0.12, 0.1, 0.02), shirt.lightened(0.3))
		"suit":
			b.box(Vector3(-0.04, 0.38, 0.15), Vector3(0.08, 0.24, 0.02), Color(look.get("tie", "#7a2e3a")))
	b.cyl(Vector3(0, 0.62, 0), 0.06, 0.08, skin, 5)   # neck
	b.blob(Vector3(0, 0.84, 0), Vector3(0.2, 0.21, 0.2), skin, 3, 7, 4, 0.04)
	match style:
		4:   # shaved
			b.blob(Vector3(0, 0.9, -0.02), Vector3(0.205, 0.15, 0.205), hair.lerp(skin, 0.45), 4, 7, 3, 0.02)
		3:   # curly
			b.blob(Vector3(0, 0.95, -0.03), Vector3(0.25, 0.19, 0.24), hair, 9, 8, 4, 0.35)
		2:   # bun
			b.blob(Vector3(0, 0.92, -0.03), Vector3(0.215, 0.16, 0.21), hair, 4, 7, 3, 0.05)
			b.blob(Vector3(0, 1.08, -0.1), Vector3(0.1, 0.09, 0.1), hair, 5, 6, 3, 0.05)
		1:   # long
			b.blob(Vector3(0, 0.92, -0.03), Vector3(0.22, 0.16, 0.215), hair, 4, 7, 3, 0.05)
			b.box(Vector3(-0.2, 0.55, -0.16), Vector3(0.4, 0.36, 0.12), hair)
		_:
			b.blob(Vector3(0, 0.92, -0.03), Vector3(0.215, 0.16, 0.21), hair, 4, 7, 3, 0.05)
	match outfit:
		"cap":
			b.cyl(Vector3(0, 0.95, 0), 0.215, 0.1, Color(look.get("cap", "#e2574c")), 7)
			b.box(Vector3(-0.12, 0.95, 0.12), Vector3(0.24, 0.03, 0.18), Color(look.get("cap", "#e2574c")))
		"hardhat":
			b.cyl(Vector3(0, 0.97, 0), 0.24, 0.12, Color("#e8c23a"), 8, 0.2)
			b.box(Vector3(-0.26, 0.96, -0.26), Vector3(0.52, 0.03, 0.56), Color("#e8c23a"))
		"glasses":
			b.box(Vector3(-0.15, 0.86, 0.19), Vector3(0.3, 0.03, 0.02), Color("#2b2622"))
	if look.get("glasses", false) and outfit != "glasses":
		b.box(Vector3(-0.15, 0.86, 0.19), Vector3(0.3, 0.03, 0.02), Color("#2b2622"))
	b.box(Vector3(-0.09, 0.85, 0.185), Vector3(0.04, 0.05, 0.02), Color("#2b2622"))
	b.box(Vector3(0.05, 0.85, 0.185), Vector3(0.04, 0.05, 0.02), Color("#2b2622"))
	var arr: Array = b.st_main.commit_to_arrays()
	var mesh := ArrayMesh.new()
	mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arr)
	mesh.surface_set_material(0, mats().main)
	b.free()
	_person_cache[key] = mesh
	return mesh
