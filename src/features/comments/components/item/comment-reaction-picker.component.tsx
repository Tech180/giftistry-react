import React from 'react';
import { EmojiPickerButton } from '../input/components/input/toolbar/emoji';
import { useToolbarPickers } from '../input/components/input/toolbar/use-toolbar-pickers';

export interface CommentReactionPickerProps {
  onSelect: (emoji: string) => void;
}

export const CommentReactionPicker: React.FC<CommentReactionPickerProps> = ({ onSelect }) => {
  const {
    showEmojiPicker,
    emojiAnchorRef,
    emojiPopoverRef,
    toggleEmoji,
    closePickers,
  } = useToolbarPickers();

  return (
    <EmojiPickerButton
      isOpen={showEmojiPicker}
      onToggle={toggleEmoji}
      anchorRef={emojiAnchorRef}
      popoverRef={emojiPopoverRef}
      onEmojiSelect={(emoji) => {
        onSelect(emoji);
        closePickers();
      }}
    />
  );
};
