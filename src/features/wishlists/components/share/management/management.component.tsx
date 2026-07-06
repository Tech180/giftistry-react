import React, { useEffect, useState } from 'react';
import { wishlistsApi } from 'features/wishlists/api/wishlists.api';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import { ManagementProps } from './interfaces/management.interface';
import { ShareManagementTemplate } from './management.html';

export const ShareManagement: React.FC<ManagementProps> = ({ listId, isOwner }) => {
  const [shares, setShares] = useState<ListShare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadShares = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await wishlistsApi.listShares(listId);
      setShares(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shares.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShares();
  }, [listId]);

  const getDisplayName = (share: ListShare) => {
    if (share.FirstName) return `${share.FirstName} ${share.LastName || ''}`.trim();
    return share.Username || share.Email || 'Unknown User';
  };

  const handleRoleChange = async (shareId: string, role: 'viewer' | 'collaborator') => {
    setUpdatingId(shareId);
    try {
      await wishlistsApi.updateShare(listId, shareId, role);
      await loadShares();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (shareId: string) => {
    setRemovingId(shareId);
    try {
      await wishlistsApi.removeShare(listId, shareId);
      await loadShares();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke access.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <ShareManagementTemplate
      shares={shares}
      isOwner={isOwner}
      isLoading={isLoading}
      error={error}
      updatingId={updatingId}
      removingId={removingId}
      onRoleChange={handleRoleChange}
      onRemove={handleRemove}
      getDisplayName={getDisplayName}
    />
  );
};
