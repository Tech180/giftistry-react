import {
  AUTH_CHROME_PATHS,
  GUEST_CHROME_PREFIXES,
} from '../constants/auth-chrome-paths.constant';

/**
 * Whether AppShell should use auth-style chrome (skip nav/banner, auth-main).
 * True for dedicated auth paths, and for any logged-out path outside guest-chrome prefixes.
 */
export function shouldUseAuthChrome(
  pathname: string,
  isAuthenticated: boolean
): boolean {
  if ((AUTH_CHROME_PATHS as readonly string[]).includes(pathname)) {
    return true;
  }

  if (isAuthenticated) {
    return false;
  }

  return !GUEST_CHROME_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
