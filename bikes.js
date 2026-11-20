/* bikes.js — E-Ride Life v1.26: real-world lineup. Appended to BIKES, so saved bike numbers don't change.
   Same argument order as B() in game.js, plus a spec line shown in the garage.
   stats s = [Motor Power, Torque, Balance, Boost] on a 1-10 scale, maxMph = real top speed. */
const kmh=k=>Math.round(k/1.609);
const B=(n,pr,s,c,a,f,sc,wr,tw,wb,bw,bh,sl,sy,hb,fh,maxMph,kind,spec)=>({n,pr,s,c,a,f,sc,wr,tw,wb,bw,bh,sl,sy,hb,fh,maxMph,kind,spec});
export const EXTRA_BIKES=[
/* ---------- e-bikes & e-motos ---------- */
B("NCM Moscow M3",500,[2,2,8,2],0x1f2937,0x22c55e,0x9aa3ad,0x111111,.31,.06,1.2,.16,.22,.5,.64,.24,0,kmh(25),'bike','250W · 25 km/h · hardtail e-MTB'),
B("Aventon Soltera 3 ADV",900,[2,2,8,2],0x15181d,0x9ca3af,0xb0b7bf,0x111111,.34,.045,1.1,.12,.16,.45,.66,.2,0,20,'bike','250W (500W peak) · 32 km/h · belt-drive commuter'),
B("Aventon Aventure 3",1800,[4,5,7,3],0x394a2f,0xf59e0b,0x9aa3af,0x1a1a1a,.29,.12,1.28,.24,.26,.75,.56,.3,0,28,'bike','750W (1,188W peak) · 45 km/h · fat-tire utility'),
B("C3STROM Astro Pro",3200,[4,4,7,3],0x8d96a1,0x22d3ee,0xaeb7c0,0x111111,.255,.11,1.25,.26,.26,.9,.52,.42,1,30,'bike','750W (1.4-2kW peak) · 45-51 km/h · cyber moped'),
B("Luckeep M5 Max",2600,[5,5,6,4],0xd7342b,0x111111,0xaeb7c0,0x111111,.25,.13,1.3,.28,.28,.95,.54,.4,1,37,'bike','1,500W (2,000W peak) · 60 km/h claimed · dual-battery moped'),
B("Amflow PX Carbon",6500,[4,6,9,3],0x0e0e10,0xff3b30,0xc9d1d9,0x111111,.33,.065,1.22,.14,.2,.35,.64,.22,0,28,'bike','1,500W peak · 150 Nm · 20 kg carbon trail bike'),
B("HPC Revolution W",70000,[10,10,7,10],0x1c1f22,0x84cc16,0x9aa3ad,0x111111,.3,.1,1.45,.26,.3,.7,.66,.2,1,80,'bike','10,500W · 129 km/h · 280 Nm · record e-bike'),
/* ---------- e-scooters ---------- */
B("NIU KQi3 Pro",300,[2,2,6,2],0x2a2d33,0xe5e7eb,0x9aa3af,0x2a2d33,.12,.06,.8,.18,.12,.5,0,.85,0,20,'scooter','350W (600W peak) · 32 km/h · urban commuter'),
B("KuKirin G2",800,[3,3,7,3],0x1f2226,0xff7a1a,0x9aa3af,0x111111,.14,.07,.88,.2,.13,.55,0,.9,0,28,'scooter','800W · 45 km/h · entry suspension scooter'),
B("EMOVE Cruiser",1100,[4,4,8,4],0x24313d,0x38bdf8,0x9aa3af,0x111111,.16,.08,.98,.22,.15,.6,0,.95,0,31,'scooter','1,600W peak · 50 km/h · dual-suspension tourer'),
B("KuKirin G2 Master",1800,[5,6,7,5],0x1b1d20,0xff7a1a,0x9aa3af,0x111111,.15,.08,.95,.24,.16,.6,0,.95,0,37,'scooter','Dual 1,000W · 60 km/h · hydraulic suspension'),
B("KuKirin G4",2600,[6,6,6,5],0x181a1e,0xff7a1a,0x9aa3af,0x111111,.16,.09,1,.24,.16,.6,0,.98,0,43,'scooter','2,000W rear hub · 70 km/h · single-motor speed machine'),
B("KuKirin G4 Ultra",3800,[7,7,6,6],0x141619,0xff7a1a,0x9aa3af,0x111111,.16,.09,1.02,.26,.17,.6,0,.98,0,45,'scooter','Dual motors · 70-73 km/h · stiff suspension'),
B("Nami Burn-E 4 Max",7500,[8,8,6,8],0x16181c,0xef4444,0x9aa3af,0x111111,.15,.09,1.04,.26,.18,.6,0,1,0,61,'scooter','Dual 3,000W (8,400W peak) · 98 km/h · hydraulic suspension'),
B("Dualtron Thunder 3",9500,[8,9,6,8],0x1a1d22,0x38bdf8,0x9aa3af,0x111111,.165,.09,1.1,.3,.2,.6,0,1,0,62,'scooter','11,000W peak (dual) · 100 km/h · high-torque street cruiser'),
B("Kaabo Wolf King GTR Max",13000,[9,9,6,8],0x20252b,0xfacc15,0x9aa3af,0x111111,.17,.1,1.12,.3,.2,.6,0,1,0,65,'scooter','Dual 2,000W (13,440W peak) · 105 km/h · dual-stem off-roader'),
B("Teverun Fighter Supreme 7260R",20000,[9,10,6,9],0x111317,0x22d3ee,0x9aa3af,0x111111,.18,.11,1.18,.32,.22,.6,0,1,0,74,'scooter','Dual 2,500W (15,000W peak) · 120 km/h · 72V 60Ah'),
B("Slack Core 920R",36000,[10,10,7,10],0xcfd3d8,0xf97316,0xe2e8ee,0x111111,.15,.09,1.08,.3,.18,.6,0,.95,0,90,'scooter','33,600W peak · 145 km/h · titanium track scooter'),
B("Vellum 511R",48000,[10,10,8,10],0x0c0d10,0xe11d2e,0x9aa3af,0x111111,.15,.09,1.1,.32,.2,.6,0,.95,0,99,'scooter','40,000W peak · 160 km/h · 100V track hyper (single-source claim)'),
/* ---------- Kuki scooters that drop from the Basic Crate (also buyable) ---------- */
B("KuKirin G2 Max",1400,[4,4,7,4],0x1e2226,0xff7a1a,0x9aa3af,0x111111,.14,.07,.9,.22,.14,.58,0,.92,0,34,'scooter','1,000W · 55 km/h'),
B("KuKirin G2 Ultra",2000,[5,5,7,4],0x15181b,0xff7a1a,0x9aa3af,0x111111,.15,.08,.94,.24,.15,.6,0,.95,0,31,'scooter','Dual 800W · 50 km/h · touch display'),
B("KuKirin G2 Camo",900,[3,3,7,3],0x5b6b3a,0x2f3a1f,0x9aa3af,0x2f3a1f,.14,.07,.88,.2,.13,.55,0,.9,0,28,'scooter','800W · 45 km/h · camo edition'),
B("KuKirin G3",2200,[5,5,7,4],0x1a1c20,0xff7a1a,0x9aa3af,0x111111,.16,.08,.98,.22,.15,.62,0,1,0,40,'scooter','Dual-drive · 65 km/h'),
B("KuKirin G4 Pro",3000,[7,7,7,6],0x16181c,0xfacc15,0x9aa3af,0x111111,.16,.09,1.01,.25,.16,.6,0,.98,0,44,'scooter','Game-only Pro trim of the G4'),
B("KuKirin G4 Max",5200,[8,8,6,7],0x101215,0xff7a1a,0x9aa3af,0x111111,.17,.1,1.08,.3,.2,.6,0,1,0,53,'scooter','Dual 1,600W (2,000W each peak) · 86 km/h')];
