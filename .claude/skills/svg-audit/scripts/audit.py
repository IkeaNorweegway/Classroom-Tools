#!/usr/bin/env python3
"""
SVG Audit — checks HTML notes packages for dg-* class compliance.

Usage:
    python ".claude/skills/svg-audit/scripts/audit.py" path/to/notes.html [more.html ...]

Exit codes:
    0 = all checks pass (warnings OK)
    1 = violations found (must fix)
    2 = file not found or parse error
"""

import sys
import re
from pathlib import Path

# ── Config ───────────────────────────────────────────────────────────────────

# Inline attributes that must NOT appear on SVG child elements
# (visual styling belongs in dg-* CSS classes)
BANNED_ATTRS = [
    'stroke',
    'fill',
    'stroke-width',
    'stroke-dasharray',
    'stroke-linecap',
    'stroke-linejoin',
    'font-family',
    'font-size',
]

# SVG child elements to inspect (not the <svg> container itself)
SVG_ELEMENTS = [
    'circle', 'line', 'path', 'polyline', 'polygon',
    'rect', 'ellipse', 'text', 'tspan',
]

# ── Compiled patterns ─────────────────────────────────────────────────────────

ELEMENT_RE = re.compile(
    r'<(' + '|'.join(SVG_ELEMENTS) + r')\b([^>]*?)(?:/>|>)',
    re.IGNORECASE | re.DOTALL,
)

TIKZ_RE = re.compile(r'<!--\s*tikz\s*:', re.IGNORECASE)
SVG_OPEN_RE = re.compile(r'<svg\b', re.IGNORECASE)
SVG_CLOSE_RE = re.compile(r'</svg\s*>', re.IGNORECASE)


def has_banned_attr(attr_string: str, attr_name: str) -> bool:
    """True if attr_name appears as a standalone attribute (not part of a longer name)."""
    # Matches whitespace (or start), then the attribute name, then optional whitespace, then =
    return bool(re.search(
        r'(?:^|\s)' + re.escape(attr_name) + r'\s*=',
        attr_string,
    ))


def audit_file(filepath: str) -> int:
    path = Path(filepath)
    if not path.exists():
        print(f"\nERROR: File not found: {filepath}\n")
        return 2

    text = path.read_text(encoding='utf-8')
    lines = text.splitlines()

    violations = []
    warnings = []

    # ── Check 1: dg-* CSS block present ──────────────────────────────────────
    style_match = re.search(r'<style[^>]*>(.*?)</style>', text, re.DOTALL | re.IGNORECASE)
    css_content = style_match.group(1) if style_match else ''
    if 'dg-boundary' not in css_content and 'dg-accent' not in css_content:
        violations.append({
            'line': None,
            'type': 'MISSING_DG_CSS',
            'msg': 'No dg-* classes found in <style> block',
            'fix': 'Copy the CSS snippet from notes-packages/_svg-classes.md into the <style> block',
        })

    # ── Check 2: Per-SVG block checks ────────────────────────────────────────
    svg_count = 0
    in_svg = False
    svg_start_idx = 0       # 0-indexed line index
    svg_lines_buf = []

    for i, line in enumerate(lines):
        if not in_svg:
            if SVG_OPEN_RE.search(line):
                in_svg = True
                svg_start_idx = i
                svg_lines_buf = [line]
                svg_count += 1

                # tikz comment: look back up to 3 lines before the <svg>
                lookback = lines[max(0, i - 3):i]
                if not any(TIKZ_RE.search(ln) for ln in lookback):
                    warnings.append({
                        'line': i + 1,
                        'type': 'MISSING_TIKZ_COMMENT',
                        'msg': f'SVG at line {i + 1} has no preceding <!-- tikz: ... --> comment',
                        'fix': 'Add <!-- tikz: pattern-name | key=value --> on the line before <svg>',
                    })
        else:
            svg_lines_buf.append(line)
            if SVG_CLOSE_RE.search(line):
                in_svg = False
                svg_block = '\n'.join(svg_lines_buf)

                # Strip the <svg ...> opening tag before inspecting child elements
                svg_inner = re.sub(
                    r'^<svg\b[^>]*>',
                    '',
                    svg_block,
                    count=1,
                    flags=re.IGNORECASE | re.DOTALL,
                )

                for m in ELEMENT_RE.finditer(svg_inner):
                    tag = m.group(1).lower()
                    attrs = m.group(2)

                    # Approximate line number within the file
                    newlines_before = svg_inner[:m.start()].count('\n')
                    elem_lineno = svg_start_idx + 1 + newlines_before  # 1-indexed

                    for banned in BANNED_ATTRS:
                        if has_banned_attr(attrs, banned):
                            snippet = m.group(0).strip()
                            if len(snippet) > 90:
                                snippet = snippet[:87] + '...'
                            violations.append({
                                'line': elem_lineno,
                                'type': 'INLINE_STYLE',
                                'msg': f'<{tag}> has inline `{banned}` attribute',
                                'context': snippet,
                                'fix': f'Remove `{banned}="..."` and apply the appropriate dg-* class',
                            })

                svg_lines_buf = []

    # ── Report ────────────────────────────────────────────────────────────────
    width = 64
    print(f"\n{'═' * width}")
    print(f"  SVG Audit: {path.name}")
    print(f"{'═' * width}")
    print(f"  SVGs found:  {svg_count}")
    print(f"  Violations:  {len(violations)}")
    print(f"  Warnings:    {len(warnings)}")

    if violations:
        print(f"\n{'─' * width}")
        print("  VIOLATIONS — must fix before marking complete:\n")
        for v in violations:
            loc = f"line {v['line']}" if v['line'] else "file-level"
            print(f"  ✗  [{v['type']}] {loc}")
            print(f"     {v['msg']}")
            if 'context' in v:
                print(f"     → {v['context']}")
            print(f"     Fix: {v['fix']}")
            print()

    if warnings:
        print(f"{'─' * width}")
        print("  WARNINGS — recommended (required for PDF build):\n")
        for w in warnings:
            loc = f"line {w['line']}" if w['line'] else "file-level"
            print(f"  ⚠  [{w['type']}] {loc}")
            print(f"     {w['msg']}")
            print(f"     Fix: {w['fix']}")
            print()

    if not violations and not warnings:
        print(f"\n  ✓  All checks passed\n")

    print(f"{'═' * width}\n")
    return 1 if violations else 0


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)

    exit_code = 0
    for filepath in sys.argv[1:]:
        code = audit_file(filepath)
        exit_code = max(exit_code, code)

    sys.exit(exit_code)


if __name__ == '__main__':
    main()
