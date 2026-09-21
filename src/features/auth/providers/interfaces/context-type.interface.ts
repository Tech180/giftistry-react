import type { ApiUser } from '../../interfaces/api-user.interface';
import type { AuthResponse } from '../../interfaces/auth-response.interface';

export interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<AuthResponse>;
  signup: (
    username: string,
    email: string | null | undefined,
    password: string,
    firstName?: string,
    lastName?: string,
    inviteToken?: string | null
  ) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (
    username?: string,
    firstName?: string,
    lastName?: string,
    bio?: string,
    theme?: string,
    avatar?: string | null,
    aiEnabled?: boolean
  ) => Promise<ApiUser | null>;
  updateAiEnabled: (aiEnabled: boolean) => Promise<ApiUser | null>;
  updateWebSearchEnabled: (webSearchEnabled: boolean) => Promise<ApiUser | null>;
  error: string | null;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  systemStatus: 'loading' | 'ready' | 'unreachable';
  isSystemInitialized: boolean;
  allowSetup: boolean;
  allowPasswordLogin: boolean;
  requireStrongPasswords: boolean;
  oauthEnabled: boolean;
  globalAiEnabled: boolean;
  globalWebSearchEnabled: boolean;
  canShowAi: boolean;
  canShowAiSettings: boolean;
  canShowWebSearch: boolean;
  canShowWebSearchSettings: boolean;
  registrationMode: 'open' | 'invite_only' | 'disabled';
  maintenanceMode: boolean;
  maintenanceMessage: string;
  checkSystemStatus: () => Promise<void>;
}
