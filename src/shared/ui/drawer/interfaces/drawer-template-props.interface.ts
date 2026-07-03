import React from 'react';

export interface DrawerTemplateProps {
  drawerClass: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  overflowVisible?: boolean;
  miniDrawer?: React.ReactNode;
}
