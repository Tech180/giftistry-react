# `features/items`

Items, claims, import, card/views, audience, and item-linked UI.

## Public surface (`features/items`)

- **Components:** `ItemCard`, `AddItemForm`, `ItemShowcase`, `LinkedItemSquares`, `MiniDrawer`, `AudiencePicker`, galleries/skeletons, import strip/dropzone/menu, view routers (`ItemCardRouter`, `CompactCategoryList`, …)
- **API/hooks/providers:** `itemsApi`, `useItemController`, `ItemsSessionProvider`, `useItemsSession`
- **Utils:** category/meta helpers, view-mode helpers, claim/quantity helpers
- **Types:** item/claim/photo/audience/view-mode types

## Hotspots

| Area | Role |
|------|------|
| `components/form/` | Add/edit item form (large SoC tree) |
| `components/views/` | Compact / feed / detailed presentations |
| `components/mini-drawer/` | Mobile/inline linked-item drawer (owns `Item` + `LinkedSquares`) |
| `components/linked-squares/` | Linked item squares (domain composite; not `shared/ui`) |
| `components/import/` | Import strip / AI / dropzone flows |
| `components/item-presentation/` | Shared presentation pieces (badges, claim form, etc.) |

Prefer barrel imports from `features/items` for public symbols.

## Don't put here

Wishlist create/share UI → `features/wishlists`. Drawer **shell** → `shared/ui/drawer` (mini content stays here).

## Related

- [↑ features](../README.md)  
- [app/pages/wishlist-detail](../../app/pages/wishlist-detail/README.md)
