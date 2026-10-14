#!/usr/bin/env python3
"""
Generates videos/character/character.sifz: a minimal placeholder
explainer-video character (circle head, two eyes, a rigged mouth_switch
layer with 9 Rhubarb-compatible mouth shapes).

This is a starting point, not a finished design - open the output in
Synfig Studio to replace the circle/ellipse shapes with real artwork.
The mouth_switch rigging (desc="mouth_switch", param "layer_name", child
layers named A-H/X) is what scripts/make_explainer_video.py depends on,
so keep that structure if you redesign the art by hand instead of editing
the generators below.

Run from the project root: python3 scripts/build_character_rig.py
"""

import gzip
from pathlib import Path

K = 0.5522847498  # bezier circle/ellipse approximation constant

def ellipse_bline(cx, cy, rx, ry):
    """Return 4 bline_point entries approximating an ellipse."""
    pts = [
        (cx + rx, cy, 0, ry * K),      # right
        (cx, cy + ry, rx * K, 0),      # top
        (cx - rx, cy, 0, ry * K),      # left
        (cx, cy - ry, rx * K, 0),      # bottom
    ]
    entries = []
    for (x, y, tx, ty) in pts:
        entries.append(f"""
          <entry>
            <composite type="bline_point">
              <point><vector><x>{x:.6f}</x><y>{y:.6f}</y></vector></point>
              <width><real value="1.0"/></width>
              <origin><real value="0.5"/></origin>
              <split><bool value="false"/></split>
              <split_radius><bool value="false"/></split_radius>
              <split_angle><bool value="false"/></split_angle>
              <t1><vector><x>{tx:.6f}</x><y>{ty:.6f}</y></vector></t1>
              <t2><vector><x>{tx:.6f}</x><y>{ty:.6f}</y></vector></t2>
            </composite>
          </entry>""")
    return "".join(entries)


def region_layer(desc, cx, cy, rx, ry, r, g, b, a=1.0):
    bline = ellipse_bline(cx, cy, rx, ry)
    return f"""
    <layer type="region" active="true" exclude_from_rendering="false" version="0.1" desc="{desc}">
      <param name="z_depth"><real value="0.0"/></param>
      <param name="amount"><real value="1.0"/></param>
      <param name="blend_method"><integer value="0"/></param>
      <param name="color"><color><r>{r}</r><g>{g}</g><b>{b}</b><a>{a}</a></color></param>
      <param name="origin"><vector><x>0.0</x><y>0.0</y></vector></param>
      <param name="invert"><bool value="false"/></param>
      <param name="feather"><real value="0.0"/></param>
      <param name="blurtype"><integer value="1"/></param>
      <param name="winding_style"><integer value="0"/></param>
      <param name="bline">
        <bline type="bline_point" loop="true">{bline}
        </bline>
      </param>
    </layer>"""


def circle_layer(desc, cx, cy, radius, r, g, b, a=1.0):
    return f"""
    <layer type="circle" active="true" exclude_from_rendering="false" version="0.1" desc="{desc}">
      <param name="z_depth"><real value="0.0"/></param>
      <param name="amount"><real value="1.0"/></param>
      <param name="blend_method"><integer value="0"/></param>
      <param name="color"><color><r>{r}</r><g>{g}</g><b>{b}</b><a>{a}</a></color></param>
      <param name="origin"><vector><x>{cx}</x><y>{cy}</y></vector></param>
      <param name="radius"><real value="{radius}"/></param>
      <param name="feather"><real value="0.0"/></param>
      <param name="invert"><bool value="false"/></param>
      <param name="falloff"><integer value="0"/></param>
    </layer>"""


# mouth shapes: code -> (rx, ry) of the mouth opening ellipse
MOUTH_SHAPES = {
    "A": (0.16, 0.03),   # closed
    "B": (0.17, 0.06),   # slightly open
    "C": (0.18, 0.11),   # open
    "D": (0.16, 0.18),   # wide open
    "E": (0.14, 0.09),   # rounded mid-open
    "F": (0.10, 0.07),   # puckered
    "G": (0.17, 0.05),   # teeth on lip
    "H": (0.19, 0.10),   # wide, tongue visible
    "X": (0.15, 0.02),   # idle/rest
}

mouth_children = "".join(
    region_layer(code, 0.0, -0.45, rx, ry, 0.45, 0.12, 0.12)
    for code, (rx, ry) in MOUTH_SHAPES.items()
)

mouth_switch = f"""
    <layer type="switch" active="true" exclude_from_rendering="false" version="0.0" desc="mouth_switch">
      <param name="z_depth"><real value="0.0"/></param>
      <param name="amount"><real value="1.0"/></param>
      <param name="blend_method"><integer value="0"/></param>
      <param name="origin"><vector><x>0.0</x><y>0.0</y></vector></param>
      <param name="layer_name"><string>X</string></param>
      <param name="layer_depth"><integer value="0"/></param>
      <param name="canvas">
        <canvas>{mouth_children}
        </canvas>
      </param>
    </layer>"""

left_eye = circle_layer("left_eye", -0.4, 0.2, 0.12, 0.05, 0.05, 0.05)
right_eye = circle_layer("right_eye", 0.4, 0.2, 0.12, 0.05, 0.05, 0.05)
head = circle_layer("head", 0.0, 0.0, 1.0, 1.0, 0.8, 0.3)

sif = f"""<?xml version="1.0" encoding="UTF-8"?>
<canvas version="1.2" width="480" height="480" xres="2834.645752" yres="2834.645752" view-box="-2.000000 2.000000 2.000000 -2.000000" antialias="1" fps="30.0000000000" begin-time="0s" end-time="1s" bgcolor="0.0 0.0 0.0 0.0">
  <name>character</name>
  <desc>Minimal placeholder explainer-video character with a rigged mouth_switch.</desc>
  {head}
  {mouth_switch}
  {left_eye}
  {right_eye}
</canvas>
"""

out_path = Path(__file__).resolve().parent.parent / "videos" / "character" / "character.sifz"
out_path.parent.mkdir(parents=True, exist_ok=True)
with gzip.open(out_path, "wb") as f:
    f.write(sif.encode("utf-8"))
print(f"wrote {out_path}")
