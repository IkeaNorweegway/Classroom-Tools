# Cut scenes: the camera leaves you and tells a story moment in the 3D world, with letterbox bars and captions.
# Town owns one of these (Town.cutscene) and offers:
#
#   await T.scene(id, shots)
#
# shots is a list run in order. Each entry is one of these (add "with": true to start the next one at the same time):
#   { cam: { look: where, from: [dx, dy, dz], to?: [dx, dy, dz], orbit?: degrees, secs, ease?: "inout" | "out" | "in" | "linear" } }
#        the camera looks at `where` from an offset, moving to `to` (a dolly) and/or swinging `orbit` degrees round it
#   { say: text, who?: person id, secs? }     a caption; it waits for its time or a tap (Space, Enter, click)
#   { walk: person id or "you", to: [x, y], secs }   walks in a straight line (give corner tiles as more walks)
#   { face: person id or "you", to: [x, y] } · { clip: person id or "you", anim: "cast" | "cheer" | "talk" | "idle" }
#   { do: Callable }                          a story change (set_flag, rebuild_maps). It runs even when the scene is skipped,
#                                             so a skipped or half-watched scene leaves the story exactly as a watched one
#   { wait: secs } · { fade: "out" | "in", secs } · { shake: amount } · { title: [kicker, title] } · { fx: Callable(T) }
# where = [x, y] (a tile) | person id | "you" | Vector3
#
# Esc or the Skip button skips the rest (its `do`s still run). Reduced motion: camera moves become cuts and there is no shake.
# Test player (auto=…): scenes skip at once and print "SCENE <id>"; scene=<id> plays that one in full instead (screenshots).
# Every scene seen is kept in S.seen_scenes, so a game can offer replays (replay: true skips the `do`s).
extends Node

signal _tap

var T                               # Town
var playing := false
var skipping := false
var bars := []
var cap_box: PanelContainer
var cap_name: Label
var cap_text: Label
var skip_btn: Button
var _touched := {}                  # people whose clip a scene changed


func play(id: String, shots: Array, replay := false) -> void:
	if not T.S.has("seen_scenes"):
		T.S.seen_scenes = []
	var force: bool = str(T.args.get("scene", "")) == id
	if (T.auto != "" and not force) or playing:
		for s in shots:
			if s.has("do") and not replay:
				await s.do.call()
		if T.auto != "":
			print("SCENE ", id)
		_seen(id)
		return
	playing = true
	skipping = false
	_touched.clear()
	T.ui.open += 1
	T.ui.hud.visible = false
	T.world.path.clear()
	T.world.cam_hold = true
	T.world.set_goal(null)
	_build_ui()
	await _bars(true)
	for s in shots:
		if skipping:
			if s.has("do") and not replay:
				await s.do.call()
			continue
		if s.has("do"):
			if not replay:
				await s.do.call()
			continue
		if s.get("with", false):
			_run(s)
		else:
			await _shot(s)
	if _fade_rect:   # a scene that ended on black lifts it as the bars go
		_fade_rect.queue_free()
		_fade_rect = null
	_caption("", "")
	await _bars(false)
	_free_ui()
	for k in _touched:
		var n = _node(k)
		if n:
			n.action = "idle"
	T.world.cam_hold = false
	T.world.camera.h_offset = 0.0
	T.world.camera.v_offset = 0.0
	T.ui.hud.visible = true
	T.ui.open -= 1
	playing = false
	_seen(id)
	T.refresh()
	T.save()


func _seen(id: String) -> void:
	if not (id in T.S.seen_scenes):
		T.S.seen_scenes.append(id)


## A shot that runs alongside the next: started, not awaited.
func _run(s: Dictionary) -> Signal:
	var proxy := _Proxy.new()
	add_child(proxy)
	proxy.go(self, s)
	return proxy.done


class _Proxy extends Node:
	signal done
	func go(owner_, s: Dictionary) -> void:
		await owner_._shot(s)
		done.emit()
		queue_free()


func _shot(s: Dictionary) -> void:
	if s.has("cam"):
		await _cam(s.cam)
	elif s.has("say"):
		var who := str(s.get("who", ""))
		var nm: String = T._speaker(who)[0] if who != "" else ""
		var text: String = T.fill(str(s.say))
		_caption(nm, text)
		await _hold(float(s.get("secs", clampf(1.4 + text.length() * 0.045, 2.2, 7.0))), true)
	elif s.has("walk"):
		await _walk(str(s.walk), Vector2i(int(s.to[0]), int(s.to[1])), float(s.get("secs", 1.0)))
	elif s.has("face"):
		var n = _node(str(s.face))
		if n:
			n.dir = T.world._dir_to(n.tile, Vector2i(int(s.to[0]), int(s.to[1])))
			n.show_dir()
	elif s.has("clip"):
		var n = _node(str(s.clip))
		if n:
			n.action = str(s.anim)
			_touched[str(s.clip)] = true
	elif s.has("wait"):
		await _hold(float(s.wait), false)
	elif s.has("fade"):
		await _fade(str(s.fade) == "out", float(s.get("secs", 0.5)))
	elif s.has("shake"):
		_shake(float(s.shake))
	elif s.has("title"):
		T.ui.banner(str(s.title[0]), str(s.title[1]))
		await _hold(1.6, false)
	elif s.has("fx"):
		await s.fx.call(T)


# ── Camera ──
func _where(w) -> Vector3:
	if w is Vector3:
		return w
	if w is Array:
		return T.world.tile_pos(Vector2i(int(w[0]), int(w[1]))) + Vector3(0, 0.8, 0)
	var n = _node(str(w))
	if n:
		return n.position + Vector3(0, 1.0, 0)
	return T.world.me.position + Vector3(0, 1.0, 0)


func _cam(c: Dictionary) -> void:
	var look := _where(c.get("look", "you"))
	var a := _v3(c.get("from", [0, 6, 8]))
	var b := _v3(c.get("to", c.get("from", [0, 6, 8])))
	var orbit := deg_to_rad(float(c.get("orbit", 0.0)))
	var secs := float(c.get("secs", 2.0))
	var cam: Camera3D = T.world.camera
	var place := func(t: float) -> void:
		var off: Vector3 = a.lerp(b, t).rotated(Vector3.UP, orbit * t)
		cam.position = look + off
		cam.look_at(look)
	if T.reduce_motion or secs <= 0.0:
		place.call(1.0)
		await _hold(secs, false)
		return
	place.call(0.0)
	var tw := create_tween()
	var e := str(c.get("ease", "inout"))
	tw.set_trans(Tween.TRANS_SINE if e != "linear" else Tween.TRANS_LINEAR)
	tw.set_ease({"inout": Tween.EASE_IN_OUT, "out": Tween.EASE_OUT, "in": Tween.EASE_IN}.get(e, Tween.EASE_IN_OUT))
	tw.tween_method(place, 0.0, 1.0, secs)
	while tw.is_running():
		if skipping:
			tw.kill()
			return
		await get_tree().process_frame


static func _v3(v) -> Vector3:
	return v if v is Vector3 else Vector3(float(v[0]), float(v[1]), float(v[2]))


func _shake(amount: float) -> void:
	if T.reduce_motion:
		return
	var cam: Camera3D = T.world.camera
	var tw := create_tween()
	for i in 8:
		var k := amount * (1.0 - i / 8.0)
		tw.tween_property(cam, "h_offset", k * (1.0 if i % 2 == 0 else -1.0), 0.05)
		tw.parallel().tween_property(cam, "v_offset", k * 0.6 * (1.0 if i % 3 == 0 else -1.0), 0.05)
	tw.tween_property(cam, "h_offset", 0.0, 0.05)
	tw.parallel().tween_property(cam, "v_offset", 0.0, 0.05)


# ── People ──
func _node(id: String):
	if id == "you":
		return T.world.me
	return T.world.people.get(id)


func _walk(id: String, to: Vector2i, secs: float) -> void:
	var n = _node(id)
	if n == null:
		return
	n.dir = T.world._dir_to(n.tile, to)
	n.show_dir()
	n.action = "walk"
	_touched[id] = true
	var dest: Vector3 = T.world.tile_pos(to)
	if T.reduce_motion or secs <= 0.0:
		n.position = dest
	else:
		var tw: Tween = n.create_tween()
		tw.tween_property(n, "position", dest, secs)
		while tw.is_running():
			if skipping:
				tw.kill()
				break
			await get_tree().process_frame
		n.position = dest
	n.tile = to
	n.from = to
	n.action = "idle"


# ── Waiting: a time, cut short by a skip (or by a tap, for captions) ──
func _hold(secs: float, tap_ends: bool) -> void:
	var left := secs
	var tapped := {"v": false}
	var cb := func(): tapped.v = true
	if tap_ends:
		_tap.connect(cb)
	while left > 0.0 and not skipping and not tapped.v:
		await get_tree().process_frame
		left -= get_process_delta_time()
	if tap_ends:
		_tap.disconnect(cb)


func _unhandled_input(ev: InputEvent) -> void:
	if not playing:
		return
	if ev is InputEventKey and ev.pressed and not ev.echo:
		if ev.keycode == KEY_ESCAPE:
			skip()
		elif ev.keycode in [KEY_SPACE, KEY_ENTER, KEY_KP_ENTER, KEY_E]:
			_tap.emit()
		get_viewport().set_input_as_handled()
	elif ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT:
		_tap.emit()
		get_viewport().set_input_as_handled()


func skip() -> void:
	skipping = true
	_tap.emit()


# ── The letterbox, captions and the skip button ──
func _build_ui() -> void:
	var L: Control = T.ui.fx_layer
	for top in [true, false]:
		var r := ColorRect.new()
		r.color = Color(0.02, 0.02, 0.03)
		r.mouse_filter = Control.MOUSE_FILTER_IGNORE
		r.anchor_left = 0.0
		r.anchor_right = 1.0
		r.anchor_top = 0.0 if top else 1.0
		r.anchor_bottom = 0.0 if top else 1.0
		r.offset_top = 0.0 if top else 0.0
		r.offset_bottom = 0.0
		L.add_child(r)
		bars.append(r)
	cap_box = PanelContainer.new()
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color(0, 0, 0, 0)
	sb.set_content_margin_all(6)
	cap_box.add_theme_stylebox_override("panel", sb)
	cap_box.anchor_left = 0.1
	cap_box.anchor_right = 0.9
	cap_box.anchor_top = 1.0
	cap_box.anchor_bottom = 1.0
	cap_box.offset_top = -88
	cap_box.offset_bottom = -8
	cap_box.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var col := VBoxContainer.new()
	col.add_theme_constant_override("separation", 2)
	col.alignment = BoxContainer.ALIGNMENT_CENTER
	cap_name = Label.new()
	cap_name.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	cap_name.add_theme_color_override("font_color", Color("#f5b82e"))
	cap_name.add_theme_font_override("font", T.ui.bold)
	cap_name.add_theme_font_size_override("font_size", 15)
	cap_text = Label.new()
	cap_text.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	cap_text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	cap_text.add_theme_color_override("font_color", Color("#f7f2e8"))
	cap_text.add_theme_font_size_override("font_size", 19)
	col.add_child(cap_name)
	col.add_child(cap_text)
	cap_box.add_child(col)
	L.add_child(cap_box)
	skip_btn = T.ui.button("Skip  ▸▸", false, skip)
	skip_btn.anchor_left = 1.0
	skip_btn.anchor_right = 1.0
	skip_btn.offset_left = -118
	skip_btn.offset_right = -12
	skip_btn.offset_top = 10
	skip_btn.offset_bottom = 46
	skip_btn.modulate = Color(1, 1, 1, 0.85)
	skip_btn.focus_mode = Control.FOCUS_NONE
	L.add_child(skip_btn)
	_caption("", "")


func _free_ui() -> void:
	for r in bars:
		r.queue_free()
	bars.clear()
	for c in [cap_box, skip_btn]:
		if c:
			c.queue_free()
	cap_box = null
	skip_btn = null


func _caption(nm: String, text: String) -> void:
	if cap_box == null:
		return
	cap_name.text = nm.to_upper()
	cap_name.visible = nm != ""
	cap_text.text = text
	cap_box.visible = text != ""


## Slide the bars in (or out): about an eighth of the screen each.
func _bars(on: bool) -> void:
	var h: float = T.ui.root.size.y * 0.12
	var set_h := func(v: float) -> void:
		if bars.size() == 2:
			bars[0].offset_bottom = v
			bars[1].offset_top = -v
	if T.reduce_motion:
		set_h.call(h if on else 0.0)
		return
	var tw := create_tween()
	tw.tween_method(set_h, 0.0 if on else h, h if on else 0.0, 0.35)
	await tw.finished


func _fade(out: bool, secs: float) -> void:
	if out:
		if _fade_rect == null:
			_fade_rect = ColorRect.new()
			_fade_rect.color = Color(0.02, 0.02, 0.03)
			_fade_rect.set_anchors_preset(Control.PRESET_FULL_RECT)
			_fade_rect.mouse_filter = Control.MOUSE_FILTER_IGNORE
			T.ui.fx_layer.add_child(_fade_rect)
			T.ui.fx_layer.move_child(_fade_rect, 0)   # under the bars and captions
		_fade_rect.modulate.a = 0.0
	elif _fade_rect == null:
		return
	var r := _fade_rect
	var want := 1.0 if out else 0.0
	if skipping or T.reduce_motion:
		r.modulate.a = want
	else:
		var tw := r.create_tween()
		tw.tween_property(r, "modulate:a", want, secs)
		await tw.finished
	if not out:
		r.queue_free()
		_fade_rect = null


var _fade_rect: ColorRect
