import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type { ClaimBadgeEntry } from '../../../../../../interfaces/claim-badge-entry.interface';
import type { Item } from '../../../../../../interfaces/item.interface';
import type { ItemLink } from '../../../../../../interfaces/item-link.interface';

export interface Props {
  item: Item;
  displayItem: Item;
  isOwner: boolean;
  audienceLabel: string | null;
  isPrivate: boolean;
  isTaggingModeActive: boolean | undefined;
  isTaggedSelection: boolean | undefined;
  onSelectTag?: () => void;
  isLinkedToItems: boolean;
  isRelatedToItems: boolean;
  primaryLink: ItemLink | undefined;
  primaryPrice: number | null | undefined;
  showQuantity: boolean;
  claimBadgeEntries: ClaimBadgeEntry[];
  showClaimBadge: boolean;
  suggestedByDisplayName: string;
  hasPriority: boolean;
  metadata: ItemDescriptionMetadata | null;
  getSiteName: (url: string, retailerName?: string | null) => string;
  elevateAboveWash: boolean;
}
