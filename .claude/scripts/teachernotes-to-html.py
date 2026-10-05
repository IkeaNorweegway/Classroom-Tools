#!/usr/bin/env python3
"""Convert Math 9 teacher notes .md files to self-contained HTML.

Usage:
    python teachernotes-to-html.py path/to/file.md [...]
    python teachernotes-to-html.py --all-math9

Output: .html file alongside each .md file.
"""

import subprocess
import re
import sys
from pathlib import Path

# ── CSS ──────────────────────────────────────────────────────────────────────

CSS = """
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --accent: #1d4ed8;
  --accent-light: #eff6ff;
  --accent-border: #bfdbfe;
  --show-bg: #eff6ff;
  --show-border: #3b82f6;
  --say-bg: #ffffff;
  --cue-bg: #f0fdf4;
  --cue-border: #22c55e;
  --flag-mc-bg: #fef2f2;
  --flag-mc-border: #ef4444;
  --flag-mc-label: #dc2626;
  --flag-pace-bg: #fffbeb;
  --flag-pace-border: #f59e0b;
  --flag-pace-label: #d97706;
  --flag-ab-bg: #f0fdf4;
  --flag-ab-border: #22c55e;
  --flag-ab-label: #15803d;
  --flag-cs-bg: #fdf4ff;
  --flag-cs-border: #a855f7;
  --flag-cs-label: #7e22ce;
  --text: #1a1a2e;
  --muted: #6b7280;
  --border: #e5e7eb;
}

body {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 15px;
  line-height: 1.65;
  color: var(--text);
  max-width: 840px;
  margin: 0 auto;
  padding: 28px 24px 48px;
}

/* ── Typography ── */
h1 {
  font-size: 1.6rem;
  color: var(--accent);
  margin-bottom: 2px;
  font-family: system-ui, sans-serif;
}
h2 {
  font-size: 1rem;
  font-family: system-ui, sans-serif;
  font-weight: 700;
  background: var(--accent);
  color: white;
  padding: 7px 14px;
  margin: 36px -4px 18px;
  letter-spacing: 0.01em;
}
h3 {
  font-size: 0.95rem;
  font-family: system-ui, sans-serif;
  font-weight: 600;
  color: var(--accent);
  border-bottom: 2px solid var(--accent-border);
  padding-bottom: 4px;
  margin: 28px 0 12px;
}
h4 {
  font-size: 0.9rem;
  font-family: system-ui, sans-serif;
  font-weight: 600;
  color: #374151;
  margin: 20px 0 8px;
}
p { margin-bottom: 10px; }
ul, ol { margin: 6px 0 10px 24px; }
li { margin-bottom: 3px; }
em { font-style: italic; }
strong { font-weight: 700; }
hr { border: none; border-top: 1px solid var(--border); margin: 20px 0; }

/* ── Beat titles ── */
p.beat-title {
  font-family: system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  background: #f1f5f9;
  color: #334155;
  padding: 7px 14px;
  margin: 20px 0 0;
  border-left: 4px solid #94a3b8;
  border-radius: 3px 3px 0 0;
}

/* ── SHOW / SAY / CUE labels ── */
.show-label { color: var(--accent); font-family: system-ui, sans-serif; }
.say-label  { color: #374151;       font-family: system-ui, sans-serif; }
.cue-label  { color: #15803d;       font-family: system-ui, sans-serif; }

/* ── Flag callouts ── */
.flag {
  margin: 14px 0;
  padding: 10px 14px;
  border-radius: 0 4px 4px 0;
  font-family: system-ui, sans-serif;
  font-size: 0.88rem;
  line-height: 1.5;
}
.flag-label {
  font-weight: 700;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: block;
  margin-bottom: 4px;
}
.flag p { margin-bottom: 6px; font-family: system-ui, sans-serif; }
.flag p:last-child { margin-bottom: 0; }
.flag ul { margin-top: 4px; }

.flag-misconception { background: var(--flag-mc-bg);   border-left: 5px solid var(--flag-mc-border); }
.flag-misconception .flag-label { color: var(--flag-mc-label); }

.flag-pacing       { background: var(--flag-pace-bg);  border-left: 5px solid var(--flag-pace-border); }
.flag-pacing .flag-label { color: var(--flag-pace-label); }

.flag-alberta-context,
.flag-alberta,
.flag-context      { background: var(--flag-ab-bg);   border-left: 5px solid var(--flag-ab-border); }
.flag-alberta-context .flag-label,
.flag-alberta .flag-label,
.flag-context .flag-label { color: var(--flag-ab-label); }

.flag-cs-connection,
.flag-connection   { background: var(--flag-cs-bg);   border-left: 5px solid var(--flag-cs-border); }
.flag-cs-connection .flag-label,
.flag-connection .flag-label { color: var(--flag-cs-label); }

/* ── Retrieval guide box ── */
.retrieval-guide {
  background: var(--accent-light);
  border: 1px solid var(--accent-border);
  border-radius: 6px;
  padding: 14px 18px;
  margin: 16px 0;
}
.retrieval-guide h3 { margin-top: 0; color: var(--accent); border-color: var(--accent-border); }
.retrieval-guide ol { margin-left: 20px; }
.retrieval-guide li { margin-bottom: 6px; font-family: system-ui, sans-serif; font-size: 0.9rem; }

/* ── Tables ── */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 14px 0;
  font-size: 0.88rem;
  font-family: system-ui, sans-serif;
}
th {
  background: var(--accent);
  color: white;
  padding: 8px 12px;
  text-align: left;
  font-weight: 600;
}
td {
  padding: 7px 12px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}
tr:nth-child(even) td { background: #f8fafc; }

/* ── Answer key ── */
.answer-key h3 { color: #374151; border-color: #d1d5db; }

/* ── Subtitle / subheading below h1 ── */
.subtitle {
  font-family: system-ui, sans-serif;
  font-size: 0.9rem;
  color: var(--muted);
  margin-bottom: 4px;
}

/* ── Print ── */
@media print {
  body { max-width: none; padding: 10px; font-size: 11.5px; }
  h2 { break-before: page; margin-left: 0; margin-right: 0; }
  h2:first-of-type { break-before: auto; }
  .flag, .retrieval-guide, table { break-inside: avoid; }
  h3, h4, p.beat-title { break-after: avoid; }
  p { orphans: 3; widows: 3; }
}
"""

# ── HTML template ─────────────────────────────────────────────────────────────

TEMPLATE = """\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <style>{css}</style>
</head>
<body>
{body}
</body>
</html>"""

# ── Conversion ────────────────────────────────────────────────────────────────

def flag_css_class(flag_type: str) -> str:
    """Convert flag type string to CSS class name."""
    return 'flag-' + re.sub(r'[^a-z0-9]+', '-', flag_type.lower()).strip('-')


def convert(md_path: Path, html_path: Path):
    # 1. Convert markdown → HTML fragment via pandoc
    result = subprocess.run(
        ['pandoc', '--from=markdown+smart', '--to=html', str(md_path)],
        capture_output=True, text=True, check=True
    )
    html = result.stdout

    # 2. Convert FLAG blockquotes → styled divs
    #    Pandoc renders: <blockquote>\n<p><strong>FLAG — Type:</strong> content</p>\n</blockquote>
    #    Also handles multi-paragraph blockquotes.
    def replace_flag(m):
        flag_type = m.group(1).strip()
        inner = m.group(2).strip()
        css = flag_css_class(flag_type)
        return (
            f'<div class="flag {css}">'
            f'<span class="flag-label">FLAG — {flag_type}</span>'
            f'{inner}'
            f'</div>'
        )

    # Single-paragraph flags
    html = re.sub(
        r'<blockquote>\s*<p><strong>FLAG\s*[—–-]\s*([^<:]+?)(?::)?</strong>\s*(.*?)</p>\s*</blockquote>',
        replace_flag,
        html,
        flags=re.DOTALL
    )
    # Multi-paragraph flags (flag label in first <p>, rest follows)
    html = re.sub(
        r'<blockquote>\s*<p><strong>FLAG\s*[—–-]\s*([^<:]+?)(?::)?</strong>\s*(.*?)</blockquote>',
        lambda m: (
            f'<div class="flag {flag_css_class(m.group(1).strip())}">'
            f'<span class="flag-label">FLAG — {m.group(1).strip()}</span>'
            f'<p>{m.group(2).strip()}</p>'
            f'</div>'
        ),
        html,
        flags=re.DOTALL
    )

    # 3. Style SHOW / SAY / CUE labels
    html = re.sub(r'<strong>(SHOW):</strong>', r'<strong class="show-label">\1:</strong>', html)
    html = re.sub(r'<strong>(SAY):</strong>',  r'<strong class="say-label">\1:</strong>',  html)
    html = re.sub(r'<strong>(CUE):</strong>',  r'<strong class="cue-label">\1:</strong>',  html)

    # 4. Mark beat title paragraphs (pandoc renders **Beat 1 — Name** as <p><strong>Beat 1 — Name</strong></p>)
    html = re.sub(
        r'<p><strong>(Beat \d+[^<]*)</strong></p>',
        r'<p class="beat-title"><strong>\1</strong></p>',
        html
    )

    # 5. Wrap retrieval check sections in a styled box
    #    Find <h3> containing "Retrieval Check" and wrap the following <ol> in .retrieval-guide
    html = re.sub(
        r'(<h3[^>]*>[^<]*Retrieval Check[^<]*</h3>\s*)(<ol>.*?</ol>)',
        r'<div class="retrieval-guide">\1\2</div>',
        html,
        flags=re.DOTALL
    )

    # 6. Extract title from <h1>
    title_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL)
    if title_match:
        title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip()
    else:
        title = md_path.stem.replace('-', ' ').title()

    # 7. Promote h2 "Teacher Notes Package" to subtitle
    html = html.replace(
        '<h2>Teacher Notes Package</h2>',
        '<p class="subtitle">Teacher Notes Package</p>'
    )

    # 8. Wrap in full HTML template
    full_html = TEMPLATE.format(title=title, css=CSS, body=html)
    html_path.write_text(full_html, encoding='utf-8')
    print(f"  ✓  {html_path.name}")


# ── Entry point ───────────────────────────────────────────────────────────────

def main():
    args = sys.argv[1:]

    if '--all-math9' in args:
        base = Path(__file__).parent.parent.parent / 'notes-packages' / 'math-9'
        md_files = sorted(base.rglob('*teachernotes*.md'))
    else:
        md_files = [Path(a) for a in args if a.endswith('.md')]

    if not md_files:
        print("Usage: teachernotes-to-html.py file.md [file2.md ...] | --all-math9")
        sys.exit(1)

    print(f"Converting {len(md_files)} file(s)...")
    errors = []
    for md in md_files:
        html_path = md.with_suffix('.html')
        try:
            convert(md, html_path)
        except subprocess.CalledProcessError as e:
            print(f"  ✗  {md.name}: pandoc error — {e.stderr[:120]}")
            errors.append(md.name)
        except Exception as e:
            print(f"  ✗  {md.name}: {e}")
            errors.append(md.name)

    if errors:
        print(f"\n{len(errors)} error(s): {', '.join(errors)}")
        sys.exit(1)
    else:
        print(f"\nDone — {len(md_files)} HTML file(s) written.")


if __name__ == '__main__':
    main()
