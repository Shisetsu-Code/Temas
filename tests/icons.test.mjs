import test from 'node:test';
import assert from 'node:assert/strict';
import { ICON_FAMILIES, ICON_ROLES, resolveIcon } from '../public/cinematic/icon-registry.mjs';
test('27 families and 162 unique themed resources',()=>{
 assert.equal(Object.keys(ICON_FAMILIES).length,27);
 const refs=[];for(const [world,f] of Object.entries(ICON_FAMILIES)){assert.equal(f.glyphs.length,6); for(const glyph of f.glyphs){const v=resolveIcon(world,glyph);refs.push(`${v.row}:${v.column}`);assert.equal(v.world,world);}}
 assert.equal(new Set(refs).size,162);
});
test('every functional role resolves in every world',()=>{for(const id of Object.keys(ICON_FAMILIES))for(const role of ICON_ROLES){assert.ok(resolveIcon(id,role));}});
test('untrusted identifiers never become asset paths',()=>{for(const id of ['constructor','__proto__','../../secret','<script>'])assert.equal(resolveIcon(id,'games'),null);assert.equal(resolveIcon('pirates','constructor'),null);});
