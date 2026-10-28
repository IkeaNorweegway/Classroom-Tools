# Building the site at home

How to build and preview the site on a computer that isn't the work machine (which has no Node).

## One-time setup

1. Install Node LTS (20 or 22) from nodejs.org. It includes `npm`. GitHub builds with Node 20.
2. Get the repo, if this computer doesn't have it yet:
   `git clone https://github.com/IkeaNorweegway/Classroom-Tools`

## Build and preview

In a terminal, in the project folder:

```
git fetch
git checkout <branch>
npm ci
npm run build
npm run preview
```

- `npm ci` installs the site's packages. Needed the first time, and again whenever `package-lock.json` changes.
- `npm run build` is the check. If it ends without red errors, the code works.
- `npm run preview` serves the built site at `http://localhost:4321/Classroom-Tools/`. Press Ctrl+C to stop it.

The site only rebuilds when master changes. Pushing to any other branch publishes nothing.

## If the build passes

Merge the branch into master and push. GitHub builds again and publishes. If that build fails, nothing deploys and the live site stays as it is.

```
git checkout master
git pull
git merge <branch>
git push
```

## Checking the `section-ids` branch (2026-10-28)

Branch: `section-ids`. It adds section ids to every notes package and adds a "Jump to a part of the notes" list to the parent guides.

1. Build and preview as above, with `<branch>` = `section-ids`.
2. Open `http://localhost:4321/Classroom-Tools/math8/parents/integers/`.
3. Scroll to "What your child is using in class". Under the materials there should be a box called "Jump to a part of the notes" with 4 sections.
4. Click "Sign rules". The notes should open at Section 2, not at the top.
5. Try one more course, e.g. `http://localhost:4321/Classroom-Tools/science6/parents/forces/` (5 sections).

If the box is missing or a link opens at the top, the code is in `src/components/ParentUnit.astro`, `src/data/notesSections.ts` and the viewer pages in `src/pages/*/view/`.
