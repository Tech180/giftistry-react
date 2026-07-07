import React from 'react';
import { EmojiPickerButton } from '../../../input/components/input/toolbar/emoji';
import { ReactionPickerTemplateProps } from './interfaces/reaction-picker-template-props.interface';
import styles from './reaction-picker.module.css';

export const ReactionPickerTemplate: React.FC<ReactionPickerTemplateProps> = ({
  showEmojiPicker,
  toggleEmoji,
  emojiAnchorRef,
  emojiPopoverRef,
  onEmojiSelect,
}) => {
  return (
    <div className={styles['reaction-picker-wrapper']}>
      <EmojiPickerButton
        isOpen={showEmojiPicker}
        onToggle={toggleEmoji}
        anchorRef={emojiAnchorRef}
        popoverRef={emojiPopoverRef}
        onEmojiSelect={onEmojiSelect}
      />
    </div>
  );
};
