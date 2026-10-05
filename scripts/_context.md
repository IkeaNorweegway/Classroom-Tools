# Scripts

Utility scripts for this workspace. Run from the project root or the classroom-tools-site repo root.

---

## HTML Converters — Workbooks

These scripts convert v2 markdown workbooks to the HTML design system used on the classroom-tools-site. They handle the full q-card format: question-card divs, ★/★★ badges, word-bank chips, hint/starter blocks, midpoint check (auto-inserted after Q6), reflection, stretch section, and self-assessment grid.

**Run from:** `/home/ejanbremness/Documents/classroom-tools-site/`

```bash
python3 "/home/ejanbremness/Documents/Classroom tools/scripts/render_sci7_workbooks.py"
python3 "/home/ejanbremness/Documents/Classroom tools/scripts/render_math9_workbooks.py"
```

| Script | What it converts | Output location |
|---|---|---|
| `render_sci7_workbooks.py` | `worksheets/grade-7-science/[unit]/sci7-[unit]-workbook-v2.md` (5 files) | `public/materials/sci7-[unit]-workbook-v1.html` |
| `render_math9_workbooks.py` | `worksheets/math-9/[strand]/math9-[strand]-workbook-v1.md` (4 files) | `public/materials/math-9/worksheets/[strand]/math9-[strand]-workbook-v1.html` |

**When to re-run:** Any time a source workbook markdown is updated (content corrections, new questions, version bumps).

**To add a new course:** Copy the script, update the `UNITS` / `WORKBOOKS` list at the top with new file paths and CSS color variables, verify one output file, then commit.

---

## Other

`track-field-day.gs` — Google Apps Script for a track-and-field event day. Unrelated to classroom materials.
