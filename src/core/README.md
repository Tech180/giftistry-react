# `core/`

Non-UI infrastructure: HTTP client, env/config, theme catalog helpers.

## Allowed / forbidden

- **May import:** packages only (and other `core/` modules)
- **Must not import:** `app/`, `features/`, `shared/` UI
- No React components here

## Children

| Path | Role |
|------|------|
| [api/](api/README.md) | API client, envelopes, errors |
| [config/](config/README.md) | Env / runtime config |
| [theme/](theme/README.md) | Theme catalog, previews, CSS var helpers |

## Related

- [↑ src](../README.md)  
- [docs/architecture.md](../../docs/architecture.md)
