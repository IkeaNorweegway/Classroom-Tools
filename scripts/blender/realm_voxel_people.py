# Math 9 Realm game — the voxel people pack: every character built on the template of the hand-built hero in
# Hero-pixel.blend (the "VoxelRig" model). Builds .glb files and a pack.json in assets/realm/voxpeople/.
#
#   flatpak run org.blender.Blender -b --python scripts/blender/realm_voxel_people.py -- [only=orrin,pell] [out=/abs/dir]
#
# The full template (grid, parts, pivots, palette, clips, how to add a character) is
# templates/realm-voxel-character-template.md. In short:
#   - One voxel is a 0.04 cube (V). A person is a front-view pixel drawing two voxels deep: the front layer (d = 0)
#     carries the front drawing, the back layer (d = 1) the back drawing. Extras may sit one layer out: d = -1 in
#     front (beard, hat brim, pouch), d = 2 behind (cloak, bun, hood).
#   - Cells are (x, y): x counts columns from the body's centre line (the body is x = -4..3, the right arm
#     x = -7..-5, the left arm x = 4..6, the head x = -5..5), y counts rows up from the ground.
#   - Ten rigid parts on eleven bones, as in the hand-built rig: hips, spine, head, arm_L/R, fore_L/R, thigh_L/R,
#     shin_L/R. Every cell belongs to one bone; faces between two bones are kept so joints stay closed when they bend.
#   - Everyone faces +z and stands on y = 0, centred on the origin; place at scale 1 (the hero is 27 rows = 1.08 tall).
#   - Clips (24 fps, all loop): people idle, walk, talk, cast, cheer; the Hollow idle, walk, cast; sheep and lamb
#     idle, walk, graze; hen idle, walk, peck; dog and cat idle, walk, sit. The walk is the hand-keyed one (20 frames).
#
# Model and mesh names match the first people pack (realm/people), so Pack.person and Pack.dress work unchanged:
#   hero      slot meshes in white, tinted from the look: Skin, Hair_<style>, Top, Legs, Boots, Cloak; Fixed, Glasses
#   hero_f/m  Skin, Hair_<style>, Fixed, Glasses, Wtop_<id>, What_<id>, Wshoes_work (earned clothes, own colours)
import sys, os, json, math, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, kit
importlib.reload(kit)
from kit import Part, Rig, shade, clear, export, args

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "godot", "story-engine", "assets", "realm", "voxpeople")
MODELS = {}
V = 0.04                 # one voxel
PUFF = 0.005             # overlay meshes (hair on the tinted heroes, Fixed) stand this far proud of the skin
INK, MOUTH = "#2b2622", "#9a6a5a"
GOLD, GOLD_DK = "#f2c84b", "#c99a2e"
# The hand-built hero's twelve colours (read from its vertex colours).
H = {"hair": "#d0a773", "skin": "#f5ddc5", "yoke": "#8697b8", "tunic": "#97c5e5", "belt": "#4b3a2c",
     "leather": "#6e5038", "hem": "#7787a2", "boots": "#a08b7a", "pouch": "#9a6a5a"}
HAIR_STYLES = ["short", "long", "bun", "curly", "shaved", "braids"]
# The head, row by row from the neck up (first and last column): 11 wide, 8 tall, as built.
HEAD = [(-4, 4), (-5, 5), (-5, 5), (-5, 5), (-5, 4), (-4, 4), (-4, 4), (-3, 3)]


def model(name, kind, note=""):
    def reg(fn):
        MODELS[name] = {"fn": fn, "kind": kind, "note": note}
        return fn
    return reg


# ─────────────────────────────── voxels ───────────────────────────────

class Vox:
    """A set of voxel cells in named meshes. A cell is (x, y, z) -> (colour, bone); cell (x, y, z) fills
    x*V..(x+1)*V and so on, in Godot axes (x right, y up, z toward the front)."""

    def __init__(self, name):
        self.name = name
        self.meshes = {}
        self.plates = []
        self.use(name)

    def use(self, mesh, puff=0.0):
        """Draw into this mesh from now on. puff > 0 makes an overlay that sits just proud of the cells under it."""
        self.mesh = mesh
        self.meshes.setdefault(mesh, {"cells": {}, "puff": puff})
        return self

    def put3(self, x, y, z, col, bone):
        self.meshes[self.mesh]["cells"][(x, y, z)] = (col, bone)

    def box3(self, x0, y0, z0, x1, y1, z1, col, bone):
        for x in range(x0, x1 + 1):
            for y in range(y0, y1 + 1):
                for z in range(z0, z1 + 1):
                    self.put3(x, y, z, col, bone)

    def plate(self, pts, col, bone, out=(0, 0, 1)):
        """A flat face (a decal), points in voxel units."""
        self.plates.append((self.mesh, bone, pts, col, out))

    @staticmethod
    def _quad(p, ax, sg, c, u0, u1, v0, v1, col):
        a1, a2 = [i for i in range(3) if i != ax]
        pts = []
        for u, v in ((u0, v0), (u1, v0), (u1, v1), (u0, v1)):
            q = [0, 0, 0]
            q[ax], q[a1], q[a2] = c, u, v
            pts.append(tuple(q))
        out = [0, 0, 0]
        out[ax] = sg
        p.face(pts, col, out=tuple(out))

    def build(self, rig):
        for mname, m in self.meshes.items():
            p = Part(mname)
            cells, e = m["cells"], m["puff"]
            flat = {}                                        # (axis, side, plane, bone, colour) -> cells, to merge
            for (x, y, z), (col, bone) in cells.items():
                lo, hi = [x * V, y * V, z * V], [(x + 1) * V, (y + 1) * V, (z + 1) * V]
                sides = []
                for ax in range(3):
                    for sg in (-1, 1):
                        nb = [x, y, z]
                        nb[ax] += sg
                        o = cells.get(tuple(nb))
                        if o is None and e:
                            (lo if sg < 0 else hi)[ax] += sg * e
                        if o is None or o[1] != bone:        # open air, or a joint between two bones
                            sides.append((ax, sg))
                for ax, sg in sides:
                    a1, a2 = [i for i in range(3) if i != ax]
                    c = (x, y, z)
                    if not e:
                        flat.setdefault((ax, sg, c[ax], bone, col), set()).add((c[a1], c[a2]))
                        continue
                    p.bone(bone)
                    self._quad(p, ax, sg, hi[ax] if sg > 0 else lo[ax], lo[a1], hi[a1], lo[a2], hi[a2], col)
            for (ax, sg, pl, bone, col), todo in flat.items():   # same colour, same plane: one quad per rectangle
                p.bone(bone)
                while todo:
                    a, b = min(todo)
                    w = 1
                    while (a + w, b) in todo:
                        w += 1
                    h = 1
                    while all((a + i, b + h) in todo for i in range(w)):
                        h += 1
                    for i in range(w):
                        for j in range(h):
                            todo.discard((a + i, b + j))
                    self._quad(p, ax, sg, (pl + (1 if sg > 0 else 0)) * V, a * V, (a + w) * V, b * V, (b + h) * V, col)
            for mesh, bone, pts, col, out in self.plates:
                if mesh == mname:
                    p.bone(bone)
                    p.face([tuple(c * V for c in q) for q in pts], col, out=out)
            p.done(rig)


class Fig(Vox):
    """A person on the template. Rows: shins 0..knee-1, thighs knee..hip-1, torso hip..neck-1, head neck..top.
    Arms hang beside the torso from the shoulder row (neck-1): upper arm down to `elbow`, forearm to `wrist`
    (the hand row). The hero is shin 5, thigh 5, torso 9, arm 8, fore 5, body 8 wide, arms 3 wide."""

    def __init__(self, name, shin=5, thigh=5, torso=9, arm=8, fore=5, bw=8, aw=3):
        super().__init__(name)
        self.knee, self.hip = shin, shin + thigh
        self.neck = self.hip + torso
        self.top = self.neck + 7
        self.X0, self.X1 = -(bw // 2), bw - bw // 2 - 1
        self.aw = aw
        self.elbow = self.neck - arm
        self.wrist = self.elbow - fore

    def arms(self):
        return [(self.X0 - self.aw, self.X0 - 1), (self.X1 + 1, self.X1 + self.aw)]

    def bone_at(self, x, y):
        if y >= self.neck:
            return "head"
        side = "R" if x < 0 else "L"
        if (x < self.X0 or x > self.X1) and y >= self.wrist:
            return ("arm_" if y >= self.elbow else "fore_") + side
        if y >= self.hip:
            return "spine"
        return ("thigh_" if y >= self.knee else "shin_") + side

    def put(self, x, y, col, d=(0, 1), bone=None):
        for k in ((d,) if isinstance(d, int) else d):
            self.put3(x, y, -k, col, bone or self.bone_at(x, y))

    def box(self, x0, y0, x1, y1, col, d=(0, 1), bone=None):
        for x in range(x0, x1 + 1):
            for y in range(y0, y1 + 1):
                self.put(x, y, col, d, bone)

    def cut(self, x, y, d=(0, 1)):
        for k in ((d,) if isinstance(d, int) else d):
            self.meshes[self.mesh]["cells"].pop((x, y, -k), None)

    def front(self, x, y, col):
        """Recolour the front-most cell that is already at (x, y)."""
        cells = self.meshes[self.mesh]["cells"]
        zs = [z for (cx, cy, z) in cells if cx == x and cy == y]
        if zs:
            cells[(x, y, max(zs))] = (col, cells[(x, y, max(zs))][1])

    def bones(self):
        h, n = self.hip * V, self.neck * V
        b = [("hips", None, (0, h, 0), (0, h + 0.03, 0)), ("spine", "hips", (0, h, 0), (0, n, 0)),
             ("head", "spine", (0, n, 0), (0, (self.top + 1) * V, 0))]
        sh, el, wr, kn = (self.neck - 1.5) * V, self.elbow * V, self.wrist * V, self.knee * V
        arm = {"L": (self.X1 + 1 + self.aw / 2) * V, "R": (self.X0 - self.aw / 2) * V}
        for s in "LR":
            b += [("arm_" + s, "spine", (arm[s], sh, 0), (arm[s], el, 0)), ("fore_" + s, "arm_" + s, (arm[s], el, 0), (arm[s], wr, 0))]
        leg = {"L": (self.X1 + 1) / 2 * V, "R": self.X0 / 2 * V}
        for s in "LR":
            b += [("thigh_" + s, "hips", (leg[s], h, 0), (leg[s], kn, 0)), ("shin_" + s, "thigh_" + s, (leg[s], kn, 0), (leg[s], 0, 0))]
        return b

    def finish(self, lg=1.0, hold=None, float_=False):
        rig = Rig(self.name + "_rig", self.bones())
        self.build(rig)
        clips(rig, lg, hold, float_)
        return rig


# ─────────────────────────────── clips ───────────────────────────────

def clips(rig, lg=1.0, hold=None, float_=False):
    """idle, walk, talk, cast, cheer. lg scales the leg swing (robes about 0.55). hold = "L" or "R" keeps that arm
    still (it carries something); the other arm does the talking and casting. float_: the Hollow (idle, walk, cast)."""
    def still(p):
        if hold:
            p.pop("arm_" + hold, None)
            p.pop("fore_" + hold, None)
        return p
    if float_:
        fl = lambda k, y: {"hips": {"r": (0, 0, 2 * k), "t": (0, y, 0)}, "arm_L": (0, 0, 5), "arm_R": (0, 0, -5), "head": (2, 6 * k, 0)}
        rig.anim("idle", [(1, fl(1, 0.03)), (25, fl(-1, 0.06)), (49, fl(1, 0.03))])
        g = lambda k: {"hips": {"r": (8, 0, 3 * k), "t": (0, 0.04 + 0.015 * k * k, 0)}, "spine": (6, -4 * k, 0), "head": (-6, 6 * k, 0),
                       "arm_L": (25 + 10 * k, 0, 6), "arm_R": (25 - 10 * k, 0, -6)}
        rig.anim("walk", [(1, g(1)), (11, g(-1)), (21, g(1))])
        cs = lambda k: {"hips": {"t": (0, 0.05 + 0.02 * k, 0)}, "spine": (-5, 0, 0), "arm_L": (-85 - 8 * k, 0, -8), "arm_R": (-85 - 8 * k, 0, 8),
                        "fore_L": (-15, 0, 0), "fore_R": (-15, 0, 0)}
        rig.anim("cast", [(1, cs(0)), (10, cs(1)), (19, cs(0))])
        return
    a, b = ("L", "R") if hold == "R" else ("R", "L")          # a: the free arm that gestures
    sa = 1 if a == "L" else -1
    idle = lambda sp, hd: still({"arm_L": (0, 0, 3), "arm_R": (0, 0, -3), "spine": (sp, 0, 0), "head": hd})
    rig.anim("idle", [(1, idle(0, (0, 0, 0))), (13, idle(-1.5, (0, 8, 0))), (25, idle(0, (2, 0, 0))),
                      (37, idle(-1.5, (0, -6, 0))), (49, idle(0, (0, 0, 0)))])
    # walk: the hand-keyed cycle of the hero in Hero-pixel.blend (keys at 1, 6, 11, 16, 21)
    def step(k):         # k = 1: left leg back, left arm forward; -1: the mirror
        A, B = ("L", "R") if k > 0 else ("R", "L")
        return still({"head": (4, 0, 0), "arm_" + A: (-30, 0, 0), "fore_" + A: (-25, 0, 0), "arm_" + B: (30, 0, 0), "fore_" + B: (-15, 0, 0),
                      "thigh_" + A: (35 * lg, 0, 0), "shin_" + A: (-10 * lg, 0, 0), "thigh_" + B: (-35 * lg, 0, 0), "shin_" + B: (50 * lg, 0, 0)})
    mid = lambda: still({"fore_L": (-10, 0, 0), "fore_R": (-10, 0, 0), "shin_L": (15 * lg, 0, 0), "shin_R": (15 * lg, 0, 0)})
    rig.anim("walk", [(1, step(1)), (6, mid()), (11, step(-1)), (16, mid()), (21, step(1))])
    tk = lambda k: {"arm_" + a: (-30 - 10 * k, 0, 8 * sa), "fore_" + a: (-45 - 20 * k, 0, 0), "head": (3 * k, 4 * sa, 0), "spine": (-2, 3 * sa, 0)}
    rig.anim("talk", [(1, tk(0)), (9, tk(1)), (17, tk(0)), (25, tk(1)), (33, tk(-0.5)), (41, tk(0))])
    def cs(k):
        p = {"arm_" + a: (-75 - 8 * k, 0, -10 * sa), "fore_" + a: (-20, 0, 0), "spine": (4 * k, 0, 0),
             "thigh_L": (-10 * lg, 0, 0), "thigh_R": (6 * lg, 0, 0), "shin_R": (8 * lg, 0, 0)}
        if not hold:
            p.update({"arm_" + b: (-75 - 8 * k, 0, 10 * sa), "fore_" + b: (-20, 0, 0)})
        return p
    rig.anim("cast", [(1, cs(0)), (10, cs(1)), (19, cs(0))])
    ch = lambda up: still({"hips": {"t": (0, 0.06 * up, 0)}, "arm_L": (0, 0, 150), "arm_R": (0, 0, -150), "fore_L": (0, 0, 15 - 15 * up),
                           "fore_R": (0, 0, -15 + 15 * up), "head": (-8 * up, 0, 0), "shin_L": (20 * up * lg, 0, 0), "shin_R": (20 * up * lg, 0, 0)})
    rig.anim("cheer", [(1, ch(0)), (7, ch(1)), (13, ch(0))])


# ─────────────────────────────── the pieces of a person ───────────────────────────────

def head(F, skin):
    for i, (a, b) in enumerate(HEAD):
        F.box(a, F.neck + i, b, F.neck + i, skin)


def face(F, eye=INK, mouth=MOUTH, white=None):
    """Eyes 2 x 2 and a 3-wide mouth. white: on dark skin the outer column of each eye is this colour."""
    n = F.neck
    F.box(-3, n + 2, -2, n + 3, eye, 0)
    F.box(2, n + 2, 3, n + 3, eye, 0)
    if white:
        F.box(-3, n + 2, -3, n + 3, white, 0)
        F.box(3, n + 2, 3, n + 3, white, 0)
    F.box(-1, n, 1, n, mouth, 0)


def hands(F, skin):
    for a, b in F.arms():
        F.box(a, F.wrist, b, F.wrist, skin)


def dark(c):
    c = c.lstrip("#")
    return sum(int(c[i:i + 2], 16) * k for i, k in ((0, 0.3), (2, 0.59), (4, 0.11))) < 150


def person(name, skin, P=None, eye=INK, mouth=MOUTH):
    F = Fig(name, **(P or {}))
    head(F, skin)
    face(F, "#1a1512" if dark(skin) else eye, mouth, "#f1ece2" if dark(skin) else None)
    hands(F, skin)
    return F


def hair(F, style, col, tie=None, lift=False):
    """short long bun curly shaved braids, or ring (bald on top). Everything a hat must cover stays inside the hat."""
    n = F.neck
    for i in (4, 5, 6, 7):                                   # the back of the head
        F.box(HEAD[i][0], n + i, HEAD[i][1], n + i, col, 1)
    F.box(-4, n + 3, 4, n + 3, col, 1)
    F.box(-3, n + 2, 3, n + 2, col, 1)
    if style == "ring":
        for i in (5, 6, 7):
            F.box(HEAD[i][0], n + i, HEAD[i][1], n + i, F.meshes[F.mesh]["cells"][(0, n + 1, 0)][0], (0, 1))
        for x in (-5, 5):
            F.box(x, n + 2, x, n + 3, col, 0)
        F.put(-5, n + 4, col, 0)
        F.put(4, n + 4, col, 0)
        return
    for i in range(6 if style == "shaved" else 5, 8):        # the top, front
        F.box(HEAD[i][0], n + i, HEAD[i][1], n + i, col, 0)
    if style != "shaved" and not (lift and style == "curly"):
        # the fringe; dark hair keeps clear of the eyes so the two do not run together
        for x in ((-5, -4, 0, 4) if dark(col) and col != "#ffffff" and sum(int(col[i:i + 2], 16) for i in (1, 3, 5)) < 200 else (-5, -4, -3, 0, 3, 4)):
            F.put(x, n + 4, col, 0)
    if style == "long":
        F.box(-4, n, 4, n, col, 1)
        F.box(-5, n + 1, 5, n + 3, col, 1)
        for x in (-5, 5):
            F.box(x, n + 1, x, n + 3, col, 0)
        F.box(-4, n - 3, 4, n + 4, col, 2, "head")
    elif style == "bun":
        F.box(-1, n + 2, 1, n + 4, col, 2, "head")
        if tie:
            F.box(-1, n + 2, 1, n + 2, tie, 2, "head")
    elif style == "curly" and lift:                          # a lifted fringe: tufts sit above the eyes, never beside them
        F.box(-2, n + 8, 2, n + 8, col)
        for x in (-5, 5):
            F.put(x, n + 4, col, 0)
        for x, y in ((-6, n + 4), (6, n + 4), (-5, n + 5), (5, n + 5)):
            F.put(x, y, col)
        for x in (-4, 0, 4):
            F.put(x, n + 5, col, -1)
        for x in range(-4, 5):
            for y in range(n + 2, n + 5):
                if (x + y) % 2 == 0:
                    F.put(x, y, col, 2)
    elif style == "curly":
        F.box(-2, n + 8, 2, n + 8, col)
        for x, y in ((-6, n + 2), (-6, n + 4), (6, n + 3), (5, n + 4), (-5, n + 5), (5, n + 5)):
            F.put(x, y, col)
        for x in (-4, 0, 4):
            F.put(x, n + 4, col, -1)
        for x in range(-4, 5):
            for y in range(n + 2, n + 5):
                if (x + y) % 2 == 0:
                    F.put(x, y, col, 2)
    elif style == "braids":
        for x in (-5, 5):
            F.box(x, n - 4, x, n + 1, col, -1, "head")
            F.put(x, n - 5, tie or col, -1, "head")


def beard(F, col, long=False):
    n = F.neck
    for x in range(-4, 5):
        if abs(x) > 1 or long:
            F.put(x, n, col, 0)
    for x in (-5, 5):
        F.put(x, n + 1, col, 0)
    if long:
        F.put(0, n, MOUTH, 0)
        for i, w in enumerate((3, 3, 2, 1, 0)):
            F.box(-w, n - 1 - i, w, n - 1 - i, col, -1, "head")


def glasses(F, col=INK, t=0.2):
    """Thin round-ish frames (t voxels wide) round each eye; pick a light colour so the eyes show through."""
    n, z = F.neck, 1 + 0.15
    for x0 in (-3, 2):
        a, b, lo, hi = x0 - t, x0 + 2 + t, n + 2 - t, n + 4 + t
        for q in ((a, lo, b, lo + t), (a, hi - t, b, hi), (a, lo, a + t, hi), (b - t, lo, b, hi)):
            F.plate([(q[0], q[1], z), (q[2], q[1], z), (q[2], q[3], z), (q[0], q[3], z)], col, "head")
    F.plate([(-1 + t, n + 3, z), (2 - t, n + 3, z), (2 - t, n + 3 + t, z), (-1 + t, n + 3 + t, z)], col, "head")


def sleeves(F, col, cuff=None, skin=None, roll=False):
    for a, b in F.arms():
        F.box(a, F.wrist + 1, b, F.neck - 1, col)
        if roll and skin:                                    # sleeves rolled to the elbow
            F.box(a, F.wrist, b, F.elbow - 1, skin)
            F.box(a, F.elbow, b, F.elbow, cuff or col)
        elif cuff:
            F.box(a, F.wrist + 1, b, F.wrist + 1, cuff)


def robe(F, col, trim=None, boots="#3b2a22", flare=3, y0=1):
    """A full-length robe or dress: the legs and torso in one colour, the hem one cell wider on each side."""
    if y0 > 0:
        F.box(F.X0, 0, F.X1, y0 - 1, boots)
    F.box(F.X0, y0, F.X1, F.neck - 1, col)
    f = min(y0 + flare - 1, F.wrist - 1)
    if flare:
        F.box(F.X0 - 1, y0, F.X0 - 1, f, col)
        F.box(F.X1 + 1, y0, F.X1 + 1, f, col)
    if trim:
        F.box(F.X0 - (1 if flare else 0), y0, F.X1 + (1 if flare else 0), y0, trim)


def trousers(F, col, boots, boot_rows=3, skirt=None, skirt_rows=3):
    """Boots, trousers, and (skirt) the tunic's skirt over the top of the thighs, as on the hero."""
    F.box(F.X0, 0, F.X1, boot_rows - 1, boots)
    F.box(F.X0, boot_rows, F.X1, F.hip - 1, col)
    if skirt:
        F.box(F.X0, F.hip - skirt_rows, F.X1, F.hip - 1, skirt)


def mantle(F, col, rows=2, cape_to=None, clasp=None):
    """A cloak: over the shoulders in front, and (cape_to = lowest row) hanging down the back one layer out."""
    F.box(F.X0 - F.aw, F.neck - rows, F.X1 + F.aw, F.neck - 1, col)
    if cape_to is not None:
        F.box(F.X0, cape_to, F.X1, F.neck - 1, col, 2, "spine")
    if clasp:
        F.box(-1, F.neck - rows, 0, F.neck - rows, clasp, 0)


def hat_pointed(F, col, band, tip=None, straight=False, brim=6):
    """A witch's or wizard's hat. Returns the brim row. It closes over every hair style (see hair())."""
    y = F.neck + 5
    F.box(-brim, y, brim, y, col, (-1, 0, 1, 2), "head")
    prof = ([(-5, 5), (-4, 4), (-4, 4), (-3, 3), (-3, 3), (-2, 2), (-2, 2), (-1, 1), (-1, 1), (0, 0)] if straight else
            [(-5, 5), (-4, 4), (-4, 3), (-3, 3), (-3, 2), (-2, 2), (-2, 1), (-1, 1), (0, 1), (1, 2)])
    for i, (a, b) in enumerate(prof):
        c = band if i == 0 else tip if tip and i >= len(prof) - 3 else col
        F.box(a, y + 1 + i, b, y + 1 + i, c, (-1, 0, 1, 2) if i < 3 else (0, 1), "head")
    return y


def staff(F, wood="#6e5038", side="R", y1=None):
    """A staff standing beside the hand that holds it (give finish(hold=side)). Returns its column and top row."""
    x = F.X0 - F.aw - 1 if side == "R" else F.X1 + F.aw + 1
    y1 = F.neck + 4 if y1 is None else y1
    F.box(x, 0, x, y1, wood, 0, "spine")
    return x, y1


# ─────────────────────────────── the reference hero ───────────────────────────────

@model("apprentice", "person", "The hand-built hero of Hero-pixel.blend, rebuilt cell for cell from the template (the reference model)")
def apprentice():
    F = person("apprentice", H["skin"])
    n, h = F.neck, F.hip
    F.box(F.X0, 0, F.X1, 3, H["boots"])
    F.box(F.X0, 4, F.X1, 4, H["hem"])
    F.box(F.X0, 5, F.X1, n - 1, H["tunic"])
    sleeves(F, H["tunic"], cuff=H["leather"])
    F.box(F.X0 - 3, n - 3, F.X1 + 3, n - 1, H["yoke"])
    F.box(F.X0, h, F.X1, h, H["belt"])
    F.box(-1, h, 0, h, GOLD_DK, 0)
    F.box(1, h + 1, 3, h + 2, H["pouch"], 0)
    for cx in (-3, 3):                                       # the two gold studs on the yoke (diamonds over 2 x 2 cells)
        cy = n - 2
        F.plate([(cx - 1, cy, 1.1), (cx, cy - 1, 1.1), (cx + 1, cy, 1.1), (cx, cy + 1, 1.1)], GOLD, "spine")
    hair(F, "short", H["hair"])
    F.box(-2, n, 2, n, H["yoke"], 1)                         # the collar at the back of the neck
    return F.finish()


# ─────────────────────────────── the cast ───────────────────────────────

@model("orrin", "person", "Archmage Orrin Vael: tall, slate-blue robe and pointed hat, long white beard, staff with a gold crystal (Staff_glow)")
def orrin():
    skin, rb = "#e8b98f", "#3e4f78"
    F = person("orrin", skin, {"thigh": 6, "torso": 10})
    n, h = F.neck, F.hip
    robe(F, rb, trim=GOLD_DK)
    sleeves(F, rb, cuff=GOLD_DK)
    F.box(F.X0, h + 1, F.X1, h + 1, "#6e5038")
    F.box(-1, h + 1, 0, h + 1, GOLD, 0)
    mantle(F, "#2e3a5c", cape_to=2, clasp=GOLD)
    hair(F, "long", "#ece6da")
    beard(F, "#f1ece2", long=True)
    hat_pointed(F, "#3a4a70", GOLD_DK)
    x, y = staff(F)
    F.use("Staff_glow")
    F.box(x, y + 1, x, y + 3, GOLD, 0, "spine")
    F.put(x - 1, y + 2, GOLD, 0, "spine")
    F.put(x + 1, y + 2, GOLD, 0, "spine")
    return F.finish(lg=0.55, hold="R")


@model("hesper", "person", "Hesper Marrow, hedge-witch: moss dress, cream apron, rust shawl, slouch hat with a rosehip sprig, grey bun")
def hesper():
    skin, dr, hat = "#f0c9a6", "#5f7a4e", "#56603f"
    F = person("hesper", skin, {"shin": 4})
    n, h = F.neck, F.hip
    robe(F, dr, trim="#4b6340", boots="#4b3a2c")
    sleeves(F, dr, cuff="#4b6340")
    F.box(-3, 2, 2, h + 1, "#e9dfcb", 0)                     # apron and bib
    F.box(-2, h + 2, 1, h + 4, "#e9dfcb", 0)
    F.box(F.X0, h + 2, F.X1, h + 2, "#6b5040", 1)
    F.put(F.X0, h + 2, "#6b5040", 0)
    F.put(F.X1, h + 2, "#6b5040", 0)
    F.box(F.X0 - 3, n - 3, F.X1 + 3, n - 1, "#a35f45")       # shawl
    F.box(-2, n - 4, 1, n - 4, "#a35f45", 0)
    F.box(-1, n - 5, 0, n - 5, "#a35f45", 0)
    for x in range(F.X0 - 3, F.X1 + 4, 2):
        F.front(x, n - 3, shade("#a35f45", -0.18))
    hair(F, "bun", "#b9b4ac")
    y = n + 5                                                # slouch hat
    F.box(-6, y, 6, y, hat, (-1, 0, 1, 2), "head")
    F.box(-4, y + 1, 4, y + 1, shade(hat, -0.25), (0, 1))
    F.box(-4, y + 2, 3, y + 2, hat)
    F.box(-3, y + 3, 1, y + 3, hat)
    F.put(3, y + 1, "#c0392b", 0)
    F.put(4, y + 1, "#6f9a5c", 0)
    return F.finish(lg=0.55)


@model("pell", "person", "Pell, the apprentice's young cousin: mustard tunic, red scarf, curly hair, satchel")
def pell():
    skin, tu = "#c98d5f", "#d8a84a"
    F = person("pell", skin, {"shin": 4, "thigh": 3, "torso": 7, "arm": 6, "fore": 4})
    n, h = F.neck, F.hip
    trousers(F, "#6e5038", "#4b3a2c", boot_rows=2, skirt=tu, skirt_rows=2)
    F.box(F.X0, h, F.X1, n - 1, tu)
    sleeves(F, tu, cuff="#b8893a")
    F.box(F.X0, h, F.X1, h, "#b8893a")
    for i in range(8):                                       # satchel strap, right shoulder to left hip
        F.put(F.X0 + i, n - 2 - (i * 4) // 7, "#6e5038", 0)
    F.box(1, h - 1, 3, h + 1, "#8a6040", -1, "spine")
    F.box(1, h + 1, 3, h + 1, "#6e5038", -1, "spine")
    F.put(2, h, GOLD_DK, -1, "spine")
    F.box(F.X0, n - 1, F.X1, n - 1, "#c0392b")               # scarf
    F.box(1, n - 3, 2, n - 2, "#c0392b", 0)
    hair(F, "curly", "#2b1d14", lift=True)
    return F.finish()


@model("marta", "person", "Marta Fenn, well-keeper: blue dress, kerchief, braids, a bucket in her left hand")
def marta():
    skin, dr, ker = "#a86b42", "#4a5f78", "#c97a4a"
    F = person("marta", skin, {"torso": 8})
    n, h, w = F.neck, F.hip, F.wrist
    robe(F, dr, trim="#3b4c62", boots="#4b3a2c")
    sleeves(F, dr, cuff="#3b4c62")
    F.box(-3, 2, 2, h + 2, "#ddd3c2", 0)
    F.box(F.X0, h + 2, F.X1, h + 2, "#c4b9a6")
    hair(F, "braids", "#2b1d14", tie=ker)
    for i in (5, 6, 7):                                      # kerchief
        F.box(HEAD[i][0], n + i, HEAD[i][1], n + i, ker)
    F.box(-1, n + 3, 1, n + 5, ker, 2, "head")
    x0 = F.X1 + 1                                            # bucket
    F.box(x0, w - 4, x0 + 2, w - 2, "#a07650", (0, 1), "fore_L")
    F.box(x0, w - 3, x0 + 2, w - 3, "#4a4440", (0, 1), "fore_L")
    F.put(x0, w - 1, "#4a4440", 0, "fore_L")
    F.put(x0 + 2, w - 1, "#4a4440", 0, "fore_L")
    return F.finish(lg=0.55, hold="L")


@model("abel", "person", "Abel Crane, miller: heavy-set, floury apron, flat cap, ginger beard, ledger under his arm")
def abel():
    skin, sh, cap = "#f6d5b8", "#c7b48e", "#cdb894"
    F = person("abel", skin, {"bw": 10})
    n, h = F.neck, F.hip
    trousers(F, "#6e5038", "#4b3a2c")
    F.box(F.X0, h, F.X1, n - 1, sh)
    sleeves(F, sh, cuff="#a8956e", skin=skin, roll=True)
    F.box(-4, 3, 3, h + 2, "#f1ece2", 0)                     # apron and bib
    F.box(-3, h + 3, 2, n - 3, "#f1ece2", 0)
    F.box(F.X0, h + 2, F.X1, h + 2, "#a8956e", 1)
    for x, y in ((-2, 5), (1, h), (-3, h + 4), (2, 7)):
        F.front(x, y, "#ddd3c2")
    hair(F, "short", "#a0622c")
    beard(F, "#b06a30")
    for i in (5, 6, 7):                                      # flat cap with a peak
        F.box(HEAD[i][0], n + i, HEAD[i][1], n + i, cap)
    F.box(-4, n + 5, 4, n + 5, shade(cap, -0.15), -1, "head")
    F.box(F.X1, h + 2, F.X1 + 2, h + 5, "#7a2e3a", -1, "spine")   # ledger
    F.box(F.X1, h + 2, F.X1 + 2, h + 2, "#e9dfcb", -1, "spine")
    return F.finish(hold="L")


@model("bram", "person", "Bram Ostler, carter: broad (12-wide body), tan weathered face, short grey beard, flat brown cap, oatmeal shirt with rolled sleeves, green waistcoat, a carter's whip in the right hand")
def bram():
    skin, shirt, vest, cap = "#c28a5c", "#d9cdb0", "#3f6a45", "#6a4a32"
    F = person("bram", skin, {"bw": 12})
    n, h = F.neck, F.hip
    trousers(F, "#6b5238", "#3e2f22")
    F.box(F.X0, h, F.X1, n - 1, shirt)
    sleeves(F, shirt, cuff="#b8aa88", skin=skin, roll=True)
    F.box(F.X0 + 1, h, F.X1 - 1, n - 2, vest, (0, 1))              # waistcoat, front and back
    F.box(-1, h + 1, 0, n - 2, shirt, 0)                            # open front showing the shirt
    F.box(-1, n - 1, 0, n - 1, shirt, 0)
    for y in range(h + 1, n - 3, 2):
        F.front(-1, y, "#c9a24a")
    F.box(F.X0, h, F.X1, h, "#3e2f22", 1)                          # belt line at the back
    hair(F, "short", "#8f8c86")
    beard(F, "#a9a6a0")
    for i in (5, 6, 7):                                             # flat cap with a peak
        F.box(HEAD[i][0], n + i, HEAD[i][1], n + i, cap)
    F.box(-4, n + 5, 4, n + 5, shade(cap, -0.15), -1, "head")
    x = F.X0 - F.aw - 1                                             # the whip: a thin stick held in the right hand
    F.box(x, F.wrist - 1, x, F.wrist + 12, "#7a5636", 0, "spine")
    F.box(x, F.wrist, x, F.wrist + 3, "#4b3a2c", 0, "spine")
    return F.finish(hold="R")


def crook(F):
    x, y = staff(F, "#8a6a4a", y1=F.neck + 7)
    F.box(x, y, x + 2, y, "#8a6a4a", 0, "spine")
    F.box(x + 2, y - 2, x + 2, y, "#8a6a4a", 0, "spine")


@model("rowan", "person", "Rowan Tull, shepherd: brown wool cloak with the hood down, green tunic, crook")
def rowan():
    skin, tu, ck = "#7a4a2c", "#5f7a4e", "#8a6a4a"
    F = person("rowan", skin)
    n, h = F.neck, F.hip
    trousers(F, "#7a5a3a", "#4b3a2c", skirt=tu)
    F.box(F.X0, h, F.X1, n - 1, tu)
    sleeves(F, tu, cuff="#4b6340")
    F.box(F.X0, h, F.X1, h, "#4b3a2c")
    mantle(F, ck, cape_to=3, clasp=GOLD_DK)
    F.box(-3, n - 1, 3, n + 1, shade(ck, -0.12), 2, "spine")  # the hood, down
    hair(F, "short", "#1d1814")
    beard(F, "#2b211a")
    crook(F)
    return F.finish(hold="R")


@model("odile", "person", "Reeve Odile Marsh: long wine-red coat, gold chain of office, auburn bun, glasses")
def odile():
    skin, ct = "#e8b98f", "#7a2e3a"
    F = person("odile", skin)
    n, h = F.neck, F.hip
    robe(F, ct, trim=GOLD_DK, flare=2)
    sleeves(F, ct, cuff=GOLD_DK)
    F.box(F.X0, h + 1, F.X1, h + 1, "#3b2a22")
    F.box(-1, 2, -1, h, shade(ct, -0.22), 0)
    for x, y in ((-3, n - 1), (2, n - 1), (-2, n - 2), (1, n - 2), (-1, n - 3), (0, n - 3)):
        F.put(x, y, GOLD_DK, 0)
    F.box(-1, n - 4, 0, n - 4, GOLD, 0)
    hair(F, "bun", "#8a3b22")
    glasses(F, "#9a6a2c", t=0.12)
    return F.finish(lg=0.55)


@model("gale", "person", "Gale Harrow, grain-warden: leather jerkin, straw hat, grey beard, tally slate in the left hand")
def gale():
    skin, jk, straw = "#c98d5f", "#8a6040", "#d9b866"
    F = person("gale", skin)
    n, h, w = F.neck, F.hip, F.wrist
    trousers(F, "#4a4a52", "#4b3a2c", skirt=jk, skirt_rows=2)
    F.box(F.X0, h, F.X1, n - 1, jk)
    sleeves(F, "#d8cdb4", cuff="#6e5038")
    for a, b in F.arms():
        F.box(a, n - 2, b, n - 1, jk)
    F.box(F.X0, h, F.X1, h, "#4b3a2c")
    for y in range(h + 2, n - 1, 2):
        F.box(-1, y, 0, y, "#6e5038", 0)
    hair(F, "short", "#8a8580")
    beard(F, "#9a958e")
    y = n + 5                                                # straw hat
    F.box(-7, y, 7, y, straw, (-1, 0, 1, 2), "head")
    F.box(-4, y + 1, 4, y + 1, jk)
    F.box(-4, y + 2, 4, y + 2, straw)
    F.box(-3, y + 3, 3, y + 3, shade(straw, -0.1))
    x0 = F.X1 + 1                                            # tally slate
    F.box(x0, w, x0 + 2, w + 3, "#4b525b", -1, "fore_L")
    for x, yy in ((x0, w + 2), (x0 + 1, w + 2), (x0 + 2, w + 1)):
        F.put(x, yy, "#dfe2e6", -1, "fore_L")
    return F.finish(hold="L")


def hood_up(F, col):
    n = F.neck
    for i in (5, 6, 7):
        F.box(HEAD[i][0], n + i, HEAD[i][1], n + i, col, 0)
    for i in range(8):
        F.box(HEAD[i][0], n + i, HEAD[i][1], n + i, col, 1)
    for x in (-5, 5):
        F.box(x, n + 1, x, n + 3, col, 0)
        F.box(x + (1 if x > 0 else -1), n + 1, x + (1 if x > 0 else -1), n + 5, col)
    F.put(5, n + 4, col)
    F.box(-3, n + 8, 3, n + 8, col)
    F.box(-4, n, 4, n + 7, col, 2, "head")


@model("sefa", "person", "Sefa, the Hollow who doubts: grey hooded cloak with a face you can see (young, unsure)")
def sefa():
    skin, tu, ck = "#a86b42", "#7d8085", "#8c9096"
    F = person("sefa", skin, {"torso": 8})
    n, h = F.neck, F.hip
    trousers(F, "#55585e", "#3b3f44", skirt=tu)
    F.box(F.X0, h, F.X1, n - 1, tu)
    sleeves(F, tu, cuff="#6a6d72")
    F.box(F.X0, h, F.X1, h, "#6a6d72")
    mantle(F, ck, cape_to=2)
    hair(F, "short", "#2b1d14")
    hood_up(F, ck)
    return F.finish()


@model("hollow", "person", "A Hollow: ragged grey hooded robe, an empty dark hood, sleeves ending in shadow; glides, no feet")
def hollow():
    rb, ck, void = "#8c9096", "#7d8085", "#14161a"
    F = Fig("hollow", thigh=6, torso=10)
    n, h = F.neck, F.hip
    robe(F, rb, flare=3)
    for x, y in ((-5, 1), (-3, 1), (-2, 1), (0, 1), (2, 1), (3, 1), (-4, 2), (-1, 2), (1, 2), (4, 2), (-3, 3)):
        F.cut(x, y)
    for x in range(F.X0, F.X1 + 1):
        F.cut(x, 0)
    sleeves(F, rb)
    for a, b in F.arms():
        F.box(a, F.wrist, b, F.wrist, "#1c1e22")
        F.cut(a, F.wrist)
        F.cut(b, F.wrist)
    F.box(F.X0, h + 1, F.X1, h + 1, "#6a6d72")
    mantle(F, ck, cape_to=3)
    head(F, ck)
    F.box(-3, n + 1, 3, n + 4, void, 0)
    F.box(-2, n, 2, n, void, 0)
    hood_up(F, ck)
    F.box(-3, n + 1, 3, n + 4, void, 0)
    F.box(-2, n + 9, 2, n + 9, ck)
    return F.finish(float_=True)


@model("morvane", "person", "Morvane the Hollow, once a Warden: tall and pale, charcoal robe with broken gold Measure lines, a tattered midnight mantle, a hollow rune on his chest (Rune_glow)")
def morvane():
    skin, rb, mt = "#d9cfc4", "#2e3036", "#23283c"
    F = person("morvane", skin, {"thigh": 6, "torso": 10})
    n, h = F.neck, F.hip
    robe(F, rb, trim="#b8bcc4")
    sleeves(F, rb, cuff="#b8bcc4")
    F.box(F.X0, h + 1, F.X1, h + 1, "#6a6d72")
    for y in (3, 4, 6, 9, 10):                               # the Measure lines, broken
        F.put(-3, y, GOLD_DK, 0)
    for y in (2, 3, 5, 6, 7, 10):
        F.put(2, y, GOLD_DK, 0)
    mantle(F, mt, rows=3, cape_to=2)
    for x, y in ((-4, 2), (-2, 2), (-1, 2), (1, 2), (3, 2), (-3, 3), (0, 3), (2, 3), (-4, 4)):
        F.cut(x, y, 2)
    for x in (-5, 5):                                        # high collar
        F.box(x, n, x, n + 1, mt, (0, 1), "spine")
    F.box(-4, n, 4, n + 1, mt, 2, "spine")
    hair(F, "shaved", "#24242a")
    F.box(2, n + 6, 3, n + 7, "#b8bcc4", 0)
    F.put(-4, n + 1, shade(skin, -0.14), 0)
    F.put(4, n + 1, shade(skin, -0.14), 0)
    F.use("Rune_glow", PUFF)                                 # a hollow square: the mark of a hollow spell
    for x in range(-2, 2):
        for y in range(n - 8, n - 4):
            if x in (-2, 1) or y in (n - 8, n - 5):
                F.put(x, y, "#c9a2ff", 0, "spine")
    return F.finish(lg=0.55)


@model("taddeus", "person", "Taddeus Quill, Keeper of the Great Scales (Riverholm): teal robe with bronze trim, scholar's cap, round glasses, goatee, a quill behind his ear")
def taddeus():
    skin, rb, br = "#e3b58f", "#2f6f73", "#b0793a"
    F = person("taddeus", skin)
    n, h = F.neck, F.hip
    robe(F, rb, trim=br, flare=2)
    sleeves(F, rb, cuff=br)
    F.box(-1, 2, 0, n - 2, "#3f8a8c", 0)
    for y in range(h + 3, n - 1, 2):
        F.put(-1, y, br, 0)
    F.box(F.X0, h + 1, F.X1, h + 1, br)
    F.box(-2, n - 1, 1, n - 1, "#e9dfcb", 0)
    hair(F, "ring", "#7a6a5a")
    F.box(-1, n, 1, n, "#7a6a5a", 0)                         # goatee
    F.put(0, n - 1, "#7a6a5a", -1, "head")
    for i in (6, 7):                                         # scholar's cap: a band and a flat board
        F.box(HEAD[i][0], n + i, HEAD[i][1], n + i, "#24585b")
    F.box(-5, n + 8, 5, n + 8, "#24585b", (-1, 0, 1, 2), "head")
    F.box(5, n + 6, 5, n + 7, br, -1, "head")
    for x, y in ((6, n + 3), (6, n + 4), (7, n + 5), (7, n + 6)):   # quill
        F.put(x, y, "#f1ece2", 0)
    glasses(F, "#9a6a2c", t=0.12)
    return F.finish(lg=0.55)


@model("ilsabet", "person", "Ilsabet Thorne, the Ringwarden (Greystone): tall, slate robe with silver trim, plum sash, silver circlet, black bun with a white streak, a staff topped with a ring")
def ilsabet():
    skin, rb, sv, pl = "#8d5a3b", "#5e6670", "#c9d0d8", "#6a3d6e"
    F = person("ilsabet", skin, {"thigh": 6})
    n, h = F.neck, F.hip
    robe(F, rb, trim=sv, flare=2)
    sleeves(F, rb, cuff=sv)
    mantle(F, "#4b525b")
    F.box(F.X0 - 3, n - 3, F.X1 + 3, n - 3, sv, 0)
    F.box(F.X0, h + 1, F.X1, h + 1, pl)
    F.box(1, h - 3, 2, h, pl, 0)
    hair(F, "bun", "#1d1814")
    F.box(2, n + 6, 2, n + 7, "#e8e2d6", 0)
    F.box(-4, n + 5, 4, n + 5, sv)                           # circlet
    F.put(0, n + 5, "#9fe8ff", 0)
    x, y = staff(F, "#4b525b", y1=n + 3)
    for dx in (-1, 0, 1):
        for dy in (1, 2, 3):
            if (dx, dy) != (0, 2):
                F.put(x + dx, y + dy, sv, 0, "spine")
    return F.finish(lg=0.55, hold="R")


@model("wenna", "person", "Old Wenna Ashgrove, seer of the Bonelands: small, bone-white dress with a hoodoo-striped hem, dusk-red shawl, long white hair, bone necklace, a stick with a bone charm")
def wenna():
    skin, dr, sw = "#b07a55", "#d8cdb4", "#9a4a3a"
    F = person("wenna", skin, {"shin": 4, "thigh": 4, "torso": 8, "arm": 7})
    n, h = F.neck, F.hip
    robe(F, dr, trim="#a35f45", boots="#4b3a2c")
    F.box(F.X0 - 1, 2, F.X1 + 1, 2, "#c98d62")
    F.box(F.X0 - 1, 3, F.X1 + 1, 3, "#a35f45")
    sleeves(F, dr, cuff="#a35f45")
    F.box(F.X0 - 3, n - 3, F.X1 + 3, n - 1, sw)
    F.box(-2, n - 4, 1, n - 4, sw, 0)
    for x in range(F.X0 - 3, F.X1 + 4, 2):
        F.front(x, n - 3, shade(sw, -0.2))
    for x, y in ((-3, n - 1), (-2, n - 2), (-1, n - 3), (0, n - 3), (1, n - 2), (2, n - 1)):
        F.put(x, y, "#f1ece2", 0)
    hair(F, "long", "#e8e2d6")
    for x in range(-4, 5):                                   # striped headband
        F.put(x, n + 5, "#a35f45" if x % 2 else "#c98d62", 0)
    x, y = staff(F, "#7a5a3a", y1=n + 1)
    F.put(x + 1, y, "#7a5a3a", 0, "spine")
    F.put(x + 1, y - 1, "#f1ece2", 0, "spine")
    F.put(x + 1, y - 2, "#f1ece2", 0, "spine")
    return F.finish(lg=0.5, hold="R")


@model("roan", "person", "Captain Roan Ashby of the river watch: teal-blue coat with bronze buttons, kettle helmet, brown beard, tall boots, a boat-hook")
def roan():
    skin, ct, br, mt = "#d9a47a", "#2d5a6e", "#b0793a", "#8c9298"
    F = person("roan", skin)
    n, h = F.neck, F.hip
    trousers(F, "#3b4044", "#3b2a22", boot_rows=4, skirt=ct)
    F.box(F.X0, h, F.X1, n - 1, ct)
    sleeves(F, ct, cuff=br)
    for a, b in F.arms():
        F.box(a, n - 1, b, n - 1, br)
    F.box(F.X0, h, F.X1, h, "#3b2a22")
    F.box(-1, h, 0, h, br, 0)
    for y in range(h + 2, n - 1, 2):
        F.put(-2, y, br, 0)
        F.put(1, y, br, 0)
    hair(F, "short", "#5a3d28")
    beard(F, "#5a3d28")
    y = n + 5                                                # kettle helmet
    F.box(-6, y, 6, y, mt, (-1, 0, 1, 2), "head")
    F.box(-4, y + 1, 4, y + 1, mt)
    F.box(-3, y + 2, 3, y + 2, "#b8bec4")
    F.box(-6, y, 6, y, shade(mt, -0.15), -1, "head")
    x, yy = staff(F, "#6e5038", y1=n + 7)                    # boat-hook
    F.box(x, yy + 1, x, yy + 2, "#b8bec4", 0, "spine")
    F.put(x + 1, yy, "#b8bec4", 0, "spine")
    F.put(x + 1, yy - 1, "#b8bec4", 0, "spine")
    return F.finish(hold="R")


# ─────────────────────────────── the tinted hero and the chosen heroes ───────────────────────────────

def hero_base(F):
    """Skin, Fixed (eyes and mouth), the six hair styles and the glasses, all white where the game tints them."""
    W = "#ffffff"
    F.use("Skin")
    head(F, W)
    hands(F, W)
    F.use("Fixed", PUFF)
    face(F)
    for st in HAIR_STYLES:
        F.use("Hair_" + st, PUFF)
        hair(F, st, W)
    F.use("Glasses")
    glasses(F)


@model("hero", "person", "The tinted villager and apprentice: slot meshes coloured from the look (Pack.dress), six hair styles, cloak, belt and pouch")
def hero():
    W, G1, G2 = "#ffffff", "#d6d6d6", "#bdbdbd"
    F = Fig("hero")
    n, h = F.neck, F.hip
    F.meshes.pop("hero")
    hero_base(F)
    F.use("Fixed", PUFF)
    F.box(F.X0, h, F.X1, h, H["belt"])
    F.box(-1, h, 0, h, GOLD_DK, 0)
    F.box(1, h + 1, 3, h + 2, H["pouch"], 0)
    F.use("Top")
    F.box(F.X0, 7, F.X1, n - 1, W)
    sleeves(F, W, cuff=G2)
    F.box(F.X0 - 3, n - 3, F.X1 + 3, n - 1, G1)
    F.use("Legs")
    F.box(F.X0, 4, F.X1, 6, W)
    F.use("Boots")
    F.box(F.X0, 0, F.X1, 3, W)
    F.use("Cloak")
    F.box(F.X0, F.knee, F.X1, n - 1, W, 2, "spine")
    F.box(F.X0, n - 1, F.X1, n - 1, G1, 2, "spine")
    return F.finish()


def wear_robe(F, mesh, col, trim, belt, lines=None):
    n, h = F.neck, F.hip
    F.use(mesh)
    robe(F, col, trim=trim, flare=3, y0=2)
    sleeves(F, col, cuff=trim)
    F.box(F.X0, h + 1, F.X1, h + 1, belt)
    F.box(1, h - 2, 1, h, belt, 0)
    F.box(-2, n - 1, 1, n - 1, trim, 0)
    if lines:                                                # the gold lines of the Measure
        F.box(-1, 3, -1, h, lines, 0)
        F.box(-1, h + 2, -1, n - 2, lines, 0)
        for y in range(4, n - 2, 3):
            F.put(-2, y, lines, 0)
            F.put(0, y, lines, 0)


def chosen(name, female):
    F = Fig(name, **({"torso": 8} if female else {}))
    n, h = F.neck, F.hip
    F.meshes.pop(name)
    hero_base(F)
    F.use("Wshoes_work")
    F.box(F.X0, 0, F.X1, 1, "#5a4232")
    F.use("Wtop_farm")                                       # linen shirt, brown skirt or trousers
    F.box(F.X0, h, F.X1, n - 1, "#e4dcc8")
    sleeves(F, "#e4dcc8", cuff="#c9bfa6")
    F.box(F.X0, h, F.X1, h, "#6b5040")
    if female:
        F.box(F.X0, 2, F.X1, 3, "#4e4743")
        F.box(F.X0, 4, F.X1, h - 1, "#7a5a3a")
        F.box(F.X0 - 1, 4, F.X0 - 1, 5, "#7a5a3a")
        F.box(F.X1 + 1, 4, F.X1 + 1, 5, "#7a5a3a")
        F.box(F.X0 - 1, 4, F.X1 + 1, 4, "#6a4c30")
    else:
        F.box(F.X0, 2, F.X1, h - 1, "#7a5a3a")
    wear_robe(F, "Wtop_novice", "#7d8f76", "#687a62", "#b49a6a")
    wear_robe(F, "Wtop_adept", "#6a3d6e", "#c9d0d8", "#c9d0d8")
    wear_robe(F, "Wtop_warden", "#23305a", GOLD_DK, GOLD_DK, lines=GOLD)
    F.use("What_novice")                                     # patched brown felt, crooked tip
    y = hat_pointed(F, "#7a5a3a", "#5e442c")
    for x, yy in ((-2, y + 3), (-1, y + 3), (-2, y + 4), (2, y + 2)):
        F.front(x, yy, "#a07650")
    F.use("What_emberdale")                                  # canola-gold band, wheat sprig, frost-blue tip
    y = hat_pointed(F, "#8a6a3a", "#e8c838", tip="#bfe0ee")
    for yy in (y + 1, y + 2, y + 3):
        F.put(5, yy, "#d9b866", -1, "head")
    F.use("What_riverholm")                                  # deep teal, river-bronze band and buckle
    y = hat_pointed(F, "#2f6f73", "#b0793a")
    F.front(0, y + 1, GOLD)
    F.use("What_greystone")                                  # slate grey with a silver star
    y = hat_pointed(F, "#5e6670", "#4b525b", straight=True)
    for x, yy in ((0, y + 2), (-1, y + 3), (0, y + 3), (1, y + 3), (0, y + 4)):
        F.front(x, yy, "#e6eaf0")
    F.use("What_bonelands")                                  # dusk-red, striped hoodoo band, bone charm
    y = hat_pointed(F, "#9a4a3a", "#c98d62")
    for x in range(-5, 6, 2):
        F.front(x, y + 1, "#a35f45")
    F.put(3, y + 9, "#f1ece2", 0, "head")
    F.put(3, y + 8, "#f1ece2", 0, "head")
    F.use("What_warden")                                     # midnight blue, gold Measure lines
    y = hat_pointed(F, "#23305a", GOLD_DK, straight=True)
    for yy in range(y + 2, y + 9):
        F.front(0, yy, GOLD)
    return F.finish()


@model("hero_f", "person", "Witch apprentice (female body): tinted skin and six hair styles; earned farm clothes, robes and pointed hats")
def hero_f():
    return chosen("hero_f", True)


@model("hero_m", "person", "Wizard apprentice (male body): tinted skin and six hair styles; earned farm clothes, robes and pointed hats")
def hero_m():
    return chosen("hero_m", False)


# ─────────────────────────────── animals ───────────────────────────────
# Animals are solid voxel bodies (not flat drawings): they are seen side-on as often as head-on.
# Bones: body (the root), head, one per leg, tail. Cells are (x, y, z), z toward the nose.

def quad_rig(name, body, head, legs, tail=None):
    c = lambda p: tuple(v * V for v in p)
    b = [("body", None, c(body), c((body[0], body[1] + 2, body[2]))), ("head", "body", c(head), c((head[0], head[1], head[2] + 2)))]
    for nm, p in legs.items():
        b.append((nm, "body", c(p), c((p[0], 0, p[2]))))
    if tail:
        b.append(("tail", "body", c(tail), c((tail[0], tail[1] + 1, tail[2] - 1))))
    return Rig(name + "_rig", b)


def quad_walk(rig, legs, amp=26, bob=0.012, tail=False):
    d = [l for l in legs if l in ("leg_FL", "leg_BR", "leg_L")]
    def k(s):
        p = {l: ((-amp if l in d else amp) * s, 0, 0) for l in legs}
        p["head"] = (3 * s, 0, 0)
        p["body"] = {"r": (0, 0, 1.5 * s), "t": (0, bob * (1 - abs(s)), 0)}
        if tail:
            p["tail"] = (0, 0, 20 * s)
        return p
    rig.anim("walk", [(1, k(1)), (7, k(0)), (13, k(-1)), (19, k(0)), (25, k(1))])


def sheep_like(name, wool, facec, legc, big):
    A = Vox(name)
    rng = random.Random(name)
    w = lambda: wool if rng.random() < 0.72 else shade(wool, -0.07)
    if big:
        bx, by, bz, lh = (-5, 4), (6, 13), (-8, 6), 6
        hx, hy, hz = (-3, 2), (9, 14), (7, 10)
        lx, lz, lw = (-4, 2), (4, -7), 2
    else:
        bx, by, bz, lh = (-3, 2), (4, 8), (-5, 4), 4
        hx, hy, hz = (-2, 1), (6, 10), (5, 7)
        lx, lz, lw = (-3, 2), (3, -5), 1
    for x in range(bx[0], bx[1] + 1):
        for y in range(by[0], by[1] + 1):
            for z in range(bz[0], bz[1] + 1):
                A.put3(x, y, z, w(), "body")
    A.box3(-1, by[1] - 2, bz[0] - 1, 0, by[1] - 1, bz[0] - 1, wool, "body")
    for x in range(hx[0], hx[1] + 1):
        for y in range(hy[0], hy[1] + 1):
            for z in range(hz[0], hz[1] + 1):
                A.put3(x, y, z, w() if z < hz[1] else facec, "head")
    for x in (hx[0] - 1, hx[1] + 1):                         # ears
        A.put3(x, hy[1] - 2, hz[0] + 1, facec, "head")
    ex = 1 if big else 0
    A.put3(hx[0] + ex, hy[1] - 2, hz[1], "#f1ece2" if big else INK, "head")
    A.put3(hx[1] - ex, hy[1] - 2, hz[1], "#f1ece2" if big else INK, "head")
    legs = {}
    for nm, x0, z0 in (("leg_FL", lx[1], lz[0]), ("leg_FR", lx[0], lz[0]), ("leg_BL", lx[1], lz[1]), ("leg_BR", lx[0], lz[1])):
        A.box3(x0, 0, z0, x0 + lw - 1, lh - 1, z0 + lw - 1, legc, nm)
        legs[nm] = (x0 + lw / 2, lh, z0 + lw / 2)
    rig = quad_rig(name, (0, (by[0] + by[1]) / 2, 0), (0, hy[0] + 2, hz[0]), legs)
    A.build(rig)
    rig.anim("idle", [(1, {}), (25, {"head": (4, 10, 0)}), (49, {"head": (0, -8, 0)}), (73, {})])
    quad_walk(rig, legs, amp=24 if big else 30)
    gz = lambda yaw: {"head": (16, yaw, 0), "body": {"r": (4, 0, 0), "t": (0, -0.015, 0)}}
    rig.anim("graze", [(1, gz(0)), (9, gz(7)), (17, gz(-7)), (25, gz(0))])
    return rig


@model("sheep", "animal", "A ewe: cream wool, dark face and legs")
def sheep():
    return sheep_like("sheep", "#ece6da", "#4b3a2c", "#3b2e24", True)


@model("lamb", "animal", "A lamb: white wool, pink face")
def lamb():
    return sheep_like("lamb", "#f6f1e6", "#e8cfc0", "#d8c4b4", False)


@model("hen", "animal", "A white hen: red comb and wattle, yellow beak and legs")
def hen():
    A = Vox("hen")
    wh, red, yl = "#f1ece2", "#c0392b", "#e0a83a"
    A.box3(-2, 2, -3, 2, 5, 3, wh, "body")                   # 10 voxels (0.40) from foot to comb
    A.box3(-1, 4, -5, 1, 7, -4, wh, "body")                  # tail
    A.box3(-1, 7, -5, 1, 8, -5, shade(wh, -0.08), "body")
    A.box3(-3, 3, -2, -3, 4, 2, shade(wh, -0.08), "body")    # wings
    A.box3(3, 3, -2, 3, 4, 2, shade(wh, -0.08), "body")
    A.box3(-1, 5, 3, 1, 8, 5, wh, "head")
    A.box3(0, 9, 3, 0, 9, 5, red, "head")
    A.put3(0, 6, 6, yl, "head")
    A.put3(0, 5, 6, red, "head")
    A.put3(-1, 7, 5, INK, "head")
    A.put3(1, 7, 5, INK, "head")
    legs = {}
    for nm, x in (("leg_L", 1), ("leg_R", -1)):
        A.box3(x, 0, 0, x, 1, 0, yl, nm)
        A.put3(x, 0, 1, yl, nm)
        legs[nm] = (x + 0.5, 2, 0.5)
    rig = quad_rig("hen", (0, 3.5, 0), (0, 5, 3), legs)
    A.build(rig)
    rig.anim("idle", [(1, {}), (13, {"head": (0, 25, 0)}), (25, {"head": (0, 25, 0)}), (31, {"head": (0, -20, 0)}), (49, {})])
    quad_walk(rig, legs, amp=32, bob=0.008)
    pk = lambda k: {"body": {"r": (30 * k, 0, 0)}, "head": (35 * k, 0, 0), "leg_L": (-30 * k, 0, 0), "leg_R": (-30 * k, 0, 0)}
    rig.anim("peck", [(1, pk(0)), (5, pk(1)), (8, pk(0.6)), (11, pk(1)), (17, pk(0))])
    return rig


def sit_clip(rig, tail=True):
    st = {"body": {"r": (-12, 0, 0), "t": (0, -0.04, -0.03)}, "leg_BL": (-52, 0, 0), "leg_BR": (-52, 0, 0), "leg_FL": (12, 0, 0),
          "leg_FR": (12, 0, 0), "head": (6, 0, 0)}
    rig.anim("sit", [(1, st), (13, dict(st, head=(4, 15, 0))), (25, dict(st, head=(8, -8, 0))), (37, st)])


@model("dog", "animal", "A sheepdog: black and white, ears up, white-tipped tail")
def dog():
    A = Vox("dog")
    bk, wh = "#2b2622", "#f1ece2"
    A.box3(-2, 6, -8, 2, 11, 5, bk, "body")
    A.box3(-2, 6, 3, 2, 9, 5, wh, "body")                    # chest
    A.box3(-1, 6, -8, 1, 6, 2, wh, "body")                   # belly
    A.box3(-2, 10, 5, 2, 15, 9, bk, "head")
    A.box3(0, 12, 9, 0, 15, 9, wh, "head")                   # blaze
    A.box3(-1, 10, 10, 1, 12, 12, wh, "head")                # muzzle
    A.put3(0, 12, 12, INK, "head")
    A.put3(-1, 13, 9, "#b8893a", "head")
    A.put3(1, 13, 9, "#b8893a", "head")
    for x in (-2, 2):
        A.box3(x, 16, 6, x, 17, 6, bk, "head")
    legs = {}
    for nm, x0, z0 in (("leg_FL", 1, 3), ("leg_FR", -2, 3), ("leg_BL", 1, -8), ("leg_BR", -2, -8)):
        A.box3(x0, 0, z0, x0 + 1, 5, z0 + 1, bk, nm)
        A.box3(x0, 0, z0, x0 + 1, 1, z0 + 1, wh, nm)
        legs[nm] = (x0 + 1, 6, z0 + 1)
    A.box3(0, 10, -10, 0, 11, -9, bk, "tail")
    A.box3(0, 12, -11, 0, 13, -11, bk, "tail")
    A.put3(0, 14, -11, wh, "tail")
    rig = quad_rig("dog", (0, 8.5, -1.5), (0, 12, 5), legs, tail=(0.5, 11, -8))
    A.build(rig)
    rig.anim("idle", [(1, {"tail": (0, 0, 18)}), (7, {"tail": (0, 0, -18)}), (13, {"tail": (0, 0, 18), "head": (0, 10, 0)}),
                      (19, {"tail": (0, 0, -18), "head": (0, 10, 0)}), (25, {"tail": (0, 0, 18)})])
    quad_walk(rig, legs, amp=34, bob=0.015, tail=True)
    sit_clip(rig)
    return rig


@model("cat", "animal", "The familiar: a small black cat with gold eyes, tail up")
def cat():
    A = Vox("cat")
    bk = "#26221f"
    A.box3(-1, 3, -5, 1, 6, 3, bk, "body")
    A.box3(-2, 5, 3, 2, 8, 5, bk, "head")
    A.put3(-2, 9, 4, bk, "head")
    A.put3(2, 9, 4, bk, "head")
    A.put3(-1, 7, 5, GOLD, "head")
    A.put3(1, 7, 5, GOLD, "head")
    A.put3(0, 6, 6, "#4b3a2c", "head")
    legs = {}
    for nm, x0, z0 in (("leg_FL", 1, 2), ("leg_FR", -1, 2), ("leg_BL", 1, -5), ("leg_BR", -1, -5)):
        A.box3(x0, 0, z0, x0, 2, z0, bk, nm)
        legs[nm] = (x0 + 0.5, 3, z0 + 0.5)
    A.box3(0, 6, -6, 0, 10, -6, bk, "tail")
    A.put3(0, 11, -7, bk, "tail")
    rig = quad_rig("cat", (0, 4.5, -1), (0, 6, 3), legs, tail=(0.5, 6, -5))
    A.build(rig)
    rig.anim("idle", [(1, {"tail": (0, 0, 12)}), (19, {"tail": (0, 0, -12), "head": (0, -12, 0)}), (37, {"tail": (0, 0, 12)})])
    quad_walk(rig, legs, amp=34, bob=0.008, tail=True)
    sit_clip(rig)
    return rig


@model("horse", "animal", "A heavy cart horse: chestnut, dark mane and tail, pale blaze, feathered pale lower legs, leather collar (about 1.64 high at the ears)")
def horse():
    A = Vox("horse")
    ch, mane, pale, hoof = "#8a4a26", "#3a2418", "#e8dcc4", "#2e2420"
    leather, nose = "#3a2a1e", "#6e3a1e"
    rng = random.Random("horse")
    c = lambda: ch if rng.random() < 0.8 else shade(ch, -0.06)
    for x in range(-4, 5):                                          # the barrel
        for y in range(15, 27):
            for z in range(-11, 9):
                A.put3(x, y, z, c(), "body")
    for y in range(27, 37):                                         # the neck, leaning forward
        z0 = 4 + (y - 27) // 3
        for x in range(-2, 3):
            for z in range(z0, z0 + 5):
                A.put3(x, y, z, c(), "head")
        for x in (-1, 0, 1):
            A.box3(x, y, z0 - 2, x, y, z0 - 1, mane, "head")        # the mane
    A.box3(-2, 33, 9, 2, 39, 13, ch, "head")                        # the head
    A.box3(-2, 31, 14, 2, 35, 16, nose, "head")                     # the muzzle
    A.box3(-1, 36, 7, 1, 36, 8, mane, "head")
    A.box3(0, 40, 9, 0, 40, 10, mane, "head")                       # forelock
    for x in (-2, 2):
        A.put3(x, 40, 9, ch, "head")                                # ears
        A.put3(x, 37, 11, INK, "head")                              # eyes
    A.box3(0, 33, 13, 0, 39, 13, pale, "head")                      # blaze down the face
    A.box3(0, 39, 9, 0, 39, 12, pale, "head")
    A.box3(0, 33, 14, 0, 35, 14, pale, "head")
    A.box3(-1, 31, 16, 1, 32, 16, "#f0d8c8", "head")        # a pale lip
    for x in (-2, 2):
        A.put3(x, 34, 16, INK, "head")                              # nostrils
    A.box3(-3, 27, 3, 3, 30, 10, leather, "head")                   # the collar
    A.box3(-2, 27, 4, 2, 30, 9, leather, "head")
    for x in (-3, 3):
        A.put3(x, 29, 6, GOLD, "head")
    legs = {}
    for nm, x0, z0 in (("leg_FL", 1, 4), ("leg_FR", -4, 4), ("leg_BL", 1, -10), ("leg_BR", -4, -10)):
        A.box3(x0, 5, z0, x0 + 3, 14, z0 + 3, ch, nm)
        A.box3(x0, 1, z0, x0 + 3, 4, z0 + 3, pale, nm)              # pale feathered lower leg, a cell proud all round
        A.box3(x0 - 1 if x0 < 0 else x0, 1, z0 - 1, x0 + 3 if x0 < 0 else x0 + 4, 3, z0 + 4, pale, nm)
        A.box3(x0, 0, z0, x0 + 3, 0, z0 + 3, hoof, nm)
        legs[nm] = (x0 + 2, 15, z0 + 2)
    A.box3(0, 22, -12, 0, 25, -12, mane, "tail")                    # the dock and the tail
    A.box3(-1, 11, -13, 1, 21, -13, mane, "tail")
    rig = quad_rig("horse", (0, 20.5, -1), (0, 28, 5), legs, tail=(0.5, 25, -11))
    A.build(rig)
    hd = lambda a, y: {"head": (a, y, 0)}
    rig.anim("idle", [(1, {"head": (0, 0, 0), "tail": (0, 0, 10)}), (13, {"head": (7, 6, 0), "tail": (0, 0, -10)}),
                      (25, {"head": (0, 0, 0), "tail": (0, 0, 10)}), (37, {"head": (5, -6, 0), "tail": (0, 0, -6)}),
                      (49, {"head": (0, 0, 0), "tail": (0, 0, 10)})])
    quad_walk(rig, legs, amp=20, bob=0.015, tail=True)
    return rig


# ─────────────────────────────── build ───────────────────────────────

def main():
    import bpy
    a = args()
    out = a.get("out", OUT)
    only = set(a["only"].split(",")) if "only" in a else None
    manifest = {"pack": "voxpeople", "units": "1 = 1 map tile; stands on y = 0 at the origin, faces +z; place at scale 1; one voxel = 0.04",
                "models": {}}
    mpath = os.path.join(out, "pack.json")
    if only and os.path.exists(mpath):
        manifest = json.load(open(mpath))
    for name, m in MODELS.items():
        if only and name not in only:
            continue
        clear()
        rig = m["fn"]()
        bpy.context.view_layer.update()
        meshes = [ob for ob in bpy.data.objects if ob.type == "MESH" and len(ob.data.vertices)]
        pts = [ob.matrix_world @ v.co for ob in meshes for v in ob.data.vertices]
        hi = max(p.z for p in pts)
        w = max(p.x for p in pts) - min(p.x for p in pts)
        d = max(p.y for p in pts) - min(p.y for p in pts)
        tris = sum(sum(len(pl.vertices) - 2 for pl in ob.data.polygons) for ob in meshes)
        anims = [t.name for t in rig.ob.animation_data.nla_tracks]
        export(os.path.join(out, name + ".glb"))
        slots = sorted(ob.name for ob in meshes) if len(meshes) > 2 else []
        manifest["models"][name] = {"kind": m["kind"], "w": round(w, 2), "d": round(d, 2), "h": round(hi, 2), "tris": tris,
                                    "anims": anims, "slots": slots, "note": m["note"]}
        print("built %-11s %4d tris  %.2f x %.2f x %.2f  %s" % (name, tris, w, d, hi, " ".join(anims)))
    os.makedirs(out, exist_ok=True)
    json.dump(manifest, open(mpath, "w"), indent=1)
    print("wrote", mpath, len(manifest["models"]), "models")


if __name__ == "__main__":
    main()
