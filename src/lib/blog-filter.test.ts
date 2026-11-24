import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, normalize, matches, readState, writeState } from './blog-filter.ts';

const post = { text: normalize('Typeface Research fonts Graphic Design'), categorySlugs: ['graphic-design'] };

test('slugify makes category slugs', () => {
  assert.equal(slugify('3D Graphics'), '3d-graphics');
  assert.equal(slugify('Photo Manipulation'), 'photo-manipulation');
});

test('normalize lowercases and strips accents', () => {
  assert.equal(normalize('Café'), 'cafe');
});

test('matches needs every search term, ignoring case', () => {
  assert.equal(matches(post, 'TYPEFACE font', null), true);
  assert.equal(matches(post, 'typeface lego', null), false);
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
