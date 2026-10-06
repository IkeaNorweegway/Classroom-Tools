---
name: svg-audit
description: Audit HTML notes packages for SVG diagram compliance with the dg-* class system. Run on any HTML file after building or editing diagrams. Reports violations (must fix) and warnings (recommended).
---

# svg-audit

Verify that an HTML notes package's SVG diagrams comply with the `dg-*` class system defined in `notes-packages/_svg-classes.md`. Catches inline style attributes, missing CSS blocks, and (as warnings) missing tikz comments for the LaTeX pipeline.

## Fast path

```bash
python ".claude/skills/svg-audit/scripts/audit.py" path/to/notes.html
```

Exit 0 = pass. Exit 1 = violations found (must fix before marking complete). Exit 2 = file not found.

---

## What it checks

### Violations — exit 1, must fix

| Code | What triggers it | Root cause |
|---|---|---|
| `MISSING_DG_CSS` | `<style>` block has no `dg-boundary` or `dg-accent` | CSS snippet not included — classes won't render |
| `INLINE_STYLE` | SVG child element has `stroke=`, `fill=`, `stroke-width=`, `stroke-dasharray=`, `stroke-linecap=`, `stroke-linejoin=`, `font-family=`, or `font-size=` as an attribute | Style not moved to dg-* class |

### Warnings — exit 0, recommended

| Code | What triggers it | Why it matters |
|---|---|---|
| `MISSING_TIKZ_COMMENT` | `<svg>` not preceded (within 3 lines) by `<!-- tikz: ... -->` | LaTeX build pipeline reads this to select the TikZ pattern; missing = ambiguous build |

---

## Workflow

1. Build or edit diagrams in the HTML
2. Run the audit:
   ```bash
   python ".claude/skills/svg-audit/scripts/audit.py" path/to/notes.html
   ```
3. Fix all `VIOLATIONS` — see `notes-packages/_svg-classes.md` for the correct class for each element type
4. Re-run to confirm exit 0
5. Address `MISSING_TIKZ_COMMENT` warnings if building a PDF version

---

## Fixing violations

**`MISSING_DG_CSS`:** Copy the CSS snippet from `notes-packages/_svg-classes.md` into the file's `<style>` block.

**`INLINE_STYLE`:** Replace the flagged attribute with the appropriate `dg-*` class. Quick reference:

| Element / role | Use class |
|---|---|
| Circle/shape boundary | `dg-boundary` |
| Normal line or path | `dg-line` |
| Highlighted element (unit colour) | `dg-accent` |
| Dashed secondary line | `dg-dashed` |
| Right-angle mark | `dg-right-angle` |
| Faint guide / construction | `dg-construction` |
| Filled point dot | `dg-point` |
| Point label (12px gray) | `dg-label` |
| Secondary annotation (11px muted) | `dg-label-sm` |
| Key element label (11px, unit colour) | `dg-label-accent` |

**Attributes that are allowed to stay on elements** (not violations):
`cx cy r x1 y1 x2 y2 d points` (geometry) · `viewBox width height role aria-label` (structure) · `text-anchor dominant-baseline` (alignment) · `font-weight="700"` (semantic bold)

---

## Running on multiple files

```bash
python ".claude/skills/svg-audit/scripts/audit.py" \
  public/materials/math-9/notes/circle-geometry/math9-circle-geometry-notes-v1.html \
  notes-packages/grade-6-science/living-systems/sci6-living-systems-notes-v1.html
```

Or with a glob (bash):
```bash
python ".claude/skills/svg-audit/scripts/audit.py" notes-packages/math-9/**/*.html
```

---

## Reference

- `notes-packages/_svg-classes.md` — full CSS snippet, class vocabulary, unit theming
- `notes-packages/_context.md` → "SVG Diagram Class System" — design rationale
- `public/materials/math-9/notes/circle-geometry/math9-circle-geometry-notes-v1.html` — reference implementation (passes audit)
