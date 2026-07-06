import React from 'react';
import { getAvatarStyle, isAvatarImage } from 'shared/utils/avatar.util';

export interface UserAvatarProps {
  avatar?: string | null;
  alt: string;
  initials: string;
  className?: string;
  imageClassName?: string;
  initialsClassName?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
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
        <img src={avatar!} alt={alt} className={imageClassName} />
      </div>
    );
  }

  return (
    <div className={className} style={getAvatarStyle(avatar)} aria-label={alt}>
      <span className={initialsClassName}>{initials}</span>
    </div>
  );
};
