# CEFL Town v2 — the runtime (autoload "Town"). A game is a script that main.gd hands to Town.start().
# Town owns the save, the world, the interface and the story steps, and gives the game its API:
#
#   await T.say(who, text or [lines])              who: a person id, "you", or "" (narrator). "{name}" becomes the student's name.
#   var i = await T.choose(who, text, options)     → index of the option picked
#   await T.goal(text, target)                     target: "person:id" | "thing:id" | "map:id". The gold arrow points the way.
#   var tier = await T.calc({ key, label, prompt, answer, hint, show })   typed amount, checked to ±2¢ → "first" | "second" | "later"
#   var text = await T.typed({ id, prompt, min })  written reasoning, kept for the report
#   var r = await T.ask(who, { text, opts: [[text, right?, feedback], …] }, key, label)   shuffled; a wrong pick explains and the
#                                                  student tries again → { tier: "first" | "second" | "later", first: bool, picks }
#   var v = await T.box(kind, title, build(p, done), solve(how), kicker, wide)   a game's own panel: build fills p.body / p.foot and
#                                                  calls done.call(value); solve is the test player's move (called until done)
#   var v = await T.panel(title, build(body), [[label, value, primary?]])
#   await T.shop_order(title, note) · await T.shop_plan(note) · var res = await T.shop_run(event) · await T.ledger(res)
#   var st = await T.live_shift(job, { seed, real, p, boss, boss_at, hour })   a job's live shift on its work floor (engine/live_shift.gd)
#   await T.scene(id, shots)                       a cut scene: camera moves, captions, story changes (engine/cutscene.gd)
#   var r = await T.puzzle(cfg)                    a walk-in puzzle in a chamber map (engine/chamber.gd) → like T.ask's result
#   T.give / take / has · T.flag / set_flag · T.remember / knows / trust · T.log_line · T.advance / set_time · T.go(map, x, y, dir)
#   T.banner(kicker, title) · T.toast(text) · T.confetti() · T.save()
#
# The game defines: id, title, unit_label, i_can, start_map, start_at, maps(), people(), where(id, S), talk(id, T), use(id, T),
# bubble(id, S), new_game(S), steps() (method names, run in order; each must be safe to run again from its start),
# hud(S), items(), report(S), shop_cfg, shop_layout, and for the test player bot_order(S) and bot_plan(S).
# Optional: bag(S) → [{ name, about, view: Callable(body) }] (the Bag lists these instead of items, and opens a view);
# my_look(S, look) → the look to draw you with (a job outfit); log_unit ("Day" by default) names the rows of "What I decided".
# A step name may carry an argument after a colon ("plan:3" calls plan(T, "3")).
#
# Test hook: ?debug=1 on the web, or `-- debug=1` on the command line: saves stay in memory (add save=1 to keep them).
# auto=right|second|wrong plays the whole game by itself; quit=1 ends the program when it finishes and prints a summary.
extends Node

const Story = preload("res://engine/core/story.gd")
const Sim = preload("res://engine/core/shop_sim.gd")
const Money = preload("res://engine/core/money.gd")
const MapData = preload("res://engine/world/map_data.gd")
const World = preload("res://engine/world3d/world3d.gd")
const UIScript = preload("res://engine/ui/ui.gd")
const Art = preload("res://engine/world/art.gd")
const TownMap = preload("res://engine/ui/town_map.gd")
const LiveShift = preload("res://engine/live_shift.gd")
const Frac = preload("res://engine/core/frac.gd")
const Cutscene = preload("res://engine/cutscene.gd")
const Chamber = preload("res://engine/chamber.gd")
const ModelView = preload("res://engine/ui/model_view.gd")
const PRONOUNS := {"they": ["they", "them", "their"], "she": ["she", "her", "her"], "he": ["he", "him", "his"]}

signal _goal_hit(target: String)
signal _ui_done(value)
signal _skip_day

const HOUR_TIME := 1.1                 # seconds of animation for one open hour

var D                                  # the game
var G := {}                            # the save: { v, mode, map, x, y, dir, si, S, done, tut }
var P := {}                            # the profile: { v, name, look }
var maps := {}
var world
var ui
var args := {}
var debug := false
var keep_saves := false
var auto := ""
var mem_saves := {}
var goal_text := ""
var goal_target := ""
var cur = null                         # the open box, for the test player: { kind, solve: Callable(how) }
var busy_talk := false
var running_day := false
var finished := false
var reduce_motion := false
var people_def := {}
var live                               # the live-shift runner (engine/live_shift.gd)
var cutscene                           # the cut-scene runner (engine/cutscene.gd)
var chamber                            # the puzzle-chamber runner (engine/chamber.gd)
var _auto_wait := 0
var _hold_seen := 0

var S: Dictionary:
	get:
		return G.S


# ── Start ──
func start(def) -> void:
	D = def
	_read_args()
	for id in D.maps():
		maps[id] = MapData.new(id, D.maps()[id])
	people_def = D.people()
	get_tree().root.size_changed.connect(_fit_scale)
	_fit_scale()
	ui = UIScript.new()
	add_child(ui)
	world = World.new()
	world.font = ui.font
	world.all_maps = maps
	add_child(world)
	move_child(world, 0)
	reduce_motion = _reduced_motion()
	ui.reduce_motion = reduce_motion
	world.reduce_motion = reduce_motion
	world.life_on = not debug or args.has("life")
	world.interacted.connect(_on_interact)
	world.link_stepped.connect(_on_link)
	world.room_exit.connect(_on_room_exit)
	world.moved.connect(_on_moved)
	live = LiveShift.new()
	live.T = self
	add_child(live)
	cutscene = Cutscene.new()
	cutscene.T = self
	add_child(cutscene)
	chamber = Chamber.new()
	chamber.T = self
	add_child(chamber)
	if _map_view() != null:
		ui.add_hud_button("Map", open_town_map)
	ui.add_hud_button("Bag", open_bag)
	ui.add_hud_button("Journal", open_journal)
	ui.add_hud_button("Menu", open_menu)
	var prof = _load(_profile_path())
	if prof is Dictionary and int(prof.get("v", 0)) == 1 and prof.has("name") and prof.has("look"):
		P = prof
	else:
		P = {"v": 1, "name": "", "look": {"skin": 1, "hair": 0, "hair_style": 0, "shirt": 2, "pants": 0}}
	var saved = _load(_save_path())
	if auto != "":
		if args.has("resume") and _valid_game(saved):
			G = saved
			G.si = int(G.si)
			_begin()
			return
		var nm: String = args.get("name", "Sam")
		new_game(nm, P.look, args.get("mode", "gentle"))
		return
	world.load_map(maps[D.start_map], D.start_at, "down")   # the town shows behind the title card
	_show_title(saved if _valid_game(saved) else null)


## Narrow windows get a narrower layout (at least 640 wide) instead of shrinking everything.
func _fit_scale() -> void:
	var win := get_tree().root.size
	if win.x <= 0 or win.y <= 0:
		return
	var w := clampi(win.x, 640, 960)
	var want := Vector2i(w, roundi(w * 0.625))
	if get_tree().root.content_scale_size != want:
		get_tree().root.content_scale_size = want


func _read_args() -> void:
	var raw: Array = []
	if OS.has_feature("web"):
		var q = JavaScriptBridge.eval("location.search", true)
		if q is String and q.length() > 1:
			raw = q.substr(1).split("&")
	else:
		raw = OS.get_cmdline_user_args()
	for a in raw:
		var kv: PackedStringArray = str(a).trim_prefix("--").split("=", true, 1)
		args[kv[0]] = kv[1] if kv.size() > 1 else "1"
	debug = args.get("debug", "") == "1"
	keep_saves = args.get("save", "") == "1"
	if debug:
		auto = args.get("auto", "")


func _reduced_motion() -> bool:
	if args.has("reduce"):
		return true
	if OS.has_feature("web"):
		return bool(JavaScriptBridge.eval("!!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)", true))
	return false


func new_game(nm: String, look: Dictionary, mode: String) -> void:
	P.name = nm
	P.look = look
	var seed := int(args.get("seed", str(randi() % 1000000)))
	G = {"v": 1, "mode": mode, "map": D.start_map, "x": D.start_at.x, "y": D.start_at.y, "dir": "down", "si": 0,
		"S": Story.new_state(seed), "done": false, "tut": false}
	D.new_game(G.S)
	_begin()


func _begin() -> void:
	ui.hud.visible = true
	if D.has_method("on_begin"):   # e.g. move old saves' data into the profile
		D.on_begin(self)
	if D.has_method("maps_for"):
		_build_maps()
	refresh_look()
	_enter(G.map, Vector2i(int(G.x), int(G.y)), G.get("dir", "down"), false)
	save()
	if not G.tut and auto == "":
		await how_to_play()
		G.tut = true
		save()
	G.tut = true
	_run_steps()


func _run_steps() -> void:
	var steps: Array = D.steps()
	while int(G.si) < steps.size():
		_trace("step " + steps[int(G.si)])
		if args.get("stop", "") == steps[int(G.si)]:
			save()
			print("STOPPED-AT %s day=%d cash=%d days=%d" % [steps[int(G.si)], int(S.day), int(S.cash), S.days.size()])
			get_tree().quit()
			return
		var sp: PackedStringArray = str(steps[int(G.si)]).split(":", true, 1)
		if sp.size() > 1:
			await D.call(sp[0], self, sp[1])
		else:
			await D.call(sp[0], self)
		G.si = int(G.si) + 1
		save()
	G.done = true
	if args.has("go"):   # test option go=map,x,y[,zoom]: stand there once the steps are done (screenshots)
		var v: PackedStringArray = str(args.go).split(",")
		go(v[0], int(v[1]), int(v[2]), "down")
		if v.size() > 3:
			world.zoom = float(v[3])
	finished = true
	goal_text = str(D.done_goal) if "done_goal" in D else "You finished! Open the Menu for your report."
	goal_target = ""
	_refresh()
	save()
	if auto != "":
		_auto_summary()


## Rebuild every map from the game's maps_for(S) (a game whose maps change with the story: a sigil opens a way,
## a bridge falls). Keeps you where you are. Without maps_for, maps() is fixed and this does nothing.
func rebuild_maps() -> void:
	if not D.has_method("maps_for"):
		return
	_build_maps()
	if world.map != null:
		world.load_map(maps[world.map.id], world.me.tile, world.me.dir)
		if chamber != null and chamber.active:
			chamber._build()
		_refresh()


func _build_maps() -> void:
	var defs: Dictionary = D.maps_for(S)
	for id in defs:
		maps[id] = MapData.new(id, defs[id])
	world.all_maps = maps


# ── Saves (browser storage on the web; user:// on a computer) ──
func _save_path() -> String:
	return "user://cefl-town2-%s-v1.json" % D.id


func _profile_path() -> String:
	return "user://cefl-town2-profile-v1.json"


func _store(path: String, v) -> void:
	if debug and not keep_saves:
		mem_saves[path] = JSON.stringify(v)
		return
	var f := FileAccess.open(path, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(v))


func _load(path: String) -> Variant:
	if debug and not keep_saves:
		return JSON.parse_string(mem_saves[path]) if mem_saves.has(path) else null
	if not FileAccess.file_exists(path):
		return null
	var f := FileAccess.open(path, FileAccess.READ)
	return JSON.parse_string(f.get_as_text()) if f else null


func _valid_game(g) -> bool:
	return g is Dictionary and int(g.get("v", 0)) == 1 and g.get("mode") in ["gentle", "real"] and g.has("si") and g.has("x") \
		and maps.has(g.get("map", "")) and Story.validate(g.get("S")) and (not D.has_method("validate") or D.validate(g.S))


func save() -> void:
	if G.is_empty() or running_day or world.map == null or (live != null and live.active):
		return
	G.map = world.map.id
	G.x = world.me.tile.x
	G.y = world.me.tile.y
	G.dir = world.me.dir
	_store(_save_path(), G)
	_store(_profile_path(), P)


func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_CLOSE_REQUEST or what == NOTIFICATION_APPLICATION_FOCUS_OUT:
		if D != null:
			save()


# ── Maps and people ──
func _enter(id: String, at: Vector2i, dir: String, fade := true) -> void:
	if chamber != null and not chamber.active:
		chamber.clear()   # a finished puzzle's pieces go with the chamber you leave
	world.load_map(maps[id], at, dir)
	_on_moved()
	if fade and not reduce_motion and auto == "":
		var r := ColorRect.new()
		r.color = Color(0.12, 0.1, 0.08, 0.8)
		r.set_anchors_preset(Control.PRESET_FULL_RECT)
		r.mouse_filter = Control.MOUSE_FILTER_IGNORE
		ui.fx_layer.add_child(r)
		var tw := create_tween()
		tw.tween_interval(0.12)                         # the next area builds its first squares under this
		tw.tween_property(r, "modulate:a", 0.0, 0.3)
		tw.tween_callback(r.queue_free)
	_refresh()
	save()
	_goal_hit.emit("map:" + id)


# ── Districts and the Town Map ──
var _district := ""

## A banner names the district when you walk into a new one (maps with "districts").
func _on_moved() -> void:
	if world.map == null or not world.map.outdoor:
		_district = ""
		return
	var name := ""
	for d in world.map.def.get("districts", []):
		var t: Vector2i = world.me.tile
		if t.x >= int(d.x) and t.y >= int(d.y) and t.x < int(d.x) + int(d.w) and t.y < int(d.y) + int(d.h):
			name = d.name
			break
	if name != _district:
		_district = name
		if name != "" and auto == "":
			ui.banner(world.map.name, name)


## The outdoor map the Town Map shows: the one you are on, or the one whose door you came in by (null when none has districts).
func _map_view() -> MapData:
	if world != null and world.map != null:
		if world.map.outdoor and world.map.def.has("districts"):
			return world.map
		for id in maps:
			if maps[id].outdoor and maps[id].outside_door(world.map.id) != null:
				return maps[id]
	for id in maps:
		if maps[id].outdoor and maps[id].def.has("districts"):
			return maps[id]
	return null


func open_town_map() -> void:
	if ui.open > 0 or G.is_empty() or running_day:
		return
	var m := _map_view()
	if m == null:
		return
	var view = TownMap.new(m, ui.font)
	var info: Label = ui.label("", "Muted")
	var show := func(mm: MapData) -> void:
		view.map = mm
		view.you = Vector2i(-1, -1)
		view.here = ""
		view.goal = null
		if world.map == mm:
			view.you = world.me.tile
		else:
			var od = mm.outside_door(world.map.id)
			if od != null:
				view.you = od.at
				view.here = world.map.id
		var place = _target_place(goal_target) if goal_target != "" else null
		if place != null:
			if place.map == mm.id:
				view.goal = place.tile
			else:
				var od2 = mm.outside_door(place.map)
				if od2 != null:
					view.goal = od2.at
		var bits := [mm.name + "."]
		if view.you.x >= 0:
			bits.append("You are here (red).")
		if view.goal != null:
			bits.append("Your goal is the gold diamond.")
		info.text = " ".join(bits)
		view.queue_redraw()
	show.call(m)
	var areas := []
	for id in maps:
		if maps[id].outdoor and maps[id].def.has("districts"):
			areas.append(maps[id])
	await panel("Town Map", func(body):
		if areas.size() > 1:
			var row := HFlowContainer.new()
			row.add_theme_constant_override("h_separation", 6)
			for mm in areas:
				row.add_child(ui.button(mm.name, mm == m, func(): show.call(mm)))
			body.add_child(row)
		body.add_child(info)
		body.add_child(view), [["Close", "close", true]], "CEFL Town", true)


func _unhandled_input(ev: InputEvent) -> void:
	if ui == null:
		return
	if ev is InputEventKey and ev.pressed and not ev.echo and ev.keycode == KEY_M and ui.open == 0 and not G.is_empty():
		open_town_map()
		get_viewport().set_input_as_handled()


func go(id: String, x: int, y: int, dir := "down") -> void:
	_enter(id, Vector2i(x, y), dir)


func _on_link(l: Dictionary) -> void:
	var m: MapData = maps[l.to]
	if l.at == null:
		_enter(l.to, m.arrive, "up")
	else:
		_enter(l.to, l.at, l.dir)


func _on_room_exit() -> void:
	var room: String = world.map.id
	for id in maps:
		var od = maps[id].outside_door(room)
		if od != null:
			_enter(id, od.at, od.dir)
			return


## Everyone on this map, with bubbles; the gold marker; the top bar.
func _refresh() -> void:
	if world.map == null or G.is_empty() or (live != null and live.active):
		return
	var list := []
	for id in people_def:
		var w = D.where(id, S)
		if w != null and w.map == world.map.id:
			var b := "goal" if goal_target == "person:" + id else str(D.bubble(id, S))
			list.append({"id": id, "x": int(w.x), "y": int(w.y), "dir": w.get("dir", "down"), "look": people_def[id].look, "bubble": b})
	world.set_people(list)
	world.set_goal(_goal_tile())
	ui.set_hud(D.hud(S) + (D.profile_hud(P) if D.has_method("profile_hud") else []), goal_text)


func _process(_dt: float) -> void:
	if world == null:
		return
	world.input_enabled = ui.open == 0 and not running_day and not busy_talk and not G.is_empty()
	if not G.is_empty() and not finished:
		G["played"] = float(G.get("played", 0.0)) + _dt
	if auto != "" and not finished:
		_auto_step()


func _on_interact(kind: String, id: String) -> void:
	if live != null and live.active:
		live.on_interact(kind, id)
		return
	if chamber != null and chamber.on_interact(kind, id):
		return
	if ui.open > 0 or busy_talk or running_day:
		return
	var t := kind + ":" + id
	if kind == "person":
		Story.meet(S, id)
		world.face(id, world.me.tile)
	if t == goal_target:
		_goal_hit.emit(t)
		return
	busy_talk = true
	if kind == "person":
		await D.talk(id, self)
	else:
		await D.use(id, self)
	busy_talk = false
	_refresh()


# ── Goals and the route to them across maps ──
func _trace(t: String) -> void:
	if args.has("trace"):
		print("[trace] ", t)


func goal(text: String, target: String) -> void:
	_trace("goal " + target)
	goal_text = text
	goal_target = target
	_refresh()
	if target == "map:" + world.map.id:
		goal_target = ""
		_refresh()
		return
	while true:
		var t: String = await _goal_hit
		if t == target:
			break
	goal_target = ""
	_refresh()


func set_goal_text(text: String) -> void:
	goal_text = text
	_refresh()


func _target_place(target: String) -> Variant:  # { map, tile } or null
	var parts := target.split(":", true, 1)
	match parts[0]:
		"person":
			var w = D.where(parts[1], S)
			return {"map": w.map, "tile": Vector2i(int(w.x), int(w.y))} if w != null else null
		"thing":
			for id in maps:
				if maps[id].things.has(parts[1]):
					var t: Dictionary = maps[id].things[parts[1]]
					return {"map": id, "tile": Vector2i(t.x, t.y)}
		"map":
			return {"map": parts[1], "tile": null}
	return null


func _exits(id: String) -> Array:      # [[tile on this map, the map it leads to]]
	var m: MapData = maps[id]
	var out := []
	for p in m.links:
		out.append([p, m.links[p].to])
	if not m.outdoor:
		for other in maps:
			if maps[other].outside_door(id) != null:
				out.append([Vector2i(m.exit_x, m.h - 1), other])
	return out


func _goal_tile() -> Variant:
	if goal_target == "":
		return null
	var place = _target_place(goal_target)
	if place == null:
		return null
	if place.map == world.map.id:
		return place.tile
	var seen := {world.map.id: true}
	var queue := []
	for e in _exits(world.map.id):
		queue.append([e[1], e[0]])
	while not queue.is_empty():
		var q: Array = queue.pop_front()
		if q[0] == place.map:
			return q[1]
		if seen.has(q[0]):
			continue
		seen[q[0]] = true
		for e in _exits(q[0]):
			queue.append([e[1], q[1]])
	return null


# ── Talking ──
func _speaker(who: String) -> Array:
	if who == "you":
		return [P.name, base_look()]
	if people_def.has(who):
		return [people_def[who].name, people_def[who].look]
	return ["", {}]


## {name}, and the student's pronouns: {they} {them} {their} ({They} {Them} {Their} at the start of a sentence).
func fill(text: String) -> String:
	var pr: Array = PRONOUNS.get(P.get("pron", "they"), PRONOUNS.they)
	text = text.replace("{name}", P.get("name", "you"))
	for i in 3:
		var k: String = ["they", "them", "their"][i]
		text = text.replace("{%s}" % k, pr[i]).replace("{%s}" % k.capitalize(), pr[i].capitalize())
	return text


func say(who: String, text) -> void:
	var lines: Array = text if text is Array else [text]
	for line in lines:
		var sp := _speaker(who)
		ui.show_say(sp[0], sp[1], fill(line), [])
		if people_def.has(who):
			world.face(who, world.me.tile)
			world.hop(who)
		cur = {"kind": "say", "solve": func(_h): ui.next_pressed.emit()}
		await ui.next_pressed
		cur = null
	ui.hide_say()


## best: the option the test player picks for "right" (the last one for "wrong").
func choose(who: String, text: String, options: Array, best := 0) -> int:
	var sp := _speaker(who)
	var shown := []
	for o in options:
		shown.append(fill(o))
	ui.show_say(sp[0], sp[1], fill(text), shown)
	if people_def.has(who):
		world.face(who, world.me.tile)
	var pick_for := func(how): return options.size() - 1 if how == "wrong" and best == 0 else (0 if how == "wrong" else best)
	cur = {"kind": "choose", "solve": func(how): ui.choice_made.emit(pick_for.call(how))}
	var i: int = await ui.choice_made
	cur = null
	ui.hide_say()
	return i


func panel(title: String, build: Callable, buttons: Array, kicker := "", wide := false) -> Variant:
	var p: Dictionary = ui.open_panel(title, kicker, wide)
	if build.is_valid():
		build.call(p.body)
	var first_primary = null
	for b in buttons:
		var primary: bool = b.size() > 2 and b[2]
		var v = b[1]
		var btn: Button = ui.button(b[0], primary, func(): _ui_done.emit(v))
		p.foot.add_child(btn)
		if primary and first_primary == null:
			first_primary = v
			btn.call_deferred("grab_focus")
	var pick = first_primary if first_primary != null else (buttons[0][1] if buttons.size() else null)
	cur = {"kind": "panel", "solve": func(_h): _ui_done.emit(pick)}
	var res = await _ui_done
	cur = null
	ui.close_panel(p)
	return res


## Typed amount. o = { key, label, prompt, answer (cents), hint, show: Callable(body), unit: "money" }
func calc(o: Dictionary) -> String:
	var p: Dictionary = ui.open_panel(o.get("title", "Check your numbers"), o.get("kicker", ""))
	var body: VBoxContainer = p.body
	if o.has("show"):
		o.show.call(body)
	body.add_child(ui.rich(fill(o.prompt)))
	var row: HBoxContainer = ui.hbox(8)
	var field := LineEdit.new()
	field.placeholder_text = "$0.00"
	field.custom_minimum_size = Vector2(180, 48)
	row.add_child(field)
	var check: Button = ui.button("Check", true)
	row.add_child(check)
	body.add_child(row)
	var fb: Label = ui.label("", "Strong")
	body.add_child(fb)
	var cont: Button = ui.button("Continue", true)
	cont.visible = false
	p.foot.add_child(cont)
	var max_tries := 3 if G.mode == "gentle" else 2
	var st := {"tries": 0, "tier": ""}
	var answer := int(o.answer)
	var do_check := func():
		if st.tier != "":
			return
		var got = Money.parse(field.text)
		if got == null:
			fb.text = "Type an amount, like 12.50."
			fb.add_theme_color_override("font_color", UIScript.BAD)
			return
		if Money.close(got, answer):
			st.tier = ["first", "second", "later"][mini(st.tries, 2)]
			fb.text = "Right: %s." % Money.fmt(answer)
			fb.add_theme_color_override("font_color", UIScript.GOOD)
		else:
			st.tries += 1
			if st.tries >= max_tries:
				st.tier = "later"
				fb.text = "Not quite. The answer is %s." % Money.fmt(answer) + ("\n" + o.why if o.has("why") else "")
				fb.add_theme_color_override("font_color", UIScript.BAD)
			else:
				fb.text = "Not yet. " + (o.get("hint", "Check each line again.") if G.mode == "gentle" else "Try again.")
				fb.add_theme_color_override("font_color", UIScript.BAD)
		if st.tier != "":
			Story.record(S, o.key, o.label, st.tier, {"typed": field.text, "answer": answer})
			check.disabled = true
			field.editable = false
			cont.visible = true
			cont.call_deferred("grab_focus")
	check.pressed.connect(do_check)
	field.text_submitted.connect(func(_t): do_check.call())
	cont.pressed.connect(func(): _ui_done.emit(st.tier))
	field.call_deferred("grab_focus")
	cur = {"kind": "calc", "solve": func(how):
		if cont.visible:
			cont.pressed.emit()
		elif how == "right" or (how == "second" and st.tries >= 1):
			field.text = Money.fmt(answer)
			do_check.call()
		else:
			field.text = Money.fmt(answer + 1000)
			do_check.call()}
	var tier: String = await _ui_done
	cur = null
	ui.close_panel(p)
	return tier


## Typed exact rational answer (fractions, mixed numbers, exact decimals; equivalent forms are right).
## o = { key, label, prompt, answer ("−5/12" or [n, d]), title?, kicker?, hint?, hint_btn? ("Ask Hesper": in Gentle a wrong try
##       shows this button, which shows the hint), why?, show?: Callable(body), unit? ("°C"), traps?: [[value, feedback]],
##       judge?: Callable(value) → extra line for a wrong value, on_wrong?: Callable(value), lose? (no answer shown after the
##       last try: returns "lost"), tries? (override), record? (false: not in the report), right_line? }
## → "first" | "second" | "later" (| "lost"). A rounded decimal for a repeating answer says "close" and is not a try.
func frac(o: Dictionary) -> String:
	var ans: Array = o.answer if o.answer is Array else Frac.parse(str(o.answer))
	var p: Dictionary = ui.open_panel(o.get("title", "Check your answer"), o.get("kicker", ""))
	var body: VBoxContainer = p.body
	if o.has("show"):
		o.show.call(body)
	body.add_child(ui.rich(fill(o.prompt)))
	var row: HBoxContainer = ui.hbox(8)
	var field := LineEdit.new()
	field.placeholder_text = o.get("placeholder", "like -5/12 or 6.25")
	field.custom_minimum_size = Vector2(200, 48)
	row.add_child(field)
	if o.has("unit"):
		row.add_child(ui.label(o.unit, "Strong", false))
	var check: Button = ui.button("Check", true)
	row.add_child(check)
	body.add_child(row)
	var fb: Label = ui.label("", "Strong")
	body.add_child(fb)
	var hint_l: Label = ui.label("", "Muted")
	hint_l.visible = false
	body.add_child(hint_l)
	var hint_b: Button = ui.button(o.get("hint_btn", "Hint"))
	hint_b.visible = false
	hint_b.pressed.connect(func():
		hint_l.text = fill(str(o.get("hint", "")))
		hint_l.visible = true
		hint_b.visible = false)
	p.foot.add_child(hint_b)
	var cont: Button = ui.button("Continue", true)
	cont.visible = false
	p.foot.add_child(cont)
	var max_tries := int(o.get("tries", 3 if G.mode == "gentle" else 2))
	var st := {"tries": 0, "tier": "", "typed": []}
	var ans_text := Frac.dec_text(ans) if o.get("as_dec", false) else Frac.text(ans)
	var bad := func(t: String):
		fb.text = t
		fb.add_theme_color_override("font_color", UIScript.BAD)
	var do_check := func():
		if st.tier != "":
			return
		var c := Frac.check(field.text, ans)
		if c.empty:
			bad.call("Type a number, like -5/12, 6 1/4 or 6.25.")
			return
		st.typed.append(field.text)
		if c.close:
			bad.call("Close, but that decimal is rounded. Give it as a fraction.")
			return
		if c.ok:
			st.tier = ["first", "second", "later"][mini(st.tries, 2)]
			var line: String = o.get("right_line", "Right: %s." % ans_text)
			if not c.simplest:
				line += " (Simplest form: %s.)" % Frac.text(ans)
			fb.text = fill(line)
			fb.add_theme_color_override("font_color", UIScript.GOOD)
		else:
			st.tries += 1
			var extra := ""
			for t in o.get("traps", []):
				if Frac.eq(c.value, Frac.parse(str(t[0]))):
					extra = str(t[1])
			if extra == "" and o.has("judge"):
				extra = str(o.judge.call(c.value))
			if o.has("on_wrong"):
				o.on_wrong.call(c.value)
			if st.tries >= max_tries:
				if o.get("lose", false):
					st.tier = "lost"
					bad.call(fill("Not quite. " + extra).strip_edges())
				else:
					st.tier = "later"
					bad.call(fill(("Not quite. " + extra).strip_edges() + "\nThe answer is %s." % ans_text + ("\n" + o.why if o.has("why") else "")))
				hint_b.visible = false
			else:
				bad.call(fill(("Not yet. " + extra).strip_edges() + ("" if G.mode == "gentle" else " Try again.")))
				hint_b.visible = G.mode == "gentle" and o.has("hint") and not hint_l.visible
		if st.tier != "":
			if o.get("record", true):
				Story.record(S, o.key, o.label, "later" if st.tier == "lost" else st.tier, {"typed": st.typed, "answer": Frac.text(ans)})
			check.disabled = true
			field.editable = false
			cont.visible = true
			cont.call_deferred("grab_focus")
	check.pressed.connect(do_check)
	field.text_submitted.connect(func(_t): do_check.call())
	cont.pressed.connect(func(): _ui_done.emit(st.tier))
	field.call_deferred("grab_focus")
	var wrong_text: String = str(o.get("bot_wrong", Frac.text(Frac.add(ans, [1, 1])).replace("−", "-")))
	cur = {"kind": "frac", "key": o.get("key", ""), "solve": func(how):
		if cont.visible:
			cont.pressed.emit()
		elif how == "right" or (how == "second" and st.tries >= 1):
			field.text = Frac.text(ans).replace("−", "-")
			do_check.call()
		else:
			field.text = wrong_text
			do_check.call()}
	var tier: String = await _ui_done
	cur = null
	ui.close_panel(p)
	return tier


## Written reasoning. o = { id, title, prompt, min (characters) }
func typed(o: Dictionary) -> String:
	var p: Dictionary = ui.open_panel(o.get("title", "In your own words"), o.get("kicker", ""))
	p.body.add_child(ui.rich(fill(o.prompt)))
	var box := TextEdit.new()
	box.custom_minimum_size = Vector2(0, 130)
	box.wrap_mode = TextEdit.LINE_WRAPPING_BOUNDARY
	box.text = str(S.typed.get(o.id, ""))
	p.body.add_child(box)
	var need := int(o.get("min", 30))
	var hint: Label = ui.label("", "Muted")
	p.body.add_child(hint)
	var save_b: Button = ui.button("Save", true, func(): _ui_done.emit(box.text.strip_edges()))
	p.foot.add_child(save_b)
	var upd := func():
		var n := box.text.strip_edges().length()
		save_b.disabled = n < need
		hint.text = "" if n >= need else "Write a little more (at least %d characters)." % need
	box.text_changed.connect(upd)
	upd.call()
	box.call_deferred("grab_focus")
	cur = {"kind": "typed", "solve": func(_h):
		box.text = str(o.get("bot", "Test player: a written answer for the report, long enough to save."))
		upd.call()
		save_b.pressed.emit()}
	var text: String = await _ui_done
	cur = null
	S.typed[o.id] = {"prompt": o.prompt, "text": text}
	ui.close_panel(p)
	return text


# ── State helpers for the game ──
func flag(k: String, default = null) -> Variant: return Story.flag(S, k, default)
func set_flag(k: String, v) -> void: Story.set_flag(S, k, v)
func remember(who: String, note := "", t := 0) -> void: Story.remember(S, who, note, t)
func knows(who: String, note: String) -> bool: return Story.knows(S, who, note)
func trust(who: String) -> int: return Story.trust(S, who)
func log_line(text: String) -> void: Story.log_line(S, text)
func record(key: String, label: String, tier: String, extra = null) -> void: Story.record(S, key, label, tier, extra)
func has(id: String) -> bool: return Story.count(S, id) > 0
func take(id: String, n := 1) -> bool: return Story.take(S, id, n)
func advance(minutes: int) -> void:
	Story.advance(S, minutes)
	_refresh()
func set_time(day: int, minutes: int) -> void:
	Story.set_time(S, day, minutes)
	_refresh()


func give(id: String, n := 1) -> void:
	Story.give(S, id, n)
	var it: Dictionary = D.items().get(id, {"name": id})
	ui.toast("Added to your Bag: " + it.name)


func banner(kicker: String, title: String) -> void: ui.banner(kicker, title)
func toast(text: String, good := true) -> void: ui.toast(text, good)
func confetti() -> void: ui.confetti()
func mode() -> String: return G.mode
func player_name() -> String: return P.name


## Your own look before any job outfit: the game's avatar (D.base_look(P), e.g. the student and what you wear) or P.look.
func base_look() -> Dictionary:
	return D.base_look(P) if D.has_method("base_look") else P.look


## Redraws you (after a game changes your outfit, or you change clothes).
func refresh_look() -> void:
	world.set_my_look(D.my_look(S, base_look()) if D.has_method("my_look") and not G.is_empty() else base_look())


func refresh() -> void:
	_refresh()


## A multiple-choice question. q.opts = [[text, right (bool or 1/0), feedback], …], shown in a shuffled order. A wrong pick
## shows its feedback and the student picks again; the first pick is recorded under key (no key: not recorded).
func ask(who: String, q: Dictionary, key := "", label := "") -> Dictionary:
	var order := range(q.opts.size())
	var rng := RandomNumberGenerator.new()
	rng.seed = hash(str(S.seed) + key + q.text)
	for i in range(order.size() - 1, 0, -1):
		var j := rng.randi_range(0, i)
		var t = order[i]
		order[i] = order[j]
		order[j] = t
	var left: Array = order.duplicate()
	var picks := 0
	var first := false
	while true:
		var shown := []
		var best := 0
		for i in left.size():
			shown.append(q.opts[left[i]][0])
			if bool(q.opts[left[i]][1]):
				best = i
		var wrong_i := 0 if best != 0 else mini(1, left.size() - 1)
		var sp := _speaker(who)
		ui.show_say(sp[0], sp[1], fill(q.text), shown)
		if people_def.has(who):
			world.face(who, world.me.tile)
		var cnt := picks
		cur = {"kind": "ask", "solve": func(how): ui.choice_made.emit(best if how == "right" or (how == "second" and cnt >= 1) else wrong_i)}
		var i: int = await ui.choice_made
		cur = null
		ui.hide_say()
		var o: Array = q.opts[left[i]]
		picks += 1
		if picks == 1:
			first = bool(o[1])
		if bool(o[1]):
			if str(o[2]) != "":
				await say(who, str(o[2]))
			break
		await say(who, str(o[2]) if str(o[2]) != "" else "Not quite. Try again.")
		left.remove_at(i)
	var tier: String = "first" if picks == 1 else ("second" if picks == 2 else "later")
	if key != "":
		record(key, label if label != "" else q.text, tier)
	return {"tier": tier, "first": first, "picks": picks}


## A game's own panel. build(p, done): p = { body, foot, card }; done.call(value) closes it and returns value.
## solve(how) is the test player's next move; it is called every other frame until the panel is done.
func box(kind: String, title: String, build: Callable, solve: Callable, kicker := "", wide := false) -> Variant:
	var p: Dictionary = ui.open_panel(title, kicker, wide)
	var st := {"done": false}
	var done := func(v = null):
		if not st.done:
			st.done = true
			_ui_done.emit(v)
	build.call(p, done)
	cur = {"kind": kind, "solve": solve}
	var res = await _ui_done
	cur = null
	ui.close_panel(p)
	save()
	return res


## A cut scene (engine/cutscene.gd). Its `do` steps always run, so skipping never changes the story.
func scene(id: String, shots: Array, replay := false) -> void:
	_trace("scene " + id)
	await cutscene.play(id, shots, replay)


## A walk-in puzzle in a chamber (engine/chamber.gd). Returns { tier, first, picks, worked }.
func puzzle(cfg: Dictionary) -> Dictionary:
	_trace("puzzle " + str(cfg.id))
	return await chamber.run(cfg)


## A live shift on a job's own work floor (engine/live_shift.gd). o = { seed, real, p, boss: { id, look }, boss_at, hour }.
## Returns the job's final state (job.tier(st), st.good, st.why…). The caller moves you back afterwards.
func live_shift(job, o: Dictionary) -> Dictionary:
	_trace("live " + str(job.id))
	return await live.run(job, o)


# ── The shop ──
func _product_row(body: VBoxContainer, id: String, title: String, sub: String) -> HBoxContainer:
	var row: HBoxContainer = ui.hbox(10)
	row.add_child(ui.pic(id, 40))
	var col: VBoxContainer = ui.vbox(0)
	col.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	col.add_child(ui.label(title, "Strong"))
	if sub != "":
		col.add_child(ui.label(sub, "Muted"))
	row.add_child(col)
	body.add_child(row)
	return row


func _stepper(row: HBoxContainer, value: int, lo: int, hi: int, step: int, show: Callable, changed: Callable) -> Dictionary:
	var st := {"v": value}
	var minus: Button = ui.button("−")
	var plus: Button = ui.button("+")
	minus.custom_minimum_size = Vector2(46, 46)
	plus.custom_minimum_size = Vector2(46, 46)
	var lab: Label = ui.label(show.call(value), "Strong", false)
	lab.custom_minimum_size = Vector2(76, 0)
	lab.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var upd := func(d):
		st.v = clampi(st.v + d, lo, hi)
		lab.text = show.call(st.v)
		minus.disabled = st.v <= lo
		plus.disabled = st.v >= hi
		changed.call()
	minus.pressed.connect(func(): upd.call(-step))
	plus.pressed.connect(func(): upd.call(step))
	minus.disabled = value <= lo
	minus.tooltip_text = "Less"
	plus.tooltip_text = "More"
	row.add_child(minus)
	row.add_child(lab)
	row.add_child(plus)
	st.set = func(v): st.v = v; upd.call(0)
	return st


## Order stock from a supplier. Returns the packs bought (already paid for).
func shop_order(title: String, note := "") -> Dictionary:
	var cfg: Dictionary = D.shop_cfg
	var p: Dictionary = ui.open_panel(title, "Order stock", true)
	var body: VBoxContainer = p.body
	if note != "":
		body.add_child(ui.rich(fill(note)))
	var last = S.days[-1] if S.days.size() else null
	var steppers := {}
	var total: Label = ui.label("", "Strong")
	var buy: Button = ui.button("Buy it", true)
	var recalc := func():
		var packs := {}
		for k in steppers:
			packs[k] = steppers[k].v
		var cost := Sim.order_cost(cfg, S, packs)
		total.text = "Total %s   ·   Cash now %s   ·   Cash after %s" % [Money.fmt(cost), Money.fmt(S.cash), Money.fmt(int(S.cash) - cost)]
		buy.disabled = cost > int(S.cash)
		if buy.disabled:
			total.text += "   (not enough cash)"
	for k in cfg.products:
		var pr := Sim.product(cfg, S, k)
		var sub := "%s: %d %s for %s.  In stock: %d" % [pr.pack_name.left(1).to_upper() + pr.pack_name.substr(1), int(pr.pack_size), pr.unit, Money.fmt(pr.pack_cost), int(S.shop.stock[k])]
		if pr.has("label") and S.shop.grade[k] != "good":
			sub += "  (" + pr.label + ")"
		if last != null:
			sub += "\nYesterday: sold %d" % int(last.by[k].sold)
			if last.waste.has(k):
				sub += ", thrown out %d" % int(last.waste[k])
			if int(last.by[k].soldout) > 0:
				sub += ", %d left because it was sold out" % int(last.by[k].soldout)
		if pr.get("perishable", false):
			sub += "\nGoes stale: what is left at closing is thrown out."
		var row := _product_row(body, k, pr.name, sub)
		steppers[k] = _stepper(row, 0, 0, 20, 1, func(v): return "%d" % v, recalc)
	body.add_child(HSeparator.new())
	body.add_child(total)
	p.foot.add_child(buy)
	recalc.call()
	var done := func():
		var packs := {}
		for k in steppers:
			packs[k] = steppers[k].v
		_ui_done.emit(packs)
	buy.pressed.connect(done)
	cur = {"kind": "order", "solve": func(how):
		var want: Dictionary = D.bot_order(S) if how != "wrong" else {}
		for k in steppers:
			steppers[k].set.call(int(want.get(k, 0)))
		done.call()}
	var packs: Dictionary = await _ui_done
	cur = null
	ui.close_panel(p)
	Sim.order(cfg, S, packs)
	var bits := []
	for k in packs:
		if packs[k] > 0:
			bits.append("%d %s" % [packs[k], cfg.products[k].pack_name + ("s" if packs[k] > 1 and not cfg.products[k].pack_name.ends_with("x") else ("es" if packs[k] > 1 else ""))])
	log_line("Ordered %s for %s." % [", ".join(bits) if bits.size() else "nothing", Money.fmt(Sim.order_cost(cfg, S, packs))])
	_refresh()
	save()
	return packs


## Set today's prices and who works which shift.
func shop_plan(note := "") -> void:
	var cfg: Dictionary = D.shop_cfg
	var p: Dictionary = ui.open_panel("Plan the day", "Prices and staff", true)
	var body: VBoxContainer = p.body
	if note != "":
		body.add_child(ui.rich(fill(note)))
	var last = S.days[-1] if S.days.size() else null
	body.add_child(ui.label("PRICES", "Kicker"))
	var prices := {}
	for k in cfg.products:
		var pr := Sim.product(cfg, S, k)
		var unit_cost := float(pr.pack_cost) / float(pr.pack_size)
		var sub := "Costs you %s each." % Money.fmt(roundi(unit_cost))
		if G.mode == "gentle":
			sub += " Customers expect about %s." % Money.fmt(pr.ref)
		if last != null and int(last.by[k].price) > 0:
			sub += "\nYesterday %d walked out over the price." % int(last.by[k].price)
		var row := _product_row(body, k, pr.name, sub)
		prices[k] = _stepper(row, int(S.shop.price[k]), 50, int(pr.ref) * 3, 25, func(v): return Money.fmt(v), func(): pass)
	body.add_child(HSeparator.new())
	body.add_child(ui.label("STAFF", "Kicker"))
	body.add_child(ui.label("You work every hour and serve about %d customers an hour." % int(cfg.you_per_hour), "Muted"))
	var checks := {}
	var wages: Label = ui.label("", "Strong")
	var upd := func():
		var t := 0
		for k in checks:
			for sh in checks[k]:
				if checks[k][sh].button_pressed:
					var r: Array = cfg.staff[k].shifts[sh]
					t += (int(r[1]) - int(r[0])) * int(cfg.staff[k].wage)
		wages.text = "Wages today: " + Money.fmt(t)
	for k in cfg.staff:
		var sf: Dictionary = cfg.staff[k]
		body.add_child(ui.label("%s: %s an hour, serves about %d customers an hour." % [sf.name, Money.fmt(sf.wage), int(sf.per_hour)]))
		var flow := HFlowContainer.new()
		flow.add_theme_constant_override("h_separation", 8)
		checks[k] = {}
		for sh in sf.shifts:
			var r: Array = sf.shifts[sh]
			var cb := CheckBox.new()
			cb.text = "%s, %s to %s (%s)" % [sh.capitalize(), Money.clock(int(r[0]) * 60), Money.clock(int(r[1]) * 60), Money.fmt((int(r[1]) - int(r[0])) * int(sf.wage))]
			cb.custom_minimum_size = Vector2(0, 46)
			cb.button_pressed = S.shop.shifts[k].has(sh)
			cb.toggled.connect(func(_on): upd.call())
			flow.add_child(cb)
			checks[k][sh] = cb
		body.add_child(flow)
	body.add_child(wages)
	upd.call()
	var ok: Button = ui.button("Open with this plan", true, func(): _ui_done.emit(true))
	p.foot.add_child(ok)
	ok.call_deferred("grab_focus")
	cur = {"kind": "plan", "solve": func(how):
		var plan: Dictionary = D.bot_plan(S) if how != "wrong" else {"shifts": {}, "price": {}}
		for k in plan.get("price", {}):
			prices[k].set.call(int(plan.price[k]))
		for k in checks:
			for sh in checks[k]:
				checks[k][sh].button_pressed = plan.shifts.get(k, []).has(sh)
		_ui_done.emit(true)}
	await _ui_done
	cur = null
	for k in prices:
		S.shop.price[k] = prices[k].v
	for k in checks:
		var on := []
		for sh in checks[k]:
			if checks[k][sh].button_pressed:
				on.append(sh)
		S.shop.shifts[k] = on
	ui.close_panel(p)
	var staff_bits := []
	for k in S.shop.shifts:
		if S.shop.shifts[k].size():
			staff_bits.append("%s (%s)" % [cfg.staff[k].name, ", ".join(S.shop.shifts[k])])
	var price_bits := []
	for k in prices:
		price_bits.append("%s %s" % [cfg.products[k].name.to_lower(), Money.fmt(prices[k].v)])
	log_line("Prices: %s. Staff: %s." % [", ".join(price_bits), ", ".join(staff_bits) if staff_bits.size() else "just you"])
	_refresh()
	save()


## Run one business day. On a reload after the day already ran, returns the stored day.
func shop_run(ev: Dictionary) -> Dictionary:
	if S.days.size() >= int(S.day):
		return S.days[-1]
	var cfg: Dictionary = D.shop_cfg
	var L: Dictionary = D.shop_layout
	var res := Sim.simulate(cfg, S, ev)
	running_day = true
	S.flags.open = true
	world.load_map(maps[L.map], Vector2i(L.you[0], L.you[1]), "down")
	_refresh()
	if not reduce_motion and (auto == "" or args.has("anim")) and not args.has("fast"):
		await _animate_day(res, cfg, L)
	world.clear_walkers()
	Sim.apply(S, res)
	S.min = int(cfg.open[1]) * 60 + 15
	S.flags.erase("open")
	running_day = false
	_refresh()
	save()
	return res


func _animate_day(res: Dictionary, cfg: Dictionary, L: Dictionary) -> void:
	var m: MapData = maps[L.map]
	var E := Vector2i(m.exit_x, m.h - 1)
	var C := Vector2i(L.counter[0], L.counter[1])
	var B := Vector2i(L.board[0], L.board[1])
	var rng := RandomNumberGenerator.new()
	rng.seed = int(S.seed) + int(S.day)
	var tick := PanelContainer.new()
	tick.add_theme_stylebox_override("panel", ui._box(UIScript.PAPER, UIScript.ACCENT, 12, 2, 10))
	var row: HBoxContainer = ui.hbox(12)
	var lab: Label = ui.label("", "Strong", false)
	row.add_child(lab)
	var skip_b: Button = ui.button("Skip to closing", false, func(): _skip_day.emit())
	row.add_child(skip_b)
	tick.add_child(row)
	lab.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	lab.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	ui.fx_layer.add_child(tick)
	tick.mouse_filter = Control.MOUSE_FILTER_STOP
	tick.set_anchors_preset(Control.PRESET_TOP_WIDE)
	tick.offset_left = 12
	tick.offset_right = -12
	tick.offset_top = ui.hud.size.y + 8
	skip_b.grab_focus()
	var st := {"skip": false}
	var on_skip := func(): st.skip = true
	_skip_day.connect(on_skip)
	var served := 0
	var lost := {"soldout": 0, "line": 0, "price": 0}
	for h in res.hours:
		if st.skip:
			break
		S.min = int(h.hour) * 60
		var people: Array = h.people
		var shown := []
		var every := maxi(1, ceili(people.size() / 7.0))
		for i in people.size():
			var o: String = people[i].out
			if o == "served":
				served += 1
			else:
				lost[o] += 1
			if i % every == 0:
				shown.append(people[i])
		lab.text = "%s   ·   Served %d   ·   Left without buying: sold out %d, line too long %d, price too high %d" % [Money.clock(S.min), served, lost.soldout, lost.line, lost.price]
		ui.set_hud(D.hud(S), "The café is open.")
		for i in shown.size():
			var look := {"skin": rng.randi() % 6, "hair": rng.randi() % 7, "hair_style": rng.randi() % 5, "shirt": rng.randi() % 8, "pants": rng.randi() % 5}
			var o: String = shown[i].out
			var A := Vector2i(E.x, C.y)
			var tiles: Array
			var kind := "happy"
			var at := 2
			match o:
				"served":
					tiles = [E, A, C, A, E]
				"soldout":
					tiles = [E, A, C, A, E]
					kind = "soldout"
				"price":
					tiles = [E, Vector2i(E.x, B.y), B, Vector2i(E.x, B.y), E]
					kind = "price"
				_:
					tiles = [E, Vector2i(E.x, E.y - 2), E]
					kind = "line"
					at = 1
			get_tree().create_timer(i * HOUR_TIME / maxf(1.0, shown.size())).timeout.connect(func(): if not st.skip: world.spawn_walker(look, tiles, kind, at, 7.0))
		var t := get_tree().create_timer(HOUR_TIME)
		while t.time_left > 0 and not st.skip:
			await get_tree().process_frame
	_skip_day.disconnect(on_skip)
	tick.queue_free()


# "1 muffin", "3 muffins". A product without unit_one uses unit for both.
func _count(pr: Dictionary, n: int) -> String:
	return "%d %s" % [n, pr.get("unit_one", pr.unit) if n == 1 else pr.unit]


func _ledger_rows(res: Dictionary, hide_profit: bool) -> Array:
	var cfg: Dictionary = D.shop_cfg
	var rows := []
	var sold := []
	for k in cfg.products:
		sold.append(_count(cfg.products[k], int(res.by[k].sold)))
	rows.append(["Sales (%s)" % ", ".join(sold), Money.fmt(res.sales)])
	rows.append(["Stock bought today", "− " + Money.fmt(res.bought)])
	var wl := "Wages"
	if int(res.wages) > 0:
		wl += " (Dev)"
	rows.append([wl, "− " + Money.fmt(res.wages)])
	rows.append(["Rent", "− " + Money.fmt(res.rent)])
	rows.append(["Profit", "?" if hide_profit else Money.fmt(res.profit)])
	return rows


func ledger_table(body: VBoxContainer, res: Dictionary, hide_profit := false) -> void:
	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 24)
	grid.add_theme_constant_override("v_separation", 4)
	var rows := _ledger_rows(res, hide_profit)
	for i in rows.size():
		var a: Label = ui.label(rows[i][0], "Strong" if i == rows.size() - 1 else "", false)
		a.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		var b: Label = ui.label(rows[i][1], "Strong", false)
		b.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
		grid.add_child(a)
		grid.add_child(b)
	body.add_child(grid)
	var cfg: Dictionary = D.shop_cfg
	var waste := []
	for k in res.waste:
		waste.append(_count(cfg.products[k], int(res.waste[k])))
	var lines := "[b]%d[/b] people came in and [b]%d[/b] bought something. Left without buying: [b]%d[/b] sold out, [b]%d[/b] line too long, [b]%d[/b] price too high." % [
		int(res.walkins), int(res.served), int(res.lost.soldout), int(res.lost.line), int(res.lost.price)]
	if waste.size():
		lines += "\nThrown out at closing: %s (already paid for)." % ", ".join(waste)
	var d := int(res.rep_after) - int(res.rep_before)
	lines += "\nReputation went from %d to %d (%s)." % [int(res.rep_before), int(res.rep_after), ("up %d" % d) if d > 0 else (("down %d" % -d) if d < 0 else "no change")]
	body.add_child(ui.rich(lines))


func ledger(res: Dictionary, title := "") -> void:
	await panel(title if title != "" else "Day %d ledger" % int(res.day), func(b): ledger_table(b, res, false), [["Continue", true, true]], "Closing time")


# ── Bag, Journal, Menu, report, start screens ──
func open_bag() -> void:
	if ui.open > 0 or G.is_empty():
		return
	if D.has_method("bag"):
		while true:
			var list: Array = D.bag(S)
			var pick = await panel("Your Bag", func(body):
				if list.is_empty():
					body.add_child(ui.label("Nothing yet.", "Muted"))
				for i in list.size():
					var it: Dictionary = list[i]
					var row: HBoxContainer = ui.hbox(10)
					var txt: RichTextLabel = ui.rich("[b]%s[/b]\n%s" % [it.name, it.get("about", "")])
					txt.size_flags_horizontal = Control.SIZE_EXPAND_FILL
					row.add_child(txt)
					if it.has("view"):
						row.add_child(ui.button("Open", false, func(): _ui_done.emit(i)))
					body.add_child(row), [["Close", -1, true]])
			if int(pick) < 0:
				return
			var it2: Dictionary = list[int(pick)]
			if await panel(it2.name, func(body): it2.view.call(body), [["Back to the Bag", true, true], ["Close", false]], "Your Bag", bool(it2.get("wide", false))) != true:
				return
	await panel("Your Bag", func(body):
		var items: Dictionary = D.items()
		if S.inv.is_empty():
			body.add_child(ui.label("Nothing yet.", "Muted"))
		for id in S.inv:
			var it: Dictionary = items.get(id, {"name": id, "about": ""})
			body.add_child(ui.rich("[b]%s[/b]%s\n%s" % [it.name, (" × %d" % int(S.inv[id])) if int(S.inv[id]) > 1 else "", it.get("about", "")])), [["Close", true, true]])


func open_journal() -> void:
	if ui.open > 0 or G.is_empty():
		return
	await panel("Journal", func(body):
		body.add_child(ui.label("GOAL", "Kicker"))
		body.add_child(ui.label(goal_text if goal_text != "" else "Explore the town."))
		if D.has_method("journal"):   # a game's own Journal sections: [[KICKER, text]]
			for sec in D.journal(S):
				body.add_child(ui.label(sec[0], "Kicker"))
				body.add_child(ui.label(sec[1]))
		body.add_child(ui.label("PEOPLE YOU KNOW", "Kicker"))
		var any := false
		for id in people_def:
			if Story.met(S, id):
				any = true
				var t := Story.trust(S, id)
				var feel := "Trusts you" if t >= 2 else ("Wary of you" if t <= -2 else "Getting to know you")
				var notes: Array = S.mem[id].notes
				var txt := "[b]%s[/b], %s. %s." % [people_def[id].name, people_def[id].get("role", ""), feel]
				for n in notes:
					txt += "\n   · " + n
				body.add_child(ui.rich(txt))
		if not any:
			body.add_child(ui.label("Nobody yet. Go say hello.", "Muted"))
		if S.days.size():
			body.add_child(ui.label("DAYS", "Kicker"))
			var txt := ""
			for d in S.days:
				txt += "Day %d (%s): sales %s, profit [b]%s[/b], reputation %d\n" % [int(d.day), d.label, Money.fmt(d.sales), Money.fmt(d.profit), int(d.rep_after)]
			body.add_child(ui.rich(txt.strip_edges()))
		body.add_child(ui.label("STORY SO FAR", "Kicker"))
		var log_txt := ""
		for l in S.log:
			log_txt += "%s %d: %s\n" % [_log_unit(), int(l.day), l.text]
		body.add_child(ui.label(log_txt.strip_edges() if log_txt != "" else "It starts today.")), [["Close", true, true]], "", true)


func open_menu() -> void:
	if ui.open > 0 or G.is_empty():
		return
	var v = await panel("Menu", func(body):
		body.add_child(ui.label("%s · %s mode · %s played" % [P.name, G.mode.capitalize(), played_text()], "Muted")), [
		["Report", "report", true], ["How to play", "help"], ["Start over", "restart"], ["Close", "close"]])
	match v:
		"report":
			open_report()
		"help":
			how_to_play()
		"restart":
			var sure = await panel("Start over?", func(b): b.add_child(ui.label("This clears this game on this browser. Your report is lost unless you saved it.")), [["Keep playing", false, true], ["Start over", true]])
			if sure:
				_store(_save_path(), {})
				get_tree().reload_current_scene()
				_reset_for_reload()


func _reset_for_reload() -> void:
	G = {}
	finished = false
	goal_target = ""
	goal_text = ""
	for c in get_children():
		c.queue_free()
	maps.clear()


func how_to_play() -> void:
	await panel("How to play", func(body):
		body.add_child(ui.rich("[b]Walk:[/b] arrow keys or W A S D. Or tap where you want to go."))
		body.add_child(ui.rich("[b]Talk or use:[/b] walk up to someone and press Space. Or tap them."))
		body.add_child(ui.rich("[b]Your goal[/b] is in the top bar. The gold arrow shows where to go next."))
		body.add_child(ui.rich("[b]Bag, Journal, Menu[/b] are top right. The Journal shows what people remember about you."))
		, [["Got it", true, true]], "Welcome")


## Time played in this game, "1 h 05 min" or "34 min".
func played_text() -> String:
	var m := int(float(G.get("played", 0.0)) / 60.0)
	return "%d h %02d min" % [m / 60, m % 60] if m >= 60 else "%d min" % m


func report_sections() -> Array:
	var out: Array = D.report(S)
	var rows := []
	for k in S.answers:
		var a: Dictionary = S.answers[k]
		rows.append([a.label, {"first": "Right on the first try", "second": "Right on the second try", "later": "Shown the answer"}.get(a.tier, a.tier)])
	if rows.size():
		out.append({"title": "Checked answers", "rows": rows})
	for k in S.typed:
		out.append({"title": "In my own words", "text": "%s\n\n%s" % [S.typed[k].prompt, S.typed[k].text]})
	var log_rows := []
	for l in S.log:
		log_rows.append(["%s %d" % [_log_unit(), int(l.day)], l.text])
	if log_rows.size():
		out.append({"title": "What I decided", "rows": log_rows})
	return out


func _log_unit() -> String:
	return str(D.log_unit) if "log_unit" in D else "Day"


func open_report() -> void:
	var secs := report_sections()
	var v = await panel("Report", func(body):
		body.add_child(ui.label("%s · %s · %s mode · %s played" % [P.name, D.title, G.mode.capitalize(), played_text()], "Muted"))
		for s in secs:
			body.add_child(ui.label(s.title.to_upper(), "Kicker"))
			if s.has("text"):
				body.add_child(ui.label(s.text))
			for r in s.get("rows", []):
				body.add_child(ui.rich("[b]%s[/b]   %s" % [r[0], r[1]])), [["Download report", "download", true], ["Close", "close"]], "For your teacher", true)
	if v == "download":
		var html := report_html()
		if OS.has_feature("web"):
			JavaScriptBridge.download_buffer(html.to_utf8_buffer(), "%s-report-%s.html" % [str(D.report_file) if "report_file" in D else "cefl-town", P.name.to_lower().replace(" ", "-")], "text/html")
		else:
			var f := FileAccess.open("user://report.html", FileAccess.WRITE)
			f.store_string(html)
			toast("Saved: " + ProjectSettings.globalize_path("user://report.html"))


func report_html() -> String:
	var e := func(t): return str(t).xml_escape()
	var h := "<!DOCTYPE html><html lang=\"en\"><meta charset=\"utf-8\"><title>%s report</title>" % e.call(D.title)
	h += "<style>body{font-family:system-ui,Arial,sans-serif;max-width:760px;margin:24px auto;color:#2c2925;line-height:1.45}h1{margin:0;border-bottom:4px solid #94631a}h2{color:#94631a;font-size:1rem;text-transform:uppercase;letter-spacing:.06em;margin-top:22px}table{border-collapse:collapse;width:100%}td{border-bottom:1px solid #e6e0d4;padding:5px 6px;vertical-align:top}p{white-space:pre-wrap}</style>"
	h += "<h1>%s</h1><p>%s · %s · %s mode · %s played · %s</p>" % [e.call(D.title), e.call(D.unit_label), e.call(P.name), G.mode.capitalize(), played_text(), Time.get_date_string_from_system()]
	for s in report_sections():
		h += "<h2>%s</h2>" % e.call(s.title)
		if s.has("text"):
			h += "<p>%s</p>" % e.call(s.text)
		if s.has("rows"):
			h += "<table>"
			for r in s.rows:
				h += "<tr><td><b>%s</b></td><td>%s</td></tr>" % [e.call(r[0]), e.call(r[1])]
			h += "</table>"
	h += "<p style=\"color:#6b665d\">Print this page or save it as a PDF to hand in.</p></html>"
	return h


func _show_title(saved) -> void:
	var v = await panel(D.title, func(body):
		body.add_child(ui.label(D.i_can, "Strong"))
		body.add_child(ui.label(D.blurb, "")), ([["Continue", "continue", true], ["New game", "new"]] if saved != null else [["Start", "new", true]]), D.unit_label, false)
	if v == "continue":
		G = saved
		G.si = int(G.si)
		_begin()
		return
	if saved != null:
		var sure = await panel("Start a new game?", func(b): b.add_child(ui.label("Your saved game on this browser will be replaced.")), [["Start new", true, true], ["Go back", false]])
		if not sure:
			_show_title(saved)
			return
	_avatar_screen()


func _avatar_screen() -> void:
	if "avatar_bodies" in D:
		_avatar_pick()
		return
	var look: Dictionary = P.look.duplicate()
	var st := {"mode": "gentle"}
	var p: Dictionary = ui.open_panel(str(D.avatar_title) if "avatar_title" in D else "Make your character", "New game", true)
	var body: VBoxContainer = p.body
	var top: HBoxContainer = ui.hbox(16)
	var preview: Control = ui.pic("portrait", 120, look)
	top.add_child(preview)
	var col: VBoxContainer = ui.vbox(8)
	col.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	col.add_child(ui.label("Your first name", "Strong"))
	var name_f := LineEdit.new()
	name_f.text = P.name
	name_f.max_length = 16
	name_f.placeholder_text = "First name"
	name_f.custom_minimum_size = Vector2(0, 48)
	col.add_child(name_f)
	top.add_child(col)
	body.add_child(top)
	var swatches := func(title: String, key: String, list: Array):
		body.add_child(ui.label(title, "Strong"))
		var flow := HFlowContainer.new()
		flow.add_theme_constant_override("h_separation", 6)
		var group := ButtonGroup.new()
		for i in list.size():
			var b := Button.new()
			b.toggle_mode = true
			b.button_group = group
			b.custom_minimum_size = Vector2(46, 46)
			b.tooltip_text = "%s %d" % [title, i + 1]
			var sb: StyleBoxFlat = ui._box(Color(list[i]), Color("#d9d2c4"), 10, 2, 0)
			var sel: StyleBoxFlat = ui._box(Color(list[i]), UIScript.INK, 10, 4, 0)
			b.add_theme_stylebox_override("normal", sb)
			b.add_theme_stylebox_override("hover", sel)
			b.add_theme_stylebox_override("pressed", sel)
			b.button_pressed = int(look.get(key, 0)) == i
			b.pressed.connect(func(): look[key] = i; preview.look = look; preview.queue_redraw())
			flow.add_child(b)
		body.add_child(flow)
	swatches.call("Skin", "skin", Art.SKIN)
	swatches.call("Hair colour", "hair", Art.HAIR)
	body.add_child(ui.label("Hair", "Strong"))
	var hflow := HFlowContainer.new()
	hflow.add_theme_constant_override("h_separation", 6)
	var hg := ButtonGroup.new()
	for i in Art.HAIR_STYLES.size():
		var b: Button = ui.button(Art.HAIR_STYLES[i])
		b.toggle_mode = true
		b.button_group = hg
		b.button_pressed = int(look.get("hair_style", 0)) == i
		b.pressed.connect(func(): look.hair_style = i; preview.look = look; preview.queue_redraw())
		hflow.add_child(b)
	body.add_child(hflow)
	swatches.call("Shirt", "shirt", Art.SHIRT)
	if "pronouns" in D and D.pronouns:   # the story calls you by name or by these
		st.pron = str(P.get("pron", "they"))
		body.add_child(ui.label("Pronouns", "Strong"))
		var pflow := HFlowContainer.new()
		pflow.add_theme_constant_override("h_separation", 8)
		var pg := ButtonGroup.new()
		for pr in [["they", "they / them"], ["she", "she / her"], ["he", "he / him"]]:
			var b: Button = ui.button(pr[1])
			b.toggle_mode = true
			b.button_group = pg
			b.button_pressed = pr[0] == st.pron
			var pv: String = pr[0]
			b.pressed.connect(func(): st.pron = pv)
			pflow.add_child(b)
		body.add_child(pflow)
	body.add_child(ui.label("How do you want to play?", "Strong"))
	var mflow := HFlowContainer.new()
	mflow.add_theme_constant_override("h_separation", 8)
	var mg := ButtonGroup.new()
	for m in [["gentle", "Gentle: hints after a wrong try, and 3 tries"], ["real", "Real: no hints, and 2 tries"]]:
		var b: Button = ui.button(m[1])
		b.toggle_mode = true
		b.button_group = mg
		b.button_pressed = m[0] == "gentle"
		var mv: String = m[0]
		b.pressed.connect(func(): st.mode = mv)
		mflow.add_child(b)
	body.add_child(mflow)
	var go_b: Button = ui.button("Start", true)
	p.foot.add_child(go_b)
	var upd := func(_t = ""): go_b.disabled = name_f.text.strip_edges() == ""
	name_f.text_changed.connect(upd)
	name_f.text_submitted.connect(func(_t): if not go_b.disabled: _ui_done.emit(true))
	upd.call()
	go_b.pressed.connect(func(): _ui_done.emit(true))
	name_f.call_deferred("grab_focus")
	cur = {"kind": "avatar", "solve": func(_h): name_f.text = "Sam"; _ui_done.emit(true)}
	await _ui_done
	cur = null
	ui.close_panel(p)
	if st.has("pron"):
		P.pron = st.pron
	new_game(name_f.text.strip_edges(), look, st.mode)


## Pick a body (the game's avatar_bodies: { id: { label, … } }), shown as the real 3D model, plus your name and the mode.
## The game gives avatar_look(P, id) for each preview and set_body(P, id) to store the choice in the profile.
func _avatar_pick() -> void:
	var st := {"mode": "gentle", "body": str(D.body_of(P))}
	var p: Dictionary = ui.open_panel(str(D.avatar_title) if "avatar_title" in D else "Make your character", "New game", true)
	var body: VBoxContainer = p.body
	body.add_child(ui.label("Who are you?", "Strong"))
	var cards := HFlowContainer.new()
	cards.add_theme_constant_override("h_separation", 12)
	cards.alignment = FlowContainer.ALIGNMENT_CENTER
	var group := ButtonGroup.new()
	for id in D.avatar_bodies:
		var bid: String = id
		var card := Button.new()
		card.toggle_mode = true
		card.button_group = group
		card.custom_minimum_size = Vector2(150, 200)
		card.tooltip_text = str(D.avatar_bodies[id].label)
		var col: VBoxContainer = ui.vbox(4)
		col.set_anchors_preset(Control.PRESET_FULL_RECT)
		col.mouse_filter = Control.MOUSE_FILTER_IGNORE
		col.add_child(ModelView.make(D.avatar_look(P, id), Vector2(140, 160), ui.reduce_motion))
		var lab: Label = ui.label(str(D.avatar_bodies[id].label), "Strong", false)
		lab.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lab.mouse_filter = Control.MOUSE_FILTER_IGNORE
		col.add_child(lab)
		card.add_child(col)
		card.button_pressed = bid == st.body
		card.pressed.connect(func(): st.body = bid)
		cards.add_child(card)
	body.add_child(cards)
	body.add_child(ui.label("Your first name", "Strong"))
	var name_f := LineEdit.new()
	name_f.text = P.name
	name_f.max_length = 16
	name_f.placeholder_text = "First name"
	name_f.custom_minimum_size = Vector2(0, 48)
	body.add_child(name_f)
	body.add_child(ui.label("How do you want to play?", "Strong"))
	var mflow := HFlowContainer.new()
	mflow.add_theme_constant_override("h_separation", 8)
	var mg := ButtonGroup.new()
	for m in [["gentle", "Gentle: hints after a wrong try, and 3 tries"], ["real", "Real: no hints, and 2 tries"]]:
		var b: Button = ui.button(m[1])
		b.toggle_mode = true
		b.button_group = mg
		b.button_pressed = m[0] == "gentle"
		var mv: String = m[0]
		b.pressed.connect(func(): st.mode = mv)
		mflow.add_child(b)
	body.add_child(mflow)
	var go_b: Button = ui.button("Start", true)
	p.foot.add_child(go_b)
	var upd := func(_t = ""): go_b.disabled = name_f.text.strip_edges() == ""
	name_f.text_changed.connect(upd)
	name_f.text_submitted.connect(func(_t): if not go_b.disabled: _ui_done.emit(true))
	upd.call()
	go_b.pressed.connect(func(): _ui_done.emit(true))
	name_f.call_deferred("grab_focus")
	cur = {"kind": "avatar", "solve": func(_h): name_f.text = "Sam"; _ui_done.emit(true)}
	await _ui_done
	cur = null
	ui.close_panel(p)
	D.set_body(P, st.body)
	new_game(name_f.text.strip_edges(), P.look, st.mode)


# ── The test player ──
func _auto_step() -> void:
	if cur != null:
		_auto_wait += 1
		if _auto_wait >= 2:          # let a box build itself for a frame first
			_auto_wait = 0
			var c = cur
			if args.get("hold", "") == c.kind:   # hold=<kind>&hold_n=N: stop playing at the Nth box of that kind (for screenshots)
				_hold_seen += 1
				if _hold_seen >= int(args.get("hold_n", "1")):
					auto = ""
					return
			_trace("solve " + c.kind)
			c.solve.call(auto)
		return
	if goal_target != "" and not busy_talk and not running_day:
		var place = _target_place(goal_target)
		if place == null:
			return
		var kind := goal_target.split(":")[0]
		if kind == "map":
			var m: MapData = maps[place.map]
			_enter(place.map, m.arrive if not m.outdoor else Vector2i(D.start_at.x, D.start_at.y), "up")
			return
		if place.map != world.map.id:
			var m: MapData = maps[place.map]
			_enter(place.map, m.arrive if not m.outdoor else Vector2i(D.start_at.x, D.start_at.y), "up")
		_goal_hit.emit(goal_target)


func _auto_summary() -> void:
	var out := {"mode": G.mode, "auto": auto, "seed": int(S.seed), "si": int(G.si), "answers": S.answers.size(), "typed": S.typed.size(),
		"days": [], "cash": int(S.cash), "rep": int(S.shop.rep) if S.shop != null else -1, "log": S.log.size()}
	for d in S.days:
		out.days.append({"day": int(d.day), "profit": int(d.profit), "rep": int(d.rep_after)})
	if D.has_method("summary"):
		out.merge(D.summary(S))
	print("AUTO-RESULT " + JSON.stringify(out))
	if args.has("quit"):
		get_tree().quit()
