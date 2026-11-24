import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePosts, safeImageName, videoFromEmbed, videoPlaceholder, toMarkdown } from './lib.mjs';

const post = (id, classes, url, title, body) => `
<div class="post-${id} post type-post status-publish format-standard hentry ${classes}" id="post-${id}">
  <h2 class="entry-title"><a href="${url}" title="Permalink to: x">${title}</a></h2>
  <!--BEGIN .entry-content -->
  <div class="entry-content">${body}
  <!--END .entry-content -->
  </div>
  <ul class="entry-meta entry-header clearfix"><li class="comment-count"><a href="${url}#comments">0 Comments</a></li></ul>
</div>`;

const page = `<html><body><div id="primary">
${post(1000, 'category-graphicdesign category-layout tag-body tag-fonts tag-headline', 'http://jamessparkes.com/2012/02/28/logo-typeface/', 'Typeface Research', '<p>I have been doing some research.</p>')}
${post(1013, 'category-all category-research-3 category-type tag-bella tag-inspirationtag tag-3dtag tag-nyan-cat', 'http://jamessparkes.com/2012/03/01/bella/', 'Spark &amp; &#8220;Bella&#8221;: test', '<p>Hi</p>')}
</div></body></html>`;

test('parsePosts extracts title, date, slug, categories and tags', () => {
  const posts = parsePosts(page);
  assert.equal(posts.length, 2);
  const [p] = posts;
  assert.equal(p.title, 'Typeface Research');
  assert.equal(p.date, '2012-02-28');
  assert.equal(p.slug, 'logo-typeface');
  assert.equal(p.originalUrl, 'http://jamessparkes.com/2012/02/28/logo-typeface/');
  assert.deepEqual(p.categories, ['Graphic Design', 'Layout']);
  assert.deepEqual(p.categorySlugs, ['graphicdesign', 'layout']);
  assert.deepEqual(p.tags, ['body', 'fonts', 'headline']);
  assert.match(p.bodyHtml, /I have been doing some research/);
});

test('parsePosts drops junk categories and suffixed duplicate tags', () => {
  const p = parsePosts(page)[1];
  assert.deepEqual(p.categories, ['Type']);
  assert.deepEqual(p.tags, ['bella', 'nyan cat']);
});

test('parsePosts decodes entities in titles', () => {
  assert.equal(parsePosts(page)[1].title, 'Spark & “Bella”: test');
});

test('safeImageName gives distinct filesystem-safe names', () => {
  const taken = new Set();
  const names = ['1.jpg', '1.jpeg', '2(1).jpg', '2.jpg', '1.jpg', 'Danil-Zdorov-Eskimo.JPEG'].map((n) =>
    safeImageName(n, taken)
  );
  assert.equal(new Set(names).size, names.length);
  for (const n of names) assert.match(n, /^[a-z0-9-]+\.(jpg|jpeg|png|gif)$/);
});

test('videoFromEmbed recognises YouTube and Vimeo embeds', () => {
  assert.deepEqual(videoFromEmbed('./James Sparkes_files/ZZ5LpwO-An4.html'), { provider: 'youtube', id: 'ZZ5LpwO-An4' });
  assert.deepEqual(videoFromEmbed('./James Sparkes_files/15594881.html'), { provider: 'vimeo', id: '15594881' });
  assert.deepEqual(videoFromEmbed('http://www.youtube.com/v/p9r75S14MNo?version=3&feature=player_detailpage'), {
    provider: 'youtube',
    id: 'p9r75S14MNo',
  });
  assert.equal(videoFromEmbed('./James Sparkes_files/twitter.html'), null);
});

test('videoPlaceholder is a working link without JS', () => {
  assert.equal(
    videoPlaceholder({ provider: 'vimeo', id: '15594881' }),
    '<a class="video-embed" data-provider="vimeo" data-id="15594881" href="https://vimeo.com/15594881">Play video</a>'
  );
});

const ctx = {
  imageFor: (src) => `../../assets/blog/${src.split('/').pop().toLowerCase()}`,
  postSlugByUrl: new Map([['http://jamessparkes.com/2013/05/06/archos-research/', 'archos-research']]),
};

test('toMarkdown unwraps images linked to the old uploads', () => {
  const md = toMarkdown(
    '<p><a href="http://jamessparkes.com/wp-content/uploads/2012/x.jpg"><img src="./James Sparkes_files/X.jpg" alt="X"></a></p>',
    ctx
  );
  assert.equal(md.trim(), '![X](../../assets/blog/x.jpg)');
});

test('toMarkdown keeps external links around images', () => {
  const md = toMarkdown(
    '<p><a href="http://www.hypefortype.com/fabrizio.html"><img src="./James Sparkes_files/F.jpg" alt="F"></a></p>',
    ctx
  );
  assert.equal(md.trim(), '[![F](../../assets/blog/f.jpg)](http://www.hypefortype.com/fabrizio.html)');
});

test('toMarkdown turns iframes and objects into video placeholders', () => {
  const md = toMarkdown('<p><iframe width="500" src="./James Sparkes_files/ZZ5LpwO-An4.html"></iframe></p>', ctx);
  assert.match(md, /data-id="ZZ5LpwO-An4"/);
  assert.match(md, /href="https:\/\/www\.youtube\.com\/watch\?v=ZZ5LpwO-An4"/);
  assert.doesNotMatch(md, /iframe/);
  const md2 = toMarkdown(
    '<p><object><param name="movie" value="http://www.youtube.com/v/p9r75S14MNo?version=3"><embed src="http://www.youtube.com/v/p9r75S14MNo?version=3"></object></p>',
    ctx
  );
  assert.match(md2, /data-id="p9r75S14MNo"/);
  assert.doesNotMatch(md2, /<object|<embed/);
});

test('toMarkdown rewrites links to other posts as anchors', () => {
  const md = toMarkdown('<p>See <a href="http://jamessparkes.com/2013/05/06/archos-research/">this</a>.</p>', ctx);
  assert.equal(md.trim(), 'See [this](#archos-research).');
});

test('toMarkdown unlinks dead links to the old site but keeps the text', () => {
  const md = toMarkdown(
    '<p>A <a href="http://jamessparkes.com/novusaura/">website</a> and <a href="http://jamessparkes.com/files/fry.pdf"><img src="./James Sparkes_files/Fry.png" alt="Fry"></a></p>',
    ctx
  );
  assert.equal(md.trim(), 'A website and ![Fry](../../assets/blog/fry.png)');
});

test('parsePosts strips WordPress duplicate-slug suffixes from tags', () => {
  const html = post(1, 'category-type tag-photomanipulation-2 tag-photomanipulation tag-layout-2', 'http://jamessparkes.com/2012/01/01/x/', 'X', '');
  assert.deepEqual(parsePosts(html)[0].tags, ['photomanipulation', 'layout']);
});
