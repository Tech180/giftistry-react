import type { Categories, Theme } from 'emoji-picker-react';

export interface TemplateProps {
  pickerKey: string;
  effectiveTheme: Theme;
  currentCategories: { category: Categories; name: string }[] | undefined;
  onEmojiSelect: (emoji: string) => void;
}
