import { getOnlineStatus } from './format-date.util';

export function resolveOnlineStatus(
  lastOnline?: string | null,
  isOnlineOverride?: boolean
) {
  return getOnlineStatus(
    lastOnline ?? (isOnlineOverride ? new Date().toISOString() : null)
  );
}
