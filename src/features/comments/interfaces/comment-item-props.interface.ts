import { Comment } from './comment.interface';
import { Item } from 'features/items';
import { OnlineUser } from './online-user.interface';
import { ListParticipant } from './list-participant.interface';
import type { CommentVisibilityState } from './comment-visibility-state.interface';

export interface CommentItemProps {
  comment: Comment;
  listOwnerId?: string;
  currentUserId: string | null | undefined;
  items: Item[];
  formatDate: (dateStr?: string) => string;
  onItemTaggedClick?: (itemId: string) => void;
  handleDeleteComment: (commentId: string) => void;
  deletingCommentId?: string | null;
  setDeletingCommentId: (commentId: string | null) => void;
  onlineUsers?: OnlineUser[];
  participants?: ListParticipant[];
  replies?: Comment[];
  toggleReaction?: (commentId: string, reaction: string) => void;
  handleReplySubmit?: (
    parentId: string,
    replyContent: string,
    replyCommenterName?: string | null,
    replyVisibility?: CommentVisibilityState,
    replyIsRollover?: boolean,
    replyImageUrl?: string | null
  ) => Promise<void>;
  activeReplyId?: string | null;
  onReplyOpen?: (commentId: string | null) => void;
  isReplyTaggingModeActive?: boolean;
  setIsReplyTaggingModeActive?: (active: boolean) => void;
  replyTaggedItemIds?: string[];
  setReplyTaggedItemIds?: (ids: string[]) => void;
  isThreadChild?: boolean;
  isOwner?: boolean;
}
