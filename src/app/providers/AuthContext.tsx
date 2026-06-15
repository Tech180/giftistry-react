import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, ApiUser } from 'features/auth';
import { apiClient } from 'api/client';

export type User = ApiUser;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (username?: string, firstName?: string, lastName?: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res && res.User) {
        setUser(res.User);
      } else {
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('giftistry-token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    apiClient.addResponseInterceptor((response) => {
      if (response.status === 401) {
        localStorage.removeItem('giftistry-token');
        setUser(null);
      }
    });
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await authApi.login(email, password);
      if (res && res.Token) {
        localStorage.setItem('giftistry-token', res.Token);
      }
      if (res && res.User) {
        setUser(res.User);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errMsg);
      throw err;
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    setError(null);
    try {
      const res = await authApi.signup(username, email, password, firstName, lastName);
      if (res && res.Token) {
        localStorage.setItem('giftistry-token', res.Token);
      }
      if (res && res.User) {
        setUser(res.User);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Signup failed';
      setError(errMsg);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('giftistry-token');
      setUser(null);
    }
  };

  const updateProfile = async (username?: string, firstName?: string, lastName?: string) => {
    setError(null);
    try {
      const res = await authApi.updateProfile(username, firstName, lastName);
      if (res && res.User) {
        setUser(res.User);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errMsg);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
