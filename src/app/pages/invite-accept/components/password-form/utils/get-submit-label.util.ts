export function getSubmitLabel(isSubmitting: boolean, isAuthenticated: boolean): string {
  if (isSubmitting) return 'Opening...';
  if (isAuthenticated) return 'Accept Invite';
  return 'View Wishlist';
}
