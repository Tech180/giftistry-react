import type { ActionButtonsLayoutMode } from '../interfaces/action-buttons-template-props.interface';
import type { ActionButtonsVisibility } from '../interfaces/action-buttons-visibility.interface';

export function resolveActionButtonsLayoutMode({
  isOwner,
  canCollaborate,
  claimedByCurrentUser,
  isFullyClaimed,
  canAdjustClaim = false,
  isPublicGuest = false,
  canEditItem,
  isArchived = false,
  isExpired = false,
}: ActionButtonsVisibility): ActionButtonsLayoutMode | null {
  if (isArchived || isExpired || isPublicGuest) {
    return null;
  }

  // Only list owners get pure edit/delete; suggestors (canEditItem && !isOwner)
  // fall through so they can claim as well as edit.
  const isOwnerEdit = isOwner && (canEditItem ?? canCollaborate);
  if (isOwnerEdit) {
    return 'owner-edit';
  }
  if (isOwner) {
    return null;
  }
  if (claimedByCurrentUser && canAdjustClaim) {
    return 'update-claim';
  }
  if (claimedByCurrentUser) {
    return 'unclaim';
  }
  if (isFullyClaimed) {
    return 'claimed';
  }
  return 'claim';
}

export function shouldShowActionButtons(visibility: ActionButtonsVisibility): boolean {
  return resolveActionButtonsLayoutMode(visibility) != null;
}
