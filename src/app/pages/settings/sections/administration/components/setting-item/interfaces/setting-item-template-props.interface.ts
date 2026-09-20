import { ReactNode } from 'react';

export interface SettingItemTemplateProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  layout: 'row' | 'column';
  className?: string;
}
