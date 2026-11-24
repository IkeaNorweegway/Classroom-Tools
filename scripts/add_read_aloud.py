#!/usr/bin/env python3
"""add_read_aloud.py — read-aloud for guided-notes pages (Kokoro text-to-speech).

What it does, per notes page:
  1. Splits the page into reading units: one sentence of a paragraph, one list item
     (a question), one table row, one heading or figure caption.
  2. Marks each block in the HTML with data-ra="N" (a few attributes, nothing else changes),
     and adds a manifest (inline JSON) plus links to read-aloud.css and read-aloud.js.
  3. Makes one MP3 per unit with Kokoro. Blanks are spoken as the plain word "blank" in
     the normal voice. Files are named by a hash of what they say, so a re-run only makes the
     units that changed; unchanged ones are kept byte for byte.

The student UI (a Listen button, a dock, Space for the next sentence) is public/materials/
read-aloud.js + read-aloud.css and is shared by every page.

Run this LAST in the notes pipeline (after match_keys.py and add_notes_visuals.py): those
scripts match text in the page, and this one adds attributes. It is safe to re-run.

Usage (needs the Kokoro venv, see setup below):
  ~/kokoro-tts/.venv/bin/python scripts/add_read_aloud.py sci7            # inject + make audio
  ~/kokoro-tts/.venv/bin/python scripts/add_read_aloud.py sci7 --no-audio # inject only
  ~/kokoro-tts/.venv/bin/python scripts/add_read_aloud.py sci7 --review review.txt --dry
  ~/kokoro-tts/.venv/bin/python scripts/add_read_aloud.py sci7 --unit heat-temperature
  ~/kokoro-tts/.venv/bin/python scripts/add_read_aloud.py sci7 --remove   # undo the HTML changes
  ~/kokoro-tts/.venv/bin/python scripts/add_read_aloud.py sci7 --prune    # delete unused MP3s

Setup (once, Linux): uv venv -p 3.12 ~/kokoro-tts/.venv, then
  uv pip install -p ~/kokoro-tts/.venv kokoro-onnx soundfile numpy beautifulsoup4
and put kokoro-v1.0.onnx and voices-v1.0.bin (github.com/thewh1teagle/kokoro-onnx, release
model-files-v1.0) in ~/kokoro-tts/models/.  Override with KOKORO_DIR.
"""
import argparse, glob, hashlib, json, os, re, subprocess, sys, time

from bs4 import BeautifulSoup, NavigableString, Tag, Comment
from bs4.builder import HTMLParserTreeBuilder

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAT = os.path.join(ROOT, 'public', 'materials')
KOKORO_DIR = os.environ.get('KOKORO_DIR', os.path.expanduser('~/kokoro-tts'))

# Which pages each family covers. 'audio' is a folder under public/materials/.
FAMILIES = {
    # 'glob' lists the student pages then the answer keys; both share one audio folder, since a key
    # sentence that has no blank is word for word the student sentence and reuses its audio.
    'sci7': {'glob': ['sci7-*-notes-v1.html', 'sci7-*-notes-answers-v2.html'], 'audio': 'audio/sci7'},
    'soc7': {'glob': ['soc7-*-notes-v1.html', 'soc7-*-notes-answers-v1.html'], 'audio': 'audio/soc7'},
    'soc8': {'glob': ['soc8-*-notes-v1.html', 'soc8-*-notes-answers-v1.html'], 'audio': 'audio/soc8'},
    'soc9': {'glob': ['soc9-*-notes-v1.html', 'soc9-*-notes-answers-v1.html'], 'audio': 'audio/soc9'},
}

# ── Voice settings. Changing any of these changes every file's hash, so all audio is remade. ──
VOICE = 'af_bella'
SPEED = 0.95
# A blank is read as the plain word "blank", in the same voice and speed as the rest of the sentence.
# (Until 2026-11-20 it was slower and lower; those settings are only kept so that the names of the
# audio files for sentences WITHOUT a blank do not change.)
LEGACY_BLANK_SETTINGS = [0.8, 0.9, 0.16, 0.14]
LEAD = 0.05                 # silence at the start of every file (MP3 encoders eat the first few ms)
TAIL = 0.12
AUDIO_VERSION = 1           # bump to force every file to be remade
ASSET_VERSION = 1           # ?v= on read-aloud.css/.js; bump when you change them

BLANK = ''            # stands in for a blank (<span class="b">) while text is processed
MARK_OPEN = '<!-- read-aloud (scripts/add_read_aloud.py) -->'
MARK_CLOSE = '<!-- /read-aloud -->'

KEY_MODE = False   # set per page: an answer key has its answers filled in, so nobody has to write

# flags in the manifest
F_CHAIN = 1   # a heading: keep going into the next unit without waiting for a key
F_BLANK = 2   # the unit has a blank
F_WRITE = 4   # the student is expected to write something after hearing it

SKIP_TAGS = {'script', 'style', 'svg', 'pre', 'head', 'noscript', 'img', 'hr'}
SKIP_CLASSES = {'cover', 'key-link', 'key-check', 'name-line', 'al', 'al-short', 'al-pair',
                'svg-wrap', 'viz-ak-note', 'ra-skip'}
OWN_ONLY_SKIP = {'ul', 'ol', 'div', 'table', 'figure', 'p', 'blockquote'}
LABEL_CLASSES = {'r-label', 'c-label', 'm-label', 'label'}
HEADER_SHORT = {'Definition in your own words': 'Definition', 'One example': 'Example',
                'My explanation': 'Explanation'}


# ───────────────────────────── pulling units out of a page ─────────────────────────────

class _KeepAllWhitespace(set):
    """Stops BeautifulSoup shrinking whitespace-only text ("  " -> " "), which would put the
    character counts out of step with the browser's. Counts must match for sentence highlighting."""
    def __contains__(self, item):
        return True


def parse(src):
    builder = HTMLParserTreeBuilder()
    builder.preserve_whitespace_tags = _KeepAllWhitespace()
    return BeautifulSoup(src, builder=builder)


def classes(tag):
    c = tag.get('class') or []
    return set(c.split() if isinstance(c, str) else c)


def is_blank(tag):
    return tag.name == 'span' and 'b' in classes(tag)


def atoms_of(el, own_only):
    """Flatten an element into ('t', text) and ('b', None) atoms in document order.
    read-aloud.js flattens the live DOM the same way, so keep the two in step."""
    out = []

    def walk(n):
        for c in n.children:
            if isinstance(c, Comment):
                continue
            if isinstance(c, NavigableString):
                out.append(('t', str(c)))
            elif isinstance(c, Tag):
                if c.name in SKIP_TAGS or classes(c) & SKIP_CLASSES:
                    continue
                if is_blank(c):
                    out.append(('b', None))
                elif own_only and c.name in OWN_ONLY_SKIP:
                    continue
                elif c.name == 'br':
                    out.append(('t', ' '))
                else:
                    walk(c)
    walk(el)
    return out


def raw_text(atoms):
    return ''.join(BLANK if k == 'b' else s for k, s in atoms)


ABBREVIATIONS = {'e.g', 'i.e', 'etc', 'approx', 'vs', 'fig', 'no', 'dr', 'mr', 'mrs', 'ms', 'st',
                 'ca', 'cf', 'eg', 'ie', 'mt'}
SENT_RE = re.compile(r'([.!?]+)([\'")\]”’]*)\s+')


def split_sentences(raw):
    """Return [(start, end)] spans of raw (trimmed), one per sentence."""
    spans, start = [], 0
    for m in SENT_RE.finditer(raw):
        end = m.end()
        nxt = raw[end:end + 1]
        if not nxt or not (nxt.isupper() or nxt.isdigit() or nxt in '"“‘(' + BLANK + '☐'):
            continue
        punct = m.group(1)
        if punct == '.' or punct.startswith('..'):
            if len(punct) >= 3:
                continue
            tok = re.search(r'(\S+)$', raw[start:m.start(1)])
            tok = tok.group(1) if tok else ''
            if tok.lower().strip('.()') in ABBREVIATIONS or re.fullmatch(r'[A-Z]', tok) or re.fullmatch(r'\d+', tok):
                continue
        spans.append((start, m.start(2) + len(m.group(2))))
        start = end
    spans.append((start, len(raw)))
    # trim whitespace, drop empties
    out = []
    for a, b in spans:
        while a < b and raw[a].isspace():
            a += 1
        while b > a and raw[b - 1].isspace():
            b -= 1
        if b > a:
            out.append((a, b))
    # fold tiny fragments ("Note:", "Step 1.") into the next sentence
    merged, i = [], 0
    while i < len(out):
        a, b = out[i]
        words = [w for w in re.split(r'\s+', raw[a:b].replace(BLANK, ' ')) if w]
        if len(words) <= 2 and not raw[a:b].rstrip().endswith('?') and BLANK not in raw[a:b] and i + 1 < len(out):
            out[i + 1] = (a, out[i + 1][1])
        else:
            merged.append((a, b))
        i += 1
    return merged or ([(0, len(raw))] if raw.strip() else [])


# ───────────────────────── turning text into what is said aloud ─────────────────────────

# Words the voice gets wrong, respelled so it says them right. Keys are matched whole-word,
# ignoring case; a leading capital is kept. Check a word with: espeak-ng -v en-us -q --ipa WORD
# Add to this when you hear a mistake, then re-run (only the units that contain it are remade).
PRONUNCIATION = {'Schwann': 'Shwahn', 'Mercalli': 'Mur-kah-lee',
                 'Métis': 'May-tee', 'Metis': 'May-tee', 'Saskatchewan': 'Sas-katch-uh-wan',
                 'Komagata': 'Koh-mah-gah-tah', 'Nunavut': 'Noo-nuh-voot', 'Dieppe': 'Dee-ep',
                 'Laurier': 'Lor-ee-ay'}

ACRONYMS = {'MA': 'M A', 'GMO': 'G M O', 'TEK': 'T E K', 'BC': 'B C', 'DNA': 'D N A', 'GPS': 'G P S',
            'SW': 'southwest', 'NE': 'northeast', 'NW': 'northwest', 'SE': 'southeast'}
# exact phrases, tried before anything else
LITERAL = [(r'\u2605\s*Stretch\b', 'Stretch question.'), (r'\bRoyal 22e R\u00e9giment', 'Royal Twenty-second Regiment'),
           (r'\bR\u00e9giment', 'Regiment'), (r'\bMPs\b', 'M Ps'), (r'\band/or\b', 'and or'), (r'\bI \(not felt\)', 'one, not felt'), (r'\bXII\b', 'twelve'),
           (r'\bCO\u2082', 'carbon dioxide'), (r'\bH\u2082O\b', 'water'), (r'\bO\u2082', 'oxygen'),
           (r'\be\.g\.', 'for example,'), (r'\bi\.e\.', 'that is,'), (r'\betc\.', 'et cetera'),
           (r'\bapprox\.', 'approximately'), (r'\bvs\.?(?=\s)', 'versus'),
           (r'\bMt\.', 'Mount'), (r'\bSt\.(?=\s+[A-Z])', 'Saint'),
           (r'\(([a-e])\)', lambda m: 'part ' + m.group(1).upper() + ',')]

UNITS = {'km': 'kilometres', 'cm': 'centimetres', 'mm': 'millimetres', 'kg': 'kilograms',
         'mL': 'millilitres', 'N': 'newtons', 'K': 'kelvin', 'J': 'joules', 'kJ': 'kilojoules',
         'g': 'grams', 'm': 'metres', 'L': 'litres'}
UNITS_AT_START = {'km', 'cm', 'mm', 'kg', 'mL', 'N', 'K', 'J', 'kJ'}   # may open a text piece after a blank


def speak(t):
    """Make one stretch of text (no blanks in it) easy for the voice to read."""
    t = t.replace('\xa0', ' ')
    if KEY_MODE:   # "Answer Three forms..." -> a pause after the label
        t = re.sub(r'^(Answer|Sample answer|Possible answer)s?\s+(?=[A-Z"(\d])', r'\1. ', t)
    if '\u2610' in t:  # checkbox lists: "☐ I could teach it ☐ Getting there ☐ Not yet"
        items = [x.strip() for x in t.split('\u2610') if x.strip()]
        t = '. '.join(i.rstrip('.') for i in items) + '.'
    for pat, rep in LITERAL:
        t = re.sub(pat, rep, t)
    t = t.replace('\u2713', ' yes ').replace('\u2717', ' no ')
    t = t.replace('\u2191', ' up arrow ').replace('\u2193', ' down arrow ')
    t = re.sub(r'\u2212\s?(?=\d)', 'minus ', t).replace('\u2212', ' minus ')
    t = re.sub(r'(?:^|(?<=[\s(]))-(?=\d)', 'minus ', t)
    t = re.sub(r'\u00b0\s?C\s?\+(?!\s?\d)', ' degrees Celsius or more', t)
    t = re.sub(r'\u00b0\s?C', ' degrees Celsius', t).replace('\u00b0', ' degrees')
    t = re.sub(r'\b1\s+degrees\b', '1 degree', t)
    t = re.sub(r'(?<![\w])~\s?', 'about ', t)
    t = t.replace('%', ' percent')
    t = t.replace('\u00d7', ' times ').replace('\u00f7', ' divided by ')
    t = t.replace('=', ' equals ')
    t = re.sub(r'(?<=[A-Za-z])\s\+\s(?=[A-Za-z])', ' and ', t)
    t = re.sub(r'(?<![\w])\+(?=\d)', 'plus ', t).replace('+', ' plus ')
    t = re.sub(r'\s?>\s?', ' greater than ', t)
    t = re.sub(r'\s?<\s?', ' less than ', t)

    # arrows: "solid → liquid" reads "to"; longer phrases read ", then"
    parts = re.split(r'\s*\u2192\s*', t)
    if len(parts) > 1:
        joined = parts[0]
        for nxt in parts[1:]:
            left = re.split(r'[,.;:]', joined)[-1]
            right = re.split(r'[,.;:]', nxt)[0]
            short = len(left.split()) <= 2 and len(right.split()) <= 2
            joined += (' to ' if short else ', then ') + nxt
        t = joined

    t = t.replace('\u2014', ', ').replace('\u2013', ' to ').replace('\u00b7', ', ')
    t = re.sub(r'(?<=[A-Za-z])\s?/\s?(?=[A-Za-z])', ' or ', t)
    for u, w in UNITS.items():
        start = '|^' if u in UNITS_AT_START else ''
        t = re.sub(r'(?:(?<=\d)' + start + r')\s?' + re.escape(u) + r"\b(?![-\w'])", ' ' + w, t)
    t = re.sub(r"(?<![\w-])K(?![\w'-])", 'kelvin', t)
    t = re.sub(r'\bR-value\b', 'R value', t)
    t = re.sub(r"\b[A-Z]{2,}(?:'[A-Z])?\b", lambda m: ACRONYMS.get(m.group(0), m.group(0).lower()), t)
    for word, say in PRONUNCIATION.items():
        t = re.sub(r'\b' + re.escape(word) + r'\b',
                   lambda m, say=say: (say[:1].upper() + say[1:]) if m.group(0)[:1].isupper() else say,
                   t, flags=re.I)
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r'(?i)\b(carbon dioxide|oxygen|water|\d+ kelvin|degrees Celsius) \(\1\)', r'\1', t)   # "X (X)": say it once
    t = re.sub(r'\s+([,.;:!?])', r'\1', t)
    t = re.sub(r'([,;:])\s*(?=[,.;:!?])', '', t)
    return t


def parts_from_raw(raw, prefix=''):
    """raw text with BLANK characters -> [('t', spoken text), ('b', None), ...]."""
    out = []
    pieces = raw.split(BLANK)
    for i, piece in enumerate(pieces):
        text = speak(piece)
        if i > 0:
            text = re.sub(r'^[\s,;:.)\]]+', '', text)
        if i == 0 and prefix:
            text = (prefix + ' ' + text).strip()
        if text and re.search(r'[A-Za-z0-9]', text):
            out.append(['t', text])
        if i < len(pieces) - 1:
            out.append(['b', None])
    return out


def unit_flags(parts, writes):
    f = F_BLANK if any(k == 'b' for k, _ in parts) else 0
    if KEY_MODE:
        return f
    if f & F_BLANK or writes:
        f |= F_WRITE
    return f


# ───────────────────────────────── walking a page ─────────────────────────────────

class Page:
    """The units of one page, in reading order."""

    def __init__(self, soup):
        self.blocks = []   # [{el, kind, units:[{parts, flags, a, b}], rawlen}]
        self.soup = soup

    def add(self, el, units, rawlen=None):
        if units:
            self.blocks.append({'el': el, 'units': units, 'rawlen': rawlen})


def follows_answer_lines(el):
    """True if the element holds or is directly followed by writing lines (.al)."""
    if el.find(class_='al'):
        return True
    nxt = el.find_next_sibling()
    return bool(nxt is not None and 'al' in classes(nxt))


def u16(raw, i):
    """Character offset i as the browser counts it (UTF-16 code units)."""
    return len(raw[:i].encode('utf-16-le')) // 2


def own_text_units(el, prefix='', chain=False, split=True):
    atoms = atoms_of(el, own_only=True)
    raw = raw_text(atoms)
    if not re.search(r'[A-Za-z0-9' + BLANK + ']', raw):
        return [], 0
    writes = follows_answer_lines(el)
    if split:
        spans = split_sentences(raw)
    else:
        spans = [(0, len(raw))]
    units = []
    for n, (a, b) in enumerate(spans):
        parts = parts_from_raw(raw[a:b], prefix if n == 0 else '')
        if not parts:
            continue
        sent = raw[a:b].rstrip()
        w = writes if n == len(spans) - 1 else False
        flags = unit_flags(parts, w or sent.endswith('?'))
        if chain:
            flags |= F_CHAIN
        units.append({'parts': parts, 'flags': flags, 'a': u16(raw, a), 'b': u16(raw, b)})
    return units, u16(raw, len(raw))


def table_row_units(tr, headers):
    cells = tr.find_all(['td', 'th'], recursive=False)
    if not cells or all(c.name == 'th' for c in cells):
        return []
    parts = []
    texts = []
    for c in cells:
        raw = raw_text(atoms_of(c, own_only=False))
        empty = not re.search(r'[A-Za-z0-9]', raw.replace(BLANK, '')) and BLANK not in raw
        texts.append(('' if KEY_MODE else BLANK) if empty else raw)   # a key's empty cells are not "blanks"
    if KEY_MODE and not any(t for t in texts[1:]):
        return []
    for i, raw in enumerate(texts):
        head = headers[i] if headers and i < len(headers) and len(headers) == len(texts) else ''
        if KEY_MODE and i > 0 and not raw:
            continue
        head = speak(HEADER_SHORT.get(head, head))
        cell = parts_from_raw(raw)
        if i == 0:
            if cell and cell[-1][0] == 't' and not re.search(r'[.!?:]$', cell[-1][1]):
                cell[-1][1] += '.'
            parts += cell
        else:
            if head:
                parts.append(['t', head + ':'])
            parts += cell
    # merge neighbouring text parts so each stretch is spoken in one go
    merged = []
    for k, v in parts:
        if k == 't' and merged and merged[-1][0] == 't':
            merged[-1][1] += ' ' + v
        else:
            merged.append([k, v])
    if not any(k == 't' for k, _ in merged):
        return []
    return [{'parts': merged, 'flags': unit_flags(merged, False), 'a': None, 'b': None}]


def walk(el, page):
    for c in el.children:
        if not isinstance(c, Tag) or c.name in SKIP_TAGS or classes(c) & SKIP_CLASSES:
            continue
        name = c.name
        if name in ('h2', 'h3', 'h4') or (name == 'div' and classes(c) & LABEL_CLASSES):
            units, n = own_text_units(c, chain=True, split=False)
            page.add(c, units)
        elif name == 'p':
            units, n = own_text_units(c)
            page.add(c, units, n)
        elif name in ('ul', 'ol'):
            number = 0
            for li in c.find_all('li', recursive=False):
                number += 1
                prefix = f'Number {number}.' if name == 'ol' else ''
                units, n = own_text_units(li, prefix=prefix, split=False)
                page.add(li, units)
                walk(li, page)       # nested lists
        elif name == 'table':
            head_row = c.find('tr')
            headers = None
            if head_row is not None and head_row.find('th'):
                headers = [th.get_text(' ', strip=True) for th in head_row.find_all(['th', 'td'], recursive=False)]
            for tr in c.find_all('tr'):
                if tr.find_parent('table') is c:
                    page.add(tr, table_row_units(tr, headers))
        elif name == 'figure':
            cap = c.find('figcaption')
            if cap is not None:
                units, n = own_text_units(cap, split=False)
                page.add(cap, units)
        elif name == 'div' and any(isinstance(x, NavigableString) and x.strip() and not isinstance(x, Comment)
                                   for x in c.children):
            units, n = own_text_units(c)
            page.add(c, units, n)
            walk(c, page)
        else:
            walk(c, page)


# ─────────────────────────────── editing the page's HTML ───────────────────────────────

def strip_injection(src):
    src = re.sub(r'\n?' + re.escape(MARK_OPEN) + r'.*?' + re.escape(MARK_CLOSE) + r'\n?', '\n', src, flags=re.S)
    return re.sub(r' data-ra="\d+"', '', src)


def tag_end(src, off):
    """Index of the '>' that closes the start tag beginning at src[off]."""
    quote = None
    i = off
    while i < len(src):
        ch = src[i]
        if quote:
            if ch == quote:
                quote = None
        elif ch in '"\'':
            quote = ch
        elif ch == '>':
            return i
        i += 1
    raise ValueError('unclosed tag at %d' % off)


def hash_unit(parts):
    if any(k == 'b' for k, _ in parts):
        key = json.dumps([AUDIO_VERSION, VOICE, SPEED, 'blank-inline', parts], ensure_ascii=False, sort_keys=True)
    else:
        key = json.dumps([AUDIO_VERSION, VOICE, SPEED] + LEGACY_BLANK_SETTINGS + [parts],
                         ensure_ascii=False, sort_keys=True)
    return hashlib.sha1(key.encode('utf-8')).hexdigest()[:12]


def family_files(fam):
    return sorted(f for g in fam['glob'] for f in glob.glob(os.path.join(MAT, g)))


def is_key(path):
    return '-notes-answers-' in os.path.basename(path)


def process_page(path, audio_dir_rel):
    """Return (new_source, manifest, units) for one page."""
    global KEY_MODE
    KEY_MODE = is_key(path)
    src = strip_injection(open(path, encoding='utf-8').read())
    soup = parse(src)
    body = soup.body
    page = Page(soup)
    walk(body, page)

    line_starts = [0]
    for m in re.finditer('\n', src):
        line_starts.append(m.end())

    edits, manifest_blocks, all_units = [], [], []
    for k, blk in enumerate(page.blocks):
        el = blk['el']
        off = line_starts[el.sourceline - 1] + el.sourcepos
        if not src.startswith('<' + el.name, off):
            raise RuntimeError(f'{path}: start tag of <{el.name}> not found at line {el.sourceline}')
        end = tag_end(src, off)
        at = end - 1 if src[end - 1] == '/' else end
        edits.append((at, f' data-ra="{k}"'))
        units = blk['units']
        entry = []
        for u in units:
            u['hash'] = hash_unit(u['parts'])
            all_units.append(u)
        if len(units) == 1:
            entry = [units[0]['hash'], units[0]['flags']]
        else:
            entry = [[u['hash'], u['flags'], u['a'], u['b']] for u in units] + [blk['rawlen']]
        manifest_blocks.append(entry)

    for at, text in sorted(edits, reverse=True):
        src = src[:at] + text + src[at:]

    manifest = {'v': 1, 'base': audio_dir_rel + '/', 'b': manifest_blocks}
    head = f'{MARK_OPEN}\n<link rel="stylesheet" href="read-aloud.css?v={ASSET_VERSION}">\n{MARK_CLOSE}\n'
    tail = (f'{MARK_OPEN}\n<script type="application/json" id="ra-manifest">'
            + json.dumps(manifest, separators=(',', ':')) + '</script>\n'
            + f'<script src="read-aloud.js?v={ASSET_VERSION}" defer></script>\n{MARK_CLOSE}\n')
    if '</head>' not in src or '</body>' not in src:
        raise RuntimeError(f'{path}: no </head> or </body>')
    src = src.replace('</head>', head + '</head>', 1)
    i = src.rindex('</body>')
    src = src[:i] + tail + src[i:]
    return src, manifest, all_units


def describe(parts):
    return ' '.join('[blank]' if k == 'b' else v for k, v in parts)


# ───────────────────────────────────── main ─────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('family', choices=sorted(FAMILIES))
    ap.add_argument('--unit', help='only the page whose file name contains this text')
    ap.add_argument('--dry', action='store_true', help='do not write any HTML or audio')
    ap.add_argument('--review', metavar='FILE', help='write every spoken unit to FILE for reading through')
    ap.add_argument('--no-audio', action='store_true', help='edit the HTML but make no audio')
    ap.add_argument('--remove', action='store_true', help='take the read-aloud changes out of the pages')
    ap.add_argument('--prune', action='store_true', help='delete audio files no page uses any more')
    args = ap.parse_args()

    fam = FAMILIES[args.family]
    files = family_files(fam)
    if args.unit:
        files = [f for f in files if args.unit in os.path.basename(f)]
    if not files:
        sys.exit('no pages matched')
    audio_dir = os.path.join(MAT, fam['audio'])

    if args.remove:
        for f in files:
            src = open(f, encoding='utf-8').read()
            new = strip_injection(src)
            if new != src and not args.dry:
                open(f, 'w', encoding='utf-8').write(new)
            print(('would strip ' if args.dry else 'stripped ') + os.path.basename(f))
        return

    review, wanted, total_chars = [], {}, 0
    for f in files:
        new_src, manifest, units = process_page(f, fam['audio'])
        name = os.path.basename(f)
        for n, u in enumerate(units):
            wanted.setdefault(u['hash'], u['parts'])
            review.append(f"{name[:-5]} #{n:03d} {'C' if u['flags'] & F_CHAIN else '-'}"
                          f"{'B' if u['flags'] & F_BLANK else '-'}{'W' if u['flags'] & F_WRITE else '-'} | {describe(u['parts'])}")
        print(f'{name}: {len(units)} units')
        if not args.dry:
            open(f, 'w', encoding='utf-8').write(new_src)
    total_chars = sum(len(v) for p in wanted.values() for k, v in p if k == 't')
    print(f'{len(wanted)} distinct units, {total_chars} characters to speak')
    if args.review:
        open(args.review, 'w', encoding='utf-8').write('\n'.join(review) + '\n')
        print('review text written to', args.review)

    existing = set(os.path.splitext(x)[0] for x in os.listdir(audio_dir)) if os.path.isdir(audio_dir) else set()
    if args.prune and not args.dry:
        # prune against every page of the family, not only the ones selected
        used = set(wanted)
        if args.unit:
            for f in family_files(fam):
                if f not in files:
                    used |= set(re.findall(r'"([0-9a-f]{12})"', re.search(r'id="ra-manifest">(.*?)</script>',
                                open(f, encoding='utf-8').read(), re.S).group(1)))
        gone = [x for x in existing if x not in used and x != 'blank']
        for x in gone:
            os.remove(os.path.join(audio_dir, x + '.mp3'))
        print(f'pruned {len(gone)} unused audio files')

    todo = [h for h in wanted if h not in existing]
    print(f'{len(todo)} to make, {len(wanted) - len(todo)} already there')
    if args.dry or args.no_audio or not todo:
        return

    from read_aloud_tts import Speaker  # noqa: E402  (needs the Kokoro venv)
    os.makedirs(audio_dir, exist_ok=True)
    sp = Speaker(KOKORO_DIR, dict(voice=VOICE, speed=SPEED, lead=LEAD, tail=TAIL))
    t0 = time.time()
    for i, h in enumerate(todo, 1):
        sp.make(wanted[h], os.path.join(audio_dir, h + '.mp3'))
        if i % 10 == 0 or i == len(todo):
            el = time.time() - t0
            print(f'  {i}/{len(todo)}  {el / 60:.1f} min elapsed, about {el / i * (len(todo) - i) / 60:.1f} min left', flush=True)


if __name__ == '__main__':
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    main()
