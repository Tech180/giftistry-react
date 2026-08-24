export function resolveShouldOpenItemViewer(input: {
  isOwner: boolean;
  canCollaborate: boolean;
  isPublicGuest?: boolean;
  isLocked?: boolean;
}): boolean {
  if (input.isPublicGuest || input.isLocked) {
    return true;
  }
  return !input.isOwner && !input.canCollaborate;
}
