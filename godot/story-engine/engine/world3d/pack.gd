# Models from the Blender packs (scripts/blender/, built into assets/<game>/<pack>/*.glb with a pack.json).
# Every model gets the town's own materials, so it lights like the code-drawn world:
#   a mesh named *_glow → unlit (lit windows, sigils, Rune_glow), *_water → see-through water, anything else → main.
# Units: 1 = 1 map tile, footprint centred on the model's origin, door facing +z.
#
#   var n := Pack.place("realm/emberdale", "mill", parent, Vector3(x, 0, z), yaw_degrees)
#   Pack.part(n, "Wheel").rotate_z(delta)        # named moving parts: Wheel, *_Crown, Rune_glow
#   Pack.tint(Pack.part(n, "Rune_glow"), Color("#f2c84b"))
extends RefCounted

const Art3D = preload("res://engine/world3d/art3d.gd")

static var _scenes := {}
static var _info := {}
static var _srgb_cache := {}


## The town's own materials. Pack models are turned into the town's colour space when they load (see _srgb), so the
## same material lights both alike.
static func mats() -> Dictionary:
	return Art3D.mats()


## The pack's pack.json (kind, w, d, h, tris, note for every model).
static func info(pack: String) -> Dictionary:
	if not _info.has(pack):
		var f := FileAccess.open("res://assets/%s/pack.json" % pack, FileAccess.READ)
		_info[pack] = JSON.parse_string(f.get_as_text()) if f else {}
	return _info[pack]


## Put a model into `parent` at `pos`, turned `yaw` degrees. Give `fit` (tiles, x by z) to scale it to a footprint.
static func place(pack: String, name: String, parent: Node, pos: Vector3, yaw := 0.0, fit := Vector2.ZERO) -> Node3D:
	var key := pack + "/" + name
	if not _scenes.has(key):
		_scenes[key] = load("res://assets/%s.glb" % key)
	var n: Node3D = (_scenes[key] as PackedScene).instantiate()
	style(n)
	n.position = pos
	n.rotation.y = deg_to_rad(yaw)
	if fit != Vector2.ZERO:
		var m: Dictionary = info(pack).get("models", {}).get(name, {})
		if m.has("w"):
			var s := minf(fit.x / float(m.w), fit.y / float(m.d))
			n.scale = Vector3(s, s, s)
	parent.add_child(n)
	return n


## A model's meshes for merging: [{ mesh, xf (relative to the model's root), kind: "main" | "glow" | "water" }], cached.
static var _pieces := {}
static func pieces(pack: String, name: String) -> Array:
	var key := pack + "/" + name
	if _pieces.has(key):
		return _pieces[key]
	if not _scenes.has(key):
		_scenes[key] = load("res://assets/%s.glb" % key)
	var root: Node3D = (_scenes[key] as PackedScene).instantiate()
	var out := []
	for c in root.find_children("*", "MeshInstance3D", true, false):
		var mi := c as MeshInstance3D
		var xf := Transform3D.IDENTITY
		var q: Node = mi
		while q != null and q != root:
			if q is Node3D:
				xf = (q as Node3D).transform * xf
			q = q.get_parent()
		var nm := String(mi.name).to_lower()
		out.append({"mesh": _srgb(mi.mesh), "xf": xf, "kind": "water" if "_water" in nm else ("glow" if "_glow" in nm else "main")})
	root.free()
	_pieces[key] = out
	return out


## glTF keeps vertex colours linear; the town's meshes hold sRGB colours (art3d.gd). The material's sRGB switch has
## no effect in the Compatibility renderer, so convert the colours once per mesh instead (cached, shared by every copy).
static func _srgb(mesh: Mesh) -> Mesh:
	if mesh == null:
		return mesh
	if _srgb_cache.has(mesh):
		return _srgb_cache[mesh]
	var out := ArrayMesh.new()
	for i in mesh.get_surface_count():
		var arr := mesh.surface_get_arrays(i)
		var cols = arr[Mesh.ARRAY_COLOR]
		if cols is PackedColorArray:
			for k in cols.size():
				cols[k] = cols[k].linear_to_srgb()
			arr[Mesh.ARRAY_COLOR] = cols
		out.add_surface_from_arrays(mesh.surface_get_primitive_type(i), arr)
	_srgb_cache[mesh] = out
	_srgb_cache[out] = out
	return out


## Swap the imported materials for the town's.
static func style(root: Node) -> void:
	var M := mats()
	for c in root.find_children("*", "MeshInstance3D", true, false):
		var mi := c as MeshInstance3D
		mi.mesh = _srgb(mi.mesh)
		var nm := String(mi.name).to_lower()
		mi.material_override = M.water if "_water" in nm else (M.glow if "_glow" in nm else M.main)
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF


## A named part of a placed model (the node that moves: Wheel, tree_aspen_Crown, Rune_glow …), or null.
static func part(root: Node, name: String) -> Node3D:
	if String(root.name) == name:
		return root as Node3D
	return root.find_child(name, true, false) as Node3D


## Recolour a glowing part (multiplies its vertex colours), e.g. the rune going from grey to gold.
static func tint(n: Node, col: Color) -> void:
	for c in ([n] + n.find_children("*", "MeshInstance3D", true, false)):
		if c is MeshInstance3D:
			var m: StandardMaterial3D = mats().glow.duplicate()
			m.albedo_color = col
			(c as MeshInstance3D).material_override = m


# ── Rigged people and animals (the people pack: realm/people) ──
#   var n := Pack.person("realm/people", "hero", look)     # dressed, idle playing
#   Pack.play(n, "walk", 3.0)                               # clips: idle walk talk cast cheer | graze peck sit
# A look uses the town's keys (skin, hair, hair_style 0–5, shirt, pants, glasses) plus boots and cloak (colours).
# Only the hero has slot meshes; the cast keep their own colours and ignore the look.

const SLOT := {"Skin": "skin", "Hair": "hair", "Top": "shirt", "Legs": "pants", "Boots": "boots", "Cloak": "cloak"}
const HAIR_STYLES := ["short", "long", "bun", "curly", "shaved", "braids"]
const SLOT_DEFAULT := {"boots": "#5a4232", "cloak": "#3d4f7a"}
static var _tints := {}
static var _looped := {}


## A rigged model, dressed and playing idle. Give `xray` (a material with stencil x-ray) to have it show through walls.
static func person(pack: String, name: String, look := {}, xray := false) -> Node3D:
	var tmp := Node3D.new()
	var n := place(pack, name, tmp, Vector3.ZERO)
	tmp.remove_child(n)
	tmp.free()
	dress(n, look, xray)
	var ap := player(n)
	if ap:
		var key := pack + "/" + name
		if not _looped.has(key):
			_looped[key] = true
			for a in ap.get_animation_list():
				ap.get_animation(a).loop_mode = Animation.LOOP_LINEAR
		ap.play("idle")
		ap.seek(randf() * 1.5, true)   # so a crowd doesn't breathe in step
	return n


## Tint the hero's slot meshes from a look and show the chosen hair style (and glasses).
static func dress(n: Node, look: Dictionary, xray := false) -> void:
	const Art3D_ = preload("res://engine/world3d/art3d.gd")
	var style: String = HAIR_STYLES[clampi(int(look.get("hair_style", 0)), 0, HAIR_STYLES.size() - 1)]
	for c in n.find_children("*", "MeshInstance3D", true, false):
		var mi := c as MeshInstance3D
		var nm := String(mi.name)
		var head := nm.get_slice("_", 0)
		if nm == "Glasses":
			mi.visible = bool(look.get("glasses", false))
		if head == "Hair":
			mi.visible = nm == "Hair_" + style
		var col := Color.WHITE
		if SLOT.has(head):
			var k: String = SLOT[head]
			match k:
				"skin": col = Art3D_._col(look.get("skin", 0), Art3D_.SKIN)
				"hair": col = Art3D_._col(look.get("hair", 0), Art3D_.HAIR)
				"shirt": col = Art3D_._col(look.get("shirt", 2), Art3D_.SHIRT)
				"pants": col = Art3D_._col(look.get("pants", 0), Art3D_.PANTS)
				_: col = Color(look.get(k, SLOT_DEFAULT[k]))
		if "_glow" in nm.to_lower():
			continue
		mi.material_override = _tint(col, xray)


static func _tint(col: Color, xray: bool) -> StandardMaterial3D:
	var key := col.to_html() + ("x" if xray else "")
	if not _tints.has(key):
		var m: StandardMaterial3D = mats().main.duplicate()
		m.albedo_color = col
		if xray:
			m.stencil_mode = BaseMaterial3D.STENCIL_MODE_XRAY
			m.stencil_color = Color(1.0, 0.84, 0.45, 0.6)
		_tints[key] = m
	return _tints[key]


## The model's AnimationPlayer, or null.
static func player(n: Node) -> AnimationPlayer:
	var f := n.find_children("*", "AnimationPlayer", true, false)
	return f[0] as AnimationPlayer if f.size() > 0 else null


## Play a clip (blends 0.15 s from the last one); does nothing if it's already playing or the model hasn't got it.
static func play(n: Node, anim: String, speed := 1.0) -> void:
	var ap := player(n)
	if ap == null or not ap.has_animation(anim):
		return
	ap.speed_scale = speed
	if ap.current_animation != anim:
		ap.play(anim, 0.15)
