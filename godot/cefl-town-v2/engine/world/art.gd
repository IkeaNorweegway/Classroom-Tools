# Flat illustrated art, drawn in code: no image files, sharp at any zoom.
# Everything is in logical pixels on a 32 px tile. Each function draws on the CanvasItem it is given,
# from inside that item's _draw(). Coordinates: ground() and room() use map coordinates;
# building(), prop() and person() use the thing's own top-left corner as (0, 0).
extends RefCounted

const S := 32.0

const PAL := {
	"grass": Color("#9fcf7a"), "grass2": Color("#8cc26a"), "road": Color("#5d6370"), "road_line": Color("#f2e7c9"),
	"walk": Color("#e4ddd0"), "walk2": Color("#d6cdbd"), "path": Color("#e9d9b4"), "path2": Color("#dcc89c"),
	"plaza": Color("#efe4cf"), "plaza2": Color("#e2d3b6"), "wood": Color("#d9a86c"), "wood2": Color("#c8945a"),
	"tile": Color("#f1ece2"), "tile2": Color("#ddd5c6"), "water": Color("#7cc3e0"), "ink": Color("#2b2622"),
	"shadow": Color(0.16, 0.12, 0.08, 0.18), "leaf": Color("#5fa553"), "leaf2": Color("#4b8e44"), "trunk": Color("#8a5a36"),
	"window": Color("#bfe3f2"), "frame": Color("#fffaf0"), "cream": Color("#fffaf0"),
}
const SKIN := ["#f6d5b8", "#e8b98f", "#c98d5f", "#a86b42", "#7a4a2c", "#5a3520"]
const HAIR := ["#2b1d14", "#5a3a22", "#a0622c", "#d9a548", "#8a8580", "#c0392b", "#1d2a4a"]
const SHIRT := ["#e2574c", "#f2a93b", "#3f8fd2", "#4caf7a", "#8a63c8", "#f4f1ea", "#2f3640", "#e76fa3"]
const PANTS := ["#2f3e5c", "#4a4a52", "#7a5a3a", "#2e5e4e", "#1f1f24"]
const HAIR_STYLES := ["Short", "Long", "Bun", "Curly", "Shaved"]

## Things you cannot walk through.
const SOLID := {"tree": true, "bush": true, "bench": true, "lamp": true, "counter": true, "shelf": true, "table": true, "plant": true,
	"fridge": true, "crate": true, "pallet": true, "stall": true, "board": true, "fountain": true, "sofa": true, "bed": true, "sign": true, "phone": true}


# ── Shape helpers ──
static func shade(c: Color, f: float) -> Color:
	return c.lerp(Color.BLACK if f < 0.0 else Color.WHITE, absf(f))


static func rect(ci: CanvasItem, x: float, y: float, w: float, h: float, c: Color) -> void:
	ci.draw_rect(Rect2(x, y, w, h), c)


static func circ(ci: CanvasItem, x: float, y: float, r: float, c: Color) -> void:
	ci.draw_circle(Vector2(x, y), r, c, true, -1.0, true)


static func ell(ci: CanvasItem, cx: float, cy: float, rx: float, ry: float, c: Color) -> void:
	var pts := PackedVector2Array()
	for i in 24:
		var a := TAU * i / 24.0
		pts.append(Vector2(cx + cos(a) * rx, cy + sin(a) * ry))
	ci.draw_colored_polygon(pts, c)


## Rounded rectangle. r may be a number or [top-left, top-right, bottom-right, bottom-left].
static func rr(ci: CanvasItem, x: float, y: float, w: float, h: float, r, c: Color) -> void:
	var rs: Array = r if r is Array else [r, r, r, r]
	var m := minf(w, h) / 2.0
	var pts := PackedVector2Array()
	var corners := [[x + w, y + h, 0.0], [x, y + h, 0.5], [x, y, 1.0], [x + w, y, 1.5]] # br, bl, tl, tr with start angles (× PI)
	var radii := [float(rs[2]), float(rs[3]), float(rs[0]), float(rs[1])]
	for i in 4:
		var rad := minf(radii[i], m)
		var cx: float = corners[i][0] + (-rad if i == 0 or i == 3 else rad)
		var cy: float = corners[i][1] + (-rad if i <= 1 else rad)
		if rad <= 0.0:
			pts.append(Vector2(corners[i][0], corners[i][1]))
			continue
		for j in 5:
			var a: float = PI * corners[i][2] + PI * 0.5 * j / 4.0
			pts.append(Vector2(cx + cos(a) * rad, cy + sin(a) * rad))
	ci.draw_colored_polygon(pts, c)


static func half_disc(ci: CanvasItem, cx: float, cy: float, r: float, from: float, to: float, c: Color) -> void:
	var pts := PackedVector2Array([Vector2(cx, cy)])
	for i in 13:
		var a := from + (to - from) * i / 12.0
		pts.append(Vector2(cx + cos(a) * r, cy + sin(a) * r))
	ci.draw_colored_polygon(pts, c)


static func noise(tx: int, ty: int, k := 0) -> float:
	return float(("%d,%d,%d" % [tx, ty, k]).hash() & 0xffff) / 65535.0


# ── Ground (map coordinates) ──
static func ground(ci: CanvasItem, kind: String, tx: int, ty: int, road_line := false) -> void:
	var px := tx * S
	var py := ty * S
	var n := noise(tx, ty)
	match kind:
		"grass":
			rect(ci, px, py, S, S, PAL.grass)
			if n < 0.35:
				rect(ci, px + 6 + n * 30, py + 10 + n * 20, 2, 5, PAL.grass2)
				rect(ci, px + 9 + n * 30, py + 12 + n * 20, 2, 4, PAL.grass2)
			if n > 0.93:
				circ(ci, px + 10, py + 22, 2.2, Color("#fff6d6"))
				circ(ci, px + 22, py + 9, 2, Color("#f7b7c8"))
		"road":
			rect(ci, px, py, S, S, PAL.road)
			if road_line:
				rect(ci, px + 6, py + S - 2, 18, 4, PAL.road_line)
		"walk":
			rect(ci, px, py, S, S, PAL.walk)
			rect(ci, px, py + S - 1, S, 1, PAL.walk2)
			rect(ci, px + S - 1, py, 1, S, PAL.walk2)
		"path":
			rect(ci, px, py, S, S, PAL.path)
			if n < 0.5:
				rr(ci, px + 4 + n * 12, py + 6 + n * 14, 10, 7, 3, PAL.path2)
		"plaza":
			rect(ci, px, py, S, S, PAL.plaza if (tx + ty) % 2 else PAL.plaza2)
		"wood":
			rect(ci, px, py, S, S, PAL.wood)
			rect(ci, px, py + 15, S, 1, PAL.wood2)
			rect(ci, px, py + 31, S, 1, PAL.wood2)
			rect(ci, px + (10 if ty % 2 else 24), py, 1, 15, PAL.wood2)
			rect(ci, px + (26 if ty % 2 else 6), py + 16, 1, 15, PAL.wood2)
		"tile":
			rect(ci, px, py, S, S, PAL.tile if (tx + ty) % 2 else PAL.tile2)
		"concrete":
			rect(ci, px, py, S, S, Color("#cfd3d6"))
			if n < 0.2:
				rect(ci, px + 5, py + 20, 12, 1, Color("#b8bec3"))
		"water":
			rect(ci, px, py, S, S, PAL.water)
			if n < 0.3:
				rect(ci, px + 8, py + 12, 10, 2, Color("#a8dbef"))
		_:
			rect(ci, px, py, S, S, Color("#cccccc"))


# ── Rooms: a back wall (rows 0–1), side walls, and a front wall with the exit as a gap ──
static func room(ci: CanvasItem, w: int, h: int, wall: Color, exit_x: int) -> void:
	var trim := shade(wall, -0.25)
	var W := w * S
	var H := h * S
	rect(ci, 0, 0, W, S * 2, wall)
	rect(ci, 0, S * 2 - 5, W, 5, trim)
	var i := 2
	while i < w - 2:
		rr(ci, i * S + 4, 10, S * 1.5, S * 1.05, 3, PAL.frame)
		rr(ci, i * S + 8, 14, S * 1.5 - 8, S * 1.05 - 8, 2, PAL.window)
		i += 4
	rect(ci, 0, 0, S, H, shade(wall, -0.1))
	rect(ci, W - S, 0, S, H, shade(wall, -0.1))
	rect(ci, S - 3, S * 2, 3, H - S * 2, trim)
	rect(ci, W - S, S * 2, 3, H - S * 2, trim)
	rect(ci, 0, H - S * 0.55, W, S * 0.55, shade(wall, -0.18))
	if exit_x >= 0:
		rect(ci, exit_x * S, H - S * 0.55, S, S * 0.55, Color("#8a6a48"))
		rr(ci, exit_x * S + 3, H - S * 0.48, S - 6, S * 0.4, 3, Color("#b8864f"))


# ── Buildings: footprint w × h tiles; roof on top, a two-row wall front at the bottom ──
static func building(ci: CanvasItem, b: Dictionary, font: Font) -> void:
	var bw: int = b.w
	var w := bw * S
	var h: float = b.h * S
	var front := 2 * S
	var roof_h := h - front
	var wall := Color(b.get("wall", "#f4e2c4"))
	var roof := Color(b.get("roof", "#c4553f"))
	ell(ci, w / 2, h + 2, w / 2 + 4, 6, PAL.shadow)
	rect(ci, 0, roof_h, w, front, wall)
	rect(ci, 0, h - 4, w, 4, shade(wall, -0.3))
	rr(ci, -4, 0, w + 8, roof_h + 6, 6, roof)
	rect(ci, -4, roof_h, w + 8, 6, shade(roof, -0.25))
	for i in 3:
		rect(ci, 4, 6 + i * (roof_h / 3.0), w - 8, 2, shade(roof, 0.12))
	var door_col: int = int(b.get("door", int(b.x) + bw / 2)) - int(b.x)
	for i in bw:
		if i == door_col:
			continue
		var wx := i * S + 6
		var wy := roof_h + 14
		rr(ci, wx - 2, wy - 2, S - 8, 26, 3, PAL.frame)
		rr(ci, wx, wy, S - 12, 22, 2, PAL.window)
		rect(ci, wx + (S - 12) / 2 - 1, wy, 2, 22, PAL.frame)
	if b.has("awning"):
		var aw := Color(b.awning)
		for i in bw * 2:
			var c := aw if i % 2 else PAL.cream
			rect(ci, i * S / 2, roof_h + 2, S / 2, 9, c)
			half_disc(ci, i * S / 2 + S / 4, roof_h + 11, S / 4, 0, PI, c)
	var dx := door_col * S
	rr(ci, dx + 5, h - 30, S - 10, 28, [8, 8, 0, 0], Color(b.get("door_color", "#6b4a2e")))
	rect(ci, dx + 8, h - 26, S - 16, 9, PAL.window)
	circ(ci, dx + S - 10, h - 14, 1.6, Color("#f5d27a"))
	if b.has("sign") and font:
		var fs := 11
		var tw := font.get_string_size(b.sign, HORIZONTAL_ALIGNMENT_LEFT, -1, fs).x + 14
		var sx := w / 2 - tw / 2
		var sy := roof_h - 17
		rr(ci, sx, sy, tw, 18, 5, Color(b.get("sign_color", "#2b2622")))
		ci.draw_string(font, Vector2(sx, sy + 13), b.sign, HORIZONTAL_ALIGNMENT_CENTER, tw, fs, PAL.cream)


# ── Props (local coordinates; w and h in tiles) ──
static func prop(ci: CanvasItem, p: Dictionary) -> void:
	var w: float = p.get("w", 1) * S
	var h: float = p.get("h", 1) * S
	var c: Color = Color(p.color) if p.has("color") else Color("#9a6b45")
	match p.k:
		"tree":
			ell(ci, 16, 29, 13, 4, PAL.shadow)
			rect(ci, 13, 16, 6, 14, PAL.trunk)
			circ(ci, 16, 6, 15, PAL.leaf2)
			circ(ci, 11, 2, 10, PAL.leaf)
			circ(ci, 21, 4, 9, PAL.leaf)
			circ(ci, 14, -4, 6, shade(PAL.leaf, 0.15))
		"bush":
			ell(ci, 16, 27, 13, 4, PAL.shadow)
			circ(ci, 10, 18, 9, PAL.leaf2)
			circ(ci, 21, 18, 9, PAL.leaf2)
			circ(ci, 15, 13, 9, PAL.leaf)
		"flowers":
			var cols := ["#f28aa0", "#ffd166", "#ffffff", "#c39bd3", "#ff9f68"]
			for i in 5:
				var fx := 5 + i * 5.5
				var fy := 14 + (i % 2) * 8
				rect(ci, fx, fy, 1.5, 6, PAL.leaf2)
				circ(ci, fx + 0.7, fy, 3, Color(cols[i]))
		"bench":
			ell(ci, 16, 27, 15, 3, PAL.shadow)
			rr(ci, 2, 10, 28, 6, 2, Color("#a0683a"))
			rr(ci, 2, 18, 28, 5, 2, Color("#b97a45"))
			rect(ci, 5, 23, 3, 6, Color("#5a3a22"))
			rect(ci, 24, 23, 3, 6, Color("#5a3a22"))
		"lamp":
			ell(ci, 16, 29, 6, 2.5, PAL.shadow)
			rect(ci, 15, -10, 3, 39, Color("#3a3f4a"))
			rr(ci, 10, -16, 13, 8, 3, Color("#3a3f4a"))
			rect(ci, 12, -9, 9, 3, Color("#ffe9a8"))
		"counter":
			rect(ci, 0, 4, w, h - 4, c)
			rect(ci, 0, 2, w, 9, shade(c, 0.35))
			rect(ci, 0, h - 3, w, 3, shade(c, -0.3))
		"register":
			rr(ci, 7, -2, 18, 12, 2, Color("#3a3f4a"))
			rr(ci, 10, -7, 12, 6, 1, Color("#7fd1a0"))
		"espresso":
			rr(ci, 5, -8, 22, 18, 3, Color("#c9ced6"))
			rect(ci, 8, -4, 16, 3, Color("#3a3f4a"))
			rr(ci, 12, 4, 8, 5, 1, PAL.cream)
		"case":
			rr(ci, 2, -8, w - 4, 16, 3, Color(0.75, 0.89, 0.95, 0.85))
			var cols := ["#d9924a", "#b86b3a", "#e9c27a"]
			for i in int(p.get("w", 1)) * 3:
				circ(ci, 8 + i * 9, 2, 3.5, Color(cols[i % 3]))
		"shelf":
			rect(ci, 1, -10, w - 2, h + 8, Color("#8a5f3c"))
			var cols := ["#e2574c", "#3f8fd2", "#f2a93b", "#4caf7a"]
			for i in 3:
				rect(ci, 3, -7 + i * 12, w - 6, 9, Color("#f3e3c3"))
				for j in int(p.get("w", 1)) * 3:
					rect(ci, 5 + j * 9, -6 + i * 12, 6, 7, Color(cols[(i + j) % 4]))
		"table":
			ell(ci, 16, 27, 13, 4, PAL.shadow)
			circ(ci, 6, 18, 5, PAL.wood2)
			circ(ci, 26, 18, 5, PAL.wood2)
			circ(ci, 16, 15, 10, PAL.cream)
			circ(ci, 16, 15, 8.5, Color(p.get("color", "#e9d9b4")))
		"plant":
			rr(ci, 9, 17, 14, 12, 3, Color("#c4553f"))
			circ(ci, 12, 11, 7, PAL.leaf)
			circ(ci, 20, 10, 7, PAL.leaf2)
			circ(ci, 16, 4, 6, PAL.leaf)
		"fridge":
			rr(ci, 3, -14, 26, 44, 3, Color("#e9eef2"))
			rect(ci, 3, 4, 26, 2, Color("#b8c2cc"))
			rect(ci, 23, -8, 2, 8, Color("#8a95a1"))
		"crate":
			ell(ci, 16, 29, 13, 3, PAL.shadow)
			rect(ci, 3, 6, 26, 22, Color("#c08a54"))
			rect(ci, 3, 6, 26, 3, PAL.wood)
			rect(ci, 3, 16, 26, 2, Color("#9a6b45"))
			if p.has("color"):
				circ(ci, 16, 12, 4, c)
		"pallet":
			rect(ci, 1, 2, w - 2, h - 4, PAL.wood2)
			var cols := ["#8a5f3c", "#f3e3c3", "#a0683a"]
			for i in int(p.get("w", 1)) * 2:
				rr(ci, 4 + i * 15, 4, 12, 12, 2, Color(cols[i % 3]))
		"board":
			rect(ci, 6, 16, 3, 13, Color("#5a3a22"))
			rect(ci, 23, 16, 3, 13, Color("#5a3a22"))
			rr(ci, 3, -6, 26, 24, 3, Color("#2f3a33"))
			for i in 4:
				rect(ci, 7, -1 + i * 5, 12 + (i % 2) * 6, 2, Color("#f4f1ea"))
		"rug":
			rr(ci, 2, 2, w - 4, h - 4, 6, Color(p.get("color", "#c4553f")))
			rr(ci, 6, 6, w - 12, h - 12, 4, shade(Color(p.get("color", "#c4553f")), 0.25))
		"mat":
			rr(ci, 3, 8, S - 6, 18, 3, Color("#7a5a3a"))
		"stall":
			ell(ci, w / 2, h - 2, w / 2, 4, PAL.shadow)
			rect(ci, 2, 10, w - 4, h - 12, Color("#b97a45"))
			var sc := Color(p.get("color", "#3f8fd2"))
			for i in int(p.get("w", 1)) * 2:
				rect(ci, i * S / 2, -4, S / 2, 12, sc if i % 2 else PAL.cream)
			var fruit := ["#e2574c", "#f2a93b", "#4caf7a"]
			for i in int(p.get("w", 1)) * 2:
				circ(ci, 8 + i * 16, 16, 4, Color(fruit[i % 3]))
		"fountain":
			ell(ci, w / 2, h / 2 + 4, w / 2 - 2, h / 2 - 4, Color("#b8c2cc"))
			ell(ci, w / 2, h / 2 + 2, w / 2 - 7, h / 2 - 9, PAL.water)
			circ(ci, w / 2, h / 2 - 2, 5, Color("#d6dde3"))
			circ(ci, w / 2, h / 2 - 8, 3, Color("#a8dbef"))
		"phone":
			rect(ci, 14, 8, 4, 21, Color("#5a3a22"))
			rr(ci, 8, -6, 16, 16, 3, Color("#3a3f4a"))
			rr(ci, 11, -3, 10, 7, 2, Color("#7fd1a0"))
		"sofa":
			rr(ci, 1, 2, w - 2, h - 4, 6, Color(p.get("color", "#3f8fd2")))
			rr(ci, 4, 10, w - 8, h - 14, 4, shade(Color(p.get("color", "#3f8fd2")), 0.2))
		"sign":
			rect(ci, 15, 8, 3, 21, Color("#5a3a22"))
			rr(ci, 3, -4, 26, 14, 3, Color("#f4f1ea"))
			rect(ci, 7, 1, 18, 2, Color("#5a3a22"))
			rect(ci, 7, 5, 12, 2, Color("#5a3a22"))


# ── People. look = { skin, hair, hair_style (0 short, 1 long, 2 bun, 3 curly, 4 shaved), shirt, pants,
#    outfit ("apron" | "vest" | "cap" | ""), apron, cap } — numbers index the lists above, or colour strings.
#    dir: "down" | "up" | "left" | "right"; step: 0 standing, 1 or 2 walking. Local coordinates: the tile's top-left. ──
static func _col(v, list: Array) -> Color:
	if v is String:
		return Color(v)
	return Color(list[posmod(int(v), list.size())])


static func colours(look: Dictionary) -> Dictionary:
	return {"skin": _col(look.get("skin", 0), SKIN), "hair": _col(look.get("hair", 0), HAIR),
		"shirt": _col(look.get("shirt", 2), SHIRT), "pants": _col(look.get("pants", 0), PANTS)}


static func _hair(ci: CanvasItem, c: Dictionary, style: int, dir: String, cx: float, cy: float, r: float) -> void:
	var back := dir == "up"
	if style == 4:
		if back:
			circ(ci, cx, cy, r, shade(c.hair, 0.35))
		return
	if style == 1 and back:
		rr(ci, cx - r - 1, cy - 2, r * 2 + 2, r + 9, 4, c.hair)
	if back:
		circ(ci, cx, cy, r + 0.6, c.hair)
	else:
		half_disc(ci, cx, cy, r + 0.6, PI * 1.02, PI * 1.98, c.hair)
		var off := 2.0 if dir == "left" else (-2.0 if dir == "right" else 0.0)
		var pts := PackedVector2Array()
		for i in 13:
			var a := PI + PI * i / 12.0
			pts.append(Vector2(cx + off + cos(a) * r * 0.95, cy - r * 0.45 + sin(a) * r * 0.5))
		ci.draw_colored_polygon(pts, c.hair)
	if style == 2:
		circ(ci, cx, cy - r - 2, 4, c.hair)
	if style == 3:
		for i in 6:
			circ(ci, cx - r + i * (r * 2 / 5), cy - r * 0.55 - (i % 2) * 2, 3, c.hair)


static func person(ci: CanvasItem, look: Dictionary, dir: String, step: int, opts := {}) -> void:
	var c := colours(look)
	var side := dir == "left" or dir == "right"
	var bob := -1.0 if step else 0.0
	var sw := 2.0 if step == 1 else (-2.0 if step == 2 else 0.0)
	var oy: float = opts.get("hop", 0.0)
	var origin: Vector2 = opts.get("origin", Vector2.ZERO)
	ci.draw_set_transform(origin + Vector2(0, oy))
	ell(ci, 16, 29 - oy, 9, 3.5, PAL.shadow)
	if side:
		rr(ci, 13 + sw, 21, 5, 8, 2, c.pants)
		rr(ci, 14 - sw, 21, 5, 8, 2, shade(c.pants, -0.15))
	else:
		rr(ci, 11, 21 - (1.5 if step == 1 else 0.0), 5, 8, 2, c.pants)
		rr(ci, 16, 21 - (1.5 if step == 2 else 0.0), 5, 8, 2, c.pants)
	var by := 11 + bob
	if not side:
		rr(ci, 7, by + 1 + (-1.0 if step == 1 else 0.0), 4, 9, 2, c.shirt)
		rr(ci, 21, by + 1 + (-1.0 if step == 2 else 0.0), 4, 9, 2, c.shirt)
		circ(ci, 9, by + 10, 2, c.skin)
		circ(ci, 23, by + 10, 2, c.skin)
	rr(ci, 10.0 if side else 9.0, by, 12.0 if side else 14.0, 12, 5, c.shirt)
	var outfit: String = look.get("outfit", "")
	if outfit == "apron":
		var ap := Color(look.get("apron", "#2f3a33"))
		rr(ci, 12.0 if side else 11.0, by + 3, 8.0 if side else 10.0, 10, 2, ap)
		if not side and dir != "up":
			rect(ci, 13, by + 7, 6, 2, shade(ap, 0.3))
	elif outfit == "vest":
		rect(ci, 10.0 if side else 9.0, by + 1, 3, 10, Color("#f2c14e"))
		rect(ci, 19.0 if side else 20.0, by + 1, 3, 10, Color("#f2c14e"))
	if side:
		rr(ci, 14 + sw * 0.6, by + 1, 4, 9, 2, shade(c.shirt, -0.1))
		circ(ci, 16 + sw * 0.6, by + 10, 2, c.skin)
	var hx := 16.0
	var hy := 5 + bob
	var r := 7.0
	if int(look.get("hair_style", 0)) == 1 and dir != "up":
		rr(ci, hx - r - 1, hy - 2, r * 2 + 2, r + 9, 4, c.hair)
	circ(ci, hx, hy, r, c.skin)
	_hair(ci, c, int(look.get("hair_style", 0)), dir, hx, hy, r)
	if outfit == "cap":
		var cc := Color(look.get("cap", "#e2574c"))
		half_disc(ci, hx, hy - 1, r + 0.5, PI, TAU, cc)
		if dir != "up":
			var bx := hx - r - 4 if dir == "left" else (hx if dir == "right" else hx - 5)
			rr(ci, bx, hy - 2, 10.0 if dir == "down" else 9.0, 3, 1.5, cc)
	if dir != "up":
		var ex := [12.5] if dir == "left" else ([19.5] if dir == "right" else [13.0, 19.0])
		for e in ex:
			circ(ci, e, hy + 1, 1.2, PAL.ink)
		var mood: String = opts.get("mood", "")
		if not side and mood != "":
			if mood == "sad":
				ci.draw_arc(Vector2(16, hy + 6), 2.2, PI * 1.15, PI * 1.85, 8, PAL.ink, 1.1, true)
			else:
				ci.draw_arc(Vector2(16, hy + 2.6), 2.2, PI * 0.2, PI * 0.8, 8, PAL.ink, 1.1, true)
	ci.draw_set_transform(Vector2.ZERO)


## Portrait for the dialogue box: head and shoulders, centred on (cx, cy) with head radius r.
static func head(ci: CanvasItem, look: Dictionary, cx: float, cy: float, r: float) -> void:
	var c := colours(look)
	var k := r / 7.0
	ci.draw_set_transform(Vector2(cx - 16 * k, cy - 5 * k), 0.0, Vector2(k, k))
	rr(ci, 6, 11, 20, 14, 6, c.shirt)
	if look.get("outfit", "") == "apron":
		rr(ci, 10, 14, 12, 11, 2, Color(look.get("apron", "#2f3a33")))
	if int(look.get("hair_style", 0)) == 1:
		rr(ci, 8, 3, 16, 16, 4, c.hair)
	circ(ci, 16, 5, 7, c.skin)
	_hair(ci, c, int(look.get("hair_style", 0)), "down", 16, 5, 7)
	if look.get("outfit", "") == "cap":
		var cc := Color(look.get("cap", "#e2574c"))
		half_disc(ci, 16, 4, 7.5, PI, TAU, cc)
		rr(ci, 11, 3, 10, 3, 1.5, cc)
	circ(ci, 13, 6, 1.1, PAL.ink)
	circ(ci, 19, 6, 1.1, PAL.ink)
	ci.draw_arc(Vector2(16, 7.6), 2.2, PI * 0.2, PI * 0.8, 8, PAL.ink, 0.9, true)
	ci.draw_set_transform(Vector2.ZERO)


## A speech bubble over a head. kind: "goal" | "talk" | "soldout" | "line" | "price" | "happy"
static func bubble(ci: CanvasItem, kind: String, x: float, y: float) -> void:
	rr(ci, x - 10, y - 10, 20, 17, 6, PAL.cream)
	ci.draw_colored_polygon(PackedVector2Array([Vector2(x - 3, y + 7), Vector2(x, y + 11), Vector2(x + 3, y + 7)]), PAL.cream)
	var red := Color("#b42318")
	match kind:
		"goal":
			rr(ci, x - 1.6, y - 7, 3.2, 8, 1.5, Color("#94631a"))
			circ(ci, x, y + 3.5, 1.8, Color("#94631a"))
		"talk":
			for i in 3:
				circ(ci, x - 5 + i * 5, y - 1.5, 1.6, PAL.ink)
		"soldout":
			ci.draw_line(Vector2(x - 4, y - 6), Vector2(x + 4, y + 2), red, 2.2, true)
			ci.draw_line(Vector2(x + 4, y - 6), Vector2(x - 4, y + 2), red, 2.2, true)
		"line":
			ci.draw_arc(Vector2(x, y - 2), 5, 0, TAU, 16, red, 1.6, true)
			ci.draw_line(Vector2(x, y - 2), Vector2(x, y - 5.5), red, 1.6, true)
			ci.draw_line(Vector2(x, y - 2), Vector2(x + 3, y - 2), red, 1.6, true)
		"price":
			ci.draw_arc(Vector2(x, y - 2), 5, 0, TAU, 16, red, 1.6, true)
			ci.draw_line(Vector2(x, y - 5), Vector2(x, y + 1), red, 1.6, true)
			ci.draw_line(Vector2(x - 2, y - 3.5), Vector2(x + 2, y - 3.5), red, 1.4, true)
			ci.draw_line(Vector2(x - 2, y - 0.5), Vector2(x + 2, y - 0.5), red, 1.4, true)
		"happy":
			circ(ci, x - 2.4, y - 3.5, 2.8, Color("#e2574c"))
			circ(ci, x + 2.4, y - 3.5, 2.8, Color("#e2574c"))
			ci.draw_colored_polygon(PackedVector2Array([Vector2(x - 5.1, y - 2.6), Vector2(x + 5.1, y - 2.6), Vector2(x, y + 3)]), Color("#e2574c"))


## Small product pictures for panels (no emoji: web exports cannot fall back to system fonts).
static func product_icon(ci: CanvasItem, id: String, cx: float, cy: float, size: float) -> void:
	var k := size / 32.0
	ci.draw_set_transform(Vector2(cx - 16 * k, cy - 16 * k), 0.0, Vector2(k, k))
	match id:
		"coffee":
			rr(ci, 7, 10, 16, 17, [2, 2, 6, 6], PAL.cream)
			rect(ci, 7, 14, 16, 5, Color("#94631a"))
			ci.draw_arc(Vector2(24, 18), 4, -PI / 2, PI / 2, 10, PAL.cream, 3, true)
			ell(ci, 15, 9, 8, 2.5, Color("#6b4510"))
			ci.draw_arc(Vector2(13, 3), 2, PI * 0.5, PI * 1.5, 6, Color(1, 1, 1, 0.8), 1.4, true)
		"muffin":
			ci.draw_colored_polygon(PackedVector2Array([Vector2(8, 15), Vector2(24, 15), Vector2(22, 28), Vector2(10, 28)]), Color("#e2574c"))
			circ(ci, 16, 13, 9, Color("#c8945a"))
			circ(ci, 13, 11, 1.4, Color("#5a3a22"))
			circ(ci, 18, 9, 1.4, Color("#5a3a22"))
			circ(ci, 19, 14, 1.4, Color("#5a3a22"))
		"sandwich":
			ci.draw_colored_polygon(PackedVector2Array([Vector2(4, 24), Vector2(28, 24), Vector2(16, 6)]), Color("#e9c27a"))
			ci.draw_colored_polygon(PackedVector2Array([Vector2(6, 22), Vector2(26, 22), Vector2(25, 19), Vector2(7, 19)]), Color("#4caf7a"))
			ci.draw_colored_polygon(PackedVector2Array([Vector2(8, 18), Vector2(24, 18), Vector2(22, 15), Vector2(10, 15)]), Color("#e2574c"))
		_:
			circ(ci, 16, 16, 10, Color("#94631a"))
	ci.draw_set_transform(Vector2.ZERO)
