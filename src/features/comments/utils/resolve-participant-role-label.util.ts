import type { ListParticipant } from '../interfaces/list-participant.interface';

export function resolveParticipantRoleLabel(participant: Pick<ListParticipant, 'userId' | 'role'>, listOwnerId?: string): string {
  if (participant.role) {
    return participant.role;
  }

  if (listOwnerId && participant.userId === listOwnerId) {
    return 'owner';
  }

  return 'member';
}
