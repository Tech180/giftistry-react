import { useEffect, useMemo, useState } from 'react';
import { useToast } from 'shared/providers/toast';
import { getSiteName } from 'shared/utils/get-site-name.util';
import {
  getMetadataDisplayEntries,
  getUserDefinedEntries,
} from 'shared/utils/item-custom-fields.util';
import { METADATA_BADGE_EMOJI } from 'shared/constants/metadata-badge-emoji.constant';
import {
  getItemFavoriteFlag,
  parseItemDescription,
} from 'shared/utils/parse-item-description.util';
import type { ClaimerSubstitutionAction } from '../../../interfaces/claimer-substitution-action.interface';
import { useItemsSession } from '../../../providers/session';
import {
  buildShowcaseRelationItems,
  buildShowcaseVariationProgress,
  formatShowcaseBestPrice,
  formatShowcaseDisplayCategory,
  formatShowcaseQuantityProgressMetric,
  formatShowcaseSuggestionLabel,
  resolveShowcaseHasNumericPriority,
} from '../../../utils/build-item-showcase-display.util';
import { formatItemAsGiftistryMarkdown } from '../../../utils/format-item-as-giftistry-markdown.util';
import { formatAudienceLabel, isPrivateItem } from '../../../utils/item-audience.util';
import { getCategoryMeta } from '../../../utils/get-category-meta.util';
import { hasUnclaimedLinkedItems } from '../../../utils/has-unclaimed-linked-items.util';
import { getItemPrimaryImageUrl } from '../../../utils/item-primary-image.util';
import {
  isItemGroupFundingActive,
  isItemGroupFundingInProgress,
  resolveItemFundingSnapshot,
} from '../../../utils/is-item-group-funding-active.util';
import { resolveCanEditItem } from '../../../utils/resolve-can-edit-item.util';
import { resolveClaimerSubstitutionAction } from '../../../utils/resolve-claimer-substitution-action.util';
import { resolveCurrentUserClaimIsAnonymous } from '../../../utils/resolve-current-user-claim-is-anonymous.util';
import { resolveDisplayItem } from '../../../utils/resolve-display-item.util';
import { resolveDisplayVariant } from '../../../utils/resolve-display-variant.util';
import { resolveDisplayItemFullyClaimed } from '../../../utils/resolve-item-section-fully-claimed.util';
import { resolveLinkedItems } from '../../../utils/item-links-sync.util';
import { resolveRelatedItems } from '../../../utils/item-related-sync.util';
import { itemNeedsClaimQuantityUi } from '../../../utils/resolve-claim-quantity-lines.util';
import { resolveItemQuantitySummary } from '../../../utils/resolve-item-quantity.util';
import { hasLinkedUnclaimPeers } from '../../../utils/resolve-linked-unclaim-peers.util';
import { resolveSectionFooterActions } from '../../../utils/resolve-section-footer-actions.util';
import { resolveSuggestedByDisplayName } from '../../../utils/resolve-suggested-by-display-name.util';
import { resolveSubstitutionGroupClaimChrome } from '../../../utils/resolve-substitution-group-claim-chrome.util';
import { linkGroupSupportsLinkedItems } from '../../../utils/item-supports-linked-items.util';
import {
  getClaimedGrayOutClass,
  getGroupFundingInProgressClass,
  getUserClaimedHighlightClass,
} from '../../views/utils/item-card-modifiers.util';
import type { Props } from '../interfaces/props.interface';
import type { TemplateProps } from '../interfaces/template-props.interface';
import styles from '../showcase.module.css';

export function useShowcase({
  item,
  priorityLabel: _priorityLabel,
  isOwner,
  isExpired = false,
  isArchived = false,
  canCollaborate,
  isPublicGuest = false,
  allowGroupFunds,
  itemActions,
  onEdit,
  onAddSubstitution,
  onEditSubstitution,
  onDeleteSubstitution,
  onEditSubstitutionOption,
  onDeleteSubstitutionOption,
  onClose,
  wishlistItems = [],
  aiEnabled,
  variant = 'card',
  onLinkedItemNavigate,
  onLinkedItemsUnsupported,
}: Props): TemplateProps {
  void _priorityLabel;
  void aiEnabled;

  const { user } = useItemsSession();
  const { showToast } = useToast();
  const [substitutionBrowseIndex, setSubstitutionBrowseIndex] = useState<number | undefined>(
    undefined
  );

  const activeSubstitution = useMemo(
    () =>
      resolveDisplayVariant(item, item.SubstitutionOptions, user?.Id, substitutionBrowseIndex),
    [item, user?.Id, substitutionBrowseIndex]
  );

  const displayItem = useMemo(
    () => resolveDisplayItem(item, activeSubstitution),
    [item, activeSubstitution]
  );

  const claims = displayItem.Claims ?? [];
  const canEditItem = resolveCanEditItem(item, user?.Id, canCollaborate, isPublicGuest);

  const [anonymous, setAnonymous] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [showClaimForm, setShowClaimFormState] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(false);

  const linkedClaimPeers = useMemo(() => {
    if (!hasUnclaimedLinkedItems(item, wishlistItems)) {
      return [];
    }
    return resolveLinkedItems(item, wishlistItems).filter((peer) => !peer.IsClaimed);
  }, [item, wishlistItems]);

  const linkedUnclaim = useMemo(
    () => hasLinkedUnclaimPeers(item, wishlistItems, user?.Id),
    [item, wishlistItems, user?.Id]
  );

  const setShowClaimForm = (open: boolean) => {
    if (open) {
      if (
        linkedClaimPeers.length > 0 &&
        !linkGroupSupportsLinkedItems(item, linkedClaimPeers)
      ) {
        onLinkedItemsUnsupported?.();
        return;
      }
      setAnonymous(resolveCurrentUserClaimIsAnonymous(claims, user?.Id));
    }
    setShowClaimFormState(open);
  };

  const { text: displayDescription, metadata } = useMemo(
    () => parseItemDescription(displayItem.Description, displayItem.Metadata),
    [displayItem.Description, displayItem.Metadata]
  );

  const userDefinedEntries = useMemo(() => getUserDefinedEntries(metadata), [metadata]);

  const predefinedEntries = useMemo(() => {
    const userNames = new Set(userDefinedEntries.map((entry) => entry.name));
    return getMetadataDisplayEntries(metadata)
      .filter((entry) => !userNames.has(entry.label))
      .map((entry) => ({
        label: entry.label,
        value: entry.value,
        emoji: METADATA_BADGE_EMOJI[entry.label],
      }));
  }, [metadata, userDefinedEntries]);

  useEffect(() => {
    setLocalIsFavorite(getItemFavoriteFlag(item.Description, item.Metadata));
  }, [item.Description, item.Metadata]);

  const claimActorName = user
    ? `${user.FirstName} ${user.LastName}`.trim() || user.Username
    : null;

  const handleUnclaim = async () => {
    setClaimLoading(true);
    try {
      await itemActions.unclaimItem(displayItem.Id, user?.Id, linkedUnclaim);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to unclaim item');
    } finally {
      setClaimLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await itemActions.deleteItem(item.Id);
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete item.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const { fundingTarget: totalExtractedPrice, totalClaimedAmount } =
    resolveItemFundingSnapshot(displayItem);

  const quantitySummary = resolveItemQuantitySummary(displayItem, metadata);
  const canAdjustClaim = itemNeedsClaimQuantityUi(item, metadata);
  const isMultiCount = quantitySummary.isMultiCount;
  const totalClaimedQty = quantitySummary.claimedQuantity;
  const desiredQtyVal = quantitySummary.desiredQuantity;

  const activeIsFullyClaimed = resolveDisplayItemFullyClaimed(
    displayItem,
    allowGroupFunds,
    metadata
  );

  const groupClaimChrome = resolveSubstitutionGroupClaimChrome({
    parent: item,
    options: item.SubstitutionOptions,
    active: activeSubstitution,
    userId: user?.Id,
    allowGroupFunds,
  });

  const claimedByCurrentUser = groupClaimChrome.claimedByCurrentUser;
  const isFullyClaimed =
    activeIsFullyClaimed || groupClaimChrome.isFullyClaimedForChrome;
  const hasVisibleClaimForGray = groupClaimChrome.hasVisibleClaimForGray;
  const isClaimUnavailable =
    !claimedByCurrentUser &&
    (groupClaimChrome.isUnavailableDueToSiblingClaim ||
      (isFullyClaimed && !activeIsFullyClaimed));

  const progressPercent = isMultiCount
    ? Math.min(100, Math.round((totalClaimedQty / desiredQtyVal) * 100))
    : totalExtractedPrice > 0
      ? Math.min(100, Math.round((totalClaimedAmount / totalExtractedPrice) * 100))
      : 0;

  const audienceLabel = formatAudienceLabel(
    item.SharedWith,
    user?.Id,
    isOwner,
    item.SuggestedByUserId
  );
  const isPrivate = isPrivateItem(item, user?.Id);
  const linkedItems = useMemo(
    () => resolveLinkedItems(item, wishlistItems),
    [item, wishlistItems]
  );
  const relatedItems = useMemo(
    () => resolveRelatedItems(item, wishlistItems),
    [item, wishlistItems]
  );
  const categoryMeta = useMemo(() => getCategoryMeta(item.Category), [item.Category]);

  const isLinkedToItems = linkedItems.length > 0;
  const isRelatedToItems = relatedItems.length > 0;
  const hasNumericPriority = resolveShowcaseHasNumericPriority(item.Priority);
  const quantityProgressMetric = formatShowcaseQuantityProgressMetric(
    progressPercent,
    totalClaimedQty,
    desiredQtyVal
  );
  const displayCategory = formatShowcaseDisplayCategory(categoryMeta.label, item);
  const bestPriceDisplay = formatShowcaseBestPrice(totalExtractedPrice);
  const variationProgress = useMemo(
    () => buildShowcaseVariationProgress(item, metadata),
    [item, metadata]
  );
  const linkedRelationItems = useMemo(
    () => buildShowcaseRelationItems(linkedItems),
    [linkedItems]
  );
  const relatedRelationItems = useMemo(
    () => buildShowcaseRelationItems(relatedItems),
    [relatedItems]
  );
  const showSuggestionBadge = !!item.IsSuggestion;
  const showHiddenSuggestionBadge = !!(item.IsHiddenIdea && !item.IsSuggestion);
  const suggestionLabel = formatShowcaseSuggestionLabel(resolveSuggestedByDisplayName(item));
  const showHeroMeta =
    showSuggestionBadge || showHiddenSuggestionBadge || !!audienceLabel || localIsFavorite;
  const showGroupFunding =
    !canAdjustClaim &&
    isItemGroupFundingActive({
      allowGroupFunds,
      fundingTarget: totalExtractedPrice,
      totalClaimedAmount,
    });
  const showQuantityProgress = isMultiCount;
  const showVariationsProgress = variationProgress.length > 0;

  const claimerSubstitutionEligibility = resolveClaimerSubstitutionAction({
    item,
    userId: user?.Id,
    canCollaborate,
    isPublicGuest,
  });

  const sectionFooter = resolveSectionFooterActions({
    active: activeSubstitution,
    canEditItem,
    claimerEligibility: claimerSubstitutionEligibility,
    activeSectionFullyClaimed: activeIsFullyClaimed,
  });

  const activeBrowseOption =
    activeSubstitution.kind !== 'original' ? (activeSubstitution.option ?? null) : null;

  const footerCanEditItem = activeBrowseOption
    ? canEditItem && !!onEditSubstitutionOption
    : sectionFooter.showParentEditDelete && canEditItem;

  const footerOnEdit = activeBrowseOption
    ? onEditSubstitutionOption
      ? () => onEditSubstitutionOption(activeBrowseOption)
      : undefined
    : sectionFooter.showParentEditDelete
      ? onEdit
      : undefined;

  const handleFooterDelete = async () => {
    if (activeBrowseOption && onDeleteSubstitutionOption) {
      setDeleteLoading(true);
      try {
        await onDeleteSubstitutionOption(activeBrowseOption);
        setShowDeleteConfirm(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete substitution.');
      } finally {
        setDeleteLoading(false);
      }
      return;
    }
    await handleDelete();
  };

  const substitutionAction: ClaimerSubstitutionAction | null = (() => {
    const surface = sectionFooter.substitutionSurface;
    if (!surface) return null;
    if (surface.mode === 'manage') {
      if (!onEditSubstitution) return null;
      return {
        mode: 'manage',
        allowSubstitutions: surface.allowSubstitutions,
        onRequest: onEditSubstitution,
        onDelete: onDeleteSubstitution,
        ownOption: surface.ownOption,
      };
    }
    if (!onAddSubstitution) return null;
    return {
      mode: 'create',
      allowSubstitutions: surface.allowSubstitutions,
      onRequest: onAddSubstitution,
    };
  })();

  const primaryImageUrl = getItemPrimaryImageUrl(displayItem);
  const isGroupFundingInProgress = isItemGroupFundingInProgress({
    allowGroupFunds,
    fundingTarget: totalExtractedPrice,
    totalClaimedAmount,
    isFullyClaimed,
  });
  const claimChromeClass = [
    getClaimedGrayOutClass(
      isFullyClaimed,
      hasVisibleClaimForGray,
      claimedByCurrentUser,
      styles,
      isArchived,
      isMultiCount,
      isGroupFundingInProgress
    ),
    getGroupFundingInProgressClass(isGroupFundingInProgress, styles),
    getUserClaimedHighlightClass(claimedByCurrentUser, styles),
  ]
    .filter(Boolean)
    .join(' ');
  const rootClassName = [
    variant === 'inline' ? styles['showcase-inline'] : styles['showcase-card'],
    isPrivate ? styles['private-item'] : '',
    isArchived ? styles['archived-item'] : '',
    claimChromeClass,
  ]
    .filter(Boolean)
    .join(' ');
  const audienceBadgeClassName = [
    styles['audience-badge'],
    isPrivate ? styles['private-audience-badge'] : '',
  ]
    .filter(Boolean)
    .join(' ');
  const substitutionManageIconClassName =
    substitutionAction?.mode === 'manage' ? styles['claim-icon-btn'] : undefined;

  return {
    item,
    displayItem,
    substitutionOptions: item.SubstitutionOptions,
    substitutionActiveIndex: substitutionBrowseIndex,
    onSubstitutionIndexChange: setSubstitutionBrowseIndex,
    claimUserId: user?.Id ?? null,
    isOwner,
    localIsFavorite,
    displayDescription: displayDescription || '',
    metadata,
    predefinedEntries,
    userDefinedEntries,
    totalExtractedPrice,
    totalClaimedAmount,
    progressPercent,
    onClose,
    onCopyMarkdown: async () => {
      try {
        await navigator.clipboard.writeText(formatItemAsGiftistryMarkdown(displayItem));
        showToast('Copied to clipboard', 'success');
      } catch {
        showToast('Could not copy to clipboard', 'error');
      }
    },
    getSiteName,
    audienceLabel,
    variant,
    displayCategory,
    bestPriceDisplay,
    quantityProgressMetric,
    hasNumericPriority,
    priorityDisplay: hasNumericPriority ? (item.Priority as number) : null,
    isLinkedToItems,
    isRelatedToItems,
    showGroupFunding,
    showQuantityProgress,
    showVariationsProgress,
    showHeroMeta,
    showSuggestionBadge,
    showHiddenSuggestionBadge,
    suggestionLabel,
    variationProgress,
    linkedRelationItems,
    relatedRelationItems,
    primaryImageUrl,
    rootClassName,
    audienceBadgeClassName,
    claimFooter: {
      isArchived,
      isExpired,
      isPublicGuest,
      canCollaborate,
      canEditItem: footerCanEditItem,
      canAdjustClaim,
      claimedByCurrentUser,
      isFullyClaimed,
      isClaimUnavailable,
      claimLoading,
      showClaimForm,
      setShowClaimForm,
      handleUnclaim,
      substitutionAction,
      substitutionManageIconClassName,
      displayItem,
      metadata,
      claimUserId: user?.Id ?? null,
      claimActorName,
      itemActions,
      anonymous,
      setAnonymous,
      linkedClaimPeers,
      wishlistItemsForLinkedClaim: wishlistItems,
      onLinkedClaimItemClick: (itemId) => onLinkedItemNavigate?.(itemId, item.Id),
      allowGroupFunds,
      totalExtractedPrice,
      totalClaimedAmount,
      onEdit: footerOnEdit,
      showDeleteConfirm,
      setShowDeleteConfirm,
      deleteLoading,
      handleDelete:
        activeBrowseOption
          ? onDeleteSubstitutionOption
            ? handleFooterDelete
            : () => undefined
          : sectionFooter.showParentEditDelete
            ? handleFooterDelete
            : () => undefined,
    },
  };
}
