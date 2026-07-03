import { ReactNode } from 'react';

export interface AppShellProps {
  navigation: ReactNode;
  banner?: ReactNode;
  children: ReactNode;
  isProfilePage?: boolean;
  hasBanner?: boolean;
}
