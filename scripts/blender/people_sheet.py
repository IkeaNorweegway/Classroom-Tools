# Pictures of the people pack: for each model, idle, two walk frames and the middle of every other clip,
# from the game's angle (south-east, above). One PNG per pose; join them with montage.
#   flatpak run org.blender.Blender -b --python scripts/blender/people_sheet.py -- dir=/abs/out [only=a,b] [side=1]
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, mathutils
import kit, realm_people

a = kit.args()
out = a["dir"]
os.makedirs(out, exist_ok=True)
only = set(a["only"].split(",")) if "only" in a else None
sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "VERTEX"
sc.render.resolution_x, sc.render.resolution_y = 240, 300
view = mathutils.Vector((1.0, -0.15, 0.35) if "side" in a else (0.45, -1.0, 0.7)).normalized()
for i, (name, m) in enumerate(realm_people.MODELS.items()):
    if only and name not in only:
        continue
    kit.clear()
    m["fn"]()
    rig = next(ob for ob in bpy.data.objects if ob.type == "ARMATURE")
    tracks = [t.name for t in rig.animation_data.nla_tracks]
    shots = [("idle", 1), ("walk", 1), ("walk", 7)] + [(t, 7 if t in ("cheer", "peck") else 10 if t == "cast" else 9) for t in tracks if t not in ("idle", "walk")]
    bpy.context.view_layer.update()
    pts = [ob.matrix_world @ v.co for ob in bpy.data.objects if ob.type == "MESH" for v in ob.data.vertices]
    hi = max(p.z for p in pts)
    c = mathutils.Vector((0, 0, hi * 0.5))
    cam_d = bpy.data.cameras.new("c"); cam_d.lens = 50
    cam = bpy.data.objects.new("cam", cam_d); sc.collection.objects.link(cam)
    cam.location = c + view * (max(hi, 0.6) * 2.9)
    cam.rotation_euler = (-view).to_track_quat("-Z", "Y").to_euler()
    sc.camera = cam
    for j, (clip, f) in enumerate(shots):
        for tr in rig.animation_data.nla_tracks:
            tr.mute = tr.name != clip
        sc.frame_set(f)
        sc.render.filepath = os.path.join(out, "%02d_%s_%d_%s%d.png" % (i, name, j, clip, f))
        bpy.ops.render.render(write_still=True)
