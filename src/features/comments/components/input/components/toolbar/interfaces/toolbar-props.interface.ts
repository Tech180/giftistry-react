import React from 'react';
import type { CommentEditorHandle } from '../../editor';

export interface ToolbarProps {
  editorHandle: React.RefObject<CommentEditorHandle | null>;
  content: string;
  imageUrl?: string | null;
  isSubmitLoading: boolean;
  setImageUrl?: (url: string | null) => void;
  onUploadError: (message: string | null) => void;
}
