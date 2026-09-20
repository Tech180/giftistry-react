import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type { Item } from '../../../../../interfaces/item.interface';
import type { ShowcaseVariationProgress } from '../../../../../interfaces/showcase-variation-progress.interface';
import type { Props as ClaimFooterProps } from '../../claim-footer/interfaces/props.interface';
import type { MetaBadgeEntry } from '../../meta-badges/interfaces/props.interface';

export interface Props {
  displayItem: Item;
  primaryImageUrl: string | null;
  metadata: ItemDescriptionMetadata | null;
  bestPriceDisplay: string;
  displayDescription: string;
  predefinedEntries: MetaBadgeEntry[];
  userDefinedEntries: { name: string; value: string }[];
  showVariationsProgress: boolean;
  variationProgress: ShowcaseVariationProgress[];
  showGroupFunding: boolean;
  totalExtractedPrice: number;
  totalClaimedAmount: number;
  getSiteName: (url: string, retailerName?: string | null) => string;
  substitutionKind: 'original' | 'owner_approved' | 'claimer_custom';
  substitutionCreatedByUserId?: string | null;
  isLinkedToItems: boolean;
  isRelatedToItems: boolean;
  showSuggestionBadge: boolean;
  showHiddenSuggestionBadge: boolean;
  suggestionLabel: string;
  audienceLabel: string | null;
  audienceBadgeClassName: string;
  localIsFavorite: boolean;
  displayCategory: string;
  onCopyMarkdown?: () => void;
  onClose: () => void;
  showQuantityProgress: boolean;
  quantityProgressMetric: string;
  progressPercent: number;
  claimFooter: ClaimFooterProps;
}
