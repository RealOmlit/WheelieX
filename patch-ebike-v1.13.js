// usage: node patch-ebike-v1.13.js path/to/your-game.js
// Writes <name>.v1.13.js next to it. Every edit must match exactly once, otherwise it aborts and tells you which one.
import fs from 'node:fs';
const src = process.argv[2];
if (!src) { console.error('usage: node patch-ebike-v1.13.js your-game.js'); process.exit(1); }
let t = fs.readFileSync(src, 'utf8');
const P = (name, a, b) => {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.error(`FAILED "${name}": found ${n} matches (need 1). Nothing written.`); process.exit(1); }
  t = t.replace(a, () => b);
};
const R = String.raw;

/* ---------- version + imports ---------- */
P('version', R`VERSION='1.12'`, R`VERSION='1.13'`);
P('import', R`import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";`, R`import { OutputPass } from "three/addons/postprocessing/OutputPass.js";`);

/* ---------- graphics presets (ultra used 161x161 chunks and overflowed the particle buffers) ---------- */
P('gfx-high', R`shadowSize:1024,particles:1,chunks:3,post:true,bloom:true,parts:1.5}`, R`shadowSize:2048,particles:1,chunks:3,post:true,bloom:true,msaa:4,parts:1.5}`);
P('gfx-ultra', R`shadowSize:4096,particles:15,chunks:80,post:true,bloom:true,ssaodist:64,parts:10}`, R`shadowSize:4096,particles:4,chunks:4,post:true,bloom:true,msaa:4,parts:2.5}`);
P('gfx-4k', R`shadowSize:4096,particles:2,chunks:10,post:true,bloom:true,ssaodist:64,parts:3}`, R`shadowSize:4096,particles:3,chunks:4,post:true,bloom:true,msaa:4,parts:2}`);
P('particles-a', R`pp=new Float32Array(520*3),pc=new Float32Array(520*3),pq=Array.from({length:520}`, R`pp=new Float32Array(4096*3),pc=new Float32Array(4096*3),pq=Array.from({length:4096}`);
P('particles-b', R`for(let i=0;i<520;i++){pp[i*3+1]=-999;`, R`for(let i=0;i<4096;i++){pp[i*3+1]=-999;`);

/* ---------- renderer / lighting / sky ---------- */
P('tonemap', R`const aniso=Math.min(8,R.capabilities.getMaxAnisotropy());`, R`R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.05;const aniso=Math.min(8,R.capabilities.getMaxAnisotropy());`);
P('fog', R`const scene=new T.Scene();scene.fog=new T.Fog(0xbfdef2,90,230);`, R`const FOG_D=new T.Color(0xbfdef2),FOG_N=new T.Color(0x0a1020);const scene=new T.Scene();scene.fog=new T.Fog(0xbfdef2,70,260);`);
P('shadow-bias', R`scene.add(sun,sun.target);`, R`sun.shadow.bias=-.0004;sun.shadow.normalBias=.05;scene.add(sun,sun.target);`);
P('sky-uniforms', R`uniforms:{daylight:{value:1}}`, R`uniforms:{daylight:{value:1},warm:{value:0},sunDir:{value:new T.Vector3(.5,.8,.3)}}`);
P('sky-frag-a', R`'uniform float daylight;varying vec3 p;void main(){float h=clamp(normalize(p).y,0.,1.);`, R`'uniform float daylight,warm;uniform vec3 sunDir;varying vec3 p;void main(){vec3 d=normalize(p);float h=clamp(d.y,0.,1.);`);
P('sky-frag-b', R`gl_FragColor=vec4(mix(night,day,daylight),1.);}'`, R`vec3 col=mix(night,day,daylight);col=mix(col,vec3(1.,.55,.3),warm*.55*pow(1.-h,3.));float s=max(dot(d,normalize(sunDir)),0.);col+=vec3(1.,.85,.6)*(pow(s,48.)*.35+pow(s,900.)*2.)*daylight;gl_FragColor=vec4(col,1.);}'`);
P('night-lighting',
  R`lampM.emissiveIntensity=nightF>0.25?1.8:0.15;streetGlowM.opacity=Math.min(0.95,nightF*0.95);for(const c of chunks.values())for(const L of c.lights)L.intensity=nightF>0.25?2.4:0;scene.fog.color.set(nightF>0.25?0x0d1524:0xbfdef2);scene.fog.intensity=nightF>0.25?0.55:1;`,
  R`const nf=Math.min(1,nightF*1.6);lampM.emissiveIntensity=.15+1.9*nf;streetGlowM.opacity=Math.min(.6,nf*.6);for(const c of chunks.values())for(const L of c.lights)L.intensity=nf*45;for(const m of BM)m.emissiveIntensity=nf*1.2;if(me.beam)me.beam.intensity=nf*160;scene.fog.color.copy(FOG_N).lerp(FOG_D,daylight);skyMaterial.uniforms.sunDir.value.copy(sun.position).sub(sun.target.position).normalize();skyMaterial.uniforms.warm.value=Math.max(0,1-Math.abs(daylight*2-1)*1.7);`);
P('hemi', R`hemi.intensity=0.55+0.45*daylight;`, R`hemi.intensity=0.2+0.8*daylight;`);

/* ---------- post-processing: MSAA + tone mapping + sane bloom (SSAO removed, it was built with a 64px buffer) ---------- */
P('composer',
  R`if(g.post){if(!composer){const c=new EffectComposer(R);c.addPass(new RenderPass(scene,cam));if(g.ssaodist){const ssao=new SSAOPass(scene,cam,g.ssaodist);c.addPass(ssao)}if(g.bloom){const bloom=new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),1.4,6,g.bloomThreshold||0.9);c.addPass(bloom)}composer=c}}else if(composer){composer.dispose();composer=null}};`,
  R`if(composer){composer.dispose();composer=null}if(g.post){const rt=new T.WebGLRenderTarget(innerWidth,innerHeight,{type:T.HalfFloatType,samples:g.msaa||0});const c=new EffectComposer(R,rt);c.setPixelRatio(R.getPixelRatio());c.setSize(innerWidth,innerHeight);c.addPass(new RenderPass(scene,cam));if(g.bloom)c.addPass(new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),.32,.55,.9));c.addPass(new OutputPass());composer=c}};`);

/* ---------- bike fixes + headlight ---------- */
P('hscreen', R`new T.BoxGeometry(.2,.06,.12,hMat)`, R`new T.BoxGeometry(.2,.06,.12)`);
P('build-sig', R`function buildBike(d,shirt,helmetColor=0x20272a){`, R`function buildBike(d,shirt,helmetColor=0x20272a,lit=false){`);
P('beam', R`updateSuspension(0,0);`, R`updateSuspension(0,0);let beam=null;if(lit){beam=new T.SpotLight(0xfff1d6,0,45,.55,.6,1.4);beam.position.set(0,hby,hz+.12);beam.target.position.set(0,0,hz+14);P.add(beam,beam.target)}`);
P('beam-return', R`return{g,P,rw:rw.spin,`, R`return{g,beam,P,rw:rw.spin,`);
P('me-build', R`buildBike(BIKES[S.eq],MYC,HELMETS[S.helmet]?.color||0x20272a)`, R`buildBike(BIKES[S.eq],MYC,HELMETS[S.helmet]?.color||0x20272a,true)`);
P('setbike', R`buildBike(BIKES[i],MYC,HELMETS[S.helmet]?.color||0x20272a)`, R`buildBike(BIKES[i],MYC,HELMETS[S.helmet]?.color||0x20272a,true)`);

/* ---------- physics crash fix (assigning to a const) ---------- */
P('vmax-a', R`,vmax=(bike.maxMph/2.237)*motorScale*`, R`,vmax0=(bike.maxMph/2.237)*motorScale*`);
P('vmax-b', R`if(!Number.isFinite(vmax))vmax=25;`, R`const vmax=Number.isFinite(vmax0)?vmax0:25;`);

/* ---------- world visuals: ground texture, windowed buildings with night lights, fuller trees ---------- */
P('ground',
  R`const GM=[0x5a5e66,0x5f9e4b,0xcaa56b,0x8f949c].map(c=>mat(c,{roughness:1,metalness:0}));`,
  R`const groundTex=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#d8d8d8';x.fillRect(0,0,256,256);for(let i=0;i<2600;i++){const s=170+Math.random()*80|0;x.fillStyle='rgba('+s+','+s+','+s+',.35)';x.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*5,1+Math.random()*5)}const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(24,24);tx.anisotropy=aniso;return tx})();
const GM=[0x5a5e66,0x5f9e4b,0xcaa56b,0x8f949c].map(c=>mat(c,{roughness:1,metalness:0,map:groundTex}));`);
P('buildings-mat',
  R`const BM=[0x8a94a6,0x6b7a90,0xa7b0c0,0x4b5563,0x9aa5b8].map(c=>mat(c,{roughness:.8})),`,
  R`const bldTex=(()=>{const N=8,W=64,c=document.createElement('canvas'),e=document.createElement('canvas');c.width=c.height=e.width=e.height=N*W;const x=c.getContext('2d'),y=e.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,N*W,N*W);y.fillStyle='#000';y.fillRect(0,0,N*W,N*W);
for(let i=0;i<N;i++)for(let j=0;j<N;j++){const g=x.createLinearGradient(0,j*W,0,j*W+W);g.addColorStop(0,'#5e8aa6');g.addColorStop(1,'#243b4d');x.fillStyle=g;x.fillRect(i*W+14,j*W+12,W-28,W-24);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(i*W+10,j*W+W-12,W-20,4);if(Math.random()<.35){y.fillStyle=Math.random()<.5?'#ffd48a':'#cfe8ff';y.fillRect(i*W+14,j*W+12,W-28,W-24)}}
const mk=cv=>{const tx=new T.CanvasTexture(cv);tx.colorSpace=T.SRGBColorSpace;tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.anisotropy=aniso;return tx};return{map:mk(c),em:mk(e)}})();
const bldGeo=(w,h,d)=>{const g=new T.BoxGeometry(w,h,d).translate(0,h/2,0),uv=g.attributes.uv;for(let f=0;f<6;f++){const fw=f<2?d:w;for(let i=0;i<4;i++){const k=f*4+i;if(f===2||f===3)uv.setXY(k,.002,.002);else uv.setXY(k,uv.getX(k)*fw/24,uv.getY(k)*h/28)}}return g};
const BM=[0x8a94a6,0x6b7a90,0xa7b0c0,0x4b5563,0x9aa5b8].map(c=>mat(c,{roughness:.7,metalness:0,map:bldTex.map,emissiveMap:bldTex.em,emissive:0xffffff,emissiveIntensity:0})),`);
P('buildings-use', R`h=10+r()*38,m=new T.Mesh(bGeo,BM[r()*5|0]);m.scale.set(w,h,d);add(m,x,0,z,1)}`, R`h=10+r()*38,m=new T.Mesh(bldGeo(w,h,d),BM[r()*5|0]);add(m,x,0,z,1);col(x,z,w,d)}`);
P('tree', R`const tree=(x,z)=>{add(new T.Mesh(trGeo,trM),x,1,z);add(new T.Mesh(cnGeo,lfM),x,3.6,z,1)};`, R`const tree=(x,z)=>{add(new T.Mesh(trGeo,trM),x,1,z);add(new T.Mesh(cnGeo,lfM),x,3.6,z,1);const top=new T.Mesh(cnGeo,lfM);top.scale.set(.7,.7,.7);add(top,x,5.3,z,1)};`);

/* ---------- multiplayer ---------- */
P('mqtt-loader',
  R`function ensureMqtt(cb){if(typeof mqtt!=='undefined')return cb(true);if(mqttLoading)return;mqttLoading=true;networkText='Loading rider relay…';const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/mqtt@5.3.4/dist/mqtt.min.js';s.onload=()=>{mqttLoading=false;cb(typeof mqtt!=='undefined')};s.onerror=()=>{mqttLoading=false;cb(false)};document.head.appendChild(s)}`,
  R`const MQTT_SRC=['https://cdn.jsdelivr.net/npm/mqtt@5.3.4/dist/mqtt.min.js','https://unpkg.com/mqtt@5.3.4/dist/mqtt.min.js','https://cdnjs.cloudflare.com/ajax/libs/mqtt/5.3.4/mqtt.min.js'];
function ensureMqtt(cb,n=0){if(typeof mqtt!=='undefined')return cb(true);if(n===0){if(mqttLoading)return;mqttLoading=true}networkText='Loading rider relay…';if(n>=MQTT_SRC.length){mqttLoading=false;return cb(false)}const s=document.createElement('script');s.src=MQTT_SRC[n];s.onload=()=>{if(typeof mqtt!=='undefined'){mqttLoading=false;cb(true)}else ensureMqtt(cb,n+1)};s.onerror=()=>ensureMqtt(cb,n+1);document.head.appendChild(s)}`);
P('lib-retry', R`console.error('MQTT library failed to load from its CDN')}`, R`console.error('MQTT library failed to load from its CDN');queueFailover(6000)}`);
P('failover-fn', R`const queueFailover=()=>{if(failT)return;failT=setTimeout(()=>{failT=0;brokerIdx=(brokerIdx+1)%BROKERS.length;connectOnline()},1500)};`, R`const queueFailover=(ms=1500)=>{if(failT)return;failT=setTimeout(()=>{failT=0;brokerIdx=(brokerIdx+1)%BROKERS.length;connectOnline()},ms)};`);
P('close-handler', R`if(c.ready){networkText='Reconnecting…'}else{networkText='Offline · trying another relay…';queueFailover()}});`, R`networkText=c.ready?'Reconnecting…':'Offline · trying another relay…';queueFailover(c.ready?8000:1500)});`);
P('remote-seen', R`scene.add(r.walker.g);rem.set(d.i,r)}`, R`scene.add(r.walker.g);r.seen=performance.now();rem.set(d.i,r)}`);
P('remote-helmet', R`r.rig=buildBike(BIKES[d.b],d.c,HELMETS[S.helmet]?.color||0x20272a)`, R`r.rig=buildBike(BIKES[d.b],d.c,HELMETS[d.hm]?.color||0x20272a)`);
P('remote-loop', R`for(const[id,r]of rem){if(nowt-r.seen>4000){if(r.rig)scene.remove(r.rig.g);scene.remove(r.walker.g);rem.delete(id);continue}`, R`for(const[id,r]of rem){if(nowt-r.seen>6000){if(r.rig)scene.remove(r.rig.g);scene.remove(r.walker.g);rem.delete(id);continue}if(!r.rig)continue;`);
P('publish-helmet', R`rc:+rearSusp.comp.toFixed(3)}),{qos:0})`, R`rc:+rearSusp.comp.toFixed(3),hm:S.helmet}),{qos:0})`);
P('online-event', R`nameInput.addEventListener('input',()=>nameInput.setCustomValidity(''));`, R`nameInput.addEventListener('input',()=>nameInput.setCustomValidity(''));addEventListener('online',()=>{if(joined&&!online){brokerIdx=0;connectOnline()}});`);

const out = src.replace(/\.js$/, '') + '.v1.13.js';
fs.writeFileSync(out, t);
console.log('OK ->', out);
