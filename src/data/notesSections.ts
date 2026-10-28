// The numbered sections of a notes package, read from its HTML at build time.
// scripts/add_section_ids.py (and the Perl renderers) give each section heading
// an id: "s3" for "Section 3", "u3" for "Unit 3" in the Grade 6 year notes.
// A page links to one section with the viewer URL plus "#s3".

import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

export interface NotesSection { id: string; num: number; title: string }

let files: Map<string, string> | undefined;

/** Every notes HTML file under public/materials, by name without .html. */
function notesFiles(): Map<string, string> {
  if (files) return files;
  files = new Map();
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html') && e.name.includes('notes')) files!.set(e.name.slice(0, -5), p);
    }
  };
  walk(join('public', 'materials'));
  return files;
}

const entities: Record<string, string> = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", rsquo: '’', lsquo: '‘', mdash: '—', ndash: '–', middot: '·' };
const decode = (s: string) =>
  s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e: string) =>
    e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : entities[e.toLowerCase()] ?? m);

/** Sections of the notes document `doc` (a viewer doc name, folders allowed), in order. */
export function notesSections(doc: string): NotesSection[] {
  const path = notesFiles().get(basename(doc));
  if (!path) return [];
  const html = readFileSync(path, 'utf8');
  const out: NotesSection[] = [];
  for (const m of html.matchAll(/<h2 id="([su](\d+))"[^>]*>([\s\S]*?)<\/h2>/g)) {
    const text = decode(m[3].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    // Drop the "Section 3:" / "Unit 3 —" / "3 ·" label; the number is shown separately.
    const title = text.replace(/^(?:(?:Section|Concept|Part|Unit|Unité)\s+)?\d+\s*[:—–·.-]?\s*/i, '');
    out.push({ id: m[1], num: Number(m[2]), title: title || text });
  }
  return out;
}
