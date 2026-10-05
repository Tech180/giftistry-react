import type { ResolveCanEditSubstitutionOptionInput } from '../interfaces/resolve-can-edit-substitution-option-input.interface';
import type { ResolveCanEditSubstitutionOptionResult } from '../interfaces/resolve-can-edit-substitution-option-result.interface';

/** Who may edit/delete a substitution option from list/showcase chrome. */
export function resolveCanEditSubstitutionOption(
  input: ResolveCanEditSubstitutionOptionInput
): ResolveCanEditSubstitutionOptionResult {
  const { option, userId, canCollaborate } = input;

  if (option.Kind === 'owner_approved') {
    const allowed = canCollaborate;
    return { canEdit: allowed, canDelete: allowed };
  }

  const isAuthor = !!userId && option.CreatedByUserId === userId;
  return { canEdit: isAuthor, canDelete: isAuthor };
}
