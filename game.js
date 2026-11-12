import * as THREE from "three";

const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "wheeliex-save-v1";
const BIKE_CATALOG = [
  { id: "commuter", name: "Starter Commuter", subtitle: "COMMUTER E-BIKE", price: 0, speed: 0.53, torque: 0.36, brake: 0.53, weight: 0.57, payout: 1, color: 0xbedb8b, description: "Forgiving, predictable, and always ready for one more run. A solid place to find your balance." },
  { id: "kukirin", name: "Kukirin G2 Max / G4", subtitle: "URBAN ALL-ROUNDER", price: 500, speed: 0.77, torque: 0.56, brake: 0.57, weight: 0.79, payout: 1.12, color: 0xd98945, description: "Heavy metal and a lot of top end. The eager throttle needs a steady hand." },
  { id: "surron", name: "Sur-Ron Light Bee X", subtitle: "LIGHTWEIGHT DIRT MACHINE", price: 1500, speed: 0.79, torque: 0.84, brake: 0.86, weight: 0.37, payout: 1.3, color: 0xaceb65, description: "A lightweight frame with punchy lift and a rear brake that answers instantly." },
  { id: "talaria", name: "Talaria Sting R / Ultra Bee", subtitle: "THE TOP-SHELF BUILD", price: 4000, speed: 1, torque: 0.98, brake: 0.91, weight: 0.48, payout: 1.75, color: 0xc97455, description: "Maximum acceleration, a razor-thin balance window, and a payout to match." },
];
const STAT_LABELS = [["speed", "TOP SPEED"], ["torque", "TORQUE"], ["brake", "BRAKE"], ["weight", "BATTERY / WEIGHT"]];
const UPGRADE_LABELS = { torque: "LIFT MOTOR", brake: "REAR BRAKE", speed: "BATTERY PACK" };

function defaultSave() {
  return { cash: 0, unlocked: ["commuter"], equipped: "commuter", upgrades: { commuter: { torque: 0, brake: 0, speed: 0 } }, records: { distance: [], cash: [] }, riderName: `RIDER-${Math.floor(100 + Math.random() * 900)}` };
}
function readSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return defaultSave();
    const base = defaultSave();
    return {
      ...base, ...parsed,
      cash: Number.isFinite(parsed.cash) ? Math.max(0, parsed.cash) : 0,
      unlocked: Array.isArray(parsed.unlocked) ? [...new Set(["commuter", ...parsed.unlocked.filter((id) => BIKE_CATALOG.some((bike) => bike.id === id))])] : base.unlocked,
      upgrades: parsed.upgrades && typeof parsed.upgrades === "object" ? parsed.upgrades : base.upgrades,
      records: parsed.records && typeof parsed.records === "object" ? { distance: Array.isArray(parsed.records.distance) ? parsed.records.distance : [], cash: Array.isArray(parsed.records.cash) ? parsed.records.cash : [] } : base.records,
    };
  } catch (error) {
    console.warn("Could not load the saved WheelieX progress.", error);
    return defaultSave();
  }
}
let save = readSave();
if (!BIKE_CATALOG.some((bike) => bike.id === save.equipped) || !save.unlocked.includes(save.equipped)) save.equipped = "commuter";
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(save)); }
  catch (error) { console.error("Could not save WheelieX progress.", error); toast("PROGRESS COULD NOT BE SAVED"); }
}
function getBike(id = save.equipped) { return BIKE_CATALOG.find((bike) => bike.id === id) || BIKE_CATALOG[0]; }
function getStats(bike = getBike()) {
  const upgrades = save.upgrades[bike.id] || { torque: 0, brake: 0, speed: 0 };
  return { ...bike, upgrades, torque: Math.min(1, bike.torque + upgrades.torque * 0.065), brake: Math.min(1, bike.brake + upgrades.brake * 0.065), speed: Math.min(1, bike.speed + upgrades.speed * 0.065) };
}
function formatNumber(number) { return Math.floor(number).toLocaleString("en-US"); }

const sceneContainer = $("scene");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9ab3ad);
scene.fog = new THREE.Fog(0x9ab3ad, 34, 145);
const camera = new THREE.PerspectiveCamera(49, 1, 0.1, 260);
camera.position.set(-7, 4.6, 8);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
sceneContainer.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdce9da, 0x566159, 2.2));
const sun = new THREE.DirectionalLight(0xffe6c1, 3.1);
sun.position.set(-15, 23, 12);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -28;
sun.shadow.camera.right = 28;
sun.shadow.camera.top = 25;
sun.shadow.camera.bottom = -25;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xb4d9d3, 0.85);
fill.position.set(6, 8, -15);
scene.add(fill);

const sky = new THREE.Mesh(new THREE.SphereGeometry(190, 32, 18), new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: { topColor: { value: new THREE.Color(0x789794) }, middleColor: { value: new THREE.Color(0xc5c7b1) }, bottomColor: { value: new THREE.Color(0xe4c49e) } },
  vertexShader: "varying vec3 vWorldPosition; void main(){ vec4 worldPosition=modelMatrix*vec4(position,1.0); vWorldPosition=worldPosition.xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
  fragmentShader: "uniform vec3 topColor; uniform vec3 middleColor; uniform vec3 bottomColor; varying vec3 vWorldPosition; void main(){ float h=normalize(vWorldPosition).y; float top=smoothstep(-0.02,0.65,h); float low=1.0-smoothstep(-0.55,0.05,h); vec3 color=mix(middleColor,topColor,top); color=mix(color,bottomColor,low*0.68); gl_FragColor=vec4(color,1.0); }",
}));
scene.add(sky);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 200), new THREE.MeshStandardMaterial({ color: 0x596660, roughness: 0.97 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.07;
ground.receiveShadow = true;
scene.add(ground);
const road = new THREE.Mesh(new THREE.PlaneGeometry(900, 11), new THREE.MeshStandardMaterial({ color: 0x333b39, roughness: 0.9 }));
road.rotation.x = -Math.PI / 2;
road.position.y = -0.015;
road.receiveShadow = true;
scene.add(road);
const curbMat = new THREE.MeshStandardMaterial({ color: 0xb7b5a3, roughness: 0.9 });
for (const z of [-5.75, 5.75]) {
  const curb = new THREE.Mesh(new THREE.BoxGeometry(900, 0.2, 0.3), curbMat);
  curb.position.set(0, 0.03, z);
  curb.receiveShadow = true;
  scene.add(curb);
}
const dashMat = new THREE.MeshStandardMaterial({ color: 0xe7dcb7, emissive: 0x302a1d, emissiveIntensity: 0.25 });
for (let x = -420; x < 450; x += 13) {
  const dash = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.025, 0.11), dashMat);
  dash.position.set(x, 0.005, 0);
  scene.add(dash);
}
const markerMaterials = [0xc0f56a, 0xd5cfb5, 0xd5cfb5];
for (let x = -390; x <= 420; x += 30) {
  const group = new THREE.Group();
  group.position.set(x, 0, -6.2);
  for (let n = 0; n < 3; n++) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.05, 0.10), new THREE.MeshStandardMaterial({ color: markerMaterials[n] }));
    post.position.set(0, 0.52, n * 0.14);
    group.add(post);
  }
  const label = makeTextSprite(`${Math.abs(x + 390)} M`, { background: "rgba(21,29,25,.75)", color: "#e5efdc", fontSize: 24 });
  label.position.set(0.3, 1.65, 0);
  label.scale.set(1.45, 0.43, 1);
  group.add(label);
  scene.add(group);
}

function makeTextSprite(text, { background = "rgba(17,25,27,.82)", color = "#c0f56a", fontSize = 32 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  updateTextSprite(sprite, text, { background, color, fontSize });
  return sprite;
}
function updateTextSprite(sprite, text, { background = "rgba(17,25,27,.82)", color = "#c0f56a", fontSize = 32 } = {}) {
  const canvas = sprite.material.map.image;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = `700 ${fontSize}px "DM Mono", monospace`;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2 + 1);
  sprite.material.map.needsUpdate = true;
}

const buildingMaterials = [0x78877d, 0xa59a84, 0x778588, 0xc1aa88, 0x7d8479, 0x909a8d].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.97 }));
const windowMat = new THREE.MeshStandardMaterial({ color: 0x293d3b, roughness: 0.62, emissive: 0x202c27, emissiveIntensity: 0.12 });
for (const side of [-1, 1]) {
  for (let x = -390, i = 0; x < 430; i++) {
    const width = 8 + ((i * 13 + 5) % 9);
    const depth = 7 + ((i * 5 + 2) % 7);
    const height = 7 + ((i * 11 + 3) % 16);
    const z = side * (13 + (i % 3) * 2);
    const building = new THREE.Group();
    building.position.set(x + width / 2, 0, z);
    const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), buildingMaterials[i % buildingMaterials.length]);
    body.position.y = height / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    building.add(body);
    const floorCount = Math.max(2, Math.floor(height / 2.5));
    for (let floor = 0; floor < floorCount; floor++) {
      for (let col = 0; col < Math.max(2, Math.floor(width / 2.8)); col++) {
        const window = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.9), windowMat);
        window.position.set(-width / 2 + 1.3 + col * 2.65, 1.5 + floor * 2.4, -depth / 2 - 0.012);
        building.add(window);
      }
    }
    const awning = new THREE.Mesh(new THREE.BoxGeometry(width * 0.76, 0.13, 1), new THREE.MeshStandardMaterial({ color: [0xc0f56a, 0xc68662, 0xd5cfb5][i % 3] }));
    awning.position.set(0, Math.min(height - 0.7, 3), -depth / 2 - 0.45);
    building.add(awning);
    scene.add(building);
    x += width + 2.5;
  }
}

const streetLights = [];
const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x313a36, metalness: 0.38, roughness: 0.5 });
const bulbMaterial = new THREE.MeshStandardMaterial({ color: 0xe8edbd, emissive: 0xd2db8a, emissiveIntensity: 1.5 });
for (let x = -405; x <= 420; x += 30) {
  for (const side of [-1, 1]) {
    const pole = new THREE.Group();
    pole.position.set(x, 0, side * 8);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.085, 5.9, 6), poleMaterial);
    stem.position.y = 2.95;
    pole.add(stem);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.07, 0.07), poleMaterial);
    arm.position.set(0.55, 5.78, 0);
    pole.add(arm);
    const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.12, 0.24), bulbMaterial);
    bulb.position.set(1.14, 5.7, 0);
    pole.add(bulb);
    scene.add(pole);
    streetLights.push(pole);
  }
}

function box(group, dimensions, position, color, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...dimensions), new THREE.MeshStandardMaterial({ color, roughness: options.roughness ?? 0.68, metalness: options.metalness ?? 0.08 }));
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}
function makeBike(bike) {
  const root = new THREE.Group();
  const frame = new THREE.Group();
  root.add(frame);
  const mainMat = new THREE.MeshStandardMaterial({ color: bike.color, roughness: 0.46, metalness: 0.24 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x252c29, roughness: 0.7, metalness: 0.1 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0xb4b6a7, roughness: 0.34, metalness: 0.72 });
  const rear = new THREE.Vector3(-0.83, 0, 0);
  const front = new THREE.Vector3(1.55, 0, 0);
  const wheelGeo = new THREE.TorusGeometry(0.4, 0.095, 10, 28);
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x1d2422, roughness: 0.93 });
  const hubMat = new THREE.MeshStandardMaterial({ color: 0xaeb4a3, metalness: 0.72, roughness: 0.34 });
  const wheels = [];
  for (const point of [rear, front]) {
    const wheel = new THREE.Group();
    wheel.position.copy(point);
    const tire = new THREE.Mesh(wheelGeo, tireMat);
    wheel.add(tire);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.18, 12), hubMat);
    hub.rotation.x = Math.PI / 2;
    wheel.add(hub);
    for (let s = 0; s < 8; s++) {
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.72, 4), metalMat);
      const spokeAngle = Math.PI * s / 4;
      spoke.position.set(Math.sin(spokeAngle) * 0.36, Math.cos(spokeAngle) * 0.36, 0);
      spoke.rotation.z = -spokeAngle;
      wheel.add(spoke);
    }
    wheel.traverse((part) => { if (part.isMesh) { part.castShadow = true; part.receiveShadow = true; } });
    frame.add(wheel);
    wheels.push(wheel);
  }
  box(frame, [1.32, 0.13, 0.12], [0.12, 0.55, 0], bike.color, { metalness: 0.42 });
  box(frame, [0.11, 0.71, 0.11], [-0.08, 0.34, 0], bike.color, { metalness: 0.42 });
  box(frame, [0.11, 0.70, 0.11], [0.78, 0.36, 0], bike.color, { metalness: 0.42 });
  box(frame, [0.12, 0.63, 0.13], [1.42, 0.36, 0], 0x646c62, { metalness: 0.7 });
  box(frame, [0.50, 0.42, 0.4], [0.12, 0.91, 0], bike.color, { roughness: 0.48, metalness: 0.22 });
  box(frame, [0.34, 0.16, 0.34], [-0.35, 0.79, 0], 0x222926);
  box(frame, [0.61, 0.11, 0.31], [-0.29, 1.04, 0], 0x252b27);
  box(frame, [0.66, 0.16, 0.34], [0.74, 0.85, 0], 0x272d2a);
  box(frame, [0.62, 0.085, 0.42], [-1.12, 0.57, 0], 0x242a27);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.75, 8), darkMat);
  handle.rotation.x = Math.PI / 2;
  handle.position.set(1.36, 1.16, 0);
  frame.add(handle);
  box(frame, [0.4, 0.12, 0.43], [1.52, 1.18, 0], bike.color);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), new THREE.MeshStandardMaterial({ color: 0xf3e9bc, emissive: 0xb8a674, emissiveIntensity: 0.5 }));
  lamp.position.set(1.78, 0.94, 0);
  frame.add(lamp);
  box(frame, [0.32, 0.1, 0.38], [-0.96, 0.58, 0], 0x343b36);
  root.userData = { frame, wheels, color: bike.color };
  return root;
}

const rider = makeBike(getBike());
scene.add(rider);
function replaceRiderBike() {
  scene.remove(rider);
  const fresh = makeBike(getBike());
  rider.clear();
  rider.add(...fresh.children);
  rider.userData = fresh.userData;
  rider.position.set(state.x, 0.43, 0);
  rider.rotation.z = state.pitch;
  scene.add(rider);
  refreshSideBikeLabel();
}

const ghostRiders = new Map();
const state = { running: false, paused: false, speed: 0, pitch: 0, angularVelocity: 0, x: 0, distance: 0, score: 0, airTime: 0, runTime: 0, lastAngle: 0, throttle: false, brake: false, crashed: false, frame: 0 };
let cameraInitialized = false;
let cameraX = -7;
let cameraY = 4.6;
const clock = new THREE.Clock();

let audioContext;
let oscillator;
let audioGain;
let audioEnabled = true;
function ensureAudio() {
  if (!audioEnabled) return;
  if (!audioContext) {
    audioContext = new AudioContext();
    oscillator = audioContext.createOscillator();
    const overtone = audioContext.createOscillator();
    const overtoneGain = audioContext.createGain();
    audioGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    oscillator.type = "sawtooth";
    oscillator.frequency.value = 46;
    overtone.type = "triangle";
    overtone.frequency.value = 92;
    overtoneGain.gain.value = 0.16;
    audioGain.gain.value = 0;
    filter.type = "lowpass";
    filter.frequency.value = 380;
    oscillator.connect(filter);
    overtone.connect(overtoneGain);
    overtoneGain.connect(filter);
    filter.connect(audioGain);
    audioGain.connect(audioContext.destination);
    oscillator.start();
    overtone.start();
  }
  if (audioContext.state === "suspended") audioContext.resume();
}
function setEngineSound() {
  if (!audioContext || !audioEnabled || !state.running) return;
  const stats = getStats();
  const now = audioContext.currentTime;
  oscillator.frequency.setTargetAtTime(35 + state.speed * (150 + stats.speed * 70) + (state.throttle ? 23 : 0), now, 0.12);
  audioGain.gain.setTargetAtTime(state.paused ? 0 : 0.008 + state.speed * 0.036 + (state.throttle ? 0.018 : 0), now, 0.16);
}

function toast(message) {
  const element = $("toast");
  element.textContent = message;
  element.classList.remove("hidden");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.add("hidden"), 2300);
}
function refreshCash() {
  $("cash").textContent = formatNumber(save.cash);
  $("garage-cash").textContent = formatNumber(save.cash);
}
function refreshSideBikeLabel() {
  $("current-bike-name").textContent = getBike().name;
  $("side-bike-label").textContent = getBike().subtitle;
}
function setPaused(paused) {
  if (!state.running) return;
  state.paused = paused;
  $("pause-button").textContent = paused ? "▶" : "Ⅱ";
  $("pause-button").setAttribute("aria-label", paused ? "Resume game" : "Pause game");
  if (audioGain && audioContext) audioGain.gain.setTargetAtTime(paused ? 0 : 0.025, audioContext.currentTime, 0.08);
  if (paused) toast("PAUSED · PRESS ESC TO RESUME");
}
function startRide() {
  if (state.running && state.paused) { setPaused(false); return; }
  ensureAudio();
  Object.assign(state, { running: true, paused: false, speed: 0, pitch: 0, angularVelocity: 0, distance: 0, score: 0, airTime: 0, runTime: 0, lastAngle: 0, throttle: false, brake: false, crashed: false });
  state.x = 0;
  cameraInitialized = false;
  rider.position.set(0, 0.43, 0);
  rider.rotation.set(0, 0, 0);
  rider.userData.frame.rotation.set(0, 0, 0);
  rider.userData.wheels.forEach((wheel) => { wheel.rotation.set(0, 0, 0); });
  $("start-screen").classList.add("hidden");
  $("run-banner").classList.add("hidden");
  $("ride-hud").classList.add("visible");
  $("touch-controls").classList.add("active");
  $("pause-button").textContent = "Ⅱ";
  $("pause-button").setAttribute("aria-label", "Pause game");
  updateHud(0);
}
function endRide(message) {
  if (!state.running) return;
  state.running = false;
  state.paused = false;
  state.crashed = true;
  state.throttle = false;
  state.brake = false;
  const payout = Math.floor(state.score * getStats().payout);
  if (payout > 0) save.cash += payout;
  const distanceRecord = { name: save.riderName, bike: getBike().name, value: Math.round(state.distance * 10) / 10, date: Date.now() };
  const cashRecord = { name: save.riderName, bike: getBike().name, value: save.cash, date: Date.now() };
  if (state.distance > 0) save.records.distance = [distanceRecord, ...save.records.distance.filter((entry) => entry.date !== distanceRecord.date)].slice(0, 20);
  if (payout > 0) save.records.cash = [cashRecord, ...save.records.cash.filter((entry) => entry.date !== cashRecord.date)].slice(0, 20);
  persist();
  refreshCash();
  saveRunOnline(distanceRecord, cashRecord);
  $("run-message").textContent = message;
  $("run-result").textContent = `+ $${formatNumber(payout)}  ·  ${state.distance.toFixed(1)} M  ·  ${state.airTime.toFixed(1)} S AIR`;
  $("run-banner").classList.remove("hidden");
  $("ride-hud").classList.remove("visible");
  $("touch-controls").classList.remove("active");
  if (audioGain && audioContext) audioGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.08);
}

function updateHud(multiplier) {
  $("speed").textContent = String(Math.round(state.speed * 95));
  $("distance").textContent = state.distance.toFixed(1);
  $("angle-readout").textContent = `${Math.round(THREE.MathUtils.radToDeg(state.pitch))}°`;
  $("multiplier").innerHTML = `${multiplier.toFixed(1)}<span>×</span>`;
  const balancePosition = THREE.MathUtils.clamp(state.pitch / (Math.PI / 2) * 100, 0, 100);
  $("balance-needle").style.left = `${balancePosition}%`;
  const hint = $("balance-hint");
  hint.textContent = multiplier >= 1.8 ? "✳ SWEET SPOT ✳" : state.pitch > 1.15 ? "EASE IT DOWN" : state.pitch < 0.2 ? "LIFT THE FRONT" : "HOLD YOUR LINE";
  hint.style.color = multiplier >= 1.8 ? "#c0f56a" : state.pitch > 1.15 ? "#ffb095" : "";
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.04);
  if (state.running && !state.paused) {
    const stats = getStats();
    const topSpeed = 0.4 + stats.speed * 0.66;
    const acceleration = 0.34 + stats.torque * 0.3;
    if (state.throttle) state.speed = Math.min(topSpeed, state.speed + acceleration * dt);
    else state.speed = Math.max(0, state.speed - (0.08 + stats.weight * 0.035) * dt);
    const throttleLift = state.throttle ? (0.82 + stats.torque * 1.18) * (0.55 + state.speed * 0.78) : 0;
    const rearBrake = state.brake ? 1.55 + stats.brake * 2.0 : 0;
    const pitchGravity = 0.53 + stats.weight * 0.28;
    const balanceCorrection = state.pitch > 0.1 ? Math.max(0, state.pitch - 0.16) * 0.65 : 0;
    state.angularVelocity += (throttleLift - rearBrake - pitchGravity - balanceCorrection - state.angularVelocity * (0.92 + stats.weight * 0.35)) * dt;
    const priorPitch = state.pitch;
    state.pitch = Math.max(-0.12, state.pitch + state.angularVelocity * dt);
    state.x += state.speed * 12.5 * dt;
    state.runTime += dt;
    const wheelie = state.pitch > 0.14 && state.speed > 0.045;
    let multiplier = 1;
    if (wheelie) {
      const sweetSpot = 0.52;
      const balance = THREE.MathUtils.clamp(1 - Math.abs(state.pitch - sweetSpot) / 0.62, 0, 1);
      multiplier = 1 + balance * 1.8;
      const metres = state.speed * 12.5 * dt;
      state.distance += metres;
      state.score += metres * multiplier * 1.5;
      state.airTime += dt;
    }
    const frontWheelSlam = priorPitch > 0.62 && state.pitch < 0.12 && state.angularVelocity < -1.45 && state.speed > 0.37;
    if (state.pitch > Math.PI / 2 || frontWheelSlam) {
      endRide(state.pitch > Math.PI / 2 ? "LOOPED OUT" : "FRONT WHEEL DOWN");
    }
    rider.position.set(state.x, 0.43, 0);
    rider.rotation.z = state.pitch;
    rider.userData.frame.rotation.set(0, 0, 0);
    for (const wheel of rider.userData.wheels) wheel.rotation.z = state.x * 2.4;
    const targetX = state.x - 7.3 - state.speed * 1.6;
    const targetY = 3.1 + state.speed * 1.15 + Math.max(0, state.pitch) * 0.8;
    const smoothing = 1 - Math.exp(-dt * 3.8);
    if (!cameraInitialized) { cameraX = targetX; cameraY = targetY; cameraInitialized = true; }
    else { cameraX += (targetX - cameraX) * smoothing; cameraY += (targetY - cameraY) * smoothing; }
    camera.position.set(cameraX, cameraY, 8.6);
    camera.lookAt(state.x + 1.3, 0.93 + Math.max(0, state.pitch) * 0.8, 0);
    camera.fov += (49 + state.speed * 5.5 - camera.fov) * smoothing;
    camera.updateProjectionMatrix();
    sky.position.x = state.x + 20;
    updateHud(multiplier);
    state.frame += dt;
    if (state.frame > 0.3) { state.frame = 0; publishGhost(); }
    setEngineSound();
  } else if (!state.running) {
    const targetX = -7.3;
    const smoothing = 1 - Math.exp(-dt * 1.8);
    if (!cameraInitialized) { cameraX = targetX; cameraY = 4.6; cameraInitialized = true; }
    cameraX += (targetX - cameraX) * smoothing;
    cameraY += (4.6 - cameraY) * smoothing;
    camera.position.set(cameraX, cameraY, 8.6);
    camera.lookAt(1.5, 0.9, 0);
    camera.fov += (49 - camera.fov) * smoothing;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
}

function onResize() {
  const width = sceneContainer.clientWidth;
  const height = sceneContainer.clientHeight;
  if (!width || !height) return;
  camera.aspect = width / height;
  camera.fov = width < 550 ? 55 : 49;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
window.addEventListener("resize", onResize);
onResize();
animate();
refreshCash();
refreshSideBikeLabel();
setTimeout(() => $("loading-screen").classList.add("done"), 450);
setTimeout(() => $("loading-screen").classList.add("hidden"), 1000);

const keyMap = { ArrowUp: "throttle", KeyW: "throttle", Space: "throttle", ArrowDown: "brake", KeyS: "brake" };
window.addEventListener("keydown", (event) => {
  if (event.code === "Escape") { if (state.running) setPaused(!state.paused); return; }
  const control = keyMap[event.code];
  if (!control || event.repeat) return;
  event.preventDefault();
  if (state.running && !state.paused) { ensureAudio(); state[control] = true; }
});
window.addEventListener("keyup", (event) => {
  const control = keyMap[event.code];
  if (control) { event.preventDefault(); state[control] = false; }
});
window.addEventListener("blur", () => { state.throttle = false; state.brake = false; if (state.running) setPaused(true); });
document.addEventListener("visibilitychange", () => { if (document.hidden && state.running) { state.throttle = false; state.brake = false; setPaused(true); } });
function bindTouch(button, control) {
  const el = $(button);
  const down = (event) => { event.preventDefault(); if (!state.running || state.paused) return; ensureAudio(); state[control] = true; };
  const up = (event) => { event.preventDefault(); state[control] = false; };
  el.addEventListener("pointerdown", down);
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", up);
  el.addEventListener("pointerleave", up);
  el.addEventListener("contextmenu", (event) => event.preventDefault());
}
bindTouch("throttle-touch", "throttle");
bindTouch("brake-touch", "brake");

$("ride-button").addEventListener("click", startRide);
$("retry-button").addEventListener("click", startRide);
$("pause-button").addEventListener("click", () => { if (state.running) setPaused(!state.paused); });
$("sound-toggle").addEventListener("click", () => {
  audioEnabled = !audioEnabled;
  $("sound-toggle").textContent = audioEnabled ? "◖" : "◌";
  if (audioGain && audioContext) audioGain.gain.setTargetAtTime(audioEnabled && state.running && !state.paused ? 0.025 : 0, audioContext.currentTime, 0.08);
  if (audioEnabled) ensureAudio();
  toast(audioEnabled ? "MOTOR SOUND ON" : "MOTOR SOUND OFF");
});

function openModal(id) {
  $(id).classList.remove("hidden");
  state.throttle = false;
  state.brake = false;
  if (state.running) setPaused(true);
}
function closeModal(id) {
  $(id).classList.add("hidden");
  if (state.running) setPaused(false);
}
$("garage-button").addEventListener("click", () => { renderGarage(); openModal("garage-modal"); });
$("run-garage-button").addEventListener("click", () => { renderGarage(); openModal("garage-modal"); });
$("leaderboard-button").addEventListener("click", () => { renderLeaderboard(); openModal("leaderboard-modal"); });
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => closeModal(button.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach((modal) => modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(modal.id); }));
window.addEventListener("keydown", (event) => { if (event.key === "Escape") document.querySelectorAll(".modal-backdrop:not(.hidden)").forEach((modal) => closeModal(modal.id)); });

function renderGarage() {
  refreshCash();
  $("bike-list").innerHTML = BIKE_CATALOG.map((bike, index) => {
    const unlocked = save.unlocked.includes(bike.id);
    const selected = bike.id === getBike().id;
    return `<button class="bike-option ${selected ? "selected" : ""}" data-bike="${bike.id}"><span class="bike-number">0${index + 1}</span><span><span class="bike-option-name">${bike.name}</span><span class="bike-option-sub">${bike.subtitle}</span></span><span class="bike-price">${unlocked ? selected ? "SELECTED" : "OWNED" : `$${formatNumber(bike.price)}`}</span></button>`;
  }).join("");
  $("bike-list").querySelectorAll("[data-bike]").forEach((button) => button.addEventListener("click", () => renderBikeDetail(button.dataset.bike)));
  renderBikeDetail(getBike().id);
}
function renderBikeDetail(id) {
  const bike = getBike(id);
  const stats = getStats(bike);
  const unlocked = save.unlocked.includes(bike.id);
  const selected = bike.id === getBike().id;
  const statMarkup = STAT_LABELS.map(([key, label]) => {
    const value = stats[key];
    return `<div class="stat-row"><span>${label}</span><span class="stat-bar"><span style="width:${Math.round(value * 100)}%"></span></span><span class="stat-number">${Math.round(value * 100)}</span></div>`;
  }).join("");
  let action = "";
  if (!unlocked) action = `<button class="primary-button" id="buy-bike"><span>UNLOCK · $${formatNumber(bike.price)}</span><span class="button-arrow">↗</span></button>`;
  else if (!selected) action = `<button class="primary-button" id="equip-bike"><span>EQUIP BIKE</span><span class="button-arrow">↗</span></button>`;
  else action = `<button class="primary-button" id="equipped-bike" disabled><span>CURRENT RIDE</span><span>✓</span></button>`;
  const upgradeMarkup = unlocked ? `<div class="upgrade-buttons">${["torque", "brake", "speed"].map((key) => {
    const level = stats.upgrades[key] || 0;
    const cost = Math.floor(250 * (level + 1) * (level + 1));
    return `<button class="upgrade-button" data-upgrade="${key}" ${level >= 3 || save.cash < cost ? "disabled" : ""}>${UPGRADE_LABELS[key]} · LV ${level}/3<br><span>${level >= 3 ? "MAXED" : `UPGRADE · $${formatNumber(cost)}`}</span></button>`;
  }).join("")}</div>` : "";
  $("bike-detail").innerHTML = `<span class="bike-detail-tag">${bike.subtitle} · ×${bike.payout.toFixed(2)} PAYOUT</span><h3>${bike.name}</h3><p class="bike-description">${bike.description}</p>${statMarkup}<div class="bike-actions">${action}${upgradeMarkup}</div>`;
  $("bike-detail").querySelector("#buy-bike")?.addEventListener("click", () => {
    if (save.cash < bike.price) { toast("NOT ENOUGH CASH · KEEP RIDING"); return; }
    save.cash -= bike.price;
    save.unlocked.push(bike.id);
    save.upgrades[bike.id] ||= { torque: 0, brake: 0, speed: 0 };
    persist();
    renderGarage();
    toast(`${bike.name.toUpperCase()} UNLOCKED`);
  });
  $("bike-detail").querySelector("#equip-bike")?.addEventListener("click", () => {
    save.equipped = bike.id;
    persist();
    replaceRiderBike();
    renderGarage();
    toast(`${bike.name.toUpperCase()} EQUIPPED`);
  });
  $("bike-detail").querySelectorAll("[data-upgrade]").forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.upgrade;
    const level = stats.upgrades[key] || 0;
    const cost = Math.floor(250 * (level + 1) * (level + 1));
    if (level >= 3 || save.cash < cost) { toast("NOT ENOUGH CASH FOR THIS UPGRADE"); return; }
    save.cash -= cost;
    save.upgrades[bike.id] ||= { torque: 0, brake: 0, speed: 0 };
    save.upgrades[bike.id][key] = level + 1;
    persist();
    renderGarage();
    toast(`${UPGRADE_LABELS[key]} UPGRADED · LV ${level + 1}`);
  }));
}

let leaderboardMode = "distance";
const remoteBoards = { distance: null, cash: null };
function renderLeaderboard() {
  const records = remoteBoards[leaderboardMode] || save.records[leaderboardMode];
  const sorted = [...records].sort((a, b) => b.value - a.value).slice(0, 10);
  $("leaderboard-score-title").textContent = leaderboardMode === "distance" ? "DISTANCE" : "CASH EARNED";
  $("leaderboard-source").textContent = remoteBoards[leaderboardMode] ? "GLOBAL RECORDS · FIREBASE" : "LOCAL RECORDS · THIS DEVICE";
  $("leaderboard-rows").innerHTML = sorted.length ? sorted.map((record, index) => `<div class="leaderboard-row"><span class="leaderboard-rider"><span class="leaderboard-rank">${String(index + 1).padStart(2, "0")}</span><span>${escapeHtml(record.name || "RIDER")}</span><span class="leaderboard-bike">${escapeHtml(record.bike || "E-BIKE")}</span></span><span class="leaderboard-score">${leaderboardMode === "distance" ? `${Number(record.value).toFixed(1)} M` : `$${formatNumber(record.value)}`}</span></div>`).join("") : `<div class="leaderboard-empty">NO RUNS LOGGED YET.<br>THE FIRST LINE IS YOURS.</div>`;
}
document.querySelectorAll("[data-board]").forEach((button) => button.addEventListener("click", () => {
  leaderboardMode = button.dataset.board;
  document.querySelectorAll("[data-board]").forEach((tab) => tab.classList.toggle("active", tab === button));
  renderLeaderboard();
}));
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

// Replace these values with the Firebase web app config and Realtime Database URL.
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};
const firebaseConfigured = FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY" && FIREBASE_CONFIG.projectId !== "YOUR_PROJECT_ID" && FIREBASE_CONFIG.databaseURL.startsWith("https://") && !FIREBASE_CONFIG.databaseURL.includes("YOUR_PROJECT_ID");
let firebaseDatabase;
let firebaseApi;
const playerId = globalThis.crypto?.randomUUID?.() || `rider-${Date.now()}-${Math.random().toString(36).slice(2)}`;
let ghostPublishTimer;
async function connectFirebase() {
  if (!firebaseConfigured) return;
  try {
    const [appModule, databaseModule] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js"),
    ]);
    const app = appModule.initializeApp(FIREBASE_CONFIG);
    firebaseDatabase = databaseModule.getDatabase(app);
    firebaseApi = databaseModule;
    const ghostsRef = databaseModule.ref(firebaseDatabase, "wheeliex/players");
    databaseModule.onValue(ghostsRef, (snapshot) => updateGhosts(snapshot.val() || {}), (error) => console.error("Firebase live riders could not be read.", error));
    const boardRefs = { distance: databaseModule.ref(firebaseDatabase, "wheeliex/leaderboards/distance"), cash: databaseModule.ref(firebaseDatabase, "wheeliex/leaderboards/cash") };
    for (const [mode, boardRef] of Object.entries(boardRefs)) {
      databaseModule.onValue(boardRef, (snapshot) => {
        const value = snapshot.val();
        remoteBoards[mode] = value ? Object.values(value).filter((entry) => entry && Number.isFinite(entry.value)) : [];
        if (!$("leaderboard-modal").classList.contains("hidden")) renderLeaderboard();
      }, (error) => {
        console.error(`Firebase ${mode} leaderboard could not be read.`, error);
        remoteBoards[mode] = null;
      });
    }
    const myRef = databaseModule.ref(firebaseDatabase, `wheeliex/players/${playerId}`);
    await databaseModule.onDisconnect(myRef).remove();
    $("network-status").classList.add("connected");
    $("network-label").textContent = "LIVE · FIREBASE CONNECTED";
  } catch (error) {
    console.error("Firebase could not be initialized. Check the Firebase config and database rules.", error);
    $("network-label").textContent = "OFFLINE · CHECK FIREBASE CONFIG";
  }
}
function publishGhost() {
  if (!firebaseDatabase || !firebaseApi || !state.running) return;
  if (ghostPublishTimer) return;
  ghostPublishTimer = setTimeout(() => { ghostPublishTimer = undefined; }, 250);
  const ref = firebaseApi.ref(firebaseDatabase, `wheeliex/players/${playerId}`);
  firebaseApi.set(ref, { name: save.riderName, bike: getBike().name, x: state.x, angle: state.pitch, speed: state.speed * 95, updatedAt: Date.now() }).catch((error) => console.error("Could not publish the live rider.", error));
}
function updateGhosts(players) {
  const now = Date.now();
  const active = new Set();
  for (const [id, player] of Object.entries(players)) {
    if (id === playerId || !player || !Number.isFinite(player.x) || !Number.isFinite(player.angle) || now - Number(player.updatedAt || 0) > 15000) continue;
    active.add(id);
    let ghost = ghostRiders.get(id);
    if (!ghost) {
      const bikeData = BIKE_CATALOG.find((item) => item.name === player.bike) || BIKE_CATALOG[0];
      const bike = makeBike({ ...bikeData, color: 0x64ced1 });
      const nameTag = makeTextSprite(`${String(player.name || "RIDER").slice(0, 18)} · ${Math.round(player.angle * 180 / Math.PI)}°`, { background: "rgba(13,23,23,.82)", color: "#b8ffff", fontSize: 24 });
      nameTag.scale.set(2.2, 0.55, 1);
      bike.add(nameTag);
      nameTag.position.set(0.2, 2.0, 0);
      scene.add(bike);
      ghost = { bike, nameTag };
      ghostRiders.set(id, ghost);
    }
    ghost.bike.position.set(player.x, 0.43, -2.2);
    ghost.bike.rotation.z = player.angle;
    updateTextSprite(ghost.nameTag, `${String(player.name || "RIDER").slice(0, 18)} · ${Math.round(player.angle * 180 / Math.PI)}°`, { background: "rgba(13,23,23,.82)", color: "#b8ffff", fontSize: 24 });
  }
  for (const [id, ghost] of ghostRiders) {
    if (!active.has(id)) { scene.remove(ghost.bike); ghostRiders.delete(id); }
  }
}
async function saveRunOnline(distanceRecord, cashRecord) {
  if (!firebaseDatabase || !firebaseApi) return;
  try {
    const { push, ref, set, query, orderByChild, limitToLast, get, remove } = firebaseApi;
    for (const [mode, record] of [["distance", distanceRecord], ["cash", cashRecord]]) {
      if (record.value <= 0) continue;
      const boardRef = ref(firebaseDatabase, `wheeliex/leaderboards/${mode}`);
      const entryRef = push(boardRef);
      await set(entryRef, record);
      const topRef = query(boardRef, orderByChild("value"), limitToLast(50));
      const snapshot = await get(topRef);
      const entries = snapshot.val();
      if (entries) {
        const sorted = Object.entries(entries).sort((a, b) => Number(a[1].value) - Number(b[1].value));
        const current = Object.keys(entries).length;
        if (current > 50) await Promise.all(sorted.slice(0, current - 50).map(([key]) => remove(ref(firebaseDatabase, `wheeliex/leaderboards/${mode}/${key}`))));
      }
    }
  } catch (error) {
    console.error("Could not save the run to the Firebase leaderboards.", error);
    toast("RUN SAVED LOCALLY · GLOBAL UPLOAD FAILED");
  }
}
connectFirebase();
