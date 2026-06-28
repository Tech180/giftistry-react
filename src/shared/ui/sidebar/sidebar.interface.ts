import React from 'react';

export interface SidebarProps {
  isOpen: boolean;
  position: 'left' | 'right';
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  overflowVisible?: boolean;
  miniSidebar?: React.ReactNode;
}
