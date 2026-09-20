# `shared/`

Cross-cutting primitives and helpers. No domain UI.

## Allowed / forbidden

- **May import:** `core`, `shared`
- **Must not import:** `features/`, `app/`
- If something needs a domain type or feature hook, move it to that feature or inject from above

## Children

| Path | Role |
|------|------|
| [ui/](ui/README.md) | Shared UI primitives (SoC trios) |
| [utils/](utils/README.md) | Pure functions only |
| [constants/](constants/README.md) | Shared const tables |
| [interfaces/](interfaces/README.md) | Shared TypeScript contracts |
| [providers/](providers/README.md) | Toast, user socket, etc. |
| `hooks/` | Shared hooks (non-domain) |

## Related

- [↑ src](../README.md)  
- [docs/architecture.md](../../docs/architecture.md)  
- [docs/ui-conventions.md](../../docs/ui-conventions.md)
