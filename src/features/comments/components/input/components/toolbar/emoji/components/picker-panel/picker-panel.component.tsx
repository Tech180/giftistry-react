import React, { useMemo } from 'react';
import { Categories, Theme } from 'emoji-picker-react';
import { EMOJI_CATEGORIES } from '../../../../../../../constants/emoji-categories';
import type { Props } from './interfaces/props.interface';
import { PickerPanelTemplate } from './picker-panel.html';

export const PickerPanel: React.FC<Props> = ({
  activeCategory,
  searchQuery,
  effectiveTheme,
  onEmojiSelect,
}) => {
  const pickerKey = `${activeCategory}-${searchQuery.trim() ? 'search' : 'normal'}`;

  const currentCategories = useMemo(() => {
    if (searchQuery.trim()) {
      return undefined;
    }
    const category = activeCategory as Categories;
    const name = EMOJI_CATEGORIES.find((entry) => entry.id === activeCategory)?.name ?? '';
    return [{ category, name }];
  }, [activeCategory, searchQuery]);

  return (
    <PickerPanelTemplate
      pickerKey={pickerKey}
      effectiveTheme={effectiveTheme as Theme}
      currentCategories={currentCategories}
      onEmojiSelect={onEmojiSelect}
    />
  );
};
