"""Insert teaching visuals into notes packages and their answer keys.

Each visual is one fragment file in notes-packages/_visuals/<unit>/NN-name.html:

    ---
    section: Section 3            text inside the section's <h2> (search starts there)
    anchor: <strong>Changes of state:</strong>   text on the line to insert at
    where: after                  before | after | after:<text> (first line at/after the anchor holding <text>)
    ak_anchor: ...                optional: different anchor for the answer key
    caption: One sentence students read under the diagram.
    tikz: pattern-name | key=value | ...
    ---
    <svg viewBox="0 0 W H" aria-label="...">
      ... dg-* classed elements ...
      <tag x="10" y="20" w="70">answer</tag>      blank label box; answer shows only in the key
      <arrow x1="0" y1="0" x2="50" y2="0" kind="hot"/>   line + arrowhead (kind: plain|accent|hot|cold|muted)
      <mapbase name="europe-canada" x="0" y="0"/>   land layer from notes-packages/_visuals/_maps/ (scripts/build_social_maps.py)
    </svg>

Student notes get empty dashed tag boxes; the answer key gets the same box with the answer in green.
If the anchor is not in the answer key, the figure goes right after that section's <h2> line.

Re-running is safe: earlier inserts (between <!-- viz:... --> markers) are removed first.

Usage:
    python3 scripts/add_notes_visuals.py                 all units
    python3 scripts/add_notes_visuals.py sci7-heat-temperature math9-polynomials
    python3 scripts/add_notes_visuals.py --preview DIR   also write DIR/<unit>.html with every figure, notes + key
    python3 scripts/add_notes_visuals.py --remove        strip all inserted visuals
"""
import html
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIS = ROOT / "notes-packages" / "_visuals"
PM = ROOT / "public" / "materials"
M9 = PM / "math-9" / "notes"

UNITS = {
    "sci7-heat-temperature": (PM / "sci7-heat-temperature-notes-v1.html", PM / "sci7-heat-temperature-notes-answers-v2.html"),
    "sci7-interactions-ecosystems": (PM / "sci7-interactions-ecosystems-notes-v1.html", PM / "sci7-interactions-ecosystems-notes-answers-v2.html"),
    "sci7-planet-earth": (PM / "sci7-planet-earth-notes-v1.html", PM / "sci7-planet-earth-notes-answers-v2.html"),
    "sci7-plants-food-fibre": (PM / "sci7-plants-food-fibre-notes-v1.html", PM / "sci7-plants-food-fibre-notes-answers-v2.html"),
    "sci7-structures-forces": (PM / "sci7-structures-forces-notes-v1.html", PM / "sci7-structures-forces-notes-answers-v2.html"),
}
for _topic, _stem in [
    ("circle-geometry", "circle-geometry"), ("linear-equations", "linear-equations"),
    ("linear-relations", "linear-relations"), ("measurement", "measurement"),
    ("polynomials", "polynomials"), ("powers-exponents", "powers"),
    ("probability", "probability"), ("rational-numbers", "rational-numbers"),
    ("similarity", "similarity"), ("square-roots", "square-roots"), ("statistics", "statistics"),
]:
    UNITS[f"math9-{_topic}"] = (M9 / _topic / f"math9-{_stem}-notes-v1.html",
                                M9 / _topic / f"math9-{_stem}-notes-answers-v1.html")
for _g, _units in [
    (8, ["civic-engagement", "economic-systems", "ideologies", "political-systems"]),
    (9, ["canada-in-wwii", "evolving-citizenship", "independence-democratic-rights", "modern-economy",
         "postwar-canada", "system-of-government", "urbanization-industry"]),
]:
    for _u in _units:
        UNITS[f"soc{_g}-{_u}"] = (PM / f"soc{_g}-{_u}-notes-v1.html", PM / f"soc{_g}-{_u}-notes-answers-v1.html")

CSS_START = "/* ── viz-kit: teaching visuals (scripts/add_notes_visuals.py) ── */"
CSS_END = "/* ── /viz-kit ── */"
CSS = CSS_START + """
:root { --dg-accent: var(--accent, var(--unit, #1d4ed8)); --viz-hot: #c2410c; --viz-cold: #1d4ed8;
        --viz-plant: #15803d; --viz-water: #0369a1; --viz-earth: #92400e; --viz-sun: #ca8a04; --viz-key: #15803d; }
.viz { margin: 1rem auto 1.25rem; text-align: center; break-inside: avoid; page-break-inside: avoid; }
.viz svg { display: block; margin: 0 auto; max-width: 100%; height: auto; }
.viz figcaption { font-size: 0.8rem; line-height: 1.4; color: #544f47; margin: 0.4rem auto 0; max-width: 40rem; font-style: italic; }
svg .dg-boundary, svg .dg-line, svg .dg-accent, svg .dg-dashed, svg .dg-right-angle, svg .dg-construction { vector-effect: non-scaling-stroke; }
svg .dg-boundary    { stroke: var(--dg-stroke, #3f3b35); fill: var(--dg-fill, #faf9f6); stroke-width: var(--dg-sw, 1.5px); }
svg .dg-line        { stroke: var(--dg-stroke, #3f3b35); fill: none; stroke-width: var(--dg-sw, 1.5px); }
svg .dg-accent      { stroke: var(--dg-accent); fill: none; stroke-width: var(--dg-sw-bold, 2.5px); }
svg .dg-dashed      { stroke: var(--dg-secondary, #544f47); fill: none; stroke-width: var(--dg-sw, 1.5px); stroke-dasharray: 5 3; }
svg .dg-right-angle { stroke: var(--dg-stroke, #3f3b35); fill: none; stroke-width: var(--dg-sw-thin, 1px); }
svg .dg-construction{ stroke: var(--dg-muted, #6b665d); fill: none; stroke-width: var(--dg-sw-thin, 1px); stroke-dasharray: 2 3; }
svg .dg-point       { fill: var(--dg-stroke, #3f3b35); stroke: none; }
svg .dg-point-accent{ fill: var(--dg-accent); stroke: none; }
svg .dg-label       { font: 12px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--dg-stroke, #3f3b35); stroke: none; }
svg .dg-label-sm    { font: 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--dg-secondary, #544f47); stroke: none; }
svg .dg-label-accent{ font: 600 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--dg-accent); stroke: none; }
.viz-ak-note { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #544f47; margin: 1rem 0 0.25rem; }
svg .dg-grid, svg .dg-tag, svg .dg-arrow, svg .dg-fill-accent, svg .dg-fill-hot, svg .dg-fill-cold,
svg .dg-fill-plant, svg .dg-fill-water, svg .dg-fill-earth, svg .dg-fill-sun, svg .dg-fill-soft, svg .dg-outline { vector-effect: non-scaling-stroke; }
svg .dg-grid        { stroke: var(--dg-muted, #6b665d); stroke-opacity: .45; fill: none; stroke-width: 1px; }
svg .dg-outline     { stroke: var(--dg-stroke, #3f3b35); fill: none; stroke-width: 1.5px; }
svg .dg-fill-accent { fill: var(--dg-accent); fill-opacity: .14; stroke: var(--dg-accent); stroke-width: 1.5px; }
svg .dg-fill-hot    { fill: var(--viz-hot);   fill-opacity: .16; stroke: var(--viz-hot);   stroke-width: 1.5px; }
svg .dg-fill-cold   { fill: var(--viz-cold);  fill-opacity: .12; stroke: var(--viz-cold);  stroke-width: 1.5px; }
svg .dg-fill-plant  { fill: var(--viz-plant); fill-opacity: .16; stroke: var(--viz-plant); stroke-width: 1.5px; }
svg .dg-fill-water  { fill: var(--viz-water); fill-opacity: .14; stroke: var(--viz-water); stroke-width: 1.5px; }
svg .dg-fill-earth  { fill: var(--viz-earth); fill-opacity: .16; stroke: var(--viz-earth); stroke-width: 1.5px; }
svg .dg-fill-sun    { fill: var(--viz-sun);   fill-opacity: .22; stroke: var(--viz-sun);   stroke-width: 1.5px; }
svg .dg-fill-soft   { fill: #efece6; stroke: #c9c4b9; stroke-width: 1px; }
svg .dg-solid-accent{ fill: var(--dg-accent); stroke: none; }
svg .dg-solid-hot   { fill: var(--viz-hot); stroke: none; }
svg .dg-solid-cold  { fill: var(--viz-cold); stroke: none; }
svg .dg-solid-plant { fill: var(--viz-plant); stroke: none; }
svg .dg-solid-water { fill: var(--viz-water); stroke: none; }
svg .dg-solid-earth { fill: var(--viz-earth); stroke: none; }
svg .dg-solid-sun   { fill: var(--viz-sun); stroke: none; }
svg .dg-solid-muted { fill: var(--dg-muted, #6b665d); stroke: none; }
svg .dg-arrow       { fill: none; stroke-width: 2px; stroke-linecap: round; }
svg .dg-arrow.plain { stroke: var(--dg-stroke, #3f3b35); }  svg .dg-head.plain  { fill: var(--dg-stroke, #3f3b35); }
svg .dg-arrow.accent{ stroke: var(--dg-accent); }           svg .dg-head.accent { fill: var(--dg-accent); }
svg .dg-arrow.hot   { stroke: var(--viz-hot); }             svg .dg-head.hot    { fill: var(--viz-hot); }
svg .dg-arrow.cold  { stroke: var(--viz-cold); }            svg .dg-head.cold   { fill: var(--viz-cold); }
svg .dg-arrow.plant { stroke: var(--viz-plant); }           svg .dg-head.plant  { fill: var(--viz-plant); }
svg .dg-arrow.water { stroke: var(--viz-water); }           svg .dg-head.water  { fill: var(--viz-water); }
svg .dg-arrow.earth { stroke: var(--viz-earth); }           svg .dg-head.earth  { fill: var(--viz-earth); }
svg .dg-arrow.sun   { stroke: var(--viz-sun); }             svg .dg-head.sun    { fill: var(--viz-sun); }
svg .dg-arrow.muted { stroke: var(--dg-muted, #6b665d); }   svg .dg-head.muted  { fill: var(--dg-muted, #6b665d); }
svg .dg-arrow.thin  { stroke-width: 1.4px; }
svg .dg-head        { stroke: none; }
svg .dg-tag         { fill: #fff; stroke: var(--dg-accent); stroke-width: 1.25px; stroke-dasharray: 4 2; }
svg .dg-tag-answer  { font: 600 12px/1 var(--font-body, system-ui, sans-serif); fill: var(--viz-key); }
svg .dg-title       { font: 700 13px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--dg-stroke, #3f3b35); }
svg .dg-math        { font: 15px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--dg-stroke, #3f3b35); }
svg .dg-math-lg     { font: 600 20px/1.2 var(--font-body, system-ui, sans-serif); fill: var(--dg-stroke, #3f3b35); }
svg .dg-math-accent { font: 700 15px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--dg-accent); }
svg .dg-label-hot   { font: 600 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--viz-hot); }
svg .dg-label-cold  { font: 600 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--viz-cold); }
svg .dg-label-plant { font: 600 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--viz-plant); }
svg .dg-label-water { font: 600 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--viz-water); }
svg .dg-label-earth { font: 600 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--viz-earth); }
svg .dg-label-white { font: 700 12px/1.3 var(--font-body, system-ui, sans-serif); fill: #fff; }
svg .dg-land, svg .dg-land-hi, svg .dg-border { vector-effect: non-scaling-stroke; stroke-linejoin: round; }
svg .dg-land        { fill: #ebe7df; stroke: #a8a294; stroke-width: .75px; }
svg .dg-land-hi     { fill: var(--dg-accent); fill-opacity: .22; stroke: var(--dg-accent); stroke-width: 1px; }
svg .dg-border      { fill: none; stroke: #a8a294; stroke-width: .5px; }
svg .dg-sea         { fill: #f4f7f9; stroke: none; }
svg .dg-route       { fill: none; stroke: var(--dg-accent); stroke-width: 2px; stroke-linecap: round; vector-effect: non-scaling-stroke; }
svg .dg-route.muted { stroke: var(--dg-muted, #6b665d); stroke-dasharray: 5 3; }
svg .dg-halo        { paint-order: stroke; stroke: #fff; stroke-width: 3px; stroke-linejoin: round; }
""" + CSS_END

VIZ_RE = re.compile(r"[ \t]*<!-- viz:[\w-]+ -->.*?<!-- /viz:[\w-]+ -->\n?", re.S)
CSS_RE = re.compile(r"\n?[ \t]*" + re.escape(CSS_START) + r".*?" + re.escape(CSS_END) + r"\n?", re.S)


def parse_fragment(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    if not m:
        sys.exit(f"{path}: missing --- header")
    meta = {}
    for line in m.group(1).splitlines():
        if line.strip():
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
    for key in ("section", "anchor", "caption"):
        if key not in meta:
            sys.exit(f"{path}: header needs '{key}'")
    meta["id"] = path.stem.split("-", 1)[1] if re.match(r"\d+-", path.stem) else path.stem
    meta["svg"] = m.group(2).strip()
    meta["file"] = path
    return meta


def attrs(s):
    return dict(re.findall(r'([\w-]+)="([^"]*)"', s))


def expand(svg, answer_key):
    def tag(m):
        a = attrs(m.group(1))
        x, y, w = float(a["x"]), float(a["y"]), float(a["w"])
        h = float(a.get("h", 20))
        out = f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="3" class="dg-tag"/>'
        if answer_key:
            out += (f'<text x="{x + w / 2:g}" y="{y + h / 2 + 4:g}" text-anchor="middle" '
                    f'class="dg-tag-answer">{m.group(2).strip()}</text>')
        return out

    def arrow(m):
        a = attrs(m.group(1))
        x1, y1, x2, y2 = (float(a[k]) for k in ("x1", "y1", "x2", "y2"))
        kind = a.get("kind", "plain")
        size = float(a.get("head", 9))
        extra = " thin" if a.get("thin") else ""
        ang = math.atan2(y2 - y1, x2 - x1)
        # shorten the shaft so its round cap hides under the head
        sx, sy = x2 - math.cos(ang) * size * 0.7, y2 - math.sin(ang) * size * 0.7
        pts = []
        for da, r in ((0, 0), (2.6, size), (-2.6, size)):
            pts.append((x2 + math.cos(ang + da) * r, y2 + math.sin(ang + da) * r) if r else (x2, y2))
        p = " ".join(f"{px:.1f},{py:.1f}" for px, py in pts)
        line = f'<line x1="{x1:g}" y1="{y1:g}" x2="{sx:.1f}" y2="{sy:.1f}" class="dg-arrow {kind}{extra}"/>'
        if a.get("both"):
            ang2 = ang + math.pi
            pts2 = [(x1, y1)] + [(x1 + math.cos(ang2 + da) * size, y1 + math.sin(ang2 + da) * size) for da in (2.6, -2.6)]
            line = (f'<line x1="{x1 + math.cos(ang) * size * .7:.1f}" y1="{y1 + math.sin(ang) * size * .7:.1f}" '
                    f'x2="{sx:.1f}" y2="{sy:.1f}" class="dg-arrow {kind}{extra}"/>'
                    f'<polygon points="{" ".join(f"{px:.1f},{py:.1f}" for px, py in pts2)}" class="dg-head {kind}"/>')
        return line + f'<polygon points="{p}" class="dg-head {kind}"/>'

    def mapbase(m):
        a = attrs(m.group(1))
        layer = (VIS / "_maps" / f"{a['name']}.svg").read_text(encoding="utf-8")
        layer = re.sub(r"<!--.*?-->\n?", "", layer, flags=re.S).strip()
        if "x" in a or "y" in a:
            layer = f'<g transform="translate({a.get("x", 0)},{a.get("y", 0)})">{layer}</g>'
        return layer

    svg = re.sub(r"<mapbase\s+([^>]*?)/>", mapbase, svg)
    svg = re.sub(r"<tag\s+([^>]*)>(.*?)</tag>", tag, svg, flags=re.S)
    svg = re.sub(r"<arrow\s+([^>]*?)/>", arrow, svg)
    head = re.match(r"<svg\b([^>]*)>", svg)
    a = attrs(head.group(1))
    if "viewBox" not in a:
        sys.exit("svg needs a viewBox")
    _, _, w, h = a["viewBox"].split()
    new = '<svg xmlns="http://www.w3.org/2000/svg" role="img"'
    for k in ("viewBox", "aria-label"):
        new += f' {k}="{a[k]}"'
    new += f' width="{a.get("width", w)}" height="{a.get("height", h)}">'
    return new + svg[head.end():]


def figure(meta, answer_key):
    svg = expand(meta["svg"], answer_key)
    tikz = meta.get("tikz", f"custom | {meta['id']}")
    cap = meta["caption"]
    return (f'<!-- viz:{meta["id"]} -->\n<figure class="viz">\n<!-- tikz: {tikz} -->\n{svg}\n'
            f'<figcaption>{cap}</figcaption>\n</figure>\n<!-- /viz:{meta["id"]} -->\n')


def find_section(doc, section, path):
    for m in re.finditer(r"<h2\b[^>]*>(.*?)</h2>", doc, re.S):
        if section in re.sub(r"<[^>]+>", "", html.unescape(m.group(1))):
            return m
    sys.exit(f"{path.name}: no <h2> containing '{section}'")


def insert_point(doc, meta, anchor, where):
    sec = find_section(doc, meta["section"], meta["path"])
    nxt = re.compile(r"<h2\b").search(doc, sec.end())
    limit = nxt.start() if nxt else len(doc)
    i = doc.find(anchor, sec.start(), limit)
    if i < 0:
        return None
    if where == "before":
        return doc.rfind("\n", 0, i) + 1
    if where.startswith("after:"):
        line_end = doc.find("\n", i)
        j = doc.find(where[6:], line_end if line_end >= 0 else i)
        if j < 0:
            sys.exit(f"{meta['file'].name}: '{where[6:]}' not found after anchor")
        i = j
    end = doc.find("\n", i)
    return len(doc) if end < 0 else end + 1


def fallback_point(doc, meta):
    sec = find_section(doc, meta["section"], meta["path"])
    end = doc.find("\n", sec.end())
    return end + 1


def apply(unit, frags, notes_path, ak_path, remove=False):
    report = []
    for path, answer_key in ((notes_path, False), (ak_path, True)):
        doc = path.read_text(encoding="utf-8")
        doc = VIZ_RE.sub("", doc)
        doc = CSS_RE.sub("", doc)  # the block is inserted with its own newlines; put nothing back
        if not remove and frags:
            doc = doc.replace("</style>", "\n" + CSS + "\n</style>", 1)
            # insert bottom-up so earlier offsets stay valid; ties keep fragment order
            placed = []
            for n, meta in enumerate(frags):
                meta = dict(meta, path=path)
                anchor = meta.get("ak_anchor", meta["anchor"]) if answer_key else meta["anchor"]
                pos = insert_point(doc, meta, anchor, meta.get("where", "after"))
                mode = "anchor"
                if pos is None:
                    if not answer_key:
                        sys.exit(f"{unit}/{meta['file'].name}: anchor not found in {meta['section']} of {path.name}")
                    pos, mode = fallback_point(doc, meta), "top of section"
                placed.append((pos, n, meta, mode))
                report.append(f"  {'key' if answer_key else 'notes'}: {meta['file'].name} → {meta['section']} ({mode})")
            for pos, n, meta, mode in sorted(placed, key=lambda t: (t[0], t[1]), reverse=True):
                block = figure(meta, answer_key)
                if mode == "top of section":
                    block = block.replace('<figure class="viz">', '<figure class="viz">\n<p class="viz-ak-note">Diagram — answers</p>', 1)
                doc = doc[:pos] + block + doc[pos:]
        path.write_text(doc, encoding="utf-8")
    return report


def preview(unit, frags, notes_path, outdir):
    src = notes_path.read_text(encoding="utf-8")
    style = re.search(r"<style>(.*?)</style>", src, re.S).group(1)
    style = CSS_RE.sub("\n", style)
    body = [f"<h1 style='font-size:1.2rem'>{unit}</h1>"]
    for meta in frags:
        body.append(f"<h3 style='margin-top:2rem'>{meta['file'].name} · {html.escape(meta['section'])}</h3>")
        body.append("<div style='display:flex;gap:1.5rem;align-items:flex-start;flex-wrap:wrap'>")
        for ak in (False, True):
            body.append(f"<div style='flex:1;min-width:380px;border:1px dashed #ccc;padding:.5rem'>{figure(meta, ak)}</div>")
        body.append("</div>")
    out = outdir / f"{unit}.html"
    font_base = notes_path.parent.as_uri() + "/"
    out.write_text(f"<!doctype html><html><head><meta charset='utf-8'><base href='{font_base}'><style>{style}\n{CSS}\n"
                   f"body{{max-width:1300px}}</style></head><body>{''.join(body)}</body></html>", encoding="utf-8")
    return out


def main(argv):
    remove = "--remove" in argv
    outdir = None
    if "--preview" in argv:
        outdir = Path(argv[argv.index("--preview") + 1])
        outdir.mkdir(parents=True, exist_ok=True)
        argv = [a for a in argv if a not in ("--preview", str(outdir))]
    names = [a for a in argv if not a.startswith("--")] or list(UNITS)
    for unit in names:
        if unit not in UNITS:
            sys.exit(f"unknown unit {unit}; choose from {', '.join(UNITS)}")
        notes_path, ak_path = UNITS[unit]
        frag_dir = VIS / unit
        frags = [parse_fragment(p) for p in sorted(frag_dir.glob("*.html"))] if frag_dir.exists() else []
        if not frags and not remove:
            continue
        print(f"{unit}: {len(frags)} visuals")
        for line in apply(unit, frags, notes_path, ak_path, remove):
            print(line)
        if outdir and frags:
            print("  preview:", preview(unit, frags, notes_path, outdir))


if __name__ == "__main__":
    main(sys.argv[1:])
