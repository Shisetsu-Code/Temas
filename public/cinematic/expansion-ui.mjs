/** Dynamic chrome: no fixed 9-world counters and no game state changes. */
export function initializeExpansionUI(ids){
 const count=ids.length;
 const link=document.createElement('link');link.rel='stylesheet';link.href='cinematic/expansion.css';
 if(!document.getElementById('expansion-styles'))document.head.append(link);
 document.querySelector('.demo-bar>span:first-child').textContent=`UNA EXPERIENCIA. ${count} UNIVERSOS.`;
 document.querySelector('.main-nav [data-open-worlds] > span:last-child').textContent=String(count);
 const page=document.querySelector('.world-pagination>span'),current=document.getElementById('page-current');
 page.replaceChildren(current,document.createTextNode(` / ${count}`));
 const title=document.querySelector('#world-dialog .eyebrow');title.textContent=`${count} MUNDOS. LA MISMA EXPERIENCIA.`;
 const explore=document.querySelector('.hero-cta [data-open-worlds]');
 const arrow=explore.querySelector('span');explore.replaceChildren(document.createTextNode(`Descubrir los ${count} mundos `),arrow);
 const toolbar=document.createElement('div');toolbar.className='universe-tools';
 const label=document.createElement('label');label.textContent='Encontrar una temática';
 const input=document.createElement('input');input.type='text';input.id='world-search';input.placeholder='Nombre, universo o identidad';input.autocomplete='off';input.maxLength=80;
 label.htmlFor=input.id;label.append(input);toolbar.append(label);
 const groups=document.createElement('div');groups.className='universe-groups';groups.setAttribute('role','group');groups.setAttribute('aria-label','Filtrar universos');
 let active='all';
 for(const [id,name] of [['all',`Todos (${count})`],['new','Nuevos (18)'],['original','Originales (9)']]){
  const button=document.createElement('button');button.type='button';button.textContent=name;button.dataset.universeGroup=id;button.setAttribute('aria-pressed',String(id===active));
  button.addEventListener('click',()=>{active=id;groups.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.universeGroup===id)));filter();});groups.append(button);
 }
 toolbar.append(groups);
 document.getElementById('world-gallery').before(toolbar);
 const empty=document.createElement('p');empty.id='world-empty';empty.className='world-empty';empty.hidden=true;empty.textContent='No encontramos esa temática. Probá con otro nombre.';empty.setAttribute('role','status');
 document.getElementById('world-gallery').after(empty);
 const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 function filter(){let visible=0;for(const card of document.querySelectorAll('[data-world-choice]')){
  const original=ids.indexOf(card.dataset.worldChoice)<9;
  card.hidden=(active==='new'&&original)||(active==='original'&&!original)||!normalize(card.getAttribute('aria-label')).includes(normalize(input.value));
  if(!card.hidden)visible++;
 }empty.hidden=visible>0;}
 input.addEventListener('input',filter);
 const note=document.querySelector('#world-dialog .dialog-footer>span');note.textContent='27 plantillas · Conceptos visuales · Demo 18+';
}
