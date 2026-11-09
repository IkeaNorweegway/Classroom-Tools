# Models from the Blender packs (scripts/blender/, built into assets/<game>/<pack>/*.glb with a pack.json).
# Every model gets the town's own materials (read as linear colour), so it lights like the code-drawn world:
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
static var _mats := {}


## The town's materials, but reading vertex colours as linear (glTF stores them linear; art3d's are sRGB).
static func mats() -> Dictionary:
	if _mats.is_empty():
		for k in Art3D.mats():
			var m: StandardMaterial3D = Art3D.mats()[k].duplicate()
			m.vertex_color_is_srgb = false
			_mats[k] = m
	return _mats


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


## Swap the imported materials for the town's.
static func style(root: Node) -> void:
	var M := mats()
	for c in root.find_children("*", "MeshInstance3D", true, false):
		var mi := c as MeshInstance3D
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
