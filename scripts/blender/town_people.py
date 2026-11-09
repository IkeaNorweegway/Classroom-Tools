# CEFL Town v2 — the student avatars: a male student, a female student and a teddy bear, each rigged with the Realm hero's bones and clips
# (idle, walk, talk, cast, cheer), and every piece of clothing they can wear built in as its own mesh.
# Builds student_m.glb, student_f.glb, teddy.glb and pack.json in godot/story-engine/assets/town/people/.
#
#   flatpak run org.blender.Blender -b --python scripts/blender/town_people.py -- [only=student_m] [out=/abs/dir]
#
# The game shows one mesh per group (Pack.dress reads the look's "wear" and "outfit"):
#   Wtop_<id>     tee (default) hoodie jersey jeanjacket puffer
#   What_<id>     cap toque bucket                      (none by default)
#   Wshoes_<id>   basic (default) hightops boots runners
#   Wextra_<id>   backpack headphones sunglasses        (any mix)
#   Work_<kind>   apron vest cap (white: tinted from the look) · hivis suit hardhat (own colours) — Payday's job outfits
#   Locks_full / Locks_hat   hair, and the trimmed hair that shows under a hat
#   Base          skin, face and jeans (always shown)
# Names never start with a Pack.SLOT word (Skin, Hair, Top, Legs, Boots, Cloak), so nothing is tinted by accident.
import sys, os, json, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, kit
importlib.reload(kit)
from kit import Part, Rig, shade, clear, export, args
import realm_people as RP

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "godot", "story-engine", "assets", "town", "people")
INK = "#2b2622"

TOPS = ["tee", "hoodie", "jersey", "jeanjacket", "puffer"]
HATS = ["cap", "toque", "bucket"]
SHOES = ["basic", "hightops", "boots", "runners"]
EXTRAS = ["backpack", "headphones", "sunglasses"]
WORK = ["apron", "vest", "cap", "hivis", "suit", "hardhat"]

# Each body: fixed skin and hair; everyone starts in the same white tee and blue jeans (you pick the body, not the colours).
TEE, JEANS = "#f4f1ea", "#3d5a80"
STUDENTS = {
    "student_m": {"note": "Male student: short dark hair, white tee, blue jeans", "W": 1.0, "skin": "#a86b42",
                  "hair": "#2b1d14", "style": "short", "tee": TEE, "jeans": JEANS},
    "student_f": {"note": "Female student: long brown hair in a ponytail, white tee, blue jeans", "W": 0.94, "skin": "#e8b98f",
                  "hair": "#6b4226", "style": "ponytail", "tee": TEE, "jeans": JEANS},
    # The teddy bear: honey fur (skin = hair = fur), cream muzzle, belly and paw pads, button eyes.
    "teddy": {"note": "Teddy bear: honey-brown fur, cream muzzle, button eyes, round ears, white tee, blue jeans", "W": 1.04,
              "skin": "#b5794a", "hair": "#b5794a", "style": "bear", "tee": TEE, "jeans": JEANS,
              "cream": "#ead2a8"},
}


class Kit:
    """Parts by name, each bound to bones as it is drawn."""

    def __init__(self, rig, K):
        self.rig, self.K, self.parts = rig, K, {}

    def q(self, name, bone):
        if name not in self.parts:
            self.parts[name] = Part(name)
        p = self.parts[name]
        p.xf = kit.Matrix.Scale(self.K, 4)
        p.bone(bone)
        return p

    def done(self):
        for p in self.parts.values():
            p.done(self.rig)


def torso(Q, name, c, W, r_lo=0.18, r_hi=0.195, hem=0.4, long=False, sleeve=None, cuff=None, sleeveless=False):
    """A top: body from the hem to the shoulders, and short or long sleeves."""
    q = Q.q(name, "chest")
    q.cyl(0, hem + 0.06, 0, r_lo * W, 0.7 - hem - 0.06, c, seg=8, r_top=r_hi * W, top=False)
    q.cyl(0, 0.7, 0, r_hi * W, 0.05, shade(c, 0.04), seg=8, r_top=0.11, top=True)
    q = Q.q(name, "hips")
    q.cyl(0, hem, 0, r_lo * W + 0.004, 0.08, c, seg=8, top=False, bottom=True)
    if sleeveless:
        return
    sc = sleeve or c
    for side, sx in (("L", 1), ("R", -1)):
        x = sx * 0.235 * W
        q = Q.q(name, "arm_" + side)
        if long:
            q.cyl(x, 0.47, 0, 0.06, 0.24, sc, seg=6, r_top=0.068)
            q = Q.q(name, "fore_" + side)
            q.cyl(x, 0.33, 0, 0.056, 0.16, sc, seg=6, r_top=0.06, top=False)
            q.cyl(x, 0.315, 0, 0.06, 0.035, cuff or shade(sc, -0.12), seg=6)
        else:
            q.cyl(x, 0.55, 0, 0.064, 0.16, sc, seg=6, r_top=0.07)
            q.cyl(x, 0.545, 0, 0.066, 0.025, shade(sc, -0.1), seg=6, top=False)


def student(name, s):
    W, K = s["W"], 0.95
    rig = Rig(name + "_rig", RP.bones_human(K, W))
    Q = Kit(rig, K)
    skin, hair, jeans = s["skin"], s["hair"], s["jeans"]
    if s["style"] == "bear":
        bear_base(Q, s, W)
        return dress(Q, rig, s, W, hair)

    # ── Base: jeans, skin, face ──
    for side, sx in (("L", 1), ("R", -1)):
        x = sx * 0.09
        q = Q.q("Base", "thigh_" + side)
        q.cyl(x, 0.22, 0, 0.074, 0.23, jeans, seg=6)
        q = Q.q("Base", "shin_" + side)
        q.cyl(x, 0.07, 0, 0.066, 0.17, jeans, seg=6)
        q.cyl(x, 0.07, 0, 0.069, 0.03, shade(jeans, -0.12), seg=6, top=False)       # rolled hem
        xa = sx * 0.235 * W
        q = Q.q("Base", "arm_" + side)
        q.cyl(xa, 0.47, 0, 0.044, 0.23, skin, seg=6)
        q = Q.q("Base", "fore_" + side)
        q.cyl(xa, 0.32, 0, 0.041, 0.16, skin, seg=6, top=False)
        q.blob(xa, 0.285, 0.005, 0.048, 0.052, 0.048, skin, seg=6, rings=3, jit=0.05, seed=3)
    q = Q.q("Base", "hips")
    q.cyl(0, 0.36, 0, 0.17 * W, 0.12, jeans, seg=8)
    q.cyl(0, 0.455, 0, 0.172 * W, 0.03, "#3b2f28", seg=8, top=False)                # belt
    q = Q.q("Base", "chest")
    q.cyl(0, 0.45, 0, 0.16 * W, 0.27, skin, seg=8, top=False)                      # under the tops
    q = Q.q("Base", "head")
    q.cyl(0, 0.69, 0, 0.06, 0.1, skin, seg=6)
    q.blob(0, 0.88, 0, 0.165, 0.175, 0.163, skin, seg=8, rings=5, jit=0.03, seed=2)
    q.box(-0.02, 0.825, 0.15, 0.04, 0.045, 0.03, shade(skin, -0.08))                 # nose
    for sx in (-1, 1):
        q.box(sx * 0.165 - 0.015, 0.85, -0.02, 0.03, 0.06, 0.05, shade(skin, -0.05))   # ears
        q.box(sx * 0.062 - 0.02, 0.86, 0.146, 0.04, 0.052, 0.03, INK)                # eyes
        q.box(sx * 0.062 - 0.008, 0.88, 0.17, 0.014, 0.014, 0.01, "#ffffff")         # eye glint
        q.box(sx * 0.062 - 0.035, 0.925, 0.145, 0.07, 0.016, 0.03, shade(hair, 0.05))  # eyebrows
    q.box(-0.035, 0.78, 0.148, 0.07, 0.016, 0.02, "#9a5a4a")                        # mouth
    if s["style"] == "ponytail":
        for sx in (-1, 1):
            q.box(sx * 0.17 - 0.012, 0.8, 0.0, 0.024, 0.024, 0.024, "gold")          # earrings

    # ── Hair: full, and trimmed for under a hat ──
    for nm, hat in (("Locks_full", False), ("Locks_hat", True)):
        q = Q.q(nm, "head")
        if hat:
            q.blob(0, 0.9, -0.035, 0.175, 0.1, 0.165, hair, seg=8, rings=4, jit=0.04, seed=6)
        else:
            q.blob(0, 0.94, -0.03, 0.18, 0.13, 0.175, hair, seg=8, rings=4, jit=0.06, seed=6)
            q.blob(0.02, 0.965, 0.09, 0.14, 0.045, 0.07, shade(hair, -0.05), seg=7, rings=3, jit=0.15, seed=10)   # fringe
            if s["style"] == "short":
                q.blob(0.05, 1.04, 0.02, 0.1, 0.05, 0.09, shade(hair, 0.06), seg=6, rings=3, jit=0.2, seed=4)   # a bit of spike
        if s["style"] == "ponytail":
            for sx in (-1, 1):
                q.box(sx * 0.165 - 0.03, 0.8, -0.06, 0.06, 0.14, 0.12, hair)         # sides
            q.blob(0, 0.9, -0.18, 0.05, 0.045, 0.05, "#c6463a", seg=6, rings=3, jit=0.05, seed=8)   # hair tie
            q.blob(0, 0.74, -0.21, 0.07, 0.17, 0.06, hair, seg=6, rings=4, jit=0.08, seed=9)        # the tail

    return dress(Q, rig, s, W, hair)


def dress(Q, rig, s, W, hair):
    """Every top, hat, pair of shoes, extra and work outfit: the same for every body."""
    # ── Tops ──
    torso(Q, "Wtop_tee", s["tee"], W)
    torso(Q, "Wtop_hoodie", "#6b7f8e", W, r_lo=0.2, r_hi=0.205, hem=0.38, long=True)
    q = Q.q("Wtop_hoodie", "chest")
    q.blob(0, 0.71, -0.15, 0.15, 0.08, 0.08, shade("#6b7f8e", -0.1), seg=7, rings=3, jit=0.05, seed=21)   # hood down
    q.box(-0.11, 0.46, 0.19 * W, 0.22, 0.1, 0.03, shade("#6b7f8e", -0.08))           # pocket
    for sx in (-1, 1):
        q.box(sx * 0.04 - 0.008, 0.6, 0.2 * W, 0.016, 0.1, 0.012, "#efe6d6")         # drawstrings
    torso(Q, "Wtop_jersey", "#c0392b", W, r_lo=0.19, r_hi=0.2, hem=0.37, sleeve="#efe6d6")
    q = Q.q("Wtop_jersey", "chest")
    q.box(-0.17 * W, 0.63, 0.18 * W, 0.34 * W, 0.025, 0.03, "#efe6d6")               # chest stripe
    for z, flip, y in ((0.19 * W + 0.005, 1, 0.42), (-0.19 * W - 0.035, -1, 0.46)):   # the number 7, front (small) and back
        k = 0.8 if flip > 0 else 1.0
        q.box(-0.06 * k, y + 0.15 * k, z, 0.12 * k, 0.03, 0.03, "#efe6d6")          # bar
        x = 0.03 * k if flip > 0 else -0.06 * k                                    # stem under the end on the viewer's right
        q.box(x, y, z, 0.03 * k, 0.15 * k, 0.03, "#efe6d6")
    torso(Q, "Wtop_jeanjacket", "#4a6fa5", W, r_lo=0.2, r_hi=0.205, hem=0.39, long=True, cuff="#3a5a8a")
    q = Q.q("Wtop_jeanjacket", "chest")
    q.box(-0.05, 0.45, 0.195 * W, 0.1, 0.25, 0.02, "#efe6d6")                        # white tee under the open front
    for sx in (-1, 1):
        q.box(sx * 0.1 - 0.05, 0.64, 0.17 * W, 0.1, 0.07, 0.05, shade("#4a6fa5", 0.1))   # collar
        q.box(sx * 0.11 - 0.035, 0.55, 0.198 * W, 0.07, 0.05, 0.015, shade("#4a6fa5", -0.1))   # chest pockets
        q.box(sx * 0.11 - 0.006, 0.565, 0.21 * W, 0.012, 0.012, 0.01, "gold")
    torso(Q, "Wtop_puffer", "#2e7d5a", W, r_lo=0.215, r_hi=0.215, hem=0.38, sleeveless=True)
    q = Q.q("Wtop_puffer", "chest")
    for i, y in enumerate((0.46, 0.54, 0.62)):                                        # quilted bands
        q.cyl(0, y, 0, 0.225 * W, 0.035, shade("#2e7d5a", -0.08), seg=8, top=False)
    q.box(-0.008, 0.42, 0.215 * W, 0.016, 0.3, 0.012, "#c9ccd0")                     # zip
    q.cyl(0, 0.7, 0, 0.13, 0.06, "#2e7d5a", seg=8)                                   # collar
    for side, sx in (("L", 1), ("R", -1)):                                           # tee sleeves under the vest
        q = Q.q("Wtop_puffer", "arm_" + side)
        q.cyl(sx * 0.235 * W, 0.55, 0, 0.064, 0.16, "#efe6d6", seg=6, r_top=0.07)

    # ── Hats ──
    q = Q.q("What_cap", "head")
    q.cyl(0, 0.96, -0.01, 0.19, 0.08, "#2f3a5c", seg=8, r_top=0.165)
    q.box(-0.13, 0.965, 0.12, 0.26, 0.022, 0.13, shade("#2f3a5c", -0.1))
    q.cyl(0, 1.04, -0.01, 0.025, 0.015, "#e8c23a", seg=6)                            # button
    q = Q.q("What_toque", "head")
    q.cyl(0, 0.93, -0.02, 0.192, 0.06, shade("#c6463a", -0.12), seg=8, top=False)   # cuff
    q.blob(0, 0.99, -0.02, 0.185, 0.1, 0.18, "#c6463a", seg=8, rings=4, jit=0.03, seed=22, flat_bottom=True)
    q.blob(0, 1.11, -0.02, 0.05, 0.05, 0.05, "#efe6d6", seg=6, rings=3, jit=0.25, seed=23)   # pompom
    q = Q.q("What_bucket", "head")
    q.cyl(0, 0.92, -0.01, 0.27, 0.06, "#c9b894", seg=10, r_top=0.19, top=False, bottom=True)   # sloped brim
    q.cyl(0, 0.98, -0.01, 0.185, 0.1, "#c9b894", seg=9, r_top=0.165, top_col=shade("#c9b894", 0.06))
    q.cyl(0, 0.98, -0.01, 0.188, 0.025, "#6e5038", seg=9, top=False)                 # band

    # ── Shoes ──
    def shoe(nm, side, c, sole="#efe6d6", h=0.1, lace=None, cuff=None):
        x = (0.09 if side == "L" else -0.09)
        q = Q.q(nm, "shin_" + side)
        q.box(x - 0.066, 0.025, -0.07, 0.132, h - 0.025, 0.21, c, top=shade(c, 0.08))
        q.box(x - 0.07, 0, -0.075, 0.14, 0.03, 0.22, sole)
        if lace:
            q.box(x - 0.03, h - 0.005, 0.03, 0.06, 0.01, 0.07, lace)
        if cuff:
            q.cyl(x, h - 0.02, 0, 0.074, cuff, c, seg=6)
    for side in ("L", "R"):
        shoe("Wshoes_basic", side, "#2f3a5c", lace="#efe6d6")
        shoe("Wshoes_hightops", side, "#c0392b", lace="#efe6d6", cuff=0.09)
        shoe("Wshoes_boots", side, "#7a5236", sole="#3b2f28", lace="#c9a65e", cuff=0.07)
        shoe("Wshoes_runners", side, "#2e9a9a", sole="#f2a93b", lace="#efe6d6")

    # ── Extras ──
    q = Q.q("Wextra_backpack", "chest")
    q.box(-0.14, 0.42, -0.2 * W - 0.12, 0.28, 0.28, 0.12, "#e8a33a", top=shade("#e8a33a", 0.08))
    q.box(-0.1, 0.44, -0.2 * W - 0.15, 0.2, 0.12, 0.04, shade("#e8a33a", -0.12))     # front pocket
    for sx in (-1, 1):                                                               # straps over the shoulders
        q.box(sx * 0.1 - 0.025, 0.66, -0.17, 0.05, 0.05, 0.3, "#3b2f28")
        q.box(sx * 0.1 - 0.025, 0.48, 0.18 * W, 0.05, 0.2, 0.025, "#3b2f28")
    q = Q.q("Wextra_headphones", "head")
    for sx in (-1, 1):
        q.cyl(sx * 0.19, 0.83, -0.01, 0.055, 0.1, "#2b2622", seg=7)
        q.cyl(sx * 0.19, 0.835, -0.01, 0.045, 0.09, "#e2574c", seg=7, top=False)
    for i in range(13):                                                              # the band over the top, hugging the hair
        a = math.pi * i / 12
        q.cbox(0.195 * math.cos(a), 0.86 + 0.22 * math.sin(a), -0.02, 0.04, 0.03, 0.045, "#2b2622")
    q = Q.q("Wextra_sunglasses", "head")
    for sx in (-1, 1):
        q.box(sx * 0.062 - 0.045, 0.84, 0.168, 0.09, 0.06, 0.015, "#1d1f24")
    q.box(-0.03, 0.87, 0.17, 0.06, 0.014, 0.012, "#1d1f24")

    # ── Work outfits (Payday's jobs) ──
    WH = "#ffffff"
    q = Q.q("Work_apron", "chest")
    q.box(-0.11, 0.48, 0.19 * W, 0.22, 0.2, 0.02, WH)
    for sx in (-1, 1):
        q.box(sx * 0.08 - 0.01, 0.66, 0.0, 0.02, 0.04, 0.2, shade(WH, -0.2))
    q = Q.q("Work_apron", "hips")
    q.box(-0.15, 0.2, 0.2 * W, 0.3, 0.26, 0.02, WH)
    for nm, c in (("Work_vest", WH), ("Work_hivis", "#e8d23a")):
        q = Q.q(nm, "chest")
        for sx in (-1, 1):
            q.box(sx * 0.1 - 0.06, 0.42, 0.2 * W - 0.02, 0.12, 0.28, 0.04, c)
        q.box(-0.19 * W, 0.42, -0.21 * W, 0.38 * W, 0.28, 0.03, c)
        if nm == "Work_hivis":
            q.box(-0.21 * W, 0.5, 0.21 * W, 0.42 * W, 0.035, 0.012, "#d9dde0")
            q.box(-0.21 * W, 0.5, -0.215 * W - 0.012, 0.42 * W, 0.035, 0.012, "#d9dde0")
    torso(Q, "Work_suit", "#33363d", W, r_lo=0.205, r_hi=0.21, hem=0.36, long=True, cuff="#efe6d6")
    q = Q.q("Work_suit", "chest")
    q.prism([(-0.06, 0.68), (0.06, 0.68), (0.0, 0.5)], 0.2 * W, 0.215 * W, "#efe6d6")  # shirt front
    q.box(-0.018, 0.46, 0.216 * W, 0.036, 0.2, 0.012, "#8a63c8")                     # tie
    q = Q.q("Work_cap", "head")
    q.cyl(0, 0.96, -0.01, 0.19, 0.08, WH, seg=8, r_top=0.165)
    q.box(-0.13, 0.965, 0.12, 0.26, 0.022, 0.13, shade(WH, -0.15))
    q = Q.q("Work_hardhat", "head")
    q.cyl(0, 0.96, -0.01, 0.2, 0.12, "#e8c23a", seg=9, r_top=0.15)
    q.cyl(0, 0.955, -0.01, 0.25, 0.022, shade("#e8c23a", -0.08), seg=10)

    Q.done()
    RP.human_clips(rig)
    return rig


def bear_base(Q, s, W):
    """The teddy's body (Base) and ears (Locks_full on top of the head, Locks_hat out to the sides under a hat)."""
    fur, cream, dark, jeans = s["skin"], s["cream"], "#3b2a20", s["jeans"]
    for side, sx in (("L", 1), ("R", -1)):
        x = sx * 0.095
        q = Q.q("Base", "thigh_" + side)
        q.cyl(x, 0.2, 0, 0.088, 0.25, jeans, seg=7, r_top=0.093)
        q = Q.q("Base", "shin_" + side)
        q.cyl(x, 0.06, 0, 0.08, 0.16, jeans, seg=7, r_top=0.086)
        q.cyl(x, 0.06, 0, 0.084, 0.03, shade(jeans, -0.12), seg=7, top=False)                     # rolled hem
        q.cyl(x, 0.03, 0, 0.074, 0.04, fur, seg=7)                                                 # furry ankle
        q.blob(x, 0.04, 0.02, 0.085, 0.05, 0.11, fur, seg=7, rings=3, jit=0.03, seed=31)            # foot
        q.box(x - 0.045, 0.02, 0.115, 0.09, 0.05, 0.02, cream)                                     # sole pad
        xa = sx * 0.24 * W
        q = Q.q("Base", "arm_" + side)
        q.cyl(xa, 0.46, 0, 0.055, 0.24, fur, seg=7, r_top=0.06)
        q = Q.q("Base", "fore_" + side)
        q.cyl(xa, 0.31, 0, 0.052, 0.17, fur, seg=7, top=False)
        q.blob(xa, 0.28, 0.005, 0.062, 0.065, 0.062, fur, seg=7, rings=3, jit=0.04, seed=33)        # paw
        q.blob(xa, 0.27, 0.05, 0.035, 0.035, 0.02, cream, seg=6, rings=3, jit=0.0, seed=34)         # paw pad
    q = Q.q("Base", "hips")
    q.blob(0, 0.37, 0, 0.19 * W, 0.13, 0.17, jeans, seg=8, rings=4, jit=0.02, seed=35)
    q.cyl(0, 0.455, 0, 0.18 * W, 0.03, "#3b2f28", seg=8, top=False)                                # belt
    q.blob(0, 0.39, -0.16, 0.05, 0.05, 0.05, fur, seg=6, rings=3, jit=0.1, seed=36)               # stubby tail
    q = Q.q("Base", "chest")
    q.cyl(0, 0.45, 0, 0.17 * W, 0.27, fur, seg=8, top=False, r_top=0.15)                           # round tummy (under tops)
    q.blob(0, 0.53, 0.09, 0.12, 0.14, 0.09, cream, seg=7, rings=4, jit=0.0, seed=37)               # belly
    q = Q.q("Base", "head")
    q.cyl(0, 0.69, 0, 0.075, 0.1, fur, seg=7)
    q.blob(0, 0.88, 0, 0.175, 0.17, 0.165, fur, seg=9, rings=5, jit=0.02, seed=38)                  # head
    q.blob(0, 0.82, 0.13, 0.085, 0.065, 0.07, cream, seg=8, rings=4, jit=0.0, seed=39)             # muzzle
    q.blob(0, 0.85, 0.195, 0.035, 0.025, 0.02, dark, seg=6, rings=3, jit=0.0, seed=40)             # nose
    q.box(-0.004, 0.79, 0.192, 0.008, 0.045, 0.01, dark)                                           # stitch under the nose
    for sx in (-1, 1):
        q.box(sx * 0.018 - 0.02, 0.785, 0.19, 0.04, 0.008, 0.01, dark)                             # smile
        q.blob(sx * 0.07, 0.9, 0.15, 0.028, 0.028, 0.015, INK, seg=6, rings=3, jit=0.0, seed=41)   # button eyes
        q.box(sx * 0.07 - 0.002, 0.912, 0.163, 0.01, 0.01, 0.006, "#ffffff")                       # glint
    for nm, hat in (("Locks_full", False), ("Locks_hat", True)):
        q = Q.q(nm, "head")
        for sx in (-1, 1):
            if hat:   # ears out to the sides, below the brim
                x, y, z = sx * 0.2, 0.92, -0.02
            else:     # round ears on top
                x, y, z = sx * 0.13, 1.02, -0.01
            q.blob(x, y, z, 0.065, 0.065, 0.035, fur, seg=7, rings=4, jit=0.0, seed=42)
            q.blob(x, y, z + 0.022, 0.038, 0.038, 0.02, cream, seg=6, rings=3, jit=0.0, seed=43)


def main():
    import bpy
    a = args()
    out = a.get("out", OUT)
    only = set(a["only"].split(",")) if "only" in a else None
    mpath = os.path.join(out, "pack.json")
    manifest = {"pack": "people", "units": "1 = 1 map tile; stands on y = 0 at the origin, faces +z; place at scale 1",
                "wear": {"top": TOPS, "hat": HATS, "shoes": SHOES, "extra": EXTRAS, "work": WORK}, "models": {}}
    if only and os.path.exists(mpath):
        manifest = json.load(open(mpath))
    for name, s in STUDENTS.items():
        if only and name not in only:
            continue
        clear()
        rig = student(name, s)
        bpy.context.view_layer.update()
        meshes = [ob for ob in bpy.data.objects if ob.type == "MESH" and len(ob.data.vertices)]
        pts = [ob.matrix_world @ v.co for ob in meshes for v in ob.data.vertices if ob.name in ("Base", "Locks_full")]
        tris = sum(sum(len(pl.vertices) - 2 for pl in ob.data.polygons) for ob in meshes)
        anims = [t.name for t in rig.ob.animation_data.nla_tracks]
        export(os.path.join(out, name + ".glb"))
        manifest["models"][name] = {"kind": "person", "h": round(max(p.z for p in pts), 2), "tris": tris, "anims": anims,
                                    "slots": sorted(ob.name for ob in meshes), "note": s["note"]}
        print("built %-10s h=%.2f tris=%d meshes=%d %s" % (name, manifest["models"][name]["h"], tris, len(meshes), ",".join(anims)))
    with open(mpath, "w") as f:
        json.dump(manifest, f, indent=1)


if __name__ == "__main__":
    main()
