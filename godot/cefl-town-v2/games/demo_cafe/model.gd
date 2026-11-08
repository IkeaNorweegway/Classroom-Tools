# Demo: Rosa's Corner Café. The model (no nodes), so tests/test_model.gd can play it with bots.
# Outcome 9-EX1: entrepreneurship exposes students to business operations and responsibilities
# (managing employees, mitigating financial risk).
# All numbers are samples for the engine demo, not from a CEFL workbook.
extends RefCounted

const START_CASH := 25000      # Rosa leaves a $250 float
const GOAL_PROFIT := 45000     # three days together
const GOAL_REP := 50           # keep the regulars: reputation at least where Rosa left it

const CFG := {
	"rent": 6000,
	"open": [7, 15],
	"traffic": [16, 24, 18, 10, 14, 16, 10, 6],
	"products": {
		"coffee": {"name": "Coffee", "icon": "☕", "unit": "cups", "pack_name": "bag of beans", "pack_size": 20, "pack_cost": 800, "ref": 300,
			"perishable": false, "rep_each": 0.25, "mix": [8, 8, 6, 5, 4, 4, 5, 5],
			"grades": {"cheap": {"pack_cost": 400, "rep_each": -1.0, "label": "Quick Bean beans"}}},
		"muffin": {"name": "Muffin", "icon": "🧁", "unit": "muffins", "pack_name": "box", "pack_size": 12, "pack_cost": 1080, "ref": 350,
			"perishable": true, "rep_each": 0.25, "mix": [4, 4, 4, 3, 1, 1, 3, 3]},
		"sandwich": {"name": "Sandwich", "icon": "🥪", "unit": "sandwiches", "pack_name": "tray", "pack_size": 6, "pack_cost": 1500, "ref": 750,
			"perishable": true, "rep_each": 0.25, "mix": [0, 0, 1, 3, 8, 7, 2, 1]},
	},
	"staff": {"dev": {"name": "Dev", "per_hour": 12, "wage": 1500, "shifts": {"morning": [7, 11], "afternoon": [11, 15]}}},
	"you_per_hour": 12,
	"elasticity": 2.5,
	"rep_per_line": 1.0,
	"rep_per_soldout": 0.5,
	"rep_scale": 4.0,
}

## One event a day. The student hears about each one in town the morning before.
const EVENTS := [
	{"traffic": 1.0, "label": "An ordinary Tuesday"},
	{"traffic": 1.5, "label": "Farmers' market on Main Street"},
	{"traffic": 0.7, "label": "Rain all day"},
]


## Did the student meet the goal? "thriving" | "regulars" (profit but reputation fell) | "short"
static func ending(S: Dictionary, total_profit: int) -> String:
	if total_profit >= GOAL_PROFIT and int(S.shop.rep) >= GOAL_REP:
		return "thriving"
	if total_profit >= GOAL_PROFIT:
		return "regulars"
	return "short"
