import React, { useState, useEffect, useMemo } from 'react';
import { itemsApi } from '../../api/items.api';
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

export const ItemShowcase: React.FC<ItemShowcaseProps> = ({
  item,
  priorityLabel,
  isOwner,
  isExpired,
  canCollaborate,
  allowGroupFunds,
  onUpdate,
  onEdit,
  onClose,
  wishlistItems = [],
  aiEnabled,
}) => {
  const { user, canShowAi } = useAuth();
  const claimedByCurrentUser = !!(user && item.Claims.some(c => c.UserId === user.Id));

  const [claimAmount, setClaimAmount] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(false);

  // AI Reviews States
  const [reviews, setReviews] = useState<{ summary: string; pros: string[]; cons: string[]; reviews: string[] } | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Advanced States
  const [selectedVariation, setSelectedVariation] = useState('');
  const [claimQty, setClaimQty] = useState(1);
  const [showDependencyModal, setShowDependencyModal] = useState(false);

  const { text: displayDescription, metadata } = useMemo(
    () => parseItemDescription(item.Description),
    [item.Description]
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
    if (metadata?.multiCount && metadata.variations && metadata.variations.length > 0) {
      setSelectedVariation(metadata.variations[0].name);
    } else {
      setSelectedVariation('');
    }
    setClaimQty(1);
  }, [item, metadata]);

  useEffect(() => {
    setLocalIsFavorite(getItemFavoriteFlag(item.Description));
  }, [item.Description]);

  useEffect(() => {
    let active = true;
    const fetchReviews = async () => {
      if (!canShowAi || !aiEnabled || !item.Links || item.Links.length === 0) {
        setReviews(null);
        setReviewsError(null);
        return;
      }
      
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const response = await itemsApi.getItemReviews(item.Id);
        if (active) {
          if (response) {
            setReviews({
              summary: response.Summary,
              pros: response.Pros,
              cons: response.Cons,
              reviews: response.Reviews,
            });
          } else {
            setReviews(null);
          }
        }
      } catch (err: any) {
        if (active) {
          setReviewsError(err.message || 'Failed to load AI reviews');
        }
      } finally {
        if (active) {
          setReviewsLoading(false);
        }
      }
    };
    fetchReviews();
    return () => {
      active = false;
    };
  }, [item.Id, canShowAi, aiEnabled, item.Links]);

  const handleClaim = async (e?: React.SyntheticEvent, skipLinkedCheck = false) => {
    if (e) e.preventDefault();

    const linkedIds = metadata?.linkedItemIds || [];
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
      const finalSelection = metadata?.multiCount ? selectedVariation : undefined;
      const finalQuantity = metadata?.multiCount ? claimQty : undefined;
      const claimerName = anonymous ? null : (user ? `${user.FirstName} ${user.LastName}`.trim() || user.Username : null);

      await itemsApi.claimItem(item.Id, amount, claimerName, anonymous, finalQuantity, finalSelection);
      setClaimAmount('');
      setAnonymous(false);
      setShowClaimForm(false);
      onUpdate();
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
      const finalSelection = metadata?.multiCount ? selectedVariation : undefined;
      const finalQuantity = metadata?.multiCount ? claimQty : undefined;
      const claimerName = anonymous ? null : (user ? `${user.FirstName} ${user.LastName}`.trim() || user.Username : null);

      // 1. Claim primary item
      await itemsApi.claimItem(item.Id, amount, claimerName, anonymous, finalQuantity, finalSelection);

      // 2. Claim all unclaimed linked items
      const linkedIds = metadata?.linkedItemIds || [];
      const unclaimedLinkedItems = wishlistItems.filter(
        (wi: any) => linkedIds.includes(wi.Id) && !wi.IsClaimed
      );

      await Promise.all(
        unclaimedLinkedItems.map((wi: any) =>
          itemsApi.claimItem(wi.Id, null, claimerName, anonymous, 1)
        )
      );

      setClaimAmount('');
      setAnonymous(false);
      setShowClaimForm(false);
      onUpdate();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to claim linked items');
    } finally {
      setClaimLoading(false);
    }
  };

  const handleUnclaim = async () => {
    setClaimLoading(true);
    try {
      await itemsApi.unclaimItem(item.Id);
      onUpdate();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to unclaim item');
    } finally {
      setClaimLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await itemsApi.deleteItem(item.Id);
      onUpdate();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete item.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Group funding & Multi-count calculations
  const totalExtractedPrice = item.Links.reduce((acc, link) => {
    return Math.max(acc, link.ExtractedPrice || 0);
  }, 0);

  const totalClaimedAmount = item.Claims.reduce((acc, claim) => {
    return acc + (claim.Amount || 0);
  }, 0);

  const isMultiCount = !!(metadata && metadata.multiCount);
  const totalClaimedQty = item.Claims.reduce((acc, c) => acc + (c.Quantity || 1), 0);
  const desiredQtyVal = (metadata && metadata.desiredQuantity) || 1;

  const isFullyClaimed = isMultiCount
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

  return (
    <ItemShowcaseTemplate
      item={item}
      priorityLabel={priorityLabel}
      isOwner={isOwner}
      canCollaborate={canCollaborate}
      isExpired={isExpired}
      allowGroupFunds={allowGroupFunds}
      wishlistItems={wishlistItems}
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
      totalClaimedQty={totalClaimedQty}
      desiredQtyVal={desiredQtyVal}
      isFullyClaimed={isFullyClaimed}
      progressPercent={progressPercent}
      onClose={onClose}
      onEdit={onEdit}
      getSiteName={getSiteName}
      reviews={reviews}
      reviewsLoading={reviewsLoading}
      reviewsError={reviewsError}
      aiEnabled={aiEnabled}
      canShowAi={canShowAi}
      audienceLabel={audienceLabel}
      isPrivate={isPrivate}
      linkedItems={linkedItems}
    />
  );
};
