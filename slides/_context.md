# Slides
*Class slide decks that a teacher presents alongside a unit's notes package*

A deck walks the class through the notes package one section at a time: a teaching slide with a large visual, then slides that fill in the notes' blanks. Students copy the notebook key words as they go. It renders to one standalone HTML page in `public/materials/` and is linked from the unit page.

Read before building: the unit's notes package (markdown source, or the HTML render if the course is HTML-only), its **notes answer key**, and the unit `_context.md` in `_courses/`.

---

## Gate (state before writing)

"Follows notes order: [sections]. Blanks 2–3 per slide, answers from the key. Key words from vocab tables: [terms]. Visual on every slide: [one line per slide]."

## Deck rules

These came from building the first deck (Social 9 Urbanization, 2026-10-19). They are binding.

1. **Follow the notes package.** The deck's sections are the notes' sections, in the same order. Each section opens with its teaching slide or slides, then its fill-in slides. The deck opens with the cover and the guiding question, and closes with a reflection that sends students back to the Pre-Knowledge Check and the Unit Synthesis.
2. **Fill-in slides carry every blank in the notes.**
   - Copy the notes' sentences word for word, with the same bold terms.
   - Put 2–3 blanks on a slide. A section with one blank gets one slide. Split a fill-in table across slides rather than going past three.
   - Number the blanks through the section: 1–3, then 4–6.
   - Take the answers from the notes answer key. They go in the answer panel, which fades in on the first click.
   - If the notes sentence and the key disagree, follow the notes and flag the key. For example, in Urbanization the notes have "a ___ boom" but the key answers "boom".
3. **Notebook key words come only from the notes' vocabulary tables.** Define them in the notes' or the answer key's own wording. Every slide except the fill-in slides has a key-word panel. When a section has no vocabulary term of its own, reuse one.
4. **Every slide gets a visual, as large as the slide allows.** Use maps, flow diagrams, before-and-after drawings, or concept diagrams built from the notes' content. A large icon is the minimum, and only on fill-in slides.
   - A hand-drawn map places its points from real coordinates and says "Schematic, not to scale".
   - Put labels in `<p>` tags pinned over the drawing, not in SVG `<text>`.
   - Prefer icon, label and arrow layouts to detailed drawings.
5. **Nothing invented.** Use no statistics, quotes or facts that aren't in the notes. Anything added from outside them, such as a place on a map, gets named in the handover so the teacher can cut it.
6. **Speaker notes on every slide.** Put one teaching move in the slide's `<aside>`. Notes are public once rendered, the same way answer keys are.

Evidence check (`templates/evidence-design-principles.md`): the Tier 1 strategy here is retrieval practice. Students fill the blanks from memory before the answers show.

---

## Files and naming

```
slides/[subject]/[unit]/[prefix]-[unit]-slides-v[N]/
  deck.json              title, order, sections, faces
  slides/<id>.html       one <section id="<id>"> per file
```

- Slide ids follow the layouts (`cover`, `question`, ...). Fill-in slides are `blanks-1a`, `blanks-1b`, `blanks-2a`, named by notes section.
- The render goes to `public/materials/[prefix]-[unit]-slides-v[N].html`. The folder name becomes the file name.
- Bump `v[N]` for a significant revision. Don't overwrite the previous version.

## Template

Copy `templates/slides-template/` to the new deck folder. It has one file per layout, all filled with [BRACKETED] placeholders. Delete the HTML comment at the top of each slide once it's filled.

| File | Layout | Use for |
|---|---|---|
| `cover.html` | Dark title, large visual, one key word | Slide 1 |
| `question.html` | Guiding question, big idea → three effect rows | Slide 2 |
| `cards.html` | 2–4 icon cards | A list or set of examples in the notes |
| `flow.html` | Card → arrow → centre card ← arrow ← card | Cause and effect, push and pull, before and after |
| `blanks-1a.html` | Numbered blanks with an answer panel that appears on click | Every blank in the notes |
| `statement.html` | Dark statement, large map or diagram | A "connection" or callout box in the notes |
| `visual.html` | Large drawing, icon list, misconception box, key word | A section with a misconception |
| `reflect.html` | Reread → Compare → Synthesis | Last slide |

Copy a layout as many times as the notes need, and add each id to `order` in `deck.json`.

---

## Slide format

A slide is the subset used by the claude.ai **Slides** artifact type. That means a deck can be previewed and hand-edited there (see Preview), and the site render shows the same markup.

- **Canvas:** 1920×1080. The `<section>` sets `background`, `color`, `font-family`, the flex or grid layout, and `padding:128px`, or `128px 128px 160px` when a footer is pinned at `bottom:64px`.
- **Vertical budget:** about 792px inside the padding (824px without a footer). Add up the heights before writing. Too much? Split the slide; don't shrink the text.
- **Styles:** inline only. No classes, `<style>`, `margin`, `em` or `var()`. Lengths in px, colours in hex.
- **Elements:** `h1`–`h3`, `p`, `ul`/`ol` of plain `li`, `b`, `i`, `span style="color"`, `div` containers, `img`, `svg aria-label`, `table`.
- **`<x-icon name>`:** the site shell draws Activity, Book, Chart, Chat, Check, CheckCircle, Clock, Cloud, Code, Database, Globe, GraduationCap, Home, Key, Lightbulb, Lightning, Link, Lock, PaperPlane, Play, Search, Settings, Star, ThumbsUp, Tool, Trust, Users, Verified, Warning and Wrench.
- **`<x-shape kind>`:** the site draws `arrow-right`, `arrow-left`, `arrow-up`, `arrow-down`, `diamond` and `ellipse`. `rect` and `rounded` are just the painted box.
- **Builds:** `data-build-in="fade"` on a pinned (`position:absolute`) element hides it until the next click.
- **Not drawn on the site:** `<x-connector>` and `<x-embed>`. Don't use them.
- **Speaker notes:** one plain-text `<aside>`, the section's last child.
- **Text sizes:** nothing under 24px. The text inside a box must fit its longest word, at about 0.6 × font-size per character.

**Look:**
- Ink `#1B2A3A`, paper `#F7F5F0`, accent `#B5562B`, accent on dark `#E9A07A`, second accent `#1F5F5B`.
- Body text `#4A5568` on light and `#BFCBD6` on dark. Card border `#D9D4C7`, dark card `#243649`.
- Headings in Source Serif 4, everything else in IBM Plex Sans.
- Sizes: 104, 96, 88, 80, 72 or 64 for headings; 36, 32, 30, 28, 26 or 24 for text.

---

## Build steps

1. State the gate. Copy the template folder and fill it, following the deck rules.
2. Render it: `"C:\Users\Ejan.Bremness\AppData\Roaming\uv\python\cpython-3.15-windows-x86_64-none\python.exe" scripts/render_slides.py slides/[subject]/[unit]/[deck folder]`. With no argument, the script renders every deck.
3. Screenshot every slide in headless Chrome and look at each one. Overflow and overlapping labels only show up this way.
   ```
   chrome.exe --headless=new --hide-scrollbars --window-size=1920,1080 --virtual-time-budget=4000 --screenshot=s1.png "file:///D:/Classroom%20tools/public/materials/<deck>.html#1"
   ```
4. Link it from the unit page. Add an extras group to the course manifest in `src/data/`, typed `slides` (see `src/data/social9.ts`):
   ```
   units[i].extras.unshift({ heading: 'Class slides', items: [{ label: 'Class Slides', doc: '<deck>', type: 'slides' }] })
   ```
   If the course's viewer only lists fixed document kinds, check that it adds the manifest's documents to its routes.
5. Update `_status.md`.

## Preview on claude.ai (optional)

A deck can be opened as a claude.ai Slides artifact to page through or edit in the browser.
- Copy the deck to the scratchpad as `<root>/project/deck.json` and `<root>/project/slides/*.html`.
- Publish with the Slides `type_url`, then publish the files to the artifact's url.
- Give the Artifact tool the long path form, `C:\Users\Ejan.Bremness\...`. The short `EJAN~1.BRE` form is blocked by a read permission rule.
- The artifact is private, and the repo folder stays the source. Copy any edits made there back into the repo before re-rendering.

---

## Decks

| Deck | Unit | Slides | Notes |
|---|---|---|---|
| `grade-9-social/urbanization-industry/soc9-urbanization-industry-slides-v1/` | Social 9 Urbanization and the Growth of Industry | 13 | First deck. On the unit page under "Class slides". The Alberta map adds Leduc (1947) and Fort McMurray, which aren't in the notes. |
