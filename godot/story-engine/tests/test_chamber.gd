# Puzzle chambers and cut scenes (engine/chamber.gd, engine/cutscene.gd), played on the lab game (games/lab/game.gd).
#   godot --headless --path godot/story-engine -s res://tests/test_chamber.gd -- game=lab debug=1 auto=right hold=puzzle
# Checks: pushing (into walls, into blocks, onto plates), the reset lever, the saved state, a wrong test then a right one
# (tier "second"), that a skipped scene still makes its story changes, and that a scene skipped half way gives the camera,
# the top bar and input back.
extends SceneTree

var fails := []
var checks := 0
var T


func ok(cond: bool, what: String) -> void:
	checks += 1
	if not cond:
		fails.append(what)


func frames(n: int) -> void:
	for i in n:
		await process_frame


func _initialize() -> void:
	change_scene_to_file("res://main.tscn")
	await frames(3)
	T = root.get_node("Town")
	var waited := 0
	while not (T.chamber.active and T.cur != null and T.cur.kind == "puzzle" and T.auto == "") and waited < 3000:
		await process_frame
		waited += 1
	ok(T.chamber.active, "the frost puzzle starts")
	if not T.chamber.active:
		return _done()
	var W = T.world
	var st: Dictionary = T.chamber.st
	ok(T.flag("intro_seen", false), "a skipped scene still ran its story change")
	ok("lab_open" in T.S.seen_scenes, "the opening scene is marked seen")
	ok(W.exit_locked, "the way out is shut while the puzzle runs")
	ok(W.solid_extra.size() == 6, "four blocks and two levers block the way (got %d)" % W.solid_extra.size())

	# Push b_56 (6,6) north from (6,7), one tile a move, until the back wall stops it.
	var b := func(id): return Vector2i(int(st.p[id].x), int(st.p[id].y))
	for y in [7, 6, 5, 4, 3]:
		W.me.place(Vector2i(6, y))
		W.try_step("up")
		await frames(2)
	ok(b.call("b_56") == Vector2i(6, 2), "the block slides up to the wall and stops there (at %s)" % b.call("b_56"))
	ok(W.solid_extra.has(Vector2i(6, 2)) and not W.solid_extra.has(Vector2i(6, 6)), "the solid tile moves with the block")
	ok(W.me.tile == Vector2i(6, 3), "you stay put when a push fails")

	# Into another block: b_23 (8,7) pushed left from (9,7) stops at (7,7)? It slides to (7,7), then (6,7) is free… so line it up.
	W.me.place(Vector2i(9, 7))
	W.try_step("left")
	await frames(2)
	ok(b.call("b_23") == Vector2i(7, 7), "a push moves one tile")
	st.p.b_half.x = 6
	st.p.b_half.y = 7
	T.chamber._sync(true)
	W.me.place(Vector2i(8, 7))
	W.try_step("left")
	await frames(2)
	ok(b.call("b_23") == Vector2i(7, 7), "a block does not push into another block")

	# A block on a plate presses it; so do you.
	st.p.b_34.x = 8
	st.p.b_34.y = 4
	T.chamber._sync(true)
	W.me.place(Vector2i(8, 5))
	W.try_step("up")
	await frames(3)
	ok(b.call("b_34") == Vector2i(8, 3) and bool(st.p.slot2.on), "a block pushed onto a plate presses it")
	W.me.place(Vector2i(10, 3))
	await frames(3)
	ok(bool(st.p.slot3.on), "standing on a plate presses it")
	W.me.place(Vector2i(10, 5))
	await frames(3)
	ok(not bool(st.p.slot3.on), "stepping off lets it up")

	# The reset lever puts every block back; the saved state is the live one.
	T.chamber.on_interact("thing", "reset")
	await frames(2)
	ok(b.call("b_56") == Vector2i(6, 6) and b.call("b_23") == Vector2i(8, 7) and b.call("b_half") == Vector2i(3, 7), "reset puts the blocks back")
	ok(T.S.pz.frost_line == st, "the puzzle's state is what the save keeps")

	# A wrong test (−3/4 left of −5/6), then the test player finishes: tier "second".
	T.chamber._bot("wrong")
	await frames(2)
	ok(int(st.tries) == 1, "one try counted")
	T.args.erase("hold")
	T.auto = "right"
	waited = 0
	while not T.finished and waited < 3000:
		await process_frame
		waited += 1
	ok(T.finished, "the lab finishes")
	ok(T.S.answers.get("lab_order", {}).get("tier", "") == "second", "a wrong test then a right one is 'second' (got %s)" % T.S.answers.get("lab_order", {}).get("tier", "none"))
	ok(T.flag("frost_done", false), "the step's flag is set")
	ok(not W.exit_locked, "the way out opens again")
	ok("lab_done" in T.S.seen_scenes, "the closing scene is marked seen")

	# A scene skipped half way: its story changes still happen; the camera, the top bar and input come back.
	T.auto = ""
	var open_before: int = T.ui.open
	T.scene("t_skip", [
		{"cam": {"look": "you", "from": [3, 4, 5], "to": [0, 3, 4], "secs": 5.0}},
		{"do": func(): T.set_flag("t_a", true)},
		{"say": "A long caption.", "secs": 6.0},
		{"do": func(): T.set_flag("t_b", true)},
	])
	await frames(5)
	ok(T.cutscene.playing and W.cam_hold, "the scene holds the camera while it plays")
	ok(not T.ui.hud.visible, "the top bar hides during a scene")
	T.cutscene.skip()
	waited = 0
	while T.cutscene.playing and waited < 600:
		await process_frame
		waited += 1
	ok(not T.cutscene.playing, "a skipped scene ends")
	ok(T.flag("t_a", false) and T.flag("t_b", false), "both story changes ran though the scene was skipped")
	ok(not W.cam_hold and T.ui.hud.visible and T.ui.open == open_before, "camera, top bar and input are given back")
	_done()


func _done() -> void:
	if fails.is_empty():
		print("test_chamber: all %d checks passed" % checks)
	else:
		print("test_chamber: %d of %d checks failed" % [fails.size(), checks])
		for f in fails:
			print("  FAIL ", f)
	quit(1 if fails.size() else 0)
