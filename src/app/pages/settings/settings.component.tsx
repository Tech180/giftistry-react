import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AdminRoute } from 'app/routes/admin-route.component';
import { OwnerRoute } from 'app/routes/owner-route.component';
import { AdminOverviewTab } from './tabs/admin/overview/admin-overview-tab.component';
import { AdminUsersTab } from './tabs/admin/users/admin-users-tab.component';
import { AdminUserDetailTab } from './tabs/admin/users/admin-user-detail-tab.component';
import { AdminSitePolicyTab } from './tabs/admin/site/admin-site-policy-tab.component';
import { AdminModerationTab } from './tabs/admin/moderation/admin-moderation-tab.component';
import { AdminAuditTab } from './tabs/admin/audit/admin-audit-tab.component';
import { ServerSettingsTab } from './tabs/server/server-settings-tab.component';
import { ProfileCard } from 'features/auth';
import { SecurityTab } from './tabs/security/security-tab.component';
import { NotificationsTab } from './tabs/notifications/notifications-tab.component';
import { ThemingTab } from './tabs/theming/theming-tab.component';
import type { BackgroundJobsScope } from 'features/jobs';
import { SettingsTemplate } from './settings.html';
import { useToast } from 'app/providers/toast-context';
import { useAuth } from 'app/providers/auth-context';

function withAdmin(children: React.ReactNode) {
  return <AdminRoute>{children}</AdminRoute>;
}

function withOwner(children: React.ReactNode) {
  return <OwnerRoute>{children}</OwnerRoute>;
}

function processesRailScopeForPath(pathname: string): BackgroundJobsScope | null {
  if (pathname === '/settings/account' || pathname === '/settings/account/') {
    return 'mine';
  }
  if (pathname === '/settings/admin' || pathname === '/settings/admin/') {
    return 'admin';
  }
  return null;
}

export default function Settings() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = !!user?.IsAdmin;
  const isOwner = !!user?.IsOwner;
  const processesRailScope = processesRailScopeForPath(location.pathname);

  const routes = (
    <Routes>
      <Route index element={<Navigate to="account" replace />} />
      <Route path="account" element={<ProfileCard />} />
      <Route path="security" element={<SecurityTab showToast={showToast} />} />
      <Route path="notifications" element={<NotificationsTab showToast={showToast} />} />
      <Route path="theming" element={<ThemingTab showToast={showToast} />} />
      <Route path="server" element={<Navigate to="/settings/admin/server" replace />} />
      <Route path="admin" element={withAdmin(<AdminOverviewTab showToast={showToast} />)} />
      <Route path="admin/users" element={withAdmin(<AdminUsersTab showToast={showToast} />)} />
      <Route path="admin/users/:userId" element={withAdmin(<AdminUserDetailTab showToast={showToast} />)} />
      <Route path="admin/site" element={withAdmin(<AdminSitePolicyTab showToast={showToast} />)} />
      <Route path="admin/moderation" element={withAdmin(<AdminModerationTab showToast={showToast} />)} />
      <Route path="admin/audit" element={withAdmin(<AdminAuditTab showToast={showToast} />)} />
      <Route path="admin/server" element={withOwner(<ServerSettingsTab showToast={showToast} />)} />
      <Route path="*" element={<Navigate to="/settings/account" replace />} />
    </Routes>
  );

  return (
    <SettingsTemplate
      routes={routes}
      toasts={[]}
      isAdmin={isAdmin}
      isOwner={isOwner}
      processesRailScope={processesRailScope}
      onProcessesError={(message) => showToast(message, 'error')}
    />
  );
}
export { Settings };
