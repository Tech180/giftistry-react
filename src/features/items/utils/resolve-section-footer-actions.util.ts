import type { ResolveSectionFooterActionsInput } from '../interfaces/resolve-section-footer-actions-input.interface';
import type { ResolveSectionFooterActionsResult } from '../interfaces/resolve-section-footer-actions-result.interface';

/**
 * Footer chrome depends on which substitution browse section is active.
 * Claim/Unclaim stay displayItem-scoped in the card; this gates claimer
 * substitution create/manage. Parent edit/delete follow canEditItem so list
 * owners keep Edit/Delete while browsing substitutions.
 */
export function resolveSectionFooterActions({
  active,
  canEditItem,
  claimerEligibility,
  activeSectionFullyClaimed = false,
}: ResolveSectionFooterActionsInput): ResolveSectionFooterActionsResult {
  const showParentEditDelete = canEditItem;

  if (!claimerEligibility.visible) {
    return { showParentEditDelete, substitutionSurface: null };
  }

  if (
    active.kind === 'original' &&
    claimerEligibility.mode === 'create' &&
    !activeSectionFullyClaimed
  ) {
    return {
      showParentEditDelete,
      substitutionSurface: {
        mode: 'create',
        allowSubstitutions: claimerEligibility.allowSubstitutions,
        ownOption: null,
      },
    };
  }

  if (
    active.kind === 'claimer_custom' &&
    claimerEligibility.mode === 'manage' &&
    claimerEligibility.ownOption &&
    active.option?.Id === claimerEligibility.ownOption.Id
  ) {
    return {
      showParentEditDelete,
      substitutionSurface: {
        mode: 'manage',
        allowSubstitutions: claimerEligibility.allowSubstitutions,
        ownOption: claimerEligibility.ownOption,
      },
    };
  }

  return { showParentEditDelete, substitutionSurface: null };
}
