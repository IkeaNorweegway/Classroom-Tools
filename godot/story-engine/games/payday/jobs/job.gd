# Payday's live shifts: the shared part of the nine job models. No nodes, so bots can play a whole shift headless.
#
# A job is a work floor (a room map), stations on it (things you walk up to), and a model that runs in real time:
#   make(seed, real, p) → st            p = paycheque 1–8 (each has its own twist); real = Real mode
#   step(st, dt)                        dt in seconds; customers arrive, wait, give up; st.over once the shift ends
#   on_at(st, sid)                      you walked up to a station (Space or tap); may act at once, or open its card
#   card(st) → { title, lines, opts: [{ t, a }], cols } or {}   the work card for the station you are at
#   act(st, a)                          a button on the card
#   leave(st)                           you walked away from the station
#   best(st) → { go, a, think }         what a careful worker does next (go = station id, or "@x,y" to step on a tile)
#   actors(st), marks(st), tally(st)    what the view draws: people, bubbles over stations or tiles, the live tally
#   tier(st) → "great" | "ok" | "poor"  from quality (right ÷ everything) and coverage (right ÷ the work that came in, less
#                                       pending(st): what was still under way at the bell)
# st.me is your tile (the view writes it every frame; the bot harness moves it). st.pops are floating words for the view.
# Money is in cents, time in seconds. Bots: play(seed, real, p, kind) with kind careful | steady (a slower careful student) | sloppy | random | idle.
extends RefCounted

const WALK := 0.16          # seconds a tile, as world3d's WALK_TIME
const MONEY = preload("res://engine/core/money.gd")

var id := ""
var name := ""              # the game's name ("Till rush")
var place := ""             # "Valley Market · shop floor"
var pay := "wage"           # wage | tips | commission | salary
var pct := 0.0              # commission rate
var room_map := {}          # the room map (map_data format)
var start := Vector2i(6, 6)
var stations := {}          # id → { x, y, w, h, stand: Vector2i, label }
var th := {"gentle": [0.8, 0.7, 0.55, 0.4], "real": [0.8, 0.7, 0.55, 0.4]}   # great: quality, coverage · ok: quality, coverage
var tips := {}              # why key → a "next time" line for the end card
var controls := []          # three short lines for the intro card
var boss_at := Vector2i(1, 6)   # where the boss stands and watches (a free tile out of the way)
var hour := 16              # the shift's start on the clock (4 hours shown in 2 minutes)
var react := {"great": "Great shift!", "ok": "Good, steady work.", "poor": "Rough shift."}   # the boss afterwards (v1's lines)


# ── Override these ──
func twists() -> Array: return []
func setup(_st: Dictionary) -> void: pass
func tick(_st: Dictionary, _dt: float) -> void: pass
func on_at(st: Dictionary, sid: String) -> void: st.at = sid
func card(_st: Dictionary) -> Dictionary: return {}
func act(_st: Dictionary, _a: String) -> void: pass
func best(_st: Dictionary) -> Dictionary: return {}
func actions(_st: Dictionary) -> Array: return []      # every button that could be on the open card (the random bot)
func marks(_st: Dictionary) -> Array: return []
func tally(_st: Dictionary) -> Array: return []
func earn_line(_st: Dictionary) -> String: return ""   # the pay type at work today, for the end card
func pending(_st: Dictionary) -> int: return 0         # work still under way when the shift ends (not counted against coverage)


func leave(st: Dictionary) -> void:
	st.at = ""


func make(seed: int, real: bool, p: int) -> Dictionary:
	var tw: Array = twists()
	var st := {"r": {"s": (seed * 7919 + p * 104729 + 17) & 0x7FFFFFFF}, "seed": seed, "real": real, "p": p, "tw": tw[clampi(p - 1, 0, tw.size() - 1)] if tw.size() else {},
		"t": 0.0, "len": 120.0, "good": 0, "bad": 0, "lost": 0, "demand": 0, "pops": [], "msg": "", "why": {}, "carry": "", "at": "",
		"me": start, "cust": [], "nid": 1, "money": 0, "over": false, "ver": 0}
	st.len = float(st.tw.get("len", 120.0))
	setup(st)
	return st


func step(st: Dictionary, dt: float) -> void:
	if st.over:
		return
	st.t += dt
	tick(st, dt)
	if st.t >= st.len:
		st.over = true


func tier(st: Dictionary) -> String:
	var t: Array = th.real if st.real else th.gentle
	var q := quality(st)
	var c := coverage(st)
	if q >= t[0] and c >= t[1]:
		return "great"
	if q >= t[2] and c >= t[3]:
		return "ok"
	return "poor"


func quality(st: Dictionary) -> float:
	var all := int(st.good) + int(st.bad) + int(st.lost)
	return float(st.good) / float(all) if all > 0 else 0.0


func coverage(st: Dictionary) -> float:
	return float(st.good) / float(maxi(1, int(st.demand) - pending(st)))


## The most common mistake, as a line for the end card.
func tip_line(st: Dictionary) -> String:
	var top := ""
	var n := 0
	for k in st.why:
		if int(st.why[k]) > n and tips.has(k):
			n = int(st.why[k])
			top = k
	return str(tips[top]) if top != "" else ""


# ── Helpers for the jobs ──
func rnd(st: Dictionary) -> float:
	st.r.s = (int(st.r.s) * 1103515245 + 12345) & 0x7FFFFFFF
	return float(st.r.s) / 2147483648.0


func irand(st: Dictionary, lo: int, hi: int) -> int:
	return lo + int(floor(rnd(st) * float(hi - lo + 1)))


func pick(st: Dictionary, a: Array) -> Variant:
	return a[int(floor(rnd(st) * a.size()))]


func shuffled(st: Dictionary, a: Array) -> Array:
	var out := a.duplicate()
	for i in range(out.size() - 1, 0, -1):
		var j := int(floor(rnd(st) * float(i + 1)))
		var t = out[i]
		out[i] = out[j]
		out[j] = t
	return out


func pop(st: Dictionary, at: Vector2i, text: String, good := true) -> void:
	st.pops.append({"x": at.x, "y": at.y, "text": text, "good": good})


func win(st: Dictionary, at: Vector2i, text := "", msg := "") -> void:
	st.good = int(st.good) + 1
	pop(st, at, text if text != "" else "+1", true)
	if msg != "":
		st.msg = msg
	st.ver = int(st.ver) + 1


func oops(st: Dictionary, at: Vector2i, why: String, msg: String, n := 1) -> void:
	st.bad = int(st.bad) + n
	st.why[why] = int(st.why.get(why, 0)) + 1
	pop(st, at, "−%d" % n if n > 1 else "oops", false)
	st.msg = msg
	st.ver = int(st.ver) + 1


func lose(st: Dictionary, at: Vector2i, why: String, msg: String) -> void:
	st.lost = int(st.lost) + 1
	st.why[why] = int(st.why.get(why, 0)) + 1
	pop(st, at, "left", false)
	st.msg = msg
	st.ver = int(st.ver) + 1


## The shift's busy curve: quiet start, a rush in the middle, a little calmer at the end. 1.0 on average.
func busy(st: Dictionary) -> float:
	var x := float(st.t) / float(st.len)
	return 0.7 + 0.75 * exp(-pow((x - 0.55) / 0.2, 2.0))


func tw(st: Dictionary, k: String, default = null) -> Variant:
	return st.tw.get(k, default)


## A new customer: walks in at the door, then stands where the job puts them.
func add_cust(st: Dictionary, d: Dictionary) -> Dictionary:
	d.id = int(st.nid)
	st.nid = int(st.nid) + 1
	d.look = int(st.seed) * 31 + int(d.id) * 7
	if not d.has("x"):
		d.x = int(room_map.room.exit)
		d.y = int(room_map.h) - 2
	d.bub = d.get("bub", "")
	d.ring = d.get("ring", -1.0)
	st.cust.append(d)
	return d


func custs(st: Dictionary, state: String) -> Array:
	return st.cust.filter(func(c): return c.state == state)


func drop(st: Dictionary, c: Dictionary) -> void:
	st.cust.erase(c)


## Puts a list of customers on a list of queue tiles, in order (extra people bunch on the last tile).
func line_up(list: Array, spots: Array) -> void:
	for i in list.size():
		var s: Vector2i = spots[mini(i, spots.size() - 1)]
		list[i].x = s.x
		list[i].y = s.y


func actors(st: Dictionary) -> Array:
	var out := []
	for c in st.cust:
		out.append({"id": c.id, "x": c.x, "y": c.y, "look": c.look, "bub": c.bub, "ring": c.ring})
	return out


func stand(sid: String) -> Vector2i:
	if sid.begins_with("@"):
		var v := sid.substr(1).split(",")
		return Vector2i(int(v[0]), int(v[1]))
	return stations[sid].stand


static func dist(a: Vector2i, b: Vector2i) -> int:
	return absi(a.x - b.x) + absi(a.y - b.y)


func cash(c) -> String:
	return MONEY.fmt(c)


func cash_w(c) -> String:
	return MONEY.fmt_w(c)


# ── Bots (tests/test_jobs.gd, and the test player in a fast game) ──
## Plays a whole shift and returns the final state. Walking takes real shift time (WALK a tile, a little slower than a
## clean path), and every button press takes think time, so a careful bot plays about as fast as a quick student.
func play(seed: int, real: bool, p: int, kind: String) -> Dictionary:
	return play_from(make(seed, real, p), kind)


## Plays on from any state to the end of the shift (the test player uses this to finish a shift that is on screen).
func play_from(st: Dictionary, kind: String) -> Dictionary:
	var dt := 0.05
	var wait := 0.6
	var dest = null
	var r := {"s": int(st.seed) * 13 + 5 + int(st.p)}
	var rr := func() -> float:
		r.s = (int(r.s) * 1103515245 + 12345) & 0x7FFFFFFF
		return float(r.s) / 2147483648.0
	while not st.over:
		step(st, dt)
		wait -= dt
		if wait > 0.0:
			continue
		if dest != null:
			st.me = dest
			dest = null
		if kind == "idle":
			wait = 1.0
			continue
		var b: Dictionary = {}
		var rand_move: bool = kind == "random" or (kind == "sloppy" and rr.call() < 0.22)
		if rand_move:
			var acts: Array = actions(st) if st.at != "" else []
			if acts.size() and rr.call() < 0.6:
				b = {"go": st.at, "a": acts[int(rr.call() * acts.size())]}
			else:
				var ids := stations.keys()
				b = {"go": ids[int(rr.call() * ids.size())], "a": ""}
		else:
			b = best(st)
		if b.is_empty():
			wait = 0.25
			continue
		var target := stand(b.go)
		if st.me != target:
			if st.at != "":
				leave(st)
			dest = target
			wait = float(dist(st.me, target)) * WALK * (1.6 if kind == "steady" else 1.25) + (0.6 if kind == "steady" else 0.15)
			continue
		if not b.go.begins_with("@") and (st.at != b.go or str(b.get("a", "")) == ""):
			on_at(st, b.go)      # walking up, or pressing Space again at the same station
			wait = 0.3 if st.at != b.go else float(b.get("think", 0.4))
			continue
		if str(b.get("a", "")) != "":
			act(st, b.a)
		var think := float(b.get("think", 0.8))
		wait = think * {"sloppy": 1.7, "steady": 1.6}.get(kind, 1.0) if kind != "random" else 0.45
	return st
