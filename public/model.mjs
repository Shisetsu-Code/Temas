import { WORLD_THEMES } from './themes/worlds.mjs';

/** Pure presentation data. Replace this demonstration catalogue with a validated API adapter. */
export const GAMES = Object.freeze([
  { id:'orbita', name:'Órbita', provider:'Nórd Studio', category:'slots', label:'Original', art:'orbit', color:'#aca4ed', rank:1 },
  { id:'velvet', name:'Velvet Roulette', provider:'Atelier', category:'live', label:'En vivo · muestra', art:'wheel', color:'#d2b292', rank:2 },
  { id:'solstice', name:'Solstice', provider:'Nórd Studio', category:'slots', label:'Nuevo', art:'sun', color:'#d9a575', rank:3 },
  { id:'blackjack', name:'Blackjack Nº 21', provider:'Nórd Studio', category:'live', label:'En vivo · muestra', art:'cards', color:'#aec6b7', rank:4 },
  { id:'monolith', name:'Monolith', provider:'Forma', category:'slots', label:'Original', art:'gem', color:'#a7b9d0', rank:5 },
  { id:'bloom', name:'Bloom', provider:'Atelier', category:'slots', label:'Nuevo', art:'flower', color:'#c49da7', rank:6 },
  { id:'eclipse', name:'Eclipse', provider:'Forma', category:'slots', label:'Original', art:'orbit', color:'#b2b7c7', rank:7 },
  { id:'baccarat', name:'Baccarat Privé', provider:'Atelier', category:'table', label:'Mesa', art:'cards', color:'#c7bd9d', rank:8 },
  { id:'prisma', name:'Prisma', provider:'Forma', category:'slots', label:'Nuevo', art:'gem', color:'#b2a5d1', rank:9 },
  { id:'solar', name:'Solar Club', provider:'Nórd Studio', category:'live', label:'En vivo · muestra', art:'sun', color:'#d4b48b', rank:10 },
  { id:'ruleta', name:'Ruleta Studio', provider:'Forma', category:'table', label:'Mesa', art:'wheel', color:'#a4bfb7', rank:11 },
  { id:'flora', name:'Flora', provider:'Atelier', category:'slots', label:'Original', art:'flower', color:'#b0baa0', rank:12 },
].map(Object.freeze));

/** Shared token contract. Game data stays separate from theme presentation. */
export const THEMES = Object.freeze({
  ...WORLD_THEMES,
  base: { name:'Estudio', description:'Grafito, marfil y metal. La base neutral.', tokens: {
    '--page':'#131516', '--panel':'#1c1f20', '--panel-raised':'#25292a', '--ink':'#f0eee8', '--muted':'#a1a6a5', '--line':'#343839', '--accent':'#e6e9d5', '--accent-ink':'#22271b', '--glow':'#b7c7b3', '--hero':'#262c29' } },
  ascua: { name:'Ascua', description:'Prueba cromática cálida para futuros temas de fuego.', tokens: {
    '--page':'#191413', '--panel':'#251d1a', '--panel-raised':'#312621', '--ink':'#f6eee6', '--muted':'#b7a69d', '--line':'#49362e', '--accent':'#f1b68c', '--accent-ink':'#332017', '--glow':'#d98d5c', '--hero':'#3d2920' } },
  abisal: { name:'Abisal', description:'Prueba cromática fría para futuros temas oceánicos.', tokens: {
    '--page':'#10181d', '--panel':'#17252d', '--panel-raised':'#22343d', '--ink':'#eaf1f2', '--muted':'#9db2bd', '--line':'#324b58', '--accent':'#a9d5dc', '--accent-ink':'#142e39', '--glow':'#66a7bd', '--hero':'#203e4b' } },
});
const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();

export function filterGames(games, { query='', category='all', provider='all', favoritesOnly=false, favorites=[], sort='featured' }={}) {
  const needle = normalize(query);
  const filtered = games.filter(game =>
    (!needle || normalize(`${game.name} ${game.provider}`).includes(needle)) &&
    (category === 'all' || game.category === category) &&
    (provider === 'all' || game.provider === provider) &&
    (!favoritesOnly || favorites.includes(game.id)));
  return filtered.sort(sort === 'az' ? (a,b) => a.name.localeCompare(b.name,'es') : (a,b) => a.rank-b.rank);
}

export function normalizePreferences(value) {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return {
    theme: Object.hasOwn(THEMES, input.theme) ? input.theme : 'base',
    motion: typeof input.motion === 'boolean' ? input.motion : true,
    favorites: Array.isArray(input.favorites) ? [...new Set(input.favorites.filter(id => GAMES.some(g => g.id === id)))] : [],
  };
}
