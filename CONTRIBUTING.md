# Contributing

Thanks for helping with Giftistry. This guide is for **people changing code** — the root [README](README.md) stays short; this one is the contract for PRs.

## Before you start

1. Read [docs/architecture.md](docs/architecture.md) (layers + SoC).
2. Skim [docs/development.md](docs/development.md) (scripts + audits).
3. Skim [docs/ui-conventions.md](docs/ui-conventions.md) when touching UI.
4. Prefer a focused PR over a kitchen-sink refactor.

## What we look for

### Structure

- New UI is a **trio**: `*.component.tsx` / `*.html.tsx` / `*.module.css` + `interfaces/`.
- No business logic or class-string builders in `*.html.tsx`.
- No exported types or const tables inside `*.util.ts` — use `interfaces/` and `constants/`.
- Public shared types: export from the interface file via `shared/ui/index.ts`, not via the component file.
- Domain composites live under `features/`; primitives under `shared/ui`.

### Code style

- TypeScript strict; prefer clear, compact expressions.
- Logic → template props use multiline `propName = { value }`.
- CSS: BEM + tokens; no theme hex in modules.
- Don't add `useMemo` / `useCallback` by default (React Compiler / project norms).

### Tests

- Update or add Vitest coverage for behavior you change.
- Fix broken mocks when import paths move (barrels vs deep paths).

## PR checklist

- [ ] Right layer (`app` / `features` / `shared` / `core`)
- [ ] SoC trio respected for new/changed UI
- [ ] `bun run lint` clean on touched areas
- [ ] `bun run audit` clean if CSS/tokens touched
- [ ] `bun run test` (or scoped Vitest) green
- [ ] `bun run build` if types / public APIs changed
- [ ] No secrets committed
- [ ] Commit message focuses on **why**

## Commit messages

Short, imperative, why-first:

```text
Move preview card into features/auth to clear shared layer leaks
```

Not:

```text
Update files
```

## Scope tips

| Change type | Suggested home |
| ----------- | -------------- |
| New shared control | `src/shared/ui/<name>/` + barrel export |
| Wishlist-only UI | `src/features/wishlists/` |
| New route/page | `src/app/pages/<domain>/` |
| API client | `src/core/` |

If you're unsure whether something is shared or domain-specific: **default to the feature**. Promote to `shared` only when a second domain needs the same primitive.

## Reviews

Reviewers will prioritize:

1. Layer / SoC correctness  
2. User-visible regressions  
3. Test + audit hygiene  
4. Naming consistency with nearby folders  

Nitpicks on style that already match neighbors can wait — match the file you're in.

## Questions

Open an issue or discuss in your usual channel before large architectural moves (new layers, renaming all barrels, etc.).

## Related

- [README.md](README.md)  
- [docs/architecture.md](docs/architecture.md)  
- [docs/development.md](docs/development.md)  
- [docs/ui-conventions.md](docs/ui-conventions.md)
