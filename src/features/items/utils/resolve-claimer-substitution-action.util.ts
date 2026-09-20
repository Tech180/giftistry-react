import type { ResolveClaimerSubstitutionActionInput } from '../interfaces/resolve-claimer-substitution-action-input.interface';
import type { ResolveClaimerSubstitutionActionResult } from '../interfaces/resolve-claimer-substitution-action-result.interface';
import { itemSupportsSubstitutions } from './item-supports-substitutions.util';

/** Whether a viewer may add or manage their one custom substitution (claim not required). */
export function resolveClaimerSubstitutionAction({
  item,
  userId,
  canCollaborate,
  isPublicGuest,
}: ResolveClaimerSubstitutionActionInput): ResolveClaimerSubstitutionActionResult {
  const allowSubstitutions = item.AllowSubstitutions !== false;
  const hidden: ResolveClaimerSubstitutionActionResult = {
    visible: false,
    allowSubstitutions,
    mode: 'create',
    ownOption: null,
  };

  if (canCollaborate || isPublicGuest || !userId || !itemSupportsSubstitutions(item)) {
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
