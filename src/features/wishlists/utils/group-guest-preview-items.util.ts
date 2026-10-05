import type {
  Item,
  ListDisplayPreferences,
  ListFilterContext,
} from 'features/items';
import {
  createDefaultListDisplayPreferences,
  filterItemsForListDisplay,
  sortItemsForListSort,
} from 'features/items';
import type { ItemListGroup } from 'features/items/interfaces/item-list-result.interface';
import {
  getFriendlyCategoryLabel,
  normalizeCategoryLabel,
} from 'features/items/utils/category-label.util';

export function groupGuestPreviewItems(
  items: Item[],
  groups: ItemListGroup[] | undefined,
  searchQuery: string,
  options?: {
    listDisplayPreferences?: ListDisplayPreferences;
    filterContext?: ListFilterContext;
  }
): { categoryKey: string; label: string; items: Item[] }[] {
  const preferences = options?.listDisplayPreferences ?? createDefaultListDisplayPreferences();
  const context: ListFilterContext = options?.filterContext ?? {
    allowGroupFunds: false,
    revealSuggestions: true,
    currentUserId: null,
    listOwnerUserId: null,
    isOwner: false,
    canCollaborate: false,
    isPublicGuest: true,
  };

  const filteredItems = filterItemsForListDisplay({
    items,
    searchQuery,
    searchScope: preferences.searchScope,
    filters: preferences.filters,
    context,
  });

  const withSortedItems = (next: { categoryKey: string; label: string; items: Item[] }[]) =>
    next.map((group) => ({
      ...group,
      items: sortItemsForListSort(
        group.items,
        preferences.sort,
        context.allowGroupFunds
      ),
    }));

  const sortGroups = (next: { categoryKey: string; label: string; items: Item[] }[]) =>
    [...withSortedItems(next)]
      .filter((group) => group.items.length > 0)
      .sort((a, b) => {
        const aTail = a.categoryKey === 'uncategorized';
        const bTail = b.categoryKey === 'uncategorized';
        if (aTail && !bTail) return 1;
        if (!aTail && bTail) return -1;
        return a.label.localeCompare(b.label);
      });

  if (groups && groups.length > 0) {
    const itemsById = new Map(filteredItems.map((item) => [item.Id, item]));
    return sortGroups(
      groups.map((group) => ({
        categoryKey: group.CategoryKey,
        label: group.CategoryLabel,
        items: group.Items.map((item) => itemsById.get(item.Id)).filter(
          (item): item is Item => item != null
        ),
      }))
    );
  }

  const grouped: Record<string, { label: string; items: Item[] }> = {};
  for (const item of filteredItems) {
    const categoryKey =
      item.CategoryKey ||
      normalizeCategoryLabel(item.Category && item.Category.trim() ? item.Category.trim() : 'uncategorized');
    if (!grouped[categoryKey]) {
      grouped[categoryKey] = {
        label:
          item.CategoryLabel ||
          (categoryKey === 'uncategorized'
            ? 'General Items'
            : getFriendlyCategoryLabel(item.Category || categoryKey)),
        items: [],
      };
    }
    grouped[categoryKey].items.push(item);
  }

  return sortGroups(
    Object.entries(grouped).map(([categoryKey, value]) => ({
      categoryKey,
      label: value.label,
      items: value.items,
    }))
  );
}
