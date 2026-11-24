// src/lib/blog-filter.ts
// Search and category filtering for the /blog/ page. Plain functions so they
// run in the browser and under `node --test` (erasable TS syntax only).

export interface FilterState {
  q: string;
  cat: string | null;
}

export function slugify(s: string): string {
  return normalize(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function normalize(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/** `post.text` must already be normalized. */
export function matches(post: { text: string; categorySlugs: string[] }, q: string, cat: string | null): boolean {
  if (cat && !post.categorySlugs.includes(cat)) return false;
  return normalize(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => post.text.includes(term));
}

export function readState(search: string, knownCats: string[]): FilterState {
  const params = new URLSearchParams(search);
  const cat = params.get('cat');
  return { q: params.get('q') ?? '', cat: cat && knownCats.includes(cat) ? cat : null };
}

export function writeState(state: FilterState): string {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.cat) params.set('cat', state.cat);
  const s = params.toString();
  return s ? `?${s}` : '';
}
