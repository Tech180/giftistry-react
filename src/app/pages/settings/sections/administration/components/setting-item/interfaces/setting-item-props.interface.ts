import { ReactNode } from 'react';

export interface SettingItemProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  layout?: 'row' | 'column';
  className?: string;
}
