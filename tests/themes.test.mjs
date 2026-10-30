import test from 'node:test';
import assert from 'node:assert/strict';
import { WORLD_THEMES } from '../public/themes/worlds.mjs';
import { scene, emblem } from '../public/themes/art.mjs';
import { THEMES, GAMES, normalizePreferences } from '../public/model.mjs';
const ids = ['pirates','olympus','cyberpunk','steampunk','space','western','candy','dinosaurs','phoenix'];
test('exactly the nine requested worlds exist', () => assert.deepEqual(Object.keys(WORLD_THEMES),ids));
for (const id of ids) {
  test(`${id}: complete tokens, own identity, artwork, persistence`, () => {
    const theme = WORLD_THEMES[id];
    assert.equal(THEMES[id],theme);
    assert.deepEqual(Object.keys(theme.tokens).sort(),Object.keys(THEMES.base.tokens).sort());
    assert.ok(theme.brand && theme.title.length === 2 && theme.motion && theme.description);
    const svg = scene(id,`test-${id}`);
    assert.match(svg, /^<svg /);
    assert.ok(svg.length > 1500);
    assert.ok(emblem(id).length > 60);
    assert.doesNotMatch(svg,/<script|onload=|onerror=|https?:\/\/(?!www.w3.org)/);
    const defined = [...svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(defined).size,defined.length);
    assert.ok(defined.every(value=>value.startsWith(`test-${id}-`)));
    for (const m of svg.matchAll(/url\(#([^)]+)\)/g)) assert.ok(defined.includes(m[1]),`unknown reference ${m[1]}`);
    assert.equal(normalizePreferences({theme:id,favorites:[GAMES[0].id]}).theme,id);
  });
}
test('art varies by world and namespaces never collide',()=> {
  assert.equal(new Set(ids.map(id=>scene(id,'test'))).size,9);
  assert.notEqual(scene('pirates','hero'),scene('pirates','preview'));
});
test('unknown themes and unsafe namespaces are rejected',()=> {
  assert.throws(()=>scene('constructor','test'));
  assert.throws(()=>scene('pirates','"><script>'));
});
test('legacy preferences and invalid themes still recover',()=> {
  for(const theme of ['base','ascua','abisal']) assert.equal(normalizePreferences({theme}).theme,theme);
  assert.equal(normalizePreferences({theme:'<script>'}).theme,'base');
});
test('animated groups never overwrite SVG positioning transforms',()=> {
  for(const id of ids) assert.doesNotMatch(scene(id,'check'),/<g(?=[^>]*class="world-(?:hover|bob|spin|spin-reverse|breathe)")(?=[^>]*\stransform=)[^>]*>/);
});
test('core text and primary buttons meet a 4.5:1 contrast floor',()=> {
  function light(hex){const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
  function ratio(a,b){const x=light(a),y=light(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  for(const id of ids){const t=WORLD_THEMES[id].tokens;for(const [fg,bg] of [['--ink','--page'],['--muted','--panel'],['--accent-ink','--accent']])assert.ok(ratio(t[fg],t[bg])>=4.5,`${id}: ${fg}/${bg}`);}
});
