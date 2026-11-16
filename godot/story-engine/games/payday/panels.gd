# Payday's panels, built on T.box (the game's own panel with a test-player move) and T.panel. No state of their own:
# what they decide comes back to the step that opened them. Tries: 3 in Gentle (with a hint after a wrong try), 2 in Real.
#
#   lines(T, o)    typed lines of a stub (or any set of amounts), each checked to ±2¢ → worst tier
#   sign(T, o)     a stub with at most one root mistake: flag a line and dispute it, or sign → { result, misses, tier }
#   pick(T, o)     choose the right option for each card (Town Hall proof, Pay-O-Matic's settings) → worst tier
#   plan(T, S, p)  how much moves to the goal jar on payday → cents
#   shifts / reveal / deposit / dial / job_pick: show what happened, or take a choice
extends RefCounted

const M = preload("res://games/payday/model.gd")
const X = preload("res://games/payday/text.gd")
const Money = preload("res://engine/core/money.gd")
const UI = preload("res://engine/ui/ui.gd")

const LINES := [
	{"k": "gross", "name": "Gross pay", "sub": "pay before deductions"}, {"k": "ei", "name": "EI", "sub": "Employment Insurance"},
	{"k": "cpp", "name": "CPP", "sub": "Canada Pension Plan"}, {"k": "tax", "name": "Income tax", "sub": "Canada and Alberta"},
	{"k": "net", "name": "Net pay", "sub": "take-home pay"}]


static func _worst(tiers: Array) -> String:
	if tiers.has("later"):
		return "later"
	return "second" if tiers.has("second") else "first"


static func _tier(tries: int) -> String:
	return ["first", "second", "later"][mini(tries - 1, 2)]


static func _max_tries(T) -> int:
	return 3 if T.mode() == "gentle" else 2


static func _col(l: Control, c: Color) -> void:
	l.add_theme_color_override("font_color", c)
	l.add_theme_color_override("default_color", c)


# ── Small pieces ──
## A two-column table: rows of [left, right]; bold: the row indexes in bold.
static func table(T, body: Control, rows: Array, cols := 2, bold := []) -> GridContainer:
	var g := GridContainer.new()
	g.columns = cols
	g.add_theme_constant_override("h_separation", 22)
	g.add_theme_constant_override("v_separation", 4)
	for i in rows.size():
		for c in cols:
			var l: Label = T.ui.label(str(rows[i][c]) if c < rows[i].size() else "", "Strong" if bold.has(i) else "", false)
			if c > 0:
				l.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
			if c == 0:
				l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			g.add_child(l)
	body.add_child(g)
	return g


## The Pay Card (2026): the three deductions and the income tax table.
static func pay_card(T, body: Control) -> void:
	body.add_child(T.ui.label("DEDUCTIONS", "Kicker"))
	table(T, body, [["EI: every worker, any age", "1.63% of gross pay"], ["CPP: workers 18 and older", "5.95% of (gross pay − $135)"],
		["Income tax: above the tax-free amount", "the row nearest your gross pay"]])
	body.add_child(T.ui.label("INCOME TAX EVERY TWO WEEKS", "Kicker"))
	var rows := [["Gross pay", "Income tax", "Gross pay", "Income tax"]]
	for i in 9:
		var a: Array = M.PAY_CARD[i]
		var b = M.PAY_CARD[i + 9] if i + 9 < M.PAY_CARD.size() else null
		rows.append(["$300 to $600" if i == 0 else Money.fmt_w(a[0] * 100), Money.fmt(a[1]), Money.fmt_w(b[0] * 100) if b != null else "–", Money.fmt(b[1]) if b != null else "–"])
	table(T, body, rows, 4, [0])
	body.add_child(T.ui.label("Estimates using 2026 tax rates. Tax-free amounts: Canada $16,452, Alberta $22,769 a year. A gross pay exactly halfway between two rows takes the higher row.", "Muted"))


## A button that shows and hides a section (the Pay Card inside a panel, where the Bag cannot open).
static func fold(T, body: Control, title: String, build: Callable) -> void:
	var box: VBoxContainer = T.ui.vbox(6)
	box.visible = false
	var b: Button = T.ui.button("Show " + title)
	b.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	b.pressed.connect(func():
		box.visible = not box.visible
		b.text = ("Hide " if box.visible else "Show ") + title)
	body.add_child(b)
	build.call(T, box)
	body.add_child(box)


static func card_fold(T, body: Control) -> void:
	fold(T, body, "the Pay Card", pay_card)


## A paper document: a heading row, then the content.
static func doc(T, body: Control, left: String, right: String) -> VBoxContainer:
	var pc := PanelContainer.new()
	pc.add_theme_stylebox_override("panel", T.ui._box(Color.WHITE, UI.LINE, 10, 2, 12))
	var v: VBoxContainer = T.ui.vbox(4)
	pc.add_child(v)
	var h: HBoxContainer = T.ui.hbox(8)
	var a: Label = T.ui.label(left, "Strong", false)
	a.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	h.add_child(a)
	h.add_child(T.ui.label(right, "Muted", false))
	v.add_child(h)
	v.add_child(HSeparator.new())
	body.add_child(pc)
	return v


## One stub line: name (and a small note), the amount on the right. ded: shown with a minus, in red; net: green.
static func stub_line(T, box: Control, name: String, sub: String, amount: String, ded := false, net := false) -> Label:
	var h: HBoxContainer = T.ui.hbox(8)
	var col: VBoxContainer = T.ui.vbox(0)
	col.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	col.add_child(T.ui.label(name, "Strong", false))
	if sub != "":
		col.add_child(T.ui.label(sub, "Muted", false))
	h.add_child(col)
	var a: Label = T.ui.label(("−" if ded else "") + amount, "Strong", false)
	a.custom_minimum_size.x = 120
	a.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	if ded:
		_col(a, UI.BAD)
	if net:
		_col(a, UI.GOOD)
	h.add_child(a)
	box.add_child(h)
	return a


## A short stub (Case notes, Town Hall, the test run): hours, commission, gross, the deductions, net.
static func mini_stub(T, body: Control, biz: String, type: String, st: Dictionary, app := "Pay-O-Matic 3000") -> void:
	var v := doc(T, body, biz, "%s · age %d" % [app, int(st.age)])
	if type == "wage" or type == "commission":
		stub_line(T, v, "Hours worked", "", "%d h" % int(st.hours))
	if type == "commission":
		stub_line(T, v, "Commission", "", Money.fmt(st.comm))
	stub_line(T, v, "Gross pay", "", Money.fmt(st.gross))
	stub_line(T, v, "EI", "", Money.fmt(st.ei), true)
	stub_line(T, v, "CPP", "", Money.fmt(st.cpp), true)
	stub_line(T, v, "Income tax", "", Money.fmt(st.tax), true)
	stub_line(T, v, "Net pay", "", Money.fmt(st.net), false, true)


## A stub's five lines as fields for lines(): answers from st, hints for Gentle.
static func stub_fields(st: Dictionary, gross_hint: String, with_gross := true) -> Array:
	var g := int(st.gross)
	var f := []
	if with_gross:
		f.append({"k": "gross", "name": "Gross pay", "sub": "pay before deductions", "ans": g, "hint": gross_hint})
	f.append({"k": "ei", "name": "EI", "sub": "1.63% of gross pay", "ans": st.ei, "hint": "EI is 1.63% of gross pay: 0.0163 × gross.", "ded": true})
	f.append({"k": "cpp", "name": "CPP", "sub": "5.95% of (gross − $135), from age 18", "ans": st.cpp, "ded": true,
		"hint": "Under 18: no CPP. Type 0." if int(st.age) < 18 else "CPP is 5.95% of (gross pay − $135)."})
	var rw := M.row_of(g)
	f.append({"k": "tax", "name": "Income tax", "sub": "the Pay Card row", "ans": st.tax, "ded": true,
		"alt": [M.tax_at_row(rw - 100)] if g % 10000 == 5000 else [],
		"hint": "Find the Pay Card row nearest the gross pay: the %s row%s." % [Money.fmt_w(rw * 100), " ($300 to $600)" if rw == 600 else ""]})
	f.append({"k": "net", "name": "Net pay", "sub": "take-home pay", "ans": st.net, "net": true, "hint": "Gross pay − (EI + CPP + income tax)."})
	return f


# ── Typed lines ──
## o = { kind, title, kicker, intro (bbcode), head: Callable(T, body), card: bool, fields: [{ k, name, sub, ans, hint, alt, ded, net }],
##       key (records key + "-" + k), label (record label prefix), check ("Check"), go ("Continue"), all_done: Callable(T, p) }
static func lines(T, o: Dictionary) -> String:
	var st := {"u": {}, "go": null, "check": null}
	var maxt := _max_tries(T)
	var fields: Array = o.fields
	var build := func(p: Dictionary, done: Callable) -> void:
		var body: VBoxContainer = p.body
		if o.has("intro"):
			body.add_child(T.ui.rich(T.fill(o.intro)))
		if o.has("head"):
			o.head.call(T, body)
		if o.get("card", false):
			card_fold(T, body)
		var paper := doc(T, body, str(o.get("doc", "")), str(o.get("doc_right", ""))) if o.has("doc") else body
		for f in fields:
			var h: HBoxContainer = T.ui.hbox(8)
			var col: VBoxContainer = T.ui.vbox(0)
			col.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			col.add_child(T.ui.label(f.name, "Strong", false))
			if f.get("sub", "") != "":
				col.add_child(T.ui.label(f.sub, "Muted"))
			var hint: Label = T.ui.label("", "Muted")
			hint.visible = false
			_col(hint, UI.BAD)
			col.add_child(hint)
			h.add_child(col)
			var e := LineEdit.new()
			e.placeholder_text = "$0.00"
			e.custom_minimum_size = Vector2(140, 44)
			e.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
			h.add_child(e)
			var mark: Label = T.ui.label("", "Strong", false)
			mark.custom_minimum_size.x = 26
			h.add_child(mark)
			paper.add_child(h)
			st.u[f.k] = {"tries": 0, "tier": "", "e": e, "mark": mark, "hint": hint, "f": f}
		var fb: Label = T.ui.label("", "Muted")
		body.add_child(fb)
		var check: Button = T.ui.button(o.get("check", "Check"), true)
		var go: Button = T.ui.button(o.get("go", "Continue"), true)
		go.visible = false
		p.foot.add_child(check)
		p.foot.add_child(go)
		st.check = check
		st.go = go
		var do_check := func() -> void:
			var first_open = null
			for f in fields:
				var u: Dictionary = st.u[f.k]
				if u.tier != "":
					continue
				var v = Money.parse(u.e.text)
				if v == null:
					if first_open == null:
						first_open = u.e
					continue
				u.tries += 1
				var right: bool = Money.close(v, f.ans)
				for a in f.get("alt", []):
					right = right or Money.close(v, a)
				if right or u.tries >= maxt:
					u.tier = _tier(u.tries) if right else "later"
					u.e.text = Money.fmt(f.ans) if not right else u.e.text
					u.e.editable = false
					u.mark.text = "✓" if right else "•"
					_col(u.mark, UI.GOOD if right else UI.MUTED)
					u.hint.visible = not right
					u.hint.text = "The answer is %s. %s" % [Money.fmt(f.ans), f.get("hint", "")] if not right else ""
					_col(u.hint, UI.MUTED)
					if o.has("key"):
						T.record("%s-%s" % [o.key, f.k], "%s%s" % [o.get("label", ""), f.name], u.tier, {"typed": Money.fmt(v), "answer": f.ans})
				else:
					u.mark.text = "✗"
					_col(u.mark, UI.BAD)
					u.hint.visible = true
					u.hint.text = ("Not yet. " + str(f.get("hint", ""))) if T.mode() == "gentle" else "Not yet."
					if first_open == null:
						first_open = u.e
			var all := true
			for f in fields:
				all = all and st.u[f.k].tier != ""
			if all:
				check.visible = false
				go.visible = true
				go.call_deferred("grab_focus")
				fb.text = "Every line is checked."
				if o.has("all_done"):
					o.all_done.call(T, p)
			else:
				fb.text = "Fill in every line, then check." if first_open != null and Money.parse(first_open.text) == null else ""
				if first_open != null:
					first_open.call_deferred("grab_focus")
		check.pressed.connect(do_check)
		for f in fields:
			st.u[f.k].e.text_submitted.connect(func(_t): do_check.call())
		go.pressed.connect(func():
			var tiers := []
			for f in fields:
				tiers.append(st.u[f.k].tier)
			done.call(_worst(tiers)))
		st.u[fields[0].k].e.call_deferred("grab_focus")
	var solve := func(how: String) -> void:
		if st.go.visible:
			st.go.pressed.emit()
			return
		for f in fields:
			var u: Dictionary = st.u[f.k]
			if u.tier == "":
				u.e.text = Money.fmt(f.ans) if how == "right" or (how == "second" and u.tries >= 1) else Money.fmt(int(f.ans) + 1000)
		st.check.pressed.emit()
	return await T.box(o.get("kind", "lines"), o.title, build, solve, o.get("kicker", ""), o.get("wide", false))


# ── Sign or dispute ──
## o = { title, kicker, intro, facts, biz, right_head, rows: [{ k, name, sub, val, ded, net }], root ("" = no mistake), explain: Callable(k),
##       follows: { k: true } (lines that are wrong only because a line above is), voice (who speaks the replies, "" = narrator text),
##       sign_label, go, story (no "Leave it"), key, label }
static func sign(T, o: Dictionary) -> Dictionary:
	var st := {"flag": "", "misses": 0, "warned": false, "out": null, "btns": {}, "msg": null, "dispute": null, "sign": null, "go": null, "body": null}
	var root: String = o.get("root", "")
	var finish := func(result: String, line: String, good: bool) -> void:
		var tier: String = "later" if result == "signed" else ("first" if st.misses == 0 else ("second" if st.misses == 1 else "later"))
		st.out = {"result": result, "misses": st.misses, "tier": tier}
		if o.has("key"):
			T.record(o.key, o.label + (" (it had a mistake)" if root != "" else " (it was right)"), tier)
		for c in st.body.get_children():
			c.queue_free()
		var banner: Label = T.ui.label(line, "Strong")
		_col(banner, UI.GOOD if good else UI.BAD)
		st.body.add_child(banner)
		if result != "signed" and o.has("caught_note"):
			st.body.add_child(T.ui.label(o.caught_note, ""))
		st.dispute.visible = false
		st.sign.visible = false
		st.go.visible = true
		st.go.call_deferred("grab_focus")
	var say := func(t: String) -> void:
		st.msg.text = (str(o.voice) + ": " if str(o.get("voice", "")) != "" else "") + t
		_col(st.msg, UI.BAD)
	var dispute := func() -> void:
		if st.flag == "":
			return
		if root != "" and st.flag == root:
			finish.call("caught", str(o.get("caught_line", "Caught it! That line was wrong.")), true)
			return
		st.misses += 1
		say.call("That line is wrong because a line above it is wrong. Where does the mistake start?" if root != "" and o.follows.get(st.flag, false) else o.explain.call(st.flag))
		st.btns[st.flag].button_pressed = false
		st.flag = ""
		st.dispute.disabled = true
	var do_sign := func() -> void:
		if root == "":
			finish.call("ok", str(o.get("ok_line", "Every line checks out. Signed!")), true)
			return
		if T.mode() == "gentle" and not st.warned:
			st.warned = true
			st.misses += 1
			st.msg.text = "Wait! One line does not match the facts or the Pay Card. Check again, or sign anyway."
			_col(st.msg, UI.BAD)
			return
		finish.call("signed", str(o.get("signed_line", "Signed, with a mistake on it.")), false)
	var build := func(p: Dictionary, done: Callable) -> void:
		var body: VBoxContainer = p.body
		st.body = body
		body.add_child(T.ui.rich(T.fill(o.intro) + " Is a line wrong? Tap [b]Flag[/b] beside it, then dispute it."))
		body.add_child(T.ui.label(o.facts, "Strong"))
		card_fold(T, body)
		var v := doc(T, body, o.biz, o.get("right_head", ""))
		var group := ButtonGroup.new()
		group.allow_unpress = true
		for r in o.rows:
			var h: HBoxContainer = T.ui.hbox(8)
			var col: VBoxContainer = T.ui.vbox(0)
			col.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			col.add_child(T.ui.label(r.name, "Strong", false))
			col.add_child(T.ui.label(r.sub, "Muted", false))
			h.add_child(col)
			var a: Label = T.ui.label(r.val, "Strong", false)
			a.custom_minimum_size.x = 110
			a.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
			if r.get("ded", false):
				_col(a, UI.BAD)
			if r.get("net", false):
				_col(a, UI.GOOD)
			h.add_child(a)
			var b: Button = T.ui.button("Flag")
			b.toggle_mode = true
			b.button_group = group
			b.custom_minimum_size = Vector2(84, 40)
			b.tooltip_text = "Flag the %s line" % r.name
			var k: String = r.k
			b.toggled.connect(func(on):
				st.flag = k if on else ("" if st.flag == k else st.flag)
				b.text = "Flagged" if on else "Flag"
				st.dispute.disabled = st.flag == "")
			h.add_child(b)
			st.btns[k] = b
			v.add_child(h)
		st.msg = T.ui.label("", "Strong")
		body.add_child(st.msg)
		if T.mode() == "gentle":
			body.add_child(T.ui.label(o.get("gentle", "Gentle hint: start at the top. Compare the hours (or salary) with the facts, then work out each deduction."), "Muted"))
		st.dispute = T.ui.button("Dispute the flagged line")
		st.dispute.disabled = true
		st.sign = T.ui.button(o.get("sign_label", "Sign it"), true)
		st.go = T.ui.button(o.get("go", "Done"), true)
		st.go.visible = false
		st.dispute.pressed.connect(dispute)
		st.sign.pressed.connect(do_sign)
		st.go.pressed.connect(func(): done.call(st.out))
		for b in [st.dispute, st.sign, st.go]:
			p.foot.add_child(b)
	var solve := func(how: String) -> void:
		if st.out != null:
			st.go.pressed.emit()
			return
		var decoy := ""
		for r in o.rows:
			if r.k != root and not o.follows.get(r.k, false):
				decoy = r.k
				break
		if decoy == "":   # every other line follows from the mistake: flag one of those ("look earlier")
			decoy = "net" if root != "net" else o.rows[0].k
		if root == "":
			if how == "right" or (how == "second" and st.misses >= 1) or (how == "wrong" and st.misses >= 2):
				do_sign.call()
			else:
				st.btns[decoy].button_pressed = true
				dispute.call()
		elif how == "right" or (how == "second" and st.misses >= 1):
			st.btns[root].button_pressed = true
			dispute.call()
		elif how == "second":
			st.btns[decoy].button_pressed = true
			dispute.call()
		else:
			do_sign.call()
	return await T.box(o.get("kind", "sign"), o.title, build, solve, o.get("kicker", ""), true)


## The rows of a stub to check, from a printed stub st. t: { type, yearly, rate, pct } of the job.
static func sign_rows(type: String, st: Dictionary, pct: float, yearly: int) -> Array:
	var rows := []
	if type == "salary":
		rows.append({"k": "salary", "name": "Salary", "sub": Money.fmt_w(yearly) + " ÷ 26", "val": Money.fmt(st.gross)})
	elif type != "given":
		rows.append({"k": "hours", "name": "Hours worked", "sub": "at %s an hour" % Money.fmt(st.rate), "val": "%d h" % int(st.hours)})
		if type == "commission":
			rows.append({"k": "comm", "name": "Commission", "sub": "%d%% of %s in sales" % [roundi(pct * 100), Money.fmt_w(st.sales)], "val": Money.fmt(st.comm)})
	rows.append({"k": "gross", "name": "Gross pay", "sub": "pay before deductions", "val": Money.fmt(st.gross)})
	rows.append({"k": "ei", "name": "EI", "sub": "1.63% of gross", "val": "−" + Money.fmt(st.ei), "ded": true})
	rows.append({"k": "cpp", "name": "CPP", "sub": "none under 18" if int(st.age) < 18 else "5.95% of (gross − $135)", "val": "−" + Money.fmt(st.cpp), "ded": true})
	rows.append({"k": "tax", "name": "Income tax", "sub": "Pay Card row", "val": "−" + Money.fmt(st.tax), "ded": true})
	rows.append({"k": "net", "name": "Net pay", "sub": "take-home pay", "val": Money.fmt(st.net), "net": true})
	return rows


## Why a flagged line checks out. right: the stub as it should be; st: as printed; t: hours, sales, pct, yearly.
static func explain(k: String, st: Dictionary, right: Dictionary, pct: float, yearly: int) -> String:
	match k:
		"hours":
			return "The timesheet says %d hours. That matches." % int(right.hours)
		"comm":
			return "%d%% of %s is %s. That matches." % [roundi(pct * 100), Money.fmt_w(right.sales), Money.fmt(right.comm)]
		"salary":
			return "%s ÷ 26 = %s. That matches." % [Money.fmt_w(yearly), Money.fmt(right.gross)]
		"gross":
			return "Gross pay adds up from the lines above it."
		"ei":
			return "1.63%% of %s is %s. That matches." % [Money.fmt(st.gross), Money.fmt(M.ei_of(st.gross))]
		"cpp":
			return "No CPP under 18, and none was taken." if int(st.age) < 18 else "5.95%% of (%s − $135) is %s. That matches." % [Money.fmt(st.gross), Money.fmt(M.cpp_of(st.gross, st.age))]
		"tax":
			return "The Pay Card row for %s is %s. That matches." % [Money.fmt(st.gross), Money.fmt(M.tax_of(st.gross))]
	return "Net pay is gross minus the deductions. That subtraction is right."


## Lines that are wrong only because a line above them is (an hours or commission mistake moves everything after it).
static func follows(root: String) -> Dictionary:
	var up := root == "hours" or root == "comm"
	return {"gross": up, "net": root != "", "ei": up, "cpp": up, "tax": up}


# ── Pick the right option on each card ──
## o = { kind, title, intro, card, cards: [{ id, title, facts, show: Callable(T, body), opts: [labels], ans (index), start (index or -1), hint }],
##       key, label, check, go, fin_line }
static func pick(T, o: Dictionary) -> String:
	var st := {"u": {}, "check": null, "go": null}
	var maxt := _max_tries(T)
	var build := func(p: Dictionary, done: Callable) -> void:
		var body: VBoxContainer = p.body
		body.add_child(T.ui.rich(T.fill(o.intro)))
		if o.get("card", true):
			card_fold(T, body)
		var fb: Label = T.ui.label("", "Strong")
		for c in o.cards:
			var v: VBoxContainer = T.ui.vbox(4)
			if c.get("title", "") != "":
				v.add_child(T.ui.label(c.title, "Strong"))
			if c.get("facts", "") != "":
				v.add_child(T.ui.label(c.facts, "Muted"))
			if c.has("show"):
				c.show.call(T, v)
			var ob := OptionButton.new()
			ob.custom_minimum_size = Vector2(0, 44)
			ob.fit_to_longest_item = false
			var off := 0
			if int(c.get("start", -1)) < 0:
				ob.add_item(str(c.get("placeholder", "Choose one…")))
				off = 1
			for i in c.opts.size():
				ob.add_item(c.opts[i])
			ob.select(off + int(c.start) if int(c.get("start", -1)) >= 0 else 0)
			v.add_child(ob)
			var note: Label = T.ui.label("", "Muted")
			v.add_child(note)
			v.add_child(HSeparator.new())
			body.add_child(v)
			st.u[c.id] = {"ob": ob, "off": off, "note": note, "tries": 0, "tier": "", "c": c}
		body.add_child(fb)
		var check: Button = T.ui.button(o.get("check", "Check"), true)
		var go: Button = T.ui.button(o.get("go", "Done"), true)
		go.visible = false
		p.foot.add_child(check)
		p.foot.add_child(go)
		st.check = check
		st.go = go
		check.pressed.connect(func():
			for c in o.cards:
				var u: Dictionary = st.u[c.id]
				if u.tier != "":
					continue
				var v: int = u.ob.selected - u.off
				if v < 0:
					u.note.text = "Choose one."
					continue
				u.tries += 1
				var right: bool = v == int(c.ans)
				if right or u.tries >= maxt:
					u.tier = _tier(u.tries) if right else "later"
					u.ob.select(u.off + int(c.ans))
					u.ob.disabled = true
					u.note.text = "✓ Right." if right else "It was this one: " + str(c.opts[c.ans]) + "."
					_col(u.note, UI.GOOD if right else UI.MUTED)
					if o.has("key"):
						T.record("%s-%s" % [o.key, c.id], o.label + c.get("title", c.get("name", c.id)), u.tier)
				else:
					u.note.text = ("Not that one. " + str(c.get("hint", ""))) if T.mode() == "gentle" else "Not that one. Look again."
					_col(u.note, UI.BAD)
			var all := true
			for c in o.cards:
				all = all and st.u[c.id].tier != ""
			if all:
				fb.text = str(o.get("fin_line", "Every one is done."))
				_col(fb, UI.GOOD)
				check.visible = false
				go.visible = true
				go.call_deferred("grab_focus")
				if o.has("all_done"):
					o.all_done.call(T, body))
		go.pressed.connect(func():
			var tiers := []
			for c in o.cards:
				tiers.append(st.u[c.id].tier)
			done.call(_worst(tiers)))
	var solve := func(how: String) -> void:
		if st.go.visible:
			st.go.pressed.emit()
			return
		for c in o.cards:
			var u: Dictionary = st.u[c.id]
			if u.tier == "":
				var wrong: int = (int(c.ans) + 1) % c.opts.size()
				u.ob.select(u.off + (int(c.ans) if how == "right" or (how == "second" and u.tries >= 1) else wrong))
		st.check.pressed.emit()
	return await T.box(o.get("kind", "pick"), o.title, build, solve, o.get("kicker", ""), true)


# ── Plan payday at the kitchen table ──
static func plan(T, S: Dictionary, p: int) -> int:
	var pd: Dictionary = S.pd
	var r: Dictionary = pd.run
	var j: Dictionary = M.JOBS[r.job]
	var sc := M.schedule_of(r, p)
	var bills := M.bills_of(r.worker)
	var st := {"jar": int(pd.get("plan", 0)), "e": null, "save": null}
	var build := func(pp: Dictionary, done: Callable) -> void:
		var body: VBoxContainer = pp.body
		var v := doc(T, body, "The next two weeks", j.biz)
		if j.type == "salary":
			v.add_child(T.ui.rich("Salary: [b]%s[/b] a year, in 26 equal pays." % Money.fmt_w(sc.yearly)))
		else:
			var new18 := " (new: you are 18)" if j.has("rate18") and r.worker == "avery" and p == int(M.WORKERS.avery.turns18) else ""
			v.add_child(T.ui.rich("Hours on the schedule: [b]%d h[/b] × [b]%s[/b] an hour%s" % [sc.hours, Money.fmt(sc.rate), new18]))
		if j.type == "commission":
			v.add_child(T.ui.rich("Expected sales: about [b]%s[/b]. You earn %d%% of what you really sell." % [Money.fmt_w(sc.sales), roundi(float(j.pct) * 100)]))
		if j.type == "tips":
			v.add_child(T.ui.rich("Expected cash tips: about [b]%s[/b]. Tips go straight to you, not on the stub." % Money.fmt_w(sc.tips)))
		var notes := []
		if sc.note != "":
			notes.append(sc.note)
		if sc.perf > 0:
			notes.append("+%d h: great work last shift" % sc.perf)
		if sc.perf < 0:
			notes.append("−%d h: your last shift went poorly" % -sc.perf)
		if p > 1 and sc.raises > M.perf_of(r, p - 1).raises:
			notes.append("Raise: " + ("+%s a year" % Money.fmt_w(M.RAISE_SALARY) if j.type == "salary" else "+%s an hour" % Money.fmt(M.RAISE_WAGE)))
		if sc.cut_risk:
			notes.append("⚠ Slow season: hours might be cut by up to %d" % sc.cut_risk)
		if p == 5 and bool(r.extra) and j.type != "salary":
			notes.append("+%d extra hours" % M.extra_hours(r.worker))
		if notes.size():
			var n: Label = T.ui.label(" · ".join(notes), "Strong")
			_col(n, UI.ACCENT_DARK)
			v.add_child(n)
		body.add_child(T.ui.label("BILLS ON THE FRIDGE (EVERY TWO WEEKS)", "Kicker"))
		var rows := []
		for b in M.WORKERS[r.worker].bills:
			rows.append([b[1], Money.fmt_w(b[2])])
		rows.append(["Total", Money.fmt_w(bills)])
		table(T, body, rows, 2, [rows.size() - 1])
		if p == 1:
			body.add_child(T.ui.rich("[b]No pay stub yet.[/b] Plan with what you know about the job."))
		body.add_child(T.ui.label("How much moves to your goal jar on payday?", "Strong"))
		var h: HBoxContainer = T.ui.hbox(8)
		var minus: Button = T.ui.button("−25")
		var e := LineEdit.new()
		e.custom_minimum_size = Vector2(150, 46)
		e.text = "%.2f" % (st.jar / 100.0)
		var plus: Button = T.ui.button("+25")
		minus.tooltip_text = "25 dollars less"
		plus.tooltip_text = "25 dollars more"
		h.add_child(minus)
		h.add_child(e)
		h.add_child(plus)
		body.add_child(h)
		st.e = e
		var eq: RichTextLabel = T.ui.rich("")
		var chk: Label = T.ui.label("", "Strong")
		body.add_child(eq)
		body.add_child(chk)
		body.add_child(T.ui.label("Tip: your Pay Card is in your Bag.", "Muted"))
		var upd := func() -> void:
			var x = Money.parse(e.text)
			if x != null:
				st.jar = clampi(int(x), 0, 500000)
			eq.text = "Out on payday: bills %s + jar %s = [b]%s[/b]. In the bank now: %s." % [Money.fmt_w(bills), Money.fmt(st.jar), Money.fmt(bills + st.jar), Money.fmt(r.bank)]
			if T.mode() == "gentle" and int(pd.ch) >= 1:
				var safe: bool = int(r.bank) + M.safe_take_home(r, p) - bills - st.jar >= 0
				chk.text = "✓ Looks safe if the pay comes in as planned." if safe else "⚠ Careful: after deductions, this plan may not leave enough for the bills."
				_col(chk, UI.GOOD if safe else UI.BAD)
		e.text_changed.connect(func(_t): upd.call())
		minus.pressed.connect(func():
			st.jar = maxi(0, st.jar - 2500)
			e.text = "%.2f" % (st.jar / 100.0)
			upd.call())
		plus.pressed.connect(func():
			st.jar = mini(500000, st.jar + 2500)
			e.text = "%.2f" % (st.jar / 100.0)
			upd.call())
		var save: Button = T.ui.button("Save the plan", true, func():
			upd.call()
			done.call(st.jar))
		pp.foot.add_child(save)
		st.save = save
		e.text_submitted.connect(func(_t): save.pressed.emit())
		upd.call()
	var solve := func(how: String) -> void:
		var jar := M.careful_jar(r, p)
		if how == "wrong":   # plans with the gross pay, as if nothing came off
			var g := M.gross_from(j, sc.hours, sc.rate, sc.sales, sc.yearly) + int(sc.tips)
			jar = maxi(0, (int(r.bank) + g - bills) / 2500 * 2500)
		st.e.text = "%.2f" % (jar / 100.0)
		st.e.text_changed.emit(st.e.text)
		st.save.pressed.emit()
	return int(await T.box("plan", "Paycheque %d of 8: plan payday" % p, build, solve))


# ── Two weeks at work: the shifts on a calendar, and what happened ──
static func shifts(T, S: Dictionary, p: int) -> void:
	var r: Dictionary = S.pd.run
	var j: Dictionary = M.JOBS[r.job]
	var a := M.actual_of(r, p)
	var sc := M.schedule_of(r, p)
	var ev := []
	if a.perf > 0:
		ev.append([UI.GOOD, "Your great shift last time earned you %d more hours this paycheque." % a.perf])
	if a.perf < 0:
		ev.append([UI.BAD, "After your last shift, your boss gave %d of your hours to someone else." % -a.perf])
	if p > 1 and a.raises > M.perf_of(r, p - 1).raises:
		ev.append([UI.GOOD, "Your raise starts this paycheque: " + (Money.fmt_w(a.yearly) + " a year." if j.type == "salary" else Money.fmt(a.rate) + " an hour.")])
	if a.cut:
		ev.append([UI.BAD, "Slow week: your boss cut %d hours. You worked %d hours." % [a.cut, a.hours]])
	if a.extra:
		ev.append([UI.BODY if j.type == "salary" else UI.GOOD, "You worked %d extra hours on the weekends%s" % [a.extra, ". A salary stays the same." if j.type == "salary" else "."]])
	if j.type == "commission":
		ev.append([UI.GOOD if a.sales >= sc.sales else UI.BODY, "You sold %s (expected about %s)." % [Money.fmt_w(a.sales), Money.fmt_w(sc.sales)]])
	if j.type == "tips":
		ev.append([UI.BODY, "Cash tips: %s, straight into your pocket." % Money.fmt_w(a.tips)])
	if ev.is_empty():
		ev.append([UI.BODY, "A normal two weeks: %d hours." % (sc.hours if j.type == "salary" else a.hours)])
	# the calendar: 4-hour shifts on a part-time job, 8-hour days on a full-time one; cut days struck out
	var hours: int = sc.hours - a.extra
	var per := 8 if hours >= 60 else 4
	var days := []
	days.resize(14)
	days.fill(0)
	var order := [0, 1, 2, 3, 4, 7, 8, 9, 10, 11, 5, 12]
	var left := hours
	for i in order:
		if left <= 0:
			break
		days[i] = mini(per, left)
		left -= days[i]
	if a.extra:
		days[5] = a.extra / 2
		days[12] = a.extra / 2
	var cut_left: int = a.cut
	for i in range(13, -1, -1):
		if cut_left <= 0:
			break
		if days[i] > 0 and not (a.extra and (i == 5 or i == 12)):
			cut_left -= days[i]
			days[i] = -days[i]
	await T.panel("Paycheque %d of 8: two weeks at %s" % [p, j.biz], func(body):
		var g := GridContainer.new()
		g.columns = 7
		g.add_theme_constant_override("h_separation", 6)
		g.add_theme_constant_override("v_separation", 6)
		var names := ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
		for i in 14:
			var pc := PanelContainer.new()
			var d: int = days[i]
			var bg := UI.BAD_LIGHT if d < 0 else (UI.GOOD_LIGHT if a.extra and (i == 5 or i == 12) else (Color.WHITE if d > 0 else UI.ACCENT_LIGHT))
			pc.add_theme_stylebox_override("panel", T.ui._box(bg, UI.LINE, 8, 1, 6))
			pc.custom_minimum_size = Vector2(62, 52)
			var v: VBoxContainer = T.ui.vbox(0)
			v.add_child(T.ui.label(names[i % 7], "Muted", false))
			if d != 0:
				var l: Label = T.ui.label(("cut " if d < 0 else "") + "%d h" % absi(d), "Strong", false)
				if d < 0:
					_col(l, UI.BAD)
				v.add_child(l)
			pc.add_child(v)
			g.add_child(pc)
		body.add_child(g)
		for e in ev:
			var l: Label = T.ui.label("• " + e[1], "Strong")
			_col(l, e[0])
			body.add_child(l)
		body.add_child(T.ui.label("Your timesheet is saved in your Bag with this paycheque.", "Muted")), [["Payday →", true, true]], "Work", true)


static func given_text(j: Dictionary, a: Dictionary) -> String:
	if j.type == "salary":
		return "Salary %s a year ÷ 26 pays%s" % [Money.fmt_w(a.yearly), " (you worked %d extra hours)" % a.extra if a.extra else ""]
	var s := "%d hours × %s" % [a.hours, Money.fmt(a.rate)]
	if j.type == "commission":
		s += " + %d%% of %s in sales" % [roundi(float(j.pct) * 100), Money.fmt_w(a.sales)]
	return s


## Chapter 1: the stub fills itself in, and net pay counts down from the gross.
static func reveal(T, S: Dictionary, p: int) -> void:
	var r: Dictionary = S.pd.run
	var j: Dictionary = M.JOBS[r.job]
	var a := M.actual_of(r, p)
	var stub: Dictionary = a.stub
	var build := func(body):
		var v := doc(T, body, j.biz, "Age %d · paycheque %d" % [a.age, p])
		v.add_child(T.ui.label(given_text(j, a), "Muted"))
		var net: Label
		for L in LINES:
			var k: String = L.k
			var lab := stub_line(T, v, L.name, L.sub, Money.fmt(stub[k]), k in ["ei", "cpp", "tax"], k == "net")
			if k == "net":
				net = lab
		body.add_child(T.ui.rich("The job promised [b]%s[/b]%s. Only [b]%s[/b] goes into your account. Where did [b]%s[/b] go?" % [
			Money.fmt(stub.gross), " (plus %s in cash tips)" % Money.fmt_w(a.tips) if a.tips else "", Money.fmt(stub.net), Money.fmt(stub.total)]))
		if not T.reduce_motion and T.auto == "":
			var tw: Tween = net.create_tween()
			var show := func(x: float): net.text = Money.fmt(roundi(x))
			show.call(float(stub.gross))
			tw.tween_interval(0.5)
			tw.tween_method(show, float(stub.gross), float(stub.net), 0.6)
	await T.panel("Paycheque %d: your pay stub" % p, build, [["Deposit it", true, true]], "The bank")


## After payday: money in, bills out, the jar, and any bounce.
static func deposit(T, S: Dictionary, l: Dictionary) -> void:
	var r: Dictionary = S.pd.run
	var Wk: Dictionary = M.WORKERS[r.worker]
	var inn: int = int(l.stub.net) - int(l.get("short", 0)) + int(l.tips)
	var mx := maxi(maxi(inn, int(l.bills) + int(l.jar_in)), 1)
	await T.panel("Paycheque %d: deposited" % int(l.p), func(body):
		for row in [["Take-home in", inn, UI.GOOD], ["Bills out", int(l.bills), UI.BAD], ["To the jar", int(l.jar_in), UI.GOLD]]:
			var h: HBoxContainer = T.ui.hbox(10)
			var a: Label = T.ui.label(row[0], "Strong", false)
			a.custom_minimum_size.x = 130
			h.add_child(a)
			var bar := ProgressBar.new()
			bar.show_percentage = false
			bar.max_value = mx
			bar.value = maxi(row[1], mx / 100)
			bar.custom_minimum_size = Vector2(0, 20)
			bar.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			bar.size_flags_vertical = Control.SIZE_SHRINK_CENTER
			var fill := StyleBoxFlat.new()
			fill.bg_color = row[2]
			fill.set_corner_radius_all(6)
			bar.add_theme_stylebox_override("fill", fill)
			var bg := StyleBoxFlat.new()
			bg.bg_color = UI.ACCENT_LIGHT
			bg.set_corner_radius_all(6)
			bar.add_theme_stylebox_override("background", bg)
			h.add_child(bar)
			var v: Label = T.ui.label(Money.fmt(row[1]), "Strong", false)
			v.custom_minimum_size.x = 100
			v.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
			h.add_child(v)
			body.add_child(h)
		var jar := ProgressBar.new()
		jar.max_value = int(Wk.goal)
		jar.value = mini(int(r.jar), int(Wk.goal))
		jar.custom_minimum_size = Vector2(0, 26)
		body.add_child(T.ui.rich("Goal jar: [b]%s[/b] of %s for %s." % [Money.fmt(r.jar), Money.fmt_w(Wk.goal), Wk.goal_label]))
		body.add_child(jar)
		if int(l.get("short", 0)) > 0:
			var s: Label = T.ui.label("The stub you signed paid you %s less than you earned." % Money.fmt(l.short), "Strong")
			_col(s, UI.BAD)
			body.add_child(s)
		var b: Label
		if bool(l.bounced):
			var extra := (" This one does not count against you yet." if int(l.p) < M.STRIKE_FROM else (" Bounces this game: %d of %d." % [int(r.strikes), M.STRIKES_TO_LOSE] if T.mode() == "real" else ""))
			b = T.ui.label("Not enough money for everything. A payment bounced, and the bank charged a %s fee. Your bank is at %s.%s" % [Money.fmt_w(M.FEE), Money.fmt(l.bank), extra], "Strong")
			_col(b, UI.BAD)
		else:
			b = T.ui.label("Every bill was paid. %s is left in your account." % Money.fmt(l.bank), "Strong")
			_col(b, UI.GOOD)
		body.add_child(b), [["OK", true, true]], "The bank")


## The job board: work out each posting's gross pay, then take one. Returns the job key.
static func job_board(T, S: Dictionary) -> String:
	var jobs: Array = M.WORKERS[S.pd.run.worker].jobs
	var fields := []
	for k in jobs:
		var j: Dictionary = M.JOBS[k]
		var q := X.offer_q(j)
		fields.append({"k": k, "name": "%s · %s" % [j.biz, j.title], "sub": "%s %s\n%s:" % [j.what, X.pay_text(j), q.text], "ans": q.ans, "hint": q.how})
	await lines(T, {"kind": "offers", "title": "Job board", "kicker": "Job Centre", "wide": true, "fields": fields, "key": "offer", "label": "Gross pay: ",
		"intro": "Work out the [b]gross pay[/b] for each posting: the pay before anything is taken off. Then pick one.", "go": "Choose a job"})
	var buttons := []
	for i in jobs.size():
		buttons.append(["Take the %s job" % M.JOBS[jobs[i]].title.to_lower(), jobs[i], i == (int(S.seed) / 3) % 3])   # the test player takes the marked one
	var build := func(body):
		for k in jobs:
			var j: Dictionary = M.JOBS[k]
			body.add_child(T.ui.rich("[b]%s[/b], %s: %s %s. Gross pay for the first two weeks: [b]%s[/b]." % [j.title, j.biz, j.what, X.pay_text(j), Money.fmt(X.offer_q(j).ans)]))
	return str(await T.panel("Pick a job", build, buttons, "Job board"))


## Town Hall: the tax dial, then a claim with a reason and a trade-off (saved as typed answers for the report).
static func dial(T, S: Dictionary) -> void:
	var lg: Array = S.pd.run.log
	var g := 0
	for l in lg:
		g += int(l.stub.gross)
	g = M.jr(float(g) / lg.size()) if lg.size() else 0
	var base := M.ab_tax_year(g)
	var st := {"k": 0.0, "claim": "", "reason": null, "trade": null, "go": null, "info": null, "claims": {}}
	var build := func(p: Dictionary, done: Callable) -> void:
		var body: VBoxContainer = p.body
		body.add_child(T.ui.rich("Councillor Wright: Alberta takes [b]8%[/b] income tax on yearly pay above [b]$22,769[/b] (2026). What if we changed the rate?"))
		var row := HFlowContainer.new()
		row.add_theme_constant_override("h_separation", 6)
		var g1 := ButtonGroup.new()
		var info: RichTextLabel = T.ui.rich("")
		st.info = info
		var show := func() -> void:
			var now := M.jr(base * (1.0 + st.k))
			var per := M.jr((now - base) / 26.0)
			if base == 0:
				info.text = "[b]You pay no Alberta income tax.[/b] Your yearly pay (about %s) is under $22,769, so the dial does not change your pay. You still use schools, roads and hospitals that taxes pay for." % Money.fmt_w(M.jr(g * 26.0 / 10000.0) * 10000)
			else:
				var t := "Your Alberta income tax: about [b]%s[/b] a year." % Money.fmt_w(M.jr(now / 100.0) * 100)
				if st.k != 0.0:
					t += " (Now %s.) Your take-home pay would go [b]%s[/b] every two weeks." % [Money.fmt_w(M.jr(base / 100.0) * 100), ("up by " + Money.fmt(-per)) if per < 0 else ("down by " + Money.fmt(per))]
				t += "\nIf your tax were split the way Alberta spends (Budget 2026–27): health (41%%) %s, education (13%%) %s, everything else (46%%) %s. Tax really goes into one big pot." % [
					Money.fmt_w(M.jr(now * M.AB_HEALTH / 100.0) * 100), Money.fmt_w(M.jr(now * M.AB_EDU / 100.0) * 100), Money.fmt_w(M.jr(now * (1 - M.AB_HEALTH - M.AB_EDU) / 100.0) * 100)]
				info.text = t
		for x in [-0.5, -0.25, 0.0, 0.25, 0.5]:
			var b: Button = T.ui.button("%s%%%s" % [str(snappedf(8 * (1 + x), 0.01)), " (now)" if x == 0.0 else ""])
			b.toggle_mode = true
			b.button_group = g1
			b.button_pressed = x == 0.0
			var xx: float = x
			b.pressed.connect(func():
				st.k = xx
				show.call())
			row.add_child(b)
		body.add_child(row)
		body.add_child(info)
		show.call()
		body.add_child(T.ui.rich("[b]Less tax:[/b] more take-home pay for every worker. Less money for hospitals, schools and roads, or the province borrows.\n[b]More tax:[/b] more money for services, like shorter hospital waits or smaller classes. Less take-home pay for every worker."))
		body.add_child(T.ui.label("Your claim: should more or less tax come off pay?", "Strong"))
		var row2 := HFlowContainer.new()
		row2.add_theme_constant_override("h_separation", 6)
		var g2 := ButtonGroup.new()
		var upd := func() -> void:
			st.go.disabled = not (st.claim != "" and st.reason.text.strip_edges().length() >= 8 and st.trade.text.strip_edges().length() >= 8)
		for c in ["Less tax", "Keep it the same", "More tax"]:
			var b: Button = T.ui.button(c)
			b.toggle_mode = true
			b.button_group = g2
			var cc: String = c
			b.pressed.connect(func():
				st.claim = cc
				upd.call())
			st.claims[c] = b
			row2.add_child(b)
		body.add_child(row2)
		for f in [["reason", "One reason:"], ["trade", "One trade-off (what would be lost):"]]:
			body.add_child(T.ui.label(f[1], "Strong"))
			var te := TextEdit.new()
			te.custom_minimum_size = Vector2(0, 70)
			te.wrap_mode = TextEdit.LINE_WRAPPING_BOUNDARY
			te.text_changed.connect(func(): upd.call())
			body.add_child(te)
			st[f[0]] = te
		body.add_child(T.ui.label("There is no wrong side, but you need a reason and a trade-off. Use it as a first draft for Path B of your project.", "Muted"))
		st.go = T.ui.button("Save my opinion", true, func():
			S.typed["claim"] = {"prompt": "Tax claim: should more or less tax come off pay?", "text": st.claim}
			S.typed["reason"] = {"prompt": "One reason", "text": st.reason.text.strip_edges()}
			S.typed["tradeoff"] = {"prompt": "One trade-off (what would be lost)", "text": st.trade.text.strip_edges()}
			done.call(true))
		p.foot.add_child(st.go)
		upd.call()
	var solve := func(_how: String) -> void:
		st.claims["Keep it the same"].pressed.emit()
		st.reason.text = "Test player: taxes pay for the hospital that fixed the broken wrist."
		st.trade.text = "Test player: workers keep a little less of every paycheque."
		st.reason.text_changed.emit()
		st.go.pressed.emit()
	await T.box("dial", "Town Hall: the tax dial", build, solve, "Town Hall", true)
