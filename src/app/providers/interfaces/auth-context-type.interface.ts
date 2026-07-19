import { ApiUser } from 'features/auth';

export interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<any>;
  signup: (username: string, email: string | null | undefined, password: string, firstName?: string, lastName?: string) => Promise<any>;
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
  oauthButtonText: string;
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
