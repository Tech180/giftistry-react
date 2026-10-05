import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildAddedByFilterOptions,
  buildCategoryFilterOptions,
  countActiveListDisplayFilters,
  countMatchingListDisplayItems,
  createDefaultListDisplayPreferences,
  readListDisplayPrefsForList,
  sanitizeListDisplayPreferences,
  writeListDisplayPrefsForList,
  type ListDisplayPreferences,
  resolveListFilterCapabilities,
} from 'features/items';
import type { UseListDisplayPreferencesOptions } from '../interfaces/use-list-display-preferences-options.interface';
import type { UseListDisplayPreferencesResult } from '../interfaces/use-list-display-preferences-result.interface';

function preferencesEqual(a: ListDisplayPreferences, b: ListDisplayPreferences): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useListDisplayPreferences(
  options: UseListDisplayPreferencesOptions
): UseListDisplayPreferencesResult {
  const { listId, searchQuery, displayItems, itemGroups, filterContext } = options;

  const capabilities = useMemo(
    () => resolveListFilterCapabilities(filterContext),
    [filterContext]
  );

  const categoryOptions = useMemo(() => {
    const fromItems = buildCategoryFilterOptions(displayItems);
    if (!itemGroups?.length) {
      return fromItems;
    }
    const keys = new Set(fromItems.map((option) => option.key));
    for (const group of itemGroups) {
      if (!keys.has(group.CategoryKey)) {
        keys.add(group.CategoryKey);
        fromItems.push({ key: group.CategoryKey, label: group.CategoryLabel });
      }
    }
    return fromItems.sort((a, b) => a.label.localeCompare(b.label));
  }, [displayItems, itemGroups]);

  const validCategoryKeys = useMemo(
    () => new Set(categoryOptions.map((option) => option.key)),
    [categoryOptions]
  );

  const [appliedPreferences, setAppliedPreferences] = useState<ListDisplayPreferences>(() =>
    sanitizeListDisplayPreferences(createDefaultListDisplayPreferences(), capabilities)
  );
  const [draftPreferences, setDraftPreferences] = useState<ListDisplayPreferences | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!listId) {
      return;
    }
    const stored = readListDisplayPrefsForList(listId);
    const base = stored ?? createDefaultListDisplayPreferences();
    setAppliedPreferences(sanitizeListDisplayPreferences(base, capabilities, validCategoryKeys));
  }, [listId, capabilities, validCategoryKeys]);

  const sanitize = useCallback(
    (prefs: ListDisplayPreferences) =>
      sanitizeListDisplayPreferences(prefs, capabilities, validCategoryKeys),
    [capabilities, validCategoryKeys]
  );

  const openDrawer = useCallback(() => {
    setDraftPreferences(structuredClone(appliedPreferences));
    setIsOpen(true);
  }, [appliedPreferences]);

  const closeDrawer = useCallback(() => {
    setDraftPreferences(null);
    setIsOpen(false);
  }, []);

  const applyDraft = useCallback(() => {
    if (!draftPreferences || !listId) {
      return;
    }
    const next = sanitize(draftPreferences);
    setAppliedPreferences(next);
    writeListDisplayPrefsForList(listId, next);
    closeDrawer();
  }, [draftPreferences, listId, sanitize, closeDrawer]);

  const clearDraft = useCallback(() => {
    setDraftPreferences(sanitize(createDefaultListDisplayPreferences()));
  }, [sanitize]);

  const resetAppliedFilters = useCallback(() => {
    const next = sanitize(createDefaultListDisplayPreferences());
    setAppliedPreferences(next);
    if (listId) {
      writeListDisplayPrefsForList(listId, next);
    }
    setDraftPreferences((prev) => (prev != null ? structuredClone(next) : null));
  }, [listId, sanitize]);

  const revertDraft = useCallback(() => {
    setDraftPreferences(structuredClone(appliedPreferences));
  }, [appliedPreferences]);

  const updateDraft = useCallback((updater: (prev: ListDisplayPreferences) => ListDisplayPreferences) => {
    setDraftPreferences((prev) => {
      if (!prev) {
        return prev;
      }
      return updater(prev);
    });
  }, []);

  const addedByOptions = useMemo(
    () =>
      buildAddedByFilterOptions({
        items: displayItems,
        listOwnerUserId: filterContext.listOwnerUserId,
        currentUserId: filterContext.currentUserId,
      }),
    [displayItems, filterContext]
  );

  const categoryLabelMap = useMemo(
    () => new Map(categoryOptions.map((option) => [option.key, option.label])),
    [categoryOptions]
  );

  const activeFilterCount = useMemo(
    () => countActiveListDisplayFilters(appliedPreferences, categoryLabelMap),
    [appliedPreferences, categoryLabelMap]
  );

  const draftForCount = draftPreferences ?? appliedPreferences;
  const matchingCount = countMatchingListDisplayItems({
    items: displayItems,
    searchQuery,
    preferences: draftForCount,
    context: filterContext,
  });

  const hasUnsavedDraft =
    draftPreferences != null && !preferencesEqual(draftPreferences, appliedPreferences);

  return {
    appliedPreferences,
    draftPreferences,
    isOpen,
    setIsOpen,
    capabilities,
    categoryOptions,
    addedByOptions,
    openDrawer,
    closeDrawer,
    applyDraft,
    clearDraft,
    resetAppliedFilters,
    revertDraft,
    updateDraft,
    activeFilterCount,
    matchingCount,
    hasUnsavedDraft,
  };
}
