# Low-poly kit for Blender asset packs (CEFL Town v2 look: flat-shaded, one colour per face, no textures).
#
# Coordinates are Godot's, so models drop straight into the engine: x right, y up, z toward the camera (south).
# 1 unit = 1 map tile. A model's footprint runs from x = -W/2..W/2, z = -D/2..D/2, ground at y = 0, door on +z.
#
# Colours go into a face-corner colour attribute ("Color"). In Godot the pack loader swaps every material for the
# town's vertex-colour material (art3d.gd mats()), so lighting matches the code-drawn town exactly.
# Name an object "*_glow" for unlit glowing parts (sigils, lit windows); "*_water" for see-through water.
#
#   flatpak run org.blender.Blender -b --python scripts/blender/realm_pack.py -- [only=name,name]
import bpy, bmesh, math, random, os, sys, json
from mathutils import Vector, Matrix

# Town colours (art3d.gd C) plus the Emberdale set.
PAL = {
    "grass": "#8ba56b", "grass_dk": "#7a965f", "lawn": "#7fa95e", "hedge": "#5f8355",
    "leaf": "#6f9a5c", "leaf2": "#88a865", "leaf_au": "#c99a5e", "leaf_dk": "#557a4e",
    "trunk": "#6b5040", "wood": "#a07650", "wood_dk": "#6e5038", "wood_lt": "#c09a6e",
    "metal": "#3b4044", "metal_lt": "#8c9298", "water": "#79aab3", "water_hi": "#9cc3c6",
    "stone": "#cfc6b5", "path": "#d9c7a3", "sand": "#e2d2ac", "soil": "#7a5a44",
    "glass": "#5d7891", "frame": "#f1e8d8",
    # Emberdale
    "fieldstone": "#b9ad9a", "fieldstone_dk": "#9a8e7c", "mortar": "#ddd3c2", "slate": "#5e6670", "slate_dk": "#4b525b",
    "thatch": "#c9a65e", "thatch_dk": "#a9884a", "plaster": "#e9dfcb", "timber": "#5a4232",
    "stubble": "#d8b45a", "stubble_dk": "#b8933e", "canola": "#e8c838", "wheat": "#d9b866",
    "rock_red": "#a35f45", "rock_tan": "#c98d62", "rock_dk": "#7c4a3a", "rock_pale": "#d8b08a",
    "river": "#5f93a0", "foam": "#e6f0f0", "rune_grey": "#dfe2e6", "gold": "#f2c84b", "gold_dk": "#c99a2e",
    "barn_red": "#9c4436", "barn_trim": "#efe6d6", "door_green": "#4f6b4a", "door_blue": "#4a5f78",
    "wool": "#ece6da", "wool_dk": "#cfc7b8", "sheep_face": "#3a3330", "hay": "#e0c06a", "sack": "#cdb894",
    "rope": "#b49a6a", "iron": "#4a4440", "ember": "#e8823a",
}


def rgb(c):
    """Hex or palette name -> sRGB RGBA. The bmesh colour layer is a byte layer that holds sRGB; the glTF exporter
    writes it out linear, so the Godot loader (pack.gd) reads it with vertex_color_is_srgb = false."""
    c = PAL.get(c, c)
    h = c.lstrip("#")
    s = [int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
    return (s[0], s[1], s[2], 1.0)


def shade(c, k):
    """Darken (k < 0) or lighten (k > 0) a hex colour, for faces that want a slight change."""
    c = PAL.get(c, c).lstrip("#")
    s = [int(c[i:i + 2], 16) for i in (0, 2, 4)]
    s = [int(x + (255 - x) * k) if k > 0 else int(x * (1 + k)) for x in s]
    return "#%02x%02x%02x" % tuple(max(0, min(255, x)) for x in s)


def G(x, y, z):
    """Godot (x, y up, z south) -> Blender (x, y north, z up). The glTF exporter turns it back."""
    return Vector((x, -z, y))


class Part:
    """One mesh object. Every face gets its own vertices, so shading is flat and colours never blend."""

    def __init__(self, name, origin=(0, 0, 0)):
        self.name = name
        self.origin = Vector(origin)       # Godot coords; the object's pivot (a wheel's hub, a door's hinge)
        self.bm = bmesh.new()
        self.col = self.bm.loops.layers.color.new("Color")
        self.xf = Matrix.Identity(4)       # Godot-space transform applied to every point (turn a piece, then draw)
        self.rng = random.Random(name)
        self.dl = None                     # deform layer: every new vertex is bound 100% to the current bone
        self.groups = []
        self.cur = -1

    def bone(self, name):
        """Bind the faces drawn from now on to this bone of a Rig (rigid skinning: one bone per vertex)."""
        if self.dl is None:
            self.dl = self.bm.verts.layers.deform.verify()
        if name not in self.groups:
            self.groups.append(name)
        self.cur = self.groups.index(name)
        return self

    # ── transforms ──
    def at(self, x=0, y=0, z=0, yaw=0.0):
        """Set the drawing transform: move to (x, y, z), turn yaw degrees about y (counter-clockwise from above)."""
        self.xf = Matrix.Translation(Vector((x, y, z))) @ Matrix.Rotation(math.radians(yaw), 4, "Y")
        return self

    def reset(self):
        self.xf = Matrix.Identity(4)
        return self

    def _p(self, v):
        w = self.xf @ Vector(v)
        return G(*(w - self.origin))

    # ── faces ──
    def face(self, pts, c, ctr=None, out=None):
        """A flat face. Give ctr (a point inside the shape) or out (a direction) and it is turned to face outward."""
        if ctr is not None or out is not None:
            w = [self.xf @ Vector(p) for p in pts]
            n = (w[1] - w[0]).cross(w[2] - w[0])
            if n.length < 1e-9 and len(w) > 3:
                n = (w[2] - w[0]).cross(w[3] - w[0])
            if out is not None:
                d = self.xf.to_3x3() @ Vector(out)
            else:
                d = sum(w, Vector()) / len(w) - self.xf @ Vector(ctr)
            if n.dot(d) < 0:
                pts = list(reversed(pts))
        vs = [self.bm.verts.new(self._p(p)) for p in pts]
        if self.cur >= 0:
            for v in vs:
                v[self.dl][self.cur] = 1.0
        try:
            f = self.bm.faces.new(vs)
        except ValueError:
            return
        col = rgb(c)
        for l in f.loops:
            l[self.col] = col
        return f

    def tri(self, a, b, c, col, ctr=None, out=None):
        self.face([a, b, c], col, ctr, out)

    def quad(self, a, b, c, d, col, ctr=None, out=None):
        self.face([a, b, c, d], col, ctr, out)

    # ── shapes (points listed counter-clockwise seen from outside) ──
    def box(self, x0, y0, z0, sx, sy, sz, c, top=None, bottom=False, sides=None):
        x1, y1, z1 = x0 + sx, y0 + sy, z0 + sz
        t = top or c
        s = sides or c
        k = ((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)
        self.quad((x0, y1, z1), (x1, y1, z1), (x1, y1, z0), (x0, y1, z0), t, k)            # top
        self.quad((x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1), c, k)            # south (front)
        self.quad((x1, y0, z0), (x0, y0, z0), (x0, y1, z0), (x1, y1, z0), c, k)            # north
        self.quad((x1, y0, z1), (x1, y0, z0), (x1, y1, z0), (x1, y1, z1), s, k)            # east
        self.quad((x0, y0, z0), (x0, y0, z1), (x0, y1, z1), (x0, y1, z0), s, k)            # west
        if bottom:
            self.quad((x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1), shade(c, -0.3), k)

    def cbox(self, cx, y0, cz, sx, sy, sz, c, **kw):
        """A box centred on (cx, cz) in plan."""
        self.box(cx - sx / 2, y0, cz - sz / 2, sx, sy, sz, c, **kw)

    def cyl(self, cx, y0, cz, r, h, c, seg=6, r_top=None, top=True, bottom=False, top_col=None, rot=0.0):
        rt = r if r_top is None else r_top
        a0 = math.radians(rot)
        ring = lambda rr, y: [(cx + rr * math.cos(a0 + 2 * math.pi * i / seg), y, cz - rr * math.sin(a0 + 2 * math.pi * i / seg)) for i in range(seg)]
        lo, hi = ring(r, y0), ring(rt, y0 + h)
        k = (cx, y0 + h / 2, cz)
        for i in range(seg):
            j = (i + 1) % seg
            if rt > 0:
                self.quad(lo[i], lo[j], hi[j], hi[i], c, k)
            else:
                self.tri(lo[i], lo[j], (cx, y0 + h, cz), c, k)
        if top and rt > 0:
            self.face(hi, top_col or c, out=(0, 1, 0))
        if bottom:
            self.face(lo, shade(c, -0.3), out=(0, -1, 0))

    def cone(self, cx, y0, cz, r, h, c, seg=6, rot=0.0):
        a0 = math.radians(rot)
        lo = [(cx + r * math.cos(a0 + 2 * math.pi * i / seg), y0, cz - r * math.sin(a0 + 2 * math.pi * i / seg)) for i in range(seg)]
        tip = (cx, y0 + h, cz)
        k = (cx, y0 + h / 3, cz)
        for i in range(seg):
            self.tri(lo[i], lo[(i + 1) % seg], tip, c, k)

    def blob(self, cx, cy, cz, rx, ry, rz, c, seg=7, rings=4, jit=0.15, seed=0, flat_bottom=False):
        """A lumpy low-poly ball (tree crowns, rocks, wool)."""
        rng = random.Random(seed)
        pts = []
        for i in range(rings + 1):
            v = math.pi * i / rings
            row = []
            for k in range(seg):
                u = 2 * math.pi * k / seg + (0.5 if i % 2 else 0) * 2 * math.pi / seg
                j = 1 + rng.uniform(-jit, jit) if 0 < i < rings else 1
                y = math.cos(v)
                if flat_bottom and y < -0.35:
                    y = -0.35
                row.append((cx + rx * math.sin(v) * math.cos(u) * j, cy + ry * y * j, cz - rz * math.sin(v) * math.sin(u) * j))
            pts.append(row)
        ctr = (cx, cy - (ry * 0.2 if flat_bottom else 0), cz)
        for i in range(rings):
            for k in range(seg):
                k2 = (k + 1) % seg
                a, b, cc, d = pts[i][k], pts[i][k2], pts[i + 1][k2], pts[i + 1][k]
                if i == 0:
                    self.tri(a, cc, d, c, ctr)
                elif i == rings - 1:
                    self.tri(a, b, d, c, ctr)
                else:   # split bumpy quads into two triangles so they stay flat
                    self.tri(a, b, cc, c, ctr)
                    self.tri(a, cc, d, c, ctr)

    def prism(self, prof, z0, z1, c, cap=None):
        """Push a convex x/y profile (counter-clockwise seen from +z) from z0 to z1. Roofs, wedges, steps."""
        n = len(prof)
        k = (sum(p[0] for p in prof) / n, sum(p[1] for p in prof) / n, (z0 + z1) / 2)
        self.face([(x, y, z1) for x, y in prof], cap or c, k)
        self.face([(x, y, z0) for x, y in prof], cap or c, k)
        for i in range(n):
            (xa, ya), (xb, yb) = prof[i], prof[(i + 1) % n]
            self.quad((xa, ya, z1), (xa, ya, z0), (xb, yb, z0), (xb, yb, z1), c, k)

    def gable(self, W, D, y, h, c, over=0.25, ridge_z=False, gable_col=None, thick=0.08):
        """A pitched roof over a W x D footprint centred on the origin. Ridge runs along x (default) or z."""
        k = (0, y + h * 0.3, 0)
        if not ridge_z:
            x0, x1 = -W / 2 - over, W / 2 + over
            z0, z1 = -D / 2 - over, D / 2 + over
            # two slopes with a little thickness at the eaves
            self.quad((x0, y, z1), (x1, y, z1), (x1, y + h, 0), (x0, y + h, 0), c, k)
            self.quad((x1, y, z0), (x0, y, z0), (x0, y + h, 0), (x1, y + h, 0), c, k)
            self.quad((x0, y - thick, z1), (x1, y - thick, z1), (x1, y, z1), (x0, y, z1), shade(c, -0.2), k)
            self.quad((x1, y - thick, z0), (x0, y - thick, z0), (x0, y, z0), (x1, y, z0), shade(c, -0.2), k)
            self.quad((x0, y - thick, z0), (x1, y - thick, z0), (x1, y - thick, z1), (x0, y - thick, z1), shade(c, -0.35), k)
            gc = gable_col
            if gc:   # the triangular wall ends
                self.tri((-W / 2, y, D / 2), (-W / 2, y + h * (D / 2) / (D / 2 + over), 0), (-W / 2, y, -D / 2), gc, k)
                self.tri((W / 2, y, -D / 2), (W / 2, y + h * (D / 2) / (D / 2 + over), 0), (W / 2, y, D / 2), gc, k)
            # roof ends
            self.tri((x0, y, z0), (x0, y, z1), (x0, y + h, 0), shade(c, -0.12), k)
            self.tri((x1, y, z1), (x1, y, z0), (x1, y + h, 0), shade(c, -0.12), k)
        else:
            x0, x1 = -W / 2 - over, W / 2 + over
            z0, z1 = -D / 2 - over, D / 2 + over
            self.quad((x1, y, z1), (x1, y, z0), (0, y + h, z0), (0, y + h, z1), c, k)
            self.quad((x0, y, z0), (x0, y, z1), (0, y + h, z1), (0, y + h, z0), c, k)
            self.quad((x0, y - thick, z0), (x1, y - thick, z0), (x1, y - thick, z1), (x0, y - thick, z1), shade(c, -0.35), k)
            self.quad((x1, y - thick, z1), (x1, y - thick, z0), (x1, y, z0), (x1, y, z1), shade(c, -0.2), k)
            self.quad((x0, y - thick, z0), (x0, y - thick, z1), (x0, y, z1), (x0, y, z0), shade(c, -0.2), k)
            if gable_col:
                hh = h * (W / 2) / (W / 2 + over)
                self.tri((-W / 2, y, D / 2), (W / 2, y, D / 2), (0, y + hh, D / 2), gable_col, k)
                self.tri((W / 2, y, -D / 2), (-W / 2, y, -D / 2), (0, y + hh, -D / 2), gable_col, k)
            self.tri((x0, y, z1), (x1, y, z1), (0, y + h, z1), shade(c, -0.12), k)
            self.tri((x1, y, z0), (x0, y, z0), (0, y + h, z0), shade(c, -0.12), k)

    def stone_wall(self, x0, z0, x1, z1, y0, h, c, t=0.35, course=0.32, seed=0):
        """A dry-stone wall from (x0,z0) to (x1,z1): stacked boxes in a few shades, staggered courses."""
        rng = random.Random(seed)
        L = math.hypot(x1 - x0, z1 - z0)
        yaw = -math.degrees(math.atan2(z1 - z0, x1 - x0))
        save = self.xf
        self.xf = save @ Matrix.Translation(Vector((x0, 0, z0))) @ Matrix.Rotation(math.radians(yaw), 4, "Y")
        y = y0
        row = 0
        while y < y0 + h - 0.01:
            ch = min(course, y0 + h - y)
            x = -(0.3 if row % 2 else 0)
            while x < L:
                w = rng.uniform(0.45, 0.8)
                a, b = max(0, x), min(L, x + w)
                if b - a > 0.05:
                    tone = rng.choice([c, shade(c, -0.1), shade(c, 0.08), shade(c, -0.05)])
                    jt = rng.uniform(-0.03, 0.03)
                    self.box(a + 0.015, y, -t / 2 + jt, b - a - 0.03, ch - 0.02, t, tone)
                x += w
            y += course
            row += 1
        self.xf = save

    def done(self, rig=None):
        """Make the object. Give the Rig if the part was drawn with bone(): it is parented and deformed by it."""
        me = bpy.data.meshes.new(self.name)
        self.bm.to_mesh(me)
        self.bm.free()
        for p in me.polygons:
            p.use_smooth = False
        me.color_attributes.active_color = me.color_attributes["Color"]
        ob = bpy.data.objects.new(self.name, me)
        ob.location = G(*self.origin)
        bpy.context.scene.collection.objects.link(ob)
        for g in self.groups:
            ob.vertex_groups.new(name=g)
        if rig is not None:
            ob.parent = rig.ob
            mod = ob.modifiers.new("Armature", "ARMATURE")
            mod.object = rig.ob
        return ob


class Rig:
    """An armature for a character or animal. Bones are (name, parent, head, tail) in Godot coords.

    Poses are written in the world's own axes, not each bone's: a pose maps a bone to (rx, ry, rz), degrees about the
    Godot x, y and z axes through the bone's head (applied x, then y, then z), or to {"r": (…), "t": (x, y, z)} to move
    it too. A child turns with its parent, so a shin's angle adds to its thigh's. Signs, for a model facing +z:
    rx < 0 swings a hanging limb forward (+z); rx > 0 nods an upright head forward and tips a forward-pointing
    snout or body down; rz > 0 swings a hanging limb toward +x.
    """

    def __init__(self, name, bones):
        arm = bpy.data.armatures.new(name)
        ob = bpy.data.objects.new(name, arm)
        bpy.context.scene.collection.objects.link(ob)
        bpy.context.view_layer.objects.active = ob
        ob.select_set(True)
        bpy.ops.object.mode_set(mode="EDIT")
        for n, par, h, t in bones:
            b = arm.edit_bones.new(n)
            b.head, b.tail, b.roll = G(*h), G(*t), 0.0
            if par:
                b.parent = arm.edit_bones[par]
                b.use_connect = False
        bpy.ops.object.mode_set(mode="OBJECT")
        self.ob = ob
        self.names = [b[0] for b in bones]
        for pb in ob.pose.bones:
            pb.rotation_mode = "QUATERNION"
        self.anims = []

    def _basis(self, bone, r, t):
        rx, ry, rz = (math.radians(a) for a in r)
        R = (Matrix.Rotation(rz, 3, G(0, 0, 1)) @ Matrix.Rotation(ry, 3, G(0, 1, 0)) @ Matrix.Rotation(rx, 3, G(1, 0, 0)))
        B = self.ob.data.bones[bone].matrix_local.to_3x3()
        q = (B.inverted() @ R @ B).to_quaternion()
        loc = B.inverted() @ G(*t)
        return q, loc

    def pose(self, p):
        """Set a pose now (for pictures). p: {bone: (rx, ry, rz) or {"r": …, "t": …}}; other bones go to rest."""
        for n in self.names:
            v = p.get(n, (0, 0, 0))
            r, t = (v.get("r", (0, 0, 0)), v.get("t", (0, 0, 0))) if isinstance(v, dict) else (v, (0, 0, 0))
            q, loc = self._basis(n, r, t)
            pb = self.ob.pose.bones[n]
            pb.rotation_quaternion, pb.location = q, loc

    def anim(self, name, keys, fps=24):
        """One looping action: keys is [(frame, pose), …]; every bone is keyed at every frame (unnamed = rest), so a
        clip never keeps a pose left over from another. Give the last frame the first frame's pose for a clean loop."""
        ad = self.ob.animation_data_create()
        act = bpy.data.actions.new(name)
        ad.action = act
        for f, p in keys:
            self.pose(p)
            for n in self.names:
                pb = self.ob.pose.bones[n]
                pb.keyframe_insert("rotation_quaternion", frame=f)
                pb.keyframe_insert("location", frame=f)
        tr = ad.nla_tracks.new()
        tr.name = name
        tr.strips.new(name, int(keys[0][0]), act)
        tr.mute = True
        ad.action = None
        self.anims.append(name)
        self.pose({})
        return act

    def show(self, name, frame):
        """Pose the rig as `name` looks at `frame` (for pictures): unmute that clip only."""
        ad = self.ob.animation_data
        for tr in ad.nla_tracks:
            tr.mute = tr.name != name
        bpy.context.scene.frame_set(int(frame))


def clear():
    for ob in list(bpy.data.objects):
        bpy.data.objects.remove(ob, do_unlink=True)
    for me in list(bpy.data.meshes):
        bpy.data.meshes.remove(me)
    for a in list(bpy.data.actions):
        bpy.data.actions.remove(a)
    for arm in list(bpy.data.armatures):
        bpy.data.armatures.remove(arm)


def export(path, extras=None):
    """Write every object in the scene to one .glb (Godot coords kept, vertex colours on, no materials)."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if extras:
        for ob in bpy.data.objects:
            if ob.parent is None:
                for k, v in extras.items():
                    ob[k] = v
    bpy.ops.export_scene.gltf(
        filepath=path, export_format="GLB", export_yup=True, export_apply=True,
        export_materials="NONE", export_vertex_color="ACTIVE", export_active_vertex_color_when_no_material=True,
        export_normals=True, export_extras=bool(extras), export_animations=True,
    )


def args():
    a = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out = {}
    for s in a:
        k, _, v = s.partition("=")
        out[k] = v or "1"
    return out
