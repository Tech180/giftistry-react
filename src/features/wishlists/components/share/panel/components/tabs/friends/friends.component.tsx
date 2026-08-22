import React, { useState, useEffect } from 'react';
import { useFriendsController } from 'features/friends';
import { wishlistsApi } from 'features/wishlists/api/wishlists.api';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import { FriendsTabProps } from './interfaces/friends.interface';
import { FriendsTabTemplate } from './friends.html';

export const FriendsTab: React.FC<FriendsTabProps> = ({
  listId,
  shares,
  onSuccess,
  variant = 'classic',
}) => {
  const { friends, fetchFriends } = useFriendsController();
  const [search, setSearch] = useState('');
  const [roles, setRoles] = useState<Record<string, 'viewer' | 'collaborator'>>({});
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleShareSingle = async (friendId: string) => {
    const role = roles[friendId] || 'viewer';
    setLoadingIds(prev => ({ ...prev, [friendId]: true }));
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await wishlistsApi.bulkShareWithFriends(listId, [friendId], role);
      setSuccessMsg('Friend invited successfully!');
      onSuccess?.();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to share with friend.');
    } finally {
      setLoadingIds(prev => ({ ...prev, [friendId]: false }));
    }
  };

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName || lastName) {
      return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    }
    return username?.substring(0, 2).toUpperCase() || '??';
  };

  const setRole = (friendId: string, role: 'viewer' | 'collaborator') => {
    setRoles(prev => ({ ...prev, [friendId]: role }));
  };

  const availableFriends = friends.filter(friend => 
    !shares.some(share => share.UserId === friend.UserId || (friend.Email && share.Email === friend.Email))
  );

  const filteredFriends = availableFriends.filter(friend => {
    const name = `${friend.FirstName || ''} ${friend.LastName || ''}`.trim() || friend.Username || '';
    return name.toLowerCase().includes(search.toLowerCase()) || (friend.Email && friend.Email.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <FriendsTabTemplate
      variant={variant}
      search={search}
      setSearch={setSearch}
      roles={roles}
      setRole={setRole}
      loadingIds={loadingIds}
      errorMsg={errorMsg}
      successMsg={successMsg}
      filteredFriends={filteredFriends}
      handleShareSingle={handleShareSingle}
      getInitials={getInitials}
    />
  );
};
