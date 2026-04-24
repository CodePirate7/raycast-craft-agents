# Commands

All commands live under the **Craft Agents** extension in Raycast. Invoke via Raycast's search or assign keyboard shortcuts per your taste.

## `New Session`

- **Mode:** no-view
- **Arguments:** `input` (optional), `mode` (optional: `plan` / `acceptEdits` / `bypass` / `default`)
- **What it does:** Opens a brand-new Craft Agents session in a focused window.
- **Deeplink:** `craftagents://action/new-session?window=focused[&input=...&mode=...]`
- **Typical use:** Bind to a global shortcut, press it, optionally type a starter message. If no `input` given, you land on an empty session ready to type.

## `New Session (Quick)`

- **Mode:** no-view, no arguments
- **What it does:** Same as clicking the Craft Agents menu bar "New Session". Zero friction.
- **Deeplink:** `craftagents://action/new-session?window=focused`
- **Typical use:** You want a fresh session RIGHT NOW; no message, no setup.

## `Quick Ask`

- **Mode:** no-view
- **Arguments:** `input` (required)
- **What it does:** Creates a new session AND immediately sends your message. You alt-tab to Craft Agents and your answer is streaming.
- **Deeplink:** `craftagents://action/new-session?input=<msg>&send=true&window=focused`
- **Typical use:** Fleeting question, capture-and-answer workflow. Supports Chinese, emoji, quotes, newlines — anything you can type in Raycast.

## `Resume Session`

- **Mode:** view (list)
- **What it does:** Lists recent sessions from `{workspaceRoot}/sessions/`, sorted by last update. Search filters by name, id, labels. Enter jumps to that session in Craft Agents.
- **Deeplink:** `craftagents://allSessions/session/{sessionId}`
- **Data source:** `{workspaceRoot}/sessions/*/session.jsonl` first line. Malformed sessions fall back to folder name.

## `Flagged Sessions`

- **Mode:** view (list)
- **What it does:** Like `Resume Session` but filtered to flagged sessions. Supports inline actions: Unflag (`craftagents://action/unflag-session/{id}`), Delete (with confirm).

## `Open View`

- **Mode:** view (list)
- **What it does:** Quick navigator for built-in views — Settings, Settings → Shortcuts, Sources, Skills, All Sessions, Flagged.
- **Deeplinks:** various `craftagents://<host>[/subpath]`.

## `Open Source`

- **Mode:** view (list)
- **What it does:** Reads `{workspaceRoot}/sources/*/config.json`, lists configured sources, opens the selected one.
- **Primary deeplink:** `craftagents://sources/source/{slug}`
- **Secondary action:** Trigger OAuth → `craftagents://action/oauth/{slug}`.

## `Open Skill`

- **Mode:** view (list)
- **What it does:** Merges skills from global (`~/.agents/skills/`, configurable) and workspace (`{workspaceRoot}/skills/`). Reads each `SKILL.md` frontmatter for title + description.
- **Primary deeplink:** `craftagents://skills/skill/{slug}`

## Preferences

Set once in Raycast:

- **Workspace Root** — defaults to `~/shared/CodePirate/7. workspace`. Where `sessions/`, `sources/`, `skills/` live.
- **Global Skills Dir** — defaults to `~/.agents/skills`. Merged into `Open Skill` results.
