import type React from 'react';

export interface UseAudienceResult {
  sharedWithUserIds: string[];
  setSharedWithUserIds: React.Dispatch<React.SetStateAction<string[]>>;
  visibilityMode: 'everyone' | 'restricted' | 'private';
  setVisibilityMode: React.Dispatch<React.SetStateAction<'everyone' | 'restricted' | 'private'>>;
  handleVisibilityModeChange: (mode: 'everyone' | 'restricted' | 'private') => void;
}
