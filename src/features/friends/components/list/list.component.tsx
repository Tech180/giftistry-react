import React, { useEffect, useState } from 'react';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import type { Friend } from '../../interfaces/friend.interface';
import { getFriendInitials } from '../../utils/get-friend-initials.util';
import { isBirthdayNear } from '../../utils/is-birthday-near.util';
import type { Props } from './interfaces/props.interface';
import { ListTemplate } from './list.html';

export const List: React.FC<Props> = ({
  friends,
  onRemove,
  removingId,
  highlightedUserId,
}) => {
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!highlightedUserId) {
      return;
    }

    const element = document.getElementById(`friend-user-${highlightedUserId}`);
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightedUserId, friends]);

  const getFriendUserId = (friend: Friend) => friend.UserId;

  return (
    <ListTemplate
      friends = {
        friends
      }
      onRemove = {
        onRemove
      }
      removingId = {
        removingId
      }
      highlightedUserId = {
        highlightedUserId
      }
      hoveredUserId = {
        hoveredUserId
      }
      onHoverChange = {
        setHoveredUserId
      }
      getDisplayName = {
        getDisplayName
      }
      getFriendUserId = {
        getFriendUserId
      }
      getFriendInitials = {
        getFriendInitials
      }
      isBirthdayNear = {
        isBirthdayNear
      }
    />
  );
};
