import { ICON_FAMILIES, resolveIcon } from './icon-registry.mjs';

/** Presentation adapter: never changes IDs, click handlers, state, labels or tab order. */
export function initializeThemedIcons(doc=document){
 if(doc.documentElement.dataset.iconsInstalled==='true')return;
 doc.documentElement.dataset.iconsInstalled='true';
 const win=doc.defaultView,root=doc.documentElement;
 const status=new Map();
 const assets=Object.fromEntries(Object.keys(ICON_FAMILIES).map(id=>[id,globalThis.TEMAS_ICONS?.[id]||`assets/icons/${id}.avif`]));
 const used=new Set(),observers=[];
 let active=root.dataset.world||'pirates';

 const roleBySymbol=Object.freeze({compass:'home',grid:'games',bolt:'slots',live:'live',card:'table',star:'favorites',search:'search',user:'account',world:'worlds'});
 const categoryRoles=Object.freeze({all:'discover',slots:'slots',live:'live',table:'table',favorites:'favorites'});
 function paint(el){
  const meta=resolveIcon(el.dataset.iconWorld||active,el.dataset.iconRole);
  if(!meta)return;
  el.dataset.iconFamily=meta.world;el.dataset.iconGlyph=meta.glyph;
  el.style.setProperty('--icon-x',`${meta.x}%`);el.style.setProperty('--theme-icon-atlas',`url("${assets[meta.world]}")`);
  el.dataset.iconReady=status.get(meta.world)||'loading';
 }
 function create(role,fixedWorld){
  const el=doc.createElement('span');el.className='icon theme-icon';el.dataset.iconRole=role;
  el.setAttribute('aria-hidden','true');if(fixedWorld)el.dataset.iconWorld=fixedWorld;
  const art=doc.createElement('span');art.className='theme-icon-art';el.append(art);
  used.add(el);paint(el);return el;
 }
 function wrap(svg,role){
  if(svg.closest('.theme-icon'))return;
  const el=create(role);
  for(const c of svg.classList)el.classList.add(c);
  svg.replaceWith(el);svg.setAttribute('class','theme-icon-fallback');svg.setAttribute('focusable','false');el.append(svg);
 }
 function scan(scope=doc){
  for(const svg of scope.querySelectorAll('svg.icon,svg.brand-symbol')){
   if(svg.closest('.theme-icon'))continue;
   const href=svg.querySelector('use')?.getAttribute('href')||'';
   const category=svg.closest('[data-category]')?.dataset.category;
   const role=Object.hasOwn(categoryRoles,category)?categoryRoles[category]:svg.closest('[data-favorite]')?'favorites':svg.classList.contains('brand-symbol')?'home':roleBySymbol[href.replace('#i-','')];
   if(role)wrap(svg,role);
  }
 }
 function addNavigation(){
  for(const link of doc.querySelectorAll('.main-nav a,.main-nav button')){
   if(link.querySelector('.theme-icon'))continue;
   const role=link.hasAttribute('data-open-worlds')?'worlds':link.getAttribute('href')==='#catalog'?'games':'home';
   link.prepend(create(role));
  }
 }
 function decorateGallery(){
  for(const button of doc.querySelectorAll('[data-world-choice]')){
   const id=button.dataset.worldChoice;
   if(!Object.hasOwn(ICON_FAMILIES,id)||button.querySelector('.world-choice-icons'))continue;
   const strip=doc.createElement('span');strip.className='world-choice-icons';strip.setAttribute('aria-hidden','true');
   for(const glyph of ICON_FAMILIES[id].glyphs)strip.append(create(glyph,id));
   button.append(strip);
  }
 }
 function sweep(){for(const el of used)if(!el.isConnected)used.delete(el);}
 function refresh(event){
  const requested=event?.detail?.theme||root.dataset.world;
  if(Object.hasOwn(ICON_FAMILIES,requested))active=requested;
  scan();addNavigation();decorateGallery();sweep();for(const el of used)paint(el);
 }
 // Only direct child replacement by the existing render functions is observed.
 // Our nested icon edits cannot trigger this observer recursively.
 for(const id of ['games','world-teasers','world-gallery']){
  const target=doc.getElementById(id);if(!target)continue;
  const observer=new win.MutationObserver(()=>{scan(target);decorateGallery();sweep();});
  observer.observe(target,{childList:true});observers.push(observer);
 }
 doc.addEventListener('temas:themechange',refresh);
 refresh();
 for(const id of Object.keys(ICON_FAMILIES)){
  const probe=new win.Image();
  function settle(ok){
   status.set(id,ok?'true':'error');
   for(const el of used)if(el.dataset.iconFamily===id)paint(el);
   if(status.size===9)root.dataset.iconsReady=[...status.values()].every(v=>v==='true')?'true':'error';
  }
  probe.onload=()=>settle(probe.naturalWidth===384&&probe.naturalHeight===64);
  probe.onerror=()=>settle(false);probe.src=assets[id];
 }
 return {refresh,destroy(){observers.forEach(o=>o.disconnect());doc.removeEventListener('temas:themechange',refresh);used.clear();}};
}
if(typeof document!=='undefined')initializeThemedIcons();
