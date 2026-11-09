# Money in cents, and the clock. No nodes: tests call these directly.
extends RefCounted


static func fmt(c) -> String:
	var n: int = absi(roundi(float(c)))
	var d := str(n / 100)
	var r := n % 100
	var out := ""
	var i := d.length()
	while i > 3:
		out = "," + d.substr(i - 3, 3) + out
		i -= 3
	out = d.substr(0, i) + out
	return ("−" if float(c) < 0 else "") + "$" + out + "." + ("%02d" % r)


## Drops ".00" ($60 rather than $60.00).
static func fmt_w(c) -> String:
	var s := fmt(c)
	return s.trim_suffix(".00")


## Typed money → cents, or null when it is not a number. Accepts "$1,234.50", "12", "-3.5".
static func parse(t) -> Variant:
	var s := str(t).strip_edges().replace("$", "").replace(",", "").replace(" ", "").replace("−", "-").replace("–", "-")
	if s == "" or s == "." or s == "-" or not s.is_valid_float():
		return null
	return roundi(s.to_float() * 100.0)


## 450 → "7:30 am"
static func clock(minutes) -> String:
	var m := int(minutes)
	var h := (m / 60) % 24
	var mm := m % 60
	var hh := h % 12
	if hh == 0:
		hh = 12
	return "%d:%02d %s" % [hh, mm, "am" if h < 12 else "pm"]


static func close(got, want, tol := 2) -> bool:
	return got != null and absi(int(got) - int(want)) <= tol
