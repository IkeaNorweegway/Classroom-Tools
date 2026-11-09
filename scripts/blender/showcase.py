# Lays out every model of a pack in one Blender scene to look at (not exported), with name labels on the ground,
# vertex colours shown in the viewport, a sun and a camera. Optional: save=/abs/file.blend
#   flatpak run org.blender.Blender --python scripts/blender/showcase.py            (opens a window)
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
import kit, realm_pack
from kit import G

kit.clear()
for c in list(bpy.data.curves):
    bpy.data.curves.remove(c)

ROWS = [("terrain", 3.0), ("building", 0), ("prop", 0)]
z_row = 0.0
for kind, _ in ROWS:
    names = [n for n, m in realm_pack.MODELS.items() if m["kind"] == kind]
    x = 0.0
    row_depth = max(realm_pack.MODELS[n]["d"] for n in names)
    for n in names:
        m = realm_pack.MODELS[n]
        before = set(bpy.data.objects)
        m["fn"]()
        cx = x + m["w"] / 2
        for ob in set(bpy.data.objects) - before:
            ob.location += G(cx, 0, z_row)
        # a label lying on the ground in front
        bpy.ops.object.text_add(location=G(x, 0.02, z_row + m["d"] / 2 + 0.9))
        t = bpy.context.object
        t.data.body = n
        t.data.size = 0.32
        t.name = "label_" + n
        x += m["w"] + (1.0 if kind == "terrain" else 1.5)
    z_row += row_depth + 4.0

# a sun, a camera looking down at the village like the game does, and solid shading with vertex colours
bpy.ops.object.light_add(type="SUN", rotation=(math.radians(50), 0, math.radians(30)))
bpy.context.object.data.energy = 3.0
bpy.ops.object.camera_add(location=(40, -45, 22), rotation=(math.radians(55), 0, 0))
bpy.context.scene.camera = bpy.context.object
for scr in bpy.data.screens:
    for area in scr.areas:
        if area.type == "VIEW_3D":
            for sp in area.spaces:
                if sp.type == "VIEW_3D":
                    sp.shading.type = "SOLID"
                    sp.shading.color_type = "VERTEX"
                    sp.shading.light = "STUDIO"
                    sp.clip_end = 1000
                    r = sp.region_3d
                    r.view_location = (40, -12, 0)
                    r.view_distance = 55
                    r.view_rotation = __import__("mathutils").Euler((math.radians(55), 0, math.radians(0))).to_quaternion()
a = kit.args()
if "save" in a:
    bpy.ops.wm.save_as_mainfile(filepath=a["save"])
print("SHOWCASE READY", len(realm_pack.MODELS), "models")
if "render" in a:   # a picture of the scene (Workbench, vertex colours), optional cam=x,y,z,pitch,yaw (Blender coords)
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_WORKBENCH"
    sc.display.shading.light = "STUDIO"
    sc.display.shading.color_type = "VERTEX"
    sc.display.shading.show_shadows = False
    sc.render.resolution_x, sc.render.resolution_y = 1600, 900
    if "cam" in a:
        x, y, z, p, yw = [float(v) for v in a["cam"].split(",")]
        sc.camera.location = (x, y, z)
        sc.camera.rotation_euler = (math.radians(p), 0, math.radians(yw))
    if "lens" in a:
        sc.camera.data.lens = float(a["lens"])
    sc.render.filepath = a["render"]
    bpy.ops.render.render(write_still=True)
