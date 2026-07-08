import React from 'react';
import { DrawerVariant } from './drawer-props.interface';

export interface DrawerTemplateProps {
  drawerClass: string;
  drawerRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  overflowVisible?: boolean;
  miniDrawer?: React.ReactNode;
  variant?: DrawerVariant;
  footer?: React.ReactNode;
  titleIcon?: React.ReactNode;
  isOpen?: boolean;
  onOverlayClick?: () => void;
}
