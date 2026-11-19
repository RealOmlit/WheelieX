/* town.js — E-Ride Life v1.25: "Maple Hollow", an autumn suburb east of the highway (press J to teleport). */
import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
const PI=Math.PI;
/* The town fills world chunks cx 4..6, cz -1..1 (x 315..585, z -135..135). A 24 m road links it to the highway. */
export const TOWN={name:'Maple Hollow',x:450,z:0,w:270,d:270,spawn:{x:380,z:0}};
export const isTownChunk=(cx,cz)=>cx>=4&&cx<=6&&cz>=-1&&cz<=1;
export const inConnector=(wx,wz)=>wz>-18&&wz<18&&wx>6&&wx<TOWN.x-TOWN.w/2+10;

export function buildTown(scene){
 const g=new T.Group();g.position.set(TOWN.x,0,TOWN.z);
 const c={cols:[],ramps:[],bld:[],trees:[],lights:[],peds:[],dis:[],pads:[]};
 const rng=(s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296})(20261119);
 const M=(col,o={})=>new T.MeshStandardMaterial({color:col,roughness:.85,metalness:0,...o});
 const glow=[];
 /* ---- merged-geometry helpers: everything solid is batched per material ---- */
 const bk=new Map(),U={box:new T.BoxGeometry(1,1,1),cyl:new T.CylinderGeometry(1,1,1,12),ico:new T.IcosahedronGeometry(1,1)};
 const Q=new T.Quaternion(),E=new T.Euler(),V3=new T.Vector3(),S3=new T.Vector3(),MX=new T.Matrix4();
 const put=(m,geo,x,y,z,sx,sy,sz,ry=0,rz=0)=>{E.set(0,ry,rz);Q.setFromEuler(E);MX.compose(V3.set(x,y,z),Q,S3.set(sx,sy,sz));let q=geo.clone().applyMatrix4(MX);if(q.index)q=q.toNonIndexed();
  const o=new T.BufferGeometry();o.setAttribute('position',q.attributes.position);o.setAttribute('normal',q.attributes.normal);let a=bk.get(m);if(!a)bk.set(m,a=[]);a.push(o)};
 const box=(m,w,h,d,x,y,z,ry=0)=>put(m,U.box,x,y,z,w,h,d,ry);
 const cyl=(m,r,h,x,y,z)=>put(m,U.cyl,x,y,z,r,h,r);
 const cylX=(m,r,len,x,y,z)=>put(m,U.cyl,x,y,z,r,len,r,0,PI/2);
 const blob=(m,r,x,y,z,sy=1)=>put(m,U.ico,x,y,z,r,r*sy,r);
 const gable=(m,span,hgt,len,x,y,z,ry)=>{const sh=new T.Shape();sh.moveTo(-span/2,0);sh.lineTo(span/2,0);sh.lineTo(0,hgt);sh.closePath();const geo=new T.ExtrudeGeometry(sh,{depth:len,bevelEnabled:false});geo.translate(0,0,-len/2);put(m,geo,x,y,z,1,1,1,ry)};
 const solid=(x,z,w,d,h=Infinity)=>{c.cols.push({x:TOWN.x+x,z:TOWN.z+z,hw:w/2+.4,hd:d/2+.4,h});c.bld.push({x:TOWN.x+x,z:TOWN.z+z,w,d,h:d})};
 const canvasTex=(w,h,draw)=>{const cv=document.createElement('canvas');cv.width=w;cv.height=h;draw(cv.getContext('2d'),w,h);const t=new T.CanvasTexture(cv);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t};
 /* ---- materials ---- */
 const asphalt=M(0x3b3e45,{roughness:.95}),walk=M(0xb9bcc2),white=M(0xf2f2f0,{roughness:.6}),curb=M(0x9da1a8),lotM=M(0x474a51,{roughness:.95});
 const grassTex=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#5f9a48';x.fillRect(0,0,w,h);for(let i=0;i<5000;i++){const s=Math.random()*40|0;x.fillStyle='rgba('+(70+s)+','+(130+s)+','+(60+s/2)+',.35)';x.fillRect(Math.random()*w,Math.random()*h,2,3)}});
 grassTex.wrapS=grassTex.wrapT=T.RepeatWrapping;grassTex.repeat.set(54,54);
 const windowM=M(0x9fd6e8,{emissive:0xffd58a,emissiveIntensity:0,roughness:.2,metalness:.3});
 const lampM=M(0xffe2a0,{emissive:0xffb35e,emissiveIntensity:.1,roughness:.3});
 const glassM=M(0x4e86a3,{roughness:.12,metalness:.85,emissive:0xffd58a,emissiveIntensity:0});
 const dkGlass=M(0x1d2c38,{roughness:.1,metalness:.7});
 const storeGlass=new T.MeshStandardMaterial({color:0x7ec8e3,roughness:.1,metalness:.55,transparent:true,opacity:.62,emissive:0xbfe9ff,emissiveIntensity:0});
 glow.push(windowM,lampM,glassM,storeGlass);
 const body=[0xf2e2c7,0xe8b4a0,0xb9d3e8,0xd9e8b9,0xe9d2e8,0xd7d7d7,0xf4e5a8].map(h=>M(h)),roofs=[0x7a3b2e,0x4a4f5c,0x8c3a2a,0x3f4a3a,0x5b3a1e].map(h=>M(h)),
  door=M(0x6b3f2a),brick=M(0x8c4a3a),trunk=M(0x5b3a1e),autumn=[0xd9531e,0xe8a317,0xc6402a,0xb8b02a,0x9a5a1e,0xe07b1a].map(h=>M(h,{flatShading:true})),
  signalYel=M(0xf2b807,{roughness:.5}),redL=M(0xff2a2a,{emissive:0xff2a2a,emissiveIntensity:.8}),grnL=M(0x2aff6a,{emissive:0x2aff6a,emissiveIntensity:.5}),pole=M(0x4a4d55,{metalness:.5,roughness:.6}),band=M(0xaab4c0),tire=M(0x111111),chim=M(0x7b6a63),saw=M(0x6f6764);
 /* ---- ground ---- */
 const gr=new T.Mesh(new T.PlaneGeometry(TOWN.w,TOWN.d).rotateX(-PI/2),M(0xffffff,{map:grassTex,roughness:1}));gr.position.y=.012;gr.receiveShadow=true;g.add(gr);
 /* ---- roads ---- */
 const roadTex=(lanes,len)=>{const t=canvasTex(512,256,(x,w,h)=>{x.fillStyle='#3a3d44';x.fillRect(0,0,w,h);for(let i=0;i<5000;i++){const s=45+Math.random()*30|0;x.fillStyle='rgba('+s+','+s+','+(s+3)+',.22)';x.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*3,1+Math.random()*3)}
  x.fillStyle='#ececea';x.fillRect(14,0,8,h);x.fillRect(w-22,0,8,h);
  for(let i=1;i<lanes;i++){const px=i/lanes*w;if(i===lanes/2){x.fillStyle='#f2bd35';x.fillRect(px-11,0,7,h);x.fillRect(px+4,0,7,h)}else{x.fillStyle='#ececea';x.fillRect(px-3,0,6,h*.45)}}});
  t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(1,len/16);return t};
 const roadMesh=(parent,w,len,lanes,x,z,alongX,y=.035)=>{const geo=new T.PlaneGeometry(w,len).rotateX(-PI/2);if(alongX)geo.rotateY(PI/2);const m=new T.Mesh(geo,new T.MeshStandardMaterial({map:roadTex(lanes,len),roughness:.92,metalness:0}));m.position.set(x,y,z);m.receiveShadow=true;parent.add(m);return m};
 /* connector from the highway shoulder (world x 15) to the town edge (x 315), always in the scene so it shows from the highway */
 roadMesh(scene,24,300,6,165.05,0,true);
 roadMesh(g,24,270,6,0,0,true);                         /* E-W boulevard */
 roadMesh(g,24,270,6,0,0,false,.034);                   /* N-S boulevard */
 const plain=new T.Mesh(new T.PlaneGeometry(24,24).rotateX(-PI/2),asphalt);plain.position.set(0,.036,0);plain.receiveShadow=true;g.add(plain);
 for(const sz of [-85,85])for(const sx of [-1,1])roadMesh(g,10,123,2,sx*73.5,sz,true,.036);   /* residential streets, split at the boulevard */
 /* sidewalks, crosswalks */
 for(const sx of [-1,1])for(const sz of [-1,1]){
  box(walk,123,.08,3,sx*73.5,.04,sz*13.5);box(walk,3,.08,123,sx*13.5,.04,sz*73.5);
  for(const s2 of [-85,85]){box(walk,123,.08,2,sx*73.5,.04,s2-7);box(walk,123,.08,2,sx*73.5,.04,s2+7)}}
 for(const s of [-1,1]){for(let i=-10.5;i<=10.5;i+=1.4){box(white,.7,.02,3.2,i,.047,s*17);box(white,3.2,.02,.7,s*17,.047,i)}}
 /* traffic lights on the four corners + street lamps */
 for(const sx of [-1,1])for(const sz of [-1,1]){const x0=sx*13,z0=sz*13;cyl(pole,.13,6,x0,3,z0);box(pole,.14,.14,10,x0,6,z0-sz*5);
  for(const zz of [z0-sz*8.5,z0-sz*5]){box(signalYel,.4,1.15,.4,x0,5.2,zz);put(redL,U.ico,x0,5.55,zz+sz*.22,.11,.11,.11);put(lampM,U.ico,x0,5.2,zz+sz*.22,.11,.11,.11);put(grnL,U.ico,x0,4.85,zz+sz*.22,.11,.11,.11)}}
 const lamp=(x,z,dx,dz)=>{cyl(pole,.1,7,x,3.5,z);box(pole,Math.abs(dx)||.12,.1,Math.abs(dz)||.12,x+dx/2,7,z+dz/2);box(lampM,.5,.14,.3,x+dx,6.9,z+dz)};
 for(let x=-120;x<=120;x+=30){if(Math.abs(x)<20)continue;lamp(x,13.5,0,-1.2);lamp(x,-13.5,0,1.2)}
 for(let z=-120;z<=120;z+=30){if(Math.abs(z)<20)continue;lamp(13.5,z,-1.2,0);lamp(-13.5,z,1.2,0)}
 /* ---- occupancy so trees and houses stay out of each other's way ---- */
 const occ=[],claim=(x,z,w,d,m=0)=>occ.push([x-w/2-m,x+w/2+m,z-d/2-m,z+d/2+m]);
 const blocked=(x,z,r)=>{if(Math.abs(x)<18+r||Math.abs(z)<18+r||Math.abs(Math.abs(z)-85)<9+r)return true;for(const o of occ)if(x>o[0]-r&&x<o[1]+r&&z>o[2]-r&&z<o[3]+r)return true;return false};
 /* ---- houses ---- */
 const house=(x,z,face,streetZ)=>{const w=9+rng()*4,d=9+rng()*3,h=4.4+rng()*1.6,bm=body[rng()*body.length|0],rm=roofs[rng()*roofs.length|0],fz=z+face*d/2;
  box(bm,w,h,d,x,h/2,z);gable(rm,d+1.4,2.8+rng(),w+1.4,x,h,z,PI/2);box(brick,.9,2.6,.9,x+w*.25,h+2,z);
  box(door,1.4,2.4,.16,x-w*.18,1.2,fz+face*.06);box(walk,2.4,.2,1.2,x-w*.18,.1,fz+face*.6);
  for(const wx of [.2,.38])box(windowM,1.5,1.3,.14,x+(wx-.5)*w+w*.18,2.5,fz+face*.05);
  box(windowM,.14,1.3,1.5,x+w/2+.05,2.5,z);box(windowM,.14,1.3,1.5,x-w/2-.05,2.5,z);box(windowM,1.5,1.3,.14,x,2.5,z-face*(d/2+.05));
  const edge=streetZ+(z<streetZ?-7:7),len=Math.abs(edge-fz);box(lotM,3.2,.05,len,x-w*.18+3,.05,(edge+fz)/2);
  solid(x,z,w,d);claim(x,z,w+2,d+2,3)};
 for(const [rz,face,sz] of [[-102,1,-85],[-68,-1,-85],[68,1,85],[102,-1,85]])for(const hx of [-120,-96,-72,-48,48,72,96,120]){if(rz===-102&&hx>72)continue;house(hx+(rng()-.5)*4,rz,rz<sz?1:-1,sz)}
 /* ---- convenience store + car park (north-west of the intersection) ---- */
 {const LX=-54,LZ=-42;box(lotM,56,.1,36,LX,.05,LZ);claim(LX,LZ,58,38,2);
  for(let i=0;i<17;i++){box(white,.14,.02,5.6,LX-26+i*3.25,.11,LZ+2);box(white,.14,.02,5.6,LX-26+i*3.25,.11,LZ+11)}
  const sm=M(0xdadde4),roof=M(0x8d8a99,{roughness:.7}),sz=-52;
  box(sm,26,6,10,LX,3,sz);box(roof,28.4,.7,12.4,LX,6.3,sz);box(dkGlass,26.2,.5,.1,LX,5.2,sz+5.05);
  box(storeGlass,23,3.5,.2,LX,2.2,sz+5.1);for(let i=-5;i<=5;i++)box(dkGlass,.18,3.6,.3,LX+i*2.3,2.2,sz+5.1);
  box(door,2.2,2.6,.25,LX+8.2,1.4,sz+5.15);box(lampM,7,1.1,.25,LX-6,5.2,sz+5.3);
  solid(LX,sz,26,10);
  const carCols=[0xc0392b,0x2c5aa0,0xe8e8e8,0x2d2d33,0xe0a82e,0x3f8f5f];
  const car=(x,z,col,ry)=>{const cm=M(col,{roughness:.35,metalness:.4});box(cm,1.9,.7,4.3,x,.6,z,ry);box(dkGlass,1.6,.65,2.3,x,1.2,z-.2,ry);for(const sx of [-1,1])for(const sz2 of [-1.3,1.3])cylX(tire,.36,.25,x+sx*.95,.36,z+sz2);solid(x,z,2,4.4,1.8)};
  [[-72,-27],[-66,-27],[-60,-38],[-48,-38],[-40,-27],[-34,-38]].forEach((p,i)=>car(p[0],p[1],carCols[i],0));
  const sign=new T.Mesh(new T.PlaneGeometry(9,1.6),new T.MeshBasicMaterial({map:canvasTex(512,96,(x,w,h)=>{x.fillStyle='#14342a';x.fillRect(0,0,w,h);x.fillStyle='#ffd54a';x.font='bold 64px "Fredoka","Arial Rounded MT Bold",system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('MAPLE MART',w/2,h/2+4)})}));
  sign.position.set(LX-6,5.2,sz+5.46);g.add(sign)}
 /* ---- glass office tower (east of the intersection) ---- */
 {const X=60,Z=-45,w=28,d=26,h=34;box(glassM,w,h,d,X,h/2,Z);for(let y=3.4;y<h;y+=3.4)box(band,w+.4,.25,d+.4,X,y,Z);for(const sx of [-1,1])for(const sz of [-1,1])box(band,.6,h,.6,X+sx*w/2,h/2,Z+sz*d/2);box(M(0x8d95a1),w+1,.8,d+1,X,h+.4,Z);solid(X,Z,w,d);claim(X,Z,w+2,d+2,3)}
 /* ---- civic building + factory with chimneys ---- */
 {const X=-58,Z=48;box(M(0xc9b79c),36,8,16,X,4,Z);box(M(0x4a4f5c),38,.8,18,X,8.4,Z);for(let i=-7;i<=7;i++)box(windowM,1.6,2,.14,X+i*2.3,4.6,Z-8.05);for(let i=-3;i<=3;i++)box(white,.7,6,.7,X+i*4.8,3,Z-8.8);solid(X,Z,36,16);claim(X,Z,38,18,3)}
 {const X=102,Z=-118;box(M(0x8a7d78),36,12,22,X,6,Z);box(M(0x5b5350),38,.8,24,X,12.4,Z);for(let i=0;i<5;i++)gable(saw,7,2.4,22,X-14+i*7,12.8,Z,0);
  for(const cx of [-8,2]){cyl(chim,1.5,26,X+cx,13,Z+14);cyl(chim,1.6,1.2,X+cx,26.4,Z+14)}solid(X,Z,36,22);claim(X,Z,38,24,3)}
 /* ---- autumn trees ---- */
 let placed=0;for(let tries=0;tries<700&&placed<140;tries++){const x=(rng()-.5)*262,z=(rng()-.5)*262;if(blocked(x,z,2.5))continue;
  const s=1.7+rng()*1.3,m=autumn[rng()*autumn.length|0];cyl(trunk,.28*s/1.5,2.4*s/1.5,x,1.2*s/1.5,z);blob(m,1.9*s/1.4,x,3.4*s/1.5+1,z,.85);blob(autumn[rng()*autumn.length|0],1.4*s/1.4,x+.5*s/2,4.6*s/1.5+1,z-.3,.9);
  if(placed<60)c.trees.push({x:TOWN.x+x,z:TOWN.z+z});claim(x,z,1.5,1.5);placed++}
 /* ---- build the merged meshes ---- */
 for(const [m,geos] of bk){const merged=mergeGeometries(geos);geos.forEach(q=>q.dispose());if(!merged)continue;const o=new T.Mesh(merged,m);o.castShadow=m!==white&&m!==walk&&m!==lotM;o.receiveShadow=true;g.add(o)}
 scene.add(g);
 return{group:g,c,spawn:TOWN.spawn,
  near:(x,z)=>Math.abs(x-TOWN.x)<TOWN.w/2+25&&Math.abs(z-TOWN.z)<TOWN.d/2+25,
  update:(px,pz)=>{g.visible=Math.hypot(px-TOWN.x,pz-TOWN.z)<470},
  setNight:n=>{windowM.emissiveIntensity=n*1.1;glassM.emissiveIntensity=n*.45;storeGlass.emissiveIntensity=n*.6;lampM.emissiveIntensity=.1+n*1.8}}}