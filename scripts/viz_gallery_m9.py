#!/usr/bin/env python3
"""viz_gallery_m9.py — draw every diagram in one Math 9 topic, for review.

    python3 scripts/viz_gallery_m9.py --list
    python3 scripts/viz_gallery_m9.py TOPIC [--key] [--out DIR]
    python3 scripts/viz_gallery_m9.py TOPIC --compare [--key] [--out DIR]

Math 9 has no diagram library: every diagram is its own SVG. Some are fragments in
notes-packages/_visuals/math9-TOPIC/ (put into the notes by add_notes_visuals.py,
between <!-- viz:NAME --> markers); the rest are written straight into the
published HTML. This tool reads the published pages, so after editing a fragment
run add_notes_visuals.py on the unit first.

TOPIC is a folder name (circle-geometry, statistics, ...) and covers
public/materials/math-9/{notes,tests,quizzes,exits,home}/TOPIC/ and
worksheets/*/TOPIC/. TOPIC "workbooks" means the four strand workbooks.
Sims, trainers and posters are left out. Student copies by default; --key reads
the answer keys (*-answers-*) instead.

Each diagram is drawn at print size (620 px column) with its own page's styles.
--compare puts the committed page (git HEAD) on the left and the working copy on
the right, marks CHANGED items, and marks WORDS CHANGED when the text or the
aria-label differs. Pages are cut at about 1800 px; PNGs via headless Chrome.

Nothing in the repo is written. Used by the image-polish agent.
"""
import html
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
M9 = ROOT / "public" / "materials" / "math-9"
VIS = ROOT / "notes-packages" / "_visuals"
COLW = 620


def topic_files(topic, key):
    if topic == "workbooks":
        files = sorted(M9.glob("worksheets/*/math9-*-workbook*.html"))
    else:
        files = []
        for d in ("notes", "tests", "quizzes", "exits", "home"):
            files += sorted((M9 / d / topic).glob("*.html"))
        files += sorted(M9.glob(f"worksheets/*/{topic}/*.html"))
    return [f for f in files if ("answers" in f.name) == key]


def topics():
    return sorted(p.name for p in (M9 / "notes").iterdir() if p.is_dir()) + ["workbooks"]


SVG_RE = re.compile(r"<svg\b.*?</svg>", re.S)


def items(text):
    """Every diagram in a page: (svg, caption, line, fragment-name or None)."""
    styles = "\n".join(re.findall(r"<style\b[^>]*>.*?</style>", text, re.S))
    marks = [(m.start(), m.end(), m.group(1)) for m in re.finditer(r"<!-- viz:([\w-]+) -->.*?<!-- /viz:\1 -->", text, re.S)]
    out = []
    for m in SVG_RE.finditer(text):
        s = m.start()
        frag = next((n for a, b, n in marks if a <= s < b), None)
        fs, fe = text.rfind("<figure", 0, s), text.rfind("</figure>", 0, s)
        cap = ""
        if fs > fe:  # inside a <figure>: show its caption too
            end = text.find("</figure>", m.end())
            c = re.search(r"<figcaption\b.*?</figcaption>", text[m.end():end], re.S) if end != -1 else None
            cap = c.group(0) if c else ""
        out.append((m.group(0), cap, text.count("\n", 0, s) + 1, frag))
    return styles, out


def words(svg):
    """What a diagram says: its aria-label and every text string, in order."""
    lab = re.search(r'aria-label="([^"]*)"', svg)
    body = re.sub(r"<[^>]+>", " ", re.sub(r"<(style|script)\b.*?</\1>", "", svg, flags=re.S))
    return (lab.group(1) if lab else "") + " || " + " ".join(html.unescape(body).split())


def disp_h(svg):
    vb = re.search(r'viewBox="\s*[-\d.]+[ ,]+[-\d.]+[ ,]+([\d.]+)[ ,]+([\d.]+)"', svg)
    w, h = (float(vb.group(1)), float(vb.group(2))) if vb else (400.0, 200.0)
    wa = re.search(r'\bwidth="([\d.]+)"', svg.split(">", 1)[0])
    if wa:
        h, w = h * float(wa.group(1)) / w, float(wa.group(1))
    return h * (COLW / w if w > COLW else 1)


def frame(styles, svg, cap):
    doc = ("<!doctype html><html><head><meta charset='utf-8'>" + styles +
           "<style>html,body{margin:0!important;padding:4px!important;background:#fff;max-width:none!important;width:auto!important}"
           "figure{margin:0}svg{max-width:100%;height:auto}</style></head><body><figure class='viz'>" + svg + cap + "</figure></body></html>")
    return f"<iframe class='fr' srcdoc=\"{html.escape(doc, quote=True)}\"></iframe>"


def head_text(path):
    rel = path.relative_to(ROOT).as_posix()
    r = subprocess.run(["git", "show", f"HEAD:{rel}"], cwd=ROOT, capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else ""


PAGE = """<!doctype html><html><head><meta charset="utf-8"><style>
body { margin: 12px; background: #fff; font-family: sans-serif; }
.g-item { border-bottom: 1px solid #ccc; padding: 6px 0 10px; break-inside: avoid; }
.g-meta { font: 12px/1.3 monospace; color: #555; margin-bottom: 4px; }
.g-meta b { color: #000; }
.chg { background: #ffe08a; color: #000; padding: 0 4px; font-weight: bold; }
.g-row { display: grid; grid-template-columns: 620px 620px; gap: 16px; align-items: start; }
.g-side { font: bold 11px sans-serif; color: #888; }
.fr { width: 620px; border: 0; display: block; height: 60px; }
</style><script>
window.addEventListener('load', () => { for (const f of document.querySelectorAll('iframe.fr')) {
  const d = f.contentDocument; if (d) f.style.height = (d.documentElement.scrollHeight + 4) + 'px'; } });
</script></head><body>
"""


def main(argv):
    if "--list" in argv:
        for t in topics():
            n = sum(len(items(f.read_text(encoding="utf-8"))[1]) for f in topic_files(t, False))
            k = sum(len(items(f.read_text(encoding="utf-8"))[1]) for f in topic_files(t, True))
            frags = len(list((VIS / f"math9-{t}").glob("*.html"))) if t != "workbooks" else 0
            print(f"{t:18} {n:3} diagrams (keys {k}), {frags} notes fragments")
        return
    key, compare = "--key" in argv, "--compare" in argv
    out = None
    if "--out" in argv:
        out = Path(argv[argv.index("--out") + 1])
    pos = [a for i, a in enumerate(argv) if not a.startswith("--") and (i == 0 or argv[i - 1] != "--out")]
    if not pos or pos[0] not in topics():
        sys.exit("topic? one of: " + ", ".join(topics()))
    topic = pos[0]
    out = out or Path("/tmp/viz-gallery-m9") / (topic + ("-key" if key else ""))
    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True)

    rows, changed, wordsdiff, n = [], [], [], 0
    for f in topic_files(topic, key):
        styles, after = items(f.read_text(encoding="utf-8"))
        bstyles, before = items(head_text(f)) if compare else ("", [])
        rel = f.relative_to(M9).as_posix()
        for i, (svg, cap, line, frag) in enumerate(after):
            n += 1
            b = before[i] if i < len(before) else None
            chg = compare and (b is None or b[0] != svg or b[1] != cap)
            wd = chg and b is not None and words(b[0]) != words(svg)
            if chg:
                changed.append(n)
            if wd:
                wordsdiff.append(n)
            src = f"fragment {frag}" if frag else f"inline line {line}"
            tags = ("<span class='chg'>CHANGED</span> " if chg else "") + \
                   ("<span class='chg' style='background:#f88'>WORDS CHANGED</span> " if wd else "")
            meta = f"<div class='g-meta'><b>#{n}</b> {tags}{html.escape(rel)} · {src}</div>"
            if compare:
                left = frame(bstyles, b[0], b[1]) if b else "<p>(new)</p>"
                row = (f"<div class='g-row'><div><div class='g-side'>BEFORE (HEAD)</div>{left}</div>"
                       f"<div><div class='g-side'>AFTER</div>{frame(styles, svg, cap)}</div></div>")
            else:
                row = f"<div>{frame(styles, svg, cap)}</div>"
            h = 40 + max(disp_h(svg), disp_h(b[0]) if b else 0) + (40 if cap else 0)
            rows.append((h if compare else h / 2, f"<div class='g-item'>{meta}{row}</div>"))
        if compare and len(before) > len(after):
            print(f"note: {rel} has {len(before) - len(after)} fewer diagrams than HEAD")

    pages, cur, curh = [], None, 0
    for h, r in rows:
        if cur is None or curh + h > 1800:
            pages.append(cur := [])
            curh = 0
        cur.append(r)
        curh += h
    chrome = next((c for c in ("/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser") if os.access(c, os.X_OK)), None)
    grid = "<div style='display:grid;grid-template-columns:620px 620px;gap:0 24px'>"
    for k, p in enumerate(pages, 1):
        base = out / f"page-{k:02d}"
        body = "".join(p) if compare else grid + "".join(p) + "</div>"
        base.with_suffix(".html").write_text(PAGE + body + "</body></html>\n", encoding="utf-8")
        if chrome:
            subprocess.run([chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                            "--window-size=1300,1900", "--virtual-time-budget=3000", f"--screenshot={base}.png",
                            base.with_suffix(".html").as_uri()], capture_output=True)
    print(f"{topic}{' (keys)' if key else ''}: {n} diagrams"
          + (f", {len(changed)} changed" if compare else "")
          + f" → {len(pages)} page(s) in {out}" + ("" if chrome else " (no Chrome: HTML only)"))
    if changed:
        print("changed: #" + ", #".join(map(str, changed)))
    if wordsdiff:
        print("WORDS CHANGED (text or aria-label differs — not allowed): #" + ", #".join(map(str, wordsdiff)))


if __name__ == "__main__":
    main(sys.argv[1:])
