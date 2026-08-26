import React from 'react';

export type DrawerVariant = 'default' | 'overlay';
/** On viewports ≤48rem, `sheet` fills the viewport; `rail` keeps the side panel. */
export type DrawerMobilePresentation = 'rail' | 'sheet';

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
