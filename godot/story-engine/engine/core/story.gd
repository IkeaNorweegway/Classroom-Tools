# The game state S and what lives in it: the clock, flags, what each person remembers about you,
# the story log, the bag, first-try records and typed answers. S is a plain Dictionary, so a save is JSON
# and a test can play a whole game without a page. No nodes.
extends RefCounted

const VERSION := 1


static func new_state(seed: int) -> Dictionary:
	return {
		"v": VERSION, "seed": seed, "day": 1, "min": 8 * 60, "cash": 0,
		"flags": {}, "mem": {}, "inv": {}, "log": [], "answers": {}, "typed": {},
		"shop": null, "days": [],
	}


static func validate(S) -> bool:
	if not (S is Dictionary):
		return false
	for k in ["v", "seed", "day", "min", "cash", "flags", "mem", "inv", "log", "answers", "typed", "days"]:
		if not S.has(k):
			return false
	return int(S.v) == VERSION and S.flags is Dictionary and S.mem is Dictionary and S.inv is Dictionary \
		and S.log is Array and S.answers is Dictionary and S.typed is Dictionary and S.days is Array


# ── Clock: S.day counts from 1; S.min is minutes after midnight ──
static func advance(S: Dictionary, minutes: int) -> void:
	S.min = int(S.min) + minutes
	while S.min >= 1440:
		S.min -= 1440
		S.day = int(S.day) + 1


static func set_time(S: Dictionary, day: int, minutes: int) -> void:
	S.day = day
	S.min = minutes


# ── Flags ──
static func flag(S: Dictionary, k: String, default = null) -> Variant:
	return S.flags.get(k, default)


static func set_flag(S: Dictionary, k: String, v) -> void:
	S.flags[k] = v


# ── Memory: S.mem[who] = { met, trust (−5 … 5), notes: [plain sentences] } ──
static func _mem(S: Dictionary, who: String) -> Dictionary:
	if not S.mem.has(who):
		S.mem[who] = {"met": false, "trust": 0, "notes": []}
	return S.mem[who]


static func meet(S: Dictionary, who: String) -> void:
	_mem(S, who).met = true


## note is a sentence the Journal shows ("You turned down the cheap beans."); it is also the key.
static func remember(S: Dictionary, who: String, note := "", trust := 0) -> void:
	var m := _mem(S, who)
	m.met = true
	if note != "" and not m.notes.has(note):
		m.notes.append(note)
	if trust != 0:
		m.trust = clampi(int(m.trust) + trust, -5, 5)


static func knows(S: Dictionary, who: String, note: String) -> bool:
	return S.mem.has(who) and S.mem[who].notes.has(note)


static func trust(S: Dictionary, who: String) -> int:
	return int(S.mem[who].trust) if S.mem.has(who) else 0


static func met(S: Dictionary, who: String) -> bool:
	return S.mem.has(who) and bool(S.mem[who].met)


## label (optional): the row's name in the report and the Journal ("The moss tally"); with none the row reads "Day N".
static func log_line(S: Dictionary, text: String, label := "") -> void:
	var e := {"day": int(S.day), "text": text}
	if label != "":
		e.label = label
	S.log.append(e)


# ── Bag ──
static func give(S: Dictionary, id: String, n := 1) -> void:
	S.inv[id] = int(S.inv.get(id, 0)) + n


static func take(S: Dictionary, id: String, n := 1) -> bool:
	if int(S.inv.get(id, 0)) < n:
		return false
	S.inv[id] = int(S.inv[id]) - n
	if S.inv[id] <= 0:
		S.inv.erase(id)
	return true


static func count(S: Dictionary, id: String) -> int:
	return int(S.inv.get(id, 0))


# ── First-try records (the report reads these). tier: "first" | "second" | "third" (T.frac and the Realm panels) | "later" ──
static func record(S: Dictionary, key: String, label: String, tier: String, extra = null) -> void:
	if not S.answers.has(key):
		S.answers[key] = {"label": label, "tier": tier, "day": int(S.day), "extra": extra}
