import { Navigate, useLocation } from 'react-router-dom';

/** Maps old `/profile` URLs to `/settings` (e.g. `/profile/security` → `/settings/security`). */
export function legacyProfilePath(pathname: string): string {
  if (pathname === '/profile' || pathname === '/profile/') {
    return '/settings/account';
  }
  if (pathname === '/profile/account' || pathname === '/profile/account/') {
    return '/settings/account';
  }
  if (pathname.startsWith('/profile/settings')) {
    const suffix = pathname.slice('/profile/settings'.length);
    return suffix ? `/settings${suffix}` : '/settings/account';
  }
  if (pathname === '/profile/server' || pathname === '/settings/server') {
    return '/settings/admin/server';
  }
  if (pathname.startsWith('/profile/')) {
    return `/settings${pathname.slice('/profile'.length)}`;
  }
  return '/settings/account';
}

export function LegacyProfileRedirect() {
  const location = useLocation();
  const target = legacyProfilePath(location.pathname);

  return (
    <Navigate
      to={{ pathname: target, search: location.search, hash: location.hash }}
      replace
    />
  );
}
