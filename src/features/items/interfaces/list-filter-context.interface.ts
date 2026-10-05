export interface ListFilterContext {
  allowGroupFunds: boolean;
  revealSuggestions: boolean;
  currentUserId: string | null;
  listOwnerUserId: string | null;
  isOwner: boolean;
  canCollaborate: boolean;
  isPublicGuest: boolean;
}
