import React from 'react';
import { Comment } from './comment.interface';
import { Item } from 'features/items';
import { OnlineUser } from './online-user.interface';
import { ListParticipant } from './list-participant.interface';
import { CommentContentSegment } from '../utils/comment-content.util';

export interface CommentSectionTemplateProps {
  isOwner: boolean;
  listOwnerId?: string;
  isAuthenticated: boolean;
  canPostComments: boolean;
  currentUserId: string | undefined;
  participants: ListParticipant[];
  comments: Comment[];
  isLoading: boolean;
  displayError: string | null;

  // Form state
  content: string;
  setContent: (val: string) => void;
  commenterName: string;
  setCommenterName: (val: string) => void;
  isOwnerVisible: boolean;
  setIsOwnerVisible: (val: boolean) => void;
  isRollover: boolean;
  setIsRollover: (val: boolean) => void;
  isSubmitLoading: boolean;
  handleSubmit: (e: React.SyntheticEvent) => void;
  formatDate: (dateStr?: string) => string;

  // Phase 5 additions
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
    replyIsOwnerVisible?: boolean,
    replyIsRollover?: boolean,
    replyImageUrl?: string | null
  ) => Promise<void>;
  toggleReaction: (commentId: string, reaction: string) => void;
  activeReplyId: string | null;
  onReplyOpen: (commentId: string | null) => void;
  isReplyTaggingModeActive: boolean;
  setIsReplyTaggingModeActive: (active: boolean) => void;
  replyTaggedItemIds: string[];
  setReplyTaggedItemIds: (ids: string[]) => void;
  listContainerRef: React.RefObject<HTMLDivElement | null>;
}
