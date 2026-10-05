#!/usr/bin/env python3
"""
SVG Diagram Review — renders SVGs to PNG and runs geometric checks.

Usage:
    python ".claude/skills/svg-diagram-review/scripts/review.py" path/to/notes.html

Each SVG in the file is:
  1. Rendered to a PNG in /tmp/svg-review/ for visual inspection
  2. Checked for legibility issues (font scale, bounds, overlap)
  3. Checked for correctness (geometry, label proximity, completeness)

Exit 0 = pass (may have INFO notices). Exit 1 = issues found. Exit 2 = file error.
"""

import sys
import re
import math
import tempfile
import os
from pathlib import Path
from xml.etree import ElementTree as ET

try:
    import cairosvg
    HAS_CAIRO = True
except ImportError:
    HAS_CAIRO = False

# ── Constants ────────────────────────────────────────────────────────────────
MIN_EFFECTIVE_FONT = 8.0      # px — below this, text is illegible when printed
LABEL_OVERLAP_THRESHOLD = 10  # px — two text anchors closer than this may overlap
POINT_DRIFT_TOLERANCE = 0.06  # fraction of radius — endpoint drift allowed before flagging
MIN_LABEL_RADIUS = 30         # px — labels this far from any shape may be orphaned

OUT_DIR = Path("/tmp/svg-review")


# ── SVG extraction ────────────────────────────────────────────────────────────
SVG_RE = re.compile(r'(<svg\b.*?</svg>)', re.DOTALL | re.IGNORECASE)
STYLE_RE = re.compile(r'<style[^>]*>(.*?)</style>', re.DOTALL | re.IGNORECASE)


def extract_svgs(html_text):
    return SVG_RE.findall(html_text)


def extract_css(html_text):
    """Extract all CSS from <style> blocks in the HTML page."""
    blocks = STYLE_RE.findall(html_text)
    return '\n'.join(blocks)


def resolve_css_vars(css):
    """
    Replace var(--name) with concrete values found in the same CSS.
    CairoSVG does not support CSS custom properties, so we inline them.
    """
    # Parse :root { --name: value } declarations
    var_map = {}
    for m in re.finditer(r'--([\w-]+)\s*:\s*([^;}\n]+)', css):
        var_map[m.group(1).strip()] = m.group(2).strip()

    # Resolve var(--name) — single-pass, no nested vars
    def replacer(m):
        name = m.group(1).strip()
        fallback = m.group(2).strip() if m.group(2) else None
        return var_map.get(name, fallback or m.group(0))

    resolved = re.sub(r'var\(--([^,)]+)(?:,\s*([^)]+))?\)', replacer, css)
    # Second pass for any vars that resolved to other vars
    resolved = re.sub(r'var\(--([^,)]+)(?:,\s*([^)]+))?\)', replacer, resolved)
    return resolved


# Fallback resolved CSS for dg-* classes (used when page CSS can't be extracted)
DG_CSS_RESOLVED = """
svg .dg-boundary, svg .dg-line, svg .dg-accent, svg .dg-grid,
svg .dg-dashed, svg .dg-right-angle, svg .dg-construction {
  vector-effect: non-scaling-stroke;
}
svg .dg-boundary     { stroke: #334155; fill: #f8fafc;  stroke-width: 1.5px; }
svg .dg-line         { stroke: #334155; fill: none;      stroke-width: 1.5px; }
svg .dg-accent       { stroke: #1d4ed8; fill: none;      stroke-width: 2.5px; }
svg .dg-dashed       { stroke: #64748b; fill: none;      stroke-width: 1.5px; stroke-dasharray: 5 3; }
svg .dg-right-angle  { stroke: #334155; fill: none;      stroke-width: 1.0px; }
svg .dg-construction { stroke: #94a3b8; fill: none;      stroke-width: 1.0px; stroke-dasharray: 2 3; }
svg .dg-grid         { stroke: #94a3b8; fill: none;      stroke-width: 1.0px; }
svg .dg-point        { fill: #334155;   stroke: none; }
svg .dg-point-accent { fill: #1d4ed8;   stroke: none; }
svg .dg-label        { font: 12px/1.3 system-ui, sans-serif; fill: #334155;  stroke: none; }
svg .dg-label-sm     { font: 11px/1.3 system-ui, sans-serif; fill: #64748b;  stroke: none; }
svg .dg-label-accent { font: 11px/1.3 system-ui, sans-serif; fill: #1d4ed8;  stroke: none; font-weight: 600; }
"""


def inject_css(svg_text, css):
    """
    Embed resolved CSS into the SVG as <defs><style>.
    Resolves custom properties first since CairoSVG doesn't support var().
    """
    if css:
        resolved = resolve_css_vars(css)
    else:
        resolved = DG_CSS_RESOLVED
    style_block = f'<defs><style><![CDATA[{resolved}]]></style></defs>'
    return re.sub(r'(<svg\b[^>]*>)', r'\1' + style_block, svg_text, count=1)


# ── ViewBox parsing ───────────────────────────────────────────────────────────
def parse_viewbox(svg_text):
    """Return (min_x, min_y, width, height) or None."""
    m = re.search(r'viewBox="([^"]+)"', svg_text)
    if not m:
        return None
    parts = re.split(r'[\s,]+', m.group(1).strip())
    if len(parts) != 4:
        return None
    try:
        return tuple(float(p) for p in parts)
    except ValueError:
        return None


def display_size(svg_text):
    """Return (display_w, display_h) from width/height attributes."""
    w = re.search(r'\bwidth="([^"]+)"', svg_text)
    h = re.search(r'\bheight="([^"]+)"', svg_text)
    try:
        dw = float(w.group(1)) if w else None
        dh = float(h.group(1)) if h else None
    except ValueError:
        dw = dh = None
    return dw, dh


# ── Geometry helpers ──────────────────────────────────────────────────────────
def dist(x1, y1, x2, y2):
    return math.sqrt((x2-x1)**2 + (y2-y1)**2)


def attr(el, name, default=None):
    v = el.get(name)
    if v is None:
        return default
    try:
        return float(v)
    except ValueError:
        return default


def parse_points(s):
    """Parse a points="..." string into [(x,y), ...]."""
    nums = list(map(float, re.findall(r'[-+]?\d*\.?\d+', s)))
    return [(nums[i], nums[i+1]) for i in range(0, len(nums)-1, 2)]


# ── Element parsing ───────────────────────────────────────────────────────────
NS = {'svg': 'http://www.w3.org/2000/svg'}

def parse_svg(svg_text):
    """Parse SVG text → ElementTree root."""
    try:
        return ET.fromstring(svg_text)
    except ET.ParseError:
        return None


def iter_children(root, tags):
    """Yield all descendant elements matching any tag (with or without namespace)."""
    for el in root.iter():
        tag = el.tag.split('}')[-1].lower()
        if tag in tags:
            yield tag, el


# ── Checks ────────────────────────────────────────────────────────────────────

def check_legibility(svg_text, vb, dw, dh):
    issues = []

    if vb is None:
        issues.append(('WARN', 'MISSING_VIEWBOX', 'No viewBox — diagram may not scale correctly'))
        return issues

    vb_w, vb_h = vb[2], vb[3]
    scale_x = (dw / vb_w) if dw and vb_w else 1.0
    scale_y = (dh / vb_h) if dh and vb_h else 1.0

    # Effective minimum dimension check
    effective_h = vb_h * scale_y
    if effective_h < 50:
        issues.append(('WARN', 'SVG_TOO_SHORT', f'Display height {effective_h:.0f}px — diagram will appear as a thin strip'))

    # Text elements: check effective font size and bounds
    # dg-label = 12px, dg-label-sm = 11px, dg-label-accent = 11px (defined in CSS)
    CLASS_FONT = {'dg-label': 12, 'dg-label-sm': 11, 'dg-label-accent': 11}
    root = parse_svg(svg_text)
    if root is None:
        issues.append(('ERROR', 'PARSE_ERROR', 'SVG could not be parsed'))
        return issues

    text_positions = []
    for tag, el in iter_children(root, ('text', 'tspan')):
        cls = el.get('class', '')
        font_px = CLASS_FONT.get(cls, 12)
        effective_font = font_px * scale_x
        if effective_font < MIN_EFFECTIVE_FONT:
            issues.append(('WARN', 'SMALL_FONT',
                f'<{tag} class="{cls}"> effective size {effective_font:.1f}px at display width '
                f'{dw}px — may be unreadable when printed'))

        x = attr(el, 'x', 0)
        y = attr(el, 'y', 0)
        text_positions.append((x, y, el.get('class', ''), el.text or ''))

        margin = 15
        if x < vb[0] - margin or x > vb[0] + vb_w + margin:
            issues.append(('WARN', 'TEXT_OUTSIDE_BOUNDS',
                f'Text "{el.text}" at x={x} is outside viewBox width ({vb[0]}–{vb[0]+vb_w})'))
        if y < vb[1] - margin or y > vb[1] + vb_h + margin:
            issues.append(('WARN', 'TEXT_OUTSIDE_BOUNDS',
                f'Text "{el.text}" at y={y} is outside viewBox height ({vb[1]}–{vb[1]+vb_h})'))

    # Label overlap detection (approximate — uses anchor points only)
    for i in range(len(text_positions)):
        for j in range(i+1, len(text_positions)):
            x1, y1, _, t1 = text_positions[i]
            x2, y2, _, t2 = text_positions[j]
            if dist(x1, y1, x2, y2) < LABEL_OVERLAP_THRESHOLD:
                issues.append(('WARN', 'LABEL_OVERLAP',
                    f'Text "{t1}" and "{t2}" anchor points are {dist(x1,y1,x2,y2):.1f}px apart — may overlap'))

    # Coordinate bounds check for geometric elements
    for tag, el in iter_children(root, ('line', 'circle', 'rect')):
        coords = []
        if tag == 'line':
            for a in ('x1','y1','x2','y2'):
                v = attr(el, a)
                if v is not None:
                    coords.append((v, a))
        elif tag == 'circle':
            cx, cy, r = attr(el,'cx',0), attr(el,'cy',0), attr(el,'r',0)
            coords = [(cx - r, 'cx-r'), (cx + r, 'cx+r'), (cy - r, 'cy-r'), (cy + r, 'cy+r')]

        for v, name in coords:
            if name in ('x1','x2','cx-r','cx+r'):
                if v < vb[0] - 5 or v > vb[0] + vb_w + 5:
                    issues.append(('WARN', 'ELEMENT_OUTSIDE_BOUNDS',
                        f'<{tag}> {name}={v:.1f} exceeds viewBox x-range ({vb[0]}–{vb[0]+vb_w})'))
            else:
                if v < vb[1] - 5 or v > vb[1] + vb_h + 5:
                    issues.append(('WARN', 'ELEMENT_OUTSIDE_BOUNDS',
                        f'<{tag}> {name}={v:.1f} exceeds viewBox y-range ({vb[1]}–{vb[1]+vb_h})'))

    return issues


def check_correctness(svg_text, vb):
    issues = []
    root = parse_svg(svg_text)
    if root is None:
        return issues

    # Find all circles (boundary circles — large, not points)
    boundary_circles = []
    for tag, el in iter_children(root, ('circle',)):
        r = attr(el, 'r', 0)
        cls = el.get('class', '')
        if 'dg-boundary' in cls and r > 10:
            boundary_circles.append((attr(el,'cx',0), attr(el,'cy',0), r))

    # Check: dg-accent lines — each endpoint tested against its NEAREST boundary
    # circle only. Skipped if diagram has >1 boundary circle (multi-circle diagrams
    # like central/inscribed angle side-by-side have intentional cross-circle lines).
    if len(boundary_circles) == 1:
        cx, cy, r = boundary_circles[0]
        for tag, el in iter_children(root, ('line',)):
            cls = el.get('class', '')
            if 'dg-accent' not in cls:
                continue
            for px, py in [(attr(el,'x1'), attr(el,'y1')), (attr(el,'x2'), attr(el,'y2'))]:
                if px is None or py is None:
                    continue
                d = dist(px, py, cx, cy)
                if d > r * 1.25:
                    issues.append(('INFO', 'ENDPOINT_OUTSIDE_CIRCLE',
                        f'<line class="dg-accent"> endpoint ({px:.1f},{py:.1f}) is {d:.1f}px '
                        f'from circle centre (radius {r:.1f}) — may extend outside diagram'))

    # Check: right-angle polylines — the two segments should be approximately perpendicular
    for tag, el in iter_children(root, ('polyline',)):
        cls = el.get('class', '')
        if 'dg-right-angle' not in cls:
            continue
        pts_str = el.get('points', '')
        pts = parse_points(pts_str)
        if len(pts) == 3:
            ax, ay = pts[0][0]-pts[1][0], pts[0][1]-pts[1][1]
            bx, by = pts[2][0]-pts[1][0], pts[2][1]-pts[1][1]
            dot = ax*bx + ay*by
            mag = math.sqrt(ax**2+ay**2) * math.sqrt(bx**2+by**2)
            if mag > 0:
                angle = math.degrees(math.acos(max(-1, min(1, dot/mag))))
                if abs(angle - 90) > 10:
                    issues.append(('WARN', 'RIGHT_ANGLE_NOT_PERPENDICULAR',
                        f'Right-angle mark segments meet at {angle:.1f}° (expected 90°)'))

    # Check: labels near something — orphaned text
    text_elements = [(attr(el,'x',0), attr(el,'y',0), el.text or '')
                     for tag, el in iter_children(root, ('text',))
                     if el.get('class','') in ('dg-label','dg-label-accent')]

    # Collect segments and point coords for proximity check
    shape_segments = []  # (x1,y1,x2,y2)
    shape_points = []    # (x,y)
    for tag, el in iter_children(root, ('circle','line','polyline')):
        if tag == 'circle':
            shape_points.append((attr(el,'cx',0), attr(el,'cy',0)))
        elif tag == 'line':
            x1,y1 = attr(el,'x1',0), attr(el,'y1',0)
            x2,y2 = attr(el,'x2',0), attr(el,'y2',0)
            shape_segments.append((x1,y1,x2,y2))

    def point_to_segment_dist(px, py, x1, y1, x2, y2):
        """Minimum distance from (px,py) to segment (x1,y1)-(x2,y2)."""
        dx, dy = x2-x1, y2-y1
        if dx == dy == 0:
            return dist(px, py, x1, y1)
        t = max(0, min(1, ((px-x1)*dx + (py-y1)*dy) / (dx*dx + dy*dy)))
        return dist(px, py, x1+t*dx, y1+t*dy)

    for tx, ty, text in text_elements:
        if not shape_segments and not shape_points:
            continue
        seg_dists = [point_to_segment_dist(tx, ty, *s) for s in shape_segments]
        pt_dists  = [dist(tx, ty, px, py) for px, py in shape_points]
        closest = min(seg_dists + pt_dists) if (seg_dists or pt_dists) else 999
        if closest > MIN_LABEL_RADIUS:
            issues.append(('INFO', 'LABEL_FAR_FROM_SHAPE',
                f'Label "{text}" at ({tx:.0f},{ty:.0f}) is {closest:.0f}px from nearest shape element — may be orphaned'))

    # Completeness: centre label check for diagrams with boundary circles
    if boundary_circles:
        has_centre_label = any(
            el.text and el.text.strip().upper() in ('O', 'C', 'CENTER', 'CENTRE')
            for tag, el in iter_children(root, ('text',))
        )
        has_centre_point = any(
            attr(el,'r',0) <= 4 and 'dg-point' in el.get('class','')
            for tag, el in iter_children(root, ('circle',))
        )
        if not has_centre_label and not has_centre_point:
            issues.append(('INFO', 'MISSING_CENTRE',
                'Circle diagram has no centre label (O) or centre point marker'))

    return issues


# ── Rendering ─────────────────────────────────────────────────────────────────

def render_svg(svg_text, out_path, css='', scale=2):
    """Render SVG text to PNG at 2× scale for clarity. Injects page CSS so dg-* classes resolve."""
    if not HAS_CAIRO:
        return False
    try:
        styled = inject_css(svg_text, css)
        cairosvg.svg2png(
            bytestring=styled.encode('utf-8'),
            write_to=str(out_path),
            scale=scale,
        )
        return True
    except Exception as e:
        return str(e)


# ── Main ──────────────────────────────────────────────────────────────────────

def review_file(filepath):
    path = Path(filepath)
    if not path.exists():
        print(f'ERROR: {filepath} not found')
        return 2

    html = path.read_text(encoding='utf-8')
    svgs = extract_svgs(html)
    css = extract_css(html)

    stem = path.stem
    out_dir = OUT_DIR / stem
    out_dir.mkdir(parents=True, exist_ok=True)

    total_issues = 0

    print()
    print('═' * 68)
    print(f'  SVG Review: {path.name}')
    print('═' * 68)
    print(f'  SVGs found: {len(svgs)}')
    if not svgs:
        print('  No SVGs — nothing to review.')
        print()
        return 0

    print(f'  PNG output: {out_dir}/')
    print()

    for i, svg in enumerate(svgs, 1):
        vb = parse_viewbox(svg)
        dw, dh = display_size(svg)

        leg_issues = check_legibility(svg, vb, dw, dh)
        cor_issues = check_correctness(svg, vb)
        all_issues = leg_issues + cor_issues

        # Render
        png_path = out_dir / f'svg-{i:02d}.png'
        render_result = render_svg(svg, png_path, css=css)

        print(f'  ── SVG {i} ', end='')
        if vb:
            print(f'(viewBox {vb[0]:.0f} {vb[1]:.0f} {vb[2]:.0f} {vb[3]:.0f}', end='')
            if dw:
                print(f', display {dw:.0f}×{dh:.0f}', end='')
            print(')', end='')
        print()

        if render_result is True:
            print(f'     PNG → {png_path}')
        elif render_result is False:
            print('     PNG → (CairoSVG not available — geometric checks only)')
        else:
            print(f'     PNG → RENDER FAILED: {render_result}')

        if not all_issues:
            print('     ✓  No issues')
        else:
            total_issues += len(all_issues)
            for severity, code, msg in all_issues:
                icon = '✗' if severity == 'ERROR' else ('⚠' if severity == 'WARN' else 'ℹ')
                print(f'     {icon}  [{severity}/{code}] {msg}')
        print()

    print('═' * 68)
    if total_issues == 0:
        print('  PASS — no issues detected.')
    else:
        print(f'  {total_issues} issue(s) found. Review PNGs and fix flagged items.')
    print('═' * 68)
    print()
    return 1 if total_issues > 0 else 0


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    worst = 0
    for f in sys.argv[1:]:
        code = review_file(f)
        worst = max(worst, code)
    sys.exit(worst)


if __name__ == '__main__':
    main()
