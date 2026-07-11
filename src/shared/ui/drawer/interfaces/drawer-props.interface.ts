import React from 'react';

export type DrawerVariant = 'default' | 'overlay';

export interface DrawerProps {
  isOpen: boolean;
  position: 'left' | 'right';
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  overflowVisible?: boolean;
  miniDrawer?: React.ReactNode;
  variant?: DrawerVariant;
  footer?: React.ReactNode;
  titleIcon?: React.ReactNode;
  titleExtra?: React.ReactNode;
  headerExtra?: React.ReactNode;
  onOverlayClick?: () => void;
}
