# AGENTS.md

> Map, not encyclopedia. Read this first; deeper docs are linked below.

## What this is

Raycast extension that wraps Craft Agents' `craftagents://` deeplink protocol. Lets you open, resume, and navigate Craft Agents sessions without leaving Raycast.

## Repo structure

```
.
├── AGENTS.md                    ← you are here
├── README.md / README.zh-CN.md
├── package.json                 ← Raycast manifest (commands + preferences)
├── tsconfig.json
├── docs/
│   ├── ARCHITECTURE.md          ← layered design + data flow diagrams
│   ├── SPEC.md                  ← full craftagents:// deeplink contract
│   ├── COMMANDS.md              ← user-facing command reference
│   └── tech-debt.md             ← known compromises, tracked
├── src/
│   ├── <command>.tsx            ← one file per Raycast command
│   └── lib/
│       ├── deeplink.ts          ← builds craftagents:// URLs (pure)
│       ├── errors.ts            ← AppError + ErrorCode
│       ├── logger.ts            ← structured JSON logger
│       ├── workspace.ts         ← workspaceRoot resolution
│       ├── sessions.ts          ← reads {workspaceRoot}/sessions/*
│       ├── sources.ts           ← reads {workspaceRoot}/sources/*/config.json
│       ├── skills.ts            ← reads skills (global + workspace)
│       └── *.schema.ts          ← Zod schemas (source of truth for external data)
└── src/__tests__/               ← vitest co-located tests
```

**Dependency direction:** `commands` → `lib/<domain>` → `lib/*.schema` → `lib/errors`/`logger`. Never the reverse.

## Common commands

```bash
npm install
npm run dev              # live-reload in Raycast
npm run build            # ray build -e dist
npm run lint             # ray lint (Store gate)
npm test                 # vitest run
npm run publish          # submit to Raycast Store (manual review)
```

## Architecture (one line)

Raycast command → DeepLink builder (pure) → `open(url)` → Craft Agents app. **No IPC. No network.** Filesystem reads are parse-tolerant (Zod + `.passthrough()` + try/catch fallback). See `docs/ARCHITECTURE.md`.

## Coding conventions

1. **All external input through Zod.** User args, `session.jsonl`, `config.json`, `SKILL.md` frontmatter — every boundary gets a schema. Import types via `z.infer`.
2. **No raw `throw new Error`.** Use `AppError` with an `ErrorCode`. Top-level command handlers catch and render via `showFailureToast`.
3. **No raw `console.log` in production paths.** Use `logger.info/warn/error` from `src/lib/logger.ts`. CLI-visible Raycast output is fine.
4. **Pure builders stay pure.** `deeplink.ts` has zero IO and zero Raycast imports — this keeps it 100% unit-testable.
5. **Commands are thin.** Command files (`src/<name>.tsx`) orchestrate only. Business logic goes in `lib/`.
6. **Conventional Commits required.** Release Please parses them. `feat:` / `fix:` / `docs:` / `chore:` / `ci:` / `refactor:` / `test:` / breaking changes marked `feat!:` or footer `BREAKING CHANGE:`.
7. **URL encode once, at the builder boundary.** Never build deeplinks by string concatenation inside a command.

## Key files

| File | Purpose |
|------|---------|
| `package.json` | Raycast manifest. Changing `commands[]` adds/removes user-visible entries. |
| `docs/SPEC.md` | **Contract** with the app. Update BEFORE changing `deeplink.ts`. |
| `src/lib/deeplink.ts` | Pure URL builder. The only allowed way to construct a `craftagents://` URL. |
| `src/lib/sessions.ts` | Reads `sessions/*/session.jsonl`. Must tolerate malformed data. |
| `src/lib/errors.ts` | `AppError` + `ErrorCode` enum. All business errors subclass/inherit. |
| `.github/workflows/ci.yml` | Lint + typecheck + build + test, gates every PR. |
| `.github/workflows/release-please.yml` | Auto-generates Release PR + tag on push to main. |
| `CHANGELOG.md` | **Do not edit by hand.** Release Please maintains it. |

## Docs

- [README](./README.md) — user-facing
- [docs/SPEC.md](./docs/SPEC.md) — `craftagents://` protocol
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — design + data flow
- [docs/COMMANDS.md](./docs/COMMANDS.md) — each command's behavior
- [docs/tech-debt.md](./docs/tech-debt.md) — tracked debt
- [CONTRIBUTING.md](./CONTRIBUTING.md) — commit conventions, dev loop
