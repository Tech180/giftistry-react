import React from 'react';

export interface UserPreviewCardProps {
  userId: string | null;
  displayName: string;
  children: React.ReactNode;
  isOnline?: boolean;
}
