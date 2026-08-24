import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import {
  itemNeedsClaimQuantityUi,
} from '../../utils/resolve-claim-quantity-lines.util';
import { resolveCurrentUserClaimIsAnonymous } from '../../utils/resolve-current-user-claim-is-anonymous.util';
import { resolveCanEditItem } from '../../utils/resolve-can-edit-item.util';
import { hasUnclaimedLinkedItems } from '../../utils/has-unclaimed-linked-items.util';
import { hasLinkedUnclaimPeers } from '../../utils/resolve-linked-unclaim-peers.util';
import { linkGroupSupportsLinkedItems } from '../../utils/item-supports-linked-items.util';

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isOwner,
  isExpired,
  isArchived = false,
  canCollaborate,
  isPublicGuest = false,
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
  onView,
  wishlistItems = [],
  isLinkingContext = false,
  isRelatingContext = false,
  aiEnabled,
  onLinkedItemNavigate,
  onLinkedItemsUnsupported,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, canShowAi } = useAuth();
  const claims = item.Claims ?? [];
  const claimedByCurrentUser = !!(user && claims.some((c) => c.UserId === user.Id));
  const canEditItem = resolveCanEditItem(item, user?.Id, isOwner, isPublicGuest);

  const [urlInput, setUrlInput] = useState('');
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  const [showClaimForm, setShowClaimFormState] = useState(false);
  const [claimAmount, setClaimAmount] = useState('');
  const [claimedByName, setClaimedByName] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
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
      const metadataPayload = {
        ...(parsed.metadata ?? { Text: parsed.text }),
        Text: parsed.text,
      };
      const newFavoriteState = !localIsFavorite;

      if (isOwner) {
        metadataPayload.IsFavorite = newFavoriteState;
        if (!newFavoriteState) {
          delete metadataPayload.IsPinned;
        }
      } else {
        metadataPayload.IsPinned = newFavoriteState;
        if (!newFavoriteState) {
          delete metadataPayload.IsFavorite;
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
        metadataPayload
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

  const claimActorName = user
    ? `${user.FirstName} ${user.LastName}`.trim() || user.Username
    : null;

  const { text: displayDescription, metadata } = useMemo(
    () => parseItemDescription(item.Description, item.Metadata),
    [item.Description, item.Metadata]
  );

  const executeSimpleClaim = useCallback(
    async (includeLinked?: boolean) => {
      const amount = claimAmount ? parseFloat(claimAmount) : null;
      const claimerName = anonymous ? null : claimActorName;
      await itemActions.claimItem({
        itemId: item.Id,
        amount,
        claimedByName: claimerName,
        anonymous,
        includeLinked,
      });
      setClaimAmount('');
      setClaimedByName('');
      setAnonymous(false);
      setShowClaimFormState(false);
    },
    [claimAmount, anonymous, claimActorName, itemActions, item.Id]
  );

  const handleClaim = async (e?: React.SyntheticEvent<HTMLFormElement>) => {
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
      await executeSimpleClaim(linkedClaimPeers.length > 0);
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
      await itemActions.unclaimItem(item.Id, user?.Id, linkedUnclaim);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to unclaim item');
    } finally {
      setClaimLoading(false);
    }
  };

  const totalExtractedPrice =
    item.FundingTarget != null
      ? item.FundingTarget
      : item.Links.reduce((acc, link) => Math.max(acc, link.ExtractedPrice || 0), 0);

  const totalClaimedAmount =
    item.TotalClaimedAmount != null
      ? item.TotalClaimedAmount
      : claims.reduce((acc, claim) => acc + (claim.Amount || 0), 0);

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

  const canAdjustClaim = itemNeedsClaimQuantityUi(item, metadata);

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
    } catch (_) {}
  };

  const userDefinedEntries = useMemo(() => getUserDefinedEntries(metadata), [metadata]);

  const predefinedDisplayEntries = useMemo(() => {
    const userNames = new Set(userDefinedEntries.map((entry) => entry.name));
    return getMetadataDisplayEntries(metadata).filter((entry) => !userNames.has(entry.label));
  }, [metadata, userDefinedEntries]);

  const categoryMeta = getCategoryMeta(item.Category);
  const displayCategoryBadge = !!(item.Category && item.Category !== 'uncategorized');
  const isPrivate = useMemo(() => isPrivateItem(item, user?.Id), [item, user?.Id]);

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
    <>
      <ItemCardRouter
        item={item}
        isOwner={isOwner}
        isExpired={isExpired}
        isArchived={isArchived}
        canCollaborate={canCollaborate}
        isPublicGuest={isPublicGuest}
        canEditItem={canEditItem}
        allowGroupFunds={allowGroupFunds}
        isFullyClaimed={isFullyClaimed}
        isMultiCount={quantitySummary.isMultiCount}
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
        canAdjustClaim={canAdjustClaim}
        itemActions={itemActions}
        claimUserId={user?.Id ?? null}
        claimActorName={claimActorName}
        linkedClaimPeers={linkedClaimPeers}
        hasLinkedUnclaimPeers={linkedUnclaim}
        wishlistItemsForLinkedClaim={wishlistItems}
        onLinkedClaimItemClick={(itemId) => onLinkedItemNavigate?.(itemId, item.Id)}
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
        onSelect={
          onSelect
            ? () => {
                if (viewMode === 'grid' && item.IsSuggestion && canEditItem && onEdit) {
                  onEdit();
                  return;
                }
                onSelect();
              }
            : undefined
        }
        onView={canEditItem && onEdit ? undefined : onView}
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
    </>
  );
};
