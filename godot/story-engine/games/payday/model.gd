# Payday's pay model (CEFL 7-IT), ported from v1 (public/materials/cefl/town/missions/7-income-tax.js: MODEL, SIGN-OFF and
# STORY blocks). No nodes. Money is in cents. tests/test_payday.gd checks it against the v1 JavaScript on many seeds.
#
# You play "future you" at 17, 19 or 24 and plan 8 paycheques: plan the jar at home, work two weeks, check or build the pay
# stub, deposit at the bank. Win = the goal jar is full after paycheque 8 and the bank is not overdrawn.
# Simplifications (as v1): the Pay Card's income tax estimate; CPP from the paycheque after the 18th birthday; bills per two
# weeks; no overtime; cash tips not on the stub; EI and CPP benefits as stories; a $45 bounce fee; a Chapter 1 overdraft is
# covered once; a boss's payroll mistake is always one root line (the lines after it follow from it).
# The job game at each shift moves the next paycheque's hours (perf_of). With every shift "ok" the model is v1's exactly.
#
# A run is a plain Dictionary (saved as JSON, so numbers come back as floats and dictionary keys as strings): read with int().
extends RefCounted

## Gross every 2 weeks (dollars) → income tax (cents). From the Pay Card (2026) in cefl7-income-tax-project-v1.md.
const PAY_CARD := [
	[600, 0], [700, 941], [800, 2341], [900, 3935], [1000, 6135], [1100, 8335], [1200, 10535], [1300, 12735],
	[1400, 14935], [1500, 17135], [1600, 19335], [1700, 21535], [1800, 23735], [1900, 25935], [2000, 28135],
	[2100, 30335], [2200, 32535]]
const FEE := 4500
const PERIODS := 8
const STRIKE_FROM := 3
const STRIKES_TO_LOSE := 2
const FED_FREE := 16452        # 2026 tax-free amounts and rates, from the workbook
const AB_FREE := 22769
const AB_RATE := 0.08
const AB_HEALTH := 0.41
const AB_EDU := 0.13


## JavaScript's Math.round (half up), so every cent matches v1.
static func jr(x: float) -> int:
	return int(floor(x + 0.5))


static func ei_of(g) -> int:
	return jr(float(g) * 0.0163)


static func cpp_of(g, age) -> int:
	return maxi(0, jr((float(g) - 13500.0) * 0.0595)) if int(age) >= 18 else 0


## The nearest Pay Card row in dollars ($50 rounds up); $600 stands for the "$300 to $600" row.
static func row_of(g) -> int:
	return clampi(int(floor((float(g) + 5000.0) / 10000.0)) * 100, 600, 2200)


static func tax_at_row(r: int) -> int:
	for row in PAY_CARD:
		if row[0] == r:
			return row[1]
	return 0


static func tax_of(g) -> int:
	return tax_at_row(row_of(g))


## How the Pay Card was made (teacher guide): 14 % above $16,452 + 8 % above $22,769, per pay.
static func tax_formula(row: int) -> int:
	var y := row * 26
	return jr((maxf(0, y - FED_FREE) * 0.14 + maxf(0, y - AB_FREE) * AB_RATE) / 26.0 * 100.0)


static func stub_of(g, age) -> Dictionary:
	var gi := int(g)
	var s := {"gross": gi, "ei": ei_of(gi), "cpp": cpp_of(gi, age), "tax": tax_of(gi), "age": int(age)}
	s.total = s.ei + s.cpp + s.tax
	s.net = gi - s.total
	return s


## Alberta income tax for a year of this pay.
static func ab_tax_year(g) -> int:
	return jr(maxf(0, float(g) / 100.0 * 26.0 - AB_FREE) * AB_RATE * 100.0)


const WORKERS := {
	"avery": {"name": "Avery", "age": 17, "turns18": 6, "goal": 110000, "goal_label": "a used laptop for school", "home": "Lives at home and goes to high school.",
		"bills": [["phone", "Phone", 3000], ["bus", "Bus pass", 2500], ["food", "Lunches and fun", 7000]],
		"jobs": ["grocer", "busser", "sports"]},
	"dev": {"name": "Dev", "age": 19, "goal": 220000, "goal_label": "a damage deposit and first month’s rent", "home": "Shares an apartment with a friend.",
		"bills": [["rent", "Rent (shared)", 45000], ["phone", "Phone", 3500], ["bus", "Transit pass", 5000], ["food", "Groceries", 20000], ["fun", "Fun", 9000]],
		"jobs": ["warehouse", "bikeshop", "phones"]},
	"rosa": {"name": "Rosa", "age": 24, "goal": 200000, "goal_label": "an emergency fund", "home": "Shares a house and pays off a student loan.",
		"bills": [["rent", "Rent (shared)", 55000], ["phone", "Phone", 4500], ["car", "Car: insurance and gas", 15000], ["food", "Groceries", 22000], ["loan", "Student loan", 8000], ["fun", "Fun", 8000]],
		"jobs": ["office", "apprentice", "furniture"]},
}

const JOBS := {
	"grocer": {"type": "wage", "title": "Grocery clerk", "biz": "Valley Market", "what": "Stock shelves and help customers.", "rate": 1300, "rate18": 1500,
		"hours": [24, 24, 20, 24, 24, 24, 16, 28], "notes": {3: "Fewer shifts this pay.", 7: "Exam week: fewer shifts."}},
	"busser": {"type": "tips", "title": "Restaurant busser", "biz": "The Lantern Diner", "what": "Clear and set tables.", "rate": 1300, "rate18": 1500,
		"hours": [20, 20, 20, 20, 20, 20, 16, 24], "tips": [5500, 4000, 6000, 4500, 6500, 5000, 4000, 9000], "notes": {7: "Exam week: fewer shifts.", 8: "Holiday parties: busy!"}},
	"sports": {"type": "commission", "title": "Sales helper", "biz": "Northside Sports", "what": "Help customers find gear.", "rate": 1300, "rate18": 1500, "pct": 0.02,
		"hours": [16, 16, 16, 16, 16, 16, 12, 20], "sales": [400000, 450000, 250000, 400000, 450000, 400000, 500000, 700000], "notes": {3: "January is slow for sales.", 7: "Exam week: fewer shifts.", 8: "Holiday shopping: busy!"}},
	"warehouse": {"type": "wage", "title": "Warehouse associate", "biz": "Prairie Parcel", "what": "Pack and ship orders.", "rate": 1800,
		"hours": [80, 80, 72, 80, 80, 72, 80, 80], "notes": {3: "Statutory holiday: the warehouse is closed one day.", 6: "One day closed for repairs."}},
	"bikeshop": {"type": "salary", "title": "Service writer", "biz": "Spoke & Chain Bikes", "what": "Book repairs and talk with customers.", "yearly": 3770000,
		"hours": [80, 80, 80, 80, 80, 80, 80, 80], "notes": {}},
	"phones": {"type": "commission", "title": "Sales associate", "biz": "CellPoint", "what": "Sell phones and phone plans.", "rate": 1500, "pct": 0.04,
		"hours": [80, 80, 80, 80, 80, 80, 80, 80], "sales": [500000, 600000, 300000, 550000, 650000, 450000, 900000, 800000], "notes": {3: "January is slow for sales.", 7: "Holiday shopping: busy!"}},
	"office": {"type": "salary", "title": "Office coordinator", "biz": "Riverbend Clinic", "what": "Run the front desk and the schedule.", "yearly": 4680000,
		"hours": [75, 75, 75, 75, 75, 75, 75, 75], "notes": {}},
	"apprentice": {"type": "wage", "title": "Apprentice electrician", "biz": "Bright Spark Electric", "what": "Learn the trade on job sites.", "rate": 2400,
		"hours": [80, 80, 64, 80, 80, 80, 72, 80], "notes": {3: "Cold snap: two days off the job site.", 7: "One day off for a holiday."}},
	"furniture": {"type": "commission", "title": "Furniture sales", "biz": "Home & Hearth", "what": "Help people choose furniture.", "rate": 1500, "pct": 0.06,
		"hours": [80, 80, 80, 80, 80, 80, 80, 80], "sales": [1000000, 1100000, 600000, 1000000, 1100000, 900000, 1400000, 1300000], "notes": {3: "January is slow for sales.", 7: "Holiday shopping: busy!"}},
}


# ── The v1 random numbers (a linear congruential generator), so a seed gives v1's run ──
static func rng(seed) -> Dictionary:
	var s := int(seed) & 0xFFFFFFFF
	return {"s": s if s != 0 else 1}


static func rnd(r: Dictionary) -> float:
	r.s = (int(r.s) * 1664525 + 1013904223) & 0xFFFFFFFF
	return float(r.s) / 4294967296.0


## The world for one run, fixed by the seed: which of paycheques 5 and 6 has a shift cut, and real sales and tips around the expected amounts.
static func make_world(jk: String, seed) -> Dictionary:
	var r := rng(seed)
	var j: Dictionary = JOBS[jk]
	var w := {"cut_at": 5 + int(floor(rnd(r) * 2)), "sales": [], "tips": []}
	for i in PERIODS:
		w.sales.append(jr(float(j.sales[i]) * (0.85 + 0.3 * rnd(r)) / 1000.0) * 1000 if j.has("sales") else 0)
		w.tips.append(jr(float(j.tips[i]) * (0.8 + 0.4 * rnd(r)) / 100.0) * 100 if j.has("tips") else 0)
	return w


static func age_at(wk: String, p: int) -> int:
	var W: Dictionary = WORKERS[wk]
	return 18 if W.has("turns18") and p >= int(W.turns18) else int(W.age)


static func rate_at(j: Dictionary, wk: String, p: int) -> int:
	return int(j.rate18) if j.has("rate18") and age_at(wk, p) >= 18 else int(j.get("rate", 0))


## The job game at each shift (s.shifts[str(p)] = "great" | "ok" | "poor" | "skip"). It changes the NEXT paycheque, so the
## student sees it when planning: a great shift adds hours, a poor or skipped one takes hours away (not on a salary). The cut is
## half the bonus. Great shifts build merit (a poor or skipped one takes one back); 3 merit = a raise from the next paycheque.
## Two warnings without a great shift between them wipe the merit. Rates never go down.
const PERF_HOURS := {"avery": 2, "dev": 4, "rosa": 4}
const PERF_CUT := {"avery": 1, "dev": 2, "rosa": 2}
const RAISE_WAGE := 50
const RAISE_SALARY := 100000
const MERIT_FOR_RAISE := 3


static func shift_of(s: Dictionary, p: int) -> String:
	return str(s.get("shifts", {}).get(str(p), ""))


static func perf_of(s: Dictionary, p: int) -> Dictionary:
	var m := 0
	var warns := 0
	var raises := 0
	for i in range(1, p):
		var t := shift_of(s, i)
		if t == "great":
			m += 1
			warns = 0
			if m >= MERIT_FOR_RAISE:
				raises += 1
				m = 0
		elif t == "poor" or t == "skip":
			m = maxi(0, m - 1)
			warns += 1
			if warns >= 2:
				m = 0
	var last := shift_of(s, p - 1)
	var hours := 0
	if str(s.get("job", "")) != "" and JOBS[s.job].type != "salary":
		hours = int(PERF_HOURS[s.worker]) if last == "great" else (-int(PERF_CUT[s.worker]) if last == "poor" or last == "skip" else 0)
	return {"merit": m, "warns": warns, "raises": raises, "last": last, "hours": hours}


static func cut_hours(wk: String) -> int:
	return 4 if wk == "avery" else 8


static func extra_hours(wk: String) -> int:
	return 4 if wk == "avery" else 8


## What the worker knows when planning paycheque p.
static func schedule_of(s: Dictionary, p: int) -> Dictionary:
	var j: Dictionary = JOBS[s.job]
	var pf := perf_of(s, p)
	var sal: bool = j.type == "salary"
	return {"hours": int(j.hours[p - 1]) + (extra_hours(s.worker) if p == 5 and bool(s.extra) else 0) + pf.hours,
		"rate": 0 if sal else rate_at(j, s.worker, p) + pf.raises * RAISE_WAGE, "age": age_at(s.worker, p),
		"perf": pf.hours, "raises": pf.raises, "yearly": int(j.yearly) + pf.raises * RAISE_SALARY if sal else 0,
		"sales": int(j.sales[p - 1]) if j.has("sales") else 0, "tips": int(j.tips[p - 1]) if j.has("tips") else 0,
		"cut_risk": cut_hours(s.worker) if not sal and (p == 5 or p == 6) else 0, "note": str(j.notes.get(p, ""))}


static func gross_from(j: Dictionary, hours, rate, sales, yearly) -> int:
	if j.type == "salary":
		return jr(float(yearly if int(yearly) != 0 else j.yearly) / 26.0)
	return int(hours) * int(rate) + (jr(float(sales) * float(j.pct)) if j.type == "commission" else 0)


## What really happens in paycheque p.
static func actual_of(s: Dictionary, p: int) -> Dictionary:
	var j: Dictionary = JOBS[s.job]
	var sc := schedule_of(s, p)
	var cut := cut_hours(s.worker) if j.type != "salary" and p == int(s.world.cut_at) else 0
	var hours: int = sc.hours - cut
	var sales := int(s.world.sales[p - 1])
	var g := gross_from(j, hours, sc.rate, sales, sc.yearly)
	return {"hours": hours, "cut": cut, "extra": extra_hours(s.worker) if p == 5 and bool(s.extra) else 0, "rate": sc.rate, "age": sc.age,
		"sales": sales, "tips": int(s.world.tips[p - 1]), "perf": sc.perf, "raises": sc.raises, "yearly": sc.yearly, "stub": stub_of(g, sc.age)}


## A careful estimate of take-home pay before the two weeks happen: planned hours minus any warned cut, 85 % of expected sales,
## 80 % of expected tips. When the pay can come in higher it may land on the next Pay Card row, so that row's extra tax is kept back too.
static func safe_take_home(s: Dictionary, p: int) -> int:
	var j: Dictionary = JOBS[s.job]
	var sc := schedule_of(s, p)
	var g := gross_from(j, sc.hours - sc.cut_risk, sc.rate, float(sc.sales) * 0.85, sc.yearly)
	var r := row_of(g)
	var step := 0 if j.type == "salary" or r >= 2200 else tax_at_row(r + 100) - tax_at_row(r)
	return int(stub_of(g, sc.age).net) - step + jr(float(sc.tips) * 0.8)


static func bills_of(wk: String) -> int:
	var t := 0
	for b in WORKERS[wk].bills:
		t += int(b[2])
	return t


static func new_run(wk: String, jk: String, seed) -> Dictionary:
	return {"worker": wk, "job": jk, "seed": int(seed), "world": make_world(jk, seed) if jk != "" else null, "p": 0, "bank": 0, "jar": 0,
		"bounces": 0, "strikes": 0, "extra": false, "covered": 0, "log": [], "shifts": {}}


static func set_job(s: Dictionary, jk: String) -> void:
	s.job = jk
	s.world = make_world(jk, s.seed)


## Payday with a signed stub: take-home pay and tips come in; bills and the jar transfer go out. Under $0 means a payment bounced.
## short: what a signed mistake cost (the bank pays the printed net). real: Real mode, where a bounce from paycheque 3 on counts.
static func payday(s: Dictionary, jar: int, real: bool, short := 0) -> Dictionary:
	var p := int(s.p) + 1
	var a := actual_of(s, p)
	var bills := bills_of(s.worker)
	var bank: int = int(s.bank) + int(a.stub.net) - short + int(a.tips) - bills - jar
	var bounced := bank < 0
	if bounced:
		bank -= FEE
		s.bounces = int(s.bounces) + 1
		if real and p >= STRIKE_FROM:
			s.strikes = int(s.strikes) + 1
	s.p = p
	s.bank = bank
	s.jar = int(s.jar) + jar
	var l := {"p": p, "hours": a.hours, "cut": a.cut, "extra": a.extra, "sales": a.sales, "tips": a.tips, "age": a.age, "stub": a.stub,
		"bills": bills, "jar_in": jar, "bank": bank, "bounced": bounced, "short": short}
	s.log.append(l)
	return l


## Chapter 2 starts clean: a family member covers a Chapter 1 overdraft, once, because deductions had not been taught yet.
static func start_chapter(s: Dictionary, ch: int) -> void:
	if ch == 2 and int(s.bank) < 0:
		s.covered = -int(s.bank)
		s.bank = 0


static func outcome(s: Dictionary) -> Dictionary:
	if int(s.strikes) >= STRIKES_TO_LOSE:
		return {"done": true, "win": false, "why": "strikes"}
	if int(s.p) < PERIODS:
		return {"done": false}
	if int(s.jar) < int(WORKERS[s.worker].goal):
		return {"done": true, "win": false, "why": "short"}
	if int(s.bank) < 0:
		return {"done": true, "win": false, "why": "overdrawn"}
	return {"done": true, "win": true}


## "What would help?" after a payday: "bounce", "slow" or "".
static func help_topic(s: Dictionary) -> String:
	if s.log.is_empty():
		return ""
	var last: Dictionary = s.log[-1]
	var W: Dictionary = WORKERS[s.worker]
	var p := int(s.p)
	var left := PERIODS - p
	var need := float(int(W.goal) - int(s.jar)) / left if left > 0 else 0.0
	if p < STRIKE_FROM or p >= PERIODS:
		return ""
	if bool(last.bounced):
		return "bounce"
	if int(s.jar) < int(W.goal) and need > float(last.jar_in) and float(s.bank) >= maxf(4000.0, need * 0.5):
		return "slow"
	return ""


# ── Sign-off: from paycheque 5 the boss's app prepares the stub; one root line may be wrong ──
const ERR_CUT := 4             # an "hours" mistake leaves 4 hours off
const ERR_SALE := 100000       # a "commission" mistake leaves one $1,000 sale off
const ROOT_LINE := {"hours": "hours", "commission": "comm", "cppMinor": "cpp", "cppExempt": "cpp", "ei": "ei", "taxRow": "tax"}


static func error_kinds(s: Dictionary, p: int) -> Array:
	var a := actual_of(s, p)
	var j: Dictionary = JOBS[s.job]
	var k := []
	if j.type != "salary":
		k.append("hours")
	if j.type == "commission":
		k.append("commission")
	if int(a.age) < 18:
		k.append("cppMinor")
	else:
		k.append("cppExempt")
		if int(a.stub.gross) >= 50000:
			k.append("ei")
	if int(a.stub.gross) >= 70000:
		k.append("taxRow")
	var right := int(stub_as_printed(s, p, "").net)
	return k.filter(func(x): return right - int(stub_as_printed(s, p, x).net) >= 500)   # every mistake is worth at least $5


static func _wrong_lines(st: Dictionary, kind: String) -> void:
	var g := int(st.gross)
	if kind == "cppMinor":
		st.cpp = maxi(0, jr((g - 13500) * 0.0595))
	if kind == "cppExempt":
		st.cpp = jr(g * 0.0595)
	if kind == "ei":
		st.ei = jr(g * 0.0263)
	if kind == "taxRow":
		st.tax = tax_at_row(mini(2200, row_of(g) + 200))
	st.total = int(st.ei) + int(st.cpp) + int(st.tax)
	st.net = g - st.total
	st.root = ROOT_LINE.get(kind, "")


## The stub as the boss printed it. kind: the mistake ("" = none).
static func stub_as_printed(s: Dictionary, p: int, kind: String) -> Dictionary:
	var a := actual_of(s, p)
	var j: Dictionary = JOBS[s.job]
	var hours: int = a.hours
	var comm := jr(a.sales * float(j.pct)) if j.type == "commission" else 0
	if kind == "hours":
		hours = a.hours - ERR_CUT
	if kind == "commission":
		comm = jr(maxf(0, a.sales - ERR_SALE) * float(j.pct))
	var g: int = jr(float(a.yearly) / 26.0) if j.type == "salary" else hours * int(a.rate) + comm
	var st := {"hours": hours, "rate": a.rate, "sales": maxi(0, a.sales - ERR_SALE) if kind == "commission" else a.sales, "comm": comm, "gross": g,
		"ei": ei_of(g), "cpp": cpp_of(g, a.age), "tax": tax_of(g), "age": a.age, "kind": kind}
	_wrong_lines(st, kind)
	return st


## Which paycheques have a mistake, fixed by the seed: one of 5 and 6, and paycheque 7 three times in five.
static func error_plan(seed) -> Dictionary:
	var r := rng(int(seed) * 7 + 3)
	rnd(r)
	var e := {}
	e[str(5 if rnd(r) < 0.5 else 6)] = 1
	if rnd(r) < 0.6:
		e["7"] = 1
	e.pick = int(floor(rnd(r) * 1000))
	return e


static func error_kind_for(s: Dictionary, p: int, plan: Dictionary) -> String:
	if not plan.has(str(p)):
		return ""
	var k := error_kinds(s, p)
	return k[(int(plan.pick) + p) % k.size()] if k.size() else ""


# ── The Pay-O-Matic mystery: the clue stubs townspeople bring you. Fixed numbers (the dialogue quotes them) and the same
#    one-root-line mistake kinds. Pay-O-Matic's six wrong settings are the six mistake kinds. ──
## t: { type: wage | commission | salary | given, rate, hours, pct, sales, yearly, gross (given), age }
static func pom_stub(t: Dictionary, kind: String) -> Dictionary:
	var hours := int(t.get("hours", 0)) - (ERR_CUT if kind == "hours" else 0)
	var sales := int(t.get("sales", 0)) - (mini(int(t.get("sales", 0)), ERR_SALE) if kind == "commission" else 0)
	var comm := jr(sales * float(t.get("pct", 0))) if t.type == "commission" else 0
	var g: int
	if t.type == "salary":
		g = jr(float(t.yearly) / 26.0)
	elif t.type == "given":
		g = int(t.gross)
	else:
		g = hours * int(t.rate) + comm
	var st := {"hours": hours, "rate": int(t.get("rate", 0)), "sales": sales, "comm": comm, "gross": g, "ei": ei_of(g), "cpp": cpp_of(g, t.age), "tax": tax_of(g), "age": int(t.age)}
	_wrong_lines(st, kind)
	return st


const STORY_STUBS := {
	"mo": {"who": "worker", "biz": "Northgate Builders", "type": "wage", "rate": 2400, "hours": 40, "age": 38, "kind": "hours"},          # Ch 2: the test run
	"avery": {"who": "avery", "biz": "Valley Market", "type": "wage", "rate": 1400, "hours": 28, "age": 17, "kind": "cppMinor"},           # Ch 3: the friend (17)
	"dev": {"who": "dev", "biz": "CellPoint", "type": "commission", "rate": 1500, "hours": 72, "pct": 0.04, "sales": 600000, "age": 19, "kind": "ei"},  # Ch 3: the friend (19)
	"nurse": {"who": "nurse", "biz": "Hospital", "type": "given", "gross": 186240, "age": 34, "kind": "taxRow"},                          # Ch 3: Nurse Kaur
}


static func story_stub(id: String) -> Dictionary:
	var t: Dictionary = STORY_STUBS[id].duplicate()
	for f in ["rate", "hours", "pct", "sales", "yearly"]:
		if not t.has(f):
			t[f] = 0
	t.right = pom_stub(t, "")
	t.printed = pom_stub(t, t.kind)
	return t


## What Pay-O-Matic got wrong, one per mistake kind.
const RULES := {
	"hours": "It left hours off the timesheet", "commission": "It left a sale out of the commission", "cppMinor": "It took CPP from a worker under 18",
	"cppExempt": "It took CPP on all the pay (it forgot the first $135)", "ei": "It used the wrong EI rate", "taxRow": "It used the wrong Pay Card row for income tax"}

## Pay-O-Matic's settings as Milo typed them (milo) and as they should be (right).
const SETTINGS := [
	{"k": "hours", "kind": "hours", "name": "Hours", "opts": ["Every hour on the timesheet", "The timesheet minus the last shift"], "right": 0, "milo": 1},
	{"k": "comm", "kind": "commission", "name": "Commission", "opts": ["The % of every sale", "The % of every sale but one"], "right": 0, "milo": 1},
	{"k": "ei", "kind": "ei", "name": "EI", "opts": ["2.63% of gross pay", "1.63% of gross pay", "5.95% of gross pay"], "right": 1, "milo": 0},
	{"k": "cppAge", "kind": "cppMinor", "name": "CPP starts at age", "opts": ["Any age", "18", "65"], "right": 1, "milo": 0},
	{"k": "cpp", "kind": "cppExempt", "name": "CPP amount", "opts": ["5.95% of gross pay", "5.95% of (gross pay − $135)", "1.63% of gross pay"], "right": 1, "milo": 0},
	{"k": "tax", "kind": "taxRow", "name": "Income tax", "opts": ["Two rows past the nearest Pay Card row", "The Pay Card row nearest the gross pay", "22% of gross pay"], "right": 1, "milo": 0},
]


# ── Bots (tests and the test player): the jar transfer a careful planner makes ──
## Everything above the bills and a careful estimate of take-home pay, in $25 steps (the plan's stepper).
static func careful_jar(s: Dictionary, p: int) -> int:
	var spare := int(s.bank) + safe_take_home(s, p) - bills_of(s.worker)
	return maxi(0, spare / 2500 * 2500)
