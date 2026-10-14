#!/usr/bin/env python3
"""
Pipeline: narration audio -> Rhubarb mouth cues -> inject into Synfig
character rig -> render -> composite onto a slides/screen-recording video.

One-time manual prerequisite: videos/character/character.sifz must exist,
with a Switch layer named "mouth_switch" whose children are named with
Rhubarb's shape codes (A B C D E F G H X). See videos/character/README.md.

Usage:
  # Confirm the rig's actual layer/param names before the first real run
  python3 make_explainer_video.py --inspect videos/character/character.sifz

  # Full pipeline
  python3 make_explainer_video.py \
      --character videos/character/character.sifz \
      --narration narration.wav \
      --script script.txt \
      --background slides.mp4 \
      --position bottom-right \
      --scale 0.35 \
      --output videos/output/my-explainer-v1.mp4
"""

import argparse
import gzip
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from xml.etree import ElementTree as ET

MOUTH_SWITCH_DESC = "mouth_switch"
CANDIDATE_PARAM_NAMES = ["layer_name", "active_layer_name", "Active Layer Name"]

POSITIONS = {
    "bottom-right": "W-w-20:H-h-20",
    "bottom-left": "20:H-h-20",
    "top-right": "W-w-20:20",
    "top-left": "20:20",
}


def run(cmd, **kwargs):
    print("  $", " ".join(str(c) for c in cmd))
    subprocess.run(cmd, check=True, **kwargs)


# ---------------------------------------------------------------------------
# Step 1: Rhubarb — audio -> timed mouth-shape cues
# ---------------------------------------------------------------------------

def get_mouth_cues(narration_wav: Path, script_txt: Path | None, workdir: Path) -> list[dict]:
    cues_path = workdir / "cues.json"
    cmd = ["rhubarb", "-f", "json", "-o", str(cues_path), str(narration_wav)]
    if script_txt:
        cmd += ["--dialogFile", str(script_txt)]
    run(cmd)
    data = json.loads(cues_path.read_text())
    return data["mouthCues"]  # [{"start": 0.0, "end": 0.12, "value": "X"}, ...]


# ---------------------------------------------------------------------------
# Step 2: patch the Synfig rig — inject waypoints on the mouth switch layer
# ---------------------------------------------------------------------------

def load_sif(sifz_path: Path) -> ET.ElementTree:
    with gzip.open(sifz_path, "rb") as f:
        return ET.parse(f)


def save_sifz(tree: ET.ElementTree, out_path: Path) -> None:
    raw = ET.tostring(tree.getroot(), encoding="utf-8", xml_declaration=True)
    with gzip.open(out_path, "wb") as f:
        f.write(raw)


def find_mouth_switch_layer(root: ET.Element) -> ET.Element:
    for layer in root.iter("layer"):
        if layer.get("desc") == MOUTH_SWITCH_DESC:
            return layer
    raise RuntimeError(
        f"No layer with desc=\"{MOUTH_SWITCH_DESC}\" found. "
        f"Run --inspect to see what layers/params this file actually has."
    )


def find_active_layer_param(switch_layer: ET.Element) -> ET.Element:
    for param in switch_layer.findall("param"):
        if param.get("name") in CANDIDATE_PARAM_NAMES:
            return param
    available = [p.get("name") for p in switch_layer.findall("param")]
    raise RuntimeError(
        f"None of {CANDIDATE_PARAM_NAMES} found on the mouth_switch layer. "
        f"Available param names: {available}. Update CANDIDATE_PARAM_NAMES "
        f"in this script to match, then re-run."
    )


def inject_mouth_cues(sifz_in: Path, cues: list[dict], fps: float, sifz_out: Path) -> None:
    tree = load_sif(sifz_in)
    root = tree.getroot()
    switch_layer = find_mouth_switch_layer(root)
    param = find_active_layer_param(switch_layer)

    # Replace whatever value/animated node is there with a fresh animated string track
    for child in list(param):
        param.remove(child)

    anim_node = ET.SubElement(param, "animated")
    anim_node.set("type", "string")

    for cue in cues:
        time_str = f"{cue['start']:.3f}s"
        wp = ET.SubElement(anim_node, "waypoint")
        wp.set("time", time_str)
        wp.set("before", "constant")
        wp.set("after", "constant")
        val = ET.SubElement(wp, "string")
        val.text = cue["value"]

    save_sifz(tree, sifz_out)
    print(f"  Injected {len(cues)} mouth-shape waypoints -> {sifz_out}")


# ---------------------------------------------------------------------------
# Step 3: render the rig to a transparent (alpha) clip
# ---------------------------------------------------------------------------

def render_character(sifz_path: Path, workdir: Path, fps: int = 30) -> Path:
    frames_dir = workdir / "frames"
    frames_dir.mkdir(exist_ok=True)
    run([
        "synfig", str(sifz_path),
        "-t", "png",
        "--fps", str(fps),
        "-o", str(frames_dir / "frame.png"),
    ])
    # Synfig names output frames "frame.0000.png" (stem.NNNN.ext), not "frame_0000.png"
    return frames_dir


# ---------------------------------------------------------------------------
# Step 4: composite onto the background video + mux narration audio
# ---------------------------------------------------------------------------

def composite(background: Path, frames_dir: Path, narration: Path, fps: int,
              position: str, scale: float, output: Path) -> None:
    # The PNG sequence is overlaid directly (not re-encoded to an intermediate
    # video first) because lossy video codecs like VP9 do not reliably round-trip
    # the alpha channel through ffmpeg's probe/decode path - PNG does, natively.
    overlay_xy = POSITIONS[position]
    filter_complex = (
        f"[1:v]scale=iw*{scale}:ih*{scale}[char];"
        f"[0:v][char]overlay={overlay_xy}:shortest=1[v]"
    )
    run([
        "ffmpeg", "-y",
        "-i", str(background),
        "-framerate", str(fps), "-i", str(frames_dir / "frame.%04d.png"),
        "-i", str(narration),
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "2:a",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-shortest",
        str(output),
    ])


# ---------------------------------------------------------------------------
# --inspect mode: dump layer/param structure so names can be confirmed
# ---------------------------------------------------------------------------

def inspect(sifz_path: Path) -> None:
    tree = load_sif(sifz_path)
    root = tree.getroot()
    print(f"canvas: {root.tag} attrs={root.attrib}")
    for layer in root.iter("layer"):
        print(f"\nlayer type={layer.get('type')!r} desc={layer.get('desc')!r}")
        for param in layer.findall("param"):
            children = [c.tag for c in param]
            print(f"    param name={param.get('name')!r} -> {children}")


# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--inspect", type=Path, help="Dump layer/param structure of a .sifz and exit")
    ap.add_argument("--character", type=Path, help="videos/character/character.sifz")
    ap.add_argument("--narration", type=Path, help="Narration audio (wav)")
    ap.add_argument("--script", type=Path, default=None, help="Plain-text dialog script (improves Rhubarb accuracy)")
    ap.add_argument("--background", type=Path, help="Slides/screen-recording video to overlay the character onto")
    ap.add_argument("--position", choices=POSITIONS.keys(), default="bottom-right")
    ap.add_argument("--scale", type=float, default=0.35, help="Character size as a fraction of background width")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--output", type=Path, help="Final composited mp4")
    ap.add_argument("--keep-temp", action="store_true", help="Keep intermediate files for debugging")
    args = ap.parse_args()

    if args.inspect:
        inspect(args.inspect)
        return

    missing = [n for n in ("character", "narration", "background", "output") if getattr(args, n) is None]
    if missing:
        ap.error(f"missing required args: {', '.join('--' + m for m in missing)}")

    workdir = Path(tempfile.mkdtemp(prefix="explainer_"))
    print(f"Working dir: {workdir}")
    try:
        print("\n[1/4] Running Rhubarb on narration audio...")
        cues = get_mouth_cues(args.narration, args.script, workdir)
        print(f"  {len(cues)} mouth cues")

        print("\n[2/4] Patching character rig with mouth-shape waypoints...")
        patched_sifz = workdir / "character_lipsynced.sifz"
        inject_mouth_cues(args.character, cues, args.fps, patched_sifz)

        print("\n[3/4] Rendering character to a transparent PNG sequence...")
        frames_dir = render_character(patched_sifz, workdir, fps=args.fps)

        print("\n[4/4] Compositing onto background + muxing narration audio...")
        args.output.parent.mkdir(parents=True, exist_ok=True)
        composite(args.background, frames_dir, args.narration, args.fps, args.position, args.scale, args.output)

        print(f"\nDone -> {args.output}")
    finally:
        if args.keep_temp:
            print(f"Kept intermediate files at {workdir}")
        else:
            shutil.rmtree(workdir, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
