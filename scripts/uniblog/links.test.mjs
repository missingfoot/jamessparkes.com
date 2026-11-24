import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyLink, extractLinks, isInconclusive, mergeDead } from './links.mjs';

test('classifyLink: 2xx on the same page is fine', () => {
  assert.equal(classifyLink({ status: 200, url: 'http://a.com/x', finalUrl: 'https://a.com/x/' }), null);
});

test('classifyLink: 404 and 410 are dead', () => {
  assert.equal(classifyLink({ status: 404, url: 'http://a.com/x', finalUrl: 'http://a.com/x' }), 'Not found (404)');
  assert.equal(classifyLink({ status: 410, url: 'http://a.com/x', finalUrl: 'http://a.com/x' }), 'Gone (410)');
});

test('classifyLink: network failures are dead', () => {
  assert.equal(classifyLink({ error: 'ENOTFOUND', url: 'http://sxc.hu/x' }), 'Site unreachable (ENOTFOUND)');
});

test('classifyLink: a deep link that lands on a homepage is dead', () => {
  assert.equal(
    classifyLink({ status: 200, url: 'http://www.boingboing.net/2009/05/28/eff.html', finalUrl: 'https://boingboing.net/' }),
    'Redirects to homepage'
  );
  assert.equal(classifyLink({ status: 200, url: 'http://a.com/', finalUrl: 'https://a.com/' }), null);
});

test('classifyLink: bot blocks and server errors are not flagged', () => {
  for (const status of [401, 403, 406, 429, 500, 503]) {
    assert.equal(classifyLink({ status, url: 'http://behance.net/x', finalUrl: 'http://behance.net/x' }), null);
  }
});

test('extractLinks finds Markdown links and video placeholders, skipping local ones', () => {
  const md = [
    'See [this](http://a.com/x) and [that](#2011-post).',
    '[![Img](../../assets/blog/a.jpg)](https://b.com/y)',
    '<a class="video-embed" data-provider="vimeo" data-id="1" href="https://vimeo.com/1/abc">Play video</a>',
  ].join('\n');
  assert.deepEqual(extractLinks(md), ['http://a.com/x', 'https://b.com/y', 'https://vimeo.com/1/abc']);
});

test('classifyLink: client-side fetch limits are not treated as dead', () => {
  assert.equal(classifyLink({ error: 'UND_ERR_HEADERS_OVERFLOW', url: 'http://www.youtube.com/user/x/' }), null);
});

test('classifyLink: a parked or for-sale domain is dead', () => {
  const base = { status: 200, url: 'http://www.mikaeleidenberg.se/', finalUrl: 'http://www.mikaeleidenberg.se/' };
  assert.equal(classifyLink({ ...base, title: 'Parked at Loopia' }), 'Parked domain');
  assert.equal(classifyLink({ ...base, title: 'example.com is for sale' }), 'Parked domain');
  assert.equal(classifyLink({ ...base, title: 'Work - Mikael Eidenberg' }), null);
});

test('classifyLink: dropped connections are retried later, not flagged', () => {
  for (const error of ['UND_ERR_SOCKET', 'ECONNRESET']) {
    assert.equal(classifyLink({ error, url: 'http://news.bbc.co.uk/1/hi/8617454.stm' }), null);
  }
});

test('isInconclusive: blocks, server errors and dropped connections tell us nothing', () => {
  for (const status of [401, 403, 406, 429, 500, 503]) assert.equal(isInconclusive({ status }), true);
  for (const error of ['UND_ERR_HEADERS_OVERFLOW', 'UND_ERR_SOCKET', 'ECONNRESET']) assert.equal(isInconclusive({ error }), true);
  assert.equal(isInconclusive({ status: 200 }), false);
  assert.equal(isInconclusive({ status: 404 }), false);
  assert.equal(isInconclusive({ error: 'ENOTFOUND' }), false);
});

test('mergeDead keeps a dead link dead until a check clearly succeeds', () => {
  const previous = { 'http://a/1': 'Not found (404)', 'http://a/2': 'Not found (404)', 'http://gone/': 'Not found (404)' };
  const results = new Map([
    ['http://a/1', { unknown: true }],
    ['http://a/2', { ok: true }],
    ['http://a/3', { dead: 'Gone (410)' }],
    ['http://a/4', { unknown: true }],
  ]);
  assert.deepEqual(mergeDead(previous, results), { 'http://a/1': 'Not found (404)', 'http://a/3': 'Gone (410)' });
});
