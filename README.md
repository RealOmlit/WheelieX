# E-Bike Life

A browser-based 3D electric bike stunt game. The Three.js scene, physics, HUD, synthesized motor audio, AI ghost riders, police chases, garage, progression, and optional MQTT multiplayer run directly in the browser. The static game has no build step or npm dependencies.

## Run locally

Use any static HTTP server from the repository root; ES modules must be served over HTTP rather than opened as a `file://` URL. For example:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Three.js, MQTT.js, and web fonts load from their CDNs, so an internet connection is required.

## Controls

- Hold **W** (or **Up/Space**) to accelerate; hold **S** (or **Down**) to brake.
- Steer with **A/D** or **Left/Right**.
- Hold **Shift** together with **W** to lift and balance a wheelie; hold **Shift** together with **S** for a stoppie.
- Hold **E** (or **F**) for boost; **G** opens the garage.
- Tap the speed readout to toggle kilometres per hour and miles per hour.
- Touch controls mirror throttle, brake, steer, wheelie, boost, and garage.

## Features

- Procedurally generated 3D city with chunks, ramps, obstacle orbs, and boost pads.
- Police wanted system with chase, bust, and escape flow.
- AI ghost riders; optional live multiplayer over MQTT.
- Helmet-cam slip HUD, minimap, boost bar, combo, wipeout, and air-time feedback.

## Garage and progression

Earn cash from riding, boosts, air time, and boost pads. Unlock bikes and buy upgrades across motor power, torque, balance, and boost.

## Multiplayer

Live riders communicate over an MQTT broker (`wss://broker.emqx.io:8084/mqtt`) on topic `<room>/s` (`ebikelife-ghpages-v1`). When no riders are connected, AI ghost riders fill the session. The game also runs fully offline with local AI traffic.

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
