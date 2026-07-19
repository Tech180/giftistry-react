import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { AppShell, AppNavigation } from 'app/layout';
import { Login, Register, Dashboard, WishlistDetail, Settings, Setup, FriendsPage, InviteAcceptPage, Onboarding } from 'app/pages';
import { Button } from 'shared/ui';
import { ProtectedRoute, PublicRoute } from 'app/routes/protected-route.component';
import { LegacyProfileRedirect } from 'app/routes/legacy-profile-redirect.component';
import { AppContentTemplateProps } from './interfaces/app-content-template-props.interface';
import styles from './App.module.css';

export const AppLoadingTemplate: React.FC = () => (
  <div className={styles['loading-container']}>
    <div className={styles['loading-spinner']} />
  </div>
);

interface AppUnreachableTemplateProps {
  onRetry: () => void;
}

export const AppUnreachableTemplate: React.FC<AppUnreachableTemplateProps> = ({ onRetry }) => (
  <div className={styles['loading-container']}>
    <div className={styles['status-panel']}>
      <h1 className={styles['status-title']}>Cannot reach server</h1>
      <p className={styles['status-message']}>
        Giftistry could not connect to the API. Check that the backend is running and reachable from this browser.
      </p>
      <Button variant="primary" leftIcon={<RefreshCw size={16} />} onClick={() => void onRetry()}>
        Retry
      </Button>
    </div>
  </div>
);

export const AppSetupBlockedTemplate: React.FC = () => (
  <div className={styles['loading-container']}>
    <div className={styles['status-panel']}>
      <h1 className={styles['status-title']}>Setup unavailable</h1>
      <p className={styles['status-message']}>
        This server has not been initialized and first-run setup is disabled. Contact your administrator.
      </p>
    </div>
  </div>
);

export const AppSetupTemplate: React.FC = () => (
  <Routes>
    <Route path="/setup" element={<Setup />} />
    <Route path="*" element={<Navigate to="/setup" replace />} />
  </Routes>
);

export const AppContentTemplate: React.FC<AppContentTemplateProps> = ({
  isSettingsPage,
  isFullWidth,
  isAuthPage,
}) => (
  <AppShell
    navigation={<AppNavigation />}
    isSettingsPage={isSettingsPage}
    isFullWidth={isFullWidth}
    isAuthPage={isAuthPage}
  >
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/welcome"
        element={
          <ProtectedRoute allowOnboarding>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlists/:listId"
        element={
          <ProtectedRoute>
            <WishlistDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends"
        element={<Navigate to="/friends/current" replace />}
      />
      <Route
        path="/friends/:tab"
        element={
          <ProtectedRoute>
            <FriendsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invite/list/:token"
        element={
          <ProtectedRoute>
            <InviteAcceptPage />
          </ProtectedRoute>
        }
      />
      <Route path="/profile/*" element={<LegacyProfileRedirect />} />
      <Route
        path="/settings/*"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AppShell>
);
