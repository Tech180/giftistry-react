/** Exact paths that always use auth-style chrome (no nav/banner). */
export const AUTH_CHROME_PATHS = [
  '/login',
  '/register',
  '/welcome',
  '/change-password',
] as const;

/**
 * Path prefixes that keep guest nav/banner when logged out
 * (invite accept and similar token surfaces).
 */
export const GUEST_CHROME_PREFIXES = ['/invite/list/'] as const;
