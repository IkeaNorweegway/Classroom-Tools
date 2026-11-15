# The Measure of the Realm, Chapter 1: Brindle Ford and Highstead (two areas of 60 × 46 tiles) and four 9 × 7 rooms.
# Built from the design's sketches (math9-realm-ch1-design-v1.md §9): one sketch cell = 2 × 2 tiles = one Emberdale pack
# terrain tile. The maps change with the story (the bridge falls, sigils freeze the pond and open the yard gate, the rune is
# fixed), so the game builds them from S through maps_for(S). No nodes.
#
# Changes from the sketch, so every model has room to work:
#   - the mill sits one cell higher (rows 7–8), so its door has a doorstep; its wheel turns in a mill race (row 9, cols 16–17);
#   - a plank footbridge (two spans) crosses the tail of the race at tiles x 32–35, y 19–20, from the mill door to the wheel ring;
#   - one stone gate arch, on the Highstead side of the Low Road (its sign faces you as you come up from Brindle Ford);
#   - the waterfalls stand on the gorge wall (Brindle Ford col 24; the north end of the gorge in Highstead, col 25);
#   - sigil spots sit on ground you can stand on: the pond spot on its south bank (5, 12), the wheel spot east of the race (18, 9);
#   - each area is 23 cells (46 tiles) tall, as the sketch is;
#   - Orrin's tower (not in the sketch) stands on the north bank at tiles 42–45 × 14–17, with a footpath west from its door.
#
# Chapter 2 (design math9-realm-ch2-design-v1.md §8–9; only when the flag "ch2" is on, so Chapter 1's maps are unchanged):
#   - Brindle Ford: grey blight patches on the north field and the pasture (green moss after cure_done); the tally board outside
#     the common barn (34–35, 36); Hesper's seed bed, a 6 × 6 square of pots on 3 × 3 tiles (17–19, 34–36); nests on the well
#     roof until nests_done; a clipped hedge between the fold and the Low Road (x 16, y 0–11) with the Growth gap at (16, 7–8),
#     open once growth_hedge; the pond ledge, a big rock on the north bank of the pond (6–7, 16–17) with the cat on it until the
#     cat comes down; after boulder_done, Bram's farm cart (40–41, 36) and the horse (42, 36) outside the barn.
#   - Growth spots (green-gold stars, after sigil2): the pond ledge (8, 16), the hedge gap (14, 7), Orrin's window (40, 15) by the
#     tower's west wall, the vault vine (46, 8) in the tower yard. Each spot's vine shows grown once its flag is on.
#   - Highstead: the seed vault door (5 × 1) at the foot of the middle grain tower (41–45, 8); there is no bank in the yard, so it
#     stands against the tower (one tile east of centre, so the strip under the hay stack, 40–41 × 6–7, is not sealed off). The yard cart and a sack pile move east to clear the door and the vault vine. The boulder (2 × 2)
#     sits on the road just south of the Highstead ford (18–19, 32–33), the only way from the Low Road into Highstead, so there is
#     no way round; Bram's cart, the horse, Bram and Orrin stand beside it. After boulder_done a small rock sits on the verge.
#   - The mill room: smoke pots along the back wall after moths_done.
# A model missing from the pack falls back to an existing one (_m).
extends RefCounted

const P := "realm/emberdale:"
const A := "realm/voxpeople:"   # rigged animals with looping clips

# Cell kinds: . grass  : stubble  = road  - footpath  ~ water  p pond (freezes)  f ford  W/E gorge wall (west/east)  G gorge floor
#             v waterfall on the west wall  N north wall  a/b north-west/north-east corner  V waterfall at the north end
#             , far bank  q market square
const BF := [
	".........=..............WGE,=,",
	".........=..............WGE,=,",
	".........=.::::::::::...WGE,=,",
	".........=.::::::::::...WGE,=,",
	".........=.::::::::::...WGE,=,",
	".........=.::::::::::...WGE,=,",
	"....-....=..............WGE,=,",
	"....-----=..............WGE,=,",
	".........=..............WGE,=,",
	"...ppppp.=......~~.---..WGE,=,",
	"~~~ppppp~f~~~~~~~~~~~~~~vGE,=,",
	"...ppppp.=..............WGE,=,",
	".........=..............WGE,=,",
	"....====================WGE,=,",
	"......-.................WGE,,,",
	"......-.................WGE,,,",
	"......-.................WGE,,,",
	"......-.................WGE,,,",
	".....--.................WGE,,,",
	"........................WGE,,,",
	"........................WGE,,,",
	"........................WGE,,,",
	"........................WGE,,,",
]

const HS := [
	"..............................",
	"..............................",
	"..............................",
	"..............................",
	"..............................",
	"..............................",
	".........=....................",
	".........=..qqqqqqqq..........",
	".........=..qqqqqqqq..........",
	".........=..qqqqqqqq..........",
	".........=..qqqqqqqq..........",
	".........===qqqqqqqq=========.",
	".........=..qqqqqqqq........=.",
	".........=..qqqqqqqq........=.",
	".........=..qqqqqqqq........=.",
	"~~~~~~~~~f~~~~~~~~~~~~~~~~..=.",
	".........=..............aVb,=,",
	".........=..............WGE,=,",
	".........=..............WGE,=,",
	".........=..............WGE,=,",
	".........=..............WGE,=,",
	".........=..............WGE,=,",
	".........=..............WGE,=,",
]

const KIND := {".": "r_grass", ":": "r_stubble", "=": "r_path", "-": "r_path", "~": "r_water", "p": "r_water", "f": "r_ford",
	"W": "r_gorge", "E": "r_gorge", "G": "r_floor", "v": "r_gorge", "N": "r_gorge", "a": "r_gorge", "b": "r_gorge", "V": "r_gorge",
	",": "r_far", "q": "r_square"}

const DECO := {".": "t_grass", ":": "t_stubble", "=": "t_path", "~": "t_water", "p": "t_water", "f": "t_ford", "G": "t_gorge_floor",
	",": "t_far_bank", "q": "t_square"}
const TURN := {"W": ["t_gorge_edge", 90], "E": ["t_gorge_edge", -90], "N": ["t_gorge_edge", 0], "v": ["t_waterfall", 90],
	"V": ["t_waterfall", 0], "a": ["t_gorge_corner_out", 0], "b": ["t_gorge_corner_out", -90]}
# Footpaths: ten winding variants (all join edge to edge) chosen by cell hash, so a path never repeats a tile;
# corners are rounded turns. The corner model joins its south and east edges, so yaw turns it to the other three.
const FOOTPATHS := ["t_footpath", "t_footpath_2", "t_footpath_3", "t_footpath_4", "t_footpath_5",
	"t_footpath_6", "t_footpath_7", "t_footpath_8", "t_footpath_9", "t_footpath_10"]
const FOOT_CORNERS := ["t_footpath_corner", "t_footpath_corner_b"]
# Weathered cobblestone paving for the market squares; the variants share a stone layout, so any mix tiles.
const SQUARES := ["t_cobble", "t_cobble_b", "t_cobble_c"]


static func _h(a: int, b: int) -> float:
	return float(("%d:%d" % [a, b]).hash() & 0xffff) / 65535.0


## A deterministic hash well mixed across neighbouring cells (String.hash keeps neighbours too alike, so the
## footpath variant pick would repeat down a whole run).
static func _hash2(a: int, b: int) -> int:
	var h: int = (a * 374761393 + b * 668265263) & 0x7fffffff
	h = ((h ^ (h >> 13)) * 1274126177) & 0x7fffffff
	return (h ^ (h >> 16)) & 0x7fffffff


## Ground (a kind per tile) and the pack terrain draws, from a sketch. frozen: pond cells become ice.
static func _terrain(sk: Array, frozen: bool) -> Dictionary:
	var W: int = sk[0].length() * 2
	var H: int = sk.size() * 2
	var ground := []
	ground.resize(W * H)
	var draws := []
	for cy in sk.size():
		var row: String = sk[cy]
		for cx in row.length():
			var ch := row[cx]
			var k: String = KIND.get(ch, "r_grass")
			if ch == "p" and frozen:
				k = "r_ice"
			for dy in 2:
				for dx in 2:
					ground[(cy * 2 + dy) * W + cx * 2 + dx] = k
			var name := ""
			var yaw := 0.0
			if TURN.has(ch):
				name = TURN[ch][0]
				yaw = TURN[ch][1]
			elif ch == "-":
				var n: bool = cy > 0 and sk[cy - 1][cx] in ["-", "="]
				var s: bool = cy < sk.size() - 1 and sk[cy + 1][cx] in ["-", "="]
				var w: bool = cx > 0 and row[cx - 1] in ["-", "="]
				var e: bool = cx < row.length() - 1 and row[cx + 1] in ["-", "="]
				var vert: bool = n or s
				var horz: bool = w or e
				if vert and horz and not (n and s) and not (e and w):   # a turn, not a crossing
					name = FOOT_CORNERS[_hash2(cx, cy) % FOOT_CORNERS.size()]
					if s and e: yaw = 0.0
					elif e and n: yaw = 90.0
					elif n and w: yaw = 180.0
					else: yaw = -90.0
				else:
					name = FOOTPATHS[_hash2(cx, cy) % FOOTPATHS.size()]
					yaw = 90.0 if horz else 0.0
			elif ch == "=":
				name = "t_path"
			elif ch == "q":
				name = SQUARES[_hash2(cx, cy) % SQUARES.size()]
			else:
				name = DECO.get(ch, "t_grass")
				if ch == "." and _h(cx, cy) < 0.18:
					name = "t_grass_b"
			draws.append({"kind": "pack", "pack": P + name, "x": cx * 2, "y": cy * 2, "w": 2, "h": 2, "yaw": yaw})
	return {"w": W, "h": H, "ground": ground, "draws": draws}


## A pack model's name, or the fallback when the pack hasn't got it (Chapter 2's props were added to the pack late).
const FALLBACK := {"boulder_big": "boulder", "boulder_small": "rock_b", "cart_farm": "cart", "tally_board": "signpost", "vine": "bush",
	"smoke_pot": "barrel", "moth_nest": "sack", "seed_pot": "herb_bed", "seed_pot_empty": "herb_bed", "blight_patch": "rock_a",
	"moss_patch": "bush", "growth_marker": "sigil_spot", "vault_door": "rune_stone"}
static var _have := {}
static func _m(name: String) -> String:
	if not _have.has(name):
		_have[name] = ResourceLoader.exists("res://assets/realm/emberdale/%s.glb" % name)
	return name if _have[name] or not FALLBACK.has(name) else FALLBACK[name]


static func _prop(name: String, x: int, y: int, w := 1, h := 1, extra := {}) -> Dictionary:
	var d := {"k": "pack", "pack": P + _m(name), "x": x, "y": y, "w": w, "h": h, "solid": true}
	d.merge(extra, true)
	return d


## An animal from the people pack, playing a clip (it stands on its tile; you walk round it).
static func _beast(name: String, x: int, y: int, anim: String, yaw: float) -> Dictionary:
	return {"k": "pack", "pack": A + name, "x": x, "y": y, "w": 1, "h": 1, "solid": true, "anim": anim, "yaw": yaw}


static func _tree(name: String, x: int, y: int) -> Dictionary:
	return _prop(name, x, y, 2, 2, {"sway": name != "tree_spruce"})


## A sigil spot: a gold ring on the ground (walkable), the thing you use.
static func _spot(id: String, label: String, x: int, y: int, lit: bool) -> Dictionary:
	var d := {"k": "pack", "pack": P + "sigil_spot", "x": x, "y": y, "w": 2, "h": 2, "solid": false, "id": id, "label": label}
	if lit:
		d.pulse = "sigil_spot_glow"
	else:
		d.tint = {"sigil_spot_glow": "#8a8578"}
	return d


## A Growth spot: a green-gold star on the ground (walkable). lit: pulsing; otherwise dimmed (solved, or out of reach).
static func _gspot(id: String, label: String, x: int, y: int, lit: bool) -> Dictionary:
	var d := {"k": "pack", "pack": P + _m("growth_marker"), "x": x, "y": y, "w": 2, "h": 2, "solid": false, "id": id, "label": label}
	var glow := "growth_marker_glow" if _m("growth_marker") == "growth_marker" else "sigil_spot_glow"
	if lit:
		d.pulse = glow
	else:
		d.tint = {glow: "#6f7a5a"}
	return d


## A Growth vine at a spot: its "Vine" part scaled in height (0.05 just the root mound … 1 full, 4.13 tiles).
static func _vine(x: int, y: int, h: float, extra := {}) -> Dictionary:
	var d := _prop("vine", x, y, 1, 1, {"solid": false, "parts": {"Vine": {"scale": [1.0, clampf(h, 0.05, 1.0), 1.0]}}})
	d.merge(extra, true)
	return d


static func build(f: Dictionary) -> Dictionary:
	var sig := bool(f.get("sigil", false))
	return {
		"brindle": _brindle(f, sig),
		"highstead": _highstead(f, sig),
		"cottage": _cottage(),
		"mill": _mill_room(f),
		"barn": _barn(),
		"abel_house": _abel_house(),
	}


static func _brindle(f: Dictionary, sig: bool) -> Dictionary:
	var t := _terrain(BF, bool(f.get("sigil_pond", false)))
	var draws: Array = t.draws
	var fallen := bool(f.get("bridge_fell", false))
	var home := bool(f.get("met_orrin", false))
	if not fallen:   # the old rope bridge across the gorge, before harvest night
		draws.append({"kind": "bridge", "x": 48, "y": 26, "w": 6, "h": 2})
	if f.get("sigil_pond", false):
		draws.append({"kind": "ice", "x": 6, "y": 18, "w": 10, "h": 6})
	# The footbridge over the tail of the mill race, just below the wheel (T-025): two 2 × 2 plank spans end to end over
	# x 32–35, drawn a quarter tile north of rows 19–20 so the deck clears the wheel and lands on both banks. Its tiles
	# (x 32–35, y 19–20) are walkable, so the wheel ring (36, 18) is 7–8 steps from the mill door; the water draws stay under it.
	for by in [19, 20]:
		for bx in range(32, 36):
			t.ground[by * t.w + bx] = KIND["-"]
	for bx in [32, 34]:
		draws.append({"kind": "pack", "pack": P + "footbridge", "x": bx, "y": 18.75, "w": 2, "h": 2, "yaw": 90.0})
	var b := [
		{"id": "cottage", "pack": P + "cottage_hesper", "x": 4, "y": 36, "w": 6, "h": 4, "door": 6, "to": "cottage", "sign": "Hesper's cottage"},
		{"id": "mill", "pack": P + "mill", "x": 30, "y": 14, "w": 6, "h": 4, "door": 31, "to": "mill", "sign": "The mill",
			"spin": "Wheel", "spin_speed": 0.9 if f.get("sigil_wheel", false) else 0.0},
		{"id": "barn", "pack": P + "barn", "x": 36, "y": 30, "w": 6, "h": 4, "door": 38, "to": "barn", "sign": "The common barn"},
		{"id": "abel_house", "pack": P + "house_small", "x": 40, "y": 22, "w": 4, "h": 4, "door": 41, "to": "abel_house", "sign": "Abel's house"},
		{"id": "house1", "pack": P + "house_a", "x": 22, "y": 22, "w": 4, "h": 4, "door": 23},
		{"id": "house2", "pack": P + "house_b", "x": 28, "y": 22, "w": 4, "h": 4, "door": 29},
		{"id": "house3", "pack": P + "house_b", "x": 22, "y": 30, "w": 4, "h": 4, "door": 23},
		{"id": "house4", "pack": P + "house_a", "x": 28, "y": 30, "w": 4, "h": 4, "door": 29},
		{"id": "well", "pack": P + "well", "x": 26, "y": 28, "w": 2, "h": 2, "door": 26},
		{"id": "fold", "pack": P + "fold", "x": 4, "y": 6, "w": 10, "h": 6, "door": 8},
		# Orrin's tower on the north bank above the gorge: dark and empty until he comes home on harvest night
		{"id": "orrin_tower", "pack": P + "wizard_tower", "x": 42, "y": 14, "w": 4, "h": 4, "door": 43, "sign": "Orrin's tower",
			"tint": {} if home else {"Windows_glow": "#3e4654", "Crystal_glow": "#7d8a94", "Lantern_glow": "#4a4440"}},
	]
	if home:   # the crystal on the roof breathes once Orrin is back
		b[-1].pulse = "Crystal_glow"
	if fallen:
		b.append({"id": "bridge_w", "pack": P + "bridge_broken", "x": 48, "y": 26, "w": 2, "h": 2, "yaw": 90, "ox": 0.6})
		b.append({"id": "bridge_e", "pack": P + "bridge_broken", "x": 52, "y": 26, "w": 2, "h": 2, "yaw": -90, "ox": -0.6})
	var props := [
		# the village
		_prop("signpost", 16, 25), _prop("lantern_post", 21, 25), _prop("lantern_post", 33, 25), _prop("lantern_post", 45, 25),
		_prop("barrel", 26, 25), _prop("sack_pile", 26, 26), _prop("trough", 34, 34, 2, 1),
		_prop("bench", 32, 28, 2, 1), _prop("crate", 44, 28), _prop("cart", 42, 34, 2, 1),
		_prop("hay_bale", 42, 30), _prop("hay_bale", 43, 31), _prop("fence_rail", 44, 33, 2, 1), _prop("fence_rail", 46, 33, 2, 1, {"ox": 0.0}),
		# the mill and its yard
		_prop("sack_pile", 28, 16), _prop("sack", 28, 17), _prop("barrel", 36, 15), _prop("cart_grain", 36, 16, 2, 1),
		# Hesper's rise
		_prop("herb_bed", 3, 41, 2, 1), _prop("woodpile", 8, 41, 2, 1), _prop("hen_coop", 12, 42, 2, 1, {"id": "hen_coop", "label": "Hesper's hen-house"}),
		_beast("hen", 14, 41, "peck", 200.0), _beast("hen", 11, 43, "idle", 40.0), _prop("root_cellar", 10, 38, 2, 2, {"id": "cellar", "label": "Hesper's root cellar"}),
		_prop("lantern_post", 7, 34), _prop("bush", 3, 34), _prop("bush", 15, 36),
		# the fold and the fields
		_prop("trough", 14, 12, 2, 1), _prop("scarecrow", 30, 7), _prop("hay_stack", 44, 4, 2, 2), _prop("hay_bale", 41, 12),
		_prop("stone_wall_2", 21, 3, 2, 1), _prop("stone_wall_2", 23, 3, 2, 1), _prop("signpost", 20, 12),
		# trees and rocks
		_tree("tree_cottonwood", 3, 26), _tree("tree_cottonwood", 15, 29), _tree("tree_aspen", 4, 30), _tree("tree_aspen_au", 9, 30),
		_tree("tree_aspen", 16, 32), _tree("tree_spruce", 3, 42), _tree("tree_aspen_au", 18, 40), _tree("tree_aspen", 24, 38),
		_tree("tree_spruce", 30, 40), _tree("tree_aspen", 36, 42), _tree("tree_aspen_au", 42, 38), _tree("tree_spruce", 44, 42),
		_tree("tree_aspen", 26, 14), _tree("tree_aspen_au", 38, 12), _tree("tree_cottonwood", 46, 12), _tree("tree_spruce", 4, 3),
		_tree("tree_aspen", 14, 3), _tree("tree_aspen", 46, 8),
		_prop("boulder", 20, 36, 2, 2), _prop("rock_a", 34, 37), _prop("rock_b", 46, 38), _prop("bush", 22, 18), _prop("rock_a", 6, 15),
		_prop("rock_b", 56, 32), _prop("rock_a", 55, 38), _prop("boulder", 54, 32, 2, 2),
		# sheep: in the fold once the lambs are in, out on the grass before
	]
	var penned: bool = bool(f.get("lambs_in", false)) and not (f.get("ch2", false) and f.get("cure_done", false))   # Ch 2: back on the grass after the cure
	for s in ([[6, 8], [9, 7], [11, 9], [7, 10]] if penned else [[20, 15], [22, 13], [24, 15], [26, 13]]):
		props.append(_beast("sheep", s[0], s[1], "graze" if (s[0] + s[1]) % 2 == 0 else "idle", _h(s[0], s[1]) * 360.0))
	# a lamb with the flock, and Rowan's dog sitting by him at the fold
	var lb: Array = [8, 9] if penned else [21, 14]
	props.append(_beast("lamb", lb[0], lb[1], "idle", _h(lb[0], lb[1]) * 360.0))
	props.append(_beast("dog", 9, 14, "sit", 200.0))
	# the prologue crowd's spot, the sigil spots
	props.append({"k": "none", "x": 47, "y": 27, "solid": false, "id": "bridge", "label": "The gorge bridge"})
	props.append({"k": "none", "x": 43, "y": 18, "solid": false, "id": "tower_door", "label": "Orrin's tower"})
	if f.get("ch2", false):
		_brindle_ch2(f, props, draws)
	if sig:
		props.append(_spot("spot_pond", "The mill pond", 10, 24, not f.get("sigil_pond", false)))
		props.append(_spot("spot_wheel", "The mill wheel", 36, 18, not f.get("sigil_wheel", false)))
		props.append(_spot("spot_cellar", "Hesper's root cellar", 12, 38, not f.get("sigil_cellar", false)))
	return {
		"name": "Brindle Ford", "w": t.w, "h": t.h, "base": "r_grass", "ground": t.ground, "draws": draws,
		"buildings": b, "props": props,
		"districts": [
			{"name": "Orrin's tower", "x": 38, "y": 12, "w": 10, "h": 8},
			{"name": "The fold", "x": 0, "y": 0, "w": 20, "h": 16}, {"name": "The mill", "x": 24, "y": 10, "w": 22, "h": 11},
			{"name": "Hesper's rise", "x": 0, "y": 32, "w": 18, "h": 14}, {"name": "The gorge", "x": 46, "y": 0, "w": 14, "h": 46},
			{"name": "Brindle Ford", "x": 16, "y": 21, "w": 30, "h": 25}, {"name": "The Low Road", "x": 16, "y": 0, "w": 8, "h": 10},
		],
		"links": [
			{"x": 18, "y": 0, "w": 2, "to": "highstead", "at": [18, 44], "dir": "up"},
			{"x": 56, "y": 0, "w": 2, "to": "highstead", "at": [56, 44], "dir": "up"},
		],
	}


## Chapter 2's things in Brindle Ford (see the header).
static func _brindle_ch2(f: Dictionary, props: Array, draws: Array) -> void:
	var cured := bool(f.get("cure_done", false))
	for pt in [[24, 5], [28, 7], [33, 5], [37, 9], [30, 10], [26, 9], [39, 6], [17, 13], [20, 17], [23, 16], [26, 17], [15, 15]]:
		props.append(_prop("moss_patch" if cured else "blight_patch", pt[0], pt[1], 1, 1, {"solid": false, "yaw": _h(pt[0], pt[1]) * 360.0}))
	props.append(_prop("tally_board", 34, 36, 2, 1))
	# Hesper's seed bed: 36 pots at a half-tile pitch on 3 × 3 tiles, empty until the vault seed is planted
	var pot := "seed_pot" if f.get("sigil2", false) else "seed_pot_empty"
	for j in 6:
		for i in 6:
			draws.append({"kind": "pack", "pack": P + _m(pot), "x": 17.0 + i * 0.5, "y": 34.0 + j * 0.5, "w": 0.5, "h": 0.5})
	props.append({"k": "none", "x": 17, "y": 34, "w": 3, "h": 3, "solid": true})
	if not f.get("nests_done", false):
		props.append(_prop("moth_nest", 26, 28, 1, 1, {"solid": false, "oy": 2.15, "ox": 0.35, "oz": 0.4}))
		props.append(_prop("moth_nest", 27, 29, 1, 1, {"solid": false, "oy": 2.1, "ox": -0.3, "oz": -0.35, "yaw": 70.0}))
	# the hedge between the fold and the Low Road; the Growth gap at (16, 7–8)
	for y in 12:
		if not (f.get("growth_hedge", false) and (y == 7 or y == 8)):
			props.append(_prop("bush_hedge", 16, y))
	# the pond ledge: a big rock on the pond's north bank, the cat on top until it comes down the first vine
	props.append(_prop("boulder_big", 6, 16, 2, 2))
	if not f.get("cat", false):
		props.append({"k": "pack", "pack": A + "cat", "x": 6, "y": 16, "w": 1, "h": 1, "solid": false, "anim": "sit", "yaw": 160.0, "oy": 1.2, "ox": 0.5, "oz": 0.4})
	if f.get("growth_ledge", false):
		props.append(_vine(8, 16, 0.4, {"ox": -0.45}))
	if f.get("growth_window", false):
		props.append(_vine(41, 15, 1.0, {"ox": 0.45}))
	if f.get("boulder_done", false):   # Bram stands by his cart outside the common barn
		props.append(_prop("cart_farm", 40, 36, 2, 1))
		props.append(_beast("horse", 42, 36, "idle", 90.0))
	if f.get("sigil2", false):
		props.append(_gspot("growth_ledge", "The pond ledge", 8, 16, not f.get("growth_ledge", false)))
		props.append(_gspot("growth_hedge", "The hedge gap", 14, 7, not f.get("growth_hedge", false)))
		props.append(_gspot("growth_window", "Orrin's window", 40, 15, not f.get("growth_window", false) and f.get("_pips_full", false)))


static func _highstead(f: Dictionary, sig: bool) -> Dictionary:
	var t := _terrain(HS, false)
	var broken := bool(f.get("rune_broken", false))
	var b := [
		{"id": "rune_stone", "pack": P + "rune_stone", "x": 30, "y": 20, "w": 2, "h": 2, "door": 30,
			"tint": {"Rune_glow": "#f2c84b" if broken else "#8b8e96"}},
		{"id": "tower1", "pack": P + "grain_tower", "x": 36, "y": 4, "w": 4, "h": 4},
		{"id": "tower2", "pack": P + "grain_tower", "x": 42, "y": 4, "w": 4, "h": 4},
		{"id": "tower3", "pack": P + "grain_tower", "x": 48, "y": 4, "w": 4, "h": 4},
		{"id": "hs_house1", "pack": P + "house_a", "x": 24, "y": 4, "w": 4, "h": 4, "door": 25},
		{"id": "hs_house2", "pack": P + "house_b", "x": 6, "y": 14, "w": 4, "h": 4, "door": 7},
		{"id": "hs_house3", "pack": P + "house_small", "x": 6, "y": 22, "w": 4, "h": 4, "door": 7},
		{"id": "hs_house4", "pack": P + "house_b", "x": 12, "y": 4, "w": 4, "h": 4, "door": 13},
	]
	var props := [
		_prop("market_stall", 25, 15, 2, 2), _prop("market_stall", 37, 15, 2, 2), _prop("market_stall", 25, 26, 2, 2), _prop("market_stall", 37, 26, 2, 2),
		_prop("sack_pile", 29, 16), _prop("barrel", 34, 16), _prop("crate", 35, 16), _prop("cart", 28, 27, 2, 1),
		_prop("lantern_post", 23, 21), _prop("lantern_post", 40, 21), _prop("bench", 34, 24, 2, 1),
		_prop("signpost", 17, 24), _prop("signpost", 41, 24),
		# the Low Road and the gate arch (the arch's legs block; the road through it is open)
		{"k": "pack", "pack": P + "gate_arch", "x": 17, "y": 38, "w": 4, "h": 2, "solid": false, "node": true, "sign3d": ["Highstead", [0.0, 3.17, 0.4]]},
		{"k": "none", "x": 17, "y": 38, "h": 2, "solid": true}, {"k": "none", "x": 20, "y": 38, "h": 2, "solid": true},
		_prop("stone_wall_2", 13, 39, 2, 1), _prop("stone_wall_2", 22, 39, 2, 1),
		# the grain-tower yard: fenced, its gate frozen shut until the Balance sigil thaws it
		_prop("hay_stack", 40, 4, 2, 2),
		_tree("tree_aspen", 4, 4), _tree("tree_aspen_au", 18, 8), _tree("tree_cottonwood", 4, 34), _tree("tree_spruce", 26, 36),
		_tree("tree_aspen", 34, 36), _tree("tree_aspen_au", 40, 40), _tree("tree_spruce", 6, 40), _tree("tree_aspen", 44, 16),
		_tree("tree_aspen_au", 52, 16), _tree("tree_cottonwood", 14, 26), _tree("tree_spruce", 54, 4),
		_prop("boulder", 30, 40, 2, 2), _prop("rock_b", 54, 36), _prop("rock_a", 55, 40), _prop("bush", 22, 32), _prop("bush", 12, 34),
	]
	for x in range(34, 54, 2):   # north and south fences (the gate is at x 38–39 on the south side)
		props.append(_prop("fence_rail", x, 3, 2, 1))
		if x != 38:
			props.append(_prop("fence_rail", x, 10, 2, 1))
	for y in range(4, 10, 2):
		props.append(_prop("fence_rail", 34, y, 1, 2, {"yaw": 90}))
		props.append(_prop("fence_rail", 53, y, 1, 2, {"yaw": 90}))
	var ch2 := bool(f.get("ch2", false))
	if ch2:   # the yard cart and a sack pile move east, clear of the vault door and the vault vine
		props.append_array([_prop("sack_pile", 52, 9), _prop("cart", 49, 9, 2, 1)])
		var open := bool(f.get("rune2_broken", false))
		props.append(_prop("vault_door", 41, 8, 5, 1, {"parts": {"Door": {"turn": [0.0, -100.0, 0.0]} if open else {}, "Pan": {"turn": [0.0, 0.0, 6.0]} if open else {}}}))
		props.append(_vine(46, 7, 1.0 if f.get("growth_vault", false) else 0.05))
		if f.get("sigil2", false):
			props.append(_gspot("growth_vault", "The vault vine", 46, 8, not f.get("growth_vault", false)))
		if f.get("boulder_here", false) and not f.get("boulder_done", false):
			props.append(_prop("boulder_big", 18, 32, 2, 2))
			props.append(_prop("cart_farm", 18, 35, 1, 2, {"yaw": 90.0}))
			props.append(_beast("horse", 18, 34, "idle", 180.0))
		elif f.get("boulder_done", false):
			props.append(_prop("boulder_small", 16, 32))
	else:
		props.append_array([_prop("sack_pile", 47, 9), _prop("cart", 44, 9, 2, 1)])
	if not f.get("sigil_gate", false):
		props.append(_prop("fence_gate", 38, 10, 2, 1, {"id": "yard_gate", "label": "The tower-yard gate (frozen shut)"}))
	props.append({"k": "none", "x": 29, "y": 22, "solid": false, "id": "stone_front", "label": "The grain-share stone"})
	if sig:
		props.append(_spot("spot_gate", "The tower-yard gate", 38, 12, not f.get("sigil_gate", false)))
	return {
		"name": "Highstead", "w": t.w, "h": t.h, "base": "r_grass", "ground": t.ground, "draws": t.draws,
		"buildings": b, "props": props,
		"districts": [
			{"name": "Market square", "x": 24, "y": 14, "w": 16, "h": 16}, {"name": "The grain towers", "x": 32, "y": 0, "w": 24, "h": 13},
			{"name": "The Low Road", "x": 10, "y": 30, "w": 16, "h": 16}, {"name": "The gorge", "x": 46, "y": 30, "w": 14, "h": 16},
			{"name": "Highstead", "x": 0, "y": 0, "w": 60, "h": 46},
		],
		"links": [
			{"x": 18, "y": 45, "w": 2, "to": "brindle", "at": [18, 1], "dir": "down"},
			{"x": 56, "y": 45, "w": 2, "to": "brindle", "at": [56, 1], "dir": "down"},
		],
	}


# ── Rooms (9 × 7): rows 0–1 back wall, row 6 front wall with the exit at column 4; people stand on row 3 ──
static func _cottage() -> Dictionary:
	return {"name": "Hesper's cottage", "w": 9, "h": 7, "room": {"floor": "wood", "wall": "#e9dcc4", "exit": 4, "windows": [6]},
		"props": [
			{"k": "hearth", "x": 1, "y": 2, "w": 2, "color": "#8c8173", "solid": true}, {"k": "board", "x": 6, "y": 2, "id": "frost_window", "label": "The frost window"},
			{"k": "shelf", "x": 7, "y": 2}, {"k": "table", "x": 6, "y": 4}, {"k": "rug", "x": 3, "y": 4, "w": 3, "h": 1, "color": "#7a4a5a"},
			_prop("barrel", 1, 5), _prop("sack", 7, 3), {"k": "plant", "x": 1, "y": 3},
		]}


static func _mill_room(f := {}) -> Dictionary:
	var props := [
		{"k": "millstone", "x": 1, "y": 2, "w": 2, "h": 2, "color": "#a49c8e", "solid": true}, {"k": "desk", "x": 6, "y": 2, "id": "ledger", "label": "Abel's ledger", "solid": true},
		_prop("sack_pile", 7, 2), _prop("sack", 7, 4), _prop("barrel", 1, 5), _prop("sack_pile", 7, 5),
	]
	if f.get("ch2", false) and f.get("moths_done", false):   # the smoke pots, lit along the back wall
		for x in [3, 4, 5]:
			props.append(_prop("smoke_pot", x, 2))
	return {"name": "The mill", "w": 9, "h": 7, "room": {"floor": "wood", "wall": "#ddd2bd", "exit": 4}, "props": props}


static func _barn() -> Dictionary:
	return {"name": "The common barn", "w": 9, "h": 7, "room": {"floor": "wood", "wall": "#c98a72", "exit": 4},
		"props": [
			_prop("cart_grain", 1, 2, 2, 1, {"id": "grain_cart", "label": "The grain cart"}), _prop("hay_bale", 6, 2), _prop("hay_bale", 7, 2),
			_prop("hay_bale", 7, 3), _prop("sack_pile", 1, 4), _prop("crate", 7, 5),
		]}


static func _abel_house() -> Dictionary:
	return {"name": "Abel's house", "w": 9, "h": 7, "room": {"floor": "wood", "wall": "#e9dcc4", "exit": 4},
		"props": [
			{"k": "hearth", "x": 1, "y": 2, "w": 2, "color": "#8c8173", "solid": true}, {"k": "table", "x": 5, "y": 2}, {"k": "chair", "x": 6, "y": 2, "solid": true},
			{"k": "bed", "x": 7, "y": 2}, {"k": "rug", "x": 3, "y": 4, "w": 2, "h": 1, "color": "#4a6a5a"}, {"k": "plant", "x": 1, "y": 5},
			{"k": "shelf", "x": 1, "y": 4, "id": "abel_shelf", "label": "Abel's shelf"},
		]}
