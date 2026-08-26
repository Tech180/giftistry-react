import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';

export interface SubstitutionBrowseOption {
  key: string;
  kind: 'original' | 'owner_approved' | 'claimer_custom';
  label: string;
  itemId: string;
  substitutionId?: string;
  option?: ItemSubstitutionOption;
}

/** Ordered browse list: original, then owner-approved (by sort), then custom. */
export function resolveItemSubstitutionOptions(
  parent: Item,
  options: ItemSubstitutionOption[] | null | undefined
): SubstitutionBrowseOption[] {
  const result: SubstitutionBrowseOption[] = [
    {
      key: `original:${parent.Id}`,
      kind: 'original',
      label: 'Original',
      itemId: parent.Id,
    },
  ];

  const allowOwnerApproved = parent.AllowSubstitutions !== false;

  const sorted = [...(options ?? [])].sort((a, b) => {
    if (a.Kind !== b.Kind) {
      return a.Kind === 'owner_approved' ? -1 : 1;
    }
    return a.SortOrder - b.SortOrder;
  });

  for (const option of sorted) {
    if (!allowOwnerApproved && option.Kind === 'owner_approved') {
      continue;
    }
    result.push({
      key: `sub:${option.Id}`,
      kind: option.Kind,
      label: option.Item.Name,
      itemId: option.Item.Id,
      substitutionId: option.Id,
      option,
    });
  }

  return result;
}
