import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { WORLDS, WORLD_IDS, GAMES, normalizeState } from '../public/cinematic/schema.mjs';
import { ICON_FAMILIES, resolveIcon } from '../public/cinematic/icon-registry.mjs';
const added=['egypt','japan','china','india','vikings','atlantis','dragons','vampires','artdeco','masquerade','muertos','alchemy','ice','forest','racing','wasteland','eldorado','astral'];
const original=['pirates','olympus','cyberpunk','steampunk','space','western','candy','dinosaurs','phoenix'];
test('27 unique worlds: preserves original order and includes all 18 additions',()=>{
 assert.equal(WORLD_IDS.length,27); assert.deepEqual(WORLD_IDS.slice(0,9),original);
 assert.deepEqual(WORLD_IDS.slice(9),added); assert.equal(new Set(WORLD_IDS).size,27);
});
test('every new world has artwork, six themed icons and persistent preferences',()=>{
 for(const id of added){
  assert.ok(WORLDS[id],id); const w=WORLDS[id]; assert.equal(w.colors.length,5);assert.equal(w.title.length,2);
  assert.ok(existsSync(new URL('../public/'+w.art,import.meta.url)),w.art);
  assert.ok(ICON_FAMILIES[id],id);assert.equal(ICON_FAMILIES[id].glyphs.length,6);
  for(const role of ['home','discover','slots','live','table','favorites','search','account','worlds']) assert.ok(resolveIcon(id,role),id+':'+role);
  assert.equal(normalizeState({theme:id,favorites:['orbita']}).theme,id);
 }
 assert.equal(GAMES.length,12);
});
test('unknown themes and icon identifiers cannot form asset URLs',()=>{
 for(const id of ['constructor','__proto__','../../secret','<script>']){
  assert.equal(normalizeState({theme:id}).theme,'pirates');assert.equal(resolveIcon(id,'games'),null);
 }
});
