# WheelieX

A browser-based 3D electric-bike wheelie game. The Three.js scene, physics, user interface, synthesized motor audio, garage, progression, local records, and optional Firebase multiplayer run directly in the browser. The static game has no build step or npm dependencies.

## Run locally

Use any static HTTP server from the repository root; ES modules must be served over HTTP rather than opened as a `file://` URL. For example:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Three.js and the optional Firebase SDK are loaded from their CDNs, so an internet connection is required. Progress and offline records are saved to this browser's `localStorage`.

## Controls

- Hold **Up**, **W**, or **Space** to accelerate and lift the front wheel.
- Tap or hold **Down** or **S** to apply the rear brake and bring the front wheel down.
- Steer with **Left/Right** or **A/D** to carve across the road.
- While the front wheel is up, press **Q** for a no-hander or **E** for a barspin. Stick the trick to bank bonus points. Touchscreens have throttle, brake, steering, and trick controls.
- Press **Esc** to pause or resume.
- Stay near the balance gauge's sweet spot to increase the distance score multiplier. Looping out or landing the front wheel too hard ends the run; earned points convert to cash.

## Garage and progression

Earn cash by riding wheelies. Unlock bikes and buy upgrades for lift-motor torque, rear braking, and top speed in the garage. Your cash, selected build, upgrades, and local leaderboard persist in `localStorage`.

## Firebase live riders and global leaderboards (optional)

The game works without a Firebase project: multiplayer is disabled and the leaderboard uses local browser records. To enable Firebase Realtime Database:

1. Create a Firebase project and register a web app. Create a Realtime Database in the project.
2. In [game.js](./game.js), replace the five example values in `FIREBASE_CONFIG` with the web app configuration from Firebase project settings, including the database URL for your region.
3. Configure Realtime Database security rules and, if desired, Firebase Authentication to authorize player writes. The client uses `wheeliex/players/{playerId}` for live ghost riders and `wheeliex/leaderboards/{distance,cash}` for records.
4. Serve the deployed site over HTTPS. The game shows Firebase connection or upload errors in the browser console and falls back to local records when Firebase is not configured.

Client-side Firebase web app keys identify the app, not an administrative credential. Do not put service-account keys or other secrets in browser code. Configure database access rules appropriate to your project; permissive public write rules allow users to modify leaderboard data.

## Deploy to GitHub Pages

The workflow in [deploy.yml](./.github/workflows/deploy.yml) publishes the static site to GitHub Pages whenever a commit is pushed to `main`. It can also be started manually from the repository's Actions tab.

To publish this project to a new GitHub repository, run these commands from the project directory (replace the remote URL with your repository's URL):

```sh
git init
git add .
git commit -m "Build WheelieX browser game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

In the repository, open **Settings → Pages**, set the build and deployment source to **GitHub Actions**, and save. Subsequent pushes to `main` deploy automatically; the first deployment may take a few minutes.
