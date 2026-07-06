import React from 'react';

export interface DrawerTemplateProps {
  drawerClass: string;
  drawerRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  overflowVisible?: boolean;
  miniDrawer?: React.ReactNode;
}
