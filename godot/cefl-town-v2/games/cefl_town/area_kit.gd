# Builds one area of the CEFL Town world as a v2 map dictionary: streets with lanes, crossings with lights,
# buildings, street furniture, parked cars, traffic, walkers and the links to the next area.
# Every area is W × H tiles. The two through streets line up across areas, so walking off an edge
# carries on along the same street: Main Street runs east–west on rows MAIN_Y … MAIN_Y+7, the Avenue
# north–south on columns AVE_X … AVE_X+7.
#
# A street is 8 tiles across: sidewalk, sidewalk, parking lane, lane, lane, bike lane, sidewalk, sidewalk.
# Traffic keeps right: on an east–west street westbound cars use the north lane, eastbound the south one.
extends RefCounted

const W := 60
const H := 45
const MAIN_Y := 18
const AVE_X := 26

var id := ""
var name := ""
var g := []                 # ground kind per tile
var occ := {}               # Vector2i → true: something stands here
var keep := {}              # Vector2i → true: nothing may be put here (doorsteps, crossings)
var buildings := []
var props := []
var draws := []
var links := []
var spots := {}
var districts := []
var lanes := []
var cars := []
var walkers := []
var ew := []                # east–west streets: [y, x0, x1]
var ns := []                # north–south streets: [x, y0, y1]
var _k := 0


func _init(id_: String, name_: String, base := "grass") -> void:
	id = id_
	name = name_
	g.resize(W * H)
	g.fill(base)


func _in(x: int, y: int) -> bool:
	return x >= 0 and y >= 0 and x < W and y < H


func set_g(x: int, y: int, k: String) -> void:
	if _in(x, y):
		g[y * W + x] = k


func get_g(x: int, y: int) -> String:
	return g[y * W + x] if _in(x, y) else ""


func fill(k: String, x: int, y: int, w: int, h: int) -> void:
	for yy in range(y, y + h):
		for xx in range(x, x + w):
			set_g(xx, yy, k)


## Within 3 tiles of the area's edge, where people arrive from the next area: no street furniture there.
func near_edge(x: int, y: int) -> bool:
	return x < 3 or y < 3 or x > W - 4 or y > H - 4


func is_free(x: int, y: int) -> bool:
	var v := Vector2i(x, y)
	return _in(x, y) and not occ.has(v) and not keep.has(v)


func _take(x: int, y: int, w := 1, h := 1) -> void:
	for yy in range(y, y + h):
		for xx in range(x, x + w):
			occ[Vector2i(xx, yy)] = true


# ── Streets ──
func street_ew(y: int, x0 := 0, x1 := W) -> void:
	for x in range(x0, x1):
		for r in [0, 1, 6, 7]:
			set_g(x, y + r, "walk")
		set_g(x, y + 2, "road")
		set_g(x, y + 3, "dash_s")
		set_g(x, y + 4, "road")
		set_g(x, y + 5, "bike")
	ew.append([y, x0, x1])
	lanes.append({"axis": "x", "dir": -1, "fixed": y + 3.5, "from": x1 + 6, "to": x0 - 6, "road": "ew", "stops": []})
	lanes.append({"axis": "x", "dir": 1, "fixed": y + 4.5, "from": x0 - 6, "to": x1 + 6, "road": "ew", "stops": []})


func street_ns(x: int, y0 := 0, y1 := H) -> void:
	for y in range(y0, y1):
		for c in [0, 1, 6, 7]:
			if not get_g(x + c, y) in ["road", "dash_s", "bike"]:
				set_g(x + c, y, "walk")
		set_g(x + 2, y, "road")
		set_g(x + 3, y, "dash_e")
		set_g(x + 4, y, "road")
		set_g(x + 5, y, "bike_v")
	ns.append([x, y0, y1])
	lanes.append({"axis": "z", "dir": 1, "fixed": x + 3.5, "from": y0 - 6, "to": y1 + 6, "road": "ns", "stops": []})
	lanes.append({"axis": "z", "dir": -1, "fixed": x + 4.5, "from": y1 + 6, "to": y0 - 6, "road": "ns", "stops": []})


## Where streets cross: an open box of road, crosswalks on all four legs, lights on the corners, stop lines.
func crossings() -> void:
	for e in ew:
		for n in ns:
			var x: int = n[0]; var y: int = e[0]
			if x < e[1] or x + 8 > e[2] or y < n[1] or y + 8 > n[2]:
				continue
			for yy in range(y + 2, y + 6):
				for xx in range(x + 2, x + 6):
					set_g(xx, yy, "road")
				for xx in [x, x + 1, x + 6, x + 7]:
					set_g(xx, yy, "cross_h")
					keep[Vector2i(xx, yy)] = true
			for xx in range(x + 2, x + 6):
				for yy in [y, y + 1, y + 6, y + 7]:
					set_g(xx, yy, "cross_v")
					keep[Vector2i(xx, yy)] = true
			for yy in [y, y + 1, y + 6, y + 7]:
				for xx in [x, x + 1, x + 6, x + 7]:
					set_g(xx, yy, "walk")
			for L in lanes:
				if L.axis == "x" and absf(float(L.fixed) - (y + 4.0)) < 1.0:
					L.stops.append(x - 1.0 if L.dir > 0 else x + 9.0)
				elif L.axis == "z" and absf(float(L.fixed) - (x + 4.0)) < 1.0:
					L.stops.append(y - 1.0 if L.dir > 0 else y + 9.0)
			prop("signal", x + 1, y + 1, {"dx": 1, "dz": 0})
			prop("signal", x + 6, y + 6, {"dx": -1, "dz": 0})
			prop("signal", x + 6, y + 1, {"dx": 0, "dz": 1})
			prop("signal", x + 1, y + 6, {"dx": 0, "dz": -1})


# ── Buildings ──
## A building you can go into (its room is `id`), or with to = false a building that is only scenery.
## face "s" (the default) fronts the street below it; "n" fronts the street above it.
func building(bid: String, sign: String, x: int, y: int, w: int, h: int, door: int, style: String, more := {}) -> void:
	var b := {"id": bid, "x": x, "y": y, "w": w, "h": h, "door": x + door, "sign": sign, "style": style}
	if more.get("to", true):
		b.to = bid
	for k in more:
		if k != "to":
			b[k] = more[k]
	buildings.append(b)
	_take(x, y, w, h)
	var north: bool = b.get("face", "s") == "n"
	var step := Vector2i(x + door, y - 1 if north else y + h)
	keep[step] = true
	keep[step + Vector2i(0, -1 if north else 1)] = true
	if b.has("to"):
		spots[bid] = {"x": step.x, "y": step.y, "label": sign}


# ── Things ──
func prop(k: String, x: int, y: int, more := {}, solid := true) -> bool:
	var w := int(more.get("w", 1)); var h := int(more.get("h", 1))
	for yy in range(y, y + h):
		for xx in range(x, x + w):
			if not is_free(xx, yy):
				return false
	var p := {"k": k, "x": x, "y": y, "solid": solid}
	for key in more:
		p[key] = more[key]
	props.append(p)
	if solid:
		_take(x, y, w, h)
	return true


## Street furniture along an east–west street's curb rows (trees, lamps, bins, hydrants), skipping doorsteps.
func furnish_ew(y: int, x0 := 0, x1 := W, north := true, south := true) -> void:
	for side in [[north, y + 1, 1], [south, y + 6, -1]]:
		if not side[0]:
			continue
		var row: int = side[1]
		for x in range(x0 + 2, x1 - 1):
			if not is_free(x, row) or keep.has(Vector2i(x, row - side[2])) or near_edge(x, row):
				continue
			var m := posmod(x, 12)
			if m == 2 or m == 8:
				prop("street_tree", x, row, {"v": x})
			elif m == 5:
				prop("lamp", x, row, {"face": side[2]})
			elif m == 10 and posmod(x * 7 + row, 3) == 0:
				prop("bin", x, row)
			elif m == 11 and posmod(x + row, 5) == 0:
				prop("hydrant", x, row)


func furnish_ns(x: int, y0 := 0, y1 := H, west := true, east := true) -> void:
	for side in [[west, x + 1], [east, x + 6]]:
		if not side[0]:
			continue
		var col: int = side[1]
		for y in range(y0 + 2, y1 - 1):
			if not is_free(col, y) or not get_g(col, y) == "walk" or near_edge(col, y):
				continue
			var m := posmod(y, 10)
			if m == 3:
				prop("street_tree", col, y, {"v": y})
			elif m == 7:
				prop("lamp", col, y, {"face": 1})


## Parked cars in an east–west street's parking lane, between x0 and x1, now and then.
func park_ew(y: int, x0: int, x1: int, every := 5) -> void:
	var cols := ["#9fb0bf", "#c9b28d", "#8e9e88", "#b5837a", "#d6d0c4", "#7e8fa6", "#b9a7c9", "#a9a39b"]
	var x := x0
	while x + 2 <= x1:
		if posmod(x * 13 + y, 3) != 0 and not near_edge(x, y) and not near_edge(x + 1, y):
			prop("car", x, y + 2, {"w": 2, "yaw": PI, "color": cols[posmod(x + y, cols.size())], "v": posmod(x, 3)})
		x += every


func park_ns(x: int, y0: int, y1: int, every := 5) -> void:
	var cols := ["#c7a06e", "#a9b4c2", "#9fb7a8", "#c4b9a0", "#9fb0bf", "#b5837a"]
	var y := y0
	while y + 2 <= y1:
		if posmod(y * 11 + x, 3) != 0 and not near_edge(x, y) and not near_edge(x, y + 1):
			prop("car", x + 2, y, {"h": 2, "yaw": -PI / 2.0, "color": cols[posmod(x + y, cols.size())], "v": posmod(y, 3)})
		y += every


## Moving traffic: n cars spread along each lane.
func traffic(n := 2) -> void:
	var cols := ["#d6d0c4", "#7e8fa6", "#c7a06e", "#a9a39b", "#b9a7c9", "#9fb7a8", "#c9a98d", "#a9b4c2", "#c4b9a0", "#b8574a"]
	for i in lanes.size():
		var L: Dictionary = lanes[i]
		var lim := float(W if L.axis == "x" else H)
		if float(L.from) >= 0.0 and float(L.from) <= lim or float(L.to) >= 0.0 and float(L.to) <= lim:
			continue   # a street that ends inside the area gets parked cars only: nobody drives into the river
		var span := absf(float(L.to) - float(L.from))
		for j in n:
			cars.append([i, float(L.from) + float(L.dir) * span * (j + 0.3 * float(i % 3)) / n, cols[(i * 3 + j) % cols.size()]])


## A walker going back and forth (or round) through tile centres.
func walker(look: Dictionary, pts: Array, loop := false, speed := 1.0) -> void:
	var ps := []
	for q in pts:
		ps.append([float(q[0]) + 0.5, float(q[1]) + 0.5])
	walkers.append({"look": look, "pts": ps, "loop": loop, "speed": speed})


const LOOKS := [
	{"skin": 1, "hair": 2, "hair_style": 1, "shirt": 7, "pants": 0}, {"skin": 4, "hair": 0, "hair_style": 3, "shirt": 3, "pants": 1},
	{"skin": 0, "hair": 3, "hair_style": 2, "shirt": 4, "pants": 2}, {"skin": 2, "hair": 1, "hair_style": 0, "shirt": 1, "pants": 3},
	{"skin": 5, "hair": 6, "hair_style": 4, "shirt": 2, "pants": 0}, {"skin": 3, "hair": 0, "hair_style": 1, "shirt": 0, "pants": 4},
	{"skin": 1, "hair": 4, "hair_style": 0, "shirt": 6, "pants": 2, "glasses": true}, {"skin": 2, "hair": 5, "hair_style": 2, "shirt": 5, "pants": 1},
]

func look(i: int) -> Dictionary:
	return LOOKS[posmod(i, LOOKS.size())]


# ── Edges: walking off one fades into the next area, on the same street ──
func edge(side: String, to: String) -> void:
	match side:
		"w": links.append({"x": 0, "y": MAIN_Y, "h": 8, "to": to, "at": [W - 2, MAIN_Y], "dir": "left"})
		"e": links.append({"x": W - 1, "y": MAIN_Y, "h": 8, "to": to, "at": [1, MAIN_Y], "dir": "right"})
		"n": links.append({"x": AVE_X, "y": 0, "w": 8, "to": to, "at": [AVE_X, H - 2], "dir": "up"})
		"s": links.append({"x": AVE_X, "y": H - 1, "w": 8, "to": to, "at": [AVE_X, 1], "dir": "down"})


## The arch over the street where this area meets the next one, just inside this area's edge.
## names: what the sign says from each side ({ this area id: next area's name, next area id: this area's name }).
func gate(side: String, to: String, to_name: String, colour: String) -> void:
	var names := {id: to_name, to: name}
	var p := {"names": names, "color": colour, "span": 8}
	match side:
		"e": p.merge({"x": W - 3, "y": MAIN_Y, "axis": "z"})
		"w": p.merge({"x": 2, "y": MAIN_Y, "axis": "z"})
		"n": p.merge({"x": AVE_X, "y": 2, "axis": "x"})
		"s": p.merge({"x": AVE_X, "y": H - 3, "axis": "x"})
	var x: int = p.x; var y: int = p.y
	var ends := [Vector2i(x, y), Vector2i(x + 7, y)] if p.axis == "x" else [Vector2i(x, y), Vector2i(x, y + 7)]
	for e in ends:
		occ.erase(e)
		props.append({"k": "gate_post", "x": e.x, "y": e.y, "solid": true})
		occ[e] = true
	p.k = "gate"
	p.solid = false
	props.append(p)


func district(dname: String, x: int, y: int, w: int, h: int, lx := -1.0, ly := -1.0) -> void:
	var d := {"name": dname, "x": x, "y": y, "w": w, "h": h}
	if lx >= 0.0:
		d.lx = lx
		d.ly = ly
	districts.append(d)


## Trees round the open edges of the area (not across a street that leaves it).
func edge_trees() -> void:
	for x in W:
		for y in [0, H - 1]:
			if get_g(x, y) == "grass":
				prop("tree", x, y, {"v": x + y})
	for y in H:
		for x in [0, W - 1]:
			if get_g(x, y) == "grass":
				prop("tree", x, y, {"v": x + y})


## A scatter of trees on open grass, the same every time.
func scatter_trees(x0: int, y0: int, x1: int, y1: int, pct := 8) -> void:
	for y in range(y0, y1):
		for x in range(x0, x1):
			if get_g(x, y) != "grass" or not is_free(x, y):
				continue
			var ok := true
			for d in [Vector2i(1, 0), Vector2i(-1, 0), Vector2i(0, 1), Vector2i(0, -1)]:
				if get_g(x + d.x, y + d.y) != "grass" or keep.has(Vector2i(x + d.x, y + d.y)):
					ok = false
			if ok and posmod(int(("%d,%d,%s" % [x, y, id]).hash()), 100) < pct:
				prop("big_tree" if posmod(x * 3 + y, 4) == 0 else "tree", x, y, {"v": x * 7 + y})


func build() -> Dictionary:
	return {"name": name, "w": W, "h": H, "ground": g, "buildings": buildings, "props": props, "draws": draws,
		"districts": districts, "spots": spots, "links": links,
		"traffic": {"lanes": lanes, "cars": cars, "phases": [14.0, 2.5, 10.0, 2.5]}, "walkers": walkers}
