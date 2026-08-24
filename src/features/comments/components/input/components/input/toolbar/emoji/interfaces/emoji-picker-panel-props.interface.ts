import type { EmojiCategoryId } from '../../../../../../../interfaces/emoji-category-id.type';

export interface EmojiPickerPanelProps {
  activeCategory: EmojiCategoryId;
  searchQuery: string;
  effectiveTheme: string;
  onEmojiSelect: (emoji: string) => void;
}
