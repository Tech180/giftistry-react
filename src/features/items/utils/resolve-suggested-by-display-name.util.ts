import type { Item } from '../interfaces/item.interface';
import { getDisplayName } from 'shared/utils/get-display-name.util';

export function resolveSuggestedByDisplayName(
  item: Pick<Item, 'SuggestedByUsername' | 'SuggestedByFirstName' | 'SuggestedByLastName'>,
): string {
  return getDisplayName(
    {
      FirstName: item.SuggestedByFirstName ?? undefined,
      LastName: item.SuggestedByLastName ?? undefined,
      Username: item.SuggestedByUsername ?? undefined,
    },
    'Collaborator',
  );
}
