import type { SyntheticEvent } from 'react';
import type { CommentVisibilityState } from '../../../interfaces/comment-visibility-state.interface';

export interface UseComposerResult {
  content: string;
  setContent: (val: string) => void;
  commenterName: string;
  setCommenterName: (val: string) => void;
  commentVisibility: CommentVisibilityState;
  setCommentVisibility: (val: CommentVisibilityState) => void;
  isRollover: boolean;
  setIsRollover: (val: boolean) => void;
  isSubmitLoading: boolean;
  displayError: string | null;
  isAnonymous: boolean;
  setIsAnonymous: (anon: boolean) => void;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  deletingCommentId: string | null;
  setDeletingCommentId: (id: string | null) => void;
  handleSubmit: (e: SyntheticEvent) => Promise<void>;
  handleReplySubmit: (
    parentId: string,
    replyContent: string,
    replyCommenterName?: string | null,
    replyVisibility?: CommentVisibilityState,
    replyIsRollover?: boolean,
    replyImageUrl?: string | null,
  ) => Promise<void>;
  handleToggleReaction: (commentId: string, reaction: string) => Promise<void>;
  handleDeleteComment: (commentId: string) => Promise<void>;
  handleSelectTagItem: (itemId: string, itemName: string) => void;
  handleMentionSelect: (userId: string) => void;
}
