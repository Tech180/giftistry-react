import React, { useEffect } from 'react';
import { FriendListProps } from './interfaces/friend-list-props.interface';
import { FriendListTemplate } from './friend-list.html';
import { Friend } from '../../interfaces/friend.interface';

export const FriendList: React.FC<FriendListProps> = ({
  friends,
  onRemove,
  removingId,
  highlightedUserId,
}) => {
  useEffect(() => {
    if (!highlightedUserId) return;

    const element = document.getElementById(`friend-user-${highlightedUserId}`);
    if (!element) return;

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightedUserId, friends]);

  const getFriendUserId = (friend: Friend) => friend.UserId;

  const getDisplayName = (friend: Friend) => {
    if (friend.FirstName) {
      return `${friend.FirstName} ${friend.LastName || ''}`.trim();
    }
    return friend.Username || 'Unknown User';
  };

  return (
    <FriendListTemplate
      friends={friends}
      onRemove={onRemove}
      removingId={removingId}
      highlightedUserId={highlightedUserId}
      getDisplayName={getDisplayName}
      getFriendUserId={getFriendUserId}
    />
  );
};
