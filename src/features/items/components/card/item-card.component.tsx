import React, { useState, useEffect } from 'react';
import { itemsApi } from '../../api/items.api';
import { useAuth } from 'app/providers/AuthContext';
import { ItemCardProps } from '../../interfaces/item-card-props.interface';
import { ItemCardTemplate } from './item-card.html';

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isOwner,
  isExpired,
  canCollaborate,
  allowGroupFunds,
  onUpdate,
  priorityLabel,
  onEdit,
  isTaggingModeActive,
  isTaggedSelection,
  onSelectTag,
}) => {
  const { user } = useAuth();
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

  // Favorite state (Mock toggle since backend doesn't support item updates yet)
  const [localIsFavorite, setLocalIsFavorite] = useState(false);

  useEffect(() => {
    if (isOwner) {
      setLocalIsFavorite(
        priorityLabel?.includes('★') || priorityLabel?.includes('Favorite') || false
      );
    } else {
      setLocalIsFavorite(
        priorityLabel?.includes('📌') || priorityLabel?.includes('Pinned') || false
      );
    }
  }, [priorityLabel, isOwner]);

  const handleAddLink = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLinkLoading(true);
    try {
      await itemsApi.addItemLink(item.Id, urlInput.trim());
      setUrlInput('');
      setShowAddLink(false);
      onUpdate();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add link');
    } finally {
      setLinkLoading(false);
    }
  };

  const handleClaim = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setClaimLoading(true);

    try {
      const amount = claimAmount ? parseFloat(claimAmount) : null;
      await itemsApi.claimItem(item.Id, amount, null, anonymous);
      setClaimAmount('');
      setClaimedByName('');
      setAnonymous(false);
      setShowClaimForm(false);
      onUpdate();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to claim item');
    } finally {
      setClaimLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await itemsApi.deleteItem(item.Id);
      onUpdate();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete item.');
    } finally {
      setDeleteLoading(false);
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

  // Group funding calculations
  const totalExtractedPrice = item.Links.reduce((acc, link) => {
    return Math.max(acc, link.ExtractedPrice || 0);
  }, 0);

  const totalClaimedAmount = item.Claims.reduce((acc, claim) => {
    return acc + (claim.Amount || 0);
  }, 0);

  const isFullyClaimed = allowGroupFunds && totalExtractedPrice > 0
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
    } catch (_) {}
  };

  return (
    <ItemCardTemplate
      item={item}
      isOwner={isOwner}
      isExpired={isExpired}
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
      toggleFavorite={() => setLocalIsFavorite(!localIsFavorite)}
      onEdit={onEdit}
      claimedByCurrentUser={claimedByCurrentUser}
      handleUnclaim={handleUnclaim}
      isPinned={isPinned}
      togglePin={togglePin}
      isTaggingModeActive={isTaggingModeActive}
      isTaggedSelection={isTaggedSelection}
      onSelectTag={onSelectTag}
    />
  );
};
