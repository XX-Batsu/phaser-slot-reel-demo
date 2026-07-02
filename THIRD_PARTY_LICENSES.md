# Third-Party Licenses & Attribution

This project's original source code is MIT licensed (see `LICENSE`). It bundles
several third-party runtime libraries and assets in `packages/gameexternal/js/`,
each under its own license, listed below. This project is not affiliated with,
endorsed by, or sponsored by any of the trademark holders listed.

## Vendored libraries (`packages/gameexternal/js/`)

| File(s) | Library | License |
|---|---|---|
| `Phaser.js`, `Phaser.min.js` | [Phaser](http://phaser.io) game framework v1.0 | MIT |
| `Photon-Javascript_SDK.min.js` | Photon JavaScript SDK ([Photon Engine](https://www.photonengine.com) / Exit Games) | Photon Engine SDK License — redistribution governed by the Photon account/subscription under which it was obtained |
| `TimelineMax.min.js`, `TimelineLite.min.js`, `CustomEase.min.js`, `EasePack.min.js`, `BezierPlugin.min.js`, `EaselPlugin.min.js` | GSAP / Club GreenSock plugins v1.18.6–era ([GreenSock](https://greensock.com)) | GreenSock standard/Club license per the header of each file — see `http://greensock.com/standard-license` |
| `CreaturePackModule.js`, `CreaturePhaserPackRenderer.js`, `CreaturePixiPackJSRenderer.js`, `ParticleEditorPlugin.js` | Creature Runtimes ([Kestrel Moon Studios](https://creature.kestrelmoon.com)) | Creature Runtimes License (Kestrel Moon Studios), full text embedded in each file's header |

The exact license text for each vendored file is included verbatim in that
file's header comment; consult the file itself for the authoritative terms.
These files are kept byte-identical to the original vendor distribution.

## npm runtime dependencies

| Package | License |
|---|---|
| [i18next](https://www.npmjs.com/package/i18next) | MIT |
| [i18next-xhr-backend](https://www.npmjs.com/package/i18next-xhr-backend) | MIT |
| [lodash](https://www.npmjs.com/package/lodash) | MIT |
| [crypto-js](https://www.npmjs.com/package/crypto-js) | MIT |

Development-only dependencies (build tooling: webpack, babel, eslint, jest,
browser-sync, etc.) are not redistributed in built output and are omitted here;
see each workspace's `package.json` / `yarn.lock` for the full list.

## Trademark disclaimer

"Phaser", "Photon" / "Photon Engine", "GreenSock" / "GSAP", and "Creature" /
"Kestrel Moon Studios" are trademarks of their respective owners. Their use
here is solely to identify the libraries and does not imply any affiliation,
sponsorship, or endorsement of this project.
