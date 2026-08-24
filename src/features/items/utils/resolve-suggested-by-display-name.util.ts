import type { Item } from '../interfaces/item.interface';

export function resolveSuggestedByDisplayName(
  item: Pick<
    Item,
    'SuggestedByUsername' | 'SuggestedByFirstName' | 'SuggestedByLastName'
  >
): string {
  const fromNames =
    `${item.SuggestedByFirstName ?? ''} ${item.SuggestedByLastName ?? ''}`.trim();
  return fromNames || item.SuggestedByUsername?.trim() || 'Collaborator';
}
