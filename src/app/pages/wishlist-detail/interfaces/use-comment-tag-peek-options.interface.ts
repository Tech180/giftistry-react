export interface UseCommentTagPeekOptions {
  isCommentsOpen: boolean;
  setIsCommentsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isTaggingModeActive: boolean;
  isReplyTaggingModeActive: boolean;
}
