// The shape every course's materials manifest shares, so the student unit
// page, the parent guide and the viewers can be one set of components.
// Each course fills it in its own file (math9.ts, science6.ts, science7.ts,
// social8.ts, social9.ts, steam.ts).

import type { CourseKey } from './courses';
import type { MaterialType } from './materialTypes';

/** One openable document. `doc` is the viewer's file name (no .html). */
export interface Doc {
  label: string;
  doc: string;
  badge?: string;
  type?: MaterialType;
  /** A page link instead of a viewer document (e.g. a lesson page). */
  href?: string;
}

/** One numbered step on a student page: a single material, or a project
 *  with several (STEAM). */
export interface PathStep {
  title?: string;
  hint?: string;
  items: Doc[];
}

export interface HomeSheet {
  skill: string;
  doc: string;
  keyDoc: string;
}

export interface CourseUnit {
  slug: string;
  label: string;
  path: PathStep[];
  extras: { heading: string; items: Doc[] }[];
  keys: Doc[];
  /** The teacher guide's viewer document, when the course has one. */
  teacherGuide?: string;
  /** Two short at-home sheets per unit for the parent page. */
  home: HomeSheet[];
}

export interface CourseManifest {
  course: CourseKey;
  /** What a unit is called on this course's pages: unit, topic or grade. */
  noun: string;
  units: CourseUnit[];
  /** Routes below BASE_URL. */
  studentHref: (slug: string) => string;
  parentHref: (slug: string) => string;
  teacherHref?: (slug: string) => string;
  viewHref: (slug: string, doc: string) => string;
}

/** Home sheets named <prefix>-<unit>-home-<name>-v1 (and -answers-v1), the
 *  flat naming the non-Math courses use in public/materials/. */
export function homeSheets(prefix: string, unit: string, sheets: [string, string][]): HomeSheet[] {
  return sheets.map(([name, skill]) => ({
    skill,
    doc: `${prefix}-${unit}-home-${name}-v1`,
    keyDoc: `${prefix}-${unit}-home-${name}-answers-v1`,
  }));
}

/** Every document a unit's pages link to, for the viewers' route lists. */
export function unitDocs(u: CourseUnit): string[] {
  const docs = [
    ...u.path.flatMap((s) => s.items),
    ...u.extras.flatMap((g) => g.items),
    ...u.keys,
  ].filter((d) => !d.href).map((d) => d.doc);
  return [...docs, ...u.home.flatMap((h) => [h.doc, h.keyDoc])];
}

export const neighbours = <T>(list: T[], i: number) => ({ prev: list[i - 1], next: list[i + 1] });

/** Student-facing files in a course: every unit's path, extras and answer keys.
 *  Page links (e.g. a lesson page) are not files, so they are left out. */
export function materialCount(units: CourseUnit[]): number {
  return units.reduce(
    (n, u) => n + [...u.path.flatMap((s) => s.items), ...u.extras.flatMap((g) => g.items), ...u.keys].filter((d) => !d.href).length,
    0,
  );
}

/** Sum the "5–6" style week ranges of several units into one range. */
export function weeksRange(ranges: string[]): string {
  let lo = 0;
  let hi = 0;
  for (const r of ranges) {
    const [a, b] = r.split('–').map(Number);
    lo += a;
    hi += b ?? a;
  }
  return lo === hi ? `${lo}` : `${lo}–${hi}`;
}
