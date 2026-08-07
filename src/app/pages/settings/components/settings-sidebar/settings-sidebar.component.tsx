import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SettingsSidebarTemplate } from './settings-sidebar.html';
import { SettingsSidebarProps } from './interfaces/settings-sidebar-props.interface';

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  isAdmin = false,
  isOwner = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SettingsSidebarTemplate
      isAdmin={isAdmin}
      isOwner={isOwner}
      activePath={location.pathname}
      onNavigate={(path) => navigate(path)}
    />
  );
};

export default SettingsSidebar;
