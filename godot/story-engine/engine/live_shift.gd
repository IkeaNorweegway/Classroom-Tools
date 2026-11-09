# A live shift: a job model (games/payday/jobs/*.gd) running in real time on its own 3D work floor.
# You walk the floor as usual; customers walk in and stand where the model puts them, with a patience ring round their bubble.
# Walking up to a station (Space or a tap) opens its work card, docked at the bottom: the clock keeps running while you use it
# (Gentle: at half speed while a card with buttons is open, and a gold arrow points at the most urgent station).
# Number keys press the card's buttons; Esc or P pauses; any panel (Map, Bag, Menu) pauses too; so does leaving the tab.
# Town owns one of these (Town.live) and offers: var st = await Town.live_shift(job, { seed, real, p, boss, boss_at, hour }).
# Test player: with auto=right|second|wrong the shift is played to the end at once by the model's bots (careful | sloppy |
# random); with shift=play the bot walks the real floor and presses the real card buttons (add ts=4 to speed time up;
# park=<seconds> stops it at the first station with its card open, for screenshots).
extends Node

const MapData = preload("res://engine/world/map_data.gd")
const World = preload("res://engine/world3d/world3d.gd")
const UIScript = preload("res://engine/ui/ui.gd")
const Money = preload("res://engine/core/money.gd")

signal ended

const ACTOR_SPEED := 3.4            # tiles a second
const BOTS := {"right": "careful", "second": "sloppy", "wrong": "random"}

var T                               # Town
var J                               # the job model
var st := {}
var active := false
var hint := false
var drive := false
var nodes := {}                     # actor id → { n, at, path, t }
var leaving := []                   # { n, path, at, t } walking out of the door
var card_root: PanelContainer
var card_title: Label
var card_lines: VBoxContainer
var card_grid: GridContainer
var card_sig := ""
var card_acts := []
var hud_sig := ""
var pause_btn: Button
var start_hour := 16
var _drive_wait := 0.5
var _paused := false


func run(job, o: Dictionary) -> Dictionary:
	J = job
	st = J.make(int(o.seed), bool(o.real), int(o.p))
	start_hour = int(o.get("hour", 16))
	var m := MapData.new("shift_" + J.id, J.room_map)
	T.world.exit_locked = true
	T.world.room_lift = 1.9
	T.world.load_map(m, J.start, "up")
	if o.has("boss"):
		var b: Dictionary = o.boss
		T.world.set_people([{"id": b.id, "x": int(o.boss_at.x), "y": int(o.boss_at.y), "dir": "down", "look": b.look, "bubble": ""}])
	hint = not st.real or int(o.p) == 1
	_build_card()
	pause_btn = T.ui.add_hud_button("Pause", pause)
	active = true
	card_sig = ""
	hud_sig = ""
	if T.auto != "":
		if str(T.args.get("shift", "")) == "play":
			drive = true
			if T.args.has("ts"):
				Engine.time_scale = float(T.args.ts)
		else:
			T.cur = {"kind": "live", "solve": func(how): _finish_fast(str(how))}
	await ended
	return st


func _process(delta: float) -> void:
	if not active:
		return
	if _paused or T.ui.open > 0:
		return
	var has_opts: bool = card_root.visible and card_acts.size() > 0
	var dt := delta * (0.5 if not st.real and has_opts else 1.0)
	st.me = T.world.me.tile
	if str(st.at) != "" and not _near(str(st.at)):
		J.leave(st)
	J.step(st, dt)
	_sync_actors(delta)
	_sync_marks()
	_sync_pops(delta)
	_sync_card()
	_sync_hud()
	if hint:
		var b: Dictionary = J.best(st)
		T.world.set_goal(_station_tile(str(b.go)) if b.has("go") else null)
	if drive:
		_drive(delta)
	if st.over:
		_end()


## A station you are next to (a tap or Space on it, or stepping on a tile the model asked for).
func on_interact(kind: String, id: String) -> void:
	if not active:
		return
	if kind == "thing" and J.stations.has(id):
		J.on_at(st, id)
		card_sig = ""
		_sync_card()
	elif kind == "person":
		T.ui.toast("Keep it up! You're doing fine.")


func _near(sid: String) -> bool:
	var th = T.world.map.things.get(sid)
	if th == null:
		return true
	var me: Vector2i = T.world.me.tile
	for y in range(int(th.y), int(th.y) + int(th.h)):
		for x in range(int(th.x), int(th.x) + int(th.w)):
			if absi(x - me.x) + absi(y - me.y) <= 1:
				return true
	return false


func _station_tile(sid: String) -> Variant:
	if sid.begins_with("@"):
		return J.stand(sid)
	var s = J.stations.get(sid)
	if s == null:
		return null
	return s.get("tile", s.stand)


# ── Customers on the floor ──
static func look_of(seed: int) -> Dictionary:
	var h := absi(seed * 2654435761) % 1000003
	return {"skin": h % 6, "hair": (h / 6) % 7, "hair_style": (h / 42) % 5, "shirt": (h / 210) % 8, "pants": (h / 1680) % 5}


func _door() -> Vector2i:
	return Vector2i(T.world.map.exit_x, T.world.map.h - 1)


func _path(a: Vector2i, b: Vector2i) -> Array:
	var w = T.world
	if not w.astar.is_in_boundsv(a) or not w.astar.is_in_boundsv(b):
		return [b]
	var sa: bool = w.astar.is_point_solid(a)
	var sb: bool = w.astar.is_point_solid(b)
	w.astar.set_point_solid(a, false)
	w.astar.set_point_solid(b, false)
	var pts: Array = Array(w.astar.get_id_path(a, b))
	w.astar.set_point_solid(a, sa)
	w.astar.set_point_solid(b, sb)
	if pts.size() > 0:
		pts.pop_front()
	return pts if pts.size() else [b]


func _sync_actors(delta: float) -> void:
	var w = T.world
	var seen := {}
	for a in J.actors(st):
		seen[a.id] = true
		var e = nodes.get(a.id)
		if e == null:
			var n = World.PersonNode.new()
			n.world = w
			n.set_look(look_of(int(a.look)))
			w._people_root.add_child(n)
			n.place(_door())
			w.walkers[n.get_instance_id()] = n
			e = {"n": n, "at": _door(), "tgt": _door(), "path": [], "t": 0.0}
			nodes[a.id] = e
		var tgt := Vector2i(int(a.x), int(a.y))
		if tgt != e.tgt:
			e.tgt = tgt
			e.path = _path(e.at, tgt)
			e.t = 0.0
		e.n.bubble = str(a.bub)
		e.n.ring = float(a.ring)
		_walk(e, delta)
	for id in nodes.keys():
		if not seen.has(id):
			var e: Dictionary = nodes[id]
			e.path = _path(e.at, _door())
			e.t = 0.0
			e.n.bubble = ""
			e.n.ring = -1.0
			leaving.append(e)
			nodes.erase(id)
	for e in leaving.duplicate():
		_walk(e, delta)
		if e.path.is_empty():
			w.walkers.erase(e.n.get_instance_id())
			e.n.queue_free()
			leaving.erase(e)


func _walk(e: Dictionary, delta: float) -> void:
	var n = e.n
	if e.path.is_empty():
		n.position = T.world.tile_pos(e.at)
		n.pose(false, T.world.clock)
		if n.dir != "up" and e.tgt != _door():
			n.dir = "up"
			n.show_dir()
		return
	var nxt: Vector2i = e.path[0]
	e.t = float(e.t) + delta * ACTOR_SPEED
	n.dir = World._dir_to(e.at, nxt)
	n.show_dir()
	n.position = T.world.tile_pos(e.at).lerp(T.world.tile_pos(nxt), clampf(e.t, 0.0, 1.0))
	n.pose(true, T.world.clock)
	if e.t >= 1.0:
		e.at = nxt
		e.path.pop_front()
		e.t = 0.0


func _sync_marks() -> void:
	var out := []
	for m in J.marks(st):
		var lift := 0.55 if m.get("floor", false) else 1.95
		out.append({"pos": T.world.tile_pos(Vector2i(int(m.x), int(m.y))) + Vector3(0, lift, 0), "bub": m.bub, "ring": float(m.get("ring", -1.0))})
	T.world.live_marks = out


func _sync_pops(delta: float) -> void:
	for p in st.pops:
		T.world.live_pops.append({"pos": T.world.tile_pos(Vector2i(int(p.x), int(p.y))) + Vector3(0, 1.7, 0), "text": p.text, "good": p.good, "t": 0.0})
	st.pops.clear()
	for p in T.world.live_pops.duplicate():
		p.t = float(p.t) + delta
		if p.t > 1.1:
			T.world.live_pops.erase(p)


# ── The work card ──
func _build_card() -> void:
	var ui = T.ui
	card_root = PanelContainer.new()
	card_root.add_theme_stylebox_override("panel", ui._box(UIScript.PAPER, UIScript.ACCENT, 12, 2, 12))
	card_root.mouse_filter = Control.MOUSE_FILTER_STOP
	var v: VBoxContainer = ui.vbox(6)
	card_root.add_child(v)
	card_title = ui.label("", "Strong", false)
	v.add_child(card_title)
	card_lines = ui.vbox(2)
	v.add_child(card_lines)
	card_grid = GridContainer.new()
	card_grid.add_theme_constant_override("h_separation", 6)
	card_grid.add_theme_constant_override("v_separation", 6)
	v.add_child(card_grid)
	ui.root.add_child(card_root)
	ui.root.move_child(card_root, ui.hud.get_index() + 1)
	card_root.visible = false
	_place_card()


## Pinned to the bottom centre and grows upward, so Godot sizes it (setting its size by hand each frame fights wrapped text).
func _card_w() -> float:
	return minf(780.0, card_root.get_viewport_rect().size.x - 24.0)


func _place_card() -> void:
	var wdt := _card_w()
	card_root.anchor_left = 0.5
	card_root.anchor_right = 0.5
	card_root.anchor_top = 1.0
	card_root.anchor_bottom = 1.0
	card_root.grow_horizontal = Control.GROW_DIRECTION_BOTH
	card_root.grow_vertical = Control.GROW_DIRECTION_BEGIN
	card_root.offset_left = -wdt / 2.0
	card_root.offset_right = wdt / 2.0
	card_root.offset_top = -12.0
	card_root.offset_bottom = -12.0


func _sync_card() -> void:
	var cd: Dictionary = J.card(st) if str(st.at) != "" else {}
	var sig := JSON.stringify(cd)
	if sig == card_sig:
		return
	card_sig = sig
	card_acts = []
	for c in card_lines.get_children():
		c.queue_free()
	for c in card_grid.get_children():
		c.queue_free()
	if cd.is_empty():
		card_root.visible = false
		return
	card_root.visible = true
	card_title.text = str(cd.get("title", ""))
	for l in cd.get("lines", []):
		var lb: Label = T.ui.label(str(l), "", false)   # no wrapping: a wrapped label here never settles its layout (Godot 4.7);
		lb.clip_text = true                            # job cards keep each line short instead, and a very narrow
		lb.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS   # screen trims the end rather than breaking
		lb.tooltip_text = str(l)
		card_lines.add_child(lb)
	var opts: Array = cd.get("opts", [])
	card_grid.columns = maxi(1, int(cd.get("cols", mini(opts.size(), 4))))
	for i in opts.size():
		var o: Dictionary = opts[i]
		var key := "" if i >= 10 else ("%d · " % ((i + 1) % 10))
		var a: String = o.a
		var b: Button = T.ui.button(key + str(o.t), o.get("k", "") == "primary", func(): _press(a))
		b.focus_mode = Control.FOCUS_NONE
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		card_grid.add_child(b)
		card_acts.append(a)


func _press(a: String) -> void:
	if not active or _paused:
		return
	J.act(st, a)
	_sync_card()


func _unhandled_key_input(ev: InputEvent) -> void:
	if not active or not ev.pressed or ev.echo or T.ui.open > 0:
		return
	if ev.keycode == KEY_ESCAPE or ev.keycode == KEY_P:
		pause()
		get_viewport().set_input_as_handled()
		return
	var i := -1
	if ev.keycode >= KEY_1 and ev.keycode <= KEY_9:
		i = ev.keycode - KEY_1
	elif ev.keycode == KEY_0:
		i = 9
	if i >= 0 and card_root.visible and i < card_acts.size():
		_press(card_acts[i])
		get_viewport().set_input_as_handled()


# ── The top bar: the shift clock, the tally, what just happened ──
func _sync_hud() -> void:
	var mins := start_hour * 60 + int(240.0 * clampf(float(st.t) / float(st.len), 0.0, 1.0))
	var chips := [{"label": "Clock", "value": Money.clock(mins - mins % 5)}]
	for t in J.tally(st):
		chips.append({"label": str(t[0]), "value": str(t[1])})
	var goal: String = str(st.msg) if str(st.msg) != "" else "%s: %s" % [st.tw.get("name", "Shift"), st.tw.get("line", "")]
	var sig := JSON.stringify(chips) + goal
	if sig != hud_sig:
		hud_sig = sig
		T.ui.set_hud(chips, goal)


func pause() -> void:
	if not active or _paused or T.auto != "":
		return
	_paused = true
	var v = await T.panel("Paused", func(body):
		body.add_child(T.ui.label("The shift is paused. Customers wait for you.")), [["Back to work", "go", true], ["End the shift now", "end"]], st.tw.get("name", ""))
	_paused = false
	if v == "end":
		st.over = true


func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_FOCUS_OUT and active and T != null and T.auto == "":
		pause()


# ── Ending ──
func _finish_fast(how: String) -> void:
	T.cur = null
	J.play_from(st, BOTS.get(how, "careful"))
	_end()


func _end() -> void:
	if not active:
		return
	active = false
	drive = false
	Engine.time_scale = 1.0
	T.cur = null
	T.world.exit_locked = false
	T.world.room_lift = 0.0
	T.world.live_marks = []
	T.world.live_pops = []
	T.world.set_goal(null)
	for e in nodes.values() + leaving:
		T.world.walkers.erase(e.n.get_instance_id())
		e.n.queue_free()
	nodes.clear()
	leaving.clear()
	if is_instance_valid(card_root):
		card_root.queue_free()
	if is_instance_valid(pause_btn):
		pause_btn.queue_free()
	ended.emit()


# ── shift=play: the test player works the real floor ──
func _drive(delta: float) -> void:
	var w = T.world
	if not w.path.is_empty() or w.me.t < 1.0:
		return
	_drive_wait -= delta
	if _drive_wait > 0.0:
		return
	var b: Dictionary = J.best(st)
	if T.args.has("park") and float(st.t) >= float(T.args.park):   # test option park=<seconds>: stand at the first station, card open, and stop
		var sid: String = J.stations.keys()[0]
		b = {"go": sid} if str(st.at) != sid else {}
		if b.is_empty():
			_drive_wait = 999.0
			return
	if b.is_empty():
		_drive_wait = 0.3
		return
	var target: Vector2i = J.stand(str(b.go))
	if w.me.tile != target:
		w.walk_to(target)
		_drive_wait = 0.1
		return
	if not str(b.go).begins_with("@") and (str(st.at) != str(b.go) or str(b.get("a", "")) == ""):
		var tl = _station_tile(str(b.go))
		if tl != null:
			w.me.dir = World._dir_to(w.me.tile, tl)
			w.me.show_dir()
		on_interact("thing", str(b.go))
		_drive_wait = 0.3
		return
	if str(b.get("a", "")) != "":
		if card_acts.has(str(b.a)):
			_press(str(b.a))
		else:
			J.act(st, str(b.a))
	_drive_wait = float(b.get("think", 0.8))
