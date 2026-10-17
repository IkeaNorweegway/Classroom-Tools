#!/usr/bin/env python3
"""Render Math 9 inquiry project markdown (brief, journal, teacher guide) to HTML.

Sources use pandoc markdown: fenced divs (::: {.class}) and bracketed spans
([text]{.class}) become the classes styled below. Front matter `style:` picks
the look:
  student  ->  CSS copied from the Algebra strand workbook (site fonts, q-card style)
  teacher  ->  CSS copied from the Linear Relations teacher notes v2 (SHOW/SAY/CUE)
Both get the PROJECT_CSS block on top.

Run from the repo root (needs pandoc on the PATH):
    python3 scripts/render_math9_projects.py                # every project file
    python3 scripts/render_math9_projects.py path/to/x.md   # just these

Output goes to public/materials/math-9/worksheets/<strand>/<same stem>.html.
Teacher guides live in notes-packages/math-9/<strand>/ but render beside the
brief so all three project files sit in one folder. Run stack_fractions.py on
the output afterwards.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'materials' / 'math-9' / 'worksheets'
SOURCES = ['worksheets/math-9/*/math9-*-project*-v*.md',
           'notes-packages/math-9/*/math9-*-project-teacherguide-v*.md']
CSS_FROM = {
    'student': OUT / 'algebra' / 'math9-algebra-workbook-v1.html',
    'teacher': ROOT / 'public/materials/math-9/notes/linear-relations/math9-linear-relations-teachernotes-v2.html',
}

PROJECT_CSS = """
  /* ── Inquiry project additions (scripts/render_math9_projects.py) ── */
  .subtitle { display: block; font-size: 0.82rem; color: #3f3b35; margin: 0.2rem 0 0.5rem; }
  .option-card { border: 1.5px solid var(--unit-border); border-radius: 0.6rem; padding: 1.1rem 1.25rem 0.6rem; margin: 1.75rem 0; }
  .option-header { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.4rem; }
  .option-header h2 { flex-basis: 100%; margin: 0.35rem 0 0; font-size: 1.25rem; }
  .badge-ab { background: #dcfce7; color: #166534; }
  .data-card { background: #faf9f6; border: 1px dashed #b8b2a7; border-radius: 0.4rem; padding: 0.7rem 1rem; margin: 0.75rem 0; font-size: 0.9rem; }
  .data-card p { margin-bottom: 0.45rem; }
  .data-card p:last-child { margin-bottom: 0; }
  .stretch-card { border: 1px solid #1f1d1a; border-radius: 0.5rem; margin: 0.75rem 0; }
  .milestone { display: flex; align-items: center; gap: 0.6rem; font-family: var(--font-display); font-size: 1.15rem;
               border-bottom: 2px solid var(--unit-border); padding-bottom: 0.35rem; margin: 0.5rem 0 1rem; }
  .milestone p { margin: 0; display: flex; align-items: center; gap: 0.6rem; }
  .graph-grid { height: 300px; border: 1.5px solid #6b665d; margin: 0.5rem 0 1rem;
                background-image: linear-gradient(#d6d1c7 1px, transparent 1px), linear-gradient(90deg, #d6d1c7 1px, transparent 1px);
                background-size: 20px 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .work-box.tall { min-height: 150px; }
  .own-box { background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 0.6rem; padding: 1rem 1.25rem; margin: 1.5rem 0; font-size: 0.9rem; }
  .own-box .meta-title { color: #0369a1; }
  .check-row { border-top: 1px dashed var(--line); padding-top: 0.5rem; margin-top: 1rem; font-size: 0.85rem; color: var(--muted); }
  .check-label { font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.72rem; color: var(--unit-dark); margin-right: 0.5rem; }
  ul.task-list { list-style: none; padding-left: 0.25rem; }
  table td:empty { height: 2.2rem; }
  @media print { .page-break { break-after: page; page-break-after: always; }
                 .option-card { break-inside: auto; } .graph-grid, .own-box, .data-card { break-inside: avoid; } }
"""

TEACHER_CSS = """
  /* ── Inquiry project additions (scripts/render_math9_projects.py) ── */
  .beat h3 + div, .beat > div { margin: 0; }
  .beat-label { display: block; }
  .beat p:last-child { margin-bottom: 0; }
  .flag p:last-child, .answer-guide p:last-child { margin-bottom: 0; }
  .answer-guide table { background: #fff; }
  .teacher-banner p { margin: 0; }
  code { font-size: 0.9em; background: #f1f5f9; padding: 0 3px; border-radius: 3px; }
  @media print { h1 + h2 { page-break-before: avoid; break-before: avoid; } }
"""


def style_block(kind):
    src = CSS_FROM[kind].read_text(encoding='utf-8')
    m = re.search(r'<style>(.*?)</style>', src, re.S)
    if not m:
        sys.exit(f'No <style> block in {CSS_FROM[kind]}')
    return m.group(1) + (PROJECT_CSS if kind == 'student' else TEACHER_CSS)


def front_matter(text):
    m = re.match(r'---\n(.*?)\n---\n', text, re.S)
    meta = {}
    if m:
        for line in m.group(1).splitlines():
            k, _, v = line.partition(':')
            meta[k.strip()] = v.strip().strip('"')
    return meta


def render(md_path):
    text = md_path.read_text(encoding='utf-8')
    meta = front_matter(text)
    kind = meta.get('style', 'student')
    body = subprocess.run(
        ['pandoc', '-f', 'markdown-auto_identifiers', '-t', 'html5', '--wrap=none', str(md_path)],
        check=True, capture_output=True, text=True).stdout
    # Grid rows need their spans as direct children, not wrapped in a <p>.
    body = re.sub(r'(<div class="sa-row[^"]*">)\s*<p>(.*?)</p>', r'\1\2', body, flags=re.S)
    # Blank answer lines: pandoc drops the space in [ ]{.b}; the workbooks use &nbsp;.
    body = re.sub(r'(<span class="b[^"]*">)\s*</span>', r'\1&nbsp;</span>', body)
    # Font URLs in the copied CSS are relative to worksheets/<strand>/, which is where output goes.
    strand = md_path.parent.name
    header = ''
    if kind == 'student':
        header = f'<div class="header-strip">\n  <div class="course-label">{meta.get("course_label", "Grade 9 Mathematics")}</div>\n</div>\n'
    page = (f'<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n'
            f'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
            f'<title>{meta.get("title", md_path.stem)}</title>\n<style>{style_block(kind)}</style>\n</head>\n'
            f'<body>\n{header}{body}</body>\n</html>\n')
    out = OUT / strand / (md_path.stem + '.html')
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding='utf-8')
    print(f'{md_path.relative_to(ROOT)} -> {out.relative_to(ROOT)}')


def main():
    paths = [Path(p).resolve() for p in sys.argv[1:]] or sorted(
        p for pat in SOURCES for p in ROOT.glob(pat))
    for p in paths:
        render(p)


if __name__ == '__main__':
    main()
