# Security

Greenfield project — there is no legacy code to audit. This file is the standing checklist that every new PR must pass.

## Threat model (short)

The extension runs inside Raycast with the user's own filesystem permissions. It does not listen on any network socket, make outbound requests, or evaluate remote code. The only inputs are:

1. **User-typed Raycast arguments** (strings)
2. **Raycast preferences** (strings, paths)
3. **Local files** under `{workspaceRoot}/sessions/`, `sources/`, `skills/`

The primary attack surfaces are:

- **Path traversal** via workspace configuration or malicious filenames → could lead to reading files outside the intended workspace.
- **Shell / URL injection** if user input is concatenated into `craftagents://` URLs or passed to `exec` without encoding.
- **Denial-of-service by malformed JSON** (e.g. a multi-MB `session.jsonl` or syntactically broken file) → parser must bound work and never `throw` up to the command layer.

## Rules for contributors

1. **Encode once at the boundary.** All user-provided strings that end up in a `craftagents://` URL go through `encodeURIComponent` *inside* `src/lib/deeplink.ts`. Never pre-encode at the call site, never concatenate manually in a command file.
2. **Never `exec` / `spawn` with user input.** The extension uses Raycast's `open()` API only. If a future command needs a child process, the argv array form MUST be used (never `sh -c "$cmd"`).
3. **Resolve `~` and canonicalize paths.** `src/lib/workspace.ts` expands `~` via `os.homedir()` and calls `path.resolve`. It rejects paths containing `..` segments after resolution.
4. **Bound the filesystem read.** Session listing reads at most the first line of each `session.jsonl` (capped at ~64 KB). `sources/*/config.json` is bounded to ~1 MB. Files exceeding the cap are skipped with a `logger.warn`.
5. **Zod guards every external input.** User args, preferences, and file contents are parsed with a Zod schema before use. Schemas use `.passthrough()` for advisory fields (future-proofing) but strict typing for anything that flows into URLs, filesystem paths, or child processes.
6. **No `eval`, no `new Function`, no dynamic `require`.** Enforced by `@raycast/eslint-config`.
7. **Never log secrets.** OAuth tokens, API keys, file contents should never be written by `logger`. Log the action (`auth.started`), not the payload.
8. **Deleting anything is two-step.** Any destructive action in a `view`-mode command must go through Raycast's `confirmAlert` before firing.

## Reporting

Private disclosure: open a GitHub Security Advisory or email the repo owner. Please do not file public issues for suspected vulnerabilities.
