#!/usr/bin/env python3
"""glossary_gaps.py — which words on the site have no Word help definition yet.

Reads the student-facing HTML in public/materials/ (skips answer keys, teacher notes, French
pages, games, sims and trainers, which Word help skips too), counts how many pages each word
appears on, and lists the ones public/dictionary/glossary.txt cannot define. The same plural,
-ed, -ing and -ly rules as dictionary.js are used, so "particles" counts as defined by "particle".

Run:  python3 scripts/glossary_gaps.py [--min-pages 5] [--min-len 5] [--top 150] [--check]
  --check   only validate glossary.txt (bad lines, duplicate terms); exit 1 on a problem.
Write new entries into public/dictionary/glossary.txt, then bump ASSET_VERSION in
src/components/DictionarySupport.astro and the ?v= in src/layouts/BaseLayout.astro.
"""
import argparse, collections, glob, html, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GLOSS = os.path.join(ROOT, 'public', 'dictionary', 'glossary.txt')
SKIP_FILE = ('answers', 'teacher', '-key', '-fr-', '_fr', 'sim-', 'trainer', 'game', 'prereq')


def load_terms():
    terms, problems = {}, []
    for n, line in enumerate(open(GLOSS, encoding='utf8'), 1):
        line = line.rstrip('\n')
        if not line.strip() or line.startswith('#'):
            continue
        parts = line.split('|')
        if len(parts) < 2 or not parts[0].strip() or not parts[1].strip():
            problems.append(f'line {n}: needs "term | definition"')
            continue
        for t in parts[0].split(','):
            t = t.strip().lower().replace('’', "'")
            if not t:
                continue
            if t in terms:
                problems.append(f'line {n}: "{t}" is already defined on line {terms[t]}')
            terms[t] = n
    return terms, problems


def forms(w):
    out = [w]
    def add(x):
        if len(x) > 2 and x not in out:
            out.append(x)
    if w.endswith("'s"): add(w[:-2])
    if w.endswith('ies'): add(w[:-3] + 'y')
    if w.endswith('ves'): add(w[:-3] + 'f'); add(w[:-3] + 'fe')
    if re.search(r'(ses|xes|zes|oes|ches|shes)$', w): add(w[:-2])
    if w.endswith('s') and not w.endswith('ss'): add(w[:-1])
    if w.endswith('ed'):
        add(w[:-2]); add(w[:-1])
        if re.search(r'(.)\1ed$', w): add(w[:-3])
        if w.endswith('ied'): add(w[:-3] + 'y')
    if w.endswith('ing'):
        add(w[:-3]); add(w[:-3] + 'e')
        if re.search(r'(.)\1ing$', w): add(w[:-4])
    if w.endswith('ly'): add(w[:-2])
    if w.endswith('ier'): add(w[:-3] + 'y')
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--min-pages', type=int, default=5)
    ap.add_argument('--min-len', type=int, default=5)
    ap.add_argument('--top', type=int, default=150)
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()

    terms, problems = load_terms()
    for p in problems:
        print('PROBLEM', p)
    print(f'{len(terms)} terms in glossary.txt')
    if a.check:
        sys.exit(1 if problems else 0)

    single = {t for t in terms if ' ' not in t}
    df = collections.Counter()
    docs = 0
    for f in glob.glob(os.path.join(ROOT, 'public', 'materials', '**', '*.html'), recursive=True):
        if any(k in f.lower() for k in SKIP_FILE):
            continue
        s = open(f, encoding='utf8', errors='ignore').read()
        if re.search(r'<html[^>]*lang="fr', s):
            continue
        s = re.sub(r'<(script|style|svg)\b.*?</\1>', '', s, flags=re.S | re.I)
        text = html.unescape(re.sub(r'<[^>]+>', ' ', s)).lower().replace('’', "'")
        docs += 1
        df.update({w for w in re.findall(r"[a-z][a-z'-]*", text) if len(w) >= a.min_len})
    missing = [(n, w) for w, n in df.items()
               if n >= a.min_pages and not any(x in single for x in forms(w.strip("'-")))]
    missing.sort(key=lambda x: (-x[0], x[1]))
    print(f'{docs} pages read; {len(missing)} words on {a.min_pages}+ pages have no definition. Top {a.top}:')
    for n, w in missing[:a.top]:
        print(f'{n:4d}  {w}')


if __name__ == '__main__':
    main()
