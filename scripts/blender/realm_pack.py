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
from kit import Part, shade, clear, export, args

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "godot", "cefl-town-v2", "assets", "realm", "emberdale")
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


@model("t_footpath", "terrain", 2, 2, "A narrow footpath through grass (runs along z)")
def t_footpath():
    p = Part("t_footpath")
    ground(p, GRASS_Y, "grass")
    p.box(-0.35, GRASS_Y, -1, 0.7, 0.02, 2, "path")
    grass_tufts(p, 4, 2, 2, GRASS_Y, 13)
    p.done()


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


@model("t_square", "terrain", 2, 2, "Highstead market square: worn flagstones (walkable)")
def t_square():
    p = Part("t_square")
    p.box(-1, 0.14 - 0.3, -1, 2, 0.3, 2, "fieldstone_dk", top="mortar")
    rng = random.Random(12)
    for i in range(4):
        for k in range(4):
            jt = rng.uniform(-0.02, 0.02)
            p.box(-0.97 + k * 0.5, 0.14, -0.97 + i * 0.5 + jt, 0.44, 0.015, 0.44, rng.choice(["stone", "fieldstone", shade("stone", -0.06)]))
    p.done()


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


def tree(name, crown_cols, trunk_h=1.4, r=0.85, seed=0, pine=False):
    p = Part(name)
    p.cyl(0, 0, 0, 0.13, trunk_h + 0.3, "trunk", seg=5, r_top=0.08)
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
