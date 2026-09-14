# Mr. Bremness — Classroom Materials
## Site Design Context
*Governs every page layout, nav, colour, and component decision across the site.*

---

## Site Identity

| Property | Value |
|---|---|
| **Site name** | Mr. Bremness — Classroom Materials |
| **Browser tab format** | `[Page name] · Mr. Bremness` |
| **URL base** | `/science-6/` (GitHub Pages — `astro.config.mjs`) |
| **Framework** | Astro + Tailwind CSS |
| **Deployment** | GitHub Pages via `IkeaNorweegway/science-6` |

---

## Courses on the Site

Two courses are live. All other materials (PhysEd, eSports) are in the workspace but not yet on the site.

| Course | Slug | Accent token | Accent hex | Status |
|---|---|---|---|---|
| Grade 6 Science | `/materials/` | `science-*` | `#0891b2` (cyan) | Partially built |
| Math 9 | `/math9/` | `math9-*` | `#4f46e5` (indigo) | Partially built |
| Grade 7 Science | `/science7/` | inline hex | `#059669` (emerald) | Live |
| Social Studies 9 | `/social9/` | inline hex | `#b91c1c` (red) | Live |
| STEAM (Gr. 5–9) | `/steam/` | inline hex | `#7c3aed` (violet) | Live |

**Adding a course:** Add a row here, add a Tailwind colour token in `tailwind.config.mjs`, add a course card to the home page, add the course slug to the top nav.

---

## Colour System

### Course accent tokens (already in `tailwind.config.mjs`)

```
science-500  #06b6d4   science-600  #0891b2   science-700  #0e7490
math9-500    #6366f1   math9-600    #4f46e5   math9-700    #4338ca
teacher-500  #f59e0b   teacher-600  #d97706   teacher-700  #b45309
```

### How accent colour propagates
- The `<BaseLayout>` component accepts a `course` prop: `'science' | 'math9'`
- This prop sets a `data-course` attribute on `<body>`
- CSS custom property `--accent` is set per course: `.science { --accent: #0891b2 }` etc.
- Nav active states, headings, and link highlights use the current course accent
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
- Centre: course tabs — `Gr. 6 Science` | `Math 9` (active tab highlighted with course accent)
- Right: `Teacher ⇄ Student` toggle

**Level 2 — Course subnav (below top bar, visible when inside a course)**
- Grade 6 Science subnav: `Matter | Forces | Living Systems | Climate | Energy | Space | Materials`
- Math 9 subnav: `Number | Patterns & Relations | Shape & Space | Statistics & Probability | Materials`

### Teacher toggle behaviour
- Toggle lives in the top-right of the nav bar at all times (both student and teacher views)
- Toggling switches the site-wide mode — not just the current page
- Teacher mode: shows answer keys, teacher notes, and the amber "TEACHER VIEW" banner
- Student mode: hides answer-key files and teacher note links
- Implementation: URL parameter `?teacher=1` or a client-side cookie — decision TBD

### Active states
- Top nav course tab: `bg-{course}-600 text-white` when on any page under that course
- Course subnav item: `bg-{course}-600 text-white` when on that unit/strand
- All other links: `text-slate-600 hover:bg-slate-100`

### Current state vs target
| Component | Current | Target |
|---|---|---|
| `Nav.astro` | Grade 6 Science only | Unified site nav (both courses) |
| `Math9Nav.astro` | Math 9 standalone nav | Replace with course subnav in unified nav |
| `BaseLayout.astro` | Gr6 only, `teacherMode` prop | Add `course` prop, unified for both |
| `Math9Layout.astro` | Separate layout | Merge into `BaseLayout` via `course` prop |

---

## Page Layouts

### BaseLayout (single layout for all pages)

```
Props:
  title: string           — page title (goes in <title> and <h1>)
  description?: string    — meta description
  course?: 'science' | 'math9' | undefined   — drives accent colour and subnav
  teacherMode?: boolean   — adds amber banner + dark nav
```

Structure:
```
<html>
  <head> ... </head>
  <body data-course={course}>
    [teacher banner if teacherMode]
    <SiteNav course={course} teacherMode={teacherMode} />
    [CourseSubnav course={course} if course is set]
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
| `SiteNav` | `Nav.astro` (rename target) | Top nav bar — site name, course tabs, teacher toggle |
| `CourseSubnav` | new | Per-course unit/strand links below the top bar |
| `UnitCard` | `UnitCard.astro` | Card on course index pages |
| `MaterialList` | new | List of downloadable/viewable materials for a unit |
| `LessonSection` | `LessonSection.astro` | Section within a lesson page |
| `BaseLayout` | `BaseLayout.astro` | Single layout wrapping all pages |

---

## Routing Map

```
/                               Home — course cards
/materials/                     Grade 6 Science index
/materials/[unit]               Unit page (e.g. /materials/forces)
/materials/view/[unit]/[doc]    Material viewer
/materials/fr                   Français materials index
/math9/                         Math 9 index — strand cards
/math9/materials/               All Math 9 materials
/math9/materials/[strand]       Strand page (number, algebra, etc.)
/math9/view/[...slug]           Math 9 material viewer
/teacher/                       Teacher index (Grade 6 Science)
/teacher/[unit]                 Teacher unit page
```

---

## File Conventions

### Static materials (`/public/materials/`)

```
public/materials/
  [unit]/                       Grade 6 Science materials (flat)
  math-9/
    notes/[unit]/               Notes HTML + teacher notes HTML
    worksheets/[strand]/[topic]/
```

### Naming
- Student notes: `math9-[unit]-notes-v1.html`
- Answer key: `math9-[unit]-notes-answers-v1.html`
- Teacher notes: `math9-[unit]-teachernotes-v1.html`
- Worksheet: `math9-[unit]-worksheet-[tier]-v1.html`

---

## Rules That Apply Everywhere

1. **One BaseLayout** — no course gets its own separate layout file. Use the `course` prop.
2. **No inline styles** — use Tailwind classes or `@apply` in global CSS. Exception: SVG diagram attributes (geometry only).
3. **Course accent propagates via `data-course`** — never hardcode a course colour in a component; read from the CSS custom property.
4. **Teacher mode is site-wide** — a page should never show teacher content without the amber banner active.
5. **Every material page has a print button** — materials are designed to be printed; the viewer must expose this.
6. **Mobile-first nav** — subnav collapses to a horizontal scroll on small screens (already implemented in Nav.astro; carry this pattern forward).
7. **Footer is consistent** — `[Course] · Alberta Curriculum 2023 · Built for learning` — update "Course" to "Classroom Materials" on site-level pages.
