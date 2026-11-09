# Prairie Parcel (warehouse associate, wage): Ship by four. Parcels ride the belt to the pick-up end. Read the label and walk the
# parcel to the loading cart for its region: the first letter of a Canadian postal code tells you (V West · T S R Prairies ·
# K L M N P Central · A B C E G H J East; the chart is on the wall). One parcel at a time. Over 23 kg, use the dolly (lifting it
# alone costs a point: safety). A full belt drops parcels on the floor. Shift 5: smudged labels go to the problem shelf.
# Gentle labels show the province; Real labels show the city and postal code only.
extends "res://games/payday/jobs/job.gd"

const PLACES := [
	["Vancouver", "BC", "V6B", "w"], ["Victoria", "BC", "V8W", "w"], ["Kelowna", "BC", "V1Y", "w"], ["Prince George", "BC", "V2L", "w"],
	["Red Deer", "AB", "T4N", "p"], ["Lethbridge", "AB", "T1J", "p"], ["Edmonton", "AB", "T5J", "p"], ["Regina", "SK", "S4P", "p"],
	["Saskatoon", "SK", "S7K", "p"], ["Winnipeg", "MB", "R3C", "p"], ["Brandon", "MB", "R7A", "p"],
	["Toronto", "ON", "M5V", "c"], ["Ottawa", "ON", "K1P", "c"], ["London", "ON", "N6A", "c"], ["Thunder Bay", "ON", "P7B", "c"], ["Hamilton", "ON", "L8P", "c"],
	["Montréal", "QC", "H2Y", "e"], ["Québec City", "QC", "G1R", "e"], ["Moncton", "NB", "E1C", "e"], ["Halifax", "NS", "B3J", "e"],
	["Charlottetown", "PE", "C1A", "e"], ["St. John's", "NL", "A1C", "e"]]
const ZONES := {"w": "West", "p": "Prairies", "c": "Central", "e": "East"}
const BELT_MAX := 6
const HEAVY := 23


func _init() -> void:
	id = "warehouse"
	name = "Ship by four"
	place = "Prairie Parcel · shipping floor"
	pay = "wage"
	start = Vector2i(7, 4)
	boss_at = Vector2i(11, 7)
	hour = 8
	react = {"great": "Fast and right. That’s how we ship by four.", "ok": "Okay. The boxes got out.", "poor": "Parcels on the floor. Parcels in the wrong chute. Not okay."}
	th = {"gentle": [0.8, 0.72, 0.6, 0.45], "real": [0.78, 0.68, 0.6, 0.45]}
	controls = ["Pick up the front parcel at the end of the belt and read its postal code.",
		"Walk it to the cart for its region: V West · T S R Prairies · K L M N P Central · A B C E G H J East.",
		"Over 23 kg? Get the dolly first. Don't let the belt fill up."]
	tips = {"zone": "Use the first letter of the postal code: V West · T S R Prairies · K L M N P Central · A B C E G H J East.",
		"lift": "Anything over 23 kg goes on the dolly. Lifting it alone is how backs get hurt.",
		"belt": "Keep the belt moving: grab the next parcel on your way back from a cart.",
		"problem": "Only smudged labels go to the problem shelf. If you can read it, ship it."}
	room_map = {"name": place, "w": 13, "h": 9, "room": {"floor": "concrete", "wall": "#dcd8cf", "exit": 6, "windows": [9]},
		"props": [
			{"k": "belt", "x": 1, "y": 2, "w": 6, "solid": true}, {"k": "counter", "x": 7, "y": 2, "id": "belt", "label": "Belt end", "color": "#5d6370", "solid": true},
			{"k": "board", "x": 9, "y": 2, "w": 2, "id": "chart", "label": "Zone chart", "solid": true},
			{"k": "cart", "x": 11, "y": 3, "id": "cart_w", "label": "West cart", "color": "#3f8fd2", "solid": true},
			{"k": "cart", "x": 11, "y": 5, "id": "cart_p", "label": "Prairies cart", "color": "#e8a21a", "solid": true},
			{"k": "cart", "x": 9, "y": 7, "id": "cart_c", "label": "Central cart", "color": "#c0463c", "solid": true},
			{"k": "cart", "x": 3, "y": 7, "id": "cart_e", "label": "East cart", "color": "#2c7a4b", "solid": true},
			{"k": "dolly", "x": 1, "y": 6, "id": "dolly", "label": "Dolly", "solid": true},
			{"k": "shelf", "x": 1, "y": 4, "id": "problem", "label": "Problem shelf", "color": "#7a5a3a", "solid": true},
			{"k": "tag", "x": 7, "y": 2, "title": "PICK UP"}, {"k": "tag", "x": 9, "y": 2, "w": 2, "title": "V·W  TSR·P  KLMNP·C  ABCEGHJ·E", "color": "#6b4510"},
			{"k": "tag", "x": 11, "y": 3, "title": "WEST", "color": "#2f5f9a"}, {"k": "tag", "x": 11, "y": 5, "title": "PRAIRIES", "color": "#94631a"},
			{"k": "tag", "x": 9, "y": 7, "title": "CENTRAL", "color": "#8a2f28"}, {"k": "tag", "x": 3, "y": 7, "title": "EAST", "color": "#1f5f3a"},
			{"k": "tag", "x": 1, "y": 4, "title": "PROBLEM"}, {"k": "pallet", "x": 5, "y": 7, "solid": true}, {"k": "cone", "x": 11, "y": 7}]}
	stations = {"belt": {"stand": Vector2i(7, 3), "tile": Vector2i(7, 2)}, "cart_w": {"stand": Vector2i(10, 3), "tile": Vector2i(11, 3)},
		"cart_p": {"stand": Vector2i(10, 5), "tile": Vector2i(11, 5)}, "cart_c": {"stand": Vector2i(9, 6), "tile": Vector2i(9, 7)},
		"cart_e": {"stand": Vector2i(3, 6), "tile": Vector2i(3, 7)}, "dolly": {"stand": Vector2i(2, 6), "tile": Vector2i(1, 6)},
		"problem": {"stand": Vector2i(2, 4), "tile": Vector2i(1, 4)}}


func twists() -> Array:
	return [
		{"name": "First shift", "line": "Mr. Kowalski shows you the belt, the zone chart and the carts. Light parcels today.", "rate": 0.75, "heavy": 0.0},
		{"name": "A normal day", "line": "Forty parcels an hour. That's the goal.", "heavy": 0.2},
		{"name": "After the holiday", "line": "The warehouse was closed for the stat holiday, so the belt starts full.", "heavy": 0.2, "backlog": 5},
		{"name": "Heavy day", "line": "Furniture orders: lots of parcels over 23 kg. Use the dolly.", "heavy": 0.4},
		{"name": "Smudged labels", "line": "The label printer is acting up. Smudged labels go to the problem shelf.", "heavy": 0.2, "smudge": 0.25},
		{"name": "After the repairs", "line": "The belt was fixed yesterday, and now it runs fast.", "heavy": 0.2, "rate": 1.2},
		{"name": "Big order", "line": "A big online sale: the belt never stops.", "heavy": 0.25, "rate": 1.15},
		{"name": "Peak season", "line": "Peak season: everyone is shipping gifts.", "heavy": 0.25, "rate": 1.3}]


func setup(st: Dictionary) -> void:
	st.belt = []
	st.next = 1.0
	st.dolly = false
	st.held = null
	st.sorted = 0
	for i in int(tw(st, "backlog", 0)):
		_new_parcel(st)


func _new_parcel(st: Dictionary) -> void:
	var pl: Array = pick(st, PLACES)
	var code := "%s %d%s%d" % [pl[2], irand(st, 1, 9), "ABCEGHJKLMNPRSTVXY"[irand(st, 0, 17)], irand(st, 0, 9)]
	var heavy := rnd(st) < float(tw(st, "heavy", 0.2))
	var smudged := rnd(st) < float(tw(st, "smudge", 0.0))
	st.belt.append({"city": pl[0], "prov": pl[1], "code": code, "zone": pl[3], "kg": irand(st, 24, 34) if heavy else irand(st, 1, 18), "smudged": smudged})
	st.demand = int(st.demand) + 1


func tick(st: Dictionary, dt: float) -> void:
	st.next = float(st.next) - dt * busy(st) * float(tw(st, "rate", 1.0))
	if st.next <= 0.0:
		st.next = (5.6 if not st.real else 4.7) * (0.75 + 0.5 * rnd(st))
		if st.belt.size() >= BELT_MAX:
			st.belt.pop_front()
			lose(st, Vector2i(7, 2), "belt", "The belt was full. A parcel fell off the end!")
		_new_parcel(st)


func _label(st: Dictionary, pc: Dictionary) -> String:
	if pc.smudged:
		return "To: %s ...  (the postal code is smudged)" % pc.city.substr(0, 3)
	return "To: %s, %s  %s" % [pc.city, pc.prov, pc.code] if not st.real else "To: %s  %s" % [pc.city, pc.code]


func on_at(st: Dictionary, sid: String) -> void:
	st.at = sid
	if sid == "dolly":
		st.dolly = not st.dolly
		st.msg = "You have the dolly: heavy parcels are safe to move." if st.dolly else "Dolly parked."
		return
	if st.held == null:
		return
	var pc: Dictionary = st.held
	var at: Vector2i = stations[sid].tile
	if sid == "problem":
		st.held = null
		if pc.smudged:
			win(st, at, "+1", "On the problem shelf. Someone in the office will call the customer.")
		else:
			oops(st, at, "problem", "That label was fine: %s goes to %s." % [pc.code, ZONES[pc.zone]])
		return
	if sid.begins_with("cart_"):
		var z := sid.substr(5)
		st.held = null
		if pc.smudged:
			oops(st, at, "problem", "You can't read that label. It goes to the problem shelf.")
		elif z == pc.zone:
			st.sorted = int(st.sorted) + 1
			win(st, at, "+1", "%s → %s. Loaded." % [pc.code.substr(0, 1), ZONES[z]])
		else:
			oops(st, at, "zone", "Wrong cart: %s starts with %s, so it goes %s." % [pc.city, pc.code.substr(0, 1), ZONES[pc.zone]])


func card(st: Dictionary) -> Dictionary:
	var sid := str(st.at)
	if sid == "belt":
		var L := ["On the belt: %d of %d." % [st.belt.size(), BELT_MAX]]
		if st.held != null:
			L.append("Your hands are full. Take that parcel to its cart first.")
			return {"title": "Belt end", "lines": L, "opts": []}
		if st.belt.is_empty():
			L.append("Nothing here yet.")
			return {"title": "Belt end", "lines": L, "opts": []}
		var pc: Dictionary = st.belt[0]
		L.append(_label(st, pc))
		L.append("Weight: %d kg%s" % [int(pc.kg), " (heavy)" if int(pc.kg) >= HEAVY else ""])
		return {"title": "Belt end · front parcel", "lines": L, "opts": [{"t": "Load it on the dolly" if st.dolly else "Lift it", "a": "take", "k": "primary"}], "cols": 1}
	if sid.begins_with("cart_"):
		return {"title": "%s cart" % ZONES[sid.substr(5)], "lines": ["Holding: " + (_label(st, st.held) if st.held != null else "nothing")], "opts": []}
	if sid == "problem":
		return {"title": "Problem shelf", "lines": ["For labels nobody can read."], "opts": []}
	if sid == "dolly":
		return {"title": "Dolly", "lines": ["You have the dolly." if st.dolly else "Dolly parked here."], "opts": []}
	return {}


func act(st: Dictionary, a: String) -> void:
	if a != "take" or st.at != "belt" or st.held != null or st.belt.is_empty():
		return
	var pc: Dictionary = st.belt.pop_front()
	st.held = pc
	if int(pc.kg) >= HEAVY and not st.dolly:
		oops(st, stations.belt.tile, "lift", "%d kg! That needed the dolly. You strain your back lifting it." % int(pc.kg))
	else:
		st.msg = "Got it. " + ("Read the label: where does it go?" if not pc.smudged else "That label is smudged.")


func best(st: Dictionary) -> Dictionary:
	if st.held != null:
		var pc: Dictionary = st.held
		return {"go": "problem" if pc.smudged else "cart_" + str(pc.zone), "think": 0.4}
	if st.belt.size() and int(st.belt[0].kg) >= HEAVY and not st.dolly:
		return {"go": "dolly", "think": 0.4}
	if st.belt.size():
		return {"go": "belt", "a": "take" if st.at == "belt" else "", "think": 1.1}
	return {"go": "belt"} if st.me != stations.belt.stand else {}


func actions(st: Dictionary) -> Array:
	return card(st).get("opts", []).map(func(o): return o.a)


func marks(st: Dictionary) -> Array:
	var out := []
	for i in st.belt.size():   # parcels on the belt, the front one at the pick-up end
		out.append({"x": 6 - i, "y": 2, "bub": "parcel" if not (i == 0 and int(st.belt[0].kg) >= HEAVY) else "warn", "ring": -1.0 if i > 0 else 1.0 - float(st.belt.size()) / float(BELT_MAX)})
	return out


func pending(st: Dictionary) -> int:
	return st.belt.size() + (1 if st.held != null else 0)


func tally(st: Dictionary) -> Array:
	return [["On the belt", "%d/%d" % [st.belt.size(), BELT_MAX]], ["Holding", (str(st.held.code).substr(0, 3) if not st.held.smudged else "???") if st.held != null else "—"], ["Shipped", str(st.sorted)], ["Dolly", "yes" if st.dolly else "no"]]


func earn_line(st: Dictionary) -> String:
	return "You shipped %d parcels. On a wage you're paid for every hour on your timesheet; a great shift earns more hours next time." % int(st.sorted)
