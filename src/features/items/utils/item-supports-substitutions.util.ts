import type { Item } from '../interfaces/item.interface';

/** Substitutions are only supported on owner items (not suggestions). */
export function itemSupportsSubstitutions(item: Pick<Item, 'IsSuggestion'>): boolean {
  return item.IsSuggestion !== true;
}
