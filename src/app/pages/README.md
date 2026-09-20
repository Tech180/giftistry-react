# `app/pages`

Route-level screens. Each domain folder owns one page entry and nested SoC units.

## Naming

- Entry: `<domain>.component.tsx` (e.g. `friends.component.tsx`)
- Shell markup/styles: `page.html.tsx` / `page.module.css` (not `friends-page.*`)
- Nested units: short local names (`header/`, `controls/`) — no redundant parent prefix

## Domains

| Page | README |
|------|--------|
| [change-password](change-password/README.md) | Change password flow |
| [dashboard](dashboard/README.md) | Home / wishlist grid |
| [friends](friends/README.md) | Friends page |
| [invite-accept](invite-accept/README.md) | Invite / guest accept |
| [login](login/README.md) | Login |
| [onboarding](onboarding/README.md) | First-run onboarding |
| [register](register/README.md) | Registration |
| [settings](settings/README.md) | Settings shell + sections |
| [setup](setup/README.md) | Install / setup wizard |
| [user-profile](user-profile/README.md) | Public/user profile |
| [wishlist-detail](wishlist-detail/README.md) | Single wishlist |

## Related

- [↑ app](../README.md)  
- [docs/architecture.md](../../../docs/architecture.md)
