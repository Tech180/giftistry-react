import React from 'react';
import { PublicUserSummary } from 'shared/interfaces/public-user-summary.interface';

export interface UserPreviewCardProps {
  userId: string | null;
  displayName: string;
  children: React.ReactNode;
  isOnline?: boolean;
  fallbackUser?: Partial<PublicUserSummary>;
}
