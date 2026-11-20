/* Run from the project folder:  node patch-tuning-v1.25.js
   Backs up game.js to game.pre-1.25.js, then wires in tuning.js and town.js.
   Every edit must match exactly once, otherwise nothing is written. */
const fs=require('fs');
const file='game.js';
let src=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const edits=[];
const E=(name,from,to)=>edits.push({name,from,to});

E('version',`VERSION='1.24'`,`VERSION='1.25'`);
E('imports',`import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";`,
`import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { SUSPENSIONS, tuneStat, tuneSoft, suspKit, suspLocked, bikeSpec, tuneDress, createTuningGarage } from "./tuning.js";
import { TOWN, buildTown, isTownChunk, inConnector } from "./town.js";`);
E('old suspension list',`const SUSPENSIONS=[`,`const SUSPENSIONS_V124=[`);
E('stats from hardware',`Math.min(10,s*(1+(lv(i)[k]-1)*.015)*(1+(rarity?.boost||0)))`,`Math.min(10,s*(1+(lv(i)[k]-1)*.015)*(1+(rarity?.boost||0))*tuneStat(S,i,k))`);
E('dressBike plate index',`Math.max(0,BIKES.indexOf(d))`,`Math.max(0,BIKES.indexOf(d.base||d))`);
E('dressBike plate texture',`numberPlateTex(idx)`,`numberPlateTex(d.plate!=null?d.plate:idx)`);
E('first bike build',`try{me=buildBike(BIKES[S.eq],MYC,HELMETS[S.helmet]?.color||0x20272a,true);}`,`try{me=buildBike(bikeSpec(BIKES[S.eq],S,S.eq),MYC,HELMETS[S.helmet]?.color||0x20272a,true);tuneDress(me,S,S.eq);}`);
E('setBike',`me=buildBike(BIKES[i],MYC,HELMETS[S.helmet]?.color||0x20272a,true);if(myTag)me.g.add(myTag);scene.add(me.g)}`,`me=buildBike(bikeSpec(BIKES[i],S,i),MYC,HELMETS[S.helmet]?.color||0x20272a,true);tuneDress(me,S,i);if(myTag)me.g.add(myTag);scene.add(me.g)}`);
E('town chunks stay empty',`const gm=new T.Mesh(gGeo,hw?GM[0]:b===3?dirtM:GM[b]);gm.receiveShadow=true;g.add(gm);`,`const gm=new T.Mesh(gGeo,hw?GM[0]:b===3?dirtM:GM[b]);gm.receiveShadow=true;g.add(gm);if(isTownChunk(cx,cz))return c;`);
E('keep the connector road clear',`if(!hw||Math.abs(x)>ex)return[x,z]`,`if((!hw||Math.abs(x)>ex)&&!inConnector(ox+x,oz+z))return[x,z]`);
E('town colliders',`function nbr(x,z,f){`,`function nbr(x,z,f){if(town.near(x,z))f(town.c);`);
E('night windows',`for(const m of BM)m.emissiveIntensity=nf*1.2;`,`for(const m of BM)m.emissiveIntensity=nf*1.2;town.setNight(nf);`);
E('tune stage kit',`kit=SUSPENSIONS[Number(S.suspension[S.eq]||0)]||SUSPENSIONS[0]`,`kit=suspKit(S,S.eq)`);
E('software top speed',`motorScale=1+Math.min(.45,Math.max(0,E[0]/bike.s[0]-1)*.2)`,`motorScale=(1+Math.min(.45,Math.max(0,E[0]/bike.s[0]-1)*.2))*tuneSoft(S,S.eq).vmax`);
E('pose + ride height',`pose(me,x,y,z,h,roll,p+airFlip,v,dt,frontSusp.comp*1.1,rearSusp.comp*1.1,airRoll);`,
`town.update(riding?x:ox,riding?z:oz);if(me.R)me.R.visible=!tgarage.on;
if(tgarage.on){const tp=tgarage.spot;pose(me,tp.x,tp.y,tp.z,tgarage.heading(ga),0,0,0,dt,kit.rideOff,kit.rideOff,0)}else pose(me,x,y,z,h,roll,p+airFlip,v,dt,frontSusp.comp*1.1+kit.rideOff,rearSusp.comp*1.1+kit.rideOff,airRoll);`);
E('wreck pose off in tuning',`if(wreck>0){const t=Math.min(1,(1.7-wreck)*2.4);`,`if(wreck>0&&!tgarage.on){const t=Math.min(1,(1.7-wreck)*2.4);`);
E('garage camera',`if(gOpen){cam.position.set(x+Math.cos(ga)*4.2,y+1.6,z+Math.sin(ga)*4.2);cam.lookAt(x,y+.7,z);cam.fov=45}`,
`if(gOpen){if(tgarage.on)tgarage.camera(cam);else{cam.position.set(x+Math.cos(ga)*4.2,y+1.6,z+Math.sin(ga)*4.2);cam.lookAt(x,y+.7,z)}cam.fov=45}`);
E('view offset',`cam.setViewOffset(innerWidth,innerHeight,-innerWidth*.2,0,innerWidth,innerHeight)`,`cam.setViewOffset(innerWidth,innerHeight,(tgarage.on?1:-1)*innerWidth*.2,0,innerWidth,innerHeight)`);
E('closing the garage closes tuning',`function tg(o){if(settingsOpen)return;`,`function tg(o){if(settingsOpen)return;if(!o&&tgarage.on)tgarage.close(true);`);
E('garage tab button',`>RIDEOUTS</button></div>\${priceSel}`,`>RIDEOUTS</button><button data-a="tune">🔧 TUNING</button></div>\${priceSel}`);
E('garage tab click',`if(a==='close'){tg(false);return}`,`if(a==='close'){tg(false);return}
if(a==='tune'){tgarage.open();return}`);
E('mod shop label',`\${i===1?'soft':i===2?'firm':'stock'} damping`,`\${s.blurb}`);
E('mod shop lock',`const price=modPrice(gi,SUSPENSIONS[i].price);if(S.cash>=price){S.cash-=price;S.suspension[gi]=i;`,`const price=modPrice(gi,SUSPENSIONS[i].price);if(suspLocked(S,gi,i)){pop('INSTALL RACE SUSPENSION FIRST','#facc15');return}if(S.cash>=price){S.cash-=price;S.suspension[gi]=i;`);
E('init block',`/* ---------- HUD draw ---------- */`,
`/* ---------- v1.25: Tuning garage + Maple Hollow town ---------- */
const town=buildTown(scene);
const tgarage=createTuningGarage({scene,S,save,BIKES,pop,vo,rebuild:()=>setBike(S.eq),onEnter:()=>{G.style.display='none'},onExit:()=>{G.style.display='block';rg()}});
addEventListener('keydown',e=>{if(e.code!=='KeyJ'||e.repeat||!joined||gOpen||settingsOpen||!riding||wanted)return;x=town.spawn.x;z=town.spawn.z;y=gH(x,z);h=PI/2;v=0;p=0;pw=0;wheelieHold=0;air=false;vy=0;camInit=true;pop('WELCOME TO '+TOWN.name.toUpperCase(),'#fbbf24',3000)});
/* ---------- HUD draw ---------- */`);

let out=src,bad=0;
for(const e of edits){const n=out.split(e.from).length-1;if(n!==1){console.error(`✗ ${e.name}: found ${n} matches (need exactly 1)`);bad++;continue}out=out.replace(e.from,()=>e.to);console.log('✓ '+e.name)}
if(bad){console.error(`\nNo changes written. ${bad} edit(s) did not match. Send me the current game.js.`);process.exit(1)}
fs.copyFileSync(file,'game.pre-1.25.js');fs.writeFileSync(file,out);
console.log(`\nDone. Backup: game.pre-1.25.js. Make sure tuning.js and town.js are next to game.js.`);
