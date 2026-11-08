# Starts the game. To make a new game, write games/<name>/game.gd and point this at it.
extends Node


func _ready() -> void:
	Town.start(preload("res://games/demo_cafe/game.gd").new())
