# The world on screen: one map at a time, its things, its people, you, and the camera.
# Walking: arrow keys or WASD (hold to keep going), or tap/click a tile (Godot's AStarGrid2D finds the way).
# Talking: Space, Enter or E faces the tile in front; tapping a person walks next to them and talks.
# Nothing here knows the story: the world tells Town what you did through signals.
extends Node2D

const Art = preload("res://engine/world/art.gd")
const MapData = preload("res://engine/world/map_data.gd")

signal interacted(kind: String, id: String)       # kind: "person" | "thing"
signal link_stepped(link: Dictionary)              # you walked onto a door or an edge
signal room_exit()                                 # you walked out of a room's front gap
signal moved()

const WALK_TIME := 0.16
const DIRS := {"left": Vector2i(-1, 0), "right": Vector2i(1, 0), "up": Vector2i(0, -1), "down": Vector2i(0, 1)}

var map: MapData
var font: Font
var ground_node: Node2D
var sorted: Node2D
var overlay: Node2D
var camera: Camera2D
var me: PersonNode
var people := {}                   # id → PersonNode on this map
var astar := AStarGrid2D.new()
var path: Array[Vector2i] = []
var on_arrive := Callable()
var input_enabled := true
var goal_tile = null               # Vector2i or null: the gold marker
var goal_bob := 0.0
var life_on := true
var life_timer := 0.0
var reduce_motion := false
var top_pad := 104.0


# ── Drawn pieces ──
class GroundNode extends Node2D:
	var world
	func _draw() -> void:
		var m = world.map
		if m == null:
			return
		for y in m.h:
			for x in m.w:
				Art.ground(self, m.ground[y * m.w + x], x, y, m.road_lines.has(y))
		if not m.outdoor:
			Art.room(self, m.w, m.h, m.wall, m.exit_x)
		for p in m.props:
			if p.k in ["rug", "mat"]:   # flat things lie under everyone
				draw_set_transform(Vector2(p.x * 32, p.y * 32))
				Art.prop(self, p)
				draw_set_transform(Vector2.ZERO)


class ThingNode extends Node2D:     # a building or a prop; its position is the bottom-left of its footprint (for y-sorting)
	var data: Dictionary
	var is_building := false
	var font: Font
	func _draw() -> void:
		draw_set_transform(Vector2(0, -float(data.get("h", 1)) * 32.0))
		if is_building:
			Art.building(self, data, font)
		else:
			Art.prop(self, data)
		draw_set_transform(Vector2.ZERO)


class PersonNode extends Node2D:    # position: bottom-left of the tile the person stands on
	var id := ""
	var look := {}
	var dir := "down"
	var step := 0
	var mood := ""
	var hop := 0.0
	var tile := Vector2i.ZERO
	var from := Vector2i.ZERO
	var t := 1.0                    # 0 → 1 across one step
	var bubble := ""
	var label := ""
	func _draw() -> void:
		Art.person(self, look, dir, step, {"hop": -hop, "mood": mood, "origin": Vector2(0, -32)})
		if bubble != "":
			Art.bubble(self, bubble, 16, -48 - hop)
	func place(p: Vector2i) -> void:
		tile = p
		from = p
		t = 1.0
		position = Vector2(p.x * 32, (p.y + 1) * 32)


class Overlay extends Node2D:       # the goal marker (and an edge arrow when it is off screen)
	var world
	func _draw() -> void:
		var g = world.goal_tile
		if g == null:
			return
		var cam: Camera2D = world.camera
		var vs: Vector2 = world.get_viewport_rect().size / cam.zoom
		var c: Vector2 = cam.get_screen_center_position()
		var view := Rect2(c - vs / 2, vs).grow(-24)
		var p := Vector2(g.x * 32 + 16, g.y * 32 - 38 - absf(sin(world.goal_bob * 6.0)) * 6.0 * signf(world.goal_bob))
		var gold := Color("#f5b82e")
		var ink := Color("#6b4510")
		if view.has_point(p):
			var pts := PackedVector2Array([p + Vector2(-9, -10), p + Vector2(9, -10), p + Vector2(0, 2)])
			draw_colored_polygon(pts, gold)
			draw_polyline(PackedVector2Array([pts[0], pts[1], pts[2], pts[0]]), ink, 2.0, true)
		else:
			var q := Vector2(clampf(p.x, view.position.x, view.end.x), clampf(p.y, view.position.y, view.end.y))
			var d := (p - q).normalized()
			var n := Vector2(-d.y, d.x)
			var pts := PackedVector2Array([q + d * 12, q - d * 6 + n * 9, q - d * 6 - n * 9])
			draw_colored_polygon(pts, gold)
			draw_polyline(PackedVector2Array([pts[0], pts[1], pts[2], pts[0]]), ink, 2.0, true)


func _ready() -> void:
	ground_node = GroundNode.new()
	ground_node.world = self
	add_child(ground_node)
	sorted = Node2D.new()
	sorted.y_sort_enabled = true
	add_child(sorted)
	overlay = Overlay.new()
	overlay.world = self
	overlay.z_index = 10
	add_child(overlay)
	camera = Camera2D.new()
	camera.position_smoothing_enabled = false
	add_child(camera)
	me = PersonNode.new()
	me.id = "you"
	astar.diagonal_mode = AStarGrid2D.DIAGONAL_MODE_NEVER
	astar.default_compute_heuristic = AStarGrid2D.HEURISTIC_MANHATTAN
	get_viewport().size_changed.connect(_fit_camera)


# ── Maps ──
func load_map(m: MapData, at: Vector2i, dir: String) -> void:
	map = m
	for c in sorted.get_children():
		sorted.remove_child(c)
		if c != me:
			c.queue_free()
	people.clear()
	for b in m.buildings:
		var t := ThingNode.new()
		t.data = b
		t.is_building = true
		t.font = font
		t.position = Vector2(int(b.x) * 32, (int(b.y) + int(b.h)) * 32)
		sorted.add_child(t)
	for p in m.props:
		if p.k in ["rug", "mat"]:
			continue
		var t := ThingNode.new()
		t.data = p
		t.position = Vector2(int(p.x) * 32, (int(p.y) + int(p.get("h", 1))) * 32)
		sorted.add_child(t)
	sorted.add_child(me)
	me.place(at)
	me.dir = dir
	me.step = 0
	path.clear()
	on_arrive = Callable()
	astar.region = Rect2i(0, 0, m.w, m.h)
	astar.cell_size = Vector2(1, 1)
	astar.update()
	for y in m.h:
		for x in m.w:
			astar.set_point_solid(Vector2i(x, y), m.blocked(x, y))
	ground_node.queue_redraw()
	_fit_camera()
	_follow()


## people: [{ id, x, y, dir, look, bubble }] for this map. Keeps nodes that stay, so nobody flickers.
func set_people(list: Array) -> void:
	var keep := {}
	for p in list:
		keep[p.id] = true
		var n: PersonNode = people.get(p.id)
		if n == null:
			n = PersonNode.new()
			n.id = p.id
			people[p.id] = n
			sorted.add_child(n)
			n.place(Vector2i(p.x, p.y))
			n.dir = p.get("dir", "down")
		elif n.tile != Vector2i(p.x, p.y):
			n.place(Vector2i(p.x, p.y))
			n.dir = p.get("dir", "down")
		n.look = p.look
		n.bubble = p.get("bubble", "")
		n.queue_redraw()
	for id in people.keys():
		if not keep.has(id):
			people[id].queue_free()
			people.erase(id)


func set_my_look(look: Dictionary) -> void:
	me.look = look
	me.queue_redraw()


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
		n.queue_redraw()


func hop(id: String) -> void:
	var n: PersonNode = me if id == "you" else people.get(id)
	if n == null or reduce_motion:
		return
	var tw := n.create_tween()
	tw.tween_method(func(v): n.hop = v; n.queue_redraw(), 0.0, 3.0, 0.08)
	tw.tween_method(func(v): n.hop = v; n.queue_redraw(), 3.0, 0.0, 0.1)


static func _dir_to(a: Vector2i, b: Vector2i) -> String:
	var d := b - a
	if absi(d.x) > absi(d.y):
		return "right" if d.x > 0 else "left"
	return "down" if d.y > 0 else "up"


# ── Camera: outdoors it follows you; a room fits on screen and stays still ──
func _fit_camera() -> void:
	if map == null:
		return
	var vs := get_viewport_rect().size
	var usable := vs - Vector2(0, top_pad + 20)   # the top bar covers top_pad screen pixels
	if map.outdoor:
		var z := clampf(vs.x / (18.0 * 32.0), 1.0, 2.4)
		camera.zoom = Vector2(z, z)
		camera.offset = Vector2(0, -top_pad / 2.0 / z)
		camera.limit_left = 0
		camera.limit_top = -int(top_pad / z) - 40
		camera.limit_right = map.w * 32
		camera.limit_bottom = map.h * 32
	else:
		var z := clampf(minf(usable.x / (map.w * 32.0), usable.y / (map.h * 32.0)), 0.8, 2.6)
		camera.zoom = Vector2(z, z)
		camera.offset = Vector2(0, -top_pad / 2.0 / z)
		camera.limit_left = -10000000
		camera.limit_top = -10000000
		camera.limit_right = 10000000
		camera.limit_bottom = 10000000
	_follow()


func _follow() -> void:
	if map == null:
		return
	if map.outdoor:
		camera.position = me.position + Vector2(16, -16)
	else:
		camera.position = Vector2(map.w * 16.0, map.h * 16.0 + 8)
	overlay.queue_redraw()


# ── Walking ──
func _process(delta: float) -> void:
	if map == null:
		return
	var busy := false
	if me.t < 1.0:
		busy = true
		me.t = minf(1.0, me.t + delta / WALK_TIME)
		var a := Vector2(me.from.x * 32, (me.from.y + 1) * 32)
		var b := Vector2(me.tile.x * 32, (me.tile.y + 1) * 32)
		me.position = a.lerp(b, me.t)
		me.step = 1 + (int(me.tile.x + me.tile.y) % 2) if me.t < 0.75 else 0
		me.queue_redraw()
		_follow()
		if me.t >= 1.0:
			_arrived()
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
	if goal_bob > 0.0:
		goal_bob = maxf(0.0, goal_bob - delta)
		overlay.queue_redraw()
	if life_on and not busy:
		life_timer -= delta
		if life_timer <= 0.0:
			life_timer = randf_range(1.4, 3.2)
			_glance()


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
	var nxt: Vector2i = me.tile + DIRS[d]
	if not blocked(nxt) or _is_link(nxt):
		_start_step(nxt)
	else:
		me.queue_redraw()


func _is_link(p: Vector2i) -> bool:
	return map.links.has(p) or (not map.outdoor and p == Vector2i(map.exit_x, map.h - 1))


func _start_step(nxt: Vector2i) -> void:
	me.dir = _dir_to(me.tile, nxt)
	me.from = me.tile
	me.tile = nxt
	me.t = 0.0


func _arrived() -> void:
	me.step = 0
	me.queue_redraw()
	moved.emit()
	if map.links.has(me.tile):
		path.clear()
		link_stepped.emit(map.links[me.tile])
		return
	if not map.outdoor and me.tile == Vector2i(map.exit_x, map.h - 1):
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


## Finish any step at once (tests and reduced motion use this).
func finish_step() -> void:
	if me.t < 1.0:
		me.t = 1.0
		me.position = Vector2(me.tile.x * 32, (me.tile.y + 1) * 32)
		_follow()
		_arrived()


func walk_to(target: Vector2i, then := Callable()) -> bool:
	for id in people:
		astar.set_point_solid(people[id].tile, true)
	var end := target
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


## Walk next to a person or thing, face it, then interact.
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
			me.queue_redraw()
			interacted.emit(kind, id)
			return
	var target: Vector2i = tiles[0]
	for t in tiles:              # stand in front (below) when we can: counters and boards face down
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
		me.queue_redraw()
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


func _unhandled_input(ev: InputEvent) -> void:
	if map == null or not input_enabled:
		return
	if ev is InputEventKey and ev.pressed and not ev.echo and ev.keycode in [KEY_SPACE, KEY_ENTER, KEY_KP_ENTER, KEY_E]:
		if me.t >= 1.0:
			interact_front()
			get_viewport().set_input_as_handled()
	elif ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT:
		var wp := get_global_mouse_position()
		var p := Vector2i(floori(wp.x / 32.0), floori(wp.y / 32.0))
		# people and tall things are drawn above their tile: a tap on the head counts too
		var who := person_at(p)
		if who == "":
			who = person_at(p + Vector2i(0, 1))
		if who != "":
			approach("person", who)
		elif map.thing_at(p.x, p.y) != "":
			approach("thing", map.thing_at(p.x, p.y))
		else:
			walk_to(p)
		get_viewport().set_input_as_handled()


# ── Town life: now and then someone on screen glances a new way ──
func _glance() -> void:
	if people.is_empty():
		return
	var ids := people.keys()
	var id: String = ids[randi() % ids.size()]
	var n: PersonNode = people[id]
	if n.tile.distance_to(me.tile) <= 2.0:
		return
	n.dir = ["down", "left", "right", "down"][randi() % 4]
	n.queue_redraw()


func set_goal(tile) -> void:
	var changed: bool = goal_tile != tile
	goal_tile = tile
	if changed and tile != null and not reduce_motion:
		goal_bob = 1.6
	overlay.queue_redraw()


# ── Customers for a business day: walk a list of tiles, show a bubble, leave ──
func spawn_walker(look: Dictionary, tiles: Array, bubble_kind: String, bubble_at: int, speed: float) -> void:
	var n := PersonNode.new()
	n.look = look
	sorted.add_child(n)
	n.place(tiles[0])
	var tw := n.create_tween()
	for i in range(1, tiles.size()):
		var a: Vector2i = tiles[i - 1]
		var b: Vector2i = tiles[i]
		var dir := _dir_to(a, b)
		var dist := float(absi(b.x - a.x) + absi(b.y - a.y))
		tw.tween_callback(func(): n.dir = dir; n.step = 1; n.queue_redraw())
		tw.tween_property(n, "position", Vector2(b.x * 32, (b.y + 1) * 32), maxf(0.05, dist / speed))
		if i == bubble_at:
			tw.tween_callback(func(): n.bubble = bubble_kind; n.step = 0; n.dir = "up" if bubble_kind == "" else "down"; n.mood = "sad" if bubble_kind in ["soldout", "line", "price"] else ""; n.queue_redraw())
			tw.tween_interval(0.35)
			tw.tween_callback(func(): n.bubble = ""; n.queue_redraw())
	tw.tween_callback(n.queue_free)


func clear_walkers() -> void:
	for c in sorted.get_children():
		if c is PersonNode and c != me and c.id == "":
			c.queue_free()
