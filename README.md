# phaser-slot-reel-demo

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-10.x-339933?logo=node.js&logoColor=white)](.nvmrc)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

A Yarn workspaces monorepo demonstrating a Phaser-based slot-reel game client
that runs standalone on a single machine with **no backend**:

- `packages/slot-base` — slot game core library
- `packages/gameexternal` — static shell: Phaser, GSAP, jQuery, audio, CSS
- `apps/islandofadventure` — the game client, built with webpack 1.x

The game normally needs a backend WebSocket server for login (`Init`) and each
spin (`Spin`). For this demo that dependency is **simulated in the front end**:
`apps/islandofadventure/src/js/main/SocketSimulator.js` has `offlineDemo = true`,
so `Init` and `Spin` responses are generated locally (config, reel strips, idle
and respin were already faked client-side). Starting the front end is enough to
play; every 3rd spin returns a canned winning result, the rest are non-winning.

To reconnect a real backend later, set `offlineDemo = false` in
`SocketSimulator.js` and provide `IP` via the build/start environment.

## Prerequisites

- **Node 10** (this legacy toolchain — webpack 1.13 / babel 6 / happypack 3 —
  does not install on modern Node). Install via nvm-windows: `nvm install 10.24.1`.
- **Yarn 1.x** (classic). Install under Node 10: `npm install -g yarn`.

### Important: make sure Node 10 is the active `node`

If a standalone Node (e.g. `C:\Program Files\nodejs`) is on your system `PATH`, it
takes precedence over nvm. Prepend the nvm shim in each shell before running
node/npm/yarn (shell state does not persist between separate terminals):

```powershell
$env:Path = 'C:\nvm4w\nodejs;' + $env:Path
node -v   # must print v10.24.1
```

## Install

```powershell
$env:Path = 'C:\nvm4w\nodejs;' + $env:Path
yarn install --ignore-engines
```

`--ignore-engines` is required: a transitive dependency declares `engines.node >= 22`,
which would otherwise abort the install on Node 10. It is not actually used at runtime.

The root `workspaces.nohoist` keeps `slot-base`, `GameExternal`, and
`bs-html-injector` in the **app-local** `apps/islandofadventure/node_modules/`,
because the webpack config, `.babelrc` module-resolver, the dev server's static
route, and BrowserSync resolve them by app-local literal path.

## Dev mode (run from `src`)

```powershell
$env:Path = 'C:\nvm4w\nodejs;' + $env:Path
yarn dll     # generate the DLL bundle (first run, or after dependency changes)
yarn start
```

Then open: `http://localhost:4000/?token=guest&language=zh-tw`

- webpack-dev-server runs on `:3100`; BrowserSync proxies it on `:4000` — use `:4000`.
- `yarn start` automatically points `slot-base` at its `src` sources.
- You may see one harmless `bs-html-injector` `MODULE_NOT_FOUND` line from the
  BrowserSync admin UI (`:3001`). It does not affect the game on `:4000`.

## Standalone build + serve (single-machine demo)

```powershell
$env:Path = 'C:\nvm4w\nodejs;' + $env:Path
yarn build:standalone   # ~40s: builds slot-base lib, DLL, production bundle, copies GameExternal
yarn serve              # serves apps/islandofadventure/build via http-server on :8080
```

Then open: `http://localhost:8080/?token=guest&language=zh-tw`

The `build/` output is self-contained (bundle, DLL, and a copied `GameExternal/`),
served by `http-server` with no other process and no backend.

> `build:standalone` switches `slot-base` to its prebuilt `lib`. `yarn start`
> switches it back to `src` automatically, so you can alternate freely. To reset
> manually: `node apps/islandofadventure/script/switch-base.js src`.

## Scripts (root)

| Command | What it does |
|---------|--------------|
| `yarn install --ignore-engines` | Install workspaces (nohoist links to app-local) |
| `yarn dll` | Build the dev DLL bundle |
| `yarn start` | Dev server (`:4000`) from `src` |
| `yarn build:standalone` | Production build into `apps/islandofadventure/build` |
| `yarn serve` | Serve the build via `http-server` on `:8080` |
| `yarn lint` | ESLint the game source |

## Third-party software (not owned by this project)

`packages/gameexternal/js/` vendors several third-party runtime libraries that
are **not authored by, and not owned by, this project or its maintainer**. Each
carries its own license from its original vendor:

- **Phaser** (`Phaser.js`, `Phaser.min.js`) — [Phaser](http://phaser.io) game
  framework, MIT licensed.
- **Photon JavaScript SDK** (`Photon-Javascript_SDK.min.js`) — multiplayer
  networking SDK by [Photon Engine](https://www.photonengine.com) / Exit Games,
  under Photon's own SDK license terms.
- **GSAP / Club GreenSock plugins** (`TimelineMax.min.js`, `TimelineLite.min.js`,
  `CustomEase.min.js`, `EasePack.min.js`, `BezierPlugin.min.js`,
  `EaselPlugin.min.js`) — animation tweening engine by
  [GreenSock](https://greensock.com), under the GreenSock license terms printed
  in each file's header.
- **Creature Runtimes** (`CreaturePackModule.js`, `CreaturePhaserPackRenderer.js`,
  `CreaturePixiPackJSRenderer.js`, `ParticleEditorPlugin.js`) — 2D skeletal
  animation runtime by [Kestrel Moon Studios](https://creature.kestrelmoon.com),
  under the Creature Runtimes License printed in each file's header.

These files are included byte-identical to their original vendor distribution,
under a license held for this demo. Redistribution or reuse of these specific
files outside this repository is subject to each vendor's own license terms —
see `THIRD_PARTY_LICENSES.md` for the full breakdown. "Phaser", "Photon",
"GreenSock"/"GSAP", and "Creature" are trademarks of their respective owners;
this project is an independent, unaffiliated demo and claims no rights over
them.

## Notes

- The `async_hooks` "Module not found" line during builds is a benign webpack 1.x
  message from `bluebird`; the bundle still compiles and emits successfully.
- Generated artifacts (`node_modules/`, `apps/*/build/`, `apps/*/src/dlls/`,
  `packages/slot-base/lib/`) are git-ignored and regenerated by the commands above.

## License

MIT (see `LICENSE`) for this project's original code. Vendored third-party
libraries under `packages/gameexternal/js/` are licensed separately — see
[Third-party software](#third-party-software-not-owned-by-this-project) above
and `THIRD_PARTY_LICENSES.md`.
