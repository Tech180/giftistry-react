import React, { useId, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { prefersCollapsedMobilePanel } from '../../utils/prefers-collapsed-mobile-panel.util';
import type { SidebarProps } from './interfaces/sidebar-props.interface';
import { SidebarTemplate } from './sidebar.html';

export const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false, isOwner = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const panelId = useId();
  const [isCollapsed, setIsCollapsed] = useState(prefersCollapsedMobilePanel);

  return (
    <SidebarTemplate
      isAdmin={isAdmin}
      isOwner={isOwner}
      activePath={location.pathname}
      onNavigate={(path) => navigate(path)}
      isCollapsed={isCollapsed}
      panelId={panelId}
      onToggleCollapsed={() => setIsCollapsed((collapsed) => !collapsed)}
    />
  );
};

export default Sidebar;
