#!/usr/bin/env python3
"""Turn inline fractions (3/4, x/5, (y2-y1)/(x2-x1), ½) into stacked fractions.

Writes the markup the Math 9 notes already use:
    <span class="frac"><span class="num">3</span><span class="frac-slash">/</span><span class="den">4</span></span>
The hidden slash keeps copy-paste and screen readers reading "3/4", not "34".

Usage (from the repo root):
    python3 scripts/stack_fractions.py --dry-run public/materials/math-9      # report only
    python3 scripts/stack_fractions.py public/materials/math-9                # write changes
    python3 scripts/stack_fractions.py --report skips.txt --dry-run <paths>   # list every slash left alone

Safe to run again: text already inside .frac is skipped. Text inside script, style, svg,
pre, code, sup, sub, textarea and title is never touched, and neither is anything inside
an element with class "nofrac". Units (km/h, m/s), dates (2024/25), and spaced
slashes (change in y / change in x) stay inline.
"""
import argparse
import re
import sys
from collections import Counter
from pathlib import Path

# ── What counts as one side of a fraction ──────────────────────────────────
NUM = r'(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?°?'        # 3, 1.5, 6,000, 180°
SEG = r'[A-Z]{2}(?![a-z])'                              # side lengths: DE/AB
VAR = r'(?:\d+(?:\.\d+)?)?√?[A-Za-z][₀-₉′]*'          # x, 2x, y₂, √a
ROOT = r'√\d+(?:\.\d+)?'                                # √25
GROUP = r'\((?:[^()]|\([^()]*\))+\)'                   # (y₂−y₁), (3−(−1))
BLANK = r'_{2,}'                                        # fill-in: ___/12
SUP = r'[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁻]*'
ATOM = rf'(?:{GROUP}|{ROOT}|{SEG}|{VAR}|{NUM}|{BLANK}){SUP}'
WORD_RATIOS = r'rise/run|height/shadow'                 # word fractions worth stacking

FRACTION = re.compile(
    rf'(?<![\w./\\)⁄$])(?<!\d,)(?:(?P<word>{WORD_RATIOS})|(?P<num>{ATOM})/(?P<den>[−-]?{ATOM}))(?![\w/(⁄])'
)
# Any slash between non-space characters, for the skip report.
SLASH = re.compile(r'\S{1,12}/\S{1,12}')

# Single-letter pairs that are units or abbreviations, not variables. Multi-letter units
# (km/h, kg/ha, N/kg) never match ATOM because a letter must not precede the numerator,
# and prices ($3.50/L) are skipped because a $ must not precede it either.
LEAVE_INLINE = {'m/s', 'g/L', 'g/s', 'L/s', 'L/h', 'm/h', 'J/s', 'J/g', 'D/M', 'A/S', 'A/B', 'N/A', 'Y/N', '24/7'}
DATE = re.compile(r'(19|20)\d\d')

VULGAR = {'½': ('1', '2'), '⅓': ('1', '3'), '⅔': ('2', '3'), '¼': ('1', '4'), '¾': ('3', '4'),
          '⅕': ('1', '5'), '⅖': ('2', '5'), '⅗': ('3', '5'), '⅘': ('4', '5'), '⅙': ('1', '6'),
          '⅚': ('5', '6'), '⅛': ('1', '8'), '⅜': ('3', '8'), '⅝': ('5', '8'), '⅞': ('7', '8')}
VULGAR_RE = re.compile('[' + ''.join(VULGAR) + ']')

SKIP_TAGS = {'script', 'style', 'svg', 'pre', 'code', 'sup', 'sub', 'textarea', 'title', 'math'}
SKIP_CLASS = re.compile(r'class\s*=\s*["\'][^"\']*\b(frac|nofrac|big-frac)\b')
TOKEN = re.compile(r'(<!--.*?-->|<[^>]+>)', re.S)
TAG = re.compile(r'<\s*(/?)\s*([a-zA-Z][\w-]*)')

FRAC_CSS = """
  /* ── Stacked fractions (scripts/stack_fractions.py) ── */
  .frac {
    display: inline-flex;
    flex-direction: column;
    text-align: center;
    vertical-align: middle;
    font-size: 0.85em;
    line-height: 1.15;
    margin: 0 1px;
  }
  .frac .num { border-bottom: 1.5px solid currentColor; padding: 0 3px 1px; }
  .frac .den { padding: 1px 3px 0; }
"""
SLASH_CSS = """
  .frac .frac-slash { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
"""
BLANK_CSS = """
  .frac .b { border-bottom: 0; min-height: 1.3em; }   /* the fraction bar is the write-on line */
"""


def has_operator(inner):
    """True when a bracketed side has more than a leading sign, e.g. (y₂−y₁)."""
    return bool(re.search(r'.[+−\-×·÷]', inner))


def side(text):
    if text.startswith('(') and text.endswith(')') and has_operator(text[1:-1]):
        return text[1:-1]
    return text


def frac_html(num, den):
    return (f'<span class="frac"><span class="num">{num}</span>'
            f'<span class="frac-slash">/</span><span class="den">{den}</span></span>')


def convert_text(text, made, skipped):
    def repl(m):
        whole = m.group(0)
        if m.group('word'):
            a, b = whole.split('/')
            made[whole] += 1
            return frac_html(a, b)
        num, den = m.group('num'), m.group('den')
        spaced_thousands = (re.fullmatch(r'\d{3}', num) and re.search(r'\d[  ]$', m.string[:m.start()])
                            or re.match(r'[  ]\d{3}\b', m.string[m.end():]))     # 1 560 000/50 000
        if (whole in LEAVE_INLINE or spaced_thousands
                or (DATE.fullmatch(num) and re.fullmatch(r'\d{2,4}', den))):
            skipped[whole] += 1
            return whole
        made[whole] += 1
        return frac_html(side(num), side(den))

    out = FRACTION.sub(repl, text)
    out = VULGAR_RE.sub(lambda m: (made.update([m.group(0)]) or frac_html(*VULGAR[m.group(0)])), out)
    # Report slashes still left in plain text (outside the markup just added).
    for leftover in SLASH.findall(re.sub(r'<span class="frac">(?:<span[^>]*>[^<]*</span>){3}</span>', ' ', out)):
        if '/' in leftover and not leftover.startswith(('http', '//')):
            skipped[leftover] += 1
    return out


def process(html, made, skipped):
    parts = TOKEN.split(html)
    skip_stack = []           # (tag name, depth) for each element we are inside and must not touch
    depth = Counter()         # open-tag count per tag name, to find the matching close
    in_body = '<body' not in html.lower()
    for i, part in enumerate(parts):
        if i % 2 == 1:        # a tag or comment
            m = TAG.match(part)
            if not m:
                continue
            closing, name = m.group(1) == '/', m.group(2).lower()
            if name == 'body':
                in_body = not closing
            self_closing = part.rstrip().endswith('/>')
            if closing:
                if skip_stack and skip_stack[-1] == (name, depth[name]):
                    skip_stack.pop()
                depth[name] = max(0, depth[name] - 1)
            elif not self_closing:
                depth[name] += 1
                if name in SKIP_TAGS or SKIP_CLASS.search(part):
                    skip_stack.append((name, depth[name]))
        elif part and in_body and not skip_stack:
            parts[i] = convert_text(part, made, skipped)
    return ''.join(parts)


def add_css(html):
    if '</style>' not in html:
        return html
    styles = html.split('</style>')[0]
    css = ''
    if not re.search(r'\.frac\s*\{', html):
        css += FRAC_CSS
    if '.frac-slash' not in styles:
        css += SLASH_CSS
    if '.frac .b' not in styles and re.search(r'<span class="num"><span class="b[ "]', html):
        css += BLANK_CSS
    return html.replace('</style>', css + '</style>', 1) if css else html


BLANK_SPAN = r'<span class="b(?: [^"]*)?"[^>]*>\s*</span>'     # fill-in blank from the notes/worksheet CSS
BLANK_OVER = re.compile(rf'({BLANK_SPAN})/(?P<den>[−-]?{ATOM})(?![\w/(⁄])')
BLANK_UNDER = re.compile(rf'(?<![\w./\\)⁄$])(?P<num>{ATOM})/({BLANK_SPAN})')


def stack_blanks(html, made):
    """Fractions with a fill-in blank on one side: <span class="b"></span>/8 and 1/<span class="b"></span>."""
    head, sep, body = html.partition('<body')
    if not sep:
        head, body = '', html
    body = BLANK_OVER.sub(lambda m: (made.update(['___/' + m.group('den')]) or frac_html(m.group(1), side(m.group('den')))), body)
    body = BLANK_UNDER.sub(lambda m: (made.update([m.group('num') + '/___']) or frac_html(side(m.group('num')), m.group(2))), body)
    return head + sep + body


def retrofit_existing(html):
    """Give fractions written before this script the hidden slash too."""
    return re.sub(r'(<span class="num">(?:(?!</span>).)*</span>)(<span class="den">)',
                  r'\1<span class="frac-slash">/</span>\2', html)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('paths', nargs='+', help='HTML files or folders')
    ap.add_argument('--dry-run', action='store_true', help='report only, write nothing')
    ap.add_argument('--report', help='write every conversion and skip to this file')
    ap.add_argument('--exclude', default=r'-game-|-sim-|-simulator|-trainer-',
                    help='regex of file names to leave alone (interactive pages)')
    args = ap.parse_args()

    files = []
    for p in map(Path, args.paths):
        files += sorted(p.rglob('*.html')) if p.is_dir() else [p]
    files = [f for f in files if not re.search(args.exclude, f.name)]

    made_all, skipped_all, changed = Counter(), Counter(), 0
    for f in files:
        html = f.read_text(encoding='utf-8')
        made, skipped = Counter(), Counter()
        new = process(stack_blanks(html, made), made, skipped)
        new = retrofit_existing(new)
        if new != html:
            new = add_css(new)
        made_all += made
        skipped_all += skipped
        if new != html:
            changed += 1
            print(f'{sum(made.values()):5d}  {f}')
            if not args.dry_run:
                f.write_text(new, encoding='utf-8')

    print(f'\n{changed} of {len(files)} files {"would change" if args.dry_run else "changed"}; '
          f'{sum(made_all.values())} fractions stacked, {sum(skipped_all.values())} slashes left inline.')
    if args.report:
        with open(args.report, 'w', encoding='utf-8') as out:
            out.write('== STACKED ==\n')
            out.writelines(f'{n:5d}  {s}\n' for s, n in made_all.most_common())
            out.write('\n== LEFT INLINE ==\n')
            out.writelines(f'{n:5d}  {s}\n' for s, n in skipped_all.most_common())
        print(f'Report: {args.report}')


if __name__ == '__main__':
    sys.exit(main())
