# The interface layer: theme (CEFL ochre), the top bar, the dialogue box, panels, title cards, confetti.
# Town calls these; nothing here knows the story. Every open box sets `open` so the world stops taking input.
extends CanvasLayer

const Art = preload("res://engine/world/art.gd")

signal next_pressed
signal choice_made(i: int)

const ACCENT := Color("#94631a")
const ACCENT_DARK := Color("#6b4510")
const ACCENT_LIGHT := Color("#fbf3e6")
const GOLD := Color("#f5b82e")
const INK := Color("#1f1d1a")
const BODY := Color("#2c2925")
const MUTED := Color("#6b665d")
const LINE := Color("#e6e0d4")
const PAPER := Color("#fffdf8")
const GOOD := Color("#2c7a4b")
const GOOD_LIGHT := Color("#e8f5ec")
const BAD := Color("#b42318")
const BAD_LIGHT := Color("#fdecea")

var font: Font
var bold: Font
var theme: Theme
var root: Control
var hud: PanelContainer
var hud_left: HFlowContainer
var hud_goal: Label
var hud_buttons: HBoxContainer
var say_box: PanelContainer
var say_portrait
var say_name: Label
var say_text: RichTextLabel
var say_actions: Container
var modal_layer: Control
var banner_box: Control
var fx_layer: Control
var open := 0                      # boxes open now
var reduce_motion := false


func _ready() -> void:
	layer = 5
	font = load("res://fonts/atkinson.woff2")
	bold = FontVariation.new()
	bold.base_font = font
	bold.variation_opentype = {TextServerManager.get_primary_interface().name_to_tag("wght"): 750}
	theme = _make_theme()
	root = Control.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.theme = theme
	add_child(root)
	_build_hud()
	_build_say()
	modal_layer = Control.new()
	modal_layer.set_anchors_preset(Control.PRESET_FULL_RECT)
	modal_layer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(modal_layer)
	fx_layer = Control.new()
	fx_layer.set_anchors_preset(Control.PRESET_FULL_RECT)
	fx_layer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(fx_layer)


# ── Theme ──
func _box(bg: Color, border := Color.TRANSPARENT, radius := 10, bw := 0, pad := 10) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = bg
	s.border_color = border
	s.set_border_width_all(bw)
	s.set_corner_radius_all(radius)
	s.set_content_margin_all(pad)
	s.anti_aliasing = true
	return s


func _make_theme() -> Theme:
	var t := Theme.new()
	t.default_font = font
	t.default_font_size = 17
	t.set_color("font_color", "Label", BODY)
	t.set_stylebox("panel", "PanelContainer", _box(PAPER, LINE, 12, 2, 14))
	var normal := _box(Color.WHITE, Color("#d9d2c4"), 9, 2, 10)
	normal.content_margin_left = 16
	normal.content_margin_right = 16
	var hover := normal.duplicate()
	hover.bg_color = ACCENT_LIGHT
	hover.border_color = ACCENT
	var pressed := hover.duplicate()
	pressed.bg_color = Color("#f3e3c3")
	var focus := _box(Color.TRANSPARENT, Color("#1d4ed8"), 11, 3, 0)
	focus.expand_margin_left = 3
	focus.expand_margin_right = 3
	focus.expand_margin_top = 3
	focus.expand_margin_bottom = 3
	var disabled := normal.duplicate()
	disabled.bg_color = Color("#f2efe9")
	disabled.border_color = LINE
	for k in [["normal", normal], ["hover", hover], ["pressed", pressed], ["focus", focus], ["disabled", disabled]]:
		t.set_stylebox(k[0], "Button", k[1])
	t.set_color("font_color", "Button", INK)
	t.set_color("font_hover_color", "Button", ACCENT_DARK)
	t.set_color("font_pressed_color", "Button", ACCENT_DARK)
	t.set_color("font_focus_color", "Button", INK)
	t.set_color("font_disabled_color", "Button", Color("#a39d92"))
	t.set_font("font", "Button", bold)
	t.set_constant("h_separation", "Button", 6)
	# Primary: the main action in a box
	t.add_type("Primary")
	t.set_type_variation("Primary", "Button")
	var pn := _box(ACCENT, ACCENT_DARK, 9, 2, 10)
	pn.content_margin_left = 18
	pn.content_margin_right = 18
	var ph := pn.duplicate()
	ph.bg_color = ACCENT_DARK
	t.set_stylebox("normal", "Primary", pn)
	t.set_stylebox("hover", "Primary", ph)
	t.set_stylebox("pressed", "Primary", ph)
	var pd := pn.duplicate()
	pd.bg_color = Color("#c9b28c")
	pd.border_color = Color("#c9b28c")
	t.set_stylebox("disabled", "Primary", pd)
	for c in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
		t.set_color(c, "Primary", Color.WHITE)
	t.set_color("font_disabled_color", "Primary", Color(1, 1, 1, 0.85))
	# Inputs
	var le := _box(Color.WHITE, Color("#bdb5a6"), 8, 2, 10)
	var lef := le.duplicate()
	lef.border_color = Color("#1d4ed8")
	for ty in ["LineEdit", "TextEdit"]:
		t.set_stylebox("normal", ty, le)
		t.set_stylebox("focus", ty, lef)
		t.set_color("font_color", ty, INK)
		t.set_font_size("font_size", ty, 18)
	t.set_color("default_color", "RichTextLabel", BODY)
	t.set_font("bold_font", "RichTextLabel", bold)
	t.set_font_size("normal_font_size", "RichTextLabel", 17)
	t.set_font_size("bold_font_size", "RichTextLabel", 17)
	# Labels that act as headings and small caps
	t.add_type("Title")
	t.set_type_variation("Title", "Label")
	t.set_font("font", "Title", bold)
	t.set_font_size("font_size", "Title", 23)
	t.set_color("font_color", "Title", INK)
	t.add_type("Kicker")
	t.set_type_variation("Kicker", "Label")
	t.set_font("font", "Kicker", bold)
	t.set_font_size("font_size", "Kicker", 13)
	t.set_color("font_color", "Kicker", ACCENT)
	t.add_type("Muted")
	t.set_type_variation("Muted", "Label")
	t.set_font_size("font_size", "Muted", 15)
	t.set_color("font_color", "Muted", MUTED)
	t.add_type("Strong")
	t.set_type_variation("Strong", "Label")
	t.set_font("font", "Strong", bold)
	t.set_color("font_color", "Strong", INK)
	t.set_color("font_color", "CheckBox", INK)
	t.set_stylebox("panel", "ScrollContainer", StyleBoxEmpty.new())
	return t


# ── Small builders ──
func label(text: String, variation := "", wrap := true) -> Label:
	var l := Label.new()
	l.text = text
	if variation != "":
		l.theme_type_variation = variation
	if wrap:
		l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	return l


func rich(bbcode: String) -> RichTextLabel:
	var r := RichTextLabel.new()
	r.bbcode_enabled = true
	r.fit_content = true
	r.scroll_active = false
	r.text = bbcode
	r.mouse_filter = Control.MOUSE_FILTER_PASS
	return r


func button(text: String, primary := false, cb := Callable()) -> Button:
	var b := Button.new()
	b.text = text
	b.custom_minimum_size = Vector2(0, 46)
	if primary:
		b.theme_type_variation = "Primary"
	if cb.is_valid():
		b.pressed.connect(cb)
	return b


func hbox(sep := 8) -> HBoxContainer:
	var h := HBoxContainer.new()
	h.add_theme_constant_override("separation", sep)
	return h


func vbox(sep := 8) -> VBoxContainer:
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", sep)
	return v


func chip(text_label: String, value: String, warn := false) -> PanelContainer:
	var p := PanelContainer.new()
	p.add_theme_stylebox_override("panel", _box(BAD_LIGHT if warn else Color.WHITE, BAD if warn else LINE, 8, 2, 6))
	var h := hbox(6)
	var a := label(text_label.to_upper(), "Kicker", false)
	a.add_theme_font_size_override("font_size", 12)
	if warn:
		a.add_theme_color_override("font_color", BAD)
	var b := label(value, "Strong", false)
	if warn:
		b.add_theme_color_override("font_color", BAD)
	h.add_child(a)
	h.add_child(b)
	a.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	p.add_child(h)
	return p


## A small square that draws a product picture.
class Pic extends Control:
	var what := ""
	var look := {}
	func _draw() -> void:
		if what == "portrait":
			draw_circle(size / 2, size.x / 2, Color("#fbf3e6"), true, -1.0, true)
			Art.head(self, look, size.x / 2, size.y / 2 - 2, size.x * 0.24)
		else:
			Art.product_icon(self, what, size.x / 2, size.y / 2, size.x)


func pic(what: String, px := 36, look := {}) -> Control:
	var c := Pic.new()
	c.what = what
	c.look = look
	c.custom_minimum_size = Vector2(px, px)
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return c


# ── Top bar ──
func _build_hud() -> void:
	hud = PanelContainer.new()
	var hs := _box(Color(1, 0.99, 0.97, 0.95), LINE, 0, 0, 6)
	hs.border_width_bottom = 3
	hs.border_color = ACCENT
	hud.add_theme_stylebox_override("panel", hs)
	hud.set_anchors_preset(Control.PRESET_TOP_WIDE)
	var rows := vbox(4)
	hud.add_child(rows)
	var row := hbox(8)
	rows.add_child(row)
	hud_left = HFlowContainer.new()
	hud_left.add_theme_constant_override("h_separation", 6)
	hud_left.add_theme_constant_override("v_separation", 6)
	hud_left.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(hud_left)
	var goal_wrap := hbox(6)
	goal_wrap.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var gk := label("GOAL", "Kicker", false)
	gk.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	goal_wrap.add_child(gk)
	hud_goal = label("", "Strong", false)
	hud_goal.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hud_goal.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	hud_goal.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	goal_wrap.add_child(hud_goal)
	hud_buttons = hbox(6)
	hud_buttons.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
	row.add_child(hud_buttons)
	rows.add_child(goal_wrap)
	root.add_child(hud)
	hud.visible = false


func set_hud(chips: Array, goal_text: String) -> void:
	for c in hud_left.get_children():
		c.queue_free()
	for c in chips:
		hud_left.add_child(chip(c.label, c.value, c.get("warn", false)))
	hud_goal.text = goal_text
	hud_goal.tooltip_text = goal_text


func add_hud_button(text: String, cb: Callable) -> Button:
	var b := button(text, false, cb)
	b.custom_minimum_size = Vector2(0, 44)
	hud_buttons.add_child(b)
	return b


# ── Dialogue box ──
func _build_say() -> void:
	say_box = PanelContainer.new()
	say_box.set_anchors_preset(Control.PRESET_BOTTOM_WIDE)
	say_box.offset_left = 12
	say_box.offset_right = -12
	say_box.offset_bottom = -12
	say_box.grow_vertical = Control.GROW_DIRECTION_BEGIN
	say_box.add_theme_stylebox_override("panel", _box(PAPER, ACCENT, 14, 3, 14))
	var row := hbox(14)
	say_box.add_child(row)
	say_portrait = pic("portrait", 76)
	say_portrait.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
	row.add_child(say_portrait)
	var col := vbox(6)
	col.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(col)
	say_name = label("", "Kicker", false)
	say_name.add_theme_font_size_override("font_size", 15)
	col.add_child(say_name)
	say_text = rich("")
	say_text.add_theme_font_size_override("normal_font_size", 19)
	say_text.add_theme_font_size_override("bold_font_size", 19)
	col.add_child(say_text)
	say_actions = HFlowContainer.new()
	say_actions.add_theme_constant_override("h_separation", 8)
	say_actions.add_theme_constant_override("v_separation", 8)
	col.add_child(say_actions)
	say_box.visible = false
	root.add_child(say_box)


## Shows one line. look = {} hides the portrait. choices = [] shows "Next".
func show_say(who_name: String, look: Dictionary, text: String, choices: Array) -> void:
	if not say_box.visible:
		open += 1
	say_box.visible = true
	say_name.text = who_name.to_upper()
	say_name.visible = who_name != ""
	say_portrait.visible = not look.is_empty()
	say_portrait.look = look
	say_portrait.queue_redraw()
	say_text.text = text
	for c in say_actions.get_children():
		c.queue_free()
	if choices.is_empty():
		var b := button("Next", true, func(): next_pressed.emit())
		say_actions.add_child(b)
		b.call_deferred("grab_focus")
	else:
		for i in choices.size():
			var b := button("%d. %s" % [i + 1, choices[i]], false, _choice_cb(i))
			b.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
			b.alignment = HORIZONTAL_ALIGNMENT_LEFT
			b.custom_minimum_size = Vector2(minf(560, get_viewport().get_visible_rect().size.x - 160), 46)
			say_actions.add_child(b)
			if i == 0:
				b.call_deferred("grab_focus")


func _choice_cb(i: int) -> Callable:
	return func(): choice_made.emit(i)


func hide_say() -> void:
	if say_box.visible:
		open -= 1
	say_box.visible = false


func _unhandled_key_input(ev: InputEvent) -> void:
	if not say_box.visible or not ev.pressed or ev.echo:
		return
	if ev.keycode >= KEY_1 and ev.keycode <= KEY_9:
		var i: int = ev.keycode - KEY_1
		if i < say_actions.get_child_count() and say_actions.get_child_count() > 1:
			choice_made.emit(i)
			get_viewport().set_input_as_handled()


# ── Panels: a dimmed screen with a card. Returns the card's body (a VBox) and footer (an HFlow) ──
func open_panel(title: String, kicker := "", wide := false) -> Dictionary:
	open += 1
	var dim := ColorRect.new()
	dim.color = Color(0.12, 0.1, 0.08, 0.45)
	dim.set_anchors_preset(Control.PRESET_FULL_RECT)
	dim.mouse_filter = Control.MOUSE_FILTER_STOP
	modal_layer.add_child(dim)
	var center := CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	dim.add_child(center)
	var card := PanelContainer.new()
	var vs := get_viewport().get_visible_rect().size
	card.custom_minimum_size = Vector2(minf(780.0 if wide else 620.0, vs.x - 24), 0)
	center.add_child(card)
	var col := vbox(10)
	card.add_child(col)
	if kicker != "":
		col.add_child(label(kicker.to_upper(), "Kicker", false))
	if title != "":
		col.add_child(label(title, "Title"))
	var scroll := ScrollContainer.new()
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	scroll.custom_minimum_size = Vector2(0, 0)
	col.add_child(scroll)
	var body := vbox(10)
	body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(body)
	var foot := HFlowContainer.new()
	foot.add_theme_constant_override("h_separation", 8)
	foot.alignment = FlowContainer.ALIGNMENT_END
	col.add_child(foot)
	# the body scrolls once the card would pass the screen
	var fit := func():
		var avail := get_viewport().get_visible_rect().size.y - 40 - (col.get_combined_minimum_size().y - scroll.get_combined_minimum_size().y)
		scroll.custom_minimum_size.y = minf(body.get_combined_minimum_size().y, maxf(120.0, avail))
	body.minimum_size_changed.connect(fit)
	fit.call_deferred()
	if not reduce_motion:
		card.modulate.a = 0.0
		card.pivot_offset = card.custom_minimum_size / 2
		var tw := create_tween().set_parallel()
		tw.tween_property(card, "modulate:a", 1.0, 0.14)
	return {"dim": dim, "card": card, "body": body, "foot": foot, "scroll": scroll}


func close_panel(p: Dictionary) -> void:
	if is_instance_valid(p.dim):
		p.dim.queue_free()
		open -= 1


# ── Effects (after a check or a choice only; never block input; the words are already on the page) ──
func banner(kicker: String, title: String) -> void:
	for c in fx_layer.get_children():
		if c.name.begins_with("Banner"):
			c.queue_free()
	var box := PanelContainer.new()
	box.name = "Banner"
	box.mouse_filter = Control.MOUSE_FILTER_IGNORE
	box.add_theme_stylebox_override("panel", _box(Color(0.12, 0.1, 0.08, 0.86), Color.TRANSPARENT, 14, 0, 18))
	var col := vbox(2)
	col.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var k := label(kicker.to_upper(), "Kicker", false)
	k.add_theme_color_override("font_color", GOLD)
	k.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var t := label(title, "Title", false)
	t.add_theme_color_override("font_color", Color.WHITE)
	t.add_theme_font_size_override("font_size", 28)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	col.add_child(k)
	col.add_child(t)
	box.add_child(col)
	fx_layer.add_child(box)
	box.set_anchors_and_offsets_preset(Control.PRESET_CENTER_TOP, Control.PRESET_MODE_MINSIZE)
	box.position.y = 90
	box.modulate.a = 0.0
	var tw := create_tween()
	tw.tween_property(box, "modulate:a", 1.0, 0.01 if reduce_motion else 0.25)
	tw.tween_interval(1.6)
	tw.tween_property(box, "modulate:a", 0.0, 0.01 if reduce_motion else 0.4)
	tw.tween_callback(box.queue_free)


func toast(text: String, good := true) -> void:
	var box := PanelContainer.new()
	box.mouse_filter = Control.MOUSE_FILTER_IGNORE
	box.add_theme_stylebox_override("panel", _box(GOOD_LIGHT if good else BAD_LIGHT, GOOD if good else BAD, 10, 2, 10))
	var l := label(text, "Strong", false)
	l.add_theme_color_override("font_color", GOOD if good else BAD)
	box.add_child(l)
	fx_layer.add_child(box)
	box.set_anchors_and_offsets_preset(Control.PRESET_CENTER_TOP, Control.PRESET_MODE_MINSIZE)
	box.position.y = 64
	var tw := create_tween()
	tw.tween_interval(2.2)
	tw.tween_property(box, "modulate:a", 0.0, 0.01 if reduce_motion else 0.35)
	tw.tween_callback(box.queue_free)


func confetti(n := 60) -> void:
	if reduce_motion:
		return
	var vs := get_viewport().get_visible_rect().size
	var cols := [GOLD, Color("#e2574c"), Color("#3f8fd2"), Color("#4caf7a"), Color("#8a63c8")]
	for i in n:
		var r := ColorRect.new()
		r.mouse_filter = Control.MOUSE_FILTER_IGNORE
		r.color = cols[i % cols.size()]
		r.size = Vector2(8, 12)
		r.pivot_offset = r.size / 2
		r.position = Vector2(randf() * vs.x, -20 - randf() * 120)
		fx_layer.add_child(r)
		var tw := create_tween().set_parallel()
		var dur := randf_range(1.4, 2.4)
		tw.tween_property(r, "position", r.position + Vector2(randf_range(-80, 80), vs.y + 160), dur).set_ease(Tween.EASE_IN)
		tw.tween_property(r, "rotation", randf_range(-8, 8), dur)
		tw.chain().tween_callback(r.queue_free)


## Clicking finishes running effects (games rule: a click ends every effect).
func skip_fx() -> void:
	for c in fx_layer.get_children():
		c.queue_free()
