import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppNavigation, AppShell } from 'app/layout';
import { LegacyProfileRedirect, ProtectedRoute, PublicRoute } from 'app/routes';
import { Loading } from '../loading/loading.component';
import type { TemplateProps } from './interfaces/template-props.interface';

const Login = lazy(() => import('../../pages/login/login.component'));
const Register = lazy(() => import('../../pages/register/register.component'));
const Dashboard = lazy(() => import('../../pages/dashboard/dashboard.component'));
const WishlistDetail = lazy(() => import('../../pages/wishlist-detail/wishlist-detail.component'));
const Settings = lazy(() => import('../../pages/settings/settings.component'));
const Friends = lazy(() => import('../../pages/friends/friends.component'));
const InviteAccept = lazy(() => import('../../pages/invite-accept/invite-accept.component'));
const Onboarding = lazy(() => import('../../pages/onboarding/onboarding.component'));
const ChangePassword = lazy(() => import('../../pages/change-password/change-password.component'));
const UserProfile = lazy(() => import('../../pages/user-profile/user-profile.component'));

export const ContentTemplate: React.FC<TemplateProps> = ({
  isSettingsPage,
  isFullWidth,
  isAuthPage,
}) => {
  return (
    <AppShell
      navigation = {
        <AppNavigation />
      }
      isSettingsPage = {
        isSettingsPage
      }
      isFullWidth = {
        isFullWidth
      }
      isAuthPage = {
        isAuthPage
      }
    >
      <Suspense
        fallback = {
          <Loading />
        }
      >
        <Routes>
          <Route
            path = {
              '/'
            }
            element = {
              <Navigate
                to = {
                  '/dashboard'
                }
                replace
              />
            }
          />
          <Route
            path = {
              '/welcome'
            }
            element = {
              <ProtectedRoute
                allowOnboarding
              >
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path = {
              '/change-password'
            }
            element = {
              <ProtectedRoute
                allowPasswordChange
              >
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path = {
              '/login'
            }
            element = {
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path = {
              '/register'
            }
            element = {
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path = {
              '/dashboard'
            }
            element = {
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path = {
              '/wishlists/:listId'
            }
            element = {
              <ProtectedRoute>
                <WishlistDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path = {
              '/friends'
            }
            element = {
              <Navigate
                to = {
                  '/friends/current'
                }
                replace
              />
            }
          />
          <Route
            path = {
              '/friends/:tab'
            }
            element = {
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            }
          />
          <Route
            path = {
              '/users/:userId'
            }
            element = {
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path = {
              '/invite/list/:token'
            }
            element = {
              <InviteAccept />
            }
          />
          <Route
            path = {
              '/profile/*'
            }
            element = {
              <LegacyProfileRedirect />
            }
          />
          <Route
            path = {
              '/settings/*'
            }
            element = {
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path = {
              '*'
            }
            element = {
              <Navigate
                to = {
                  '/'
                }
                replace
              />
            }
          />
        </Routes>
      </Suspense>
    </AppShell>
  );
};
