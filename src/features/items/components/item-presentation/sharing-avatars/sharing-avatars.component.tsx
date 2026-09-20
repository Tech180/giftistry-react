import React from 'react';
import { useItemsSession } from '../../../providers/session';
import { getAudienceDisplayName } from '../../../utils/item-audience.util';
import { MAX_VISIBLE } from './constants/max-visible.constant';
import type { Props } from './interfaces/props.interface';
import { toEntry } from './utils/to-entry.util';
import { SharingAvatarsTemplate } from './sharing-avatars.html';

export const SharingAvatars: React.FC<Props> = ({ users, isOwner }) => {
  const { user: currentUser } = useItemsSession();

  if (users.length === 0) {
    return null;
  }

  if (isOwner) {
    const visibleUsers = users.slice(0, MAX_VISIBLE);
    const overflowCount = users.length - visibleUsers.length;

    return (
      <SharingAvatarsTemplate
        mode = {
          'owner'
        }
        ariaLabel = {
          `Shared with ${users.map(getAudienceDisplayName).join(', ')}`
        }
        visibleEntries = {
          visibleUsers.map(toEntry)
        }
        overflowCount = {
          overflowCount
        }
        guestOtherCount = {
          0
        }
      />
    );
  }

  const myUser = currentUser ? users.find((u) => u.UserId === currentUser.Id) : null;
  if (!myUser) {
    return null;
  }

  return (
    <SharingAvatarsTemplate
      mode = {
        'guest'
      }
      ariaLabel = {
        `Shared with you and ${users.length - 1} others`
      }
      visibleEntries = {
        [toEntry(myUser)]
      }
      overflowCount = {
        0
      }
      guestOtherCount = {
        users.length - 1
      }
    />
  );
};
