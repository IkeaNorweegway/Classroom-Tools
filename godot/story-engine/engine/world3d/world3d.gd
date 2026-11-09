# The world on screen in 3D: one map at a time, its things, its people, you, and the camera.
# The interface Town and the games use (the 2D world it replaced had the same one):
#   load_map, set_people, set_my_look, person_at, blocked, face, hop, set_goal, walk_to, approach, interact_front,
#   finish_step, spawn_walker, clear_walkers; signals interacted, link_stepped, room_exit, moved; me.tile, me.dir, map.
# Walking is still tile by tile (keys, or tap a tile and AStarGrid2D finds the way), shown smoothly in 3D.
# A town map is cut into SECTION × SECTION-tile squares. A square is built when the camera comes near it and freed
# when it is far away, so a big town costs only what is on screen. Rooms are built whole.
extends Node3D

const Art = preload("res://engine/world/art.gd")
const Art3D = preload("res://engine/world3d/art3d.gd")
const Pack = preload("res://engine/world3d/pack.gd")
const MapData = preload("res://engine/world/map_data.gd")

signal interacted(kind: String, id: String)
signal link_stepped(link: Dictionary)
signal room_exit()
signal moved()

const WALK_TIME := 0.16
const DIRS := {"left": Vector2i(-1, 0), "right": Vector2i(1, 0), "up": Vector2i(0, -1), "down": Vector2i(0, 1)}
const YAW := {"down": 0.0, "up": PI, "left": -PI / 2.0, "right": PI / 2.0}
const SECTION := 8
const KEEP := 12.0                 # free a section once it is this many tiles outside the view
const BUILDS_PER_FRAME := 2

var map: MapData
var all_maps := {}                 # every map by id (Town sets it), so the start of the next area can be shown past an edge
var font: Font
var camera: Camera3D
var me: PersonNode
var people := {}
var walkers := {}                  # business-day customers: drawn, never block, never in set_people
var exit_locked := false           # a live shift: the room's way out is closed until the shift ends
var room_lift := 0.0               # a live shift: frame a room this many tiles higher on screen, clear of the work card
var live_marks := []               # a live shift: [{ pos: Vector3, bub, ring }] bubbles over stations and floor tiles
var live_pops := []                # a live shift: [{ pos: Vector3, text, good, t }] words that float up and fade
var astar := AStarGrid2D.new()
var path: Array[Vector2i] = []
var on_arrive := Callable()
var input_enabled := true
var goal_tile = null
var goal_bob := 0.0
var life_on := true
var life_timer := 0.0
var reduce_motion := false
var top_pad := 104.0
var zoom := 0.45                   # 0 close … 1 wide (mouse wheel)
var clock := 0.0

var sections := {}                 # Vector2i → Art3D builder (only the built ones)
var _queue: Array[Vector2i] = []
var _cull_t := 0.0
var _view := Rect2()
var _room_node: Node3D
var _base: Node3D                  # the ground plane round a town map
var _people_root: Node3D
var _goal_node: MeshInstance3D
var _overlay: Overlay
var _by_section := {}              # Vector2i → { buildings: [], props: [], draws: [] }
const PREVIEW := 12                # tiles of the next area shown past an edge
var _previews := []                # { map, rect (its tiles), off (where its tile 0,0 sits here), node }
var _pqueue := []
var stats := {"built": 0, "freed": 0}
# Town life from the map's "traffic" and "walkers" (both optional):
#   traffic: { lanes: [{ axis "x"|"z", dir ±1, fixed, from, to, road "ew"|"ns", stops: [where a car waits at a red light] }],
#              cars: [[lane index, start, colour]], phases: [ew green, all red, ns green, all red] in seconds }
#   walkers: [{ look, pts: [[x, z], …], loop, speed }]  (world units: tile x + 0.5)
var cars := []                     # { lane, s, v, node }
var strollers := []                # { node, pts, i, dir, loop, speed }
var light_phase := 0
var phase_t := 0.0
static var _car_meshes := {}


class PersonNode extends Node3D:
	var id := ""
	var look := {}
	var dir := "down"
	var step := 0
	var mood := ""
	var hop := 0.0
	var tile := Vector2i.ZERO
	var from := Vector2i.ZERO
	var t := 1.0
	var bubble := ""
	var ring := -1.0                 # patience left (0–1) drawn round the bubble; −1 = none
	var body: MeshInstance3D
	var rig: Node3D                  # a rigged pack model (look.model = "realm/people/hero"), used instead of body
	var action := "idle"             # the clip a rigged person plays standing still (talk, cast, cheer …)
	var world
	static var skin: StandardMaterial3D
	func _init() -> void:
		body = MeshInstance3D.new()
		body.scale = Vector3.ONE * Art3D.PERSON_SCALE
		body.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		if skin == null:   # X-ray: where a wall stands in front of a person, a soft gold shape shows through. Nobody gets lost.
			skin = Art3D.mats().main.duplicate()
			skin.stencil_mode = BaseMaterial3D.STENCIL_MODE_XRAY
			skin.stencil_color = Color(1.0, 0.84, 0.45, 0.6)
		body.material_override = skin
		add_child(body)
	func set_look(l: Dictionary) -> void:
		look = l
		if rig:
			rig.queue_free()
			rig = null
		if l.has("model"):
			var m: String = l.model
			rig = Pack.person(m.get_base_dir(), m.get_file(), l, true)
			add_child(rig)
			body.visible = false
			show_dir()
			return
		body.visible = true
		body.mesh = Art3D.person_mesh(l)
	func place(p: Vector2i) -> void:
		tile = p
		from = p
		t = 1.0
		position = world.tile_pos(p)
	func show_dir() -> void:
		body.rotation.y = YAW.get(dir, 0.0)
		if rig:
			rig.rotation.y = body.rotation.y
	## While walking: a little bounce and lean.
	func pose(walking: bool, clk: float) -> void:
		if rig:   # the clips do the bounce; the walk clip covers about a tile a stride, so speed it to the step time
			rig.position.y = hop * 0.02
			Pack.play(rig, "walk" if walking else action, 0.5 / WALK_TIME if walking else 1.0)
			return
		var bob := absf(sin(clk * 18.0)) * 0.05 if walking else 0.0
		body.position.y = bob + hop * 0.02
		body.rotation.z = (sin(clk * 18.0) * 0.06) if walking else 0.0


class Overlay extends Node2D:       # bubbles over heads, and an arrow at the screen edge when the goal is off screen
	var world
	func _draw() -> void:
		var cam: Camera3D = world.camera
		if cam == null or world.map == null:
			return
		var vs := get_viewport_rect().size
		for n in world.people.values() + world.walkers.values():
			if n.bubble == "" or not n.visible:
				continue
			var head: Vector3 = n.global_position + Vector3(0, 1.45, 0)
			if cam.is_position_behind(head):
				continue
			var p := cam.unproject_position(head)
			Art.bubble(self, n.bubble, p.x, p.y, n.ring)
		for m in world.live_marks:
			if cam.is_position_behind(m.pos):
				continue
			var mp := cam.unproject_position(m.pos)
			Art.bubble(self, m.bub, mp.x, mp.y, float(m.get("ring", -1.0)))
		for q in world.live_pops:
			if cam.is_position_behind(q.pos):
				continue
			var a: float = clampf(1.0 - float(q.t) / 1.1, 0.0, 1.0)
			var qp := cam.unproject_position(q.pos) + Vector2(0, -34.0 * float(q.t))
			var f: Font = world.font if world.font else ThemeDB.fallback_font
			var col := Color("#2c7a4b") if q.good else Color("#b42318")
			var tw := f.get_string_size(q.text, HORIZONTAL_ALIGNMENT_LEFT, -1, 20).x
			draw_string_outline(f, qp - Vector2(tw / 2.0, 0), q.text, HORIZONTAL_ALIGNMENT_LEFT, -1, 20, 5, Color(1, 1, 1, a))
			draw_string(f, qp - Vector2(tw / 2.0, 0), q.text, HORIZONTAL_ALIGNMENT_LEFT, -1, 20, Color(col, a))
		var g = world.goal_tile
		if g == null:
			return
		var gp: Vector3 = world.tile_pos(g) + Vector3(0, 2.0, 0)
		var s := cam.unproject_position(gp)
		var view := Rect2(Vector2(28, world.top_pad + 10), vs - Vector2(56, world.top_pad + 40))
		if view.has_point(s) and not cam.is_position_behind(gp):
			return
		var c := view.get_center()
		var d := (s - c).normalized()
		if cam.is_position_behind(gp):
			d = -d
		var q := Vector2(clampf(c.x + d.x * 4000.0, view.position.x, view.end.x), clampf(c.y + d.y * 4000.0, view.position.y, view.end.y))
		var nn := Vector2(-d.y, d.x)
		var pts := PackedVector2Array([q + d * 14, q - d * 7 + nn * 11, q - d * 7 - nn * 11])
		draw_colored_polygon(pts, Color("#f5b82e"))
		draw_polyline(PackedVector2Array([pts[0], pts[1], pts[2], pts[0]]), Color("#6b4510"), 2.0, true)


func _ready() -> void:
	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-42, -38, 0)
	sun.light_color = Color("#ffe6c6")
	sun.light_energy = 0.95
	sun.shadow_enabled = false            # real-time shadows cost the most on a Chromebook
	add_child(sun)
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color("#cfd9d4")
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color("#9a97c6")
	env.ambient_light_energy = 0.62
	env.tonemap_mode = Environment.TONE_MAPPER_LINEAR
	env.fog_enabled = true
	env.fog_mode = Environment.FOG_MODE_DEPTH
	env.fog_light_color = Color("#cfd9d4")
	env.fog_density = 1.0
	env.fog_depth_begin = 38.0
	env.fog_depth_end = 80.0
	var we := WorldEnvironment.new()
	we.environment = env
	add_child(we)
	camera = Camera3D.new()
	camera.fov = 30.0
	camera.near = 0.5
	camera.far = 160.0
	add_child(camera)
	camera.current = true
	_people_root = Node3D.new()
	add_child(_people_root)
	me = PersonNode.new()
	me.world = self
	me.id = "you"
	_goal_node = _make_goal()
	add_child(_goal_node)
	var cl := CanvasLayer.new()
	cl.layer = 0
	add_child(cl)
	_overlay = Overlay.new()
	_overlay.world = self
	cl.add_child(_overlay)
	astar.diagonal_mode = AStarGrid2D.DIAGONAL_MODE_NEVER
	astar.default_compute_heuristic = AStarGrid2D.HEURISTIC_MANHATTAN
	_prewarm()


## Draw every material once, tiny, just in front of the camera, so none of them stalls a frame the first time it is needed.
func _prewarm() -> void:
	var M := Art3D.mats()
	var list: Array = [M.main, M.glow, M.water, M.main_fade, M.glow_fade, PersonNode.new().body.material_override]
	var q := QuadMesh.new()
	q.size = Vector2(0.002, 0.002)
	for i in list.size():
		var mi := MeshInstance3D.new()
		mi.mesh = q
		mi.material_override = list[i]
		mi.position = Vector3(0.001 * i, 0, -1.0)
		camera.add_child(mi)
		get_tree().create_timer(0.5).timeout.connect(mi.queue_free)
	for bb in [false, true]:   # sign text (flat, and facing the camera)
		var l := Label3D.new()
		l.text = "a"
		l.pixel_size = 0.0001
		l.shaded = false
		l.billboard = BaseMaterial3D.BILLBOARD_ENABLED if bb else BaseMaterial3D.BILLBOARD_DISABLED
		l.position = Vector3(0.01, 0, -1.0)
		camera.add_child(l)
		get_tree().create_timer(0.5).timeout.connect(l.queue_free)


func _make_goal() -> MeshInstance3D:
	var b := Art3D.new()
	b.detail = 1.0
	var gold := Color("#f5b82e")
	b.cone(Vector3(0, 0, 0), 0.22, -0.38, gold, 4, false)
	b.cone(Vector3(0, 0, 0), 0.22, 0.3, gold.lightened(0.2), 4, false)
	var mi := MeshInstance3D.new()
	var arr: Array = b.st_main.commit_to_arrays()
	var mesh := ArrayMesh.new()
	mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arr)
	mi.mesh = mesh
	mi.material_override = Art3D.mats().glow
	mi.visible = false
	b.free()
	return mi


## Where a person stands on a tile.
func tile_pos(p: Vector2i) -> Vector3:
	return Vector3(p.x + 0.5, ground_h(p.x, p.y), p.y + 0.5)


func ground_h(x: int, y: int) -> float:
	if map == null or x < 0 or y < 0 or x >= map.w or y >= map.h:
		return 0.0
	return Art3D.HEIGHT.get(map.ground[y * map.w + x], 0.05)


# ── Maps ──
func load_map(m: MapData, at: Vector2i, dir: String) -> void:
	map = m
	for k in sections:
		sections[k].queue_free()
	sections.clear()
	_queue.clear()
	if _room_node:
		_room_node.queue_free()
		_room_node = null
	if _base:
		_base.queue_free()
		_base = null
	for c in _people_root.get_children():
		_people_root.remove_child(c)
		if c != me:
			c.queue_free()
	people.clear()
	for c in cars:
		if c.node: c.node.queue_free()
	cars.clear()
	for w in strollers:
		w.node.queue_free()
	strollers.clear()
	_index(m)
	_people_root.add_child(me)
	me.place(at)
	me.dir = dir
	me.show_dir()
	path.clear()
	on_arrive = Callable()
	astar.region = Rect2i(0, 0, m.w, m.h)
	astar.cell_size = Vector2(1, 1)
	astar.update()
	for y in m.h:
		for x in m.w:
			astar.set_point_solid(Vector2i(x, y), m.blocked(x, y))
	for pv in _previews:
		if pv.node:
			pv.node.queue_free()
	_previews.clear()
	_pqueue.clear()
	if m.outdoor:
		_setup_previews(m)
		_base = _build_base(m)
		add_child(_base)
	else:
		var b := Art3D.new()
		b.font = font
		b.room_shell(m)
		b.ground_tiles(m, Rect2i(0, 0, m.w, m.h))
		for p in m.props:
			b.prop(p, ground_h(int(p.x), int(p.y)))
		b.finish()
		_room_node = b
		add_child(b)
	_setup_life(m)
	_place_camera(true)
	_cull(true)


## Which buildings, props and extras belong to which section (by the tile they start on).
func _index(m: MapData) -> void:
	_by_section.clear()
	var add := func(kind: String, d: Dictionary) -> void:
		var k := Vector2i(int(d.x) / SECTION, int(d.y) / SECTION)
		if not _by_section.has(k):
			_by_section[k] = {"buildings": [], "props": [], "draws": []}
		_by_section[k][kind].append(d)
	for b in m.buildings:
		add.call("buildings", b)
	for p in m.props:
		add.call("props", p)
	for d in m.def.get("draws", []):
		add.call("draws", d)


## The land round a town map, so its edge is not the edge of the world.
func _build_base(m: MapData) -> Node3D:
	var b := Art3D.new()
	var g: Color = Art3D.C.grass
	b.flat(-60, -60, m.w + 60, 0, -0.03, g)   # a little below the map, so a next area's roads sit on top of it
	b.flat(-60, m.h, m.w + 60, m.h + 60, -0.03, g)
	b.flat(-60, 0, 0, m.h, -0.03, g)
	b.flat(m.w, 0, m.w + 60, m.h, -0.03, g)
	for i in 70:   # a loose ring of trees beyond the edge (not where the next area shows)
		var a := TAU * i / 70.0
		var r := Vector2(m.w, m.h).length() * 0.5 + 4.0 + Art3D._h(i, 5) * 10.0
		var c := Vector3(m.w / 2.0 + cos(a) * r * 1.05, 0.04, m.h / 2.0 + sin(a) * r * 0.85)
		var hit := false
		for pv in _previews:
			if Rect2(Vector2(pv.rect.position + pv.off), Vector2(pv.rect.size)).grow(6.0).has_point(Vector2(c.x, c.z)):
				hit = true
		if hit:
			continue
		b.blob(c + Vector3(0, 1.3, 0), Vector3(1.0, 1.2, 1.0), Art3D.C.leaf_dk.lerp(Art3D.C.leaf, Art3D._h(i, 9)), i, 6, 3, 0.2)
	b.finish()
	return b


## The start of each neighbouring area, laid just past the edge you would walk out by, in strips of SECTION tiles.
func _setup_previews(m: MapData) -> void:
	var seen := {}
	for l in m.def.get("links", []):
		if not all_maps.has(l.to) or seen.has(l.to):
			continue
		seen[l.to] = true
		var nm: MapData = all_maps[l.to]
		var side := "e" if int(l.x) == m.w - 1 else "w" if int(l.x) == 0 else "n" if int(l.y) == 0 else "s"
		var rect: Rect2i; var off: Vector2i
		match side:
			"e": rect = Rect2i(0, 0, PREVIEW, nm.h); off = Vector2i(m.w, 0)
			"w": rect = Rect2i(nm.w - PREVIEW, 0, PREVIEW, nm.h); off = Vector2i(-nm.w, 0)
			"n": rect = Rect2i(0, nm.h - PREVIEW, nm.w, PREVIEW); off = Vector2i(0, -nm.h)
			_: rect = Rect2i(0, 0, nm.w, PREVIEW); off = Vector2i(0, m.h)
		var horiz: bool = side in ["n", "s"]
		var n := ceili(float(rect.size.x if horiz else rect.size.y) / SECTION)
		for i in n:
			var r := Rect2i(rect.position + (Vector2i(i * SECTION, 0) if horiz else Vector2i(0, i * SECTION)), Vector2i(SECTION, rect.size.y) if horiz else Vector2i(rect.size.x, SECTION))
			r = r.intersection(rect)
			_previews.append({"map": nm, "rect": r, "off": off, "node": null})


func _build_preview(pv: Dictionary) -> void:
	var nm: MapData = pv.map
	var b := Art3D.new()
	b.font = font
	b.viewer = map.id
	b.position = Vector3(pv.off.x, 0, pv.off.y)
	var r: Rect2i = pv.rect
	b.ground_tiles(nm, r)
	for d in nm.def.get("draws", []):
		if r.has_point(Vector2i(int(d.x), int(d.y))):
			b.draw_extra(d)
	for bd in nm.buildings:
		if r.has_point(Vector2i(int(bd.x), int(bd.y))):
			b.building(bd)
	for p in nm.props:
		if r.has_point(Vector2i(int(p.x), int(p.y))):
			var gh: float = Art3D.HEIGHT.get(nm.ground[int(p.y) * nm.w + int(p.x)], 0.05)
			b.prop(p, gh)
	b.finish()
	add_child(b)
	pv.node = b


func _build_section(k: Vector2i) -> void:
	var b := Art3D.new()
	b.font = font
	b.viewer = map.id
	b.ground_tiles(map, Rect2i(k.x * SECTION, k.y * SECTION, SECTION, SECTION))
	var list: Dictionary = _by_section.get(k, {})
	for d in list.get("draws", []):
		b.draw_extra(d)
	for bd in list.get("buildings", []):
		b.building(bd)
	for p in list.get("props", []):
		b.prop(p, ground_h(int(p.x), int(p.y)))
	b.finish()
	add_child(b)
	sections[k] = b
	stats.built += 1


## The part of the ground the camera sees, plus a margin (tall things south of it still reach up into view).
func _view_ground() -> Rect2:
	var vs := get_viewport().get_visible_rect().size
	var lo := Vector2(INF, INF); var hi := -lo
	for c in [Vector2.ZERO, Vector2(vs.x, 0), Vector2(0, vs.y), vs]:
		var o := camera.project_ray_origin(c)
		var d := camera.project_ray_normal(c)
		var t := 90.0 if d.y > -0.05 else minf(-o.y / d.y, 90.0)
		var g := o + d * t
		lo = lo.min(Vector2(g.x, g.z)); hi = hi.max(Vector2(g.x, g.z))
	return Rect2(lo, hi - lo).grow_individual(2.0, 3.0, 2.0, 7.0)


## Build the sections coming into view (now, or one a frame), free the far ones, show only what is near.
func _cull(now := false) -> void:
	if map == null:
		return
	_view = _view_ground()
	if map.outdoor:
		var want := {}
		var k0 := Vector2i(floori(_view.position.x / SECTION), floori(_view.position.y / SECTION))
		var k1 := Vector2i(floori(_view.end.x / SECTION), floori(_view.end.y / SECTION))
		for ky in range(maxi(k0.y, 0), mini(k1.y, (map.h - 1) / SECTION) + 1):
			for kx in range(maxi(k0.x, 0), mini(k1.x, (map.w - 1) / SECTION) + 1):
				want[Vector2i(kx, ky)] = true
		_queue.clear()
		var mine := Vector2(me.tile.x, me.tile.y)
		for k in want:
			if not sections.has(k):
				var r := Rect2(Vector2(k * SECTION), Vector2(SECTION, SECTION))
				if now and r.grow(4.0).has_point(mine):   # only the squares round you at once; the rest a frame at a time under the fade
					_build_section(k)
				else:
					_queue.append(k)
		var c := Vector2(me.tile.x, me.tile.y)
		_queue.sort_custom(func(a, b): return Vector2(a * SECTION).distance_to(c) < Vector2(b * SECTION).distance_to(c))
		var far := _view.grow(KEEP)
		for k in sections.keys():
			var r := Rect2(Vector2(k * SECTION), Vector2(SECTION, SECTION))
			sections[k].visible = want.has(k)
			if not far.intersects(r):
				sections[k].queue_free()
				sections.erase(k)
				stats.freed += 1
	for pv in _previews:
		var wr := Rect2(Vector2(pv.rect.position + pv.off), Vector2(pv.rect.size))
		if wr.intersects(_view):
			if pv.node == null and not _pqueue.has(pv):
				_pqueue.append(pv)
			if pv.node:
				pv.node.visible = true
		elif pv.node:
			if not wr.intersects(_view.grow(KEEP)):
				pv.node.queue_free()
				pv.node = null
			else:
				pv.node.visible = false
	for id in people:
		var n: PersonNode = people[id]
		n.visible = _view.has_point(Vector2(n.position.x, n.position.z))


# ── People ──
func set_people(list: Array) -> void:
	var keep := {}
	for p in list:
		keep[p.id] = true
		var n: PersonNode = people.get(p.id)
		if n == null:
			n = PersonNode.new()
			n.world = self
			n.id = p.id
			people[p.id] = n
			_people_root.add_child(n)
			n.place(Vector2i(p.x, p.y))
			n.dir = p.get("dir", "down")
		elif n.tile != Vector2i(p.x, p.y):
			n.place(Vector2i(p.x, p.y))
			n.dir = p.get("dir", "down")
		if n.look != p.look:
			n.set_look(p.look)
		n.bubble = p.get("bubble", "")
		n.show_dir()
		n.visible = map.outdoor == false or _view.has_point(Vector2(n.position.x, n.position.z))
	for id in people.keys():
		if not keep.has(id):
			people[id].queue_free()
			people.erase(id)
	_overlay.queue_redraw()


func set_my_look(look: Dictionary) -> void:
	me.set_look(look)


func person_at(p: Vector2i) -> String:
	for id in people:
		if people[id].tile == p:
			return id
	return ""


func blocked(p: Vector2i) -> bool:
	return map.blocked(p.x, p.y) or person_at(p) != ""


func face(id: String, toward: Vector2i) -> void:
	var n: PersonNode = people.get(id)
	if n:
		n.dir = _dir_to(n.tile, toward)
		n.show_dir()


func hop(id: String) -> void:
	var n: PersonNode = me if id == "you" else people.get(id)
	if n == null or reduce_motion:
		return
	var tw := n.create_tween()
	tw.tween_method(func(v): n.hop = v; n.pose(false, clock), 0.0, 3.0, 0.08)
	tw.tween_method(func(v): n.hop = v; n.pose(false, clock), 3.0, 0.0, 0.1)


static func _dir_to(a: Vector2i, b: Vector2i) -> String:
	var d := b - a
	if absi(d.x) > absi(d.y):
		return "right" if d.x > 0 else "left"
	return "down" if d.y > 0 else "up"


# ── Camera: outdoors it follows you at an angle; a room is framed whole ──
func _place_camera(snap := false) -> void:
	if map == null:
		return
	var target: Vector3
	var off: Vector3
	if map.outdoor:
		target = me.position + Vector3(0, 0.6, 0)
		off = Vector3(-0.6, 9.4, 6.4).lerp(Vector3(-1.6, 22.0, 15.0), zoom)   # nearly due south (the paths run N–S and E–W), fairly steep
		var hx := 4.0 + 6.0 * zoom
		target.x = clampf(target.x, hx - 4.0, map.w - hx + 4.0)
		target.z = clampf(target.z, 2.0, map.h + 1.0)
	else:
		target = Vector3(map.w / 2.0, 0.4, map.h / 2.0 + 0.4 + room_lift)
		var span := maxf(map.w, map.h * 1.4) * (1.0 + room_lift * 0.11)
		off = Vector3(0, span * 0.95, span * 0.95)
	var want := target + off
	camera.position = want if snap else camera.position.lerp(want, minf(1.0, get_process_delta_time() * 6.0))
	camera.look_at(camera.position - off)


# ── Walking ──
func _process(delta: float) -> void:
	if map == null:
		return
	clock += delta
	var busy := false
	if me.t < 1.0:
		busy = true
		me.t = minf(1.0, me.t + delta / WALK_TIME)
		me.position = tile_pos(me.from).lerp(tile_pos(me.tile), me.t)
		me.pose(true, clock)
		if me.t >= 1.0:
			_arrived()
	else:
		me.pose(false, clock)
	if me.t >= 1.0 and input_enabled:
		var d := _held_dir()
		if d != "":
			path.clear()
			on_arrive = Callable()
			try_step(d)
		elif not path.is_empty():
			var nxt: Vector2i = path.pop_front()
			if blocked(nxt) and not _is_link(nxt):
				_walk_to_cancel()
			else:
				_start_step(nxt)
	_place_camera()
	_cull_t -= delta
	if _cull_t <= 0.0:
		_cull_t = 0.2
		_cull()
	_fade_between()
	var n := BUILDS_PER_FRAME
	while n > 0 and not _queue.is_empty():
		var k: Vector2i = _queue.pop_front()
		if not sections.has(k):
			_build_section(k)
			n -= 1
	if n > 0 and not _pqueue.is_empty():
		var pv: Dictionary = _pqueue.pop_front()
		if pv.node == null:
			_build_preview(pv)
	_life(delta)
	_animate(delta)
	if life_on and not busy:
		life_timer -= delta
		if life_timer <= 0.0:
			life_timer = randf_range(1.4, 3.2)
			_glance()
	_overlay.queue_redraw()


# ── Town life: traffic that stops at red lights (and for you), people strolling the sidewalks ──
func _setup_life(m: MapData) -> void:
	var tr: Dictionary = m.def.get("traffic", {})
	for c in tr.get("cars", []):
		var L: Dictionary = tr.lanes[int(c[0])]
		cars.append({"lane": int(c[0]), "s": (float(c[1]) - float(L.from)) * float(L.dir), "v": 2.4, "node": null, "col": str(c[2]), "kind": cars.size() % 3})
	for w in m.def.get("walkers", []):
		var n := PersonNode.new()
		n.world = self
		n.set_look(w.look)
		_people_root.add_child(n)
		var pts := []
		for q in w.pts:
			pts.append(Vector3(float(q[0]), 0.0, float(q[1])))
		n.position = pts[0]
		strollers.append({"node": n, "pts": pts, "i": 0, "dir": 1, "loop": w.get("loop", false), "speed": float(w.get("speed", 1.0)), "phase": randf() * TAU})


static func car_mesh(col: String, kind: int) -> ArrayMesh:
	var key := "%s/%d" % [col, kind]
	if not _car_meshes.has(key):
		var b := Art3D.new()
		b.detail = 1.0
		b._car_body(Vector3.ZERO, Color(col), 0.0, kind)
		var mesh := ArrayMesh.new()
		for pair in [[b.st_main, Art3D.mats().main], [b.st_glow, Art3D.mats().glow]]:
			var arr: Array = pair[0].commit_to_arrays()
			if arr[Mesh.ARRAY_VERTEX] != null and not (arr[Mesh.ARRAY_VERTEX] as PackedVector3Array).is_empty():
				mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arr)
				mesh.surface_set_material(mesh.get_surface_count() - 1, pair[1])
		b.free()
		_car_meshes[key] = mesh
	return _car_meshes[key]


func green(road: String) -> bool:
	return light_phase == (0 if road == "ew" else 2)


func _life(dt: float) -> void:
	var tr: Dictionary = map.def.get("traffic", {})
	if not tr.is_empty():
		var ph: Array = tr.get("phases", [14.0, 2.5, 10.0, 2.5])
		phase_t += dt
		if phase_t > float(ph[light_phase]):
			phase_t = 0.0
			light_phase = (light_phase + 1) % 4
		var view := _view.grow(3.0)
		for c in cars:
			var L: Dictionary = tr.lanes[c.lane]
			var span: float = absf(float(L.to) - float(L.from))
			var along: float = float(L.from) + float(c.s) * float(L.dir)
			var want := 2.4
			if not green(str(L.road)):   # a red light ahead: stop at its line
				for st in L.get("stops", []):
					var ahead: float = (float(st) - along) * float(L.dir)
					if ahead > 0.0 and ahead < 1.6:
						want = 0.0
			for o in cars:                # keep a gap to the car in front
				if o != c and o.lane == c.lane:
					var gap: float = fposmod(float(o.s) - float(c.s), span)
					if gap > 0.0 and gap < 2.3:
						want = 0.0
			var me_at := Vector2(me.position.x, me.position.z)   # and stop for anyone on foot in the lane
			var pos2 := Vector2(along, float(L.fixed)) if L.axis == "x" else Vector2(float(L.fixed), along)
			var ahead_v := Vector2(float(L.dir), 0) if L.axis == "x" else Vector2(0, float(L.dir))
			var rel := me_at - pos2
			if rel.dot(ahead_v) > 0.0 and rel.dot(ahead_v) < 2.0 and absf(rel.dot(Vector2(ahead_v.y, ahead_v.x))) < 0.7:
				want = 0.0
			c.v = move_toward(float(c.v), want, dt * (6.0 if want < float(c.v) else 2.5))
			c.s = fposmod(float(c.s) + float(c.v) * dt, span)
			along = float(L.from) + float(c.s) * float(L.dir)
			var at := Vector3(along, 0, float(L.fixed)) if L.axis == "x" else Vector3(float(L.fixed), 0, along)
			var near := view.has_point(Vector2(at.x, at.z))
			if near and c.node == null:
				c.node = MeshInstance3D.new()
				c.node.mesh = car_mesh(c.col, int(c.kind))
				c.node.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
				c.node.rotation.y = (0.0 if float(L.dir) > 0 else PI) if L.axis == "x" else (-PI / 2.0 if float(L.dir) > 0 else PI / 2.0)
				add_child(c.node)
			elif not near and c.node != null:
				c.node.queue_free()
				c.node = null
			if c.node:
				c.node.position = at
	for w in strollers:
		var n: PersonNode = w.node
		var pts: Array = w.pts
		var nxt: int = w.i + w.dir
		if nxt >= pts.size() or nxt < 0:
			if w.loop:
				nxt = posmod(nxt, pts.size())
			else:
				w.dir = -w.dir
				nxt = w.i + w.dir
		var target: Vector3 = pts[nxt]
		var d: Vector3 = target - Vector3(n.position.x, 0, n.position.z)
		var step: float = float(w.speed) * dt
		if d.length() <= step:
			w.i = nxt
			n.position = Vector3(target.x, 0, target.z)
		else:
			n.position += d.normalized() * step
		n.position.y = ground_h(floori(n.position.x), floori(n.position.z))
		if d.length() > 0.01:
			n.body.rotation.y = atan2(d.x, d.z)
		n.visible = _view.has_point(Vector2(n.position.x, n.position.z))
		if n.visible and not reduce_motion:
			n.body.position.y = absf(sin(clock * 9.0 + float(w.phase))) * 0.04


## A building between the camera and you fades to see-through, so you never lose yourself behind it.
func _fade_between() -> void:
	if map == null or not map.outdoor:
		return
	var eye := camera.global_position
	var pts := []   # just in front of you (toward the camera), so the building you stand at the door of never counts
	for hgt in [0.9, 0.3]:
		var p0: Vector3 = me.position + Vector3(0, hgt, 0)
		pts.append(p0 + (eye - p0).normalized() * 0.8)
	for k in sections:
		var s = sections[k]
		if not s.visible:
			continue
		for bd in s.bldgs:
			var hit := false
			for p in pts:
				if bd.box.grow(0.05).intersects_segment(eye, p):
					hit = true
			if hit != bd.faded:
				bd.faded = hit
				for i in bd.nodes.size():
					var solid_mat: Material = bd.mats[i]
					var fade_mat: Material = bd.fades[i] if bd.has("fades") else (Art3D.mats().main_fade if i == 0 else Art3D.mats().glow_fade)
					bd.nodes[i].material_override = fade_mat if hit else solid_mat
				if OS.get_cmdline_user_args().has("trace"):
					print("[fade] ", bd.id, " ", hit)
				for l in bd.labels:
					l.visible = not hit


## Motion only where you can see it: trees in the breeze, fountain water, the goal marker.
func _animate(delta: float) -> void:
	var t := clock
	if not reduce_motion:
		var lists := []
		for k in sections:
			if sections[k].visible:
				lists.append(sections[k])
		if _room_node:
			lists.append(_room_node)
		for s in lists:
			for l in s.lit:
				var grp: String = l[1]
				l[0].visible = green(grp.substr(0, 2)) == grp.ends_with("_green")
			for dk in s.ducks:
				dk[1] += dk[2] * delta
				var a: float = dk[1]
				dk[0].position = dk[5] + Vector3(cos(a) * dk[3], 0.01 * sin(t * 3.0 + a * 5.0), sin(a) * dk[4])
				dk[0].rotation.y = atan2(-sin(a) * dk[3] * signf(dk[2]), cos(a) * dk[4] * signf(dk[2]))
			for tr in s.trees:
				tr[0].rotation.x = 0.018 * sin(t * 0.8 + tr[1]) + 0.008 * sin(t * 2.1 + tr[1] * 2.0)
				tr[0].rotation.z = 0.014 * sin(t * 0.65 + tr[1] * 1.7)
			for sp in s.spins:
				sp[0].rotate_object_local(Vector3(0, 0, 1), -sp[1] * delta)
			for pl in s.pulses:
				pl[0].scale = Vector3.ONE * (1.0 + 0.07 * sin(t * 2.4 + pl[1]))
			for j in s.jets:
				j[0].scale = Vector3(1.0, 1.0 + 0.18 * sin(t * 7.0) + 0.08 * sin(t * 13.0), 1.0)
			for c in s.curtains:
				var f := 1.0 + 0.015 * sin(t * 9.0 + c[1])
				c[0].scale = Vector3(f, 1.0, f)
	if goal_tile != null:
		_goal_node.visible = true
		var base: Vector3 = tile_pos(goal_tile)
		var over: bool = person_at(goal_tile) != "" or (goal_tile == me.tile)
		var hgt := 1.75 if over else 1.1
		if map.thing_at(goal_tile.x, goal_tile.y) != "":
			hgt = 1.9
		goal_bob = maxf(0.0, goal_bob - delta)
		var bounce := absf(sin(goal_bob * 6.0)) * 0.35 if goal_bob > 0.0 else 0.06 * sin(t * 3.0)
		_goal_node.position = base + Vector3(0, hgt + bounce, 0)
		_goal_node.rotation.y = t * 1.6 if not reduce_motion else 0.0
	else:
		_goal_node.visible = false


func _held_dir() -> String:
	if Input.is_key_pressed(KEY_LEFT) or Input.is_key_pressed(KEY_A):
		return "left"
	if Input.is_key_pressed(KEY_RIGHT) or Input.is_key_pressed(KEY_D):
		return "right"
	if Input.is_key_pressed(KEY_UP) or Input.is_key_pressed(KEY_W):
		return "up"
	if Input.is_key_pressed(KEY_DOWN) or Input.is_key_pressed(KEY_S):
		return "down"
	return ""


func try_step(d: String) -> void:
	me.dir = d
	me.show_dir()
	var nxt: Vector2i = me.tile + DIRS[d]
	if not blocked(nxt) or _is_link(nxt):
		_start_step(nxt)


func _is_link(p: Vector2i) -> bool:
	return map.links.has(p) or (not map.outdoor and not exit_locked and p == Vector2i(map.exit_x, map.h - 1))


func _start_step(nxt: Vector2i) -> void:
	me.dir = _dir_to(me.tile, nxt)
	me.show_dir()
	me.from = me.tile
	me.tile = nxt
	me.t = 0.0


func _arrived() -> void:
	me.step = 0
	me.pose(false, clock)
	moved.emit()
	if map.links.has(me.tile):
		path.clear()
		link_stepped.emit(map.links[me.tile])
		return
	if not map.outdoor and not exit_locked and me.tile == Vector2i(map.exit_x, map.h - 1):
		path.clear()
		room_exit.emit()
		return
	if path.is_empty() and on_arrive.is_valid():
		var f := on_arrive
		on_arrive = Callable()
		f.call()


func _walk_to_cancel() -> void:
	path.clear()
	on_arrive = Callable()


func finish_step() -> void:
	if me.t < 1.0:
		me.t = 1.0
		me.position = tile_pos(me.tile)
		_arrived()


func walk_to(target: Vector2i, then := Callable()) -> bool:
	for id in people:
		astar.set_point_solid(people[id].tile, true)
	var end := target
	if not astar.is_in_boundsv(end):
		return false
	if astar.is_point_solid(end) and not _is_link(end):
		end = _nearest_free(target)
	var was_solid := astar.is_point_solid(end)
	astar.set_point_solid(end, false)
	var pts := astar.get_id_path(me.tile, end)
	astar.set_point_solid(end, was_solid)
	for id in people:
		astar.set_point_solid(people[id].tile, map.blocked(people[id].tile.x, people[id].tile.y))
	if pts.is_empty():
		return false
	path.clear()
	for i in range(1, pts.size()):
		path.append(pts[i])
	on_arrive = then
	if path.is_empty() and then.is_valid():
		on_arrive = Callable()
		then.call()
	return true


func _nearest_free(p: Vector2i) -> Vector2i:
	var best := me.tile
	var bd := 1 << 30
	for d in DIRS.values():
		var q: Vector2i = p + d
		if q == me.tile:
			return q
		if map.blocked(q.x, q.y) or person_at(q) != "":
			continue
		var dist := absi(q.x - me.tile.x) + absi(q.y - me.tile.y)
		if dist < bd:
			bd = dist
			best = q
	return best


func approach(kind: String, id: String) -> void:
	var tiles: Array[Vector2i] = []
	if kind == "person":
		if not people.has(id):
			return
		tiles.append(people[id].tile)
	else:
		var t: Dictionary = map.things[id]
		for y in range(t.y, t.y + t.h):
			for x in range(t.x, t.x + t.w):
				tiles.append(Vector2i(x, y))
	for t in tiles:
		if absi(t.x - me.tile.x) + absi(t.y - me.tile.y) == 1:
			me.dir = _dir_to(me.tile, t)
			me.show_dir()
			interacted.emit(kind, id)
			return
	var target: Vector2i = tiles[0]
	for t in tiles:
		var below := t + Vector2i(0, 1)
		if not blocked(below):
			target = t
			break
	walk_to(target, func():
		var near := tiles[0]
		for t in tiles:
			if absi(t.x - me.tile.x) + absi(t.y - me.tile.y) == 1:
				near = t
		me.dir = _dir_to(me.tile, near)
		me.show_dir()
		interacted.emit(kind, id))


func interact_front() -> void:
	var p: Vector2i = me.tile + DIRS[me.dir]
	var who := person_at(p)
	if who != "":
		interacted.emit("person", who)
		return
	var th := map.thing_at(p.x, p.y)
	if th != "":
		interacted.emit("thing", th)


## The tile under a point on the screen (the ground at about knee height, so a tap on a person's body counts).
func tile_at_screen(sp: Vector2) -> Vector2i:
	var o := camera.project_ray_origin(sp)
	var d := camera.project_ray_normal(sp)
	if absf(d.y) < 0.001:
		return Vector2i(-1, -1)
	var t := (0.15 - o.y) / d.y
	var g := o + d * t
	return Vector2i(floori(g.x), floori(g.z))


func _unhandled_input(ev: InputEvent) -> void:
	if map == null:
		return
	if ev is InputEventMouseButton and ev.pressed and ev.button_index in [MOUSE_BUTTON_WHEEL_UP, MOUSE_BUTTON_WHEEL_DOWN] and map.outdoor:
		zoom = clampf(zoom + (-0.08 if ev.button_index == MOUSE_BUTTON_WHEEL_UP else 0.08), 0.0, 1.0)
		get_viewport().set_input_as_handled()
		return
	if not input_enabled:
		return
	if ev is InputEventKey and ev.pressed and not ev.echo and ev.keycode in [KEY_SPACE, KEY_ENTER, KEY_KP_ENTER, KEY_E]:
		if me.t >= 1.0:
			interact_front()
			get_viewport().set_input_as_handled()
	elif ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT:
		var p := tile_at_screen(ev.position)
		var who := ""
		for q in [p, p + Vector2i(0, -1), p + Vector2i(0, 1)]:   # a tap on a head lands a tile or so north of the feet
			if who == "":
				who = person_at(q)
		if who != "":
			approach("person", who)
		elif map.thing_at(p.x, p.y) != "":
			approach("thing", map.thing_at(p.x, p.y))
		else:
			walk_to(p)
		get_viewport().set_input_as_handled()


func _glance() -> void:
	if people.is_empty():
		return
	var ids := people.keys()
	var id: String = ids[randi() % ids.size()]
	var n: PersonNode = people[id]
	if Vector2(n.tile).distance_to(Vector2(me.tile)) <= 2.0:
		return
	n.dir = ["down", "left", "right", "down"][randi() % 4]
	n.show_dir()


func set_goal(tile) -> void:
	var changed: bool = goal_tile != tile
	goal_tile = tile
	if changed and tile != null and not reduce_motion:
		goal_bob = 1.6


# ── Customers for a business day: walk a list of tiles, show a bubble, leave ──
func spawn_walker(look: Dictionary, tiles: Array, bubble_kind: String, bubble_at: int, speed: float) -> void:
	var n := PersonNode.new()
	n.world = self
	n.set_look(look)
	_people_root.add_child(n)
	n.place(tiles[0])
	var key := n.get_instance_id()
	walkers[key] = n
	var tw := n.create_tween()
	for i in range(1, tiles.size()):
		var a: Vector2i = tiles[i - 1]
		var b: Vector2i = tiles[i]
		var dir := _dir_to(a, b)
		var dist := float(absi(b.x - a.x) + absi(b.y - a.y))
		tw.tween_callback(func(): n.dir = dir; n.show_dir())
		tw.tween_property(n, "position", tile_pos(b), maxf(0.05, dist / speed))
		if i == bubble_at:
			tw.tween_callback(func(): n.bubble = bubble_kind; n.dir = "up" if bubble_kind == "" else "down"; n.show_dir())
			tw.tween_interval(0.35)
			tw.tween_callback(func(): n.bubble = "")
	tw.tween_callback(func(): walkers.erase(key); n.queue_free())


func clear_walkers() -> void:
	for k in walkers.keys():
		walkers[k].queue_free()
	walkers.clear()
