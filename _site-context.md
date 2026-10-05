# Mr. Bremness — Classroom Materials
## Site Design Context
*Governs every page layout, nav, colour, and component decision across the site.*

---

## Site Identity

| Property | Value |
|---|---|
| **Site name** | Mr. Bremness — Classroom Materials |
| **Browser tab format** | `[Page name] · Mr. Bremness` |
| **URL base** | `/Classroom-Tools/` (GitHub Pages — `astro.config.mjs`) |
| **Framework** | Astro + Tailwind CSS |
| **Deployment** | GitHub Pages via `IkeaNorweegway/Classroom-Tools`, built by `.github/workflows/deploy.yml` on push to `master` |

---

## Courses on the Site

Six courses are live. PhysEd and eSports are in the workspace but not on the site.

| Course | Slug | Accent token | Accent hex | Status |
|---|---|---|---|---|
| Grade 6 Science | `/materials/` | `science-*` | `#0891b2` (cyan) | Live |
| Math 9 | `/math9/` | `math9-*` | `#4f46e5` (indigo) | Live |
| Grade 7 Science | `/science7/` | inline hex | `#059669` (emerald) | Live |
| Social Studies 9 | `/social9/` | inline hex | `#b91c1c` (red) | Live |
| Social Studies 8 | `/social8/` | inline hex | `#4338ca` (indigo) | Live |
| STEAM (Gr. 5–9) | `/steam/` | inline hex | `#7c3aed` (violet) | Live |

**Adding a course:** Add a row here, add the slug to the `course` prop type in `BaseLayout.astro`, add a tab and subnav to `Nav.astro`, and add a course card to the home page. Only Grade 6 Science and Math 9 have Tailwind tokens; the newer courses use an inline hex in `Nav.astro`.

---

## Colour System

### Course accent tokens (already in `tailwind.config.mjs`)

```
science-500  #06b6d4   science-600  #0891b2   science-700  #0e7490
math9-500    #6366f1   math9-600    #4f46e5   math9-700    #4338ca
teacher-500  #f59e0b   teacher-600  #d97706   teacher-700  #b45309
```

### How accent colour propagates
- `<BaseLayout>` accepts a `course` prop: `'science' | 'math9' | 'science7' | 'social9' | 'social8' | 'steam'` and passes it to `Nav.astro`
- Grade 6 Science and Math 9 use Tailwind tokens (`bg-science-600`, `bg-math9-600`)
- Science 7, Social 8, Social 9, and STEAM set their accent with an inline `background-color` hex in `Nav.astro` and their pages
- There is no `data-course` attribute or `--accent` custom property. Moving every course to one mechanism is a target, not current state
- Site-level pages (home, 404) use slate — no course accent

### Teacher mode colour
- Teacher mode adds an amber banner at the top (`teacher-600` background)
- The nav background shifts to `slate-900` in teacher mode (already implemented)
- Course accent colours remain unchanged in teacher mode — only the banner changes

---

## Navigation Architecture

### Two-level nav

Every page has two nav levels:

**Level 1 — Site nav (top bar, always visible)**
- Left: site name → links to home `/`
- Centre: course tabs — `Gr. 6 Science` | `Math 9` | `Gr. 7 Science` | `Social 9` | `Social 8` | `STEAM` (active tab highlighted with course accent)
- Right: `Teacher` link (reads `← Student view` when in teacher mode)

**Level 2 — Course subnav (below top bar, visible when inside a course)**
- Grade 6 Science subnav: `Matter | Forces | Living Systems | Climate | Energy | Space | Materials`
- Math 9 subnav: `Number | Algebra | M&G | Stats & Prob | Practice | PAT Prep | POTD | Materials`
- Science 7, Social 8, and Social 9 subnavs list their units; the STEAM subnav lists Grades 5–9

### Teacher view
- The `Teacher` link in the top-right goes to the current course's teacher index (`/teacher`, `/math9/teacher`, `/science7/teacher`, `/social8/teacher`, `/social9/teacher`). STEAM has no teacher index.
- Teacher pages pass `teacherMode` to `BaseLayout`, which adds the amber banner and the dark nav.
- Teacher mode is a set of separate routes, not a site-wide toggle. Nothing is hidden from students: every answer key in `public/materials/` is reachable by URL.

### Active states
- Top nav course tab: `bg-{course}-600 text-white` when on any page under that course
- Course subnav item: `bg-{course}-600 text-white` when on that unit/strand
- All other links: `text-slate-600 hover:bg-slate-100`

### Layouts and nav today
- `Nav.astro` is the single unified nav for all six courses.
- `BaseLayout.astro` is the single base layout. `UnitLayout.astro` and `LessonLayout.astro` wrap it for the Grade 6 unit and lesson pages.

---

## Page Layouts

### BaseLayout (single layout for all pages)

```
Props:
  title: string           — page title (goes in <title> and <h1>)
  description?: string    — meta description
  course?: 'science' | 'math9' | 'science7' | 'social9' | 'social8' | 'steam'   — drives accent colour and subnav
  teacherMode?: boolean   — adds amber banner + dark nav
```

Structure:
```
<html>
  <head> ... </head>
  <body>
    [teacher banner if teacherMode]
    <Nav course={course} teacherMode={teacherMode} />   (top bar + course subnav)
    <main class="max-w-4xl mx-auto px-4 py-10 sm:px-6">
      <slot />
    </main>
    <footer> ... </footer>
  </body>
</html>
```

### Page types

| Page type | Layout | Notes |
|---|---|---|
| Home (`/`) | BaseLayout, no course | Course cards — no subnav |
| Course index (`/materials/`, `/math9/`) | BaseLayout + course subnav | Unit/strand overview cards |
| Unit page | BaseLayout + course subnav | List of materials for a unit |
| Material viewer | BaseLayout + course subnav | iFrame or direct HTML embed |
| Teacher index | BaseLayout, teacherMode=true | Same layout, amber banner |

---

## Home Page

**Layout:** Course card grid — 2 cards wide on desktop, 1 on mobile.

**Each course card contains:**
- Course name (bold, large)
- Short description (1 sentence)
- Number of units / topics
- Accent colour border-left or top strip
- Link to course index

**No other content on home.** The home page is a router, not a landing page.

---

## Typography

| Element | Style |
|---|---|
| Site name in nav | `font-bold text-base tracking-tight` |
| Page `<h1>` | `text-2xl sm:text-3xl font-bold text-slate-900` |
| Section `<h2>` | `text-xl font-semibold text-slate-800 mt-8 mb-3` |
| Body text | `text-slate-700 leading-relaxed` |
| Font family | `system-ui` (Tailwind default sans) for UI; Georgia for long-form prose content (material viewer) |

---

## Material Viewer Pages

Materials (HTML notes, worksheets, teacher guides) are served as static files from `/public/materials/`. The viewer page at `/materials/view/[unit]/[doc]` embeds them in an `<iframe>`.

**Viewer page rules:**
- iFrame takes full remaining height (`calc(100vh - nav height)`)
- No padding inside the viewer — the material's own CSS handles spacing
- Print button in the nav: `window.frames[0].print()`
- Teacher note / answer key toggle shows/hides the teacher file link (not the student file)
- Back link: breadcrumb `Course → Unit → [doc name]`

---

## Component Library

| Component | File | Purpose |
|---|---|---|
| `Nav` | `Nav.astro` | Top nav bar (site name, course tabs, teacher link) and the per-course subnav |
| `UnitCard` | `UnitCard.astro` | Card on course index pages |
| `LessonSection` | `LessonSection.astro` | Section within a lesson page |
| `BaseLayout` | `BaseLayout.astro` | Base layout wrapping all pages |
| `UnitLayout`, `LessonLayout` | `layouts/` | Grade 6 unit and lesson pages; both wrap `BaseLayout` |

---

## Routing Map

```
/                               Home — course cards
/materials/                     Grade 6 Science materials index
/materials/[unit]               Unit materials page
/materials/view/[unit]/[doc]    Material viewer
/materials/fr                   Français materials index
/units/[unit]                   Grade 6 "what you will learn" unit page
/units/[unit]/[lesson]          Grade 6 lesson page
/teacher/, /teacher/[unit]      Grade 6 teacher index and unit page
/math9/                         Math 9 index — strand cards
/math9/materials/               All Math 9 materials
/math9/materials/[strand]       number, algebra, measurement-geometry, statistics-probability
/math9/practice/, potd/, pat-prep/   Practice, problem of the day, PAT prep
/math9/teacher/                 Math 9 teacher index
/math9/view/[...slug]           Math 9 material viewer
/science7/                      Science 7 index (+ practice/, teacher/)
/science7/materials/[unit]      Unit materials page
/science7/view/[unit]/[doc]     Material viewer
/social8/, /social9/            Same shape as Science 7: index, materials/[unit], teacher/, view/[unit]/[doc]
/steam/                         STEAM index
/steam/materials/[grade]        Grade page
/steam/view/[grade]/[doc]       Material viewer
```

---

## File Conventions

### Static materials (`/public/materials/`)

```
public/materials/
  *.html, *.pdf                 Flat: Grade 6 Science, Science 7, Social 8, Social 9, STEAM
                                (file prefix sci6-, sci7-, soc8-, soc9-, steam5- to steam9-)
  math-9/
    notes/[unit]/               Notes HTML + teacher notes HTML
    worksheets/[strand]/[topic]/
    tests/[topic]/
    practice/
```

Renders live only here. The type folders hold the markdown sources.

### Naming
- Student notes: `math9-[unit]-notes-v1.html`
- Answer key: `math9-[unit]-notes-answers-v1.html`
- Teacher notes: `math9-[unit]-teachernotes-v1.html`
- Worksheet: `math9-[unit]-worksheet-[tier]-v1.html`

---

## Rules That Apply Everywhere

1. **One BaseLayout** — no course gets its own separate layout file. Use the `course` prop.
2. **No inline styles** — use Tailwind classes or `@apply` in global CSS. Exception: SVG diagram attributes (geometry only).
3. **One accent per course** — use the hex in the Courses table. New components take the accent from the `course` prop and do not introduce a new colour.
4. **Teacher content sits behind the teacher routes** — a page should never show teacher content without the amber banner active.
5. **Every material page has a print button** — materials are designed to be printed; the viewer must expose this.
6. **Mobile-first nav** — subnav collapses to a horizontal scroll on small screens (already implemented in Nav.astro; carry this pattern forward).
7. **Footer is consistent** — `[Course] · Alberta Curriculum 2023 · Built for learning`, set by `footerCourse` in `BaseLayout.astro` ("Classroom Materials" on site-level pages).
