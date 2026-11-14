# Realm's own panels on T.box. Each has a test-player move (solve), so auto=right|second|wrong can play them.
#   frost_line(…)        a number line drawn in frost (cold on the left, warm on the right), with points
#   worked_example(T)    Hesper's frost-window lesson: −3/4 and −1/4, then one point with three names
#   order_line(T, o)     tap cards from least to greatest; checked by value; Gentle: Ask Hesper and "look again at A and B"
#   step_order(T, o)     the frost recipe's four steps in order, with a decoy card (the misconception)
#   pie_test(T)          the rune's test: sixths drop into a grain pie beside the stone's 2/5
#   bar(den, filled, …)  a cart drawn as a bar in equal parts (the harvest, Gentle only)
extends RefCounted

const Frac = preload("res://engine/core/frac.gd")
const Ch1 = preload("res://games/realm/ch1.gd")
const UIScript = preload("res://engine/ui/ui.gd")

const FROST_BG := Color("#e6f0f2")
const FROST_LINE := Color("#5d7891")
const COLD := Color("#3f73b8")
const WARM := Color("#c4553f")
const GOLD := Color("#d99a1e")


class Sketch extends Control:
	var fn: Callable
	var t := 1.0
	func _draw() -> void:
		fn.call(self)


static func sketch(h: float, fn: Callable) -> Sketch:
	var c := Sketch.new()
	c.fn = fn
	c.custom_minimum_size = Vector2(0, h)
	c.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return c


## Draw a frost line from lo to hi on c. points: [{ v (float), label, col?, below? }]. den: small ticks every 1/den.
static func draw_line(c: Control, font: Font, lo: float, hi: float, den: int, points: Array, appear := 1.0) -> void:
	var w := c.size.x
	var h := c.size.y
	c.draw_rect(Rect2(0, 0, w, h), FROST_BG)
	var x0 := 34.0
	var x1 := w - 34.0
	var y := h * 0.52
	var X := func(v: float) -> float: return x0 + (v - lo) / (hi - lo) * (x1 - x0)
	c.draw_line(Vector2(x0 - 8, y), Vector2(x1 + 8, y), FROST_LINE, 3.0, true)
	var steps := int(round((hi - lo) * den))
	for i in steps + 1:
		var v := lo + float(i) / den
		var whole := absf(v - round(v)) < 0.0001
		var tx: float = X.call(v)
		c.draw_line(Vector2(tx, y - (9 if whole else 5)), Vector2(tx, y + (9 if whole else 5)), FROST_LINE, 2.0 if whole else 1.0)
		if whole:
			var s := str(int(round(v))).replace("-", "−")
			c.draw_string(font, Vector2(tx - 20, y + 28), s, HORIZONTAL_ALIGNMENT_CENTER, 40, 15, Color("#2c2925"))
	c.draw_string(font, Vector2(6, 18), "cold", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, COLD)
	c.draw_string(font, Vector2(w - 50, 18), "warm", HORIZONTAL_ALIGNMENT_RIGHT, 44, 14, WARM)
	var zx: float = X.call(0.0)
	for i in points.size():
		var p: Dictionary = points[i]
		var px: float = lerpf(zx, X.call(float(p.v)), clampf(appear, 0.0, 1.0))
		var col: Color = p.get("col", COLD if float(p.v) < 0 else (WARM if float(p.v) > 0 else Color("#2c2925")))
		c.draw_circle(Vector2(px, y), 7.0, col)
		c.draw_circle(Vector2(px, y), 7.0, Color.WHITE, false, 2.0, true)
		var below: bool = p.get("below", i % 2 == 1)
		c.draw_string(font, Vector2(px - 40, y + (44 if below else -16)), str(p.label), HORIZONTAL_ALIGNMENT_CENTER, 80, 15, col.darkened(0.25))


static func frost_line(T, lo: float, hi: float, den: int, points: Array, h := 96.0) -> Sketch:
	var font: Font = T.ui.font
	return sketch(h, func(c): draw_line(c, font, lo, hi, den, points, c.t))


## Points for a list of value strings.
static func pts(items: Array) -> Array:
	var out := []
	for s in items:
		var v: Array = Ch1.F(s)
		out.append({"v": Frac.to_float(v), "label": Frac.text(v)})
	return out


static func _feedback(T, l: Label, text: String, good: bool) -> void:
	l.text = T.fill(text)
	l.add_theme_color_override("font_color", UIScript.GOOD if good else UIScript.BAD)


# ── Hesper's worked example (the lesson) ──
static func worked_example(T) -> void:
	var steps := [
		["She marks −3/4 and −1/4 on the frost line. \"Which is colder?\"", ["-3/4", "-1/4"],
			"−3/4 is further from zero, on the cold side. So −3/4 is colder."],
		["\"Owing a quarter of a silver is better than owing three-quarters. Same with cold.\"", ["-3/4", "-1/4"],
			"−1/4 is warmer, so [b]−1/4 > −3/4[/b]. On the line, the greater number is always to the right."],
		["She writes −3/4 three ways. \"One point, three names.\"", ["-3/4"],
			"[b]−3/4 = 3/(−4) = −(3/4)[/b]. One negative sign, anywhere in the fraction, puts the point on the cold side."],
	]
	var st := {"i": 0}
	await T.box("frost_example", "Hesper's frost window", func(p, done):
		var body: VBoxContainer = p.body
		var top: RichTextLabel = T.ui.rich("")
		body.add_child(top)
		var pv := {"p": []}
		var line := sketch(100, func(c): draw_line(c, T.ui.font, -1.0, 1.0, 4, pv.p, c.t))
		body.add_child(line)
		var bottom: RichTextLabel = T.ui.rich("")
		body.add_child(bottom)
		var nxt: Button = T.ui.button("Next", true)
		p.foot.add_child(nxt)
		var show := func():
			var s: Array = steps[st.i]
			top.text = s[0]
			bottom.text = s[2]
			pv.p = pts(s[1])
			if st.i == 2:
				pv.p[0].label = "−3/4 = 3/(−4) = −(3/4)"
			nxt.text = "Next" if st.i < steps.size() - 1 else "Got it"
			if T.reduce_motion or st.i > 0:
				line.t = 1.0
				line.queue_redraw()
			else:   # the points slide out from zero to where they belong (the words above already say where)
				var tw: Tween = line.create_tween()
				tw.tween_method(func(v): line.t = v; line.queue_redraw(), 0.0, 1.0, 0.6)
		nxt.pressed.connect(func():
			if st.i < steps.size() - 1:
				st.i += 1
				show.call()
			else:
				done.call(true))
		show.call()
		nxt.call_deferred("grab_focus"), func(_how):
			for b in T.ui.modal_layer.find_children("*", "Button", true, false):
				if (b as Button).text in ["Next", "Got it"]:
					(b as Button).pressed.emit()
					return, "The lesson · RN1", true)


# ── Order cards on the frost line, least to greatest ──
## o = { key, label, title, kicker, prompt, items: [strings], lo, hi, den, hint?, hint_btn?, why?, who? }
static func order_line(T, o: Dictionary) -> String:
	var items: Array = o.items
	var answer: Array = Ch1.sorted(items)
	var max_tries := 3 if T.mode() == "gentle" else 2
	var st := {"picked": [], "tries": 0, "tier": "", "shown": false}
	var shuffled := items.duplicate()
	var rng := RandomNumberGenerator.new()
	rng.seed = hash(str(T.S.seed) + o.key)
	for i in range(shuffled.size() - 1, 0, -1):
		var j := rng.randi_range(0, i)
		var tmp = shuffled[i]
		shuffled[i] = shuffled[j]
		shuffled[j] = tmp
	var ui = T.ui
	var refs := {}
	var tier = await T.box("order", o.get("title", "Order them"), func(p, done):
		var body: VBoxContainer = p.body
		body.add_child(ui.rich(T.fill(o.prompt)))
		var pv := {"p": []}
		# Fine ticks (o.den) and the picked cards as points are a hint: Gentle only, after a wrong try. Until then
		# the line shows quarters at most, so ordering is the student's own work.
		var helped := func() -> bool: return st.tier != "" or (T.mode() == "gentle" and st.tries > 0)
		var line := sketch(100, func(c): draw_line(c, ui.font, float(o.lo), float(o.hi), int(o.get("den", 4)) if helped.call() else mini(int(o.get("den", 4)), 4),
			pv.p if st.tier != "" else (pts(st.picked) if helped.call() else []), 1.0))
		body.add_child(line)
		body.add_child(ui.label("Your order, least to greatest:", "Muted"))
		var mine: Label = ui.label("(tap the cards)", "Strong")
		body.add_child(mine)
		var flow := HFlowContainer.new()
		flow.add_theme_constant_override("h_separation", 8)
		flow.add_theme_constant_override("v_separation", 8)
		body.add_child(flow)
		var fb: Label = ui.label("", "Strong")
		body.add_child(fb)
		var hint_l: Label = ui.label("", "Muted")
		hint_l.visible = false
		body.add_child(hint_l)
		var again: Button = ui.button("Start again")
		var check: Button = ui.button("Check", true)
		var hint_b: Button = ui.button(o.get("hint_btn", "Ask Hesper"))
		hint_b.visible = false
		var cont: Button = ui.button("Continue", true)
		cont.visible = false
		for b in [hint_b, again, check, cont]:
			p.foot.add_child(b)
		var cards := {}
		var redraw := func():
			var bits := []
			for s in st.picked:
				bits.append(Frac.text(Ch1.F(s)))
			mine.text = "  <  ".join(bits) if bits.size() else "(tap the cards)"
			for s in cards:
				cards[s].disabled = st.picked.has(s) or st.tier != ""
			check.disabled = st.picked.size() != items.size() or st.tier != ""
			again.disabled = st.picked.is_empty() or st.tier != ""
			line.queue_redraw()
		for s in shuffled:
			var b: Button = ui.button(Frac.text(Ch1.F(s)))
			b.custom_minimum_size = Vector2(76, 50)
			var sv: String = s
			b.pressed.connect(func():
				if not st.picked.has(sv) and st.tier == "":
					st.picked.append(sv)
					redraw.call())
			flow.add_child(b)
			cards[s] = b
		again.pressed.connect(func():
			st.picked.clear()
			redraw.call())
		hint_b.pressed.connect(func():
			hint_l.text = T.fill(str(o.get("hint", "")))
			hint_l.visible = true
			hint_b.visible = false)
		var finish := func(t: String):
			st.tier = t
			T.record(o.key, o.label, t)
			pv.p = pts(answer)
			hint_b.visible = false
			cont.visible = true
			cont.call_deferred("grab_focus")
			redraw.call()
		check.pressed.connect(func():
			if st.tier != "" or st.picked.size() != items.size():
				return
			var ok := true
			for i in answer.size():
				if not Frac.eq(Ch1.F(st.picked[i]), Ch1.F(answer[i])):
					ok = false
			if ok:
				_feedback(T, fb, "Right: " + "  <  ".join(st.picked.map(func(s): return Frac.text(Ch1.F(s)))) + ".", true)
				finish.call(["first", "second", "third"][mini(st.tries, 2)])
				return
			st.tries += 1
			if st.tries >= max_tries:
				var right := "  <  ".join(answer.map(func(s): return Frac.text(Ch1.F(s))))
				_feedback(T, fb, "Not quite. The order is " + right + "." + ("\n" + str(o.why) if o.has("why") else ""), false)
				finish.call("later")
				return
			var msg := "Not yet."
			if T.mode() == "gentle":   # name the first pair that is out of order
				for i in st.picked.size() - 1:
					if not Frac.lt(Ch1.F(st.picked[i]), Ch1.F(st.picked[i + 1])):
						msg = "Not yet. Look again at %s and %s: which one sits further right on the frost line?" % [Frac.text(Ch1.F(st.picked[i])), Frac.text(Ch1.F(st.picked[i + 1]))]
						break
				hint_b.visible = o.has("hint") and not hint_l.visible
			else:
				msg = "Not yet. Try again."
			_feedback(T, fb, msg, false)
			st.picked.clear()
			redraw.call())
		cont.pressed.connect(func(): done.call(st.tier))
		refs.check = check
		refs.cont = cont
		refs.redraw = redraw
		redraw.call(), func(how):
			if refs.cont.visible:
				refs.cont.pressed.emit()
				return
			var seq: Array = answer.duplicate()
			if how == "wrong" or (how == "second" and st.tries == 0):
				var t = seq[0]   # one swap wrong
				seq[0] = seq[1]
				seq[1] = t
			st.picked = seq
			refs.redraw.call()
			refs.check.pressed.emit(), o.get("kicker", ""), true)
	return str(tier)


# ── The frost recipe: put the steps in order ──
## o = { key, label, title, kicker, prompt, cards: [[id, text]], answer: [ids], decoy_fb, why }
static func step_order(T, o: Dictionary) -> String:
	var cards_def: Array = o.cards.duplicate()
	var rng := RandomNumberGenerator.new()
	rng.seed = hash(str(T.S.seed) + o.key)
	for i in range(cards_def.size() - 1, 0, -1):
		var j := rng.randi_range(0, i)
		var tmp = cards_def[i]
		cards_def[i] = cards_def[j]
		cards_def[j] = tmp
	var text_of := {}
	for c in o.cards:
		text_of[c[0]] = c[1]
	var need: int = o.answer.size()
	var max_tries := 3 if T.mode() == "gentle" else 2
	var st := {"picked": [], "tries": 0, "tier": ""}
	var ui = T.ui
	var refs := {}
	var tier = await T.box("steps", o.get("title", "In what order?"), func(p, done):
		var body: VBoxContainer = p.body
		body.add_child(ui.rich(T.fill(o.prompt)))
		body.add_child(ui.label("Tap the %d steps in the order you'd do them. One card doesn't belong." % need, "Muted"))
		var mine: VBoxContainer = ui.vbox(4)
		body.add_child(mine)
		var flow := VBoxContainer.new()
		flow.add_theme_constant_override("separation", 6)
		body.add_child(flow)
		var fb: Label = ui.label("", "Strong")
		body.add_child(fb)
		var again: Button = ui.button("Start again")
		var check: Button = ui.button("Check", true)
		var cont: Button = ui.button("Continue", true)
		cont.visible = false
		for b in [again, check, cont]:
			p.foot.add_child(b)
		var btns := {}
		var redraw := func():
			for c in mine.get_children():
				c.queue_free()
			for i in st.picked.size():
				mine.add_child(ui.label("%d. %s" % [i + 1, text_of[st.picked[i]]], "Strong"))
			for id in btns:
				btns[id].disabled = st.picked.has(id) or st.picked.size() >= need or st.tier != ""
			check.disabled = st.picked.size() != need or st.tier != ""
			again.disabled = st.picked.is_empty() or st.tier != ""
		for c in cards_def:
			var b: Button = ui.button(c[1])
			b.alignment = HORIZONTAL_ALIGNMENT_LEFT
			var id: String = c[0]
			b.pressed.connect(func():
				if st.picked.size() < need and not st.picked.has(id):
					st.picked.append(id)
					redraw.call())
			flow.add_child(b)
			btns[id] = b
		again.pressed.connect(func():
			st.picked.clear()
			redraw.call())
		check.pressed.connect(func():
			if st.tier != "":
				return
			if st.picked == o.answer:
				st.tier = ["first", "second", "third"][mini(st.tries, 2)]
				_feedback(T, fb, "Right: brackets, then the exponent, then multiply, then add.", true)
			else:
				st.tries += 1
				var msg := "Not yet."
				if st.picked.has("decoy"):
					msg = str(o.decoy_fb)
				elif T.mode() == "gentle":
					msg = "Not yet. Which comes first: the exponent or the multiplying?"
				if st.tries >= max_tries:
					st.tier = "later"
					msg += "\nThe order is: " + ", then ".join(o.answer.map(func(id): return text_of[id].split(":")[0].to_lower())) + "." + ("\n" + str(o.why) if o.has("why") else "")
				_feedback(T, fb, msg, false)
				if st.tier == "":
					st.picked.clear()
			if st.tier != "":
				T.record(o.key, o.label, st.tier)
				cont.visible = true
				cont.call_deferred("grab_focus")
			redraw.call())
		cont.pressed.connect(func(): done.call(st.tier))
		refs.check = check
		refs.cont = cont
		refs.redraw = redraw
		redraw.call(), func(how):
			if refs.cont.visible:
				refs.cont.pressed.emit()
				return
			if how == "right" or (how == "second" and st.tries >= 1):
				st.picked = o.answer.duplicate()
			else:   # the misconception: multiply before squaring
				st.picked = ["bracket", "decoy", "square", "add"].slice(0, need)
			refs.redraw.call()
			refs.check.pressed.emit(), o.get("kicker", ""), true)
	return str(tier)


# ── The rune's test: a grain pie in sixths beside the stone's 2/5 ──
static func _pie(c: Control, centre: Vector2, r: float, parts: int, filled: Array, label: String, font: Font) -> void:
	c.draw_circle(centre, r, Color("#f6efe0"))
	var a0 := -PI / 2.0
	for i in parts:
		var a := a0 + TAU * i / parts
		var b := a0 + TAU * (i + 1) / parts
		if i < filled.size() and filled[i] != null:
			var pts2 := PackedVector2Array([centre])
			for k in 13:
				var t := lerpf(a, b, k / 12.0)
				pts2.append(centre + Vector2(cos(t), sin(t)) * r)
			c.draw_colored_polygon(pts2, filled[i])
		c.draw_line(centre, centre + Vector2(cos(a), sin(a)) * r, Color("#6b5a40"), 2.0, true)
	c.draw_arc(centre, r, 0, TAU, 48, Color("#6b5a40"), 2.5, true)
	c.draw_string(font, centre + Vector2(-90, r + 24), label, HORIZONTAL_ALIGNMENT_CENTER, 180, 15, Color("#2c2925"))


static func pie_test(T) -> void:
	var ui = T.ui
	var st := {"a": false, "b": false, "tried_a": false, "tried_b": false}
	var refs := {}
	await T.box("pie", "Test it: a grain pie in sixths", func(p, done):
		var body: VBoxContainer = p.body
		body.add_child(ui.rich("Orrin cuts a grain pie into [b]sixths[/b]. Beside it, the same size pie shows what the stone gives: [b]2/5[/b]."))
		var pies := sketch(200, func(c):
			var r := minf(72.0, c.size.x / 5.0)
			var fill := []
			for i in 6:
				fill.append(null)
			if st.a:
				for i in 3:
					fill[i] = Color("#e8b84a")
			if st.b:
				for i in 2:
					fill[3 + i] = Color("#c98a2e")
			var n := (3 if st.a else 0) + (2 if st.b else 0)
			_pie(c, Vector2(c.size.x * 0.28, 90), r, 6, fill, "1/2 + 1/3: %d sixths" % n if n > 0 else "Sixths", ui.font)
			_pie(c, Vector2(c.size.x * 0.72, 90), r, 5, [Color("#8b8e96"), Color("#8b8e96")], "The stone: 2/5", ui.font))
		body.add_child(pies)
		var rows := []
		for q in [["How many sixths make 1/2?", 3, "a", "Split the pie in half. How many sixths are in one half?"],
				["How many sixths make 1/3?", 2, "b", "Split the pie in three equal parts. How many sixths are in one of them?"]]:
			var row: HBoxContainer = ui.hbox(8)
			var l: Label = ui.label(q[0], "Strong", false)
			l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			row.add_child(l)
			var f := LineEdit.new()
			f.custom_minimum_size = Vector2(90, 46)
			row.add_child(f)
			var b: Button = ui.button("Check", true)
			row.add_child(b)
			body.add_child(row)
			rows.append({"field": f, "btn": b, "ans": q[1], "k": q[2], "hint": q[3]})
		var fb: Label = ui.label("", "Strong")
		body.add_child(fb)
		var sum: RichTextLabel = ui.rich("")
		body.add_child(sum)
		var cont: Button = ui.button("Continue", true)
		cont.visible = false
		p.foot.add_child(cont)
		rows[1].field.editable = false
		rows[1].btn.disabled = true
		for r in rows:
			var rr: Dictionary = r
			var go := func():
				if st[rr.k]:
					return
				var v = Frac.parse(rr.field.text)
				st["tried_" + rr.k] = true
				if v != null and Frac.eq(v, [rr.ans, 1]):
					st[rr.k] = true
					rr.field.editable = false
					rr.btn.disabled = true
					_feedback(T, fb, "Right: %d sixths." % rr.ans, true)
					if rr.k == "a":
						rows[1].field.editable = true
						rows[1].btn.disabled = false
						rows[1].field.call_deferred("grab_focus")
					pies.queue_redraw()
					if st.a and st.b:
						sum.text = "[b]1/2 + 1/3 = 3/6 + 2/6 = 5/6[/b] of the pie. The stone gives each household [b]2/5[/b]: less than half."
						cont.visible = true
						cont.call_deferred("grab_focus")
				else:
					_feedback(T, fb, "Count again. " + rr.hint, false)
			rr.btn.pressed.connect(go)
			rr.field.text_submitted.connect(func(_t): go.call())
		rows[0].field.call_deferred("grab_focus")
		cont.pressed.connect(func(): done.call(true))
		refs.rows = rows
		refs.cont = cont, func(how):
			if refs.cont.visible:
				refs.cont.pressed.emit()
				return
			for r in refs.rows:
				if not st[r.k]:
					r.field.text = str(r.ans + 1) if how == "wrong" and not st["tried_" + r.k] else str(r.ans)
					r.btn.pressed.emit()
					return, "The grain-share stone · Stage 2", true)


# ── A cart as a bar in equal parts (Gentle: the harvest) ──
static func bar(T, den: int, filled: int, label: String) -> Callable:
	return func(body: VBoxContainer):
		var font: Font = T.ui.font
		body.add_child(sketch(70, func(c):
			var x0 := 10.0
			var w: float = c.size.x - 20.0
			var seg: float = w / den
			for i in den:
				var r := Rect2(x0 + i * seg, 8, seg - 3, 34)
				c.draw_rect(r, Color("#e8b84a") if i < filled else Color("#f2ece0"))
				c.draw_rect(r, Color("#6b5a40"), false, 1.5)
			c.draw_string(font, Vector2(x0, 62), label, HORIZONTAL_ALIGNMENT_LEFT, w, 15, Color("#2c2925"))))
