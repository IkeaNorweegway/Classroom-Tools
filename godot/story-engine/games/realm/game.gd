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
#
# Chapter 2, "The Blight" (Powers and exponents, PE1–PE7; design math9-realm-ch2-design-v1.md, script math9-realm-ch2-script-v1.md):
# the steps are at the end of this file (ch2_recap … chapter_end2), the numbers in games/realm/ch2.gd. One save holds both
# chapters (S.chapter, absent = 1; Chapter 2's state in S.pe as Chapter 1's is in S.rn), so an old Chapter 1 save loads as it
# was. The title offers Chapter 2 once Chapter 1 is done ("Go on to Chapter 2"), and with no save "Start at Chapter 2": Hesper's
# recap, the Balance sigil lent (flag balance_lent: no Balance pips, the cellar stays shut). Test options: chapter=2 (a new game
# starts at Chapter 2; with resume=1 a finished Chapter 1 save goes on to Chapter 2), rune_stop=1|2|3|3b at the vault too,
# spots=1 (every Growth spot once at the chapter end), looks=… and looks_unlock=… as Chapter 1.
extends RefCounted

const Ch1 = preload("res://games/realm/ch1.gd")
const Ch2 = preload("res://games/realm/ch2.gd")
const Maps = preload("res://games/realm/maps.gd")
const Pn = preload("res://games/realm/panels.gd")
const Frac = preload("res://engine/core/frac.gd")
const HERO := "realm/voxpeople/hero"   # the tintable rigged model (the voxel people pack, scripts/blender/realm_voxel_people.py; the first pack is realm/people)

var id := "realm-ch1"
var title := "The Measure of the Realm"
var unit_label := "Math 9 · Chapter 1: The Spark · Rational numbers (RN1–RN5)"
var i_can := "I can compare, add, subtract, multiply and divide rational numbers, use the order of operations, and explain why my answer makes sense."
var blurb := "On harvest night the gorge bridge falls, and you saw the gold lines that held it snap. An old traveller says that means you can learn. Become Hesper Marrow's apprentice, help Brindle Ford through the first frost, and break a false rune."
var start_map := "brindle"
var start_at := Vector2i(12, 27)
var avatar_title := "Name your apprentice"
var avatar_looks := false   # the hero is set: no skin, hair or shirt pickers at the start
var pronouns := true
var report_file := "realm-ch1"
var log_unit := "Part"
var done_goal := "Chapter 1 is done. Use the Balance sigil at the gold rings, or open the Menu for your report."
var shop_cfg := {}
var shop_layout := {}

var _free_roam := false
var _day_offset := 0   # test hook: days added to today's date (second-look locks)
var _chapter := 1      # the chapter in play (S.chapter), set when a game begins
var _want_chapter := 1 # the chapter a new game starts at (the title's "Start at Chapter 2")
const CH1_LABEL := "Math 9 · Chapter 1: The Spark · Rational numbers (RN1–RN5)"
const CH1_I_CAN := "I can compare, add, subtract, multiply and divide rational numbers, use the order of operations, and explain why my answer makes sense."
const CH2_LABEL := "Math 9 · Chapter 2: The Blight · Powers and exponents (PE1–PE7)"
const CH2_I_CAN := "I can write and evaluate powers, use the exponent laws and explain why each one works, and say what a zero or a negative exponent means."
const TOPIC2 := {2: ["the zero exponent", "Section 2"], 3: ["product of powers", "Section 3"], 4: ["quotient of powers", "Section 4"],
	5: ["power of a power", "Section 5"], 6: ["power of a product and quotient", "Section 6"], 7: ["negative exponents", "Section 7"]}

const TOPIC := {2: ["adding and subtracting", "Section 2"], 3: ["multiplying", "Section 3"], 4: ["dividing", "Section 4"], 5: ["the order of operations", "Section 5"]}
const QUEST_OF := {"lesson": "lesson", "well": "well", "ledger": "ledger", "cold_snap": "snap", "harvest": "harvest", "recipe": "recipe"}


# ── Maps ──
func maps() -> Dictionary:
	return Maps.build({})


func maps_for(S: Dictionary) -> Dictionary:
	if not S.flags.get("ch2", false):
		return Maps.build(S.flags)
	var f: Dictionary = S.flags.duplicate()
	f["_pips_full"] = S.has("answers") and S.has("pe") and Ch2.pips(S) >= Ch2.PIPS   # Orrin's window star lights with all six pips
	return Maps.build(f)


# ── People ──
## You, drawn with the rigged hero model in your chosen colours and hair.
func my_look(_S: Dictionary, look: Dictionary) -> Dictionary:
	var out := look.duplicate()
	out.model = HERO
	return out


func people() -> Dictionary:
	return {
		"hesper": {"name": "Hesper", "role": "hedge-witch of Emberdale, your teacher", "look": {"model": "realm/voxpeople/hesper", "skin": 1, "hair": 4, "hair_style": 2, "shirt": "#6e8a5a", "pants": 2, "outfit": "cloak", "cloak": "#5a6e4a"}},
		"orrin": {"name": "Orrin", "role": "an old traveller in a grey-blue coat", "look": {"model": "realm/voxpeople/orrin", "skin": 0, "hair": 4, "hair_style": 1, "shirt": "#5d6a86", "pants": 1, "outfit": "hat", "hat": "#4a5068"}},
		"pell": {"name": "Pell", "role": "your younger cousin", "look": {"model": "realm/voxpeople/pell", "skin": 2, "hair": 2, "hair_style": 3, "shirt": 1, "pants": 2}},
		"marta": {"name": "Marta Fenn", "role": "the well-keeper", "look": {"model": "realm/voxpeople/marta", "skin": 3, "hair": 0, "hair_style": 1, "shirt": "#7a5a8a", "pants": 0, "outfit": "apron", "apron": "#e8dcc4"}},
		"abel": {"name": "Abel Crane", "role": "the miller", "look": {"model": "realm/voxpeople/abel", "skin": 1, "hair": 1, "hair_style": 4, "shirt": 5, "pants": 2, "outfit": "apron", "apron": "#c9b89a"}},
		"rowan": {"name": "Rowan Tull", "role": "the shepherd", "look": {"model": "realm/voxpeople/rowan", "skin": 4, "hair": 0, "hair_style": 0, "shirt": "#8a6a3a", "pants": 2, "outfit": "vest", "vest": "#5a4a3a"}},
		"odile": {"name": "Reeve Odile Marsh", "role": "the village reeve", "look": {"model": "realm/voxpeople/odile", "skin": 5, "hair": 6, "hair_style": 2, "shirt": "#7a2e3a", "pants": 0, "outfit": "cloak", "cloak": "#3a2e4a"}},
		"gale": {"name": "Gale Harrow", "role": "Highstead's grain-warden", "look": {"model": "realm/voxpeople/gale", "skin": 2, "hair": 3, "hair_style": 0, "shirt": "#4a6a8a", "pants": 1, "outfit": "vest", "vest": "#2f3e5c"}},
		"sefa": {"name": "A grey-cloaked figure", "role": "seen slipping out of Highstead square", "look": {"model": "realm/voxpeople/sefa", "skin": 1, "hair": 4, "hair_style": 0, "shirt": "#7d7f84", "pants": 1, "outfit": "hood", "cloak": "#7d7f84"}},
		"runner": {"name": "Tam", "role": "a runner from Highstead", "look": {"model": HERO, "skin": 3, "hair": 5, "hair_style": 0, "shirt": 3, "pants": 3}},
		"fam1": {"name": "Ada", "role": "a Highstead farmer", "look": {"model": HERO, "skin": 0, "hair": 2, "hair_style": 1, "shirt": 1, "pants": 0}},
		"fam2": {"name": "Tobin", "role": "a Highstead farmer", "look": {"model": HERO, "skin": 4, "hair": 0, "hair_style": 4, "shirt": 3, "pants": 2}},
		"fam3": {"name": "Wren", "role": "a Highstead farmer", "look": {"model": HERO, "skin": 2, "hair": 1, "hair_style": 2, "shirt": 7, "pants": 4}},
		"vil1": {"name": "Jory", "role": "a Brindle Ford villager", "look": {"model": HERO, "skin": 1, "hair": 3, "hair_style": 0, "shirt": 0, "pants": 0}},
		"vil2": {"name": "Nell", "role": "a Brindle Ford villager", "look": {"model": HERO, "skin": 5, "hair": 0, "hair_style": 2, "shirt": 4, "pants": 1}},

		"bram": {"name": "Bram Ostler", "role": "a carter", "look": {"model": "realm/voxpeople/bram"}},
	}


func new_game(S: Dictionary) -> void:
	S.rn = {"gate_wait": -1, "rune_stage": 1, "rune_losses": 0, "spot_visits": {}, "spot_pips": 0, "spot_first": 0, "spots_used": {},
		"rings_right": 0, "looks": {}}
	if _want_chapter == 2:
		S.want_ch = 2


func on_begin(T) -> void:
	_day_offset = int(T.args.get("day_offset", "0")) if T.debug else 0
	var S: Dictionary = T.S
	if T.args.get("chapter", "") == "2" and int(S.get("chapter", 1)) != 2:
		S.want_ch = 2
	if int(S.get("want_ch", 1)) == 2 and int(S.get("chapter", 1)) != 2:
		if T.G.get("done", false):
			_start_ch2(T, false)          # Chapter 1 finished: go on with the same apprentice
		elif int(T.G.si) == 0:
			_start_ch2(T, true)           # a new game that starts here: Hesper's recap and a lent sigil
	S.erase("want_ch")
	_chapter = int(S.get("chapter", 1))
	unit_label = CH2_LABEL if _chapter == 2 else CH1_LABEL
	i_can = CH2_I_CAN if _chapter == 2 else CH1_I_CAN
	report_file = "realm-ch2" if _chapter == 2 else "realm-ch1"
	done_goal = "Open the Menu and download your report for your teacher." if _chapter == 2 else "Chapter 1 is done. Use the Balance sigil at the gold rings, or open the Menu for your report."


## Chapter 2 begins on this save. lent: no Chapter 1 save, so the world is set as Chapter 1 left it and Balance is lent.
func _start_ch2(T, lent: bool) -> void:
	var S: Dictionary = T.S
	S.chapter = 2
	S.pe = {"gate_wait": -1, "rune_stage": 1, "rune_losses": 0, "spot_visits": {}, "spot_pips": 0, "spot_first": 0, "spots_used": {},
		"rings_right": 0, "looks": {}, "balance_used": {}, "log_from": S.log.size()}
	S.flags.ch2 = true
	S.flags.quest = ""
	if lent:
		for k in ["bridge_fell", "met_orrin", "met_hesper", "lesson_done", "rune_broken", "rune_over", "sefa_gone", "runner_done", "met_at_arch",
				"sigil", "sigil_wheel", "wheel_done", "wheel_scene", "lambs_in", "balance_lent"]:
			S.flags[k] = true
		S.inv["sigil"] = 1
	T.G.si = 0
	T.G.done = false


## The title's chapter choices: Chapter 2 once Chapter 1 is done; with no save, a choice of where to start.
func title_buttons(saved, btns: Array) -> Array:
	if saved == null:
		return [["Start at Chapter 1", "new", true], ["Start at Chapter 2", "game:ch2new"]]
	var gS: Dictionary = saved.S
	if int(gS.get("chapter", 1)) != 2 and saved.get("done", false):
		return [["Continue", "continue", true], ["Go on to Chapter 2", "game:ch2"], ["New game", "new"]]
	return btns


## Going on to Chapter 2 asks first (the report shows one chapter at a time); "back" sends the engine to the title again.
## confirm = false: the tests (and the test player, which never sees the title) skip the box.
func title_pick(v: String, saved, confirm := true):
	if v == "ch2" and saved != null:
		if confirm and Town.auto == "":
			var go = await Town.panel("Go on to Chapter 2", func(b): b.add_child(Town.ui.label("From here your report shows Chapter 2 only. If your teacher wants your Chapter 1 report, download it first.")),
				[["Go on to Chapter 2", true, true], ["Back", false]])
			if not go:
				return "back"
		saved.S.want_ch = 2
		return saved
	_want_chapter = 2
	return null


func steps() -> Array:
	if _chapter == 2:
		return ["ch2_recap", "ch2_open", "lesson2", "gate2:2", "tally", "gate2:3", "cure", "gate2:4", "moths", "gate2:5", "nests", "gate2:6",
			"jar", "gate2:7", "boulder", "vault", "sigil2", "vine", "chapter_end2"]
	return ["prologue", "meet_hesper", "lesson", "gate:2", "well", "ledger", "gate:3", "cold_snap", "gate:4", "harvest", "gate:5",
		"recipe", "low_road", "rune", "sigil", "mill_wheel", "chapter_end"]


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
	return S.has("rn") and S.rn is Dictionary and S.rn.has("rune_stage") and S.rn.has("spot_visits") \
		and (int(S.get("chapter", 1)) != 2 or (S.get("pe") is Dictionary and S.pe.has("rune_stage")))


## The quest Pell is waiting at (he tags along to each one).
func _quest(S: Dictionary) -> String:
	return str(S.flags.get("quest", ""))


func where(pid: String, S: Dictionary) -> Variant:
	var f: Dictionary = S.flags
	if f.get("ch2", false) and pid in ["hesper", "orrin", "pell", "odile", "gale", "sefa", "bram", "runner"]:
		return _where2(pid, S)
	if pid == "bram":
		return null
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
					return {"map": "barn", "x": 5, "y": 4, "dir": "left"}
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
	return out + nav_states2()


## Chapter 2's states: each quest, the boulder in place and shrunk, the vault shut and open, the Growth spots unsolved and solved.
func nav_states2() -> Array:
	var out := []
	var after1 := {"bridge_fell": true, "met_orrin": true, "met_hesper": true, "rune_broken": true, "rune_over": true, "sigil": true, "sigil_wheel": true,
		"wheel_scene": true, "lambs_in": true, "ch2": true}
	for extra in [{"quest": "lesson2"}, {"quest": "tally"}, {"quest": "cure"}, {"quest": "moths", "cure_done": true}, {"quest": "nests"},
			{"quest": "jar", "moths_done": true, "nests_done": true}, {"quest": "boulder", "boulder_here": true},
			{"boulder_here": true, "boulder_done": true, "quest": "vault", "at_vault": true, "sigil_gate": true},
			{"boulder_here": true, "boulder_done": true, "at_vault": true, "sigil_gate": true, "rune2_broken": true, "sefa2_gone": true, "quest": "sigil2"},
			{"boulder_here": true, "boulder_done": true, "rune2_broken": true, "sigil2": true, "sigil_gate": true, "quest": "vine"},
			{"boulder_here": true, "boulder_done": true, "rune2_broken": true, "sigil2": true, "sigil_pond": true, "sigil_gate": true, "cat": true,
				"growth_ledge": true, "growth_hedge": true, "growth_vault": true, "growth_window": true, "_pips_full": true}]:
		var f := after1.duplicate()
		f.merge(extra, true)
		out.append({"day": 1, "flags": f, "mem": {}, "shop": null, "days": [], "cash": 0, "rn": {}})
	return out


## Flags the nav test also turns on together (every sigil solved, the lambs in).
func nav_flags() -> Array:
	return ["sigil", "sigil_pond", "sigil_wheel", "sigil_gate", "sigil_cellar", "lambs_in", "bridge_fell", "rune_broken",
		"ch2", "sigil2", "boulder_here", "boulder_done", "rune2_broken", "growth_ledge", "growth_hedge", "growth_vault", "growth_window", "cat"]


func bubble(pid: String, S: Dictionary) -> String:
	if _free_roam and pid == "hesper":
		return "talk"
	if S.flags.get("ch2", false):
		var k2 := _look_key2(pid)
		return "q_gold" if k2 != "" and Ch2.look_open(S, k2, today()) else ""
	var k := _look_key(pid)
	if k != "" and Ch1.look_open(S, k, today()):
		return "q_gold"   # a second look is waiting
	return ""


func items() -> Dictionary:
	return {
		"notes": {"name": "Hesper's frost-line notes", "about": "Cold on the left, warm on the right. The greater number is always further right: −1/4 > −3/4. One point can have three names: −3/4 = 3/(−4) = −(3/4)."},
		"chip": {"name": "A chip of the false rune", "about": "Orrin asked you to keep it. The grey lines on it have gone still."},
		"sigil": {"name": "The Balance sigil", "about": "Warm or chill anything by an exact amount, above or below zero. At a gold ring, type the exact change: target − now."},
		"chip2": {"name": "A chip of the vault stone", "about": "Cut by the same hand as the grain-share rune, Orrin says. He told you to keep them together."},
		"growth": {"name": "The Growth sigil", "about": "At a green-gold star: choose the exponent. Positive grows, negative shrinks, 0 changes nothing."},
		"slingshot": {"name": "Pell's slingshot", "about": "Lost last winter. It was in Hesper's root cellar, of all places."},
		"page": {"name": "A page of Orrin's old notebook", "about": "In faded ink: \"M. asks why we bother with why. I had no good answer today.\""},
	}


func hud(S: Dictionary) -> Array:
	if S.flags.get("ch2", false):
		return _hud2(S)
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
	if S.flags.get("ch2", false):
		return _journal2(S)
	var out := []
	if S.flags.get("sigil", false):
		var n := Ch1.pips(S)
		out.append(["THE BALANCE SIGIL", "Charge %s (%d of 5). First-try answers charge it; so does each gold ring solved on the first try. %s" % [
			Ch1.pip_text(n), n, "All five pips open Hesper's root cellar." if not S.flags.get("sigil_cellar", false) else "The root cellar is open."]])
		out.append(["SECOND LOOKS", "Missed a pip? A gold ? over someone you helped means a second look: the same skill, new numbers. Right first time wins the pip back."])
	if S.flags.get("ch1_done", false):
		out.append(["YOUR REPORT", "Chapter 1 is done. Download your report before you go on to Chapter 2."])
	return out


## A wrong try's hint button, and Hesper's line after a first-try right answer.
func _hint() -> String:
	return "Ask Hesper"


## The design's line the first time; after that `said`, which names what the student did right.
func _praise(T, tier: String, said := "") -> void:
	if tier == "first":
		var line := "Fair shares and true numbers. That's my apprentice."
		if said != "" and T.flag("praised", false):
			line = said
		T.set_flag("praised", true)
		await T.say("hesper" if T.world.map.id == "cottage" else "", line if T.world.map.id == "cottage" else "Hesper's voice, in your head: \"%s\"" % line)


# ── The soft gate before each notes section ──
func gate(T, n: String) -> void:
	await _gate(T, n, TOPIC, "Chapter 1", T.S.rn)


func gate2(T, n: String) -> void:
	await _gate(T, n, TOPIC2, "Chapter 2", T.S.pe)


## R holds gate_wait (S.rn in Chapter 1, S.pe in Chapter 2).
func _gate(T, n: String, topics: Dictionary, kicker: String, R: Dictionary) -> void:
	var nxt := int(n)
	var tp: Array = topics[nxt]
	if int(R.gate_wait) != nxt:
		var v = await T.panel("Next lesson: %s" % tp[0], func(body):
			body.add_child(T.ui.rich("Hesper says the next lesson is about [b]%s[/b] (notes %s). Learned it in class yet?" % [tp[0], tp[1]]))
			body.add_child(T.ui.label("You can start it now, or look around Brindle Ford first. Talking to Hesper starts it.", "Muted")),
			[["Start it now", "go", true], ["Not yet: look around Brindle Ford", "later"]], kicker)
		if v == "go":
			return
		R.gate_wait = nxt
		T.save()
	_free_roam = true
	T.refresh()
	while true:
		await T.goal("When you've had the lesson on %s in class, talk to Hesper at her cottage." % tp[0], "person:hesper")
		if await T.choose("hesper", "Ready for the next lesson? It's about %s." % tp[0], ["Yes, I learned it in class.", "Not yet"]) == 0:
			break
		await T.say("hesper", "Then go and see how the village is getting on. I'll be here.")
	_free_roam = false
	R.gate_wait = -1
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
		await T.scene("bridge_fall", [
			{"do": func(): T.set_flag("bridge_fell", true)},
			{"do": func(): T.rebuild_maps()},
			{"do": func(): T.ui.confetti(30)},
			{"say": "The bridge drops into the gorge with a roar of wood and rope. Pell is clinging to the far edge!"},
			{"fade": "out", "secs": 0.4},
		])
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
	await _praise(T, t, "Coldest on the left, warmest on the right. You have the line.")
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
	await T.say("marta", ["{name}, you're Hesper's new apprentice? Look at my well.", "Frozen solid. The water's at −12.5 °C.",
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
	await _praise(T, tier, "You watched the signs when you added. That's the whole trick.")
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
	await _praise(T, tier, "You renamed every share before you added. Well done.")
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
	await _praise(T, tier, "A negative times a positive, and you kept the sign. Good.")
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
	await _praise(T, tier, "How many fit: that's all dividing is. You have it.")
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
	await T.say("hesper", ["−1/2. It holds. Every operation, in the right order.", "That's the whole of this first winter's lessons, {name}."])
	await _praise(T, tier, "Brackets, exponent, multiply, add. Every step in its place.")
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
	await T.say("hesper", ["The stone has never been wrong, they say. Hm.", "Go and look, {name}. Take the Low Road north: the long way round, now.",
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
		await T.say("", ["The stone stands in the middle of the square.", "Carved on it: \"Each household: 1/2 cart from the north tower + 1/3 cart from the south tower = 2/5 cart.\"",
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
		"At a gold ring, look at what it is now and what it needs to be. The change is target minus now.", "Exactly, mind: too little and nothing happens, too much and you've done harm."])
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
		T.log_line("Second look with %s (variant %s): right the first time. A pip back." % [T.people_def[giver].name, v], "Second look")
	else:
		if tier == "second" or tier == "third":   # the panel shows the why line only when it shows the answer
			await T.say("", c.why)
		await T.say(giver, "Come back after you've worked a gold ring, or tomorrow.")
	T.refresh()


## A Balance spot. story: the mill wheel step (cannot be left).
func _spot(T, sid: String, story: bool) -> void:
	var S: Dictionary = T.S
	var sp: Dictionary = Ch1.SPOTS[sid]
	var solved := bool(T.flag(sp.flag, false))
	if sid == "spot_cellar" and not solved and (Ch1.pips(S) < Ch1.CELLAR_PIPS or T.flag("balance_lent", false)):
		await T.say("", ["The frost on the cellar door is old and deep. Balance needs all five pips, %s, to reach it; yours is %s." % [Ch1.pip_text(Ch1.CELLAR_PIPS), Ch1.pip_text(Ch1.pips(S))],
			"Each gold ring solved on the first try adds a pip.", "So does a second look, right the first time. Look for a gold ? over someone you helped."])
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
		if Ch1.pips(S) < 5 and not T.flag("balance_lent", false):   # a lent sigil charges nothing (Ch 2 design §2)
			S.rn.spot_pips = int(S.rn.spot_pips) + 1
	S.rn.spots_used[sid] = int(S.rn.spots_used.get(sid, 0)) + 1
	if S.has("pe") and S.flags.get("ch2", false):   # Balance spots used in Chapter 2, for its report
		S.pe.balance_used[sid] = int(S.pe.balance_used.get(sid, 0)) + 1
	if not solved:
		T.set_flag(sp.flag, true)
		T.rebuild_maps()
		await T.say("", sp.done)
		T.log_line("Balance: %s (change %s °C)." % [sp.what, Frac.dec_text(ans)], "" if story else "A gold ring")
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
	if f.get("ch2", false):
		await _talk2(pid, T)
		return
	var lk := _look_key(pid)
	if lk != "" and Ch1.look_open(T.S, lk, today()):
		await _second_look(T, lk)
		return
	await _talk_lines(pid, T)


## The people's everyday lines (Chapter 1's; Chapter 2 falls back to them).
func _talk_lines(pid: String, T) -> void:
	var f: Dictionary = T.S.flags
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
		"growth_ledge", "growth_hedge", "growth_vault", "growth_window":
			await _gspot(T, thing, false)


# ── Report and the test player ──
func _row_name(label: String, key: String) -> String:
	if label.contains(": "):
		return label.split(": ", true, 1)[-1]
	if label.contains("· "):
		return label.split("· ", true, 1)[-1]
	return key


func report(S: Dictionary) -> Array:
	if S.flags.get("ch2", false):
		return _report2(S)
	var rows := []
	var word := {"first": "first try", "second": "second try", "third": "third try", "later": "shown the answer"}
	for c in Ch1.CODES:
		var bits := []
		var firsts := 0
		var seen := 0
		for k in c[2]:
			if S.answers.has(k):
				seen += 1
				if S.answers[k].tier == "first":
					firsts += 1
				bits.append("%s: %s" % [_row_name(S.answers[k].label, k), word.get(S.answers[k].tier, "")])
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
	if S.flags.get("ch2", false):
		return _summary2(S)
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


# ════════ Chapter 2: "The Blight" (Powers and exponents, PE1–PE7) ════════
# Lines are the script's (math9-realm-ch2-script-v1.md), checks and their words the design's (math9-realm-ch2-design-v1.md).
const QUEST2 := {"lesson2": ["The spell-seed", "The lesson · PE1"], "tally": ["The moss tally", "Quest · PE2"], "cure": ["The blight cure", "Quest · PE3"],
	"moths": ["Hollow-moths at the mill", "Quest · PE4"], "nests": ["The nests in the well-house", "Quest · PE5"], "jar": ["Pell's spell jar", "Quest · PE6"],
	"boulder": ["The boulder on the road", "Quest · PE7"], "vault": ["The seed vault", "The seed vault"]}
const TIER_ORDER := ["first", "second", "third", "later"]

## The name each story step gives its "What I decided" rows (the quest panel titles and the designs' section names).
## Lines written outside a step (second looks, gold rings, Orrin's window) pass their own label.
const STEP_NAME := {"prologue": "The night the bridge fell", "meet_hesper": "Meeting Hesper", "lesson": "Hesper's lesson",
	"well": "The frozen well", "ledger": "The miller's ledger", "cold_snap": "The cold snap", "harvest": "Sharing the harvest",
	"recipe": "The frost recipe", "low_road": "The runner from Highstead", "rune": "The false rune", "sigil": "The Balance sigil",
	"mill_wheel": "The mill wheel", "chapter_end": "End of Chapter 1",
	"ch2_recap": "Hesper's recap", "ch2_open": "Opening", "sigil2": "The Growth sigil", "vine": "The first vine", "chapter_end2": "End of Chapter 2"}


## The engine's hook: the scene in play names the log line ("" → the engine's "Part N").
func log_label(T) -> String:
	var st: Array = steps()
	var si := int(T.G.get("si", -1))
	if si < 0 or si >= st.size():
		return ""
	var n := str(st[si]).split(":")[0]
	if QUEST2.has(n):
		return str(QUEST2[n][0])
	return str(STEP_NAME.get(n, ""))


func _look_key2(pid: String) -> String:
	for k in Ch2.LOOK_GIVER:
		if Ch2.LOOK_GIVER[k] == pid:
			return k
	return ""


## The cat walks behind you once it has come down the first vine.
func follower(S: Dictionary) -> Dictionary:
	return {"model": "realm/voxpeople/cat"} if S.flags.get("cat", false) else {}


## The engine's report lists only the chapter in play (answers, typed and log lines). Chapter 2's typed answers are in its own
## "In my own words" rows, so the engine's copy is left out.
func report_keep(S: Dictionary, kind: String, k) -> bool:
	var ch2: bool = S.flags.get("ch2", false)
	var from := int(S.get("pe", {}).get("log_from", 0)) if S.has("pe") else 1 << 30
	match kind:
		"answer":
			return Ch2.keys().has(str(k)) == ch2
		"typed":
			return not ch2 and not Ch2.keys().has(str(k))
		"log":
			return (int(k) >= from) == ch2
	return true


func _cat(T) -> String:
	return str(T.S.flags.get("cat_name", "Soot"))


func _c(T, t: String) -> String:
	return t.replace("{cat}", _cat(T))


## Hesper speaking from afar (as Chapter 1's off-map line).
func _voice(T, line) -> void:
	if line is Array:   # a long line in several boxes, split at sentence breaks: the first names the voice, the rest keep the quotes
		var boxes := []
		for i in line.size():
			boxes.append(("Hesper's voice, in your head: \"%s\"" if i == 0 else "\"%s\"") % line[i])
		await T.say("", boxes)
		return
	await T.say("", "Hesper's voice, in your head: \"%s\"" % line)


## The design's line the first time; after that the quest's own line (script), as Chapter 1's _praise.
func _praise2(T, tier: String, quest: String) -> void:
	if tier == "first":
		var line := "That's it. And you could tell me why, which is the part that counts."
		if T.flag("praised2", false):
			line = str(Ch2.PRAISE[quest])
		T.set_flag("praised2", true)
		if T.world.map.id == "cottage":
			await T.say("hesper", line)
		else:
			await _voice(T, line)


func _worse(a: String, b: String) -> String:
	return a if TIER_ORDER.find(a) >= TIER_ORDER.find(b) else b


func _hint2(quest: String) -> String:
	return Ch2.HINT_LESSON if quest == "lesson2" else str(Ch2.HINT.get(quest, ""))


## A typed value check in Chapter 2: its label, named errors and the quest's hint come from ch2.gd.
func _f2(T, key: String, quest: String, prompt: String, answer: Array, extra := {}) -> String:
	var q: Array = QUEST2[quest]
	var o := {"key": key, "label": Ch2.label(key) if Ch2.LABEL.has(key) else key, "title": q[0], "kicker": q[1], "prompt": prompt, "answer": answer,
		"hint_btn": _hint(), "traps": Ch2.TRAPS.get(key, [])}
	if _hint2(quest) != "":
		o.hint = _hint2(quest)
	if Ch2.TRAPS.has(key):
		o.bot_wrong = str(Ch2.TRAPS[key][0][0]).replace("−", "-")
	o.merge(extra, true)
	return await T.frac(o)


## A power-card check in Chapter 2. Returns the card's { tier, typed }.
func _card2(T, key: String, quest: String, prompt: String, cards: Array, extra := {}) -> Dictionary:
	var q: Array = QUEST2[quest]
	var o := {"key": key, "label": Ch2.label(key) if Ch2.LABEL.has(key) else key, "title": q[0], "kicker": q[1], "prompt": prompt, "cards": cards,
		"hint_btn": _hint()}
	if _hint2(quest) != "":
		o.hint = _hint2(quest)
	o.merge(extra, true)
	return await Pn.power_card(T, o)


func _where2(pid: String, S: Dictionary) -> Variant:
	var f: Dictionary = S.flags
	var q := str(f.get("quest", ""))
	match pid:
		"hesper":
			if q in ["jar", "sigil2"]:   # at her seed bed beside the cottage
				return {"map": "brindle", "x": 18, "y": 37, "dir": "up"}
			return {"map": "cottage", "x": 4, "y": 3, "dir": "down"}
		"orrin":
			if f.get("rune2_broken", false):
				return {"map": "cottage", "x": 6, "y": 3, "dir": "left"}
			if f.get("boulder_done", false):   # he walks on with you to the vault (beside Gale in the open west end of the yard, clear of the one-tile corridor and the hay-stack strip)
				return {"map": "highstead", "x": 38, "y": 8, "dir": "right"}
			if f.get("boulder_here", false):
				return {"map": "highstead", "x": 17, "y": 33, "dir": "right"}
			return null
		"pell":
			match q:
				"lesson2":
					return {"map": "cottage", "x": 2, "y": 3, "dir": "down"}
				"tally":
					return {"map": "brindle", "x": 33, "y": 36, "dir": "right"}
				"cure":
					return {"map": "brindle", "x": 10, "y": 12, "dir": "left"}
				"moths":
					return {"map": "mill", "x": 3, "y": 4, "dir": "right"}
				"nests":
					return {"map": "brindle", "x": 27, "y": 30, "dir": "left"}
				"jar":
					return {"map": "brindle", "x": 16, "y": 35, "dir": "right"}
				"vine":
					return {"map": "brindle", "x": 13, "y": 24, "dir": "left"}
			return {"map": "brindle", "x": 19, "y": 29, "dir": "down"}
		"odile":
			return {"map": "brindle", "x": 36, "y": 36, "dir": "left"}
		"abel":
			return {"map": "mill", "x": 4, "y": 3, "dir": "down"}
		"gale":
			if f.get("at_vault", false):
				return {"map": "highstead", "x": 39, "y": 8, "dir": "right"}
			return {"map": "highstead", "x": 32, "y": 21, "dir": "left"}
		"sefa":
			if f.get("at_vault", false) and not f.get("sefa2_gone", false):
				return {"map": "highstead", "x": 48, "y": 11, "dir": "up"}
			return null
		"bram":
			if f.get("boulder_done", false):   # by his cart outside the common barn, for his second look
				return {"map": "brindle", "x": 39, "y": 36, "dir": "left"}
			if f.get("boulder_here", false):
				return {"map": "highstead", "x": 20, "y": 34, "dir": "left"}
			return null
	return null


func _hud2(S: Dictionary) -> Array:
	var out := [{"label": "Chapter 2", "value": "The Blight"}]
	var done := 0
	for k in ["tally_done", "cure_done", "moths_done", "nests_done", "jar_done", "boulder_done"]:
		if S.flags.get(k, false):
			done += 1
	out.append({"label": "Quests", "value": "%d of 6" % done})
	if S.flags.get("sigil2", false):
		out.append({"label": "Growth", "value": Ch2.pip_text(Ch2.pips(S))})
	return out


func _journal2(S: Dictionary) -> Array:
	var out := []
	if S.flags.get("sigil2", false):
		var n := Ch2.pips(S)
		out.append(["THE GROWTH SIGIL", "Charge %s (%d of 6). First-try answers charge it; so does each green-gold star solved on the first try. %s" % [
			Ch2.pip_text(n), n, "All six pips reach Orrin's window." if not S.flags.get("growth_window", false) else "You have looked in at Orrin's window."]])
		out.append(["SECOND LOOKS", "Missed a pip? A gold ? over someone you helped means a second look: the same skill, new numbers. Right first time wins the pip back."])
	if S.flags.get("balance_lent", false):
		out.append(["THE BALANCE SIGIL", "Lent by Hesper. Balance freezes and thaws by adding and taking away."])
	return out


# ── 0. Starting here with no Chapter 1 save ──
func ch2_recap(T) -> void:
	if not T.flag("balance_lent", false) or T.flag("recap_done", false):
		return
	await T.say("", "Brindle Ford, late in the harvest. You are {name}, apprentice to the hedge-witch Hesper Marrow.")
	await T.say("hesper", ["Three lines, since you slept through the first part. The old magic is coming undone: bridges, wells, the grain-share stone.",
		"You can see the gold lines of it, and you mended that stone with true fractions. Orrin Vael, a Warden, is watching you.",
		"I've lent you the Balance sigil until you earn your own. Now, up. Something is wrong in the north field."])
	T.remember("hesper", "She took you on as her apprentice.", 2)
	T.log_line("Hesper lent me the Balance sigil. Balance freezes and thaws by adding and taking away.")
	T.set_flag("recap_done", true)


# ── 1. Opening: grey on the stubble ──
func ch2_open(T) -> void:
	if T.flag("ch2_opened", false):
		return
	T.banner("Chapter 2", "The Blight")
	await T.say("", "A few weeks after the grain-share stone. The mornings have turned sharp.")
	await T.say("pell", ["{name}! {name}, come and look! The stubble in the north field's gone grey. All of it. Overnight!",
		"And there are moths on the grain sacks. Grey ones. They don't fly off when you wave at them."])
	await T.say("", "Hesper walks out to the field edge and snaps off a stalk. It crumbles like ash.")
	await T.say("hesper", ["Blight.", "It spreads the way everything living spreads: not a bit more each day, but so many [b]times[/b] more."])
	await T.say("pell", "Can you stop it?")
	await T.say("hesper", ["I have one answer. Cure-moss. It eats blight, and it spreads the same way the blight does.",
		"And we will need clean seed from the Highstead vault before the snow.", "One thing at a time. First you learn how growing is counted."])
	T.log_line("Blight in the north field and grey moths in the barn. Hesper says it spreads by multiplying.")
	T.set_flag("ch2_opened", true)


# ── 2. The lesson: the spell-seed (PE1) ──
func lesson2(T) -> void:
	if T.flag("lesson2_done", false):
		return
	T.set_flag("quest", "lesson2")
	T.refresh()
	await T.goal("Go to Hesper's cottage. She has something on the windowsill.", "map:cottage")
	await T.say("hesper", "One spell-seed, in one pot. It splits in two every night. Watch.")
	await Pn.seed_example(T)
	await T.say("hesper", ["After five nights: 2 × 2 × 2 × 2 × 2. Too long to write, so we write 2⁵.",
		"The 2 is the [b]base[/b], the thing that repeats. The 5 is the [b]exponent[/b]: how many 2s.", "2⁵ is 32 seeds."])
	await T.say("pell", "2⁵. Two fives. Ten.")
	await T.say("hesper", "{name}? Is he right?")
	await T.ask("hesper", Ch2.ASK_LESSON, "pe1_lesson", Ch2.label("pe1_lesson"))
	var t := await _f2(T, "pe1_seeds", "lesson2", "One more night on the sill. How many seeds after six nights?", Ch2.seeds(), {"why": Ch2.WHY_LESSON.pe1_seeds})
	await _praise2(T, t, "lesson2")
	await T.say("hesper", ["Now the hen-house. My turnabout charm airs it: warm to cold and back, twice as strong each turn.",
		"Every turn multiplies by −2. Start from 1: −2, then 4, then −8, then 16."])
	await T.say("pell", "Five turns… 32. The negatives cancel.")
	await _f2(T, "pe1_turn", "lesson2", "Do they all? {name}, what is [b](−2)⁵[/b]?", Ch2.turn(), {"why": Ch2.WHY_LESSON.pe1_turn})
	await T.say("", "Pell chalks four turns on the hen-house door: −2⁴. \"Sixteen,\" he says.")
	await _f2(T, "pe1_brackets", "lesson2", "Read what he wrote, not what he meant. As Pell wrote it, with no brackets, what is [b]−2⁴[/b]?", Ch2.brackets(), {"why": Ch2.WHY_LESSON.pe1_brackets})
	await T.say("pell", "But I meant the other one!")
	await T.say("hesper", "Then write the other one. {name}, tell him the difference.")
	if not T.S.typed.has("pe1_pell"):
		await T.typed({"id": "pe1_pell", "title": "Explain it to Pell", "kicker": "In your own words", "min": 30,
			"prompt": "Explain to Pell, in your own words, why [b]−2⁴[/b] and [b](−2)⁴[/b] are different.",
			"bot": "Test player: in −2⁴ only the 2 is the base, so it is −16; in (−2)⁴ the base is −2, so it is 16."})
	await T.say("hesper", ["Good. Base, exponent, and mind your brackets. That's the whole of counting growth.",
		"Odile is at the common barn with a tally board she can't finish. Start there, when your notes are ready."])
	T.log_line("A power: the base repeats, the exponent counts how many. 2⁵ = 32. (−2)⁴ = 16 but −2⁴ = −16.")
	T.set_flag("lesson2_done", true)
	T.set_flag("quest", "")


# ── 4. The moss tally (PE2) ──
func tally(T) -> void:
	if T.flag("tally_done", false):
		return
	T.set_flag("quest", "tally")
	T.refresh()
	await T.goal("Find Reeve Odile at the tally board outside the common barn.", "person:odile")
	await T.say("odile", ["{name}. Good. Hesper's cure-moss on the common field triples every day, and the village wants it written down.",
		"I have day 4 and day 3. Eighty-one patches, then twenty-seven. I need the rest, back to the day she planted it."])
	await T.say("pell", "Day 0? Nought days, nought moss. Write a zero.")
	await T.say("odile", "That's what I'd have put. But Hesper planted [i]something[/i].")
	await Pn.pattern(T, {"title": "The tally board", "kicker": "Quest · PE2", "prompt": "Odile's board, newest first.", "base": 3, "rows": Ch2.TALLY_ROWS,
		"hint": Ch2.HINT.tally, "hint_btn": _hint()})
	await T.say("odile", "Nine, then three. And each one a third of the row above. Go on. Day 0.")
	var t := await _f2(T, "pe2_day0", "tally", "[b]Day 0[/b], which is 3⁰ = ?", Ch2.day0(), {"why": Ch2.WHY.tally})
	await T.say("odile", ["The mill yard gets a different moss. It grows five times a day.", "Abel's slate says Day 2: 25 · Day 1: 5. What goes on day 0?"])
	await _f2(T, "pe2_other", "tally", "Day 2: 25 · Day 1: 5 · Day 0, which is 5⁰ = ?", Ch2.other_moss())
	await T.say("odile", "The same again. Why?")
	await T.ask("odile", Ch2.ASK_TALLY_WHY, "pe2_why", Ch2.label("pe2_why"))
	await T.say("pell", "What about Hesper's turnabout seeds? Base minus fifteen, exponent nought. That has to be minus one.")
	await T.say("odile", "Don't look at me. {name}?")
	await _f2(T, "pe2_negzero", "tally", "(−15)⁰ = ?", Ch2.negzero(),
		{"why": "(−15)¹ = −15. One step back divides by −15: (−15) ÷ (−15) = 1. Any base but 0 gives 1."})
	await T.say("pell", "One again. Even for a minus.")
	await T.say("", "Odile chalks in the last row: 1 patch, H. Marrow.")
	await T.say("odile", "One patch. And in four days it's eighty-one. I'd like my hens to do that.")
	await _praise2(T, t, "tally")
	T.remember("odile", "", 2)
	T.log_line("Any base to the exponent 0 is 1. Each day back divides by the base, and the base ÷ itself is 1.")
	T.set_flag("tally_done", true)
	T.set_flag("quest", "")


# ── 5. The blight cure (PE3) ──
func cure(T) -> void:
	if T.flag("cure_done", false):
		return
	T.set_flag("quest", "cure")
	T.refresh()
	await T.goal("Rowan Tull is at the fold's pasture. The blight has reached the grass.", "person:rowan")
	await T.say("rowan", ["About five hundred grey spots, near as I can count. The lambs won't touch the grass.",
		"I put down one patch of Hesper's moss. It doubles every day, and it's had six days.", "Hesper says the frost comes in three more. Will there be enough patches by then?"])
	await T.say("pell", "Six days, then three more. Two to the… eighteen? Six times three.")
	await T.say("rowan", "Eighteen what?")
	var r := await _card2(T, "pe3_cure", "cure", "Write the six days and the three days as one power of 2.", [Ch2.CARD_CURE], {"why": Ch2.WHY.cure})
	await T.say("rowan", "And in plain patches?")
	await _f2(T, "pe3_value", "cure", "[b]2⁹[/b] = ? patches", Ch2.cure_value(), {"why": Ch2.WHY.cure})
	await T.ask("rowan", Ch2.ASK_CURE_ENOUGH)
	await T.say("rowan", ["Just. I'll take just.", "One more. My far bed has 2³ rows, with 3² patches in each row."])
	await T.say("pell", "2³ × 3². Same trick: 6⁵!")
	await T.ask("rowan", Ch2.ASK_BASES, "pe3_bases", Ch2.label("pe3_bases"))
	T.set_flag("cure_done", true)
	T.rebuild_maps()
	await T.say("", "Three days on, green moss has spread over the grey. Rowan opens the fold gate.")
	await T.say("rowan", "Five hundred and twelve. I counted. Go on, girls, eat.")
	await T.say("", "The lambs go back on the grass.")
	await _praise2(T, str(r.tier), "cure")
	T.remember("rowan", "", 2)
	T.log_line("Same base, multiplying: add the exponents. 2⁶ × 2³ = 2⁹. Different bases: work each power out.")
	T.set_flag("quest", "")


# ── 6. Hollow-moths at the mill (PE4) ──
func moths(T) -> void:
	if T.flag("moths_done", false):
		return
	T.set_flag("quest", "moths")
	T.refresh()
	await T.goal("Abel Crane wants you at the mill. Bring Hesper's moth-smoke.", "person:abel")
	await T.say("abel", ["In here. Mind the step.", "Look at them. Grey as ash and they don't mind the light. They weren't here before that grey-cloak came through."])
	await _voice(T, "I counted them by threes. The mill holds 3⁷ moths. One pot of my smoke clears 3⁴.")
	await T.say("abel", "So how many pots do I light?")
	await T.say("pell", "Seven divided by four doesn't even go. So… three to the eleven?")
	var r := await _card2(T, "pe4_moths", "moths", "So how many pots do I light?", [Ch2.CARD_MOTHS], {"why": Ch2.WHY.moths})
	await _f2(T, "pe4_pots", "moths", "And in pots a miller can count? [b]3³[/b] = ?", Ch2.pots(), {"why": Ch2.WHY.moths})
	await T.say("abel", "The grain nook's smaller. Hesper made it 3⁴ moths in there.")
	var a := await _card2(T, "pe4_equal", "moths", "Pots for the nook:", [Ch2.CARD_NOOK], {"record": false})
	var b := await _f2(T, "pe4_equal", "moths", "How many pots is that? [b]3⁰[/b] = ?", Ch2.nook(), {"record": false})
	T.record("pe4_equal", Ch2.label("pe4_equal"), _worse(str(a.tier), b))   # the card and the value, one row
	await T.say("abel", "Subtracting, for a dividing sum. Why does that work?")
	await T.ask("abel", Ch2.ASK_MOTHS_WHY, "pe4_why", Ch2.label("pe4_why"))
	T.set_flag("moths_done", true)
	T.rebuild_maps()
	await T.say("", ["You light the pots three at a time until all twenty-seven have burned.", "The moths pour out of the window in a long grey ribbon."])
	await T.say("abel", "Good riddance. Though I'd like to know where they're going.")
	await _praise2(T, str(r.tier), "moths")
	T.remember("abel", "", 2)
	T.log_line("Same base, dividing: subtract the exponents. 3⁷ ÷ 3⁴ = 3³. And 3⁴ ÷ 3⁴ = 3⁰ = 1.")
	T.set_flag("quest", "")


# ── 7. The nests in the well-house (PE5) ──
func nests(T) -> void:
	if T.flag("nests_done", false):
		return
	T.set_flag("quest", "nests")
	T.refresh()
	await T.goal("Marta Fenn says the moths from the mill are in her well-house roof.", "person:marta")
	await T.say("marta", ["{name}! They've nested. Up there, in the roof, grey lumps like wet paper.",
		"I can't light smoke by the well for four nights. The water's being drawn for the whole village."])
	await _voice(T, ["I watched one nest. They hatch twice a night, and each hatching triples them.", "So the swarm grows 3² times every night."])
	await T.say("marta", "Four nights of that. How many times bigger?")
	await T.say("pell", "Three squared, four times over. Two and four… 3⁶.")
	var r := await _card2(T, "pe5_nest", "nests", "Four nights of that. How many times bigger?", [Ch2.CARD_NEST], {"why": Ch2.WHY.nests})
	await _card2(T, "pe5_pair", "nests", "Abel has sent his slate over with two sums on it: 3² × 3⁴, two swarms multiplied, and (3²)⁴, one swarm for four nights.",
		Ch2.CARD_PAIR, {"pair_line": Ch2.PAIR_SWAPPED, "bot_wrong": [Ch2.CARD_PAIR[1].answer, Ch2.CARD_PAIR[0].answer]})
	await _voice(T, ["A thought for the moss.", "I can feed it to double three times a day for four days, or four times a day for three days."])
	await T.ask("hesper", Ch2.ASK_SAME, "pe5_same", Ch2.label("pe5_same"))
	T.set_flag("nests_done", true)
	T.rebuild_maps()
	await T.say("", "You tell Marta: 3⁸. Six thousand five hundred and sixty-one times bigger.")
	await T.say("marta", "Six thousand times? Then we don't wait.")
	await T.say("", "She and Pell carry the well bucket out, and the roof is smoked that evening.")
	await _praise2(T, str(r.tier), "nests")
	T.remember("marta", "", 2)
	T.log_line("A power of a power: multiply the exponents. (3²)⁴ = 3⁸. Not the same as 3² × 3⁴ = 3⁶.")
	T.set_flag("quest", "")


# ── 8. Pell's spell jar (PE6) ──
func jar(T) -> void:
	if T.flag("jar_done", false):
		return
	T.set_flag("quest", "jar")
	T.refresh()
	await T.goal("Pell is at Hesper's seed bed with a jar, looking pleased.", "person:pell")
	await T.say("pell", ["Done! Hesper wanted the square bed filled for the winter herbs. Each side is 2 trays of 3 pots.",
		"So I fetched 2 × 3² seeds. Bed's full. Well. It will be."])
	await T.ask("hesper", Ch2.ASK_JAR, "pe6_predict", Ch2.label("pe6_predict"))
	var t := await _f2(T, "pe6_jar", "jar", "Then how many pots are in the bed? [b](2 × 3)²[/b] = ?", Ch2.jar(), {"why": Ch2.WHY.jar})
	await T.say("", "Pell counts his jar twice. Eighteen. He is 18 seeds short.")
	await _card2(T, "pe6_coef", "jar", "My seed crates are cubes, 2x hands along each edge, where x is the width of one pot. The volume?", [Ch2.CARD_CRATE],
		{"hint": "Hesper: \"Write (2x) three times and multiply. How many 2s? How many x's?\"", "why": "(2x)³ = 2x × 2x × 2x = 2 × 2 × 2 × x × x × x = 8x³."})
	await _f2(T, "pe6_quot", "jar", "The small bed by the door is square too, ⅔ of a pace on each side. What fraction of a square pace is that?", Ch2.small_bed(),
		{"hint": "Hesper: \"Squaring means times itself. Multiply ⅔ by ⅔: tops together, bottoms together.\"", "why": "(⅔)² = ⅔ × ⅔ = 4⁄9."})
	await T.say("pell", "Fine. A new bed, then. 3 + 4 pots on a side. That's 3² + 4² pots.")
	await T.ask("hesper", Ch2.ASK_SUM, "pe6_sum", Ch2.label("pe6_sum"))
	await T.say("pell", "Forty-nine. Not twenty-five.")
	await T.say("hesper", "Go and fetch the other eighteen for the first bed before you plan a second.")
	await T.say("", "Pell goes, counting on his fingers.")
	await _praise2(T, t, "jar")
	T.log_line("An exponent on brackets goes to every factor: (2 × 3)² = 2² × 3². It does not spread over + or −.")
	T.set_flag("jar_done", true)
	T.set_flag("quest", "")


# ── 9. The boulder on the road (PE7) ──
func boulder(T) -> void:
	if T.flag("boulder_done", false):
		return
	T.set_flag("quest", "boulder")
	if not T.flag("boulder_here", false):
		await T.say("hesper", ["The beds are ready and the seed isn't. Take the Low Road to Highstead and ask Gale Harrow for vault seed.",
			"There's been a rock-fall on the road, I hear. Take this."])
		await T.say("", "She ties a tag to your wrist. On it, in her small hand: 2⁻³.")
		T.set_flag("boulder_here", true)
		T.rebuild_maps()
	T.refresh()
	await T.goal("Take the Low Road toward Highstead.", "person:bram")
	await T.say("", ["A boulder taller than you are sits square across the Low Road.", "A loaded seed cart waits behind a patient horse. Orrin Vael stands beside the rock, looking up at the gorge edge."])
	await T.say("bram", ["Bram Ostler, carter. Seed for the Ford, if I could get it there. Came down from the gorge edge in the night.",
		"What's that on your wrist? Minus three? You'll make it [i]minus[/i] a boulder? What's that, a hole?"])
	await T.ask("orrin", Ch2.ASK_BOULDER, "pe7_predict", Ch2.label("pe7_predict"))
	await Pn.pattern(T, {"title": "The boulder on the road", "kicker": "Quest · PE7", "prompt": "Show the carter. Start from what he knows.", "base": 2,
		"rows": Ch2.BOARD_ROWS, "hint": Ch2.HINT.boulder, "hint_btn": _hint(), "bot_wrong": {3: "0", 4: "-2", 5: "-4"}})
	var t := await _f2(T, "pe7_boulder", "boulder", "[b]2⁻³[/b] = ?", Ch2.boulder(), {"why": Ch2.WHY.boulder})
	await T.say("bram", "It weighs ninety-six stone if it weighs a pound. What's an eighth of that?")
	await _f2(T, "pe7_weight", "boulder", "[b]96 × ⅛[/b] = ? stone", Ch2.weight())
	await T.say("bram", "Twelve stone. Old Bess can drag fifteen.")
	var q: Dictionary = await T.ask("orrin", Ch2.ASK_NEGBASE)
	var v := await _f2(T, "pe7_negbase", "boulder", "Then what is [b](−2)⁻³[/b]?", Ch2.negbase(), {"record": false})
	T.record("pe7_negbase", Ch2.label("pe7_negbase"), _worse(str(q.tier), v))   # the question and the value, one row
	await T.say("bram", ["While you're at it. Hesper shrank my seed sacks for the road, to a third and a third again.",
		"The tag to undo it says (⅓)⁻². How many times bigger will they get?"])
	await T.say("pell", "A third, and a minus. So, minus a ninth?")
	await _f2(T, "pe7_flip", "boulder", "(⅓)⁻² = ?", Ch2.flip(), {"hint": "Hesper: \"A negative exponent means 1 over. What is 1 over ⅓? Then square it.\"",
		"why": "(⅓)⁻² = 1 ÷ (⅓)² = 1 ÷ 1⁄9 = 9. Or flip first: 3² = 9."})
	await T.say("", "The sacks swell back to full size on the cart bed.")
	await T.say("bram", "Nine times. That's my seed back.")
	await T.say("", "You cast the charm. The boulder folds in on itself, halving, halving, halving, to the size of a hay bale.")
	T.set_flag("boulder_done", true)
	T.rebuild_maps()
	await T.say("", "Bram's horse drags it onto the verge. The cart rolls through.")
	await T.say("bram", "A hole, I said. Shows what I know. Good day to you, apprentice.")
	await T.say("orrin", "I'm for Highstead too. Walk with me.")
	await _praise2(T, t, "boulder")
	T.remember("bram", "", 2)
	T.log_line("A negative exponent is 1 over the power: 2⁻³ = 1⁄2³ = ⅛. Small and positive, not negative.")
	T.set_flag("quest", "")


# ── 10. The seed vault: the false rune (PE2 + PE7) ──
func vault(T) -> void:
	if T.flag("rune2_broken", false):
		return
	var R: Dictionary = T.S.pe
	var goal := "Go on to Highstead. Gale Harrow keeps the seed vault in the grain-tower yard."
	T.set_flag("quest", "vault")
	T.set_flag("at_vault", true)
	T.refresh()
	if not T.flag("sigil_gate", false):   # the tower-yard gate is still frozen: thaw it with Balance on the way in
		await T.goal(goal, "thing:spot_gate")
		await T.say("", "The gate to the tower yard is frozen shut. There's a gold ring in front of it.")
		await _spot(T, "spot_gate", true)
	await T.goal(goal, "person:gale")
	if not T.flag("vault_told", false):
		await T.say("gale", ["Hesper's apprentice. And a Warden. You'll want seed, and I can't give you any.",
			"The vault has a weighing lock. Every season the dial steps down one, and I put its value on the pan in seed-weights.",
			"The stone says nought. So I put nothing on the pan, and the door won't move.", "Next season it says minus three. How do I weigh out minus three?"])
		await T.say("", "Grey lines crawl over the last three lines of the stone. At the yard fence, a figure in a grey cloak is watching.")
		T.set_flag("vault_told", true)
	while not T.flag("rune2_broken", false):
		var stage := int(R.rune_stage)
		if _test_stop2(T, "%d%s" % [stage, "b" if int(R.rune_losses) > 0 else ""]):
			await T.get_tree().create_timer(3600).timeout   # never returns before the program quits
		if stage == 1:
			await T.ask("orrin", Ch2.ASK_RUNE_PREDICT, "rune2_predict", Ch2.label("rune2_predict"))
			R.rune_stage = 2
			T.save()
		elif stage == 2:
			await _rune2_test(T)
			R.rune_stage = 3
			T.save()
		else:
			if await _rune2_fix(T):
				break
			R.rune_losses = int(R.rune_losses) + 1
			T.save()
			await T.say("", "The grey lines thicken. The pan swings empty and the stone goes cold under your hand.")
			if int(R.rune_losses) >= 2:
				await _rune2_worked(T)
				break
			await T.say("orrin", "What do you do to get from one line to the next?")
	await _rune2_breaks(T)


## Test option rune_stop=1|2|3|3b at the vault (as Chapter 1's rune): save and quit at that stage.
func _test_stop2(T, at: String) -> bool:
	if T.args.get("rune_stop", "") != at:
		return false
	T.save()
	print("STOPPED-AT rune2:%s losses=%d" % [at, int(T.S.pe.rune_losses)])
	T.get_tree().quit()
	return true


## Stage 2: the dividing ladder with the pan, then the second route (3³ ÷ 3³ and its exponent). Steps, not recorded.
func _rune2_test(T) -> void:
	await Pn.pattern(T, {"title": "The dividing ladder", "kicker": "The seed vault · Stage 2", "prompt": "Now test it. One rung at a time, and watch the pan.",
		"base": 3, "rows": Ch2.RUNE_ROWS, "stone": Ch2.RUNE_STONE, "pan": true, "bot_wrong": {3: "0", 4: "-3", 5: "-9"}})
	await T.frac({"key": "rune2_route", "record": false, "title": "The dividing ladder", "kicker": "The seed vault · Stage 2",
		"prompt": "Another way to the same place. What is [b]3³ ÷ 3³[/b]?", "answer": Ch2.route2()})
	await Pn.power_card(T, {"record": false, "title": "The dividing ladder", "kicker": "The seed vault · Stage 2",
		"prompt": "And by the quotient law, what is its exponent?", "cards": [Ch2.CARD_ROUTE2]})
	await T.say("", "With one weight on the pan, the lock tips a hair.")


## Stage 3: explain, the plain words for the vault book, then the two fixes. True when all four lines are cut right.
func _rune2_fix(T) -> bool:
	await T.ask("orrin", Ch2.ASK_RUNE_EXPLAIN, "rune2_explain", Ch2.label("rune2_explain"))
	if not T.S.typed.has("rune2_why"):
		await T.say("gale", "I'll want it in plain words for the vault book. Why is 3⁰ equal to 1 and not 0?")
		await T.typed({"id": "rune2_why", "title": "For the vault book", "kicker": "In your own words", "min": 40,
			"prompt": "Gale wants it in plain words for the vault book. Why is [b]3⁰[/b] equal to 1 and not 0?",
			"bot": "Test player: each line down divides by 3, and 3 ÷ 3 is 1, so 3⁰ is 1. Nought would break the pattern."})
	await T.say("orrin", "Now cut the true lines.")
	var fx := Ch2.fixes()
	for k in ["pe2_rune_fix", "pe7_rune_fix", "pe2_rune_fix2", "pe7_rune_fix2"]:
		if k == "pe2_rune_fix2":
			await T.say("", "The outer stone settles. Inside the arch there is a second stone, in fours: 4⁰ = 0 · 4⁻² = −16.")
		var what: String = {"pe2_rune_fix": "3⁰", "pe7_rune_fix": "3⁻²", "pe2_rune_fix2": "4⁰", "pe7_rune_fix2": "4⁻²"}[k]
		var t: String = await T.frac({"key": k, "label": Ch2.label(k), "title": "The seed vault", "kicker": "The seed vault · Fix", "lose": true,
			"prompt": "[b]%s[/b] = ?" % what, "answer": fx[k], "traps": Ch2.FIX_TRAPS[k], "hint_btn": _hint(), "hint": Ch2.FIX_HINT, "why": Ch2.FIX_WHY[k],
			"bot_wrong": {"pe2_rune_fix": "0", "pe7_rune_fix": "-9", "pe2_rune_fix2": "0", "pe7_rune_fix2": "-16"}[k]})
		if t == "lost":
			return false
	return true


## After a second flare: Hesper's worked ladder, and the fixes recorded as shown.
func _rune2_worked(T) -> void:
	await _voice(T, ["Slowly, with me. 27, 9, 3: each is the one above divided by 3.", "Then 1. Then ⅓. Then 1⁄9."])
	await T.say("", "The lines come right under your hand as she says them.")
	for k in Ch2.fixes():
		T.record(k, Ch2.label(k), "later")


func _rune2_breaks(T) -> void:
	var R: Dictionary = T.S.pe
	if not T.flag("rune2_broken", false):
		T.set_flag("rune2_broken", true)
		R.rune_result = "first attempt" if int(R.rune_losses) == 0 else ("after %d flare%s" % [R.rune_losses, "" if int(R.rune_losses) == 1 else "s"])
		T.rebuild_maps()
		T.ui.confetti(70)
		T.banner("The false rune breaks", "3⁰ = 1")
	await T.say("", "The carving cracks with a gold flash and cuts itself again: 1, ⅓, 1⁄9.")
	await T.say("", "Gale sets one weight on the pan. The door swings in on racks of seed sacks.")
	await T.say("gale", "One. All this for one.")
	await T.say("orrin", "It usually is.")
	await T.say("", "Orrin picks a chip of stone from under the dial and holds it beside the chip from the grain-share stone.")
	await T.say("orrin", "Same hand.")
	await T.say("", "He says no more, and hands the new chip to you. \"Keep them together.\"")
	if not T.has("chip2"):
		T.give("chip2")
	if not T.flag("sefa2_gone", false):
		await T.say("", "The figure at the fence has not run. They are looking at the open door.")
		var i: int = await T.choose("", "", ["Call out: \"Wait. Did you carve this?\"", "Hold up a chip of the stone and say nothing", "Let them go."])
		var pick: String = ["call", "chip", "go"][i]
		T.set_flag("sefa_ch2", pick)
		await T.say("", {"call": "The figure stops for one breath, half turned. Then the grey cloak is gone between the towers.",
			"chip": "The figure looks at the chip in your hand for a long moment. Then the grey cloak is gone between the towers.",
			"go": "You watch the grey cloak go, between the towers and out of sight."}[pick])
		T.set_flag("sefa2_gone", true)
		T.refresh()
	await T.say("gale", "Take two sacks. Tell Hesper the vault owes her.")
	if not T.flag("rune2_logged", false):
		T.set_flag("rune2_logged", true)
		T.log_line("The vault stone said 3⁰ = 0 and 3⁻¹ = −3. True lines: 1, ⅓, 1⁄9. Each step down divides by 3.")
		if str(T.flag("sefa_ch2", "")) in ["call", "chip"]:
			T.log_line("The grey-cloak saw me see them.")
	T.remember("gale", "", 2)
	T.remember("orrin", "", 2)
	T.set_flag("quest", "")


# ── 11. The Growth sigil ──
func sigil2(T) -> void:
	if T.flag("sigil2", false):
		return
	T.set_flag("quest", "sigil2")
	T.refresh()
	await T.goal("Carry the vault seed home to Hesper's seed bed.", "person:hesper")
	await T.say("hesper", "Vault seed. Put the first one in yourself. Go on.")
	await T.say("", "You press the seed into the pot. Green-gold light runs up your arm and settles on the back of your other hand.")
	T.set_flag("sigil2", true)
	T.give("growth")
	T.rebuild_maps()
	T.banner("The Growth sigil", "Make things double, triple or shrink by powers.")
	T.confetti()
	await T.say("hesper", ["Growth. Name a base and an exponent, and a living thing will follow it. Up for growing, below nought for shrinking.",
		"Nought changes nothing, as you know better than the vault stone did.", "There are green-gold stars where it's wanted. Mind you count before you cast."])
	await T.say("hesper", "Your Growth is charged %s. There are green-gold stars by the fold hedge and in the tower yard at Highstead, if you want the practice." % Ch2.pip_text(Ch2.pips(T.S)))
	if Ch2.first_pips(T.S) < Ch2.PIPS:
		await T.say("hesper", ["Missed a pip? Look for a gold ? over anyone you helped.", "That's a second look: the same skill with new numbers. Right first time wins the pip back."])
	T.log_line("I have the Growth sigil. At a green-gold star: choose the exponent. Positive grows, negative shrinks, 0 changes nothing.")
	T.set_flag("quest", "")


# ── 12. First use and the cat ──
func vine(T) -> void:
	if T.flag("cat", false):
		return
	T.set_flag("quest", "vine")
	T.refresh()
	if not T.flag("vine_told", false):
		await T.say("", "The next morning.")
		await T.say("pell", "{name}! There's a cat crying on the ledge over the mill pond. It's been there all night. Nobody can reach it.")
		T.set_flag("vine_told", true)
	var goal := "Cross the mill pond and reach the ledge on the far side."
	if not T.flag("sigil_pond", false):
		await T.goal(goal, "thing:spot_pond")
		await _spot(T, "spot_pond", true)
	await T.goal(goal, "thing:growth_ledge")
	if not T.flag("growth_ledge", false):
		await _gspot(T, "growth_ledge", true)
	await T.say("", ["The vine climbs the rock, doubling and doubling, and curls over the ledge.",
		"Before you can set a foot on it, a small black cat with gold eyes walks down the vine by itself.", "It sits on your boots."])
	await T.say("pell", "It likes you. You have to name it. Those are the rules.")
	var nm := await Pn.name_box(T, "Name the cat", "Soot")
	T.set_flag("cat_name", nm)
	T.set_flag("cat", true)
	T.rebuild_maps()
	T.refresh()
	await T.say("", _c(T, "{cat} follows you home, as if this had always been the plan."))
	T.log_line(_c(T, "A cat came down my first vine. {cat} follows me now."))
	T.set_flag("quest", "")


# ── 13. Chapter end ──
func chapter_end2(T) -> void:
	if T.args.has("spots"):   # test option: use every Growth spot once
		for sid in ["growth_hedge", "growth_vault", "growth_window"]:
			await _gspot(T, sid, false)
	if T.flag("ch2_done", false):
		return
	await T.goal("Walk home to Hesper's cottage.", "map:cottage")
	await T.say("hesper", "The field is green, the mill is clear, and there's seed in the ground. Not a bad month's work, {name}.")
	await T.say("orrin", ["Two stones, one hand. And whoever carves them wants us to see the gorge.",
		"The top of the bank above the vault looks over the broken bridge. When you can grow a vine that high, look."])
	await T.say("hesper", "That's for another day. Tonight, soup.")
	T.set_flag("ch2_done", true)
	T.banner("Chapter 2 complete", "The Blight")
	T.confetti()
	await T.say("", "End of Chapter 2: The Blight.")
	await T.say("", "Open the Menu and download your report for your teacher.")
	if T.auto != "" and str(T.args.get("looks", "")) != "0":
		await _auto_looks2(T)


## A Growth spot (design §8): a base, where things stand, what is needed; the student types the exponent on a power card.
## story: the vine step's first use (fixed numbers: 1 hand doubling to 32). Three tries, then Hesper says it and it works anyway.
func _gspot(T, sid: String, story: bool) -> void:
	var S: Dictionary = T.S
	var R: Dictionary = S.pe
	var sp: Dictionary = Ch2.SPOTS[sid]
	var solved := bool(T.flag(sp.flag, false))
	if sid == "growth_window" and not solved and Ch2.pips(S) < Ch2.PIPS:
		await T.say("", "A green-gold star, faint, high on the tower's west wall. Your Growth isn't charged enough to reach it.")
		return
	if solved and not story and T.auto == "":
		if await T.choose("", "%s already holds. Practise Growth here anyway?" % sp.what, ["Practise", "Leave it"]) != 0:
			return
	var visit := int(R.spot_visits.get(sid, 0))
	R.spot_visits[sid] = visit + 1
	var nums: Dictionary = Ch2.first_vine() if story and sid == "growth_ledge" else Ch2.spot_numbers(sid, visit, int(S.seed))
	var a := int(nums.answer)
	var sg := 1 if a > 0 else -1
	var card := {"expr": "", "base": str(int(nums.b)), "answer": a, "traps": []}
	var r: Dictionary = await Pn.power_card(T, {"record": false, "tries": 3, "title": "Growth", "kicker": sp.what, "prompt": Ch2.spot_prompt(nums), "cards": [card],
		"judge": func(_i, k, _cf): return Ch2.spot_judge(nums, k), "reveal": Ch2.spot_reveal(nums), "bot_wrong": [a - sg if absi(a) > 1 else a + sg]})
	var tier := str(r.tier)
	if tier != "later":   # right at any try: opens a second look locked by a miss
		R.rings_right = int(R.get("rings_right", 0)) + 1
	if tier == "first":
		R.spot_first = int(R.get("spot_first", 0)) + 1
		if Ch2.pips(S) < Ch2.PIPS:
			R.spot_pips = int(R.spot_pips) + 1
	R.spots_used[sid] = int(R.spots_used.get(sid, 0)) + 1
	if not solved:
		T.set_flag(sp.flag, true)
		T.rebuild_maps()
		match sid:
			"growth_hedge":
				await T.say("", "You come out by the Low Road, the size of yourself again, with a leaf in your hair.")
				if T.world.map.id == "brindle":
					T.go("brindle", 17, 7, "right")
			"growth_vault":
				await T.say("", "From the top of the bank you can see the far end of the broken bridge, and gold lines still moving on its cables.")
			"growth_window":
				await T.say("", ["The vine carries you to the window ledge. The door below is locked, but the shutter is open.",
					"A desk. Two charcoal rubbings of carved stone, side by side: the grain-share rune and the vault rune.", "And a small painting of a young apprentice in Warden's grey, hung with its face turned to the wall."])
				T.remember("orrin", "In Orrin's tower: rubbings of the two runes, and a painting turned to the wall.")
				T.set_flag("orrin_painting", true)
				T.log_line("In Orrin's tower: rubbings of the two runes, and a painting turned to the wall.", "Orrin's window")
	else:
		await T.say("", "The sigil hums. %s holds." % sp.what)
	T.save()


## A second look with this giver (design §8.1): the pip check again with the next variant's numbers.
func _second_look2(T, key: String, offer := true) -> void:
	var S: Dictionary = T.S
	var giver: String = Ch2.LOOK_GIVER[key]
	var v := Ch2.look_variant(S, key)
	if offer and await T.choose(giver, "Back again, {name}? I've another one like it, with new numbers. A second look?", ["Yes, a second look", "Not now"]) != 0:
		return
	var traps := Ch2.look_traps(key, v)
	var kicker := "%s · %s · variant %s" % [Ch2.LOOK_NAME[key], Ch2.code_of(key), v]
	var quest: String = Ch2.LOOK_QUEST[key]
	var help := {"hint_btn": _hint(), "hint": Ch2.HINT[quest], "why": Ch2.WHY[quest]}   # the quest's hint and why line (script)
	var tier: String
	if Ch2.LOOK_CARD.has(key):
		var c := Ch2.look_card(key, v)
		var r: Dictionary = await Pn.power_card(T, {"record": false, "title": "Second look", "kicker": kicker, "prompt": Ch2.LOOK_PROMPT[key + v],
			"cards": [{"expr": c.expr, "base": c.base, "answer": c.answer, "traps": traps}], "hint_btn": help.hint_btn, "hint": help.hint, "why": help.why})
		tier = str(r.tier)
	else:
		tier = await T.frac({"key": "look_" + key, "record": false, "title": "Second look", "kicker": kicker, "prompt": Ch2.LOOK_PROMPT[key + v],
			"answer": Ch2.look_answer(key, v), "traps": traps, "bot_wrong": str(traps[0][0]).replace("−", "-"), "hint_btn": help.hint_btn, "hint": help.hint, "why": help.why})
	Ch2.look_result(S, key, v, tier, today())
	T.save()
	if tier == "first":
		T.confetti()
		await T.say("", "The Growth sigil on your hand glows. One pip back: %s." % Ch2.pip_text(Ch2.pips(S)))
		await T.say("pell", "See? Same skill, new numbers, and you nailed it.")
		T.log_line("Second look with %s (variant %s): right the first time. A pip back." % [T.people_def[giver].name, v], "Second look")
	else:
		await T.say(giver, "Come back after you've worked a gold ring, or tomorrow.")
	T.refresh()


## The test player's second looks in Chapter 2 (as Chapter 1's _auto_looks; a lock opens with a Growth spot or a later day).
func _auto_looks2(T) -> void:
	var S: Dictionary = T.S
	var plan: PackedStringArray = str(T.args.get("looks", "wrong,right")).split(",")
	var keep: String = T.auto
	var unlocks := 0
	for _round in 8:
		var any := false
		for key in Ch2.PIP_KEYS:
			if not Ch2.look_missed(S, key) or Ch2.look_passed(S, key):
				continue
			any = true
			if not Ch2.look_open(S, key, today()):
				var how: String = str(T.args.get("looks_unlock", "ring" if unlocks % 2 == 0 else "day"))
				unlocks += 1
				if how == "ring":
					T.auto = "second"
					await _gspot(T, "growth_hedge", false)
					T.auto = keep
				else:
					_day_offset += 1
				T.refresh()
				if not Ch2.look_open(S, key, today()):
					print("LOOK-PROBLEM %s still locked after a %s" % [key, how])
					continue
			var n: int = (S.pe.get("looks", {}).get(key, {}).get("tries", []) as Array).size()
			await T.goal("A gold ? over %s: a second look." % T.people_def[Ch2.LOOK_GIVER[key]].name, "person:" + Ch2.LOOK_GIVER[key])
			T.auto = plan[mini(n, plan.size() - 1)].strip_edges()
			await _second_look2(T, key, false)
			T.auto = keep
			if not Ch2.look_passed(S, key) and Ch2.look_open(S, key, today()):
				print("LOOK-PROBLEM %s open again straight after a miss" % key)
		if not any:
			break
	if T.args.has("spots") and not T.flag("growth_window", false):   # with every pip back, the window should open now
		await _gspot(T, "growth_window", false)
	T.set_goal_text(str(done_goal))


func _talk2(pid: String, T) -> void:
	var lk := _look_key2(pid)
	if lk != "" and Ch2.look_open(T.S, lk, today()):
		await _second_look2(T, lk)
		return
	match pid:
		"hesper":
			if T.flag("tally_done", false) and not T.flag("hesper_nought", false):   # once, after the tally
				T.set_flag("hesper_nought", true)
				await T.say("hesper", "Nought to the nought? Nothing can't triple. Zero isn't a base I'd plant.")
			else:
				await T.say("hesper", "Write it out the long way first. How many of them are you multiplying?")
		"bram":
			await T.say("bram", "A hole, I said. Shows what I know. Good day to you, apprentice.")
		_:
			await _talk_lines(pid, T)


func _report2(S: Dictionary) -> Array:
	var word := {"first": "first try", "second": "second try", "third": "third try", "later": "shown the answer"}
	var rows := []
	for c in Ch2.CODES:
		var bits := []
		var firsts := 0
		var seen := 0
		for k in c[2]:
			if S.answers.has(k):
				seen += 1
				if S.answers[k].tier == "first":
					firsts += 1
				var nm: String = str(Ch2.LABEL[k])
				if k.contains("rune_fix"):   # the pair label names both lines; say which one this is
					nm = "the vault stone, " + {"pe2_rune_fix": "3⁰", "pe7_rune_fix": "3⁻²", "pe2_rune_fix2": "4⁰", "pe7_rune_fix2": "4⁻²"}[k]
				bits.append("%s: %s" % [nm, word.get(S.answers[k].tier, "")])
		rows.append(["%s %s" % [c[0], c[1]], ("%d of %d first try. " % [firsts, seen] + "; ".join(bits)) if seen > 0 else "Not reached yet."])
	var out := [{"title": "First tries by outcome (notes section)", "rows": rows}]
	var own := []
	for k in Ch2.TYPED_LABEL:
		if S.typed.has(k):
			own.append([Ch2.TYPED_LABEL[k], str(S.typed[k].text)])
	if own.size():
		out.append({"title": "In my own words", "rows": own})
	var R: Dictionary = S.get("pe", {})
	var rune := []
	for k in ["rune2_predict", "rune2_explain"]:
		if S.answers.has(k):
			rune.append([Ch2.LABEL[k], word.get(S.answers[k].tier, "")])
	for pr in [["pe2_rune_fix", "pe7_rune_fix", "3⁰", "3⁻²"], ["pe2_rune_fix2", "pe7_rune_fix2", "4⁰", "4⁻²"]]:
		if S.answers.has(pr[0]):
			rune.append([Ch2.LABEL[pr[0]], "%s: %s; %s: %s" % [pr[2], word.get(S.answers[pr[0]].tier, ""), pr[3], word.get(S.answers.get(pr[1], {}).get("tier", ""), "not reached")]])
	if S.flags.get("rune2_broken", false):
		rune.append(["Broke the rune", str(R.get("rune_result", ""))])
	elif S.flags.get("at_vault", false):
		rune.append(["Broke the rune", "Not yet (%d flares so far)" % int(R.get("rune_losses", 0))])
	if rune.size():
		out.append({"title": "The false rune", "rows": rune})
	if S.flags.get("sigil2", false):
		var used := []
		for sid in R.get("spots_used", {}):
			used.append("%s ×%d" % [Ch2.SPOTS[sid].what, int(R.spots_used[sid])])
		var looks := []
		var tried := 0
		for k in Ch2.PIP_KEYS:
			var t := Ch2.look_text(S, k)
			if t != "":
				tried += (R.looks[k].tries as Array).size()
				looks.append("%s: %s" % [Ch2.LOOK_NAME[k], t])
		var n := Ch2.pips(S)
		out.append({"title": "The Growth sigil", "rows": [["Growth charge: %d of 6" % n, Ch2.pip_text(n)],
			["Where the pips came from", "%d from first tries, %d from gold rings, %d from second looks" % [Ch2.first_pips(S), int(R.get("spot_pips", 0)), Ch2.look_pips(S)]],
			["Growth spots used", ", ".join(used) if used.size() else "none yet"], ["Solved on the first try", str(int(R.get("spot_first", 0)))],
			["Second looks", ("%d tried, %d passed. " % [tried, Ch2.look_pips(S)] + "; ".join(looks)) if looks.size() else "none yet"]]})
	var bal := []
	for sid in R.get("balance_used", {}):
		bal.append("%s ×%d" % [Ch1.SPOTS[sid].what, int(R.balance_used[sid])])
	out.append({"title": "The Balance sigil", "rows": [["Balance spots solved in this chapter", ", ".join(bal) if bal.size() else "none yet"]]})
	return out


func _summary2(S: Dictionary) -> Dictionary:
	var firsts := 0
	for k in S.answers:
		if Ch2.keys().has(k) and S.answers[k].tier == "first":
			firsts += 1
	var R: Dictionary = S.pe
	var looks := {}
	for k in R.get("looks", {}):
		var tl := []
		for t in R.looks[k].tries:
			tl.append("%s:%s" % [t.v, t.tier])
		looks[k] = ",".join(tl)
	var ans := 0
	for k in S.answers:
		if Ch2.keys().has(k):
			ans += 1
	return {"chapter": 2, "ch2_answers": ans, "pips": Ch2.pips(S), "pips_from": [Ch2.first_pips(S), int(R.get("spot_pips", 0)), Ch2.look_pips(S)], "looks": looks,
		"rune_losses": int(R.rune_losses), "rune_broken": S.flags.get("rune2_broken", false), "firsts": firsts, "lent": S.flags.get("balance_lent", false),
		"growth": [S.flags.get("growth_ledge", false), S.flags.get("growth_hedge", false), S.flags.get("growth_vault", false), S.flags.get("growth_window", false)],
		"cat": str(S.flags.get("cat_name", "")), "sefa": str(S.flags.get("sefa_ch2", "")), "painting": S.flags.get("orrin_painting", false), "items": S.inv.keys()}
