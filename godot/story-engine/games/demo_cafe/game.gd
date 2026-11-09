# Demo game for the CEFL Town v2 engine: Rosa's Corner Café (CEFL 9-EX1).
# Plays in about 20–25 minutes: 3 business days. Each day: order stock from Mr. Lin, set prices and staff at the plan board,
# open (customers come and go), then work out the day's profit and say what would help most.
# Side story: Quinn from Quick Bean offers half-price beans on Day 2. Accepting saves money and costs regulars.
# People remember your choices (Journal → People you know), and Rosa's ending speaks to them.
# Model: games/demo_cafe/model.gd (sample numbers; tests/test_model.gd checks that the careful plan always wins).
extends RefCounted

const M = preload("res://games/demo_cafe/model.gd")
const Sim = preload("res://engine/core/shop_sim.gd")
const Money = preload("res://engine/core/money.gd")

var id := "demo-cafe"
var title := "Rosa's Corner Café"
var unit_label := "CEFL Town v2 · Engine demo · Grade 9 Experiences (9-EX1)"
var i_can := "I can run a small business for three days and explain how my choices changed its profit."
var blurb := "Rosa is away for three days and leaves you her café. Order stock, set prices, decide when to hire help, and keep the regulars coming back. Numbers in this demo are samples."
var start_map := "main_street"
var start_at := Vector2i(8, 11)
var shop_cfg: Dictionary = M.CFG
var shop_layout := {"map": "cafe", "you": [4, 2], "counter": [4, 4], "board": [9, 5]}


# ── Maps ──
func maps() -> Dictionary:
	return {
		"main_street": {
			"name": "Main Street", "w": 30, "h": 18, "base": "grass",
			"fill": [["walk", 0, 8, 30, 1], ["road", 0, 9, 30, 2], ["walk", 0, 11, 30, 1], ["plaza", 14, 12, 10, 5],
				["path", 6, 12, 2, 6], ["walk", 24, 12, 3, 1]],
			"road_lines": [9],
			"buildings": [
				{"id": "cafe", "x": 2, "y": 3, "w": 5, "h": 5, "door": 4, "to": "cafe", "sign": "Rosa's Café", "awning": "#c4553f", "wall": "#f4e2c4", "roof": "#7a4a2c"},
				{"id": "quickbean", "x": 9, "y": 3, "w": 4, "h": 5, "door": 11, "sign": "Quick Bean", "awning": "#3f8fd2", "wall": "#e9eef2", "roof": "#3f8fd2", "door_color": "#2f3e5c"},
				{"id": "warehouse", "x": 15, "y": 2, "w": 7, "h": 6, "door": 18, "to": "warehouse", "sign": "Lin's Wholesale", "wall": "#d6dde3", "roof": "#5d6370"},
				{"id": "house", "x": 24, "y": 3, "w": 4, "h": 5, "door": 25, "wall": "#f2e3e3", "roof": "#8a63c8"},
			],
			"props": [
				{"k": "tree", "x": 1, "y": 1}, {"k": "tree", "x": 8, "y": 1}, {"k": "tree", "x": 13, "y": 1}, {"k": "tree", "x": 23, "y": 1}, {"k": "tree", "x": 28, "y": 1},
				{"k": "tree", "x": 28, "y": 5}, {"k": "bush", "x": 7, "y": 6}, {"k": "bush", "x": 13, "y": 6},
				{"k": "lamp", "x": 8, "y": 8}, {"k": "lamp", "x": 14, "y": 8}, {"k": "lamp", "x": 23, "y": 8},
				{"k": "flowers", "x": 2, "y": 13}, {"k": "flowers", "x": 3, "y": 13}, {"k": "flowers", "x": 4, "y": 13}, {"k": "tree", "x": 1, "y": 15},
				{"k": "tree", "x": 11, "y": 14}, {"k": "bench", "x": 9, "y": 13},
				{"k": "fountain", "x": 17, "y": 13, "w": 2, "h": 2}, {"k": "bench", "x": 15, "y": 16}, {"k": "bench", "x": 21, "y": 16},
				{"k": "stall", "x": 20, "y": 12, "w": 2, "id": "market_stall", "label": "Market stall", "color": "#4caf7a"},
				{"k": "sign", "x": 24, "y": 11, "id": "bus_stop", "label": "Bus stop"}, {"k": "tree", "x": 27, "y": 14},
			],
			"links": [{"x": 29, "y": 9, "h": 2, "to": "riverside", "at": [1, 6], "dir": "right"}],
		},
		"riverside": {
			"name": "Riverside Park", "w": 20, "h": 14, "base": "grass",
			"fill": [["path", 0, 6, 20, 2], ["path", 9, 2, 2, 4], ["water", 0, 10, 20, 4]],
			"props": [
				{"k": "tree", "x": 2, "y": 2}, {"k": "tree", "x": 5, "y": 1}, {"k": "tree", "x": 14, "y": 2}, {"k": "tree", "x": 17, "y": 3},
				{"k": "bench", "x": 6, "y": 8}, {"k": "bench", "x": 12, "y": 8}, {"k": "flowers", "x": 3, "y": 5}, {"k": "flowers", "x": 4, "y": 5},
				{"k": "bush", "x": 17, "y": 8}, {"k": "stall", "x": 7, "y": 4, "w": 2, "color": "#f2a93b", "id": "avery_stall", "label": "Avery's stall"},
				{"k": "lamp", "x": 11, "y": 5},
			],
			"links": [{"x": 0, "y": 6, "h": 2, "to": "main_street", "at": [28, 9], "dir": "left"}],
		},
		"cafe": {
			"name": "Rosa's Corner Café", "w": 12, "h": 9, "room": {"floor": "wood", "wall": "#f3e3c3", "exit": 6},
			"props": [
				{"k": "counter", "x": 2, "y": 3, "w": 6, "color": "#9a6b45"},
				{"k": "espresso", "x": 2, "y": 3, "solid": true}, {"k": "register", "x": 4, "y": 3, "id": "register", "label": "Till", "solid": true},
				{"k": "case", "x": 6, "y": 3, "w": 2, "solid": true},
				{"k": "board", "x": 10, "y": 5, "id": "plan_board", "label": "Plan board"},
				{"k": "phone", "x": 9, "y": 2, "id": "phone", "label": "Phone"},
				{"k": "table", "x": 2, "y": 6}, {"k": "table", "x": 8, "y": 7}, {"k": "plant", "x": 10, "y": 2}, {"k": "plant", "x": 1, "y": 7},
				{"k": "rug", "x": 5, "y": 5, "w": 3, "h": 2, "color": "#c4553f"}, {"k": "mat", "x": 6, "y": 7},
			],
		},
		"warehouse": {
			"name": "Lin's Wholesale", "w": 12, "h": 8, "room": {"floor": "concrete", "wall": "#e2ddd3", "exit": 6},
			"props": [
				{"k": "counter", "x": 4, "y": 3, "w": 4, "color": "#5d6370"},
				{"k": "shelf", "x": 1, "y": 2, "w": 2}, {"k": "shelf", "x": 9, "y": 2, "w": 2},
				{"k": "pallet", "x": 8, "y": 5, "w": 2}, {"k": "crate", "x": 1, "y": 5, "color": "#e2574c"}, {"k": "crate", "x": 1, "y": 6, "color": "#f2a93b"},
				{"k": "crate", "x": 10, "y": 6}, {"k": "board", "x": 1, "y": 4, "id": "price_list", "label": "Price list"},
			],
		},
	}


# ── People ──
func people() -> Dictionary:
	return {
		"rosa": {"name": "Rosa", "role": "owns Rosa's Corner Café", "look": {"skin": 2, "hair": 4, "hair_style": 2, "shirt": 0, "pants": 0, "outfit": "apron", "apron": "#2f3a33"}},
		"dev": {"name": "Dev", "role": "works at the café", "look": {"skin": 4, "hair": 0, "hair_style": 3, "shirt": 3, "pants": 0, "outfit": "apron", "apron": "#94631a"}},
		"lin": {"name": "Mr. Lin", "role": "runs Lin's Wholesale", "look": {"skin": 1, "hair": 0, "hair_style": 0, "shirt": 5, "pants": 1, "outfit": "vest"}},
		"quinn": {"name": "Quinn", "role": "runs Quick Bean, the café next door", "look": {"skin": 0, "hair": 3, "hair_style": 1, "shirt": 2, "pants": 4, "outfit": "cap", "cap": "#3f8fd2"}},
		"avery": {"name": "Avery", "role": "organizes the farmers' market", "look": {"skin": 3, "hair": 6, "hair_style": 1, "shirt": 4, "pants": 3}},
		"mo": {"name": "Mo", "role": "a regular at the café", "look": {"skin": 5, "hair": 0, "hair_style": 4, "shirt": 1, "pants": 0}},
		"jas": {"name": "Jas", "role": "a kid with big plans", "look": {"skin": 2, "hair": 2, "hair_style": 0, "shirt": 7, "pants": 2, "outfit": "cap", "cap": "#4caf7a"}},
	}


func where(pid: String, S: Dictionary) -> Variant:
	var day := int(S.day)
	var f: Dictionary = S.flags
	match pid:
		"rosa":
			if f.get("rosa_back", false):
				return {"map": "cafe", "x": 5, "y": 5, "dir": "down"}
			if not f.get("rosa_left", false):
				return {"map": "main_street", "x": 5, "y": 8, "dir": "down"}
		"dev":
			if f.get("open", false) and S.shop != null and S.shop.shifts.dev.size():
				return {"map": "cafe", "x": 6, "y": 2, "dir": "down"}
			return {"map": "cafe", "x": 3, "y": 6, "dir": "left"}
		"lin":
			return {"map": "warehouse", "x": 5, "y": 2, "dir": "down"}
		"quinn":
			return {"map": "main_street", "x": 10, "y": 8, "dir": "down"}
		"avery":
			if day == 2:
				return {"map": "main_street", "x": 22, "y": 13, "dir": "left"}
			return {"map": "riverside", "x": 9, "y": 5, "dir": "down"}
		"mo":
			if f.get("mo_in", false):
				return {"map": "cafe", "x": 9, "y": 7, "dir": "left"}
			if day == 1:
				return {"map": "cafe", "x": 9, "y": 7, "dir": "left"} if not f.get("open", false) else null
			if day == 2:
				return {"map": "main_street", "x": 25, "y": 11, "dir": "down"}
			return {"map": "riverside", "x": 13, "y": 8, "dir": "left"}
		"jas":
			return {"map": "riverside", "x": 15, "y": 8, "dir": "down"}
	return null


func bubble(pid: String, S: Dictionary) -> String:
	var day := int(S.day)
	if pid == "avery" and day == 1 and not S.flags.get("heard_market", false) and S.flags.get("rosa_left", false):
		return "talk"
	if pid == "mo" and day == 2 and not S.flags.get("heard_rain", false):
		return "talk"
	if pid == "jas" and not S.flags.get("met_jas", false):
		return "talk"
	return ""


func items() -> Dictionary:
	return {
		"keys": {"name": "Café keys", "about": "Rosa's keys. You are in charge for three days."},
		"notes": {"name": "Rosa's notes", "about": "An ordinary day: about 110 people come in. Morning rush 7 to 10 am: mostly coffee and muffins. Lunch 11 am to 1 pm: sandwiches. Muffins and sandwiches go stale overnight."},
		"thanks": {"name": "Rosa's thank-you card", "about": "\"You kept my café going. Thank you.\""},
	}


func new_game(S: Dictionary) -> void:
	S.cash = 0
	S.shop = Sim.init(M.CFG, 50)
	S.min = 6 * 60 + 30


func hud(S: Dictionary) -> Array:
	var out := [{"label": "Day %d" % int(S.day), "value": Money.clock(S.min)}, {"label": "Cash", "value": Money.fmt(S.cash), "warn": int(S.cash) < 0}]
	if S.shop != null and S.flags.get("rosa_left", false):
		out.append({"label": "Reputation", "value": "%d" % int(S.shop.rep), "warn": int(S.shop.rep) < M.GOAL_REP})
	# profit so far counts a day only once its profit was checked, so the top bar never gives the answer away
	var shown := 0
	for i in S.days.size():
		if S.flags.get("closed_%d" % i, false):
			shown += int(S.days[i].profit)
	if S.flags.get("closed_0", false):
		out.append({"label": "Profit", "value": Money.fmt(shown)})
	return out


func steps() -> Array:
	return ["d1_meet_rosa", "d1_order", "d1_plan", "d1_open", "d1_evening",
		"d2_quinn", "d2_order", "d2_plan", "d2_open", "d2_evening",
		"d3_order", "d3_plan", "d3_open", "d3_end"]


# ── Day 1 ──
func d1_meet_rosa(T) -> void:
	T.banner("Day 1 · Tuesday", "Rosa's Corner Café")
	await T.goal("Talk to Rosa outside her café.", "person:rosa")
	await T.say("rosa", ["{name}! Thank goodness. My sister needs me for three days, and the café can't just close.",
		"Will you run it? You decide what to order, what to charge and when Dev works. The money in the till is yours to use.",
		"Rent is $60 a day, whether we sell a thing or not. Dev earns $15 an hour.",
		"Mr. Lin's wholesale, across the street, is where your stock comes from."])
	var i: int = await T.choose("rosa", "One question before I go. What matters most to you?", ["Keeping the regulars happy.", "Making as much money as I can."])
	if i == 0:
		T.remember("rosa", "You told her the regulars matter most.", 1)
		await T.say("rosa", "Good. The regulars are why this place survives.")
	else:
		T.remember("rosa", "You told her money matters most.")
		await T.say("rosa", "Honest! Just remember: a café with no regulars has no money either.")
	if not T.flag("rosa_left", false):
		T.S.cash = M.START_CASH
		T.give("keys")
		T.give("notes")
		T.set_flag("rosa_left", true)
		T.log_line("Rosa left you the café and a %s float." % Money.fmt_w(M.START_CASH))
	await T.say("rosa", "There's %s in the till. My notes are in your Bag. See you Friday!" % Money.fmt_w(M.START_CASH))


func _estimate_note(T, d: int) -> String:
	var ev: Dictionary = M.EVENTS[d]
	var S: Dictionary = T.S
	var base := "[b]Rosa's notes:[/b] an ordinary day brings about 110 people. Mornings are mostly coffee and muffins; lunch is sandwiches. Muffins and sandwiches go stale overnight."
	if T.mode() != "gentle":
		return base
	var want := _expected(S, d)
	return base + "\n[b]Hint:[/b] %s. Expect about %d coffees, %d muffins and %d sandwiches today, if nobody leaves." % [ev.label, roundi(want.coffee), roundi(want.muffin), roundi(want.sandwich)]


func _expected(S: Dictionary, d: int) -> Dictionary:
	var ev: Dictionary = M.EVENTS[d]
	var m := float(ev.traffic) * (0.6 + float(S.shop.rep) / 125.0)
	var want := {}
	for k in M.CFG.products:
		want[k] = 0.0
	for i in M.CFG.traffic.size():
		var ws := 0.0
		for k in M.CFG.products:
			ws += M.CFG.products[k].mix[i]
		for k in M.CFG.products:
			want[k] += M.CFG.traffic[i] * m * M.CFG.products[k].mix[i] / ws
	return want


func _order_step(T, d: int) -> void:
	if T.flag("ordered_%d" % d, false):
		return
	await T.goal("Order today's stock from Mr. Lin at Lin's Wholesale.", "person:lin")
	var lines := ["Morning! What can I get you?"]
	if d == 1:
		if T.flag("cheap_beans", false):
			lines = ["I hear you're buying coffee beans from Quinn now. Your call. Everything else, I still have."]
		else:
			lines = ["Quinn came by trying to sell you beans, didn't he? Thanks for sticking with me."]
	elif d == 2:
		lines = ["Rain today. People still want coffee when it rains, but fewer of them come out."]
	await T.say("lin", lines)
	await T.shop_order("Lin's Wholesale", _estimate_note(T, d))
	T.set_flag("ordered_%d" % d, true)


func _plan_step(T, d: int) -> void:
	if T.flag("planned_%d" % d, false):
		return
	await T.goal("Set prices and staff at the plan board in the café.", "thing:plan_board")
	var note := "You serve about 12 people an hour. The morning rush (7 to 10 am) brings about 20 an hour on an ordinary day."
	if d > 0:
		var last: Dictionary = T.S.days[-1]
		note += "\nYesterday: %d left because the line was too long, %d because it was sold out, %d over the price." % [int(last.lost.line), int(last.lost.soldout), int(last.lost.price)]
	await T.shop_plan(note)
	T.set_flag("planned_%d" % d, true)


func _open_step(T, d: int) -> void:
	if T.S.days.size() <= d:
		await T.goal("Talk to Dev, then open the café.", "person:dev")
		await T.say("dev", ["Doors open at 7. Let's go!"] if d == 0 else ["Ready when you are."])
		T.set_time(d + 1, 7 * 60)
	var res: Dictionary = await T.shop_run(M.EVENTS[d])
	await _close_day(T, d, res)


func _close_day(T, d: int, res: Dictionary) -> void:
	if T.flag("closed_%d" % d, false):
		return
	var show := func(b): T.ledger_table(b, res, true)
	await T.calc({"key": "profit_d%d" % (d + 1), "label": "Day %d profit" % (d + 1), "title": "Day %d: closing time" % (d + 1), "kicker": res.label,
		"prompt": "Work out today's [b]profit[/b] from the ledger.", "answer": res.profit, "show": show,
		"hint": "Profit = sales − stock bought − wages − rent.", "why": "Profit = sales − stock bought today − wages − rent."})
	if d < 2:
		await _what_helps(T, d, res)
	T.set_flag("closed_%d" % d, true)


## "What would help most tomorrow?" Right: the fix for the biggest loss. Wrong: fixes for losses under a quarter of it.
## Fixes in between help a little, so they are left out (games design rule 5).
func _what_helps(T, d: int, res: Dictionary) -> void:
	var S: Dictionary = T.S
	var loss := {"line": 0.0, "soldout": 0.0, "waste": float(res.waste_cost), "price": 0.0}
	for k in M.CFG.products:
		var p := Sim.product(M.CFG, S, k)
		var margin := float(S.shop.price[k]) - float(p.pack_cost) / float(p.pack_size)
		loss.line += float(res.by[k].line) * margin
		loss.soldout += float(res.by[k].soldout) * margin
		loss.price += float(res.by[k].price) * float(p.ref - p.pack_cost / p.pack_size)
	var fix := {"line": "Have Dev work the busy hours.", "soldout": "Order more of what sold out.", "waste": "Order less of what got thrown out.", "price": "Bring prices back near what customers expect."}
	var why := {"line": "%d people left because the line was too long.", "soldout": "%d people left because it was sold out.", "waste": "%d items were thrown out at closing.", "price": "%d people walked out over the price."}
	var count := {"line": int(res.lost.line), "soldout": int(res.lost.soldout), "price": int(res.lost.price), "waste": 0}
	for k in res.waste:
		count.waste += int(res.waste[k])
	var best := "line"
	for k in loss:
		if loss[k] > loss[best]:
			best = k
	if loss[best] < 1500.0:
		await T.say("dev", "Not much went wrong today. Keep the plan that worked, and watch for anything special tomorrow.")
		return
	var opts := [best]
	for k in loss:
		if k != best and loss[k] < loss[best] / 4.0:
			opts.append(k)
	opts.shuffle()
	var labels := []
	for k in opts:
		labels.append(fix[k])
	var tries := 0
	while true:
		var i: int = await T.choose("dev", "Looking at today, what would help most tomorrow?", labels, opts.find(best))
		var k: String = opts[i]
		if k == best:
			T.record("help_d%d" % (d + 1), "Day %d: what would help most" % (d + 1), ["first", "second", "later"][mini(tries, 2)])
			await T.say("dev", "Right. " + (why[k] % count[k]) + " That cost us about %s. Set it up before we open tomorrow." % Money.fmt(roundi(loss[k])))
			T.log_line("After Day %d you decided: %s" % [d + 1, fix[k]])
			return
		tries += 1
		if tries >= 2:
			T.record("help_d%d" % (d + 1), "Day %d: what would help most" % (d + 1), "later")
			await T.say("dev", "The biggest loss was this one: " + (why[best] % count[best]) + " That cost us about %s. So: %s" % [Money.fmt(roundi(loss[best])), fix[best]])
			T.log_line("After Day %d, Dev pointed out: %s" % [d + 1, fix[best]])
			return
		await T.say("dev", "That changes almost nothing: " + (why[k] % count[k]) + " Look for the biggest loss.")


func d1_order(T) -> void:
	await _order_step(T, 0)


func d1_plan(T) -> void:
	await _plan_step(T, 0)


func d1_open(T) -> void:
	await _open_step(T, 0)


func d1_evening(T) -> void:
	await T.goal("The café phone is ringing. Answer it.", "thing:phone")
	var p := int(T.S.days[0].profit)
	await T.say("rosa", "It's Rosa! How did the first day go?")
	await T.say("you", "We made %s profit today." % Money.fmt(p))
	if p >= 15000:
		await T.say("rosa", "That's a good Tuesday! Better than most of mine.")
	elif p > 0:
		await T.say("rosa", "A profit on day one. Not bad! Rent and wages come out every day, so watch them.")
	else:
		await T.say("rosa", "A loss. Don't panic: look at the ledger and find the biggest leak.")
	if T.flag("heard_market", false):
		await T.say("dev", "And tomorrow's the farmers' market. You already knew, right? Avery told you.")
	else:
		await T.say("dev", "Oh, and Avery says tomorrow's the farmers' market, right on Main Street. Last time it was packed all day.")
		T.set_flag("heard_market", true)
	T.log_line("Heard that Day 2 is the farmers' market.")
	T.set_time(2, 6 * 60 + 30)
	T.banner("Day 2 · Wednesday", "Farmers' market day")


# ── Day 2 ──
func d2_quinn(T) -> void:
	if T.flag("quinn_done", false):
		return
	await T.goal("Quinn from Quick Bean wants a word. Go and see him.", "person:quinn")
	await T.say("quinn", ["Hey, neighbour. Busy day today, huh? I've got a deal for you.",
		"My supplier sells coffee beans for $4 a bag. Mr. Lin charges $8. Same amount of coffee. Nobody can tell the difference."])
	while true:
		var i: int = await T.choose("quinn", "So? Half price. Want in?", ["Deal. Half price is half price.", "What's wrong with them?", "No thanks. Rosa's regulars come for the coffee."], 2)
		if i == 1:
			await T.say("quinn", "Wrong? Nothing! They're... a bit old. Roasted a while back. Coffee is coffee.")
			T.remember("quinn", "You asked what was wrong with his beans.")
			continue
		if i == 0:
			T.S.shop.grade.coffee = "cheap"
			T.set_flag("cheap_beans", true)
			T.remember("quinn", "You bought his half-price beans.", 2)
			T.remember("lin", "You switched your coffee beans to Quinn's supplier.", -2)
			T.log_line("Switched to Quinn's half-price coffee beans.")
			await T.say("quinn", "Smart. I'll tell Mr. Lin you won't need his beans. Pleasure doing business.")
		else:
			T.remember("quinn", "You turned down his cheap beans.", -1)
			T.remember("lin", "You turned down Quinn's cheap beans and kept buying from him.", 2)
			T.log_line("Turned down Quinn's half-price beans.")
			await T.say("quinn", "Suit yourself. More money for me.")
		break
	T.set_flag("quinn_done", true)


func d2_order(T) -> void:
	await _order_step(T, 1)


func d2_plan(T) -> void:
	await _plan_step(T, 1)


func d2_open(T) -> void:
	await _open_step(T, 1)


func d2_evening(T) -> void:
	if not T.flag("mo_in", false):
		T.set_flag("mo_in", true)
	await T.goal("Mo just came in. See what he wants.", "person:mo")
	if T.flag("cheap_beans", false):
		await T.say("mo", ["Long day? Listen, {name}. The coffee tasted... stale today. Did Rosa change something?",
			"I'm not the only one who noticed. A few people said they'll try Quick Bean tomorrow."])
		T.remember("mo", "He noticed the coffee changed.", -2)
	else:
		await T.say("mo", "What a day! Coffee was great, as always.")
		T.remember("mo", "He likes how you run the café.", 1)
	if T.flag("heard_rain", false):
		await T.say("mo", "And don't forget the rain tomorrow. Bring an umbrella!")
	else:
		await T.say("mo", "By the way, the radio says rain all day tomorrow. Nobody goes out in that.")
		T.set_flag("heard_rain", true)
	T.log_line("Heard rain is coming on Day 3.")
	T.set_flag("mo_in", false)
	T.set_time(3, 6 * 60 + 30)
	T.banner("Day 3 · Thursday", "Rain all day")


# ── Day 3 ──
func d3_order(T) -> void:
	await _order_step(T, 2)


func d3_plan(T) -> void:
	await _plan_step(T, 2)


func d3_open(T) -> void:
	await _open_step(T, 2)


func d3_end(T) -> void:
	if not T.flag("rosa_back", false):
		T.set_flag("rosa_back", true)
		T.set_time(4, 9 * 60)
		T.banner("Friday", "Rosa is back")
	await T.goal("Rosa is back. Meet her in the café.", "person:rosa")
	var S: Dictionary = T.S
	var total := Sim.total_profit(S)
	var end := M.ending(S, total)
	await T.say("rosa", "{name}! Let me see the books... Three days, %s profit. Reputation %d." % [Money.fmt(total), int(S.shop.rep)])
	if T.knows("rosa", "You told her the regulars matter most."):
		await T.say("rosa", "You told me the regulars matter most. Let's see if you meant it.")
	match end:
		"thriving":
			await T.say("rosa", "You beat my goal of %s, and the regulars are happier than when I left. You ran this place better than I do!" % Money.fmt_w(M.GOAL_PROFIT))
		"regulars":
			await T.say("rosa", "Good money, past my %s goal. But the regulars... Mo says the coffee changed. Money this week can cost customers next week." % Money.fmt_w(M.GOAL_PROFIT))
		_:
			await T.say("rosa", "We didn't reach %s this time. That's how you learn a business: which costs you control, and which you don't." % Money.fmt_w(M.GOAL_PROFIT))
	if T.knows("lin", "You turned down Quinn's cheap beans and kept buying from him."):
		await T.say("rosa", "Mr. Lin told me you turned Quinn down. He trusts you now. That's worth a lot.")
	if not S.typed.has("reflect"):
		await T.typed({"id": "reflect", "title": "Before you go", "kicker": "In your own words",
			"prompt": "Which decision changed your profit the most? Use at least one number from your ledgers to show it.", "min": 40})
	if not T.has("thanks"):
		T.give("thanks")
	if end == "thriving":
		T.confetti()
		T.banner("Well done, " + T.player_name(), "The café is thriving")
	await T.say("rosa", "Thank you, {name}. Open the Menu and download your report for your teacher.")


# ── Free talk and things ──
func talk(pid: String, T) -> void:
	var S: Dictionary = T.S
	var day := int(S.day)
	match pid:
		"rosa":
			await T.say("rosa", "Go on, the café is yours this week!")
		"dev":
			if S.days.size():
				var last: Dictionary = S.days[-1]
				await T.say("dev", "Yesterday %d people came in, and %d bought something. The ledger is in the Journal." % [int(last.walkins), int(last.served)])
			else:
				await T.say("dev", "I can work the morning, the afternoon, or both. It's $15 an hour. Your call on the plan board.")
		"lin":
			await T.say("lin", "Beans keep. Muffins and sandwiches don't: whatever you don't sell is waste by tomorrow.")
		"quinn":
			if T.flag("cheap_beans", false):
				await T.say("quinn", "How are those beans working out? Heh.")
			elif T.flag("quinn_done", false):
				await T.say("quinn", "Still drinking the expensive stuff? Your loss.")
			else:
				await T.say("quinn", "Quick Bean: cheap and quick. Unlike some cafés.")
		"avery":
			if day == 1:
				await T.say("avery", ["Tomorrow is the farmers' market, right on Main Street!",
					"Last time, the cafés had people out the door all day. About half again as many as a normal day."])
				T.set_flag("heard_market", true)
				T.remember("avery", "You asked about the market.", 1)
			elif day == 2:
				await T.say("avery", "Look at this crowd! Hope you stocked up.")
			else:
				await T.say("avery", "Rain, rain. Quiet day for everyone.")
		"mo":
			if day == 1:
				await T.say("mo", "Rosa's away? Then you'd better keep the coffee good. I come every morning.")
			elif day == 2:
				await T.say("mo", ["Waiting for the bus. The radio says rain all day tomorrow.", "When it rains, I make coffee at home."])
				T.set_flag("heard_rain", true)
				T.remember("mo", "You chatted at the bus stop.", 1)
			else:
				await T.say("mo", "Too wet for a walk. Hope you didn't order too many sandwiches!")
		"jas":
			T.set_flag("met_jas", true)
			await T.say("jas", ["I'm going to open a lemonade stand. But how do I know how many lemons to buy?",
				"Too few and I sell out. Too many and they go bad. Hmm."])
			T.remember("jas", "You talked about the lemonade stand.")


func use(thing: String, T) -> void:
	match thing:
		"plan_board":
			await T.say("", "The plan board. Prices and staff for the day get set here before opening.")
		"register":
			await T.say("", "The till. Cash: %s." % Money.fmt(T.S.cash))
		"phone":
			await T.say("", "No calls right now.")
		"price_list":
			var t := "Lin's price list: "
			var bits := []
			for k in M.CFG.products:
				var p := Sim.product(M.CFG, T.S, k)
				bits.append("%s %s (%d %s)" % [p.pack_name, Money.fmt(p.pack_cost), int(p.pack_size), p.unit])
			await T.say("", t + ", ".join(bits) + ".")
		"market_stall":
			await T.say("", "A farmers' market stall. \"Market day: Wednesdays.\"")
		"avery_stall":
			await T.say("", "Avery's stall. A sign says: \"Farmers' market, Main Street, Wednesday.\"")
		"bus_stop":
			await T.say("", "The bus stop. Someone left a weather page: \"Thursday: rain all day.\"")
			T.set_flag("heard_rain", true)


# ── Report and the test player ──
func report(S: Dictionary) -> Array:
	var rows := []
	for d in S.days:
		rows.append(["Day %d: %s" % [int(d.day), d.label], "Sales %s · stock %s · wages %s · rent %s · profit %s · reputation %d" % [
			Money.fmt(d.sales), Money.fmt(d.bought), Money.fmt(d.wages), Money.fmt(d.rent), Money.fmt(d.profit), int(d.rep_after)]])
	var total := Sim.total_profit(S)
	rows.append(["Three days", "Profit %s (goal %s) · reputation %d (goal %d or more)" % [Money.fmt(total), Money.fmt(M.GOAL_PROFIT), int(S.shop.rep), M.GOAL_REP]])
	var end: String = {"thriving": "Goal reached: profit and regulars.", "regulars": "Profit goal reached, but reputation fell.", "short": "Profit goal not reached."}[M.ending(S, total)]
	return [{"title": "Café results (sample numbers)", "rows": rows}, {"title": "Outcome", "text": end if S.days.size() == 3 else "Not finished yet."}]


func summary(S: Dictionary) -> Dictionary:
	var total := Sim.total_profit(S)
	return {"total_profit": total, "ending": M.ending(S, total), "cheap": S.flags.get("cheap_beans", false)}


func bot_order(S: Dictionary) -> Dictionary:
	var d := int(S.day) - 1
	var want := _expected(S, d)
	var dev := _bot_dev(d)
	var packs := {}
	for k in M.CFG.products:
		var need: float = want[k] * (0.95 if dev.size() else 0.8) - float(S.shop.stock[k])
		packs[k] = maxi(0, roundi(need / float(M.CFG.products[k].pack_size)))
	return packs


func _bot_dev(d: int) -> Array:
	return ["morning", "afternoon"] if d == 1 else (["morning"] if d == 0 else [])


func bot_plan(S: Dictionary) -> Dictionary:
	var price := {}
	for k in M.CFG.products:
		price[k] = int(M.CFG.products[k].ref)
	return {"price": price, "shifts": {"dev": _bot_dev(int(S.day) - 1)}}
