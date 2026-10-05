import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';
import { resolveItemSubstitutionOptions } from './resolve-item-substitution-options.util';

/** Browse index for a substitution option id on a parent item. */
export function resolveSubstitutionOptionIndex(
  parent: Item,
  options: ItemSubstitutionOption[] | null | undefined,
  substitutionOptionId: string | null | undefined
): number | undefined {
  if (!substitutionOptionId?.trim()) {
    return undefined;
  }
  const browse = resolveItemSubstitutionOptions(parent, options);
  const idx = browse.findIndex(
    (entry) => entry.substitutionId === substitutionOptionId || entry.option?.Id === substitutionOptionId
  );
  return idx >= 0 ? idx : undefined;
}
