#!/usr/bin/env python3
"""Re-render Math 9 strand workbooks with proper q-card HTML format."""
import re, os, html as html_module

BASE_MD   = "/home/ejanbremness/Documents/Classroom tools/worksheets/math-9"
BASE_HTML = "/home/ejanbremness/Documents/classroom-tools-site/public/materials/math-9/worksheets"

WORKBOOKS = [
    {
        'md':       f"{BASE_MD}/number/math9-number-workbook-v1.md",
        'html':     f"{BASE_HTML}/number/math9-number-workbook-v1.html",
        'title':    'Number — Practice Workbook',
        'subtitle': 'Rational Numbers · Powers & Exponents · Square Roots',
        'unit':     '#2563eb', 'unit_mid': '#3b82f6', 'unit_dark': '#1d4ed8',
        'unit_light': '#dbeafe', 'unit_border': '#bfdbfe',
    },
    {
        'md':       f"{BASE_MD}/algebra/math9-algebra-workbook-v1.md",
        'html':     f"{BASE_HTML}/algebra/math9-algebra-workbook-v1.html",
        'title':    'Algebra — Practice Workbook',
        'subtitle': 'Linear Relations · Equations & Inequalities · Polynomials',
        'unit':     '#7c3aed', 'unit_mid': '#8b5cf6', 'unit_dark': '#6d28d9',
        'unit_light': '#ede9fe', 'unit_border': '#ddd6fe',
    },
    {
        'md':       f"{BASE_MD}/measurement-geometry/math9-measurement-geometry-workbook-v1.md",
        'html':     f"{BASE_HTML}/measurement-geometry/math9-measurement-geometry-workbook-v1.html",
        'title':    'Measurement & Geometry — Practice Workbook',
        'subtitle': 'Circle Geometry · Surface Area & Volume · Similarity & Scale',
        'unit':     '#059669', 'unit_mid': '#10b981', 'unit_dark': '#047857',
        'unit_light': '#d1fae5', 'unit_border': '#a7f3d0',
    },
    {
        'md':       f"{BASE_MD}/statistics-probability/math9-statistics-probability-workbook-v1.md",
        'html':     f"{BASE_HTML}/statistics-probability/math9-statistics-probability-workbook-v1.html",
        'title':    'Statistics & Probability — Practice Workbook',
        'subtitle': 'Statistics & Scatter Plots · Probability',
        'unit':     '#0d9488', 'unit_mid': '#14b8a6', 'unit_dark': '#0f766e',
        'unit_light': '#ccfbf1', 'unit_border': '#99f6e4',
    },
]


def css(wb):
    return f"""  :root {{
    --unit:        {wb['unit']};
    --unit-mid:    {wb['unit_mid']};
    --unit-dark:   {wb['unit_dark']};
    --unit-light:  {wb['unit_light']};
    --unit-border: {wb['unit_border']};
    --line:   #e2e8f0;
    --muted:  #64748b;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: Georgia,'Times New Roman',serif; font-size: 15px; line-height: 1.75;
          color: #1e293b; max-width: 860px; margin: 0 auto; padding: 2.5rem 2rem; background: #fff; }}
  h1 {{ font-family: system-ui,sans-serif; font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 0.25rem; }}
  h2 {{ font-family: system-ui,sans-serif; font-size: 1rem; font-weight: 700; color: #0f172a; margin: 1.5rem 0 0.5rem; }}
  h3 {{ font-family: system-ui,sans-serif; font-size: 0.9rem; font-weight: 700; color: var(--unit-dark);
        text-transform: uppercase; letter-spacing: 0.06em; margin: 1.25rem 0 0.35rem; }}
  p {{ margin-bottom: 0.6rem; }}
  strong {{ color: #0f172a; }}
  ol,ul {{ padding-left: 1.4rem; margin-bottom: 0.75rem; }}
  li {{ margin-bottom: 0.35rem; }}
  sup {{ font-size: 0.75em; }}

  .about-callout {{
    border: 1.5px solid var(--unit-border); border-radius: 0.5rem;
    padding: 1rem 1.25rem; margin-bottom: 2rem; background: var(--unit-light);
    font-family: system-ui,sans-serif; font-size: 0.88rem;
  }}
  .about-callout p {{ margin-bottom: 0.4rem; }}
  .about-callout p:last-child {{ margin-bottom: 0; }}

  .badge {{
    display: inline-flex; align-items: center;
    font-family: system-ui,sans-serif; font-size: 0.72rem; font-weight: 700;
    border-radius: 99px; padding: 0.2rem 0.6rem; letter-spacing: 0.03em;
  }}
  .badge-core   {{ background: #e0f2fe; color: #0369a1; }}
  .badge-ext    {{ background: #ede9fe; color: #5b21b6; }}
  .badge-num    {{ background: var(--unit); color: white; }}
  .badge-vis    {{ background: #fef3c7; color: #92400e; }}
  .badge-err    {{ background: #fce7f3; color: #9d174d; }}
  .badge-stretch{{ background: #0f172a; color: white; }}

  .section-heading {{
    font-family: system-ui,sans-serif; font-size: 0.72rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.12em; color: var(--unit-dark);
    border-bottom: 2px solid var(--unit-border); padding-bottom: 0.35rem; margin: 2rem 0 1.25rem;
  }}

  .question-card {{
    border: 1px solid var(--line); border-radius: 0.6rem;
    padding: 1.1rem 1.25rem; margin-bottom: 1.25rem; background: #fff;
  }}
  .question-card.extended {{ border-left: 4px solid #7c3aed; }}
  .q-header {{ display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.8rem; flex-wrap: wrap; }}
  .q-context {{
    background: #f8fafc; border-left: 3px solid var(--unit-border);
    padding: 0.6rem 0.9rem; border-radius: 0 0.35rem 0.35rem 0;
    font-size: 0.93rem; margin-bottom: 0.75rem; font-style: italic; color: #334155;
  }}
  .q-part {{ margin-bottom: 0.6rem; padding-left: 1rem; font-size: 0.95rem; }}

  .al {{ border-bottom: 1px solid #cbd5e1; min-height: 1.8rem; margin: 0.4rem 0; }}
  .al-short {{ width: 60%; }}
  .work-box {{
    border: 1px solid #e2e8f0; border-radius: 0.35rem; min-height: 80px;
    margin: 0.5rem 0; background: #fafafa; padding: 0.5rem;
    font-size: 0.85rem; color: #94a3b8; font-family: system-ui,sans-serif;
  }}

  .word-bank {{
    background: #f1f5f9; border: 1px solid var(--line); border-radius: 0.35rem;
    padding: 0.5rem 0.75rem; margin: 0.5rem 0 0.75rem; font-family: system-ui,sans-serif; font-size: 0.85rem;
  }}
  .word-bank .label {{ font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
                       letter-spacing: 0.08em; color: var(--muted); margin-bottom: 0.25rem; }}
  .word-bank .terms {{ display: flex; flex-wrap: wrap; gap: 0.4rem; }}
  .word-bank .term {{ background: white; border: 1px solid #cbd5e1; border-radius: 0.25rem;
                      padding: 0.15rem 0.5rem; font-size: 0.85rem; }}

  .hint {{
    border: 1px dashed var(--unit-border); border-radius: 0.35rem;
    padding: 0.45rem 0.75rem; margin: 0.5rem 0;
    font-family: system-ui,sans-serif; font-size: 0.83rem; color: var(--unit-dark); background: var(--unit-light);
  }}
  .hint-label {{ font-weight: 700; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; margin-right: 0.4rem; }}

  .starter {{
    font-style: italic; color: var(--unit-dark);
    border-left: 3px solid var(--unit-mid); padding: 0.35rem 0.75rem; margin: 0.4rem 0;
    font-size: 0.92rem; background: var(--unit-light); border-radius: 0 0.25rem 0.25rem 0;
  }}

  .misconception {{
    background: #fff1f2; border: 1px solid #fecdd3; border-left: 4px solid #f43f5e;
    border-radius: 0 0.4rem 0.4rem 0; padding: 0.75rem 1rem; margin-bottom: 0.75rem;
    font-family: system-ui,sans-serif; font-size: 0.9rem;
  }}
  .student-claim {{ font-style: italic; font-size: 0.95rem; color: #881337; margin-bottom: 0.25rem; }}
  .err-label {{ font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
                letter-spacing: 0.06em; color: #9f1239; margin-bottom: 0.35rem; }}

  pre {{
    font-family: 'Courier New',monospace; font-size: 0.82rem;
    background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 0.35rem;
    padding: 0.75rem 1rem; overflow-x: auto; white-space: pre; margin: 0.75rem 0; line-height: 1.5;
  }}

  table {{ width: 100%; border-collapse: collapse; font-size: 0.88rem; margin: 0.75rem 0 1rem; }}
  table th {{
    font-family: system-ui,sans-serif; font-size: 0.75rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em; background: var(--unit-light);
    color: var(--unit-dark); padding: 0.5rem 0.75rem; border: 1px solid var(--unit-border); text-align: left;
  }}
  table td {{ padding: 0.55rem 0.75rem; border: 1px solid #e2e8f0; vertical-align: top; }}
  table tr:nth-child(even) td {{ background: #f8fafc; }}

  .forethought-block {{ background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 0.6rem;
                        padding: 1.1rem 1.25rem; margin: 2rem 0; font-family: system-ui,sans-serif; font-size: 0.9rem; }}
  .midpoint-block    {{ background: #fefce8; border: 1.5px solid #fde047; border-radius: 0.6rem;
                        padding: 1.1rem 1.25rem; margin: 2rem 0; font-family: system-ui,sans-serif; font-size: 0.9rem; }}
  .reflection-block  {{ background: #fdf4ff; border: 1.5px solid #e9d5ff; border-radius: 0.6rem;
                        padding: 1.1rem 1.25rem; margin: 2rem 0; font-family: system-ui,sans-serif; font-size: 0.9rem; }}
  .meta-title {{ font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.6rem; }}
  .forethought-block .meta-title {{ color: #0369a1; }}
  .midpoint-block    .meta-title {{ color: #854d0e; }}
  .reflection-block  .meta-title {{ color: #6b21a8; }}
  .meta-prompt {{ margin-bottom: 0.5rem; }}

  .stretch-header {{
    background: #0f172a; color: white; border-radius: 0.5rem 0.5rem 0 0;
    padding: 0.75rem 1.25rem; font-family: system-ui,sans-serif; margin-top: 2.5rem;
  }}
  .stretch-header h2 {{ color: white; font-size: 1rem; margin: 0; }}
  .stretch-header p {{ font-size: 0.83rem; color: #94a3b8; margin-top: 0.25rem; margin-bottom: 0; }}
  .stretch-card {{
    border: 1px solid #0f172a; border-top: none; padding: 1.1rem 1.25rem; background: #fff;
  }}
  .stretch-card + .stretch-card {{ border-top: 1px solid #e2e8f0; }}
  .stretch-card:last-of-type {{ border-radius: 0 0 0.5rem 0.5rem; margin-bottom: 1.25rem; }}

  .self-assess {{ margin-top: 2.5rem; border: 1.5px solid var(--unit-border); border-radius: 0.5rem;
                  overflow: hidden; font-family: system-ui,sans-serif; font-size: 0.88rem; }}
  .self-assess-header {{ background: var(--unit); color: white; padding: 0.7rem 1.1rem;
                         font-weight: 700; font-size: 0.88rem; text-transform: uppercase; letter-spacing: 0.06em; }}
  .self-assess-body {{ padding: 1rem 1.1rem; }}
  .sa-row {{ display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 0.5rem;
             align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--line); font-size: 0.85rem; }}
  .sa-row:last-of-type {{ border-bottom: none; }}
  .sa-header {{ font-weight: 700; font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }}
  .sa-check {{ border: 1px solid #cbd5e1; border-radius: 0.25rem; padding: 0.2rem 0.5rem;
               text-align: center; color: var(--muted); font-size: 0.78rem; }}

  hr {{ border: none; border-top: 2px solid #e2e8f0; margin: 2rem 0; }}

  @media print {{
    body {{ font-size: 11pt; padding: 1.5cm; max-width: 100%;
            -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
    .question-card {{ break-inside: avoid; }}
    .stretch-card {{ break-inside: avoid; }}
  }}"""


def esc(s):
    return html_module.escape(s, quote=False)

def inline_fmt(text):
    """Apply bold, italic, superscript, fill-in blanks to a string."""
    # Protect HTML entities first
    # Superscripts: ⁰¹²³⁴⁵⁶⁷⁸⁹⁻
    sup_map = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'}
    for ch, val in sup_map.items():
        text = text.replace(ch, f'<sup>{val}</sup>')
    # Bold
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    # Italic (not star-only)
    text = re.sub(r'\*([^*]+?)\*', r'<em>\1</em>', text)
    # Fill-in blanks: inline ___ (3+ underscores, possibly with spaces)
    text = re.sub(r'_{3,}', '<span style="display:inline-block;border-bottom:2px solid #334155;min-width:80px;">&nbsp;</span>', text)
    return text

def render_table(rows):
    """rows: list of lists of strings. row[0] = header."""
    lines = ['<table>']
    lines.append('<thead><tr>')
    for cell in rows[0]:
        lines.append(f'<th>{esc(cell.strip())}</th>')
    lines.append('</tr></thead><tbody>')
    for row in rows[1:]:
        if re.match(r'^[-|: ]+$', ''.join(row)):
            continue
        lines.append('<tr>')
        for cell in row:
            content = cell.strip()
            lines.append(f'<td>{inline_fmt(esc(content))}</td>')
        lines.append('</tr>')
    lines.append('</tbody></table>')
    return '\n'.join(lines)

def parse_table_row(line):
    cells = line.strip().strip('|').split('|')
    return cells

def render_lines_to_html(lines):
    """Render a list of markdown lines (within a card or block) to HTML."""
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]

        # Code block
        if line.strip().startswith('```'):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith('```'):
                code_lines.append(lines[i])
                i += 1
            i += 1  # skip closing ```
            out.append(f'<pre>{esc(chr(10).join(code_lines))}</pre>')
            continue

        # Table
        if line.strip().startswith('|'):
            table_rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                table_rows.append(parse_table_row(lines[i]))
                i += 1
            # Filter separator rows
            data_rows = [r for r in table_rows if not re.match(r'^[-|: ]+$', ''.join(r))]
            if data_rows:
                out.append(render_table(data_rows))
            continue

        # Blockquote → misconception/error-analysis box
        if line.startswith('>'):
            quote_lines = []
            while i < len(lines) and lines[i].startswith('>'):
                quote_lines.append(lines[i].lstrip('> ').strip())
                i += 1
            content = ' '.join(q for q in quote_lines if q)
            out.append(f'<div class="misconception"><div class="err-label">Student claim</div>'
                       f'<p class="student-claim">"{inline_fmt(esc(content))}"</p></div>')
            continue

        # Word bank
        if line.lower().startswith('word bank:'):
            terms_str = line[10:].strip()
            terms = [t.strip() for t in re.split(r'[·•,]', terms_str) if t.strip()]
            terms_html = ''.join(f'<span class="term">{esc(t)}</span>' for t in terms)
            out.append(f'<div class="word-bank"><div class="label">Word bank</div>'
                       f'<div class="terms">{terms_html}</div></div>')
            i += 1
            continue

        # Hint (standalone line)
        if line.lower().startswith('hint:'):
            rest = line[5:].strip()
            out.append(f'<div class="hint"><span class="hint-label">Hint</span>{inline_fmt(esc(rest))}</div>')
            i += 1
            continue

        # Sentence starter
        if line.lower().startswith('sentence starter:'):
            rest = line[17:].strip()
            out.append(f'<div class="starter">Sentence starter: {inline_fmt(esc(rest))}</div>')
            i += 1
            continue

        # "Show working" / "Show each step" lines → work box
        if re.match(r'^show (working|each|all)', line.lower()):
            label = esc(line.rstrip(':').strip())
            out.append(f'<div class="work-box">{label}…</div>')
            i += 1
            continue

        # "Diagram space:" / "[draw here]"
        if re.match(r'^diagram space|^\[draw here\]', line.lower()):
            out.append('<div class="work-box" style="min-height:120px;">Draw here</div>')
            i += 1
            continue

        # Standalone answer line (3+ underscores on its own line)
        stripped = line.strip()
        if re.match(r'^_{3,}$', stripped):
            out.append('<div class="al"></div>')
            i += 1
            continue

        # Horizontal rule within card content — just a thin separator
        if stripped == '---':
            out.append('<hr style="margin:1rem 0;">')
            i += 1
            continue

        # Empty line
        if not stripped:
            i += 1
            continue

        # Unordered list
        if stripped.startswith('- ') or stripped.startswith('* '):
            list_items = []
            while i < len(lines) and re.match(r'^[-*] ', lines[i].strip()):
                list_items.append(lines[i].strip()[2:])
                i += 1
            out.append('<ul>' + ''.join(f'<li>{inline_fmt(esc(li))}</li>' for li in list_items) + '</ul>')
            continue

        # Ordered list
        if re.match(r'^\d+\.', stripped):
            list_items = []
            while i < len(lines) and re.match(r'^\d+\.', lines[i].strip()):
                list_items.append(re.sub(r'^\d+\.\s*', '', lines[i].strip()))
                i += 1
            out.append('<ol>' + ''.join(f'<li>{inline_fmt(esc(li))}</li>' for li in list_items) + '</ol>')
            continue

        # Regular paragraph
        out.append(f'<p>{inline_fmt(esc(stripped))}</p>')
        i += 1

    return '\n'.join(out)


def parse_question_header(line):
    """Parse '**QN ★** — Topic · Subtype' or '**SN ★★** — Topic'."""
    m = re.match(r'\*\*(Q\d+|S\d+)\s*(★★|★)\*\*\s*(?:—\s*(.+))?', line.strip())
    if not m:
        return None
    num, stars, rest = m.group(1), m.group(2), m.group(3) or ''
    is_ext = (stars == '★★')
    is_stretch = num.startswith('S')
    # Parse subtypes from rest: "Topic · Visual" or "Topic · Error analysis"
    parts = [p.strip() for p in rest.split('·')]
    topic = parts[0] if parts else ''
    subtypes = parts[1:] if len(parts) > 1 else []
    return {'num': num, 'extended': is_ext, 'stretch': is_stretch, 'topic': topic, 'subtypes': subtypes}


def render_question_card(header_info, body_lines, in_stretch=False):
    num = header_info['num']
    is_ext = header_info['extended']
    topic = header_info['topic']
    subtypes = header_info['subtypes']

    card_class = 'question-card extended' if is_ext else 'question-card'
    if in_stretch:
        card_class = 'stretch-card'

    badge_num = f'<span class="badge badge-num">{num}</span>'
    if is_ext:
        badge_level = '<span class="badge badge-ext">★★ Extended</span>'
    else:
        badge_level = '<span class="badge badge-core">★ Core</span>'

    extra_badges = ''
    for st in subtypes:
        st_l = st.lower()
        if 'visual' in st_l:
            extra_badges += '<span class="badge badge-vis">Visual</span>'
        elif 'error' in st_l:
            extra_badges += '<span class="badge badge-err">Error analysis</span>'
        elif 'alberta' in st_l:
            extra_badges += '<span class="badge" style="background:#dcfce7;color:#166534;">Alberta</span>'

    q_context = f'<p class="q-context">{esc(topic)}</p>' if topic else ''
    body_html = render_lines_to_html(body_lines)

    return (f'<div class="{card_class}">\n'
            f'  <div class="q-header">{badge_num}{badge_level}{extra_badges}</div>\n'
            f'  {q_context}\n'
            f'  {body_html}\n'
            f'</div>')


def render_self_assessment(lines):
    """Render a ## Self-Assessment table section."""
    table_rows = []
    post_lines = []
    in_table = False
    for line in lines:
        if line.strip().startswith('|'):
            in_table = True
            table_rows.append(parse_table_row(line))
        elif in_table:
            post_lines.append(line)
        # skip non-table, non-post lines

    # Build self-assess HTML
    out = ['<div class="self-assess">',
           '<div class="self-assess-header">Self-Assessment</div>',
           '<div class="self-assess-body">']

    # Header row
    if table_rows:
        headers = table_rows[0]
        out.append(f'<div class="sa-row">' +
                   ''.join(f'<div class="sa-header">{esc(h.strip())}</div>' for h in headers) +
                   '</div>')
        for row in table_rows[1:]:
            if re.match(r'^[-|: ]+$', ''.join(row)):
                continue
            cells = row
            skill = cells[0].strip() if cells else ''
            checks = cells[1:] if len(cells) > 1 else []
            out.append('<div class="sa-row">')
            out.append(f'<div>{esc(skill)}</div>')
            for c in checks:
                out.append(f'<div class="sa-check">{esc(c.strip())}</div>')
            out.append('</div>')

    out.append('</div></div>')  # close body and container

    # Post-table lines (open question)
    post_html = render_lines_to_html([l for l in post_lines if l.strip()])
    if post_html:
        out.append(f'<div style="margin-top:1.5rem;">{post_html}</div>')

    return '\n'.join(out)


def convert(wb):
    with open(wb['md'], encoding='utf-8') as f:
        raw = f.read()

    lines = raw.splitlines()

    # ── Split into top-level sections by ## ────────────────────────
    # Sections: header block, Forethought, Questions, Midpoint (opt), Stretch (opt), Reflection/Self-Assessment

    sections = []  # list of (kind, header_text, lines)
    current_kind = 'header'
    current_text = ''
    current_lines = []

    for line in lines:
        m = re.match(r'^## (.+)', line)
        if m:
            sections.append((current_kind, current_text, current_lines))
            current_kind = m.group(1).strip()
            current_text = current_kind
            current_lines = []
        else:
            current_lines.append(line)

    sections.append((current_kind, current_text, current_lines))

    # ── Render each section ────────────────────────────────────────
    body_parts = []

    for kind, text, sec_lines in sections:
        kl = kind.lower()

        # ── Header block (title, subtitle, about) ──
        if kind == 'header':
            title_line = ''
            about_lines = []
            for l in sec_lines:
                if l.startswith('# '):
                    title_line = l[2:].strip()
                elif l.startswith('Grade 9'):
                    # subtitle line — embed in about
                    about_lines.insert(0, l.strip())
                elif l.strip() and not l.startswith('---'):
                    about_lines.append(l.strip())

            about_html = ''.join(f'<p>{inline_fmt(esc(l))}</p>' for l in about_lines if l)
            body_parts.append(
                f'<div class="about-callout">'
                f'<h1>{esc(wb["title"])}</h1>'
                f'<p style="font-family:system-ui;font-size:0.82rem;color:#475569;margin:0.2rem 0 0.5rem;">'
                f'{esc(wb["subtitle"])}</p>'
                f'{about_html}'
                f'</div>'
            )
            continue

        # ── Forethought ──
        if 'forethought' in kl or 'begin' in kl:
            content_html = render_lines_to_html([l for l in sec_lines if l.strip() and not l.startswith('*2 min')])
            # Add al lines for open responses
            content_html = content_html.replace(
                '<div class="al"></div>', '<div class="al"></div><div class="al"></div>'
            )
            body_parts.append(
                f'<div class="forethought-block">'
                f'<div class="meta-title">Before You Begin — Forethought</div>'
                f'{content_html}'
                f'</div>'
            )
            continue

        # ── Questions section ──
        if kl == 'questions':
            body_parts.append('<div class="section-heading">Questions — interleaved</div>')
            # Split by --- into question blocks
            blocks = []
            current_block = []
            for l in sec_lines:
                if l.strip() == '---':
                    if any(ll.strip() for ll in current_block):
                        blocks.append(current_block)
                    current_block = []
                else:
                    current_block.append(l)
            if any(ll.strip() for ll in current_block):
                blocks.append(current_block)

            for block in blocks:
                # Find first non-empty line
                first = next((l for l in block if l.strip()), '')
                qh = parse_question_header(first)
                if qh:
                    body_lines = [l for l in block[block.index(first)+1:]]
                    body_parts.append(render_question_card(qh, body_lines))
                # else: skip (section-internal separators / empty blocks)
            continue

        # ── Midpoint check ──
        if 'midpoint' in kl:
            content_html = render_lines_to_html([l for l in sec_lines if l.strip()])
            body_parts.append(
                f'<div class="midpoint-block">'
                f'<div class="meta-title">Midpoint Check</div>'
                f'{content_html}'
                f'</div>'
            )
            continue

        # ── Stretch section ──
        if 'stretch' in kl:
            body_parts.append(
                '<div class="stretch-header">'
                '<h2>Stretch — Challenge Questions</h2>'
                '<p>★★ All stretch questions. Attempt after completing the main set.</p>'
                '</div>'
            )
            # Split by --- into stretch card blocks
            blocks = []
            current_block = []
            for l in sec_lines:
                if l.strip() == '---':
                    if any(ll.strip() for ll in current_block):
                        blocks.append(current_block)
                    current_block = []
                else:
                    current_block.append(l)
            if any(ll.strip() for ll in current_block):
                blocks.append(current_block)

            for block in blocks:
                first = next((l for l in block if l.strip()), '')
                qh = parse_question_header(first)
                if qh:
                    body_lines = [l for l in block[block.index(first)+1:]]
                    body_parts.append(render_question_card(qh, body_lines, in_stretch=True))
            continue

        # ── Self-Assessment ──
        if 'self' in kl or 'assessment' in kl.replace('-',''):
            body_parts.append(render_self_assessment(sec_lines))
            continue

        # ── Reflection ──
        if 'reflection' in kl or 'after' in kl:
            content_html = render_lines_to_html([l for l in sec_lines if l.strip()])
            body_parts.append(
                f'<div class="reflection-block">'
                f'<div class="meta-title">Reflection</div>'
                f'{content_html}'
                f'</div>'
            )
            continue

        # ── Fallback: render as plain content ──
        content_html = render_lines_to_html([l for l in sec_lines if not l.strip() == '---' or True])
        if content_html.strip():
            body_parts.append(f'<div style="margin:2rem 0;">{content_html}</div>')

    body_html = '\n\n'.join(body_parts)

    html_out = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Grade 9 Mathematics — {esc(wb['title'])}</title>
<style>
{css(wb)}
</style>
</head>
<body>
{body_html}
</body>
</html>"""

    os.makedirs(os.path.dirname(wb['html']), exist_ok=True)
    with open(wb['html'], 'w', encoding='utf-8') as f:
        f.write(html_out)
    print(f"✓  {wb['html'].split('/')[-1]}")


if __name__ == '__main__':
    for wb in WORKBOOKS:
        try:
            convert(wb)
        except Exception as e:
            import traceback
            print(f"✗  {wb['html'].split('/')[-1]}: {e}")
            traceback.print_exc()
    print("Done.")
