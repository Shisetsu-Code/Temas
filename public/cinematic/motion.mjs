/** One bounded animation loop. No network, audio, video or per-theme timers. */
export const canAnimate=({enabled,reduced,visible,inView,modal})=>Boolean(enabled&&!reduced&&visible&&inView&&!modal);
export const particleBudget=width=>width<600?18:36;
export class Atmosphere {
 constructor(canvas,stage){
  this.canvas=canvas;this.stage=stage;this.ctx=canvas.getContext('2d',{alpha:true});
  this.abort=new AbortController();this.query=matchMedia('(prefers-reduced-motion: reduce)');
  this.state={enabled:true,reduced:this.query.matches,visible:!document.hidden,inView:true,modal:false};
  this.effect='spray';this.color='#dfb96f';this.frame=0;this.last=0;this.running=false;this.width=1;this.height=1;
  this.particles=[];this.pointer={x:0,y:0};
  this.tick=this.tick.bind(this);this.sync=this.sync.bind(this);this.resize=this.resize.bind(this);
  this.query.addEventListener('change',()=>{this.state.reduced=this.query.matches;this.sync();},{signal:this.abort.signal});
  document.addEventListener('visibilitychange',()=>{this.state.visible=!document.hidden;this.sync();},{signal:this.abort.signal});
  if('IntersectionObserver' in window){this.io=new IntersectionObserver(entries=>{this.state.inView=entries[0].isIntersecting;this.sync();});this.io.observe(stage);}
  if('ResizeObserver' in window){this.ro=new ResizeObserver(this.resize);this.ro.observe(stage);}else window.addEventListener('resize',this.resize,{signal:this.abort.signal});
  stage.addEventListener('pointermove',event=>{
   if(!this.running||event.pointerType!=='mouse')return;
   const b=stage.getBoundingClientRect();this.pointer={x:(event.clientX-b.left)/b.width-.5,y:(event.clientY-b.top)/b.height-.5};
  },{passive:true,signal:this.abort.signal});
  stage.addEventListener('pointerleave',()=>{this.pointer={x:0,y:0};},{signal:this.abort.signal});
  this.resize();this.sync();
 }
 resize(){
  const b=this.stage.getBoundingClientRect();this.width=Math.max(1,b.width);this.height=Math.max(1,b.height);
  const dpr=Math.min(window.devicePixelRatio||1,1.5);this.canvas.width=Math.ceil(this.width*dpr);this.canvas.height=Math.ceil(this.height*dpr);
  this.ctx?.setTransform(dpr,0,0,dpr,0,0);this.seed();
 }
 seed(){
  let s=1709;const random=()=>{s=(s*16807)%2147483647;return(s-1)/2147483646;};
  this.particles=Array.from({length:particleBudget(this.width)},()=>({x:random()*this.width,y:random()*this.height,r:.6+random()*1.6,speed:10+random()*28,phase:random()*6.28}));
 }
 setTheme(effect,color){this.effect=effect;this.color=color;this.seed();this.ctx?.clearRect(0,0,this.width,this.height);}
 setEnabled(value){this.state.enabled=Boolean(value);this.sync();}
 setModal(value){this.state.modal=Boolean(value);this.sync();}
 sync(){
  const active=canAnimate(this.state)&&Boolean(this.ctx);
  document.documentElement.dataset.motionEffective=active?'on':'off';
  this.canvas.dataset.running=String(active);
  if(active&&!this.running){this.running=true;this.last=0;this.frame=requestAnimationFrame(this.tick);}
  if(!active){
   this.running=false;cancelAnimationFrame(this.frame);this.frame=0;this.last=0;
   this.ctx?.clearRect(0,0,this.width,this.height);this.pointer={x:0,y:0};
   this.stage.style.setProperty('--px','0px');this.stage.style.setProperty('--py','0px');
  }
 }
 tick(now){
  if(!this.running)return;
  this.frame=requestAnimationFrame(this.tick);
  if(now-this.last<32)return; // At most ~30 painted frames/second.
  const dt=this.last?Math.min((now-this.last)/1000,.07):.033;this.last=now;
  const c=this.ctx;c.clearRect(0,0,this.width,this.height);c.strokeStyle=this.color;c.fillStyle=this.color;
  const rain=['rain','spray'].includes(this.effect),steam=['steam','clouds'].includes(this.effect);
  for(const p of this.particles){
   p.phase+=dt*.5;p.y+=(rain?1:-1)*p.speed*dt*(rain?3:1);p.x+=(rain?-9:Math.sin(p.phase)*7)*dt;
   if(p.y>this.height+20)p.y=-20;if(p.y<-20)p.y=this.height+20;
   if(p.x<-20)p.x=this.width+20;if(p.x>this.width+20)p.x=-20;
   c.globalAlpha=steam?.045:.13+Math.abs(Math.sin(p.phase))*.28;
   if(rain){c.lineWidth=.6;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-2,p.y+8+p.r*3);c.stroke();}
   else if(this.effect==='sugar'){c.save();c.translate(p.x,p.y);c.rotate(p.phase);c.fillRect(-p.r,-p.r,p.r*1.4,p.r*3);c.restore();}
   else {c.beginPath();c.arc(p.x,p.y,steam?p.r*11:p.r,0,Math.PI*2);c.fill();}
  }
  c.globalAlpha=1;
  this.stage.style.setProperty('--px',`${(this.pointer.x*10).toFixed(2)}px`);
  this.stage.style.setProperty('--py',`${(this.pointer.y*8).toFixed(2)}px`);
 }
 destroy(){this.running=false;cancelAnimationFrame(this.frame);this.abort.abort();this.io?.disconnect();this.ro?.disconnect();this.ctx?.clearRect(0,0,this.width,this.height);}
}
