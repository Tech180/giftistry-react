/**
 * Message for Content Suspense while a lazy route chunk loads.
 */
export function chunkLoadingMessage(pathname: string): string {
  if (pathname.includes('/wishlists/')) {
    return 'Loading list...';
  }

  if (pathname.startsWith('/invite/list/')) {
    return 'Checking invite link...';
  }

  if (pathname.startsWith('/users/')) {
    return 'Loading profile...';
  }

  return 'Loading...';
}
