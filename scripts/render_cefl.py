#!/usr/bin/env python3
"""Render CEFL 7-9 materials (markdown) to printable HTML.

Sources:  worksheets/cefl-*/<unit>/*.md      (mini-workbooks, answer keys, project briefs)
          lesson-plans/cefl-*/<unit>/*.md    (teacher guides)
Output:   public/materials/cefl/<same name>.html  (all CEFL renders in one folder)

Run from the repo root:
    python3 scripts/render_cefl.py                       # every CEFL source
    python3 scripts/render_cefl.py path/to/file.md ...   # just these
Then run scripts/apply_site_fonts.py and scripts/stack_fractions.py on the output.

The parser is copied from render_home_practice.py and extended. Format
(full spec in _courses/cefl/_context.md):

  front matter: title, grade, unit, doc (workbook | answers | project | teacherguide),
                lo (local outcome code), subtitle (optional)
  ## Heading              section heading; "## Moment N — ..." starts a moment
                          (a new printed page after the first)
                          In a project brief every ## starts a new printed page;
                          "## Step N — ..." adds a Step chip
  ### Heading             sub-heading
  ::: kind ... :::        a labelled box; kinds are in BOX_LABEL below
  ::: visual ... :::      raw HTML/SVG, passed through untouched
  ::: connect ... :::     a small cross-curricular tag, not a box
  **1.** text             starts a question; it runs until the next question
  (work) / (work N)       blank working lines (4 by default)
  (box) / (box N)         an empty box N × 2rem tall for sketching or planning (6 by default)
  ___                     a short answer blank
  | a | b |               a table; an empty cell becomes a writing cell
  - item / 1. item        lists
"""
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MATERIALS = ROOT / 'public' / 'materials' / 'cefl'
SOURCES = ['worksheets/cefl-*/*/*.md', 'lesson-plans/cefl-*/*/*.md']

# Matches [data-course='cefl'] in src/styles/global.css.
ACCENT, LIGHT, MID = '#94631a', '#f7efe1', '#c39a5c'

DOC_LABEL = {
    'workbook': 'Mini-workbook',
    'answers': 'Mini-workbook · Answer key',
    'project': 'Project brief',
    'teacherguide': 'Teacher guide',
}

BOX_LABEL = {
    'scenario': 'The situation',
    'example': 'Worked example',
    'extra': 'Extra practice · optional',
    'check': 'Check yourself',
    'project': 'Use it in your project',
    'misconception': 'Watch out',
    'forethought': 'Before you start',
    'reflect': 'Look back',
    'tip': 'Hint',
    'answer': 'Answer',
    'dq': 'Driving question',
    'entry': 'The hook',
    'roles': 'Home team roles',
    'milestones': 'Milestones',
    'choices': 'Your choices',
    'critique': 'Critique protocol',
    'audience': 'Your audience',
    'rubric': 'How it is assessed',
    'myplan': 'My Plan portfolio page',
    'teacher': 'Teacher note',
    'lookfor': 'Look for',
    'data': 'Data used',
}

CSS = """
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 11pt; line-height: 1.55; color: #1e293b; background: #fff; max-width: 800px; margin: 0 auto; padding: 28px 32px 48px; }
    h1 { font-size: 20pt; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
    h2 { font-size: 14pt; font-weight: 700; color: var(--accent); margin: 22px 0 8px; border-bottom: 2px solid var(--accent-light); padding-bottom: 3px; }
    h2.moment { font-size: 15pt; border-bottom: 3px solid var(--accent); }
    h2.beat { font-size: 16pt; border-bottom: 3px solid var(--accent); margin-top: 56px; }
    h2.beat:first-of-type { margin-top: 28px; }
    h2 .chip, h2.moment .chip { display: inline-block; font-size: 9pt; letter-spacing: .08em; text-transform: uppercase; background: var(--accent); color: #fff; border-radius: 999px; padding: 1px 10px; margin-right: 8px; vertical-align: 3px; }
    .writebox { border: 1.5px solid #94a3b8; border-radius: 8px; margin: 8px 0 14px; }
    /* Project briefs: roomier type, more space between parts, more room to write. */
    body.doc-project { font-size: 12.5pt; line-height: 1.7; }
    .doc-project p { margin-bottom: 10px; }
    .doc-project li { margin-bottom: 6px; }
    .doc-project .box { padding: 16px 20px; margin: 16px 0 20px; }
    .doc-project .box-dq p { font-size: 20pt; }
    .doc-project .al { height: 2.4rem; }
    .doc-project .b { width: 150px; }
    .doc-project table { font-size: 11.5pt; }
    .doc-project th, .doc-project td { padding: 9px 12px; }
    .doc-project td.fill { height: 4.2rem; }
    .doc-project .visual { margin: 18px 0 22px; }
    h3 { font-size: 11.5pt; font-weight: 700; color: #334155; margin: 12px 0 4px; }
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
    .question { padding: 8px 0 4px; break-inside: avoid; }
    .question ul { list-style: none; margin-left: 0; }
    .box { border-radius: 8px; padding: 10px 14px; margin: 8px 0 10px; break-inside: avoid; }
    .box .label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
    .box-scenario { background: #fff; border: 1.5px solid var(--accent-mid); border-left: 6px solid var(--accent); }
    .box-scenario .label, .box-example .label, .box-dq .label, .box-entry .label { color: var(--accent); }
    .box-example { background: var(--accent-light); border: 1px solid var(--accent-mid); }
    .box-extra { background: #f8fafc; border: 1.5px dashed #94a3b8; }
    .box-extra .label { color: #475569; }
    .box-check { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .box-check .label { color: #16a34a; }
    .box-project { background: #fff; border: 1.5px solid #334155; }
    .box-project .label { color: #334155; }
    .box-misconception { background: #fef2f2; border: 1px solid #fecaca; }
    .box-misconception .label { color: #b91c1c; }
    .box-forethought, .box-reflect { background: #f1f5f9; border: 1px solid #cbd5e1; }
    .box-forethought .label, .box-reflect .label { color: #334155; }
    .box-tip { background: #fffbeb; border: 1px solid #fde68a; font-size: 10pt; }
    .box-tip .label { color: #b45309; }
    .box-answer { background: #f8fafc; border: 1px solid #e2e8f0; }
    .box-answer .label { color: #16a34a; }
    .box-dq { background: var(--accent); color: #fff; padding: 14px 18px; }
    .box-dq .label { color: #fff; opacity: .85; }
    .box-dq p { font-size: 15pt; font-weight: 700; line-height: 1.3; }
    .box-entry, .box-roles, .box-milestones, .box-choices, .box-critique, .box-audience, .box-rubric, .box-myplan, .box-data { background: #fff; border: 1px solid var(--accent-mid); }
    .box-roles .label, .box-milestones .label, .box-choices .label, .box-critique .label, .box-audience .label, .box-rubric .label, .box-myplan .label, .box-data .label { color: var(--accent); }
    .box-teacher, .box-lookfor { background: #fffbeb; border: 1px solid #fcd34d; }
    .box-teacher .label, .box-lookfor .label { color: #b45309; }
    .connect { display: inline-block; font-size: 9pt; color: #475569; border: 1px solid #cbd5e1; border-radius: 999px; padding: 1px 10px; margin: 2px 0 8px; }
    .connect b { color: var(--accent); font-weight: 700; }
    .visual { margin: 8px 0 12px; text-align: center; break-inside: avoid; }
    .visual svg { max-width: 100%; height: auto; }
    table { width: 100%; border-collapse: collapse; margin: 6px 0 10px; font-size: 10pt; break-inside: avoid; }
    th, td { border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; vertical-align: top; }
    th { background: var(--accent-light); color: #1e293b; font-weight: 700; }
    td.fill { height: 2.6rem; }
    .tbl { overflow-x: auto; margin: 6px 0 10px; }
    .tbl table { margin: 0; }
    @page { size: letter; margin: 11mm 13mm; }
    @media print {
      body { padding: 0; font-size: 10pt; line-height: 1.45; }
      .header-strip { padding: 7px 14px; margin-bottom: 8px; }
      h1 { font-size: 17pt; }
      h2 { margin: 10px 0 5px; break-after: avoid; }
      h2.moment.page, h2.beat.page { break-before: page; }
      h2.beat { margin-top: 0; }
      body.doc-project { font-size: 11.5pt; line-height: 1.6; }
      .doc-project .al { height: 2.1rem; }
      .doc-project td.fill { height: 3rem; }
      .doc-project .box { padding: 12px 16px; margin: 12px 0 14px; }
      .name-row { margin: 4px 0 8px; }
      .box { padding: 7px 12px; margin: 5px 0 7px; }
      .question { padding: 4px 0 2px; }
      .al { height: 1.3rem; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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


def table_html(rows):
    cells = [[c.strip() for c in r.strip().strip('|').split('|')] for r in rows]
    head, body = cells[0], [r for r in cells[1:] if not all(re.fullmatch(r':?-{3,}:?', c) for c in r)]
    # A header row with no text (organizers) is dropped, not drawn as an empty bar.
    out = '<div class="tbl"><table>'
    if any(head):
        out += '<thead><tr>' + ''.join(f'<th>{inline(c)}</th>' for c in head) + '</tr></thead>'
    out += '<tbody>'
    for r in body:
        out += '<tr>' + ''.join(f'<td>{inline(c)}</td>' if c else '<td class="fill"></td>' for c in r) + '</tr>'
    return out + '</tbody></table></div>'


def blocks(lines):
    """Turn a run of lines into paragraphs, lists and tables."""
    out, para, items, kind, rows = [], [], [], None, []

    def flush():
        nonlocal para, items, kind, rows
        if para:
            # A line break inside a paragraph is kept, so a question and its
            # guided prompt sit on separate lines.
            out.append(f'<p>{"<br>".join(inline(l) for l in para)}</p>')
            para = []
        if items:
            out.append(f'<{kind}>' + ''.join(f'<li>{inline(i)}</li>' for i in items) + f'</{kind}>')
            items, kind = [], None
        if rows:
            out.append(table_html(rows))
            rows = []

    for line in lines:
        s = line.strip()
        bullet = re.match(r'[-*] (.*)', s)
        number = re.match(r'\d+\. (.*)', s)
        if not s:
            flush()
        elif s.startswith('|'):
            if para or items:
                flush()
            rows.append(s)
        elif s.startswith('### '):
            flush()
            out.append(f'<h3>{inline(s[4:])}</h3>')
        elif re.fullmatch(r'\(work(?: (\d+))?\)', s):
            flush()
            n = int(re.fullmatch(r'\(work(?: (\d+))?\)', s).group(1) or 4)
            out.append('<div class="work">' + '<span class="al"></span>' * n + '</div>')
        elif re.fullmatch(r'\(box(?: (\d+))?\)', s):
            flush()
            n = int(re.fullmatch(r'\(box(?: (\d+))?\)', s).group(1) or 6)
            out.append(f'<div class="writebox" style="height:{n * 2}rem"></div>')
        elif bullet or number:
            want = 'ul' if bullet else 'ol'
            if para or rows or (kind and kind != want):
                flush()
            kind = want
            items.append((bullet or number).group(1))
        else:
            if items or rows:
                flush()
            para.append(s)
    flush()
    return out


def body_html(text, doc='workbook'):
    text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
    out, run = [], []
    in_q = False
    moments = 0
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

    for line in lines:
        s = line.strip()
        box = re.match(r':::\s*([\w-]+)\s*$', s)
        if box:
            kind = box.group(1)
            inner = []
            for inner_line in lines:
                if inner_line.strip() == ':::':
                    break
                inner.append(inner_line)
            if kind == 'visual':
                end_run()
                out.append('<div class="visual">' + '\n'.join(inner) + '</div>')
            elif kind == 'connect':
                end_run()
                out.append(f'<p class="connect"><b>Connects to</b> {inline(" ".join(l.strip() for l in inner if l.strip()))}</p>')
            else:
                # Hints and answers sit inside the question they belong to.
                if kind not in ('tip', 'answer'):
                    end_question()
                else:
                    end_run()
                label = BOX_LABEL.get(kind, '')
                out.append(f'<div class="box box-{kind}">' + (f'<p class="label">{label}</p>' if label else '')
                           + ''.join(blocks(inner)) + '</div>')
        elif s.startswith('## '):
            end_question()
            title = s[3:]
            m = re.match(r'(Moment|Step) (\d+)\s*[—–-]\s*(.*)', title)
            chip = f'<span class="chip">{m.group(1)} {m.group(2)}</span>' if m else ''
            text_ = inline(m.group(3) if m else title)
            if doc == 'project':
                # Every section of a project brief is its own beat: a new printed page.
                # The driving question and hook sit on page 1, before the first section.
                cls = 'beat page'
            elif m:
                cls = 'moment page' if moments else 'moment'
                moments += 1
            else:
                cls = ''
            out.append(f'<h2 class="{cls}">{chip}{text_}</h2>' if cls else f'<h2>{text_}</h2>')
        elif re.match(r'\*\*\d+[a-z]?\.\*\*', s):
            end_question()
            out.append('<div class="question">')
            in_q = True
            run.append(s)
        else:
            run.append(line)
    end_question()
    return '\n'.join(out)


def render(md_path):
    meta, body = front_matter(md_path.read_text(encoding='utf-8'))
    doc = meta.get('doc', 'workbook')
    grade = meta.get('grade', '7')
    course_label = f'Career Education & Financial Literacy {grade} · {meta["unit"]} · {DOC_LABEL[doc]}'
    title = meta['title']
    sub = meta.get('subtitle', '')
    lo = meta.get('lo', '')
    meta_line = ' · '.join(x for x in [sub, f'Outcome {lo}' if lo else '', 'Alberta draft curriculum (2026)'] if x)
    name_row = '' if doc in ('answers', 'teacherguide') else (
        '<div class="name-row"><span>Name</span><span class="b"></span>'
        '<span>Team</span><span class="b" style="flex:0 0 140px"></span>'
        '<span>Date</span><span class="b" style="flex:0 0 110px"></span></div>')
    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(title)} — {DOC_LABEL[doc]} | CEFL {html.escape(grade)}</title>
  <style>
    :root {{ --accent: {ACCENT}; --accent-light: {LIGHT}; --accent-mid: {MID}; }}{CSS}  </style>
</head>
<body class="doc-{doc}">
  <div class="header-strip">
    <p class="course-label">{html.escape(course_label)}</p>
    <h1>{html.escape(title)}</h1>
    <p class="meta">{html.escape(meta_line)}</p>
  </div>
  {name_row}
{body_html(body, doc)}
</body>
</html>
"""
    out = MATERIALS / (md_path.stem + '.html')
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding='utf-8')
    return out


def main():
    paths = [Path(p) for p in sys.argv[1:]] or sorted({p for g in SOURCES for p in ROOT.glob(g)})
    for p in paths:
        print(render(p.resolve()).relative_to(ROOT))


if __name__ == '__main__':
    main()
