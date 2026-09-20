import React from 'react';
import type { Props } from './interfaces/props.interface';
import { getOwnerInitials } from './utils/get-owner-initials.util';
import { OwnerBadgeTemplate } from './owner-badge.html';

export const OwnerBadge: React.FC<Props> = ({
  userId,
  displayName,
  username,
  firstName,
  avatar,
}) => {
  return (
    <OwnerBadgeTemplate
      userId = {
        userId
      }
      displayName = {
        displayName
      }
      username = {
        username
      }
      firstName = {
        firstName
      }
      avatar = {
        avatar
      }
      ariaLabel = {
        `Owner: ${displayName}`
      }
      initials = {
        getOwnerInitials(displayName, firstName, username)
      }
    />
  );
};
