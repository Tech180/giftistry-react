import type { ClaimBadgeEntry } from '../../../../interfaces/claim-badge-entry.interface';
import type { Props } from './props.interface';

export interface TemplateProps extends Props {
  rootClassName: string;
  isLinkedToItems: boolean;
  isRelatedToItems: boolean;
  primaryPrice: number | null | undefined;
  primaryPriceDisplay: string;
  showQuantity: boolean;
  claimBadgeEntries: ClaimBadgeEntry[];
  showClaimBadge: boolean;
  showFundingWidget: boolean;
  suggestedByDisplayName: string;
  hasPriority: boolean;
}
