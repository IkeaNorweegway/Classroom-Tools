# Math 9 Realm game — Emberdale pack (Chapter 1: Brindle Ford and Highstead). Builds every model as a .glb
# for Godot, plus pack.json (footprint, height, what each model is). Look and units: see kit.py.
#
#   flatpak run org.blender.Blender -b --python scripts/blender/realm_pack.py -- [only=well,mill] [out=/abs/dir]
#
# Footprints come from the Chapter 1 map sketch (one sketch cell = 2 x 2 tiles), in
# _courses/math-9/realm-game/math9-realm-ch1-design-v1.md §9. Terrain tiles are one cell (2 x 2), and ground heights
# match art3d.gd HEIGHT (grass 0.05, path 0.07, water -0.25). Named child parts a game can move:
#   Wheel (mill: turns about z), Crown (trees: sway), Rune_glow (rune stone: recolour grey/gold), *_glow (unlit),
#   *_water (see-through water).
import sys, os, math, json, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, kit
importlib.reload(kit)
from kit import Part, shade, clear, export, args, PAL

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "godot", "story-engine", "assets", "realm", "emberdale")
GRASS_Y, PATH_Y, WATER_Y, GORGE_Y = 0.05, 0.07, -0.25, -4.0

MODELS = {}


def model(name, kind, w, d, note=""):
    def reg(fn):
        MODELS[name] = {"fn": fn, "kind": kind, "w": w, "d": d, "note": note}
        return fn
    return reg


# ─────────────────────────────── shared pieces ───────────────────────────────

def window(p, cx, y, zf, w=0.5, h=0.55, lit=False, frame="timber", side=False):
    """A small cottage window on the +z face at z = zf (or the +x face at x = zf if side)."""
    if side:
        p.box(zf - 0.02, y - 0.06, cx - w / 2 - 0.06, 0.06, h + 0.12, w + 0.12, frame)
        p.box(zf, y, cx - w / 2, 0.05, h, w, "glass")
        p.box(zf, y + h / 2 - 0.025, cx - w / 2, 0.07, 0.05, w, frame)
        p.box(zf - 0.02, y - 0.1, cx - w / 2 - 0.08, 0.12, 0.06, w + 0.16, "fieldstone_dk")
    else:
        p.box(cx - w / 2 - 0.06, y - 0.06, zf - 0.02, w + 0.12, h + 0.12, 0.06, frame)
        p.box(cx - w / 2, y, zf, w, h, 0.05, "glass")
        p.box(cx - 0.025, y, zf, 0.05, h, 0.07, frame)
        p.box(cx - w / 2, y + h / 2 - 0.025, zf, w, 0.05, 0.07, frame)
        p.box(cx - w / 2 - 0.08, y - 0.1, zf - 0.02, w + 0.16, 0.06, 0.12, "fieldstone_dk")


def lit_window(name, cx, y, zf, w=0.5, h=0.55):
    """The warm glow behind a window pane, as its own unlit part (the game can switch it on at night)."""
    g = Part(name + "_glow")
    g.box(cx - w / 2 + 0.03, y + 0.03, zf + 0.055, w - 0.06, h - 0.06, 0.01, "#f3c977")
    return g


def door(p, cx, zf, col="door_green", w=0.7, h=1.3, arch=False, frame="timber"):
    p.box(cx - w / 2 - 0.08, 0, zf - 0.02, w + 0.16, h + 0.08, 0.08, frame)
    p.box(cx - w / 2, 0, zf, w, h, 0.07, col)
    for i in range(1, 3):   # planks
        p.box(cx - w / 2 + i * w / 3 - 0.01, 0.05, zf + 0.07, 0.02, h - 0.1, 0.01, shade(col, -0.25))
    p.box(cx + w / 2 - 0.15, h * 0.48, zf + 0.07, 0.06, 0.06, 0.04, "iron")
    if arch:
        p.box(cx - w / 2 - 0.12, h + 0.08, zf - 0.03, w + 0.24, 0.14, 0.12, "fieldstone_dk")
    p.box(cx - w / 2 - 0.15, 0, zf + 0.02, w + 0.3, 0.06, 0.35, "fieldstone_dk")   # doorstep


def stone_walls(p, W, D, H, col="fieldstone", seed=0):
    """Four dry-stone walls round a W x D footprint (mortar core inside so no gaps show)."""
    p.box(-W / 2 + 0.12, 0, -D / 2 + 0.12, W - 0.24, H - 0.02, D - 0.24, "mortar")
    p.stone_wall(-W / 2, D / 2 - 0.15, W / 2, D / 2 - 0.15, 0, H, col, t=0.3, seed=seed)        # front
    p.stone_wall(W / 2, -D / 2 + 0.15, -W / 2, -D / 2 + 0.15, 0, H, col, t=0.3, seed=seed + 1)  # back
    p.stone_wall(W / 2 - 0.15, D / 2 - 0.3, W / 2 - 0.15, -D / 2 + 0.3, 0, H, col, t=0.3, seed=seed + 2)
    p.stone_wall(-W / 2 + 0.15, -D / 2 + 0.3, -W / 2 + 0.15, D / 2 - 0.3, 0, H, col, t=0.3, seed=seed + 3)


def timber_frame(p, W, D, y0, H, wall="plaster", beam="timber"):
    """A plaster upper storey with dark timber beams (front and sides)."""
    p.box(-W / 2, y0, -D / 2, W, H, D, wall)
    t = 0.09
    for x in [-W / 2, W / 2 - t] + [(-W / 2 + W * i / 3) for i in (1, 2)]:
        p.box(x - 0.01, y0, D / 2 - 0.01, t, H, 0.04, beam)
    p.box(-W / 2 - 0.01, y0, D / 2 - 0.01, W + 0.02, t, 0.05, beam)
    p.box(-W / 2 - 0.01, y0 + H - t, D / 2 - 0.01, W + 0.02, t, 0.05, beam)
    for sx in (-1, 1):   # side posts and a brace
        xs = sx * (W / 2) - (0.03 if sx > 0 else 0.01)
        p.box(xs, y0, -D / 2, 0.04, t, D, beam)
        p.box(xs, y0 + H - t, -D / 2, 0.04, t, D, beam)
        for z in (-D / 2, D / 2 - t, -t / 2):
            p.box(xs, y0, z, 0.04, H, t, beam)


def chimney(p, x, z, base, h, col="fieldstone"):
    p.cbox(x, base, z, 0.45, h, 0.45, col, top=shade(col, -0.2))
    p.cbox(x, base + h, z, 0.55, 0.1, 0.55, shade(col, -0.1))


def grass_tufts(p, n, w, d, y, seed, cols=("grass_dk", "lawn", "leaf2")):
    rng = random.Random(seed)
    for _ in range(n):
        x, z = rng.uniform(-w / 2 + 0.1, w / 2 - 0.1), rng.uniform(-d / 2 + 0.1, d / 2 - 0.1)
        p.cone(x, y, z, rng.uniform(0.06, 0.1), rng.uniform(0.12, 0.22), rng.choice(cols), seg=3, rot=rng.uniform(0, 120))


# ─────────────────────────────── terrain tiles (2 x 2) ───────────────────────────────

def ground(p, y, col, edge=None):
    """A ground slab top at y, with a short skirt so neighbouring heights never show a gap."""
    p.box(-1, y - 0.3, -1, 2, 0.3, 2, edge or shade(col, -0.25), top=col)


@model("t_grass", "terrain", 2, 2, "Prairie grass, a few tufts (seed varies)")
def t_grass(seed=0):
    p = Part("t_grass")
    ground(p, GRASS_Y, "grass")
    grass_tufts(p, 5, 2, 2, GRASS_Y, seed)
    p.done()


@model("t_grass_b", "terrain", 2, 2, "Grass with wildflowers")
def t_grass_b():
    p = Part("t_grass_b")
    ground(p, GRASS_Y, "grass")
    grass_tufts(p, 3, 2, 2, GRASS_Y, 7)
    rng = random.Random(11)
    for _ in range(6):
        x, z = rng.uniform(-0.85, 0.85), rng.uniform(-0.85, 0.85)
        p.cyl(x, GRASS_Y, z, 0.01, 0.16, "leaf_dk", seg=3)
        p.blob(x, GRASS_Y + 0.18, z, 0.04, 0.03, 0.04, rng.choice(["#e9e2f0", "#e8c838", "#c98bc4"]), seg=4, rings=2, jit=0)
    p.done()


@model("t_stubble", "terrain", 2, 2, "Cut canola stubble in gold rows (rows run along x)")
def t_stubble():
    p = Part("t_stubble")
    ground(p, GRASS_Y, "stubble_dk", edge="soil")
    for i in range(5):
        z = -0.8 + i * 0.4
        p.prism([(-1, GRASS_Y), (1, GRASS_Y), (1, GRASS_Y + 0.07), (-1, GRASS_Y + 0.07)], z - 0.08, z + 0.08, "stubble")
        rng = random.Random(i)
        for k in range(6):
            x = -0.9 + k * 0.36 + rng.uniform(-0.05, 0.05)
            p.cone(x, GRASS_Y + 0.07, z, 0.04, 0.1, "stubble", seg=3)
    p.done()


@model("t_canola", "terrain", 2, 2, "Canola in flower (blocks walking)")
def t_canola():
    p = Part("t_canola")
    ground(p, GRASS_Y, "leaf_dk", edge="soil")
    rng = random.Random(3)
    for i in range(4):
        for k in range(4):
            x, z = -0.75 + k * 0.5 + rng.uniform(-0.08, 0.08), -0.75 + i * 0.5 + rng.uniform(-0.08, 0.08)
            p.cyl(x, GRASS_Y, z, 0.05, 0.35, "leaf", seg=4)
            p.blob(x, GRASS_Y + 0.45, z, 0.2, 0.12, 0.2, rng.choice(["canola", shade("canola", 0.12), shade("canola", -0.08)]), seg=5, rings=3, seed=i * 4 + k)
    p.done()


@model("t_path", "terrain", 2, 2, "Packed dirt road or path")
def t_path():
    p = Part("t_path")
    ground(p, PATH_Y, "path", edge="soil")
    rng = random.Random(5)
    for _ in range(5):   # pebbles and wheel ruts
        p.cbox(rng.uniform(-0.8, 0.8), PATH_Y, rng.uniform(-0.8, 0.8), 0.08, 0.03, 0.06, "fieldstone")
    for x in (-0.45, 0.45):
        p.box(x - 0.08, PATH_Y, -1, 0.16, 0.005, 2, shade("path", -0.1))
    p.done()


@model("t_path_edge", "terrain", 2, 2, "Path on the south half, grass on the north half (turn with yaw)")
def t_path_edge():
    p = Part("t_path_edge")
    p.box(-1, PATH_Y - 0.3, 0, 2, 0.3, 1, "soil", top="path")
    p.box(-1, GRASS_Y - 0.3, -1, 2, 0.3, 1, shade("grass", -0.25), top="grass")
    grass_tufts(p, 3, 2, 0.9, GRASS_Y, 9)
    p.done()


# ── footpaths: a narrow, winding dirt ribbon with ragged grass edges and discoloured earth ──
# Every variant starts and ends at the middle of the north/south tile edges with the same slope (0), so
# any two variants (and any corner) join without a step; the game picks one by cell hash to build a path.

def _foot_normals(pts):
    """A unit normal in plan at every centreline point (averaged at the joints, so strips meet watertight)."""
    out = []
    for i in range(len(pts)):
        if i == 0:
            t = (pts[1][0] - pts[0][0], pts[1][1] - pts[0][1])
        elif i == len(pts) - 1:
            t = (pts[-1][0] - pts[-2][0], pts[-1][1] - pts[-2][1])
        else:
            t = (pts[i + 1][0] - pts[i - 1][0], pts[i + 1][1] - pts[i - 1][1])
        n = math.hypot(t[0], t[1]) or 1.0
        out.append((t[1] / n, -t[0] / n))
    return out


def _mix(c1, c2, t):
    """Blend two palette colours or hex strings (t = 0 gives c1)."""
    h1, h2 = PAL.get(c1, c1).lstrip("#"), PAL.get(c2, c2).lstrip("#")
    v = [int(int(h1[i:i + 2], 16) * (1 - t) + int(h2[i:i + 2], 16) * t) for i in (0, 2, 4)]
    return "#%02x%02x%02x" % tuple(v)


def _foot_ribbon(p, pts, nor, hw, spec, rng, y=PATH_Y):
    """The dirt surface: four strips across a mitred ribbon, plus short skirts to the grass.
    Every tile shares ONE base tone ("path"); only a small per-quad shade jitter varies, and the first and last
    segment are exactly the base tone, so any two tiles join without a visible colour seam."""
    frac = (-1.0, -0.34, 0.34, 1.0)
    verts = [[(x + nx * hw * f, z + nz * hw * f) for f in frac] for (x, z), (nx, nz) in zip(pts, nor)]
    last = len(pts) - 2
    for i in range(len(pts) - 1):
        cx = (pts[i][0] + pts[i + 1][0]) / 2
        cz = (pts[i][1] + pts[i + 1][1]) / 2
        end = i in (0, last)
        for k in range(3):
            j = 0.0 if end else rng.uniform(-0.035, 0.035)
            if not end and rng.random() < spec.get("patch", 0.1) * 0.2:   # rare single-quad damp spot, mild
                j -= 0.06
            col = shade("path", j - (0.02 if k in (0, 2) else 0.0))
            p.quad((verts[i][k][0], y, verts[i][k][1]), (verts[i][k + 1][0], y, verts[i][k + 1][1]),
                   (verts[i + 1][k + 1][0], y, verts[i + 1][k + 1][1]), (verts[i + 1][k][0], y, verts[i + 1][k][1]),
                   col, out=(0, 1, 0))
        for k in (0, 3):   # skirts so the 2 cm step down to grass never shows a gap
            p.quad((verts[i][k][0], y, verts[i][k][1]), (verts[i + 1][k][0], y, verts[i + 1][k][1]),
                   (verts[i + 1][k][0], GRASS_Y - 0.005, verts[i + 1][k][1]),
                   (verts[i][k][0], GRASS_Y - 0.005, verts[i][k][1]),
                   shade("path", -0.3), ctr=(cx, (y + GRASS_Y) / 2, cz))


def _foot_dress(p, pts, nor, hw, spec, rng):
    """Pebbles, spilled earth, grass creeping at the edge, lining tufts and the odd flower."""
    def pick():
        i = rng.randrange(len(pts) - 1)
        u = rng.random()
        x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u
        z = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u
        return x, z, nor[i]

    for _ in range(spec.get("pebbles", 4)):
        x, z, (nx, nz) = pick()
        off = rng.uniform(-hw * 0.75, hw * 0.75)
        x, z = x + nx * off, z + nz * off
        if abs(x) < 0.96 and abs(z) < 0.96:
            p.cbox(x, PATH_Y, z, rng.uniform(0.04, 0.09), 0.012, rng.uniform(0.03, 0.07),
                   rng.choice(("fieldstone", "fieldstone_dk", "sand")))

    for _ in range((spec.get("spill", 3) + 1) // 2):   # a few low, irregular scuffs where feet leave the path
        x, z, (nx, nz) = pick()
        side = rng.choice((-1.0, 1.0))
        off = hw + rng.uniform(0.0, 0.08)
        x, z = x + nx * off * side, z + nz * off * side
        if abs(x) < 0.97 and abs(z) < 0.97:
            r0, n_s, rot = rng.uniform(0.035, 0.075), rng.choice((5, 6)), rng.uniform(0, 6.28)
            col = _mix("path", "grass", rng.uniform(0.35, 0.65))
            ring = [(x + r0 * rng.uniform(0.7, 1.25) * math.cos(rot + 2 * math.pi * i / n_s), GRASS_Y + 0.004,
                     z + r0 * rng.uniform(0.7, 1.25) * math.sin(rot + 2 * math.pi * i / n_s)) for i in range(n_s)]
            p.face(ring, col, out=(0, 1, 0))

    for _ in range(spec.get("creep", 4)):   # grass leaning over the path edge
        x, z, (nx, nz) = pick()
        side = rng.choice((-1.0, 1.0))
        off = hw - rng.uniform(0.0, 0.05)
        x, z = x + nx * off * side, z + nz * off * side
        if abs(x) < 0.98 and abs(z) < 0.98:
            p.cone(x, PATH_Y - 0.01, z, rng.uniform(0.045, 0.075), rng.uniform(0.07, 0.14),
                   rng.choice(("grass_dk", "lawn", "leaf2")), seg=3, rot=rng.uniform(0, 120))

    for _ in range(spec.get("lining", 8)):   # the grass lining: tight to both edges, following every bend
        x, z, (nx, nz) = pick()
        side = rng.choice((-1.0, 1.0))
        off = hw + rng.uniform(0.0, 0.09)
        x, z = x + nx * off * side, z + nz * off * side
        if abs(x) < 1.02 and abs(z) < 1.02:
            p.cone(x, GRASS_Y, z, rng.uniform(0.05, 0.09), rng.uniform(0.10, 0.20),
                   rng.choice(("grass_dk", "lawn", "leaf2", "grass")), seg=3, rot=rng.uniform(0, 120))

    for _ in range(spec.get("tufts", 6)):   # looser tufts further out, so the verge is not a clean line
        x, z, (nx, nz) = pick()
        side = rng.choice((-1.0, 1.0))
        off = hw + rng.uniform(0.09, 0.30)
        x, z = x + nx * off * side, z + nz * off * side
        if abs(x) < 1.02 and abs(z) < 1.02:
            p.cone(x, GRASS_Y, z, rng.uniform(0.045, 0.085), rng.uniform(0.08, 0.17),
                   rng.choice(("grass_dk", "lawn", "leaf2", "grass")), seg=3, rot=rng.uniform(0, 120))

    for _ in range(spec.get("flowers", 0)):
        x, z, (nx, nz) = pick()
        side = rng.choice((-1.0, 1.0))
        off = hw + rng.uniform(0.06, 0.25)
        x, z = x + nx * off * side, z + nz * off * side
        if abs(x) < 0.98 and abs(z) < 0.98:
            p.cyl(x, GRASS_Y, z, 0.01, 0.14, "leaf_dk", seg=3)
            p.blob(x, GRASS_Y + 0.16, z, 0.035, 0.03, 0.035,
                   rng.choice(("#e9e2f0", "#e8c838", "#c98bc4")), seg=4, rings=2, jit=0)


def _foot_curve(spec):
    """North edge (z=-1) to south edge (z=+1). x and slope are 0 at both edges, so tiles always join."""
    pts = []
    n = 14
    for i in range(n + 1):
        t = i / n
        s = math.sin(math.pi * t)
        pts.append((spec["a"] * s * s + spec["b"] * s * s * math.cos(math.pi * t), -1.0 + 2.0 * t))
    return pts


def _foot_corner_curve(r, n_arc=9):
    """South edge centre to east edge centre: a straight stub, a rounded quarter turn, another stub."""
    pts = [(0.0, 1.0), (0.0, r)]
    for i in range(1, n_arc + 1):
        th = math.pi + (math.pi / 2.0) * i / n_arc
        pts.append((r + r * math.cos(th), r + r * math.sin(th)))
    pts.append((1.0, 0.0))
    return pts


def _footpath(name, spec):
    p = Part(name)
    ground(p, GRASS_Y, "grass")
    rng = random.Random(spec["seed"])
    pts = _foot_curve(spec)
    nor = _foot_normals(pts)
    _foot_ribbon(p, pts, nor, spec["hw"], spec, rng)
    _foot_dress(p, pts, nor, spec["hw"], spec, rng)
    p.done()


def _footcorner(name, spec):
    p = Part(name)
    ground(p, GRASS_Y, "grass")
    rng = random.Random(spec["seed"])
    pts = _foot_corner_curve(spec["r"])
    nor = _foot_normals(pts)
    _foot_ribbon(p, pts, nor, spec["hw"], spec, rng)
    _foot_dress(p, pts, nor, spec["hw"], spec, rng)
    p.done()


FOOTPATH_SPECS = [
    ("t_footpath", dict(a=0.14, b=0.03, hw=0.32, seed=51, tones=("path", "sand"), patch=0.10,
                        pebbles=4, spill=3, creep=4, lining=8, tufts=6, flowers=0,
                        note="Winding dirt footpath, well trodden")),
    ("t_footpath_2", dict(a=-0.26, b=0.10, hw=0.32, seed=52, tones=("path", "sand"), patch=0.16, pebbles=5, spill=4, creep=4, lining=8, tufts=7, flowers=0,
                          note="Winding dirt footpath, S-bend")),
    ("t_footpath_3", dict(a=0.34, b=-0.12, hw=0.32, seed=53, tones=("path", "path_dk"), patch=0.20,
                          pebbles=6, spill=5, creep=5, lining=9, tufts=8, flowers=0,
                          note="Winding dirt footpath, narrow snake")),
    ("t_footpath_4", dict(a=-0.12, b=0.0, hw=0.32, seed=54, tones=("path", "sand", "path_dk"), patch=0.12, pebbles=6, spill=4, creep=5, lining=7, tufts=6, flowers=2,
                          note="Worn dirt track with flowers at the verge")),
    ("t_footpath_5", dict(a=0.06, b=0.16, hw=0.32, seed=55, tones=("sand", "path"), patch=0.14,
                          pebbles=4, spill=5, creep=4, lining=10, tufts=8, flowers=0,
                          note="Winding dirt footpath, double wiggle")),
    ("t_footpath_6", dict(a=-0.42, b=0.04, hw=0.32, seed=56, tones=("path", "path_dk2", "sand"), patch=0.18,
                          pebbles=7, spill=6, creep=5, lining=9, tufts=9, flowers=0,
                          note="Footpath swinging far west, stony at the edges")),
    ("t_footpath_7", dict(a=0.24, b=0.12, hw=0.32, seed=57, tones=("sand", "path"), patch=0.10, pebbles=5, spill=3, creep=4, lining=8, tufts=7, flowers=3,
                          note="Footpath with wildflowers at the verge")),
    ("t_footpath_8", dict(a=-0.06, b=-0.18, hw=0.32, seed=58, tones=("path", "path_dk"), patch=0.18,
                          pebbles=6, spill=6, creep=5, lining=9, tufts=8, flowers=0,
                          note="Footpath with a slow S")),
    ("t_footpath_9", dict(a=0.44, b=0.0, hw=0.32, seed=59, tones=("path", "sand"), patch=0.14,
                          pebbles=5, spill=4, creep=4, lining=10, tufts=8, flowers=0,
                          note="Footpath with one strong bend")),
    ("t_footpath_10", dict(a=0.10, b=0.08, hw=0.32, seed=60, tones=("path", "sand", "path_dk"), patch=0.16,
                           pebbles=9, spill=8, creep=5, lining=10, tufts=9, flowers=1,
                           note="Scruffy, stony footpath with spilled edges")),
]

CORNER_SPECS = [
    ("t_footpath_corner", dict(r=0.52, hw=0.32, seed=71, tones=("path", "sand"), patch=0.12,
                               pebbles=6, spill=4, creep=5, lining=10, tufts=8, flowers=0,
                               note="Footpath corner, rounded turn (joins south and east edges; turn with yaw)")),
    ("t_footpath_corner_b", dict(r=0.68, hw=0.32, seed=72, tones=("path", "path_dk", "sand"), patch=0.18, pebbles=7, spill=5, creep=5, lining=10, tufts=8, flowers=1,
                                 note="Footpath corner, wide rounded turn (joins south and east; turn with yaw)")),
]

for _name, _spec in FOOTPATH_SPECS:
    model(_name, "terrain", 2, 2, _spec["note"])(lambda name=_name, spec=_spec: _footpath(name, spec))
for _name, _spec in CORNER_SPECS:
    model(_name, "terrain", 2, 2, _spec["note"])(lambda name=_name, spec=_spec: _footcorner(name, spec))


@model("t_water", "terrain", 2, 2, "River water (blocks walking)")
def t_water():
    p = Part("t_water")
    p.box(-1, WATER_Y - 0.5, -1, 2, 0.1, 2, "soil", top=shade("river", -0.35))   # river bed
    w = Part("t_water_water")
    w.box(-1, WATER_Y - 0.05, -1, 2, 0.05, 2, "river", top="water")
    rng = random.Random(1)
    for _ in range(3):
        w.cbox(rng.uniform(-0.7, 0.7), WATER_Y + 0.002, rng.uniform(-0.7, 0.7), rng.uniform(0.3, 0.6), 0.005, 0.04, "water_hi")
    p.done(); w.done()


@model("t_bank", "terrain", 2, 2, "Grass bank on the north half sloping into water on the south half")
def t_bank():
    p = Part("t_bank")
    p.box(-1, GRASS_Y - 0.3, -1, 2, 0.3, 0.9, shade("grass", -0.25), top="grass")
    p.quad((-1, GRASS_Y, -0.1), (1, GRASS_Y, -0.1), (1, WATER_Y - 0.3, 0.5), (-1, WATER_Y - 0.3, 0.5), "sand", out=(0, 1, 1))
    rng = random.Random(4)
    for _ in range(4):
        p.blob(rng.uniform(-0.8, 0.8), WATER_Y + 0.02, rng.uniform(0.0, 0.3), 0.12, 0.07, 0.1, "fieldstone_dk", seg=5, rings=3, seed=rng.randint(0, 99))
    p.box(-1, WATER_Y - 0.5, 0.3, 2, 0.1, 0.7, "soil", top=shade("river", -0.35))
    grass_tufts(p, 3, 2, 0.8, GRASS_Y, 21)
    w = Part("t_bank_water")
    w.box(-1, WATER_Y - 0.05, -0.2, 2, 0.05, 1.2, "river", top="water")
    p.done(); w.done()


@model("t_ford", "terrain", 2, 2, "Shallow ford: flat stones across the water (walkable)")
def t_ford():
    p = Part("t_ford")
    p.box(-1, WATER_Y - 0.5, -1, 2, 0.1, 2, "soil", top=shade("river", -0.3))
    rng = random.Random(8)
    for i in range(4):
        for k in range(3):
            x, z = -0.7 + k * 0.7 + rng.uniform(-0.06, 0.06), -0.75 + i * 0.5 + rng.uniform(-0.05, 0.05)
            p.cyl(x, WATER_Y - 0.4, z, rng.uniform(0.24, 0.3), 0.47, rng.choice(["fieldstone", "fieldstone_dk", "stone"]), seg=6, rot=rng.uniform(0, 60))
    w = Part("t_ford_water")
    w.box(-1, WATER_Y - 0.05, -1, 2, 0.05, 2, "river", top="water")
    for i in range(3):
        w.cbox(rng.uniform(-0.6, 0.6), WATER_Y + 0.002, rng.uniform(-0.8, 0.8), 0.4, 0.005, 0.03, "foam")
    p.done(); w.done()


def strata(p, x0, x1, ztop, zbot, yt, yb, seed=0):
    """A striped badland rock face from (ztop, yt) at the lip down to (zbot, yb), across x0..x1, facing +z."""
    bands = ["rock_tan", "rock_red", "rock_pale", "rock_red", "rock_dk", "rock_tan", "rock_red"]
    rng = random.Random(seed)
    n = 7
    for i in range(n):
        t0, t1 = i / n, (i + 1) / n
        ya, yb2 = yt + (yb - yt) * t0, yt + (yb - yt) * t1
        za, zb = ztop + (zbot - ztop) * t0, ztop + (zbot - ztop) * t1
        j = rng.uniform(-0.06, 0.06)
        p.quad((x0, ya, za + j), (x1, ya, za + j), (x1, yb2, zb), (x0, yb2, zb), bands[i % len(bands)], out=(0, 0.3, 1))
        p.quad((x0, ya, za + j), (x1, ya, za + j), (x1, ya + 0.0, za + j - 0.06), (x0, ya, za + j - 0.06), shade(bands[i % len(bands)], -0.15), out=(0, 1, 0))


def solid_behind(p, ztop, zbot, ytop):
    """Fill the rock behind a gorge face (sides and back), so the tile is solid from every angle."""
    for x, o in ((-1, -1), (1, 1)):
        p.quad((x, ytop, -1), (x, ytop, ztop), (x, GORGE_Y, zbot), (x, GORGE_Y, -1), "rock_dk", out=(o, 0, 0))
    p.quad((-1, ytop, -1), (1, ytop, -1), (1, GORGE_Y, -1), (-1, GORGE_Y, -1), "rock_dk", out=(0, 0, -1))


@model("t_gorge_edge", "terrain", 2, 2, "Gorge wall: grass lip at the north edge, striped rock dropping 4 to the south (blocks)")
def t_gorge_edge():
    p = Part("t_gorge_edge")
    p.box(-1, GRASS_Y - 0.3, -1, 2, 0.3, 0.35, "rock_tan", top="grass")
    strata(p, -1, 1, -0.65, 1.0, GRASS_Y, GORGE_Y, seed=1)
    solid_behind(p, -0.65, 1.0, GRASS_Y - 0.3)
    for x in (-0.6, 0.3):   # a ledge or two
        p.box(x, -1.6, 0.0, 0.5, 0.12, 0.25, "rock_pale")
    p.box(-1, GORGE_Y - 0.5, -1, 2, 0.5, 2, "rock_dk")   # solid core so nothing shows through from below
    p.done()


@model("t_gorge_corner_out", "terrain", 2, 2, "Gorge wall turning a corner (outside corner, lip on north and west)")
def t_gorge_corner_out():
    p = Part("t_gorge_corner_out")
    p.box(-1, GRASS_Y - 0.3, -1, 0.35, 0.3, 2, "rock_tan", top="grass")
    p.box(-0.65, GRASS_Y - 0.3, -1, 1.65, 0.3, 0.35, "rock_tan", top="grass")
    # two faces meeting along the diagonal: south-facing and east-facing, each a fan of bands
    bands = ["rock_tan", "rock_red", "rock_pale", "rock_red", "rock_dk", "rock_tan", "rock_red"]
    n = 7
    for i in range(n):
        t0, t1 = i / n, (i + 1) / n
        ya, yb = GRASS_Y + (GORGE_Y - GRASS_Y) * t0, GRASS_Y + (GORGE_Y - GRASS_Y) * t1
        a, b = -0.65 + 1.65 * t0, -0.65 + 1.65 * t1
        c = bands[i]
        p.quad((a, ya, a), (1, ya, a), (1, yb, b), (b, yb, b), c, out=(0, 0.3, 1))
        p.quad((a, ya, 1), (a, ya, a), (b, yb, b), (b, yb, 1), shade(c, -0.08), out=(1, 0.3, 0))
    p.quad((-1, GRASS_Y - 0.3, 1), (-0.65, GRASS_Y - 0.3, 1), (1, GORGE_Y, 1), (-1, GORGE_Y, 1), "rock_dk", out=(0, 0, 1))
    p.quad((1, GRASS_Y - 0.3, -1), (1, GRASS_Y - 0.3, -0.65), (1, GORGE_Y, 1), (1, GORGE_Y, -1), "rock_dk", out=(1, 0, 0))
    p.box(-1, GORGE_Y - 0.5, -1, 2, 0.5, 2, "rock_dk")
    p.done()


@model("t_gorge_corner_in", "terrain", 2, 2, "Gorge wall inside corner (grass on all but the south-east quarter)")
def t_gorge_corner_in():
    p = Part("t_gorge_corner_in")
    p.box(-1, GRASS_Y - 0.3, -1, 2, 0.3, 1.35, "rock_tan", top="grass")
    p.box(-1, GRASS_Y - 0.3, 0.35, 1.35, 0.3, 0.65, "rock_tan", top="grass")
    bands = ["rock_tan", "rock_red", "rock_pale", "rock_red", "rock_dk", "rock_tan", "rock_red"]
    n = 7
    for i in range(n):
        t0, t1 = i / n, (i + 1) / n
        ya, yb = GRASS_Y + (GORGE_Y - GRASS_Y) * t0, GRASS_Y + (GORGE_Y - GRASS_Y) * t1
        a, b = 0.35 + 0.65 * t0, 0.35 + 0.65 * t1
        p.quad((a, ya, a), (1, ya, a), (1, yb, b), (b, yb, b), bands[i], out=(0, 0.3, 1))
        p.quad((a, ya, 1), (a, ya, a), (b, yb, b), (b, yb, 1), shade(bands[i], -0.08), out=(1, 0.3, 0))
    p.box(-1, GORGE_Y - 0.5, -1, 2, 0.5, 2, "rock_dk")
    p.done()


@model("t_gorge_floor", "terrain", 2, 2, "Gorge bottom: river 4 below the prairie, boulders (blocks)")
def t_gorge_floor():
    p = Part("t_gorge_floor")
    p.box(-1, GORGE_Y - 0.6, -1, 2, 0.3, 2, "rock_dk", top=shade("river", -0.4))
    rng = random.Random(6)
    for _ in range(3):
        p.blob(rng.uniform(-0.7, 0.7), GORGE_Y - 0.1, rng.uniform(-0.7, 0.7), 0.25, 0.18, 0.22, rng.choice(["rock_red", "rock_tan"]), seg=5, rings=3, seed=rng.randint(0, 99))
    w = Part("t_gorge_floor_water")
    w.box(-1, GORGE_Y - 0.25, -1, 2, 0.05, 2, "river", top="water")
    p.done(); w.done()


@model("t_waterfall", "terrain", 2, 2, "The river falling over the gorge lip (north edge water, sheet down to the floor)")
def t_waterfall():
    p = Part("t_waterfall")
    p.box(-1, WATER_Y - 0.5, -1, 2, 0.25, 0.4, "rock_tan", top=shade("river", -0.3))
    strata(p, -1, 1, -0.6, 0.9, WATER_Y - 0.25, GORGE_Y, seed=4)
    solid_behind(p, -0.6, 0.9, WATER_Y - 0.5)
    p.box(-1, GORGE_Y - 0.5, -1, 2, 0.5, 2, "rock_dk")
    w = Part("t_waterfall_water")
    w.box(-0.8, WATER_Y - 0.05, -1, 1.6, 0.05, 0.45, "river", top="water")
    n = 6
    for i in range(n):   # the falling sheet, a little in front of the rock
        t0, t1 = i / n, (i + 1) / n
        ya, yb = WATER_Y + (GORGE_Y - WATER_Y) * t0, WATER_Y + (GORGE_Y - WATER_Y) * t1
        za, zb = -0.55 + 1.45 * t0 + 0.05, -0.55 + 1.45 * t1 + 0.05
        w.quad((-0.7, ya, za), (0.7, ya, za), (0.75, yb, zb), (-0.75, yb, zb), "water_hi" if i % 2 else "water", out=(0, 0.3, 1))
    w.cbox(0, GORGE_Y - 0.2, 0.9, 1.7, 0.08, 0.4, "foam")
    p.done(); w.done()


@model("t_far_bank", "terrain", 2, 2, "The far bank of the gorge: drier grass, scattered stones")
def t_far_bank():
    p = Part("t_far_bank")
    ground(p, GRASS_Y, "#9aa86f")
    grass_tufts(p, 4, 2, 2, GRASS_Y, 31, cols=("stubble_dk", "grass_dk", "#a8b277"))
    p.blob(0.4, GRASS_Y, -0.3, 0.14, 0.08, 0.12, "fieldstone_dk", seg=5, rings=3, seed=2)
    p.done()


def brick_square(name, seed, tones):
    """Freshly laid brick paving in running bond: crisp joints, every brick whole."""
    p = Part(name)
    p.box(-1, 0.14 - 0.3, -1, 2, 0.3, 2, "fieldstone_dk", top="mortar")
    rng = random.Random(seed)
    bw, bh, gap = 0.44, 0.22, 0.025
    for row in range(9):
        z0 = -1 + row * bh
        x = -1 - (bw / 2 if row % 2 else 0.0)   # running bond: alternate rows are offset by half a brick
        while x < 1:
            x0, x1 = max(-1.0, x), min(1.0, x + bw - gap)
            if x1 - x0 > 0.07:
                col = rng.choice(tones)
                p.box(x0 + 0.004, 0.14, z0 + 0.004, x1 - x0 - 0.008, 0.015, bh - gap - 0.008,
                      col, top=shade(col, rng.choice((-0.02, 0.02, 0.03))))
            x += bw
    p.done()


@model("t_square", "terrain", 2, 2, "Market square: freshly laid red brick paving (walkable)")
def t_square():
    brick_square("t_square", 12, ("brick", "brick", "brick_dk", "brick_lt"))


@model("t_square_b", "terrain", 2, 2, "Market square: freshly laid buff brick paving (walkable)")
def t_square_b():
    brick_square("t_square_b", 23, ("brick_pale", "sand", "brick_lt"))


@model("t_square_c", "terrain", 2, 2, "Market square: freshly laid mixed red and buff brick paving (walkable)")
def t_square_c():
    brick_square("t_square_c", 34, ("brick", "brick_lt", "brick_pale", "brick_dk"))


def cobble_square(name, seed, tones, moss=10, weeds=6):
    """Weathered cobblestones packed on a sand bed: domed stones, a few missing, moss and weeds in the joints."""
    p = Part(name)
    p.box(-1, 0.12 - 0.3, -1, 2, 0.3, 2, "sand", top=shade("soil", -0.2))
    rng = random.Random(seed)
    n = 8
    sp = 2.0 / n
    for i in range(n):
        for j in range(n):
            fixed = random.Random(100 + i * 31 + j)   # stone positions are shared, so any mix of variants tiles
            r = fixed.uniform(0.12, 0.145)
            cx = -1 + (i + 0.5) * sp + fixed.uniform(-0.018, 0.018)
            cz = -1 + (j + 0.5) * sp + fixed.uniform(-0.018, 0.018)
            if rng.random() < 0.045:   # a missing stone: the sand bed shows
                continue
            col = rng.choice(tones)
            ry = rng.uniform(0.018, 0.028)
            p.blob(cx, 0.12 + 0.35 * ry, cz, r, ry, r * fixed.uniform(0.85, 1.0), col,
                   seg=rng.choice((5, 6)), rings=2, jit=0.06, seed=100 + i * 31 + j, flat_bottom=True)
    for _ in range(moss):
        moss_patch(p, rng.uniform(-0.95, 0.95), 0.15, rng.uniform(-0.95, 0.95), rng.uniform(0.04, 0.09),
                   seed=rng.randint(0, 99))
    for _ in range(weeds):
        p.cone(rng.uniform(-0.95, 0.95), 0.145, rng.uniform(-0.95, 0.95), rng.uniform(0.04, 0.06),
               rng.uniform(0.07, 0.16), rng.choice(("grass_dk", "lawn", "leaf2")), seg=3, rot=rng.uniform(0, 120))
    p.done()


@model("t_cobble", "terrain", 2, 2, "Market square: weathered grey cobblestones, mossy joints (walkable)")
def t_cobble():
    cobble_square("t_cobble", 41, ("fieldstone", "fieldstone_dk", "stone", "#b0a693"), moss=8, weeds=4)


@model("t_cobble_b", "terrain", 2, 2, "Market square: weathered warm-toned cobblestones (walkable)")
def t_cobble_b():
    cobble_square("t_cobble_b", 52, ("rock_tan", "stone", "sand", "#c2a98c"), moss=6, weeds=5)


@model("t_cobble_c", "terrain", 2, 2, "Market square: weathered dark cobblestones, more moss and weeds (walkable)")
def t_cobble_c():
    cobble_square("t_cobble_c", 63, ("fieldstone_dk", "rock_dk", "fieldstone", "#8f8578"), moss=12, weeds=7)


# ─────────────────────────────── Realm forest set (2026-11-09) ───────────────────────────────
# A dark, cramped enchanted forest at permanent dusk. Deep blue-greens, dark bark, and a few luminous "*_glow" parts.
from mathutils import Vector

FS = "Realm forest set, 2026-11-09. "


def limb(p, a, b, ra, rb, c, seg=4, rot=0.4):
    """A tapered prism from point a to point b (radius ra to rb; rb = 0 makes a point). Branches, roots, posts."""
    a, b = Vector(a), Vector(b)
    d = (b - a).normalized()
    ref = Vector((0, 1, 0)) if abs(d.y) < 0.9 else Vector((1, 0, 0))
    u = d.cross(ref).normalized()
    v = d.cross(u)
    ring = lambda ctr, r: [tuple(ctr + (u * math.cos(2 * math.pi * i / seg + rot) + v * math.sin(2 * math.pi * i / seg + rot)) * r) for i in range(seg)]
    lo, hi = ring(a, ra), ring(b, rb)
    for i in range(seg):
        j = (i + 1) % seg
        f = (Vector(lo[i]) + Vector(lo[j]) + Vector(hi[i]) + Vector(hi[j])) / 4
        ctr = tuple(a + d * (f - a).dot(d))
        if rb > 0:
            p.quad(lo[i], lo[j], hi[j], hi[i], c, ctr)
        else:
            p.tri(lo[i], lo[j], tuple(b), c, ctr)


def litter(p, n, w, d, y, seed, cols, size=(0.06, 0.13)):
    """Flat fallen leaves: small turned quads lying on the ground."""
    rng = random.Random(seed)
    for _ in range(n):
        x, z = rng.uniform(-w / 2 + 0.1, w / 2 - 0.1), rng.uniform(-d / 2 + 0.1, d / 2 - 0.1)
        s, t = rng.uniform(*size), rng.uniform(0, math.pi)
        c, sn = math.cos(t), math.sin(t)
        pts = [(x + c * s - sn * s * 0.6, y + 0.004, z + sn * s + c * s * 0.6), (x + c * s + sn * s * 0.6, y + 0.004, z + sn * s - c * s * 0.6),
               (x - c * s + sn * s * 0.6, y + 0.004, z - sn * s - c * s * 0.6), (x - c * s - sn * s * 0.6, y + 0.004, z - sn * s + c * s * 0.6)]
        p.face(pts, rng.choice(cols), out=(0, 1, 0))


def ground1(p, col, edge=None):
    """A 1 x 1 ground tile, top at GRASS_Y, solid underneath."""
    p.box(-0.5, GRASS_Y - 0.3, -0.5, 1, 0.3, 1, edge or shade(col, -0.35), top=col)


def moss_patch(p, x, y, z, r, col="moss", seed=0):
    p.blob(x, y, z, r, r * 0.35, r * 0.8, col, seg=5, rings=2, jit=0.1, seed=seed)


def mushroom(p, x, y, z, h, r, stem="#d8d2c0", cap="#cfc6b0"):
    p.cyl(x, y, z, r * 0.3, h, stem, seg=3, top=False)
    p.cone(x, y + h * 0.85, z, r, h * 0.55, cap, seg=5)


# ── terrain tiles, 1 x 1 ──

def floor_tile(name, seed, mush=0):
    p = Part(name)
    ground1(p, "moss_dk")
    rng = random.Random(seed)
    litter(p, 8 - mush * 2, 1, 1, GRASS_Y, seed, ["bark", "bark_dk", "#4d4a30", "leafy", "moss"])
    for i in range(2 - (1 if mush else 0)):
        a = rng.uniform(0, 180)
        p.at(rng.uniform(-0.25, 0.25), 0, rng.uniform(-0.25, 0.25), yaw=a)
        p.cbox(0, GRASS_Y, 0, rng.uniform(0.35, 0.5), 0.05, 0.07, "bark_dk", top="bark")
    p.reset()
    for i in range(4 - 2 * (1 if mush else 0)):
        p.cone(rng.uniform(-0.4, 0.4), GRASS_Y, rng.uniform(-0.4, 0.4), 0.07, rng.uniform(0.07, 0.13), rng.choice(["moss", "leafy"]), seg=3, rot=rng.uniform(0, 120))
    for i in range(mush):
        mushroom(p, rng.uniform(-0.3, 0.3), GRASS_Y, rng.uniform(-0.3, 0.3), 0.07, 0.05, cap=rng.choice(["#cfc6b0", "#bdb8a8"]))
    p.done()


@model("f_floor", "terrain", 1, 1, FS + "Forest floor: dark moss, leaf litter, a root or two")
def f_floor():
    floor_tile("f_floor", 3)


@model("f_floor_b", "terrain", 1, 1, FS + "Forest floor variant with a few tiny pale mushrooms")
def f_floor_b():
    floor_tile("f_floor_b", 8, mush=2)


def clear_tile(name, seed, flowers=0):
    p = Part(name)
    ground1(p, "clear_grass")
    rng = random.Random(seed)
    for i in range(4 if flowers else 6):
        p.cone(rng.uniform(-0.4, 0.4), GRASS_Y, rng.uniform(-0.4, 0.4), rng.uniform(0.05, 0.08), rng.uniform(0.1, 0.2),
               rng.choice(["clear_grass_dk", "#5a7c52", "leafy"]), seg=3, rot=rng.uniform(0, 120))
    for i in range(flowers):
        x, z = rng.uniform(-0.35, 0.35), rng.uniform(-0.35, 0.35)
        p.cone(x, GRASS_Y, z, 0.012, 0.13, "leafy", seg=3)
        p.blob(x, GRASS_Y + 0.15, z, 0.035, 0.03, 0.035, rng.choice(["glow_violet", "#a98ae0"]), seg=4, rings=2, jit=0)
    p.done()


@model("f_clear", "terrain", 1, 1, FS + "Clearing grass: darker and bluer than the prairie, a few tufts")
def f_clear():
    clear_tile("f_clear", 5)


@model("f_clear_b", "terrain", 1, 1, FS + "Clearing grass with tiny violet flowers")
def f_clear_b():
    clear_tile("f_clear_b", 9, flowers=3)


@model("f_path_core", "terrain", 1, 1, FS + "Centre of a narrow dirt path, a 0.62 patch at PATH_Y with no ground under it (draw over f_clear or f_floor)")
def f_path_core():
    p = Part("f_path_core")
    rng = random.Random(4)
    h, y = 0.31, PATH_Y
    ch = [rng.uniform(0.03, 0.09) for _ in range(4)]
    pts = [(-h + ch[0], -h), (h - ch[1], -h), (h, -h + ch[1]), (h, h - ch[2]), (h - ch[2], h), (-h + ch[3], h), (-h, h - ch[3]), (-h, -h + ch[0])]
    for i in range(8):
        a, b = pts[i], pts[(i + 1) % 8]
        p.tri((0, y, 0), (b[0], y, b[1]), (a[0], y, a[1]), "path_dk" if i % 2 else "path_dk2", out=(0, 1, 0))
        p.quad((a[0], y - 0.03, a[1]), (b[0], y - 0.03, b[1]), (b[0], y, b[1]), (a[0], y, a[1]), "path_dk2", ctr=(0, y - 0.02, 0))
    p.blob(-0.12, y, 0.08, 0.04, 0.025, 0.035, "#8a8478", seg=5, rings=2, jit=0.1, seed=1)
    p.blob(0.14, y, -0.1, 0.03, 0.02, 0.03, "#7a756a", seg=4, rings=2, jit=0.1, seed=2)
    p.done()


@model("f_path_arm", "terrain", 1, 1, FS + "Path arm from the core (z = +0.31) to the tile edge (z = +0.5); turn with yaw. No ground under it")
def f_path_arm():
    p = Part("f_path_arm")
    y = PATH_Y
    p.box(-0.31, y - 0.03, 0.31, 0.62, 0.03, 0.19, "path_dk2", top="path_dk")
    p.box(-0.1, y, 0.31, 0.12, 0.003, 0.19, "path_dk2")
    p.blob(0.17, y, 0.4, 0.03, 0.02, 0.03, "#8a8478", seg=4, rings=2, jit=0.1, seed=3)
    p.done()


# ── forest fill ──

def fir(p, x, z, h, rb, cols, rng, tiers=4, seg=7, trunk="bark_dk", y0=0.0):
    p.cyl(x, y0, z, 0.1 * min(1.4, h / 4), h * 0.4, trunk, seg=5, r_top=0.05, top=False)
    for i in range(tiers):
        yb = y0 + h * (0.17 + 0.58 * i / tiers)
        ht = (y0 + h - yb) * (1.0 if i == tiers - 1 else 0.62)
        p.cone(x, yb, z, rb * (1 - 0.8 * i / tiers), ht, cols[(i + int(x * 7)) % len(cols)], seg=seg, rot=rng.uniform(0, 60))


def roots(p, x, z, r, n, rng, col="bark_dk"):
    a0 = rng.uniform(0, 6)
    for i in range(n):
        a = a0 + 2 * math.pi * i / n + rng.uniform(-0.3, 0.3)
        L = rng.uniform(0.3, 0.5)
        limb(p, (x + r * 0.6 * math.cos(a), 0.2, z + r * 0.6 * math.sin(a)), (x + (r + L) * math.cos(a), 0.0, z + (r + L) * math.sin(a)), 0.09, 0.03, col, seg=3)


def broad(p, x, z, h, r, cols, rng, seg=7):
    limb(p, (x, 0, z), (x + rng.uniform(-0.05, 0.05), h * 0.65, z), 0.14, 0.09, "bark_dk", seg=5)
    p.blob(x, h * 0.78, z, r, r * 0.62, r, cols[0], seg=seg, rings=3, jit=0.12, seed=int(x * 10 + z * 3) & 255)
    p.blob(x + r * 0.3, h * 0.66, z - r * 0.2, r * 0.7, r * 0.45, r * 0.7, cols[1 % len(cols)], seg=6, rings=3, jit=0.1, seed=int(z * 7) & 255)


def forest2(name, seed, nfir, spots, hs):
    p = Part(name)
    rng = random.Random(seed)
    p.box(-0.95, 0, -0.95, 1.9, 0.1, 1.9, "moss_dk", top="moss")
    cols = [["fir", "fir2", "fir_dk"], ["fir_dk", "fir", "fir2"], ["fir2", "fir_dk", "fir"]][seed % 3]
    for i, (x, z) in enumerate(spots[:nfir]):
        fir(p, x, z, hs[i], rng.uniform(0.62, 0.72), cols, rng)
        roots(p, x, z, 0.1, 2, rng)
    bx, bz = spots[nfir]
    broad(p, bx, bz, 4.1, 0.85, ["leafy", "fir2"], rng, seg=8)
    roots(p, bx, bz, 0.14, 3, rng)
    for i in range(5):
        moss_patch(p, rng.uniform(-0.8, 0.8), 0.08, rng.uniform(-0.8, 0.8), rng.uniform(0.12, 0.2), rng.choice(["moss", "leafy"]), seed=i + seed)
    p.done()


@model("forest_2", "prop", 2, 2, FS + "Dense 2x2 forest clump: four dark firs and a broad crown, closed canopy 3.5-4.5 high")
def forest_2():
    forest2("forest_2", 1, 4, [(-0.5, -0.5), (0.5, -0.45), (-0.45, 0.5), (0.5, 0.5), (0.0, 0.0)], [4.0, 4.4, 3.6, 4.2])


@model("forest_2b", "prop", 2, 2, FS + "Forest clump variant b")
def forest_2b():
    forest2("forest_2b", 2, 3, [(-0.5, 0.45), (0.55, -0.5), (0.0, 0.1), (-0.35, -0.5)], [4.5, 3.8, 4.1])


@model("forest_2c", "prop", 2, 2, FS + "Forest clump variant c")
def forest_2c():
    forest2("forest_2c", 3, 4, [(-0.55, -0.4), (0.4, -0.55), (-0.3, 0.55), (0.55, 0.35), (0.05, -0.05)], [3.7, 4.3, 4.0, 3.5])


def forest4(name, seed):
    p = Part(name)
    rng = random.Random(seed)
    p.box(-1.95, 0, -1.95, 3.9, 0.1, 3.9, "moss_dk", top="moss")
    cols = ["fir", "fir2", "fir_dk"]
    cells = [(i, j) for i in (-1, 0, 1) for j in (-1, 0, 1)]
    rng.shuffle(cells)
    for n, (i, j) in enumerate(cells):
        x, z = i * 1.2 + rng.uniform(-0.2, 0.2), j * 1.2 + rng.uniform(-0.2, 0.2)
        if n < 2:
            broad(p, x, z, 4.6, 0.9, ["leafy", "fir2"], rng)
        elif n < 4:
            fir(p, x, z, rng.uniform(5.8, 6.2), 0.85, cols, rng, tiers=5, seg=6)
        else:
            fir(p, x, z, rng.uniform(4.0, 5.2), 0.85, cols, rng, tiers=4, seg=6)
        roots(p, x, z, 0.1, 2, rng)
    for k in range(5):
        moss_patch(p, rng.uniform(-1.7, 1.7), 0.08, rng.uniform(-1.7, 1.7), rng.uniform(0.15, 0.25), "moss", seed=k + seed)
    p.done()


@model("forest_4", "prop", 4, 4, FS + "A 4x4 mass of nine trees, closed canopy 4-6 high with a couple of taller spires (one merged model)")
def forest_4():
    forest4("forest_4", 11)


@model("forest_4b", "prop", 4, 4, FS + "4x4 forest mass, variant b")
def forest_4b():
    forest4("forest_4b", 23)


# ── single trees ──

@model("tree_fir_dark", "prop", 1, 1, FS + "A narrow dark fir, about 3.5 high")
def tree_fir_dark():
    p = Part("tree_fir_dark")
    rng = random.Random(2)
    fir(p, 0, 0, 3.5, 0.45, ["fir", "fir2", "fir_dk"], rng, tiers=5)
    roots(p, 0, 0, 0.1, 3, rng)
    moss_patch(p, 0.1, 0.05, 0.1, 0.15, "moss", seed=2)
    p.done()


@model("tree_oak_old", "prop", 2, 2, FS + "A gnarled old oak about 4 high, mossy trunk ('tree_oak_old_Crown' sways)")
def tree_oak_old():
    p = Part("tree_oak_old")
    rng = random.Random(6)
    limb(p, (0, 0, 0), (0.06, 0.9, 0.02), 0.34, 0.26, "bark_dk", seg=6)
    limb(p, (0.06, 0.9, 0.02), (-0.04, 1.8, 0.06), 0.26, 0.2, "moss", seg=6)
    limb(p, (-0.04, 1.8, 0.06), (0.05, 2.5, 0), 0.2, 0.16, "bark", seg=6)
    limb(p, (0, 2.0, 0), (0.6, 2.7, 0.2), 0.1, 0.05, "bark_dk", seg=4)
    limb(p, (0, 2.1, 0), (-0.6, 2.8, -0.2), 0.1, 0.05, "bark_dk", seg=4)
    roots(p, 0, 0, 0.3, 5, rng)
    p.at(0, 0, 0).reset()
    moss_patch(p, 0.2, 0.12, 0.3, 0.22, "moss", seed=1)
    p.done()
    c = Part("tree_oak_old_Crown", origin=(0, 2.5, 0))
    c.blob(0, 3.3, 0, 1.0, 0.75, 1.0, "leafy", seg=8, rings=4, jit=0.12, seed=6)
    for (x, y, z, r, col) in [(-0.7, 3.1, 0.2, 0.55, "fir2"), (0.65, 3.2, -0.3, 0.6, "leafy"), (0.1, 3.0, 0.7, 0.5, "fir2")]:
        c.blob(x, y, z, r, r * 0.7, r, col, seg=6, rings=3, jit=0.1, seed=int(x * 9))
    c.done()


@model("tree_dead", "prop", 1, 1, FS + "A twisted bare tree, pale grey-brown, about 3 high")
def tree_dead():
    p = Part("tree_dead")
    rng = random.Random(7)
    pale, pale2 = "#8a8178", "#766d63"
    pts = [(0, 0, 0), (0.05, 0.9, 0.02), (-0.1, 1.7, 0.1), (0.08, 2.5, 0.0)]
    rs = [0.16, 0.11, 0.07, 0.03]
    for i in range(3):
        limb(p, pts[i], pts[i + 1], rs[i], rs[i + 1], pale if i % 2 == 0 else pale2, seg=4)
    for (a, ang, L, y) in [(0, 0.5, 0.7, 1.2), (1, 3.2, 0.8, 1.6), (2, 1.8, 0.6, 2.2), (0, 4.6, 0.6, 0.9), (1, 5.4, 0.55, 2.0)]:
        base = Vector(pts[a]).lerp(Vector(pts[a + 1]), 0.5)
        base.y = y
        tip = base + Vector((math.cos(ang) * L, rng.uniform(0.35, 0.55), math.sin(ang) * L))
        limb(p, tuple(base), tuple(tip), 0.04, 0.0, pale2, seg=3)
        mid = Vector(base).lerp(tip, 0.6)
        limb(p, tuple(mid), tuple(mid + Vector((math.cos(ang + 0.9) * 0.3, 0.25, math.sin(ang + 0.9) * 0.3))), 0.02, 0.0, pale, seg=3)
    roots(p, 0, 0, 0.12, 3, rng, col=pale2)
    p.done()


@model("tree_ancient", "prop", 4, 4, FS + "The huge old landmark tree, about 7 high: thick trunk, roots, hanging lichen; teal moss patches on the trunk are 'Moss_glow'")
def tree_ancient():
    p = Part("tree_ancient")
    rng = random.Random(12)
    R0, R1, H = 0.95, 0.72, 4.4
    p.cyl(0, 0, 0, R0, H, "bark", seg=8, r_top=R1, top=False, rot=0)
    p.cyl(0, 0, 0, R0 * 1.01, 1.3, "bark_dk", seg=8, r_top=R0 * 0.88, top=False, rot=0)
    for i in range(5):
        a = 2 * math.pi * i / 5 + 0.4
        limb(p, (0.7 * math.cos(a), 1.0, 0.7 * math.sin(a)), (1.85 * math.cos(a), 0.0, 1.85 * math.sin(a)), 0.3, 0.07, "bark_dk" if i % 2 else "bark", seg=4)
    for (x, y, z, r, col) in [(0, 5.5, 0, 1.55, "fir"), (-1.1, 5.0, 0.5, 1.0, "fir2"), (1.1, 5.1, -0.4, 1.0, "fir_dk"), (0.3, 6.1, 0.5, 0.95, "fir2"), (-0.2, 4.8, -1.0, 0.8, "fir")]:
        p.blob(x, y, z, r, r * 0.75, r, col, seg=7, rings=3, jit=0.1, seed=int(x * 5 + 9))
    moss_patch(p, 0.9, 0.1, 0.8, 0.3, "moss", seed=3)
    for i in range(10):   # hanging lichen strands under the crown
        a = rng.uniform(0, 2 * math.pi)
        r = rng.uniform(0.7, 1.4)
        x, z, L = r * math.cos(a), r * math.sin(a), rng.uniform(0.5, 1.1)
        p.tri((x - 0.05, 4.7, z), (x + 0.05, 4.7, z), (x, 4.7 - L, z), "#c3cdbd", out=(0, 0, 1))
        p.tri((x + 0.05, 4.7, z), (x - 0.05, 4.7, z), (x, 4.7 - L, z), "#c3cdbd", out=(0, 0, -1))
    p.done()
    g = Part("Moss_glow")
    for (y, face) in [(1.8, 1), (2.7, 3), (3.5, 6), (2.2, 5)]:
        r = R0 + (R1 - R0) * y / H
        ang = math.pi * 2 * (face + 0.5) / 8
        ap = r * math.cos(math.pi / 8) + 0.025
        n = Vector((math.cos(ang), 0, -math.sin(ang)))
        t = Vector((math.sin(ang), 0, math.cos(ang)))
        c0 = n * ap
        w, hh = rng.uniform(0.2, 0.28), rng.uniform(0.18, 0.26)
        pts = [c0 + t * -w + Vector((0, y - hh, 0)), c0 + t * w * 0.8 + Vector((0, y - hh * 0.7, 0)), c0 + t * w + Vector((0, y + hh * 0.6, 0)), c0 + t * -w * 0.6 + Vector((0, y + hh, 0))]
        g.face([tuple(q) for q in pts], rng.choice(["glow_teal", "#6fe0c8"]), out=tuple(n))
    g.done()


# ── forest-edge undergrowth (all low) ──

@model("fern_clump", "prop", 1, 1, FS + "A clump of ferns, under 0.6 high")
def fern_clump():
    p = Part("fern_clump")
    rng = random.Random(4)
    p.blob(0, 0.04, 0, 0.3, 0.06, 0.3, "moss_dk", seg=6, rings=2, jit=0.1, seed=1)
    for i in range(10):
        a = 2 * math.pi * i / 10 + rng.uniform(-0.2, 0.2)
        L, hgt = rng.uniform(0.32, 0.45), rng.uniform(0.32, 0.55)
        wd = 0.09
        b = (0.04 * math.cos(a), 0.06, 0.04 * math.sin(a))
        t = (L * math.cos(a), hgt, L * math.sin(a))
        m = (0.5 * L * math.cos(a), hgt * 0.9 + 0.04, 0.5 * L * math.sin(a))
        sx, sz = -math.sin(a) * wd, math.cos(a) * wd
        col = rng.choice(["moss", "leafy", "fir2", "#3a6b46"])
        p.tri(b, t, (m[0] + sx, m[1] - 0.08, m[2] + sz), col, ctr=(b[0], 0.0, b[2]))
        p.tri(b, (m[0] - sx, m[1] - 0.08, m[2] - sz), t, shade(col, -0.12), ctr=(b[0], 0.0, b[2]))
    p.done()


@model("bramble", "prop", 1, 1, FS + "A dark thorny tangle with a few red berries, under 0.8 high")
def bramble():
    p = Part("bramble")
    rng = random.Random(5)
    for i in range(9):
        a = rng.uniform(0, 2 * math.pi)
        a2 = a + rng.uniform(-1.2, 1.2)
        top = rng.uniform(0.35, 0.75)
        b = (0.08 * math.cos(a), 0.0, 0.08 * math.sin(a))
        m = (0.28 * math.cos(a2), top, 0.28 * math.sin(a2))
        t = (0.42 * math.cos(a2 + 0.5), top * 0.5, 0.42 * math.sin(a2 + 0.5))
        limb(p, b, m, 0.035, 0.025, rng.choice(["#2a2420", "bark_dk"]), seg=3)
        limb(p, m, t, 0.025, 0.0, "#2a2420", seg=3)
    for i in range(3):
        a = rng.uniform(0, 6)
        p.blob(0.25 * math.cos(a), rng.uniform(0.3, 0.5), 0.25 * math.sin(a), 0.14, 0.08, 0.14, rng.choice(["fir2", "leafy"]), seg=5, rings=2, jit=0.1, seed=i)
    for i in range(5):
        a, r = rng.uniform(0, 6.28), rng.uniform(0.12, 0.32)
        p.blob(r * math.cos(a), rng.uniform(0.25, 0.6), r * math.sin(a), 0.04, 0.04, 0.04, "#b8323a", seg=4, rings=2, jit=0)
    p.done()


@model("mossy_log", "prop", 2, 1, FS + "A fallen mossy log lying along x, about 0.5 high")
def mossy_log():
    p = Part("mossy_log")
    limb(p, (-0.9, 0.24, 0), (0.9, 0.26, 0.02), 0.24, 0.21, "bark_dk", seg=6)
    limb(p, (0.25, 0.4, -0.1), (0.5, 0.55, -0.3), 0.05, 0.0, "bark_dk", seg=3)
    p.face([(0.9, 0.26 + 0.21 * math.sin(2 * math.pi * i / 6 + 0.4), 0.02 + 0.21 * math.cos(2 * math.pi * i / 6 + 0.4)) for i in range(6)], "#7a6a52", out=(1, 0, 0))
    p.face([(-0.9, 0.24 + 0.24 * math.sin(2 * math.pi * i / 6 + 0.4), 0 + 0.24 * math.cos(2 * math.pi * i / 6 + 0.4)) for i in range(6)], "#7a6a52", out=(-1, 0, 0))
    for (x, z, r) in [(-0.4, 0.0, 0.25), (0.15, 0.02, 0.22), (0.6, 0.0, 0.18)]:
        moss_patch(p, x, 0.44, z, r, "moss", seed=int(x * 9))
    moss_patch(p, -0.1, 0.03, 0.25, 0.2, "moss_dk", seed=2)
    p.done()


@model("stump", "prop", 1, 1, FS + "A cut stump with roots and moss, about 0.4 high")
def stump():
    p = Part("stump")
    rng = random.Random(3)
    p.cyl(0, 0, 0, 0.3, 0.38, "bark_dk", seg=7, r_top=0.26, top_col="#8a7358")
    p.cyl(0, 0.385, 0, 0.12, 0.01, "#6e5a44", seg=7)
    roots(p, 0, 0, 0.28, 4, rng)
    moss_patch(p, -0.12, 0.38, 0.1, 0.12, "moss", seed=4)
    moss_patch(p, 0.2, 0.05, 0.25, 0.14, "moss_dk", seed=5)
    p.done()


@model("rock_moss", "prop", 1, 1, FS + "A mossy boulder pair, about 0.5 high")
def rock_moss():
    p = Part("rock_moss")
    p.blob(-0.05, 0.22, 0, 0.38, 0.28, 0.32, "#59636a", seg=6, rings=3, jit=0.14, seed=3, flat_bottom=True)
    p.blob(0.3, 0.12, 0.2, 0.2, 0.15, 0.18, "#4b555c", seg=6, rings=3, jit=0.12, seed=4, flat_bottom=True)
    moss_patch(p, -0.1, 0.42, -0.02, 0.26, "moss", seed=1)
    moss_patch(p, 0.3, 0.24, 0.2, 0.12, "leafy", seed=2)
    p.done()


@model("glow_mushrooms", "prop", 1, 1, FS + "Five mushrooms on a root; the caps are 'Caps_glow' (teal and cyan, unlit)")
def glow_mushrooms():
    p = Part("glow_mushrooms")
    limb(p, (-0.4, 0.05, 0.1), (0.1, 0.1, -0.05), 0.09, 0.07, "bark_dk", seg=4)
    limb(p, (0.1, 0.1, -0.05), (0.42, 0.0, 0.1), 0.07, 0.03, "bark_dk", seg=4)
    moss_patch(p, 0.0, 0.05, 0.1, 0.25, "moss_dk", seed=1)
    spots = [(-0.3, 0.1, 0.34, 0.12), (-0.1, 0.0, 0.5, 0.15), (0.12, -0.1, 0.38, 0.13), (0.3, 0.1, 0.26, 0.1), (0.05, 0.15, 0.2, 0.09)]
    for (x, z, h, r) in spots:
        p.cyl(x, 0.07, z, r * 0.22, h, "#dfe8dc", seg=4, top=False)
    p.done()
    g = Part("Caps_glow")
    for i, (x, z, h, r) in enumerate(spots):
        g.cone(x, 0.07 + h * 0.8, z, r, h * 0.45, ["glow_teal", "glow_cyan"][i % 2], seg=6)
    g.done()


@model("glow_flowers", "prop", 1, 1, FS + "A patch of bell flowers; the heads are 'Bells_glow' (violet, unlit)")
def glow_flowers():
    p = Part("glow_flowers")
    rng = random.Random(9)
    moss_patch(p, 0, 0.04, 0, 0.35, "moss_dk", seed=3)
    pos = []
    for i in range(7):
        x, z, h = rng.uniform(-0.3, 0.3), rng.uniform(-0.3, 0.3), rng.uniform(0.3, 0.55)
        pos.append((x, z, h))
        p.cone(x, 0.05, z, 0.025, h, "leafy", seg=3)
    for i in range(3):
        a = rng.uniform(0, 6)
        p.cone(0.15 * math.cos(a), 0.05, 0.15 * math.sin(a), 0.1, 0.18, "fir2", seg=3, rot=a * 40)
    p.done()
    g = Part("Bells_glow")
    for (x, z, h) in pos:
        g.cyl(x, 0.05 + h - 0.1, z, 0.06, 0.1, "glow_violet", seg=5, r_top=0.02, top=False)
    g.done()


# ── luminous set pieces ──

@model("wisp_lantern", "prop", 1, 1, FS + "A crooked dark post with a hanging glass lantern, about 2 high; the light is 'Light_glow' (amber)")
def wisp_lantern():
    p = Part("wisp_lantern")
    limb(p, (0, 0, 0), (-0.06, 0.9, 0), 0.1, 0.08, "bark_dk", seg=4)
    limb(p, (-0.06, 0.9, 0), (0.06, 1.7, 0.02), 0.08, 0.06, "bark", seg=4)
    limb(p, (0.06, 1.7, 0.02), (0.4, 1.95, 0.0), 0.06, 0.03, "bark_dk", seg=4)
    limb(p, (0.4, 1.95, 0), (0.4, 1.68, 0), 0.012, 0.012, "iron", seg=3)
    p.cone(0.4, 1.62, 0, 0.16, 0.08, "iron", seg=4, rot=45)
    p.cbox(0.4, 1.28, 0, 0.2, 0.03, 0.2, "iron")
    for sx in (-1, 1):
        for sz in (-1, 1):
            p.cbox(0.4 + sx * 0.085, 1.31, sz * 0.085, 0.025, 0.31, 0.025, "iron")
    roots(p, 0, 0, 0.08, 3, random.Random(2))
    moss_patch(p, 0.1, 0.05, 0.1, 0.2, "moss", seed=6)
    p.done()
    g = Part("Light_glow")
    g.cbox(0.4, 1.34, 0, 0.12, 0.24, 0.12, "glow_amber")
    g.done()


@model("rune_stone_small", "prop", 1, 1, FS + "A mossy standing stone, about 1.4 high; carved lines are 'Rune_glow' (teal)")
def rune_stone_small():
    p = Part("rune_stone_small")
    p.prism([(-0.3, 0.1), (0.3, 0.1), (0.26, 1.2), (0.1, 1.42), (-0.18, 1.36), (-0.28, 1.1)], -0.15, 0.15, "#4f5a64", cap="#5d6670")
    p.blob(0, 0.08, 0, 0.42, 0.14, 0.38, "moss_dk", seg=6, rings=2, jit=0.1, seed=2)
    moss_patch(p, -0.05, 1.38, 0, 0.16, "moss", seed=3)
    moss_patch(p, 0.2, 0.2, 0.15, 0.14, "leafy", seed=4)
    p.done()
    r = Part("Rune_glow")
    z = 0.155
    for (x0, y0, x1, y1) in [(-0.14, 0.4, 0.14, 0.44), (-0.14, 1.12, 0.1, 1.16), (-0.14, 0.4, -0.1, 1.16), (0.1, 0.4, 0.14, 1.0),
                              (-0.05, 0.62, 0.05, 0.66), (-0.05, 0.84, 0.05, 0.88)]:
        r.quad((x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z), "glow_teal", out=(0, 0, 1))
    r.done()


@model("firefly_bush", "prop", 1, 1, FS + "A low dark bush with eight tiny glowing dots ('Flies_glow', warm yellow-green)")
def firefly_bush():
    p = Part("firefly_bush")
    p.blob(0, 0.26, 0, 0.42, 0.3, 0.38, "fir2", seg=7, rings=3, jit=0.12, seed=7, flat_bottom=True)
    p.blob(0.25, 0.2, 0.15, 0.26, 0.2, 0.24, "leafy", seg=6, rings=3, jit=0.1, seed=8, flat_bottom=True)
    p.blob(-0.25, 0.18, -0.12, 0.24, 0.18, 0.22, "fir", seg=6, rings=3, jit=0.1, seed=9, flat_bottom=True)
    p.done()
    g = Part("Flies_glow")
    rng = random.Random(3)
    for i in range(8):
        a, r = rng.uniform(0, 6.28), rng.uniform(0.15, 0.5)
        g.blob(r * math.cos(a), rng.uniform(0.2, 0.75), r * math.sin(a), 0.03, 0.03, 0.03, rng.choice(["#e8f27a", "#d2ee6a", "#f6e26a"]), seg=4, rings=2, jit=0)
    g.done()


# ─────────────────────────────── buildings ───────────────────────────────

@model("cottage_hesper", "building", 6, 4, "Hesper's stone cottage on the rise: thatch, herb boxes, chimney (door +z, at x = -0.6)")
def cottage_hesper():
    W, D, H = 5.2, 3.4, 1.75
    p = Part("cottage_hesper")
    stone_walls(p, W, D, H, seed=3)
    p.gable(W, D, H, 1.7, "thatch", over=0.35, gable_col="fieldstone")
    p.box(-W / 2 - 0.35, H + 1.7 - 0.08, -0.12, W + 0.7, 0.14, 0.24, "thatch_dk")   # ridge
    chimney(p, W / 2 - 0.7, -0.5, H, 2.3)
    door(p, -0.6, D / 2, "door_green", arch=True)
    for x in (-1.9, 0.8, 1.8):
        window(p, x, 0.7, D / 2)
    window(p, 0, 0.75, W / 2, side=True)
    for x in (0.8, 1.8):   # herb boxes under the windows
        p.box(x - 0.35, 0.3, D / 2, 0.7, 0.2, 0.25, "wood")
        for k in range(3):
            p.blob(x - 0.22 + k * 0.22, 0.58, D / 2 + 0.12, 0.1, 0.1, 0.09, ["leaf", "leaf_dk", "#a3c27a"][k], seg=5, rings=3, seed=k)
    p.box(-W / 2 - 0.6, 0, D / 2 - 1.2, 0.6, 0.9, 1.0, "wood_dk")   # firewood lean-to
    for k in range(4):
        p.cyl(-W / 2 - 0.3, 0.08 + k * 0.18, D / 2 - 0.25, 0.08, 0.5, "wood_lt", seg=5, top_col="wood")
    p.box(-W / 2 - 0.7, 0.9, D / 2 - 1.3, 0.8, 0.06, 1.2, "slate")
    p.done()
    for x in (-1.9, 0.8, 1.8):
        lit_window("cottage_hesper_w%d" % int(x * 10), x, 0.7, D / 2).done()
    s = Part("cottage_hesper_smoke_glow")   # an ember in the chimney top (the game can puff smoke from here)
    s.cbox(W / 2 - 0.7, H + 2.3 + 0.05, -0.5, 0.25, 0.04, 0.25, "ember")
    s.done()


def village_house(name, W, D, roof, wall_lower="fieldstone", door_col="door_blue", seed=0):
    p = Part(name)
    H1, H2 = 1.2, 1.05
    stone_walls(p, W, D, H1, wall_lower, seed=seed)
    timber_frame(p, W - 0.1, D - 0.1, H1, H2)
    p.gable(W - 0.1, D - 0.1, H1 + H2, 1.5, roof, over=0.3, gable_col="plaster")
    chimney(p, -W / 2 + 0.6, 0, H1 + H2, 2.0)
    door(p, 0.5, D / 2, door_col, h=1.15)
    window(p, -0.8, 0.45, D / 2, w=0.45, h=0.45)
    window(p, -0.7, H1 + 0.3, D / 2 - 0.05, w=0.5, h=0.5)
    window(p, 0.8, H1 + 0.3, D / 2 - 0.05, w=0.5, h=0.5)
    p.done()
    lit_window(name + "_w1", -0.7, H1 + 0.3, D / 2 - 0.05).done()


@model("house_a", "building", 4, 4, "Village house: stone ground floor, timber and plaster above, thatch roof")
def house_a():
    village_house("house_a", 3.4, 3.2, "thatch", seed=10)


@model("house_b", "building", 4, 4, "Village house, slate roof and blue-grey stone")
def house_b():
    village_house("house_b", 3.4, 3.2, "slate", wall_lower="#aaa79c", door_col="barn_red", seed=20)


@model("house_small", "building", 4, 4, "A one-storey stone house (Abel's, the shepherd's)")
def house_small():
    W, D, H = 3.2, 2.8, 1.6
    p = Part("house_small")
    stone_walls(p, W, D, H, seed=30)
    p.gable(W, D, H, 1.4, "thatch", over=0.3, gable_col="fieldstone")
    chimney(p, W / 2 - 0.5, 0, H, 1.9)
    door(p, -0.5, D / 2, "door_green", h=1.25)
    window(p, 0.7, 0.65, D / 2)
    p.done()


@model("mill", "building", 6, 4, "The mill: stone base, timber top, slate roof; waterwheel 'Wheel' on the south-east (turns about z)")
def mill():
    W, D = 4.6, 3.2
    p = Part("mill")
    stone_walls(p, W, D, 1.5, seed=40)
    timber_frame(p, W - 0.1, D - 0.1, 1.5, 1.3, wall="wood_lt", beam="wood_dk")
    p.gable(W - 0.1, D - 0.1, 2.8, 1.6, "slate", over=0.3, gable_col="wood_lt", ridge_z=True)
    p.box(-0.5, 2.0, D / 2 - 0.1, 1.0, 1.0, 0.6, "wood_dk")           # hoist bay
    p.box(-0.6, 3.0, D / 2 - 0.2, 1.2, 0.08, 0.95, "slate")
    p.box(-0.05, 3.0, D / 2 + 0.3, 0.1, 0.5, 0.1, "wood_dk")            # hoist arm
    p.cyl(0, 2.3, D / 2 + 0.35, 0.01, 0.7, "rope", seg=3)
    p.box(-0.18, 2.1, D / 2 + 0.25, 0.36, 0.22, 0.2, "sack")
    door(p, -1.3, D / 2, "wood_dk", w=0.9, h=1.3)
    window(p, 1.0, 0.6, D / 2, w=0.45, h=0.45)
    window(p, 1.2, 1.85, D / 2 - 0.05, w=0.45, h=0.45, frame="wood_dk")
    p.box(1.25, 0, D / 2 + 0.0, 1.0, 0.25, 0.9, "fieldstone_dk")        # millrace wall
    p.box(1.35, 0.25, D / 2 - 0.05, 0.12, 1.1, 0.12, "wood_dk")          # axle bearing post
    p.cbox(1.75, 1.15, D / 2 + 0.4, 0.14, 0.14, 0.8, "iron")             # axle
    p.done()
    # the wheel, its own part with its pivot on the hub (axis along z)
    hub = (1.75, 1.2, D / 2 + 0.75)
    wh = Part("Wheel", origin=hub)
    R, n = 1.15, 12
    hx, hy, hz = hub
    for side in (-0.16, 0.16):
        for i in range(n):
            a0, a1 = 2 * math.pi * i / n, 2 * math.pi * (i + 1) / n
            for rr, col in ((R, "wood"), (R - 0.12, "wood_dk")):
                pass
            o0 = (hx + R * math.cos(a0), hy + R * math.sin(a0)); o1 = (hx + R * math.cos(a1), hy + R * math.sin(a1))
            i0 = (hx + (R - 0.14) * math.cos(a0), hy + (R - 0.14) * math.sin(a0)); i1 = (hx + (R - 0.14) * math.cos(a1), hy + (R - 0.14) * math.sin(a1))
            z0, z1 = hz + side - 0.04, hz + side + 0.04
            wh.quad((o0[0], o0[1], z1), (o1[0], o1[1], z1), (i1[0], i1[1], z1), (i0[0], i0[1], z1), "wood", out=(0, 0, 1))
            wh.quad((o0[0], o0[1], z0), (o1[0], o1[1], z0), (i1[0], i1[1], z0), (i0[0], i0[1], z0), "wood", out=(0, 0, -1))
            wh.quad((o0[0], o0[1], z0), (o1[0], o1[1], z0), (o1[0], o1[1], z1), (o0[0], o0[1], z1), "wood_dk", ctr=hub)
    for i in range(n):   # paddles
        a = 2 * math.pi * (i + 0.5) / n
        c, s = math.cos(a), math.sin(a)
        wh.at(hx + (R - 0.05) * c, hy + (R - 0.05) * s, hz, 0)
        wh.xf = wh.xf @ __import__("mathutils").Matrix.Rotation(a, 4, "Z")
        wh.box(-0.18, -0.03, -0.24, 0.36, 0.06, 0.48, "wood_lt")
    wh.reset()
    for i in range(4):   # spokes
        a = math.pi * i / 4
        wh.at(hx, hy, hz, 0)
        wh.xf = wh.xf @ __import__("mathutils").Matrix.Rotation(a, 4, "Z")
        for side in (-0.16, 0.16):
            wh.box(-R + 0.1, -0.04, side - 0.04, 2 * R - 0.2, 0.08, 0.08, "wood_dk")
    wh.reset()
    wh.cyl(hx, hy, hz - 0.25, 0.14, 0.5, "iron", seg=6)   # hub (along y, close enough at this size)
    wh.done()


@model("barn", "building", 6, 4, "The common barn: red gambrel roof, big sliding doors, hay loft")
def barn():
    W, D, H = 5.0, 3.4, 1.9
    p = Part("barn")
    p.box(-W / 2, 0, -D / 2, W, 0.25, D, "fieldstone_dk")
    p.box(-W / 2, 0.25, -D / 2, W, H - 0.25, D, "barn_red")
    for x in [(-W / 2 + 0.25 * i) for i in range(1, int(W / 0.25))]:   # board lines
        p.box(x, 0.25, D / 2, 0.015, H - 0.25, 0.01, shade("barn_red", -0.2))
    # gambrel profile across x, pushed along z (ridge along z means doors on the gable end; we want doors on +z)
    hw = W / 2 + 0.2
    prof = [(-hw, H), (hw, H), (hw * 0.72, H + 1.2), (0, H + 1.75), (-hw * 0.72, H + 1.2)]
    p.at(0, 0, 0, 90)
    # turned 90 so the gambrel profile runs across z and the ridge along x
    p.reset()
    hd = D / 2 + 0.2
    prof = [(-hd, H), (hd, H), (hd * 0.72, H + 1.2), (0, H + 1.75), (-hd * 0.72, H + 1.2)]
    # draw the roof as a prism along x by mapping the profile (z, y)
    n = len(prof)
    ctr = (0, H + 0.6, 0)
    x0, x1 = -W / 2 - 0.25, W / 2 + 0.25
    for i in range(n):
        (za, ya), (zb, yb) = prof[i], prof[(i + 1) % n]
        if i == 0:
            p.quad((x0, ya, za), (x1, ya, za), (x1, yb, zb), (x0, yb, zb), shade("slate_dk", -0.2), ctr=ctr)
        else:
            p.quad((x0, ya, za), (x1, ya, za), (x1, yb, zb), (x0, yb, zb), "slate_dk" if i in (2, 3) else "slate", ctr=ctr)
    pts = [(x, y, z) for z, y in prof]
    p.face([(x1, y, z) for z, y in prof], "barn_red", ctr=ctr)
    p.face([(x0, y, z) for z, y in prof], "barn_red", ctr=ctr)
    # doors with the white X brace
    for sx in (-1, 1):
        x = sx * 0.6 - (1.2 if sx > 0 else 0) + (0.6 if sx > 0 else 0)
        xa = 0 if sx > 0 else -1.2
        p.box(xa, 0.25, D / 2, 1.2, 1.5, 0.06, shade("barn_red", -0.08))
        p.box(xa, 0.25, D / 2 + 0.06, 1.2, 0.08, 0.03, "barn_trim")
        p.box(xa, 1.67, D / 2 + 0.06, 1.2, 0.08, 0.03, "barn_trim")
        p.box(xa, 0.25, D / 2 + 0.06, 0.08, 1.5, 0.03, "barn_trim")
        p.box(xa + 1.12, 0.25, D / 2 + 0.06, 0.08, 1.5, 0.03, "barn_trim")
        p.at(xa + 0.6, 0.25 + 0.75, D / 2 + 0.075, 0)
        for r in (51, -51):
            p.xf = p.xf @ __import__("mathutils").Matrix.Rotation(math.radians(r), 4, "Z")
            p.box(-0.85, -0.04, 0, 1.7, 0.08, 0.025, "barn_trim")
            p.at(xa + 0.6, 0.25 + 0.75, D / 2 + 0.075, 0)
        p.reset()
    p.box(-1.3, 1.75, D / 2, 2.6, 0.06, 0.15, "iron")    # door track
    p.box(-0.45, H + 0.3, D / 2 + 0.2, 0.9, 0.8, 0.06, "barn_trim")   # loft door
    p.box(-0.38, H + 0.36, D / 2 + 0.26, 0.76, 0.68, 0.02, "barn_red")
    for k in range(3):   # hay showing at the loft
        p.blob(-0.2 + k * 0.2, H + 0.45, D / 2 + 0.3, 0.12, 0.1, 0.06, "hay", seg=5, rings=3, seed=k)
    p.done()


@model("grain_tower", "building", 4, 4, "Prairie grain elevator: tall wooden tower with a headhouse (about 9 high)")
def grain_tower():
    p = Part("grain_tower")
    W, D, H = 2.6, 2.6, 7.0
    p.box(-W / 2 - 0.1, 0, -D / 2 - 0.1, W + 0.2, 0.3, D + 0.2, "stone")
    p.box(-W / 2, 0.3, -D / 2, W, H, D, "barn_red")
    for y in [0.3 + 0.6 * i for i in range(1, 12)]:   # siding lines
        p.box(-W / 2 - 0.01, y, D / 2, W + 0.02, 0.03, 0.01, shade("barn_red", -0.18))
    p.box(-W / 2 - 0.02, H - 0.3, -D / 2 - 0.02, W + 0.04, 0.3, D + 0.04, "barn_trim")
    p.gable(W, D, H + 0.3, 1.0, "slate", over=0.15, gable_col="barn_red")
    # headhouse (cupola) on top
    p.cbox(0, H + 0.6, 0, 1.0, 1.1, 1.2, "barn_red")
    p.at(0, 0, 0, 0)
    sub = 1.2
    p.box(-0.5, H + 1.7, -0.6, 1.0, 0.0, 1.2, "slate")
    p.reset()
    # small gable on the headhouse
    p.xf = __import__("mathutils").Matrix.Translation((0, H + 1.7, 0))
    p.gable(1.0, 1.2, 0, 0.55, "slate", over=0.12, gable_col="barn_red")
    p.reset()
    p.box(-W / 2 - 0.9, 0, D / 2 - 1.6, 0.9, 1.6, 1.4, "barn_red")   # driveway shed
    p.box(-W / 2 - 1.0, 1.6, D / 2 - 1.7, 1.1, 0.08, 1.6, "slate")
    p.box(-W / 2 - 0.85, 0, D / 2 - 0.19, 0.75, 1.3, 0.05, "wood_dk")
    p.box(-0.7, H - 1.6, D / 2, 1.4, 0.5, 0.05, "barn_trim")         # sign board (Label3D goes here, y = H-1.35)
    window(p, 0.6, 1.0, D / 2, w=0.35, h=0.45, frame="barn_trim")
    p.cyl(W / 2 - 0.25, 0.3, D / 2 + 0.2, 0.08, H - 0.5, "metal_lt", seg=5)   # spout pipe
    p.done()


# Wizard tower pieces. A round wall has SEG faces; face centres sit at 18° + 36°·i (270° faces +z, the front).
TW_SEG = 10
TW_STONE = ["#a7abb4", "#9a9ea8", "#b2b5bc", "#8f939d", "#a1a5ae"]


def tw_ring(p, y0, h, r0, r1, cols, rng, seg=TW_SEG):
    """One course of a round wall, radius r0 at the bottom to r1 at the top, each face its own block tone."""
    pt = lambda r, y, i: (r * math.cos(2 * math.pi * i / seg), y, -r * math.sin(2 * math.pi * i / seg))
    for i in range(seg):
        j = (i + 1) % seg
        p.quad(pt(r0, y0, i), pt(r0, y0, j), pt(r1, y0 + h, j), pt(r1, y0 + h, i), rng.choice(cols), ctr=(0, y0 + h / 2, 0))


def tw_window(p, ang, y, r, w=0.34, h=0.62, frame="#7f8591", seg=TW_SEG):
    """A narrow pointed window on the round wall face at angle ang (degrees; r = the wall's corner radius)."""
    ap = r * math.cos(math.pi / seg)
    p.at(0, 0, 0, ang + 90)
    p.box(-w / 2 - 0.07, y - 0.08, ap - 0.04, w + 0.14, h + 0.08, 0.09, frame)
    p.prism([(-w / 2 - 0.07, y + h), (w / 2 + 0.07, y + h), (0, y + h + w * 0.55 + 0.07)], ap - 0.04, ap + 0.05, frame)
    p.box(-w / 2, y, ap + 0.04, w, h, 0.02, "glass")
    p.prism([(-w / 2, y + h - 0.01), (w / 2, y + h - 0.01), (0, y + h + w * 0.5)], ap + 0.04, ap + 0.06, "glass")
    p.box(-w / 2 - 0.1, y - 0.12, ap - 0.02, w + 0.2, 0.06, 0.14, frame)   # sill
    p.reset()


@model("wizard_tower", "building", 4, 4,
       "A wizard's tower (about 12 high): round stone shaft, arched door, balcony with a telescope, half-timbered top "
       "room, indigo cone roof. Glow parts: Windows_glow, Runes_glow, Lantern_glow, Crystal_glow (spin and bob it)")
def wizard_tower():
    p = Part("wizard_tower")
    rng = random.Random(11)
    # plinth and front steps
    p.cyl(0, 0, 0, 1.78, 0.3, "fieldstone_dk", seg=TW_SEG, top_col="fieldstone")
    p.cbox(0, 0, 1.78, 1.2, 0.2, 0.4, "fieldstone_dk", top="fieldstone")
    p.cbox(0, 0, 1.9, 1.0, 0.1, 0.25, "fieldstone_dk", top="fieldstone")
    # lower shaft: 8 courses, a slight taper
    n1, y, r = 8, 0.3, 1.5
    for k in range(n1):
        tw_ring(p, y, 2.7 / n1, r, r - 0.01, TW_STONE, rng)
        y += 2.7 / n1
        r -= 0.01
    p.cyl(0, 3.0, 0, 1.6, 0.18, "#7f8591", seg=TW_SEG, top_col="#8f939d")      # ledge (rune band)
    # upper shaft
    n2, y, r = 7, 3.18, 1.36
    for k in range(n2):
        tw_ring(p, y, 2.12 / n2, r, r - 0.01, TW_STONE, rng)
        y += 2.12 / n2
        r -= 0.01
    # corbels under the balcony
    for i in range(TW_SEG):
        p.at(0, 0, 0, 18 + 36 * i + 90)
        p.box(-0.12, 5.0, 1.15, 0.24, 0.3, 0.45, "#8f939d")
        p.box(-0.12, 5.3, 1.15, 0.24, 0.2, 0.7, "#8f939d")
        p.reset()
    # balcony floor and railing
    p.cyl(0, 5.5, 0, 1.98, 0.16, "#7f8591", seg=TW_SEG, top_col="wood_dk", bottom=True)
    for i in range(TW_SEG):
        a = math.radians(36 * i)
        x, z = 1.9 * math.cos(a), -1.9 * math.sin(a)
        p.cbox(x, 5.66, z, 0.08, 0.5, 0.08, "wood_dk")
        p.at(0, 0, 0, 18 + 36 * i + 90)
        L = 2 * 1.9 * math.sin(math.pi / TW_SEG)
        p.box(-L / 2, 6.1, 1.9 * math.cos(math.pi / TW_SEG) - 0.03, L, 0.07, 0.07, "wood")
        p.box(-L / 2, 5.85, 1.9 * math.cos(math.pi / TW_SEG) - 0.02, L, 0.04, 0.05, "wood_dk")
        p.reset()
    # half-timbered top room
    for k in range(4):
        tw_ring(p, 5.66 + 0.4 * k, 0.4, 1.6, 1.6, ["plaster", "plaster", shade("plaster", -0.05)], rng)
    for i in range(TW_SEG):   # timber posts at the corners, a band top and bottom
        p.at(0, 0, 0, 36 * i + 90)
        p.box(-0.06, 5.66, 1.56, 0.12, 1.6, 0.07, "timber")
        p.reset()
    p.cyl(0, 5.66, 0, 1.64, 0.1, "timber", seg=TW_SEG, top=False)
    p.cyl(0, 7.16, 0, 1.64, 0.1, "timber", seg=TW_SEG, top=False)
    # roof: a flared skirt, then the cone in alternating slate strips, then the finial
    roof, roof_dk = "#4c4f86", "#3f4274"
    p.cyl(0, 7.18, 0, 2.05, 0.06, "#2f3150", seg=TW_SEG, top=False, bottom=True)
    p.cyl(0, 7.24, 0, 2.05, 0.5, roof_dk, seg=TW_SEG, r_top=1.6, top=False)
    tip = (0, 11.0, 0)
    for i in range(TW_SEG):
        a0, a1 = 2 * math.pi * i / TW_SEG, 2 * math.pi * (i + 1) / TW_SEG
        b0, b1 = (1.6 * math.cos(a0), 7.74, -1.6 * math.sin(a0)), (1.6 * math.cos(a1), 7.74, -1.6 * math.sin(a1))
        m = lambda q, f: (q[0] * (1 - f), q[1] + (tip[1] - q[1]) * f, q[2] * (1 - f))
        for s, (f0, f1) in enumerate([(0, 0.35), (0.35, 0.7), (0.7, 1.0)]):
            col = roof if (i + s) % 2 else roof_dk
            if f1 < 1:
                p.quad(m(b0, f0), m(b1, f0), m(b1, f1), m(b0, f1), col, ctr=(0, 8.5, 0))
            else:
                p.tri(m(b0, f0), m(b1, f0), tip, col, ctr=(0, 8.5, 0))
    p.cbox(0.8, 7.9, 0.3, 0.36, 2.3, 0.36, "fieldstone_dk", top="#3a3330")      # chimney through the roof
    p.cbox(0.8, 10.2, 0.3, 0.46, 0.12, 0.46, "fieldstone")
    p.cyl(0, 10.85, 0, 0.05, 0.55, "gold_dk", seg=5)
    p.blob(0, 11.0, 0, 0.12, 0.12, 0.12, "gold", seg=6, rings=3, jit=0)
    # front door: pointed arch in a stone surround
    ap = 1.5 * math.cos(math.pi / TW_SEG)
    p.box(-0.55, 0.3, ap - 0.04, 1.1, 1.55, 0.1, "#7f8591")
    p.prism([(-0.55, 1.85), (0.55, 1.85), (0, 2.45)], ap - 0.04, ap + 0.06, "#7f8591")
    p.box(-0.4, 0.3, ap + 0.05, 0.8, 1.5, 0.04, "#5a3d2e")
    p.prism([(-0.4, 1.8), (0.4, 1.8), (0, 2.25)], ap + 0.05, ap + 0.09, "#5a3d2e")
    for x in (-0.2, 0.0, 0.2):
        p.box(x - 0.01, 0.35, ap + 0.09, 0.02, 1.5 + (0.3 if x == 0 else 0.15), 0.01, shade("#5a3d2e", -0.3))
    for yy in (0.6, 1.5):
        p.box(-0.4, yy, ap + 0.09, 0.8, 0.06, 0.02, "iron")
    p.box(0.22, 1.05, ap + 0.1, 0.07, 0.07, 0.05, "gold_dk")
    # windows up the shaft (a loose spiral) and on the top room
    tw_window(p, 234, 1.4, 1.48)
    tw_window(p, 342, 2.0, 1.47)
    tw_window(p, 306, 3.7, 1.34)
    tw_window(p, 162, 4.2, 1.33)
    tw_window(p, 54, 3.5, 1.35)
    room_win = [270, 198, 342, 126, 54]
    for a in room_win:
        tw_window(p, a, 6.05, 1.6, w=0.42, h=0.7, frame="timber")
    # telescope on the balcony (south-east side), tilted at the sky
    from mathutils import Matrix, Vector
    tx, tz = 1.78 * math.cos(math.radians(-35)), -1.78 * math.sin(math.radians(-35))
    p.cbox(tx, 5.66, tz, 0.08, 0.55, 0.08, "wood_dk")
    p.xf = Matrix.Translation(Vector((tx, 6.2, tz))) @ Matrix.Rotation(math.radians(-35 + 90), 4, "Y") @ Matrix.Rotation(math.radians(32), 4, "X")
    p.cyl(0, -0.35, 0, 0.08, 1.0, "#c8a24a", seg=6)
    p.cyl(0, 0.6, 0, 0.11, 0.12, "#a8842e", seg=6, top_col="glass")
    p.cyl(0, -0.4, 0, 0.05, 0.08, "#a8842e", seg=6)
    p.reset()
    # ivy up the west side, a barrel and crate by the door, the lantern post
    for k, (ang, yy, s) in enumerate([(200, 0.6, 0.35), (210, 1.1, 0.3), (195, 1.5, 0.28), (215, 1.9, 0.26),
                                      (205, 2.4, 0.22), (190, 0.4, 0.4), (222, 0.5, 0.32)]):
        a = math.radians(ang)
        p.blob(1.5 * math.cos(a), yy, -1.5 * math.sin(a), s, s * 0.9, s, rng.choice(["leaf", "leaf_dk", "hedge"]), seg=6, rings=3, seed=k)
    p.cyl(-1.05, 0.0, 1.35, 0.22, 0.5, "wood", seg=7, top_col="wood_dk")
    p.cyl(-1.05, 0.12, 1.35, 0.23, 0.04, "iron", seg=7, top=False)
    p.cyl(-1.05, 0.36, 1.35, 0.23, 0.04, "iron", seg=7, top=False)
    p.at(-1.45, 0, 0.95, 20)
    p.cbox(0, 0, 0, 0.4, 0.38, 0.4, "wood_lt")
    p.reset()
    p.cbox(1.05, 0, 1.55, 0.09, 1.4, 0.09, "iron")
    p.cbox(1.05, 1.4, 1.55, 0.26, 0.05, 0.26, "iron")
    p.cone(1.05, 1.72, 1.55, 0.2, 0.18, "iron", seg=4, rot=45)
    p.done()

    # glow parts (unlit): lit room windows, the rune band, the lantern, and the floating crystal
    g = Part("Windows_glow")
    for a in room_win:
        g.at(0, 0, 0, a + 90)
        ap = 1.6 * math.cos(math.pi / TW_SEG)
        g.box(-0.18, 6.08, ap + 0.065, 0.36, 0.64, 0.01, "#f3c977")
        g.reset()
    g.done()
    r = Part("Runes_glow")
    ap = 1.6 * math.cos(math.pi / TW_SEG)
    for i in range(TW_SEG):
        r.at(0, 0, 0, 18 + 36 * i + 90)
        z = ap + 0.012
        r.quad((-0.09, 3.09, z), (0, 3.02, z), (0.09, 3.09, z), (0, 3.16, z), "#8fd8ff", out=(0, 0, 1))
        r.quad((-0.3, 3.08, z), (-0.2, 3.08, z), (-0.2, 3.1, z), (-0.3, 3.1, z), "#8fd8ff", out=(0, 0, 1))
        r.quad((0.2, 3.08, z), (0.3, 3.08, z), (0.3, 3.1, z), (0.2, 3.1, z), "#8fd8ff", out=(0, 0, 1))
        r.reset()
    r.done()
    lg = Part("Lantern_glow")
    lg.cbox(1.05, 1.45, 1.55, 0.18, 0.27, 0.18, "#f3c977")
    lg.done()
    c = Part("Crystal_glow", origin=(0, 11.75, 0))
    c.cone(0, 11.75, 0, 0.24, 0.45, "#9fe3ff", seg=4)
    c.cone(0, 11.75, 0, 0.24, -0.35, "#6fc6ef", seg=4)
    c.done()


@model("well", "building", 2, 2, "The village well: round stone wall, posts, small roof, crank and bucket")
def well():
    p = Part("well")
    rng = random.Random(2)
    for ring in range(3):
        for i in range(9):
            a = 2 * math.pi * (i + 0.5 * (ring % 2)) / 9
            x, z = 0.62 * math.cos(a), -0.62 * math.sin(a)
            p.at(x, 0.24 * ring, z, math.degrees(a) + 90)
            p.box(-0.21, 0, -0.13, 0.42, 0.23, 0.26, rng.choice(["fieldstone", "fieldstone_dk", "stone"]))
    p.reset()
    p.cyl(0, 0.7, 0, 0.66, 0.06, "fieldstone_dk", seg=9, r_top=0.66)
    p.cyl(0, 0.0, 0, 0.5, 0.72, "#2c3236", seg=9)   # dark inside (seen from above as the shaft)
    for sx in (-0.62, 0.62):
        p.cbox(sx, 0.7, 0, 0.12, 1.25, 0.12, "wood_dk")
    p.gable(1.6, 1.2, 1.9, 0.5, "thatch", over=0.08, ridge_z=True)
    p.cbox(0, 1.55, 0, 1.24, 0.07, 0.07, "wood")                  # crank axle
    p.cbox(0.7, 1.4, 0.06, 0.05, 0.3, 0.05, "iron")              # handle
    p.cyl(0, 1.0, 0, 0.012, 0.55, "rope", seg=3)
    p.cyl(0, 0.85, 0, 0.13, 0.18, "wood", seg=7, r_top=0.15, top_col="#2c3236")   # bucket
    p.cyl(0, 0.92, 0, 0.135, 0.03, "iron", seg=7)
    p.done()


@model("gate_arch", "building", 4, 2, "Stone gate arch over a 2-wide road, with a sign board ('Highstead') facing +z")
def gate_arch():
    p = Part("gate_arch")
    for sx in (-1.45, 1.45):
        p.cbox(sx, 0, 0, 0.8, 0.35, 0.9, "fieldstone_dk")
        p.stone_wall(sx - 0.32, 0, sx + 0.32, 0, 0.35, 2.4, "fieldstone", t=0.7, course=0.3, seed=int(sx * 10))
        p.cbox(sx, 2.75, 0, 0.82, 0.18, 0.92, "stone")
        p.cone(sx, 2.93, 0, 0.42, 0.5, "slate", seg=4, rot=45)
    # the arch: wedge stones on a half circle from pillar to pillar
    n, R, Y0, K = 9, 1.08, 1.55, 0.8
    for i in range(n):
        a0, a1 = math.pi * i / n, math.pi * (i + 1) / n
        o0 = (R * math.cos(a0), Y0 + R * K * math.sin(a0)); o1 = (R * math.cos(a1), Y0 + R * K * math.sin(a1))
        i0 = ((R - 0.28) * math.cos(a0), Y0 + (R - 0.28) * K * math.sin(a0)); i1 = ((R - 0.28) * math.cos(a1), Y0 + (R - 0.28) * K * math.sin(a1))
        col = "stone" if i == n // 2 else ("fieldstone" if i % 2 else shade("fieldstone", -0.1))
        p.prism([o0, o1, i1, i0], -0.34, 0.34, col)
        # spandrel: wall from the arch's outer edge up to the top course
        p.prism([o0, o1, (o1[0], 2.62), (o0[0], 2.62)], -0.3, 0.3, shade("fieldstone", -0.04))
    p.box(-1.1, 2.62, -0.36, 2.2, 0.3, 0.72, "stone")   # top course over the arch
    p.box(-0.85, 2.95, 0.33, 1.7, 0.45, 0.06, "wood")       # sign board: Label3D at (0, 3.17, 0.37)
    p.box(-0.9, 2.92, 0.31, 1.8, 0.05, 0.08, "wood_dk")
    p.box(-0.9, 3.38, 0.31, 1.8, 0.05, 0.08, "wood_dk")
    p.done()


@model("rune_stone", "building", 2, 2, "The grain-share stone: a standing slab; carved lines in 'Rune_glow' (tint grey for false, gold when fixed)")
def rune_stone():
    p = Part("rune_stone")
    p.cbox(0, 0, 0, 1.6, 0.22, 1.1, "fieldstone_dk", top="fieldstone")
    p.cbox(0, 0.22, 0, 1.3, 0.12, 0.8, "fieldstone")
    # the slab, slightly tapered: a prism of its front profile pushed through its thickness
    p.prism([(-0.55, 0.34), (0.55, 0.34), (0.48, 2.0), (0.25, 2.25), (-0.3, 2.2), (-0.5, 1.95)], -0.17, 0.17, "stone", cap="#d9d1c0")
    p.done()
    r = Part("Rune_glow")
    # a border and four carved lines on the front face (text is a Label3D at (0, 1.25, 0.19))
    z = 0.175
    for (x0, y0, x1, y1) in [(-0.42, 0.52, 0.42, 0.56), (-0.42, 1.92, 0.42, 1.96), (-0.42, 0.52, -0.38, 1.96), (0.38, 0.52, 0.42, 1.96)]:
        r.box(x0, y0, z, x1 - x0, y1 - y0, 0.01, "rune_grey")
    for k in range(3):   # little marks at the top
        r.box(-0.22 + k * 0.18, 2.03, z - 0.01, 0.06, 0.1, 0.01, "rune_grey")
    r.done()


@model("fold", "building", 10, 6, "Rowan's sheep fold: dry-stone wall pen with a gap on the south side, a slate lean-to shelter")
def fold():
    p = Part("fold")
    W, D = 9.0, 5.2
    hw, hd = W / 2, D / 2
    p.stone_wall(-hw, -hd, hw, -hd, 0, 0.75, "fieldstone", seed=1)
    p.stone_wall(hw, -hd, hw, hd, 0, 0.75, "fieldstone", seed=2)
    p.stone_wall(-hw, hd, -hw, -hd, 0, 0.75, "fieldstone", seed=3)
    p.stone_wall(-hw, hd, -0.8, hd, 0, 0.75, "fieldstone", seed=4)
    p.stone_wall(0.8, hd, hw, hd, 0, 0.75, "fieldstone", seed=5)
    for sx in (-0.8, 0.8):
        p.cbox(sx, 0, hd, 0.4, 0.95, 0.4, "fieldstone_dk", top="stone")
    # a wooden hurdle gate swung open
    p.at(0.8, 0, hd + 0.1, -70)
    for k in range(3):
        p.box(-1.5, 0.15 + k * 0.25, -0.03, 1.5, 0.08, 0.06, "wood")
    for x in (-1.5, -0.75, -0.06):
        p.box(x, 0, -0.04, 0.07, 0.8, 0.08, "wood_dk")
    p.reset()
    # lean-to in the north-west corner
    p.box(-hw + 0.3, 0, -hd + 0.3, 2.6, 1.3, 0.25, "fieldstone_dk")
    for x in (-hw + 0.4, -hw + 2.7):
        p.box(x, 0, -hd + 1.6, 0.12, 0.95, 0.12, "wood_dk")
    p.quad((-hw + 0.2, 1.45, -hd + 0.2), (-hw + 3.0, 1.45, -hd + 0.2), (-hw + 3.0, 1.0, -hd + 1.9), (-hw + 0.2, 1.0, -hd + 1.9), "slate", out=(0, 1, 0.3))
    p.quad((-hw + 0.2, 1.39, -hd + 0.2), (-hw + 3.0, 1.39, -hd + 0.2), (-hw + 3.0, 0.94, -hd + 1.9), (-hw + 0.2, 0.94, -hd + 1.9), "slate_dk", out=(0, -1, -0.3))
    p.box(-hw + 0.5, 0, -hd + 0.6, 1.0, 0.45, 0.7, "hay", top=shade("hay", 0.1))
    p.box(1.5, 0, -1.0, 1.4, 0.35, 0.5, "wood_dk")    # trough
    p.box(1.58, 0.25, -0.92, 1.24, 0.08, 0.34, "water")
    p.done()


@model("root_cellar", "building", 2, 2, "Hesper's root cellar: a turf mound with a stone door frame (door +z)")
def root_cellar():
    p = Part("root_cellar")
    p.blob(0, 0.0, -0.2, 0.95, 0.75, 0.85, "grass", seg=8, rings=4, jit=0.06, seed=3, flat_bottom=True)
    p.box(-0.5, 0, 0.35, 1.0, 1.0, 0.35, "fieldstone_dk")
    p.box(-0.33, 0, 0.66, 0.66, 0.8, 0.06, "wood_dk")
    p.box(-0.55, 0.95, 0.33, 1.1, 0.14, 0.4, "stone")
    grass_tufts(p, 6, 1.4, 1.2, 0.5, 5)
    p.done()


@model("market_stall", "building", 2, 2, "Highstead market stall: plank counter, striped canvas roof, produce")
def market_stall():
    p = Part("market_stall")
    for x in (-0.85, 0.75):
        for z in (-0.7, 0.6):
            p.box(x, 0, z, 0.1, 1.7 if z < 0 else 1.45, 0.1, "wood_dk")
    p.box(-0.95, 0.7, 0.3, 1.9, 0.1, 0.5, "wood")
    p.box(-0.9, 0, 0.35, 1.8, 0.7, 0.05, "wood_dk")
    for i in range(6):   # striped canvas
        x0 = -1.0 + i * 1/3
        col = "barn_red" if i % 2 == 0 else "barn_trim"
        p.quad((x0, 1.85, -0.85), (x0 + 1/3, 1.85, -0.85), (x0 + 1/3, 1.5, 0.95), (x0, 1.5, 0.95), col, out=(0, 1, 0.2))
        p.quad((x0, 1.83, -0.85), (x0 + 1/3, 1.83, -0.85), (x0 + 1/3, 1.48, 0.95), (x0, 1.48, 0.95), shade(col, -0.25), out=(0, -1, -0.2))
        p.quad((x0, 1.5, 0.95), (x0 + 1/3, 1.5, 0.95), (x0 + 1/3, 1.32, 0.95), (x0, 1.32, 0.95), col, out=(0, 0, 1))
    rng = random.Random(4)
    for k in range(3):   # baskets of produce
        x = -0.6 + k * 0.6
        p.cyl(x, 0.8, 0.55, 0.2, 0.15, "wood_lt", seg=7, top_col="wood")
        for j in range(4):
            p.blob(x + rng.uniform(-0.09, 0.09), 0.98, 0.55 + rng.uniform(-0.09, 0.09), 0.08, 0.07, 0.08, ["#c6463a", "#e0a33a", "#8aa04a"][k], seg=5, rings=3, jit=0.05, seed=j)
    p.done()


@model("bridge_broken", "building", 2, 4, "The broken gorge bridge end: two posts at the lip, snapped ropes, planks hanging down the wall (+z is the gap)")
def bridge_broken():
    p = Part("bridge_broken")
    for sx in (-0.7, 0.7):
        p.cbox(sx, 0, -1.4, 0.3, 1.3, 0.3, "wood_dk", top="wood")
        p.cbox(sx, 0, -1.4, 0.5, 0.25, 0.5, "fieldstone_dk")
    for k in range(4):   # the last good planks on the lip
        p.box(-0.75, 0.08, -1.2 + k * 0.25, 1.5, 0.06, 0.2, "wood" if k % 2 else "wood_lt")
    # planks hanging down the face, held by the two side ropes
    n = 9
    for k in range(n):
        y = 0.0 - 0.35 * k
        z = -0.15 + 0.06 * k
        tilt = (k % 3 - 1) * 8
        p.at(0 + (k % 2) * 0.04, y, z, tilt)
        p.box(-0.72, -0.05, -0.05, 1.44, 0.2, 0.05, "wood" if k % 2 else "wood_lt")
        p.reset()
    for sx in (-0.65, 0.65):
        p.quad((sx - 0.015, 1.1, -1.4), (sx + 0.015, 1.1, -1.4), (sx + 0.015, 0.1, -0.2), (sx - 0.015, 0.1, -0.2), "rope", out=(0, 1, 0.5))
        p.cbox(sx, -3.2, 0.33, 0.03, 3.2, 0.03, "rope")
    p.cbox(0.65, 0.9, -0.85, 0.05, 0.05, 0.9, "rope")   # a snapped hand rope hanging loose
    p.done()


@model("footbridge", "building", 2, 2, "Small plank footbridge over the 2-tile mill race: deck low (top 0.09, just over the bank), low rails both sides. Origin centre, yaw 0 crosses north-south (z); yaw 90 for east-west")
def footbridge():
    p = Part("footbridge")
    top = 0.09
    for sx in (-0.62, 0.62):   # two beam stringers, resting on the banks, with a little sag below the deck
        p.box(sx - 0.09, WATER_Y + 0.12, -1.18, 0.18, top - 0.05 - (WATER_Y + 0.12), 2.36, "wood_dk", top="trunk")
        p.box(sx - 0.1, GRASS_Y - 0.1, -1.3, 0.2, 0.14, 0.3, "fieldstone_dk", top="fieldstone")   # sill stones on the banks
        p.box(sx - 0.1, GRASS_Y - 0.1, 1.0, 0.2, 0.14, 0.3, "fieldstone_dk", top="fieldstone")
    n = 9
    pl = 2.4 / n
    for k in range(n):   # planks across the deck, slightly uneven
        z = -1.2 + k * pl
        p.box(-0.8 - (k % 3) * 0.02, top - 0.05, z + 0.01, 1.6 + (k % 3) * 0.04, 0.05, pl - 0.03, ("wood", "wood_lt", "wood")[k % 3])
    for sx in (-0.78, 0.78):   # low rails: posts + one rail
        for z in (-1.1, -0.37, 0.37, 1.1):
            p.cbox(sx, top - 0.05, z, 0.06, 0.38, 0.06, "wood_dk", top="wood")
        p.box(sx - 0.03, top + 0.26, -1.14, 0.06, 0.05, 2.28, "wood")
    p.done()


# ─────────────────────────────── props ───────────────────────────────

@model("fence_rail", "prop", 2, 1, "Split-rail fence, 2 long along x (posts at both ends)")
def fence_rail():
    p = Part("fence_rail")
    for x in (-1.0, 1.0):
        p.cbox(x, 0, 0, 0.12, 0.85, 0.12, "wood_dk", top="wood")
    for y in (0.3, 0.62):
        p.box(-1.0, y, -0.035, 2.0, 0.08, 0.07, "wood")
    p.done()


@model("fence_gate", "prop", 2, 1, "A plank gate in the rail fence, 2 wide")
def fence_gate():
    p = Part("fence_gate")
    for x in (-1.0, 1.0):
        p.cbox(x, 0, 0, 0.14, 1.0, 0.14, "wood_dk", top="wood")
    for y in (0.2, 0.5, 0.8):
        p.box(-0.93, y, -0.03, 1.86, 0.1, 0.06, "wood_lt")
    p.at(0, 0.5, 0.04, 0)
    import mathutils
    p.xf = p.xf @ mathutils.Matrix.Rotation(math.radians(17), 4, "Z")
    p.box(-0.97, -0.04, -0.02, 1.94, 0.08, 0.04, "wood")
    p.done()


@model("stone_wall_2", "prop", 2, 1, "A 2-long piece of dry-stone field wall")
def stone_wall_2():
    p = Part("stone_wall_2")
    p.stone_wall(-1, 0, 1, 0, 0, 0.7, "fieldstone", t=0.45, seed=9)
    p.done()


@model("hay_bale", "prop", 1, 1, "A round hay bale")
def hay_bale():
    p = Part("hay_bale")
    import mathutils
    p.xf = mathutils.Matrix.Translation((0, 0.42, 0)) @ mathutils.Matrix.Rotation(math.radians(90), 4, "X")
    p.cyl(0, -0.4, 0, 0.42, 0.8, "hay", seg=10, top_col=shade("hay", -0.1), bottom=True)
    p.reset()
    for k in range(3):
        p.cyl(0, 0.0 + k * 0.001, -0.25 + k * 0.25, 0.0, 0.0, "hay")
    p.done()


@model("hay_stack", "prop", 2, 2, "A hay stack under a little thatch cap")
def hay_stack():
    p = Part("hay_stack")
    p.cyl(0, 0, 0, 0.8, 0.9, "hay", seg=9, r_top=0.7)
    p.cone(0, 0.9, 0, 0.8, 0.9, "thatch", seg=9)
    p.cyl(0, 0.0, 0, 0.82, 0.08, "hay", seg=9)
    p.done()


@model("sack", "prop", 1, 1, "A grain sack")
def sack():
    p = Part("sack")
    p.cyl(0, 0, 0, 0.2, 0.42, "sack", seg=7, r_top=0.15)
    p.cyl(0, 0.42, 0, 0.09, 0.1, "sack", seg=6, r_top=0.12)
    p.cyl(0, 0.44, 0, 0.1, 0.03, "rope", seg=6)
    p.done()


@model("sack_pile", "prop", 1, 1, "A pile of grain sacks")
def sack_pile():
    p = Part("sack_pile")
    for (x, z, y, yaw) in [(-0.22, 0.05, 0, 0), (0.22, -0.05, 0, 0), (0, 0.15, 0.33, 0)]:
        import mathutils
        p.xf = mathutils.Matrix.Translation((x, y + 0.17, z)) @ mathutils.Matrix.Rotation(math.radians(90), 4, "X")
        p.cyl(0, -0.28, 0, 0.18, 0.56, "sack", seg=7, top_col=shade("sack", -0.1), bottom=True)
    p.reset()
    p.done()


@model("barrel", "prop", 1, 1, "A wooden barrel")
def barrel():
    p = Part("barrel")
    p.cyl(0, 0, 0, 0.22, 0.3, "wood", seg=8, r_top=0.26, top=False)
    p.cyl(0, 0.3, 0, 0.26, 0.3, "wood", seg=8, r_top=0.22, top_col="wood_dk")
    for y in (0.08, 0.5):
        p.cyl(0, y, 0, 0.245, 0.05, "iron", seg=8, top=False)
    p.done()


@model("crate", "prop", 1, 1, "A plank crate")
def crate():
    p = Part("crate")
    p.box(-0.25, 0, -0.25, 0.5, 0.5, 0.5, "wood_lt", top="wood")
    for y in (0.0, 0.42):
        p.box(-0.26, y, 0.25, 0.52, 0.08, 0.02, "wood_dk")
    p.done()


@model("cart", "prop", 2, 1, "A two-wheeled hand cart, empty (bed 0.6 above the ground)")
def cart():
    p = Part("cart")
    p.box(-0.8, 0.5, -0.4, 1.3, 0.08, 0.8, "wood")
    for z in (-0.42, 0.38):
        p.box(-0.8, 0.58, z, 1.3, 0.25, 0.04, "wood_lt")
    p.box(-0.8, 0.58, -0.4, 0.04, 0.25, 0.8, "wood_lt")
    for z in (-0.25, 0.25):   # handles
        p.box(0.5, 0.52, z - 0.03, 0.75, 0.06, 0.06, "wood_dk")
    import mathutils
    for z in (-0.47, 0.47):
        p.xf = mathutils.Matrix.Translation((-0.2, 0.4, z)) @ mathutils.Matrix.Rotation(math.radians(90), 4, "X")
        p.cyl(0, -0.04, 0, 0.4, 0.08, "wood_dk", seg=10, top_col="wood", bottom=True)
        p.cyl(0, -0.06, 0, 0.08, 0.12, "iron", seg=6)
    p.reset()
    p.box(1.15, 0, 0.0, 0.06, 0.52, 0.06, "wood_dk")   # prop leg
    p.done()


@model("cart_grain", "prop", 2, 1, "The hand cart full of grain (Sharing the harvest)")
def cart_grain():
    cart()
    p = Part("cart_grain_load")
    p.box(-0.76, 0.58, -0.38, 1.22, 0.2, 0.76, "wheat")
    p.blob(-0.15, 0.78, 0, 0.55, 0.16, 0.34, "wheat", seg=7, rings=3, jit=0.05, seed=1)
    p.done()


@model("trough", "prop", 2, 1, "A water trough")
def trough():
    p = Part("trough")
    p.box(-0.8, 0, -0.3, 1.6, 0.45, 0.6, "wood_dk")
    p.box(-0.72, 0.36, -0.22, 1.44, 0.06, 0.44, "water")
    p.done()


@model("woodpile", "prop", 2, 1, "Stacked firewood")
def woodpile():
    p = Part("woodpile")
    import mathutils
    for row in range(3):
        for k in range(5 - row):
            p.xf = mathutils.Matrix.Translation((-0.6 + k * 0.28 + row * 0.14, 0.12 + row * 0.22, 0)) @ mathutils.Matrix.Rotation(math.radians(90), 4, "X")
            p.cyl(0, -0.3, 0, 0.12, 0.6, "wood_lt", seg=6, top_col="wood", bottom=True)
    p.reset()
    p.done()


def tree(name, crown_cols, trunk_h=1.4, r=0.85, seed=0, pine=False, trunk_col="trunk", trunk_r=0.13, flecks=0):
    p = Part(name)
    p.cyl(0, 0, 0, trunk_r, trunk_h + 0.3, trunk_col, seg=5, r_top=trunk_r * 0.62)
    if flecks:   # birch bark: short dark dashes on the pale trunk
        rng = random.Random(seed + 40)
        for _ in range(flecks):
            a = rng.uniform(0, 2 * math.pi)
            h = rng.uniform(0.25, trunk_h)
            rr = trunk_r * (1.0 - 0.38 * h / (trunk_h + 0.3))
            p.cbox(math.cos(a) * rr, h, math.sin(a) * rr, 0.045, 0.06, 0.03, "#4a443c")
    p.done()
    c = Part(name + "_Crown", origin=(0, trunk_h, 0))
    if pine:
        for i, (rr, y) in enumerate([(0.85, 0.0), (0.68, 0.7), (0.48, 1.35), (0.28, 1.9)]):
            c.cone(0, trunk_h - 0.2 + y, 0, rr, 1.0, crown_cols[i % len(crown_cols)], seg=7, rot=i * 20)
    else:
        rng = random.Random(seed)
        c.blob(0, trunk_h + 0.7, 0, r, r * 1.25, r, crown_cols[0], seg=7, rings=4, jit=0.12, seed=seed)
        for k in range(2):
            c.blob(rng.uniform(-0.4, 0.4), trunk_h + rng.uniform(0.5, 1.2), rng.uniform(-0.3, 0.3), r * 0.6, r * 0.6, r * 0.6, crown_cols[1 + k % (len(crown_cols) - 1)], seg=6, rings=3, seed=seed + k + 1)
    c.done()


@model("tree_aspen", "prop", 2, 2, "A prairie aspen ('*_Crown' part sways)")
def tree_aspen():
    tree("tree_aspen", ["leaf", "leaf2", "leaf_dk"], trunk_h=1.6, r=0.7, seed=1)


@model("tree_aspen_au", "prop", 2, 2, "An aspen in autumn gold")
def tree_aspen_au():
    tree("tree_aspen_au", ["leaf_au", "#e0b552", "#b98a4a"], trunk_h=1.6, r=0.7, seed=2)


@model("tree_cottonwood", "prop", 2, 2, "A big riverside cottonwood")
def tree_cottonwood():
    tree("tree_cottonwood", ["leaf_dk", "leaf", "#6b9058"], trunk_h=1.9, r=1.15, seed=3)


@model("tree_spruce", "prop", 2, 2, "A spruce")
def tree_spruce():
    tree("tree_spruce", ["#4f7352", "#5a7d58", "#466a4b", "#53775a"], trunk_h=0.5, pine=True)


@model("bush", "prop", 1, 1, "A low wild-rose bush")
def bush():
    p = Part("bush")
    p.blob(0, 0.25, 0, 0.45, 0.32, 0.4, "hedge", seg=7, rings=3, seed=5, flat_bottom=True)
    rng = random.Random(5)
    for _ in range(4):
        p.blob(rng.uniform(-0.3, 0.3), rng.uniform(0.35, 0.5), rng.uniform(0.1, 0.35), 0.05, 0.04, 0.05, "#d77a92", seg=4, rings=2, jit=0)
    p.done()


# ── more town trees and bushes ──

@model("tree_elm", "prop", 2, 2, "A tall elm, the biggest of the village trees (about 4.7 high; 'tree_elm_Crown' sways)")
def tree_elm():
    tree("tree_elm", ["leaf", "leaf2", "leaf_dk"], trunk_h=2.5, r=1.15, seed=11, trunk_r=0.22)


@model("tree_maple", "prop", 2, 2, "A broad maple in autumn colour ('tree_maple_Crown' sways)")
def tree_maple():
    tree("tree_maple", ["leaf_au", "#d27a3f", "#b9542f"], trunk_h=1.8, r=1.2, seed=12, trunk_r=0.16)


@model("tree_birch", "prop", 2, 2, "A slim birch with a pale, flecked trunk ('tree_birch_Crown' sways)")
def tree_birch():
    tree("tree_birch", ["#8fb46a", "#a4c078", "#7fa05e"], trunk_h=2.3, r=0.62, seed=13,
         trunk_col="#d9d4c6", trunk_r=0.09, flecks=12)


@model("tree_willow", "prop", 2, 2, "A weeping willow, long pale-green strands hanging from a leaning crown ('tree_willow_Crown' sways)")
def tree_willow():
    p = Part("tree_willow")
    rng = random.Random(21)
    limb(p, (0, 0, 0), (0.15, 1.4, 0.05), 0.19, 0.13, "trunk", seg=5)
    limb(p, (0.15, 1.4, 0.05), (0.38, 2.15, 0.0), 0.13, 0.09, "trunk", seg=5)
    limb(p, (0.2, 1.6, 0.05), (-0.45, 2.0, 0.2), 0.07, 0.04, "trunk", seg=4)
    roots(p, 0, 0, 0.22, 4, rng, col="trunk")
    p.done()
    c = Part("tree_willow_Crown", origin=(0, 2.1, 0))
    greens = ["#b4d07c", "#a7c872", "#c2d98a", "#9dc06c"]
    # a lumpy, leaning crown made of a few uneven lobes
    for (x, y, z, rx, ry, rz) in [(0.45, 2.5, 0.0, 0.95, 0.4, 0.8), (-0.25, 2.4, 0.3, 0.6, 0.3, 0.55),
                                  (0.15, 2.35, -0.5, 0.55, 0.28, 0.5), (1.05, 2.35, 0.2, 0.5, 0.26, 0.5)]:
        c.blob(x, y, z, rx, ry, rz, rng.choice(greens), seg=6, rings=3, jit=0.14, seed=rng.randint(0, 99))
    # many thin hanging strands of varied length, reaching almost to the ground
    for i in range(34):
        a = 2 * math.pi * i / 34 + rng.uniform(-0.15, 0.15)
        rr = rng.uniform(0.55, 1.25)
        x, z = 0.4 + math.cos(a) * rr, math.sin(a) * rr * 0.9
        top = 2.45 + rng.uniform(-0.12, 0.05)
        bottom = rng.choice((0.25, 0.4, 0.6, 0.85, 1.1, 1.4))
        sway = rng.uniform(-0.05, 0.1)
        limb(c, (x, top, z), (x * 1.1 + sway, bottom + 0.0, z * 1.1 + sway), 0.085, 0.02,
             rng.choice(greens), seg=3)
    c.done()


@model("tree_orchard", "prop", 1, 1, "A small orchard tree with red apples ('tree_orchard_Crown' sways)")
def tree_orchard():
    p = Part("tree_orchard")
    p.cyl(0, 0, 0, 0.09, 1.0, "trunk", seg=5, r_top=0.06)
    p.done()
    c = Part("tree_orchard_Crown", origin=(0, 1.0, 0))
    rng = random.Random(31)
    c.blob(0, 1.35, 0, 0.52, 0.42, 0.52, "leaf", seg=7, rings=3, jit=0.12, seed=31)
    for k in range(3):
        a = 2 * math.pi * k / 3
        c.blob(math.cos(a) * 0.3, 1.35 + rng.uniform(-0.1, 0.15), math.sin(a) * 0.3, 0.3, 0.25, 0.3,
               "leaf2", seg=6, rings=3, seed=31 + k)
    for _ in range(7):
        a, rr = rng.uniform(0, 2 * math.pi), rng.uniform(0.25, 0.5)
        c.blob(math.cos(a) * rr, rng.uniform(1.15, 1.6), math.sin(a) * rr, 0.045, 0.045, 0.045,
               "#b8443f", seg=4, rings=2, jit=0)
    c.done()


def _on_blob(rng, cx, cy, cz, rx, ry, rz, lo=0.15):
    """A random point on the upper surface of an ellipsoid (for blossoms and berries)."""
    th = rng.uniform(0, 2 * math.pi)
    y = rng.uniform(lo, 1.0)
    r = math.sqrt(1 - y * y)
    return cx + rx * r * math.cos(th) * 1.02, cy + ry * y, cz + rz * r * math.sin(th) * 1.02


@model("bush_hedge", "prop", 1, 1, "A clipped box hedge, flat-topped and dense")
def bush_hedge():
    p = Part("bush_hedge")
    p.box(-0.42, 0.0, -0.3, 0.84, 0.52, 0.6, "hedge", top=shade("hedge", 0.14), bottom=False)
    p.box(-0.32, 0.52, -0.2, 0.64, 0.05, 0.4, shade("hedge", 0.08))
    p.done()


@model("bush_blossom", "prop", 1, 1, "A rounded bush covered in pink and white blossom")
def bush_blossom():
    p = Part("bush_blossom")
    p.blob(0, 0.3, 0, 0.46, 0.34, 0.42, "leaf_dk", seg=7, rings=3, jit=0.1, seed=42, flat_bottom=True)
    rng = random.Random(42)
    for _ in range(30):
        x, y, z = _on_blob(rng, 0, 0.3, 0, 0.46, 0.34, 0.42, lo=0.0)
        p.blob(x, y, z, 0.075, 0.06, 0.075, rng.choice(["#f7eef3", "#f0b8cc", "#e98fb0", "#f5eef2"]), seg=4, rings=2, jit=0)
    p.done()


@model("bush_berry", "prop", 1, 1, "A dark-leaved bush with clusters of red berries")
def bush_berry():
    p = Part("bush_berry")
    p.blob(0, 0.26, 0, 0.44, 0.3, 0.4, "#35532f", seg=7, rings=3, jit=0.12, seed=43, flat_bottom=True)
    rng = random.Random(43)
    for _ in range(7):   # clusters of three
        x, y, z = _on_blob(rng, 0, 0.26, 0, 0.44, 0.3, 0.4, lo=0.1)
        for _k in range(3):
            p.blob(x + rng.uniform(-0.05, 0.05), y + rng.uniform(-0.03, 0.05), z + rng.uniform(-0.05, 0.05),
                   0.055, 0.055, 0.055, rng.choice(["#d0302b", "#c22a2a"]), seg=4, rings=2, jit=0)
    p.done()


@model("bush_large", "prop", 2, 2, "A big, many-lobed, light-green shrub, about 1.3 high")
def bush_large():
    p = Part("bush_large")
    rng = random.Random(44)
    p.blob(0, 0.55, 0, 0.8, 0.65, 0.75, "#86ae5d", seg=8, rings=4, jit=0.1, seed=44, flat_bottom=True)
    for k in range(6):
        a = 2 * math.pi * k / 6 + 0.3
        p.blob(math.cos(a) * 0.62, 0.5 + rng.uniform(-0.05, 0.3), math.sin(a) * 0.6, 0.45, 0.42 + rng.uniform(0, 0.15), 0.45,
               rng.choice(["#98be6c", "#7fa85a", "#a8c97a"]), seg=6, rings=3, jit=0.1, seed=44 + k, flat_bottom=True)
    p.blob(0.05, 1.0, 0, 0.5, 0.4, 0.5, "#a8c97a", seg=6, rings=3, jit=0.1, seed=50)
    p.done()


def rock(name, s, seed, col="fieldstone_dk"):
    p = Part(name)
    p.blob(0, 0.0, 0, 0.5 * s, 0.4 * s, 0.42 * s, col, seg=6, rings=3, jit=0.22, seed=seed, flat_bottom=True)
    p.done()


@model("rock_a", "prop", 1, 1, "A field stone")
def rock_a():
    rock("rock_a", 0.8, 1)


@model("rock_b", "prop", 1, 1, "A red badland rock")
def rock_b():
    rock("rock_b", 1.0, 2, "rock_red")


@model("boulder", "prop", 2, 2, "A glacial erratic boulder")
def boulder():
    rock("boulder", 2.2, 3, "#a49b8d")


@model("signpost", "prop", 1, 1, "A wooden fingerpost with two arms (Label3D on each arm)")
def signpost():
    p = Part("signpost")
    p.cbox(0, 0, 0, 0.12, 1.9, 0.12, "wood_dk", top="wood")
    p.prism([(0.05, 1.55), (0.85, 1.55), (0.95, 1.66), (0.85, 1.77), (0.05, 1.77)], -0.03, 0.03, "wood_lt")
    p.prism([(-0.05, 1.25), (-0.05, 1.47), (-0.85, 1.47), (-0.95, 1.36), (-0.85, 1.25)], -0.03, 0.03, "wood_lt")
    p.done()


@model("lantern_post", "prop", 1, 1, "A lantern on a wooden post (the light is '*_glow')")
def lantern_post():
    p = Part("lantern_post")
    p.cbox(0, 0, 0, 0.12, 1.7, 0.12, "wood_dk")
    p.box(-0.04, 1.6, -0.03, 0.45, 0.06, 0.06, "wood_dk")
    p.cbox(0.38, 1.2, 0, 0.2, 0.04, 0.2, "iron")
    p.cbox(0.38, 1.47, 0, 0.22, 0.04, 0.22, "iron")
    p.cone(0.38, 1.5, 0, 0.16, 0.12, "iron", seg=4, rot=45)
    p.done()
    g = Part("lantern_post_glow")
    g.cbox(0.38, 1.24, 0, 0.15, 0.23, 0.15, "#f3c977")
    g.done()


@model("bench", "prop", 2, 1, "A plank bench")
def bench():
    p = Part("bench")
    p.box(-0.75, 0.38, -0.18, 1.5, 0.07, 0.36, "wood")
    for x in (-0.6, 0.5):
        p.box(x, 0, -0.15, 0.1, 0.38, 0.3, "wood_dk")
    p.done()


@model("scarecrow", "prop", 1, 1, "A scarecrow on a pole")
def scarecrow():
    p = Part("scarecrow")
    p.cbox(0, 0, 0, 0.08, 1.9, 0.08, "wood_dk")
    p.cbox(0, 1.3, 0.05, 1.1, 0.07, 0.07, "wood_dk")
    p.cyl(0, 0.85, 0.05, 0.2, 0.55, "#6f7f5a", seg=6, r_top=0.24)
    p.box(-0.6, 1.2, 0.0, 1.2, 0.2, 0.12, "#6f7f5a")
    p.blob(0, 1.6, 0.05, 0.16, 0.18, 0.15, "sack", seg=6, rings=3, jit=0.05)
    p.cyl(0, 1.72, 0.05, 0.3, 0.03, "thatch", seg=8)
    p.cyl(0, 1.74, 0.05, 0.15, 0.17, "thatch", seg=8, r_top=0.1)
    for sx in (-0.62, 0.62):
        p.cone(sx, 1.15, 0.05, 0.07, 0.12, "hay", seg=4)
    p.done()


@model("herb_bed", "prop", 2, 1, "A raised herb bed")
def herb_bed():
    p = Part("herb_bed")
    p.box(-0.9, 0, -0.4, 1.8, 0.25, 0.8, "wood_dk", top="soil")
    rng = random.Random(8)
    for k in range(6):
        p.blob(-0.7 + k * 0.28, 0.33, rng.uniform(-0.15, 0.15), 0.13, 0.12, 0.13, rng.choice(["leaf", "leaf_dk", "#a3c27a", "#9e8fc0"]), seg=5, rings=3, seed=k)
    p.done()


@model("hen_coop", "prop", 2, 1, "A small hen coop on legs, with a ramp")
def hen_coop():
    p = Part("hen_coop")
    for x in (-0.6, 0.5):
        for z in (-0.3, 0.2):
            p.box(x, 0, z, 0.08, 0.4, 0.08, "wood_dk")
    p.box(-0.65, 0.4, -0.35, 1.3, 0.6, 0.7, "wood_lt")
    p.gable(1.3, 0.7, 1.0, 0.4, "thatch", over=0.1, gable_col="wood_lt")
    p.box(-0.15, 0.45, 0.35, 0.3, 0.35, 0.02, "#2c3236")
    p.quad((-0.12, 0.45, 0.37), (0.12, 0.45, 0.37), (0.12, 0.02, 0.9), (-0.12, 0.02, 0.9), "wood", out=(0, 1, 1))
    p.done()


@model("sigil_spot", "prop", 2, 2, "A place a sigil opens: gold rune ring on the ground ('*_glow', pulse it in the game)")
def sigil_spot():
    p = Part("sigil_spot")
    p.cyl(0, 0, 0, 0.9, 0.06, "fieldstone_dk", seg=12, top_col="stone")
    p.done()
    g = Part("sigil_spot_glow")
    n = 16
    for i in range(n):   # outer ring
        a0, a1 = 2 * math.pi * i / n, 2 * math.pi * (i + 1) / n
        o0, o1 = (0.8 * math.cos(a0), -0.8 * math.sin(a0)), (0.8 * math.cos(a1), -0.8 * math.sin(a1))
        i0, i1 = (0.7 * math.cos(a0), -0.7 * math.sin(a0)), (0.7 * math.cos(a1), -0.7 * math.sin(a1))
        g.quad((o0[0], 0.065, o0[1]), (o1[0], 0.065, o1[1]), (i1[0], 0.065, i1[1]), (i0[0], 0.065, i0[1]), "gold", out=(0, 1, 0))
    # a balance mark inside (Chapter 1's sigil): a beam and two pans
    g.box(-0.45, 0.065, -0.03, 0.9, 0.005, 0.06, "gold")
    g.box(-0.03, 0.065, -0.4, 0.06, 0.005, 0.45, "gold")
    for sx in (-0.4, 0.4):
        g.cyl(sx, 0.065, 0.15, 0.14, 0.005, "gold", seg=8)
    g.done()


@model("stepping_stones", "prop", 2, 2, "Flat stepping stones for a garden path")
def stepping_stones():
    p = Part("stepping_stones")
    for (x, z) in [(-0.5, 0.7), (0.0, 0.1), (0.45, -0.55)]:
        p.cyl(x, 0.0, z, 0.28, 0.1, "stone", seg=7, rot=x * 50)
    p.done()


@model("sheep", "prop", 1, 1, "A sheep (static; batch 2 animates the flock)")
def sheep():
    p = Part("sheep")
    for x in (-0.18, 0.18):
        for z in (-0.12, 0.12):
            p.cbox(x, 0, z, 0.07, 0.3, 0.07, "sheep_face")
    p.blob(0, 0.45, 0, 0.36, 0.25, 0.26, "wool", seg=7, rings=4, jit=0.12, seed=4)
    p.blob(-0.1, 0.62, 0.05, 0.18, 0.12, 0.16, "wool_dk", seg=5, rings=3, jit=0.1, seed=5)
    p.cbox(0.4, 0.45, 0, 0.18, 0.2, 0.15, "sheep_face")
    p.cbox(0.44, 0.58, 0, 0.12, 0.08, 0.2, "wool")
    for z in (-0.11, 0.11):
        p.cbox(0.38, 0.56, z, 0.05, 0.04, 0.09, "sheep_face")
    p.done()


@model("hen", "prop", 1, 1, "A hen (static)")
def hen():
    p = Part("hen")
    p.blob(0, 0.18, 0, 0.13, 0.11, 0.1, "#b9733e", seg=6, rings=3, jit=0.05, seed=1)
    p.blob(0.1, 0.3, 0, 0.06, 0.06, 0.05, "#b9733e", seg=5, rings=3, jit=0)
    p.cone(0.16, 0.3, 0, 0.02, 0.05, "#e0a33a", seg=3, rot=90)
    p.cbox(0.11, 0.36, 0, 0.03, 0.04, 0.02, "#c6463a")
    p.cone(-0.12, 0.2, 0, 0.06, 0.14, "#7a4a2a", seg=4)
    for z in (-0.04, 0.04):
        p.cbox(0, 0, z, 0.02, 0.08, 0.02, "#e0a33a")
    p.done()


# ─────────────────────────────── Chapter 2 props (T-031, 2026-11-14) ───────────────────────────────
# Design: _courses/math-9/realm-game/math9-realm-ch2-design-v1.md §7-§9. Existing names kept as they were: the old
# 'boulder' (2.2 blob, 0.9 high) and 'cart' (two-wheeled hand cart) stay; the new ones are boulder_big and cart_farm.
CH2 = "Chapter 2, 2026-11-14. "
BRONZE, BRONZE_DK, BRONZE_LT = "#b88a44", "#8a6430", "#d9b068"


def _ngon(cx, cy, r, n, rot=0.0):
    """A convex polygon profile, counter-clockwise seen from +z (for Part.prism)."""
    return [(cx + r * math.cos(rot + 2 * math.pi * i / n), cy + r * math.sin(rot + 2 * math.pi * i / n)) for i in range(n)]


def _leaf2(p, pts, col):
    """A leaf or petal drawn from both sides, so it shows from any angle."""
    p.face(pts, col)
    p.face(list(reversed(pts)), shade(col, -0.12))


def _sack_at(p, x, y, z, s=0.8, col="sack"):
    p.cyl(x, y, z, 0.2 * s, 0.42 * s, col, seg=7, r_top=0.15 * s)
    p.cyl(x, y + 0.42 * s, z, 0.09 * s, 0.1 * s, col, seg=6, r_top=0.12 * s)
    p.cyl(x, y + 0.44 * s, z, 0.1 * s, 0.03 * s, "rope", seg=6)


def _blocks(p, x0, x1, y0, y1, z0, z1, rng, cw=0.55, ch=0.34, stagger=True):
    """A dressed-stone face: courses of blocks in grey tones. The back (z0) stays flat; fronts vary a hair."""
    y, row = y0, 0
    while y < y1 - 0.01:
        h = min(ch, y1 - y)
        x = x0 - (cw * 0.45 if (row % 2 and stagger) else 0)
        while x < x1 - 0.01:
            w = cw * rng.uniform(0.8, 1.3)
            a, b = max(x0, x), min(x1, x + w)
            if x1 - b < 0.12:
                b = x1
            if b - a > 0.05:
                p.box(a + 0.008, y + 0.008, z0, b - a - 0.016, h - 0.016, (z1 - z0) + rng.uniform(-0.02, 0.0), rng.choice(TW_STONE))
            x = b if b > x + 0.01 else x + w
        y += ch
        row += 1


@model("vault_door", "building", 5, 1,
       CH2 + "The seed vault door, set in a grey stone frame with a flat back (stand it against a bank, door +z). Frame 4.8 wide, "
       "2.45 high, 1 deep; opening 2 wide x 1.9 high. Child parts: 'Door' (the slab, pivot at its left hinge edge x=-1, y=0, so it "
       "slides along x or swings about y), 'Dial' (bronze dial on the right pier, pivot at its centre, spins about z, raised "
       "pointer), 'Pan' (bronze scale pan on three chains, pivot at the hang point on the left pier's arm). With 'Door' hidden the "
       "opening shows a dark recess and a rack with three seed sacks.")
def vault_door():
    rng = random.Random(21)
    p = Part("vault_door")
    # piers, jambs, lintel
    _blocks(p, -2.4, -1.5, 0, 2.3, -0.5, 0.5, rng, cw=0.45)
    _blocks(p, 1.5, 2.4, 0, 2.3, -0.5, 0.5, rng, cw=0.45)
    _blocks(p, -1.5, -1.0, 0, 1.9, -0.5, 0.5, rng, cw=0.5)
    _blocks(p, 1.0, 1.5, 0, 1.9, -0.5, 0.5, rng, cw=0.5)
    _blocks(p, -1.5, 1.5, 1.9, 2.3, -0.5, 0.5, rng, cw=0.6, ch=0.4)
    p.box(-1.05, 1.82, 0.5, 2.1, 0.1, 0.05, "#7f8591")              # lintel drip course
    p.box(-2.55, 2.3, -0.5, 5.1, 0.13, 1.1, "#8f939d", top="#a1a5ae")  # cap slab
    p.box(-1.1, 0.0, 0.18, 2.2, 0.07, 0.7, "fieldstone_dk", top="fieldstone")   # threshold step
    # the recess behind the door
    p.quad((-1, 0.03, -0.46), (1, 0.03, -0.46), (1, 1.9, -0.46), (-1, 1.9, -0.46), "#23262b", out=(0, 0, 1))
    p.quad((-1, 0.03, 0.5), (1, 0.03, 0.5), (1, 0.03, -0.5), (-1, 0.03, -0.5), "#3b342d", out=(0, 1, 0))
    p.quad((-1, 1.9, -0.5), (1, 1.9, -0.5), (1, 1.9, 0.5), (-1, 1.9, 0.5), "#1c1f23", out=(0, -1, 0))
    for sx in (-0.88, 0.88):   # rack: four posts, three shelves, three seed sacks
        for z in (-0.42, -0.12):
            p.cbox(sx, 0.03, z, 0.06, 1.65, 0.06, "wood_dk")
    for y in (0.4, 0.95, 1.5):
        p.box(-0.9, y, -0.44, 1.8, 0.05, 0.34, "wood")
    _sack_at(p, -0.5, 0.45, -0.27, 0.75)
    _sack_at(p, 0.15, 0.45, -0.27, 0.75, "#c3ae88")
    _sack_at(p, -0.1, 1.0, -0.27, 0.75)
    # a keeper's iron lamp hook and a dark stone beside the dial (six faint rows, no text)
    p.box(1.62, 0.25, 0.5, 0.66, 0.68, 0.04, "#7f8591")
    for i in range(6):
        p.box(1.68, 0.3 + i * 0.1, 0.54, 0.54, 0.02, 0.012, "#5d626b")
    # the pan's bracket on the left pier: arm out of the wall and a diagonal brace
    p.box(-2.0, 1.95, 0.5, 0.1, 0.1, 0.42, "iron")
    limb(p, (-1.95, 1.45, 0.5), (-1.95, 1.97, 0.88), 0.04, 0.035, "iron", seg=4)
    p.done()

    # Door: pivot at the left hinge edge (x = -1, y = 0, z = 0.05)
    d = Part("Door", origin=(-1.0, 0.0, 0.05))
    d.box(-0.99, 0.0, -0.1, 1.98, 1.9, 0.3, "#8f939d", top="#a1a5ae")
    for k, x in enumerate((-0.5, 0.0, 0.5)):   # plank seams
        d.box(x - 0.012, 0.05, 0.2, 0.024, 1.8, 0.012, "#6a6e77")
    for y in (0.35, 0.95, 1.55):   # iron bands with studs
        d.box(-0.99, y, 0.2, 1.98, 0.13, 0.03, "iron")
        for x in (-0.85, -0.45, 0.0, 0.45, 0.85):
            d.box(x - 0.035, y + 0.035, 0.23, 0.07, 0.07, 0.03, "metal_lt")
    d.cyl(0.7, 0.88, 0.2, 0.12, 0.06, "iron", seg=8, top_col="#5b5651")   # iron pull plate
    d.cyl(0.7, 0.9, 0.26, 0.05, 0.05, "metal_lt", seg=6)
    d.done()

    # Dial: pivot at its centre (1.95, 1.4), axis along z
    cx, cy, z0 = 1.95, 1.4, 0.5
    q = Part("Dial", origin=(cx, cy, z0))
    q.prism(_ngon(cx, cy, 0.42, 12, math.radians(15)), z0, z0 + 0.1, BRONZE_DK, cap=BRONZE_DK)
    q.prism(_ngon(cx, cy, 0.36, 12, math.radians(15)), z0 + 0.1, z0 + 0.13, BRONZE, cap=BRONZE)
    for i in range(12):   # tick marks
        a = 2 * math.pi * i / 12
        ca, sa = math.cos(a), math.sin(a)
        r0, r1, hw = (0.27, 0.34, 0.022) if i % 3 else (0.25, 0.35, 0.03)
        q.quad((cx + ca * r0 + sa * hw, cy + sa * r0 - ca * hw, z0 + 0.135), (cx + ca * r1 + sa * hw, cy + sa * r1 - ca * hw, z0 + 0.135),
               (cx + ca * r1 - sa * hw, cy + sa * r1 + ca * hw, z0 + 0.135), (cx + ca * r0 - sa * hw, cy + sa * r0 + ca * hw, z0 + 0.135),
               "#4a3a22", out=(0, 0, 1))
    q.prism([(cx - 0.05, cy - 0.1), (cx + 0.05, cy - 0.1), (cx + 0.045, cy + 0.26), (cx, cy + 0.34), (cx - 0.045, cy + 0.26)],
            z0 + 0.13, z0 + 0.19, BRONZE_LT, cap="#f0cf86")   # raised pointer (points up at rest)
    q.prism(_ngon(cx, cy, 0.09, 8), z0 + 0.13, z0 + 0.22, BRONZE_LT, cap="#f0cf86")   # hub boss
    q.done()

    # Pan: pivot at the hang point on the arm
    hx, hy, hz = -1.95, 1.93, 0.88
    n = Part("Pan", origin=(hx, hy, hz))
    n.cyl(hx, 1.0, hz, 0.2, 0.1, BRONZE_DK, seg=8, r_top=0.34, top=False)
    n.cyl(hx, 1.1, hz, 0.34, 0.025, BRONZE, seg=8, r_top=0.36, top_col=BRONZE_LT)
    n.cyl(hx, 1.0, hz, 0.2, 0.01, BRONZE_DK, seg=8, top=False, bottom=True)
    for i in range(3):   # three chains from the hang ring to the rim
        a = 2 * math.pi * i / 3 + 0.5
        limb(n, (hx, hy, hz), (hx + 0.33 * math.cos(a), 1.13, hz - 0.33 * math.sin(a)), 0.014, 0.014, "#6b6258", seg=3)
    n.cyl(hx, hy - 0.03, hz, 0.05, 0.06, "iron", seg=6)   # the hang ring
    n.done()


def _boulder(name, s, seed):
    p = Part(name)
    p.blob(0, 0.0, 0, 1.0 * s, 1.25 * s, 0.95 * s, "#8c8376", seg=9, rings=5, jit=0.14, seed=seed, flat_bottom=True)
    p.blob(-0.55 * s, 0, 0.4 * s, 0.6 * s, 0.7 * s, 0.55 * s, "#9a9082", seg=7, rings=3, jit=0.18, seed=seed + 1, flat_bottom=True)
    p.blob(0.6 * s, 0, -0.3 * s, 0.55 * s, 0.6 * s, 0.5 * s, "#7a7166", seg=7, rings=3, jit=0.18, seed=seed + 2, flat_bottom=True)
    p.blob(0.0 * s, 0.0, -0.55 * s, 0.5 * s, 0.8 * s, 0.4 * s, "#82796d", seg=6, rings=3, jit=0.18, seed=seed + 3, flat_bottom=True)
    p.done()


@model("boulder_big", "prop", 2, 2, CH2 + "A big rough grey-brown rock filling 2 x 2 tiles, about 1.25 high (taller than a person); blocks the Low Road. The pack's old 'boulder' is 0.9 high and stays.")
def boulder_big():
    _boulder("boulder_big", 1.0, 31)


@model("boulder_small", "prop", 1, 1, CH2 + "The same rock at 0.4 scale (about 0.8 wide, 0.5 high), for the road verge.")
def boulder_small():
    _boulder("boulder_small", 0.4, 31)


@model("cart_farm", "prop", 2, 1,
       CH2 + "A four-wheeled wooden farm cart with two shafts out to +x for one horse, loaded with five seed sacks; about 2 long (x -0.8..1.2), bed 0.45 up. The pack's old 'cart' is a two-wheeled hand cart with no shafts and stays.")
def cart_farm():
    import mathutils
    p = Part("cart_farm")
    p.box(-0.8, 0.42, -0.4, 1.4, 0.07, 0.8, "wood", top="wood_lt")
    for z in (-0.43, 0.39):
        p.box(-0.8, 0.49, z, 1.4, 0.25, 0.04, "wood_lt")
    p.box(-0.84, 0.49, -0.43, 0.04, 0.25, 0.86, "wood_lt")   # tailboard
    p.box(0.6, 0.49, -0.43, 0.04, 0.25, 0.86, "wood_lt")     # front board
    for x in (-0.55, 0.3):   # axles and bolsters
        p.box(x - 0.03, 0.3, -0.5, 0.06, 0.06, 1.0, "wood_dk")
        p.box(x - 0.08, 0.36, -0.36, 0.16, 0.06, 0.72, "wood_dk")
    for x, r in ((-0.55, 0.32), (0.3, 0.26)):
        for z in (-0.47, 0.47):
            p.xf = mathutils.Matrix.Translation((x, r, z)) @ mathutils.Matrix.Rotation(math.radians(90), 4, "X")
            p.cyl(0, -0.04, 0, r, 0.08, "wood_dk", seg=10, top_col="wood", bottom=True)
            p.box(-r, -0.045, -0.025, 2 * r, 0.09, 0.05, "wood_dk")    # spokes
            p.box(-0.025, -0.045, -r, 0.05, 0.09, 2 * r, "wood_dk")
            p.cyl(0, -0.07, 0, 0.07, 0.14, "iron", seg=6)
            p.reset()
    for z in (-0.2, 0.2):   # shafts
        limb(p, (0.3, 0.45, z), (1.2, 0.6, z * 0.9), 0.035, 0.03, "wood_dk", seg=4)
    p.box(1.1, 0.56, -0.22, 0.05, 0.05, 0.44, "wood_dk")   # swingletree
    p.box(-0.78, 0.3, -0.1, 0.4, 0.05, 0.2, "wood_dk")     # rear brace
    for (x, z) in ((-0.55, -0.18), (-0.2, -0.18), (0.15, -0.18), (-0.45, 0.18), (-0.05, 0.18)):
        _sack_at(p, x, 0.49, z, 0.82)
    p.done()


@model("tally_board", "prop", 2, 1, CH2 + "A standing notice board on two posts, 1.25 high, 1.5 wide: pale chalk face with five faint horizontal rows (no text; the game can put Label3D on it), chalk ledge. Face +z.")
def tally_board():
    p = Part("tally_board")
    for x in (-0.65, 0.65):
        p.cbox(x, 0, 0, 0.1, 1.25, 0.1, "wood_dk", top="wood")
    p.box(-0.78, 0.5, -0.05, 1.56, 0.75, 0.1, "wood")            # frame
    p.box(-0.7, 0.57, 0.05, 1.4, 0.61, 0.025, "#e6e2d4")          # chalk face
    for i in range(5):
        p.box(-0.64, 0.64 + i * 0.1, 0.075, 1.28, 0.014, 0.004, "#cdc8b8")
    p.box(-0.5, 0.45, 0.0, 1.0, 0.05, 0.12, "wood_dk")           # ledge
    p.box(-0.1, 0.5, 0.06, 0.12, 0.025, 0.03, "#f4f1e8")          # chalk stub
    p.box(-0.82, 1.25, -0.08, 1.64, 0.05, 0.2, "wood_dk", top="wood")   # cap board
    p.done()


@model("vine", "prop", 1, 1,
       CH2 + "The Growth sigil's climbing vine. Child 'Vine' has its origin on the ground (0,0,0): scale it only on y, 0.05 to 1 (4 high at 1). "
       "A twisting green stem, a thinner twin, leaves and five green-gold buds. 'vine_base' is a small earth mound with roots that stays put.")
def vine():
    b = Part("vine_base")
    b.blob(0, 0, 0, 0.3, 0.1, 0.3, "#6a4f3a", seg=7, rings=2, jit=0.1, seed=5, flat_bottom=True)
    for k in range(5):
        a = 2 * math.pi * k / 5
        limb(b, (0, 0.05, 0), (0.42 * math.cos(a), 0.01, -0.42 * math.sin(a)), 0.05, 0.015, "#5d6f3b", seg=4)
    b.done()
    p = Part("Vine")
    rng = random.Random(8)
    H, n = 4.0, 32
    leaf_cols = ["#5f9a4a", "#76b05a", "#4d8540", "#8cc063"]

    def stem(phase, rad, top, w0, w1, col, step=0.9, leaves=True, buds=0):
        pts = []
        for i in range(n + 1):
            t = i / n
            if t * H > top:
                break
            ang = phase + i * step
            r = rad * (1 - 0.4 * t) + 0.04 * math.sin(i * 1.3)
            pts.append((r * math.cos(ang), t * H, -r * math.sin(ang), ang))
        for i in range(len(pts) - 1):
            w = w0 + (w1 - w0) * i / n
            limb(p, pts[i][:3], pts[i + 1][:3], w, w * 0.92, col, seg=4)
            if leaves and i % 2 == 1 and i > 1:
                x, y, z, ang = pts[i]
                ca, sa = math.cos(ang), math.sin(ang)
                L = 0.5 - 0.14 * (i / n)
                for sgn in (1,):
                    tip = (x + ca * L, y + 0.1, z - sa * L)
                    mid = (x + ca * L * 0.5, y + 0.05, z - sa * L * 0.5)
                    wv = (-sa * 0.17, 0, -ca * 0.17)
                    _leaf2(p, [(x, y, z), (mid[0] + wv[0], mid[1], mid[2] + wv[2]), tip, (mid[0] - wv[0], mid[1], mid[2] - wv[2])], rng.choice(leaf_cols))
        return pts

    A = stem(0.0, 0.16, 4.0, 0.06, 0.022, "#4d7a3f")
    B = stem(math.pi, 0.15, 3.3, 0.03, 0.014, "#5d8c48", step=0.9, leaves=False)
    for i in (14, 17, 21, 25, 28):   # buds on short stalks from the twin stem
        src = B[min(i, len(B) - 1)]
        ang = src[3]
        tip = (src[0] + math.cos(ang) * 0.2, src[1] + 0.07, src[2] - math.sin(ang) * 0.2)
        limb(p, src[:3], tip, 0.012, 0.01, "#5d8c48", seg=3)
        p.blob(tip[0], tip[1] + 0.04, tip[2], 0.05, 0.07, 0.05, rng.choice(["#c9d65a", "#e2c25a"]), seg=5, rings=3, jit=0.08, seed=i)
    p.blob(A[-1][0], A[-1][1] + 0.05, A[-1][2], 0.05, 0.08, 0.05, "#e2c25a", seg=5, rings=3, jit=0.06, seed=99)
    p.done()


@model("smoke_pot", "prop", 1, 1,
       CH2 + "A small clay pot (0.3 high) with a lid pierced by holes, to sit on a beam or the ground. Child 'Smoke' (pivot just above the lid, y = 0.34) is the soft pale-grey puff; hide it to stop the smoke.")
def smoke_pot():
    p = Part("smoke_pot")
    p.cyl(0, 0, 0, 0.1, 0.17, "#a9633c", seg=8, r_top=0.15, top=False)
    p.cyl(0, 0.17, 0, 0.15, 0.04, "#8f4f31", seg=8, r_top=0.14, top_col="#8f4f31")
    p.cyl(0, 0.21, 0, 0.13, 0.04, "#b9714a", seg=8, r_top=0.1, top_col="#b9714a")   # lid dome
    p.cyl(0, 0.25, 0, 0.03, 0.04, "#8f4f31", seg=5, r_top=0.02)                      # lid knob
    for i in range(6):   # holes
        a = 2 * math.pi * i / 6
        p.box(0.085 * math.cos(a) - 0.015, 0.245, -0.085 * math.sin(a) - 0.015, 0.03, 0.006, 0.03, "#2b2420")
    p.cbox(0.17, 0.12, 0, 0.05, 0.05, 0.04, "#8f4f31")   # little handles
    p.cbox(-0.17, 0.12, 0, 0.05, 0.05, 0.04, "#8f4f31")
    p.done()
    s = Part("Smoke", origin=(0, 0.34, 0))
    for (x, y, z, r, c, sd) in [(0, 0.4, 0, 0.09, "#d9d9dd", 1), (0.04, 0.52, 0.02, 0.12, "#cfcfd4", 2), (-0.03, 0.66, -0.02, 0.14, "#e2e2e6", 3)]:
        s.blob(x, y, z, r, r * 0.85, r, c, seg=6, rings=3, jit=0.12, seed=sd)
    s.done()


@model("moth_nest", "prop", 1, 1, CH2 + "A grey papery nest clump about sack size (0.5 wide, 0.4 high) with a flat underside, to sit on a roof or beam; darker specks on it.")
def moth_nest():
    p = Part("moth_nest")
    rng = random.Random(6)
    cy = 0.35 * 0.2
    p.blob(0, cy, 0, 0.26, 0.2, 0.22, "#b9b6ad", seg=7, rings=4, jit=0.14, seed=3, flat_bottom=True)
    p.blob(0.12, cy + 0.1, 0.05, 0.14, 0.12, 0.13, "#c4c1b8", seg=6, rings=3, jit=0.15, seed=4)
    p.blob(-0.14, cy + 0.04, -0.06, 0.13, 0.11, 0.12, "#a7a49b", seg=6, rings=3, jit=0.15, seed=5)
    for k in range(9):   # specks
        a, v = rng.uniform(0, 2 * math.pi), rng.uniform(0.2, 1.2)
        x, y, z = 0.25 * math.sin(v) * math.cos(a), cy + 0.2 * math.cos(v), -0.21 * math.sin(v) * math.sin(a)
        p.blob(x, y, z, 0.022, 0.016, 0.022, "#4f4c46", seg=4, rings=2, jit=0)
    p.done()


def _seed_pot(name, sprout):
    p = Part(name)
    p.cyl(0, 0, 0, 0.1, 0.17, "#b9683f", seg=8, r_top=0.125, top=False)
    p.cyl(0, 0.17, 0, 0.14, 0.05, "#a5593a", seg=8, r_top=0.14, top_col="#7a5a44", bottom=False)   # rim
    p.cyl(0, 0.2, 0, 0.115, 0.01, "#3b2a20", seg=8, top_col="#3b2a20")                              # dark soil
    if sprout:
        limb(p, (0, 0.2, 0), (0.01, 0.36, 0), 0.012, 0.01, "#5f9a4a", seg=3)
        for sgn in (-1, 1):
            _leaf2(p, [(0.01, 0.34, 0), (0.07 * sgn, 0.37, 0.03), (0.14 * sgn, 0.39, 0), (0.07 * sgn, 0.38, -0.03)], "#7fba5a")
        p.cone(0.01, 0.35, 0, 0.025, 0.06, "#8cc063", seg=3)
    p.done()


@model("seed_pot", "prop", 0.5, 0.5, CH2 + "A small terracotta pot, dark soil, one green sprout; 0.28 wide, 0.4 high, made for a 0.5 pitch (a 6 x 6 square fits a 3 x 3 bed).")
def seed_pot():
    _seed_pot("seed_pot", True)


@model("seed_pot_empty", "prop", 0.5, 0.5, CH2 + "The seed pot with soil and no sprout (0.2 high).")
def seed_pot_empty():
    _seed_pot("seed_pot_empty", False)


@model("growth_marker", "prop", 2, 2, CH2 + "A place the Growth sigil opens: the same stone disc as 'sigil_spot' with a green-gold six-pointed star and ring in 'growth_marker_glow' (unlit; pulse it).")
def growth_marker():
    p = Part("growth_marker")
    p.cyl(0, 0, 0, 0.9, 0.06, "fieldstone_dk", seg=12, top_col="stone")
    p.done()
    g = Part("growth_marker_glow")
    y = 0.065
    n = 16
    for i in range(n):   # outer ring
        a0, a1 = 2 * math.pi * i / n, 2 * math.pi * (i + 1) / n
        o0, o1 = (0.8 * math.cos(a0), -0.8 * math.sin(a0)), (0.8 * math.cos(a1), -0.8 * math.sin(a1))
        i0, i1 = (0.7 * math.cos(a0), -0.7 * math.sin(a0)), (0.7 * math.cos(a1), -0.7 * math.sin(a1))
        g.quad((o0[0], y, o0[1]), (o1[0], y, o1[1]), (i1[0], y, i1[1]), (i0[0], y, i0[1]), "#c8d85a", out=(0, 1, 0))
    R, r = 0.6, 0.6 / math.sqrt(3)   # a six-pointed star: 12 points alternating outer and inner
    pts = [((R if i % 2 == 0 else r) * math.cos(math.pi / 2 + math.pi * i / 6), -(R if i % 2 == 0 else r) * math.sin(math.pi / 2 + math.pi * i / 6)) for i in range(12)]
    for i in range(12):
        a, b = pts[i], pts[(i + 1) % 12]
        g.tri((0, y, 0), (a[0], y, a[1]), (b[0], y, b[1]), "#e2c25a" if i % 2 else "#a8cf4f", out=(0, 1, 0))
    g.done()


def _patch(name, cols, seed, tufts=None):
    rng = random.Random(seed)
    p = Part(name)
    n = 11
    top, low = 0.095, 0.07
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        r = rng.choice([0.3, 0.38, 0.5, 0.55, 0.42])
        pts.append((r * math.cos(a) * 1.05, -r * math.sin(a) * 0.9))
    for i in range(n):   # fan from a centre, each triangle its own tone
        a, b = pts[i], pts[(i + 1) % n]
        p.tri((0, top, 0), (a[0], top, a[1]), (b[0], top, b[1]), cols[(i + seed) % len(cols)], out=(0, 1, 0))
        p.quad((a[0], low, a[1]), (b[0], low, b[1]), (b[0], top, b[1]), (a[0], top, a[1]), shade(cols[0], -0.3), (0, 0.08, 0))
    for k in range(3):   # satellite flecks
        a = rng.uniform(0, 2 * math.pi)
        cx, cz = 0.58 * math.cos(a), -0.52 * math.sin(a)
        s = rng.uniform(0.07, 0.1)
        p.face([(cx - s, top - 0.004, cz - s * 0.6), (cx - s * 0.5, top - 0.004, cz + s), (cx + s, top - 0.004, cz + s * 0.4), (cx + s * 0.6, top - 0.004, cz - s)],
               cols[k % len(cols)], out=(0, 1, 0))
    if tufts:
        t = tufts
        for k in range(t["n"]):
            a, rr = rng.uniform(0, 2 * math.pi), rng.uniform(0.05, 0.4)
            p.cone(rr * math.cos(a), top, -rr * math.sin(a), 0.035, rng.uniform(0.04, 0.06), t["col"], seg=3, rot=rng.uniform(0, 120))
    p.done()


@model("blight_patch", "prop", 1, 1, CH2 + "A flat irregular patch of grey blighted ground, about 1 tile across and 0.1 high (top 0.095, over path height), walkable. Same shape as moss_patch.")
def blight_patch():
    _patch("blight_patch", ["#8d8d90", "#7c7c80", "#9a9a9c", "#6f6f74"], 12)


@model("moss_patch", "prop", 1, 1, CH2 + "The blight patch in fresh green moss (same shape), 0.1 high, a few low tufts.")
def moss_patch_model():
    _patch("moss_patch", ["#6aa84f", "#5b9a48", "#7cb85c", "#8cc063"], 12, tufts={"n": 6, "col": "#86bf5a"})


# ─────────────────────────────── build ───────────────────────────────

def main():
    a = args()
    out = a.get("out", OUT)
    only = set(a["only"].split(",")) if "only" in a else None
    manifest = {"pack": "emberdale", "units": "1 = 1 map tile; footprint centred on the origin; door +z", "models": {}}
    mpath = os.path.join(out, "pack.json")
    if only and os.path.exists(mpath):
        manifest = json.load(open(mpath))
    for name, m in MODELS.items():
        if only and name not in only:
            continue
        clear()
        m["fn"]()
        import bpy
        bpy.context.view_layer.update()
        hi = max((max((ob.matrix_world @ v.co).z for v in ob.data.vertices) for ob in bpy.data.objects if ob.type == "MESH" and len(ob.data.vertices)), default=0)
        tris = sum(sum(len(pl.vertices) - 2 for pl in ob.data.polygons) for ob in bpy.data.objects if ob.type == "MESH")
        export(os.path.join(out, name + ".glb"))
        manifest["models"][name] = {"kind": m["kind"], "w": m["w"], "d": m["d"], "h": round(hi, 2), "tris": tris, "note": m["note"]}
        print("built %-22s %-8s %dx%d  h=%.2f  tris=%d" % (name, m["kind"], m["w"], m["d"], hi, tris))
    with open(mpath, "w") as f:
        json.dump(manifest, f, indent=1)


if __name__ == "__main__":
    main()
