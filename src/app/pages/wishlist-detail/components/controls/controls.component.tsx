import React, { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import {
  ITEM_VIEW_MODE_LABELS,
} from 'features/items/constants/item-view-mode.constants';
import { ITEM_VIEW_MODE_ICONS } from 'features/items/constants/item-view-mode-icons';
import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';
import { getSelectableViewModes } from 'features/items/utils/item-view-mode.util';
import type { Props } from './interfaces/props.interface';
import { ControlsTemplate } from './controls.html';

export const Controls: React.FC<Props> = ({
  viewMode,
  supportsKanbanViewMode = false,
  handleSetViewMode,
  searchQuery,
  setSearchQuery,
  addItemWidget,
}) => {
  const [isViewModeMenuOpen, setIsViewModeMenuOpen] = useState(false);

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
    <ControlsTemplate
      viewModeOptions = {
        viewModeOptions
      }
      activeViewIcon = {
        activeViewIcon
      }
      activeViewLabel = {
        activeViewLabel
      }
      searchQuery = {
        searchQuery
      }
      onSearchQueryChange = {
        setSearchQuery
      }
      onSelectViewMode = {
        onSelectViewMode
      }
      isViewModeMenuOpen = {
        isViewModeMenuOpen
      }
      onViewModeMenuOpenChange = {
        setIsViewModeMenuOpen
      }
      addItemWidget = {
        addItemWidget
      }
    />
  );
};
