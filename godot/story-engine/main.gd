# Starts the game (the Realm web export starts Realm with no game=, from its "realm" feature tag). game=demo (command line `-- game=demo`, or ?game=demo on the web) runs the café demo;
# game=payday runs Payday (CEFL 7 Income and Tax); otherwise CEFL Town. To make a new game, write games/<name>/game.gd and add it here.
extends Node

const GAMES := {"town": "res://games/cefl_town/game.gd", "demo": "res://games/demo_cafe/game.gd", "payday": "res://games/payday/game.gd", "realm": "res://games/realm/game.gd", "lab": "res://games/lab/game.gd"}


func _ready() -> void:
	var which := "realm" if OS.has_feature("realm") else "town"   # the Realm web export carries the feature tag "realm" (preset Web-Realm)
	for a in OS.get_cmdline_user_args():
		if a.begins_with("game="):
			which = a.substr(5)
	if OS.has_feature("web"):
		var q = JavaScriptBridge.eval("new URLSearchParams(location.search).get('game') || ''")
		if q is String and q != "":
			which = q
	Town.start(load(GAMES.get(which, GAMES.town)).new())
