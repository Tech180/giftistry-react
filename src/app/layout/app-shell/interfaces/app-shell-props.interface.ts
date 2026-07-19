import { ReactNode } from 'react';

export interface AppShellProps {
  navigation: ReactNode;
  banner?: ReactNode;
  children: ReactNode;
  isSettingsPage?: boolean;
  hasBanner?: boolean;
  isFullWidth?: boolean;
  isAuthPage?: boolean;
}
