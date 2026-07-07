import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'app/providers/theme-context';
import { AuthProvider, useAuth } from 'app/providers/auth-context';
import { ToastProvider } from 'app/providers/toast-context';
import { AppLoadingTemplate, AppSetupTemplate, AppContentTemplate } from './App.html';

function AppContent() {
  const { user, isSystemInitialized, isLoading } = useAuth();
  const location = useLocation();
  const isSettingsPage = location.pathname.startsWith('/settings');
  const isFullWidth = location.pathname.includes('/wishlists/');
  const hasBanner = !!(user && !user.EmailVerified);

  if (isLoading) {
    return <AppLoadingTemplate />;
  }

  if (!isSystemInitialized) {
    return <AppSetupTemplate />;
  }

  return (
    <AppContentTemplate
      isSettingsPage={isSettingsPage}
      hasBanner={hasBanner}
      isFullWidth={isFullWidth}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
