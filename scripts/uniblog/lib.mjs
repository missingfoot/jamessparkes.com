// scripts/uniblog/lib.mjs
//
// Pure helpers for the one-off uni blog import (see import.mjs). They parse the
// saved WordPress homepage and convert each post's HTML to Markdown.
import { load } from 'cheerio';
import TurndownService from 'turndown';

const CATEGORY_NAMES = {
  photomanipulation: 'Photo Manipulation',
  graphicdesign: 'Graphic Design',
  '3dgraphics': '3D Graphics',
  'major-practical-project': 'Major Practical Project',
  layout: 'Layout',
  inspiration: 'Inspiration',
  designpractice: 'Design Practice',
  professionalpractice: 'Professional Practice',
  creativecontexts: 'Creative Contexts',
  type: 'Type',
  'contemporary-graphic-design': 'Contemporary Graphic Design',
};
const DROPPED_TAGS = new Set(['inspirationtag', '3dtag']);
const PERMALINK = /^https?:\/\/(?:www\.)?jamessparkes\.com\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/;

export function parsePosts(html) {
  const $ = load(html);
  return $('div.post[id^="post-"]')
    .toArray()
    .map((el) => {
      const $el = $(el);
      const classes = ($el.attr('class') || '').split(/\s+/);
      const link = $el.find('.entry-title a').first();
      const originalUrl = link.attr('href');
      const m = originalUrl?.match(PERMALINK);
      if (!m) throw new Error(`Unexpected permalink for ${$el.attr('id')}: ${originalUrl}`);
      const categorySlugs = classes
        .filter((c) => c.startsWith('category-'))
        .map((c) => c.slice('category-'.length))
        .filter((c) => c in CATEGORY_NAMES);
      const tags = classes
        .filter((c) => c.startsWith('tag-'))
        .map((c) => c.slice('tag-'.length).replace(/-\d+$/, ''))
        .filter((t, i, all) => !DROPPED_TAGS.has(t) && all.indexOf(t) === i)
        .map((t) => t.replace(/-/g, ' '));
      return {
        id: $el.attr('id'),
        title: link.text().trim(),
        date: `${m[1]}-${m[2]}-${m[3]}`,
        slug: m[4],
        categories: categorySlugs.map((c) => CATEGORY_NAMES[c]),
        categorySlugs,
        tags,
        originalUrl,
        bodyHtml: ($el.find('.entry-content').first().html() || '').trim(),
      };
    });
}

export function safeImageName(srcFile, taken) {
  const base = srcFile.split('/').pop();
  const dot = base.lastIndexOf('.');
  const ext = base.slice(dot + 1).toLowerCase();
  const stem =
    base
      .slice(0, dot)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'image';
  let name = `${stem}.${ext}`;
  for (let n = 2; taken.has(name); n++) name = `${stem}-${n}.${ext}`;
  taken.add(name);
  return name;
}

export function videoFromEmbed(src) {
  if (!src) return null;
  const yt = src.match(/youtube(?:-nocookie)?\.com\/(?:v|embed)\/([\w-]{11})/);
  if (yt) return { provider: 'youtube', id: yt[1] };
  const file = src.split('/').pop().replace(/\.html?$/, '').split('?')[0];
  if (/^\d{6,}$/.test(file)) return { provider: 'vimeo', id: file };
  if (/James Sparkes_files/.test(src) && /^[\w-]{11}$/.test(file)) return { provider: 'youtube', id: file };
  return null;
}

export function videoPlaceholder({ provider, id }) {
  const href = provider === 'youtube' ? `https://www.youtube.com/watch?v=${id}` : `https://vimeo.com/${id}`;
  return `<a class="video-embed" data-provider="${provider}" data-id="${id}" href="${href}">Play video</a>`;
}

const isOldUpload = (href) =>
  /jamessparkes\.com\/wp-content\//.test(href) || /James Sparkes_files\//.test(href);

export function toMarkdown(bodyHtml, ctx) {
  const $ = load(bodyHtml, null, false);

  $('iframe, object').each((_, el) => {
    const $el = $(el);
    const src =
      $el.attr('src') || $el.find('embed').attr('src') || $el.find('param[name="movie"]').attr('value') || '';
    const video = videoFromEmbed(src);
    $el.replaceWith(video ? videoPlaceholder(video) : '');
  });

  $('a').each((_, el) => {
    const $a = $(el);
    const href = $a.attr('href') || '';
    const onlyImage = $a.children().length === 1 && $a.children('img').length === 1 && !$a.text().trim();
    if (onlyImage && isOldUpload(href)) {
      $a.replaceWith($a.children());
      return;
    }
    const slug = ctx.postSlugByUrl.get(href.replace(/#.*$/, ''));
    if (slug) $a.attr('href', `#${slug}`);
    // Anything else on the old domain (PDFs, uploads, demo sites) is gone
    else if (/^https?:\/\/(?:www\.)?jamessparkes\.com\//.test(href)) $a.replaceWith($a.contents());
  });

  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', emDelimiter: '*' });
  td.addRule('video', {
    filter: (node) => node.nodeName === 'A' && node.getAttribute('class') === 'video-embed',
    replacement: (_content, node) => `\n\n${node.outerHTML}\n\n`,
  });
  td.addRule('image', {
    filter: 'img',
    replacement: (_content, node) => {
      const alt = (node.getAttribute('alt') || '').replace(/[[\]]/g, '');
      const path = ctx.imageFor(node.getAttribute('src') || '');
      return path ? `![${alt}](${path})` : '';
    },
  });
  return td.turndown($.html());
}
