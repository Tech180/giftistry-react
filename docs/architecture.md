# Architecture

In-depth companion to the root [README](../README.md). This is how Giftistry's React client is structured and why.

## Goals

1. **Clear layers** — route/UI composition, domain features, and reusable primitives don't blur together.
2. **Separation of concerns** — every UI unit is a trio: logic, markup, styles (+ contracts).
3. **Predictable imports** — lower layers never reach up into pages or features.
4. **Local naming** — folder scope replaces redundant prefixes (`pages/friends/components/header`, not `friends-header`).

## Layer map

```text
src/
  app/          Bootstrap, routing, layout, pages, app providers
  features/     Domain UI + hooks (auth, items, wishlists, friends, …)
  shared/       Primitives (ui/), utils, interfaces, constants, shared providers
  core/         API clients, env, config (no React UI)
```

| Layer | May import | Must not import |
| ----- | ---------- | --------------- |
| `app/` | `core`, `shared`, `features` | — |
| `features/<domain>/` | `core`, `shared`, other **feature barrels** | `app/` |
| `shared/` | `core`, `shared` | `features/`, `app/` |
| `core/` | packages only | UI layers |

If a shared primitive needs a domain type or feature hook, **move the unit** into that feature (or inject a callback/node from `app` / the feature). Don't punch a hole upward.

Folder-level notes live under [`src/README.md`](../src/README.md) and descend from there.

## UI unit (SoC trio)

Every component folder:

```text
foo/
  foo.component.tsx      # state, effects, handlers → delegates to template
  foo.html.tsx           # JSX only — no hooks, no class-string builders
  foo.module.css         # BEM under one block, design tokens
  interfaces/
    props.interface.ts           # Props (or FooProps at shared/public surface)
    template-props.interface.ts  # TemplateProps
  utils/                 # optional pure helpers
  constants/             # optional tables / magic values
```

**Logic** builds class names, resolves labels, and passes multiline `propName = { value }` into the template.  
**Templates** bind prepared props and render structure.  
**Utils / constants / interfaces** stay in their folders — don't co-locate exported types or const tables inside `*.util.ts`.

Public types for shared primitives are re-exported from `shared/ui/index.ts` **from the interface file**, not from the component file.

Full UI/CSS detail: [ui-conventions.md](./ui-conventions.md).

## Domain placement

| Kind of UI | Lives in |
| ---------- | -------- |
| Button, drawer shell, badge, input | `shared/ui` |
| User preview card, item mini-drawer, wishlist card | `features/<domain>/components/…` |
| Route screens, page composition | `app/pages/<domain>/` |

Page folders use short local names (`header/`, `controls/`, `page.html.tsx`) with entry `friends.component.tsx` (or similar) at the page root.

## Feature barrels

Features expose a stable public API via `features/<domain>/index.ts`. Prefer:

```ts
import { UserPreviewCard } from 'features/auth';
```

over deep paths into internal folders — unless you're working inside that feature.

## CSS conventions (summary)

- CSS Modules + BEM: `.block`, `.block__element`, `.block--modifier`
- Prefer compound modifiers over descendant selectors
- Colors/spacing via theme tokens (`var(--primary)`, rem scale) — no raw theme `#hex` in modules
- Run `bun run audit` (colors + CSS conventions + module refs)

Details: [ui-conventions.md](./ui-conventions.md).

## Related

- [development.md](./development.md) — how to run and verify locally  
- [../CONTRIBUTING.md](../CONTRIBUTING.md) — PR expectations  
- [../src/README.md](../src/README.md) — nested folder READMEs
