# CEFL Town (v2, 3D): the v1 town to walk around, ready for the missions to move in.
# Batch 1 of the port: the whole map (games/cefl_town/town_v1.gd), every room, the base townspeople where v1 puts them,
# street signs you can read, district names as you walk, and the Town Map (M). No mission yet: after a short welcome
# the town is free to explore. Payday (7-income-tax) is the first mission to move in.
extends RefCounted

const Town1 = preload("res://games/cefl_town/town_v1.gd")
const Areas = preload("res://games/cefl_town/areas.gd")
const Story = preload("res://engine/core/story.gd")
const Wardrobe = preload("res://games/cefl_town/wardrobe.gd")

var id := "cefl-town"
var title := "CEFL Town"
var unit_label := "CEFL Town v2 · Grades 7–9"
var i_can := "I can find my way around town: the Job Centre, the bank, Service Canada, Town Hall and the shops."
var blurb := "The town from every CEFL mission, now in 3D. Walk the streets, step inside the buildings and meet the people you will work with. Missions move in next."
var start_map := "neighbourhoods"
var start_at := Vector2i(38, 27)   # outside Home, on River Walk
var done_goal := "Explore the town. Press M for the Town Map."
var _maps := {}
var avatar_title := "Pick your student"
var avatar_bodies := Wardrobe.BODIES


func maps() -> Dictionary:
	if _maps.is_empty():
		_maps = Areas.all()
		for b in Town1.BUILDINGS:
			_maps[b.id] = Town1.build_room(b)
		_maps.home.props.append({"k": "wardrobe", "x": 3, "y": 1, "id": "closet", "label": "Your closet", "solid": true})
		var h: Dictionary = _maps.neighbourhoods.spots.home
		start_at = Vector2i(int(h.x), int(h.y))
	return _maps


## Where the townspeople who are out and about stand, in the five areas (people indoors keep v1's spots).
const OUTSIDE := {
	"avery": {"map": "campus", "x": 22, "y": 25, "dir": "down"},
	"dev": {"map": "shopping", "x": 26, "y": 25, "dir": "down"},
	"rosa": {"map": "neighbourhoods", "x": 50, "y": 28, "dir": "down"},
	"worker": {"map": "shopping", "x": 46, "y": 36, "dir": "left"},
	"vendor": {"map": "downtown", "x": 37, "y": 29, "dir": "down"},
}


# ── You: the student you picked, and what you wear (games/cefl_town/wardrobe.gd) ──
func base_look(P: Dictionary) -> Dictionary:
	return Wardrobe.my_look(P)


func body_of(P: Dictionary) -> String:
	Wardrobe.fill(P)
	return str(P.student.body)


func avatar_look(P: Dictionary, body: String) -> Dictionary:
	Wardrobe.fill(P)
	return Wardrobe.look_of(body, P.student.wear)


func set_body(P: Dictionary, body: String) -> void:
	Wardrobe.fill(P)
	P.student.body = body


func profile_hud(P: Dictionary) -> Array:
	if int(P.get("wallet", 0)) > 0 or not (P.get("owned", []) as Array).is_empty():
		return [{"label": "Wallet", "value": Wardrobe.Money.fmt(int(P.wallet))}]
	return []


func people() -> Dictionary:
	return Town1.PEOPLE


func where(pid: String, S: Dictionary) -> Variant:
	if OUTSIDE.has(pid):
		return OUTSIDE[pid]
	var p: Dictionary = Town1.PEOPLE.get(pid, {})
	if p.is_empty():
		return null
	return {"map": p.map, "x": p.x, "y": p.y, "dir": p.get("dir", "down")}


func bubble(pid: String, S: Dictionary) -> String:
	return "talk" if not Story.met(S, pid) else ""


func items() -> Dictionary:
	return {"key": {"name": "House key", "about": "The key to Home, on River Walk."}}


func new_game(S: Dictionary) -> void:
	pass


func hud(S: Dictionary) -> Array:
	return [{"label": "People met", "value": "%d of %d" % [_met(S), Town1.PEOPLE.size()]}]


func _met(S: Dictionary) -> int:
	var n := 0
	for pid in Town1.PEOPLE:
		if Story.met(S, pid):
			n += 1
	return n


func steps() -> Array:
	return ["welcome"]


func welcome(T) -> void:
	T.banner("CEFL Town", "Welcome home")
	if not T.has("key"):
		T.give("key")
	await T.say("", ["This is the town from every CEFL mission. Home is right behind you, on River Walk.",
		"Town has five areas: Downtown in the middle, the College Campus to the north, the School grounds to the west, the Shopping district to the east and the Neighbourhoods here in the south. Walk off the end of a street to go to the next one.",
		"Walk with the arrow keys or WASD, or tap where you want to go. Space or E talks to whoever is in front of you.",
		"Press M for the Town Map. Signs at the corners tell you what is down each street."])
	await T.goal("Visit Ms. Okafor at the Job Centre on Main Street.", "person:okafor")
	await T.say("okafor", ["{name}! Welcome. I'm Ms. Okafor, the career counsellor.",
		"When a mission starts, you'll find me here. For now, have a look round and say hello to people."])


func talk(pid: String, T) -> void:
	var lines := {
		"okafor": ["Careers, pay stubs, résumés: if it's about work, start here."],
		"sam": ["Hi, I'm Sam. I work the counter at the bank.", "Chequing, savings, interest: ask me any time."],
		"jas": ["I'm looking for my first real job. Service Canada helps with that.", "Mr. Benoit says I need a SIN first."],
		"agent": ["Bonjour! I'm Mr. Benoit. Service Canada does SIN numbers, EI and pensions.", "Bring your questions: that's what we're here for."],
		"grandpa": ["Come in, come in! I've lived on River Walk for fifty years.", "Ask me about the old days. And about saving money: I have opinions."],
		"nurse": ["I'm Nurse Kaur. Long shifts here at the hospital.", "Twelve hours on, then three days off. You get used to it."],
		"mayor": ["Councillor Wright. Town Hall is open to everyone.", "Council meets here, and so do the town's big events."],
		"librarian": ["Welcome to the library! I'm Mx. Lin.", "Books, computers and quiet. Career guides are on the left."],
		"avery": ["Hey, neighbour! I'm Avery.", "I take classes at the University. The Polytechnic's open house is next week, if you're curious."],
		"dev": ["Hi! I'm Dev. I'm saving up for a phone, so CellPoint is my favourite window.", "Saving is hard when the whole of Market Lane is right there."],
		"rosa": ["Hello, love! I'm Rosa, from across the street.", "If you ever need a hand with money, my door's open. I've learned a few things the hard way."],
		"worker": ["Mo. I load trucks at Prairie Parcel.", "Hard hat on, boots on, every day. Safety first, then the work."],
	}
	if pid == "vendor":
		Wardrobe.fill(T.P)
		var first: bool = not T.P.has("met_pat")
		T.P.met_pat = true
		await T.say(pid, ["Pat's stall! Hoodies, hats, shoes, the lot." if first else "Back again? Have a look.",
			"Everything's for your closet at home. Try it on first: once it's bought, it's yours." if first
			else ("You've got %s to spend." % Wardrobe.Money.fmt(int(T.P.wallet)) if int(T.P.wallet) > 0 else "Help out around town and you'll have money to spend.")])
		await Wardrobe.stall(T)
		return
	await T.say(pid, lines.get(pid, ["Hello!"]))


func use(thing: String, T) -> void:
	for mid in maps():
		for p in maps()[mid].get("props", []):
			if p.get("id", "") == thing and p.has("text"):
				await T.say("", str(p.text))
				return
	match thing:
		"closet":
			await Wardrobe.closet(T)
		"plan_wall":
			await T.say("", "Your My Plan wall. A page goes up here each time you finish a mission.")
		_:
			await T.say("", "Nothing to see here yet.")


func report(S: Dictionary) -> Array:
	return [{"title": "Around town", "rows": [["People met", "%d of %d" % [_met(S), Town1.PEOPLE.size()]]]}]


func summary(S: Dictionary) -> Dictionary:
	return {"met": _met(S)}
