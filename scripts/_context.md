# Scripts

Render scripts for this workspace. Run them from the repo root (`D:\Classroom tools`).

**What runs on this machine:** Perl runs inside Git Bash (`perl scripts/name.pl`). Python 3.15 is installed through `uv`, at `C:\Users\Ejan.Bremness\AppData\Roaming\uv\python\cpython-3.15-windows-x86_64-none\python.exe`. The `python` on PATH is a Windows Store stub, so call that path directly. Node and LaTeX are not installed. The `.py` scripts marked "No (Python)" below may run now, but check each one's header before relying on it.

**Where output goes:** published renders belong in `public/materials/`. A script that writes its HTML next to the markdown source needs its output moved to `public/materials/` afterwards. Posters are the exception: they are print-only and stay beside their source in `worksheets/math-9/`.

---

## Scripts in this folder

| Script | Runs here? | What it converts | Output |
|---|---|---|---|
| `render_math9_posters.pl` | Yes | Math 9 concept sheets → six-page tiled wall posters (17×33 in) | `worksheets/math-9/[strand]/[topic]/math9-[topic]-poster-v1.html` |
| `render_math9_rational_numbers_memory_poster.pl` | Yes | Rational Numbers quick-recall poster, four-page tile (17×22 in) | `worksheets/math-9/number/rational-numbers/` |
| `render_math9_posters.py` | No (Python) | Earlier Python version of the poster script. The `.pl` version is the one in use. | same as the `.pl` |
| `render_assessments.pl` | Yes | Exit tickets and quizzes (markdown) → printable HTML. Perl port of `render_assessments.py`. Unit tests and answer keys are skipped unless `--out` names a folder outside the repo. See `scripts/render-queue.md`. | `public/materials/<same name>.html` |
| `render_assessments.py` | No (Python) | The Python original of the Perl port above. Kept until the port is confirmed to match. | same as the `.pl` |
| `render_sci7_workbooks.py` | No (Python, old paths) | `worksheets/grade-7-science/[unit]/sci7-[unit]-workbook-v2.md` (5 files) | `public/materials/sci7-[unit]-workbook-v1.html` |
| `render_math9_workbooks.py` | No (Python, old paths) | `worksheets/math-9/[strand]/math9-[strand]-workbook-v1.md` (4 files) | `public/materials/math-9/worksheets/[strand]/math9-[strand]-workbook-v1.html` |
| `render_math9_projects.py` | Linux only (Python + pandoc) | Math 9 strand inquiry projects: `worksheets/math-9/[strand]/math9-[strand]-project*-v*.md` and `notes-packages/math-9/[strand]/math9-[strand]-project-teacherguide-v*.md` (pandoc markdown with fenced divs; front matter `style: student` or `teacher`). Copies the CSS from the strand's own workbook (strand colour) or the Linear Relations teacher notes v2 at render time. No arguments renders every project file. Run `stack_fractions.py` on the output afterwards. | `public/materials/math-9/worksheets/[strand]/` (teacher guide included) |
| `render_home_practice.py` | Linux only (Python) | Home practice sheets for the parent pages, every course (format in `templates/home-practice-template.md`; front matter `course:` picks the colours and output folder). Repo-relative paths; no arguments renders every sheet. Run `stack_fractions.py` on the output afterwards. | Math 9: `public/materials/math-9/home/[topic]/`; other courses: flat in `public/materials/` |
| `render_cefl.py` | Linux only (Python) | CEFL 7–9 mini-workbooks, answer keys, project briefs (`worksheets/cefl-*/<unit>/`) and teacher guides (`lesson-plans/cefl-*/<unit>/`). Block format (moments, `::: visual` SVG passthrough, tables with writing cells, project boxes, `(box N)` sketch areas) is documented at the top of the script and in `_courses/cefl/_context.md`. In project briefs every `##` section prints on its own page. No arguments renders every CEFL source. Run `apply_site_fonts.py` and `stack_fractions.py` on the output afterwards. | `public/materials/cefl/cefl[G]-[unit]-[type]-v[N].html` |
| `stack_fractions.py` | Linux only (Python) | Inline fractions in rendered HTML (`3/4`, `x/5`, `(y₂−y₁)/(x₂−x₁)`, `½`, `___/8`) → stacked `.frac` markup. Leaves units, prices, dates and "or" slashes inline. Safe to re-run. Run it on every new or re-rendered HTML file; `--dry-run --report out.txt` lists every change and skip first. | edits the HTML in place |
| `apply_site_fonts.py` | Linux only (Python) | Gives rendered HTML the site fonts (Atkinson Hyperlegible Next, Fraunces) and print-safe warm-neutral contrast, as in the Grade 6 Forces pilot. CSS only; SVG attributes untouched. Skips files that already load the fonts, so it is safe to re-run. Run it on every new or re-rendered notes package or workbook; `--dry-run` prints counts without writing. | edits the HTML in place |
| `add_notes_visuals.py` | Linux only (Python) | Teaching diagrams for the Science 7 and Math 9 notes packages. One fragment per diagram in `notes-packages/_visuals/<unit>/NN-name.html` (header: section, anchor, where, caption, tikz; body: an SVG using `dg-*` classes plus `<tag>` blank labels and `<arrow>` shortcuts). Inserts each into the student notes (tags empty) and the notes answer key (tags filled; if the anchor text isn't in the key, the figure goes under that section's heading). Re-running replaces earlier inserts. `--preview DIR` writes a side-by-side review page per unit; `--remove` strips them all. | edits `public/materials/` notes and notes answer keys in place |

The two workbook scripts still have the old Linux paths (`/home/ejanbremness/...`, and a separate `classroom-tools-site` repo) hard-coded in `BASE_*` at the top. Point them at this repo before running. They handle the full q-card format: question-card divs, ★/★★ badges, word-bank chips, hint/starter blocks, midpoint check (auto-inserted after Q6), reflection, stretch section, and self-assessment grid.

Note the version mismatch in `render_sci7_workbooks.py`: it reads the `v2` markdown and writes a file named `v1.html`, because the site links to the `v1` name.

**To add a new course:** copy a script, update the file list and CSS colour variables at the top, verify one output file, then commit.

---

## Scripts elsewhere

| Script | What it does |
|---|---|
| `.claude/scripts/teachernotes-to-html.py` | Math 9 teacher notes `.md` → self-contained HTML, written beside the `.md` (Python) |
| `scripts/convert_v1_to_v2.py` | One-off conversion of Math 9 teacher notes HTML from v1 to v2. Already run; old Linux paths. |
| `.claude/skills/svg-audit/`, `.claude/skills/svg-diagram-review/` | Diagram checks for HTML notes packages |
| `.claude/skills/workspace-audit/scripts/audit.ps1` | Read-only structure audit: naming, placement, broken context references, old versions, duplicates, context size (PowerShell, runs here) |
