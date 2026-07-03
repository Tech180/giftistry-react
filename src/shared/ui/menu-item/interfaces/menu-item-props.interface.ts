import { ReactNode } from 'react';
import { MenuItemVariant } from './menu-item-variant.interface';

export interface MenuItemProps {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  variant?: MenuItemVariant;
  className?: string;
}
