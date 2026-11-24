#!/usr/bin/env python3
"""build_wordnet_fallback.py — makes public/dictionary/general.txt, the fallback for Word help.

Word help shows a definition from public/dictionary/glossary.txt (written for students) first.
For a word the glossary does not have, it falls back to general.txt: the Princeton WordNet gloss
for the most common meaning of each word that appears on the site's student pages. These are
written for adults and may be the wrong meaning for a lesson, so the card says so. Write a real
definition in glossary.txt for any word that matters; it then wins.

Run (needs nltk; the first run downloads WordNet):
    python3 scripts/build_wordnet_fallback.py [--min-pages 2]
Then bump ASSET_VERSION in src/components/DictionarySupport.astro and ?v= in BaseLayout.astro.

WordNet 3.0 Copyright 2006 by Princeton University. All rights reserved. It may be used and
redistributed with this notice; see https://wordnet.princeton.edu/license-and-commercial-use
"""
import argparse, collections, glob, html, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from glossary_gaps import ROOT, SKIP_FILE, forms, load_terms  # noqa: E402

OUT = os.path.join(ROOT, 'public', 'dictionary', 'general.txt')
# Words too small or too plain to be worth a card (dictionary.js also ignores words under 3 letters).
SKIP = set('the and but for are was you can not has had his her its who how why did our your they them this that '
           'with from have will what when were been than then there these those into onto also just very much '
           'such some any each both either neither whom whose which would could should shall might must does done '
           'about above after again against all along among around because before behind below beside between '
           'during every except inside outside over under until upon within without'.split())

# This is a school site: leave out adult, violent and offensive entries.
BLOCK_WORDS = set('sex sexual sexy erotic porn nude naked drug drugs cocaine heroin alcohol alcoholic drunk beer wine vodka whiskey '
                  'rape kill killed murder suicide gun guns weapon weapons bomb bombs damn hell bastard bitch slave slaves'.split())
BLOCK_DEF = re.compile(r"\b(sex\w*|genital\w*|penis|vagina\w*|orgasm\w*|erotic\w*|prostitut\w*|rape\w*|cocaine|heroin|"
                       r"intoxicat\w*|testicle\w*|breast\w*|nude|naked|porn\w*|vulgar|obscene|offensive|derogatory|"
                       r"disparaging|contemptuous|slang|taboo|buttock\w*|anus|urinat\w*|feces|excrement|copulat\w*|"
                       r"fornicat\w*|lust\w*|incest\w*|homosexual\w*|lesbian|gay)\b", re.I)


def pick_sense(lemma, wn):
    """The most-used meaning of the lemma across all parts of speech, or None when no meaning
    clearly dominates. Many-meaning words (far, same, grade, tell...) get no fallback: their first
    WordNet meaning is often a person, a baseball term or an organisation. Names are left out too.
    A rare word with at most two meanings is accepted."""
    syn = wn.synsets(lemma)
    if not syn:
        return None
    def cnt(sy):
        return sum(l.count() for l in sy.lemmas() if l.name().lower() == lemma)
    names = [l.name() for sy in syn for l in sy.lemmas() if l.name().lower() == lemma]
    if names and names[0] != names[0].lower():
        return None
    ranked = sorted(syn, key=cnt, reverse=True)
    total = sum(cnt(sy) for sy in syn)
    if total == 0:
        return ranked[0] if len(syn) <= 2 else None
    if cnt(ranked[0]) / total >= 0.6 and len(syn) <= 6:
        return ranked[0]
    return None


def readable(d):
    """Short, with no hard words: these are shown to Grade 5-9 students."""
    return 8 <= len(d) <= 120 and not d.startswith('(') and not re.search(r"[A-Za-z]{13,}", d)


# This is a school site: leave out adult, violent and offensive entries.
BLOCK_WORDS = set('sex sexual sexy erotic porn nude naked drug drugs cocaine heroin alcohol alcoholic drunk beer wine vodka whiskey '
                  'rape kill killed murder suicide gun guns weapon weapons bomb bombs damn hell bastard bitch slave slaves'.split())
BLOCK_DEF = re.compile(r"\b(sex\w*|genital\w*|penis|vagina\w*|orgasm\w*|erotic\w*|prostitut\w*|rape\w*|cocaine|heroin|"
                       r"intoxicat\w*|testicle\w*|breast\w*|nude|naked|porn\w*|vulgar|obscene|offensive|derogatory|"
                       r"disparaging|contemptuous|slang|taboo|buttock\w*|anus|urinat\w*|feces|excrement|copulat\w*|"
                       r"fornicat\w*|lust\w*|incest\w*|homosexual\w*|lesbian|gay)\b", re.I)


def confident(syn, lemma):
    """True when the first meaning is very probably the one a student means: one sense clearly
    dominates in WordNet's usage counts, or the word is rare with at most two senses. Words with
    many competing meanings (far, same, grade, tell...) get no fallback: the first meaning is
    often a person, a baseball term or an organisation. Proper names are left out too."""
    lemma = (lemma or '').lower()
    names = [l.name() for l in syn[0].lemmas() if l.name().lower() == lemma]
    if not names or names[0] != names[0].lower():
        return False
    counts = [sum(l.count() for l in sy.lemmas() if l.name().lower() == lemma) for sy in syn]
    total = sum(counts)
    if total == 0:
        return len(syn) <= 2
    return counts[0] / total >= 0.6 and len(syn) <= 6


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--min-pages', type=int, default=2)
    ap.add_argument('--max-pages', type=int, default=80, help='skip words on more pages than this (too common)')
    a = ap.parse_args()
    import nltk
    nltk.download('wordnet', quiet=True)
    from nltk.corpus import wordnet as wn

    terms, _ = load_terms()
    single = {t for t in terms if ' ' not in t}
    df = collections.Counter()
    for f in glob.glob(os.path.join(ROOT, 'public', 'materials', '**', '*.html'), recursive=True):
        if any(k in f.lower() for k in SKIP_FILE):
            continue
        s = open(f, encoding='utf8', errors='ignore').read()
        if re.search(r'<html[^>]*lang="fr', s):
            continue
        s = re.sub(r'<(script|style|svg)\b.*?</\1>', '', s, flags=re.S | re.I)
        text = html.unescape(re.sub(r'<[^>]+>', ' ', s)).lower().replace('’', "'")
        df.update(set(re.findall(r"[a-z][a-z'-]*", text)))

    lines, done = [], set()
    for w, n in sorted(df.items()):
        w = w.strip("'-")
        if n < a.min_pages or len(w) < 3 or w in SKIP or "'" in w:
            continue
        if any(x in single for x in forms(w)):
            continue
        lemma = wn.morphy(w) or w
        if lemma in done or lemma in SKIP or any(x in BLOCK_WORDS for x in forms(w) + [lemma]):
            continue
        if n > a.max_pages or any(x in single for x in forms(lemma)):
            continue
        sy = pick_sense(lemma, wn)
        if not sy:
            continue
        parts = [x.strip() for x in sy.definition().split(';') if x.strip() and not x.strip().startswith('-')]
        d = parts[0] if parts else ''
        if not readable(d) or BLOCK_DEF.search(d):
            continue
        done.add(lemma)
        w = lemma
        lines.append(f'{w} | {d}')
    with open(OUT, 'w', encoding='utf8') as fh:
        fh.write('# General-dictionary fallback for Word help. Made by scripts/build_wordnet_fallback.py. Do not edit by hand.\n'
                 '# WordNet 3.0 Copyright 2006 by Princeton University. All rights reserved.\n'
                 '# https://wordnet.princeton.edu/license-and-commercial-use\n')
        fh.write('\n'.join(lines) + '\n')
    print(f'{len(lines)} words, {os.path.getsize(OUT) // 1024} KB -> {OUT}')


if __name__ == '__main__':
    main()
