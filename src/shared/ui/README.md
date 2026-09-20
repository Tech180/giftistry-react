# `shared/ui`

Reusable UI primitives. Each unit is a SoC trio under its own folder.

## Rules

- Logic in `*.component.tsx`; markup in `*.html.tsx`; styles in `*.module.css`
- No hooks / class-string builders / business rules in templates
- Public types: export from `interfaces/` via [`index.ts`](./index.ts) — not from the component file
- Domain composites (preview card, mini-drawer, linked squares) live in **features**, not here

## Docs

- [docs/ui-conventions.md](../../../docs/ui-conventions.md) — full SoC + CSS Modules detail
- [docs/architecture.md](../../../docs/architecture.md) — layer placement

## Related

- [↑ shared](../README.md)
