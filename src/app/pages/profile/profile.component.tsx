import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProfileCard } from 'features/auth';
import { SecurityTab } from './tabs/security/security-tab.component';
import { NotificationsTab } from './tabs/notifications/notifications-tab.component';
import { ThemingTab } from './tabs/theming/theming-tab.component';
import { ServerSettingsTab } from './tabs/server/server-settings-tab.component';
import { ProfileTemplate } from './profile.html';
import { useToast } from 'app/providers/toast-context';
import { useAuth } from 'app/providers/auth-context';

export default function Profile() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const isAdmin = !!user?.IsAdmin;

  const routes = (
    <Routes>
      <Route path="/" element={<Navigate to="settings" replace />} />
      <Route path="settings" element={<ProfileCard />} />
      <Route path="security" element={<SecurityTab showToast={showToast} />} />
      <Route path="notifications" element={<NotificationsTab showToast={showToast} />} />
      <Route path="theming" element={<ThemingTab showToast={showToast} />} />
      {isAdmin && <Route path="server" element={<ServerSettingsTab showToast={showToast} />} />}
      <Route path="*" element={<Navigate to="settings" replace />} />
    </Routes>
  );

  return (
    <ProfileTemplate
      routes={routes}
      toasts={[]}
      isAdmin={isAdmin}
    />
  );
}
export { Profile };
