import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from 'app/providers/auth-context';
import { useToast } from 'app/providers/toast-context';
import { ItemShowcaseProps } from '../../interfaces/item-showcase-props.interface';
import { ItemShowcaseTemplate } from './item-showcase.html';
import { formatItemAsGiftistryMarkdown } from '../../utils/format-item-as-giftistry-markdown.util';
import { getSiteName } from 'shared/utils/get-site-name.util';
import {
  getItemFavoriteFlag,
  parseItemDescription,
} from 'shared/utils/parse-item-description.util';
import {
  getMetadataDisplayEntries,
  getUserDefinedEntries,
  METADATA_BADGE_EMOJI,
} from 'shared/utils/item-custom-fields.util';
import { formatAudienceLabel, isPrivateItem } from '../../utils/item-audience.util';
import { resolveLinkedItems } from '../../utils/item-links-sync.util';
import { resolveRelatedItems } from '../../utils/item-related-sync.util';
import { getCategoryMeta } from '../card/category-icons';
import {
  itemNeedsClaimQuantityUi,
} from '../../utils/resolve-claim-quantity-lines.util';
import { resolveItemQuantitySummary } from '../../utils/resolve-item-quantity.util';
import { isItemGroupFundingActive, resolveItemFundingSnapshot } from '../../utils/is-item-group-funding-active.util';
import {
  buildShowcaseRelationItems,
  buildShowcaseVariationProgress,
  formatShowcaseBestPrice,
  formatShowcaseDisplayCategory,
  formatShowcaseQuantityProgressMetric,
  formatShowcaseStatusLabel,
  formatShowcaseSuggestionLabel,
  resolveShowcaseHasNumericPriority,
} from '../../utils/build-item-showcase-display.util';
import { resolveCurrentUserClaimIsAnonymous } from '../../utils/resolve-current-user-claim-is-anonymous.util';
import { resolveCanEditItem } from '../../utils/resolve-can-edit-item.util';
import { resolveSuggestedByDisplayName } from '../../utils/resolve-suggested-by-display-name.util';
import { hasUnclaimedLinkedItems } from '../../utils/has-unclaimed-linked-items.util';
import { hasLinkedUnclaimPeers } from '../../utils/resolve-linked-unclaim-peers.util';
import { linkGroupSupportsLinkedItems } from '../../utils/item-supports-linked-items.util';
import { resolveDisplayVariant } from '../../utils/resolve-display-variant.util';
import { resolveDisplayItem } from '../../utils/resolve-display-item.util';
import { resolveClaimerSubstitutionAction } from '../../utils/resolve-claimer-substitution-action.util';
import { resolveSectionFooterActions } from '../../utils/resolve-section-footer-actions.util';
import { resolveSubstitutionGroupClaimChrome } from '../../utils/resolve-substitution-group-claim-chrome.util';
import { resolveDisplayItemFullyClaimed } from '../../utils/resolve-item-section-fully-claimed.util';
import type { ClaimerSubstitutionAction } from '../../interfaces/claimer-substitution-action.interface';

export const ItemShowcase: React.FC<ItemShowcaseProps> = ({
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
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [substitutionBrowseIndex, setSubstitutionBrowseIndex] = useState<number | undefined>(
    undefined
  );

  const activeSubstitution = useMemo(
    () =>
      resolveDisplayVariant(
        item,
        item.SubstitutionOptions,
        user?.Id,
        substitutionBrowseIndex
      ),
    [item, user?.Id, substitutionBrowseIndex]
  );

  const displayItem = useMemo(
    () => resolveDisplayItem(item, activeSubstitution),
    [item, activeSubstitution]
  );

  const claims = displayItem.Claims ?? [];
  const canEditItem = resolveCanEditItem(item, user?.Id, isOwner, isPublicGuest);

  const [claimAmount, setClaimAmount] = useState('');
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

  void aiEnabled;

  const { text: displayDescription, metadata } = useMemo(
    () => parseItemDescription(displayItem.Description, displayItem.Metadata),
    [displayItem.Description, displayItem.Metadata]
  );

  const userDefinedEntries = useMemo(() => getUserDefinedEntries(metadata), [metadata]);

  const predefinedDisplayEntries = useMemo(() => {
    const userNames = new Set(userDefinedEntries.map((entry) => entry.name));
    return getMetadataDisplayEntries(metadata).filter((entry) => !userNames.has(entry.label));
  }, [metadata, userDefinedEntries]);

  useEffect(() => {
    setLocalIsFavorite(getItemFavoriteFlag(item.Description, item.Metadata));
  }, [item.Description, item.Metadata]);

  const claimActorName = user
    ? `${user.FirstName} ${user.LastName}`.trim() || user.Username
    : null;

  const handleClaim = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (
      linkedClaimPeers.length > 0 &&
      !linkGroupSupportsLinkedItems(item, linkedClaimPeers)
    ) {
      onLinkedItemsUnsupported?.();
      return;
    }
    setClaimLoading(true);
    try {
      const amount = claimAmount ? parseFloat(claimAmount) : null;
      await itemActions.claimItem({
        itemId: displayItem.Id,
        amount,
        claimedByName: anonymous ? null : claimActorName,
        anonymous,
        includeLinked: linkedClaimPeers.length > 0,
      });
      setClaimAmount('');
      setAnonymous(false);
      setShowClaimForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to claim item');
    } finally {
      setClaimLoading(false);
    }
  };

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
  const statusLabel = formatShowcaseStatusLabel(isFullyClaimed, claimedByCurrentUser);
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
    isOwner,
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

  const footerCanEditItem =
    !!activeBrowseOption
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

  return (
    <ItemShowcaseTemplate
      item={item}
      displayItem={displayItem}
      substitutionOptions={item.SubstitutionOptions}
      substitutionActiveIndex={substitutionBrowseIndex}
      onSubstitutionIndexChange={setSubstitutionBrowseIndex}
      substitutionAction={substitutionAction}
      isOwner={isOwner}
      canCollaborate={canCollaborate}
      isPublicGuest={isPublicGuest}
      canEditItem={footerCanEditItem}
      isArchived={isArchived}
      isExpired={isExpired}
      allowGroupFunds={allowGroupFunds}
      claimedByCurrentUser={claimedByCurrentUser}
      canAdjustClaim={canAdjustClaim}
      itemActions={itemActions}
      claimUserId={user?.Id ?? null}
      claimActorName={claimActorName}
      claimAmount={claimAmount}
      setClaimAmount={setClaimAmount}
      anonymous={anonymous}
      setAnonymous={setAnonymous}
      claimLoading={claimLoading}
      showClaimForm={showClaimForm}
      setShowClaimForm={setShowClaimForm}
      showDeleteConfirm={showDeleteConfirm}
      setShowDeleteConfirm={setShowDeleteConfirm}
      deleteLoading={deleteLoading}
      localIsFavorite={localIsFavorite}
      displayDescription={displayDescription || ''}
      metadata={metadata}
      predefinedDisplayEntries={predefinedDisplayEntries}
      userDefinedEntries={userDefinedEntries}
      metadataBadgeEmoji={METADATA_BADGE_EMOJI}
      handleClaim={handleClaim}
      handleUnclaim={handleUnclaim}
      handleDelete={
        activeBrowseOption
          ? onDeleteSubstitutionOption
            ? handleFooterDelete
            : () => undefined
          : sectionFooter.showParentEditDelete
            ? handleFooterDelete
            : () => undefined
      }
      totalExtractedPrice={totalExtractedPrice}
      totalClaimedAmount={totalClaimedAmount}
      isMultiCount={isMultiCount}
      isFullyClaimed={isFullyClaimed}
      hasVisibleClaimForGray={hasVisibleClaimForGray}
      isClaimUnavailable={isClaimUnavailable}
      progressPercent={progressPercent}
      onClose={onClose}
      onCopyMarkdown={async () => {
        try {
          await navigator.clipboard.writeText(formatItemAsGiftistryMarkdown(displayItem));
          showToast('Copied to clipboard', 'success');
        } catch {
          showToast('Could not copy to clipboard', 'error');
        }
      }}
      onEdit={footerOnEdit}
      getSiteName={getSiteName}
      audienceLabel={audienceLabel}
      isPrivate={isPrivate}
      variant={variant}
      CategoryIcon={categoryMeta.icon}
      displayCategory={displayCategory}
      bestPriceDisplay={bestPriceDisplay}
      statusLabel={statusLabel}
      quantityProgressMetric={quantityProgressMetric}
      hasNumericPriority={hasNumericPriority}
      priorityDisplay={hasNumericPriority ? (item.Priority as number) : null}
      isLinkedToItems={isLinkedToItems}
      isRelatedToItems={isRelatedToItems}
      showGroupFunding={showGroupFunding}
      showQuantityProgress={showQuantityProgress}
      showVariationsProgress={showVariationsProgress}
      showHeroMeta={showHeroMeta}
      showSuggestionBadge={showSuggestionBadge}
      showHiddenSuggestionBadge={showHiddenSuggestionBadge}
      suggestionLabel={suggestionLabel}
      variationProgress={variationProgress}
      linkedRelationItems={linkedRelationItems}
      relatedRelationItems={relatedRelationItems}
      maxContributionAmount={Math.max(0, totalExtractedPrice - totalClaimedAmount)}
      linkedClaimPeers={linkedClaimPeers}
      wishlistItemsForLinkedClaim={wishlistItems}
      onLinkedClaimItemClick={(itemId) => onLinkedItemNavigate?.(itemId, item.Id)}
    />
  );
};
