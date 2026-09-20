# Development

How to run, test, and audit the Giftistry React client locally.

## Prerequisites

- **Node** (LTS) or **Bun** (preferred for scripts that use `bun run`)
- Giftistry **API** reachable (see backend repo / your compose stack)
- Copy or configure env as required by `core/config` (API URL, etc.)

## Install

```bash
bun install
# or
npm install
```

## Scripts

| Command | Purpose |
| ------- | ------- |
| `bun run dev` / `bun run start` | Vite dev server (`--host`) |
| `bun run build` | `tsc --noEmit` + production build |
| `bun run preview` | Preview production build |
| `bun run test` | Vitest once |
| `bun run test:watch` | Vitest watch |
| `bun run lint` | ESLint on `src` |
| `bun run audit` | Theme color + CSS convention + CSS module ref audits |
| `bun run audit:colors` | Hex / token audit only |
| `bun run audit:css` | CSS convention audit |
| `bun run audit:css-modules` | Broken CSS module references |
| `bun run sync:theme-catalog` | Sync theme catalog (also runs on `predev` / `prebuild`) |
| `bun run dev:all` | Orchestrated client + related services (`scripts/dev-all.ts`) |

## Typical loop

```bash
bun run dev
# in another terminal, while changing shared UI / features:
bun run test:watch
```

Before opening a PR:

```bash
bun run lint
bun run audit
bun run test
bun run build
```

Scope Vitest when iterating:

```bash
npx vitest run src/shared/ui
npx vitest run src/features/items
```

## Path aliases

Imports use Vite/tsconfig aliases (`shared/…`, `features/…`, `app/…`, `core/…`). Prefer those over long relative climbs across layers.

## Project map (quick)

```text
src/app        pages, layout, bootstrap
src/features   domain packages
src/shared     ui, utils, interfaces, constants, providers
src/core       API / env / config
scripts/       audits, theme sync, dev orchestration
```

Deep structure: [architecture.md](./architecture.md). Source map: [../src/README.md](../src/README.md). Scripts: [../scripts/README.md](../scripts/README.md).

## Environment notes

- Don't commit secrets (`.env`, credentials). Document required keys here or in a private ops doc — never invent sample secrets in git.
- Theme catalog sync runs before `dev` / `build`; if theme swatches look stale, run `bun run sync:theme-catalog` explicitly.

## Troubleshooting

| Symptom | Try |
| ------- | --- |
| Theme / color audit fails | Replace `#hex` with tokens; see `audit:colors` output |
| CSS module key missing | `audit:css-modules` + check BEM renames |
| Import into `shared` from `features` | Move the unit or inject from above — layer leak |
| Tests fail on path / mock | Align mocks with barrel paths after SoC moves |

## Related

- [../README.md](../README.md) — short public face  
- [../CONTRIBUTING.md](../CONTRIBUTING.md) — PR checklist  
- [architecture.md](./architecture.md) — layers and SoC  
- [ui-conventions.md](./ui-conventions.md) — UI/CSS detail
