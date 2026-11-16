# Gentle music and light city sounds (people at the café talk in a made-up language) for the walkable mock-up, all made in code (no sound files).
# Music: a slow electric-piano loop in F major (16 bars, ~53 s), soft bass, a light pentatonic melody.
# City: low traffic hum, the park fountain and café murmur (heard from where you stand), and now and then
# birds, a car passing on a street out of view, a bike bell, a far-off horn, a cup clink. Footsteps when you walk.
# The sounds are made in a background thread when the scene opens, then fade in. Test scene only.
extends Node3D

const SR := 22050                      # sample rate: warm and light to make
const BPM := 72.0

var city: Node3D                        # the play scene (for your position)
var listener: AudioListener3D
var rng := RandomNumberGenerator.new()
var thread: Thread
var ready_ := false
var bank := {}                          # name → Array of AudioStreamWAV
var t := 0.0
var next := {}                          # sound → time it next plays
var music: AudioStreamPlayer
var music_on := true


func _ready() -> void:
	rng.seed = 7
	_buses()
	listener = AudioListener3D.new()
	add_child(listener)
	listener.make_current()
	thread = Thread.new()
	thread.start(_make_all)


func _exit_tree() -> void:
	if thread and thread.is_started():
		thread.wait_to_finish()


func _buses() -> void:
	for name in ["Music", "City"]:
		if AudioServer.get_bus_index(name) != -1:
			continue
		AudioServer.add_bus()
		var i := AudioServer.bus_count - 1
		AudioServer.set_bus_name(i, name)
		AudioServer.set_bus_send(i, "Master")
		var rv := AudioEffectReverb.new()
		rv.room_size = 0.75 if name == "Music" else 0.4
		rv.damping = 0.6
		rv.wet = 0.22 if name == "Music" else 0.08
		rv.dry = 0.9
		AudioServer.add_bus_effect(i, rv)
		var lp := AudioEffectLowPassFilter.new()
		lp.cutoff_hz = 5200.0 if name == "Music" else 7000.0
		AudioServer.add_bus_effect(i, lp)


# ── Making the sounds (background thread) ──
func _make_all() -> void:
	var b := {}
	b.music = [_wav(_music(), true)]
	b.traffic = [_wav(_loop(_traffic(12.0), 1.5), true)]
	b.fountain = [_wav(_loop(_fountain(6.0), 1.0), true)]
	b.murmur = [_wav(_murmur(24.0), true)]
	b.bird = []
	for k in 5: b.bird.append(_wav(_bird(k), false))
	b.car = []
	for k in 2: b.car.append(_wav(_car_pass(k), false))
	b.bell = [_wav(_bell(), false)]
	b.horn = [_wav(_horn(), false)]
	b.clink = []
	for k in 3: b.clink.append(_wav(_clink(k), false))
	b.engine = [_wav(_engine(), true)]
	b.step = []
	for k in 4: b.step.append(_wav(_step(k), false))
	call_deferred("_start", b)


func _wav(buf: PackedFloat32Array, loop: bool) -> AudioStreamWAV:
	var bytes := PackedByteArray()
	bytes.resize(buf.size() * 2)
	for i in buf.size():
		bytes.encode_s16(i * 2, int(clampf(buf[i], -1.0, 1.0) * 32000.0))
	var w := AudioStreamWAV.new()
	w.format = AudioStreamWAV.FORMAT_16_BITS
	w.mix_rate = SR
	w.stereo = false
	w.data = bytes
	if loop:
		w.loop_mode = AudioStreamWAV.LOOP_FORWARD
		w.loop_begin = 0
		w.loop_end = buf.size()
	return w


## Makes a buffer loop smoothly: the extra tail (fade seconds) is blended into the start.
func _loop(buf: PackedFloat32Array, fade: float) -> PackedFloat32Array:
	var f := int(fade * SR)
	var n := buf.size() - f
	var out := buf.slice(0, n)
	for i in f:
		var a := float(i) / f
		out[i] = buf[i] * a + buf[n + i] * (1.0 - a)
	return out


func _midi(m: float) -> float:
	return 440.0 * pow(2.0, (m - 69.0) / 12.0)


## A plucked electric-piano note added into buf at sample s0 (wraps round, so the loop is seamless).
## Uses a rotating oscillator and a multiplying envelope: cheap enough for GDScript.
func _ep(buf: PackedFloat32Array, s0: int, f: float, len_s: float, vel: float, tau: float) -> void:
	var n := buf.size()
	var len := int(len_s * SR)
	var w := TAU * f / SR
	var c1 := 2.0 * cos(w); var c2 := 2.0 * cos(2.0 * w)
	var y1 := 0.0; var y2 := -sin(w); var z1 := 0.0; var z2 := -sin(2.0 * w)
	var env := 1.0; var k := exp(-1.0 / (tau * SR))
	var env2 := 1.0; var k2 := exp(-1.0 / (0.35 * SR))
	var att := int(0.012 * SR)
	for i in len:
		var y := c1 * y1 - y2; y2 = y1; y1 = y
		var z := c2 * z1 - z2; z2 = z1; z1 = z
		env *= k; env2 *= k2
		var a := env * (minf(1.0, float(i) / att))
		buf[(s0 + i) % n] += (y + 0.2 * z * env2) * a * vel


func _music() -> PackedFloat32Array:
	var beat := 60.0 / BPM
	var bar := int(4.0 * beat * SR)
	var bars := 16
	var buf := PackedFloat32Array()
	buf.resize(bar * bars)
	# Fmaj7  Am7  Bbmaj7  C6  |  Dm7  Am7  Bbmaj7  Csus4→C
	var chords := [[53, 57, 60, 64], [52, 55, 57, 60], [53, 57, 58, 62], [52, 55, 57, 60], [53, 57, 60, 62], [52, 55, 57, 60], [50, 53, 57, 58], [53, 55, 60, 62]]
	var roots := [41, 45, 46, 48, 38, 45, 46, 48]
	var half := PackedFloat32Array()
	half.resize(bar * 8)
	for b in 8:
		var s := b * bar
		for m in chords[b]:
			_ep(half, s + int(0.01 * SR * rng.randf()), _midi(m), 2.6, 0.075, 1.4)                    # beat 1
			_ep(half, s + int(2.5 * beat * SR), _midi(m), 1.6, 0.04, 0.9)                         # and-of-3, softer
		_ep(half, s, _midi(roots[b]), 1.6, 0.16, 0.9)                                             # bass
		_ep(half, s + int(2.0 * beat * SR), _midi(roots[b] + (7 if b % 2 == 0 else 12)), 1.2, 0.1, 0.7)
	for i in bar * 8:
		buf[i] = half[i]
		buf[bar * 8 + i] = half[i]
	# Melody: F major pentatonic, a few notes a bar with rests; the second half answers the first.
	var scale := [65, 67, 69, 72, 74, 77, 79, 81]
	var idx := 3
	for b in bars:
		if b % 4 == 3 and rng.randf() < 0.6:
			continue   # let it breathe
		var slots := [0, 3, 4, 6] if b < 8 else [1, 2, 5, 6]
		for slot in slots:
			if rng.randf() < 0.35:
				continue
			idx = clampi(idx + rng.randi_range(-2, 2), 0, scale.size() - 1)
			var s := b * bar + int(slot * 0.5 * beat * SR)
			_ep(buf, s, _midi(scale[idx]), 1.3, 0.05, 0.75)
			_ep(buf, s, _midi(scale[idx] + 12), 0.6, 0.008, 0.3)   # a little shimmer
	# gentle level
	var peak := 0.0
	for v in buf: peak = maxf(peak, absf(v))
	for i in buf.size(): buf[i] *= 0.7 / peak
	return buf


func _noise(n: int) -> PackedFloat32Array:
	var b := PackedFloat32Array()
	b.resize(n)
	for i in n: b[i] = rng.randf() * 2.0 - 1.0
	return b


func _traffic(secs: float) -> PackedFloat32Array:
	var n := int(secs * SR)
	var b := _noise(n)
	var lp := 0.0; var lp2 := 0.0
	for i in n:
		lp += (b[i] - lp) * 0.02
		lp2 += (lp - lp2) * 0.05
		var swell := 0.7 + 0.3 * sin(TAU * i / n * 2.0) * sin(TAU * i / n * 3.0 + 1.0)
		b[i] = lp2 * 6.0 * swell
	return b


func _fountain(secs: float) -> PackedFloat32Array:
	var n := int(secs * SR)
	var b := _noise(n)
	var hp := 0.0; var lp := 0.0; var prev := 0.0
	for i in n:
		hp = 0.95 * (hp + b[i] - prev); prev = b[i]
		lp += (hp - lp) * 0.35
		b[i] = lp * 0.5 * (0.85 + 0.15 * sin(i * 0.0009 + sin(i * 0.00031)))
	return b


## Made-up speech: syllables (consonant + vowel) from a buzzing voice through two or three vowel filters,
## strung into sentences that rise and fall. Pairs of speakers take turns, like people at a table.
const VOWELS := [[800.0, 1250.0], [520.0, 1850.0], [320.0, 2250.0], [520.0, 950.0], [340.0, 820.0], [650.0, 1600.0]]


func _murmur(secs: float) -> PackedFloat32Array:
	var n := int(secs * SR)
	var out := PackedFloat32Array()
	out.resize(n)
	# speaker: base pitch, formant scale, loudness. Two tables, two people each.
	var tables := [[[118.0, 1.0, 1.0], [205.0, 1.16, 0.9]], [[220.0, 1.18, 0.7], [132.0, 1.03, 0.75]]]
	for tb in tables.size():
		var pos := int(rng.randf_range(0.0, 1.5) * SR)
		var who := 0
		while pos < n:
			var spk: Array = tables[tb][who]
			pos = _sentence(out, pos, spk[0], spk[1], spk[2] * (0.6 if tb == 1 else 1.0))
			pos += int(rng.randf_range(0.25, 0.9) * SR)
			who = 1 - who if rng.randf() < 0.8 else who
	# quiet room tone under it, so it never drops to silence
	var lp := 0.0
	for i in n:
		lp += ((rng.randf() * 2.0 - 1.0) - lp) * 0.05
		out[i] = out[i] * 0.55 + lp * 0.05
	var peak := 0.0
	for v in out: peak = maxf(peak, absf(v))
	for i in n: out[i] *= 0.6 / peak
	return out


## One sentence into buf from sample s; returns where it ended. Writes wrap round, so the loop is seamless.
func _sentence(buf: PackedFloat32Array, s: int, f0: float, fs: float, amp: float) -> int:
	var n := buf.size()
	var syl := rng.randi_range(3, 9)
	var question := rng.randf() < 0.25
	var ph := 0.0
	var r1 := [0.0, 0.0]; var r2 := [0.0, 0.0]; var r3 := [0.0, 0.0]
	var v_prev: Array = VOWELS[rng.randi() % VOWELS.size()]
	var pos := s
	for k in syl:
		var x := float(k) / maxf(1.0, syl - 1)
		var pitch := f0 * (1.08 - 0.18 * x + (0.25 * x * x if question and k >= syl - 2 else 0.0)) * rng.randf_range(0.96, 1.05)
		var stress := 1.0 if k % 2 == 0 else 0.75
		# consonant
		var ctype := rng.randi() % 5   # 0 none, 1 stop, 2 s/sh, 3 m/n, 4 l/w glide
		var clen: int = [0, int(0.02 * SR), int(0.07 * SR), int(0.05 * SR), int(0.04 * SR)][ctype]
		var vlen := int(rng.randf_range(0.08, 0.17) * SR * (1.4 if k == syl - 1 else 1.0))
		var v: Array = VOWELS[rng.randi() % VOWELS.size()]
		var total := clen + vlen
		for i in total:
			var cons := i < clen
			var tt := float(i - clen) / vlen if not cons else 0.0
			# formants glide from the last vowel into this one
			var g := minf(1.0, tt * 4.0)
			var F1: float = lerpf(v_prev[0], v[0], g) * fs
			var F2: float = lerpf(v_prev[1], v[1], g) * fs
			if cons and ctype == 3: F1 = 260.0 * fs; F2 = 1150.0 * fs
			var src := 0.0
			var voiced := not cons or ctype >= 3
			if voiced:
				ph += pitch / SR
				if ph >= 1.0: ph -= 1.0
				src = (1.0 - 2.0 * ph) * 0.6 + (rng.randf() - 0.5) * 0.06
			var hiss := 0.0
			if cons and ctype == 1: hiss = (rng.randf() - 0.5) * (1.0 if i > clen / 2 else 0.0)
			if cons and ctype == 2: hiss = (rng.randf() - 0.5) * 0.7
			var y := _res(r1, src, F1, 90.0) + 0.55 * _res(r2, src, F2, 120.0) + 0.2 * _res(r3, src, 2700.0 * fs, 200.0)
			y += hiss * 0.25
			var env := 1.0
			if not cons:
				env = minf(1.0, tt * 12.0) * minf(1.0, (1.0 - tt) * 8.0)
			elif ctype == 3 or ctype == 4:
				env = 0.45
			buf[(pos + i) % n] += y * env * amp * stress * 0.05
		v_prev = v
		pos += total
	return pos


## Two-pole resonator (one vowel formant). state: [y1, y2].
func _res(st_: Array, x: float, f: float, bw: float) -> float:
	var r := exp(-PI * bw / SR)
	var a1 := 2.0 * r * cos(TAU * f / SR)
	var a2 := -r * r
	var y: float = (1.0 - r) * x + a1 * st_[0] + a2 * st_[1]
	st_[1] = st_[0]
	st_[0] = y
	return y


func _bird(k: int) -> PackedFloat32Array:
	var b := PackedFloat32Array()
	var chirps := 2 + k % 3
	var f0 := 2800.0 + k * 350.0
	for c in chirps:
		var len := int(SR * rng.randf_range(0.05, 0.09))
		var ph := 0.0
		var up := (k + c) % 2 == 0
		for i in len:
			var x := float(i) / len
			var f := f0 * (1.0 + (0.5 * x if up else 0.45 * (1.0 - x))) + 300.0 * sin(x * 30.0)
			ph += TAU * f / SR
			b.append(sin(ph) * sin(PI * x) * 0.35)
		for i in int(SR * rng.randf_range(0.04, 0.12)): b.append(0.0)
	return b


func _car_pass(k: int) -> PackedFloat32Array:
	var n := int(SR * 5.0)
	var b := _noise(n)
	var lp := 0.0; var ph := 0.0
	for i in n:
		var x := float(i) / n
		var near := exp(-pow((x - 0.5) * 4.0, 2.0))
		lp += (b[i] - lp) * (0.03 + 0.12 * near)
		var hz := (70.0 + 10.0 * k) * (1.08 if x < 0.5 else 0.94)
		ph += TAU * hz / SR
		b[i] = (lp * 2.2 + sin(ph) * 0.15) * near
	return b


func _bell() -> PackedFloat32Array:
	var b := PackedFloat32Array()
	b.resize(int(SR * 1.3))
	for d in 2:
		var s0 := int(d * 0.18 * SR)
		for i in int(SR * 1.0):
			var tt := float(i) / SR
			var e := exp(-tt * 5.0)
			b[s0 + i] += (sin(TAU * 2300.0 * tt) + 0.5 * sin(TAU * 3150.0 * tt) + 0.25 * sin(TAU * 4900.0 * tt)) * e * 0.22
	return b


func _horn() -> PackedFloat32Array:
	var n := int(SR * 0.5)
	var b := PackedFloat32Array()
	b.resize(n)
	for i in n:
		var tt := float(i) / SR
		var e := minf(1.0, tt / 0.03) * minf(1.0, (0.5 - tt) / 0.08)
		var s := 0.0
		for h in [1.0, 2.0, 3.0]:
			s += (sin(TAU * 392.0 * h * tt) + sin(TAU * 494.0 * h * tt)) / (h * h)
		b[i] = s * e * 0.18
	return b


func _clink(k: int) -> PackedFloat32Array:
	var n := int(SR * 0.4)
	var b := PackedFloat32Array()
	b.resize(n)
	var f := 3600.0 + k * 520.0
	for i in n:
		var tt := float(i) / SR
		b[i] = (sin(TAU * f * tt) + 0.6 * sin(TAU * f * 1.51 * tt)) * exp(-tt * 18.0) * 0.25
	return b


## A soft engine idle: a low hum with a little rumble. 2 s, whole cycles so it loops cleanly.
func _engine() -> PackedFloat32Array:
	var n := SR * 2
	var b := _noise(n)
	var lp := 0.0
	for i in n:
		var tt := float(i) / SR
		lp += (b[i] - lp) * 0.04
		var hum := sin(TAU * 48.0 * tt) * 0.5 + sin(TAU * 96.0 * tt) * 0.25 + sin(TAU * 144.0 * tt) * 0.1
		b[i] = (hum * (0.8 + 0.2 * sin(TAU * 6.0 * tt)) + lp * 1.5) * 0.35
	return b


func _step(k: int) -> PackedFloat32Array:
	var n := int(SR * 0.09)
	var b := _noise(n)
	var lp := 0.0
	for i in n:
		var x := float(i) / n
		lp += (b[i] - lp) * (0.12 + 0.03 * k)
		b[i] = lp * 2.5 * exp(-x * 7.0) * minf(1.0, x * 40.0)
	return b


# ── Playing ──
func _start(b: Dictionary) -> void:
	thread.wait_to_finish()
	bank = b
	music = AudioStreamPlayer.new()
	music.stream = bank.music[0]
	music.bus = "Music"
	music.volume_db = -40.0
	add_child(music)
	music.play()
	create_tween().tween_property(music, "volume_db", -13.0, 5.0)
	var hum := AudioStreamPlayer.new()
	hum.stream = bank.traffic[0]
	hum.bus = "City"
	hum.volume_db = -40.0
	add_child(hum)
	hum.play()
	create_tween().tween_property(hum, "volume_db", -17.0, 4.0)
	_loop3d(bank.fountain[0], Vector3(6.5, 0.6, 23.2), -6.0)
	_loop3d(bank.murmur[0], Vector3(7.0, 0.9, 9.7), -9.0)
	if city:   # each moving car hums along, higher as it speeds up
		for mv in city.movers:
			var eng := AudioStreamPlayer3D.new()
			eng.stream = bank.engine[0]
			eng.bus = "City"
			eng.unit_size = 2.2
			eng.max_distance = 18.0
			eng.volume_db = -12.0
			mv.node.add_child(eng)
			eng.play(rng.randf() * 1.9)
			mv["hum"] = eng
	for k in ["bird", "car", "bell", "horn", "clink"]:
		next[k] = rng.randf_range(2.0, 8.0)
	next.horn = rng.randf_range(30.0, 60.0)
	ready_ = true


func _loop3d(stream: AudioStream, at: Vector3, db: float) -> void:
	var p := AudioStreamPlayer3D.new()
	p.stream = stream
	p.bus = "City"
	p.unit_size = 3.0
	p.max_distance = 26.0
	p.volume_db = db
	p.position = at
	add_child(p)
	p.play(rng.randf() * 3.0)


func _one3d(stream: AudioStream, at: Vector3, db: float, pitch := 1.0) -> AudioStreamPlayer3D:
	var p := AudioStreamPlayer3D.new()
	p.stream = stream
	p.bus = "City"
	p.unit_size = 4.0
	p.max_distance = 40.0
	p.volume_db = db
	p.pitch_scale = pitch
	p.position = at
	add_child(p)
	p.play()
	p.finished.connect(p.queue_free)
	return p


func step() -> void:
	if not ready_:
		return
	var p := AudioStreamPlayer.new()
	p.stream = bank.step[rng.randi() % bank.step.size()]
	p.bus = "City"
	p.volume_db = -20.0
	p.pitch_scale = rng.randf_range(0.85, 1.15)
	add_child(p)
	p.play()
	p.finished.connect(p.queue_free)


func toggle_music() -> void:
	music_on = not music_on
	if music:
		create_tween().tween_property(music, "volume_db", -13.0 if music_on else -60.0, 1.0)


func _process(dt: float) -> void:
	# Ears where you stand, turned like the camera so left and right match the screen.
	if city and city.me and city.cam:
		listener.global_transform = Transform3D(city.cam.global_transform.basis, city.me.global_position + Vector3(0, 1.2, 0))
	if not ready_:
		return
	t += dt
	if city:
		for mv in city.movers:
			if mv.has("hum"):
				mv.hum.pitch_scale = 0.75 + 0.3 * minf(1.0, mv.v / 2.8)
				mv.hum.volume_db = -14.0 + 4.0 * minf(1.0, mv.v / 2.8)
	var me: Vector3 = city.me.position if city and city.me else Vector3(17, 0, 15)
	if t > next.bird:
		var spots := [Vector3(1.5, 2.5, 21.0), Vector3(3.0, 2.5, 27.0), Vector3(11.2, 2.5, 20.5), Vector3(15.5, 2.5, 27.0), Vector3(1.8, 2.5, 23.3)]
		for x in range(-27, 68, 6):
			spots.append(Vector3(x + 0.5, 2.2, 11.62))
		spots.sort_custom(func(a, b): return a.distance_to(me) < b.distance_to(me))
		var at: Vector3 = spots[rng.randi() % 4]
		_one3d(bank.bird[rng.randi() % bank.bird.size()], at, -8.0, rng.randf_range(0.9, 1.15))
		next.bird = t + rng.randf_range(3.0, 9.0)
	if t > next.car:   # passes on a street just out of view, behind the shops or past the park
		var z := -4.0 if rng.randf() < 0.5 else 31.0
		var dir := 1.0 if rng.randf() < 0.5 else -1.0
		var p := _one3d(bank.car[rng.randi() % 2], Vector3(me.x - 25.0 * dir, 0.5, z), -4.0, rng.randf_range(0.9, 1.1))
		p.max_distance = 60.0
		create_tween().tween_property(p, "position:x", me.x + 25.0 * dir, 5.0)
		next.car = t + rng.randf_range(7.0, 16.0)
	if t > next.bell:
		_one3d(bank.bell[0], Vector3(me.x + rng.randf_range(-8, 8), 1.0, 15.5), -14.0, rng.randf_range(0.95, 1.05))
		next.bell = t + rng.randf_range(25.0, 50.0)
	if t > next.horn:
		_one3d(bank.horn[0], Vector3(me.x + rng.randf_range(-30, 30), 1.0, -12.0), -14.0)
		next.horn = t + rng.randf_range(45.0, 90.0)
	if t > next.clink:
		_one3d(bank.clink[rng.randi() % 3], Vector3(rng.randf_range(4.6, 9.3), 0.8, 9.7), -10.0)
		next.clink = t + rng.randf_range(2.5, 7.0)
