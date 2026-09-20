import React, { useState } from 'react';
import { resolveAppearance } from 'core/theme/resolve-appearance.util';
import { DEFAULT_EMOJI_CATEGORY } from '../../../../../constants/emoji-categories';
import type { EmojiCategoryId } from '../../../../../interfaces/emoji-category-id.type';
import { EmojiProps } from './interfaces/emoji-props.interface';
import { EmojiTemplate } from './emoji.html';

function readDocumentAppearance(): 'light' | 'dark' {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.getAttribute('data-appearance') === 'dark'
    ? 'dark'
    : 'light';
}

export const EmojiPickerButton: React.FC<EmojiProps> = ({
  isOpen,
  onToggle,
  anchorRef,
  popoverRef,
  editorHandle,
  onEmojiSelect: onEmojiSelectProp,
  buttonClassName,
  appearance,
}) => {
  const effectiveTheme = appearance
    ? resolveAppearance(appearance)
    : readDocumentAppearance();

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
