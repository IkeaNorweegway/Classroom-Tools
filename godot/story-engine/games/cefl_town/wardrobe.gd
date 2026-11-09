# The student avatar and its clothes (CEFL Town and every mission built on it).
# The student picks a male student, a female student or a teddy bear (no colours: the models are fixed, scripts/blender/town_people.py).
# Money from helping people around town goes into the wallet; Pat's market stall (Downtown) sells clothes, and the
# closet at home is where you change. The wallet and the clothes live in the profile, shared by every mission, and
# never touch a mission's model, so buying things cannot change who wins.
#
# Profile keys: student { body, wear { top, hat, shoes, extra [] } }, wallet (cents), owned [item ids].
extends RefCounted

const Money = preload("res://engine/core/money.gd")
const ModelView = preload("res://engine/ui/model_view.gd")

## The three bodies (everyone starts in a white tee and blue jeans). The colour keys are for the flat portraits (dialogue, the Bag): they match the 3D model.
const BODIES := {
	"student_m": {"label": "Male student", "model": "town/people/student_m",
		"skin": "#a86b42", "hair": "#2b1d14", "hair_style": 0, "shirt": "#f4f1ea", "pants": "#3d5a80"},
	"student_f": {"label": "Female student", "model": "town/people/student_f",
		"skin": "#e8b98f", "hair": "#6b4226", "hair_style": 1, "shirt": "#f4f1ea", "pants": "#3d5a80"},
	"teddy": {"label": "Teddy bear", "model": "town/people/teddy",
		"skin": "#b5794a", "hair": "#b5794a", "hair_style": 5, "shirt": "#f4f1ea", "pants": "#3d5a80"},
}

const KINDS := [["top", "Tops"], ["hat", "Hats"], ["shoes", "Shoes"], ["extra", "Extras"]]
const DEFAULT_WEAR := {"top": "tee", "hat": "", "shoes": "basic", "extra": []}

## What Pat sells. Help requests pay $5–$12, so each item is about 2 to 5 jobs. colour: the flat portrait's shirt.
const ITEMS := {
	"hoodie": {"kind": "top", "name": "Hoodie", "price": 3000, "colour": "#6b7f8e"},
	"jersey": {"kind": "top", "name": "Team jersey", "price": 3500, "colour": "#c0392b"},
	"jeanjacket": {"kind": "top", "name": "Jean jacket", "price": 4000, "colour": "#4a6fa5"},
	"puffer": {"kind": "top", "name": "Puffer vest", "price": 4000, "colour": "#2e7d5a"},
	"cap": {"kind": "hat", "name": "Ball cap", "price": 1500},
	"toque": {"kind": "hat", "name": "Toque", "price": 1500},
	"bucket": {"kind": "hat", "name": "Bucket hat", "price": 2000},
	"hightops": {"kind": "shoes", "name": "High-tops", "price": 3500},
	"boots": {"kind": "shoes", "name": "Hiking boots", "price": 3000},
	"runners": {"kind": "shoes", "name": "Running shoes", "price": 2500},
	"sunglasses": {"kind": "extra", "name": "Sunglasses", "price": 1500},
	"headphones": {"kind": "extra", "name": "Headphones", "price": 2500},
	"backpack": {"kind": "extra", "name": "Backpack", "price": 2000},
}
## What you start with (always in the closet).
const STARTER := {"tee": "My T-shirt", "basic": "My sneakers"}


# ── The profile ──
static func fill(P: Dictionary) -> void:
	if not P.get("student") is Dictionary or not BODIES.has(str(P.student.get("body", ""))):
		P.student = {"body": "student_m", "wear": DEFAULT_WEAR.duplicate(true)}
	var w: Dictionary = P.student.get("wear", {}) if P.student.get("wear") is Dictionary else {}
	for k in DEFAULT_WEAR:
		if not w.has(k):
			w[k] = DEFAULT_WEAR[k].duplicate() if DEFAULT_WEAR[k] is Array else DEFAULT_WEAR[k]
	P.student.wear = w
	if not P.get("owned") is Array:
		P.owned = []
	P.wallet = int(P.get("wallet", 0))


## The look the game draws you with: the body's model, what you wear, and matching flat-portrait colours.
static func look_of(body: String, wear: Dictionary) -> Dictionary:
	var b: Dictionary = BODIES.get(body, BODIES.student_m)
	var out := {"model": b.model, "wear": wear.duplicate(true)}
	for k in ["skin", "hair", "hair_style", "shirt", "pants"]:
		out[k] = b[k]
	var top := str(wear.get("top", "tee"))
	if ITEMS.has(top):
		out.shirt = ITEMS[top].colour
	return out


static func my_look(P: Dictionary) -> Dictionary:
	fill(P)
	return look_of(P.student.body, P.student.wear)


static func owns(P: Dictionary, id: String) -> bool:
	return STARTER.has(id) or id in P.get("owned", [])


## Add pay to the wallet (help requests, Town Mail). Returns the new balance.
static func earn(P: Dictionary, cents: int) -> int:
	fill(P)
	P.wallet = int(P.wallet) + cents
	return P.wallet


# ── Pat's stall ──
static func stall(T) -> void:
	var P: Dictionary = T.P
	fill(P)
	var st := {"try": P.student.wear.duplicate(true), "msg": ""}
	var build := func(p: Dictionary, done: Callable):
		var body: VBoxContainer = p.body
		var top: HBoxContainer = T.ui.hbox(14)
		var view = ModelView.make(look_of(P.student.body, st.try), Vector2(130, 170), T.ui.reduce_motion)
		top.add_child(view)
		var info: VBoxContainer = T.ui.vbox(6)
		info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		var wallet_l: Label = T.ui.label("", "Strong")
		info.add_child(wallet_l)
		info.add_child(T.ui.label("Clothes for your closet. You earn money by helping people around town. Try things on first: you can only buy each thing once.", "Muted"))
		var msg: Label = T.ui.label("", "Strong")
		info.add_child(msg)
		top.add_child(info)
		body.add_child(top)
		var buttons := {}
		var refresh := func():
			wallet_l.text = "Your wallet: %s" % Money.fmt(int(P.wallet))
			msg.text = st.msg
			view.set_look(look_of(P.student.body, st.try))
			for id in buttons:
				var b: Button = buttons[id]
				var own := owns(P, id)
				b.text = "Owned" if own else "Buy"
				b.disabled = own or int(P.wallet) < int(ITEMS[id].price)
				b.tooltip_text = "" if own or not b.disabled else "You need %s more." % Money.fmt(int(ITEMS[id].price) - int(P.wallet))
		for kd in KINDS:
			body.add_child(T.ui.label(kd[1], "Kicker", false))
			for id in ITEMS:
				var it: Dictionary = ITEMS[id]
				if it.kind != kd[0]:
					continue
				var row: HBoxContainer = T.ui.hbox(8)
				var nm: Label = T.ui.label("%s · %s" % [it.name, Money.fmt(int(it.price))], "Strong", false)
				nm.size_flags_horizontal = Control.SIZE_EXPAND_FILL
				row.add_child(nm)
				var iid: String = id
				row.add_child(T.ui.button("Try on", false, func():
					_put_on(st.try, iid)
					st.msg = "Trying on: %s." % it.name
					refresh.call()))
				var buy: Button = T.ui.button("Buy", true, func():
					if buy_item(P, iid):
						st.msg = "%s: it's in your closet at home. %s left." % [it.name, Money.fmt(int(P.wallet))]
						T.toast("Bought: %s (−%s)" % [it.name, Money.fmt(int(it.price))])
						T.save()
					refresh.call())
				buttons[id] = buy
				row.add_child(buy)
				body.add_child(row)
		p.foot.add_child(T.ui.button("Done", true, func(): done.call(true)))
		refresh.call()
	# the test player buys the cheapest thing it can afford and doesn't own, then leaves
	var solve := func(_how):
		var best := ""
		for id in ITEMS:
			if not owns(P, id) and int(P.wallet) >= int(ITEMS[id].price) and (best == "" or int(ITEMS[id].price) < int(ITEMS[best].price)):
				best = id
		if best != "":
			buy_item(P, best)
		T._ui_done.emit(true)
	await T.box("stall", "Pat's market stall", build, solve, "Downtown", true)


static func buy_item(P: Dictionary, id: String) -> bool:
	fill(P)
	if not ITEMS.has(id) or owns(P, id) or int(P.wallet) < int(ITEMS[id].price):
		return false
	P.wallet = int(P.wallet) - int(ITEMS[id].price)
	P.owned.append(id)
	return true


static func _put_on(wear: Dictionary, id: String) -> void:
	if STARTER.has(id):
		wear["top" if id == "tee" else "shoes"] = id
		return
	var k: String = ITEMS[id].kind
	if k == "extra":
		var ex: Array = wear.get("extra", [])
		if not id in ex:
			ex.append(id)
		wear.extra = ex
	else:
		wear[k] = id


static func _take_off(wear: Dictionary, id: String) -> void:
	var k: String = ITEMS[id].kind if ITEMS.has(id) else ""
	if k == "extra":
		wear.extra = (wear.get("extra", []) as Array).filter(func(x): return x != id)
	elif k == "hat":
		wear.hat = ""
	elif k == "top":
		wear.top = "tee"
	elif k == "shoes":
		wear.shoes = "basic"


static func _wearing(wear: Dictionary, id: String) -> bool:
	if id == "tee" or id == "basic":
		return wear.get("top" if id == "tee" else "shoes", "") == id
	var k: String = ITEMS[id].kind
	return id in wear.get("extra", []) if k == "extra" else wear.get(k, "") == id


# ── The closet at home ──
static func closet(T) -> void:
	var P: Dictionary = T.P
	fill(P)
	var wear: Dictionary = P.student.wear.duplicate(true)
	var build := func(p: Dictionary, done: Callable):
		var body: VBoxContainer = p.body
		var top: HBoxContainer = T.ui.hbox(14)
		var view = ModelView.make(look_of(P.student.body, wear), Vector2(130, 170), T.ui.reduce_motion)
		top.add_child(view)
		var info: VBoxContainer = T.ui.vbox(6)
		info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		info.add_child(T.ui.label("Tap something to put it on or take it off. Extras go together; one top, hat and pair of shoes at a time.", "Muted"))
		if P.owned.is_empty():
			info.add_child(T.ui.label("Earn money by helping people around town, then buy clothes at Pat's stall Downtown.", "Strong"))
		top.add_child(info)
		body.add_child(top)
		var toggles := {}
		var refresh := func():
			view.set_look(look_of(P.student.body, wear))
			for id in toggles:
				(toggles[id] as Button).set_pressed_no_signal(_wearing(wear, id))
		for kd in KINDS:
			var ids := []
			if kd[0] == "top":
				ids.append("tee")
			if kd[0] == "shoes":
				ids.append("basic")
			for id in P.owned:
				if ITEMS.has(id) and ITEMS[id].kind == kd[0]:
					ids.append(id)
			if ids.is_empty():
				continue
			body.add_child(T.ui.label(kd[1], "Kicker", false))
			var flow := HFlowContainer.new()
			flow.add_theme_constant_override("h_separation", 8)
			flow.add_theme_constant_override("v_separation", 8)
			for id in ids:
				var iid: String = id
				var b: Button = T.ui.button(STARTER.get(id, ITEMS[id].name if ITEMS.has(id) else id))
				b.toggle_mode = true
				b.toggled.connect(func(on: bool):
					if on:
						_put_on(wear, iid)
					elif not STARTER.has(iid):
						_take_off(wear, iid)
					refresh.call())
				toggles[id] = b
				flow.add_child(b)
			body.add_child(flow)
		p.foot.add_child(T.ui.button("Cancel", false, func(): done.call(false)))
		p.foot.add_child(T.ui.button("Wear this", true, func(): done.call(true)))
		refresh.call()
	# the test player puts on the first thing it owns from each kind, then wears it
	var solve := func(_how):
		for id in P.owned:
			if ITEMS.has(id) and not _wearing(wear, id):
				_put_on(wear, id)
		T._ui_done.emit(true)
	var ok = await T.box("closet", "Your closet", build, solve, "Home")
	if ok:
		P.student.wear = wear
		T.refresh_look()
		T.save()
