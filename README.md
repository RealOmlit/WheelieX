# E-Ride Life

A browser-based 3D electric bike stunt game. The Three.js scene, physics, HUD, synthesized motor audio, police chases, garage, progression, and MQTT multiplayer run directly in the browser. The static game has no build step or npm dependencies.

## Run locally

Use any static HTTP server from the repository root; ES modules must be served over HTTP rather than opened as a `file://` URL. For example:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Three.js, MQTT.js, and web fonts load from their CDNs, so an internet connection is required.

## Controls

- Hold **W** (or **Up**) to accelerate; hold **S** (or **Down**) to brake.
- Steer with **A/D** or **Left/Right**.
- Press **Space** to compress and rebound the bike's suspension; hold **Shift** to lift and balance a wheelie, using **W/S** to balance. Ease off before over-rotating or holding the wheelie too long.
- In the air, hold **W/Up** for a backflip, **S/Down** for a frontflip, and **A/D** for barrel rolls. Counter-steer to level out; land upright to score, or you'll crash.
- Press **F** while the bike is wheelied to use it as a ground touch — in the **orange** zone it triggers a hand-scrape trick, in the **red** zone (on the ground) it counts as a reaching-the-ground skill. Click the game and move the mouse to look around. You always ride; there is no off-bike mode.
- Hold **E** for boost after installing a boost mount; **G** opens the garage.
- Use **Settings** to choose police difficulty: Easy, Medium, Hard, Insane, or Death, plus accessibility options (reduced motion, larger interface text, high contrast).
- Tap the speed readout to toggle kilometres per hour and miles per hour; the speedometer defaults to kilometres per hour.
- Touch controls mirror throttle, brake, steer, suspension bounce, wheelie, ground touch, and boost.

## Graphics quality

The game ships five graphics presets — **Low**, **Medium**, **High**, **Ultra**, and **4K** — selectable in the **Settings** dialog.

- **Low (Maximum Performance):** 0.5x resolution scaling, antialiasing disabled, shadows disabled, 25% particle density, aggressive off-screen culling.
- **Medium (Balanced Entry):** 1x resolution scaling, antialiasing on, low-resolution dynamic shadow maps (512x512), 50% particle density.
- **High (Recommended Standard):** native devicePixelRatio capped at 1.5x, MSAA antialiasing, 1024px soft shadow maps, full particle density, extended draw distance.
- **Ultra (Maximum Fidelity):** full native devicePixelRatio, high-resolution shadow maps (4096x4096), 150%+ particle density, maximum draw distance.
- **4K (Native 2160p):** renders 2160 scanlines internally regardless of window size (up to 3x pixel ratio), 4096x4096 shadows, SSAO and bloom, densest city props, and the sharpest texture sampling.

Every preset draws from the same 4K-ready procedural textures — road surface at 2048px, tyre tread and race plates at 4x their former resolution, and the handlebar telemetry screen at 512x128 — all sampled with up to 8x anisotropic filtering.

Presets apply live and are remembered in the browser save file.

## Features

- Procedurally generated 3D city with chunks, dirt off-road ramps, subtle road ripples, and boost pads parked along the sides of the road.
- Full day/night cycle with shifting sun, sky, fog, and light; streetlamps on the sides of the road glow luminescently at night, with extra detail on poles, lenses, and road markings.
- Escalating police chases with bust and escape flow, plus helicopter, tank, and an escapable EMP lockdown at the highest level.
- Police vehicles are non-collidable: crashes still wreck the rider without getting them stuck.
- Police difficulty settings from Easy to Death, plus accessibility options (reduced motion, larger interface text, high contrast).
- Username-based live multiplayer over MQTT; play solo if the broker is unavailable.
- Look around and see other riders on their bikes.
- Perform backflips, frontflips, and barrel rolls in the air; tricks require clean landings to score.
- Wheelie combo rewards cap at 3×, with a green / orange / red balance meter; F in the orange zone scrapes the hand on the ground for a trick, F in the red zone on the ground counts as a reaching-the-ground skill. The suspension activates when the bike lands from a wheelie or trick landing and rebounds on impact.
- Police cars, trees, rocks, and buildings now block the rider and police vehicles.
- Helmet-cam slip HUD, minimap, boost bar, combo, wipeout, and air-time feedback.

## Garage and progression

Earn cash from riding, boosts, air time, and boost pads. The garage lists bikes in order from least money to most. Each performance upgrade adds 1.5% to its stat. The garage's helmet shop sells different helmets riders can buy and equip. The Mod Shop offers Factory, Trail, and Race setups for the telescopic front forks and rear coil-over, with smoother damping; Space pumps both, while bumps and landings actuate them independently. Install Street/Race boost mounts for 300%/400% of the bike price. ECU hack rolls cost at least $25,000 and keep the best rarity per bike: Common 50% (+5%), Uncommon 25% (+10%), Rare 15% (+20%), Epic 7% (+35%), Legendary 2.5% (+50%), Mythic 0.49% (+75%), and Secret 0.01% (all stats maxed). Hack rarity never installs a boost mount.

The bank balance readout in the HUD was restyled for a cleaner look.

## Multiplayer

Enter a rider name before starting. Live riders communicate over an MQTT broker on topic `<room>/s` (`eridelife-ghpages-v1`). Players using the same game link meet in the same room. The client tries the primary public relay first and falls back to alternate public relays if it is unreachable, then keeps retrying. If no relay is available, the game remains playable solo.

## Deploy to GitHub Pages

The workflow in [deploy.yml](./.github/workflows/deploy.yml) publishes the static site to GitHub Pages whenever a commit is pushed to `main`. It can also be started manually from the repository's Actions tab.

To publish this project to a new GitHub repository, run these commands from the project directory (replace the remote URL with your repository's URL):

```sh
git init
git add .
git commit -m "Build E-Ride Life browser game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

In the repository, open **Settings → Pages**, set the build and deployment source to **GitHub Actions**, and save. Subsequent pushes to `main` deploy automatically; the first deployment may take a few minutes.
