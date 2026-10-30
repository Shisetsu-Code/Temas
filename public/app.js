import { initializeWorlds, applyWorld } from './themes/engine.mjs';
import { GAMES, THEMES, filterGames, normalizePreferences } from './model.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const STORAGE_KEY = 'temas:v1';
let preferences;
try { preferences = normalizePreferences(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
catch { preferences = normalizePreferences(null); }
const requestedTheme = new URLSearchParams(location.search).get('theme');
if (requestedTheme && Object.hasOwn(THEMES, requestedTheme)) preferences.theme = requestedTheme;
const filters = { query:'', category:'all', provider:'all', sort:'featured', favoritesOnly:false };
let toastTimer;

function syncThemeURL() {
  try {
    const url = new URL(location.href);
    if (!['http:','https:'].includes(url.protocol)) return;
    url.searchParams.set('theme', preferences.theme);
    history.replaceState(null, '', url);
  } catch { /* File previews and restricted history remain functional. */ }
}

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); }
  catch { /* Browsing remains functional when persistence is unavailable. */ }
}
function notify(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 2500);
}
function icon(name, className='icon') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('class',className);
  svg.setAttribute('aria-hidden','true');
  const use = document.createElementNS(svg.namespaceURI,'use');
  use.setAttribute('href',`#i-${name}`);
  svg.append(use);
  return svg;
}
function artwork(game, className='cover-art') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('class',className);
  svg.setAttribute('viewBox','0 0 300 230');
  svg.setAttribute('aria-hidden','true');
  const use = document.createElementNS(svg.namespaceURI,'use');
  use.setAttribute('href',`assets/art.svg#${game.art}`);
  svg.append(use);
  return svg;
}
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function renderCatalog() {
  const games = filterGames(GAMES,{ ...filters, favorites:preferences.favorites });
  const fragment = document.createDocumentFragment();
  for (const game of games) {
    const article = element('article','game-card');
    const open = element('button','game-open');
    open.type = 'button';
    open.dataset.preview = game.id;
    open.setAttribute('aria-label',`Ver ${game.name}`);
    open.setAttribute('aria-haspopup','dialog');
    const cover = element('div','game-cover');
    cover.setAttribute('aria-hidden','true');
    cover.style.setProperty('--cover',game.color);
    cover.append(element('span','cover-kicker',game.label.toUpperCase()),element('span','cover-name',game.name),artwork(game),element('span','cover-number',String(game.rank).padStart(2,'0')+' / STUDIO'));
    const meta = element('div','game-meta');
    meta.append(element('h3','',game.name),element('p','',game.provider));
    open.append(cover,meta);
    const saved = preferences.favorites.includes(game.id);
    const favorite = element('button','favorite');
    favorite.type = 'button';
    favorite.dataset.favorite = game.id;
    favorite.setAttribute('aria-pressed',String(saved));
    favorite.setAttribute('aria-label',saved ? `Quitar ${game.name} de favoritos` : `Guardar ${game.name} en favoritos`);
    favorite.append(icon('star'));
    article.append(open,favorite);
    fragment.append(article);
  }
  $('#games').replaceChildren(fragment);
  $('#empty-state').hidden = games.length !== 0;
  $('#results-count').textContent = `${games.length} ${games.length === 1 ? 'experiencia de muestra' : 'experiencias de muestra'} · Catálogo de demostración`;
  $('#favorites-count').textContent = String(preferences.favorites.length);
}
function setCategory(category) {
  filters.category = ['slots','live','table'].includes(category) ? category : 'all';
  filters.favoritesOnly = category === 'favorites';
  $$('[data-category]').forEach(button => {
    const active = button.dataset.category === category;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
  renderCatalog();
}
function applyTheme() {
  const theme = THEMES[preferences.theme];
  document.documentElement.dataset.theme = preferences.theme;
  document.documentElement.dataset.motion = preferences.motion ? 'on' : 'off';
  for (const [token,value] of Object.entries(theme.tokens)) document.documentElement.style.setProperty(token,value);
  $('meta[name="theme-color"]').content = theme.tokens['--page'];
  $('#motion').checked = preferences.motion;
  $$('[data-theme-choice]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.themeChoice === preferences.theme)));
  applyWorld(preferences.theme, theme.name);
  document.dispatchEvent(new CustomEvent('temas:themechange',{ detail:{ theme:preferences.theme, motion:preferences.motion } }));
}
function openDialog(dialog, trigger) {
  if (dialog.open) return;
  dialog.showModal();
  dialog.addEventListener('close',() => {
    if (trigger?.isConnected) trigger.focus();
  },{ once:true });
}
function preview(id, trigger) {
  const game = GAMES.find(game => game.id === id);
  if (!game) return;
  $('#detail-title').textContent = game.name;
  $('#detail-provider').textContent = `${game.provider.toUpperCase()} · VISTA PREVIA`;
  $('#detail-art').style.setProperty('--cover',game.color);
  $('#detail-art').replaceChildren(artwork(game,'detail-illustration'));
  openDialog($('#detail-dialog'),trigger);
  document.dispatchEvent(new CustomEvent('temas:preview',{ detail:{ gameId:game.id } }));
}
const information = {
  about: ['Una base. Muchas posibilidades.','Temas usa identidades conceptuales intercambiables. Los nombres no han sido verificados como marcas registrables. El catálogo, las marcas y las ilustraciones son ejemplos originales. Esta versión prueba diseño e interacción: no es un casino operativo y no afirma tener licencias ni proveedores integrados.'],
  responsible: ['El juego tiene límites.','Contenido de demostración dirigido a mayores de 18 años. Jugar no es una forma de generar ingresos. Una implementación operativa deberá incluir verificación de edad, límites, autoexclusión y recursos de ayuda adecuados a su jurisdicción. Esta maqueta no habilita apuestas.'],
  privacy: ['Tus preferencias se quedan acá.','Esta versión guarda únicamente el tema, el movimiento y tus favoritos en el almacenamiento local de este navegador. No usa analítica, cookies de seguimiento, fuentes externas ni envía datos a un servidor. Podés eliminar estas preferencias desde los datos del sitio de tu navegador.'],
  login: ['El acceso se conecta después.','Esta es una demostración de interfaz: no solicita contraseñas, no crea sesiones y no inventa un saldo. El botón está preparado para conectar tu sistema real de autenticación cuando integremos la API.'],
  register: ['La cuenta todavía no está conectada.','Esta plantilla no solicita contraseñas ni datos personales. El registro, la verificación de edad y la wallet deberán conectarse al backend antes de abrir el servicio a usuarios reales.'],
};
function showInfo(key,trigger) {
  const content = information[key];
  if (!content) return;
  $('#info-title').textContent = content[0];
  $('#info-body').textContent = content[1];
  openDialog($('#info-dialog'),trigger);
}
initializeWorlds(THEMES);

document.addEventListener('click',event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.category) {
    setCategory(button.dataset.category);
    if (button.closest('.rail')) $('#catalog').scrollIntoView({ block:'start' });
  } else if (button.dataset.favorite) {
    const id = button.dataset.favorite;
    const saved = preferences.favorites.includes(id);
    preferences.favorites = saved ? preferences.favorites.filter(value => value !== id) : [...preferences.favorites,id];
    persist(); renderCatalog();
    const replacement = $(`[data-favorite="${id}"]`);
    (replacement || $('.categories [data-category="favorites"]')).focus({ preventScroll:true });
    notify(saved ? 'Juego eliminado de favoritos.' : 'Juego guardado en favoritos.');
  } else if (button.dataset.preview) preview(button.dataset.preview,button);
  else if (button.id === 'open-studio' || button.hasAttribute('data-open-studio')) openDialog($('#studio-dialog'),button);
  else if (button.dataset.themeChoice) { preferences.theme = button.dataset.themeChoice; applyTheme(); persist(); syncThemeURL(); }
  else if (button.hasAttribute('data-close')) button.closest('dialog').close();
  else if (button.dataset.info) showInfo(button.dataset.info,button);
  else if (button.dataset.account) {
    document.dispatchEvent(new CustomEvent('temas:accountrequest',{ detail:{ action:button.dataset.account } }));
    showInfo(button.dataset.account,button);
  }
});
$('#search').addEventListener('input',event => { filters.query = event.target.value; renderCatalog(); });
$('#provider').addEventListener('change',event => { filters.provider = event.target.value; renderCatalog(); });
$('#sort').addEventListener('change',event => { filters.sort = event.target.value; renderCatalog(); });
$('#motion').addEventListener('change',event => { preferences.motion = event.target.checked; applyTheme(); persist(); });
$('#reset-appearance').addEventListener('click',() => { preferences.theme='base'; preferences.motion=true; applyTheme(); persist(); syncThemeURL(); });
$('#reset-filters').addEventListener('click',() => {
  filters.query=''; filters.provider='all'; filters.sort='featured';
  $('#search').value=''; $('#provider').value='all'; $('#sort').value='featured';
  setCategory('all'); $('#search').focus({ preventScroll:true });
});
// Native dialogs handle Escape, focus containment and inert background content.
for (const dialog of $$('dialog')) {
  dialog.addEventListener('click',event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
}
document.addEventListener('keydown',event => {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || $('dialog[open]')) return;
  if (event.target.closest('input,textarea,select,[contenteditable]')) return;
  event.preventDefault(); $('#search').focus();
});
applyTheme();
renderCatalog();
