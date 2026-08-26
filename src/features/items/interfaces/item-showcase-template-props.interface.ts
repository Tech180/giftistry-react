import type { ComponentType, CSSProperties, SyntheticEvent } from 'react';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type { Item } from './item.interface';
import type { ItemActions } from './item-actions.interface';
import type { ClaimerSubstitutionAction } from './claimer-substitution-action.interface';
import type { ItemSubstitutionOption } from './item-substitution.interface';
import type { ShowcaseRelationItem } from './showcase-relation-item.interface';
import type { ShowcaseVariationProgress } from './showcase-variation-progress.interface';

export interface ItemShowcaseTemplateProps {
  item: Item;
  /** Visual variant currently shown (parent or a substitution child overlay). Defaults to `item`. */
  displayItem?: Item;
  substitutionOptions?: ItemSubstitutionOption[];
  substitutionActiveIndex?: number;
  onSubstitutionIndexChange?: (index: number) => void;
  /** Claimer custom substitution footer action. */
  substitutionAction?: ClaimerSubstitutionAction | null;
  isOwner: boolean;
  canCollaborate: boolean;
  isPublicGuest?: boolean;
  canEditItem?: boolean;
  isArchived?: boolean;
  isExpired?: boolean;
  allowGroupFunds: boolean;
  claimedByCurrentUser: boolean;
  canAdjustClaim: boolean;
  itemActions: ItemActions;
  claimUserId?: string | null;
  claimActorName: string | null;
  claimAmount: string;
  setClaimAmount: (val: string) => void;
  anonymous: boolean;
  setAnonymous: (val: boolean) => void;
  claimLoading: boolean;
  showClaimForm: boolean;
  setShowClaimForm: (val: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (val: boolean) => void;
  deleteLoading: boolean;
  localIsFavorite: boolean;
  displayDescription: string;
  metadata: ItemDescriptionMetadata | null;
  predefinedDisplayEntries: { label: string; value: string }[];
  userDefinedEntries: { name: string; value: string }[];
  metadataBadgeEmoji: Record<string, string>;
  handleClaim: (e?: SyntheticEvent) => void;
  handleUnclaim: () => void;
  handleDelete: () => void;
  totalExtractedPrice: number;
  totalClaimedAmount: number;
  isMultiCount: boolean;
  isFullyClaimed: boolean;
  /**
   * Group-aware visible claim for gray-out (active section or a claimed sibling).
   */
  hasVisibleClaimForGray?: boolean;
  /**
   * True when this browse section is locked because a sibling was claimed
   * (button label: Unavailable rather than Already Claimed).
   */
  isClaimUnavailable?: boolean;
  progressPercent: number;
  onClose: () => void;
  onEdit?: () => void;
  getSiteName: (url: string, retailerName?: string | null) => string;
  audienceLabel: string | null;
  isPrivate: boolean;
  variant?: 'card' | 'inline';
  CategoryIcon?: ComponentType<{ size?: number; className?: string; style?: CSSProperties }>;
  displayCategory: string;
  bestPriceDisplay: string;
  statusLabel: string;
  quantityProgressMetric: string;
  hasNumericPriority: boolean;
  priorityDisplay: number | null;
  isLinkedToItems: boolean;
  isRelatedToItems: boolean;
  showGroupFunding: boolean;
  showQuantityProgress: boolean;
  showVariationsProgress: boolean;
  showHeroMeta: boolean;
  showSuggestionBadge: boolean;
  showHiddenSuggestionBadge: boolean;
  suggestionLabel: string;
  variationProgress: ShowcaseVariationProgress[];
  linkedRelationItems: ShowcaseRelationItem[];
  relatedRelationItems: ShowcaseRelationItem[];
  maxContributionAmount: number;
  /** Unclaimed linked peers for a single "Claim these items?" prompt. */
  linkedClaimPeers?: Item[];
  wishlistItemsForLinkedClaim?: Item[];
  onLinkedClaimItemClick?: (itemId: string) => void;
}
