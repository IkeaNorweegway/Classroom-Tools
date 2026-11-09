# Math 9 Realm game — the people pack (batch 2): the student's hero, the Chapter 1 cast, the Hollow and the animals,
# each rigged with looping clips. Builds .glb files and a pack.json in assets/realm/people/.
#
#   flatpak run org.blender.Blender -b --python scripts/blender/realm_people.py -- [only=hero,orrin] [out=/abs/dir]
#
# Size: an adult is about 1.05 tall (a door is 1.3, a town person 0.97), Pell 0.85; place them at scale 1.
# Everyone faces +z and stands on y = 0, centred on the origin.
# Clips (24 fps, all loop): people idle, walk, talk, cast, cheer; the Hollow idle, walk, cast;
# sheep and lamb idle, walk, graze; hen idle, walk, peck; dog idle, walk, sit.
# A walk clip is one stride (two steps) in 1 s while covering about 1 tile; the game sets the speed.
#
# The hero is drawn in white and greys in slot meshes the game tints from the player's look (Pack.dress):
#   Skin, Hair_<style> (short long bun curly shaved braids), Top, Legs, Boots, Cloak; Fixed is never tinted;
#   Glasses shows only if the look asks for it. The cast and animals have their own colours.
import sys, os, json, math, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, kit
importlib.reload(kit)
from kit import Part, Rig, shade, clear, export, args
from mathutils import Matrix, Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "godot", "story-engine", "assets", "realm", "people")
MODELS = {}
INK = "#2b2622"


def model(name, kind, note=""):
    def reg(fn):
        MODELS[name] = {"fn": fn, "kind": kind, "note": note}
        return fn
    return reg


# ─────────────────────────────── people ───────────────────────────────

def bones_human(K, W):
    s = lambda v: tuple(K * c for c in v)
    ax = 0.235 * W
    b = [("root", None, s((0, 0, 0)), s((0, 0.12, 0))),
         ("hips", "root", s((0, 0.42, 0)), s((0, 0.52, 0))),
         ("chest", "hips", s((0, 0.46, 0)), s((0, 0.72, 0))),
         ("head", "chest", s((0, 0.72, 0)), s((0, 1.0, 0)))]
    for side, sx in (("L", 1), ("R", -1)):
        b += [("arm_" + side, "chest", s((sx * ax, 0.69, 0)), s((sx * ax, 0.48, 0))),
              ("fore_" + side, "arm_" + side, s((sx * ax, 0.48, 0)), s((sx * ax, 0.29, 0))),
              ("thigh_" + side, "hips", s((sx * 0.09, 0.44, 0)), s((sx * 0.09, 0.24, 0))),
              ("shin_" + side, "thigh_" + side, s((sx * 0.09, 0.24, 0)), s((sx * 0.09, 0.04, 0)))]
    return b


class Person:
    """Draws a person on a rig. Each colour slot can go to its own Part (the hero) or all to one (the cast)."""

    def __init__(self, rig, K=1.0, W=1.0, parts=None):
        self.rig, self.K, self.W = rig, K, W
        self.parts = parts                 # slot -> Part
        self.S = Matrix.Scale(K, 4)

    def p(self, slot, bone):
        q = self.parts.get(slot) or self.parts["*"]
        q.xf = self.S
        q.bone(bone)
        return q

    def at(self, q, x, y, z, yaw=0.0, pitch=0.0, roll=0.0):
        q.xf = (self.S @ Matrix.Translation(Vector((x, y, z))) @ Matrix.Rotation(math.radians(yaw), 4, "Y")
                @ Matrix.Rotation(math.radians(pitch), 4, "X") @ Matrix.Rotation(math.radians(roll), 4, "Z"))
        return q


def r_robe(y, top=0.48, hem=0.03, r_top=0.18, r_hem=0.3):
    """Radius of a robe skirt at height y (it flares from the waist to the hem)."""
    return r_hem + (r_top - r_hem) * (y - hem) / (top - hem)


def human(name, look, slots=False):
    """A person. look: K (size), W (build), colours skin hair top trim legs boots belt, and pieces:
    hair (short long bun curly shaved braids bald), beard (None short long), hat (None wizard slouch cap straw
    kerchief hood), robe (bool), cloak (colour), hood_down, apron (colour), shawl (colour), scarf (colour),
    item (None staff crook bucket slate ledger), satchel, chain, face (False: a Hollow's empty hood)."""
    K, W = look.get("K", 1.0), look.get("W", 1.0)
    rig = Rig(name + "_rig", bones_human(K, W))
    if slots:
        names = ["Skin", "Top", "Legs", "Boots", "Cloak", "Fixed", "Glasses"]
        parts = {n: Part(n) for n in names}
        for st in ("short", "long", "bun", "curly", "shaved", "braids"):
            parts["Hair_" + st] = Part("Hair_" + st)
        parts["*"] = parts["Fixed"]
    else:
        parts = {"*": Part(name)}
    P = Person(rig, K, W, parts)
    c = lambda k, d=None: look.get(k, d)
    skin, hair, top, trim = c("skin", "#e8b98f"), c("hair", "#5a3a22"), c("top", "#4f8fc8"), c("trim", None)
    legs, boots, belt = c("legs", "#4a4a52"), c("boots", "#5a4232"), c("belt", "#4b3a2c")
    robe, face = c("robe", False), c("face", True)
    trim = trim or shade(top, -0.2)

    # legs and boots (hidden under a robe but still drawn: they show at the hem when walking)
    for side, sx in (("L", 1), ("R", -1)):
        x = sx * 0.09
        if face:
            q = P.p("Legs", "thigh_" + side)
            q.cyl(x, 0.22, 0, 0.075, 0.23, legs, seg=6)
            q = P.p("Legs", "shin_" + side)
            q.cyl(x, 0.07, 0, 0.066, 0.17, legs, seg=6)
            q = P.p("Boots", "shin_" + side)
            q.box(x - 0.065, 0, -0.065, 0.13, 0.1, 0.2, boots, top=shade(boots, 0.08))
            q.cyl(x, 0.08, 0, 0.074, 0.07, shade(boots, -0.08), seg=6)
    # hips and torso
    q = P.p("Legs", "hips")
    q.cyl(0, 0.36, 0, 0.17 * W, 0.12, legs, seg=8)
    q = P.p("Top", "chest")
    q.cyl(0, 0.46, 0, 0.175 * W, 0.24, top, seg=8, r_top=0.2 * W, top=False)
    q.cyl(0, 0.7, 0, 0.2 * W, 0.05, shade(top, 0.04), seg=8, r_top=0.12, top=True)
    # skirt: a robe to the hem, or a tunic over the hips
    q = P.p("Top", "hips")
    if robe:
        q.cyl(0, 0.03, 0, 0.3 * W, 0.45, top, seg=8, r_top=0.18 * W, top=False, bottom=True)
        if look.get("ragged"):
            for i in range(10):   # torn hem
                a, a2 = 2 * math.pi * i / 10, 2 * math.pi * (i + 0.5) / 10
                r = 0.3 * W
                x0, z0 = r * math.cos(a), -r * math.sin(a)
                x1, z1 = r * math.cos(a + 2 * math.pi / 10), -r * math.sin(a + 2 * math.pi / 10)
                q.tri((x0, 0.03, z0), (x1, 0.03, z1), (r * 1.04 * math.cos(a2), -0.02, -r * 1.04 * math.sin(a2)), shade(top, -0.15), ctr=(0, 0.3, 0))
        else:
            q.cyl(0, 0.03, 0, 0.305 * W, 0.05, trim, seg=8, top=False)
    else:
        q.cyl(0, 0.29, 0, 0.205 * W, 0.18, top, seg=8, r_top=0.18 * W, top=False, bottom=True)
        q.cyl(0, 0.29, 0, 0.21 * W, 0.035, trim, seg=8, top=False)
    if face:
        q = P.p("Fixed", "hips")
        q.cyl(0, 0.44, 0, 0.183 * W, 0.045, belt, seg=8, top=False)
        q.box(-0.03, 0.435, 0.17 * W, 0.06, 0.055, 0.025, "gold_dk")
    # arms: sleeve, cuff, hand
    for side, sx in (("L", 1), ("R", -1)):
        x = sx * 0.235 * W
        q = P.p("Top", "arm_" + side)
        q.cyl(x, 0.47, 0, 0.058, 0.24, top, seg=6, r_top=0.066)
        q = P.p("Top", "fore_" + side)
        q.cyl(x, 0.33, 0, 0.054, 0.16, top, seg=6, r_top=0.058, top=False)
        q.cyl(x, 0.32, 0, 0.062 if robe else 0.058, 0.04, trim, seg=6)
        if face:
            q = P.p("Skin", "fore_" + side)
            q.blob(x, 0.285, 0.005, 0.05, 0.055, 0.05, skin, seg=6, rings=3, jit=0.05, seed=3)
        else:   # a Hollow's sleeve ends in shadow
            q = P.p("Fixed", "fore_" + side)
            q.cyl(x, 0.3, 0, 0.05, 0.03, "#1b1d22", seg=6)
    # neck and head
    if face:
        q = P.p("Skin", "head")
        q.cyl(0, 0.69, 0, 0.062, 0.1, skin, seg=6)
        q.blob(0, 0.88, 0, 0.17, 0.18, 0.168, skin, seg=8, rings=5, jit=0.03, seed=2)
        q.box(-0.02, 0.825, 0.155, 0.04, 0.05, 0.03, shade(skin, -0.08))           # nose
        for sx in (-1, 1):
            q.box(sx * 0.17 - 0.015, 0.85, -0.02, 0.03, 0.06, 0.05, shade(skin, -0.05))   # ears
        q = P.p("Fixed", "head")
        for sx in (-1, 1):
            q.box(sx * 0.062 - 0.02, 0.865, 0.148, 0.04, 0.05, 0.03, INK)            # eyes
        q.box(-0.035, 0.78, 0.15, 0.07, 0.015, 0.02, shade(skin, -0.3) if not slots else "#9a6a5a")   # mouth
        if slots or look.get("glasses"):
            q = P.p("Glasses", "head")
            for sx in (-1, 1):
                q.box(sx * 0.062 - 0.04, 0.85, 0.172, 0.08, 0.07, 0.01, "#2b2622")
                q.box(sx * 0.062 - 0.03, 0.86, 0.176, 0.06, 0.05, 0.008, "#9cc3d6")
            q.box(-0.025, 0.875, 0.172, 0.05, 0.015, 0.01, "#2b2622")
    else:   # no face: the hood holds shadow
        q = P.p("Fixed", "head")
        q.blob(0, 0.86, 0.03, 0.14, 0.15, 0.13, "#1b1d22", seg=7, rings=4, jit=0.05, seed=9)
    # hair
    styles = ["short", "long", "bun", "curly", "shaved", "braids"] if slots else [c("hair_style", "short")]
    hatted = c("hat") in ("wizard", "slouch", "cap", "straw", "kerchief")
    for st in styles:
        slot = "Hair_" + st
        if st == "bald" or not face or c("hat") == "hood":
            continue
        if hatted:   # only what shows under the hat: a band round the back and sides, and any long hair
            q = P.p(slot, "head")
            q.blob(0, 0.9, -0.035, 0.18, 0.1, 0.17, hair, seg=8, rings=4, jit=0.04, seed=6)
            if st == "long":
                q.box(-0.18, 0.62, -0.17, 0.36, 0.3, 0.1, hair)
            elif st == "braids":
                for sx in (-1, 1):
                    for i in range(4):
                        q.cbox(sx * 0.15, 0.78 - i * 0.07, 0.04 + i * 0.012, 0.055 - i * 0.004, 0.065, 0.055, shade(hair, -0.06 * (i % 2)))
                    q.cbox(sx * 0.15, 0.5, 0.085, 0.035, 0.04, 0.035, "#c6463a")
            continue
        q = P.p(slot, "head")
        hc = hair
        if st == "shaved":
            q.blob(0, 0.92, -0.02, 0.176, 0.125, 0.174, shade(hc, 0.25) if not slots else "#e6e6e6", seg=8, rings=4, jit=0.02, seed=5)
            continue
        if st == "curly":
            q.blob(0, 0.95, -0.03, 0.21, 0.155, 0.2, hc, seg=9, rings=5, jit=0.3, seed=7)
            continue
        q.blob(0, 0.945, -0.03, 0.186, 0.13, 0.18, hc, seg=8, rings=4, jit=0.06, seed=6)
        q.box(-0.12, 0.965, 0.09, 0.24, 0.05, 0.07, shade(hc, -0.05))              # fringe
        if st == "long":
            q.box(-0.18, 0.62, -0.17, 0.36, 0.32, 0.1, hc)
            for sx in (-1, 1):
                q.box(sx * 0.17 - 0.035, 0.66, -0.1, 0.07, 0.26, 0.14, shade(hc, -0.05))
        elif st == "bun":
            q.blob(0, 1.05, -0.12, 0.085, 0.08, 0.085, hc, seg=6, rings=3, jit=0.05, seed=8)
        elif st == "braids":
            for sx in (-1, 1):
                for i in range(4):
                    y = 0.78 - i * 0.07
                    q.cbox(sx * 0.15, y, 0.04 + i * 0.012, 0.055 - i * 0.004, 0.065, 0.055, shade(hc, -0.06 * (i % 2)))
                q.cbox(sx * 0.15, 0.5, 0.085, 0.035, 0.04, 0.035, "#c6463a" if not slots else "#ffffff")
    # beard
    bd = c("beard")
    if bd and face:
        q = P.p("Hair_short", "head")
        q.blob(0, 0.78, 0.07, 0.135, 0.1, 0.11, c("beard_col", hair), seg=7, rings=3, jit=0.08, seed=11)
        q.box(-0.06, 0.8, 0.155, 0.12, 0.03, 0.03, c("beard_col", hair))            # moustache
        if bd == "long":
            q.prism([(-0.11, 0.78), (0.11, 0.78), (0.0, 0.48)], 0.08, 0.17, c("beard_col", hair))
    # hats and hoods
    hat = c("hat")
    hc = c("hat_col", "#3e4f78")
    q = P.p("Fixed", "head")
    if hat == "wizard":
        q.cyl(0, 1.0, 0, 0.24, 0.025, shade(hc, -0.1), seg=10, top_col=hc)
        q.cyl(0, 1.01, 0, 0.17, 0.05, c("trim", "gold"), seg=8, top=False)
        q.cyl(0, 1.06, 0, 0.17, 0.2, hc, seg=8, r_top=0.08, top=False)
        P.at(q, 0, 1.26, 0, pitch=-25)
        q.cone(0, 0, 0, 0.08, 0.2, hc, seg=8)
        P.p("Fixed", "head")
    elif hat == "slouch":
        q.cyl(0, 0.99, 0, 0.25, 0.02, shade(hc, -0.12), seg=10, top_col=hc)
        q.cyl(0, 1.0, 0, 0.165, 0.13, hc, seg=8, r_top=0.11)
        P.at(q, 0.03, 1.12, -0.02, roll=-30)
        q.cone(0, 0, 0, 0.1, 0.16, shade(hc, 0.05), seg=7)
        P.p("Fixed", "head")
        q.box(0.12, 1.02, 0.1, 0.05, 0.1, 0.02, "#c6463a")                            # a rosehip sprig
        q.box(0.13, 1.06, 0.1, 0.05, 0.06, 0.02, "leaf_dk")
    elif hat == "cap":
        q.cyl(0, 0.97, -0.01, 0.19, 0.07, hc, seg=8, r_top=0.17)
        q.box(-0.13, 0.97, 0.12, 0.26, 0.025, 0.12, shade(hc, -0.1))
    elif hat == "straw":
        q.cyl(0, 0.98, 0, 0.31, 0.02, "wheat", seg=10, top_col=shade("wheat", 0.08))
        q.cyl(0, 0.99, 0, 0.17, 0.13, "wheat", seg=8, r_top=0.15)
        q.cyl(0, 1.0, 0, 0.172, 0.035, "#7a2e3a", seg=8, top=False)
    elif hat == "kerchief":
        q.blob(0, 0.96, -0.03, 0.19, 0.125, 0.185, hc, seg=8, rings=4, jit=0.04, seed=12)
        q.blob(0, 0.86, -0.17, 0.06, 0.05, 0.05, shade(hc, -0.1), seg=5, rings=3, jit=0.05, seed=13)
    elif hat == "hood":
        q.blob(0, 0.92, -0.06, 0.215, 0.205, 0.19, c("cloak", hc), seg=9, rings=5, jit=0.03, seed=14)
        P.at(q, 0, 0.98, -0.2, pitch=-115)
        q.cone(0, 0, 0, 0.09, 0.13, shade(c("cloak", hc), -0.06), seg=6)
        P.p("Fixed", "head")
    # shawl, scarf, chain, apron
    if c("shawl"):
        q = P.p("Fixed", "chest")
        q.cyl(0, 0.58, 0, 0.212 * W, 0.15, c("shawl"), seg=8, r_top=0.15, top=True)
        q.prism([(-0.12, 0.6), (0.12, 0.6), (0.0, 0.44)], 0.2 * W - 0.01, 0.22 * W, shade(c("shawl"), -0.08))
    if c("scarf"):
        q = P.p("Fixed", "chest")
        q.cyl(0, 0.66, 0, 0.13, 0.07, c("scarf"), seg=8)
        q.box(0.03, 0.5, 0.14, 0.07, 0.17, 0.05, shade(c("scarf"), -0.08))
    if c("chain"):
        q = P.p("Fixed", "chest")
        for i in range(7):
            t = (i - 3) / 3.0
            q.cbox(t * 0.13, 0.69 - (1 - t * t) * 0.12, 0.2 - (1 - abs(t)) * 0.0 + 0.0, 0.035, 0.03, 0.02, "gold")
        q.cbox(0, 0.55, 0.205, 0.07, 0.07, 0.02, "gold_dk")
    if c("apron"):
        q = P.p("Fixed", "chest")
        q.box(-0.11, 0.48, 0.17 * W + 0.005, 0.22, 0.18, 0.02, c("apron"))
        q = P.p("Fixed", "hips")
        if robe:
            yt, yb = 0.45, 0.14
            rt, rb = r_robe(yt, r_top=0.18 * W, r_hem=0.3 * W) + 0.012, r_robe(yb, r_top=0.18 * W, r_hem=0.3 * W) + 0.012
            q.quad((-0.15, yb, rb), (0.15, yb, rb), (0.13, yt, rt), (-0.13, yt, rt), c("apron"), out=(0, 0, 1))
        else:
            q.box(-0.15, 0.2, 0.2 * W, 0.3, 0.25, 0.02, c("apron"))
    # cloak down the back, with its collar and clasp (the hero's is a slot)
    if c("cloak"):
        cl = c("cloak")
        low = 0.12 if robe else 0.2
        q = P.p("Cloak", "chest")
        q.box(-0.21 * W, low, -0.215 * W, 0.42 * W, 0.71 - low, 0.04, cl)
        for sx in (-1, 1):
            q.prism([(sx * 0.2 * W, 0.71), (sx * 0.22 * W, low), (sx * 0.24 * W, low)] if sx < 0 else
                    [(sx * 0.24 * W, low), (sx * 0.22 * W, low), (sx * 0.2 * W, 0.71)], -0.215 * W, 0.0, shade(cl, -0.08))
        q.cyl(0, 0.68, 0, 0.215 * W, 0.05, shade(cl, -0.05), seg=8, top=False)
        if c("hood_down"):
            q.blob(0, 0.71, -0.17, 0.15, 0.07, 0.08, shade(cl, -0.05), seg=6, rings=3, jit=0.05, seed=15)
        q = P.p("Fixed", "chest")
        for sx in (-1, 1):
            q.box(sx * 0.14 - 0.02, 0.66, 0.15 * W, 0.04, 0.04, 0.04, "gold" if face else "iron")
    if c("satchel"):
        q = P.p("Fixed", "hips")
        q.box(0.18 * W, 0.28, -0.07, 0.07, 0.14, 0.15, "wood_dk", top=shade("wood_dk", 0.1))
        q.box(0.245 * W, 0.33, -0.05, 0.015, 0.07, 0.04, "gold_dk")
        q = P.p("Fixed", "chest")
        q.quad((-0.17, 0.7, 0.13), (-0.11, 0.71, 0.15), (0.17, 0.47, 0.18), (0.11, 0.46, 0.18), "wood_dk", out=(0, 0, 1))
    # what they carry (in the right hand unless said)
    it = c("item")
    if it:
        hx = -0.235 * W
        if it == "staff":
            q = P.p("Fixed", "fore_R")
            q.cyl(hx, 0.0, 0.05, 0.022, 1.12, "wood_dk", seg=6)
            for y in (0.33, 1.0):
                q.cyl(hx, y, 0.05, 0.03, 0.04, "gold_dk", seg=6)
            q.cyl(hx, 1.04, 0.05, 0.05, 0.05, "wood_dk", seg=6, r_top=0.07)
            q = P.p("Staff_glow", "fore_R") if "Staff_glow" in parts else None
            if q is None:
                parts["Staff_glow"] = Part(name + "_Staff_glow")
                q = P.p("Staff_glow", "fore_R")
            q.cone(hx, 1.13, 0.05, 0.055, 0.13, "gold", seg=5)
            P.at(q, hx, 1.13, 0.05, roll=180)
            q.cone(0, 0, 0, 0.055, 0.07, "gold", seg=5)
        elif it == "crook":
            q = P.p("Fixed", "fore_R")
            q.cyl(hx, 0.0, 0.05, 0.02, 1.15, "wood", seg=6)
            for i in range(6):   # the hook
                a = math.pi * i / 5
                x = hx + 0.08 - 0.08 * math.cos(a)
                y = 1.15 + 0.08 * math.sin(a)
                q.cbox(x, y - 0.02, 0.05, 0.04, 0.04, 0.04, "wood")
        elif it == "bucket":
            q = P.p("Fixed", "fore_L")
            hx = -hx
            q.cyl(hx, 0.08, 0.02, 0.075, 0.13, "wood", seg=8, r_top=0.09, bottom=True, top_col="water")
            q.cyl(hx, 0.1, 0.02, 0.078, 0.02, "iron", seg=8, top=False)
            q.cyl(hx, 0.18, 0.02, 0.092, 0.02, "iron", seg=8, top=False)
            q.box(hx - 0.005, 0.21, -0.07, 0.01, 0.08, 0.01, "iron")
            q.box(hx - 0.005, 0.21, 0.11, 0.01, 0.08, 0.01, "iron")
            q.box(hx - 0.005, 0.28, -0.07, 0.01, 0.01, 0.19, "iron")
        elif it == "slate":
            q = P.p("Fixed", "fore_L")
            hx = -hx
            P.at(q, hx - 0.03, 0.3, 0.1, yaw=-20)
            q.box(-0.09, -0.05, 0, 0.18, 0.22, 0.02, "wood_dk")
            q.box(-0.075, -0.035, 0.015, 0.15, 0.19, 0.01, "slate_dk")
            for i in range(4):   # tally marks
                q.box(-0.05 + i * 0.025, 0.06, 0.022, 0.008, 0.06, 0.005, "frame")
            q.box(-0.055, 0.085, 0.024, 0.1, 0.008, 0.005, "frame")
            P.p("Fixed", "fore_L")
        elif it == "ledger":
            q = P.p("Fixed", "fore_L")
            hx = -hx
            q.box(hx - 0.02, 0.24, -0.02, 0.07, 0.17, 0.14, "#7a2e3a", top=shade("frame", -0.1))
    for q in {id(v): v for v in parts.values()}.values():
        q.done(rig)
    human_clips(rig, robe=robe, float_=not face)
    return rig


def human_clips(rig, robe=False, float_=False):
    """idle, walk, talk, cast, cheer (the Hollow: idle, walk, cast — gliding, no steps)."""
    lg = 0.55 if robe else 1.0
    if float_:
        rig.anim("idle", [(1, {"hips": {"r": (0, 0, 2), "t": (0, 0.03, 0)}, "arm_L": (0, 0, 6), "arm_R": (0, 0, -6)}),
                          (25, {"hips": {"r": (0, 0, -2), "t": (0, 0.06, 0)}, "arm_L": (0, 0, 9), "arm_R": (0, 0, -9), "head": (4, 8, 0)}),
                          (49, {"hips": {"r": (0, 0, 2), "t": (0, 0.03, 0)}, "arm_L": (0, 0, 6), "arm_R": (0, 0, -6)})])
        g = lambda k: {"hips": {"r": (8, 0, 3 * k), "t": (0, 0.04 + 0.015 * (k * k), 0)}, "chest": (6, -4 * k, 0), "head": (-6, 6 * k, 0),
                       "arm_L": (25 + 10 * k, 0, 10), "arm_R": (25 - 10 * k, 0, -10)}
        rig.anim("walk", [(1, g(1)), (13, g(-1)), (25, g(1))])
        cst = lambda k: {"hips": {"t": (0, 0.05 + 0.02 * k, 0)}, "chest": (-5, 0, 0), "arm_L": (-85 - 8 * k, 0, -12), "arm_R": (-85 - 8 * k, 0, 12),
                         "fore_L": (-15, 0, 0), "fore_R": (-15, 0, 0)}
        rig.anim("cast", [(1, cst(0)), (10, cst(1)), (19, cst(0))])
        return
    # idle: breathing, a look round, arms easy
    rig.anim("idle", [
        (1, {"arm_L": (0, 0, 4), "arm_R": (0, 0, -4)}),
        (13, {"chest": (-1.5, 0, 0), "hips": {"t": (0, 0.004, 0)}, "arm_L": (0, 0, 5), "arm_R": (0, 0, -5), "head": (0, 8, 0)}),
        (25, {"arm_L": (0, 0, 4), "arm_R": (0, 0, -4), "head": (2, 0, 0)}),
        (37, {"chest": (-1.5, 0, 0), "hips": {"t": (0, 0.004, 0)}, "arm_L": (0, 0, 5), "arm_R": (0, 0, -5), "head": (0, -6, 2)}),
        (49, {"arm_L": (0, 0, 4), "arm_R": (0, 0, -4)})])

    # walk: contact, passing, contact, passing (left leg forward first)
    def stride(lead, phase):
        a, b = ("L", "R") if lead == "L" else ("R", "L")
        if phase == "contact":
            return {f"thigh_{a}": (-24 * lg, 0, 0), f"shin_{a}": (4, 0, 0), f"thigh_{b}": (18 * lg, 0, 0), f"shin_{b}": (22 * lg, 0, 0),
                    f"arm_{a}": (20, 0, 4 if a == "L" else -4), f"arm_{b}": (-22, 0, 4 if b == "L" else -4),
                    f"fore_{b}": (-12, 0, 0), "hips": {"r": (0, 6 if a == "L" else -6, 0)}, "chest": (3, -9 if a == "L" else 9, 0)}
        return {f"thigh_{a}": (2, 0, 0), f"shin_{a}": (2, 0, 0), f"thigh_{b}": (-14 * lg, 0, 0), f"shin_{b}": (42 * lg, 0, 0),
                f"arm_{a}": (0, 0, 4 if a == "L" else -4), f"arm_{b}": (0, 0, 4 if b == "L" else -4),
                "hips": {"t": (0, 0.025, 0)}, "chest": (3, 0, 0)}
    rig.anim("walk", [(1, stride("L", "contact")), (7, stride("L", "pass")), (13, stride("R", "contact")),
                      (19, stride("R", "pass")), (25, stride("L", "contact"))])
    # talk: the right hand makes a point, the head nods
    tk = lambda k: {"arm_R": (-30 - 10 * k, 0, -8), "fore_R": (-45 - 20 * k, 0, 0), "arm_L": (0, 0, 5), "head": (3 * k, -4, 0), "chest": (-2, -3, 0)}
    rig.anim("talk", [(1, tk(0)), (9, tk(1)), (17, tk(0)), (25, tk(1)), (33, tk(-0.5)), (41, tk(0))])
    # cast: both hands forward, a pulse of power
    cs = lambda k: {"arm_L": (-75 - 8 * k, 0, -14), "arm_R": (-75 - 8 * k, 0, 14), "fore_L": (-20, 0, 0), "fore_R": (-20, 0, 0),
                    "chest": (4 * k, 0, 0), "thigh_L": (-10, 0, 3), "thigh_R": (6, 0, -3), "shin_R": (8, 0, 0)}
    rig.anim("cast", [(1, cs(0)), (10, cs(1)), (19, cs(0))])
    # cheer: arms up, a little hop
    ch = lambda up: {"root": {"t": (0, 0.06 * up, 0)}, "arm_L": (0, 0, 150), "arm_R": (0, 0, -150), "fore_L": (0, 0, 15 - 15 * up),
                     "fore_R": (0, 0, -15 + 15 * up), "head": (-8 * up, 0, 0), "shin_L": (20 * up, 0, 0), "shin_R": (20 * up, 0, 0)}
    rig.anim("cheer", [(1, ch(0)), (7, ch(1)), (13, ch(0))])


@model("hero", "person", "The student's apprentice: slot meshes tinted from the look (Pack.dress), six hair styles, cloak and satchel")
def hero():
    human("hero", {"skin": "#ffffff", "hair": "#ffffff", "top": "#ffffff", "trim": "#d6d6d6", "legs": "#ffffff",
                   "boots": "#ffffff", "cloak": "#ffffff", "hood_down": True, "satchel": True}, slots=True)


@model("orrin", "person", "Archmage Orrin Vael: tall, slate-blue robe and pointed hat, long white beard, staff with a gold crystal (Staff_glow)")
def orrin():
    human("orrin", {"K": 1.06, "skin": "#e8b98f", "hair": "#ece6da", "hair_style": "long", "beard": "long", "beard_col": "#f1ece2",
                    "top": "#3e4f78", "trim": "gold_dk", "robe": True, "hat": "wizard", "hat_col": "#3a4a70",
                    "cloak": "#2e3a5c", "item": "staff", "belt": "#6e5038"})


@model("hesper", "person", "Hesper Marrow, hedge-witch: moss dress, cream apron, rust shawl, slouch hat with a rosehip sprig, grey bun")
def hesper():
    human("hesper", {"K": 0.95, "W": 1.08, "skin": "#f0c9a6", "hair": "#b9b4ac", "hair_style": "bun", "top": "#5f7a4e",
                     "trim": "#4b6340", "robe": True, "apron": "#e9dfcb", "shawl": "#a35f45", "hat": "slouch", "hat_col": "#56603f",
                     "belt": "#6b5040", "glasses": False})


@model("pell", "person", "Pell, the apprentice's young cousin: mustard tunic, red scarf, curly hair, satchel")
def pell():
    human("pell", {"K": 0.8, "W": 0.95, "skin": "#c98d5f", "hair": "#2b1d14", "hair_style": "curly", "top": "#d8a84a",
                   "trim": "#b8893a", "legs": "#6e5038", "boots": "#4b3a2c", "scarf": "#c0392b", "satchel": True})


@model("marta", "person", "Marta Fenn, well-keeper: blue dress, kerchief, braids, a bucket in her left hand")
def marta():
    human("marta", {"K": 0.97, "skin": "#a86b42", "hair": "#2b1d14", "hair_style": "braids", "top": "#4a5f78", "trim": "#3b4c62",
                    "robe": True, "hat": "kerchief", "hat_col": "#c97a4a", "apron": "#ddd3c2", "item": "bucket"})


@model("abel", "person", "Abel Crane, miller: heavy-set, floury apron, flat cap, ginger beard, ledger under his arm")
def abel():
    human("abel", {"K": 1.02, "W": 1.18, "skin": "#f6d5b8", "hair": "#a0622c", "hair_style": "short", "beard": "short",
                   "beard_col": "#b06a30", "top": "#c7b48e", "trim": "#a8956e", "legs": "#6e5038", "apron": "#f1ece2",
                   "hat": "cap", "hat_col": "#cdb894", "item": "ledger"})


@model("rowan", "person", "Rowan Tull, shepherd: brown wool cloak with the hood down, green tunic, crook")
def rowan():
    human("rowan", {"K": 1.0, "skin": "#7a4a2c", "hair": "#1d1814", "hair_style": "short", "beard": "short", "beard_col": "#2b211a",
                    "top": "#5f7a4e", "trim": "#4b6340", "legs": "#7a5a3a", "cloak": "#8a6a4a", "hood_down": True, "item": "crook"})


@model("odile", "person", "Reeve Odile Marsh: long wine-red coat, gold chain of office, auburn bun")
def odile():
    human("odile", {"K": 0.98, "skin": "#e8b98f", "hair": "#8a3b22", "hair_style": "bun", "top": "#7a2e3a", "trim": "gold_dk",
                    "robe": True, "chain": True, "belt": "#3b2a22", "glasses": True})


@model("gale", "person", "Gale Harrow, grain-warden: leather jerkin, straw hat, grey beard, tally slate in the left hand")
def gale():
    human("gale", {"K": 1.0, "skin": "#c98d5f", "hair": "#8a8580", "hair_style": "short", "beard": "short", "beard_col": "#9a958e",
                   "top": "#8a6040", "trim": "#6e5038", "legs": "#4a4a52", "hat": "straw", "item": "slate"})


@model("sefa", "person", "Sefa, the Hollow who doubts: grey hooded cloak with a face you can see (young, unsure)")
def sefa():
    human("sefa", {"K": 0.94, "skin": "#a86b42", "hair": "#2b1d14", "hair_style": "short", "top": "#7d8085", "trim": "#6a6d72",
                   "legs": "#55585e", "boots": "#3b3f44", "cloak": "#8c9096", "hat": "hood"})


@model("hollow", "person", "A Hollow: ragged grey hooded robe, an empty dark hood, sleeves ending in shadow; glides, no feet")
def hollow():
    human("hollow", {"K": 1.06, "top": "#8c9096", "trim": "#6a6d72", "robe": True, "ragged": True, "cloak": "#7d8085",
                     "hat": "hood", "face": False})


# ─────────────────────────────── animals ───────────────────────────────

def quad_bones(K, body_y, hip_z, sh_z, leg_x, head, tail=None):
    s = lambda v: tuple(K * c for c in v)
    b = [("root", None, s((0, 0, 0)), s((0, 0.1, 0))),
         ("body", "root", s((0, body_y, 0)), s((0, body_y + 0.1, 0))),
         ("head", "body", s(head[0]), s(head[1]))]
    for nm, x, z in (("leg_FL", leg_x, sh_z), ("leg_FR", -leg_x, sh_z), ("leg_BL", leg_x, hip_z), ("leg_BR", -leg_x, hip_z)):
        b.append((nm, "body", s((x, body_y - 0.08, z)), s((x, 0.02, z))))
    if tail:
        b.append(("tail", "body", s(tail[0]), s(tail[1])))
    return b


def quad_walk(rig, amp=26, bob=0.02, head=4, tail=False):
    def k(s):
        p = {"leg_FL": (-amp * s, 0, 0), "leg_BR": (-amp * s, 0, 0), "leg_FR": (amp * s, 0, 0), "leg_BL": (amp * s, 0, 0),
             "head": (head * s, 0, 0), "body": {"r": (0, 0, 2 * s)}}
        if tail:
            p["tail"] = (0, 25 * s, 0)
        return p
    up = lambda p: dict(p, root={"t": (0, bob, 0)})
    rig.anim("walk", [(1, k(1)), (7, up(k(0))), (13, k(-1)), (19, up(k(0))), (25, k(1))])


def sheep_body(name, K, wool, face, seed):
    rig = Rig(name + "_rig", quad_bones(K, 0.45, -0.2, 0.18, 0.13, ((0, 0.5, 0.3), (0, 0.6, 0.45)), ((0, 0.47, -0.34), (0, 0.4, -0.42))))
    p = Part(name)
    p.xf = Matrix.Scale(K, 4)
    for nm, x, z in (("leg_FL", 0.13, 0.18), ("leg_FR", -0.13, 0.18), ("leg_BL", 0.13, -0.2), ("leg_BR", -0.13, -0.2)):
        p.bone(nm)
        p.cbox(x, 0.0, z, 0.07, 0.36, 0.07, face)
        p.cbox(x, 0.0, z + 0.005, 0.08, 0.05, 0.08, shade(face, -0.3))
    p.bone("body")
    p.blob(0, 0.48, -0.01, 0.27, 0.24, 0.37, wool, seg=8, rings=5, jit=0.12, seed=seed)
    p.blob(0.03, 0.66, -0.08, 0.15, 0.1, 0.18, shade(wool, -0.06), seg=6, rings=3, jit=0.12, seed=seed + 1)
    p.bone("tail")
    p.blob(0, 0.45, -0.38, 0.06, 0.07, 0.05, wool, seg=5, rings=3, jit=0.1, seed=seed + 2)
    p.bone("head")
    p.blob(0, 0.5, 0.3, 0.11, 0.11, 0.1, shade(wool, -0.04), seg=6, rings=3, jit=0.08, seed=seed + 3)   # neck ruff
    p.cbox(0, 0.44, 0.42, 0.15, 0.18, 0.2, face)                       # face, nose forward
    p.cbox(0, 0.6, 0.36, 0.17, 0.08, 0.14, wool)                      # topknot
    for sx in (-1, 1):
        p.cbox(sx * 0.12, 0.54, 0.36, 0.1, 0.035, 0.05, face)          # ears
        p.box(sx * 0.045 - 0.015, 0.54, 0.51, 0.03, 0.03, 0.02, "#f1ece2")
    p.done(rig)
    rig.anim("idle", [(1, {}), (19, {"head": (0, 12, 0)}), (31, {"head": (-4, 12, 0), "tail": (0, 20, 0)}), (49, {})])
    quad_walk(rig, amp=24, bob=0.025)
    gz = lambda k: {"head": {"r": (42 + 6 * k, 0, 0), "t": (0, -0.08, 0.0)}, "body": {"r": (10, 0, 0), "t": (0, -0.02, 0)},
                    "leg_FL": (-10, 0, 0), "leg_FR": (-10, 0, 0), "leg_BL": (-10, 0, 0), "leg_BR": (-10, 0, 0)}
    rig.anim("graze", [(1, gz(0)), (7, gz(1)), (13, gz(0)), (19, gz(1)), (31, gz(0)), (49, gz(0))])
    return rig


@model("sheep", "animal", "A ewe (Rowan's flock): idle, walk, graze")
def sheep():
    sheep_body("sheep", 1.0, "wool", "sheep_face", 4)


@model("lamb", "animal", "A spring lamb, small and pale: idle, walk, graze")
def lamb():
    sheep_body("lamb", 0.62, "#f6f2ea", "#5a4c46", 21)


@model("hen", "animal", "One of Hesper's hens: idle, walk (head bobs), peck")
def hen():
    s = 1.0
    bones = [("root", None, (0, 0, 0), (0, 0.06, 0)), ("body", "root", (0, 0.16, 0), (0, 0.24, 0)),
             ("head", "body", (0, 0.24, 0.07), (0, 0.36, 0.1)), ("tail", "body", (0, 0.2, -0.1), (0, 0.32, -0.16)),
             ("wing_L", "body", (0.09, 0.22, 0), (0.12, 0.14, -0.06)), ("wing_R", "body", (-0.09, 0.22, 0), (-0.12, 0.14, -0.06)),
             ("leg_L", "body", (0.04, 0.12, 0), (0.04, 0.0, 0)), ("leg_R", "body", (-0.04, 0.12, 0), (-0.04, 0.0, 0))]
    rig = Rig("hen_rig", bones)
    p = Part("hen")
    br, br_dk = "#b9733e", "#8a5228"
    for nm, x in (("leg_L", 0.04), ("leg_R", -0.04)):
        p.bone(nm)
        p.cbox(x, 0.0, 0, 0.02, 0.12, 0.02, "#e0a33a")
        p.cbox(x, 0.0, 0.02, 0.05, 0.01, 0.07, "#e0a33a")
    p.bone("body")
    p.blob(0, 0.19, -0.01, 0.1, 0.09, 0.13, br, seg=7, rings=4, jit=0.05, seed=1)
    p.bone("tail")
    p.xf = Matrix.Translation(Vector((0, 0.2, -0.1))) @ Matrix.Rotation(math.radians(-35), 4, "X")
    p.cone(0, 0, 0, 0.055, 0.15, br_dk, seg=4)
    p.reset()
    for nm, sx in (("wing_L", 1), ("wing_R", -1)):
        p.bone(nm)
        p.blob(sx * 0.085, 0.19, -0.02, 0.03, 0.06, 0.09, br_dk, seg=5, rings=3, jit=0.05, seed=2)
    p.bone("head")
    p.blob(0, 0.3, 0.09, 0.055, 0.06, 0.05, br, seg=6, rings=3, jit=0.03, seed=3)
    p.xf = Matrix.Translation(Vector((0, 0.3, 0.135))) @ Matrix.Rotation(math.radians(90), 4, "X")
    p.cone(0, 0, 0, 0.02, 0.05, "#e0a33a", seg=4)
    p.reset()
    p.cbox(0, 0.345, 0.09, 0.022, 0.04, 0.06, "#c6463a")               # comb
    p.cbox(0, 0.255, 0.12, 0.015, 0.03, 0.02, "#c6463a")               # wattle
    for sx in (-1, 1):
        p.box(sx * 0.052 - 0.005, 0.31, 0.1, 0.01, 0.015, 0.015, INK)
    p.done(rig)
    rig.anim("idle", [(1, {}), (9, {"head": (0, 25, 10)}), (17, {"head": (0, 25, 10)}), (21, {}), (33, {"head": (0, -20, -8), "tail": (0, 6, 0)}),
                      (41, {"wing_L": (0, 0, 15), "wing_R": (0, 0, -15)}), (45, {}), (49, {})])
    hw = lambda s, up: {"leg_L": (-30 * s, 0, 0), "leg_R": (30 * s, 0, 0), "head": {"r": (0, 0, 0), "t": (0, 0, 0.03 * up)},
                        "body": (0, 0, 4 * s), "root": {"t": (0, 0.015 * abs(up), 0)}}
    rig.anim("walk", [(1, hw(1, 1)), (7, hw(0, -1)), (13, hw(-1, 1)), (19, hw(0, -1)), (25, hw(1, 1))])
    pk = lambda d: {"body": (20 * d, 0, 0), "head": {"r": (55 * d, 0, 0), "t": (0, -0.05 * d, 0.02 * d)}, "tail": (-15 * d, 0, 0)}
    rig.anim("peck", [(1, pk(0)), (5, pk(1)), (8, pk(0.6)), (11, pk(1)), (16, pk(0)), (28, pk(0))])


@model("dog", "animal", "Rowan's sheepdog, black and white: idle (tail wags), walk (trot), sit")
def dog():
    rig = Rig("dog_rig", quad_bones(1.0, 0.33, -0.19, 0.17, 0.08, ((0, 0.4, 0.24), (0, 0.5, 0.36)), ((0, 0.38, -0.27), (0, 0.45, -0.42))))
    p = Part("dog")
    blk, wht, tan = "#26282b", "#ece6da", "#8a5a3a"
    for nm, x, z in (("leg_FL", 0.08, 0.17), ("leg_FR", -0.08, 0.17), ("leg_BL", 0.08, -0.19), ("leg_BR", -0.08, -0.19)):
        p.bone(nm)
        p.cbox(x, 0.04, z, 0.06, 0.24, 0.06, blk if z < 0 else wht)
        p.cbox(x, 0.0, z + 0.01, 0.065, 0.05, 0.08, wht)
    p.bone("body")
    p.blob(0, 0.34, -0.02, 0.13, 0.12, 0.27, blk, seg=7, rings=4, jit=0.06, seed=31)
    p.blob(0, 0.33, 0.17, 0.1, 0.11, 0.08, wht, seg=6, rings=3, jit=0.05, seed=32)   # white chest ruff
    p.bone("tail")
    p.xf = Matrix.Translation(Vector((0, 0.38, -0.27))) @ Matrix.Rotation(math.radians(-130), 4, "X")
    p.cyl(0, 0, 0, 0.035, 0.17, blk, seg=5, r_top=0.02)
    p.cone(0, 0.17, 0, 0.025, 0.06, wht, seg=5)
    p.reset()
    p.bone("head")
    p.blob(0, 0.46, 0.27, 0.095, 0.09, 0.1, blk, seg=7, rings=4, jit=0.04, seed=33)
    p.cbox(0, 0.4, 0.38, 0.08, 0.07, 0.11, wht)                        # muzzle
    p.cbox(0, 0.43, 0.43, 0.035, 0.03, 0.02, INK)                      # nose
    p.cbox(0, 0.47, 0.35, 0.04, 0.08, 0.04, wht)                       # blaze
    for sx in (-1, 1):
        p.xf = Matrix.Translation(Vector((sx * 0.06, 0.53, 0.25))) @ Matrix.Rotation(math.radians(sx * -20), 4, "Z")
        p.cone(0, 0, 0, 0.04, 0.09, blk, seg=4)
        p.reset()
        p.box(sx * 0.045 - 0.012, 0.48, 0.355, 0.024, 0.025, 0.02, INK)
        p.box(sx * 0.05 - 0.012, 0.5, 0.355, 0.024, 0.012, 0.02, tan)
    p.done(rig)
    wag = lambda s: {"tail": (0, 30 * s, 0), "head": (0, 4 * s, 0)}
    rig.anim("idle", [(1, wag(1)), (5, wag(-1)), (9, wag(1)), (13, wag(-1)), (17, wag(1)), (25, dict(wag(0), head=(-6, 10, 0))),
                      (37, dict(wag(0), head=(-6, 10, 0))), (45, wag(-1)), (49, wag(1))])
    quad_walk(rig, amp=34, bob=0.03, head=3, tail=True)
    st = {"body": {"r": (-28, 0, 0), "t": (0, -0.05, -0.03)}, "leg_BL": (-62, 0, 0), "leg_BR": (-62, 0, 0), "leg_FL": (28, 0, 0),
          "leg_FR": (28, 0, 0), "head": (14, 0, 0)}
    rig.anim("sit", [(1, st), (13, dict(st, head=(10, 15, 0))), (25, dict(st, head=(16, -8, 0))), (37, st)])


# ─────────────────────────────── build ───────────────────────────────

def main():
    import bpy
    a = args()
    out = a.get("out", OUT)
    only = set(a["only"].split(",")) if "only" in a else None
    manifest = {"pack": "people", "units": "1 = 1 map tile; stands on y = 0 at the origin, faces +z; place at scale 1", "models": {}}
    mpath = os.path.join(out, "pack.json")
    if only and os.path.exists(mpath):
        manifest = json.load(open(mpath))
    for name, m in MODELS.items():
        if only and name not in only:
            continue
        clear()
        rig = m["fn"]()
        rig = rig or next(ob for ob in bpy.data.objects if ob.type == "ARMATURE")
        rig_ob = rig.ob if hasattr(rig, "ob") else rig
        bpy.context.view_layer.update()
        meshes = [ob for ob in bpy.data.objects if ob.type == "MESH" and len(ob.data.vertices)]
        pts = [ob.matrix_world @ v.co for ob in meshes for v in ob.data.vertices]
        hi = max(p.z for p in pts)
        w = max(p.x for p in pts) - min(p.x for p in pts)
        d = max(p.y for p in pts) - min(p.y for p in pts)
        tris = sum(sum(len(pl.vertices) - 2 for pl in ob.data.polygons) for ob in meshes)
        anims = [t.name for t in rig_ob.animation_data.nla_tracks]
        export(os.path.join(out, name + ".glb"))
        manifest["models"][name] = {"kind": m["kind"], "w": round(w, 2), "d": round(d, 2), "h": round(hi, 2), "tris": tris,
                                    "anims": anims, "slots": sorted(ob.name for ob in meshes) if name == "hero" else [], "note": m["note"]}
        print("built %-8s %-7s h=%.2f  tris=%-5d %s" % (name, m["kind"], hi, tris, ",".join(anims)))
    with open(mpath, "w") as f:
        json.dump(manifest, f, indent=1)


if __name__ == "__main__":
    main()
