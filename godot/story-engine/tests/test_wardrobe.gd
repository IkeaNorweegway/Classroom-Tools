# Checks the student avatars and their clothes (town/people, games/cefl_town/wardrobe.gd):
#  - both models load with their clips, and every item in the shop and every Payday job outfit has its mesh;
#  - for every top, hat, shoes and job outfit, exactly the right meshes show (one top, at most one hat, one pair of
#    shoes, the extras asked for, the trimmed hair under any hat);
#  - the wallet: buying needs enough money, takes it off once, can't buy twice; old profiles get filled in;
#  - every price is 2 to 5 help jobs ($5–$12 each).
#   godot --headless --path godot/story-engine -s res://tests/test_wardrobe.gd
extends SceneTree

const Pack = preload("res://engine/world3d/pack.gd")
const W = preload("res://games/cefl_town/wardrobe.gd")
var fails := 0
var checks := 0


func check(ok: bool, what: String) -> void:
	checks += 1
	if not ok:
		fails += 1
		print("FAIL ", what)


func shown(n: Node, group: String) -> Array:
	var out := []
	for c in n.find_children(group + "_*", "MeshInstance3D", true, false):
		if (c as MeshInstance3D).visible:
			out.append(String(c.name).substr(group.length() + 1))
	return out


func _initialize() -> void:
	var stage := Node3D.new()
	get_root().add_child(stage)
	var info: Dictionary = Pack.info("town/people")
	for body in W.BODIES:
		var model: String = W.BODIES[body].model
		var name := model.get_file()
		var m: Dictionary = info.get("models", {}).get(name, {})
		check(not m.is_empty(), name + " is in pack.json")
		for a in ["idle", "walk", "talk", "cheer"]:
			check(a in m.get("anims", []), "%s has %s" % [name, a])
		var slots: Array = m.get("slots", [])
		for id in W.ITEMS:
			var g: String = {"top": "Wtop", "hat": "What", "shoes": "Wshoes", "extra": "Wextra"}[W.ITEMS[id].kind]
			check(slots.has(g + "_" + id), "%s has a mesh for %s" % [name, id])
		for o in ["apron", "vest", "cap", "hivis", "suit", "hardhat"]:
			check(slots.has("Work_" + o), "%s has the %s job outfit" % [name, o])
		# every top / hat / shoes, alone and under each job outfit
		var tops := ["tee"]; var hats := [""]; var shoes := ["basic"]
		for id in W.ITEMS:
			match W.ITEMS[id].kind:
				"top": tops.append(id)
				"hat": hats.append(id)
				"shoes": shoes.append(id)
		for outfit in ["", "apron", "vest", "cap", "hivis", "suit", "hardhat"]:
			for i in tops.size():
				var wear := {"top": tops[i], "hat": hats[i % hats.size()], "shoes": shoes[i % shoes.size()], "extra": ["backpack", "sunglasses"] if i % 2 else []}
				var look := W.look_of(body, wear)
				if outfit != "":
					look.outfit = outfit
					look.apron = "#2f6b3f"; look.vest = "#1f5f6b"; look.cap = "#2f3a5c"
				var n := Pack.person("town/people", name, look)
				stage.add_child(n)
				var tag := "%s %s/%s/%s %s" % [name, wear.top, wear.hat, wear.shoes, outfit]
				var hat_on: bool = wear.hat != "" and not outfit in ["cap", "hardhat"]
				check(shown(n, "Wtop") == ([] if outfit == "suit" else [wear.top]), tag + ": top " + str(shown(n, "Wtop")))
				check(shown(n, "What") == ([wear.hat] if hat_on else []), tag + ": hat " + str(shown(n, "What")))
				check(shown(n, "Wshoes") == [wear.shoes], tag + ": shoes")
				var ex := shown(n, "Wextra"); ex.sort()
				var want_ex: Array = wear.extra.duplicate(); want_ex.sort()
				check(ex == want_ex, tag + ": extras " + str(ex))
				check(shown(n, "Work") == ([outfit] if outfit != "" else []), tag + ": job outfit " + str(shown(n, "Work")))
				var hatted: bool = hat_on or outfit in ["cap", "hardhat"]
				check(shown(n, "Locks") == (["hat"] if hatted else ["full"]), tag + ": hair " + str(shown(n, "Locks")))
				n.free()
	# the wallet and the stall
	var P := {"v": 1, "name": "Sam", "look": {"skin": 1}}   # an old profile
	W.fill(P)
	check(P.student.body == "student_m" and P.student.wear.top == "tee" and P.wallet == 0 and P.owned == [], "an old profile is filled in")
	check(not W.buy_item(P, "cap"), "can't buy with an empty wallet")
	W.earn(P, 1400)
	check(not W.buy_item(P, "cap"), "can't buy a $15 cap with $14")
	W.earn(P, 600)
	check(W.buy_item(P, "cap") and P.wallet == 500 and "cap" in P.owned, "buying a $15 cap with $20 leaves $5")
	check(not W.buy_item(P, "cap") and P.wallet == 500, "can't buy the cap twice")
	check(not W.buy_item(P, "tee"), "the starter tee isn't for sale")
	for id in W.ITEMS:
		var c := int(W.ITEMS[id].price)
		check(c >= 2 * 500 and c <= 5 * 1200 and c % 500 == 0, "%s costs %d¢: 2–5 help jobs, whole $5s" % [id, c])
	var wear := W.DEFAULT_WEAR.duplicate(true)
	W._put_on(wear, "backpack"); W._put_on(wear, "headphones"); W._put_on(wear, "backpack")
	check(wear.extra == ["backpack", "headphones"], "extras stack, no doubles")
	W._take_off(wear, "backpack")
	check(wear.extra == ["headphones"], "an extra comes off")
	W._put_on(wear, "hoodie"); W._take_off(wear, "hoodie")
	check(wear.top == "tee", "taking off a top leaves the tee")
	print("test_wardrobe: %d checks, %d problems" % [checks, fails])
	quit(1 if fails else 0)
