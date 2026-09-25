import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from 'features/auth';
import {
  MobilePageActionsHost,
  MobilePageActionsProvider,
} from 'app/providers/mobile-page-actions';
import { ThemeProvider } from 'app/providers/theme';
import { ToastProvider, UserSocketProvider } from 'shared/providers';
import { FriendsProvider } from 'features/friends';
import { JobNotificationToastHost, NotificationsProvider } from 'features/notifications';
import { TourHost, TourProvider } from 'features/tour';
import { Content } from './components/content/content.component';
import { ErrorBoundary } from './components/error-boundary/error-boundary.component';
import { Loading } from './components/loading/loading.component';
import { Setup } from './components/setup/setup.component';
import { SetupBlocked } from './components/setup-blocked/setup-blocked.component';
import { Unreachable } from './components/unreachable/unreachable.component';

function AppContent() {
  const {
    isSystemInitialized,
    isLoading,
    systemStatus,
    allowSetup,
    checkSystemStatus,
    isAuthenticated,
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
    return <Loading />;
  }

  if (systemStatus === 'unreachable') {
    return (
      <Unreachable
        onRetry = {
          checkSystemStatus
        }
      />
    );
  }

  if (!isSystemInitialized) {
    if (allowSetup) {
      return <Setup />;
    }

    return <SetupBlocked />;
  }

  return (
    <MobilePageActionsProvider>
      <Content
        isSettingsPage = {
          isSettingsPage
        }
        isFullWidth = {
          isFullWidth
        }
        isAuthPage = {
          isAuthPage
        }
      />
      <MobilePageActionsHost />
      {
        isAuthenticated && !isAuthPage ? <TourHost /> : null
      }
    </MobilePageActionsProvider>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  return (
    <UserSocketProvider
      isAuthenticated = {
        isAuthenticated
      }
      userId = {
        user?.Id
      }
    >
      <NotificationsProvider>
        <FriendsProvider>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </FriendsProvider>
      </NotificationsProvider>
    </UserSocketProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProviders>
        <BrowserRouter
          useTransitions = {
            false
          }
        >
          <TourProvider>
            <JobNotificationToastHost />
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </TourProvider>
        </BrowserRouter>
      </AppProviders>
    </AuthProvider>
  );
}

export default App;
