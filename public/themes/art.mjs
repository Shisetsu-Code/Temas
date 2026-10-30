import { WORLD_THEMES } from './worlds.mjs';

// All markup here is application-owned vector artwork. Never interpolate API/user HTML.
const ring = (x,y,r,color,opacity='.3') => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${color}" opacity="${opacity}"/>`;
const stars = (color) => Array.from({length:27},(_,i)=>`<circle cx="${48+(i*137)%555}" cy="${25+(i*73)%365}" r="${i%4===0?2:1}" fill="${color}" opacity="${.25+(i%4)*.15}"/>`).join('');
function gear(x,y,r,teeth,p,reverse=false) {
  const spokes=Array.from({length:teeth},(_,i)=>`<rect x="-7" y="-${r+7}" width="14" height="18" rx="2" transform="rotate(${i*360/teeth})"/>`).join('');
  return `<g transform="translate(${x} ${y})"><g class="${reverse?'world-spin-reverse':'world-spin'}" fill="url(#${p}-metal)">${spokes}<circle r="${r}"/><circle r="${r-12}" fill="url(#${p}-shade)"/><circle r="${r-21}" fill="none" stroke="#d5b77b" opacity=".5"/>${Array.from({length:5},(_,i)=>`<path d="M-5-5V-${r-13}h10V5Z" transform="rotate(${i*72})"/>`).join('')}<circle r="15"/><circle r="5" fill="#302d23"/></g></g>`;
}
const emblems = {
  pirates:'<path d="M50 12v61M31 41h38M17 61c0 23 22 28 33 30 11-2 33-7 33-30M17 61l-5 15m5-15 13 8m53-8 5 15m-5-15-13 8"/><circle cx="50" cy="18" r="8"/>',
  olympus:'<path d="m59 8-33 45h21l-8 39 35-51H52Z"/><path d="M20 77c-15-25-12-40 3-58m57 58c15-25 12-40-3-58"/><path d="m18 65-9-4m10-6-10-5m12-5-9-6m12-5-7-6m65 37 9-4m-10-6 10-5m-12-5 9-6m-12-5 7-6"/>',
  cyberpunk:'<path d="M25 18h50l15 17v40L75 90H25L10 75V35Z"/><path d="M25 40h50v20H25Zm8 32h34M37 47v6m26-6v6M42 18V8m16 10V8"/>',
  steampunk:'<path d="m42 8 16 0 3 12 12 7 12-3 8 14-9 9v13l9 8-8 14-12-3-12 7-3 12H42l-3-12-12-7-12 3-8-14 9-8V47l-9-9 8-14 12 3 12-7Z"/><circle cx="50" cy="53" r="22"/><path d="M50 36v18l11 7"/>',
  space:'<path d="M22 36C22 1 78 1 78 36c0 23-20 51-28 57-8-6-28-34-28-57Z"/><path d="M32 37c15 0 16 19 13 20-11 0-19-10-13-20Zm36 0c-15 0-16 19-13 20 11 0 19-10 13-20Z"/><path d="M44 73h12"/>',
  western:'<path d="m50 9 10 25 27-4-18 21 18 21-27-4-10 25-10-25-27 4 18-21-18-21 27 4Z"/><circle cx="50" cy="51" r="14"/>',
  candy:'<path d="M28 33c14-16 30-16 44 0v34c-14 16-30 16-44 0ZM28 36 9 23v54l19-13m44-28 19-13v54L72 64M35 28l30 44M29 44l22 32M49 24l22 32"/>',
  dinosaurs:'<path d="M15 58c3-31 31-43 54-35l19 12v22H69L56 73H33L21 85v-23M42 31l7 14-16 2M61 36l13 6-3 9-12-3M69 57v12m-9-6v13M35 73l-4-13"/>',
  phoenix:'<path d="M50 37 43 23l9-11 13 8-11 8 4 16M47 42C30 36 17 27 9 10c-4 29 9 46 30 49L16 49c8 19 18 23 29 22L35 91l15-16 15 16-10-20c11 1 21-3 29-22L61 59c21-3 34-20 30-49-8 17-21 26-38 32"/>',
};
export function emblem(id) {
  if (!Object.hasOwn(emblems,id)) throw new RangeError('Unknown world');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${emblems[id]}</svg>`;
}

const bodies = {
  pirates: p => `
    <circle cx="385" cy="185" r="158" fill="url(#${p}-halo)"/>
    <g stroke="#82b7ab" fill="none" opacity=".16"><circle cx="335" cy="230" r="181"/><circle cx="335" cy="230" r="142"/><path d="M60 230h535M335 30v390M149 100l373 263M149 363 522 100"/></g>
    <circle cx="443" cy="103" r="44" fill="#d4d7b2" opacity=".7"/><circle cx="462" cy="88" r="42" fill="#143f42"/>
    <path d="m30 345 84-100 41 64 62-93 66 127 94-111 62 101 76-114 96 125v79H30Z" fill="#102e33" opacity=".7"/>
    <g class="world-bob">
      <path d="M155 310h354l-50 62H239l-58-23Z" fill="url(#${p}-shade)" stroke="#c4a76b" stroke-width="2"/>
      <path d="m176 325 304 2-17 21H215Z" fill="#8d6940"/><path d="m217 351 240 0-10 12H237Z" fill="#413b2c"/>
      <path d="M297 101v218M393 131v188M220 197v118" stroke="#ccb784" stroke-width="4"/>
      <path d="m300 119 78 145-77 19ZM291 122l-82 144 82 17Z" fill="#e1d3a7"/>
      <path d="m300 119 31 68-30 96ZM291 122l-22 146 22 15Z" fill="#bdab7a"/>
      <path d="m397 147 69 135-69 10ZM387 149l-58 133 58 11Z" fill="#253c37" stroke="#9aa67b" stroke-width="1"/>
      <path d="m220 215-51 72h51Z" fill="#d2c093"/>
      <path d="M298 101c20-22 40 7 63-6v27c-23 13-42-17-63 3" fill="#112328" stroke="#d4be81"/>
      <g fill="#ad915b">${[248,279,310,341,372,403,434].map(x=>`<circle cx="${x}" cy="337" r="4"/>`).join('')}</g>
      <path d="m153 309-25-18 72 19M394 145l87 169M298 121l-105 190M297 109l-77 201" stroke="#b0b091" stroke-width="1" opacity=".7"/>
      <path d="m483 304 47-29M451 306v-28h33v25" stroke="#bea276" stroke-width="3"/>
    </g>
    <g class="world-wave" fill="none" stroke="#8dbab0" opacity=".4"><path d="M84 383q40-15 80 0t80 0t80 0t80 0t80 0t80 0"/><path d="M120 401q35-10 70 0t70 0t70 0t70 0t70 0"/></g>
    <g transform="translate(535 94)" stroke="#dbc38a" fill="none" opacity=".7"><circle r="28"/><path d="m0-42 6 36 36 6-36 6-6 36-6-36-36-6 36-6Z"/><circle r="5"/></g>
    ${stars('#d6cea7')}`,
  olympus: p => `
    <circle cx="352" cy="202" r="152" fill="url(#${p}-halo)"/>
    <circle cx="352" cy="202" r="126" fill="none" stroke="#e7c986" opacity=".4"/>
    <circle cx="352" cy="202" r="143" fill="none" stroke="#e7c986" stroke-dasharray="1 9" opacity=".6"/>
    <path d="m42 358 94-147 46 69 66-150 77 155 75-98 72 112 74-96 86 154Z" fill="#35425a" opacity=".8"/>
    <path d="M163 351h376l-20-17H182ZM178 332h344v-13H178Z" fill="url(#${p}-stone)"/>
    <path d="m160 166 191-93 191 93Z" fill="url(#${p}-stone)"/><path d="m191 155 160-68 159 68Z" fill="#384862"/><path d="m232 145 119-48 118 48Z" stroke="#c7b887" fill="none"/>
    ${[191,248,431,488].map(x=>`<g><rect x="${x}" y="179" width="26" height="137" fill="url(#${p}-stone)"/><path d="M${x+7} 185v125m12-125v125" stroke="#717f94"/><rect x="${x-6}" y="170" width="38" height="13" fill="#d3d2c2"/><rect x="${x-6}" y="311" width="38" height="10" fill="#b9c2be"/></g>`).join('')}
    <path d="M158 165h385v11H158Z" fill="#dfd6b5"/>
    <g class="world-hover"><path d="m369 147-67 102h45l-17 81 81-123h-48l23-60Z" fill="url(#${p}-metal)" stroke="#fff1b7" stroke-width="1.5"/><path d="m369 147-46 87h37l-30 96 17-81h-45Z" fill="#fce4a5" opacity=".7"/></g>
    <g class="world-cloud" fill="#8d9db5" opacity=".16"><ellipse cx="177" cy="361" rx="140" ry="29"/><ellipse cx="408" cy="370" rx="178" ry="33"/><ellipse cx="325" cy="401" rx="240" ry="19"/></g>
    <g stroke="#d3bc7b" fill="none" stroke-width="2" opacity=".8"><path d="M269 300c-50-17-62-63-34-97m199 97c50-17 62-63 34-97"/>${[0,1,2,3,4].map(i=>`<path d="m${246-i*3} ${278-i*15}-18-9 16 1m${211+i*3} ${278-i*15}18-9-16 1"/>`).join('')}</g>` ,
  cyberpunk: p => `
    <circle cx="379" cy="188" r="153" fill="url(#${p}-halo)"/>
    <g fill="#122a3b" stroke="#245568">${[0,1,2,3,4,5,6,7,8].map(i=>{const x=80+i*61,y=138+(i*43)%128;return `<path d="M${x} 387V${y}h43v${387-y}Z"/><path d="M${x+12} ${y+16}v60m15-60v100" stroke="${i%2?'#ff5aaa':'#7df8e1'}" opacity=".35"/>`;}).join('')}</g>
    <g stroke="#4ac3ce" fill="none" opacity=".2"><path d="M35 430h595M80 405h515M115 388h440M140 376h390"/>${[50,160,270,380,490,600].map(x=>`<path d="M330 355 ${x} 440"/>`).join('')}</g>
    <g class="world-hover">
      <path d="m266 123 135-8 53 56 5 128-44 51-139-3-49-49-1-116Z" fill="url(#${p}-shade)" stroke="#8cf8e3" stroke-width="2"/>
      <path d="m271 129 128-7 28 34-170 7Z" fill="#275264"/><path d="m241 207 200-9-2 58-195 8Z" fill="#07141d" stroke="#3b6c7e"/>
      <path d="m259 218 74-4-2 17-70 6ZM355 213l67-3-2 17-67 7Z" fill="#7df9e5"/>
      <path d="m243 271 32 65 128 5 39-59-35 28-114-2Z" fill="#1c3b4b"/>
      <path d="M300 290h84M299 300h85M307 311h68" stroke="#f576ba" stroke-width="3"/>
      <path d="M227 202h-22v75h25m227-88h20v78h-19M298 121V87m66 30V75" stroke="#8ad5d9" stroke-width="4"/>
      <path d="m233 187 10-25m201 117 7-27M266 135l-21 21m174-21 17 18" stroke="#f858b0" stroke-width="5"/>
      <circle cx="365" cy="74" r="5" fill="#e77ac2"/><circle cx="299" cy="87" r="4" fill="#74f5e3"/>
      <path class="world-scan" d="M240 185h201" stroke="#72fff1" stroke-width="2" opacity=".5"/>
    </g>
    <g class="world-rain" stroke="#66d4da" opacity=".3">${[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<path d="m${70+i*51} ${30+(i*47)%280}-8 31"/>`).join('')}</g>
    <g fill="none" stroke="#d561a2" opacity=".6"><path d="M173 153v-37h42m245 216h43v-39"/><circle cx="488" cy="100" r="26"/><path d="M476 100h24m-12-12v24"/></g>` ,
  steampunk: p => `
    <circle cx="351" cy="239" r="175" fill="url(#${p}-halo)"/>
    <g stroke="#ba9a61" fill="none" opacity=".2"><circle cx="359" cy="261" r="139"/><circle cx="359" cy="261" r="157"/><path d="M30 261h570M359 40v390M82 82h469v338H82Z"/></g>
    <path d="M140 380v-55a32 32 0 0 1 32-32h40m311 89v-116a23 23 0 0 0-23-23h-35" fill="none" stroke="#766244" stroke-width="14"/><path d="M141 379v-56a31 31 0 0 1 31-31h40" fill="none" stroke="#b69e6d" stroke-width="3"/>
    ${gear(360,269,102,16,p)}${gear(212,319,49,10,p,true)}${gear(490,210,40,9,p,true)}
    <g transform="translate(360 269)"><circle r="60" fill="#202f29" stroke="#dfbd7d" stroke-width="3"/><circle r="51" fill="none" stroke="#bf9f69" stroke-dasharray="2 7"/><path d="M0-40V0l28 16" stroke="#e9cf94" stroke-width="3"/><circle r="6" fill="#d4ad69"/></g>
    <g class="world-bob"><path d="m139 143 27-24v48l-27-15Z" fill="#665e43"/><ellipse cx="304" cy="137" rx="147" ry="52" fill="url(#${p}-metal)"/><ellipse cx="304" cy="135" rx="129" ry="43" fill="none" stroke="#6d6146"/><path d="M158 137h291M189 111h229M189 162h229" stroke="#756647" opacity=".6"/><ellipse cx="304" cy="137" rx="65" ry="51" fill="none" stroke="#756647"/><path d="m256 183 9 27h67l18-27" fill="#413d2e" stroke="#c5a970"/><path d="m264 210 9 9h49l10-9" fill="#d2ab67"/><circle cx="284" cy="197" r="4" fill="#e8cf98"/><circle cx="308" cy="197" r="4" fill="#e8cf98"/></g>
    <g fill="#e8ce9c" opacity=".6">${[92,544,138,503].map((x,i)=>`<circle cx="${x}" cy="${91+i*74}" r="3"/>`).join('')}</g>
    <path d="M115 398h429M162 410h333" stroke="#967e56" opacity=".3"/>` ,
  space: p => `
    <circle cx="360" cy="210" r="190" fill="url(#${p}-halo)"/>
    ${stars('#ded6ff')}
    <g transform="rotate(-24 406 314)"><ellipse cx="406" cy="314" rx="170" ry="49" fill="none" stroke="#8273b4" stroke-width="15" opacity=".45"/><circle cx="406" cy="314" r="91" fill="url(#${p}-planet)"/><path d="M277 295c-60 64 204 103 289 29" fill="none" stroke="#b4a1d7" stroke-width="10" opacity=".7"/></g>
    <g class="world-hover">
      <path d="m208 223-47 118c53 40 166 40 219 0l-49-118Z" fill="url(#${p}-beam)" opacity=".3"/>
      <path d="M205 190c-8-81 135-81 128 0" fill="#6cbbba" opacity=".55" stroke="#d8f6ed" stroke-width="2"/>
      <g><path d="M243 171c-15-44 68-48 53 0-4 15-19 28-26 28s-22-13-27-28Z" fill="#c8e9d2"/><path d="M249 158c14 0 17 13 14 15-10 0-17-8-14-15Zm42 0c-14 0-17 13-14 15 10 0 17-8 14-15Z" fill="#293d4a"/><path d="M266 185h8" stroke="#5c7070"/></g>
      <ellipse cx="269" cy="208" rx="117" ry="29" fill="url(#${p}-metal)"/><ellipse cx="269" cy="196" rx="117" ry="29" fill="#80749e"/><ellipse cx="269" cy="190" rx="79" ry="23" fill="url(#${p}-stone)"/><path d="M153 206c24 28 206 34 232 0" fill="none" stroke="#ccbbe4" stroke-width="2"/>
      ${[188,227,269,311,349].map(x=>`<ellipse cx="${x}" cy="212" rx="6" ry="3" fill="#a9f7dc"/>`).join('')}
    </g>
    <circle cx="495" cy="81" r="32" fill="url(#${p}-planet)"/><circle cx="135" cy="271" r="14" fill="#8b7ca8"/>
    <g fill="none" stroke="#d4c2ed" opacity=".6"><path d="M173 70v20m-10-10h20m367 130v14m-7-7h14"/><path d="M68 364q110-10 124 39" stroke-dasharray="3 7"/></g>` ,
  western: p => `
    <circle cx="373" cy="165" r="104" fill="url(#${p}-sunset)"/>
    <path d="m30 322 65-114 38-8 30 43 52-20 44 70 41-21 18-67 45-26 30 12 28 81 40-26 42 34 23-76 57-9 57 118v108H30Z" fill="#8a5337" opacity=".6"/>
    <path d="m99 339 54-57 34 19 29-52 55 27 38 50 33-19 42 30 73-56 28 28 49-21 48 43v91H99Z" fill="#512f27"/>
    <path d="M52 393q130-60 260-1t290-24v80H52Z" fill="#342823"/>
    <g stroke="#b28a5c" stroke-width="3"><path d="M355 233h116v99H355Z" fill="#674631"/><path d="m347 230 67-48 66 48Z" fill="#a77a4a"/><path d="M379 330v-49h34v49m17-78h23v24h-23Z" fill="#251f1b"/><path d="M347 333h132m-115-85h104M365 268h12m38 22h51"/><path d="M361 218h107"/></g>
    <g transform="translate(244 195)"><g class="world-hover"><path d="m0-74 18 46 49-7-32 38 32 38-49-7L0 80l-18-46-49 7 32-38-32-38 49 7Z" fill="url(#${p}-metal)" stroke="#edcf94"/><circle cy="3" r="27" fill="#865f3e" stroke="#e8c182"/><circle cy="3" r="18" fill="none" stroke="#cda574" stroke-dasharray="1 4"/><path d="m0-8 4 8 9 1-6 6 1 9-8-4-8 4 1-9-6-6 9-1Z" fill="#e1bd80"/></g></g>
    <g fill="#24382e"><path d="M125 380V258c0-14 16-14 16 0v48c23 0 21-8 21-38 0-12 15-12 15 0v38c0 17-16 23-36 23v51Z"/><path d="M125 294c-17 0-18-7-18-25 0-12-14-12-14 0v23c0 15 16 20 32 20Z"/><path d="M544 372V297c0-12 13-12 13 0v75m-11-50c-23 4-23-5-23-23" stroke="#24382e" stroke-width="11"/></g>
    <g class="world-dust" fill="#dcb78b" opacity=".35">${[0,1,2,3,4,5,6,7].map(i=>`<circle cx="${100+i*59}" cy="${350+(i*17)%67}" r="${i%2+1}"/>`).join('')}</g>
    <g transform="translate(460 370)" stroke="#c29a61" fill="none" stroke-width="2"><g class="world-spin"><circle r="30"/><circle r="25"/><circle r="5"/><path d="M-30 0h60M0-30v60M-21-21l42 42m-42 0 42-42"/></g></g>` ,
  candy: p => `
    <circle cx="349" cy="218" r="167" fill="url(#${p}-halo)"/>
    <g stroke="#f4bcd3" opacity=".22" fill="none"><rect x="146" y="51" width="380" height="358" rx="180"/><rect x="165" y="70" width="342" height="320" rx="161"/></g>
    <ellipse cx="350" cy="382" rx="183" ry="24" fill="#261826" opacity=".5"/>
    <g transform="rotate(21 370 210)"><path d="M370 211v174" stroke="#efcbd5" stroke-width="13"/><circle cx="370" cy="176" r="95" fill="url(#${p}-stone)" stroke="#f4dae0" stroke-width="3"/><g transform="translate(370 176)"><g class="world-spin">${[0,120,240].map(a=>`<path d="${Array.from({length:40},(_,i)=>{const r=i*82/39,t=(i*210/39+a)*Math.PI/180;return `${i?'L':'M'}${(Math.cos(t)*r).toFixed(2)} ${(Math.sin(t)*r).toFixed(2)}`;}).join(' ')}" fill="none" stroke="#d76594" stroke-width="19" stroke-linecap="round"/>`).join('')}<circle r="14" fill="#efbfd3"/></g></g></g>
    <g class="world-bob"><g transform="translate(224 302) rotate(-15)"><path d="M-62-5-97-31v62l35-22m124-14 35-26v62L62 9" fill="#d59fb2"/><rect x="-67" y="-40" width="134" height="80" rx="34" fill="url(#${p}-metal)"/><path d="M-40-34 6 38m-16-78 46 73m-8-69 31 50" stroke="#fce6d6" stroke-width="16" opacity=".9"/></g></g>
    <g transform="translate(489 325) rotate(12)"><ellipse cy="7" rx="50" ry="30" fill="#a96680"/><ellipse cy="-7" rx="50" ry="30" fill="#eed6be"/><path d="M-48 0c25 15 71 15 96 0" stroke="#cb8eab" stroke-width="12"/><ellipse cy="-13" rx="42" ry="18" fill="#efdcca"/></g>
    <g class="world-dust" fill="#ffe1d6">${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${121+(i*71)%440}" y="${96+(i*61)%275}" width="4" height="12" rx="2" transform="rotate(${i*14} ${121+(i*71)%440} ${96+(i*61)%275})"/>`).join('')}</g>` ,
  dinosaurs: p => `
    <circle cx="377" cy="181" r="114" fill="url(#${p}-halo)"/><circle cx="377" cy="181" r="94" fill="#cbd694" opacity=".18"/>
    <path d="m35 343 61-124 67 63 75-118 101 156 47-96 86 95 59-112 76 112v97H35Z" fill="#183f30"/>
    <g class="world-breathe">
      <path d="M121 341c101-3 129-54 161-79l-5-49c-9-35 30-82 79-86l67-9 63 31 27 22-3 40-60 8-40-12-20 31 18 36 32 10-7 13-51-12-11-34-16 18 4 50 35 42-7 24-26-2 3-18-47-36-17-39-27 53 4 26-18 6-18-12 15-13 3-26-4-14c-50 25-105 33-166 25Z" fill="url(#${p}-dino)" stroke="#adbd77" stroke-width="1.6"/>
      <path d="M135 343c70 8 152-7 189-46l24-46 26-12 10-32 51-28 74 8-1 24-58 8-40-12-20 31 18 36 32 10-7 13-51-12-11-34-16 18 4 50 35 42-7 24-26-2 3-18-47-36-17-39-27 53 4 26-18 6-18-12 15-13 3-26-4-14c-50 25-105 33-166 25Z" fill="#344f37" opacity=".7"/>
      <path d="m288 201 13-26m9-8 15-19m12 2 16-15m13 7 11-12m12 5 11-9" stroke="#aabd78" stroke-width="4"/>
      <path d="m442 161 22 6-18 8Z" fill="#e6d282"/><circle cx="452" cy="167" r="3" fill="#15291e"/>
      <path d="m447 202 10 11 5-13 10 10 6-12 10 10 7-14" fill="#d6d3aa"/>
      <path d="m497 173 5 1M410 185l-10 11" stroke="#122b20" stroke-width="3"/>
      ${[0,1,2,3,4,5,6,7,8].map(i=>`<circle cx="${299+(i*23)%98}" cy="${192+(i*31)%78}" r="${i%3+2}" fill="#c4cb87" opacity=".2"/>`).join('')}
    </g>
    <g fill="#235538" stroke="#6e9a54" stroke-width="1"><path d="M84 423Q129 282 44 180c90 49 106 111 40 243Z"/><path d="M105 401Q155 276 204 250c-5 91-44 128-99 151Z"/><path d="M540 418Q485 281 572 165c-91 52-102 129-32 253Z"/><path d="M549 404Q508 300 463 291c1 64 42 102 86 113Z"/></g>
    <g class="world-cloud" fill="#ccdda7" opacity=".1"><ellipse cx="316" cy="380" rx="243" ry="23"/><ellipse cx="389" cy="408" rx="185" ry="17"/></g>
    <g class="world-dust">${stars('#d8df9b')}</g>` ,
  phoenix: p => `
    <circle cx="351" cy="231" r="181" fill="url(#${p}-halo)"/>
    <circle cx="351" cy="225" r="145" fill="none" stroke="#d6a25c" opacity=".45"/>
    <circle cx="351" cy="225" r="160" fill="none" stroke="#d6a25c" opacity=".2"/>
    <path d="M351 34v32m0 320v32M160 225h32m320 0h32" stroke="#e2b471" opacity=".7"/>
    <g class="world-breathe">
      <path d="M343 257c-105-11-164-71-183-171 62 77 120 59 171 119-37-62-102-78-121-166 70 54 132 91 142 163 9-72 72-109 142-163-20 88-85 104-122 166 51-60 109-42 171-119-19 100-78 160-183 171Z" fill="url(#${p}-fire)"/>
      <path d="M338 251c-84-18-127-62-163-138 18 83 54 134 123 160l-57-18 74 66 27-48m26-22c84-18 127-62 163-138-18 83-54 134-123 160l57-18-74 66-27-48" fill="#c46c3e"/>
      <path d="M339 266c-5 47-37 72-53 116 35-24 46-34 58-62-10 51-3 71 9 97 12-26 19-46 9-97 12 28 23 38 58 62-16-44-48-69-53-116Z" fill="url(#${p}-metal)"/>
      <path d="m337 259 4-49-11-23 14-26 28-12 21 13-27 9-6 18 6 30 4 40-17 26Z" fill="#f1cc87"/>
      <path d="m336 171-7-18 22 8m0-5 3-18 12 15" fill="#d6924f"/><path d="m366 166 8-2" stroke="#4d2824" stroke-width="3"/>
      <g fill="none" stroke="#ffe3a1" opacity=".6">${[0,1,2,3].map(i=>`<path d="M${329-i*10} ${231-i*9}Q${240-i*13} ${171-i*9} ${217-i*12} ${71+i*7}M${374+i*10} ${231-i*9}Q${463+i*13} ${171-i*9} ${486+i*12} ${71+i*7}"/>`).join('')}</g>
    </g>
    <g class="world-embers" fill="#f2bc6c">${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<ellipse cx="${130+(i*97)%452}" cy="${125+(i*67)%287}" rx="${i%3+1}" ry="${i%3+2}" transform="rotate(25 ${130+(i*97)%452} ${125+(i*67)%287})"/>`).join('')}</g>` ,
};

/** Prefix must be unique per mounted scene so inline gradients cannot leak across themes. */
export function scene(id, prefix='scene') {
  if (!Object.hasOwn(bodies,id)) throw new RangeError('Unknown world');
  if (!/^[a-z][a-z0-9-]*$/i.test(prefix)) throw new TypeError('Invalid SVG namespace');
  const t=WORLD_THEMES[id].tokens;
  const defs=`<defs>
    <radialGradient id="${prefix}-halo"><stop stop-color="${t['--glow']}" stop-opacity=".5"/><stop offset="1" stop-color="${t['--glow']}" stop-opacity="0"/></radialGradient>
    <linearGradient id="${prefix}-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffefc7"/><stop offset=".3" stop-color="${t['--accent']}"/><stop offset=".55" stop-color="#9b8054"/><stop offset=".8" stop-color="${t['--accent']}"/><stop offset="1" stop-color="#6b553c"/></linearGradient>
    <linearGradient id="${prefix}-shade" x2="1" y2="1"><stop stop-color="${t['--panel-raised']}"/><stop offset="1" stop-color="${t['--page']}"/></linearGradient>
    <linearGradient id="${prefix}-stone" x2="1" y2=".5"><stop stop-color="#fff1d4"/><stop offset=".42" stop-color="#c8cbca"/><stop offset=".65" stop-color="#939aa6"/><stop offset="1" stop-color="#ece4ce"/></linearGradient>
    <linearGradient id="${prefix}-planet" x1=".2" y1="0" x2=".8" y2="1"><stop stop-color="#d6c7ed"/><stop offset=".35" stop-color="#8478b1"/><stop offset="1" stop-color="#352957"/></linearGradient>
    <linearGradient id="${prefix}-beam" x2="0" y2="1"><stop stop-color="#c3ffe0"/><stop offset="1" stop-color="#c3ffe0" stop-opacity="0"/></linearGradient>
    <linearGradient id="${prefix}-sunset" x2="0" y2="1"><stop stop-color="#f5c37c"/><stop offset="1" stop-color="#cc754a" stop-opacity=".3"/></linearGradient>
    <linearGradient id="${prefix}-dino" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#bbc78b"/><stop offset=".4" stop-color="#78965c"/><stop offset="1" stop-color="#344d36"/></linearGradient>
    <linearGradient id="${prefix}-fire" x2="0" y2="1"><stop stop-color="#fff0b8"/><stop offset=".35" stop-color="#e2b574"/><stop offset=".75" stop-color="#c87440"/><stop offset="1" stop-color="#803a2e"/></linearGradient>
  </defs>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" fill="none" aria-hidden="true" focusable="false" data-scene="${id}">${defs}${bodies[id](prefix)}</svg>`;
}
