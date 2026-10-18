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

Seven courses are live. PhysEd and eSports are in the workspace but not on the site.

| Course | Slug | Accent token | Accent hex | Status |
|---|---|---|---|---|
| Grade 6 Science | `/materials/` | `science-*` | `#0891b2` (cyan) | Live |
| Math 9 | `/math9/` | `math9-*` | `#4f46e5` (indigo) | Live |
| Grade 7 Science | `/science7/` | inline hex | `#059669` (emerald) | Live |
| Social Studies 9 | `/social9/` | inline hex | `#b91c1c` (red) | Live |
| Social Studies 8 | `/social8/` | inline hex | `#4338ca` (indigo) | Live |
| STEAM (Gr. 5–9) | `/steam/` | inline hex | `#7c3aed` (violet) | Live |
| CEFL 7–9 (Career Education & Financial Literacy) | `/cefl/` | `[data-course='cefl']` in global.css | `#94631a` (ochre) | Live (Grades 7–9). One course with grade pages (`/cefl/grade-N/`) and unit pages (`/cefl/grade-N/<unit>/`); manifest unit slugs carry the grade (`7-income-tax`). Materials in `public/materials/cefl/`, so its viewer reads that folder. Old `/cefl/materials/<unit>` URLs redirect to Grade 7. One parent overview, no per-unit parent guides. |

**Adding a course:** Add a row here, add the slug to the `course` prop type in `BaseLayout.astro`, add it to `courses` and to a subject in `navSubjects` in `src/data/courses.ts`, and add a course card to the home page. Only Grade 6 Science and Math 9 have Tailwind tokens; the newer courses use an inline hex in `Nav.astro`.

---

## Colour System

### Course accent tokens (already in `tailwind.config.mjs`)

```
science-500  #06b6d4   science-600  #0891b2   science-700  #0e7490
math9-500    #6366f1   math9-600    #4f46e5   math9-700    #4338ca
teacher-500  #f59e0b   teacher-600  #d97706   teacher-700  #b45309
```

### How accent colour propagates
- `<BaseLayout>` accepts a `course` prop (`CourseKey` in `src/data/courses.ts`) and sets `data-course` on `<body>`
- `src/styles/global.css` sets `--accent`, `--accent-ink` and `--accent-soft` per `[data-course="…"]`; Tailwind's `accent` colours read them (`bg-accent`, `text-accent-ink`)
- The old `science-*` and `math9-*` tokens remain for older pages
- Site-level pages (home, hubs, 404) have no course accent

### Audience colours
- Teacher view: amber banner (`teacher-500`) and a dark (`slate-900`) nav
- Parent view: sage banner (`parent-100` / `parent-700`); the nav stays light
- Course accents don't change between views; only the banner (and the teacher nav) does

---

## Navigation Architecture

### Two-level nav

Every page has two nav levels:

**Level 1 — Site nav (top bar, always visible)**
- Left: site name → links to home `/`
- Centre: subject menus — `Science` | `Math` | `Social` | `STEAM` | `CEFL` (`navSubjects` in `courses.ts`). Each opens a dropdown of grades: Science → Grade 6, Grade 7; Math → Grade 9; Social → Grade 8, Grade 9; STEAM → Grades 5–9 + All grades (from the course's `gradeMenu`); CEFL → Grades 7–9 + All grades (its `gradeMenu`). The active subject is highlighted with the course accent and shows the current grade (e.g. `Science Gr. 7`). On small screens the menus wrap to a second row.
- Right: the audience switch, `Student · Parent · Teacher` (see below)

**Level 2 — Course subnav (below top bar, visible when inside a course)**
- Grade 6 Science subnav: `Matter | Forces | Living Systems | Climate | Energy | Space | Materials`
- Math 9 subnav: `Number | Algebra | M&G | Stats & Prob | PAT Prep | POTD | All materials`. A strand tab is also active on that strand's topic pages. Parent pages use `parentSubnav`: `Overview | Number | Algebra | M&G | Stats & Prob`
- Science 7, Social 8 and Social 9 subnavs list their units; the STEAM subnav lists Grades 5–9 and the CEFL subnav lists Grades 7–9
- The home page turntable spaces its slots by the number of courses (and widens the ring past six)

### Audience views (student, parent, teacher)
- Every page is written for one audience: `audience` on `BaseLayout` (`'student' | 'parent' | 'teacher'`). Course pages default to `student`; the home page has none.
- Each course in `courses.ts` has a student `path` and may have a `teacherPath` and a `parentPath`. Every course has a `parentPath` and a `parentSubnav`; STEAM has no teacher path.
- The nav switch offers the views the course has. A page can pass `audienceLinks` so the switch lands on the same topic (for example, `/math9/linear-equations` ↔ `/math9/parents/linear-equations` ↔ `/math9/teacher#linear-equations`); otherwise it goes to that view's course landing. Outside a course it goes to the hubs: `/`, `/parents`, `/teachers`.
- In a parent or teacher view, the grade links in the subject menus go to each course's matching view when it has one.
- The chosen view is saved in `localStorage` (`audience`). The home page's "I'm a…" chooser uses it to point turntable links at the matching view.
- Views are separate routes, not a lock. Nothing is hidden from students: every answer key in `public/materials/` is reachable by URL, and student pages keep answer keys in a collapsed section.

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
  course?: CourseKey      — drives accent colour and subnav
  audience?: 'student' | 'parent' | 'teacher'   — banner, nav style, switch state (default: student inside a course)
  audienceLinks?: { student?, parent?, teacher? }   — same-topic pages for the nav switch, below BASE_URL
```

Structure:
```
<html>
  <head> ... </head>
  <body>
    [teacher or parent banner]
    <Nav course={course} audience={audience} audienceLinks={audienceLinks} />   (top bar + course subnav)
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
| Teacher index | BaseLayout, audience="teacher" | Same layout, amber banner |
| Parent page | BaseLayout, audience="parent" | Sage banner; plain-language guide, progression, worked examples, home sheets |

---

## Home Page

**Layout:** intro, an "I'm a… Student / Parent / Teacher" chooser, and the course turntable (`LazySusan.astro`).

- Student keeps the reader on the turntable. Parent goes to `/parents`, Teacher to `/teachers`.
- The choice is remembered, and turntable links then open the matching view of a course when it has one (`data-href-*` attributes on the links).

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
| `Nav` | `Nav.astro` | Top nav bar (site name, course tabs, audience switch) and the per-course subnav |
| `Progression` | `Progression.astro` | "The big picture" strip on parent pages: earlier grades → this year → later courses |
| `UnitCard` | `UnitCard.astro` | Card on course index pages |
| `LessonSection` | `LessonSection.astro` | Section within a lesson page |
| `BaseLayout` | `BaseLayout.astro` | Base layout wrapping all pages |
| `UnitLayout`, `LessonLayout` | `layouts/` | Grade 6 unit and lesson pages; both wrap `BaseLayout` |

---

## Routing Map

```
/                               Home — "I'm a…" chooser and course turntable
/parents/, /teachers/           Site-wide parent and teacher hubs
/materials/                     Grade 6 Science materials index
/materials/[unit]               Unit materials page
/materials/view/[unit]/[doc]    Material viewer
/materials/fr                   Français materials index
/units/[unit]                   Grade 6 "what you will learn" unit page
/units/[unit]/[lesson]          Grade 6 lesson page
/teacher/, /teacher/[unit]      Grade 6 teacher index and unit page
/math9/                         Math 9 index — all 11 topics, grouped by strand
/math9/[topic]                  Student topic page — hook, real-world cards, "Your path" steps, answer keys
/math9/materials/               All Math 9 materials (strand list)
/math9/materials/[strand]       Strand page — topic picker + strand workbook
/math9/potd/, pat-prep/          Problem of the day, PAT prep
/math9/parents/                 Parent overview — course in plain words, progression, topic list
/math9/parents/[topic]          Parent topic page (one per file in src/content/parent-guides/math9/)
/math9/teacher/                 Math 9 teacher index (each topic has an #anchor)
/math9/view/[...slug]           Math 9 material viewer (paths from src/data/math9.ts)
/science7/                      Science 7 index (+ teacher/)
/science7/materials/[unit]      Unit materials page
/science7/view/[unit]/[doc]     Material viewer
/social8/, /social9/            Same shape as Science 7: index, materials/[unit], teacher/, view/[unit]/[doc]
/<course>/practice              Old prereq practice pages (Science 6 and 7, Math 9, Social 8 and 9), now redirects to the course index
/steam/                         STEAM index
/steam/materials/[grade]        Grade page
/steam/view/[grade]/[doc]       Material viewer
/resources/                     More resources — site-level page for extras not tied to a course
/resources/morning-routine      Morning routine — CNN 10 newest episode (uploads playlist) + three reasoning questions; a photo writing prompt (`src/data/morning-routine.ts` `writingPrompts`, images in `public/morning-routine/`); an open-middle math question (`mathQuestions`). Shows one set per school day from a fixed start date (2026-09-01); Previous/Random/Next browse the banks
```

`/resources/` is not a course: no tab in the top nav, no turntable icon, no `CourseKey`. It is linked from the home page, directly below the teacher Google Drive link. Its list is the `resources` array at the top of `src/pages/resources/index.astro`; it shows a "coming soon" card while that array is empty.

---

## Course data and the three views

Every course follows one pattern, so the student, parent and teacher pages look and work the same.

- **Manifest per course** in `src/data/`: `science6.ts`, `math9.ts`, `science7.ts`, `social8.ts`, `social9.ts`, `steam.ts`. Each lists every unit's numbered student path, extra materials, answer keys and two home sheets, in the shared shape in `manifest.ts` (`CourseManifest`; `math9Course` adapts Math 9's richer data). Pages and viewers read it, so a new or renamed file is changed in one place. Each viewer adds the manifest's documents to its routes and warns at build time about files missing from `public/materials/`.
- **Shared components:** `StudentUnit.astro` (student unit page: hook, real-world cards, big idea and "I can" goals, numbered path, extras, collapsed keys, previous/next), `ParentUnit.astro` (parent guide) and `ParentOverview.astro` (parent course overview).
- **Student text:** the unit collections (`units`, `science7-units`, `math9-units`, `social8-units`, `social9-units`, `steam-grades`) hold `hook`, `realWorld` (3), `iCan` (3–4) and a short "What's the big idea?" body. All but STEAM also hold `teacherSummary`, the one-line scope note on the teacher hub.
- **Parent guides:** `src/content/parent-guides/<course>/<unit>.md` (`plainSummary`, `comesFrom`, `assumed`, `leadsTo`, `watchFor`, `tips`; the body holds 2–3 worked examples with "Say:" prompts). Course folders: `science6`, `math9`, `science7`, `social8`, `social9`, `steam`. A guide's page is built only when its file exists.
- **Routes:** student unit pages are `units/[unit]` (Grade 6; old `materials/[unit]` URLs redirect there), `math9/[topic]`, `science7|social8|social9/materials/[unit]` and `steam/materials/[grade]`. Parent pages are `<prefix>/parents/` and `<prefix>/parents/[unit]`, with prefixes `science6`, `math9`, `science7`, `social8`, `social9` and `steam`.
- **Home practice sheets:** sources follow the type-folder convention (`worksheets/grade-6-science/[unit]/`, `worksheets/grade-7-science/[unit]/`, `worksheets/grade-8-social/[unit]/`, `worksheets/grade-9-social/[unit]/`, `worksheets/math-9/home/[topic]/`, and `steam/grade-N/home/`). `scripts/render_home_practice.py` renders them: Math 9 to `public/materials/math-9/home/[topic]/`, the rest flat in `public/materials/` (`sci6-`, `sci7-`, `soc8-`, `soc9-`, `steam-grade-N-` prefixes). Template: `templates/home-practice-template.md`.

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
    practice/                   Sims and the prereq practice pages (math9-<topic>-prereq-practice-v1.html)
    home/[topic]/               Parent home practice sheets + answers
  prereq-practice/              Shared prereq practice engine, styles and one question bank per course
```

Renders live only here. The type folders hold the markdown sources.

Games are the exception: a game is written directly as HTML and has no markdown source. Design, build, and test rules for games are in `_games-context.md`.

**Prereq practice** is HTML-first too. Each unit has `<prefix>-<unit>-prereq-practice-v1.html` (Math 9: `math-9/practice/math9-<topic>-prereq-practice-v1.html`), listed first in the unit's extras under "Get ready" (`getReady()` in `manifest.ts`) and linked from the parent guide's "What your child should already know". The page only names its unit; the questions live in `prereq-practice/<prefix>-bank.js` and the engine in `prereq-practice/practice.js` (its header describes the question format). Science 6, Science 7 and Social 8/9 banks are written-out questions; the Math 9 bank generates questions in code (and draws SVG diagrams). Science 7's questions check Grade 6 ideas only, kept simple (each unit's "assumed" list in its parent guide); Grade 7 content belongs in the units. Every science question shows a small diagram under it: `prereq-practice/sci-visuals.js` draws them (loaded by the 11 science pages before the bank), a skill's `visual` covers all its questions unless a question has its own, and a diagram shows the situation, never the answer. Students answer one question per skill with a hint and an explanation; the skill tracker is saved in the browser; printing (the page's button or the viewer's Print) gives a 10-question sheet with an answer key.

### Naming
- Student notes: `math9-[unit]-notes-v1.html`
- Answer key: `math9-[unit]-notes-answers-v1.html`
- Teacher notes: `math9-[unit]-teachernotes-v2.html`
- Worksheet: `math9-[unit]-worksheet-[tier]-v1.html`
- Home practice sheet: `math9-[topic]-home-[skill]-v1.html`, answers `math9-[topic]-home-[skill]-answers-v1.html` (named by topic slug, e.g. `powers-exponents`, not the `math9-powers` file stem). Other courses: `[prefix]-[unit]-home-[skill]-v1.html` in `public/materials/`, e.g. `sci7-heat-temperature-home-heat-transfer-v1.html`

---

## Rules That Apply Everywhere

1. **One BaseLayout** — no course gets its own separate layout file. Use the `course` prop.
2. **No inline styles** — use Tailwind classes or `@apply` in global CSS. Exception: SVG diagram attributes (geometry only).
3. **One accent per course** — use the hex in the Courses table. New components take the accent from the `course` prop and do not introduce a new colour.
4. **Teacher content sits behind the teacher routes** — a page should never show teacher content without the amber banner active.
5. **Write for the page's audience.** Student pages: short, fun, real-world, next step obvious. Parent pages: plain words, no unexplained jargon. Teacher pages: brief scope notes.
5. **Every material page has a print button** — materials are designed to be printed; the viewer must expose this.
6. **Mobile-first nav** — subnav collapses to a horizontal scroll on small screens (already implemented in Nav.astro; carry this pattern forward).
7. **Footer is consistent** — `[Course] · Alberta Curriculum 2023 · Built for learning`, set by `footerCourse` in `BaseLayout.astro` ("Classroom Materials" on site-level pages).
