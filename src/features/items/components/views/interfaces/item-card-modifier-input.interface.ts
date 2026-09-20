export interface ItemCardModifierInput {
  isPrivate: boolean;
  isFullyClaimed: boolean;
  claimedByCurrentUser: boolean;
  isOwner: boolean;
  isSuggestion?: boolean;
  isTaggedSelection?: boolean;
  isSelected?: boolean;
}
