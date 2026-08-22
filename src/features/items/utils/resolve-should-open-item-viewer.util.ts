export function resolveShouldOpenItemViewer(input: {
  isOwner: boolean;
  canCollaborate: boolean;
  isPublicGuest?: boolean;
}): boolean {
  if (input.isPublicGuest) {
    return true;
  }
  return !input.isOwner && !input.canCollaborate;
}
