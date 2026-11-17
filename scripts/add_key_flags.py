"""Math 9 answer keys: add the parts the answer-key research asks for that the
old keys lacked (research/answer-key-design-research.md, items 3 and 5).

  * "Common Mistake" flags on Core keys (2-3 per key): a red box inside the
    question card, after its answer box. MISTAKES below, by key and question.
  * "Check your method" box at the end of every Core and Challenge key and
    every strand workbook key: yes/no questions on the decision steps
    students skip. CHECKS below, by topic; Challenge keys get one extra line.
  * The red .misconception style, on keys whose page has no such rule (the
    old flags there showed as plain text).

Edits the key HTML in public/materials/math-9/worksheets in place, by string
insertion, so nothing else in the file changes. Safe to re-run: each insert
carries data-key-flag and is skipped if already there. Run it again after
match_keys.py math9-worksheets / math9-workbooks (that rebuild drops them).

    python scripts/add_key_flags.py [--dry-run] [topic ...]
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WS = ROOT / 'public' / 'materials' / 'math-9' / 'worksheets'

# ── Common Mistake flags: key stem -> [(question number, html)] ──
MISTAKES = {
    'math9-polynomials-worksheet-core': [
        (2, '3x² + 5x is not 8x³ (or 8x²). Only like terms combine: same variable <em>and</em> same exponent. Adding never changes an exponent.'),
        (6, '(2x + 3)(x − 4) is not 2x² − 12. Every term multiplies every term — four products — then combine the middle terms: −8x + 3x = −5x.'),
    ],
    'math9-circle-geometry-worksheet-core': [
        (3, 'Halving when you should double. The central angle is always the bigger one: central = 2 × inscribed, inscribed = ½ × central. Check which angle you were given before you start.'),
        (4, 'Adding the squares: 5² + 13². OP is opposite the right angle at T, so it is the hypotenuse — subtract: PT² = OP² − OT².'),
        (5, 'Using the whole chord (16 cm) in Pythagoras. The right triangle is made by the perpendicular from O, so its side is <strong>half</strong> the chord: 8 cm.'),
    ],
    'math9-measurement-worksheet-core': [
        (3, 'Using the height h in the curved area πrl. The cone’s side slopes, so it needs the slant height l — find l with Pythagoras first. Volume uses h.'),
        (7, 'Counting the circle where the cylinder sits on the prism. That circle is hidden on both solids: leave out the cylinder’s bottom and take it off the prism’s top.'),
        (9, 'Forgetting to square the radius: π × 5 × h. The base area is πr² = 25π, so 25πh = 150π and h = 6.'),
    ],
    'math9-similarity-worksheet-core': [
        (4, 'Using AD : DB = 4 : 6. The scale factor compares the small triangle with the <strong>whole</strong> one, so the side is AB = AD + DB = 10.'),
        (6, 'Stopping at 800 000. That number is in centimetres, like the map: 800 000 cm = 8000 m = 8 km.'),
    ],
    'math9-statistics-worksheet-core': [
        (2, 'Calling (c) positive because “layers go up”. Read both variables the same way: as temperature goes <em>up</em>, layers go <em>down</em> — negative.'),
        (4, 'Picking two data points that sit off your line. Use two points that are <strong>on</strong> your drawn line, far apart.'),
        (5, 'Trusting every number the equation gives. Check first that the x-value is inside the data (5–30 °C); outside it, the prediction may be impossible, like −0.5 hours.'),
    ],
    'math9-probability-worksheet-core': [
        (2, 'Multiplying for “or”: (4/12)(3/12). One draw can’t be both colours, so add: “or” on one draw → add; “and” over two events → multiply.'),
        (4, 'Counting (1, 4) and (4, 1) as one outcome. On two dice they are different outcomes — that is why the grid has 36 cells, not 21.'),
    ],
}

# ── Check your method: topic -> yes/no questions ──
CHECKS = {
    'rational-numbers': [
        'Did you settle the sign first, by counting the negatives, before working out the size?',
        'Did you use a common denominator to add or subtract — and multiply by the reciprocal to divide?',
        'When you subtracted a negative, did you change it to adding a positive?',
    ],
    'powers': [
        'Did you name the law (add, subtract or multiply the exponents) before you wrote the answer?',
        'Did you check whether the negative sign is inside the brackets, so it is part of the base?',
        'Did you raise every factor in the brackets to the power, including the number in front?',
    ],
    'square-roots': [
        'Did you check for a perfect square (top and bottom, for a fraction) before deciding rational or irrational?',
        'Did you estimate between the two nearest perfect squares before using a calculator?',
        'In Pythagoras, did you square the sides before adding, and take the square root only at the end?',
    ],
    'linear-equations': [
        'Did you do the same thing to both sides at every step?',
        'Did you multiply a negative through every term in the brackets?',
        'In an inequality, did you flip the sign when you multiplied or divided by a negative?',
        'Did you check your answer by substituting it back into the question?',
    ],
    'linear-relations': [
        'Did you find the slope as change in y ÷ change in x, in that order?',
        'Did you find the starting value (y-intercept, where x = 0) and put it in the equation?',
        'Did you say what the slope and the intercept mean in the story, with units?',
    ],
    'polynomials': [
        'Did you combine only like terms (same variable, same exponent)?',
        'When subtracting, did you change the sign of every term in the second bracket?',
        'When multiplying, did you multiply every term by every term (four products for two binomials)?',
    ],
    'circle-geometry': [
        'Did you decide whether the angle is central (vertex at the centre) or inscribed (vertex on the circle) before halving or doubling?',
        'Did you mark the right angle (tangent ⊥ radius, or centre ⊥ chord) before using Pythagoras?',
        'Did you use half the chord, and put the longest side (opposite the right angle) as the hypotenuse?',
    ],
    'measurement': [
        'Did you decide first whether the question asks for surface area (covering) or volume (filling)?',
        'Did you use slant height for cone and pyramid surface area, and perpendicular height for volume?',
        'For a composite solid, did you leave out the faces hidden where the parts join?',
        'Did you write square units for area and cubic units for volume?',
    ],
    'similarity': [
        'Did you match corresponding sides (same position, same angle) before writing the ratio?',
        'Did you check that every pair of sides gives the same ratio?',
        'Did you put both measurements in the same units before comparing a map or model with real life?',
    ],
    'statistics': [
        'Did you describe both the direction (positive or negative) and the strength of the pattern?',
        'Did you check that the x-value is inside the data range before trusting a prediction?',
        'Before saying one thing causes another, did you look for a third variable that could explain both?',
    ],
    'probability': [
        'Did you list or count the whole sample space before writing a probability?',
        'Did you decide whether the events are independent or dependent before the second step?',
        'Did you multiply for “and” across two events, and add for “or” on one event?',
    ],
}
CHALLENGE_EXTRA = 'For every explain or error question, did you give a reason — not just a corrected answer?'
WORKBOOK = {
    'number': ['rational-numbers', 'powers', 'square-roots'],
    'algebra': ['linear-equations', 'linear-relations', 'polynomials'],
    'measurement-geometry': ['circle-geometry', 'measurement', 'similarity'],
    'statistics-probability': ['statistics', 'probability'],
}
WORKBOOK_FIRST = 'Before each question, did you decide which skill it needs? (The questions are mixed on purpose.)'
TOPIC_NAMES = {'rational-numbers': 'Rational numbers', 'powers': 'Powers', 'square-roots': 'Square roots',
               'linear-equations': 'Equations', 'linear-relations': 'Linear relations', 'polynomials': 'Polynomials',
               'circle-geometry': 'Circles', 'measurement': 'Surface area and volume', 'similarity': 'Similarity',
               'statistics': 'Statistics', 'probability': 'Probability'}

MIS_CSS = """
.misconception { border-left: 4px solid #dc2626; background: #fef2f2; padding: 10px 14px; margin: 12px 0 4px; border-radius: 0 6px 6px 0; font-style: normal; color: #1f1d1a; break-inside: avoid; }
.misconception .label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #dc2626; margin-bottom: 4px; }
.misconception p { margin: 0; }
"""
CSS = """
/* ── Key flags (scripts/add_key_flags.py) ── */
.method-check { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin: 20px 0 16px; break-inside: avoid; }
.method-check .label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #16a34a; margin-bottom: 4px; }
.method-check .mc-lead { margin: 0 0 6px; font-size: 10pt; color: #475569; }
.method-check ol { margin: 0 0 0 20px; padding: 0; }
.method-check li { margin: 0 0 5px; }
.method-check .mc-yn { white-space: nowrap; color: #475569; font-size: 9.5pt; margin-left: 6px; }
.method-check .mc-topic { font-weight: 700; }
@media print { .misconception, .method-check { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
"""


def flag_html(text):
    return ('<div class="misconception" data-key-flag="mistake">\n<div class="label">Common Mistake</div>\n'
            f'<p>{text}</p>\n</div>')


def method_html(items, lead):
    lis = ''.join(f'<li>{t} <span class="mc-yn">☐ Yes ☐ No</span></li>\n' for t in items)
    return ('<div class="method-check" data-key-flag="method">\n<div class="label">Check your method</div>\n'
            f'<p class="mc-lead">{lead}</p>\n<ol>\n{lis}</ol>\n</div>\n')


def card_spans(html):
    """[(qnum, start, end)] for top-level <div class="question"> cards; end is
    the index of the card's own closing </div>."""
    out = []
    for m in re.finditer(r'<div class="question[^"]*">', html):
        depth, i = 0, m.start()
        for t in re.finditer(r'<div\b|</div>', html[m.start():]):
            depth += 1 if t.group() != '</div>' else -1
            if depth == 0:
                i = m.start() + t.start(); break
        num = re.match(r'\s*<p>\s*<strong>\s*(\d+)\.', html[m.end():])
        if out and m.start() < out[-1][2]:
            continue  # nested
        out.append((int(num.group(1)) if num else None, m.start(), i))
    return out


def add_css(html):
    if 'Key flags (scripts/add_key_flags.py)' in html:
        return html
    k = html.rfind('</style>', 0, html.find('</head>'))
    css = CSS + (MIS_CSS if '.misconception' not in html[:k] else '')
    return html[:k] + css + html[k:]


def process(path, dry):
    stem = path.stem.replace('-answers', '').rsplit('-v', 1)[0]
    html = orig = path.read_text(encoding='utf-8')
    notes = []
    # 1. mistakes
    for q, text in MISTAKES.get(stem, []):
        if f'data-key-flag="mistake">\n<div class="label">Common Mistake</div>\n<p>{text}</p>' in html:
            continue
        spans = [s for s in card_spans(html) if s[0] == q]
        if not spans:
            notes.append(f'no card for Q{q}'); continue
        end = spans[0][2]
        html = html[:end] + flag_html(text) + '\n' + html[end:]
        notes.append(f'Q{q} flag')
    # 2. method check
    if 'data-key-flag="method"' not in html:
        if '-workbook' in stem:
            strand = stem.replace('math9-', '').replace('-workbook', '')
            items = [WORKBOOK_FIRST] + [f'<span class="mc-topic">{TOPIC_NAMES[t]}:</span> {CHECKS[t][0][0].lower() + CHECKS[t][0][1:]}'
                                        for t in WORKBOOK[strand]]
            # the sentence after the topic name starts lower-case; keep "Did" readable
            items = [items[0]] + [i.replace(':</span> did', ':</span> Did') for i in items[1:]]
            lead = 'Cover the answers, finish a question, then ask yourself:'
            m = re.search(r'<div[^>]*class="[^"]*self-assess', html)
            at = m.start() if m else html.rfind('</body>')
        else:
            topic = stem.replace('math9-', '').rsplit('-worksheet-', 1)[0]
            if topic not in CHECKS:
                notes.append(f'no CHECKS for {topic}')
                topic = None
            items = (CHECKS[topic] + ([CHALLENGE_EXTRA] if stem.endswith('-challenge') else [])) if topic else None
            lead = 'Before you mark a question right, ask yourself:'
            m = re.search(r'<div class="self-check">', html)
            at = m.start() if m else html.rfind('</body>')
        if items:
            html = html[:at] + method_html(items, lead) + html[at:]
            notes.append('method check')
    if html != orig:
        html = add_css(html)
        if not dry:
            path.write_text(html, encoding='utf-8')
    print(f'{path.relative_to(WS)}: {", ".join(notes) or "no change"}')


def main():
    args = sys.argv[1:]
    dry = '--dry-run' in args
    topics = [a for a in args if a != '--dry-run']
    for p in sorted(WS.rglob('*-answers-v1.html')):
        if not re.search(r'-(worksheet-(core|challenge)|workbook)-answers', p.name):
            continue
        if topics and not any(t in p.name for t in topics):
            continue
        process(p, dry)


if __name__ == '__main__':
    main()
