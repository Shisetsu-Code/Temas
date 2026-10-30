import test from 'node:test';
import assert from 'node:assert/strict';
import { GAMES, THEMES, filterGames, normalizePreferences } from '../public/model.mjs';

test('catalog contains 12 unique demonstration games', () => {
  assert.equal(GAMES.length, 12);
  assert.equal(new Set(GAMES.map(g => g.id)).size, 12);
  assert.ok(GAMES.every(g => g.name && g.provider && g.category && g.art));
});
test('search ignores accents and case', () => {
  assert.equal(filterGames(GAMES, { query: 'ORBITA' })[0].id, 'orbita');
});
test('category and provider intersect', () => {
  const result = filterGames(GAMES, { category: 'live', provider: 'Nórd Studio' });
  assert.ok(result.length > 0);
  assert.ok(result.every(g => g.category === 'live' && g.provider === 'Nórd Studio'));
});
test('search with no match returns empty', () => assert.deepEqual(filterGames(GAMES, { query: '<script>' }), []));
test('favorites is an independent filter', () => {
  assert.deepEqual(filterGames(GAMES, { favoritesOnly: true, favorites: ['orbita'] }).map(g => g.id), ['orbita']);
  assert.deepEqual(filterGames(GAMES, { favoritesOnly: true, favorites: [] }), []);
});
test('alphabetical order is deterministic and does not mutate catalog', () => {
  const original = GAMES.map(g => g.id);
  const names = filterGames(GAMES, { sort: 'az' }).map(g => g.name);
  assert.deepEqual(names, [...names].sort((a,b) => a.localeCompare(b, 'es')));
  assert.deepEqual(GAMES.map(g => g.id), original);
});
test('default preferences and invalid values are safe', () => {
  for (const value of [null, 7, [], { theme: 'evil', motion: 'yes', favorites: 'bad' }]) {
    assert.deepEqual(normalizePreferences(value), { theme: 'base', motion: true, favorites: [] });
  }
});
test('preferences keep only known unique favorites and valid theme', () => {
  assert.deepEqual(normalizePreferences({ theme: 'ascua', motion: false, favorites: ['orbita','orbita','unknown',1] }),
    { theme: 'ascua', motion: false, favorites: ['orbita'] });
});
test('every theme implements the same complete token contract', () => {
  const keys = Object.keys(THEMES.base.tokens).sort();
  for (const theme of Object.values(THEMES)) {
    assert.deepEqual(Object.keys(theme.tokens).sort(), keys);
    assert.ok(Object.values(theme.tokens).every(v => typeof v === 'string' && v.length));
  }
});
