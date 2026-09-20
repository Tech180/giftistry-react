import React from 'react';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import type { Friend } from '../../interfaces/friend.interface';
import type { Props } from './interfaces/props.interface';
import { PickerTemplate } from './picker.html';

export const Picker: React.FC<Props> = ({
  friends,
  selectedIds,
  onChange,
}) => {
  const getFriendUserId = (friend: Friend) => friend.UserId;

  const onToggle = (friendUserId: string) => {
    if (selectedIds.includes(friendUserId)) {
      onChange(selectedIds.filter((id) => id !== friendUserId));
    } else {
      onChange([...selectedIds, friendUserId]);
    }
  };

  return (
    <PickerTemplate
      friends = {
        friends
      }
      selectedIds = {
        selectedIds
      }
      onToggle = {
        onToggle
      }
      getDisplayName = {
        getDisplayName
      }
      getFriendUserId = {
        getFriendUserId
      }
    />
  );
};
