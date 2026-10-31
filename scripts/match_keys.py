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
    apply_ctx(s, name, report)
    apply_boxes(s, name, report)
    if name in NO_MORE:
        for b in s.select('.ak-answer'):
            lab = b.select_one('.ak-label')
            h = b.find_previous('h2')
            if lab is not None and lab.get_text().startswith('More answers') and h is not None and h.get_text().strip().startswith('Section'):
                b.decompose()
    for i, a in FIX.get(name, {}).items():
        if a is None:
            bl[i].clear(); bl[i].append('\xa0'); bl[i]['class'] = ['b', 'b-md']
        else:
            fill(s, bl[i], a)


def slot_text(el):
    parts = []
    for x in el.descendants:
        if isinstance(x, Tag) and x.name in ('td', 'th', 'br'):
            parts.append(' ')
        if isinstance(x, NavigableString):
            if not any((isinstance(p, Tag) and (is_blank(p) or 'ak-fill' in (p.get('class') or []))) for p in x.parents):
                parts.append(str(x))
        elif is_blank(x) or (x.name == 'span' and 'ak-fill' in (x.get('class') or [])):
            parts.append(' ___ ')
    return re.sub(r'\s+', ' ', ''.join(parts)).strip()


def block_slots(block):
    """Answer slots in a row or sentence, in page order: blanks (empty or
    already filled) and empty table cells."""
    out = []
    for x in block.descendants:
        if not isinstance(x, Tag):
            continue
        if is_blank(x) or (x.name == 'span' and 'ak-fill' in (x.get('class') or [])):
            if not any(o in x.parents for o in out):
                out.append(x)
        elif x.name == 'td' and not x.get_text(strip=True) and not x.find(['svg', 'img']):
            out.append(x)
    return out


def apply_ctx(s, name, report):
    """CTX[name]: [(text in the row/sentence, [answers in order])]. The row
    (tr) or sentence (p, li, td, div) whose text contains the needle gets its
    slots filled in order; None skips a slot. Needles match the text with
    blanks shown as ___ ."""
    used = set()
    for needle, answers in CTX.get(name, []):
        if answers is None:
            continue
        hit = None
        cands = s.body.find_all('tr') + s.body.find_all(['li', 'p', 'td', 'div', 'h4', 'figcaption'])
        for el in cands:
            if id(el) in used:
                continue
            if el.name == 'div' and any(block_slots(c) for c in el.find_all(['p', 'div', 'table', 'li', 'tr'])):
                continue
            if el.name == 'td' and el.find_parent('tr') is not None and needle in slot_text(el.find_parent('tr')):
                continue  # prefer the whole row
            if needle in slot_text(el) and block_slots(el):
                hit = el; break
        if hit is None:
            # fall back: the writing lines right after a sentence that has none
            src = next((el for el in s.body.find_all(['p', 'li', 'div', 'h4']) if needle in slot_text(el)
                        and not (el.name == 'div' and el.find(['p', 'li', 'div']))), None)
            if src is None:
                report.append(f'   CTX not found: {needle!r}'); continue
            slots = []
            for x in src.find_all_next(True):
                if is_blank(x) or (x.name == 'span' and 'ak-fill' in (x.get('class') or [])):
                    slots.append(x)
                elif x.name in ('p', 'h2', 'h3', 'h4', 'li', 'table') and slots:
                    break
                elif x.name in ('h2', 'h3') :
                    break
                if len(slots) >= len(answers):
                    break
            if not slots:
                report.append(f'   CTX not found: {needle!r}'); continue
            for sl, a in zip(slots, answers):
                if a is not None:
                    fill(s, sl, a)
            continue
        used.add(id(hit))
        slots = block_slots(hit)
        if len(answers) > len(slots):
            report.append(f'   CTX {needle!r}: {len(answers)} answers for {len(slots)} slots')
        for sl, a in zip(slots, answers):
            if a is None:
                continue
            if sl.name == 'td':
                fill_cell(s, sl, a)
            else:
                fill(s, sl, a)



def apply_boxes(s, name, report):
    """BOXES[name]: [(text of the prompt line, answer html)]. The first writing
    box (or answer box) after the line gets this answer."""
    used = set()
    for needle, html in BOXES.get(name, []):
        src = None
        exact = needle.startswith('^')
        nd = needle[1:] if exact else needle
        for el in s.body.find_all(['p', 'li', 'div', 'h4']):
            txt = el.get_text(' ', strip=True)
            if id(el) in used or (txt != nd if exact else nd not in txt):
                continue
            if any(id(a) in used for a in el.parents):
                continue
            if el.find(['p', 'li', 'div', 'table']) and el.name != 'p':
                continue
            src = el; break
        if src is None:
            report.append(f'   BOX not found: {needle!r}'); continue
        used.add(id(src))
        tgt, after = None, src
        for x in src.find_all_next(True):
            if src in x.parents:
                continue
            cls = x.get('class') or []
            if 'ak-answer' in cls or any(c in cls for c in ('response', 'work-box', 'ws', 'lines')):
                tgt = x; break
            if x.name == 'figure':
                after = x; continue
            if any(p is after or (p.name == 'figure') for p in x.parents):
                continue
            if x.name in ('h2', 'h3', 'h4', 'p', 'li', 'table') and x.get_text(strip=True):
                break
        if tgt is not None:
            tgt.replace_with(answer_box(s, html))
        else:
            after.insert_after(answer_box(s, html))



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
NO_MORE = {'math9-linear-equations-notes'}
BOXES = {
    'math9-linear-equations-notes': [
        ('The inverse of + 7 is', 'x + 7 − 7 = −3 − 7, so x = −10'),
        ('What is x?', 'x = −10'),
        ('Substitute your answer back into the original equation x + 7 = −3', '−10 + 7 = −3 ✓'),
        ('Undo the subtraction (add to both sides)', '2x − 5 + 5 = 9 + 5 → 2x = 14'),
        ('Undo the multiplication (divide both sides)', '2x ÷ 2 = 14 ÷ 2 → x = 7'),
        ('^Verify:', '2(7) − 5 = 14 − 5 = 9 ✓'),
        ('Why undo in reverse order?', 'Undoing works backwards: the last thing done to x (subtract 5) is the first thing undone, like taking off socks and shoes in the reverse order you put them on.'),
        ('Solve and verify:', 'Multiply both sides by 4: x = −12. Verify: −12 ÷ 4 = −3 ✓'),
        ('a) x − 9 = −4', 'x = −4 + 9 = 5. Verify: 5 − 9 = −4 ✓'),
        ('b) 3x = −18', 'x = −18 ÷ 3 = −6. Verify: 3(−6) = −18 ✓'),
        ('c) x / −2 = 5', 'x = 5 × (−2) = −10. Verify: −10 ÷ (−2) = 5 ✓'),
        ('d) −4 + x = 7', 'x = 7 + 4 = 11. Verify: −4 + 11 = 7 ✓'),
        ('Subtract to undo the addition', '3x + 12 − 12 = 21 − 12 → 3x = 9'),
        ('Divide to isolate x', 'x = 9 ÷ 3 = 3'),
        ('Substitute back into 3(x + 4) = 21', '3(3 + 4) = 3(7) = 21 ✓'),
        ('Why must we distribute before doing any other steps', 'The 3 multiplies the whole bracket, so it must reach both terms first. (Dividing both sides by 3 first also works here: x + 4 = 7. Dividing only the x term would be wrong.)'),
        ('Move variable terms to one side', '5x − 2x − 3 = 9 → 3x − 3 = 9'),
        ('Move constants to the other side', '3x = 9 + 3 = 12'),
        ('Isolate x', 'x = 12 ÷ 3 = 4'),
        ('Check both sides with your answer', 'Left: 5(4) − 3 = 17. Right: 2(4) + 9 = 17 ✓'),
        ('Why does it not matter which side you move the variable term to', 'Both sides stay balanced either way. Moving 5x right: −3 = −3x + 9 → −12 = −3x → x = 4, the same answer.'),
        ('Solve and verify. Show all steps:', '4x − 8 = 2x + 6 → 2x − 8 = 6 → 2x = 14 → x = 7. Verify: 4(7 − 2) = 20 and 2(7) + 6 = 20 ✓'),
        ('Common version with negatives', 'The −2 multiplies both terms: (−2)(x) + (−2)(−5) = −2x + 10.'),
        ('a) 2(3x − 1) = 16', '6x − 2 = 16 → 6x = 18 → x = 3. Verify: 2(9 − 1) = 16 ✓'),
        ('b) 5x + 3 = 3x − 7', '2x + 3 = −7 → 2x = −10 → x = −5. Verify: 5(−5) + 3 = −22 and 3(−5) − 7 = −22 ✓'),
        ('c) −4(x + 2) = 2x − 8', '−4x − 8 = 2x − 8 → −6x = 0 → x = 0. Verify: −4(2) = −8 and 2(0) − 8 = −8 ✓'),
        ('Solve the resulting equation', '2x + 3 = 5 → 2x = 2 → x = 1'),
        ('Substitute back into x / 3 + 1 / 2', '1/3 + 1/2 = 2/6 + 3/6 = 5/6 ✓'),
        ('Why does multiplying every term by the LCD eliminate the fractions', '6 × (x/3) = (6 ÷ 3)x = 2x. The LCD divides evenly by every denominator, so every fraction becomes a whole-number term.'),
        ('Find the LCD, multiply all terms, then solve', 'LCD = 12: 8x − 48 = 3x → 5x = 48 → x = 48/5 = 9.6'),
        ('Solve using two different methods', '×10: 3x + 12 = 9 → 3x = −3 → x = −1. Directly: 0.3x = 0.9 − 1.2 = −0.3 → x = −1'),
        ('Which is less prone to rounding errors?', 'Multiplying by 10 first: you then work only with whole numbers, so nothing needs rounding.'),
        ('a) x / 2 − x / 3', 'LCD = 6: 3x − 2x = 1 → x = 1. Verify: 1/2 − 1/3 = 1/6 ✓'),
        ('b) 3 / 4 x + 2', 'LCD = 4: 3x + 8 = 2x + 20 → x = 12. Verify: 9 + 2 = 11 and 6 + 5 = 11 ✓'),
        ('c) 0.5x − 3 = 0.2x + 0.6', '×10: 5x − 30 = 2x + 6 → 3x = 36 → x = 12. Verify: 6 − 3 = 3 and 2.4 + 0.6 = 3 ✓'),
        ('Why is there NO sign flip?', 'We divided by positive 2. Only multiplying or dividing by a negative number flips the sign.'),
        ('Graph on a number line (what kind of circle', 'Open circle at 2 (2 is not included); arrow pointing right.'),
        ('Pick a value IN the solution set', 'x = 3: 2(3) + 3 = 9 > 7 ✓. x = 1: 2(1) + 3 = 5, which is not > 7, so it is correctly left out.'),
        ('Remember: when do you flip the sign?', '−3x ≤ 9. Divide by −3 and flip the sign: x ≥ −3'),
        ('Graph (what kind of circle? which direction?)', 'Closed circle at −3 (−3 is included); arrow pointing right.'),
        ('a) 4x − 1 < 11', '4x < 12 → x < 3. Open circle at 3, arrow left. Check x = 0: −1 < 11 ✓'),
        ('b) −2x + 5 ≥ 1', '−2x ≥ −4 → x ≤ 2 (flip). Closed circle at 2, arrow left. Check x = 0: 5 ≥ 1 ✓'),
        ('c) 3(x − 2) ≤ 2x + 1', '3x − 6 ≤ 2x + 1 → x ≤ 7. Closed circle at 7, arrow left. Check x = 0: −6 ≤ 1 ✓'),
        ('^Solve:', '50h ≤ 350 − 75 = 275 → h ≤ 5.5'),
        ('Answer the question in a complete sentence', 'The homeowner can have at most 5 full hours of work done.'),
        ('Substitute your answer back in', '75 + 50(5) = 325 ≤ 350 ✓. Six hours would cost 375, which is over $350.'),
        ('Why do we write the inequality ≤ rather than <', '"At most" means the total can equal $350 but not go over it, so we use ≤.'),
        ('Define, translate, solve, and interpret:', 'Let n = the smallest even integer. n + (n + 2) + (n + 4) = 48 → 3n + 6 = 48 → 3n = 42 → n = 14. The integers are 14, 16 and 18.'),
        ('Do your three numbers add to 48?', '14 + 16 + 18 = 48 ✓'),
        ('Define, translate, solve, and interpret:', 'Let c = cups sold. Profit needs 2.50c > 75 → c > 30. They must sell at least 31 cups to make a profit.'),
    ],
}
CTX = {
    'math9-linear-equations-notes': [
        ('3(x + 4) = 3·x + 3·4 =', ['3x + 12']),
        ('Correct: 3(x + 4) = 3x +', ['12']),
        ('LCD = ___', ['6']),
        ('2x + 3 > 7 → 2x >', ['4', '2']),
        ('−3 ___ −1. Did the direction change?', ['<', 'Yes']),
        ('Multiply both by −1: −3', ['<']),
        ('Define: Let x =', ['the unknown quantity, with its units (for example, h = hours of work)']),
        ('75 + 50h ___ 350', ['≤']),
    ],
    'math9-statistics-notes': [
        ('Describe the pattern you see in the scatter plot', ['As temperature rises, the number of visitors rises: a strong positive, roughly linear pattern.']),
        ('"The scatter plot shows a ___ positive', ['strong']),
        ('An outlier is a point that falls', ['far']),
        ('How does an outlier affect the correlation description?', ['It can make the correlation look weaker (or stronger) than the rest of the data shows; mention it, but describe the overall pattern.']),
        ('Direction: ___ Strength:', ['Positive', 'Strong']),
        ('Full description:', ['A strong positive correlation: as temperature increases, the number of splash pad visitors increases.']),
        ('What is the same about how you read a trend in both', ['In both you look at the overall direction of change, not at single points.', 'A line graph shows one variable over time; a scatter plot compares two variables.']),
        ('Choose two points ON the line', ['85', '225']),
        ('Step 3: Calculate the slope', ['225', '85', '140', '14', '10']),
        ('Step 4: Find the y-intercept', ['85', '10', '−115']),
        ('Step 5: Write the equation: v =', ['10', '− 115']),
        ('rather than actual data points to find the equation', ['Points on the line follow the trend exactly.', 'A data point may sit above or below the line, so using it would give a different, less accurate equation.']),
        ('approximately ___ more visitors', ['10']),
        ('Complete the verbal description for your line', ['For each 1°C rise in temperature, about 10 more visitors come to the splash pad.']),
        ('v = 10(26) +', ['(−115)', '145']),
        ('because 26 is ___ the data range', ['inside']),
        ('v = 10(40) +', ['(−115)', '285']),
        ('because 40 is ___ the data range', ['outside']),
        ('a) Predict yield for 150 kg/hectare', ['0.015(150) + 1.2 = 3.45 t/ha', 'Interpolation (inside 0–200)']),
        ('b) Predict yield for 400 kg/hectare', ['0.015(400) + 1.2 = 7.2 t/ha', 'Extrapolation (outside 0–200)']),
        ('Why might the extrapolation be unreliable', ['Too much fertilizer can harm the crop, so the yield levels off or drops.', 'The line assumes the trend keeps rising, but the data never went past 200 kg/hectare.']),
    ],
    'math9-linear-relations-notes': [
        ('Starting at 10 cm. y = ___ x', ['4', '10']),
        ('What stays the same across all four', ['They all describe one rule: start at 10 cm', 'and add 4 cm every year (rate of change 4, starting value 10).']),
        ('Cost depends on number of items', ['Number of items', 'Cost']),
        ('Distance depends on travel time', ['Travel time', 'Distance']),
        ('Temperature depends on time of day', ['Time of day', 'Temperature']),
        ('Slope = ___ / ___ = ___', ['6', '3', '2']),
        ('for every 1 unit right, the line goes', ['2']),
        ('m = 0 − 6/3 − 0 =', ['−6', '3', '−2']),
        ('A negative slope means the line is going', ['down (it falls from left to right)']),
        ('Find the slope using (0,1) and (2,5)', ['4/2 = 2', '4/2 = 2', 'Yes']),
        ('m > 0', ['Rises from left to right']),
        ('m < 0', ['Falls from left to right']),
        ('Zero ___ m', ['Horizontal (flat)', '0']),
        ('Undefined ___ m', ['Vertical', 'undefined']),
        ('Temperature stays at 0°C all day', ['0']),
        ('A wall is perfectly vertical', ['undefined']),
        ('A ski hill drops 3 m per 10 m across', ['−3/10 = −0.3']),
        ('m = 300 km / 3 h', ['100']),
        ('you travel ___ km', ['100']),
        ('m = ___ / ___ = ___ The slope means', ['−120', '800', '−0.15', 'the road drops 0.15 m for every 1 m across (it goes downhill)']),
        ('unit rate? Where is it different', ['Both tell how much one quantity changes for each 1 unit of another.', 'A slope can be negative or zero, and it describes a whole line, not just one price.']),
        ('Slope m = ___ y-intercept b', ['3', '−4']),
        ('Starting point (0, b) = (0,', ['−4']),
        ('Equation: C = ___ n', ['90', '25']),
        ('Second point: (1,', ['115']),
        ('y-intercept (set x = 0)', ['−6', '0', '−6']),
        ('x-intercept (set y = 0)', ['3', '3', '0']),
        ('b = ___', ['1']),
        ('Equation: y = ___', ['2x + 1']),
        ('Why can we substitute the point', ['(3, 7) is on the line, so its x and y values must make the equation true.']),
        ('Verbal: "Starting at', ['6', '2']),
        ('y = ___ (no constant added)', ['kx']),
        ('The graph passes through the ___', ['origin (0, 0)']),
        ('The ratio y/x is', ['constant']),
        ('where b ≠ ___', ['0']),
        ('Graph passes through', ['the origin (0, 0)', '(0, b), not the origin']),
        ('Type: ___ Equation:', ['Direct variation', 'y = 5x']),
        ('Type: ___ Equation:', ['Partial variation', 'y = 4x + 8']),
        ('Look at the y-value when x = 0', ['direct variation', 'partial variation']),
        ('Plan A equation: C =', ['0.15t', '0.05t + 10']),
        ('For 50 texts: Plan A costs', ['$7.50', '$12.50', '$30', '$20']),
        ('Table A above — when x = 0', ['0', 'Yes, so it is direct variation']),
        ('Write the equation for your example', ['Example: a plumber charges $60 to come out plus $40 per hour.', 'C = 40h + 60']),
        ('Cost ($)', ['50', '70', '90', '110']),
        ('Slope = ___ What does it mean in this context?', ['0.20', 'Each kilometre driven adds $0.20 to the cost']),
        ('y-intercept = ___ What does it mean', ['50', 'The $50 daily charge before any kilometres are driven']),
        ('Is this direct or partial variation?', ['Partial: the cost is $50 even at 0 km, so the line does not pass through the origin.']),
    ],
    'math9-measurement-notes': [
        ('Rectangle area:', ['4', '6', '24']),
        ('Semicircle area:', ['2', '2π ≈ 6.28']),
        ('Total area:', ['24', '6.28', '30.28']),
        ('rather than the full formula', ['The shape on top is only half a circle, so we take half of the full circle area πr².']),
        ('always the ___ distance', ['perpendicular (straight, at 90°)']),
        ('Rectangle l = 12 m', ['54 m²']),
        ('Parallelogram b = 10 m', ['70 m²']),
        ('Two l × w faces', ['30']), ('Two l × h faces', ['40']), ('Two w × h faces', ['24']),
        ('SA = ___ + ___ + ___ = ___ cm2', ['30', '40', '24', '94']),
        ('Why does a rectangular prism have 6 faces', ['Every face has an identical face opposite it: top and bottom, front and back, left and right.']),
        ('Two bases: 2 ×', ['15.6', '31.2']),
        ('Perimeter of base = 6 + 6 + 6', ['18']),
        ('Lateral area = perimeter × height', ['18', '180']),
        ('SA = ___ + ___ = ___ cm2', ['31.2', '180', '211.2']),
        ('A cylinder has: two', ['bases', 'curved (lateral) surface']),
        ('2πr2 = area of the', ['two']),
        ('= 2π( ___ ) + 2π(', ['16', '36']),
        ('= ___ π + ___ π', ['32', '72']),
        ('= ___ π ≈', ['104', '326.73']),
        ('What shape does the curved surface become', ['It unrolls into a rectangle.', 'Its length is the circumference 2πr and its width is the height h, so its area is 2πr × h.']),
        ('A cube with side 2 cm', ['24', '8']),
        ('one where you would care about volume', ['Surface area: how much wrapping paper or paint you need.', 'Volume: how much water a tank or pool holds.']),
        ('B = l × w = 6 × 4', ['24']),
        ('V = B × h = ___ × 3', ['24', '72']),
        ('B = πr2 = π(5)2', ['25']),
        ('V = B × h = ___ π × 12', ['25', '300', '942.48']),
        ('B = base × height/2 = 6 × 8/2', ['24']),
        ('V = ___ × 10', ['24', '240']),
        ('Volume of oil it can hold', ['8² = 64', '15', '960', '3015.93']),
        ('the tank holds approximately', ['3 016 000 (about 3 million)']),
        ('SA = area of ___ + area of', ['base', 'four']),
        ('SA = ___ + 2(6)(5)', ['36', '36', '60']),
        ('used for surface area but NOT for volume', ['Volume needs the straight-up (perpendicular) height of the solid.', 'The slant height runs along a face, so it is only used for the areas of the triangular faces.']),
        ('πr2 = area of the circular', ['base']),
        ('√(9 + 16) = √', ['25']),
        ('SA = π(3)2 + π(3)(', ['5', '15', '24']),
        ('V = (1/3)π(3)2(4)', ['9', '4', '12', '37.70']),
        ('SA = 4π(6)2 = 4π(36)', ['144', '452.39']),
        ('V = (4/3)π(6)3', ['288', '904.78']),
        ('Cone with same r and h', ['18', 'The cone is 1/3 of the cylinder (18π : 54π = 1 : 3)']),
        ('Subtract the ___ faces', ['hidden']),
        ('the volumes (or subtract if one is removed)', ['Add']),
        ('(20)(20)(5) + π(4)2(10)', ['2000', '160', '2502.65']),
        ('Hidden area = area of one circle', ['16']),
        ('SA of prism = 2(20×20) + 4(20×5)', ['800', '400', '1200', '1200', '16', '1149.73']),
        ('SA of cylinder = 2π(4)2 + 2π(4)(10)', ['32', '80', '112', '112', '16', '96']),
        ('Total SA ≈', ['1149.73', '301.59 (96π)', '1451.33']),
        ('subtract the hidden circle from BOTH', ['The circle is covered on top of the prism and is also the cylinder’s bottom face.', 'Neither copy is on the outside, so each is removed once.']),
        ('What does this overcount?', ['The two glued faces (one from each box), which are hidden inside.']),
        ('How much should be subtracted?', ['2 × the area of the glued face']),
        ('V of prism = ___', ['8 × 8 × 20 = 1280']),
        ('√(25 − 16) =', ['3']),
        ('V of pyramid = ___', ['(1/3)(64)(3) = 64']),
        ('Total V = ___', ['1280 + 64 = 1344']),
        ('SA = ___', ['Prism without its top: 64 + 4(8 × 20) = 704; pyramid without its base: 4 × (8 × 5 ÷ 2) = 80; total 784 m²']),
    ],
    'math9-probability-notes': [
        ('0 ___ — the event cannot occur', ['impossible']),
        ('1 ___ — the event must occur', ['certain']),
        ('0.5 ___', ['equally likely (even chance)']),
        ('P(event) = number of ___ outcomes', ['favourable', 'possible']),
        ('P(event) = number of times event', ['occurred', 'trials']),
        ('Sample space size = ___', ['6']),
        ('P(rolling a 4) =', ['1', '6']),
        ('P(rolling an even number) =', ['3', '6', '2', '4', '6']),
        ('P(rolling a 7) =', ['0', '6', '0']),
        ('P(rolling less than 7) =', ['6', '6', '1']),
        ('P(red) experimental =', ['14', '40', '0.35']),
        ('P(blue) experimental =', ['16', '40', '0.4']),
        ('Is the experimental result close?', ['A fair 3-section spinner gives P(red) = 1/3 ≈ 0.33. 0.35 is close.', 'Small differences are normal random variation; more spins usually bring the result closer to 1/3.']),
        ('P(rolling a 4, 5, or 6) = 1 − 1/2', ['1/2']),
        ('Fraction: 3/8 Decimal:', ['0.375', '37.5']),
        ('1/4 ___', ['0.25', '25%']),
        ('5/8 ___', ['0.625', '62.5%']),
        ('75%', ['3/4', '0.75']),
        ('Total outcomes = ___ × ___ = ___', ['2', '3', '6']),
        ('P(Heads and Green) =', ['1', '6']),
        ('P(Tails and NOT Red) =', ['2', '6']),
        ('the total number of outcomes for both events', ['m', 'n']),
        ('Total = ___ × ___ × ___', ['4', '3', '2', '24']),
        ('Total outcomes = ___', ['36']),
        ('P(sum = 7) =', ['6', '36']),
        ('P(both show the same number) =', ['6', '36']),
        ('P(first die > second die) =', ['15', '36']),
        ('P(exactly one head) =', ['2', '4']),
        ('Hint: think about P(A AND B)', ['Both multiply: counting multiplies the choices at each step,', 'and P(A and B) = P(A) × P(B) multiplies the chances at each step.']),
        ('does NOT affect the ___ of the other', ['probability']),
        ('P(H and 3) = (1/2) × (1/6)', ['1', '12']),
        ('How many show (H, 3)?', ['1', '1', '12', 'Yes']),
        ('P(red and red) = (5/8) × (5/8)', ['25/64']),
        ('What condition makes this true?', ['The marble is put back, so the bag again has 5 red out of 8.', 'Replacement is the condition that makes the draws independent.']),
        ('given heads on flips 1–4', ['1/2']),
        ('how many aces remain?', ['3', '51']),
        ('P(Ace on draw 2 | Ace on draw 1)', ['3']),
        ('P(both aces) = (4/52) × (', ['3', '12', '0.0045 (= 1/221)']),
        ('Why does the second probability change to', ['3']),
        ('After removing one red:', ['4', '7']),
        ('P(blue second | red first) = 3/', ['7']),
        ('P(red then blue) = (5/8) × (3/7)', ['15', '0.268']),
        ('WITH replacement', ['15/64 ≈ 0.234']),
        ('WITHOUT replacement', ['15/56 ≈ 0.268']),
        ('without replacement changes the', ['total number of items (the sample space) for the second draw']),
        ('Is the difference meaningful?', ['Yes: 4/7 ≈ 0.571 is noticeably lower than 5/8 = 0.625, because one red is gone.']),
        ('After 1st red drawn:', ['3', '6', '9', '3']),
        ('After 2nd red drawn:', ['2', '6', '8', '6']),
        ('P(R, R, B) = (4/10) × (', ['3', '6', '72/720 = 1/10', '0.1']),
    ],
    'math9-rational-numbers-notes': [
        ('can be written in the form', ['a', 'b', '≠']),
        ('All integers: 5 =', ['5', '−3']),
        ('Common denominator: ___', ['24']),
        ('−5/6 = − ___ 24', ['20', '21']),
        ('Compare: − ___ 24', ['20', '>', '21', '>']),
        ('Key insight with negatives', ['larger', 'smaller']),
        ('___ , ___ , ___ , ___ , ___ , ___', ['−1', '−3/4', '−1/3', '0', '1/2', '5/6']),
        ('they must have the ___ denominator', ['same']),
        ('Find the ___', ['lowest common denominator (LCD)']),
        ('Add/subtract the ___', ['numerators']),
        ('Step 1: LCD of 4 and 6', ['12']),
        ('Step 2: 3/4 = ___ 12', ['9', '10']),
        ('Step 3: ___ 12 + ___ 12', ['9', '10', '19']),
        ('Step 4: Simplify:', ['19/12 = 1 7/12']),
        ('Explain Step 2', ['Multiplying the top and bottom by the same number is multiplying by 1, so the value does not change; only the size of the pieces changes.']),
        ('−1/3 = − ___ 12', ['4', '9']),
        ('12 + (− ___ 12) = − ___ 12', ['4', '9', '13']),
        ('Simplified: ___', ['−13/12 = −1 1/12']),
        ('Adding two negative rationals always gives a', ['negative']),
        ('−5/6 = −5/6 1/2 =', ['3']),
        ('−5/6 + ___ 6 = − ___ 6', ['3', '2']),
        ('When the signs differ, do you add or subtract', ['Subtract the numerators (5 − 3 = 2). The answer takes the sign of the fraction with the larger absolute value, so it is negative: −2/6 = −1/3.']),
        ('Where does it break down', ['The same sign rules as integers apply.', 'The only extra step is finding a common denominator first.']),
        ('= 5/8 + ___ = ___', ['3/8', '8/8 = 1']),
        ('Temperature = −7.5 +', ['11.25', '3.75']),
        ('To multiply fractions: Multiply', ['numerator', 'numerator', 'denominator', 'denominator']),
        ('(a/b) × (c/d) =', ['ac', 'bd']),
        ('If there is an ___ number of negative factors', ['odd']),
        ('Numerators: ___ × ___', ['−3', '2', '−6']),
        ('Denominators: ___ × ___', ['5', '7', '35']),
        ('Sign: ___ × ___ = ___', ['negative', 'positive', 'negative']),
        ('Result: ___', ['−6/35']),
        ('What does the sign rule tell you the product will be', ['Negative: one negative factor (an odd number) gives a negative product.']),
        ('8 and 4 share factor', ['4', '5']),
        ('Reduce: 8/4 =', ['2/1', '1/3']),
        ('Now multiply:', ['2', '3', '1', '1', '2/3']),
        ('Why does cross-cancelling before multiplying', ['You divide the same common factor out of the top and bottom either way, so the value is the same.', 'Cancelling first is easier: the numbers stay small.']),
        ('Rewrite 8 as ___ /1', ['8']),
        ('(−3/4) × (8/1) = −', ['24', '−6']),
        ('Can you cancel the 8 and the 4?', ['Yes', '8 is a numerator and 4 is a denominator, and they share the factor 4']),
        ('(−5/6) × (3/4) = ___', ['−15/24 = −5/8']),
        ('is the same as ___ by its reciprocal', ['multiplying']),
        ('a ÷ (b/c) = a ×', ['c', 'b']),
        ('The reciprocal of a/b is', ['b', 'a']),
        ('Does 6 ÷ (1/3) give something bigger', ['Bigger', '6 × 3 = 18']),
        ('Rewrite as multiplication by the reciprocal', ['5/2', '−15/8']),
        ('How do you find the reciprocal of 2/5', ['Flip it: the reciprocal of 2/5 is 5/2.', 'Multiplying by 5/2 undoes multiplying by 2/5, which is exactly what dividing by 2/5 does.']),
        ('Convert to improper fraction', ['5']),
        ('Rewrite as multiplication: (', ['5', '4', '−20/6']),
        ('Sign: ___ Result:', ['positive × negative = negative', '−10/3 = −3 1/3']),
        ('= (2/3) × (5/4) = ___', ['10/12 = 5/6']),
        ('Check: ___ × (4/5)', ['5/6']),
        ('(2/3) ÷ 3 = (2/3) ×', ['1/3', '2/9']),
        ('Each family receives', ['2/9']),
        ('Apply sign rules: (−2/3)2 =', ['4/9']),
        ('B: −1/2 + 3/4 = −2/4 + 3/4', ['1']),
        ('E: (1/4)2 =', ['1/16']),
        ('D: ___ ÷ (−1/4)', ['1/16', '1/16', '−4/16 = −1/4']),
        ('Why do we handle the bracket before squaring', ['The bracket must become one number (1/4) before it is squared.', 'Squaring each part first gives 1/4 + 9/16, which is a different (wrong) value.']),
        ('This gives: ___', ['(5/4) × (−2/3) = −10/12 = −5/6 (wrong)']),
        ('3/4 × (−2/3) = ___ Then', ['−1/2', '(−1/2)', '0']),
        ('−(3/4)2 = −(', ['9/16', '−9/16']),
        ('(−3/4)2 = (−3/4) × (−3/4) =', ['9/16']),
        ('Which answer is negative and why', ['−(3/4)² is negative: the exponent applies only to 3/4, and the negative sign is applied after squaring.']),
        ('Answer: ___', ['(−1/4) ÷ (−5/6) = 3/10; then 3/10 × (−2/5) = −6/50 = −3/25']),
    ],
    'math9-similarity-notes': [
        ('a/b = c/d means a ×', ['d', 'c']),
        ('Cross-multiply: 9x = 6 × 4', ['24', '24', '8/3 ≈ 2.67']),
        ('What operation are we actually applying', ['Multiplying both sides by both denominators (6 and 9),', 'which clears the fractions and keeps the equation balanced.']),
        ('Scale factor = ___ length', ['image (new)', 'original']),
        ('If scale factor > 1: the image is', ['larger', 'smaller', 'the same size']),
        ('Scale factor = 10/4 =', ['2.5', '2.5']),
        ('BOTH ratios give the same scale factor', ['If the two ratios were different, the shape was stretched, not scaled, so it would not be a true scale copy.']),
        ('d = ___ cm = ___ km', ['320 000', '3.2']),
        ('All corresponding angles are ___', ['equal']),
        ('All corresponding sides are ___', ['proportional']),
        ('They are ___ (same proportions)', ['similar', 'No (different sizes)']),
        ('A corresponds to E → angle A = angle', ['E']),
        ('AB corresponds to EF → AB/EF =', ['BC', 'FG']),
        ('Scale factor = DE/AB = 4/6', ['2/3', '2/3', '2/3', '6']),
        ('Why did we use DE/AB', ['The scale factor is new over original.', 'DEF is the image (new) and ABC is the original, so DE goes on top.']),
        ('Check angles: P = W?', ['Yes', 'Yes', 'Yes', 'Yes', '2', '2', '2', '2', 'Yes', 'Yes', 'Yes']),
        ('the ratio of their perimeters = ___', ['k (the same scale factor)']),
        ('Quadrilateral PQRS perimeter', ['18', '36', '36', '18', '2']),
        ('Think of at least one example from maps', ['Maps are similar to the land they show (every distance uses the same scale).', 'Architects’ scale drawings and scale models are similar to the real building.']),
        ('Third angle = 180° −', ['the first angle', 'the second angle']),
        ('If angle A = angle D and angle B = angle E', ['C', 'F', 'DEF']),
        ('In PQR: angle R = 180 − 55 − 75', ['50', '75', 'Yes ✓', '50', 'XYZ']),
        ('d/a = 4/6 =', ['2/3', '2/3', '2/3', 'Yes', 'SSS']),
        ('creates a smaller triangle that is ___', ['similar']),
        ('Triangle ADE ~ Triangle ___', ['ABC']),
        ('1 cm on the diagram = ___ cm', ['5000', '50']),
        ('Real length = 3.2 × 25 000', ['80 000', '0.8']),
        ('Diagram length = 50 m / 500', ['0.1', '10', '0.05', '5']),
        ('h = 7.2 × (1.5/0.9)', ['1.67 (1.5 ÷ 0.9)', '12']),
        ('if we measure at different times', ['The sun’s angle changes during the day, so shadow lengths change.', 'Both shadows must be measured at the same time, or the triangles are not similar.']),
        ('h/60 = 1.6/10', ['9.6']),
    ],
    'math9-square-roots-notes': [
        ('√(9/25) = √9/√25', ['3', '5', '3/5']),
        ('√(4/49) =', ['√4', '√49', '2/7']),
        ('√(16/81) =', ['4/9']),
        ('Find the perfect squares on either side.', ['36', '49', '36', '49', '6', '7']),
        ('√20', ['4', '5', '4.5']), ('√55', ['7', '8', '7.4']), ('√80', ['8', '9', '8.9']), ('√120', ['10', '11', '11.0 (10.95)']),
        ('square rooting = power of', ['½', 'Yes:', '√x = x<sup>1/2</sup>']),
        ('___ + ___ = c2', ['36', '64']),
        ('c2 = ___', ['100']),
        ('c = √ ___ = ___', ['100', '10 cm']),
        ('Explain the final step', ['c² = 100 tells us c squared, so we undo the square with a square root.', 'A length cannot be negative, so we use only the positive root: c = 10 cm.']),
        ('___ + b2 = ___', ['16', '100']),
        ('b2 = ___', ['100 − 16 = 84']),
        ('b = √ ___ ≈', ['84', '9.2']),
        ('Explain Step 4', ['We must get b² alone first. The square root of 16 + b² is not 4 + b, so we subtract 16, then take the root.']),
        ('Does a triangle with sides 3, 4, 6', ['25', '36', 'No (25 ≠ 36)', 'No']),
        ('Multiples also work', ['2']),
        ('c = √(92 + 402)', ['81', '1600', '1681', '41']),
        ('√(9/16) = √9/√16', ['3', '4']),
        ('Method 1: Convert to fraction', ['7', '10', '0.7']),
        ('Method 2: Think of a decimal', ['0.7', '0.7', '0.7']),
        ('√0.25', ['Convert: √(25/100) = 5/10', '0.5']),
        ('√(4/9)', ['√4 / √9', '2/3']),
        ('√1.44', ['Convert: √(144/100) = 12/10', '1.2']),
        ('√(0.01)', ['Convert: √(1/100) = 1/10', '0.1']),
        ('So x(1/2) = ___', ['√x']),
        ('Verify: 9(1/2) =', ['3', '3']),
        ('Let a = 16, b = 9', ['√25 = 5', '√16 + √9 = 4 + 3 = 7', 'No']),
        ('√(4 × 9) = √4 × √9', ['2 × 3 = 6 ✓ (√36 = 6)']),
        ('√(36/4) = √36/√4', ['6 ÷ 2 = 3 ✓ (√9 = 3)']),
        ('Answer: ___', ['h² = 13² − 5² = 169 − 25 = 144, so h = 12 m. Rational (12 is a whole number).']),
    ],
    'math9-circle-geometry-notes': [
        ('so QR is a ___', ['diameter', 'shorter than']),
        ('vertex at the ___ of the circle', ['centre']),
        ('vertex on the ___ of the circle', ['circle itself (circumference)']),
        ('the arc that lies ___ the angle', ['inside (between the arms of)']),
        ('at exactly ___ point', ['one']),
        ('the tangent is ___ to the radius. (We will', ['perpendicular (at 90°)']),
        ('Is a tangent the same as a chord?', ['No', 'A chord joins two points on the circle; a tangent touches the circle at only one point']),
        ('A minor arc is the ___', ['shorter']),
        ('A major arc is the ___', ['longer']),
        ('A semicircle is exactly', ['half', 'diameter']),
        ('AM = ___ /2', ['16', '8']),
        ('Right triangle OMA: OA =', ['10 cm', '8 cm']),
        ('OM2 = ___ − ___ = ___', ['10² = 100', '8² = 64', '36']),
        ('OM = ___ cm', ['6']),
        ('Which side is the hypotenuse in triangle OMA', ['OA (the radius): it is opposite the right angle at M']),
        ('If two chords are ___ in length', ['equal', 'equidistant (the same distance)']),
        ('PM = ___ /2', ['24', '12 cm']),
        ('OM = ___', ['√(13² − 12²) = √25 = 5 cm']),
        ('Describe the steps', ['Draw any two chords that are not parallel and construct the perpendicular bisector of each.', 'The point where the two bisectors cross is the centre.']),
        ('Angle AOB (central) = ___', ['2 × APB (measure it)', '½ × AOB']),
        ('Inscribed angle = Central angle / ___', ['2']),
        ('APB = 80° / 2 =', ['40']),
        ('AOB = 2 × 35° =', ['70']),
        ('Why does being at the centre make it', ['The arms of the central angle meet the arc from the centre, so they open across the whole arc;', 'an inscribed angle sits on the far edge of the circle, so for the same arc it opens only half as wide.']),
        ('always the ___ size', ['same']),
        ('APB = AQB = ___', ['½ × AOB']),
        ('So the inscribed angle = 180°/2', ['90']),
        ('any inscribed angle APB = ___', ['90']),
        ('central angle for a diameter is always', ['180°', '90°']),
        ('What is angle APB? ___', ['90°']),
        ('a) Inscribed angle APB (same arc)', ['55']),
        ('the major arc central angle', ['250', '250', '125']),
        ('A tangent to a circle is ___', ['perpendicular']),
        ('Angle OTP = ___', ['90']),
        ('angle at the point of tangency is ___', ['90°']),
        ('they form a ___ triangle', ['right']),
        ('Right angle is at ___', ['T']),
        ('Hypotenuse = PO = ___', ['13 cm']),
        ('PT2 = ___ − ___ = ___', ['169', '25', '144']),
        ('PT = ___ cm', ['12']),
        ('Why is PO the hypotenuse', ['PO is opposite the right angle at T, so it is the longest side']),
        ('are ___ in length', ['equal']),
        ('PT₁ = ___', ['PT₂']),
    ],
    'soc8-civic-engagement-notes': [
        ('they choose who ___ them', ['represents']),
        ('Be a ___', ['Canadian citizen']),
        ('Be at least ___ years old', ['18']),
        ('Have valid proof of ___ in the riding', ['residence (address)']),
        ('Have valid proof of ___ A document', ['identity']),
        ('Deng, age 19', ['Yes']),
        ('Sofia, age 16', ['No', 'No']),
        ('Liam, age 20', ['No', 'No']),
    ],
    'soc8-ideologies-notes': [
        ('Short label Rule by ___', ['the wise (philosopher-kings)', 'law']),
    ],
    'soc8-political-systems-notes': [
        ('divided into three branches', ['executive', 'legislative', 'judicial']),
    ],
    'soc9-evolving-citizenship-notes': [
        ("advocacy for women's suffrage by the ___", ['Famous Five']),
        ('The Canadian Multiculturalism Policy', ['5 (1971)']),
        ('The Canadian Bill of Rights', ['1 (1960)']),
        ('The Royal Commission on Bilingualism and Biculturalism', ['2 (1963)']),
        ('The Royal Commission on the Status of Women', ['3 (1967)']),
        ('The Official Languages Act', ['4 (1969)']),
    ],
    'soc9-independence-democratic-rights-notes': [
        ('secure the right of women to ___', ['vote', 'hold public office (run for election)']),
    ],
    'soc9-postwar-canada-notes': [
        ('non-European regions such as', ['Asia', 'the Caribbean', 'Africa (and Latin America)']),
        ('NATO', ['North Atlantic Treaty Organization (1949): a military alliance of Canada, the US and Western European countries for shared defence against the Soviet Union']),
        ('NORAD', ['North American Air (now Aerospace) Defence Command (1957–58): a joint Canada–US command defending North American airspace']),
        ('Suez Crisis', ['1956 conflict after Egypt took over the Suez Canal and Britain, France and Israel invaded; Lester B. Pearson proposed the first UN peacekeeping force and won the Nobel Peace Prize']),
    ],
    'soc9-modern-economy-notes': [
        ('Automobile manufacturing', ['Cars and trucks, mainly in southern Ontario (expanded by the 1965 Auto Pact with the US)']),
        ('Petroleum and energy production', ['Oil and natural gas, especially in Alberta after the Leduc No. 1 discovery in 1947']),
        ('Paper and forestry', ['Lumber, pulp and newsprint, mainly from BC, Ontario and Quebec, much of it exported to the US']),
        ('Hydroelectric power development', ['Electricity from large dams (Quebec, BC, Ontario, Manitoba) that powered homes and industry']),
    ],
    'soc9-system-of-government-notes': [
        ('Third reading (final approval)', ['5']),
        ('First reading (introduction)', ['2']),
        ('Royal assent by the Crown', ['7']),
        ('Bill drafting', ['1']),
        ('Second reading (debate)', ['3']),
        ('Committee stage (detailed review)', ['4']),
        ('Approval by the Senate', ['6']),
        ('___ ___', ['Defence', 'Education']),
        ('___ ___', ['Banking and Currency', 'Healthcare']),
        ('___ ___', ['Trade and Commerce · Criminal Law · Citizenship', 'Property and Civil Rights · Municipalities · Natural Resources']),
        ("economy relies heavily on ___", ['oil and natural gas (energy resources)', 'oil and gas royalties']),
    ],
    'sci6-energy-resources-notes': [
        ('Heating a home', ['Natural gas, wood (biomass), geothermal, solar']),
        ('Cooking food', ['Natural gas, electricity (from any source), wood']),
        ('Transportation (cars, buses)', ['Oil (gasoline, diesel), electricity, biofuels']),
        ('Lighting (electricity)', ['Electricity from coal, natural gas, hydro, wind or solar']),
        ('Manufacturing (factories)', ['Natural gas, coal, oil, electricity']),
    ],
    'sci7-interactions-ecosystems-notes': [
        ('Individual', ['one single organism']),
    ],
    'math9-polynomials-notes': [
        ('Degree of each term:', ['3', '2', '1', '0']),
        ('Degree of the polynomial: ___', ['3']),
        ('Leading coefficient: ___', ['4']),
        ('coefficient: ___ degree: ___', ['5', '2']),
        ('coefficient: ___ degree: ___', ['−3', '1']),
        ('this is a ___', ['constant (degree 0)']),
        ('Both have ___', ['x²']),
        ('Different ___', ['exponents']),
        ('Different ___', ['variables']),
        ('Both are ___', ['constants (no variable)']),
        ('add or subtract the ___ only', ['coefficients']),
        ('+ 7x2 = ___', ['10']),
        ('Only tiles of the same', ['size', 'shape']),
        ('Remove the ___', ['brackets']),
        ('Identify ___ terms', ['like']),
        ('write in ___ form', ['standard']),
        ('from ___ degree to lowest', ['highest']),
        ('remove brackets', ['3x² + 2x − 1 + x² − 5x + 4']),
        ('group like terms', ['(3x² + x²) + (2x − 5x) + (−1 + 4)']),
        ('___ ← simplified', ['4x² − 3x + 3']),
        ('− 5x + 4 ___', ['4x²', '− 3x', '+ 3']),
        ('Total width = ___', ['(3x + 2) m']),
        ('(−x2 + 3x − 5) =', ['3x² + 2x − 3']),
        ('(−x2 + 1) =', ['5x − 3']),
        ('Subtracting a polynomial means adding its', ['opposite', 'every term']),
        ('Opposite of (2x2 − 3x + 1) =', ['−2x² + 3x − 1']),
        ('= 5x2 + 3x − 4 ___ 2x2', ['−', '+', '−']),
        ('___ ← simplified', ['3x² + 4x − 10']),
        ('Write the correct sign-changed version below:', ['−(2x² − x + 6) = −2x² + x − 6']),
        ('flip all signs here first', ['− 2x²', '+ x', '− 6']),
        ('Remaining area = ___', ['(4x² + 5x − 5) m²']),
        ('(x2 − 2x + 1) =', ['3x² + 3x − 4']),
        ('(5x − 3) =', ['−3x + 10']),
        ('a(b + c) = ___', ['ab + ac']),
        ('multiply the monomial by ___', ['every term']),
        ('xn = x', ['ᵐ⁺ⁿ']),
        ('x × x = x', ['²']),
        ('x2 × x3 = x', ['⁵']),
        ('= ___ + ___ + ___', ['6x³', '− 12x²', '+ 3x']),
        ('= 4x × ___', ['3x²', '(−2x)', '5']),
        ('= ___ + ___ + ___', ['12x³', '− 8x²', '+ 20x']),
        ('Area = 2x(', ['x² + 3x − 1', '(2x³ + 6x² − 2x) m²']),
        ('What is x2 × x3?', ['x⁵']),
        ('Expand: 2x(x + 5) =', ['2x² + 10x']),
        ('Expand: −3x(2x2 − x + 4) =', ['−6x³ + 3x² − 12x']),
        ('every term in the ___', ['second bracket', '4']),
        ('x ___ ___', ['x²', '4x']),
        ('+3 ___ ___', ['3x', '12']),
        ('Sum of partial products:', ['x²', '4x', '3x', '12']),
        ('Simplified: ___', ['x² + 7x + 12']),
        ('2x ___ ___', ['2x²', '10x']),
        ('+1 ___ ___', ['x', '5']),
        ('Simplified: ___', ['2x² + 11x + 5']),
        ('Area = ___ m²', ['x² + 13x + 40']),
        ('How many partial products', ['4']),
        ('Expand: (x + 2)(x + 7) =', ['x² + 9x + 14']),
        ('Expand: (2x − 1)(x + 3) =', ['2x² + 5x − 3']),
        ('Answer: ___', ['2x² + 5x − 3 + 2x² + 6x = 4x² + 11x − 3']),
    ],
    'math9-powers-notes': [
        ('"5 multiplied by itself 2 times"', ['5²', '25']),
        ('2⁶', ['"2 multiplied by itself 6 times"', '2', '2', '2', '2', '2', '2', '64']),
        ('4 × 4 × 4', ['"4 multiplied by itself 3 times"', '4³', '64']),
        ('7³', ['7', '3']), ('(−2)⁵', ['−2', '5']), ('10²', ['10', '2']), ('(−1)⁸', ['−1', '8']),
        ('2⁵ = 2 × 2 × 2 × 2 × 2 =', ['32']),
        ('Step 1: ___ × (−3)', None), ('Step 1: (−3) × (−3) =', ['9', 'positive']),
        ('Step 2: ___ × (−3)', ['9', '−27', 'negative']),
        ('Step 3: ___ × (−3)', ['−27', '81', 'positive']),
        ('(−3)⁴ = ___', ['81']),
        ('−2³ = ___', ['−8', '−8']),
        ('(−2)² (−2)(−2)', ['4', 'Positive']),
        ('(−2)³ (−2)(−2)(−2)', ['−8', 'Negative']),
        ('(−2)⁴', ['(−2)(−2)(−2)(−2)', '16', 'Positive']),
        ('(−2)⁵', ['(−2)(−2)(−2)(−2)(−2)', '−32', 'Negative']),
        ('(−2)⁶', ['(−2)(−2)(−2)(−2)(−2)(−2)', '64', 'Positive']),
        ('3³', ['3 × 3 × 3', '27']), ('3²', ['3 × 3', '9']), ('3¹', ['3', '3']), ('3⁰', ['(no factors left)', '1']),
        ('5²', ['25']), ('5¹', ['5']), ('5⁰', ['1']),
        ('5⁰ = ___', ['1']), ('a⁰ = ___ for any', ['1']),
        ('10² ÷ 10 =', ['10', '1', '1']),
        ('Evaluate: 7⁰ =', ['1']), ('Evaluate: (−15)⁰ =', ['1']),
        ('3² × 3⁵', ['(3×3) × (3×3×3×3×3)', '7', '3⁷']),
        ('5⁴ × 5¹', ['(5×5×5×5) × 5', '5 fives', '5⁵']),
        ('a³ × a⁶', ['(a×a×a) × (a×a×a×a×a×a)', '9 a’s', 'a⁹']),
        ('the same base, ___', ['keep the base and add the exponents']),
        ('Write the rule in symbols: aᵐ × aⁿ =', ['aᵐ⁺ⁿ']),
        ('Are they the same?', ['Yes — both are (−4)']),
        ('(−4)³ × (−4)⁵ = (−4)(', ['3', '5', '(−4)⁸']),
        ('(positive or negative?', ['65 536', 'positive', 'even']),
        ('Add all the exponents', ['4', '2', '3', '⁹']),
        ('Are they equal?', ['No: 2³ × 3⁴ = 648, but 6⁷ = 279 936']),
        ('Simplify: a⁵ × a⁴ =', ['a⁹']), ('Simplify: (−2)³ × (−2)⁶ =', ['(−2)⁹ = −512']),
        ('5⁴ × 5³', ['✓', '—']),
        ('3² × 4²', ['✗', 'Different bases (3 and 4), so you cannot add exponents']),
        ('m⁵ × m', ['✓', '— (m = m¹, so m⁶)']),
        ('2x³ × 3x²', ['✓ (for x)', 'Multiply the coefficients, add the exponents: 6x⁵']),
        ('a⁴b² × a³b', ['✓', 'Add exponents for each base: a⁷b³']),
        ('4⁶ ÷ 4²', ['(4×4×4×4×4×4) ÷ (4×4)', 'Four 4s remain', '4⁴']),
        ('a⁷ ÷ a³', ['(a×a×a×a×a×a×a) ÷ (a×a×a)', 'Four a’s remain', 'a⁴']),
        ('(−2)⁸ ÷ (−2)⁵', ['eight (−2)s ÷ five (−2)s', 'Three (−2)s remain', '(−2)³ = −8']),
        ('Write the rule in words: ___', ['When dividing powers with the same base, keep the base and subtract the exponents']),
        ('aᵐ ÷ aⁿ = ___ (where', ['aᵐ⁻ⁿ']),
        ('x⁹ ÷ x⁴ = x(', ['9', '4', '⁵']),
        ('a⁵ ÷ a⁵ = a(', ['5', '5', '⁰']),
        ('3² ÷ 3⁵ = 3', ['⁻³']),
        ('Simplify: m⁸ ÷ m³ =', ['m⁵']), ('Simplify: (−5)⁶ ÷ (−5)² =', ['(−5)⁴ = 625']),
        ('(3²)⁴', ['(3×3) × (3×3) × (3×3) × (3×3)', '3⁸']),
        ('(a⁴)³', ['a⁴ × a⁴ × a⁴', '(a×a×a×a) × (a×a×a×a) × (a×a×a×a)', 'a¹²']),
        ('(5²)⁵', ['5² × 5² × 5² × 5² × 5²', '(5×5) × (5×5) × (5×5) × (5×5) × (5×5)', '5¹⁰']),
        ('(x²)³', ['Power of a power: multiply exponents', 'x⁶']),
        ('x² × x³', ['Product of powers: add exponents', 'x⁵']),
        ('(y⁵)²', ['Power of a power: multiply exponents', 'y¹⁰']),
        ('y⁵ × y²', ['Product of powers: add exponents', 'y⁷']),
        ('Write the rule: (aᵐ)ⁿ =', ['aᵐⁿ']),
        ('Apply power of a power rule: (−2)(', ['3', '4', '¹²']),
        ('Is the result positive or negative?', ['Positive', 'even (12)']),
        ('Write the power of a power rule in symbols', ['aᵐⁿ']),
        ('Simplify: (a³)⁵ =', ['a¹⁵']), ('Simplify: ((−3)²)³ =', ['(−3)⁶ = 729']),
        ('(2 × 3)²', ['36']), ('(ab)³', ['b³']),
        ('(2x)⁴', ['(2x)(2x)(2x)(2x)', '(2×2×2×2) × (x×x×x×x)', '16x⁴']),
        ('(3mn)²', ['(3mn)(3mn)', '(3×3)(m×m)(n×n)', '9m²n²']),
        ('Write the rule: (ab)ⁿ =', ['aⁿbⁿ']),
        ('(a/b)³ = (a/b)', ['a³', 'b³']),
        ('Write the rule: (a/b)ⁿ =', ['aⁿ / bⁿ']),
        ('Step 2: Evaluate 3⁴ =', ['81']), ('Apply power of a power: (x²)⁴ = x', ['⁸']), ('Result:', ['81x⁸']),
        ('Simplify: (2a)³ =', ['8a³']), ('Simplify: (x/3)² =', ['x² / 9']), ('Simplify: (−5m²)³ =', ['−125m⁶']),
        ('2²', ['4']), ('2¹', ['2']), ('2⁰', ['1']), ('2⁻¹', ['1/2']), ('2⁻²', ['1/4']), ('2⁻³', ['1/8']),
        ('Look at 2⁻¹', ['1/2 (one half)']),
        ('Write the rule: a⁻ⁿ =', ['1 / aⁿ']),
        ('5⁻² = 1/5² = 1/', ['25', '1/25']),
        ('(1/3)⁻² = (3/1)² =', ['9']),
        ('Evaluate: 4⁻² =', ['1/16']), ('Evaluate: (−3)⁻³ =', ['−1/27']), ('x⁻⁵ =', ['1 / x⁵']),
        ('Product of powers aᵐ × aⁿ', ['aᵐ⁺ⁿ']), ('Quotient of powers aᵐ ÷ aⁿ', ['aᵐ⁻ⁿ']),
        ('Power of a power (aᵐ)ⁿ', ['aᵐⁿ']), ('Power of a product (ab)ⁿ', ['aⁿbⁿ']),
        ('Power of a quotient (a/b)ⁿ', ['aⁿ / bⁿ']), ('Zero exponent a⁰', ['1']), ('Negative exponent a⁻ⁿ', ['1 / aⁿ']),
        ('3⁴ × 3³', ['Product of powers', '3⁷ = 2187']),
        ('(x⁵)²', ['Power of a power', 'x¹⁰']),
        ('a⁸ ÷ a³', ['Quotient of powers', 'a⁵']),
        ('(2y)³', ['Power of a product', '8y³']),
        ('7⁰ × 7²', ['Zero exponent + product', '1 × 49 = 49']),
        ('(3a²)⁰', ['Zero exponent', '1']),
        ('b⁻⁴', ['Negative exponent', '1 / b⁴']),
        ('(m³)² × m⁴', ['Power of a power + product', 'm⁶ × m⁴ = m¹⁰']),
        ('(4x³)² ÷ (2x)²', ['Power of a product + quotient', '16x⁶ ÷ 4x² = 4x⁴']),
        ('5⁻² × 5⁴', ['Product (negative exponent)', '5² = 25']),
        ('(5x³)² = 5x⁶', None),
        ('Error:', ['The 5 was not squared']), ('Corrected:', ['(5x³)² = 25x⁶']),
        ('Error:', ['The exponents were multiplied instead of added']), ('Corrected:', ['a³ × a⁴ = a⁷']),
        ('Error:', ['No error: (m²)³ = m⁶ and m⁶ ÷ m⁵ = m¹ = m. (This item may need a deliberate mistake.)']), ('Corrected:', ['m¹ = m']),
        ('Product of powers aᵐ × aⁿ =', ['aᵐ⁺ⁿ']), ('Quotient of powers aᵐ ÷ aⁿ =', ['aᵐ⁻ⁿ']),
        ('Power of a power (aᵐ)ⁿ =', ['aᵐⁿ']), ('Power of a product (ab)ⁿ =', ['aⁿbⁿ']),
        ('Zero exponent a⁰ =', ['1']), ('Negative exponent a⁻ⁿ =', ['1 / aⁿ']),
    ],
}
FIX = {
    'math9-linear-relations-notes': {15: 'choose (control)', 16: 'depends', 36: 'From any point on the line, move 1 right and 2 up and you land on the line again.', 41: 'The temperature falls 2°C for every hour that passes.', 82: '6', 83: '4', 84: '2', 85: '0', 116: 'C = 0.20d + 50'},
    'math9-probability-notes': {93: 'One ace and one card have been removed,', 94: 'so only 3 aces are left among 51 cards.'},
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


def label_key(text):
    """Comparable form of a row label. Word labels compare by words; math
    labels ("3² × 4²", "x⁹ ÷ x⁴") compare by their exact characters."""
    w = norm(text)
    if len(w.replace(' ', '')) >= 4 and not re.search(r'[\d⁰¹²³⁴⁵⁶⁷⁸⁹⁻×÷=+−/^()]', text):
        return w
    return re.sub(r'\s+', '', text.translate(SUPMAP)).lower()


SUPMAP = str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺−–', '0123456789-+--')


def best_key_row(label, krows):
    lw = label_key(label)
    if not lw:
        return None
    best, sc = None, 0
    for kr in krows:
        kw = label_key(kr[0].get_text(' ', strip=True))
        if not kw:
            continue
        r = 1.0 if kw == lw else difflib.SequenceMatcher(None, lw, kw).ratio()
        if r > sc:
            best, sc = kr, r
    need = 0.75 if re.search(r'[a-z]{3}', lw) else 0.95
    return best if sc >= need else None


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
        # synthesis: plain "1. …" prompts get the key answer whose question matches;
        # every other synthesis answer in the old key goes to the section-end box
        if 'synthesis' in title.lower():
            prompts = [x for x in doc.between(s.find_all('p'), h, nxt)
                       if re.match(r'^\s*\d+\.\s', x.get_text(' ', strip=True)) and not (x.find_next_sibling() and 'ak-answer' in (x.find_next_sibling().get('class') or []))]
            krows = []
            for kt in ktables:
                for tr in kt.find_all('tr'):
                    tds = tr.find_all('td')
                    if len(tds) >= 2:
                        krows.append([tds[0].get_text(' ', strip=True), inner(tds[-1]), False])
            for pr in prompts:
                pw = set(words(re.sub(r'^\s*\d+\.', '', pr.get_text(' ', strip=True))))
                best, sc = None, 0
                for kr in krows:
                    if kr[2]:
                        continue
                    kw = set(words(re.sub(r'^\s*\d+\.', '', kr[0])))
                    num_ok = re.match(r'^\s*(\d+)\.', kr[0]) and re.match(r'^\s*(\d+)\.', pr.get_text(strip=True)) and re.match(r'^\s*(\d+)\.', kr[0]).group(1) == re.match(r'^\s*(\d+)\.', pr.get_text(strip=True)).group(1)
                    v = len(pw & kw) / max(1, len(kw)) + (0.3 if num_ok else 0)
                    if v > sc:
                        best, sc = kr, v
                if best is not None and sc >= 0.6:
                    best[2] = True
                    answer_list_items(s, [pr], [best[1]], report, tag)
            for kr in krows:
                if not kr[2]:
                    MORE.append(f'<strong>{kr[0]}</strong> {kr[1]}')
            used_tables.update(id(kt) for kt in ktables)
            label = ''
            for kb in kdoc.between(key_blocks(kold), kh, knext):
                if kb.name in ('h3', 'h4'):
                    label = kb.get_text(' ', strip=True); continue
                if kb.name in ('p', 'ul', 'ol') and kb.find_parent('table') is None and kb.get_text(strip=True) \
                        and not re.search(r'fill this in|notes closed|end of .* answer key', kb.get_text(' ', strip=True), re.I):
                    MORE.append((f'<em>{label}</em> ' if label else '') + inner(kb))
                    label = ''
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


NUMRE = re.compile(r'^\s*((?:S|Q)?\d+[a-z]?)\s*[★☆]*\s*[.):]?\s*$', re.I)


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
