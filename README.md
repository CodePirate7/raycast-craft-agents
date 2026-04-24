# raycast-craft-agents

[![CI](https://github.com/CodePirate7/raycast-craft-agents/actions/workflows/ci.yml/badge.svg)](https://github.com/CodePirate7/raycast-craft-agents/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/CodePirate7/raycast-craft-agents)](https://github.com/CodePirate7/raycast-craft-agents/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> [中文 README](./README.zh-CN.md)

Raycast extension for the [Craft Agents](https://craft.do) desktop app. Open, resume, and navigate Craft Agents sessions without leaving Raycast. Built on the `craftagents://` deeplink protocol.

## Why

Every new session, every resume, every settings trip is a trip out of Raycast — back to the app, click the menu, wait for focus. This extension gives you one keystroke for each of:

- Open a fresh Craft Agents session
- Ask a question and auto-send it (the session window is already streaming when you alt-tab)
- Search & resume any recent session
- Jump to flagged sessions, sources, skills, settings

No IPC, no network — just deeplinks + filesystem reads. Safe, fast, transparent.

## Requirements

- macOS
- [Craft Agents](https://craft.do) desktop app, v0.8.9+ (registers the `craftagents://` URL scheme)
- [Raycast](https://www.raycast.com/) 1.80+
- Node.js 20+ (only for local development)

## Install

### From source (recommended for now)

```bash
git clone https://github.com/CodePirate7/raycast-craft-agents.git
cd raycast-craft-agents
npm install
npm run dev
```

Raycast will auto-import the extension when you run `npm run dev`.

### From Raycast Store

_Coming in v1.0._

## Usage

Type any of these into Raycast:

| Command | What it does |
|---------|--------------|
| `New Session` | Opens a fresh session, optional input / permission mode args. |
| `New Session (Quick)` | Like the app's menu "New Session" — zero args. |
| `Quick Ask` | Type a message → new session → message auto-sent. |
| `Resume Session` | Browse & resume recent sessions. |
| `Flagged Sessions` | Flagged-only list, with unflag/delete inline. |
| `Open View` | Jump to Settings / Sources / Skills / etc. |
| `Open Source` | List configured sources, trigger OAuth. |
| `Open Skill` | Browse global + workspace skills. |

See [`docs/COMMANDS.md`](./docs/COMMANDS.md) for detail.

## Configure

Raycast → Extensions → Craft Agents → Preferences:

- **Workspace Root** — where `sessions/`, `sources/`, `skills/` live. Default `~/shared/CodePirate/7. workspace`.
- **Global Skills Dir** — merged into `Open Skill` results. Default `~/.agents/skills`.

## Dev loop

```bash
npm run dev       # live-reload in Raycast
npm run lint      # Raycast's required lint (Store gate)
npm test          # vitest
npm run build     # production build
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Conventional Commits required — Release Please depends on them.

## Architecture

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) and [`docs/SPEC.md`](./docs/SPEC.md) (the `craftagents://` deeplink contract).

## License

[MIT](./LICENSE)
