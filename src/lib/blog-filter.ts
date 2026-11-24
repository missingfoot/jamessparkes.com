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
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase();
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

/** Newest first; posts from the same day keep the old blog's order (`order` ascending). */
export function byNewest(a: { date: Date; order: number }, b: { date: Date; order: number }): number {
  return b.date.valueOf() - a.date.valueOf() || a.order - b.order;
}

/** Same-length folding (case and quote style) so match positions map straight back onto the text. */
const fold = (s: string) => s.toLowerCase().replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"');

/** [start, end) ranges in `text` where any search term occurs, sorted and merged. */
export function findRanges(text: string, q: string): [number, number][] {
  const terms = fold(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const hay = fold(text);
  const found: [number, number][] = [];
  for (const term of terms) {
    for (let i = hay.indexOf(term); i !== -1; i = hay.indexOf(term, i + 1)) found.push([i, i + term.length]);
  }
  found.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const r of found) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([r[0], r[1]]);
  }
  return merged;
}
