# The CEFL Town map from v1 (public/materials/cefl/town/world.js), rebuilt as v2 map dictionaries for the 3D world.
# Same layout tile for tile: 78 × 58, the same 26 buildings, doors, paths, river, bridges, square, field, garden,
# districts, signs, decor and the fixed scatter of trees; the same 9 × 7 rooms and base townspeople.
# Only the drawing is new: each building gets a 3D style (civic, campus, glass, shop, industry, house).
# No nodes: maps() and people() return plain data.
extends RefCounted

const W := 78
const H := 58

## v1 buildings: rh roof rows + fh façade rows deep; door = column from the left; style; brick; room kind.
const BUILDINGS := [
	# College Hill and the Schoolyard
	{"id": "school", "name": "School", "x": 2, "y": 3, "w": 11, "rh": 3, "fh": 4, "style": "civic", "brick": "red", "door": 5, "kind": "library"},
	{"id": "community", "name": "Community Centre", "x": 29, "y": 4, "w": 7, "rh": 2, "fh": 4, "style": "civic", "brick": "orange", "door": 3, "kind": "hall"},
	{"id": "university", "name": "University", "x": 41, "y": 2, "w": 13, "rh": 3, "fh": 5, "style": "campus", "brick": "red", "door": 6, "kind": "library"},
	{"id": "polytechnic", "name": "Polytechnic", "x": 56, "y": 3, "w": 10, "rh": 2, "fh": 5, "style": "glass", "brick": "orange", "door": 5, "kind": "library"},
	{"id": "trades", "name": "Trades Centre", "x": 68, "y": 4, "w": 8, "rh": 2, "fh": 4, "style": "industry", "brick": "orange", "door": 3, "kind": "yard"},
	# Main Street
	{"id": "library", "name": "Library", "x": 2, "y": 16, "w": 7, "rh": 2, "fh": 5, "style": "civic", "brick": "red", "door": 3, "kind": "library"},
	{"id": "jobcentre", "name": "Job Centre", "x": 10, "y": 17, "w": 8, "rh": 2, "fh": 4, "style": "glass", "brick": "red", "door": 3, "kind": "office"},
	{"id": "bank", "name": "Bank", "x": 19, "y": 15, "w": 8, "rh": 3, "fh": 5, "style": "civic", "brick": "orange", "door": 3, "kind": "bank", "emblem": "coin"},
	{"id": "servicecanada", "name": "Service Canada", "x": 28, "y": 17, "w": 6, "rh": 2, "fh": 4, "style": "shop", "brick": "red", "door": 2, "kind": "office"},
	{"id": "news", "name": "News", "x": 34, "y": 19, "w": 3, "rh": 2, "fh": 2, "style": "shop", "brick": "orange", "door": 1, "kind": "shop"},
	{"id": "townhall", "name": "Town Hall", "x": 41, "y": 13, "w": 14, "rh": 4, "fh": 6, "style": "civic", "brick": "orange", "door": 7, "kind": "hall", "emblem": "clock"},
	{"id": "hospital", "name": "Hospital", "x": 57, "y": 14, "w": 12, "rh": 3, "fh": 6, "style": "glass", "brick": "red", "door": 6, "kind": "hospital", "emblem": "cross"},
	{"id": "clinic", "name": "Riverbend Clinic", "x": 70, "y": 16, "w": 7, "rh": 2, "fh": 5, "style": "shop", "brick": "red", "door": 3, "kind": "office"},
	# Market Lane
	{"id": "grocer", "name": "Valley Market", "x": 2, "y": 31, "w": 8, "rh": 2, "fh": 5, "style": "shop", "brick": "red", "door": 3, "kind": "grocery", "awning": "#6f8f62"},
	{"id": "diner", "name": "The Lantern Diner", "x": 11, "y": 32, "w": 7, "rh": 2, "fh": 4, "style": "shop", "brick": "orange", "door": 3, "kind": "diner", "awning": "#b25c47"},
	{"id": "sports", "name": "Northside Sports", "x": 19, "y": 31, "w": 8, "rh": 2, "fh": 5, "style": "glass", "brick": "red", "door": 4, "kind": "shop"},
	{"id": "phones", "name": "CellPoint", "x": 28, "y": 32, "w": 8, "rh": 2, "fh": 4, "style": "glass", "brick": "orange", "door": 3, "kind": "shop"},
	{"id": "bikeshop", "name": "Spoke & Chain Bikes", "x": 58, "y": 31, "w": 7, "rh": 2, "fh": 5, "style": "shop", "brick": "orange", "door": 3, "kind": "shop", "awning": "#3f7f9a"},
	{"id": "quickcash", "name": "Quick Cash", "x": 66, "y": 32, "w": 5, "rh": 2, "fh": 4, "style": "shop", "brick": "red", "door": 2, "kind": "office", "awning": "#d9b13a", "stripes": false},
	{"id": "taxclinic", "name": "Tax Clinic", "x": 72, "y": 31, "w": 5, "rh": 2, "fh": 5, "style": "shop", "brick": "orange", "door": 2, "kind": "office", "awning": "#5b6fa8"},
	# the Industrial Yard and Riverside Homes
	{"id": "warehouse", "name": "Prairie Parcel", "x": 2, "y": 40, "w": 12, "rh": 2, "fh": 5, "style": "industry", "brick": "orange", "door": 6, "kind": "yard"},
	{"id": "electric", "name": "Bright Spark Electric", "x": 16, "y": 41, "w": 8, "rh": 2, "fh": 4, "style": "industry", "brick": "orange", "door": 3, "kind": "yard"},
	{"id": "furniture", "name": "Home & Hearth", "x": 26, "y": 40, "w": 10, "rh": 2, "fh": 5, "style": "glass", "brick": "red", "door": 4, "kind": "shop"},
	{"id": "home", "name": "Home", "x": 41, "y": 42, "w": 6, "rh": 2, "fh": 3, "style": "house", "brick": "red", "door": 2, "kind": "home"},
	{"id": "neighbour", "name": "Neighbours", "x": 49, "y": 42, "w": 6, "rh": 2, "fh": 3, "style": "house", "brick": "orange", "door": 3, "kind": "home"},
	{"id": "grandpa", "name": "Grandpa’s house", "x": 57, "y": 42, "w": 6, "rh": 2, "fh": 3, "style": "house", "brick": "orange", "door": 2, "kind": "home"},
]

## v1 rooms by kind: furniture [x, y, kind] in a 9 × 7 room, and a notice board for home.
const ROOM := {
	"home": {"furn": [[1, 2, "vending"], [4, 3, "desk"], [3, 3, "chair"], [5, 3, "chair"], [7, 2, "plant"]], "board": [6, 1], "wall": "#f3e3c3", "floor": "wood"},
	"office": {"furn": [[2, 2, "desk"], [7, 2, "plant"]], "wall": "#e6ebe8", "floor": "tile"},
	"bank": {"furn": [[1, 3, "counter"], [2, 3, "counter"], [3, 3, "counter"], [5, 3, "counter"], [6, 3, "counter"], [7, 3, "counter"], [7, 5, "plant"]], "wall": "#e4ead9", "floor": "tile"},
	"shop": {"furn": [[1, 2, "shelf"], [7, 2, "shelf"], [3, 2, "counter"], [4, 2, "counter"], [5, 2, "counter"]], "wall": "#efe6d6", "floor": "wood"},
	"grocery": {"furn": [[1, 2, "shelf"], [2, 2, "shelf"], [6, 2, "shelf"], [7, 2, "shelf"], [3, 2, "counter"], [4, 2, "counter"]], "wall": "#eef0e0", "floor": "tile"},
	"diner": {"furn": [[1, 2, "counter"], [2, 2, "counter"], [6, 4, "table"], [5, 4, "chair"], [7, 4, "chair"], [7, 2, "vending"]], "wall": "#f1e1cf", "floor": "wood"},
	"yard": {"furn": [[1, 2, "crate"], [2, 2, "crate"], [7, 2, "crate"], [7, 3, "crate"], [1, 5, "cone"]], "wall": "#dcd8cf", "floor": "tile"},
	"hospital": {"furn": [[3, 2, "counter"], [4, 2, "counter"], [5, 2, "counter"], [1, 4, "bench"], [7, 4, "bench"]], "wall": "#e8f0f2", "floor": "tile"},
	"hall": {"furn": [[2, 2, "desk"], [6, 2, "desk"], [3, 5, "chair"], [5, 5, "chair"]], "wall": "#efe5d0", "floor": "wood"},
	"library": {"furn": [[1, 2, "shelf"], [2, 2, "shelf"], [6, 2, "shelf"], [7, 2, "shelf"], [7, 5, "vending"]], "wall": "#efe6d6", "floor": "wood"},
}

## v1's base townspeople, with v2 looks (skin 0–5, hair colour, hair_style 0 short · 1 long · 2 bun · 3 curly · 4 shaved, shirt, pants, outfit).
const PEOPLE := {
	"okafor": {"name": "Ms. Okafor", "role": "Career counsellor", "map": "jobcentre", "x": 4, "y": 3, "dir": "down", "look": {"skin": 3, "hair": "#231a14", "hair_style": 2, "shirt": "#8a63c8", "pants": "#3b3f5c", "glasses": true}},
	"sam": {"name": "Sam", "role": "Bank teller", "map": "bank", "x": 4, "y": 2, "dir": "down", "look": {"skin": 2, "hair": "#231a14", "hair_style": 0, "shirt": "#3f8fd2", "pants": "#2f3a5c", "outfit": "vest", "vest": "#2f3a5c"}},
	"jas": {"name": "Jas", "role": "Looking for work", "map": "servicecanada", "x": 6, "y": 4, "dir": "left", "wander": 2, "look": {"skin": 1, "hair": "#5a3a22", "hair_style": 3, "shirt": "#8a9096", "pants": "#3b3f5c"}},
	"agent": {"name": "Mr. Benoit", "role": "Service Canada", "map": "servicecanada", "x": 2, "y": 3, "dir": "down", "look": {"skin": 0, "hair": "#8a8580", "hair_style": 0, "shirt": "#2e9a9a", "pants": "#2f3a5c", "outfit": "suit", "tie": "#2f3a5c"}},
	"grandpa": {"name": "Grandpa", "role": "Retired", "map": "grandpa", "x": 2, "y": 4, "dir": "right", "look": {"skin": 1, "hair": "#d8d4cc", "hair_style": 4, "shirt": "#a07650", "pants": "#4a4a52", "glasses": true}},
	"nurse": {"name": "Nurse Kaur", "role": "Nurse", "map": "hospital", "x": 4, "y": 3, "dir": "down", "look": {"skin": 2, "hair": "#231a14", "hair_style": 2, "shirt": "#2e9a9a", "pants": "#2e7d7d", "outfit": "scrubs"}},
	"mayor": {"name": "Councillor Wright", "role": "Town council", "map": "townhall", "x": 4, "y": 3, "dir": "down", "look": {"skin": 4, "hair": "#231a14", "hair_style": 4, "shirt": "#8a9096", "pants": "#2f2f38", "outfit": "suit", "tie": "#7a2e3a"}},
	"librarian": {"name": "Mx. Lin", "role": "Librarian", "map": "library", "x": 4, "y": 3, "dir": "down", "look": {"skin": 1, "hair": "#d9709a", "hair_style": 1, "shirt": "#4caf7a", "pants": "#3b3f5c", "glasses": true}},
	"avery": {"name": "Avery", "role": "Neighbour", "map": "town", "x": 20, "y": 12, "dir": "down", "wander": 2, "look": {"skin": 0, "hair": "#c0622c", "hair_style": 1, "shirt": "#e2574c", "pants": "#3d4a6b"}},
	"dev": {"name": "Dev", "role": "Neighbour", "map": "town", "x": 33, "y": 30, "dir": "down", "wander": 2, "look": {"skin": 3, "hair": "#231a14", "hair_style": 3, "shirt": "#4caf7a", "pants": "#3d4a6b"}},
	"rosa": {"name": "Rosa", "role": "Neighbour", "map": "town", "x": 52, "y": 39, "dir": "down", "wander": 2, "look": {"skin": 2, "hair": "#5a3a22", "hair_style": 2, "shirt": "#f2a93b", "pants": "#3d4a6b"}},
	"worker": {"name": "Mo", "role": "Builder", "map": "town", "x": 15, "y": 45, "dir": "left", "wander": 2, "look": {"skin": 4, "hair": "#231a14", "hair_style": 0, "shirt": "#3f8fd2", "pants": "#2f3e5c", "outfit": "hardhat"}},
	"vendor": {"name": "Pat", "role": "Market stall", "map": "town", "x": 43, "y": 30, "dir": "down", "look": {"skin": 3, "hair": "#8a3a24", "hair_style": 1, "shirt": "#e8c23a", "pants": "#3d4a6b", "outfit": "apron", "apron": "#6e5038"}},
}

const SIGNS := [
	[35, 14, "← Library · Job Centre · Bank · Service Canada.   Town Hall · Hospital →"],
	[41, 28, "↓ Town Square · Market Lane · River Walk · Riverside Homes"],
	[36, 10, "↑ Schoolyard · Sports Field.   University · Polytechnic · Trades Centre →"],
	[41, 41, "← Industrial Yard · Home & Hearth.   Home · Grandpa · Community Garden →"],
	[13, 51, "Riverside Park. The footbridge goes back to town ↑"],
	[50, 36, "Town Square. The fountain was built in 1912. Please do not swim in it."],
]

var ground := []
var over := []        # something stands here (a building, a tree, a lamp…)
var solid := []
var keep := {}        # paths and doorsteps: nothing may be put here
var props := []
var draws := []
var buildings := []
var spots := {}


static func _i(x: int, y: int) -> int:
	return y * W + x


static func _in(x: int, y: int) -> bool:
	return x >= 0 and y >= 0 and x < W and y < H


func _g(x: int, y: int, k: String) -> void:
	if _in(x, y):
		ground[_i(x, y)] = k


func _rect(x0: int, y0: int, w: int, h: int, k: String) -> void:
	for y in range(y0, y0 + h):
		for x in range(x0, x0 + w):
			_g(x, y, k)


func _free(x: int, y: int) -> bool:
	return _in(x, y) and not over[_i(x, y)] and not solid[_i(x, y)] and not keep.has(Vector2i(x, y))


func _put(x: int, y: int, p: Dictionary, is_solid := true) -> bool:
	if not _free(x, y):
		return false
	over[_i(x, y)] = true
	if is_solid:
		solid[_i(x, y)] = true
	p.x = x
	p.y = y
	p.solid = is_solid
	props.append(p)
	return true


func _tree(x: int, y: int, k: int) -> void:
	_put(x, y, {"k": "tree", "v": k % 3})


func _big_tree(x: int, y: int) -> void:
	if _free(x, y) and _free(x, y - 1):
		over[_i(x, y - 1)] = true
		solid[_i(x, y - 1)] = true
		_put(x, y, {"k": "big_tree"})


func _lamp(x: int, y: int, face: int) -> void:
	if _free(x, y):
		over[_i(x, y - 1)] = true   # the lamp head hangs over the tile above
		_put(x, y, {"k": "lamp", "face": face})


func _path(x0: int, y0: int, x1: int, y1: int) -> void:
	for y in range(mini(y0, y1), maxi(y0, y1) + 1):
		for x in range(mini(x0, x1), maxi(x0, x1) + 1):
			if solid[_i(x, y)] or over[_i(x, y)]:
				continue   # paths never run through a building
			_g(x, y, "path")
			keep[Vector2i(x, y)] = true


func _building(b: Dictionary) -> void:
	var h: int = b.rh + b.fh
	var dx: int = b.x + b.door
	var by: int = b.y + h - 1
	for y in range(b.y, b.y + h):
		for x in range(b.x, b.x + b.w):
			over[_i(x, y)] = true
			solid[_i(x, y)] = true
	var d := {"id": b.id, "x": b.x, "y": b.y, "w": b.w, "h": h, "door": dx, "to": b.id, "sign": b.name,
		"style": b.style, "brick": b.brick, "floors": clampf(b.fh * 0.6, 1.5, 4.2)}
	for k in ["emblem", "awning", "stripes"]:
		if b.has(k):
			d[k] = b[k]
	buildings.append(d)
	spots[b.id] = {"x": dx, "y": by + 1, "label": b.name}
	keep[Vector2i(dx, by + 1)] = true
	if ground[_i(dx, by + 1)] == "grass":
		_g(dx, by + 1, "path")


## v1's fixed scatter (the same trees every time): a hash of the tile, 32-bit like Math.imul.
static func _u32(v: int) -> int:
	return v & 0xffffffff


static func _imul(a: int, b: int) -> int:
	return _u32(_u32(a) * _u32(b))


static func _hash(x: int, y: int) -> int:
	var h := _u32(_imul(x, 374761393) + _imul(y, 668265263))
	h = _imul(h ^ (h >> 13), 1274126177)
	return _u32(h ^ (h >> 16)) % 100


func build_town() -> Dictionary:
	ground.resize(W * H); ground.fill("grass")
	over.resize(W * H); over.fill(false)
	solid.resize(W * H); solid.fill(false)
	# roads and walks
	for x in W:
		_g(x, 23, "walk"); _g(x, 24, "road"); _g(x, 25, "line"); _g(x, 26, "road"); _g(x, 27, "walk")   # Main Street
	_rect(0, 38, W, 2, "walk")                                                                        # Market Lane
	for y in range(1, H - 1):
		for x in range(37, 40):
			_g(x, y, "road")                                                                          # the Avenue
	# the river and Riverside Park
	for x in W:
		for y in [48, 49, 50]:
			_g(x, y, "water")
			solid[_i(x, y)] = true
	for br in [[37, 3, "road"], [14, 2, "path"], [64, 2, "path"]]:
		for x in range(br[0], br[0] + br[1]):
			for y in range(48, 51):
				_g(x, y, br[2])
				solid[_i(x, y)] = false
				keep[Vector2i(x, y)] = true
		draws.append({"kind": "bridge", "x": br[0], "y": 48, "w": br[1], "h": 3})
	# Town Square (fountain), the sports field, the community garden
	_rect(41, 28, 16, 10, "plaza")
	_rect(47, 31, 4, 4, "plaza")
	for y in range(31, 35):
		for x in range(47, 51):
			solid[_i(x, y)] = true
	draws.append({"kind": "fountain", "x": 47, "y": 31, "w": 4, "h": 4})
	_rect(15, 2, 13, 8, "lawn")
	draws.append({"kind": "field", "x": 15, "y": 2, "w": 13, "h": 8})
	for x in range(64, 76):
		over[_i(x, 41)] = true
		solid[_i(x, 41)] = true
		props.append({"k": "fence", "x": x, "y": 41, "solid": true})
	var beds := [[66, 43], [68, 43], [70, 43], [72, 43], [66, 45], [68, 45], [72, 45]]
	for p in beds:
		over[_i(p[0], p[1])] = true
		solid[_i(p[0], p[1])] = true
		props.append({"k": "produce", "x": p[0], "y": p[1], "solid": true})
	# buildings
	for b in BUILDINGS:
		_building(b)
	# paths: College Walk, River Walk, the park trail, and a path between every block
	_path(1, 11, W - 2, 12); _path(1, 47, W - 2, 47); _path(1, 54, W - 2, 54); _path(14, 51, 15, 53); _path(64, 51, 65, 53)
	for x in range(37, 40):
		for y in [11, 12, 38, 39, 47, 54]:
			_g(x, y, "cross_v")
	for cx in [8, 18, 48, 69]:
		for y in range(24, 27):
			_g(cx, y, "cross_h")
	for px in [1, 9, 18, 27, 36, 40, 55, 56, 69]:
		_path(px, 13, px, 22)
	for px in [1, 10, 18, 27, 36, 40, 57, 65, 71]:
		_path(px, 28, px, 37)
	for px in [1, 14, 15, 24, 25, 36, 40, 47, 48, 55, 56, 63]:
		_path(px, 40, px, 46)
	# decor. Nothing goes on a path or a doorstep.
	var k := 0
	for x in W:
		_tree(x, 0, k); k += 1
		_tree(x, H - 1, k); k += 1
	for y in range(1, H - 1):
		_tree(0, y, k); k += 1
		_tree(W - 1, y, k); k += 1
	for lx in [4, 13, 30, 44, 52, 61, 73]:
		_lamp(lx, 23, 1)
		_lamp(lx + 2, 27, -1)
	var i := 0
	for p in [[3, 13], [6, 13], [12, 14], [15, 14], [22, 13], [31, 14], [34, 15], [42, 10], [62, 10], [74, 10], [14, 10]]:
		_tree(p[0], p[1], i); i += 1
	i = 0
	for p in [[7, 29], [16, 29], [24, 29], [33, 29], [62, 29], [75, 29], [44, 41], [52, 41], [60, 41], [3, 28], [29, 28]]:
		_tree(p[0], p[1], i); i += 1
	for p in [[44, 29], [53, 29], [44, 36], [53, 36]]:
		_put(p[0], p[1], {"k": "planter"})
	for p in [[46, 30], [51, 30], [46, 35], [51, 35]]:
		_put(p[0], p[1], {"k": "bench", "yaw": 0.0 if p[1] > 32 else PI})
	i = 0
	for p in [[42, 30], [55, 30], [42, 34], [55, 34]]:   # market stalls
		_put(p[0], p[1], {"k": "produce" if i % 2 == 0 else "crate"}); i += 1
	for x in range(16, 27, 2):
		_put(x, 10, {"k": "bleachers", "w": 1})                                  # bleachers by the field
	_put(7, 23, {"k": "bus_stop"}); _put(6, 23, {"k": "bench_metal", "yaw": 0.0})   # the bus stop by the Job Centre
	_put(25, 23, {"k": "bin"}); _put(35, 23, {"k": "mailbox"}); _put(60, 27, {"k": "hydrant"})
	i = 0
	for p in [[5, 46], [6, 46], [21, 46], [34, 46]]:
		_put(p[0], p[1], {"k": "cone" if i < 3 else "barrier"}); i += 1
	for p in [[4, 53], [10, 53], [22, 53], [30, 53], [45, 53], [52, 53], [70, 53], [74, 53], [58, 53]]:
		_big_tree(p[0], p[1])
	i = 0
	for p in [[18, 52], [26, 52], [42, 52], [50, 52], [60, 52], [68, 52]]:
		_put(p[0], p[1], {"k": "picnic" if i % 2 else "bench", "yaw": 0.0}); i += 1
	# street signs (talk to read them)
	i = 0
	for sgn in SIGNS:
		if _put(sgn[0], sgn[1], {"k": "sign", "id": "sign_%d" % i, "label": "Sign", "text": sgn[2]}):
			pass
		i += 1
	# a scatter of trees on open grass: never beside a path, a walk or a doorstep, never where a person stands
	var stand := {Vector2i(44, 32): true, Vector2i(15, 23): true}   # where missions may put people
	for id in PEOPLE:
		if PEOPLE[id].map == "town":
			stand[Vector2i(PEOPLE[id].x, PEOPLE[id].y)] = true
	var open := func(x: int, y: int) -> bool: return ground[_i(x, y)] == "grass" and not keep.has(Vector2i(x, y))
	for y in range(2, H - 2):
		for x in range(2, W - 2):
			if not _free(x, y) or not open.call(x, y) or stand.has(Vector2i(x, y)) or _hash(x, y) > 8:
				continue
			if x >= 15 and x <= 27 and y >= 2 and y <= 9:
				continue   # keep the sports field clear
			if not open.call(x - 1, y) or not open.call(x + 1, y) or not open.call(x, y - 1) or not open.call(x, y + 1):
				continue
			_tree(x, y, x + y)
	var districts := [
		{"name": "Town Square", "x": 41, "y": 28, "w": 16, "h": 10}, {"name": "Riverside Park", "x": 0, "y": 48, "w": W, "h": 10, "lx": 36, "ly": 52.5},
		{"name": "Sports Field", "x": 15, "y": 2, "w": 13, "h": 8}, {"name": "Community Garden", "x": 64, "y": 40, "w": 13, "h": 7},
		{"name": "College Hill", "x": 40, "y": 0, "w": 38, "h": 11, "lx": 60, "ly": 1.0}, {"name": "Schoolyard", "x": 0, "y": 0, "w": 40, "h": 11, "lx": 8, "ly": 1.0},
		{"name": "College Walk", "x": 0, "y": 11, "w": W, "h": 2, "lx": 28, "ly": 12.0}, {"name": "Main Street", "x": 0, "y": 13, "w": W, "h": 15, "lx": 28, "ly": 25.5},
		{"name": "Market Lane", "x": 0, "y": 28, "w": W, "h": 12, "lx": 20, "ly": 38.6},
		{"name": "Riverside Homes", "x": 40, "y": 40, "w": 38, "h": 8, "lx": 52, "ly": 40.6}, {"name": "Industrial Yard", "x": 0, "y": 40, "w": 40, "h": 8, "lx": 20, "ly": 47.0},
	]
	return {"name": "CEFL Town", "w": W, "h": H, "ground": ground, "buildings": buildings, "props": props, "draws": draws,
		"districts": districts, "spots": spots}


## A 9 × 7 room for a building, as v1 builds it.
static func build_room(b: Dictionary) -> Dictionary:
	var t: Dictionary = ROOM.get(b.kind, ROOM.office)
	var props := []
	# counters and shelves next to each other in a row join into one long piece
	var furn: Array = t.furn.duplicate()
	furn.sort_custom(func(a, c): return a[1] * 100 + a[0] < c[1] * 100 + c[0])
	var i := 0
	while i < furn.size():
		var f: Array = furn[i]
		var w := 1
		if f[2] in ["counter", "shelf"]:
			while i + w < furn.size() and furn[i + w][2] == f[2] and furn[i + w][1] == f[1] and furn[i + w][0] == f[0] + w:
				w += 1
		var p := {"k": f[2], "x": f[0], "y": f[1], "w": w, "solid": true}
		if f[2] == "bench":
			p.yaw = PI / 2.0 if f[0] < 4 else -PI / 2.0
		props.append(p)
		i += w
	if t.has("board"):
		props.append({"k": "board", "x": t.board[0], "y": t.board[1], "id": "plan_wall", "label": "My Plan wall", "solid": true})
	props.append({"k": "mat", "x": 4, "y": 5, "solid": false})
	var windows := [2, 6].filter(func(wx): return not (t.has("board") and t.board[0] == wx))
	for id in PEOPLE:   # a rug under the person who works here
		var pp: Dictionary = PEOPLE[id]
		if pp.map == b.id:
			props.push_front({"k": "rug", "x": pp.x, "y": pp.y, "solid": false, "color": ["#b85a4a", "#4f7ba3", "#6f8f62", "#8a63c8"][id.length() % 4]})
	return {"name": b.name, "w": 9, "h": 7, "room": {"floor": t.floor, "wall": t.wall, "exit": 4, "windows": windows}, "props": props}


static func maps() -> Dictionary:
	var out := {"town": load("res://games/cefl_town/town_v1.gd").new().build_town()}
	for b in BUILDINGS:
		out[b.id] = build_room(b)
	return out
