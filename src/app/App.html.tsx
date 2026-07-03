import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell, AppNavigation } from 'app/layout';
import { Login, Register, Dashboard, WishlistDetail, Profile, VerifyEmail, Setup } from 'app/pages';
import { VerificationBanner } from 'features/auth';
import { ProtectedRoute, PublicRoute } from 'app/routes/protected-route.component';
import { AppContentTemplateProps } from './interfaces/app-content-template-props.interface';
import styles from './App.module.css';

export const AppLoadingTemplate: React.FC = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.loadingSpinner} />
  </div>
);

export const AppSetupTemplate: React.FC = () => (
  <Routes>
    <Route path="/setup" element={<Setup />} />
    <Route path="*" element={<Navigate to="/setup" replace />} />
  </Routes>
);

export const AppContentTemplate: React.FC<AppContentTemplateProps> = ({
  isProfilePage,
  hasBanner,
}) => (
  <AppShell
    navigation={<AppNavigation />}
    banner={<VerificationBanner />}
    isProfilePage={isProfilePage}
    hasBanner={hasBanner}
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
        path="/profile/*"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AppShell>
);
