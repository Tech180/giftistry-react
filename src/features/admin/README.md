# `features/admin`

Admin APIs and hooks for users, moderation, audit log, and site policy.

## Public surface (`features/admin`)

- **API:** `adminApi`, `getAuditActionClass`
- **Hooks:** `useOverview`, `useUsers`, `useUserDetail`, `useSitePolicy`, `useModeration`, `useAuditLog`
- **Constants:** registration mode labels/options, `DEFAULT_USER_POLICY`
- **Types:** users, audit, moderation, site/registration policy types

## Layout

`api/`, `hooks/`, `interfaces/`, `constants/`, `utils/` — no large UI tree; settings pages compose these hooks.

## Don't put here

Route chrome or settings page markup → `app/pages/settings`. Shared buttons → `shared/ui`.

## Related

- [↑ features](../README.md)
