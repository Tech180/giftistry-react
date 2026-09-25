import React from 'react';
import { Item } from 'features/items';
import { Comment } from '../../../interfaces/comment.interface';
import { OnlineUser } from '../../../interfaces/online-user.interface';
import { ListParticipant } from '../../../interfaces/list-participant.interface';
import type { CommentVisibilityState } from '../../../interfaces/comment-visibility-state.interface';

export interface TemplateProps {
  isOwner: boolean;
  listOwnerId?: string;
  isAuthenticated: boolean;
  canPostComments: boolean;
  currentUserId: string | undefined;
  participants: ListParticipant[];
  comments: Comment[];
  isLoading: boolean;
  displayError: string | null;

  content: string;
  setContent: (val: string) => void;
  commenterName: string;
  setCommenterName: (val: string) => void;
  commentVisibility: CommentVisibilityState;
  setCommentVisibility: (val: CommentVisibilityState) => void;
  isRollover: boolean;
  setIsRollover: (val: boolean) => void;
  autoRollover?: boolean;
  isSubmitLoading: boolean;
  handleSubmit: (e: React.SyntheticEvent) => void;
  formatDate: (dateStr?: string) => string;

  items: Item[];
  onlineUsers: OnlineUser[];
  typingUsers: string[];
  onItemTaggedClick?: (itemId: string) => void;
  handleSelectTagItem: (itemId: string, itemName: string) => void;
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (val: boolean) => void;
  taggedItemIds: string[];
  setTaggedItemIds: (ids: string[]) => void;
  handleDeleteComment: (commentId: string) => void;
  deletingCommentId: string | null;
  setDeletingCommentId: (id: string | null) => void;
  isAnonymous: boolean;
  setIsAnonymous: (anon: boolean) => void;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  parentComments: Comment[];
  repliesMap: Record<string, Comment[]>;
  handleReplySubmit: (
    parentId: string,
    replyContent: string,
    replyCommenterName?: string | null,
    replyVisibility?: CommentVisibilityState,
    replyIsRollover?: boolean,
    replyImageUrl?: string | null
  ) => Promise<void>;
  toggleReaction: (commentId: string, reaction: string) => void;
  onMentionSelect?: (userId: string) => void;
  activeReplyId: string | null;
  onReplyOpen: (commentId: string | null) => void;
  isReplyTaggingModeActive: boolean;
  setIsReplyTaggingModeActive: (active: boolean) => void;
  replyTaggedItemIds: string[];
  setReplyTaggedItemIds: (ids: string[]) => void;
  listContainerRef: React.RefObject<HTMLDivElement | null>;
  highlightedCommentId?: string | null;
}
