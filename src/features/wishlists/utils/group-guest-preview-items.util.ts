import type { Item } from 'features/items';
import type { ItemListGroup } from 'features/items/interfaces/item-list-result.interface';
import {
  getFriendlyCategoryLabel,
  normalizeCategoryLabel,
} from 'features/items/utils/category-label.util';

export function groupGuestPreviewItems(
  items: Item[],
  groups: ItemListGroup[] | undefined,
  searchQuery: string
): { categoryKey: string; label: string; items: Item[] }[] {
  const query = searchQuery.toLowerCase().trim();
  const matchesQuery = (item: Item) => {
    if (!query) return true;
    return (
      item.Name.toLowerCase().includes(query) ||
      Boolean(item.Description && item.Description.toLowerCase().includes(query))
    );
  };

  const sortGroups = (next: { categoryKey: string; label: string; items: Item[] }[]) =>
    [...next]
      .filter((group) => group.items.length > 0)
      .sort((a, b) => {
        const aTail = a.categoryKey === 'uncategorized';
        const bTail = b.categoryKey === 'uncategorized';
        if (aTail && !bTail) return 1;
        if (!aTail && bTail) return -1;
        return a.label.localeCompare(b.label);
      });

  if (groups && groups.length > 0) {
    const itemsById = new Map(items.map((item) => [item.Id, item]));
    return sortGroups(
      groups.map((group) => ({
        categoryKey: group.CategoryKey,
        label: group.CategoryLabel,
        items: group.Items.map((item) => itemsById.get(item.Id) ?? item).filter(matchesQuery),
      }))
    );
  }

  const grouped: Record<string, { label: string; items: Item[] }> = {};
  for (const item of items.filter(matchesQuery)) {
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
