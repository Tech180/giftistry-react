# `features/auth`

Authentication, session, profile UI, and user preview card.

## Public surface (`features/auth`)

- **Components:** `LoginForm`, `RegisterForm`, `ChangePasswordForm`, `ProfileCard`, `InactivityModal`, `UserPreviewCard`
- **API/utils:** `authApi`, initials/date helpers, `postAuthPath`, `isSessionUnauthorized`
- **Providers/hooks:** `AuthProvider`, `useAuth`, `useSecuritySettings`
- **Types:** `User`, `ApiUser`, `AuthResponse`, passkey types, etc.

## Notes

- `UserPreviewCard` lives here (domain composite), not in `shared/ui`.
- Prefer barrel imports: `import { UserPreviewCard } from 'features/auth'`.

## Related

- [↑ features](../README.md)
