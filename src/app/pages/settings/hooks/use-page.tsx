import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Loading } from 'app/components/loading/loading.component';
import { AdminRoute, OwnerRoute } from 'app/routes';
import { useAuth } from 'features/auth';
import { useToast } from 'shared/providers/toast';
import type { UsePageResult } from '../interfaces/use-page-result.interface';
import { processesRailScopeForPath } from '../utils/processes-rail-scope-for-path.util';

const SectionFallback = Loading;

// Account
const Account = lazy(() => import('../sections/account/account/account.component'));
const Security = lazy(() => import('../sections/account/security/security.component'));
const Notifications = lazy(() => import('../sections/account/notifications/notifications.component'));
const Theming = lazy(() => import('../sections/account/theming/theming.component'));

// Administration (URL prefix: admin)
const Overview = lazy(() =>
  import('../sections/administration/overview/overview.component').then((module) => ({
    default: module.Overview,
  })),
);
const Users = lazy(() =>
  import('../sections/administration/users/users.component').then((module) => ({
    default: module.Users,
  })),
);
const Detail = lazy(() =>
  import('../sections/administration/users/components/detail/detail.component').then((module) => ({
    default: module.Detail,
  })),
);
const Site = lazy(() =>
  import('../sections/administration/site/site.component').then((module) => ({
    default: module.Site,
  })),
);
const Moderation = lazy(() =>
  import('../sections/administration/moderation/moderation.component').then((module) => ({
    default: module.Moderation,
  })),
);
const Audit = lazy(() =>
  import('../sections/administration/audit/audit.component').then((module) => ({
    default: module.Audit,
  })),
);
const Server = lazy(() => import('../sections/administration/server/server.component'));

function withAdmin(children: React.ReactNode) {
  return <AdminRoute>{children}</AdminRoute>;
}

function withOwner(children: React.ReactNode) {
  return <OwnerRoute>{children}</OwnerRoute>;
}

export function usePage(): UsePageResult {
  const { showToast } = useToast();
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = !!user?.IsAdmin;
  const isOwner = !!user?.IsOwner;
  const processesRailScope = processesRailScopeForPath(location.pathname);

  const routes = (
    <Suspense fallback={<SectionFallback />}>
      <Routes>
        <Route index element={<Navigate to="account" replace />} />
        {/* Account */}
        <Route path="account" element={<Account />} />
        <Route path="security" element={<Security showToast={showToast} />} />
        <Route path="notifications" element={<Notifications showToast={showToast} />} />
        <Route path="theming" element={<Theming showToast={showToast} />} />
        {/* Administration (URL prefix: admin) */}
        <Route path="server" element={<Navigate to="/settings/admin/server" replace />} />
        <Route path="admin" element={withAdmin(<Overview showToast={showToast} />)} />
        <Route path="admin/users" element={withAdmin(<Users showToast={showToast} />)} />
        <Route
          path="admin/users/:userId"
          element={withAdmin(<Detail showToast={showToast} />)}
        />
        <Route path="admin/site" element={withAdmin(<Site showToast={showToast} />)} />
        <Route
          path="admin/moderation"
          element={withAdmin(<Moderation showToast={showToast} />)}
        />
        <Route path="admin/audit" element={withAdmin(<Audit showToast={showToast} />)} />
        <Route path="admin/server" element={withOwner(<Server showToast={showToast} />)} />
        <Route path="*" element={<Navigate to="/settings/account" replace />} />
      </Routes>
    </Suspense>
  );

  return {
    routes,
    toasts: [],
    isAdmin,
    isOwner,
    processesRailScope,
    onProcessesError: (message) => showToast(message, 'error'),
  };
}
