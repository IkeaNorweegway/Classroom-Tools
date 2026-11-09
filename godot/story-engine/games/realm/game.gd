# The Measure of the Realm, Chapter 1: "The Spark" (Math 9 Rational numbers, RN1–RN5). The pilot chapter of a year-long quest.
# Design: _courses/math-9/realm-game/math9-realm-ch1-design-v1.md. Story: math9-realm-story-v1.md.
# Plays in about 75 minutes, spread across the unit: the prologue and Hesper's lesson after notes Section 1, then one quest per
# section (the frozen well and the miller's ledger, the cold snap, sharing the harvest, the frost recipe), each after a soft gate,
# then the false rune at Highstead (½ + ⅓ = 2⁄5), the Balance sigil and the mill wheel.
# Model: a step-based story; every check is an exact rational answer (T.frac: equivalent forms right, rounded repeating decimals
# "close"); the rune breaks only when the prediction, test and fix are right (two flares and Hesper shows the fix). Numbers are
# fixed in the quests (games/realm/ch1.gd) and seeded per visit at the sigil spots. Maps: games/realm/maps.gd (Emberdale pack).
# Simplifications: harvest night is drawn in daylight; Pell waits beside each quest instead of following step by step.
# People are the rigged people pack: the cast have their own models; you and the extras use the tintable hero model.
# Second looks (design §8.1): after the sigil, each giver whose pip was missed shows a gold "?" and offers the check again with
# fresh numbers (variants A, B, C in ch1.gd). Test options: the test player takes them at the chapter end (looks=wrong,right is
# the plan per giver, cycling to its last entry; looks=0 skips them); looks_unlock=ring|day picks how a lock is opened (default:
# alternate); day_offset=N fakes "N days later" for the lock date (also on the web: ?debug=1&day_offset=1).
extends RefCounted

const Ch1 = preload("res://games/realm/ch1.gd")
const Maps = preload("res://games/realm/maps.gd")
const Pn = preload("res://games/realm/panels.gd")
const Frac = preload("res://engine/core/frac.gd")
const HERO := "realm/people/hero"   # the tintable rigged model (the people pack, scripts/blender/realm_people.py)

var id := "realm-ch1"
var title := "The Measure of the Realm"
var unit_label := "Math 9 · Chapter 1: The Spark · Rational numbers (RN1–RN5)"
var i_can := "I can compare, add, subtract, multiply and divide rational numbers, use the order of operations, and explain why my answer makes sense."
var blurb := "On harvest night the gorge bridge falls, and you saw the gold lines that held it snap. An old traveller says that means you can learn. Become Hesper Marrow's apprentice, help Brindle Ford through the first frost, and break a false rune."
var start_map := "brindle"
var start_at := Vector2i(12, 27)
var avatar_title := "Make your apprentice"
var pronouns := true
var report_file := "realm-ch1"
var log_unit := "Part"
var done_goal := "Chapter 1 is done. Use the Balance sigil at the gold rings, or open the Menu for your report."
var shop_cfg := {}
var shop_layout := {}

var _free_roam := false
var _day_offset := 0   # test hook: days added to today's date (second-look locks)

const TOPIC := {2: ["adding and subtracting", "Section 2"], 3: ["multiplying", "Section 3"], 4: ["dividing", "Section 4"], 5: ["the order of operations", "Section 5"]}
const QUEST_OF := {"lesson": "lesson", "well": "well", "ledger": "ledger", "cold_snap": "snap", "harvest": "harvest", "recipe": "recipe"}


# ── Maps ──
func maps() -> Dictionary:
	return Maps.build({})


func maps_for(S: Dictionary) -> Dictionary:
	return Maps.build(S.flags)


# ── People ──
## You, drawn with the rigged hero model in your chosen colours and hair.
func my_look(_S: Dictionary, look: Dictionary) -> Dictionary:
	var out := look.duplicate()
	out.model = HERO
	return out


func people() -> Dictionary:
	return {
		"hesper": {"name": "Hesper", "role": "hedge-witch of Emberdale, your teacher", "look": {"model": "realm/people/hesper", "skin": 1, "hair": 4, "hair_style": 2, "shirt": "#6e8a5a", "pants": 2, "outfit": "cloak", "cloak": "#5a6e4a"}},
		"orrin": {"name": "Orrin", "role": "an old traveller in a grey-blue coat", "look": {"model": "realm/people/orrin", "skin": 0, "hair": 4, "hair_style": 1, "shirt": "#5d6a86", "pants": 1, "outfit": "hat", "hat": "#4a5068"}},
		"pell": {"name": "Pell", "role": "your younger cousin", "look": {"model": "realm/people/pell", "skin": 2, "hair": 2, "hair_style": 3, "shirt": 1, "pants": 2}},
		"marta": {"name": "Marta Fenn", "role": "the well-keeper", "look": {"model": "realm/people/marta", "skin": 3, "hair": 0, "hair_style": 1, "shirt": "#7a5a8a", "pants": 0, "outfit": "apron", "apron": "#e8dcc4"}},
		"abel": {"name": "Abel Crane", "role": "the miller", "look": {"model": "realm/people/abel", "skin": 1, "hair": 1, "hair_style": 4, "shirt": 5, "pants": 2, "outfit": "apron", "apron": "#c9b89a"}},
		"rowan": {"name": "Rowan Tull", "role": "the shepherd", "look": {"model": "realm/people/rowan", "skin": 4, "hair": 0, "hair_style": 0, "shirt": "#8a6a3a", "pants": 2, "outfit": "vest", "vest": "#5a4a3a"}},
		"odile": {"name": "Reeve Odile Marsh", "role": "the village reeve", "look": {"model": "realm/people/odile", "skin": 5, "hair": 6, "hair_style": 2, "shirt": "#7a2e3a", "pants": 0, "outfit": "cloak", "cloak": "#3a2e4a"}},
		"gale": {"name": "Gale Harrow", "role": "Highstead's grain-warden", "look": {"model": "realm/people/gale", "skin": 2, "hair": 3, "hair_style": 0, "shirt": "#4a6a8a", "pants": 1, "outfit": "vest", "vest": "#2f3e5c"}},
		"sefa": {"name": "A grey-cloaked figure", "role": "seen slipping out of Highstead square", "look": {"model": "realm/people/sefa", "skin": 1, "hair": 4, "hair_style": 0, "shirt": "#7d7f84", "pants": 1, "outfit": "hood", "cloak": "#7d7f84"}},
		"runner": {"name": "Tam", "role": "a runner from Highstead", "look": {"model": HERO, "skin": 3, "hair": 5, "hair_style": 0, "shirt": 3, "pants": 3}},
		"fam1": {"name": "Ada", "role": "a Highstead farmer", "look": {"model": HERO, "skin": 0, "hair": 2, "hair_style": 1, "shirt": 1, "pants": 0}},
		"fam2": {"name": "Bram", "role": "a Highstead farmer", "look": {"model": HERO, "skin": 4, "hair": 0, "hair_style": 4, "shirt": 3, "pants": 2}},
		"fam3": {"name": "Wren", "role": "a Highstead farmer", "look": {"model": HERO, "skin": 2, "hair": 1, "hair_style": 2, "shirt": 7, "pants": 4}},
		"vil1": {"name": "Jory", "role": "a Brindle Ford villager", "look": {"model": HERO, "skin": 1, "hair": 3, "hair_style": 0, "shirt": 0, "pants": 0}},
		"vil2": {"name": "Nell", "role": "a Brindle Ford villager", "look": {"model": HERO, "skin": 5, "hair": 0, "hair_style": 2, "shirt": 4, "pants": 1}},
	}


func new_game(S: Dictionary) -> void:
	S.rn = {"gate_wait": -1, "rune_stage": 1, "rune_losses": 0, "spot_visits": {}, "spot_pips": 0, "spot_first": 0, "spots_used": {},
		"rings_right": 0, "looks": {}}


func on_begin(T) -> void:
	_day_offset = int(T.args.get("day_offset", "0")) if T.debug else 0


## Today's local date, "YYYY-MM-DD" (plus the test hook's offset). A second look missed today stays locked until a later date.
func today() -> String:
	var u := Time.get_unix_time_from_datetime_dict(Time.get_datetime_dict_from_system()) + 86400 * _day_offset
	return Time.get_date_string_from_unix_time(u)


## The pip key whose second look this person gives, or "".
func _look_key(pid: String) -> String:
	for k in Ch1.LOOK_GIVER:
		if Ch1.LOOK_GIVER[k] == pid:
			return k
	return ""


func validate(S: Dictionary) -> bool:
	return S.has("rn") and S.rn is Dictionary and S.rn.has("rune_stage") and S.rn.has("spot_visits")


## The quest Pell is waiting at (he tags along to each one).
func _quest(S: Dictionary) -> String:
	return str(S.flags.get("quest", ""))


func where(pid: String, S: Dictionary) -> Variant:
	var f: Dictionary = S.flags
	var fell := bool(f.get("bridge_fell", false))
	match pid:
		"hesper":
			return {"map": "cottage", "x": 4, "y": 3, "dir": "down"}
		"orrin":
			if not f.get("met_orrin", false):
				return {"map": "brindle", "x": 46, "y": 28, "dir": "up"}
			if not f.get("met_hesper", false):
				return {"map": "cottage", "x": 6, "y": 3, "dir": "left"}
			if f.get("rune_over", false):
				return {"map": "cottage", "x": 6, "y": 3, "dir": "left"}
			if f.get("at_rune", false):
				return {"map": "highstead", "x": 28, "y": 21, "dir": "right"}
			if f.get("runner_done", false):
				return {"map": "highstead", "x": 21, "y": 37, "dir": "down"}
			return null
		"pell":
			if not f.get("met_orrin", false):
				return {"map": "brindle", "x": 45, "y": 26 if not fell else 28, "dir": "right" if not fell else "up"}
			match _quest(S):
				"lesson", "recipe", "low_road":
					return {"map": "cottage", "x": 2, "y": 3, "dir": "down"}
				"well":
					return {"map": "brindle", "x": 27, "y": 30, "dir": "left"}
				"ledger":
					return {"map": "mill", "x": 3, "y": 4, "dir": "right"}
				"snap":
					return {"map": "brindle", "x": 10, "y": 12, "dir": "left"}
				"harvest":
					return {"map": "barn", "x": 6, "y": 4, "dir": "left"}
				"wheel":
					return {"map": "brindle", "x": 39, "y": 18, "dir": "left"}
			return {"map": "brindle", "x": 19, "y": 29, "dir": "down"}
		"marta":
			return {"map": "brindle", "x": 26, "y": 30, "dir": "up"}
		"abel":
			if f.get("wheel_scene", false):
				return {"map": "brindle", "x": 38, "y": 17, "dir": "left"}
			return {"map": "mill", "x": 4, "y": 3, "dir": "down"}
		"rowan":
			return {"map": "brindle", "x": 8, "y": 12, "dir": "down"}
		"odile":
			return {"map": "barn", "x": 4, "y": 3, "dir": "down"}
		"gale":
			return {"map": "highstead", "x": 32, "y": 21, "dir": "left"}
		"sefa":
			if f.get("at_rune", false) and not f.get("sefa_gone", false):
				return {"map": "highstead", "x": 40, "y": 15, "dir": "left"}
			return null
		"runner":
			if f.get("runner_here", false) and not f.get("runner_done", false):
				return {"map": "cottage", "x": 6, "y": 3, "dir": "left"}
			return null
		"fam1", "fam2", "fam3":
			var i := int(pid.substr(3)) - 1
			if f.get("rune_broken", false):
				return {"map": "highstead", "x": [27, 36, 24][i], "y": [17, 23, 23][i], "dir": ["down", "left", "right"][i]}
			return {"map": "highstead", "x": 27, "y": 21 + i, "dir": "right"}
		"vil1":
			if not f.get("met_orrin", false):
				return {"map": "brindle", "x": 42, "y": 28, "dir": "right"}
			return {"map": "brindle", "x": 18, "y": 28, "dir": "down"}
		"vil2":
			if not f.get("met_orrin", false):
				return {"map": "brindle", "x": 40, "y": 28, "dir": "right"}
			return {"map": "brindle", "x": 35, "y": 28, "dir": "left"}
	return null


func nav_states() -> Array:
	var out := []
	var base := {"day": 1, "flags": {}, "mem": {}, "shop": null, "days": [], "cash": 0, "rn": {}}
	for fl in [{"bridge_fell": true}, {"met_orrin": true, "bridge_fell": true}, {"met_orrin": true, "met_hesper": true, "quest": "well"},
			{"met_orrin": true, "met_hesper": true, "quest": "ledger"}, {"met_orrin": true, "met_hesper": true, "quest": "snap"},
			{"met_orrin": true, "met_hesper": true, "quest": "harvest"}, {"met_orrin": true, "met_hesper": true, "runner_here": true, "quest": "low_road"},
			{"met_orrin": true, "met_hesper": true, "runner_done": true}, {"met_orrin": true, "met_hesper": true, "runner_done": true, "at_rune": true},
			{"met_orrin": true, "met_hesper": true, "rune_broken": true, "rune_over": true, "wheel_scene": true, "quest": "wheel", "sigil": true}]:
		var S2 := base.duplicate(true)
		S2.flags = fl
		out.append(S2)
	return out


## Flags the nav test also turns on together (every sigil solved, the lambs in).
func nav_flags() -> Array:
	return ["sigil", "sigil_pond", "sigil_wheel", "sigil_gate", "sigil_cellar", "lambs_in", "bridge_fell", "rune_broken"]


func bubble(pid: String, S: Dictionary) -> String:
	if _free_roam and pid == "hesper":
		return "talk"
	var k := _look_key(pid)
	if k != "" and Ch1.look_open(S, k, today()):
		return "q_gold"   # a second look is waiting
	return ""


func items() -> Dictionary:
	return {
		"notes": {"name": "Hesper's frost-line notes", "about": "Cold on the left, warm on the right. The greater number is always further right: −1/4 > −3/4. One point can have three names: −3/4 = 3/(−4) = −(3/4)."},
		"chip": {"name": "A chip of the false rune", "about": "Orrin asked you to keep it. The grey lines on it have gone still."},
		"sigil": {"name": "The Balance sigil", "about": "Warm or chill anything by an exact amount, above or below zero. At a gold ring, type the exact change: target − now."},
		"slingshot": {"name": "Pell's slingshot", "about": "Lost last winter. It was in Hesper's root cellar, of all places."},
		"page": {"name": "A page of Orrin's old notebook", "about": "In faded ink: \"M. asks why we bother with why. I had no good answer today.\""},
	}


func hud(S: Dictionary) -> Array:
	var out := [{"label": "Chapter 1", "value": "The Spark"}]
	var done := 0
	for k in ["well_done", "ledger_done", "snap_done", "harvest_done", "recipe_done"]:
		if S.flags.get(k, false):
			done += 1
	out.append({"label": "Quests", "value": "%d of 5" % done})
	if S.flags.get("sigil", false):
		out.append({"label": "Balance", "value": Ch1.pip_text(Ch1.pips(S))})
	return out


func journal(S: Dictionary) -> Array:
	var out := []
	if S.flags.get("sigil", false):
		var n := Ch1.pips(S)
		out.append(["THE BALANCE SIGIL", "Charge %s (%d of 5). First-try answers charge it; so does each gold ring solved on the first try. %s" % [
			Ch1.pip_text(n), n, "All five pips open Hesper's root cellar." if not S.flags.get("sigil_cellar", false) else "The root cellar is open."]])
		out.append(["SECOND LOOKS", "Missed a pip? A gold ? over someone you helped means a second look: the same skill, new numbers. Right first time wins the pip back."])
	return out


func steps() -> Array:
	return ["prologue", "meet_hesper", "lesson", "gate:2", "well", "ledger", "gate:3", "cold_snap", "gate:4", "harvest", "gate:5",
		"recipe", "low_road", "rune", "sigil", "mill_wheel", "chapter_end"]


## A wrong try's hint button, and Hesper's line after a first-try right answer.
func _hint() -> String:
	return "Ask Hesper"


func _praise(T, tier: String) -> void:
	if tier == "first":
		await T.say("hesper" if T.world.map.id == "cottage" else "", "Hesper's voice, in your head: \"Fair shares and true numbers. That's my apprentice.\"" if T.world.map.id != "cottage" else "Fair shares and true numbers. That's my apprentice.")


# ── The soft gate before each notes section ──
func gate(T, n: String) -> void:
	var nxt := int(n)
	var S: Dictionary = T.S
	var tp: Array = TOPIC[nxt]
	if int(S.rn.gate_wait) != nxt:
		var v = await T.panel("Next lesson: %s" % tp[0], func(body):
			body.add_child(T.ui.rich("Hesper says the next lesson is about [b]%s[/b] (notes %s). Learned it in class yet?" % [tp[0], tp[1]]))
			body.add_child(T.ui.label("You can start it now, or look around Brindle Ford first. Talking to Hesper starts it.", "Muted")),
			[["Start it now", "go", true], ["Not yet: look around Brindle Ford", "later"]], "Chapter 1")
		if v == "go":
			return
		S.rn.gate_wait = nxt
		T.save()
	_free_roam = true
	T.refresh()
	while true:
		await T.goal("When you've had the lesson on %s in class, talk to Hesper at her cottage." % tp[0], "person:hesper")
		if await T.choose("hesper", "Ready for the next lesson? It's about %s." % tp[0], ["Yes, I learned it in class.", "Not yet"]) == 0:
			break
		await T.say("hesper", "Then go and see how the village is getting on. I'll be here.")
	_free_roam = false
	S.rn.gate_wait = -1
	T.refresh()


# ── Prologue: the night the bridge fell (no maths) ──
func prologue(T) -> void:
	if not T.flag("bridge_fell", false):
		T.banner("Harvest night", "Brindle Ford")
		await T.goal("The whole village is crossing to the harvest market. Walk with them to the gorge bridge (east, along the road).", "thing:bridge")
		await T.say("", ["Lanterns sway along the old rope bridge. Half of Brindle Ford is already on it, carrying sacks to the market at Highstead."])
		await T.say("pell", "Race you across, {name}! Last one over carries the sacks!")
		await T.say("", ["Pell runs ahead onto the bridge. Then you see it: thin gold lines glowing along the cables, like threads of light.",
			"Nobody else looks up. The lines flicker... and snap."])
		T.set_flag("bridge_fell", true)
		T.rebuild_maps()
		T.ui.confetti(30)
		await T.say("", ["The bridge drops into the gorge with a roar of wood and rope. Pell is clinging to the far edge!"])
		await T.say("vil1", "Rope! Get a rope across!")
		await T.say("", ["It takes half the village and a long rope, but they pull Pell back up. Nobody is hurt."])
		await T.say("pell", "I'm fine! I'm fine. ...Did you see the gold lines? Tell me you saw them too.")
		T.log_line("The gorge bridge fell on harvest night. You saw gold lines snap along its cables.")
	if not T.flag("met_orrin", false):
		await T.goal("An old traveller by the broken cable is watching you. Talk to him.", "person:orrin")
		await T.say("orrin", "You saw the lines. I watched you see them.")
		var i: int = await T.choose("orrin", "What did they look like?", ["Like gold threads, pulled tight.", "Like cracks of light in the rope.", "Like music I could see."])
		var said: String = ["gold threads, pulled tight", "cracks of light", "music you could see"][i]
		T.remember("orrin", "You told him the lines looked like %s." % said, 1)
		await T.say("orrin", ["Then you can learn. Few can.", "My name is Orrin Vael. There's someone in this village you should meet. Come."])
		await T.say("", "Orrin bends over the snapped cable and slips something into his coat. He doesn't say what.")
		T.set_flag("met_orrin", true)
		T.refresh()


func meet_hesper(T) -> void:
	if T.flag("met_hesper", false):
		return
	await T.goal("Follow Orrin to Hesper's cottage, on the rise in the south-west of the village.", "person:hesper")
	await T.say("orrin", "Hesper. This one saw the lines on the bridge.")
	await T.say("hesper", ["Did {they} now. Then {they}'d better come in out of the cold.",
		"I'm Hesper Marrow. I keep hens, and I keep the balance of warm and cold in this valley. Numbers are most of it.",
		"Fractions are just fair shares, {name}. Nobody likes an unfair share."])
	await T.say("orrin", "I'll be at the gorge. Someone should look at what's left of that bridge. Teach well, Hesper.")
	T.remember("hesper", "She took you on as her apprentice.", 2)
	T.set_flag("met_hesper", true)
	T.set_flag("quest", "lesson")
	T.log_line("Hesper Marrow took you on as her apprentice.")
	T.refresh()


# ── The lesson: Hesper's frost window (RN1) ──
func lesson(T) -> void:
	if T.flag("lesson_done", false):
		return
	T.set_flag("quest", "lesson")
	T.refresh()
	await T.goal("First frost. Hesper is drawing on her frosty window. Go and look.", "thing:frost_window")
	await T.say("hesper", ["Here's the frost line. Zero at the sill mark. Warm to the right, cold to the left.",
		"Every number has a place on it: whole numbers, fractions, decimals, above and below zero. Those are the rational numbers."])
	await Pn.worked_example(T)
	await T.say("pell", "So −3/4 is bigger, 'cause 3 is bigger than 1. Right?")
	await T.ask("hesper", Ch1.ASK_LESSON, "rn1_lesson", "RN1 · Lesson: why −1/4 > −3/4")
	if not T.S.typed.has("rn1_pell"):
		await T.typed({"id": "rn1_pell", "title": "Explain it to Pell", "kicker": "In your own words",
			"prompt": "Explain to Pell, in your own words, which is greater: [b]−2/3[/b] or [b]−3/4[/b].", "min": 30,
			"bot": "−2/3 is greater. In twelfths, −2/3 = −8/12 and −3/4 = −9/12, so −2/3 is closer to zero."})
	await T.say("hesper", "Now put a few on the line yourself.")
	var t := await Pn.order_line(T, {"key": "rn1_order", "label": "RN1 · Order six numbers on the frost line", "title": "The frost line",
		"kicker": "The lesson · RN1", "prompt": "Put these in order on the frost line, [b]least to greatest[/b].",
		"items": Ch1.lesson_items(), "lo": -1, "hi": 1, "den": 4, "hint": "Hesper: \"Negatives first, the coldest one first. For −3/4 and −1/3, use twelfths: −9/12 and −4/12.\"",
		"why": "Coldest first: −1, then −3/4 (−9/12) before −1/3 (−4/12), then 0, then 1/2 before 5/6."})
	await _praise(T, t)
	T.give("notes")
	T.set_flag("lesson_done", true)
	T.set_flag("quest", "")
	T.log_line("Hesper's first lesson: the frost line.")


# ── 6.1 The frozen well (RN2) ──
func well(T) -> void:
	if T.flag("well_done", false):
		return
	T.set_flag("quest", "well")
	T.refresh()
	await T.goal("Marta Fenn, the well-keeper, needs help. Find her at the village well.", "person:marta")
	await T.say("marta", ["{name}, you're Hesper's new apprentice? Look at my well. Frozen solid. The water's at −12.5 °C.",
		"Hesper says the chinook arch in the west will raise it by 18.75 °C tonight. Will it thaw? And what will it read?"])
	await T.say("pell", "18.75 take away 12.5. Easy.")
	var tier: String = await T.frac({"key": "rn2_well", "label": "RN2 · The frozen well: −12.5 + 18.75", "title": "The frozen well", "kicker": "Quest · RN2",
		"prompt": "The water is at [b]−12.5 °C[/b]. The chinook raises it by [b]18.75 °C[/b]. What will the well read?", "answer": Ch1.well(),
		"unit": "°C", "as_dec": true, "hint_btn": _hint(), "hint": "Hesper: \"Start at −12.5 on the line and move 18.75 to the warm side. Where do you cross zero?\"",
		"why": "−12.5 + 18.75: the signs differ, so subtract the sizes (18.75 − 12.5 = 6.25) and keep the sign of the larger, +.",
		"traps": [["31.25", "That adds the two sizes. The water starts below zero."], ["-6.25", "Check the sign: is the warm-up bigger than the cold?"]]})
	await T.ask("marta", Ch1.ASK_THAW, "rn2_thaw", "RN2 · Will the well thaw?")
	await T.say("", ["That night the chinook roars down from the west. The frost line on the well melts away.", "In the morning Marta draws a full bucket."])
	await T.say("marta", "6.25 °C and running. Thank you, {name}.")
	await _praise(T, tier)
	T.remember("marta", "You worked out when her well would thaw.", 2)
	T.set_flag("well_done", true)
	T.set_flag("quest", "")
	T.log_line("Helped Marta Fenn: the chinook thawed the well to 6.25 °C.")


# ── 6.2 The miller's ledger (RN1 + RN2) ──
func ledger(T) -> void:
	if T.flag("ledger_done", false):
		return
	T.set_flag("quest", "ledger")
	T.refresh()
	await T.goal("Abel Crane, the miller, can't make his ledger balance. Find him at the mill, north of the ford.", "person:abel")
	await T.say("abel", ["Hesper's apprentice! Help an old miller. My ledger, in silvers:",
		"The baker owes me 1/2. The farmer owes me 2/3. I owe the smith 3/4, and I owe Hesper 5/6.",
		"Owed to me is plus, what I owe is minus. Which is my worst debt?"])
	await T.say("pell", "Owing 5/6 isn't as bad as owing 3/4, 'cause 5 and 6 are bigger numbers... right?")
	await Pn.order_line(T, {"key": "rn1_ledger", "label": "RN1 · The miller's ledger: order four shares", "title": "Abel's ledger",
		"kicker": "Quest · RN1", "prompt": "Order Abel's four amounts, [b]least to greatest[/b] (worst debt first).",
		"items": Ch1.ledger_items(), "lo": -1, "hi": 1, "den": 12, "hint_btn": _hint(),
		"hint": "Hesper: \"In twelfths: 1/2 = 6/12, 2/3 = 8/12, −3/4 = −9/12, −5/6 = −10/12.\"",
		"why": "In twelfths: −10/12 < −9/12 < 6/12 < 8/12. Owing 5/6 is worse than owing 3/4."})
	await T.say("abel", "So what do I really have, once it's all paid?")
	var tier: String = await T.frac({"key": "rn2_ledger", "label": "RN2 · The miller's ledger: 1/2 + 2/3 − 3/4 − 5/6", "title": "Abel's ledger",
		"kicker": "Quest · RN2", "prompt": "[b]1/2 + 2/3 − 3/4 − 5/6[/b] = ? (in silvers)", "answer": Ch1.ledger_net(),
		"hint_btn": _hint(), "hint": "Hesper: \"Rename every share in twelfths first. Then count what comes in and what goes out.\"",
		"why": "In twelfths: +6 + 8 − 9 − 10 = −5, so −5/12.", "traps": [["5/12", "Check the sign: does more come in, or go out?"], ["-14/12", "Check your twelfths: 1/2 = 6/12 and 2/3 = 8/12."]]})
	await T.say("abel", ["−5/12. I'm short 5/12 of a silver. Well, better to know.", "I'll pay Hesper what I can now, and the rest after the next grinding."])
	await _praise(T, tier)
	T.remember("abel", "You balanced his ledger: he's 5/12 of a silver short.", 2)
	T.set_flag("ledger_done", true)
	T.set_flag("quest", "")
	T.log_line("Balanced Abel's ledger: −5/12 of a silver.")


# ── 6.3 The cold snap (RN3) ──
func cold_snap(T) -> void:
	if T.flag("snap_done", false):
		return
	T.set_flag("quest", "snap")
	T.refresh()
	await T.goal("Rowan Tull the shepherd is worried about his lambs. Find him at the fold, north-west across the ford.", "person:rowan")
	await T.say("rowan", ["It's 0 °C here at dusk. A cold front's coming: the temperature will drop 2/3 of a degree every hour, for 4 1/2 hours.",
		"If it gets to −3 °C or colder, the lambs have to come in. Will it?"])
	var tier: String = await T.frac({"key": "rn3_snap", "label": "RN3 · The cold snap: (−2/3) × 4 1/2", "title": "The cold snap", "kicker": "Quest · RN3",
		"prompt": "The change in temperature = [b](−2/3) × 4 1/2[/b] = ? °C", "answer": Ch1.snap(), "unit": "°C",
		"hint_btn": _hint(), "hint": "Hesper: \"Write 4 1/2 as an improper fraction. Then count the negatives.\"",
		"why": "(−2/3) × (9/2) = −18/6 = −3. One negative factor gives a negative product.",
		"traps": [["3", "It's dropping: the change is negative."], ["-8/3", "4 1/2 is 9/2, not 4."]]})
	await T.say("rowan", "−3 °C. That's the line. In they go.")
	await T.say("pell", "It's been dropping all day. Three hours ago, was it colder or warmer?")
	await T.frac({"key": "rn3_back", "label": "RN3 · Three hours back: (−2/3) × (−3)", "title": "Three hours ago", "kicker": "Quest · RN3",
		"prompt": "It drops 2/3 °C an hour, and it's 0 °C now. Going back 3 hours: [b](−2/3) × (−3)[/b] = ? So what did it read then?",
		"answer": Ch1.snap_back(), "unit": "°C", "hint_btn": _hint(), "hint": "Hesper: \"Two negative factors. And think: before the cold came, was it warmer?\"",
		"why": "(−2/3) × (−3) = +2. Going back in time on a falling temperature, it was higher: 2 °C.",
		"traps": [["-2", "Before the cold came in, was it colder or warmer than now?"]]})
	await T.ask("hesper", Ch1.ASK_SNAP_WHY, "rn3_why", "RN3 · Why a negative × a negative is positive here")
	T.set_flag("lambs_in", true)
	T.rebuild_maps()
	await T.say("", ["You and Pell walk the lambs in, the flock bumping along behind you. Rowan shuts the gate on the last one."])
	# Check 3 · the feed (cross-cancelling, notes Section 3). Not a pip check; on the report under RN3.
	await T.say("rowan", ["There are 6/5 sacks of oats here in the barn.", "The lambs get 4/9 of it tonight. How much is that?"])
	await T.say("", "Pell grabs a bit of charcoal and works it out on the barn wall.")
	await T.say("pell", "4 and 6 both go by 2, so cross them out: 2/9 × 3/5 = 6/45 = 2/15. Easy.")
	await T.ask("hesper", Ch1.ASK_CANCEL, "rn3_cancel_why", "RN3 · Is Pell's cancelling allowed?")
	await T.frac({"key": "rn3_cancel", "label": "RN3 · The feed: 4/9 × 6/5", "title": "The feed", "kicker": "Quest · RN3",
		"prompt": "The lambs get 4/9 of 6/5 sacks. The feed = [b]4/9 × 6/5[/b] = ? of a sack", "answer": Ch1.cancel(), "hint_btn": _hint(),
		"hint": "Hesper: \"Look for a top and a bottom that share a factor. 6 is on top, 9 is on the bottom.\"",
		"why": "6 and 9 share 3: 4/3 × 2/5 = 8/15. Check: 4 × 6 = 24, 9 × 5 = 45, and 24/45 = 8/15.",
		"traps": [["2/15", "That's Pell's answer: you cancelled two tops (4 and 6). Cancel a top with a bottom: 6 and 9 share 3."]], "bot_wrong": "2/15"})
	await T.say("", "You and Pell tip 8/15 of a sack into the trough. The lambs push in to eat.")
	await T.say("rowan", "Snug as anything. Hesper chose a good apprentice.")
	await _praise(T, tier)
	T.remember("rowan", "You got his lambs in before the cold snap.", 2)
	T.set_flag("snap_done", true)
	T.set_flag("quest", "")
	T.log_line("Helped Rowan: the cold snap would reach −3 °C, so the lambs came in.")


# ── 6.4 Sharing the harvest (RN4) ──
func harvest(T) -> void:
	if T.flag("harvest_done", false):
		return
	T.set_flag("quest", "harvest")
	T.refresh()
	await T.goal("Reeve Odile Marsh is sharing out the winter grain at the common barn.", "person:odile")
	await T.say("odile", ["Ah, Hesper's apprentice. There's 3/4 of a cart of grain left in this barn.",
		"Each family's winter share is 1/8 of a cart. How many families get a share?"])
	await T.say("pell", "Dividing makes it smaller, so it's less than 3/4 of a family? That's silly.")
	await T.ask("odile", Ch1.ASK_HARVEST, "rn4_predict", "RN4 · Predict: is 3/4 ÷ 1/8 bigger or smaller than 3/4?")
	var o := {"key": "rn4_harvest", "label": "RN4 · Sharing the harvest: 3/4 ÷ 1/8", "title": "Sharing the harvest", "kicker": "Quest · RN4",
		"prompt": "[b]3/4 ÷ 1/8[/b] = ? families", "answer": Ch1.harvest(), "hint_btn": _hint(),
		"hint": "Hesper: \"How many eighths fit in 3/4? Dividing by 1/8 is multiplying by 8.\"", "why": "3/4 = 6/8, and six 1/8 shares fit in it.",
		"traps": [["3/32", "That multiplies by 1/8. Dividing by 1/8 asks how many eighths fit."]]}
	if T.mode() == "gentle":
		o.show = Pn.bar(T, 8, 6, "The cart, in eighths: 3/4 of it is full.")
	var tier: String = await T.frac(o)
	await T.say("odile", "Six families. Good. And the second barn has 2/3 of a cart, in shares of 1/6?")
	await T.frac({"key": "rn4_second", "label": "RN4 · The second barn: 2/3 ÷ 1/6", "title": "The second barn", "kicker": "Quest · RN4",
		"prompt": "[b]2/3 ÷ 1/6[/b] = ? families", "answer": Ch1.harvest2(), "hint_btn": _hint(),
		"hint": "Hesper: \"How many sixths fit in 2/3? Dividing by 1/6 is multiplying by 6.\"", "why": "2/3 = 4/6, and four 1/6 shares fit in it.",
		"traps": [["1/9", "That multiplies by 1/6. How many sixths fit in 2/3?"]]})
	await T.say("odile", "Ten families fed through the winter. I'll write it in the reeve's book, with your name beside it.")
	await _praise(T, tier)
	T.remember("odile", "You worked out the winter shares: 6 families and 4 more.", 2)
	T.set_flag("harvest_done", true)
	T.set_flag("quest", "")
	T.log_line("Shared the harvest: 6 families from the first barn, 4 from the second.")


# ── 6.5 The frost recipe (RN5) ──
func recipe(T) -> void:
	if T.flag("recipe_done", false):
		return
	T.set_flag("quest", "recipe")
	T.refresh()
	await T.goal("Hesper wants your help with her frost-ward for the hen-house. Find her at the cottage.", "person:hesper")
	await T.say("hesper", ["The chinook that thawed Marta's well will melt my hens' winter store. So I set a frost-ward on the hen-house.",
		"Its strength is (−1/3 + 1)² × (−9/4) + 1/2 degrees. Negative, and the ward holds. Positive, and it melts.",
		"Every step from the last few lessons is in it. Where do we start?"])
	await T.say("pell", "Can't you just go left to right?")
	await Pn.step_order(T, {"key": "rn5_order", "label": "RN5 · The frost recipe: order the steps", "title": "The frost recipe", "kicker": "Quest · RN5",
		"prompt": "[b](−1/3 + 1)² × (−9/4) + 1/2[/b]", "cards": Ch1.RECIPE_CARDS, "answer": Ch1.RECIPE_ORDER,
		"decoy_fb": "That multiplies before squaring. BEDMAS: the exponent comes before multiplication.",
		"why": "B: 2/3. E: 4/9. M: 4/9 × (−9/4) = −1. A: −1 + 1/2 = −1/2."})
	var tier: String = await T.frac({"key": "rn5_recipe", "label": "RN5 · The frost recipe: (−1/3 + 1)² × (−9/4) + 1/2", "title": "The frost recipe", "kicker": "Quest · RN5",
		"prompt": "So what is the ward's strength? [b](−1/3 + 1)² × (−9/4) + 1/2[/b] = ? °C", "answer": Ch1.recipe(), "unit": "°C", "hint_btn": _hint(),
		"hint": "Hesper: \"Brackets, then the exponent, then multiply, then add. Do one at a time.\"",
		"why": "B: 2/3. E: 4/9. M: 4/9 × (−9/4) = −1. A: −1 + 1/2 = −1/2.",
		"traps": [[Frac.text(Ch1.recipe_melt()).replace("−", "-"), "You squared after multiplying. BEDMAS: exponents before multiplication."]],
		"on_wrong": func(v): if Frac.eq(v, Ch1.recipe_melt()): T.set_flag("ward_melted", true)})
	if T.flag("ward_melted", false) and not T.flag("ward_melt_told", false):
		T.set_flag("ward_melt_told", true)
		await T.say("", "For a moment the ward goes warm, and water drips off the hen-house roof. The hens complain loudly.")
	await T.say("", "The ward settles at −1/2 °C. A fine frost feathers over the hen-house, and stays.")
	await T.say("hesper", "−1/2. It holds. Every operation, in the right order. That's the whole of this first winter's lessons, {name}.")
	await _praise(T, tier)
	T.set_flag("recipe_done", true)
	T.set_flag("quest", "")
	T.log_line("Set Hesper's frost-ward: −1/2 °C, and it held.")


# ── The false rune at Highstead (RN2 again) ──
func low_road(T) -> void:
	if T.flag("runner_done", false):
		if not T.flag("met_at_arch", false):
			await _arch(T)
		return
	T.set_flag("runner_here", true)
	T.set_flag("quest", "low_road")
	T.refresh()
	await T.goal("A runner from Highstead has come to Hesper's cottage. Hear what they have to say.", "person:runner")
	await T.say("runner", ["I ran the long way round, the bridge being gone. It's the grain-share stone in Highstead square.",
		"Families coming home from market say their shares were short. All of them. And the stone has never been wrong."])
	await T.say("hesper", ["The stone has never been wrong, they say. Hm. Go and look, {name}. Take the Low Road north: the long way round, now.",
		"Orrin went that way this morning. He'll meet you at the gate arch."])
	T.set_flag("runner_done", true)
	T.set_flag("quest", "")
	T.refresh()
	await _arch(T)


func _arch(T) -> void:
	await T.goal("Take the Low Road north out of Brindle Ford to Highstead. Orrin is waiting at the stone gate arch.", "person:orrin")
	await T.say("orrin", ["There you are. Grain-share stones are old magic: they say what each household gets, and the towers pour it.",
		"If the stone is wrong, everyone is short, and nobody argues, because it's the stone. Let's see it."])
	T.set_flag("met_at_arch", true)


func rune(T) -> void:
	if T.flag("rune_broken", false):
		return
	var S: Dictionary = T.S
	if not T.flag("at_rune", false):
		T.set_flag("at_rune", true)
		T.refresh()
	await T.goal("Find Gale Harrow, the grain-warden, by the grain-share stone in the market square.", "person:gale")
	if not T.flag("sefa_gone", false):
		await T.say("", ["The stone stands in the middle of the square. Carved on it: \"Each household: 1/2 cart from the north tower + 1/3 cart from the south tower = 2/5 cart.\"",
			"Families queue beside it with half-empty sacks. Faint grey lines crawl over the carving.",
			"At the edge of the square, a figure in a grey cloak watches you, then slips away between the stalls."])
		T.set_flag("sefa_gone", true)
		T.remember("sefa", "A grey-cloaked figure watched you at the grain-share stone, then slipped away.")
		T.refresh()
	await T.say("gale", "The stone has always been right. Who are we to argue with the stone?")
	while not T.flag("rune_broken", false):
		var stage := int(S.rn.rune_stage)
		if _test_stop(T, "%d%s" % [stage, "b" if int(S.rn.rune_losses) > 0 else ""]):
			await T.get_tree().create_timer(3600).timeout   # never returns before the program quits, so the step isn't marked done
		if stage == 1:
			await T.ask("orrin", Ch1.ASK_RUNE_PREDICT, "rune_predict", "The rune · Predict: is 1/2 + 1/3 more or less than 1/2?")
			S.rn.rune_stage = 2
			T.save()
		elif stage == 2:
			await Pn.pie_test(T)
			S.rn.rune_stage = 3
			T.save()
		else:
			if await _rune_fix(T):
				break
			S.rn.rune_losses = int(S.rn.rune_losses) + 1
			T.save()
			await T.say("", ["The rune flares. The grey lines thicken, and the families shoulder their short sacks and leave."])
			if int(S.rn.rune_losses) >= 2:
				await _worked_fix(T)
				break
			await T.say("orrin", "Look again. What kind of pieces are you adding?")
	await _rune_breaks(T)


## Test option rune_stop=1|2|3|3b: save and quit at that stage of the rune (3b: after one flare), to test resuming.
func _test_stop(T, at: String) -> bool:
	if T.args.get("rune_stop", "") != at:
		return false
	T.save()
	print("STOPPED-AT rune:%s losses=%d" % [at, int(T.S.rn.rune_losses)])
	T.get_tree().quit()
	return true


## Stage 3: explain, say why in plain words, then the two fixes. True when both fixes are right.
func _rune_fix(T) -> bool:
	await T.ask("orrin", Ch1.ASK_RUNE_EXPLAIN, "rune_explain", "The rune · Explain what's wrong")
	if not T.S.typed.has("rune_why"):
		await T.typed({"id": "rune_why", "title": "Tell the families", "kicker": "In your own words",
			"prompt": "Gale wants it in plain words for the families. Why is [b]1/2 + 1/3[/b] not [b]2/5[/b]?", "min": 40,
			"bot": "Halves and thirds are different sizes, so you can't just add the tops and bottoms. In sixths it's 3/6 + 2/6 = 5/6, which is more than 1/2. 2/5 is less than 1/2."})
	var t1: String = await T.frac({"key": "rn2_rune_fix", "label": "RN2 · Fix the rune: 1/2 + 1/3", "title": "Re-cut the stone", "kicker": "The grain-share stone · Fix",
		"prompt": "Each household: [b]1/2 + 1/3[/b] = ? cart", "answer": Ch1.rune_fix(), "lose": true, "hint_btn": "Ask Orrin",
		"hint": "Orrin: \"What kind of pieces are you adding? Make them the same size first.\"",
		"traps": [["2/5", "That's what the rune does: tops added, bottoms added."], ["2/6", "The bottoms match now, but rename the tops too."]]})
	if t1 == "lost":
		return false
	await T.say("", "The first carved line cracks and re-forms: 1/2 + 1/3 = 5/6. Below it, a second line still glows grey.")
	var t2: String = await T.frac({"key": "rn2_rune_fix2", "label": "RN2 · Fix the rune: 2/3 + 1/4", "title": "Re-cut the stone", "kicker": "The grain-share stone · Fix",
		"prompt": "The second carved line: \"Each elder: 2/3 + 1/4 = 3/7.\" The true total: [b]2/3 + 1/4[/b] = ?", "answer": Ch1.rune_fix2(), "lose": true,
		"hint_btn": "Ask Orrin", "hint": "Orrin: \"Thirds and quarters. What size of piece fits both?\"",
		"traps": [["3/7", "That's the rune's trick again: tops added, bottoms added."], ["3/12", "The bottoms match, but rename the tops: 2/3 = 8/12."]]})
	return t2 != "lost"


func _worked_fix(T) -> void:
	await T.say("", "Hesper arrives, out of breath from the Low Road, and kneels by the stone.")
	await T.panel("Hesper's fix", func(body):
		body.add_child(T.ui.rich("[b]1/2 + 1/3[/b]: halves and thirds are different-sized pieces. Rename both as sixths: 1/2 = 3/6 and 1/3 = 2/6. So 3/6 + 2/6 = [b]5/6[/b]."))
		body.add_child(T.ui.rich("[b]2/3 + 1/4[/b]: rename both as twelfths: 2/3 = 8/12 and 1/4 = 3/12. So 8/12 + 3/12 = [b]11/12[/b]."))
		body.add_child(T.ui.label("The rune added the tops and added the bottoms. That only works when the pieces are already the same size, and then you add the tops only.", "Muted")),
		[["I see it", true, true]], "The grain-share stone")
	T.record("rn2_rune_fix", "RN2 · Fix the rune: 1/2 + 1/3", "later")
	T.record("rn2_rune_fix2", "RN2 · Fix the rune: 2/3 + 1/4", "later")
	T.log_line("The false rune flared twice. Hesper showed the fix: 1/2 + 1/3 = 5/6 and 2/3 + 1/4 = 11/12.")


func _rune_breaks(T) -> void:
	var S: Dictionary = T.S
	if not T.flag("rune_broken", false):
		T.set_flag("rune_broken", true)
		S.rn.rune_result = "first attempt" if int(S.rn.rune_losses) == 0 else ("after %d flare%s" % [S.rn.rune_losses, "" if int(S.rn.rune_losses) == 1 else "s"])
		T.rebuild_maps()
		T.ui.confetti(70)
		T.banner("The false rune breaks", "1/2 + 1/3 = 5/6")
		if int(S.rn.rune_losses) < 2:
			T.log_line("You broke the false rune at Highstead: 1/2 + 1/3 = 5/6, not 2/5.")
	await T.say("", ["The carving cracks with a flash of gold. The stone re-cuts itself: 5/6 for each household, 11/12 for each elder.",
		"Up at the towers, the chutes open again. The families' sacks fill."])
	await T.say("gale", "Two hundred years... and it was wrong?")
	await T.say("orrin", "Someone made it wrong, Gale. Recently. {name}, keep this.")
	if not T.has("chip"):
		T.give("chip")
	T.remember("gale", "You re-cut the grain-share stone: 5/6, not 2/5.", 2)
	T.remember("orrin", "You broke your first false rune.", 2)
	T.set_flag("rune_over", true)
	T.refresh()


# ── The Balance sigil ──
func sigil(T) -> void:
	if T.flag("sigil", false):
		return
	T.set_flag("quest", "")
	await T.goal("Go back to Hesper's cottage. Orrin is walking with you.", "person:hesper")
	await T.say("hesper", ["Orrin told me. A false rune, and you broke it. Give me your hand.",
		"This is Balance. Warm or chill anything by an exact amount, above or below zero.",
		"At a gold ring, look at what it is now and what it needs to be. The change is target minus now. Exactly, mind: too little and nothing happens, too much and you've done harm."])
	T.set_flag("sigil", true)
	T.give("sigil")
	T.rebuild_maps()
	T.banner("A sigil drawn in gold", "Balance")
	T.confetti()
	var n := Ch1.pips(T.S)
	await T.say("hesper", ["Its charge is %s: one pip for every quest you got right the first time." % Ch1.pip_text(n),
		"All five pips open my old root cellar. Don't ask what's in it.",
		"Each gold ring you solve on the first try charges it a little more."])
	if Ch1.first_pips(T.S) < 5:
		await T.say("hesper", ["Missed a pip? Look for a gold ? over anyone you helped.", "That's a second look: the same skill with new numbers. Right first time wins the pip back."])
	T.log_line("Earned the Balance sigil. Charge %s." % Ch1.pip_text(n))


func mill_wheel(T) -> void:
	if T.flag("wheel_done", false):
		return
	T.set_flag("wheel_scene", true)
	T.set_flag("quest", "wheel")
	T.refresh()
	await T.goal("Abel's mill wheel froze in the night, and Highstead's grain is waiting. Use Balance at the gold ring by the wheel.", "thing:spot_wheel")
	await _spot(T, "spot_wheel", true)
	await T.say("abel", ["Look at her go! Highstead's grain will be flour by tonight.", "I'll knock 5/12 off what I owe Hesper for this. Ha! That makes us even."])
	T.set_flag("wheel_done", true)
	T.set_flag("quest", "")
	T.log_line("Used Balance for the first time: the mill wheel turns again.")


func chapter_end(T) -> void:
	if T.args.has("spots"):   # test option: use every sigil spot once
		for sid in ["spot_pond", "spot_gate", "spot_cellar", "spot_cellar"]:
			await _spot(T, sid, false)
	if T.flag("ch1_done", false):
		return
	await T.goal("Tell Hesper about the mill wheel.", "person:hesper")
	var n := Ch1.pips(T.S)
	await T.say("hesper", ["The wheel's turning, the stone's true, and the village is fed. Not bad for a first winter, {name}.",
		"Your Balance is charged %s. There are gold rings by the mill pond and at the tower-yard gate in Highstead, if you want the practice." % Ch1.pip_text(n)])
	await T.say("orrin", ["Hesper, the bridge cable. I saw a carving on it the night it fell. I'll show you both when I'm sure.",
		"Good work, apprentice. Now tell me why it worked. ...Later. Rest first."])
	T.set_flag("ch1_done", true)
	T.banner("Chapter 1 complete", "The Spark")
	T.confetti()
	await T.say("", "Open the Menu and download your report for your teacher.")
	if T.auto != "" and str(T.args.get("looks", "")) != "0":
		await _auto_looks(T)


## The test player's second looks: visit every giver with a missed pip; plan (looks=wrong,right) is the how for each giver's
## 1st, 2nd… look. A lock is opened with a gold ring or a faked later day (looks_unlock=ring|day; default: alternate), and the
## lock is checked first: a miss must keep the giver closed until then. Problems print as LOOK-PROBLEM.
func _auto_looks(T) -> void:
	var S: Dictionary = T.S
	var plan: PackedStringArray = str(T.args.get("looks", "wrong,right")).split(",")
	var keep: String = T.auto
	var unlocks := 0
	for _round in 8:
		var any := false
		for key in Ch1.PIP_KEYS:
			if not Ch1.look_missed(S, key) or Ch1.look_passed(S, key):
				continue
			any = true
			if not Ch1.look_open(S, key, today()):
				var how: String = str(T.args.get("looks_unlock", "ring" if unlocks % 2 == 0 else "day"))
				unlocks += 1
				if how == "ring":
					T.auto = "second"   # solve a gold ring (right on the second try)
					await _spot(T, "spot_pond", false)
					T.auto = keep
				else:
					_day_offset += 1
				T.refresh()
				if not Ch1.look_open(S, key, today()):
					print("LOOK-PROBLEM %s still locked after a %s" % [key, how])
					continue
			var n: int = (S.rn.get("looks", {}).get(key, {}).get("tries", []) as Array).size()
			await T.goal("A gold ? over %s: a second look." % T.people_def[Ch1.LOOK_GIVER[key]].name, "person:" + Ch1.LOOK_GIVER[key])
			T.auto = plan[mini(n, plan.size() - 1)].strip_edges()
			await _second_look(T, key, false)
			T.auto = keep
			if not Ch1.look_passed(S, key) and Ch1.look_open(S, key, today()):
				print("LOOK-PROBLEM %s open again straight after a miss" % key)
		if not any:
			break
	if T.args.has("spots") and not T.flag("sigil_cellar", false):   # with every pip back, the cellar should open now
		await _spot(T, "spot_cellar", false)
	T.set_goal_text(str(done_goal))


## A second look with this giver (design §8.1): the pip check again with the next variant's numbers.
func _second_look(T, key: String, offer := true) -> void:
	var S: Dictionary = T.S
	var giver: String = Ch1.LOOK_GIVER[key]
	var v := Ch1.look_variant(S, key)
	var c := Ch1.look_check(key, v)
	var ans := Ch1.look_answer(key, v)
	var traps := Ch1.look_traps(key, v)
	if offer and await T.choose(giver, "Back again, {name}? I've another one like it, with new numbers. A second look?", ["Yes, a second look", "Not now"]) != 0:
		return
	await T.say(giver, c.say)
	var o := {"key": "look_" + key, "record": false, "title": "Second look", "kicker": "%s · %s · variant %s" % [Ch1.LOOK_NAME[key], Ch1.LOOK_CODE[key], v],
		"prompt": c.prompt, "answer": ans, "hint_btn": _hint(), "hint": c.hint, "why": c.why, "traps": traps,
		"bot_wrong": str(traps[0][0]).replace("−", "-")}
	if c.has("unit"):
		o.unit = c.unit
	if c.get("as_dec", false):
		o.as_dec = true
	if key == "rn4_harvest":
		var cart := Ch1.look_cart(v)
		o.judge = func(x): return "Less than the cart you started with? Dividing by a share less than 1 gives more shares, not fewer." if Frac.lt(x, cart) else ""
		if T.mode() == "gentle" and c.has("bar"):
			o.show = Pn.bar(T, int(c.bar[0]), int(c.bar[1]), str(c.bar[2]))
	var tier: String = await T.frac(o)
	if c.has("ask"):
		await T.ask(giver, c.ask)
	Ch1.look_result(S, key, v, tier, today())
	T.save()
	if tier == "first":
		T.confetti()
		await T.say("", "The Balance sigil on your hand glows. One pip back: %s." % Ch1.pip_text(Ch1.pips(S)))
		await T.say("pell", "See? Same skill, new numbers, and you nailed it.")
		T.log_line("Second look with %s (variant %s): right the first time. A pip back." % [T.people_def[giver].name, v])
	else:
		if tier == "second":   # the panel shows the why line only after the last try
			await T.say("", c.why)
		await T.say(giver, "Come back after you've worked a gold ring, or tomorrow.")
	T.refresh()


## A Balance spot. story: the mill wheel step (cannot be left).
func _spot(T, sid: String, story: bool) -> void:
	var S: Dictionary = T.S
	var sp: Dictionary = Ch1.SPOTS[sid]
	var solved := bool(T.flag(sp.flag, false))
	if sid == "spot_cellar" and not solved and Ch1.pips(S) < Ch1.CELLAR_PIPS:
		await T.say("", ["The frost on the cellar door is old and deep. Balance needs all five pips, %s, to reach it; yours is %s." % [Ch1.pip_text(Ch1.CELLAR_PIPS), Ch1.pip_text(Ch1.pips(S))],
			"Each gold ring solved on the first try adds a pip. So does a second look (a gold ? over someone you helped) right the first time."])
		return
	if solved and not story and T.auto == "":
		if await T.choose("", "%s already holds. Practise Balance here anyway?" % sp.what.capitalize(), ["Practise", "Leave it"]) != 0:
			return
	var visit := int(S.rn.spot_visits.get(sid, 0))
	S.rn.spot_visits[sid] = visit + 1
	var nums := Ch1.spot_numbers(sid, visit, int(S.seed))
	var cur: Array = nums.current
	var tgt: Array = nums.target
	var ans: Array = nums.answer
	var lo := floorf(minf(Frac.to_float(cur), Frac.to_float(tgt))) - 1.0
	var hi := ceilf(maxf(Frac.to_float(cur), Frac.to_float(tgt))) + 1.0
	var wrongs := [0]
	var tier: String = await T.frac({"key": "spot_" + sid, "record": false, "tries": 3, "as_dec": true, "title": "Balance", "kicker": sp.what.capitalize(),
		"on_wrong": func(_v): wrongs[0] += 1,
		"show": func(body): body.add_child(Pn.frost_line(T, lo, hi, 1, [{"v": Frac.to_float(cur), "label": "now " + Frac.dec_text(cur), "col": Color("#6b665d")},
			{"v": Frac.to_float(tgt), "label": "target " + Frac.dec_text(tgt), "col": Color("#d99a1e"), "below": true}])),
		"prompt": "Now: [b]%s °C[/b]. Target (%s): [b]%s °C[/b].\nWhat exact change do you cast? (target − now)" % [Frac.dec_text(cur), sp.target_text, Frac.dec_text(tgt)],
		"answer": ans, "unit": "°C", "hint_btn": _hint(), "hint": "Hesper: \"Change = target − now. Count from now to the target on the frost line.\"",
		"why": "Change = %s − (%s) = %s." % [Frac.dec_text(tgt), Frac.dec_text(cur), Frac.dec_text(ans)],
		"judge": func(v): return Ch1.spot_judge(sp.kind, ans, v)})
	if wrongs[0] < 3:   # right at any try: opens a second look locked by a miss
		S.rn.rings_right = int(S.rn.get("rings_right", 0)) + 1
	if tier == "first":
		S.rn.spot_first = int(S.rn.get("spot_first", 0)) + 1
		if Ch1.pips(S) < 5:
			S.rn.spot_pips = int(S.rn.spot_pips) + 1
	S.rn.spots_used[sid] = int(S.rn.spots_used.get(sid, 0)) + 1
	if not solved:
		T.set_flag(sp.flag, true)
		T.rebuild_maps()
		await T.say("", sp.done)
		T.log_line("Balance: %s (change %s °C)." % [sp.what, Frac.dec_text(ans)])
		if sid == "spot_cellar":
			T.give("slingshot")
			T.give("page")
			await T.say("pell" if T.world.map.id == "brindle" else "", "My slingshot! I lost that last winter. ...What's that page with it?")
			T.remember("orrin", "You found a page of his old notebook in Hesper's cellar.")
	else:
		await T.say("", "The sigil hums. %s holds." % sp.what.capitalize())
	T.save()


# ── Free talk and things ──
func talk(pid: String, T) -> void:
	var f: Dictionary = T.S.flags
	var lk := _look_key(pid)
	if lk != "" and Ch1.look_open(T.S, lk, today()):
		await _second_look(T, lk)
		return
	match pid:
		"hesper":
			if not f.get("met_hesper", false):
				await T.say("hesper", "Who's this, then?")
			elif f.get("sigil", false):
				await T.say("hesper", "Balance is yours now, {name}. Use it carefully: exact amounts only.")
			else:
				await T.say("hesper", "Picture it on the frost line first. Where does it land?")
		"orrin":
			await T.say("orrin", "Good. Now tell me why it worked." if f.get("rune_broken", false) else "Keep your eyes open, apprentice. Lines like those don't snap on their own.")
		"pell":
			var lines := ["Hesper says I ask too many questions. I say there's no such thing.", "Did you know the gorge is four times as deep as the mill is tall? I didn't measure it. But still.",
				"When I'm older I'm going to be an apprentice too. Of someone."]
			await T.say("pell", lines[(int(T.S.seed) + T.S.log.size()) % lines.size()])
		"marta":
			await T.say("marta", "Sweetest water in the valley, now it's running." if f.get("well_done", false) else "Frozen right through. Have you seen anything like it?")
		"abel":
			await T.say("abel", "She's turning beautifully." if f.get("wheel_done", false) else ("Short 5/12 of a silver. Better than not knowing." if f.get("ledger_done", false) else "Numbers. Never my strong suit."))
		"rowan":
			await T.say("rowan", "The lambs are snug." if f.get("snap_done", false) else "Fine evening. Too fine, maybe.")
		"odile":
			await T.say("odile", "Ten families fed through the winter." if f.get("harvest_done", false) else "The reeve's book never lies. The people writing in it sometimes do.")
		"gale":
			await T.say("gale", "I'll check every stone in Highstead myself now. Every one." if f.get("rune_broken", false) else "The stone says 2/5. The stone has always been right.")
		"runner":
			await T.say("runner", "Hesper will know what to do. She always does.")
		"fam1", "fam2", "fam3":
			await T.say(pid, "A full sack! Thank you, apprentice." if f.get("rune_broken", false) else "Half a sack, again. The stone says it's fair...")
		"vil1", "vil2":
			await T.say(pid, "That bridge stood for a hundred years." if f.get("met_orrin", false) else "Mind the bridge, it sways!")


func use(thing: String, T) -> void:
	var f: Dictionary = T.S.flags
	match thing:
		"frost_window":
			await T.say("", "The frost line on Hesper's window: cold to the left, warm to the right, zero at the sill mark.")
		"ledger":
			await T.say("", "Abel's ledger. In new ink at the bottom: \"Short 5/12 of a silver.\"" if f.get("ledger_done", false) else "Abel's ledger: columns of halves, thirds and quarters, mostly crossed out.")
		"hen_coop":
			await T.say("", "Hesper's hens, under a fine frost-ward. They seem unimpressed." if f.get("recipe_done", false) else "Hesper's hen-house. The hens mutter about the weather.")
		"cellar":
			await T.say("", "Hesper's root cellar, open now." if f.get("sigil_cellar", false) else "Hesper's root cellar. The door is frozen shut under old, deep frost.")
		"yard_gate":
			await T.say("", "The gate to the grain-tower yard is frozen shut." + (" There's a gold ring in front of it." if f.get("sigil", false) else ""))
		"stone_front":
			await T.say("", "The grain-share stone. \"1/2 + 1/3 = 5/6\", cut fresh and true." if f.get("rune_broken", false) else "The grain-share stone: \"1/2 + 1/3 = 2/5\". Grey lines crawl over the carving.")
		"grain_cart":
			await T.say("", "The common grain cart, about 3/4 full.")
		"abel_shelf":
			await T.say("", "A shelf of flour tins, each labelled in careful fractions of a sack.")
		"tower_door":
			if not f.get("met_orrin", false):
				await T.say("", "The old Warden's tower. Nobody in Brindle Ford remembers the door being open. The windows are dark.")
			elif f.get("rune_broken", false):
				await T.say("", "Orrin's tower. A note is pinned to the door: \"Back late. Keep the chip safe. — O.\"")
			else:
				await T.say("", "Orrin's tower, lit up again after all these years. The door is locked; a brass telescope on the balcony points at the gorge.")
		"bridge":
			await T.say("", "The broken bridge. Across the gorge, the far end hangs down the cliff." if f.get("bridge_fell", false) else "The old rope bridge to the far bank.")
		"spot_pond", "spot_wheel", "spot_gate", "spot_cellar":
			await _spot(T, thing, false)


# ── Report and the test player ──
func report(S: Dictionary) -> Array:
	var rows := []
	var word := {"first": "first try", "second": "second try", "later": "shown the answer"}
	for c in Ch1.CODES:
		var bits := []
		var firsts := 0
		var seen := 0
		for k in c[2]:
			if S.answers.has(k):
				seen += 1
				if S.answers[k].tier == "first":
					firsts += 1
				bits.append("%s: %s" % [S.answers[k].label.split(": ", true, 1)[-1] if S.answers[k].label.contains(": ") else k, word.get(S.answers[k].tier, "")])
		rows.append(["%s %s" % [c[0], c[1]], ("%d of %d first try. " % [firsts, seen] + "; ".join(bits)) if seen > 0 else "Not reached yet."])
	var out := [{"title": "First tries by outcome (notes section)", "rows": rows}]
	var rune_rows := []
	if S.answers.has("rune_predict"):
		rune_rows.append(["Predicted right?", "Yes, first try" if S.answers.rune_predict.tier == "first" else "Not on the first try"])
	if S.flags.get("rune_broken", false):
		rune_rows.append(["Broke the rune", str(S.rn.get("rune_result", ""))])
	elif S.flags.get("at_rune", false):
		rune_rows.append(["Broke the rune", "Not yet (%d flares so far)" % int(S.rn.rune_losses)])
	if rune_rows.size():
		out.append({"title": "The false rune", "rows": rune_rows})
	if S.flags.get("sigil", false):
		var used := []
		for sid in S.rn.spots_used:
			used.append("%s ×%d" % [Ch1.SPOTS[sid].what, int(S.rn.spots_used[sid])])
		var looks := []
		var tried := 0
		for k in Ch1.PIP_KEYS:
			var t := Ch1.look_text(S, k)
			if t != "":
				tried += (S.rn.looks[k].tries as Array).size()
				looks.append("%s: %s" % [Ch1.LOOK_NAME[k], t])
		var srows := [["Charge", "%s (%d of 5)" % [Ch1.pip_text(Ch1.pips(S)), Ch1.pips(S)]],
			["Where the pips came from", "%d from first tries, %d from gold rings, %d from second looks" % [Ch1.first_pips(S), int(S.rn.get("spot_pips", 0)), Ch1.look_pips(S)]],
			["Gold rings used", ", ".join(used) if used.size() else "none yet"], ["Solved on the first try", str(int(S.rn.get("spot_first", 0)))],
			["Second looks", ("%d tried, %d passed. " % [tried, Ch1.look_pips(S)] + "; ".join(looks)) if looks.size() else "none yet"]]
		out.append({"title": "The Balance sigil", "rows": srows})
	return out


func summary(S: Dictionary) -> Dictionary:
	var firsts := 0
	for k in S.answers:
		if S.answers[k].tier == "first":
			firsts += 1
	var looks := {}
	for k in S.rn.get("looks", {}):
		var tl := []
		for t in S.rn.looks[k].tries:
			tl.append("%s:%s" % [t.v, t.tier])
		looks[k] = ",".join(tl)
	return {"pips": Ch1.pips(S), "pips_from": [Ch1.first_pips(S), int(S.rn.get("spot_pips", 0)), Ch1.look_pips(S)], "looks": looks, "rune_losses": int(S.rn.rune_losses), "rune_broken": S.flags.get("rune_broken", false), "firsts": firsts,
		"sigils": [S.flags.get("sigil_pond", false), S.flags.get("sigil_wheel", false), S.flags.get("sigil_gate", false), S.flags.get("sigil_cellar", false)],
		"items": S.inv.keys()}
