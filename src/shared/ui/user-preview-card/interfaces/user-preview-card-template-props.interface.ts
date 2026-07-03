import React from 'react';
import { ApiUser } from 'features/auth';

export interface UserPreviewCardTemplateProps {
  user: ApiUser | null;
  isLoading: boolean;
  placement: 'top' | 'bottom';
  style: React.CSSProperties;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  displayName: string;
  isOnline: boolean;
  userInitials?: string;
  fallbackInitials: string;
  joinedDate: string;
  cardClass: string;
}
