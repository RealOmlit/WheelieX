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
- Hold **Space/Shift** to lift and balance a wheelie; use **W/S** to balance.
- Press **F** to mount or dismount (stop first); click the game and move the mouse to look around. Use **W/A/S/D** to walk when off the bike.
- Hold **E** for boost after installing a boost mount; **G** opens the garage.
- Tap the speed readout to toggle kilometres per hour and miles per hour.
- Touch controls mirror throttle, brake, steer, wheelie, boost, and mounting.

## Features

- Procedurally generated 3D city with chunks, ramps, obstacle orbs, and boost pads.
- Police wanted system with chase, bust, and escape flow.
- Username-based live multiplayer over MQTT; play solo if the broker is unavailable.
- Walk, look around, and see other riders on or off their bikes.
- Helmet-cam slip HUD, minimap, boost bar, combo, wipeout, and air-time feedback.

## Garage and progression

Earn cash from riding, boosts, air time, and boost pads. Unlock bikes and buy upgrades across motor power, torque, balance, and boost. The Mod Shop offers Factory, Trail, and Race suspension setups with visible suspension travel; install Street/Race boost mounts for 300%/400% of the bike price, or purchase the ECU overclock to max stats and unlock boost software.

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
