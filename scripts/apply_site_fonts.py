#!/usr/bin/env python3
"""Give rendered materials the site fonts and print-safe contrast.

Rolls out the Grade 6 Forces pilot (commit eb66c95) to other HTML files:
- loads Atkinson Hyperlegible Next (body) and Fraunces (display) from
  public/fonts/, with system fallbacks so offline printing still works
- swaps CSS font stacks for var(--font-body) / var(--font-mono), and puts
  large h1/h2 headings in var(--font-display) at weight 600
- replaces the cool slate greys with the site's warm neutrals, darkens
  write-on lines so they survive a photocopier, and darkens 500/600 accent
  colours by one shade

Only CSS changes: <style> blocks and inline style attributes outside <svg>.
SVG presentation attributes are left alone. Files that already load the
site fonts are skipped, so it is safe to re-run.

Usage: python3 scripts/apply_site_fonts.py [--dry-run] FILE...
"""
import os
import re
import sys

MARKER = "Atkinson Hyperlegible Next"
FONTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "fonts")

HEADER = """  /* ── Fonts (site faces, shared from /fonts/; system fallbacks print fine offline) ── */
  @font-face {{ font-family: 'Atkinson Hyperlegible Next'; font-style: normal; font-weight: 200 800; font-display: swap; src: url('{p}atkinson-hyperlegible-next-latin-wght-normal.woff2') format('woff2-variations'); }}
  @font-face {{ font-family: 'Atkinson Hyperlegible Next'; font-style: italic; font-weight: 200 800; font-display: swap; src: url('{p}atkinson-hyperlegible-next-latin-wght-italic.woff2') format('woff2-variations'); }}
  @font-face {{ font-family: 'Fraunces'; font-style: normal; font-weight: 100 900; font-display: swap; src: url('{p}fraunces-latin-wght-normal.woff2') format('woff2-variations'); }}
  :root {{
    --font-body:    'Atkinson Hyperlegible Next', system-ui, -apple-system, 'Segoe UI', sans-serif;
    --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
    --font-mono:    Consolas, 'Courier New', monospace;
  }}
  body {{ font-kerning: normal; }}
  h1, h2, h3 {{ text-wrap: balance; }}
  p {{ text-wrap: pretty; }}

"""

# Slate/gray → warm neutrals (the pilot's tokens). Two maps: one for text,
# borders and strokes; a lighter one for backgrounds and fills.
INK, INK2, MUTED, RULE = "#1f1d1a", "#3f3b35", "#544f47", "#6b665d"
NEUTRAL_LINE = {
    "#0f172a": INK, "#111827": INK, "#1e293b": INK, "#1f2937": INK,
    "#334155": INK2, "#374151": INK2, "#475569": INK2, "#4b5563": INK2,
    "#64748b": MUTED, "#6b7280": MUTED,
    "#94a3b8": RULE, "#9ca3af": RULE,
    "#cbd5e1": "#b8b2a7", "#d1d5db": "#b8b2a7",
    "#e2e8f0": "#c9c4b9", "#e5e7eb": "#c9c4b9",
    "#f1f5f9": "#f4f2ed", "#f3f4f6": "#f4f2ed",
    "#f8fafc": "#faf9f6", "#f9fafb": "#faf9f6",
}
NEUTRAL_BG = dict(NEUTRAL_LINE)
NEUTRAL_BG.update({
    "#94a3b8": "#a39d92", "#9ca3af": "#a39d92",
    "#cbd5e1": "#d6d1c7", "#d1d5db": "#d6d1c7",
    "#e2e8f0": "#e9e6df", "#e5e7eb": "#e9e6df",
})
# Light greys that mark write-on lines when used as a bottom border.
LINE_GREYS = {"#94a3b8", "#9ca3af", "#cbd5e1", "#d1d5db"}

# Tailwind 500 → 600 and 600 → 700 (one shade darker, as in the pilot), for
# text colours and accent custom properties.
ACCENT_DARKER = {
    "#ef4444": "#dc2626", "#dc2626": "#b91c1c",  # red
    "#f97316": "#ea580c", "#ea580c": "#c2410c",  # orange
    "#f59e0b": "#d97706", "#d97706": "#b45309",  # amber
    "#eab308": "#ca8a04", "#ca8a04": "#a16207",  # yellow
    "#84cc16": "#65a30d", "#65a30d": "#4d7c0f",  # lime
    "#22c55e": "#16a34a", "#16a34a": "#15803d",  # green
    "#10b981": "#059669", "#059669": "#047857",  # emerald
    "#14b8a6": "#0d9488", "#0d9488": "#0f766e",  # teal
    "#06b6d4": "#0891b2", "#0891b2": "#0e7490",  # cyan
    "#0ea5e9": "#0284c7", "#0284c7": "#0369a1",  # sky
    "#3b82f6": "#2563eb", "#2563eb": "#1d4ed8",  # blue
    "#6366f1": "#4f46e5", "#4f46e5": "#4338ca",  # indigo
    "#8b5cf6": "#7c3aed", "#7c3aed": "#6d28d9",  # violet
    "#a855f7": "#9333ea", "#9333ea": "#7e22ce",  # purple
    "#d946ef": "#c026d3", "#c026d3": "#a21caf",  # fuchsia
    "#ec4899": "#db2777", "#db2777": "#be185d",  # pink
    "#f43f5e": "#e11d48", "#e11d48": "#be123c",  # rose
}

HEX = re.compile(r"#[0-9a-fA-F]{6}\b")
MONO = re.compile(r"monospace|courier|consolas", re.I)


def font_stack(value):
    """Map one font-family value to a site token, or None to leave it."""
    if "var(" in value:
        return None
    if MONO.search(value):
        return "var(--font-mono)"
    return "var(--font-body)"


def swap_hex(value, table):
    return HEX.sub(lambda m: table.get(m.group(0).lower(), m.group(0)), value)


def fix_decl(prop, value, stats):
    p = prop.strip().lower()
    v = value
    if p == "font-family":
        new = font_stack(v.strip())
        if new:
            v = " " + new
            stats["font"] += 1
    elif p == "font":
        # shorthand: "<size>[/<lh>] <family>" — replace the family part
        m = re.match(r"(\s*(?:[\w.%-]+\s+)*?[\d.]+(?:px|pt|rem|em|%)(?:/[\d.]+\w*)?\s+)(.+)$", v)
        if m and "var(" not in m.group(2):
            fam = font_stack(m.group(2))
            v = m.group(1) + fam
            stats["font"] += 1
    if p.startswith("--"):
        lp = p
        if any(k in lp for k in ("light", "bg", "pale", "soft", "tint", "wash")):
            new = swap_hex(v, NEUTRAL_BG)
        else:
            new = swap_hex(swap_hex(v, ACCENT_DARKER), NEUTRAL_LINE)
    elif p.startswith("background") or p == "fill":
        new = swap_hex(v, NEUTRAL_BG)
    elif p == "color":
        new = swap_hex(swap_hex(v, ACCENT_DARKER), NEUTRAL_LINE)
    elif p == "border-bottom" and any(g in v.lower() for g in LINE_GREYS):
        new = swap_hex(v, {g: RULE for g in LINE_GREYS})
        new = re.sub(r"(?<![\d.])1px\b", "1.25px", new)
        stats["lines"] += 1
    else:
        new = swap_hex(v, NEUTRAL_LINE)
    if new != v:
        stats["color"] += 1
    return new


def fix_decls(block, stats):
    out = []
    for part in re.split(r"(;)", block):
        if ":" in part and part != ";":
            prop, _, val = part.partition(":")
            out.append(prop + ":" + fix_decl(prop, val, stats))
        else:
            out.append(part)
    return "".join(out)


def is_display_heading(selector, decls):
    """Large h1/h2 rules get the display face; small uppercase labels don't."""
    sels = [s.strip() for s in selector.split(",")]
    if not any(re.search(r"(^|[\s>+~])h[12](?![\w-])[\w.#:-]*$", s) for s in sels):
        return False
    if not re.search(r"font-size|font-weight|font-family", decls):
        return False
    if re.search(r"text-transform:\s*uppercase", decls):
        return False
    m = re.search(r"font-size:\s*([\d.]+)(pt|rem|em|px)", decls)
    if m:
        n, u = float(m.group(1)), m.group(2)
        size_pt = {"pt": n, "rem": n * 12, "em": n * 12, "px": n * 0.75}[u]
        if size_pt < 11:
            return False
    return True


def fix_rule(m, stats):
    selector, decls = m.group(1), m.group(2)
    if selector.strip().startswith("@"):
        return m.group(0)
    decls = fix_decls(decls, stats)
    if is_display_heading(selector, decls):
        if "font-family" in decls:
            decls = re.sub(r"font-family:\s*[^;}]+", "font-family: var(--font-display)", decls)
        else:
            decls = " font-family: var(--font-display);" + decls
        decls = re.sub(r"font-weight:\s*(700|800|900|bold)", "font-weight: 600", decls)
        stats["display"] += 1
    return selector + "{" + decls + "}"


RULE_RE = re.compile(r"([^{}]+)\{([^{}]*)\}")


def fix_css(css, stats):
    return RULE_RE.sub(lambda m: fix_rule(m, stats), css)


def fix_inline_styles(html, stats):
    """Inline style="" attributes, skipping anything inside <svg>…</svg>."""
    pieces = re.split(r"(<svg\b.*?</svg>)", html, flags=re.S | re.I)
    for i in range(0, len(pieces), 2):
        pieces[i] = re.sub(
            r'(\bstyle=")([^"]*)(")',
            lambda m: m.group(1) + fix_decls(m.group(2), stats) + m.group(3),
            pieces[i])
    return "".join(pieces)


def process(path, dry):
    with open(path, encoding="utf-8") as f:
        html = f.read()
    if MARKER in html:
        return "skip (already has site fonts)"
    stats = {"font": 0, "display": 0, "color": 0, "lines": 0}

    # Inline styles first (outside <svg>), then every <style> block, which
    # may also live inside an <svg>.
    html = fix_inline_styles(html, stats)
    html = re.sub(r"(<style\b[^>]*>)(.*?)(</style>)",
                  lambda m: m.group(1) + fix_css(m.group(2), stats) + m.group(3),
                  html, flags=re.S | re.I)

    rel = os.path.relpath(os.path.abspath(FONTS_DIR), os.path.dirname(os.path.abspath(path)))
    header = HEADER.format(p=rel.replace(os.sep, "/") + "/")
    html, n = re.subn(r"(<style\b[^>]*>\n?)", lambda m: m.group(1) + header, html, count=1, flags=re.I)
    if not n:
        return "skip (no <style>)"
    if not dry:
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
    return "fonts {font}, display headings {display}, colours {color}, lines {lines}".format(**stats)


def main(argv):
    dry = "--dry-run" in argv
    files = [a for a in argv if not a.startswith("--")]
    for path in files:
        print(f"{path}: {process(path, dry)}")


if __name__ == "__main__":
    main(sys.argv[1:])
