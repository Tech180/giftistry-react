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
import {
  buildShowcaseRelationItems,
  buildShowcaseVariationProgress,
  formatShowcaseBestPrice,
  formatShowcaseDisplayCategory,
  formatShowcaseQuantityProgressMetric,
  formatShowcaseStatusLabel,
  formatShowcaseSuggestionLabel,
  resolveShowcaseHasNumericPriority,
  resolveShowcaseVariationOptions,
} from '../../utils/build-item-showcase-display.util';

export const ItemShowcase: React.FC<ItemShowcaseProps> = ({
  item,
  priorityLabel: _priorityLabel,
  isOwner,
  isExpired: _isExpired,
  isArchived = false,
  canCollaborate,
  allowGroupFunds,
  itemActions,
  onEdit,
  onClose,
  wishlistItems = [],
  aiEnabled,
  variant = 'card',
}) => {
  const { user } = useAuth();
  const claimedByCurrentUser = !!(user && item.Claims.some(c => c.UserId === user.Id));

  const [claimAmount, setClaimAmount] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(false);

  // Future: AI item reviews — disabled for now (avoid /reviews AI work).
  void aiEnabled;

  // Advanced States
  const [selectedVariation, setSelectedVariation] = useState('');
  const [claimQty, setClaimQty] = useState(1);
  const [showDependencyModal, setShowDependencyModal] = useState(false);

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
    if (metadata?.MultiCount && metadata.Variations && metadata.Variations.length > 0) {
      setSelectedVariation(metadata.Variations[0].Name);
    } else {
      setSelectedVariation('');
    }
    setClaimQty(1);
  }, [item, metadata]);

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

  const handleClaim = async (e?: React.SyntheticEvent, skipLinkedCheck = false) => {
    if (e) e.preventDefault();

    const linkedIds = metadata?.LinkedItemIds || [];
    const hasUnclaimedLinkedItems = linkedIds.length > 0 && wishlistItems.some(
      (wi: any) => linkedIds.includes(wi.Id) && !wi.IsClaimed
    );

    if (hasUnclaimedLinkedItems && !skipLinkedCheck) {
      setShowDependencyModal(true);
      return;
    }

    setClaimLoading(true);
    try {
      const amount = claimAmount ? parseFloat(claimAmount) : null;
      const finalSelection = metadata?.MultiCount ? selectedVariation : undefined;
      const finalQuantity = metadata?.MultiCount ? claimQty : undefined;
      const claimerName = anonymous ? null : (user ? `${user.FirstName} ${user.LastName}`.trim() || user.Username : null);

      await itemActions.claimItem({
        itemId: item.Id,
        amount,
        claimedByName: claimerName,
        anonymous,
        quantity: finalQuantity,
        selection: finalSelection,
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
      const amount = claimAmount ? parseFloat(claimAmount) : null;
      const finalSelection = metadata?.MultiCount ? selectedVariation : undefined;
      const finalQuantity = metadata?.MultiCount ? claimQty : undefined;
      const claimerName = anonymous ? null : (user ? `${user.FirstName} ${user.LastName}`.trim() || user.Username : null);

      await itemActions.claimItem({
        itemId: item.Id,
        amount,
        claimedByName: claimerName,
        anonymous,
        quantity: finalQuantity,
        selection: finalSelection,
        includeLinked: true,
      });

      setClaimAmount('');
      setAnonymous(false);
      setShowClaimForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to claim linked items');
    } finally {
      setClaimLoading(false);
    }
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
      : item.Claims.reduce((acc, claim) => acc + (claim.Amount || 0), 0);

  const isMultiCount =
    item.IsMultiCount != null ? item.IsMultiCount : !!(metadata && metadata.MultiCount);
  const totalClaimedQty =
    item.TotalClaimedQuantity != null
      ? item.TotalClaimedQuantity
      : item.Claims.reduce((acc, c) => acc + (c.Quantity || 1), 0);
  const desiredQtyVal =
    item.DesiredQuantity != null
      ? item.DesiredQuantity
      : (metadata && metadata.DesiredQuantity) || 1;

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
  const variationOptions = useMemo(
    () => resolveShowcaseVariationOptions(item, metadata),
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
  const showGroupFunding = !isMultiCount && allowGroupFunds && totalExtractedPrice > 0;
  const showQuantityProgress = isMultiCount;
  const showVariationsProgress = isMultiCount && variationProgress.length > 0;

  const onClaimQtyInputChange = (raw: string) => {
    setClaimQty(Math.max(1, parseInt(raw, 10) || 1));
  };

  return (
    <ItemShowcaseTemplate
      item={item}
      isOwner={isOwner}
      canCollaborate={canCollaborate}
      isArchived={isArchived}
      allowGroupFunds={allowGroupFunds}
      claimedByCurrentUser={claimedByCurrentUser}
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
      selectedVariation={selectedVariation}
      setSelectedVariation={setSelectedVariation}
      claimQty={claimQty}
      setClaimQty={setClaimQty}
      onClaimQtyInputChange={onClaimQtyInputChange}
      showDependencyModal={showDependencyModal}
      setShowDependencyModal={setShowDependencyModal}
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
      variationOptions={variationOptions}
      linkedRelationItems={linkedRelationItems}
      relatedRelationItems={relatedRelationItems}
      maxContributionAmount={Math.max(0, totalExtractedPrice - totalClaimedAmount)}
    />
  );
};
