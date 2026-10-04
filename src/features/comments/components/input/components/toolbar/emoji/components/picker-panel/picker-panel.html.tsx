import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './picker-panel.module.css';

export const PickerPanelTemplate: React.FC<TemplateProps> = ({
  pickerKey,
  effectiveTheme,
  currentCategories,
  onEmojiSelect,
}) => (
  <div className={styles.root}>
    <EmojiPicker
      key={pickerKey}
      onEmojiClick={(emojiData) => onEmojiSelect(emojiData.emoji)}
      autoFocusSearch={false}
      theme={effectiveTheme}
      skinTonesDisabled
      previewConfig={{ showPreview: false }}
      categories={currentCategories}
    />
  </div>
);
