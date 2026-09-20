import type { ReactNode } from 'react';

export interface TemplateProps {
  errorMsg: string | null;
  successMsg: string | null;
  avatarEditor: ReactNode;
  profileForm: ReactNode;
  aiPreferences: ReactNode;
  dangerZone: ReactNode;
}
