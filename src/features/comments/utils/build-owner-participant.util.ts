import type { ListParticipant } from '../interfaces/list-participant.interface';

export function buildOwnerParticipant(
  listOwnerId: string,
  ownerUsername: string,
  ownerDisplayName: string | undefined,
  currentUserId: string | undefined,
  currentUserAvatar: string | null | undefined,
): ListParticipant {
  return {
    userId: listOwnerId,
    username: ownerUsername,
    displayName: ownerDisplayName || ownerUsername,
    avatar: listOwnerId === currentUserId ? currentUserAvatar ?? null : null,
    role: 'owner',
  };
}
