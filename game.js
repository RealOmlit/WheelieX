import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
const $=id=>document.getElementById(id),PI=Math.PI;
/* ---------- save ---------- */
let S;try{S=JSON.parse(localStorage.getItem('ebl1'))}catch(e){}
S=S||{cash:0,own:[0],eq:0,up:{},houses:[]};S.suspension=S.suspension||{};S.boostMount=S.boostMount||{};S.hacks=S.hacks||{};S.houses=S.houses||[];
S.units=S.units==null?1:!!S.units;S.accessibility={reducedMotion:!!S.accessibility?.reducedMotion,largeText:!!S.accessibility?.largeText,highContrast:!!S.accessibility?.highContrast};
const resetLegacyBoost=!!(S.overclock||S.hackedStats);
delete S.overclock;
delete S.hackedStats;
S.policeDifficulty=['easy','medium','hard','insane','death'].includes(S.policeDifficulty)?S.policeDifficulty:'medium';
const acc=S.accessibility||{};
document.body.classList.toggle('a11y-reduced-motion',!!acc.reducedMotion);
document.body.classList.toggle('a11y-large-text',!!acc.largeText);
document.body.classList.toggle('a11y-high-contrast',!!acc.highContrast);
const save=()=>{try{localStorage.setItem('ebl1',JSON.stringify(S))}catch(e){}};
if(resetLegacyBoost)save();
/* ---------- bikes ---------- */
const B=(n,pr,s,c,a,f,sc,wr,tw,wb,bw,bh,sl,sy,hb,fh,maxMph,kind='bike')=>({n,pr,s,c,a,f,sc,wr,tw,wb,bw,bh,sl,sy,hb,fh,maxMph,kind});
const BIKES=[
B('City E-Cruiser',0,[3,3,8,2],0x2563eb,0xdc2626,0xaaaaaa,0x222222,.31,.07,1.18,.32,.32,.6,.62,.22,0,25),
B('Super73 RX Mojave',1200,[4,4,8,3],0x56603a,0xd9b97a,0x888888,0xc49a63,.255,.11,1.25,.28,.26,.95,.52,.45,0,28),
B('Talaria XXX',3000,[5,5,7,4],0x111111,0x333333,0x555555,0x111111,.28,.09,1.3,.2,.3,.6,.7,.1,0,47),
B('Sur-Ron Hyper Bee',4500,[5,6,7,4],0xef4444,0x111111,0xcccccc,0x111111,.23,.08,1.15,.2,.26,.5,.64,.12,0,34),
B('Sur-Ron Light Bee X',7000,[6,6,7,5],0x1c1c1c,0xfacc15,0xfacc15,0x111111,.27,.09,1.28,.2,.28,.55,.66,.12,0,47),
B('Talaria Sting R MX4',12000,[7,7,6,6],0x0ea5e9,0x111111,0xd4d4d8,0x111111,.29,.1,1.34,.22,.3,.55,.7,.14,1,55),
B('E Ride Pro SS 2.0',16000,[8,8,6,7],0x7c3aed,0x111111,0xa78bfa,0x111111,.3,.11,1.32,.24,.3,.6,.66,.12,0,62),
B('Segway X260',9500,[6,7,8,5],0xf5f5f5,0x111111,0x999999,0x222222,.29,.09,1.37,.24,.32,.62,.74,.15,1,46),
B('CAKE Kalk INK',22000,[8,7,9,7],0xf8fafc,0x111111,0xdddddd,0x111111,.28,.08,1.33,.22,.3,.55,.68,.1,0,28),
B('Sur-Ron Ultra Bee',32000,[9,9,7,8],0x1f2937,0x22d3ee,0x22d3ee,0x111111,.31,.11,1.4,.26,.32,.6,.72,.14,1,59),
B('Sur-Ron Storm Bee',40000,[9,10,6,9],0x0f172a,0xf59e0b,0xf59e0b,0x111111,.32,.12,1.5,.28,.34,.62,.76,.16,1,68),
B('Stark VARG 80 HP',55000,[10,10,8,10],0xdc2626,0x111111,0x666666,0x111111,.31,.12,1.5,.26,.34,.6,.76,.16,1,75),
B('Volt City Scooter',450,[3,3,7,2],0x65a30d,0x111827,0xb0bec5,0x263238,.14,.07,.86,.2,.13,.55,0,.9,0,18,'scooter'),
B('Volt Pro Scooter',1200,[5,5,8,4],0x0ea5e9,0x111827,0xcbd5e1,0x111827,.16,.08,.98,.22,.15,.62,0,1.05,0,25,'scooter')];
const HOUSES=[
{name:'Starter Home',tier:0,price:6000,tag:'Single-story · starter house'},
{name:'Home',tier:1,price:18000,tag:'Two-story · family house'},
{name:'Mansion',tier:2,price:45000,tag:'Three-story · wings & loft'}];
const HOME_TIER=i=>HOUSES.find(h=>h.tier===i);
/* Bike indices are stored in saves; this only changes the garage's display order. */
const BIKE_ORDER=[0,1,8,3,7,4,2,5,9,6,10,11,12,13];
const SUSPENSIONS=[
{n:'Factory',travel:.16,frontTravel:.16,rearTravel:.15,frontSpring:60,frontDamping:12,rearSpring:68,rearDamping:13,price:0},
{n:'Trail long-travel',travel:.34,frontTravel:.36,rearTravel:.32,frontSpring:42,frontDamping:10,rearSpring:50,rearDamping:11,price:.18},
{n:'Race firm',travel:.21,frontTravel:.22,rearTravel:.2,frontSpring:100,frontDamping:15,rearSpring:112,rearDamping:16,price:.3}];
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
/* ---------- three setup ---------- */
const cv=$('g'),R=new T.WebGLRenderer({canvas:cv,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,1.5));R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
const scene=new T.Scene();scene.fog=new T.Fog(0xbfdef2,90,230);
const cam=new T.PerspectiveCamera(62,1,.1,2500);
const hemi=new T.HemisphereLight(0xffffff,0x667755,1.0);scene.add(hemi);
const sun=new T.DirectionalLight(0xfff2d8,2.2);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);const sc=sun.shadow.camera;sc.left=sc.bottom=-45;sc.right=sc.top=45;sc.far=250;scene.add(sun,sun.target);
const skyMaterial=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{daylight:{value:1}},vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform float daylight;varying vec3 p;void main(){float h=clamp(normalize(p).y,0.,1.);vec3 day=mix(vec3(.75,.87,.95),vec3(.18,.45,.85),pow(h,.55));vec3 night=mix(vec3(.015,.025,.06),vec3(.035,.07,.15),pow(h,.55));gl_FragColor=vec4(mix(night,day,daylight),1.);}'}),sky=new T.Mesh(new T.SphereGeometry(1000,16,12),skyMaterial);scene.add(sky);
const mat=(c,o={})=>new T.MeshStandardMaterial({color:c,roughness:.5,metalness:.3,...o});
const boxGeo=new T.BoxGeometry(1,1,1);
const bx=(w,h,l,m,x,y,z)=>{const o=new T.Mesh(boxGeo,m);o.scale.set(w,h,l);o.position.set(x,y,z);return o};
const tb=(a,b,r,m)=>{const A=new T.Vector3(...a),Bv=new T.Vector3(...b),o=new T.Mesh(new T.CylinderGeometry(r,r,A.distanceTo(Bv),8),m);o.position.copy(A).add(Bv).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),Bv.clone().sub(A).normalize());return o};
const makeHelix=(turns,radius,wire,material)=>{const points=[],segments=turns*18;for(let i=0;i<=segments;i++){const t=i/segments,a=t*turns*2*PI;points.push(new T.Vector3(Math.cos(a)*radius,t-.5,Math.sin(a)*radius))}const curve=new T.CatmullRomCurve3(points);return new T.Mesh(new T.TubeGeometry(curve,segments,wire,8,false),material)};
const alignAxial=(group,a,b)=>{const axis=b.clone().sub(a),length=axis.length();group.position.copy(a).add(b).multiplyScalar(.5);group.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),axis.normalize());group.scale.set(1,length,1)};
const tireMap=(()=>{const c=document.createElement('canvas');c.width=128;c.height=64;const x=c.getContext('2d');x.fillStyle='#191b1d';x.fillRect(0,0,128,64);x.strokeStyle='#303438';x.lineWidth=4;for(let i=-64;i<160;i+=16){x.beginPath();x.moveTo(i,0);x.lineTo(i+30,64);x.stroke();x.beginPath();x.moveTo(i+8,0);x.lineTo(i-22,64);x.stroke()}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t})();
/* ---------- bike model ---------- */
function buildBike(d,shirt){
const g=new T.Group(),P=new T.Group();g.add(P);
const M=mat(d.c,{roughness:.38,metalness:.28}),A=mat(d.a,{roughness:.42,metalness:.22}),F=mat(d.f,{metalness:.9,roughness:.3}),K=mat(0xffffff,{map:tireMap,roughness:.95,metalness:0}),rubber=mat(0x17191b,{roughness:.92,metalness:0}),SM=mat(d.sc,{roughness:.72}),SH=mat(shirt,{metalness:0}),PN=mat(0x222244,{metalness:0});
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
const wb=d.wb,y0=d.wr*.9,hy=d.wr*2+.18,hz=wb-.22,hby=hy+d.hb*.5+.06,frontSpacing=.105;
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
P.add(tb([0,y0+.15,wb*.3],[0,d.sy,wb*.18],.04,M));
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
const seat=new T.Mesh(new RoundedBoxGeometry(.24,.1,d.sl,3,.035),SM);seat.position.set(0,d.sy,wb*.18);P.add(seat);
const seatTrim=new T.Mesh(new RoundedBoxGeometry(.25,.026,d.sl*.86,3,.012),A);seatTrim.position.set(0,d.sy+.055,wb*.18);P.add(seatTrim);
P.add(tb([-.32,hby,hz-.08],[.32,hby,hz-.08],.025,F));P.add(tb([0,hy,hz],[0,hby,hz-.08],.03,F));
for(const side of [-1,1]){const grip=new T.Mesh(new T.CylinderGeometry(.04,.04,.16,10),rubber);grip.rotation.z=PI/2;grip.position.set(side*.34,hby,hz-.08);P.add(grip);
const peg=new T.Mesh(new T.CylinderGeometry(.035,.035,.18,10),rubber);peg.rotation.z=PI/2;peg.position.set(side*.18,y0+.04,wb*.22);P.add(peg)}
P.add(bx(.32,.28,.07,SM,0,hy+.12,hz+.14),bx(.12,.12,.08,M,0,hy+.12,hz+.19),bx(.13,.035,.02,A,0,hy+.08,hz+.235));
const hl=new T.Mesh(new T.SphereGeometry(.07,10,8),new T.MeshBasicMaterial({color:0xffffee}));hl.position.set(0,hby-.06,hz+.08);P.add(hl);
const tl=new T.Mesh(new T.BoxGeometry(.1,.05,.04),new T.MeshBasicMaterial({color:0xff2222}));tl.position.set(0,d.wr*1.2+.02,-.4);P.add(tl);
const glow=new T.Mesh(new T.SphereGeometry(.16,10,8),new T.MeshBasicMaterial({color:0xa855f7,transparent:true,opacity:.8}));glow.position.set(0,y0-.08,wb*.3);glow.visible=false;P.add(glow);
const Rd=new T.Group();P.add(Rd);
Rd.add(tb([0,d.sy+.1,wb*.12],[0,d.sy+.62,wb*.38],.12,SH));
const hd=new T.Mesh(new T.SphereGeometry(.13,12,10),mat(0xffffff));hd.position.set(0,d.sy+.82,wb*.45);Rd.add(hd);
[-1,1].forEach(s=>{Rd.add(tb([s*.2,d.sy+.55,wb*.36],[s*.32,hby,hz-.08],.04,SH));Rd.add(tb([s*.14,d.sy+.1,wb*.12],[s*.22,y0-.1,wb*.32],.055,PN))});
updateSuspension(0,0);
g.traverse(o=>{if(o.isMesh)o.castShadow=true});
return{g,P,rw:rw.spin,fw:fw.spin,rwMount:rw.mount,fwMount:fw.mount,rearAssembly,updateSuspension,rearShock,R:Rd,glow,wr:d.wr,wb,d};}
function tag(txt,col){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.font='bold 30px system-ui';x.textAlign='center';x.fillStyle='rgba(0,0,0,.5)';x.fillRect(0,8,256,48);x.fillStyle=col;x.fillText(txt,128,43);const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false}));s.scale.set(3,.75,1);s.position.y=2.4;s.renderOrder=9;return s}
function pose(r,X,Y,Z,H,Ro,Pt,V,dt,frontCompression=0,rearCompression=0,trickRoll=0){frontCompression=Number.isFinite(frontCompression)?Math.max(-.06,Math.min(.36,frontCompression)):0;rearCompression=Number.isFinite(rearCompression)?Math.max(-.06,Math.min(.32,rearCompression)):0;r.g.position.set(X,Y+r.wr,Z);r.g.rotation.set(0,H,Ro);const bodyCompression=(frontCompression+rearCompression)*.5,suspensionPitch=Math.atan2(frontCompression-rearCompression,r.wb)*.45;r.P.rotation.set(-Pt+suspensionPitch,0,trickRoll);r.P.position.y=-bodyCompression;r.updateSuspension(frontCompression,rearCompression);
const s=V*dt/r.wr;r.rw.rotation.x+=s;r.fw.rotation.x+=s}
function buildWalker(color){
const g=new T.Group(),skin=mat(0xb77b55,{roughness:.85,metalness:0}),shirt=mat(color,{roughness:.7,metalness:0}),pants=mat(0x252a32,{roughness:.9,metalness:0}),helmet=mat(0x20272a,{roughness:.32,metalness:.5}),visor=mat(0x6da4b1,{roughness:.18,metalness:.65});
g.add(bx(.52,.67,.3,shirt,0,1.18,0),bx(.46,.13,.32,pants,0,.81,0));
const head=new T.Mesh(new T.SphereGeometry(.16,14,10),skin);head.position.y=1.72;g.add(head);
const lid=new T.Mesh(new T.SphereGeometry(.19,14,9,0,Math.PI*2,0,Math.PI*.62),helmet);lid.position.y=1.79;g.add(lid);
g.add(bx(.19,.09,.15,visor,0,1.77,.14));
const limb=(length,radius,m,x,y)=>{const pivot=new T.Group();pivot.position.set(x,y,0);const part=new T.Mesh(new T.CylinderGeometry(radius*.72,radius,length,9),m);part.position.y=-length/2;pivot.add(part);g.add(pivot);return pivot};
const arms=[limb(.62,.085,shirt,-.34,1.43),limb(.62,.085,shirt,.34,1.43)];
const legs=[limb(.72,.12,pants,-.14,.78),limb(.72,.12,pants,.14,.78)];
for(const side of [-1,1])g.add(bx(.16,.12,.28,helmet,side*.14,.12,.05));
return{g,arms,legs};
}
/* ---------- world ---------- */
const S_=90,chunks=new Map(),rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const roadBump=z=>.003+.025*Math.pow(Math.max(0,Math.cos(z*.48)),8)+.001*Math.sin(z*1.63);
const roadSlope=z=>{const c=Math.cos(z*.48);return(c>0?-.096*Math.pow(c,7)*Math.sin(z*.48):0)+.00163*Math.cos(z*1.63)};
const roadFade=x=>Math.pow(Math.max(0,1-(x/12)**2),2);
const makeRoadGeo=oz=>{const geo=new T.PlaneGeometry(24,S_,12,180).rotateX(-PI/2),position=geo.attributes.position;for(let i=0;i<position.count;i++){const x=position.getX(i),z=oz+position.getZ(i);position.setY(i,roadBump(z)*roadFade(x))}geo.computeVertexNormals();return geo};
const gGeo=new T.PlaneGeometry(S_,S_).rotateX(-PI/2),bGeo=new T.BoxGeometry(1,1,1).translate(0,.5,0);
const GM=[0x5a5e66,0x5f9e4b,0xcaa56b,0x8f949c].map(c=>mat(c,{roughness:1,metalness:0}));
const rt=(()=>{const c=document.createElement('canvas');c.width=128;c.height=512;const x=c.getContext('2d');x.fillStyle='#34373d';x.fillRect(0,0,128,512);for(let i=0;i<9000;i++){const shade=30+Math.random()*30;x.fillStyle=`rgba(${shade},${shade},${shade+2},.16)`;x.fillRect(Math.random()*128,Math.random()*512,1+Math.random()*2,1)}for(let i=0;i<700;i++){const shade=40+Math.random()*20;x.fillStyle=`rgba(${shade},${shade},${shade+1},.10)`;x.fillRect(Math.random()*128,Math.random()*512,.6+.6*Math.random(),.6+.6*Math.random())}x.fillStyle='#e7e8e8';x.fillRect(5,0,2,512);x.fillRect(121,0,2,512);x.fillStyle='#f2bd35';x.fillRect(62,0,2,512);x.fillRect(67,0,2,512);x.fillStyle='#e7e8e8';for(let i=0;i<10;i++){const y=i*51.2+15;x.fillRect(34,y,2,18);x.fillRect(92,y,2,18)}const t=new T.CanvasTexture(c);t.anisotropy=4;return t})();
const roadM=mat(0xffffff,{map:rt,roughness:.9,metalness:0}),swM=mat(0x9a9a9a,{roughness:1,metalness:0}),seamM=mat(0x65696d,{roughness:1,metalness:0}),roadStudM=mat(0xe4e9e9,{emissive:0x111111,emissiveIntensity:.2,roughness:.3,metalness:.2}),poleM=mat(0x444444,{roughness:.6,metalness:.55}),lampM=mat(0xffd27a,{emissive:0xff9a35,emissiveIntensity:0,roughness:.2,metalness:.1}),streetGlowM=new T.MeshBasicMaterial({color:0xffb95e,transparent:true,opacity:0,depthWrite:false}),lensM=new T.MeshStandardMaterial({color:0xfff0cf,emissive:0xffb35e,emissiveIntensity:.8,roughness:.15,metalness:.1});
const BM=[0x8a94a6,0x6b7a90,0xa7b0c0,0x4b5563,0x9aa5b8].map(c=>mat(c,{roughness:.8})),HM=[0xf2e2c7,0xe8b4a0,0xb9d3e8,0xd9e8b9].map(c=>mat(c,{roughness:.9,metalness:0})),windowM=mat(0x83cfe0,{emissive:0x16465a,emissiveIntensity:.2,roughness:.18,metalness:.2}),doorM=mat(0x6b3f2a,{roughness:.75}),trimM=mat(0xf1dfbd,{roughness:.7,metalness:0});
const roofM=mat(0x7a3b2e,{roughness:.9}),trM=mat(0x5b3a1e,{roughness:1,metalness:0}),lfM=mat(0x2f7d32,{roughness:1,metalness:0}),rkM=mat(0x8b7355,{roughness:1}),cacM=mat(0x3f8f3f,{roughness:1});
const trGeo=new T.CylinderGeometry(.25,.3,2,6),cnGeo=new T.ConeGeometry(1.6,4,7),pGeo=new T.CylinderGeometry(.1,.1,7,10),lampGlowGeo=new T.SphereGeometry(.65,10,8),rkGeo=new T.DodecahedronGeometry(1),cacGeo=new T.CylinderGeometry(.35,.35,3,8),hrGeo=new T.ConeGeometry(5.6,2.5,4).rotateY(PI/4);
const padGeo=new T.PlaneGeometry(4,8).rotateX(-PI/2),padM=new T.MeshStandardMaterial({color:0x66ddff,emissive:0x0b7aa5,emissiveIntensity:.7,roughness:.35,metalness:.2});
const RM=[0xd97706,0x9a7b4f,0x9ca3af,0xb45309].map(c=>mat(c,{roughness:.8}));
function mkChunk(cx,cz){
const r=rng((cx*73856093)^(cz*19349663)),g=new T.Group(),c={g,id:[cx,cz],ramps:[],cols:[],pads:[],lights:[],dis:[]},ox=cx*S_,oz=cz*S_;g.position.set(ox,0,oz);
const hw=cx===0,b=hw?r()*3|0:r()*4|0;
const gm=new T.Mesh(gGeo,GM[b]);gm.receiveShadow=true;g.add(gm);
const bk=new Map(),add=(m,x,y,z,cs,dyn)=>{m.position.set(x,y,z);if(dyn||m.geometry.type==='ExtrudeGeometry'){m.castShadow=!!cs;m.receiveShadow=true;g.add(m);return m}m.updateMatrix();const q=m.geometry.clone().applyMatrix4(m.matrix);const a=bk.get(m.material)||bk.set(m.material,[]).get(m.material);a.push(q);return m};
const rp=ex=>{for(let i=0;i<25;i++){const x=(r()-.5)*84,z=(r()-.5)*84;if(!hw||Math.abs(x)>ex)return[x,z]}return[40,40]};
const ramp=(x,z,ry,L,w,H,mi)=>{const sh=new T.Shape();sh.moveTo(0,0);sh.lineTo(L,0);sh.lineTo(L,H);sh.closePath();const geo=new T.ExtrudeGeometry(sh,{depth:w,bevelEnabled:false}).translate(-L/2,0,-w/2);c.dis.push(geo);const m=add(new T.Mesh(geo,RM[mi]),x,0,z,1);m.rotation.y=ry;c.ramps.push({x:ox+x,z:oz+z,L,w,H,co:Math.cos(ry),si:Math.sin(ry)})};
const col=(x,z,w,d,h=Infinity,house=false)=>c.cols.push({x:ox+x,z:oz+z,hw:w/2+.4,hd:d/2+.4,h,house});
const tree=(x,z)=>{add(new T.Mesh(trGeo,trM),x,1,z);add(new T.Mesh(cnGeo,lfM),x,3.6,z,1);col(x,z,.4,.4,5.6)};
if(hw){const roadGeo=makeRoadGeo(oz);add(new T.Mesh(roadGeo,roadM),0,0,0);roadGeo.dispose();
[-13.5,13.5].forEach(x=>{const m=new T.Mesh(bGeo,swM);m.scale.set(3,.2,S_);add(m,x,0,0);col(x,0,3,S_,.2)});
[-30,0,30].forEach(z=>[-14.5,14.5].forEach(sx=>{
const base=new T.Mesh(new T.CylinderGeometry(.18,.24,.3,10),poleM);add(base,sx,.15,z,1);
const flare=new T.Mesh(new T.CylinderGeometry(.3,.38,.5,10),poleM);add(flare,sx,.42,z,1);
add(new T.Mesh(new T.CylinderGeometry(.12,.16,.9,8),poleM),sx,4.4,z,1);
add(new T.Mesh(pGeo,poleM),sx,5.4,z,1);
g.add(tb([sx,6.55,z],[sx*.9,6.88,z],.045,poleM));
g.add(tb([sx*.9,6.5,z],[sx*.9,6.95,z],.035,poleM));
add(new T.Mesh(new T.BoxGeometry(.64,.13,.32),poleM),sx*.9,6.93,z,1);
add(new T.Mesh(new T.SphereGeometry(.16,10,8),lampM),sx*.9,6.84,z,1);
add(new T.Mesh(new T.SphereGeometry(.09,8,6),lensM),sx*.9,6.87,z,1);
const halo=new T.Mesh(lampGlowGeo,streetGlowM);add(halo,sx*.9,6.84,z,0,1);
const light=new T.PointLight(0xffc777,0,30,2);light.position.set(sx*.9,6.9,z);g.add(light);c.lights.push(light)
col(sx,z,.5,.5,7.5)}));
for(let z=-39;z<=39;z+=6){for(const sx of [-13.5,13.5])add(bx(2.7,.01,.04,seamM,sx,.205,z),sx,.205,z);
for(const sx of [-10.8,10.8])add(bx(.12,.025,.2,roadStudM,sx,roadBump(z)*roadFade(sx)+.012,z),sx,roadBump(z)*roadFade(sx)+.012,z)}
if(r()<.4){const side=r()<.5?-1:1,x=side*(13.2+(r()-.5)*2.4),z=(r()-.5)*60;add(new T.Mesh(padGeo,padM),x,roadBump(z)*roadFade(x)+.015,z);c.pads.push({x:ox+x,z:oz+z})}}
if(b===0)for(let i=0;i<9;i++){const[x,z]=rp(27),w=8+r()*8,d=8+r()*8,h=10+r()*38,m=new T.Mesh(bGeo,BM[r()*5|0]);m.scale.set(w,h,d);add(m,x,0,z,1);col(x,z,w,d,h)}
if(b===1)for(let i=0;i<6;i++){
const[x,z]=rp(24),tier=r(),stories=tier<.36?1:tier<.76?2:3,mansion=tier>.88,width=mansion?13:6.5+r()*1.8,depth=mansion?10:7+r()*1.4,height=stories*3,wall=HM[r()*HM.length];
const body=new T.Mesh(bGeo,wall);body.scale.set(width,height,depth);add(body,x,0,z,1);col(x,z,width,depth,height,true);
const roof=new T.Mesh(hrGeo,mansion?roofM:RM[r()*RM.length]);roof.scale.set(width/11.2,1,depth/11.2);add(roof,x,height+.7,z,1);
for(let floor=0;floor<stories;floor++){
for(const fraction of [-.3,0,.3]){
const wx=width*fraction,ww=mansion?1.55:1.05,wy=floor*3+1.35,wf=new T.Mesh(boxGeo,trimM);wf.scale.set(ww+.14,1.25,.045);add(wf,x+wx,wy,z-depth*.5-.035);
const pane=new T.Mesh(boxGeo,windowM);pane.scale.set(ww,1.1,.035);add(pane,x+wx,wy,z-depth*.5-.065)
}
if(mansion&&floor>0){add(bx(width*.78,.08,.8,trimM,x,floor*3-.08,z-depth*.5-.48),x,floor*3-.08,z-depth*.5-.48);
for(const px of [-.36,0,.36])add(bx(.06,.48,.06,trimM,x+width*px,floor*3+.17,z-depth*.5-.86),x+width*px,floor*3+.17,z-depth*.5-.86)}
}
const door=new T.Mesh(boxGeo,doorM);door.scale.set(1.15,2.4,.08);add(door,x,1.2,z-depth*.5-.08);
if(mansion){
for(const side of [-1,1]){
const wingX=x+side*(width*.5+1.65),wing=new T.Mesh(bGeo,wall);wing.scale.set(4.2,6,7);add(wing,wingX,0,z,1);col(wingX,z,4.2,7,6,true);
const wingRoof=new T.Mesh(hrGeo,roofM);wingRoof.scale.set(.4,1,.65);add(wingRoof,wingX,6.7,z,1);
for(const floor of [1.4,4.4]){const pane=new T.Mesh(boxGeo,windowM);pane.scale.set(1.1,1.15,.04);add(pane,wingX,floor,z-3.54)}
}
for(const px of [-.36,.36])add(new T.Mesh(new T.CylinderGeometry(.13,.16,2.7,8),trimM),x+width*px,1.35,z-depth*.5-1.1,1);
add(new T.Mesh(bGeo,trimM),x,.14,z-depth*.5-1.2)
}}
if(b===2){for(let i=0;i<8;i++){const[x,z]=rp(17),m=new T.Mesh(rkGeo,rkM),s=.8+r()*2;m.scale.set(s,s*.7,s);add(m,x,s*.3,z,1);col(x,z,s*1.2,s*1.2,s)}
for(let i=0;i<6;i++){const[x,z]=rp(17);add(new T.Mesh(cacGeo,cacM),x,1.5,z,1);col(x,z,.8,.8,3)}
for(let i=0;i<2;i++){const[x,z]=rp(17);ramp(x,z,r()*6.28,9,5,2.2,1)}}
if(b!==2)for(let i=0;i<7;i++){const[x,z]=rp(17);tree(x,z)}
bk.forEach((a,m)=>{const mg=mergeGeometries(a);a.forEach(q=>q.dispose());c.dis.push(mg);const o=new T.Mesh(mg,m);o.castShadow=m!==roadM&&m!==GM[b]&&m!==swM;o.receiveShadow=true;g.add(o)});
return c}
function gH(x,z){const fade=roadFade(x);let h=roadBump(z)*fade;const a=Math.round(x/S_),b=Math.round(z/S_);gH.sl=roadSlope(z)*fade;gH.e=[0,1];
for(let i=-1;i<2;i++)for(let j=-1;j<2;j++){const c=chunks.get((a+i)+','+(b+j));if(!c)continue;for(const q of c.ramps){const dx=x-q.x,dz=z-q.z,u=dx*q.co-dz*q.si,l=dx*q.si+dz*q.co;if(Math.abs(u)<q.L/2&&Math.abs(l)<q.w/2){const hh=(u+q.L/2)/q.L*q.H;if(hh>h){h=hh;gH.sl=q.H/q.L;gH.e=[q.co,-q.si]}}}}return h}
function nbr(x,z,f){const a=Math.round(x/S_),b=Math.round(z/S_);for(let i=-1;i<2;i++)for(let j=-1;j<2;j++){const c=chunks.get((a+i)+','+(b+j));if(c)f(c)}}
function loadChunks(x,z){const a=Math.round(x/S_),b=Math.round(z/S_);
for(let i=-2;i<3;i++)for(let j=-2;j<3;j++){const k=(a+i)+','+(b+j);if(!chunks.has(k)){const c=mkChunk(a+i,b+j);chunks.set(k,c);scene.add(c.g)}}
for(const[k,c]of chunks)if(Math.abs(c.id[0]-a)>3||Math.abs(c.id[1]-b)>3){scene.remove(c.g);c.dis.forEach(q=>q.dispose());chunks.delete(k)}}
/* ---------- particles ---------- */
const NP=260,pp=new Float32Array(NP*3),pc=new Float32Array(NP*3),pq=[],pg=new T.BufferGeometry();
for(let i=0;i<NP;i++){pp[i*3+1]=-999;pq.push({l:0,v:[0,0,0],g:0})}
pg.setAttribute('position',new T.BufferAttribute(pp,3));pg.setAttribute('color',new T.BufferAttribute(pc,3));
const pts=new T.Points(pg,new T.PointsMaterial({size:.25,vertexColors:true,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));pts.frustumCulled=false;scene.add(pts);
let pi=0;const emit=(p3,vx,vy,vz,l,r,g,b,gr)=>{const i=pi++%NP,q=pq[i];pp.set([p3.x,p3.y,p3.z],i*3);pc.set([r,g,b],i*3);q.l=l;q.v=[vx,vy,vz];q.g=gr};
const stepP=dt=>{for(let i=0;i<NP;i++){const q=pq[i];if(q.l>0){q.l-=dt;q.v[1]-=q.g*dt;pp[i*3]+=q.v[0]*dt;pp[i*3+1]+=q.v[1]*dt;pp[i*3+2]+=q.v[2]*dt;if(q.l<=0)pp[i*3+1]=-999}}pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true};
/* ---------- audio ---------- */
let AC,mg,mo1,mo2,mgn,sir,sg,ng={},muted=false;
function ainit(){if(AC){AC.resume();return}try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return}
mg=AC.createGain();mg.gain.value=muted?0:.5;mg.connect(AC.destination);
mo1=AC.createOscillator();mo1.type='sawtooth';mo2=AC.createOscillator();mo2.type='sine';const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=1600;mgn=AC.createGain();mgn.gain.value=0;
mo1.connect(f);mo2.connect(f);f.connect(mgn);mgn.connect(mg);mo1.start();mo2.start();
const nb=AC.createBuffer(1,AC.sampleRate,AC.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
const ns=(t,fr,q)=>{const s=AC.createBufferSource();s.buffer=nb;s.loop=true;const fl=AC.createBiquadFilter();fl.type=t;fl.frequency.value=fr;fl.Q.value=q;const g=AC.createGain();g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(mg);s.start();return g};
ng.scr=ns('bandpass',1700,3);ng.spk=ns('highpass',5000,1);ng.bst=ns('bandpass',600,.6);sir=AC.createOscillator();sir.type='triangle';sg=AC.createGain();sg.gain.value=0;sir.connect(sg);sg.connect(mg);sir.start()}
addEventListener('pointerdown',ainit);addEventListener('keydown',ainit);
$('bm').onclick=()=>{muted=!muted;$('bm').textContent=muted?'🔇':'🔊';if(mg)mg.gain.value=muted?0:.5};
/* ---------- input ---------- */
const keys={};let joined=false,riderName='',riding=true;addEventListener('keydown',e=>{if(settingsOpen){if(e.code==='Escape'){e.preventDefault();closeSettings()}return}keys[e.code]=1;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(joined&&e.code==='Space'&&!e.repeat&&riding&&!gOpen&&!air&&!wreck)bounceRequested=true;if(joined&&e.code==='KeyF'&&!e.repeat)tryGroundTouch();if(joined&&e.code==='KeyG'&&riding)tg(!gOpen);if(joined&&e.code==='Escape'&&gOpen)tg(false)});
addEventListener('keyup',e=>keys[e.code]=0);addEventListener('blur',()=>{for(const k in keys)keys[k]=0});
document.querySelectorAll('#tc button').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{if(k==='KeyF')tryGroundTouch();else{if(k==='Space'&&!keys[k]&&joined&&riding&&!gOpen&&!air&&!wreck)bounceRequested=true;keys[k]=1}e.preventDefault()});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=0))});
/* ---------- state ---------- */
const MYC=new T.Color().setHSL(Math.random(),.8,.5).getHex();
let me=buildBike(BIKES[S.eq],MYC);scene.add(me.g);let myTag=null;
const walker=buildWalker();scene.add(walker.g);walker.g.visible=false;let walkerTag=null;
let x=0,y=0,z=0,h=0,v=0,p=0,pw=0,vy=0,air=false,wreck=0,boostE=0,boosting=false,zt=0,wt=0,cb=1,pad=0,padCooldown=0,airT=0,roll=0,lastGH=0,lastRd=0,tt=0,pt=0,units=S.units?1:0,svT=0,gOpen=false,settingsOpen=false,gi=S.eq,ga=0,netT=0,camInit=true;
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
function toggleRide(){
if(!joined||gOpen)return;
if(riding){
if(Math.abs(v)>1.5){pop('SLOW DOWN TO DISMOUNT','#facc15');return}
riding=false;boosting=false;p=0;pw=0;ox=x+Math.cos(h)*1.25;oz=z-Math.sin(h)*1.25;oy=gH(ox,oz);oh=h;opitch=0;walker.g.visible=true;camInit=true
}else if(Math.hypot(ox-x,oz-z)<3.2){
riding=true;h=oh;walker.g.visible=false;lookYaw=0;lookPitch=0;v=0;camInit=true
}else pop('WALK BACK TO YOUR BIKE','#facc15')
}
function tryGroundTouch(){
if(!joined||gOpen||!riding||wreck>0||air)return toggleRide();
const wheelie=!!(keys['ShiftLeft']||keys['ShiftRight'])&&p>0;
if(wheelie&&wzone===1){if(trick==null){trick='handscrape';trickT=0;pop('HAND SCRAPE · F SCRAPE','#facc15')}}
else if(wheelie&&wzone===2){wheelieHold=Math.max(0,wheelieHold-1.2);cb=1;earn(30);pop('SKILL · REACHED THE GROUND +$30','#4ade80')}
else toggleRide();
}
const earn=a=>{S.cash+=a};
function pop(t,col){const d=document.createElement('div');d.className='pp';d.textContent=t;d.style.color=col||'#4ade80';d.style.marginLeft=((Math.random()-.5)*200-50)+'px';$('pop').appendChild(d);setTimeout(()=>d.remove(),1450)}
/* ---------- multiplayer ---------- */
const ROOM='ebikelife-ghpages-v1',ID=Math.random().toString(36).slice(2,9),rem=new Map();let cli=null,online=false,networkText='Enter a name to connect';
function connectOnline(){
try{cli=mqtt.connect('wss://broker.emqx.io:8084/mqtt',{clientId:'ebl_'+ID,reconnectPeriod:4000,connectTimeout:8000,resubscribe:true});
cli.on('connect',()=>{online=true;networkText='Connected · finding riders';cli.subscribe(ROOM+'/s',e=>{if(e){online=false;networkText='Offline · playing solo';console.error('MQTT subscribe failed:',e.message)}})});
cli.on('reconnect',()=>{networkText='Reconnecting…'});cli.on('close',()=>{online=false;networkText='Offline · playing solo'});cli.on('offline',()=>{online=false;networkText='Offline · playing solo'});
cli.on('error',e=>{online=false;networkText='Offline · playing solo';console.error('MQTT connection failed:',e&&e.message||e)});
cli.on('message',(t,m)=>{try{const d=JSON.parse(m.toString());if(d.i===ID||!BIKES[d.b]||typeof d.i!=='string')return;let r=rem.get(d.i);
if(!r){r={rig:null,b:-1,x:d.x,y:d.y,z:d.z,h:d.h,p:d.p,r:d.r,v:0,col:'#'+(d.c>>>0).toString(16).padStart(6,'0'),onFoot:false,px:d.px??d.x,py:d.py??d.y,pz:d.pz??d.z,ph:d.ph??d.h,tx:d.x,ty:d.y,tz:d.z,afp:0,afr:0,fc:0,rc:0,tfc:0,trc:0};r.tag=tag(d.n||'Rider','#fff');r.walker=buildWalker(d.c);r.walkerTag=tag(d.n||'Rider','#fff');r.walkerTag.position.y=2.15;r.walkerTag.scale.set(2,.5,1);r.walker.g.add(r.walkerTag);r.walker.g.visible=false;scene.add(r.walker.g);rem.set(d.i,r)}
if(r.b!==d.b){if(r.rig)scene.remove(r.rig.g);r.rig=buildBike(BIKES[d.b],d.c);r.rig.g.add(r.tag);scene.add(r.rig.g);r.b=d.b}
Object.assign(r,{tx:d.x,ty:d.y,tz:d.z,th:d.h,tp:d.on?0:d.p,tr:d.on?0:d.r,tv:d.on?0:d.v,tfp:d.fp||0,tfr:d.fr||0,tfc:Number.isFinite(d.fc)?d.fc:0,trc:Number.isFinite(d.rc)?d.rc:0,tpx:d.px??d.x,tpy:d.py??d.y,tpz:d.pz??d.z,tph:d.ph??d.h,onFoot:!!d.on,n:d.n,seen:performance.now()})}catch(e){console.error('Invalid rider update:',e)}})
}catch(e){online=false;networkText='Offline · playing solo';console.error('MQTT connection failed:',e)}
}
const nameInput=$('rider-name');
try{nameInput.value=localStorage.getItem('wheeliex-name')||''}catch(e){}
$('join-form').addEventListener('submit',e=>{e.preventDefault();riderName=nameInput.value.trim().slice(0,16);
if(riderName.length<2){nameInput.setCustomValidity('Enter at least 2 characters.');nameInput.reportValidity();return}
nameInput.setCustomValidity('');joined=true;for(const key in keys)keys[key]=0;myTag=tag(riderName,'#c0f56a');me.g.add(myTag);walkerTag=tag(riderName,'#c0f56a');walkerTag.position.y=2.15;walkerTag.scale.set(2,.5,1);walker.g.add(walkerTag);$('join-screen').classList.add('hidden');
try{localStorage.setItem('wheeliex-name',riderName)}catch(e){}
networkText='Connecting to riders…';$('net').textContent=networkText;connectOnline()});
nameInput.addEventListener('input',()=>nameInput.setCustomValidity(''));
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
if(riding){const impact=Math.abs(v);v*=.35;if(impact>12&&wreck<=0){wreck=1.7;p=0;pw=0;wt=0;zt=0;cb=1;pop('POLICE COLLISION!','#f43f5e')}y=gH(x,z)}
else{walkSpeed=0;oy=gH(ox,oz);walker.g.position.set(ox,oy,oz)}
q.d=Math.hypot((riding?x:ox)-q.x,(riding?z:oz)-q.z)
}
if(tank.g.visible&&Math.abs(pyNow-tank.g.position.y)<2){const dx=pxNow-tank.g.position.x,dz=pzNow-tank.g.position.z,px=2.2-Math.abs(dx),pz=3-Math.abs(dz);if(px>0&&pz>0){if(px<pz){if(riding)x+=Math.sign(dx||1)*px;else ox+=Math.sign(dx||1)*px}else if(riding)z+=Math.sign(dz||1)*pz;else oz+=Math.sign(dz||1)*pz;if(riding){const impact=Math.abs(v);v*=.35;if(impact>12&&wreck<=0){wreck=1.7;p=0;pw=0;pop('ARMORED COLLISION!','#f43f5e')}}}}
}
if(inTown){
const spotted=cops.some(q=>q.d<mode.detect&&(pv>18||riding&&p>.55));
const escalation=1.35+wanted*.75;
heat=clamp(heat+(spotted?dt*(riding&&p>.55?1.15:.72)*mode.heat:-dt*.45),0,escalation);
if(heat>=escalation&&wanted<6){wanted++;heat=0;if(wanted===1){chaseT=0;pop('🚨 PURSUIT · ★☆☆☆☆☆','#f87171')}else pop(`WANTED LEVEL · ${'★'.repeat(wanted)}${'☆'.repeat(6-wanted)}`,'#f87171');
if(wanted===3)pop('AIR SUPPORT INBOUND','#f87171');
if(wanted===5)pop('ARMORED UNIT DEPLOYED','#f87171');
if(wanted===6)pop('6 STARS · EMP LOCKDOWN — ESCAPE THE PERIMETER','#38bdf8')}
}else if(!wanted)heat=Math.max(0,heat-dt*.45);
if(wanted){
chaseT+=dt;const md=Math.min(...cops.map(q=>q.d));
if(cops.some(q=>q.d<mode.catch)&&(riding?y:oy)<2.1&&chaseT>2.5){
const fine=Math.min(S.cash,Math.floor(100+Math.min(chaseT*18,700)));S.cash-=fine;
pop('BUSTED! -$'+fine.toLocaleString(),'#ef4444');wanted=0;heat=0;v=0;p=0;pw=0;wheelieHold=0;if(!riding){riding=true;h=oh;walker.g.visible=false;camInit=true}copReset()
}else if(md>mode.distance&&(pv>10||air)){
escT+=dt;if(escT>mode.escape){const reward=Math.floor(200+Math.min(chaseT*15,800));earn(reward);
pop('PURSUIT LOST +$'+reward.toLocaleString(),'#4ade80');wanted=0;heat=0;copReset()}
}else escT=0;
}
$('pl').classList.toggle('pursuit',!!wanted);$('pl').classList.toggle('max-wanted',wanted===6);
}
/* ---------- garage ---------- */
const G=$('gar'),SET=$('settings'),difficultySelect=$('police-difficulty'),SN=['Motor Power','Torque','Balance','Boost'];
function closeSettings(){settingsOpen=false;SET.style.display='none';for(const key in keys)keys[key]=0}
function openSettings(){if(gOpen)tg(false);settingsOpen=true;SET.style.display='block';difficultySelect.value=S.policeDifficulty;for(const key in keys)keys[key]=0}
difficultySelect.value=S.policeDifficulty;
difficultySelect.addEventListener('change',()=>{if(policeModes[difficultySelect.value]){S.policeDifficulty=difficultySelect.value;save()}});
$('a11y-reduced-motion').onchange=function(){S.accessibility.reducedMotion=!!this.checked;save();document.body.classList.toggle('a11y-reduced-motion',!!this.checked)};
$('a11y-large-text').onchange=function(){S.accessibility.largeText=!!this.checked;save();document.body.classList.toggle('a11y-large-text',!!this.checked)};
$('a11y-high-contrast').onchange=function(){S.accessibility.highContrast=!!this.checked;save();document.body.classList.toggle('a11y-high-contrast',!!this.checked)};
$('st').onclick=openSettings;$('settings-close').onclick=closeSettings;
function setBike(i){scene.remove(me.g);me=buildBike(BIKES[i],MYC);if(myTag)me.g.add(myTag);scene.add(me.g)}
function vo(){if(gOpen&&innerWidth>700)cam.setViewOffset(innerWidth,innerHeight,-innerWidth*.2,0,innerWidth,innerHeight);else cam.clearViewOffset();cam.updateProjectionMatrix()}
function tg(o){if(settingsOpen)return;if(o&&(!riding||wanted)){pop(!riding?'MOUNT YOUR BIKE FIRST':'LOSE THE COPS FIRST','#f87171');return}if(o)setMapExpanded(false);gOpen=o;G.style.display=o?'block':'none';if(o){gi=S.eq;rg();v=0;p=0;pw=0;wheelieHold=0;air=false;vy=0;y=gH(x,z)}else if(gi!==S.eq)setBike(S.eq);vo()}
function rg(){let t=`<h2>GARAGE <span>$${Math.floor(S.cash).toLocaleString()}</span><button data-a="close">✕</button></h2><div class="grid">`;
BIKE_ORDER.forEach(i=>{const b=BIKES[i],owned=S.own.includes(i);t+=`<div class="card${i===gi?' sel':''}" data-a="pv" data-i="${i}"><b>${b.n}</b><small>${owned?(i===S.eq?'EQUIPPED':'OWNED'):'$'+b.pr.toLocaleString()} · ${Math.round(b.maxMph*(units?1.609:1))} ${units?'KM/H':'MPH'}</small>${eff(i).map(q=>`<div class="bar"><i style="width:${Math.min(100,q*10)}%"></i></div>`).join('')}</div>`});
const b=BIKES[gi],own=S.own.includes(gi),e=eff(gi),L=lv(gi),rarity=hackRarity(gi),hackCost=hackPrice(gi),canReroll=hackRank(gi)<HACK_RARITIES.length-1;t+=`</div><h3>${b.n} <small class="bike-spec">${Math.round(b.maxMph*(units?1.609:1))} ${units?'KM/H':'MPH'}</small></h3>`;
t+=own?(gi===S.eq?'':'<button class="big" data-a="eq">EQUIP</button>'):`<button class="big" data-a="buy" ${S.cash<b.pr?'disabled':''}>BUY $${b.pr.toLocaleString()}</button>`;
t+=`<h3>YOUR HOMES</h3><p class="gar-sub">Buy a place to live in — from a single-story house to a mansion — then get off your bike and explore the inside.</p><div class="grid">`;
HOUSES.forEach(h=>{const owned=S.houses.includes(h.tier);t+=`<div class="card${owned?' sel':''}"><b>${h.n}</b><small>${owned?'OWNED':'$'+h.price.toLocaleString()}</small><span>${h.tag}</span>${owned?'':`<button data-a="buyhouse" data-v="${h.tier}" ${S.cash<h.price?'disabled':''}>BUY $${h.price.toLocaleString()}</button>`}</div>`});
t+=`</div>`;
SN.forEach((n,k)=>{const l=L[k],maxed=e[k]>=10||b.s[k]*(1+l*.015)>10;t+=`<div class="row"><span>${n}</span><div class="bar"><i style="width:${Math.min(100,e[k]*10)}%"></i></div><em>${maxed?'MAX':`Lv ${l}`}</em>${own&&!maxed&&l<10?`<button data-a="up" data-k="${k}" ${S.cash<cost(gi,l)?'disabled':''}>+1.5% · $${cost(gi,l).toLocaleString()}</button>`:`<button disabled>${maxed||l>=10?'MAX':'—'}</button>`}</div>`});
const chosen=Number(S.suspension[gi]||0),mounted=Number(S.boostMount[gi]||0);
t+=`<section class="mod-shop"><h3>MOD SHOP</h3><h4>SUSPENSION</h4><div class="mod-grid">`;
SUSPENSIONS.forEach((s,i)=>{const price=modPrice(gi,s.price),selected=chosen===i;t+=`<button class="mod-card${selected?' selected':''}" data-a="susp" data-v="${i}" ${!own||selected||S.cash<price?'disabled':''}><b>${s.n}</b><small>${selected?'INSTALLED':i===0?'FACTORY SETUP':'INSTALL $'+price.toLocaleString()}</small><span>${Math.round(s.travel*100)} cm travel · ${i===1?'soft':i===2?'firm':'stock'} damping</span></button>`});
t+=`</div><h4>BOOST MOUNTS</h4><div class="mod-grid">`;
for(let tier=1;tier<=2;tier++){const total=mountPrice(gi,tier),price=total-(mounted?mountPrice(gi,mounted):0),installed=mounted>=tier;t+=`<button class="mod-card${installed?' selected':''}" data-a="mount" data-v="${tier}" ${!own||installed||S.cash<price?'disabled':''}><b>${tier===1?'Street boost':'Race boost'}</b><small>${installed?'INSTALLED':`${mounted?'UPGRADE':'INSTALL'} · ${tier===1?'300%':'400%'} · $${price.toLocaleString()}`}</small><span>${tier===1?'Balanced assist':'Maximum boost output'}</span></button>`}
t+=`</div><h4>ECU SOFTWARE</h4><div class="mod-card hack-card"><b>RANDOM RARITY HACK</b><small>CURRENT: ${rarity?`${rarity.name} · ${rarity.id==='secret'?'ALL STATS MAXED':`+${Math.round(rarity.boost*100)}%`}`:'NONE'} · $${hackCost.toLocaleString()} PER ROLL</small><div class="hack-odds">${HACK_RARITIES.map(r=>`<span style="--rarity:${r.color}">${r.name} <i>${r.chance}%</i> · ${r.id==='secret'?'MAX':`+${Math.round(r.boost*100)}%`}</span>`).join('')}</div><span>Best rarity is kept; failed or lower rolls cost the fee. Secret maxes all stats. Boost still requires a boost mount.</span><button data-a="hack" ${!own||!canReroll||S.cash<hackCost?'disabled':''}>${!canReroll?'SECRET MAXED':'ROLL HACK · $'+hackCost.toLocaleString()}</button></div></section>`;
G.innerHTML=t}
G.onclick=e=>{const t=e.target.closest('[data-a]');if(!t||t.disabled)return;const a=t.dataset.a;
if(a==='close'){tg(false);return}
if(a==='pv'){gi=+t.dataset.i;setBike(gi)}
else if(a==='eq'){S.eq=gi;boostE=Number(S.boostMount[gi]||0)>0?100:0}
else if(a==='buy'){const pr=BIKES[gi].pr;if(S.cash>=pr){S.cash-=pr;S.own.push(gi);S.eq=gi;boostE=Number(S.boostMount[gi]||0)>0?100:0}}
else if(a==='buyhouse'){const h=HOUSES.find(q=>q.tier===+t.dataset.v);if(!h||S.houses.includes(h.tier))return;if(S.cash<h.price)return;S.cash-=h.price;S.houses.push(h.tier);save();rg();pop('HOME SECURED · '+h.n,'#4ade80')}
else if(a==='up'){const k=Number(t.dataset.k);if(Number.isInteger(k)&&k>=0&&k<4){const l=lv(gi)[k],c=cost(gi,l);if(S.own.includes(gi)&&l<10&&BIKES[gi].s[k]*(1+l*.015)<=10&&S.cash>=c){S.cash-=c;lv(gi)[k]++}}}
else if(a==='susp'){const i=+t.dataset.v;if(S.own.includes(gi)&&Number.isInteger(i)&&i>=0&&i<SUSPENSIONS.length){const price=modPrice(gi,SUSPENSIONS[i].price);if(S.cash>=price){S.cash-=price;S.suspension[gi]=i;frontSusp.comp=0;frontSusp.vel=0;rearSusp.comp=0;rearSusp.vel=0}}}
else if(a==='mount'){const tier=+t.dataset.v,price=mountPrice(gi,tier)-(S.boostMount[gi]?mountPrice(gi,Number(S.boostMount[gi])):0);if(S.own.includes(gi)&&(tier===1||tier===2)&&tier>Number(S.boostMount[gi]||0)&&S.cash>=price){S.cash-=price;S.boostMount[gi]=tier;boostE=100}}
else if(a==='hack'){const price=hackPrice(gi),currentRank=hackRank(gi);if(S.own.includes(gi)&&currentRank<HACK_RARITIES.length-1&&S.cash>=price){S.cash-=price;const roll=Math.random()*100;let total=0,rolled=HACK_RARITIES[HACK_RARITIES.length-1];for(const candidate of HACK_RARITIES){total+=candidate.chance;if(roll<total){rolled=candidate;break}}const rank=HACK_RARITIES.indexOf(rolled);if(rank>currentRank){S.hacks[gi]=rolled.id;pop(rolled.id==='secret'?'SECRET HACK · ALL STATS FULLY MAXED!':`${rolled.name.toUpperCase()} HACK · +${Math.round(rolled.boost*100)}%`,'#4ade80')}else pop(`${rolled.name.toUpperCase()} ROLL · CURRENT UPGRADE KEPT`,'#facc15')}}
save();rg()};
$('bg').onclick=()=>tg(!gOpen);$('sp').onclick=()=>{units=!units;S.units=units?1:0;save()};
setTimeout(()=>$('help').remove(),15000);
/* ---------- HUD draw ---------- */
const mm=$('mm'),mx=mm.getContext('2d'),wm=$('wm'),wx=wm.getContext('2d');
function setMapExpanded(expanded){mm.classList.toggle('expanded',expanded);mm.setAttribute('aria-expanded',String(expanded));mm.setAttribute('aria-label',expanded?'Collapse player map':'Expand player map')}
mm.addEventListener('click',()=>setMapExpanded(!mm.classList.contains('expanded')));
mm.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();setMapExpanded(!mm.classList.contains('expanded'))}else if(e.key==='Escape'){e.stopPropagation();setMapExpanded(false)}});
function drawMM(){const px=riding?x:ox,pz=riding?z:oz,heading=riding?h:oh,k=1.5,sh=Math.sin(heading),ch=Math.cos(heading),P=(wx_,wz)=>{const dx=wx_-px,dz=wz-pz;return[150+(-dx*ch+dz*sh)*k,150-(dx*sh+dz*ch)*k]};
mx.fillStyle='#3d5a3a';mx.fillRect(0,0,300,300);mx.fillStyle='#50545c';mx.beginPath();[[-12,-200],[12,-200],[12,200],[-12,200]].forEach(([a,b],i)=>{const q=P(a,pz+b);i?mx.lineTo(q[0],q[1]):mx.moveTo(q[0],q[1])});mx.fill();
nbr(px,pz,c=>{mx.fillStyle='#8d96a5';c.cols.forEach(q=>{const s=P(q.x,q.z);mx.fillRect(s[0]-4,s[1]-4,8,8)});mx.fillStyle='#fbbf24';c.ramps.forEach(q=>{const s=P(q.x,q.z);mx.fillRect(s[0]-4,s[1]-4,8,8)})});
const expanded=mm.classList.contains('expanded');mx.font=expanded?'bold 13px system-ui':'bold 18px system-ui';mx.textAlign='center';
const dot=(X,Z,col,n)=>{const s=P(X,Z);if(s[0]<-10||s[0]>310||s[1]<-10||s[1]>310)return;mx.fillStyle=col;mx.beginPath();mx.arc(s[0],s[1],7,0,7);mx.fill();mx.strokeStyle='#000';mx.lineWidth=2;mx.stroke();if(n){const text=expanded?`${n} · ${Math.round(X)}, ${Math.round(Z)}`:n,half=mx.measureText(text).width/2,tx=Math.max(half+4,Math.min(296-half,s[0]));mx.fillStyle='#fff';mx.strokeText(text,tx,s[1]-11);mx.fillText(text,tx,s[1]-11)}};
for(const r of rem.values())dot(r.onFoot?r.px:r.x,r.onFoot?r.pz:r.z,r.col,r.n||'');
cops.forEach(q=>{if(q.c.g.visible)dot(q.x,q.z,((tt*6)|0)%2?'#ff2222':'#2f6bff',wanted?'POLICE':'')});
mx.fillStyle='#fff';mx.strokeStyle='#000';mx.beginPath();mx.moveTo(150,134);mx.lineTo(160,160);mx.lineTo(150,154);mx.lineTo(140,160);mx.closePath();mx.fill();mx.stroke();
if(expanded&&joined){const text=`${riderName} · ${Math.round(px)}, ${Math.round(pz)}`;mx.font='bold 13px system-ui';mx.fillStyle='#fff';mx.strokeStyle='#000';mx.textAlign='center';mx.strokeText(text,150,181);mx.fillText(text,150,181)}}
function drawWM(zw){if(p<.04){wm.style.opacity=0;return}wm.style.opacity=1;wx.clearRect(0,0,240,130);const a=q=>PI+q/1.6*PI,arc=(q0,q1,c)=>{wx.beginPath();wx.strokeStyle=c;wx.lineWidth=14;wx.arc(120,120,90,a(q0),a(q1));wx.stroke()};
arc(0,1.6,'rgba(255,255,255,.25)');arc(.8-zw,.8+zw,'#22c55e');arc(1.22,1.6,'#ef4444');wx.strokeStyle='#fff';wx.lineWidth=4;wx.beginPath();wx.moveTo(120,120);wx.lineTo(120+Math.cos(a(Math.min(p,1.6)))*82,120+Math.sin(a(Math.min(p,1.6)))*82);wx.stroke()}
/* ---------- main loop ---------- */
function resize(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;vo()}addEventListener('resize',resize);resize();
loadChunks(0,0);let last=performance.now();const tv=new T.Vector3();
function loop(now){requestAnimationFrame(loop);const dt=settingsOpen?0:Math.min(.05,(now-last)/1000);last=now;tt+=dt;padCooldown=Math.max(0,padCooldown-dt);
const k=c=>joined&&keys[c],bikeKey=c=>riding&&k(c),thr=bikeKey('KeyW')||bikeKey('ArrowUp')?1:0,br=bikeKey('KeyS')||bikeKey('ArrowDown')?1:0,st=((bikeKey('KeyD')||bikeKey('ArrowRight'))?1:0)-((bikeKey('KeyA')||bikeKey('ArrowLeft'))?1:0),pull=bikeKey('ShiftLeft')||bikeKey('ShiftRight')?1:0;
const mountTier=Number(S.boostMount[S.eq]||0),boostTier=mountTier,hasBoost=boostTier>0,bo=bikeKey('KeyE')&&hasBoost;
const E=eff(S.eq),kit=SUSPENSIONS[Number(S.suspension[S.eq]||0)]||SUSPENSIONS[0],zw=.05+.007*E[2];let sparks=0,skid=0,frontLoad=0,rearLoad=0;
if(bounceRequested){frontSusp.vel=Math.max(frontSusp.vel,1.6);rearSusp.vel=Math.max(rearSusp.vel,1.5);bounceRequested=false}
if(gOpen){ga+=dt*.5;y=gH(x,z);boosting=false;walkSpeed=0}
else if(!riding){
boosting=false;pad=Math.max(0,pad-dt);
const forward=(k('KeyW')||k('ArrowUp')?1:0)-(k('KeyS')||k('ArrowDown')?1:0),side=(k('KeyD')||k('ArrowRight')?1:0)-(k('KeyA')||k('ArrowLeft')?1:0),mag=Math.hypot(forward,side),speed=4.5;
walkSpeed=mag?speed:0;const norm=mag||1;
ox+=(Math.sin(oh)*forward+Math.cos(oh)*side)/norm*walkSpeed*dt;
oz+=(Math.cos(oh)*forward-Math.sin(oh)*side)/norm*walkSpeed*dt;
nbr(ox,oz,c=>{for(const q of c.cols)if(oy<=q.h&&Math.abs(ox-q.x)<q.hw+.3&&Math.abs(oz-q.z)<q.hd+.3){if(q.house&&S.houses.length>0)continue;const px=q.hw+.3-Math.abs(ox-q.x),pz=q.hd+.3-Math.abs(oz-q.z);if(px<pz)ox+=Math.sign(ox-q.x||1)*px;else oz+=Math.sign(oz-q.z||1)*pz}});
oy=gH(ox,oz);walkCycle+=dt*walkSpeed*2.6;
walker.g.position.set(ox,oy,oz);walker.g.rotation.y=oh;
const gait=walkSpeed?Math.sin(walkCycle)*.55:0;walker.arms[0].rotation.x=gait;walker.arms[1].rotation.x=-gait;walker.legs[0].rotation.x=-gait;walker.legs[1].rotation.x=gait;
}
else if(wreck>0){wreck-=dt;v*=Math.exp(-2*dt);x+=Math.sin(h)*v*dt;z+=Math.cos(h)*v*dt;if(wreck<=0){wreck=0;v=0;p=0;pw=0;air=false;airFlip=0;airRoll=0;wheelieHold=0;vy=0;y=gH(x,z);camInit=true}}
else{
boosting=!!bo&&boostE>1;
if(boosting){boostE=Math.max(0,boostE-dt*30/(.6+E[3]*.14));earn(dt*6)}else if(hasBoost)boostE=Math.min(100,boostE+dt*(5+E[3]*1.4));else boostE=0;
if(pad>0)pad-=dt;
const bike=BIKES[S.eq],motorScale=1+Math.min(.45,Math.max(0,E[0]/bike.s[0]-1)*.2),vmax=(bike.maxMph/2.237)*motorScale*(boosting?(boostTier>1?1.55:1.28):1)*(pad>0&&hasBoost?1.2:1);
if(thr)v+=(3+E[1]*.45)*(1-Math.max(0,v)/vmax)*dt*1.35;
if(boosting)v+=(8+E[3]*1.3)*dt*(1-v/(vmax*1.1));
if(pad>0&&hasBoost)v+=14*dt;
if(v>vmax)v-=(v-vmax)*1.2*dt;
v-=v*.05*dt+Math.sign(v)*.4*dt;if(Math.abs(v)<.05&&!thr&&!br)v=0;
if(br){if(v>.2){v-=16*dt;skid=v>6&&!air?1:0}else v=Math.max(-5,v-5*dt)}
const lift=Math.min(1,Math.abs(v)/5),wh=p>.1?1:0;
const a=(thr*(.42+E[1]*.05)+pull*3.2+(boosting?.8:0))*lift-3.6*p-1.9*pw-br*8*(p>0?1:0)+(Math.sin(tt*1.7)+.7*Math.sin(tt*2.9+1))*.3*(1-E[2]*.04)*wh;
pw+=a*dt;const prevP=p;p+=pw*dt;if(p<0){p=0;pw=Math.max(0,pw)}
if(prevP>0&&p<=0){const imp=Math.min(12,Math.abs(v)*0.6);frontSusp.comp=Math.max(frontSusp.comp,Math.min(kit.frontTravel,imp*.035));rearSusp.comp=Math.max(rearSusp.comp,Math.min(kit.rearTravel,imp*.03));frontSusp.vel=Math.max(frontSusp.vel,Math.min(6,imp*.35));rearSusp.vel=Math.max(rearSusp.vel,Math.min(6,imp*.4))}
earn(dt*Math.max(0,v)*.12);
if(p>.15){wt+=dt;if(Math.abs(p-.8)<zw)zt+=dt;else zt=Math.max(0,zt-dt*1.5);cb=Math.min(3,1+zt*.9);earn(dt*(6+6*p)*Math.floor(cb));if(p>1.22){sparks=1;earn(dt*30*Math.floor(cb))}}else{wt=0;zt=0;cb=1}
if(pull&&p>.15)wheelieHold+=dt;else wheelieHold=Math.max(0,wheelieHold-dt*2.5);
if(wheelieHold>2.1&&wheelieHold-dt<=2.1)pop('EASE OFF THE WHEELIE!','#facc15');
wzone=pull&&p>0?(wheelieHold>2.8?2:wheelieHold>2.1?1:0):0;
if(p>1.45||wheelieHold>2.8){const heldTooLong=wheelieHold>2.8;wreck=1.7;wt=0;zt=0;cb=1;wheelieHold=0;pop(heldTooLong?'WHEELIE OVERHELD!':'WIPEOUT!','#f43f5e')}
if(trick){trickT+=dt;if(trickT>0.9){const pts=Math.round(60+Math.abs(v)*45);earn(pts);pop('HAND SCRAPE · +$'+pts,'#facc15');trick=null;cb=1}}
h-=st*(1.9/(1+Math.abs(v)*.04))*(p>.2?.55+.05*E[2]:1)*Math.min(1,Math.abs(v)/3)*(v<0?-1:1)*dt;
roll+=(st*.4*Math.min(1,Math.abs(v)/10)-roll)*Math.min(1,8*dt);
x+=Math.sin(h)*v*dt;z+=Math.cos(h)*v*dt;
nbr(x,z,c=>{for(const q of c.cols)if(y<=q.h&&Math.abs(x-q.x)<q.hw&&Math.abs(z-q.z)<q.hd){const px=q.hw-Math.abs(x-q.x),pz=q.hd-Math.abs(z-q.z);if(px<pz)x+=Math.sign(x-q.x||1)*px;else z+=Math.sign(z-q.z||1)*pz;v*=.4}});
const gh=gH(x,z),rd=gH.sl*(Math.sin(h)*gH.e[0]+Math.cos(h)*gH.e[1]),frontGH=gH(x+Math.sin(h)*me.wb*.46,z+Math.cos(h)*me.wb*.46),rearGH=gH(x-Math.sin(h)*me.wb*.46,z-Math.cos(h)*me.wb*.46);
if(!air&&Math.abs(v)>2){frontLoad=Math.max(0,Math.min(kit.frontTravel*.28,(frontGH-gh)*.75));rearLoad=Math.max(0,Math.min(kit.rearTravel*.28,(rearGH-gh)*.75))}
if(air){
const flipInput=(k('KeyW')||k('ArrowUp')?1:0)-(k('KeyS')||k('ArrowDown')?1:0),rollInput=(k('KeyD')||k('ArrowRight')?1:0)-(k('KeyA')||k('ArrowLeft')?1:0);
airFlip+=flipInput*6.2*dt;airRoll+=rollInput*7.2*dt;
vy-=22*dt;y+=vy*dt;airT+=dt;
if(y<=gh){
y=gh;air=false;const impact=Math.abs(vy);frontSusp.comp=Math.max(frontSusp.comp,Math.min(kit.frontTravel,impact*.035));rearSusp.comp=Math.max(rearSusp.comp,Math.min(kit.rearTravel,impact*.03));frontSusp.vel=Math.max(frontSusp.vel,Math.min(6,impact*.35));rearSusp.vel=Math.max(rearSusp.vel,Math.min(6,impact*.4));
if(airT>.6){const b=Math.floor(airT*60);earn(b);pop('AIR TIME +$'+b,'#38bdf8')}
const phase=q=>Math.atan2(Math.sin(q),Math.cos(q)),flips=Math.floor(Math.abs(airFlip)/(2*PI)),rolls=Math.floor(Math.abs(airRoll)/(2*PI)),failed=Math.abs(phase(airFlip))>.5||Math.abs(phase(airRoll))>.5;
if(failed){wreck=1.7;wt=0;zt=0;cb=1;pop('TRICK LANDING FAILED!','#f43f5e')}
else if(flips||rolls){const reward=flips*180+rolls*160;earn(reward);const tricks=[];if(flips)tricks.push(`${flips}× ${airFlip>0?'BACKFLIP':'FRONTFLIP'}`);if(rolls)tricks.push(`${rolls}× BARREL ROLL`);pop(`${tricks.join(' + ')} +$${reward}`,'#facc15')}
airT=0;vy=0;airFlip=0;airRoll=0
}else if(y-gh>1)earn(dt*20)
}
else{if(lastGH>gh+.25&&v>3){airFlip=0;airRoll=0;air=true;vy=Math.max(0,lastRd*v);y=lastGH}else y=gh}
lastGH=gh;lastRd=rd;
nbr(x,z,c=>{for(const q of c.pads)if(!settingsOpen&&padCooldown<=0&&Math.abs(x-q.x)<2.4&&Math.abs(z-q.z)<4.8&&!air){pad=hasBoost?1.5:.75;padCooldown=4;if(hasBoost)boostE=Math.min(100,boostE+30);pop(hasBoost?'BOOST PAD!':'BOOST PAD','#a78bfa') }});
if(wreck>0){/* wipeout just began */}
}
if(!gOpen){stepSuspension(frontSusp,kit.frontSpring,kit.frontDamping,kit.frontTravel,dt,frontLoad);stepSuspension(rearSusp,kit.rearSpring,kit.rearDamping,kit.rearTravel,dt,rearLoad)}
/* chunks & sun & sky */
const worldX=riding?x:ox,worldZ=riding?z:oz,pcx=Math.round(worldX/S_),pcz=Math.round(worldZ/S_);if(loadChunks.k!==pcx+','+pcz){loadChunks.k=pcx+','+pcz;loadChunks(worldX,worldZ)}
tod=(tod+dt/DAY_LEN)%24;const daylight=Math.max(0,Math.min(1,(1-Math.cos(tod/12*Math.PI))/2));skyMaterial.uniforms.daylight.value=daylight;sun.position.set(worldX+60+Math.cos(tod*2*Math.PI)*45,95,worldZ+40+Math.sin(tod*2*Math.PI)*45);sun.target.position.set(worldX,0,worldZ);sun.intensity=2.2*daylight+0.25;hemi.intensity=0.55+0.45*daylight;const nightF=Math.max(0,1-daylight);lampM.emissiveIntensity=nightF>0.25?1.8:0.15;streetGlowM.opacity=Math.min(0.95,nightF*0.95);for(const c of chunks.values())for(const L of c.lights)L.intensity=nightF>0.25?2.4:0;scene.fog.color.set(nightF>0.25?0x0d1524:0xbfdef2);scene.fog.intensity=nightF>0.25?0.55:1;
if(!gOpen&&!settingsOpen)updCops(dt);
/* rig pose */
pose(me,x,y,z,h,roll,p+airFlip,v,dt,frontSusp.comp,rearSusp.comp,airRoll);
if(wreck>0){const t=1.7-wreck;me.P.rotation.x=-p-t*5;me.R.position.set(.6*t,Math.max(-.3,3*t-5*t*t),-3*t);me.R.rotation.x=-t*8}else{me.R.position.set(0,0,0);me.R.rotation.x=0}
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
for(const[id,r]of rem){if(nowt-r.seen>4000){if(r.rig)scene.remove(r.rig.g);scene.remove(r.walker.g);rem.delete(id);continue}
r.x+=(r.tx-r.x)*kk;r.y+=(r.ty-r.y)*kk;r.z+=(r.tz-r.z)*kk;r.p+=(r.tp-r.p)*kk;r.r+=(r.tr-r.r)*kk;r.v=r.tv;let d=r.th-r.h;d=Math.atan2(Math.sin(d),Math.cos(d));r.h+=d*kk;
r.px+=(r.tpx-r.px)*kk;r.py+=(r.tpy-r.py)*kk;r.pz+=(r.tpz-r.pz)*kk;r.afp+=(r.tfp-r.afp)*kk;r.afr+=(r.tfr-r.afr)*kk;r.fc+=(r.tfc-r.fc)*kk;r.rc+=(r.trc-r.rc)*kk;let wd=r.tph-r.ph;wd=Math.atan2(Math.sin(wd),Math.cos(wd));r.ph+=wd*kk;r.walker.g.position.set(r.px,r.py,r.pz);r.walker.g.rotation.y=r.ph;r.walker.g.visible=r.onFoot;r.rig.g.visible=!r.onFoot;pose(r.rig,r.x,r.y,r.z,r.h,r.r,r.p+r.afp,r.v,dt,r.fc,r.rc,r.afr)}
/* network send */
if(cli&&online&&joined&&now-netT>100){netT=now;try{cli.publish(ROOM+'/s',JSON.stringify({i:ID,n:riderName,x:+x.toFixed(2),y:+y.toFixed(2),z:+z.toFixed(2),h:+h.toFixed(3),p:+p.toFixed(3),r:+roll.toFixed(3),v:+v.toFixed(1),b:S.eq,c:MYC,on:!riding,px:+ox.toFixed(2),py:+oy.toFixed(2),pz:+oz.toFixed(2),ph:+oh.toFixed(3),fp:air?+airFlip.toFixed(3):0,fr:air?+airRoll.toFixed(3):0,fc:+frontSusp.comp.toFixed(3),rc:+rearSusp.comp.toFixed(3)}),{qos:0})}catch(e){console.error('MQTT publish failed:',e)}}
/* audio */
if(AC){const t=AC.currentTime,sp=Math.abs(v),bs=boosting?1:0;mo1.frequency.setTargetAtTime(55+sp*6+bs*40,t,.05);mo2.frequency.setTargetAtTime(300+sp*26+bs*200,t,.05);
mgn.gain.setTargetAtTime(gOpen?.02:.04+.07*thr+Math.min(.04,sp*.001),t,.05);ng.scr.gain.setTargetAtTime(skid?.25:0,t,.05);ng.spk.gain.setTargetAtTime(sparks?.18:0,t,.03);ng.bst.gain.setTargetAtTime(bs?.22:0,t,.1);const nd=Math.min(...cops.map(q=>q.d));sir.frequency.setTargetAtTime(900+300*Math.sin(tt*7),t,.02);sg.gain.setTargetAtTime(wanted?.07*Math.max(.2,1-nd/200):0,t,.1)}
/* HUD */
if(S.cash!==undefined){$('cash-value').textContent='$'+Math.floor(S.cash).toLocaleString()}
const hourF=Math.floor(tod),clockPhase=hourF<6||hourF>=20?'NIGHT':hourF<8?'DAWN':hourF<18?'DAY':hourF<20?'DUSK':'NIGHT';
$('clock').textContent=`${String(hourF).padStart(2,'0')}:${String(Math.floor((tod-hourF)*60)).padStart(2,'0')} · ${clockPhase}`;
$('combo').textContent=trick?`TRICK · ${trick==='handscrape'?'HAND SCRAPE':'TRICK'}`:(p>.15&&wreck<=0?`WHEELIE ${wt.toFixed(1)}s  ×${Math.floor(cb)}`:(wreck>0?'WIPEOUT!':''));
$('sp').innerHTML=riding?Math.round(Math.abs(v)*(units?3.6:2.237))+` <small>${units?'KM/H':'MPH'}</small>`:`<small>ON FOOT · ${walkSpeed?'WALKING':'IDLE'}</small>`;
$('mt').textContent=riding?'DISMOUNT':'MOUNT';
$('bb').style.width=hasBoost?boostE+'%':'0%';$('boost-note').textContent=hasBoost?'BOOST [E] · tap speed for units':'NO BOOST MOUNT · MOD SHOP';
$('net').textContent=online?`Connected: ${1+rem.size} rider${rem.size===1?'':'s'} online`:networkText;
$('wanted').textContent=wanted?`🚨 ${'★'.repeat(wanted)}${'☆'.repeat(6-wanted)} · ${chaseT.toFixed(0)}s${escT>0?' · losing them':''}`:heat>.08?`🚔 POLICE ALERT ${Math.round(heat/1.35*100)}%`:'';
$('sl').style.opacity=boosting?.9:Math.max(0,Math.min(.5,(Math.abs(v)-32)/40));
pt+=dt;svT+=dt;if(svT>3){svT=0;save();if(gOpen)rg()}
drawMM();drawWM(zw);
R.render(scene,cam)}
addEventListener('beforeunload',save);document.addEventListener('visibilitychange',save);
requestAnimationFrame(loop);
window.WheelieXLoading?.finish();
