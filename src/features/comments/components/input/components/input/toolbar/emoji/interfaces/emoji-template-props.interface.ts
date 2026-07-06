import React from 'react';
import { Categories } from 'emoji-picker-react';

export interface EmojiTemplateProps {
  isOpen: boolean;
  onToggle: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  activeCategory: Categories;
  setActiveCategory: (cat: Categories) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  effectiveTheme: string;
  onEmojiSelect: (emoji: string) => void;
}
