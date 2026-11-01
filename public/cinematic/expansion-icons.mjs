import { EXPANSION } from './expansion.mjs';

/** Six recognizable silhouettes for each new world. These are vector UI assets, not bitmap crops. */
const shapes={
 egypt:[
 ['pylon','M3 21V5h6v16m6 0V5h6v16M1 21h22M8 9h8M4 5l2-3 2 3m8 0 2-3 2 3'],
 ['scarab','M8 11c-5-8-9 2-5 6l6-1m7-5c5-8 9 2 5 6l-6-1M12 7c-8 0-7 14 0 14s8-14 0-14Zm0 0V3m-4 0 4 2 4-2m-4 7v11'],
 ['ankh','M12 9c-11-3-5-12 0-6 5-6 11 3 0 6Zm0 0v13M5 12h14'],
 ['sarcophagus','M8 8c-5-8 13-8 8 0l3 10-3 4H8l-3-4Zm0 1 8 8M16 9l-8 8m1-7 6 3m-6 6h6'],
 ['eye','M2 11c7-8 13-8 20 0-8 8-12 8-20 0Zm10-4a4 4 0 1 0 0 8 4 4 0 1 0 0-8Zm-5 8-2 6m7-5c0 5 6 5 6 0'],
 ['obelisk','M9 6 12 1l3 5 1 14H8ZM6 23h12M12 6v14m-2-11h4m-4 4h4']
 ],
 japan:[
 ['torii','M2 3q10 4 20 0M3 6h18M4 11h16M6 6v16M18 6v16M12 6v5'],
 ['katana','m4 20 5-5M3 17l4 4m1-5L20 2c1 5-5 10-10 15ZM6 13l5 5'],
 ['oni','M5 8 3 1l7 5h4l7-5-2 7 1 9-8 6-8-6ZM7 10l3 2m7-2-3 2m-6 5 4-2 4 2m-7 0v3m6-3v3'],
 ['fan','M2 14a10 10 0 0 1 20 0l-10 8ZM12 22V5M5 8l7 14 7-14'],
 ['sakura','M12 9c-10-13-15 3-4 4-12 6 4 17 4 4 4 13 16 1 5-4 14-5 0-15-5-4ZM12 10v5m-3-3h6'],
 ['lantern','M8 2h8v3H8Zm-2 4h12c5 7 0 13-6 13S1 13 6 6Zm6 0v13m-7-9h14M8 20h8m-4 0v3']
 ],
 china:[
 ['pagoda','m2 8 10-6 10 6H2Zm2 7 8-5 8 5Zm-2 7 10-4 10 4ZM6 8v5m12-5v5M7 15v5m10-5v5'],
 ['dragon','M3 17c12 12 21-4 9-5-9 0-7-7 0-7h6l3-3v6l-4 2-4-2 3-1M9 4l1-3m4 3 2-3M4 18l-2 3m7-2-1 3'],
 ['jade','M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20Zm-3 7h6v6H9Zm-4 3h2m10 0h2M12 5v2m0 10v2'],
 ['seal','M7 9c-3-8 13-8 10 0v4H7ZM4 14h16v8H4Zm4 2v4m4-4v4m4-4v4'],
 ['lotus','M12 20C0 22 0 10 3 8l9 7L8 4l4-3 4 3-4 11 9-7c3 2 3 14-9 12Zm0-5v5'],
 ['koi','M6 18c-8-13 10-21 12-8 3 9-10 9-12 13v-5Zm1-6 7 6m-7-11 10 6M6 18l-4 2m12-14h1']
 ],
 india:[
 ['palace','M3 22V11h18v11M8 11V7c0-2 3-3 4-6 1 3 4 4 4 6v4M1 11l3-4 3 4m10 0 3-4 3 4M9 22v-6a3 3 0 0 1 6 0v6'],
 ['elephant','M2 12c-1-9 14-9 17-3l3 1v10c-5 5-7-2-4-3l1 2V9m-15 5v7h4v-5h5v5h4V9m-2 0c-5-5-7 4-3 6'],
 ['peacock','M12 16C-5 16 3-3 9 5c-3-9 9-9 6 0 6-8 14 11-3 11Zm0-5c-4 0-3 6 0 11 3-5 4-11 0-11Zm-7-4 5 6m9-6-5 6M12 3v7'],
 ['gem','m2 8 5-6h10l5 6-10 14ZM2 8h20M7 2l5 20 5-20m-10 0 5 6 5-6'],
 ['henna','M12 3 8 8l-6 2 5 4 1 7 4-4 4 4 1-7 5-4-6-2Zm0 6-3 3 3 3 3-3ZM8 8l8 6M16 8l-8 6'],
 ['arch','M3 22V10C3 4 10 5 12 1c2 4 9 3 9 9v12h-4V11c0-3-3-3-5-5-2 2-5 2-5 5v11ZM1 22h22']
 ],
 vikings:[
 ['longship','M2 15c1 10 19 10 20 0H2Zm10-1V1m1 2h7l-2 9h-5M5 14V6m-3-1 6 2M5 18h14'],
 ['axe','m5 22 12-20m-6 4c6 1 4 7 10 3l-1 6c-6 2-6-4-11-4ZM8 15l4 2'],
 ['rune','M7 1v22m0-11 10-8v9L7 5m0 11 10 6'],
 ['shield','M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20Zm0 7a3 3 0 1 0 0 6 3 3 0 1 0 0-6Zm0-7v7m0 6v7M2 12h7m6 0h7'],
 ['raven','M2 7c3 2 6 2 10 0l5-5 4 3-4 2c2 8-1 10-6 10l-6 5 1-7-4-8Zm3 1 7 7m4-2 4 6'],
 ['horn','M3 2c17 3 15 14 3 21 7-12 5-13-3-14ZM3 2v7m5-5-3 7m8-5-6 9']
 ],
 atlantis:[
 ['trident','M12 1v22M3 5v7l9 4 9-4V5M1 8l2-5 2 5m14 0 2-5 2 5m-13-4 2-4 2 4'],
 ['shell','M12 21 2 12C-1-2 25-2 22 12Zm0 0V4m0 17L6 6m6 15 6-15M9 22h6'],
 ['pearl','M2 15c3 7 17 7 20 0l-5 7H7Zm10-12a6 6 0 1 0 0 12 6 6 0 1 0 0-12Zm-3 4 2-1'],
 ['nautilus','M12 21C-3 21-2 2 12 2s12 16 2 16c-8 0-8-12-1-12s8 8 3 8c-4 0-5-5-1-5M4 6l4 3m-6 4 5-1m-2 7 4-4m3 7 1-4'],
 ['coral','M12 22V3m0 13 9-7V3M12 11 3 7V2m5 8V5m9 7 5 5m-10 1-8-4-3 2m14-8V2'],
 ['seahorse','M15 21c-11 6-11-8-5-6 6 3-1 5-2 2m7 4V10l-4-4 1-4 6 1 4 6h-5l-2-3m-2 7-5-4v7m6 0 4-4']
 ],
 dragons:[
 ['castle','M2 22V4h3V1h3v3h3v18m2 0V4h3V1h3v3h3v18M11 9h2M6 8v2m11-2v2M9 22v-6h6v6'],
 ['dragon-egg','M12 2c-4 2-10 10-9 15 2 8 18 8 18 0 0-5-5-13-9-15ZM5 12l7 8 7-8M7 7l5 6 5-6'],
 ['helmet','M4 21V9c0-10 16-10 16 0v12l-8-4Zm1-12 7 4 7-4M12 3v14M7 16v3m10-3v3'],
 ['cross-swords','M3 2 18 18l3-1-4 4 1-3L2 3ZM21 2 6 18l-3-1 4 4-1-3L22 3Z'],
 ['wing','M12 22 2 3l9 4 10-4-3 9-5-1 4 6-6-2Zm-1-15 1 15'],
 ['claw','M5 1c-6 11-4 18 1 21L4 12Zm7 0c-5 11-3 18 2 21l-2-10Zm7 0c-4 11-2 18 3 21l-3-10Z']
 ],
 vampires:[
 ['gothic-window','M4 22V10c0-4 8-7 8-9 0 2 8 5 8 9v12ZM12 1v21M4 13h16m-16-3 8 5 8-5'],
 ['chalice','M5 2h14v6c0 8-14 8-14 0Zm7 12v7m-6 1h12M7 6h10'],
 ['bat','M12 12 2 3v13l5-2 2 6 3-3 3 3 2-6 5 2V3ZM10 12l-1-5 3 2 3-2-1 5'],
 ['rose','M12 22V12m0 5-6-3m6 4 6-4M12 2l-6 1-4 5 4 6h12l4-6-4-5Zm-5 4 5 6 5-6Zm3-2 2 3 2-3'],
 ['wax-seal','M4 16 2 23l9-3 10 3-2-8M12 2l7 3 3 7-6 8H8L2 12l3-7Zm-3 5 6 6m0-6-6 6'],
 ['fangs','M2 4c5 5 15 5 20 0l-3 18-5-12h-4L5 22Zm3 3 2 7m12-7-2 7']
 ],
 artdeco:[
 ['sunburst','M2 22V2h20v20ZM12 22V2M3 4l9 18L21 4M2 12l10 10 10-10M2 19l10 3 10-3'],
 ['gramophone','M3 22v-5h18v5ZM12 17V9L2 6V2c10 0 15 3 17 10l-7-3m0 5h8l1 3'],
 ['pocket-watch','M10 2h4v3h-4Zm2 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18Zm0 4v6l4 2M9 0h6'],
 ['ticket','M2 5h20v5c-5 0-5 4 0 4v5H2v-5c5 0 5-4 0-4Zm5 3v8M10 8h7m-7 4h7m-7 4h7'],
 ['deco-fan','M2 10C2-2 22-2 22 10L12 22ZM12 22V2M6 5l6 17 6-17M2 10h20'],
 ['key','M6 2a4 4 0 1 0 0 8 4 4 0 1 0 0-8Zm3 7 12 12m-4-8-3 3m6 0-3 3']
 ],
 masquerade:[
 ['mask','M2 6c4-3 7 0 10 0s6-3 10 0v8l-5 5-5-4-5 4-5-5Zm2 3 5 1-2 4Zm16 0-5 1 2 4Z'],
 ['feather','M3 22 16 2c7-5 10 8 1 12l-6 1-8 7Zm4-7 5 1m-1-7 5 1m-1-6 4 1'],
 ['gondola','M1 17c6 7 16 7 22-2l-3 2H6L2 12M13 17V7h6v10m-4-10V3M5 21l15 0'],
 ['chandelier','M12 1v18m-8-9v5c0 6 16 6 16 0v-5M2 9h4m12 0h4M3 4l1-2 1 2m14 0 1-2 1 2M8 21l4 2 4-2m-8-8h8'],
 ['mirror','M12 2c-12 0-10 16 0 16s12-16 0-16Zm0 16v5m-4 0h8M8 6l5-2m-7 6 9-5'],
 ['harlequin','m12 1 6 6-6 6-6-6Zm0 10 6 6-6 6-6-6ZM2 7l6 6-6 6m20-12-6 6 6 6']
 ],
 muertos:[
 ['calavera','M5 15C-5-2 29-2 19 15v5l-4 3H9l-4-3Zm2-7a3 3 0 1 0 0 6 3 3 0 1 0 0-6Zm10 0a3 3 0 1 0 0 6 3 3 0 1 0 0-6Zm-5 7-2 3h4ZM8 20h8m-6-1v3m4-3v3'],
 ['marigold','M12 8c-8-14-16 1-6 5-14 6-2 17 5 7 7 11 18-1 8-7 11-4 1-18-7-5Zm0 1a4 4 0 1 0 0 8 4 4 0 1 0 0-8Z'],
 ['guitar','m13 9 5-8 3 2-7 9c5 8-6 15-10 9-7-4 0-15 7-10Zm-5 4a3 3 0 1 0 0 6 3 3 0 1 0 0-6Zm0 3L19 2'],
 ['candle','M8 9h8v12H8Zm4-8c-6 5-1 9 0 6 6 2 5-4 0-6ZM5 23h14M12 10v4'],
 ['papel','M1 3h22M3 3v16l3 3 3-3 3 3 3-3 3 3 3-3V3M6 7l3 4-3 4m12-8-3 4 3 4M12 5v12'],
 ['butterfly','M12 11C-7-7 1 23 10 18l2 4 2-4C23 23 31-7 12 11Zm0-3V4m-2 2-2-3m6 3 2-3M5 6l5 7m9-7-5 7']
 ],
 alchemy:[
 ['flask','M8 2h8m-6 0v7L3 19q-1 3 3 3h12q4 0 3-3L14 9V2M7 15h10m-8 3h1m4 1h1'],
 ['grimoire','M3 3h17v19H3c-3-3-3-6 0-6h17M4 3v13m4-8 4-4 4 4-4 4Zm-5 2h8'],
 ['mortar','M2 12h20c-1 7-5 9-10 9S3 19 2 12Zm13 0 7-10-3-1-7 11M6 23h12'],
 ['crystal','m12 1 8 6-1 12-7 4-7-4-1-12ZM12 1v22M4 7l8 5 8-5'],
 ['orb','M12 2a8 8 0 1 0 0 16 8 8 0 1 0 0-16Zm-3 4 6 6m-5-3 3-2M5 22l3-5m11 5-3-5M4 23h16'],
 ['sigil','m12 1 10 18H2Zm0 6 4 7H8ZM12 1v22M1 12h22m-11 5a5 5 0 1 0 0 .1']
 ],
 ice:[
 ['snowflake','M12 1v22M2 6l20 12M2 18 22 6m-13-3 3 3 3-3m-6 18 3-3 3 3M3 9l5-1-1-5m10 18-1-5 5-1M3 15l5 1-1 5m10-18-1 5 5 1'],
 ['ice-crown','M3 20 1 6l6 7 5-12 5 12 6-7-2 14ZM4 23h16M9 18l3-6 3 6'],
 ['glacier','M2 22 7 3l5 12 5-14 5 21ZM7 3v19m10-21v21M4 13h6m5-4h5'],
 ['wolf','m2 2 9 6h2l9-6-3 16-7 5-7-5ZM6 12l3 2m9-2-3 2m-5 4h4l-2 3Z'],
 ['icicle','M2 2h20l-3 8-2-6-4 19-3-17-4 9ZM13 4v12'],
 ['compass-ice','M12 1 16 8l7 4-7 4-4 7-4-7-7-4 7-4Zm0 0v22M1 12h22M7 7l10 10m-10 0L17 7']
 ],
 forest:[
 ['tree','M11 23V13M5 15c-8-3-3-8 0-7-4-5 6-10 7-5 6-7 13 2 8 5 8 5 1 12-8 6m-6 9h12'],
 ['antlers','M12 22v-9M12 14 5 8 3 1m9 13 7-6 2-7M5 8 1 7m6 3V4m10 6V4m2 4 4-1'],
 ['acorn','M4 10h16c0 15-16 15-16 0Zm0 0c-5-8 21-8 16 0M12 4V1M7 7l2 2 3-3 3 3 2-2'],
 ['mushroom','M2 13c-1-15 21-15 20 0ZM9 13l-2 9h10l-2-9M7 7h1m4-3h1m4 4h1'],
 ['leaf-sigil','M12 23C-4 14 1 4 12 1c11 3 16 13 0 22Zm0-2V5m0 9-6-5m6 8 6-6'],
 ['firefly','M12 9c-16-18-14 15 0 9 14 6 16-27 0-9Zm0-3v16m-3-19 3 3 3-3M8 16h8m-7 3h6']
 ],
 racing:[
 ['steering','M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20Zm0 6a4 4 0 1 0 0 8 4 4 0 1 0 0-8ZM2 10l6 1m8 0 6-1M12 16v6'],
 ['piston','M5 2h14v7H5Zm0 3h14M8 9l5 8m3-8-1 7m-2 0a3 3 0 1 0 0 6 3 3 0 1 0 0-6Z'],
 ['turbo','M12 3c-13-2-14 18-1 19 10 1 14-10 8-15h-6V1h8v7M12 8a5 5 0 1 0 0 10 5 5 0 1 0 0-10Zm-1 0v9m-4-4h9'],
 ['flags','M4 23V2c7-4 8 4 16 0v12c-8 4-9-4-16 0M4 6l16 1M4 10l16 1M8 1v13m5-10v11m4-12v12'],
 ['trophy','M7 1h10v11c0 7-10 7-10 0Zm0 3H2v5l5 3M17 4h5v5l-5 3M12 17v5m-6 0h12'],
 ['speedometer','M2 19a11 11 0 1 1 20 0ZM12 16 18 5m-7 9h3v3h-3ZM5 13l-2-1m4-6-1-2m6 0V2m8 11 2-1']
 ],
 wasteland:[
 ['goggles','M1 7h22v10H1Zm3 2h5v6H4Zm11 0h5v6h-5M9 12h6M1 10h-1m23 0h1'],
 ['battery','M7 3V1h10v2M4 3h16v20H4Zm9 3-5 8h4l-1 6 6-9h-4Z'],
 ['engine','M3 9h5V6h8v3h5v9H3Zm-3 0v9m0-5h3M8 3h8M12 3v3m9 5h3v5h-3M7 12l3 3m4-3 3 3'],
 ['gas-mask','M4 9c-2-12 18-12 16 0l2 10-10 4-10-4Zm2-3h4v7H6Zm8 0h4v7h-4M9 17h6m-3-3v6'],
 ['scrap-heart','M12 22 2 11V4l5-2 5 5 5-5 5 2v7Zm-1-13-3 5 6-1-3 6M4 6h2m12 0h2'],
 ['wrench','M4 22 16 10c10 2 8-12 3-9v6h-6V1c-5 1-6 9-2 12L1 20Z']
 ],
 eldorado:[
 ['stepped-temple','M2 22v-4h4v-4h3V7h6v7h3v4h4v4ZM7 7V3h10v4M12 7v15M1 22h22'],
 ['jaguar','M3 4 8 3l4 3 4-3 5 1-1 14-8 5-8-5ZM6 9h3m6 0h3m-9 8 3 3 3-3m-6-3h6M5 6h1m12 0h1m-14 8h1m12 0h1'],
 ['sun-mask','M7 5h10l3 4v9l-8 5-8-5V9ZM7 10h3m4 0h3m-7 8h4M12 1v4M2 4l4 4m12 0 4-4M1 12h3m16 0h3'],
 ['gold-idol','M9 8c-6-10 12-10 6 0l4 4-2 7H7l-2-7Zm-1 4h8m-9 7-2 4m12-4 2 4M10 4h4m-2 6v9'],
 ['jade-pendant','M12 1 21 7l-2 12-7 4-7-4L3 7Zm0 5-5 4 5 8 5-8ZM12 1v5'],
 ['expedition-map','m1 5 7-3 8 3 7-3v18l-7 3-8-3-7 3Zm7-3v18m8-15v18M3 10l3 3m-3 0 3-3m5 3 2 4m5-8 2-2']
 ],
 astral:[
 ['astrolabe','M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20Zm0 4a6 6 0 1 0 0 12 6 6 0 1 0 0-12ZM2 12h20M12 2v20M5 19 19 5'],
 ['constellation','m3 4 9 5 9-6-4 17-5-11-7 12L3 4Zm-1-1h2v2H2Zm9 5h2v2h-2Zm9-6h2v2h-2ZM4 20h2v2H4Z'],
 ['crescent','M16 2C-5-1-2 27 18 22 7 17 6 10 16 2Zm3 7 1-3 1 3 3 1-3 1-1 3-1-3-3-1Z'],
 ['observatory','M3 13c0-15 18-15 18 0ZM3 13v9h18v-9M12 3v10M8 22v-6h8v6M1 23h22'],
 ['hourglass','M5 1h14v4l-5 7 5 7v4H5v-4l5-7-5-7Zm2 4h10m-7 7h4m-7 7h10'],
 ['telescope','m3 11 15-9 3 6-15 9ZM2 10l5 9m8-8-3 4m0 0-5 8m5-8 5 8m-5-8v8']
 ]
};
const roles=['discover','slots','live','table','favorites','search'];
export const EXPANDED_ICON_FAMILIES=Object.freeze(Object.fromEntries(Object.entries(shapes).map(([id,list],index)=>{
 const glyphs=Object.freeze(list.map(([name])=>name));
 const map=Object.fromEntries(roles.map((r,i)=>[r,glyphs[i]]));
 Object.assign(map,{home:glyphs[0],games:glyphs[1],account:glyphs[2],worlds:glyphs[0],promotions:glyphs[3],rewards:glyphs[4],tournaments:glyphs[3]});
 return [id,Object.freeze({row:index+9,glyphs,roles:Object.freeze(map),vector:true})];
})));

export function expansionIconUrl(id){
 if(!Object.hasOwn(shapes,id))return null;
 const accent=EXPANSION[id].colors[2],base=EXPANSION[id].colors[1];
 const cells=shapes[id].map(([name,path],i)=>`<g transform="translate(${i*64+8} 8) scale(2)" stroke-linecap="round" stroke-linejoin="round"><path d="${path}" fill="${base}" stroke="#000" opacity=".55" stroke-width="2.5" transform="translate(0 1)"/><path d="${path}" fill="url(#metal)" fill-opacity=".16" stroke="url(#metal)" stroke-width="1.45"/></g>`).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="384" height="64" viewBox="0 0 384 64"><defs><linearGradient id="metal" x2=".2" y2="1"><stop stop-color="#fff8df"/><stop offset=".35" stop-color="${accent}"/><stop offset=".6" stop-color="#987346"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs>${cells}</svg>`;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
