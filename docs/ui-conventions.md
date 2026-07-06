# UI Conventions

## Interface files

Every TypeScript contract (`interface` or `type`) lives in a co-located `interfaces/` folder — one export per file:

```
shared/ui/button/interfaces/button-props.interface.ts   ← ButtonProps only
shared/ui/tab-bar/interfaces/tab-definition.interface.ts ← TabDefinition only
```

- Filename: kebab-case ending in `.interface.ts`
- No inline interfaces in `.component.tsx`, `.html.tsx`, or provider files (re-exports from `interfaces/` are OK)
- Domain models (`Item`, `Wishlist`) also use `features/{domain}/interfaces/{name}.interface.ts`


Every UI component lives in its own folder:

```
shared/ui/tab-bar/
├── tab-bar.component.tsx      # logic: state, effects, handlers
├── tab-bar.html.tsx           # markup only
├── tab-bar.module.css         # token-only styles
└── interfaces/
    ├── tab-bar-props.interface.ts
    └── tab-bar-template-props.interface.ts
```

React exports use **PascalCase** (`TabBar`). Paths and filenames use **kebab-case**.

## Separation of concerns

| File | Allowed | Forbidden |
|------|---------|-----------|
| `*.component.tsx` | hooks, API, handlers, `<Template {...props} />` | JSX beyond template delegation |
| `*.html.tsx` | JSX, conditional render, className assembly | hooks, fetch, context, constants, helper functions |
| `*.module.css` | `var(--token)`, layout, animation, kebab-case selectors | `#hex`, `rgb()`, `hsl()` for theme colors, raw px for spacing/typography, deep nesting |

## CSS Modules

### Class naming

Write selectors in **kebab-case** inside `.module.css`. Vite maps them to camelCase in TSX via `localsConvention: 'camelCase'`:

```css
/* add-item-form.module.css */
.error-banner { ... }
```

```tsx
/* add-item-form.html.tsx — no rename needed */
<div className={styles.errorBanner} />
```

### Spacing and typography tokens

Use engine tokens instead of raw `px` for spacing and typography:

| px | Token |
|----|-------|
| 4 | `var(--spacing-xs)` |
| 8 | `var(--spacing-sm)` |
| 12 | `var(--spacing-base)` |
| 16 | `var(--spacing-md)` |
| 24 | `var(--spacing-lg)` |
| 32 | `var(--spacing-xl)` |
| 48+ | `var(--spacing-2xl)` / `3xl` / `4xl` |

Typography: `var(--font-size-*)`, `var(--font-weight-*)`, `var(--line-height-*)`.  
Radius: `var(--radius-sm|md|lg|full)`.  
Transitions: `var(--transition-fast|normal|slow)`.

**Allowed raw px:** `1px` borders/hairlines, `0`, viewport units, third-party canvas constraints (allowlisted).

### Flat nesting

- Max nesting depth **1** — only `@media` blocks may wrap selectors
- No descendant styling (`.parent .child`) — use modifier classes on the same element
- Modifiers: `.item-card.item-card--active` or `.container.add-open`
- No `&` nesting; one selector per rule block

| `interfaces/` | TypeScript types | runtime code |

## Utils

Pure helpers live by layer — keep logic out of components and templates.

| Location | Use for |
|----------|---------|
| `shared/utils/` | Cross-feature pure helpers (dates, URLs, initials, item description parse, site names, export formatting) |
| `shared/interfaces/` | Shared types used by `shared/utils/` (e.g. item description metadata) |
| `features/{domain}/utils/` | Domain-specific logic (wishlist expiration, category labels with constants) |
| `features/{domain}/constants/` | Domain constants referenced by feature utils |
| `core/theme/` | Theme/color/token helpers |
| Component folders | CSS-module-tied helpers only (e.g. `getAvatarBgColor` in wishlist card) |

**Layer rule:** `shared/` must not import from `features/` or `app/`. Anything used by `shared/utils/wishlist-export.ts` belongs in `shared/utils/` or `core/`.

## Shared UI: Sidebar vs Drawer

| Component | Location | Use for |
|-----------|----------|---------|
| `Sidebar` / `SidebarItem` | `shared/ui/sidebar/` (+ `item/`) | Persistent nav rail (e.g. profile settings tabs) |
| `Drawer` / `MiniDrawer` | `shared/ui/drawer/` (+ `mini/`) | Slide-out overlay panels (wishlist add-item, comments) |
| `SettingsSidebar` | `app/pages/settings/components/settings-sidebar/` | Settings page composition using `Sidebar` + `SidebarItem` |

## Layer boundaries

| Layer | May import from |
|-------|-----------------|
| `core/` | node modules only |
| `shared/ui/` | `core/`, `shared/` |
| `features/*/` | `core/`, `shared/`, other feature barrels |
| `app/` | `core/`, `shared/`, `features/*` |

## CSS tokens

Use semantic aliases from [global.css](../src/assets/styles/global.css):

| Alias | Engine source | Usage |
|-------|---------------|-------|
| `--bg` | `--theme-bg` | page background |
| `--surface` | `--theme-surface` | cards, panels |
| `--text` | `--theme-text` | primary text |
| `--text-muted` | `--theme-text-muted` | secondary text |
| `--border` | `--theme-border` | borders |
| `--primary` | `--theme-primary` | brand actions |
| `--primary-hover` | `--theme-primary-hover` | hover states |
| `--primary-text` | `--theme-primary-text` | text on primary bg |
| `--primary-rgb` | `--theme-primary-rgb` | rgba overlays |
| `--error` | `--theme-error` | error text/icons |
| `--error-bg` | `--theme-error-bg` | error surfaces |
| `--success` | `--theme-success` | success states |
| `--warning` | `--theme-warning` | warning states |

Overlays: `rgba(var(--primary-rgb), 0.08)` is allowed.

## Where components belong

- **shared/ui/** — stateless primitives (Button, TabBar, LoadingState)
- **app/layout/** — app shell (navigation with auth, page layout)
- **features/** — domain UI (WishlistCard, CommentSection)
- **app/pages/** — route composition only

## Checklist for new components

- [ ] Trio files: `.component.tsx`, `.html.tsx`, `.module.css`
- [ ] Props in `interfaces/`
- [ ] CSS uses tokens only (run `bun run audit:colors`)
- [ ] CSS selectors are kebab-case; spacing/typography use tokens (run `bun run audit:css`)
- [ ] No deep nesting or descendant selectors in modules
- [ ] Exported from layer barrel (`shared/ui/index.ts` or feature `index.ts`)

## Enforcement

- `bun run audit:colors` — scans CSS/templates for hardcoded theme colors
- `bun run audit:css` — scans CSS modules for raw px, deep nesting, descendant selectors
- `bun run lint` — ESLint with layer boundary rules for `shared/`
