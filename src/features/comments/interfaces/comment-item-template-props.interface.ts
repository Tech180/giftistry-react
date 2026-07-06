import React from 'react';
import { Comment } from './comment.interface';
import { Item } from 'features/items';
import { OnlineUser } from './online-user.interface';
import { CommentContentSegment } from '../utils/comment-content.util';
import { CommentReactionGroup } from './comment-reaction-group.interface';

export interface CommentItemTemplateProps {
  comment: Comment;
  contentSegments: CommentContentSegment[];
  taggedIds: string[];
  isDeleting: boolean;
  currentUserId: string | null | undefined;
  items: Item[];
  formatDate: (dateStr?: string) => string;
  onItemTaggedClick?: (itemId: string) => void;
  handleDeleteComment: (commentId: string) => void;
  setDeletingCommentId: (commentId: string | null) => void;
  onlineUsers: OnlineUser[];
  replies: Comment[];
  toggleReaction?: (commentId: string, reaction: string) => void;
  handleReplySubmit?: (
    parentId: string,
    replyContent: string,
    replyCommenterName?: string | null,
    replyIsOwnerVisible?: boolean,
    replyIsRollover?: boolean,
    replyImageUrl?: string | null
  ) => Promise<void>;
  isAnonymousComment: boolean;
  isOnline: boolean;
  isListOwnerComment: boolean;
  reactionsMap: Record<string, CommentReactionGroup>;
  isReplying: boolean;
  onReplyToggle: () => void;
  replyInput: React.ReactNode;
  replySlotRef: React.RefObject<HTMLDivElement | null>;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  reactionPicker: React.ReactNode;
  nestedReplies: React.ReactNode;
  isThreadChild?: boolean;
}
