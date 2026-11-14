# E-Bike Life

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
- Press **F** to mount or dismount (stop first); while the bike is wheelied it acts as a ground touch — in the **orange** zone it triggers a hand-scrape trick, in the **red** zone (on the ground) it counts as a reaching-the-ground skill. Click the game and move the mouse to look around. Use **W/A/S/D** to walk when off the bike.
- Hold **E** for boost after installing a boost mount; **G** opens the garage.
- Use **Settings** to choose police difficulty: Easy, Medium, Hard, Insane, or Death, plus accessibility options (reduced motion, larger interface text, high contrast).
- Tap the speed readout to toggle kilometres per hour and miles per hour; the speedometer defaults to kilometres per hour.
- Touch controls mirror throttle, brake, steer, suspension bounce, wheelie, boost, and mounting.

## Features

- Procedurally generated 3D city with chunks, dirt off-road ramps, subtle road ripples, and boost pads parked along the sides of the road.
- Full day/night cycle with shifting sun, sky, fog, and light; streetlamps on the sides of the road glow luminescently at night, with extra detail on poles, lenses, and road markings.
- Six-star police chases with progressively slower escalation, bust and escape flow, plus helicopter, tank, and an escapable EMP lockdown at higher stars.
- Police vehicles are non-collidable: crashes still wreck the rider without getting them stuck.
- Police difficulty settings from Easy to Death, plus accessibility options (reduced motion, larger interface text, high contrast).
- Username-based live multiplayer over MQTT; play solo if the broker is unavailable.
- Walk, look around, and see other riders on or off their bikes.
- Perform backflips, frontflips, and barrel rolls in the air; tricks require clean landings to score.
- Wheelie combo rewards cap at 3×, with a green / orange / red balance meter; F in the orange zone scrapes the hand on the ground for a trick, F in the red zone on the ground counts as a reaching-the-ground skill. The suspension activates when the bike lands from a wheelie or trick landing and rebounds on impact.
- Police cars, trees, rocks, buildings, and houses now block the rider and police vehicles.
- Helmet-cam slip HUD, minimap, boost bar, combo, wipeout, and air-time feedback.

## Garage and progression

Earn cash from riding, boosts, air time, and boost pads. The garage lists bikes in a clearer entry-to-performance progression, with prices reduced. Each performance upgrade adds 1.5% to its stat. The Mod Shop offers Factory, Trail, and Race setups for the telescopic front forks and rear coil-over, with smoother damping; Space pumps both, while bumps and landings actuate them independently. Install Street/Race boost mounts for 300%/400% of the bike price. ECU hack rolls cost at least $25,000 and keep the best rarity per bike: Common 50% (+5%), Uncommon 25% (+10%), Rare 15% (+20%), Epic 7% (+35%), Legendary 2.5% (+50%), Mythic 0.49% (+75%), and Secret 0.01% (all stats maxed). Hack rarity never installs a boost mount.

The garage also sells homes ranging from single-story houses to mansions. Buy one, then get off your bike and explore the inside. The bank balance readout in the HUD was restyled for a cleaner look.

## Multiplayer

Enter a rider name before starting. Live riders communicate over an MQTT broker (`wss://broker.emqx.io:8084/mqtt`) on topic `<room>/s` (`ebikelife-ghpages-v1`). Players using the same game link meet in the same room. If the broker is unavailable, the game remains playable solo.

## Deploy to GitHub Pages

The workflow in [deploy.yml](./.github/workflows/deploy.yml) publishes the static site to GitHub Pages whenever a commit is pushed to `main`. It can also be started manually from the repository's Actions tab.

To publish this project to a new GitHub repository, run these commands from the project directory (replace the remote URL with your repository's URL):

```sh
git init
git add .
git commit -m "Build E-Bike Life browser game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

In the repository, open **Settings → Pages**, set the build and deployment source to **GitHub Actions**, and save. Subsequent pushes to `main` deploy automatically; the first deployment may take a few minutes.
