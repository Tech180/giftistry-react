import React from 'react';
import type { CommentEditorHandle } from '../../../editor';

export interface EmojiProps {
  isOpen: boolean;
  onToggle: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  editorHandle?: React.RefObject<CommentEditorHandle | null>;
  onEmojiSelect?: (emoji: string) => void;
}
