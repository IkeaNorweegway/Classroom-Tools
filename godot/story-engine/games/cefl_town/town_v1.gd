# What CEFL Town keeps from v1 (public/materials/cefl/town/world.js): the 26 buildings (names, room kinds),
# their 9 × 7 rooms and furniture, and the base townspeople with v2 looks. The outdoor areas are in areas.gd.
# No nodes.
extends RefCounted


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
