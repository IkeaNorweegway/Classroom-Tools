# The Town Map (M key, or Map in the top bar): the whole outdoor map from above, drawn flat.
# Ground by kind, buildings with their names, district names, you (red) and your goal (gold).
extends Control

const MapData = preload("res://engine/world/map_data.gd")

const GROUND := {"grass": Color("#a9c48a"), "lawn": Color("#93bf72"), "walk": Color("#dcd7cc"), "plaza": Color("#e4dccb"),
	"path": Color("#e6d6b4"), "road": Color("#7b7e87"), "line": Color("#7b7e87"), "cross_h": Color("#8d9099"), "cross_v": Color("#8d9099"),
	"water": Color("#8fc0cb"), "sand": Color("#eadcb8")}
const STYLE := {"civic": Color("#d8cbb3"), "campus": Color("#c9937e"), "glass": Color("#9fb6c8"), "shop": Color("#d6a184"),
	"industry": Color("#b9b2a5"), "house": Color("#c98f7f")}

var map: MapData
var font: Font
var you := Vector2i(-1, -1)
var goal = null          # Vector2i or null
var here := ""           # the building you are inside, if any


func _init(m: MapData, f: Font) -> void:
	map = m
	font = f
	custom_minimum_size = Vector2(0, 0)


func _ready() -> void:
	_fit()
	get_viewport().size_changed.connect(_fit)


func _fit() -> void:
	var vs := get_viewport().get_visible_rect().size
	var h := minf(minf(740.0, vs.x - 60.0) * map.h / map.w, vs.y - 250.0)
	custom_minimum_size = Vector2(0, maxf(160.0, h))
	queue_redraw()


func _draw() -> void:
	var s := minf(size.x / map.w, size.y / map.h)
	var o := Vector2((size.x - map.w * s) / 2.0, 0)
	draw_rect(Rect2(o, Vector2(map.w, map.h) * s), Color("#a9c48a"))
	for y in map.h:
		for x in map.w:
			var k: String = map.ground[y * map.w + x]
			if k != "grass":
				draw_rect(Rect2(o + Vector2(x, y) * s, Vector2(s + 0.6, s + 0.6)), GROUND.get(k, Color("#a9c48a")))
	for p in map.props:
		if p.k in ["tree", "big_tree", "pine"]:
			draw_circle(o + Vector2(p.x + 0.5, p.y + 0.5) * s, s * 0.42, Color("#6f9a5c"))
	for b in map.buildings:
		var r := Rect2(o + Vector2(b.x, b.y) * s, Vector2(b.w, b.h) * s)
		var col: Color = STYLE.get(b.get("style", "shop"), Color("#d6a184"))
		if b.get("id", "") == here:
			col = Color("#f2b6a8")
		draw_rect(r, col)
		draw_rect(r, col.darkened(0.35), false, 1.5)
		var dx := float(b.get("door", b.x)) + 0.5
		var dy := float(b.y) if b.get("face", "s") == "n" else float(b.y + b.h) - 0.35
		draw_rect(Rect2(o + Vector2(dx - 0.4, dy) * s, Vector2(0.8, 0.35) * s), col.darkened(0.5))
		var name := str(b.get("sign", ""))
		if name != "":
			_text(name, r.get_center(), maxi(9, int(s * 0.95)), Color("#2b2622"), r.size.x - 4)
	var district_font := maxi(10, int(s * 1.2))
	for d in map.def.get("districts", []):
		if int(d.w) * int(d.h) < 40:
			continue
		var c := o + Vector2(float(d.get("lx", d.x + d.w / 2.0)), float(d.get("ly", d.y + d.h / 2.0))) * s
		var t := str(d.name).to_upper()
		var sz := font.get_string_size(t, HORIZONTAL_ALIGNMENT_LEFT, -1, district_font)
		draw_rect(Rect2(c - sz / 2.0 - Vector2(5, 2), sz + Vector2(10, 4)), Color(1, 1, 1, 0.72))
		_text(t, c, district_font, Color("#5a4a30"))
	if goal != null:
		var g: Vector2 = o + (Vector2(goal) + Vector2(0.5, 0.5)) * s
		var r2 := s * 0.9
		draw_colored_polygon(PackedVector2Array([g + Vector2(0, -r2), g + Vector2(r2, 0), g + Vector2(0, r2), g + Vector2(-r2, 0)]), Color("#f5b82e"))
		draw_polyline(PackedVector2Array([g + Vector2(0, -r2), g + Vector2(r2, 0), g + Vector2(0, r2), g + Vector2(-r2, 0), g + Vector2(0, -r2)]), Color("#6b4510"), 1.5)
	if you.x >= 0:
		var p: Vector2 = o + (Vector2(you) + Vector2(0.5, 0.5)) * s
		draw_circle(p, s * 0.95, Color(1, 1, 1, 0.9))
		draw_circle(p, s * 0.7, Color("#d9534a"))
		_text("You", p + Vector2(0, -s * 1.7), maxi(10, int(s * 1.1)), Color("#7a231c"))


## Centred text that shrinks to fit a width (or wraps onto two lines).
func _text(t: String, at: Vector2, fs: int, col: Color, max_w := 0.0) -> void:
	var sz := font.get_string_size(t, HORIZONTAL_ALIGNMENT_LEFT, -1, fs)
	if max_w > 0.0 and sz.x > max_w:
		var words := t.split(" ")
		if words.size() > 1:
			var half := words.size() / 2
			var a := " ".join(words.slice(0, half)); var b := " ".join(words.slice(half))
			var w2 := maxf(font.get_string_size(a, HORIZONTAL_ALIGNMENT_LEFT, -1, fs).x, font.get_string_size(b, HORIZONTAL_ALIGNMENT_LEFT, -1, fs).x)
			if w2 > max_w:
				fs = maxi(7, int(fs * max_w / w2))
			_text(a, at + Vector2(0, -fs * 0.55), fs, col)
			_text(b, at + Vector2(0, fs * 0.55), fs, col)
			return
		fs = maxi(7, int(fs * max_w / sz.x))
		sz = font.get_string_size(t, HORIZONTAL_ALIGNMENT_LEFT, -1, fs)
	draw_string(font, at + Vector2(-sz.x / 2.0, fs * 0.35), t, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, col)
