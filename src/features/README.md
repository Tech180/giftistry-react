# `features/`

Domain packages. Each folder is a feature with a public barrel (`index.ts`).

## Allowed / forbidden

- **May import:** `core`, `shared`, other **feature barrels**
- **Must not import:** `app/`
- Prefer `import { X } from 'features/auth'` over deep internal paths (outside this feature)

## Domains

| Domain | README |
|--------|--------|
| [admin](admin/README.md) | Users, moderation, audit, site policy |
| [auth](auth/README.md) | Login, session, profile, preview card |
| [comments](comments/README.md) | Comment section + session |
| [friends](friends/README.md) | Friends, requests, picker, search |
| [items](items/README.md) | Items, claims, import, views, mini-drawer |
| [jobs](jobs/README.md) | Background jobs / timeline |
| [notifications](notifications/README.md) | Bell, push, job toasts |
| [system](system/README.md) | System settings, AI, metadata packs |
| [wishlists](wishlists/README.md) | Lists, create form, share |

## Related

- [↑ src](../README.md)  
- [docs/architecture.md](../../docs/architecture.md)
