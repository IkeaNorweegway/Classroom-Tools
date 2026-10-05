---
name: svg-diagram-review
description: Visual and geometric review of SVG diagrams in HTML notes packages. Renders each SVG to PNG and checks for legibility and correctness issues. Run after building or editing diagrams.
---

# svg-diagram-review

Renders every SVG in an HTML notes file to PNG and runs geometric checks for legibility, label placement, and mathematical correctness.

Different from `svg-audit` (which checks code compliance) — this skill checks whether diagrams actually look right.

## Fast path

```bash
python ".claude/skills/svg-diagram-review/scripts/review.py" path/to/notes.html
```

PNGs are written to `/tmp/svg-review/<stem>/svg-01.png`, `svg-02.png`, etc.
Open them to visually inspect. The script also reports any geometric issues found.

Exit 0 = no issues. Exit 1 = issues found. Exit 2 = file not found.

---

## What it checks

### Legibility

| Code | Severity | Triggers when |
|---|---|---|
| `SMALL_FONT` | WARN | Effective font size < 8px after display scaling |
| `TEXT_OUTSIDE_BOUNDS` | WARN | Text anchor point outside the viewBox (+ 15px margin) |
| `ELEMENT_OUTSIDE_BOUNDS` | WARN | Circle or line extends outside the viewBox |
| `LABEL_OVERLAP` | WARN | Two text anchor points < 10px apart — may overlap when rendered |
| `SVG_TOO_SHORT` | WARN | Effective display height < 50px |
| `MISSING_VIEWBOX` | WARN | No viewBox attribute — diagram won't scale correctly |

### Correctness

| Code | Severity | Triggers when |
|---|---|---|
| `ENDPOINT_OUTSIDE_CIRCLE` | INFO | dg-accent line endpoint > 25% beyond circle radius (single-circle diagrams only) |
| `RIGHT_ANGLE_NOT_PERPENDICULAR` | WARN | dg-right-angle polyline segments meet at angle ≠ 90° (± 10°) |
| `LABEL_FAR_FROM_SHAPE` | INFO | dg-label text > 30px from nearest line segment or point |
| `MISSING_CENTRE` | INFO | Circle boundary present but no centre label (O) or centre point marker |

### Rendering

- CairoSVG 2.x must be installed (`pip install cairosvg`)
- Page CSS is extracted and injected into each SVG before rendering — dg-* classes resolve correctly
- CSS custom properties (`var(--dg-stroke)`) are resolved to concrete values since CairoSVG doesn't support them
- PNGs are rendered at 2× scale for clarity

---

## Severity guide

| Severity | Meaning | Action |
|---|---|---|
| `WARN` | Likely a real problem — visible in print | Fix before distributing |
| `INFO` | Worth checking — may be intentional | Open the PNG and judge visually |

---

## Limitations

- Font overlap is approximate (uses anchor points, not rendered text widths)
- `ENDPOINT_OUTSIDE_CIRCLE` is skipped for multi-circle diagrams (e.g. central/inscribed angle side-by-side) to avoid false positives
- `LABEL_FAR_FROM_SHAPE` uses segment proximity, not arc proximity — labels near circle boundaries may still flag
- Completeness checks are simple (missing O label) — does not check if all vertices are labeled

---

## References

- `notes-packages/_svg-classes.md` — dg-* class vocabulary
- `notes-packages/math-9/circle-geometry/math9-circle-geometry-notes-v1.html` — reference implementation
- `svg-audit` skill — code compliance checker (run this first; review is a second pass)
