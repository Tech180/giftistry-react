import React from 'react';

export interface DrawerProps {
  isOpen: boolean;
  position: 'left' | 'right';
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  overflowVisible?: boolean;
  miniDrawer?: React.ReactNode;
}
