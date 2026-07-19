import React, { createContext, useContext, useEffect, useState, ReactNode, useRef, useMemo } from 'react';
import { authApi } from 'features/auth';
import { InactivityModal } from 'features/auth/components/inactivity-modal/inactivity-modal.component';
import { apiClient } from 'core/api/client';
import { AuthContextType } from './interfaces/auth-context-type.interface';
import { User } from './interfaces/user.interface';
import { SystemStatusResult } from 'features/system/api/system.api';

export type { User } from './interfaces/user.interface';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSystemInitialized, setIsSystemInitialized] = useState(true);
  const [systemStatus, setSystemStatus] = useState<'loading' | 'ready' | 'unreachable'>('loading');
  const [allowSetup, setAllowSetup] = useState(false);
  const [allowPasswordLogin, setAllowPasswordLogin] = useState(true);
  const [requireStrongPasswords, setRequireStrongPasswords] = useState(true);
  const [oauthEnabled, setOauthEnabled] = useState(false);
  const [oauthButtonText, setOauthButtonText] = useState('Sign in with SSO');
  const [globalAiEnabled, setGlobalAiEnabled] = useState(false);
  const [globalWebSearchEnabled, setGlobalWebSearchEnabled] = useState(false);
  const [registrationMode, setRegistrationMode] = useState<'open' | 'invite_only' | 'disabled'>('open');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');

  const [capabilities, setCapabilities] = useState<{ CanUseAi: boolean; CanUseWebSearch: boolean } | undefined>(undefined);

  // Inactivity state
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const activityTimeoutRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  const clearError = () => setError(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res && res.User) {
        setUser(res.User);
        if (res.Capabilities) {
          setCapabilities(res.Capabilities);
        }
      } else {
        setUser(null);
        setCapabilities(undefined);
      }
    } catch (err) {
      localStorage.removeItem('giftistry-token');
      setUser(null);
      setCapabilities(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    setSystemStatus('loading');
    try {
      const res = await apiClient.get<SystemStatusResult>('/api/system/status');
      setSystemStatus('ready');
      if (res && res.Initialized !== undefined) {
        setIsSystemInitialized(Boolean(res.Initialized));
      }
      if (res?.AllowSetup !== undefined) {
        setAllowSetup(Boolean(res.AllowSetup));
      }
      if (res?.AllowPasswordLogin !== undefined) {
        setAllowPasswordLogin(Boolean(res.AllowPasswordLogin));
      }
      if (res?.RequireStrongPasswords !== undefined) {
        setRequireStrongPasswords(Boolean(res.RequireStrongPasswords));
      }
      if (res?.OAuthEnabled !== undefined) {
        setOauthEnabled(Boolean(res.OAuthEnabled));
      }
      if (res?.OAuthButtonText) {
        setOauthButtonText(res.OAuthButtonText);
      }
      if (res && res.AiEnabled !== undefined) {
        setGlobalAiEnabled(Boolean(res.AiEnabled));
      }
      if (res && res.AiWebSearchEnabled !== undefined) {
        setGlobalWebSearchEnabled(Boolean(res.AiWebSearchEnabled));
      }
      if (res?.RegistrationMode) {
        setRegistrationMode(res.RegistrationMode);
      }
      if (res?.MaintenanceMode !== undefined) {
        setMaintenanceMode(Boolean(res.MaintenanceMode));
      }
      if (res?.MaintenanceMessage) {
        setMaintenanceMessage(res.MaintenanceMessage);
      }
    } catch (err) {
      setSystemStatus('unreachable');
    }
  };

  const login = async (username: string, password: string) => {
    setError(null);
    try {
      const res = await authApi.login(username, password);
      if (res && res.Token) {
        localStorage.setItem('giftistry-token', res.Token);
      }
      await fetchCurrentUser();
      return res;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errMsg);
      throw err;
    }
  };

  const signup = async (
    username: string,
    email: string | null | undefined,
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
      await fetchCurrentUser();
      return res;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Signup failed';
      setError(errMsg);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    cleanupInactivityTimers();
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('giftistry-token');
      setUser(null);
      setShowWarning(false);
    }
  };

  const updateProfile = async (
    username?: string,
    firstName?: string,
    lastName?: string,
    bio?: string,
    theme?: string,
    avatar?: string | null,
    aiEnabled?: boolean
  ) => {
    setError(null);
    try {
      const res = await authApi.updateProfile(username, firstName, lastName, bio, theme, avatar, aiEnabled);
      if (res && res.User) {
        setUser((prev) => (prev ? { ...prev, ...res.User } : res.User));
        await fetchCurrentUser();
        return res.User;
      }
      return null;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errMsg);
      throw err;
    }
  };

  const updateAiEnabled = async (aiEnabled: boolean) => {
    setError(null);
    try {
      const res = await authApi.updateProfile(undefined, undefined, undefined, undefined, undefined, undefined, aiEnabled);
      if (res && res.User) {
        setUser((prev) => (prev ? { ...prev, ...res.User } : res.User));
        await fetchCurrentUser();
        return res.User;
      }
      return null;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to update AI preference';
      setError(errMsg);
      throw err;
    }
  };

  const updateWebSearchEnabled = async (webSearchEnabled: boolean) => {
    setError(null);
    try {
      const res = await authApi.updateProfile(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        webSearchEnabled
      );
      if (res && res.User) {
        setUser((prev) => (prev ? { ...prev, ...res.User } : res.User));
        await fetchCurrentUser();
        return res.User;
      }
      return null;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to update web search preference';
      setError(errMsg);
      throw err;
    }
  };

  const canShowAi = useMemo(() => capabilities?.CanUseAi ?? false, [capabilities]);
  const canShowAiSettings = useMemo(() => capabilities?.CanUseAi ?? false, [capabilities]);
  const canShowWebSearch = useMemo(() => capabilities?.CanUseWebSearch ?? false, [capabilities]);
  const canShowWebSearchSettings = useMemo(() => capabilities?.CanUseWebSearch ?? false, [capabilities]);

  // Inactivity Logic
  const resetInactivityTimer = () => {
    if (!user) return;
    
    // Clear existing main inactivity timer
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    // If warning is currently showing, don't auto-reset it silently (user must click to extend)
    if (showWarning) return;

    const timeoutDuration = localStorage.getItem('dev-inactivity-timeout')
      ? parseInt(localStorage.getItem('dev-inactivity-timeout') || '7200000', 10)
      : 2 * 60 * 60 * 1000; // 2 hours default

    activityTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(60);
    }, timeoutDuration);
  };

  const extendSession = () => {
    setShowWarning(false);
    setCountdown(60);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    resetInactivityTimer();
  };

  const cleanupInactivityTimers = () => {
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
      activityTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  // Listen for user activity
  useEffect(() => {
    if (user) {
      resetInactivityTimer();
      const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
      const handleActivity = () => resetInactivityTimer();

      events.forEach(event => window.addEventListener(event, handleActivity));
      return () => {
        events.forEach(event => window.removeEventListener(event, handleActivity));
        cleanupInactivityTimers();
      };
    } else {
      cleanupInactivityTimers();
      setShowWarning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, showWarning]);

  // Countdown timer for warning modal
  useEffect(() => {
    if (showWarning) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current!);
            countdownIntervalRef.current = null;
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showWarning]);

  useEffect(() => {
    const removeInterceptor = apiClient.addResponseInterceptor((response) => {
      if (response.status === 401) {
        localStorage.removeItem('giftistry-token');
        setUser(null);
      }
    });
    checkSystemStatus().then(() => {
      fetchCurrentUser();
    });
    return () => {
      removeInterceptor();
    };
  }, []);

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
        updateAiEnabled,
        updateWebSearchEnabled,
        error,
        clearError,
        refreshUser: fetchCurrentUser,
        systemStatus,
        isSystemInitialized,
        allowSetup,
        allowPasswordLogin,
        requireStrongPasswords,
        oauthEnabled,
        oauthButtonText,
        globalAiEnabled,
        globalWebSearchEnabled,
        canShowAi,
        canShowAiSettings,
        canShowWebSearch,
        canShowWebSearchSettings,
        registrationMode,
        maintenanceMode,
        maintenanceMessage,
        checkSystemStatus,
      }}
    >
      {children}
      
      <InactivityModal
        isOpen={showWarning}
        countdown={countdown}
        onExtendSession={extendSession}
        onSignOut={logout}
      />
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
