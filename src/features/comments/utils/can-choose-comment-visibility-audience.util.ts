import type { CanChooseCommentVisibilityAudienceInput } from '../interfaces/can-choose-comment-visibility-audience-input.interface';

export function canChooseCommentVisibilityAudience(
  input: CanChooseCommentVisibilityAudienceInput
): boolean {
  const { participants, currentUserId, isOwner } = input;

  if (!isOwner) {
    return true;
  }

  const otherCount = participants.filter(
    (participant) => participant.userId !== currentUserId
  ).length;

  return otherCount > 1;
}
