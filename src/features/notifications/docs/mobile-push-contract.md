# Mobile push contract (native iOS / Android)

Foreground and background delivery for Giftistry native apps. Server implementation lives in `giftistry-bun`; this document is the client contract.

## Foreground (both platforms)

1. After login, open `wss://{apiHost}/ws/user?token={jwt}`.
2. Handle JSON messages with `Type: "notification.received"` and a `Notification` object (`ReadAt` may be present; map to read state).
3. **Disconnect `/ws/user` when the app enters background** so the server will send push instead of skipping it (`isUserForegroundConnected`).

## Background — primary: ntfy

1. `GET /api/system/push-config/public` (auth) — check `NtfyEnabled` / `NtfyBaseUrl`.
2. `POST /api/notifications/push/register` with body:

```json
{
  "Giftistry": {
    "Push": {
      "Platform": "android" | "ios",
      "Transport": "ntfy"
    }
  }
}
```

3. Response includes `{ SubscriptionId, Topic, AccessToken }`. Subscribe to that topic on the ntfy client / UnifiedPush ntfy distributor.
4. On notification tap, open deep link from ntfy `Click` header when present.

## Background — Android fallback: WebPush (embedded FCM distributor)

1. If no standalone ntfy/UnifiedPush distributor is installed, initialize `org.unifiedpush.android:embedded-fcm-distributor`.
2. Obtain WebPush `endpoint`, `p256dh`, `auth`.
3. Register:

```json
{
  "Giftistry": {
    "Push": {
      "Platform": "android",
      "Transport": "webpush",
      "Endpoint": "<endpoint-url>",
      "Keys": { "P256dh": "...", "Auth": "..." }
    }
  }
}
```

4. Use VAPID public key from `GET /api/system/push-config/public` (`WebPushVapidPublicKey`).

## Background — iOS fallback: FCM

1. If ntfy path unavailable, register for remote notifications via Firebase SDK.
2. Register:

```json
{
  "Giftistry": {
    "Push": {
      "Platform": "ios",
      "Transport": "fcm",
      "Endpoint": "<fcm-device-token>"
    }
  }
}
```

## User preference

`PushAlerts` in `/api/notifications/preferences` must be true for any background push. Category prefs (`FriendRequests`, etc.) gate whether a notification is created at all.

## Logout

`DELETE /api/notifications/push/register/:id` for each subscription on the device (or list via `GET /api/notifications/push/subscriptions` first).

## Delivery rules (server)

| App state | In-app WS | Push (ntfy/webpush/fcm) |
|-----------|-----------|-------------------------|
| `/ws/user` connected | Yes | No |
| Background / closed | N/A | Yes (if prefs + transport enabled) |
