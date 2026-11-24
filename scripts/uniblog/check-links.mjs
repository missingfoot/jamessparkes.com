// scripts/uniblog/check-links.mjs
//
// Checks every external link and video in the uni blog posts and writes the dead
// ones to src/data/blog-dead-links.json. On the dev server the /blog/ page reads
// that file to show a "Needs fixing" filter and mark dead links in red.
//
// Usage: npm run blog:check-links   (re-run after fixing links to refresh the list)
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { classifyLink, extractLinks, isInconclusive, mergeDead } from './links.mjs';
import { existsSync } from 'node:fs';

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Sites like deviantART answer 403/429 when hit quickly; back off and retry before giving up
async function fetchPolitely(url) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(20000),
    });
    if (![403, 429].includes(res.status) || attempt === 2) return res;
    await sleep(3000 * (attempt + 1));
  }
}

async function check(url) {
  const oembed = oembedFor(url);
  try {
    const res = await fetchPolitely(oembed ?? url);
    if (oembed) return res.ok ? { ok: true } : { dead: `Video unavailable (${res.status})` };
    if (isInconclusive({ status: res.status })) return { unknown: true };
    // The page title shows whether a domain is now parked or for sale
    const html = /html/.test(res.headers.get('content-type') ?? '') ? await res.text() : '';
    const title = html.match(/<title[^>]*>([^<]*)/i)?.[1]?.trim() ?? '';
    const reason = classifyLink({ status: res.status, url, finalUrl: res.url, title });
    return reason ? { dead: reason } : { ok: true };
  } catch (err) {
    const error = err.cause?.code ?? err.name;
    if (isInconclusive({ error })) return { unknown: true };
    return { dead: classifyLink({ error, url }) };
  }
}

// One request at a time per site (deviantART subdomains count as one site), 12 sites at once
const siteOf = (url) => new URL(url).hostname.split('.').slice(-2).join('.');
const bySite = new Map();
for (const url of urls) bySite.set(siteOf(url), [...(bySite.get(siteOf(url)) ?? []), url]);
const sites = [...bySite.values()];
const results = new Map();
let next = 0;
await Promise.all(
  Array.from({ length: 12 }, async () => {
    while (next < sites.length) {
      for (const url of sites[next++]) {
        results.set(url, await check(url));
        await sleep(500);
      }
    }
  })
);
const list = [...urls];
const previous = existsSync(outFile) ? JSON.parse(readFileSync(outFile, 'utf8')).dead : {};
const dead = mergeDead(previous, results);

const sorted = Object.fromEntries(Object.entries(dead).sort(([a], [b]) => a.localeCompare(b)));
mkdirSync(join(root, 'src/data'), { recursive: true });
writeFileSync(outFile, `${JSON.stringify({ checkedAt: new Date().toISOString().slice(0, 10), dead: sorted }, null, 2)}\n`);
console.log(`checked: ${list.length}, dead: ${Object.keys(sorted).length} → src/data/blog-dead-links.json`);
