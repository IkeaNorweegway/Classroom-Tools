# The five areas of CEFL Town (each AreaKit.W × AreaKit.H tiles), laid out like a plus sign:
#
#                 Campus
#     School   Downtown   Shopping
#             Neighbourhoods
#
# Main Street runs east–west through School, Downtown and Shopping; the Avenue runs north–south through
# Campus, Downtown and Neighbourhoods. Every v1 building and townsperson keeps its name, in the area its
# street suggests (the Bank on Main Street, Home on River Walk, the shops on Market Lane).
extends RefCounted

const Kit = preload("res://games/cefl_town/area_kit.gd")
const Y := Kit.MAIN_Y
const X := Kit.AVE_X


static func all() -> Dictionary:
	return {"downtown": downtown(), "campus": campus(), "schoolgrounds": school(), "shopping": shopping(), "neighbourhoods": neighbourhoods()}


# ── Downtown: Main Street × the Avenue, Town Hall, the Bank, the Hospital, Town Square ──
static func downtown() -> Dictionary:
	var a := Kit.new("downtown", "Downtown")
	a.street_ew(Y)
	a.street_ns(X)
	a.crossings()
	# north of Main Street, fronting it
	a.building("library", "Library", 1, 10, 7, 8, 3, "civic", {"brick": "red"})
	a.building("jobcentre", "Job Centre", 9, 11, 7, 7, 3, "glass", {"brick": "red", "floors": 2.5})
	a.building("bank", "Bank", 17, 9, 8, 9, 4, "civic", {"brick": "orange", "emblem": "coin"})
	a.building("servicecanada", "Service Canada", 35, 12, 6, 6, 2, "shop", {"brick": "red", "awning": "#d9534a"})
	a.building("news", "News", 42, 14, 3, 4, 1, "shop", {"brick": "orange", "awning": "#3f7f9a", "floors": 1.5})
	a.building("townhall", "Town Hall", 46, 7, 13, 11, 6, "civic", {"brick": "orange", "emblem": "clock", "floors": 3.8})
	# behind them: offices, flats, a lot
	a.building("tower", "Prairie Tower", 35, 1, 8, 9, 4, "glass", {"to": false, "floors": 7})
	a.building("flats_nw", "", 1, 1, 7, 7, 3, "shop", {"to": false, "floors": 4, "brick": "orange", "lanterns": false})
	a.building("offices_n", "Riverbend Insurance", 9, 1, 7, 8, 3, "glass", {"to": false, "floors": 4})
	a.fill("lot", 18, 1, 7, 6)
	for i in 4:
		a.prop("car", 18 + i * 2 - (i % 2), 1 + (i % 2) * 3, {"h": 2, "w": 1, "yaw": PI / 2.0, "color": ["#9fb0bf", "#c9b28d", "#b5837a", "#8e9e88"][i]})
	a.fill("walk", 0, 8, 26, 1)       # a back lane behind the north frontage
	a.fill("walk", 34, 10, 1, 8)
	a.fill("lawn", 46, 1, 13, 5)      # Town Hall's lawn and flag
	a.prop("flagpole", 52, 3)
	for x in [47, 50, 55, 57]:
		a.prop("tree", x, 1, {"v": x})
	# south of Main Street, fronting it (turned to face north)
	a.building("hospital", "Hospital", 2, 26, 12, 9, 6, "glass", {"face": "n", "brick": "red", "emblem": "cross", "floors": 4})
	a.building("clinic", "Riverbend Clinic", 16, 26, 7, 7, 3, "shop", {"face": "n", "brick": "red", "awning": "#4f8fc8"})
	a.fill("lot", 2, 37, 21, 6)
	a.fill("walk", 2, 36, 21, 1)
	for i in 7:
		if i % 3 != 1:
			a.prop("car", 3 + i * 3, 38 + (i % 2) * 3, {"h": 1, "w": 2, "yaw": 0.0, "color": ["#d6d0c4", "#a9b4c2", "#c7a06e", "#b9a7c9", "#9fb7a8", "#c4b9a0", "#9fb0bf"][i]})
	a.prop("truck", 16, 34, {"w": 4, "h": 1, "style": "lin", "company": "Riverbend Ambulance", "color": "#c0463c"})
	# Town Square
	a.fill("plaza", 34, 26, 26, 19)
	a.fill("water", 45, 31, 4, 4)
	for yy in range(31, 35):
		for xx in range(45, 49):
			a.occ[Vector2i(xx, yy)] = true
	a.draws.append({"kind": "fountain", "x": 45, "y": 31, "w": 4, "h": 4})
	for p in [[42, 29], [51, 29], [42, 36], [51, 36]]:
		a.prop("planter", p[0], p[1])
	for p in [[44, 29, PI], [49, 29, PI], [44, 36, 0.0], [49, 36, 0.0]]:
		a.prop("bench", p[0], p[1], {"yaw": p[2]})
	a.prop("stall", 36, 28, {"w": 2, "color": "#4caf7a", "id": "pats_stall", "label": "Pat's market stall"})
	a.prop("produce", 39, 28)
	a.prop("crate", 40, 28)
	a.building("cafe", "Corner Café", 50, 39, 7, 6, 3, "shop", {"to": false, "face": "n", "brick": "red", "awning": "#b25c47"})
	a.building("bakery", "Bakery", 43, 39, 6, 6, 2, "shop", {"to": false, "face": "n", "brick": "orange", "awning": "#c38f8a"})
	for p in [[51, 37], [55, 37]]:
		a.prop("patio", p[0], p[1], {"color": ["#efe3cf", "#b25c47"][p[0] % 2]})
	a.prop("string_lights", 50, 36, {"x2": 56, "y2": 36}, false)
	a.prop("planter_box", 37, 41, {"w": 4})
	for p in [[36, 31], [36, 35], [56, 30], [56, 34], [40, 33], [53, 33]]:   # a ring of trees round the fountain
		a.prop("street_tree", p[0], p[1], {"v": p[0] + p[1]})
	for p in [[38, 32], [55, 32], [46, 28], [46, 38]]:
		a.prop("lamp", p[0], p[1], {"face": 1})
	a.prop("bike_rack", 57, 27)
	for x in [35, 58]:
		a.prop("tree", x, 43, {"v": x})
	a.prop("sign", 33, 27, {"id": "sign_square", "label": "Sign", "text": "Town Square. The fountain was built in 1912. Please do not swim in it."})
	a.prop("sign", 25, 17, {"id": "sign_main", "label": "Sign", "text": "← School grounds · Library · Job Centre · Bank.   Town Hall · Shopping district →   ↑ College Campus   ↓ Neighbourhoods"})
	# the streets
	a.furnish_ew(Y)
	a.furnish_ns(X, 0, Y)
	a.furnish_ns(X, Y + 8, Kit.H)
	a.park_ew(Y, 2, 24)
	a.park_ew(Y, 36, 58)
	a.park_ns(X, 2, Y - 1)
	a.prop("bus_shelter", 6, Y + 6, {"w": 3})
	a.prop("bike_rack", 14, Y + 7)
	a.prop("bike_rack", 42, Y + 1)
	a.traffic(2)
	a.walker(a.look(0), [[2, Y], [24, Y]])
	a.walker(a.look(1), [[36, Y + 7], [58, Y + 7]], false, 0.9)
	a.walker(a.look(2), [[X, 2], [X, Y - 1]], false, 1.1)
	a.walker(a.look(3), [[37, 27], [57, 27], [57, 37], [37, 37]], true, 0.8)
	a.walker(a.look(4), [[X + 7, Y + 9], [X + 7, 43]], false, 1.0)
	a.edge("w", "schoolgrounds")
	a.edge("e", "shopping")
	a.edge("n", "campus")
	a.edge("s", "neighbourhoods")
	a.district("Town Square", 34, 26, 26, 19, 46.0, 43.0)
	a.district("Main Street", 0, Y, Kit.W, 8, 12.0, Y + 3.5)
	a.district("The Avenue", X, 0, 8, Kit.H, X + 4.0, 4.0)
	return a.build()


# ── College Campus (north): the University, the Polytechnic and the Trades Centre on College Walk ──
static func campus() -> Dictionary:
	var a := Kit.new("campus", "College Campus")
	a.street_ns(X, 18, Kit.H)
	a.street_ew(18)
	a.crossings()
	a.building("university", "University", 2, 4, 17, 14, 8, "campus", {"brick": "red", "floors": 3.6})
	a.building("polytechnic", "Polytechnic", 36, 6, 12, 12, 6, "glass", {"brick": "orange", "floors": 3.4})
	a.building("trades", "Trades Centre", 49, 8, 10, 10, 4, "industry", {"brick": "orange"})
	# the quad north of the crossing: lawn, crossing paths, benches, a statue of the founder (a planter, really)
	a.fill("lawn", 21, 2, 13, 15)
	a.fill("path", 21, 9, 13, 1)
	a.fill("path", 27, 2, 1, 15)
	a.fill("path", 20, 2, 1, 16)
	a.fill("path", 34, 2, 1, 16)
	a.prop("planter", 27, 9)
	for p in [[24, 8, PI], [30, 8, PI], [24, 10, 0.0], [30, 10, 0.0]]:
		a.prop("bench", p[0], p[1], {"yaw": p[2]})
	for p in [[22, 3], [32, 3], [22, 15], [32, 15], [25, 5], [30, 13]]:
		a.prop("big_tree" if p[0] % 2 == 0 else "tree", p[0], p[1], {"v": p[0]})
	a.prop("flagpole", 10, 2)
	# south of College Walk: residences and a lot, facing the street
	a.building("res_a", "Aspen Hall", 2, 26, 9, 8, 4, "shop", {"to": false, "face": "n", "brick": "orange", "floors": 4, "awning": "#6f8f62"})
	a.building("res_b", "Birch Hall", 12, 26, 9, 8, 4, "shop", {"to": false, "face": "n", "brick": "red", "floors": 4, "awning": "#5b6fa8"})
	a.building("bookshop", "Campus Books", 36, 26, 7, 6, 3, "shop", {"to": false, "face": "n", "brick": "orange", "awning": "#b25c47"})
	a.building("coffee", "The Study Bean", 44, 26, 6, 6, 2, "shop", {"to": false, "face": "n", "brick": "red", "awning": "#3f8fd2"})
	a.fill("lot", 36, 34, 22, 8)
	for i in 8:
		if i % 3 != 2:
			a.prop("car", 37 + i * 2 + (i / 4), 35 + (i % 2) * 4, {"h": 2, "yaw": PI / 2.0 if i % 2 else -PI / 2.0, "color": ["#9fb0bf", "#c9b28d", "#b5837a", "#8e9e88", "#d6d0c4", "#7e8fa6", "#b9a7c9", "#a9a39b"][i]})
	a.fill("walk", 2, 34, 19, 1)
	for x in range(3, 21, 4):
		a.prop("bike_rack", x, 35)
	a.furnish_ew(18)
	a.furnish_ns(X, Kit.MAIN_Y + 8, Kit.H)
	a.park_ew(18, 50, 58)
	a.park_ns(X, 28, 43)
	a.prop("bus_shelter", 13, 18 + 6, {"w": 3})
	a.prop("sign", 25, 17, {"id": "sign_campus", "label": "Sign", "text": "← University.   Polytechnic · Trades Centre →   ↓ Downtown"})
	a.traffic(2)
	a.walker(a.look(5), [[2, 18], [24, 18]], false, 1.1)
	a.walker(a.look(6), [[36, 25], [58, 25]], false, 0.9)
	a.walker(a.look(7), [[21, 9], [33, 9]], false, 0.8)
	a.walker(a.look(2), [[27, 2], [27, 16]], false, 1.0)
	a.edge("s", "downtown")
	a.gate("s", "downtown", "Downtown", "#9e4f3f")
	a.edge_trees()
	a.scatter_trees(1, 35, 34, 44, 10)
	a.district("University Quad", 20, 2, 15, 16, 27.5, 1.0)
	a.district("College Walk", 0, 18, Kit.W, 8, 12.0, 21.5)
	return a.build()


# ── School grounds (west): the School, the sports field, the Community Centre, School Road ──
static func school() -> Dictionary:
	var a := Kit.new("schoolgrounds", "School Grounds")
	a.street_ew(Y)
	a.street_ns(20)
	a.crossings()
	a.building("school", "School", 30, 4, 18, 14, 9, "civic", {"brick": "red", "floors": 3})
	a.building("community", "Community Centre", 49, 7, 10, 11, 4, "civic", {"brick": "orange", "floors": 2.6})
	a.fill("lawn", 2, 2, 16, 14)
	a.draws.append({"kind": "field", "x": 2, "y": 2, "w": 16, "h": 13})
	for x in range(3, 17, 2):
		a.prop("bleachers", x, 16, {"w": 1})
	a.fill("path", 2, 17, 16, 1)
	a.prop("flagpole", 29, 15)
	a.prop("playground", 30, 0, {"w": 5, "h": 3})
	# the school bus loop and the playground south of Main Street
	a.fill("lot", 30, 27, 14, 5)
	a.prop("truck", 31, 28, {"w": 4, "style": "lin", "company": "School Bus", "color": "#e8b83a"})
	a.prop("truck", 37, 28, {"w": 4, "style": "lin", "company": "School Bus", "color": "#e8b83a"})
	a.fill("sand", 46, 27, 12, 8)
	a.prop("playground", 46, 27, {"w": 6, "h": 4})
	a.prop("playground", 52, 31, {"w": 5, "h": 3})
	for p in [[47, 33], [50, 33]]:
		a.prop("picnic", p[0], p[1])
	# houses south of Main Street, west of School Road, facing it
	var col := ["#e8d5bf", "#dfc9c0", "#d9e0cf", "#e6dcc9"]
	for i in 3:
		a.building("sh_%d" % i, "", 1 + i * 6, 26, 5, 6, 2, "house", {"to": false, "face": "n", "wall": col[i % 4], "brick": ["red", "orange"][i % 2]})
	for i in 3:
		a.building("sh2_%d" % i, "", 30 + i * 6, 36, 5, 6, 2, "house", {"to": false, "wall": col[(i + 1) % 4], "brick": ["orange", "red"][i % 2]})
	a.fill("walk", 30, 42, 18, 1)
	a.furnish_ew(Y)
	a.furnish_ns(20)
	a.park_ew(Y, 30, 58)
	a.park_ns(20, 28, 43)
	a.prop("bus_shelter", 40, Y + 6, {"w": 3})
	a.prop("sign", 29, Y - 1, {"id": "sign_school", "label": "Sign", "text": "School · Sports Field · Community Centre.   Downtown →"})
	a.traffic(2)
	a.walker(a.look(0), [[30, Y], [58, Y]], false, 1.2)
	a.walker(a.look(3), [[2, Y + 7], [18, Y + 7]], false, 0.9)
	a.walker(a.look(1), [[3, 17], [17, 17]], false, 1.4)
	a.walker(a.look(4), [[21, 2], [21, 16]], false, 1.0)
	a.edge("e", "downtown")
	a.gate("e", "downtown", "Downtown", "#4f7a4a")
	a.edge_trees()
	a.scatter_trees(2, 33, 19, 44, 12)
	a.district("Sports Field", 2, 2, 16, 15, 10.0, 1.0)
	a.district("Schoolyard", 28, 0, 32, Y, 39.0, 1.0)
	a.district("School Road", 20, 0, 8, Kit.H, 24.0, 40.0)
	return a.build()


# ── Shopping district (east): Main Street's shops, Market Lane, the Industrial Yard ──
static func shopping() -> Dictionary:
	var a := Kit.new("shopping", "Shopping District")
	a.street_ew(Y)
	a.street_ns(30, Y, Kit.H)
	a.crossings()
	a.building("grocer", "Valley Market", 1, 10, 9, 8, 4, "shop", {"brick": "red", "awning": "#6f8f62"})
	a.building("diner", "The Lantern Diner", 11, 11, 7, 7, 3, "shop", {"brick": "orange", "awning": "#b25c47"})
	a.building("sports", "Northside Sports", 19, 10, 9, 8, 4, "glass", {"brick": "red", "floors": 2})
	a.building("phones", "CellPoint", 29, 11, 8, 7, 3, "glass", {"brick": "orange", "floors": 2})
	a.building("furniture", "Home & Hearth", 38, 9, 11, 9, 5, "glass", {"brick": "red", "floors": 2.4})
	a.fill("lot", 50, 9, 9, 8)
	for i in 4:
		a.prop("car", 51 + i * 2, 10 + (i % 2) * 4, {"h": 2, "yaw": PI / 2.0, "color": ["#c9b28d", "#9fb0bf", "#b9a7c9", "#8e9e88"][i]})
	a.fill("walk", 0, 8, Kit.W, 1)
	# Market Lane: the shops south of Main Street, facing it
	a.building("bikeshop", "Spoke & Chain Bikes", 1, 26, 7, 6, 3, "shop", {"face": "n", "brick": "orange", "awning": "#3f7f9a"})
	a.building("quickcash", "Quick Cash", 9, 26, 5, 5, 2, "shop", {"face": "n", "brick": "red", "awning": "#d9b13a", "stripes": false})
	a.building("taxclinic", "Tax Clinic", 15, 26, 6, 6, 2, "shop", {"face": "n", "brick": "orange", "awning": "#5b6fa8"})
	a.building("pharmacy", "Pharmacy", 22, 26, 6, 6, 2, "shop", {"to": false, "face": "n", "brick": "red", "awning": "#4caf7a"})
	a.fill("lot", 1, 34, 27, 9)
	a.fill("walk", 1, 33, 27, 1)
	for i in 9:
		if i % 4 != 3:
			a.prop("car", 2 + i * 3, 35 + (i % 2) * 4, {"h": 2, "yaw": -PI / 2.0, "color": ["#d6d0c4", "#7e8fa6", "#c7a06e", "#a9a39b", "#b9a7c9", "#9fb7a8", "#c9a98d", "#a9b4c2", "#c4b9a0"][i]})
	for x in [4, 12]:
		a.prop("bike_rack", x, 25)
	# the Industrial Yard
	a.fill("lot", 39, 26, 21, 19)
	a.building("warehouse", "Prairie Parcel", 40, 27, 14, 8, 7, "industry", {"face": "n", "brick": "orange"})
	a.building("electric", "Bright Spark Electric", 40, 38, 10, 7, 3, "industry", {"face": "n", "brick": "orange"})
	a.prop("truck", 51, 36, {"w": 4, "style": "lin", "company": "Prairie Parcel", "color": "#8a5a35"})
	a.prop("truck", 55, 28, {"w": 4, "h": 1, "style": "produce"})
	for p in [[52, 40], [53, 40], [55, 41], [56, 41]]:
		a.prop("pallet", p[0], p[1])
	for p in [[51, 42], [52, 42], [57, 38]]:
		a.prop("cone", p[0], p[1])
	a.prop("barrier", 54, 43)
	for y in range(26, 45):
		a.prop("fence", 59, y)
	a.furnish_ew(Y)
	a.furnish_ns(30, Y + 8, Kit.H)
	a.park_ew(Y, 2, 28)
	a.park_ew(Y, 40, 58)
	a.prop("bus_shelter", 46, Y + 6, {"w": 3})
	a.prop("sign", 29, Y - 1, {"id": "sign_shops", "label": "Sign", "text": "← Downtown.   Market Lane shops both sides.   ↓ Industrial Yard"})
	a.traffic(2)
	a.walker(a.look(6), [[1, Y], [28, Y]], false, 1.0)
	a.walker(a.look(7), [[1, Y + 7], [28, Y + 7]], false, 0.9)
	a.walker(a.look(5), [[39, Y], [57, Y]], false, 1.1)
	a.walker(a.look(2), [[31, Y + 9], [31, 43]], false, 1.0)
	a.edge("w", "downtown")
	a.gate("w", "downtown", "Downtown", "#3f7f9a")
	a.edge_trees()
	a.district("Industrial Yard", 39, 26, 21, 19, 49.0, 36.0)
	a.district("Market Lane", 0, 8, Kit.W, 26, 14.0, Y + 3.5)
	return a.build()


# ── Neighbourhoods (south): Elm Street, Riverside Homes on River Walk, the river, Riverside Park ──
static func neighbourhoods() -> Dictionary:
	var a := Kit.new("neighbourhoods", "Neighbourhoods")
	a.street_ns(X, 0, 26)
	a.street_ew(10)
	a.crossings()
	var col := ["#e8d5bf", "#dfc9c0", "#d9e0cf", "#e6dcc9", "#d8d6e6"]
	# Elm Street: houses on both sides
	for i in 4:
		a.building("elm_n%d" % i, "", 1 + i * 6, 3, 5, 7, 2, "house", {"to": false, "wall": col[i % 5], "brick": ["red", "orange"][i % 2]})
		a.building("elm_s%d" % i, "", 1 + i * 6, 18, 5, 6, 2, "house", {"to": false, "face": "n", "wall": col[(i + 2) % 5], "brick": ["orange", "red"][i % 2]})
	for i in 4:
		a.building("elm_e%d" % i, "", 35 + i * 6, 3, 5, 7, 2, "house", {"to": false, "wall": col[(i + 3) % 5], "brick": ["red", "orange"][i % 2]})
	# Riverside Homes, facing River Walk
	a.building("home", "Home", 36, 20, 6, 7, 2, "house", {"brick": "red", "wall": "#dfc9c0"})
	a.building("neighbour", "Neighbours", 44, 20, 6, 7, 3, "house", {"brick": "orange", "wall": "#e8d5bf"})
	a.building("grandpa", "Grandpa’s house", 52, 20, 6, 7, 2, "house", {"brick": "orange", "wall": "#d9e0cf"})
	a.fill("path", 0, 27, Kit.W, 2)                 # River Walk
	for x in [37, 40, 45, 48, 53, 56]:
		a.prop("flowers", x, 26, {}, false)
	a.prop("mailbox", 43, 27)
	# the community garden
	a.fill("path", 34, 18, 1, 9)
	for i in 4:
		a.prop("garden_bed", 1 + i * 6, 25 - 0, {"w": 4, "h": 1})
	# the river and its bridges
	a.fill("water", 0, 30, Kit.W, 3)
	for br in [[12, 2], [44, 2]]:
		for x in range(br[0], br[0] + br[1]):
			for y in range(30, 33):
				a.set_g(x, y, "path")
				a.keep[Vector2i(x, y)] = true
		a.draws.append({"kind": "bridge", "x": br[0], "y": 30, "w": br[1], "h": 3})
	# Riverside Park
	a.fill("path", 0, 33, Kit.W, 1)
	a.fill("path", 12, 34, 2, 11)
	a.fill("pond", 20, 37, 8, 6)
	a.draws.append({"kind": "pond", "x": 20, "y": 37, "w": 8, "h": 6})
	a.prop("playground", 34, 36, {"w": 5, "h": 4})
	for p in [[4, 38], [8, 41], [46, 38], [52, 40]]:
		a.prop("picnic", p[0], p[1])
	for p in [[17, 35], [30, 35], [42, 35], [56, 35]]:
		a.prop("bench", p[0], p[1], {"yaw": 0.0})
	a.prop("sign", 11, 34, {"id": "sign_park", "label": "Sign", "text": "Riverside Park. The footbridge goes back to River Walk ↑"})
	a.prop("sign", 25, 9, {"id": "sign_elm", "label": "Sign", "text": "Elm Street.   ↑ Downtown   ↓ River Walk · Riverside Homes · Riverside Park"})
	a.furnish_ew(10)
	a.furnish_ns(X, 0, 26)
	a.park_ew(10, 2, 24)
	a.park_ew(10, 36, 58)
	a.traffic(1)
	a.walker(a.look(1), [[0, 27], [59, 27]], false, 1.0)
	a.walker(a.look(4), [[0, 33], [59, 33]], false, 0.8)
	a.walker(a.look(7), [[2, 10], [24, 10]], false, 1.1)
	a.walker(a.look(3), [[19, 36], [28, 36], [28, 43], [19, 43]], true, 0.7)
	a.edge("n", "downtown")
	a.gate("n", "downtown", "Downtown", "#a0765a")
	a.edge_trees()
	a.scatter_trees(1, 34, 59, 44, 9)
	a.district("Riverside Park", 0, 33, Kit.W, 12, 30.0, 44.0)
	a.district("River Walk", 0, 27, Kit.W, 6, 8.0, 28.0)
	a.district("Riverside Homes", 35, 18, 25, 9, 47.0, 18.5)
	a.district("Elm Street", 0, 0, Kit.W, 26, 12.0, 13.5)
	return a.build()
