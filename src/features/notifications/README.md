# `features/notifications`

In-app notifications, preferences, push registration, and job toasts.

## Public surface (`features/notifications`)

- **Components:** `NotificationBell`, `JobNotificationToastHost`
- **API/hooks/providers:** `notificationsApi`, `useNotifications`, `useNotificationPreferences`, `useJobNotificationToast`, `NotificationsProvider`
- **Utils:** map/claim/mark notification helpers
- **Types:** notification + push subscription types

## Extra docs

- [Mobile push contract](./docs/mobile-push-contract.md) — push transport expectations

## Related

- [↑ features](../README.md)  
- [jobs](../jobs/README.md)
