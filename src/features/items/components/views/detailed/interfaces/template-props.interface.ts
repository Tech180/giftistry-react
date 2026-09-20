import type { ClaimBadgeEntry } from '../../../../interfaces/claim-badge-entry.interface';
import type { ItemAudienceUser } from '../../../../interfaces/item-audience-user.interface';
import type { ItemLink } from '../../../../interfaces/item-link.interface';
import type { Props } from './props.interface';

export interface TemplateProps extends Props {
  showSharingAvatars: boolean;
  rootClassName: string;
  drawerClassName: string;
  footerClassName: string;
  headerClassName: string;
  starBtnClassName: string;
  isLinkedToItems: boolean;
  isRelatedToItems: boolean;
  primaryImageUrl: string | null;
  primaryPrice: number | null | undefined;
  primaryLink: ItemLink | undefined;
  claimBadgeEntries: ClaimBadgeEntry[];
  showClaimBadge: boolean;
  showActionButtons: boolean;
  showFundingWidget: boolean;
  hasSubstitutionBrowse: boolean;
  substitutionIndex: number;
  substitutionTotal: number;
  hasMetaEnd: boolean;
  hasPriority: boolean;
  sharingUsers: ItemAudienceUser[];
  suggestedByDisplayName: string;
  badgesAudienceLabel: string | null;
  showClaimDrawerContent: boolean;
  hasLinkedClaimPeers: boolean;
  linkedClaimTaggedIds: string[];
  claimFormPrompt: string | undefined;
  claimConfirmLabel: string;
}
