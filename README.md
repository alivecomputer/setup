# Walnut Setup

The setup experience for your alive computer.

Download, open, answer a few questions. Your World is built.

## Download

**[Download Walnut Setup](https://github.com/alivecomputer/walnut/releases/latest)** (macOS, Apple Silicon, 3.9MB)

First time opening? Right-click → Open.

## What it does

1. Asks your name
2. Asks what you do (builder, engineer, or both)
3. Asks about your projects (with codebase paths for engineers)
4. Asks who matters (people become walnuts)
5. Asks where your context lives (100+ tools across 11 categories)
6. Recommends a Claude plan
7. Lets you pick a theme
8. Creates your World — pre-filled with everything you told it

By the time you type `walnut:world`, your squirrel already knows you.

## Prefer terminal?

Three commands:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node && npm install -g @anthropic-ai/claude-code
claude plugin install alivecomputer/walnut
```

Then: `cd ~/world && claude`

## Build from source

```bash
npm install
cargo install tauri-cli
npx tauri build
```

Requires Rust and Node.js.

## Tech

Tauri (Rust + React). 3.9MB binary. No Electron.

---

[walnut.world](https://walnut.world) · [github.com/alivecomputer/walnut](https://github.com/alivecomputer/walnut) · [skool.com/worldbuilders](https://skool.com/worldbuilders)
