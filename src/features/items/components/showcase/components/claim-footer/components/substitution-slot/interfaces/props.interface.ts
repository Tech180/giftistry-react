import type { ClaimerSubstitutionAction } from '../../../../../../interfaces/claimer-substitution-action.interface';

export interface Props {
  substitutionAction: ClaimerSubstitutionAction | null;
  claimLoading: boolean;
  substitutionManageIconClassName: string | undefined;
}
