import React from 'react';
import type { EmojiCategoryId } from '../../../../../../../interfaces/emoji-category-id.type';

export interface EmojiTemplateProps {
  isOpen: boolean;
  onToggle: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  activeCategory: EmojiCategoryId;
  setActiveCategory: (cat: EmojiCategoryId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  effectiveTheme: string;
  onEmojiSelect: (emoji: string) => void;
  buttonClassName?: string;
}
