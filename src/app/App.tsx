import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'app/providers/theme-provider';
import { AuthProvider, useAuth } from 'app/providers/auth-context';
import { ToastProvider } from 'app/providers/toast-context';
import { UserSocketProvider } from 'app/providers/user-socket-context';
import { NotificationsProvider } from 'app/providers/notifications-context';
import { JobNotificationToastHost } from 'features/notifications';
import {
  MobilePageActionsProvider,
  MobilePageActionsHost,
} from 'app/providers/mobile-page-actions-context';
import { AppLoadingTemplate, AppSetupTemplate, AppContentTemplate, AppUnreachableTemplate, AppSetupBlockedTemplate } from './App.html';

function AppContent() {
  const {
    isSystemInitialized,
    isLoading,
    systemStatus,
    allowSetup,
    checkSystemStatus,
  } = useAuth();
  const location = useLocation();
  const isSettingsPage = location.pathname.startsWith('/settings');
  const isFullWidth =
    location.pathname.includes('/wishlists/') || location.pathname.startsWith('/invite/list/');
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/welcome' ||
    location.pathname === '/change-password';

  if (isLoading || systemStatus === 'loading') {
    return <AppLoadingTemplate />;
  }

  if (systemStatus === 'unreachable') {
    return <AppUnreachableTemplate onRetry={checkSystemStatus} />;
  }

  if (!isSystemInitialized) {
    if (allowSetup) {
      return <AppSetupTemplate />;
    }
    return <AppSetupBlockedTemplate />;
  }

  return (
    <MobilePageActionsProvider>
      <AppContentTemplate
        isSettingsPage={isSettingsPage}
        isFullWidth={isFullWidth}
        isAuthPage={isAuthPage}
      />
      <MobilePageActionsHost />
    </MobilePageActionsProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserSocketProvider>
        <NotificationsProvider>
          <ThemeProvider>
            <ToastProvider>
              <BrowserRouter>
                <JobNotificationToastHost />
                <AppContent />
              </BrowserRouter>
            </ToastProvider>
          </ThemeProvider>
        </NotificationsProvider>
      </UserSocketProvider>
    </AuthProvider>
  );
}

export default App;
