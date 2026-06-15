import React from 'react';
import { Comment } from './comment.interface';

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
  handleSubmit: (e: React.FormEvent) => void;
  formatDate: (dateStr?: string) => string;
}
