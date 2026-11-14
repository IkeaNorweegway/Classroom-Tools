# Pictures of the voxel people pack: for each model a front view, a back view, the game's angle, and the same angle
# mid-walk and mid-way through one other clip. One PNG per model (five tiles side by side) plus all.png.
#   flatpak run org.blender.Blender -b --python scripts/blender/voxel_sheet.py -- dir=/abs/out [only=a,b]
# The chosen heroes (hero_f, hero_m) are shown in a few outfits: name@top/hat/hair.
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, mathutils
import kit, realm_voxel_people as M

a = kit.args()
out = a["dir"]
os.makedirs(out, exist_ok=True)
only = set(a["only"].split(",")) if "only" in a else None
sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "VERTEX"
sc.render.film_transparent = False
sc.world = sc.world or bpy.data.worlds.new("w")
sc.world.color = (0.62, 0.66, 0.62)
TW, TH = 230, 330
sc.render.resolution_x, sc.render.resolution_y = TW, TH
sc.render.image_settings.file_format = "PNG"

LOOKS = {"hero": [("short", None, None), ("braids", None, None)],
         "hero_f": [("long", "farm", ""), ("bun", "novice", "novice"), ("curly", "adept", "greystone"), ("braids", "warden", "warden")],
         "hero_m": [("short", "farm", ""), ("curly", "novice", "emberdale"), ("shaved", "novice", "riverholm"), ("long", "adept", "bonelands")]}
TINT = {"Skin": (0.78, 0.55, 0.37), "Hair": (0.25, 0.16, 0.1), "Top": (0.6, 0.3, 0.28), "Legs": (0.35, 0.33, 0.4),
        "Boots": (0.35, 0.26, 0.2), "Cloak": (0.24, 0.31, 0.48)}


def dress(look):
    hair, top, hat = look
    for ob in bpy.data.objects:
        if ob.type != "MESH":
            continue
        head, _, rest = ob.name.partition("_")
        show = True
        if head == "Hair":
            show = rest == hair
        elif head == "Wtop":
            show = rest == top
        elif head == "What":
            show = rest == hat
        elif ob.name == "Glasses":
            show = hair in ("bun", "shaved")
        ob.hide_render = not show
        if head in TINT:                      # stand in for the game's tint: multiply the white by a colour
            ca = ob.data.color_attributes["Color"]
            for d in ca.data:
                c = d.color
                d.color = (c[0] * TINT[head][0], c[1] * TINT[head][1], c[2] * TINT[head][2], 1.0)


def shoot(rig, view, clip, frame, path, hi, ortho):
    for tr in rig.animation_data.nla_tracks:
        tr.mute = tr.name != clip
    sc.frame_set(frame)
    cam = sc.camera
    v = mathutils.Vector(view).normalized()
    c = mathutils.Vector((0, 0, hi * 0.5))
    cam.data.type = "ORTHO" if ortho else "PERSP"
    cam.data.ortho_scale = max(hi, 0.7) * 1.25
    cam.location = c + v * (max(hi, 0.7) * 2.6 if not ortho else 6)
    cam.rotation_euler = (-v).to_track_quat("-Z", "Y").to_euler()
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)


rows = []
for name, m in M.MODELS.items():
    if only and name not in only:
        continue
    for li, look in enumerate(LOOKS.get(name, [None])):
        kit.clear()
        rig = m["fn"]().ob
        if look:
            dress(look)
        bpy.context.view_layer.update()
        pts = [ob.matrix_world @ v.co for ob in bpy.data.objects if ob.type == "MESH" and not ob.hide_render for v in ob.data.vertices]
        hi = max(p.z for p in pts)
        cd = bpy.data.cameras.new("c")
        cd.lens = 50
        cam = bpy.data.objects.new("cam", cd)
        sc.collection.objects.link(cam)
        sc.camera = cam
        tracks = [t.name for t in rig.animation_data.nla_tracks]
        other = [t for t in tracks if t not in ("idle", "walk")]
        pick = other[(len(rows)) % len(other)]
        game = (0.5, -1.0, 0.75)
        side = m["kind"] == "animal"
        shots = [((1, 0, 0.05) if side else (0, -1, 0.02), "idle", 1, True), ((0, -1, 0.02) if side else (0, 1, 0.02), "idle", 1, True),
                 (game, "idle", 1, False), (game, "walk", 1, False), (game, pick, 7 if pick in ("cheer", "peck") else 10, False)]
        tiles = []
        for j, (view, clip, f, ortho) in enumerate(shots):
            p = os.path.join(out, "_t_%s_%d_%d.png" % (name, li, j))
            shoot(rig, view, clip, f, p, hi, ortho)
            tiles.append(p)
        rows.append((name + ("@%d" % li if look else ""), tiles))

# join the tiles: one strip per model, then every strip in all.png (three strips across)
def load(p):
    im = bpy.data.images.load(p)
    px = list(im.pixels)
    bpy.data.images.remove(im)
    return px

import array
strips = []
for label, tiles in rows:
    W = TW * len(tiles)
    buf = array.array("f", [0.0]) * (W * TH * 4)
    for j, p in enumerate(tiles):
        px = load(p)
        for y in range(TH):
            buf[(y * W + j * TW) * 4:(y * W + (j + 1) * TW) * 4] = array.array("f", px[y * TW * 4:(y + 1) * TW * 4])
        os.remove(p)
    im = bpy.data.images.new(label, W, TH)
    im.pixels = buf
    im.filepath_raw = os.path.join(out, label.replace("@", "_") + ".png")
    im.file_format = "PNG"
    im.save()
    strips.append(im.filepath_raw)
    bpy.data.images.remove(im)
print("sheets:", len(strips), "in", out)
