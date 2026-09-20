import type { Item } from 'features/items';
import { getFriendlyCategoryLabel, normalizeCategoryLabel } from 'features/items/utils/category-label.util';
import {
  GENERAL_ITEMS_CATEGORY_LABEL,
  PROCESSING_CATEGORY_KEY,
  PROCESSING_CATEGORY_LABEL,
  UNCATEGORIZED_CATEGORY_KEY,
} from '../constants/category-group.constant';
import type { GroupItemsInput } from '../interfaces/group-items-input.interface';
import type { ItemGroup } from '../interfaces/item-group.interface';
import { filterItemsByQuery } from './filter-items-by-query.util';

function isTailCategory(categoryKey: string): boolean {
  return categoryKey === UNCATEGORIZED_CATEGORY_KEY || categoryKey === PROCESSING_CATEGORY_KEY;
}

function splitEnrichingUncategorized(groups: ItemGroup[], enrichingItemIds: Set<string>): ItemGroup[] {
  return groups.flatMap((group) => {
    if (group.categoryKey !== UNCATEGORIZED_CATEGORY_KEY) {
      return [group];
    }

    const enriching = group.items.filter((item) => enrichingItemIds.has(item.Id));
    const settled = group.items.filter((item) => !enrichingItemIds.has(item.Id));
    const next: ItemGroup[] = [];

    if (enriching.length > 0) {
      next.push({ categoryKey: PROCESSING_CATEGORY_KEY, label: PROCESSING_CATEGORY_LABEL, items: enriching });
    }

    if (settled.length > 0) {
      next.push({
        categoryKey: UNCATEGORIZED_CATEGORY_KEY,
        label: GENERAL_ITEMS_CATEGORY_LABEL,
        items: settled,
      });
    }

    return next;
  });
}

function sortGroups(groups: ItemGroup[]): ItemGroup[] {
  return [...groups]
    .filter((group) => group.items.length > 0)
    .sort((a, b) => {
      const aTail = isTailCategory(a.categoryKey);
      const bTail = isTailCategory(b.categoryKey);

      if (aTail && !bTail) {
        return 1;
      }

      if (!aTail && bTail) {
        return -1;
      }

      if (a.categoryKey === PROCESSING_CATEGORY_KEY && b.categoryKey === UNCATEGORIZED_CATEGORY_KEY) {
        return -1;
      }

      if (a.categoryKey === UNCATEGORIZED_CATEGORY_KEY && b.categoryKey === PROCESSING_CATEGORY_KEY) {
        return 1;
      }

      return a.label.localeCompare(b.label);
    });
}

function resolveCategoryKey(item: Item): string {
  if (item.CategoryKey) {
    return item.CategoryKey;
  }

  const raw = item.Category?.trim() ? item.Category.trim() : UNCATEGORIZED_CATEGORY_KEY;
  return normalizeCategoryLabel(raw);
}

function resolveCategoryLabel(item: Item, categoryKey: string): string {
  if (item.CategoryLabel) {
    return item.CategoryLabel;
  }

  if (categoryKey === UNCATEGORIZED_CATEGORY_KEY) {
    return GENERAL_ITEMS_CATEGORY_LABEL;
  }

  return getFriendlyCategoryLabel(item.Category || categoryKey);
}

export function groupItems(input: GroupItemsInput): ItemGroup[] {
  const { visibleItems, searchQuery, itemGroups, enrichingItemIds } = input;
  const matchesQuery = (item: Item) => filterItemsByQuery(item, searchQuery);

  if (itemGroups && itemGroups.length > 0) {
    return sortGroups(
      splitEnrichingUncategorized(
        itemGroups
          .map((group) => ({
            categoryKey: group.CategoryKey,
            label: group.CategoryLabel,
            items: group.Items.filter((item) => {
              const inVisible = visibleItems.some((visible) => visible.Id === item.Id);
              return inVisible && matchesQuery(item);
            }),
          }))
          .filter((group) => group.items.length > 0),
        enrichingItemIds
      )
    );
  }

  const filtered = visibleItems.filter(matchesQuery);
  const groups: { [categoryKey: string]: { label: string; items: Item[] } } = {};

  for (const item of filtered) {
    const categoryKey = resolveCategoryKey(item);

    if (!groups[categoryKey]) {
      groups[categoryKey] = { label: resolveCategoryLabel(item, categoryKey), items: [] };
    }

    groups[categoryKey].items.push(item);
  }

  return sortGroups(
    splitEnrichingUncategorized(
      Object.entries(groups).map(([key, val]) => ({
        categoryKey: key,
        label: val.label,
        items: val.items,
      })),
      enrichingItemIds
    )
  );
}
