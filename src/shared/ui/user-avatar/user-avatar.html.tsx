import React from 'react';
import { getAvatarStyle, isAvatarImage } from 'shared/utils/avatar.util';
import type { TemplateProps } from './interfaces/template-props.interface';

export const UserAvatarTemplate: React.FC<TemplateProps> = ({
  avatar,
  alt,
  initials,
  className,
  imageClassName,
  initialsClassName,
}) => {
  if (isAvatarImage(avatar)) {
    return (
      <div className={className}>
        <img
          src = {
            avatar!
          }
          alt = {
            alt
          }
          className = {
            imageClassName
          }
        />
      </div>
    );
  }

  return (
    <div
      className = {
        className
      }
      style = {
        getAvatarStyle(avatar)
      }
      aria-label = {
        alt
      }
    >
      <span className={initialsClassName}>{initials}</span>
    </div>
  );
};
