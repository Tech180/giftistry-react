# Guest invite WebSocket contract

Server implementation lives in `giftistry-bun` (`/ws/invite/:token`). This document is the client contract for guest wishlist preview live updates.

## Endpoint

```
wss://{api-host}/ws/invite/{token}
```

- No JWT query param — the invite token is the capability.
- Open (non-password) links: server subscribes the socket to `guest-list:{listId}` immediately after validating the token.
- Password-protected links: client must send an auth frame before receiving list events.

## Client → server

| Frame | When |
|-------|------|
| `{ "Type": "auth", "Password": "<plain>" }` | Once after `open` for password-protected invites |

## Server → client

| Frame | Meaning |
|-------|---------|
| `{ "Type": "auth.ok" }` | Password accepted; socket subscribed |
| `{ "Type": "auth.failed" }` | Wrong password; socket closes |
| `{ "Type": "list.changed", "Reason": "...", "ItemId"?: "...", "ActorUserId"?: "..." }` | Same shape as authenticated wishlist WS — reload preview via HTTP |
| `{ "Type": "invite.revoked" }` | Link revoked; stop reconnecting and show error |

## Client behavior (giftistry-react)

1. Connect only when preview response has `SupportsGuestRealtime: true`.
2. On `list.changed`, debounce (~300ms) then `GET`/`POST` `/api/invites/link/:token/preview`.
3. Keep visibility-aware HTTP polling as a fallback even when the socket is connected.
4. Password is held in memory for WS auth + silent POST refresh — never `localStorage`.

## Out of scope

- Guest comment/presence/typing (still JWT wishlist WS only)
- Job progress on the guest surface
