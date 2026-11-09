# A small 3D picture of a rigged person (the student avatar), for panels: the avatar picker, Pat's stall, the closet.
# It shows the real model the game will draw, dressed from a look, turning slowly (still when motion is reduced).
#
#   var v := ModelView.make(look, Vector2(150, 190), ui.reduce_motion)
#   v.set_look(new_look)          # redress it
extends SubViewportContainer

const Pack = preload("res://engine/world3d/pack.gd")

var vp: SubViewport
var pivot: Node3D
var person: Node3D
var spin := true
var look := {}


static func make(l: Dictionary, size := Vector2(150, 190), still := false) -> SubViewportContainer:
	var v = load("res://engine/ui/model_view.gd").new()
	v.custom_minimum_size = size
	v.stretch = true
	v.spin = not still
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v._build()
	v.set_look(l)
	return v


func _build() -> void:
	vp = SubViewport.new()
	vp.own_world_3d = true
	vp.transparent_bg = true
	vp.msaa_3d = Viewport.MSAA_2X
	add_child(vp)
	var env := WorldEnvironment.new()
	env.environment = Environment.new()
	env.environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.environment.ambient_light_color = Color("#f4ead8")
	env.environment.ambient_light_energy = 0.55
	vp.add_child(env)
	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-40, 35, 0)
	sun.light_energy = 1.0
	vp.add_child(sun)
	var cam := Camera3D.new()
	cam.fov = 30.0
	cam.transform = Transform3D(Basis(), Vector3(0, 0.95, 2.45)).looking_at(Vector3(0, 0.52, 0))
	vp.add_child(cam)
	cam.current = true
	pivot = Node3D.new()
	pivot.rotation_degrees.y = -20.0
	vp.add_child(pivot)


func set_look(l: Dictionary) -> void:
	look = l
	if person:
		person.queue_free()
		person = null
	var m := str(l.get("model", ""))
	if m == "":
		return
	person = Pack.person(m.get_base_dir(), m.get_file(), l)
	pivot.add_child(person)


func _process(delta: float) -> void:
	if spin and is_visible_in_tree():
		pivot.rotation.y += delta * 0.6
