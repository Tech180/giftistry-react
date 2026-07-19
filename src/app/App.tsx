import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'app/providers/theme-provider';
import { AuthProvider, useAuth } from 'app/providers/auth-context';
import { ToastProvider } from 'app/providers/toast-context';
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
  const isFullWidth = location.pathname.includes('/wishlists/');
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/welcome';

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

import { UserSocketProvider } from 'app/providers/user-socket-context';

function App() {
  return (
    <AuthProvider>
      <UserSocketProvider>
        <ThemeProvider>
          <ToastProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </ToastProvider>
        </ThemeProvider>
      </UserSocketProvider>
    </AuthProvider>
  );
}

export default App;
