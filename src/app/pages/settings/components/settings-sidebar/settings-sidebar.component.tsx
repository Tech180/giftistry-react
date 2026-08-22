import React, { useId, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SettingsSidebarTemplate } from './settings-sidebar.html';
import { SettingsSidebarProps } from './interfaces/settings-sidebar-props.interface';
import { prefersCollapsedMobilePanel } from '../../utils/prefers-collapsed-mobile-panel.util';

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  isAdmin = false,
  isOwner = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const panelId = useId();
  const [isCollapsed, setIsCollapsed] = useState(prefersCollapsedMobilePanel);

  return (
    <SettingsSidebarTemplate
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

export default SettingsSidebar;
