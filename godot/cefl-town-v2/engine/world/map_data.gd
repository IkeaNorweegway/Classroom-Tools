# One map, built from a game's plain dictionary. No nodes.
#
# Outdoor map:  { name, w, h, base: "grass", fill: [[kind, x, y, w, h], …], ground?: [kind per tile], road_lines: [row, …],
#                 draws?: [{ kind, x, y, w, h }] (fountain, bridge, field), districts?: [{ name, x, y, w, h }],
#                 buildings: [{ id, x, y, w, h, door (column), to (room map id), sign, wall, roof, awning, … }],
#                 props: [{ k, x, y, w?, h?, id?, label?, solid? }], links: [{ x, y, w?, h?, to, at: [x, y], dir }],
#                 spots: { id: { x, y, label } } }
# Room:         { name, w, h, room: { floor: "wood", wall: "#f3e3c3", exit: column }, props, spots }
#               Rows 0–1 are the back wall, columns 0 and w−1 the side walls, row h−1 the front wall;
#               the exit is a gap in the front wall that leads back out of the building's door.
extends RefCounted

const Art = preload("res://engine/world/art.gd")

var id := ""
var name := ""
var w := 0
var h := 0
var outdoor := true
var ground := []                  # kind per tile, index y * w + x
var road_lines := {}              # row → true: a dashed line along the bottom of that row
var solid := PackedByteArray()
var links := {}                   # Vector2i → { to, at: Vector2i, dir }
var buildings := []
var props := []
var things := {}                  # id → { x, y, label }: props with an id, and spots
var wall := Color("#f3e3c3")
var exit_x := -1
var arrive := Vector2i.ZERO       # where you stand when you come in through the door
var def := {}


func _init(map_id: String, d: Dictionary) -> void:
	id = map_id
	def = d
	name = d.get("name", map_id)
	w = int(d.w)
	h = int(d.h)
	outdoor = not d.has("room")
	solid.resize(w * h)
	var base: String = d.get("base", "grass")
	if d.has("room"):
		base = d.room.get("floor", "wood")
		wall = Color(d.room.get("wall", "#f3e3c3"))
		exit_x = int(d.room.get("exit", w / 2))
		arrive = Vector2i(exit_x, h - 2)
	ground.resize(w * h)
	ground.fill(base)
	for f in d.get("fill", []):
		for y in range(int(f[2]), int(f[2]) + int(f[4])):
			for x in range(int(f[1]), int(f[1]) + int(f[3])):
				if _in(x, y):
					ground[y * w + x] = f[0]
	if d.has("ground"):   # a whole grid of kinds, one per tile, row by row (bigger towns are built this way)
		var g: Array = d.ground
		for i in mini(g.size(), w * h):
			ground[i] = g[i]
	for r in d.get("road_lines", []):
		road_lines[int(r)] = true
	if not outdoor:
		for x in w:
			_solid(x, 0)
			_solid(x, 1)
			if x != exit_x:
				_solid(x, h - 1)
		for y in h:
			_solid(0, y)
			_solid(w - 1, y)
	for b in d.get("buildings", []):
		buildings.append(b)
		for y in range(int(b.y), int(b.y) + int(b.h)):
			for x in range(int(b.x), int(b.x) + int(b.w)):
				_solid(x, y)
		var door := Vector2i(int(b.get("door", int(b.x) + int(b.w) / 2)), int(b.y) + int(b.h) - 1)
		if b.has("to"):
			solid[door.y * w + door.x] = 0
			links[door] = {"to": b.to, "at": null, "dir": "up", "door_of": b.get("id", "")}
	for p in d.get("props", []):
		props.append(p)
		var is_solid: bool = p.get("solid", Art.SOLID.get(p.k, false))
		for y in range(int(p.y), int(p.y) + int(p.get("h", 1))):
			for x in range(int(p.x), int(p.x) + int(p.get("w", 1))):
				if is_solid:
					_solid(x, y)
		if p.has("id"):
			things[p.id] = {"x": int(p.x), "y": int(p.y), "w": int(p.get("w", 1)), "h": int(p.get("h", 1)), "label": p.get("label", p.id)}
	for k in d.get("spots", {}):
		var s: Dictionary = d.spots[k]
		things[k] = {"x": int(s.x), "y": int(s.y), "w": 1, "h": 1, "label": s.get("label", k)}
	for l in d.get("links", []):
		for y in range(int(l.y), int(l.y) + int(l.get("h", 1))):
			for x in range(int(l.x), int(l.x) + int(l.get("w", 1))):
				# a wide edge link keeps your row or column on the other side
				var at := Vector2i(int(l.at[0]), int(l.at[1]))
				if l.get("h", 1) > 1:
					at.y += y - int(l.y)
				if l.get("w", 1) > 1:
					at.x += x - int(l.x)
				links[Vector2i(x, y)] = {"to": l.to, "at": at, "dir": l.get("dir", "down")}


func _in(x: int, y: int) -> bool:
	return x >= 0 and y >= 0 and x < w and y < h


func _solid(x: int, y: int) -> void:
	if _in(x, y):
		solid[y * w + x] = 1


func blocked(x: int, y: int) -> bool:
	return not _in(x, y) or solid[y * w + x] == 1 or ground[y * w + x] == "water"


func kind_at(x: int, y: int) -> String:
	return ground[y * w + x] if _in(x, y) else ""


## The id of a thing covering this tile, or "".
func thing_at(x: int, y: int) -> String:
	for k in things:
		var t: Dictionary = things[k]
		if x >= t.x and x < t.x + t.w and y >= t.y and y < t.y + t.h:
			return k
	return ""


## Where you stand outside after leaving room_id (one tile below its building's door).
func outside_door(room_id: String) -> Variant:
	for p in links:
		if links[p].to == room_id and links[p].at == null:
			return {"at": Vector2i(p.x, p.y + 1), "dir": "down"}
	return null
