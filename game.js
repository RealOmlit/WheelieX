import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
const $=id=>document.getElementById(id),PI=Math.PI;
/* ---------- save ---------- */
let S;try{S=JSON.parse(localStorage.getItem('ebl1'))}catch(e){}
S=S||{cash:0,own:[0],eq:0,up:{}};S.suspension=S.suspension||{};S.boostMount=S.boostMount||{};S.overclock=S.overclock||{};
const save=()=>{try{localStorage.setItem('ebl1',JSON.stringify(S))}catch(e){}};
/* ---------- bikes ---------- */
const B=(n,pr,s,c,a,f,sc,wr,tw,wb,bw,bh,sl,sy,hb,fh)=>({n,pr,s,c,a,f,sc,wr,tw,wb,bw,bh,sl,sy,hb,fh});
const BIKES=[
B('Kirkland Signature Cruiser',0,[3,4,8,3],0x2563eb,0xdc2626,0xaaaaaa,0x222222,.34,.12,1.3,.32,.32,.6,.62,.22,0),
B('Super73-RX Mojave',1500,[4,4,7,4],0x56603a,0xd9b97a,0x888888,0xc49a63,.3,.22,1.25,.28,.26,.95,.52,.45,0),
B('Talaria XXX TL2500',3500,[5,5,6,4],0x111111,0x333333,0x555555,0x111111,.36,.1,1.3,.2,.3,.6,.7,.1,0),
B('Surron Hyper Bee',6000,[4,6,6,5],0xef4444,0x111111,0xcccccc,0x111111,.32,.1,1.2,.2,.26,.5,.64,.12,0),
B('Surron Light Bee X',9000,[5,5,6,5],0x1c1c1c,0xfacc15,0xfacc15,0x111111,.34,.1,1.28,.2,.28,.55,.66,.12,0),
B('Talaria Sting R MX4',14000,[6,7,5,6],0x0ea5e9,0x111111,0xd4d4d8,0x111111,.38,.1,1.4,.22,.3,.55,.7,.14,1),
B('E-Ride Pro SS 2.0',20000,[7,7,5,6],0x7c3aed,0x111111,0xa78bfa,0x111111,.34,.11,1.3,.24,.3,.6,.66,.12,0),
B('Segway Dirt eBike X260',28000,[6,6,7,6],0xf5f5f5,0x111111,0x999999,0x222222,.4,.11,1.45,.24,.32,.62,.74,.15,1),
B('Cake Kalk INK',38000,[7,7,6,7],0xf8fafc,0x111111,0xdddddd,0x111111,.35,.1,1.3,.22,.3,.55,.68,.1,0),
B('Surron Ultra Bee HP',52000,[8,8,7,7],0x1f2937,0x22d3ee,0x22d3ee,0x111111,.38,.11,1.4,.26,.32,.6,.72,.14,1),
B('Surron Storm Bee',70000,[9,9,7,9],0x0f172a,0xf59e0b,0xf59e0b,0x111111,.4,.12,1.5,.28,.34,.62,.76,.16,1),
B('Stark VARG 80HP',100000,[10,10,8,10],0xdc2626,0x111111,0x666666,0x111111,.4,.12,1.5,.26,.34,.6,.76,.16,1)];
const SUSPENSIONS=[
{n:'Factory',travel:.08,spring:78,damping:17,price:0},
{n:'Trail long-travel',travel:.36,spring:42,damping:13,price:.18},
{n:'Race firm',travel:.2,spring:105,damping:22,price:.3}];
const lv=i=>S.up[i]||(S.up[i]=[1,1,1,1]),eff=i=>BIKES[i].s.map((s,k)=>S.overclock[i]?10:s+(lv(i)[k]-1)*.55),cost=(i,l)=>Math.round(100*l*l+BIKES[i].pr*.03*l);
const modPrice=(i,m)=>Math.round(Math.max(500,BIKES[i].pr)*m),mountPrice=(i,t)=>Math.round(Math.max(1000,BIKES[i].pr)*(t===1?3:4)),hackPrice=i=>Math.round(Math.max(1000,BIKES[i].pr)*.15);
/* ---------- three setup ---------- */
const cv=$('g'),R=new T.WebGLRenderer({canvas:cv,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,1.5));R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
const scene=new T.Scene();scene.fog=new T.Fog(0xbfdef2,90,230);
const cam=new T.PerspectiveCamera(62,1,.1,2500);
scene.add(new T.HemisphereLight(0xffffff,0x667755,1.0));
const sun=new T.DirectionalLight(0xfff2d8,2.2);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);const sc=sun.shadow.camera;sc.left=sc.bottom=-45;sc.right=sc.top=45;sc.far=250;scene.add(sun,sun.target);
const sky=new T.Mesh(new T.SphereGeometry(1000,16,12),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 p;void main(){float h=clamp(normalize(p).y,0.,1.);gl_FragColor=vec4(mix(vec3(.75,.87,.95),vec3(.18,.45,.85),pow(h,.55)),1.);}'}));scene.add(sky);
const mat=(c,o={})=>new T.MeshStandardMaterial({color:c,roughness:.5,metalness:.3,...o});
const boxGeo=new T.BoxGeometry(1,1,1);
const bx=(w,h,l,m,x,y,z)=>{const o=new T.Mesh(boxGeo,m);o.scale.set(w,h,l);o.position.set(x,y,z);return o};
const tb=(a,b,r,m)=>{const A=new T.Vector3(...a),Bv=new T.Vector3(...b),o=new T.Mesh(new T.CylinderGeometry(r,r,A.distanceTo(Bv),8),m);o.position.copy(A).add(Bv).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),Bv.clone().sub(A).normalize());return o};
/* ---------- bike model ---------- */
function buildBike(d,shirt){
const g=new T.Group(),P=new T.Group();g.add(P);
const M=mat(d.c),A=mat(d.a),F=mat(d.f,{metalness:.9,roughness:.3}),K=mat(0x151515,{roughness:.9,metalness:0}),SM=mat(d.sc,{roughness:.8}),SH=mat(shirt,{metalness:0}),PN=mat(0x222244,{metalness:0});
const wh=z=>{const w=new T.Group();w.position.z=z;const s=new T.Group();w.add(s);
const t=new T.Mesh(new T.CylinderGeometry(d.wr,d.wr,d.tw,20),K);t.rotation.z=1.5708;s.add(t);
const r=new T.Mesh(new T.CylinderGeometry(d.wr*.6,d.wr*.6,d.tw+.01,14),A);r.rotation.z=1.5708;s.add(r);
s.add(bx(d.tw+.03,d.wr*1.5,.05,A,0,0,0));
const hub=new T.Mesh(new T.CylinderGeometry(d.wr*.2,d.wr*.2,d.tw+.035,16),F);hub.rotation.z=PI/2;s.add(hub);
const disc=new T.Mesh(new T.CylinderGeometry(d.wr*.48,d.wr*.48,.025,20),F);disc.rotation.z=PI/2;disc.position.x=-d.tw*.28;s.add(disc);
for(let i=0;i<6;i++){const a=i*PI/3,sp=tb([0,Math.sin(a)*d.wr*.2,Math.cos(a)*d.wr*.2],[0,Math.sin(a)*d.wr*.76,Math.cos(a)*d.wr*.76],.009,F);s.add(sp)}
P.add(w);return{mount:w,spin:s}};
const rw=wh(0),fw=wh(d.wb),wb=d.wb,y0=d.wr*.9,hy=d.wr*2+.18,hz=wb-.22,hby=hy+d.hb*.5+.06;
P.add(bx(d.bw,d.bh,wb*.4,M,0,y0+.12,wb*.42));
const mo=new T.Mesh(new T.CylinderGeometry(.11,.11,d.bw+.06,12),A);mo.rotation.z=1.5708;mo.position.set(0,y0-.08,wb*.3);P.add(mo);
P.add(tb([0,0,0],[0,y0,wb*.35],.04,F));
P.add(tb([0,y0+.2,wb*.55],[0,hy,hz],.05,M));
P.add(tb([0,y0+.15,wb*.3],[0,d.sy,wb*.18],.04,M));
const frontShocks=[-.11,.11].map(sx=>tb([sx,y0*.65,wb],[sx,hy-.1,hz],.035,F));frontShocks.forEach(q=>P.add(q));
const rearShock=tb([0,y0+.1,wb*.24],[0,d.sy,wb*.18],.04,A);P.add(rearShock);
P.add(bx(.2,.09,d.sl,SM,0,d.sy,wb*.18));
[-.07,.07].forEach(sx=>P.add(tb([sx,0,wb],[sx,hy,hz],.03,F)));
P.add(tb([-.32,hby,hz-.08],[.32,hby,hz-.08],.025,F));P.add(tb([0,hy,hz],[0,hby,hz-.08],.03,F));
P.add(bx(.14,.03,.35,M,0,d.wr*(d.fh?1.75:1.2),wb+(d.fh?.1:0)));P.add(bx(.16,.03,.4,M,0,d.wr*1.2,-.18));
const hl=new T.Mesh(new T.SphereGeometry(.07,10,8),new T.MeshBasicMaterial({color:0xffffee}));hl.position.set(0,hby-.06,hz+.08);P.add(hl);
const tl=new T.Mesh(new T.BoxGeometry(.1,.05,.04),new T.MeshBasicMaterial({color:0xff2222}));tl.position.set(0,d.wr*1.2+.02,-.4);P.add(tl);
const glow=new T.Mesh(new T.SphereGeometry(.16,10,8),new T.MeshBasicMaterial({color:0xa855f7,transparent:true,opacity:.8}));glow.position.set(0,y0-.08,wb*.3);glow.visible=false;P.add(glow);
const Rd=new T.Group();P.add(Rd);
Rd.add(tb([0,d.sy+.1,wb*.12],[0,d.sy+.62,wb*.38],.12,SH));
const hd=new T.Mesh(new T.SphereGeometry(.13,12,10),mat(0xffffff));hd.position.set(0,d.sy+.82,wb*.45);Rd.add(hd);
[-1,1].forEach(s=>{Rd.add(tb([s*.2,d.sy+.55,wb*.36],[s*.32,hby,hz-.08],.04,SH));Rd.add(tb([s*.14,d.sy+.1,wb*.12],[s*.22,y0-.1,wb*.32],.055,PN))});
g.traverse(o=>{if(o.isMesh)o.castShadow=true});
return{g,P,rw:rw.spin,fw:fw.spin,rwMount:rw.mount,fwMount:fw.mount,frontShocks,rearShock,R:Rd,glow,wr:d.wr,wb,d};}
function tag(txt,col){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.font='bold 30px system-ui';x.textAlign='center';x.fillStyle='rgba(0,0,0,.5)';x.fillRect(0,8,256,48);x.fillStyle=col;x.fillText(txt,128,43);const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false}));s.scale.set(3,.75,1);s.position.y=2.4;s.renderOrder=9;return s}
function pose(r,X,Y,Z,H,Ro,Pt,V,dt,compression=0){r.g.position.set(X,Y+r.wr,Z);r.g.rotation.set(0,H,Ro);r.P.rotation.x=-Pt;r.P.position.y=-compression;r.rwMount.position.y=compression;r.fwMount.position.y=compression;
const shockScale=Math.max(.55,1-compression*1.5);r.frontShocks.forEach(q=>q.scale.y=shockScale);r.rearShock.scale.y=shockScale;
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
const gGeo=new T.PlaneGeometry(S_,S_).rotateX(-PI/2),rGeo=new T.PlaneGeometry(24,S_).rotateX(-PI/2),bGeo=new T.BoxGeometry(1,1,1).translate(0,.5,0);
const GM=[0x5a5e66,0x5f9e4b,0xcaa56b,0x8f949c].map(c=>mat(c,{roughness:1,metalness:0}));
const rt=(()=>{const c=document.createElement('canvas');c.width=64;c.height=512;const x=c.getContext('2d');x.fillStyle='#34373d';x.fillRect(0,0,64,512);x.fillStyle='#fff';x.fillRect(1,0,2,512);x.fillRect(61,0,2,512);x.fillStyle='#f5c518';x.fillRect(30,0,1.5,512);x.fillRect(33,0,1.5,512);x.fillStyle='#ddd';const u=51.2;for(let i=0;i<10;i++){const y=i*u+u/3;x.fillRect(15.5,y,1.5,u/3);x.fillRect(46,y,1.5,u/3)}const t=new T.CanvasTexture(c);t.anisotropy=4;return t})();
const roadM=mat(0xffffff,{map:rt,roughness:.9,metalness:0}),swM=mat(0x9a9a9a,{roughness:1,metalness:0}),poleM=mat(0x444444),lampM=new T.MeshBasicMaterial({color:0xfff2b0});
const BM=[0x8a94a6,0x6b7a90,0xa7b0c0,0x4b5563,0x9aa5b8].map(c=>mat(c,{roughness:.8})),HM=[0xf2e2c7,0xe8b4a0,0xb9d3e8,0xd9e8b9].map(c=>mat(c,{roughness:.9,metalness:0}));
const roofM=mat(0x7a3b2e,{roughness:.9}),trM=mat(0x5b3a1e,{roughness:1,metalness:0}),lfM=mat(0x2f7d32,{roughness:1,metalness:0}),rkM=mat(0x8b7355,{roughness:1}),cacM=mat(0x3f8f3f,{roughness:1});
const trGeo=new T.CylinderGeometry(.25,.3,2,6),cnGeo=new T.ConeGeometry(1.6,4,7),pGeo=new T.CylinderGeometry(.1,.1,7,6),lGeo=new T.SphereGeometry(.4,8,6),rkGeo=new T.DodecahedronGeometry(1),cacGeo=new T.CylinderGeometry(.35,.35,3,8),hrGeo=new T.ConeGeometry(5.6,2.5,4).rotateY(PI/4);
const orbGeo=new T.CylinderGeometry(.55,.55,.14,16).rotateX(PI/2),orbM=mat(0xffd21f,{emissive:0xaa7700,metalness:.8,roughness:.3}),padGeo=new T.PlaneGeometry(4,8).rotateX(-PI/2),padM=new T.MeshBasicMaterial({color:0x66ddff});
const RM=[0xd97706,0x9a7b4f,0x9ca3af,0xb45309].map(c=>mat(c,{roughness:.8}));
function mkChunk(cx,cz){
const r=rng((cx*73856093)^(cz*19349663)),g=new T.Group(),c={g,id:[cx,cz],ramps:[],cols:[],orbs:[],pads:[],dis:[]},ox=cx*S_,oz=cz*S_;g.position.set(ox,0,oz);
const hw=cx===0,b=hw?r()*3|0:r()*4|0;
const gm=new T.Mesh(gGeo,GM[b]);gm.receiveShadow=true;g.add(gm);
const bk=new Map(),add=(m,x,y,z,cs,dyn)=>{m.position.set(x,y,z);if(dyn||m.geometry.type==='ExtrudeGeometry'){m.castShadow=!!cs;m.receiveShadow=true;g.add(m);return m}m.updateMatrix();const q=m.geometry.clone().applyMatrix4(m.matrix);const a=bk.get(m.material)||bk.set(m.material,[]).get(m.material);a.push(q);return m};
const rp=ex=>{for(let i=0;i<25;i++){const x=(r()-.5)*84,z=(r()-.5)*84;if(!hw||Math.abs(x)>ex)return[x,z]}return[40,40]};
const ramp=(x,z,ry,L,w,H,mi)=>{const sh=new T.Shape();sh.moveTo(0,0);sh.lineTo(L,0);sh.lineTo(L,H);sh.closePath();const geo=new T.ExtrudeGeometry(sh,{depth:w,bevelEnabled:false}).translate(-L/2,0,-w/2);c.dis.push(geo);const m=add(new T.Mesh(geo,RM[mi]),x,0,z,1);m.rotation.y=ry;c.ramps.push({x:ox+x,z:oz+z,L,w,H,co:Math.cos(ry),si:Math.sin(ry)})};
const tree=(x,z)=>{add(new T.Mesh(trGeo,trM),x,1,z);add(new T.Mesh(cnGeo,lfM),x,3.6,z,1)};
const col=(x,z,w,d)=>c.cols.push({x:ox+x,z:oz+z,hw:w/2+.4,hd:d/2+.4});
if(hw){add(new T.Mesh(rGeo,roadM),0,.03,0);
[-13.5,13.5].forEach(x=>{const m=new T.Mesh(bGeo,swM);m.scale.set(3,.2,S_);add(m,x,0,0)});
[-30,0,30].forEach(z=>[-14.5,14.5].forEach(sx=>{add(new T.Mesh(pGeo,poleM),sx,3.5,z);add(new T.Mesh(lGeo,lampM),sx*.9,7.1,z)}));
if(r()<.55)ramp((r()-.5)*14,(r()-.5)*70,r()<.5?-PI/2:PI/2,9,5,2.2,0);
for(let i=0;i<7;i++){const o=new T.Mesh(orbGeo,orbM);const x=(r()*2-1)*9,z=-40+i*12;add(o,x,1.3,z,0,1);c.orbs.push({m:o,x:ox+x,z:oz+z,on:true})}
if(r()<.4){const x=(r()<.5?-1:1)*5,pz=(r()-.5)*60;add(new T.Mesh(padGeo,padM),x,.06,pz);c.pads.push({x:ox+x,z:oz+pz})}}
else{for(let i=0;i<5;i++){const[x,z]=rp(0),o=new T.Mesh(orbGeo,orbM);add(o,x,1.3,z,0,1);c.orbs.push({m:o,x:ox+x,z:oz+z,on:true})}}
if(b===0)for(let i=0;i<9;i++){const[x,z]=rp(27),w=8+r()*8,d=8+r()*8,h=10+r()*38,m=new T.Mesh(bGeo,BM[r()*5|0]);m.scale.set(w,h,d);add(m,x,0,z,1);col(x,z,w,d)}
if(b===1)for(let i=0;i<6;i++){const[x,z]=rp(24),m=new T.Mesh(bGeo,HM[r()*4|0]);m.scale.set(7,4,7);add(m,x,0,z,1);add(new T.Mesh(hrGeo,roofM),x,5.25,z,1);col(x,z,7,7)}
if(b===2){for(let i=0;i<8;i++){const[x,z]=rp(17),m=new T.Mesh(rkGeo,rkM),s=.8+r()*2;m.scale.set(s,s*.7,s);add(m,x,s*.3,z,1)}
for(let i=0;i<6;i++){const[x,z]=rp(17);add(new T.Mesh(cacGeo,cacM),x,1.5,z,1)}
for(let i=0;i<2;i++){const[x,z]=rp(17);ramp(x,z,r()*6.28,9,5,2.2,1)}}
if(b===3)for(let i=0;i<4;i++){const[x,z]=rp(0);ramp(x,z,r()*6.28,8+r()*5,5+r()*3,2+r()*1.8,2+(i&1))}
if(b!==2)for(let i=0;i<7;i++){const[x,z]=rp(17);tree(x,z)}
bk.forEach((a,m)=>{const mg=mergeGeometries(a);a.forEach(q=>q.dispose());c.dis.push(mg);const o=new T.Mesh(mg,m);o.castShadow=m!==roadM&&m!==GM[b]&&m!==swM;o.receiveShadow=true;g.add(o)});
return c}
function gH(x,z){let h=0;const a=Math.round(x/S_),b=Math.round(z/S_);gH.sl=0;gH.e=[0,0];
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
const keys={};let joined=false,riderName='',riding=true;addEventListener('keydown',e=>{keys[e.code]=1;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(joined&&e.code==='KeyF'&&!e.repeat)toggleRide();if(joined&&e.code==='KeyG'&&riding)tg(!gOpen);if(joined&&e.code==='Escape'&&gOpen)tg(false)});
addEventListener('keyup',e=>keys[e.code]=0);addEventListener('blur',()=>{for(const k in keys)keys[k]=0});
document.querySelectorAll('#tc button').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{if(k==='KeyF')toggleRide();else keys[k]=1;e.preventDefault()});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=0))});
/* ---------- state ---------- */
const MYC=new T.Color().setHSL(Math.random(),.8,.5).getHex();
let me=buildBike(BIKES[S.eq],MYC);scene.add(me.g);let myTag=null;
const walker=buildWalker();scene.add(walker.g);walker.g.visible=false;let walkerTag=null;
let x=0,y=0,z=0,h=0,v=0,p=0,pw=0,vy=0,air=false,wreck=0,boostE=0,boosting=false,zt=0,wt=0,cb=1,pad=0,airT=0,roll=0,lastGH=0,lastRd=0,tt=0,pt=0,units=0,svT=0,gOpen=false,gi=S.eq,ga=0,netT=0,camInit=true;
let ox=1.2,oy=0,oz=0,oh=0,opitch=0,lookYaw=0,lookPitch=0,walkSpeed=0,walkCycle=0,suspComp=0,suspVel=0;
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
if(!r){r={rig:null,b:-1,x:d.x,y:d.y,z:d.z,h:d.h,p:d.p,r:d.r,v:0,col:'#'+(d.c>>>0).toString(16).padStart(6,'0'),onFoot:false,px:d.px??d.x,py:d.py??d.y,pz:d.pz??d.z,ph:d.ph??d.h,tx:d.x,ty:d.y,tz:d.z};r.tag=tag(d.n||'Rider','#fff');r.walker=buildWalker(d.c);r.walkerTag=tag(d.n||'Rider','#fff');r.walkerTag.position.y=2.15;r.walkerTag.scale.set(2,.5,1);r.walker.g.add(r.walkerTag);r.walker.g.visible=false;scene.add(r.walker.g);rem.set(d.i,r)}
if(r.b!==d.b){if(r.rig)scene.remove(r.rig.g);r.rig=buildBike(BIKES[d.b],d.c);r.rig.g.add(r.tag);scene.add(r.rig.g);r.b=d.b}
Object.assign(r,{tx:d.x,ty:d.y,tz:d.z,th:d.h,tp:d.on?0:d.p,tr:d.on?0:d.r,tv:d.on?0:d.v,tpx:d.px??d.x,tpy:d.py??d.y,tpz:d.pz??d.z,tph:d.ph??d.h,onFoot:!!d.on,n:d.n,seen:performance.now()})}catch(e){console.error('Invalid rider update:',e)}})
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
const cops=[0,1].map(i=>({c:buildCop(),x:i?4:-4,z:i?-200:200,h:i?0:PI,v:14,dir:i?1:-1,d:999}));cops.forEach(q=>scene.add(q.c.g));
let wanted=0,chaseT=0,escT=0,heat=0;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function copReset(){const playerZ=riding?z:oz;cops.forEach((q,i)=>{q.z=playerZ+(i?-1:1)*210;q.x=i?4:-4;q.v=14;q.h=i?0:PI;q.dir=i?1:-1;q.d=999})}
function updCops(dt){
const px=riding?x:ox,pz=riding?z:oz,ph=riding?h:oh,pv=riding?Math.abs(v):walkSpeed,inTown=Math.abs(px)<180,flash=((tt*8)|0)%2;
cops.forEach((q,i)=>{
q.c.g.visible=wanted||inTown;
if(!q.c.g.visible)return;
if(wanted){
const lead=clamp(Math.hypot(px-q.x,pz-q.z)/Math.max(q.v,12),.25,1.25),tx=px+Math.sin(ph)*pv*lead,tz=pz+Math.cos(ph)*pv*lead;
let err=Math.atan2(tx-q.x,tz-q.z)-q.h;err=Math.atan2(Math.sin(err),Math.cos(err));
q.h+=clamp(err,-1.8*dt,1.8*dt);
const limit=Math.min(34,22+chaseT*.22+i*1.5),target=limit*(.62+.38*Math.max(0,Math.cos(err)));
q.v+=clamp(target-q.v,-7*dt,4*dt);
q.x+=Math.sin(q.h)*q.v*dt;q.z+=Math.cos(q.h)*q.v*dt;
nbr(q.x,q.z,c=>{for(const o of c.cols)if(Math.abs(q.x-o.x)<o.hw+.95&&Math.abs(q.z-o.z)<o.hd+1.8){
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
if(!wanted&&inTown){
const spotted=cops.some(q=>q.d<54&&(pv>18||riding&&p>.55));
heat=clamp(heat+(spotted?dt*(riding&&p>.55?1.15:.72):-dt*.45),0,1.35);
if(heat>=1.35){wanted=1;heat=0;chaseT=0;escT=0;pop('🚨 PURSUIT IN PROGRESS','#f87171')}
}else if(!wanted)heat=Math.max(0,heat-dt*.45);
if(wanted){
chaseT+=dt;const md=Math.min(...cops.map(q=>q.d));
if(cops.some(q=>q.d<3.5)&&(riding?y:oy)<2.1&&chaseT>2.5){
const fine=Math.min(S.cash,Math.floor(100+Math.min(chaseT*18,700)));S.cash-=fine;
pop('BUSTED! -$'+fine.toLocaleString(),'#ef4444');wanted=0;heat=0;v=0;p=0;pw=0;if(!riding){riding=true;h=oh;walker.g.visible=false;camInit=true}copReset()
}else if(md>125&&(pv>10||air)){
escT+=dt;if(escT>8){const reward=Math.floor(200+Math.min(chaseT*15,800));earn(reward);
pop('PURSUIT LOST +$'+reward.toLocaleString(),'#4ade80');wanted=0;heat=0;copReset()}
}else escT=0;
}
$('pl').classList.toggle('pursuit',!!wanted);
}
/* ---------- garage ---------- */
const G=$('gar'),SN=['Motor Power','Torque','Balance','Boost'];
function setBike(i){scene.remove(me.g);me=buildBike(BIKES[i],MYC);if(myTag)me.g.add(myTag);scene.add(me.g)}
function vo(){if(gOpen&&innerWidth>700)cam.setViewOffset(innerWidth,innerHeight,-innerWidth*.2,0,innerWidth,innerHeight);else cam.clearViewOffset();cam.updateProjectionMatrix()}
function tg(o){if(o&&(!riding||wanted)){pop(!riding?'MOUNT YOUR BIKE FIRST':'LOSE THE COPS FIRST','#f87171');return}gOpen=o;G.style.display=o?'block':'none';if(o){gi=S.eq;rg();v=0;p=0;pw=0;air=false;vy=0;y=gH(x,z)}else if(gi!==S.eq)setBike(S.eq);vo()}
function rg(){let t=`<h2>GARAGE <span>$${Math.floor(S.cash).toLocaleString()}</span><button data-a="close">✕</button></h2><div class="grid">`;
BIKES.forEach((b,i)=>{t+=`<div class="card${i===gi?' sel':''}" data-a="pv" data-i="${i}"><b>${b.n}</b><small>${S.own.includes(i)?(i===S.eq?'EQUIPPED':'OWNED'):'$'+b.pr.toLocaleString()}</small>${b.s.map(q=>`<div class="bar"><i style="width:${q*10}%"></i></div>`).join('')}</div>`});
const b=BIKES[gi],own=S.own.includes(gi),e=eff(gi),L=lv(gi),hacked=!!S.overclock[gi];t+=`</div><h3>${b.n}</h3>`;
t+=own?(gi===S.eq?'':'<button class="big" data-a="eq">EQUIP</button>'):`<button class="big" data-a="buy" ${S.cash<b.pr?'disabled':''}>BUY $${b.pr.toLocaleString()}</button>`;
SN.forEach((n,k)=>{const l=L[k];t+=`<div class="row${hacked?' stat-overclocked':''}"><span>${n}</span><div class="bar"><i style="width:${Math.min(100,e[k]*10)}%;${hacked?'background:#ff4149':''}"></i></div><em>${hacked?'MAX':`Lv ${l}`}</em>${own&&!hacked&&l<10?`<button data-a="up" data-k="${k}" ${S.cash<cost(gi,l)?'disabled':''}>$${cost(gi,l).toLocaleString()}</button>`:`<button disabled>${hacked||l>=10?'MAX':'—'}</button>`}</div>`});
const chosen=Number(S.suspension[gi]||0),mounted=Number(S.boostMount[gi]||0);
t+=`<section class="mod-shop"><h3>MOD SHOP</h3><h4>SUSPENSION</h4><div class="mod-grid">`;
SUSPENSIONS.forEach((s,i)=>{const price=modPrice(gi,s.price),selected=chosen===i;t+=`<button class="mod-card${selected?' selected':''}" data-a="susp" data-v="${i}" ${!own||selected||S.cash<price?'disabled':''}><b>${s.n}</b><small>${selected?'INSTALLED':i===0?'FACTORY SETUP':'INSTALL $'+price.toLocaleString()}</small><span>${Math.round(s.travel*100)} cm travel · ${i===1?'soft':i===2?'firm':'stock'} damping</span></button>`});
t+=`</div><h4>BOOST MOUNTS</h4><div class="mod-grid">`;
for(let tier=1;tier<=2;tier++){const total=mountPrice(gi,tier),price=total-(mounted?mountPrice(gi,mounted):0),installed=mounted>=tier;t+=`<button class="mod-card${installed?' selected':''}" data-a="mount" data-v="${tier}" ${!own||installed||S.cash<price?'disabled':''}><b>${tier===1?'Street boost':'Race boost'}</b><small>${installed?'INSTALLED':`${mounted?'UPGRADE':'INSTALL'} · ${tier===1?'300%':'400%'} · $${price.toLocaleString()}`}</small><span>${tier===1?'Balanced assist':'Maximum boost output'}</span></button>`}
t+=`</div><h4>ECU SOFTWARE</h4><div class="mod-card hack-card${hacked?' selected':''}"><b>${hacked?'OVERCLOCK ACTIVE':'FIRMWARE OVERCLOCK'}</b><small>${hacked?'ALL STATS MAXED':'MAX STATS · BOOST SOFTWARE · $'+hackPrice(gi).toLocaleString()}</small><button data-a="hack" ${!own||hacked||S.cash<hackPrice(gi)?'disabled':''}>${hacked?'HACKED':'HACK ECU'}</button></div></section>`;
G.innerHTML=t}
G.onclick=e=>{const t=e.target.closest('[data-a]');if(!t||t.disabled)return;const a=t.dataset.a;
if(a==='close'){tg(false);return}
if(a==='pv'){gi=+t.dataset.i;setBike(gi)}
else if(a==='eq'){S.eq=gi;boostE=(Number(S.boostMount[gi]||0)>0||!!S.overclock[gi])?100:0}
else if(a==='buy'){const pr=BIKES[gi].pr;if(S.cash>=pr){S.cash-=pr;S.own.push(gi);S.eq=gi;boostE=(Number(S.boostMount[gi]||0)>0||!!S.overclock[gi])?100:0}}
else if(a==='up'){const k=+t.dataset.k,l=lv(gi)[k],c=cost(gi,l);if(l<10&&S.cash>=c){S.cash-=c;lv(gi)[k]++}}
else if(a==='susp'){const i=+t.dataset.v;if(S.own.includes(gi)&&Number.isInteger(i)&&i>=0&&i<SUSPENSIONS.length){const price=modPrice(gi,SUSPENSIONS[i].price);if(S.cash>=price){S.cash-=price;S.suspension[gi]=i;suspComp=0;suspVel=0}}}
else if(a==='mount'){const tier=+t.dataset.v,price=mountPrice(gi,tier)-(S.boostMount[gi]?mountPrice(gi,Number(S.boostMount[gi])):0);if(S.own.includes(gi)&&(tier===1||tier===2)&&tier>Number(S.boostMount[gi]||0)&&S.cash>=price){S.cash-=price;S.boostMount[gi]=tier;boostE=100}}
else if(a==='hack'){const price=hackPrice(gi);if(S.own.includes(gi)&&!S.overclock[gi]&&S.cash>=price){S.cash-=price;S.overclock[gi]=true;boostE=100}}
save();rg()};
$('bg').onclick=()=>tg(!gOpen);$('sp').onclick=()=>units^=1;
setTimeout(()=>$('help').remove(),15000);
/* ---------- HUD draw ---------- */
const mm=$('mm'),mx=mm.getContext('2d'),wm=$('wm'),wx=wm.getContext('2d');
function drawMM(){const px=riding?x:ox,pz=riding?z:oz,heading=riding?h:oh,k=1.5,sh=Math.sin(heading),ch=Math.cos(heading),P=(wx_,wz)=>{const dx=wx_-px,dz=wz-pz;return[150+(-dx*ch+dz*sh)*k,150-(dx*sh+dz*ch)*k]};
mx.fillStyle='#3d5a3a';mx.fillRect(0,0,300,300);mx.fillStyle='#50545c';mx.beginPath();[[-12,-200],[12,-200],[12,200],[-12,200]].forEach(([a,b],i)=>{const q=P(a,pz+b);i?mx.lineTo(q[0],q[1]):mx.moveTo(q[0],q[1])});mx.fill();
nbr(px,pz,c=>{mx.fillStyle='#8d96a5';c.cols.forEach(q=>{const s=P(q.x,q.z);mx.fillRect(s[0]-4,s[1]-4,8,8)});mx.fillStyle='#fbbf24';c.ramps.forEach(q=>{const s=P(q.x,q.z);mx.fillRect(s[0]-4,s[1]-4,8,8)});mx.fillStyle='#4ade80';c.orbs.forEach(q=>{if(q.on){const s=P(q.x,q.z);mx.fillRect(s[0]-1.5,s[1]-1.5,3,3)}})});
mx.font='bold 18px system-ui';mx.textAlign='center';
const dot=(X,Z,col,n)=>{const s=P(X,Z);if(s[0]<-10||s[0]>310||s[1]<-10||s[1]>310)return;mx.fillStyle=col;mx.beginPath();mx.arc(s[0],s[1],7,0,7);mx.fill();mx.strokeStyle='#000';mx.lineWidth=2;mx.stroke();mx.fillStyle='#fff';mx.strokeText(n,s[0],s[1]-11);mx.fillText(n,s[0],s[1]-11)};
for(const r of rem.values())dot(r.onFoot?r.px:r.x,r.onFoot?r.pz:r.z,r.col,r.n||'');
cops.forEach(q=>{if(q.c.g.visible)dot(q.x,q.z,((tt*6)|0)%2?'#ff2222':'#2f6bff',wanted?'POLICE':'')});
mx.fillStyle='#fff';mx.strokeStyle='#000';mx.beginPath();mx.moveTo(150,134);mx.lineTo(160,160);mx.lineTo(150,154);mx.lineTo(140,160);mx.closePath();mx.fill();mx.stroke()}
function drawWM(zw){if(p<.04){wm.style.opacity=0;return}wm.style.opacity=1;wx.clearRect(0,0,240,130);const a=q=>PI+q/1.6*PI,arc=(q0,q1,c)=>{wx.beginPath();wx.strokeStyle=c;wx.lineWidth=14;wx.arc(120,120,90,a(q0),a(q1));wx.stroke()};
arc(0,1.6,'rgba(255,255,255,.25)');arc(.8-zw,.8+zw,'#22c55e');arc(1.22,1.6,'#ef4444');wx.strokeStyle='#fff';wx.lineWidth=4;wx.beginPath();wx.moveTo(120,120);wx.lineTo(120+Math.cos(a(Math.min(p,1.6)))*82,120+Math.sin(a(Math.min(p,1.6)))*82);wx.stroke()}
/* ---------- main loop ---------- */
function resize(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;vo()}addEventListener('resize',resize);resize();
loadChunks(0,0);let last=performance.now();const tv=new T.Vector3();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;tt+=dt;
const k=c=>joined&&keys[c],bikeKey=c=>riding&&k(c),thr=bikeKey('KeyW')||bikeKey('ArrowUp')?1:0,br=bikeKey('KeyS')||bikeKey('ArrowDown')?1:0,st=((bikeKey('KeyD')||bikeKey('ArrowRight'))?1:0)-((bikeKey('KeyA')||bikeKey('ArrowLeft'))?1:0),pull=bikeKey('Space')||bikeKey('ShiftLeft')||bikeKey('ShiftRight')?1:0;
const mountTier=Number(S.boostMount[S.eq]||0),overclocked=!!S.overclock[S.eq],boostTier=mountTier||(overclocked?1:0),hasBoost=boostTier>0,bo=bikeKey('KeyE')&&hasBoost;
const E=eff(S.eq),kit=SUSPENSIONS[Number(S.suspension[S.eq]||0)]||SUSPENSIONS[0],zw=.1+.012*E[2];let sparks=0,skid=0;
if(gOpen){ga+=dt*.5;y=gH(x,z);boosting=false;walkSpeed=0}
else if(!riding){
boosting=false;pad=Math.max(0,pad-dt);
const forward=(k('KeyW')||k('ArrowUp')?1:0)-(k('KeyS')||k('ArrowDown')?1:0),side=(k('KeyD')||k('ArrowRight')?1:0)-(k('KeyA')||k('ArrowLeft')?1:0),mag=Math.hypot(forward,side),speed=4.5;
walkSpeed=mag?speed:0;const norm=mag||1;
ox+=(Math.sin(oh)*forward+Math.cos(oh)*side)/norm*walkSpeed*dt;
oz+=(Math.cos(oh)*forward-Math.sin(oh)*side)/norm*walkSpeed*dt;
nbr(ox,oz,c=>{for(const q of c.cols)if(Math.abs(ox-q.x)<q.hw+.3&&Math.abs(oz-q.z)<q.hd+.3){const px=q.hw+.3-Math.abs(ox-q.x),pz=q.hd+.3-Math.abs(oz-q.z);if(px<pz)ox+=Math.sign(ox-q.x||1)*px;else oz+=Math.sign(oz-q.z||1)*pz}});
oy=gH(ox,oz);walkCycle+=dt*walkSpeed*2.6;
walker.g.position.set(ox,oy,oz);walker.g.rotation.y=oh;
const gait=walkSpeed?Math.sin(walkCycle)*.55:0;walker.arms[0].rotation.x=gait;walker.arms[1].rotation.x=-gait;walker.legs[0].rotation.x=-gait;walker.legs[1].rotation.x=gait;
}
else if(wreck>0){wreck-=dt;v*=Math.exp(-2*dt);x+=Math.sin(h)*v*dt;z+=Math.cos(h)*v*dt;if(wreck<=0){wreck=0;v=0;p=0;pw=0;air=false;vy=0;y=gH(x,z);camInit=true}}
else{
boosting=!!bo&&boostE>1;
if(boosting){boostE=Math.max(0,boostE-dt*30/(.6+E[3]*.14));earn(dt*6)}else if(hasBoost)boostE=Math.min(100,boostE+dt*(5+E[3]*1.4));else boostE=0;
if(pad>0)pad-=dt;
const vmax=(16+E[0]*2.6)*(overclocked?1.3:1)*(boosting?(boostTier>1?1.55:1.28):1)*(pad>0&&hasBoost?1.2:1);
if(thr)v+=(4+E[1]*1.1)*(1-Math.max(0,v)/vmax)*dt*1.6;
if(boosting)v+=(8+E[3]*1.3)*dt*(1-v/(vmax*1.1));
if(pad>0&&hasBoost)v+=14*dt;
if(v>vmax)v-=(v-vmax)*1.2*dt;
v-=v*.05*dt+Math.sign(v)*.4*dt;if(Math.abs(v)<.05&&!thr&&!br)v=0;
if(br){if(v>.2){v-=16*dt;skid=v>6&&!air?1:0}else v=Math.max(-5,v-5*dt)}
const lift=Math.min(1,Math.abs(v)/5),wh=p>.1?1:0;
const a=(thr*(.3+E[1]*.04)+pull*2.7+(boosting?.8:0))*lift-3.2*p-1.6*pw-br*7*(p>0?1:0)+(Math.sin(tt*1.7)+.7*Math.sin(tt*2.9+1))*.3*(1-E[2]*.04)*wh;
pw+=a*dt;p+=pw*dt;if(p<0){p=0;pw=Math.max(0,pw)}
earn(dt*Math.max(0,v)*.12);
if(p>.15){wt+=dt;if(Math.abs(p-.8)<zw)zt+=dt;else zt=Math.max(0,zt-dt*1.5);cb=Math.min(10,1+zt*.9);earn(dt*(6+6*p)*Math.floor(cb));if(p>1.22){sparks=1;earn(dt*30*Math.floor(cb))}}else{wt=0;zt=0;cb=1}
if(p>1.45){wreck=1.7;wt=0;zt=0;cb=1;pop('WIPEOUT!','#f43f5e')}
h-=st*(1.9/(1+Math.abs(v)*.04))*(p>.2?.55+.05*E[2]:1)*Math.min(1,Math.abs(v)/3)*(v<0?-1:1)*dt;
roll+=(st*.4*Math.min(1,Math.abs(v)/10)-roll)*Math.min(1,8*dt);
x+=Math.sin(h)*v*dt;z+=Math.cos(h)*v*dt;
nbr(x,z,c=>{for(const q of c.cols)if(Math.abs(x-q.x)<q.hw&&Math.abs(z-q.z)<q.hd){const px=q.hw-Math.abs(x-q.x),pz=q.hd-Math.abs(z-q.z);if(px<pz)x+=Math.sign(x-q.x||1)*px;else z+=Math.sign(z-q.z||1)*pz;v*=.4}});
const gh=gH(x,z),rd=gH.sl*(Math.sin(h)*gH.e[0]+Math.cos(h)*gH.e[1]);
if(air){vy-=22*dt;y+=vy*dt;airT+=dt;if(y<=gh){y=gh;air=false;suspComp=Math.min(kit.travel,Math.abs(vy)*.025);suspVel=0;if(airT>.6){const b=Math.floor(airT*60);earn(b);pop('AIR TIME +$'+b,'#38bdf8')}airT=0;vy=0}else if(y-gh>1)earn(dt*20)}
else{if(lastGH>gh+.25&&v>3){air=true;vy=Math.max(0,lastRd*v);y=lastGH}else y=gh}
if(!air){suspVel+=(-suspComp*kit.spring-suspVel*kit.damping)*dt;suspComp+=suspVel*dt;if(suspComp<0){suspComp=0;suspVel=0}else if(suspComp>kit.travel){suspComp=kit.travel;suspVel=Math.min(0,suspVel)}}
lastGH=gh;lastRd=rd;
nbr(x,z,c=>{for(const o of c.orbs)if(o.on){o.m.rotation.y+=dt*2;o.m.position.y=1.3+Math.sin(tt*3+o.x)*.15;const dx=x-o.x,dz=z-o.z;if(dx*dx+dz*dz<4&&Math.abs(y+.8-o.m.position.y)<3){o.on=false;o.m.visible=false;earn(50)}}
for(const q of c.pads)if(pad<.5&&Math.abs(x-q.x)<2.4&&Math.abs(z-q.z)<4.8&&!air){pad=hasBoost?1.5:.75;if(hasBoost)boostE=Math.min(100,boostE+30);earn(25);pop(hasBoost?'BOOST PAD!':'PAD BONUS +$25','#a78bfa') }});
if(wreck>0){/* wipeout just began */}
}
/* chunks & sun & sky */
const worldX=riding?x:ox,worldZ=riding?z:oz,pcx=Math.round(worldX/S_),pcz=Math.round(worldZ/S_);if(loadChunks.k!==pcx+','+pcz){loadChunks.k=pcx+','+pcz;loadChunks(worldX,worldZ)}
sun.position.set(worldX+60,90,worldZ+40);sun.target.position.set(worldX,0,worldZ);
/* rig pose */
pose(me,x,y,z,h,roll,p,v,dt,suspComp);
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
if(!gOpen)updCops(dt);
/* remotes */
const kk=1-Math.exp(-12*dt),nowt=performance.now();
for(const[id,r]of rem){if(nowt-r.seen>4000){if(r.rig)scene.remove(r.rig.g);scene.remove(r.walker.g);rem.delete(id);continue}
r.x+=(r.tx-r.x)*kk;r.y+=(r.ty-r.y)*kk;r.z+=(r.tz-r.z)*kk;r.p+=(r.tp-r.p)*kk;r.r+=(r.tr-r.r)*kk;r.v=r.tv;let d=r.th-r.h;d=Math.atan2(Math.sin(d),Math.cos(d));r.h+=d*kk;
r.px+=(r.tpx-r.px)*kk;r.py+=(r.tpy-r.py)*kk;r.pz+=(r.tpz-r.pz)*kk;let wd=r.tph-r.ph;wd=Math.atan2(Math.sin(wd),Math.cos(wd));r.ph+=wd*kk;r.walker.g.position.set(r.px,r.py,r.pz);r.walker.g.rotation.y=r.ph;r.walker.g.visible=r.onFoot;r.rig.g.visible=!r.onFoot;pose(r.rig,r.x,r.y,r.z,r.h,r.r,r.p,r.v,dt)}
/* network send */
if(cli&&online&&joined&&now-netT>100){netT=now;try{cli.publish(ROOM+'/s',JSON.stringify({i:ID,n:riderName,x:+x.toFixed(2),y:+y.toFixed(2),z:+z.toFixed(2),h:+h.toFixed(3),p:+p.toFixed(3),r:+roll.toFixed(3),v:+v.toFixed(1),b:S.eq,c:MYC,on:!riding,px:+ox.toFixed(2),py:+oy.toFixed(2),pz:+oz.toFixed(2),ph:+oh.toFixed(3)}),{qos:0})}catch(e){console.error('MQTT publish failed:',e)}}
/* audio */
if(AC){const t=AC.currentTime,sp=Math.abs(v),bs=boosting?1:0;mo1.frequency.setTargetAtTime(55+sp*6+bs*40,t,.05);mo2.frequency.setTargetAtTime(300+sp*26+bs*200,t,.05);
mgn.gain.setTargetAtTime(gOpen?.02:.04+.07*thr+Math.min(.04,sp*.001),t,.05);ng.scr.gain.setTargetAtTime(skid?.25:0,t,.05);ng.spk.gain.setTargetAtTime(sparks?.18:0,t,.03);ng.bst.gain.setTargetAtTime(bs?.22:0,t,.1);const nd=Math.min(...cops.map(q=>q.d));sir.frequency.setTargetAtTime(900+300*Math.sin(tt*7),t,.02);sg.gain.setTargetAtTime(wanted?.07*Math.max(.2,1-nd/200):0,t,.1)}
/* HUD */
if(S.cash!==undefined){$('cash').textContent='$'+Math.floor(S.cash).toLocaleString()}
$('combo').textContent=p>.15&&wreck<=0?`WHEELIE ${wt.toFixed(1)}s  ×${Math.floor(cb)}`:(wreck>0?'WIPEOUT!':'');
$('sp').innerHTML=riding?Math.round(Math.abs(v)*(units?3.6:2.237))+` <small>${units?'KM/H':'MPH'}</small>`:`<small>ON FOOT · ${walkSpeed?'WALKING':'IDLE'}</small>`;
$('mt').textContent=riding?'DISMOUNT':'MOUNT';
$('bb').style.width=hasBoost?boostE+'%':'0%';$('boost-note').textContent=hasBoost?'BOOST [E] · tap speed for units':'NO BOOST MOUNT · MOD SHOP';$('wanted').textContent=wanted?`🚨 PURSUIT ${chaseT.toFixed(0)}s${escT>0?' · losing them':''}`:heat>.08?`🚔 POLICE ALERT ${Math.round(heat/1.35*100)}%`:'';
$('net').textContent=online?`Connected: ${1+rem.size} rider${rem.size===1?'':'s'} online`:networkText;
$('sl').style.opacity=boosting?.9:Math.max(0,Math.min(.5,(Math.abs(v)-32)/40));
pt+=dt;svT+=dt;if(svT>3){svT=0;save();if(gOpen)rg()}
drawMM();drawWM(zw);
R.render(scene,cam)}
addEventListener('beforeunload',save);document.addEventListener('visibilitychange',save);
requestAnimationFrame(loop);
window.WheelieXLoading?.finish();
