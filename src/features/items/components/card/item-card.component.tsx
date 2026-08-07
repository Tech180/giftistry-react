import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from 'app/providers/auth-context';
import { ItemCardProps } from '../../interfaces/item-card-props.interface';
import { ItemCardRouter } from '../views/item-card-router.component';
import { getCategoryMeta } from './category-icons';
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
import { formatAudienceLabel, getItemSharedWithUserIds, isPrivateItem } from '../../utils/item-audience.util';
import { resolveLinkedItems } from '../../utils/item-links-sync.util';
import { resolveRelatedItems } from '../../utils/item-related-sync.util';
import { resolveItemQuantitySummary } from '../../utils/resolve-item-quantity.util';

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isOwner,
  isExpired,
  isArchived = false,
  canCollaborate,
  allowGroupFunds,
  itemActions,
  priorityLabel,
  onEdit,
  isTaggingModeActive,
  isTaggedSelection,
  onSelectTag,
  viewMode = 'detailed',
  isSelected,
  onSelect,
  wishlistItems = [],
  isLinkingContext = false,
  isRelatingContext = false,
  aiEnabled,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, canShowAi } = useAuth();
  const claimedByCurrentUser = !!(user && item.Claims.some(c => c.UserId === user.Id));

  const [urlInput, setUrlInput] = useState('');
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  // Claim states
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimAmount, setClaimAmount] = useState('');
  const [claimedByName, setClaimedByName] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Favorite state
  const [localIsFavorite, setLocalIsFavorite] = useState(false);

  useEffect(() => {
    setLocalIsFavorite(getItemFavoriteFlag(item.Description, item.Metadata));
  }, [item.Description, item.Metadata]);

  const toggleFavorite = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      const parsed = parseItemDescription(item.Description, item.Metadata);
      const metadata = {
        ...(parsed.metadata ?? { Text: parsed.text }),
        Text: parsed.text,
      };
      const newFavoriteState = !localIsFavorite;

      if (isOwner) {
        metadata.IsFavorite = newFavoriteState;
        if (!newFavoriteState) {
          delete metadata.IsPinned;
        }
      } else {
        metadata.IsPinned = newFavoriteState;
        if (!newFavoriteState) {
          delete metadata.IsFavorite;
        }
      }

      await itemActions.updateItem(
        item.Id,
        item.Name,
        null,
        item.PriorityId,
        item.Category,
        item.Priority ?? null,
        getItemSharedWithUserIds(item),
        undefined,
        undefined,
        undefined,
        metadata
      );

      setLocalIsFavorite(newFavoriteState);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update favorite status');
    }
  };

  const handleAddLink = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLinkLoading(true);
    try {
      await itemActions.addItemLink(item.Id, urlInput.trim());
      setUrlInput('');
      setShowAddLink(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add link');
    } finally {
      setLinkLoading(false);
    }
  };

  const handleClaim = async (e?: React.SyntheticEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setClaimLoading(true);

    try {
      const amount = claimAmount ? parseFloat(claimAmount) : null;
      const claimerName = anonymous ? null : (user ? `${user.FirstName} ${user.LastName}`.trim() || user.Username : null);
      await itemActions.claimItem({
        itemId: item.Id,
        amount,
        claimedByName: claimerName,
        anonymous,
      });
      setClaimAmount('');
      setClaimedByName('');
      setAnonymous(false);
      setShowClaimForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to claim item');
    } finally {
      setClaimLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await itemActions.deleteItem(item.Id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete item.');
    } finally {
      setDeleteLoading(false);
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

  // Group funding calculations — prefer server claim summaries when present
  const totalExtractedPrice =
    item.FundingTarget != null
      ? item.FundingTarget
      : item.Links.reduce((acc, link) => Math.max(acc, link.ExtractedPrice || 0), 0);

  const totalClaimedAmount =
    item.TotalClaimedAmount != null
      ? item.TotalClaimedAmount
      : item.Claims.reduce((acc, claim) => acc + (claim.Amount || 0), 0);

  const { text: displayDescription, metadata } = useMemo(
    () => parseItemDescription(item.Description, item.Metadata),
    [item.Description, item.Metadata]
  );

  const quantitySummary = useMemo(
    () => resolveItemQuantitySummary(item, metadata),
    [item, metadata]
  );

  const isFullyClaimed =
    item.IsFullyClaimed != null
      ? item.IsFullyClaimed
      : quantitySummary.isMultiCount
        ? quantitySummary.claimedQuantity >= quantitySummary.desiredQuantity
        : allowGroupFunds && totalExtractedPrice > 0
          ? totalClaimedAmount >= totalExtractedPrice
          : item.IsClaimed;

  const [isPinned, setIsPinned] = useState(() => {
    try {
      return localStorage.getItem(`pinned_${item.Id}`) === 'true';
    } catch (_) {
      return false;
    }
  });

  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = !isPinned;
    setIsPinned(newValue);
    try {
      localStorage.setItem(`pinned_${item.Id}`, String(newValue));
    } catch (_) { }
  };

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

  const categoryMeta = getCategoryMeta(item.Category);
  const displayCategoryBadge = !!(item.Category && item.Category !== 'uncategorized');
  const isPrivate = useMemo(
    () => isPrivateItem(item, user?.Id),
    [item, user?.Id]
  );

  const audienceLabel = formatAudienceLabel(
    item.SharedWith,
    user?.Id,
    isOwner,
    item.SuggestedByUserId
  );

  const linkedItems = useMemo(
    () => resolveLinkedItems(item, wishlistItems),
    [item, wishlistItems]
  );

  const relatedItems = useMemo(
    () => resolveRelatedItems(item, wishlistItems),
    [item, wishlistItems]
  );

  return (
    <ItemCardRouter
      item={item}
      isOwner={isOwner}
      isExpired={isExpired}
      isArchived={isArchived}
      canCollaborate={canCollaborate}
      allowGroupFunds={allowGroupFunds}
      isFullyClaimed={isFullyClaimed}
      totalExtractedPrice={totalExtractedPrice}
      totalClaimedAmount={totalClaimedAmount}
      priorityLabel={priorityLabel}
      urlInput={urlInput}
      setUrlInput={setUrlInput}
      showAddLink={showAddLink}
      setShowAddLink={setShowAddLink}
      linkLoading={linkLoading}
      handleAddLink={handleAddLink}
      showClaimForm={showClaimForm}
      setShowClaimForm={setShowClaimForm}
      claimAmount={claimAmount}
      setClaimAmount={setClaimAmount}
      claimedByName={claimedByName}
      setClaimedByName={setClaimedByName}
      anonymous={anonymous}
      setAnonymous={setAnonymous}
      claimLoading={claimLoading}
      handleClaim={handleClaim}
      showDeleteConfirm={showDeleteConfirm}
      setShowDeleteConfirm={setShowDeleteConfirm}
      deleteLoading={deleteLoading}
      handleDelete={handleDelete}
      isFavorite={localIsFavorite}
      toggleFavorite={toggleFavorite}
      onEdit={onEdit}
      claimedByCurrentUser={claimedByCurrentUser}
      handleUnclaim={handleUnclaim}
      isPinned={isPinned}
      togglePin={togglePin}
      isTaggingModeActive={isTaggingModeActive}
      isTaggedSelection={isTaggedSelection}
      onSelectTag={onSelectTag}
      viewMode={viewMode}
      isSelected={isSelected}
      onSelect={onSelect}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      displayDescription={displayDescription}
      metadata={metadata}
      predefinedDisplayEntries={predefinedDisplayEntries}
      userDefinedEntries={userDefinedEntries}
      metadataBadgeEmoji={METADATA_BADGE_EMOJI}
      CategoryIcon={categoryMeta.icon}
      displayCategoryBadge={displayCategoryBadge}
      categoryLabel={categoryMeta.label}
      getSiteName={getSiteName}
      audienceLabel={audienceLabel}
      isPrivate={isPrivate}
      linkedItems={linkedItems}
      relatedItems={relatedItems}
      isLinkingContext={isLinkingContext}
      isRelatingContext={isRelatingContext}
      aiEnabled={aiEnabled}
      canShowAi={canShowAi}
    />
  );
};
