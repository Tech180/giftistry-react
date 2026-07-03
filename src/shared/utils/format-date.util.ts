export function formatCommentDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatWishlistExpirationDate(dateStr: string | null): string {
  if (!dateStr) return 'No expiration date';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatWishlistCardDate(dateStr: string | null): string {
  if (!dateStr) return 'No expiration';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'No expiration';

  const formatted = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return date.getTime() < Date.now() ? `Expired (${formatted})` : `Expires ${formatted}`;
}
