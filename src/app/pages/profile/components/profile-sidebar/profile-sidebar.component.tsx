import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileSidebarTemplate } from './profile-sidebar.html';
import { ProfileSidebarProps } from './interfaces/profile-sidebar-props.interface';

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ isAdmin = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ProfileSidebarTemplate
      isAdmin={isAdmin}
      activePath={location.pathname}
      onNavigate={(path) => navigate(path)}
    />
  );
};

export default ProfileSidebar;
