/** Original, approved raster silhouettes; atlas cells are NOT recolored at runtime. */
export const ICON_ROLES=Object.freeze(['home','discover','games','slots','live','table','favorites','search','account','worlds','promotions','rewards','tournaments']);
const family=(row,glyphs,primary,extras={})=>Object.freeze({row,glyphs:Object.freeze(glyphs.split(' ')),roles:Object.freeze({...Object.fromEntries(['discover','slots','live','table','favorites','search'].map((r,i)=>[r,primary[i]])),home:primary[0],games:primary[1],account:primary[4],worlds:primary[0],promotions:primary[2],rewards:primary[4],tournaments:primary[3],...extras})});
export const ICON_FAMILIES=Object.freeze({
 pirates:family(0,'chest wheel compass cutlasses map spyglass',['map','wheel','cutlasses','compass','chest','spyglass'],{home:'compass',account:'chest',rewards:'chest',tournaments:'cutlasses'}),
 olympus:family(1,'temple laurel lightning amphora trident owl',['temple','amphora','lightning','trident','laurel','owl'],{account:'owl',rewards:'laurel',tournaments:'trident'}),
 cyberpunk:family(2,'chip visor heart star cube radar',['visor','chip','cube','star','heart','radar'],{account:'visor',worlds:'radar',rewards:'cube',promotions:'star'}),
 steampunk:family(3,'gear-heart gauge compass monocle valve wings',['compass','gauge','valve','wings','gear-heart','monocle'],{account:'monocle',rewards:'gear-heart',tournaments:'wings'}),
 space:family(4,'ufo orbit alien planet stargate beam',['orbit','ufo','alien','stargate','planet','beam'],{account:'alien',worlds:'planet',tournaments:'stargate'}),
 western:family(5,'badge revolver horseshoe saloon wheel cactus',['badge','revolver','saloon','wheel','horseshoe','cactus'],{worlds:'cactus',account:'badge',rewards:'horseshoe'}),
 candy:family(6,'swirl sweet gumdrop lollipop cupcake star',['swirl','sweet','cupcake','gumdrop','star','lollipop'],{account:'cupcake',worlds:'swirl',promotions:'lollipop',rewards:'sweet'}),
 dinosaurs:family(7,'fossil claws egg leaf volcano skull',['leaf','fossil','egg','volcano','claws','skull'],{account:'skull',worlds:'leaf',rewards:'egg',tournaments:'volcano'}),
 phoenix:family(8,'feather heart wings crystal sun crest',['wings','feather','crest','sun','heart','crystal'],{account:'crest',worlds:'sun',promotions:'wings',rewards:'crystal',tournaments:'sun'}),
});
export function resolveIcon(world,role){
 if(!Object.hasOwn(ICON_FAMILIES,world))return null;
 const f=ICON_FAMILIES[world];
 const glyph=f.glyphs.includes(role)?role:Object.hasOwn(f.roles,role)?f.roles[role]:null;
 if(!glyph)return null;
 const column=f.glyphs.indexOf(glyph);
 return Object.freeze({world,glyph,row:f.row,column,x:column*20,y:f.row*12.5});
}
