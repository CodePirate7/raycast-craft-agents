# `craftagents://` Deeplink Specification

> **Status:** Stable (v1)
> **Upstream version:** Craft Agents v0.8.9
> **Source of truth:** `src/main/deep-link.ts` + `src/renderer/contexts/NavigationContext.tsx` in the Craft Agents app bundle.

This document is the contract between Craft Agents and this Raycast extension. Any change to the upstream `craftagents://` protocol must be reflected here before the extension is updated.

---

## 1. Protocol overview

- **Scheme:** `craftagents:`
- **Registered in:** `/Applications/Craft Agents.app` (macOS `CFBundleURLTypes`, via Electron `app.setAsDefaultProtocolClient`)
- **Invocation from shell:** `open "craftagents://..."`

The URL is parsed with Node's `URL` class. The first segment after `://` becomes `hostname`; the rest of the path becomes `pathname` (split on `/`). Query string parameters are `searchParams`.

## 2. URL categories

There are three top-level URL forms:

| Form | Example | Purpose |
|------|---------|---------|
| **Compound route** | `craftagents://allSessions/session/{id}` | Navigate the focused window to a built-in view. |
| **Action route** | `craftagents://action/{name}[/{id}][?params]` | Execute a side-effect (create/delete/flag sessions, trigger OAuth, etc.). |
| **Workspace-scoped** | `craftagents://workspace/{wsId}/{rest}` | Same as above but targets a specific workspace instead of the focused window. |

There is also `craftagents://auth-callback?...`, reserved for OAuth callbacks — **do not use** from Raycast.

## 3. Compound routes

Supported hosts (i.e. URL prefixes):

| Host | Optional path | Effect |
|------|---------------|--------|
| `allSessions` | `[/session/{sessionId}]` | Sessions list (all). Optional trailing `/session/{id}` selects a specific session. |
| `flagged` | `[/session/{sessionId}]` | Sessions list filtered to flagged. |
| `state` | `/{stateId}[/session/{sessionId}]` | Sessions list filtered by state id. |
| `sources` | `[/source/{sourceSlug}]` | Sources list; optional slug focuses one source. |
| `settings` | `[/{subpage}]` | Settings root; known subpages include `shortcuts`, `general`, `preferences`. |
| `skills` | `[/skill/{slug}]` | Skills list; optional slug focuses one skill. |

## 4. Actions

All actions live under `craftagents://action/{name}` (or `craftagents://workspace/{wsId}/action/{name}`). The optional path segment after `{name}` is the `id` for actions that operate on a target.

| Action | Target id | Query params | Notes |
|--------|-----------|--------------|-------|
| `new-session` | — | `input`, `mode`, `workdir`, `model`, `systemPrompt`, `name`, `status`, `label`, `send`, `badges` | Creates a new session. See §4.1. |
| `new-chat` | — | `input`, `name`, `send` | Creates a chat; `send=true` immediately sends `input`. |
| `resume-sdk-session` | `{sdkId}` | — | Resumes a Claude Code SDK session by its SDK-side id. |
| `rename-session` | `{sessionId}` | `name` | Renames an existing session. |
| `delete-session` | `{sessionId}` | — | Deletes. Not destructive in Raycast-layer UI; the app may prompt. |
| `flag-session` | `{sessionId}` | — | Flags. |
| `unflag-session` | `{sessionId}` | — | Unflags. |
| `oauth` | `{sourceSlug}` | — | Triggers OAuth for the given source. |
| `delete-source` | `{sourceSlug}` | — | Removes a configured source. |
| `set-mode` | — | (permission mode in params) | Changes the app-wide permission mode. |
| `copy` | — | — | Copy action (internal). |

### 4.1 `new-session` parameter reference

| Param | Type | Values / format | Effect |
|-------|------|-----------------|--------|
| `input` | string | Any text, URL-encoded. | Pre-fills or sends the initial message depending on `send`. |
| `send` | string | `"true"` | If truthy AND `input` is set, the message is sent immediately (100 ms after session creation). |
| `mode` | string | `plan` \| `acceptEdits` \| `bypassPermissions` \| `default` | Permission mode for the new session. |
| `workdir` | string | `user_default` \| `none` \| absolute path | Working directory for the new session. |
| `model` | string | Model id (e.g. `claude-opus-4-7`) | Which LLM to use. |
| `systemPrompt` | string | `default` \| `mini` \| preset id | System prompt preset. |
| `name` | string | Any text | Rename the session immediately after creation. |
| `status` | string | Status id | Sets session status + navigates filter to that state. |
| `label` | string | Label id | Adds a label (single) + navigates filter. |
| `badges` | string | JSON array of `ContentBadge` objects | Passed to `sendMessage` when `send=true`. |

All string params **must be URL-encoded** before concatenation.

## 5. Universal query parameters

These apply to **any** URL, compound or action:

| Param | Values | Effect |
|-------|--------|--------|
| `window` | `focused` \| `full` | Opens the deeplink in a *new* Raycast-style focused window or a full window, instead of navigating the currently-focused window. |
| `sidebar` | e.g. `history`, `files/{path}` | Opens the right sidebar to the given panel. |

## 6. Examples

```bash
# Open a brand-new session in a fresh focused window (same as app menu "New Session")
open "craftagents://action/new-session?window=focused"

# Ask a question and auto-send it
open "craftagents://action/new-session?input=Summarize%20my%20Linear%20tasks&send=true&window=focused"

# Resume session by Craft Agents session id (not SDK id)
open "craftagents://allSessions/session/260424-clever-pearl"

# Resume by Claude Code SDK session id
open "craftagents://action/resume-sdk-session/abc123-def456"

# Jump to a specific source
open "craftagents://sources/source/github"

# Trigger OAuth on a source
open "craftagents://action/oauth/linear"

# Open keyboard shortcuts settings
open "craftagents://settings/shortcuts"

# Multi-tenant: target a specific workspace
open "craftagents://workspace/ws123/allSessions/session/abc"
```

## 7. Compatibility matrix

| App version | Supported actions | Notes |
|-------------|-------------------|-------|
| v0.8.9 | All listed in §4 | Reference version for this spec. |

When support or syntax diverges in a future app version, add a row and document the delta. Extension code should not hard-code app version — it uses the deeplink builder and lets the app degrade gracefully.

## 8. Non-guarantees

1. **Silent ignores.** If a deeplink references a missing session/source/skill, the app may silently navigate to an empty state rather than surface an error. The extension does not receive a callback.
2. **No transactional guarantees.** Actions that mutate (delete/flag) fire-and-forget.
3. **Session id stability.** Session folder name = session id. Renaming does NOT change the id.
4. **`session.jsonl` format is undocumented.** The extension parses it opportunistically (see `src/lib/sessions.ts`). Upstream schema changes are handled with Zod `.passthrough()` + try/catch fallback.
