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

export function formatCommentDateBadge(dateStr?: string): { date: string; time: string } {
  if (!dateStr) return { date: '', time: '' };
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return { date: '', time: '' };

  return {
    date: date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }),
  };
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

export function getOnlineStatus(lastOnlineStr?: string | null): { isOnline: boolean; statusText: string } {
  if (!lastOnlineStr) {
    return { isOnline: false, statusText: 'Offline' };
  }
  const date = new Date(lastOnlineStr);
  if (isNaN(date.getTime())) {
    return { isOnline: false, statusText: 'Offline' };
  }
  
  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 5) {
    return { isOnline: true, statusText: 'Online' };
  }
  
  if (diffMins < 60) {
    return { isOnline: false, statusText: `${diffMins}m ago` };
  }
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return { isOnline: false, statusText: `${diffHours}h ago` };
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return { isOnline: false, statusText: `${diffDays}d ago` };
  }
  
  return {
    isOnline: false,
    statusText: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  };
}

