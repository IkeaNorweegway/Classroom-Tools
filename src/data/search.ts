// Site search index, built at build time by src/pages/search-index.json.ts.
// It reads what the site already has: each course's manifest (links), the
// unit and parent-guide collections (words to match on), and each unit's
// student notes HTML in public/materials/ (section titles and vocabulary).
// Answer keys and teacher files are never indexed.

import { getCollection } from 'astro:content';
import { existsSync, readFileSync } from 'node:fs';
import type { CourseKey } from './courses';
import type { CourseManifest, CourseUnit, Doc } from './manifest';
import { science6 } from './science6';
import { science7 } from './science7';
import { math8Course } from './math8';
import { math9Course } from './math9';
import { social7 } from './social7';
import { social8 } from './social8';
import { social9 } from './social9';
import { steamUnits, splitSteamSlug } from './steam';
import { cefl, splitSlug } from './cefl';
import { ela5, ela5Folder } from './ela5';

export interface SearchEntry {
  kind: 'unit' | 'concept' | 'activity';
  label: string;
  course: CourseKey;
  courseName: string;
  unitLabel: string;
  /** Where in the unit it lives, e.g. "Notes · Section 2: Earth's Climate Systems". */
  where?: string;
  /** Extra words to match on (units only), lowercased and de-duplicated. */
  text?: string;
  /** Hrefs below BASE_URL. */
  student: string;
  parent?: string;
  view?: string;
}

interface Source {
  manifest: CourseManifest;
  /** Content collection with the unit's student text. */
  collection: string;
  /** Collection entry slug for a manifest unit slug. */
  entry: (slug: string) => string;
  /** Parent guide slug in parent-guides/, or null when the course has one overview for all units. */
  guide: ((slug: string) => string) | null;
  /** Folder below public/materials/ ('' for flat). */
  folder: string;
  courseName: (slug: string) => string;
}

const same = (prefix: string) => (slug: string) => `${prefix}${slug}`;
const fixed = (name: string) => () => name;

const sources: Source[] = [
  { manifest: ela5, collection: 'ela5-units', entry: same(''), guide: same('ela5/'), folder: `${ela5Folder}/`, courseName: fixed('Grade 5 ELA') },
  { manifest: science6, collection: 'units', entry: same(''), guide: same('science6/'), folder: '', courseName: fixed('Grade 6 Science') },
  { manifest: science7, collection: 'science7-units', entry: same(''), guide: same('science7/'), folder: '', courseName: fixed('Grade 7 Science') },
  { manifest: math8Course, collection: 'math8-units', entry: same(''), guide: same('math8/'), folder: 'math-8/', courseName: fixed('Math 8') },
  { manifest: math9Course, collection: 'math9-units', entry: same(''), guide: same('math9/'), folder: 'math-9/', courseName: fixed('Math 9') },
  { manifest: social7, collection: 'social7-units', entry: same(''), guide: same('social7/'), folder: '', courseName: fixed('Social Studies 7') },
  { manifest: social8, collection: 'social8-units', entry: same(''), guide: same('social8/'), folder: '', courseName: fixed('Social Studies 8') },
  { manifest: social9, collection: 'social9-units', entry: same(''), guide: same('social9/'), folder: '', courseName: fixed('Social Studies 9') },
  {
    manifest: steamUnits,
    collection: 'steam-units',
    entry: (s) => { const { grade, unit } = splitSteamSlug(s); return `grade-${grade}/${unit}`; },
    guide: (s) => `steam/grade-${splitSteamSlug(s).grade}`,
    folder: '',
    courseName: (s) => `Grade ${splitSteamSlug(s).grade} STEAM`,
  },
  {
    manifest: cefl,
    collection: 'cefl-units',
    entry: (s) => { const { grade, unit } = splitSlug(s); return `grade-${grade}/${unit}`; },
    guide: null,
    folder: 'cefl/',
    courseName: (s) => `CEFL ${splitSlug(s).grade}`,
  },
];

/** Lowercase, no accents, letters and digits only. The client uses the same rule. */
export const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const entities: Record<string, string> = { amp: '&', nbsp: ' ', quot: '"', apos: "'", lt: '<', gt: '>', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', hellip: '…', middot: '·', times: '×', deg: '°' };
const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => entities[n.toLowerCase()] ?? m);

const cleanText = (html: string) => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

// Headings that are page furniture, not concepts.
const skipHeading = /synthesis|pre-?knowledge|self-?assess|rubric|before we start|put it all together|look back|wrap-?up|bringing it together|^(self-)?reflection$|exit ticket|checklist|answer key|^name\b|^notes$|guided notes|learning target|success criteria|^vocabulary$|words to know|new words|key words|key terms/i;
// Headings that introduce a vocabulary table.
const vocabHeading = /vocabulary|words to know|new words|key words|key terms/i;

/** Drop "Section 2:", "Part 1 —", "Moment 3", "4 ·" style prefixes. */
const stripNumber = (s: string) =>
  s.replace(/^(section|part|moment|lesson|unit|step|concept)\s*\d+\s*[:·.—–-]?\s*/i, '').replace(/^\d+\s*[·.:)—–-]\s*/, '').trim();

/** Section titles and vocabulary terms from one notes file, in page order. */
export function notesConcepts(html: string): { label: string; section?: string; vocab: boolean }[] {
  const out: { label: string; section?: string; vocab: boolean }[] = [];
  let section: string | undefined;
  let vocabNext = false;
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/gi, '');
  for (const m of body.matchAll(/<(h2|h3)\b[^>]*>([\s\S]*?)<\/\1>|<table\b[\s\S]*?<\/table>/gi)) {
    if (m[1]) {
      const text = cleanText(m[2]);
      vocabNext = vocabHeading.test(text);
      if (m[1].toLowerCase() === 'h2') {
        const title = stripNumber(text);
        if (!vocabNext && title.length >= 3 && title.length <= 80 && !skipHeading.test(title)) {
          section = title;
          out.push({ label: title, vocab: false });
        }
      }
      continue;
    }
    if (!vocabNext) continue;
    vocabNext = false;
    const rows = m[0].replace(/<thead[\s\S]*?<\/thead>/i, '').match(/<tr\b[\s\S]*?<\/tr>/gi) ?? [];
    for (const row of rows) {
      const cell = row.match(/<td\b[^>]*>([\s\S]*?)<\/td>/i);
      const term = cell ? cleanText(cell[1]) : '';
      if (term.length >= 2 && term.length <= 60 && !/^(terms?|words?)$/i.test(term)) out.push({ label: term, section, vocab: true });
    }
  }
  return out;
}

const isPrivate = (d: Doc) => /answers|teacher/.test(d.doc);
const allItems = (u: CourseUnit) => [...u.path.flatMap((s) => s.items), ...u.extras.flatMap((g) => g.items)];

/** Words from a unit's student and parent text, for matching only. */
function wordsOf(parts: (string | undefined)[]): string {
  const words = new Set(normalize(parts.filter(Boolean).join(' ').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')).split(' '));
  return [...words].filter((w) => w.length >= 3).join(' ');
}

export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const guides = new Map((await getCollection('parent-guides')).map((g) => [g.slug, g]));
  const entries: SearchEntry[] = [];

  for (const src of sources) {
    const { manifest: m } = src;
    const collection = new Map(
      (await getCollection(src.collection as 'units')).map((e) => [e.slug as string, e]),
    );

    for (const u of m.units) {
      const entry = collection.get(src.entry(u.slug));
      if (!entry) continue; // no student page for this unit
      const data = entry.data as Record<string, any>;
      const courseName = src.courseName(u.slug);
      const unitLabel = data.title ?? u.label;
      const student = m.studentHref(u.slug);
      const guide = src.guide ? guides.get(src.guide(u.slug)) : undefined;
      const parent = src.guide ? (guide ? m.parentHref(u.slug) : undefined) : m.parentHref(u.slug);
      const base = { course: m.course, courseName, unitLabel, student, parent };

      entries.push({
        ...base,
        kind: 'unit',
        label: unitLabel,
        text: wordsOf([
          u.label, data.hook, data.guidingQuestion, data.topics, data.genre,
          ...(data.iCan ?? []), ...(data.realWorld ?? []).map((r: any) => `${r.title} ${r.blurb}`),
          entry.body,
          guide?.data.plainSummary, ...(guide?.data.watchFor ?? []),
        ]),
      });

      // Concepts from the student notes (CEFL has none, so its mini-workbook).
      const items = allItems(u).filter((d) => !d.href && !isPrivate(d));
      const pathItems = u.path.flatMap((s) => s.items).filter((d) => !d.href && !isPrivate(d));
      let conceptDocs = pathItems.filter((d) => d.type === 'notes');
      if (!conceptDocs.length) conceptDocs = pathItems.filter((d) => d.type === 'workbook');
      const seen = new Set<string>([normalize(unitLabel)]);
      for (const d of conceptDocs) {
        const file = `public/materials/${src.folder}${d.doc}.html`;
        if (!existsSync(file)) {
          console.warn(`[search] missing notes: ${file}`);
          continue;
        }
        const view = m.viewHref(u.slug, d.doc);
        for (const c of notesConcepts(readFileSync(file, 'utf8'))) {
          const key = normalize(c.label);
          if (!key || seen.has(key)) continue;
          seen.add(key);
          entries.push({
            ...base,
            kind: 'concept',
            label: c.label,
            where: c.vocab && c.section ? `${d.label} · ${c.section}` : d.label,
            view,
          });
        }
      }

      // Sims, games, trainers and prereq practice.
      for (const d of items.filter((i) => i.type === 'interactive')) {
        const prereq = d.doc.includes('-prereq-practice-');
        entries.push({
          ...base,
          kind: 'activity',
          label: prereq ? `Prereq Practice: ${unitLabel}` : d.label.replace(/\s*\(one chapter after each step\)/i, ''),
          where: prereq ? 'The skills you need first' : d.badge ?? 'Interactive',
          view: m.viewHref(u.slug, d.doc),
        });
      }
    }
  }
  return entries;
}
