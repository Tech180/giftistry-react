# `pages/wishlist-detail`

Single-wishlist screen: header, items, drawers (add item, comments), settings panel, mobile actions, share.

## Composition

- **Wishlists:** session, share, list metadata  
- **Items:** cards, forms, mini-drawer, import  
- **Comments:** comment section  
- **Jobs / notifications:** progress and toasts as needed  

Page owns route chrome and association rails; domain packages own reusable composites.

## Naming

Entry `wishlist-detail` page component; prefer short nested names (`header/`, `items/`, `drawer/`, …) and `page.*` for shell markup/styles when present.

## Related

- [↑ pages](../README.md)  
- [features/wishlists](../../../features/wishlists/README.md)  
- [features/items](../../../features/items/README.md)  
- [features/comments](../../../features/comments/README.md)
