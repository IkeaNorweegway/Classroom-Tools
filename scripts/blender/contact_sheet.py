# One framed thumbnail per model (3/4 view from the south-east, like the game camera), for checking a pack by eye.
#   flatpak run org.blender.Blender -b --python scripts/blender/contact_sheet.py -- dir=/abs/out [only=a,b]
# Then join them:  montage dir/*.png -tile 8x -geometry +4+4 sheet.png
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, mathutils
import kit, realm_pack

a = kit.args()
out = a["dir"]
os.makedirs(out, exist_ok=True)
only = set(a["only"].split(",")) if "only" in a else None
sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "VERTEX"
sc.render.resolution_x, sc.render.resolution_y = 420, 320
sc.render.film_transparent = False
sc.world = sc.world or bpy.data.worlds.new("w")
for i, (name, m) in enumerate(realm_pack.MODELS.items()):
    if only and name not in only:
        continue
    kit.clear()
    m["fn"]()
    bpy.context.view_layer.update()
    pts = [ob.matrix_world @ v.co for ob in bpy.data.objects if ob.type == "MESH" for v in ob.data.vertices]
    lo = mathutils.Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = mathutils.Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    c = (lo + hi) / 2
    r = (hi - lo).length / 2
    cam_d = bpy.data.cameras.new("c"); cam_d.lens = 35
    cam = bpy.data.objects.new("cam", cam_d); sc.collection.objects.link(cam)
    d = mathutils.Vector((0.55, -1.0, 0.75)).normalized()   # from the south-east, above
    cam.location = c + d * (r * 2.6 + 0.5)
    cam.rotation_euler = (-d).to_track_quat("-Z", "Y").to_euler()
    sc.camera = cam
    sc.render.filepath = os.path.join(out, "%02d_%s.png" % (i, name))
    bpy.ops.render.render(write_still=True)
