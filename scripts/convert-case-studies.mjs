// scripts/convert-case-studies.mjs
//
// One-off conversion script: reads the 7 original static-HTML project pages
// at the repo root and writes out `.mdx` case studies into
// src/content/projects/, using the KV/KVGroup/KVHeading components built in
// Task 4. This is not a repeatable pipeline — it was run once, its output
// hand-verified and hand-fixed against the source HTML, and can be deleted
// once the conversion is complete.
import { load } from 'cheerio';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const PROJECTS = [
  { file: 'fixr.html', slug: 'fixr', order: 1 },
  { file: 'the-collective.html', slug: 'the-collective', order: 2 },
  { file: 'personal-projects.html', slug: 'personal-projects', order: 3 },
  { file: 'kuula-tv.html', slug: 'kuula-tv', order: 4 },
  { file: 'breezie.html', slug: 'breezie', order: 5 },
  { file: 'ambio-n.html', slug: 'ambio-n', order: 6 },
  { file: 'qd-design.html', slug: 'qd-design', order: 7 },
];

function textOf($el) {
  return $el.text().trim().replace(/\s+/g, ' ');
}

function inlineMarkdown($, el) {
  let out = '';
  $(el).contents().each((_, node) => {
    if (node.type === 'text') {
      out += node.data;
    } else if (node.tagName === 'strong') {
      out += `**${$(node).text()}**`;
    } else if (node.tagName === 'em') {
      out += `_${$(node).text()}_`;
    } else if (node.tagName === 'a') {
      out += `[${$(node).text()}](${$(node).attr('href')})`;
    } else {
      out += $(node).text();
    }
  });
  return out.trim().replace(/\s+/g, ' ');
}

// $rows: a cheerio collection of elements that each contain a
// .syntax-key/.syntax-desc pair (either <li class="kv-row"> or
// <p class="kv-row">). Renders one <KVGroup> wrapping one <KV> per row.
function kvGroupMarkup($, $rows) {
  const lines = ['<KVGroup>'];
  $rows.each((_, row) => {
    const $row = $(row);
    const term = textOf($row.find('.syntax-key')).replace(/"/g, '&quot;');
    const desc = inlineMarkdown($, $row.find('.syntax-desc')[0]).replace(/"/g, '&quot;');
    lines.push(`  <KV term="${term}" desc="${desc}" />`);
  });
  lines.push('</KVGroup>', '');
  return lines;
}

function convertBody($, container) {
  const lines = [];
  const children = container.children().toArray();
  let i = 0;

  while (i < children.length) {
    const el = children[i];
    const $el = $(el);
    const tag = el.tagName;

    // Some case studies (breezie, ambio-n, personal-projects) use bare
    // <p class="kv-row"> elements as direct children of .project-case-study
    // instead of wrapping them in a <div class="kv-group">. In the source,
    // consecutive such <p> siblings render as one visually-connected block
    // (the CSS border-between-rows rule keys off DOM adjacency, not a
    // wrapper element), so to stay faithful we collect each run of adjacent
    // bare kv-row paragraphs and emit a single <KVGroup> for the run —
    // exactly as if they'd been wrapped in a .kv-group div in the source.
    if (tag === 'p' && $el.hasClass('kv-row')) {
      const run = [el];
      let j = i + 1;
      while (
        j < children.length &&
        children[j].tagName === 'p' &&
        $(children[j]).hasClass('kv-row')
      ) {
        run.push(children[j]);
        j++;
      }
      lines.push(...kvGroupMarkup($, $(run)));
      i = j;
      continue;
    }

    if (tag === 'h2') {
      lines.push(`## ${textOf($el)}`, '');
    } else if (tag === 'h3') {
      lines.push(`### ${textOf($el)}`, '');
    } else if ($el.hasClass('kv-heading')) {
      lines.push(`<KVHeading>${textOf($el)}</KVHeading>`, '');
    } else if ($el.hasClass('kv-group')) {
      lines.push(...kvGroupMarkup($, $el.find('.kv-row')));
    } else if (tag === 'ul' || tag === 'ol') {
      const kvItems = $el.find('li.kv-row');
      if (kvItems.length) {
        lines.push(...kvGroupMarkup($, kvItems));
      } else {
        $el.find('li').each((_, li) => {
          lines.push(`- ${inlineMarkdown($, li)}`);
        });
        lines.push('');
      }
    } else if (tag === 'p') {
      lines.push(inlineMarkdown($, el), '');
    }
    i++;
  }
  return lines.join('\n').trim() + '\n';
}

for (const { file, slug, order } of PROJECTS) {
  const html = readFileSync(file, 'utf8');
  const $ = load(html);

  const title = textOf($('.project-title'));
  const description = textOf($('.project-description'));
  const tags = $('.project-tags span').map((_, el) => $(el).text().trim()).get();
  const images = $('.project-thumb img')
    .map((_, el) => ({
      src: `../../assets/images/${$(el).attr('src').replace('images/', '')}`,
      alt: $(el).attr('alt'),
    }))
    .get();

  const body = convertBody($, $('.project-case-study'));

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]`,
    `order: ${order}`,
    `visible: true`,
    `images:`,
    ...images.map((img) => `  - src: ${JSON.stringify(img.src)}\n    alt: ${JSON.stringify(img.alt)}`),
    '---',
    '',
    "import KV from '../../components/KV.astro';",
    "import KVGroup from '../../components/KVGroup.astro';",
    "import KVHeading from '../../components/KVHeading.astro';",
    '',
    '',
  ].join('\n');

  mkdirSync('src/content/projects', { recursive: true });
  writeFileSync(`src/content/projects/${slug}.mdx`, frontmatter + body);
  console.log(`wrote src/content/projects/${slug}.mdx`);
}
