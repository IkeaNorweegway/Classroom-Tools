#!/usr/bin/env python3
"""
Convert Math 9 teacher notes from v1 inline-label format to v2 card-based format.

Usage:
    python3 convert_v1_to_v2.py [--dry-run] [file1.html file2.html ...]
    python3 convert_v1_to_v2.py  # runs on all v1 files found

Each v1 file is written to the same path with v1 → v2 in the filename.
"""

import re
import sys
import os
import glob
import copy
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Tag

# ── New CSS ──────────────────────────────────────────────────────────────────

NEW_CSS_TEMPLATE = """\
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.55;
  color: #1e293b;
  background: #fff;
  max-width: 820px;
  margin: 0 auto;
  padding: 28px 32px 56px;
}
:root {
  --accent: ACCENT_VALUE;
  --accent-light: ACCENT_LIGHT_VALUE;
  --accent-mid: ACCENT_MID_VALUE;
}
h1 { font-size: 22pt; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
h2 { font-size: 14pt; font-weight: 700; color: var(--accent); margin: 32px 0 10px; border-bottom: 2px solid var(--accent-light); padding-bottom: 4px; }
h3 { font-size: 11.5pt; font-weight: 700; color: #334155; margin: 0; text-transform: uppercase; letter-spacing: .04em; padding: 8px 12px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; }
h4 { font-size: 11pt; font-weight: 700; color: var(--accent); margin: 16px 0 4px; }
p { margin-bottom: 8px; }
ul, ol { margin: 6px 0 10px 22px; }
li { margin-bottom: 4px; }
strong { font-weight: 700; }
em { font-style: italic; color: #475569; }
table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10.5pt; }
th { background: var(--accent-light); color: var(--accent); font-weight: 700; text-align: left; padding: 7px 10px; border: 1px solid var(--accent-light); }
td { padding: 8px 10px; border: 1px solid #e2e8f0; vertical-align: top; }
tr:nth-child(even) td { background: #f8fafc; }
pre, code { font-family: 'Courier New', monospace; font-size: 10pt; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 4px; }
pre { padding: 10px 14px; margin: 8px 0; white-space: pre; overflow-x: auto; }
code { padding: 1px 5px; }
hr { border: none; border-top: 2px solid #e2e8f0; margin: 24px 0; }
.teacher-banner { background: var(--accent); color: #fff; padding: 6px 16px; border-radius: 6px; font-size: 9pt; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; display: inline-block; margin-bottom: 10px; }
.show { border-left: 4px solid #64748b; background: #f8fafc; padding: 10px 14px; margin: 0; }
.say  { border-left: 4px solid #0284c7; background: #f0f9ff; padding: 10px 14px; margin: 0; border-top: 1px solid #e8f4fb; }
.cue  { border-left: 4px solid #6366f1; background: #eef2ff; padding: 10px 14px; margin: 0; border-top: 1px solid #e8eeff; }
.beat-label { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 5px; }
.show .beat-label { color: #475569; }
.say  .beat-label { color: #0284c7; }
.cue  .beat-label { color: #4f46e5; }
.beat { border: 1px solid #e2e8f0; border-radius: 8px; margin: 44px 0 0; overflow: hidden; }
.flag { border-radius: 0 6px 6px 0; padding: 10px 14px; margin: 14px 0; font-size: 10.5pt; }
.flag .flag-label { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 5px; display: block; }
.flag-misconception { border-left: 4px solid #dc2626; background: #fef2f2; }
.flag-misconception .flag-label { color: #dc2626; }
.flag-pacing { border-left: 4px solid #d97706; background: #fffbeb; }
.flag-pacing .flag-label { color: #b45309; }
.flag-alberta-context, .flag-alberta, .flag-context { border-left: 4px solid #16a34a; background: #f0fdf4; }
.flag-alberta-context .flag-label, .flag-alberta .flag-label, .flag-context .flag-label { color: #15803d; }
.flag-cs-connection, .flag-connection { border-left: 4px solid #0284c7; background: #f0f9ff; }
.flag-cs-connection .flag-label, .flag-connection .flag-label { color: #0284c7; }
.answer-guide, .retrieval-guide { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 18px; margin: 14px 0; }
.answer-guide .ag-label, .retrieval-guide .rg-label { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #16a34a; margin-bottom: 8px; display: block; }
.answer-guide ol, .retrieval-guide ol { margin-left: 18px; }
.answer-guide li, .retrieval-guide li { margin-bottom: 10px; }
.section-meta { font-size: 9.5pt; color: #64748b; margin: 3px 0 14px; }
.section-meta span { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 1px 8px; border-radius: 10px; font-weight: 600; margin-right: 5px; white-space: nowrap; }
@media print { body { padding: 12px 18px; } h2 { page-break-before: always; } .beat { break-inside: avoid; } }"""


def extract_accent_vars(style_text):
    accent = re.search(r'--accent:\s*(#[0-9a-fA-F]+)', style_text)
    accent_light = re.search(r'--accent-light:\s*(#[0-9a-fA-F]+)', style_text)
    accent_border = re.search(r'--accent-border:\s*(#[0-9a-fA-F]+)', style_text)
    accent_val = accent.group(1) if accent else '#1d4ed8'
    accent_light_val = accent_light.group(1) if accent_light else '#eff6ff'
    accent_mid_val = accent_border.group(1) if accent_border else accent_light_val
    return accent_val, accent_light_val, accent_mid_val


def build_new_css(style_text):
    accent_val, accent_light_val, accent_mid_val = extract_accent_vars(style_text)
    css = NEW_CSS_TEMPLATE
    css = css.replace('ACCENT_VALUE', accent_val)
    css = css.replace('ACCENT_LIGHT_VALUE', accent_light_val)
    css = css.replace('ACCENT_MID_VALUE', accent_mid_val)
    return css


def is_beat_start(tag):
    """True if this <p> tag starts with <strong>Beat N — ..."""
    if not isinstance(tag, Tag) or tag.name != 'p':
        return False
    for child in tag.children:
        if isinstance(child, Tag) and child.name == 'strong':
            text = child.get_text()
            if re.match(r'Beat\s+\d+', text, re.IGNORECASE):
                return True
        break  # only check first child
    return False


def get_beat_title(p_tag):
    for child in p_tag.children:
        if isinstance(child, Tag) and child.name == 'strong':
            text = child.get_text()
            if re.match(r'Beat\s+\d+', text, re.IGNORECASE):
                return text.strip()
    return ''


def is_label(tag, label_class):
    return (isinstance(tag, Tag) and tag.name == 'strong'
            and label_class in tag.get('class', []))


def is_show_label(tag):
    return is_label(tag, 'show-label')

def is_say_label(tag):
    return is_label(tag, 'say-label')

def is_cue_label(tag):
    return is_label(tag, 'cue-label')


def has_label(tag, checker):
    """True if any descendant matches checker."""
    if not isinstance(tag, Tag):
        return False
    return bool(tag.find(lambda t: checker(t)))


def is_flag(tag):
    if not isinstance(tag, Tag):
        return False
    classes = tag.get('class', [])
    return any(c.startswith('flag') for c in classes)


def is_hr(tag):
    return isinstance(tag, Tag) and tag.name == 'hr'

def is_h2(tag):
    return isinstance(tag, Tag) and tag.name == 'h2'

def is_h3(tag):
    return isinstance(tag, Tag) and tag.name == 'h3'

def is_pre(tag):
    return isinstance(tag, Tag) and tag.name == 'pre'

def is_table(tag):
    return isinstance(tag, Tag) and tag.name == 'table'

def is_blockquote(tag):
    return isinstance(tag, Tag) and tag.name == 'blockquote'


def tag_to_html(tag):
    return str(tag)


def children_to_html(children):
    return ''.join(str(c) for c in children).strip()


def split_inline_at_labels(p_tag):
    """
    Parse inline SHOW/SAY/CUE segments from a single <p> tag.
    Returns a dict: {
        'pre_show': html before SHOW label (the beat title text),
        'show': html of show content,
        'say': list of html strings for say segments,
        'cue': list of html strings for cue segments,
        'has_show': bool,
    }
    """
    children = list(p_tag.children)

    segments = []
    current_kind = 'pre_show'
    current = []

    for child in children:
        if is_show_label(child):
            segments.append((current_kind, current))
            current_kind = 'show'
            current = []
        elif is_say_label(child):
            segments.append((current_kind, current))
            current_kind = 'say'
            current = []
        elif is_cue_label(child):
            segments.append((current_kind, current))
            current_kind = 'cue'
            current = []
        else:
            current.append(child)
    segments.append((current_kind, current))

    result = {'pre_show': '', 'show': '', 'say': [], 'cue': [], 'has_show': False}
    for kind, kids in segments:
        html = children_to_html(kids)
        if kind == 'pre_show':
            result['pre_show'] = html
        elif kind == 'show':
            result['show'] = html
            result['has_show'] = True
        elif kind == 'say':
            if html.strip():
                result['say'].append(html)
        elif kind == 'cue':
            if html.strip():
                result['cue'].append(html)

    return result


def cue_label_from_content(cue_text):
    """Extract 'Cue — ★ Write' style label and remainder from cue content."""
    text = cue_text.strip()
    m = re.match(r'^([★✎⊡↩︎✎]+)\s*(Write|Draw|Think|Check)\s*[:\-]?\s*(.*)', text, re.DOTALL | re.UNICODE)
    if m:
        symbol = m.group(1).strip()
        keyword = m.group(2)
        rest = m.group(3).strip()
        return f'Cue — {symbol} {keyword}', rest
    return 'Cue', text


def make_beat_div(soup, beat_title, show_elements, say_html_list, cue_html_list):
    """
    Construct <div class="beat"> from parsed components.
    show_elements: list of (kind, content) where kind is 'html', 'tag'
    say_html_list: list of html strings to merge into SAY
    cue_html_list: list of html strings to merge into CUE
    """
    beat_div = soup.new_tag('div', attrs={'class': 'beat'})

    # h3
    h3 = soup.new_tag('h3')
    h3.string = beat_title
    beat_div.append(h3)
    beat_div.append('\n')

    # .show
    show_div = soup.new_tag('div', attrs={'class': 'show'})
    lbl = soup.new_tag('div', attrs={'class': 'beat-label'})
    lbl.string = 'Show'
    show_div.append(lbl)
    show_div.append('\n')
    for elem in show_elements:
        if isinstance(elem, str):
            if elem.strip():
                frag = BeautifulSoup(f'<p>{elem}</p>', 'html.parser')
                show_div.append(copy.copy(frag.p))
                show_div.append('\n')
        else:
            show_div.append(copy.copy(elem))
            show_div.append('\n')
    beat_div.append(show_div)
    beat_div.append('\n')

    # .say
    combined_say = ' '.join(say_html_list).strip()
    if combined_say:
        say_div = soup.new_tag('div', attrs={'class': 'say'})
        lbl = soup.new_tag('div', attrs={'class': 'beat-label'})
        lbl.string = 'Say'
        say_div.append(lbl)
        say_div.append('\n')
        frag = BeautifulSoup(f'<p>{combined_say}</p>', 'html.parser')
        say_div.append(copy.copy(frag.p))
        say_div.append('\n')
        beat_div.append(say_div)
        beat_div.append('\n')

    # .cue
    combined_cue = ' '.join(cue_html_list).strip()
    if combined_cue:
        cue_div = soup.new_tag('div', attrs={'class': 'cue'})
        cue_label_str, cue_body = cue_label_from_content(combined_cue)
        lbl = soup.new_tag('div', attrs={'class': 'beat-label'})
        lbl.string = cue_label_str
        cue_div.append(lbl)
        cue_div.append('\n')
        if cue_body.strip():
            frag = BeautifulSoup(f'<p>{cue_body}</p>', 'html.parser')
            cue_div.append(copy.copy(frag.p))
        else:
            frag = BeautifulSoup(f'<p>{combined_cue}</p>', 'html.parser')
            cue_div.append(copy.copy(frag.p))
        cue_div.append('\n')
        beat_div.append(cue_div)
        beat_div.append('\n')

    return beat_div


def normalize_flag_classes(tag, soup):
    """Normalize flag div classes and convert span.flag-label → div.flag-label."""
    if not isinstance(tag, Tag) or not is_flag(tag):
        return
    classes = tag.get('class', [])
    type_class = None
    for c in classes:
        for prefix in ('flag-misconception', 'flag-pacing', 'flag-alberta-context',
                       'flag-cs-connection', 'flag-connection', 'flag-alberta',
                       'flag-context'):
            if c == prefix or c.startswith(prefix + '-'):
                type_class = prefix
                break
        if type_class:
            break
    if type_class:
        tag['class'] = ['flag', type_class]
    else:
        if 'flag' not in classes:
            tag['class'] = ['flag'] + classes
    # span.flag-label → div.flag-label
    for span in tag.find_all('span', class_='flag-label'):
        new_div = soup.new_tag('div', attrs={'class': 'flag-label'})
        for child in list(span.children):
            new_div.append(child.extract())
        span.replace_with(new_div)


def strip_labels_from_non_beats(soup):
    """
    For any <strong class="show-label|say-label|cue-label"> that remains OUTSIDE
    a .beat div, replace the <strong> tag with its text content.
    This cleans up Retrieval Check sections and other free-standing SAY/CUE labels.
    """
    body = soup.body
    for strong in body.find_all('strong'):
        classes = strong.get('class', [])
        if any(c in classes for c in ('show-label', 'say-label', 'cue-label')):
            # Check if inside a .beat div
            parent = strong.parent
            in_beat = False
            while parent and parent.name != 'body':
                if isinstance(parent, Tag) and 'beat' in parent.get('class', []):
                    in_beat = True
                    break
                parent = parent.parent
            if not in_beat:
                # Replace <strong class="say-label">SAY:</strong> with plain text
                strong.replace_with(NavigableString(strong.get_text()))


def process_body(soup, filename):
    """
    Main beat conversion. Iterates body children, identifies beat blocks,
    and replaces them with .beat divs.
    Returns report dict.
    """
    body = soup.body
    beat_count = 0
    warnings = []

    def get_children():
        return [c for c in body.children
                if not (isinstance(c, NavigableString) and not c.strip())]

    i = 0
    while True:
        children = get_children()
        if i >= len(children):
            break

        tag = children[i]

        if not is_beat_start(tag):
            i += 1
            continue

        beat_title = get_beat_title(tag)

        # ── Parse the beat-opening paragraph ──────────────────────────────
        parsed = split_inline_at_labels(tag)
        show_html = parsed['show']
        say_list = list(parsed['say'])
        cue_list = list(parsed['cue'])

        # The show content might start after the SHOW label in the same <p>,
        # or the <p> might just have the beat title + description (no SHOW label).
        # In the latter case, everything in the <p> after the beat title strong
        # becomes SHOW content.
        if not parsed['has_show']:
            # The description text after the beat title becomes the show content
            # (it describes what goes on the board)
            show_html = parsed['pre_show']
            # Strip the beat title strong from show_html
            frag = BeautifulSoup(f'<div>{show_html}</div>', 'html.parser')
            # Remove first <strong> that matches beat title
            for s in frag.find_all('strong'):
                if re.match(r'Beat\s+\d+', s.get_text(), re.IGNORECASE):
                    s.decompose()
                    break
            show_html = frag.div.decode_contents().strip()

        # show_elements: list of html strings and Tag objects for SHOW div
        show_elements = []
        if show_html.strip():
            show_elements.append(show_html)

        # ── Collect following siblings belonging to this beat ─────────────
        j = i + 1
        consumed_tags = [tag]  # tags to remove after processing

        while j < len(children):
            sib = children[j]

            # Hard stops
            if is_beat_start(sib):
                break
            if is_h2(sib) or is_h3(sib):
                break
            if is_flag(sib):
                # Flags stay OUTSIDE the beat div as siblings.
                # But look past the flag: if the very next non-hr sibling is a
                # <p> with SAY/CUE labels, it still belongs to this beat.
                # Peek ahead to see if there's a SAY/CUE p after this flag
                # (only one flag-skip allowed — a CUE orphan after a flag is common).
                k = j + 1
                while k < len(children) and is_hr(children[k]):
                    k += 1
                if k < len(children):
                    next_sib = children[k]
                    if isinstance(next_sib, Tag) and next_sib.name == 'p':
                        p_kids = list(next_sib.children)
                        if (any(is_say_label(c) for c in p_kids) or
                                any(is_cue_label(c) for c in p_kids)):
                            # There's a SAY/CUE paragraph after the flag
                            # Skip the flag (leave it in place) and continue
                            j += 1
                            continue
                # No SAY/CUE follows the flag — stop here
                break

            # hr between beats — peek ahead
            if is_hr(sib):
                k = j + 1
                while k < len(children) and is_hr(children[k]):
                    k += 1
                # If next non-hr is a beat-start or h2 or h3, stop here
                if k < len(children) and (is_beat_start(children[k]) or
                                           is_h2(children[k]) or
                                           is_h3(children[k])):
                    break
                # Otherwise this hr is within the beat — consume and skip
                consumed_tags.append(sib)
                j += 1
                continue

            if is_pre(sib):
                # Pre goes in SHOW
                show_elements.append(sib)
                consumed_tags.append(sib)
                j += 1
                continue

            if is_table(sib):
                # Table in a beat goes in SHOW (translation table, worked example table, etc.)
                show_elements.append(sib)
                consumed_tags.append(sib)
                j += 1
                continue

            if is_blockquote(sib):
                # Blockquotes are typically preparation notes — put in SHOW
                show_elements.append(sib)
                consumed_tags.append(sib)
                j += 1
                continue

            if isinstance(sib, Tag) and sib.name == 'p':
                p_children = list(sib.children)
                has_show = any(is_show_label(c) for c in p_children)
                has_say = any(is_say_label(c) for c in p_children)
                has_cue = any(is_cue_label(c) for c in p_children)

                if has_show or has_say or has_cue:
                    # Parse this paragraph for SHOW/SAY/CUE content
                    p_parsed = split_inline_at_labels(sib)
                    if p_parsed['show'].strip():
                        show_elements.append(p_parsed['show'])
                    say_list.extend(p_parsed['say'])
                    cue_list.extend(p_parsed['cue'])
                    consumed_tags.append(sib)
                    j += 1
                    continue

                # Plain paragraph with no labels
                sib_text = sib.get_text().strip()
                # Teacher commentary in italics (starts with em or italic text)
                first_child = next((c for c in sib.children
                                    if not isinstance(c, NavigableString) or c.strip()), None)
                is_commentary = (
                    isinstance(first_child, Tag) and first_child.name == 'em'
                ) or sib_text.startswith('Allow') or sib_text.startswith('Answers:')

                if is_commentary:
                    # Don't break immediately — peek forward (up to 4 elements)
                    # to catch an orphaned CUE paragraph that follows.
                    # Skip: hrs, flags, plain <p>s (unlabeled), and more commentary.
                    found_labeled = False
                    k = j + 1
                    steps = 0
                    while k < len(children) and steps < 5:
                        peek = children[k]
                        if is_hr(peek) or is_flag(peek):
                            k += 1
                            steps += 1
                            continue
                        if isinstance(peek, Tag) and peek.name == 'p':
                            pk = list(peek.children)
                            if (any(is_say_label(c) for c in pk) or
                                    any(is_cue_label(c) for c in pk)):
                                found_labeled = True
                                break
                        k += 1
                        steps += 1
                    if found_labeled:
                        # Skip this commentary tag, don't consume it
                        j += 1
                        continue
                    break  # leave commentary after the beat
                elif not say_list and not cue_list:
                    # Still in SHOW territory — append to show
                    show_elements.append(sib)
                    consumed_tags.append(sib)
                    j += 1
                    continue
                else:
                    # After SAY/CUE, unlabeled plain paragraph.
                    # Peek forward to see if a labeled SAY/CUE follows within
                    # a few elements (handles "SAY (corrected):" or similar unlabeled intermediaries).
                    found_labeled = False
                    k = j + 1
                    steps = 0
                    while k < len(children) and steps < 5:
                        peek = children[k]
                        if is_hr(peek) or is_flag(peek):
                            k += 1
                            steps += 1
                            continue
                        if isinstance(peek, Tag) and peek.name == 'p':
                            pk = list(peek.children)
                            if (any(is_say_label(c) for c in pk) or
                                    any(is_cue_label(c) for c in pk)):
                                found_labeled = True
                                break
                        k += 1
                        steps += 1
                    if found_labeled:
                        # Skip this unlabeled paragraph (leave it in the DOM, don't consume)
                        j += 1
                        continue
                    break

            # Anything else — stop
            break

        # ── Build the beat div ─────────────────────────────────────────────
        beat_div = make_beat_div(soup, beat_title, show_elements, say_list, cue_list)
        beat_count += 1

        if not say_list:
            warnings.append(f'{beat_title}: no SAY content found')
        if not cue_list:
            warnings.append(f'{beat_title}: no CUE content found')

        # Insert beat_div before the first consumed tag, then remove all consumed
        consumed_tags[0].insert_before(beat_div)
        for t in consumed_tags:
            if t.parent:
                t.extract()

        # Don't increment i — we'll recompute children and the beat div is now at position i
        # Actually we want to skip past the newly inserted beat_div
        # Recompute and find our beat_div
        children = get_children()
        try:
            i = children.index(beat_div) + 1
        except ValueError:
            i += 1

    return {'beat_count': beat_count, 'warnings': warnings}


def remove_inter_beat_hrs(soup):
    """Remove <hr> elements adjacent to .beat divs or flags."""
    body = soup.body
    changed = True
    while changed:
        changed = False
        children = [c for c in body.children
                    if not (isinstance(c, NavigableString) and not c.strip())]
        for idx, child in enumerate(children):
            if not is_hr(child):
                continue
            prev_tag = children[idx - 1] if idx > 0 else None
            next_tag = children[idx + 1] if idx < len(children) - 1 else None

            prev_is_beat = isinstance(prev_tag, Tag) and 'beat' in prev_tag.get('class', [])
            next_is_beat = isinstance(next_tag, Tag) and 'beat' in next_tag.get('class', [])
            prev_is_flag = is_flag(prev_tag) if prev_tag else False
            next_is_flag = is_flag(next_tag) if next_tag else False

            if prev_is_beat or next_is_beat or prev_is_flag or next_is_flag:
                child.extract()
                changed = True
                break


def add_teacher_banner(soup):
    body = soup.body
    h1 = body.find('h1')
    if h1 is None:
        return
    existing = body.find(class_='teacher-banner')
    if existing:
        return
    banner = soup.new_tag('div', attrs={'class': 'teacher-banner'})
    banner.string = 'Teacher Copy — Not for Students'
    h1.insert_before(banner)


def remove_redundant_h2(soup):
    """Remove the 'Teacher Notes Package' h2."""
    for h2 in soup.body.find_all('h2'):
        if 'teacher notes package' in h2.get_text().strip().lower():
            h2.extract()
            break


def normalize_all_flags(soup):
    for tag in soup.body.find_all('div'):
        if is_flag(tag):
            normalize_flag_classes(tag, soup)


def convert_file(input_path, dry_run=False):
    input_path = Path(input_path)
    output_path = input_path.parent / input_path.name.replace('-v1.html', '-v2.html')
    if not input_path.name.endswith('-v1.html'):
        # Try generic replacement
        output_path = input_path.parent / input_path.name.replace('v1', 'v2')

    print(f"\n{'[DRY RUN] ' if dry_run else ''}Converting: {input_path.name}")
    print(f"  → {output_path.name}")

    with open(input_path, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')

    # 1. Replace CSS
    style_tag = soup.find('style')
    if style_tag:
        old_css = style_tag.string or ''
        new_css = build_new_css(old_css)
        style_tag.string = '\n' + new_css + '\n'
    else:
        print("  WARNING: No <style> tag found!")

    # 2. Add teacher banner
    add_teacher_banner(soup)

    # 3. Remove redundant h2
    remove_redundant_h2(soup)

    # 4. Normalize flag classes
    normalize_all_flags(soup)

    # 5. Convert beats
    report = process_body(soup, input_path.name)

    # 6. Strip any remaining label strongs outside beats (Retrieval Check sections)
    strip_labels_from_non_beats(soup)

    # 7. Remove inter-beat hrs
    remove_inter_beat_hrs(soup)

    output_html = str(soup)

    if not dry_run:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(output_html)
        print(f"  ✓ Written: {output_path}")

    report['input'] = str(input_path)
    report['output'] = str(output_path)
    return report


def verify_file(v2_path):
    v2_path = Path(v2_path)
    if not v2_path.exists():
        return {'error': f'File not found: {v2_path}'}

    with open(v2_path, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')
    issues = []

    beats = soup.find_all('div', class_='beat')
    beat_count = len(beats)

    beats_missing = []
    for i, beat in enumerate(beats, 1):
        h3 = beat.find('h3')
        has_h3 = bool(h3)
        has_show = bool(beat.find('div', class_='show'))
        has_say = bool(beat.find('div', class_='say'))
        has_cue = bool(beat.find('div', class_='cue'))
        title = h3.get_text() if h3 else f'Beat {i}'
        if not has_h3 or not has_show:
            beats_missing.append(f'{title}: missing h3={not has_h3}, show={not has_show}')
        if not has_say:
            issues.append(f'{title}: no SAY div')
        if not has_cue:
            issues.append(f'{title}: no CUE div')

    old_labels = soup.body.find_all('strong', class_=['show-label', 'say-label', 'cue-label'])

    style = soup.find('style')
    css_text = style.string if style else ''
    banner = soup.find(class_='teacher-banner')

    return {
        'beat_count': beat_count,
        'beats_missing': beats_missing,
        'issues': issues,
        'css_ok': 'Georgia' not in css_text,
        'banner_ok': bool(banner),
        'old_labels_remaining': len(old_labels),
    }


def main():
    args = sys.argv[1:]
    dry_run = '--dry-run' in args
    args = [a for a in args if a != '--dry-run']

    if args:
        files = args
    else:
        base = '/home/ejanbremness/Documents/Classroom tools/notes-packages/math-9'
        files = sorted(glob.glob(os.path.join(base, '*/math9-*-teachernotes-v1.html')))

    if not files:
        print("No files found.")
        sys.exit(1)

    print(f"Found {len(files)} file(s) to convert.")

    all_reports = []
    for f in files:
        report = convert_file(f, dry_run=dry_run)
        all_reports.append(report)

    print("\n" + "=" * 60)
    print("CONVERSION SUMMARY")
    print("=" * 60)
    for r in all_reports:
        if 'error' in r:
            print(f"  ERROR: {r}")
            continue
        name = Path(r['input']).name
        warn_count = len(r.get('warnings', []))
        print(f"  {name}: {r['beat_count']} beats"
              + (f" ({warn_count} warnings)" if warn_count else ''))
        for w in r.get('warnings', []):
            print(f"    ⚠ {w}")

    if not dry_run:
        print("\n" + "=" * 60)
        print("VERIFICATION — ALL v2 files")
        print("=" * 60)
        for r in all_reports:
            if 'error' in r:
                continue
            vr = verify_file(r['output'])
            name = Path(r['output']).name
            status_parts = []
            if vr.get('old_labels_remaining', 0) > 0:
                status_parts.append(f"{vr['old_labels_remaining']} old labels remain")
            if not vr.get('css_ok'):
                status_parts.append("CSS has Georgia")
            if not vr.get('banner_ok'):
                status_parts.append("no teacher banner")
            if vr.get('issues'):
                status_parts.append(f"{len(vr['issues'])} beat issues")
            status = ' | '.join(status_parts) if status_parts else 'OK'
            print(f"  {name}: {vr.get('beat_count', '?')} beats — {status}")

        # Detailed verification for linear-equations
        base = '/home/ejanbremness/Documents/Classroom tools/notes-packages/math-9'
        le_v2 = os.path.join(base, 'linear-equations/math9-linear-equations-teachernotes-v2.html')
        if os.path.exists(le_v2):
            print("\n" + "=" * 60)
            print("DETAILED VERIFICATION — linear-equations v2")
            print("=" * 60)
            vr = verify_file(le_v2)
            print(f"  Beats found: {vr.get('beat_count', '?')}")
            print(f"  Old labels remaining: {vr.get('old_labels_remaining', '?')}")
            print(f"  CSS ok (no Georgia): {vr.get('css_ok', '?')}")
            print(f"  Teacher banner present: {vr.get('banner_ok', '?')}")
            if vr.get('beats_missing'):
                print("  Beats with structural issues:")
                for b in vr['beats_missing']:
                    print(f"    - {b}")
            if vr.get('issues'):
                print("  Beat content issues (missing SAY/CUE):")
                for issue in vr['issues']:
                    print(f"    - {issue}")
            else:
                print("  No critical issues found.")


if __name__ == '__main__':
    main()
