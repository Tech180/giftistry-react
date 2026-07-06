import React from 'react';
import { FriendPickerProps } from './interfaces/friend-picker-props.interface';
import { FriendPickerTemplate } from './friend-picker.html';
import { Friend } from '../../interfaces/friend.interface';

export const FriendPicker: React.FC<FriendPickerProps> = ({
  friends,
  selectedIds,
  onChange,
}) => {
  const getFriendUserId = (friend: Friend) => friend.UserId;

  const getDisplayName = (friend: Friend) => {
    if (friend.FirstName) {
      return `${friend.FirstName} ${friend.LastName || ''}`.trim();
    }
    return friend.Username || 'Unknown User';
  };

  const onToggle = (friendUserId: string) => {
    if (selectedIds.includes(friendUserId)) {
      onChange(selectedIds.filter((id) => id !== friendUserId));
    } else {
      onChange([...selectedIds, friendUserId]);
    }
  };

  return (
    <FriendPickerTemplate
      friends={friends}
      selectedIds={selectedIds}
      onToggle={onToggle}
      getDisplayName={getDisplayName}
      getFriendUserId={getFriendUserId}
    />
  );
};
