# Payday: Where Does the Paycheque Go? (CEFL Grade 7 Income and Tax, companion to the project First Paycheque). LO 7-IT.
# The v1 mission (public/materials/cefl/town/missions/7-income-tax.js) on the five-area 3D town. Four chapters, one after each
# project step. You play "future you" at 17, 19 or 24 and plan 8 paycheques: plan the jar at home, work two weeks, check or
# build the pay stub, deposit at the bank. Model: games/payday/model.gd (checked against v1 by tests/payday/compare.sh).
# Side story, the Pay-O-Matic mystery: Mo's cheque "felt light" (Ch 1) → Mo's stub, proof (Ch 2) → a friend's stub with a
# different mistake, three more clues, Milo (Ch 3) → you prove each mistake at Town Hall, fix Pay-O-Matic with Milo, and the
# town names its new rule after you (Ch 4). The story never touches the pay model, so it cannot change who wins.
# Win = the goal jar is full after paycheque 8 and the bank is not overdrawn. In Real mode, two bounced payments from
# paycheque 3 on end the chapter (replay it, or switch to Gentle).
# Not yet in v2 (batch 2 of the port): the nine job games (every shift counts as "steady", as v1 without them), help requests,
# news, Town Mail and the wallet, the home letter and goal item, the My Plan wall page.
extends "res://games/cefl_town/game.gd"

const M = preload("res://games/payday/model.gd")
const X = preload("res://games/payday/text.gd")
const P = preload("res://games/payday/panels.gd")
const Money = preload("res://engine/core/money.gd")

const STAMPS := [["jas", "Jas at Service Canada"], ["grandpa", "Grandpa"], ["nurse", "Nurse Kaur at the hospital"]]
const CHAPTERS := [
	{"name": "Pick a job", "step": "Step 1", "moment": "Moment 1: four ways to get paid"},
	{"name": "The pay stub", "step": "Step 2", "moment": "Moment 2: gross pay and net pay"},
	{"name": "Where it goes", "step": "Step 3", "moment": "Moment 3: where deductions go"},
	{"name": "Your call", "step": "Step 4", "moment": "Moment 4: what taxes pay for"}]
const LOST_LINE := "Two payments bounced. In Real mode that ends the chapter. Plan the jar from take-home pay minus bills, and keep a small cushion."

var log_unit := "Paycheque"
var _patched := false


func _init() -> void:
	id = "payday"
	title = "Payday: Where Does the Paycheque Go?"
	unit_label = "CEFL Grade 7 · Income and Tax · Project: First Paycheque"
	i_can = "I can work out where a paycheque goes, from gross pay to take-home pay, and check a pay stub for mistakes."
	blurb = "Jump ahead a few years: get a job, plan 8 paycheques and save for a goal. This is a model. The pay rules are the real 2026 rates from your Pay Card. The people, jobs and businesses are made up. Bills are counted every two weeks."
	done_goal = "You finished Payday! Open the Menu for your report."


# ── The town, with Payday's things in the rooms ──
func maps() -> Dictionary:
	var m: Dictionary = super.maps()
	if not _patched:
		_patched = true
		m.jobcentre.props.append({"k": "board", "x": 6, "y": 2, "id": "jobboard", "label": "Job board", "solid": true})
		for p in m.home.props:
			if p.k == "desk":
				p.id = "table"
				p.label = "Kitchen table"
			if p.k == "vending":
				p.k = "fridge"
				p.id = "fridge"
				p.label = "The fridge"
	return m


func people() -> Dictionary:
	var out: Dictionary = Town1.PEOPLE.duplicate(true)
	for jk in X.WORK:
		var w: Dictionary = X.WORK[jk]
		out["boss_" + jk] = {"name": w.boss, "role": M.JOBS[jk].biz, "map": w.b, "x": 4, "y": 3, "dir": "down", "look": w.look}
	out.mom = {"name": "Mom", "role": "Family", "map": "home", "x": 2, "y": 4, "dir": "right", "look": X.MOM_LOOK}
	out.milo = {"name": "Milo", "role": "App maker", "map": "library", "x": 2, "y": 4, "dir": "right", "look": X.MILO_LOOK}
	out.worker.role = "Builder, Northgate Builders"
	return out


func _pd(S: Dictionary) -> Dictionary:
	return S.get("pd", {})


func _sit(S: Dictionary) -> String:
	return str(_pd(S).get("sit", ""))


func _friend(S: Dictionary) -> String:   # the friend whose stub is wrong too
	return "dev" if _sit(S) == "avery" else "avery"


func _family(S: Dictionary) -> String:
	var s := _sit(S)
	return X.SIT[s].family if s != "" else "mom"


func _story(S: Dictionary) -> Dictionary:
	return _pd(S).get("story", {})


func where(pid: String, S: Dictionary) -> Variant:
	var pd := _pd(S)
	var run: Dictionary = pd.get("run", {})
	var pp := int(run.get("p", 0))
	var s := _story(S)
	var scene := str(pd.get("scene", ""))
	if pid.begins_with("boss_"):
		return {"map": X.WORK[pid.substr(5)].b, "x": 4, "y": 3, "dir": "down"}
	if scene != "":   # Town Hall fills up for the two meetings
		if pid == "worker":
			return {"map": "townhall", "x": 2, "y": 4, "dir": "right"}
		if pid == _friend(S):
			return {"map": "townhall", "x": 6, "y": 4, "dir": "left"}
		if pid == "milo":
			return {"map": "townhall", "x": 7, "y": 3, "dir": "left"}
	match pid:
		"mom":
			return {"map": "home", "x": 2, "y": 4, "dir": "right"} if _sit(S) in ["", "avery"] else null
		"dev", "rosa":
			if _sit(S) == pid:
				return {"map": "home", "x": 2, "y": 4, "dir": "right"}
		"milo":
			return {"map": "library", "x": 2, "y": 4, "dir": "right"} if s.has("miloOut") else null
		"worker":
			if pp >= 1 and pp <= 2 and not s.has("mo1"):
				return {"map": "bank", "x": 2, "y": 4, "dir": "right"}
		"jas":
			if pd.get("finished", false):
				return {"map": "downtown", "x": 12, "y": 25, "dir": "down"}
			if pp < 4:
				return {"map": "shopping", "x": 20, "y": 25, "dir": "down"}
	return super.where(pid, S)


## For tests/test_nav.gd: the states in which people stand somewhere else (Mo at the bank, Jas on Market Lane, roommates, Town Hall).
func nav_states() -> Array:
	var out := []
	for sit in ["avery", "dev", "rosa"]:
		for o in [{"p": 1}, {"p": 5}, {"p": 5, "scene": "hall", "miloOut": 1}, {"p": 8, "finished": true}]:
			var S := {"pd": {"sit": sit, "run": {"p": o.p}, "scene": o.get("scene", ""), "finished": o.get("finished", false), "story": {"miloOut": 1} if o.has("miloOut") else {}}}
			out.append(S)
	return out


# ── State ──
func new_game(S: Dictionary) -> void:
	S.pd = {"v": 1, "sit": "", "run": {}, "ch": 0, "plan": 0, "asks": {}, "last_ask": -9, "pending_ask": "", "letters": [], "signs": {},
		"stamps": {}, "errs": {}, "story": {}, "scene": "", "finished": false, "win": false, "pun": 0, "checks": [], "gate_wait": -1,
		"card": false, "ad": false, "map_given": false, "stamp_phase": false, "clue_friend": ""}


func validate(S: Dictionary) -> bool:
	var pd = S.get("pd")
	if not (pd is Dictionary) or int(pd.get("v", 0)) != 1 or not (pd.get("run") is Dictionary) or not (pd.get("signs") is Dictionary):
		return false
	var run: Dictionary = pd.run
	if run.is_empty():
		return true
	return M.WORKERS.has(str(run.get("worker", ""))) and run.get("log") is Array and (str(run.get("job", "")) == "" or (M.JOBS.has(str(run.job)) and run.get("world") is Dictionary))


func my_look(S: Dictionary, look: Dictionary) -> Dictionary:
	var jk := str(_pd(S).get("run", {}).get("job", ""))
	if jk == "":
		return look
	var out := look.duplicate()
	var w: Dictionary = X.WORK[jk]
	out.outfit = w.outfit
	for k in ["apron", "vest", "cap"]:
		if w.look.has(k):
			out[k] = w.look[k]
	return out


func hud(S: Dictionary) -> Array:
	var run: Dictionary = _pd(S).get("run", {})
	if run.is_empty():
		return [{"label": "Goal", "value": "Talk to Ms. Okafor"}]
	var W: Dictionary = M.WORKERS[run.worker]
	var out := [{"label": "Jar", "value": "%s / %s" % [Money.fmt(run.jar), Money.fmt_w(W.goal)]},
		{"label": "Bank", "value": Money.fmt(run.bank), "warn": int(run.bank) < 0},
		{"label": "Paycheque", "value": "%d of %d" % [mini(M.PERIODS, int(run.p) + (1 if int(run.p) < M.PERIODS else 0)), M.PERIODS]}]
	if int(run.bounces):
		out.append({"label": "Bounced", "value": str(int(run.bounces)), "warn": true})
	return out


# ── Steps: four chapters, each ending at the soft gate ──
func steps() -> Array:
	var a := ["chapter:0", "meet", "board", "paytype"]
	a += _period(1) + _period(2) + ["light", "end1", "gate:1"]
	a += ["chapter:1", "start2"] + _period(3) + ["mostub"] + _period(4) + ["why", "gate:2"]
	a += ["chapter:2", "extra"] + _period(5) + ["bday", "clue", "stamps", "milo"] + _period(6) + ["end3", "gate:3"]
	a += ["chapter:3", "hall"] + _period(7) + ["fix"] + _period(8) + ["hero", "finale"]
	return a


func _period(p: int) -> Array:
	return ["plan:%d" % p, "shift:%d" % p, "bank:%d" % p]


func chapter(T, n: String) -> void:
	var ch := int(n)
	var pd: Dictionary = T.S.pd
	pd.ch = ch
	T.G["snap"] = {"S": T.S.duplicate(true), "si": int(T.G.si), "map": T.world.map.id, "x": T.world.me.tile.x, "y": T.world.me.tile.y}
	T.banner("Chapter %d · %s" % [ch + 1, CHAPTERS[ch].moment], CHAPTERS[ch].name)
	T.save()


## The soft gate: start the next chapter now, or look around town until the project step is done (an honour system, not a lock).
func gate(T, n: String) -> void:
	var ch := int(n)
	var pd: Dictionary = T.S.pd
	if int(pd.gate_wait) != ch:
		var v = await T.panel("Chapter %d done" % ch, func(body):
			body.add_child(T.ui.rich("Next: [b]%s of your project[/b], in class. Chapter %d, [b]%s[/b], picks up after it." % [CHAPTERS[ch - 1].step, ch + 1, CHAPTERS[ch].name]))
			body.add_child(T.ui.label("You can start it now, or look around town first. Ms. Okafor starts it whenever you're ready.", "Muted")), [["Start Chapter %d" % (ch + 1), "go", true], ["Not yet: look around town", "later"]], "Chapter break")
		if v == "go":
			return
		pd.gate_wait = ch
		T.save()
	while true:
		await T.goal("Chapter %d waits for %s of your project. When you're ready, talk to Ms. Okafor at the Job Centre." % [ch + 1, CHAPTERS[ch - 1].step], "person:okafor")
		if await T.choose("okafor", "Hey, hey! Ready for Chapter %d: %s?" % [ch + 1, CHAPTERS[ch].name], ["Yes, let's go!", "Not yet"]) == 0:
			break
		await T.say("okafor", "No rush. Come back when your project step is done.")
	pd.gate_wait = -1


func _lost(T) -> void:
	T.G["lost"] = int(T.G.get("lost", 0)) + 1    # after a second loss, Gentle comes first
	var again := int(T.G.lost) >= 2
	var v = await T.panel("Game over", func(body): body.add_child(T.ui.label(LOST_LINE)),
		[["Switch to Gentle and replay", "gentle", true], ["Replay this chapter in Real", "replay"]] if again else [["Replay this chapter", "replay", true], ["Switch to Gentle and replay", "gentle"]])
	if v == "gentle":
		T.G.mode = "gentle"
	var snap: Dictionary = T.G.snap
	T.G.S = snap.S.duplicate(true)
	T.G.si = int(snap.si) - 1          # the step loop moves on by one: the chapter starts again
	T.go(snap.map, int(snap.x), int(snap.y), "down")


func _toast_bag(T, what: String) -> void:
	T.toast("Added to your Bag: " + what)


func _pun(pd: Dictionary) -> String:
	pd.pun = (int(pd.pun) + 1) % X.PUNS.size()
	return X.PUNS[int(pd.pun)]


## Everyone in the room turns toward a tile (you, or the mayor).
func _face_all(T, toward: Vector2i) -> void:
	for pid in T.people_def:
		var w = where(pid, T.S)
		if w != null and w.map == T.world.map.id:
			T.world.face(pid, toward)


# ── Chapter 1: pick a job, the first paycheques, and Mo's hunch ──
func meet(T) -> void:
	await T.goal("Go to the Job Centre on Main Street and say hi to Ms. Okafor", "person:okafor")
	await T.say("okafor", ["Hey, hey! You must be {name}. I’m Ms. Okafor!", "I help people find work. It’s the best job in town. Don’t tell the mayor.",
		"Want to try something fun? Let’s jump ahead a few years. You’ll get a job and a real paycheque."])
	var keys := ["avery", "dev", "rosa"]
	var i: int = await T.choose("okafor", "Which future you do you want to play?", [X.SIT.avery.label, X.SIT.dev.label, X.SIT.rosa.label], int(T.S.seed) % 3)
	var pd: Dictionary = T.S.pd
	pd.sit = keys[i]
	pd.run = M.new_run(pd.sit, "", T.S.seed)
	var W: Dictionary = M.WORKERS[pd.sit]
	await T.say("okafor", X.FUTURE[pd.sit] + ["So here’s your goal: save %s for %s. You have 8 paydays. That’s about four months." % [Money.fmt_w(W.goal), W.goal_label],
		"First, you need a job! Check the job board by the window. Let’s go!"])
	pd.card = true
	_toast_bag(T, "Pay Card (2026)")
	T.refresh()


func board(T) -> void:
	await T.goal("Find a job on the job board at the Job Centre", "thing:jobboard")
	var pd: Dictionary = T.S.pd
	var jk: String = await P.job_board(T, T.S)
	M.set_job(pd.run, jk)
	pd.ad = true
	T.log_line("Took the job: %s at %s (%s)." % [M.JOBS[jk].title, M.JOBS[jk].biz, X.pay_text(M.JOBS[jk])])
	T.refresh_look()
	T.refresh()
	await T.say("you", ["I got the job at %s!" % M.JOBS[jk].biz, "And I get a %s. Looking good." % X.WORK[jk].outfit_label])


func paytype(T) -> void:
	await T.goal("Tell Ms. Okafor about your new job", "person:okafor")
	await T.say("okafor", "You got a job? Big play! I knew it.")
	var q := X.q("paytype", T.S.pd)
	await T.ask("okafor", q, "q-paytype", q.label)
	await T.typed({"id": "downside", "title": "One downside", "min": 8,
		"prompt": "Every way to get paid has a downside. What is one downside of this pay type for you? (Your project asks this too.)"})
	await T.say("okafor", ["Nice thinking. Now go home and plan your first payday.", "Then go get paid!"])


func plan(T, ps: String) -> void:
	var p := int(ps)
	var pd: Dictionary = T.S.pd
	T.S.day = p
	await T.goal("Go home and plan your first payday at the kitchen table" if p == 1 else "Go home and plan payday %d at the kitchen table" % p, "thing:table")
	var fam := _family(T.S)
	if pd.letters.size():
		await T.say(fam, ["Uh oh. You got a letter."] + pd.letters + ["Maybe plan a little more carefully this time?"])
		pd.letters = []
	if str(pd.pending_ask) != "":
		var t: String = pd.pending_ask
		if not pd.asks.has(t):
			pd.asks[t] = {"seen": 0, "first": 0}
		pd.asks[t].seen = int(pd.asks[t].seen) + 1
		pd.last_ask = int(pd.run.p)
		var r: Dictionary = await T.ask(fam, X.ASKS[t], "ask-%s-p%d" % [t, int(pd.run.p)], "What would help? (%s)" % ("a payment bounced" if t == "bounce" else "jar behind"))
		if r.first:
			pd.asks[t].first = int(pd.asks[t].first) + 1
		pd.pending_ask = ""
	pd.plan = await P.plan(T, T.S, p)
	T.refresh()


func shift(T, ps: String) -> void:
	var p := int(ps)
	var pd: Dictionary = T.S.pd
	var run: Dictionary = pd.run
	var b: String = "boss_" + str(run.job)
	var w: Dictionary = X.WORK[run.job]
	await T.goal("Go to work at %s. %s is waiting." % [M.JOBS[run.job].biz, w.boss], "person:" + b)
	if p == 1:
		await T.say(b, w.hi)
	if not run.shifts.has(str(p)):
		run.shifts[str(p)] = "ok"   # the job games come in batch 2: every shift is steady, as in v1 without them
	await P.shifts(T, T.S, p)
	T.banner("Payday", "Paycheque %d of 8" % p)
	if p >= 5 and p <= 7:
		if pd.errs.is_empty():
			pd.errs = M.error_plan(T.S.seed)
		if pd.signs.has(str(p)) and int(run.p) < p:
			return    # signed already (a reload before the bank)
		await T.say(b, ["Here’s your stub. Pay-O-Matic made it!", "The app is new. Please check it before you sign."] if p == 5 else (["Stub time. Check it, then sign. You know the drill."] if p == 6
			else (["Milo hasn’t fixed Pay-O-Matic yet. This stub came from the old version.", "Check every line before you sign. Please."] if _story(T.S).has("hall") else ["They say Pay-O-Matic got an update.", "Check your stub anyway, okay?"])))
		await _sign_own(T, p)
	else:
		await T.say(b, [w.pay, "Here’s your first paycheque. Take it to the bank!"] if p == 1 else ([w.pay, "Pay-O-Matic 3001 made this one. I hear you fixed it. Thank you!"] if p == 8 and _story(T.S).has("fixed") else [w.pay]))
	_toast_bag(T, "Pay stub %d" % p)


func _timesheet(run: Dictionary, p: int) -> String:
	var a := M.actual_of(run, p)
	var j: Dictionary = M.JOBS[run.job]
	var t := "Your timesheet, paycheque %d: " % p + ("salary, %s a year" % Money.fmt_w(a.yearly) if j.type == "salary" else "%d hours at %s" % [a.hours, Money.fmt(a.rate)])
	if j.type == "commission":
		t += ", sales %s (%d%% commission)" % [Money.fmt_w(a.sales), roundi(float(j.pct) * 100)]
	return t + ". Age %d." % a.age


func _sign_own(T, p: int) -> void:
	var pd: Dictionary = T.S.pd
	var run: Dictionary = pd.run
	var j: Dictionary = M.JOBS[run.job]
	var a := M.actual_of(run, p)
	var kind := M.error_kind_for(run, p, pd.errs)
	var st := M.stub_as_printed(run, p, kind)
	var right := M.stub_as_printed(run, p, "")
	var boss: String = X.WORK[run.job].boss
	var pct := float(j.get("pct", 0))
	var res: Dictionary = await P.sign(T, {"title": "Paycheque %d: check it before you sign" % p, "kicker": M.JOBS[run.job].biz,
		"intro": "Pay-O-Matic 3000 made this stub for %s. [b]Check every line[/b] with your timesheet and the Pay Card. Once you sign, the bank pays what the stub says." % boss,
		"facts": _timesheet(run, p), "biz": j.biz, "right_head": "Age %d · paycheque %d" % [a.age, p], "rows": P.sign_rows(j.type, st, pct, a.yearly),
		"root": st.root, "explain": func(k): return P.explain(k, st, right, pct, a.yearly), "follows": P.follows(st.root), "voice": boss,
		"key": "sign-p%d" % p, "label": "Paycheque %d: check the boss’s stub" % p, "go": "Take it to the bank",
		"caught_line": "%s: Huh. You’re right! Pay-O-Matic messed that up. I fixed it. Your stub now pays %s." % [boss, Money.fmt(right.net)],
		"ok_line": "Every line checks out. Signed!", "signed_line": "You signed it. The bank will pay what the stub says: %s." % Money.fmt(st.net)})
	var short: int = int(right.net) - int(st.net) if res.result == "signed" else 0
	pd.signs[str(p)] = {"kind": kind, "result": res.result, "short": short}
	T.log_line("Paycheque %d stub: %s." % [p, {"caught": "found the mistake and disputed it", "ok": "checked it and signed (it was right)", "signed": "signed it with a mistake (%s short)" % Money.fmt(short)}[res.result]])


func bank(T, ps: String) -> void:
	var p := int(ps)
	var pd: Dictionary = T.S.pd
	var run: Dictionary = pd.run
	var j: Dictionary = M.JOBS[run.job]
	await T.goal("Take paycheque %d to Sam at the bank" % p, "person:sam")
	var signed = pd.signs.get(str(p))
	var fresh := int(run.p) < p
	if p == 1:
		await T.say("sam", ["Welcome to the bank! I’m Sam.", "I’d tell you a joke about money. But it’s not worth it.", "Okay! Let’s open your very first pay stub."])
		await P.reveal(T, T.S, p)
	elif int(pd.ch) == 0:
		await T.say("sam", _pun(pd))
		await P.reveal(T, T.S, p)
	elif signed == null:
		await T.say("sam", ["This time, you fill in the stub.", "Grab the Pay Card. It’s in the panel, and in your Bag. You’ve got this."] if p == 3 else [_pun(pd), "Same as last time. You fill it in."])
		if fresh:
			var a := M.actual_of(run, p)
			var gh: String = "Yearly salary ÷ 26." if j.type == "salary" else ("Hours × wage, plus %d%% of sales." % roundi(float(j.pct) * 100) if j.type == "commission" else "Hours × wage: %d × %s." % [a.hours, Money.fmt(a.rate)])
			await P.lines(T, {"kind": "stub", "title": "Paycheque %d: fill in your pay stub" % p, "kicker": "The bank", "card": true, "wide": true,
				"intro": "Teller Sam slides the stub across. [b]%s[/b]%s" % [P.given_text(j, a), (". Your %s in cash tips go in too. They are not on the stub." % Money.fmt_w(a.tips)) if a.tips else "."],
				"doc": j.biz, "doc_right": "Age %d · paycheque %d" % [a.age, p], "fields": P.stub_fields(a.stub, gh), "key": "stub-p%d" % p, "label": "Paycheque %d: " % p,
				"check": "Check my stub", "go": "Deposit it"})
	else:
		var sg: Dictionary = signed
		await T.say("sam", ["Hmm. This stub pays you %s less than your timesheet says." % Money.fmt(sg.short), "You signed it, so it will be hard to get that back.", "Next time, check every line before you sign."] if int(sg.short) > 0
			else (["Nice catch on that stub! Lots of people just sign."] if sg.result == "caught" else ["Checked and signed. Let’s put it in."]))
	var l: Dictionary
	if fresh:
		l = M.payday(run, int(pd.plan), T.mode() == "real", int(signed.short) if signed != null else 0)
		T.log_line("Paycheque %d: take-home %s, %s to the jar, %s left in the bank%s." % [p, Money.fmt(int(l.stub.net) - int(l.short) + int(l.tips)), Money.fmt(l.jar_in), Money.fmt(l.bank), ". A payment bounced" if l.bounced else ""])
	else:
		l = run.log[p - 1]
	T.refresh()
	await P.deposit(T, T.S, l)
	if bool(l.bounced) and fresh:
		pd.letters.append("It’s from your %s: “Your payment bounced. Your bank charged you a %s fee. Please make sure there is enough money next time.”" % ["phone company" if run.worker == "avery" else "landlord", Money.fmt_w(M.FEE)])
	if p == 1:
		var q := X.q("whyLess", pd)
		await T.ask("sam", q, "q-whyLess", q.label)
	pd.pending_ask = _want_ask(pd)
	T.save()
	if T.mode() == "real" and int(run.strikes) >= M.STRIKES_TO_LOSE:
		await _lost(T)


## "What would help?": never two paycheques running; a topic stops after 2 first-try answers or 4 showings.
func _want_ask(pd: Dictionary) -> String:
	var t := M.help_topic(pd.run)
	if t == "":
		return ""
	var a: Dictionary = pd.asks.get(t, {})
	if int(a.get("first", 0)) >= 2 or int(a.get("seen", 0)) >= 4:
		return ""
	if int(pd.run.p) - int(pd.last_ask) < 2:
		return ""
	return t


func light(T) -> void:   # the mystery starts: a hunch, and you cannot check it yet
	await T.goal("Mo is still at the bank, counting his cheque. Ask what’s wrong.", "person:worker")
	await T.say("worker", ["Oh, hey. You work in town too, right?", "I feel like my boss gave me the wrong amount of money on my cheque.",
		"It feels light. Not by a lot. Just... light.", "My boss is testing some new pay app on our crew. He says it’s faster than doing pay by hand."])
	await T.say("you", ["Can I see?", "Gross pay, EI, CPP, income tax... I don’t know what half of these mean yet."])
	await T.say("sam", ["Most people don’t. They just trust the number at the bottom.", "Learn to read a stub, and you’ll be the first person in town who can check one."])
	await T.say("worker", "If you ever figure these things out, come find me. I work in the Industrial Yard, past Market Lane.")
	await T.say("you", "I’ll start some notes. Just in case.")
	T.S.pd.story.mo1 = 1
	_toast_bag(T, "Case notes")
	T.refresh()


func end1(T) -> void:
	await T.goal("Tell Ms. Okafor how your first month went", "person:okafor")
	await T.say("okafor", ["First month done! Your jar has %s." % Money.fmt(T.S.pd.run.jar), "Did you see how much came off your pay? Wild, right?"])
	await T.say("you", "Mo thinks his cheque was short. But I couldn’t tell.")
	await T.say("okafor", ["Hmm. Next time, you’ll learn to read every line of a pay stub. Then you can tell.",
		"Time for Step 1 of your project. Find a real job ad and work out the gross pay.", "See you after your next lesson!"])


# ── Chapter 2: read a stub, and prove Mo's hunch ──
func start2(T) -> void:
	var run: Dictionary = T.S.pd.run
	M.start_chapter(run, 2)
	T.refresh()
	if int(run.covered) > 0:
		var f := _family(T.S)
		var c := Money.fmt(run.covered)
		var lines: Array = ["Hey. Your bank account went below zero.", "I covered it this time. %s." % c, "From now on, plan with the money that really lands in your account. Deal?"] if f == "mom" \
			else (["Dude. Your account went below zero.", "I covered you. %s. You owe me pizza." % c, "Next time, plan with what lands in the bank. Not the big number."] if f == "dev"
			else ["So... your account dipped below zero.", "I covered it. %s. Just this once!" % c, "Plan with your take-home pay. That’s the money you really get."])
		await T.goal("Go home. Someone wants to talk about money.", "person:" + f)
		await T.say(f, lines)


func mostub(T) -> void:   # the first proof: Mo's stub from Pay-O-Matic's test run
	var t := M.story_stub("mo")
	var st: Dictionary = t.printed
	await T.goal("You can read a pay stub now. Go find Mo in the Industrial Yard.", "person:worker")
	await T.say("worker", ["Sam says you can read a pay stub now. Is that true?", "Here’s mine. Timesheet says 40 hours. Can you work out what I SHOULD have got?"])
	await P.lines(T, {"kind": "story", "title": "Mo’s pay stub", "kicker": "The Pay-O-Matic mystery", "card": true, "wide": true,
		"intro": "Mo worked [b]%d hours at %s an hour[/b]. He is %d. Fill in the stub he should have got.\nThe stub his boss’s app printed: %d hours · gross %s · net pay [b]%s[/b]." % [
			t.hours, Money.fmt(t.rate), t.age, st.hours, Money.fmt(st.gross), Money.fmt(st.net)],
		"doc": "Northgate Builders", "doc_right": "Age %d · %d hours" % [t.age, t.hours],
		"fields": P.stub_fields(t.right, "Hours × wage: %d × %s." % [t.hours, Money.fmt(t.rate)]), "key": "story-mo", "label": "Mo’s stub: "})
	await T.say("you", ["You should have taken home %s. The stub says %s." % [Money.fmt(t.right.net), Money.fmt(st.net)],
		"It paid you for %d hours, not %d. That’s %s of your take-home pay gone!" % [st.hours, t.hours, Money.fmt(int(t.right.net) - int(st.net))]])
	await T.say("worker", ["I KNEW it felt light!", "My boss calls the app Pay-O-Matic 3000. A kid named Milo made it. Mrs. Novak’s nephew.", "Milo told my boss it’s “basically perfect”."])
	await T.say("you", "I’m writing this down. Show your boss your timesheet!")
	T.S.pd.story.mo2 = 1
	T.toast("Added to your Case notes: Mo’s stub")


func why(T) -> void:
	await T.goal("Tell Ms. Okafor what you learned", "person:okafor")
	await T.typed({"id": "why", "title": "In your own words", "min": 8, "prompt": "Why didn’t all your gross pay land in your bank account? Name the deductions."})
	await T.say("okafor", ["Love it. Now do Step 2 of your project: build a pay stub. The Project Checker in your Bag can check your lines.",
		"Oh! Big news. Every shop in town is getting a new payroll app.", "It’s called Pay-O-Matic 3000. It does all the pay math for the bosses."])
	await T.say("you", "Wait. Pay-O-Matic? That’s the app that took four hours off Mo’s pay!")
	await T.say("okafor", ["Really? Hmm. Every boss in town just bought it.", "Keep your Case notes handy. You can read a stub now. Most people in this town can’t.", "See you next lesson!"])
	T.S.pd.story.townwide = 1


# ── Chapter 3: where deductions go, more clues, and Milo ──
func extra(T) -> void:
	var run: Dictionary = T.S.pd.run
	var b: String = "boss_" + str(run.job)
	await T.goal("Your boss at %s wants to see you" % M.JOBS[run.job].biz, "person:" + b)
	await T.say(b, [X.WORK[run.job].app, "Oh, and we’re busy! Can you work %d extra hours on the weekends?" % M.extra_hours(run.worker)])
	var q := X.q("extra", T.S.pd)
	await T.ask(b, q, "q-extra", q.label)
	var i: int = await T.choose(b, "So, will you take the extra hours?", ["Sure, I’ll take them", "No thanks"])
	run.extra = i == 0
	T.log_line("Extra weekend hours: %s." % ("took them" if run.extra else "said no thanks"))
	await T.say("you", "That means missing the movie with my friends on Saturday. Oh well." if run.extra else "I need my weekends. Maybe next time.")


func bday(T) -> void:
	if _sit(T.S) != "avery":
		return
	await T.goal("Go home. Someone is waiting for you.", "person:mom")
	await T.say("mom", ["Surprise! Happy 18th birthday!", "There’s cake. Chocolate, obviously."])
	var q := X.q("newline", T.S.pd)
	await T.ask("mom", q, "q-newline", q.label)


## Someone else's Pay-O-Matic stub, to sign or dispute. t: a story stub.
func _pom(T, t: Dictionary, title: String, intro: String, key: String, label: String) -> Dictionary:
	var st: Dictionary = t.printed
	var right: Dictionary = t.right
	var facts := ""
	if t.type == "given":
		facts = "Age %d. Only the deductions can be wrong on this one." % t.age
	elif t.type == "salary":
		facts = "Job offer: %s a year · age %d" % [Money.fmt_w(t.yearly), t.age]
	else:
		facts = "Timesheet: %d hours at %s an hour%s · age %d" % [t.hours, Money.fmt(t.rate), (" · sales " + Money.fmt_w(t.sales)) if t.type == "commission" else "", t.age]
	var names := {"hours": "hours", "comm": "commission", "salary": "salary", "gross": "gross pay", "ei": "EI", "cpp": "CPP", "tax": "income tax", "net": "net pay"}
	return await P.sign(T, {"kind": "story-sign", "title": title, "kicker": "The Pay-O-Matic mystery", "intro": intro, "facts": facts, "biz": t.biz, "right_head": "Age %d" % t.age,
		"rows": P.sign_rows(t.type, st, float(t.pct), int(t.yearly)), "root": st.root, "explain": func(k): return P.explain(k, st, right, float(t.pct), int(t.yearly)),
		"follows": P.follows(st.root), "key": key, "label": label, "story": true,
		"caught_line": "Caught it! The %s line was wrong. Fixed, the stub pays %s." % [names.get(st.root, "one"), Money.fmt(right.net)],
		"signed_line": "Signed with a mistake. The %s line was wrong: the stub paid %s less than it should." % [names.get(st.root, "one"), Money.fmt(int(right.net) - int(st.net))]})


func clue(T) -> void:   # a second clue, and a different mistake: the pattern starts to show
	var f := _friend(T.S)
	var name: String = T.people_def[f].name
	var t := M.story_stub(f)
	await T.goal("%s needs help with something" % name, "person:" + f)
	await T.say(f, ["Hey! Can you look at my stub?", "Something feels off. Everything on it looks so official, though.", "Pay-O-Matic made it. Do I just sign?"] if f == "avery"
		else ["Can you look at this?", "My cheque came out smaller than last time. Same hours! Same sales!", "Pay-O-Matic made it."])
	var r: Dictionary = await _pom(T, t, "Check %s’s stub" % name, "%s got this stub from Pay-O-Matic 3000. Check every line before it gets signed." % name, "story-friend", "%s’s stub: find the mistake" % name)
	var line := "CPP" if f == "avery" else "EI"
	await T.say(f, ["Wait. The %s line was wrong? I would never have known." % line] if r.result == "signed" else ["You found it! I’m showing my boss right now."])
	await T.say("you", ["Mo’s stub had the wrong hours. This one has the wrong %s." % line, "So Pay-O-Matic doesn’t make just one mistake. It gets different rules wrong."])
	T.S.pd.clue_friend = name
	T.S.pd.story.friend = 1
	T.toast("Added to your Case notes: %s’s stub" % name)


func stamps(T) -> void:
	var pd: Dictionary = T.S.pd
	await T.goal("Ms. Okafor wants to show you something", "person:okafor")
	await T.say("okafor", ["You know what comes off your pay. But where does it GO?", "Let’s find out. Here’s a Deduction Map.", "Visit Jas, your grandpa and the hospital. Get a stamp from each!"])
	pd.map_given = true
	pd.stamp_phase = true
	_toast_bag(T, "Deduction Map")
	while true:
		var left := STAMPS.filter(func(o): return not pd.stamps.has(o[0]))
		if left.is_empty():
			break
		var names := []
		for o in left:
			names.append(o[1])
		await T.goal("Where does it go? Visit %s (%d of 3 stamps)" % [", ".join(names), 3 - left.size()], "person:" + left[0][0])
		await _stamp_visit(T, left[0][0])
	pd.stamp_phase = false


func _stamp_visit(T, who: String) -> void:
	var pd: Dictionary = T.S.pd
	var key: String = {"jas": "card-ei", "grandpa": "card-cpp", "nurse": "card-tax"}[who]
	var q := X.q(key, pd)
	match who:
		"jas":
			await T.say("jas", ["Hey. So... the shoe store closed. I lost my job.", "It was scary. But I’m okay for now."])
		"grandpa":
			await T.say("grandpa", ["Come in, come in! Did I ever tell you about my first paycheque?", "Two dollars an hour! I felt so rich. I bought a milkshake every day.", "Now I’m retired. I get to nap whenever I want."])
		"nurse":
			await T.say("nurse", ["Busy day! A kid fell off a skateboard and broke a wrist.", "We fixed it right up. Cast and all."])
	await T.ask(who, q, "q-" + key, q.label)
	var nu: Dictionary = M.story_stub("nurse").printed
	match who:
		"jas":
			await T.say("jas", ["One more thing. My last cheque from the shoe store was short too.", "They had just switched to Pay-O-Matic. Weird, right?"])
		"grandpa":
			await T.say("grandpa", ["Oh! A young fella came by last week, asking how CPP works. Milo, I think.", "I told him. He wrote it on his hand. Then he licked his thumb to turn a page."])
		"nurse":
			await T.say("nurse", ["Oh, and the hospital pays us with Pay-O-Matic now.", "My income tax this time was %s on %s gross. That seems like a lot." % [Money.fmt(nu.tax), Money.fmt(nu.gross)]])
			await T.say("you", "I’ll put that in my Case notes. I can check it with the Pay Card.")
	pd.story[who] = 1
	pd.stamps[who] = 1
	T.toast("Stamp added to your Deduction Map (%d of 3)" % pd.stamps.size())
	T.save()


func milo(T) -> void:   # the source: Milo, who learned pay math from "Math Is Optional"
	var pd: Dictionary = T.S.pd
	pd.story.miloOut = 1
	T.refresh()
	await T.goal("Mx. Lin at the library has something to tell you", "person:librarian")
	await T.say("librarian", ["Psst. You’re the one keeping notes on Pay-O-Matic? Everyone is talking about it.", "The boy who made it is right over there. Milo. He’s here every day."])
	await T.goal("Talk to Milo at the library", "person:milo")
	await T.say("milo", ["Oh, hi! Want a sticker? “Pay-O-Matic 3000: pay math, solved!”", "Every boss in town uses it. I’m basically a genius."])
	var i: int = await T.choose("milo", "What do you want to do?", ["Show him your Case notes", "Ask how Pay-O-Matic works"])
	if i == 0:
		await T.say("milo", ["Four hours missing? %s Hmm." % ("CPP at 17?" if pd.clue_friend == "Avery" else "Too much EI?"), "Those are... user errors. Probably."])
	else:
		await T.say("milo", ["Easy! It takes the hours, does some percents, and done.", "I learned it all from one book. “Math Is Optional.”"])
		await T.say("you", "Which percents?")
		await T.say("milo", "...The usual ones?")
	await T.say("milo", "Pay-O-Matic is perfect. I’m almost sure. Mostly sure.")
	await T.say("you", "He doesn’t know the rules. But I do.")
	pd.story.milo = 1
	T.toast("Added to your Case notes: Milo")


func end3(T) -> void:
	await T.goal("Show Ms. Okafor your Deduction Map", "person:okafor")
	await T.say("okafor", "Three stamps! You’re on fire. One more question.")
	var q := X.q("taxfree", T.S.pd)
	await T.ask("okafor", q, "q-taxfree", q.label)
	await T.say("okafor", ["Now do Step 3 of your project. Where does each deduction go? Who does it help? Your Deduction Map can help.",
		"And hey, Town Hall is having a big meeting about Pay-O-Matic. Everyone is upset, but nobody can say what’s wrong.", "Bring your Case notes. You might be the only one who can."])


# ── Chapter 4: the proof at Town Hall, taxes, the fix, the town's thanks, the goal ──
func _my_case(pd: Dictionary) -> Dictionary:   # your own Pay-O-Matic stub with a mistake (paycheque 5 or 6 always has one)
	for p in [5, 6]:
		if pd.errs.is_empty() or int(pd.run.p) < p:
			continue
		var k := M.error_kind_for(pd.run, p, pd.errs)
		if k != "":
			return {"p": p, "kind": k, "printed": M.stub_as_printed(pd.run, p, k)}
	return {}


func _facts(type: String, o: Dictionary) -> String:
	if type == "given":
		return "Age %d" % int(o.age)
	if type == "salary":
		return "Salary %s a year · age %d" % [Money.fmt_w(o.yearly), int(o.age)]
	return "Timesheet: %d hours at %s an hour%s · age %d" % [int(o.hours), Money.fmt(o.rate), (" · sales %s (%d%% commission)" % [Money.fmt_w(o.sales), roundi(float(o.pct) * 100)]) if type == "commission" else "", int(o.age)]


const CASE_HINT := {"hours": "Compare the hours on the stub with the timesheet.", "commission": "Work out the commission from the sales on the timesheet.", "cppMinor": "Look at the age. When does CPP start?",
	"cppExempt": "Work out CPP: 5.95% of (gross pay − $135).", "ei": "Work out EI: 1.63% of the gross pay.", "taxRow": "Find the Pay Card row nearest the gross pay."}


func hall(T) -> void:   # the proof, then taxes
	var pd: Dictionary = T.S.pd
	var f := _friend(T.S)
	pd.scene = "hall"
	T.refresh()
	await T.goal("Go to the big meeting at Town Hall", "person:mayor")
	var mayor_at := Vector2i(4, 3)
	_face_all(T, mayor_at)
	await T.say("mayor", ["Order! Order! Thank you all for coming.", "First: Pay-O-Matic 3000. Fourteen complaints this week!", "But a complaint is not proof. Does anyone know what is actually wrong?"])
	await T.say("worker", "My cheque felt light!")
	await T.say(f, "Mine too!")
	await T.say("milo", "Pay-O-Matic is perfect! People just don’t understand math!")
	await T.say("mayor", "Feelings are not proof. Anyone?")
	_face_all(T, T.world.me.tile)   # the whole room turns to you
	await T.say("you", "I can show you. I’ve kept notes for months.")
	var kinds := M.RULES.keys()
	var opts := []
	for k in kinds:
		opts.append(M.RULES[k])
	var cards := []
	var add := func(cid: String, ttl: String, biz: String, type: String, facts: String, st: Dictionary, kind: String) -> void:
		cards.append({"id": cid, "title": ttl, "facts": facts, "opts": opts, "ans": kinds.find(kind), "hint": CASE_HINT[kind], "placeholder": "What went wrong? Choose one…",
			"show": func(TT, body): P.mini_stub(TT, body, biz, type, st)})
	for sid in ["mo", f, "nurse"]:
		var t := M.story_stub(sid)
		var ttl: String = "Mo’s stub" if sid == "mo" else ("Nurse Kaur’s stub" if sid == "nurse" else T.people_def[sid].name + "’s stub")
		add.call("friend" if sid == f else sid, ttl, t.biz, t.type, _facts(t.type, t), t.printed, t.kind)
	var mine := _my_case(pd)
	if not mine.is_empty():
		var j: Dictionary = M.JOBS[pd.run.job]
		var a := M.actual_of(pd.run, int(mine.p))
		add.call("you", "Your paycheque %d stub" % int(mine.p), j.biz, j.type, _facts(j.type, {"hours": a.hours, "rate": a.rate, "sales": a.sales, "pct": j.get("pct", 0), "yearly": a.yearly, "age": a.age}), mine.printed, mine.kind)
	await P.pick(T, {"kind": "case", "title": "Town Hall: present your case", "kicker": "The Pay-O-Matic mystery", "cards": cards, "key": "case", "label": "Town Hall proof: ",
		"intro": "The whole town is watching. For each stub in your Case notes, show council [b]what Pay-O-Matic got wrong[/b]. Check it with the facts and your Pay Card.",
		"check": "Show council", "fin_line": "Every mistake named. Council is listening."})
	await T.say("mayor", ["You named the mistake on every stub. And you showed your math.", "Milo? Anything to say?"])
	await T.say("milo", ["...They’re all real. I didn’t check my math. I thought math was optional.", "Can you help me fix it? You know the rules better than I do."])
	await T.say("you", "Meet me at the library.")
	await T.say("mayor", ["Until it’s fixed, every worker checks every stub before signing.", "Next: taxes. Some people want less tax. Some want more. Let’s hear from you."])
	await P.dial(T, T.S)
	_toast_bag(T, "Tax Opinion card")
	await T.say("mayor", "A reason AND a trade-off! You’d make a great councillor. Meeting over!")
	pd.story.hall = 1
	pd.scene = ""
	T.refresh()


func fix(T) -> void:   # you fix Pay-O-Matic: its six settings are the six mistakes
	await T.goal("Help Milo fix Pay-O-Matic at the library", "person:milo")
	await T.say("milo", ["You came! I took “Math Is Optional” back. Mx. Lin gave me a high five.", "Okay. Show me what I got wrong."])
	var HINT := {"hours": "Pay is for every hour worked.", "comm": "Commission is a % of what was really sold.", "ei": "The Pay Card says how much EI is.",
		"cppAge": "The Pay Card says who pays CPP.", "cpp": "The Pay Card says how CPP is worked out.", "tax": "How do you read income tax on the Pay Card?"}
	var cards := []
	for s in M.SETTINGS:
		cards.append({"id": s.k, "title": s.name, "opts": s.opts, "ans": s.right, "start": s.milo, "hint": HINT[s.k]})
	var mo := M.story_stub("mo")
	await P.pick(T, {"kind": "fix", "title": "Fix Pay-O-Matic", "kicker": "The library", "cards": cards, "key": "fix", "label": "Fix Pay-O-Matic: ",
		"intro": "Milo: “These are the rules I typed in. Be honest. Fix anything that’s wrong, then we’ll run a test.”", "check": "Run a test",
		"fin_line": "Fixed! Test run: Mo’s stub, 40 hours at $24.00, age 38. Every line matches the stub you worked out for Mo.",
		"all_done": func(TT, body): P.mini_stub(TT, body, "Northgate Builders", "wage", mo.right, "Pay-O-Matic 3001")})
	await T.say("milo", ["It works! Mo’s stub is right to the penny.", "I’m calling it Pay-O-Matic 3001. The start screen says “Fixed by {name}”.", "Thank you. Really."])
	T.S.pd.story.fixed = 1
	T.toast("Pay-O-Matic is fixed!")


func hero(T) -> void:   # the town says thank you
	var pd: Dictionary = T.S.pd
	var f := _friend(T.S)
	pd.scene = "hero"
	T.refresh()
	await T.goal("Councillor Wright asked everyone to come to Town Hall", "person:mayor")
	_face_all(T, T.world.me.tile)
	await T.say("mayor", ["Everyone, a moment, please!", "A few months ago, nobody in this town could check a pay stub. Then one person learned how.",
		"{name} noticed something was wrong, kept notes, proved every mistake, and helped fix Pay-O-Matic.", "So from today, a person checks every pay stub in town. We’re calling it the {name} Rule."])
	await T.say("worker", "All 40 hours, every cheque. Thank you!")
	await T.say(f, "I check my own stub now. You showed me how!")
	await T.say("milo", "I wrote you a thank-you card. Then I checked the spelling. Twice.")
	await T.say("mayor", "And this is for you.")
	pd.story.hero = 1
	_toast_bag(T, "Town Hero medal")
	T.confetti()
	T.banner("Town Hero", "The %s Rule" % T.player_name())
	await T.say("you", ["Thank you, everyone!", "Now go check your pay stubs."])
	pd.scene = ""
	T.refresh()


func finale(T) -> void:
	var pd: Dictionary = T.S.pd
	var run: Dictionary = pd.run
	var W: Dictionary = M.WORKERS[run.worker]
	await T.goal("Go home and count your jar", "thing:table")
	var o := M.outcome(run)
	if o.get("win", false):
		await T.say("you", ["The jar has %s!" % Money.fmt(run.jar), "That’s enough for %s. I did it!" % W.goal_label, "Every bill is paid, too. I still have %s in the bank." % Money.fmt(run.bank)])
	elif o.get("why", "") == "overdrawn":
		await T.say("you", ["The jar has %s. But my bank account is below zero (%s)." % [Money.fmt(run.jar), Money.fmt(run.bank)], "Some bills didn’t get paid. So it doesn’t count yet."])
	else:
		var L := ["The jar has %s. I needed %s." % [Money.fmt(run.jar), Money.fmt_w(W.goal)], "I’m %s short." % Money.fmt(int(W.goal) - int(run.jar))]
		if int(run.jar) + int(run.bank) >= int(W.goal):
			L.append("Wait. I had %s just sitting in the bank. I could have put more in the jar!" % Money.fmt(run.bank))
		await T.say("you", L)
	pd.finished = true
	pd.win = bool(o.get("win", false))
	T.log_line("Goal: %s (jar %s of %s)." % ["reached" if pd.win else "not reached", Money.fmt(run.jar), Money.fmt_w(W.goal)])
	T.refresh()
	await T.say("okafor", ["You did it, {name}! Goal reached!" if pd.win else "So close, {name}! You learned a ton, though.",
		"Oh, and guess what? Jas got a new job! And the whole town is talking about the {name} Rule.", "Now do Step 4 of your project: pick your path.",
		"Show your teacher your report: Menu, then Report."])


# ── Talking and things ──
func talk(pid: String, T) -> void:
	var S: Dictionary = T.S
	var pd := _pd(S)
	if bool(pd.get("stamp_phase", false)) and pid in ["jas", "grandpa", "nurse"] and not pd.stamps.has(pid):   # a stamp visit out of order still counts
		await _stamp_visit(T, pid)
		T.set_goal_text("Where do your deductions go? %d of 3 stamps. Keep going." % pd.stamps.size())
		return
	var line = _idle(pid, S, T)
	if line == null:
		await super.talk(pid, T)
	else:
		await T.say(pid, line)


func _idle(pid: String, S: Dictionary, T) -> Variant:
	var pd := _pd(S)
	var run: Dictionary = pd.get("run", {})
	var j := str(run.get("job", ""))
	var p := int(run.get("p", 0))
	var done := bool(pd.get("finished", false))
	var s := _story(S)
	var nm: String = T.player_name()
	if pid.begins_with("boss_"):
		var bj := pid.substr(5)
		return X.WORK[bj].idle if j == bj else "We’re busy today. Good luck out there!"
	if pid == "worker" and p >= 1 and p <= 2 and not s.has("mo1"):
		return "Mo is counting his cheque. For the third time. He frowns."
	# where the mystery is: 0 before it, 1 Mo's hunch, 2 Mo's stub, 3 Pay-O-Matic everywhere, 4 after Town Hall, 5 fixed, 6 the town hero
	var stg := 6 if s.has("hero") or done else (5 if s.has("fixed") else (4 if s.has("hall") else (3 if p >= 4 else (2 if s.has("mo2") else (1 if s.has("mo1") else 0)))))
	var by := func(a: Array) -> Variant:
		for i in range(mini(stg, a.size() - 1), -1, -1):
			if a[i] != null:
				return a[i]
		return null
	match pid:
		"okafor":
			return "Hi there! Come talk to me when you’re ready." if run.is_empty() else ("The job board is by the window!" if j == "" else ("Come back anytime. There’s always more to learn!" if done else "You’re doing great. Your next goal is in the top bar."))
		"sam":
			if run.is_empty() or p == 0:
				return "Welcome to the bank! Bring your paycheque here on payday."
			var pre := "Lots of people asking me why their pay is short lately. " if stg == 3 else ("The town hero! Your money is safe with me. " if stg == 6 else _pun(pd) + " ")
			return pre + "Your bank: %s. Your jar: %s." % [Money.fmt(run.bank), Money.fmt(run.jar)]
		"jas":
			return "Guess what? I got a new job! I start Monday. And I’ll check every stub." if done else ("Thanks for listening. I send out résumés every day." if pd.stamps.has("jas") else ("Hey... rough week. I’ll tell you about it sometime." if p >= 4 else "Hi! I work at the shoe store. Best discount in town!"))
		"agent":
			return "Welcome to Service Canada. We help with EI, CPP and lots more."
		"grandpa":
			return "In my day, if your pay was short, you said so. You said so! I’m proud of you." if stg >= 4 else ("Every paycheque you get puts a little into your own pension. Someday you’ll nap too." if pd.stamps.has("grandpa") else "Come visit more often! I have stories. So many stories.")
		"nurse":
			return "I check my stub with the Pay Card now. Wear a helmet, too. I mean it." if s.has("nurse") and stg < 5 else "Wear a helmet. I mean it."
		"mayor":
			return by.call(["Town Hall: where the town decides things. Slowly.", "A young man pitched an app to council. He said “math is optional”. I wrote that down.", null,
				"My inbox is full of Pay-O-Matic complaints. If only someone had proof.", "Milo has until next payday to fix his app.", "Pay-O-Matic is fixed. Democracy works! Slowly.", "The %s Rule! I still can’t believe a student cracked the case." % nm])
		"librarian":
			return by.call(["Free computers! Free books! Free air conditioning!", "Milo keeps borrowing “Apps for Beginners”. He hasn’t touched the math shelf.", null,
				"Milo is here until closing every day. He mutters “it’s the users” a lot.", "Milo borrowed “Payroll Math, Book 1”. Finally!", "Free books! Free computers! And the math shelf is busy for once."])
		"avery":
			return by.call(["Hi! I’m saving up for concert tickets. Every shift counts!", "Milo says his app will make every boss’s life easier. He talks really fast.", null,
				"My stub was wrong AGAIN. Pay-O-Matic strikes again!", "Did you see Milo’s face at Town Hall? Like he bit a lemon.", "Milo is fixing his app with your help? Cool.", "You got a town rule named after you. That’s so cool!"])
		"dev":
			return by.call(["Payday is the best day. Pizza day is second.", "Pay-O-Matic? Sounds like a blender.", null, "Pay-O-Matic says I worked zero hours on Tuesday. I was THERE.", null, "My stubs are right now. Pizza on me!", "The %s Rule. Has a nice ring to it." % nm])
		"rosa":
			return by.call(["A budget isn’t about no fun. It’s about choosing your fun.", null, null, "I check every stub now. Every. Single. Line.", null, null, "Two eyes are good. Four are better. Yours are the best in town."])
		"worker":
			return by.call(["Hard hats on! This site is busy.", "My cheque still feels light. Maybe I’m just tired.", "Four hours, gone! I write my hours on a notepad now.", "Now every shop has Pay-O-Matic? Great. Just great.",
				"Council is on it. Took long enough!", "Pay-O-Matic 3001 paid me for all 40 hours. Every one!", "There’s the hero of the Industrial Yard! My cheque is right every time now."])
		"milo":
			return by.call([null, null, null, "Pay-O-Matic is perfect. Probably.", "I’m checking every rule now. Math is not optional. Who knew?", "Pay-O-Matic 3001! Fixed by you. It says so on the start screen.", "I’m writing a book. “Math Is NOT Optional.”"])
		"mom":
			return "Dinner’s at six. Don’t be late!" if _sit(S) == "avery" else "Hi, sweetie! Say hi to your friends for me."
	return null


func use(thing: String, T) -> void:
	var pd := _pd(T.S)
	var run: Dictionary = pd.get("run", {})
	match thing:
		"fridge":
			if run.is_empty():
				await T.say("", "Leftovers. Again.")
			else:
				var bits := []
				for b in M.WORKERS[run.worker].bills:
					bits.append("%s %s" % [b[1], Money.fmt_w(b[2])])
				await T.say("", "Bills on the fridge: " + ", ".join(bits) + ".")
		"table":
			await T.say("", "The kitchen table. This is where you plan payday.")
		"jobboard":
			await T.say("", "You already work at %s." % M.JOBS[run.job].biz if str(run.get("job", "")) != "" else "Job postings. One of these could be yours!")
		_:
			await super.use(thing, T)


# ── The Bag ──
func bag(S: Dictionary) -> Array:
	var pd := _pd(S)
	var run: Dictionary = pd.get("run", {})
	var T = Engine.get_main_loop().root.get_node("Town")
	var it := []
	if pd.get("card", false):
		it.append({"name": "Pay Card (2026)", "about": "EI, CPP and the income tax table", "view": func(body): P.pay_card(T, body), "wide": true})
	it.append({"name": "Project Checker", "about": "Check your own project’s pay stub", "view": func(body): _checker(T, body), "wide": true})
	if str(run.get("job", "")) != "" and pd.get("ad", false):
		var j: Dictionary = M.JOBS[run.job]
		it.append({"name": "Job ad: " + j.title, "about": j.biz, "view": func(body): body.add_child(T.ui.rich("[b]%s[/b] · %s\n%s\n[b]%s[/b]" % [j.title, j.biz, j.what, X.pay_text(j)]))})
	for l in run.get("log", []):
		var ll: Dictionary = l
		it.append({"name": "Pay stub %d" % int(l.p), "about": "Net %s" % Money.fmt(int(l.stub.net) - int(l.get("short", 0))), "view": func(body): _stub_view(T, body, run, ll)})
	if pd.get("map_given", false):
		it.append({"name": "Deduction Map", "about": "%d of 3 stamps" % pd.stamps.size(), "view": func(body):
			P.table(T, body, [["EI", "✅ Jas: pay while looking for a new job" if pd.stamps.has("jas") else "— visit Jas at Service Canada"],
				["CPP", "✅ Grandpa: a pension after retiring" if pd.stamps.has("grandpa") else "— visit Grandpa"],
				["Income tax", "✅ The hospital: health care for everyone" if pd.stamps.has("nurse") else "— visit the hospital"]])})
	if _story(S).has("mo1"):
		it.append({"name": "Case notes", "about": "The Pay-O-Matic mystery", "view": func(body): _case_notes(T, body, S), "wide": true})
	if _story(S).has("hero"):
		it.append({"name": "Town Hero medal", "about": "The %s Rule" % T.player_name(), "view": func(body): body.add_child(T.ui.rich("[b]Town Hero[/b]\nFor noticing, checking, proving and fixing. From now on, a person checks every pay stub in town: the %s Rule." % T.player_name()))})
	if S.typed.has("claim"):
		it.append({"name": "Tax Opinion card", "about": S.typed.claim.text, "view": func(body): body.add_child(T.ui.rich("[b]Claim:[/b] %s\n[b]Reason:[/b] %s\n[b]Trade-off:[/b] %s" % [S.typed.claim.text, S.typed.reason.text, S.typed.tradeoff.text]))})
	return it


func _stub_view(T, body: Control, run: Dictionary, l: Dictionary) -> void:
	var j: Dictionary = M.JOBS[run.job]
	var v := P.doc(T, body, j.biz, "Paycheque %d · age %d" % [int(l.p), int(l.age)])
	v.add_child(T.ui.label("Timesheet: %s%s%s" % ["salary" if j.type == "salary" else "%d hours" % int(l.hours), (", sales " + Money.fmt_w(l.sales)) if int(l.sales) else "", (", cash tips " + Money.fmt_w(l.tips)) if int(l.tips) else ""], "Muted"))
	for L in P.LINES:
		P.stub_line(T, v, L.name, "", Money.fmt(l.stub[L.k]), L.k in ["ei", "cpp", "tax"], L.k == "net")
	if int(l.get("short", 0)):
		v.add_child(T.ui.label("You signed a stub that paid %s less." % Money.fmt(l.short), "Strong"))


func _case_notes(T, body: Control, S: Dictionary) -> void:
	var pd := _pd(S)
	var s := _story(S)
	var mo := M.story_stub("mo")
	var nu := M.story_stub("nurse")
	var f := _friend(S)
	var li := []
	if s.has("mo1"):
		li.append("[b]Mo, at the bank:[/b] “I feel like my boss gave me the wrong amount of money on my cheque.” His boss is testing a new pay app. [i]A hunch, not proof.[/i]")
	if s.has("mo2"):
		li.append("[b]Mo’s stub:[/b] paid for %d hours, but he worked %d. He should have taken home %s, not %s. The app is [b]Pay-O-Matic 3000[/b]. Milo, Mrs. Novak’s nephew, made it." % [mo.printed.hours, mo.hours, Money.fmt(mo.right.net), Money.fmt(mo.printed.net)])
	if s.has("townwide"):
		li.append("[b]Ms. Okafor:[/b] every shop in town uses Pay-O-Matic now.")
	for k in pd.signs:
		var g: Dictionary = pd.signs[k]
		if g.result == "caught":
			li.append("[b]Your paycheque %s:[/b] a mistake, caught before you signed ✓" % k)
		elif g.result == "signed":
			li.append("[b]Your paycheque %s:[/b] you signed a stub that paid %s less." % [k, Money.fmt(g.short)])
	if s.has("friend"):
		li.append("[b]%s’s stub:[/b] %s A different mistake from Mo’s!" % [T.people_def[f].name, "CPP came off at age 17." if f == "avery" else "the EI was too big."])
	if s.has("jas"):
		li.append("[b]Jas:[/b] the last cheque from the shoe store was short too, right after it switched to Pay-O-Matic.")
	if s.has("grandpa"):
		li.append("[b]Grandpa:[/b] Milo asked him how CPP works, and wrote it on his hand.")
	if s.has("nurse"):
		li.append("[b]Nurse Kaur:[/b] income tax of %s on %s gross. “That seems like a lot.”" % [Money.fmt(nu.printed.tax), Money.fmt(nu.printed.gross)])
	if s.has("milo"):
		li.append("[b]Milo:[/b] learned pay math from “Math Is Optional”. Says Pay-O-Matic is “perfect. Probably.”")
	if s.has("hall"):
		li.append("[b]Town Hall:[/b] you proved the mistakes. Milo admitted it and asked for your help.")
	if s.has("fixed"):
		li.append("[b]Fixed:[/b] you and Milo corrected all six settings. Pay-O-Matic 3001 gets Mo’s stub right.")
	if s.has("hero"):
		li.append("[b]The %s Rule:[/b] a person checks every pay stub in town." % T.player_name())
	for i in li.size():
		body.add_child(T.ui.rich("%d. %s" % [i + 1, li[i]]))


## The Project Checker: the facts of your project's job and your own stub lines → ✓ or ✗ on each line. It never gives answers.
func _checker(T, body: Control) -> void:
	var pd := _pd(T.S)
	body.add_child(T.ui.rich("Type the facts from [b]your project’s[/b] job, then [b]your own[/b] stub lines. This marks each line ✓ or ✗. It does not give answers."))
	var kind := OptionButton.new()
	kind.add_item("Wage (an hourly job)")
	kind.add_item("Salary")
	kind.custom_minimum_size = Vector2(0, 44)
	body.add_child(kind)
	var fields := {}
	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 12)
	for f in [["rate", "Wage per hour ($)"], ["hours", "Hours in two weeks"], ["year", "Salary per year ($)"], ["age", "Worker’s age"],
			["gross", "Gross pay ($)"], ["ei", "EI ($)"], ["cpp", "CPP ($)"], ["tax", "Income tax ($)"], ["net", "Net pay ($)"]]:
		var l: Label = T.ui.label(f[1], "Strong", false)
		var e := LineEdit.new()
		e.custom_minimum_size = Vector2(160, 40)
		grid.add_child(l)
		grid.add_child(e)
		fields[f[0]] = [l, e]
	body.add_child(grid)
	var vis := func(_i = 0) -> void:
		var wage := kind.selected == 0
		for k in ["rate", "hours"]:
			fields[k][0].visible = wage
			fields[k][1].visible = wage
		fields.year[0].visible = not wage
		fields.year[1].visible = not wage
	kind.item_selected.connect(vis)
	vis.call()
	var out: Label = T.ui.label("", "Strong")
	body.add_child(T.ui.button("Check", true, func():
		var wage := kind.selected == 0
		var age := int(fields.age[1].text) if fields.age[1].text.strip_edges().is_valid_int() else -1
		var g = null
		if wage:
			var r = Money.parse(fields.rate[1].text)
			var h: String = fields.hours[1].text.strip_edges()
			if r != null and h.is_valid_float():
				g = M.jr(float(r) * h.to_float())
		else:
			var y = Money.parse(fields.year[1].text)
			if y != null:
				g = M.jr(float(y) / 26.0)
		if g == null or age < 0:
			out.text = "Fill in the job facts and the age first."
			return
		var s := M.stub_of(g, age)
		var marks := {}
		var lines := []
		for L in P.LINES:
			var v = Money.parse(fields[L.k][1].text)
			var ok: bool = v != null and (Money.close(v, s[L.k]) or (L.k == "tax" and int(g) % 10000 == 5000 and Money.close(v, M.tax_at_row(M.row_of(g) - 100))))
			if L.k == "net" and not ok and v != null:
				var own := 0
				var parts_ok := true
				for k in ["gross", "ei", "cpp", "tax"]:
					var x = Money.parse(fields[k][1].text)
					if x == null:
						parts_ok = false
					else:
						own += int(x) * (1 if k == "gross" else -1)
				if parts_ok and Money.close(v, own):
					marks.net = "follows"
					lines.append("→ Net pay: your subtraction is right. Fix the lines above and it will be right too.")
					continue
			marks[L.k] = "blank" if v == null else ("ok" if ok else "no")
			lines.append(("— %s: blank" % L.name) if v == null else (("✓ " + L.name) if ok else ("✗ %s: not yet" % L.name)))
		out.text = "\n".join(lines)
		pd.checks.append({"t": Time.get_datetime_string_from_system().substr(0, 16).replace("T", " "), "job": ("%s/h × %s h" % [fields.rate[1].text, fields.hours[1].text]) if wage else "%s/yr" % fields.year[1].text, "age": age, "marks": marks})
		if pd.checks.size() > 10:
			pd.checks.pop_front()
		T.save()))
	body.add_child(out)
	body.add_child(T.ui.label("Commission or tips? Ask your team’s Checker or your teacher.", "Muted"))


# ── The report ──
func report(S: Dictionary) -> Array:
	var pd := _pd(S)
	var run: Dictionary = pd.get("run", {})
	if run.is_empty():
		return [{"title": "Payday", "text": "Not started yet."}]
	var out := []
	var j: Dictionary = M.JOBS.get(str(run.job), {})
	var head := [["Future you", X.SIT[pd.sit].label]]
	if not j.is_empty():
		head.append(["Job", "%s at %s (%s)" % [j.title, j.biz, j.type]])
	if pd.finished:
		head.append(["Goal", "Reached" if pd.win else "Not reached"])
	head.append(["Jar", "%s of %s" % [Money.fmt(run.jar), Money.fmt_w(M.WORKERS[run.worker].goal)]])
	head.append(["Bounced payments", str(int(run.bounces))])
	out.append({"title": "Payday", "rows": head})
	var rows := []
	for l in run.log:
		var sg = pd.signs.get(str(int(l.p)))
		var chk := "shown" if int(l.p) <= 2 else "typed"
		if sg != null:
			chk = {"caught": "mistake caught ✓", "signed": "signed a mistake (−%s)" % Money.fmt(sg.short), "ok": "checked, correct ✓"}[sg.result]
		rows.append(["Paycheque %d%s" % [int(l.p), " (bounced)" if l.bounced else ""], "%d h · gross %s · deductions %s · take-home %s · stub: %s · to jar %s · bank %s" % [
			int(l.hours), Money.fmt(l.stub.gross), Money.fmt(l.stub.total), Money.fmt(int(l.stub.net) - int(l.get("short", 0)) + int(l.tips)), chk, Money.fmt(l.jar_in), Money.fmt(l.bank)]])
	if rows.size():
		out.append({"title": "Paycheques", "rows": rows})
	var s := _story(S)
	out.append({"title": "Deduction Map and the Pay-O-Matic mystery", "rows": [["Deduction Map", "%d of 3 stamps" % pd.stamps.size()],
		["The mystery", "Solved: proved the mistakes at Town Hall, fixed Pay-O-Matic, and got the town rule named after them." if s.has("hero") else ("Proved the mistakes and fixed Pay-O-Matic." if s.has("fixed")
			else ("Proved the mistakes at Town Hall." if s.has("hall") else ("Collecting clues." if s.has("mo2") else ("Started Case notes." if s.has("mo1") else "Not started."))))]]})
	var ck := []
	for c in pd.checks:
		var m := []
		for L in P.LINES:
			m.append("%s %s" % [L.name, {"ok": "✓", "no": "✗", "follows": "→", "blank": "—"}.get(c.marks.get(L.k, "blank"), "—")])
		ck.append([str(c.t), "%s, age %d: %s" % [c.job, int(c.age), ", ".join(m)]])
	out.append({"title": "Project Checker", "rows": ck} if ck.size() else {"title": "Project Checker", "text": "Not used yet."})
	return out


func summary(S: Dictionary) -> Dictionary:
	var pd := _pd(S)
	var run: Dictionary = pd.get("run", {})
	return {"sit": pd.get("sit", ""), "job": run.get("job", ""), "p": int(run.get("p", 0)), "jar": int(run.get("jar", 0)), "bank": int(run.get("bank", 0)),
		"bounces": int(run.get("bounces", 0)), "win": pd.get("finished", false) and pd.get("win", false), "signs": pd.get("signs", {}), "hero": _story(S).has("hero")}
