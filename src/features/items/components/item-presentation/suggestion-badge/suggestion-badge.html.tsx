import React from 'react';
import { UserAvatar } from 'shared/ui';
import { UserPreviewCard } from 'features/auth';
import { UserAvatarBox } from '../user-avatar-box/user-avatar-box.component';
import type { TemplateProps } from './interfaces/template-props.interface';

export const SuggestionBadgeTemplate: React.FC<TemplateProps> = ({
  userId,
  displayName,
  ariaLabel,
  initials,
  avatarClassName,
  avatarImageClassName,
  avatarInitialsClassName,
}) => {
  return (
    <UserAvatarBox
      title = {
        'Suggestion'
      }
      ariaLabel = {
        ariaLabel
      }
      variant = {
        'suggestion'
      }
    >
      {userId ? (
        <UserPreviewCard
          userId = {
            userId
          }
          displayName = {
            displayName
          }
        >
          <UserAvatar
            avatar = {
              null
            }
            alt = {
              displayName
            }
            initials = {
              initials
            }
            className = {
              avatarClassName
            }
            imageClassName = {
              avatarImageClassName
            }
            initialsClassName = {
              avatarInitialsClassName
            }
          />
        </UserPreviewCard>
      ) : (
        <UserAvatar
          avatar = {
            null
          }
          alt = {
            displayName
          }
          initials = {
            initials
          }
          className = {
            avatarClassName
          }
          imageClassName = {
            avatarImageClassName
          }
          initialsClassName = {
            avatarInitialsClassName
          }
        />
      )}
    </UserAvatarBox>
  );
};
