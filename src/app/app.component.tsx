import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from 'features/auth';
import { isExperimentalFeatureEnabledForUser } from 'features/experimental-features';
import { AppLoadingProvider, useAppLoading } from 'app/providers/app-loading';
import {
  MobilePageActionsHost,
  MobilePageActionsProvider,
} from 'app/providers/mobile-page-actions';
import { ThemeProvider } from 'app/providers/theme';
import { ToastProvider, UserSocketProvider } from 'shared/providers';
import { FriendsProvider } from 'features/friends';
import { JobNotificationToastHost, NotificationsProvider } from 'features/notifications';
import { TourHost, TourProvider } from 'features/tour';
import { LoadingState } from 'shared/ui';
import { Content } from './components/content/content.component';
import { ErrorBoundary } from './components/error-boundary/error-boundary.component';
import { Setup } from './components/setup/setup.component';
import { SetupBlocked } from './components/setup-blocked/setup-blocked.component';
import { Unreachable } from './components/unreachable/unreachable.component';
import { shouldUseAuthChrome } from './utils/should-use-auth-chrome.util';

function AppContent() {
  const {
    isSystemInitialized,
    isLoading,
    systemStatus,
    allowSetup,
    checkSystemStatus,
    isAuthenticated,
    user,
  } = useAuth();
  const { message: appLoadingMessage } = useAppLoading();
  const location = useLocation();
  const isSettingsPage = location.pathname.startsWith('/settings');
  const isFullWidth =
    location.pathname.includes('/wishlists/') || location.pathname.startsWith('/invite/list/');
  const isAuthPage = shouldUseAuthChrome(location.pathname, isAuthenticated);
  const isBootLoading = isLoading || systemStatus === 'loading';
  const productTutorialEnabled = isExperimentalFeatureEnabledForUser(
    'productTutorial',
    user?.ExperimentalFeatures
  );

  if (systemStatus === 'unreachable' && !isBootLoading) {
    return (
      <Unreachable
        onRetry = {
          checkSystemStatus
        }
      />
    );
  }

  if (!isBootLoading && !isSystemInitialized) {
    if (allowSetup) {
      return <Setup />;
    }

    return <SetupBlocked />;
  }

  if (isBootLoading) {
    return (
      <LoadingState
        message = {
          'Loading...'
        }
        viewport
      />
    );
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
        isAuthenticated && !isAuthPage && productTutorialEnabled ? <TourHost /> : null
      }
      {
        appLoadingMessage ? (
          <LoadingState
            message = {
              appLoadingMessage
            }
            viewport
          />
        ) : null
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
          <AppLoadingProvider>
            <TourProvider>
              <JobNotificationToastHost />
              <ErrorBoundary>
                <AppContent />
              </ErrorBoundary>
            </TourProvider>
          </AppLoadingProvider>
        </BrowserRouter>
      </AppProviders>
    </AuthProvider>
  );
}

export default App;
