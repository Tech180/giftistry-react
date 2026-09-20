# `app/`

Application shell: bootstrap, routes, layout, pages, and app-scoped providers.

## Allowed / forbidden

- **May import:** `core`, `shared`, `features`
- **Owns:** route composition, page folders, chrome (nav/shell), app providers
- **Does not own:** reusable primitives (→ `shared/ui`) or domain logic packages (→ `features/`)

## Key children

| Path | Role |
|------|------|
| [pages/](pages/README.md) | Route screens |
| [layout/](layout/README.md) | App shell / navigation |
| [providers/](providers/README.md) | Theme, mobile actions, etc. |
| `components/` | App-level chrome pieces (loading, error boundary, setup) |
| `bootstrap/`, `routes/` | Startup and route wiring |

## Related

- [↑ src](../README.md)  
- [docs/architecture.md](../../docs/architecture.md)
