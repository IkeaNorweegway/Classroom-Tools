#!/usr/bin/env python3
"""Render exit tickets, quizzes and unit tests (markdown) to printable HTML.

Sources:  tests-quizzes/**/*-exits-v1.md, *-quiz-v1.md, *-test-v1.md, and the
          matching answer keys (*-answers-v1.md).
Output:   public/materials/<same name>.html  (flat, like the course's other files)

Run from the repo root (Python 3, standard library only):
    python3 scripts/render_assessments.py                       # every source
    python3 scripts/render_assessments.py path/to/file.md ...   # just these

Handles: "# Title" (page title), "## Heading" (one section per ticket or part),
"**LO 1:** ..." lines, "**N.** question" lines, *italic*, **bold**, answer
lines made of underscores, and "---" dividers. HTML comments are dropped.
Anything else becomes a plain paragraph.

Not tested in the repo environment (no Python there when it was written):
run it once on one file and check the output in a browser before rendering all.
"""
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'materials'
SOURCES = [
    'tests-quizzes/*/*/*-exits-v1.md',
    'tests-quizzes/*/*/*-quiz-v1.md',
    'tests-quizzes/*/*/*-test-v1.md',
    'tests-quizzes/*/*/*-answers-v1.md',
]

# Accent for the page header: course colour, same family as the home practice sheets.
ACCENT = {
    'sci6': '#1d7486',
    'sci7': '#2e7d55',
    'soc8': '#8a4a78',
    'soc9': '#a6452f',
    'math9': '#4f46e5',
}

CSS = """
body { font-family: Georgia, 'Times New Roman', serif; font-size: 15px; line-height: 1.7;
       color: #1e293b; max-width: 820px; margin: 0 auto; padding: 2rem 1.5rem; background: #fff; }
h1 { font-family: system-ui, sans-serif; font-size: 1.6rem; color: #0f172a; margin-bottom: 0.25rem; }
.sub { font-family: system-ui, sans-serif; font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem; }
h2 { font-family: system-ui, sans-serif; font-size: 1rem; font-weight: 700; color: #fff;
     background: var(--accent); padding: 0.5rem 0.9rem; border-radius: 0.35rem; margin: 2rem 0 0.75rem; }
.lo { font-family: system-ui, sans-serif; font-size: 0.88rem; background: #f1f5f9;
      border-left: 4px solid var(--accent); padding: 0.5rem 0.8rem; margin: 0.5rem 0 1rem; }
.q { margin: 1rem 0 0.25rem; }
.ans { border-bottom: 1.5px solid #94a3b8; height: 1.8rem; margin: 0.3rem 0; }
hr { border: none; border-top: 1px dashed #cbd5e1; margin: 1.5rem 0; }
@media print { body { padding: 0; } h2 { break-before: auto; } .ticket { break-inside: avoid; } }
"""


def inline(text: str) -> str:
    """Escape, then turn **bold** and *italic* into tags."""
    s = html.escape(text, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'\*(.+?)\*', r'<em>\1</em>', s)
    return s


def strip_comments(text: str) -> str:
    return re.sub(r'<!--.*?-->', '', text, flags=re.S)


def render(md: str, key: str) -> str:
    accent = ACCENT.get(key, '#334155')
    lines = strip_comments(md).splitlines()
    title = ''
    body = []
    in_section = False

    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        if line.startswith('# '):
            title = line[2:].strip()
        elif line.startswith('## '):
            if in_section:
                body.append('</div>')
            body.append(f'<div class="ticket"><h2>{inline(line[3:].strip())}</h2>')
            in_section = True
        elif line == '---':
            body.append('<hr>')
        elif re.match(r'^\*\*LO\b', line):
            body.append(f'<p class="lo">{inline(line)}</p>')
        elif re.match(r'^\*\*\d+\.\*\*', line):
            body.append(f'<p class="q">{inline(line)}</p>')
        elif re.match(r'^_{5,}$', line) or re.match(r'^[_\s]+$', line):
            body.append('<div class="ans"></div>')
        else:
            body.append(f'<p>{inline(line)}</p>')
    if in_section:
        body.append('</div>')

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{html.escape(title)}</title>
<style>:root {{ --accent: {accent}; }}{CSS}</style>
</head>
<body>
<h1>{html.escape(title)}</h1>
{chr(10).join(body)}
</body>
</html>
"""


def sources(args):
    if args:
        return [Path(a).resolve() for a in args]
    found = []
    for pattern in SOURCES:
        found.extend(ROOT.glob(pattern))
    return sorted(found)


def main(argv):
    for src in sources(argv):
        # File names are sci6-matter-exits-v1.md, so the first part is the course key.
        key = src.name.split('-')[0]
        target = OUT / f'{src.stem}.html'
        target.write_text(render(src.read_text(encoding='utf-8'), key), encoding='utf-8')
        print(f'{src.relative_to(ROOT)} -> {target.relative_to(ROOT)}')


if __name__ == '__main__':
    main(sys.argv[1:])
