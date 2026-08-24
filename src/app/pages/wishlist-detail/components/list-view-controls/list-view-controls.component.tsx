import React from 'react';
import { LayoutGrid } from 'lucide-react';
import {
  ITEM_VIEW_MODE_LABELS,
} from 'features/items/constants/item-view-mode.constants';
import { ITEM_VIEW_MODE_ICONS } from 'features/items/constants/item-view-mode-icons';
import type { ItemViewMode } from 'features/items/types/item-view-mode.type';
import { getSelectableViewModes } from 'features/items/utils/item-view-mode.util';
import { ListViewControlsProps } from './interfaces/list-view-controls-props.interface';
import { ListViewControlsTemplate } from './list-view-controls.html';

export const ListViewControls: React.FC<ListViewControlsProps> = ({
  viewMode,
  supportsKanbanViewMode = false,
  handleSetViewMode,
  searchQuery,
  setSearchQuery,
  addItemWidget,
}) => {
  const viewModeOptions = getSelectableViewModes(supportsKanbanViewMode).map((mode) => ({
    mode,
    Icon: ITEM_VIEW_MODE_ICONS[mode],
    label: ITEM_VIEW_MODE_LABELS[mode],
    isActive: mode === viewMode,
  }));

  const activeViewIcon = ITEM_VIEW_MODE_ICONS[viewMode] ?? LayoutGrid;
  const activeViewLabel = ITEM_VIEW_MODE_LABELS[viewMode];

  const onSelectViewMode = (mode: ItemViewMode, event?: React.MouseEvent<HTMLButtonElement>) => {
    handleSetViewMode(mode);
    const details = event?.currentTarget.closest('details');
    if (details) {
      details.open = false;
    }
  };

  return (
    <ListViewControlsTemplate
      viewModeOptions={viewModeOptions}
      activeViewIcon={activeViewIcon}
      activeViewLabel={activeViewLabel}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      onSelectViewMode={onSelectViewMode}
      addItemWidget={addItemWidget}
    />
  );
};
