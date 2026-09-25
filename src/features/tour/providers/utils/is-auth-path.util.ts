const AUTH_PATHS = new Set(['/login', '/register', '/welcome', '/change-password']);

export function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.has(pathname);
}
