import { GAMES, filterGames } from '../model.mjs';
export { GAMES, filterGames };

/** The imagery is cropped from the approved concept board. Replace art URLs with HD renders when available. */
const define = (name,brand,signature,title,copy,colors,effect,emblem) => Object.freeze({name,brand,signature,title:Object.freeze(title),copy,colors:Object.freeze(colors),effect,emblem});
const configs={
 pirates:define('Piratas','MAREA','THE BLACK TIDE CLUB',['El horizonte','es solo el inicio.'],'Hay mundos que no aparecen en los mapas. Encontrá el tuyo.', ['#07161b','#0c2026','#dfb96f','#f6eddb','#aabbbd'],'spray','compass'),
 olympus:define('Dioses griegos','OLIMPO','ABOVE THE ORDINARY',['Donde nacen','las leyendas.'],'Más allá de las nubes, una experiencia digna de otro mundo.', ['#0d1628','#14243c','#e6c786','#f9f1de','#b2bed1'],'clouds','bolt'),
 cyberpunk:define('Cyberpunk','NEON / 07','AFTER HOURS. NO LIMITS TO IMAGINATION.',['La noche','tiene otro código.'],'Luces que no se apagan. Un distrito que nunca deja de sorprender.', ['#080b18','#151a31','#fb76ce','#f2edf9','#b7b4d1'],'rain','chip'),
 steampunk:define('Steampunk','ÆTHER','THE EXTRAORDINARY WORKSHOP',['El ingenio','mueve mundos.'],'Entre el vapor y el latón, lo imposible toma forma.', ['#171911','#26291e','#d8b675','#f3ead7','#babba6'],'steam','gear'),
 space:define('Espacial / aliens','SECTOR 09','THE UNIVERSE IS ONLY THE BEGINNING',['Fuera de órbita.','Dentro de otro mundo.'],'Seguí la señal. La próxima frontera está más cerca de lo que creés.', ['#0c0b24','#181436','#bcabfa','#f2f1ff','#beb7d7'],'stars','orbit'),
 western:define('Vaqueros','DUST & GOLD','THE FRONTIER SOCIAL CLUB',['La frontera','la ponés vos.'],'El camino termina. La historia recién comienza.', ['#20150e','#332117','#ecbd7f','#faecda','#c5b19b'],'dust','star'),
 candy:define('Candyworld','BONBON','THE CONFECTIONERY CLUB · 18+',['Un universo','para saborear.'],'Una edición de fantasía, texturas y pequeños placeres. Solo para adultos.', ['#fff1ed','#fae3e2','#9b234f','#4b2136','#855d6b'],'sugar','diamond'),
 dinosaurs:define('Dinosaurios','TERRANOVA','BEFORE EVERYTHING. BEYOND ORDINARY.',['Lo extraordinario','está despierto.'],'Cruzá la niebla. Entrá en un mundo que el tiempo no pudo borrar.', ['#091810','#14271b','#d0e59d','#edf2de','#afbfaa'],'spores','leaf'),
 phoenix:define('Fénix','IGNIS','EVERY LEGEND BEGINS WITH A SPARK',['Todo comienza','con una chispa.'],'De la oscuridad al fuego. Una experiencia que deja huella.', ['#1a0b0d','#2c1516','#f7c277','#faeedb','#c5aaa2'],'embers','flame'),
};
export const WORLD_IDS=Object.freeze(Object.keys(configs));
export const WORLDS=Object.freeze(Object.fromEntries(WORLD_IDS.map((id,index)=>[id,Object.freeze({...configs[id],id,index,art:`assets/cinematic/${id}.avif`,light:id==='candy'})])));
export const COVER_WORLDS=Object.freeze({orbita:'space',velvet:'cyberpunk',solstice:'phoenix',blackjack:'steampunk',monolith:'olympus',bloom:'candy',eclipse:'pirates',baccarat:'western',prisma:'space',solar:'phoenix',ruleta:'olympus',flora:'dinosaurs'});
export function resolveWorld(value,fallback='pirates') {
 return typeof value==='string' && Object.hasOwn(WORLDS,value) ? value : (typeof fallback==='string' && Object.hasOwn(WORLDS,fallback) ? fallback : 'pirates');
}
export function normalizeState(value) {
 const v=value && typeof value==='object' && !Array.isArray(value)?value:{};
 return {theme:resolveWorld(v.theme),motion:typeof v.motion==='boolean'?v.motion:true,favorites:Array.isArray(v.favorites)?[...new Set(v.favorites.filter(id=>GAMES.some(g=>g.id===id)))]:[]};
}
