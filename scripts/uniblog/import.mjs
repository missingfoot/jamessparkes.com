// scripts/uniblog/import.mjs
//
// One-off import of the 2011–2013 WordPress uni blog from a saved copy of its
// homepage. Writes src/content/blog/<date>-<slug>.md and copies images into
// src/assets/blog/. The generated files are the source of truth afterwards.
//
// Usage: node scripts/uniblog/import.mjs <path-to-uniblog-og>
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parsePosts, safeImageName, toMarkdown } from './lib.mjs';

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/uniblog/import.mjs <path-to-uniblog-og>');
  process.exit(1);
}
const root = resolve(import.meta.dirname, '../..');
const contentDir = join(root, 'src/content/blog');
const assetDir = join(root, 'src/assets/blog');
mkdirSync(contentDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });

const posts = parsePosts(readFileSync(join(src, 'index.html'), 'utf8'));
const entryId = (p) => `${p.date}-${p.slug}`;
const postSlugByUrl = new Map(posts.map((p) => [p.originalUrl, entryId(p)]));

const taken = new Set();
const copied = new Map(); // source path -> output name
let missing = 0;
let videos = 0;

const imageFor = (imgSrc) => {
  const local = decodeURIComponent(imgSrc).replace(/^\.\//, '');
  const from = join(src, local);
  if (!local.startsWith('James Sparkes_files/') || !existsSync(from)) {
    console.warn(`  missing image: ${imgSrc}`);
    missing++;
    return '';
  }
  if (!copied.has(from)) {
    const name = safeImageName(local, taken);
    copyFileSync(from, join(assetDir, name));
    copied.set(from, name);
  }
  return `../../assets/blog/${copied.get(from)}`;
};

for (const p of posts) {
  const body = toMarkdown(p.bodyHtml, { imageFor, postSlugByUrl });
  videos += (body.match(/class="video-embed"/g) || []).length;
  const fm = [
    '---',
    `title: ${JSON.stringify(p.title)}`,
    `date: ${p.date}`,
    `categories: ${JSON.stringify(p.categories)}`,
    `tags: ${JSON.stringify(p.tags)}`,
    `originalUrl: ${JSON.stringify(p.originalUrl)}`,
    '---',
    '',
  ].join('\n');
  writeFileSync(join(contentDir, `${entryId(p)}.md`), `${fm}${body.trim()}\n`);
}

console.log(`posts: ${posts.length}, images: ${copied.size}, videos: ${videos}, missing images: ${missing}`);
