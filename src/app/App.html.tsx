import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell, AppNavigation } from 'app/layout';
import { Login, Register, Dashboard, WishlistDetail, Settings, VerifyEmail, Setup, FriendsPage, InviteAcceptPage } from 'app/pages';
import { VerificationBanner } from 'features/auth';
import { ProtectedRoute, PublicRoute } from 'app/routes/protected-route.component';
import { LegacyProfileRedirect } from 'app/routes/legacy-profile-redirect.component';
import { AppContentTemplateProps } from './interfaces/app-content-template-props.interface';
import styles from './App.module.css';

export const AppLoadingTemplate: React.FC = () => (
  <div className={styles['loading-container']}>
    <div className={styles['loading-spinner']} />
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
  hasBanner,
  isFullWidth,
}) => (
  <AppShell
    navigation={<AppNavigation />}
    banner={<VerificationBanner />}
    isSettingsPage={isSettingsPage}
    hasBanner={hasBanner}
    isFullWidth={isFullWidth}
  >
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
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
