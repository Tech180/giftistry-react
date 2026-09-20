import type { FormatRelativePastOptions } from 'shared/interfaces/format-relative-past-options.interface';

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

export function formatMonthDay(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatDateTime(value?: string | null, empty = '—'): string {
  const date = parseDate(value);
  return date ? date.toLocaleString() : empty;
}

export function formatBirthday(value?: string | null): string {
  if (!value) return '';

  const parts = value.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0]!, 10);
    const month = parseInt(parts[1]!, 10) - 1;
    const day = parseInt(parts[2]!, 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return formatMonthDay(new Date(year, month, day));
    }
  }

  const date = parseDate(value);
  return date ? formatMonthDay(date) : '';
}

export function formatRelativePast(
  value?: string | null,
  options: FormatRelativePastOptions = {}
): string {
  const {
    justNowUnderMinutes = 1,
    empty = '',
    olderStyle = 'monthDay',
  } = options;

  const date = parseDate(value);
  if (!date) return empty;

  const diffMins = Math.floor(Math.max(0, Date.now() - date.getTime()) / 60000);

  if (justNowUnderMinutes > 0 && diffMins < justNowUnderMinutes) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${Math.max(diffMins, 1)}m ago`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return olderStyle === 'localeDate' ? date.toLocaleDateString() : formatMonthDay(date);
}

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
  const date = parseDate(lastOnlineStr);
  if (!date) {
    return { isOnline: false, statusText: 'Offline' };
  }

  const diffMins = Math.floor(Math.max(0, Date.now() - date.getTime()) / 60000);
  if (diffMins < 5) {
    return { isOnline: true, statusText: 'Online' };
  }

  return {
    isOnline: false,
    statusText: formatRelativePast(lastOnlineStr, {
      justNowUnderMinutes: 0,
      olderStyle: 'monthDay',
      empty: 'Offline',
    }),
  };
}
