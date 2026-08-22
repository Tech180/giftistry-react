import React, { useState, useEffect, useMemo } from 'react';
// Future: AI item reviews — re-enable with getItemReviews fetch below
// import { itemsApi } from '../../api/items.api';
import { useAuth } from 'app/providers/auth-context';
import { ItemShowcaseProps } from '../../interfaces/item-showcase-props.interface';
import { ItemShowcaseTemplate } from './item-showcase.html';
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
import type { ClaimQuantityDraft } from '../../interfaces/claim-quantity-draft.interface';
import { buildClaimMutations } from '../../utils/build-claim-mutations.util';
import {
  itemNeedsClaimQuantityUi,
  resolveClaimQuantityLines,
} from '../../utils/resolve-claim-quantity-lines.util';
import { resolveItemQuantitySummary } from '../../utils/resolve-item-quantity.util';
import { submitClaimDraft } from '../../utils/submit-claim-draft.util';
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
  onClose,
  wishlistItems = [],
  aiEnabled,
  variant = 'card',
}) => {
  const { user } = useAuth();
  const claims = item.Claims ?? [];
  const claimedByCurrentUser = !!(user && claims.some(c => c.UserId === user.Id));
  const canEditItem = resolveCanEditItem(item, user?.Id, isOwner, isPublicGuest);

  const [claimAmount, setClaimAmount] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [showClaimForm, setShowClaimFormState] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(false);

  const setShowClaimForm = (open: boolean) => {
    if (open) {
      setAnonymous(resolveCurrentUserClaimIsAnonymous(claims, user?.Id));
    }
    setShowClaimFormState(open);
  };

  // Future: AI item reviews — disabled for now (avoid /reviews AI work).
  void aiEnabled;

  const [showDependencyModal, setShowDependencyModal] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<ClaimQuantityDraft[] | null>(null);

  const { text: displayDescription, metadata } = useMemo(
    () => parseItemDescription(item.Description, item.Metadata),
    [item.Description, item.Metadata]
  );

  const userDefinedEntries = useMemo(
    () => getUserDefinedEntries(metadata),
    [metadata]
  );

  const predefinedDisplayEntries = useMemo(() => {
    const userNames = new Set(userDefinedEntries.map((entry) => entry.name));
    return getMetadataDisplayEntries(metadata).filter(
      (entry) => !userNames.has(entry.label)
    );
  }, [metadata, userDefinedEntries]);

  useEffect(() => {
    setLocalIsFavorite(getItemFavoriteFlag(item.Description, item.Metadata));
  }, [item.Description, item.Metadata]);

  // Future: AI item reviews — disabled for now (avoid /reviews AI work).
  // useEffect(() => {
  //   let active = true;
  //   const fetchReviews = async () => {
  //     if (!canShowAi || !aiEnabled || !item.Links || item.Links.length === 0) {
  //       setReviews(null);
  //       setReviewsError(null);
  //       return;
  //     }
  //
  //     setReviewsLoading(true);
  //     setReviewsError(null);
  //     try {
  //       const response = await itemsApi.getItemReviews(item.Id);
  //       if (active) {
  //         if (response) {
  //           setReviews({
  //             summary: response.Summary,
  //             pros: response.Pros,
  //             cons: response.Cons,
  //             reviews: response.Reviews,
  //           });
  //         } else {
  //           setReviews(null);
  //         }
  //       }
  //     } catch (err: any) {
  //       if (active) {
  //         setReviewsError(err.message || 'Failed to load AI reviews');
  //       }
  //     } finally {
  //       if (active) {
  //         setReviewsLoading(false);
  //       }
  //     }
  //   };
  //   fetchReviews();
  //   return () => {
  //     active = false;
  //   };
  // }, [item.Id, canShowAi, aiEnabled, item.Links]);

  const claimActorName = user
    ? `${user.FirstName} ${user.LastName}`.trim() || user.Username
    : null;

  const hasUnclaimedLinkedItems = () => {
    const linkedIds = metadata?.LinkedItemIds || [];
    return (
      linkedIds.length > 0 &&
      wishlistItems.some((wishlistItem) => linkedIds.includes(wishlistItem.Id) && !wishlistItem.IsClaimed)
    );
  };

  const submitQuantityDraft = async (
    draft: ClaimQuantityDraft[],
    includeLinked?: boolean
  ) => {
    const lines = resolveClaimQuantityLines(item, metadata, user?.Id);
    const plan = buildClaimMutations({
      itemId: item.Id,
      lines,
      draft,
      claimedByName: anonymous ? null : claimActorName,
      anonymous,
      includeLinked,
    });
    await submitClaimDraft({
      itemId: item.Id,
      userId: user?.Id,
      plan,
      itemActions,
    });
  };

  const handleClaim = async (e?: React.SyntheticEvent, skipLinkedCheck = false) => {
    if (e) e.preventDefault();

    if (pendingDraft) {
      setClaimLoading(true);
      try {
        await submitQuantityDraft(pendingDraft, false);
        setPendingDraft(null);
        setClaimAmount('');
        setAnonymous(false);
        setShowClaimForm(false);
        setShowDependencyModal(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to claim item');
      } finally {
        setClaimLoading(false);
      }
      return;
    }

    if (hasUnclaimedLinkedItems() && !skipLinkedCheck) {
      setShowDependencyModal(true);
      return;
    }

    setClaimLoading(true);
    try {
      const amount = claimAmount ? parseFloat(claimAmount) : null;
      await itemActions.claimItem({
        itemId: item.Id,
        amount,
        claimedByName: anonymous ? null : claimActorName,
        anonymous,
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

  const handleBulkClaim = async () => {
    setClaimLoading(true);
    setShowDependencyModal(false);
    try {
      if (pendingDraft) {
        await submitQuantityDraft(pendingDraft, true);
        setPendingDraft(null);
      } else {
        const amount = claimAmount ? parseFloat(claimAmount) : null;
        await itemActions.claimItem({
          itemId: item.Id,
          amount,
          claimedByName: anonymous ? null : claimActorName,
          anonymous,
          includeLinked: true,
        });
      }
      setClaimAmount('');
      setAnonymous(false);
      setShowClaimForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to claim linked items');
    } finally {
      setClaimLoading(false);
    }
  };

  const onBeforeClaimSubmit = (draft: ClaimQuantityDraft[]) => {
    if (hasUnclaimedLinkedItems()) {
      setPendingDraft(draft);
      setShowDependencyModal(true);
      return false;
    }
    return true;
  };

  const handleUnclaim = async () => {
    setClaimLoading(true);
    try {
      await itemActions.unclaimItem(item.Id, user?.Id);
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

  // Group funding & Multi-count calculations — prefer server claim summaries
  const totalExtractedPrice =
    item.FundingTarget != null
      ? item.FundingTarget
      : item.Links.reduce((acc, link) => Math.max(acc, link.ExtractedPrice || 0), 0);

  const totalClaimedAmount =
    item.TotalClaimedAmount != null
      ? item.TotalClaimedAmount
      : claims.reduce((acc, claim) => acc + (claim.Amount || 0), 0);

  const quantitySummary = resolveItemQuantitySummary(item, metadata);
  const canAdjustClaim = itemNeedsClaimQuantityUi(item, metadata);
  const isMultiCount = quantitySummary.isMultiCount;
  const totalClaimedQty = quantitySummary.claimedQuantity;
  const desiredQtyVal = quantitySummary.desiredQuantity;

  const isFullyClaimed =
    item.IsFullyClaimed != null
      ? item.IsFullyClaimed
      : isMultiCount
        ? totalClaimedQty >= desiredQtyVal
        : (allowGroupFunds && totalExtractedPrice > 0
          ? totalClaimedAmount >= totalExtractedPrice
          : item.IsClaimed);

  const progressPercent = isMultiCount
    ? Math.min(100, Math.round((totalClaimedQty / desiredQtyVal) * 100))
    : (totalExtractedPrice > 0
      ? Math.min(100, Math.round((totalClaimedAmount / totalExtractedPrice) * 100))
      : 0);

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
  const suggestionLabel = formatShowcaseSuggestionLabel(item.SuggestedByUsername);
  const showHeroMeta =
    showSuggestionBadge || showHiddenSuggestionBadge || !!audienceLabel || localIsFavorite;
  const showGroupFunding = !canAdjustClaim && allowGroupFunds && totalExtractedPrice > 0;
  const showQuantityProgress = isMultiCount;
  const showVariationsProgress = variationProgress.length > 0;

  return (
    <ItemShowcaseTemplate
      item={item}
      isOwner={isOwner}
      canCollaborate={canCollaborate}
      isPublicGuest={isPublicGuest}
      canEditItem={canEditItem}
      isArchived={isArchived}
      isExpired={isExpired}
      allowGroupFunds={allowGroupFunds}
      claimedByCurrentUser={claimedByCurrentUser}
      canAdjustClaim={canAdjustClaim}
      itemActions={itemActions}
      claimUserId={user?.Id ?? null}
      claimActorName={claimActorName}
      onBeforeClaimSubmit={onBeforeClaimSubmit}
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
      showDependencyModal={showDependencyModal}
      setShowDependencyModal={(open) => {
        setShowDependencyModal(open);
        if (!open) {
          setPendingDraft(null);
        }
      }}
      displayDescription={displayDescription || ''}
      metadata={metadata}
      predefinedDisplayEntries={predefinedDisplayEntries}
      userDefinedEntries={userDefinedEntries}
      metadataBadgeEmoji={METADATA_BADGE_EMOJI}
      handleClaim={handleClaim}
      handleBulkClaim={handleBulkClaim}
      handleUnclaim={handleUnclaim}
      handleDelete={handleDelete}
      totalExtractedPrice={totalExtractedPrice}
      totalClaimedAmount={totalClaimedAmount}
      isMultiCount={isMultiCount}
      isFullyClaimed={isFullyClaimed}
      progressPercent={progressPercent}
      onClose={onClose}
      onEdit={onEdit}
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
    />
  );
};
