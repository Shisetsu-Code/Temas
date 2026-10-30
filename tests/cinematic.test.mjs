import test from 'node:test';
import assert from 'node:assert/strict';
import { WORLDS, WORLD_IDS, normalizeState, resolveWorld, GAMES, filterGames } from '../public/cinematic/schema.mjs';
import { canAnimate, particleBudget } from '../public/cinematic/motion.mjs';
const ids=['pirates','olympus','cyberpunk','steampunk','space','western','candy','dinosaurs','phoenix'];
test('all nine approved worlds have distinct artwork, branding and effect',()=>{
 assert.deepEqual(WORLD_IDS,ids);
 assert.equal(new Set(ids.map(id=>WORLDS[id].art)).size,9);
 assert.equal(new Set(ids.map(id=>WORLDS[id].brand)).size,9);
 assert.equal(new Set(ids.map(id=>WORLDS[id].effect)).size,9);
 for(const id of ids){const w=WORLDS[id];assert.equal(w.id,id);assert.ok(w.title.length===2&&w.copy&&w.signature);assert.match(w.art,/^assets\/cinematic\/[a-z]+\.avif$/);}
});
test('URL and stored themes use an own-property allowlist',()=>{
 for(const id of ids) assert.equal(resolveWorld(id),id);
 for(const id of ['constructor','__proto__','toString','<script>','',null,{},4]) assert.equal(resolveWorld(id),'pirates');
 assert.equal(resolveWorld('bad','phoenix'),'phoenix');
 assert.equal(resolveWorld('bad','constructor'),'pirates');
});
test('legacy favorites/motion migrate while corrupt values recover',()=>{
 assert.deepEqual(normalizeState({theme:'base',motion:false,favorites:['orbita','orbita','bad',2]}),{theme:'pirates',motion:false,favorites:['orbita']});
 for(const value of [null,1,'x',[],{theme:'bad',motion:'yes',favorites:'x'}]) assert.deepEqual(normalizeState(value),{theme:'pirates',motion:true,favorites:[]});
});
test('unknown keys are not persisted and a malicious prototype cannot become a world',()=>{
 const state=normalizeState({theme:'__proto__',html:'<script>',favorites:['bloom']});
 assert.deepEqual(Object.keys(state),['theme','motion','favorites']);assert.equal(state.theme,'pirates');assert.deepEqual(state.favorites,['bloom']);
});
test('catalog identity and filter behavior remain unchanged',()=>{
 assert.equal(GAMES.length,12);assert.equal(new Set(GAMES.map(g=>g.id)).size,12);
 assert.equal(filterGames(GAMES,{query:'ORBITA'})[0].id,'orbita');
 assert.deepEqual(filterGames(GAMES,{favoritesOnly:true,favorites:['orbita']}).map(g=>g.id),['orbita']);
});
test('primary text and buttons maintain readable contrast',()=>{
 const luminance=s=>{const rgb=s.slice(1).match(/../g).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
 const contrast=(a,b)=>{a=luminance(a);b=luminance(b);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05);};
 for(const w of Object.values(WORLDS)){assert.ok(contrast(w.colors[0],w.colors[3])>4.5);assert.ok(contrast(w.colors[0],w.colors[2])>4.5);}
});
test('motion runs only when all five gates permit it',()=>{
 const yes={enabled:true,reduced:false,visible:true,inView:true,modal:false};assert.equal(canAnimate(yes),true);
 for(const [key,value] of [['enabled',false],['reduced',true],['visible',false],['inView',false],['modal',true]])assert.equal(canAnimate({...yes,[key]:value}),false);
});
test('particle budget is bounded on desktop and mobile',()=>{assert.equal(particleBudget(390),18);assert.equal(particleBudget(1920),36);});
