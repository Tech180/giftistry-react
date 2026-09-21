import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ApiError, apiClient } from 'core/api/client';
import type { SystemStatusResult } from 'features/system';

import { authApi } from '../api/auth.api';
import type { AuthResponse } from '../interfaces/auth-response.interface';
import { isSessionUnauthorized } from '../utils/is-session-unauthorized.util';
import { AuthContext } from './context';
import { InactivityHost } from './components/inactivity-host/inactivity-host.component';
import { AUTH_TOKEN_STORAGE_KEY } from './constants/storage-keys.constant';
import { useInactivity } from './hooks/use-inactivity';
import type { AiCapabilities } from './interfaces/ai-capabilities.interface';
import type { AuthContextType } from './interfaces/context-type.interface';
import type { User } from './interfaces/user.interface';
import { applySystemStatus } from './utils/apply-system-status.util';
import { getAiCapabilityFlags } from './utils/get-ai-capability-flags.util';

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
  const [globalAiEnabled, setGlobalAiEnabled] = useState(false);
  const [globalWebSearchEnabled, setGlobalWebSearchEnabled] = useState(false);
  const [registrationMode, setRegistrationMode] = useState<'open' | 'invite_only' | 'disabled'>('open');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [capabilities, setCapabilities] = useState<AiCapabilities | undefined>(undefined);
  const logoutRef = useRef<() => void>(() => {});

  const {
    showWarning,
    countdown,
    extendSession,
    cleanupInactivityTimers,
    setShowWarning,
  } = useInactivity({
    user,
    onTimeoutLogout: () => {
      logoutRef.current();
    },
  });

  const clearError = () => {
    setError(null);
  };

  const fetchCurrentUser = async () => {
    if (!localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)) {
      setUser(null);
      setCapabilities(undefined);
      setIsLoading(false);
      return;
    }

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
      if (err instanceof ApiError && isSessionUnauthorized(err.status, { Message: err.message })) {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        setUser(null);
        setCapabilities(undefined);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    setSystemStatus('loading');
    try {
      const res = await apiClient.get<SystemStatusResult>('/api/system/status');
      setSystemStatus('ready');
      const patch = applySystemStatus(res);

      if (patch.isSystemInitialized !== undefined) {
        setIsSystemInitialized(patch.isSystemInitialized);
      }

      if (patch.allowSetup !== undefined) {
        setAllowSetup(patch.allowSetup);
      }

      if (patch.allowPasswordLogin !== undefined) {
        setAllowPasswordLogin(patch.allowPasswordLogin);
      }

      if (patch.requireStrongPasswords !== undefined) {
        setRequireStrongPasswords(patch.requireStrongPasswords);
      }

      if (patch.oauthEnabled !== undefined) {
        setOauthEnabled(patch.oauthEnabled);
      }

      if (patch.globalAiEnabled !== undefined) {
        setGlobalAiEnabled(patch.globalAiEnabled);
      }

      if (patch.globalWebSearchEnabled !== undefined) {
        setGlobalWebSearchEnabled(patch.globalWebSearchEnabled);
      }

      if (patch.registrationMode !== undefined) {
        setRegistrationMode(patch.registrationMode);
      }

      if (patch.maintenanceMode !== undefined) {
        setMaintenanceMode(patch.maintenanceMode);
      }

      if (patch.maintenanceMessage !== undefined) {
        setMaintenanceMessage(patch.maintenanceMessage);
      }
    } catch {
      setSystemStatus('unreachable');
    }
  };

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    setError(null);
    try {
      const res = await authApi.login(username, password);
      if (res && res.Token) {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, res.Token);
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
    lastName?: string,
    inviteToken?: string | null
  ): Promise<AuthResponse> => {
    setError(null);
    try {
      const res = await authApi.signup(username, email, password, firstName, lastName, inviteToken);
      if (res && res.Token) {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, res.Token);
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
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      setUser(null);
      setShowWarning(false);
    }
  };

  logoutRef.current = () => {
    void logout();
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
      const res = await authApi.updateProfile(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        aiEnabled
      );
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

  const { canShowAi, canShowWebSearch, canShowAiSettings, canShowWebSearchSettings } =
    getAiCapabilityFlags({
      globalAiEnabled,
      globalWebSearchEnabled,
      user,
      capabilities,
    });

  useEffect(() => {
    const removeInterceptor = apiClient.addResponseInterceptor((response, json) => {
      if (isSessionUnauthorized(response.status, json)) {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        setUser(null);
      }
    });
    void Promise.all([checkSystemStatus(), fetchCurrentUser()]);
    return () => {
      removeInterceptor();
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
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
    }),
    [
      user,
      isLoading,
      error,
      systemStatus,
      isSystemInitialized,
      allowSetup,
      allowPasswordLogin,
      requireStrongPasswords,
      oauthEnabled,
      globalAiEnabled,
      globalWebSearchEnabled,
      canShowAi,
      canShowAiSettings,
      canShowWebSearch,
      canShowWebSearchSettings,
      registrationMode,
      maintenanceMode,
      maintenanceMessage,
    ]
  );

  return (
    <AuthContext.Provider
      value = {
        value
      }
    >
      {
        children
      }
      <InactivityHost
        isOpen = {
          showWarning
        }
        countdown = {
          countdown
        }
        onExtendSession = {
          extendSession
        }
        onSignOut = {
          logout
        }
      />
    </AuthContext.Provider>
  );
}
