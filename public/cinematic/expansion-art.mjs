/** Application-owned image atlases. No network API or remote assets. */
export const EXPANSION_ART=Object.freeze({"egypt":{"file":"assets/expansion/scenes-0.avif","rect":[0,0,600,289]},"japan":{"file":"assets/expansion/scenes-0.avif","rect":[600,0,600,254]},"china":{"file":"assets/expansion/scenes-0.avif","rect":[1200,0,600,253]},"atlantis":{"file":"assets/expansion/scenes-1.avif","rect":[0,0,539,300]},"vampires":{"file":"assets/expansion/scenes-1.avif","rect":[600,0,579,300]},"racing":{"file":"assets/expansion/scenes-1.avif","rect":[1200,0,600,210]},"india":{"file":"assets/expansion/scenes-2.avif","rect":[0,0,247,107]},"vikings":{"file":"assets/expansion/scenes-2.avif","rect":[280,0,247,107]},"dragons":{"file":"assets/expansion/scenes-2.avif","rect":[560,0,247,119]},"artdeco":{"file":"assets/expansion/scenes-2.avif","rect":[840,0,247,119]},"masquerade":{"file":"assets/expansion/scenes-2.avif","rect":[1120,0,247,119]},"muertos":{"file":"assets/expansion/scenes-2.avif","rect":[1400,0,247,119]},"alchemy":{"file":"assets/expansion/scenes-3.avif","rect":[0,0,247,119]},"ice":{"file":"assets/expansion/scenes-3.avif","rect":[280,0,247,119]},"forest":{"file":"assets/expansion/scenes-3.avif","rect":[560,0,247,119]},"wasteland":{"file":"assets/expansion/scenes-3.avif","rect":[840,0,247,119]},"eldorado":{"file":"assets/expansion/scenes-3.avif","rect":[1120,0,247,119]},"astral":{"file":"assets/expansion/scenes-3.avif","rect":[1400,0,247,119]}});

export async function prepareExpansionArt(){
 const existing=globalThis.TEMAS_ART||{};
 const needed=Object.entries(EXPANSION_ART).filter(([id])=>!existing[id]);
 const files=[...new Set(needed.map(([,meta])=>meta.file))];
 const result={...existing};
 await Promise.all(files.map(async file=>{
  const image=new Image();image.src=globalThis.TEMAS_ATLASES?.[file]||file;
  try{
   await image.decode();
   for(const [id,meta] of needed.filter(([,meta])=>meta.file===file)){
    const [x,y,w,h]=meta.rect;
    if(x+w>image.naturalWidth||y+h>image.naturalHeight)throw new Error('Invalid atlas bounds');
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext('2d');if(!ctx)continue;
    ctx.drawImage(image,x,y,w,h,0,0,w,h);result[id]=canvas.toDataURL('image/png');
   }
  }catch{/* Missing artwork must not prevent browsing, account notices or theme switching. */}
 }));
 globalThis.TEMAS_ART=result;
}
