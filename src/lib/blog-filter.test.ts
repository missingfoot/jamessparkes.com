import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, normalize, matches, readState, writeState, byNewest, findRanges } from './blog-filter.ts';

const post = { text: normalize('Typeface Research fonts Graphic Design'), categorySlugs: ['graphic-design'] };

test('slugify makes category slugs', () => {
  assert.equal(slugify('3D Graphics'), '3d-graphics');
  assert.equal(slugify('Photo Manipulation'), 'photo-manipulation');
});

test('normalize lowercases and strips accents', () => {
  assert.equal(normalize('Café'), 'cafe');
});

test('matches treats spaces as an exact phrase, ignoring case', () => {
  assert.equal(matches(post, 'TYPEFACE research', null), true);
  assert.equal(matches(post, 'typeface  RESEARCH ', null), true);
  assert.equal(matches(post, 'research typeface', null), false);
});

test('matches treats + as separate terms that must all appear', () => {
  assert.equal(matches(post, 'design+typeface', null), true);
  assert.equal(matches(post, 'typeface+lego', null), false);
  assert.equal(matches(post, 'graphic design + fonts', null), true);
  assert.equal(matches(post, '+', null), true);
  assert.equal(matches(post, '  ', null), true);
});

test('matches applies the category', () => {
  assert.equal(matches(post, '', 'graphic-design'), true);
  assert.equal(matches(post, '', '3d-graphics'), false);
});

test('readState ignores unknown categories', () => {
  assert.deepEqual(readState('?cat=nope&q=lego', ['3d-graphics']), { q: 'lego', cat: null });
  assert.deepEqual(readState('?cat=3d-graphics', ['3d-graphics']), { q: '', cat: '3d-graphics' });
});

test('writeState omits empty keys and round-trips', () => {
  assert.equal(writeState({ q: '', cat: null }), '');
  const state = { q: 'a b', cat: 'type' };
  assert.deepEqual(readState(writeState(state), ['type']), state);
});

test('normalize treats curly and straight quotes the same', () => {
  assert.equal(normalize('Apple’s “Think”'), normalize("Apple's \"Think\""));
});

test('byNewest sorts by date, then by original order within a day', () => {
  const d = (s: string) => new Date(s);
  const posts = [
    { date: d('2013-05-06'), order: 1, id: 'swot' },
    { date: d('2012-01-01'), order: 5, id: 'old' },
    { date: d('2013-05-06'), order: 0, id: 'archos' },
    { date: d('2013-05-08'), order: 2, id: 'summary' },
  ];
  assert.deepEqual([...posts].sort(byNewest).map((p) => p.id), ['summary', 'archos', 'swot', 'old']);
});

test('findRanges finds every search term, ignoring case and quote style', () => {
  assert.deepEqual(findRanges('Lego bricks and more LEGO', 'lego'), [[0, 4], [21, 25]]);
  assert.deepEqual(findRanges('I don’t know', "don't"), [[2, 7]]);
  assert.deepEqual(findRanges('Typeface research', 'research+type'), [[0, 4], [9, 17]]);
  assert.deepEqual(findRanges('the last of us, last of all', 'last of us'), [[4, 14]]);
  assert.deepEqual(findRanges('out of the last  of us', 'last of us'), [[11, 22]]);
  assert.deepEqual(findRanges('anything', '  '), []);
});

test('findRanges merges overlapping matches', () => {
  assert.deepEqual(findRanges('typeface', 'type+typeface'), [[0, 8]]);
});
