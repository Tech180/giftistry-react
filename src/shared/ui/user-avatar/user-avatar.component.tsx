import React from 'react';
import type { Props } from './interfaces/props.interface';
export type { UserAvatarProps } from './interfaces/props.interface';
import { UserAvatarTemplate } from './user-avatar.html';

export const UserAvatar: React.FC<Props> = (props) => (
  <UserAvatarTemplate
    {...props}
  />
);
