# Tech debt

Living ledger of known compromises. Status: 🔧 open · ✅ resolved.

| ID | Description | Priority | Introduced | Status |
|----|-------------|----------|------------|--------|
| TD-001 | `session.jsonl` has no published schema. We parse the first line with a best-effort Zod schema (`.passthrough()`). If upstream changes field names (e.g. `name` → `title`), the list still renders but shows folder ids. **Remediation:** revisit when Craft Agents v1.0 ships a stable `sessions.schema.json`. | P1 | v0.1.0 | 🔧 |
| TD-002 | `workspaceRoot` default (`~/shared/CodePirate/7. workspace`) is the author's path. Users must reconfigure in preferences. **Remediation:** auto-detect by looking for a `.craft-agent/` marker or env var. | P2 | v0.1.0 | 🔧 |
| TD-003 | Extension icon is copied from the app bundle (`resources/icon.png`). Not a custom asset. **Remediation:** commission a Raycast-native icon once we ship v1.0. | P2 | v0.1.0 | 🔧 |
| TD-004 | Raycast Store's `CHANGELOG.md` format (`## {title} - {YYYY-MM-DD}`) differs from Release Please's. We maintain only the Release Please file; Store submission requires a manual conversion. **Remediation:** add a `scripts/prepare-store-release.mjs` when we first submit to Store. | P2 | v0.1.0 | 🔧 |
| TD-005 | Multi-workspace support is declared in SPEC (`workspace/{id}/...`) but no command exposes it yet — all commands target the focused window. **Remediation:** add a workspace picker preference when a user requests it. | P2 | v0.1.0 | 🔧 |
| TD-006 | No Windows/Linux support path. `craftagents://` is registered only by the macOS bundle. **Remediation:** verify registration on other platforms if Craft Agents ships desktop builds for them. | P2 | v0.1.0 | 🔧 |
| TD-007 | `ray lint` fails because the `author` field in `package.json` points to an unregistered Raycast user handle. Raycast Store submission blocks on this. **Remediation:** register `CodePirate7` (or chosen handle) on raycast.com, then remove `continue-on-error: true` from `.github/workflows/ci.yml`. | P1 | v0.1.0 | ✅ Resolved v1.0.1 — author set to `CodePirate` (Raycast handle), CI now gates on `ray lint`. |
