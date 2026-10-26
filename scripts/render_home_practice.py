#!/usr/bin/env python3
"""Render home practice sheets (markdown) for the parent pages to printable HTML.

Sources and output, by course (front matter `course:`, default math9):
  math9:   worksheets/math-9/home/<topic>/*.md  ->  public/materials/math-9/home/<topic>/
  math8:   worksheets/math-8/home/<topic>/*.md  ->  public/materials/math-8/home/<topic>/ (strand colours, as Math 9)
  others:  worksheets/<course folder>/<unit>/*-home-*.md and steam/grade-N/home/*.md
           ->  public/materials/ (flat, like the course's other materials)

Run from the repo root:
    python3 scripts/render_home_practice.py                      # every sheet
    python3 scripts/render_home_practice.py path/to/sheet.md ... # just these

The format is the one in templates/home-practice-template.md. Styling matches
the course worksheets (same header strip and name row; course or strand colour).
After rendering, run scripts/stack_fractions.py on the output files.
"""
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MATERIALS = ROOT / 'public' / 'materials'
SOURCES = ['worksheets/math-9/home/*/*.md', 'worksheets/math-8/home/*/*.md', 'worksheets/*/*/*-home-*.md', 'steam/grade-*/home/*.md']

# Same accents as the topic worksheets in public/materials/math-9/worksheets/.
STRAND = {
    'number':                 ('Number',                   '#1d4ed8', '#eff6ff', '#3b82f6'),
    'algebra':                ('Algebra',                  '#7c3aed', '#f5f3ff', '#8b5cf6'),
    'measurement-geometry':   ('Measurement & Geometry',   '#16a34a', '#f0fdf4', '#22c55e'),
    'statistics-probability': ('Statistics & Probability', '#0d9488', '#f0fdfa', '#14b8a6'),
}

# Other courses: (header label, accent, light, mid). Accents match the site's
# course colours in src/styles/global.css.
COURSE = {
    'science':  ('Grade 6 Science',        '#1d7486', '#e8f2f4', '#4f9aa8'),
    'science7': ('Grade 7 Science',        '#2e7d55', '#e9f3ed', '#5fa37f'),
    'social8':  ('Grade 8 Social Studies', '#8a4a78', '#f4eaf1', '#b07aa2'),
    'social9':  ('Grade 9 Social Studies', '#a6452f', '#f7ebe7', '#c97a66'),
    'steam':    ('STEAM',                  '#6650c2', '#efecf9', '#9483d8'),
    'ela5':     ('Grade 5 English Language Arts', '#b4235a', '#fbeaf0', '#d0688d'),
}

BOX_LABEL = {'example': 'Worked example', 'tip': '', 'check': 'Check yourself', 'answer': ''}

CSS = """
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 11pt; line-height: 1.55; color: #1e293b; background: #fff; max-width: 780px; margin: 0 auto; padding: 28px 32px 48px; }
    h1 { font-size: 20pt; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
    h2 { font-size: 13pt; font-weight: 700; color: var(--accent); margin: 18px 0 8px; border-bottom: 2px solid var(--accent-light); padding-bottom: 3px; }
    p { margin-bottom: 6px; }
    ul, ol { margin: 4px 0 8px 22px; }
    li { margin-bottom: 3px; }
    strong { font-weight: 700; }
    em { font-style: italic; color: #475569; }
    .b { display: inline-block; border-bottom: 1.5px solid #334155; width: 90px; vertical-align: bottom; }
    .al { display: block; border-bottom: 1px solid #cbd5e1; height: 1.7rem; }
    .work { margin: 4px 0 2px; }
    .header-strip { border-left: 5px solid var(--accent); padding: 10px 16px; margin-bottom: 14px; background: var(--accent-light); border-radius: 0 8px 8px 0; }
    .header-strip .course-label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--accent); margin-bottom: 4px; }
    .header-strip .meta { font-size: 9.5pt; color: #64748b; }
    .name-row { display: flex; gap: 24px; margin: 8px 0 14px; font-size: 10.5pt; align-items: baseline; }
    .name-row span { color: #64748b; white-space: nowrap; }
    .name-row .b { flex: 1; width: auto; }
    .qgrid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 28px; }
    .question { padding: 6px 0 4px; break-inside: avoid; }
    .question ul { list-style: none; margin-left: 0; }
    .question li { margin-bottom: 1px; }
    @media (max-width: 560px) { .qgrid { grid-template-columns: 1fr; } }
    .box { border-radius: 8px; padding: 10px 14px; margin: 8px 0 10px; break-inside: avoid; }
    .box .label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
    .box-example { background: var(--accent-light); border: 1px solid var(--accent-mid); }
    .box-example .label { color: var(--accent); }
    .box-tip { background: #fffbeb; border: 1px solid #fde68a; font-size: 10pt; }
    .box-check { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .box-check .label { color: #16a34a; }
    .box-answer { background: #f8fafc; border: 1px solid #e2e8f0; }
    @page { size: letter; margin: 11mm 13mm; }
    @media print {
      body { padding: 0; font-size: 10pt; line-height: 1.45; }
      .header-strip { padding: 7px 14px; margin-bottom: 8px; }
      h1 { font-size: 17pt; }
      h2 { margin: 10px 0 5px; }
      .name-row { margin: 4px 0 8px; }
      .box { padding: 7px 12px; margin: 5px 0 7px; }
      .question { padding: 4px 0 2px; }
      .al { height: 1.3rem; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      h2 { break-after: avoid; }
    }
"""


def front_matter(text):
    m = re.match(r'---\n(.*?)\n---\n', text, re.S)
    if not m:
        raise SystemExit('missing front matter')
    meta = dict(re.findall(r'^(\w+):\s*(.*)$', m.group(1), re.M))
    return meta, text[m.end():]


def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', s)
    s = re.sub(r'_{3,}', '<span class="b"></span>', s)
    # Runs of spaces are kept (e.g. spaced-out choices to circle).
    s = re.sub(r' {2,}', lambda m: '&emsp;' * (len(m.group(0)) // 2), s)
    return s


def blocks(lines):
    """Turn a run of lines into paragraphs and lists."""
    out, para, items, kind = [], [], [], None

    def flush():
        nonlocal para, items, kind
        if para:
            # A line break inside a paragraph is kept, so a question and its
            # guided prompt sit on separate lines.
            out.append(f'<p>{"<br>".join(inline(l) for l in para)}</p>')
            para = []
        if items:
            out.append(f'<{kind}>' + ''.join(f'<li>{inline(i)}</li>' for i in items) + f'</{kind}>')
            items, kind = [], None

    for line in lines:
        s = line.strip()
        bullet = re.match(r'[-*] (.*)', s)
        number = re.match(r'\d+\. (.*)', s)
        if not s:
            flush()
        elif re.fullmatch(r'\(work(?: (\d))?\)', s):
            flush()
            n = int(re.fullmatch(r'\(work(?: (\d))?\)', s).group(1) or 4)
            out.append('<div class="work">' + '<span class="al"></span>' * n + '</div>')
        elif bullet or number:
            want = 'ul' if bullet else 'ol'
            if para or (kind and kind != want):
                flush()
            kind = want
            items.append((bullet or number).group(1))
        else:
            if items:
                flush()
            para.append(s)
    flush()
    return out


def body_html(text):
    text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
    out, run = [], []
    in_q = in_grid = False
    lines = iter(text.split('\n'))

    def end_run():
        nonlocal run
        out.extend(blocks(run))
        run = []

    def end_question():
        nonlocal in_q
        end_run()
        if in_q:
            out.append('</div>')
            in_q = False

    def end_grid():
        # Consecutive questions sit in a two-column grid; anything else ends it.
        nonlocal in_grid
        end_question()
        if in_grid:
            out.append('</div>')
            in_grid = False

    for line in lines:
        s = line.strip()
        box = re.match(r':::\s*(\w+)\s*$', s)
        if box:
            end_grid()
            kind = box.group(1)
            inner = []
            for inner_line in lines:
                if inner_line.strip() == ':::':
                    break
                inner.append(inner_line)
            label = BOX_LABEL.get(kind, '')
            out.append(f'<div class="box box-{kind}">' + (f'<p class="label">{label}</p>' if label else '')
                       + ''.join(blocks(inner)) + '</div>')
        elif s.startswith('## '):
            end_grid()
            out.append(f'<h2>{inline(s[3:])}</h2>')
        elif re.match(r'\*\*\d+\.\*\*', s):
            end_question()
            if not in_grid:
                out.append('<div class="qgrid">')
                in_grid = True
            out.append('<div class="question">')
            in_q = True
            run.append(s)
        else:
            run.append(line)
    end_grid()
    return '\n'.join(out)


def render(md_path):
    meta, body = front_matter(md_path.read_text(encoding='utf-8'))
    course = meta.get('course', 'math9')
    if course in ('math9', 'math8'):
        g = 8 if course == 'math8' else 9
        strand_label, accent, light, mid = STRAND[meta['strand']]
        course_label = f'Grade {g} Math · {strand_label}'
        doc_suffix = f'Grade {g} Mathematics'
        out = MATERIALS / f'math-{g}' / 'home' / meta['topic'] / (md_path.stem + '.html')
    else:
        label, accent, light, mid = COURSE[course]
        course_label = f'{label} · {meta["unit"]}'
        doc_suffix = label
        out = (MATERIALS / 'grade-5-ela' if course == 'ela5' else MATERIALS) / (md_path.stem + '.html')
    answers = '-answers-' in md_path.name
    title = meta['title'] + (' — Answers' if answers else '')
    name_row = '' if answers else (
        '<div class="name-row"><span>Name</span><span class="b"></span>'
        '<span>Date</span><span class="b" style="flex:0 0 120px"></span></div>')
    doc = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(title)} — Home Practice | {html.escape(doc_suffix)}</title>
  <style>
    :root {{ --accent: {accent}; --accent-light: {light}; --accent-mid: {mid}; }}{CSS}  </style>
</head>
<body>
  <div class="header-strip">
    <p class="course-label">{html.escape(course_label)} · Home practice</p>
    <h1>{html.escape(title)}</h1>
    <p class="meta">One skill: {html.escape(meta['skill'])} · {html.escape(meta.get('time', 'about 15 minutes'))}</p>
  </div>
  {name_row}
{body_html(body)}
</body>
</html>
"""
    # Grade 5 handwriting is larger: wider work lines, on screen and in print.
    if course == 'ela5':
        doc = doc.replace('</style>', '    .al { height: 12mm !important; }\n  </style>', 1)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(doc, encoding='utf-8')
    return out


def main():
    paths = [Path(p) for p in sys.argv[1:]] or sorted({p for g in SOURCES for p in ROOT.glob(g)})
    for p in paths:
        print(render(p.resolve()).relative_to(ROOT))


if __name__ == '__main__':
    main()
