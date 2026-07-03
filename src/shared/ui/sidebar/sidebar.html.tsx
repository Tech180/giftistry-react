import React from 'react';
import { SidebarTemplateProps } from './interfaces/sidebar-template-props.interface';

export const SidebarTemplate: React.FC<SidebarTemplateProps> = ({
  children,
  containerClass,
}) => {
  return (
    <nav className={containerClass} aria-label="Sidebar navigation">
      {children}
    </nav>
  );
};
