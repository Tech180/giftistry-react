import type { Item } from '../interfaces/item.interface';
import { resolveSuggestedByDisplayName } from './resolve-suggested-by-display-name.util';
import { resolveListItemAddedByUserId } from './resolve-list-item-added-by-user-id.util';

export interface AddedByFilterOption {
  id: 'all' | 'self' | string;
  label: string;
}

export function buildAddedByFilterOptions(input: {
  items: Item[];
  listOwnerUserId: string | null;
  currentUserId: string | null;
}): AddedByFilterOption[] {
  const { items, listOwnerUserId, currentUserId } = input;
  const options: AddedByFilterOption[] = [{ id: 'all', label: 'Anyone' }];

  if (currentUserId) {
    options.push({ id: 'self', label: 'You' });
  }

  const seen = new Set<string>(currentUserId ? [currentUserId] : []);

  for (const item of items) {
    const userId = resolveListItemAddedByUserId(item, listOwnerUserId);
    if (!userId || seen.has(userId)) {
      continue;
    }
    seen.add(userId);
    const label =
      userId === currentUserId
        ? 'You'
        : item.SuggestedByUserId === userId
          ? resolveSuggestedByDisplayName(item) || userId
          : userId === listOwnerUserId
            ? 'List owner'
            : userId;
    if (userId !== currentUserId) {
      options.push({ id: userId, label });
    }
  }

  return options;
}
