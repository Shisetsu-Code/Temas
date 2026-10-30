import { WORLD_THEMES } from './worlds.mjs';
import { scene, emblem } from './art.mjs';

const q = selector => document.querySelector(selector);
const qa = selector => [...document.querySelectorAll(selector)];
const text = (selector,value) => { q(selector).textContent=value; };
let originals=[];
let originalTitle='';
let originalPreview;
let current=null;

function make(tag, className, content) {
  const el=document.createElement(tag);
  if(className) el.className=className;
  if(content!==undefined) el.textContent=content;
  return el;
}
// Only generated, trusted SVG from art.mjs enters this parser, never catalogue/user content.
function vector(markup) {
  const template=document.createElement('template');
  template.innerHTML=markup;
  return template.content.firstElementChild;
}
function restore() {
  for(const {node,children,label} of originals) {
    node.replaceChildren(...children.map(child=>child.cloneNode(true)));
    if(label===null) node.removeAttribute('aria-label'); else node.setAttribute('aria-label',label);
  }
  const button=q('.spotlight .round-button');
  button.removeAttribute('data-open-studio');
  button.dataset.preview=originalPreview.id;
  button.setAttribute('aria-label',originalPreview.label);
  document.title=originalTitle;
}

export function initializeWorlds(themes) {
  if(q('.world-scene')) return;
  originalTitle=document.title;
  const selectors=['.wordmark','.monogram','.hero .eyebrow','.hero h1','.hero-description','.hero-foot>span:first-child','.spotlight-heading .eyebrow','.spotlight-art','.spotlight-bottom .mini-label','.spotlight-bottom h2','.strip-mark','.editorial-strip .eyebrow','#strip-title','.strip-right p'];
  originals=selectors.flatMap(selector=>qa(selector).map(node=>({node,children:[...node.childNodes].map(child=>child.cloneNode(true)),label:node.getAttribute('aria-label')})));
  const button=q('.spotlight .round-button');
  originalPreview={id:button.dataset.preview,label:button.getAttribute('aria-label')};
  const layer=make('div','world-scene');
  layer.setAttribute('aria-hidden','true');
  q('.hero').prepend(layer);

  const entry=make('button','world-trigger');
  entry.type='button';entry.setAttribute('data-open-studio','');entry.setAttribute('aria-label','Cambiar mundo');entry.setAttribute('aria-haspopup','dialog');
  entry.append(make('span','world-trigger-dot'),make('span','world-current-name','Estudio'),make('span','world-trigger-action','Cambiar mundo ↗'));
  q('.intro-line').lastElementChild.replaceWith(entry);
  text('#studio-title','Elegí tu universo.');
  text('#studio-dialog .eyebrow','NUEVE MUNDOS / UNA EXPERIENCIA');
  text('#studio-dialog .dialog-copy','Cambiá de identidad sin perder tu lugar. El catálogo y tus favoritos siempre te acompañan.');
  text('#studio-dialog .small-note','Demo 18+. Las identidades son conceptos visuales. El movimiento reducido de tu dispositivo tiene prioridad sobre este control.');
  const grid=q('#theme-options');
  grid.className='world-options';grid.replaceChildren();
  for(const [id,theme] of Object.entries(WORLD_THEMES)) {
    const option=make('button','world-option');
    option.type='button';option.dataset.themeChoice=id;option.setAttribute('data-world-option','');
    option.setAttribute('aria-label',`${theme.name} — ${theme.brand}`);
    option.style.setProperty('--option-accent',theme.tokens['--accent']);
    option.style.setProperty('--option-hero',theme.tokens['--hero']);
    option.style.setProperty('--option-page',theme.tokens['--page']);
    const preview=make('span','world-option-preview');
    preview.setAttribute('aria-hidden','true');
    preview.append(vector(scene(id,`option-${id}`)),make('span','world-option-number',theme.number),make('span','world-selected','✓'));
    const copy=make('span','world-option-copy');
    copy.append(make('strong','',theme.name),make('small','',theme.brand));
    option.append(preview,copy);grid.append(option);
  }
  const legacy=make('div','legacy-palettes');
  legacy.setAttribute('aria-label','Paletas originales');
  for(const id of ['base','ascua','abisal']) {
    const theme=themes[id], option=make('button','legacy-option');
    option.type='button';option.dataset.themeChoice=id;
    const swatch=make('span','legacy-swatch');swatch.style.background=theme.tokens['--accent'];swatch.setAttribute('aria-hidden','true');
    option.append(swatch,document.createTextNode(theme.name));legacy.append(option);
  }
  grid.after(legacy);
  const active=make('p','world-active-status');active.id='world-active-status';active.setAttribute('role','status');active.setAttribute('aria-live','polite');
  q('#studio-dialog .dialog-copy').after(active);
  const close=make('button','button button-primary','Ver mi mundo');close.type='button';close.setAttribute('data-close','');
  const actions=make('div','studio-actions');
  q('#reset-appearance').before(actions);actions.append(q('#reset-appearance'),close);
  function visibility(){document.documentElement.dataset.pageHidden=String(document.hidden);}
  document.addEventListener('visibilitychange',visibility);visibility();
}

/** Replace only presentation. Never rerender or mutate catalogue/filter/favorite state. */
export function applyWorld(id, paletteName='Estudio') {
  if(current===id) return;
  current=id;
  restore();
  const active=Object.hasOwn(WORLD_THEMES,id);
  document.documentElement.dataset.world=active?id:'base';
  document.documentElement.dataset.worldFont=active?WORLD_THEMES[id].font:'sans';
  const layer=q('.world-scene');layer.replaceChildren();
  q('.hero-foot>span:last-child').dataset.number=active?WORLD_THEMES[id].number:'01';
  text('.world-current-name',active?WORLD_THEMES[id].name:paletteName);
  text('#world-active-status',`Activo: ${active?WORLD_THEMES[id].name:paletteName}`);
  if(!active) return;
  const theme=WORLD_THEMES[id];
  document.title=`${theme.brand} — ${theme.name} · Demo visual`;
  for(const node of qa('.wordmark')) {
    node.replaceChildren(document.createTextNode(theme.brand),make('span','',theme.signature));
    node.setAttribute('aria-label',`${theme.brand}, inicio`);
  }
  q('.monogram').replaceChildren(vector(emblem(id)));
  q('.monogram').setAttribute('aria-label',`${theme.brand}, inicio`);
  text('.hero .eyebrow',theme.eyebrow);
  q('.hero h1').replaceChildren(document.createTextNode(theme.title[0]),document.createElement('br'),make('em','',theme.title[1]));
  text('.hero-description',theme.copy);
  text('.hero-foot>span:first-child',theme.caption);
  layer.append(vector(scene(id,`hero-${id}`)));
  text('.spotlight-heading .eyebrow',`IDENTIDAD / ${theme.number}`);
  const medallion=make('div','world-medallion');medallion.append(vector(emblem(id)));
  q('.spotlight-art').replaceChildren(make('span','world-side-number',theme.number),medallion);
  text('.spotlight-bottom .mini-label',theme.name.toLocaleUpperCase('es'));
  text('.spotlight-bottom h2',theme.side);
  const button=q('.spotlight .round-button');
  delete button.dataset.preview;button.setAttribute('data-open-studio','');button.setAttribute('aria-label','Explorar otros mundos');
  q('.strip-mark').replaceChildren(vector(emblem(id)));
  text('.editorial-strip .eyebrow',`${theme.brand} / ${theme.name.toLocaleUpperCase('es')}`);
  q('#strip-title').replaceChildren(document.createTextNode('El mismo espacio.'),document.createElement('br'),document.createTextNode('Un nuevo universo.'));
  text('.strip-right p',theme.description);
}
