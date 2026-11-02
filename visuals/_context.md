# Visuals: context and look

Read this before making or changing any visual in this folder.

## What goes here

Visual explainers: flow charts, process maps, and one-glance summaries of a workspace file, a unit, or a process. Each visual makes a complex document understandable without reading all the detail.

Not here:
- Classroom handouts or student-facing materials (those go in their type folders and `public/materials/`).
- Anything the site publishes (that is `src/` and `public/`).

## File rules

- One self-contained HTML file per visual. No build step, no external scripts, no external stylesheets. It must open by double-clicking.
- Name: `[topic]-visual-v[N].html`. Example: `claude-md-map-v1.html`. Never overwrite; bump `-v[N]` when a revision is significant.
- Keep the page under 200 KB. Inline CSS only. No images unless a visual truly needs one.

## The look

The visuals share one system so they read as a set. Match the existing page (`claude-md-map-v1.html`) unless there is a reason not to.

**Layout**
- Single column, centred, max width about 1100px, 16px side padding.
- Sections are white cards (rounded 12px, thin border) stacked vertically. Each section has one heading with a coloured tag label in capitals (e.g. START, DECIDE, GATE).
- Read top to bottom. Never make the reader scan sideways to follow the logic.
- No horizontal page scroll at phone width. Rows collapse to a single column below 600px.

**Boxes and arrows**
- Steps are rounded boxes with a 2px coloured border, a bold label, and a one-line muted description.
- Arrows are plain characters (`→` in rows, `↓` in columns). Do not draw SVG objects for simple flow.
- Decisions use the amber box with a question as the label. Show branches as two labelled columns: YES and NO.
- Keep each box to one bold line plus one short line. If a box needs more, the detail belongs in the source file, not the visual.

**Colour as meaning**

Colour carries meaning. Use the same meaning in every visual:

| Meaning | Token | Hex (light) | Use for |
|---|---|---|---|
| Start / entry | `--start` | `#2f6f4f` | Where the reader begins, reading order |
| Process step | `--step` | `#2c5282` | Actions Claude takes |
| Decision / check | `--decide` | `#b7791f` | Questions, branches, checks |
| Gate / constraint | `--gate` | `#7b4397` | Required statements, templates, gates |
| Hard rule / warning | `--rule` | `#c53030` | Must-never and must-always rules |
| Location / reference | `--folder` | `#4a5568` | Folders, files, where things live |

Do not reuse a colour for a different meaning in the same visual. Do not add new colours without a reason.

**Type**
- System font stack (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`). No web fonts.
- Body 15px / 1.45. Page title 26px. Section heading 18px. Muted text is the secondary colour, never smaller than 13px.
- Filenames, folder names, and inline code use the monospace stack (`ui-monospace, Consolas, monospace`).

**Colour tokens and modes**
- Define all colours as tokens on `:root`.
- Dark mode: redefine the surface and text tokens under `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`.
- Give `body` an explicit background (`var(--bg)`).
- Text must meet WCAG AA contrast in both modes. Do not rely on colour alone: every coloured box also carries a word label.

**Tone of text inside the visual**
- Plain, short, teacher-facing sentences. Use the file's own wording for rules and names so a reader can find the source line.
- Use "Claude" for the agent, "the user" only when quoting a request.

## Checklist before saving a visual

- [ ] Reads at a glance: the main path is clear without the detail.
- [ ] Each colour matches the meaning table.
- [ ] Each box has a bold label and at most one short line of description.
- [ ] Opens with no network and no build step.
- [ ] Works at phone width (check at 375px) and in dark mode.
- [ ] Every claim matches the source file. Note the source file at the bottom of the page.
- [ ] If the source file changed since the visual was made, update the visual or bump its version.

## Related

- Workspace map: `CLAUDE.md` (the source for `claude-md-map-v1.html`).
