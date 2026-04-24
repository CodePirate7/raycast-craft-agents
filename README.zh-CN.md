# raycast-craft-agents

[![CI](https://github.com/CodePirate7/raycast-craft-agents/actions/workflows/ci.yml/badge.svg)](https://github.com/CodePirate7/raycast-craft-agents/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/CodePirate7/raycast-craft-agents)](https://github.com/CodePirate7/raycast-craft-agents/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> [English README](./README.md)

为 [Craft Agents](https://craft.do) 桌面应用打造的 Raycast 扩展。通过 `craftagents://` deeplink 协议，让你不离开 Raycast 就能开新 session、恢复旧 session、跳转各类视图。

## 为什么做

每次新开 session、恢复、去设置，都得跳出 Raycast 回到 app 点菜单、等焦点切换。本扩展把高频操作压成一键：

- 开一个全新 session
- 输入一句话自动发送（切回 app 时答案已经在流式输出）
- 搜索并恢复任意最近 session
- 跳转已标记 session、数据源、技能、设置

不走 IPC、不走网络 —— 只通过 deeplink + 本地文件读取。安全、快、透明。

## 环境要求

- macOS
- [Craft Agents](https://craft.do) 桌面版 v0.8.9+（注册 `craftagents://` URL scheme）
- [Raycast](https://www.raycast.com/) 1.80+
- Node.js 20+（仅本地开发需要）

## 安装

### 从源码安装（当前推荐）

```bash
git clone https://github.com/CodePirate7/raycast-craft-agents.git
cd raycast-craft-agents
npm install
npm run dev
```

运行 `npm run dev` 后 Raycast 会自动导入扩展。

### 从 Raycast Store 安装

_v1.0 后发布_

## 命令一览

| 命令 | 作用 |
|------|------|
| `New Session` | 新开 session，支持可选的初始消息和权限模式参数 |
| `New Session (Quick)` | 无参数版本，等价菜单栏"新会话" |
| `Quick Ask` | 输入一句话 → 新开 session → 自动发送 |
| `Resume Session` | 浏览并恢复最近的 session |
| `Flagged Sessions` | 仅展示已标记的 session，支持取消标记/删除 |
| `Open View` | 跳转设置 / 数据源 / 技能等视图 |
| `Open Source` | 列出配置的数据源，可触发 OAuth |
| `Open Skill` | 浏览全局 + workspace 的 skills |

详见 [`docs/COMMANDS.md`](./docs/COMMANDS.md)。

## 配置

Raycast → 扩展 → Craft Agents → Preferences：

- **Workspace Root** — `sessions/`、`sources/`、`skills/` 所在目录，默认 `~/shared/CodePirate/7. workspace`
- **Global Skills Dir** — 合并到 Open Skill 的全局 skills 路径，默认 `~/.agents/skills`

## 开发

```bash
npm run dev       # Raycast 中热重载
npm run lint      # Raycast 官方 lint（Store 发布硬门控）
npm test          # vitest
npm run build     # 生产构建
```

## 贡献

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。必须使用 Conventional Commits —— Release Please 依赖于此。

## 架构

详见 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) 和 [`docs/SPEC.md`](./docs/SPEC.md)（`craftagents://` deeplink 契约）。

## License

[MIT](./LICENSE)
