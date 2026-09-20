import type { OnlineUser } from '../interfaces/online-user.interface';
import type { PresenceUserEntry } from '../interfaces/presence-user-entry.type';

export function parsePresenceUsers(raw: unknown): OnlineUser[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map((entry: PresenceUserEntry) => {
    if (typeof entry === 'string') {
      return { userId: entry, username: entry };
    }

    const userId = entry.UserId ?? '';
    const username = entry.Username ?? userId;
    return { userId, username };
  });
}
