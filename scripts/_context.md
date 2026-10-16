# Scripts

Render scripts for this workspace. Run them from the repo root (`D:\Classroom tools`).

**What runs on this machine:** Perl runs inside Git Bash (`perl scripts/name.pl`). Python, Node, and LaTeX are not installed, so the `.py` scripts below cannot run here until Python is added.

**Where output goes:** published renders belong in `public/materials/`. A script that writes its HTML next to the markdown source needs its output moved to `public/materials/` afterwards. Posters are the exception: they are print-only and stay beside their source in `worksheets/math-9/`.

---

## Scripts in this folder

| Script | Runs here? | What it converts | Output |
|---|---|---|---|
| `render_math9_posters.pl` | Yes | Math 9 concept sheets → six-page tiled wall posters (17×33 in) | `worksheets/math-9/[strand]/[topic]/math9-[topic]-poster-v1.html` |
| `render_math9_rational_numbers_memory_poster.pl` | Yes | Rational Numbers quick-recall poster, four-page tile (17×22 in) | `worksheets/math-9/number/rational-numbers/` |
| `render_math9_posters.py` | No (Python) | Earlier Python version of the poster script. The `.pl` version is the one in use. | same as the `.pl` |
| `render_sci7_workbooks.py` | No (Python, old paths) | `worksheets/grade-7-science/[unit]/sci7-[unit]-workbook-v2.md` (5 files) | `public/materials/sci7-[unit]-workbook-v1.html` |
| `render_math9_workbooks.py` | No (Python, old paths) | `worksheets/math-9/[strand]/math9-[strand]-workbook-v1.md` (4 files) | `public/materials/math-9/worksheets/[strand]/math9-[strand]-workbook-v1.html` |
| `render_home_practice.py` | Linux only (Python) | Home practice sheets for the parent pages, every course (format in `templates/home-practice-template.md`; front matter `course:` picks the colours and output folder). Repo-relative paths; no arguments renders every sheet. Run `stack_fractions.py` on the output afterwards. | Math 9: `public/materials/math-9/home/[topic]/`; other courses: flat in `public/materials/` |
| `stack_fractions.py` | Linux only (Python) | Inline fractions in rendered HTML (`3/4`, `x/5`, `(y₂−y₁)/(x₂−x₁)`, `½`, `___/8`) → stacked `.frac` markup. Leaves units, prices, dates and "or" slashes inline. Safe to re-run. Run it on every new or re-rendered HTML file; `--dry-run --report out.txt` lists every change and skip first. | edits the HTML in place |
| `apply_site_fonts.py` | Linux only (Python) | Gives rendered HTML the site fonts (Atkinson Hyperlegible Next, Fraunces) and print-safe warm-neutral contrast, as in the Grade 6 Forces pilot. CSS only; SVG attributes untouched. Skips files that already load the fonts, so it is safe to re-run. Run it on every new or re-rendered notes package or workbook; `--dry-run` prints counts without writing. | edits the HTML in place |

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
