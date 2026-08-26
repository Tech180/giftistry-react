import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';
import { resolveItemSubstitutionOptions } from './resolve-item-substitution-options.util';

function sectionHasAnyClaim(claims: { UserId?: string | null }[] | null | undefined): boolean {
  return (claims?.length ?? 0) > 0;
}

/**
 * Preferred item id for the default substitution browse section.
 * Priority: current user claim (sub then parent) → any parent claim → any sub
 * claim in browse order → ActiveSubstitutionId → null (Main).
 */
export function resolveUserClaimedSubstitutionItemId(
  parent: Item,
  options: ItemSubstitutionOption[] | null | undefined,
  userId: string | null | undefined
): string | null {
  if (userId) {
    for (const option of options ?? []) {
      if (option.Item.Claims?.some((c) => c.UserId === userId)) {
        return option.Item.Id;
      }
    }

    if (parent.Claims?.some((c) => c.UserId === userId)) {
      return parent.Id;
    }
  }

  if (sectionHasAnyClaim(parent.Claims)) {
    return parent.Id;
  }

  const browse = resolveItemSubstitutionOptions(parent, options);
  for (const entry of browse) {
    if (entry.kind === 'original') continue;
    const claims = entry.option?.Item.Claims;
    if (sectionHasAnyClaim(claims)) {
      return entry.itemId;
    }
  }

  if (parent.ActiveSubstitutionId) {
    return parent.ActiveSubstitutionId;
  }

  return null;
}
