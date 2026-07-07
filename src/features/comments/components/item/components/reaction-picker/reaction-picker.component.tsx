import React from 'react';
import { useToolbarPickers } from '../../../input/components/input/toolbar/use-toolbar-pickers';
import { ReactionPickerProps } from './interfaces/reaction-picker-props.interface';
import { ReactionPickerTemplate } from './reaction-picker.html';

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect }) => {
  const {
    showEmojiPicker,
    emojiAnchorRef,
    emojiPopoverRef,
    toggleEmoji,
    closePickers,
  } = useToolbarPickers();

  return (
    <ReactionPickerTemplate
      showEmojiPicker={showEmojiPicker}
      toggleEmoji={toggleEmoji}
      emojiAnchorRef={emojiAnchorRef}
      emojiPopoverRef={emojiPopoverRef}
      onEmojiSelect={(emoji: string) => {
        onSelect(emoji);
        closePickers();
      }}
    />
  );
};
