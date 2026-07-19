import React from 'react';
import { DrawerMobilePresentation, DrawerVariant } from './drawer-props.interface';

export interface DrawerTemplateProps {
  drawerClass: string;
  drawerRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  overflowVisible?: boolean;
  miniDrawer?: React.ReactNode;
  variant?: DrawerVariant;
  mobilePresentation?: DrawerMobilePresentation;
  showScrim?: boolean;
  footer?: React.ReactNode;
  titleIcon?: React.ReactNode;
  titleExtra?: React.ReactNode;
  headerExtra?: React.ReactNode;
  isOpen?: boolean;
  onOverlayClick?: () => void;
}
