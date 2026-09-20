import type { ReactNode } from 'react';

export interface Props {
  children: ReactNode;
  allowOnboarding?: boolean;
  allowPasswordChange?: boolean;
}
