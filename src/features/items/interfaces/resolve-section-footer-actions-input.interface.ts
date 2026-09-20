import type { ResolveClaimerSubstitutionActionResult } from './resolve-claimer-substitution-action-result.interface';
import type { SubstitutionBrowseOption } from './substitution-browse-option.interface';

export interface ResolveSectionFooterActionsInput {
  active: Pick<SubstitutionBrowseOption, 'kind' | 'option'>;
  /** Owner or suggester may edit/delete the parent item (any browse section). */
  canEditItem: boolean;
  claimerEligibility: ResolveClaimerSubstitutionActionResult;
  /** GF-aware fully-claimed for the active browse section (original or substitution). */
  activeSectionFullyClaimed?: boolean;
}
