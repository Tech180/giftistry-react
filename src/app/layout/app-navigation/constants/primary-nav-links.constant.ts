export type PrimaryNavLinkId = 'dashboard' | 'friends';

export interface PrimaryNavLinkDef {
  id: PrimaryNavLinkId;
  label: string;
  path: string;
  matchActive: (pathname: string) => boolean;
}

export const PRIMARY_NAV_LINKS: readonly PrimaryNavLinkDef[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    matchActive: (pathname) => pathname === '/dashboard',
  },
  {
    id: 'friends',
    label: 'Friends',
    path: '/friends/current',
    matchActive: (pathname) => pathname.startsWith('/friends'),
  },
] as const;

export function isPrimaryNavLinkActive(id: PrimaryNavLinkId, pathname: string): boolean {
  const link = PRIMARY_NAV_LINKS.find((entry) => entry.id === id);
  return link ? link.matchActive(pathname) : false;
}
