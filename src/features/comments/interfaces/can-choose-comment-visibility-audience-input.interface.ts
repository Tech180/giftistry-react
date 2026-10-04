import type { ListParticipant } from './list-participant.interface';

export interface CanChooseCommentVisibilityAudienceInput {
  participants: ListParticipant[];
  currentUserId?: string;
  isOwner: boolean;
}
