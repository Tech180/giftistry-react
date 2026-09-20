export interface UseCommentTagPeekResult {
  isHighlightInteractionLocked: boolean;
  handleItemTaggedClick: (itemId: string, returnToItemId?: string) => void;
}
