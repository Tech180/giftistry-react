import React from 'react';
import type { DrawerMobilePresentation } from './drawer-mobile-presentation.type';
import type { DrawerVariant } from './drawer-variant.type';

export interface DrawerProps {
  isOpen: boolean;
  position: 'left' | 'right';
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  overflowVisible?: boolean;
  miniDrawer?: React.ReactNode;
  variant?: DrawerVariant;
  /** Full-screen mobile sheet (Add Item / Comments). Defaults to side rail. */
  mobilePresentation?: DrawerMobilePresentation;
  footer?: React.ReactNode;
  titleIcon?: React.ReactNode;
  titleExtra?: React.ReactNode;
  headerExtra?: React.ReactNode;
  onOverlayClick?: () => void;
  /** Replaces the default close control (e.g. back arrow). */
  closeIcon?: React.ReactNode;
  closeAriaLabel?: string;
}
