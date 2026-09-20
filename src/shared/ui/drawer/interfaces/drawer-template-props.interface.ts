import React from 'react';

export interface DrawerTemplateProps {
  drawerClass: string;
  headerClass: string;
  titleClass: string;
  footerClass: string;
  overlayClass: string;
  drawerRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  miniDrawer?: React.ReactNode;
  integrateMiniInSheet: boolean;
  position: 'left' | 'right';
  showScrim: boolean;
  showFooter: boolean;
  showTitleIcon: boolean;
  showIconClose: boolean;
  showTextClose: boolean;
  footer?: React.ReactNode;
  titleIcon?: React.ReactNode;
  titleExtra?: React.ReactNode;
  headerExtra?: React.ReactNode;
  isOpen: boolean;
  onOverlayClick: () => void;
  resolvedCloseIcon?: React.ReactNode;
  closeAriaLabel: string;
}
