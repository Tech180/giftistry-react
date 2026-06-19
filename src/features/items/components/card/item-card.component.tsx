import React, { useState, useEffect } from 'react';
import { itemsApi } from '../../api/items.api';
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
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  // Claim states
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimAmount, setClaimAmount] = useState('');
  const [claimedByName, setClaimedByName] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Favorite state (Mock toggle since backend doesn't support item updates yet)
  const [localIsFavorite, setLocalIsFavorite] = useState(false);

  useEffect(() => {
    setLocalIsFavorite(
      priorityLabel?.includes('★') || priorityLabel?.includes('*') || priorityLabel?.includes('Favorite') || false
    );
  }, [priorityLabel]);

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

  const handleClaim = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClaimLoading(true);

    try {
      const amount = claimAmount ? parseFloat(claimAmount) : null;
      await itemsApi.claimItem(item.Id, amount, claimedByName.trim() || null);
      setClaimAmount('');
      setClaimedByName('');
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
      claimLoading={claimLoading}
      handleClaim={handleClaim}
      showDeleteConfirm={showDeleteConfirm}
      setShowDeleteConfirm={setShowDeleteConfirm}
      deleteLoading={deleteLoading}
      handleDelete={handleDelete}
      isFavorite={localIsFavorite}
      toggleFavorite={() => setLocalIsFavorite(!localIsFavorite)}
      onEdit={onEdit}
    />
  );
};
