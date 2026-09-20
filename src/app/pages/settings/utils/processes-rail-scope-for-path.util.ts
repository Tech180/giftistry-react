import type { BackgroundJobsScope } from 'features/jobs';

export function processesRailScopeForPath(pathname: string): BackgroundJobsScope | null {
  if (pathname === '/settings/account' || pathname === '/settings/account/') {
    return 'mine';
  }
  if (pathname === '/settings/admin' || pathname === '/settings/admin/') {
    return 'admin';
  }
  return null;
}
