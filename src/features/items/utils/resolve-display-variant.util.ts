import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';
import {
  resolveItemSubstitutionOptions,
  type SubstitutionBrowseOption,
} from './resolve-item-substitution-options.util';
import { resolveUserClaimedSubstitutionItemId } from './resolve-user-claimed-substitution.util';

export { resolveUserClaimedSubstitutionItemId } from './resolve-user-claimed-substitution.util';

/** Index into browse options for the variant the current user claimed (or original). */
export function resolveDisplayVariantIndex(
  parent: Item,
  options: ItemSubstitutionOption[] | null | undefined,
  userId: string | null | undefined,
  browseIndex?: number
): number {
  const browse = resolveItemSubstitutionOptions(parent, options);
  if (
    typeof browseIndex === 'number' &&
    browseIndex >= 0 &&
    browseIndex < browse.length
  ) {
    return browseIndex;
  }

  const claimedId = resolveUserClaimedSubstitutionItemId(parent, options, userId);
  if (!claimedId || claimedId === parent.Id) {
    return 0;
  }

  const idx = browse.findIndex(
    (entry) => entry.itemId === claimedId || entry.substitutionId === claimedId
  );
  return idx >= 0 ? idx : 0;
}

export function resolveDisplayVariant(
  parent: Item,
  options: ItemSubstitutionOption[] | null | undefined,
  userId: string | null | undefined,
  browseIndex?: number
): SubstitutionBrowseOption {
  const browse = resolveItemSubstitutionOptions(parent, options);
  const index = resolveDisplayVariantIndex(parent, options, userId, browseIndex);
  return browse[index] ?? browse[0]!;
}
