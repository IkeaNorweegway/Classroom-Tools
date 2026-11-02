#!/usr/bin/env python3
"""Give notes headings ids so other pages can link to one section.

Adds an id to each <h2> that names a section:
  "Section 3: ...", "Section 3 — ...", "Concept 3", "Part 3", "3 · ..." -> id="s3"
  "Unit 3: ...", "Unité 3 : ..." (Grade 6 year notes)                   -> id="u3"
  "Pre-Knowledge Check", "Before we start"                             -> id="pre-check"
  "Unit Synthesis", "Synthèse", "Unit Check", "Unit Wrap-Up",
  "Put it all together"                                                -> id="synthesis"
  "Vocabulary", "Words to know", "New Words in This Unit"             -> id="vocab"

Link to a section with the file name plus the id, e.g.
  sci7-heat-temperature-notes-v1.html#s3
The number matches the printed "Section 3", and it is the same in the
student copy, answer key, EF, FR and teacher notes.

Other headings are left alone, as are headings that already have an id.
Only the opening <h2> tag changes, so it is safe to re-run.
render_math8.pl, render_ela5.pl and render_social.pl do the same thing
when they write a notes file; keep the rules in step.

Usage: python3 scripts/add_section_ids.py [--dry-run] [FILE...]
No files: every *notes*.html under public/materials/.
"""
import glob
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

H2 = re.compile(r"<h2(\s[^>]*)?>(.*?)</h2>", re.S | re.I)
RULES = [
    (re.compile(r"^(?:Section|Concept|Part)\s+(\d+)\b", re.I), "s{}"),
    (re.compile(r"^Unit[ée]?\s+(\d+)\b", re.I), "u{}"),
    (re.compile(r"^(\d+)\s*·"), "s{}"),
    (re.compile(r"^(?:Pre-Knowledge Check|Before we start)", re.I), "pre-check"),
    (re.compile(r"^(?:Unit Synthesis|Synthèse|Unit Check|Unit Wrap-Up|Put it all together)", re.I), "synthesis"),
    (re.compile(r"^(?:Vocabulary|Words to know|New Words in This Unit)\s*$", re.I), "vocab"),
]


def heading_id(inner):
    text = re.sub(r"<[^>]+>", "", inner)
    text = text.replace("&nbsp;", " ").replace(" ", " ").strip()
    for pat, fmt in RULES:
        m = pat.match(text)
        if m:
            return fmt.format(*m.groups())
    return None


def add_ids(html):
    used = set(re.findall(r'\sid="([^"]+)"', html))
    count = 0

    def fix(m):
        nonlocal count
        attrs = m.group(1) or ""
        if re.search(r"\sid=", attrs):
            return m.group(0)
        hid = heading_id(m.group(2))
        if not hid or hid in used:
            return m.group(0)
        used.add(hid)
        count += 1
        return f'<h2 id="{hid}"{attrs}>{m.group(2)}</h2>'

    return H2.sub(fix, html), count


def main(argv):
    dry = "--dry-run" in argv
    files = [a for a in argv if not a.startswith("--")]
    if not files:
        files = sorted(glob.glob(os.path.join(ROOT, "public", "materials", "**", "*notes*.html"), recursive=True))
    total = 0
    for path in files:
        with open(path, encoding="utf-8", newline="") as fh:
            html = fh.read()
        new, n = add_ids(html)
        if n and not dry:
            with open(path, "w", encoding="utf-8", newline="") as fh:
                fh.write(new)
        total += n
        print(f"{n:3d}  {os.path.relpath(path, ROOT)}")
    print(f"{total} ids {'would be ' if dry else ''}added across {len(files)} files")


if __name__ == "__main__":
    main(sys.argv[1:])
