#!/usr/bin/env python3
"""
SVG Converter — converts inline style attributes to dg-* classes in-place.

Usage:
    python ".claude/skills/svg-audit/scripts/convert.py" path/to/notes.html [more.html ...]

Writes files in-place. Run the audit after each conversion to verify.
"""

import sys
import re
from pathlib import Path

# ── Style attributes to remove (moving to dg-* CSS classes) ─────────────────
STYLE_ATTRS = [
    'stroke', 'fill', 'stroke-width', 'stroke-dasharray',
    'stroke-linecap', 'stroke-linejoin', 'font-family', 'font-size',
]
# NOT in STYLE_ATTRS (semantic — keep on element): font-weight, font-style,
# text-anchor, dominant-baseline, cx, cy, r, x1, y1, x2, y2, d, points,
# viewBox, width, height, role, aria-label, marker-end, marker-start, id

ACCENT = '#1d4ed8'  # Math 9 blue (fallback — dg-accent already has this as CSS fallback)

ELEMENT_RE = re.compile(
    r'<(circle|line|path|polyline|polygon|rect|ellipse|text|tspan)\b([^>]*?)(\s*/?>)',
    re.IGNORECASE | re.DOTALL,
)

SVG_RE = re.compile(r'(<svg\b.*?</svg>)', re.DOTALL | re.IGNORECASE)


def get_attr(attrs, name):
    m = re.search(r'(?:^|\s)' + re.escape(name) + r'="([^"]*)"', attrs)
    return m.group(1).strip() if m else None


def remove_style_attrs(attrs):
    result = attrs
    for attr in STYLE_ATTRS:
        result = re.sub(r'\s*(?:^|\s)' + re.escape(attr) + r'="[^"]*"', ' ', result)
    return result.strip()


def classify(tag, attrs):
    """Return the dg-* class for this element based on its current attributes."""
    tag = tag.lower()
    stroke = get_attr(attrs, 'stroke')
    fill   = get_attr(attrs, 'fill')
    sw_s   = get_attr(attrs, 'stroke-width')
    dash   = get_attr(attrs, 'stroke-dasharray')
    fs_s   = get_attr(attrs, 'font-size')
    r_s    = get_attr(attrs, 'r')

    sw = float(sw_s) if sw_s else None
    fs = float(fs_s) if fs_s else None
    r  = float(r_s)  if r_s  else None

    # ── Circles ──────────────────────────────────────────────────────────────
    if tag == 'circle':
        if r is not None and r <= 5:
            # Small → point dot
            if fill and fill.lower() in (ACCENT, '#1d4ed8'):
                return 'dg-point-accent'
            return 'dg-point'
        # Large → shape boundary
        return 'dg-boundary'

    # ── Filled shapes ─────────────────────────────────────────────────────────
    if tag in ('polygon', 'rect', 'ellipse'):
        return 'dg-boundary'

    # ── Polylines ─────────────────────────────────────────────────────────────
    if tag == 'polyline':
        pts = get_attr(attrs, 'points') or ''
        # A right-angle mark is always exactly 3 coordinate pairs (6 numbers)
        nums = re.findall(r'[\d.]+', pts)
        if len(nums) == 6:
            return 'dg-right-angle'
        return 'dg-line'

    # ── Lines and paths ───────────────────────────────────────────────────────
    if tag in ('line', 'path'):
        has_fill = fill and fill.lower() not in ('none', '')
        has_stroke = bool(stroke)

        if has_fill and not has_stroke:
            # Fill-only (e.g. marker arrowhead path) → use stroke color via dg-point
            return 'dg-point'

        if has_fill and has_stroke:
            # Filled shape with outline → boundary
            return 'dg-boundary'

        # No fill or fill="none" — classify by stroke properties
        if stroke and stroke.lower() in (ACCENT, '#1d4ed8'):
            return 'dg-accent'

        if dash:
            # Has dasharray — construction (dashed guide) or dashed (medium secondary)
            if stroke and stroke.lower() in ('#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9'):
                return 'dg-construction'
            return 'dg-dashed'

        # Solid muted lines (no dasharray) → dg-grid: chart grids, tree branches, connectors
        if stroke and stroke.lower() in ('#94a3b8', '#cbd5e1', '#e2e8f0'):
            return 'dg-grid'

        if sw is not None and sw <= 0.8:
            return 'dg-grid'

        return 'dg-line'

    # ── Text ─────────────────────────────────────────────────────────────────
    if tag in ('text', 'tspan'):
        if fill and fill.lower() in (ACCENT, '#1d4ed8'):
            return 'dg-label-accent'
        if fill and fill.lower() in ('#475569', '#64748b', '#94a3b8'):
            return 'dg-label-sm'
        if fs is not None and fs <= 11:
            return 'dg-label-sm'
        return 'dg-label'

    return None


def convert_element(m):
    tag   = m.group(1)
    attrs = m.group(2)
    close = m.group(3)

    dg = classify(tag, attrs)
    if not dg:
        return m.group(0)  # Unknown — leave untouched

    clean = remove_style_attrs(attrs)
    # Insert class at front of attribute list
    new_attrs = f' class="{dg}"' + (' ' + clean if clean else '')

    return f'<{tag}{new_attrs}{close}'


def convert_svg_block(svg):
    return ELEMENT_RE.sub(convert_element, svg)


def convert_file(filepath):
    path = Path(filepath)
    if not path.exists():
        print(f"  ERROR: {filepath} not found")
        return 0
    text = path.read_text(encoding='utf-8')
    converted = SVG_RE.sub(lambda m: convert_svg_block(m.group(1)), text)
    if converted == text:
        print(f"  NO CHANGE: {path.name}")
        return 0
    lines_changed = sum(
        1 for a, b in zip(text.splitlines(), converted.splitlines()) if a != b
    )
    path.write_text(converted, encoding='utf-8')
    print(f"  CONVERTED: {path.name}  ({lines_changed} lines changed)")
    return lines_changed


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    for f in sys.argv[1:]:
        convert_file(f)


if __name__ == '__main__':
    main()
