import type { ListParticipant } from '../interfaces/list-participant.interface';

export function mergeParticipantUpdates(
  prev: ListParticipant[],
  updates: ListParticipant[],
): ListParticipant[] {
  const map = new Map(prev.map((p) => [p.userId, p]));

  for (const update of updates) {
    const existing = map.get(update.userId);
    map.set(
      update.userId,
      existing
        ? {
            ...existing,
            username: update.username || existing.username,
            displayName: update.displayName || existing.displayName,
            avatar: update.avatar ?? existing.avatar ?? null,
          }
        : update,
    );
  }

  return Array.from(map.values());
}
