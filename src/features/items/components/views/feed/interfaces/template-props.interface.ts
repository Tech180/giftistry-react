import type { ClaimBadgeEntry } from '../../../../interfaces/claim-badge-entry.interface';
import type { ItemLink } from '../../../../interfaces/item-link.interface';
import type { Props } from './props.interface';

export interface TemplateProps extends Props {
  rootClassName: string;
  itemClassName: string;
  elevateAboveWash: boolean;
  isLinkedToItems: boolean;
  isRelatedToItems: boolean;
  primaryLink: ItemLink | undefined;
  primaryPrice: number | null | undefined;
  primaryImageUrl: string | null;
  showQuantity: boolean;
  claimBadgeEntries: ClaimBadgeEntry[];
  showClaimBadge: boolean;
  showFundingWidget: boolean;
  suggestedByDisplayName: string;
  hasPriority: boolean;
}
