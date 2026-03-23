# AGENTS.md

## Cursor Cloud specific instructions

### Overview

3Draw is a hackathon project (originally 2014) — an interactive 3D modeling web app built with **Meteor.js** and **Three.js**. It connects a smartphone gyroscope to a PC via WebSockets so users can draw lines in 3D space by tilting their phone. The original Meteor 0.8.0 configuration was upgraded to Meteor 2.16 because the 2014-era binaries can no longer be installed on modern systems.

### Running the dev server

```bash
METEOR_ALLOW_SUPERUSER=1 meteor run --port 3000
```

- Meteor automatically starts MongoDB on port 3001.
- App runs at `http://localhost:3000/`.
- On desktop, the "computer" view renders a Three.js 3D canvas with grid; on mobile, the "mobile" UI shows controls.
- Hot reload is supported: editing files in `client/` or `model.js` will auto-reload.
- First startup after dependency install takes ~60-90 seconds (Meteor builds all packages). Subsequent starts are faster.

### Key architecture notes

- **Local packages** in `packages/` replace the original external Meteorite dependencies (`streams`, `bootstrap-3`, `three-js`) since the upstream GitHub repos are no longer available.
- **Three.js r67** is used (bundled in `packages/three-js/three.js`) for API compatibility with the legacy `CanvasRenderer`, `Particle`, and `ParticleCanvasMaterial` classes.
- In the `three-js` package, `THREE` must NOT use `var` at the top of `three.js` (it must assign to the package-scope variable declared by Meteor's package wrapper).
- Client files (`client/*.js`) need `var THREE = window.THREE;` at the top since Meteor 2.x wraps each file in a module function scope.
- `model.js` sets `window.orientationStream` so it's accessible across module scopes.

### No automated tests

This hackathon project has no test framework or test files. Manual testing is the only option — load the app at `http://localhost:3000/` and verify the 3D canvas renders.

### No lint/build tooling

There is no ESLint, Prettier, or separate build step. Meteor handles all compilation (Stylus CSS, template compilation, JS bundling) internally.
