import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'app/providers/theme-context';
import { AuthProvider, useAuth } from 'app/providers/auth-context';
import { Navigation } from 'shared/ui';
import { Login, Register, Dashboard, WishlistDetail, Profile } from 'pages';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid var(--border)',
          borderBottomColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'rotation 0.6s linear infinite'
        }} />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid var(--border)',
          borderBottomColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'rotation 0.6s linear infinite'
        }} />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

function AppContent() {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith('/profile');

  return (
    <div className="app-container">
      <Navigation />
      <main className={`${isProfilePage ? 'profile-main-content' : 'main-content'} animate-fade-in`}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
