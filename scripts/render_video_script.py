#!/usr/bin/env python3
"""Render a video-scripts/*.md file into narration audio + a Manim scene scaffold + a final mp4.

Pipeline: parse beats from the markdown -> generate narration per beat via Voicebox
(local TTS server) -> scaffold a Manim Scene (one stub method per beat, audio/timing
already wired) -> render with the `manim` CLI -> move the mp4 into videos/output/.

The Manim scene file is written ONCE and never overwritten on a later run — the actual
self.play(...) animation choreography for each beat is a manual/creative step (same as
character artwork in the avatar pipeline; see videos/character/README.md). Re-running
this script after a text edit only regenerates narration audio and the beats.json
diagnostic record, never the hand-edited scene file.

Usage:
    python3 "scripts/render_video_script.py" \\
        --script "video-scripts/math-9/rational-numbers/math9-rational-numbers-video-equivalent-fractions-v1.md" \\
        --quality l

    # Diagnostic: parse only, no Voicebox/manim calls
    python3 "scripts/render_video_script.py" --script path/to/script.md --parse-only

Requires `manim` on PATH (`uv tool install manim`) and a running Voicebox server
(default http://127.0.0.1:17493). `requests` must be importable by this script's
python3 — it is NOT required inside manim's own environment.
"""

import argparse
import glob
import json
import re
import shutil
import sys
import tempfile
import time
from pathlib import Path

import requests

REPO_ROOT = Path(__file__).resolve().parent.parent
VOICEBOX_PROFILE_NAME = "Classroom Explainer Voice"
VOICEBOX_PRESET = {
    "voice_type": "preset",
    "preset_engine": "kokoro",
    "preset_voice_id": "af_heart",
}
QUALITY_FLAGS = {"l": "-ql", "m": "-qm", "h": "-qh"}

HEADING_RE = re.compile(r"^##\s+(.*)$", re.MULTILINE)
TITLE_RE = re.compile(r"^#\s+(.*)$", re.MULTILINE)
HEADER_FIELD_RE = re.compile(r"^\*\*([A-Za-z][A-Za-z ]*?):\*\*\s*(.*)$", re.MULTILINE)
BEAT_ROW_RE = re.compile(
    r"^\|\s*\*\*(NARRATE|ANIMATE|ON-SCREEN TEXT|HOLD)\*\*\s*\|\s*(.*?)\s*\|\s*$",
    re.MULTILINE,
)
HOLD_SECONDS_RE = re.compile(r"(\d+(?:\.\d+)?)\s*s\b")
HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)


def slugify(text, max_len=40):
    text = re.sub(r"[^a-zA-Z0-9]+", "_", text).strip("_").lower()
    return text[:max_len].strip("_") or "beat"


# ---------------------------------------------------------------------------
# Step 1: parse the video-scripts markdown
# ---------------------------------------------------------------------------

def parse_script(md_text):
    text = HTML_COMMENT_RE.sub("", md_text)

    title_match = TITLE_RE.search(text)
    title = title_match.group(1).strip() if title_match else "Untitled"

    first_heading = HEADING_RE.search(text)
    header_region = text[: first_heading.start()] if first_heading else text
    header_fields = {}
    for key, value in HEADER_FIELD_RE.findall(header_region):
        header_fields[key.strip().lower().replace(" ", "_")] = value.strip()

    headings = list(HEADING_RE.finditer(text))
    legend = []
    beats = []
    for i, m in enumerate(headings):
        heading_text = m.group(1).strip()
        body_start = m.end()
        body_end = headings[i + 1].start() if i + 1 < len(headings) else len(text)
        body = text[body_start:body_end]

        lower = heading_text.lower()
        if "legend" in lower:
            legend = _parse_legend_table(body)
            continue
        if "production notes" in lower:
            continue

        fields = {k: v for k, v in BEAT_ROW_RE.findall(body)}
        if not fields:
            continue  # heading with no beat table (shouldn't happen, but don't choke on it)

        hold_text = fields.get("HOLD", "")
        hold_match = HOLD_SECONDS_RE.search(hold_text)
        if hold_match:
            hold_seconds = float(hold_match.group(1))
        else:
            hold_seconds = 2.0
            print(f"  ! Could not parse HOLD duration for '{heading_text}', defaulting to {hold_seconds}s")

        narrate = fields.get("NARRATE", "").strip()
        slug_source = re.sub(r"^Beat\s+\d+[a-z]?\s*:?\s*", "", heading_text, flags=re.IGNORECASE)
        beats.append(
            {
                "heading": heading_text,
                "method": f"beat_{len(beats):02d}_{slugify(slug_source)}",
                "narrate": narrate if narrate.lower() != "none" else "",
                "animate": fields.get("ANIMATE", "").strip(),
                "on_screen_text": fields.get("ON-SCREEN TEXT", "").strip(),
                "hold_seconds": hold_seconds,
            }
        )

    return {"title": title, "header_fields": header_fields, "legend": legend, "beats": beats}


def _parse_legend_table(body):
    rows = []
    for line in body.splitlines():
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if not cells or all(re.fullmatch(r"-+", c) for c in cells):
            continue  # separator row
        if cells[0].lower().startswith("object"):
            continue  # header row
        if len(cells) >= 2:
            rows.append({"object": cells[0], "color": cells[1], "notes": cells[2] if len(cells) > 2 else ""})
    return rows


# ---------------------------------------------------------------------------
# Step 2: narration via Voicebox
# ---------------------------------------------------------------------------

def ensure_profile(voicebox_url, profile_id):
    if profile_id:
        return profile_id

    resp = requests.get(f"{voicebox_url}/profiles", timeout=15)
    resp.raise_for_status()
    for profile in resp.json():
        if profile.get("name") == VOICEBOX_PROFILE_NAME:
            print(f"  Using existing Voicebox profile '{VOICEBOX_PROFILE_NAME}' ({profile['id']})")
            return profile["id"]

    print(f"  No '{VOICEBOX_PROFILE_NAME}' profile found — creating one (kokoro/af_heart preset)...")
    body = {"name": VOICEBOX_PROFILE_NAME, "description": "Default narration voice for explanation videos.", "language": "en"}
    body.update(VOICEBOX_PRESET)
    resp = requests.post(f"{voicebox_url}/profiles", json=body, timeout=30)
    resp.raise_for_status()
    profile = resp.json()
    print(f"  Created profile {profile['id']}")
    return profile["id"]


def generate_narration(voicebox_url, profile_id, text, out_path, timeout=300, poll=2.0):
    resp = requests.post(f"{voicebox_url}/generate", json={"profile_id": profile_id, "text": text}, timeout=30)
    resp.raise_for_status()
    generation_id = resp.json()["id"]

    deadline = time.time() + timeout
    last_status = None
    while time.time() < deadline:
        resp = requests.get(f"{voicebox_url}/history/{generation_id}", timeout=15)
        resp.raise_for_status()
        history = resp.json()
        status = history["status"]
        if status != last_status:
            print(f"    [{status}]")
            last_status = status
        if status == "completed":
            audio = requests.get(f"{voicebox_url}/audio/{generation_id}", timeout=60)
            audio.raise_for_status()
            out_path.write_bytes(audio.content)
            return history["duration"]
        if status == "failed":
            raise RuntimeError(f"Voicebox generation failed: {history.get('error')}")
        time.sleep(poll)
    raise TimeoutError(f"Voicebox generation did not complete within {timeout}s (last status: {last_status})")


# ---------------------------------------------------------------------------
# Step 3/4: scaffold the Manim scene (write-once)
# ---------------------------------------------------------------------------

SCENE_TEMPLATE = '''"""Manim scene for {slug}.

Auto-generated scaffold by scripts/render_video_script.py from {source_md}.
This file is written ONCE and never overwritten by a later pipeline run — fill in the
`# TODO: self.play(...)` markers below with real animation code. Re-running the
pipeline after a text edit only regenerates narration audio and beats.json, not this
file. If you need a clean scaffold again, delete this file first.
"""

from manim import *


class ExplainerScene(Scene):
    def construct(self):
{beat_calls}

{beat_methods}
'''

BEAT_METHOD_TEMPLATE = '''    def {method}(self):
        """ANIMATE: {animate}
        ON-SCREEN TEXT: {on_screen_text}
        """
{add_sound_line}
        # TODO: self.play(...) — translate the ANIMATE description above into real Manim calls
        self.wait({hold_seconds})
'''


def scaffold_scene(scene_path, parsed, audio_paths, slug, source_md):
    if scene_path.exists():
        print(f"  Scene already exists, leaving it untouched: {scene_path}")
        return

    beat_methods = []
    beat_calls = []
    for beat, audio_path in zip(parsed["beats"], audio_paths):
        if audio_path is not None:
            rel = audio_path  # already absolute; Manim resolves absolute paths fine
            add_sound_line = f'        self.add_sound("{rel}")'
        else:
            add_sound_line = "        # (no narration for this beat)"
        beat_methods.append(
            BEAT_METHOD_TEMPLATE.format(
                method=beat["method"],
                animate=beat["animate"] or "(none)",
                on_screen_text=beat["on_screen_text"] or "(none)",
                add_sound_line=add_sound_line,
                hold_seconds=beat["hold_seconds"],
            )
        )
        beat_calls.append(f"        self.{beat['method']}()")

    scene_path.parent.mkdir(parents=True, exist_ok=True)
    scene_path.write_text(
        SCENE_TEMPLATE.format(
            slug=slug,
            source_md=source_md,
            beat_calls="\n".join(beat_calls),
            beat_methods="\n".join(beat_methods),
        )
    )
    print(f"  Wrote scaffold: {scene_path}")


# ---------------------------------------------------------------------------
# Step 5: render with manim, move output
# ---------------------------------------------------------------------------

def run(cmd, **kwargs):
    print("  $", " ".join(str(c) for c in cmd))
    import subprocess

    subprocess.run(cmd, check=True, **kwargs)


def render(scene_path, slug, quality, keep_temp):
    media_dir = Path(tempfile.mkdtemp(prefix="manim_media_"))
    print(f"  Media dir: {media_dir}")
    try:
        run(
            [
                "manim",
                "render",
                QUALITY_FLAGS[quality],
                "--media_dir",
                str(media_dir),
                "-o",
                slug,
                str(scene_path),
                "ExplainerScene",
            ]
        )
        candidates = glob.glob(str(media_dir / "videos" / "**" / f"{slug}.mp4"), recursive=True)
        if not candidates:
            candidates = glob.glob(str(media_dir / "videos" / "**" / "*.mp4"), recursive=True)
        if not candidates:
            raise RuntimeError(f"manim render completed but no mp4 found under {media_dir}")

        output_dir = REPO_ROOT / "videos" / "output"
        output_dir.mkdir(parents=True, exist_ok=True)
        final_path = output_dir / f"{slug}.mp4"
        shutil.copy2(candidates[0], final_path)
        return final_path
    finally:
        if keep_temp:
            print(f"  --keep-temp set, media dir kept at: {media_dir}")
        else:
            shutil.rmtree(media_dir, ignore_errors=True)


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--script", type=Path, help="Path to a video-scripts/*.md file")
    ap.add_argument("--parse-only", action="store_true", help="Parse and print the beat structure as JSON; no Voicebox/manim calls")
    ap.add_argument("--voicebox-url", default="http://127.0.0.1:17493")
    ap.add_argument("--profile-id", default=None, help="Voicebox profile id; auto-creates a default preset profile if omitted")
    ap.add_argument("--quality", choices=sorted(QUALITY_FLAGS), default="l")
    ap.add_argument("--keep-temp", action="store_true")
    args = ap.parse_args()

    if args.script is None:
        ap.error("--script is required")

    md_text = args.script.read_text()
    parsed = parse_script(md_text)

    if args.parse_only:
        print(json.dumps(parsed, indent=2))
        return

    slug = args.script.stem
    cache_dir = REPO_ROOT / "videos" / "cache" / slug
    cache_dir.mkdir(parents=True, exist_ok=True)

    print(f"[1/4] Parsed '{parsed['title']}' — {len(parsed['beats'])} beats")

    print("[2/4] Generating narration via Voicebox...")
    profile_id = ensure_profile(args.voicebox_url, args.profile_id)
    audio_paths = []
    beats_record = []
    for beat in parsed["beats"]:
        if not beat["narrate"]:
            print(f"  {beat['heading']}: no narration, skipping")
            audio_paths.append(None)
            beats_record.append({**beat, "audio_path": None, "audio_duration": None})
            continue
        out_path = cache_dir / f"{beat['method']}.wav"
        print(f"  {beat['heading']}: generating...")
        duration = generate_narration(args.voicebox_url, profile_id, beat["narrate"], out_path)
        print(f"    -> {out_path} ({duration:.1f}s)")
        audio_paths.append(str(out_path.resolve()))
        beats_record.append({**beat, "audio_path": str(out_path.resolve()), "audio_duration": duration})

    beats_json_path = cache_dir / "beats.json"
    beats_json_path.write_text(json.dumps(beats_record, indent=2))
    print(f"  Wrote {beats_json_path}")

    print("[3/4] Scaffolding Manim scene...")
    scene_path = REPO_ROOT / "videos" / "scenes" / f"{slug}.py"
    scaffold_scene(scene_path, parsed, audio_paths, slug, str(args.script))

    print("[4/4] Rendering...")
    final_path = render(scene_path, slug, args.quality, args.keep_temp)
    print(f"Done -> {final_path}")


if __name__ == "__main__":
    main()
