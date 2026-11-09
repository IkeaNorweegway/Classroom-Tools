extends SceneTree
func _init():
	var J = load("res://games/payday/jobs/phones.gd").new()
	for s in 8:
		var st = J.play(3000 + s, false, 2, "random")
		print("random good=%d bad=%d lost=%d demand=%d pend=%d q=%.2f c=%.2f %s %s" % [st.good, st.bad, st.lost, st.demand, J.pending(st), J.quality(st), J.coverage(st), J.tier(st), st.why])
	quit()
