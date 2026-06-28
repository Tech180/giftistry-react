import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProfileCard } from 'features/auth';
import { SecurityTab } from './tabs/security/security-tab.component';
import { NotificationsTab } from './tabs/notifications/notifications-tab.component';
import { ThemingTab } from './tabs/theming/theming-tab.component';
import { ProfileTemplate } from './profile.html';

export interface ToastInfo {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Profile() {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const routes = (
    <Routes>
      <Route path="/" element={<Navigate to="settings" replace />} />
      <Route path="settings" element={<ProfileCard />} />
      <Route path="security" element={<SecurityTab showToast={showToast} />} />
      <Route path="notifications" element={<NotificationsTab showToast={showToast} />} />
      <Route path="theming" element={<ThemingTab showToast={showToast} />} />
      <Route path="*" element={<Navigate to="settings" replace />} />
    </Routes>
  );

  return (
    <ProfileTemplate
      routes={routes}
      toasts={toasts}
    />
  );
}
export { Profile };
