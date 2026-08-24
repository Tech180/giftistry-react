import React, { useState } from 'react';
import { useTheme } from 'app/providers/theme-context';
import { DEFAULT_EMOJI_CATEGORY } from '../../../../../../constants/emoji-categories';
import type { EmojiCategoryId } from '../../../../../../interfaces/emoji-category-id.type';
import { EmojiProps } from './interfaces/emoji-props.interface';
import { EmojiTemplate } from './emoji.html';

export const EmojiPickerButton: React.FC<EmojiProps> = ({
  isOpen,
  onToggle,
  anchorRef,
  popoverRef,
  editorHandle,
  onEmojiSelect: onEmojiSelectProp,
  buttonClassName,
}) => {
  const { appearance } = useTheme();
  const effectiveTheme = appearance === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : appearance === 'dark' ? 'dark' : 'light';

  const [activeCategory, setActiveCategory] = useState<EmojiCategoryId>(DEFAULT_EMOJI_CATEGORY);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEmojiSelect = (emoji: string) => {
    if (onEmojiSelectProp) {
      onEmojiSelectProp(emoji);
      return;
    }
    editorHandle?.current?.insertText(emoji);
    if (isOpen) onToggle();
  };

  return (
    <EmojiTemplate
      isOpen={isOpen}
      onToggle={onToggle}
      anchorRef={anchorRef}
      popoverRef={popoverRef}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      effectiveTheme={effectiveTheme}
      onEmojiSelect={handleEmojiSelect}
      buttonClassName={buttonClassName}
    />
  );
};
