# `scripts/`

Repo tooling (not app runtime).

| Script | Purpose |
|--------|---------|
| `sync-theme-catalog.ts` | Sync theme catalog (`predev` / `prebuild`) |
| `audit-theme-colors.ts` | Hex / token color audit |
| `audit-css-conventions.ts` | CSS convention audit |
| `audit-css-module-refs.ts` | Broken CSS module references |
| `dev-all.ts` | Orchestrate client + related services |

Run via `package.json` scripts (`bun run audit`, `bun run sync:theme-catalog`, `bun run dev:all`).

## Related

- [docs/development.md](../docs/development.md)  
- [↑ Root README](../README.md)
