// The site search index (/search-index.json), read by the Search component.
// Built from the course manifests, unit text and notes; see src/data/search.ts.
import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../data/search';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildSearchIndex()), {
    headers: { 'Content-Type': 'application/json' },
  });
