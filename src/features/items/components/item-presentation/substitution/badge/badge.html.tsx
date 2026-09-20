import React from 'react';
import { UserAvatar } from 'shared/ui';
import { UserPreviewCard } from 'features/auth';
import { UserAvatarBox } from '../../user-avatar-box/user-avatar-box.component';
import type { TemplateProps } from './interfaces/template-props.interface';

export const BadgeTemplate: React.FC<TemplateProps> = (props) => {
  if (props.mode === 'owner-approved') {
    return <span className={props.ownerClassName}>{props.ownerApprovedLabel}</span>;
  }

  return (
    <UserAvatarBox
      title = {
        props.counterLabel
      }
      ariaLabel = {
        props.ariaLabel
      }
      variant = {
        'suggestion'
      }
    >
      {props.createdByUserId ? (
        <UserPreviewCard
          userId = {
            props.createdByUserId
          }
          displayName = {
            props.displayName
          }
        >
          <UserAvatar
            avatar = {
              null
            }
            alt = {
              props.displayName
            }
            initials = {
              props.initials
            }
            className = {
              props.avatarClassName
            }
            imageClassName = {
              props.avatarImageClassName
            }
            initialsClassName = {
              props.avatarInitialsClassName
            }
          />
        </UserPreviewCard>
      ) : (
        <UserAvatar
          avatar = {
            null
          }
          alt = {
            props.displayName
          }
          initials = {
            props.initials
          }
          className = {
            props.avatarClassName
          }
          imageClassName = {
            props.avatarImageClassName
          }
          initialsClassName = {
            props.avatarInitialsClassName
          }
        />
      )}
    </UserAvatarBox>
  );
};
