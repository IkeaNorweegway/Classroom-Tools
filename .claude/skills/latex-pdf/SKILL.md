
---
name: latex-pdf
description: Build print-quality PDF versions of classroom notes packages using LaTeX and TikZ. Use when asked to create, compile, or update a PDF for any notes package, worksheet, or test in this workspace.
---

# latex-pdf

Produce textbook-quality PDF files for classroom materials. The HTML file is the web/screen version; the `.tex` / `.pdf` is the print master.

## Fast path

1. Read the existing HTML or Markdown source for the material.
2. Write a `.tex` file in the same folder as the HTML, using the standard preamble.
3. Compile:
   ```bash
   bash ".claude/skills/latex-pdf/scripts/compile.sh" path/to/file.tex
   ```
4. Check output for errors. Fix and recompile if needed.

---

## File placement

| Input | Output |
|---|---|
| `notes-packages/math-9/circle-geometry/math9-circle-geometry-notes-v1.html` | `notes-packages/math-9/circle-geometry/math9-circle-geometry-notes-v1.tex` + `.pdf` |

Name the `.tex` file identically to the `.html` file (same stem, different extension).

---

## Build checklist

Before writing the `.tex` file:
- [ ] Read `references/preamble.md` — copy the standard preamble exactly
- [ ] Read `references/tikz-patterns.md` — use established patterns for diagrams
- [ ] Identify all diagrams in the source — every ASCII-art diagram becomes TikZ
- [ ] Note the subject/unit — use correct colour scheme and header text

When writing `.tex`:
- [ ] Use `\blank{Xcm}` for every fill-in blank
- [ ] Use `\answerline` for every write-on line
- [ ] Use `\selfcheck` at the end of every retrieval check
- [ ] Use `\dgr{}` for degree symbols (never raw `°`)
- [ ] Wrap misconceptions in `\begin{tcolorbox}[misconc]`
- [ ] Wrap worked examples in `\begin{tcolorbox}[worked, title=Worked Example N]`
- [ ] Wrap retrieval checks in `\begin{tcolorbox}[retrieval]`
- [ ] Wrap connection prompts in `\begin{tcolorbox}[connection]`
- [ ] Put `\clearpage` before each new section

After compiling:
- [ ] Check page count is reasonable (notes packages: 10–16 pages)
- [ ] No `!` errors in log (warnings about overfull hboxes are acceptable)
- [ ] Run compile script twice if cross-references are used

---

## Known system constraints

**Do NOT use:**
- `\usepackage{microtype}` — causes font expansion error on this system
- `\tcbuselibrary{skins}` — `tikzfill.image.sty` is not installed
- Raw `°` characters — use `\dgr{}` instead

**Always include:**
- `\usepackage{lmodern}` — required or pdflatex falls back to bitmap fonts
- `\usepackage{amssymb}` — needed for `\square` (used in `\selfcheck`)
- `TEXMFHOME=/usr/share/texlive/texmf-dist` — font map workaround (handled by compile script)

**Permanent fix (user must run once as root):**
```bash
sudo updmap-sys
sudo fmtutil-sys --all
```
Until then, the compile script handles it via `TEXMFHOME`.

---

## TikZ diagram rules

- Always set `[scale=N, font=\small]` on `tikzpicture`
- Define named coordinates with `\coordinate` before drawing
- Use explicit decimal coordinates — never rely on TikZ math in coordinates
- Highlight key elements with `dblue` (lines, arcs, diameters)
- Use `gray!50, fill=gray!8` for circle/shape fills
- Mark all key points: `\fill (pt) circle (1.8pt);`
- See `references/tikz-patterns.md` for ready-to-use diagram code

---

## HTML source conventions (for reliable LaTeX builds)

When building the `.tex` from an HTML source, these conventions make the conversion unambiguous.

### Diagram comment tags

Every `<svg>` or diagram placeholder in the HTML should be preceded by a comment that names the TikZ pattern to use and the key parameters:

```html
<!-- tikz: circle-vocab | r=2.5 | points=O,T,Q,R,A,P,S | features=diameter,radius,chord,arc,tangent -->
<svg ...>...</svg>

<!-- tikz: chord-bisector | r=2.2 | chord-depth=1.0 -->
<svg ...>...</svg>

<!-- tikz: tangent-from-external | r=1 | PT=2.4 | PO=2.6 | problem=5-12-13 -->
<svg ...>...</svg>

<!-- tikz: central-inscribed-angle | r=2 | A=210 | B=330 | P=90 -->
<svg ...>...</svg>

<!-- tikz: blank-circle | count=2 -->
[two blank circles for labelling]
```

Format: `<!-- tikz: [pattern-name] | [param=value] | ... -->`
Pattern names map directly to sections in `references/tikz-patterns.md`.

When you encounter an SVG in the HTML with a `<!-- tikz: ... -->` comment, look up that pattern in tikz-patterns.md and use the specified parameters. Do not reverse-engineer TikZ from the SVG itself.

### Semantic blank markup

In the HTML, blanks and answer lines use specific class names that map to LaTeX commands:

| HTML | LaTeX | Use for |
|---|---|---|
| `<span class="blank-sm">` | `\blank{2cm}` | Single word |
| `<span class="blank-md">` | `\blank{4cm}` | Short phrase |
| `<span class="blank-lg">` | `\blank{7cm}` | Full sentence |
| `<span class="blank-xl">` | `\blank{10cm}` | Long phrase or definition |
| `<div class="answer-line">` | `\answerline` | Write-on line for retrieval/worked example |
| `<div class="self-check">` | `\selfcheck` | Self-check rating row |

When converting HTML → LaTeX, find these classes and substitute the corresponding commands. Do not try to measure blank widths from the SVG or HTML layout.

---

## References

- `references/preamble.md` — full preamble, colour definitions, helper commands, tcolorbox styles
- `references/tikz-patterns.md` — TikZ code for circles, angles, vectors, coordinate planes
- `scripts/compile.sh` — compile script (handles font map workaround)

## Example

Existing file: `notes-packages/math-9/circle-geometry/math9-circle-geometry-notes-v1.tex`
Compiled PDF: `notes-packages/math-9/circle-geometry/math9-circle-geometry-notes-v1.pdf`
