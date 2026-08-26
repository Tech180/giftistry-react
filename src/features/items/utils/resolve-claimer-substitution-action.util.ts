import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';
import { itemSupportsSubstitutions } from './item-supports-substitutions.util';

export interface ResolveClaimerSubstitutionActionInput {
  item: Pick<Item, 'Id' | 'SubstitutionOptions' | 'IsSuggestion' | 'AllowSubstitutions'>;
  userId: string | null | undefined;
  isOwner: boolean;
  isPublicGuest: boolean;
}

export interface ResolveClaimerSubstitutionActionResult {
  visible: boolean;
  allowSubstitutions: boolean;
  mode: 'create' | 'manage';
  ownOption: ItemSubstitutionOption | null;
}

/** Whether a viewer may add or manage their one custom substitution (claim not required). */
export function resolveClaimerSubstitutionAction({
  item,
  userId,
  isOwner,
  isPublicGuest,
}: ResolveClaimerSubstitutionActionInput): ResolveClaimerSubstitutionActionResult {
  const allowSubstitutions = item.AllowSubstitutions !== false;
  const hidden: ResolveClaimerSubstitutionActionResult = {
    visible: false,
    allowSubstitutions,
    mode: 'create',
    ownOption: null,
  };

  if (isOwner || isPublicGuest || !userId || !itemSupportsSubstitutions(item)) {
    return hidden;
  }

  const options = item.SubstitutionOptions ?? [];
  const ownOption =
    options.find(
      (option) => option.Kind === 'claimer_custom' && option.CreatedByUserId === userId
    ) ?? null;

  if (ownOption) {
    return {
      visible: true,
      allowSubstitutions,
      mode: 'manage',
      ownOption,
    };
  }

  const hasClaimerCustom = options.some((option) => option.Kind === 'claimer_custom');
  if (hasClaimerCustom) {
    return hidden;
  }

  return {
    visible: true,
    allowSubstitutions,
    mode: 'create',
    ownOption: null,
  };
}
