# A puzzle chamber: the maths is solved by moving things in a place of its own (a cave, a cellar, a vault), not in a panel.
# The chamber is an ordinary map with "chamber" in it (see art3d.gd chamber_shell); its puzzle pieces are added on top while
# the puzzle runs. Town owns one of these (Town.chamber) and offers:
#
#   var r = await T.puzzle(cfg)        → { tier: "first" | "second" | "later", first: bool, picks, worked: bool }
#
# cfg = {
#   id, key, label                     saved under S.pz[id]; recorded for the report as key / label, like T.ask
#   map                                the chamber's map id (you are taken there if you are elsewhere)
#   pieces: { pid: { kind, x, y, … } } see KINDS below
#   marks: [[x, y, text, colour?]]     words painted on the floor (a frost line's numbers)
#   lines: [[x0, y, x1, colour?]]      a glowing line painted along row y from tile x0 to x1 (a number line); ticks: true adds ticks
#   check: Callable(st) → { ok, who?, say?: text or [lines], fx?: "shake" | "flare" }   run on every commit
#   read: { pid: Callable(st) → value } what a gauge or pie shows (recomputed after every change)
#   hint: Callable(T, st)              "Ask for a hint" (the button and H): talk, or open a hint panel
#   solve: Callable(st, how)           the test player's move: put the pieces right ("right") or plant a mistake ("wrong")
#   worked: Callable(T, st)            optional: plays when the tries run out (a short scene); then the pieces go right
#   max: tries before the worked fix   (Gentle 3, Real 2 by default)
#   enter_at: [x, y]                   where you stand when taken there
# }
# st (the saved state) = { p: { pid: { x, y, i, on } }, tries, hints, done, last } — the game reads it in check / read.
#
# KINDS — every piece can carry label (text shown on it) and look (a colour):
#   block    solid; walk into it (or tap it) to push it one tile. style: "ice" | "stone" | "sack" | "crate"
#   plate    a pressure plate; pressed while you or a block stand on it. commit: true makes stepping on it a commit
#   lever    use it to commit (or reset: true to put every block back where it started)
#   dial     use it to turn to the next of values: [...] (shown on it); st.p[pid].i is the index
#   brazier  use it to light or put out; st.p[pid].on
#   gauge    a column filled to read[pid](st) between lo and hi (water level, frost); shows the value too
#   pie      a floor disc of den sectors with read[pid](st) of them lit (a sixths dial)
#   tablet   use it to commit with a typed answer: cfg.tablet(T, st) runs the T.frac and returns its tier
#   door     a gate across a way on; opens when the puzzle is solved
extends Node

const Art3D = preload("res://engine/world3d/art3d.gd")

signal committed(pid: String)

const DIRS := {"left": Vector2i(-1, 0), "right": Vector2i(1, 0), "up": Vector2i(0, -1), "down": Vector2i(0, 1)}
const STYLE := {"ice": ["#cfe6f5", "#eef7fd"], "stone": ["#8a8378", "#a39b8e"], "sack": ["#c9a874", "#dcc08f"], "crate": ["#8e6a45", "#a8804f"],
	"wedge": ["#9d8fb4", "#b9acd0"]}

var T                               # Town
var C := {}                         # the puzzle's cfg
var st := {}
var active := false
var root: Node3D
var nodes := {}                     # pid → Node3D
var labels := {}                    # pid → Label3D
var hint_btn: Button
var _busy := false
var _pressed := {}                  # plate pid → pressed last frame


func _ready() -> void:
	set_process(false)


# ── Run ──
func run(cfg: Dictionary) -> Dictionary:
	C = cfg
	if not T.S.has("pz"):
		T.S.pz = {}
	var fresh := _fresh()
	var saved = T.S.pz.get(str(C.id))
	st = saved if saved is Dictionary and saved.has("p") else fresh
	for pid in fresh.p:   # a saved puzzle from an older build: add any piece it lacks
		if not st.p.has(pid):
			st.p[pid] = fresh.p[pid]
	T.S.pz[str(C.id)] = st
	if T.world.map == null or T.world.map.id != str(C.map):
		var at: Array = C.get("enter_at", [])
		var m = T.maps[str(C.map)]
		var tile: Vector2i = Vector2i(int(at[0]), int(at[1])) if at.size() == 2 else m.arrive
		T._enter(str(C.map), tile, "up")
	_build()
	active = true
	_busy = false
	T.world.exit_locked = true
	hint_btn = T.ui.add_hud_button("Ask for a hint", _hint)
	set_process(true)
	var max_tries := int(C.get("max", 2 if T.mode() == "real" else 3))
	var first := false
	var worked := false
	while true:
		T.cur = {"kind": "puzzle", "solve": _bot}
		var pid: String = await committed
		T.cur = null
		st.last = pid
		var r: Dictionary = C.check.call(st)
		st.tries = int(st.tries) + 1
		if int(st.tries) == 1:
			first = bool(r.get("ok", false))
		T.save()
		if r.get("ok", false):
			if r.has("say"):
				await T.say(str(r.get("who", "")), r.say)
			break
		await _wrong(r)
		if int(st.tries) >= max_tries:
			worked = true
			if C.has("worked"):
				await C.worked.call(T, st)
			C.solve.call(st, "right")
			_sync(true)
			break
	var picks := int(st.tries)
	var tier: String = "first" if picks == 1 else ("second" if picks == 2 and not worked else "later")
	st.done = true
	if str(C.get("key", "")) != "":
		T.record(str(C.key), str(C.get("label", C.key)), tier)
	await _solved()
	_end()
	return {"tier": tier, "first": first, "picks": picks, "worked": worked}


func _fresh() -> Dictionary:
	var p := {}
	for pid in C.pieces:
		var d: Dictionary = C.pieces[pid]
		p[pid] = {"x": int(d.x), "y": int(d.y), "i": int(d.get("i", 0)), "on": bool(d.get("on", false))}
	return {"p": p, "tries": 0, "hints": 0, "done": false, "last": ""}


func _end() -> void:
	active = false
	set_process(false)
	T.cur = null
	T.world.exit_locked = false
	T.world.push_hook = Callable()   # the pieces stay where they ended, still solid, until you leave the chamber
	for pid in C.pieces:
		T.world.map.things.erase(pid)
	if hint_btn:
		hint_btn.queue_free()
		hint_btn = null
	T.save()


## Take the pieces off the map (the chamber map is loaded fresh next time; a solved puzzle shows its pieces where they ended).
func clear() -> void:
	if root:
		root.queue_free()
		root = null
	nodes.clear()
	labels.clear()


# ── Input: a piece used, a block pushed ──
## Town hands a tap or Space on a thing here first. True when it was a piece.
func on_interact(kind: String, id: String) -> bool:
	if not active or kind != "thing" or not C.pieces.has(id):
		return false
	if _busy or T.ui.open > 0:
		return true
	var d: Dictionary = C.pieces[id]
	var s: Dictionary = st.p[id]
	match str(d.kind):
		"block":
			var me: Vector2i = T.world.me.tile
			var at := Vector2i(int(s.x), int(s.y))
			var dv := at - me
			if absi(dv.x) + absi(dv.y) == 1:
				push(at, _dir_of(dv))
		"dial":
			var vals: Array = d.get("values", [])
			if vals.size() > 0:
				s.i = (int(s.i) + 1) % vals.size()
				_changed(id)
		"brazier":
			s.on = not bool(s.on)
			_changed(id)
		"lever":
			_pull(id)
			if d.get("reset", false):
				reset_blocks()
			else:
				committed.emit(id)
		"tablet":
			_busy = true
			var tier: String = await C.tablet.call(T, st)
			_busy = false
			s.on = tier != ""
			committed.emit(id)
		_:
			pass
	return true


## Push the block at `at` one tile toward `dir`. True when it moved.
func push(at: Vector2i, dir: String) -> bool:
	var pid := _block_at(at)
	if pid == "":
		return false
	var to: Vector2i = at + DIRS[dir]
	if not _free(to):
		T.world.hop("you")
		return false
	var s: Dictionary = st.p[pid]
	s.x = to.x
	s.y = to.y
	_changed(pid)
	return true


func reset_blocks() -> void:
	for pid in C.pieces:
		if str(C.pieces[pid].kind) == "block":
			st.p[pid].x = int(C.pieces[pid].x)
			st.p[pid].y = int(C.pieces[pid].y)
	_sync(true)
	T.save()


func _block_at(at: Vector2i) -> String:
	for pid in C.pieces:
		if str(C.pieces[pid].kind) == "block" and Vector2i(int(st.p[pid].x), int(st.p[pid].y)) == at:
			return pid
	return ""


func _free(p: Vector2i) -> bool:
	var w = T.world
	if w.map.blocked(p.x, p.y) or w.solid_extra.has(p) or w.person_at(p) != "" or p == w.me.tile:
		return false
	if not w.map.outdoor and p.y >= w.map.h - 1:
		return false   # never into the doorway
	return true


static func _dir_of(v: Vector2i) -> String:
	if v.x > 0: return "right"
	if v.x < 0: return "left"
	return "down" if v.y > 0 else "up"


func _changed(pid: String) -> void:
	_sync(false)
	if C.has("changed"):
		C.changed.call(st, pid)
	T.save()


## The test player: put the pieces as `how` asks, then commit (once with a mistake for "second").
func _bot(how: String) -> void:
	if _busy:
		return
	var right: bool = how == "right" or (how == "second" and int(st.tries) >= 1)
	C.solve.call(st, "right" if right else "wrong")
	_sync(true)
	var cp := str(st.get("pick", ""))   # solve may name the plate or lever it chose (a predict plate: "more" or "less")
	st.erase("pick")
	if cp == "":
		cp = _commit_piece()
	if cp != "" and str(C.pieces[cp].kind) == "tablet":
		on_interact("thing", cp)   # the tablet's typed answer is played by the test player too
		return
	committed.emit(cp)


func _commit_piece() -> String:
	for pid in C.pieces:
		var d: Dictionary = C.pieces[pid]
		if (str(d.kind) == "lever" and not d.get("reset", false)) or str(d.kind) == "tablet" or (str(d.kind) == "plate" and d.get("commit", false)):
			return pid
	return ""


# ── Each frame: plates under feet and blocks ──
func _process(_dt: float) -> void:
	if not active or _busy or T.ui.open > 0 or T.busy_talk:
		return
	var me: Vector2i = T.world.me.tile
	var moving: bool = T.world.me.t < 1.0
	for pid in C.pieces:
		var d: Dictionary = C.pieces[pid]
		if str(d.kind) != "plate":
			continue
		var at := Vector2i(int(st.p[pid].x), int(st.p[pid].y))
		var down := (at == me and not moving) or _block_at(at) != ""
		if down != bool(_pressed.get(pid, false)):
			_pressed[pid] = down
			st.p[pid].on = down
			_sync(false)
			if down and d.get("commit", false) and at == me:
				committed.emit(pid)


# ── Wrong, hint, solved ──
func _wrong(r: Dictionary) -> void:
	_busy = true
	match str(r.get("fx", "shake")):
		"flare":
			_flash(Color("#ff7a4a"))
			_shake(0.25)
		_:
			_shake(0.12)
	if r.has("say"):
		await T.say(str(r.get("who", "")), r.say)
	_busy = false


func _hint() -> void:
	if not active or _busy or T.ui.open > 0:
		return
	_busy = true
	st.hints = int(st.hints) + 1
	if C.has("hint"):
		await C.hint.call(T, st)
	_busy = false


func _unhandled_key_input(ev: InputEvent) -> void:
	if active and ev is InputEventKey and ev.pressed and not ev.echo and ev.keycode == KEY_H:
		_hint()
		get_viewport().set_input_as_handled()


func _solved() -> void:
	T.ui.toast("Solved!")
	for pid in C.pieces:
		if str(C.pieces[pid].kind) == "door":
			st.p[pid].on = true
	_sync(false)
	_flash(Color("#ffd76a"))
	if not T.reduce_motion and T.auto == "":
		await get_tree().create_timer(0.6).timeout


func _shake(amount: float) -> void:
	if T.reduce_motion or T.auto != "":
		return
	var cam: Camera3D = T.world.camera
	var tw := create_tween()
	for i in 6:
		tw.tween_property(cam, "h_offset", amount * (1.0 if i % 2 == 0 else -1.0) * (1.0 - i / 6.0), 0.04)
	tw.tween_property(cam, "h_offset", 0.0, 0.04)


func _flash(col: Color) -> void:
	if T.auto != "":
		return
	var r := ColorRect.new()
	r.color = Color(col, 0.28)
	r.set_anchors_preset(Control.PRESET_FULL_RECT)
	r.mouse_filter = Control.MOUSE_FILTER_IGNORE
	T.ui.fx_layer.add_child(r)
	var tw := r.create_tween()
	tw.tween_property(r, "modulate:a", 0.0, 0.5)
	tw.tween_callback(r.queue_free)


func _pull(pid: String) -> void:
	var n: Node3D = nodes.get(pid)
	if n == null or T.reduce_motion:
		return
	var h = n.find_child("Handle", true, false)
	if h:
		var tw := h.create_tween()
		tw.tween_property(h, "rotation:x", 0.9, 0.15)
		tw.tween_property(h, "rotation:x", -0.5, 0.3)


# ── Drawing the pieces ──
func _build() -> void:
	clear()
	_pressed.clear()
	root = Node3D.new()
	T.world.add_child(root)
	for pid in C.pieces:
		var n := _piece_node(pid, C.pieces[pid])
		root.add_child(n)
		nodes[pid] = n
	var mk := Art3D.new()
	mk.font = T.ui.font
	mk.glow_on()
	for ln in C.get("lines", []):
		var col := Color(str(ln[3]) if ln.size() > 3 else "#9fd4ff")
		var z := float(ln[1]) + 0.5
		mk.box(Vector3(float(ln[0]) + 0.5, 0.0, z - 0.04), Vector3(float(ln[2]) - float(ln[0]), 0.02, 0.08), col)
		for x in range(int(ln[0]), int(ln[2]) + 1):
			mk.box(Vector3(x + 0.48, 0.0, z - 0.16), Vector3(0.04, 0.025, 0.32), col)
	mk.glow_off()
	for m in C.get("marks", []):
		var l: Label3D = mk.label3d(str(m[2]), Vector3(float(m[0]) + 0.5, 0.03, float(m[1]) + 0.5), 96, Color(str(m[3]) if m.size() > 3 else "#f4ead2"), Color(0, 0, 0, 0.7), 0.005)
		l.rotation.x = -PI / 2.0
	mk.finish()
	root.add_child(mk)
	T.world.push_hook = push
	_sync(true)


func _piece_node(pid: String, d: Dictionary) -> Node3D:
	var b := Art3D.new()
	b.font = T.ui.font
	var kind := str(d.kind)
	var sty: Array = STYLE.get(str(d.get("style", "stone")), STYLE.stone)
	var col := Color(str(d.get("look", sty[0])))
	match kind:
		"block":
			if str(d.get("style", "")) == "sack":
				b.blob(Vector3(0, 0.36, 0), Vector3(0.36, 0.36, 0.32), col, pid.hash(), 7, 4, 0.12)
				b.cyl(Vector3(0, 0.66, 0), 0.08, 0.12, col.darkened(0.2), 5)
			else:
				b.box(Vector3(-0.42, 0, -0.42), Vector3(0.84, 0.72, 0.84), col.darkened(0.12), Color(str(sty[1])))
				if str(d.get("style", "")) == "ice":
					b.glow_on()
					b.box(Vector3(-0.43, 0.70, -0.43), Vector3(0.86, 0.03, 0.86), Color("#f4fbff"))
					b.glow_off()
		"plate":
			b.cyl(Vector3.ZERO, 0.42, 0.05, Color("#6d6458"), 10)
			b.part_begin()
			b.cyl(Vector3.ZERO, 0.34, 0.06, col, 10)
			var top := b.part_end(Vector3(0, 0.03, 0))
			top.name = "Top"
		"lever":
			b.box(Vector3(-0.3, 0, -0.2), Vector3(0.6, 0.3, 0.4), Color("#5c554c"), Color("#726a5f"))
			b.part_begin()
			b.cyl(Vector3.ZERO, 0.04, 0.75, Color("#6e5038"), 5)
			b.blob(Vector3(0, 0.78, 0), Vector3(0.09, 0.09, 0.09), Color(str(d.get("look", "#c0392b"))), 3, 6, 3, 0.05)
			var hd := b.part_end(Vector3(0, 0.3, 0))
			hd.name = "Handle"
			hd.rotation.x = -0.5
		"dial":
			b.cyl(Vector3.ZERO, 0.32, 0.55, Color("#6b6358"), 8)
			b.part_begin()
			b.disc(Vector3.ZERO, 0.42, col, 16, 0.26)
			var ring := b.part_end(Vector3(0, 0.58, 0))
			ring.name = "Ring"
		"brazier":
			b.cyl(Vector3.ZERO, 0.12, 0.45, Color("#3b4044"), 6)
			b.cyl(Vector3(0, 0.45, 0), 0.18, 0.18, Color("#4a4f55"), 8, 0.32)
			b.part_begin()
			b.glow_on()
			b.cone(Vector3.ZERO, 0.2, 0.5, Color("#ffb347"), 6)
			b.glow_off()
			var fl := b.part_end(Vector3(0, 0.62, 0), Art3D.mats().glow)
			fl.name = "Flame"
		"gauge":
			var hh := float(d.get("height", 2.4))
			b.box(Vector3(-0.32, 0, -0.32), Vector3(0.64, 0.12, 0.64), Color("#5c554c"))
			b.box(Vector3(-0.26, 0.12, -0.26), Vector3(0.52, hh, 0.04), Color("#3f3a35"))   # back plate
			for i in 5:   # tick marks
				b.box(Vector3(-0.3, 0.12 + hh * i / 4.0, -0.22), Vector3(0.1, 0.02, 0.02), Color("#e9dfc8"))
			b.part_begin()
			b.box(Vector3(-0.2, 0, -0.2), Vector3(0.4, 1.0, 0.4), col)
			var fill := b.part_end(Vector3(0, 0.12, 0))
			fill.name = "Fill"
		"pie":
			var den := int(d.get("den", 6))
			var r := float(d.get("r", 1.3))
			b.cyl(Vector3.ZERO, r + 0.08, 0.06, Color("#3d3743"), 24)
			for i in den:
				b.part_begin()
				var a0 := TAU * i / den - PI / 2.0
				var a1 := TAU * (i + 1) / den - PI / 2.0
				var seg := 6
				for j in seg:
					var u0 := lerpf(a0, a1, float(j) / seg) + 0.02
					var u1 := lerpf(a0, a1, float(j + 1) / seg) - 0.02 * float(j == seg - 1)
					b.tri(Vector3.ZERO, Vector3(cos(u0) * r, 0, sin(u0) * r), Vector3(cos(u1) * r, 0, sin(u1) * r), Color.WHITE, Vector3.UP)
				var sn := b.part_end(Vector3(0, 0.07, 0), Art3D.mats().glow.duplicate())
				sn.name = "S%d" % i
		"tablet":
			b.box(Vector3(-0.4, 0, -0.14), Vector3(0.8, 1.1, 0.28), Color("#6f6a73"), Color("#86808a"))
			b.glow_on()
			for i in 3:
				b.box(Vector3(-0.28, 0.35 + 0.22 * i, 0.15), Vector3(0.56 - 0.12 * i, 0.04, 0.01), Color("#f2c84b"))
			b.glow_off()
		"door":
			b.part_begin()
			for i in 5:
				b.box(Vector3(-0.45 + 0.21 * i, 0, -0.05), Vector3(0.08, 1.7, 0.1), Color("#3b4044"))
			b.box(Vector3(-0.5, 1.2, -0.06), Vector3(1.0, 0.08, 0.12), Color("#3b4044"))
			var gate := b.part_end(Vector3.ZERO)
			gate.name = "Gate"
	b.finish()
	if d.has("label") or kind in ["dial", "gauge"]:
		var high := {"block": 1.05, "plate": 0.5, "lever": 1.25, "dial": 1.15, "brazier": 1.35, "gauge": float(d.get("height", 2.4)) + 0.6, "tablet": 1.5, "pie": 0.6}
		var l: Label3D = b.label3d(str(d.get("label", "")), Vector3(0, float(high.get(kind, 1.0)), 0), 64, Color("#fff8e6"), Color(0.08, 0.06, 0.05, 0.9), 0.0055, true)
		l.no_depth_test = true
		l.render_priority = 2
		labels[pid] = l
	return b


## Move every piece to where st has it; mark solid tiles and things on the map.
func _sync(snap: bool) -> void:
	if root == null:
		return
	var w = T.world
	w.solid_extra.clear()
	for pid in C.pieces:
		var d: Dictionary = C.pieces[pid]
		var s: Dictionary = st.p[pid]
		var at := Vector2i(int(s.x), int(s.y))
		var n: Node3D = nodes[pid]
		var pos: Vector3 = w.tile_pos(at)
		if snap or T.reduce_motion:
			n.position = pos
		elif n.position.distance_to(pos) > 0.01:
			var tw := n.create_tween()
			tw.tween_property(n, "position", pos, 0.16)
		var kind := str(d.kind)
		w.map.things[pid] = {"x": at.x, "y": at.y, "w": 1, "h": 1, "label": str(d.get("label", pid))}
		if kind in ["block", "lever", "dial", "brazier", "gauge", "tablet"] or (kind == "door" and not bool(s.on)):
			w.solid_extra[at] = pid
		if kind == "plate":
			w.map.things.erase(pid)   # you step on a plate; it is not something to talk to
		if kind == "pie":
			w.map.things.erase(pid)
		var lbl: Label3D = labels.get(pid)
		match kind:
			"plate":
				var top = n.find_child("Top", true, false)
				if top:
					top.position.y = 0.0 if bool(s.on) else 0.03
			"dial":
				var vals: Array = d.get("values", [])
				if lbl and vals.size() > 0:
					lbl.text = str(vals[int(s.i) % vals.size()])
				var ring = n.find_child("Ring", true, false)
				if ring:
					ring.rotation.y = TAU * int(s.i) / maxf(1.0, vals.size())
			"brazier":
				var fl = n.find_child("Flame", true, false)
				if fl:
					fl.visible = bool(s.on)
			"gauge":
				var v := float(_read(pid, 0.0))
				var lo := float(d.get("lo", 0.0)); var hi := float(d.get("hi", 1.0))
				var f := clampf((v - lo) / maxf(0.0001, hi - lo), 0.0, 1.0)
				var fill = n.find_child("Fill", true, false)
				if fill:
					var want := Vector3(1, maxf(0.02, f * float(d.get("height", 2.4))), 1)
					if snap or T.reduce_motion:
						fill.scale = want
					else:
						fill.create_tween().tween_property(fill, "scale", want, 0.5)
				if lbl:
					lbl.text = str(d.get("label", "")) + ("\n" if d.has("label") else "") + _num(_read(pid, 0.0), d)
			"pie":
				var lit := int(_read(pid, 0))
				for i in int(d.get("den", 6)):
					var sn = n.find_child("S%d" % i, true, false)
					if sn:
						(sn.material_override as StandardMaterial3D).albedo_color = Color(str(d.get("lit", "#f2c84b"))) if i < lit else Color("#4a4452")
			"door":
				var gate = n.find_child("Gate", true, false)
				if gate:
					var want_y := -1.75 if bool(s.on) else 0.0
					if snap or T.reduce_motion:
						gate.position.y = want_y
					elif absf(gate.position.y - want_y) > 0.01:
						gate.create_tween().tween_property(gate, "position:y", want_y, 0.8)


func _read(pid: String, dflt) -> Variant:
	var rd: Dictionary = C.get("read", {})
	return rd[pid].call(st) if rd.has(pid) else dflt


func _num(v, d: Dictionary) -> String:
	if d.has("fmt"):
		return d.fmt.call(v)
	return str(v)
