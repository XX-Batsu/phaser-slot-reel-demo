# phaser-slot-reel-demo

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-10.x-339933?logo=node.js&logoColor=white)](.nvmrc)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

A Yarn workspaces monorepo demonstrating a Phaser-based slot-reel game client,
split into three packages:

- `packages/slot-base` — slot game core library
- `packages/gameexternal` — static shell: Phaser, GSAP, audio, CSS
- `apps/islandofadventure` — the game client, built with webpack 1.x

This is a technical demonstration project. Backend `Init`/`Spin` responses are
simulated client-side — no backend server is required to run it.

## Requirements

- Node 10 (legacy webpack 1.x / babel 6 toolchain)
- Yarn 1.x (classic)

## Install & run

```bash
yarn install --ignore-engines
yarn dll
yarn start
```

Open `http://localhost:4000/?token=guest&language=zh-tw`.

More setup details will be added as this project develops.
