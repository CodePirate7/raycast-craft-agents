# Contributing

## Development loop

```bash
git clone https://github.com/CodePirate7/raycast-craft-agents.git
cd raycast-craft-agents
npm install
npm run dev        # Raycast auto-imports the extension
```

Edit any `src/*.tsx` file; Raycast hot-reloads. Logs stream to the Raycast developer console.

## Quality gates (run before PR)

```bash
npm run lint       # Raycast's required lint — Store gate
npm test           # vitest
npm run build      # full production build
```

All three must pass. CI re-runs them on every push to PRs.

## Commit conventions — Conventional Commits

Release Please generates versions and changelogs from commit messages. Non-compliant commits are silently dropped from the release notes.

### Allowed types

| Type | Semantic bump | Used for |
|------|---------------|----------|
| `feat:` | minor | New user-visible feature |
| `fix:` | patch | Bug fix |
| `perf:` | patch | Perf improvement |
| `docs:` | — | Docs only |
| `refactor:` | — | Refactor without behavior change |
| `test:` | — | Test additions/refactors |
| `ci:` | — | CI / workflow changes |
| `chore:` | — | Tooling, deps |
| `feat!:` / footer `BREAKING CHANGE:` | major | Breaking changes |

### Scope (optional)

Use a scope when the change is localized: `feat(resume-session): preserve filter state across reloads`.

### Subject

- Imperative mood ("add", not "added")
- No trailing period
- ≤ 72 chars
- English or Chinese both accepted; be consistent within a PR

### Body (optional but encouraged for non-trivial)

Explain the *why*, not the *what*. The diff shows the what.

### Examples

```
feat(quick-ask): support multi-line input with shift+enter
fix(resume-session): handle malformed session.jsonl first line
refactor(deeplink): extract action params into Zod schema
docs(spec): document resume-sdk-session parameters
ci: add Node 20 matrix to release-please workflow
feat!: rename preference "workspaceRoot" → "workspacePath"

BREAKING CHANGE: users must re-enter their workspace path.
```

## Pull request flow

1. Fork + branch from `main`.
2. Keep PRs focused — one concern per PR.
3. Update `docs/SPEC.md` if you touch deeplink construction or filesystem reader assumptions.
4. Update `docs/tech-debt.md` if you *resolve* or *introduce* debt (don't silently accumulate).
5. Ensure CI is green before requesting review.

## Architectural guardrails

Do not:

- Introduce network calls. This extension is offline-first by design.
- Bypass the `deeplink.ts` builder by concatenating URLs in command files.
- Throw raw `Error` — use `AppError` with an `ErrorCode`.
- Edit `CHANGELOG.md` manually — Release Please owns it.
- Add new user-visible commands without also updating `docs/COMMANDS.md`.

See [AGENTS.md](./AGENTS.md) for the full architecture and conventions.

## Releasing (maintainers)

`main` pushes trigger `.github/workflows/release-please.yml`. The action opens or updates a "chore(main): release x.y.z" PR that aggregates all unreleased `feat:` / `fix:` / etc. Merge it → tag + GitHub Release are created automatically.

Raycast Store submission is a **separate, manual** process — see `docs/tech-debt.md` TD-004 for details.
