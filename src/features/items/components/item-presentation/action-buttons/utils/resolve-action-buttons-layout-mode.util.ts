import type { ActionButtonsLayoutMode } from '../interfaces/action-buttons-template-props.interface';
import type { ActionButtonsVisibility } from '../interfaces/action-buttons-visibility.interface';

export function resolveActionButtonsLayoutMode({
  canCollaborate,
  claimedByCurrentUser,
  isFullyClaimed,
  isClaimUnavailable = false,
  canAdjustClaim = false,
  isPublicGuest = false,
  canEditItem,
  isArchived = false,
  isExpired = false,
}: ActionButtonsVisibility): ActionButtonsLayoutMode | null {
  if (isArchived || isExpired || isPublicGuest) {
    return null;
  }

  // Collaborators (and owners) get pure edit/delete with no claim chrome.
  // Suggestors (canEditItem && !canCollaborate) fall through so they can claim as well as edit.
  const isCollaboratorEdit = canCollaborate && (canEditItem ?? true);
  if (isCollaboratorEdit) {
    return 'owner-edit';
  }
  if (canCollaborate) {
    return null;
  }
  if (claimedByCurrentUser && canAdjustClaim) {
    return 'update-claim';
  }
  if (claimedByCurrentUser) {
    return 'unclaim';
  }
  if (isClaimUnavailable) {
    return 'unavailable';
  }
  if (isFullyClaimed) {
    return 'claimed';
  }
  return 'claim';
}

export function shouldShowActionButtons(visibility: ActionButtonsVisibility): boolean {
  return resolveActionButtonsLayoutMode(visibility) != null;
}
