# The lab: a test bed for the engine's cut scenes (engine/cutscene.gd) and puzzle chambers (engine/chamber.gd).
# Not a lesson and not linked from the site. Run it with `-- game=lab` (add debug=1 auto=right quit=1 to play it by itself).
# A yard with a hut; a short cut scene; under the hut an ice cave where you push four ice blocks onto the frost line in order
# from coldest to warmest (−5⁄6, −3⁄4, ½, ⅔ — Realm Chapter 1's lesson numbers), then pull the lever to test.
extends RefCounted

const HERO := "realm/people/hero"

var id := "lab"
var title := "Engine lab"
var unit_label := "Engine test bed: cut scenes and puzzle chambers"
var i_can := "I can order rational numbers on a number line."
var blurb := "A test bed for cut scenes and walk-in puzzles."
var start_map := "yard"
var start_at := Vector2i(10, 11)
var shop_cfg := {}
var shop_layout := {}
var done_goal := "Lab done."

# The frost line: slots left (coldest) to right (warmest); blocks start shuffled below it.
const ORDER := ["-5/6", "-3/4", "1/2", "2/3"]
const SLOTS := [Vector2i(3, 3), Vector2i(5, 3), Vector2i(8, 3), Vector2i(10, 3)]
const START := {"b_half": Vector2i(3, 7), "b_56": Vector2i(6, 6), "b_23": Vector2i(8, 7), "b_34": Vector2i(10, 6)}
const VALUE := {"b_56": "-5/6", "b_34": "-3/4", "b_half": "1/2", "b_23": "2/3"}
const SHOW := {"-5/6": "−5/6", "-3/4": "−3/4", "1/2": "1/2", "2/3": "2/3"}


func maps() -> Dictionary:
	return {
		"yard": {"name": "The yard", "w": 20, "h": 16, "base": "grass",
			"fill": [["path", 9, 6, 2, 10]],
			"buildings": [{"id": "hut", "x": 8, "y": 2, "w": 4, "h": 4, "door": 10, "to": "frost_cave", "style": "house", "sign": "Frost cave"}],
			"props": [{"k": "tree", "x": 3, "y": 4}, {"k": "tree", "x": 15, "y": 3}, {"k": "bush", "x": 6, "y": 9}, {"k": "pine", "x": 16, "y": 11}]},
		"frost_cave": {"name": "Frost cave", "w": 14, "h": 11, "room": {"floor": "c_ice", "exit": 7}, "chamber": {"style": "ice"},
			"mood": "ice", "lamps": [[1, 1, "#9fd4ff"], [12, 1, "#9fd4ff"], [6, 1]]},
	}


func my_look(_S: Dictionary, look: Dictionary) -> Dictionary:
	var out := look.duplicate()
	out.model = HERO
	return out


func people() -> Dictionary:
	return {"pell": {"name": "Pell", "role": "your cousin", "look": {"model": "realm/people/pell", "skin": 2, "hair": 2, "hair_style": 3, "shirt": 1, "pants": 2}}}


func new_game(_S: Dictionary) -> void:
	pass


func where(pid: String, S: Dictionary) -> Variant:
	if pid == "pell":
		return {"map": "yard", "x": 12, "y": 9, "dir": "left"} if not S.flags.get("frost_done", false) else {"map": "yard", "x": 9, "y": 9, "dir": "down"}
	return null


func bubble(_pid: String, _S: Dictionary) -> String:
	return ""


func items() -> Dictionary:
	return {}


func hud(_S: Dictionary) -> Array:
	return []


func steps() -> Array:
	return ["intro", "frost", "outro"]


func talk(_pid: String, T) -> void:
	await T.say("pell", "The frost cave is under the hut. Go on!")


func use(_thing: String, _T) -> void:
	pass


func report(_S: Dictionary) -> Array:
	return []


# ── Steps ──
func intro(T) -> void:
	if not T.flag("intro_seen", false):
		await T.scene("lab_open", [
			{"cam": {"look": [10, 6], "from": [-9, 9, 12], "to": [6, 5, 9], "secs": 4.0}, "with": true},
			{"say": "Frost has crept out of the hut all night. Something under it is very cold.", "secs": 3.6},
			{"cam": {"look": "pell", "from": [2, 2.2, 4], "to": [1, 1.8, 3], "secs": 2.0}, "with": true},
			{"clip": "pell", "anim": "talk"},
			{"say": "There's a cave down there, {name}. The ice blocks have numbers on them!", "who": "pell", "secs": 3.0},
			{"walk": "pell", "to": [11, 8], "secs": 0.8},
			{"do": func(): T.set_flag("intro_seen", true)},
			{"cam": {"look": [10, 5], "from": [0, 4, 6], "orbit": 25, "secs": 2.2}},
		])
	await T.goal("Go down into the frost cave under the hut.", "map:frost_cave")


func frost(T) -> void:
	if T.flag("frost_done", false):
		return
	var pieces := {}
	for bid in START:
		pieces[bid] = {"kind": "block", "style": "ice", "x": START[bid].x, "y": START[bid].y, "label": SHOW[VALUE[bid]]}
	for i in SLOTS.size():
		pieces["slot%d" % i] = {"kind": "plate", "x": SLOTS[i].x, "y": SLOTS[i].y, "look": "#7fb6e0"}
	pieces["test"] = {"kind": "lever", "x": 12, "y": 7, "label": "Test"}
	pieces["reset"] = {"kind": "lever", "x": 1, "y": 7, "label": "Reset", "reset": true, "look": "#3a6ea5"}
	var marks := [[2, 4, "colder"], [11, 4, "warmer"], [6, 5, "0", "#ffffff"]]   # zero sits between the second and third plate
	await T.say("", "A row of four frosted plates runs along the back of the cave: coldest on the left, warmest on the right.")
	var r: Dictionary = await T.puzzle({
		"id": "frost_line", "key": "lab_order", "label": "Lab · order −5⁄6, −3⁄4, ½, ⅔", "map": "frost_cave",
		"pieces": pieces, "marks": marks, "lines": [[2, 4, 11]],
		"check": func(st):
			var got := []
			for s in SLOTS:
				var on := ""
				for bid in START:
					if Vector2i(int(st.p[bid].x), int(st.p[bid].y)) == s:
						on = VALUE[bid]
				got.append(on)
			if "" in got:
				return {"ok": false, "who": "pell", "say": "Every plate needs a block before the line will hold."}
			if got == ORDER:
				return {"ok": true, "who": "pell", "say": "The line holds! Coldest to warmest."}
			if got.find("-3/4") < got.find("-5/6"):
				return {"ok": false, "fx": "flare", "who": "pell", "say": ["The ice cracks.", "Hm. Is −5⁄6 really warmer than −3⁄4? Which is further below zero?"]}
			return {"ok": false, "who": "pell", "say": "The ice cracks. Check which side of zero each one sits."},
		"hint": func(T2, _st):
			await T2.say("pell", ["Below zero, the bigger the number after the minus, the colder it is.", "−5⁄6 is further from zero than −3⁄4, so it goes further left."]),
		"solve": func(st, how):
			var want: Array = ORDER if how == "right" else ["-3/4", "-5/6", "1/2", "2/3"]
			for i in want.size():
				for bid in VALUE:
					if VALUE[bid] == want[i]:
						st.p[bid].x = SLOTS[i].x
						st.p[bid].y = SLOTS[i].y
			st.pick = "test",
		"worked": func(T2, _st):
			await T2.say("pell", "Let me show you: −5⁄6, then −3⁄4, then zero, then ½ and ⅔."),
	})
	T.set_flag("frost_done", true)
	T.log_line("Ordered the frost line (%s)." % r.tier)


func outro(T) -> void:
	await T.scene("lab_done", [
		{"cam": {"look": [6, 3], "from": [0, 3, 5], "to": [0, 2.2, 3.6], "secs": 2.4}, "with": true},
		{"say": "The frost line glows, coldest to warmest. The cave goes quiet.", "secs": 3.0},
	])
