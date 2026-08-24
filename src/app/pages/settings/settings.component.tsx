import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AdminRoute } from 'app/routes/admin-route.component';
import { OwnerRoute } from 'app/routes/owner-route.component';
import type { BackgroundJobsScope } from 'features/jobs';
import { SettingsTemplate } from './settings.html';
import { useToast } from 'app/providers/toast-context';
import { useAuth } from 'app/providers/auth-context';
import appStyles from 'app/App.module.css';

const SettingsTabFallback: React.FC = () => (
  <div className={appStyles['loading-container']}>
    <div className={appStyles['loading-spinner']} />
  </div>
);

const ProfileCard = lazy(() =>
  import('features/auth/components/profile-card/profile-card.component').then((module) => ({
    default: module.ProfileCard,
  }))
);
const SecurityTab = lazy(() => import('./tabs/security/security-tab.component'));
const NotificationsTab = lazy(() => import('./tabs/notifications/notifications-tab.component'));
const ThemingTab = lazy(() => import('./tabs/theming/theming-tab.component'));
const AdminOverviewTab = lazy(() =>
  import('./tabs/admin/overview/admin-overview-tab.component').then((module) => ({
    default: module.AdminOverviewTab,
  }))
);
const AdminUsersTab = lazy(() =>
  import('./tabs/admin/users/admin-users-tab.component').then((module) => ({
    default: module.AdminUsersTab,
  }))
);
const AdminUserDetailTab = lazy(() =>
  import('./tabs/admin/users/admin-user-detail-tab.component').then((module) => ({
    default: module.AdminUserDetailTab,
  }))
);
const AdminSitePolicyTab = lazy(() =>
  import('./tabs/admin/site/admin-site-policy-tab.component').then((module) => ({
    default: module.AdminSitePolicyTab,
  }))
);
const AdminModerationTab = lazy(() =>
  import('./tabs/admin/moderation/admin-moderation-tab.component').then((module) => ({
    default: module.AdminModerationTab,
  }))
);
const AdminAuditTab = lazy(() =>
  import('./tabs/admin/audit/admin-audit-tab.component').then((module) => ({
    default: module.AdminAuditTab,
  }))
);
const ServerSettingsTab = lazy(() => import('./tabs/server/server-settings-tab.component'));

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
    <Suspense fallback={<SettingsTabFallback />}>
      <Routes>
        <Route index element={<Navigate to="account" replace />} />
        <Route path="account" element={<ProfileCard />} />
        <Route path="security" element={<SecurityTab showToast={showToast} />} />
        <Route path="notifications" element={<NotificationsTab showToast={showToast} />} />
        <Route path="theming" element={<ThemingTab showToast={showToast} />} />
        <Route path="server" element={<Navigate to="/settings/admin/server" replace />} />
        <Route path="admin" element={withAdmin(<AdminOverviewTab showToast={showToast} />)} />
        <Route path="admin/users" element={withAdmin(<AdminUsersTab showToast={showToast} />)} />
        <Route
          path="admin/users/:userId"
          element={withAdmin(<AdminUserDetailTab showToast={showToast} />)}
        />
        <Route path="admin/site" element={withAdmin(<AdminSitePolicyTab showToast={showToast} />)} />
        <Route
          path="admin/moderation"
          element={withAdmin(<AdminModerationTab showToast={showToast} />)}
        />
        <Route path="admin/audit" element={withAdmin(<AdminAuditTab showToast={showToast} />)} />
        <Route path="admin/server" element={withOwner(<ServerSettingsTab showToast={showToast} />)} />
        <Route path="*" element={<Navigate to="/settings/account" replace />} />
      </Routes>
    </Suspense>
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
