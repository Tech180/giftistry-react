import React from 'react';
import { Item } from './item.interface';
import type { ItemActions } from './item-actions.interface';
import type { ClaimerSubstitutionAction } from './claimer-substitution-action.interface';
import type { ItemSubstitutionOption } from './item-substitution.interface';

export interface ItemCardTemplateProps {
  item: Item;
  /** Visual variant currently shown (parent or a substitution child overlay). Defaults to `item`. */
  displayItem?: Item;
  substitutionOptions?: ItemSubstitutionOption[];
  substitutionActiveIndex?: number;
  onSubstitutionIndexChange?: (index: number) => void;
  /** Claimer custom substitution footer action. */
  substitutionAction?: ClaimerSubstitutionAction | null;
  isOwner: boolean;
  isExpired: boolean;
  isArchived?: boolean;
  canCollaborate: boolean;
  isPublicGuest?: boolean;
  canEditItem?: boolean;
  allowGroupFunds: boolean;
  isFullyClaimed: boolean;
  isMultiCount: boolean;
  /**
   * Group-aware visible claim for gray-out (active section or a claimed sibling).
   * Badge text still uses displayItem claims.
   */
  hasVisibleClaimForGray?: boolean;
  /**
   * True when this browse section is locked because a sibling was claimed
   * (button label: Unavailable rather than Claimed).
   */
  isClaimUnavailable?: boolean;
  totalExtractedPrice: number;
  totalClaimedAmount: number;
  priorityLabel?: string;
  
  // Link State/Handlers
  urlInput: string;
  setUrlInput: (val: string) => void;
  showAddLink: boolean;
  setShowAddLink: (val: boolean) => void;
  linkLoading: boolean;
  handleAddLink: (e: React.SubmitEvent<HTMLFormElement>) => void;

  // Claim State/Handlers
  showClaimForm: boolean;
  setShowClaimForm: (val: boolean) => void;
  claimAmount: string;
  setClaimAmount: (val: string) => void;
  claimedByName: string;
  setClaimedByName: (val: string) => void;
  anonymous: boolean;
  setAnonymous: (val: boolean) => void;
  claimLoading: boolean;
  handleClaim: (e?: React.SyntheticEvent<HTMLFormElement>) => void;
  canAdjustClaim?: boolean;
  itemActions?: ItemActions;
  claimUserId?: string | null;
  claimActorName?: string | null;
  /** Unclaimed linked peers for a single "Claim these items?" prompt. */
  linkedClaimPeers?: Item[];
  /** True when unclaim should clear the user's claims across the link group. */
  hasLinkedUnclaimPeers?: boolean;
  wishlistItemsForLinkedClaim?: Item[];
  onLinkedClaimItemClick?: (itemId: string) => void;

  // Delete State/Handlers
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (val: boolean) => void;
  deleteLoading: boolean;
  handleDelete: () => void;

  isFavorite: boolean;
  toggleFavorite: () => void;
  onEdit?: () => void;
  claimedByCurrentUser: boolean;
  handleUnclaim: () => void;
  isPinned: boolean;
  togglePin: (e: React.MouseEvent) => void;
  isTaggingModeActive?: boolean;
  isTaggedSelection?: boolean;
  onSelectTag?: () => void;
  viewMode?: import('../types/item-view-mode.type').ItemViewMode;
  isSelected?: boolean;
  onSelect?: () => void;
  /** Opens read-only View Item drawer (viewers / public guests). */
  onView?: () => void;
  isExpanded?: boolean;
  setIsExpanded?: (val: boolean) => void;
  displayDescription: string | null;
  metadata: Record<string, any> | null;
  predefinedDisplayEntries: { label: string; value: string }[];
  userDefinedEntries: { name: string; value: string }[];
  metadataBadgeEmoji: Record<string, string>;
  CategoryIcon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  displayCategoryBadge: boolean;
  categoryLabel: string;
  getSiteName: (url: string, retailerName?: string | null) => string;
  audienceLabel: string | null;
  isPrivate: boolean;
  linkedItems: Item[];
  relatedItems: Item[];
  isLinkingContext?: boolean;
  isRelatingContext?: boolean;
}
