---
name: workspace-audit
description: Audit the Classroom Tools repo for file-structure drift and bloat. Checks naming, folder placement, stale or broken context references, superseded versions, duplicate and diverged copies, build byproducts, and the size of always-read context files. Report-only by default. Run it regularly (weekly, or after a big build session) or when the user asks to tidy, clean up, or check the workspace structure.
---

# workspace-audit

Compare what is on disk against the rules in `CLAUDE.md` and `_status.md`, and report where the workspace has drifted or grown. The script is read-only. Nothing is moved, renamed, or deleted until the user approves it.

## Fast path

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ".claude/skills/workspace-audit/scripts/audit.ps1"
```

Add `-Detail` to list every finding instead of the first 10 per check. Exit 0 = no drift. Exit 1 = drift found. Bloat and info never fail the run.

The script is PowerShell because this machine has no Python or Node on the PATH.

---

## What it checks

### Drift: a rule in CLAUDE.md or _status.md is broken

| Code | What triggers it |
|---|---|
| `NAME_PATTERN` | Filename is not `[subject]-[unit]-[type]-v[N].ext`, lowercase, version last |
| `PREFIX_MISMATCH` | Prefix does not match the folder (`sci7-` file inside `grade-6-science/`) |
| `DIR_CASE` | Folder name has capitals or spaces |
| `NO_UNIT_FOLDER` | Material sits at `[type]/[subject]/` with no unit folder |
| `SOURCE_IN_PUBLIC` | `.md` or `.tex` inside `public/materials/` |
| `SCRIPT_IN_MATERIALS` | Script inside a materials folder instead of `scripts/` |
| `RENDER_BESIDE_SOURCE` | HTML or PDF render outside `public/materials/`, counted per subject folder. Posters, tests, and question banks are exempt: tests must not be deployed to the student-facing site. |
| `ROOT_STRAY` | File at the repo root that is not on the allowed list |
| `DIVERGED_COPY` | Same filename in two places with different content |
| `BROKEN_REF` | A context file names a full path that does not exist |
| `MISSING_CONTEXT` | A type folder, course folder, or subject has no `_context.md` |
| `STALE_STATUS` | `_status.md` is more than 14 days behind the latest materials commit |

### Bloat: nothing is broken, but it can be trimmed

| Code | What triggers it |
|---|---|
| `SUPERSEDED_VERSION` | An older `-v[N]` beside a newer one. Marked `STILL REFERENCED` when `src/` or `scripts/` names it. |
| `IDENTICAL_COPY` | Same filename in two places with identical content |
| `BYPRODUCT` | `.aux`, `.log`, `.out` and similar on disk (already gitignored) |
| `EMPTY_DIR` | Empty folder |
| `LARGE_FILE` | Tracked file over 2 MB |
| `CONTEXT_SIZE` | An always-read file (`CLAUDE.md`, `_status.md`, `_meta-context.md`) or any context file over its line budget |

### Info

| Code | What triggers it |
|---|---|
| `UNTRACKED` | File that is neither committed nor ignored |
| `UNBUILT_REF` | A context file names a bare filename that exists nowhere |

---

## Workflow

1. **Run the script** and read the whole output. Use `-Detail` when a check is truncated and the hidden rows matter.
2. **Triage before reporting.** The script matches patterns, so judge each finding:
   - `UNBUILT_REF` is mostly planned materials in a course context's suite table, or naming examples in `CLAUDE.md`. Only raise the ones that look like a renamed or deleted file.
   - `SUPERSEDED_VERSION` marked `STILL REFERENCED` is live on the site. Do not propose removing it until the link in `src/` is repointed.
   - `DIVERGED_COPY` needs a look at both files to say which is current. Do not guess from the path.
   - `RENDER_BESIDE_SOURCE` that says "do not exist in public/materials" may be the only copy of that render.
3. **Report to the user** in three groups, shortest first: *fix now* (clear rule breaks with one obvious fix), *needs your decision* (anything with a judgement call), *leave as is* (accepted exceptions, with the reason). Give counts and the proposed action for each group, not a dump of the raw output.
4. **Stop and wait for approval.** State exactly which moves, renames, and deletions are proposed.
5. **Apply approved fixes only:**
   - Move and rename with `git mv` so history follows the file.
   - After a rename, update every reference in `src/`, `scripts/`, and the context files in the same change.
   - Old versions are archived or deleted only on the user's say. Git history keeps deleted files.
   - Never `git add` anything under a path in `.gitignore`. The repo is public and students can read it.
   - `BYPRODUCT` files are the one category safe to delete once the user approves the batch.
6. **Re-run** and confirm the fixed findings are gone. Report what is left.
7. If a fix changed where things live, update `_status.md` and the routing tables in `CLAUDE.md` to match.

Do not write the report to a file unless the user asks for one.

---

## Accepting an exception

When the user decides a finding is fine as it is, record it in the config block at the top of `scripts/audit.ps1` so it stops reappearing:

| To accept... | Edit |
|---|---|
| A new subject folder and its prefix | `$PrefixMap` |
| A file that belongs at the repo root | `$RootFiles` |
| A file with no version number | `$NameAllow` |
| A larger always-read file | `$AlwaysRead` (line budget per file) or `$AlwaysReadBytes` |
| A new top-level materials folder | `$MaterialRoots` / `$ContextRoots` |

Raise a size budget only when the user chooses to. The point of the budget is to make growth a decision.

---

## Running it regularly

- On demand: `/workspace-audit`
- A good rhythm is once a week, and after any session that built or re-rendered a full unit.
- Scheduled cloud runs (`/schedule`) work on the committed repo only. They cannot see untracked files, gitignored material, or byproducts on this machine, so a local run is the complete one.

## Reference

- `CLAUDE.md` — naming table and folder structure the checks are built from
- `_status.md` → "Where files go" — the renders-only rule for `public/materials/`
- `.gitignore` — what must never be committed
