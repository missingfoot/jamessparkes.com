// scripts/uniblog/check-links.mjs
//
// Checks every external link and video in the uni blog posts and writes the dead
// ones to src/data/blog-dead-links.json. On the dev server the /blog/ page reads
// that file to show a "Needs fixing" filter and mark dead links in red.
//
// Usage: npm run blog:check-links   (re-run after fixing links to refresh the list)
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { classifyLink, extractLinks } from './links.mjs';

const root = resolve(import.meta.dirname, '../..');
const contentDir = join(root, 'src/content/blog');
const outFile = join(root, 'src/data/blog-dead-links.json');
const UA = 'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0';

const urls = new Set();
for (const f of readdirSync(contentDir).filter((f) => f.endsWith('.md'))) {
  for (const u of extractLinks(readFileSync(join(contentDir, f), 'utf8'))) urls.add(u);
}

// Videos are checked through the providers' oEmbed endpoints, which say whether they still play
function oembedFor(url) {
  if (/youtube\.com\/watch|youtu\.be\//.test(url)) return `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;
  if (/^https:\/\/vimeo\.com\/\d+/.test(url)) return `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
  return null;
}

async function check(url) {
  const oembed = oembedFor(url);
  try {
    const res = await fetch(oembed ?? url, {
      redirect: 'follow',
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(20000),
    });
    if (oembed) return res.ok ? null : `Video unavailable (${res.status})`;
    return classifyLink({ status: res.status, url, finalUrl: res.url });
  } catch (err) {
    return classifyLink({ error: err.cause?.code ?? err.name, url });
  }
}

const list = [...urls];
const dead = {};
let next = 0;
await Promise.all(
  Array.from({ length: 12 }, async () => {
    while (next < list.length) {
      const url = list[next++];
      const reason = await check(url);
      if (reason) dead[url] = reason;
    }
  })
);

const sorted = Object.fromEntries(Object.entries(dead).sort(([a], [b]) => a.localeCompare(b)));
mkdirSync(join(root, 'src/data'), { recursive: true });
writeFileSync(outFile, `${JSON.stringify({ checkedAt: new Date().toISOString().slice(0, 10), dead: sorted }, null, 2)}\n`);
console.log(`checked: ${list.length}, dead: ${Object.keys(sorted).length} → src/data/blog-dead-links.json`);
