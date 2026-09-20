# `features/wishlists`

Wishlist domain: cards, create form, share management/panels, session.

## Public surface (`features/wishlists`)

- **Components:** `WishlistCard`, `CreateListForm`, `ShareManagement`, `ShareFabPanel`, `SharePanel`
- **API/hooks/providers:** `wishlistsApi`, `useWishlistController`, `WishlistSessionProvider`, `useWishlistSession`
- **Utils:** expiry/archive/lock helpers, guest preview helpers, date converters
- **Types:** `Wishlist`, shares, public link preview, invites

## Hotspots

| Area | Role |
|------|------|
| `components/card/` | Dashboard/list card (+ shares sidebar) |
| `components/create-form/` | New list form |
| `components/share/` | Share panel, FAB panel, friends/link management |

Item grids and drawers on the detail page compose **items** + page chrome — see [wishlist-detail](../../app/pages/wishlist-detail/README.md).

## Related

- [↑ features](../README.md)  
- [items](../items/README.md)
