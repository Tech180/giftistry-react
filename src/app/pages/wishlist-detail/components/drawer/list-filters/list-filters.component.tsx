import React, { useMemo } from 'react';
import type { Props } from './interfaces/props.interface';
import { ListFiltersTemplate } from './list-filters.html';
import { buildListFiltersViewModel } from './utils/build-list-filters-view-model.util';

export const ListFilters: React.FC<Props> = ({ listDisplay }) => {
  const handleClose = () => {
    listDisplay.revertDraft();
    listDisplay.closeDrawer();
  };

  const draft = listDisplay.draftPreferences;

  const viewModel = useMemo(() => {
    if (!draft) {
      return null;
    }
    return buildListFiltersViewModel({
      draft,
      addedByOptions: listDisplay.addedByOptions,
      capabilities: listDisplay.capabilities,
      matchingCount: listDisplay.matchingCount,
    });
  }, [
    draft,
    listDisplay.addedByOptions,
    listDisplay.capabilities,
    listDisplay.matchingCount,
  ]);

  if (!draft || !viewModel) {
    return null;
  }

  return (
    <ListFiltersTemplate
      isDrawerOpen = {
        listDisplay.isOpen
      }
      onClose = {
        handleClose
      }
      draft = {
        draft
      }
      {...viewModel}
      capabilities = {
        listDisplay.capabilities
      }
      categoryOptions = {
        listDisplay.categoryOptions
      }
      hasUnsavedDraft = {
        listDisplay.hasUnsavedDraft
      }
      onUpdateDraft = {
        listDisplay.updateDraft
      }
      onClearDraft = {
        listDisplay.clearDraft
      }
      onRevertDraft = {
        listDisplay.revertDraft
      }
      onApplyDraft = {
        listDisplay.applyDraft
      }
    />
  );
};
