# The shop sim: orders, prices, staff shifts and one business day. No nodes.
#
# cfg = {
#   rent (cents a day), open: [first hour, hour after the last],
#   traffic: walk-ins per open hour at reputation 50,
#   products: { id: { name, icon, unit, unit_one (singular, optional), pack_size, pack_cost, ref (the price customers expect), perishable, rep_each,
#                     mix: [weight per open hour], grades: { cheap: { pack_cost, rep_each, label } } } },
#   staff: { id: { name, per_hour, wage (cents an hour), shifts: { name: [from hour, to hour] } } },
#   you_per_hour, elasticity, rep_per_line, rep_per_soldout, rep_scale
# }
# S.shop = { rep, stock: {id: n}, price: {id: cents}, grade: {id: "good" | "cheap"}, shifts: {staff id: [shift names]}, bought }
#
# The model in one line: walk-ins = traffic × (0.6 + reputation/125) × the day's event × noise (±10%).
# Each wants one product (by the hour's mix) and walks out if the price is above what they expect
# (buy chance = (ref/price)^elasticity, at most 1), if it is sold out, or if the line is full (each person on shift
# serves per_hour). Profit = sales − stock bought today − wages − rent. Perishables left at closing are thrown out.
extends RefCounted


static func init(cfg: Dictionary, rep := 50) -> Dictionary:
	var s := {"rep": rep, "stock": {}, "price": {}, "grade": {}, "shifts": {}, "bought": 0}
	for k in cfg.products:
		s.stock[k] = 0
		s.price[k] = cfg.products[k].ref
		s.grade[k] = "good"
	for k in cfg.staff:
		s.shifts[k] = []
	return s


static func valid(s) -> bool:
	return s is Dictionary and s.has("rep") and s.has("stock") and s.has("price") and s.has("grade") and s.has("shifts") and s.has("bought")


## The product with its grade applied (cheap beans cost less and please fewer people).
static func product(cfg: Dictionary, S: Dictionary, id: String) -> Dictionary:
	var p: Dictionary = cfg.products[id].duplicate()
	var g: String = S.shop.grade.get(id, "good")
	if g != "good" and p.has("grades") and p.grades.has(g):
		for k in p.grades[g]:
			p[k] = p.grades[g][k]
	p.id = id
	return p


static func order_cost(cfg: Dictionary, S: Dictionary, packs: Dictionary) -> int:
	var t := 0
	for k in packs:
		t += int(packs[k]) * int(product(cfg, S, k).pack_cost)
	return t


## Buy packs now: cash goes down, stock goes up. { ok, cost }
static func order(cfg: Dictionary, S: Dictionary, packs: Dictionary) -> Dictionary:
	var cost := order_cost(cfg, S, packs)
	if cost > int(S.cash):
		return {"ok": false, "cost": cost}
	for k in packs:
		if int(packs[k]) > 0:
			S.shop.stock[k] = int(S.shop.stock[k]) + int(packs[k]) * int(product(cfg, S, k).pack_size)
	S.cash = int(S.cash) - cost
	S.shop.bought = int(S.shop.bought) + cost
	return {"ok": true, "cost": cost}


static func on_shift(cfg: Dictionary, S: Dictionary, hour: int) -> Array:
	var on := ["you"]
	for k in cfg.staff:
		for name in S.shop.shifts.get(k, []):
			var sh = cfg.staff[k].shifts.get(name)
			if sh != null and hour >= int(sh[0]) and hour < int(sh[1]):
				on.append(k)
				break
	return on


static func wages(cfg: Dictionary, S: Dictionary) -> int:
	var t := 0
	for k in cfg.staff:
		for name in S.shop.shifts.get(k, []):
			var sh = cfg.staff[k].shifts.get(name)
			if sh != null:
				t += (int(sh[1]) - int(sh[0])) * int(cfg.staff[k].wage)
	return t


## One business day. Does not change S (apply does). ev = { traffic, label, mix: {id: factor} }
static func simulate(cfg: Dictionary, S: Dictionary, ev := {}) -> Dictionary:
	var rng := RandomNumberGenerator.new()
	rng.seed = ("%d:day:%d:%s" % [int(S.seed), int(S.day), str(ev.get("salt", ""))]).hash()
	var stock: Dictionary = S.shop.stock.duplicate()
	var rep_f := 0.6 + float(S.shop.rep) / 125.0
	var mult := float(ev.get("traffic", 1.0))
	var e := float(cfg.get("elasticity", 2.0))
	var hours := []
	var sales := 0
	var served := 0
	var walkins := 0
	var lost := {"price": 0, "soldout": 0, "line": 0}
	var by := {}
	var rep_raw := 0.0
	for k in cfg.products:
		by[k] = {"sold": 0, "sales": 0, "wanted": 0, "price": 0, "soldout": 0, "line": 0}
	var open: Array = cfg.open
	for h in range(int(open[0]), int(open[1])):
		var idx := h - int(open[0])
		var on := on_shift(cfg, S, h)
		var cap := 0
		for who in on:
			cap += int(cfg.you_per_hour) if who == "you" else int(cfg.staff[who].per_hour)
		var n := roundi(float(cfg.traffic[idx]) * rep_f * mult * (0.9 + 0.2 * rng.randf()))
		var row := {"hour": h, "staff": on, "people": []}
		var weights := []
		var wsum := 0.0
		var evmix: Dictionary = ev.get("mix", {})
		for k in cfg.products:
			var w := float(cfg.products[k].mix[idx]) * float(evmix.get(k, 1.0))
			weights.append([k, w])
			wsum += w
		for i in n:
			var r := rng.randf() * wsum
			var pid: String = weights[0][0]
			for pair in weights:
				r -= pair[1]
				if r <= 0.0:
					pid = pair[0]
					break
			var p := product(cfg, S, pid)
			var price := int(S.shop.price[pid])
			var buy := minf(1.0, pow(float(p.ref) / float(price), e))
			var out := "served"
			by[pid].wanted += 1
			if rng.randf() >= buy:
				out = "price"
			elif int(stock[pid]) <= 0:
				out = "soldout"
			elif cap <= 0:
				out = "line"
			if out == "served":
				stock[pid] = int(stock[pid]) - 1
				cap -= 1
				sales += price
				served += 1
				by[pid].sold += 1
				by[pid].sales += price
				rep_raw += float(p.get("rep_each", 0.25))
			else:
				lost[out] += 1
				by[pid][out] += 1
				if out == "line":
					rep_raw -= float(cfg.get("rep_per_line", 1.0))
				elif out == "soldout":
					rep_raw -= float(cfg.get("rep_per_soldout", 0.5))
			row.people.append({"p": pid, "out": out})
		walkins += n
		hours.append(row)
	var waste := {}
	var waste_cost := 0
	for k in cfg.products:
		var pp := product(cfg, S, k)
		if pp.get("perishable", false) and int(stock[k]) > 0:
			waste[k] = int(stock[k])
			waste_cost += roundi(float(stock[k]) * float(pp.pack_cost) / float(pp.pack_size))
	var w := wages(cfg, S)
	var rent := int(cfg.rent)
	var bought := int(S.shop.bought)
	var rep_delta := roundi(rep_raw / float(cfg.get("rep_scale", 4.0)))
	return {
		"day": int(S.day), "label": str(ev.get("label", "")), "hours": hours,
		"sales": sales, "served": served, "walkins": walkins, "lost": lost, "by": by,
		"bought": bought, "wages": w, "rent": rent, "profit": sales - bought - w - rent,
		"waste": waste, "waste_cost": waste_cost, "stock_after": stock,
		"rep_before": int(S.shop.rep), "rep_after": clampi(int(S.shop.rep) + rep_delta, 0, 100),
	}


## The day happened: cash, stock (perishables thrown out), reputation, and the ledger in S.days.
static func apply(S: Dictionary, res: Dictionary) -> void:
	S.cash = int(S.cash) + int(res.sales) - int(res.wages) - int(res.rent)
	for k in res.stock_after:
		S.shop.stock[k] = 0 if res.waste.has(k) else int(res.stock_after[k])
	S.shop.rep = int(res.rep_after)
	S.shop.bought = 0
	var keep: Dictionary = res.duplicate(true)
	keep.erase("hours")
	keep.erase("stock_after")
	S.days.append(keep)


static func total_profit(S: Dictionary) -> int:
	var t := 0
	for d in S.days:
		t += int(d.profit)
	return t
