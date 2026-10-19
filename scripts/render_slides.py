"""Render a slide deck folder to one standalone HTML presenter.

A deck folder holds deck.json (title, order, faces) and slides/<id>.html,
one <section> per file, in the slide format described in slides/_context.md.
The presenter shell is scripts/slides-shell.html.

Usage, from the repo root:
  python scripts/render_slides.py slides/grade-9-social/urbanization-industry/soc9-urbanization-industry-slides-v1
  python scripts/render_slides.py            # every deck under slides/

Output: public/materials/<deck folder name>.html
"""
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SHELL = REPO / "scripts" / "slides-shell.html"
OUT_DIR = REPO / "public" / "materials"


def font_link(faces: dict) -> str:
    families = [
        f["href"].split("?", 1)[1].replace("&display=swap", "")
        for f in faces.values()
        if f.get("href", "").startswith("https://fonts.googleapis.com/css2?")
    ]
    if not families:
        return ""
    return f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{"&".join(families)}&display=swap">'


def render(folder: Path) -> Path:
    deck = json.loads((folder / "deck.json").read_text(encoding="utf-8"))
    files = [folder / "slides" / f"{sid}.html" for sid in deck["order"]]
    missing = [f.name for f in files if not f.exists()]
    if missing:
        raise SystemExit(f"{folder.name}: missing slide files: {', '.join(missing)}")
    unlisted = sorted({f.stem for f in (folder / "slides").glob("*.html")} - set(deck["order"]))
    if unlisted:
        print(f"{folder.name}: not in deck.json order, left out: {', '.join(unlisted)}")

    slides = "\n".join(f.read_text(encoding="utf-8").strip() for f in files)
    html = (
        SHELL.read_text(encoding="utf-8")
        .replace("{{TITLE}}", deck["title"])
        .replace("{{FONT_LINK}}", font_link(deck.get("faces", {})))
        .replace("{{SLIDES}}", slides)
    )
    out = OUT_DIR / f"{folder.name}.html"
    out.write_text(html, encoding="utf-8", newline="\n")
    print(f"wrote {out.relative_to(REPO)} ({len(files)} slides)")
    return out


def main() -> None:
    if len(sys.argv) > 1:
        folders = [Path(a).resolve() for a in sys.argv[1:]]
    else:
        folders = sorted(p.parent for p in (REPO / "slides").glob("*/*/*/deck.json"))
    if not folders:
        raise SystemExit("no deck folders found")
    for folder in folders:
        render(folder)


if __name__ == "__main__":
    main()
