import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
const $=id=>document.getElementById(id),PI=Math.PI,VERSION='1.18';
window.WheelieXLoading?.finish();
const ls=$('loading-screen');if(ls){ls.classList.add('done');ls.classList.add('hidden');}
/* ---------- save ---------- */
let S;try{S=JSON.parse(localStorage.getItem('ebl1'))}catch(e){}
let LB;try{LB=JSON.parse(localStorage.getItem('ebl1-lb'))}catch(e){}
LB=LB||[];
S=S||{cash:0,own:[0],eq:0,up:{},suspension:{},boostMount:{},hacks:{},helmetOwn:[0],helmet:0};S.suspension=S.suspension||{};S.boostMount=S.boostMount||{};S.hacks=S.hacks||[];S.helmetOwn=S.helmetOwn||[0];S.helmet=S.helmet==null?0:S.helmet;S.rideout=Number.isInteger(S.rideout)&&S.rideout>=-1&&S.rideout<=1?S.rideout:-1;let rideTier=S.rideout;
S.units=S.units==null?1:!!S.units;S.accessibility={reducedMotion:!!S.accessibility?.reducedMotion,largeText:!!S.accessibility?.largeText,highContrast:!!S.accessibility?.highContrast};
const resetLegacyBoost=!!(S.overclock||S.hackedStats);
delete S.overclock;
delete S.hackedStats;
S.policeDifficulty=['easy','medium','hard','insane','death'].includes(S.policeDifficulty)?S.policeDifficulty:'medium';
S.graphics=S.graphics==='low'?'low':'high';
const acc=S.accessibility||{};if(typeof S.up!=='object'||!S.up)S.up={};document.body.classList.toggle('a11y-reduced-motion',!!acc.reducedMotion);
document.body.classList.toggle('a11y-large-text',!!acc.largeText);
document.body.classList.toggle('a11y-high-contrast',!!acc.highContrast);
const save=()=>{S.rideout=rideTier;try{localStorage.setItem('ebl1',JSON.stringify(S));localStorage.setItem('ebl1-lb',JSON.stringify(LB))}catch(e){}};
const QUESTS=[
 {n:'FIRST FLIP',t:'Land a backflip, frontflip or barrel roll',cash:250},
 {n:'WHEELIE PRO',t:'Land a clean wheelie',cash:150},
 {n:'RIDEOUT HOST',t:'Host a rideout at an empty car park',cash:300},
 {n:'CASH HUSTLE',t:'Bank $1,000 cash in one ride',cash:500}];
let quest=QUESTS[0],questStage=0,questCash=0;
function qDone(i){questCash=0;if(i+1<QUESTS.length){quest=QUESTS[i+1];questStage=i+1;}else{quest=null;questStage=QUESTS.length}}
function qCheck(i){if(questStage===i){questStage=i+1;qDone(i)}}
const verLabel=v=>v?'v'+v:'v?',verColor=v=>v===VERSION?'#a3e635':'#f87171';
const verEl=$('ver');if(verEl)verEl.textContent='v'+VERSION;
if(resetLegacyBoost)save();
/* ---------- bikes ---------- */
const B=(n,pr,s,c,a,f,sc,wr,tw,wb,bw,bh,sl,sy,hb,fh,maxMph,kind='bike')=>({n,pr,s,c,a,f,sc,wr,tw,wb,bw,bh,sl,sy,hb,fh,maxMph,kind});
const BIKES=[
B("City E-Cruiser",0,[3,3,8,2],2450411,14427686,11184810,2236962,0.31,0.07,1.18,0.32,0.32,0.6,0.62,0.22,0,25),
B("Super73 RX Mojave",1200,[4,4,7,3],5660730,14268794,8947848,12884579,0.255,0.11,1.25,0.28,0.26,0.95,0.52,0.45,0,28),
B("Talaria XXX",3000,[5,5,7,4],1118481,3355443,5592405,1118481,0.28,0.09,1.3,0.2,0.3,0.6,0.7,0.1,0,50),
B("Sur-Ron Hyper Bee",4500,[3,4,8,3],15680580,1118481,13421772,1118481,0.23,0.08,1.15,0.2,0.26,0.5,0.64,0.12,0,40),
B("Sur-Ron Light Bee X",7000,[6,6,7,5],1842204,16436245,16436245,1118481,0.27,0.09,1.28,0.2,0.28,0.55,0.66,0.12,0,47),
B("Talaria Sting R MX4",12000,[7,7,6,6],959977,1118481,13948120,1118481,0.29,0.1,1.34,0.22,0.3,0.55,0.7,0.14,1,53),
B("E Ride Pro SS 2.0",16000,[8,8,6,7],8141549,1118481,10980346,1118481,0.3,0.11,1.32,0.24,0.3,0.6,0.66,0.12,0,60),
B("Segway X260",9500,[5,6,8,5],16119285,1118481,10066329,2236962,0.29,0.09,1.37,0.24,0.32,0.62,0.74,0.15,1,47),
B("CAKE Kalk INK",22000,[7,6,9,7],16317180,1118481,14540253,1118481,0.28,0.08,1.33,0.22,0.3,0.55,0.68,0.1,0,50),
B("Sur-Ron Ultra Bee",32000,[9,9,7,8],2042167,2282478,2282478,1118481,0.31,0.11,1.4,0.26,0.32,0.6,0.72,0.14,1,56),
B("Sur-Ron Storm Bee",40000,[9,10,6,9],988970,16096779,16096779,1118481,0.32,0.12,1.5,0.28,0.34,0.62,0.76,0.16,1,68),
B("Stark VARG 80 HP",55000,[10,10,8,10],14427686,1118481,6710886,1118481,0.31,0.12,1.5,0.26,0.34,0.6,0.76,0.16,1,80),
B("KuKirin G2 Pro",450,[3,3,7,2],6660877,1120295,11583173,2503224,0.14,0.07,0.86,0.2,0.13,0.55,0,0.9,0,28,'scooter'),
B("KuKirin G3 Pro",1200,[5,5,8,4],959977,1120295,13358561,1120295,0.16,0.08,0.98,0.22,0.15,0.62,0,1.05,0,40,'scooter'),
B("Segway Ninebot Max G30P",650,[2,2,6,2],15265522,2240572,10466248,2898502,0.11,0.06,0.8,0.18,0.12,0.5,0,0.85,0,19,'scooter'),
B("Apollo Go",700,[3,3,7,3],1450810,3359054,8228771,2766144,0.12,0.05,0.75,0.16,0.11,0.45,0,0.8,0,28,'scooter'),
B("NAMI Burn-E 2",1500,[6,6,7,5],2302755,4937059,9279912,2830908,0.15,0.07,0.9,0.2,0.14,0.5,0,0.9,0,45,'scooter'),
B("Dualtron Storm",2400,[7,7,6,6],1711393,4871528,9148586,2304563,0.16,0.08,1,0.24,0.16,0.55,0,0.95,0,55,'scooter'),
B("Kaabo Wolf King GT",3100,[8,8,6,7],1053720,4147027,7042694,1909804,0.18,0.09,1.05,0.26,0.18,0.6,0,1,0,60,'scooter')];
const HELMETS=[
 {n:'Street Helm',pr:300,color:0xf2f4e8,accent:0x2563eb,desc:'All-round urban shell'},
 {n:'Trail Helm',pr:900,color:0x20272a,accent:0x38bdf8,desc:'Rock-and-dirt protection'},
 {n:'Moto Helm',pr:1800,color:0x111827,accent:0xf59e0b,desc:'Aggressive street fit'},
 {n:'Racing Helm',pr:2400,color:0xf8fafc,accent:0xdb3444,desc:'Maximum coverage aero shell'},
 {n:'Police Helm',pr:3500,color:0xe8edf0,accent:0x152334,desc:'Enforcement ballistic shell'}];
/* Bike indices are stored in saves; this only changes the garage's display order. */
const BIKE_ORDER=BIKES.map((b,i)=>i).sort((a,b)=>BIKES[a].pr-BIKES[b].pr);
/* Saved bike/helmet indices are validated here: BIKES and HELMETS must exist first. */
if(!Number.isInteger(S.eq)||S.eq<0||S.eq>=BIKES.length)S.eq=0;if(!Array.isArray(S.own)||!S.own.includes(S.eq)){S.own=Array.isArray(S.own)?S.own.filter(i=>Number.isInteger(i)&&i>=0&&i<BIKES.length):[0];if(!S.own.includes(S.eq))S.own.push(S.eq)}if(!Number.isInteger(S.helmet)||S.helmet<0||S.helmet>=HELMETS.length)S.helmet=0;if(!Array.isArray(S.helmetOwn)||!S.helmetOwn.includes(S.helmet)){S.helmetOwn=Array.isArray(S.helmetOwn)?S.helmetOwn.filter(i=>Number.isInteger(i)&&i>=0&&i<HELMETS.length):[0];if(!S.helmetOwn.includes(S.helmet))S.helmetOwn.push(S.helmet)}
const SUSPENSIONS=[
{n:'Factory',travel:.16,frontTravel:.16,rearTravel:.15,frontSpring:60,frontDamping:17,rearSpring:68,rearDamping:18,price:0},
{n:'Trail long-travel',travel:.34,frontTravel:.36,rearTravel:.32,frontSpring:42,frontDamping:16,rearSpring:50,rearDamping:17,price:.18},
{n:'Race firm',travel:.21,frontTravel:.22,rearTravel:.2,frontSpring:100,frontDamping:20,rearSpring:112,rearDamping:21,price:.3}];
const HACK_RARITIES=[
{id:'common',name:'Common',chance:50,boost:.05,color:'#94a3b8'},
{id:'uncommon',name:'Uncommon',chance:25,boost:.1,color:'#4ade80'},
{id:'rare',name:'Rare',chance:15,boost:.2,color:'#38bdf8'},
{id:'epic',name:'Epic',chance:7,boost:.35,color:'#a78bfa'},
{id:'legendary',name:'Legendary',chance:2.5,boost:.5,color:'#facc15'},
{id:'mythic',name:'Mythic',chance:.49,boost:.75,color:'#fb7185'},
{id:'secret',name:'Secret',chance:.01,boost:0,color:'#fff'}];
const hackRarity=i=>HACK_RARITIES.find(r=>r.id===S.hacks[i]),hackRank=i=>HACK_RARITIES.findIndex(r=>r.id===S.hacks[i]);
const lv=i=>S.up[i]||(S.up[i]=[1,1,1,1]),eff=i=>{const rarity=hackRarity(i);return BIKES[i].s.map((s,k)=>rarity?.id==='secret'?10:Math.min(10,s*(1+(lv(i)[k]-1)*.015)*(1+(rarity?.boost||0))))},cost=(i,l)=>Math.round(100*l*l+BIKES[i].pr*.03*l);
const modPrice=(i,m)=>Math.round(Math.max(500,BIKES[i].pr)*m),mountPrice=(i,t)=>Math.round(Math.max(1000,BIKES[i].pr)*(t===1?3:4)),hackPrice=i=>Math.max(25000,Math.round(BIKES[i].pr*3));
/* Empty car parks where riders host stunt rideouts. Hosting costs cash and boosts money earned on the rideout. */
const RIDEOUTS=[{n:'Street Rideout',fee:25000,mult:1.5},{n:'Super Rideout',fee:30000,mult:2}];
const RIDEOUT_SPOTS=[{n:'Meadowbrook Car Park',x:30,z:14}];
const rideMult=()=>rideTier<0?1:RIDEOUTS[rideTier].mult;
function hostRideout(i){const r=RIDEOUTS[rideTier<0?0:rideTier],sp=RIDEOUT_SPOTS[i];if(S.cash<r.fee){pop('NOT ENOUGH CASH TO HOST A RIDEOUT','#f87171');return}S.cash-=r.fee;rideTier=rideTier<0?0:rideTier;save();pop(`HOST TELEPORT · ${sp.n.toUpperCase()} · ${r.n} BOUNCED ${r.mult}×`,'#c0f56a',15000);if(questStage===2){questStage=3;qDone(2)}
/* A hosted rideout starts in the empty car park: drop the rider there so the ride can begin. */
x=sp.x;z=sp.z;y=gH(sp.x,sp.z);v=0;p=0;pw=0;wheelieHold=0;air=false;vy=0;camInit=true;if(wanted){wanted=0;heat=0;chaseT=0;escT=0}
for(const c of portCraft){scene.remove(c);c.traverse(o=>{if(o.isMesh){o.geometry?.dispose?.();o.material?.dispose?.()}})}
portCraft.length=0;
addPortCraft(buildBoat,sp,{x:0,y:0,z:7});
addPortCraft(buildJet,sp,{x:-5,y:0,z:9});
pop(`PORT DOCKED · JETSKI + BOAT AT ${sp.n.toUpperCase()}`,'#38bdf8',3000);}
/* ---------- three setup ---------- */
const cv=$('g');
const GFX={
 low:{label:'Low',dpr:.5,antialias:false,shadow:false,shadowSize:256,particles:.25,chunks:1,post:false,parts:.5},
 high:{label:'High',dpr:Math.min(devicePixelRatio,1.5),antialias:true,shadow:true,shadowSize:2048,particles:1,chunks:3,post:true,bloom:true,msaa:4,parts:1.5},
};
let GFXP=S.graphics||'high';
let composer=null;
const R=new T.WebGLRenderer({canvas:cv,antialias:GFX[GFXP].antialias});R.setPixelRatio(GFX[GFXP].dpr);R.shadowMap.enabled=GFX[GFXP].shadow;R.shadowMap.type=T.PCFSoftShadowMap;
R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.05;const aniso=Math.min(8,R.capabilities.getMaxAnisotropy());
const FOG_D=new T.Color(0xbfdef2),FOG_N=new T.Color(0x0a1020);const scene=new T.Scene();scene.fog=new T.Fog(0xbfdef2,70,260);
const cam=new T.PerspectiveCamera(62,1,.1,2500);
const hemi=new T.HemisphereLight(0xffffff,0x667755,1.0);scene.add(hemi);
const sun=new T.DirectionalLight(0xfff2d8,2.2);sun.castShadow=GFX[GFXP].shadow;sun.shadow.mapSize.set(GFX[GFXP].shadowSize,GFX[GFXP].shadowSize);const sc=sun.shadow.camera;sc.left=sc.bottom=-45;sc.right=sc.top=45;sc.far=250;sun.shadow.bias=-.0004;sun.shadow.normalBias=.05;scene.add(sun,sun.target);
const skyMaterial=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{daylight:{value:1},warm:{value:0},sunDir:{value:new T.Vector3(.5,.8,.3)}},vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform float daylight,warm;uniform vec3 sunDir;varying vec3 p;void main(){vec3 d=normalize(p);float h=clamp(d.y,0.,1.);vec3 day=mix(vec3(.75,.87,.95),vec3(.18,.45,.85),pow(h,.55));vec3 night=mix(vec3(.015,.025,.06),vec3(.035,.07,.15),pow(h,.55));vec3 col=mix(night,day,daylight);col=mix(col,vec3(1.,.55,.3),warm*.55*pow(1.-h,3.));float s=max(dot(d,normalize(sunDir)),0.);col+=vec3(1.,.85,.6)*(pow(s,48.)*.35+pow(s,900.)*2.)*daylight;gl_FragColor=vec4(col,1.);}'}),sky=new T.Mesh(new T.SphereGeometry(1000,16,12),skyMaterial);scene.add(sky);
const mat=(c,o={})=>new T.MeshStandardMaterial({color:c,roughness:.5,metalness:.3,...o});
const boxGeo=new T.BoxGeometry(1,1,1);
const bx=(w,h,l,m,x,y,z)=>{const o=new T.Mesh(boxGeo,m);o.scale.set(w,h,l);o.position.set(x,y,z);return o};
const tb=(a,b,r,m)=>{const A=new T.Vector3(...a),Bv=new T.Vector3(...b),o=new T.Mesh(new T.CylinderGeometry(r,r,A.distanceTo(Bv),8),m);o.position.copy(A).add(Bv).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),Bv.clone().sub(A).normalize());return o};
const makeHelix=(turns,radius,wire,material)=>{const points=[],segments=turns*18;for(let i=0;i<=segments;i++){const t=i/segments,a=t*turns*2*PI;points.push(new T.Vector3(Math.cos(a)*radius,t-.5,Math.sin(a)*radius))}const curve=new T.CatmullRomCurve3(points);return new T.Mesh(new T.TubeGeometry(curve,segments,wire,8,false),material)};
const alignAxial=(group,a,b)=>{const axis=b.clone().sub(a),length=axis.length();group.position.copy(a).add(b).multiplyScalar(.5);group.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),axis.normalize());group.scale.set(1,length,1)};
const tireMap=(()=>{const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');x.fillStyle='#191b1d';x.fillRect(0,0,512,256);x.strokeStyle='#303438';x.lineWidth=16;for(let i=-256;i<640;i+=64){x.beginPath();x.moveTo(i,0);x.lineTo(i+120,256);x.stroke();x.beginPath();x.moveTo(i+32,0);x.lineTo(i-88,256);x.stroke()}x.strokeStyle='#3d4348';x.lineWidth=5;for(let i=-256;i<640;i+=32){x.beginPath();x.moveTo(i,0);x.lineTo(i+60,256);x.stroke();x.beginPath();x.moveTo(i+16,0);x.lineTo(i-44,256);x.stroke()}for(let i=0;i<3600;i++){const s=22+Math.random()*28;x.fillStyle=`rgba(${s},${s+2},${s+4},.14)`;x.fillRect(Math.random()*512,Math.random()*256,1+Math.random()*3,1+Math.random()*3)}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=aniso;return t})();
/* ---------- bike model ---------- */
function buildBike(d,shirt,helmetColor=0x20272a,lit=false){
const g=new T.Group(),P=new T.Group();g.add(P);
const M=mat(d.c,{roughness:.38,metalness:.28}),A=mat(d.a,{roughness:.42,metalness:.22}),F=mat(d.f,{metalness:.9,roughness:.3}),K=mat(0xffffff,{map:tireMap,roughness:.95,metalness:0}),rubber=mat(0x17191b,{roughness:.92,metalness:0}),SM=mat(d.sc,{roughness:.72}),SH=mat(shirt,{metalness:0}),PN=mat(0x222244,{metalness:0});
const HEM=mat(helmetColor,{roughness:.32,metalness:.5});
const wh=()=>{const w=new T.Group(),s=new T.Group();w.add(s);
const t=new T.Mesh(new T.CylinderGeometry(d.wr,d.wr,d.tw,20),K);t.rotation.z=1.5708;s.add(t);
const hub=new T.Mesh(new T.CylinderGeometry(d.wr*.2,d.wr*.2,d.tw+.035,16),F);hub.rotation.z=PI/2;s.add(hub);
for(const side of [-1,1]){
const rim=new T.Mesh(new T.TorusGeometry(d.wr*.78,.018,6,28),A);rim.rotation.y=PI/2;rim.position.x=side*d.tw*.34;s.add(rim);
const disc=new T.Mesh(new T.CylinderGeometry(d.wr*.46,d.wr*.46,.018,32),F);disc.rotation.z=PI/2;disc.position.x=side*d.tw*.34;s.add(disc);
const rotorRim=new T.Mesh(new T.TorusGeometry(d.wr*.41,.008,6,28),A);rotorRim.rotation.y=PI/2;rotorRim.position.x=side*d.tw*.34;s.add(rotorRim);
for(let i=0;i<10;i++){const a=i*PI/5,hole=new T.Mesh(new T.CylinderGeometry(.008,.008,.024,8),rubber);hole.rotation.z=PI/2;hole.position.set(side*d.tw*.34,Math.sin(a)*d.wr*.34,Math.cos(a)*d.wr*.34);s.add(hole)}
const axle=side*d.tw*.34;
for(let i=0;i<14;i++){const a=i*PI/7,sp=tb([axle,Math.sin(a)*d.wr*.18,Math.cos(a)*d.wr*.18],[axle,Math.sin(a)*d.wr*.78,Math.cos(a)*d.wr*.78],.007,F);s.add(sp)}
}
return{mount:w,spin:s}};
const wb=d.wb,y0=d.wr*.9,standH=d.kind==='scooter',hy=standH?Math.max(d.wr*2+.18,0.98):d.wr*2+.18,hz=standH?Math.max(wb-.22,0.9):wb-.22,hby=hy+d.hb*.5+.06,frontSpacing=.105,sy=standH?Math.max(y0+.34,0.86):d.sy;
const rw=wh(),fw=wh(),frontAssembly=new T.Group(),rearAssembly=new T.Group();
P.add(frontAssembly,rearAssembly);frontAssembly.add(fw.mount);fw.mount.position.z=wb;
const pivotY=y0*.7,pivotZ=wb*.3,rearArmLength=Math.hypot(pivotY,pivotZ);
rearAssembly.position.set(0,pivotY,pivotZ);rearAssembly.add(rw.mount);rw.mount.position.set(0,-pivotY,-pivotZ);
const forkAxis=new T.Vector3(0,hy,hz-wb).normalize(),forkPoint=(side,t)=>new T.Vector3(side*frontSpacing,0,wb).lerp(new T.Vector3(side*frontSpacing,hy,hz),t);
for(const[front,assembly,z]of [[true,frontAssembly,wb],[false,rearAssembly,-pivotZ]]){const fender=new T.Mesh(new T.TorusGeometry(d.wr*(front&&d.fh?1.2:1.14),.038,7,28,PI),SM);fender.rotation.y=PI/2;fender.position.set(0,front?(d.fh?0.035:0.015):-pivotY+0.015,z);assembly.add(fender)}
const frontCoils=[];
for(const side of [-1,1]){
const lower=new T.Group();frontAssembly.add(lower);
lower.add(tb(forkPoint(side,.015).toArray(),forkPoint(side,.4).toArray(),.031,SM));
lower.add(tb(forkPoint(side,.31).toArray(),forkPoint(side,.41).toArray(),.037,A));
P.add(tb(forkPoint(side,.22).toArray(),forkPoint(side,.99).toArray(),.024,F));
const coil=makeHelix(10,.043,.005,F);P.add(coil);frontCoils.push({mesh:coil,side});
if(side===1)frontAssembly.add(bx(.06,.12,.1,PN,-frontSpacing,.05,wb-.08));
}
frontAssembly.add(tb([-frontSpacing,0,wb],[frontSpacing,0,wb],.025,F));
for(const side of [-1,1]){const axleBolt=new T.Mesh(new T.CylinderGeometry(.02,.02,.055,12),F);axleBolt.rotation.z=PI/2;axleBolt.position.set(side*frontSpacing,0,wb);frontAssembly.add(axleBolt)}
frontAssembly.add(bx(.075,.13,.11,A,-frontSpacing-.04,.08,wb+.04));
rearAssembly.add(bx(.075,.13,.11,A,-.16,.08,-.02));
for(const t of [.72,.97]){const q=forkPoint(0,t);P.add(tb([-frontSpacing,q.y,q.z],[frontSpacing,q.y,q.z],.026,A));for(const side of [-1,1]){const bolt=new T.Mesh(new T.CylinderGeometry(.012,.012,.04,10),F);bolt.rotation.z=PI/2;bolt.position.set(side*frontSpacing,q.y+.02,q.z);P.add(bolt)}}
const batteryY=y0+.12,batteryZ=wb*.42;
const battery=new T.Mesh(new RoundedBoxGeometry(d.bw,d.bh,wb*.4,3,Math.min(.045,d.bh*.16)),M);battery.position.set(0,batteryY,batteryZ);P.add(battery);
const skid=new T.Mesh(new RoundedBoxGeometry(d.bw*1.12,.045,wb*.3,3,.018),PN);skid.position.set(0,batteryY-d.bh*.58,batteryZ);P.add(skid);
for(const side of [-1,1]){
const panel=new T.Mesh(new RoundedBoxGeometry(.03,d.bh*.58,wb*.23,2,.014),SM);panel.position.set(side*(d.bw*.5+.01),batteryY,batteryZ);P.add(panel);
for(let i=0;i<3;i++)P.add(bx(.012,.014,wb*.15,PN,side*(d.bw*.5+.027),batteryY-d.bh*.14+i*.055,batteryZ));
}
const motorR=d.wr*.38,mo=new T.Mesh(new T.CylinderGeometry(motorR,motorR,d.bw+.08,16),A);mo.rotation.z=PI/2;mo.position.set(0,y0-.08,wb*.3);P.add(mo);
for(let i=0;i<5;i++){const fin=new T.Mesh(new T.CylinderGeometry(motorR*.9,motorR*.9,.014,16),F);fin.rotation.z=PI/2;fin.position.set((i-2)*.045,y0-.08,wb*.3);P.add(fin)}
for(const side of [-1,1]){const cover=new T.Mesh(new T.CylinderGeometry(motorR*.66,motorR*.66,.025,16),F);cover.rotation.z=PI/2;cover.position.set(side*(d.bw*.5+.045),y0-.08,wb*.3);P.add(cover);const ring=new T.Mesh(new T.TorusGeometry(motorR*.46,.008,6,20),A);ring.rotation.y=PI/2;ring.position.x=side*(d.bw*.5+.06);ring.position.y=y0-.08;ring.position.z=wb*.3;P.add(ring)}
for(const side of [-1,1]){
P.add(tb([side*.12,pivotY,pivotZ],[side*.12,hy*.78,wb*.31],.024,F));
P.add(tb([side*.12,hy*.78,wb*.31],[side*.1,y0*.32,wb*.55],.022,M));
P.add(tb([side*.12,pivotY,pivotZ],[side*.1,y0*.32,wb*.55],.02,A));
}
P.add(tb([0,y0+.2,wb*.55],[0,hy,hz],.05,M));
P.add(tb([0,y0+.15,wb*.3],[0,sy,wb*.18],.04,M));
for(const side of [-1,1]){
rearAssembly.add(tb([side*.12,0,0],[side*.12,-pivotY,-pivotZ],.034,A));
rearAssembly.add(tb([side*.12,-pivotY*.52,-pivotZ*.52],[side*.12,-pivotY,-pivotZ],.022,F));
rearAssembly.add(bx(.06,.12,.1,SM,side*.12,-pivotY,-pivotZ));
const bolt=new T.Mesh(new T.CylinderGeometry(.018,.018,.08,12),F);bolt.rotation.z=PI/2;bolt.position.set(side*.145,-pivotY,-pivotZ);rearAssembly.add(bolt);
}
rearAssembly.add(tb([-.12,-pivotY*.52,-pivotZ*.52],[.12,-pivotY*.52,-pivotZ*.52],.027,F));
const pivotBolt=new T.Mesh(new T.CylinderGeometry(.025,.025,.3,14),F);pivotBolt.rotation.z=PI/2;pivotBolt.position.set(0,pivotY,pivotZ);P.add(pivotBolt);
const rearShock=new T.Group(),shockBody=new T.Mesh(new T.CylinderGeometry(.029,.033,.58,16),PN),shockRod=new T.Mesh(new T.CylinderGeometry(.013,.013,.42,12),F),rearCoil=makeHelix(10,.047,.007,F);
shockBody.position.y=-.04;shockRod.position.y=.23;rearShock.add(shockBody,shockRod,rearCoil);
for(const y of [-.47,.47]){const eye=new T.Mesh(new T.TorusGeometry(.035,.009,8,18),SM);eye.rotation.x=PI/2;eye.position.y=y;rearShock.add(eye);const bolt=new T.Mesh(new T.CylinderGeometry(.013,.013,.1,12),F);bolt.rotation.z=PI/2;bolt.position.y=y;rearShock.add(bolt)}
P.add(rearShock);
const rearPivot=new T.Vector3(0,pivotY,pivotZ),rearShockUpper=new T.Vector3(0,hy*.88,wb*.47),rearShockLower=new T.Vector3(0,-pivotY*.68,-pivotZ*.68);
for(const side of [-1,1]){P.add(tb([side*.055,rearShockUpper.y+.04,rearShockUpper.z+.02],[side*.055,rearShockUpper.y-.04,rearShockUpper.z-.02],.018,A));P.add(tb([side*.055,rearShockUpper.y,rearShockUpper.z],[side*.12,hy*.78,wb*.31],.022,F));rearAssembly.add(tb([side*.06,rearShockLower.y,rearShockLower.z],[side*.12,-pivotY*.52,-pivotZ*.52],.018,F))}
const upperShockBolt=new T.Mesh(new T.CylinderGeometry(.014,.014,.14,12),F);upperShockBolt.rotation.z=PI/2;upperShockBolt.position.copy(rearShockUpper);P.add(upperShockBolt);
const lowerShockBolt=new T.Mesh(new T.CylinderGeometry(.014,.014,.14,12),F);lowerShockBolt.rotation.z=PI/2;lowerShockBolt.position.copy(rearShockLower);rearAssembly.add(lowerShockBolt);
const motorSprocket=new T.Mesh(new T.TorusGeometry(.075,.009,6,24),F);motorSprocket.rotation.y=PI/2;motorSprocket.position.set(-d.bw*.5-.035,y0-.08,wb*.3);P.add(motorSprocket);
const rearSprocket=new T.Mesh(new T.TorusGeometry(.12,.009,6,28),F);rearSprocket.rotation.y=PI/2;rearSprocket.position.set(-.145,0,0);rearAssembly.add(rearSprocket);
for(const side of [-1,1]){P.add(tb([side*.17,y0-.02,wb*.3-.02],[side*.17,.055,.095],.007,F));P.add(tb([side*.17,y0-.14,wb*.3+.02],[side*.17,-.055,-.095],.007,F))}
const updateSuspension=(frontComp,rearComp)=>{
const frontMotion=forkAxis.clone().multiplyScalar(frontComp/forkAxis.y);frontAssembly.position.copy(frontMotion);
for(const coil of frontCoils){const low=forkPoint(coil.side,.22).add(frontMotion),high=forkPoint(coil.side,.94);alignAxial(coil.mesh,low,high)}
const angle=Math.asin(Math.max(-.5,Math.min(.8,rearComp/rearArmLength)));rearAssembly.rotation.x=angle;
const low=rearShockLower.clone().applyAxisAngle(new T.Vector3(1,0,0),angle).add(rearPivot);alignAxial(rearShock,rearShockUpper,low)
};
if(!standH){const seat=new T.Mesh(new RoundedBoxGeometry(.24,.1,d.sl,3,.035),SM);seat.position.set(0,sy,wb*.18);P.add(seat);
const seatTrim=new T.Mesh(new RoundedBoxGeometry(.25,.026,d.sl*.86,3,.012),A);seatTrim.position.set(0,sy+.055,wb*.18);P.add(seatTrim);}
P.add(tb([-.32,hby,hz-.08],[.32,hby,hz-.08],.025,F));P.add(tb([0,hy,hz],[0,hby,hz-.08],.03,F));
for(const side of [-1,1]){const grip=new T.Mesh(new T.CylinderGeometry(.04,.04,.16,10),rubber);grip.rotation.z=PI/2;grip.position.set(side*.34,hby,hz-.08);P.add(grip);
const peg=new T.Mesh(new T.CylinderGeometry(.035,.035,.18,10),rubber);peg.rotation.z=PI/2;peg.position.set(side*.18,y0+.04,wb*.22);P.add(peg)}
const hMat=new T.MeshBasicMaterial({map:hTex});const hScreen=new T.Mesh(new T.BoxGeometry(.2,.06,.12),hMat);hScreen.position.set(0,hby,hz-.02);P.add(hScreen);
P.add(bx(.32,.28,.07,SM,0,hy+.12,hz+.14),bx(.12,.12,.08,M,0,hy+.12,hz+.19),bx(.13,.035,.02,A,0,hy+.08,hz+.235));
const hl=new T.Mesh(new T.SphereGeometry(.07,10,8),new T.MeshBasicMaterial({color:0xffffee}));hl.position.set(0,hby-.06,hz+.08);P.add(hl);
const tl=new T.Mesh(new T.BoxGeometry(.1,.05,.04),new T.MeshBasicMaterial({color:0xff2222}));tl.position.set(0,d.wr*1.2+.02,-.4);P.add(tl);
const glow=new T.Group();glow.position.set(0,y0-.08,wb*.3);glow.visible=false;
glow.add(new T.Mesh(new T.SphereGeometry(.19,12,10),new T.MeshBasicMaterial({color:0xd8b4fe,transparent:true,opacity:.8,depthWrite:false})));
const glowRingM=new T.MeshBasicMaterial({color:0xa855f7,transparent:true,opacity:.7,depthWrite:false});
for(const gr of [.24,.3,.36]){const ring=new T.Mesh(new T.TorusGeometry(gr,.01,6,28),glowRingM);ring.rotation.y=PI/2;glow.add(ring)}
P.add(glow);
const Rd=new T.Group();P.add(Rd);
const hBase=standH?1.16:d.sy+.82,hTop=standH?1.38:d.sy+1.0;
Rd.add(bx(.3,.36,.3,HEM,0,hBase,wb*.45));
Rd.add(bx(.16,.12,.12,mat(0x12333f,{metalness:.85,roughness:.08}),0,hBase+.06,wb*.45+.11));
Rd.add(bx(.16,.16,.16,mat(0xf2f4e8,{metalness:.6,roughness:.35}),0,hBase+.18,wb*.45));
[-1,1].forEach(s=>{Rd.add(bx(.16,.16,.16,mat(0x20272a,{roughness:.5}),s*.13,hBase-.005,wb*.42))});
dressBike({P,d,frontAssembly,rearAssembly,fwSpin:fw.spin,rwSpin:rw.spin,frontSpacing,sy,M,A,F,SM,PN,rubber,SH,HEM});
updateSuspension(0,0);let beam=null;if(lit){beam=new T.SpotLight(0xfff1d6,0,45,.55,.6,1.4);beam.position.set(0,hby,hz+.12);beam.target.position.set(0,0,hz+14);P.add(beam,beam.target)}
g.traverse(o=>{if(o.isMesh)o.castShadow=true});
return{g,beam,P,rw:rw.spin,fw:fw.spin,rwMount:rw.mount,fwMount:fw.mount,rearAssembly,updateSuspension,rearShock,R:Rd,glow,wr:d.wr,wb,d};}
/* ---------- bike detailing ---------- */
const plateCache=new Map();
function numberPlateTex(i){
if(plateCache.has(i))return plateCache.get(i);
const c=document.createElement('canvas');c.width=512;c.height=384;const x=c.getContext('2d');
x.fillStyle='#0b0f14';x.fillRect(0,0,512,384);
x.fillStyle='#c0f56a';x.fillRect(40,32,432,28);
x.strokeStyle='rgba(232,237,242,.85)';x.lineWidth=16;x.strokeRect(24,24,464,336);
x.fillStyle='#e8edf2';x.font='bold 248px "Barlow Condensed",system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String((i%99)+1).padStart(2,'0'),256,216);
const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=aniso;plateCache.set(i,t);return t;
}
function dressBike(o){
const P=o.P,d=o.d,frontAssembly=o.frontAssembly,rearAssembly=o.rearAssembly,fwSpin=o.fwSpin,rwSpin=o.rwSpin,frontSpacing=o.frontSpacing;
const wb=d.wb,wr=d.wr,tw=d.tw,bw=d.bw,bh=d.bh,sl=d.sl,sy=o.sy,sc=d.kind==='scooter';
const y0=wr*.9,hy=sc?Math.max(wr*2+.18,0.98):wr*2+.18,hz=sc?Math.max(wb-.22,0.9):wb-.22,hby=hy+d.hb*.5+.06,pivotY=y0*.7,pivotZ=wb*.3,batteryY=y0+.12,batteryZ=wb*.42,axleY=-pivotY,axleZ=-pivotZ;
const idx=Math.max(0,BIKES.indexOf(d)),M=o.M,A=o.A,F=o.F,SM=o.SM,PN=o.PN,rubber=o.rubber,SH=o.SH;
const C=mat(0x0b0e12,{roughness:.4,metalness:.6}),CH=mat(0xe2e8ee,{roughness:.15,metalness:1}),LED=mat(0xeaf7ff,{emissive:0xbfefff,emissiveIntensity:2.6,roughness:.2,metalness:.1}),RED=mat(0x2a0509,{emissive:0xff1f3d,emissiveIntensity:1.7,roughness:.3,metalness:.1}),AMB=mat(0x1a1206,{emissive:0xffab2e,emissiveIntensity:1.5,roughness:.3}),ACC=mat(0x0a0a0a,{emissive:d.a,emissiveIntensity:1.6,roughness:.35,metalness:.2}),TINT=mat(0x16222c,{roughness:.05,metalness:.25,transparent:true,opacity:.38}),PLATE=mat(0xffffff,{map:numberPlateTex(idx),roughness:.5,metalness:.12});
const V=(x,y,z)=>new T.Vector3(x,y,z);
const m4=(x,y,z,rx=0,ry=0,rz=0,sx=1,syy=1,sz=1)=>{const u=new T.Object3D();u.position.set(x,y,z);u.rotation.set(rx,ry,rz);u.scale.set(sx,syy,sz);u.updateMatrix();return u.matrix.clone()};
const bags=new Map();
const add=(target,material,geo,mx)=>{let by=bags.get(target);if(!by)bags.set(target,by=new Map());let arr=by.get(material);if(!arr)by.set(material,arr=[]);const g=geo.clone();if(mx)g.applyMatrix4(mx);arr.push(g)};
const U=new T.CylinderGeometry(1,1,1,10,1,false),TRI=new T.CylinderGeometry(1,1,1,3,1,false);
const rod=(target,material,a,b,r)=>{const A2=V(a[0],a[1],a[2]),B2=V(b[0],b[1],b[2]),dir=B2.clone().sub(A2),len=dir.length();if(len<1e-5)return;const q=new T.Quaternion().setFromUnitVectors(V(0,1,0),dir.normalize());add(target,material,U,new T.Matrix4().compose(A2.clone().add(B2).multiplyScalar(.5),q,V(r,len,r)))};
const slab=(target,material,a,b,w,h)=>{const A2=V(a[0],a[1],a[2]),B2=V(b[0],b[1],b[2]),dir=B2.clone().sub(A2),len=dir.length();if(len<1e-5)return;const q=new T.Quaternion().setFromUnitVectors(V(0,1,0),dir.normalize());add(target,material,boxGeo,new T.Matrix4().compose(A2.clone().add(B2).multiplyScalar(.5),q,V(w,len,h)))};
const torus=(target,material,R,tube,x,y,z,rx=0,ry=0,arc=PI*2)=>add(target,material,new T.TorusGeometry(R,tube,6,26,arc),m4(x,y,z,rx,ry,0));
const tube=(target,material,pts,r)=>add(target,material,new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p=>V(p[0],p[1],p[2]))),20,r,5,false));
/* wheels: knobby tread, machined rims, hub hardware, reflectors */
for(const spin of [fwSpin,rwSpin]){
for(let i=0;i<26;i++){const a=i/26*PI*2,r=wr+.006;add(spin,rubber,boxGeo,m4(0,Math.sin(a)*r,Math.cos(a)*r,a+PI/2,0,0,tw*1.04,.03,.036))}
for(const side of [-1,1]){
 torus(spin,F,wr*.9,.011,side*tw*.47,0,0,0,PI/2);
 torus(spin,ACC,wr*.74,.012,side*tw*.31,0,0,0,PI/2);
 torus(spin,A,wr*.47,.006,side*tw*.35,0,0,0,PI/2);
 add(spin,AMB,boxGeo,m4(side*(tw*.5+.008),wr*.82,0,0,0,0,.008,.022,.05));
 for(let i=0;i<6;i++){const a=i/6*PI*2;add(spin,CH,U,m4(side*tw*.36,Math.sin(a)*wr*.17,Math.cos(a)*wr*.17,0,0,PI/2,.016,.03,.016))}
}
add(spin,CH,U,m4(tw*.52,wr*.5,0,0,0,PI/2,.008,.04,.008));
}
add(frontAssembly,CH,boxGeo,m4(tw*.56,wr*.44,wb-wr*.25,0,0,-.3,.045,.13,.07));
add(frontAssembly,ACC,boxGeo,m4(tw*.56,wr*.44,wb-wr*.25,0,0,-.3,.02,.05,.055));
add(rearAssembly,CH,boxGeo,m4(tw*.56,axleY+wr*.4,axleZ+wr*.18,0,0,.3,.045,.12,.066));
add(rearAssembly,ACC,boxGeo,m4(tw*.56,axleY+wr*.4,axleZ+wr*.18,0,0,.3,.02,.045,.05));
/* front end: clamps, guards, plate, lighting */
add(P,A,boxGeo,m4(0,hy,hz,0,0,0,.31,.05,.15));
add(P,A,boxGeo,m4(0,hy-.18,hz-.03,0,0,0,.27,.045,.13));
add(P,CH,U,m4(0,hy+.045,hz,0,0,0,.04,.04,.04));
for(const side of [-1,1]){
 add(P,SM,boxGeo,m4(side*(frontSpacing+.035),hy-.44,hz-.03,0,0,side*.05,.022,.3,.1));
 add(P,A,U,m4(side*frontSpacing,hy-.32,hz-.03,0,0,0,.037,.042,.037));
}
add(P,PLATE,boxGeo,m4(0,hy+.02,hz+.19,-.1,0,0,.21,.15,.016));
torus(P,CH,.095,.012,0,hby-.06,hz+.105);
add(P,LED,U,m4(0,hby-.06,hz+.108,PI/2,0,0,.07,.014,.07));
add(P,LED,boxGeo,m4(0,hby+.03,hz+.112,0,0,0,.19,.012,.02));
if(!sc)add(P,TINT,boxGeo,m4(0,hby+.2,hz+.05,-.45,0,0,.27,.17,.01));
/* cockpit */
for(const side of [-1,1]){
 rod(P,CH,[side*.3,hby+.02,hz-.07],[side*.41,hby+.19,hz+.01],.01);
 add(P,C,boxGeo,m4(side*.41,hby+.21,hz+.01,0,side*.4,0,.08,.055,.018));
 add(P,SM,boxGeo,m4(side*.41,hby+.21,hz+.022,0,side*.4,0,.062,.04,.008));
 add(P,CH,boxGeo,m4(side*.33,hby+.012,hz-.135,-.12,0,side*.1,.115,.012,.022));
 add(P,CH,U,m4(side*.43,hby,hz-.08,0,0,PI/2,.017,.045,.017));
 add(P,PN,boxGeo,m4(side*.25,hby+.03,hz-.09,0,0,0,.04,.03,.04));
}
add(P,CH,U,m4(.3,hby+.09,hz-.055,0,0,0,.024,.05,.024));
tube(P,PN,[[.3,hby-.01,hz-.1],[.22,hy+.18,hz+.02],[.08,hy-.22,hz+.08],[.03,wr*.62,hz+wr*.12]],.008);
tube(P,PN,[[-.3,hby-.01,hz-.1],[-.2,hy+.12,hz-.02],[-.13,hy-.26,hz+.01],[-.07,.14,hz+.04]],.006);
/* trellis frame, gussets, subframe */
for(const side of [-1,1]){
 const fx=side*(bw*.5+.038);
 rod(P,A,[fx,y0+.02,wb*.34],[fx,hy*.9,hz-.05],.01);
 rod(P,M,[fx,y0+.02,wb*.34],[fx,hy*.5,wb*.02],.008);
 rod(P,A,[fx,hy*.5,wb*.02],[fx,hy*.9,hz-.05],.008);
 rod(P,A,[fx,hy*.9,hz-.05],[fx,sy+.02,wb*.06],.009);
 rod(P,F,[fx,sy+.03,wb*.03],[fx,sy+.02,-.2],.009);
 add(P,M,TRI,m4(fx*.98,hy*.62,wb*.06,0,0,PI/2,.1,.014,.14));
 add(P,C,boxGeo,m4(fx,sy-.02,wb*.28,0,0,0,.018,.09,.1));
}
/* battery livery, vents, underglow */
for(const side of [-1,1]){
 for(let i=0;i<3;i++)add(P,ACC,boxGeo,m4(side*(bw*.5+.02),batteryY+bh*.18-i*.07,batteryZ-.02+i*.035,.6,0,0,.012,.02,.13));
 add(P,C,boxGeo,m4(side*(bw*.5+.012),batteryY-bh*.28,batteryZ,0,0,0,.018,.06,wb*.36));
 add(P,A,boxGeo,m4(side*(bw*.5+.03),batteryY+bh*.42,batteryZ,0,0,0,.02,.05,wb*.3));
 for(let i=0;i<4;i++)add(P,PN,boxGeo,m4(side*(bw*.5+.022),batteryY+bh*.06,batteryZ-.09+i*.06,0,0,side*.12,.01,.035,.025));
}
add(P,ACC,boxGeo,m4(0,batteryY-bh*.6,wb*.4,0,0,0,bw*.7,.012,wb*.34));
add(P,CH,boxGeo,m4(0,batteryY+bh*.5,batteryZ,0,0,0,.05,.018,.1));
/* motor */
for(const side of [-1,1])torus(P,ACC,wr*.44,.01,side*(bw*.5+.075),y0-.08,wb*.3,0,PI/2);
/* drivetrain */
slab(P,C,[-bw*.5-.05,y0-.02,wb*.31],[-.16,wr*.22,-.1],.026,.055);
for(let i=0;i<16;i++){const t=i/15,px=-bw*.5-.05+(-.16+bw*.5+.05)*t,py=y0-.02+(wr*.22-y0+.02)*t,pz=wb*.31+(-.1-wb*.31)*t;add(P,PN,boxGeo,m4(px,py,pz,0,0,0,.03,.022,.032))}
slab(rearAssembly,C,[-bw*.5,axleY*.5,axleZ*.5],[-bw*.5,axleY*.95,axleZ*.95],.02,.09);
for(const side of [-1,1]){
 add(rearAssembly,CH,boxGeo,m4(side*(bw*.5+.01),axleY,axleZ+.02,0,0,0,.028,.11,.06));
 rod(rearAssembly,PN,[side*(bw*.5+.03),axleY,axleZ],[side*(bw*.5+.1),axleY,axleZ],.02);
 rod(rearAssembly,PN,[side*.13,axleY*.55,axleZ*.55],[side*.13,axleY*.95,axleZ*.95],.008);
}
/* seat, tail, plate */
if(!sc){
for(let i=0;i<7;i++)add(P,PN,boxGeo,m4(0,sy+.052,wb*.18-sl*.36+i*(sl*.72/6),0,0,0,.2,.004,.007));
add(P,C,boxGeo,m4(0,sy+.02,-.06,0,0,0,.2,.11,.24));
add(P,A,boxGeo,m4(0,sy+.082,-.05,0,0,0,.21,.018,.25));
add(P,RED,boxGeo,m4(0,sy+.02,-.185,0,0,0,.13,.03,.018));
add(P,PLATE,boxGeo,m4(0,sy+.05,-.36,0,PI,0,.2,.15,.014));
rod(P,F,[0,sy+.02,-.2],[0,sy+.05,-.34],.012);
for(const side of [-1,1])rod(P,F,[side*.1,sy+.1,-.05],[side*.08,sy+.11,-.22],.011);
}
/* stance details */
for(const side of [-1,1])add(P,SM,boxGeo,m4(side*(bw*.5+.03),y0+.08,wb*.14,0,side*.1,0,.016,.08,.12));
rod(P,CH,[-(bw*.5+.03),y0-.02,wb*.22],[-.34,-wr*.9,wb*.06],.013);
add(P,PN,boxGeo,m4(-.34,-wr*.92,wb*.05,0,.35,0,.1,.02,.05));
if(d.pr>=30000){add(P,C,boxGeo,m4(0,sy+.18,-.16,0,0,0,.32,.016,.08));for(const side of [-1,1])rod(P,C,[side*.13,sy+.06,-.12],[side*.13,sy+.17,-.16],.009)}
/* scooter deck and accessories */
if(sc){
 const deckY=y0-bh*.1;
 add(P,C,boxGeo,m4(0,deckY,wb*.55,0,0,0,bw*1.04,.03,wb*.5));
 for(let i=0;i<8;i++)add(P,PN,boxGeo,m4(0,deckY+.02,wb*.35+i*.045,0,0,0,bw*.86,.01,.018));
 add(P,A,boxGeo,m4(0,deckY-.01,wb*.58,0,0,0,bw*1.1,.016,.06));
 add(P,LED,boxGeo,m4(0,hy*.55,hz+.03,0,0,0,.16,.02,.02));
 add(P,A,U,m4(0,hy*.72,hz-.02,0,0,0,.045,.05,.045));
 add(P,RED,boxGeo,m4(0,sy-.05,-.1,0,0,0,.09,.02,.014));
}
/* ---------- seated rider: torso, arms on the bars, legs on the pegs ---------- */
const SKIN=mat(0xb77b55,{roughness:.85,metalness:0});
const rHeadY=sc?1.16:d.sy+.82,rShY=rHeadY-.24,rShZ=wb*.4,rHipY=sc?Math.max(y0+.36,rHeadY-.72):sy+.06,rHipZ=wb*.1;
add(P,PN,boxGeo,m4(0,rHipY,rHipZ,0,0,0,.3,.2,.27));
slab(P,SH,[0,rHipY+.04,rHipZ+.01],[0,rShY,rShZ],.34,.23);
slab(P,ACC,[0,rHipY+.05,rHipZ+.11],[0,rShY-.03,rShZ+.04],.075,.24);
add(P,SKIN,boxGeo,m4(0,rShY+.03,rShZ+.03,0,0,0,.14,.15,.14));
for(const s of [-1,1]){
const sh=[s*.17,rShY,rShZ],el=[s*.29,rShY-.12,rShZ+.2],hand=[s*.34,hby,hz-.08],knee=[s*.19,rHipY-.24,wb*.44],ankle=[s*.19,y0+.15,wb*.2];
add(P,SH,boxGeo,m4(sh[0],sh[1],sh[2],0,0,0,.18,.16,.21));
slab(P,SH,sh,el,.12,.14);
slab(P,SH,el,[hand[0],hand[1]+.02,hand[2]],.1,.115);
add(P,C,boxGeo,m4(hand[0],hand[1],hand[2]-.01,0,0,0,.095,.105,.14));
slab(P,PN,[s*.1,rHipY,rHipZ+.02],knee,.17,.19);
slab(P,PN,knee,ankle,.14,.16);
add(P,C,boxGeo,m4(ankle[0],ankle[1]-.05,ankle[2]+.05,0,0,0,.12,.1,.27));
}
for(const [target,byMat] of bags){for(const [material,geos] of byMat){const merged=mergeGeometries(geos);geos.forEach(g=>g.dispose());if(!merged)continue;const mesh=new T.Mesh(merged,material);mesh.castShadow=true;mesh.receiveShadow=true;target.add(mesh)}}
}
function tag(txt,col,sub,subCol){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.textAlign='center';x.fillStyle='rgba(0,0,0,.5)';x.fillRect(0,16,512,96);x.fillStyle=col;x.font=`bold ${sub?44:60}px system-ui`;x.fillText(txt,256,sub?66:86);if(sub){x.fillStyle=subCol||'#cbd5e1';x.font='bold 28px system-ui';x.fillText(sub,256,100)}const tx=new T.CanvasTexture(c);tx.anisotropy=aniso;const s=new T.Sprite(new T.SpriteMaterial({map:tx,depthTest:false}));s.scale.set(3,.75,1);s.position.y=2.4;s.renderOrder=9;return s}
function pose(r,X,Y,Z,H,Ro,Pt,V,dt,frontCompression=0,rearCompression=0,trickRoll=0){frontCompression=Number.isFinite(frontCompression)?Math.max(-.06,Math.min(.36,frontCompression)):0;rearCompression=Number.isFinite(rearCompression)?Math.max(-.06,Math.min(.32,rearCompression)):0;r.g.position.set(X,Y+r.wr,Z);r.g.rotation.set(0,H,Ro);const bodyCompression=(frontCompression+rearCompression)*.5,suspensionPitch=Math.atan2(frontCompression-rearCompression,r.wb)*.22,pitch=-Pt+suspensionPitch,endo=Math.max(0,Math.min(1.05,pitch)),endLift=Math.sin(endo)*r.wb,endSlide=r.wb*(1-Math.cos(endo));/* the body group pivots on the rear axle, so a nose-down stoppie needs a lift + slide to keep the front tyre on the road and raise the rear wheel instead of burying the front. */r.P.rotation.set(pitch,0,trickRoll);r.P.position.set(0,-bodyCompression+endLift,endSlide);r.updateSuspension(frontCompression,rearCompression);
const s=V*dt/r.wr;r.rw.rotation.x+=s;r.fw.rotation.x+=s}
function buildWalker(color){
const g=new T.Group(),skin=mat(0xb77b55,{roughness:.85,metalness:0}),shirt=mat(color,{roughness:.7,metalness:0}),pants=mat(0x252a32,{roughness:.9,metalness:0}),helmet=mat(0x20272a,{roughness:.32,metalness:.5}),visor=mat(0x6da4b1,{roughness:.18,metalness:.65});
g.add(bx(.52,.67,.3,shirt,0,1.18,0),bx(.46,.13,.32,pants,0,.81,0));
const head=new T.Mesh(new T.SphereGeometry(.17,16,12),skin);head.position.set(0,1.72,0);g.add(head);
const lid=new T.Mesh(new T.SphereGeometry(.19,16,12),helmet);lid.scale.set(.85,1.25,.85);lid.position.set(0,1.8,0);g.add(lid);
const visorM=new T.Mesh(new T.SphereGeometry(.09,10,8),visor);visorM.scale.set(1.2,.35,1);visorM.position.set(0,1.86,0);g.add(visorM);
g.add(bx(.36,.2,.36,helmet,0,1.79,0));
g.add(bx(.24,.12,.1,visor,0,1.82,.14));
const limb=(length,w,d,m,x,y)=>{const pivot=new T.Group();pivot.position.set(x,y,0);const part=bx(w,length,d,m,0,-length/2,0);pivot.add(part);g.add(pivot);return pivot};
const arms=[limb(.62,.18,.18,shirt,-.34,1.43),limb(.62,.18,.18,shirt,.34,1.43)];
const legs=[limb(.72,.2,.2,pants,-.14,.78),limb(.72,.2,.2,pants,.14,.78)];
for(const side of [-1,1])g.add(bx(.16,.12,.28,helmet,side*.14,.12,.05));
return{g,arms,legs};
}
/* Jetskis and boats docked at the port when hosting a rideout. */
const portCraft=[];
const craftHull=mat(0x14324a,{roughness:.6,metalness:.5}),craftMast=mat(0x1e2836,{roughness:.7,metalness:.4}),craftSail=new T.MeshBasicMaterial({color:0xe8f2ff});
const buildBoat=()=>{const g=new T.Group();const hull=new T.Mesh(new T.RoundedBoxGeometry(2.6,.16,6.5,2,.07),craftHull);hull.position.y=.13;g.add(hull);const mast=new T.Mesh(new T.CylinderGeometry(.05,.05,7,6),craftMast);mast.position.y=3.6;g.add(mast);const sail=new T.Mesh(new T.PlaneGeometry(1.7,.95,1,1),craftSail);sail.position.set(0,5.4,2.2);sail.rotation.z=-.35;g.add(sail);const cab=new T.Mesh(new T.RoundedBoxGeometry(1.7,.9,2.6,2,.06),craftMast);cab.position.set(0,1.5,0);g.add(cab);return g};
const buildJet=()=>{const g=new T.Group();const fl=new T.Mesh(new T.RoundedBoxGeometry(.85,.07,2,2,.03),craftHull);fl.position.set(-1.15,.07,0);const fr=new T.Mesh(new T.RoundedBoxGeometry(.85,.07,2,2,.03),craftHull);fr.position.set(1.15,.07,0);g.add(fl,fr);const seat=new T.Mesh(new T.RoundedBoxGeometry(.55,.09,1.3,2,.03),craftMast);seat.position.set(0,.27,0);g.add(seat);const post=new T.Mesh(new T.CylinderGeometry(.028,.028,.55,8),craftMast);post.position.set(0,.5,0);post.rotation.z=PI/2;g.add(post);const glow=new T.Mesh(new T.SphereGeometry(.12,8,6),new T.MeshBasicMaterial({color:0x66ddff,transparent:true,opacity:.8,depthWrite:false}));glow.position.set(0,.3,0);g.add(glow);return g};
const addPortCraft=(build,spot,vel)=>{const g=build();g.position.set(spot.x,0.18,spot.z);g.userData={vel,phase:Math.random()*6};portCraft.push(g);scene.add(g);return g};
/* ---------- world ---------- */
const S_=90,chunks=new Map(),rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const roadHill=z=>0.9*Math.sin(z*0.011)+0.45*Math.sin(z*0.027+2);
const roadBump=z=>roadHill(z)+.003+.025*Math.pow(Math.max(0,Math.cos(z*.48)),8)+.001*Math.sin(z*1.63);
const roadSlope=z=>0.0099*Math.cos(z*0.011)+0.01215*Math.cos(z*0.027+2)+(Math.cos(z*.48)>0?-.096*Math.pow(Math.cos(z*.48),7)*Math.sin(z*.48):0)+.00163*Math.cos(z*1.63);
const trailX=z=>22+2*Math.sin(z*.021)+1.2*Math.sin(z*.071),onTrail=(x,z)=>Math.abs(Math.abs(x)-trailX(z))<3.6;
const roadFade=x=>Math.pow(Math.max(0,1-(x/12)**2),2);
const makeRoadGeo=oz=>{const geo=new T.PlaneGeometry(24,S_,12,180).rotateX(-PI/2).translate(0,-0.006,0),position=geo.attributes.position;for(let i=0;i<position.count;i++){const x=position.getX(i),z=oz+position.getZ(i);position.setY(i,roadBump(z)*roadFade(x));position.setX(i,x+Math.sin(z*.0105)*9+Math.sin(z*.029+1.9)*4)}geo.computeVertexNormals();return geo};
const gGeo=new T.PlaneGeometry(S_,S_).rotateX(-PI/2).translate(0,-0.006,0),bGeo=new T.BoxGeometry(1,1,1).translate(0,.5,0);
const groundTex=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#d8d8d8';x.fillRect(0,0,256,256);for(let i=0;i<2600;i++){const s=170+Math.random()*80|0;x.fillStyle='rgba('+s+','+s+','+s+',.35)';x.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*5,1+Math.random()*5)}const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(24,24);tx.anisotropy=aniso;return tx})();
const dirtTex=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#7a5a3c';x.fillRect(0,0,256,256);for(let i=0;i<4000;i++){const s=110+Math.random()*60;x.fillStyle='rgba('+s+','+(s-30)+','+(s-60)+',.4)';x.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*4,1+Math.random()*4)}for(let i=0;i<800;i++){x.fillStyle='rgba(40,25,10,.25)';x.fillRect(Math.random()*256,Math.random()*256,2+Math.random()*6,2+Math.random()*6)}const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(16,16);tx.anisotropy=aniso;return tx})();
const GM=[0x5a5e66,0x5f9e4b,0xcaa56b,0x8f949c].map(c=>mat(c,{roughness:1,metalness:0,map:groundTex}));
const dirtM=mat(0x8d6e4a,{roughness:1,metalness:0,map:dirtTex});
const rt=(()=>{const c=document.createElement('canvas');c.width=512;c.height=2048;const x=c.getContext('2d');x.fillStyle='#34373d';x.fillRect(0,0,512,2048);for(let i=0;i<36000;i++){const shade=30+Math.random()*30;x.fillStyle=`rgba(${shade},${shade},${shade+2},.16)`;x.fillRect(Math.random()*512,Math.random()*2048,2+Math.random()*6,2+Math.random()*4)}for(let i=0;i<9000;i++){const shade=40+Math.random()*22;x.fillStyle=`rgba(${shade},${shade},${shade+1},.10)`;x.fillRect(Math.random()*512,Math.random()*2048,1+Math.random()*3,1+Math.random()*3)}x.fillStyle='#e7e8e8';x.fillRect(20,0,8,2048);x.fillRect(484,0,8,2048);x.fillStyle='#f2bd35';x.fillRect(248,0,8,2048);x.fillRect(268,0,8,2048);x.fillStyle='#e7e8e8';for(let i=0;i<10;i++){const y=i*204.8+60;x.fillRect(136,y,8,72);x.fillRect(368,y,8,72)}const t=new T.CanvasTexture(c);t.anisotropy=aniso;return t})();
const roadM=mat(0xffffff,{map:rt,roughness:.9,metalness:0}),swM=mat(0x9a9a9a,{roughness:1,metalness:0}),seamM=mat(0x65696d,{roughness:1,metalness:0}),roadStudM=mat(0xe4e9e9,{emissive:0x111111,emissiveIntensity:.2,roughness:.3,metalness:.2}),poleM=mat(0x444444,{roughness:.6,metalness:.55}),lampM=mat(0xffd27a,{emissive:0xff9a35,emissiveIntensity:0,roughness:.2,metalness:.1}),streetGlowM=new T.MeshBasicMaterial({color:0xffb95e,transparent:true,opacity:0,depthWrite:false}),lensM=new T.MeshStandardMaterial({color:0xfff0cf,emissive:0xffb35e,emissiveIntensity:.8,roughness:.15,metalness:.1});
/* Speed-limit cameras: the sign texture and materials are shared by every camera prop. */
const bldTex=(()=>{const N=8,W=64,c=document.createElement('canvas'),e=document.createElement('canvas');c.width=c.height=e.width=e.height=N*W;const x=c.getContext('2d'),y=e.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,N*W,N*W);y.fillStyle='#000';y.fillRect(0,0,N*W,N*W);
for(let i=0;i<N;i++)for(let j=0;j<N;j++){const g=x.createLinearGradient(0,j*W,0,j*W+W);g.addColorStop(0,'#5e8aa6');g.addColorStop(1,'#243b4d');x.fillStyle=g;x.fillRect(i*W+14,j*W+12,W-28,W-24);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(i*W+10,j*W+W-12,W-20,4);if(Math.random()<.35){y.fillStyle=Math.random()<.5?'#ffd48a':'#cfe8ff';y.fillRect(i*W+14,j*W+12,W-28,W-24)}}
const mk=cv=>{const tx=new T.CanvasTexture(cv);tx.colorSpace=T.SRGBColorSpace;tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.anisotropy=aniso;return tx};return{map:mk(c),em:mk(e)}})();
const bldGeo=(w,h,d)=>{const g=new T.BoxGeometry(w,h,d).translate(0,h/2,0),uv=g.attributes.uv;for(let f=0;f<6;f++){const fw=f<2?d:w;for(let i=0;i<4;i++){const k=f*4+i;if(f===2||f===3)uv.setXY(k,.002,.002);else uv.setXY(k,uv.getX(k)*fw/24,uv.getY(k)*h/28)}}return g};
const BM=[0x8a94a6,0x6b7a90,0xa7b0c0,0x4b5563,0x9aa5b8].map(c=>mat(c,{roughness:.7,metalness:0,map:bldTex.map,emissiveMap:bldTex.em,emissive:0xffffff,emissiveIntensity:0})),HM=[0xf2e2c7,0xe8b4a0,0xb9d3e8,0xd9e8b9].map(c=>mat(c,{roughness:.9,metalness:0})),windowM=mat(0x83cfe0,{emissive:0x16465a,emissiveIntensity:.2,roughness:.18,metalness:.2}),doorM=mat(0x6b3f2a,{roughness:.75}),trimM=mat(0xf1dfbd,{roughness:.7,metalness:0});
const roofM=mat(0x7a3b2e,{roughness:.9}),trM=mat(0x5b3a1e,{roughness:1,metalness:0}),lfM=mat(0x2f7d32,{roughness:1,metalness:0}),rkM=mat(0x8b7355,{roughness:1}),cacM=mat(0x3f8f3f,{roughness:1});
const trGeo=new T.CylinderGeometry(.25,.3,2,6),cnGeo=new T.ConeGeometry(1.6,4,7),pGeo=new T.CylinderGeometry(.1,.1,7,10),lampGlowGeo=new T.SphereGeometry(.65,10,8),rkGeo=new T.DodecahedronGeometry(1),cacGeo=new T.CylinderGeometry(.35,.35,3,8),hrGeo=new T.ConeGeometry(5.6,2.5,4).rotateY(PI/4);
const pedGeo=new T.BoxGeometry(.35,.7,.35),pedSkinM=mat(0xb77b55,{roughness:.85,metalness:0}),pedShirtM=mat(0x4a5568,{roughness:.8,metalness:0}),pedPantsM=mat(0x252a32,{roughness:.9,metalness:0});
const padGeo=(()=>{const N=12,pos=[],uv=[],idx=[];for(let i=0;i<=N;i++){const t=i/N,z=-4+8*t,y=.02+.9*t*t;pos.push(-2,y,z,2,y,z);uv.push(0,t*2,1,t*2);if(i<N){const a=i*2;idx.push(a,a+2,a+1,a+1,a+2,a+3)}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g})(),padM=new T.MeshStandardMaterial({color:0x66ddff,emissive:0x0b7aa5,emissiveIntensity:.7,roughness:.35,metalness:.2,side:T.DoubleSide});
const RM=[0xd97706,0x9a7b4f,0x9ca3af,0xb45309].map(c=>mat(c,{roughness:.8}));
function mkChunk(cx,cz){
const r=rng((cx*73856093)^(cz*19349663)),g=new T.Group(),c={g,id:[cx,cz],ramps:[],cols:[],pads:[],lights:[],peds:[],dis:[],bld:[],trees:[]},ox=cx*S_,oz=cz*S_;g.position.set(ox,0,oz);
const hw=cx===0,b=hw?r()*3|0:r()*4|0;
const gm=new T.Mesh(gGeo,hw?GM[0]:b===3?dirtM:GM[b]);gm.receiveShadow=true;g.add(gm);
const bk=new Map(),add=(m,x,y,z,cs,dyn)=>{m.position.set(x,y,z);if(dyn||m.geometry.type==='ExtrudeGeometry'){m.castShadow=!!cs;m.receiveShadow=true;g.add(m);return m}m.updateMatrix();const q=m.geometry.clone().applyMatrix4(m.matrix);const a=bk.get(m.material)||bk.set(m.material,[]).get(m.material);a.push(q);return m};
const rp=ex=>{for(let i=0;i<Math.round(25*GFX[GFXP].parts);i++){const x=(r()-.5)*84,z=(r()-.5)*84;if(!hw||Math.abs(x)>ex)return[x,z]}return[40,40]};
const ramp=(x,z,ry,L,w,H,mi)=>{const sh=new T.Shape();sh.moveTo(0,0);sh.lineTo(L,0);sh.lineTo(L,H);sh.closePath();const geo=new T.ExtrudeGeometry(sh,{depth:w,bevelEnabled:false}).translate(-L/2,0,-w/2);c.dis.push(geo);const m=add(new T.Mesh(geo,RM[mi]),x,0,z,1);m.rotation.y=ry;c.ramps.push({x:ox+x,z:oz+z,L,w,H,co:Math.cos(ry),si:Math.sin(ry)})};
const col=(x,z,w,d,h=Infinity)=>c.cols.push({x:ox+x,z:oz+z,hw:w/2+.4,hd:d/2+.4,h});
const tree=(x,z)=>{add(new T.Mesh(trGeo,trM),x,1,z);add(new T.Mesh(cnGeo,lfM),x,3.6,z,1);const top=new T.Mesh(cnGeo,lfM);top.scale.set(.7,.7,.7);add(top,x,5.3,z,1)};
if(hw){const roadGeo=makeRoadGeo(oz);add(new T.Mesh(roadGeo,roadM),0,0,0);roadGeo.dispose();
[-13.5,13.5].forEach(x=>{const m=new T.Mesh(bGeo,swM);m.scale.set(3,.2,S_);add(m,x,0,0);});
[-30,0,30].forEach(z=>[-14.5,14.5].forEach(sx=>{
const base=new T.Mesh(new T.CylinderGeometry(.18,.24,.3,10),poleM);add(base,sx,.15,z,1);
const flare=new T.Mesh(new T.CylinderGeometry(.3,.38,.5,10),poleM);add(flare,sx,.42,z,1);
add(new T.Mesh(new T.CylinderGeometry(.12,.16,.9,8),poleM),sx,4.4,z,1);
add(new T.Mesh(pGeo,poleM),sx,3.55,z,1);
g.add(tb([sx,6.55,z],[sx*.9,6.88,z],.045,poleM));
g.add(tb([sx*.9,6.5,z],[sx*.9,6.95,z],.035,poleM));
add(new T.Mesh(new T.BoxGeometry(.64,.13,.32),poleM),sx*.9,6.93,z,1);
add(new T.Mesh(new T.SphereGeometry(.16,10,8),lampM),sx*.9,6.84,z,1);
add(new T.Mesh(new T.SphereGeometry(.09,8,6),lensM),sx*.9,6.87,z,1);
const halo=new T.Mesh(lampGlowGeo,streetGlowM);add(halo,sx*.9,6.84,z,0,1);
const light=new T.PointLight(0xffc777,0,30,2);light.position.set(sx*.9,6.9,z);g.add(light);c.lights.push(light)
col(sx,z,.5,.5,7.5);
if(z===0&&Math.abs(sx)>10){const ped=buildWalker();ped.g.position.set(sx*.9,.2,z);ped.g.visible=true;scene.add(ped.g);c.peds.push({g:ped.g,arms:ped.arms,legs:ped.legs,x:sx*.9,y:.14,z:oz+z,home:oz+z,phase:r()*6.28,dir:r()<.5?1:-1,speed:.55+r()*.5})}}));
for(let z=-39;z<=39;z+=6){for(const sx of [-10.8,10.8])add(bx(.12,.025,.2,roadStudM,sx,roadBump(z)*roadFade(sx)+.012,z),sx,roadBump(z)*roadFade(sx)+.012,z)}
/* dirt trails running beside the highway */
for(const side of [-1,1]){const N=16,pos=[],uv=[],idx=[];for(let i=0;i<=N;i++){const lz=-45+i*(S_/N),cx=trailX(oz+lz)*side;pos.push(cx-3.2,.02,lz,cx+3.2,.02,lz);uv.push(0,i/N*5,1,i/N*5);if(i<N){const a=i*2;idx.push(a,a+2,a+1,a+1,a+2,a+3)}}const tg=new T.BufferGeometry();tg.setAttribute('position',new T.Float32BufferAttribute(pos,3));tg.setAttribute('uv',new T.Float32BufferAttribute(uv,2));tg.setIndex(idx);tg.computeVertexNormals();const tm=new T.Mesh(tg,dirtM);tm.receiveShadow=true;g.add(tm);c.dis.push(tg)}
}
for(let i=0;i<Math.round(9*GFX[GFXP].parts);i++){const[x,z]=rp(27),w=8+r()*8,d=8+r()*8,h=10+r()*38;if(Math.abs(Math.abs(x)-trailX(oz+z))<w/2+4.5||Math.abs(x)<13.5)continue;const m=new T.Mesh(bldGeo(w,h,d),BM[r()*5|0]);add(m,x,0,z,1);col(x,z,w,d);c.bld.push({x,z,w,d})}
if(b===2){for(let i=0;i<Math.round(8*GFX[GFXP].parts);i++){const[x,z]=rp(17);if(onTrail(x,oz+z))continue;const m=new T.Mesh(rkGeo,rkM),s=.8+r()*2;m.scale.set(s,s*.7,s);add(m,x,s*.3,z,1)}
for(let i=0;i<Math.round(6*GFX[GFXP].parts);i++){const[x,z]=rp(17);if(onTrail(x,oz+z))continue;add(new T.Mesh(cacGeo,cacM),x,1.5,z,1)}}
if(b===3){for(let i=0;i<Math.round(3*GFX[GFXP].parts);i++){const[x,z]=rp(22);if(onTrail(x,oz+z))continue;add(new T.Mesh(rkGeo,rkM),x,.7,z,1)}}
if(b===1)for(let i=0;i<Math.round(7*GFX[GFXP].parts);i++){const[x,z]=rp(17);if(onTrail(x,oz+z))continue;tree(x,z);c.trees.push({x,z})}
bk.forEach((a,m)=>{const mg=mergeGeometries(a);a.forEach(q=>q.dispose());c.dis.push(mg);const o=new T.Mesh(mg,m);o.castShadow=m!==roadM&&m!==GM[b]&&m!==swM;o.receiveShadow=true;g.add(o)});
return c}
function gH(x,z){const fade=roadFade(x),sw=Math.abs(x)>12&&Math.abs(x)<15.05?.2:0;let h=roadBump(z)*fade;const a=Math.round(x/S_),b=Math.round(z/S_);gH.sl=roadSlope(z)*fade;gH.e=[0,1];
for(let i=-1;i<2;i++)for(let j=-1;j<2;j++){const c=chunks.get((a+i)+','+(b+j));if(!c)continue;for(const q of c.ramps){const dx=x-q.x,dz=z-q.z,u=dx*q.co-dz*q.si,l=dx*q.si+dz*q.co;if(Math.abs(u)<q.L/2&&Math.abs(l)<q.w/2){const hh=(u+q.L/2)/q.L*q.H;if(hh>h){h=hh;gH.sl=q.H/q.L;gH.e=[q.co,-q.si]}}}}return Math.max(h,sw)}
function nbr(x,z,f){const a=Math.round(x/S_),b=Math.round(z/S_);for(let i=-1;i<2;i++)for(let j=-1;j<2;j++){const c=chunks.get((a+i)+','+(b+j));if(c)f(c)}}
function loadChunks(x,z){const a=Math.round(x/S_),b=Math.round(z/S_);const lim=GFX[GFXP].chunks;
for(let i=-lim;i<=lim;i++)for(let j=-lim;j<=lim;j++){const k=(a+i)+','+(b+j);if(!chunks.has(k)){const c=mkChunk(a+i,b+j);chunks.set(k,c);scene.add(c.g)}}
for(const[k,c]of chunks)if(Math.abs(c.id[0]-a)>lim||Math.abs(c.id[1]-b)>lim){scene.remove(c.g);for(const p of c.peds)scene.remove(p.g);c.dis.forEach(q=>q.dispose());chunks.delete(k)}}
/* ---------- particles ---------- */
let NP=260,pp=new Float32Array(4096*3),pc=new Float32Array(4096*3),pq=Array.from({length:4096},()=>({l:0,v:[0,0,0],g:0})),pg=new T.BufferGeometry();
for(let i=0;i<4096;i++){pp[i*3+1]=-999;pq[i]={l:0,v:[0,0,0],g:0}}
pg.setAttribute('position',new T.BufferAttribute(pp,3));pg.setAttribute('color',new T.BufferAttribute(pc,3));
const pts=new T.Points(pg,new T.PointsMaterial({size:.25,vertexColors:true,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));pts.frustumCulled=false;scene.add(pts);
const hCanvas=document.createElement('canvas');hCanvas.width=512;hCanvas.height=128;const hCtx=hCanvas.getContext('2d');const hTex=new T.CanvasTexture(hCanvas);hTex.colorSpace=T.SRGBColorSpace;hTex.anisotropy=aniso;const hMat=new T.MeshBasicMaterial({map:hTex});
let pi=0;const emit=(p3,vx,vy,vz,l,r,g,b,gr)=>{const i=pi++%NP,q=pq[i];pp.set([p3.x,p3.y,p3.z],i*3);pc.set([r,g,b],i*3);q.l=l;q.v=[vx,vy,vz];q.g=gr};
const stepP=dt=>{for(let i=0;i<NP;i++){const q=pq[i];if(q.l>0){q.l-=dt;q.v[1]-=q.g*dt;pp[i*3]+=q.v[0]*dt;pp[i*3+1]+=q.v[1]*dt;pp[i*3+2]+=q.v[2]*dt;if(q.l<=0)pp[i*3+1]=-999}}pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true};
const applyGraphics=(p)=>{const g=GFX[p]||GFX.high;GFXP=p;R.setPixelRatio(g.dpr);if(composer)composer.setPixelRatio(R.getPixelRatio());R.antialias=g.antialias;R.shadowMap.enabled=g.shadow;R.shadowMap.type=T.PCFSoftShadowMap;sun.castShadow=g.shadow;sun.shadow.mapSize.set(g.shadowSize,g.shadowSize);R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();NP=Math.round(260*g.particles);if(composer){composer.dispose();composer=null}if(g.post){const rt=new T.WebGLRenderTarget(innerWidth,innerHeight,{type:T.HalfFloatType,samples:g.msaa||0});const c=new EffectComposer(R,rt);c.setPixelRatio(R.getPixelRatio());c.setSize(innerWidth,innerHeight);c.addPass(new RenderPass(scene,cam));if(g.bloom)c.addPass(new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),.32,.55,.9));c.addPass(new OutputPass());composer=c}};
try{applyGraphics(GFXP);}catch(e){console.error('applyGraphics failed:',e)}
/* ---------- audio ---------- */
let AC,mg,mo1,mo2,mgn,sir,sg,ng={},muted=false;
function ainit(){if(AC){AC.resume();return}try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return}
try{mg=AC.createGain();mg.gain.value=muted?0:.5;mg.connect(AC.destination);
mo1=AC.createOscillator();mo1.type='sawtooth';mo2=AC.createOscillator();mo2.type='sine';const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=1600;mgn=AC.createGain();mgn.gain.value=0;
mo1.connect(f);mo2.connect(f);f.connect(mgn);mgn.connect(mg);mo1.start();mo2.start();
const nb=AC.createBuffer(1,AC.sampleRate,AC.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
const ns=(t,fr,q)=>{const s=AC.createBufferSource();s.buffer=nb;s.loop=true;const fl=AC.createBiquadFilter();fl.type=t;fl.frequency.value=fr;fl.Q.value=q;const g=AC.createGain();g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(mg);s.start();return g};
ng.scr=ns('bandpass',1700,3);ng.spk=ns('highpass',5000,1);ng.bst=ns('bandpass',600,.6);sir=AC.createOscillator();sir.type='triangle';sg=AC.createGain();sg.gain.value=0;sir.connect(sg);sg.connect(mg);sir.start()}catch(e){console.error('audio init failed:',e)}}
addEventListener('pointerdown',ainit);addEventListener('keydown',ainit);
$('bm').onclick=()=>{muted=!muted;$('bm').textContent=muted?'🔇':'🔊';if(mg)mg.gain.value=muted?0:.5};
const volEl=$('volume');if(volEl){volEl.value=muted?0:50;volEl.oninput=()=>{const g=+volEl.value/100;if(mg)mg.gain.value=g*.5;muted=g<=0;$('bm').textContent=muted?'🔇':'🔊'}};
/* ---------- input ---------- */
const keys={};let joined=false,riderName='',riding=true,lbOpen=false;addEventListener('keydown',e=>{if(settingsOpen){if(e.code==='Escape'){e.preventDefault();closeSettings()}return}keys[e.code]=1;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(joined&&e.code==='Space'&&!e.repeat&&riding&&!gOpen&&!air&&!wreck)bounceRequested=true;if(joined&&e.code==='KeyF'&&!e.repeat)tryGroundTouch();if(joined&&e.code==='KeyG'&&riding)tg(!gOpen);if(joined&&e.code==='Escape'&&gOpen)tg(false);if(e.code==='KeyL'){lbOpen=!lbOpen;$('lb').classList.toggle('hidden',!lbOpen);if(lbOpen){$('lb-list').innerHTML=LB.map((e,i)=>`<div style='padding:4px 0;border-bottom:1px solid #333'><span style='opacity:.7'>#${i+1}</span> <span style='float:right'>$${e.c.toLocaleString()}</span><div>${e.n}</div></div>`).join('')}}});
addEventListener('keyup',e=>keys[e.code]=0);addEventListener('blur',()=>{for(const k in keys)keys[k]=0});
document.querySelectorAll('#tc button').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{if(k==='KeyF')tryGroundTouch();else{if(k==='Space'&&!keys[k]&&joined&&riding&&!gOpen&&!air&&!wreck)bounceRequested=true;keys[k]=1}e.preventDefault()});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=0))});
/* ---------- state ---------- */
const MYC=new T.Color().setHSL(Math.random(),.8,.5).getHex();
let me;try{me=buildBike(BIKES[S.eq],MYC,HELMETS[S.helmet]?.color||0x20272a,true);}catch(e){console.error('buildBike failed:',e);try{me=buildBike(BIKES[0],MYC,0x20272a,true);}catch(e2){console.error('buildBike bike 0 failed:',e2);me={g:new T.Group()};}}scene.add(me.g);let myTag=null;
let walker;try{walker=buildWalker();scene.add(walker.g);walker.g.visible=false;}catch(e){console.error('buildWalker failed:',e);walker={g:new T.Group()};scene.add(walker.g);walker.g.visible=false;}let walkerTag=null;
/* empty car parks where riders host stunt rideouts */
const carparkGroup=new T.Group();
for(const cp of RIDEOUT_SPOTS){const cg=new T.Group();cg.position.set(cp.x,0,cp.z);const cm=new T.Mesh(new T.BoxGeometry(36,0.5,30),mat(0x262b33,{roughness:1,metalness:0}));cm.receiveShadow=true;cg.add(cm);carparkGroup.add(cg)}
scene.add(carparkGroup);
let x=0,y=0,z=0,h=0,v=0,p=0,pw=0,vy=0,air=false,wreck=0,boostE=0,boosting=false,zt=0,wt=0,cb=1,pad=0,padCooldown=0,airT=0,roll=0,lastGH=0,lastRd=0,tt=0,pt=0,units=S.units?1:0,svT=0,gOpen=false,settingsOpen=false,gi=S.eq,garTab='bikes',garPrice='all',ga=0,camInit=true,prevOnSw=false,seamI=0;
let ox=1.2,oy=0,oz=0,oh=0,opitch=0,lookYaw=0,lookPitch=0,walkSpeed=0,walkCycle=0,bounceRequested=false;
const frontSusp={comp:0,vel:0},rearSusp={comp:0,vel:0};
function stepSuspension(state,spring,damping,travel,dt,load=0){const count=Math.max(1,Math.ceil(dt*240)),step=dt/count,min=-travel*.12;load=Math.max(0,Math.min(travel*.3,load));for(let i=0;i<count;i++){state.vel+=((load-state.comp)*spring-state.vel*damping)*step;state.comp+=state.vel*step;if(state.comp>travel){state.comp=travel;state.vel=Math.min(0,state.vel)}else if(state.comp<min){state.comp=min;state.vel=Math.max(0,state.vel)}}}
let airFlip=0,airRoll=0,wheelieHold=0;const DAY_LEN=240;let tod=6.4;let trick=null,trickT=0;let wzone=0;
const setLook=(dx,dy)=>{if(riding){lookYaw=Math.max(-1.35,Math.min(1.35,lookYaw-dx*.002));lookPitch=Math.max(-.55,Math.min(.55,lookPitch-dy*.0015))}else{oh-=dx*.002;opitch=Math.max(-.8,Math.min(.65,opitch-dy*.002))}};
cv.addEventListener('click',()=>{if(joined&&!gOpen)cv.requestPointerLock?.()});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===cv)setLook(e.movementX,e.movementY)});
let lookPointer=null,lookX=0,lookY=0;
cv.addEventListener('pointerdown',e=>{if(joined&&e.pointerType==='touch'){lookPointer=e.pointerId;lookX=e.clientX;lookY=e.clientY;cv.setPointerCapture(e.pointerId)}});
cv.addEventListener('pointermove',e=>{if(e.pointerId===lookPointer){setLook(e.clientX-lookX,e.clientY-lookY);lookX=e.clientX;lookY=e.clientY}});
cv.addEventListener('pointerup',e=>{if(e.pointerId===lookPointer)lookPointer=null});
cv.addEventListener('pointercancel',e=>{if(e.pointerId===lookPointer)lookPointer=null});
function tryGroundTouch(){
if(!joined||gOpen||!riding||wreck>0||air)return;
const wheelie=!!(keys['ShiftLeft']||keys['ShiftRight'])&&p>0;
if(wheelie&&wzone===1){if(trick==null){trick='handscrape';trickT=0;pop('HAND SCRAPE · F SCRAPE','#facc15')}}
else if(wheelie&&wzone===2){wheelieHold=Math.max(0,wheelieHold-1.2);cb=1;earn(30);pop('SKILL · REACHED THE GROUND +$30','#4ade80')}
}
const earn=a=>{S.cash+=a*rideMult();questCash+=a;if(questStage===3&&questCash>=1000){questStage=4;qDone(3)}if(S.cash>0){LB.push({n:riderName||'Rider',c:Math.floor(S.cash)});LB.sort((a,b)=>b.c-a.c);if(LB.length>10)LB.length=10;save()}};
function pop(t,col,dur=1450){const d=document.createElement('div');d.className='pp';d.textContent=t;d.style.color=col||'#4ade80';d.style.marginLeft=((Math.random()-.5)*200-50)+'px';$('pop').appendChild(d);setTimeout(()=>d.remove(),dur)}
/* ---------- multiplayer ---------- */
const ROOM='eridelife-ghpages-v1',ID=Math.random().toString(36).slice(2,9),rem=new Map();let cli=null,online=false,networkText='Enter a name to connect',subbed=false;
/* TLS-only relays: a plain ws:// relay is blocked as mixed content on an HTTPS page. */
const BROKERS=['wss://broker.emqx.io:8084/mqtt','wss://broker.hivemq.com:8884/mqtt','wss://broker-cn.emqx.io:8084/mqtt','wss://broker-us-east-1.emqx.io:8084/mqtt','wss://broker-eu-west-1.emqx.io:8084/mqtt','wss://mqtt.eclipseprojects.io:443/mqtt'];
let brokerIdx=0,attemptAt=0,mqttLoading=false;
const relayHost=u=>u.replace(/^wss?:\/\//,'').split(/[:/]/)[0];
/* Riders only share a room on the same relay, and public relays can take 20s to hand out a session, so never rotate a working one. */
const subRoom=c=>{if(subbed||cli!==c)return;subbed=true;c.subscribe(ROOM+'/s',{qos:0},e=>{if(e){subbed=false;networkText='Relay slow · retrying the room';console.error('MQTT subscribe failed:',e.message)}})};
const attemptRelay=()=>{if(!online){brokerIdx=(brokerIdx+1)%BROKERS.length;connectOnline()}};
const MQTT_SRC=['https://cdn.jsdelivr.net/npm/mqtt@5.3.4/dist/mqtt.min.js','https://unpkg.com/mqtt@5.3.4/dist/mqtt.min.js','https://cdnjs.cloudflare.com/ajax/libs/mqtt/5.3.4/mqtt.min.js'];
const mqttWaiters=[];
const flushMqtt=ok=>{mqttLoading=false;while(mqttWaiters.length)mqttWaiters.shift()(ok)};
function loadMqttFrom(n){if(n>=MQTT_SRC.length){mqttLoading=false;return flushMqtt(typeof mqtt!=='undefined')}networkText='Loading rider relay…';const s=document.createElement('script');s.src=MQTT_SRC[n];s.onload=()=>{if(typeof mqtt!=='undefined'){mqttLoading=false;flushMqtt(true)}else loadMqttFrom(n+1)};s.onerror=()=>{loadMqttFrom(n+1)};document.head.appendChild(s)}
function ensureMqtt(cb){if(typeof mqtt!=='undefined'){if(cb)cb(true);return}if(cb)mqttWaiters.push(cb);if(mqttLoading)return;mqttLoading=true;loadMqttFrom(0)}
function connectOnline(){
if(cli&&cli.connected&&online)return;
if(typeof mqtt==='undefined'){ensureMqtt(ok=>{if(ok)connectOnline();else{online=false;networkText='Offline · relay library blocked';console.error('MQTT library failed to load from its CDN');setTimeout(()=>{if(!online)connectOnline()},6000)}});return}
const url=BROKERS[brokerIdx%BROKERS.length];
/* Keep exactly one live client: a stale client would keep retrying and fight the new relay. */
if(cli){try{cli.removeAllListeners();cli.end(true)}catch(e){}cli=null}
online=false;subbed=false;attemptAt=performance.now();
try{const c=cli=mqtt.connect(url,{clientId:'ebl_'+ID,reconnectPeriod:3000,connectTimeout:30000,clean:true,keepalive:30,resubscribe:true});
networkText='Connecting to '+relayHost(url)+'…';
c.on('connect',()=>{if(cli!==c)return;c.ready=true;online=true;attemptAt=0;networkText='Connected to riders';subRoom(c)});
c.on('reconnect',()=>{if(cli!==c)return;networkText='Reconnecting…';subRoom(c)});
c.on('close',()=>{if(cli!==c)return;online=false;subbed=false;networkText=c.ready?'Reconnecting…':'Connecting to '+relayHost(url)+'…'});
c.on('offline',()=>{if(cli!==c)return;online=false;subbed=false;networkText='Reconnecting…'});
c.on('error',e=>{if(cli!==c)return;console.error('MQTT connection failed:',e&&e.message||e);networkText='Relay slow · still connecting…';if(!online&&performance.now()-attemptAt>8000)attemptRelay()});
c.on('message',(t,m)=>{try{const d=JSON.parse(m.toString());if(d.i===ID||!BIKES[d.b]||typeof d.i!=='string')return;let r=rem.get(d.i);
if(!r){r={rig:null,b:-1,x:d.x,y:d.y,z:d.z,h:d.h,p:d.p,r:d.r,v:0,col:'#'+(d.c>>>0).toString(16).padStart(6,'0'),ver:d.ver,onFoot:false,px:d.px??d.x,py:d.py??d.y,pz:d.pz??d.z,ph:d.ph??d.h,tx:d.x,ty:d.y,tz:d.z,afp:0,afr:0,fc:0,rc:0,tfc:0,trc:0};r.tag=tag(d.n||'Rider','#fff',verLabel(d.ver),verColor(d.ver));r.walker=buildWalker(d.c);r.walkerTag=tag(d.n||'Rider','#fff');r.walkerTag.position.y=2.15;r.walkerTag.scale.set(2,.5,1);r.walker.g.add(r.walkerTag);r.walker.g.visible=false;scene.add(r.walker.g);r.seen=performance.now();rem.set(d.i,r)}
if(r.b!==d.b){if(r.rig)scene.remove(r.rig.g);r.rig=buildBike(BIKES[d.b],d.c,HELMETS[d.hm]?.color||0x20272a);r.rig.g.add(r.tag);scene.add(r.rig.g);r.b=d.b}
Object.assign(r,{tx:d.x,ty:d.y,tz:d.z,th:d.h,tp:d.on?0:d.p,tr:d.on?0:d.r,tv:d.on?0:d.v,tfp:d.fp||0,tfr:d.fr||0,tfc:Number.isFinite(d.fc)?d.fc:0,trc:Number.isFinite(d.rc)?d.rc:0,tpx:d.px??d.x,tpy:d.py??d.y,tpz:d.pz??d.z,tph:d.ph??d.h,onFoot:!!d.on,n:d.n,ver:d.ver,seen:performance.now()})}catch(e){console.error('Invalid rider update:',e)}})
}catch(e){online=false;console.error('MQTT connection failed:',e&&e.message||e);networkText='Offline · retrying…';setTimeout(()=>{if(!online)attemptRelay()},5000)}
}
/* Watchdog: a stalled public relay never reports an error, so only give up after 20s without a session. */
setInterval(()=>{if(!joined)return;if(online){if(!subbed&&cli&&cli.connected)subRoom(cli);return}if(cli&&cli.connected)return;if(attemptAt&&performance.now()-attemptAt>20000){attemptAt=0;attemptRelay()}},1000);
const nameInput=$('rider-name');
try{nameInput.value=localStorage.getItem('wheeliex-name')||''}catch(e){}
$('join-form').addEventListener('submit',e=>{e.preventDefault();riderName=nameInput.value.trim().slice(0,16);
if(riderName.length<2){nameInput.setCustomValidity('Enter at least 2 characters.');nameInput.reportValidity();return}
nameInput.setCustomValidity('');joined=true;for(const key in keys)keys[key]=0;try{myTag=tag(riderName,'#c0f56a','v'+VERSION,'#a3e635');me.g.add(myTag);walkerTag=tag(riderName,'#c0f56a');walkerTag.position.y=2.15;walkerTag.scale.set(2,.5,1);walker.g.add(walkerTag);}catch(e){console.error('join tag failed:',e)}$('join-screen').classList.add('hidden');
try{localStorage.setItem('wheeliex-name',riderName)}catch(e){}
networkText='Connecting to riders…';$('net').textContent=networkText;connectOnline()});
nameInput.addEventListener('input',()=>nameInput.setCustomValidity(''));addEventListener('online',()=>{if(joined&&!online)connectOnline()});
/* ---------- police ---------- */
function buildCop(){
const g=new T.Group(),paint=mat(0xe8edf0,{roughness:.32,metalness:.45}),navy=mat(0x152334,{roughness:.42,metalness:.4}),glass=mat(0x203847,{roughness:.2,metalness:.55}),rubber=mat(0x101214,{roughness:.9,metalness:0}),chrome=mat(0x9ca8ae,{roughness:.25,metalness:.9});
g.add(bx(1.96,.6,4.65,paint,0,.67,0),bx(1.86,.18,1.55,paint,0,1.02,1.35),bx(1.84,.18,1.1,paint,0,1.01,-1.67));
g.add(bx(1.67,.57,2.05,paint,0,1.3,-.28),bx(1.48,.13,1.25,paint,0,1.65,-.35));
const wind=bx(1.48,.38,.045,glass,0,1.36,.74);wind.rotation.x=-.32;g.add(wind);
const rear=bx(1.42,.34,.045,glass,0,1.35,-1.31);rear.rotation.x=.32;g.add(rear);
for(const side of [-1,1]){
g.add(bx(.035,.34,1.47,glass,side*.84,1.36,-.25),bx(.045,.15,2.5,navy,side*.99,.77,-.05));
g.add(bx(.06,.12,1.85,chrome,side*1,.78,-.05),bx(.12,.15,.35,navy,side*1.02,1.14,.42));
}
g.add(bx(1.05,.24,.06,navy,0,.78,2.34),bx(1.98,.14,.18,chrome,0,.48,2.36),bx(1.98,.12,.16,navy,0,.46,-2.36));
for(let i=0;i<5;i++)g.add(bx(.035,.13,.025,chrome,-.35+i*.175,.78,2.38));
for(const z of [-1.47,1.47])for(const side of [-1,1]){
const tire=new T.Mesh(new T.CylinderGeometry(.38,.38,.25,18),rubber);tire.rotation.z=PI/2;tire.position.set(side*.94,.39,z);g.add(tire);
const hub=new T.Mesh(new T.CylinderGeometry(.19,.19,.27,14),chrome);hub.rotation.z=PI/2;hub.position.copy(tire.position);g.add(hub);
}
for(const side of [-1,1]){
const head=bx(.36,.15,.06,mat(0xfff0c2,{emissive:0x6a4a10,emissiveIntensity:.6}),side*.65,.78,2.37);
const tail=bx(.27,.12,.05,mat(0x9b1d20,{emissive:0x4a090b,emissiveIntensity:.5}),side*.66,.78,-2.37);g.add(head,tail);
}
const redM=new T.MeshStandardMaterial({color:0x57121b,emissive:0xff1838,emissiveIntensity:.12,metalness:.25,roughness:.3});
const blueM=new T.MeshStandardMaterial({color:0x102752,emissive:0x1767ff,emissiveIntensity:.12,metalness:.25,roughness:.3});
g.add(bx(1.08,.08,.28,navy,0,1.77,-.3));
const red=bx(.47,.16,.3,redM,-.29,1.88,-.3),blue=bx(.47,.16,.3,blueM,.29,1.88,-.3);g.add(red,blue);
g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
return{g,redM,blueM};
}
function buildHelicopter(){
const g=new T.Group(),shell=mat(0x263645,{roughness:.65,metalness:.45}),glass=mat(0x77b9c9,{roughness:.2,metalness:.55}),rotor=new T.Group();
g.add(bx(1.8,1,3.8,shell,0,0,0),bx(1.25,.65,1.5,shell,0,.05,1.65),bx(1.35,.58,.06,glass,0,.15,.98),bx(.25,.25,3.2,shell,0,.05,-3.2),bx(.2,1.1,.55,shell,0,.6,-4.55));
rotor.position.y=.9;rotor.add(bx(7,.07,.2,mat(0x171c22),0,0,0),bx(.2,.07,7,mat(0x171c22),0,0,0));g.add(rotor);
const tailRotor=new T.Group();tailRotor.position.set(0,.35,-4.65);tailRotor.add(bx(1.2,.08,.12,mat(0x171c22),0,0,0),bx(.08,.75,.12,mat(0x171c22),0,0,0));g.add(tailRotor);
g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
return{g,rotor,tailRotor};
}
function buildTank(){
const g=new T.Group(),armor=mat(0x53634a,{roughness:.85,metalness:.2}),dark=mat(0x252a26,{roughness:.9,metalness:.1});
g.add(bx(2.8,.85,4.2,armor,0,.95,0),bx(1.65,.7,2,dark,-1.35,.55,0),bx(1.65,.7,2,dark,1.35,.55,0),bx(1.65,.65,1.8,armor,0,1.65,-.2));
const turret=new T.Group();turret.position.set(0,1.8,-.25);turret.add(new T.Mesh(new T.CylinderGeometry(.65,.75,.45,10),armor),bx(.24,.24,2.7,armor,0,.08,1.55));g.add(turret);
for(let side of [-1,1])for(let i=0;i<4;i++){const wheel=new T.Mesh(new T.CylinderGeometry(.34,.34,.18,12),dark);wheel.rotation.z=PI/2;wheel.position.set(side*1.48,.52,-1.35+i*.9);g.add(wheel)}
g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
return{g,turret};
}
const cops=[0,1].map(i=>({c:buildCop(),x:i?4:-4,z:i?-200:200,h:i?0:PI,v:14,dir:i?1:-1,d:999}));cops.forEach(q=>scene.add(q.c.g));
const heli=buildHelicopter(),tank=buildTank();scene.add(heli.g,tank.g);heli.g.visible=false;tank.g.visible=false;
let wanted=0,chaseT=0,escT=0,heat=0;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const policeModes={easy:{detect:38,heat:.68,speed:.78,catch:2.6,escape:6,distance:110},medium:{detect:54,heat:1,speed:1,catch:3.5,escape:8,distance:125},hard:{detect:66,heat:1.2,speed:1.12,catch:3.9,escape:9,distance:140},insane:{detect:80,heat:1.45,speed:1.28,catch:4.2,escape:11,distance:155},death:{detect:96,heat:1.7,speed:1.45,catch:4.5,escape:13,distance:175}};
function copReset(){const playerZ=riding?z:oz;cops.forEach((q,i)=>{q.z=playerZ+(i?-1:1)*210;q.x=i?4:-4;q.v=14;q.h=i?0:PI;q.dir=i?1:-1;q.d=999})}
function updCops(dt){
const px=riding?x:ox,pz=riding?z:oz,ph=riding?h:oh,pv=riding?Math.abs(v):walkSpeed,inTown=Math.abs(px)<180,flash=((tt*8)|0)%2,mode=policeModes[S.policeDifficulty];
cops.forEach((q,i)=>{
q.c.g.visible=wanted||inTown;
if(!q.c.g.visible)return;
if(wanted){
const lead=clamp(Math.hypot(px-q.x,pz-q.z)/Math.max(q.v,12),.25,1.25),tx=px+Math.sin(ph)*pv*lead,tz=pz+Math.cos(ph)*pv*lead;
let err=Math.atan2(tx-q.x,tz-q.z)-q.h;err=Math.atan2(Math.sin(err),Math.cos(err));
q.h+=clamp(err,-1.8*dt,1.8*dt);
const limit=Math.min(34,(22+chaseT*.22+i*1.5)*mode.speed),target=limit*(.62+.38*Math.max(0,Math.cos(err)));
q.v+=clamp(target-q.v,-7*dt,4*dt);
q.x+=Math.sin(q.h)*q.v*dt;q.z+=Math.cos(q.h)*q.v*dt;
nbr(q.x,q.z,c=>{for(const o of c.cols)if(gH(q.x,q.z)<=o.h&&Math.abs(q.x-o.x)<o.hw+.95&&Math.abs(q.z-o.z)<o.hd+1.8){
const px=o.hw+.95-Math.abs(q.x-o.x),pz=o.hd+1.8-Math.abs(q.z-o.z);
if(px<pz){q.x+=Math.sign(q.x-o.x||1)*px;q.h+=Math.sign(q.x-o.x||1)*.25}
else{q.z+=Math.sign(q.z-o.z||1)*pz;q.h-=Math.sign(q.z-o.z||1)*.25}
q.v=Math.max(8,q.v*.55)
}});
}else{
q.h=q.dir>0?0:PI;q.v=14;q.x=i?4:-4;q.z+=q.dir*q.v*dt;
if(Math.abs(q.z-pz)>260)q.z=pz-q.dir*220;
}
q.d=Math.hypot(px-q.x,pz-q.z);
q.c.g.position.set(q.x,gH(q.x,q.z),q.z);q.c.g.rotation.y=q.h;
q.c.redM.emissiveIntensity=wanted&&flash===i%2?3.2:.12;
q.c.blueM.emissiveIntensity=wanted&&flash!==(i%2)?3.2:.12;
});
heli.g.visible=wanted>=3;tank.g.visible=wanted>=5;
if(heli.g.visible){const orbit=tt*.22,hx=px+Math.cos(orbit)*34,hz=pz+Math.sin(orbit)*34;heli.g.position.set(hx,13+Math.sin(tt*1.8)*.6,hz);heli.g.rotation.y=Math.atan2(px-hx,pz-hz);heli.rotor.rotation.y+=dt*25;heli.tailRotor.rotation.z+=dt*20}
if(tank.g.visible){const tx=px-Math.sin(ph)*20+Math.cos(ph)*8,tz=pz-Math.cos(ph)*20-Math.sin(ph)*8,step=Math.min(1,dt*1.4),dx=tx-tank.g.position.x,dz=tz-tank.g.position.z;tank.g.position.x+=dx*step;tank.g.position.z+=dz*step;tank.g.position.y=gH(tank.g.position.x,tank.g.position.z);tank.g.rotation.y=Math.atan2(dx,dz);tank.turret.rotation.y=Math.atan2(px-tank.g.position.x,pz-tank.g.position.z)-tank.g.rotation.y}
if(!gOpen){
const pxNow=riding?x:ox,pzNow=riding?z:oz,pyNow=riding?y:oy;
for(const q of cops){if(!q.c.g.visible||Math.abs(pyNow-gH(q.x,q.z))>2)continue;
const pdNow=Math.hypot(pxNow-q.x,pzNow-q.z);
if(riding){if(pdNow<2.5){const impact=Math.abs(v);v*=.35;if(impact>12&&wreck<=0){wreck=1.7;p=0;pw=0;wt=0;zt=0;cb=1;pop('POLICE COLLISION!','#f43f5e')}}y=gH(x,z)}
else{walkSpeed=0;oy=gH(ox,oz);walker.g.position.set(ox,oy,oz)}
q.d=Math.hypot((riding?x:ox)-q.x,(riding?z:oz)-q.z)
}
if(tank.g.visible&&Math.abs(pyNow-tank.g.position.y)<2){const dx=pxNow-tank.g.position.x,dz=pzNow-tank.g.position.z,px=2.2-Math.abs(dx),pz=3-Math.abs(dz);if(px>0&&pz>0){if(px<pz){if(riding)x+=Math.sign(dx||1)*px;else ox+=Math.sign(dx||1)*px}else if(riding)z+=Math.sign(dz||1)*pz;else oz+=Math.sign(dz||1)*pz;if(riding){const impact=Math.abs(v);v*=.35;if(impact>12&&wreck<=0){wreck=1.7;p=0;pw=0;pop('ARMORED COLLISION!','#f43f5e')}}}}
}
if(inTown){
const spotted=cops.some(q=>q.d<mode.detect&&(pv>18||riding&&p>.55));
const escalation=1.35+wanted*.75;
heat=clamp(heat+(spotted?dt*(riding&&p>.55?1.15:.72)*mode.heat:-dt*.45),0,escalation);
if(heat>=escalation&&wanted<6){wanted++;heat=0;if(wanted===1){chaseT=0;pop('🚨 PURSUIT','#f87171')}else pop(`WANTED LEVEL · ${wanted}`,'#f87171');
if(wanted===3)pop('AIR SUPPORT INBOUND','#f87171');
if(wanted===5)pop('ARMORED UNIT DEPLOYED','#f87171');
if(wanted===6)pop('LEVEL 6 · EMP LOCKDOWN — ESCAPE THE PERIMETER','#38bdf8')}
}else if(!wanted)heat=Math.max(0,heat-dt*.45);
if(wanted){
chaseT+=dt;const md=Math.min(...cops.map(q=>q.d));
if(cops.some(q=>q.d<mode.catch)&&(riding?y:oy)<2.1&&chaseT>2.5){
const fine=Math.min(S.cash,Math.floor(100+Math.min(chaseT*18,700)));S.cash-=fine;
pop('BUSTED! -$'+fine.toLocaleString(),'#ef4444');wanted=0;heat=0;v=0;p=0;pw=0;wheelieHold=0;copReset()
}else if(md>mode.distance&&(pv>10||air)){
escT+=dt;if(escT>mode.escape){const reward=Math.floor(200+Math.min(chaseT*15,800));earn(reward);
pop('PURSUIT LOST +$'+reward.toLocaleString(),'#4ade80');wanted=0;heat=0;copReset()}
}else escT=0;
}
$('pl').classList.toggle('pursuit',!!wanted);$('pl').classList.toggle('max-wanted',wanted===6);
}
/* ---------- garage ---------- */
const G=$('gar'),SET=$('settings'),difficultySelect=$('police-difficulty'),gfxSelect=$('graphics-quality'),SN=['Motor Power','Torque','Balance','Boost'];
function closeSettings(){settingsOpen=false;SET.style.display='none';for(const key in keys)keys[key]=0}
function openSettings(){if(gOpen)tg(false);settingsOpen=true;SET.style.display='block';difficultySelect.value=S.policeDifficulty;gfxSelect.value=S.graphics||'high';for(const key in keys)keys[key]=0}
difficultySelect.value=S.policeDifficulty;
difficultySelect.addEventListener('change',()=>{if(policeModes[difficultySelect.value]){S.policeDifficulty=difficultySelect.value;save()}});
gfxSelect.value=S.graphics||'high';
gfxSelect.addEventListener('change',()=>{S.graphics=gfxSelect.value;save();applyGraphics(S.graphics)});
$('a11y-reduced-motion').onchange=function(){S.accessibility.reducedMotion=!!this.checked;save();document.body.classList.toggle('a11y-reduced-motion',!!this.checked)};
$('a11y-large-text').onchange=function(){S.accessibility.largeText=!!this.checked;save();document.body.classList.toggle('a11y-large-text',!!this.checked)};
$('a11y-high-contrast').onchange=function(){S.accessibility.highContrast=!!this.checked;save();document.body.classList.toggle('a11y-high-contrast',!!this.checked)};
$('st').onclick=openSettings;$('settings-close').onclick=closeSettings;$('lb-close').onclick=()=>{lbOpen=false;$('lb').classList.add('hidden')};
function setBike(i){scene.remove(me.g);me=buildBike(BIKES[i],MYC,HELMETS[S.helmet]?.color||0x20272a,true);if(myTag)me.g.add(myTag);scene.add(me.g)}
function vo(){if(gOpen&&innerWidth>700)cam.setViewOffset(innerWidth,innerHeight,-innerWidth*.2,0,innerWidth,innerHeight);else cam.clearViewOffset();cam.updateProjectionMatrix()}
function tg(o){if(settingsOpen)return;if(o&&wanted){pop('LOSE THE COPS FIRST','#f87171');return}if(o)setMapExpanded(false);gOpen=o;G.style.display=o?'block':'none';if(o){gi=S.eq;rg();v=0;p=0;pw=0;wheelieHold=0;air=false;vy=0;y=gH(x,z)}else if(gi!==S.eq)setBike(S.eq);vo()}
function rg(){const prices=[['all','ALL BIKES'],['under5k','UNDER $5,000'],['5k','$5,000 – $20,000'],['20k','$20,000 – $55,000'],['over55k','OVER $55,000']],priceSel=garTab==='filter'?`<div class="gar-filter"><label for="gar-price">PRICE RANGE</label><select id="gar-price">${prices.map(([v,l])=>`<option value="${v}"${garPrice===v?' selected':''}>${l}</option>`).join('')}</select></div>`:'';let t=`<h2>GARAGE <span>$${Math.floor(S.cash).toLocaleString()}</span><button data-a="close">✕</button></h2><div class="gar-tabs"><button data-a="tab-bikes"${garTab==='bikes'?' class="sel"':''}>E-BIKES</button><button data-a="tab-scooters"${garTab==='scooters'?' class="sel"':''}>E-SCOOTERS</button><button data-a="tab-filter"${garTab==='filter'?' class="sel"':''}>FILTER</button><button data-a="tab-rideouts"${garTab==='rideouts'?' class="sel"':''}>RIDEOUTS</button></div>${priceSel}<div class="grid" data-view="${garTab}">`;
const inPrice=i=>{const pr=BIKES[i].pr;return garPrice==='all'||(garPrice==='under5k'&&pr<5000)||(garPrice==='5k'&&pr>=5000&&pr<20000)||(garPrice==='20k'&&pr>=20000&&pr<55000)||(garPrice==='over55k'&&pr>=55000)};
const listBikes=garTab==='rideouts'?[]:BIKE_ORDER.filter(i=>garTab==='scooters'?BIKES[i].kind==='scooter':garTab==='bikes'?BIKES[i].kind!=='scooter':true).filter(i=>garTab==='filter'?inPrice(i):true);
if(garTab==='rideouts'){RIDEOUT_SPOTS.forEach((sp,i)=>{const r=RIDEOUTS[rideTier];t+=('<div class="card"><b>'+sp.n+'</b><small>EMPTY CAR PARK · NOT BUILT</small><span>'+r.n+' · $'+r.fee.toLocaleString()+' · MONEY BOUNCED '+r.mult+'×</span><button class="big" data-a="ride" data-i="'+i+'" data-t="'+(rideTier<0?0:rideTier)+'">HOST '+r.n.toUpperCase()+'</button></div>');t+=('<div class="card"><b>SUPER RIDEOUT</b><small>SPEND AN EXTRA $5,000 FOR THE 2× MONEY BOUNCE</small><span>2× MONEY BOUNCED ON EVERY HOSTED RIDEOUT</span><button class="big" data-a="ride" data-i="0" data-t="1">HOST SUPER · $30,000 · 2×</button></div>');});}else if(!listBikes.length)t+='<div class="gar-empty">No bikes match this filter.</div>';
if(listBikes.length&&!listBikes.includes(gi)){gi=listBikes[0];setBike(gi)}
listBikes.forEach(i=>{const b=BIKES[i],owned=S.own.includes(i);t+=`<div class="card${i===gi?' sel':''}" data-a="pv" data-i="${i}"><b>${b.n}</b><small>${owned?(i===S.eq?'EQUIPPED':'OWNED'):'$'+b.pr.toLocaleString()} · ${Math.round(b.maxMph*(units?1.609:1))} ${units?'KM/H':'MPH'}</small>${eff(i).map(q=>`<div class="bar"><i style="width:${Math.min(100,q*10)}%"></i></div>`).join('')}</div>`});
if(garTab!=='rideouts'){const b=BIKES[gi],own=S.own.includes(gi),e=eff(gi),L=lv(gi),rarity=hackRarity(gi),hackCost=hackPrice(gi),canReroll=hackRank(gi)<HACK_RARITIES.length-1;t+=`</div><h3>${b.n} <small class="bike-spec">${Math.round(b.maxMph*(units?1.609:1))} ${units?'KM/H':'MPH'}</small></h3>`;
t+=own?(gi===S.eq?'':'<button class="big" data-a="eq">EQUIP</button>'):`<button class="big" data-a="buy" ${S.cash<b.pr?'disabled':''}>BUY $${b.pr.toLocaleString()}</button>`;
SN.forEach((n,k)=>{const l=L[k],maxed=e[k]>=10||b.s[k]*(1+l*.015)>10;t+=`<div class="row"><span>${n}</span><div class="bar"><i style="width:${Math.min(100,e[k]*10)}%"></i></div><em>${maxed?'MAX':`Lv ${l}`}</em>${own&&!maxed&&l<10?`<button data-a="up" data-k="${k}" ${S.cash<cost(gi,l)?'disabled':''}>+1.5% · $${cost(gi,l).toLocaleString()}</button>`:`<button disabled>${maxed||l>=10?'MAX':'—'}</button>`}</div>`});
const chosen=Number(S.suspension[gi]||0),mounted=Number(S.boostMount[gi]||0);
t+=`<section class="mod-shop"><h3>MOD SHOP</h3><h4>SUSPENSION</h4><div class="mod-grid">`;
SUSPENSIONS.forEach((s,i)=>{const price=modPrice(gi,s.price),selected=chosen===i;t+=`<button class="mod-card${selected?' selected':''}" data-a="susp" data-v="${i}" ${!own||selected||S.cash<price?'disabled':''}><b>${s.n}</b><small>${selected?'INSTALLED':i===0?'FACTORY SETUP':'INSTALL $'+price.toLocaleString()}</small><span>${Math.round(s.travel*100)} cm travel · ${i===1?'soft':i===2?'firm':'stock'} damping</span></button>`});
t+=`</div><h4>BOOST MOUNTS</h4><div class="mod-grid">`;
for(let tier=1;tier<=2;tier++){const total=mountPrice(gi,tier),price=total-(mounted?mountPrice(gi,mounted):0),installed=mounted>=tier;t+=`<button class="mod-card${installed?' selected':''}" data-a="mount" data-v="${tier}" ${!own||installed||S.cash<price?'disabled':''}><b>${tier===1?'Street boost':'Race boost'}</b><small>${installed?'INSTALLED':`${mounted?'UPGRADE':'INSTALL'} · ${tier===1?'300%':'400%'} · $${price.toLocaleString()}`}</small><span>${tier===1?'Balanced assist':'Maximum boost output'}</span></button>`}
t+=`</div><h4>ECU SOFTWARE</h4><div class="mod-card hack-card"><b>RANDOM RARITY HACK</b><small>CURRENT: ${rarity?`${rarity.name} · ${rarity.id==='secret'?'ALL STATS MAXED':`+${Math.round(rarity.boost*100)}%`}`:'NONE'} · $${hackCost.toLocaleString()} PER ROLL</small><div class="hack-odds">${HACK_RARITIES.map(r=>`<span style="--rarity:${r.color}">${r.name} <i>${r.chance}%</i> · ${r.id==='secret'?'MAX':`+${Math.round(r.boost*100)}%`}</span>`).join('')}</div><span>Best rarity is kept; failed or lower rolls cost the fee. Secret maxes all stats. Boost still requires a boost mount.</span><button data-a="hack" ${!own||!canReroll||S.cash<hackCost?'disabled':''}>${!canReroll?'SECRET MAXED':'ROLL HACK · $'+hackCost.toLocaleString()}</button></div></section><h3>HELMETS</h3><div class="mod-grid">`;
HELMETS.forEach((h,i)=>{const owned=(S.helmetOwn||[]).includes(i),selected=i===S.helmet;
 if(owned)t+=`<button class="mod-card${selected?' selected':''}" data-a="eqhelmet" data-i="${i}"><i class="helmet-swatch" style="background:linear-gradient(145deg,#${h.color.toString(16).padStart(6,'0')},#${h.accent.toString(16).padStart(6,'0')})"></i><b>${h.n}</b><small>${selected?'EQUIPPED':'EQUIP'}</small><span>${h.desc}</span></button>`;
 else t+=`<button class="mod-card" data-a="buyhelmet" data-i="${i}" ${S.cash<h.pr?'disabled':''}><i class="helmet-swatch" style="background:linear-gradient(145deg,#${h.color.toString(16).padStart(6,'0')},#${h.accent.toString(16).padStart(6,'0')})"></i><b>${h.n}</b><small>BUY · $${h.pr.toLocaleString()}</small><span>${h.desc}</span></button>`});
t+=`</div>`;}
G.innerHTML=t}
G.onclick=e=>{const t=e.target.closest('[data-a]');if(!t||t.disabled)return;const a=t.dataset.a;
if(a.startsWith('tab-')){garTab=a.slice(4);rg();return}
if(a==='close'){tg(false);return}
if(a==='ride'){const i=+t.dataset.i,ty=+t.dataset.t;if(Number.isInteger(i)&&i>=0&&i<RIDEOUT_SPOTS.length&&Number.isInteger(ty)&&ty>=0&&ty<RIDEOUTS.length){const r=RIDEOUTS[ty];if(S.cash>=r.fee){S.cash-=r.fee;rideTier=ty;save();pop(`${r.n} HOSTED AT ${RIDEOUT_SPOTS[i].n.toUpperCase()} · MONEY BOUNCED ${r.mult}×`,'#c0f56a');if(questStage===2){questStage=3;qDone(2)}}else pop('NOT ENOUGH CASH TO HOST A RIDEOUT','#f87171')}}
if(a==='pv'){gi=+t.dataset.i;setBike(gi)}
else if(a==='eq'){S.eq=gi;boostE=Number(S.boostMount[gi]||0)>0?100:0}
else if(a==='buy'){const pr=BIKES[gi].pr;if(S.cash>=pr){S.cash-=pr;S.own.push(gi);S.eq=gi;boostE=Number(S.boostMount[gi]||0)>0?100:0}}
else if(a==='up'){const k=Number(t.dataset.k);if(Number.isInteger(k)&&k>=0&&k<4){const l=lv(gi)[k],c=cost(gi,l);if(S.own.includes(gi)&&l<10&&BIKES[gi].s[k]*(1+l*.015)<=10&&S.cash>=c){S.cash-=c;lv(gi)[k]++}}}
else if(a==='susp'){const i=+t.dataset.v;if(S.own.includes(gi)&&Number.isInteger(i)&&i>=0&&i<SUSPENSIONS.length){const price=modPrice(gi,SUSPENSIONS[i].price);if(S.cash>=price){S.cash-=price;S.suspension[gi]=i;frontSusp.comp=0;frontSusp.vel=0;rearSusp.comp=0;rearSusp.vel=0}}}
else if(a==='mount'){const tier=+t.dataset.v,price=mountPrice(gi,tier)-(S.boostMount[gi]?mountPrice(gi,Number(S.boostMount[gi])):0);if(S.own.includes(gi)&&(tier===1||tier===2)&&tier>Number(S.boostMount[gi]||0)&&S.cash>=price){S.cash-=price;S.boostMount[gi]=tier;boostE=100}}
else if(a==='hack'){const price=hackPrice(gi),currentRank=hackRank(gi);if(S.own.includes(gi)&&currentRank<HACK_RARITIES.length-1&&S.cash>=price){S.cash-=price;const roll=Math.random()*100;let total=0,rolled=HACK_RARITIES[HACK_RARITIES.length-1];for(const candidate of HACK_RARITIES){total+=candidate.chance;if(roll<total){rolled=candidate;break}}const rank=HACK_RARITIES.indexOf(rolled);if(rank>currentRank){S.hacks[gi]=rolled.id;pop(rolled.id==='secret'?'SECRET HACK · ALL STATS FULLY MAXED!':`${rolled.name.toUpperCase()} HACK · +${Math.round(rolled.boost*100)}%`,'#4ade80')}else pop(`${rolled.name.toUpperCase()} ROLL · CURRENT UPGRADE KEPT`,'#facc15')}}
else if(a==='buyhelmet'){const i=+t.dataset.i,h=HELMETS[i];if(S.cash>=h.pr){S.cash-=h.pr;S.helmetOwn.push(i);S.helmet=i;setBike(gi);pop('HELMET ACQUIRED · '+h.n,'#c0f56a')}}
else if(a==='eqhelmet'){const i=+t.dataset.i;if((S.helmetOwn||[]).includes(i))S.helmet=i;setBike(gi)}
save();rg()};
G.onchange=e=>{if(e.target.id==='gar-price'){garPrice=e.target.value;rg()}};
$('bg').onclick=()=>tg(!gOpen);$('host').onclick=()=>{const i=Math.floor(Math.random()*RIDEOUT_SPOTS.length);hostRideout(i)};$('sp').onclick=()=>{units=!units;S.units=units?1:0;save()};
setTimeout(()=>$('help').remove(),15000);
/* ---------- HUD draw ---------- */
const mm=$('mm'),mx=mm.getContext('2d'),wm=$('wm'),wx=wm.getContext('2d');
function setMapExpanded(expanded){mm.classList.toggle('expanded',expanded);mm.setAttribute('aria-expanded',String(expanded));mm.setAttribute('aria-label',expanded?'Collapse player map':'Expand player map')}
mm.addEventListener('click',()=>setMapExpanded(!mm.classList.contains('expanded')));
mm.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();setMapExpanded(!mm.classList.contains('expanded'))}else if(e.key==='Escape'){e.stopPropagation();setMapExpanded(false)}});
let mmZoom=1;const mmZoomBtn=$('mm-zoom');
if(mmZoomBtn)mmZoomBtn.addEventListener('click',()=>{mmZoom=mmZoom===1?2:mmZoom===2?5:1;mmZoomBtn.textContent=mmZoom+'×'});
function drawMM(){const px=riding?x:ox,pz=riding?z:oz,heading=riding?h:oh,k=1.5/mmZoom,sh=Math.sin(heading),ch=Math.cos(heading),P=(wx_,wz)=>{const dx=wx_-px,dz=wz-pz;return[150+(-dx*ch+dz*sh)*k,150-(dx*sh+dz*ch)*k]};
mx.fillStyle='#3d5a3a';mx.fillRect(0,0,300,300);mx.fillStyle='#50545c';mx.beginPath();[[-12,-1200],[12,-1200],[12,1200],[-12,1200]].forEach(([a,b],i)=>{const q=P(a,pz+b);i?mx.lineTo(q[0],q[1]):mx.moveTo(q[0],q[1])});mx.fill();
const expanded=mm.classList.contains('expanded');
nbr(px,pz,c=>{mx.fillStyle='#8d96a5';c.cols.forEach(q=>{const s=P(q.x,q.z);mx.fillRect(s[0]-4,s[1]-4,8,8)});mx.fillStyle='#fbbf24';c.ramps.forEach(q=>{const s=P(q.x,q.z);mx.fillRect(s[0]-4,s[1]-4,8,8)});mx.fillStyle='#7d8ba0';c.bld.forEach(q=>{const s=P(q.x,q.z);mx.fillRect(s[0]-q.w/2-4,s[1]-q.h/2-4,q.w+8,q.h+8)});mx.fillStyle='#3ddc74';c.trees.forEach(q=>{const s=P(q.x,q.z);mx.beginPath();mx.arc(s[0],s[1],3,0,7);mx.fill()})});
mx.font=expanded?'bold 13px system-ui':'bold 18px system-ui';mx.textAlign='center';
const dot=(X,Z,col,n)=>{const s=P(X,Z),off=s[0]<6||s[0]>294||s[1]<6||s[1]>294,sx=Math.max(10,Math.min(290,s[0])),sy=Math.max(10,Math.min(290,s[1]));mx.fillStyle=col;mx.strokeStyle='#000';mx.lineWidth=2;
if(off){const ang=Math.atan2(s[1]-150,s[0]-150);mx.save();mx.translate(sx,sy);mx.rotate(ang);mx.beginPath();mx.moveTo(11,0);mx.lineTo(-6,6);mx.lineTo(-6,-6);mx.closePath();mx.fill();mx.stroke();mx.restore()}else{mx.beginPath();mx.arc(sx,sy,7,0,7);mx.fill();mx.stroke()}
if(n){const text=expanded?`${n} · ${Math.round(X)}, ${Math.round(Z)}`:n,half=mx.measureText(text).width/2,tx=Math.max(half+4,Math.min(296-half,sx)),ty=Math.max(15,sy-11);mx.fillStyle='#fff';mx.strokeText(text,tx,ty);mx.fillText(text,tx,ty)}};
for(const r of rem.values())dot(r.onFoot?r.px:r.x,r.onFoot?r.pz:r.z,r.col,r.n||'');
cops.forEach(q=>{if(q.c.g.visible)dot(q.x,q.z,((tt*6)|0)%2?'#ff2222':'#2f6bff',wanted?'POLICE':'')});
mx.fillStyle='#fff';mx.strokeStyle='#000';mx.beginPath();mx.moveTo(150,134);mx.lineTo(160,160);mx.lineTo(150,154);mx.lineTo(140,160);mx.closePath();mx.fill();mx.stroke();
if(expanded&&joined){const text=`${riderName} · ${Math.round(px)}, ${Math.round(pz)}`;mx.font='bold 13px system-ui';mx.fillStyle='#fff';mx.strokeStyle='#000';mx.textAlign='center';mx.strokeText(text,150,181);mx.fillText(text,150,181)}}
function drawWM(f){if(!riding||Math.abs(v)<.4){wm.style.opacity=0;return}wm.style.opacity=1;wx.clearRect(0,0,240,130);const frac=Math.max(0,Math.min(1,f)),col=boosting?'#c084fc':frac<.6?'#22c55e':frac<.85?'#facc15':'#ef4444';
const a=Math.PI+Math.PI*frac;
wx.beginPath();wx.strokeStyle='rgba(148,163,184,.3)';wx.lineWidth=12;wx.arc(120,120,90,Math.PI,Math.PI+Math.PI);wx.stroke();
wx.beginPath();wx.strokeStyle=col;wx.lineWidth=boosting?16:12;wx.shadowColor=col;wx.shadowBlur=boosting?16:8;wx.stroke();
for(let i=0;i<=10;i++){const t=i/10,ta=Math.PI+Math.PI*t,maj=i%5===0;wx.beginPath();wx.moveTo(120+Math.cos(ta)*(maj?84:78),120+Math.sin(ta)*(maj?84:78));wx.lineTo(120+Math.cos(ta)*(maj?96:90),120+Math.sin(ta)*(maj?96:90));wx.strokeStyle=maj?'rgba(226,238,220,.55)':'rgba(148,163,184,.22)';wx.lineWidth=maj?2:1;wx.stroke()}
wx.beginPath();wx.strokeStyle='rgba(2,6,23,.55)';wx.lineWidth=7;wx.moveTo(120,120);wx.lineTo(120+Math.cos(a)*70,120+Math.sin(a)*70);wx.stroke();
wx.beginPath();wx.strokeStyle='rgba(255,255,255,.92)';wx.lineWidth=4;wx.moveTo(120,120);wx.lineTo(120+Math.cos(a)*82,120+Math.sin(a)*82);wx.stroke();wx.shadowBlur=0;
wx.beginPath();wx.fillStyle=col;wx.arc(120,120,7,0,7);wx.fill()}
/* ---------- main loop ---------- */
function resize(){R.setPixelRatio(GFX[GFXP].dpr);if(composer)composer.setPixelRatio(R.getPixelRatio());R.setSize(innerWidth,innerHeight,false);if(composer)composer.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;vo()}addEventListener('resize',resize);resize();
try{loadChunks(0,0);}catch(e){console.error('loadChunks failed:',e)}let last=performance.now();const tv=new T.Vector3();
function loop(now){requestAnimationFrame(loop);const dt=settingsOpen?0:Math.min(.05,(now-last)/1000);last=now;tt+=dt;padCooldown=Math.max(0,padCooldown-dt);
const k=c=>joined&&keys[c],bikeKey=c=>riding&&k(c),thr=bikeKey('KeyW')||bikeKey('ArrowUp')?1:0,br=bikeKey('KeyS')||bikeKey('ArrowDown')?1:0,st=((bikeKey('KeyD')||bikeKey('ArrowRight'))?1:0)-((bikeKey('KeyA')||bikeKey('ArrowLeft'))?1:0),pull=bikeKey('ShiftLeft')||bikeKey('ShiftRight')?1:0,stoppyMan=pull&&br&&v>2,burnout=thr&&br&&Math.abs(v)<1.2;
const mountTier=Number(S.boostMount[S.eq]||0),boostTier=mountTier,hasBoost=boostTier>0,bo=bikeKey('KeyE')&&hasBoost;
const E=eff(S.eq),kit=SUSPENSIONS[Number(S.suspension[S.eq]||0)]||SUSPENSIONS[0],zw=.05+.007*E[2];let sparks=0,skid=0,frontLoad=0,rearLoad=0;
if(bounceRequested){frontSusp.vel=Math.max(frontSusp.vel,1.6);rearSusp.vel=Math.max(rearSusp.vel,1.5);bounceRequested=false}
let vmax=25;if(gOpen){ga+=dt*.5;y=gH(x,z);boosting=false;walkSpeed=0}
else if(!riding){
boosting=false;pad=Math.max(0,pad-dt);
const forward=(k('KeyW')||k('ArrowUp')?1:0)-(k('KeyS')||k('ArrowDown')?1:0),side=(k('KeyD')||k('ArrowRight')?1:0)-(k('KeyA')||k('ArrowLeft')?1:0),mag=Math.hypot(forward,side),speed=4.5;
walkSpeed=mag?speed:0;const norm=mag||1;
ox+=(Math.sin(oh)*forward+Math.cos(oh)*side)/norm*walkSpeed*dt;
oz+=(Math.cos(oh)*forward-Math.sin(oh)*side)/norm*walkSpeed*dt;
nbr(ox,oz,c=>{for(const q of c.cols)if(oy<=q.h&&Math.abs(ox-q.x)<q.hw+.3&&Math.abs(oz-q.z)<q.hd+.3){const px=q.hw+.3-Math.abs(ox-q.x),pz=q.hd+.3-Math.abs(oz-q.z);if(px<pz)ox+=Math.sign(ox-q.x||1)*px;else oz+=Math.sign(oz-q.z||1)*pz}});
oy=gH(ox,oz);walkCycle+=dt*walkSpeed*2.6;
walker.g.position.set(ox,oy,oz);walker.g.rotation.y=oh;
const gait=walkSpeed?Math.sin(walkCycle)*.55:0;walker.arms[0].rotation.x=gait;walker.arms[1].rotation.x=-gait;walker.legs[0].rotation.x=-gait;walker.legs[1].rotation.x=gait;
}
else if(wreck>0){wreck-=dt;v*=Math.exp(-2*dt);x+=Math.sin(h)*v*dt;z+=Math.cos(h)*v*dt;if(wreck<=0){wreck=0;v=0;p=0;pw=0;air=false;airFlip=0;airRoll=0;wheelieHold=0;vy=0;y=gH(x,z);camInit=true}}
else{
boosting=!!bo&&boostE>1;
if(boosting){boostE=Math.max(0,boostE-dt*30/(.6+E[3]*.14));earn(dt*6)}else if(hasBoost)boostE=Math.min(100,boostE+dt*(5+E[3]*1.4));else boostE=0;
if(pad>0)pad-=dt;
const bike=BIKES[S.eq],motorScale=1+Math.min(.45,Math.max(0,E[0]/bike.s[0]-1)*.2),vmax0=(bike.maxMph/2.237)*motorScale*(boosting?(boostTier>1?1.55:1.28):1)*(pad>0&&hasBoost?1.2:1);vmax=Number.isFinite(vmax0)?vmax0:25;
if(thr){
  if(burnout)v=0;
  else if(v<0)v+=(3+E[1]*.45)*1.4*dt;
  else v+=(3+E[1]*.45)*1.35*Math.pow(1-Math.min(1,v/vmax),.62)*dt; /* pulls all the way to the advertised top speed */
}
if(boosting)v+=(8+E[3]*1.3)*dt*(1-v/(vmax*1.1));
if(pad>0&&hasBoost)v+=14*dt;
if(v>vmax)v-=(v-vmax)*1.2*dt;
if(!thr)v-=v*.05*dt+Math.sign(v)*.4*dt;if(Math.abs(v)<.05&&!thr&&!br&&!burnout)v=0;
if(br){if(v>.2){v-=16*dt;if(v<0)v=0;skid=v>6&&!air?1:0}else if(burnout){v=0;skid=1}else{v-=2.6*dt;if(v<-.35*vmax)v=-.35*vmax;skid=0}}
if(!Number.isFinite(v))v=0;
const lift=Math.min(1,Math.abs(v)/5),wh=p>.1?1:0;
const wheelieMult=1/(1+Math.log10(Math.max(1,bike.pr/2500))*0.3);
const stoppy=stoppyMan?2.2:(br&&v>2.5&&p<=0.4&&!stoppyMan?Math.min(1,v/18)*2.2:0);
if(burnout){skid=1;sparks=1;if(Math.floor(tt*40)%3===0){emit(new T.Vector3(x-Math.sin(h)*me.wb*.5,me.wr*.9,z-Math.cos(h)*me.wb*.5),-Math.sin(h)*2+(Math.random()-0.5)*2,Math.random()*1.5+1,-Math.cos(h)*2+(Math.random()-0.5)*2,.35,.8,.8,.7,.15);earn(dt*8)}}
const a=(pull&&v>0.5?(pull*3.2*wheelieMult+(boosting?.8:0))*lift:0)-3.6*p-1.9*pw-br*8*(p>0?1:0)-(stoppy>0?stoppy:0)+(Math.sin(tt*1.7)+.7*Math.sin(tt*2.9+1))*.3*(1-E[2]*.04)*wh;
pw+=a*dt;const prevP=p;p+=pw*dt;
if(p>2.2){p=2.2;pw=Math.min(0,pw)}
if(p<-1.0){p=-1.0;pw=Math.max(0,pw)}
if(Math.abs(p)<.05&&Math.abs(pw)<.05&&!pull&&!br&&!stoppy){p=0;pw=0}
if(prevP>0&&p<=0){const wheelieH=Math.max(0,prevP),imp=Math.min(12,Math.abs(v)*0.6);const fc=Math.min(kit.frontTravel,imp*.035+wheelieH*Math.max(0,kit.frontTravel)*.5),rc=Math.min(kit.rearTravel,imp*.03+wheelieH*Math.max(0,kit.rearTravel)*.5);frontSusp.comp=Math.max(frontSusp.comp,fc);rearSusp.comp=Math.max(rearSusp.comp,rc);frontSusp.vel=Math.max(frontSusp.vel,Math.min(6,imp*.35+wheelieH*1.5));rearSusp.vel=Math.max(rearSusp.vel,Math.min(6,imp*.4+wheelieH*1.5))}
if(prevP<0&&p>=0){pw=Math.max(0,pw);earn(25);pop('STOPPY LANDED · +$25','#4ade80');if(questStage===1){questStage=2;qDone(1)}}
earn(dt*Math.max(0,v)*.12);
if(!air&&Math.abs(v)>5&&onTrail(x,z)&&Math.random()<dt*26){const dx2=x-Math.sin(h)*me.wb*.5,dz2=z-Math.cos(h)*me.wb*.5;emit(new T.Vector3(dx2,me.wr*.9,dz2),(Math.random()-.5)*1.4,.5+Math.random()*1.3,(Math.random()-.5)*1.4,.55,.34,.24,.14,.55)}
if(p>.15){wt+=dt;if(Math.abs(p-.8)<zw)zt+=dt;else zt=Math.max(0,zt-dt*1.5);cb=Math.min(3,1+zt*.9);earn(dt*(6+6*p)*Math.floor(cb));if(p>1.22){sparks=1;earn(dt*30*Math.floor(cb))}}else{wt=0;zt=0;cb=1}
if(pull&&p>.15)wheelieHold+=dt;else wheelieHold=Math.max(0,wheelieHold-dt*2.5);
if(wheelieHold>3.0&&wheelieHold-dt<=3.0)pop('EASE OFF THE WHEELIE!','#facc15');
wzone=pull&&p>0?(wheelieHold>3.8?2:wheelieHold>3.0?1:0):0;
if(p>1.45||wheelieHold>3.8){const heldTooLong=wheelieHold>3.8;wreck=1.7;wt=0;zt=0;cb=1;wheelieHold=0;pop(heldTooLong?'WHEELIE OVERHELD!':'WIPEOUT!','#f43f5e')}
if(trick){trickT+=dt;if(trickT>0.9){const pts=Math.round(60+Math.abs(v)*45);earn(pts);pop('HAND SCRAPE · +$'+pts,'#facc15');trick=null;cb=1}}
h-=st*(2.3/(1+Math.abs(v)*.035))*(p>.2?.6+.05*E[2]:1)*(v<0?-1:1)*dt*Math.max(1,Math.min(2,Math.abs(v)/1.5));
roll+=(st*.4*Math.min(1,Math.abs(v)/10)-roll)*Math.min(1,8*dt);
x+=Math.sin(h)*v*dt;z+=Math.cos(h)*v*dt;
nbr(x,z,c=>{for(const q of c.cols)if(y<=q.h&&Math.abs(x-q.x)<q.hw&&Math.abs(z-q.z)<q.hd){const px=q.hw-Math.abs(x-q.x),pz=q.hd-Math.abs(z-q.z);if(px<pz)x+=Math.sign(x-q.x||1)*px;else z+=Math.sign(z-q.z||1)*pz;}});
const gh=gH(x,z),rd=gH.sl*(Math.sin(h)*gH.e[0]+Math.cos(h)*gH.e[1]);
const onSw=Math.abs(x)>12&&Math.abs(x)<15.05;
if(onSw!==prevOnSw){prevOnSw=onSw;const imp=Math.min(3.2,Math.abs(v)*.18);frontSusp.vel=Math.max(frontSusp.vel,imp);rearSusp.vel=Math.max(rearSusp.vel,imp*.85)}
if(air){
const flipInput=(k('KeyW')||k('ArrowUp')?1:0)-(k('KeyS')||k('ArrowDown')?1:0),rollInput=(k('KeyD')||k('ArrowRight')?1:0)-(k('KeyA')||k('ArrowLeft')?1:0);
airFlip+=flipInput*6.2*dt;airRoll+=rollInput*7.2*dt;
vy-=22*dt;y+=vy*dt;airT+=dt;
if(airT>5){air=false;y=gh;vy=0;airT=0;airFlip=0;airRoll=0;pop('UNSTUCK · respawned','#facc15')}
if(y<=gh){
y=gh;air=false;const impact=Math.abs(vy);frontSusp.comp=Math.max(frontSusp.comp,Math.min(kit.frontTravel,impact*.035));rearSusp.comp=Math.max(rearSusp.comp,Math.min(kit.rearTravel,impact*.03));frontSusp.vel=Math.max(frontSusp.vel,Math.min(6,impact*.35));rearSusp.vel=Math.max(rearSusp.vel,Math.min(6,impact*.4));
if(airT>.6){const b=Math.floor(airT*60);earn(b);pop('AIR TIME +$'+b,'#38bdf8')}
const phase=q=>Math.atan2(Math.sin(q),Math.cos(q)),flips=Math.floor(Math.abs(airFlip)/(2*PI)),rolls=Math.floor(Math.abs(airRoll)/(2*PI)),failed=Math.abs(phase(airFlip))>.5||Math.abs(phase(airRoll))>.5;
if(failed){wreck=1.7;wt=0;zt=0;cb=1;pop('TRICK LANDING FAILED!','#f43f5e')}
else if(flips||rolls){const reward=flips*180+rolls*160;earn(reward);const tricks=[];if(flips)tricks.push(`${flips}× ${airFlip>0?'BACKFLIP':'FRONTFLIP'}`);if(rolls)tricks.push(`${rolls}× BARREL ROLL`);pop(`${tricks.join(' + ')} +$${reward}`,'#facc15');if(questStage===0){questStage=1;qDone(0)}}
airT=0;vy=0;airFlip=0;airRoll=0
}else if(y-gh>1){air=true;vy=0;airFlip=0;airRoll=0;airT=0;earn(dt*20)}
}
else{if(lastGH>gh+.25&&v>3){airFlip=0;airRoll=0;air=true;vy=Math.max(0,lastRd*v);y=lastGH}else y=gh}
if(!air&&wreck<=0&&y>gh+0.01){y=gh;vy=0;}
lastGH=gh;lastRd=rd;
for(const c of portCraft){const u=c.userData;c.position.x+=u.vel.x*dt;c.position.z+=u.vel.z*dt;c.position.y=0.18+Math.sin(tt*2+u.phase)*0.015;c.rotation.y=Math.atan2(u.vel.x,u.vel.z)}
for(const c of chunks.values())for(const p of c.peds){const sp=p.speed||.6;p.phase+=dt*sp*5.2;p.z+=p.dir*sp*dt;if(p.z-p.home>40||p.z-p.home<-40){p.dir*=-1;p.z+=p.dir*sp*dt*2}p.g.position.set(p.x,p.y,p.z);p.g.rotation.y=p.dir>0?0:PI;const stride=Math.sin(p.phase)*.55;p.arms[0].rotation.x=stride;p.arms[1].rotation.x=-stride;p.legs[0].rotation.x=-stride;p.legs[1].rotation.x=stride;const d=Math.hypot(x-p.x,z-p.z);if(d<1.2&&!wreck&&Math.abs(v)>1){wreck=1.7;wanted=3;chaseT=15;earn(-100);pop('PED HIT · -$100 · COPS','#f43f5e')}}
if(wreck>0){/* wipeout just began */}
}
if(!gOpen){stepSuspension(frontSusp,kit.frontSpring,kit.frontDamping,kit.frontTravel,dt,frontLoad);stepSuspension(rearSusp,kit.rearSpring,kit.rearDamping,kit.rearTravel,dt,rearLoad)}
/* chunks & sun & sky */
const worldX=riding?x:ox,worldZ=riding?z:oz,pcx=Math.round(worldX/S_),pcz=Math.round(worldZ/S_);if(loadChunks.k!==pcx+','+pcz){loadChunks.k=pcx+','+pcz;loadChunks(worldX,worldZ)}
tod=(tod+dt/DAY_LEN)%24;const daylight=Math.max(0,Math.min(1,(1-Math.cos(tod/12*Math.PI))/2));skyMaterial.uniforms.daylight.value=daylight;sun.position.set(worldX+60+Math.cos(tod*2*Math.PI)*45,95,worldZ+40+Math.sin(tod*2*Math.PI)*45);sun.target.position.set(worldX,0,worldZ);sun.intensity=2.2*daylight+0.25;hemi.intensity=0.2+0.8*daylight;const nightF=Math.max(0,1-daylight);const nf=Math.min(1,nightF*1.6);lampM.emissiveIntensity=.15+1.9*nf;streetGlowM.opacity=Math.min(.6,nf*.6);for(const c of chunks.values())for(const L of c.lights)L.intensity=nf*45;for(const m of BM)m.emissiveIntensity=nf*1.2;if(me.beam)me.beam.intensity=nf*160;scene.fog.color.copy(FOG_N).lerp(FOG_D,daylight);skyMaterial.uniforms.sunDir.value.copy(sun.position).sub(sun.target.position).normalize();skyMaterial.uniforms.warm.value=Math.max(0,1-Math.abs(daylight*2-1)*1.7);
if(!gOpen&&!settingsOpen)updCops(dt);
/* rig pose */
pose(me,x,y,z,h,roll,p+airFlip,v,dt,frontSusp.comp*1.1,rearSusp.comp*1.1,airRoll);
if(wreck>0){const t=Math.min(1,(1.7-wreck)*2.4);me.P.rotation.x=-p*(1-t);me.P.rotation.z=1.24*t;me.R.position.set(.55*t,Math.max(-.25,.5*t-.45*t*t),-.45*t);me.R.rotation.set(-.85*t,0,.55*t)}else{me.R.position.set(0,0,0);me.R.rotation.set(0,0,0)}
me.glow.visible=boosting||pad>0&&hasBoost;if(me.glow.visible)me.glow.scale.setScalar(1+Math.sin(tt*40)*.25);
me.g.updateMatrixWorld(true);
if(sparks){tv.set(0,.1,-.55);me.P.localToWorld(tv);for(let i=0;i<4;i++)emit(tv,-Math.sin(h)*v*.3+(Math.random()-.5)*3,Math.random()*3+1,-Math.cos(h)*v*.3+(Math.random()-.5)*3,.5,1,.6+Math.random()*.3,.1,9)}
if(boosting||pad>0&&hasBoost){tv.set(0,.3,-.3);me.P.localToWorld(tv);for(let i=0;i<3;i++)emit(tv,-Math.sin(h)*8+(Math.random()-.5)*1.5,Math.random()*.6,-Math.cos(h)*8+(Math.random()-.5)*1.5,.45,.5+Math.random()*.3,.3,1,0)}
stepP(dt);
/* camera */
if(gOpen){cam.position.set(x+Math.cos(ga)*4.2,y+1.6,z+Math.sin(ga)*4.2);cam.lookAt(x,y+.7,z);cam.fov=45}
else if(!riding){const tx=ox-Math.sin(oh)*5.2,tz=oz-Math.cos(oh)*5.2,ty=oy+2.35;
if(camInit){cam.position.set(tx,ty,tz);camInit=false}else{const kk=1-Math.exp(-7*dt);cam.position.x+=(tx-cam.position.x)*kk;cam.position.y+=(ty-cam.position.y)*kk;cam.position.z+=(tz-cam.position.z)*kk}
cam.lookAt(ox+Math.sin(oh)*.6,oy+1.25+Math.tan(opitch)*4,oz+Math.cos(oh)*.6);cam.fov+=(68-cam.fov)*Math.min(1,5*dt)}
else{const cameraH=h+lookYaw,cd=7+Math.abs(v)*.04,tx=x-Math.sin(cameraH)*cd,tz=z-Math.cos(cameraH)*cd,ty=y+3+p*.6;
if(camInit){cam.position.set(tx,ty,tz);camInit=false}else{const kk=1-Math.exp(-6*dt);cam.position.x+=(tx-cam.position.x)*kk;cam.position.y+=(ty-cam.position.y)*kk;cam.position.z+=(tz-cam.position.z)*kk}
cam.lookAt(x+Math.sin(cameraH)*4,y+1.2+p*1.2+Math.tan(lookPitch)*3,z+Math.cos(cameraH)*4);
const tf=62+Math.min(14,Math.abs(v)*.25)+(boosting?10:0);cam.fov+=(tf-cam.fov)*Math.min(1,5*dt)}
cam.updateProjectionMatrix();sky.position.copy(cam.position);
/* remotes */
const kk=1-Math.exp(-12*dt),nowt=performance.now();
for(const[id,r]of rem){if(nowt-r.seen>9000){if(r.rig)scene.remove(r.rig.g);scene.remove(r.walker.g);rem.delete(id);continue}if(!r.rig)continue;
r.x+=(r.tx-r.x)*kk;r.y+=(r.ty-r.y)*kk;r.z+=(r.tz-r.z)*kk;r.p+=(r.tp-r.p)*kk;r.r+=(r.tr-r.r)*kk;r.v=r.tv;let d=r.th-r.h;d=Math.atan2(Math.sin(d),Math.cos(d));r.h+=d*kk;
r.px+=(r.tpx-r.px)*kk;r.py+=(r.tpy-r.py)*kk;r.pz+=(r.tpz-r.pz)*kk;r.afp+=(r.tfp-r.afp)*kk;r.afr+=(r.tfr-r.afr)*kk;r.fc+=(r.tfc-r.fc)*kk;r.rc+=(r.trc-r.rc)*kk;let wd=r.tph-r.ph;wd=Math.atan2(Math.sin(wd),Math.cos(wd));r.ph+=wd*kk;r.walker.g.position.set(r.px,r.py,r.pz);r.walker.g.rotation.y=r.ph;r.walker.g.visible=r.onFoot;r.rig.g.visible=!r.onFoot;pose(r.rig,r.x,r.y,r.z,r.h,r.r,r.p+r.afp,r.v,dt,r.fc,r.rc,r.afr)}
/* network send runs on the interval below so a hidden tab keeps publishing */
/* audio */
if(AC&&mo1){const t=AC.currentTime,sp=Math.abs(v),bs=boosting?1:0;mo1.frequency.setTargetAtTime(55+sp*6+bs*40,t,.05);mo2.frequency.setTargetAtTime(300+sp*26+bs*200,t,.05);
mgn.gain.setTargetAtTime(gOpen?.02:.04+.07*thr+Math.min(.04,sp*.001),t,.05);ng.scr.gain.setTargetAtTime(skid?.25:0,t,.05);ng.spk.gain.setTargetAtTime(sparks?.18:0,t,.03);ng.bst.gain.setTargetAtTime(bs?.22:0,t,.1);const nd=Math.min(...cops.map(q=>q.d));sir.frequency.setTargetAtTime(900+300*Math.sin(tt*7),t,.02);sg.gain.setTargetAtTime(wanted?.07*Math.max(.2,1-nd/200):0,t,.1)}
/* HUD */
if(S.cash!==undefined){$('cash-value').textContent='$'+Math.floor(S.cash).toLocaleString()}
$('rideout').textContent=rideTier>=0?`${RIDEOUTS[rideTier].n} · MONEY BOUNCED ${RIDEOUTS[rideTier].mult}×`:'NO RIDEOUT HOSTED';
$('quest').textContent=quest?quest.n+' · '+quest.t+' · +$'+quest.cash:'';
const qs=$('quest-select');if(qs&&!qs.dataset.ready){qs.dataset.ready='1';qs.innerHTML=QUESTS.map((q,i)=>`<option value="${i}"${i===questStage?' selected':''}>${q.n}</option>`).join('');qs.onchange=()=>{const i=+qs.value;const q=QUESTS[i];quest=q;questCash=0;$('quest').textContent=quest?quest.n+' · '+quest.t+' · +$'+quest.cash:''}}
const hourF=Math.floor(tod),clockPhase=hourF<6||hourF>=20?'NIGHT':hourF<8?'DAWN':hourF<18?'DAY':hourF<20?'DUSK':'NIGHT';
$('clock').textContent=String(hourF).padStart(2,'0')+':'+String(Math.floor((tod-hourF)*60)).padStart(2,'0')+' · '+clockPhase;
$('combo').textContent=trick?`TRICK · ${trick==='handscrape'?'HAND SCRAPE':'TRICK'}`:(burnout?`BURNOUT · rear spinning`:(p>.15&&wreck<=0?`WHEELIE ${wt.toFixed(1)}s  ×${Math.floor(cb)}`:(p<-.25&&wreck<=0?`STOPPY · front down`:(wreck>0?'WIPEOUT!':''))));
$('sp').innerHTML=riding?(v<-0.1?'REV ':'')+'<span class="spd-num">'+Math.round(Math.abs(v)*(units?3.6:2.237))+'</span><small>'+(units?'KM/H':'MPH')+'</small>':`<small>ON FOOT · ${walkSpeed?'WALKING':'IDLE'}</small>`;
$('bb').style.width=hasBoost?boostE+'%':'0%';$('boost-note').textContent=hasBoost?'BOOST [E] · tap speed for units':'NO BOOST MOUNT · MOD SHOP';
const stale=online?[...rem.values()].filter(r=>r.ver!==VERSION).length:0;
$('net').textContent=online?`Connected: ${1+rem.size} rider${rem.size?'s':''} online${stale?` · ${stale} on another version`:''}${rem.size?` · ${[...rem.values()].map(r=>r.n||'Rider').join(', ')}`:''}`:networkText;
$('wanted').textContent=wanted?`🚨 WANTED · LEVEL ${wanted} · ${chaseT.toFixed(0)}s${escT>0?' · losing them':''}`:heat>.08?`🚔 POLICE ALERT ${Math.round(heat/1.35*100)}%`:'';
$('sl').style.opacity=boosting?.9:Math.max(0,Math.min(.5,(Math.abs(v)-32)/40));
pt+=dt;svT+=dt;if(svT>3){svT=0;save()}
drawMM();drawWM(Math.min(1,Math.abs(v)/vmax));
const htx=hCanvas.getContext('2d');htx.fillStyle='#05070c';htx.fillRect(0,0,512,128);htx.fillStyle='#8ff';htx.font='bold 24px monospace';htx.textAlign='center';htx.fillText('MM '+Math.round(Math.abs(v)*(S.units?3.6:2.237)),256,32);htx.fillStyle='#fff';htx.font='bold 22px monospace';htx.fillText('BAT '+Math.round(15+((tt*13)%70))+'%',256,60);htx.fillStyle='#ffd27a';htx.font='bold 22px monospace';htx.fillText(['ECO','DRIVE','SPORT'][(Math.floor(tt*0.5))%3],256,88);hTex.needsUpdate=true;
if(composer){composer.render()}else{R.render(scene,cam)}}
/* A timer keeps publishing when requestAnimationFrame is paused (background tab), which is why riders used to vanish. */
function publishNet(){if(!(cli&&online&&joined))return;try{cli.publish(ROOM+'/s',JSON.stringify({i:ID,n:riderName,ver:VERSION,x:+x.toFixed(2),y:+y.toFixed(2),z:+z.toFixed(2),h:+h.toFixed(3),p:+p.toFixed(3),r:+roll.toFixed(3),v:+v.toFixed(1),b:S.eq,c:MYC,on:!riding,px:+ox.toFixed(2),py:+oy.toFixed(2),pz:+oz.toFixed(2),ph:+oh.toFixed(3),fp:air?+airFlip.toFixed(3):0,fr:air?+airRoll.toFixed(3):0,fc:+frontSusp.comp.toFixed(3),rc:+rearSusp.comp.toFixed(3),hm:S.helmet}),{qos:0})}catch(e){console.error('MQTT publish failed:',e)}}
setInterval(publishNet,150);
addEventListener('beforeunload',save);document.addEventListener('visibilitychange',save);
addEventListener('error',e=>{if(e.target&&e.target.tagName==='SCRIPT'&&/game\.js/.test(e.target.src||''))return;window.WheelieXLoading?.fail(e.message||'Game engine error')},true);
requestAnimationFrame(loop);
window.WheelieXLoading?.finish();
