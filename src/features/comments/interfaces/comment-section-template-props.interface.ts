import React from 'react';
import { Comment } from './comment.interface';
import { Item } from 'features/items';

export interface CommentSectionTemplateProps {
  isOwner: boolean;
  currentUserId: string | undefined;
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
  onlineUsers: string[];
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
}
