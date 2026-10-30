import { WORLDS, WORLD_IDS, GAMES, COVER_WORLDS, filterGames, resolveWorld, normalizeState } from './schema.mjs';
import { Atmosphere } from './motion.mjs';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY='temas:v1';
let state;try{state=normalizeState(JSON.parse(localStorage.getItem(KEY)));}catch{state=normalizeState(null);}
const requested=new URLSearchParams(location.search).get('theme');
state.theme=resolveWorld(requested,state.theme);
const filters={query:'',category:'all',provider:'all',sort:'featured',favoritesOnly:false};
let applied=null,epoch=0,toastTimer;
const atmosphere=new Atmosphere($('#atmosphere'),$('#hero'));
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function icon(name){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('class','icon');s.setAttribute('aria-hidden','true');const u=document.createElementNS(s.namespaceURI,'use');u.setAttribute('href',`#i-${name}`);s.append(u);return s;}
// Offline export supplies only application-owned data URLs. HTTP deployment uses local AVIF files.
const art=id=>globalThis.TEMAS_ART?.[id]||WORLDS[id].art;
function image(id,cls=''){const img=node('img',cls);img.alt='';img.loading='lazy';img.decoding='async';img.src=art(id);img.addEventListener('error',()=>{img.hidden=true;});return img;}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{/* Private/restricted browsing keeps working. */}}
function syncURL(){try{if(!['http:','https:'].includes(location.protocol))return;const url=new URL(location.href);url.searchParams.set('theme',state.theme);history.replaceState(null,'',url);}catch{/* Sandboxed/offline preview. */}}
function notify(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;toastTimer=setTimeout(()=>{$('#toast').hidden=true;},2600);}
function motionLabel(){const reduced=atmosphere.query.matches;$('#motion-label').textContent=state.motion?(reduced?'reducido':'activo'):'pausado';$('#motion-toggle').setAttribute('aria-pressed',String(state.motion));$('#motion-toggle').setAttribute('aria-label',state.motion?'Pausar ambiente':'Activar ambiente');$('#motion-toggle use').setAttribute('href',state.motion?'#i-pause':'#i-play');}
atmosphere.query.addEventListener('change',motionLabel);

async function setWorld(value,{save=false}={}){
 const id=resolveWorld(value);const version=++epoch;
 if(id!==applied){
  const preload=new Image();preload.src=art(id);let loaded=true;
  try{await preload.decode();}catch{loaded=false;}
  if(version!==epoch)return false;
  const w=WORLDS[id];state.theme=id;applied=id;
  const root=document.documentElement;
  root.dataset.world=id;
  ['--bg','--panel','--accent','--ink','--muted'].forEach((key,i)=>root.style.setProperty(key,w.colors[i]));
  $('meta[name="theme-color"]').content=w.colors[0];
  document.title=`${w.brand} — ${w.name} · Demo visual`;
  $$('.brand-name').forEach(n=>n.textContent=w.brand);
  $$('.brand-symbol use').forEach(n=>n.setAttribute('href',`#i-${w.emblem}`));
  $('.brand-signature').textContent=w.signature;
  $('#hero-title').replaceChildren(node('span','',w.title[0]),node('em','',w.title[1]));
  $('#hero-description').textContent=w.copy;
  $('.hero-copy .eyebrow').replaceChildren(node('span','eyebrow-line'),document.createTextNode(w.signature));
  $('#hero-signature').textContent=w.signature;
  $('#world-number').textContent=$('#page-current').textContent=String(w.index+1).padStart(2,'0');
  $('#world-label').textContent=w.name.toLocaleUpperCase('es');
  const heroImg=$('#scene-image');heroImg.hidden=!loaded;heroImg.src=art(id);
  $('.art-fallback').hidden=loaded;
  $('#hero').style.setProperty('--scene-url',loaded?`url("${art(id)}")`:'none');
  atmosphere.setTheme(w.effect,w.light?'#9b234f':w.colors[2]);
  $$('[data-world-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.worldChoice===id)));
  renderTeasers();
  $('#theme-announcement').textContent=`Universo ${w.name} activado.`;
 }
 atmosphere.setEnabled(state.motion);motionLabel();
 if(save){persist();syncURL();}
 document.dispatchEvent(new CustomEvent('temas:themechange',{detail:{theme:state.theme,motion:state.motion}}));
 return true;
}
$('#scene-image').addEventListener('error',()=>{$('#scene-image').hidden=true;$('.art-fallback').hidden=false;$('#hero').style.setProperty('--scene-url','none');});

function renderCatalog(){
 const games=filterGames(GAMES,{...filters,favorites:state.favorites}),f=document.createDocumentFragment();
 for(const game of games){
  const card=node('article','game-card'),open=node('button','game-open');open.type='button';open.dataset.preview=game.id;
  open.setAttribute('aria-label',`Ver ${game.name}`);open.setAttribute('aria-haspopup','dialog');
  const cover=node('div','game-cover');cover.setAttribute('aria-hidden','true');
  cover.append(image(COVER_WORLDS[game.id]),node('span','cover-badge',game.label.toLocaleUpperCase('es')),node('span','cover-title',game.name),node('span','cover-line'));
  const meta=node('div','game-meta'),copy=node('div');copy.append(node('h3','',game.name),node('p','',game.provider));meta.append(copy,icon('up'));open.append(cover,meta);
  const favorite=node('button','favorite');favorite.type='button';favorite.dataset.favorite=game.id;
  const selected=state.favorites.includes(game.id);favorite.setAttribute('aria-pressed',String(selected));favorite.setAttribute('aria-label',`${selected?'Quitar':'Guardar'} ${game.name} ${selected?'de':'en'} favoritos`);favorite.append(icon('star'));
  card.append(open,favorite);f.append(card);
 }
 $('#games').replaceChildren(f);$('#empty-state').hidden=games.length!==0;
 $('#results-count').textContent=`${games.length} ${games.length===1?'experiencia':'experiencias'} de muestra`;
 $('#favorites-count').textContent=String(state.favorites.length);
}
function category(id){
 filters.category=['slots','live','table'].includes(id)?id:'all';filters.favoritesOnly=id==='favorites';
 $$('[data-category]').forEach(b=>{const selected=b.dataset.category===id;b.setAttribute('aria-pressed',String(selected));b.classList.toggle('active',selected);});
 renderCatalog();
}
function renderGallery(){
 const f=document.createDocumentFragment();
 for(const id of WORLD_IDS){
  const w=WORLDS[id],button=node('button','world-choice');button.type='button';button.dataset.worldChoice=id;
  button.setAttribute('aria-pressed',String(id===state.theme));button.setAttribute('aria-label',`${w.name} — ${w.brand}`);
  const copy=node('span');copy.append(node('strong','',w.name),node('small','',w.brand));
  button.append(image(id),node('span','choice-number',String(w.index+1).padStart(2,'0')),copy);f.append(button);
 }
 $('#world-gallery').replaceChildren(f);
}
function renderTeasers(){
 const start=WORLD_IDS.indexOf(state.theme),f=document.createDocumentFragment();
 for(let i=1;i<=3;i++){
  const id=WORLD_IDS[(start+i)%WORLD_IDS.length],w=WORLDS[id],b=node('button','teaser');b.type='button';b.dataset.teaser=id;b.setAttribute('aria-label',`Explorar ${w.name}`);
  b.append(image(id),node('small','',`UNIVERSO ${String(w.index+1).padStart(2,'0')}`),node('strong','',w.name),icon('up'));f.append(b);
 }
 $('#world-teasers').replaceChildren(f);
}
function openDialog(dialog,trigger){
 if(dialog.open)return;
 dialog.showModal();document.body.style.overflow='hidden';atmosphere.setModal(true);
 dialog.addEventListener('close',()=>{
  const open=Boolean($('dialog[open]'));atmosphere.setModal(open);if(!open)document.body.style.overflow='';
  if(trigger?.isConnected)trigger.focus({preventScroll:true});
 },{once:true});
}
const information={
 login:['Tu acceso, próximamente.','Esta versión muestra la interfaz: no solicita contraseñas, no crea sesiones y no inventa un saldo. El acceso se conectará al sistema de autenticación real.'],
 register:['La experiencia empieza en el diseño.','El registro y la verificación de edad todavía no están conectados. Esta demo no solicita datos personales, contraseñas ni depósitos.'],
 about:['Nueve universos. Una base real.','Esta edición integra la dirección visual aprobada en una web funcional. Las ilustraciones proceden de recortes del concepto generado en esta conversación; no son renders individuales de alta resolución. Las escenas, personajes y marcas son de muestra. La animación ambiental usa CSS y partículas: no es animación 3D ni esqueletal.'],
 responsible:['Explorar con responsabilidad.','Demo visual para mayores de 18 años, sin apuestas ni premios reales. El juego no es una fuente de ingresos. Un servicio operativo necesitará verificación de edad, límites, autoexclusión y recursos de ayuda adecuados a su jurisdicción.'],
 privacy:['Tus preferencias se quedan acá.','El tema, los favoritos y el movimiento se guardan únicamente en este navegador. No hay seguimiento, fuentes externas ni envío de datos de cuenta. Podés borrar las preferencias eliminando los datos del sitio.'],
};
function info(id,trigger){if(!Object.hasOwn(information,id))return;const [title,body]=information[id];$('#info-title').textContent=title;$('#info-body').textContent=body;if(['login','register'].includes(id))document.dispatchEvent(new CustomEvent('temas:accountrequest',{detail:{action:id}}));openDialog($('#info-dialog'),trigger);}
function preview(id,trigger){
 const g=GAMES.find(g=>g.id===id);if(!g)return;
 $('#game-title').textContent=g.name;$('#game-provider').textContent=g.provider.toLocaleUpperCase('es');$('#game-image').src=art(COVER_WORLDS[id]);
 openDialog($('#game-dialog'),trigger);document.dispatchEvent(new CustomEvent('temas:preview',{detail:{gameId:id}}));
}
document.addEventListener('click',async event=>{
 const b=event.target.closest('button');if(!b)return;
 if(b.dataset.category){category(b.dataset.category);return;}
 if(b.dataset.favorite){
  const id=b.dataset.favorite;if(!GAMES.some(g=>g.id===id))return;
  const saved=state.favorites.includes(id);state.favorites=saved?state.favorites.filter(v=>v!==id):[...state.favorites,id];persist();renderCatalog();
  ($(`[data-favorite="${id}"]`)||$('[data-category="favorites"]')).focus({preventScroll:true});notify(saved?'Eliminado de tus favoritos.':'Guardado en tus favoritos.');return;
 }
 if(b.dataset.preview){preview(b.dataset.preview,b);return;}
 if(b.id==='world-trigger'||b.hasAttribute('data-open-worlds')){openDialog($('#world-dialog'),b);return;}
 if(b.dataset.worldChoice){if(await setWorld(b.dataset.worldChoice,{save:true}))$('#world-dialog').close();return;}
 if(b.dataset.teaser){if(await setWorld(b.dataset.teaser,{save:true})){$('#hero-title').tabIndex=-1;$('#hero-title').focus({preventScroll:true});$('#hero').scrollIntoView({behavior:state.motion&&!atmosphere.query.matches?'smooth':'auto'});}return;}
 if(b.id==='world-prev'||b.id==='world-next'){const direction=b.id==='world-next'?1:-1;await setWorld(WORLD_IDS[(WORLD_IDS.indexOf(state.theme)+direction+WORLD_IDS.length)%WORLD_IDS.length],{save:true});return;}
 if(b.id==='motion-toggle'){state.motion=!state.motion;atmosphere.setEnabled(state.motion);motionLabel();persist();document.dispatchEvent(new CustomEvent('temas:themechange',{detail:{theme:state.theme,motion:state.motion}}));return;}
 if(b.hasAttribute('data-close')){b.closest('dialog').close();return;}
 if(b.dataset.info)info(b.dataset.info,b);
});
$('#search').addEventListener('input',e=>{filters.query=e.target.value;renderCatalog();});
$('#provider').addEventListener('change',e=>{filters.provider=e.target.value;renderCatalog();});
$('#sort').addEventListener('change',e=>{filters.sort=e.target.value;renderCatalog();});
$('#reset-filters').addEventListener('click',()=>{Object.assign(filters,{query:'',provider:'all',sort:'featured'});$('#search').value='';$('#provider').value='all';$('#sort').value='featured';category('all');$('#search').focus({preventScroll:true});});
for(const dialog of $$('dialog'))dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!$('dialog[open]')&&!e.target.closest('input,select,textarea,[contenteditable]')){e.preventDefault();$('#search').focus();}});
async function init(){renderCatalog();renderGallery();await setWorld(state.theme);document.documentElement.dataset.ready='true';}
init().catch(()=>{document.documentElement.dataset.ready='error';$('#results-count').textContent='No se pudo iniciar la vista. Recargá la página.';});
