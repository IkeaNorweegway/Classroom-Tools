# Exact rational numbers for typed maths answers. No nodes.
# A fraction is [num, den] with den > 0, in lowest terms.
#   Frac.parse("-5/12"), Frac.parse("−5⁄12"), Frac.parse("3/(-4)"), Frac.parse("6 1/4"), Frac.parse("6.25 °C")  → [n, d] or null
#   Frac.check(typed, answer) → { ok, value, simplest, close, empty }
#     ok: the same number (equivalent forms count); simplest: typed in lowest terms (a decimal or whole number always is);
#     close: a rounded decimal of a repeating answer (like −0.33 for −1/3), which is not counted as a try.
extends RefCounted

const MAX_DIGITS := 12


static func gcd(a: int, b: int) -> int:
	a = absi(a)
	b = absi(b)
	while b != 0:
		var t := a % b
		a = b
		b = t
	return a if a != 0 else 1


static func make(n: int, d: int) -> Array:
	if d == 0:
		return []
	if d < 0:
		n = -n
		d = -d
	var g := gcd(n, d)
	return [n / g, d / g]


static func add(a: Array, b: Array) -> Array: return make(a[0] * b[1] + b[0] * a[1], a[1] * b[1])
static func sub(a: Array, b: Array) -> Array: return make(a[0] * b[1] - b[0] * a[1], a[1] * b[1])
static func mul(a: Array, b: Array) -> Array: return make(a[0] * b[0], a[1] * b[1])
static func div(a: Array, b: Array) -> Array: return make(a[0] * b[1], a[1] * b[0])
static func eq(a: Array, b: Array) -> bool: return a.size() == 2 and b.size() == 2 and a[0] * b[1] == b[0] * a[1]
static func lt(a: Array, b: Array) -> bool: return a[0] * b[1] < b[0] * a[1]
static func to_float(a: Array) -> float: return float(a[0]) / float(a[1])
static func neg(a: Array) -> Array: return [-a[0], a[1]]
static func pow_i(a: Array, k: int) -> Array:
	var r := [1, 1]
	for i in k:
		r = mul(r, a)
	return r


## "−5/12", "3", "−1 1/2" (mixed: set mixed = true). Uses the true minus sign.
static func text(a: Array, mixed := false) -> String:
	var n: int = a[0]
	var d: int = a[1]
	var sign := "−" if n < 0 else ""
	n = absi(n)
	if d == 1:
		return sign + str(n)
	if mixed and n > d:
		return "%s%d %d/%d" % [sign, n / d, n % d, d]
	return "%s%d/%d" % [sign, n, d]


## A decimal answer as text when it ends (6.25, −4.75); otherwise the fraction.
static func dec_text(a: Array) -> String:
	if not terminates(a):
		return text(a)
	var s := ("%.6f" % to_float(a)).rstrip("0").rstrip(".")
	return s.replace("-", "−")


## Does the decimal end? (Only 2s and 5s in the denominator.)
static func terminates(a: Array) -> bool:
	var d: int = a[1]
	while d % 2 == 0:
		d /= 2
	while d % 5 == 0:
		d /= 5
	return d == 1


static func _clean(s: String) -> String:
	s = s.strip_edges()
	for m in ["−", "–", "—", "‒", "﹣", "－"]:
		s = s.replace(m, "-")
	s = s.replace("⁄", "/").replace("∕", "/").replace("÷", "/").replace(",", ".")
	# a unit after the number: °C, C, "families", "cart" …
	var re := RegEx.create_from_string("[\\s°]*[A-Za-z°]+[A-Za-z\\s.]*$")
	s = re.sub(s, "")
	return s.strip_edges()


## Parse what a student typed. Returns [n, d] (lowest terms) or null. Also returns the raw form in out (if given):
## out.form = "int" | "dec" | "frac" | "mixed", out.raw = [n, d] before reducing.
static func parse(typed: String, out = null) -> Variant:
	var s := _clean(typed)
	if s == "":
		return null
	var r: RegExMatch
	# mixed number: -6 1/4
	r = RegEx.create_from_string("^([+-]?)\\s*(\\d+)\\s+(\\d+)\\s*/\\s*(\\d+)$").search(s)
	if r:
		if (r.get_string(2) + r.get_string(3) + r.get_string(4)).length() > MAX_DIGITS:
			return null
		var w := int(r.get_string(2))
		var n := int(r.get_string(3))
		var d := int(r.get_string(4))
		if d == 0 or n >= d:
			return null
		var sg := -1 if r.get_string(1) == "-" else 1
		if out is Dictionary:
			out.form = "mixed"
			out.raw = [sg * n, d]
		return make(sg * (w * d + n), d)
	# fraction, signs anywhere: -5/12, 5/-12, -(5/12), 3/(-4), (-3)/4
	r = RegEx.create_from_string("^([+-]?)\\s*\\(?\\s*([+-]?)\\s*\\(?\\s*(\\d+)\\s*\\)?\\s*/\\s*\\(?\\s*([+-]?)\\s*(\\d+)\\s*\\)?\\s*\\)?$").search(s)
	if r:
		if (r.get_string(3) + r.get_string(5)).length() > MAX_DIGITS:
			return null
		var n := int(r.get_string(3))
		var d := int(r.get_string(5))
		if d == 0:
			return null
		var negs := 0
		for g in [1, 2, 4]:
			if r.get_string(g) == "-":
				negs += 1
		var sg := -1 if negs % 2 == 1 else 1
		if out is Dictionary:
			out.form = "frac"
			out.raw = [sg * n, d]
		return make(sg * n, d)
	# decimal or whole number: -12.5, .5, 6., 4
	r = RegEx.create_from_string("^([+-]?)\\s*(\\d*)(?:\\.(\\d*))?$").search(s)
	if r and (r.get_string(2) != "" or r.get_string(3) != ""):
		var ip := r.get_string(2)
		var fp := r.get_string(3)
		if (ip + fp).length() > MAX_DIGITS:
			return null
		var d := int(pow(10, fp.length()))
		var n := int(ip if ip != "" else "0") * d + (int(fp) if fp != "" else 0)
		var sg := -1 if r.get_string(1) == "-" else 1
		if out is Dictionary:
			out.form = "dec" if fp != "" else "int"
			out.raw = [sg * n, d]
		return make(sg * n, d)
	return null


## Check a typed answer against the exact answer (a [n, d] or a string Frac.parse reads).
static func check(typed: String, answer) -> Dictionary:
	var ans: Array = answer if answer is Array else parse(str(answer))
	var info := {}
	var v = parse(typed, info)
	var out := {"ok": false, "value": v, "simplest": true, "close": false, "empty": v == null}
	if v == null:
		return out
	out.ok = eq(v, ans)
	if out.ok and info.get("form", "") in ["frac", "mixed"]:
		var raw: Array = info.raw
		out.simplest = gcd(raw[0], raw[1]) == 1
	if not out.ok and info.get("form", "") == "dec" and not terminates(ans):
		out.close = absf(to_float(v) - to_float(ans)) < 0.01
	return out
