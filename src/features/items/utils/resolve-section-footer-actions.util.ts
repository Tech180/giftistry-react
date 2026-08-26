import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';
import type { ResolveClaimerSubstitutionActionResult } from './resolve-claimer-substitution-action.util';
import type { SubstitutionBrowseOption } from './resolve-item-substitution-options.util';

export interface ResolveSectionFooterActionsInput {
  active: Pick<SubstitutionBrowseOption, 'kind' | 'option'>;
  /** Owner or suggester may edit/delete the parent item (any browse section). */
  canEditItem: boolean;
  claimerEligibility: ResolveClaimerSubstitutionActionResult;
}

export interface SectionFooterSubstitutionSurface {
  mode: 'create' | 'manage';
  allowSubstitutions: boolean;
  ownOption: ItemSubstitutionOption | null;
}

export interface ResolveSectionFooterActionsResult {
  /** Parent Edit/Delete when the viewer can edit the parent item. */
  showParentEditDelete: boolean;
  /** Section-gated Add / Edit-Delete substitution controls; null when hidden. */
  substitutionSurface: SectionFooterSubstitutionSurface | null;
}

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
}: ResolveSectionFooterActionsInput): ResolveSectionFooterActionsResult {
  const showParentEditDelete = canEditItem;

  if (!claimerEligibility.visible) {
    return { showParentEditDelete, substitutionSurface: null };
  }

  if (active.kind === 'original' && claimerEligibility.mode === 'create') {
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
