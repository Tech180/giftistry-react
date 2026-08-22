import React from 'react';

export type UserAvatarBoxVariant = 'sharing' | 'claim' | 'owner' | 'suggestion';

export interface UserAvatarBoxProps {
  title: string;
  ariaLabel: string;
  variant?: UserAvatarBoxVariant;
  children: React.ReactNode;
}
