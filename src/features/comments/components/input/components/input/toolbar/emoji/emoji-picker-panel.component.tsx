import React from 'react';
import EmojiPicker, { Categories, Theme } from 'emoji-picker-react';
import { EMOJI_CATEGORIES } from '../../../../../../constants/emoji-categories';
import type { EmojiPickerPanelProps } from './interfaces/emoji-picker-panel-props.interface';

export const EmojiPickerPanel: React.FC<EmojiPickerPanelProps> = ({
  activeCategory,
  searchQuery,
  effectiveTheme,
  onEmojiSelect,
}) => {
  const category = activeCategory as Categories;
  const currentCategories = searchQuery.trim()
    ? undefined
    : [
        {
          category,
          name: EMOJI_CATEGORIES.find((entry) => entry.id === activeCategory)?.name || '',
        },
      ];

  return (
    <EmojiPicker
      key={`${activeCategory}-${searchQuery ? 'search' : 'normal'}`}
      onEmojiClick={(emojiData) => onEmojiSelect(emojiData.emoji)}
      autoFocusSearch={false}
      theme={effectiveTheme as Theme}
      skinTonesDisabled
      previewConfig={{ showPreview: false }}
      categories={currentCategories}
    />
  );
};

export default EmojiPickerPanel;
