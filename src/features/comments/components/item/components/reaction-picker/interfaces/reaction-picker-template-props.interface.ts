import React from 'react';

export interface ReactionPickerTemplateProps {
  showEmojiPicker: boolean;
  toggleEmoji: () => void;
  emojiAnchorRef: React.RefObject<HTMLDivElement | null>;
  emojiPopoverRef: React.RefObject<HTMLDivElement | null>;
  onEmojiSelect: (emoji: string) => void;
}
