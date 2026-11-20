/* tuning.js — E-Ride Life v1.25: workshop "Tuning" garage, parts, suspension kits */
import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
const PI=Math.PI,money=n=>'$'+Math.round(n).toLocaleString(),pct=v=>(v>0?'+':'')+Math.round(v*100)+'%';

/* ================= data ================= */
/* Stock suspension numbers (same as the old "Factory" kit). Every kit is the stock kit with multipliers. */
const SB={ft:.16,rt:.15,fs:60,fd:17,rs:68,rd:18};
const SRAW=[
 {id:'stock',n:'Stock Suspension',stiff:0,damp:0,height:0,tm:1,price:0,blurb:'stock damping'},
 {id:'comfort',n:'Comfort Suspension',stiff:-.25,damp:0,height:.05,tm:1.3,price:.12,blurb:'soft damping'},
 {id:'lowered',n:'Lowered Suspension',stiff:.15,damp:0,height:-.2,tm:.8,price:.14,blurb:'low and firm'},
 {id:'offroad',n:'Off-Road Suspension',stiff:-.15,damp:0,height:.2,tm:2,price:.2,blurb:'long travel'},
 {id:'race',n:'Race Suspension',stiff:.6,damp:.3,height:-.25,tm:1.3,price:.3,blurb:'firm race damping'},
 {id:'stance',n:'Stance Suspension',stiff:.2,damp:0,height:-.5,tm:.6,price:.35,blurb:'slammed',needs:'race'}];
export const SUSPENSIONS=SRAW.map(r=>{const frontTravel=SB.ft*r.tm,rearTravel=SB.rt*r.tm;
 return{...r,travel:(frontTravel+rearTravel)/2,frontTravel,rearTravel,frontSpring:SB.fs*(1+r.stiff),frontDamping:SB.fd*(1+r.damp),rearSpring:SB.rs*(1+r.stiff),rearDamping:SB.rd*(1+r.damp),
 /* ride height is applied as extra body compression: lower = more negative height = body sits lower */
 rideOff:-r.height*.1,
 stat:[r.stiff&&pct(r.stiff)+' stiffness',r.damp&&pct(r.damp)+' damping',r.height&&pct(r.height)+' ride height'].filter(Boolean).join('  ')}});
const COLORS=[['Stock',null],['Signal Red',0xe11d2e],['Orange',0xff7a1a],['Yellow',0xfacc15],['Lime',0x84cc16],['Mint',0x10b981],['Cyan',0x06b6d4],['Blue',0x2563eb],['Violet',0x7c3aed],['Pink',0xec4899],['White',0xf1f5f9],['Black',0x111317],['Gunmetal',0x4b5563]];
const ACCENTS=[['Stock',null],['Flame',0xff7a1a],['Electric',0x22d3ee],['Toxic',0xa3e635],['Hot Pink',0xf43f5e],['Gold',0xfbbf24],['Chrome',0xe2e8f0]];
const PLATES=[null,7,13,21,46,69,77,99];
const WHEELS=[
 {n:'Stock Wheels',wr:1,tw:1,price:0,desc:'Factory size'},
 {n:'Street Slicks',wr:.96,tw:.88,price:.06,desc:'-4% size · narrow'},
 {n:'Trail Knobbies',wr:1.06,tw:1.18,price:.1,desc:'+6% size · wide'},
 {n:'Fat Tires',wr:1.1,tw:1.45,price:.14,desc:'+10% size · very wide'},
 {n:'Stunt Minis',wr:.9,tw:1.05,price:.08,desc:'-10% size'}];
const ACCS=[
 {id:'teddy',n:'Teddy Bear',icon:'🧸',price:150,desc:'Hangs off the stem'},
 {id:'flag',n:'Whip Flag',icon:'🚩',price:120,desc:'Tall safety flag'},
 {id:'rack',n:'Cargo Rack',icon:'📦',price:450,desc:'Rear rack and box'},
 {id:'mirrors',n:'Mirrors',icon:'🪞',price:200,desc:'Bar-end mirrors'},
 {id:'glow',n:'Underglow',icon:'💡',price:600,desc:'Neon ground light'}];
const TIERS=[{n:'Stock',b:0,p:0},{n:'Stage 1',b:.06,p:.08},{n:'Stage 2',b:.12,p:.18},{n:'Stage 3',b:.2,p:.35}];
/* k = index into the four stats [Motor Power, Torque, Balance, Boost] */
export const HW={
 battery:{label:'Battery',icon:'🔋',k:3,stat:'boost',names:['Stock Cells','Extended Pack','High-Density Pack','Pro Pack']},
 controller:{label:'Controller',icon:'🎛️',k:1,stat:'torque',names:['Stock Controller','Sport Controller','Race Controller','Pro Controller']},
 motor:{label:'Motor',icon:'⚙️',k:0,stat:'motor power',names:['Stock Motor','Wound Motor','High-Flux Motor','Pro Motor']},
 weight:{label:'Weight',icon:'🪶',k:2,stat:'balance',names:['Stock Parts','Alloy Parts','Carbon Parts','Titanium Kit']}};
const SOFT=[
 {id:'eco',n:'Eco Map',icon:'🌿',vmax:.9,price:0,desc:'-10% top speed'},
 {id:'std',n:'Standard Map',icon:'🟢',vmax:1,price:0,desc:'Factory mapping'},
 {id:'sport',n:'Sport Map',icon:'🔥',vmax:1.05,price:.1,desc:'+5% top speed'},
 {id:'track',n:'Track Map',icon:'🏁',vmax:1.1,price:.25,desc:'+10% top speed'}];
const partPrice=(base,frac)=>Math.round(Math.max(500,base.pr)*frac);

/* ================= saved state ================= */
export function tuneOf(S,i){
 if(!S.tune||typeof S.tune!=='object')S.tune={};
 /* v1.24 saves: 1 = Trail long-travel, 2 = Race firm. Move them to the matching new kits once. */
 if(S.suspV!==2){S.suspV=2;const m={1:3,2:4};if(S.suspension)for(const k in S.suspension){const v=Number(S.suspension[k]);if(m[v]!=null)S.suspension[k]=m[v]}}
 let t=S.tune[i];if(!t||typeof t!=='object')t=S.tune[i]={};
 if(!Array.isArray(t.own))t.own=[];if(!Array.isArray(t.acc))t.acc=[];
 if(!t.hw||typeof t.hw!=='object')t.hw={};
 for(const k in HW){const v=Number(t.hw[k]);t.hw[k]=Number.isInteger(v)&&v>=0&&v<TIERS.length?v:0}
 if(!Number.isInteger(t.wheel)||t.wheel<0||t.wheel>=WHEELS.length)t.wheel=0;
 if(!Number.isInteger(t.soft)||t.soft<0||t.soft>=SOFT.length)t.soft=1;
 if(t.color===undefined)t.color=null;if(t.accent===undefined)t.accent=null;if(t.plate===undefined)t.plate=null;
 return t}
export const suspKit=(S,i)=>{tuneOf(S,i);return SUSPENSIONS[Number(S.suspension?.[i]||0)]||SUSPENSIONS[0]};
const suspOwned=(S,i,idx)=>idx===0||Number(S.suspension?.[i]||0)===idx||tuneOf(S,i).own.includes('susp:'+SUSPENSIONS[idx].id);
export const suspLocked=(S,i,idx)=>{const n=SUSPENSIONS[idx].needs;if(!n)return false;return !suspOwned(S,i,SUSPENSIONS.findIndex(s=>s.id===n))&&Number(S.suspension?.[i]||0)!==idx};
export const tuneStat=(S,i,k)=>{const t=tuneOf(S,i);for(const id in HW)if(HW[id].k===k)return 1+TIERS[t.hw[id]].b;return 1};
export const tuneSoft=(S,i)=>SOFT[tuneOf(S,i).soft];
/* a copy of the bike spec with paint, livery, number plate and wheel choices applied */
export function bikeSpec(base,S,i){const t=tuneOf(S,i),w=WHEELS[t.wheel];
 return{...base,base,c:t.color!=null?t.color:base.c,a:t.accent!=null?t.accent:base.a,plate:t.plate,wr:base.wr*w.wr,tw:base.tw*w.tw}}

/* ================= accessories on the 3D bike ================= */
export function tuneDress(rig,S,i){
 const t=tuneOf(S,i);if(!t.acc.length||!rig||!rig.P||!rig.d)return;
 const d=rig.d,P=rig.P,wr=d.wr,wb=d.wb,sc=d.kind==='scooter',y0=wr*.9,
  hy=sc?Math.max(wr*2+.18,.98):wr*2+.18,hz=sc?Math.max(wb-.22,.9):wb-.22,hby=hy+d.hb*.5+.06,sy=sc?Math.max(y0+.34,.86):d.sy;
 const mt=(c,o={})=>new T.MeshStandardMaterial({color:c,roughness:.65,metalness:.1,...o});
 const put=(geo,m,x,y,z)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;P.add(o);return o};
 const rod=(a,b,r,m)=>{const A=new T.Vector3(...a),B=new T.Vector3(...b),o=new T.Mesh(new T.CylinderGeometry(r,r,A.distanceTo(B),8),m);o.position.copy(A).add(B).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),B.clone().sub(A).normalize());P.add(o);return o};
 const SP=new T.SphereGeometry(1,12,10);
 if(t.acc.includes('teddy')){const fur=mt(0x8a5a2b,{roughness:.95}),snout=mt(0xd9b38c,{roughness:.95}),g=new T.Group();g.position.set(.12,hby-.12,hz+.03);
  const s=(r,x,y,z,m=fur,sx=1,sy2=1,sz=1)=>{const o=new T.Mesh(SP,m);o.scale.set(r*sx,r*sy2,r*sz);o.position.set(x,y,z);g.add(o)};
  s(.045,0,0,0,fur,1,1.1,.9);s(.036,0,.07,0);s(.014,-.026,.1,0);s(.014,.026,.1,0);s(.014,0,.065,.03,snout);
  s(.017,-.05,.01,0,fur,1,1.3,1);s(.017,.05,.01,0,fur,1,1.3,1);s(.02,-.025,-.05,0);s(.02,.025,-.05,0);P.add(g);
  rod([.12,hby-.01,hz+.03],[.12,hby-.07,hz+.03],.004,mt(0xcccccc,{metalness:.8}))}
 if(t.acc.includes('flag')){const pole=mt(0x20242a,{metalness:.7}),cloth=new T.MeshStandardMaterial({color:d.a,emissive:d.a,emissiveIntensity:.25,side:T.DoubleSide,roughness:.8});
  rod([.14,sy+.02,-.28],[.14,sy+.78,-.28],.008,pole);const f=new T.Mesh(new T.PlaneGeometry(.3,.17),cloth);f.rotation.y=PI/2;f.position.set(.14,sy+.68,-.43);P.add(f)}
 if(t.acc.includes('rack')){const m=mt(0x15181d,{metalness:.6}),box=mt(d.a,{roughness:.4,metalness:.3});
  put(new RoundedBoxGeometry(.3,.02,.34,2,.008),m,0,sy+.12,-.3);
  for(const sx of [-1,1])rod([sx*.12,sy+.02,-.12],[sx*.12,sy+.12,-.4],.01,m);
  if(!sc)put(new RoundedBoxGeometry(.26,.16,.26,3,.03),box,0,sy+.22,-.3);else put(new RoundedBoxGeometry(.22,.12,.22,3,.03),box,0,sy+.2,-.3)}
 if(t.acc.includes('mirrors')){const st=mt(0x20242a,{metalness:.7}),gl=mt(0x9cc7e0,{metalness:.9,roughness:.08});
  for(const sx of [-1,1]){rod([sx*.34,hby+.02,hz-.08],[sx*.4,hby+.2,hz+.0],.007,st);const mm=put(new T.BoxGeometry(.09,.06,.012),gl,sx*.4,hby+.23,hz+.01);mm.rotation.y=sx*.35}}
 if(t.acc.includes('glow')){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),gr=x.createRadialGradient(64,64,4,64,64,62);gr.addColorStop(0,'rgba(80,230,255,.95)');gr.addColorStop(.5,'rgba(40,160,255,.45)');gr.addColorStop(1,'rgba(0,80,255,0)');x.fillStyle=gr;x.fillRect(0,0,128,128);
  const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;const gm=new T.Mesh(new T.PlaneGeometry(1.1,wb+1).rotateX(-PI/2),new T.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));gm.position.set(0,-wr+.02,wb*.5);gm.renderOrder=2;P.add(gm)}
}

/* ================= workshop room ================= */
const GC={x:6000,z:6000};
const LIGHT={main:150,fill:60};
function canvasTex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;if(rep){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rep[0],rep[1])}t.anisotropy=4;return t}
function buildRoom(){
 const g=new T.Group(),mt=(c,o={})=>new T.MeshStandardMaterial({color:c,roughness:.75,metalness:.1,...o}),B=(w,h,d)=>new T.BoxGeometry(w,h,d);
 const add=(geo,m,x,y,z,ry=0,parent=g)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.rotation.y=ry;parent.add(o);return o};
 const tile=canvasTex(512,512,(x,w,h)=>{x.fillStyle='#b8b3ce';x.fillRect(0,0,w,h);for(let i=0;i<5000;i++){const s=150+Math.random()*50|0;x.fillStyle='rgba('+s+','+s+','+(s+6)+',.18)';x.fillRect(Math.random()*w,Math.random()*h,2,2)}x.strokeStyle='#8c8793';x.lineWidth=4;x.strokeRect(2,2,w-4,h-4);x.beginPath();x.moveTo(w/2,0);x.lineTo(w/2,h);x.moveTo(0,h/2);x.lineTo(w,h/2);x.lineWidth=2;x.stroke()},[6,2]);
 const floor=canvasTex(512,512,(x,w,h)=>{x.fillStyle='#4b4d53';x.fillRect(0,0,w,h);for(let i=0;i<9000;i++){const s=50+Math.random()*50|0;x.fillStyle='rgba('+s+','+s+','+s+',.25)';x.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*3,1+Math.random()*3)}for(let i=0;i<14;i++){x.fillStyle='rgba(10,10,12,.16)';x.beginPath();x.ellipse(Math.random()*w,Math.random()*h,10+Math.random()*50,6+Math.random()*30,Math.random()*3,0,7);x.fill()}},[6,6]);
 const peg=canvasTex(512,256,(x,w,h)=>{x.fillStyle='#8f8c96';x.fillRect(0,0,w,h);x.fillStyle='#3e3c47';for(let j=0;j<h;j+=16)for(let i=((j/16)%2)*8;i<w;i+=16){x.beginPath();x.moveTo(i,j+1);x.lineTo(i+4,j+5);x.lineTo(i,j+9);x.lineTo(i-4,j+5);x.fill()}});
 const sign=canvasTex(1024,380,(x,w,h)=>{x.textAlign='center';x.textBaseline='middle';x.font='900 250px "Fredoka","Arial Rounded MT Bold","Trebuchet MS",system-ui,sans-serif';x.lineJoin='round';
  x.fillStyle='#3b3b3f';x.strokeStyle='#3b3b3f';x.lineWidth=46;x.strokeText('Tuning',w/2+10,h/2+22);x.fillText('Tuning',w/2+10,h/2+22);
  x.strokeStyle='#d9d9de';x.lineWidth=34;x.strokeText('Tuning',w/2,h/2);x.fillStyle='#ffffff';x.fillText('Tuning',w/2,h/2)});
 try{document.fonts?.load('900 100px Fredoka').then(()=>{sign.needsUpdate=true})}catch(e){}
 const red=mt(0x6b0707,{roughness:.55}),dark=mt(0x23272e),steel=mt(0xc7ccd1,{metalness:.8,roughness:.3});
 add(B(18,.4,16),mt(0xffffff,{map:floor,roughness:.95,metalness:0}),0,-.2,0);
 const wall=mt(0xffffff,{map:tile,roughness:.9,metalness:0});
 add(B(18,6,.4),wall,0,3,-8.2);add(B(.4,6,16),wall,-9.2,3,0);add(B(.4,6,16),dark,9.2,3,0);add(B(18,6,.4),dark,0,3,8.2);add(B(18,.4,16),mt(0x34373d),0,6.2,0);
 add(B(5.2,2.4,.08),mt(0xffffff,{map:peg,roughness:.7}),3.9,3.7,-7.96);
 add(new T.PlaneGeometry(6.4,2.4),new T.MeshBasicMaterial({map:sign,transparent:true}),-3.6,3.5,-7.97);
 /* workbench */
 add(B(5.6,.16,2),mt(0x4b4b50),3.9,1.62,-6.9);add(B(5.6,1.55,.1),red,3.9,.8,-7.85);add(B(.15,1.55,1.8),red,1.2,.8,-6.9);
 add(B(1.6,1.55,1.8),red,6.3,.8,-6.9);
 for(let i=0;i<5;i++){add(B(1.45,.04,.02),dark,6.3,.35+i*.3,-5.99);add(B(.5,.03,.04),steel,6.3,.5+i*.3,-5.97)}
 /* tool cabinets */
 const cabinet=(x,z,ry)=>{const c=new T.Group();c.position.set(x,0,z);c.rotation.y=ry;add(B(1.2,2,1.2),red,0,1.1,0,0,c);add(B(1.3,.08,1.3),mt(0x3b3d44),0,2.14,0,0,c);
  for(let i=0;i<7;i++){add(B(1.04,.05,.03),steel,0,.35+i*.27,.61,0,c);add(B(.4,.02,.03),dark,0,.28+i*.27,.62,0,c)}
  for(const sx of [-.5,.5])add(new T.CylinderGeometry(.07,.07,.08,10),dark,sx,.06,.4,0,c);g.add(c)};
 cabinet(-8.2,-2.4,PI/2);cabinet(-1.3,-7.3,0);
 /* turntable */
 add(new T.CylinderGeometry(2.75,2.75,.12,56),mt(0x15161f,{roughness:.8}),0,.06,0);
 add(new T.CylinderGeometry(2.55,2.55,.3,56),mt(0x303348,{roughness:.55,metalness:.3}),0,.15,0);
 add(new T.CylinderGeometry(2.58,2.58,.1,56),new T.MeshStandardMaterial({color:0x330000,emissive:0xff1111,emissiveIntensity:1.1}),0,.1,0);
 /* ceiling lights */
 const strip=new T.MeshBasicMaterial({color:0xffffff});for(const sx of [-3,3])add(B(.5,.06,8),strip,sx,5.95,0);
 const pl=(c,i,d,x,y,z)=>{const l=new T.PointLight(c,i,d,2);l.position.set(x,y,z);g.add(l)};
 pl(0xfff3df,LIGHT.main,26,-3,5.2,0);pl(0xfff3df,LIGHT.main,26,3,5.2,-2);pl(0xb8cfff,LIGHT.fill,22,0,3,5.6);
 g.traverse(o=>{if(o.isMesh)o.receiveShadow=true});
 g.position.set(GC.x,0,GC.z);return g}

/* ================= tuning garage (3D room + menu) ================= */
export function createTuningGarage(ctx){
 const {scene,S,BIKES}=ctx;
 let room=null,panel=null,bar=null;
 const st={view:'root',hw:'battery'};
 const api={on:false,spot:{x:GC.x,y:.3,z:GC.z},heading:ga=>ga*.7+.5,
  camera(cam){cam.position.set(GC.x+3.4,1.45,GC.z+4.6);cam.lookAt(GC.x-.3,.8,GC.z-.6)},
  open(){if(api.on)return;ensure();room.visible=true;api.on=true;st.view='root';ctx.onEnter&&ctx.onEnter();ctx.rebuild();ctx.vo();render()},
  close(silent){if(!api.on)return;api.on=false;panel.style.display='none';bar.style.display='none';room.visible=false;ctx.vo();if(!silent&&ctx.onExit)ctx.onExit()}};

 const CSS=`
 .tn-panel{position:fixed;top:0;right:0;bottom:0;width:min(36vw,470px);min-width:330px;background:#1a1f28;color:#fff;font-family:"Fredoka","Arial Rounded MT Bold","Trebuchet MS",system-ui,sans-serif;z-index:60;display:none;overflow-y:auto;padding:12px 12px 80px;box-sizing:border-box;border-left:2px solid #11151b}
 .tn-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
 .tn-head h2{margin:0;font-size:40px;line-height:1;font-weight:700;text-shadow:0 3px 0 #000}
 .tn-btn{border:0;border-radius:8px;padding:10px 16px;font:inherit;font-weight:700;font-size:18px;color:#fff;cursor:pointer}
 .tn-btn.exit{background:#ef4444}.tn-btn.back{background:#f97316}.tn-btn:focus-visible,.tn-card:focus-visible,.tn-tab:focus-visible{outline:3px solid #fff;outline-offset:2px}
 .tn-cash{font-size:16px;color:#a3e635;margin:-2px 0 10px 2px;font-weight:600}
 .tn-sec{margin:14px 0 6px;font-size:15px;color:#9aa4b2;font-weight:600}
 .tn-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
 .tn-card{position:relative;text-align:left;min-height:150px;border:2px solid #2a313c;border-radius:6px;background:radial-gradient(circle at 72% 62%,rgba(255,122,26,.28),transparent 58%),#262d38;color:#fff;font:inherit;padding:8px 10px;cursor:pointer;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between}
 .tn-card b{font-size:20px;font-weight:700;line-height:1.05;text-shadow:0 2px 0 rgba(0,0,0,.6)}
 .tn-card .ic{font-size:56px;line-height:1;text-align:center;filter:drop-shadow(0 4px 6px rgba(0,0,0,.6))}
 .tn-card .sw{width:64px;height:64px;border-radius:50%;margin:0 auto;border:3px solid rgba(255,255,255,.85);box-shadow:0 4px 10px rgba(0,0,0,.5)}
 .tn-card .st{font-size:14px;font-weight:700;color:#ff8a1f;line-height:1.15;min-height:16px}
 .tn-card .pr{position:absolute;top:8px;right:10px;font-size:14px;font-weight:700;color:#a3e635}
 .tn-card.sel{border-color:#22c55e;box-shadow:inset 0 0 0 1px #22c55e}
 .tn-card.sel .pr{color:#22c55e}
 .tn-card.locked{opacity:.55;filter:grayscale(.7)}.tn-card.locked .ic::after{content:"🔒";position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);font-size:46px}
 .tn-bar{position:fixed;left:0;bottom:0;right:min(36vw,470px);min-width:0;display:none;gap:8px;padding:8px;background:rgba(20,24,32,.94);z-index:61;overflow-x:auto;box-sizing:border-box;font-family:"Fredoka","Arial Rounded MT Bold","Trebuchet MS",system-ui,sans-serif}
 .tn-tab{position:relative;flex:0 0 96px;height:92px;border:2px solid transparent;border-radius:6px;background:radial-gradient(circle at 50% 35%,rgba(220,60,70,.35),transparent 70%),#232a35;color:#fff;font:inherit;font-weight:700;font-size:15px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:4px 2px}
 .tn-tab .ic{font-size:36px;line-height:1.1}.tn-tab.sel{border-color:#22c55e}.tn-tab .ck{position:absolute;top:2px;right:6px;color:#22c55e;font-size:18px}
 @media(max-width:700px){.tn-panel{top:auto;height:52vh;width:100%;min-width:0;border-left:0;border-top:2px solid #11151b}.tn-bar{right:0;bottom:52vh}.tn-head h2{font-size:30px}.tn-card{min-height:120px}.tn-card .ic{font-size:42px}}
 @media(prefers-reduced-motion:no-preference){.tn-card{transition:transform .08s}.tn-card:active{transform:scale(.98)}}`;
 function ensure(){if(room)return;room=buildRoom();scene.add(room);
  try{const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&display=swap';document.head.appendChild(l)}catch(e){}
  const s=document.createElement('style');s.textContent=CSS;document.head.appendChild(s);
  panel=document.createElement('div');panel.className='tn-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Tuning');
  bar=document.createElement('div');bar.className='tn-bar';
  document.body.append(panel,bar);
  const click=e=>{const el=e.target.closest('[data-go],[data-k]');if(!el)return;
   if(el.dataset.go){const go=el.dataset.go;
    if(go==='exit')api.close();else if(go==='back')st.view='root';else if(go.startsWith('hw:'))st.hw=go.slice(3);else st.view=go;render();return}
   apply(el.dataset.k,+el.dataset.i)};
  panel.addEventListener('click',click);bar.addEventListener('click',click);
  addEventListener('keydown',e=>{if(api.on&&e.code==='Escape'){e.stopPropagation();api.close()}},true)}

 function apply(kind,idx){
  const t=tuneOf(S,S.eq),b=BIKES[S.eq];
  const buy=(token,price,doIt)=>{if(!token||price<=0||t.own.includes(token)){doIt();return}
   if(S.cash<price){ctx.pop('NOT ENOUGH CASH · '+money(price),'#f87171');return}
   S.cash-=price;t.own.push(token);doIt();ctx.pop('INSTALLED · '+money(price),'#4ade80')};
  if(kind==='color'){const[,hex]=COLORS[idx];buy(hex==null?null:'col:'+hex,250,()=>{t.color=hex})}
  else if(kind==='accent'){const[,hex]=ACCENTS[idx];buy(hex==null?null:'dec:'+hex,200,()=>{t.accent=hex})}
  else if(kind==='plate'){const n=PLATES[idx];buy(n==null?null:'num:'+n,100,()=>{t.plate=n==null?null:n-1})}
  else if(kind==='wheel'){buy(idx?'wheel:'+idx:null,partPrice(b,WHEELS[idx].price),()=>{t.wheel=idx})}
  else if(kind==='acc'){const a=ACCS[idx],on=t.acc.includes(a.id);
   if(on)t.acc=t.acc.filter(q=>q!==a.id);else buy('acc:'+a.id,a.price,()=>{t.acc.push(a.id)})}
  else if(kind==='hw'){const tier=idx;buy(tier?'hw:'+st.hw+':'+tier:null,partPrice(b,TIERS[tier].p),()=>{t.hw[st.hw]=tier})}
  else if(kind==='susp'){const s=SUSPENSIONS[idx];
   if(suspLocked(S,S.eq,idx)){ctx.pop('INSTALL RACE SUSPENSION TO UNLOCK STANCE','#facc15');return}
   buy(idx&&!suspOwned(S,S.eq,idx)?'susp:'+s.id:null,partPrice(b,s.price),()=>{S.suspension[S.eq]=idx})}
  else if(kind==='soft'){const s=SOFT[idx];buy(s.price?'soft:'+s.id:null,partPrice(b,s.price),()=>{t.soft=idx})}
  ctx.save();ctx.rebuild();render()}

 const card=o=>`<button class="tn-card${o.sel?' sel':''}${o.locked?' locked':''}" data-k="${o.k}" data-i="${o.i}" aria-pressed="${!!o.sel}"><span class="pr">${o.sel?'✓':o.own?'':o.price?money(o.price):''}</span><b>${o.title}</b>${o.sw!=null?`<span class="sw" style="background:#${o.sw.toString(16).padStart(6,'0')}"></span>`:o.sw===null?'<span class="sw" style="background:conic-gradient(#e11d2e,#facc15,#84cc16,#06b6d4,#7c3aed,#e11d2e)"></span>':`<span class="ic">${o.icon||'•'}</span>`}<span class="st">${o.stat||''}</span></button>`;
 function render(){
  if(!panel)return;const t=tuneOf(S,S.eq),b=BIKES[S.eq],v=st.view,owns=tok=>t.own.includes(tok);
  const titles={root:'Tuning',color:'Color',decals:'Decals',wheels:'Wheels',accessories:'Accessories',hardware:'Hardware',software:'Software'};
  let h=`<div class="tn-head"><h2>${titles[v]||'Tuning'}</h2>${v==='root'?'<button class="tn-btn exit" data-go="exit">✕ Exit</button>':'<button class="tn-btn back" data-go="back">← Back</button>'}</div><div class="tn-cash">${b.n} · ${money(S.cash)}</div>`;
  bar.style.display=v==='hardware'?'flex':'none';
  if(v==='root'){const cats=[['color','Color','🎨'],['decals','Decals','🏷️'],['wheels','Wheels','🛞'],['accessories','Accessories','🧰'],['hardware','Hardware','⚙️'],['software','Software','📟']];
   h+='<div class="tn-grid">'+cats.map(([id,n,ic])=>`<button class="tn-card" data-go="${id}"><b>${n}</b><span class="ic">${ic}</span><span class="st"></span></button>`).join('')+'</div>'}
  else if(v==='color'){h+='<div class="tn-grid">'+COLORS.map(([n,hex],i)=>card({k:'color',i,title:n,sw:hex,sel:t.color===hex,own:hex==null||owns('col:'+hex),price:250})).join('')+'</div>'}
  else if(v==='decals'){h+='<div class="tn-sec">Livery accent</div><div class="tn-grid">'+ACCENTS.map(([n,hex],i)=>card({k:'accent',i,title:n,sw:hex,sel:t.accent===hex,own:hex==null||owns('dec:'+hex),price:200})).join('')+'</div>'
   +'<div class="tn-sec">Race number</div><div class="tn-grid">'+PLATES.map((n,i)=>card({k:'plate',i,title:n==null?'Stock number':'No. '+String(n).padStart(2,'0'),icon:'🔢',sel:t.plate===(n==null?null:n-1),own:n==null||owns('num:'+n),price:100})).join('')+'</div>'}
  else if(v==='wheels'){h+='<div class="tn-grid">'+WHEELS.map((w,i)=>card({k:'wheel',i,title:w.n,icon:'🛞',stat:w.desc,sel:t.wheel===i,own:!w.price||owns('wheel:'+i),price:partPrice(b,w.price)})).join('')+'</div>'}
  else if(v==='accessories'){h+='<div class="tn-grid">'+ACCS.map((a,i)=>card({k:'acc',i,title:a.n,icon:a.icon,stat:a.desc,sel:t.acc.includes(a.id),own:owns('acc:'+a.id),price:a.price})).join('')+'</div>'}
  else if(v==='software'){h+='<div class="tn-grid">'+SOFT.map((s,i)=>card({k:'soft',i,title:s.n,icon:s.icon,stat:s.desc,sel:t.soft===i,own:!s.price||owns('soft:'+s.id),price:partPrice(b,s.price)})).join('')+'</div>'}
  else if(v==='hardware'){
   if(st.hw==='suspension'){h+='<div class="tn-grid">'+SUSPENSIONS.map((s,i)=>card({k:'susp',i,title:s.n,icon:'🔩',stat:s.stat||'Factory setup',sel:Number(S.suspension[S.eq]||0)===i,locked:suspLocked(S,S.eq,i),own:suspOwned(S,S.eq,i),price:partPrice(b,s.price)})).join('')+'</div>'}
   else{const H=HW[st.hw];h+='<div class="tn-grid">'+TIERS.map((tr,i)=>card({k:'hw',i,title:H.names[i],icon:H.icon,stat:i?pct(tr.b)+' '+H.stat:'Factory part',sel:t.hw[st.hw]===i,own:!tr.p||owns('hw:'+st.hw+':'+i),price:partPrice(b,tr.p)})).join('')+'</div>';
    if(st.hw==='battery')h+='<div class="tn-sec">Boost also needs a boost mount from the Mod Shop.</div>'}
   const items=[...Object.entries(HW).map(([id,H])=>[id,H.label,H.icon,t.hw[id]>0]),['suspension','Suspension','🛠️',Number(S.suspension[S.eq]||0)>0]];
   bar.innerHTML=items.map(([id,n,ic,ck])=>`<button class="tn-tab${st.hw===id?' sel':''}" data-go="hw:${id}">${ck?'<span class="ck">✓</span>':''}<span class="ic">${ic}</span>${n}</button>`).join('')}
  panel.innerHTML=h;panel.style.display='block'}
 return api}
