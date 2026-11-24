"""Insert teaching visuals into notes packages and their answer keys.

Each visual is one fragment file in notes-packages/_visuals/<unit>/NN-name.html:

    ---
    section: Section 3            text inside the section's <h2> (search starts there); (top) = before the first <h2>
    anchor: <strong>Changes of state:</strong>   text on the line to insert at
    where: after                  before | after | after:<text> (first line at/after the anchor holding <text>)
    ak_anchor: ...                optional: different anchor for the answer key
    caption: One sentence students read under the diagram.
    tikz: pattern-name | key=value | ...
    ---
    <svg viewBox="0 0 W H" aria-label="...">
      ... dg-* classed elements ...
      <tag x="10" y="20" w="70">answer</tag>      blank label box; answer shows only in the key
      <arrow x1="0" y1="0" x2="50" y2="0" kind="hot"/>   line + arrowhead (kind: plain|accent|hot|cold|muted)
      <mapbase name="europe-canada" x="0" y="0"/>
      <angle at="x,y" from="x,y" to="x,y" r="16"/>   angle arc + soft wedge between two rays (right="1" square, n="2" double, reflex="1")
      <ticks x1="0" y1="0" x2="50" y2="0" n="1"/>    equal-length tick marks across a segment's midpoint
      <keyonly>...</keyonly>                        drawn in the answer key only   land layer from notes-packages/_visuals/_maps/ (scripts/build_social_maps.py)
    </svg>

A body may instead be one or more `@viz` lines (Math 7/8/9 diagram library, scripts/Math8Viz.pm and
scripts/vizext/*.pl, drawn through scripts/viz_line.pl). Header needs no tikz line (the library writes its
own comment). One line gives one figure; several lines sit side by side in a `viz-row`. `[[x]]` in a
label is a dashed blank in the student copy and green text in the key:

    @viz scatter xmin=0 xmax=10 ymin=0 ymax=10 points="1,2;3,4" outlier="7,2:[[outlier]]"

Student notes get empty dashed tag boxes; the answer key gets the same box with the answer in green.
If the anchor is not in the answer key, the figure goes right after that section's <h2> line.

Re-running is safe: earlier inserts (between <!-- viz:... --> markers) are removed first.

Workbooks: see WB_DOC below (fragments in worksheets/_visuals/sci7-<unit>-workbook/, placed with `q: N`).

Usage:
    python3 scripts/add_notes_visuals.py                 all units
    python3 scripts/add_notes_visuals.py sci7-heat-temperature math9-polynomials
    python3 scripts/add_notes_visuals.py --preview DIR   also write DIR/<unit>.html with every figure, notes + key
    python3 scripts/add_notes_visuals.py --remove        strip all inserted visuals
    python3 scripts/add_notes_visuals.py --restyle UNIT  redraw figures already in the page, keep captions (use after add_read_aloud.py)
"""
import html
import math
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIS = ROOT / "notes-packages" / "_visuals"
PM = ROOT / "public" / "materials"
M9 = PM / "math-9" / "notes"

UNITS = {
    "sci7-heat-temperature": (PM / "sci7-heat-temperature-notes-v1.html", PM / "sci7-heat-temperature-notes-answers-v2.html"),
    "sci7-interactions-ecosystems": (PM / "sci7-interactions-ecosystems-notes-v1.html", PM / "sci7-interactions-ecosystems-notes-answers-v2.html"),
    "sci7-planet-earth": (PM / "sci7-planet-earth-notes-v1.html", PM / "sci7-planet-earth-notes-answers-v2.html"),
    "sci7-plants-food-fibre": (PM / "sci7-plants-food-fibre-notes-v1.html", PM / "sci7-plants-food-fibre-notes-answers-v2.html"),
    "sci7-structures-forces": (PM / "sci7-structures-forces-notes-v1.html", PM / "sci7-structures-forces-notes-answers-v2.html"),
}
for _topic, _stem in [
    ("circle-geometry", "circle-geometry"), ("linear-equations", "linear-equations"),
    ("linear-relations", "linear-relations"), ("measurement", "measurement"),
    ("polynomials", "polynomials"), ("powers-exponents", "powers"),
    ("probability", "probability"), ("rational-numbers", "rational-numbers"),
    ("similarity", "similarity"), ("square-roots", "square-roots"), ("statistics", "statistics"),
]:
    UNITS[f"math9-{_topic}"] = (M9 / _topic / f"math9-{_stem}-notes-v1.html",
                                M9 / _topic / f"math9-{_stem}-notes-answers-v1.html")
for _g, _units in [
    (8, ["civic-engagement", "economic-systems", "ideologies", "political-systems"]),
    (9, ["canada-in-wwii", "evolving-citizenship", "independence-democratic-rights", "modern-economy",
         "postwar-canada", "system-of-government", "urbanization-industry"]),
]:
    for _u in _units:
        UNITS[f"soc{_g}-{_u}"] = (PM / f"soc{_g}-{_u}-notes-v1.html", PM / f"soc{_g}-{_u}-notes-answers-v1.html")

# Workbooks: fragments live in worksheets/_visuals/<unit>/ and are placed by question number (see WB_DOC below)
WB_VIS = ROOT / "worksheets" / "_visuals"
for _u in ["heat-temperature", "interactions-ecosystems", "planet-earth", "plants-food-fibre", "structures-forces"]:
    UNITS[f"sci7-{_u}-workbook"] = (PM / f"sci7-{_u}-workbook-v1.html", PM / f"sci7-{_u}-workbook-answers-v1.html")
WB_DOC = """Workbook fragments (units ending in -workbook) use `q: 7` instead of `section:`. The anchor is searched
only inside that question's card (from its <span class="badge badge-num">Q7</span> to the next one). After
inserting, every figure on the page, old hand-made ones included, is numbered in page order in the page's
own style ("Fig. N —" or "Figure N —"), and references such as "Fig. 2" in the text follow the same map,
so re-runs and --remove keep the numbers right. Cards that gain a figure get a "Diagram" badge. Inside a
fragment, <keyonly>...</keyonly> is drawn in the answer key only and <studentonly>...</studentonly> only on the student page. The key pages are rebuilt from the
student pages by match_keys.py sci7-workbooks, so run this script again after that."""


def is_wb(unit):
    return unit.endswith("-workbook")


def vis_dir(unit):
    return (WB_VIS if is_wb(unit) else VIS) / unit

CSS_START = "/* ── viz-kit: teaching visuals (scripts/add_notes_visuals.py) ── */"
CSS_END = "/* ── /viz-kit ── */"
CSS = CSS_START + """
:root { --dg-accent: var(--accent, var(--unit, #1d4ed8)); --viz-hot: #c2410c; --viz-cold: #1d4ed8;
        --viz-plant: #15803d; --viz-water: #0369a1; --viz-earth: #92400e; --viz-sun: #ca8a04; --viz-key: #15803d; }
.viz { margin: 1rem auto 1.25rem; text-align: center; break-inside: avoid; page-break-inside: avoid; }
.viz svg { display: block; margin: 0 auto; max-width: 100%; height: auto; }
.viz-row { display: flex; justify-content: center; align-items: flex-start; gap: 1.25rem; flex-wrap: wrap; }
.viz-row svg { margin: 0; }
svg .dg-shade       { fill: var(--dg-accent); fill-opacity: .42; stroke: none; }
.viz figcaption { font-size: 0.8rem; line-height: 1.4; color: #544f47; margin: 0.4rem auto 0; max-width: 40rem; font-style: italic; }
svg .dg-boundary, svg .dg-line, svg .dg-accent, svg .dg-dashed, svg .dg-right-angle, svg .dg-construction { vector-effect: non-scaling-stroke; }
svg .dg-boundary    { stroke: var(--dg-stroke, #3f3b35); fill: var(--dg-fill, #faf9f6); stroke-width: var(--dg-sw, 1.5px); }
svg .dg-line        { stroke: var(--dg-stroke, #3f3b35); fill: none; stroke-width: var(--dg-sw, 1.5px); }
svg .dg-accent      { stroke: var(--dg-accent); fill: none; stroke-width: var(--dg-sw-bold, 2.5px); }
svg .dg-dashed      { stroke: var(--dg-secondary, #544f47); fill: none; stroke-width: var(--dg-sw, 1.5px); stroke-dasharray: 5 3; }
svg .dg-right-angle { stroke: var(--dg-stroke, #3f3b35); fill: none; stroke-width: var(--dg-sw-thin, 1px); }
svg .dg-construction{ stroke: var(--dg-muted, #6b665d); fill: none; stroke-width: var(--dg-sw-thin, 1px); stroke-dasharray: 2 3; }
svg .dg-point       { fill: var(--dg-stroke, #3f3b35); stroke: none; }
svg .dg-point-accent{ fill: var(--dg-accent); stroke: none; }
svg .dg-label       { font: 12px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--dg-stroke, #3f3b35); stroke: none; }
svg .dg-label-sm    { font: 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--dg-secondary, #544f47); stroke: none; }
svg .dg-label-accent{ font: 600 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--dg-accent); stroke: none; }
.viz-ak-note { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #544f47; margin: 1rem 0 0.25rem; }
svg .dg-grid, svg .dg-tag, svg .dg-arrow, svg .dg-fill-accent, svg .dg-fill-hot, svg .dg-fill-cold,
svg .dg-fill-plant, svg .dg-fill-water, svg .dg-fill-earth, svg .dg-fill-sun, svg .dg-fill-soft, svg .dg-outline { vector-effect: non-scaling-stroke; }
svg .dg-grid        { stroke: var(--dg-muted, #6b665d); stroke-opacity: .45; fill: none; stroke-width: 1px; }
svg .dg-outline     { stroke: var(--dg-stroke, #3f3b35); fill: none; stroke-width: 1.5px; }
svg .dg-fill-accent { fill: var(--dg-accent); fill-opacity: .14; stroke: var(--dg-accent); stroke-width: 1.5px; }
svg .dg-fill-hot    { fill: var(--viz-hot);   fill-opacity: .16; stroke: var(--viz-hot);   stroke-width: 1.5px; }
svg .dg-fill-cold   { fill: var(--viz-cold);  fill-opacity: .12; stroke: var(--viz-cold);  stroke-width: 1.5px; }
svg .dg-fill-plant  { fill: var(--viz-plant); fill-opacity: .16; stroke: var(--viz-plant); stroke-width: 1.5px; }
svg .dg-fill-water  { fill: var(--viz-water); fill-opacity: .14; stroke: var(--viz-water); stroke-width: 1.5px; }
svg .dg-fill-earth  { fill: var(--viz-earth); fill-opacity: .16; stroke: var(--viz-earth); stroke-width: 1.5px; }
svg .dg-fill-sun    { fill: var(--viz-sun);   fill-opacity: .22; stroke: var(--viz-sun);   stroke-width: 1.5px; }
svg .dg-fill-soft   { fill: #efece6; stroke: #c9c4b9; stroke-width: 1px; }
svg .dg-solid-accent{ fill: var(--dg-accent); stroke: none; }
svg .dg-solid-hot   { fill: var(--viz-hot); stroke: none; }
svg .dg-solid-cold  { fill: var(--viz-cold); stroke: none; }
svg .dg-solid-plant { fill: var(--viz-plant); stroke: none; }
svg .dg-solid-water { fill: var(--viz-water); stroke: none; }
svg .dg-solid-earth { fill: var(--viz-earth); stroke: none; }
svg .dg-solid-sun   { fill: var(--viz-sun); stroke: none; }
svg .dg-solid-muted { fill: var(--dg-muted, #6b665d); stroke: none; }
svg .dg-arrow       { fill: none; stroke-width: 2px; stroke-linecap: round; }
svg .dg-arrow.plain { stroke: var(--dg-stroke, #3f3b35); }  svg .dg-head.plain  { fill: var(--dg-stroke, #3f3b35); }
svg .dg-arrow.accent{ stroke: var(--dg-accent); }           svg .dg-head.accent { fill: var(--dg-accent); }
svg .dg-arrow.hot   { stroke: var(--viz-hot); }             svg .dg-head.hot    { fill: var(--viz-hot); }
svg .dg-arrow.cold  { stroke: var(--viz-cold); }            svg .dg-head.cold   { fill: var(--viz-cold); }
svg .dg-arrow.plant { stroke: var(--viz-plant); }           svg .dg-head.plant  { fill: var(--viz-plant); }
svg .dg-arrow.water { stroke: var(--viz-water); }           svg .dg-head.water  { fill: var(--viz-water); }
svg .dg-arrow.earth { stroke: var(--viz-earth); }           svg .dg-head.earth  { fill: var(--viz-earth); }
svg .dg-arrow.sun   { stroke: var(--viz-sun); }             svg .dg-head.sun    { fill: var(--viz-sun); }
svg .dg-arrow.muted { stroke: var(--dg-muted, #6b665d); }   svg .dg-head.muted  { fill: var(--dg-muted, #6b665d); }
svg .dg-arrow.thin  { stroke-width: 1.4px; }
svg .dg-head        { stroke: none; }
svg .dg-tag         { fill: #fff; stroke: var(--dg-accent); stroke-width: 1.25px; stroke-dasharray: 4 2; }
svg .dg-tag-answer  { font: 600 12px/1 var(--font-body, system-ui, sans-serif); fill: var(--viz-key); }
svg .dg-title       { font: 700 13px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--dg-stroke, #3f3b35); }
svg .dg-math        { font: 15px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--dg-stroke, #3f3b35); }
svg .dg-math-lg     { font: 600 20px/1.2 var(--font-body, system-ui, sans-serif); fill: var(--dg-stroke, #3f3b35); }
svg .dg-math-accent { font: 700 15px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--dg-accent); }
svg .dg-label-hot   { font: 600 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--viz-hot); }
svg .dg-label-cold  { font: 600 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--viz-cold); }
svg .dg-label-plant { font: 600 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--viz-plant); }
svg .dg-label-water { font: 600 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--viz-water); }
svg .dg-label-earth { font: 600 11px/1.3 var(--font-body, system-ui, sans-serif); fill: var(--viz-earth); }
svg .dg-label-white { font: 700 12px/1.3 var(--font-body, system-ui, sans-serif); fill: #fff; }
svg .dg-land, svg .dg-land-hi, svg .dg-border { vector-effect: non-scaling-stroke; stroke-linejoin: round; }
svg .dg-land        { fill: #ebe7df; stroke: #a8a294; stroke-width: .75px; }
svg .dg-land-hi     { fill: var(--dg-accent); fill-opacity: .22; stroke: var(--dg-accent); stroke-width: 1px; }
svg .dg-border      { fill: none; stroke: #a8a294; stroke-width: .5px; }
svg .dg-sea         { fill: #f4f7f9; stroke: none; }
svg .dg-route       { fill: none; stroke: var(--dg-accent); stroke-width: 2px; stroke-linecap: round; vector-effect: non-scaling-stroke; }
svg .dg-route.muted { stroke: var(--dg-muted, #6b665d); stroke-dasharray: 5 3; }
svg .dg-halo        { paint-order: stroke; stroke: #fff; stroke-width: 3px; stroke-linejoin: round; }
""" + CSS_END


# ── Textbook look (Science 7 only): figure frame, numbered captions, gradient paints, arrowhead markers ──
TB_CSS = """
body { counter-reset: fig; }
.viz.tb { counter-increment: fig; background: #fff; border: 1px solid #d6d1c6; border-top: 3px solid var(--dg-accent);
  border-radius: 3px; padding: .9rem 1.1rem .7rem; max-width: 44rem; }
.viz.tb figcaption { font-style: normal; text-align: left; max-width: none; font-size: .84rem; line-height: 1.45; color: #2f2b26;
  border-top: 1px solid #e2ddd2; margin: .65rem 0 0; padding-top: .45rem; }
.viz.tb figcaption::before { content: "Figure " counter(fig) "\\00a0\\00a0"; font-weight: 700; color: var(--dg-accent); }
.viz.tb svg .dg-label { font-size: 12.5px; } .viz.tb svg .dg-label-sm { font-size: 11.5px; }
.viz.tb svg .dg-label-hot, .viz.tb svg .dg-label-cold, .viz.tb svg .dg-label-water, .viz.tb svg .dg-label-plant,
.viz.tb svg .dg-label-earth, .viz.tb svg .dg-label-accent { font-size: 12px; }
.viz.tb svg .dg-fill-hot { fill-opacity: .34; } .viz.tb svg .dg-fill-cold { fill-opacity: .30; } .viz.tb svg .dg-fill-plant { fill-opacity: .34; }
.viz.tb svg .dg-fill-water { fill-opacity: .32; } .viz.tb svg .dg-fill-earth { fill-opacity: .34; } .viz.tb svg .dg-fill-sun { fill-opacity: .42; }
.viz.tb svg .dg-fill-accent { fill-opacity: .28; } .viz.tb svg .dg-fill-soft { fill: #e9e5dc; stroke: #b9b3a6; }
.viz.tb svg [class^="dg-fill"], .viz.tb svg [class^="dg-solid"], .viz.tb svg .dg-boundary { filter: drop-shadow(0 1.2px 1.2px rgba(40,30,20,.28)); }
svg .dg-g-crust, svg .dg-g-mantle, svg .dg-g-ocean, svg .dg-g-magma, svg .dg-g-cont, svg .dg-g-sph-crust, svg .dg-g-sph-mantle,
svg .dg-g-sph-outer, svg .dg-g-sph-inner, svg .dg-g-ign, svg .dg-g-sed, svg .dg-g-met, svg .dg-g-landa, svg .dg-g-landb,
svg .dg-speckle, svg .dg-star, svg .dg-station, svg .dg-wave, svg .dg-stream, svg .dg-stream-hi, svg .dg-ico { vector-effect: non-scaling-stroke; stroke-linejoin: round; }
svg .dg-g-crust     { fill: url(#tb-crust);  stroke: #5b4430; stroke-width: 1.2px; }
svg .dg-g-mantle    { fill: url(#tb-mantle); stroke: #c0702f; stroke-width: 1px; }
svg .dg-g-ocean     { fill: url(#tb-ocean);  stroke: #2f7aa6; stroke-width: .8px; }
svg .dg-g-magma     { fill: url(#tb-magma);  stroke: #a3270b; stroke-width: 1px; }
svg .dg-g-cont      { fill: url(#tb-cont);   stroke: #5b4430; stroke-width: 1.2px; }
svg .dg-g-sph-crust { fill: url(#tb-sph-crust); stroke: #5b4430; stroke-width: 1.2px; }
svg .dg-g-sph-mantle{ fill: url(#tb-sph-mantle); stroke: #a8501b; stroke-width: 1px; }
svg .dg-g-sph-outer { fill: url(#tb-sph-outer);  stroke: #a3270b; stroke-width: 1px; }
svg .dg-g-sph-inner { fill: url(#tb-sph-inner);  stroke: #b45a0a; stroke-width: 1px; }
svg .dg-g-ign       { fill: url(#tb-ign); stroke: #9a4a30; stroke-width: 1.2px; }
svg .dg-g-sed       { fill: url(#tb-sed); stroke: #8a6a2e; stroke-width: 1.2px; }
svg .dg-g-met       { fill: url(#tb-met); stroke: #6e5f52; stroke-width: 1.2px; }
svg .dg-g-landa     { fill: url(#tb-landa); stroke: #8a7650; stroke-width: 1px; }
svg .dg-g-landb     { fill: url(#tb-landb); stroke: #7a8a58; stroke-width: 1px; }
svg .dg-speckle     { fill: url(#tb-speckle); stroke: none; }
svg .dg-star        { fill: #ffd23f; stroke: #7a2e0e; stroke-width: 1.2px; }
svg .dg-station     { fill: #2f2b26; stroke: #fff; stroke-width: 1.5px; }
svg .dg-wave        { fill: none; stroke: #fff; stroke-width: 1.5px; stroke-linecap: round; }
svg .dg-stream      { fill: none; stroke: #2f86b8; stroke-width: 6px; stroke-linecap: round; stroke-linejoin: round; }
svg .dg-stream-hi   { fill: none; stroke: #cfeaf7; stroke-width: 1.6px; stroke-linecap: round; stroke-linejoin: round; }
svg .dg-ico         { stroke: #5b4430; stroke-width: .8px; }
svg .dg-ico-1 { fill: #f3d9c9; } svg .dg-ico-2 { fill: #7a3b2a; stroke: none; } svg .dg-ico-3 { fill: #fff; stroke: none; }
svg .dg-ico-4 { fill: #e7c98a; } svg .dg-ico-5 { fill: #cfa95e; } svg .dg-ico-6 { fill: #f0dfb4; }
svg .dg-ico-7 { fill: #bfb2a5; } svg .dg-ico-line { fill: none; stroke: #6e5f52; stroke-width: 1px; }
svg .dg-shadow { fill: url(#tb-hatch); stroke: none; }
svg .dg-ray-case { fill: none; stroke: #fff; stroke-width: 3.8px; stroke-opacity: .85; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
svg .dg-lane { fill: none; stroke: #fff; stroke-opacity: .38; stroke-width: 15px; stroke-linejoin: round; }
svg .dg-glow { fill: url(#tb-glow); stroke: none; }
svg .dg-g-crustL { fill: url(#tb-crustL); stroke: #5b4430; stroke-width: 1.2px; vector-effect: non-scaling-stroke; }
svg .dg-g-crustR { fill: url(#tb-crustR); stroke: #5b4430; stroke-width: 1.2px; vector-effect: non-scaling-stroke; }
svg .dg-crustline { fill: none; stroke: #5b4430; stroke-width: .9px; stroke-opacity: .7; vector-effect: non-scaling-stroke; }
svg .dg-melt { fill: #ff8c42; stroke: #a3270b; stroke-width: .6px; }
svg .dg-tree { fill: #5d8a47; stroke: #34592a; stroke-width: .8px; stroke-linejoin: round; }
svg .dg-fz { fill: #5b4430; fill-opacity: .22; stroke: none; }
svg .dg-tick { fill: none; stroke: var(--dg-stroke, #3f3b35); stroke-width: 1.2px; vector-effect: non-scaling-stroke; }
svg .dg-tuft { fill: none; stroke: #6f8548; stroke-width: 1px; stroke-linecap: round; stroke-opacity: .8; }
svg .dg-ico-8 { fill: #d99a82; } svg .dg-ico-9 { fill: #8a4a3a; } svg .dg-ico-10 { fill: #fbf1ea; } svg .dg-ico-11 { fill: #e9b9a2; }
svg .dg-ico-pale { fill: none; stroke: #efe8de; stroke-width: 1px; }
svg .dg-arrow.dash { stroke-dasharray: 6 4; }
svg .dg-g-outer { fill: url(#tb-outer); stroke: #a3270b; stroke-width: 1px; }
svg .dg-g-inner { fill: url(#tb-inner); stroke: #b45a0a; stroke-width: 1px; }
svg .dg-g-volc  { fill: url(#tb-volc); stroke: #3f352d; stroke-width: 1.2px; stroke-linejoin: round; }
svg .dg-g-rock  { fill: url(#tb-rock); stroke: #4a4038; stroke-width: 1.2px; stroke-linejoin: round; }
svg .dg-g-ashcloud { fill: url(#tb-ashcloud); stroke: #8f877e; stroke-width: .8px; }
svg .dg-snow  { fill: #fff; stroke: #b9b3a6; stroke-width: .8px; stroke-linejoin: round; }
svg .dg-crack { fill: none; stroke: #3a3029; stroke-width: 1.1px; stroke-linecap: round; stroke-linejoin: round; }
svg .dg-sed-sand { fill: #ecd59c; stroke: #a8874a; stroke-width: .7px; }
svg .dg-sed-silt { fill: #cfab7c; stroke: #8f6c45; stroke-width: .7px; }
svg .dg-sed-clay { fill: #aaa39a; stroke: #6e675f; stroke-width: .7px; }
svg .dg-lens  { fill: none; stroke: #3f3b35; stroke-width: 2px; }
svg .dg-lens-rim { fill: none; stroke: #fff; stroke-width: 5px; }
svg .dg-basalt { fill: #56514c; stroke: none; }
svg .dg-fine  { fill: url(#tb-fine); stroke: none; }
svg .dg-min-feld { fill: #e39a7e; stroke: #6b4a3a; stroke-width: .6px; }
svg .dg-min-feld2 { fill: #f2bba3; stroke: #6b4a3a; stroke-width: .6px; }
svg .dg-min-qtz { fill: #eeebe5; stroke: #6b4a3a; stroke-width: .6px; }
svg .dg-min-mica { fill: #3a3330; stroke: #1f1a18; stroke-width: .6px; }
svg .dg-stripe-n { fill: #57514b; stroke: none; }
svg .dg-stripe-r { fill: #f3eee4; stroke: none; }
svg .dg-pol-n { fill: #fff; stroke: none; } svg .dg-pol-r { fill: #57514b; stroke: none; }
svg .dg-grass { fill: #8bb162; stroke: #5d8a47; stroke-width: .8px; }
svg .dg-fault { fill: none; stroke: #2f241b; stroke-width: 2.2px; stroke-linecap: round; }
svg .dg-focus { fill: #e2431a; stroke: #7a1f0a; stroke-width: 1.2px; }
svg .dg-house-wall { fill: #f6efe2; stroke: #3f3b35; stroke-width: 1px; }
svg .dg-roof { fill: #a3452a; stroke: #5e2414; stroke-width: 1px; stroke-linejoin: round; }
svg .dg-door { fill: #6b4a3a; stroke: none; } svg .dg-window { fill: #bfe3f5; stroke: #3f3b35; stroke-width: .6px; }
svg .dg-ash { fill: #d9d3ca; stroke: #3f352d; stroke-width: 1px; stroke-linejoin: round; }
svg .dg-ash-dot { fill: #6b645c; stroke: none; }
svg .dg-ice { fill: #e3f4fb; stroke: #5aa9d0; stroke-width: 1px; stroke-linejoin: round; }
svg .dg-ice-line { fill: none; stroke: #fff; stroke-width: 1px; }
svg .dg-sun { fill: #ffd23f; stroke: #c98a0a; stroke-width: 1px; } svg .dg-ray { fill: none; stroke: #e0a515; stroke-width: 1.4px; stroke-linecap: round; }
svg .dg-moon { fill: #f4f1e6; stroke: #8a8578; stroke-width: 1px; }
svg .dg-fish { fill: #b9c6ce; stroke: #4a5560; stroke-width: 1px; stroke-linejoin: round; }
svg .dg-bone { fill: none; stroke: #f6f1e6; stroke-width: 1.6px; stroke-linecap: round; stroke-linejoin: round; }
svg .dg-bone-fill { fill: #f6f1e6; stroke: #8a7a62; stroke-width: .8px; }
svg .dg-fossil { fill: none; stroke: #3a2f26; stroke-width: 1.8px; stroke-linecap: round; stroke-linejoin: round; }
svg .dg-fossil-fill { fill: #3a2f26; stroke: none; }
svg .dg-lith-sand { fill: url(#tb-p-sand); stroke: #8a6a2e; stroke-width: .8px; }
svg .dg-lith-shale { fill: url(#tb-p-shale); stroke: #5f5a55; stroke-width: .8px; }
svg .dg-lith-lime { fill: url(#tb-p-lime); stroke: #5d6a72; stroke-width: .8px; }
svg .dg-lith-coal { fill: #2f2b28; stroke: #1a1715; stroke-width: .8px; }
svg .dg-ammonite { fill: #efe3c8; stroke: #5b4430; stroke-width: 1px; }
svg .dg-amm-line { fill: none; stroke: #5b4430; stroke-width: .8px; }
svg .dg-face-side { fill: #000; fill-opacity: .16; stroke: #3f3b35; stroke-width: .8px; }
svg .dg-face-top { fill: #fff; fill-opacity: .45; stroke: #3f3b35; stroke-width: .8px; }
svg .dg-panel { fill: #faf8f3; stroke: #e2ddd2; stroke-width: 1px; }
svg .dg-rain { fill: none; stroke: #3b8fc0; stroke-width: 1.3px; stroke-linecap: round; stroke-dasharray: 5 4; }
svg .dg-precam { fill: url(#tb-precam); stroke: #6e675f; stroke-width: .8px; }
svg .dg-zoom { fill: none; stroke: #8f877e; stroke-width: 1px; stroke-dasharray: 3 3; }
svg .dg-sp-d { fill: #5b4430; fill-opacity: .28; } svg .dg-sp-l { fill: #fff; fill-opacity: .33; }
svg .dg-hatch-l { stroke: #fff; stroke-opacity: .55; stroke-width: 1.6px; }
svg .dg-fine-a { fill: #d8d2c8; } svg .dg-fine-b { fill: #8f877e; }
svg .dg-psand-bg { fill: #f0dca6; } svg .dg-psand-dot { fill: #8a6a2e; }
svg .dg-pshale-bg { fill: #cfcac3; } svg .dg-pshale-l { stroke: #6e675f; stroke-width: .9px; }
svg .dg-plime-bg { fill: #dce4e8; } svg .dg-plime-l { fill: none; stroke: #7d8b93; stroke-width: .8px; }
svg .dg-pt-cold { fill: url(#tb-pt-cold); stroke: #1e3a8a; stroke-width: .8px; }
svg .dg-pt-warm { fill: url(#tb-pt-warm); stroke: #8a5a00; stroke-width: .8px; }
svg .dg-pt-hot  { fill: url(#tb-pt-hot);  stroke: #7a1f0a; stroke-width: .8px; }
svg .dg-trail-cold, svg .dg-trail-warm, svg .dg-trail-hot { fill: none; stroke-linecap: round; stroke-width: 12px; }
svg .dg-trail-cold.sm, svg .dg-trail-warm.sm, svg .dg-trail-hot.sm { stroke-width: 8px; }
svg .dg-trail-cold { stroke: #3b6fd8; stroke-opacity: .22; } svg .dg-trail-warm { stroke: #e0a515; stroke-opacity: .32; }
svg .dg-trail-hot { stroke: #e2431a; stroke-opacity: .24; }
svg .dg-vib { fill: none; stroke: #8f877e; stroke-width: 1px; stroke-linecap: round; }
svg .dg-g-steel  { fill: url(#tb-steel);  stroke: #5f6770; stroke-width: 1px; stroke-linejoin: round; }
svg .dg-g-steelH { fill: url(#tb-steelH); stroke: #4a5058; stroke-width: 1.2px; stroke-linejoin: round; }
svg .dg-g-wood { fill: url(#tb-wood); stroke: #6b4a2a; stroke-width: 1px; stroke-linejoin: round; }
svg .dg-grain { fill: none; stroke: #7a5230; stroke-opacity: .45; stroke-width: 1px; stroke-linecap: round; }
svg .dg-flame { fill: url(#tb-flame); stroke: #c2410c; stroke-width: .8px; stroke-linejoin: round; }
svg .dg-flame-in { fill: #fff3a0; stroke: none; }
svg .dg-g-water { fill: url(#tb-water); stroke: none; }
svg .dg-water-top { fill: none; stroke: #2f7aa6; stroke-width: 1.2px; }
svg .dg-glass { fill: #f4f9fb; fill-opacity: .55; stroke: #6e8796; stroke-width: 1.4px; stroke-linejoin: round; }
svg .dg-glass-hi { fill: none; stroke: #fff; stroke-width: 3px; stroke-linecap: round; stroke-opacity: .9; }
svg .dg-skin { fill: url(#tb-skin); stroke: #9a6a4f; stroke-width: 1px; stroke-linejoin: round; }
svg .dg-skin-line { fill: none; stroke: #9a6a4f; stroke-width: .8px; stroke-linecap: round; }
svg .dg-g-sand { fill: url(#tb-sand); stroke: #a8874a; stroke-width: 1px; }
svg .dg-g-sky-day { fill: url(#tb-sky-day); stroke: none; } svg .dg-g-sky-night { fill: url(#tb-sky-night); stroke: none; }
svg .dg-starlet { fill: #fff; stroke: none; }
svg .dg-g-liquid { fill: url(#tb-liquid); stroke: #a3270b; stroke-width: .8px; }
svg .dg-burner { fill: #3f3b35; stroke: #1f1c19; stroke-width: 1px; }
svg .dg-g-hotblock  { fill: url(#tb-hotblock);  stroke: #7a1f0a; stroke-width: 1.2px; }
svg .dg-g-coldblock { fill: url(#tb-coldblock); stroke: #1e3a8a; stroke-width: 1.2px; }
svg .dg-g-warmblock { fill: url(#tb-warmblock); stroke: #8a5a00; stroke-width: 1.2px; }
svg .dg-cross { fill: none; stroke: #b91c1c; stroke-width: 3px; stroke-linecap: round; }
svg .dg-g-bag { fill: url(#tb-bag); stroke: #2f5a7a; stroke-width: 1.2px; stroke-linejoin: round; }
svg .dg-quilt { fill: none; stroke: #fff; stroke-opacity: .55; stroke-width: 1px; stroke-dasharray: 3 3; }
svg .dg-insul { fill: url(#tb-insul); stroke: #b8708a; stroke-width: .8px; }
svg .dg-ins-a { fill: #f6c9d6; } svg .dg-ins-l { fill: none; stroke: #d98aa3; stroke-width: 1px; }
svg .dg-g-globe { fill: url(#tb-globe); stroke: #1f5f8a; stroke-width: 1px; }
svg .dg-land { fill: #6fa35a; stroke: #3f6b33; stroke-width: .6px; }
svg .dg-g-sunball { fill: url(#tb-sunball); stroke: #d97a0a; stroke-width: 1px; }
svg .dg-silver { fill: url(#tb-silver); stroke: #6e7780; stroke-width: 1px; }
svg .dg-g-plastic { fill: url(#tb-plastic); stroke: #26303a; stroke-width: 1px; }
svg .dg-g-soup { fill: url(#tb-soup); stroke: #a3501b; stroke-width: .8px; }
svg .dg-vac { fill: #fff; stroke: none; }
svg .dg-band-water { fill: #0369a1; fill-opacity: .09; stroke: none; } svg .dg-band-hot { fill: #c2410c; fill-opacity: .08; stroke: none; }
svg .dg-dot-water { fill: #0369a1; stroke: #fff; stroke-width: 1px; } svg .dg-dot-hot { fill: #c2410c; stroke: #fff; stroke-width: 1px; }
svg .dg-g-ballast { fill: url(#tb-rock); stroke: #6e675f; stroke-width: .8px; }
svg .dg-brick { fill: url(#tb-brick); stroke: #7a3b2a; stroke-width: 1px; }
svg .dg-brick-bg { fill: #c97a5a; } svg .dg-brick-l { fill: none; stroke: #f3e3d6; stroke-width: 1px; }
svg .dg-wave-hot { fill: none; stroke: #e0a515; stroke-width: 2px; stroke-linecap: round; }
svg .dg-porcelain { fill: #fbfaf7; stroke: #3f3b35; stroke-width: 1.2px; stroke-linejoin: round; }
svg .dg-snowflake { fill: none; stroke: #6fa8d6; stroke-width: 1.2px; stroke-linecap: round; }
svg .dg-curve-cold, svg .dg-curve-water, svg .dg-curve-hot, svg .dg-curve-accent { fill: none; stroke-width: 3px; stroke-linecap: round; stroke-linejoin: round; }
svg .dg-curve-cold { stroke: #1d4ed8; } svg .dg-curve-water { stroke: #0369a1; } svg .dg-curve-hot { stroke: #c2410c; } svg .dg-curve-accent { stroke: var(--dg-accent); }
svg .dg-rodglow { fill: url(#tb-rodglow); stroke: none; }
svg .dg-night { fill: #0b1a33; fill-opacity: .38; stroke: none; }
svg .dg-vibring-cold, svg .dg-vibring-hot, svg .dg-vibring-warm { stroke-width: .9px; stroke-dasharray: 2 2; }
svg .dg-vibring-cold { fill: #1d4ed8; fill-opacity: .08; stroke: #6f97ea; } svg .dg-vibring-warm { fill: #e0a515; fill-opacity: .1; stroke: #e0a515; }
svg .dg-vibring-hot { fill: #e2431a; fill-opacity: .09; stroke: #f2793a; }
svg .dg-zip { fill: none; stroke: #e9ecef; stroke-width: 2px; stroke-dasharray: 2 2; }
svg .dg-leader { fill: none; stroke: #3f3b35; stroke-width: 1px; }
svg .dg-leader-dot { fill: #3f3b35; stroke: #fff; stroke-width: 1px; }
svg .dg-arrow.mk.sun { marker-end: url(#tb-m-sun); } svg .dg-arrow.mk.plant { marker-end: url(#tb-m-plant); }
svg .dg-arrow.mk.earth { marker-end: url(#tb-m-earth); } svg .dg-arrow.mk.accent { marker-end: url(#tb-m-accent); }
svg .dg-an { stroke: #3a332c; stroke-width: .9px; stroke-linejoin: round; stroke-linecap: round; vector-effect: non-scaling-stroke; }
svg .dg-an-line { fill: none; stroke: #3a332c; stroke-width: .9px; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
svg .dg-an-thin { fill: none; stroke: #3a332c; stroke-width: .6px; stroke-opacity: .6; stroke-linecap: round; vector-effect: non-scaling-stroke; }
svg .dg-an-stem { fill: none; stroke: #3f6b33; stroke-width: 1.4px; stroke-linecap: round; vector-effect: non-scaling-stroke; }
svg .dg-c-tan { fill: #d9c3a0; } svg .dg-c-snow { fill: #f4efe6; } svg .dg-c-grey { fill: #a39d93; } svg .dg-c-wolf { fill: #8f8a82; }
svg .dg-c-brown { fill: #7a5236; } svg .dg-c-moose { fill: #5e4030; } svg .dg-c-dark { fill: #2a2622; } svg .dg-c-yellow { fill: #f2c230; }
svg .dg-c-orange { fill: #e8892a; } svg .dg-c-green { fill: #6fa35a; } svg .dg-c-dkgreen { fill: #3f6b33; } svg .dg-c-olive { fill: #7d8a3e; }
svg .dg-c-heron { fill: #8fa3b5; } svg .dg-c-pink { fill: #d9579a; } svg .dg-c-cream { fill: #efe3c8; } svg .dg-c-white { fill: #fff; }
svg .dg-c-red { fill: #b8452a; } svg .dg-c-lynx { fill: #c9b08c; } svg .dg-c-owl { fill: #8a6544; } svg .dg-c-mallard { fill: #2f7a4a; }
svg .dg-c-purple { fill: #9b7cc0; } svg .dg-c-bark { fill: #f1efe8; } svg .dg-c-char { fill: #3a3330; } svg .dg-c-lime { fill: #a9cf6a; }
svg .dg-c-lilac { fill: #c9a6de; } svg .dg-c-wheat { fill: #e3c46a; } svg .dg-c-canola { fill: #f5d42a; } svg .dg-c-skin { fill: #f1c7a8; }
svg .dg-g-leaf { fill: url(#tb-leaf); stroke: #3f6b33; stroke-width: .9px; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
svg .dg-g-conifer { fill: url(#tb-conifer); stroke: #23421f; stroke-width: .9px; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
svg .dg-g-soil { fill: url(#tb-soil); stroke: #5b4430; stroke-width: 1px; }
svg .dg-g-sphere-plant { fill: url(#tb-sph-plant); stroke: #2c5a22; stroke-width: 1px; }
svg .dg-g-sphere-earth { fill: url(#tb-sph-earth); stroke: #5b3a20; stroke-width: 1px; }
svg .dg-g-sphere-muted { fill: url(#tb-sph-muted); stroke: #3f3b35; stroke-width: 1px; }
svg .dg-curve-plant { fill: none; stroke: #3f7a2a; stroke-width: 3px; stroke-linecap: round; stroke-linejoin: round; }
svg .dg-band-plant { fill: #3f7a2a; fill-opacity: .08; stroke: none; } svg .dg-band-earth { fill: #7a5230; fill-opacity: .08; stroke: none; }
svg .dg-card { fill: #fff; stroke: #b9b3a6; stroke-width: 1px; filter: drop-shadow(0 1.2px 1.2px rgba(40,30,20,.22)); }
svg .dg-card-plant { fill: #eef5e6; stroke: #7aa35a; stroke-width: 1px; filter: drop-shadow(0 1.2px 1.2px rgba(40,30,20,.22)); }
svg .dg-card-earth { fill: #f5ede2; stroke: #a8876a; stroke-width: 1px; filter: drop-shadow(0 1.2px 1.2px rgba(40,30,20,.22)); }
svg .dg-tier-1 { fill: #dcebcb; stroke: #6f8f55; stroke-width: 1px; } svg .dg-tier-2 { fill: #f5eac4; stroke: #a8904a; stroke-width: 1px; }
svg .dg-tier-3 { fill: #f7dcc2; stroke: #b07a4a; stroke-width: 1px; } svg .dg-tier-4 { fill: #f2cfcb; stroke: #a8605a; stroke-width: 1px; }
svg .dg-g-nucleus { fill: url(#tb-nucleus); stroke: #6b3f85; stroke-width: 1px; }
svg .dg-g-chloro { fill: url(#tb-chloro); stroke: #2c5a22; stroke-width: .8px; }
svg .dg-g-cyto { fill: url(#tb-cyto); stroke: #5b8a3a; stroke-width: 1px; }
svg .dg-cellwall { fill: #cfe3a8; stroke: #4f7a2a; stroke-width: 1.6px; }
svg .dg-epi { fill: #f6f9f0; stroke: #7a9a5a; stroke-width: 1px; }
svg .dg-g-vac { fill: url(#tb-vac); stroke: #4a98c6; stroke-width: 1px; }
svg .dg-g-acell { fill: url(#tb-acell); stroke: #a8605a; stroke-width: 1.6px; }
svg .dg-g-carrot { fill: url(#tb-carrot); stroke: #b8560f; stroke-width: 1px; stroke-linejoin: round; }
svg .dg-g-petal { fill: url(#tb-petal); stroke: #c98a0a; stroke-width: 1px; stroke-linejoin: round; }
svg .dg-g-pod { fill: url(#tb-pod); stroke: #3f6b33; stroke-width: 1px; stroke-linejoin: round; }
svg .dg-g-pot { fill: url(#tb-pot); stroke: #8a4a2a; stroke-width: 1.2px; stroke-linejoin: round; }
svg .dg-g-oil { fill: url(#tb-oil); stroke: #a8800a; stroke-width: 1px; }
svg .dg-root { fill: none; stroke: #8a6a3a; stroke-width: 1.8px; stroke-linecap: round; }
svg .dg-root-thin { fill: none; stroke: #8a6a3a; stroke-width: 1px; stroke-linecap: round; }
svg .dg-hair { fill: none; stroke: #6b4a2a; stroke-width: 1.3px; stroke-linecap: round; }
svg .dg-vein { fill: none; stroke: #eaf6dc; stroke-width: 1.1px; stroke-linecap: round; }
svg .dg-filament { fill: none; stroke: #c9a64a; stroke-width: 2px; stroke-linecap: round; }
svg .dg-tube { fill: none; stroke: #d9a21a; stroke-width: 2px; stroke-linecap: round; }
svg .dg-cross-thin { fill: none; stroke: #b91c1c; stroke-width: 1.8px; stroke-linecap: round; }
svg .dg-dna-a { fill: none; stroke: var(--dg-accent); stroke-width: 1.8px; } svg .dg-dna-b { fill: none; stroke: #c2410c; stroke-width: 1.8px; }
svg .dg-dna-r { fill: none; stroke: #8f877e; stroke-width: 1px; }
svg .dg-g-concrete { fill: url(#tb-concrete); stroke: #6e6a64; stroke-width: 1.2px; stroke-linejoin: round; }
svg .dg-g-stone { fill: url(#tb-stone); stroke: #6e5f52; stroke-width: 1px; stroke-linejoin: round; }
svg .dg-g-dome { fill: url(#tb-dome); stroke: #5f6770; stroke-width: 1.2px; }
svg .dg-g-tube { fill: url(#tb-tube); stroke: #8f877e; stroke-width: 1.2px; }
svg .dg-rope { fill: none; stroke: #8a6a3a; stroke-width: 2.2px; stroke-linecap: round; }
svg .dg-paperedge { fill: none; stroke: #6b665d; stroke-width: 2.6px; stroke-linecap: round; }
svg .dg-paper { fill: #fdfdfb; stroke: #8f877e; stroke-width: 1.2px; stroke-linejoin: round; }
svg .dg-member { fill: none; stroke: #5f6770; stroke-width: 4px; stroke-linecap: round; }
svg .dg-member-hi { fill: none; stroke: #d6dadf; stroke-width: 1.2px; stroke-linecap: round; }
svg .dg-bolt { fill: #8a939c; stroke: #3f3b35; stroke-width: 1px; }
svg .dg-ghost { fill: none; stroke: #8f877e; stroke-width: 2px; stroke-dasharray: 5 4; }
svg .dg-book-1 { fill: #c0533a; stroke: #6b2a1a; stroke-width: 1px; } svg .dg-book-2 { fill: #3b6fa0; stroke: #1f3f60; stroke-width: 1px; }
svg .dg-book-3 { fill: #5d8a47; stroke: #34592a; stroke-width: 1px; } svg .dg-pages { fill: #fbf7ea; stroke: #b9b3a6; stroke-width: .6px; }
svg .dg-bar-elastic, svg .dg-bar-plastic, svg .dg-bar-brittle { fill: none; stroke-width: 9px; stroke-linecap: round; }
svg .dg-bar-elastic { stroke: #5b7fb0; } svg .dg-bar-plastic { stroke: #c9824a; } svg .dg-bar-brittle { stroke: #a8d4e8; }
svg .dg-bar-hi { fill: none; stroke: #fff; stroke-opacity: .55; stroke-width: 2px; stroke-linecap: round; }
svg .dg-arrow.mk       { stroke-width: 2.4px; }
svg .dg-arrow.mk.thin  { stroke-width: 1.7px; }
svg .dg-arrow.mk.muted { marker-end: url(#tb-m-muted); }
svg .dg-arrow.mk.plain { marker-end: url(#tb-m-plain); } svg .dg-arrow.mk.hot  { marker-end: url(#tb-m-hot); }
svg .dg-arrow.mk.cold  { marker-end: url(#tb-m-cold); }  svg .dg-arrow.mk.water{ marker-end: url(#tb-m-water); }
"""

def _grad(i, stops, x2="0", y2="1"):
    s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="tb-{i}" x1="0" y1="0" x2="{x2}" y2="{y2}">{s}</linearGradient>'

def _rad(i, stops):
    s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<radialGradient id="tb-{i}" cx=".5" cy=".5" r=".5" fx=".36" fy=".3">{s}</radialGradient>'

def _marker(i, col):
    return (f'<marker id="tb-m-{i}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="10" markerHeight="10" '
            f'markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.5 L9.5 5 L0.5 9.5 Z" class="dg-head {i}"/></marker>')

# ── Math textbook layer (Math 9, on top of TB_CSS): bolder lines, bigger haloed labels, angle arcs, tick marks ──
TB_MATH_CSS = """
.viz.tb svg text { paint-order: stroke; stroke: #fff; stroke-width: 3.5px; stroke-linejoin: round; }
.viz.tb svg .dg-label-white, .viz.tb svg .dg-tag-answer { stroke: none; }
.viz.tb svg .dg-boundary { stroke: #24211d; stroke-width: 2.1px; fill: url(#tb-m-disc); filter: none; }
.viz.tb svg .dg-line { stroke: #24211d; stroke-width: 2px; stroke-linecap: round; }
.viz.tb svg .dg-accent { stroke-width: 3px; stroke-linecap: round; }
.viz.tb svg .dg-dashed { stroke: #4a453e; stroke-width: 1.8px; stroke-dasharray: 6 4; }
.viz.tb svg .dg-construction { stroke-width: 1.3px; stroke-dasharray: 3 3; }
.viz.tb svg .dg-right-angle { stroke: #24211d; stroke-width: 1.5px; }
.viz.tb svg .dg-point { fill: #24211d; } .viz.tb svg .dg-point-accent { stroke: #fff; stroke-width: 1px; }
.viz.tb svg .dg-label { font-size: 14.5px; font-weight: 500; fill: #24211d; }
.viz.tb svg .dg-label-sm { font-size: 13px; }
.viz.tb svg .dg-label-accent, .viz.tb svg .dg-label-hot, .viz.tb svg .dg-label-cold, .viz.tb svg .dg-label-plant,
.viz.tb svg .dg-label-water, .viz.tb svg .dg-label-earth { font-size: 13.5px; font-weight: 700; }
.viz.tb svg .dg-math { font-size: 16.5px; } .viz.tb svg .dg-math-accent { font-size: 16.5px; }
.viz.tb svg .dg-pt { font: italic 600 15.5px/1 "Times New Roman", Georgia, serif; fill: #24211d; }
.viz.tb svg .dg-tag-answer { font-size: 13px; }
.viz.tb svg .dg-accent.hot { stroke: var(--viz-hot); } .viz.tb svg .dg-accent.plant { stroke: var(--viz-plant); }
.viz.tb svg .dg-pt.hot { fill: var(--viz-hot); } .viz.tb svg .dg-pt.accent { fill: var(--dg-accent); }
.viz.tb svg .dg-fill-accent { fill-opacity: .17; stroke-width: 2px; }
.viz.tb svg .dg-fill-hot, .viz.tb svg .dg-fill-plant, .viz.tb svg .dg-fill-earth, .viz.tb svg .dg-fill-water,
.viz.tb svg .dg-fill-cold, .viz.tb svg .dg-fill-sun { stroke-width: 2px; }
.viz.tb svg [class^="dg-fill"] { filter: drop-shadow(0 1px 1px rgba(40,30,20,.18)); }
svg .dg-ang, svg .dg-ang-w, svg .dg-tickm { vector-effect: non-scaling-stroke; }
svg .dg-ang { fill: none; stroke: var(--dg-accent); stroke-width: 1.7px; }
svg .dg-ang-w { stroke: none; fill: var(--dg-accent); fill-opacity: .16; }
svg .dg-ang.hot { stroke: var(--viz-hot); } svg .dg-ang-w.hot { fill: var(--viz-hot); }
svg .dg-ang.plant { stroke: var(--viz-plant); } svg .dg-ang-w.plant { fill: var(--viz-plant); }
svg .dg-ang.plain { stroke: #24211d; } svg .dg-ang-w.plain { fill: #6b665d; fill-opacity: .14; }
svg .dg-tickm { fill: none; stroke: #24211d; stroke-width: 1.8px; stroke-linecap: round; }
svg .dg-gravel { fill: none; stroke: #e8dfcc; stroke-width: 14px; stroke-linecap: round; }
svg .dg-grass { fill: #eef5e6; stroke: none; }
svg .dg-tickm.accent { stroke: var(--dg-accent); } svg .dg-tickm.hot { stroke: var(--viz-hot); }
svg .dg-open, svg .dg-closed, svg .dg-solray { vector-effect: non-scaling-stroke; }
svg .dg-open { fill: #fff; stroke: var(--dg-accent); stroke-width: 2.6px; }   /* number-line endpoint: not included */
svg .dg-closed { fill: var(--dg-accent); stroke: #fff; stroke-width: 1.2px; }  /* number-line endpoint: included */
svg .dg-closed.hot { fill: var(--viz-hot); }
svg .dg-solray { stroke: var(--dg-accent); stroke-width: 5px; stroke-linecap: butt; stroke-opacity: .85; fill: none; }
svg .dg-plot, svg .dg-grid-min, svg .dg-grid-maj, svg .dg-road, svg .dg-road-mid { vector-effect: non-scaling-stroke; }
svg .dg-plot { fill: #fbfcfe; stroke: #9aa5b8; stroke-width: 1px; }               /* graph paper behind a grid */
svg .dg-grid-min { stroke: #d5dce8; stroke-width: .8px; fill: none; }           /* every grid line */
svg .dg-grid-maj { stroke: #a9b4c6; stroke-width: 1px; fill: none; }            /* grid lines that carry a number */
svg .dg-road { stroke: #5c5853; stroke-width: 9px; stroke-linecap: round; fill: none; }
svg .dg-road-mid { stroke: #f4d35e; stroke-width: 1.6px; stroke-dasharray: 9 7; fill: none; }
svg .dg-wax { fill: url(#tb-tube); stroke: #8f887b; stroke-width: 1px; }
.viz.tb svg .dg-accent.water { stroke: var(--viz-water); }
svg .dg-sc-f, svg .dg-sc-t, svg .dg-sc-s, svg .dg-sc-cyl, svg .dg-sw-f, svg .dg-sw-t, svg .dg-sw-s, svg .dg-sw-cyl,
svg .dg-sg-f, svg .dg-sg-t, svg .dg-sg-s, svg .dg-sg-cyl, svg .dg-sr-f, svg .dg-sr-t, svg .dg-sr-s, svg .dg-sk-f, svg .dg-sk-t, svg .dg-sk-s,
svg .dg-sh-f, svg .dg-sh-t, svg .dg-sh-s { stroke: #24211d; stroke-width: 1.6px; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
svg .dg-edge, svg .dg-hid, svg .dg-fold, svg .dg-glass, svg .dg-plank { vector-effect: non-scaling-stroke; }   /* shaded solids: front / top / side / curved */
svg .dg-sc-f { fill: url(#tb-sc-f); } svg .dg-sc-t { fill: url(#tb-sc-t); } svg .dg-sc-s { fill: url(#tb-sc-s); } svg .dg-sc-cyl { fill: url(#tb-sc-cyl); }
svg .dg-sw-f { fill: url(#tb-sw-f); } svg .dg-sw-t { fill: url(#tb-sw-t); } svg .dg-sw-s { fill: url(#tb-sw-s); } svg .dg-sw-cyl { fill: url(#tb-sw-cyl); }
svg .dg-sg-f { fill: url(#tb-sg-f); } svg .dg-sg-t { fill: url(#tb-sg-t); } svg .dg-sg-s { fill: url(#tb-sg-s); } svg .dg-sg-cyl { fill: url(#tb-sg-cyl); }
svg .dg-sr-f { fill: url(#tb-sr-f); } svg .dg-sr-t { fill: url(#tb-sr-t); } svg .dg-sr-s { fill: url(#tb-sr-s); }
svg .dg-sk-f { fill: url(#tb-sk-f); } svg .dg-sk-t { fill: url(#tb-sk-t); } svg .dg-sk-s { fill: url(#tb-sk-s); }
svg .dg-sh-f { fill: url(#tb-sh-f); } svg .dg-sh-t { fill: url(#tb-sh-t); } svg .dg-sh-s { fill: url(#tb-sh-s); }
svg .ns { stroke: none; }                                                       /* face fill only; edges drawn on top */
svg .dg-edge { fill: none; stroke: #24211d; stroke-width: 1.6px; stroke-linecap: round; }
svg .dg-hid { fill: none; stroke: #5f5a52; stroke-width: 1.3px; stroke-dasharray: 5 3.5; }   /* hidden edge */
svg .dg-hid.hot { stroke: var(--viz-hot); stroke-width: 1.8px; } svg .dg-hid.water { stroke: var(--viz-water); stroke-width: 1.8px; }
svg .dg-fold { fill: none; stroke: #4a453e; stroke-width: 1.1px; stroke-dasharray: 4 3; }    /* fold line in a net */
svg .dg-glass { fill: #e6eef8; fill-opacity: .38; stroke: #24211d; stroke-width: 1.5px; }    /* see-through container */
svg .dg-ghost-hot { fill: var(--viz-hot); fill-opacity: .22; stroke: var(--viz-hot); stroke-width: 1.5px; stroke-dasharray: 5 3.5; vector-effect: non-scaling-stroke; }
svg .dg-plank { fill: none; stroke: #7e2618; stroke-width: .8px; stroke-opacity: .55; }
svg .dg-door { fill: #4a2a20; stroke: #24211d; stroke-width: 1px; }
svg .dg-eq, svg .dg-eq-lg { font: 400 19px/1 "Times New Roman", Georgia, serif; fill: #24211d; }   /* typeset maths: upright numbers, */
svg .dg-eq-lg { font-size: 25px; } svg .dg-eq .v, svg .dg-eq-lg .v { font-style: italic; }       /* letters in <tspan class="v"> */
svg .dg-eq.accent, svg .dg-eq-lg.accent { fill: var(--dg-accent); font-weight: 700; }
svg .dg-brace { fill: none; stroke: #4a453e; stroke-width: 1.4px; stroke-linejoin: round; stroke-linecap: round; vector-effect: non-scaling-stroke; }
svg .dg-tl-q, svg .dg-tl-x, svg .dg-tl-1, svg .dg-tl-n { stroke: #24211d; stroke-width: 1.3px; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
svg .dg-tl-q { fill: url(#tb-tl-q); } svg .dg-tl-x { fill: url(#tb-tl-x); } svg .dg-tl-1 { fill: url(#tb-tl-1); } svg .dg-tl-n { fill: url(#tb-tl-n); }   /* algebra tiles: x², x, 1, negative */
svg .dg-tl-q.e { fill: #4672b8; } svg .dg-tl-x.e { fill: #4c9a3a; } svg .dg-tl-1.e { fill: #c99a18; } svg .dg-tl-n.e { fill: #b03b22; }   /* tile edge (thickness) */
svg .dg-canola { fill: url(#tb-canola); stroke: #8a7414; stroke-width: 1.2px; vector-effect: non-scaling-stroke; }
svg .dg-crop { fill: none; stroke: #c79f12; stroke-width: 1px; stroke-opacity: .7; vector-effect: non-scaling-stroke; }
svg .dg-eq-xl { font: 400 46px/1 "Times New Roman", Georgia, serif; fill: #24211d; } svg .dg-eq-xl .v { font-style: italic; }
svg .dg-eq .sup, svg .dg-eq-lg .sup, svg .dg-eq-xl .sup { font-size: 70%; }   /* exponent: <tspan class="sup" dy="-8"> */
svg .dg-eq .acc, svg .dg-eq-lg .acc, svg .dg-eq-xl .acc { fill: var(--dg-accent); font-weight: 700; }
svg .dg-eq .hot, svg .dg-eq-lg .hot, svg .dg-eq-xl .hot { fill: var(--viz-hot); font-weight: 700; }
svg .dg-ch-a, svg .dg-ch-b, svg .dg-ch-n, svg .dg-ch-g { stroke: #24211d; stroke-width: 1.2px; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
svg .dg-ch-a { fill: url(#tb-ch-a); } svg .dg-ch-b { fill: url(#tb-ch-b); } svg .dg-ch-n { fill: url(#tb-ch-n); } svg .dg-ch-g { fill: url(#tb-ch-g); }   /* factor chips: blue, green, red (negative), grey (cancelled) */
svg .dg-ch-a.e { fill: #6f8fc4; } svg .dg-ch-b.e { fill: #5f9a48; } svg .dg-ch-n.e { fill: #c4573c; } svg .dg-ch-g.e { fill: #aaa395; }
svg .dg-strike { fill: none; stroke: var(--viz-hot); stroke-width: 2.4px; stroke-linecap: round; vector-effect: non-scaling-stroke; }   /* cancelled factor */
svg .dg-frac-key { stroke: var(--viz-key); stroke-width: 1.3px; vector-effect: non-scaling-stroke; }   /* fraction bar of a key answer */
svg .dg-fbar { stroke: #24211d; stroke-width: 1.3px; vector-effect: non-scaling-stroke; } svg .dg-fbar.acc { stroke: var(--dg-accent); }   /* fraction bar */
svg .dg-mb-r, svg .dg-mb-b, svg .dg-mb-g, svg .dg-coin, svg .dg-coin-rim, svg .dg-die, svg .dg-pc-r, svg .dg-pc-b, svg .dg-pc-g,
svg .dg-cell, svg .dg-scale, svg .dg-bag, svg .dg-bag-tie, svg .dg-rainbar { vector-effect: non-scaling-stroke; stroke-linejoin: round; }
svg .dg-mb-r { fill: url(#tb-mb-r); stroke: #6e1c0c; stroke-width: 1px; } svg .dg-mb-b { fill: url(#tb-mb-b); stroke: #132b63; stroke-width: 1px; }   /* marbles */
svg .dg-mb-g { fill: url(#tb-mb-g); stroke: #1f4f14; stroke-width: 1px; }
.viz.tb svg .dg-eq.stamp, .viz.tb svg .dg-eq-lg.stamp { stroke: none; fill: #5c430a; font-weight: 700; }   /* letter stamped on a coin */
svg .dg-coin { fill: url(#tb-coin); stroke: #8a6512; stroke-width: 1.5px; } svg .dg-coin-rim { fill: none; stroke: #b8891d; stroke-width: 1.2px; }   /* coin */
svg .dg-die { fill: url(#tb-die); stroke: #24211d; stroke-width: 1.3px; } svg .dg-pip { fill: #24211d; stroke: none; }   /* die face */
svg .dg-pc-r { fill: url(#tb-pc-r); stroke: #24211d; stroke-width: 1.4px; } svg .dg-pc-b { fill: url(#tb-pc-b); stroke: #24211d; stroke-width: 1.4px; }   /* spinner sectors, bars */
svg .dg-pc-g { fill: url(#tb-pc-g); stroke: #24211d; stroke-width: 1.4px; }
svg .dg-needle { fill: #24211d; stroke: #fff; stroke-width: 1px; } svg .dg-hub { fill: #f4f2ed; stroke: #24211d; stroke-width: 1.4px; }
svg .dg-cell { fill: url(#tb-cell); stroke: #b9b3a6; stroke-width: 1px; } svg .dg-cell.on { fill: url(#tb-cell-on); stroke: var(--dg-accent); stroke-width: 1.8px; }   /* outcome square */
svg .dg-scale { fill: url(#tb-pscale); stroke: #24211d; stroke-width: 1.5px; }   /* probability line, 0 to 1 */
svg .dg-bag { fill: #e6eef8; fill-opacity: .45; stroke: #24211d; stroke-width: 1.6px; } svg .dg-bag-tie { fill: none; stroke: #8a6512; stroke-width: 3px; stroke-linecap: round; }   /* clear bag */
svg .dg-rainbar { fill: url(#tb-rainbar); stroke: #24211d; stroke-width: 1.6px; } svg .dg-rainfx { fill: url(#tb-rain); stroke: none; } svg .dg-rain-l { stroke: #fff; stroke-opacity: .75; stroke-width: 1.3px; stroke-linecap: round; }
svg .dg-blank-bar { fill: url(#tb-cell); stroke: #24211d; stroke-width: 1.6px; vector-effect: non-scaling-stroke; }
svg .dg-eq-sm { font: 400 15px/1 "Times New Roman", Georgia, serif; fill: #24211d; } svg .dg-eq-sm .v { font-style: italic; }   /* small typeset maths: number-line labels */
svg .dg-eq-sm .sup { font-size: 70%; } svg .dg-eq-sm.accent { fill: var(--dg-accent); font-weight: 700; }
svg .dg-eq.hot, svg .dg-eq-sm.hot, svg .dg-eq-lg.hot { fill: var(--viz-hot); font-weight: 700; }
svg .dg-eq.plant, svg .dg-eq-sm.plant, svg .dg-eq-lg.plant { fill: var(--viz-plant); font-weight: 700; }
svg .dg-fbar.hot { stroke: var(--viz-hot); } svg .dg-fbar.plant { stroke: var(--viz-plant); }
svg .dg-therm { fill: url(#tb-therm); stroke: #8a1f0a; stroke-width: 1px; vector-effect: non-scaling-stroke; }   /* thermometer liquid */
svg .dg-rad { fill: none; stroke: #24211d; stroke-width: 1.4px; stroke-linejoin: round; stroke-linecap: round; vector-effect: non-scaling-stroke; }   /* radical sign with its bar */
svg .dg-rad.acc { stroke: var(--dg-accent); stroke-width: 1.8px; } svg .dg-rad.hot { stroke: var(--viz-hot); stroke-width: 1.8px; } svg .dg-rad.plant { stroke: var(--viz-plant); stroke-width: 1.8px; }
svg .dg-rad.muted { stroke: #6b665d; stroke-width: 1.1px; } svg .dg-eq-sm.muted { fill: #6b665d; }
"""

TB_DEFS_START, TB_DEFS_END = "<!-- viz-defs -->", "<!-- /viz-defs -->"
TB_DEFS = (TB_DEFS_START + '\n<!-- tikz: none | shared paints for the figures below -->\n<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>'
    + _grad("crust", [(0, "#d3b88f"), (1, "#a88a65")]) + _grad("mantle", [(0, "#fde3ad"), (1, "#f2a85f")])
    + _grad("ocean", [(0, "#b5e1f4"), (1, "#4a98c6")]) + _grad("magma", [(0, "#ffc15a"), (1, "#e2431a")])
    + _grad("cont", [(0, "#d8c4a0"), (1, "#b29a72")])
    + _rad("sph-crust", [(0, "#c9ab80"), (1, "#8f7150")]) + _rad("sph-mantle", [(0, "#fcd18c"), (.6, "#ee8a42"), (1, "#c9581f")])
    + _rad("sph-outer", [(0, "#ffb85a"), (.6, "#e8662a"), (1, "#b83a12")]) + _rad("sph-inner", [(0, "#fff7c9"), (.55, "#ffd23f"), (1, "#f0a01a")])
    + _grad("ign", [(0, "#f6c6b0"), (1, "#e59878")]) + _grad("sed", [(0, "#f6e6b8"), (1, "#e6c882")])
    + _grad("met", [(0, "#d6cabe"), (1, "#b0a090")])
    + _grad("landa", [(0, "#e4d6b4"), (1, "#cdb98e")], "1", "1") + _grad("landb", [(0, "#d9e0bc"), (1, "#bccb94")], "1", "1")
    + '<pattern id="tb-speckle" width="14" height="14" patternUnits="userSpaceOnUse">'
      '<circle cx="3" cy="4" r=".9" class="dg-sp-d"/><circle cx="10" cy="9" r=".7" class="dg-sp-d"/>'
      '<circle cx="7" cy="13" r=".8" class="dg-sp-l"/><circle cx="12" cy="2" r=".7" class="dg-sp-l"/></pattern>'
    + '<pattern id="tb-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" class="dg-hatch-l"/></pattern>'
    + '<radialGradient id="tb-glow" cx=".5" cy="1" r="1"><stop offset="0" stop-color="#ff7a2a" stop-opacity=".85"/><stop offset="1" stop-color="#ff7a2a" stop-opacity="0"/></radialGradient>'
    + _grad("crustL", [(0, "#a07f5a"), (1, "#dcbf94")], "1", "0") + _grad("crustR", [(0, "#dcbf94"), (1, "#a07f5a")], "1", "0")
    + _grad("outer", [(0, "#ffb85a"), (1, "#d9531e")]) + _grad("inner", [(0, "#fff3b0"), (1, "#f0a01a")])
    + _grad("volc", [(0, "#9a8c80"), (1, "#5f544b")]) + _grad("rock", [(0, "#b3a698"), (1, "#7d7064")])
    + _grad("precam", [(0, "#d9d2c6"), (1, "#ebe6dc")], "1", "0")
    + '<radialGradient id="tb-ashcloud" cx=".5" cy=".5" r=".5" fx=".4" fy=".35"><stop offset="0" stop-color="#eeebe6"/><stop offset="1" stop-color="#a8a097"/></radialGradient>'
    + '<pattern id="tb-fine" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" class="dg-fine-a"/><circle cx="3" cy="3" r=".5" class="dg-fine-b"/></pattern>'
    + '<pattern id="tb-p-sand" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" class="dg-psand-bg"/><circle cx="2" cy="3" r=".9" class="dg-psand-dot"/><circle cx="7" cy="7" r=".9" class="dg-psand-dot"/><circle cx="8" cy="1.5" r=".6" class="dg-psand-dot"/></pattern>'
    + '<pattern id="tb-p-shale" width="16" height="8" patternUnits="userSpaceOnUse"><rect width="16" height="8" class="dg-pshale-bg"/><line x1="1" y1="3" x2="7" y2="3" class="dg-pshale-l"/><line x1="9" y1="7" x2="15" y2="7" class="dg-pshale-l"/></pattern>'
    + '<pattern id="tb-p-lime" width="20" height="10" patternUnits="userSpaceOnUse"><rect width="20" height="10" class="dg-plime-bg"/><path d="M0 0.5 H20 M0 5.5 H20 M5 0.5 V5.5 M15 5.5 V10" class="dg-plime-l"/></pattern>'
    + _rad("pt-cold", [(0, "#dbe7ff"), (.55, "#6f97ea"), (1, "#1d4ed8")]) + _rad("pt-warm", [(0, "#fff6cf"), (.55, "#f3c33f"), (1, "#c98a0a")])
    + _rad("pt-hot", [(0, "#ffe1c9"), (.55, "#f2793a"), (1, "#c2410c")])
    + _grad("steel", [(0, "#f3f5f7"), (.45, "#c3c9cf"), (.55, "#a7afb7"), (1, "#d6dadf")])
    + _grad("steelH", [(0, "#8a939c"), (.25, "#e9ecef"), (.5, "#c3c9cf"), (1, "#7d868f")], "1", "0")
    + _grad("wood", [(0, "#d9a86c"), (1, "#b07a44")]) + _grad("water", [(0, "#cfeaf8"), (1, "#7fbde2")])
    + '<linearGradient id="tb-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffd23f"/><stop offset=".55" stop-color="#ff8a2a"/><stop offset="1" stop-color="#e2431a"/></linearGradient>'
    + _grad("skin", [(0, "#f7d6bd"), (1, "#e3ad8a")]) + _grad("sand", [(0, "#f7e6b0"), (1, "#dfbd72")])
    + _grad("sky-day", [(0, "#bfe2f6"), (1, "#f2f9fd")]) + _grad("sky-night", [(0, "#1c2745"), (1, "#3d4d78")])
    + _grad("liquid", [(0, "#ff9a7a"), (.5, "#e2431a"), (1, "#b8320c")], "1", "0")
    + _grad("hotblock", [(0, "#ffb38a"), (1, "#e2541f")]) + _grad("coldblock", [(0, "#cfe0ff"), (1, "#6f97ea")])
    + _grad("warmblock", [(0, "#ffe7a3"), (1, "#f0b43a")]) + _grad("bag", [(0, "#8fb9d8"), (1, "#4f86ad")])
    + '<pattern id="tb-insul" width="12" height="8" patternUnits="userSpaceOnUse"><rect width="12" height="8" class="dg-ins-a"/><path d="M0 4 Q3 0 6 4 T12 4" class="dg-ins-l"/></pattern>'
    + _rad("globe", [(0, "#bfe3f5"), (.6, "#4a98c6"), (1, "#1f5f8a")]) + _rad("sunball", [(0, "#fffbe0"), (.5, "#ffd23f"), (1, "#f08a1a")])
    + _grad("silver", [(0, "#ffffff"), (.5, "#d3d8dd"), (1, "#f2f4f6")], "1", "0")
    + _grad("plastic", [(0, "#6f8091"), (1, "#3a4652")]) + _grad("soup", [(0, "#f9c27c"), (1, "#e0782a")])
    + '<pattern id="tb-brick" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="24" height="12" class="dg-brick-bg"/><path d="M0 .5 H24 M0 6.5 H24 M6 .5 V6.5 M18 6.5 V12" class="dg-brick-l"/></pattern>'
    + '<linearGradient id="tb-rodglow" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff5a1a" stop-opacity=".6"/><stop offset=".55" stop-color="#ffb03a" stop-opacity=".18"/><stop offset="1" stop-color="#ffb03a" stop-opacity="0"/></linearGradient>'
    + _grad("leaf", [(0, "#9fd07a"), (1, "#5b9a44")]) + _grad("conifer", [(0, "#4f8a4a"), (1, "#2f5f2c")]) + _grad("soil", [(0, "#9a7452"), (1, "#6b4a32")])
    + _rad("sph-plant", [(0, "#d8f0c0"), (.6, "#7cb85a"), (1, "#3f7a2a")]) + _rad("sph-earth", [(0, "#f0d8b8"), (.6, "#b88a5a"), (1, "#7a5230")]) + _rad("sph-muted", [(0, "#e8e4dc"), (.6, "#9a958c"), (1, "#5f5a52")])
    + _rad("nucleus", [(0, "#f0dcf6"), (.6, "#c09ad6"), (1, "#8a5aa8")]) + _rad("chloro", [(0, "#d4f0b0"), (.6, "#6fb84a"), (1, "#3f7a2a")])
    + _grad("cyto", [(0, "#f2f9e8"), (1, "#dcefc6")]) + _rad("vac", [(0, "#f2faff"), (1, "#b5dcf2")]) + _rad("acell", [(0, "#fff3ef"), (1, "#f6d4cc")])
    + _grad("carrot", [(0, "#e0701a"), (.45, "#ffb05a"), (1, "#d8601a")], "1", "0") + _grad("petal", [(0, "#fff3b0"), (1, "#f2b830")]) + _grad("pod", [(0, "#cfe9a0"), (1, "#7cb85a")])
    + _grad("pot", [(0, "#d98a5a"), (1, "#a85a34")]) + _grad("oil", [(0, "#fff0a8"), (1, "#e8b820")])
    + _grad("concrete", [(0, "#dedbd5"), (1, "#a8a49e")]) + _grad("stone", [(0, "#ecdfca"), (1, "#bfa98c")])
    + _rad("dome", [(0, "#ffffff"), (1, "#bfc6cd")]) + _grad("tube", [(0, "#d6d1c6"), (.4, "#ffffff"), (1, "#cfc9bd")])
    + _marker("muted", "#6b665d") + _marker("plain", "#3f3b35") + _marker("hot", "#c2410c") + _marker("cold", "#1d4ed8") + _marker("water", "#0369a1")
    + _marker("sun", "#c98a0a") + _marker("plant", "#3f7a2a") + _marker("earth", "#7a5230") + _marker("accent", "#6b4a8a")
    + "".join(_grad(f"{t}-f", [(0, f0), (1, f1)]) + _grad(f"{t}-t", [(0, t0), (1, t1)], "1", "1") + _grad(f"{t}-s", [(0, s0), (1, s1)])
              + _grad(f"{t}-cyl", [(0, c0), (.38, c1), (1, c2)], "1", "0")
              for t, f0, f1, t0, t1, s0, s1, c0, c1, c2 in [
                  ("sc", "#e6eef8", "#cbdaee", "#f5f8fc", "#e3ebf6", "#b8cae2", "#9fb5d3", "#9fb4d2", "#f1f6fc", "#8ea5c6"),
                  ("sw", "#fde8bd", "#f5cf82", "#fff5dc", "#fbe7b8", "#eec27a", "#dea65a", "#dca55a", "#fff2d2", "#cf9442"),
                  ("sg", "#dff0d4", "#c0dfad", "#f0f8ea", "#dcefd0", "#a8cf8e", "#8dbd72", "#8cbb72", "#eef8e7", "#7aab5f"),
                  ("sr", "#d65a43", "#b53c2b", "#e48a74", "#d4664f", "#a3372a", "#86291c", "#86291c", "#e07a62", "#7a2418"),
                  ("sk", "#bfc3c7", "#9fa5ab", "#d9dcdf", "#c3c7cb", "#8e959c", "#767d84", "#767d84", "#d9dcdf", "#6a7178"),
                  ("sh", "#f9d6c8", "#f0b6a0", "#fce6dd", "#f7cdbd", "#eaa58b", "#dc8a6f", "#dc8a6f", "#fbe0d4", "#c97458")])
    + _grad("tl-q", [(0, "#b4cdf4"), (1, "#7aa3e3")], "1", "1") + _grad("tl-x", [(0, "#bde6a8"), (1, "#78c35f")], "1", "1")
    + _grad("tl-1", [(0, "#fff2b0"), (1, "#f5cd4c")], "1", "1") + _grad("tl-n", [(0, "#f9b3a1"), (1, "#e4644a")], "1", "1")
    + _grad("canola", [(0, "#ffec70"), (1, "#f2c51c")])
    + _grad("ch-a", [(0, "#e3ecf9"), (1, "#a9c2e8")], "1", "1") + _grad("ch-b", [(0, "#e0f2d4"), (1, "#a6d58d")], "1", "1")
    + _grad("ch-n", [(0, "#fcdad0"), (1, "#ef9f88")], "1", "1") + _grad("ch-g", [(0, "#f4f2ed"), (1, "#d6d1c6")], "1", "1")
    + _rad("mb-r", [(0, "#ffd6c8"), (.5, "#e0553a"), (1, "#9a2913")]) + _rad("mb-b", [(0, "#d6e4ff"), (.5, "#3e70d4"), (1, "#1a3a86")])
    + _rad("mb-g", [(0, "#d9f2c8"), (.5, "#4d9c35"), (1, "#24591a")]) + _rad("coin", [(0, "#fff6cc"), (.5, "#f0c84e"), (1, "#c4921b")])
    + _grad("die", [(0, "#ffffff"), (1, "#e4e0d7")], "1", "1") + _grad("cell", [(0, "#ffffff"), (1, "#ebe7de")])
    + _grad("cell-on", [(0, "#e3ecfb"), (1, "#b9cdf1")])
    + _grad("pc-r", [(0, "#f9bba7"), (1, "#de5d3c")], "1", "1") + _grad("pc-b", [(0, "#bfd3f6"), (1, "#5a86d6")], "1", "1")
    + _grad("pc-g", [(0, "#c9e9b4"), (1, "#68ae4b")], "1", "1") + _grad("pscale", [(0, "#ece8e0"), (1, "#a9c2ec")], "1", "0")
    + _grad("rainbar", [(0, "#a7d1ee"), (1, "#4c93c4")]) + _grad("therm", [(0, "#f6a08c"), (.45, "#d93a1c"), (1, "#9a2410")])
    + '<pattern id="tb-rain" width="9" height="11" patternUnits="userSpaceOnUse"><line x1="7" y1="1.5" x2="4" y2="8.5" class="dg-rain-l"/></pattern>'
    + '<radialGradient id="tb-m-disc" cx=".5" cy=".5" r=".5" fx=".42" fy=".36"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#f6f8fc"/><stop offset="1" stop-color="#e6ebf5"/></radialGradient>'
    + "</defs></svg>" + TB_DEFS_END)
DEFS_RE = re.compile(re.escape(TB_DEFS_START) + r".*?" + re.escape(TB_DEFS_END) + r"\n?", re.S)
TB_UNIT = re.compile(r"sci7-|math9-")
MATH_UNIT = re.compile(r"math9-")


def tb_css(unit):
    """Textbook CSS for a unit: '' (old look), TB_CSS (Science 7), or TB_CSS + the math layer (Math 9)."""
    if not TB_UNIT.match(unit):
        return ""
    return TB_CSS + (TB_MATH_CSS if MATH_UNIT.match(unit) else "")

VIZ_RE = re.compile(r"[ \t]*<!-- viz:[\w-]+ -->.*?<!-- /viz:[\w-]+ -->\n?", re.S)
CSS_RE = re.compile(r"\n?[ \t]*" + re.escape(CSS_START) + r".*?" + re.escape(CSS_END) + r"\n?", re.S)
TB_CSS_START = "/* ── viz-kit textbook layer (scripts/add_notes_visuals.py) ── */"
TB_CSS_END = "/* ── /viz-kit textbook layer ── */"
TB_CSS_RE = re.compile(re.escape(TB_CSS_START) + r".*?" + re.escape(TB_CSS_END) + r"\n?", re.S)
# Before 2026-11-21 the textbook layer went in unmarked after CSS_END, so every re-run stacked one more copy.
TB_LEGACY_RE = re.compile(r"\n?body \{ counter-reset: fig; \}.*?(?=</style>)", re.S)


def strip_css(doc):
    """Remove the viz-kit CSS, the textbook layer and any old unmarked textbook copies."""
    doc = CSS_RE.sub("", doc)
    doc = TB_CSS_RE.sub("", doc)
    return TB_LEGACY_RE.sub("\n", doc)


def kit_css(unit, tb, wb=False):
    """wb: workbook rules go last inside the textbook markers, so they win and a re-run removes them."""
    return CSS + ("\n" + TB_CSS_START + tb_css(unit) + ("\n" + WB_CSS + "\n" if wb else "") + TB_CSS_END if tb else "")


def read_page(path):
    with open(path, encoding="utf-8", newline="") as f:  # keep any \r\n exactly as it is
        return f.read()



def parse_fragment(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    if not m:
        sys.exit(f"{path}: missing --- header")
    meta = {}
    for line in m.group(1).splitlines():
        if line.strip():
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
    for key in ("anchor", "caption"):
        if key not in meta:
            sys.exit(f"{path}: header needs '{key}'")
    if "section" not in meta and "q" not in meta:
        sys.exit(f"{path}: header needs 'section' (notes) or 'q' (workbook)")
    meta["id"] = path.stem.split("-", 1)[1] if re.match(r"\d+-", path.stem) else path.stem
    meta["svg"] = m.group(2).strip()
    meta["lib"] = meta["svg"].startswith("@viz")
    meta["file"] = path
    return meta


def attrs(s):
    return dict(re.findall(r'([\w-]+)="([^"]*)"', s))


def expand(svg, answer_key):
    def tag(m):
        a = attrs(m.group(1))
        x, y, w = float(a["x"]), float(a["y"]), float(a["w"])
        h = float(a.get("h", 20))
        out = f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="3" class="dg-tag"/>'
        if answer_key:
            out += (f'<text x="{x + w / 2:g}" y="{y + h / 2 + 4:g}" text-anchor="middle" '
                    f'class="dg-tag-answer">{m.group(2).strip()}</text>')
        return out

    def arrow(m):
        a = attrs(m.group(1))
        x1, y1, x2, y2 = (float(a[k]) for k in ("x1", "y1", "x2", "y2"))
        kind = a.get("kind", "plain")
        size = float(a.get("head", 9))
        extra = " thin" if a.get("thin") else ""
        ang = math.atan2(y2 - y1, x2 - x1)
        # shorten the shaft so its round cap hides under the head
        sx, sy = x2 - math.cos(ang) * size * 0.7, y2 - math.sin(ang) * size * 0.7
        pts = []
        for da, r in ((0, 0), (2.6, size), (-2.6, size)):
            pts.append((x2 + math.cos(ang + da) * r, y2 + math.sin(ang + da) * r) if r else (x2, y2))
        p = " ".join(f"{px:.1f},{py:.1f}" for px, py in pts)
        line = f'<line x1="{x1:g}" y1="{y1:g}" x2="{sx:.1f}" y2="{sy:.1f}" class="dg-arrow {kind}{extra}"/>'
        if a.get("both"):
            ang2 = ang + math.pi
            pts2 = [(x1, y1)] + [(x1 + math.cos(ang2 + da) * size, y1 + math.sin(ang2 + da) * size) for da in (2.6, -2.6)]
            line = (f'<line x1="{x1 + math.cos(ang) * size * .7:.1f}" y1="{y1 + math.sin(ang) * size * .7:.1f}" '
                    f'x2="{sx:.1f}" y2="{sy:.1f}" class="dg-arrow {kind}{extra}"/>'
                    f'<polygon points="{" ".join(f"{px:.1f},{py:.1f}" for px, py in pts2)}" class="dg-head {kind}"/>')
        return line + f'<polygon points="{p}" class="dg-head {kind}"/>'

    def mapbase(m):
        a = attrs(m.group(1))
        layer = (VIS / "_maps" / f"{a['name']}.svg").read_text(encoding="utf-8")
        layer = re.sub(r"<!--.*?-->\n?", "", layer, flags=re.S).strip()
        if "x" in a or "y" in a:
            layer = f'<g transform="translate({a.get("x", 0)},{a.get("y", 0)})">{layer}</g>'
        return layer

    def pt(v):
        x, y = v.split(",")
        return float(x), float(y)

    def angle(m):
        # <angle at="x,y" from="x,y" to="x,y" r="16" kind="accent" right="1" n="2" reflex="1" nofill="1"/>
        a = attrs(m.group(1))
        (cx, cy), (fx, fy), (tx, ty) = pt(a["at"]), pt(a["from"]), pt(a["to"])
        r = float(a.get("r", 16))
        kind = a.get("kind", "accent")
        a1, a2 = math.atan2(fy - cy, fx - cx), math.atan2(ty - cy, tx - cx)
        d = (a2 - a1) % (2 * math.pi)
        reflex = bool(a.get("reflex"))
        if (d > math.pi) != reflex:      # draw the other way round
            a1, a2, d = a2, a1, 2 * math.pi - d
        u1, u2 = (math.cos(a1), math.sin(a1)), (math.cos(a2), math.sin(a2))
        if a.get("right"):
            s = r * 0.62
            p1, p3 = (cx + u1[0] * s, cy + u1[1] * s), (cx + u2[0] * s, cy + u2[1] * s)
            p2 = (p1[0] + u2[0] * s, p1[1] + u2[1] * s)
            pts = f"{p1[0]:.1f},{p1[1]:.1f} {p2[0]:.1f},{p2[1]:.1f} {p3[0]:.1f},{p3[1]:.1f}"
            fill = "" if a.get("nofill") else f'<polygon points="{cx:g},{cy:g} {pts}" class="dg-ang-w {kind}"/>'
            return fill + f'<polyline points="{pts}" class="dg-right-angle"/>'
        large = 1 if d > math.pi else 0
        def arc(rr):
            sx, sy = cx + u1[0] * rr, cy + u1[1] * rr
            ex, ey = cx + u2[0] * rr, cy + u2[1] * rr
            return f"M{sx:.1f} {sy:.1f} A{rr:g} {rr:g} 0 {large} 1 {ex:.1f} {ey:.1f}"
        out = "" if a.get("nofill") else f'<path d="M{cx:g} {cy:g} L{arc(r)[1:]} Z" class="dg-ang-w {kind}"/>'
        for k in range(int(a.get("n", 1))):
            out += f'<path d="{arc(r - 4 * k)}" class="dg-ang {kind}"/>'
        return out

    def ticks(m):
        # <ticks x1 y1 x2 y2 n="1" kind="plain"/>: n short marks across the middle of a segment (equal lengths)
        a = attrs(m.group(1))
        x1, y1, x2, y2 = (float(a[k]) for k in ("x1", "y1", "x2", "y2"))
        n, kind, L = int(a.get("n", 1)), a.get("kind", "plain"), float(a.get("len", 6))
        ang = math.atan2(y2 - y1, x2 - x1)
        ux, uy, nx, ny = math.cos(ang), math.sin(ang), -math.sin(ang), math.cos(ang)
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        out = ""
        for k in range(n):
            off = (k - (n - 1) / 2) * 4.5
            px, py = mx + ux * off, my + uy * off
            out += (f'<line x1="{px + nx * L:.1f}" y1="{py + ny * L:.1f}" x2="{px - nx * L:.1f}" y2="{py - ny * L:.1f}" '
                    f'class="dg-tickm {kind}"/>')
        return out

    # <keyonly>...</keyonly>: drawn only in the answer key (a worked example, tick marks that give an answer away)
    svg = re.sub(r"<keyonly>(.*?)</keyonly>", lambda m: m.group(1) if answer_key else "", svg, flags=re.S)
    svg = re.sub(r"<studentonly>(.*?)</studentonly>", lambda m: "" if answer_key else m.group(1), svg, flags=re.S)
    svg = re.sub(r"<angle\s+([^>]*?)/>", angle, svg)
    svg = re.sub(r"<ticks\s+([^>]*?)/>", ticks, svg)
    svg = re.sub(r"<mapbase\s+([^>]*?)/>", mapbase, svg)
    svg = re.sub(r"<tag\s+([^>]*)>(.*?)</tag>", tag, svg, flags=re.S)
    svg = re.sub(r"<arrow\s+([^>]*?)/>", arrow, svg)
    head = re.match(r"<svg\b([^>]*)>", svg)
    a = attrs(head.group(1))
    if "viewBox" not in a:
        sys.exit("svg needs a viewBox")
    _, _, w, h = a["viewBox"].split()
    new = '<svg xmlns="http://www.w3.org/2000/svg" role="img"'
    for k in ("viewBox", "aria-label"):
        new += f' {k}="{a[k]}"'
    new += f' width="{a.get("width", w)}" height="{a.get("height", h)}">'
    return new + svg[head.end():]


def draw_library(meta, answer_key):
    """Draw a fragment made of @viz lines with Math8Viz (via viz_line.pl)."""
    cmd = ["perl", str(ROOT / "scripts" / "viz_line.pl")] + (["--key"] if answer_key else [])
    lines = "\n".join(l.strip() for l in meta["svg"].splitlines() if l.strip()) + "\n"
    r = subprocess.run(cmd, input=lines.encode("utf-8"), capture_output=True)
    if r.returncode != 0:
        sys.exit(f"{meta['file'].name}: viz_line.pl failed:\n{r.stderr.decode('utf-8', 'replace')}")
    svgs = [x.strip() for x in r.stdout.decode("utf-8").split("<!--viz-split-->") if x.strip()]
    if len(svgs) == 1:
        return svgs[0]
    return '<div class="viz-row">\n' + "\n".join(svgs) + "\n</div>"


def figure(meta, answer_key, tb=False):
    cls = "viz tb" if tb else "viz"
    if meta.get("lib"):
        svg = draw_library(meta, answer_key)
        cap = meta["caption"]
        return (f'<!-- viz:{meta["id"]} -->\n<figure class="{cls}">\n{svg}\n'
                f'<figcaption>{cap}</figcaption>\n</figure>\n<!-- /viz:{meta["id"]} -->\n')
    svg = expand(meta["svg"], answer_key)
    tikz = meta.get("tikz", f"custom | {meta['id']}")
    cap = meta["caption"]
    return (f'<!-- viz:{meta["id"]} -->\n<figure class="{cls}">\n<!-- tikz: {tikz} -->\n{svg}\n'
            f'<figcaption>{cap}</figcaption>\n</figure>\n<!-- /viz:{meta["id"]} -->\n')


def find_section(doc, section, path):
    if section == "(top)":   # before the first <h2>: search from the start of <body>
        return re.search(r"<body[^>]*>", doc)
    for m in re.finditer(r"<h2\b[^>]*>(.*?)</h2>", doc, re.S):
        if section in re.sub(r"<[^>]+>", "", html.unescape(m.group(1))):
            return m
    sys.exit(f"{path.name}: no <h2> containing '{section}'")


BADGE_NUM = r'<span class="badge badge-num">Q?{}</span>'


def find_card(doc, q, path):
    m = re.search(BADGE_NUM.format(int(q)), doc)
    if not m:
        sys.exit(f"{path.name}: no question badge for Q{q}")
    nxt = re.search(BADGE_NUM.format(r"\d+"), doc[m.end():])
    return m.start(), (m.end() + nxt.start()) if nxt else len(doc)


def insert_point(doc, meta, anchor, where):
    if "q" in meta:
        start, limit = find_card(doc, meta["q"], meta["path"])
    else:
        sec = find_section(doc, meta["section"], meta["path"])
        nxt = re.compile(r"<h2\b").search(doc, sec.end())
        start, limit = sec.start(), (nxt.start() if nxt else len(doc))
    i = doc.find(anchor, start, limit)
    if i < 0:
        return None
    if where == "before":
        return doc.rfind("\n", 0, i) + 1
    if where.startswith("after:"):
        line_end = doc.find("\n", i)
        j = doc.find(where[6:], line_end if line_end >= 0 else i)
        if j < 0:
            sys.exit(f"{meta['file'].name}: '{where[6:]}' not found after anchor")
        i = j
    end = doc.find("\n", i)
    return len(doc) if end < 0 else end + 1


def fallback_point(doc, meta):
    if "q" in meta:
        sys.exit(f"{meta['file'].name}: anchor not found in Q{meta['q']} of {meta['path'].name}")
    sec = find_section(doc, meta["section"], meta["path"])
    end = doc.find("\n", sec.end())
    return end + 1


WB_CSS = ".viz.tb figcaption::before { content: none; }\n.q-card .viz.tb { margin: .9rem auto 1rem; }"
WB_BADGE = '<span class="badge badge-vis" data-viz>Diagram</span>'
CAP_NUM = re.compile(r'(<(?:p|div) class="svg-caption">|<figcaption>)(\s*)(Fig\.|Figure) (\d+)')
REF_NUM = re.compile(r'\b(Fig\.|Figure)(\s|&nbsp;)(\d+)\b')


def wb_caption_word(doc):
    return "Figure" if re.search(r'class="svg-caption">\s*Figure \d', doc) else "Fig."


def wb_number(doc):
    """Number every figure caption in page order and move text references with them."""
    caps = list(CAP_NUM.finditer(doc))
    new_at, remap = {}, {}
    for n, m in enumerate(caps, 1):
        new_at[m.start(4)] = n
        old = int(m.group(4))
        if old:
            remap.setdefault(old, n)
    def ref(m):
        if m.start(3) in new_at:
            return f"{m.group(1)}{m.group(2)}{new_at[m.start(3)]}"
        return f"{m.group(1)}{m.group(2)}{remap.get(int(m.group(3)), m.group(3))}"
    return REF_NUM.sub(ref, doc)


def wb_badges(doc, frags):
    for q in sorted({int(f["q"]) for f in frags}, reverse=True):
        m = re.search(BADGE_NUM.format(q), doc)
        start, end = find_card(doc, q, Path("page"))
        head_end = doc.find("</div>", m.end())
        if 'badge-vis' in doc[m.end():head_end]:
            continue
        star = re.search(r'<span class="badge badge-(?:core|ext)">.*?</span>', doc[m.end():head_end], re.S)
        at = m.end() + (star.end() if star else 0)
        doc = doc[:at] + "\n    " + WB_BADGE + doc[at:]
    return doc


def apply(unit, frags, notes_path, ak_path, remove=False):
    report = []
    wb = is_wb(unit)
    for path, answer_key in ((notes_path, False), (ak_path, True)):
        doc = read_page(path)
        doc = VIZ_RE.sub("", doc)
        doc = strip_css(doc)  # the block is inserted with its own newlines; put nothing back
        doc = DEFS_RE.sub("", doc)
        if wb:
            doc = re.sub(r"\n[ \t]*" + re.escape(WB_BADGE), "", doc)
        tb = bool(TB_UNIT.match(unit))
        if not remove and frags:
            doc = doc.replace("</style>", "\n" + kit_css(unit, tb, wb) + "\n</style>", 1)
            if tb:
                doc = re.sub(r"(<body[^>]*>)", lambda m: m.group(1) + "\n" + TB_DEFS, doc, count=1)
            # insert bottom-up so earlier offsets stay valid; ties keep fragment order
            placed = []
            word = wb_caption_word(doc) if wb else None
            for n, meta in enumerate(frags):
                meta = dict(meta, path=path)
                if wb:
                    meta["caption"] = f"{word} 0 — {meta['caption']}"
                    meta.setdefault("section", f"Q{meta['q']}")
                anchor = meta.get("ak_anchor", meta["anchor"]) if answer_key else meta["anchor"]
                pos = insert_point(doc, meta, anchor, meta.get("where", "after"))
                mode = "anchor"
                if pos is None:
                    if not answer_key:
                        sys.exit(f"{unit}/{meta['file'].name}: anchor not found in {meta['section']} of {path.name}")
                    pos, mode = fallback_point(doc, meta), "top of section"
                placed.append((pos, n, meta, mode))
                report.append(f"  {'key' if answer_key else 'notes'}: {meta['file'].name} → {meta['section']} ({mode})")
            for pos, n, meta, mode in sorted(placed, key=lambda t: (t[0], t[1]), reverse=True):
                block = figure(meta, answer_key, tb)
                if mode == "top of section":
                    block = block.replace(f'<figure class="{"viz tb" if tb else "viz"}">', f'<figure class="{"viz tb" if tb else "viz"}">\n<p class="viz-ak-note">Diagram — answers</p>', 1)
                doc = doc[:pos] + block + doc[pos:]
            if wb:
                doc = wb_badges(doc, frags)
        if wb:
            doc = wb_number(doc)
        path.write_text(doc, encoding="utf-8")
    return report


def restyle(unit, frags, paths):
    """Swap the drawing of every figure already in the page, keep its caption (and its data-ra read-aloud
    marker), and give every figure the textbook frame. Needs no anchors, so it works on pages that
    add_read_aloud.py has already marked. Re-run add_read_aloud.py afterwards."""
    tb = bool(TB_UNIT.match(unit))
    report = []
    for path, answer_key in zip(paths, (False, True)):
        doc = read_page(path)
        doc = strip_css(doc)
        doc = DEFS_RE.sub("", doc)
        doc = doc.replace("</style>", "\n" + kit_css(unit, tb, is_wb(unit)) + "\n</style>", 1)
        if tb:
            doc = re.sub(r"(<body[^>]*>)", lambda m: m.group(1) + "\n" + TB_DEFS, doc, count=1)
        for meta in frags:
            pat = re.compile(r"[ \t]*<!-- viz:" + re.escape(meta["id"]) + r" -->.*?<!-- /viz:" + re.escape(meta["id"]) + r" -->\n?", re.S)
            m = pat.search(doc)
            if not m:
                report.append(f"  {'key' if answer_key else 'notes'}: {meta['file'].name} not in page (skipped)")
                continue
            old = m.group(0)
            new = figure(meta, answer_key, tb)
            cap = re.search(r"<figcaption[^>]*>.*?</figcaption>", old, re.S)
            if cap:
                new = re.sub(r"<figcaption>.*?</figcaption>", lambda _: cap.group(0), new, count=1, flags=re.S)
            note = re.search(r'<p class="viz-ak-note">.*?</p>', old, re.S)
            if note:
                new = new.replace('<figure class="viz tb">' if tb else '<figure class="viz">', f'<figure class="{"viz tb" if tb else "viz"}">\n{note.group(0)}', 1)
            doc = doc[:m.start()] + new + doc[m.end():]
        if tb:
            doc = doc.replace('<figure class="viz">', '<figure class="viz tb">')
        path.write_text(doc, encoding="utf-8")
        report.append(f"  {'key' if answer_key else 'notes'}: {len(frags)} figures restyled")
    return report


def preview(unit, frags, notes_path, outdir):
    src = notes_path.read_text(encoding="utf-8")
    style = re.search(r"<style>(.*?)</style>", src, re.S).group(1)
    style = strip_css(style)
    tb = bool(TB_UNIT.match(unit))
    body = [TB_DEFS if tb else "", f"<h1 style='font-size:1.2rem'>{unit}</h1>"]
    for meta in frags:
        body.append(f"<h3 style='margin-top:2rem'>{meta['file'].name} · {html.escape(meta.get('section') or 'Q' + meta.get('q', ''))}</h3>")
        body.append("<div style='display:flex;gap:1.5rem;align-items:flex-start;flex-wrap:wrap'>")
        for ak in (False, True):
            body.append(f"<div style='flex:1;min-width:380px;border:1px dashed #ccc;padding:.5rem'>{figure(meta, ak, tb)}</div>")
        body.append("</div>")
    out = outdir / f"{unit}.html"
    font_base = notes_path.parent.as_uri() + "/"
    out.write_text(f"<!doctype html><html><head><meta charset='utf-8'><base href='{font_base}'><style>{style}\n{CSS}\n{tb_css(unit)}\n"
                   f"body{{max-width:1300px}}</style></head><body>{''.join(body)}</body></html>", encoding="utf-8")
    return out


def main(argv):
    remove = "--remove" in argv
    do_restyle = "--restyle" in argv
    outdir = None
    if "--preview" in argv:
        outdir = Path(argv[argv.index("--preview") + 1])
        outdir.mkdir(parents=True, exist_ok=True)
        argv = [a for a in argv if a not in ("--preview", str(outdir))]
    names = [a for a in argv if not a.startswith("--")] or list(UNITS)
    for unit in names:
        if unit not in UNITS:
            sys.exit(f"unknown unit {unit}; choose from {', '.join(UNITS)}")
        notes_path, ak_path = UNITS[unit]
        frag_dir = vis_dir(unit)
        frags = [parse_fragment(p) for p in sorted(frag_dir.glob("*.html"))] if frag_dir.exists() else []
        if not frags and not remove:
            continue
        print(f"{unit}: {len(frags)} visuals")
        for line in (restyle(unit, frags, (notes_path, ak_path)) if do_restyle else apply(unit, frags, notes_path, ak_path, remove)):
            print(line)
        if outdir and frags:
            print("  preview:", preview(unit, frags, notes_path, outdir))


if __name__ == "__main__":
    main(sys.argv[1:])
