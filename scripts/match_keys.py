#!/usr/bin/env python3
"""Rebuild answer keys so each one looks like the student page it goes with.

The key becomes a copy of the student HTML with the answers written in:
blanks are filled in green (as in the Math 8 keys), written-response space
is replaced by a green Answer box, and teacher-only notes go in an amber box.
Answers are read from the old key HTML (pass it with --from, or the script
uses the key file itself before overwriting it).

Usage:
  python3 scripts/match_keys.py FAMILY [unit ...] [--dry-run] [--from-git REV]

FAMILY is one of the adapters at the bottom of this file. Each adapter knows
where its student and key files live and how its old key lays out answers.
Old keys are read from git commit c59642b (the last commit before keys
were rebuilt), so re-running is safe. --from-git REV picks another commit.
--from-disk reads the key file on disk instead: use it right after a render
script has rewritten an old-style key (CEFL: run render_cefl.py, then
match_keys.py cefl --from-disk).
"""
import re, sys, subprocess, difflib
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
MAT = ROOT / 'public' / 'materials'

KEY_CSS = """
/* ── Answer key overlay (scripts/match_keys.py) ── */
.answer-key-header { background: #1f1d1a; color: #fff; padding: 8px 14px; border-radius: 6px; margin: 0 0 16px; font-size: 9.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
.ak-fill { display: inline; color: #166534; font-weight: 700; border-bottom: 2px solid #86efac; padding: 0 2px; min-width: 0; }
td .ak-fill, li .ak-fill { white-space: normal; }
.ak-answer { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 8px 12px; margin: 8px 0; color: #1f1d1a; font-style: normal; break-inside: avoid; }
.ak-answer p, .ak-answer ul, .ak-answer ol { margin: 0 0 5px; }
.ak-answer p:last-child, .ak-answer ul:last-child, .ak-answer ol:last-child { margin-bottom: 0; }
.ak-answer ul, .ak-answer ol { padding-left: 20px; }
.ak-answer table { margin: 6px 0; }
.ak-text { color: #166534; font-weight: 600; }
.ak-label { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #15803d; margin-right: 6px; }
.ak-teacher { background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 8px 12px; margin: 8px 0; font-size: 10pt; break-inside: avoid; }
.ak-teacher .ak-text { color: #166534; font-weight: 600; }
.ak-label { color: #b45309; }
.ak-teacher p { margin: 0 0 4px; } .ak-teacher p:last-child { margin-bottom: 0; }
svg .ak-svg-fill { fill: #166534; font-weight: 700; }
@media print { .ak-answer, .ak-teacher { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
"""

STOP = set('a an the of to in on and or is are be by for it its as at that this with from was were what which how why your you do does can will into than then when there their they them so if not but each one'.split())


def words(s):
    return [w for w in re.findall(r"[a-z0-9]+", s.lower().replace('’', "'")) if w not in STOP and len(w) > 1]


def soup_of(path_or_text):
    text = path_or_text if '<' in str(path_or_text)[:200] else Path(path_or_text).read_text(encoding='utf-8')
    return BeautifulSoup(text, 'lxml')


def git_text(rev, path):
    rel = Path(path).resolve().relative_to(ROOT).as_posix()
    return subprocess.run(['git', 'show', f'{rev}:{rel}'], cwd=ROOT, capture_output=True, text=True, check=True).stdout


# ───────────────────────── page shell ─────────────────────────

def start_key(student_path, key_old, title_suffix='Answer Key'):
    """Copy the student page, retitle it, add the key CSS and the key bar."""
    s = soup_of(student_path)
    old_title = key_old.title.get_text(strip=True) if key_old.title else ''
    if s.title:
        s.title.string = old_title or (s.title.get_text(strip=True) + ' — ' + title_suffix)
    underscores_to_blanks(s)
    style = s.new_tag('style'); style.string = KEY_CSS
    (s.head or s).append(style)
    # Drop links from the student page to this key ("Answer key →").
    for a in s.find_all('a', href=True):
        if '-answers' in a['href'] or a.get_text(strip=True).lower().startswith('answer key'):
            par = a.parent
            a.decompose()
            if par is not None and par.name in ('p', 'div', 'span') and not par.get_text(strip=True) and not par.find(['img', 'svg']):
                par.decompose()
    h1 = s.find('h1')
    if h1 is not None and 'answer' not in h1.get_text().lower():
        h1.append(' — Answer Key')
    bar = s.new_tag('div'); bar['class'] = ['answer-key-header']; bar.string = 'Answer key · Teacher copy'
    hdr = first_header(s)
    if hdr is not None:
        nxt = hdr.find_next_sibling()
        wrapper = nxt is not None and (nxt.name == 'main' or any(re.search(r'page|wrap|container|content|main', c) for c in (nxt.get('class') or [])))
        if hdr.parent is not None and hdr.parent.name == 'body' and wrapper:
            nxt.insert(0, bar)
        else:
            hdr.insert_after(bar)
    else:
        s.body.insert(0, bar)
    return s


def underscores_to_blanks(s):
    """Typed blanks ("________") become span.b so they can be filled."""
    for node in list(s.body.find_all(string=re.compile(r'_{3,}'))):
        if node.find_parent(['script', 'style', 'svg', 'code', 'pre']) is not None:
            continue
        parts = re.split(r'(_{3,})', str(node))
        new = []
        for part in parts:
            if re.fullmatch(r'_{3,}', part):
                sp = s.new_tag('span'); sp['class'] = ['b', 'b-md' if len(part) >= 6 else 'b-sm']; sp.string = '\xa0'
                new.append(sp)
            elif part:
                new.append(NavigableString(part))
        for n in new:
            node.insert_before(n)
        node.extract()


def first_header(s):
    """The block that holds the page title (h1)."""
    h1 = s.find('h1')
    if h1 is not None:
        el, best = h1, None
        while el is not None and el.name != 'body':
            cls = ' '.join(el.get('class') or [])
            is_wrapper = el.parent is not None and el.parent.name == 'body' and (el.name == 'main' or re.search(r'\b(page|wrap\w*|container|content)\b', cls)) and not re.search(r'header|cover|title|hero|banner', cls)
            if is_wrapper:
                break
            if el is not h1 and re.search(r'header|cover|title|hero|banner|masthead', cls):
                best = el
            if el.parent is not None and el.parent.name == 'body':
                return best or el
            el = el.parent
        return best or h1
    for sel in ['.header-strip', '.cover', 'header', '.title-block', '.doc-header']:
        el = s.select_one(sel)
        if el is not None:
            return el
    return None


def save(s, path, dry):
    html = str(s)
    if not html.lstrip().lower().startswith('<!doctype'):
        html = '<!DOCTYPE html>\n' + html
    if dry:
        print(f'   (dry run) would write {Path(path).relative_to(ROOT)}')
    else:
        Path(path).write_text(html, encoding='utf-8')
        print(f'   wrote {Path(path).relative_to(ROOT)}')


# ───────────────────────── blanks ─────────────────────────

BLOCKS = ['p', 'li', 'td', 'th', 'dd', 'dt', 'figcaption', 'h4', 'h5', 'caption', 'label']


def is_blank(el):
    if not isinstance(el, Tag):
        return False
    cls = el.get('class') or []
    if el.name == 'span' and ('b' in cls or 'blank' in cls or 'fill' in cls or 'al' in cls):
        return True
    return False


def block_of(blank):
    el = blank.parent
    while el is not None and el.name not in BLOCKS and el.name != 'div':
        el = el.parent
    return el


def fill(s, blank, text):
    blank.clear()
    frag = BeautifulSoup(f'<span>{text}</span>', 'html.parser').span
    for c in list(frag.contents):
        blank.append(c)
    blank['class'] = ['ak-fill']


def answer_box(s, inner_html, label='Answer'):
    d = s.new_tag('div'); d['class'] = ['ak-answer']
    frag = BeautifulSoup(f'<div><span class="ak-label">{label}</span> {inner_html}</div>', 'html.parser').div
    for c in list(frag.contents):
        d.append(c)
    return d


def teacher_box(s, inner_html, label='Teacher note'):
    d = s.new_tag('div'); d['class'] = ['ak-teacher']
    frag = BeautifulSoup(f'<div><span class="ak-label">{label}</span> {inner_html}</div>', 'html.parser').div
    for c in list(frag.contents):
        d.append(c)
    return d


def sections(s, tag='h2'):
    """Split the body into (heading text, [elements in doc order]) by heading tag."""
    out = []
    heads = s.body.find_all(tag)
    for i, h in enumerate(heads):
        out.append((h.get_text(' ', strip=True), h))
    return out


def in_section(el, head, next_head):
    """True if el comes after head and before next_head in document order."""
    return el.sourceline is not None  # placeholder, replaced by index map


class Doc:
    """Document-order index so we can scope blanks to a section."""
    def __init__(self, s):
        self.s = s
        self.order = {}
        for i, el in enumerate(s.body.descendants):
            if isinstance(el, Tag):
                self.order[id(el)] = i

    def idx(self, el):
        return self.order.get(id(el), -1)

    def between(self, items, a, b):
        ia = self.idx(a) if a is not None else -1
        ib = self.idx(b) if b is not None else 10**9
        return [x for x in items if ia < self.idx(x) < ib]


def blank_text(block):
    """Block text with blanks shown as ___ ."""
    parts = []
    for el in block.descendants:
        if isinstance(el, NavigableString) and not any(is_blank(p) for p in el.parents if isinstance(p, Tag)):
            parts.append(str(el))
        elif is_blank(el):
            parts.append(' ___ ')
    return re.sub(r'\s+', ' ', ''.join(parts)).strip()


def context_words(blank, span=9):
    """Words just before and after a blank, inside its block."""
    blk = block_of(blank)
    marker = '⁣'
    t = blank_text_marked(blk, blank, marker)
    i = t.find(marker)
    before = words(t[:i])[-span:]
    after = words(t[i + 1:])[:span]
    near, whole = set(before + after), set(words(t))
    td = blank.find_parent(['td', 'th'])
    if td is not None:
        tr = td.find_parent('tr')
        cells = tr.find_all(['td', 'th'], recursive=False) if tr else []
        rowlab = set(words(cells[0].get_text(' ', strip=True))) if cells else set()
        col = set()
        table = td.find_parent('table')
        if table is not None and td in cells:
            ci = cells.index(td)
            hr = table.find('tr')
            hcells = hr.find_all(['th', 'td'], recursive=False) if hr else []
            if hr is not tr and ci < len(hcells):
                col = set(words(hcells[ci].get_text(' ', strip=True)))
        near |= rowlab | col
        whole |= rowlab | col | set(words(tr.get_text(' ', strip=True))) if tr else set()
    return near, whole


def blank_text_marked(block, target, marker):
    parts = []
    for el in block.descendants:
        if isinstance(el, NavigableString) and not any(is_blank(p) for p in el.parents if isinstance(p, Tag)):
            parts.append(str(el))
        elif is_blank(el):
            parts.append(f' {marker} ' if el is target else ' ___ ')
    return re.sub(r'\s+', ' ', ''.join(parts))


UNPLACED = []
MORE = []
TEACH = []
CONSUMED = set()


def step_text(prompt, answer):
    if re.search(r'_{2,}', prompt):
        return re.sub(r'_{2,}', lambda m: f'<strong>{answer}</strong>', prompt, count=1)
    if len(BeautifulSoup(answer, 'html.parser').get_text()) <= 30 and len(prompt) <= 60:
        return f'{prompt}: <strong>{answer}</strong>'
    return answer


def space_context(el):
    bits = []
    prev = el.previous_sibling
    n = 0
    while prev is not None and n < 2:
        if isinstance(prev, Tag):
            if prev.select_one(SPACE_SEL) is not None or any(c in (prev.get('class') or []) for c in ('response', 'al', 'ak-answer')):
                break
            bits.insert(0, prev.get_text(' ', strip=True)); n += 1
        elif str(prev).strip():
            bits.insert(0, str(prev).strip()); n += 1
        prev = prev.previous_sibling
    par = el.parent
    if par is not None:
        bits.insert(0, ''.join(str(c) for c in par.children if isinstance(c, NavigableString)))
    return set(words(' '.join(bits)))


def place_in_spaces(s, doc, items, spaces, report, where=''):
    """Put answers that have no blank into the empty writing spaces of the
    section, keeping page order; several answers can share one space."""
    spaces = [x for x in spaces if x.parent is not None and not x.get_text(strip=True)]
    if not items or not spaces:
        for pr, a in items:
            MORE.append(step_text(pr, a))
        return
    ctx = [space_context(x) for x in spaces]
    groups = {}
    last = 0
    for pr, a in items:
        pw = words(re.sub(r'_+', ' ', pr))
        best, sc = None, -1
        for j in range(len(spaces)):
            ov = sum(w in ctx[j] for w in pw) / max(1, len(pw))
            v = ov - (0.15 if j < last else 0) - 0.01 * abs(j - last)
            if v > sc:
                best, sc = j, v
        if sc < 0.2 or not pw:
            MORE.append(step_text(pr, a) if re.search(r'_{2,}', pr) or len(pr) < 60 else a)
            continue
        groups.setdefault(best, []).append(step_text(pr, a))
        last = best
    for j, parts in groups.items():
        sp = spaces[j]
        box = answer_box(s, '<br>'.join(parts))
        sp.insert_before(box)
        # remove this space and any empty lines right after it
        nx = sp.find_next_sibling()
        sp.decompose()
        while nx is not None and nx in spaces and nx is not None and not any(nx is spaces[k] for k in groups):
            nn = nx.find_next_sibling(); nx.decompose(); nx = nn


def fill_by_prompts(s, doc, rows, scope_blanks, report, exclude=lambda b: False):
    """rows: list of (prompt text, [answers]). Align answers to blanks in order
    (like a diff), scoring each pair by how well the prompt's words fit the
    words around the blank. Extra blanks or extra answers are skipped and
    reported. Returns number of answers placed."""
    blanks = [b for b in scope_blanks if not exclude(b)]
    items = []
    for prompt, answers in rows:
        pw = words(re.sub(r'_+', ' ', prompt))
        for a in answers:
            items.append((prompt, pw, a))
    if not blanks or not items:
        UNPLACED.extend((it[0], it[2]) for it in items)
        return 0
    ctx = [context_words(b) for b in blanks]

    def sim(it, j):
        pw = it[1]
        if not pw:
            return 0.5
        near, whole = ctx[j]
        return (0.6 * sum(w in near for w in pw) + 0.4 * sum(w in whole for w in pw)) / len(pw)

    n, m = len(items), len(blanks)
    SKIP_B, SKIP_A = -0.35, -0.9
    NEG = -1e9
    D = [[NEG] * (m + 1) for _ in range(n + 1)]
    P = [[None] * (m + 1) for _ in range(n + 1)]
    D[0][0] = 0
    for i in range(n + 1):
        for j in range(m + 1):
            if i == 0 and j == 0:
                continue
            best, bp = NEG, None
            if i > 0 and j > 0:
                v = D[i - 1][j - 1] + 0.15 + 3 * sim(items[i - 1], j - 1)
                if v > best: best, bp = v, 'M'
            if j > 0:
                v = D[i][j - 1] + SKIP_B
                if v > best: best, bp = v, 'B'
            if i > 0:
                v = D[i - 1][j] + SKIP_A
                if v > best: best, bp = v, 'A'
            D[i][j], P[i][j] = best, bp
    i, j, pairs, skipped_a, skipped_b = n, m, [], [], []
    while i or j:
        bp = P[i][j]
        if bp == 'M':
            pairs.append((i - 1, j - 1)); i -= 1; j -= 1
        elif bp == 'B':
            skipped_b.append(j - 1); j -= 1
        else:
            skipped_a.append(i - 1); i -= 1
    # Repair: undo weak placements, then place leftovers by best fit anywhere.
    assign = {}
    for ii, jj in pairs:
        if items[ii][1] and len(items[ii][1]) >= 2 and sim(items[ii], jj) < 0.2:
            continue
        assign[ii] = jj
    free = set(range(m)) - set(assign.values())
    todo = [i for i in range(n) if i not in assign]
    cand = sorted(((sim(items[i], j), i, j) for i in todo for j in free), reverse=True)
    for sc, i, j in cand:
        if i in assign or j not in free or sc < 0.34:
            continue
        # keep a row's answers in page order: next answer of same prompt goes after
        assign[i] = j; free.discard(j)
    # Last resort: in order, fill a leftover answer into the free blank that
    # sits between its neighbours' blanks (keeps page order).
    for i in range(n):
        if i in assign:
            continue
        lo = max([assign[k] for k in assign if k < i], default=-1)
        hi = min([assign[k] for k in assign if k > i], default=m)
        gap = [j for j in sorted(free) if lo < j < hi]
        if len(gap) >= 1 and (len(gap) == 1 or sim(items[i], gap[0]) >= 0.2):
            assign[i] = gap[0]; free.discard(gap[0])
    for i in range(n):
        if i in assign:
            j = assign[i]
            if items[i][1] and sim(items[i], j) < 0.2:
                report.append(f'check: "{items[i][0]}" → {items[i][2]!r} placed in "{blank_text(block_of(blanks[j]))[:80]}"')
            fill(s, blanks[j], items[i][2])
        else:
            report.append(f'NOT PLACED: "{items[i][0]}" → {items[i][2]!r}')
            UNPLACED.append((items[i][0], items[i][2]))
    for j in sorted(free):
        report.append(f'unfilled: "{blank_text(block_of(blanks[j]))[:90]}"')
    return len(assign)


def fill_by_prompts_greedy(s, doc, rows, scope_blanks, report, exclude=lambda b: False):
    blanks = [b for b in scope_blanks if not exclude(b)]
    if not blanks:
        if rows:
            report.append(f'no blanks in scope for {len(rows)} rows')
        return 0
    # group blanks by block, keep order
    groups, seen = [], {}
    for b in blanks:
        blk = block_of(b)
        k = id(blk)
        if k not in seen:
            seen[k] = len(groups); groups.append([blk, []])
        groups[seen[k]][1].append(b)
    used = {id(b): False for b in blanks}
    cursor = 0
    placed = 0
    for prompt, answers in rows:
        pw = words(re.sub(r'_+', ' ', prompt))
        best, best_score = None, -1
        for gi, (blk, bl) in enumerate(groups):
            free = [b for b in bl if not used[id(b)]]
            if not free:
                continue
            bw = set(words(blank_text(blk)))
            ov = sum(1 for w in pw if w in bw) / max(1, len(pw))
            # prefer forward, near the cursor
            dist = gi - cursor
            pen = 0.0 if 0 <= dist <= 2 else (0.08 if dist > 2 else 0.25)
            pen += 0.01 * abs(dist)
            sc = ov - pen
            if sc > best_score:
                best, best_score = gi, sc
        if best is None:
            report.append(f'NO BLANK LEFT for: {prompt} → {answers}')
            continue
        blk, bl = groups[best]
        free = [b for b in bl if not used[id(b)]]
        if best_score < 0.25 and len(pw) >= 2:
            report.append(f'weak match ({best_score:.2f}) "{prompt}" → "{blank_text(blk)[:80]}"')
        # spill answers into following groups if this block runs out
        gi = best
        for a in answers:
            while gi < len(groups) and not [b for b in groups[gi][1] if not used[id(b)]]:
                gi += 1
            if gi >= len(groups):
                report.append(f'ran out of blanks placing "{a}" ({prompt})'); break
            b = [b for b in groups[gi][1] if not used[id(b)]][0]
            fill(s, b, a); used[id(b)] = True; placed += 1
        if len(answers) < len(free):
            report.append(f'{len(free) - len(answers)} blank(s) left in "{blank_text(blk)[:70]}" after "{prompt}"')
        cursor = gi
    left = [b for b in blanks if not used[id(b)]]
    for b in left:
        report.append(f'unfilled: "{blank_text(block_of(b))[:90]}"')
    return placed


def split_answers(cell_text, prompt=None):
    parts = [a.strip() for a in re.split(r'\s+·\s+', cell_text) if a.strip()]
    k = len(re.findall(r'_{2,}', prompt or ''))
    m = re.search(r'\((\d+)\s+blanks?\)', prompt or '')
    if m:
        k = int(m.group(1))
    if k > 1 and len(parts) == 1:
        for sep in (r'\s*;\s*', r'\s*,\s*', r'\s+and\s+', r'\s*→\s*', r'\s*\+\s*'):
            alt = [a for a in re.split(sep, parts[0]) if a.strip()]
            if len(alt) == k:
                return alt
        alt = [a for a in re.split(r'\s*,\s*', parts[0]) if a.strip()]
        if len(alt) > k:
            return alt[:k - 1] + [', '.join(alt[k - 1:])]
    return parts


def table_rows(table, want_cols=None):
    rows = []
    for tr in table.find_all('tr'):
        tds = tr.find_all('td')
        if not tds:
            continue
        rows.append(tds)
    return rows


def inner(el):
    return ''.join(str(c) for c in el.contents).strip()


# ───────────────────────── adapters ─────────────────────────

def sci6_notes(units, dry, rev):
    units = units or ['climate', 'energy-resources', 'forces', 'living-systems', 'matter', 'space']
    for u in units:
        student = MAT / f'sci6-{u}-notes-v1.html'
        if not student.exists():
            student = MAT / f'sci6-{u}-notes-gr6-v1.html'
        keyp = MAT / f'sci6-{u}-notes-answers-v1.html'
        print(f'== sci6 {u}')
        kold = soup_of(git_text(rev, keyp) if rev else keyp)
        s = start_key(student, kold)
        doc = Doc(s)
        report = []
        # key sections → rows
        ksecs = {}
        for h in kold.body.find_all('h2'):
            m = re.match(r'Section\s+(\d+)', h.get_text(' ', strip=True))
            if not m:
                continue
            t = h.find_next('table')
            rows = []
            for tds in table_rows(t):
                rows.append((tds[0].get_text(' ', strip=True), split_answers(tds[-1].get_text(' ', strip=True), tds[0].get_text(' ', strip=True))))
            ksecs[m.group(1)] = rows
        heads = s.body.find_all('h2')
        all_blanks = s.select('span.b')
        for i, h in enumerate(heads):
            m = re.match(r'Section\s+(\d+)', h.get_text(' ', strip=True))
            if not m or m.group(1) not in ksecs:
                continue
            nxt = heads[i + 1] if i + 1 < len(heads) else None
            scope = doc.between(all_blanks, h, nxt)
            r = []
            n = fill_by_prompts(s, doc, ksecs[m.group(1)], scope, r, exclude=is_vocab_blank)
            print(f'   Section {m.group(1)}: placed {n}')
            report += [f'   S{m.group(1)}: ' + x for x in r]
        apply_overrides(s, f'sci6-{u}-notes', report)
        print('\n'.join(report))
        save(s, keyp, dry)


def override_blanks(s):
    return [b for b in s.select('span.b, span.al, span.blank, span.ak-fill') if not is_vocab_blank(b)]


def apply_overrides(s, name, report):
    """FULL[name]: every non-vocab blank in page order (None = leave empty).
    FIX[name]: {blank index: answer} patches after automatic placement.
    Indexes count span.b blanks outside vocab tables, in page order."""
    bl = override_blanks(s)
    if name in FULL:
        ans = FULL[name]
        report.clear()
        if len(ans) != len(bl):
            report.append(f'   FULL list has {len(ans)} answers for {len(bl)} blanks — check')
        for b, a in zip(bl, ans):
            if a is None:
                if 'ak-fill' in (b.get('class') or []):
                    b.clear(); b.append('\xa0'); b['class'] = ['b', 'b-md']
            else:
                fill(s, b, a)
    for i, a in FIX.get(name, {}).items():
        if a is None:
            bl[i].clear(); bl[i].append('\xa0'); bl[i]['class'] = ['b', 'b-md']
        else:
            fill(s, bl[i], a)


FULL = {
    'sci6-matter-notes': [
        'mass', 'space', 'particles', 'spaces', 'moving', 'speed', 'fast', 'hotter / warmer', 'colder / cooler',
        'particles', 'space', 'moving', 'faster', 'further apart', 'slower', 'closer together',
        'tightly / closely', 'vibrate in place', 'fixed / definite', 'fixed / definite',
        'close', 'past', 'not fixed', 'fixed / definite', 'far', 'fast', 'not fixed', 'not fixed',
        'very close, tightly packed', 'far apart', 'slide', 'Yes', 'Yes', 'No',
        'melting', 'freezing', 'evaporation / boiling', 'condensation',
        'amount', 'temperature', 'phase change', 'mass', 'arrangement', 'speed / movement', '100', '100', 'can',
        'freezes (0°C)', 'boils (100°C)', 'reliable / consistent', 'increases', 'expands', 'decreases', 'contracts',
        'volume', 'squeeze', 'stir', 'breaks', 'eye level', 'stabilise / stop changing',
        'heated', 'expands', 'cooled', 'contracts', 'gaps', 'bend / warp', 'summer', 'winter',
        'denser / more dense', 'dense', 'less', 'more', 'floats', 'open (hexagonal)',
        'top / surface', '4', 'below the ice', 'from the bottom', 'the top',
        'expands', 'contracts', 'expands', 'further apart',
        None, None, None,
    ],
}
FIX = {
    'sci7-heat-temperature-notes': {85: 'radiation', 86: 'conduction', 87: 'convection'},
    'sci7-structures-forces-notes': {
        57: 'tension', 58: 'compression', 59: 'shear',
        94: 'ramp', 95: 'staircase', 96: 'switchback mountain road',
        108: '200 N', 109: '50 N', 110: '4',
        125: 'solid', 126: 'compression', 127: 'frame', 128: 'tension',
        129: 'frame', 130: 'tension', 131: 'solid', 132: 'compression',
    },
    'sci6-energy-resources-notes': {
        27: 'burning logs directly to heat a room', 28: 'converting wood to charcoal, which burns hotter and cleaner',
        29: 'a south-facing window lets sunlight warm a room directly', 30: 'a photovoltaic (PV) cell converts sunlight into electricity',
    },
    'sci6-living-systems-notes': {
        7: 'spruce, pine, moose', 8: 'black bear, raven, wolf',
        10: 'cattails, ducks', 11: 'frogs, beavers, muskrats',
        13: 'grasses, pronghorn', 14: 'ground squirrels, hawks',
        16: 'kelp, plankton', 17: 'fish, whales',
        20: 'water (H₂O)', 21: 'glucose', 22: 'oxygen',
        40: 'Oxygen', 49: 'Clothing / textiles', 50: 'Building materials', 51: 'Medicine',
    },
    'sci6-space-notes': {
        17: 'reflects', 18: 'meteor', 26: 'Emit', 27: 'Reflect', 29: 'not', 46: 'Earth',
    },
}


# ───────────────────────── question-numbered answers ─────────────────────────

NUM_SEL = '.q-num, .qnum, .sq-num, .badge-num, .q-number, .num-badge, .s-num, .badge-qnum, .badge-stretch'
CARD_CLASSES = ('q-card', 'question', 'stretch-q', 'stretch-card', 'stretch', 'q', 'meta-q', 'synth-q', 'rc-q', 'task', 'q-block')
SPACE_SEL = ('.resp, .resp-line, .al, .al-sm, .lines, .draw-area, .ws, .work, .work-box, .response, '
             '.answer-lines, .write-lines, .ans-lines, .work-space, .writing-lines, .line, .wl, .blank-line')


def qid(text):
    t = re.sub(r'[★☆\s.:)]', '', text).upper()
    t = re.sub(r'^(Q|QUESTION)', '', t)
    return t


def find_cards(s):
    """[(id, card element)] in page order."""
    out, seen = [], set()
    for n in s.select(NUM_SEL):
        card = n
        while card is not None and card.name != 'body':
            cls = card.get('class') or []
            if card is not n and any(c in CARD_CLASSES for c in cls):
                break
            card = card.parent
        if card is None or card.name == 'body' or id(card) in seen:
            continue
        seen.add(id(card))
        out.append((qid(n.get_text(' ', strip=True)), card))
    return out


def card_blanks(card):
    out = []
    for el in card.find_all('span'):
        if el.get_text(strip=True):
            continue
        st = (el.get('style') or '').replace(' ', '')
        if is_blank(el) and 'al' not in (el.get('class') or []) or 'border-bottom' in st:
            out.append(el)
    return out


def try_inline(s, card, html):
    """Short list answers ("a · b · c") go straight into the card's blanks.
    Returns True if every blank was filled and nothing else is left to say."""
    txt = BeautifulSoup(html, 'html.parser').get_text(' ', strip=True)
    core = re.sub(r'\s*\([^)]*\)\s*$', '', txt).strip()
    parts = [x.strip() for x in re.split(r'\s+·\s+', core) if x.strip()]
    bl = card_blanks(card)
    if len(parts) < 1 or len(parts) != len(bl) or any(len(x) > 40 for x in parts) or re.search(r'[.!?]\s', core):
        return False
    for b, a in zip(bl, parts):
        fill(s, b, a)
    return core == txt


def put_answer(s, card, html, label='Answer', keep_space=False):
    """Remove the card's empty writing space and add an answer box at the end."""
    if try_inline(s, card, html):
        return None
    box = answer_box(s, html, label)
    if not keep_space:
        for el in card.select(SPACE_SEL):
            if el.parent is not None and not el.get_text(strip=True) and not el.find(['svg', 'img', 'table']):
                el.decompose()
    body = card.select_one('.q-body') or card
    body.append(box)
    return box


def inject_by_qnum(s, answers, report, label='Answer'):
    """answers: {id: html}. Puts each answer in its question card."""
    cards = find_cards(s)
    done = set()
    for q, card in cards:
        if q in answers:
            put_answer(s, card, answers[q], label)
            done.add(q)
        else:
            report.append(f'   no key answer for question {q}')
    for q in answers:
        if q not in done:
            report.append(f'   key answer {q} has no question card')
    return len(done)



QMARK = re.compile(r'^\s*(?:Q(?:uestion)?\s*)?((?:S|Q)?\d+[a-z]?)\b\s*(?:[★☆]+\s*)?(?:[—–:.)-](?!\d)|$)', re.I)


def key_blocks(kold):
    blocks = []
    body = kold.body
    BLOCK = ('div', 'p', 'h2', 'h3', 'h4', 'h5', 'table', 'ul', 'ol', 'section', 'figure', 'blockquote', 'hr')
    def walk(el):
        for c in el.children:
            if not isinstance(c, Tag):
                continue
            cls = c.get('class') or []
            if c.name in ('div', 'section', 'main', 'article') and not any(k in cls for k in ('answer', 'ans', 'worked-example', 'misconception', 'note', 'callout', 'box')) \
                    and any(isinstance(x, Tag) and x.name in BLOCK for x in c.children):
                walk(c); continue
            blocks.append(c)
    walk(body)
    return blocks


def parse_seq_key(kold, start=None, stop_tags=('h2', 'hr')):
    """Answers laid out as a label ("Q3 — title", "S1", "3.") followed by
    content. Returns {id: html}. Section headings end an answer."""
    answers, order = {}, []
    cur = None
    blocks = key_blocks(kold)
    for b in blocks:
        txt = b.get_text(' ', strip=True)
        if b.name in stop_tags and not (b.name == 'h2' and QMARK.match(txt)):
            cur = None
        m = None
        if b.name in ('p', 'h2', 'h3', 'h4', 'h5', 'div', 'li'):
            lead = b.find(['strong', 'b', 'span'])
            lt = lead.get_text(' ', strip=True) if lead is not None else ''
            if lead is not None and txt.startswith(lt[:3]):
                m = QMARK.match(lt)
            if m is None and b.name in ('h2', 'h3', 'h4', 'h5'):
                m = QMARK.match(txt)
        if m:
            q = qid(m.group(1))
            cur = q; order.append(q)
            # keep the rest of this block after the label, if any
            rest = BeautifulSoup(str(b), 'html.parser').find(b.name)
            lead2 = rest.find(['strong', 'b', 'span'])
            if b.name in ('p', 'div', 'li') and lead2 is not None:
                lead2.decompose()
                r = inner(rest).strip()
                r = re.sub(r'^\s*\(\s*\d+\s*marks?[^)]*\)\s*', '', r)
                answers[q] = [r] if BeautifulSoup(r, 'html.parser').get_text(strip=True) else []
            else:
                answers[q] = []
            continue
        if cur is not None and b.name not in stop_tags:
            answers[cur].append(str(b))
    return {q: ''.join(v) for q, v in answers.items()}


def norm(s):
    return ' '.join(words(s))


def best_key_row(label, krows):
    lw = norm(label)
    best, sc = None, 0
    for kr in krows:
        r = difflib.SequenceMatcher(None, lw, norm(kr[0].get_text(' ', strip=True))).ratio()
        if r > sc:
            best, sc = kr, r
    return best if sc >= 0.75 else None


def fill_cell(s, td, html):
    td.clear()
    short = len(BeautifulSoup(html, 'html.parser').get_text()) <= 60
    span = s.new_tag('span'); span['class'] = ['ak-fill'] if short else ['ak-text']
    frag = BeautifulSoup(f'<x>{html}</x>', 'html.parser').x
    for c in list(frag.contents):
        span.append(c)
    td.append(span)


def fill_table(s, stable, ktable, report, where=''):
    """Fill a student table from the key table with the same row labels.
    Cells that are empty (or only blanks) on the student page get the key's
    cell in the same column."""
    krows = [tr.find_all(['td', 'th']) for tr in ktable.find_all('tr') if tr.find('td')]
    n = 0
    for tr in stable.find_all('tr'):
        cells = tr.find_all(['td', 'th'], recursive=False)
        if not cells or not tr.find('td'):
            continue
        kr = best_key_row(cells[0].get_text(' ', strip=True), krows)
        if kr is None:
            if any(not c.get_text(strip=True) for c in cells[1:]):
                report.append(f'   {where}: no key row for "{cells[0].get_text(" ", strip=True)[:50]}"')
            continue
        for ci, c in enumerate(cells[1:], 1):
            if ci < len(kr) and not c.get_text(strip=True) and kr[ci].get_text(strip=True):
                fill_cell(s, c, inner(kr[ci])); n += 1
            elif ci < len(kr) and c.find(is_blank) and kr[ci].get_text(strip=True) and not c.get_text(strip=True):
                fill_cell(s, c, inner(kr[ci])); n += 1
    return n


def fill_table_from_rows(s, st, rows, report, where=''):
    """Guided rows like "Levels table — Population: what it includes / example"
    → fill that table row's empty cells (answer split on ' / ')."""
    for tr in st.find_all('tr'):
        cells = tr.find_all(['td', 'th'], recursive=False)
        if not cells or not tr.find('td'):
            continue
        empty = [c for c in cells[1:] if not c.get_text(strip=True)]
        if not empty:
            continue
        lab = norm(cells[0].get_text(' ', strip=True))
        hit = None
        for prompt, ans in rows:
            m = re.search(r'—\s*([^:]+):', prompt) or re.match(r'\s*([^→:]+?)\s*(?:→|:)', prompt)
            if m and norm(m.group(1)) == lab:
                hit = ans; CONSUMED.add(prompt); break
        if hit is None:
            if not is_vocab_table(st):
                report.append(f'   {where}: no key row for "{cells[0].get_text(" ", strip=True)[:50]}"')
            continue
        text = ' · '.join(hit)
        parts = [x.strip() for x in text.split(' / ')] if len(empty) > 1 else [text]
        if len(parts) != len(empty):
            parts = [text] + [''] * (len(empty) - 1)
        for c, a in zip(empty, parts):
            if a:
                fill_cell(s, c, a)


def answer_list_items(s, items, answers, report, where=''):
    """items: student question elements (li/p) in order; answers: html list."""
    for i, el in enumerate(items):
        if i >= len(answers):
            report.append(f'   {where}: no answer for item {i + 1}'); continue
        # remove writing lines inside the item and right after it
        for a in el.select(SPACE_SEL):
            if not a.get_text(strip=True):
                a.decompose()
        sib = el.find_next_sibling()
        while sib is not None and sib.name == 'div' and any(c in (sib.get('class') or []) for c in ('al', 'al-sm', 'lines', 'resp', 'resp-line', 'response')) and not sib.get_text(strip=True):
            nx = sib.find_next_sibling(); sib.decompose(); sib = nx
        box = answer_box(s, answers[i])
        if el.name == 'li':
            el.append(box)
        else:
            el.insert_after(box)
    if len(answers) > len(items) and items:
        # Questions the page sets out as paragraphs or sketches: list the rest
        # of the key's answers together after the last question.
        extra = answers[len(items):]
        html = '<ol start="%d">' % (len(items) + 1) + ''.join(f'<li>{a}</li>' for a in extra) + '</ol>'
        last = items[-1]
        box = answer_box(s, html, 'More answers')
        (last.parent if last.name == 'li' and last.parent is not None else last).insert_after(box)


def strip_label(html):
    """Drop a leading <strong>Stretch:</strong>-style label repeated from the question."""
    return html


def is_guided_table(kt):
    hdr = ' '.join(th.get_text(' ', strip=True).lower() for th in kt.find_all('th'))
    return 'blank' in hdr or 'prompt' in hdr


def is_qa_table(kt):
    ths = [th.get_text(' ', strip=True).lower() for th in kt.find_all('th')]
    return bool(ths) and ths[0].startswith('question') or (len(ths) == 2 and ths[0] in ('q', '#', 'item'))


def build_notes_key(student, keyp, name, rev, dry):
    kold = soup_of(git_text(rev, keyp) if rev else keyp)
    s = start_key(student, kold)
    doc = Doc(s)
    kdoc = Doc(kold)
    report = []
    sheads = s.body.find_all('h2')
    kheads = kold.body.find_all('h2')
    used_k = set()
    for i, h in enumerate(sheads):
        title = h.get_text(' ', strip=True)
        cands = [k for k in kheads if id(k) not in used_k]
        kh = max(cands, key=lambda k: difflib.SequenceMatcher(None, norm(k.get_text(' ', strip=True)), norm(title)).ratio(), default=None)
        if kh is None or difflib.SequenceMatcher(None, norm(kh.get_text(' ', strip=True)), norm(title)).ratio() < 0.6:
            continue
        used_k.add(id(kh))
        nxt = sheads[i + 1] if i + 1 < len(sheads) else None
        ki = kheads.index(kh)
        knext = kheads[ki + 1] if ki + 1 < len(kheads) else None
        ktables = kdoc.between(kold.find_all('table'), kh, knext)
        stables = doc.between(s.find_all('table'), h, nxt)
        tag = (title.split(':')[0].split('—')[0].strip() or title)[:14]
        # 1. guided-notes blanks
        rows = []
        for kt in ktables:
            if is_guided_table(kt):
                ths = [th.get_text(' ', strip=True).lower() for th in kt.find_all('th')]
                pc = next((j for j, x in enumerate(ths) if 'blank' in x or 'prompt' in x), 0)
                ac = next((j for j, x in enumerate(ths) if 'answer' in x and j != pc), pc + 1)
                for tr in kt.find_all('tr'):
                    tds = tr.find_all('td')
                    if len(tds) > max(pc, ac):
                        pr = tds[pc].get_text(' ', strip=True)
                        rows.append((pr, split_answers(tds[ac].get_text(' ', strip=True), pr)))
        qitems_sel = '.retrieval li, .retrieval .rc-q, .synth-q, .rc-q'
        scope = [b for b in doc.between(s.select('span.b, span.al, span.blank'), h, nxt)
                 if b.find_parent(class_=['retrieval', 'synth-q', 'rc-q', 'synthesis']) is None]
        r = []
        UNPLACED.clear(); CONSUMED.clear(); MORE.clear(); TEACH.clear()
        fill_by_prompts(s, doc, rows, scope, r)
        report += [f'   {tag}: ' + x for x in r if not x.startswith('NOT PLACED')]
        # 2. other tables, filled by row label
        other_k = [kt for kt in ktables if not is_guided_table(kt) and not is_qa_table(kt)]
        used_tables = set()
        for st in stables:
            if st.find_parent(class_=['retrieval', 'synth-q', 'rc-q']) is not None:
                continue
            if not any(not c.get_text(strip=True) or c.find(is_blank) for c in st.find_all('td')):
                continue
            def score(kt):
                kr = [x.find_all(['td', 'th']) for x in kt.find_all('tr') if x.find('td')]
                return sum(1 for tr in st.find_all('tr') if tr.find('td') and best_key_row(tr.find(['td', 'th']).get_text(' ', strip=True), kr))
            kt = max(other_k, key=score, default=None)
            if kt is not None and score(kt) >= 2 and fill_table(s, st, kt, [], tag):
                used_tables.add(id(kt))
                continue
            fill_table_from_rows(s, st, rows, report, tag)
        left = [x for x in UNPLACED if x[0] not in CONSUMED]
        for kt in other_k:
            if id(kt) not in used_tables and not (kt.find_parent(class_='retrieval')):
                cap = kt.find_previous(['h3', 'h4', 'p'])
                lab = cap.get_text(' ', strip=True) if cap is not None and len(cap.get_text(strip=True)) < 80 else ''
                MORE.append((f'<strong>{lab}</strong>' if lab else '') + str(kt))
        spaces = [x for x in doc.between(s.select(SPACE_SEL), h, nxt)
                  if x.find_parent(class_=['retrieval', 'synth-q', 'rc-q', 'synthesis', 'pre-knowledge', 'pre-check', 'ak-answer']) is None
                  and not (x.find_parent('td') is not None and is_vocab_table(x.find_parent('table')))]
        place_in_spaces(s, doc, left, spaces, report, tag)
        # 3. retrieval / synthesis questions, in order
        sitems = [x for x in doc.between(s.select(qitems_sel), h, nxt)]
        # drop li inside rc-q etc. (keep outermost)
        sitems = [x for x in sitems if not any(p in sitems for p in x.parents)]
        kans = []
        for el in kdoc.between(kold.find_all(['h3', 'h4', 'div', 'table']), kh, knext):
            if el.name in ('h3', 'h4') and re.search(r'retrieval|check', el.get_text(), re.I):
                ol = el.find_next_sibling(['ol', 'ul'])
                if ol is not None:
                    kans += [inner(li) for li in ol.find_all('li', recursive=False)]
            elif el.name == 'table' and is_qa_table(el):
                for tr in el.find_all('tr'):
                    tds = tr.find_all('td')
                    if len(tds) >= 2:
                        kans.append(inner(tds[-1]))
            elif el.name == 'div' and 'retrieval' in (el.get('class') or []) and not el.find('table'):
                ol = el.find(['ol', 'ul'])
                if ol is not None:
                    kans += [inner(li) for li in ol.find_all('li', recursive=False)]
        if sitems and kans:
            answer_list_items(s, sitems, kans, report, tag + ' questions')
        elif sitems and not kans:
            report.append(f'   {tag}: {len(sitems)} questions, no key answers found')
        # 4. numbered prompts: <p><strong>2.</strong> ...
        nums = [p for p in doc.between(s.find_all('p'), h, nxt) if p.find('strong') and re.match(r'^\d+\.$', p.find('strong').get_text(strip=True))]
        if nums:
            kitems = {}
            for ol in kdoc.between(kold.find_all('ol'), kh, knext):
                st0 = int(ol.get('start', 1))
                for j, li in enumerate(ol.find_all('li', recursive=False)):
                    kitems[st0 + j] = li
            for p in nums:
                k = int(p.find('strong').get_text(strip=True)[:-1])
                li = kitems.get(k)
                if li is None:
                    continue
                lab = li.find('strong')
                html = inner(li)
                if lab is not None and html.startswith(str(lab)):
                    html = html[len(str(lab)):].strip()
                if not BeautifulSoup(html, 'html.parser').get_text(strip=True):
                    continue
                answer_list_items(s, [p], [html], report, tag + f' Q{k}')
        # teacher-only boxes in the old key (misconception targets, flags)
        stext = norm(s.body.get_text(' ', strip=True))
        for kb in kdoc.between(kold.find_all('div'), kh, knext):
            cls = ' '.join(kb.get('class') or [])
            if not re.search(r'misconception|flag|note|teacher|annot|tip|warning|risk', cls):
                continue
            if any(re.search(r'misconception|flag|note|teacher|annot|tip|warning|risk', ' '.join(p.get('class') or [])) for p in kb.parents if isinstance(p, Tag)):
                continue
            kt = norm(kb.get_text(' ', strip=True))
            if not kt or kt[:60] in stext:
                continue
            TEACH.append(inner(kb))
        if MORE:
            box = answer_box(s, '<ul>' + ''.join(f'<li>{x}</li>' for x in MORE) + '</ul>', 'More answers for this section')
            end = nxt.find_previous_sibling() if nxt is not None else None
            anchor = None
            # last top-level element before the next heading, in this heading's parent
            sib = h
            while sib is not None and sib is not nxt:
                if isinstance(sib, Tag):
                    anchor = sib
                sib = sib.find_next_sibling()
                if sib is not None and sib.find('h2') is not None:
                    break
            (anchor or h).insert_after(box)
            report.append(f'   {tag}: {len(MORE)} answers listed at section end')
        if TEACH:
            sib, anchor = h, None
            while sib is not None and sib is not nxt:
                if isinstance(sib, Tag):
                    anchor = sib
                sib = sib.find_next_sibling()
                if sib is not None and sib.find('h2') is not None:
                    break
            for x in reversed(TEACH):
                (anchor or h).insert_after(teacher_box(s, x))
    apply_overrides(s, name, report)
    print('\n'.join(report))
    save(s, keyp, dry)


def sci7_notes(units, dry, rev):
    units = units or ['heat-temperature', 'interactions-ecosystems', 'planet-earth', 'plants-food-fibre', 'structures-forces']
    for u in units:
        print(f'== sci7 {u} notes')
        build_notes_key(MAT / f'sci7-{u}-notes-v1.html', MAT / f'sci7-{u}-notes-answers-v2.html', f'sci7-{u}-notes', rev, dry)


def math9_notes(units, dry, rev):
    base = MAT / 'math-9' / 'notes'
    units = units or sorted(p.name for p in base.iterdir() if p.is_dir())
    for u in units:
        for keyp in sorted((base / u).glob('*-notes-answers-v*.html')):
            student = Path(str(keyp).replace('-answers', ''))
            print(f'== math9 {u} notes')
            build_notes_key(student, keyp, keyp.stem.replace('-answers', '').rsplit('-v', 1)[0], rev, dry)


NUMRE = re.compile(r'^\s*((?:S|Q)?\d+[a-z]?)\s*[.):]?\s*$', re.I)


def card_number(card):
    n = card.select_one(NUM_SEL)
    if n is not None:
        return qid(n.get_text(' ', strip=True))
    hd = card.find(['h2', 'h3', 'h4'])
    if hd is not None and hd is next((x for x in card.find_all(True) if x.name in ('h2', 'h3', 'h4', 'p')), None):
        m = QMARK.match(hd.get_text(' ', strip=True))
        if m:
            return qid(m.group(1))
    first = card.find(['strong', 'b'])
    if first is not None:
        m = NUMRE.match(first.get_text(' ', strip=True))
        ft = first.get_text(' ', strip=True)
        if m and 0 <= card.get_text(' ', strip=True).find(ft) <= 8:
            return qid(m.group(1))
    return None


def find_numbered_cards(s, classes=CARD_CLASSES):
    out, seen = [], set()
    for el in s.body.find_all(['div', 'section', 'li']):
        cls = el.get('class') or []
        if not any(c in classes for c in cls):
            continue
        if any(id(p) in seen for p in el.parents):
            continue
        q = card_number(el)
        if q:
            seen.add(id(el)); out.append((q, el))
    return out


def key_answers_numbered(kold):
    """{id: html} from a key laid out as question blocks, numbered
    paragraphs or answer tables."""
    ans = {}
    # 1. question blocks
    for q, card in find_numbered_cards(kold):
        c = BeautifulSoup(str(card), 'html.parser').find(card.name)
        for lab in c.select('.a-label, .ans-label, .answer-label'):
            lab.decompose()
        boxes = c.select('.answer, .model-answer, .ans, .answer-box')
        if boxes:
            ans.setdefault(q, ''.join(inner(b) for b in boxes))
            continue
        for x in c.select('.q-header, .q-context, .badge, .q-num'):
            x.decompose()
        kids = [k for k in c.children if isinstance(k, Tag)]
        if kids:
            first = kids[0]
            lead = first.find(['strong', 'b'])
            if first.select_one(NUM_SEL) is not None or (lead is not None and NUMRE.match(lead.get_text(' ', strip=True))):
                # keep anything after the number in the first line if it is an answer (has bold or =)
                if lead is not None:
                    lead.decompose()
                ftxt = first.get_text(' ', strip=True)
                if not (first.find(['strong', 'b']) or '=' in ftxt) or first.select_one(NUM_SEL) is not None:
                    first.decompose()
        ans.setdefault(q, inner(c))
    # 2. answer tables: first cell is a question number
    for tb in kold.find_all('table'):
        ths = [th.get_text(' ', strip=True) for th in tb.find_all('th')]
        if not ths or not re.match(r'^(q|#|q#|qn|question|item|no\.?|number)$', ths[0].strip().lower()):
            continue
        for tr in tb.find_all('tr'):
            tds = tr.find_all('td')
            if len(tds) < 2:
                continue
            m = NUMRE.match(tds[0].get_text(' ', strip=True))
            if not m:
                continue
            q = qid(m.group(1))
            if q in ans or q == '0':
                continue
            parts = []
            for j, td in enumerate(tds[1:], 1):
                if not td.get_text(strip=True):
                    continue
                lab = ths[j] if j < len(ths) and len(ths) == len(tds) else ''
                if j == 1:
                    parts.append(f'<strong>{inner(td)}</strong>' if len(td.get_text(strip=True)) < 12 else inner(td))
                else:
                    parts.append((f'<em>{lab}:</em> ' if lab else '') + inner(td))
            ans[q] = ' · '.join(parts)
    # 3. numbered paragraphs
    for q, h in parse_seq_key(kold).items():
        if q not in ans and BeautifulSoup(h, 'html.parser').get_text(strip=True):
            ans[q] = h
    return ans


def key_preamble(kold):
    """Teacher material in the old key before the first answer: outcome maps, notes."""
    out = []
    for el in key_blocks(kold):
        cls = ' '.join(el.get('class') or [])
        txt = el.get_text(' ', strip=True)
        if re.search(r'header|cover|answer-key|course-label', cls) or el.name in ('script', 'style', 'nav', 'h1'):
            continue
        if el.name in ('h2', 'h3') and re.search(r'part|section|question|stretch|core|^q\d|^\d', txt, re.I):
            break
        if card_number(el) or (el.find('strong') and NUMRE.match(el.find('strong').get_text(' ', strip=True)) and txt.startswith(el.find('strong').get_text(' ', strip=True)[:2])):
            break
        if el.name == 'table' and any(NUMRE.match(tr.find('td').get_text(' ', strip=True)) for tr in el.find_all('tr') if tr.find('td')) \
                and not re.search(r'\bLO\b|outcome', el.get_text(' ', strip=True)[:60]):
            break
        if re.search(r'not for students|^name\s*:|teacher copy|answer key\s*$', txt, re.I) or not txt:
            # cover lines from the old key; keep any real note inside
            if el.find(['table']) is None and len(txt) < 160:
                continue
            el = BeautifulSoup(str(el), 'html.parser').find(el.name)
            for x in el.find_all(['p', 'div', 'span']):
                if re.search(r'not for students|^name\s*:|teacher copy', x.get_text(' ', strip=True), re.I) and len(x.get_text(strip=True)) < 160:
                    x.decompose()
            if not el.get_text(strip=True):
                continue
        out.append(str(el))
    return ''.join(out)


def build_numbered_key(student, keyp, name, rev, dry, preamble=True):
    kold = soup_of(git_text(rev, keyp) if rev else keyp)
    s = start_key(student, kold)
    answers = key_answers_numbered(kold)
    cards = find_numbered_cards(s)
    report = []
    done = set()
    for q, card in cards:
        if q in answers and q not in done:
            put_answer(s, card, answers[q])
            done.add(q)
    missing_cards = [q for q, _ in cards if q not in answers]
    extra = [q for q in answers if q not in done]
    if missing_cards:
        report.append(f'   no key answer for: {", ".join(missing_cards)}')
    nums = [int(q) for q, _ in cards if q.isdigit()]
    if extra and not missing_cards and nums and all(q.isdigit() and int(q) > max(nums) for q in extra):
        report.append(f'   dropped answers for questions no longer on the page: {", ".join(extra)}')
        extra = []
    if extra:
        report.append(f'   key answers with no question: {", ".join(extra)}')
        box = answer_box(s, '<ul>' + ''.join(f'<li><strong>{q}.</strong> {answers[q]}</li>' for q in extra) + '</ul>', 'More answers')
        (cards[-1][1] if cards else s.body.contents[-1]).insert_after(box)
    pre = key_preamble(kold) if preamble else ''
    if BeautifulSoup(pre, 'html.parser').get_text(strip=True):
        s.select_one('.answer-key-header').insert_after(teacher_box(s, pre, 'For the teacher'))
    print(f'   {len(done)} of {len(cards)} questions answered')
    apply_overrides(s, name, report)
    print('\n'.join(report))
    save(s, keyp, dry)


def numbered_family(globpat):
    def run(units, dry, rev):
        for keyp in sorted(MAT.glob(globpat)):
            if units and not any(u in keyp.name for u in units):
                continue
            student = Path(str(keyp).replace('-answers', ''))
            if not student.exists():
                print(f'== {keyp.name}: no student copy'); continue
            print(f'== {keyp.relative_to(MAT)}')
            build_numbered_key(student, keyp, keyp.stem.replace('-answers', '').rsplit('-v', 1)[0], rev, dry)
    return run


def social_notes(units, dry, rev):
    for keyp in sorted(MAT.glob('soc[89]-*-notes-answers-v*.html')):
        if units and not any(u in keyp.name for u in units):
            continue
        print(f'== {keyp.name}')
        build_notes_key(Path(str(keyp).replace('-answers', '')), keyp, keyp.stem.replace('-answers', '').rsplit('-v', 1)[0], rev, dry)


def cefl(units, dry, rev):
    for keyp in sorted((MAT / 'cefl').glob('cefl*-workbook-answers-v*.html')):
        if units and not any(u in keyp.name for u in units):
            continue
        student = Path(str(keyp).replace('-answers', ''))
        print(f'== {keyp.name}')
        kold = soup_of(git_text(rev, keyp) if rev else keyp)
        s = start_key(student, kold)
        report = []
        sm = s.select('h2.moment'); km = kold.select('h2.moment')
        sdoc, kdoc = Doc(s), Doc(kold)
        for i, h in enumerate(sm):
            lab = h.select_one('.chip').get_text(strip=True) if h.select_one('.chip') else h.get_text(strip=True)
            kh = next((k for k in km if (k.select_one('.chip').get_text(strip=True) if k.select_one('.chip') else '') == lab), None)
            if kh is None:
                report.append(f'   {lab}: not in key'); continue
            nxt = sm[i + 1] if i + 1 < len(sm) else None
            knext = km[km.index(kh) + 1] if km.index(kh) + 1 < len(km) else None
            kq = {q: c for q, c in find_numbered_cards(kold) if kdoc.idx(kh) < kdoc.idx(c) < (kdoc.idx(knext) if knext is not None else 10**9)}
            sq = [(q, c) for q, c in find_numbered_cards(s) if sdoc.idx(h) < sdoc.idx(c) < (sdoc.idx(nxt) if nxt is not None else 10**9)]
            for q, c in sq:
                kc = kq.get(q)
                if kc is None:
                    report.append(f'   {lab} Q{q}: no key answer'); continue
                kc = BeautifulSoup(str(kc), 'html.parser').div
                for x in kc.select('.box-answer, .box-teacher'):
                    x.decompose()
                first = kc.find(['strong', 'b'])
                if first is not None and NUMRE.match(first.get_text(' ', strip=True)):
                    first.decompose()
                put_answer(s, c, inner(kc))
            # extra practice → key's answer box in that moment
            ex = [x for x in s.select('.box-extra') if sdoc.idx(h) < sdoc.idx(x) < (sdoc.idx(nxt) if nxt is not None else 10**9)]
            ka = [x for x in kold.select('.box-answer') if kdoc.idx(kh) < kdoc.idx(x) < (kdoc.idx(knext) if knext is not None else 10**9)]
            for e, a in zip(ex, ka):
                a = BeautifulSoup(str(a), 'html.parser').div
                for l in a.select('.label'):
                    l.decompose()
                for w in e.select('.work'):
                    w.decompose()
                e.append(answer_box(s, inner(a)))
            if len(ka) > len(ex):
                report.append(f'   {lab}: {len(ka) - len(ex)} key answer boxes with no extra-practice box')
            # other teacher boxes inside the moment
            for b in kold.select('.box-teacher'):
                if kdoc.idx(kh) < kdoc.idx(b) < (kdoc.idx(knext) if knext is not None else 10**9):
                    bb = BeautifulSoup(str(b), 'html.parser').div
                    for l in bb.select('.label'):
                        l.decompose()
                    h.insert_after(teacher_box(s, inner(bb)))
        for b in kold.select('.box-teacher'):
            if km and kdoc.idx(b) < kdoc.idx(km[0]):
                bb = BeautifulSoup(str(b), 'html.parser').div
                for l in bb.select('.label'):
                    l.decompose()
                s.select_one('.answer-key-header').insert_after(teacher_box(s, inner(bb)))
        print('\n'.join(report))
        save(s, keyp, dry)


def md_inline(s):
    s = s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![*\w])\*(?!\s)(.+?)(?<!\s)\*(?!\w)', r'<em>\1</em>', s)
    return s


def md_to_html(text):
    """Small markdown reader for answer files: paragraphs, - lists (nested by
    two spaces), 1. lists, | tables |, **bold**, *italic*."""
    out, lines = [], text.strip('\n').split('\n')
    i = 0
    while i < len(lines):
        ln = lines[i]
        if not ln.strip():
            i += 1; continue
        if ln.lstrip().startswith('|'):
            rows = []
            while i < len(lines) and lines[i].lstrip().startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?', c) for c in cells):
                    rows.append(cells)
                i += 1
            h = '<tr>' + ''.join(f'<th>{md_inline(c)}</th>' for c in rows[0]) + '</tr>'
            b = ''.join('<tr>' + ''.join(f'<td>{md_inline(c)}</td>' for c in r) + '</tr>' for r in rows[1:])
            out.append(f'<table><thead>{h}</thead><tbody>{b}</tbody></table>')
            continue
        m = re.match(r'^(\s*)(-|\d+\.)\s+', ln)
        if m:
            items = []
            while i < len(lines) and re.match(r'^\s*(-|\d+\.)\s+', lines[i]):
                mm = re.match(r'^(\s*)(-|\d+\.)\s+(.*)$', lines[i])
                items.append((len(mm.group(1)), mm.group(2), mm.group(3)))
                i += 1
            out.append(list_html(items))
            continue
        para = []
        while i < len(lines) and lines[i].strip() and not lines[i].lstrip().startswith('|') and not re.match(r'^\s*(-|\d+\.)\s+', lines[i]):
            para.append(lines[i].strip()); i += 1
        out.append('<p>' + md_inline(' '.join(para)) + '</p>')
    return ''.join(out)


def list_html(items, level=None):
    if not items:
        return ''
    level = items[0][0] if level is None else level
    tag = 'ul' if items[0][1] == '-' else 'ol'
    html, j = f'<{tag}>', 0
    while j < len(items):
        ind, _, txt = items[j]
        sub = []
        k = j + 1
        while k < len(items) and items[k][0] > ind:
            sub.append(items[k]); k += 1
        html += '<li>' + md_inline(txt) + (list_html(sub) if sub else '') + '</li>'
        j = k
    return html + f'</{tag}>'


def read_md_answers(path):
    """## Q1 / ## S1 sections → {id: html}; text before the first ## → intro html."""
    text = Path(path).read_text(encoding='utf-8')
    parts = re.split(r'^##\s+(\S+)\s*$', text, flags=re.M)
    intro = re.sub(r'^#\s.*$', '', parts[0], flags=re.M)
    ans = {qid(parts[k]): md_to_html(parts[k + 1]) for k in range(1, len(parts), 2)}
    return md_to_html(intro), ans


def sci7_workbooks(units, dry, rev):
    """Science 7 workbooks: the old keys belong to an earlier workbook, so the
    answers come from worksheets/grade-7-science/<unit>/*-workbook-answers-v2.md."""
    units = units or ['heat-temperature', 'interactions-ecosystems', 'planet-earth', 'plants-food-fibre', 'structures-forces']
    for u in units:
        student = MAT / f'sci7-{u}-workbook-v1.html'
        keyp = MAT / f'sci7-{u}-workbook-answers-v1.html'
        src = ROOT / 'worksheets' / 'grade-7-science' / u / f'sci7-{u}-workbook-answers-v2.md'
        print(f'== sci7 {u} workbook')
        kold = soup_of(git_text(rev, keyp) if rev else keyp)
        s = start_key(student, kold)
        intro, answers = read_md_answers(src)
        report = []
        n = inject_by_qnum(s, answers, report)
        print(f'   placed {n} of {len(answers)}')
        if BeautifulSoup(intro, 'html.parser').get_text(strip=True):
            s.select_one('.answer-key-header').insert_after(teacher_box(s, intro))
        print('\n'.join(report))
        save(s, keyp, dry)


def sci6_workbooks(units, dry, rev):
    units = units or ['climate', 'energy-resources', 'forces', 'living-systems', 'matter', 'space', 'year-review']
    for u in units:
        for ed in ['', '-ef']:
            keyp = MAT / f'sci6-{u}-workbook{ed}-answers-v1.html'
            student = MAT / f'sci6-{u}-workbook{ed}-v1.html'
            if not student.exists():
                student = MAT / f'sci6-{u}-workbook{ed}-gr6-v1.html'
            if not keyp.exists() or not student.exists():
                print(f'== sci6 {u}{ed}: missing {"key" if not keyp.exists() else "student"}'); continue
            print(f'== sci6 {u} workbook{ed}')
            kold = soup_of(git_text(rev, keyp) if rev else keyp)
            s = start_key(student, kold)
            answers = {}
            for tr in kold.find_all('tr'):
                tds = tr.find_all('td')
                if len(tds) < 2:
                    continue
                q = qid(tds[0].get_text(' ', strip=True))
                if not re.match(r'^S?\d+[A-Z]?$', q):
                    continue
                answers[q] = inner(tds[-1])
            report = []
            n = inject_by_qnum(s, answers, report)
            print(f'   placed {n} of {len(answers)}')
            notes = [d for d in kold.select('.note')]
            bar = s.select_one('.answer-key-header')
            for d in reversed(notes):
                bar.insert_after(teacher_box(s, inner(d)))
            print('\n'.join(report))
            save(s, keyp, dry)


def is_vocab_table(t):
    if t is None:
        return False
    hdr = ' '.join(th.get_text(' ', strip=True).lower() for th in t.find_all('th'))
    return 'own words' in hdr or 'definition' in hdr


def is_vocab_blank(b):
    t = b.find_parent('table')
    if t is None:
        return False
    hdr = ' '.join(th.get_text(' ', strip=True).lower() for th in t.find_all('th'))
    return 'own words' in hdr or 'definition' in hdr


ADAPTERS = {
    'sci6-notes': sci6_notes,
    'sci6-workbooks': sci6_workbooks,
    'sci7-notes': sci7_notes,
    'sci7-workbooks': sci7_workbooks,
    'math9-notes': math9_notes,
    'math9-worksheets': numbered_family('math-9/worksheets/*/*/*-worksheet-*-answers-v*.html'),
    'math9-workbooks': numbered_family('math-9/worksheets/*/*-workbook-answers-v*.html'),
    'math9-tests': numbered_family('math-9/tests/*/*-practice-test-answers-v*.html'),
    'social-notes': social_notes,
    'cefl': cefl,
    'social-workbooks': numbered_family('soc[89]-*-workbook-answers-v*.html'),
    'math8-tests': numbered_family('math-8/tests/*/*-practice-test-answers-v*.html'),
}

if __name__ == '__main__':
    args = sys.argv[1:]
    dry = '--dry-run' in args
    rev = 'c59642b'  # last commit with the old-style keys
    if '--from-disk' in args:
        rev = None; args.remove('--from-disk')
    if '--from-git' in args:
        rev = args[args.index('--from-git') + 1]
        args.remove('--from-git'); args.remove(rev)
    args = [a for a in args if a != '--dry-run']
    if not args or args[0] not in ADAPTERS:
        print(__doc__); print('Families:', ', '.join(ADAPTERS)); sys.exit(1)
    ADAPTERS[args[0]](args[1:], dry, rev)
